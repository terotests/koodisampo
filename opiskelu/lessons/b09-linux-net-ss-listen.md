# Portti 8080 on varattu mutta et tiedä mikä prosessi kuuntelee. Moderni työkalu?

## Tilanne

Kehittäjä käynnistää paikallisen web-palvelimen:

```
Error: listen EADDRINUSE: address already in use :::8080
```

Edellinen `npm run dev` jäi taustalle tai toinen projekti käyttää samaa porttia. Tarvit modernin työkalun prosessin tunnistamiseen.

## Ratkaisu

```bash
ss -tlnp | grep 8080
```

**ss -tlnp | grep 8080 — listenerit ja prosessit portissa.**

Esimerkki:

```
LISTEN 0 511 *:8080 *:* users:(("node",pid=12847,fd=21))
```

Sammuta prosessi tai vaihda portti konfiguraatiossa.

## Käytännössä

`ss` on oletus modernissa Linuxissa — älä asenna net-tools vain netstatia varten. macOS:lla vastaava on `lsof -i :8080`. Dev-ympäristössä pidä `package.json` portti konfiguroitavana välttääksesi jatkuvat konfliktit. CI:ssä orphaned-prosessit ratkaistaan `trap`illa tai erillisillä porteilla per job.

[Lue lisää](https://man7.org/linux/man-pages/man8/ss.8.html)
