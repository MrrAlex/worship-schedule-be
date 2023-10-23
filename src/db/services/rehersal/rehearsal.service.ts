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
    return this.rehearsal.find().exec();
  }

  create(dto: RehearsalDto) {
    const reh = new Rehearsal();
    reh.place = new Types.ObjectId(dto.place);
    reh.date = dto.date;
    return this.rehearsal.create(reh);
  }

  async update(id: string, dto: RehearsalDto) {
    const found = await this.rehearsal.findById(id);
    found.place = new Types.ObjectId(dto.place);
    found.date = dto.date;
    await found.save();

    return found;
  }
}
