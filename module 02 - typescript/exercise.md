# Module 02 - TypeScript Exercise
In this exercise, you will practice the basics of TypeScript.

- You will learn how to set up a node.js project with npm.
- You will incorporate the typescript compiler into your project and set up tsconfig.json
- You will configure TypeScript to compile your code correctly and create a script that continuously watches for changes in your TypeScript files.
- You will create a debug configuration to run and test your TypeScript code inside Visual Studio Code.


## Instructions
### Step 1 - Set Up Your Project
- Set up a new Node.js project using npm.
- Install TypeScript as a development dependency.
- Create a `tsconfig.json` file and configure it for your project.
- Write a simple TypeScript program to test your setup.
- Configure a script in `package.json` to watch for changes in your TypeScript files and compile them automatically.
- Set up a debug configuration in Visual Studio Code to run and test your TypeScript code.

### Step 2 - The typescript program
Create a typescript program that defines 3 types: 
- Rectangle
- Circle
- Triangle

Each type should have appropriate properties to represent its dimensions. For example:
- Rectangle should have `width` and `height`.
- Circle should have `radius`.
- Triangle should have `base` and `height`.

> Make sure to use Interfaces, also make sure to define a discriminated union to differentiate between the different shapes.

- Finally, create a Shape type that is a discriminated union of Rectangle, Circle, and Triangle.
- Create a "calculateArea" function that takes a Shape as an argument and returns its area.
- In main.ts create instances of each shape and use the "calculateArea" function to compute their areas.