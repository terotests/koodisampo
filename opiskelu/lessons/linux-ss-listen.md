# Mikä prosessi kuuntelee porttia 8080? Nopein moderni komento?

## Tilanne

Deploy-skripti kaatuu viestiin `bind: address already in use`. Uusi palvelu pitäisi kuunnella porttia 8080, mutta jokin toinen prosessi on jo siellä. `lsof` ei ole asennettuna, ja vanha `netstat -tlnp` toimii hitaasti tai vaatii root-oikeudet prosessinimen näyttämiseen.

Tarvit nopean vastauksen: kuka varasi portin?

## Ratkaisu

```bash
ss -tlnp | grep 8080
```

Esimerkkituloste:

```
LISTEN 0 128 0.0.0.0:8080 0.0.0.0:* users:(("java",pid=4521,fd=45))
```

**ss näyttää socketit ja prosessit — korvaa vanhan netstat:in.** Liput:
- `-t` TCP
- `-l` vain LISTEN-tilassa olevat
- `-n` numeeriset portit (ei DNS-käännöstä)
- `-p` prosessitiedot (vaatii usein rootin)

UDP-kuuntelijalle: `ss -ulnp | grep 8080`

## Käytännössä

Incident-tilanteissa tallenna tuloste ennen kuin tapat prosessin — se auttaa post-mortemissa. Jos `-p` ei näytä prosessia, aja rootina tai tarkista `hidepid`-asetus procfs:ssä. `ss` kuuluu iproute2-pakettiin ja on oletus modernissa Linuxissa; pidä se ensimmäisenä työkaluna porttikonfliktien selvittämisessä.

[Lue lisää](https://man7.org/linux/man-pages/man8/ss.8.html)
