import { Injectable } from '@nestjs/common';
import { CreateCourseDto, UpdateCourseDto } from '../../dto/course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from '../models/course.entity';
import { Model } from 'mongoose';
import { Lesson } from '../models/lesson.entity';
import { StudyModule } from '../models/study-module.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    return this.courseModel.create(createCourseDto);
  }

  findAll() {
    return this.courseModel.find();
  }

  findOne(id: string) {
    return this.courseModel.findById(id).populate({
      path: 'modules',
      populate: {
        path: 'lessons',
        model: 'Lesson',
      },
    });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseModel.findById(id);
    course.name = updateCourseDto.name;
    course.description = updateCourseDto.description;
    await course.save();
    return course;
  }

  async assignModule(module: StudyModule, courseId: string) {
    const course = await this.courseModel.findById(courseId);
    course.modules.push(module);
    await course.save();
    return this.findOne(courseId);
  }
}
