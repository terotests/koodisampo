# Tiimi sekoittaa ENTRYPOINT ja CMD — `docker run image bash` ei korvaa oletuskomentoa. Miksi?

## Tilanne
Tiimi ajaa `docker run myimage bash` odottaen pääsevänsä debug-shelliin, mutta sovellus käynnistyy silti. ENTRYPOINT ja CMD sekoittuvat.

## Ratkaisu
**ENTRYPOINT on pääkomento, CMD on oletusargumentit — exec-form selkeyttää.**

```dockerfile
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["server"]
# docker run myimage bash → entrypoint.sh server bash (shell-form riippuu)

# Debug override:
# docker run --entrypoint bash myimage -c 'echo debug'
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
