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
import { Model, Types } from 'mongoose';
import { Lesson, LessonDocument } from '../models/lesson.entity';
import { LessonDto } from '../../dto/lesson.dto';
import { StudyModuleService } from './study-module.service';
import { Question, QuestionDocument } from '../models/question.entity';
import { QuestionDto } from '../../dto/question.dto';
import { LessonService } from './lesson.service';
import { AnswerPdfAggregate } from '../../dto/answer.dto';
import * as lodash from 'lodash';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name)
    private question: Model<QuestionDocument>,
    private lessonService: LessonService,
    private moduleService: StudyModuleService,
  ) {}

  async findAllForPdf(
    userId: string,
    module: string,
  ): Promise<AnswerPdfAggregate[]> {
    let lessonsForUser = await this.lessonService.getLessonIds();
    if (module !== 'all') {
      const availableLessons = await this.moduleService.findOneNoLessons(
        module,
      );
      lessonsForUser = lodash.intersectionWith(
        availableLessons.lessons,
        lessonsForUser,
        (a: Types.ObjectId, b: Types.ObjectId) => a.toString() === b.toString(),
      );
    }

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
                    { $gte: ['$userId', userId] },
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
