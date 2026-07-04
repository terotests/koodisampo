# Tuotanto-image sisältää koko Go toolchainin — image 1.2 GB. Miten pienennät?

## Tilanne
Go-tuotantoimage 1.2 GB — koko toolchain mukana runtime-stagessa. Pull ja deploy hidastuvat.

## Ratkaisu
**Multi-stage build erottaa toolchain-stagen ja minimal runtime-stagen (distroless).**

```dockerfile
FROM golang:1.22 AS builder
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o /bin/server .

FROM gcr.io/distroless/static-debian12
COPY --from=builder /bin/server /server
USER nonroot:nonroot
ENTRYPOINT ["/server"]
```

Multi-stage copies only artifacts — Docker docs multi-stage.

## Käytännössä
Distroless/scratch minimoi CVE-pinnan. Skannaa lopullinen image ennen deploya.

[Lue lisää](https://docs.docker.com/build/building/multi-stage/)
