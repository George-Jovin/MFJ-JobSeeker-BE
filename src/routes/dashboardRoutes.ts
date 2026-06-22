import { Router } from 'express';
import { getStats, getCategories, getProfileSummary } from '../controllers/dashboardController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.use(authenticateToken);

router.get('/stats', getStats);
router.get('/categories', getCategories);
router.get('/profile-summary', getProfileSummary);

export default router;
