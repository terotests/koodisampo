# Mikä on multipath-virhe GNSS-paikannuksessa?

## Tilanne

Kaupunkikanjonissa fix hyppii metritolkulla vaikka taivaalla on 12 satelliittia. Mikä lokalisoitu virhelähde?

## Ratkaisu

**Multipath**: signaali heijastuu lasiseinistä, asfaltista tai vedestä ja saapuu antenniin myöhässä/vaihevääristyneenä. Pseudomatka ja kantoaalto vääristyvät. Ratkaisuja: hyvä antenni (choke ring), elevaatiomaski, monikonstellaatio, carrier-smoothing, RTK-laatuinen signaaliseulonta.

## Käytännössä

Älä sijoita survey-antennia metallikaiteen viereen. Kuluttajalaitteissa Google/Apple käyttävät sensori-fuusiota peittämään multipathia — raaka GNSS silti kärsii.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Multipath)
