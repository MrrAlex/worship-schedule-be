import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private readonly TOKEN = '';

  bot: Telegraf;

  constructor() {
    const bot = new Telegraf(process.env.BOT_TOKEN);
    bot.start((ctx) => ctx.reply('Welcome'));
  }
}
