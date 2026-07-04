# Raportti Exceliin: status-koodi 1/2/3 pitää näyttää teksteinä. Missä muotoilet?

## Tilanne

Tilausraportti viedään Exceliin liiketoimintakäyttöön. Tietokannassa `status` on integer: 1 = avoin, 2 = toimitettu, 3 = peruutettu. Excel-käyttäjät eivät tunne koodeja — he tarvitsevat suomenkieliset tekstit.

Kehittäjä harkitsee muotoilua sovelluskerroksessa:

```python
STATUS_LABELS = {1: "Avoin", 2: "Toimitettu", 3: "Peruutettu"}
```

Tai erillistä lookup-taulua JOIN:lla. Molemmat toimivat, mutta raportti ajetaan suoraan BI-työkalusta SQL:llä ilman sovelluskerrosta.

## Ratkaisu

**`CASE WHEN` SELECTissä — muotoile tulosrivillä kyselyssä:**

```sql
SELECT
  order_id,
  CASE status
    WHEN 1 THEN 'Avoin'
    WHEN 2 THEN 'Toimitettu'
    WHEN 3 THEN 'Peruutettu'
    ELSE 'Tuntematon'
  END AS status_label,
  total
FROM orders;
```

Format results at query for consumption — kirjan teema. Raportin kuluttaja saa valmiin datan ilman toista muunnosvaihetta. `CASE` on selkeä, versionhallittavissa SQL-skriptissä ja toimii kaikissa SQL-asiakkaissa.

Lookup-taulu (`status_codes`) on parempi, jos koodit muuttuvat usein tai käännöksiä on monta kieltä.

## Käytännössä

Pidä status-koodit ja niiden merkitykset dokumentoituina — `CASE`-lista repossa vs lookup-taulu riippuu muutostiheydestä. `ELSE 'Tuntematon'` estää NULL-arvot, kun uusi koodi lisätään ennen raportin päivitystä.

Vältä muotoilua WHERE-ehdossa (`WHERE CASE ...`) — se rikkoo indeksin käytön. Suodata edelleen numerolla (`WHERE status = 1`), muotoile vain SELECT-listassa.

BI-työkaluissa (Metabase, Grafana) sama CASE voidaan tallentaa saved question -tasolle, jotta Excel-export on aina oikein muotoiltu.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
