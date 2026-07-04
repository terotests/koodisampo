# Palvelu tarvitsee pysyvän session ilman interaktiivista loginia. Mitä komponentti hallinnoi?

## Tilanne

Palvelin ajaa taustatehtäviä service account -käyttäjällä ilman SSH-loginia. Jokin komponentti tarvitsee "session"-kontekstia — esim. D-Bus-yhteydet, seat-oikeudet tai user-runtime -hakemiston (`/run/user/$UID`).

Et ole varma mikä systemd-komponentti vastaa sessioiden elinkaaresta kun interaktiivista kirjautumista ei ole.

## Ratkaisu

**`systemd-logind` hallinnoi sessioneja ja seat-konfiguraatiota.**

Logind seuraa:

- käyttäjäsessionien luontia ja tuhoamista (login/logout)
- `KillUserProcesses`-käytöstä logoutissa
- `linger`-tilaa (`loginctl enable-linger`)
- seat/VT-hallintaa

Tarkista:

```bash
loginctl list-sessions
loginctl show-user deployuser
loginctl enable-linger deployuser   # pysyvä user runtime ilman loginia
```

**logind manages user sessions** — systemd-logind(8).

Ilman lingeriä user systemd-instanssi sammuu kun viimeinen sessio päättyy.

## Käytännössä

Service account -käyttäjille, jotka ajavat user-uniteja tai tarvitsevat `/run/user/UID`:n: `loginctl enable-linger`. Dokumentoi logind.conf-asetukset (`KillUserProcesses=no` jos tarvitaan).

System unit -palvelut eivät tarvitse logindia — se on user session -kerroksen komponentti. Sekoita ei system vs. user instanssia.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd-logind.html)
