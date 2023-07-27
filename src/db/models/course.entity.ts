import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { StudyModule } from './study-module.entity';

export type CourseDocument = HydratedDocument<Course>;

@Schema()
export class Course {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudyModule' }],
  })
  modules: StudyModule[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
