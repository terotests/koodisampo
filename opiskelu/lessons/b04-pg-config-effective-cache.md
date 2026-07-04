# Planner aliarvioi index scan hyödyn — effective_cache_size on default 4GB mutta RAM 64GB. Vaikutus?

## Tilanne

Plannerin cost-mallissa `effective_cache_size` kertoo arvioidun cache-kapasiteetin (PostgreSQL `shared_buffers` + OS page cache). Oletus 4 GB on sopiva pienelle dev-koneelle, mutta 64 GB RAM -tuotantopalvelimella se on dramaattisen aliarvio.

Kun arvo on liian matala, planner olettaa, että index scanin satunnaiset sivuluvut osuvat useammin levylle kuin todellisuudessa. Seq scan näyttää halvemmalta, vaikka suuri osa datasta olisi jo muistissa. Näet `Seq Scan` -suunnitelmia indeksoiduilla kyselyillä ja hitaus jää mysteeriksi.

Parametri ei varaa muistia — se on pelkkä hint suunnittelijalle. Siksi sen nostaminen on turvallista testata ilman OOM-riskiä.

## Ratkaisu

**Nosta effective_cache_size ~ OS cache + shared_buffers arvio — planner suosii indeksejä** kun arvo vastaa todellista kapasiteettia. Esimerkiksi 64 GB koneessa: `shared_buffers` 16 GB + `effective_cache_size` 48 GB (tai hieman konservatiivisemmin 40 GB aluksi).

```ini
effective_cache_size = 48GB
```

Planner alkaa suosia index scania tilanteissa, joissa su suuri osa tarvittavista sivuista on jo cachessa. Muutos vaikuttaa vain uusiin suunnitelmiin; prepared statementit invalidoituvat tarvittaessa.

## Taustaa

Säädä mitattuna: vertaa `EXPLAIN`-suunnitelmia ja todellista `EXPLAIN (ANALYZE, BUFFERS)` -dataa (shared hit vs read). Liian korkea `effective_cache_size` voi päinvastoin suosia index scania liikaa.

Pidä `random_page_cost` linjassa levyn kanssa (SSD: alempi arvo). Nämä kaksi parametria toimivat usein parina.
