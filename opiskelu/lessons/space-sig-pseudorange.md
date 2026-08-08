# Mitä tarkoittaa pseudomatka (pseudorange) GNSS:ssä?

## Tilanne

Dokumentaatio sanoo 'pseudorange residual'. Mitä pseudomatka oikeastaan on?

## Ratkaisu

**Pseudomatka** on vastaanottimen mittaama etäisyys satelliittiin kulkuajan perusteella. Se ei ole puhdas geometrinen matka, koska vastaanottimen kello on väärässä, ja matkaan sekoittuvat ioni-/troposfääri, multipath jne. Siksi tarvitaan vähintään 4 satelliittia: 3D-paikka + kellovirhe.

## Käytännössä

Kun residual on suuri yhdellä satelliitilla, epäile multipathia tai huonoa elevaatiota — älä heti syytä koko konstellaatiota.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Pseudorange)
