import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Course } from './course.entity';

export type CourseTemplateDocument = HydratedDocument<CourseTemplate>;

@Schema()
export class CourseTemplate {
  @Prop()
  template: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  course: Course | Types.ObjectId;
}

export const CourseTemplateSchema =
  SchemaFactory.createForClass(CourseTemplate);
