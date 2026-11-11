import { TrainingPlan } from "../models/training.model";
import { addItem, change, changeItemIf, removeItem } from "./immutables";
import { Updater } from "./updater";

export function updatePlanName(newName: string): Updater<TrainingPlan> {
    return plan => change(plan, _ => ({ name: newName }));
}

export function updateWeeklyGoal(newGoal: number): Updater<TrainingPlan> {
    return plan => change(plan, _ => ({ weeklyGoal: newGoal }));
}

export function addWorkout(newWorkout: string): Updater<TrainingPlan> {
    return plan => change(plan, _ => ({
        workouts: addItem(plan.workouts, {
            id: crypto.randomUUID(),
            name: newWorkout,
            completed: false,
            exercises: []
        })
    }));
}

export function addExercise(newExercise: string): Updater<TrainingPlan> {
    return plan => change(plan, _ => ({
        tryItems: addItem(plan.tryItems, {
            id: crypto.randomUUID(),
            name: newExercise
        })
    }));
}

export function updateWorkoutName(workoutId: string, newName: string): Updater<TrainingPlan> {
    return plan => change(plan, _ => ({
        workouts: changeItemIf(plan.workouts,  
            w => w.id === workoutId,
            _ => ({name: newName})
        )
    }));
}

export function toggleWorkout(id: string): Updater<TrainingPlan> {
    return plan => change(plan, _ => ({
        workouts: changeItemIf(plan.workouts,
            w => w.id === id,
            w => ({ completed: !w.completed })
        )
    }))
}

export function removeWorkout(workoutId: string): Updater<TrainingPlan> {
    return plan => change(plan, _ => ({
        workouts: removeItem(plan.workouts, w => w.id === workoutId)
    }));
}

export function updateTryItemName(tryItemId: string, newName: string): Updater<TrainingPlan> {
    return plan => change(plan, _ => ({
        tryItems: changeItemIf(plan.tryItems,
            t => t.id === tryItemId,
            _ => ({ name: newName })
        )
    }));
}

export function removeTryItem(tryItemId: string): Updater<TrainingPlan> {
    return plan => change(plan, _ => ({
        tryItems: removeItem(plan.tryItems, t => t.id === tryItemId)
    }));
}