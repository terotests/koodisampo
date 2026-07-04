# Tarinan acceptance criteria on 'toimii hyvin'. Sprint planningissa kehittäjät arvailevat. Mitä DoR vaatii?

## Tilanne

Tarinan hyväksymiskriteeri kuuluu: "toimii hyvin". Sprint planningissa kehittäjät kysyvät: mitä "hyvin" tarkoittaa? Kuinka monta käyttäjää? Mikä virheprosentti on ok? PO vastaa: "Tiedätte kyllä mitä tarkoitan."

Kehittäjät arvailevat ja tekevät oman tulkintansa. Sprintin lopussa PO ei hyväksy tulosta — "tämä ei toimi hyvin tarpeeksi hyvin." Työ alkaa uudestaan, sprint goal vaarantuu.

Subjektiiviset hyväksymiskriteerit eivät täytä Definition of Ready -vaatimusta testattavuudesta.

## Ratkaisu

**Testattavat hyväksymiskriteerit ennen sprinttiin ottamista.**

DoR vaatii, että hyväksymiskriteerit ovat selkeitä ja testattavia — ei adjektiiveja kuten "hyvin" tai "nopeasti". Kriteerit on muotoiltava niin, että kehittäjä, testaaja ja PO voivat yksimielisesti todeta, onko tarina Done.

Definition of Ready varmistaa, että tarina on ymmärrettävissä ja arvioitavissa.

## Käytännössä

Käytä Given-When-Then -muotoa tai numeerisia rajoja: "Virheprosentti alle 0,1 %", "Latausaika alle 3 s". Jos PO ei osaa tarkentaa, se on signaali jatkaa refinementia — ei ottaa tarinaa sprinttiin.

[Lue lisää](https://github.com/janpetzold/scrum-best-practices/blob/main/definition-of-ready.md)
