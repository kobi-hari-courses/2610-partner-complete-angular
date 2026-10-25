# Module 01 - Introduction to NodeJS and NPM

## Projects

| Project | Project Description |
| --- | --- |
| [fun-with-node-js](./projects/fun-with-node-js/) | Demonstrates Node.js, npm scripts, and package dependencies |

## Summary

### JavaScript in the browser and on the server

We discussed why JavaScript had two common runtime environments: browsers ran it on the client to power web pages, while Node.js let us run JavaScript on the server and directly on our computers.

### Running JavaScript with Node.js

We installed Node.js and ran a JavaScript file from the terminal:

```sh
node main.js
```

### Creating an npm project

We started with a project folder, initialized it as an npm project, and defined scripts in `package.json`:

```sh
npm init
```

The [fun-with-node-js package.json](./projects/fun-with-node-js/package.json) defines a `start` script, which we ran with `npm start`. Scripts give us short, repeatable commands for common project tasks.

```json
{
  "scripts": {
    "start": "cls && node main.js && echo \"Main.js has finished executing\""
  }
}
```

### `package.json`, the lockfile, and dependencies

We reviewed the roles of the npm files:

- **`package.json`** describes the project, its scripts, and its direct dependencies.
- **`package-lock.json`** records the resolved package versions and dependency tree so installs can be reproduced consistently.
- **`dependencies`** are packages the application uses at runtime.
- **`devDependencies`** are packages used for development tasks, such as testing or building. This project currently has no `devDependencies`.

We explored the npm registry using `@colors/colors` and `mathjs`. The colors package worked as a standalone dependency, while `mathjs` brought in external dependencies. We saw npm install that dependency tree in `node_modules`; the [project lockfile](./projects/fun-with-node-js/package-lock.json) records the resolved packages.

The project code demonstrates both packages:

```js
var clrs = require('@colors/colors');
var mathjs = require('mathjs');

console.log('Getting Started'.green);
console.log('The square of 5 is ', mathjs.square(5));
```

See the complete [main.js example](./projects/fun-with-node-js/main.js).

### Loading modules with `require()`

We learned that `require()` loads code from another module. Finding and loading the requested module is part of a process called **module resolution**. JavaScript supports several module approaches; in this project, we used the Node.js **CommonJS** approach.

```js
var clrs = require('@colors/colors');
var mathjs = require('mathjs');
```

When Node.js evaluated each `require()` call, it resolved the package name by looking in `node_modules`, loaded the package's entry point, and returned its exported value. A CommonJS package commonly exposes its exportable functions and values together as one object. We stored those returned objects in the `clrs` and `mathjs` variables so we could access their features:

```js
var result = mathjs.square(5);
console.log(result);
```

The colors package also performed an important side effect when it was loaded: it extended the `String` prototype with color properties. That let us apply colors directly to strings when printing text:

```js
console.log('Getting Started'.green);
console.log('Hello World'.red);
```

> **Important:** `require()` did more than copy code into our file. It resolved a module, executed it once, and returned its CommonJS exports. A module could also change runtime behavior while being loaded, as the colors package did by extending strings.

### Debugging with VS Code

We used VS Code to create a `launch.json` configuration for starting `main.js` in the Node.js debugger; we did not write this file manually. Because the project is shared through GitHub, the generated [launch.json](./projects/fun-with-node-js/.vscode/launch.json) is included with the project and can be reused by other developers who clone the repository.

The configuration sets the program that VS Code runs when debugging:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Start main.js",
  "program": "${workspaceFolder}/main.js"
}
```

Now we can use the VSCode debugger to run and inspect `main.js`. We can set breakpoints, step through the code, and examine variables to better understand the program's behavior.

### Quick check

1. What is the difference between a runtime dependency and a development dependency?
2. What does `npm start` run in this project?
3. Why does `package-lock.json` include more packages than the two direct dependencies in `package.json`?
4. How is running JavaScript in a browser different from running it with Node.js?
5. Which command initializes a new npm project, and which file does it create?
6. What does `require()` do, and which module approach did we use?
7. Why can other developers reuse this project's VS Code debugging configuration?