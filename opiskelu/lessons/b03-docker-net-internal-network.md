# Backend-API ei saa olla suoraan internetissä — vain reverse proxy ulos. Verkko?

## Tilanne

Arkkitehtuuri: Nginx reverse proxy vastaa ulkoisesta liikenteestä, FastAPI-backend vain sisäisessä verkossa. Nykyinen setup:

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
  api:
    image: myapi:latest
    ports:
      - "8000:8000"   # backend altistuu suoraan internetiin!
```

Turvallisuusauditissa backend on tavoitettavissa suoraan portista 8000 — ohittaen proxy:n autentikoinnin ja rate limitingin.

## Ratkaisu

**`internal: true` compose-verkossa — ei ulkoista reittiä.** Internal network eristää palvelut.

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    networks:
      - public
      - backend
  api:
    image: myapi:latest
    networks:
      - backend
    # Ei ports: — vain nginx tavoittaa api:n

networks:
  public:
  backend:
    internal: true
```

Internal-verkossa kontit kommunikoivat keskenään, mutta verkolla ei ole ulospäin menevää reittiä eikä host-porttimappingia backendille.

## Käytännössä

Internal-verkko ei estä backendin *saapuvaa* liikennettä nginxiltä — se estää suoran ulkoisen pääsyn ja outbound-internetin (esim. API ei voi tehdä ulkoisia HTTP-kutsuja ilman erillistä egress-verkkoa). Tarvittaessa erillinen `egress`-verkko ulkoisiin integraatioihin.

[Lue lisää](https://docs.docker.com/compose/compose-file/networks/)
