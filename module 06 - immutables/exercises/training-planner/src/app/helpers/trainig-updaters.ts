import { TrainingPlan } from "../models/training.model";
import { Updater } from "./updater";

export function updatePlanName(newName: string): Updater<TrainingPlan> {
    return plan => ({
        ...plan,
        name: newName
    });
}

export function updateWeeklyGoal(newGoal: number): Updater<TrainingPlan> {
    return plan => ({
        ...plan,
        weeklyGoal: newGoal
    });
}

export function addWorkout(newWorkout: string): Updater<TrainingPlan> {
    return plan => ({
        ...plan,
        workouts: [...plan.workouts, {
            id: crypto.randomUUID(),
            name: newWorkout,
            completed: false,
            exercises: []
        }]
    });
}

export function addExercise(newExercise: string): Updater<TrainingPlan> {
    return plan => ({
        ...plan,
        tryItems: [...plan.tryItems, {
            id: crypto.randomUUID(),
            name: newExercise
        }]
    });
}

export function updateWorkoutName(workoutId: string, newName: string): Updater<TrainingPlan> {
    return plan => ({
        ...plan,
        workouts: plan.workouts.map(workout =>
            workout.id === workoutId 
            ? { ...workout, name: newName } 
            : workout
        )
    });
}

export function toggleWorkout(id: string): Updater<TrainingPlan> {
    return plan => ({
        ...plan, 
        workouts: plan.workouts.map(workout =>
            workout.id === id 
                ? { ...workout, completed: !workout.completed } 
                : workout
        )
    })
}

export function removeWorkout(workoutId: string): Updater<TrainingPlan> {
    return plan => ({
        ...plan,
        workouts: plan.workouts.filter(workout => workout.id !== workoutId)
    });
}

export function updateTryItemName(tryItemId: string, newName: string): Updater<TrainingPlan> {
    return plan => ({
        ...plan,
        tryItems: plan.tryItems.map(tryItem =>
            tryItem.id === tryItemId ? { ...tryItem, name: newName } : tryItem
        )
    });
}

export function removeTryItem(tryItemId: string): Updater<TrainingPlan> {
    return plan => ({
        ...plan,
        tryItems: plan.tryItems.filter(tryItem => tryItem.id !== tryItemId)
    });
}