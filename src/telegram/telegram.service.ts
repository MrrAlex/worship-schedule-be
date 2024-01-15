import { Injectable, Logger } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { DbTelegramService } from '../db/services';

@Injectable()
export class TelegramService {
  bot: Telegraf;

  private logger = new Logger(TelegramService.name);

  constructor(private service: DbTelegramService) {
    this.bot = new Telegraf(process.env.BOT_TOKEN);
    this.bot.start(async (ctx) => {
      await ctx.reply(
        'Привет! Этот бот поможет с напоминалками для нашей группы. ',
      );

      const leaders = await this.service.findLeadersForRegister();

      await ctx.reply(
        'Для начала надо зарегистрироваться тут, чтобы бот знал кому какие напоминалки отправлять, нажми  на кнопку со своим именем.',
        Markup.keyboard(
          leaders.map((l) => `Регистрация ответственного - ${l.name}`),
        )
          .oneTime()
          .resize(),
      );
    });

    this.bot.hears(/Регистрация ответственного - (.+)/, async (ctx) => {
      this.logger.log('Запрос на регистрацию ответственного');
      const chatId = ctx.update.message.chat.id;
      await this.service.registerLeader(ctx.match[1], chatId);
      await ctx.reply('Спасибо, все прошло успешно!', Markup.removeKeyboard());
      this.logger.log(`Регистрация ${ctx.match[1]} прошла успешно!`);
    });

    this.bot.hears(/[\s\S]*/, (ctx) => {
      console.log(ctx.message);
    });

    // this.bot.launch();
  }

  async checkForService() {
    this.logger.log('Проверка на наличие служений');
    await this.service.checkForNextServicePresent(this.bot.telegram);
  }
}
