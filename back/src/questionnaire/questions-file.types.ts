export type QuestionType = 'scale';

export interface ScaleOptions {
  min: number;
  max: number;
}

export interface QuestionFileEntry {
  id: number;
  label: string;
  type: QuestionType;
  options: ScaleOptions;
  weight: number;
  active: boolean;
}

export interface QuestionsFile {
  version: string;
  questions: QuestionFileEntry[];
}
