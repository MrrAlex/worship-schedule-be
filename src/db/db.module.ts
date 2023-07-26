import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ServiceTemplate,
  Instrument,
  InstrumentSchema,
  ServiceTemplateSchema,
  Service,
  ServiceSchema,
  Person,
  PersonSchema,
  ServiceParticipation,
  ServiceParticipationSchema,
  ServiceTemplateConfig,
  ServiceTemplateConfigSchema,
} from './models';
import {
  ServiceTemplateService,
  InstrumentService,
  ServiceParticipationService,
  PeopleService,
  ServiceTemplateConfigService,
  DbTelegramService,
} from './services';
import { ServicesService } from './services/services.service';
import { TimetableService } from './services/timetable/timetable.service';
import * as process from 'process';
import {
  TelegramPerson,
  TelegramPersonSchema,
} from './models/telegram-person.model';

const connectUrl = (
  protocol: string,
  user: string,
  pass: string,
  host: string,
  port: string,
  db: string,
) => {
  return `${protocol ?? 'mongodb'}://${user ?? 'admin'}:${pass ?? ''}@${
    host ?? 'localhost'
  }${port ? ':' + port : ''}/${
    db ?? 'worship-schedule'
  }?retryWrites=true&w=majority`;
};

console.log(
  connectUrl(
    process.env['MONGO_PROTOCOL'],
    process.env['MONGO_USER'],
    process.env['MONGO_PASS'],
    process.env['MONGO_HOST'],
    process.env['MONGO_PORT'],
    process.env['MONGO_DB'],
  ),
);

@Module({
  imports: [
    MongooseModule.forRoot(
      connectUrl(
        process.env['MONGO_PROTOCOL'],
        process.env['MONGO_USER'],
        process.env['MONGO_PASS'],
        process.env['MONGO_HOST'],
        process.env['MONGO_PORT'],
        process.env['MONGO_DB'],
      ),
    ),
    MongooseModule.forFeature([
      { name: Instrument.name, schema: InstrumentSchema },
      { name: Person.name, schema: PersonSchema },
      { name: ServiceTemplate.name, schema: ServiceTemplateSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: ServiceParticipation.name, schema: ServiceParticipationSchema },
      { name: ServiceTemplateConfig.name, schema: ServiceTemplateConfigSchema },
      { name: TelegramPerson.name, schema: TelegramPersonSchema },
    ]),
  ],
  exports: [
    InstrumentService,
    ServiceTemplateService,
    PeopleService,
    ServicesService,
    TimetableService,
    DbTelegramService,
  ],
  providers: [
    InstrumentService,
    ServiceTemplateService,
    ServiceParticipationService,
    ServiceTemplateConfigService,
    PeopleService,
    ServicesService,
    TimetableService,
    DbTelegramService,
  ],
})
export class DbModule {}
