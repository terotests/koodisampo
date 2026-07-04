# Debuggaat konttia — docker exec -it ajaa rootina vaikka Dockerfile USER app. Miksi?

## Tilanne
Dockerfile määrittää `USER app`, mutta `docker exec -it myapp sh` → root. Tiimi luulee hardeningin olevan rikki.

## Ratkaisu
**exec oletus root ellei --user — USER vaikuttaa vain CMD/ENTRYPOINT-käynnistykseen.**

```bash
docker exec -it --user app myapp sh
id  # uid=10001(app)
```

exec defaults to root — specify --user — docker exec docs.

## Käytännössä
Tuotantokontti ajaa oikein non-rootina (`docker top`). Exec debug root-oikeuksilla on erillinen käyttötapaus — dokumentoi.

[Lue lisää](https://docs.docker.com/reference/cli/docker/container/exec/)
