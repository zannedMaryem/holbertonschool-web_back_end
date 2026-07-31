#!/usr/bin/env python3
"""This module defines a function task_wait_random."""
import asyncio
from typing import Any
wait_random = __import__('0-basic_async_syntax').wait_random


def task_wait_random(max_delay: int) -> asyncio.Task:
    """
    Return an asyncio.Task that runs wait_random(max_delay).
    This is a regular function, not async.
    """
    return asyncio.create_task(wait_random(max_delay))
