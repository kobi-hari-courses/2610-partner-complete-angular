import { TodoItem } from './models/todo-item';

type Updater<T> = (state: T) => T;

export function addNewItem(caption: string): Updater<TodoItem[]> {
  return (items) => [
    ...items,
    {
      caption,
      isCompleted: false,
    },
  ];
}

export function toggleItem(caption: string): Updater<TodoItem[]> {
  return (items) =>
    items.map((td) => (td.caption === caption 
        ? { ...td, isCompleted: !td.isCompleted } 
        : td));
}

export function removeItem(caption: string): Updater<TodoItem[]> {
    return items => items.filter(td => td.caption !== caption);
}
