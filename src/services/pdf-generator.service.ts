import { Injectable } from '@nestjs/common';
import { AnswerService } from '../db/services/answer.service';

import * as path from 'path';
import * as fs from 'fs';
import * as hbs from 'handlebars';
import * as pdf from 'pdf-creator-node';

@Injectable()
export class PdfGeneratorService {
  constructor(private readonly answerService: AnswerService) {
    hbs.registerHelper('lesson-answers', (context, options) => {
      const actualAnswers = options.data.root.answers[context];
      return actualAnswers
        .map((answer) => {
          const question = `<div class='question ${
            answer.isSection ? 'text-section' : ''
          }'>${answer.question}</div>`;
          const answers = answer.isSection
            ? ''
            : `<div class='answers'>${answer.answer.join(', ')}</div>`;
          return `${question}${answers}`;
        })
        .join('');
    });
  }

  async generateUserAnswers(userId: string, module: string) {
    const answersFromDb = await this.answerService.findAllForPdf(
      userId,
      module,
    );
    const answers = answersFromDb.reduce((acc, next) => {
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

    const templatePath = fs
      .readFileSync(path.resolve(__dirname, '../../template/answers/html.hbs'))
      .toString('utf8');
    const template = hbs.compile(templatePath);
    const html = template({ answers });

    const options = {
      format: 'A3',
      orientation: 'portrait',
      border: '10mm',
      header: {
        height: '45mm',
        contents: '<div style="text-align: center;">Author: Shyam Hajare</div>',
      },
      footer: {
        height: '28mm',
        contents: {
          first: 'Cover page',
          2: 'Second page', // Any page number is working. 1-based index
          default:
            '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          last: 'Last Page',
        },
      },
    };
    await pdf.create(
      {
        html: html,
        data: {},
        path: path.resolve(__dirname, '../../output.pdf'),
      },
      options,
    );
  }
}
