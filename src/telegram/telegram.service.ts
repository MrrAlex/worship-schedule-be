import { Injectable } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { DbTelegramService } from '../db/services';

@Injectable()
export class TelegramService {
  bot: Telegraf;

  constructor(private service: DbTelegramService) {
    this.bot = new Telegraf(process.env.BOT_TOKEN);
    this.bot.start(async (ctx) => {
      await ctx.reply(
        'Привет! Этот бот поможет с напоминалками для нашей группы. ',
      );

      const leaders = await this.service.findLeaders();

      await ctx.reply(
        'Для начала надо зарегестрироваться тут, чтобы бот знал кому какие напоминалки отправлять, нажми  на кнопку со своим именем.',
        Markup.keyboard(
          leaders.map((l) => `Регистрация ответственного - ${l.name}`),
        )
          .oneTime()
          .resize(),
      );
    });

    this.bot.hears(/Регистрация ответственного - (.+)/, async (ctx) => {
      const chatId = ctx.update.message.chat.id;
      await this.service.registerLeader(ctx.match[1], chatId);
      await ctx.reply('Спасибо, все прошло успешно!', Markup.removeKeyboard());
    });

    this.bot.launch();
  }

  async checkForService() {
    await this.service.checkForNextServicePresent(this.bot.telegram);
  }
}
