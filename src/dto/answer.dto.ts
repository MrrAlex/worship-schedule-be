import mongoose from 'mongoose';
import { QuestionConfig } from './question.dto';

export class AnswerDto {
  _id: string;
  questionId: string;
  answer: string[];
  lessonId: string;
  userId?: string;
}

export class AnswerDtoWithIds {
  _id: string;
  questionId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  answer: string[];
}

export interface AnswerPdfAggregate {
  answer: string[];
  type: string;
  config: QuestionConfig;
}
