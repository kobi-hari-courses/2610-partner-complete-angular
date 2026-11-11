# Module 05 - Signals

## Projects

| Project | Project Description |
| --- | --- |
| [fun-with-signals](./projects/fun-with-signals/) | Explores `signal`, `computed`, `effect`, `linkedSignal`, and `resource` |

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
