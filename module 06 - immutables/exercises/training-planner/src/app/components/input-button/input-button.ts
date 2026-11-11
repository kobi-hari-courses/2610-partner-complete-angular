import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-input-button',
  styleUrl: './input-button.css',
  templateUrl: './input-button.html',
})
export class InputButton {
  readonly label = input('');
  readonly value = input('');

  readonly caption = input('');

  readonly commit = output<string>();
}
