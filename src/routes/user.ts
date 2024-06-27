import express from 'express';
import authenticateJWT  from '../middleware/auth';
import { getCredit } from '../controllers/userController';

const router = express.Router();

router.get('/credit', authenticateJWT, getCredit);

export default router;