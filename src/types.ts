export type SkillCategory = 'Logic' | 'Syntax' | 'Algorithms' | 'Debugging';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  type: 'multiple-choice' | 'code-logic' | 'pattern-matching';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface PreparationStep {
  day: number;
  task: string;
  resourceLink?: string;
}

export interface JobOpening {
  id: string;
  company: string;
  role: string;
  description: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Internship' | 'Contract';
  requiredSkills: SkillCategory[];
  matchScore: number;
  postedDate: string;
  preparationSchedule: PreparationStep[];
}

export interface UserStats {
  name: string;
  bio: string;
  education?: string;
  github?: string;
  portfolio?: string;
  location?: string;
  level: number;
  xp: number;
  skills: Record<SkillCategory, number>;
  completedTasks: string[];
}

export interface Resource {
  title: string;
  url: string;
  description: string;
  category: SkillCategory;
}
