# Mitkä tarkoittaa TTFF GNSS-vastaanottimessa?

## Tilanne

Tuotespeksi lupaa 'TTFF < 30 s warm start'. Mitä mittaat?

## Ratkaisu

**TTFF** on aika virran/käynnistyksen jälkeen ensimmäiseen validiin 3D-fixiin. **Cold**: ei almanakkaa/efemeridiä/aikaa/paikkaa. **Warm**: almanakka + karkea aika/paikka. **Hot**: tuore efemeridi. A-GNSS lataa datan verkosta.

## Käytännössä

Testaa TTFF realistisessa RF-ympäristössä. Pelkkä simulaattori ei paljasta multipath-hidastuksia kaupungissa.


[Lue lisää](https://gssc.esa.int/navipedia/index.php/Time_To_First_Fix)
