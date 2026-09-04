# ES6 Data Manipulation

## Objective

The objective of this project is to learn how to manipulate data with modern
JavaScript (ES6). The examples in this guide use arrays of student objects,
but the same techniques apply to API responses, database records, and other
collections of data.

By the end of this project, you should be able to:

- transform an array with `map()`;
- select values from an array with `filter()`;
- combine array values with `reduce()`;
- choose an appropriate typed array for numeric data;
- store unique values with `Set`;
- associate keys and values with `Map`;
- use weak collections with `WeakMap` and `WeakSet` when object keys should
 not prevent garbage collection.

## Requirements

- Node.js 12 or later
- npm
- Basic knowledge of variables, functions, arrays, and objects

The project uses Babel, so ES6 module syntax such as `export default` can be
used in the exercise files.

## Array Methods

Start with a collection of objects:

```js
const students = [
 { id: 1, name: 'Alice', score: 85, active: true },
 { id: 2, name: 'Bob', score: 62, active: false },
 { id: 3, name: 'Carla', score: 94, active: true },
];
```

### `map()`

`map()` creates a new array by applying a function to every item in the
original array. It does not modify the original array, and the new array has
the same number of items.

```js
const names = students.map((student) => student.name);

console.log(names);
// [ 'Alice', 'Bob', 'Carla' ]
console.log(students.length === names.length);
// true
```

Use `map()` when the question is: "What should each item become?"

The callback receives the current value, its index, and the complete array.
Usually only the value is needed:

```js
const labels = students.map((student, index) => {
 // The index is zero-based, so add 1 for a human-readable position.
 return `${index + 1}. ${student.name}`;
});

console.log(labels);
// [ '1. Alice', '2. Bob', '3. Carla' ]
```

### `filter()`

`filter()` creates a new array containing only the items for which the
callback returns `true`. It can return fewer items than the original array,
including an empty array.

```js
const passingStudents = students.filter((student) => student.score >= 70);

console.log(passingStudents.map((student) => student.name));
// [ 'Alice', 'Carla' ]
```

Use `filter()` when the question is: "Which items meet this condition?"

Conditions can be combined with normal boolean operators:

```js
const activeHighScorers = students.filter((student) => (
 student.active && student.score >= 90
));

console.log(activeHighScorers);
// [ { id: 3, name: 'Carla', score: 94, active: true } ]
```

### `reduce()`

`reduce()` visits every item and builds one final value called the accumulator.
That value can be a number, string, object, array, or another data structure.
Always provide an initial value so empty arrays behave predictably.

```js
const totalScore = students.reduce((total, student) => {
 // Add the current student's score to the accumulator.
 return total + student.score;
}, 0); // The accumulator starts at zero.

console.log(totalScore);
// 241
```

Use `reduce()` when the question is: "How can all items produce one result?"

For example, an object can be built as an index by student ID:

```js
const studentsById = students.reduce((result, student) => {
 // Use the ID as a property name and store the complete student object.
 result[student.id] = student;
 return result;
}, {});

console.log(studentsById[2].name);
// Bob
```

Methods can be chained when each operation has a clear purpose. The code
below first keeps active students, then extracts their names:

```js
const activeNames = students
 .filter((student) => student.active)
 .map((student) => student.name);

console.log(activeNames);
// [ 'Alice', 'Carla' ]
```

### Choosing the right method

| Method | Result | Typical question |
| --- | --- | --- |
| `map()` | New array with one result per item | What should each item become? |
| `filter()` | New array with matching items | Which items should remain? |
| `reduce()` | One accumulated result | What value can all items produce? |

## Typed Arrays

A typed array stores numeric values in a fixed-size binary format. Unlike a
normal JavaScript array, it has a fixed length and restricts each value to its
declared type. Typed arrays are useful for binary files, audio, images,
network protocols, and performance-sensitive numeric data.

Common typed arrays include:

- `Int8Array`, `Int16Array`, and `Int32Array` for signed integers;
- `Uint8Array`, `Uint16Array`, and `Uint32Array` for unsigned integers;
- `Float32Array` and `Float64Array` for decimal numbers.

```js
// Each element is stored as an unsigned 8-bit integer from 0 to 255.
const redPixel = new Uint8Array([255, 128, 0]);

console.log(redPixel[0]);
// 255

// Values are converted to the allowed range instead of remaining arbitrary
// JavaScript numbers.
redPixel[1] = 300;
console.log(redPixel[1]);
// 44 (300 modulo 256)
```

Typed arrays have familiar indexing and iteration methods, including
`map()`, `filter()`, and `reduce()`:

```js
const measurements = new Float32Array([1.5, 2.5, 3.5]);

const doubled = measurements.map((value) => value * 2);
const total = measurements.reduce((sum, value) => sum + value, 0);

console.log(doubled);
// Float32Array(3) [ 3, 5, 7 ]
console.log(total);
// 7.5
```

An `ArrayBuffer` is the raw memory, while a typed array is a view over that
memory:

```js
const buffer = new ArrayBuffer(4);
const bytes = new Uint8Array(buffer);

// Four bytes can represent four unsigned 8-bit values.
bytes.set([10, 20, 30, 40]);

console.log(bytes.byteLength);
// 4
console.log([...bytes]);
// [ 10, 20, 30, 40 ]
```

Typed arrays are not a replacement for normal arrays: they cannot grow with
`push()`, and they are designed for uniform numeric values rather than mixed
objects.

## `Set`

A `Set` stores unique values. Adding the same value more than once has no
effect. It is useful for removing duplicates and testing membership.

```js
const tags = new Set(['javascript', 'es6', 'javascript']);

console.log(tags.size);
// 2
console.log(tags.has('es6'));
// true

tags.add('arrays');
tags.delete('es6');

console.log([...tags]);
// [ 'javascript', 'arrays' ]
```

Convert an array to a `Set` and back to an array to remove duplicate values:

```js
const numbers = [1, 2, 2, 3, 3, 3];
const uniqueNumbers = [...new Set(numbers)];

console.log(uniqueNumbers);
// [ 1, 2, 3 ]
```

Sets preserve insertion order and can be iterated with `for...of`:

```js
const languages = new Set(['JavaScript', 'Python', 'Ruby']);

for (const language of languages) {
 // Each value appears once, in insertion order.
 console.log(language);
}
```

## `Map`

A `Map` stores key-value pairs. Unlike object property keys, `Map` keys can
be strings, numbers, objects, functions, or other values. It also provides a
clear `size` property and predictable insertion order.

```js
const scores = new Map();

scores.set('Alice', 85);
scores.set('Carla', 94);

console.log(scores.get('Carla'));
// 94
console.log(scores.has('Bob'));
// false
console.log(scores.size);
// 2
```

An object can be a key without being converted to a string:

```js
const alice = { id: 1, name: 'Alice' };
const grades = new Map();

// The exact object reference is used as the key.
grades.set(alice, 'A');

console.log(grades.get(alice));
// A
```

Maps can be initialized from an array of key-value pairs and iterated with
`entries()`, `keys()`, or `values()`:

```js
const capitals = new Map([
 ['France', 'Paris'],
 ['Japan', 'Tokyo'],
]);

for (const [country, capital] of capitals) {
 // Destructuring reads the key and value from each map entry.
 console.log(`${capital} is the capital of ${country}`);
}
```

Use a `Map` when the data is naturally a dictionary of keys and values. Use a
plain object when you specifically need a simple JSON-shaped record.

## Weak Collections: `WeakMap` and `WeakSet`

The weak collection structures are `WeakMap` and `WeakSet`. The term
"weak" means that object keys or values are held weakly: if the rest of the
program no longer references an object, the collection does not keep that
object alive for garbage collection.

Weak collections have important limitations:

- `WeakMap` keys must be objects or non-registered symbols;
- `WeakSet` values must be objects or non-registered symbols;
- they are not iterable, so they do not expose `size`, `keys()`, or
 `values()`;
- they are useful for metadata that should live only as long as an object.

### `WeakMap`

Use a `WeakMap` to attach private or temporary metadata to an object without
adding a visible property to that object.

```js
const cache = new WeakMap();
const user = { name: 'Alice' };

// Store metadata using the object itself as the key.
cache.set(user, { lastLoaded: Date.now() });

console.log(cache.get(user).lastLoaded);
// A timestamp

// When the program drops its reference to user, cache does not prevent the
// user object and its metadata from being garbage-collected.
```

This is different from a normal `Map`, which keeps a strong reference to its
object keys:

```js
const strongCache = new Map();
const weakCache = new WeakMap();
const record = {};

strongCache.set(record, 'strong reference');
weakCache.set(record, 'weak reference');

console.log(strongCache.has(record));
// true
console.log(weakCache.has(record));
// true
```

### `WeakSet`

Use a `WeakSet` when you need to mark or test whether an object has been seen,
without maintaining a separate list that keeps those objects alive.

```js
const processedObjects = new WeakSet();
const request = { id: 42 };

processedObjects.add(request);

console.log(processedObjects.has(request));
// true

processedObjects.delete(request);
console.log(processedObjects.has(request));
// false
```

Do not use a weak collection when you need to count, list, or iterate its
contents. Choose `Set` or `Map` for those operations.

## Practice Checklist

1. Use `map()` to create an array containing only student names.
2. Use `filter()` to keep students with a score of at least 70.
3. Use `reduce()` to calculate the average score.
4. Store RGB color values in a `Uint8Array`.
5. Remove duplicate course names with a `Set`.
6. Build a `Map` from student IDs to student names.
7. Use a `WeakMap` for temporary metadata associated with an object.
8. Use a `WeakSet` to track objects that have already been processed.

## Useful Commands

Install the project dependencies:

```bash
npm install
```

Run the linter on the exercise files:

```bash
npm run check-lint
```

Run the test suite:

```bash
npm test
```
