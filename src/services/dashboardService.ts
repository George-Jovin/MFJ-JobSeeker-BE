import axios from 'axios';
import { query } from '../config/db';
import type { Profile } from '../types/db';

// TODO: Replace with AI API call when ready
// For now, reads from DB and computes mock stats
export interface DashboardStats {
  topMatch: { percentage: number; change: string };
  jobsMatched: { count: number; change: string };
  skillsToUpskill: { count: number; skills: string[] };
  newToday: { count: number; change: string };
}

interface ProfileDetailsSkillsRow {
  skills_and_certifications: {
    skills?: string[];
    suggestedSkills?: string[];
    languages?: string[];
    certificates?: {
      fileName: string;
      uploadDate: string;
      status: string;
      type: string;
      issuer: string;
    }[];
  };
}

export const getDashboardStats = async (userId?: string): Promise<DashboardStats> => {
  const useMockAi = process.env.USE_MOCK_AI !== 'false';
  if (!useMockAi) {
    try {
      const aiUrl = `${process.env.AI_BACKEND_URL}/api/ai/dashboard/stats?userId=${userId}`;
      const aiRes = await axios.get<DashboardStats>(aiUrl);
      return aiRes.data;
    } catch (aiErr) {
      console.error('AI Dashboard Stats call failed, falling back to database query:', aiErr);
    }
  }

  const jobsCountRes = await query<{ count: string }>(
    'SELECT COUNT(*) FROM jobs WHERE match_score >= 75',
  );
  const maxScoreRes = await query<{ max: number }>('SELECT MAX(match_score) FROM jobs');

  let bookmarkCount = 0;
  if (userId) {
    const savedRes = await query<{ count: string }>(
      'SELECT COUNT(*) FROM saved_jobs WHERE user_id = $1',
      [userId],
    );
    if (savedRes.rows[0]) {
      bookmarkCount = parseInt(savedRes.rows[0].count, 10);
    }
  }

  const maxScore = maxScoreRes.rows[0]?.max || 95;
  const matchCount = parseInt(jobsCountRes.rows[0]?.count || '0', 10) || 47;

  let skillsToUpskill = ['Figma AI', 'SQL', 'Agile'];
  if (userId) {
    const detailsRes = await query<ProfileDetailsSkillsRow>(
      'SELECT skills_and_certifications FROM profile_details WHERE user_id = $1',
      [userId],
    );
    if (detailsRes.rows.length > 0 && detailsRes.rows[0]) {
      const skillsObj = detailsRes.rows[0].skills_and_certifications;
      if (Array.isArray(skillsObj.suggestedSkills) && skillsObj.suggestedSkills.length > 0) {
        skillsToUpskill = skillsObj.suggestedSkills.slice(0, 3);
      }
    }
  }

  return {
    topMatch: { percentage: maxScore, change: '+ 6% vs yesterday' },
    jobsMatched: {
      count: matchCount,
      change: `+ 12 new today (${bookmarkCount.toString()} bookmarked)`,
    },
    skillsToUpskill: { count: skillsToUpskill.length, skills: skillsToUpskill },
    newToday: { count: 8, change: '+ 3 vs yesterday' },
  };
};

interface CategoryCountRow {
  category: string;
  count: string;
}

export interface DashboardCategory {
  id: string;
  name: string;
  count: number;
  iconName: string;
}

export const getCategoriesWithCounts = async (): Promise<DashboardCategory[]> => {
  const countsRes = await query<CategoryCountRow>(
    'SELECT category, COUNT(*) as count FROM jobs GROUP BY category',
  );
  const countsMap = new Map<string, number>();
  countsRes.rows.forEach((row) => {
    countsMap.set(row.category.toLowerCase(), parseInt(row.count, 10));
  });

  return [
    { id: 'cat-1', name: 'Design', count: countsMap.get('design') || 85, iconName: 'design' },
    { id: 'cat-2', name: 'Sales', count: countsMap.get('sales') || 150, iconName: 'sales' },
    {
      id: 'cat-3',
      name: 'Marketing',
      count: countsMap.get('marketing') || 110,
      iconName: 'marketing',
    },
    { id: 'cat-4', name: 'Finance', count: countsMap.get('finance') || 325, iconName: 'finance' },
    {
      id: 'cat-5',
      name: 'Technology',
      count: countsMap.get('technology') || 436,
      iconName: 'technology',
    },
    {
      id: 'cat-6',
      name: 'Engineering',
      count: countsMap.get('engineering') || 542,
      iconName: 'engineering',
    },
    {
      id: 'cat-7',
      name: 'Business',
      count: countsMap.get('business') || 211,
      iconName: 'business',
    },
    {
      id: 'cat-8',
      name: 'Human Resource',
      count: countsMap.get('human resource') || 346,
      iconName: 'hr',
    },
  ];
};

export interface ProfileSummary {
  profile: {
    name: string;
    role: string;
    completionRate: number;
    avatar: string;
    lastUpdatedDays: number;
    targetRole: string;
    stepsAway: number;
    careerPaths: string[];
    completionBreakdown: Record<string, number>;
  };
  steps: { name: string; completed: boolean }[];
}

export const getProfileSummary = async (userId: string): Promise<ProfileSummary | null> => {
  const profileRes = await query<Profile>('SELECT * FROM profiles WHERE user_id = $1', [userId]);
  const stepsRes = await query<{ name: string; completed: boolean }>(
    'SELECT name, completed FROM profile_steps WHERE user_id = $1 ORDER BY id ASC',
    [userId],
  );

  if (profileRes.rows.length === 0 || !profileRes.rows[0]) {
    return null;
  }

  const dbProfile = profileRes.rows[0];

  const careerPaths =
    typeof dbProfile.career_paths === 'string'
      ? (JSON.parse(dbProfile.career_paths) as string[])
      : dbProfile.career_paths;

  const completionBreakdown =
    typeof dbProfile.completion_breakdown === 'string'
      ? (JSON.parse(dbProfile.completion_breakdown) as Record<string, number>)
      : dbProfile.completion_breakdown;

  return {
    profile: {
      name: dbProfile.name,
      role: dbProfile.role,
      completionRate: dbProfile.completion_rate,
      avatar: dbProfile.avatar,
      lastUpdatedDays: dbProfile.last_updated_days,
      targetRole: dbProfile.target_role,
      stepsAway: dbProfile.steps_away,
      careerPaths,
      completionBreakdown,
    },
    steps: stepsRes.rows,
  };
};
