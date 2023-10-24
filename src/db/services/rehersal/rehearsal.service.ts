import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Rehearsal,
  RehearsalDocument,
  RehearsalPlace,
  RehearsalPlaceDocument,
} from '../../models';
import { RehearsalDto } from '../../../dto/rehearsal.dto';

@Injectable()
export class RehearsalService {
  constructor(
    @InjectModel(Rehearsal.name)
    private rehearsal: Model<RehearsalDocument>,
    @InjectModel(RehearsalPlace.name)
    private place: Model<RehearsalPlaceDocument>,
  ) {}

  findAllPlaces() {
    return this.place.find().exec();
  }

  findAll() {
    return this.rehearsal.find().populate('place').exec();
  }

  create(dto: RehearsalDto) {
    const reh = new Rehearsal();
    reh.place = new Types.ObjectId(dto.placeId);
    reh.date = dto.date;
    return this.rehearsal.create(reh);
  }

  async update(id: string, dto: RehearsalDto) {
    const found = await this.rehearsal.findById(id);
    found.place = new Types.ObjectId(dto.placeId);
    found.date = dto.date;
    await found.save();

    return found;
  }

  async delete(id: string) {
    return this.rehearsal.findByIdAndDelete(id).exec();
  }

  getTwoNext() {
    return this.rehearsal
      .find(
        {
          date: {
            $gte: new Date(),
          },
        },
        null,
        { limit: 2 },
      )
      .populate('place')
      .exec();
  }
}
