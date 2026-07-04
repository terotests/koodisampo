---
sidebar_position: 3
slug: /lyhenteet
title: Lyhenteet
---

# Lyhenteet

Tekniset lyhenteet ja akronyymit oppitunneissa. Oppitunneissa lyhenteet linkitetään automaattisesti tähän hakemistoon (`npm run study:sync`). Käsin kirjoittaessa voit linkittää muodossa `[GUC](/docs/lyhenteet#guc)`.

## PostgreSQL ja tietokannat

### GUC {#guc}

**Grand Unified Configuration** — PostgreSQLin konfiguraatioparametri. Arvot asetetaan `postgresql.conf`:ssa, `ALTER SYSTEM`:llä tai istunnossa `SET`-komennolla. Dokumentaatio viittaa parametreihin muodossa `#GUC-WORK-MEM`.

### OOM {#oom}

**Out Of Memory** — muisti loppuu. Linuxin OOM-killer voi tappaa prosesseja (PostgreSQL-backend, Docker-kontti, sovellus). PostgreSQLissä liian korkea `work_mem` × monta yhteyttä on tyypillinen OOM-riski.

### OLTP {#oltp}

**Online Transaction Processing** — lyhyet, toistuvat transaktiokyselyt (INSERT/UPDATE/SELECT yksittäisille riveille). Vastakohta raskaille raportti- ja analytiikkakyselyille.

### WAL {#wal}

**Write-Ahead Log** — PostgreSQLin muutosloki ennen datatiedostojen päivitystä. Checkpoint-kirjoitukset ja WAL-volyymi vaikuttavat I/O-kuormaan ja palautumiseen.

### VACUUM {#vacuum}

PostgreSQLin roskienkeruu ja visibility map -ylläpito. `maintenance_work_mem` vaikuttaa VACUUM-operaation muistinkäyttöön. Ei liity SELECT-kyselyiden sort/hash-muistiin (`work_mem`).

### EXPLAIN {#explain}

SQL-kyselyn suoritussuunnitelman näyttö. `EXPLAIN ANALYZE` ajaa kyselyn ja mittaa todelliset ajat. `BUFFERS` lisää cache hit / disk read -tiedot.

### PgBouncer {#pgbouncer}

Yhteys pool -välipalvelin PostgreSQLille. Vähentää suorien backend-yhteyksien määrää; sovellus yhdistää pooleriin, pooleri pitää hallussa rajatun määrän PG-yhteyksiä.

### DBA {#dba}

**Database Administrator** — tietokannan ylläpitäjä (konfigurointi, varmuuskopiot, suorituskyky, kapasiteetti).

### DB {#db}

**Database** — tietokanta; tässä materiaalissa usein PostgreSQL-instanssi tai -palvelin.

### SSD {#ssd}

**Solid State Drive** — flash-pohjainen levy. PostgreSQLin `random_page_cost` kannattaa laskea SSD:lle (satunnainen lukeminen halvempaa kuin perinteisellä kovalevyllä).

## Linux ja järjestelmät

### RAM {#ram}

**Random Access Memory** — koneen päämuisti. PostgreSQLin `shared_buffers` ja OS page cache jakavat RAM:in.

### CPU {#cpu}

**Central Processing Unit** — prosessori. Kontekstinvaihdot, parallel query -workerit ja TLB-missit kuluttavat CPU-aikaa.

### OS {#os}

**Operating System** — käyttöjärjestelmä (Linux, Windows). OS page cache pitää usein luetun levydatan muistissa PostgreSQLin `shared_buffers`:in lisäksi.

### I/O {#io}

**Input/Output** — levy- ja verkkoluku/kirjoitus. Hidas I/O on yleinen pullonkaula; `track_io_timing` ja `EXPLAIN (ANALYZE, BUFFERS)` auttavat erottamaan I/O:n CPU:sta.

### TLB {#tlb}

**Translation Lookaside Buffer** — CPU:n välimuisti virtuaali→fyysinen osoitemuunnoksille. Suuri `shared_buffers` voi aiheuttaa TLB-missiä; Linux **huge pages** auttaa.

### FSS {#fss}

**Forward Secure Sealing** — systemd-journald:n lokien eheyden suojaus (`Seal=yes`). Vanhoja lokimerkintöjä ei voi muokata huomaamatta.

### NFS {#nfs}

**Network File System** — verkkotiedostojärjestelmä. Docker-volume voi käyttää NFS-driveriä jaetulle persistent storagelle.

### UID {#uid}

**User ID** — Linux-käyttäjätunnus numeromuodossa. Kontin prosessi ja volume-mountin omistajuus pitää linjata (`chown`, `USER` Dockerfilessa).

### GID {#gid}

**Group ID** — Linux-ryhmätunnus numeromuodossa. Käytetään tiedosto-oikeuksissa volume-mounteissa.

### UDP {#udp}

**User Datagram Protocol** — verkkoprotokolla ilman yhteyttä (esim. multicast). Docker bridge-verkko ei välttämättä kuljeta multicastia; `--network host` voi olla tarpeen.

## C++ ja ohjelmointi

### RAII {#raii}

**Resource Acquisition Is Initialization** — resurssi (lukko, tiedosto, muisti) sidotaan olion elinkaareen. Esim. `std::lock_guard` vapauttaa mutexin automaattisesti.

### UB {#ub}

**Undefined Behavior** — C++-standardin määrittelemätön käyttäytyminen (esim. rajojen ylitys ilman tarkistusta). Kääntäjä voi optimoida koodia oletuksella, ettei UB:tä tapahdu.

### API {#api}

**Application Programming Interface** — rajapinta, jota muut kutsuvat (funktiot, luokat, HTTP-endpointit).

### ARM {#arm}

**Advanced RISC Machine** — prosessoriarkkitehtuuri (mobiili, embedded). Endianness ja kiinteän levyisyyden tyypit (`uint32_t`) vaativat huomiota binääriprotokollissa.

### CI {#ci}

**Continuous Integration** — automaattinen build/test putki (GitHub Actions, GitLab CI). Sanitizer-buildit (`-fsanitize=address`) havaitsevat muistivirheet ennen tuotantoa.

### PIMPL {#pimpl}

**Pointer to Implementation** — piilotus idiom: julkinen luokka pitää vain osoittimen toteutukseen; vähentää käännösriippuvuuksia.

### PCH {#pch}

**Precompiled Header** — esikäännetty header nopeuttaa buildia; trade-off ylläpidossa ja riippuvuuksissa.

## Docker ja kontit

### ELK {#elk}

**Elasticsearch, Logstash, Kibana** (tai Elastic Stack) — keskitetty lokien keruu ja haku. PostgreSQLin `log_destination` voidaan ohjata journald → ELK -ketjuun.

## Turvallisuus

### CSRF {#csrf}

**Cross-Site Request Forgery** — selain lähettää tunnistetun käyttäjän pyynnön haitalliselta sivulta. Suoja: CSRF-token, `SameSite`-eväste, `Origin`/`Referer`-tarkistus.

### XSS {#xss}

**Cross-Site Scripting** — hyökkääjä injektoi skriptiä, joka suoritetaan uhrin selaimessa. Estetään output-encodingilla, CSP:llä ja vältetään `innerHTML` raw-käyttäjälle.

## Scrum

### DoR {#dor}

**Definition of Ready** — kriteerit, joiden täytyttyä tarina voidaan ottaa sprinttiin (kuvaus, arvio, riippuvuudet selvillä).

### DoD {#dod}

**Definition of Done** — kriteerit, joiden täytyttyä tarina on valmis (koodi, testit, dokumentaatio, deploy).

### SM {#sm}

**Scrum Master** — tiimin fasilitoija ja Scrum-prosessin valmentaja; servant leader -rooli.

## Web ja JavaScript

### SPA {#spa}

**Single Page Application** — selainsovellus, joka päivittää DOM:ia ilman täyttä sivulatausta (React, Vue, …).

### REST {#rest}

**Representational State Transfer** — HTTP-pohjainen API-tyyli (resurssit, verb GET/POST/PUT/DELETE).

### CORS {#cors}

**Cross-Origin Resource Sharing** — selaimen mekanismi, joka rajoittaa toisen originin API-kutsuja. Preflight OPTIONS ennen POST JSON:ia toiselle domainille.

### JSON {#json}

**JavaScript Object Notation** — tekstimuotoinen datavaihto (API-vastaukset, konfiguraatio).

### ESM {#esm}

**ECMAScript Modules** — `import`/`export` -moduulijärjestelmä (vs. CommonJS `require`).

### CJS {#cjs}

**CommonJS** — Node-perinteinen `require`/`module.exports` -moduulijärjestelmä.

### GC {#gc}

**Garbage Collection** — automaattinen muistin vapautus (JavaScript-moottori, JVM). Closure-viittaukset voivat estää GC:n poistamasta DOM-nodeja.

### DOM {#dom}

**Document Object Model** — selaimen HTML-puun ohjelmallinen esitys. Detached DOM -nodet viittaavat poistettuihin elementteihin, jotka eivät vielä GC:ttä.

## Verkko

### HTTP {#http}

**Hypertext Transfer Protocol** — web-pyyntöjen perusprotokolla (GET, POST, …).

### HTTPS {#https}

HTTP TLS-salauksella (TLS/SSL). PostgreSQL `sslmode` määrittää, vaaditaanko salattu yhteys.

### SSL {#ssl}

**Secure Sockets Layer** — vanhempi nimi salatulle kanavalle; käytännössä usein TLS, mutta termi **SSL mode** esiintyy edelleen (esim. PostgreSQL `sslmode`).

### TLS {#tls}

**Transport Layer Security** — TLS 1.2/1.3 salaa HTTP- ja DB-yhteydet.
