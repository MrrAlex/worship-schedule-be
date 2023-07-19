import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceParticipation } from '../../models/service-participation.model';

@Injectable()
export class ServiceParticipationService {
  constructor(
    @InjectModel(ServiceParticipation.name)
    private participation: Model<ServiceParticipation>,
  ) {}

  isInstrumentUsed(id: string) {
    return this.participation.exists({
      instrument: id,
    });
  }
}
