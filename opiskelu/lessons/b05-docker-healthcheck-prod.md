# Orkestraattori ei huomaa jumiutunutta Node-prosessia — kontti on 'running' mutta ei vastaa. Lisäät?

## Tilanne
Node-prosessi elää (`docker ps` = Up), mutta event loop on jumissa — HTTP ei vastaa. Orkestraattori ei huomaa ongelmaa.

## Ratkaisu
**HEALTHCHECK curl localhost /health endpointiin.**

```dockerfile
HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD curl -f http://127.0.0.1:3000/health || exit 1
```

HEALTHCHECK määrittää konttiterveyden — Dockerfile reference.

## Käytännössä
/health tarkistaa DB-yhteyden. Älä käytä pelkkää `pidof node` — se ei havaitse jumiutumista.

[Lue lisää](https://docs.docker.com/reference/dockerfile/#healthcheck)
