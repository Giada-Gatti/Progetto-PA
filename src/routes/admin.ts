import express from 'express';
import authenticateJWT, { isAdmin } from '../middleware/auth';
import { rechargeCredit } from '../controllers/adminController';

const router = express.Router();

router.post('/recharge', authenticateJWT, isAdmin, rechargeCredit);

export default router;