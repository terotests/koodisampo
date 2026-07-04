# Kehityskone ei löydä palvelua `printer.local` — mDNS pitäisi toimia. Ensimmäinen tarkistus?

## Tilanne

Kehityskone ei löydä tulostinta `printer.local`. DNS-resoluutio epäonnistuu:

```bash
getent hosts printer.local
# (tyhjä)
curl http://printer.local
# Could not resolve host
```

Avahi-daemon pyörii (`systemctl status avahi-daemon` OK), mutta palvelu ei ole tavoitettavissa. Ennen NSS- tai palomuuridiagnostiikkaa pitää varmistaa: onko palvelu ollenkaan ilmoitettu verkossa?

## Ratkaisu

Ensimmäinen tarkistus — onko palvelu ilmoitettu mDNS-verkossa:

```bash
avahi-browse -a
```

Tai kohdennetusti tulostimet:

```bash
avahi-browse -rt _ipp._tcp
```

Jos browse ei näytä `printer.local`:ia, ongelma on tulostimessa tai verkossa — ei client-koneessa. Jos browse näyttää palvelun, testaa resoluutio:

```bash
avahi-resolve -n printer.local
```

Avahi implements mDNS/DNS-SD — browse kertoo onko palvelu olemassa, resolve testaa nimen.

## Käytännössä

Järjestä diagnostiikka: (1) daemon käynnissä, (2) browse näkee palvelun, (3) resolve toimii, (4) NSS/getent toimii, (5) sovellus yhdistää. Skipaamalla browse saatat korjata client-puolta kun palvelu ei ole ilmoitettu ollenkaan.

[Lue lisää](https://www.avahi.org/)
