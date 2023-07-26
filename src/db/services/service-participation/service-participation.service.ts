import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ServiceParticipation,
  ServiceParticipationDocument,
} from '../../models';
import { ServiceInstrumentConfig } from '../../../dto/service.dto';

@Injectable()
export class ServiceParticipationService {
  constructor(
    @InjectModel(ServiceParticipation.name)
    private participation: Model<ServiceParticipationDocument>,
  ) {}

  async createMany(
    participations: ServiceInstrumentConfig[],
    serviceId: string,
    serviceDate: Date,
  ) {
    await this.deleteMany(serviceId);

    for (const participation of participations) {
      for (const person of participation.people) {
        const forSave = new ServiceParticipation();
        forSave.service = new Types.ObjectId(serviceId);
        forSave.instrument = new Types.ObjectId(participation.instrument);
        forSave.person = new Types.ObjectId(person);
        forSave.date = serviceDate;

        await this.participation.create(forSave);
      }
    }
  }

  deleteMany(id: string) {
    return this.participation.deleteMany({
      service: new Types.ObjectId(id),
    });
  }

  isInstrumentUsed(id: string) {
    return this.participation.exists({
      instrument: id,
    });
  }

  findByService(id: Types.ObjectId) {
    return this.participation
      .find({
        service: id,
      })
      .populate('person');
  }

  async findByServiceIds(ids: Types.ObjectId[]) {
    return this.participation.find({
      service: { $in: ids },
    });
  }

  async checkIfServiceDataPresent(serviceId: Types.ObjectId) {
    const count = await this.participation.count({
      service: serviceId,
    });
    return count > 0;
  }

  getInstrumentsData(service: Types.ObjectId) {
    return this.participation.find({ service }).populate('instrument').populate('person');
  }
}
