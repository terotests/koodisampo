# Non-root user ei voi kirjoittaa /app/logs — permission denied tuotannossa. Dockerfile-korjaus?

**Ratkaisu:**

```dockerfile
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app/logs
USER appuser
```

Tai volume mount oikeilla UID/GID:illä. Älä kirjoita rootina ja vaihda käyttäjää jälkikäteen ilman oikeuksia.
