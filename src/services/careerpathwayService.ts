import axios from 'axios';
import { query } from '../config/db';

export interface PathwayOption {
  id: string;
  title: string;
  mascoCode: string;
  level: string;
  fitScore: number;
  isRecommended: boolean;
  description: string;
  careerPaths: string[];
  skillGapsCount: number;
  vacanciesCount: number;
  demandLevel: string;
  demandCategory: string;
}

export interface PathwayOptionDbRow {
  id: string;
  title: string;
  masco_code: string;
  level: string;
  fit_score: number;
  is_recommended: boolean;
  description: string;
  career_paths: string[];
  skill_gaps_count: number;
  vacancies_count: number;
  demand_level: string;
  demand_category: string;
}

export interface PathwayDetails {
  skillGaps: unknown;
  futureSignals: unknown;
  trainings: unknown;
}

export interface PathwayDetailsDbRow {
  pathway_id: string;
  skill_gaps: unknown;
  future_signals: unknown;
  trainings: unknown;
}

export interface EnrichedPathway extends PathwayOption {
  details: PathwayDetails | null;
}

const queryLocalPathwayDetails = async (pathwayId: string): Promise<PathwayDetails | null> => {
  const detailsRes = await query<PathwayDetailsDbRow>(
    'SELECT * FROM pathway_details WHERE pathway_id = $1',
    [pathwayId],
  );
  if (detailsRes.rows.length === 0 || !detailsRes.rows[0]) {
    return null;
  }

  const record = detailsRes.rows[0];
  return {
    skillGaps: record.skill_gaps,
    futureSignals: record.future_signals,
    trainings: record.trainings,
  };
};

export const queryCareerPathways = async (): Promise<EnrichedPathway[]> => {
  const useMockAi = process.env.USE_MOCK_AI !== 'false';
  if (!useMockAi) {
    try {
      const aiUrl = `${process.env.AI_BACKEND_URL}/api/ai/careerpathway/list`;
      const aiRes = await axios.get<EnrichedPathway[]>(aiUrl);
      if (Array.isArray(aiRes.data)) {
        return aiRes.data;
      }
    } catch (aiErr) {
      console.error('AI Career Pathways call failed, falling back to database:', aiErr);
    }
  }

  const optionsRes = await query<PathwayOptionDbRow>(
    'SELECT * FROM pathway_options ORDER BY fit_score DESC',
  );

  const enrichedPathways: EnrichedPathway[] = [];

  for (const row of optionsRes.rows) {
    const details = await queryLocalPathwayDetails(row.id);
    enrichedPathways.push({
      id: row.id,
      title: row.title,
      mascoCode: row.masco_code,
      level: row.level,
      fitScore: row.fit_score,
      isRecommended: row.is_recommended,
      description: row.description,
      careerPaths: row.career_paths,
      skillGapsCount: row.skill_gaps_count,
      vacanciesCount: row.vacancies_count,
      demandLevel: row.demand_level,
      demandCategory: row.demand_category,
      details,
    });
  }

  return enrichedPathways;
};
