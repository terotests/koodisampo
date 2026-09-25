# Mihin WGS84-ellipsoidin parametreja a (puolisuuri akseli) ja f (litistyneisyys) tarvitaan?

## Tilanne

GNSS-vastaanotin laskee sijainnin maakeskisissä suorakulmaisissa koordinaateissa (ECEF: X, Y, Z), mutta käyttäjä haluaa leveyden, pituuden ja korkeuden. Muunnos tarvitsee matemaattisen pinnan, johon leveys ja korkeus viittaavat.

## Ratkaisu

Vertailuellipsoidi määritellään kahdella luvulla:

- **a**, puolisuuri akseli, eli ekvaattorisäde
- **f**, litistyneisyys, eli kuinka paljon napasäde b on ekvaattorisädettä lyhyempi: `f = (a − b) / a`

Näillä muunnetaan geodeettiset koordinaatit (φ, λ, h) ECEF-koordinaateiksi ja takaisin. Myös ellipsoidikorkeus h mitataan tämän pinnan normaalia pitkin.

```text
N = a / sqrt(1 − e²·sin²φ)      e² = f·(2 − f)
X = (N + h)·cos φ·cos λ
Y = (N + h)·cos φ·sin λ
Z = (N·(1 − e²) + h)·sin φ
```

## Käytännössä

- Käytä kirjastoa (PROJ, GeographicLib), älä kirjoita vakioita käsin. Tarkat arvot on määritelty standardissa, eikä niitä tarvitse muistaa.
- Pallomalli (yksi säde) aiheuttaa kilometriluokan virheitä korkeuteen ja paikkaan. Ellipsoidi on välttämätön.
- GRS80 (ETRS89:n ellipsoidi) ja WGS84 eroavat f:ssä niin vähän, että ero on käytännössä alle millimetrin.
- Ellipsoidikorkeus h ei ole merenpinnasta mitattu korkeus. Siihen tarvitaan geoidimalli (H = h − N).

[Lue lisää](https://gssc.esa.int/navipedia/index.php/Ellipsoidal_and_Cartesian_Coordinates_Conversion)
