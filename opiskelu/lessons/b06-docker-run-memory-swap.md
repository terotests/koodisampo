# Kontti OOM-killaa mutta swap näyttää vapaana. Miten rajoitat memory+swap yhdessä?

## Tilanne
Kontti OOM-killataan vaikka hostilla näyttää olevan swapia vapaana. `--memory 512m` yksin ei rajoita swap-käyttöä odotetusti — kontti voi käyttää swapia ja silti kaatua arvaamattomasti.

## Ratkaisu
**Määritä --memory ja --memory-swap yhdessä rajoittaaksesi RAM:n ja swapin.**

```bash
# Ei swapia lainkaan (memory == memory-swap)
docker run --memory 512m --memory-swap 512m myapp

# Sallitaan 512m RAM + 512m swap
docker run --memory 512m --memory-swap 1g myapp
```

Resource constraints memory-swap — Docker docs run memory.

## Käytännössä
`--memory-swap -1` (oletus) = unlimited swap. Tuotannossa tyypillisesti estetään swap (`memory-swap == memory`) latencyn vuoksi.

[Lue lisää](https://docs.docker.com/reference/cli/docker/container/run/#memory-swap)
