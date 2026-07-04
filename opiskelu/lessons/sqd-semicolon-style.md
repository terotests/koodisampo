# Tiimi jakaa SQL-skriptejä code reviewssa. Mikä käytäntö parantaa ylläpidettävyyttä?

## Tilanne

Kolme kehittäjää kirjoittaa migraatioita ja raporttikyselyitä samaan repoon. Yksi käyttää pieniä kirjaimia ja yhden rivin SELECTejä:

```sql
select order_id,total from orders where status='shipped';
```

Toinen kirjoittaa kaiken isoilla kirjaimilla yhdelle riville ilman pilkkuja. Kolmas sekoittaa tabulaattoreita ja välilyöntejä sarkkeiden kohdalla. Git-diffit ovat vaikeita lukea, ja pienet muutokset näyttävät massiivisilta uudelleenjärjestelyiltä.

Kun tuotantoon menee bugi, kukaan ei löydä nopeasti WHERE-ehtoa 200 merkin yhden rivin kyselystä.

## Ratkaisu

**Yhtenäinen tyyli: yksi looginen lause per rivi, isoloidut avainsanat, selkeä sarakkeiden lista:**

```sql
SELECT
  order_id,
  total,
  status
FROM orders
WHERE status = 'shipped';
```

Luettava SQL on ylläpidettävää SQL:ää — kirjan maintainability-teema. Tiimin style guide voi määritellä:

- Avainsanat ISOILLA (`SELECT`, `FROM`, `WHERE`)
- Sarakkeet omille riveilleen, pilkku edessä tai jäljessä (yhtenäisesti)
- Puolipiste lauseen lopussa
- Sisennys 2 välilyöntiä

Työkalut kuten sqlfluff automatisoi formatoinnin CI:ssä.

## Käytännössä

Lisää `.sqlfluff` tai vastaava konfiguraatio repoon ja aja formatter PR-checkissä. Diff keskittyy silloin logiikkaan, ei välilyönteihin.

Code reviewssa tarkista ensin rakenne (JOINit, WHERE, GROUP BY), sitten suorituskyky. Yhtenäinen tyyli nopeuttaa molempia — silmä tunnistaa `WHERE`-lohkon heti.

Dokumentoi poikkeukset (esim. yhden rivin `SELECT 1` health check) style guidessa, jotta formatter ei taistele niitä vastaan.

[Lue lisää](https://github.com/PacktPublishing/SQL-Query-Design-Best-Practices)
