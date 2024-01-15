import {
  Body,
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  StreamableFile,
} from '@nestjs/common';
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
  @Header('Content-Type', 'application/pdf')
  generateUserAnswers(
    @Param('userId') userId: string,
    @Query('module') module = 'all',
    @Query('course') course?: string,
  ): Promise<StreamableFile> {
    if (module === 'all' && !course) {
      throw new HttpException(
        'Course or Module should be present',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.pdf.generateUserAnswers(userId, module, course);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() dto: AnswerDto) {
    return this.answerService.update(id, dto);
  }
}
