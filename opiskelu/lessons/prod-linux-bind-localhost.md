# Palvelu toimii koneella `curl localhost:8080` mutta ulkopuolelta yhteys timeouttaa. Todennäköisin syy?

## Tilanne

Paikallinen healthcheck on vihreä. Ulkoinen probe / toinen host timeouttaa. Firewall epäillään, mutta usein syy on bind-osoite: palvelu kuuntelee vain `127.0.0.1:8080`, ei ulkoista interfacea.

## Ratkaisu

Tarkista kuuntelu:

```bash
ss -tlnp | grep 8080
```

Jos näkyy `127.0.0.1:8080`, vaihda bind `0.0.0.0:8080` (kaikki interfacet) tai tiettyyn LAN-IP:hen. Sovellusasetus: `--host 0.0.0.0`, `listen_address`, jne.

## Käytännössä

- Firewall (`nftables`/`security group`) on toinen yleinen syy — tarkista `ss` ensin, sitten verkko.
- Kontissa: publish `-p 8080:8080` + app bind `0.0.0.0` (ei vain localhost kontissa).
- Älä avaa kaikkea maailmalle ilman tarvetta — bindaa tarkoituksella.

[Lue lisää](https://man7.org/linux/man-pages/man7/ip.7.html)
