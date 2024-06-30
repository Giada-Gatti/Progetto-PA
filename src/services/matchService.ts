import { Match, Move, User } from '../models';
import { Status } from '../models/Match';
import { Role } from '../models/User';
var ticTacToeAiEngine = require("tic-tac-toe-ai-engine");


class MatchService {
  private static instance: MatchService;

  private constructor() {}

  public static getInstance(): MatchService {
    if (!MatchService.instance) {
      MatchService.instance = new MatchService();
    }
    return MatchService.instance;
  }

 

  public async makeMove(matchId: number, playerId: number, position: number): Promise<Match> {
    const match = await Match.findByPk(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    if (match.status !== Status.ACTIVE) {
      throw new Error('Match is not active');
    }
    //controllo giocatori ammessi alla partita
    if( match.player1Id !== playerId && match.player2Id !== playerId){
      throw new Error ('You are not a player in this match');
    }

    if (match.currentPlayerId !== playerId) {
      throw new Error('It\'s not your turn');
    }

    // Verifica il limite di tempo
    if (match.maxMoveTime && match.lastMoveAt) {
      const timeSinceLastMove = Date.now() - match.lastMoveAt.getTime(); //tempo passato in ms dall'ultima mossa
      if (timeSinceLastMove > match.maxMoveTime * 1000) {
        match.status = Status.FINISHED;
        const [winnerId, loserId] = match.currentPlayerId === match.player1Id 
                                        ? [match.player2Id!, match.player1Id] 
                                        : [match.player1Id, match.player2Id!];
        match.winnerId = winnerId;


        this.incrMatchesWonOrLose(winnerId, loserId, match.isAgainstAI, false);
        
        await match.save();
        throw new Error('Time limit exceeded');
      }
    }
    

    if (match.board[position] !== '-') {
      throw new Error('Invalid move');
    }

    match.lastMoveAt = new Date();
   
    const symbol = match.player1Id === playerId ? 'X' : 'O';
    const newBoard = match.board.split('');
    newBoard[position] = symbol;
    match.board = newBoard.join('');

    await Move.create({ matchId, playerId, position, symbol });

    const winner = this.checkWin(match.board);
    if (winner) {
      match.status = Status.FINISHED;
      const [winnerId, loserId] = match.currentPlayerId === match.player1Id 
                                      ? [match.player1Id!, match.player2Id] 
                                      : [match.player2Id, match.player1Id!];
      match.winnerId = winnerId;
      
      this.incrMatchesWonOrLose(winnerId, loserId, match.isAgainstAI, false);
    } else if (!match.board.includes('-')) {
      match.status = Status.FINISHED;
    } else {
      match.currentPlayerId = match.player1Id === playerId ? match.player2Id! : match.player1Id;
    }

    await match.save();

    const aiUser = await User.findOne({ where: { role: Role.ai } });

    if (match.isAgainstAI && match.currentPlayerId == aiUser?.id && match.status === Status.ACTIVE) {
      await match.save();  // Salva lo stato del match prima della mossa dell'IA
      return this.makeAIMove(match);
    }
      return match;
  }

  private async makeAIMove(match: Match): Promise<Match> {
    const ai = ticTacToeAiEngine;

    // Converti la stringa in un array di caratteri
    let boardBefore = Array.from(match.board);

    // Mappa l'array e sostituisci '-' con un carattere vuoto
    boardBefore = boardBefore.map(char => char === '-' ? '' : char);

    let boardAfter = ai.computeMove(boardBefore).nextBestGameState;
    const position = this.getPositionAI(boardBefore, boardAfter);

    return this.makeMove(match.id, match.player2Id!, position);
  }

  private checkWin(board: string): boolean {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] !== '-' && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }

    return false;
  }

  public async abandonMatch(matchId: number, playerId: number): Promise<Match> {
    const match = await Match.findByPk(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    if (match.status != Status.ACTIVE ) {
      throw new Error('Match is not active');
    }

    if (match.player1Id !== playerId && match.player2Id !== playerId) {
      throw new Error('You are not a player in this match');
    }

    match.status = Status.ABANDONED;
    const [winnerId, loserId] = match.currentPlayerId === match.player1Id 
                                        ? [match.player2Id!, match.player1Id] 
                                        : [match.player1Id, match.player2Id!];
        match.winnerId = winnerId;


        this.incrMatchesWonOrLose(winnerId, loserId, match.isAgainstAI, true);


    await match.save();

    return match;
  }

  // Funzione che incrementa e decrementa il numero di partite vinte/perse
  public async incrMatchesWonOrLose(winnerId: number, loserId: number, isAgainstAI: boolean, abandonMatch: boolean) : Promise<void>{
    const winnerUser =await User.findByPk(winnerId);
        const loserUser = await User.findByPk(loserId);
        
        if( !winnerUser ) {
          throw new Error('Winner not found');
        } 
        

        if( !loserUser ) {
          throw new Error('Loser not found');
        } 

        if( abandonMatch) {
          winnerUser.matchesWonByAbandon +=1;
          loserUser.matchesLostByAbandon +=1;
        } else {
        
          if( isAgainstAI){
            winnerUser.matchesWonVsAI +=1;
            loserUser.matchesLostVsAI +=1;
          } else {
          winnerUser.matchesWon +=1;
          loserUser.matchesLost +=1
        }
        }

        

        await winnerUser.save();
        await loserUser.save();

  }

  public getPositionAI(boardBefore : string[], boardAfter: string[]) {
    for (let i = 0; i < boardBefore.length; i++) {
      if (boardBefore[i] !== boardAfter[i]) {
        return i;
      }
    }
    return -1; // Nessun cambiamento trovato
  }
}



export default MatchService.getInstance();