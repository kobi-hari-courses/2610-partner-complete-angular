# Exercise: Guess the Number

Build a small game using basic modern Angular. The computer chooses a secret number between **1 and 100**, and the player has **up to 7 guesses** to find it.

After each guess, the application tells the player whether the guess was **too high**, **too low**, or **exactly correct**. A correct guess wins the game, including on the seventh attempt. After seven wrong guesses, the game is over.

## What you will practice

- Managing component state with signals.
- Responding to user actions and updating state.
- Using Angular's built-in control flow: `@if` and, in the challenge, `@for`.
- Working with the modern Angular project structure.
- Styling a responsive interface with modern CSS.

Use one standalone root component for this exercise. You do not need routing, services, or an external UI library. The instructions provide hints, not a complete solution.

## Before you start: Create the application

With Node.js and the Angular CLI installed, open a terminal in the directory where you keep your projects and run:

```powershell
ng new guess-the-number
cd guess-the-number
ng serve
```

If the CLI asks about optional AI tooling, no integration is required for this exercise.

Open `http://localhost:4200` in your browser. Keep the development server running while you work.

### Explore the generated structure

Locate these files before changing anything:

| File | Purpose |
| --- | --- |
| `src/main.ts` | Bootstraps the application. |
| `src/app/app.config.ts` | Holds application-wide configuration and providers. |
| `src/app/app.ts` | Contains the root component class: your view model. |
| `src/app/app.html` | Contains the root component's template: your view. |
| `src/app/app.css` | Contains styles for the root component. |
| `src/styles.css` | Contains global styles, such as page defaults. |
| `src/app/app.spec.ts` | Contains the generated root component tests. |

Recent Angular projects use short names such as `app.ts`, rather than `app.component.ts`. Keep the generated standalone structure; do not add an `AppModule`.

Remove the starter screen from `app.html` and remove starter-only properties and imports from the component. Keep its component decorator and its template/style references.

## Step 1 - Planning the State

Before writing any actions or markup, plan the **view model**: the state the application needs to remember, including properties that will not be displayed.

### 1. Identify the phases

The game can be in exactly one of three phases:

- `in-progress`: the player can submit a guess.
- `win`: the player found the secret number.
- `loss`: the player used all seven guesses without finding the number.

Use a single phase property rather than separate booleans such as `hasWon` and `hasLost`. A single property prevents contradictory states.

**Hint:** Define a union type above the component class:

```typescript
type GamePhase = 'in-progress' | 'win' | 'loss';
```

### 2. Plan the properties

Use this table as your state checklist:

| Property | Suggested type | Initial value / responsibility |
| --- | --- | --- |
| Secret number | `number` | A random integer from 1 to 100. Do not display it while the game is in progress. |
| Phase | `GamePhase` | Starts as `in-progress`. |
| Guess count | `number` | Starts at `0`; counts valid guesses only. |
| Last guess | `number \| null` | Starts as `null`, because no guess has been made yet. |
| Last result | `'too-low' \| 'too-high' \| 'correct' \| null` | Starts as `null`; describes the last valid guess. |
| Maximum guesses | `number` | A fixed value of `7`. |

Use **signals** for changing state. 

Import `signal` from `@angular/core`. For example:

```typescript
readonly phase = signal<GamePhase>('in-progress');
readonly lastGuess = signal<number | null>(null);
```

Here, `readonly` prevents replacing the signal itself; you can still change its value with `.set()` or `.update()`.

**Hint: Generate a random number between 1 and 100 (inclusive)**

```typescript
Math.floor(Math.random() * 100) + 1
```

`Math.random()` produces a number from `0` (inclusive) to `1` (exclusive). Multiplying by `100` and rounding down with `Math.floor()` gives an integer from `0` to `99`. Adding `1` shifts the range to `1` through `100`. Use this expression to initialize the secret number and generate a new one when restarting.

Do not store values you can easily derive, such as guesses remaining. Calculate them from the maximum and the count. As an optional extension, use a `computed` signal for that value.

**Checkpoint:** Your component should now contain the state properties, but no game actions yet. A new game has zero guesses, no last guess or result, and the `in-progress` phase.

## Step 2 - View Model Actions

Add methods to the component class for the actions the player can perform. Each action should update the state based on the **previous state** and its **input parameter**.

### 1. Submit a guess

Create a method such as `guess(value: string)`.

Implement its behavior in this order:

1. If the phase is not `in-progress`, do not accept another guess. This protects the state even if the action is called after the game ends.
2. Validate the input:
   - Reject an empty or whitespace-only value.
   - Convert the string to a number.
   - Accept only whole numbers from 1 through 100.
   - For invalid input, show a useful validation message without changing the guess count, last guess, or last result.
3. For a valid guess, clear any validation message.
4. Increment the guess count **once** and store the last guess.
5. Compare the guess with the secret number and store the result.
6. If the guess is correct, change the phase to `win`.
7. Otherwise, if the updated guess count has reached 7, change the phase to `loss`.
8. Otherwise, leave the phase as `in-progress`.

**Important:** Check for a win before checking for a loss. The seventh guess can still win!

Hints:

- Even an `<input type="number">` exposes its `.value` as a **string**.
- Use `Number(value)` to convert it: `Number('17')` produces `17`.
- Check for blank input before conversion: `Number('')` produces `0`.
- `Number.isInteger(...)` helps reject fractions and non-numeric values.
- Read a signal with `this.phase()`, replace its value with `.set(...)`, and update from its previous value with `.update(...)`.

### 2. Start a new game

Create an action such as `restart()` that:

- Generates a new secret number.
- Sets the phase back to `in-progress`.
- Resets the guess count to `0`.
- Resets the last guess and last result to `null`.
- Clears the validation message.

A newly generated number may happen to equal the previous one. That is still a valid random result.

**Checkpoint:** Check your logic before building the view. What happens for an invalid input, a correct seventh guess, and a call to `guess(...)` after the game has ended?

## Step 3 - The View

Build the template in `app.html`, then style it with `app.css` and `styles.css`.

### 1. Display the game information

Add:

- A heading and a short explanation of the rules.
- The number of guesses used out of 7.
- The number of guesses remaining.

Remember to call signals in the template. For example, `{{ guessCount() }}` reads the current value of a signal named `guessCount`.

### 2. Show the correct UI for each phase

Use **`@if`**, `@else if`, and `@else` to choose the interface based on the phase. Do not use `*ngIf` or hide everything with CSS.

You can start with this outline:

```html
@if (phase() === 'in-progress') {
  <!-- Guess input, guess button, and feedback -->
} @else if (phase() === 'win') {
  <!-- Success message and restart button -->
} @else {
  <!-- Game-over message, secret number, and restart button -->
}
```

**While the game is in progress:**

- Show a labeled number input and a Guess button.
- Set the input's `min` to `1`, `max` to `100`, and `step` to `1`. These help the player, but do not replace validation in the action.
- Connect the button to the guess action.
- Before the first guess, show a message such as "Make your first guess."
- After a valid guess, show the last number and whether it was too low or too high.
- Show a validation message when the input is invalid.

You can pass the input value using a template reference variable without introducing forms bindings:

```html
<label for="guess">Your guess</label>
<input #guessInput id="guess" type="number" min="1" max="100" step="1" />
<button type="button" (click)="guess(guessInput.value)">Guess</button>
```

Use another `@if` to distinguish "no guess yet" from feedback about a previous guess. Check `lastGuess() !== null` explicitly.

**After a win:**

- Congratulate the player and show how many guesses they used.
- Hide the guess controls.
- Show a Restart button as described in the next step.

**After a loss:**

- Explain that all seven guesses have been used.
- Reveal the secret number.
- Hide the guess controls.
- Show a Restart button as described in the next step.

Keep dynamic feedback in an `aria-live="polite"` region so assistive technology can announce updates.

### 3. Add a Restart button

After either a win or a loss, let the player start a new game without refreshing the page.

1. Add a button to each of the two game-over branches in your `@if` structure.
2. Bind its click event to the `restart()` action you created in Step 2:

   ```html
   <button type="button" (click)="restart()">Restart</button>
   ```

3. Confirm that clicking it generates a new secret number, resets the count and feedback, and returns the phase to `in-progress`.
4. Check that the guess controls reappear and the game-over message disappears. Because the input is recreated by `@if`, it should be empty for the new game.

### 4. Style it with modern CSS

Design a small, responsive game card. Use plain CSS rather than a component library.

Requirements:

- Define custom properties for colors, spacing, or border radii and reuse them with `var(...)`.
- Use Grid or Flexbox to lay out the page and controls.
- Give the card a fluid width with a sensible maximum, for example `width: min(100%, 28rem)`.
- Use relative units such as `rem` and a responsive heading size with `clamp(...)`.
- Provide space around the card and ensure the controls fit narrow screens without horizontal scrolling.
- Give buttons and inputs visible `:focus-visible` styles and buttons a hover state.
- Make success, failure, and validation messages visually distinct. Include text, not just color.

Put global rules such as `box-sizing: border-box`, the body font, and page background in `styles.css`. Put game-specific styles in `app.css`.

**Checkpoint:** Play a full game, restart it, and check the layout at both mobile and desktop widths.

## Step 4 - Challenge: Add a History of Guesses

Let the player see every valid guess and the computer's response.

1. Add a signal containing an array of strings, initially empty:

   ```typescript
   readonly history = signal<string[]>([]);
   ```

2. After each valid guess, append one description, such as:
   - `"56 - too high"`
   - `"20 - too low"`
   - `"42 - correct"`
3. Include the final guess, whether it ends in a win or a loss. Do not add invalid input to the history.
4. Do **not** call `.push()` on the signal's array. Replace it with a new array containing the existing entries and the new entry:

   ```typescript
   this.history.set([...this.history(), '56 - too high']);
   ```

   This is an example; build the actual string from the submitted guess and its result.

5. Display the history using `@for`. An ordered list is a good fit:

   ```html
   <ol>
     @for (entry of history(); track $index) {
       <li>{{ entry }}</li>
     } @empty {
       <li>No guesses yet.</li>
     }
   </ol>
   ```

   Tracking by index is suitable here because entries are only appended during a game, and the whole list is cleared on restart.

6. Keep the history visible after the game ends and clear it when starting a new game.

## Final Checklist

For predictable checks, temporarily use a fixed secret number such as `42` during development. Restore random generation before finishing.

- [ ] A new game starts with 0 guesses used, 7 remaining, and no previous result.
- [ ] With secret `42`, guessing `20` reports "too low"; guessing `56` reports "too high".
- [ ] A correct guess wins immediately and counts as one guess.
- [ ] A correct seventh guess wins rather than loses.
- [ ] Seven wrong guesses cause a loss and reveal the secret number.
- [ ] After either ending, the input is absent and further guesses cannot change state.
- [ ] Blank input, fractions, and numbers outside 1-100 show validation feedback and do not use a guess.
- [ ] The next valid guess clears validation feedback.
- [ ] The Restart button works after both a win and a loss, resets all game state, and generates a fresh random number.
- [ ] The interface works on a narrow screen and has visible keyboard focus.
- [ ] If you completed the challenge, history contains one entry per valid guess, includes the final guess, and resets on restart.

Finally, run `ng build` from the project directory to check that the application compiles. If you keep the generated component tests, update starter-screen assertions to match your game before running `ng test`.