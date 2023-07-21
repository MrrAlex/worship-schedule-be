import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ServicesService } from '../../db/services/services.service';
import { ServiceDto, ServiceDtoWithLeaderId } from '../../dto/service.dto';

@Controller('service')
export class ServiceController {
  constructor(private service: ServicesService) {}
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: ServiceDtoWithLeaderId) {
    return this.service.create(dto);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() dto: ServiceDtoWithLeaderId) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
