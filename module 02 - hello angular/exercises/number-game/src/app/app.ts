import { Component, signal } from '@angular/core';

type GamePhase = 'in-progress' | 'win' | 'loss';
type GuessResult = 'correct' | 'to-high' | 'too-low';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // State
  readonly phase = signal<GamePhase>('in-progress'); //
  readonly secret = signal(Math.floor(Math.random() * 100) + 1); //
  readonly guessCount = signal(0); //
  readonly lastGuess = signal<number | null>(null); //
  readonly lastGuessResult = signal<GuessResult | null>(null); //
  readonly maxGuesses = signal(7); // 
  readonly history = signal<string[]>([]); //

  // Actions
  reset() {
    this.phase.set('in-progress');
    this.secret.set(Math.floor(Math.random() * 100) + 1);
    this.guessCount.set(0);
    this.lastGuess.set(null);
    this.lastGuessResult.set(null);
    this.maxGuesses.set(7);
    this.history.set([]);
  }

  nextGuess(guess: string) {
    const guessValue = Number(guess);
    if (!Number.isInteger(guessValue)) return;
    if (guessValue > 100) return;
    if (guessValue < 1) return;
    if (this.phase() !== 'in-progress') return;

    this.lastGuess.set(guessValue);
    this.lastGuessResult.set(
      guessValue === this.secret() 
        ? 'correct' 
        : guessValue > this.secret() 
          ? 'to-high' 
          : 'too-low',
    );

    this.history.set([...this.history(), `${this.lastGuess()} ${this.lastGuessResult()}`]);
    this.guessCount.set(this.guessCount() + 1);
    if (this.lastGuessResult() === 'correct') {
      this.phase.set('win');
    } else if (this.guessCount() === this.maxGuesses()) {
      this.phase.set('loss')
    }

  }
}
