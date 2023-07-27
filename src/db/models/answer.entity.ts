import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AnswerDocument = HydratedDocument<Answer>;

@Schema()
export class Answer {
  @Prop()
  answer: string[];
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  questionId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  lessonId: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);
