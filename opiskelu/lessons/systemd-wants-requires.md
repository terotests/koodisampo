# Unit A: `Requires=B`, unit B kaatuu käynnistyksessä. Mitä tapahtuu A:lle?

## Tilanne

Tuotantopalvelimella `api.service` riippuu välimuistista: unit-tiedostossa on `Requires=redis.service`. Redisin konfiguraatioon tehdään virheellinen muutos, ja palvelu kaatuu heti käynnistyksessä:

```bash
systemctl start api.service
# redis.service: Failed with result 'exit-code'.
# api.service: Job redis.service/start failed with result 'dependency'.
```

Operaattori ihmettelee, miksi API ei käynnisty ollenkaan, vaikka Redis on "vain välimuisti". Toisessa ympäristössä sama API on määritelty `Wants=redis.service`-riippuvuudella — siellä API käynnistyy silti, vaikka Redis olisi alhaalla.

Ero on systemd:n riippuvuustyyppien kovuudessa. `Requires` luo kovan linkin: jos vaadittu unit ei aktivoidu onnistuneesti, riippuvainen unit ei saa jatkaa normaalisti.

## Ratkaisu

Kun unit B epäonnistuu käynnistyksessä ja unit A:lla on `Requires=B`, **Requires katkaisee A:n — A ei käynnisty tai pysähtyy, jos B epäonnistuu**.

```ini
[Unit]
Description=API Server
Requires=redis.service
After=redis.service
```

Tässä tapauksessa `api.service` jää failed-tilaan tai ei aktivoidu lainkaan, koska `redis.service` kaatui.

**Requires = kova linkki; Wants = pehmeä.** `Wants=redis.service` yrittää käynnistää Redisin, mutta API voi silti käynnistyä ilman sitä — sovelluksen pitää itse käsitellä Redisin puuttuminen.

Tarkista riippuvuudet:

```bash
systemctl list-dependencies api.service
systemctl show api.service -p Requires -p Wants
```

## Käytännössä

Käytä `Requires=` vain kun palvelu on oikeasti käyttökelvoton ilman riippuvuutta (tietokanta, pakollinen sidecar). Välimuistit, metriikka-agentit ja "nice to have" -komponentit kuuluvat `Wants=`- tai `After=`-määrittelyihin ilman kovaa linkkiä.

Code review -kohdassa: jokainen `Requires=`-rivi tarvitsee perustelun. Tuotantoon mennessä testaa myös skenaario, jossa riippuvuus kaatuu — varmista että haluttu käyttäytyminen (pysähtyminen vs. jatkaminen) on tarkoituksellinen.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)
