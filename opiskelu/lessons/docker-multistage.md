# Tuotantoimage on 2 GB koska mukana kääntäjä ja dev-työkalut. Ratkaisu?

## Tilanne
Go-sovelluksen Dockerfile käyttää virallista `golang`-imagea runtimeen:

```dockerfile
FROM golang:1.22
COPY . .
RUN go build -o app .
CMD ["./app"]
```

Tuotantoimage on ~2 GB — mukana koko kääntäjä, git ja dev-työkalut. Turvallisuusreview nostaa attack surfacen.

## Ratkaisu
**Multi-stage build kopioi vain binäärin viimeiseen runtime-stageen.**

```dockerfile
FROM golang:1.22 AS builder
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -o /app

FROM gcr.io/distroless/static-debian12
COPY --from=builder /app /app
USER nonroot:nonroot
ENTRYPOINT ["/app"]
```

Multi-stage erottaa build- ja runtime-ympäristöt — pienempi attack surface.

## Käytännössä
Nimeä staget (`AS builder`) ja testaa vain test-stage CI:ssä (`docker build --target test`). Lopullinen image kannattaa skannata (Trivy, Docker Scout).

[Lue lisää](https://docs.docker.com/build/building/multi-stage/)
