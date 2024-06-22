import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASS!, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT as 'mssql',
  port: parseInt(process.env.DB_PORT!, 10),
  // dialectOptions: {
  //   options: {
  //     encrypt: true, // Abilita la crittografia
  //     enableArithAbort: true,
  //   }
  // }
});

