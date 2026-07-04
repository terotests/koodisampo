# API-kutsu epäonnistuu TLS:n jälkeen — epäilet palomuurin RST-paketteja. Nopein diagnostiikka?

## Tilanne

HTTPS-yhteys alkaa normaalisti, mutta katkeaa heti TLS-handshaken jälkeen tai ensimmäisen datan aikana. Sovellus näkee "Connection reset by peer".

```bash
curl -v https://api.internal.corp/data
# SSL connection established
# Recv failure: Connection reset by peer
```

Epäilet palomuurin tai IDS:n lähettävän RST-paketteja.

## Ratkaisu

Kaappaa liikenne:

```bash
sudo tcpdump -i any host api.internal.corp and port 443 -n
```

Etsi `[R.]` (RST) paketteja:

```
IP firewall.443 > client.54321: Flags [R.], seq ...
```

Vaihtoehto — tarkista yhteyden tila:

```bash
ss -tanp | grep 443
```

**tcpdump tai ss porttiin — näet RST-paketit ja TCP-liikenteen.**

## Käytännössä

RST palomuurista vs palvelimesta erottuu lähde-IP:llä tcpdumpissa. Deep packet inspection voi katkaista tietyt TLS-versiot — vertaa onnistuvaa ja epäonnistuvaa clientia. Tuotannossa rajaa kaappaus `-c 50` ja dokumentoi aikaleima incidenttikorttiin. Korjaa palomuurisääntö (stateful inspection, MTU/MSS) kun RST:n lähde on varmistettu.

[Lue lisää](https://man7.org/linux/man-pages/man8/tcpdump.8.html)
