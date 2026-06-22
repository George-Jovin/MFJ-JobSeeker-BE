import { Router } from 'express';
import multer from 'multer';
import { uploadResume, getParsedData } from '../controllers/resumeparserController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticateToken);
router.post('/upload-resume', upload.single('resume'), uploadResume);
router.get('/parsed-data', getParsedData);

export default router;
