# Tuotanto käyttää `FROM node:latest` — eilen build rikkoutui. Korjaus?

## Tilanne
 `FROM node:latest` — eilen build toimi, tänään CI rikkoutui kun latest päivittyi uuteen major-versioon.

## Ratkaisu
**Pin digest tai semver-tag (node:20.11-alpine) — toistettava ja vakaa build.**

```dockerfile
FROM node:20.11-alpine3.19
# tai
FROM node@sha256:abc123...
```

Pin base image version — Docker best practices.

## Käytännössä
Renovate/Dependabot päivittää pinnejä kontrolloidusti. CI skannaa base-imagen CVE:t.

[Lue lisää](https://docs.docker.com/build/building/best-practices/)
