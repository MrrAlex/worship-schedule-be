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
} from './services';
import { ServicesService } from './services/services.service';
import { TimetableService } from './services/timetable/timetable.service';
import * as process from 'process';

@Module({
  imports: [
    MongooseModule.forRoot(
      `${process.env['MONGO_PROTOCOL']}://${process.env['MONGO_USER']}:${process.env['MONGO_PASS']}@${process.env['MONGO_HOST']}/${process.env['MONGO_DB']}?retryWrites=true&w=majority`,
    ),
    MongooseModule.forRoot('mongodb://localhost/worship-schedule'),
    MongooseModule.forFeature([
      { name: Instrument.name, schema: InstrumentSchema },
      { name: Person.name, schema: PersonSchema },
      { name: ServiceTemplate.name, schema: ServiceTemplateSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: ServiceParticipation.name, schema: ServiceParticipationSchema },
      { name: ServiceTemplateConfig.name, schema: ServiceTemplateConfigSchema },
    ]),
  ],
  exports: [
    InstrumentService,
    ServiceTemplateService,
    PeopleService,
    ServicesService,
    TimetableService,
  ],
  providers: [
    InstrumentService,
    ServiceTemplateService,
    ServiceParticipationService,
    ServiceTemplateConfigService,
    PeopleService,
    ServicesService,
    TimetableService,
  ],
})
export class DbModule {}
