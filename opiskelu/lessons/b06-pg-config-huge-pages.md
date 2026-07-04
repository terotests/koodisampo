# Suuri shared_buffers — TLB miss hidastaa. Mitä Linux + PostgreSQL optimointi?

## Tilanne

Kun `shared_buffers` on useita gigatavuja (esim. 32–64 GB suurissa instansseissa), PostgreSQL käyttää suurta jaettua muistialuetta. CPU:n Translation Lookaside Buffer (TLB) cachettaa vain rajallisen määrän muistisivuja. Suuri buffer pool → TLB miss -frekvenssi kasvaa → hidastus vaikka data on RAM:issa.

Ilmiö näkyy profiloinnissa (`perf`) ja korkeassa CPU-käytössä ilman selvää query-syyllistä. Perus `shared_buffers`-nosto ei auta enää — tarvitaan isommat muistisivut (huge pages).

## Ratkaisu

**huge_pages = try/on — vähentää TLB pressure suurilla shared_buffers-arvoilla**. Linux huge pages (typ. 2 MB sivut 4 KB sijaan) vähentää TLB-missien määrää suurissa muistialueissa.

```ini
huge_pages = try   # aloita try, sitten on jos toimii
shared_buffers = 32GB
```

Linux-puolella: `vm.nr_hugepages` tai systemd `hugetlb` konfigurointi ennen PostgreSQLin käynnistystä. PostgreSQL docs: Linux Huge Pages -osio kertoo tarvittavan sivumäärän kaavan.

`try` käynnistää PG:n normaalisti jos huge pages ei onnistu; `on` vaatii onnistumisen.

## Taustaa

Huge pages vaativat ennakointia — muistia varataan etukäteen. Pilvi-ympäristöissä tarkista providerin tuki.

Hyöty realisoituu vasta suurilla `shared_buffers` -arvoilla; pienillä instansseilla ei merkitystä.
