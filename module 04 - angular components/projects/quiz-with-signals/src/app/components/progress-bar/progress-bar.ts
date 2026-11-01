import { Component, computed, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-progress-bar',
  styleUrl: './progress-bar.css',
  templateUrl: './progress-bar.html',
})
export class ProgressBar {
  readonly total = input.required<number>();
  readonly value = input.required<number>();

  readonly ratio = computed(() => this.value() / this.total() * 100);
}
