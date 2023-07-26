import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Instrument, InstrumentDocument } from '../../models';
import { InstrumentDto } from '../../../dto';
import { ServiceParticipationService } from '../service-participation/service-participation.service';

@Injectable()
export class InstrumentService {
  public static readonly LEADER_LABEL = 'Ответственный за служение';

  constructor(
    @InjectModel(Instrument.name) private instrument: Model<InstrumentDocument>,
    private serviceParticipationService: ServiceParticipationService,
  ) {
    this.checkForLeaderInstrumentPresent();
  }

  private async checkForLeaderInstrumentPresent() {
    const leader = await this.findLeader();
    if (!leader) {
      await this.create({
        _id: null,
        isUsed: false,
        name: InstrumentService.LEADER_LABEL,
      });
    }
  }

  create(dto: InstrumentDto) {
    return this.instrument.create(dto);
  }

  async update(id: string, dto: InstrumentDto) {
    const instrument = await this.instrument.findById(id);
    instrument.name = dto.name;
    await instrument.save();
    return instrument;
  }

  delete(id: string) {
    return this.instrument.findByIdAndDelete(id);
  }

  async findAll() {
    const instruments = await this.instrument.find().exec();
    const result: InstrumentDto[] = [];
    for (const instrument of instruments) {
      const isUsed =
        instrument.name === InstrumentService.LEADER_LABEL
          ? true
          : await this.serviceParticipationService.isInstrumentUsed(
              instrument.id,
            );
      result.push({
        name: instrument.name,
        _id: instrument.id,
        isUsed: !!isUsed,
      });
    }

    return result;
  }

  async findAllDocs() {
    return this.instrument.find();
  }

  getInstrumentsByIds(ids: string[]) {
    return this.instrument.find({
      _id: {
        $in: ids,
      },
    });
  }

  async findLeader() {
    return this.instrument.findOne({
      name: InstrumentService.LEADER_LABEL,
    });
  }
}
