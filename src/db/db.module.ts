import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './models/course.entity';
import { StudyModule, StudyModuleSchema } from './models/study-module.entity';
import { StudyModuleService } from './services/study-module.service';
import { CourseService } from './services/course.service';
import { Question, QuestionSchema } from './models/question.entity';
import { Lesson, LessonSchema } from './models/lesson.entity';
import { LessonService } from './services/lesson.service';
import { QuestionsService } from './services/questions.service';
import { Answer, AnswerSchema } from './models/answer.entity';
import { AnswerService } from './services/answer.service';

const connectUrl = (
  protocol: string,
  user: string,
  pass: string,
  host: string,
  port: string,
  db: string,
) => {
  return `${protocol ?? 'mongodb'}://${user ?? 'admin'}:${pass ?? ''}@${
    host ?? 'localhost'
  }${port ? ':' + port : ''}/${
    db ?? 'fc'
  }?retryWrites=true&w=majority&authSource=admin`;
};

console.log(
  connectUrl(
    process.env['MONGO_PROTOCOL'],
    process.env['MONGO_USER'],
    process.env['MONGO_PASS'],
    process.env['MONGO_HOST'],
    process.env['MONGO_PORT'],
    process.env['MONGO_DB'],
  ),
);

@Module({
  imports: [
    MongooseModule.forRoot(
      connectUrl(
        process.env['MONGO_PROTOCOL'],
        process.env['MONGO_USER'],
        process.env['MONGO_PASS'],
        process.env['MONGO_HOST'],
        process.env['MONGO_PORT'],
        process.env['MONGO_DB'],
      ),
    ),
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: StudyModule.name, schema: StudyModuleSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: Answer.name, schema: AnswerSchema },
    ]),
  ],
  providers: [
    StudyModuleService,
    CourseService,
    LessonService,
    QuestionsService,
    AnswerService,
  ],
  exports: [
    StudyModuleService,
    CourseService,
    LessonService,
    QuestionsService,
    AnswerService,
  ],
})
export class DbModule {}
