import { Component, computed, input, output } from '@angular/core';
import { getContrastingGray } from '../../utils/colors';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, timer } from 'rxjs';
import { getSlowGray } from '../../services/color-calculations';

@Component({
  imports: [],
  selector: 'app-title',
  styleUrl: './title.css',
  templateUrl: './title.html',
  host: {
    '[style.color]': 'color()', 
    '[attr.title]': 'caption()', 
    '[style.background]': 'inverse()', 
    '(click)': 'whenClicked()'
  }
})
export class Title {
  readonly caption = input.required<string>();

  readonly color = input('black');
  readonly inverse = computed(() => getContrastingGray(this.color()));

  readonly whatever = output<number>();
  #clickCount = 0;

  whenClicked() {
    this.#clickCount++;
    if (this.#clickCount % 3 === 0) {
      // this.whatever.emit(this.#clickCount);
    }

  }
}
