# JavaScript Promises

## Objective

Learn how JavaScript Promises work and how to use them to handle operations
that finish in the future, such as network requests, file operations, or
timers.

By the end of this guide, you should understand:

- What a Promise is, why it is useful, and how to create one.
- How to use `then`, `resolve`, and `catch`.
- Every standard method on the `Promise` object.
- How to use `throw` and `try...catch` for errors.
- How to use the `await` operator.
- How to write and use an `async` function.

The examples use modern JavaScript and can be run with Node.js.

## 1. What Is a Promise?

A Promise is an object that represents the eventual result of an asynchronous
operation. It has three possible states:

- **Pending:** the operation has not finished.
- **Fulfilled:** the operation completed successfully.
- **Rejected:** the operation failed.

Promises are useful because they let us describe success and failure without
nested callbacks. A Promise settles only once: it is either fulfilled or
rejected.

```js
// Create a Promise with a function called the executor.
const delayedGreeting = new Promise((resolve, reject) => {
 setTimeout(() => {
  // Calling resolve fulfills the Promise with this value.
  resolve('Hello after one second!');
 }, 1000);
});

console.log(delayedGreeting); // Pending at first
```

## 2. `then`, `catch`, and `finally`

### `then`

Use `then` to run code after a Promise is fulfilled. It returns a new Promise,
which makes it possible to chain asynchronous operations.

```js
Promise.resolve(2)
 .then((number) => {
  // The returned value becomes the input for the next `then`.
  return number * 3;
 })
 .then((result) => {
  console.log(result); // 6
 });
```

### `catch`

Use `catch` to handle a rejected Promise or an error thrown in a preceding
`then` callback.

```js
Promise.reject(new Error('Something went wrong'))
 .catch((error) => {
  // The error is handled here instead of becoming an uncaught error.
  console.error(error.message); // Something went wrong
 });
```

### `finally`

Use `finally` for cleanup that should happen whether the Promise succeeds or
fails. It does not receive the result or error.

```js
Promise.resolve('Done')
 .then((message) => {
  console.log(message);
 })
 .finally(() => {
  // This runs after fulfillment or rejection.
  console.log('Cleanup complete');
 });
```

## 3. `resolve` and `reject`

### `Promise.resolve`

`Promise.resolve(value)` creates a fulfilled Promise. If `value` is already a
Promise, it returns a Promise that follows that Promise.

```js
const fulfilled = Promise.resolve('Successful result');

fulfilled.then((value) => {
 console.log(value); // Successful result
});
```

### `Promise.reject`

`Promise.reject(reason)` creates a rejected Promise.

```js
const failed = Promise.reject(new Error('Request failed'));

failed.catch((error) => {
 console.error(error.message); // Request failed
});
```

## 4. All Standard Promise Methods

The Promise API has static methods for coordinating multiple Promises and
instance methods for handling an individual Promise.

### `Promise.all`

Waits for every Promise to fulfill. It fulfills with an array of results in
the same order as the input. It rejects immediately when any Promise rejects.

```js
Promise.all([
 Promise.resolve('first'),
 Promise.resolve('second'),
])
 .then((results) => {
  console.log(results); // ['first', 'second']
 })
 .catch((error) => {
  // One rejection rejects the whole operation.
  console.error(error);
 });
```

### `Promise.allSettled`

Waits for every Promise to finish, even when some reject. Each result has a
`status` and either a `value` or a `reason`.

```js
Promise.allSettled([
 Promise.resolve('available'),
 Promise.reject(new Error('unavailable')),
]).then((results) => {
 console.log(results);
 // Each item is { status: 'fulfilled', value: ... }
 // or { status: 'rejected', reason: ... }.
});
```

### `Promise.any`

Fulfills as soon as the first Promise fulfills. It rejects with an
`AggregateError` only when every Promise rejects.

```js
Promise.any([
 Promise.reject(new Error('Server 1 failed')),
 Promise.resolve('Server 2 responded'),
]).then((result) => {
 // The first successful result is returned.
 console.log(result); // Server 2 responded
});
```

### `Promise.race`

Settles as soon as the first Promise settles, whether that result is a
fulfillment or a rejection.

```js
Promise.race([
 new Promise((resolve) => setTimeout(() => resolve('Fast'), 100)),
 new Promise((resolve) => setTimeout(() => resolve('Slow'), 500)),
]).then((winner) => {
 console.log(winner); // Fast
});
```

### Instance methods: `then`, `catch`, and `finally`

These methods are available on every Promise instance:

```js
Promise.resolve('value')
 .then((value) => value.toUpperCase()) // Handle fulfillment and transform it
 .catch((error) => console.error(error)) // Handle rejection
 .finally(() => console.log('Finished')); // Always perform cleanup
```

## 5. `throw` and `try...catch`

Use `throw` to create an error when a condition is invalid. Use `try...catch`
to run risky code and handle the error without stopping the rest of the
program.

```js
function validateAge(age) {
 try {
  if (age < 18) {
   // Throw immediately when the input does not meet the requirement.
   throw new Error('The user must be at least 18 years old');
  }

  return 'Access granted';
 } catch (error) {
  // Catch receives the Error object created by `throw`.
  return `Access denied: ${error.message}`;
 } finally {
  // Cleanup or logging can happen regardless of the result.
  console.log('Age validation finished');
 }
}

console.log(validateAge(16)); // Access denied: The user must be at least 18 years old
```

Errors thrown in Promise callbacks automatically reject the new Promise:

```js
Promise.resolve('not a number')
 .then((value) => {
  // This throw is handled by the following catch.
  if (typeof value !== 'number') {
   throw new TypeError('Expected a number');
  }
 })
 .catch((error) => {
  console.error(error.message); // Expected a number
 });
```

## 6. The `async` Function

An `async` function always returns a Promise. A returned value fulfills that
Promise, while a thrown error rejects it.

```js
async function getMessage() {
 // Returning a string is equivalent to returning Promise.resolve(string).
 return 'Message loaded';
}

getMessage().then((message) => {
 console.log(message); // Message loaded
});
```

## 7. The `await` Operator

Use `await` inside an `async` function to pause that function until a Promise
settles. It produces the fulfilled value, or throws the rejection reason.

```js
function loadUser() {
 return Promise.resolve({ id: 1, name: 'Ada' });
}

async function displayUser() {
 try {
  // `await` unwraps the fulfilled value from the Promise.
  const user = await loadUser();
  console.log(user.name); // Ada
 } catch (error) {
  // A rejected Promise behaves like a thrown error here.
  console.error('Could not load user:', error.message);
 }
}

displayUser();
```

Independent Promises can be awaited together with `Promise.all`:

```js
async function loadDashboard() {
 try {
  // Start both operations before awaiting so they can run concurrently.
  const [user, notifications] = await Promise.all([
   Promise.resolve('Ada'),
   Promise.resolve(3),
  ]);

  console.log(`${user} has ${notifications} notifications`);
 } catch (error) {
  // Handle a rejection from either operation.
  console.error('Dashboard failed:', error.message);
 }
}

loadDashboard(); // Ada has 3 notifications
```

## Quick Reference

| Method or keyword | Purpose |
| --- | --- |
| `new Promise()` | Create a Promise manually |
| `then()` | Handle fulfillment and transform a result |
| `catch()` | Handle rejection or thrown errors |
| `finally()` | Run cleanup after settlement |
| `Promise.resolve()` | Create or adopt a fulfilled Promise |
| `Promise.reject()` | Create a rejected Promise |
| `Promise.all()` | Require every Promise to fulfill |
| `Promise.allSettled()` | Wait for every Promise, regardless of status |
| `Promise.any()` | Use the first fulfilled Promise |
| `Promise.race()` | Use the first settled Promise |
| `throw` | Signal an error |
| `try...catch` | Handle synchronous or awaited errors |
| `async` | Define a function that returns a Promise |
| `await` | Read a Promise result inside an `async` function |
