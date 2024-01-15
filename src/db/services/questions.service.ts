import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudyModuleService } from './study-module.service';
import { Question, QuestionDocument } from '../models/question.entity';
import { QuestionDto } from '../../dto/question.dto';
import { AnswerPdfAggregate } from '../../dto/answer.dto';
import { CourseService } from './course.service';
import { LessonService } from './lesson.service';
import { LessonDocument } from "../models/lesson.entity";

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name)
    private question: Model<QuestionDocument>,
    private courseService: CourseService,
    private moduleService: StudyModuleService,
    private lessonService: LessonService,
  ) {}

  async findAllForPdf(
    userId: string,
    module: string,
    course: string,
  ): Promise<AnswerPdfAggregate[]> {
    const lessonsForUser =
      module !== 'all'
        ? (await this.moduleService.findOneNoLessons(module)).lessons
        : await this.courseService.getLessonIdsInCourse(course);

    return this.question.aggregate([
      {
        $match: {
          lessonId: {
            $in: lessonsForUser.map((l) => l.toString()),
          },
          type: {
            $ne: 'download',
          },
        },
      },
      {
        $lookup: {
          from: 'answers',
          let: { id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$questionId', '$$id'] },
                    { $eq: ['$userId', userId] },
                  ],
                },
              },
            },
          ],
          as: 'answer',
        },
      },
      {
        $unwind: {
          path: '$answer',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$lessonId',
          answers: {
            $push: {
              type: '$type',
              config: '$config',
              answer: '$answer.answer',
            },
          },
        },
      },
    ]);
  }

  async create(question: QuestionDto) {
    return this.question.create(question);
  }

  async assignQuestionToLesson(lessonId: string, questions: QuestionDto[]) {
    const created = [];
    for (const item of questions) {
      let question;
      if (item._id && !item._id.includes('question-')) {
        question = await this.question.findById(item._id);
        question.config = item.config;
        await question.save();
      } else {
        delete item._id;
        question = await this.create({ ...item, lessonId });
      }
      created.push(question);
    }

    const lesson = await this.lessonService.findOne(lessonId);
    lesson.questions = created;
    await lesson.save();
    return lesson;
  }
}
