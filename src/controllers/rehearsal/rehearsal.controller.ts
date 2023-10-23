import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RehearsalService } from '../../db/services';
import { RehearsalDto } from '../../dto/rehearsal.dto';

@Controller('rehearsal')
export class RehearsalController {
  constructor(private service: RehearsalService) {}

  @Get('places')
  findAllPlaces() {
    return this.service.findAllPlaces();
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: RehearsalDto) {
    return this.service.create(dto);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() dto: RehearsalDto) {
    return this.service.update(id, dto);
  }
}
