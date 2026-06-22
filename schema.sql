-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop tables if they exist (for easy re-runs)
DROP TABLE IF EXISTS pathway_details CASCADE;
DROP TABLE IF EXISTS pathway_options CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS job_why_matched CASCADE;
DROP TABLE IF EXISTS job_details CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS profile_details CASCADE;
DROP TABLE IF EXISTS profile_steps CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    ic_number TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Profiles Table (Summarized info)
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    completion_rate INT NOT NULL DEFAULT 0,
    avatar TEXT NOT NULL DEFAULT '/assets/common/avatar.svg',
    last_updated_days INT NOT NULL DEFAULT 0,
    target_role TEXT NOT NULL,
    steps_away INT NOT NULL DEFAULT 0,
    career_paths JSONB NOT NULL DEFAULT '[]',
    completion_breakdown JSONB NOT NULL DEFAULT '{}'
);

-- Profile Completion Steps
CREATE TABLE profile_steps (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false
);

-- Profile Full Details (experience, education, job preferences)
CREATE TABLE profile_details (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    personal_details JSONB NOT NULL DEFAULT '[]',
    address JSONB NOT NULL DEFAULT '[]',
    contact_details JSONB NOT NULL DEFAULT '[]',
    resume JSONB NOT NULL DEFAULT '{}',
    job_preference JSONB NOT NULL DEFAULT '{}',
    experience JSONB NOT NULL DEFAULT '{}',
    education JSONB NOT NULL DEFAULT '{}',
    skills_and_certifications JSONB NOT NULL DEFAULT '{}'
);

-- Jobs Table
CREATE TABLE jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    match_score INT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    type TEXT NOT NULL,
    salary TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    logo_color TEXT NOT NULL,
    skills_badge JSONB NOT NULL DEFAULT '{}',
    occupation_badge JSONB NOT NULL DEFAULT '{}',
    coords DOUBLE PRECISION[] NOT NULL DEFAULT '{}',
    marker_count INT NOT NULL DEFAULT 0
);

-- Job Details Table
CREATE TABLE job_details (
    job_id TEXT PRIMARY KEY REFERENCES jobs(id) ON DELETE CASCADE,
    description JSONB NOT NULL DEFAULT '{}',
    requirements JSONB NOT NULL DEFAULT '[]',
    benefits JSONB NOT NULL DEFAULT '[]',
    category_details JSONB NOT NULL DEFAULT '{}'
);

-- Job Match AI Explanations Table
CREATE TABLE job_why_matched (
    job_id TEXT PRIMARY KEY REFERENCES jobs(id) ON DELETE CASCADE,
    ai_explanation TEXT NOT NULL,
    signal_cards JSONB NOT NULL DEFAULT '[]',
    dimension_scores JSONB NOT NULL DEFAULT '[]',
    requirements JSONB NOT NULL DEFAULT '[]'
);

-- Saved/Bookmarked Jobs
CREATE TABLE saved_jobs (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, job_id)
);

-- Career Pathway Options Table
CREATE TABLE pathway_options (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    masco_code TEXT NOT NULL,
    level TEXT NOT NULL,
    fit_score INT NOT NULL,
    is_recommended BOOLEAN NOT NULL DEFAULT false,
    description TEXT NOT NULL,
    career_paths TEXT[] NOT NULL DEFAULT '{}',
    skill_gaps_count INT NOT NULL DEFAULT 0,
    vacancies_count INT NOT NULL DEFAULT 0,
    demand_level TEXT NOT NULL,
    demand_category TEXT NOT NULL
);

-- Career Pathway Details Table
CREATE TABLE pathway_details (
    pathway_id TEXT PRIMARY KEY REFERENCES pathway_options(id) ON DELETE CASCADE,
    skill_gaps JSONB NOT NULL DEFAULT '[]',
    future_signals JSONB NOT NULL DEFAULT '[]',
    trainings JSONB NOT NULL DEFAULT '[]'
);

-- Indexes for performance
CREATE INDEX idx_users_ic ON users(ic_number);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_type ON jobs(type);
CREATE INDEX idx_saved_jobs_user ON saved_jobs(user_id);
