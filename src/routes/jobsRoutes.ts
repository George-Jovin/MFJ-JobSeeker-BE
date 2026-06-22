import { Router } from 'express';
import { getJobsList, getSavedJobs, toggleSaveJob, unsaveJob } from '../controllers/jobsController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.use(authenticateToken);

router.get('/list', getJobsList);
router.get('/saved', getSavedJobs);
router.post('/save', toggleSaveJob);
router.delete('/saved/:jobId', unsaveJob);

export default router;
