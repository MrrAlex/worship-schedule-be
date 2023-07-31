import { Injectable } from '@nestjs/common';
import {
  StudyModuleDto,
  UpdateStudyModuleDto,
} from '../../dto/study-module.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  StudyModule,
  StudyModuleDocument,
} from '../models/study-module.entity';
import { Model } from 'mongoose';
import { Lesson, LessonDocument } from '../models/lesson.entity';
import { LessonDto } from '../../dto/lesson.dto';
import { StudyModuleService } from './study-module.service';
import { AnswerService } from './answer.service';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name)
    private lesson: Model<LessonDocument>,
    private studyModuleService: StudyModuleService,
    private answerService: AnswerService,
  ) {}

  findOne(id: string) {
    return this.lesson.findById(id).populate('questions');
  }

  create(lessonDto: LessonDto) {
    return this.lesson.create(lessonDto);
  }

  async update(id: string, lessonDto: LessonDto) {
    const lesson = await this.lesson.findById(id);
    lesson.name = lessonDto.name;
    await lesson.save();
    return lesson;
  }

  async assignLessonToModule(lessonDto: LessonDto, moduleId: string) {
    const lesson = await this.create(lessonDto);
    return this.studyModuleService.assignLesson(lesson, moduleId);
  }

  getAnswersByLesson(id: string, userId: string) {
    return this.answerService.getAnswersByLesson(id, userId);
  }
}
