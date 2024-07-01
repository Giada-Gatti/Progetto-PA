import app from './app';
import dotenv from 'dotenv';
import { DatabaseConnection } from './database/database';

const sequelize = DatabaseConnection.getInstance().getSequelize();

dotenv.config();
const port = process.env.PORT || 3000;

async function StartServer(){
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    await sequelize.sync(); 
    console.log('All models were synchronized successfully.');
    
    // Start server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.log("Exception: " + error);
    
  }
 
}

StartServer();

