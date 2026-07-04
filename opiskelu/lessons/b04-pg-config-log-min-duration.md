# Haluat lokittaa vain > 500ms kestävät kyselyt tuotannossa ilman kaiken logitusta. Parametri?

## Tilanne

Tuotantodiagnoosissa tarvitset hitaiden kyselyiden tekstit ja kestot, mutta `log_statement = all` tuottaa valtavan logivirtauksen. Jokainen SELECT, INSERT ja UPDATE täyttää levyn ja hidastaa I/O:ta. Log-analyysi muuttuu mahdottomaksi.

Tavoite on **kynnysarvo keston mukaan**: lokita vain kyselyt, jotka ylittävät esimerkiksi 500 ms. Näin löydät todelliset pullonkaulat ilman että normaali OLTP-kuorma sotkee lokia.

PostgreSQL tarjoaa tähän erillisen GUC:n — ei `log_statement`:ia, ei ulkoista grep-filteriä post-processingissa.

## Ratkaisu

**log_min_duration_statement = 500 (ms)** lokittaa automaattisesti vain yli puoli sekuntia kestäneet kyselyt (arvo on millisekunteina).

```ini
log_min_duration_statement = 500
```

Lokiin tulee kyselyn teksti (riippuen `log_line_prefix` ja muista asetuksista) ja kesto. `-1` poistaa rajan (oletus), `0` lokittaa kaiken (vältä tuotannossa).

Yhdistä `log_destination` ja keskitetty lokitus (journald, CloudWatch, ELK). Harkitse `auto_explain` erikseen suunnitelmien kaappaamiseen.

## Tuotannossa

500 ms on alkuarvo — säädä kuormituksen mukaan (100 ms aggressiivisempi, 1000 ms vähemmän melua). Sampling auttaa jos loki on silti liian suuri.

`log_statement = all` on eri asia: se lokittaa kaikki statementit riippumatta kestosta. Älä sekoita näitä kahta.
