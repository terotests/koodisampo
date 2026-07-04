# Go-binary image on 1.2 GB koska build-työkalut mukana. Miten pienennät?

## Tilanne
Go-binary image on 1.2 GB, koska `FROM golang` sisältää koko toolchainin runtime-stagessa. Registry-kustannukset ja pull-ajat kasvavat.

## Ratkaisu
**Multi-stage build erottaa builder- ja runtime-stagen imagessa.**

```dockerfile
FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /out/server ./cmd/server

FROM alpine:3.19
RUN adduser -D app
COPY --from=build /out/server /usr/local/bin/server
USER app
CMD ["server"]
```

Multi-stage kopioi vain artifactin lopulliseen imageen — pienempi attack surface.

## Käytännössä
Harkitse distroless tai scratch runtime Go-static binääreille. Image-koko putoaa usein alle 20 MB.

[Lue lisää](https://docs.docker.com/build/building/multi-stage/)
