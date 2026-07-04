# Security review: Dockerfile ei määritä USER:ia — kontti ajaa rootina. Korjaus?

## Tilanne
Security review: Dockerfile päättyy suoraan `CMD`:hen ilman `USER`:ia. Kontti käynnistyy rootina oletuksena.

## Ratkaisu
**Lisää non-root USER ja varmista tiedosto-oikeudet COPY:ssa.**

```dockerfile
RUN addgroup -g 10001 app && adduser -u 10001 -G app -D app
WORKDIR /app
COPY --chown=app:app . .
USER app
CMD ["./server"]
```

Docker docs suosittelee non-root käyttäjää — container escape riski pienenee.

## Käytännössä
Portit < 1024 vaativat capabilities tai reverse proxyn. Testaa image `docker run --user 10001:10001` ennen deploya.

[Lue lisää](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
