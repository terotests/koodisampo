# Containerissa shell puuttuu mutta prosessi elää — miten debuggaat sisältä?

## Tilanne
Distroless-image ei sisällä shelliä, mutta HTTP-palvelu vastaa. Tarvitset päästä prosessin namespaceen tarkistamaan konfiguraatiota tai verkkoyhteyttä.

## Ratkaisu
**docker debug tai debug-kontti jaetulla PID-namespacella.**

`docker exec -it mycontainer /bin/sh` epäonnistuu, koska imagessa ei ole shelliä. Docker Desktopissa `docker debug mycontainer` tuo oman työkalupakkinsa konttiin. Yleinen tapa on debug-kontti, joka liittyy kohteen namespaceihin:

```bash
docker run -it --pid=container:mycontainer --network=container:mycontainer \
  debian:bookworm-slim bash
```

Debug-kontti tuo omat työkalunsa ja näkee kohdeprosessin jaetussa PID- ja verkkonamespacessa (`/proc/1/root` näyttää kohteen tiedostot).

## Käytännössä
Tuotannossa rajoita `docker exec`-oikeudet. Distroless: käytä erillistä debug-imagea vain incident-tilanteissa.

[Lue lisää](https://docs.docker.com/reference/cli/docker/container/exec/)
