# Kaksi konetta ilmoittaa saman `.local`-hostname:n — palvelut vaihtelevat. Mikä on juurisyy?

## Tilanne

Lab-ympäristössä kaksi identtistä testipalvelinta on samassa verkossa. Molemmat hostname `testserver.local`. CI-pipeline ajaa integraatiotestejä:

```bash
curl http://testserver.local:9090/metrics | grep error_rate
# error_rate 0.01
curl http://testserver.local:9090/metrics | grep error_rate
# error_rate 0.89   # eri kone!
```

Metriikat vaihtelevat ajosta toiseen ilman koodimuutoksia. Palvelu "flappaa" kahden identtisen hostnamen välillä.

## Ratkaisu

Juurisyy on **hostname-konflikti mDNS:ssä** — hostnamet täytyy olla uniikit verkossa.

mDNS-protokolla olettaa, että jokainen `.local`-nimi on yksilöllinen linkkikerroksella. Kun kaksi konetta ilmoittaa saman hostname:n, molemmat vastaavat resoluutio-kyselyihin → client saa vuorotellen eri IP:n.

Korjaus:

```bash
sudo hostnamectl set-hostname testserver-02
sudo systemctl restart avahi-daemon
avahi-resolve -n testserver-02.local
```

mDNS vaatii uniikit hostnamet lähiverkossa — duplikaatti aiheuttaa epävakaan palvelun.

## Käytännössä

Provisioning-skripteissä generoi uniikki hostname (MAC-osoite, UUID). Älä deployaa identtistä levykuvaa ilman hostname-muutosta. Seuraa: `avahi-browse -a | grep testserver` — jos näkyy kaksi IP:tä samalle nimelle, konflikti on aktiivinen.

[Lue lisää](https://www.avahi.org/doctest/)
