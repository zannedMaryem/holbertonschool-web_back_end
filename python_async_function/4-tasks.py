#!/usr/bin/env python3
"""Async routine task_wait_n built on task_wait_random."""
import asyncio
from typing import List
task_wait_random = __import__('3-tasks').task_wait_random


async def task_wait_n(n: int, max_delay: int) -> List[float]:
    """
    Spawn task_wait_random n times with the specified max_delay.
    Return the list of delays in ascending order without using sort(),
    by collecting results as tasks complete.
    """
    tasks = [task_wait_random(max_delay) for _ in range(n)]
    delays: List[float] = []
    for completed in asyncio.as_completed(tasks):
        delay = await completed
        delays.append(delay)
    return delays
