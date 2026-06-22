import axios from 'axios';
import { query } from '../config/db';
import type { Job, JobDetails, JobWhyMatched } from '../types/db';

export const queryJobsList = async (): Promise<{ jobs: EnrichedJob[]; total: number }> => {
  const useMockAi = process.env.USE_MOCK_AI !== 'false';
  if (!useMockAi) {
    try {
      const aiUrl = `${process.env.AI_BACKEND_URL}/api/ai/jobs/list`;
      const aiRes = await axios.get<{ jobs: EnrichedJob[]; total: number }>(aiUrl);
      if (Array.isArray(aiRes.data.jobs)) {
        return aiRes.data;
      }
    } catch (aiErr) {
      console.error('AI Jobs List call failed, falling back to database query:', aiErr);
    }
  }

  const jobsRes = await query<Job>('SELECT * FROM jobs ORDER BY match_score DESC');

  const enrichedJobs: EnrichedJob[] = [];

  for (const job of jobsRes.rows) {
    const detailsRes = await query<JobDetails>('SELECT * FROM job_details WHERE job_id = $1', [
      job.id,
    ]);
    const matchedRes = await query<JobWhyMatched>(
      'SELECT * FROM job_why_matched WHERE job_id = $1',
      [job.id],
    );

    const details = detailsRes.rows[0] || null;
    const matched = matchedRes.rows[0] || null;

    enrichedJobs.push({
      id: job.id,
      title: job.title,
      company: job.company,
      matchScore: job.match_score,
      tags: job.tags,
      type: job.type,
      salary: job.salary,
      location: job.location,
      category: job.category,
      logoColor: job.logo_color,
      skillsBadge: job.skills_badge,
      occupationBadge: job.occupation_badge,
      coords: job.coords,
      markerCount: job.marker_count,
      jobDetails: details
        ? {
            description: details.description,
            requirements: details.requirements,
            benefits: details.benefits,
            categoryDetails: details.category_details,
          }
        : null,
      whyItMatched: matched
        ? {
            aiExplanation: matched.ai_explanation,
            signalCards: matched.signal_cards,
            dimensionScores: matched.dimension_scores,
            requirements: matched.requirements,
          }
        : null,
    });
  }

  return {
    jobs: enrichedJobs,
    total: enrichedJobs.length,
  };
};

export interface EnrichedJob {
  id: string;
  title: string;
  company: string;
  matchScore: number;
  tags: string[];
  type: string;
  salary: string;
  location: string;
  category: string;
  logoColor: string;
  skillsBadge: unknown;
  occupationBadge: unknown;
  coords: number[];
  markerCount: number;
  jobDetails: {
    description: unknown;
    requirements: unknown;
    benefits: unknown;
    categoryDetails: unknown;
  } | null;
  whyItMatched: {
    aiExplanation: string;
    signalCards: unknown;
    dimensionScores: unknown;
    requirements: unknown;
  } | null;
}

export interface SavedJobDetails {
  id: string;
  title: string;
  company: string;
  location: string;
  logoColor: string;
}

export const querySavedJobs = async (userId: string): Promise<SavedJobDetails[]> => {
  const res = await query<SavedJobDetails>(
    `SELECT j.id, j.title, j.company, j.location, j.logo_color as "logoColor"
     FROM saved_jobs sj
     JOIN jobs j ON sj.job_id = j.id
     WHERE sj.user_id = $1
     ORDER BY sj.created_at DESC`,
    [userId],
  );
  return res.rows;
};

export const toggleSavedJob = async (
  userId: string,
  jobId: string,
): Promise<{ saved: boolean; savedJobs: SavedJobDetails[] }> => {
  const checkRes = await query('SELECT 1 FROM saved_jobs WHERE user_id = $1 AND job_id = $2', [
    userId,
    jobId,
  ]);
  let saved = false;

  if (checkRes.rows.length > 0) {
    await query('DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2', [userId, jobId]);
  } else {
    await query('INSERT INTO saved_jobs (user_id, job_id) VALUES ($1, $2)', [userId, jobId]);
    saved = true;
  }

  const savedJobs = await querySavedJobs(userId);
  return { saved, savedJobs };
};

export const deleteSavedJob = async (userId: string, jobId: string): Promise<SavedJobDetails[]> => {
  await query('DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2', [userId, jobId]);
  return querySavedJobs(userId);
};
