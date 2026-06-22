import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import jobsRoutes from './routes/jobsRoutes';
import profileRoutes from './routes/profileRoutes';
import careerpathwayRoutes from './routes/careerpathwayRoutes';
import resumeparserRoutes from './routes/resumeparserRoutes';

const app = express();
const PORT = process.env.PORT || '5000';

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/careerpathway', careerpathwayRoutes);
app.use('/api/resumeparser', resumeparserRoutes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
