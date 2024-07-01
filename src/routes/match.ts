
import express from 'express';

import auth, { checkCredit } from '../middleware/auth';
import { abandonMatch, createMatch, getLeaderboard, getMatchStatus, getMoveHistory, makeMove } from '../controllers/matchController';

const router = express.Router();


router.post('/match',  auth, checkCredit, createMatch);
router.post('/match/move', auth, checkCredit, makeMove);
router.post('/match/:id/abandon', auth, abandonMatch);
router.get('/match/:id/status', auth, getMatchStatus);
router.get('/match/moves', auth, getMoveHistory);
router.get('/leaderboard', getLeaderboard);

export default router;
