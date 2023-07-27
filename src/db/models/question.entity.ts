import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { QuestionConfig } from '../../dto/question.dto';
import { Lesson } from './lesson.entity';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  @Prop()
  type: string;

  @Prop({ type: Object })
  config: QuestionConfig;

  @Prop()
  lessonId: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
