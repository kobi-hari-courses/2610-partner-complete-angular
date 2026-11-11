import { Component, signal, computed } from '@angular/core';
import { InputButton } from './components/input-button/input-button';
import type { TrainingPlan, TryItem, Workout } from './models/training.model';
import { JsonPipe } from '@angular/common';
import {
  addExercise,
  addWorkout,
  removeTryItem,
  removeWorkout,
  toggleWorkout,
  updatePlanName,
  updateTryItemName,
  updateWeeklyGoal,
  updateWorkoutName,
} from './helpers/trainig-updaters';

@Component({
  selector: 'app-root',
  imports: [JsonPipe, InputButton],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly plan = signal<TrainingPlan>({
    name: 'My Training Plan',
    weeklyGoal: 3,
    workouts: [],
    tryItems: [],
  });

  readonly planName = computed(() => this.plan().name);
  readonly weeklyGoal = computed(() => this.plan().weeklyGoal);

  updatePlanName(newName: string) {
    this.plan.update(updatePlanName(newName));
  }

  updateWeeklyGoal(newGoal: string) {
    this.plan.update(updateWeeklyGoal(Number(newGoal)));
  }

  addWorkout(newWorkout: string) {
    if (!newWorkout.trim()) {
      throw new Error('Workout name cannot be empty');
    }

    this.plan.update(addWorkout(newWorkout));
  }

  addExercise(newExercise: string) {
    if (!newExercise.trim()) {
      throw new Error('Exercise name cannot be empty');
    }
    this.plan.update(addExercise(newExercise));
  }

  updateWorkoutName(workoutId: string, newName: string) {
    this.plan.update(updateWorkoutName(workoutId, newName));
  }

  toggleWorkoutCompletion(workoutId: string) {
    this.plan.update(toggleWorkout(workoutId));
  }

  removeWorkout(workoutId: string) {
    this.plan.update(removeWorkout(workoutId));
  }

  updateTryItemName(tryItemId: string, newName: string) {
    this.plan.update(updateTryItemName(tryItemId, newName));
  }

  removeTryItem(tryItemId: string) {
    this.plan.update(removeTryItem(tryItemId));
  }
}
