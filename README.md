# Progetto-PA - Tic Tac Toe Backend

## Descrizione del progetto
Questo progetto implementa un backend per il gioco Tic Tac Toe, utilizzando tecnologie come Express e Sequelize. Il sistema supporta partite tra giocatori umani o contro l'IA, con funzionalità avanzate come l'autenticazione tramite JWT, sistema di token e generazione di report.

## Tecnologie utilizzate 
- Node.js
- Typescript
- Express
- Sequelize (ORM)
- SQL server (database)
- JWT per autenticazione (usando RS256)
- PDFKit per generazione di report PDF

## Caratteristiche principali 
1. **Autenticazione e Autorizzazione**
   - Registrazione utente e login
   - Autenticazione JWT con chiavi RS256
   - Ruoli utente ( user o admin)
2. **Gestione del gioco**
   - Creazione di nuove partite (user VS user o VS IA)
   - Esecuzione di mosse
   - Controllo dello stato del gioco
   - Abbandono della partita
3. **Sistema di token**
   - Addebito di token per azioni di gioco
   - Ricarica del saldo token (solo per admin)
4. **Generazione di report**
   - Report in formato PDF o JSON
   - Filtro per periodo temporale
5. **Leaderboard**
   - Classifica globale dei giocatori
   - Oridnamanento a scelta

## ESEMPI DI CHIAMATE API
| TIPO | ROTTA | JWT | 
| ---- | ----- | --- | 
| POST | /register | Si |
| POST | /login | Si | 
| POST | /match | Si | 
| POST | /move | Si |
| POST | /abandon | Si |
| GET | /status | Si |
| GET | /moves | Si |
| GET | /leaderBoard | No |
| POST | /recharge | Si |
| GET | /credit | Si |


``` - /REGISTER ``` :
Permette di registrare un nuovo utente, specificandone l'email, la password e il ruolo

```json
{
    "user": {
        "id": 6,
        "email": "user6@example.com",
        "password": "$2b$10$KPXmxLrIkaFrPt5lgoPsguQ35e2O5GHXvAGaE/AUdI4qBPasnCKTe",
        "credit": 10,
        "role": "user",
        "matchId": null,
        "matchesWon": 0,
        "matchesLost": 0,
        "matchesWonByAbandon": 0,
        "matchesLostByAbandon": 0,
        "matchesWonVsAI": 0,
        "matchesLostVsAI": 0,
        "createdAt": "2024-07-01T16:01:28.789Z",
        "updatedAt": "2024-07-01T16:01:28.789Z",
        "MatchId": null
    }
```


``` - /LOGIN ``` : 
```json
{
    "user": {
        "id": 1,
        "email": "user1@example.com",
        "password": "$2b$10$yhL33V0K8RWF7EpFDSIwSOWmQGt4Ti.seJiGmVlP9PVBKAPUuO2ge",
        "credit": 8,
        "role": "user",
        "matchId": null,
        "matchesWon": 1,
        "matchesLost": 0,
        "matchesWonByAbandon": 0,
        "matchesLostByAbandon": 0,
        "matchesWonVsAI": 0,
        "matchesLostVsAI": 0,
        "createdAt": "2024-06-29T15:49:19.180Z",
        "updatedAt": "2024-07-01T16:35:22.349Z",
        "MatchId": null
    }
```

```- /MATCH ``` :
Permette di creare una nuova partita, specificando il tipo di giocatori, e-mail dell'avversario (solo nel caso di partita user vs user) e l'impostazione del tempo per effetturare una mossa

```json
{
    "message": "Match created successfully.",
    "match": {
        "board": "---------",
        "id": 32,
        "isAgainstAI": false,
        "status": "ACTIVE",
        "currentPlayerId": 1,
        "player1Id": 1,
        "player2Id": 1,
        "maxMoveTime": null,
        "updatedAt": "2024-07-01T16:36:23.296Z",
        "createdAt": "2024-07-01T16:36:23.296Z",
        "winnerId": null,
        "lastMoveAt": null
    }
}
```

``` - /MOVE ``` : 
Permette di effettuare una mossa in una partita verificando se è ammissibile o meno e andando a sottrarre il numero di token:
  - 0.45 all'atto della creazione se user vs user
  - 0.75 se user VS IA
  - 0.05 per ogni mossa da parte degli utenti (anche IA)

```json
{
    "id": 32,
    "isAgainstAI": false,
    "status": "ACTIVE",
    "currentPlayerId": 1,
    "player1Id": 1,
    "player2Id": 1,
    "winnerId": null,
    "maxMoveTime": null,
    "lastMoveAt": "2024-07-01T16:38:58.859Z",
    "board": "----X----",
    "createdAt": "2024-07-01T16:36:23.296Z",
    "updatedAt": "2024-07-01T16:38:58.865Z"
}
```
 
``` - /ABANDON ``` :
Permette di abbandonare una partita

```json
{
    "message": "Match abandoned successfully."
}
```

``` - /STATUS ``` :
Permette di valutare lo stato di una partita(di chi è il turno, se è terminata, vincitore...)

```json
{
    "id": 31,
    "status": "FINISHED",
    "currentPlayerId": 1,
    "winnerId": 1,
    "winnerEmail": "user1@example.com"
}
```

``` - /MOVES ``` :
Ci restituisce lo storico delle mosse selezionando:
  - il formato in uscita (PDF o JSON)
  - periodo temporale ( data inferiore, data superiore, periodo)

```json
[
    {
        "id": 69,
        "playerId": 6,
        "matchId": 31,
        "position": 2,
        "symbol": "X",
        "createdAt": "2024-07-01T16:09:09.044Z",
        "updatedAt": "2024-07-01T16:09:09.044Z"
    },
    {
        "id": 70,
        "playerId": 1,
        "matchId": 31,
        "position": 5,
        "symbol": "O",
        "createdAt": "2024-07-01T16:10:08.230Z",
        "updatedAt": "2024-07-01T16:10:08.230Z"
    },
    {
        "id": 71,
        "playerId": 6,
        "matchId": 31,
        "position": 3,
        "symbol": "X",
        "createdAt": "2024-07-01T16:11:43.241Z",
        "updatedAt": "2024-07-01T16:11:43.241Z"
    },
    {
        "id": 72,
        "playerId": 1,
        "matchId": 31,
        "position": 7,
        "symbol": "O",
        "createdAt": "2024-07-01T16:12:15.723Z",
        "updatedAt": "2024-07-01T16:12:15.723Z"
    },
    {
        "id": 73,
        "playerId": 6,
        "matchId": 31,
        "position": 4,
        "symbol": "X",
        "createdAt": "2024-07-01T16:12:51.377Z",
        "updatedAt": "2024-07-01T16:12:51.377Z"
    },
    {
        "id": 74,
        "playerId": 1,
        "matchId": 31,
        "position": 8,
        "symbol": "O",
        "createdAt": "2024-07-01T16:13:37.122Z",
        "updatedAt": "2024-07-01T16:13:37.122Z"
    },
    {
        "id": 75,
        "playerId": 6,
        "matchId": 31,
        "position": 1,
        "symbol": "X",
        "createdAt": "2024-07-01T16:29:27.320Z",
        "updatedAt": "2024-07-01T16:29:27.320Z"
    },
    {
        "id": 76,
        "playerId": 1,
        "matchId": 31,
        "position": 6,
        "symbol": "O",
        "createdAt": "2024-07-01T16:30:12.546Z",
        "updatedAt": "2024-07-01T16:30:12.546Z"
    }
]
```


``` - /LEADERBOARD ``` :
Ci restituisce la classifica secondo il punteggio ottenuto calcolando il numero di partite vinte e partite vinte per abbandono.

```json
{
    "leaderboard": [
        {
            "email": "user1@example.com",
            "matchesWon": 1,
            "matchesLost": 0,
            "matchesWonByAbandon": 0,
            "matchesLostByAbandon": 0,
            "matchesWonVsAI": 0,
            "matchesLostVsAI": 0,
            "totalScore": 1
        },
        {
            "email": "user2@example.com",
            "matchesWon": 0,
            "matchesLost": 0,
            "matchesWonByAbandon": 0,
            "matchesLostByAbandon": 0,
            "matchesWonVsAI": 0,
            "matchesLostVsAI": 0,
            "totalScore": 0
        },
        {
            "email": "user3@example.com",
            "matchesWon": 0,
            "matchesLost": 0,
            "matchesWonByAbandon": 0,
            "matchesLostByAbandon": 0,
            "matchesWonVsAI": 2,
            "matchesLostVsAI": 1,
            "totalScore": 0
        },
        {
            "email": "user4@example.com",
            "matchesWon": 0,
            "matchesLost": 0,
            "matchesWonByAbandon": 0,
            "matchesLostByAbandon": 0,
            "matchesWonVsAI": 0,
            "matchesLostVsAI": 0,
            "totalScore": 0
        },
        {
            "email": "ai@ai.com",
            "matchesWon": 0,
            "matchesLost": 0,
            "matchesWonByAbandon": 0,
            "matchesLostByAbandon": 0,
            "matchesWonVsAI": 1,
            "matchesLostVsAI": 2,
            "totalScore": 0
        },
        {
            "email": "user6@example.com",
            "matchesWon": 0,
            "matchesLost": 1,
            "matchesWonByAbandon": 0,
            "matchesLostByAbandon": 0,
            "matchesWonVsAI": 0,
            "matchesLostVsAI": 0,
            "totalScore": 0
        }
    ]
}
```


``` - /RECHARGE ``` :
Rotta per l'utente con ruolo 'admin' che consente di effettuare la ricarica per un utente fornendo la mail

```json
{
    "message": "Credit recharged successfully",
    "newCredit": 8
}
```

``` - /CREDIT ``` :
Consente all'utente di vedere il proprio credito 

```json
{
    "credit": 8
}
```

## Progettazione UML 

## Use case
<p> <img src=Images/Usecase.png width="550" > </p>

## Sequence Diagrams

- Chiamata POST /creatematch :
  <p><img src=Images/creatematch.png width="550" ></p>
  
- Chiamata POST /createmove:
  <p><img src=Images/createmove.png width="550" ></p>
  
- Chiamata GET /HistoryMove:
  <p><img src=Images/HistoryMove.png width="550" ></p>
  
- Chiamata POST /recharge:
  <p><img src=Images/recharge.png width="550" ></p>
  
- Chiamata GET /Leaderboard:
  <p><img src=Images/Leaderboard.png width="550" ></p>


## Progettazione - Pattern 
## Singleton 
Il Singleton è stato usato per la connessione al database e per la gestione delle configurazioni. 
Questo ci assicura una singola istanza per la connessione al database, evitando connessioni multiple che non sono necessarie

## Middleware 
In questo progetto sfrutta le funzionalità di Express: 
- Middleare per l'autenticazione
- Middleware per la gestione degli errori

## Model-View-Controller 
In questo progetto ci si ispira molto a questo pattern, adattandolo al contesto di un'API backend:
- Models: definiscono la struttura dei dati e l'interazione con il database
- View: Sono essenzialmente le risposte JSON.
- Controller: gestiscono le richieste in entrata

## Avvio del servizio
- Posizionarsi nella cartella clonata dal seguente repository
- Avviare il servizio Docker tramite il comando:
```
   docker-compose up --build
```
- Eseguire le richieste sulla porta 3000 tramite Postman

## Autori 
- Giada Gatti
