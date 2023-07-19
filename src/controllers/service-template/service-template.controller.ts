import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ServiceTemplateService } from '../../db/services';
import { ServiceTemplateDto } from '../../dto';

@Controller('service-template')
export class ServiceTemplateController {
  constructor(private service: ServiceTemplateService) {}
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: ServiceTemplateDto) {
    return this.service.create(dto);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() dto: ServiceTemplateDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
