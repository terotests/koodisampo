# Kontti ei saa ulosverkkoyhteyttä — corporate proxy vaaditaan. Miten konfiguroit build?

## Tilanne

`docker build` epäonnistuu CI-agentilla:

```
failed to fetch https://registry.npmjs.org/... proxyconnect tcp: dial tcp: lookup proxy.corp on ...
```

Yritysverkossa kaikki ulospäin menevä HTTP/HTTPS kulkee proxy:n kautta. Build-vaiheessa Dockerfile tekee `RUN npm ci` ja `RUN apt-get update`, mutta build-prosessi ei tiedä proxystä.

## Ratkaisu

**HTTP_PROXY ja HTTPS_PROXY build-argit** välittävät proxyn Dockerfile-buildiin. Configure proxy for build — Docker docs proxy.

Dockerfile:

```dockerfile
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY
ENV HTTP_PROXY=$HTTP_PROXY HTTPS_PROXY=$HTTPS_PROXY NO_PROXY=$NO_PROXY

RUN npm ci
```

Build-komento:

```bash
docker build \
  --build-arg HTTP_PROXY=http://proxy.corp:8080 \
  --build-arg HTTPS_PROXY=http://proxy.corp:8080 \
  --build-arg NO_PROXY=localhost,127.0.0.1,.corp \
  -t myapp:latest .
```

Compose build:

```yaml
services:
  app:
    build:
      context: .
      args:
        HTTP_PROXY: http://proxy.corp:8080
        HTTPS_PROXY: http://proxy.corp:8080
```

Daemon-taso (`/etc/systemd/system/docker.service.d/proxy.conf`) kattaa myös image pull -operaatiot.

## Käytännössä

Älä jätä proxy-env muuttujia runtime-imageen — käytä multi-stage buildia ja nollaa ENV viimeisessä stagessa. `NO_PROXY` pitää sisältää sisäiset registryt (Harbor, Artifactory), jotta pull ei mene turhaan proxyn kautta.

[Lue lisää](https://docs.docker.com/engine/cli/proxy/)
