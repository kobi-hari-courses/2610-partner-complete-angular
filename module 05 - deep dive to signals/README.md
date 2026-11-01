# Module 05 - Signals

## Projects

| Project | Project Description |
| --- | --- |
| [fun-with-signals](./projects/fun-with-signals/) | Explores `signal`, `computed`, `effect`, and `linkedSignal`, and practices immutable update patterns on a list of people |
| [quiz-with-signals](./projects/quiz-with-signals/) | A complete quiz application combining core state, derived state, component inputs and outputs, and CSS tricks |

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

We learned the functional-programming convention we followed throughout the module: **utilities may hold and mutate internal state, but data entities must be immutable**. We modeled data entities as interface types whose properties are all `readonly`, as in `models.ts` of *fun-with-signals*:

```ts
export interface Person {
    readonly name: string;
    readonly age: number;
    readonly email: string;
    readonly address: Address;
    readonly experience: ExperienceItem[];
}

export interface Address {
    readonly street: string;
    readonly city: string;
    readonly zip: string;
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

### Why we minimize effects

We understood that `effect` is problematic: because it both reads and may write signals, it can easily create **infinite loops** - writing to a signal re-triggers the effect that depends on it. We therefore try to **minimize the use of effects**, and we are especially careful when an effect needs to modify signals. Deriving state with `computed` (or `linkedSignal`) is almost always preferable.

### linkedSignal and its usages

We learned about `linkedSignal` and its different usages:

* **A computed that is also writable** - it derives its value from a source but can still be set directly, resetting whenever the source changes.
* **A computed that also considers its previous value**, not just the current source value. For example, a signal that tracks the maximum value its source has ever had:

```ts
readonly max = linkedSignal<number, number>({
  source: () => this.c(),
  computation: (prm, prev) => prm >= (prev?.value ?? prm)
    ? prm
    : prev!.value!
});
```

* **A signal that allows writing back to its source**, using the `set` option:

```ts
readonly name = signal('kobi');
readonly upper = linkedSignal(() => this.name().toUpperCase(), {
  set: val => this.name.set(val.toLowerCase())
});
```

### Modifying signals with immutable data

We learned how to update signals that hold immutable data using **"reducer" logic** - a function that generates a *new* value from the old value instead of mutating it. We used the **spread operator** together with the array methods **`map`**, **`find`**, and **`filter`** to add items, change items, and remove items:

```ts
// add an item
this.answers.update(all => [...all, answer]);

// change a nested property of one item in an array
this.people.update(old =>
  old.map(p => p.name === this.selectedPerson()
    ? { ...p, email: 'newemail@example.com' }
    : p));
```

We saw that for nested structures this creates relatively complex code - every level of the object has to be copied with a spread of its own.

### Simplifying with pure helper functions

To avoid packing the whole update into the `computed` or the `.update` call, we extracted the logic into **generic helper functions** and **more specific pure helper functions**. The generic `changeItem` in `utils/immutables.ts` changes matching items of any array immutably:

```ts
export function changeItem<T>(array: T[],
    picker: (item: T, index: number) => boolean,
    changer: (item: T, index: number) => Partial<T>
): T[] {
    return array.map((item, index) => picker(item, index)
        ? { ...item, ...changer(item, index) }
        : item);
}
```

Domain-specific helpers in `people.helpers.ts` then composed it, keeping the component short and readable:

```ts
export function changePersonExperience(p: Person, index: number, role: ExperienceRole): Person {
    return {
        ...p,
        experience: changeItem(
            p.experience,
            (e, i) => i === index,
            (_) => ({ role }),
        ),
    }
}

export function selectByName(selectedName: string): (p: Person) => boolean {
    return (p: Person) => p.name === selectedName;
}
```

```ts
changeSelectedEmail() {
  this.people.update((old) =>
    changeItem(
      old,
      selectByName(this.selectedPerson()),
      (_) => ({ email: 'newemail@example.com' }),
    ),
  );
}
```

### Immutable updates with Immer

We used the **immer** package to perform immutable operations while *writing mutating code*. Immer's `produce` hands us a **draft**, collects the changes we make to it, and then applies them to create a new immutable object - the original is never touched:

```ts
import { produce } from "immer";

export function changeFirstExperienceOfSelectedPerson(
    p: Person[], selectedName: string, role: ExperienceRole): Person[] {
    return produce(p, draft => {
        const selectedPerson = draft.find(p => p.name === selectedName);
        if (selectedPerson) {
            selectedPerson.experience[0].role = role;
        }
    })
}
```

### The quiz application

We finished the module with the *quiz-with-signals* project — a "quiz" application that brought together everything we learned so far in the course.

* **Core state vs. derived state**: the application has only two writable signals - the questions and the answers given so far. Everything else is derived with `computed`:

```ts
export class App {
  // core state
  readonly questions = signal(fakeQuestions);
  readonly answers = signal<number[]>([]);

  // derived state
  readonly currentQuestionIndex = computed(() => this.answers().length);
  readonly currentQuestion = computed(() => this.questions()[this.currentQuestionIndex()]);
  readonly isQuizDone = computed(() => this.questions().length === this.answers().length);
  readonly correctAnswersCount = computed(() => correctAnswersCount(this.questions(), this.answers()));
  readonly score = computed(() => Math.round(this.correctAnswersCount() / this.questions().length * 100));
  readonly report = computed(() => buildReport(this.questions(), this.answers()));

  // actions
  userAnswered(answer: number) {
    this.answers.update(all => [...all, answer]);
  }

  restartQuiz() {
    this.answers.set([]);
  }
}
```

* **Separation into components with inputs and outputs**: the root component composed `app-progress-bar`, `app-question-presenter`, and `app-summary`, communicating only through `input` and `output`:

```ts
export class QuestionPresenter {
  readonly question = input.required<Question>();

  readonly userAnswered = output<number>();
}
```

```html
<h1>The Amazing Quiz</h1>
@if(isQuizDone()) {
    <app-summary [score]="score()" [report]="report()"/>
} @else {
    <app-progress-bar
        [total]="questions().length"
        [value]="answers().length"/>
    <app-question-presenter [question]="currentQuestion()"
        (userAnswered)="userAnswered($event)"/>
}

<button (click)="restartQuiz()">Restart Quiz</button>
```

* **Pure helpers for the heavy lifting**: calculating the number of correct answers and building the final report lived in `quiz.helpers.ts`, keeping the computeds one-liners:

```ts
export function correctAnswersCount(questions: Question[], answers: number[]): number {
    const correctAnswers = answers.filter((a, i) => a === questions[i].correctAnswerIndex);
    return correctAnswers.length;
}
```

* **CSS tricks**: the progress bar was styled with a gradient and a transition, and its width was bound to a computed ratio with a style binding. The summary used class bindings with `&.selected`, `&.correct` nested selectors and an `::after` pseudo-element to mark correct answers. Shared colors were defined as CSS custom properties in `styles.css`:

```html
<div class="progress" [style.width.%]="ratio()"></div>
```

```css
:host {
    border: 1px solid var(--main-color);
    height: 2rem;
    display: flex;
    padding: 0.2rem;

    .progress {
        min-width: 5px;
        background: linear-gradient(to right,
            var(--main-color-light),
            var(--main-color));
        transition: 0.3s;
    }
}
```
