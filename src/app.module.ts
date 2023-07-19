import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { InstrumentController } from './controllers/instrument/instrument.controller';
import { ServiceTemplateController } from './controllers/service-template/service-template.controller';
import { PeopleController } from './controllers/people/people.controller';

@Module({
  imports: [DbModule],
  controllers: [AppController, InstrumentController, ServiceTemplateController, PeopleController],
  providers: [AppService],
})
export class AppModule {}
