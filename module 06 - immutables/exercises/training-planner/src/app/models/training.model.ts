export interface TrainingPlan {
  readonly name: string;
  readonly weeklyGoal: number;
  readonly workouts: readonly Workout[];
  readonly tryItems: readonly TryItem[];
}

export interface Workout {
  readonly id: string;
  readonly name: string;
  readonly completed: boolean;
  readonly exercises: readonly TrainingExercise[];
}

export interface TrainingExercise {
  readonly id: string;
  readonly name: string;
  readonly completed: boolean;
}

export interface TryItem {
  readonly id: string;
  readonly name: string;
}