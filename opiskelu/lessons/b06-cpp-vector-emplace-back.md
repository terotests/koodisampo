# Rakennat vektorin monimutkaisia olioita — push_back kopioi turhaan. Miten rakennat suoraan konttiin?

## Tilanne

```cpp
std::vector<Widget> widgets;
for (const auto& cfg : configs) {
    widgets.push_back(Widget(cfg.name, cfg.size));  // väliaikainen Widget
}
```

`Widget(...)` luodaan stackille, sitten move/kopio vectoriin — kaksi vaihetta, turha työ isoille tyypeille.

## Ratkaisu

**`emplace_back`**:

```cpp
for (const auto& cfg : configs) {
    widgets.emplace_back(cfg.name, cfg.size);
}
```

Konstruktori kutsutaan **suoraan** vectorin muistiin. Yhdistä `reserve(configs.size())`.

## Käytännössä

emplace kun args tiedossa; push_back valmiille oliolle. CppCoreGuidelines: prefer emplace when constructing in container.

[Lue lisää](https://en.cppreference.com/w/cpp/container/vector/emplace_back)
