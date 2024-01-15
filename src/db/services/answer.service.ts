import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Answer, AnswerDocument } from '../models/answer.entity';
import { AnswerDto } from '../../dto/answer.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer.name)
    private answer: Model<AnswerDocument>,
  ) {}

  findOne(id: string) {
    return this.answer.findById(id);
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