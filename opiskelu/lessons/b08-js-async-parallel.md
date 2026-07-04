# Lataat kolme riippumatonta API:a — await peräkkäin kestää 3×. Nopeampi tapa?

## Tilanne

Sivun initial load tekee kolme riippumatonta API-kutsua peräkkäin:

```javascript
const config = await fetchConfig();
const user = await fetchUser();
const notifications = await fetchNotifications();
```

DevTools Network: jokainen ~400 ms → yhteensä ~1,2 s. Waterfall näyttää, ettei kutsut mene päällekkäin.

## Ratkaisu

**Promise.all rinnakkaiseen suoritukseen:**

```javascript
const [config, user, notifications] = await Promise.all([
  fetchConfig(),
  fetchUser(),
  fetchNotifications(),
]);
```

Kolme riippumatonta kutsua alkavat samanaikaisesti — kokonaisaika ≈ 400 ms.

## Käytännössä

Etsi waterfall-kuvio DevToolsista — helppo optimointi. Huomaa: selain rajoittaa samaan origin ~6 rinnakkaiseen yhteyteen — eri domainit voivat rinnastua vapaammin. Riippuvaiset kutsut (user → orders) eivät sovellu all:iin.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
