import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { StudyModuleService } from '../db/services/study-module.service';
import { StudyModuleDto, UpdateStudyModuleDto } from '../dto/study-module.dto';
import { LessonService } from '../db/services/lesson.service';
import { LessonDto } from '../dto/lesson.dto';
import { QuestionDto } from '../dto/question.dto';
import { QuestionsService } from '../db/services/questions.service';
import { AnswerService } from "../db/services/answer.service";

@Controller('lesson')
export class LessonsController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly questionsService: QuestionsService,
    private readonly answerService: AnswerService,
  ) {}

  @Get(':id/answers')
  getAnswersByLesson(@Param('id') id: string) {
    return this.lessonService.getAnswersByLesson(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }

  @Post()
  create(@Body() lessonDto: LessonDto) {
    return this.lessonService.create(lessonDto);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() lessonDto: LessonDto) {
    return this.lessonService.update(id, lessonDto);
  }

  @Post(':id/question')
  assignQuestionsToLesson(
    @Param('id') id: string,
    @Body() questions: QuestionDto[],
  ) {
    return this.questionsService.assignQuestionToLesson(id, questions);
  }
}
