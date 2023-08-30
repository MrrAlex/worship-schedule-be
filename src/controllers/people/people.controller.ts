import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PeopleService } from '../../db/services/people/people.service';
import { PersonDto } from '../../dto/person.dto';
import { ServiceParticipationService } from '../../db/services';

@Controller('people')
export class PeopleController {
  constructor(
    private service: PeopleService,
    private participationService: ServiceParticipationService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('participation')
  checkParticipation() {
    return this.participationService.checkUserParticipationErrors();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: PersonDto) {
    return this.service.create(dto);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() dto: PersonDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
