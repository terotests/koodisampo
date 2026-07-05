# Haluat nähdä vain aktiiviset TCP-yhteydet tiettyyn palveluporttiin 443. ss-komento?

## Tilanne

Palvelin palvelee HTTPS:ää portissa 443. Haluat nähdä vain **aktiiviset** asiakasyhteydet — et LISTEN-socketia eikä UDP:ta.

## Ratkaisu

```bash
ss -tn state established '( dport = :443 or sport = :443 )'
```

Tai ilman sulkeita:

```bash
ss -tn state established dport = :443
ss -tn state established sport = :443
```

Prosessit mukaan:

```bash
ss -tnp state established dport = :443
```

**ss -tn + state established + port filter** — aktiiviset TCP-sessiot.

## Käytännössä

`-l` (LISTEN) ja `established` ovat eri tiloja — älä sekoita. `-u` on UDP. Reverse proxy edessä näet yhteydet paikalliseen prosessiin (`:443`), ei välttämättä alkuperäistä client-IP:tä ilman `ss -tnp`. Yhteenveto: `ss -s`.

[Lue lisää](https://man7.org/linux/man-pages/man8/ss.8.html)
