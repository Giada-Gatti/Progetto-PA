import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role, User } from '../models/User';
import { AppError } from './errorHandler';



const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new AppError('Unauthorized: Token not provided.',401);
    }

    // Verifica e decodifica il token JWT
    const decoded = jwt.verify(token, process.env.PUBLIC_KEY as string) as { id: number }; 

    // Trova l'utente nel database usando l'id dal token
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new AppError('User not found.',404);
    }

    // Imposta req.user con i dati dell'utente per l'utilizzo nelle altre funzioni del controller
    req.user = user;

    next();
  } catch (error) {
    console.error('Error authenticating JWT:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token.' });
  }
};

export default authenticateJWT;

export const checkCredit = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findByPk(req.user!.id);
  if (user!.credit <= 0) {
    throw new AppError('Insufficient credit',401);
  }
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === Role.admin)
   {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

