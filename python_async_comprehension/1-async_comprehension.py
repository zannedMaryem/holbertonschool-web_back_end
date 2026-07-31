#!/usr/bin/env python3
"""Coroutine async_comprehension that collects values from async_generator."""
import asyncio
from typing import List
async_generator = __import__('0-async_generator').async_generator


async def async_comprehension() -> List[float]:
    """
    Collect 10 random numbers using an async comprehension
    over async_generator, then return them as a list.
    """
    return [i async for i in async_generator()]
