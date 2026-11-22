import { Component, signal } from '@angular/core';
import { Calc } from './components/calc/calc';
import { Group } from './components/group/group';
import { TimerPresenter } from './timer-presenter/timer-presenter';

@Component({
  selector: 'app-root',
  imports: [Calc, Group, TimerPresenter],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly showTimer = signal(false);
  toggleTimer() {
    this.showTimer.update(v => !v);
  }
}
