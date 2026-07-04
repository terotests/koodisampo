# Kubernetes-pod käynnistyy, mutta sovellus ei vielä vastaa HTTP-pyyntöihin. Orkestrointi lähettää liikenteen liian aikaisin. Mikä auttaa?

## Tilanne

Kubernetes-deployment käynnistää uuden pod-version:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  template:
    spec:
      containers:
        - name: api
          image: myapi:2.1.0
          ports:
            - containerPort: 8080
```

Pod on `Running`-tilassa 10 sekunnin kuluttua — Kubernetes merkitsee sen valmiiksi ja Service alkaa ohjata liikenteen siihen. Sovellus lataa kuitenkin konfiguraatiota, yhdistää tietokantaan ja warm-upaa cachea vielä 30 sekuntia. Ensimmäiset pyynnöt saavat 502/503-virheitä.

## Ratkaisu

Määritä **readiness probe** — se ohjaa liikenteen vasta kun sovellus on valmis palvelemaan:

```yaml
containers:
  - name: api
    image: myapi:2.1.0
    ports:
      - containerPort: 8080
    readinessProbe:
      httpGet:
        path: /health/ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
      failureThreshold: 6
```

Liveness vs readiness — readiness estää liikenteen ennen valmiutta. Pod pysyy `Running`-tilassa, mutta Service ei ohjaa siihen liikennettä ennen kuin probe onnistuu. Liveness probe erikseen tarkistaa ettei kontti jumittunut.

## Käytännössä

Toteuta erilliset `/health/live` ja `/health/ready` endpointit — readiness tarkistaa riippuvuudet (DB, cache), liveness vain prosessin elossaolon. Startup probe hidastetuille käynnistyksille. Aseta `failureThreshold` ja `periodSeconds` realistisesti — liian aggressiivinen probe restarttaa podin turhaan.

[Lue lisää](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/)
