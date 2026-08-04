# Sovellus tarvitsee portin 80, mutta sitä ei haluta ajaa rootina. Mikä vaihtoehto on tuotannossa yleisin?

## Tilanne

Bind porttiin &lt; 1024 vaatii perinteisesti privileged-oikeuksia. Sovelluksen ajaminen rootina laajentaa hyökkäyspintaa. Vaihtoehtoja: `setcap cap_net_bind_service`, `AmbientCapabilities=`, authbind, tai arkkitehtuurimuutos.

## Ratkaisu

Tuotannossa yleisin ja ylläpidettävin malli: **reverse proxy** (nginx, Caddy, Traefik) kuuntelee 80/443:a ja proxyttaa sovelluksen korkeaan porttiin (esim. 8080) non-root-käyttäjänä.

```
Internet → :443 (proxy) → 127.0.0.1:8080 (app, USER nonroot)
```

TLS, rate limit ja static files pysyvät proxyssä; sovellus pysyy yksinkertaisena.

## Käytännössä

- `AmbientCapabilities=CAP_NET_BIND_SERVICE` / `setcap` toimivat, mutta lisäävät capability-pintaa itse binääriin.
- Socket activation (`systemd.socket`) on hyvä vaihtoehto ilman root-sovellusta.
- Kontissa: dropaa capabilities, älä aja rootina "koska portti 80".

[Lue lisää](https://man7.org/linux/man-pages/man7/capabilities.7.html)
