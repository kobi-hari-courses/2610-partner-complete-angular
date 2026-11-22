import { Component, inject, signal } from '@angular/core';
import { AdditionService } from '../../services/addition.service';

@Component({
  imports: [],
  selector: 'app-calc',
  styleUrl: './calc.css',
  templateUrl: './calc.html',
  providers: []
})
export class Calc {
  readonly additionService = inject(AdditionService);
  readonly result = signal(0);


  add(a: number, b: number) {
    const res = this.additionService.add(a, b);
    this.result.set(res);
  }
}
