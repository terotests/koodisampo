# Usean hostin Swarm-klusterissa tarvitset jaetun volumen. Vaihtoehto local driverille?

## Tilanne

Docker Swarm -klusterissa kolme nodea pyörittää stateful-palvelua:

```yaml
services:
  api:
    volumes:
      - appdata:/data
    deploy:
      replicas: 3

volumes:
  appdata:
    driver: local
```

`local`-driver luo volumen vain yhdelle hostille. Kun Swarm siirtää kontin toiselle nodelle, volume ei seuraa mukana — kontti käynnistyy tyhjällä datalla. Paikallinen storage ei skaalaudu klusteriin.

## Ratkaisu

Käytä **NFS-, Ceph- tai cloud volume pluginia** jaetulle storagelle:

```yaml
volumes:
  appdata:
    driver: local
    driver_opts:
      type: nfs
      o: addr=nfs.example.com,rw,nfsvers=4
      device: ":/export/appdata"
```

Volume plugins for multi-host — NFS-driver, RexRay (AWS EBS), Azure File Storage tai Ceph RBD mahdollistavat jaetun volumen usealle Swarm-nodelle. Kontti voi siirtyä nodejen välillä ja nähdä saman datan.

## Käytännössä

Swarmissa stateful-palvelut vaativat jaetun storagen tai sticky placement -rajoituksen. Tuotannossa harkitse Kubernetes + CSI-driveria tai managed storagea (EBS, Azure Disk) ennen itse ylläpidettyä NFS:ää. Testaa kirjoitus useasta hostista samanaikaisesti — sovelluksen oma synkronointi ratkaisee kilpailutilanteet.

[Lue lisää](https://docs.docker.com/engine/storage/volumes/#use-a-volume-driver)
