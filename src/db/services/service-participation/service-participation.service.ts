import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ServiceParticipation,
  ServiceParticipationDocument,
} from '../../models';

@Injectable()
export class ServiceParticipationService {
  constructor(
    @InjectModel(ServiceParticipation.name)
    private participation: Model<ServiceParticipationDocument>,
  ) {}

  isInstrumentUsed(id: string) {
    return this.participation.exists({
      instrument: id,
    });
  }
}
