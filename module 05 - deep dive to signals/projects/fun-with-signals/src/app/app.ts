import { Component, computed, effect, linkedSignal, resource, ResourceStatus, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly i = signal(0);
  readonly j = signal(true);

  readonly c = computed(() => {
    console.log('Re calculating C');
    return this.j() ? this.i() : 0
  });

  readonly ctag = linkedSignal(() => this.j() ? this.i() : 0);

  readonly max = linkedSignal<number, number>({
    source: this.i,
    computation: (src, prv) => {
      if (!prv) return src;

      if (src > prv.value) return src;
      return prv.value;
    } 
  })


  name = signal('kobi');
  upper = linkedSignal(() => this.name().toUpperCase(), {
    set: v => this.name.set(v.toLocaleLowerCase())
  });

  keyword = signal('hello');
  results = resource({
    params: this.keyword, 
    loader: async prm => {
      await new Promise(res => setTimeout(res, 3000));
      return [
        prm.params.toUpperCase(), 
        prm.params.toLowerCase(),
      ]
    } 
  })

  readonly d = computed(() => {
    console.log('Re Calculating D');
    return this.c() * 2
  });



  doSomething() {
    toSignal(new Subject<number>());

    console.log('d = ', this.d());

    this.ctag.set(10);

  }

  changeManySignals() {
    this.j.set(true);
    this.i.set(10);
    this.j.set(false);
    this.i.set(15);
    this.j.set(true);
    this.i.set(40);
  }

  constructor() {
    effect(()=> {
      console.log('Inside Effect, D = ', this.d());
      this.i.set(this.i() + 1);
    })

  }

}


// J = True


/*
    e(effect)
        |
    d(computed)
        |
    c(computed)
      /       \
      i =0      j
  (number)   (true)



*/



// J = False

/*
    e(effect)
        |
    d(computed)
        |
    c(computed)
            \
             j
          (false)




*/