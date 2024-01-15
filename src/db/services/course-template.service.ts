import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CourseTemplate,
  CourseTemplateDocument,
} from '../models/course-template.entity';

@Injectable()
export class CourseTemplateService {
  constructor(
    @InjectModel(CourseTemplate.name)
    private template: Model<CourseTemplateDocument>,
  ) {}

  async findTemplateByCourseId(course: string) {
    const config = await this.template
      .findOne({ course: new Types.ObjectId(course) })
      .exec();
    return config?.template ?? null;
  }
}
