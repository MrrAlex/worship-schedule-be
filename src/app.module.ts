import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { InstrumentController } from './controllers/instrument/instrument.controller';
import { ServiceTemplateController } from './controllers/service-template/service-template.controller';
import { PeopleController } from './controllers/people/people.controller';
import { ServiceController } from './controllers/service/service.controller';
import { TimetableController } from './controllers/timetable/timetable.controller';
import { TelegramService } from './telegram/telegram.service';
import { ScheduleModule } from '@nestjs/schedule';
import { RehearsalService } from './db/services/rehersal/rehearsal.service';
import { RehearsalController } from './controllers/rehearsal/rehearsal.controller';

@Module({
  imports: [DbModule, ScheduleModule.forRoot()],
  controllers: [
    AppController,
    InstrumentController,
    ServiceTemplateController,
    PeopleController,
    ServiceController,
    TimetableController,
    RehearsalController,
  ],
  providers: [AppService, TelegramService, RehearsalService],
})
export class AppModule {}
