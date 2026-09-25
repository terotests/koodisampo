# Tuottaja kirjoittaa puskuriin ja kasvattaa sitten atomic<int>-laskuria relaxed-järjestyksellä. Kuluttaja näkee uuden laskurin mutta vanhaa dataa. Mikä auttaa?

## Tilanne

Tuottaja kirjoittaa tavalliseen puskuriin ja kasvattaa sitten laskuria `fetch_add(1, std::memory_order_relaxed)`. Relaxed takaa vain, että laskurin päivitys on atominen — se **ei järjestä** muita muistioperaatioita laskurin ympärillä. Kuluttaja voi siis nähdä uuden laskurin arvon mutta vielä vanhan puskuridatan. Memory order ei nopeuta arvon näkymistä toiselle CPU:lle; se määrää, mitä muuta näkyy samalla.

## Ratkaisu

Valitse **memory order** tarpeen mukaan:

- **`seq_cst`** — oletus, turvallisin, hitain
- **`release`/`acquire`** — producer/consumer data + flag
- **`relaxed`** — pelkkä laskuri, ei synkronoi muuta

```cpp
// tuottaja
buffer[n] = value;
count.fetch_add(1, std::memory_order_release);

// kuluttaja
if (count.load(std::memory_order_acquire) > n) {
    use(buffer[n]);  // release/acquire: data näkyy
}
```

Kun acquire-lataus näkee release-kirjoituksen arvon, syntyy happens-before-suhde: kaikki ennen releasea kirjoitettu on näkyvissä. Pelkkä laskuri ilman muuta dataa pärjää `relaxed`-järjestyksellä.

## Käytännössä

Älä optimoi ilman mittausta. CppCoreGuidelines CP.2. Dokumentoi ordering-sopimus.

[Lue lisää](https://en.cppreference.com/w/cpp/atomic/memory_order)
