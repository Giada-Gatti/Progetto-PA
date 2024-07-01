import { Request, Response } from 'express';
import { Role, User } from '../models/User';
import { Match, Status } from '../models/Match';
import { Move } from '../models/Move';
import matchService from '../services/matchService';
import { Op } from 'sequelize';
import { generatePDF } from '../services/pdfService';
import { AppError } from '../middleware/errorHandler';



// Funzione per ottenere lo stato di una partita
export const getMatchStatus = async (req: Request, res: Response) => {
  const matchId = Number(req.params.id);
  const userId = req.user!.id; 

  try {
    const match = await Match.findByPk(matchId);
    if (!match) {
      throw new AppError('Match not found', 404);
    }

    
    if (match.player1Id !== userId && match.player2Id !== userId) {
      throw new AppError('Unauthorized: You are not a player of this match', 403);
    }

    // Ottieni lo stato attuale della partita (turno, stato, vincitore, ecc.)
    // Esempio: ritorna lo stato della partita in un oggetto JSON
    const user = await User.findByPk(match.winnerId);
    res.status(200).json({
      id: match.id,
      status: match.status,
      currentPlayerId: match.currentPlayerId,
      winnerId: match.winnerId,
      winnerEmail: user?.email,
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
      throw new AppError('Match not found', 404);
    }
    if (match.player1Id !== playerId && match.player2Id !== playerId) {
      throw new AppError('Unauthorized: You are not a player of this match', 403);
    }
    res.status(200).json({ message: 'Match abandoned successfully.' });
  } catch (error) {
    console.error('Error abandoning match:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Funzione per ottenere lo storico delle mosse di una partita
export const getMoveHistory = async (req: Request, res: Response) => {
  try {
    const { format, matchId, startDate, endDate } = req.body;

    let whereClause: any = { matchId };

    // Aggiungi il filtro temporale solo se sono specificate entrambe le date
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
      };
    }

    const moves = await Move.findAll({ 
      where: whereClause,
      order: [['createdAt', 'ASC']]
    });

    if (format === 'pdf') {
      const pdfBuffer = await generatePDF(moves);
      res.contentType('application/pdf');
      res.send(pdfBuffer);
    } else {
      res.json(moves);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching move history', error: (error as Error).message });
  }
};



   


// Funzione per ottenere la classifica
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
      const { order = 'DESC' } = req.query;
      
      const leaderboard = await User.findAll({
        attributes: [
          'email',
          'matchesWon',
          'matchesLost',
          'matchesWonByAbandon',
          'matchesLostByAbandon',
          'matchesWonVsAI',
          'matchesLostVsAI',
          [
            User.sequelize!.literal('matchesWon + matchesWonByAbandon'),
            'totalScore'
          ]
        ],
        order: [
          [User.sequelize!.literal('totalScore'), order === 'DESC' ? 'DESC' : 'ASC']
        ]
      });
      res.status(200).json({ leaderboard });
    } catch (error) {
      res.status(500).json({ message: 'Errore nel recupero della classifica' });
    }
  } ;
  


// Funzione per creare una nuova partita
export const createMatch = async (req: Request, res: Response) => {
  const { isAgainstAI, opponentEmail, maxMoveTime } = req.body;
  const currentPlayerId = req.user!.id; // L'utente che fa la richiesta si assume che è già autenticato

  try {

    const currentPlayer = await User.findByPk(currentPlayerId);

    if (currentPlayer == null) {
      throw new AppError('User not found', 404);
    }

    if(currentPlayer?.matchId != null){
      throw new AppError('User is already playing another match', 400);
    }

    // Determina il costo in token in base al tipo di partita
    let costTokens = isAgainstAI == false ? 0.45 : 0.75;

    // Controlla se la partita è contro un altro giocatore, non contro l'AI
    let player2Id: number | undefined = undefined;
    if (isAgainstAI == false) {

      if (!opponentEmail) {
        throw new AppError('Opponent email is required for user-vs-user match', 400);
      }
      const opponentUser = await User.findOne({ where: { email: opponentEmail } });
      if (!opponentUser) {
        throw new AppError('Opponent user not found', 404);
      }

      if(opponentUser?.matchId != null){
        throw new AppError('Opponent is already playing another match', 400);
      }

      player2Id = opponentUser.id;
    } else {
      const opponentAI = await User.findOne({ where: { role: Role.ai } });

      if (!opponentAI) {
        throw new AppError('Opponent AI not found', 404);
      }
      
      player2Id = opponentAI.id;

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
     throw new AppError('User not found',404);
    }
    if (currentUser.credit < costTokens) {
     throw new AppError('Insufficient credit to create the match.', 400);
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


