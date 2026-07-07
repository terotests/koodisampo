# Code review ehdottaa ADD-komentoa, joka hakee tarballin URL:sta Dockerfile-buildissa. Mikä ongelma tässä on, ja mitä Dockerfile-komentoa käytät sen sijaan?

## Tilanne
Code review ehdottaa:

```dockerfile
ADD https://example.com/app.tar.gz /app/
```

ADD lataa, purkaa ja voi tehdä yllättäviä asioita automaattisesti — vaikea auditoida.

## Ratkaisu
**COPY on eksplisiittinen — ADD tekee automaattista purkua/URL:ia.**

```dockerfile
# Suositus: erilliset vaiheet
RUN curl -fsSL https://example.com/app.tar.gz -o /tmp/app.tgz
RUN tar xzf /tmp/app.tgz -C /app && rm /tmp/app.tgz

# Tai paikallinen COPY
COPY app.tar.gz /tmp/
RUN tar xzf /tmp/app.tar.gz -C /app
```

Docker docs: käytä COPY paitsi tar/URL tarpeissa.

## Käytännössä
ADD on ok local `.tar` + automaattinen purku, mutta URL-lataus tekee buildistä ei-deterministisen. Pin checksumit ulkoisille artefakteille.

[Lue lisää](https://docs.docker.com/reference/dockerfile/#copy)
