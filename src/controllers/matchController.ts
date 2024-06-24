import { Request, Response } from 'express';
import { Role, User } from '../models/User';
import { Match, Status } from '../models/Match';
import { Move, Symbol } from '../models/Move';
import matchService from '../services/matchService';

// Funzione per ottenere lo stato di una partita
export const getMatchStatus = async (req: Request, res: Response) => {
  const matchId = Number(req.params.id);
  const userId = req.user!.id; // Assumendo che l'utente sia autenticato

  try {
    // Verifica se l'utente ha il permesso di accedere a questa partita
    const match = await Match.findByPk(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found.' });
    }

    // Verifica se l'utente è uno dei giocatori della partita
    if (match.player1Id !== userId && match.player2Id !== userId) {
      return res.status(403).json({ error: 'Unauthorized: You are not a player of this match.' });
    }

    // Ottieni lo stato attuale della partita (turno, stato, vincitore, ecc.)
    // Esempio: ritorna lo stato della partita in un oggetto JSON
    res.status(200).json({
      id: match.id,
      status: match.status,
      currentPlayerId: match.currentPlayerId,
      winnerId: match.winnerId,
      // Altri campi dello stato della partita
    });
  } catch (error) {
    console.error('Error getting match status:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Funzione per creare una mossa in una partita
export const makeMove = async (req: Request, res: Response) => {
  try {
    const { matchId, position } = req.body;
    const user = req.user as User;

    const match = await matchService.makeMove(matchId, user.id, position);

    // Deduci i token per la mossa
    user.credit -= 0.05;
    await user.save();

    res.send(match);
  } catch (error) {
    res.status(400).send({ error: error });
  }
};

// Funzione per abbandonare una partita
export const abandonMatch = async (req: Request, res: Response) => {
  const matchId = Number(req.params.id);
  const playerId = req.user!.id; // Assumendo che l'utente sia autenticato

  try {
    // Verifica se l'utente è uno dei giocatori della partita
    const match = await matchService.abandonMatch(matchId,playerId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found.' });
    }
    if (match.player1Id !== playerId && match.player2Id !== playerId) {
      return res.status(403).json({ error: 'Unauthorized: You are not a player of this match.' });
    }
    res.status(200).json({ message: 'Match abandoned successfully.' });
  } catch (error) {
    console.error('Error abandoning match:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Funzione per ottenere lo storico delle mosse di una partita
export const getMoveHistory = async (req: Request, res: Response) => {
  const matchId = Number(req.params.id);
  const userId = req.user!.id; // Assumendo che l'utente sia autenticato

  try {
   
    const match = await Match.findByPk(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found.' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if ((match.player1Id !== userId && match.player2Id !== userId) || user.role == Role.admin) {
      return res.status(403).json({ error: 'Unauthorized: You are not a player of this match.' });
    }

    // Ottieni lo storico delle mosse per questa partita
    const moves = await Move.findAll({
      where: { matchId: matchId },
      order: [['createdAt', 'ASC']],
      include: [{ model: User, attributes: ['id', 'email'] }]
    });

    // Esempio: ritorna lo storico delle mosse in un array JSON
    res.status(200).json({ moves });
  } catch (error) {
    console.error('Error getting move history:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};  

// Funzione per ottenere la classifica( da sviluppare ancora)
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    // Implementa la logica per ottenere la classifica
    // Esempio: consulta il database per ottenere i dati della classifica

    const leaderboard: never[] = []; // Esempio: array vuoto per la classifica

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Funzione per creare una nuova partita
export const createMatch = async (req: Request, res: Response) => {
  const { isAgainstAI, opponentEmail, maxMoveTime } = req.body;
  const currentPlayerId = req.user!.id; // L'utente che fa la richiesta si assume che è già autenticato

  try {
    // Determina il costo in token in base al tipo di partita
    let costTokens = isAgainstAI == false ? 0.45 : 0.75;

    // Controlla se la partita è contro un altro giocatore, non contro l'AI
    let player2Id: number | undefined = undefined;
    if (isAgainstAI == false) {
      if (!opponentEmail) {
        return res.status(400).json({ error: 'Opponent email is required for user-vs-user match.' });
      }
      const opponentUser = await User.findOne({ where: { email: opponentEmail } });
      if (!opponentUser) {
        return res.status(404).json({ error: 'Opponent user not found.' });
      }
      player2Id = opponentUser.id;
    }

    // Crea un nuovo record di partita nel database
    const newMatch = await Match.create({
      isAgainstAI: isAgainstAI,
      status: Status.ACTIVE,
      currentPlayerId,
      player1Id: currentPlayerId,
      player2Id,
      maxMoveTime: maxMoveTime,
    });

    // Gestire il credito dell'utente
    const currentUser = await User.findByPk(currentPlayerId);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found.' });
    }
    if (currentUser.credit < costTokens) {
      return res.status(400).json({ error: 'Insufficient credit to create the match.' });
    }
    currentUser.credit -= costTokens;
    await currentUser.save();

    // Volendo,   si può restituire l'oggetto utente aggiornato
    // const updatedUser = await User.findByPk(currentPlayerId);

    res.status(201).json({ message: 'Match created successfully.', match: newMatch });
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
