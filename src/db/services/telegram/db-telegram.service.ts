import { Injectable, Logger } from '@nestjs/common';
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
  InstrumentDocument,
  Person,
  PersonDocument,
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

  private logger = new Logger(DbTelegramService.name);

  async findLeadersForRegister() {
    const leaders = await this.people.findLeaders();
    const alreadyPresent = (
      await this.tgPerson.find({ person: { $exists: true } }).exec()
    ).map((tgp) => tgp.person.toString());
    return leaders.filter((l) => !alreadyPresent.includes(l._id.toString()));
  }

  async checkForNextServicePresent(bot: Telegram) {
    const service = await this.service.findNextService();
    if (service) {
      const serviceDataPresent =
        await this.serviceParticipation.checkIfServiceDataPresent(
          service._id,
        );
      if (!serviceDataPresent || service.isForSend) {
        await this.sendReminderForLeaderAboutNextService(bot, service);
        this.logger.log('Отправил напоминание о заполнении служения');
      } else {
        await this.sendServiceInformation(bot, service);
        this.logger.log('Отправил сообщение о служении в чат группы');
      }
    } else {
      this.logger.log('Не нашел ни одного служения в будущем, шлю оповещения');
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

    await this.sendToGroup(bot, resultString);

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
      person: (service.leader as PersonDocument)._id,
    });

    if (serviceLeader) {
      await bot.sendMessage(
        serviceLeader.chatId,
        `Следующее служение ${service.name} которое проходит ${this.formatDate(
          service.date,
        )} не заполнено`,
      );
    }
  }

  private async sendReminderForLeaderAboutNoServices(bot: Telegram) {
    await this.sendToAllPeople(bot, 'Нету ни одного служения');
  }

  private async sendToGroup(bot: Telegram, message: string) {
    const group: TelegramPerson = await this.tgPerson.findOne({
      person: { $exists: false },
    });
    await bot.sendMessage(group.chatId, message);
  }

  private async sendToAllPeople(bot: Telegram, message: string) {
    const leaders: TelegramPerson[] = await this.tgPerson.find({
      person: { $exists: true },
    });
    for (const leader of leaders) {
      await bot.sendMessage(leader.chatId, message);
    }
  }
}
