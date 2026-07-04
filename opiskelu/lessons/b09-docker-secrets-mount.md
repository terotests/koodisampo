# Tuotanto-Compose tarvitsee TLS-sertin ilman salaisuuden leimimistä imageen. Ratkaisu?

## Tilanne
Tuotanto-Compose tarvitsee TLS-sertin. Kovakoodattu cert repoon tai ENV imageen on hylätty security reviewissa — salaisuus ei saa päätyä image-layeriin.

## Ratkaisu
**Docker secrets tai read-only bind mount runtime-tiedostosta/vaultista TLS-sertille.**

```yaml
services:
  nginx:
    secrets:
      - tls_cert
      - tls_key

secrets:
  tls_cert:
    file: ./secrets/fullchain.pem
  tls_key:
    file: ./secrets/privkey.pem
```

Runtime secrets — Docker secrets Swarm/Compose.

## Käytännössä
Cert-manager / Let's Encrypt automatisoi uusinnan. `.gitignore` secrets-hakemisto. Rotate ennen vanhentumista.

[Lue lisää](https://docs.docker.com/compose/how-tos/use-secrets/)
