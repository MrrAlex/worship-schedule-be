import { Injectable } from '@nestjs/common';
import { ServicesService } from '../services.service';
import { InstrumentService } from '../instrument/instrument.service';
import { PeopleService } from '../people/people.service';
import { Types } from 'mongoose';
import { ServiceParticipationService } from '../service-participation/service-participation.service';

@Injectable()
export class TimetableService {
  constructor(
    private servicesService: ServicesService,
    private instrumentService: InstrumentService,
    private peopleService: PeopleService,
    private participationService: ServiceParticipationService,
  ) {}

  async generate(dateFrom: string, dateTo: string) {
    const instruments = await this.instrumentService.findAll();
    const people = await this.peopleService.findAll();
    const instrumentsWithPeople = instruments.map((i) => {
      return {
        name: i.name,
        id: i._id,
        people: people.filter((p) => {
          const instrumentIds = p.instruments as Types.ObjectId[];
          return instrumentIds.includes(new Types.ObjectId(i._id));
        }),
      };
    });

    const services = await this.servicesService.findByDates(dateFrom, dateTo);
    const participations = await this.participationService.findByServiceIds(
      services.map((s) => s._id),
    );

    return {
      instruments: instrumentsWithPeople,
      participations,
      services,
    };
  }
}
