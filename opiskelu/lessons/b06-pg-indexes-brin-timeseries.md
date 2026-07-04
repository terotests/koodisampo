# Aikasarjataulu — miljardi rivi, queries aikarangeilla. Kustannustehokas index?

## Tilanne

Telemetria- tai lokitaulussa on miljardi riviä, data insertataan ajan mukaan kasvavana (`timestamp` nouseva). Kyselyt ovat lähes aina `WHERE ts BETWEEN ... AND ...`. B-tree-indeksi koko taululle olisi valtava — levy ja ylläpito kallista.

Tarvitset indeksin, joka hyödyntää **fyysistä järjestystä** levyllä.

## Ratkaisu

**BRIN-indeksi** (Block Range INdex):

```sql
CREATE INDEX ON metrics USING BRIN (ts);
```

BRIN tallentaa min/max-arvot sivualueille — indeksi on pieni, sopii hyvin aikasarjadatalle, jossa arvot korreloivat fyysisen sijainnin kanssa. Range-kyselyt hyötyvät; yksittäinen rivihaku ei.

BRIN vaatii, että data on likimain insert-järjestyksessä sarakkeen arvojen mukaan.

## Taustaa

BRIN vs btree: btree tarkempi mutta iso. Miljardilla rivillä BRIN on usein ainoa järkevä indeksivaihtoehto aikarange-kyselyille.

[Lue lisää](https://www.postgresql.org/docs/current/brin-intro.html)
