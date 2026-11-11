import { TodoItem } from "../models/todo-item";
import { addItem, changeItemIf, removeItem } from "./immutables";
import { Updater } from "./updater";

export function addNewItem(caption: string): Updater<TodoItem[]> {
  return items => addItem(items, {caption, isCompleted: false});
}

export function toggleItem(caption: string): Updater<TodoItem[]> {
  return items => changeItemIf(items, 
    td => td.caption === caption, 
    td => ({ isCompleted: !td.isCompleted }));
}

export function removeTodo(caption: string): Updater<TodoItem[]> {
    return items => removeItem(items, td => td.caption !== caption);
}

export function removeFirstItem(): Updater<TodoItem[]> {
  return items => removeItem(items, (td, index) => index !== 0);
}
