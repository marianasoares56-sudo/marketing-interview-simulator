export type QuestionCategory = 'behavioral' | 'case' | 'situational';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  multipleChoice: string[];
  hint?: string;
}

export interface StarAnalysis {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface Feedback {
  questionId: string;
  strengths: string[];
  improvements: string[];
  starAnalysis?: StarAnalysis;
  score: number;
  overallComment: string;
}

export interface SessionConfig {
  category: QuestionCategory;
  difficulty: Difficulty;
  jobDescription: string;
}

export interface SessionData {
  config: SessionConfig;
  questions: Question[];
  answers: Record<string, string>;
  feedback: Record<string, Feedback>;
}
