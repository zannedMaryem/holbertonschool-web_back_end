#!/usr/bin/env python3
"""Async routine wait_n built on wait_random."""
import asyncio
from typing import List
wait_random = __import__('0-basic_async_syntax').wait_random


async def wait_n(n: int, max_delay: int) -> List[float]:
    """
    Spawn wait_random n times with the specified max_delay.
    Return the list of delays in ascending order without using sort().
    """
    tasks = [asyncio.create_task(wait_random(max_delay)) for _ in range(n)]
    delays: List[float] = []
    for completed in asyncio.as_completed(tasks):
        delay = await completed
        delays.append(delay)
    return delays
