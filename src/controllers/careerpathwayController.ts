import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth';
import { queryCareerPathways } from '../services/careerpathwayService';

export const getCareerPathways = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pathways = await queryCareerPathways();
    res.json(pathways);
  } catch (error) {
    console.error('getCareerPathways error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
