import { Router } from 'express';
import { getCareerPathways } from '../controllers/careerpathwayController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getCareerPathways);

export default router;
