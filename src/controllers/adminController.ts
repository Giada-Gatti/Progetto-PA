import { Request, Response } from 'express';
import {User} from '../models/User';

export const rechargeCredit = async (req: Request, res: Response) => {
  const { email, credit } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.credit += credit;
    await user.save();

    res.json({ message: 'Credit recharged successfully', newCredit: user.credit });
  } catch (error) {
    res.status(500).json({ message: 'Error recharging credit', error });
  }
};