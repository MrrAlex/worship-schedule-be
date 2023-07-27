import { QuestionDto } from './question.dto';

export class LessonDto {
  _id: string;
  name: string;
  questions: QuestionDto[];
}
