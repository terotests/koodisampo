# API-kutsut timeouttaavat — epäilet palomuuria. Nopein tapa nähdä SYN-paketit porttiin 443?

## Tilanne

Sovellus yrittää HTTPS-yhteyttä ulkoiseen API:in:

```bash
curl -m 5 https://api.example.com/v1/data
# curl: (28) Connection timed out
```

TCP-yhteys jää jumiin SYN-vaiheeseen — epäilet että palomuuri tiputtaa paketteja ennen kuin palvelin vastaa. Tarvit nopean näkymän liikenteeseen ilman Wireshark-asennusta palvelimelle.

## Ratkaisu

```bash
sudo tcpdump -i any port 443 -n
```

`-i any` kaappaa kaikilta rajapinnoilta, `port 443` suodattaa HTTPS:n, `-n` jättää DNS-käännökset pois.

Näet SYN-paketit lähtevän mutta ei SYN-ACK:ia, jos palomuuri estää:

```
IP client.54321 > api.example.com.443: Flags [S], seq ...
# ei vastaavaa SYN-ACK
```

**tcpdump suodattaa liikennettä — vianetsintä ennen/so jälkeen firewallin.**

## Käytännössä

Tuotannossa rajoita kaappaus `-c 100` tai `-w capture.pcap` lyhyeen ikkunaan. Vertaa tulosta palomuurin sääntöihin (`nft list ruleset`, `iptables -L -n -v`). Muista että `-i any` voi näyttää saman paketin useaan kertaan — tarkista suunta ja rajapinta.

[Lue lisää](https://man7.org/linux/man-pages/man8/tcpdump.8.html)
