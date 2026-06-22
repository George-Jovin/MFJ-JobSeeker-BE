import { Router } from 'express';
import { getFullProfile } from '../controllers/profileController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.use(authenticateToken);

// Consolidated profile endpoint — returns everything in one call
router.get('/', getFullProfile);

export default router;
