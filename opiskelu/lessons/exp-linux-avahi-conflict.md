# Kaksi laitetta claimaa saman hostname.local — verkko sekoaa. Miten Avahi ratkaisee konfliktin?

## Tilanne

Kaksi kehityskonetta on kloonattu samasta levykuvasta. Molemmat ilmoittavat verkossa nimen `devbox.local`. Kollega yhdistää API:in, mutta vastaus vaihtelee — toisinaan oikea kone, toisinaan väärä:

```bash
curl http://devbox.local:3000/health
# {"host": "devbox-A"}  ... seuraavalla kerralla {"host": "devbox-B"}
avahi-resolve -n devbox.local
# devbox.local   192.168.1.42
# devbox.local   192.168.1.87   # vuorotellen
```

Palvelu "flappaa" ja SSH-yhteydet katkeavat satunnaisesti. Verkko on sekaisin duplikaattinimen takia.

## Ratkaisu

Avahi ratkaisee konfliktin **mDNS probingilla** ja **uudelleennimeämisellä** — esim. `hostname-2.local`.

Ennen nimen claimausta laite lähettää probing-paketteja varmistaakseen ettei nimi ole jo käytössä. Jos konflikti havaitaan, myöhemmin liittynyt laite valitsee vaihtoehtoisen nimen:

```
devbox.local      → ensimmäinen laite (voittaa)
devbox-2.local    → toinen laite (uudelleennimetty automaattisesti)
```

Tarkista aktiivinen nimi:

```bash
avahi-resolve-host-name $(hostname).local
hostnamectl status
```

mDNS probing estää duplikaattinimet — Avahi noudattaa RFC 6762:ta.

## Käytännössä

Älä luota siihen että kloonatut imaget jakavat saman hostname:n. Aseta uniikki hostname ennen verkkoon liittymistä (`hostnamectl set-hostname devbox-b`). Golden image -prosessissa regeneroi machine-id ja hostname. Seuraa lokeja: `journalctl -u avahi-daemon`.

[Lue lisää](https://www.avahi.org/)
