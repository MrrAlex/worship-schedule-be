import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DbModule } from './db/db.module';
import { CourseController } from './controllers/course.controller';
import { StudyModuleController } from './controllers/study-module.controller';
import { LessonsController } from './controllers/lessons.controller';
import { AnswersController } from './controllers/answers.controller';
import { PDFModule } from '@t00nday/nestjs-pdf';
import { PdfGeneratorService } from './services/pdf-generator.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/courses'),
    DbModule,
    PDFModule.register({
      view: {
        root: './template',
        engine: 'handlebars',
        extension: 'hbs'
      },
    }),
  ],
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
