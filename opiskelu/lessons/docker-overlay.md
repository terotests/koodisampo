# Mikä verkkotyyppi yhdistää kontit eri Docker-hostien välillä klusterissa?

## Tilanne

Sinulla on kolme palvelinta Swarm-klusterissa tai Kubernetes-ympäristössä, jossa kontit ajetaan eri nodeilla. Frontend-kontti hostilla A pitää tavoittaa backend-kontin hostilla B hostnameilla `api`, ikään kuin ne olisivat samassa lähiverkossa.

Oletusbridge toimii vain yhdellä hostilla. Port mapping skaalautuu huonosti palvelujen väliseen liikenteeseen, ja staattiset IP:t rikkoutuvat uudelleenkäynnistyksissä. Tarvitset verkkokerroksen, joka yhdistää kontit eri fyysisten koneiden välillä.

## Ratkaisu

**Overlay (VXLAN) -verkko** kytkee kontit eri hostien välillä klusterissa. Overlay rakentaa monen hostin verkon (esim. Swarm/K8s CNI).

Swarm-esimerkki:

```bash
docker network create -d overlay my_overlay
docker service create --name api --network my_overlay myapi:latest
docker service create --name web --network my_overlay myweb:latest
```

Liikenne kulkee VXLAN-tunnelien kautta hostien välillä; embedded DNS toimii overlay-verkossa kuten bridge-verkossa yhdellä hostilla.

## Käytännössä

Overlay vaatii klusterin (Swarm mode tai vastaava orchestrator). Tuotannossa Kubernetes käyttää yleensä CNI-plugineja (Calico, Cilium), mutta Docker Swarmissa overlay on oikea valinta monen hostin palveluverkkoihin. Varmista palomuurisäännöt UDP 4789 (VXLAN) hostien välillä.

[Lue lisää](https://docs.docker.com/network/drivers/overlay/)
