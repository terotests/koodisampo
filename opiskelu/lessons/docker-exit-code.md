# Kontti poistuu heti käynnistyksen jälkeen. Ensimmäinen diagnosoitava asia?

## Tilanne
Kontti käynnistyy, `docker ps` näyttää sen hetken, ja sitten se katoaa. `docker ps -a` paljastaa tilan Exited (0):

```bash
docker run myapp:latest
# Hetken päästä:
docker ps -a
# CONTAINER ID   STATUS
# abc123         Exited (0) 2 seconds ago
```

Dockerfile ajaa esimerkiksi shell-skriptin, joka käynnistää daemonin taustalle (&) ja skripti itsensä päättyy heti. Kontti elää vain niin kauan kuin PID 1 -prosessi on käynnissä etualalla.

## Ratkaisu
**PID 1 -prosesi päättyy heti kun se daemonisoituu taustalle.**

Korjaa niin, että pääprosessi pysyy etualalla:

```dockerfile
# Väärin — parent exit → kontti kuolee
CMD ["./start.sh"]
# start.sh: ./app &

# Oikein — exec korvaa shellin prosessilla
CMD ["./app"]
```

Tai käytä init-wrapperia zombien ja signaalien hallintaan:

```bash
docker run --init myapp:latest
```

Kontti elää vain kun PID1 pyörii etualalla (tai init wrapper).

## Käytännössä
Tarkista aina `docker logs` ja `docker inspect --format='{{.State.ExitCode}}'`. Entrypoint-skripteissä käytä exec-muotoa viimeisessä komennossa, jotta signaalit (SIGTERM) menevät oikeaan prosessiin.

[Lue lisää](https://docs.docker.com/engine/containers/start-containers-automatically/)
