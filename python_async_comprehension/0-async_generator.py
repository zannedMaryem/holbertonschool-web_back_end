#!/usr/bin/env python3
"""Coroutine async_generator that yields random numbers."""
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
