# CI-buildit ovat hitaita — BuildKit on päällä mutta cache ei jaeta jobien välillä. Ratkaisu?

## Tilanne
BuildKit on päällä CI:ssä, mutta jokainen job alkaa tyhjästä — layer cache ei jaa jobien välillä.

## Ratkaisu
**Registry cache backend buildx:llä — cache-to ja cache-from jakaa cachen CI-jobien välillä.**

```bash
docker buildx build \
  --cache-from type=registry,ref=myregistry/myapp:buildcache \
  --cache-to type=registry,ref=myregistry/myapp:buildcache,mode=max \
  -t myregistry/myapp:latest \
  --push .
```

BuildKit cache exporters — Docker build cache docs.

## Käytännössä
 `mode=max` cachettaa kaikki staget. GitHub Actions: `type=gha` cache backend. Mittaa build-aika ennen/jälkeen.

[Lue lisää](https://docs.docker.com/build/cache/backends/)
