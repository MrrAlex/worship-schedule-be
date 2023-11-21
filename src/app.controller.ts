import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    this.appService.checkForService();
  }

  @Get('guide')
  @Render('connect-guide')
  async guide() {
    return {};
  }
}
