# Python Async Comprehension

## Objectives
The goal of this project is to learn:
- How to write an **asynchronous generator**
- How to use **async comprehensions**
- How to **type‑annotate generators**
- How to measure performance of async routines

---

## Asynchronous Generators

An asynchronous generator is defined with `async def` and uses `yield` to produce values.  
Unlike normal generators, they can `await` inside the loop.

### Example

```python

import asyncio
import random
from typing import AsyncGenerator

async def async_generator() -> AsyncGenerator[float, None]:
    """
    Loop 10 times:
    - Asynchronously wait 1 second
    - Yield a random float between 0 and 10
    """
    for _ in range(10):
        await asyncio.sleep(1)
        yield random.uniform(0, 10)
```

## Async Comprehensions

Async comprehensions let you consume asynchronous generators in a concise way.

### Example

```python

import asyncio

async def async_comprehension():
    """
    Collect 10 random numbers from async_generator into a list.
    """
    return [i async for i in async_generator()]
```

#### Usage

```python

async def main():
    numbers = await async_comprehension()
    print(numbers)

asyncio.run(main())
```

## Type‑Annotating Generators

Python’s typing module provides AsyncGenerator for type hints.

AsyncGenerator[YieldType, SendType]

For most async generators, SendType is None.

### Example

```python

from typing import AsyncGenerator

async def async_generator() -> AsyncGenerator[float, None]:
    """
    Yields random float values asynchronously.
    """
    ...
```

## Performance Measurement

You can measure how long async comprehensions take using the time module.
This helps you understand concurrency and efficiency.

### Example

```python

import time

async def measure_runtime():
    """
    Run async_comprehension four times concurrently and measure total runtime.
    """
    start = time.time()
    await asyncio.gather(*(async_comprehension() for _ in range(4)))
    end = time.time()
    return end - start
```

#### Usage

```python

async def main():
    runtime = await measure_runtime()
    print(f"Total runtime: {runtime:.2f} seconds")

asyncio.run(main())
```

## Summary

Use async def + yield for asynchronous generators.

Use [item async for item in generator()] for async comprehensions.

Use AsyncGenerator from typing for proper type annotations.

Use asyncio.gather and time to measure performance.