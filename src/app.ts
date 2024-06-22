import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import gameRoutes from './routes/match';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', gameRoutes);

export default app;