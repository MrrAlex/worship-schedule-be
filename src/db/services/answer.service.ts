import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Answer, AnswerDocument } from '../models/answer.entity';
import { AnswerDto, AnswerPdfAggregate } from '../../dto/answer.dto';
import { StudyModuleService } from './study-module.service';
import { Question, QuestionDocument } from '../models/question.entity';

import * as lodash from 'lodash';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer.name)
    private answer: Model<AnswerDocument>,
    @InjectModel(Question.name)
    private question: Model<QuestionDocument>,
    private moduleService: StudyModuleService,
  ) {}

  findOne(id: string) {
    return this.answer.findById(id);
  }

  async findAllForPdf(
    userId: string,
    module: string,
  ): Promise<AnswerPdfAggregate[]> {
    let lessonsForUser = await this.answer
      .find({ userId })
      .distinct('lessonId');
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

    return this.question
      .aggregate([
        {
          $match: {
            lessonId: {
              $in: lessonsForUser.map((l) => l.toString()),
            },
          },
        },
        {
          $lookup: {
            from: 'answers',
            localField: '_id',
            foreignField: 'questionId',
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
        // {
        //   $lookup: {
        //     from: 'lessons',
        //     localField: '_id',
        //     foreignField: '_id',
        //     as: 'lesson',
        //   },
        // },
        // {
        //   $unwind: {
        //     path: '$lesson',
        //   },
        // },
        // {
        //   $project: {
        //     lesson: 0,
        //     name: '$lesson.name',
        //   },
        // },
      ])
      .exec();
  }

  createOne(dto: AnswerDto) {
    return this.answer.create(dto);
  }

  async update(id: string, dto: AnswerDto) {
    const answer = await this.findOne(id);
    answer.answer = dto.answer;
    await answer.save();
    return answer;
  }

  async createMany(dtos: AnswerDto[], userId: string) {
    const result = [];
    for (const dto of dtos) {
      let saved;
      if (dto._id) {
        saved = await this.findOne(dto._id);
        saved.answer = dto.answer;
        await saved.save();
      } else {
        saved = await this.createOne({ ...dto, userId });
      }
      result.push(saved);
    }

    return result;
  }

  getAnswersByLesson(lessonId: string, userId: string) {
    return this.answer.find({ lessonId, userId });
  }
}
