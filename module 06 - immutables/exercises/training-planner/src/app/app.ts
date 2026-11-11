import { Component, signal, computed } from '@angular/core';
import { countCompletedWorkouts, countIncompleteWorkouts, countCompletedExercises, countIncompleteExercises } from './helpers/training-computed';
import { InputButton } from './components/input-button/input-button';
import type { TrainingPlan, TryItem, Workout } from './models/training.model';
import { JsonPipe } from '@angular/common';
import {
  addExercise,
  addExerciseToWorkout,
  addWorkout,
  deleteExerciseFromWorkout,
  removeTryItem,
  removeWorkout,
  toggleExerciseCompletion,
  toggleWorkout,
  updateExerciseName,
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

  readonly completedWorkouts = computed(() => 
    countCompletedWorkouts(this.plan().workouts));

  readonly incompleteWorkouts = computed(() => 
    countIncompleteWorkouts(this.plan().workouts));

  readonly completedExercises = computed(() => 
    countCompletedExercises(this.plan().workouts));

  readonly incompleteExercises = computed(() => 
    countIncompleteExercises(this.plan().workouts));

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

  addExerciseToWorkout(workoutId: string, newExercise: string) {
    if (!newExercise.trim()) {
      throw new Error('Exercise name cannot be empty');
    }
    this.plan.update(addExerciseToWorkout(workoutId, newExercise));
  }

  updateExerciseName(workoutId: string, exerciseId: string, newName: string) {
    this.plan.update(updateExerciseName(workoutId, exerciseId, newName));
  }

  toggleExerciseCompletion(workoutId: string, exerciseId: string) {
    this.plan.update(toggleExerciseCompletion(workoutId, exerciseId));
  }

  deleteExerciseFromWorkout(workoutId: string, exerciseId: string) {
    this.plan.update(deleteExerciseFromWorkout(workoutId, exerciseId));
  }
}
