import { Component, signal, computed } from '@angular/core';
import type { TrainingPlan, TryItem, Workout } from './models/training.model';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [JsonPipe],
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

  readonly planName = computed(() => this.plan().name);
  readonly weeklyGoal = computed(() => this.plan().weeklyGoal);

  updatePlanName(newName: string) {
    this.plan.update(plan => ({ ...plan, name: newName }));
  }

  updateWeeklyGoal(newGoal: number) {
    this.plan.update(plan => ({ ...plan, weeklyGoal: newGoal }));
  }

  addWorkout(newWorkout: string) {
    if (!newWorkout.trim()) {
      throw new Error('Workout name cannot be empty');
    }

    const workout: Workout = {
      id: crypto.randomUUID(),
      name: newWorkout, 
      completed: false, 
      exercises: []
    };
    this.plan.update(plan => ({ 
      ...plan, 
      workouts: [...plan.workouts, workout] 
    }));

  }


  addExercise(newExercise: string) {
    if (!newExercise.trim()) {
      throw new Error('Exercise name cannot be empty');
    }
    const tryItem: TryItem = {
      id: crypto.randomUUID(),
      name: newExercise,       
    }


    this.plan.update(plan => ({
      ...plan,
      tryItems: [...plan.tryItems, tryItem]
    }));
  }

}
