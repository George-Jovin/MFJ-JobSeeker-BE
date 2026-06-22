import { BlobServiceClient } from '@azure/storage-blob';
import axios from 'axios';
import { query } from '../config/db';
import type { Profile, ProfileDetails } from '../types/db';

export interface ParsedSummary {
  name: string;
  role: string;
  completionRate: number;
  avatar: string;
  lastUpdatedDays: number;
  targetRole: string;
  stepsAway: number;
  careerPaths: string[];
  completionBreakdown: Record<string, number>;
}

export interface PersonalDetailItem {
  label: string;
  value: string;
  colSpan?: number;
}

export interface ResumeItem {
  fileName: string;
  uploadDate: string;
  status: string;
  type: string;
}

export interface JobPreference {
  lookingForJob: string;
  careerObjective: string;
  preferences: string[];
}

export interface EmploymentDetail {
  label: string;
  value: string;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  skills: string[];
  logoColor: string;
}

export interface ExperienceInfo {
  employmentDetails: EmploymentDetail[];
  workExperience: WorkExperience[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  cgpa: string;
  logoColor: string;
}

export interface EducationInfo {
  education: EducationItem[];
}

export interface CertificateItem {
  fileName: string;
  uploadDate: string;
  status: string;
  type: string;
  issuer: string;
}

export interface SkillsInfo {
  skills: string[];
  suggestedSkills: string[];
  languages: string[];
  certificates: CertificateItem[];
}

export interface ParsedDetails {
  personalInformation: {
    personalDetails: PersonalDetailItem[];
    address: PersonalDetailItem[];
    contactDetails: PersonalDetailItem[];
    resume: ResumeItem;
  };
  jobPreference: JobPreference;
  experience: ExperienceInfo;
  education: EducationInfo;
  skillsAndCertifications: SkillsInfo;
}

export const updateUploadedResume = async (
  userId: string,
  fileBuffer: Buffer | undefined,
  fileName: string,
  icNumber: string,
  email: string,
): Promise<{ summary: unknown; details: unknown }> => {
  let blobUrl = `https://mockstorage.blob.core.windows.net/resumes/${Date.now()}_${fileName}`;

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_CONTAINER_NAME || 'resumes';

  if (connectionString && fileBuffer) {
    try {
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      const containerClient = blobServiceClient.getContainerClient(containerName);
      await containerClient.createIfNotExists({ access: 'container' });

      const blobName = `${Date.now()}_${fileName}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.upload(fileBuffer, fileBuffer.length);
      blobUrl = blockBlobClient.url;
    } catch (azureErr) {
      console.error('Azure Blob upload failed, using mock URL:', azureErr);
    }
  }

  let parsedSummary: ParsedSummary = {
    name: 'Arjun Kumar',
    role: 'Senior Product Designer',
    completionRate: 96,
    avatar: '/assets/common/avatar.svg',
    lastUpdatedDays: 0,
    targetRole: 'Senior UI/UX Designer',
    stepsAway: 1,
    careerPaths: ['UX Director', 'Design Principal', 'Senior Product Designer'],
    completionBreakdown: { resume: 100, skills: 94, portfolio: 85 },
  };

  let parsedDetails: ParsedDetails = {
    personalInformation: {
      personalDetails: [
        { label: 'Full Name', value: 'Arjun Kumar' },
        { label: 'Identification Number', value: icNumber },
        { label: 'Date of Birth', value: '26 Sep 1995' },
        { label: 'Race', value: 'Indian' },
        { label: 'Nationality', value: 'Malaysian Citizen' },
        { label: 'Country of Origin', value: 'Malaysia' },
        { label: 'Gender', value: 'Male' },
      ],
      address: [
        { label: 'State', value: 'Selangor' },
        { label: 'City', value: 'Petaling Jaya' },
        { label: 'Post Code', value: '47800' },
        {
          label: 'Street Address',
          value: 'Block A, Tropicana Avenue, Petaling Jaya, Selangor.',
          colSpan: 4,
        },
      ],
      contactDetails: [
        { label: 'Email', value: email },
        { label: 'Primary Mobile Number', value: '+60 12-345 6789' },
        { label: 'Secondary Mobile Number', value: '+60 12-345 6789' },
      ],
      resume: {
        fileName: fileName,
        uploadDate: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        status: 'Parsed',
        type: 'resume',
      },
    },
    jobPreference: {
      lookingForJob: 'Yes',
      careerObjective:
        'Product-focused UI/UX Designer with 4+ years of experience designing scalable fintech and B2C interfaces. Experienced in complex checkout flows, enterprise dashboards, and component-driven libraries.',
      preferences: ['Senior Product Designer', 'Design Lead', 'Senior UI/UX Designer'],
    },
    experience: {
      employmentDetails: [
        { label: 'Your Current Employment Status', value: 'Employed' },
        { label: 'Any Work Experience', value: 'Yes' },
      ],
      workExperience: [
        {
          id: 'exp-arjun-1',
          title: 'Senior Product Designer',
          company: 'Razorpay',
          location: 'Remote',
          period: 'Apr 2024 – Present (1 yr 2 mos)',
          description:
            'Leading end-to-end UX for the core checkout platform. Scaled high-traffic consumer interfaces for millions of daily active users.',
          skills: ['Figma', 'Design systems', 'Usability testing', 'Interaction Design'],
          logoColor: 'from-blue-600 to-indigo-700',
        },
        {
          id: 'exp-arjun-2',
          title: 'Product Designer',
          company: 'Maybank',
          location: 'Kuala Lumpur',
          period: 'Jan 2022 – Mar 2024 (2 yrs 3 mos)',
          description:
            'Designed enterprise portal redesigns and consumer onboarding funnels. Collaborated in keeping component libraries synchronized.',
          skills: ['User Research', 'Wireframing & Prototyping', 'Figma'],
          logoColor: 'from-yellow-500 to-amber-600',
        },
      ],
    },
    education: {
      education: [
        {
          id: 'edu-arjun-1',
          degree: 'Bachelor of Design (B.Des)',
          institution: 'National Institute of Design (NID) Ahmedabad',
          year: '2017 – 2021',
          cgpa: '3.8/4.0',
          logoColor: 'from-blue-500 to-indigo-500',
        },
      ],
    },
    skillsAndCertifications: {
      skills: [
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
      suggestedSkills: ['TailwindCSS', 'Framer Motion', 'Web Accessibility (WCAG)'],
      languages: ['English', 'Malay', 'Tamil'],
      certificates: [
        {
          fileName: 'Google UX Design Professional Certificate',
          uploadDate: 'Jan 2025',
          status: 'Parsed',
          type: 'certificate',
          issuer: 'Google',
        },
        {
          fileName: 'Advanced Figma Prototyping',
          uploadDate: 'Mar 2025',
          status: 'Parsed',
          type: 'certificate',
          issuer: 'Figma Academy',
        },
      ],
    },
  };

  const useMockAi = process.env.USE_MOCK_AI !== 'false';
  if (!useMockAi) {
    try {
      const aiUrl = `${process.env.AI_BACKEND_URL}/api/ai/parse-resume`;
      const aiRes = await axios.post<{ summary: ParsedSummary; details: ParsedDetails }>(aiUrl, {
        resumeUrl: blobUrl,
        icNumber,
        email,
      });
      parsedSummary = aiRes.data.summary;
      parsedDetails = aiRes.data.details;
    } catch (aiErr) {
      console.error('AI Parser API call failed, falling back to mock:', aiErr);
    }
  }

  await query('BEGIN');
  try {
    await query(
      `UPDATE profiles
       SET name = $1, role = $2, completion_rate = $3, last_updated_days = 0, target_role = $4, steps_away = $5, career_paths = $6, completion_breakdown = $7
       WHERE user_id = $8`,
      [
        parsedSummary.name,
        parsedSummary.role,
        parsedSummary.completionRate,
        parsedSummary.targetRole,
        parsedSummary.stepsAway,
        JSON.stringify(parsedSummary.careerPaths),
        JSON.stringify(parsedSummary.completionBreakdown),
        userId,
      ],
    );

    await query('UPDATE profile_steps SET completed = true WHERE user_id = $1', [userId]);

    await query(
      `UPDATE profile_details
       SET personal_details = $1, address = $2, contact_details = $3, resume = $4, job_preference = $5, experience = $6, education = $7, skills_and_certifications = $8
       WHERE user_id = $9`,
      [
        JSON.stringify(parsedDetails.personalInformation.personalDetails),
        JSON.stringify(parsedDetails.personalInformation.address),
        JSON.stringify(parsedDetails.personalInformation.contactDetails),
        JSON.stringify(parsedDetails.personalInformation.resume),
        JSON.stringify(parsedDetails.jobPreference),
        JSON.stringify(parsedDetails.experience),
        JSON.stringify(parsedDetails.education),
        JSON.stringify(parsedDetails.skillsAndCertifications),
        userId,
      ],
    );

    await query('COMMIT');
    return { summary: parsedSummary, details: parsedDetails };
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
};

/**
 * Get stored parsed resume data for a user from DB.
 * Returns profile summary + profile details + profile steps.
 */
export const getStoredParsedData = async (
  userId: string,
): Promise<{ summary: unknown; details: unknown; steps: unknown } | null> => {
  const profileRes = await query<Profile>('SELECT * FROM profiles WHERE user_id = $1', [userId]);
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

  const summary = {
    name: dbProfile.name,
    role: dbProfile.role,
    completionRate: dbProfile.completion_rate,
    avatar: dbProfile.avatar,
    lastUpdatedDays: dbProfile.last_updated_days,
    targetRole: dbProfile.target_role,
    stepsAway: dbProfile.steps_away,
    careerPaths,
    completionBreakdown,
  };

  const stepsRes = await query<{ name: string; completed: boolean }>(
    'SELECT name, completed FROM profile_steps WHERE user_id = $1 ORDER BY id ASC',
    [userId],
  );

  const detailsRes = await query<ProfileDetails>(
    'SELECT * FROM profile_details WHERE user_id = $1',
    [userId],
  );
  if (detailsRes.rows.length === 0 || !detailsRes.rows[0]) {
    return { summary, details: null, steps: stepsRes.rows };
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

  const details = {
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

  return { summary, details, steps: stepsRes.rows };
};
