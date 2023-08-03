import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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

  @Post('user/:userId')
  storeMultipleAnswers(
    @Body() dtos: AnswerDto[],
    @Param('userId') userId: string,
  ) {
    return this.answerService.createMany(dtos, userId);
  }

  @Post('generate/user/:userId')
  generateUserAnswers(
    @Param('userId') userId: string,
    @Query('module') module = 'all',
  ) {
    return this.pdf.generateUserAnswers(userId, module);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() dto: AnswerDto) {
    return this.answerService.update(id, dto);
  }
}
