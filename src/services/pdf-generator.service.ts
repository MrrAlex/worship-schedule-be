import { Injectable } from '@nestjs/common';
import { PDFService } from '@t00nday/nestjs-pdf';
import { AnswerService } from '../db/services/answer.service';

@Injectable()
export class PdfGeneratorService {
  constructor(
    private readonly pdfService: PDFService,
    private readonly answerService: AnswerService,
  ) {}

  async generateUserAnswers() {
    const answersFromDb = await this.answerService.findAllForPdf();
    const answers = answersFromDb.map((item) => {
      let answer;
      if (item.type === 'radio' || item.type === 'checkbox') {
        answer = item.answer.map(
          (ans) =>
            item.config.options.find((option) => option.value === ans).label,
        );
      } else {
        answer = item.answer;
      }
      return {
        question: item.config.question,
        answer,
      };
    });
    this.pdfService
      .toFile('answers', 'result.pdf', {
        locals: {
          answers: answers,
        },
      })
      .subscribe(); // returns Observable<FileInfo>;
  }
}
