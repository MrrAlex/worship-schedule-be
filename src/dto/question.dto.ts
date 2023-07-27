export class QuestionDto {
  _id: string;
  type: string;
  config: QuestionConfig;
  lessonId: string;
}

export interface QuestionConfig {
  question: string;
  options: QuestionOptions[];
}

export interface QuestionOptions {
  value: string;
  label: string;
}
