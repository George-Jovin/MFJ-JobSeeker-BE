import { query } from '../config/db';
import type { Profile, ProfileDetails } from '../types/db';

export interface ProfileSummaryResult {
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

export const queryProfileSummary = async (userId: string): Promise<ProfileSummaryResult | null> => {
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

export interface ProfileDetailsResult {
  personalInformation: {
    personalDetails: unknown;
    address: unknown;
    contactDetails: unknown;
    resume: unknown;
  };
  jobPreference: unknown;
  experience: unknown;
  education: unknown;
  skillsAndCertifications: unknown;
}

export const queryProfileDetails = async (userId: string): Promise<ProfileDetailsResult | null> => {
  const detailsRes = await query<ProfileDetails>(
    'SELECT * FROM profile_details WHERE user_id = $1',
    [userId],
  );
  if (detailsRes.rows.length === 0 || !detailsRes.rows[0]) {
    return null;
  }

  const row = detailsRes.rows[0];

  const parseJson = (val: unknown): unknown => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
    return val;
  };

  return {
    personalInformation: {
      personalDetails: parseJson(row.personal_details),
      address: parseJson(row.address),
      contactDetails: parseJson(row.contact_details),
      resume: parseJson(row.resume),
    },
    jobPreference: parseJson(row.job_preference),
    experience: parseJson(row.experience),
    education: parseJson(row.education),
    skillsAndCertifications: parseJson(row.skills_and_certifications),
  };
};

/**
 * Consolidated profile: summary + details + recommended occupation + AI skills review
 * Returns everything the profile page needs in one call.
 */
export interface FullProfileResult {
  summary: ProfileSummaryResult;
  details: ProfileDetailsResult | null;
  recommendedOccupation: {
    title: string;
    mascoCode: string;
    alignment: string;
    description: string;
    alternativeMappings: { code: string; title: string; matchPercentage: number }[];
  };
  aiSkillsReview: {
    confirmedSkills: string[];
    pendingSkills: string[];
  };
}

export const getFullProfile = async (userId: string): Promise<FullProfileResult | null> => {
  const summaryResult = await queryProfileSummary(userId);
  if (!summaryResult) return null;

  const details = await queryProfileDetails(userId);

  // TODO: Replace with AI API call when ready
  const recommendedOccupation = {
    title: 'Senior UI UX Designer',
    mascoCode: '2166',
    alignment: 'ISCO-08 aligned',
    description:
      'Based on your work history at XYZ Company and razorpay, skills in Figma, Design Systems, and prototyping, and your design qualifications, this occupation code represents your alignment in the Malaysian occupational taxonomy.',
    alternativeMappings: [
      { code: '2523', title: 'Data Scientist', matchPercentage: 78 },
      { code: '2511', title: 'BI Analyst', matchPercentage: 74 },
      { code: '2512', title: 'Systems Analyst', matchPercentage: 61 },
    ],
  };

  // TODO: Replace with AI API call when ready
  const aiSkillsReview = {
    confirmedSkills: [
      'User Interface Design',
      'User Experience Research',
      'Wireframing & Prototyping',
      'Figma',
      'Design Systems',
      'Usability Testing',
      'Responsive Design',
      'Collaboration with Developers',
      'Adobe Illustrator',
      'Adobe Photoshop',
      'Adobe After Effects',
    ],
    pendingSkills: ['Adobe Illustrator', 'Adobe Photoshop', 'Adobe After Effects'],
  };

  return {
    summary: summaryResult,
    details,
    recommendedOccupation,
    aiSkillsReview,
  };
};
