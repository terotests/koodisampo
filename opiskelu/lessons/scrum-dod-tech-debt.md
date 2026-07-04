# Tekninen velka kasvaa. Miten DoD auttaa hallitsemaan sitä sprinttitasolla?

## Tilanne

Kolmen sprintin jälkeen koodikatselmoinnit paljastavat toistuvan kaavan: "TODO: refaktoroi myöhemmin", ohitetut testit ja nopeat korjaukset bez dokumentaatiota. Burndown on vihreä, mutta deploy-vaiheet hidastuvat ja bugit kasaantuvat.

Tuoteomistaja kysyy miksi velocity laskee, vaikka tarinoita merkitään Done. Tiimi tunnistaa teknisen velan — mutta sitä ei ole kirjattu minnekään, koska DoD:sta puuttuu laadun lattia.

## Ratkaisu

**DoD määrittelee minimilaadun — velkaa ei piiloteta Done-merkintään.** Selkeä DoD estää "valmis mutta rikki" -inkrementit ja pakottaa velan näkyväksi: jos kriteeriä ei täytetä, tarina ei ole Done.

DoD ei poista velkaa automaattisesti, mutta estää sen kasvun piilossa. Velka, joka jää tietoisesti korjaamatta, dokumentoidaan backlogiin — ei jätetä "valmiin" tarinan alle.

## Käytännössä

- Sisällytä DoD:hen konkreettiset laatuvaatimukset: ei ohitettuja testejä, katselmointi tehty, lintterit vihreät.
- Sprint planningissa varaa kapasiteettia velan maksuun — erillisinä backlog-tarinoina, ei DoD-poikkeuksina.
- Retrospektiivissä tarkista: merkitsimmekö Donea, vaikka tiesimme velasta? Päivitä DoD tarvittaessa.

[Lue lisää](https://github.com/janpetzold/scrum-best-practices)
