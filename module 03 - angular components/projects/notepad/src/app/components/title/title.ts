import { Component, computed, input } from '@angular/core';
import { getContrastingGray } from '../../utils/colors';

@Component({
  imports: [],
  selector: 'app-title',
  styleUrl: './title.css',
  templateUrl: './title.html',
  host: {
    '[style.color]': 'color()', 
    '[attr.title]': 'caption()', 
    '[style.background]': 'inverse()'
  }
})
export class Title {
  readonly caption = input.required<string>();

  readonly color = input('black');

  readonly inverse = computed(() => getContrastingGray(this.color()));
}
