import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StudyModuleService } from '../db/services/study-module.service';
import { StudyModuleDto } from '../dto/study-module.dto';
import { LessonDto } from '../dto/lesson.dto';
import { LessonService } from '../db/services/lesson.service';

@Controller('study-module')
export class StudyModuleController {
  constructor(
    private readonly studyModuleService: StudyModuleService,
    private readonly lessonService: LessonService,
  ) {}

  @Post()
  create(@Body() createStudyModuleDto: StudyModuleDto) {
    return this.studyModuleService.create(createStudyModuleDto);
  }

  @Get()
  findAll() {
    return this.studyModuleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studyModuleService.findOne(id);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() dto: StudyModuleDto) {
    return this.studyModuleService.update(id, dto);
  }

  @Post(':id/lesson')
  assignLessonToModule(@Body() lessonDto: LessonDto, @Param('id') id: string) {
    return this.lessonService.assignLessonToModule(lessonDto, id);
  }
}
