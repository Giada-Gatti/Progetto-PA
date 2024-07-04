import {User} from './User';
import {Match} from './Match';
import {Move} from './Move';

Match.hasMany(User, {
    foreignKey: 'matchId',
  });
  User.belongsTo(Match);

User.hasMany(Move, { foreignKey: 'playerId' });


Move.belongsTo(Match, { foreignKey: 'matchId',  as: 'match'} );
Move.belongsTo(User, { foreignKey: 'playerId' });

export { User, Match, Move };