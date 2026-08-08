# Mihin RINEX-tiedostoja käytetään?

## Tilanne

Mittauskampanja pitää prosessoida toimistolla. Minkä tiedoston kenttä-GNSS yleensä tuottaa?

## Ratkaisu

**RINEX** (Receiver Independent Exchange Format) tallentaa havainnot (C/L/D/S) ja navigointiviestit vastaanotinriippumattomasti. Versiot 2.x/3.x/4.x — 3+ tukee monikonstellaatiota selkeämmin. Jälkikäsittely (static, PPK, PPP) lukee RINEX:n.

## Käytännössä

Tallenna myös metatiedot: antennin tyyppi, ARP-korkeus, likimääräinen paikka. Ilman niitä senttitaso kärsii.


[Lue lisää](https://files.igs.org/pub/data/format/rinex305.pdf)
