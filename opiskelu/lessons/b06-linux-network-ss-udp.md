# DNS-palvelu ei vastaa — haluat nähdä UDP-kuuntelijat. Mitä ss-optiota?

## Tilanne

Paikallinen DNS-resolver tai CoreDNS ei vastaa kyselyihin. TCP-portit näyttävät tyhjiltä, mutta DNS käyttää pääasiassa UDP:ta portissa 53.

```bash
ss -tlnp | grep 53
# ei tulosta
```

Palvelu saattaa silti kuunnella UDP:53.

## Ratkaisu

```bash
ss -ulnp
```

Tai suodatettuna:

```bash
ss -ulnp | grep 53
```

**ss -ulnp — UDP-kuuntelijat ja prosessit listataan porteittain.** `-u` UDP, `-l` LISTEN, `-n` numeeriset, `-p` prosessit.

## Käytännössä

DNS voi kuunnella sekä UDP:ta että TCP:ta (isot vastaukset). Tarkista molemmat: `ss -ulnp` ja `ss -tlnp`. systemd-resolved kuuntelee stubia `127.0.0.53` — erota se varsinaisesta authoritative DNS:stä. Kontissa `ss` hostilla vs kontissa selvittää porttimapping-ongelmat.

[Lue lisää](https://man7.org/linux/man-pages/man8/ss.8.html)
