import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // State (Data)
  readonly keyword = signal('');
  readonly results = signal<string[]>([]);
  readonly isBusy = signal(false);

  // Actions (Methods)
  setKeyword(value: string) {
    this.keyword.set(value);
  }

  search() {
    console.log('Starting to search', this.keyword())
    this.isBusy.set(true);
    this.results.set([]);

    setTimeout(() => {
      this.isBusy.set(false);
      this.results.set([
        this.keyword().toUpperCase(), 
        this.keyword().toLowerCase(), 
        `** ${this.keyword()} **`
      ])
    }, 3000);

  }


}
