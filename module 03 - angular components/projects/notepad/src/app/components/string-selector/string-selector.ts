import { Component, input, model } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-string-selector',
  styleUrl: './string-selector.css',
  templateUrl: './string-selector.html',
})
export class StringSelector {
  readonly options = input.required<string[]>();

  readonly selected = model('');
}
