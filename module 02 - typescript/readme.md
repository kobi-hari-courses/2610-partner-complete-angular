# Module 02 - Introduction to TypeScript

## Projects

| Project | Project Description |
| --- | --- |
| [hello-ts](./projects/hello-ts/) | Demonstrates TypeScript compilation, source maps, and exported identifiers |

## Summary

This module had two parts. First, we explored the TypeScript language in the TypeScript Playground. Then, we built a local TypeScript development environment on top of the Node.js and npm structure from the previous module.

### Part 1: TypeScript language basics

We used the TypeScript Playground for this part, so these examples are not stored in the repository.

#### Primitive types

We started by adding explicit types to variables. TypeScript checked these types during development and compilation:

```ts
let s: string = 'Hello';
let n: number = 42;
let b: boolean = true;
```

> **Important:** TypeScript performed static type checking, but the generated program was still JavaScript.

#### Function types and higher-order functions

We compared the broad `Function` type with a precise function signature:

```ts
let flexible: Function;
let strict: (i: number, j: boolean) => void;
```

The strict signature described the parameter and return types, allowing TypeScript to check how the function was assigned and called.

We also created **higher-order functions**: functions that received or returned other functions.

```ts
function applyTwice(calculator: (i: number) => number): number {
    let i = 10;
    i = calculator(i);
    i = calculator(i);
    return i;
}

function buildMultiplier(x: number): (i: number) => number {
    return i => i * x;
}

const multiplyByTen = buildMultiplier(10);
console.log(multiplyByTen(5));
```

#### Object, record, array, and tuple types

We described the exact structure expected from an object:

```ts
let point: { x: number, y: boolean };
point = { x: 10, y: true };
```

We used `Record` when all properties followed the same key-and-value pattern:

```ts
let scores: Record<string, number>;
scores = { kobi: 50, liel: 30 };
```

We also compared arrays, which can contain any number of values of one type, with tuples, which describe a fixed sequence:

```ts
let numbers: number[] = [1, 2, 3];
let point2D: [number, number] = [3, 4];
let mixed: [number, string, boolean] = [15, 'hello', true];
```

#### Interfaces, abstract classes, and inheritance

We defined an interface as a contract and implemented it with an abstract class. We then extended that class with a concrete class:

```ts
interface Human {
    ssn: string;
}

abstract class Person implements Human {
    ssn = '123456';

    constructor(
        public readonly firstName: string,
        public readonly lastName: string
    ) {}

    abstract writeDescription(): void;
}

class Student extends Person {
    constructor(private academy: string) {
        super('John', 'Smith');
    }

    writeDescription(): void {
        console.log('I study at', this.academy);
    }
}
```

This example introduced interfaces, abstract members, inheritance, constructors, and the `public`, `private`, and `readonly` modifiers.

We also compared compile-time types with runtime JavaScript checks:

```ts
const student = new Student('Technion');

console.log(typeof student);
console.log(student instanceof Person);
console.log(student instanceof Student);
```

> **Important:** Classes existed at runtime, so `instanceof` could check them. Interfaces described types only and were removed when TypeScript compiled the code.

#### Generics

We used generics to write reusable code while preserving type safety:

```ts
function addToArray<T>(items: T[], newItem: T): T[] {
    return [...items, newItem];
}

addToArray<number>([1, 2, 3], 4);
addToArray<string>(['a', 'b'], 'c');
addToArray([true, false], true);
```

The type parameter `T` connected the array's item type to the new item's type. In the final call, TypeScript inferred `T` as `boolean`, so we did not need to specify it explicitly.

### Part 2: A TypeScript development environment

#### Building on a Node.js project

We first created a regular Node.js/npm project and then added TypeScript as a **development dependency**:

```sh
npm install --save-dev typescript
```

The shorter equivalent we used was:

```sh
npm i -D typescript
```

TypeScript belonged in `devDependencies` because we needed the compiler while developing the project, but the generated JavaScript could run without the compiler. Both project manifests demonstrate this:

- [fun-with-ts package.json](./projects/fun-with-ts/package.json)
- [shopping-cart package.json](./projects/shopping-cart/package.json)

#### From manual compilation to `tsconfig.json`

We manually compiled a single TypeScript file and saw that repeating this command for every change would not scale:

```sh
tsc main
```

We then asked the TypeScript compiler to generate a project configuration:

```sh
tsc --init
```

The resulting `tsconfig.json` let us configure and compile the entire project consistently. We placed editable TypeScript files in `src` and generated JavaScript files in `bin` or `dist`.

The [fun-with-ts tsconfig.json](./projects/fun-with-ts/tsconfig.json) contains the three settings we emphasized:

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./bin",
    "sourceMap": true
  }
}
```

- **`rootDir`** identified the root folder containing our TypeScript source files.
- **`outDir`** kept generated JavaScript separate from the source code.
- **`sourceMap`** generated a `.js.map` file next to each compiled JavaScript file.

The shopping cart used the same structure with `dist` as its [output directory](./projects/shopping-cart/tsconfig.json).

#### Why source maps were crucial

Node.js executed the generated JavaScript, not the original TypeScript. A source map connected positions in that generated JavaScript back to the corresponding lines in the TypeScript source.

For example, compiling [src/main.ts](./projects/fun-with-ts/src/main.ts) produced both [bin/main.js](./projects/fun-with-ts/bin/main.js) and [bin/main.js.map](./projects/fun-with-ts/bin/main.js.map).

> **Important:** Source maps allowed VS Code to place breakpoints, pause, inspect variables, and step through the original `.ts` files even though Node.js was executing `.js` files.

#### Automatically rebuilding in watch mode

We added a build script that started `tsc` in watch mode:

```json
{
  "scripts": {
    "build": "tsc --watch"
  }
}
```

We started it with:

```sh
npm run build
```

**Watch mode** kept the compiler running. It watched the TypeScript source files and automatically rebuilt the affected JavaScript whenever we saved a change. This removed the need to run the compiler manually after every edit.

#### Debugging TypeScript through compiled JavaScript

We used VS Code to generate `launch.json`. The debugger launched the compiled entry point:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Launch Program",
  "program": "${workspaceFolder}/bin/main.js"
}
```

The [fun-with-ts launch configuration](./projects/fun-with-ts/.vscode/launch.json) runs `bin/main.js`, while the [shopping-cart launch configuration](./projects/shopping-cart/.vscode/launch.json) runs `dist/main.js`.

Together, the compiled JavaScript and source maps let us debug the running program while observing, placing breakpoints in, and interacting with our TypeScript source files.

#### Multi-file projects with exports and imports

We split larger projects into focused files. A file exported the identifiers it wanted to make available, and another file imported the identifiers it needed.

The shopping cart exported a `Product` interface from [product.ts](./projects/shopping-cart/src/product.ts):

```ts
export interface Product {
    name: string;
    price: number;
    quantity: number;
}
```

The [shopping cart service](./projects/shopping-cart/src/main.ts) imported that interface:

```ts
import type { Product } from './product';

export class ShoppingCartService {
    getTotal(products: Product[]): number {
        let total = 0;

        for (const product of products) {
            total += product.price * product.quantity;
        }

        return total;
    }
}
```

We used `import type` because `Product` was needed only for type checking. The interface did not become a runtime JavaScript value.

The [Calculator class](./projects/fun-with-ts/src/calculator.ts) and the functions in [fun-with-ts main.ts](./projects/fun-with-ts/src/main.ts) provide additional examples of exported identifiers.

### Quick check

1. What happened to TypeScript type annotations after compilation?
2. How did a tuple differ from a regular array?
3. Why could `instanceof` check a class but not an interface?
4. What problem did a generic type parameter solve?
5. Why was TypeScript installed as a development dependency?
6. What did `rootDir` and `outDir` control?
7. Why were source maps necessary for debugging TypeScript?
8. What happened while `tsc --watch` was running?
9. Why did the shopping cart use `import type` for `Product`?