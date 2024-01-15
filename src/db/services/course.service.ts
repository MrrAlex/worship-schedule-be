import { Injectable } from '@nestjs/common';
import { CreateCourseDto, UpdateCourseDto } from '../../dto/course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from '../models/course.entity';
import { Model, Types } from 'mongoose';
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

  async courseIdByModuleId(module: string) {
    const obj = await this.courseModel
      .findOne({ modules: { $in: module } })
      .exec();

    return obj.id;
  }

  async getLessonIdsInCourse(course: string) {
    const lessons = await this.courseModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(course),
        },
      },
      {
        $unwind: {
          path: '$modules',
        },
      },
      {
        $lookup: {
          from: 'studymodules',
          localField: 'modules',
          foreignField: '_id',
          as: 'module',
        },
      },
      {
        $unwind: {
          path: '$module',
        },
      },
      {
        $replaceRoot: {
          newRoot: '$module',
        },
      },
      {
        $unwind: {
          path: '$lessons',
        },
      },
      {
        $group: {
          _id: null,
          lessons: { $addToSet: '$lessons' },
        },
      },
    ]);

    return lessons[0].lessons;
  }
}
