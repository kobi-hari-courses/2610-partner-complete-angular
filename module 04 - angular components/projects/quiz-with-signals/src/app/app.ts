import { Component, computed, signal } from '@angular/core';
import { Question } from './models/question';
import { ALL_QUESTIONS } from './data/questions';
import { calculateCorrectAnswersCount, calculateScore } from './quiz.helpers';
import { QuestionPresenter } from './components/question-presenter/question-presenter';
import { Summary } from './components/summary/summary';
import { ProgressBar } from './components/progress-bar/progress-bar';

@Component({
  selector: 'app-root',
  imports: [QuestionPresenter, Summary, ProgressBar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Core State
  readonly allQuestions = signal<Question[]>(ALL_QUESTIONS);
  readonly allAnswers = signal<number[]>([]);

  // Derived
  readonly totalQuestionsCount = computed(() => this.allQuestions().length);
  readonly answeredQuestionsCount = computed(() => this.allAnswers().length);
  readonly currentQuestionIndex = computed(() => this.answeredQuestionsCount());

  readonly currentQuestion = computed(() => this.allQuestions()[this.currentQuestionIndex()]);

  readonly isQuizDone = computed(
    () => this.answeredQuestionsCount() === this.totalQuestionsCount(),
  );

  readonly correctAnswersCount = computed(() =>
    calculateCorrectAnswersCount(this.allQuestions(), this.allAnswers()),
  );

  readonly score = computed(() =>
    calculateScore(this.correctAnswersCount(), this.totalQuestionsCount()),
  );

  // Actions
  reset() {
    this.allAnswers.set([]);
  }

  answerCurrentQuestion(answer: number) {
    this.allAnswers.update(val => [...val, answer]);
  }
}
