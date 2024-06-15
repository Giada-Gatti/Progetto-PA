import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/database';

export class Match extends Model {
  public id!: number;
  public type!: string;
  public status!: string;
  public currentPlayerId!: number;
//   public opponentEmail?: string;
  public opponentPlayerId!: number;
  public winnerId?: number;
  public maxTime?: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Match.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
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
  opponentPlayerId: {
    type: DataTypes.INTEGER,
  },
  winnerId: {
    type: DataTypes.INTEGER,
  },
  maxTime: {
    type: DataTypes.INTEGER,
  }
}, {
  sequelize,
  modelName: 'Match',
});
