# vectoriin lisätään monimutkaisia olioita — push_back(T(...)) luo turhan kopion. Miten vältät väliaikaisen?

## Tilanne

Widgetit lisätään vectoriin:

```cpp
std::vector<Widget> widgets;
for (const auto& cfg : configs) {
    widgets.push_back(Widget(cfg.name, cfg.size));  // väliaikainen Widget
}
```

`push_back(T(...))` luo **väliaikaisen** olion, sitten move/kopio vectoriin — kaksi vaihetta. Monimutkaisille tyypeille (iso string, nested kontit) turha työ.

## Ratkaisu

**`emplace_back`** rakentaa suoraan vectorin muistiin:

```cpp
for (const auto& cfg : configs) {
    widgets.emplace_back(cfg.name, cfg.size);
}
```

Ei väliaikaista `Widget`:ia — konstruktori kutsutaan suoraan allokoituun muistiin. Yhdistä `reserve(n)` kun määrä tiedossa.

## Käytännössä

`emplace_back` kun constructor-args tiedossa. `push_back` kun valmis olio on jo olemassa. Move-only tyypit: `push_back(std::move(w))`. CppCoreGuidelines: emplace kun mahdollista.

[Lue lisää](https://en.cppreference.com/w/cpp/container/vector/emplace_back)
