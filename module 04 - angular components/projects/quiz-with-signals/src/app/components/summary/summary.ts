import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-summary',
  styleUrl: './summary.css',
  templateUrl: './summary.html',
})
export class Summary {
  readonly score = input.required<number>();

}
