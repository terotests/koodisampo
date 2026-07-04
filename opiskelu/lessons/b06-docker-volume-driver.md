# Tuotanto tarvitsee NFS-pohjainen persistent storage kontteille. Miten määrität volume?

## Tilanne

Kontit pyörivät usealla hostilla (Swarm/Kubernetes/Docker Compose). Paikallinen `bind mount` ei skaalaudu — data pitää olla jaettu. Tuotannossa NFS-palvelin tarjoaa keskitetyn tallennuksen useille compose-palveluille.

## Ratkaisu

Määritä NFS-volume driver:

```yaml
volumes:
  appdata:
    driver: local
    driver_opts:
      type: nfs
      o: addr=nfs.example.com,rw,nfsvers=4
      device: ":/export/appdata"

services:
  api:
    volumes:
      - appdata:/data
```

`addr=` on NFS-palvelimen osoite. `device` on export-polku palvelimella. Mount näkyy kontissa `/data`.

## Käytännössä

Varmista NFS-exportin oikeudet (squash, uid/gid) vastaavat kontin käyttäjää. Testaa kirjoitus useasta hostista samanaikaisesti — NFS locking ja sovelluksen oma synkronointi. Tuotannossa harkitse managed storage (EBS, Azure Files) ennen itse ylläpidettyä NFS:ää.

[Lue lisää](https://docs.docker.com/engine/storage/drivers/)
