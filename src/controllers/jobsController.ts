import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth';
import {
  queryJobsList,
  querySavedJobs,
  toggleSavedJob,
  deleteSavedJob,
} from '../services/jobsService';

interface ToggleSaveJobBody {
  jobId?: string;
}

// Returns all enriched jobs (with jobDetails + whyItMatched per job)
// Frontend handles filtering/search client-side
export const getJobsList = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await queryJobsList();
    res.json(data);
  } catch (error) {
    console.error('getJobsList error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSavedJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(400).json({ error: 'User ID is missing' });
    return;
  }
  try {
    const savedJobs = await querySavedJobs(userId);
    res.json(savedJobs);
  } catch (error) {
    console.error('getSavedJobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleSaveJob = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { jobId } = req.body as ToggleSaveJobBody;

  if (!userId || typeof jobId !== 'string') {
    res.status(400).json({ error: 'User ID and Job ID are required' });
    return;
  }
  try {
    const data = await toggleSavedJob(userId, jobId);
    res.json(data);
  } catch (error) {
    console.error('toggleSaveJob error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const unsaveJob = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const { jobId } = req.params;

  if (!userId || typeof jobId !== 'string') {
    res.status(400).json({ error: 'User ID and Job ID are required' });
    return;
  }
  try {
    const savedJobs = await deleteSavedJob(userId, jobId);
    res.json({ savedJobs });
  } catch (error) {
    console.error('unsaveJob error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
