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
} from './services';
import { ServiceTemplateConfigService } from './services/service-template-config/service-template-config.service';

@Module({
  imports: [
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
  exports: [InstrumentService, ServiceTemplateService],
  providers: [
    InstrumentService,
    ServiceTemplateService,
    ServiceParticipationService,
    ServiceTemplateConfigService,
  ],
})
export class DbModule {}
