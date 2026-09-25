# GPS-satelliitti kiertää maan kahdesti sideraalisen vuorokauden aikana. Mitä siitä seuraa käytännössä?

## Tilanne

Mittaat GNSS-dataa samalla paikalla useana päivänä. Huomaat, että sama satelliittikuvio ja samat multipath-häiriöt toistuvat päivästä toiseen — mutta joka päivä vähän aiemmin kuin edellisenä.

## Ratkaisu

GPS-satelliitin kiertoaika on puolet **sideraalisesta vuorokaudesta** (maan pyörähdys tähtien suhteen, noin 23 h 56 min). Kahden kierroksen jälkeen satelliitti on radallaan samassa kohdassa ja maa on pyörähtänyt täyden kierroksen tähtien suhteen. Siksi:

- satelliitin **maanpäällinen rata toistuu** joka päivä
- sama satelliittigeometria (ja DOP) palaa samasta paikasta katsottuna **noin 4 minuuttia aiemmin** kuin edellisenä päivänä (aurinkovuorokausi on sideraalista pidempi)

## Käytännössä

- **Multipath** riippuu satelliitin suunnasta suhteessa heijastaviin pintoihin, joten se toistuu päivittäin samalla aikasiirrolla. Tätä käytetään "sideral filtering" -menetelmässä, jossa edellisen päivän virhekuvio vähennetään.
- **Mittausten suunnittelu:** hyvän geometrian ikkuna siirtyy päivittäin noin 4 minuuttia aikaisemmaksi.
- Galileo toistaa ratansa vasta 10 sideraalisen vuorokauden välein, joten sillä vastaava kuvio on eri.

[Lue lisää](https://gssc.esa.int/navipedia/index.php/GPS_Space_Segment)
