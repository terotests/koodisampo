# Toimistossa pitää löytää paikallinen tulostin ilman IP:tä. Avahi-komento?

## Tilanne

Uusi työntekijä tarvitsee tulostimen käyttöön. IT-tuki ei ole paikalla, eikä tulostimen IP-osoitetta ole dokumentoitu. Windows-koneet näkevät tulostimen automaattisesti, mutta Linux-työasema ei.

```bash
lpadmin -p OfficePrinter -E -v ???
# Missing URI — tarvitaan ipp://... tai socket://...
```

Käyttäjä tietää tulostimen olevan samassa lähiverkossa, mutta ei osaa etsiä sitä ilman IP:tä.

## Ratkaisu

Listaa mDNS-palvelut Avahi-browse-komennolla:

```bash
avahi-browse -a
```

Tai suoraan tulostimet:

```bash
avahi-browse -r _ipp._tcp
```

`-r` resolvaa hostname ja portin. Tulos kertoo URI:n, esim. `ipp://printer.local:631/ipp/print`. `avahi-browse` listaa mDNS-palvelut lähiverkossa.

Lisää tulostin CUPS:iin löydetyllä URI:lla:

```bash
lpadmin -p OfficePrinter -E -v ipp://printer.local/ipp/print -m everywhere
```

## Käytännössä

`-t _ipp._tcp` rajaa tulostuspalveluihin. Jos browse ei löydä mitään, tarkista `avahi-daemon` ja että tulostin tukee mDNS:ää. Useimmissa distroissa `avahi-utils` paketissa.

[Lue lisää](https://www.avahi.org/docs/)
