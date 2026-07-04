# Funktio kirjoittaa kaksi konfiguraatiotiedostoa ja toinen kirjoitus epäonnistuu — ensimmäinen jää rikki. Miten?

## Tilanne

```cpp
void saveConfig(const Config& cfg) {
    writeFile("/etc/app.conf", cfg.main);
    writeFile("/etc/app.extra", cfg.extra);  // epäonnistuu — main jo korvattu
}
```

Osittainen kirjoitus — tuotanto jäljessä rikkinäisessä tilassa. Crash kesken → sama ongelma.

## Ratkaisu

**Atomic rename** — kirjoita väliaikaiseen, sitten rename:

```cpp
void writeAtomic(const path& target, string_view data) {
    auto tmp = target.string() + ".tmp";
    writeFile(tmp, data);
    fs::rename(tmp, target);  // atomista useimmilla FS:llä
}
```

Molemmat tiedostot erikseen atomic-write. Tai yksi tiedosto + backup rollback.

## Käytännössä

Tuotanto: temp + fsync + rename. Transaction pattern kahdelle tiedostolle: kirjoita molemmat .tmp, sitten rename molemmat. CppCoreGuidelines: strong consistency.

[Lue lisää](https://en.cppreference.com/w/cpp/filesystem/rename)
