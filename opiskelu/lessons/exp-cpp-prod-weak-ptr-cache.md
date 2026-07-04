# Jaettu image-cache käyttää `shared_ptr`. Objektit eivät vapaudu vaikka UI sulkeutuu. Mikä omistusmalli auttaa?

## Tilanne

```cpp
std::unordered_map<Key, std::shared_ptr<Image>> cache;
// UI pitää shared_ptr → cache entry ei koskaan vapaudu
```

**Sykli:** cache → Image → callback → UI → cache entry. `shared_ptr` ref count ei mene nollaan — memory leak.

## Ratkaisu

Cache tallentaa **`std::weak_ptr<Image>`**:

```cpp
std::unordered_map<Key, std::weak_ptr<Image>> cache;

if (auto img = cache[key].lock()) {
    return img;  // elää jos joku muu pitää
}
// expired → lataa uudelleen
```

Weak ei pidä olioa hengissä — UI voi tuhota, cache entry vanhenee.

## Käytännössä

Parent-child: strong parent→child, weak child→parent. CppCoreGuidelines: break cycles with weak_ptr. Puhdista expired weak entryt periodically.

[Lue lisää](https://en.cppreference.com/w/cpp/memory/weak_ptr)
