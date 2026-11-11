import { Draft, produce } from "immer";

export function addItem<T>(items: T[], item: T): T[] {
  return [...items, item];
}

export function removeItem<T>(items: T[], condition: (item: T, index: number) => boolean): T[] {
  return items.filter(condition);
}

export function changeItem<T>(items: T[], updater: (item: T, index: number) => Partial<T>): T[] {
    return items.map((item, index) => ({
        ...item,
        ...updater(item, index)
    }));
}

export function changeItemIf<T>(items: T[], 
    condition: (item: T, index: number) => boolean, 
    updater: (item: T, index: number) => Partial<T>): T[] {
        return items.map((item, index) => condition(item, index)
            ? {
                ...item,
                ...updater(item, index)
            }
            : item
        )
    }

export function change<T>(item: T, updates: (item: T) => Partial<T>): T {
    return {
        ...item,
        ...updates(item)
    };
}

export function mutate<T>(item: T, mutator: (item: Draft<T>) => void): T {
    return produce(item, mutator);
}