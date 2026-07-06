# Palvelimen muisti kasvaa — epäilet vuotavia TCP-yhteyksiä joita sovellus ei sulje. ss-suodatin?

## Tilanne

Palvelimen RAM kasvaa hitaasti viikkojen aikana. Uudet yhteydet hidastuvat. Epäilet sovellusbugia: remote sulki yhteyden, mutta paikallinen prosessi jätti socketin **CLOSE-WAIT**-tilaan.

## Ratkaisu

```bash
# -t = TCP, -a = kaikki tilat (ei vain LISTEN), -n = numeerinen
# state close-wait = remote sulki (FIN), paikallinen prosessi ei sulkenut socketia
ss -tan state close-wait

# -p = prosessi/PID joka pitää socketin auki
ss -tan state close-wait -p
```

Laske:

```bash
ss -tan state close-wait | wc -l   # montako vuotavaa yhteyttä
```

**CLOSE-WAIT** = remote lähetti FIN, paikallinen sovellus ei kutsunut `close()` — ss states.

## Käytännössä

Korjaa sovellus — kernel ei sulje CLOSE-WAIT:ia puolestasi. `-p` näyttää prosessin PID:n. Vertaa `ss -o state established` normaalitilanteeseen. Muistivuoto voi olla myös TIME-WAIT määrässä — tarkista `ss -s` yhteenveto.

[Lue lisää](https://man7.org/linux/man-pages/man8/ss.8.html)
