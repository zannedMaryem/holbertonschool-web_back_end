# NoSQL and MongoDB

## Learning objectives

By the end of this guide, you should be able to:

- Explain what NoSQL means.
- Distinguish SQL databases from NoSQL databases.
- Explain the ACID properties.
- Describe document storage and the main NoSQL database types.
- Identify the benefits of NoSQL databases.
- Query, insert, update, and delete data in MongoDB.

## What does NoSQL mean?

**NoSQL** means "not only SQL". It describes database systems that do not
require data to be stored in relational tables with a fixed schema. NoSQL
databases are designed for flexible data models, horizontal scaling, and
large or rapidly changing datasets.

NoSQL does not mean that SQL-like querying is impossible. It means that the
database is not limited to the relational model or to SQL as its interface.

## SQL versus NoSQL

| SQL | NoSQL |
| --- | --- |
| Stores data in tables, rows, and columns | Uses documents, key-value pairs, graphs, or wide columns |
| Usually has a predefined, strict schema | Usually has a flexible schema |
| Uses relationships and joins between tables | Often embeds related data or uses application-side references |
| Commonly scales vertically by making one server stronger | Commonly scales horizontally by adding servers |
| Uses SQL for queries | Uses database-specific query APIs or languages |

### Equivalent examples

SQL stores a user in a table:

```sql
INSERT INTO users (name, email) VALUES ('Ada', 'ada@example.com');
SELECT name, email FROM users WHERE name = 'Ada';
```

MongoDB stores the same user as a document in a collection. In Python, use
the `pymongo` driver:

```python
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client.school

# A collection is similar to a table, but documents need not share exactly
# the same fields.
db.users.insert_one({"name": "Ada", "email": "ada@example.com"})

# Find documents whose name is Ada and return only selected fields.
users = db.users.find(
    {"name": "Ada"},
    {"_id": 0, "name": 1, "email": 1}
)
for user in users:
    print(user)
```

## What is ACID?

ACID describes properties that make database transactions reliable:

- **Atomicity**: a transaction succeeds completely or none of it is applied.
- **Consistency**: a transaction keeps the database within its rules and constraints.
- **Isolation**: concurrent transactions do not expose incomplete intermediate results.
- **Durability**: committed data remains saved after a failure.

MongoDB supports atomic operations on a single document. It also supports
multi-document transactions when several documents must change together.

```python
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client.school

# Use a session when operations must commit or roll back together.
with client.start_session() as session:
    with session.start_transaction():
        db.students.update_one(
            {"name": "Ada"},
            {"$set": {"enrolled": True}},
            session=session
        )
        db.audit.insert_one(
            {"action": "enroll", "student": "Ada"},
            session=session
        )
        # Exiting the block commits both operations; an exception aborts them.
```

Transactions require a MongoDB deployment that supports them, such as a
replica set or a sharded cluster.

## What is document storage?

A document database stores records as documents, commonly represented as
JSON-like objects. MongoDB stores documents in **BSON**, a binary form of
JSON that also supports types such as dates and object identifiers.

Documents are grouped into collections, and collections are grouped into
databases. Related data can be embedded inside one document:

```python
from pymongo import MongoClient

db = MongoClient("mongodb://localhost:27017/").school

# The address is embedded because it belongs directly to this user.
db.users.insert_one({
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "address": {
        "city": "London",
        "country": "United Kingdom"
    },
    "skills": ["mathematics", "programming"]
})
```

Each MongoDB document normally has a unique `_id` field. MongoDB creates one
automatically when it is omitted.

## Main NoSQL types

1. **Document databases** store JSON-like documents. Examples: MongoDB and CouchDB.
2. **Key-value databases** store a value identified by a key. Examples: Redis and DynamoDB.
3. **Wide-column databases** store data in column families. Examples: Cassandra and HBase.
4. **Graph databases** store nodes and relationships. Examples: Neo4j and Amazon Neptune.

## Benefits of a NoSQL database

- Flexible schemas make changing application data easier.
- Documents can match the structure of objects used by an application.
- Embedded data can reduce the need for joins.
- Horizontal scaling supports high traffic and large datasets.
- Many systems provide high availability through replication.
- Different data models can fit different workloads.

NoSQL is not automatically better than SQL. A relational database may be a
better choice when complex joins, strict constraints, and highly structured
transactions are the most important requirements.

## Using MongoDB

### Start the shell and select a database

Install PyMongo and connect to MongoDB from Python:

```bash
pip install pymongo
```

```python
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

# List databases available to the current MongoDB server.
print(client.list_database_names())

# Select a database. MongoDB creates it when the first document is inserted.
db = client.school

# Show the selected database and its collections.
print(db.name)
print(db.list_collection_names())
```

The exercise file `0-list_databases` contains the equivalent `show dbs`
MongoDB shell command.

### Insert documents

```python
# Insert one document into the students collection.
db.students.insert_one({
    "name": "Ada",
    "age": 36,
    "course": "Computer Science"
})

# Insert several documents at once.
db.students.insert_many([
    {"name": "Grace", "age": 28, "course": "Mathematics"},
    {"name": "Linus", "age": 34, "course": "Systems"}
])
```

### Query documents

```python
# Return every document in the collection.
for student in db.students.find():
    print(student)

# Find students older than 30.
older_students = db.students.find({"age": {"$gt": 30}})

# Find one matching student.
student = db.students.find_one({"name": "Ada"})

# Select fields and exclude the generated _id field.
math_students = db.students.find(
    {"course": "Mathematics"},
    {"_id": 0, "name": 1, "age": 1}
)

# Sort by age and return only the first two results.
youngest_students = db.students.find().sort("age", 1).limit(2)
```

Useful query operators include `$gt` (greater than), `$gte` (greater than or
equal), `$lt`, `$lte`, `$in`, `$and`, and `$or`.

### Update documents

```python
# Change one field on the first matching document.
db.students.update_one(
    {"name": "Ada"},
    {"$set": {"enrolled": True}}
)

# Increment a numeric field for every matching document.
db.students.update_many(
    {"course": "Systems"},
    {"$inc": {"age": 1}}
)

# Add a skill to an array only if it is not already present.
db.students.update_one(
    {"name": "Grace"},
    {"$addToSet": {"skills": "algebra"}}
)
```

### Delete documents

```python
# Delete one matching document.
db.students.delete_one({"name": "Linus"})

# Delete all students in a course.
db.students.delete_many({"course": "Systems"})
```

Be precise with delete filters. An empty filter, such as
`delete_many({})`, matches every document in the collection.

### Indexes

Indexes make frequent queries faster by avoiding a full collection scan.

```python
# Enforce uniqueness and speed up lookups by email.
db.users.create_index([("email", 1)], unique=True)

# Inspect indexes defined on the collection.
print(list(db.users.list_indexes()))
```

Indexes improve reads but use storage and can make writes slower, so create
them for real query patterns rather than every field.

## Quick reference

```python
print(client.list_database_names())       # List databases
db = client.school                        # Select a database
print(db.list_collection_names())         # List collections
db.students.find({"age": 20})             # Query documents
db.students.insert_one({"name": "Ada"})  # Insert one document
db.students.update_one(filter, update)    # Update one document
db.students.delete_one(filter)            # Delete one document
```
