import { Injectable } from '@nestjs/common';
import { StudyModuleDto } from '../../dto/study-module.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  StudyModule,
  StudyModuleDocument,
} from '../models/study-module.entity';
import { Model, Types } from 'mongoose';
import { CourseService } from './course.service';

@Injectable()
export class StudyModuleService {
  constructor(
    @InjectModel(StudyModule.name)
    private studyModule: Model<StudyModuleDocument>,
    private courseService: CourseService,
  ) {}

  async addNewModuleToCourse(
    createStudyModuleDto: StudyModuleDto,
    courseId: string,
  ) {
    const module = await this.create(createStudyModuleDto);
    return this.courseService.assignModule(module, courseId);
  }

  create(createStudyModuleDto: StudyModuleDto) {
    return this.studyModule.create(createStudyModuleDto);
  }

  findAll() {
    return `This action returns all studyModule`;
  }

  findOneNoLessons(id: string) {
    return this.studyModule.findById(id);
  }

  findModuleByLesson(lesson: string) {
    return this.studyModule.findOne({ lessons: lesson });
  }

  findOne(id: string) {
    return this.studyModule.findById(id).populate('lessons');
  }

  async update(id: string, dto: StudyModuleDto) {
    const module = await this.findOne(id);
    module.name = dto.name;
    await module.save();
    return module;
  }

  async assignLesson(lesson: Types.ObjectId, moduleId: string) {
    const module = await this.studyModule.findById(moduleId);
    module.lessons = [...(module.lessons as Types.ObjectId[]), lesson];
    await module.save();
    return this.findOne(moduleId);
  }
}
