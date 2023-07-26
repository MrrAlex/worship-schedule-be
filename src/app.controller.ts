import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TelegramService } from './telegram/telegram.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    this.appService.checkForService();
  }
}
