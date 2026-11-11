import type { Workout } from '../models/training.model';

export function countCompletedWorkouts(workouts: readonly Workout[]): number {
    return workouts.filter(w => w.completed).length;
}

export function countIncompleteWorkouts(workouts: readonly Workout[]): number {
    return workouts.filter(w => !w.completed).length;
}

