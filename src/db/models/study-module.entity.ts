import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from "mongoose";
import { Lesson } from './lesson.entity';

export type StudyModuleDocument = HydratedDocument<StudyModule>;

@Schema()
export class StudyModule {
  @Prop()
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  })
  lessons: Lesson[] | Types.ObjectId[];
}

export const StudyModuleSchema = SchemaFactory.createForClass(StudyModule);
