import { Component, signal } from '@angular/core';
import { Title } from './components/title/title';

@Component({
  selector: 'app-root',
  imports: [Title],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // state of the application
  readonly possibleColors = signal(['red', 'green', 'blue', 'brown', 'purple', 'yellow', 'black']);
  readonly possibleFonts = signal(['Arial', 'Verdana', 'Consolas', 'Segoe UI', 'Times New Roman', 'Courier New']);
  readonly possibleSizes = signal(['12px', '14px', '16px', '18px', '20px', '24px', '36px', '48px']);

  readonly selectedColor = signal(this.possibleColors()[0]);
  readonly selectedFont = signal(this.possibleFonts()[0]);
  readonly selectedSize = signal(this.possibleSizes()[0]);

  // actions
  selectColor(color: string) {
    this.selectedColor.set(color);
  }

  selectFont(font: string) {
    this.selectedFont.set(font);
  }

  selectSize(size: string) {
    this.selectedSize.set(size);
  }
}
