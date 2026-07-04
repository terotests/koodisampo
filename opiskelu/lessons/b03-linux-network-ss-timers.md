# Palvelin jää odottamaan CLOSE_WAIT-yhteyksiä — muisti kuluu. Diagnostiikka?

## Tilanne

Node.js-palvelimen muistikäyttö kasvaa hitaasti. Uudet yhteydet hidastuvat. Epäilet vuotavia TCP-yhteyksiä, joita sovellus ei sulje oikein.

```bash
free -h
# used memory climbing
```

## Ratkaisu

```bash
ss -tanp
# tai tarkemmin timerit:
ss -tanp | grep CLOSE-WAIT
```

`-t` TCP, `-a` kaikki tilat, `-n` numeeriset, `-p` prosessit. `-o` näyttää timer-tiedot (keepalive, retransmit):

```bash
ss -tanpo | grep CLOSE-WAIT
```

**ss on moderni työkalu socket-diagnostiikkaan** — korvaa `netstat` ja näyttää tilat selkeämmin.

Laske yhteydet tiloittain:

```bash
ss -tan | awk 'NR>1 {print $1}' | sort | uniq -c
```

## Käytännössä

Paljon CLOSE_WAIT tarkoittaa yleensä sovellusbugia — palvelin sai FIN:n mutta ei sulje socketia. Korjaus on koodissa (`close()` / connection pool). Väliaikaisesti restart auttaa, mutta seuraa trendiä Prometheus-metriikalla tai cron-ajolla `ss`-laskennalla. TIME_WAIT on normaalia; CLOSE_WAIT ei pitäisi kasaantua.

[Lue lisää](https://man7.org/linux/man-pages/man8/ss.8.html)
