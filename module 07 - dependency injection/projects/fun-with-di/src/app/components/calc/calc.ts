import { Component, inject, Injector, runInInjectionContext, signal } from '@angular/core';
import { AdditionService } from '../../services/addition.service';
import { WrongAdditionService } from '../../services/wrong-addition.service';
import { PREFIX } from '../../tokens/prefix.token';

@Component({
  imports: [],
  selector: 'app-calc',
  styleUrl: './calc.css',
  templateUrl: './calc.html',
  providers: [],
})
export class Calc {
  readonly injector = inject(Injector);
  readonly additionService = inject(AdditionService);
  readonly wrongAdditionService = inject(WrongAdditionService);
  readonly result = signal(0);

  add(a: number, b: number) {
    runInInjectionContext(this.injector, () => {
      const prefix = inject(PREFIX);
      console.log('the prefix is', prefix());
      const res = this.additionService.add(a, b);
      this.result.set(res);
    });
  }
}
