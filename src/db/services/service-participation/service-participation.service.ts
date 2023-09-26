import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ServiceParticipation,
  ServiceParticipationDocument,
} from '../../models';
import { ServiceInstrumentConfig } from '../../../dto/service.dto';
import { DateTime } from 'luxon';

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
    return this.participation
      .find({ service })
      .populate('instrument')
      .populate('person');
  }

  async checkUserParticipationErrors() {
    const date = DateTime.now().minus({ week: 4 }).toJSDate();
    const now = DateTime.now().toJSDate();
    const participationData = await this.participation
      .aggregate([
        {
          $match: {
            date: {
              $gte: date,
              $lte: now,
            },
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
        {
          $group: {
            _id: '$person',
            dates: {
              $push: '$date',
            },
          },
        },
        {
          $lookup: {
            from: 'people',
            localField: '_id',
            foreignField: '_id',
            as: 'personData',
          },
        },
        {
          $unwind: {
            path: '$personData',
          },
        },
        {
          $project: {
            _id: 1,
            dates: 1,
            name: '$personData.name',
          },
        },
      ])
      .exec();

    return participationData.reduce((acc: Set<string>, next) => {
      const weekNumbers = new Set<number>(
        next.dates.map((d) => DateTime.fromJSDate(d).weekNumber),
      );
      if (weekNumbers.size >= 4) {
        return [...acc, next._id];
      }
      if (weekNumbers.size === 3) {
        const weeksArr = Array.from(weekNumbers);
        const diffs = weeksArr.map((item, index) =>
          index === weekNumbers.size - 1 ? 1 : weeksArr[index + 1] - item,
        );
        if (diffs.every((i) => i === 1)) {
          return [...acc, next._id];
        }
      }

      return acc;
    }, []);
  }
}
