import { Request, Response } from 'express';
import {User} from '../models/User';

export const getCredit = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;  // Assumiamo che l'ID dell'utente sia disponibile nella richiesta dopo l'autenticazione
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(201).json({ credit: user.credit });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving credit', error });
  }
};