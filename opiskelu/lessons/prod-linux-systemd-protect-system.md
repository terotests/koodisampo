# Unitissa on `ProtectSystem=strict` ja sovellus ei voi enää kirjoittaa `/var/lib/myapp`iin. Turvallisin korjaus?

## Tilanne

Hardening:

```ini
ProtectSystem=strict
```

`strict` tekee koko tiedostojärjestelmän read-onlyksi unitille — vain API-tiedostojärjestelmät `/dev`, `/proc` ja `/sys` jäävät poikkeuksiksi. (`ProtectSystem=full` suojaisi vain `/usr`:n, `/boot`:n ja `/etc`:n.) Sovellus tarvitsee tilaa `/var/lib/myapp` — kirjoitus epäonnistuu. Houkutus: poistaa `ProtectSystem` kokonaan. Se heikentää eristystä turhaan.

## Ratkaisu

Salli vain tarvittava polku:

```ini
ProtectSystem=strict
ReadWritePaths=/var/lib/myapp
```

`ReadWritePaths` avaa poikkeuksen ilman että koko tiedostojärjestelmä muuttuu kirjoitettavaksi. Pidä data-/state-polut eksplisiittisinä.

## Käytännössä

- Yhdistä `ProtectHome`, `PrivateTmp`, `NoNewPrivileges` — testaa `systemd-analyze security`.
- Jos tarvitset vain configin lukua `/etc`:stä, `strict` on ok; kirjoitus onnistuu vain `ReadWritePaths=`- tai `StateDirectory=`-poluissa, sillä `strict` suojaa myös `/var`:n.
- `StateDirectory=myapp` luo ja hallinnoi `/var/lib/myapp` systemdille siististi.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.exec.html#ProtectSystem=)
