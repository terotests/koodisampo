# Go-moduulien lataus hidastaa CI-buildia vaikka go.mod ei muutu. BuildKit-optimointi?

## Tilanne
Go CI-build lataa moduulit verkosta joka kerralla vaikka `go.mod` ei muutu — layer cache invalidoituu kontekstimuutoksista.

## Ratkaisu
**RUN --mount=type=cache,target=/go/pkg/mod go mod download nopeuttaa CI-buildia.**

```dockerfile
# syntax=docker/dockerfile:1
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download
COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go build -o /out/server .
```

BuildKit cache mounts — Docker build cache docs.

## Käytännössä
Yhdistä layer ordering + cache mount. Registry cache CI-jobien välillä kun runnerit vaihtuvat.

[Lue lisää](https://docs.docker.com/build/cache/)
