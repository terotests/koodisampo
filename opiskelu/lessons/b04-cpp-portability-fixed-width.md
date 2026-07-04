# Wire-protokolla käyttää `int` ja `long` — eri alustoilla eri koko. Portable korvaaja?

═══ OPPITUNNIT ═══

Lyhyt kertaus opiskelulistan aiheista. Jokainen kohta vastaa pelissä näkyvää kysymystä.

── Kysy AI:lta (35) ──


**Ratkaisu:** `<cstdint>` — kiinteän levyisyyden tyypit (`int32_t`, `uint32_t`, `int64_t`, `uint64_t`).

```cpp
struct WireHeader {
    uint32_t magic;
    int32_t  payload_len;
};
```

**Älä luota:** `int`, `long`, `short` — koko vaihtelee alustan mukaan.
