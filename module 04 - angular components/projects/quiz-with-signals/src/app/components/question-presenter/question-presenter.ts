import { Component, input, output } from '@angular/core';
import { Question } from '../../models/question';

@Component({
  imports: [],
  selector: 'app-question-presenter',
  styleUrl: './question-presenter.css',
  templateUrl: './question-presenter.html',
})
export class QuestionPresenter {
  readonly question = input.required<Question>();

  readonly userAnswered = output<number>();
}
