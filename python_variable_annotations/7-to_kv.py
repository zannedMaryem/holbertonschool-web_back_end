#!/usr/bin/env python3
"""This module conatins a annotated function that returns a tuple"""
from typing import Union, Tuple


def to_kv(k: str, v: Union[float, int]) -> Tuple[str, float]:
    """A function that returns a tuple"""
    return (k, float(v ** 2))
