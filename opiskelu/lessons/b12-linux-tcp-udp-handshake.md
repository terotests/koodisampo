# Mikä ero TCP:n ja UDP:n välillä on yhteyden muodostuksessa?

## Tilanne

Tiimi debuggaa verkko-ongelmaa ja sekoittaa TCP- ja UDP-käyttäytymisen — odottaa kättelyä UDP-DNS:lle tai stateful-sessiota ilman conntrackia. Perusprotokollaero selventää diagnostiikan.

## Ratkaisu

**TCP** on yhteyspohjainen:

1. Asiakas lähettää **SYN**
2. Palvelin vastaa **SYN-ACK**
3. Asiakas lähettää **ACK**
4. Vasta sitten data

**UDP** lähettää **datagrammeja suoraan** ilman kättelyä — ei takuuta toimituksesta tai järjestyksestä.

```
TCP:  SYN → SYN-ACK → ACK → data
UDP:  data (suoraan)
```

## Käytännössä

DNS, DHCP ja NTP käyttävät UDP:ta; HTTP/HTTPS ja SSH TCP:tä. Palomuurin stateful-säännöt toimivat TCP:ssä luontevammin. `ss -tn` näyttää TCP-tilat (ESTABLISHED, CLOSE-WAIT); `ss -un` UDP-socketit ilman sessiotilaa. TLS on protokollakerros TCP:n päällä — ei UDP:n pakollinen osa.

[Lue lisää](https://datatracker.ietf.org/doc/html/rfc793)
