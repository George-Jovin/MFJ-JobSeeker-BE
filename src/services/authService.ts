import { query } from '../config/db';
import type { User } from '../types/db';

export const findUserByIc = async (icNumber: string): Promise<User | null> => {
  const res = await query<User>('SELECT * FROM users WHERE ic_number = $1', [icNumber]);
  return res.rows[0] || null;
};

export const findProfileByUserId = async (userId: string): Promise<{ name: string } | null> => {
  const res = await query<{ name: string }>('SELECT name FROM profiles WHERE user_id = $1', [
    userId,
  ]);
  return res.rows[0] || null;
};

export const registerUser = async (
  email: string,
  icNumber: string,
  passwordHash: string,
): Promise<{ id: string; name: string }> => {
  await query('BEGIN');
  try {
    const insertUserRes = await query<{ id: string }>(
      'INSERT INTO users (email, ic_number, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [email, icNumber, passwordHash],
    );
    const userRow = insertUserRes.rows[0];
    if (!userRow) {
      throw new Error('User registration failed: returning ID was empty');
    }
    const userId = userRow.id;

    const initialProfile = {
      name: 'User ' + icNumber,
      role: 'Job Seeker',
      completionRate: 33,
      avatar: '/assets/common/avatar.svg',
      lastUpdatedDays: 0,
      targetRole: 'Not Specified',
      stepsAway: 4,
      careerPaths: [],
      completionBreakdown: { resume: 0, skills: 0, portfolio: 0 },
    };

    await query(
      `INSERT INTO profiles (user_id, name, role, completion_rate, avatar, last_updated_days, target_role, steps_away, career_paths, completion_breakdown)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        userId,
        initialProfile.name,
        initialProfile.role,
        initialProfile.completionRate,
        initialProfile.avatar,
        initialProfile.lastUpdatedDays,
        initialProfile.targetRole,
        initialProfile.stepsAway,
        JSON.stringify(initialProfile.careerPaths),
        JSON.stringify(initialProfile.completionBreakdown),
      ],
    );

    const steps = [
      { name: 'Personal Information', completed: false },
      { name: 'Job Preferences', completed: false },
      { name: 'Work Experience', completed: false },
      { name: 'Education', completed: false },
      { name: 'Skills & Certification', completed: false },
      { name: 'Resume Upload', completed: false },
    ];

    for (const step of steps) {
      await query('INSERT INTO profile_steps (user_id, name, completed) VALUES ($1, $2, $3)', [
        userId,
        step.name,
        step.completed,
      ]);
    }

    const personalDetails = [
      { label: 'Full Name', value: 'User ' + icNumber },
      { label: 'Identification Number', value: icNumber },
      { label: 'Date of Birth', value: '' },
      { label: 'Race', value: '' },
      { label: 'Nationality', value: 'Malaysian Citizen' },
      { label: 'Country of Origin', value: 'Malaysia' },
      { label: 'Gender', value: '' },
    ];
    const contactDetails = [
      { label: 'Email', value: email },
      { label: 'Primary Mobile Number', value: '' },
      { label: 'Secondary Mobile Number', value: '' },
    ];

    await query(
      `INSERT INTO profile_details (user_id, personal_details, address, contact_details, resume, job_preference, experience, education, skills_and_certifications)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        userId,
        JSON.stringify(personalDetails),
        JSON.stringify([]),
        JSON.stringify(contactDetails),
        JSON.stringify({}),
        JSON.stringify({ lookingForJob: 'Yes', careerObjective: '', preferences: [] }),
        JSON.stringify({ employmentDetails: [], workExperience: [] }),
        JSON.stringify({ education: [] }),
        JSON.stringify({ skills: [], suggestedSkills: [], languages: [], certificates: [] }),
      ],
    );

    await query('COMMIT');
    return { id: userId, name: initialProfile.name };
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
};
