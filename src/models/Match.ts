import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/database';

export enum Status {
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  ABANDONED = 'ABANDONED'
}

export class Match extends Model {
  public id!: number;
  public isAgainstAI!: boolean;
  public status!: Status;
  public currentPlayerId!: number;
  public player1Id!: number;
  public player2Id!: number;
  public winnerId?: number;
  public maxMoveTime?: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public lastMoveAt?: Date;
  public board!: string;
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
    type: DataTypes.ENUM(typeof Status),
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
  },
  lastMoveAt:{
    type: DataTypes.DATE
  },
  board: {
    type: DataTypes.STRING(9),
    defaultValue: '---------',
    validate: {
      len: [9, 9],
    },
  },
}, {
  sequelize,
  modelName: 'Match',
});
