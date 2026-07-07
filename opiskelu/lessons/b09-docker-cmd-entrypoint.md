# Kontti ajaa ensin migraatiot, sitten sovelluksen, ja deploy haluaa ylikirjoittaa vain sovelluksen argumentit (ei migraatiovaihetta). Miten jaat Dockerfile-komennot?

## Tilanne
Haluat wrapper-skriptin joka ajaa DB-migraatiot ennen appia, mutta dev haluaa ylikirjoittaa komennon helposti (`docker run ... bash`).

## Ratkaisu
**ENTRYPOINT wrapper-skripti + CMD app-args — CMD on oletusparametrit entrypointille.**

```dockerfile
COPY docker-entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["server"]
```

`docker run myapp worker` → entrypoint.sh worker

ENTRYPOINT vs CMD — Docker Dockerfile reference.

## Käytännössä
Entrypoint.sh: migraatiot + `exec "$@"` viimeiseksi. Debug: `docker run --entrypoint bash myapp`.

[Lue lisää](https://docs.docker.com/reference/dockerfile/#entrypoint)
