# npm ci kestää 5 min jokaisessa buildissa vaikka package-lock ei muutu. BuildKit-parannus?

**Ratkaisu:** BuildKit cache mount:

```dockerfile
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline
```

Erottele myös `COPY package*.json` ennen lähdekoodia — layer-cache npm:lle.
