# Non-root USER ei voi kirjoittaa COPY:llä tuotua hakemistoa. Dockerfile-korjaus?

## Tilanne
Dockerfile asettaa `USER app`, mutta `COPY . .` ennen sitä luo tiedostot root-owned. Sovellus ei voi kirjoittaa `/app/data`:an — permission denied tuotannossa.

## Ratkaisu
**COPY --chown=app:app tai RUN chown ennen USER-vaihtoa korjaa kirjoitusoikeuden.**

```dockerfile
RUN adduser -D app
COPY --chown=app:app . /app
USER app
WORKDIR /app
```

COPY --chown sets ownership — Dockerfile COPY.

## Käytännössä
`--chown` ennen USER-vaihtoa. Volume-mountit tarvitsevat oikeudet hostilla tai init-containerin.

[Lue lisää](https://docs.docker.com/reference/dockerfile/#copy---chown)
