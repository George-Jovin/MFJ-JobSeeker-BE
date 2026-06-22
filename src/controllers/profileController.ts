import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth';
import { getFullProfile as fetchFullProfile } from '../services/profileService';

export const getFullProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: 'User ID is missing' });
    return;
  }

  try {
    const data = await fetchFullProfile(userId);
    if (!data) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('getFullProfile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
