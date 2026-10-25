# Module 03 - Hello Angular

In this module we compared modern Angular with legacy Angular, created and ran an Angular application, and built a small search interface using a standalone component and writable signals.

## Modern Angular and Legacy Angular

* We discussed three areas that made legacy Angular more complicated to learn and use:
  1. **NgModules** combined two separate responsibilities: declaring components and directives, and configuring dependency-injection providers. Because those responsibilities had different needs, APIs such as `forRoot()` and `forChild()` were introduced. Lazy-loaded feature modules also added boilerplate, often requiring a routing module alongside the feature module, while the root module accumulated configuration.
  2. **Change detection with Zone.js** relied on Zone.js patching asynchronous browser APIs and notifying Angular when work might have changed the view. This could cause checks more broadly than necessary and affect performance.
  3. **RxJS** provided powerful observable streams, but its operators and subscription model could make ordinary state updates harder to follow. We saw how signals provided a simpler way to track local component state and update the UI when that state changed.

## JavaScript's Thread, Stack, and Queue

* We reviewed how JavaScript in the browser generally runs application code on a main thread. The **call stack** holds the functions currently being executed.
* When an operation such as a timer completes asynchronously, its callback is scheduled to run later. The **event loop** moves ready callbacks from a task queue onto the call stack when the stack is clear.
* A long-running synchronous operation blocks the main thread: queued callbacks and browser updates have to wait. Asynchronous work lets the thread continue handling other work while it waits; it does not mean that JavaScript can never block.
* We connected this model to RxJS observables: observables represent values arriving over time, and RxJS helps compose and react to those streams. They do not create a separate JavaScript thread.

## Creating and Running an Angular Project

* We installed the tools needed for development: Node.js, Visual Studio Code, and the Angular CLI.
* We created a project with `ng new` and started its development server with `ng serve`:

  ```powershell
  ng new hello-angular
  cd hello-angular
  ng serve
  ```

* We opened the local development server in a browser and saw that Angular rebuilt the application as we changed its source.

## The Modern Application Structure

* We explored the generated project and saw that it did not use an `AppModule`. The root component was standalone, and application-wide configuration lived separately in `app.config.ts`.
* In `main.ts`, `bootstrapApplication` accepted two arguments: the root component, which established the component tree, and the application configuration, which supplied dependency-injection providers and other setup.

  ```typescript
  bootstrapApplication(App, appConfig)
    .catch((err) => console.error(err));
  ```

* We looked at how Angular connected a component to the page. Angular matched component selectors in the template, created the component class instance (the **view model**), and rendered the component template in its host element with bindings to that instance.

## Components, Templates, and Styles

* We saw that a component brought together a selector, a class, a template, and component styles. In our project, the root component used the `app-root` selector and referenced its HTML and CSS files:

  ```typescript
  @Component({
    selector: 'app-root',
    imports: [],
    templateUrl: './app.html',
    styleUrl: './app.css'
  })
  export class App {
    // Component state and actions
  }
  ```

* We discussed style locality: styles in a component's stylesheet were scoped to that component rather than being general page-wide styles. We used `:host` to select the component's host element and saw how nested CSS selectors expressed styles for elements within the component. Global styles, by contrast, belonged in `styles.css`.

## Writable Signals and UI Updates

* We represented changing component state with writable signals. In the project, the keyword, result list, and busy state were signals:

  ```typescript
  readonly keyword = signal('');
  readonly results = signal<string[]>([]);
  readonly isBusy = signal(false);
  ```

* We read a signal by calling it, such as `this.keyword()`, and changed its value with `.set()`:

  ```typescript
  setKeyword(value: string) {
    this.keyword.set(value);
  }

  search() {
    this.isBusy.set(true);
    this.results.set([]);

    setTimeout(() => {
      this.isBusy.set(false);
      this.results.set([
        this.keyword().toUpperCase(),
        this.keyword().toLowerCase(),
        `** ${this.keyword()} **`
      ]);
    }, 3000);
  }
  ```

* We saw that changing an ordinary, non-signal field inside a `setTimeout` did not by itself notify Angular to update the UI in the modern change-detection setup we discussed. Updating state with `signal.set()` did notify Angular, so the view reflected the asynchronous result.
* We worked with **writable signals** and `.set()`. We did not cover computed signals in this module.

## Template References, Events, and Control Flow

* We created a template reference with `#searchBox` and used it in an event binding to read the input value. The component method then updated the signal:

  ```html
  <input #searchBox type="search"
    (input)="setKeyword(searchBox.value)"
    [disabled]="isBusy()"
  />
  <button (click)="search()" [disabled]="isBusy()">Go</button>
  ```

* We used `(input)` and `(click)` to respond to user events, and `[disabled]` to bind an element's disabled state to the component's busy signal.
* We used Angular's built-in `@if` block to conditionally render the loading indicator and `@for` to render the results:

  ```html
  @if (isBusy()) {
    <img src="..." />
  }

  <ul>
    @for (res of results(); track $index) {
      <li>{{ res }}</li>
    }
  </ul>
  ```
