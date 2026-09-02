# ES6 Classes in JavaScript

ES6 classes provide a clear syntax for creating objects with shared data and
behavior. A class is a blueprint; each object created from it is an instance.

## 1. How to Define a Class

Use the `class` keyword. A constructor runs when a new instance is created and
is commonly used to initialize properties.

```js
class Person {
 constructor(name, age) {
  // These values belong to each individual Person object.
  this.name = name;
  this.age = age;
 }
}

const alice = new Person('Alice', 30);
console.log(alice.name); // Alice
console.log(alice.age); // 30
```

`new Person(...)` creates an object and calls the class constructor. The
`this` keyword refers to that newly created object.

## 2. How to Add Methods to a Class

Methods are functions defined inside the class body. They are shared through
the class prototype instead of being recreated for every object.

```js
class Person {
 constructor(name, age) {
  this.name = name;
  this.age = age;
 }

 introduce() {
  // A regular method can use the instance's properties through `this`.
  return `Hi, I am ${this.name}.`;
 }

 isAdult() {
  return this.age >= 18;
 }
}

const alice = new Person('Alice', 30);
console.log(alice.introduce()); // Hi, I am Alice.
console.log(alice.isAdult()); // true
```

A method can also change an instance's state:

```js
class Counter {
 constructor() {
  this.value = 0;
 }

 increment() {
  this.value += 1;
  return this.value;
 }
}

const counter = new Counter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
```

## 3. Static Methods: Why and How

A static method belongs to the class itself, not to its instances. Use one for
an operation related to the class that does not need instance-specific data.
Call it with the class name, not with an object.

```js
class Temperature {
 constructor(celsius) {
  this.celsius = celsius;
 }

 // This utility creates a Temperature from Fahrenheit without
 // requiring an existing Temperature instance.
 static fromFahrenheit(fahrenheit) {
  return new Temperature((fahrenheit - 32) * 5 / 9);
 }

 toFahrenheit() {
  return this.celsius * 9 / 5 + 32;
 }
}

const roomTemperature = Temperature.fromFahrenheit(68);
console.log(roomTemperature.celsius); // 20
console.log(roomTemperature.toFahrenheit()); // 68

// This would fail because static methods are not available on instances:
// roomTemperature.fromFahrenheit(68);
```

Static methods are useful for factory methods, validation helpers, and other
utilities that conceptually belong to a class rather than one object.

## 4. How to Extend a Class from Another

Use `extends` to create a child class that inherits the parent class's
properties and methods. Use `super(...)` to call the parent constructor and
`super.method()` to call a parent method.

```js
class Person {
 constructor(name) {
  this.name = name;
 }

 introduce() {
  return `Hi, I am ${this.name}.`;
 }
}

class Student extends Person {
 constructor(name, subject) {
  // The parent constructor must run before using `this` in a child.
  super(name);
  this.subject = subject;
 }

 introduce() {
  // Reuse the parent behavior and add student-specific information.
  return `${super.introduce()} I study ${this.subject}.`;
 }
}

const student = new Student('Sam', 'JavaScript');
console.log(student.introduce());
// Hi, I am Sam. I study JavaScript.
```

Inheritance should model a genuine “is a” relationship. Prefer small,
focused classes and composition when an object merely uses another object.

## 5. Metaprogramming and Symbols

### Metaprogramming

Metaprogramming means writing code that examines or changes how other code
works. JavaScript provides tools such as `Proxy` and `Reflect` for this.

```js
const user = { name: 'Taylor' };

const protectedUser = new Proxy(user, {
 set(target, property, value) {
  // Intercept assignments and reject an empty name.
  if (property === 'name' && value === '') {
   throw new Error('Name cannot be empty');
  }

  // Reflect performs the normal property assignment.
  return Reflect.set(target, property, value);
 },
});

protectedUser.name = 'Jordan';
console.log(protectedUser.name); // Jordan

// protectedUser.name = ''; // Error: Name cannot be empty
```

`Proxy` intercepts operations such as reading, writing, or checking a
property. `Reflect` provides the default behavior for those operations.

### Symbols

A `Symbol` is a unique primitive value. Symbols are useful for object keys
that should not accidentally conflict with ordinary string keys.

```js
const id = Symbol('id');
const anotherId = Symbol('id');

console.log(id === anotherId); // false: every Symbol is unique

const account = {
 name: 'Morgan',
 [id]: 12345, // Computed property syntax uses the Symbol as the key.
};

console.log(account[id]); // 12345
console.log(Object.keys(account)); // ['name']
```

Symbol-keyed properties do not appear in `Object.keys()`, which makes them
useful for internal metadata. They are still accessible when the Symbol is
available, and `Object.getOwnPropertySymbols(account)` can list them.

JavaScript also defines well-known Symbols that customize built-in behavior:

```js
class Playlist {
 constructor(songs) {
  this.songs = songs;
 }

 [Symbol.iterator]() {
  // This lets a Playlist work with `for...of`.
  return this.songs[Symbol.iterator]();
 }
}

const playlist = new Playlist(['Intro', 'Finale']);
for (const song of playlist) {
 console.log(song); // Intro, then Finale
}
```

Here, `Symbol.iterator` is a metaprogramming hook: it tells JavaScript how to
iterate over a `Playlist` instance.

## Quick Reference

| Goal | Syntax |
| --- | --- |
| Define a class | `class Name {}` |
| Initialize an instance | `constructor(value) { this.value = value; }` |
| Add an instance method | `method() {}` |
| Add a class method | `static method() {}` |
| Inherit from a class | `class Child extends Parent {}` |
| Call the parent constructor | `super(arguments)` |
| Create a unique key | `const key = Symbol('description')` |
| Intercept object behavior | `new Proxy(object, handler)` |
