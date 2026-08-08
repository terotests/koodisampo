# Miksi kantoaaltovaihe (carrier phase) mahdollistaa senttitason paikannuksen?

## Tilanne

RTK lupaa senttejä, koodivastaanotin metrejä. Mikä mittaus tekee eron?

## Ratkaisu

**Kantoaaltovaihe** mittaa signaalin faasia ~millimetritarkkuudella, mutta sisältää tuntemattoman kokonaisluvun aallonpituuksia (**integer ambiguity**). Kun ambiguity ratkaistaan (RTK-fix), suhteellinen paikka on senttiluokkaa. Koodipseudomatka on meluisa (dm–m) mutta yksiselitteinen.

## Käytännössä

Cycle slip katkaisee vaiheen jatkuvuuden — vastaanotin joutuu ratkaisemaan ambiguityn uudelleen. Seuraa RTK-tilaa: float vs fixed.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Carrier_Phase_Multipath)
