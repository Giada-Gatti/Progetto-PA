import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import bcrypt from 'bcrypt';
import { Role } from '../models/User';
import { AppError } from '../middleware/errorHandler';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    // Crittografia della password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ email, password:hashedPassword, role });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.PRIVATE_KEY!, { expiresIn: '1d', algorithm: 'RS256' });
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(401).send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.checkPassword(password))) {
      throw new AppError('Invalid login credentials', 401);
    }

    if(user.role == Role.ai){
      throw new AppError('AI not loggable', 401);
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.PRIVATE_KEY!, { expiresIn: '1d', algorithm: 'RS256' });
    
    res.send({ user, token });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).send({ error: error.message });
    }
  }
};

