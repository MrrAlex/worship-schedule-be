import { Injectable } from '@nestjs/common';
import { TelegramService } from './telegram/telegram.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor(private telegramService: TelegramService) {}

  @Cron('0 0 12 * * 1-6')
  async checkForService() {
    // await this.telegramService.checkForService();
  }
}
