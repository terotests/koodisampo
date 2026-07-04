# Palvelu kaatuu satunnaisesti — haluat systemd:n käynnistävän sen uudelleen. Mitä unit-tiedostoon?

## Tilanne

`processor.service` kaatuu satunnaisesti ulkoisen API:n timeoutiin. Oletusunitissa ei ole restart-politiikkaa:

```ini
[Service]
ExecStart=/usr/bin/processor
# ei Restart= — yksi crash = palvelu alhaalla
```

Operaattori käynnistää manuaalisesti, mutta haluaa systemd:n hoitavan palautumisen automaattisesti ilman loputonta crash-looppia.

## Ratkaisu

Lisää unit-tiedostoon **`Restart=on-failure` tai `always` + `StartLimitBurst`/`StartLimitInterval`**.

```ini
[Service]
ExecStart=/usr/bin/processor
Restart=on-failure
RestartSec=10
StartLimitIntervalSec=300
StartLimitBurst=5
```

**Restart= directives control auto-restart** — systemd.service(5).

- `on-failure`: uudelleenkäynnistys virhepoistumisessa
- `always`: myös onnistuneen pysäytyksen jälkeen (harvemmin tuotantoon)
- Start limit: estää äärettömän loopin

## Käytännössä

Deploy-template sisältää aina Restart + StartLimit -rivit. Monitoroi `systemctl show processor -p NRestarts`.

`always` vs `on-failure`: tuotannossa lähes aina `on-failure`. Dokumentoi poikkeukset. Yhdistä ulkoiseen health checkiin — restart ei korjaa datan eheyttä.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html#Restart=)
