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
} from './models';
import { ServiceTemplateService, InstrumentService } from './services';
import { ServiceParticipationService } from './services/service-participation/service-participation.service';
import {
  ServiceParticipation,
  ServiceParticipationSchema,
} from './models/service-participation.model';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/worship-schedule'),
    MongooseModule.forFeature([
      { name: Instrument.name, schema: InstrumentSchema },
      { name: Person.name, schema: PersonSchema },
      { name: ServiceTemplate.name, schema: ServiceTemplateSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: ServiceParticipation.name, schema: ServiceParticipationSchema },
    ]),
  ],
  exports: [InstrumentService, ServiceTemplateService],
  providers: [
    InstrumentService,
    ServiceTemplateService,
    ServiceParticipationService,
  ],
})
export class DbModule {}
