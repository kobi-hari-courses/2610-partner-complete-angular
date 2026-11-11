import { Draft, produce } from "immer";

export type Updater<T> = (state: T) => T;

export function mutate<T>(obj: T, mutator: (draft: Draft<T>) => void): T {
    return produce(obj, mutator);
}

export function change<T>(obj: T, updater: (state: T) => Partial<T>): T {
    return {
        ...obj,
        ...updater(obj)
    }
}

export function updateItemIf<T>(arr: T[], 
    predicate: (item: T, index: number) => boolean, 
    updater: (item: T, index: number) => Partial<T>): T[] {
    return arr.map((item, index) => 
        predicate(item, index) 
            ? { ...item, ...updater(item, index) } 
            : item);
}

export function removeItemIf<T>(arr: T[], predicate: (item: T, index: number) => boolean): T[] {
    return arr.filter((item, index) => !predicate(item, index));
}

export function updateItemAt<T>(arr: T[], index: number, 
    updater: (item: T) => Partial<T>): T[] {
    return arr.map((item, i) => i === index 
        ? { ...item, ...updater(item) } 
        : item);
}

