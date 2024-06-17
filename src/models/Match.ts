import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/database';

export class Match extends Model {
  public id!: number;
  public isAgainstAI!: boolean;
  public status!: string;
  public currentPlayerId!: number;
  //public opponentEmail?: string;
  //public opponentPlayerId!: number;
  public player1Id!: number;
  public player2Id!: number;
  public winnerId?: number;
  public maxMoveTime?: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Match.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  isAgainstAI: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currentPlayerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  player1Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  player2Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  winnerId: {
    type: DataTypes.INTEGER,
  },
  maxMoveTime: {
    type: DataTypes.INTEGER,
  }
}, {
  sequelize,
  modelName: 'Match',
});
