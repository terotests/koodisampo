# std::sort kaatuu outoon virheeseen custom-iteratorilla. Mitä iteratorin pitää tarjota sortille?

## Tilanne

Custom container — forward iterator:

```cpp
std::sort(myContainer.begin(), myContainer.end());
// error: requires RandomAccessIterator
```

`std::sort` vaatii **RandomAccessIterator** — `it + n`, `<` iteratorien välillä O(1).

## Ratkaisu

Tarjoa random access tai käytä algoritmia joka sopii:

```cpp
std::list<T> lst;
lst.sort();  // list member sort — Bidirectional riittää

// tai kopio vectoriin sort + merge
```

`std::sort` on introsort — O(n log n), mutta vaatii random access.

## Käytännössä

C++20 `ranges::sort` sama vaatimus. Linked list: `list::sort`. CppCoreGuidelines: match algorithm to iterator category.

[Lue lisää](https://en.cppreference.com/w/cpp/algorithm/sort)
