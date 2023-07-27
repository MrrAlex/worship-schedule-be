import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LessonDto } from '../dto/lesson.dto';
import { QuestionDto } from '../dto/question.dto';
import { AnswerDto } from '../dto/answer.dto';
import { AnswerService } from '../db/services/answer.service';
import { PdfGeneratorService } from '../services/pdf-generator.service';

@Controller('answer')
export class AnswersController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly pdf: PdfGeneratorService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.answerService.findOne(id);
  }

  @Post()
  create(@Body() dto: AnswerDto) {
    return this.answerService.createOne(dto);
  }

  @Post('multiple')
  storeMultipleAnswers(@Body() dtos: AnswerDto[]) {
    return this.answerService.createMany(dtos);
  }

  @Post('generate')
  generateUserAnswers() {
    return this.pdf.generateUserAnswers();
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() dto: AnswerDto) {
    return this.answerService.update(id, dto);
  }
}
