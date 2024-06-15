import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../database/database';
import bcrypt from 'bcryptjs';

export class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public credit!: number;

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
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  credit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
  },
}, {
  sequelize,
  modelName: 'User'
});
