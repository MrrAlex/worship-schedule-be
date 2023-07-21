import { Controller, Get, Query } from '@nestjs/common';
import { TimetableService } from '../../db/services/timetable/timetable.service';

@Controller('timetable')
export class TimetableController {
  constructor(private service: TimetableService) {}
  @Get()
  findAll(
    @Query('dateFrom') dateFrom: string,
    @Query('dateTo') dateTo: string,
  ) {
    return this.service.generate(dateFrom, dateTo);
  }
}
