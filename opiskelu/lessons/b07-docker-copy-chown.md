# Non-root user ei voi kirjoittaa /app/logs — permission denied tuotannossa. Dockerfile-korjaus?

## Tilanne

Dockerfile luo hakemiston ja vaihtaa käyttäjän:

```dockerfile
RUN mkdir /app/logs
USER appuser
```

Mutta `mkdir` tehtiin rootina — `/app/logs` on omistajuudeltaan `root:root` mode 755. Sovellus kaatuu käynnistyksessä: `Permission denied` lokitiedostoon. Tuotannossa kontti pyörii non-rootina (hyvä), mutta oikeudet eivät vastaa käyttäjää.

## Ratkaisu

Luo hakemisto ja anna omistajuus **ennen** `USER`-vaihtoa:

```dockerfile
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app/logs
USER appuser
```

Tai `COPY --chown=appuser:appgroup` tiedostoille. Volume mountissa: varmista host-puolen UID/GID vastaa kontin käyttäjää, tai käytä named volumea.

## Käytännössä

Älä kirjoita rootina ja vaihda käyttäjää jälkikäteen — kaikki rootin luomat tiedostot jäävät kirjoitussuojatuiksi. Tarkista myös `/tmp` ja cache-hakemistot. `docker run --user` ilman Dockerfile-korjausta toistaa saman ongelman.

[Lue lisää](https://docs.docker.com/reference/dockerfile/#copy)
