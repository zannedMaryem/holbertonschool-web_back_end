#!/usr/bin/env python3
"""This module conatins a annotated function tha sums the elements of a list"""
from typing import List, Union


def sum_mixed_list(mxd_lst: List[Union[int, float]]) -> float:
    """A function that returns the sum of a list elements"""
    sum: float = 0.0
    for element in mxd_lst:
        sum += element
    return sum
