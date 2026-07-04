# Kaksi konetta ilmoittaa saman `.local`-nimen — palvelu flapping. Syy?

## Tilanne

Kaksi identtistä kehityskonetta on samassa WiFi-verkossa. Molemmat hostname `buildserver.local`. API-kutsu palauttaa satunnaisesti eri vastauksia:

```bash
while true; do curl -s http://buildserver.local:8080/whoami; echo; sleep 1; done
# build-A
# build-B
# build-A
```

SSH-yhteys `buildserver.local`:iin katkeaa kesken työn. Load balancer -tyyppinen käyttäytyminen ilman load balanceria on klassinen oire.

## Ratkaisu

Juurisyy on **hostname collision mDNS-verkossa** — nimet täytyy olla uniikit.

mDNS perustuu siihen, että jokainen `.local`-nimi on yksilöllinen linkkikerroksella. Kun kaksi konetta claimaa saman nimen, molemmat vastaavat kyselyihin vuorotellen → palvelu flappaa.

Korjaus:

```bash
# Koneella B — anna uniikki nimi
sudo hostnamectl set-hostname buildserver-b
sudo systemctl restart avahi-daemon
avahi-resolve -n buildserver-b.local
```

mDNS vaatii uniikit hostnamet — duplikaatti aiheuttaa epävakaan resoluution.

## Käytännössä

Kloonatut VM:t ja container-hostit ovat yleisin syy. Automatisoi hostname uniikiksi provisioning-vaiheessa (cloud-init, Ansible). Älä luota siihen että Avahi "korjaa" konfliktin hiljaisesti — se uudelleennimeää vain toisen laitteen, mikä rikkoo odotetut nimet.

[Lue lisää](https://wiki.archlinux.org/title/avahi)
