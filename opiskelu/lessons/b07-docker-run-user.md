# Security audit: kontti ajaa rootina. Miten korjaat Dockerfilessa?

## Tilanne
Security audit: `docker exec myapp id` → root. Dockerfile ei määritä käyttäjää.

## Ratkaisu
**Luo non-root-käyttäjä ja aseta USER ennen CMD:ä Dockerfilessa.**

```dockerfile
RUN adduser -D -u 10001 app
COPY --chown=app:app . /app
USER app
WORKDIR /app
CMD ["./server"]
```

Run as non-root user — Docker security best practices.

## Käytännössä
Tarkista kirjoitusoikeudet volumeihin. Portit ≥1024 ilman CAP_NET_BIND_SERVICE.

[Lue lisää](https://docs.docker.com/develop/security-best-practices/)
