import type { Workout } from '../models/training.model';

export function countCompletedWorkouts(workouts: readonly Workout[]): number {
    return workouts.filter(w => w.completed).length;
}

export function countIncompleteWorkouts(workouts: readonly Workout[]): number {
    return workouts.filter(w => !w.completed).length;
}

export function countCompletedExercises(workouts: readonly Workout[]): number {
    return workouts.reduce(
        (count, workout) => count + workout.exercises.filter(e => e.completed).length, 
        0);
}

export function countIncompleteExercises(workouts: readonly Workout[]): number {
    return workouts.reduce(
        (count, workout) => count + workout.exercises.filter(e => !e.completed).length, 
        0);
}

