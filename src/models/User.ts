import { Model, DataTypes } from 'sequelize';
import { DatabaseConnection } from '../database/database';
import bcrypt from 'bcrypt';

const sequelize = DatabaseConnection.getInstance().getSequelize();

export interface AuthenticatedUser {
  id: number;
  email: string;
  credit: number;
  role: string;
}

export enum Role {
  user = 'user',
  admin = 'admin',
  ai  = 'ai'
}

export class User extends Model {
  
  public id!: number;
  public email!: string;
  public password!: string;
  public credit!: number;
  public role!: Role;
  public matchId?: number;

  public matchesWon!: number;
  public matchesLost!: number;
  public matchesWonByAbandon!:number;
  public matchesLostByAbandon!: number;
  public matchesWonVsAI!: number;
  public matchesLostVsAI!: number;

  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'usr_email',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  credit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: ()=>10, 
  },
  role: {
    type: DataTypes.ENUM(typeof Role),
    allowNull: false,
  },
  matchId: {
    type: DataTypes.INTEGER,
  },
  matchesWon: {
    type: DataTypes.INTEGER,
    defaultValue: ()=>0,
    allowNull: false,
  },
  matchesLost: {
    type: DataTypes.INTEGER,
    defaultValue: ()=>0,
    allowNull: false,
  },
  matchesWonByAbandon: {
    type: DataTypes.INTEGER,
    defaultValue: ()=>0,
    allowNull: false,
  },
  matchesLostByAbandon: {
    type: DataTypes.INTEGER,
    defaultValue: ()=>0,
    allowNull: false,
  },
  matchesWonVsAI: {
    type: DataTypes.INTEGER,
    defaultValue: ()=>0,
    allowNull: false,
  },
  matchesLostVsAI: {
    type: DataTypes.INTEGER,
    defaultValue: ()=>0,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User'
});

