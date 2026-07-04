# Sovellus ei resolvdu mutta ping IP:llä toimii. DNS-diagnostiikka?

## Tilanne

Mikropalvelu ei käynnisty:

```
Error: getaddrinfo ENOTFOUND database.internal.corp
```

Sama palvelin vastaa suoraan IP:llä:

```bash
ping 10.20.5.15        # OK
ping database.internal.corp  # unknown host
```

Verkko on kunnossa — ongelma on nimipalvelussa, ei reitityksessä.

## Ratkaisu

Testaa DNS erikseen:

```bash
dig database.internal.corp
# tai:
dig @10.0.0.53 database.internal.corp
```

Vaihtoehto:

```bash
nslookup database.internal.corp
```

**dig queries DNS directly — testaa DNS-vastaus erikseen IP:stä.**

Tarkista myös resolv.conf ja mitä nameserver vastaa:

```bash
cat /etc/resolv.conf
dig +trace database.internal.corp   # delegointiketju
```

## Käytännössä

`dig @nameserver` erottaa resolver- ja authoritative-ongelmat. Sovellus voi käyttää eri resolveria kuin shell (Go `net.resolv.conf`, Java DNS cache). Tuotannossa seuraa DNS-vastausaikoja ja NXDOMAIN-prosenttia. Korjaa search-domain, nameserver tai palvelun DNSPolicy — älä ohita DNS:ää kovakoodatulla IP:llä pysyvästi.

[Lue lisää](https://bind9.readthedocs.io/en/latest/manpages.html#dig-1)
