import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private readonly disk: DiskHealthIndicator,
    private readonly mongoose: MongooseHealthIndicator,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.8 }),
      () => this.mongoose.pingCheck('mongo', { connection: this.connection }),
    ]);
  }
}
