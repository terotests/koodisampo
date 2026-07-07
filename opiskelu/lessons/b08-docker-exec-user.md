# Debuggaat konttia ja haluat ajaa shellin tietyllä käyttäjällä. Mitä optiota käytät?

## Tilanne
Dockerfile määrittää `USER app`, mutta debug-sessiossa tarvitset shellin joko sovelluskäyttäjänä tai rootina. `docker exec` ei välttämättä käytä Dockerfilen `USER`-asetusta oletuksena — käyttäjä kannattaa valita eksplisiittisesti.

## Ratkaisu
**Määritä käyttäjä `--user`-optiolla.**

```bash
docker exec -it --user app myapp sh
docker exec -it --user root myapp sh
```

`USER` vaikuttaa buildin loppuvaiheen `RUN`-komentoihin ja kontin oletuskäynnistykseen (`ENTRYPOINT`/`CMD`). `docker exec` sallii käyttäjän yliajon `--user`-optiolla.

## Käytännössä
Tuotantokontti ajaa oikein non-rootina (`docker top`). Debuggaa sovelluskäyttäjänä kun mahdollista; root vain kun tarvitaan (`--user root`).

[Lue lisää](https://docs.docker.com/reference/cli/docker/container/exec/)
