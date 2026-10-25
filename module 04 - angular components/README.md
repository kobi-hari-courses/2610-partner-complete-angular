# Module 04 - Angular Components

## Projects

| Project | Project Description |
| --- | --- |
| [notepad](./projects/notepad/) | Builds a notepad interface to practice CSS layout, component inputs, outputs, and model inputs |
| [quiz-with-signals](./projects/quiz-with-signals/) | Practices separating core quiz state from derived state with signals and helper functions; the application is not complete yet |

## Summary

In this module, we built two Angular applications. The Notepad project introduced component communication and CSS organization. The Quiz project gave us a chance to apply signals to a larger example by separating the state we store from the values we derive from it.

### Organizing CSS and building a responsive layout

We organized styles into global styles and component styles. The global stylesheet established a baseline reset and defined custom properties that can be reused throughout the page:

```css
:root {
  --divider: lightgray;
  --hover: rgb(229, 227, 227);
  --selected: rgb(166, 228, 195);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

In the Notepad, CSS Grid arranged the title, formatting controls, and text area into named regions. This made the page structure explicit and made it straightforward to rearrange the interface for different screen sizes:

```css
:host {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    'title title title'
    'colors fonts sizes'
    'text text text';
}
```

### Styling from template state

Angular property bindings can set CSS classes and styles based on component state. The Notepad uses `[class.chosen]` to mark the selected option and style bindings to format the text:

```html
<li
  (click)="selected.set(item)"
  [class.chosen]="item === selected()"
>
  {{ item }}
</li>

<textarea
  [style.color]="selectedColor()"
  [style.font-family]="selectedFont()"
  [style.font-size]="selectedSize()"
></textarea>
```

### The title component and input signals

We built the `Title` component and passed values into it from its parent. `input.required` declares a value that the parent must provide, while `input` can provide a default:

```typescript
readonly caption = input.required<string>();
readonly color = input('black');
```

The parent supplies the title and its color:

```html
<app-title
  caption="Welcome To Notepad App"
  [color]="selectedColor()"
/>
```

We also used a **computed signal** to derive a contrasting background from the title's current color. The color helper uses canvas color parsing and relative luminance to choose between a dark and light gray:

```typescript
readonly inverse = computed(() => getContrastingGray(this.color()));
```

Because `inverse` depends on `color`, Angular recalculates it when that input changes. This example showed how computed signals can keep derived values synchronized with their source state, even when the computation is more involved than a simple expression.

### The string-selector component and model inputs

The second component, `StringSelector`, receives an array of options and exposes its selected value as a model input:

```typescript
readonly options = input.required<string[]>();
readonly selected = model('');
```

The parent passes an array and uses two-way binding for the selected value:

```html
<app-string-selector
  [options]="possibleColors()"
  [(selected)]="selectedColor"
/>
```

Unlike a regular input, a model input supports two-way binding: the child can update its value, and Angular propagates that change back to the parent.

### Outputs and observable interop

We discussed outputs as a way for a child component to notify its parent about an event. The Notepad declares an output, and its parent listens for it and receives the emitted value through `$event`:

```typescript
readonly whatever = output<number>();
```

```html
<app-title (whatever)="whenClickedManyTimes($event)" />
```

We also looked at an advanced case connecting Angular inputs and outputs with RxJS observables. Angular's RxJS interop utilities can convert a signal to an observable with `toObservable` and expose an observable as an output with `outputFromObservable`. This showed how component APIs can work with both signal-based state and observable streams.

> **Note:** The Notepad currently has the output binding in place, but the `emit` call in the title component is commented out. As it stands, clicking the title does not trigger the parent's callback.

### The Quiz application: core state and derived state

In the Quiz project, we practiced distinguishing **core state**—the values the application stores—from **derived state**, which is calculated from that state. The question list and submitted answers are core state:

```typescript
readonly allQuestions = signal<Question[]>(ALL_QUESTIONS);
readonly allAnswers = signal<number[]>([]);
```

The current question, progress, completion status, and score are derived:

```typescript
readonly answeredQuestionsCount = computed(() => this.allAnswers().length);
readonly currentQuestionIndex = computed(() => this.answeredQuestionsCount());
readonly currentQuestion = computed(
  () => this.allQuestions()[this.currentQuestionIndex()],
);
readonly isQuizDone = computed(
  () => this.answeredQuestionsCount() === this.totalQuestionsCount(),
);
```

We kept computations that were more than trivial in helper functions. For example, the helpers count correct answers and calculate the score while handling a quiz with no questions:

```typescript
export function calculateScore(
  correctAnswerCount: number,
  totalQuestionsCount: number,
): number {
  if (totalQuestionsCount === 0) {
    return 0;
  }
  return Math.round((correctAnswerCount / totalQuestionsCount) * 100);
}
```

The Quiz project is a work in progress. Its application state and derived values are in place, but the quiz experience and its components are not finished. We will continue and complete it next week.
