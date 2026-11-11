# Module 05 - Signals

## Projects

| Project | Project Description |
| --- | --- |
| [fun-with-signals](./projects/fun-with-signals/) | Explores `signal`, `computed`, `effect`, `linkedSignal`, and `resource` |
| [todo-list](./projects/todo-list/) | A todo list managed with immutable data, using pure updater functions, generic immutable helpers, and immer |
| [immutable-shop](./projects/immutable-shop/) | A product catalogue and shopping cart whose state changes only through pure updater functions |

## Summary

### Reactive programming without classes

We discussed the building blocks of reactive programming in JavaScript, and saw that it does not need classes or constructors:

* We used **functions to create objects**, rather than constructors.
* We used **closures to hold state**: the variables captured by the returned function lived on after the creating function returned.
* We relied on the fact that **functions in JavaScript are objects** — they are containers of properties — so a factory can return a function and still attach additional methods to it that mutate the closed-over state:

```js
function createCounter() {
  let value = 0;

  const read = () => value;
  read.increment = () => { value = value + 1; };

  return read;
}

const counter = createCounter();
counter.increment();
console.log(counter()); // 1
```

This pattern is exactly how a signal works: calling it reads the value, and methods attached to it change the value.

### Functional programming: mutable utilities, immutable data

We learned the functional-programming convention we followed throughout the module: **utilities may hold and mutate internal state, but data entities must be immutable**. We modeled data entities as interface types whose properties are all `readonly`, as in `shop.model.ts` of *immutable-shop*:

```ts
export interface Product {
    readonly id: string;
    readonly name: string;
    readonly price: number;
}

export interface CartItem {
    readonly product: Product;
    readonly quantity: number;
}

export interface Cart {
    readonly customer: string;
    readonly items: readonly CartItem[];
}
```

### Signals, reactive context, and producers and consumers

* We learned about **signals** and the **reactive context**: while a reactive computation runs, every signal it reads registers itself as a dependency of that computation.
* We introduced the terms **reactive producer** - a writable signal that produces values - and **reactive consumer** - such as an effect, which reacts to values. A `computed` is actually **both**: it consumes the signals it reads and produces a value for others to consume.
* We understood the **laziness of `computed`**: it does not calculate its value when created or when its dependencies change, but only when someone reads it - and it caches the result until a dependency changes.

### Active and passive consumers

We distinguished between two kinds of consumers:

* A **passive consumer**, like `computed`, is only *notified* (marked dirty) when a dependency changes. It does not instantly recalculate itself; it waits until it is read again.
* An **active consumer**, like `effect`, reacts by itself after the signals it depends on change. The reaction is scheduled and runs asynchronously, so several synchronous changes result in a single run.

### Investigating signal, computed, and effect

In *fun-with-signals* we built a small dependency graph and traced how notifications flow through it:

```ts
readonly i = signal(0);
readonly j = signal(true);

readonly c = computed(() => this.j() ? this.i() : 0);
readonly d = computed(() => this.c() * 2);

constructor() {
  effect(() => {
    console.log('D has changed to: ' + this.d());
  });
}
```

```text
      e (effect)
      |
      d (computed)
      |
      c (computed)
    /   \
   i     j
(signal) (signal)
```

We set `i` and `j` several times in a row and observed that the computed values stayed lazy, and the effect ran once, asynchronously, after the synchronous code finished.

We also saw that the dependency graph is **dynamic** — it is rebuilt on every run of the computation. When `j` is `false`, the computed `c` never reads `i`, so `i` is no longer one of its dependencies, and changes to `i` do not even notify `c`:

```text
      e (effect)
      |
      d (computed)
      |
      c (computed)
         \
          j
        (false)
```

### Why we minimize effects

We understood that `effect` is problematic: because it both reads and may write signals, it can easily create **infinite loops** - writing to a signal re-triggers the effect that depends on it. We therefore try to **minimize the use of effects**, and we are especially careful when an effect needs to modify signals. Deriving state with `computed` (or `linkedSignal`) is almost always preferable.

A **legitimate use of an effect** is synchronizing signal state *out* to the world, rather than writing back into signals. For example, persisting a signal to `localStorage` whenever it changes, and restoring it when the application starts:

```ts
constructor() {
  const json = localStorage.getItem('todos');
  if (json) {
    this.todos.set(JSON.parse(json) as TodoItem[]);
  }

  effect(() => {
    const todos = this.todos();
    localStorage.setItem('todos', JSON.stringify(todos));
  });
}
```

### linkedSignal and its usages

We learned about `linkedSignal` and its different usages:

* **A computed that is also writable** - it derives its value from a source but can still be set directly, resetting whenever the source changes:

```ts
readonly ctag = linkedSignal(() => this.j() ? this.i() : 0);
```

* **A computed that also considers its previous value**, not just the current source value. For example, a signal that tracks the maximum value its source has ever had:

```ts
readonly max = linkedSignal<number, number>({
  source: this.i,
  computation: (src, prv) => {
    if (!prv) return src;

    if (src > prv.value) return src;
    return prv.value;
  }
})
```

* **A signal that allows writing back to its source**, using the `set` option:

```ts
name = signal('kobi');
upper = linkedSignal(() => this.name().toUpperCase(), {
  set: v => this.name.set(v.toLocaleLowerCase())
});
```

### Loading asynchronous data with resource

We learned about the **`resource`** API, which connects signals to asynchronous data. A resource takes a `params` signal and an async `loader`; whenever the params signal changes, the loader runs again, and the resource exposes signals such as `value`, `status`, and `isLoading` that describe the request:

```ts
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
```

In this example the loader simulates a slow server call with a three-second delay, and recalculates the results whenever `keyword` changes.

### Modifying signals with immutable data

In the *todo-list* project we learned how to update signals that hold immutable data using **"reducer" logic** - a function that generates a *new* value from the old value instead of mutating it. We used the **spread operator** together with the array methods **`map`**, **`find`**, and **`filter`** to add items, change items, and remove items:

```ts
// add an item
this.todos.update(items => [...items, { caption, isCompleted: false }]);

// change one item in an array
this.todos.update(items =>
  items.map(td => td.caption === caption
    ? { ...td, isCompleted: !td.isCompleted }
    : td));
```

We saw that for nested structures this creates relatively complex code - every level of the object has to be copied with a spread of its own.

### Simplifying with pure helper functions

To avoid packing the whole update into the `.update` call, we extracted the logic into **generic helper functions** and **more specific pure helper functions**. We defined an `Updater<T>` type for functions that produce a new state from the old one:

```ts
export type Updater<T> = (state: T) => T;
```

The generic helpers in `updaters/immutables.ts` of *todo-list* add, remove, and change items of any array immutably:

```ts
export function addItem<T>(items: T[], item: T): T[] {
  return [...items, item];
}

export function changeItemIf<T>(items: T[],
    condition: (item: T, index: number) => boolean,
    updater: (item: T, index: number) => Partial<T>): T[] {
        return items.map((item, index) => condition(item, index)
            ? {
                ...item,
                ...updater(item, index)
            }
            : item
        )
    }
```

Domain-specific **updater factories** in `todos.updaters.ts` then composed them - pure functions that take parameters and return an `Updater`:

```ts
export function addNewItem(caption: string): Updater<TodoItem[]> {
  return items => addItem(items, {caption, isCompleted: false});
}

export function toggleItem(caption: string): Updater<TodoItem[]> {
  return items => changeItemIf(items,
    td => td.caption === caption,
    td => ({ isCompleted: !td.isCompleted }));
}
```

This kept the component short and readable - every action is a one-liner that passes an updater to `.update`:

```ts
readonly todos = signal<TodoItem[]>([]);

addNewItem(caption: string) {
  this.todos.update(addNewItem(caption))
}

toggleItem(caption: string) {
  this.todos.update(toggleItem(caption))
}
```

### Immutable updates with Immer

We used the **immer** package to perform immutable operations while *writing mutating code*. Immer's `produce` hands us a **draft**, collects the changes we make to it, and then applies them to create a new immutable object - the original is never touched. We wrapped it in a `mutate` helper:

```ts
import { Draft, produce } from "immer";

export function mutate<T>(item: T, mutator: (item: Draft<T>) => void): T {
    return produce(item, mutator);
}
```

To demonstrate its value, the *todo-list* project includes a deeply nested `School` model (school → classes → students → topics → quizes). With `mutate`, updating a grade four levels deep reads like straightforward imperative code, yet produces a brand-new immutable `School`:

```ts
export function upgradeQuiz(className: string, studentId: string, topic: string, quizTitle: string): Updater<School> {
    return school => mutate(school, s => {
        const cls = s.classes.find(c => c.name === className);
        if (!cls) return;

        const student = cls.students.find(s => s.id === studentId);
        if (!student) return;

        const course = student.topics.find(c => c.caption === topic);
        if (!course) return;

        const quiz = course.quizes.find(q => q.title === quizTitle);
        if (!quiz) return;
        quiz.grade++;
    });
}
```

### The immutable-shop application

We finished the module with the *immutable-shop* project — a product catalogue and shopping cart that brought the whole pattern together: immutable models, a thin component, and all state changes expressed as updater factories.

* **State and actions**: the component holds the core state in two signals and delegates every action to an updater:

```ts
export class App {
  // state
  readonly products = signal(ALL_PRODUCTS);
  readonly cart = signal(EMPTY_CART);

  // actions
  updateCustomerName(name: string) {
    this.cart.update(updateCustomerName(name));
  }

  incrementProduct(product: Product) {
    this.cart.update(incrementProduct(product));
  }

  decrementProduct(product: Product) {
    this.cart.update(decrementProduct(product));
  }
}
```

* **Spread helpers for simple updates, immer for conditional logic**: simple updaters used the spread-based `change` helper, while updaters with conditional logic used immer through `mutate`:

```ts
export function updateCustomerName(name: string): Updater<Cart> {
    return cart => change(cart, _=>({customer: name}))
}

export function decrementProduct(product: Product): Updater<Cart> {
    return cart => mutate(cart, c => {
        const cartItem = c.items.find(i => i.product.id === product.id);

        if (!cartItem) return;

        if (cartItem.quantity > 1) {
            cartItem.quantity--;
            return;
        }

        c.items = c.items.filter(it => it.product.id !== product.id);
    })
}
```

* **Template**: the catalogue and the cart were rendered with `@for` blocks, binding each button click to the matching action:

```html
<div class="catalogue">
  @for(product of products(); track product.id) {
    <div class="product">
      <div class="name">{{product.name}}</div>
      <div class="price">{{product.price}}</div>
      <button (click)="incrementProduct(product)">+</button>
    </div>
  }
</div>
```
