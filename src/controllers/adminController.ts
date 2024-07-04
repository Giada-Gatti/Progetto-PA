import { Request, Response } from 'express';
import {User} from '../models/User';
import { AppError } from '../middleware/errorHandler';

//L'utente con ruolo admin può effettuare una ricarica del credito per un utente
export const rechargeCredit = async (req: Request, res: Response) => {
  const { email, credit } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError( 'User not found',404 );
    }

    user.credit += credit;
    await user.save();

    res.json({ message: 'Credit recharged successfully', newCredit: user.credit });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
  }
};