import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role, User } from '../models/User';
import { getCredit } from '../controllers/userController';



const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token not provided.' });
    }

    // Verifica e decodifica il token JWT
    const decoded = jwt.verify(token, process.env.PUBLIC_KEY as string) as { id: number }; 

    // Trova l'utente nel database usando l'id dal token
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
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
    return res.status(401).json({ message: 'Insufficient credit' });
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

