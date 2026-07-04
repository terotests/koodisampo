# Rakennat isoja olioita suoraan vectoriin väliaikaisten kopioiden sijaan. Mikä metodi?

## Tilanne

Koodi rakentaa monimutkaisia `Record`-olioita silmukassa:

```cpp
records.push_back(Record(id, fetchName(id), computeHash(id)));
```

`push_back(Record(...))` luo **väliaikaisen** Record-olion ja move/kopioi sen vectoriin — kaksi konstruktiokutsua per alkio. Profileri näyttää turhia allokaatioita ja kopioita.

## Ratkaisu

`emplace_back` rakentaa alkion **suoraan** vectorin muistiin:

```cpp
records.reserve(expected_count);
records.emplace_back(id, fetchName(id), computeHash(id));
```

Argumentit välitetään suoraan konstruktorille kontissa — ei väliaikaista `Record`-oliota. Yhdistä `reserve(n)` kun alkiomäärä on tiedossa tai arvioitavissa; se vähentää reallokaatioita.

## Rajoitukset

`emplace_back` ei ole taikuutta: jos argumentit vaativat väliaikaisia objekteja tai implisiittisiä muunnoksia, hyöty voi olla pieni. Profiloi ennen mikro-optimointia. `push_back` on edelleen selkeä, kun lisäät valmiin olion: `vec.push_back(std::move(existing))`.

[Lue lisää](https://en.cppreference.com/w/cpp/container/vector/emplace_back)
