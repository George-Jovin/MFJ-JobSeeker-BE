/* eslint-disable no-console */
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/myj_jobseeker';

const JOBS = [
  {
    id: 'list-1',
    title: 'Junior Data Scientist',
    company: 'XYZ Company',
    match_score: 92,
    tags: ['Interaction Design', 'Prototyping', 'Fintech domain', 'Team leadership'],
    type: 'Full time',
    salary: 'RM 3,000 - RM 6,000 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Technology',
    logo_color: 'from-blue-400 to-indigo-600',
    skills_badge: { text: '2 Skill Gaps', variant: 'info' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.058, 101.69],
    marker_count: 14,
  },
  {
    id: 'list-2',
    title: 'Business Intelligence Analyst',
    company: 'XYZ Company',
    match_score: 84,
    tags: ['Interaction Design', 'Prototyping', 'Fintech domain'],
    type: 'Full time',
    salary: 'RM 3,000 - RM 6,000 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Finance',
    logo_color: 'from-emerald-400 to-teal-600',
    skills_badge: { text: '2 Skill Gaps', variant: 'info' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.205, 101.728],
    marker_count: 12,
  },
  {
    id: 'list-3',
    title: 'Data Analyst — Finance Division',
    company: 'XYZ Company',
    match_score: 74,
    tags: ['Interaction Design', 'Fintech domain'],
    type: 'Full time',
    salary: 'RM 3,000 - RM 6,000 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Finance',
    logo_color: 'from-orange-400 to-red-500',
    skills_badge: { text: '2 Skill Gaps', variant: 'info' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.168, 101.654],
    marker_count: 22,
  },
  {
    id: 'list-4',
    title: 'Data Analyst — Hotels Division',
    company: 'XYZ Company',
    match_score: 74,
    tags: ['Analyst', 'Freelance', 'RM 3,000 - RM 6,000 Per Annum', 'Kuala Lumpur, Malaysia'],
    type: 'Freelance',
    salary: 'RM 3,000 - RM 6,000 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Hotels & Tourism',
    logo_color: 'from-orange-400 to-red-500',
    skills_badge: { text: '2 Skill Gaps', variant: 'info' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.165, 101.636],
    marker_count: 18,
  },
  {
    id: 'list-5',
    title: 'Data Analyst — Education Division',
    company: 'XYZ Company',
    match_score: 74,
    tags: ['Analyst', 'Seasonal', 'RM 3,000 - RM 6,000 Per Annum', 'Kuala Lumpur, Malaysia'],
    type: 'Seasonal',
    salary: 'RM 3,000 - RM 6,000 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Education',
    logo_color: 'from-orange-400 to-red-500',
    skills_badge: { text: '2 Skill Gaps', variant: 'info' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.134, 101.686],
    marker_count: 28,
  },
  {
    id: 'list-6',
    title: 'Senior Java Software Engineer',
    company: 'XYZ Company',
    match_score: 88,
    tags: ['Engineering', 'Part time', 'RM 6,000 - RM 8,500 Per Annum', 'Penang, Malaysia'],
    type: 'Part time',
    salary: 'RM 6,000 - RM 8,500 Per Annum',
    location: 'Penang, Malaysia',
    category: 'Engineering',
    logo_color: 'from-indigo-500 to-purple-600',
    skills_badge: { text: '1 Skill Gap', variant: 'info' },
    occupation_badge: { text: 'Best Match', variant: 'success' },
    coords: [5.414, 100.329],
    marker_count: 25,
  },
  {
    id: 'list-7',
    title: 'Digital Marketing & Content Specialist',
    company: 'XYZ Company',
    match_score: 81,
    tags: ['Marketing', 'Full time', 'RM 4,500 - RM 6,000 Per Annum', 'Kuala Lumpur, Malaysia'],
    type: 'Full time',
    salary: 'RM 4,500 - RM 6,000 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Marketing',
    logo_color: 'from-teal-400 to-cyan-500',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.12, 101.749],
    marker_count: 16,
  },
  {
    id: 'list-8',
    title: 'Hotel Operations Coordinator',
    company: 'XYZ Company',
    match_score: 72,
    tags: ['Hotels & Tourism', 'Part time', 'RM 2,500 - RM 4,000 Per Annum', 'Melaka, Malaysia'],
    type: 'Part time',
    salary: 'RM 2,500 - RM 4,000 Per Annum',
    location: 'Melaka, Malaysia',
    category: 'Hotels & Tourism',
    logo_color: 'from-yellow-400 to-amber-500',
    skills_badge: { text: '3 Skill Gaps', variant: 'warning' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [2.189, 102.249],
    marker_count: 15,
  },
  {
    id: 'list-9',
    title: 'Web Front-End React Developer',
    company: 'XYZ Company',
    match_score: 90,
    tags: ['Technology', 'Freelance', 'RM 5,000 - RM 7,500 Per Annum', 'Kuala Lumpur, Malaysia'],
    type: 'Freelance',
    salary: 'RM 5,000 - RM 7,500 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Technology',
    logo_color: 'from-blue-400 to-sky-600',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Best Match', variant: 'success' },
    coords: [3.107, 101.638],
    marker_count: 30,
  },
  {
    id: 'list-10',
    title: 'Senior UI/UX Designer',
    company: 'XYZ Company',
    match_score: 92,
    tags: ['Design', 'Full time', 'Wangsa Maju'],
    type: 'Full time',
    salary: 'RM 8,000 - RM 12,000 Per Annum',
    location: 'Wangsa Maju, Kuala Lumpur',
    category: 'Design',
    logo_color: 'from-purple-500 to-indigo-500',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Best Match', variant: 'success' },
    coords: [3.205, 101.728],
    marker_count: 12,
  },
  {
    id: 'list-11',
    title: 'Project Engineering Specialist',
    company: 'XYZ Company',
    match_score: 85,
    tags: ['Engineering', 'Full time', 'Kuala Lumpur, Malaysia'],
    type: 'Full time',
    salary: 'RM 5,500 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Engineering',
    logo_color: 'from-indigo-500 to-purple-600',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.071, 101.681],
    marker_count: 25,
  },
  {
    id: 'list-12',
    title: 'Interaction Designer',
    company: 'XYZ Company',
    match_score: 90,
    tags: ['Design', 'Full time', 'Kuala Lumpur, Malaysia'],
    type: 'Full time',
    salary: 'RM 5,000 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Design',
    logo_color: 'from-purple-400 to-pink-500',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Best Match', variant: 'success' },
    coords: [3.165, 101.636],
    marker_count: 18,
  },
  {
    id: 'list-13',
    title: 'Sales Account Manager',
    company: 'XYZ Company',
    match_score: 86,
    tags: ['Sales', 'Full time', 'RM 5,000 - RM 8,000 Per Annum', 'Kuala Lumpur, Malaysia'],
    type: 'Full time',
    salary: 'RM 5,000 - RM 8,000 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Sales',
    logo_color: 'from-amber-400 to-orange-600',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Best Match', variant: 'success' },
    coords: [3.149, 101.685],
    marker_count: 10,
  },
  {
    id: 'list-14',
    title: 'HR Operations Specialist',
    company: 'XYZ Company',
    match_score: 82,
    tags: [
      'Human Resource',
      'Full time',
      'RM 4,000 - RM 6,500 Per Annum',
      'Kuala Lumpur, Malaysia',
    ],
    type: 'Full time',
    salary: 'RM 4,000 - RM 6,500 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Human Resource',
    logo_color: 'from-pink-400 to-rose-600',
    skills_badge: { text: '1 Skill Gap', variant: 'info' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.138, 101.683],
    marker_count: 9,
  },
  {
    id: 'list-15',
    title: 'E-Commerce Manager',
    company: 'XYZ Company',
    match_score: 80,
    tags: ['Commerce', 'Full time', 'RM 6,000 - RM 9,000 Per Annum', 'Kuala Lumpur, Malaysia'],
    type: 'Full time',
    salary: 'RM 6,000 - RM 9,000 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Commerce',
    logo_color: 'from-yellow-400 to-orange-500',
    skills_badge: { text: '2 Skill Gaps', variant: 'info' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.158, 101.713],
    marker_count: 13,
  },
  {
    id: 'list-16',
    title: 'Telecomm Network Engineer',
    company: 'XYZ Company',
    match_score: 85,
    tags: [
      'Telecommunications',
      'Full time',
      'RM 5,500 - RM 8,000 Per Annum',
      'Kuala Lumpur, Malaysia',
    ],
    type: 'Full time',
    salary: 'RM 5,500 - RM 8,000 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Telecommunications',
    logo_color: 'from-cyan-400 to-blue-600',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.125, 101.675],
    marker_count: 16,
  },
  {
    id: 'list-17',
    title: 'Tourism Sales Consultant',
    company: 'XYZ Company',
    match_score: 78,
    tags: ['Hotels & Tourism', 'Part time', 'RM 2,000 - RM 3,500 Per Annum', 'Penang, Malaysia'],
    type: 'Part time',
    salary: 'RM 2,000 - RM 3,500 Per Annum',
    location: 'Penang, Malaysia',
    category: 'Hotels & Tourism',
    logo_color: 'from-emerald-400 to-teal-500',
    skills_badge: { text: 'No Experience', variant: 'info' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [5.416, 100.325],
    marker_count: 5,
  },
  {
    id: 'list-18',
    title: 'Special Education Teacher',
    company: 'XYZ Company',
    match_score: 88,
    tags: ['Education', 'Full time', 'RM 3,500 - RM 5,500 Per Annum', 'Johor Bahru, Malaysia'],
    type: 'Full time',
    salary: 'RM 3,500 - RM 5,500 Per Annum',
    location: 'Johor Bahru, Malaysia',
    category: 'Education',
    logo_color: 'from-purple-400 to-indigo-600',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [1.492, 103.741],
    marker_count: 8,
  },
  {
    id: 'list-19',
    title: 'Financial Risk Analyst',
    company: 'XYZ Company',
    match_score: 83,
    tags: ['Finance', 'Full time', 'RM 6,500 - RM 9,500 Per Annum', 'Kuala Lumpur, Malaysia'],
    type: 'Full time',
    salary: 'RM 6,500 - RM 9,500 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Finance',
    logo_color: 'from-emerald-500 to-green-700',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.152, 101.696],
    marker_count: 11,
  },
  {
    id: 'list-20',
    title: 'Creative Art Director',
    company: 'XYZ Company',
    match_score: 91,
    tags: ['Design', 'Full time', 'RM 8,000 - RM 11,000 Per Annum', 'Kuala Lumpur, Malaysia'],
    type: 'Full time',
    salary: 'RM 8,000 - RM 11,000 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Design',
    logo_color: 'from-pink-500 to-rose-600',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.162, 101.699],
    marker_count: 7,
  },
  {
    id: 'list-21',
    title: 'Social Media Strategist',
    company: 'XYZ Company',
    match_score: 79,
    tags: ['Marketing', 'Freelance', 'RM 3,000 - RM 5,000 Per Annum', 'Kuala Lumpur, Malaysia'],
    type: 'Freelance',
    salary: 'RM 3,000 - RM 5,000 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Marketing',
    logo_color: 'from-blue-400 to-cyan-500',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.122, 101.722],
    marker_count: 6,
  },
  {
    id: 'list-22',
    title: 'Retail Sales Associate',
    company: 'XYZ Company',
    match_score: 70,
    tags: ['Sales', 'Part time', 'RM 1,800 - RM 2,800 Per Annum', 'Selangor, Malaysia'],
    type: 'Part time',
    salary: 'RM 1,800 - RM 2,800 Per Annum',
    location: 'Selangor, Malaysia',
    category: 'Sales',
    logo_color: 'from-orange-400 to-amber-600',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.073, 101.607],
    marker_count: 12,
  },
  {
    id: 'list-23',
    title: 'Mechanical Design Engineer',
    company: 'XYZ Company',
    match_score: 84,
    tags: ['Engineering', 'Full time', 'RM 4,500 - RM 7,000 Per Annum', 'Selangor, Malaysia'],
    type: 'Full time',
    salary: 'RM 4,500 - RM 7,000 Per Annum',
    location: 'Selangor, Malaysia',
    category: 'Engineering',
    logo_color: 'from-slate-400 to-slate-600',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.085, 101.583],
    marker_count: 15,
  },
  {
    id: 'list-24',
    title: 'Corporate Business Consultant',
    company: 'XYZ Company',
    match_score: 89,
    tags: ['Business', 'Fixed-Price', 'RM 7,000 - RM 10,000 Per Annum', 'Kuala Lumpur, Malaysia'],
    type: 'Fixed-Price',
    salary: 'RM 7,000 - RM 10,000 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Business',
    logo_color: 'from-indigo-400 to-blue-700',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.155, 101.715],
    marker_count: 9,
  },
  {
    id: 'list-25',
    title: 'Talent Acquisition Partner',
    company: 'XYZ Company',
    match_score: 87,
    tags: [
      'Human Resource',
      'Full time',
      'RM 5,000 - RM 7,500 Per Annum',
      'Kuala Lumpur, Malaysia',
    ],
    type: 'Full time',
    salary: 'RM 5,000 - RM 7,500 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Human Resource',
    logo_color: 'from-rose-400 to-pink-600',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.167, 101.662],
    marker_count: 14,
  },
  {
    id: 'list-26',
    title: 'Mobile App Developer',
    company: 'XYZ Company',
    match_score: 93,
    tags: ['Technology', 'Full time', 'RM 6,000 - RM 9,000 Per Annum', 'Kuala Lumpur, Malaysia'],
    type: 'Full time',
    salary: 'RM 6,000 - RM 9,000 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Technology',
    logo_color: 'from-sky-400 to-blue-600',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.142, 101.691],
    marker_count: 20,
  },
  {
    id: 'list-27',
    title: 'Investment Banker',
    company: 'XYZ Company',
    match_score: 95,
    tags: ['Finance', 'Full time', 'RM 10,000 - RM 15,000 Per Annum', 'Kuala Lumpur, Malaysia'],
    type: 'Full time',
    salary: 'RM 10,000 - RM 15,000 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Finance',
    logo_color: 'from-emerald-600 to-teal-800',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.157, 101.711],
    marker_count: 22,
  },
  {
    id: 'list-28',
    title: 'Logistics Operations Lead',
    company: 'XYZ Company',
    match_score: 81,
    tags: ['Business', 'Full time', 'RM 5,000 - RM 7,500 Per Annum', 'Klang, Malaysia'],
    type: 'Full time',
    salary: 'RM 5,000 - RM 7,500 Per Annum',
    location: 'Klang, Malaysia',
    category: 'Business',
    logo_color: 'from-violet-400 to-purple-600',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.044, 101.445],
    marker_count: 4,
  },
  {
    id: 'list-29',
    title: 'Online Course Coordinator',
    company: 'XYZ Company',
    match_score: 76,
    tags: ['Education', 'Part time', 'RM 2,500 - RM 4,500 Per Annum', 'Kuala Lumpur, Malaysia'],
    type: 'Part time',
    salary: 'RM 2,500 - RM 4,500 Per Annum',
    location: 'Kuala Lumpur, Malaysia',
    category: 'Education',
    logo_color: 'from-orange-300 to-amber-500',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.111, 101.642],
    marker_count: 11,
  },
  {
    id: 'list-30',
    title: 'Commercial Sales Executive',
    company: 'XYZ Company',
    match_score: 83,
    tags: ['Commerce', 'Full time', 'RM 4,000 - RM 6,000 Per Annum', 'Selangor, Malaysia'],
    type: 'Full time',
    salary: 'RM 4,000 - RM 6,000 Per Annum',
    location: 'Selangor, Malaysia',
    category: 'Commerce',
    logo_color: 'from-amber-500 to-yellow-600',
    skills_badge: { text: 'Skills aligned', variant: 'success' },
    occupation_badge: { text: 'Occupation Aligned', variant: 'success' },
    coords: [3.032, 101.618],
    marker_count: 17,
  },
];

interface SeededCategoryDetails {
  description: string;
  responsibilities: string[];
  skills: string[];
  preferredQualifications: string[];
  benefits: string[];
  aboutCompany: string;
  matchFactors: string[];
  postedDate: string;
  expireDate: string;
  jobLevel: string;
  experience: string;
  education: string;
  aiExplanation: string;
  skillGap: {
    readiness: number;
    skillsToStrengthen: string[];
    growthOpportunity: string;
    recommendation: string;
    summary: string;
  };
  occupationMatch: {
    score: number;
    whyMatches: string[];
    careerPath: string[];
    insight: string;
    summary: string;
  };
}

const getSeededCategoryDetails = (job: (typeof JOBS)[0]): SeededCategoryDetails => {
  const title = job.title.toLowerCase();
  const category = job.category.toLowerCase();

  if (category.includes('design') || title.includes('designer') || title.includes('creative')) {
    return {
      description:
        'We are looking for a Senior UI/UX Designer to design intuitive, scalable digital experiences across enterprise platforms.',
      responsibilities: [
        'Design end-to-end user experiences for web and mobile applications',
        'Create wireframes, prototypes, and high-fidelity UI designs',
        'Collaborate with product managers and developers on user requirements',
        'Conduct usability testing and iterate designs based on feedback',
        'Maintain consistency with design systems and brand guidelines',
      ],
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
      preferredQualifications: [
        'Experience with enterprise or SaaS platforms',
        'Familiarity with complex design systems',
        'Understanding of front-end constraints (HTML/CSS/React)',
      ],
      benefits: [
        'Health insurance coverage',
        'Flexible working arrangements',
        'Learning and development support',
        'Paid leave and holidays',
      ],
      aboutCompany:
        'XYZ Company builds scalable digital platforms across AI, data, and enterprise systems.',
      matchFactors: [
        'User Experience Design Expertise',
        'Design System Experience',
        'Figma & Prototyping Proficiency',
        'User Research Skills',
        'Cross-Functional Collaboration',
      ],
      postedDate: '14 Jun, 2026',
      expireDate: '14 Aug, 2026',
      jobLevel: 'Senior Level',
      experience: '5 Years',
      education: 'Graduation',
      aiExplanation:
        "Our AI has analyzed your profile and identified a strong alignment with this role. Your skills, work experience, qualifications, and career interests closely match the employer's requirements, making this opportunity highly relevant to you.",
      skillGap: {
        readiness: 78,
        skillsToStrengthen: [
          'UX Metrics & Data Analytics',
          'Design Leadership & Mentorship',
          'Accessibility (WCAG) Compliance',
          'Product Strategy & Business Alignment',
        ],
        growthOpportunity:
          'Developing these skills can enhance your ability to influence product strategy and lead design initiatives.',
        recommendation:
          'Consider expanding your expertise in design analytics, accessibility standards, and strategic product thinking.',
        summary:
          'Your profile aligns strongly with the core requirements of this role. A few advanced skills have been identified that could further strengthen your competitiveness for senior and leadership-level positions.',
      },
      occupationMatch: {
        score: job.match_score,
        whyMatches: [
          'Strong experience in user-centered design practices',
          'Proven expertise in wireframing and interaction design',
          'Experience collaborating with developers',
          'High alignment with digital product design requirements',
        ],
        careerPath: [
          'UI/UX Designer',
          'Senior UI/UX Designer',
          'Lead Product Designer',
          'Design Director',
        ],
        insight:
          'Consider expanding your expertise in design analytics, accessibility standards, and strategic product thinking.',
        summary:
          'Based on your portfolio, skills, project experience, and career progression, the following occupation has been identified as the strongest match.',
      },
    };
  } else if (
    category.includes('it') ||
    category.includes('technology') ||
    category.includes('engineering') ||
    title.includes('data') ||
    title.includes('analyst') ||
    title.includes('scientist') ||
    title.includes('planner') ||
    title.includes('engineer')
  ) {
    return {
      description:
        'We are looking for a skilled Data/Technology professional to build scalable software architectures.',
      responsibilities: [
        'Design and build reliable pipelines or analytical models',
        'Perform exploratory analysis to solve business challenges',
        'Collaborate with engineering and product teams',
        'Write clean, maintainable, and well-documented code',
        'Ensure data integrity and security compliance',
      ],
      skills: [
        'Data Analysis',
        'Python / Go',
        'SQL / NoSQL Databases',
        'Cloud Computing (AWS/GCP)',
        'Data Visualization',
        'Big Data Architecture',
        'API Development',
        'Agile Methodologies',
      ],
      preferredQualifications: [
        'Experience with cloud migrations',
        'Familiarity with Docker and CI/CD pipelines',
        'Understanding of big data frameworks (Kafka, Spark)',
      ],
      benefits: [
        'Comprehensive health and dental insurance',
        'Flexible working hours and hybrid options',
        'Annual training budget',
        'Paid time off and mental health days',
      ],
      aboutCompany:
        'XYZ Company builds scalable digital platforms across AI, data, and enterprise systems.',
      matchFactors: [
        'Data Analysis & Python Proficiency',
        'Database Design & SQL Expertise',
        'System Architecture & Cloud Foundation',
        'Analytical Ability',
        'Technical Documentation Skills',
      ],
      postedDate: '12 Jun, 2026',
      expireDate: '12 Aug, 2026',
      jobLevel: 'Intermediate Level',
      experience: '3 Years',
      education: "Bachelor's Degree",
      aiExplanation:
        "Our AI has analyzed your profile and identified a strong alignment with this role. Your skills, work experience, qualifications, and career interests closely match the employer's requirements, making this opportunity highly relevant to you.",
      skillGap: {
        readiness: 82,
        skillsToStrengthen: [
          'Cloud Data Architectures',
          'Big Data Technologies (Spark)',
          'Advanced MLOps / DevOps',
          'Leadership & Technical Mentorship',
        ],
        growthOpportunity:
          'Developing cloud architectures will accelerate your path to Senior Developer roles.',
        recommendation:
          'Expand your portfolio with end-to-end cloud deployments and study big data streaming architectures.',
        summary:
          'Your profile aligns strongly with the core requirements of this role. A few advanced skills have been identified that could further strengthen your competitiveness for senior and leadership-level positions.',
      },
      occupationMatch: {
        score: job.match_score,
        whyMatches: [
          'Strong foundation in quantitative analysis',
          'Experience using modern coding languages',
          'Proven record of translating analytical findings into business value',
          'High alignment with data-driven requirements',
        ],
        careerPath: [
          'Junior Developer / Analyst',
          'Software / Data Specialist',
          'Senior Engineer',
          'Principal Architect',
        ],
        insight:
          'Expanding your expertise in distributed computing will prepare you for lead developer and architect roles.',
        summary:
          'Based on your portfolio, skills, project experience, and career progression, the following occupation has been identified as the strongest match.',
      },
    };
  } else {
    return {
      description:
        'We are seeking an operational strategist to manage commerce integrations and business planning.',
      responsibilities: [
        'Manage day-to-day operations and execute business strategies',
        'Analyze operational performance and recommend improvements',
        'Coordinate cross-functional projects',
        'Engage with clients and partners',
        'Track KPI metrics and report to leadership',
      ],
      skills: [
        'Project Management',
        'Business Strategy',
        'Operations Management',
        'Stakeholder Engagement',
        'KPI Tracking',
        'Financial Analysis',
        'Client Relations',
        'Process Optimization',
      ],
      preferredQualifications: [
        'Experience in commerce, finance, or retail operations',
        'Familiarity with Jira, Confluence, or project management boards',
        'Understanding of financial forecasting',
      ],
      benefits: [
        'Health and wellness coverage',
        'Flexible hybrid workspace settings',
        'Performance-based bonuses',
        'Generous leave package',
      ],
      aboutCompany:
        'XYZ Company builds scalable digital platforms across AI, data, and enterprise systems.',
      matchFactors: [
        'Project Coordination & Management',
        'Operations Strategy & Optimization',
        'Stakeholder Communication Skills',
        'Analytical Aptitude',
        'Problem-Solving Skills',
      ],
      postedDate: '10 Jun, 2026',
      expireDate: '10 Aug, 2026',
      jobLevel: 'Mid-Senior Level',
      experience: '4 Years',
      education: "Bachelor's Degree",
      aiExplanation:
        "Our AI has analyzed your profile and identified a strong alignment with this role. Your skills, work experience, qualifications, and career interests closely match the employer's requirements, making this opportunity highly relevant to you.",
      skillGap: {
        readiness: 75,
        skillsToStrengthen: [
          'Financial Modeling & Budgeting',
          'Change Management & Restructuring',
          'Advanced Negotiation Tactics',
          'Executive Communication',
        ],
        growthOpportunity:
          'Strengthening financial analysis will position you for Director-level roles.',
        recommendation:
          'Gain experience leading cross-functional restructures and pursue Change Management certifications.',
        summary:
          'Your profile aligns strongly with the core requirements of this role. A few advanced skills have been identified that could further strengthen your competitiveness for senior and leadership-level positions.',
      },
      occupationMatch: {
        score: job.match_score,
        whyMatches: [
          'Proven record of coordinating cross-department operations',
          'Strong capability in operational data tracking',
          'Experience resolving external partner problems',
          'Good match with enterprise coordination expectations',
        ],
        careerPath: [
          'Operations Coordinator',
          'Operations Specialist',
          'Operations Manager',
          'VP of Operations',
        ],
        insight:
          'Building expertise in corporate finance and strategy execution will qualify you for operations director positions.',
        summary:
          'Based on your portfolio, skills, project experience, and career progression, the following occupation has been identified as the strongest match.',
      },
    };
  }
};

const PATHWAY_OPTIONS = [
  {
    id: 'uiux-senior',
    title: 'Senior UI UX Designer',
    masco_code: '2166',
    level: 'Senior Level',
    fit_score: 91,
    is_recommended: true,
    description:
      'Your 4+ years of hands-on work across agency and enterprise environments, combined with strong Figma, prototyping, and usability testing skills, place you close to a Senior UI UX Designer role. Closing gaps in design leadership and research methods will complete the progression.',
    career_paths: ['UI/UX Designer (Now)', 'Mid-level Designer*', 'Senior UI/UX Designer'],
    skill_gaps_count: 2,
    vacancies_count: 35,
    demand_level: 'High',
    demand_category: 'Tech & E-commerce',
  },
  {
    id: 'research-lead',
    title: 'UX Research Lead',
    masco_code: '2166',
    level: 'Research specialist',
    fit_score: 72,
    is_recommended: false,
    description:
      'A research-focused pathway for designers who prefer discovery and strategy over visual execution. Requires building depth in qualitative and quantitative research methodologies and stakeholder facilitation skills.',
    career_paths: ['UI/UX Designer (Now)', 'UX Researcher', 'UX Research Lead'],
    skill_gaps_count: 6,
    vacancies_count: 14,
    demand_level: 'Growing',
    demand_category: 'Product Consulting',
  },
  {
    id: 'product-manager',
    title: 'Product Design Manager',
    masco_code: '1219',
    level: 'Management track',
    fit_score: 83,
    is_recommended: false,
    description:
      'A larger team management pathway that combines design leadership with team management and product strategy. Requires significant experience leading design squads and cross-functional stakeholders at a senior level.',
    career_paths: [
      'UI/UX Designer (Now)',
      'Senior Designer',
      'Design Lead',
      'Product Design Manager',
    ],
    skill_gaps_count: 5,
    vacancies_count: 18,
    demand_level: 'Very High',
    demand_category: 'Fintech & Enterprise',
  },
];

interface SeededSkillGap {
  id: string;
  title: string;
  description: string;
  percentage: number;
  level: string;
  recommendedTraining: string;
}

interface SeededFutureSignal {
  id: string;
  name: string;
  demand: string;
  score: number;
}

interface SeededTraining {
  id: string;
  title: string;
  platform: string;
  duration: string;
  cost: string;
  badgeText: string;
  badgeType: string;
}

const PATHWAY_DETAILS: Record<
  string,
  { skillGaps: SeededSkillGap[]; futureSignals: SeededFutureSignal[]; trainings: SeededTraining[] }
> = {
  'uiux-senior': {
    skillGaps: [
      {
        id: 'sg-1',
        title: 'User research & moderated testing',
        description: 'Required for Senior Analyst roles in Field size',
        percentage: 24,
        level: 'beginner',
        recommendedTraining: 'Google UX Design Professional Certificate',
      },
      {
        id: 'sg-2',
        title: 'Advanced design systems & governance',
        description: 'Required for Senior Analyst roles in Field size',
        percentage: 43,
        level: 'developing',
        recommendedTraining: 'Design Systems Mastery — Figma to Production',
      },
      {
        id: 'sg-3',
        title: 'Stakeholder facilitation & workshop leadership',
        description: 'Required for Senior Analyst roles in Field size',
        percentage: 57,
        level: 'proficient',
        recommendedTraining: 'Design Thinking & Stakeholder Facilitation Workshop',
      },
    ],
    futureSignals: [
      { id: 'fs-1', name: 'AI-assisted design', demand: 'Very High', score: 95 },
      { id: 'fs-2', name: 'Design systems', demand: 'High', score: 80 },
      { id: 'fs-3', name: 'Accessibility (WCAG)', demand: 'Growing', score: 65 },
      { id: 'fs-4', name: 'User research', demand: 'Growing', score: 60 },
      { id: 'fs-5', name: 'Figma / prototyping', demand: 'Stable', score: 40 },
    ],
    trainings: [
      {
        id: 't-1',
        title: 'Google UX Design Professional Certificate',
        platform: 'Coursera - Google',
        duration: '180 hrs - Self-paced',
        cost: 'RM 850',
        badgeText: 'Closes: User research & moderated testing',
        badgeType: 'warning',
      },
      {
        id: 't-2',
        title: 'Design Systems Mastery — Figma to Production',
        platform: 'Coursera - Google',
        duration: '180 hrs - Self-paced',
        cost: 'RM 850',
        badgeText: 'Closes: Design systems governance',
        badgeType: 'info',
      },
      {
        id: 't-3',
        title: 'Design Thinking & Stakeholder Facilitation Workshop',
        platform: 'Coursera - Google',
        duration: '180 hrs - Self-paced',
        cost: 'RM 850',
        badgeText: 'Closes: Cross-functional facilitation',
        badgeType: 'warning',
      },
    ],
  },
  'research-lead': {
    skillGaps: [
      {
        id: 'sg-4',
        title: 'Quantitative Research Methods',
        description: 'Required for lead researcher roles across clusters',
        percentage: 15,
        level: 'beginner',
        recommendedTraining: 'Advanced Quantitative UX Research Certification',
      },
      {
        id: 'sg-5',
        title: 'Cognitive Psychology & Interaction Models',
        description: 'Required for research and evaluation roles',
        percentage: 38,
        level: 'developing',
        recommendedTraining: 'Cognitive Psychology in Product Design',
      },
    ],
    futureSignals: [
      { id: 'fs-6', name: 'Behavioral data mapping', demand: 'Very High', score: 90 },
      { id: 'fs-7', name: 'Qualitative interviewing', demand: 'High', score: 85 },
    ],
    trainings: [
      {
        id: 't-5',
        title: 'Advanced Quantitative UX Research Certification',
        platform: 'Coursera - Google',
        duration: '120 hrs - Self-paced',
        cost: 'RM 750',
        badgeText: 'Closes: Quantitative Research Methods',
        badgeType: 'warning',
      },
    ],
  },
  'product-manager': {
    skillGaps: [
      {
        id: 'sg-7',
        title: 'Product Strategy, Business Modeling & OKRs',
        description: 'Required for leadership positions in tech strategy',
        percentage: 20,
        level: 'beginner',
        recommendedTraining: 'Product Strategy for Design Leaders',
      },
    ],
    futureSignals: [{ id: 'fs-11', name: 'Product strategy', demand: 'Very High', score: 92 }],
    trainings: [
      {
        id: 't-8',
        title: 'Product Strategy for Design Leaders',
        platform: 'Reforge',
        duration: '110 hrs - Self-paced',
        cost: 'RM 950',
        badgeText: 'Closes: Product Strategy, Business Modeling & OKRs',
        badgeType: 'warning',
      },
    ],
  },
};

const WHY_MATCHED_SIGNAL_CARDS = [
  {
    title: 'End-to-end complex flow ownership',
    weight: 'High weight',
    isHigh: true,
    description:
      'The JD specifically mentions "leading end-to-end design for complex digital products". Your resume indicates you managed full product lifecycle design.',
    highlight:
      'From your resume: Led end-to-end redesign of 7-step checkout flow reducing drop-off by 34%.',
    iconKey: 'flow',
  },
  {
    title: 'B2C design at scale',
    weight: 'High weight',
    isHigh: true,
    description:
      "Experience designing for consumer products with millions of users matches the employer's scale. Your profile highlights working on high-traffic retail systems.",
    highlight:
      'From your resume: Designed consumer onboarding flow scaled to 1.2M active monthly users.',
    iconKey: 'users',
  },
  {
    title: 'Design systems experience',
    weight: 'Medium weight',
    isHigh: false,
    description:
      'Understanding of component-driven libraries and design consistency. Your resume notes active collaboration on keeping enterprise library updates synchronized.',
    highlight:
      'From your resume: Created and maintained design system libraries in Figma for 15+ developers.',
    iconKey: 'designSystem',
  },
  {
    title: 'Usability testing & research fluency',
    weight: 'Medium weight',
    isHigh: false,
    description:
      'Validating design choices with qualitative research. Your history of conducting testing sessions matches the target role.',
    highlight:
      'From your resume: Conducted 24 remote usability tests and implemented visual layout enhancements.',
    iconKey: 'usability',
  },
];

const WHY_MATCHED_DIMENSION_SCORES = [
  { label: 'Skills match', value: 92, color: 'bg-emerald-500' },
  { label: 'Experience level', value: 88, color: 'bg-emerald-500' },
  { label: 'Portfolio relevance', value: 60, color: 'bg-warning-orange' },
  { label: 'Domain fit', value: 80, color: 'bg-emerald-500' },
  { label: 'Leadership signals', value: 92, color: 'bg-emerald-500' },
];

const WHY_MATCHED_REQUIREMENTS = [
  {
    text: "Own the UX for Razorpay's core checkout product — 5+1 product experience required",
    isMatch: true,
  },
  {
    text: '5+ years of product design, with at least 2 years in a lead or senior role',
    isMatch: true,
  },
  {
    text: 'Strong interaction design and prototyping skills — Figma proficiency essential',
    isMatch: true,
  },
  {
    text: 'Experience designing for high-scale consumer products with millions of users',
    isMatch: true,
  },
  {
    text: 'Ability to run your own user research and translate insights to product decisions',
    isMatch: true,
  },
  {
    text: 'Collaborate with cross-functional teams — PMs, engineers, data analysts',
    isMatch: true,
  },
  { text: 'Familiarity with fintech / payments domain — checkout preferred', isMatch: false },
];

const seed = async (): Promise<void> => {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Seeder connected to Postgres.');

    const schemaPath = path.join(__dirname, '../schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('Database tables re-initialized successfully.');

    for (const job of JOBS) {
      const qJobs = `
        INSERT INTO jobs (id, title, company, match_score, tags, type, salary, location, category, logo_color, skills_badge, occupation_badge, coords, marker_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `;
      await client.query(qJobs, [
        job.id,
        job.title,
        job.company,
        job.match_score,
        job.tags,
        job.type,
        job.salary,
        job.location,
        job.category,
        job.logo_color,
        JSON.stringify(job.skills_badge),
        JSON.stringify(job.occupation_badge),
        job.coords,
        job.marker_count,
      ]);

      const details = getSeededCategoryDetails(job);
      const qDetails = `
        INSERT INTO job_details (job_id, description, requirements, benefits, category_details)
        VALUES ($1, $2, $3, $4, $5)
      `;
      await client.query(qDetails, [
        job.id,
        JSON.stringify({ text: details.description }),
        JSON.stringify(details.responsibilities),
        JSON.stringify(details.benefits),
        JSON.stringify(details),
      ]);

      const qWhy = `
        INSERT INTO job_why_matched (job_id, ai_explanation, signal_cards, dimension_scores, requirements)
        VALUES ($1, $2, $3, $4, $5)
      `;
      const aiExp = `Our AI has analyzed your profile and identified a strong alignment with this ${job.title} role. Your skills, work experience, qualifications, and career interests closely match the employer's requirements, making this opportunity highly relevant to you.`;

      await client.query(qWhy, [
        job.id,
        aiExp,
        JSON.stringify(WHY_MATCHED_SIGNAL_CARDS),
        JSON.stringify(WHY_MATCHED_DIMENSION_SCORES),
        JSON.stringify(WHY_MATCHED_REQUIREMENTS),
      ]);
    }
    console.log(
      `Seeded ${JOBS.length.toString()} jobs, job details, and match metadata successfully.`,
    );

    for (const opt of PATHWAY_OPTIONS) {
      const qOpt = `
        INSERT INTO pathway_options (id, title, masco_code, level, fit_score, is_recommended, description, career_paths, skill_gaps_count, vacancies_count, demand_level, demand_category)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `;
      await client.query(qOpt, [
        opt.id,
        opt.title,
        opt.masco_code,
        opt.level,
        opt.fit_score,
        opt.is_recommended,
        opt.description,
        opt.career_paths,
        opt.skill_gaps_count,
        opt.vacancies_count,
        opt.demand_level,
        opt.demand_category,
      ]);

      const details = PATHWAY_DETAILS[opt.id];
      if (!details) {
        throw new Error(`Pathway details not found for pathway ID: ${opt.id}`);
      }
      const qPathDetails = `
        INSERT INTO pathway_details (pathway_id, skill_gaps, future_signals, trainings)
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(qPathDetails, [
        opt.id,
        JSON.stringify(details.skillGaps),
        JSON.stringify(details.futureSignals),
        JSON.stringify(details.trainings),
      ]);
    }
    console.log(
      `Seeded ${PATHWAY_OPTIONS.length.toString()} career pathways & detailed mappings successfully.`,
    );
  } catch (error) {
    console.error('Seeding database failed:', error);
  } finally {
    await client.end();
    console.log('Seeder disconnected.');
  }
};

void seed();
