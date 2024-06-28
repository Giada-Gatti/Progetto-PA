import {User} from './User';
import {Match} from './Match';
import {Move} from './Move';

User.hasMany(Match, { foreignKey: 'player1Id', as: 'MatchsAsPlayer1' });
User.hasMany(Match, { foreignKey: 'player2Id', as: 'MatchsAsPlayer2' });
User.hasMany(Move, { foreignKey: 'playerId' });

Match.belongsTo(User, { foreignKey: 'player1Id', as: 'player1' });
Match.belongsTo(User, { foreignKey: 'player2Id', as: 'player2' });
Match.belongsTo(User, { foreignKey: 'currentPlayerId', as: 'currentPlayer' });
Match.belongsTo(User, { foreignKey: 'winnerId', as: 'winnerUser' });

Move.belongsTo(Match, { foreignKey: 'matchId',  as: 'match'} );
Move.belongsTo(User, { foreignKey: 'playerId' });

 export { User, Match, Move };