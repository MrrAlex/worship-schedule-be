import { Injectable, Logger, StreamableFile } from '@nestjs/common';

import * as path from 'path';
import * as fs from 'fs';
import * as hbs from 'handlebars';
import * as ppt from 'puppeteer';
import { QuestionsService } from '../db/services/questions.service';
import * as process from 'process';
import { CourseService } from '../db/services/course.service';
import { CourseTemplateService } from '../db/services/course-template.service';

@Injectable()
export class PdfGeneratorService {
  private logger = new Logger(PdfGeneratorService.name);

  constructor(
    private readonly questionsService: QuestionsService,
    private readonly courseService: CourseService,
    private readonly courseTemplateService: CourseTemplateService,
  ) {
    hbs.registerHelper('lesson-answers', (context, options) => {
      const actualAnswers = options.data.root.answers[context];
      if (actualAnswers) {
        return actualAnswers
          .map((answer) => {
            const question = `<div class='question ${
              answer.isSection ? 'text-section' : ''
            }'>${answer.question}</div>`;
            const answers = answer.isSection
              ? ''
              : `<div class='answers'>${answer.answer?.join(', ') ?? ''}</div>`;
            return `${question}${answers}`;
          })
          .join('');
      }
    });
    hbs.registerHelper('module-check', function (context, options) {
      const module = options.data.root.module;
      const isModulePresent = module === 'all' ? true : module === context;
      return isModulePresent ? options.fn(this) : null;
    });
  }

  async generateUserAnswers(userId: string, module: string, course?: string) {
    const answers = await this.getAnswersByModule(userId, module, course);

    const templateName = await this.getTemplate(module, course);
    const templatePath = fs
      .readFileSync(path.resolve(__dirname, '../../template/' + templateName))
      .toString('utf8');
    const template = hbs.compile(templatePath);
    const html = template({
      answers,
      baseUrl: process.env['BASE_URL'] ?? 'http://localhost:3000',
      module,
    });

    const browser = await ppt.launch({
      ...(process.env['CHROME_EXEC']
        ? { executablePath: process.env['CHROME_EXEC'] }
        : {}),
      headless: 'new',
      args: ['--no-sandbox', '--disabled-setupid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: ['domcontentloaded', 'networkidle2'],
    });
    await page.emulateMediaType('screen');

    const pdf = await page.pdf({
      margin: { top: '75px', right: '50px', bottom: '75px', left: '50px' },
      printBackground: true,
      format: 'A4',
    });
    await browser.close();

    this.logger.log('Finished pdf generation');

    return new StreamableFile(pdf);
  }

  private async getTemplate(module: string, course: string) {
    if (!course) {
      course = await this.courseService.courseIdByModuleId(module);
    }

    return this.courseTemplateService.findTemplateByCourseId(course);
  }

  private async getAnswersByModule(
    userId: string,
    module: string,
    course: string,
  ) {
    const answersFromDb = await this.questionsService.findAllForPdf(
      userId,
      module,
      course,
    );
    return answersFromDb.reduce((acc, next) => {
      const convertedAnswers = next.answers.map((item) => {
        let answer,
          isSection = false;
        if (item.type === 'radio' || item.type === 'checkbox') {
          answer = item.answer.map(
            (ans) =>
              item.config.options.find((option) => option.value === ans).label,
          );
        } else if (item.type === 'textSection') {
          isSection = true;
        } else {
          answer = item.answer;
        }
        return {
          isSection,
          question: item.config.question,
          answer,
        };
      });

      return { ...acc, [next._id]: convertedAnswers };
    }, {});
  }
}
