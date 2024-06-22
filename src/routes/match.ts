
import express from 'express';

import auth from '../middleware/auth';
import { abandonMatch, createMatch, getLeaderboard, getMatchStatus, getMoveHistory, makeMove } from '../controllers/matchController';

const router = express.Router();


router.post('/match', auth, createMatch);
router.post('/match/:id/move', auth, makeMove);
router.post('/match/:id/abandon', auth, abandonMatch);
router.get('/match/:id/status', auth, getMatchStatus);
router.get('/match/:id/moves', auth, getMoveHistory);
router.get('/leaderboard', getLeaderboard);

export default router;
