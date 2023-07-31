import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { CourseController } from './controllers/course.controller';
import { StudyModuleController } from './controllers/study-module.controller';
import { LessonsController } from './controllers/lessons.controller';
import { AnswersController } from './controllers/answers.controller';
import { PdfGeneratorService } from './services/pdf-generator.service';

@Module({
  imports: [DbModule],
  controllers: [
    AppController,
    CourseController,
    StudyModuleController,
    LessonsController,
    AnswersController,
  ],
  providers: [AppService, PdfGeneratorService],
})
export class AppModule {}
