# Security review: kontti ei tarvitse root-oikeuksia eikä NET_RAW. Hardening?

## Tilanne
Security review: kontti ajaa rootina ja sillä on kaikki Linux-capabilities, mukaan lukien `NET_RAW` jota ei tarvita.

## Ratkaisu
**USER nonroot + cap_drop: [ALL] ja cap_add vain tarvittavat.**

```yaml
services:
  api:
    user: "10001:10001"
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

```bash
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE --user app myapp
```

Least privilege: non-root user + drop capabilities — Docker security docs.

## Käytännössä
Listaa capabilities joita sovellus oikeasti tarvitsee. `NET_RAW` pois ellei ping/tcpdump tarpeen. Testaa sovellus cap_drop:n jälkeen.

[Lue lisää](https://docs.docker.com/engine/security/)
