# Python Variable Annotations

This project is a simple study guide for learning:

- Type annotations in Python 3
- How to use type annotations to describe function signatures and variable types
- Duck typing
- How to validate your code with mypy

## 1. Type annotations in Python 3

Python allows you to add annotations to variables and functions. These annotations are hints for readers and tools such as mypy, but Python itself does not enforce them at runtime.

```python
# These variables are annotated with their expected types.
age: int = 25
name: str = "Alice"
is_student: bool = True

# A list of integers is annotated explicitly.
marks: list[int] = [90, 85, 88]
```

## 2. Function signatures and variable types

You can annotate function parameters and return values to make the expected input and output clear.

```python
from typing import List

# This function expects a string and an integer, and returns a string.
def greet(name: str, age: int) -> str:
    return f"Hello {name}, you are {age} years old"


message = greet("Sarah", 20)
print(message)
```

You can also annotate variables inside a function:

```python
# The variable result is declared as an integer.
def add(a: int, b: int) -> int:
    result: int = a + b
    return result

print(add(3, 4))
```

## 3. Duck typing

Duck typing means that the type of an object is determined by what it can do, not by its class name. In other words, if an object behaves like a certain type, it is accepted.

```python
# This function does not care about the exact class of the object.
# It only requires that the object has a "__len__" method.
def print_length(value) -> None:
    print(len(value))


print_length("Python")
print_length([1, 2, 3])
print_length((4, 5, 6))
```

In this example, strings, lists, and tuples all work because they all support the length operation.

## 4. Validating your code with mypy

mypy is a static type checker. It analyzes your code and reports type errors before the program runs.

### Install mypy

```bash
pip install mypy
```

### Example file

```python
# This function is correctly typed and should pass mypy checks.
def add(a: int, b: int) -> int:
    return a + b


print(add(2, 3))
```

Run the checker:

```bash
mypy add.py
```

### Example of a type error

```python
# This example intentionally mixes incompatible types.
def add(a: int, b: int) -> int:
    return a + b


result = add("two", 3)
```

If you run mypy on this file, it will report an error because the first argument is a string, not an integer.

## Summary

Type annotations help make code clearer and easier to maintain. They are especially useful when combined with tools such as mypy, which can catch mistakes early.
