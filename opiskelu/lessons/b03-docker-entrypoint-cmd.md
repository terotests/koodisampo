# `docker run myimage bash` ei käynnistä bashia odotetusti, vaikka CMD Dockerfilessa on `['node','server.js']`. Mikä Dockerfile-käytäntö selittää tämän?

## Tilanne
Tiimi ajaa `docker run myimage bash` odottaen pääsevänsä debug-shelliin, mutta sovellus käynnistyy silti. ENTRYPOINT ja CMD sekoittuvat.

## Ratkaisu
**ENTRYPOINT on pääkomento, CMD on oletusargumentit — exec-form selkeyttää.**

```dockerfile
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["server"]

# docker run myimage bash
# → /docker-entrypoint.sh bash
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
