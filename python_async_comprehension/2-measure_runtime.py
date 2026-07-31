#!/usr/bin/env python3
"""Coroutine measure_runtime that benchmarks async_comprehension."""
import asyncio
import time
async_comprehension = __import__('1-async_comprehension').async_comprehension


async def measure_runtime() -> float:
    """
    Execute async_comprehension four times in parallel using asyncio.gather.
    Measure the total runtime and return it as a float.
    """
    start: float = time.time()
    await asyncio.gather(*(async_comprehension() for _ in range(4)))
    end: float = time.time()
    return end - start
