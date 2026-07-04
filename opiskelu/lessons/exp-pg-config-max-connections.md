# App avaa 5000 connectionia microservice-arkkitehtuurissa — CPU context switch helvetti. Ratkaisu?

## Tilanne

Microservice-arkkitehtuurissa tuhannet kontit avaavat omat connection poolinsa suoraan PostgreSQLiin. 5000 yhteyttä tarkoittaa 5000 backend-prosessia — PostgreSQL ei ole suunniteltu tähän. CPU kuluttaa aikaa kontekstinvaihtoihin, muisti fragmentoituu, latenssi kasvaa exponentiaalisesti.

`max_connections`-nosto pahentaa ongelmaa: enemmän prosesseja, enemmän overheadia, ei enempää throughputia. PostgreSQL dokumentaatio korostaa, että jokainen connection on raskas resurssi.

Ratkaisu on arkkitehtuurinen kerros yhteyksien multiplexaukseen.

## Ratkaisu

**Connection pooler (PgBouncer) + kohtuullinen max_connections** on oikea ratkaisu.

```
5000 app connections → PgBouncer → 100–200 PostgreSQL backend connections
```

PgBouncer poolaa yhteydet: sovellukset eivät avaa suoraa backend-yhteyttä PostgreSQLiin. `max_connections` PostgreSQLissä pidetään poolerin kapasiteetin mukaan, ei sovellusyhteyksien määrän mukaan.

Transaction pooling maksimoi backend-yhteyksien kierron; session pooling tarvitaan jos session-tila (prepared statements, temp tables) on kriittinen.

## Tuotannossa

PgBouncer erillisenä palveluna (tai sidecar). Monitoroi poolerin jonotus, `max_wait`, PostgreSQLin `numbackends`.

`max_connections` ylös ilman pooleria on anti-pattern — poolaa ensin, säädä `max_connections` alas tarpeen mukaan.
