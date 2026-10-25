var clrs = require('@colors/colors');
var mathjs = require('mathjs');

function greeting() {
    console.log('Hello World'.red);
    var res = mathjs.square(5);
    console.log('The square of 5 is ', res);
}

console.log('Getting Started'.green);
greeting();

