export interface User {
  id: string;
  email: string;
  ic_number: string;
  password_hash: string;
  created_at?: Date;
}

export interface Profile {
  user_id: string;
  name: string;
  role: string;
  completion_rate: number;
  avatar: string;
  last_updated_days: number;
  target_role: string;
  steps_away: number;
  career_paths: string[] | string;
  completion_breakdown: Record<string, number> | string;
}

export interface ProfileStep {
  id: number;
  user_id: string;
  name: string;
  completed: boolean;
}

export interface ProfileDetails {
  user_id: string;
  personal_details: string; // JSONB
  address: string; // JSONB
  contact_details: string; // JSONB
  resume: string; // JSONB
  job_preference: string; // JSONB
  experience: string; // JSONB
  education: string; // JSONB
  skills_and_certifications: string; // JSONB
}

export interface Job {
  id: string;
  title: string;
  company: string;
  match_score: number;
  tags: string[];
  type: string;
  salary: string;
  location: string;
  category: string;
  logo_color: string;
  skills_badge: unknown;
  occupation_badge: unknown;
  coords: number[];
  marker_count: number;
}

export interface JobDetails {
  job_id: string;
  description: unknown;
  requirements: unknown;
  benefits: unknown;
  category_details: unknown;
}

export interface JobWhyMatched {
  job_id: string;
  ai_explanation: string;
  signal_cards: unknown;
  dimension_scores: unknown;
  requirements: unknown;
}

export interface SavedJob {
  user_id: string;
  job_id: string;
  created_at?: Date;
}
