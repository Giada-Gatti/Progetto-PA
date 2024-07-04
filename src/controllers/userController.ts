import { Request, Response } from 'express';
import {User} from '../models/User';
import { AppError } from '../middleware/errorHandler';

//Funzione per vedere il credito di un utente
export const getCredit = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;  
    
    const user = await User.findByPk(userId);
    if (!user) {
     throw new AppError ('User not found',404 );
    }

    res.status(201).json({ credit: user.credit });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving credit', error });
  }
};