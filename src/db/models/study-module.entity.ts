import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Lesson } from './lesson.entity';

export type StudyModuleDocument = HydratedDocument<StudyModule>;

@Schema()
export class StudyModule {
  @Prop()
  name: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  })
  lessons: Lesson[];
}

export const StudyModuleSchema = SchemaFactory.createForClass(StudyModule);
