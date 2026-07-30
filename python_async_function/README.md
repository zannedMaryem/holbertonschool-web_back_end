# Python Async Basics

This README is designed to help you learn the fundamentals of asynchronous programming in Python using `asyncio`.

## Learning objectives

- Understand `async` and `await` syntax
- Learn how to execute an async program with `asyncio`
- Run multiple coroutines concurrently
- Create `asyncio` tasks
- Use the `random` module inside async code

---

## 1. `async` and `await` syntax

A coroutine is a function declared with `async def`. Inside it, you use `await` to pause execution until another coroutine finishes.

```python
import asyncio

async def greet(name):
    print(f"Hello, {name}!")
    await asyncio.sleep(1)  # Pause here without blocking the whole program
    print(f"Finished greeting {name}.")

async def main():
    await greet("Alice")  # Wait for the coroutine to complete

if __name__ == "__main__":
    asyncio.run(main())
```

### What this shows

- `async def` creates a coroutine.
- `await` pauses the coroutine until the awaited operation is done.
- `asyncio.run()` starts the event loop for the program.

---

## 2. How to execute an async program with `asyncio`

To run an async program, you need to call `asyncio.run()` with the main coroutine.

```python
import asyncio

async def main():
    print("Starting async program")
    await asyncio.sleep(2)
    print("Async program finished")

if __name__ == "__main__":
    asyncio.run(main())
```

### What this shows

- `asyncio.run(main())` is the standard way to start an async program.
- It creates an event loop and runs the coroutine until it completes.

---

## 3. How to run concurrent coroutines

You can run multiple coroutines at the same time with `asyncio.gather()`.

```python
import asyncio

async def task(name, delay):
    print(f"{name} started")
    await asyncio.sleep(delay)
    print(f"{name} completed")

async def main():
    await asyncio.gather(
        task("Task 1", 2),
        task("Task 2", 1),
    )

if __name__ == "__main__":
    asyncio.run(main())
```

### What this shows

- `gather()` lets coroutines run concurrently.
- The program waits for both coroutines to finish before continuing.

---

## 4. How to create `asyncio` tasks

Tasks are a way to schedule coroutines to run concurrently in the event loop.

```python
import asyncio

async def task(name, delay):
    print(f"{name} started")
    await asyncio.sleep(delay)
    print(f"{name} completed")

async def main():
    first_task = asyncio.create_task(task("First", 2))
    second_task = asyncio.create_task(task("Second", 1))

    await first_task
    await second_task

if __name__ == "__main__":
    asyncio.run(main())
```

### What this shows

- `asyncio.create_task()` schedules a coroutine to run.
- The two tasks run concurrently and are awaited later.

---

## 5. How to use the `random` module

The `random` module is useful when you want to add variability, such as different delays between coroutines.

```python
import asyncio
import random

async def random_task(name):
    delay = random.randint(1, 3)  # Pick a random delay between 1 and 3 seconds
    print(f"{name} will sleep for {delay} seconds")
    await asyncio.sleep(delay)
    print(f"{name} finished")

async def main():
    await asyncio.gather(
        random_task("A"),
        random_task("B"),
        random_task("C"),
    )

if __name__ == "__main__":
    asyncio.run(main())
```

### What this shows

- `random.randint()` generates a random integer.
- Using randomness makes async programs more realistic and interesting.

---

## Quick summary

- Use `async def` to define a coroutine.
- Use `await` to pause a coroutine until another operation finishes.
- Use `asyncio.run()` to start the program.
- Use `asyncio.gather()` or `asyncio.create_task()` to run work concurrently.
- Use `random` to introduce dynamic behavior into async code.

You can save these examples in a file such as `async_intro.py` and run it with:

```bash
python3 async_intro.py
```
