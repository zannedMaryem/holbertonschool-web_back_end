#!/usr/bin/env python3
"""This module introduces python NoSQL manipulation"""
from typing import List


def list_all(mongo_collection) -> List:
    """This function lists all documents in a collection"""
    if not mongo_collection:
        return []
    return list(mongo_collection.find())
