# API-kutsu timeoutaa tuotannossa — epäilet pakettihäviötä. Nopea kaappaus?

## Tilanne

Tuotantopalvelin kutsuu ulkoista API:a. Osa pyynnöistä timeouttaa satunnaisesti — ei selkeää virhettä sovelluslogissa. Epäilet pakettihäviötä, MTU-ongelmaa tai palomuurin tiputusta.

```bash
curl -m 10 https://api.example.com/v2/orders
# timeout ~30% ajasta
```

Tarvit pcap-tiedoston analyysiin Wiresharkilla.

## Ratkaisu

```bash
sudo tcpdump -i eth0 host api.example.com -w capture.pcap
```

Toista ongelma toisessa terminaalissa curlilla, pysäytä tcpdump Ctrl+C:llä.

**tcpdump -i eth0 host api.example.com -w capture.pcap** — tallentaa paketit analyysiin.

Rajaa liikenne:

```bash
tcpdump -i eth0 host api.example.com and port 443 -w capture.pcap -c 500
```

## Käytännössä

Tuotannossa kaappaa lyhyesti ja varmista GDPR/compliance — pcap voi sisältää arkaluonteista dataa. `-s 0` koko paketit vs oletus snapshot. Analysoi tcpdumpissa retransmission (`tcp.analysis.retransmission` Wiresharkissa). MTU-ongelmat näkyvät usein suurissa TLS-recordeissa. Poista capture-tiedosto incidentin jälkeen.

[Lue lisää](https://man7.org/linux/man-pages/man1/tcpdump.1.html)
