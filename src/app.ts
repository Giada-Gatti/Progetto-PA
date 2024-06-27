import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import gameRoutes from './routes/match';
import adminRoutes from './routes/admin';
import userRoutes from './routes/user';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', gameRoutes);
app.use('/api', adminRoutes);
app.use('/api', userRoutes);

export default app;