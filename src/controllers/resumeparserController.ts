import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth';
import { updateUploadedResume, getStoredParsedData } from '../services/resumeparserService';

export const uploadResume = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  const file = req.file;

  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  const fileBuffer = file ? file.buffer : undefined;
  const fileName = file ? file.originalname : 'Uploaded_Resume.pdf';
  const icNumber = req.user?.icNumber || '950926000001';
  const email = req.user?.email || 'arjun.kumar@gmail.com';

  try {
    const result = await updateUploadedResume(userId, fileBuffer, fileName, icNumber, email);
    res.json({
      message: 'Resume uploaded and parsed successfully',
      summary: result.summary,
      details: result.details,
    });
  } catch (error) {
    console.error('uploadResume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getParsedData = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  try {
    const data = await getStoredParsedData(userId);
    if (!data) {
      res.status(404).json({ error: 'No parsed resume data found' });
      return;
    }
    res.json(data);
  } catch (error) {
    console.error('getParsedData error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
