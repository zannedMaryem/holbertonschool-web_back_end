#!/usr/bin/env python3
""" function returns a tuple containing a start index
    and an end index corresponding to the range of indexes
    to return in a list for those particular pagination parameters."""


def index_range(page, page_size):
    """ function returns a tuple containing a start index
    and an end index corresponding to the range of indexes
    to return in a list for those particular pagination parameters."""
    start_index = (page - 1) * page_size
    end_index = page * page_size
    return start_index, end_index
