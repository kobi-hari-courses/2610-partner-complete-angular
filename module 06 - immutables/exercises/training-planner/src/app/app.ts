import { Component, signal } from '@angular/core';
import type { TrainingPlan } from './models/training.model';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly plan = signal<TrainingPlan>({
    name: 'My Training Plan',
    weeklyGoal: 3,
    workouts: [],
    tryItems: []
  });
}
