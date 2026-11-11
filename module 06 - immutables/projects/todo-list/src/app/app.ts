import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoItem } from './models/todo-item';
import { addNewItem, removeItem, toggleItem } from './todos.updaters';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly todos = signal<TodoItem[]>([]);

  addNewItem(caption: string) {
    this.todos.update(addNewItem(caption))
  }

  toggleItem(caption: string) {
    this.todos.update(toggleItem(caption))
  }

  removeItem(caption: string) {
    this.todos.update(removeItem(caption))
  }
}
