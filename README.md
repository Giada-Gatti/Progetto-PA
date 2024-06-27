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

- **/REGISTER**
  Permette di registrare un nuovo utente, specificandone l'email, la password e il ruolo






- **/LOGIN**






- **/MATCH**
  Permette di creare una nuova partita, specificando il tipo di giocatori, e-mail dell'avversario (solo nel caso di partita user vs user) e l'impostazione del tempo per effetturare una mossa







- **/MOVE**
  Permette di effettuare una mossa in una partita verificando se è ammissibile o meno e andando a sottrarre il numero di token:
  - 0.45 all'atto della creazione se user vs user
  - 0.75 se user VS IA
  - 0.05 per ogni mossa da parte degli utenti (anche IA)
 







- **/ABANDON**
  Permette di abbandonare una partita





- **/STATUS**
  Permette di valutare lo stato di una partita(di chi è il turno, se è terminata, vincitore...)







- **/MOVES**
  Ci restituisce lo storico delle mosse selezionando:
  - il formato in uscita (PDF o JSON)
  - periodo temporale ( data inferiore, data superiore, periodo)







- **/LEADERBOARD**
  Ci restituisce la classifica secondo il punteggio ottenuto calcolando il numero di partite vinte e partite vinte per abbandono.






- **/RECHARGE**
  Rotta per l'utente con ruolo 'admin' che consente di effettuare la ricarica per un utente fornendo la mail






- **/CREDIT**
  Consente all'utente di vedere il proprio credito 
