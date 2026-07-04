# Kontissa zombie-prosessit kasaantuvat — parent ei siivoa child-prosesseja. Mitä run-optiota?

## Tilanne
Pitkään ajettu kontti kerää zombie-prosesseja (`ps aux | grep defunct`). Parent-prosessi (PID 1) ei kutsu `wait()`:ia child-prosesseille.

## Ratkaisu
**--init käynnistää tini-init-prosessin joka siivoaa zombie-prosessit.**

```bash
docker run -d --init myapp:latest
```

Tai Dockerfile:

```dockerfile
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["./app"]
```

docker run --init — Docker docs init process.

## Käytännössä
 `--init` riittää useimmiten. Shell-skriptit PID 1:nä ovat yleinen zombie-lähde — käytä `exec` viimeisessä komennossa.

[Lue lisää](https://docs.docker.com/reference/cli/docker/container/run/#init)
