import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth';
import {
  getDashboardStats,
  getCategoriesWithCounts,
  getProfileSummary as fetchProfileSummary,
} from '../services/dashboardService';

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  try {
    const stats = await getDashboardStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategories = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await getCategoriesWithCounts();
    res.json(categories);
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfileSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: 'User ID is missing' });
    return;
  }

  try {
    const data = await fetchProfileSummary(userId);
    if (!data) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('getProfileSummary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
