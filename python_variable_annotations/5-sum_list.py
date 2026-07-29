#!/usr/bin/env python3
"""This module conatins a annotated function tha sums the elements of a list"""
from typing import List


def sum_list(input_list: List[float]) -> float:
    """ A function that returns the sum of a list elements"""
    num: float = 0.0
    for element in input_list:
        num += element
    return num
