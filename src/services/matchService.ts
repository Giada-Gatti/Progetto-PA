import { Match, Move, User } from '../models';
import { Status } from '../models/Match';
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

  //getMatchStatus rimane nel controller perchè non ha logica

  public async makeMove(matchId: number, playerId: number, position: number): Promise<Match> {
    const match = await Match.findByPk(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    if (match.status !== Status.ACTIVE) {
      throw new Error('Match is not active');
    }

    if (match.currentPlayerId !== playerId) {
      throw new Error('It\'s not your turn');
    }

    // Verifica il limite di tempo
    if (match.maxMoveTime && match.lastMoveAt) {
      const timeSinceLastMove = Date.now() - match.lastMoveAt.getTime(); //tempo passato in ms dall'ultima mossa
      if (timeSinceLastMove > match.maxMoveTime * 1000) {
        match.status = Status.FINISHED;
        match.winnerId = match.currentPlayerId === match.player1Id ? match.player2Id! : match.player1Id;
        await match.save();
        throw new Error('Time limit exceeded');
      }
    }
    

    if (match.board[position] !== '-') {
      throw new Error('Invalid move');
    }

    match.lastMoveAt = new Date();
    await match.save();

    const symbol = match.player1Id === playerId ? 'X' : 'O';
    const newBoard = match.board.split('');
    newBoard[position] = symbol;
    match.board = newBoard.join('');

    await Move.create({ matchId, playerId, position });

    const winner = this.checkWin(match.board);
    if (winner) {
      match.status = Status.FINISHED;
      match.winnerId = playerId;
    } else if (!match.board.includes('-')) {
      match.status = Status.FINISHED;
    } else {
      match.currentPlayerId = match.player1Id === playerId ? match.player2Id! : match.player1Id;
    }

    await match.save();

    if (match.isAgainstAI && match.status === Status.ACTIVE) {
      return this.makeAIMove(match);
    }

    return match;
  }

  private async makeAIMove(match: Match): Promise<Match> {
    const ai = ticTacToeAiEngine;
    const aiOutput = ai.computeMove(match.board);
    const position = aiOutput.depth - 1; //prendiamo la posizione della mossa dell'AI (-1 in quanto la board viene contata da 1)

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

    if (match.status != Status.ACTIVE) {
      throw new Error('Match is not active');
    }

    if (match.player1Id !== playerId && match.player2Id !== playerId) {
      throw new Error('You are not a player in this match');
    }

    match.status = Status.ABANDONED;
    match.winnerId = match.player1Id === playerId ? match.player2Id! : match.player1Id;
    await match.save();

    return match;
  }
}

export default MatchService.getInstance();