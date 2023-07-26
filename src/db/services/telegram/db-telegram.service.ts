import { Injectable } from '@nestjs/common';
import { PeopleService } from '../people/people.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TelegramPerson,
  TelegramPersonDocument,
} from '../../models/telegram-person.model';
import { DateTime } from 'luxon';
import { ServicesService } from '../services.service';
import { Telegram } from 'telegraf';
import { ServiceParticipationService } from '../service-participation/service-participation.service';
import {
  Instrument,
  InstrumentDocument,
  Person,
  Service,
  ServiceDocument,
} from '../../models';
import { InstrumentService } from '../instrument/instrument.service';

@Injectable()
export class DbTelegramService {
  constructor(
    private people: PeopleService,
    @InjectModel(TelegramPerson.name)
    private tgPerson: Model<TelegramPersonDocument>,
    private service: ServicesService,
    private serviceParticipation: ServiceParticipationService,
    private instrumentService: InstrumentService,
  ) {}

  findLeaders() {
    return this.people.findLeaders();
  }

  async checkForNextServicePresent(bot: Telegram) {
    const service = await this.service.findNextService(
      DateTime.now().toJSDate(),
    );
    if (service) {
      if (!service.isNotified) {
        const serviceDataPresent =
          await this.serviceParticipation.checkIfServiceDataPresent(
            service._id,
          );
        if (!serviceDataPresent) {
          await this.sendReminderForLeaderAboutNextService(bot, service);
        } else {
          await this.sendServiceInformation(bot, service);
        }
      }
    } else {
      await this.sendReminderForLeaderAboutNoServices(bot);
    }
  }

  async sendServiceInformation(bot: Telegram, service: ServiceDocument) {
    const instrumentsParticipation =
      await this.serviceParticipation.getInstrumentsData(service._id);
    let instruments = await this.instrumentService.findAllDocs();
    instruments = instruments.filter(
      (i) => i.name !== InstrumentService.LEADER_LABEL,
    );
    let resultString = `${service.name} пройдет ${this.formatDate(
      service.date,
    )} \n\n`;
    resultString += `Ответственный: ${(service.leader as Person).name} \n`;
    for (const instrument of instruments) {
      const people = instrumentsParticipation.filter(
        (p) => (p.instrument as InstrumentDocument).id === instrument.id,
      );
      if (people?.length > 0) {
        const peopleString = people
          .map((p) => (p.person as Person).name)
          .join(', ');
        resultString += `${instrument.name}: ${peopleString}\n`;
      }
    }

    await this.sendToAll(bot, resultString);

    service.isNotified = true;
    await service.save();
  }

  async registerLeader(leaderName: string, chatId: number) {
    const leader = await this.people.findByName(leaderName);
    if (leader) {
      const found = await this.tgPerson.findOne({
        person: leader._id,
      });
      if (found) {
        found.chatId = chatId;
        await found.save();
      } else {
        await this.tgPerson.create({
          person: leader,
          chatId,
        });
      }
    }
  }

  private formatDate(date: Date) {
    return DateTime.fromJSDate(date).setLocale('ru').toLocaleString();
  }

  private async sendReminderForLeaderAboutNextService(
    bot: Telegram,
    service: Service,
  ) {
    const serviceLeader = await this.tgPerson.findOne({
      person: service.leader,
    });

    await bot.sendMessage(
      serviceLeader.chatId,
      `Следующее служение ${service.name} которое проходит ${this.formatDate(
        service.date,
      )} не заполнено`,
    );
  }

  private async sendReminderForLeaderAboutNoServices(bot: Telegram) {
    await this.sendToAll(bot, 'Нету ни одного служения');
  }

  private async sendToAll(bot: Telegram, message: string) {
    const leaders: TelegramPerson[] = await this.tgPerson.find();
    for (const leader of leaders) {
      await bot.sendMessage(leader.chatId, message);
    }
  }
}
