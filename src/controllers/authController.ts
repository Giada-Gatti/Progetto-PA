import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import bcrypt from 'bcrypt';
import { Role } from '../models/User';

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
    res.status(400).send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).send({ error: 'Invalid login credentials' });
    }

    if(user.role == Role.ai){
      return res.status(401).send({ error: 'AI not loggable' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.PRIVATE_KEY!, { expiresIn: '1d', algorithm: 'RS256' });
    
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

