#!/usr/bin/env python3
"""This module defines a type‑annotated function element_length."""
from typing import Iterable, List, Tuple, Sequence


def element_length(lst: Iterable[Sequence]) -> List[Tuple[Sequence, int]]:
    """
    Return a list of tuples where:
    - Each tuple contains an element from lst
    - And the length of that element
    """
    return [(i, len(i)) for i in lst]
