import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CourseService } from '../db/services/course.service';
import { CreateCourseDto, UpdateCourseDto } from '../dto/course.dto';
import { StudyModuleDto } from '../dto/study-module.dto';
import { StudyModuleService } from '../db/services/study-module.service';

@Controller('course')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly studyModuleService: StudyModuleService,
  ) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  findAll() {
    return this.courseService.findAll().populate('modules');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Post(':id/module')
  assignNewModule(@Param('id') id: string, @Body() moduleDto: StudyModuleDto) {
    return this.studyModuleService.addNewModuleToCourse(moduleDto, id);
  }
}
