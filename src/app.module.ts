import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { InstrumentController } from './controllers/instrument/instrument.controller';
import { ServiceTemplateController } from './controllers/service-template/service-template.controller';

@Module({
  imports: [DbModule],
  controllers: [AppController, InstrumentController, ServiceTemplateController],
  providers: [AppService],
})
export class AppModule {}
