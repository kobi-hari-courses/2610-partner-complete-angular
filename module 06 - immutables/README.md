# Module 06 - Immutables

## Projects

| Project | Project Description |
| --- | --- |
| [todo-list](./projects/todo-list/) | A todo list managed with immutable data, using pure updater functions, generic immutable helpers, and immer |
| [immutable-shop](./projects/immutable-shop/) | A product catalogue and shopping cart whose state changes only through pure updater functions |

## Summary

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
