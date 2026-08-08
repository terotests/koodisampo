# Mitkä ovat ECEF-koordinaatit?

## Tilanne

Kirjasto palauttaa position.x/y/z metreissä. Missä koordinaatistossa?

## Ratkaisu

**ECEF** (Earth-Centered, Earth-Fixed): origo maan massakeskipisteessä (käytännössä ellipsoidikeskus), Z noin pohjoisnapaa kohti, X Greenwichin meridiaanin leikkauksessa ekvaattorin kanssa. Koordinaatisto pyörii maan mukana — piste maan pinnalla pysyy likimain vakiona (ilman laattaliikettä).

## Käytännössä

Muunna ECEF → geodeettinen (φ, λ, h) ellipsoidin kaavoilla ennen kartalle piirtoa. Älä tulkitse X/Y:tä lon/lat-asteina.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/ECEF)
