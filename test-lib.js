const {c} = require('./lib/index');

const c1 = c([1, 2, 3, 4]);

c1.map((n) => n * 2);

console.log('mapped:', c1.value);

const c2 = c(new Map([['a', 100], ['b', 200], ['c', 400]]));
