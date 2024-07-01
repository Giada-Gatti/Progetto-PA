import { Model, DataTypes } from 'sequelize';
import { DatabaseConnection } from '../database/database';

const sequelize = DatabaseConnection.getInstance().getSequelize();

export enum Symbol {
    X = 'X',
    O = 'O'
}

export class Move extends Model {
  public id!: number;
  public playerId!: number;
  public matchId!: number;
  public symbol!: Symbol;
  public position!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Move.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  playerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  matchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  symbol : {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Move',
});
