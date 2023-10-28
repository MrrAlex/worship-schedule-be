import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  InstrumentDocument,
  Person,
  PersonDocument,
  Service,
  ServiceDocument,
  ServiceTemplate,
} from '../models';
import { Model, Types } from 'mongoose';
import { ServiceTemplateDto, TemplateInstrumentConfig } from '../../dto';
import {
  ServiceDto,
  ServiceDtoWithLeader,
  ServiceDtoWithLeaderId,
  ServiceInstrumentConfig,
} from '../../dto/service.dto';
import { ServiceParticipationService } from './service-participation/service-participation.service';
import { DateTime } from 'luxon';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name)
    private service: Model<ServiceDocument>,
    private serviceParticipationService: ServiceParticipationService,
  ) {}

  async findNextService() {
    const from = DateTime.now().toJSDate();
    const to = DateTime.now().plus({ week: 1 }).toJSDate();
    return this.service
      .findOne({
        date: {
          $gte: from,
          $lt: to,
        },
      })
      .populate('leader');
  }

  async create(dto: ServiceDtoWithLeaderId) {
    const service = new Service();
    service.name = dto.name;
    service.leader = new Types.ObjectId(dto.leader);
    service.date = new Date(dto.date);
    service.isNotified = false;
    service.isForSend = dto.isForSend;
    const saved = await this.service.create(service);
    await this.serviceParticipationService.createMany(
      dto.instruments,
      saved.id,
      saved.date,
    );

    return saved;
  }

  async delete(id: string) {
    await this.service.findByIdAndDelete(id);
    await this.serviceParticipationService.deleteMany(id);
  }

  async update(id: string, dto: ServiceDtoWithLeaderId) {
    const found = await this.service.findById(id);
    found.name = dto.name;
    found.leader = new Types.ObjectId(dto.leader);
    found.date = new Date(dto.date);
    found.isNotified = false;
    found.isForSend = dto.isForSend;
    await found.save();
    await this.serviceParticipationService.createMany(
      dto.instruments,
      found.id,
      found.date,
    );

    return found;
  }

  findAll() {
    return this.service
      .find({}, null, { sort: { date: -1 } })
      .populate('leader');
  }

  async findOne(id: string): Promise<ServiceDtoWithLeader> {
    const found = await this.service.findById(id).populate('leader');
    const leader = found.leader as PersonDocument;
    const participations = await this.serviceParticipationService.findByService(
      found._id,
    );
    const instruments = participations.reduce((acc, next) => {
      const found = acc.find(
        (item) => item.instrument === next.instrument.toString(),
      );
      const person = next.person as PersonDocument;
      if (found) {
        found.people.push(person.id);
      } else {
        acc.push({
          instrument: next.instrument.toString(),
          people: [person.id],
        });
      }

      return acc;
    }, [] as ServiceInstrumentConfig[]);

    return {
      _id: found.id,
      date: found.date.toISOString(),
      leader: {
        _id: leader.id,
        name: leader.name,
        instruments: [],
      },
      name: found.name,
      isForSend: found.isForSend,
      instruments,
    };
  }

  async findByDates(dateFrom: string, dateTo: string) {
    return this.service.find(
      {
        date: {
          $gte: new Date(dateFrom),
          $lte: new Date(dateTo),
        },
      },
      null,
      {
        sort: { date: 1 },
      },
    );
  }
}
