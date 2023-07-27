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

@Module({
  imports: [
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
