import { Component, signal } from '@angular/core';
import { Calc } from './components/calc/calc';
import { Group } from './components/group/group';

@Component({
  selector: 'app-root',
  imports: [Calc, Group],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
