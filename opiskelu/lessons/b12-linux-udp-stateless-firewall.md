# DNS UDP:53 toimii ulospäin mutta vastaus ei palaudu sisään — NAT/palomuuri. Tyypillinen UDP-ero TCP:hen?

## Tilanne

Resolvattu DNS-kysely lähtee palvelimelta ulos UDP:53, mutta vastaus ei palaudu. TCP-yhteydet saman palvelimen kautta toimivat. NAT/palomuuri on stateful.

UDP on **yhteydetön** — toisin kuin TCP, sillä ei ole kolmen suun kättelyä jolla palomuuri voisi helposti seurata sessiota.

## Ratkaisu

Palomuurissa tarvitaan joko:

- **conntrack/stateful** sääntö joka sallii vastausliikenteen alkuperäiseen lähteeseen
- tai eksplisiittinen allow molempiin suuntiin

nftables-esimerkki:

```bash
nft add rule inet filter input udp dport 1024-65535 ct state established,related accept
```

**UDP vaatii erillisen palautuspolun** — ei syn-ack -sessiota kuten TCP:ssä.

## Käytännössä

DNS käyttää usein UDP:ta, isot vastaukset TCP:ta. `ss -uln` näyttää paikalliset kuuntelijat, ei NAT-konfiguraatiota. Testaa `dig @8.8.8.8 example.com` tcpdumpilla molemmissa suunnissa. Muista että `ss -ltn` on TCP LISTEN — ei liity UDP return path -ongelmaan.

[Lue lisää](https://man7.org/linux/man-pages/man8/nft.8.html)
