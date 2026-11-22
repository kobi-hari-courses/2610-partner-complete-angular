import { Component, DestroyRef, inject, OnDestroy, signal } from '@angular/core';
import { startCounter } from '../utils/counter';

@Component({
  imports: [],
  selector: 'app-timer-presenter',
  styleUrl: './timer-presenter.css',
  templateUrl: './timer-presenter.html',
})
export class TimerPresenter {
  readonly value = signal(0);
  constructor() {
    startCounter(() => {
      this.value.update(v => v+1);
      console.log('Counter = ', this.value());
    });
  }
}
