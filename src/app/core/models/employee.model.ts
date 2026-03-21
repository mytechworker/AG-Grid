export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  country: string;
  status: 'Active' | 'Inactive';
  joinDate: Date;
  performance: number;
  revenue: number;
}

export const DEPARTMENTS: string[] = [
  'Engineering',
  'Sales',
  'Marketing',
  'HR',
  'Finance',
  'Operations',
  'Legal',
  'Support',
];

export const COUNTRIES: string[] = [
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'France',
  'Australia',
  'India',
  'Japan',
  'Brazil',
  'Mexico',
  'Spain',
  'Italy',
  'Netherlands',
  'Sweden',
  'Switzerland',
  'Singapore',
  'South Korea',
  'Ireland',
  'New Zealand',
  'Norway',
];

export const ROLES: string[] = [
  'Software Engineer',
  'Senior Software Engineer',
  'Product Manager',
  'Data Analyst',
  'UX Designer',
  'DevOps Engineer',
  'QA Engineer',
  'Technical Lead',
  'Engineering Manager',
  'Sales Representative',
  'Marketing Specialist',
  'HR Coordinator',
  'Financial Analyst',
  'Operations Manager',
  'Customer Support Specialist',
];

export const STATUSES: ('Active' | 'Inactive')[] = ['Active', 'Inactive'];
