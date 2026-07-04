# Multi-stage Dockerfile — haluat buildaa vain test-stage CI:ssä. Miten?

## Tilanne
Multi-stage Dockerfile sisältää build-, test- ja production-staget. CI haluaa ajaa vain test-stagen ilman lopullisen imagen buildausta.

## Ratkaisu
**docker build --target test-stage valitsee vain halutun multi-stage-vaiheen.**

```dockerfile
FROM node:20 AS build
...
FROM node:20 AS test
RUN npm test
FROM gcr.io/distroless/nodejs20-debian12 AS production
...
```

```bash
docker build --target test -t myapp:test .
```

Multi-stage builds target — Docker docs multi-stage.

## Käytännössä
Nimeä staget selkeästi. CI: test-stage PR:issä, production-stage vain main-branchilla.

[Lue lisää](https://docs.docker.com/build/building/multi-stage/#name-your-build-stages)
