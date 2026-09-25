# Dockerfilessa on `ENTRYPOINT ["./entrypoint.sh"]` ja `CMD ["node", "server.js"]`. Miksi `docker run myimage bash` ei avaa bash-shelliä?

## Tilanne
Tiimi ajaa `docker run myimage bash` odottaen pääsevänsä debug-shelliin, mutta sovellus käynnistyy silti. ENTRYPOINT ja CMD sekoittuvat.

## Ratkaisu
**`bash` korvaa vain CMD:n — se annetaan argumenttina ENTRYPOINTille.** ENTRYPOINT on pääkomento, CMD on oletusargumentit.

```dockerfile
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "server.js"]

# docker run myimage
# → ./entrypoint.sh node server.js
# docker run myimage bash
# → ./entrypoint.sh bash
```

`docker run`-komennon argumentit korvaavat `CMD`:n, ei `ENTRYPOINT`:ia. Debug override:

```bash
docker run --entrypoint bash myimage -c 'echo debug'
```

Exec-form:

```dockerfile
ENTRYPOINT ["./app"]
CMD ["--port", "8080"]
```

ENTRYPOINT+CMD yhdistelmä — Docker reference.

## Käytännössä
Wrapper-skripteissä: ENTRYPOINT migraatioille + init, CMD oletusparametreille. Dokumentoi miten image ylikirjoitetaan (`--entrypoint`).

[Lue lisää](https://docs.docker.com/reference/dockerfile/#entrypoint)
