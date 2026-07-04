# Vektori kasvaa miljoonaan elementtiin ja tyhjennetään — muisti ei vapaudu. Mitä kutsut?

## Tilanne

Väliaikainen bufferi:

```cpp
std::vector<Record> buffer;
buffer.resize(1'000'000);
process(buffer);
buffer.clear();  // size = 0, mutta capacity ~1M — muisti pidetään
```

`clear()` tyhjentää elementit mutta **ei vapauta** kapasiteettia. Pitkässä ajossa prosessin RSS pysyy korkeana — OOM riski muissa osissa. `shrink_to_fit` ei ole automaattinen.

## Ratkaisu

**`shrink_to_fit()`** pyytää konttia vapauttamaan ylimääräisen kapasiteetin:

```cpp
buffer.clear();
buffer.shrink_to_fit();
```

Vanhempi idiom: `vector<T>().swap(buffer)` — sama idea. Huom: `shrink_to_fit` on **non-binding request** — implementaatio voi ignorerata, mutta useimmiten vapauttaa.

## Käytännössä

Käytä kun tiedät ettei vector kasva pian takaisin samaan kokoon. Toistuva grow-shrink → harkitse `reserve` + uudelleenkäyttö tai kierrätä vector poolissa. CppCoreGuidelines: älä shrink joka kierroksella — allokaatio maksaa.

[Lue lisää](https://en.cppreference.com/w/cpp/container/vector/shrink_to_fit)
