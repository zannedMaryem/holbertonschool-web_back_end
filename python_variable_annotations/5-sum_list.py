#!/usr/bin/env python3
"""This module conatins a annotated function tha sums the elements of a list"""


def sum_list(input_list: list[float]) -> float:
    """ A function that returns the sum of a list elements"""
    num: float = 0.0
    for element in input_list:
        num += element
    return num
