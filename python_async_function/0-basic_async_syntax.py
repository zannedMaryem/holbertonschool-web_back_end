#!/usr/bin/env python3
"""This module contains scripts with
the objective of learning Python - Async"""
import random
import asyncio
from typing import Union


async def wait_random(max_delay: int = 10) -> float:
    """
    An asynchronous coroutine that takes in an integer argument,
    waits for a random delay between 0 and max_delay seconds,
    and eventually returns the delay.
    """
    delay: float = random.uniform(0, max_delay)
    await asyncio.sleep(delay)
    return delay
