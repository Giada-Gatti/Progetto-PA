import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private sequelize: Sequelize;

  private constructor() {
    this.sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASS!, {
      host: process.env.DB_HOST,
      dialect: 'mssql',
      port: parseInt(process.env.DB_PORT!, 10),
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public getSequelize(): Sequelize {
    return this.sequelize;
  }

  public async connect(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log('Database connection established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
}