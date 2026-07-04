# PostgreSQL cache hit ratio matala — ensimmäinen muutiparametri tarkistaa?

## Tilanne

Kun `pg_stat_database`-näkymässä tai monitorointityökalussa cache hit ratio putoaa alle ~99 %:n (OLTP-tyyppisessä kuormassa), suuri osa lukukyselyistä menee levylle. Levy on magnitudin hitaampi kuin RAM, ja latenssi kasvaa kaikille asiakkaille.

Ensimmäinen epäily kohdistuu PostgreSQLin omaan page cacheen: `shared_buffers`. Se on instanssin keskitetty buffer pool, johon usein luettavat sivut jäävät. Liian pieni arvo tarkoittaa, että PostgreSQL työntää sivuja pois nopeasti ja lukee samat sivut uudelleen levyltä.

Ennen indeksien lisäämistä tai query-refaktorointia kannattaa varmistaa, että perusmuistiasetukset ovat järkevät palvelimen RAM-koolle. Muuten optimointi rakentuu hauraalle pohjalle.

## Ratkaisu

**shared_buffers tyypillisesti ~25 % RAM — testaa cache hit ratioa** on ensimmäinen tarkistettava parametri. PostgreSQLin dokumentaatio suosittelee lähtökohtaa noin neljäsosaan fyysisestä muistista dedikoituun DB-palvelimessa, sitten hienosäätö mittauksilla.

`shared_buffers` ei ole ainoa cache: Linuxin OS page cache pitää myös kopioita tiedostosivuista. Siksi koko RAM ei saa mennä `shared_buffers`:iin — liian suuri arvo voi jopa hidastaa, kun kaksi cache-kerrosta kilpailee.

Nosta maltillisesti (esim. 128 MB → 4 GB 16 GB RAM -koneella), restart, seuraa `blks_hit / (blks_hit + blks_read)` ja I/O-latensseja. Tavoite on korkea hit ratio ilman että swap tai muistipaine kasvaa.

## Taustaa

Mittaa ennen ja jälkeen: `pg_stat_database`, `pg_stat_bgwriter` (dirty pages, checkpoints). Cache hit ratio yksin ei kerro kaikkea — heavy sequential scan voi näyttää matalalta vaikka konfig olisi kunnossa.

Muut muistiparametrit (`effective_cache_size`, `work_mem`) vaikuttavat suunnitteluun ja sort/hash-operaatioihin, mutta matalan hit ration ensimmäinen vipu on lähes aina `shared_buffers`.
