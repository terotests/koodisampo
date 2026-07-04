# Kaksi objekti jakaa shared_ptr toisiinsa — muisti ei vapaudu. Mikä ratkaisu?

## Tilanne

```cpp
struct Node {
    std::shared_ptr<Node> next;
};
// A.next = B, B.next = A — ref count >= 1 forever
```

**Shared_ptr sykli** — kumpikaan ei vapaudu. Leak hidastuu kasvavassa graafissa.

## Ratkaisu

Yksi suunta **`weak_ptr`**:

```cpp
struct Node {
    std::shared_ptr<Node> next;
    std::weak_ptr<Node> prev;  // ei pidä edellistä hengissä
};
```

Parent→child strong, child→parent weak. Tree/DAG omistusmallit.

## Käytännössä

Review graafin omistus. `weak_ptr::lock()` ennen käyttöä. CppCoreGuidelines: break cycles.

[Lue lisää](https://en.cppreference.com/w/cpp/memory/weak_ptr)
