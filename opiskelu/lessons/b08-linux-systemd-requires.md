# App service pitää käynnistyä vain jos network-online.target on valmis. Unit-riippuvuus?

**Ratkaisu:** unit-tiedostossa:

```ini
[Unit]
After=network-online.target
Wants=network-online.target
```

`Wants` aktivoi targetin; `After` varmistaa järjestyksen. Varmista että `systemd-networkd-wait-online` tai vastaava on käytössä.
