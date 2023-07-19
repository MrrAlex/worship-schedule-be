import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InstrumentService } from '../../db/services';
import { InstrumentDto } from '../../dto';

@Controller('instrument')
export class InstrumentController {
  constructor(private service: InstrumentService) {}
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: InstrumentDto) {
    return this.service.create(dto);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() dto: InstrumentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
