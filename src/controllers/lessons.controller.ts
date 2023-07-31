import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LessonService } from '../db/services/lesson.service';
import { LessonDto } from '../dto/lesson.dto';
import { QuestionDto } from '../dto/question.dto';
import { QuestionsService } from '../db/services/questions.service';

@Controller('lesson')
export class LessonsController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly questionsService: QuestionsService,
  ) {}

  @Get(':id/answers')
  getAnswersByLesson(@Param('id') id: string, @Query('userId') userId: string) {
    return this.lessonService.getAnswersByLesson(id, userId);
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
