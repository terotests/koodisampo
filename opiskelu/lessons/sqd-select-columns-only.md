# Raportti tarvitsee vain `order_id` ja `description` miljoonarivisestä `orders`-taulusta. Mikä on ensimmäinen hyvä tapa?

## Tilanne

Logistiikkatiimi pyytää CSV-vientiä tilauksista ERP-järjestelmästä. Taulussa `orders` on yli kaksi miljoonaa riviä ja kymmeniä sarakkeita: hintatiedot, osoitteet, metadata JSONB:nä, audit-kentät. Raportointipalvelu tarvitsee vain tunnisteen ja lyhyen kuvauksen — ei koko riviä.

Kehittäjä kirjoittaa ensimmäisen luonnoksen nopeasti:

```sql
SELECT * FROM orders;
```

Kysely toimii testikannassa, mutta tuotannossa se siirtää kymmeniä gigatavuja turhaa dataa verkon yli, täyttää sovellusmuistin ja hidastaa raportin generointia. BI-työkalu joutuu myös jäsentämään sarakkeita, joita kukaan ei pyytänyt.

Oikea lähtökohta on kysyä heti: mitkä sarakkeet kuluttaja oikeasti tarvitsee? Vasta sitten mietitään indeksejä ja suodattimia.

## Ratkaisu

**Valitse vain tarvittavat sarakkeet — älä käytä `SELECT *`:**

```sql
SELECT order_id, description
FROM orders;
```

Tämä on ensimmäinen ja halvin optimointi: vähennät siirrettävän datan määrää heti kyselyn alussa. PostgreSQL voi hyödyntää covering-indeksiä tai index-only scania, jos indeksi sisältää juuri nämä sarakkeet. Vaikka indeksiä ei olisi, vähemmän sarakkeita tarkoittaa vähemmän heap-hakuja ja pienempää muistijalanjälkeä.

Packt-kirjan periaate *reducing data returned* tarkoittaa juuri tätä: palauta vain se, mitä kysely tarvitsee — ei koko taulurakennetta.

## Käytännössä

Code reviewssa kyseenalaista jokainen `SELECT *` tuotantopolussa, erityisesti API-vastauksissa ja batch-raporteissa. Jos sarake tarvitaan myöhemmin, lisää se tietoisesti — se dokumentoi riippuvuuden.

ORM:ien `findAll()` ilman `attributes`-rajauksia on yleinen lähde tähän ongelmaan. Lisää linter-sääntö tai `pg_stat_statements`-seuranta: yllättävän suuret `rows`- tai I/O-luvut usein johtuvat liian leveistä SELECTeistä.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
