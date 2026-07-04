# Testi epäonnistuu vain joskus CI:ssä. Mikä on hyvä ensimmäinen askel?

## Tilanne

Sama testi: paikallisesti vihreä 50/50, CI:ssä punainen ~5 % ajosta. Tiimi alkaa "re-run until green" — flakiness peittyy, regressio jää piiloon. Tuotantobugi voi olla saman juurisyyn kanssa nondeterministinen.

## Ratkaisu

**Eristä nondeterminismi** — systemaattinen lista:

1. **Aika** — `Date.now()`, timeouts, race conditions → mock clock, pidemmät timeoutit CI:ssä
2. **Verkko** — ulkoiset API-kutsut → mock/stub, testcontainers
3. **Rinnakkaisuus** — jaettu tila testeissä → eristä, serialisoi, unique data per test
4. **Järjestys** — testien suoritusjärjestys → `--random-order` löytää riippuvuudet

```bash
# toista epäilty testi
for i in {1..100}; do npm test -- --grep "login flow" || break; done
```

## Käytännössä

Google: flaky tests quarantine — merkitse `@flaky`, korjaa tai poista. CI: tallenna lokit failista. Älä disable ilman tikettiä. Retry max 1–2× — ei peitä ongelmaa.

[Lue lisää](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html)
