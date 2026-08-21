# Pagination

## Learning objectives

This project demonstrates how to:

- Paginate a dataset with simple `page` and `page_size` parameters.
- Return useful hypermedia metadata with a paginated response.
- Paginate in a deletion-resilient manner so items are not skipped when rows are removed between requests.

## 1. Simple page and page size pagination

The page number identifies which slice to return, while `page_size` controls
the number of items in that slice. The first page is page `1`.

```python

def paginate(dataset, page=1, page_size=10):
 """Return one page from an ordered dataset."""
 if page < 1 or page_size < 1:
  raise ValueError("page and page_size must be positive")

 # Convert the page parameters into zero-based slice boundaries.
 start = (page - 1) * page_size
 end = start + page_size

 # Slicing safely returns an empty list when the page is past the end.
 return dataset[start:end]


users = ["Ada", "Grace", "Linus", "Margaret", "Guido"]
print(paginate(users, page=2, page_size=2))
# Output: ['Linus', 'Margaret']
```

## 2. Pagination with hypermedia metadata

Hypermedia metadata tells the client how to navigate the collection. A client
can use `next` and `prev` instead of calculating page numbers itself.

```python
def paginate_with_metadata(dataset, page=1, page_size=10):
 """Return page data together with navigation metadata."""
 if page < 1 or page_size < 1:
  raise ValueError("page and page_size must be positive")

 total_items = len(dataset)
 total_pages = (total_items + page_size - 1) // page_size
 start = (page - 1) * page_size
 items = dataset[start:start + page_size]

 # Links are None when there is no page in that direction.
 return {
  "page": page,
  "page_size": page_size,
  "total_items": total_items,
  "total_pages": total_pages,
  "data": items,
  "next": page + 1 if page < total_pages else None,
  "prev": page - 1 if page > 1 and page <= total_pages else None,
 }


users = ["Ada", "Grace", "Linus", "Margaret", "Guido"]
print(paginate_with_metadata(users, page=1, page_size=2))
# The response includes data plus total_pages, next, and prev navigation data.
```

## 3. Deletion-resilient pagination

Offset-based pagination can skip an item if an earlier item is deleted between
requests. For example, after reading items 1-10, deleting item 3 shifts the
old item 11 into position 10; requesting offset 10 now skips it.

A resilient approach uses a stable, unique cursor (usually the last returned
item's ID). The next request asks for items after that ID, so deletions before
the cursor do not change the result set.

```python
def paginate_after_id(dataset, last_id=None, page_size=10):
 """Return items after a cursor, preserving progress across deletions."""
 if page_size < 1:
  raise ValueError("page_size must be positive")

 # The dataset must be sorted by a stable, unique, increasing ID.
 if last_id is None:
  start = 0
 else:
  # Find the first item whose ID is greater than the cursor.
  start = next(
   (index for index, item in enumerate(dataset)
    if item["id"] > last_id),
   len(dataset),
  )

 items = dataset[start:start + page_size]

 # The client sends this ID back as last_id for the following request.
 next_id = items[-1]["id"] if items else None
 return {"data": items, "next": next_id}


records = [
 {"id": 101, "name": "Ada"},
 {"id": 102, "name": "Grace"},
 {"id": 103, "name": "Linus"},
]

first_page = paginate_after_id(records, page_size=2)
# If record 101 is deleted now, the cursor 102 still points after the same ID.
records.pop(0)
second_page = paginate_after_id(records, last_id=first_page["next"], page_size=2)
print(second_page["data"])
# Output: [{'id': 103, 'name': 'Linus'}]
```

For a web API, the cursor would normally be encoded into the `next` URL, for
example `GET /users?after_id=102&page_size=10`. The ordering and cursor field
must remain stable and unique for this technique to be reliable.
