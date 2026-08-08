---
sidebar_position: 3
slug: /lyhenteet
title: Lyhenteet
---

# Lyhenteet

Tekniset lyhenteet ja akronyymit oppitunneissa. Oppitunneissa lyhenteet linkitetään automaattisesti tähän hakemistoon (`npm run study:sync`). Käsin kirjoittaessa voit linkittää muodossa `[GUC](/docs/lyhenteet#guc)`.

### A/B {#a-b}

**A/B-testaus** — menetelmä, jossa käyttäjät jaetaan kahteen ryhmään erilaisten varianttien vertailua varten. Dynaaminen `import()` mahdollistaa A/B-varianttien lazy-latauksen JavaScript-sovelluksissa: vain aktivoitu variantti ladataan, ja kutsu kannattaa kääriä `try/catch`-lohkoon verkko- tai CSP-virheiden varalta.

**Oppitunnit:** [`b02-js-modules-dynamic-08`](/docs/topics/javascript#b02-js-modules-dynamic-08)

### ABI {#abi}

**Application Binary Interface** — käännetyn koodin binääritason rajapinta kirjaston ja käyttöjärjestelmän välillä. STL-tyypit (`std::string`, `std::vector`) jaetun kirjaston julkisessa rajapinnassa voivat rikkoa ABI:n eri kääntäjä- tai standardikirjastoversioilla; C-tyylinen rajapinta on vakaampi vaihtoehto.

**Oppitunnit:** [`b07-cpp-pimpl-abi`](/docs/topics/cpp#b07-cpp-pimpl-abi), [`b10-cpp-portability-abi-01`](/docs/topics/cpp#b10-cpp-portability-abi-01), [`style-final-override`](/docs/topics/cpp#style-final-override)

### AC {#ac}

**AC** (Acceptance Criteria) — hyväksymiskriteerit, jotka määrittelevät milloin käyttäjätarina täyttää vaatimukset. Scrumin DoR (Definition of Ready) edellyttää, että jokaisella sprinttiin otettavalla tarinalla on selkeät AC:t kirjoitettuna ennen sprinttisuunnittelua.

**Oppitunnit:** [`b09-scrum-dor-size-limit`](/docs/topics/scrum#b09-scrum-dor-size-limit)

### ACID {#acid}

**Atomicity, Consistency, Isolation, Durability** — tietokantatransaktioiden neljä perusominaisuutta. PostgreSQL toteuttaa täyden ACID-tuen; `BEGIN`/`COMMIT`/`ROLLBACK` varmistavat atomisuuden, jotta osittaiset siirrot (esim. tilin veloitus ilman hyvitystä) eivät jää tietokantaan.

**Oppitunnit:** [`prod-backend-transfer-transaction`](/docs/topics/backend#prod-backend-transfer-transaction)

### ACK {#ack}

**Acknowledgment** — TCP-protokollan kuittauspaketti. TCP-kädenpuristuksessa palvelin vastaa SYN:iin SYN-ACK:lla ja asiakas vahvistaa ACK:lla. `tcpdump -i eth0 'tcp[tcpflags] & tcp-ack != 0'` kaappaa vain ACK-paketit — hyödyllinen yhteydenoton diagnosoinnissa.

**Oppitunnit:** [`b03-linux-network-tcpdump-filter`](/docs/topics/linux#b03-linux-network-tcpdump-filter), [`b12-linux-tcp-udp-handshake`](/docs/topics/linux#b12-linux-tcp-udp-handshake)

### ACL {#acl}

**Access Control List** — käyttöoikeusluettelo, joka määrittelee kuka saa tehdä mitä tietylle resurssille. Verkossa ACL rajaa liikennettä IP-osoitteiden tai porttien perusteella; Linuxissa POSIX ACL laajentaa tiedosto-oikeuksia `setfacl`-komennolla. macvlan-verkkoa käytettäessä legacy-laitteiden ACL-säännöt edellyttävät usein laitekohtaisen MAC-osoitteen.

**Oppitunnit:** [`b06-docker-network-ipvlan`](/docs/topics/docker#b06-docker-network-ipvlan), [`b09-linux-net-firewall-cmd`](/docs/topics/linux#b09-linux-net-firewall-cmd)

### ADL {#adl}

**Argument-Dependent Lookup** — C++:n nimihaun mekanismi, jossa funktion argumenttien tyypit laajentavat hakua niiden nimiavaruuksiin. `using namespace std` headerissa voi estää ADL:n toimimasta oikein, koska kaikki `std`-nimet tuodaan suoraan näkyvyyteen. ADL mahdollistaa mm. `std::swap`-kutsun erikoistamisen omille tyypeille.

**Oppitunnit:** [`b11-cpp-using-namespace-header`](/docs/topics/cpp#b11-cpp-using-namespace-header)

### AMD {#amd}

**AMD** (Advanced Micro Devices) — suoritin- ja näytönohjainvalmistaja. Shaderiohjelmat saattavat käyttäytyä eri tavoin AMD- ja NVIDIA-ajureilla; Qt RHI -kerroksella kirjoitettu koodi on ajurineutraalimpaa kuin suora GLSL, ja ristiintestaus eri GPU-valmistajien laitteilla on suositeltavaa.

**Oppitunnit:** [`b02-qt-shaders-uniform-14`](/docs/topics/qt#b02-qt-shaders-uniform-14)

### ANSI {#ansi}

**American National Standards Institute** — amerikkalainen standardointielin. ANSI SQL on tietokantojen kyselykielen pohjastandardi; ANSI-tyylinen JOIN-syntaksi (`JOIN ... ON ...`) on selkeämpi kuin vanha pilkuerotteinen FROM-lista ja erottelee join-ehdot suodatusehdoista.

**Oppitunnit:** [`sqd-join-on-not-where`](/docs/topics/postgres#sqd-join-on-not-where), [`sqd-lag-mom-comparison`](/docs/topics/postgres#sqd-lag-mom-comparison)

### APN {#apn}

**Access Point Name** — operaattorin yhdyskäytävänimi, jota modeemi käyttää mobiiliyhteyden muodostamiseen (esim. `internet` tai `data.operator.fi`). APN-asetukset konfiguroidaan `mmcli`-komennolla ModemManager-palveluun tai NetworkManagerin kautta.

**Oppitunnit:** [`b12-linux-dbus-modemmanager-signal`](/docs/topics/linux#b12-linux-dbus-modemmanager-signal)

### APT {#apt}

**Advanced Package Tool** — Debian/Ubuntu-jakelun pakettihallintatyökalu. `apt update` päivittää pakettilistat, `apt install` asentaa, `apt autoremove` poistaa orvot riippuvuudet. Repositoriot lisätään `/etc/apt/sources.list.d/`-hakemistoon GPG-avaimen kanssa.

**Oppitunnit:** [`apt-autoremove`](/docs/topics/linux#apt-autoremove), [`apt-dist-upgrade`](/docs/topics/linux#apt-dist-upgrade), [`apt-dpkg-deb-install`](/docs/topics/linux#apt-dpkg-deb-install), [`apt-pinning-version`](/docs/topics/linux#apt-pinning-version), [`apt-repository-add`](/docs/topics/linux#apt-repository-add)

### ARP {#arp}

**Address Resolution Protocol** — protokolla, joka selvittää IP-osoitetta vastaavan MAC-osoitteen lähiverkossa (RFC 826). `ip neigh show` näyttää ARP-välimuistin; `INCOMPLETE`-merkintä tarkoittaa, että vastausta kohdelaitteelta ei ole vielä saatu.

**Oppitunnit:** [`b06-linux-network-ip-neigh`](/docs/topics/linux#b06-linux-network-ip-neigh), [`b12-linux-arp-failed-state`](/docs/topics/linux#b12-linux-arp-failed-state), [`b12-linux-arp-flush-migration`](/docs/topics/linux#b12-linux-arp-flush-migration), [`b12-linux-arp-gratuitous-duplicate`](/docs/topics/linux#b12-linux-arp-gratuitous-duplicate), [`b12-linux-arp-static-neigh`](/docs/topics/linux#b12-linux-arp-static-neigh), [`b12-linux-network-ip-addr-secondary`](/docs/topics/linux#b12-linux-network-ip-addr-secondary), [`b12-linux-network-ip-link-admin`](/docs/topics/linux#b12-linux-network-ip-link-admin), [`b12-linux-tcp-syn-backlog`](/docs/topics/linux#b12-linux-tcp-syn-backlog)

### AUTOMOC {#automoc}

Qt CMake -buildin automaattinen MOC-ajuri (`set_target_properties(... AUTOMOC ON)` tai `qt_add_executable`). CMake ajaa `moc`-kääntäjän automaattisesti kaikille `Q_OBJECT`-makroa sisältäville headereille. Ilman AUTOMOC:ia tai qmake:n vastaavaa asetusta Qt-signaalit ja -slotit eivät toimi.

**Oppitunnit:** [`b04-qt-meta-object-moc`](/docs/topics/qt#b04-qt-meta-object-moc)

### AWS {#aws}

**Amazon Web Services** — Amazonin pilvipalvelualusta. Docker-volyymit voidaan tallentaa AWS EBS-levyille tai S3-tallennukseen volumepluginien (esim. RexRay) avulla. Salaisuudet (API-avaimet, salasanat) hallitaan AWS Secrets Managerissa eikä ympäristömuuttujina koodissa.

**Oppitunnit:** [`b03-docker-secrets-compose`](/docs/topics/docker#b03-docker-secrets-compose), [`b03-linux-systemd-env-file`](/docs/topics/linux#b03-linux-systemd-env-file), [`b09-docker-vol-driver-local`](/docs/topics/docker#b09-docker-vol-driver-local), [`b12-js-async-retry-backoff`](/docs/topics/javascript#b12-js-async-retry-backoff), [`prod-docker-env-secrets`](/docs/topics/docker#prod-docker-env-secrets)

### AWS/GCP {#aws-gcp}

**AWS/GCP** — johtavat pilvipalvelualustat: **Amazon Web Services** ja **Google Cloud Platform**. CI/CD-pipelinen salaisuuksia hallitaan OIDC-federaatiolla suoraan AWS/GCP:hin, jolloin pitkäikäisiä staattisia avaimia ei tarvita; least-privilege -periaate rajoittaa deploy-avaimen oikeudet minimiin.

**Oppitunnit:** [`ci-secret-management`](/docs/topics/git#ci-secret-management)

### BFS/DFS {#bfs-dfs}

**BFS/DFS** — graafin tai puun kaksi perustraversaalistrategiaa. **Breadth-First Search** (leveyssuuntainen, käyttää jonoa) ja **Depth-First Search** (syvyyssuuntainen, rekursio tai pino). Syvä rekursiivinen DFS voi ylittää JavaScriptin call stack -rajan (~10 000–50 000 tasoa); iteratiivinen toteutus tai BFS välttää `RangeError: Maximum call stack size exceeded` -virheen.

**Oppitunnit:** [`b12-js-runtime-error-stack-limit`](/docs/topics/javascript#b12-js-runtime-error-stack-limit)

### BI {#bi}

**Business Intelligence** — liiketoimintatiedon hallinta, analysointi ja raportointi. BI-työkalut (Metabase, Tableau, Power BI) voivat käyttää PostgreSQL-kantaa suoraan; ennen indeksin poistoa täytyy varmistaa, ettei BI-työkalu tai -kysely käytä sitä.

**Oppitunnit:** [`b02-pg-vacuum-long-xact-11`](/docs/topics/postgres#b02-pg-vacuum-long-xact-11), [`exp-pg-indexes-unused-drop`](/docs/topics/postgres#exp-pg-indexes-unused-drop), [`exp-pg-vacuum-long-xact`](/docs/topics/postgres#exp-pg-vacuum-long-xact), [`sqd-case-format-output`](/docs/topics/postgres#sqd-case-format-output), [`sqd-crosstab-alternative`](/docs/topics/postgres#sqd-crosstab-alternative), [`sqd-readonly-role`](/docs/topics/postgres#sqd-readonly-role), [`sqd-select-columns-only`](/docs/topics/postgres#sqd-select-columns-only), [`sqd-view-column-mask`](/docs/topics/postgres#sqd-view-column-mask)

### BOM {#bom}

**BOM** (Bill of Materials) — osaluettelo, joka kuvaa tuotteen tai projektin komponenttihierarkian puurakenteena. SQL:n rekursiivinen CTE on standardi tapa BOM-puiden, org-kaavioiden ja kategoriahierarkioiden hakuun ilman sovelluskerroksen silmukointia.

**Oppitunnit:** [`sqd-recursive-cte-hierarchy`](/docs/topics/postgres#sqd-recursive-cte-hierarchy)

### BRIN {#brin}

**Block Range INdex** — PostgreSQLin tilatehokas indeksityyppi, joka tallentaa min/max-arvot sivualueryhmille. BRIN sopii suurille fyysisesti järjestetyille tauluille, kuten aikasarjoille; ei sovi yksittäisrivien pistehakuun.

**Oppitunnit:** [`b02-pg-indexes-btree-02`](/docs/topics/postgres#b02-pg-indexes-btree-02), [`b06-pg-indexes-brin-timeseries`](/docs/topics/postgres#b06-pg-indexes-brin-timeseries), [`pg-indexes-partial`](/docs/topics/postgres#pg-indexes-partial)

### C++ {#cpp}

C ja C++ — järjestelmäohjelmointikielet, joita käytetään rinnakkain erityisesti legacy-koodissa. C tarjoaa yksinkertaisen ABI:n ja C++ oliopohjaisuuden; Rust on moderni vaihtoehto, joka yhdistää C/C++:n suorituskyvyn muistiturvallisuuteen ilman GC:tä.

**Oppitunnit:** [`rust-ownership-drop`](/docs/topics/rust#rust-ownership-drop), [`rust-ownership-move`](/docs/topics/rust#rust-ownership-move), [`rust-ownership-vec-push-invalidate`](/docs/topics/rust#rust-ownership-vec-push-invalidate), [`rust-safety-borrow-checker`](/docs/topics/rust#rust-safety-borrow-checker)

### CA {#ca}

**Certificate Authority** — varmenneviranomainen, joka allekirjoittaa TLS-sertifikaatit. PostgreSQL-yhteyden `sslmode=verify-full` vaatii, että client asentaa palvelimen CA-sertifikaatin `sslrootcert`-parametrilla. Self-signed CA:ta käytetään sisäverkkopalveluissa; tuotannossa suositaan tunnettuja CA:ita tai yrityksen omaa PKI-infrastruktuuria.

**Oppitunnit:** [`b03-pg-config-ssl-mode`](/docs/topics/postgres#b03-pg-config-ssl-mode), [`b07-linux-network-curl-debug`](/docs/topics/linux#b07-linux-network-curl-debug)

### CACHE {#cache}

Välimuisti, johon aiemmin laskettu tai haettu data tallennetaan nopean uudelleenkäytön vuoksi. Docker BuildKit ylläpitää build-cacheä kerrosten perusteella (`docker buildx prune` tyhjentää sen). PostgreSQLin `shared_buffers` toimii tietokantablokkien cachena; `EXPLAIN (ANALYZE, BUFFERS)` paljastaa, kuinka moni luku tuli cachesta (`shared_blks_hit`) vs. levyltä (`shared_blks_read`).

**Oppitunnit:** [`b08-docker-prune-build-cache`](/docs/topics/docker#b08-docker-prune-build-cache), [`sqd-explain-before-tune`](/docs/topics/postgres#sqd-explain-before-tune)

### CALLBACK {#callback}

**Callback** — funktio, joka välitetään toiselle funktiolle tai makrolle kutsuttavaksi myöhemmin. C++:ssa `std::bind` on käytännössä korvattu lambdoilla; alustakohtaiset makrot kuten `CALLBACK(handle)` toimivat adapter-abstraktioina esimerkiksi WinAPI-rajapinnoissa.

**Oppitunnit:** [`b11-cpp-bind-vs-lambda`](/docs/topics/cpp#b11-cpp-bind-vs-lambda)

### CD {#cd}

**Continuous Delivery/Deployment** — CI/CD-putken julkaisupuolisko: hyväksytyt muutokset viedään automaattisesti staging- tai tuotantoympäristöön. `systemctl enable` varmistaa palvelun käynnistymisen uudelleen CD-deployauksen jälkeen.

**Oppitunnit:** [`apt-autoremove`](/docs/topics/linux#apt-autoremove), [`b02-linux-systemd-unit-01`](/docs/topics/linux#b02-linux-systemd-unit-01), [`b02-scrum-team-cross-14`](/docs/topics/scrum#b02-scrum-team-cross-14), [`b03-docker-vol-named-vs-bind`](/docs/topics/docker#b03-docker-vol-named-vs-bind), [`b05-linux-avahi-publish-service`](/docs/topics/linux#b05-linux-avahi-publish-service), [`b06-docker-network-mode-none`](/docs/topics/docker#b06-docker-network-mode-none), [`b08-linux-resolv-search`](/docs/topics/linux#b08-linux-resolv-search), [`b09-linux-journalctl-follow-live`](/docs/topics/linux#b09-linux-journalctl-follow-live), [`systemd-enable-boot`](/docs/topics/linux#systemd-enable-boot)

### CDN {#cdn}

**Content Delivery Network** — maantieteellisesti hajautettu verkko staattisen sisällön (kuvat, JS, CSS) jakelua varten. CDN lyhentää latausviivettä ohjaamalla pyynnöt lähimmälle edge-nodelle. Kun CDN on alhaalla, `fetch`-kutsu ei timeouttaa natiivisti — `Promise.race()` AbortController-signaalin kanssa rajoittaa odotusajan.

**Oppitunnit:** [`b03-js-async-promise-race-timeout`](/docs/topics/javascript#b03-js-async-promise-race-timeout), [`b13-qt-quick-image-async`](/docs/topics/qt#b13-qt-quick-image-async)

### CEIL {#ceil}

**CEIL** (ceiling) — matemaattinen pyöristys ylöspäin lähimpään kokonaislukuun. SQL:ssä `CEIL(COUNT(*) / 4.0)` laskee esimerkiksi `NTILE`-bucketien koon tasajakoa varten; huomaa desimaaliliteraali `4.0`, sillä kokonaislukujako katkaisee desimaaliosan.

**Oppitunnit:** [`sqd-ntile-buckets`](/docs/topics/postgres#sqd-ntile-buckets)

### CEO {#ceo}

**CEO** (Chief Executive Officer) — toimitusjohtaja, organisaation ylin johtaja. Scrumissa CEO:nkaan pyyntö ei ohita Product Ownerille kuuluvaa backlog-priorisointia; kaikki pyynnöt menevät backlogiin PO:n arvioitavaksi ja priorisoitavaksi.

**Oppitunnit:** [`b06-scrum-po-stakeholder`](/docs/topics/scrum#b06-scrum-po-stakeholder)

### CHECKPOINT {#checkpoint}

**CHECKPOINT** — PostgreSQL-komento, joka pakottaa kaikki dirty-sivut levylle ja kirjaa WAL-lokiin tarkistuspisteen. `CHECKPOINT` ei päivitä suunnittelijastatistiikkaa; bulk loadin jälkeen tarvitaan erikseen `ANALYZE` tai `VACUUM ANALYZE` ajantasaisten tilastojen saamiseksi.

**Oppitunnit:** [`b07-pg-vacuum-analyze`](/docs/topics/postgres#b07-pg-vacuum-analyze)

### CI/CD {#ci-cd}

**Continuous Integration / Continuous Delivery (tai Deployment)** — automaattinen build-, testaus- ja julkaisuputki. CI varmistaa jokaisen commit/PR:n laadun (testit, lint, sanitizerit); CD automatisoi hyväksyttyjen muutosten julkaisun staging- tai tuotantoympäristöön.

**Oppitunnit:** [`apt-autoremove`](/docs/topics/linux#apt-autoremove), [`b02-linux-systemd-unit-01`](/docs/topics/linux#b02-linux-systemd-unit-01), [`b02-scrum-team-cross-14`](/docs/topics/scrum#b02-scrum-team-cross-14), [`b03-docker-vol-named-vs-bind`](/docs/topics/docker#b03-docker-vol-named-vs-bind), [`b05-linux-avahi-publish-service`](/docs/topics/linux#b05-linux-avahi-publish-service), [`b06-docker-network-mode-none`](/docs/topics/docker#b06-docker-network-mode-none), [`b08-linux-resolv-search`](/docs/topics/linux#b08-linux-resolv-search), [`b09-linux-journalctl-follow-live`](/docs/topics/linux#b09-linux-journalctl-follow-live), [`docker-inspect-network`](/docs/topics/docker#docker-inspect-network), [`systemd-enable-boot`](/docs/topics/linux#systemd-enable-boot)

### CIDR {#cidr}

**Classless Inter-Domain Routing** — IP-osoitenotaatio, jossa verkon laajuus ilmaistaan prefiksipituudella (esim. `192.168.1.0/24`, `10.0.0.0/8`). `ip route add`-komennossa ja WireGuardin `AllowedIPs`-kentässä CIDR-notaatiolla määritetään reititetyt aliverkot; puuttuva CIDR-reitti on yleinen syy siihen, että VPN-tunneli toimii mutta sisäverkot eivät tavoita.

**Oppitunnit:** [`b03-linux-network-ip-route-table`](/docs/topics/linux#b03-linux-network-ip-route-table), [`b05-linux-network-ip-route`](/docs/topics/linux#b05-linux-network-ip-route), [`exp-linux-network-route-missing`](/docs/topics/linux#exp-linux-network-route-missing)

### CLI {#cli}

**Command-Line Interface** — komentoriviympäristön tekstipohjainen käyttöliittymä. `nmcli` on NetworkManagerin CLI-työkalu; monet järjestelmätyökalut ovat saatavilla vain CLI:nä tai tarjoavat skriptattavamman hallinnan kuin graafinen vaihtoehto.

**Oppitunnit:** [`b02-js-modules-tla-10`](/docs/topics/javascript#b02-js-modules-tla-10), [`b02-linux-network-nmcli-11`](/docs/topics/linux#b02-linux-network-nmcli-11), [`b03-docker-prune-disk`](/docs/topics/docker#b03-docker-prune-disk), [`b05-docker-prune-disk-full`](/docs/topics/docker#b05-docker-prune-disk-full), [`b09-docker-exec-debug`](/docs/topics/docker#b09-docker-exec-debug), [`b12-linux-dbus-bluez-pair`](/docs/topics/linux#b12-linux-dbus-bluez-pair), [`b12-linux-dbus-modemmanager-signal`](/docs/topics/linux#b12-linux-dbus-modemmanager-signal), [`linux-nmcli`](/docs/topics/linux#linux-nmcli), [`rust-async-future-await`](/docs/topics/rust#rust-async-future-await), [`rust-async-tokio-runtime-flavor`](/docs/topics/rust#rust-async-tokio-runtime-flavor), [`rust-concurrency-mpsc-channel`](/docs/topics/rust#rust-concurrency-mpsc-channel), [`rust-error-option-result-convert`](/docs/topics/rust#rust-error-option-result-convert) (+2 muuta)

### CLOSE {#close}

TCP-yhteyden `CLOSE-WAIT`-tila: etäpää on lähettänyt FIN-paketin mutta paikallinen sovellus ei ole vielä kutsunut `close()`. Kasvava CLOSE-WAIT-yhteyksien määrä (`ss -s`) viittaa resurssivuotoon sovelluksessa — kernel ei sulje yhteyttä puolestasi.

**Oppitunnit:** [`b12-linux-tcp-close-wait-leak`](/docs/topics/linux#b12-linux-tcp-close-wait-leak), [`b12-linux-tcp-udp-handshake`](/docs/topics/linux#b12-linux-tcp-udp-handshake)

### CLUSTER {#cluster}

PostgreSQL-komento, joka järjestää taulun rivit uudelleen indeksin mukaiseen järjestykseen levyllä. `CLUSTER orders USING orders_created_idx` nopeuttaa range-skannauksia, mutta lukitsee taulun operaation ajaksi — ei korvaa puuttuvaa autovacuumia eikä `REINDEX CONCURRENTLY`-tarvetta.

**Oppitunnit:** [`pg-indexes-partial`](/docs/topics/postgres#pg-indexes-partial), [`exp-pg-indexes-covering`](/docs/topics/postgres#exp-pg-indexes-covering), [`b02-pg-indexes-covering-04`](/docs/topics/postgres#b02-pg-indexes-covering-04), [`b03-pg-indexes-fillfactor-update`](/docs/topics/postgres#b03-pg-indexes-fillfactor-update), [`b06-pg-indexes-include-columns`](/docs/topics/postgres#b06-pg-indexes-include-columns)

### CMD/ENTRYPOINT {#cmd-entrypoint}

Dockerfile-direktiivit kontin käynnistyskomennon määrittämiseen. `ENTRYPOINT` asettaa prosessin, `CMD` sen oletusargumentit. `docker exec` käynnistää uuden prosessin kontissa; `--user`-lippu ohittaa Dockerfile-`USER`:in, mutta `USER`-direktiivi vaikuttaa ainoastaan `CMD`/`ENTRYPOINT`-käynnistykseen.

**Oppitunnit:** [`b08-docker-exec-user`](/docs/topics/docker#b08-docker-exec-user)

### CN/SAN {#cn-san}

**CN/SAN** — TLS-sertifikaatin tunnistekentät: **Common Name (CN)** (vanha käytäntö, yksi nimi) ja **Subject Alternative Names (SAN)** (moderni standardi, useita nimiä tai IP-osoitteita). PostgreSQL-yhteydessä `sslmode=verify-full` tarkistaa, että palvelimen sertifikaatin CN tai SAN vastaa yhteysosoitetta.

**Oppitunnit:** [`b03-pg-config-ssl-mode`](/docs/topics/postgres#b03-pg-config-ssl-mode)

### CNI {#cni}

**Container Network Interface** — standardi liitännäisrajapinta konttien verkottamiseen Kubernetes- ja Docker Swarm -ympäristöissä. CNI-plugin (esim. Flannel, Calico, Cilium) luo overlay-verkon ja liittää podien verkkorajapinnat; Docker Swarm käyttää sisäistä VXLAN-pohjaista CNI-toteutusta overlay-verkkoihin.

**Oppitunnit:** [`docker-overlay`](/docs/topics/docker#docker-overlay)

### COALESCE {#coalesce}

**COALESCE** — SQL-funktio, joka palauttaa ensimmäisen ei-NULL-arvon argumenttilistastaan. Joinissa `COALESCE(id, 0)` voi muuttaa NULL-semantiikkaa arvaamattomasti ja rikkoa indeksikäytön; olemassaolon tarkistukseen `NOT EXISTS` tai `LEFT JOIN … IS NULL` on semanttisesti selkeämpää.

**Oppitunnit:** [`sqd-null-safe-join`](/docs/topics/postgres#sqd-null-safe-join)

### CONFLICT {#conflict}

Git merge-konfliktin merkintä tiedostossa (`<<<<<<<`, `=======`, `>>>>>>>`). Syntyy kun kaksi haaraa muuttaa samaa kohtaa. Ratkaisu: muokkaa konfliktimerkinnät manuaalisesti tai käytä `git mergetool`-välinettä, sitten `git add` ja `git merge --continue`.

**Oppitunnit:** [`git-merge-conflict-resolve`](/docs/topics/git#git-merge-conflict-resolve)

### CP {#cp}

**C++ Core Guidelines** — Bjarne Stroustrupin ja Herb Sutterin ylläpitämä parhaiden käytäntöjen kokoelma C++:lle. `CP`-etuliitteellä alkavat säännöt (esim. CP.1–CP.9) käsittelevät samanaikaisuutta ja rinnakkaisuutta (`std::atomic`, `std::mutex`).

**Oppitunnit:** [`b02-cpp-thread-atomic-order-13`](/docs/topics/cpp#b02-cpp-thread-atomic-order-13), [`b03-cpp-thread-atomic-flag`](/docs/topics/cpp#b03-cpp-thread-atomic-flag), [`b04-cpp-lock-guard-deadlock`](/docs/topics/cpp#b04-cpp-lock-guard-deadlock), [`b04-cpp-static-local-thread`](/docs/topics/cpp#b04-cpp-static-local-thread), [`b05-cpp-atomic-counter`](/docs/topics/cpp#b05-cpp-atomic-counter), [`b07-cpp-atomic-acquire-release`](/docs/topics/cpp#b07-cpp-atomic-acquire-release), [`b08-cpp-atomic-memory-order`](/docs/topics/cpp#b08-cpp-atomic-memory-order), [`exp-cpp-thread-once-flag`](/docs/topics/cpp#exp-cpp-thread-once-flag), [`thread-atomic`](/docs/topics/cpp#thread-atomic), [`thread-data-race`](/docs/topics/cpp#thread-data-race), [`thread-lock-guard`](/docs/topics/cpp#thread-lock-guard)

### CPU/I/O {#cpu-i-o}

**CPU/I/O** — kaksi keskeistä suorituskykyresurssia. CPU-sidonnaiset tehtävät kuluttavat prosessoriaikaa; I/O-sidonnaiset odottavat levy- tai verkkooperaatioita. PostgreSQLin `CREATE INDEX CONCURRENTLY` kuluttaa molempia: se skannaa taulun kahdesti ja rakentaa indeksin ilman lukkoa.

**Oppitunnit:** [`b04-pg-indexes-concurrent-create`](/docs/topics/postgres#b04-pg-indexes-concurrent-create)

### CRC {#crc}

**CRC** (Cyclic Redundancy Check) — tarkistussumma-algoritmi tiedon eheyden varmistamiseen. C++20:n `consteval` sopii CRC-taulukoiden ja muiden vakiorakenteiden laskemiseen käännösaikana, mikä eliminoi ajoaikaisen alustuksen ja tuottaa täysin käännösaikaiset vakiot.

**Oppitunnit:** [`b02-cpp-style-consteval-04`](/docs/topics/cpp#b02-cpp-style-consteval-04)

### CRM {#crm}

**CRM** (Customer Relationship Management) — asiakkuudenhallintajärjestelmä, joka ylläpitää asiakastietoja, kontakteja ja myyntiputkia. Sivutettujen CRM-API-kutsujen läpikäyntiin JavaScript async-generaattori (`async function*`) on tehokas rakenne: se tuottaa jokaisen sivun tulokset `yield`-lausekkeella ilman kaikkien sivujen lataamista muistiin kerralla.

**Oppitunnit:** [`b08-js-async-generator`](/docs/topics/javascript#b08-js-async-generator)

### CRUD {#crud}

**CRUD** (Create, Read, Update, Delete) — neljä perusoperaatiota tietokantadatan käsittelyyn. Optimistic locking sopii tyypillisiin CRUD-näkymiin, joissa samanaikaiset konfliktit ovat harvinaisia: sovellus lukee version-numeron, kirjoittaa ja tarkistaa, ettei versio muuttunut välissä.

**Oppitunnit:** [`prod-backend-optimistic-lock`](/docs/topics/backend#prod-backend-optimistic-lock)

### CSI {#csi}

**CSI** (Container Storage Interface) — standardirajapinta, jonka avulla konttiorkestraattorit (Kubernetes, Docker Swarm) käyttävät eri tallennusjärjestelmiä. Swarm-ympäristössä staattiset palvelut tarvitsevat CSI-yhteensopivan jaetun storagen tai sticky placement -ratkaisun datan pysyvyyden varmistamiseksi.

**Oppitunnit:** [`b09-docker-vol-driver-local`](/docs/topics/docker#b09-docker-vol-driver-local)

### CSP {#csp}

**Content Security Policy** — HTTP-vastausheder (`Content-Security-Policy`), joka rajoittaa selaimen skriptien, tyylien ja median lähteitä. XSS-hyökkäysten torjuntakeino: kieltää inline-skriptit ja ulkoiset resurssit, joita ei ole lueteltu politiikassa. `DOMParser` ei sanitoi — CSP täydentää sanitointia, mutta ei korvaa sitä.

**Oppitunnit:** [`b02-js-modules-dynamic-08`](/docs/topics/javascript#b02-js-modules-dynamic-08), [`b12-js-runtime-domparser`](/docs/topics/javascript#b12-js-runtime-domparser), [`prod-sec-xss`](/docs/topics/security#prod-sec-xss)

### CSS {#css}

**Cascading Style Sheets** — web-sivujen ulkoasun tyylittelykieli. Vite ja muut bundlerit käsittelevät CSS-importit komponenteissa; Qt Widgets -sovelluksissa QSS on Qt:n vastaava CSS-innoittama tyylimäärittely.

**Oppitunnit:** [`b09-js-runtime-raf-animation`](/docs/topics/javascript#b09-js-runtime-raf-animation), [`b12-js-modules-assert-type-css`](/docs/topics/javascript#b12-js-modules-assert-type-css), [`b12-js-modules-side-effects`](/docs/topics/javascript#b12-js-modules-side-effects), [`b12-js-runtime-intersection-observer`](/docs/topics/javascript#b12-js-runtime-intersection-observer), [`b12-js-runtime-resize-observer`](/docs/topics/javascript#b12-js-runtime-resize-observer), [`rf-browser-library`](/docs/topics/robotframework#rf-browser-library), [`b05-js-runtime-dom-reflow`](/docs/topics/javascript#b05-js-runtime-dom-reflow), [`b09-qt-shaders-qml-graph-effect`](/docs/topics/qt#b09-qt-shaders-qml-graph-effect), [`b13-qt-quick-anchors-layout`](/docs/topics/qt#b13-qt-quick-anchors-layout), [`prod-sec-csrf`](/docs/topics/security#prod-sec-csrf)

### CSV {#csv}

**Comma-Separated Values** — pilkuilla eroteltu taulukkomuoto (`.csv`). Suuren CSV-tiedoston synkroninen käsittely pääsäikeellä jäädyttää selaimen UI:n; käsittely kannattaa siirtää Web Workeriin tai pilkkoa eriin tapahtumakierrosten välillä.

**Oppitunnit:** [`b02-scrum-dor-size-06`](/docs/topics/scrum#b02-scrum-dor-size-06), [`b03-cpp-perf-string-reserve`](/docs/topics/cpp#b03-cpp-perf-string-reserve), [`b04-js-async-event-loop-blocking`](/docs/topics/javascript#b04-js-async-event-loop-blocking), [`b04-js-types-array-flat`](/docs/topics/javascript#b04-js-types-array-flat), [`b04-qt-signals-block`](/docs/topics/qt#b04-qt-signals-block), [`b06-docker-network-mode-none`](/docs/topics/docker#b06-docker-network-mode-none), [`b09-qt-signals-block-updates`](/docs/topics/qt#b09-qt-signals-block-updates), [`b12-js-async-stream-backpressure`](/docs/topics/javascript#b12-js-async-stream-backpressure), [`exp-cpp-perf-reserve-vector`](/docs/topics/cpp#exp-cpp-perf-reserve-vector), [`rf-data-driven`](/docs/topics/robotframework#rf-data-driven), [`sqd-foreign-data-wrapper`](/docs/topics/postgres#sqd-foreign-data-wrapper), [`sqd-jsonb-arrow-op`](/docs/topics/postgres#sqd-jsonb-arrow-op) (+1 muuta)

### CSV/JSON {#csv-json}

**CSV/JSON** — kaksi yleisintä tiedostomuotoa datan siirtoon: **Comma-Separated Values** (rivipohjainen tekstitaulukko) ja **JavaScript Object Notation** (hierarkkinen rakenne). Suurten CSV/JSON-tiedostojen parsiminen synkronisesti JavaScriptissä blokkaa event loopin; työ kannattaa pilkkoa osiin tai siirtää Web Workerille.

**Oppitunnit:** [`b04-js-async-event-loop-blocking`](/docs/topics/javascript#b04-js-async-event-loop-blocking)

### CTE {#cte}

**Common Table Expression** — SQL:n `WITH`-lauseke, joka nimeää alikyselyn pääkyselyä varten. PostgreSQL 12:sta alkaen CTE inlinataan oletuksena pääkyselyyn; `MATERIALIZED`-vihje pakottaa erilliseen materialisoituun välitulokseen.

**Oppitunnit:** [`b04-pg-explain-parallel`](/docs/topics/postgres#b04-pg-explain-parallel), [`sqd-cte-materialized-hint`](/docs/topics/postgres#sqd-cte-materialized-hint), [`sqd-cte-readability`](/docs/topics/postgres#sqd-cte-readability), [`sqd-filter-before-join`](/docs/topics/postgres#sqd-filter-before-join), [`sqd-readable-cte-names`](/docs/topics/postgres#sqd-readable-cte-names), [`sqd-recursive-cte-hierarchy`](/docs/topics/postgres#sqd-recursive-cte-hierarchy), [`sqd-subquery-vs-cte-same`](/docs/topics/postgres#sqd-subquery-vs-cte-same)

### CUPS {#cups}

**Common Unix Printing System** — Linux/Unix-järjestelmien tulostusarkkitehtuuri. Avahi/mDNS-selaus löytää verkkotulostimet `_ipp._tcp`-palvelutyypin avulla; löydetty URI lisätään CUPS:iin `lpadmin`-komennolla tai web-käyttöliittymällä (`http://localhost:631`).

**Oppitunnit:** [`b02-linux-avahi-browse-12`](/docs/topics/linux#b02-linux-avahi-browse-12), [`b03-linux-avahi-browse-services`](/docs/topics/linux#b03-linux-avahi-browse-services), [`b05-linux-avahi-browse`](/docs/topics/linux#b05-linux-avahi-browse), [`b06-linux-avahi-resolve-hostname`](/docs/topics/linux#b06-linux-avahi-resolve-hostname)

### CURSOR {#cursor}

**CURSOR** — SQL-mekanismi rivi kerrallaan -etenemiseen tulosjoukossa. Sovellustason tai stored-proceduuren CURSOR-silmukka on yleensä hitaampaa kuin set-pohjainen SQL; rekursiivinen CTE tai ikkunafunktio korvaa sen useimmiten tehokkaammin ilman rivikäyntiä.

**Oppitunnit:** [`sqd-recursive-cte-hierarchy`](/docs/topics/postgres#sqd-recursive-cte-hierarchy)

### CVE {#cve}

**Common Vulnerabilities and Exposures** — julkinen haavoittuvuustietokanta (NVD/MITRE). CVE-tunniste (esim. `CVE-2021-44228`) yksilöi haavoittuvuuden; `unattended-upgrades` asentaa tietoturvapäivitykset automaattisesti CVE-korjaukset mukaan lukien.

**Oppitunnit:** [`apt-unattended-upgrades`](/docs/topics/linux#apt-unattended-upgrades), [`apt-update-vs-upgrade`](/docs/topics/linux#apt-update-vs-upgrade), [`b03-scrum-tech-debt-backlog`](/docs/topics/scrum#b03-scrum-tech-debt-backlog), [`b07-docker-multistage-build`](/docs/topics/docker#b07-docker-multistage-build), [`b08-docker-scan-image`](/docs/topics/docker#b08-docker-scan-image), [`b09-docker-image-tag-pin`](/docs/topics/docker#b09-docker-image-tag-pin), [`b09-docker-net-internal`](/docs/topics/docker#b09-docker-net-internal)

### D3D11/HLSL {#d3d11-hlsl}

**D3D11/HLSL** — Microsoftin **Direct3D 11** -grafiikka-API ja sen shader-kieli **High-Level Shading Language**. Qt RHI kääntää GLSL-lähdekoodit automaattisesti HLSL:ksi Windows/D3D11-alustalla; CI-pipeline kannattaa kattaa sekä Windows (D3D11) että macOS (Metal) -buildit yhteensopivuuden varmistamiseksi.

**Oppitunnit:** [`b03-qt-shaders-rhi-fallback`](/docs/topics/qt#b03-qt-shaders-rhi-fallback)

### DAG {#dag}

**DAG** (Directed Acyclic Graph) — suunnattu syklitön verkko, jossa ei ole silmukoita. C++:n `shared_ptr`-omistusmalleissa DAG-rakenteet eivät aiheuta muistivuotoja, mutta syklisissä rakenteissa (esim. parent↔child) `weak_ptr` katkaisee viittaussyklin ja estää vuodon.

**Oppitunnit:** [`b06-cpp-weak-ptr-cycle`](/docs/topics/cpp#b06-cpp-weak-ptr-cycle)

### DATE {#date}

**DATE** — SQL:n päivämäärätyyppi ja -funktio. `DATE(created_at)` sarakkeessa tekee ehdosta ei-sargablen (indeksiä ei käytetä); sargable-muoto on `created_at >= '2024-01-01' AND created_at < '2024-01-02'`, jolloin indeksi voidaan hyödyntää.

**Oppitunnit:** [`sqd-sargable-where`](/docs/topics/postgres#sqd-sargable-where)

### DDL {#ddl}

**DDL** (Data Definition Language) — SQL-lauseet, jotka muuttavat tietokannan rakennetta: `CREATE`, `ALTER`, `DROP`. PostgreSQLissä DDL-operaatiot ottavat `ACCESS EXCLUSIVE` -lukon, joka blokkaa kaikki samanaikaiset kyselyt; siksi ne suoritetaan huoltoikkunassa tai `CONCURRENTLY`-vaihtoehtoa hyödyntäen.

**Oppitunnit:** [`b03-pg-locks-blocking-query`](/docs/topics/postgres#b03-pg-locks-blocking-query)

### DEALLOCATE {#deallocate}

**DEALLOCATE** — PostgreSQL-komento, joka vapauttaa aiemmin `PREPARE`-komennolla luodun prepared statement -suunnitelman. `DEALLOCATE ALL` poistaa kaikki istunnon valmiit suunnitelmat, mikä pakottaa uuden suunnitelman valinnan ja korjaa generic plan -ongelmia.

**Oppitunnit:** [`b06-pg-explain-generic-plan`](/docs/topics/postgres#b06-pg-explain-generic-plan)

### DEEP {#deep}

**DEEP** (Detailed enough, Emergent, Estimated, Prioritized) — Mike Cohnin muistisana hyvälle product backlogille. DEEP-backlog on riittävästi kuvattu, elää tarpeiden mukaan, sisältää arviot ja on priorisoitu arvon mukaan — ei FIFO-järjestyksessä.

**Oppitunnit:** [`b05-scrum-backlog-order`](/docs/topics/scrum#b05-scrum-backlog-order)

### DGPS {#dgps}

**Differential GPS** — differentiaalinen paikannus, jossa tunnetulla tukiasemalla mitatut korjaukset lähetetään liikkuvalle vastaanottimelle. Vähentää yhteisiä virheitä (rata, kello, ionosfääri lyhyillä baselineilla) tyypillisesti sub-metri–metri -tarkkuuteen.

**Oppitunnit:** [`space-pos-dgps`](/docs/topics/space#space-pos-dgps)

### DHCP {#dhcp}

**Dynamic Host Configuration Protocol** — protokolla, joka jakaa IP-osoitteet, yhdyskäytävän ja nimipalvelimen automaattisesti verkkolaitteille. DHCP-lease voi ylikirjoittaa `/etc/resolv.conf`:in; NetworkManager-ylikäytäntö `dns=none` estää tämän.

**Oppitunnit:** [`avahi-mdns`](/docs/topics/linux#avahi-mdns), [`b02-linux-network-resolv-10`](/docs/topics/linux#b02-linux-network-resolv-10), [`b03-linux-avahi-publish-service`](/docs/topics/linux#b03-linux-avahi-publish-service), [`b08-linux-network-nmcli`](/docs/topics/linux#b08-linux-network-nmcli), [`b08-linux-systemd-requires`](/docs/topics/linux#b08-linux-systemd-requires), [`b09-linux-systemd-after-before`](/docs/topics/linux#b09-linux-systemd-after-before), [`b12-linux-arp-gratuitous-duplicate`](/docs/topics/linux#b12-linux-arp-gratuitous-duplicate), [`b12-linux-tcp-udp-handshake`](/docs/topics/linux#b12-linux-tcp-udp-handshake), [`docker-macvlan`](/docs/topics/docker#docker-macvlan), [`exp-docker-net-macvlan`](/docs/topics/docker#exp-docker-net-macvlan), [`systemd-after-before`](/docs/topics/linux#systemd-after-before), [`exp-linux-avahi-printer-discovery`](/docs/topics/linux#exp-linux-avahi-printer-discovery) (+1 muuta)

### DHCP/NM {#dhcp-nm}

**DHCP / NetworkManager** — yhdistelmäviittaus DHCP-protokollaan (Dynamic Host Configuration Protocol) ja NetworkManager-palveluun. NetworkManager hakee IP-osoitteen, reitit ja DNS-hakuosoitelistan DHCP:llä; `resolv.conf`-tiedoston `search`-lista tulee tyypillisesti DHCP/NM-konfiguraatiosta.

**Oppitunnit:** [`b05-linux-network-resolv-search`](/docs/topics/linux#b05-linux-network-resolv-search), [`exp-linux-network-resolv-search`](/docs/topics/linux#exp-linux-network-resolv-search)

### DI {#di}

**DI** (Dependency Injection) — suunnittelumalli, jossa riippuvuudet syötetään ulkoa konstruktorin tai funktion parametrina eikä luoda sisällä. Rustissa traitin ja DI:n yhdistelmä mahdollistaa `mockall`-kirjaston automock-generaattorin tai manuaalisen fake-toteutuksen yksikkötestausta varten.

**Oppitunnit:** [`rust-testing-mock-trait`](/docs/topics/rust#rust-testing-mock-trait)

### DLL {#dll}

**Dynamic Link Library** — Windowsin jaettu kirjasto (`.dll`). Qt-sovelluksen Windows-deploy vaatii `windeployqt`-työkalun, joka kopioi tarvittavat Qt DLL:t käynnistyskansioon. C++-rajapinnassa STL-tyyppejä ei tule exportata DLL:stä eri kääntäjäversioiden välisten ABI-yhteensopimattomuuksien takia.

**Oppitunnit:** [`b10-cpp-portability-abi-01`](/docs/topics/cpp#b10-cpp-portability-abi-01), [`qt-native-deploy`](/docs/topics/qt#qt-native-deploy)

### DLL/SO {#dll-so}

**DLL/SO** — alustariippuvaiset jaetut kirjastot: **Dynamic Link Library** (Windows, `.dll`) ja **Shared Object** (Linux, `.so`). C++:n PIMPL-idiomi suojaa ABI-yhteensopivuutta: toteutusmuutokset eivät riko kirjaston julkista rajapintaa eivätkä pakota asiakaskoodin uudelleenkääntämistä.

**Oppitunnit:** [`b07-cpp-pimpl-abi`](/docs/topics/cpp#b07-cpp-pimpl-abi)

### DML {#dml}

**Data Manipulation Language** — SQL-komentoryhmä tietojen muokkaamiseen: `INSERT`, `UPDATE`, `DELETE` ja `MERGE`. `VACUUM FULL` pitää taulun eksklusiivisessa lukossa koko operaation ajan, jolloin kaikki DML-operaatiot blokkaantuvat; `CREATE INDEX CONCURRENTLY` välttää DML-blokkauksen.

**Oppitunnit:** [`b04-pg-indexes-concurrent-create`](/docs/topics/postgres#b04-pg-indexes-concurrent-create), [`b05-pg-vacuum-full-lock`](/docs/topics/postgres#b05-pg-vacuum-full-lock), [`b09-pg-index-unused-drop`](/docs/topics/postgres#b09-pg-index-unused-drop)

### DNAT {#dnat}

**Destination Network Address Translation** — verkkopakettin kohde-IP:n tai -portin muuntaminen. Docker-porttikartoitus (`-p 8080:80`) käyttää DNAT-sääntöjä `iptables`/`nftables`:ssa. Host mode -verkossa DNAT-kustannusta ei synny, mikä hyödyttää viive-herkkiä sovelluksia.

**Oppitunnit:** [`b02-docker-net-host-08`](/docs/topics/docker#b02-docker-net-host-08), [`b05-docker-net-host-mode`](/docs/topics/docker#b05-docker-net-host-mode), [`b07-linux-network-firewall-nft`](/docs/topics/linux#b07-linux-network-firewall-nft), [`docker-host-network`](/docs/topics/docker#docker-host-network), [`exp-linux-avahi-service-xml`](/docs/topics/linux#exp-linux-avahi-service-xml)

### DNS {#dns}

**Domain Name System** — nimipalvelujärjestelmä, joka muuntaa isäntänimet (esim. `example.com`) IP-osoitteiksi. Lähiverkossa Avahi toteuttaa mDNS-pohjaisen hajautetun nimeämisen ilman keskitettyä DNS-palvelinta (RFC 6762).

**Oppitunnit:** [`avahi-mdns`](/docs/topics/linux#avahi-mdns), [`b02-docker-net-alias-10`](/docs/topics/docker#b02-docker-net-alias-10), [`b02-docker-net-bridge-06`](/docs/topics/docker#b02-docker-net-bridge-06), [`b02-docker-net-compose-07`](/docs/topics/docker#b02-docker-net-compose-07), [`b02-linux-network-resolv-10`](/docs/topics/linux#b02-linux-network-resolv-10), [`b03-docker-net-ipv6-disable`](/docs/topics/docker#b03-docker-net-ipv6-disable), [`b03-linux-avahi-hostname-local`](/docs/topics/linux#b03-linux-avahi-hostname-local), [`b03-linux-avahi-publish-service`](/docs/topics/linux#b03-linux-avahi-publish-service), [`b03-linux-network-ip-route-table`](/docs/topics/linux#b03-linux-network-ip-route-table), [`b03-linux-network-tcpdump-filter`](/docs/topics/linux#b03-linux-network-tcpdump-filter), [`b04-docker-network-alias`](/docs/topics/docker#b04-docker-network-alias), [`b04-linux-resolv-stub`](/docs/topics/linux#b04-linux-resolv-stub) (+45 muuta)

### DOP {#dop}

**Dilution of Precision** — satelliittigeometrian kerroin, joka kertoo miten mittausvirheet vahvistuvat paikkavirheeksi. HDOP (vaaka), VDOP (pysty), PDOP (3D). Pienempi DOP on parempi.

**Oppitunnit:** [`space-sig-dop`](/docs/topics/space#space-sig-dop)

### DOWN {#down}

Verkkorajapinnan administratiivinen tila, jossa rajapinta on kytketty pois päältä (`ip link set eth0 down`). DOWN-tilassa rajapinta ei lähetä eikä vastaanota liikennettä eikä vastaa ARP-kyselyihin. Vasta `ip link set eth0 up` palauttaa yhteyden.

**Oppitunnit:** [`b12-linux-network-ip-link-admin`](/docs/topics/linux#b12-linux-network-ip-link-admin)

### DPI {#dpi}

**Dots Per Inch** — näytön resoluution yksikkö (pisteitä tuumaa kohden). Qt Widgetsissä korkea DPI (HiDPI-skaalaus) vaatii `sizeHint()`-ylikirjoituksen, joka käyttää `QFontMetrics`-arvoja — muuten teksti leikkautuu tai widget on liian pieni.

**Oppitunnit:** [`exp-qt-widgets-size-hint`](/docs/topics/qt#exp-qt-widgets-size-hint), [`qt-native-high-dpi`](/docs/topics/qt#qt-native-high-dpi)

### DRY {#dry}

**Don't Repeat Yourself** — ohjelmointiperiaate, jonka mukaan jokainen tieto tai logiikka esitetään järjestelmässä vain yhdessä paikassa. TypeScriptissä `extends` ja utility-tyypit (`Partial`, `Pick`) mahdollistavat DRY:n; SQL:ssä CTE vähentää toisteista logiikkaa kyselyissä.

**Oppitunnit:** [`b06-cpp-attributes-fallthrough`](/docs/topics/cpp#b06-cpp-attributes-fallthrough), [`b12-ts-interface-extends`](/docs/topics/javascript#b12-ts-interface-extends), [`sqd-cte-readability`](/docs/topics/postgres#sqd-cte-readability)

### DTO {#dto}

**Data Transfer Object** — suunnittelumalli, jossa erillinen olio kantaa dataa kerrosten (API ↔ sovellus ↔ tietokanta) välillä. TypeScriptissä `Partial<UserDTO>` tekee kaikista kentistä valinnaisia päivitys-DTO:ta varten; `Readonly<T>` tekee DTO:sta immuutin compile-time-tasolla.

**Oppitunnit:** [`b12-ts-mapped-type`](/docs/topics/javascript#b12-ts-mapped-type), [`b12-ts-utility-partial`](/docs/topics/javascript#b12-ts-utility-partial)

### EBS {#ebs}

**Elastic Block Store** — AWS:n lohkotallennuspalvelu, joka tarjoaa persistentin levyn EC2-instansseille. Docker-volyymit voidaan liittää EBS-levylle volumepluginin (esim. RexRay) avulla multi-host-ympäristöissä.

**Oppitunnit:** [`b03-docker-vol-named-vs-bind`](/docs/topics/docker#b03-docker-vol-named-vs-bind), [`b06-docker-volume-driver`](/docs/topics/docker#b06-docker-volume-driver), [`b09-docker-vol-driver-local`](/docs/topics/docker#b09-docker-vol-driver-local)

### ECEF {#ecef}

**Earth-Centered, Earth-Fixed** — maakeskinen, maan mukana pyörivä suorakulmainen X/Y/Z-koordinaatisto. GNSS-ratkaisut muodostuvat usein ECEF:ssä ennen muunnosta lat/lon/korkeus -muotoon.

**Oppitunnit:** [`space-datum-ecef`](/docs/topics/space#space-datum-ecef)

### EGNOS {#egnos}

**European Geostationary Navigation Overlay Service** — Euroopan SBAS: GEO-satelliitit lähettävät GPS-korjauksia ja eheysinformaatiota ilmailuun ja muihin käyttäjiin.

**Oppitunnit:** [`space-gnss-sbas-egnos`](/docs/topics/space#space-gnss-sbas-egnos)

### EPSG {#epsg}

**European Petroleum Survey Group** (nykyisin IOGP) -koodisto koordinaattijärjestelmille. Esim. EPSG:4326 = WGS84 lon/lat, EPSG:3857 = Web Mercator, EPSG:3067 = ETRS-TM35FIN.

**Oppitunnit:** [`space-map-epsg`](/docs/topics/space#space-map-epsg), [`space-map-tm35fin`](/docs/topics/space#space-map-tm35fin)

### EPSILON {#epsilon}

**EPSILON** (`Number.EPSILON`) — pienin erotus luvun 1 ja seuraavan IEEE 754 -liukuluvun välillä JavaScriptissä (~2,22 × 10⁻¹⁶). Liukulukujen yhtäsuuruutta ei pidä tarkistaa `===`-operaattorilla; `Math.abs(a - b) < Number.EPSILON` tai erillinen kirjasto on tarpeen esimerkiksi rahoituslaskennassa.

**Oppitunnit:** [`b04-js-types-number-precision`](/docs/topics/javascript#b04-js-types-number-precision)

### ERP {#erp}

**ERP** (Enterprise Resource Planning) — toiminnanohjausjärjestelmä, joka yhdistää tuotannon, varaston, talouden ja muut liiketoimintaprosessit yhteen tietokantaan. SQL-kyselyissä ERP-järjestelmistä kannattaa valita vain tarvittavat sarakkeet (`SELECT col1, col2`) eikä `SELECT *`, erityisesti laajoissa vientiraporteissa.

**Oppitunnit:** [`sqd-select-columns-only`](/docs/topics/postgres#sqd-select-columns-only)

### ESM/CJS {#esm-cjs}

**ECMAScript Modules / CommonJS** — kaksi kilpailevaa Node.js-moduulijärjestelmää. `package.json`:n `exports`-kentässä voidaan erottaa ESM (`import`/`export`) ja CJS (`require`) erillisinä entry pointeina `"import"`- ja `"require"`-ehdoilla. Yhteentoimivuusongelmat ovat yleisiä kirjastopaketeissa, jotka tukevat molempia.

**Oppitunnit:** [`b12-js-modules-package-exports`](/docs/topics/javascript#b12-js-modules-package-exports), [`b09-js-modules-esm-cjs-interop`](/docs/topics/javascript#b09-js-modules-esm-cjs-interop)

### ESTABLISHED {#established}

**ESTABLISHED** — TCP-yhteyden tila, jossa kolmisuuntainen kättely on valmis ja data voi kulkea molempiin suuntiin. Palomuurisäännöissä `state ESTABLISHED,RELATED` sallii vastauspakettien paluun automaattisesti ilman erillistä lähtevää sääntöä.

**Oppitunnit:** [`b12-linux-tcp-udp-handshake`](/docs/topics/linux#b12-linux-tcp-udp-handshake)

### ETL {#etl}

**Extract, Transform, Load** — tietoprosessointimalli, jossa data haetaan lähteestä, muunnetaan ja ladataan kohdetietokantaan. Yöllisen ETL-latauksen jälkeen PostgreSQL tarvitsee `ANALYZE`-komennon, jotta query planner saa ajantasaiset tilastot raportteja varten.

**Oppitunnit:** [`b05-pg-vacuum-analyze-after-bulk`](/docs/topics/postgres#b05-pg-vacuum-analyze-after-bulk), [`b12-js-async-stream-backpressure`](/docs/topics/javascript#b12-js-async-stream-backpressure), [`exp-pg-explain-stats-stale`](/docs/topics/postgres#exp-pg-explain-stats-stale), [`sqd-foreign-data-wrapper`](/docs/topics/postgres#sqd-foreign-data-wrapper)

### ETRS89 {#etrs89}

**European Terrestrial Reference System 1989** — Euroopan mannerlaattaan kiinnitetty geodeettinen datumi. Suomen EUREF-FIN ja ETRS-TM35FIN nojaavat siihen; erona ITRF/WGS84-epochien laattaliike.

**Oppitunnit:** [`space-datum-etrs89`](/docs/topics/space#space-datum-etrs89), [`space-map-tm35fin`](/docs/topics/space#space-map-tm35fin)

### EXISTS/IN {#exists-in}

**EXISTS/IN** — SQL:n alikyselyoperaattorit. `EXISTS` palauttaa `TRUE` heti kun alikyselyssä löytyy yksikin rivi (semi-join, tehokas); `IN` vertaa arvoa listaan tai alikyselyyn. Suuria joukkoja vastaan `EXISTS` on usein nopeampi, erityisesti kun alikyselytaululla on indeksi join-sarakkeelle.

**Oppitunnit:** [`sqd-semi-join-distinct`](/docs/topics/postgres#sqd-semi-join-distinct)

### EXISTS/NOT {#exists-not}

**EXISTS / NOT EXISTS** — SQL:n alikyselykonstruktit olemassaolon ja puuttumisen tarkistamiseen. `NOT EXISTS` on anti-join: se palauttaa rivit, joille alikyselystä ei löydy vastaavuutta. Toimii oikein myös NULL-arvojen kanssa toisin kuin `NOT IN`, joka palauttaa tyhjän joukon jos alikyselyssä on yhtään NULL-riviä.

**Oppitunnit:** [`sqd-not-exists-anti`](/docs/topics/postgres#sqd-not-exists-anti)

### EXTENSION {#extension}

**EXTENSION** — PostgreSQL:n laajennusmekanismi, jolla aktivoidaan lisämoduuleja (`CREATE EXTENSION`). `pg_stat_statements` vaatii `shared_preload_libraries`-parametrin asettamisen `postgresql.conf`:iin ennen palvelimen käynnistystä, minkä jälkeen `CREATE EXTENSION pg_stat_statements` aktivoi SQL-tilastoinnin.

**Oppitunnit:** [`b03-pg-config-statements-ext`](/docs/topics/postgres#b03-pg-config-statements-ext)

### FAILED {#failed}

Linux-kernelin ARP-naapuritila, joka merkitään kun ARP-vastauksia ei saada määräajassa. `ip neigh show` paljastaa FAILED-tilan — korjaus: `ip neigh del <ip> dev <iface>` ja uusi `ping` pakottaa ARP-kyselyn.

**Oppitunnit:** [`b12-linux-arp-failed-state`](/docs/topics/linux#b12-linux-arp-failed-state)

### FBO {#fbo}

**Framebuffer Object** — OpenGL-laajennos off-screen-renderöintiin omalle tekstuurille tai renderbufferille (ei oletusnäytölle). Qt:n `QOpenGLWidget` tarvitsee `makeCurrent()`-kutsun ennen raakoja OpenGL-kutsuja; FBO:lle piirrettäessä `bindFramebuffer()` asettaa kohteen. FBO:t ovat keskeisiä post-processing-efektien toteutuksessa.

**Oppitunnit:** [`b05-qt-opengl-makecurrent`](/docs/topics/qt#b05-qt-opengl-makecurrent), [`b07-qt-opengl-context`](/docs/topics/qt#b07-qt-opengl-context)

### FDW {#fdw}

**Foreign Data Wrapper** — PostgreSQL-laajennus, joka mahdollistaa ulkoisten tietolähteiden (toinen PG-instanssi, CSV, S3, Redis) kyselemisen SQL:llä kuin paikallisina tauluina. `postgres_fdw` on yleisin; S3/Parquet-datalle on erikoistuneita wrappereita.

**Oppitunnit:** [`sqd-foreign-data-wrapper`](/docs/topics/postgres#sqd-foreign-data-wrapper)

### FFI {#ffi}

**Foreign Function Interface** — mekanismi kahden ohjelmointikielen väliseen kutsumiseen. Rustissa `unsafe`-lohkot tarvitaan C-FFI:ssä; `Box::into_raw()` siirtää omistajuuden C-koodille ja `Box::from_raw()` ottaa sen takaisin muistivuotojen estämiseksi.

**Oppitunnit:** [`rust-ownership-box-heap`](/docs/topics/rust#rust-ownership-box-heap), [`rust-ownership-drop`](/docs/topics/rust#rust-ownership-drop), [`rust-safety-unsafe-block`](/docs/topics/rust#rust-safety-unsafe-block)

### FIFO {#fifo}

**FIFO** (First In, First Out) — järjestysperiaate, jossa vanhin kohde käsitellään ensin. Scrumin product backlog ei toimi FIFO-periaatteella; tarinat järjestetään liikearvon, riskin ja riippuvuuksien mukaan saapumisjärjestyksestä riippumatta.

**Oppitunnit:** [`b05-scrum-backlog-order`](/docs/topics/scrum#b05-scrum-backlog-order)

### FILLFACTOR {#fillfactor}

PostgreSQL-taulun täyttösuhde (1–100), joka määrittää kuinka täyteen heap-sivut täytetään INSERT-operaatioissa. Matalampi `fillfactor` (esim. 70) jättää tilaa HOT-päivityksille ja vähentää taulun bloattia kirjoitusintensiivisissä tauluissa; se on storage-parametri, ei query-GUC.

**Oppitunnit:** [`b03-pg-indexes-fillfactor-update`](/docs/topics/postgres#b03-pg-indexes-fillfactor-update), [`b06-pg-indexes-reindex-concurrently`](/docs/topics/postgres#b06-pg-indexes-reindex-concurrently), [`b09-pg-vacuum-autovacuum-tuning`](/docs/topics/postgres#b09-pg-vacuum-autovacuum-tuning)

### FIN {#fin}

TCP-yhteyden sulkemissignaali (FIN-lippu). Kun etäpää lähettää FIN:n, paikallinen yhteys siirtyy `CLOSE_WAIT`-tilaan — sovelluksen pitää kutsua `close()` saattaakseen sulkemisen loppuun. Paljon `CLOSE_WAIT`-yhteyksiä `ss`-komennon listassa viittaa sovellusbuggiin, jossa socket jätetään sulkematta.

**Oppitunnit:** [`b03-linux-network-ss-timers`](/docs/topics/linux#b03-linux-network-ss-timers), [`b12-linux-tcp-close-wait-leak`](/docs/topics/linux#b12-linux-tcp-close-wait-leak)

### FOLLOWING {#following}

**FOLLOWING** — SQL-ikkunafunktioiden kehysmäärittelyssä käytetty suuntaavainsana. `ROWS BETWEEN CURRENT ROW AND N FOLLOWING` laskee N seuraavan rivin sisältävän ikkunan; `UNBOUNDED FOLLOWING` ulottaa kehyksen partitioin loppuun asti.

**Oppitunnit:** [`sqd-window-frame-rows`](/docs/topics/postgres#sqd-window-frame-rows)

### FORWARD/OUTPUT {#forward-output}

**FORWARD/OUTPUT** — Linux-palomuurin (iptables/nftables) ketjunimet. `INPUT` käsittelee paikalliselle prosessille saapuvat paketit, `OUTPUT` lähtevät ja `FORWARD` reititetyt paketit. VPN-clientin pushed routes ja cloud load balancerin portit voivat vaikuttaa FORWARD-ketjun sääntöihin.

**Oppitunnit:** [`b02-linux-network-route-09`](/docs/topics/linux#b02-linux-network-route-09)

### FPI {#fpi}

**Full Page Image** — WAL-merkintä, jossa PostgreSQL kirjoittaa koko 8 kt levyblokin lokiin ensimmäisen muutoksen yhteydessä jokaisen checkpointin jälkeen. FPI suojaa osittaisilta kirjoitusvirheiltä kaatumisessa, mutta kasvattaa WAL-volyymiä erityisesti kirjoitusintensiiviissä työkuormissa. `full_page_writes`-parametrilla ohjataan FPI-kirjoitusten käyttäytymistä.

**Oppitunnit:** [`b06-pg-explain-wal-fpi`](/docs/topics/postgres#b06-pg-explain-wal-fpi)

### FPS {#fps}

**Frames Per Second** — ruudunpäivitysnopeus, kuinka monta kuvaa renderöidään sekunnissa. Qt OpenGL -sovelluksessa `QTimer` tai vsync-mekanismi rajoittaa FPS:n 60:een; tight loop ilman odotusta (`glFlush`-kutsut jatkuvasti) kuluttaa CPU:ta tarpeettomasti.

**Oppitunnit:** [`b07-qt-opengl-vsync`](/docs/topics/qt#b07-qt-opengl-vsync), [`b08-qt-opengl-vsync`](/docs/topics/qt#b08-qt-opengl-vsync)

### FQDN {#fqdn}

**Fully Qualified Domain Name** — täydellinen toimialuenimi, joka sisältää kaikki domeeniosat ja loppupisteen (esim. `server.example.com.`). `/etc/resolv.conf`:in `search`-asetus täydentää lyhyet nimet FQDN:ksi; DHCP tai NetworkManager voi ylikirjoittaa sen.

**Oppitunnit:** [`b02-linux-network-resolv-10`](/docs/topics/linux#b02-linux-network-resolv-10), [`b05-docker-net-dns-custom`](/docs/topics/docker#b05-docker-net-dns-custom), [`b05-linux-network-resolv-search`](/docs/topics/linux#b05-linux-network-resolv-search), [`b08-linux-resolv-search`](/docs/topics/linux#b08-linux-resolv-search), [`exp-linux-network-resolv-search`](/docs/topics/linux#exp-linux-network-resolv-search), [`linux-resolv-search`](/docs/topics/linux#linux-resolv-search)

### FRAME {#frame}

**FRAME** (window frame) — SQL-ikkunafunktion määritelmä siitä, mitkä rivit ovat mukana laskussa. `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` on yleisin kehys juoksevalle summalle; `RANGE`-pohjainen kehys perustuu arvoihin eikä rivimäärään.

**Oppitunnit:** [`sqd-running-total`](/docs/topics/postgres#sqd-running-total)

### FREEZE {#freeze}

PostgreSQL-operaatio, joka merkitsee rivit jäädytetyiksi transaktioidenkehityksen ylivuodon (XID wraparound) estämiseksi. `VACUUM FREEZE` tai autovacuumin `vacuum_freeze_min_age`-parametri pitää huolen, ettei tietokanta joudu pakkosammutukseen.

**Oppitunnit:** [`b02-pg-vacuum-wrap-10`](/docs/topics/postgres#b02-pg-vacuum-wrap-10), [`b07-pg-vacuum-freeze`](/docs/topics/postgres#b07-pg-vacuum-freeze), [`exp-pg-vacuum-bloat-wraparound`](/docs/topics/postgres#exp-pg-vacuum-bloat-wraparound), [`b05-pg-vacuum-wraparound`](/docs/topics/postgres#b05-pg-vacuum-wraparound), [`b09-pg-vacuum-freeze-age`](/docs/topics/postgres#b09-pg-vacuum-freeze-age)

### FS {#fs}

**File System** — tiedostojärjestelmä; C++:n kontekstissa lyhenne `std::filesystem`-nimiavaruudelle (`<filesystem>`, C++17). `std::filesystem::path` korvaa manuaalisen merkkijonoyhdistelyn ja POSIX-spesifiset tiedosto-operaatiot kannettavalla tavalla.

**Oppitunnit:** [`b11-cpp-std-filesystem`](/docs/topics/cpp#b11-cpp-std-filesystem)

### FTP {#ftp}

**FTP** (File Transfer Protocol) — perinteinen tiedostonsiirtoprotokolla (portit 20/21). Verkkolähitulostimet julkistetaan nykyisin mDNS/DNS-SD-protokollilla (Avahi/Bonjour), ei FTP:llä; `avahi-browse _ipp._tcp` löytää IPP-tulostimet lähiverkosta.

**Oppitunnit:** [`exp-linux-avahi-printer-discovery`](/docs/topics/linux#exp-linux-avahi-printer-discovery)

### GARP {#garp}

**GARP** (Gratuitous ARP) — ARP-viesti, jonka lähettäjä lähettää omasta IP-osoitteestaan ilman ulkoista pyyntöä. Käytetään IP-osoitteen muutosten, HA-failoverin ja VM-migraation jälkeen naapurien ARP-välimuistin päivittämiseen uudella MAC-osoitteen sidonnalla.

**Oppitunnit:** [`b12-linux-arp-flush-migration`](/docs/topics/linux#b12-linux-arp-flush-migration)

### GB {#gb}

**Gigabyte** — 1 024 megatavua. Docker build context voi kasvaa gigatavuihin `.dockerignore`-tiedoston puuttuessa — esimerkiksi `node_modules` voi helposti ylittää 2 GB ja hidastaa buildia merkittävästi.

**Oppitunnit:** [`b02-pg-config-shared-14`](/docs/topics/postgres#b02-pg-config-shared-14), [`b03-docker-dockerignore-build`](/docs/topics/docker#b03-docker-dockerignore-build), [`b03-pg-config-effective-cache`](/docs/topics/postgres#b03-pg-config-effective-cache), [`b04-pg-config-effective-cache`](/docs/topics/postgres#b04-pg-config-effective-cache), [`b04-pg-indexes-concurrent-create`](/docs/topics/postgres#b04-pg-indexes-concurrent-create), [`b05-dockerfile-multistage-size`](/docs/topics/docker#b05-dockerfile-multistage-size), [`b05-pg-config-shared-buffers`](/docs/topics/postgres#b05-pg-config-shared-buffers), [`b05-pg-vacuum-full-lock`](/docs/topics/postgres#b05-pg-vacuum-full-lock), [`b06-docker-build-context-size`](/docs/topics/docker#b06-docker-build-context-size), [`b06-docker-logging-rotation`](/docs/topics/docker#b06-docker-logging-rotation), [`b06-pg-config-huge-pages`](/docs/topics/postgres#b06-pg-config-huge-pages), [`b06-pg-vacuum-autovacuum-scale`](/docs/topics/postgres#b06-pg-vacuum-autovacuum-scale) (+9 muuta)

### GCC {#gcc}

**GNU Compiler Collection** — avoimen lähdekoodin C/C++-kääntäjäpaketti. `g++` on C++-kääntäjä; GCC 13+ tukee C++-moduuleja. `-Wall -Wextra -Werror` -liput otetaan käyttöön CI:ssä, jotta varoitukset muuttuvat buildivioiksi.

**Oppitunnit:** [`b03-cpp-cr-override-keyword`](/docs/topics/cpp#b03-cpp-cr-override-keyword), [`b08-cpp-modules-headers`](/docs/topics/cpp#b08-cpp-modules-headers), [`b09-cpp-switch-fallthrough`](/docs/topics/cpp#b09-cpp-switch-fallthrough), [`b11-cpp-braces-required`](/docs/topics/cpp#b11-cpp-braces-required), [`b11-cpp-ccache-ci`](/docs/topics/cpp#b11-cpp-ccache-ci), [`b11-cpp-std-filesystem`](/docs/topics/cpp#b11-cpp-std-filesystem), [`b11-cpp-werror-policy`](/docs/topics/cpp#b11-cpp-werror-policy), [`safety-static-cast`](/docs/topics/cpp#safety-static-cast)

### GCS {#gcs}

**Google Cloud Storage** — Googlen objektitallennuspalvelu pilvessä. Docker-volumejen varmuuskopiot (tar-arkistot) voidaan siirtää GCS:ään `gsutil cp`-komennolla tai CI-askeleella; säilytyspolitiikka (retention) konfiguroidaan bucket-tasolla.

**Oppitunnit:** [`b05-docker-vol-named-backup`](/docs/topics/docker#b05-docker-vol-named-backup), [`b10-docker-volumes-backup-01`](/docs/topics/docker#b10-docker-volumes-backup-01)

### GDPR {#gdpr}

**General Data Protection Regulation** — EU:n yleinen tietosuoja-asetus (2016/679), joka säätelee henkilötietojen käsittelyä. Sovelluskoodissa GDPR vaikuttaa lokitukseen (pcap ei saa tallentaa henkilötietoja), tietokantakyselyihin (pseudonymisointi, sarakemaskit) ja tietojen säilytysaikoihin.

**Oppitunnit:** [`b03-pg-config-ssl-mode`](/docs/topics/postgres#b03-pg-config-ssl-mode), [`b09-linux-net-tcpdump-incident`](/docs/topics/linux#b09-linux-net-tcpdump-incident), [`sqd-view-column-mask`](/docs/topics/postgres#sqd-view-column-mask)

### GET {#get}

HTTP-protokollan lukupyyntömetodi — hakee resurssin palvelimelta muuttamatta tilaa. `fetch(url)` lähettää oletuksena GET-pyynnön; debounce estää turhien GET-pyyntöjen tulvan hakukentässä. CORS:n kannalta GET on "simple request", joka ei vaadi OPTIONS-preflightia.

**Oppitunnit:** [`b03-js-async-debounce-fetch`](/docs/topics/javascript#b03-js-async-debounce-fetch), [`b05-js-fetch-cors-preflight`](/docs/topics/javascript#b05-js-fetch-cors-preflight), [`b12-js-async-retry-backoff`](/docs/topics/javascript#b12-js-async-retry-backoff), [`sqd-foreign-data-wrapper`](/docs/topics/postgres#sqd-foreign-data-wrapper), [`prod-sec-xss`](/docs/topics/security#prod-sec-xss)

### GH {#gh}

**GH** (GitHub / GitHub CLI) — Microsoftin Git-hostingpalvelu ja sen komentorivityökalu `gh`. CI-pipelinen salaisuudet tallennetaan GitHub Secrets -ominaisuuteen, joka peittää arvojen näkymisen lokitulosteessa; `gh secret set` hallinnoi avaimia komentorivillä.

**Oppitunnit:** [`ci-secret-management`](/docs/topics/git#ci-secret-management)

### GIL {#gil}

**Global Interpreter Lock** — Pythonin CPython-tulkin sisäinen lukko, joka estää useita säikeitä ajamasta Python-bytekoodia samanaikaisesti. GIL tekee yksittäisistä Python-säikeistä turvallisia muistinhallinnan kannalta, mutta rajoittaa CPU-rinnakkaisuutta moniydinympäristöissä. Rustin borrow checker korvaa GIL-tyyppisen lukkomekanismin kääntöaikaisella tarkistuksella.

**Oppitunnit:** [`rust-borrow-mut`](/docs/topics/rust#rust-borrow-mut), [`rust-safety-borrow-checker`](/docs/topics/rust#rust-safety-borrow-checker)

### GIN {#gin}

**Generalized Inverted Index** — PostgreSQLin indeksityyppi moniarvoisia rakenteita varten (arrays, `jsonb`, full-text). GIN hajottaa arvon avaimiin ja rakentaa käänteisindeksin; erityisen tehokas `@>` (containment) ja `?` (key exists) -operaattoreille.

**Oppitunnit:** [`b02-pg-indexes-btree-02`](/docs/topics/postgres#b02-pg-indexes-btree-02), [`b03-pg-indexes-gin-jsonb`](/docs/topics/postgres#b03-pg-indexes-gin-jsonb), [`b04-pg-indexes-gin-jsonb`](/docs/topics/postgres#b04-pg-indexes-gin-jsonb), [`b07-pg-index-btree-vs-gin`](/docs/topics/postgres#b07-pg-index-btree-vs-gin), [`sqd-json-path-query`](/docs/topics/postgres#sqd-json-path-query), [`sqd-jsonb-arrow-op`](/docs/topics/postgres#sqd-jsonb-arrow-op), [`sqd-jsonb-containment`](/docs/topics/postgres#sqd-jsonb-containment), [`sqd-jsonb-gin-index`](/docs/topics/postgres#sqd-jsonb-gin-index), [`b06-pg-indexes-brin-timeseries`](/docs/topics/postgres#b06-pg-indexes-brin-timeseries)

### GL {#gl}

**Graphics Library** — OpenGL-rajapinnan funktioprefiksi (`gl*`, kuten `glBindBuffer`, `glDrawArrays`). Kaikki GL-kutsut on tehtävä säikeessä, jolle OpenGL-konteksti on aktivoitu; Qt:n `QOpenGLFunctions`-periytyminen kapsuloi alustakohtaiset funktio-osoittimet.

**Oppitunnit:** [`b02-qt-opengl-context-11`](/docs/topics/qt#b02-qt-opengl-context-11), [`b03-qt-opengl-core-profile`](/docs/topics/qt#b03-qt-opengl-core-profile), [`b03-qt-shaders-rhi-fallback`](/docs/topics/qt#b03-qt-shaders-rhi-fallback), [`b04-qt-opengl-share-context`](/docs/topics/qt#b04-qt-opengl-share-context), [`b05-qt-opengl-context-share`](/docs/topics/qt#b05-qt-opengl-context-share), [`b05-qt-opengl-makecurrent`](/docs/topics/qt#b05-qt-opengl-makecurrent), [`b06-qt-opengl-pixel-format`](/docs/topics/qt#b06-qt-opengl-pixel-format), [`b07-qt-opengl-context`](/docs/topics/qt#b07-qt-opengl-context), [`b08-qt-opengl-context-share`](/docs/topics/qt#b08-qt-opengl-context-share), [`b08-qt-opengl-vsync`](/docs/topics/qt#b08-qt-opengl-vsync), [`b09-qt-opengl-context-share`](/docs/topics/qt#b09-qt-opengl-context-share), [`exp-qt-opengl-context-thread`](/docs/topics/qt#exp-qt-opengl-context-thread) (+4 muuta)

### GLSL {#glsl}

**OpenGL Shading Language** — C-tyyppinen shaderien ohjelmointikieli GPU:lle (`.vert`, `.frag`-tiedostot). Qt 6:ssa GLSL-tiedostot käännetään `qsb`-työkalulla `.qsb`-paketiksi, jonka RHI lataa runtime-alustan (OpenGL, Vulkan, Metal) mukaan.

**Oppitunnit:** [`b02-qt-shaders-qsb-13`](/docs/topics/qt#b02-qt-shaders-qsb-13), [`b03-qt-shaders-attribute-location`](/docs/topics/qt#b03-qt-shaders-attribute-location), [`b03-qt-shaders-qopenglshader`](/docs/topics/qt#b03-qt-shaders-qopenglshader), [`b03-qt-shaders-rhi-fallback`](/docs/topics/qt#b03-qt-shaders-rhi-fallback), [`b04-qt-shaders-attribute-location`](/docs/topics/qt#b04-qt-shaders-attribute-location), [`b05-qt-shaders-glsl-version`](/docs/topics/qt#b05-qt-shaders-glsl-version), [`b05-qt-shaders-rhi-backend`](/docs/topics/qt#b05-qt-shaders-rhi-backend), [`b05-qt-shaders-uniform-location`](/docs/topics/qt#b05-qt-shaders-uniform-location), [`b06-qt-shaders-precompile`](/docs/topics/qt#b06-qt-shaders-precompile), [`b06-qt-shaders-varying-interpolation`](/docs/topics/qt#b06-qt-shaders-varying-interpolation), [`b07-qt-shader-precision`](/docs/topics/qt#b07-qt-shader-precision), [`b07-qt-shader-qsb`](/docs/topics/qt#b07-qt-shader-qsb) (+7 muuta)

### GNSS {#gnss}

**Global Navigation Satellite System** — kattotermi globaaleille satelliittipaikannusjärjestelmille (GPS, GLONASS, Galileo, BeiDou). Puhekielen "GPS" tarkoittaa usein GNSS:ää, mutta teknisessä tekstissä GNSS on oikea termi.

**Oppitunnit:** [`space-gnss-vs-gps`](/docs/topics/space#space-gnss-vs-gps), [`space-gnss-galileo`](/docs/topics/space#space-gnss-galileo)

### GPG {#gpg}

**GNU Privacy Guard** — kryptografinen allekirjoitus- ja salaustyökalu. APT-pakettihallinnan `trusted.gpg.d/`-avain varmistaa, että repositorion paketit ovat luotettavalta julkaisijalta; ilman avainta APT varoittaa allekirjoitusvirheestä.

**Oppitunnit:** [`apt-repository-add`](/docs/topics/linux#apt-repository-add)

### GPS {#gps}

**Global Positioning System** — Yhdysvaltojen globaali satelliittipaikannusjärjestelmä (MEO-konstellaatio, WGS84-datumi). Yksi GNSS-järjestelmistä; siviilisignaalit ovat avoimesti käytettävissä.

**Oppitunnit:** [`space-gnss-gps-operator`](/docs/topics/space#space-gnss-gps-operator), [`space-datum-wgs84`](/docs/topics/space#space-datum-wgs84)

### GPU {#gpu}

**Graphics Processing Unit** — rinnakkaiseen laskentaan optimoitu grafiikkasuoritin. Shader-ohjelmat suoritetaan GPU:lla; attribuuttisidosten sijainti (`layout(location = ...)`) on kiinnitettävä eksplisiittisesti, koska eri GPU-ajurit voivat järjestää ne eri tavoin.

**Oppitunnit:** [`b02-qt-shaders-uniform-14`](/docs/topics/qt#b02-qt-shaders-uniform-14), [`b03-qt-shaders-attribute-location`](/docs/topics/qt#b03-qt-shaders-attribute-location), [`b05-qt-opengl-context-share`](/docs/topics/qt#b05-qt-opengl-context-share), [`b06-qt-shaders-varying-interpolation`](/docs/topics/qt#b06-qt-shaders-varying-interpolation), [`b08-qt-shaders-precision`](/docs/topics/qt#b08-qt-shaders-precision), [`b09-qt-shaders-qml-graph-effect`](/docs/topics/qt#b09-qt-shaders-qml-graph-effect), [`exp-qt-opengl-vao-vbo`](/docs/topics/qt#exp-qt-opengl-vao-vbo), [`exp-qt-shaders-uniform-location`](/docs/topics/qt#exp-qt-shaders-uniform-location), [`prod-sec-password-hash`](/docs/topics/security#prod-sec-password-hash), [`qt-opengl-vbo`](/docs/topics/qt#qt-opengl-vbo), [`exp-qt-shaders-rhi-backend`](/docs/topics/qt#exp-qt-shaders-rhi-backend)

### GROUPING {#grouping}

SQL:n `GROUPING SETS` -ominaisuus mahdollistaa useiden aggregaatiotasojen laskemisen yhdellä kyselyllä. `ROLLUP` ja `CUBE` ovat erikoistapauksia GROUPING SETS:stä; käytetään raporteissa, joissa tarvitaan sekä osasummat että kokonaissummat yhdellä ajolla.

**Oppitunnit:** [`sqd-grouping-sets`](/docs/topics/postgres#sqd-grouping-sets)

### GSL {#gsl}

**Guidelines Support Library** — Microsoftin C++ Core Guidelines -suositusten tukikirjasto (`microsoft/GSL`). Tarjoaa mm. `gsl::not_null<T>`, `gsl::span<T>` ja `gsl::narrow_cast<T>`, joka heittää poikkeuksen kapenevan konversion yhteydessä. GSL:n `final_action` toteuttaa scope guard -kuvion RAII-tyylisesti.

**Oppitunnit:** [`b06-cpp-raii-scope-guard`](/docs/topics/cpp#b06-cpp-raii-scope-guard), [`b09-cpp-narrowing-conversion`](/docs/topics/cpp#b09-cpp-narrowing-conversion), [`b08-cpp-span-bounds`](/docs/topics/cpp#b08-cpp-span-bounds)

### GSO {#gso}

**GSO** (Generic Segmentation Offload) — Linux-verkkopinon optimointi, joka siirtää TCP/UDP-segmentoinnin verkkokortin (NIC) tehtäväksi. `ethtool -K eth0 gso off` poistaa GSO:n käytöstä diagnostiikkaa varten; tuotannossa offload parantaa suorituskykyä vähentämällä CPU-kuormaa.

**Oppitunnit:** [`b06-linux-network-ethtool-offload`](/docs/topics/linux#b06-linux-network-ethtool-offload)

### GUI {#gui}

**Graphical User Interface** — graafinen käyttöliittymä. Qt-sovelluksissa GUI-threadi omistaa widgetit ja OpenGL-kontekstin; raskaat operaatiot on delegoitava worker-threadiin, jotta käyttöliittymä pysyy responsiivisena.

**Oppitunnit:** [`b02-linux-network-nmcli-11`](/docs/topics/linux#b02-linux-network-nmcli-11), [`b02-qt-opengl-context-11`](/docs/topics/qt#b02-qt-opengl-context-11), [`b02-qt-signals-queued-04`](/docs/topics/qt#b02-qt-signals-queued-04), [`b02-qt-thread-gui-07`](/docs/topics/qt#b02-qt-thread-gui-07), [`b02-qt-thread-worker-06`](/docs/topics/qt#b02-qt-thread-worker-06), [`b03-qt-thread-invoke-method`](/docs/topics/qt#b03-qt-thread-invoke-method), [`b04-qt-deferred-delete`](/docs/topics/qt#b04-qt-deferred-delete), [`b04-qt-thread-affinity`](/docs/topics/qt#b04-qt-thread-affinity), [`b05-qt-signals-queued-connection`](/docs/topics/qt#b05-qt-signals-queued-connection), [`b05-qt-thread-gui-touch`](/docs/topics/qt#b05-qt-thread-gui-touch), [`b05-qt-thread-movetothread`](/docs/topics/qt#b05-qt-thread-movetothread), [`b06-qt-thread-future`](/docs/topics/qt#b06-qt-thread-future) (+19 muuta)

### HA {#ha}

**HA** (High Availability) — korkea käytettävyys, järjestelmän kyky jatkaa toimintaa laiterikkojen tai failoverin aikana. HA-konfiguraatioissa virtuaalinen IP-osoite siirtyy aktiiviselta solmulta toiselle (VRRP, keepalived), mikä edellyttää ARP-välimuistin päivitystä GARP-viestillä.

**Oppitunnit:** [`b12-linux-arp-static-neigh`](/docs/topics/linux#b12-linux-arp-static-neigh)

### HASH {#hash}

**HASH** — PostgreSQL-indeksityyppi, joka tukee vain yhtäsuuruusvertailua (`=`). JSONB-sarakkeille GIN-indeksi (operaattorit `@>`, `?`) on yleensä tehokkaampi kuin HASH-indeksi; HASH sopii vain yksinkertaiseen avain=arvo-hakuun ilman operaattoriperehteisyyttä.

**Oppitunnit:** [`sqd-jsonb-gin-index`](/docs/topics/postgres#sqd-jsonb-gin-index)

### HDD {#hdd}

**Hard Disk Drive** — perinteinen mekaaninen kovalevy. PostgreSQLin `random_page_cost`-oletusarvo (4.0) on kalibroitu HDD:lle; SSD/NVMe-ympäristöön kannattaa laskea arvo (1.1–2.0), koska satunnainen I/O on lähes yhtä nopeaa kuin peräkkäinen.

**Oppitunnit:** [`b03-pg-config-random-page-cost`](/docs/topics/postgres#b03-pg-config-random-page-cost), [`b04-pg-explain-cost-settings`](/docs/topics/postgres#b04-pg-explain-cost-settings), [`b08-pg-explain-cost-settings`](/docs/topics/postgres#b08-pg-explain-cost-settings)

### HEAD {#head}

Git:n **HEAD** on osoitin aktiiviseen committiin tai haaraan (`.git/HEAD`-tiedosto). `git reflog` säilyttää HEAD-siirtymähistorian noin 90 päivää; kadonneen commitin voi palauttaa `git checkout <hash>` -komennolla reflogista.

**Oppitunnit:** [`git-reflog-recovery`](/docs/topics/git#git-reflog-recovery), [`git-stash-workflow`](/docs/topics/git#git-stash-workflow), [`git-rebase-interactive`](/docs/topics/git#git-rebase-interactive), [`git-reset-vs-revert`](/docs/topics/git#git-reset-vs-revert)

### HFT {#hft}

**HFT** (High-Frequency Trading) — korkean taajuuden algoritminen kaupankäynti, joka vaatii microsekuntitason latenssit. HFT-tyyppiset reaaliaikasovellukset suosivat UDP:ta TCP:n sijaan ja Docker `--network host` -tilaa, jolloin NAT-overhead ja virtuaalinen verkkokerros poistetaan.

**Oppitunnit:** [`b02-docker-net-host-08`](/docs/topics/docker#b02-docker-net-host-08)

### HLSL {#hlsl}

**HLSL** (High-Level Shading Language) — Microsoftin shader-ohjelmointikieli Direct3D-grafiikkaputkelle. Qt:n `qsb`-työkalu kääntää GLSL-lähdekoodit automaattisesti HLSL:ksi Windows/D3D11-alustalla ja SPIR-V:ksi Vulkanille; generoidut binäärit kannattaa jättää commitoimatta ja generoida buildissa.

**Oppitunnit:** [`b07-qt-shader-qsb`](/docs/topics/qt#b07-qt-shader-qsb)

### HMAC {#hmac}

**HMAC** (Hash-based Message Authentication Code) — kryptografinen viesti-autentikointikoodi, joka yhdistää hash-funktion ja salaisen avaimen. Robot Frameworkin Python-avainsanoilla voi laskea HMAC-allekirjoituksen API-testeissä, joissa palvelin vaatii jokaisen pyynnön allekirjoittamista.

**Oppitunnit:** [`rf-custom-python-keyword`](/docs/topics/robotframework#rf-custom-python-keyword)

### HOT {#hot}

**Heap Only Tuple** — PostgreSQL-optimointi, jossa päivitetty rivi tallennetaan samalle heap-sivulle eikä indeksiä tarvitse päivittää. HOT vaatii vapaan tilan sivulla; `fillfactor`-parametrin pienentäminen (esim. 70) jättää tilaa HOT-päivityksille ja vähentää taulun bloattia.

**Oppitunnit:** [`b03-pg-indexes-fillfactor-update`](/docs/topics/postgres#b03-pg-indexes-fillfactor-update), [`b09-pg-vacuum-autovacuum-tuning`](/docs/topics/postgres#b09-pg-vacuum-autovacuum-tuning)

### HR {#hr}

**Human Resources** — henkilöstöhallinto. Scrumissa velocity on tiimin sisäinen suunnittelutyökalu, ei HR-mittari kehittäjien tuottavuuden vertailuun tiimien välillä tai johdolle raportoitavaksi.

**Oppitunnit:** [`b03-scrum-velocity-forecast`](/docs/topics/scrum#b03-scrum-velocity-forecast), [`b08-scrum-velocity-trend`](/docs/topics/scrum#b08-scrum-velocity-trend)

### HTML {#html}

**HyperText Markup Language** — verkkosivujen rakennekuvauskieli. ESM-moduulit vaativat `type="module"`-attribuutin `<script>`-elementille; ilman sitä `import`/`export`-syntaksi ei toimi selaimessa.

**Oppitunnit:** [`b05-js-modules-esm-import`](/docs/topics/javascript#b05-js-modules-esm-import), [`b07-js-runtime-closure-loop`](/docs/topics/javascript#b07-js-runtime-closure-loop), [`b08-js-runtime-dom-ready`](/docs/topics/javascript#b08-js-runtime-dom-ready), [`b12-js-runtime-domparser`](/docs/topics/javascript#b12-js-runtime-domparser), [`prod-sec-xss`](/docs/topics/security#prod-sec-xss), [`rf-run-on-failure`](/docs/topics/robotframework#rf-run-on-failure), [`rf-wait-until`](/docs/topics/robotframework#rf-wait-until), [`rust-testing-doc-tests`](/docs/topics/rust#rust-testing-doc-tests), [`b12-js-runtime-event-delegation`](/docs/topics/javascript#b12-js-runtime-event-delegation), [`b04-qt-widgets-qss`](/docs/topics/qt#b04-qt-widgets-qss)

### HTTP/HTTPS {#http-https}

**Hypertext Transfer Protocol / HTTP Secure** — web-liikenteen perusprotokolla ja sen TLS-salattu versio. Yritysverkossa kaikki HTTP/HTTPS-liikenne voi kulkea välityspalvelimen kautta; Docker-daemonille asetetaan `HTTP_PROXY`/`HTTPS_PROXY`-ympäristömuuttujat `daemon.json`-tiedostossa.

**Oppitunnit:** [`b06-docker-network-proxy`](/docs/topics/docker#b06-docker-network-proxy), [`b12-linux-tcp-udp-handshake`](/docs/topics/linux#b12-linux-tcp-udp-handshake)

### IANA {#iana}

**Internet Assigned Numbers Authority** — organisaatio, joka hallinnoi IP-osoiteavaruuksia, protokollanumeroita ja DNS-SD-palvelutyyppejä. Avahi-palvelutyypeissä (`_http._tcp`, `_ipp._tcp`) käytetään IANA:n rekisteröimiä nimiä; `_myapp._tcp` on käytäntö omille sovelluksille.

**Oppitunnit:** [`b06-linux-avahi-service-type`](/docs/topics/linux#b06-linux-avahi-service-type)

### ICMP {#icmp}

**Internet Control Message Protocol** — verkkodiagnostiikkaprotokolla. `ping` käyttää ICMP echo request/reply -paketteja tavoitettavuuden testaamiseen; `traceroute` kartoittaa reitin TTL:ää kasvattaen. Monet palvelimet estävät ICMP:n palomuurilla — timeoutti ei aina tarkoita yhteysongelmaa.

**Oppitunnit:** [`b04-linux-network-ip-addr`](/docs/topics/linux#b04-linux-network-ip-addr), [`b06-linux-avahi-resolve-hostname`](/docs/topics/linux#b06-linux-avahi-resolve-hostname), [`b08-linux-network-traceroute`](/docs/topics/linux#b08-linux-network-traceroute), [`b05-linux-network-ss-listen`](/docs/topics/linux#b05-linux-network-ss-listen)

### IDE {#ide}

**Integrated Development Environment** — integroitu ohjelmointiympäristö, joka yhdistää editorin, kääntäjän, debuggerin ja muita kehitystyökaluja. Named exportit ja TypeScript-tyypit parantavat IDE-tukea: autocomplete, rename-refaktorointi ja tree-shaking toimivat luotettavammin.

**Oppitunnit:** [`b02-cpp-style-override-03`](/docs/topics/cpp#b02-cpp-style-override-03), [`b03-js-modules-export-default-named`](/docs/topics/javascript#b03-js-modules-export-default-named), [`b04-js-modules-export-default`](/docs/topics/javascript#b04-js-modules-export-default), [`b09-qt-widgets-splitter-state`](/docs/topics/qt#b09-qt-widgets-splitter-state), [`b11-cpp-clang-format-style`](/docs/topics/cpp#b11-cpp-clang-format-style), [`b12-js-modules-resolve-alias`](/docs/topics/javascript#b12-js-modules-resolve-alias), [`git-worktree`](/docs/topics/git#git-worktree)

### IDS {#ids}

**IDS** (Intrusion Detection System) — tunkeutumisen havaitsemisjärjestelmä, joka seuraa verkkoliikennettä tai järjestelmätapahtumia hyökkäysten varalta. IDS voi lähettää TCP RST -paketteja havaitessaan epäilyttävää liikennettä; `tcpdump` ja paketin lähde-IP paljastavat, tulivatko RST-paketit palvelimelta vai IDS:ltä.

**Oppitunnit:** [`b07-linux-network-tcpdump`](/docs/topics/linux#b07-linux-network-tcpdump)

### IEEE {#ieee}

**Institute of Electrical and Electronics Engineers** — kansainvälinen tekniikan standardointiorganisaatio. IEEE 754 määrittelee liukulukuaritmetiikan; JavaScriptin `number`-tyyppi on IEEE 754 -double, joka ei pysty tarkasti esittämään kaikkia desimaaleja (esim. `0.1 + 0.2 !== 0.3`).

**Oppitunnit:** [`b03-js-types-number-precision`](/docs/topics/javascript#b03-js-types-number-precision), [`b04-js-types-number-precision`](/docs/topics/javascript#b04-js-types-number-precision), [`b07-js-types-nan`](/docs/topics/javascript#b07-js-types-nan), [`b12-js-types-nan-check`](/docs/topics/javascript#b12-js-types-nan-check), [`exp-js-types-bigint-json`](/docs/topics/javascript#exp-js-types-bigint-json)

### IGS {#igs}

**International GNSS Service** — globaali yhteistyöverkko, joka tuottaa tarkkoja satelliittiratoja, kelloja ja muita tuotteita (sp3, clk, ANTEX) tieteelle ja PPP-paikannukseen.

**Oppitunnit:** [`space-app-igs`](/docs/topics/space#space-app-igs), [`space-pos-ppp`](/docs/topics/space#space-pos-ppp)

### IIFE {#iife}

**Immediately Invoked Function Expression** — heti suoritettava JavaScript-funktioilmaisu: `(function() { ... })()`. Vanhassa ES5-koodissa IIFE loi silmukan jokaiselle iteraatiolle erillisen sulkeuman; modernissa JS:ssä `let` silmukamuuttujana korvaa tarpeen.

**Oppitunnit:** [`b02-js-runtime-closure-12`](/docs/topics/javascript#b02-js-runtime-closure-12), [`b05-js-runtime-closure-stale`](/docs/topics/javascript#b05-js-runtime-closure-stale), [`b07-js-runtime-closure-loop`](/docs/topics/javascript#b07-js-runtime-closure-loop), [`b08-js-modules-top-level-await`](/docs/topics/javascript#b08-js-modules-top-level-await), [`b08-js-runtime-closure-loop`](/docs/topics/javascript#b08-js-runtime-closure-loop), [`js-runtime-closure-loop`](/docs/topics/javascript#js-runtime-closure-loop), [`exp-js-modules-top-level-await`](/docs/topics/javascript#exp-js-modules-top-level-await), [`b06-js-modules-top-level-await`](/docs/topics/javascript#b06-js-modules-top-level-await)

### INCOMPLETE {#incomplete}

ARP-naapurivälimuistin tila, jossa kerneli on lähettänyt ARP-kyselyn mutta ei ole vielä saanut vastausta. `ip neigh`-komennon `INCOMPLETE`-merkintä tarkoittaa, että kohde-IP on tavoittamaton tai MAC-osoite ei ole ratkaistu. `FAILED`-tila tarkoittaa, että kaikki ARP-yritykset ovat loppuneet tuloksetta.

**Oppitunnit:** [`b06-linux-network-ip-neigh`](/docs/topics/linux#b06-linux-network-ip-neigh), [`b12-linux-arp-failed-state`](/docs/topics/linux#b12-linux-arp-failed-state)

### INPUT {#input}

**INPUT** — Linux-palomuurin (iptables/nftables) ketju, joka käsittelee paikalliselle koneelle saapuvat paketit. `nft list ruleset` tai `iptables -L INPUT -n -v` näyttää aktiiviset säännöt; cloud load balancerin julkaisema portti voi poiketa palvelimen `INPUT`-ketjun portista.

**Oppitunnit:** [`b07-linux-network-firewall-nft`](/docs/topics/linux#b07-linux-network-firewall-nft)

### INSERT/UPDATE/DELETE/SELECT {#insert-update-delete-select}

**INSERT / UPDATE / DELETE / SELECT** — SQL:n neljä perus-DML-lausetta (Data Manipulation Language): lisäys, päivitys, poisto ja haku. PostgreSQLin `VACUUM FULL` lukitsee taulun koko operaation ajaksi ja blokkaa kaikki DML-lauseet; `VACUUM` ilman FULL-vaihtoehtoa toimii samanaikaisesti.

**Oppitunnit:** [`b02-pg-vacuum-full-12`](/docs/topics/postgres#b02-pg-vacuum-full-12)

### INVEST {#invest}

**Independent, Negotiable, Valuable, Estimable, Small, Testable** — kuusi kriteeriä hyvän user storyn tunnistamiseksi Scrumissa. Refinementissa jokainen PBI tarkistetaan INVEST-kriteerien kautta: epäriippuvainen, neuvoteltava, arvokas, arvioitavissa, pieni ja testattava.

**Oppitunnit:** [`b04-scrum-pbi-invest`](/docs/topics/scrum#b04-scrum-pbi-invest), [`scrum-story-split`](/docs/topics/scrum#scrum-story-split)

### IO {#io}

**Input/Output** — levy- tai verkko-operaatiot (luku/kirjoitus). PostgreSQLissä `track_io_timing = on` mahdollistaa IO-aikojen seurannan `EXPLAIN (ANALYZE, BUFFERS)` -tulosteessa; IO-piikkejä voi tutkia `checkpoint_completion_target`-asetuksen avulla.

**Oppitunnit:** [`b08-pg-config-checkpoint`](/docs/topics/postgres#b08-pg-config-checkpoint), [`qt-native-deploy`](/docs/topics/qt#qt-native-deploy), [`qt-native-event-filter`](/docs/topics/qt#qt-native-event-filter), [`qt-native-high-dpi`](/docs/topics/qt#qt-native-high-dpi), [`qt-native-json`](/docs/topics/qt#qt-native-json), [`qt-native-model-view`](/docs/topics/qt#qt-native-model-view), [`qt-native-qml-binding`](/docs/topics/qt#qt-native-qml-binding), [`qt-native-qsettings`](/docs/topics/qt#qt-native-qsettings), [`qt-native-signals-slots`](/docs/topics/qt#qt-native-signals-slots), [`qt-native-threading-ui`](/docs/topics/qt#qt-native-threading-ui), [`qt-native-widgets-vs-quick`](/docs/topics/qt#qt-native-widgets-vs-quick), [`rust-async-tokio-tcp`](/docs/topics/rust#rust-async-tokio-tcp)

### IP {#ip}

**Internet Protocol** — verkkokerroksen protokolla, joka määrittää laitteiden osoitteistuksen (IPv4/IPv6) ja pakettien reitityksen. IP-osoite vaihtuu DHCP-leasen tai rebootin myötä; `ip addr show` ja `ip route` näyttävät koneen nykyiset osoitteet ja reittitaulun.

**Oppitunnit:** [`avahi-mdns`](/docs/topics/linux#avahi-mdns), [`avahi-service-xml`](/docs/topics/linux#avahi-service-xml), [`b02-docker-net-bridge-06`](/docs/topics/docker#b02-docker-net-bridge-06), [`b02-docker-net-host-08`](/docs/topics/docker#b02-docker-net-host-08), [`b02-docker-net-inspect-09`](/docs/topics/docker#b02-docker-net-inspect-09), [`b02-linux-avahi-browse-12`](/docs/topics/linux#b02-linux-avahi-browse-12), [`b02-linux-avahi-publish-14`](/docs/topics/linux#b02-linux-avahi-publish-14), [`b02-linux-network-route-09`](/docs/topics/linux#b02-linux-network-route-09), [`b03-linux-avahi-browse-services`](/docs/topics/linux#b03-linux-avahi-browse-services), [`b03-linux-avahi-publish-service`](/docs/topics/linux#b03-linux-avahi-publish-service), [`b04-linux-avahi-browse`](/docs/topics/linux#b04-linux-avahi-browse), [`b04-linux-network-ip-addr`](/docs/topics/linux#b04-linux-network-ip-addr) (+39 muuta)

### IPAM {#ipam}

**IP Address Management** — Docker-verkon IP-osoitteenjakelujärjestelmä. `docker network inspect` näyttää IPAM-konfiguraation ja osoiteavaruuden; täysi subnet tai väärä gateway-asetus estää kontin verkkoyhteyksiä.

**Oppitunnit:** [`b02-docker-net-inspect-09`](/docs/topics/docker#b02-docker-net-inspect-09), [`docker-inspect-network`](/docs/topics/docker#docker-inspect-network)

### IPP {#ipp}

**IPP** (Internet Printing Protocol) — standardiprotokolla verkkotulostimille (portti 631). Linux julkistaa IPP-tulostimet lähiverkossa Avahi/mDNS:n kautta; `avahi-browse _ipp._tcp` tai `avahi-browse -at | grep IPP` löytää ne automaattisesti.

**Oppitunnit:** [`b02-linux-avahi-browse-12`](/docs/topics/linux#b02-linux-avahi-browse-12)

### ISO {#iso}

**International Organization for Standardization** — kansainvälinen standardointielin. Ohjelmistokehityksessä viitataan yleisimmin ISO 8601 -päivämääräformaattiin (`YYYY-MM-DD`), jota API:t palauttavat merkkijonoina ja JavaScript Temporal API käyttää sisäisesti.

**Oppitunnit:** [`b06-js-runtime-json-parse-reviver`](/docs/topics/javascript#b06-js-runtime-json-parse-reviver), [`b06-js-types-temporal-date`](/docs/topics/javascript#b06-js-types-temporal-date), [`b08-linux-journalctl-since`](/docs/topics/linux#b08-linux-journalctl-since), [`b12-js-types-temporal-api`](/docs/topics/javascript#b12-js-types-temporal-api)

### ISP {#isp}

**Internet Service Provider** — internet-palveluntarjoaja. Reititysongelmat ISP:n verkon puolella näkyvät `traceroute`-tulosteessa katkoksena tai suurina viiveinä ISP:n solmuissa. ICMP-vastauksen puuttuminen ei aina tarkoita ISP-ongelmaa — monet reitittimet hylkäävät ICMP:n palomuurisäännöillä.

**Oppitunnit:** [`b08-linux-network-traceroute`](/docs/topics/linux#b08-linux-network-traceroute), [`b04-linux-resolv-stub`](/docs/topics/linux#b04-linux-resolv-stub)

### ITRF {#itrf}

**International Terrestrial Reference Frame** — kansainvälinen, ajan myötä päivittyvä maakiinnitteinen referenssikehys (esim. ITRF2020). WGS84-realisaatiot pidetään lähellä ITRF:ää; tarkkuusgeodesiassa frame + epoch dokumentoidaan.

**Oppitunnit:** [`space-datum-itrf`](/docs/topics/space#space-datum-itrf)

### IWYU {#iwyu}

**Include What You Use** — C++-työkalu ja -periaate, jonka mukaan jokainen tiedosto sisällyttää vain tarvitsemansa headerit. IWYU-analyysi CI-varoituksina pitää käännösajat lyhyinä, forward declarationit järjestyksessä ja riippuvuudet selkeinä.

**Oppitunnit:** [`b11-cpp-forward-declare-header`](/docs/topics/cpp#b11-cpp-forward-declare-header), [`b11-cpp-iwyu-cleanup`](/docs/topics/cpp#b11-cpp-iwyu-cleanup), [`b11-cpp-local-include-quotes`](/docs/topics/cpp#b11-cpp-local-include-quotes), [`b11-cpp-pch-tradeoff`](/docs/topics/cpp#b11-cpp-pch-tradeoff)

### JDBC {#jdbc}

**Java Database Connectivity** — Java-standardirajapinta tietokantayhteyksille. JDBC-ajuri muuntaa yhteysstring-parametrit (esim. `sslmode=verify-full`) TLS-asetuksiksi yhteydenottovaiheessa. Prepared statement -kyselyt välitetään JDBC:ssä `PreparedStatement`-rajapinnan kautta, jolloin parametrit ovat automaattisesti SQL-injektiosuojattuja.

**Oppitunnit:** [`b03-pg-config-ssl-mode`](/docs/topics/postgres#b03-pg-config-ssl-mode), [`b07-pg-explain-prepare`](/docs/topics/postgres#b07-pg-explain-prepare), [`sqd-prepared-statement-plan`](/docs/topics/postgres#sqd-prepared-statement-plan)

### JDK {#jdk}

**JDK** (Java Development Kit) — Java-kehitysympäristö, joka sisältää kääntäjän (`javac`), ajoympäristön ja kehitystyökalut. Docker multistage -buildissa JDK tarvitaan vain build-stagessa; runtime-stageen riittää kevyempi JRE tai `eclipse-temurin:XX-jre` -pohjakuva, mikä pienentää tuotantoimage-kokoa merkittävästi.

**Oppitunnit:** [`b05-dockerfile-multistage-size`](/docs/topics/docker#b05-dockerfile-multistage-size)

### JOIN/EXISTS {#join-exists}

**JOIN / EXISTS** — SQL:n tapoja yhdistää taulujen tietoja. Palauttaessa vain pääkyselytaulun rivejä EXISTS-semi-joinin avulla vältetään N+1-ongelma API-kerroksessa: yhdessä kyselyssä haetaan kaikki tarvittava data eikä kutsuta EXISTS-kyselyä erikseen jokaiselle riville.

**Oppitunnit:** [`sqd-exists-vs-count`](/docs/topics/postgres#sqd-exists-vs-count)

### JS {#js}

**JavaScript** — web-selainten ja Node.js:n dynaaminen ohjelmointikieli. Modernit JS-moduulit käyttävät `import`/`export` (ESM); bundler (Vite, Webpack) yhdistää moduulit optimoiduksi tuotantobuildiksi.

**Oppitunnit:** [`b06-js-modules-import-assertions`](/docs/topics/javascript#b06-js-modules-import-assertions), [`b08-js-modules-dynamic-import`](/docs/topics/javascript#b08-js-modules-dynamic-import), [`b09-js-modules-dynamic-import`](/docs/topics/javascript#b09-js-modules-dynamic-import), [`b09-js-runtime-raf-animation`](/docs/topics/javascript#b09-js-runtime-raf-animation), [`b12-js-modules-wasm-import`](/docs/topics/javascript#b12-js-modules-wasm-import), [`b12-js-runtime-error-stack-limit`](/docs/topics/javascript#b12-js-runtime-error-stack-limit), [`b12-js-runtime-tail-call`](/docs/topics/javascript#b12-js-runtime-tail-call), [`b12-js-types-json-stringify`](/docs/topics/javascript#b12-js-types-json-stringify), [`b12-js-types-parseint-radix`](/docs/topics/javascript#b12-js-types-parseint-radix), [`b12-ts-narrowing-typeof`](/docs/topics/javascript#b12-ts-narrowing-typeof), [`b12-ts-readonly-array`](/docs/topics/javascript#b12-ts-readonly-array), [`b13-qt-quick-worker-script`](/docs/topics/qt#b13-qt-quick-worker-script) (+3 muuta)

### JSONB {#jsonb}

**JSON Binary** — PostgreSQLin binäärimuotoinen JSON-tallennustyyppi (`jsonb`). Toisin kuin tekstimuotoinen `json`, `jsonb` hajottaa rakenteen indeksoitaviin komponentteihin; GIN-indeksi tarvitaan tehokkaaseen containment- (`@>`) ja avainkyselyihin (`?`).

**Oppitunnit:** [`b02-pg-indexes-btree-02`](/docs/topics/postgres#b02-pg-indexes-btree-02), [`b03-pg-indexes-gin-jsonb`](/docs/topics/postgres#b03-pg-indexes-gin-jsonb), [`b04-pg-indexes-gin-jsonb`](/docs/topics/postgres#b04-pg-indexes-gin-jsonb), [`b07-pg-index-btree-vs-gin`](/docs/topics/postgres#b07-pg-index-btree-vs-gin), [`sqd-json-path-query`](/docs/topics/postgres#sqd-json-path-query), [`sqd-json-vs-normalize`](/docs/topics/postgres#sqd-json-vs-normalize), [`sqd-jsonb-array-elements`](/docs/topics/postgres#sqd-jsonb-array-elements), [`sqd-jsonb-arrow-op`](/docs/topics/postgres#sqd-jsonb-arrow-op), [`sqd-jsonb-containment`](/docs/topics/postgres#sqd-jsonb-containment), [`sqd-jsonb-gin-index`](/docs/topics/postgres#sqd-jsonb-gin-index), [`sqd-jsonb-set-update`](/docs/topics/postgres#sqd-jsonb-set-update), [`sqd-select-columns-only`](/docs/topics/postgres#sqd-select-columns-only) (+1 muuta)

### JWT {#jwt}

**JSON Web Token** — standardimuotoinen (RFC 7519) allekirjoitettu token käyttäjän autentikaatioon. JWT koostuu kolmesta Base64URL-osasta: header, payload (claims) ja allekirjoitus. Backend validoi allekirjoituksen sekä `iss`-, `aud`- ja `exp`-kentät — validoimatta jätetty `exp` mahdollistaa vanhentuneiden tokenien käytön.

**Oppitunnit:** [`b06-js-modules-top-level-await`](/docs/topics/javascript#b06-js-modules-top-level-await), [`prod-sec-jwt-claims`](/docs/topics/security#prod-sec-jwt-claims)

### KB {#kb}

**Kilobyte** — 1 KB = 1 024 tavua. PostgreSQL-konfiguraatiossa ja WAL-mittareissa koot ilmoitetaan KB/MB/GB-yksiköissä; esim. `shared_buffers = 256MB` tai huge pages -koko kilotavuina kernelin `/proc`-rajapinnassa.

**Oppitunnit:** [`b04-js-modules-dynamic-import`](/docs/topics/javascript#b04-js-modules-dynamic-import), [`b06-pg-config-huge-pages`](/docs/topics/postgres#b06-pg-config-huge-pages), [`b06-pg-explain-wal-fpi`](/docs/topics/postgres#b06-pg-explain-wal-fpi), [`b07-js-modules-dynamic`](/docs/topics/javascript#b07-js-modules-dynamic), [`b07-js-modules-tree-shake`](/docs/topics/javascript#b07-js-modules-tree-shake), [`b09-js-modules-dynamic-import`](/docs/topics/javascript#b09-js-modules-dynamic-import), [`b12-js-async-fetch-keepalive`](/docs/topics/javascript#b12-js-async-fetch-keepalive), [`b13-qt-quick-worker-script`](/docs/topics/qt#b13-qt-quick-worker-script), [`exp-js-modules-dynamic-import`](/docs/topics/javascript#exp-js-modules-dynamic-import)

### KPI {#kpi}

**KPI** (Key Performance Indicator) — avainsuoritusmittari liiketoiminnan tavoitteiden seurannalle. Scrum velocity on tiimin sisäinen kapasiteettimittari sprinttisuunnitteluun, ei KPI johdolle; velocity-vertailu tiimien välillä on harhaanjohtavaa.

**Oppitunnit:** [`b03-scrum-velocity-forecast`](/docs/topics/scrum#b03-scrum-velocity-forecast)

### L2/VLAN/IP {#l2-vlan-ip}

**L2/VLAN/IP** — verkkoarkkitehtuurin kerrokset: **Layer 2** (MAC-osoitteet, kytkentä), **VLAN** (virtuaalinen lähiverkko L2-tasolla) ja **IP** (Layer 3, reititys). ARP FAILED -tila kertoo, ettei kernel saanut vastausta ARP-kyselyyn; juurisyy on usein L2- tai VLAN-konfigurointivirhe tai IP-osoitekonflikt.

**Oppitunnit:** [`b12-linux-arp-failed-state`](/docs/topics/linux#b12-linux-arp-failed-state)

### LABEL {#label}

Dockerfile-direktiivi metatiedon lisäämiseksi image-kerroksiin (esim. `LABEL version="1.0" maintainer="dev@example.com"`). LABEL-kentät näkyvät `docker inspect`-tulosteessa eivätkä suurenna image-kokoa merkittävästi. Multistage-buildissä LABELit kannattaa lisätä vain lopulliseen vaiheeseen.

**Oppitunnit:** [`b05-dockerfile-multistage-size`](/docs/topics/docker#b05-dockerfile-multistage-size)

### LAG {#lag}

SQL-ikkunafunktio, joka palauttaa edellisen rivin arvon määritellyn järjestyksen mukaan. `LAG(amount) OVER (ORDER BY month)` palauttaa edellisen kuukauden arvon kuukausi-vertailuihin (MoM); ensimmäisellä rivillä palautusarvo on NULL oletuksena.

**Oppitunnit:** [`sqd-lag-mom-comparison`](/docs/topics/postgres#sqd-lag-mom-comparison), [`sqd-lead-future-row`](/docs/topics/postgres#sqd-lead-future-row)

### LAN {#lan}

**Local Area Network** — lähiverkko, joka kattaa yleensä rakennuksen tai kampuksen. `macvlan`- ja `ipvlan`-Docker-driverit antavat konteille suoran pääsyn fyysiseen LAN-segmenttiin omalla MAC-osoitteella.

**Oppitunnit:** [`b06-docker-network-ipvlan`](/docs/topics/docker#b06-docker-network-ipvlan), [`docker-macvlan`](/docs/topics/docker#docker-macvlan), [`exp-docker-net-macvlan`](/docs/topics/docker#exp-docker-net-macvlan)

### LB {#lb}

**Load Balancer** — kuormantasain, joka jakaa saapuvan liikenteen usealle palvelimelle tai kontille. Docker Swarm ja Kubernetes käyttävät sisäistä LB:tä palvelupyyntöjen jakamiseen; `HEALTHCHECK`-tarkistus poistaa epäkunnossa olevat kontit kierrosta ja palauttaa ne takaisin vasta kun tarkistus läpäisee.

**Oppitunnit:** [`b07-linux-network-firewall-nft`](/docs/topics/linux#b07-linux-network-firewall-nft), [`exp-docker-prod-healthcheck`](/docs/topics/docker#exp-docker-prod-healthcheck)

### LCP {#lcp}

**Largest Contentful Paint** — Web Vitals -suorituskykymetriikka, joka mittaa suurimman näkyvän elementin (kuva, tekstilohko) latausajan. LCP alle 2,5 sekuntia on hyvä; top-level await moduuleissa tai kuvien eager-lataus hidastavat LCP-arvoa merkittävästi. Mitataan Lighthouse- tai Chrome DevTools -työkaluilla.

**Oppitunnit:** [`b02-js-modules-tla-10`](/docs/topics/javascript#b02-js-modules-tla-10), [`b03-scrum-dor-testable`](/docs/topics/scrum#b03-scrum-dor-testable), [`b12-js-runtime-intersection-observer`](/docs/topics/javascript#b12-js-runtime-intersection-observer)

### LDAP {#ldap}

**Lightweight Directory Access Protocol** — hakemistopalveluprotokolla käyttäjätietojen ja oikeuksien keskitettyyn hallintaan (esim. Active Directory, OpenLDAP). mDNS/Avahi sopii paikallisverkon palvelujen löytämiseen ilman DNS-palvelinta, mutta käyttäjäautentikoinnissa tarvitaan edelleen LDAP tai vastaava hakemistopalvelu.

**Oppitunnit:** [`avahi-mdns`](/docs/topics/linux#avahi-mdns)

### LE {#le}

**LE** (Little Endian) — tavujärjestys, jossa vähiten merkitsevä tavu tallennetaan ensin pienempään osoitteeseen. x86/x64-arkkitehtuurit käyttävät LE:tä; verkkoprotokollit ovat perinteisesti big-endian (BE). Kannettavat C++-toteutukset käyttävät `htonl`/`ntohl`-funktioita tai C++23:n `std::byteswap`-funktiota.

**Oppitunnit:** [`b07-cpp-endian-portable`](/docs/topics/cpp#b07-cpp-endian-portable)

### LEAD {#lead}

SQL-ikkunafunktio, joka palauttaa seuraavan rivin arvon määritellyn järjestyksen mukaan. `LEAD(amount) OVER (ORDER BY month)` näyttää tulevan arvon — LAG:n peilikuva. Käytetään peräkkäisten arvojen vertailuun ja ennustavaan analyysiin aikasarjoissa.

**Oppitunnit:** [`sqd-lag-mom-comparison`](/docs/topics/postgres#sqd-lag-mom-comparison), [`sqd-lead-future-row`](/docs/topics/postgres#sqd-lead-future-row)

### LEO {#leo}

**Low Earth Orbit** — matala kiertorata (tyypillisesti alle ~2000 km). ISS ja monet kuva-/IoT-satelliitit ovat LEO:ssa; GNSS-konstellaatiot käyttävät korkeampaa MEO-rataa.

**Oppitunnit:** [`space-orbit-meo-gnss`](/docs/topics/space#space-orbit-meo-gnss)

### LLM/IDE {#llm-ide}

**LLM/IDE** — **Large Language Model** (tekoälymallipohjainen koodiavustaja) ja **Integrated Development Environment** (kehitysympäristö, esim. VS Code, CLion). `compile_commands.json` antaa sekä LLM:lle että IDE:lle tarkan tiedon kääntäjälipuista ja include-poluista jokaiselle `.cpp`-tiedostolle.

**Oppitunnit:** [`b11-cpp-compile-commands`](/docs/topics/cpp#b11-cpp-compile-commands)

### LLVM {#llvm}

**Low Level Virtual Machine** — kääntäjäinfrastruktuuri, jonka päälle Clang, Rust ja monet muut kääntäjät on rakennettu. `compile_commands.json` (CMakessa `CMAKE_EXPORT_COMPILE_COMMANDS=ON`) on LLVM-pohjaisten työkalujen (clangd, clang-tidy, IWYU) standardi syöteformaatti.

**Oppitunnit:** [`b11-cpp-compile-commands`](/docs/topics/cpp#b11-cpp-compile-commands)

### LOD {#lod}

**LOD** (Level of Detail) — 3D-grafiikan optimointitekniikka, jossa kauempana olevista objekteista käytetään yksinkertaisempaa mallia renderöintikuorman vähentämiseksi. VBO/VAO-pohjainen optimointi kannattaa tehdä ennen edistyneempiä tekniikoita kuten instancing, occlusion culling tai LOD.

**Oppitunnit:** [`exp-qt-opengl-vao-vbo`](/docs/topics/qt#exp-qt-opengl-vao-vbo)

### LOKI {#loki}

Grafana Loki — lokien aggregaatiopalvelu, joka indeksoi ainoastaan labelit (ei lokisisältöä). Lokeja työnnetään Lokiin Promtail- tai Alloy-agentilla; `journald`-lokit voidaan ohjata Lokiin `journald`-inputin kautta. Loki on kevyempi vaihtoehto Elasticsearchille puhtaassa lokihakuratkaisussa.

**Oppitunnit:** [`b09-linux-journald-forward-syslog`](/docs/topics/linux#b09-linux-journald-forward-syslog)

### LOWER {#lower}

**LOWER** — SQL-funktio, joka muuntaa merkkijonon pieniksi kirjaimiksi. Käytetään kirjainkoosta riippumattomaan vertailuun; `LOWER(input)` parametrisoidussa kyselyssä auttaa normalisoimaan syötteen, mutta parametrisoidut kyselyt ovat ensisijainen suoja SQL-injektiota vastaan.

**Oppitunnit:** [`sqd-parameterized-query`](/docs/topics/postgres#sqd-parameterized-query)

### LRU {#lru}

**Least Recently Used** — välimuistin poistoalgoritmi, joka hylkää vähiten äskettäin käytetyn alkion tilan täyttyessä. `WeakMap` on selaimessa luonnollinen LRU-vaihtoehto DOM-node-metadatalle — GC poistaa merkinnät automaattisesti, kun node poistetaan dokumentista. Eksplisiittistä LRU-toteutusta tarvitaan suurille kiinteäkokoisille välimuisteille.

**Oppitunnit:** [`b09-js-runtime-weakmap-cache`](/docs/topics/javascript#b09-js-runtime-weakmap-cache), [`b12-js-runtime-weakref-cache`](/docs/topics/javascript#b12-js-runtime-weakref-cache)

### LTE {#lte}

**Long-Term Evolution** — neljännen sukupolven (4G) mobiiliteknologia. `mmcli -m 0` näyttää modemille kytketyn LTE-verkon signaalivoimakkuuden (RSSI, RSRP), radiokanavataajuuden ja operaattoritiedot ModemManagerin D-Bus-rajapinnan kautta.

**Oppitunnit:** [`b12-linux-dbus-modemmanager-signal`](/docs/topics/linux#b12-linux-dbus-modemmanager-signal)

### LTO {#lto}

**LTO** (Link-Time Optimization) — kääntäjäoptimointitekniikka, jossa koodia optimoidaan linkitysvaiheessa moduulirajojen yli. Rustin release-profiilissa `lto = true` (`Cargo.toml`:ssa) vähentää binäärin kokoa ja parantaa suorituskykyä cross-module inliningillä.

**Oppitunnit:** [`rust-tooling-release-profile`](/docs/topics/rust#rust-tooling-release-profile)

### LTV {#ltv}

**LTV** (Lifetime Value, asiakkaan elinkaari-arvo) — metriikka, joka kuvaa yksittäisen asiakkaan tuomaa kokonaisarvoa koko asiakkuuden aikana. SQL-kyselyissä LTV lasketaan yleensä aggregaatteina (`SUM`, `AVG`) asiakaskohtaisista tilauksista; `LIMIT`-lauseke on tärkeä suuren tietomassan esikatseilussa ennen raskaan kyselyn optimointia.

**Oppitunnit:** [`sqd-limit-preview`](/docs/topics/postgres#sqd-limit-preview)

### MAC {#mac}

**Media Access Control** -osoite — verkkosovittimen uniikki laitteistoosoite (esim. `aa:bb:cc:dd:ee:ff`). `macvlan`-Docker-driver antaa kontille oman MAC-osoitteen, jolloin kontti näkyy fyysisessä LAN-segmentissä erillisenä laitteena.

**Oppitunnit:** [`b05-linux-avahi-hostname-conflict`](/docs/topics/linux#b05-linux-avahi-hostname-conflict), [`b06-docker-network-ipvlan`](/docs/topics/docker#b06-docker-network-ipvlan), [`b12-linux-arp-failed-state`](/docs/topics/linux#b12-linux-arp-failed-state), [`b12-linux-arp-flush-migration`](/docs/topics/linux#b12-linux-arp-flush-migration), [`b12-linux-arp-static-neigh`](/docs/topics/linux#b12-linux-arp-static-neigh), [`b12-linux-network-ip-addr-secondary`](/docs/topics/linux#b12-linux-network-ip-addr-secondary), [`docker-macvlan`](/docs/topics/docker#docker-macvlan), [`exp-docker-net-macvlan`](/docs/topics/docker#exp-docker-net-macvlan), [`linux-ip-route`](/docs/topics/linux#linux-ip-route), [`b12-linux-dbus-bluez-pair`](/docs/topics/linux#b12-linux-dbus-bluez-pair)

### MASQUERADE {#masquerade}

iptables/nftables NAT-toiminto, joka korvaa lähtevän paketin lähde-IP:n automaattisesti ulosmenevän rajapinnan osoitteella. `MASQUERADE` eroaa `SNAT`:sta siinä, että se sopii dynaamisille IP-osoitteille; Docker asettaa `MASQUERADE`-säännön `docker0`-sillalle automaattisesti. `iptables -t nat -L POSTROUTING` paljastaa konttiliikenteen NAT-säännöt.

**Oppitunnit:** [`b09-linux-net-nat-troubleshoot`](/docs/topics/linux#b09-linux-net-nat-troubleshoot)

### MB {#mb}

**Megabyte** — 1 024 kilotavua. PostgreSQLin `shared_buffers`-oletusarvo on usein 128 MB; tuotantopalvelimella suositellaan noin 25 % käytettävissä olevasta RAM-muistista.

**Oppitunnit:** [`b02-pg-config-shared-14`](/docs/topics/postgres#b02-pg-config-shared-14), [`b03-js-modules-worker-postmessage`](/docs/topics/javascript#b03-js-modules-worker-postmessage), [`b05-pg-config-shared-buffers`](/docs/topics/postgres#b05-pg-config-shared-buffers), [`b06-pg-config-huge-pages`](/docs/topics/postgres#b06-pg-config-huge-pages), [`b08-js-modules-dynamic-import`](/docs/topics/javascript#b08-js-modules-dynamic-import), [`b09-docker-dockerignore-build`](/docs/topics/docker#b09-docker-dockerignore-build), [`b09-js-async-event-loop-block`](/docs/topics/javascript#b09-js-async-event-loop-block), [`b09-qt-thread-qthreadpool`](/docs/topics/qt#b09-qt-thread-qthreadpool), [`b11-cpp-iwyu-cleanup`](/docs/topics/cpp#b11-cpp-iwyu-cleanup), [`exp-docker-build-multistage`](/docs/topics/docker#exp-docker-build-multistage), [`exp-js-runtime-memory-detached`](/docs/topics/javascript#exp-js-runtime-memory-detached), [`exp-pg-config-shared-buffers`](/docs/topics/postgres#exp-pg-config-shared-buffers)

### MEO {#meo}

**Medium Earth Orbit** — keskikorkea kiertorata (~19 000–23 000 km GNSS:lle). GPS-, Galileo- ja GLONASS-satelliitit sijoitetaan MEO:lle globaalin peiton ja kohtuullisen signaaliviiveen vuoksi.

**Oppitunnit:** [`space-orbit-meo-gnss`](/docs/topics/space#space-orbit-meo-gnss), [`space-orbit-geo-comms`](/docs/topics/space#space-orbit-geo-comms)

### MIME {#mime}

**Multipurpose Internet Mail Extensions** — standardi tiedostotyyppien tunnistamiseen (esim. `text/plain`, `application/json`, `image/png`). Qt:n drag-and-drop -mekanismissa `QMimeData` sisältää siirrettävän datan MIME-tyyppiavaimilla; ulkoisiin sovelluksiin vetäminen edellyttää oikean MIME-tyypin rekisteröintiä.

**Oppitunnit:** [`b06-qt-models-mime-drag`](/docs/topics/qt#b06-qt-models-mime-drag)

### MIN {#min}

**MIN** — SQL-aggregaattifunktio, joka palauttaa pienimmän arvon ryhmässä tai partitiossa. Ikkunafunktiona `MIN(...) OVER (PARTITION BY ...)` laskee ositusten minimin ilman `GROUP BY` -rajoitteita; käytetään myös ensimmäisen arvon hakuun tietyn järjestyksen mukaan vaihtoehtona `FIRST_VALUE`-funktiolle.

**Oppitunnit:** [`sqd-first-value-partition`](/docs/topics/postgres#sqd-first-value-partition)

### MITM {#mitm}

**MITM** (Man-in-the-Middle) — hyökkäystyyppi, jossa hyökkääjä asettautuu kahden osapuolen viestinnän väliin salakuuntelemaan tai muokkaamaan liikennettä. `curl -v` ja `--trace` paljastavat HTTP-headerit debuggauksessa, mutta tuotantoliikenteessä headerien loggaus voi helpottaa MITM-analyysiä tai paljastaa salaisuuksia.

**Oppitunnit:** [`b07-linux-network-curl-debug`](/docs/topics/linux#b07-linux-network-curl-debug)

### MOC {#moc}

**Meta-Object Compiler** — Qt:n esikäsittelytyökalu, joka generoi signals/slots- ja `Q_OBJECT`-mekanismin vaatiman C++-koodin. CMakessa `set_target_properties(... AUTOMOC ON)` ajaa MOC:n automaattisesti jokaiselle headerille, jossa on `Q_OBJECT`-makro.

**Oppitunnit:** [`b04-qt-meta-object-moc`](/docs/topics/qt#b04-qt-meta-object-moc)

### MQTT {#mqtt}

**MQTT** (Message Queuing Telemetry Transport) — kevyt julkaisija-tilaaja-viestintäprotokolla IoT-laitteille ja reaaliaikasovelluksille (portit 1883/8883). Qt-sovelluksissa MQTT-client pyörii worker-säikeessä; signaali-slotti-mekanismi välittää viestit UI-säikeeseen thread-turvallisesti.

**Oppitunnit:** [`b04-qt-thread-affinity`](/docs/topics/qt#b04-qt-thread-affinity)

### MSL {#msl}

**Metal Shading Language** — Applen Metal-grafiikka-API:n varjostinkieli. Qt 6 RHI kääntää GLSL-varjostimet MSL:ksi macOS/iOS-alustoilla `qsb`-työkalulla. Shader-lähde tallennetaan GLSL:nä versionhallintaan; `qsb` generoi MSL-, SPIR-V- ja HLSL-variantit buildissa.

**Oppitunnit:** [`b03-qt-shaders-rhi-fallback`](/docs/topics/qt#b03-qt-shaders-rhi-fallback), [`b07-qt-shader-qsb`](/docs/topics/qt#b07-qt-shader-qsb)

### MSVC {#msvc}

**Microsoft Visual C++** — Microsoftin C++-kääntäjä ja kehitystyökalupaketti. C++-moduulit vaativat MSVC 2022:n, GCC 13+:n tai Clang 16+:n. `clcache` vastaa MSVC:lle sitä, mitä `ccache` on GCC/Clangille.

**Oppitunnit:** [`b08-cpp-modules-headers`](/docs/topics/cpp#b08-cpp-modules-headers), [`b11-cpp-ccache-ci`](/docs/topics/cpp#b11-cpp-ccache-ci), [`b11-cpp-werror-policy`](/docs/topics/cpp#b11-cpp-werror-policy), [`b11-cpp-compile-commands`](/docs/topics/cpp#b11-cpp-compile-commands)

### MTR {#mtr}

**MTR** (My Traceroute) — verkkodiagnostiikkatyökalu, joka yhdistää `ping`- ja `traceroute`-toiminnallisuuden jatkuvaan seurantaan. `mtr --report host` näyttää jokaisen hypyn pakettihäviön ja latenssit; ICMP-vastauksettomuus ei aina tarkoita ongelmaa, sillä monet reitittimet hylkäävät ICMP-paketit.

**Oppitunnit:** [`b08-linux-network-traceroute`](/docs/topics/linux#b08-linux-network-traceroute)

### MTTR {#mttr}

**MTTR** (Mean Time To Recovery) — keskimääräinen palautumisaika viasta normaalitilaan. Docker healthcheck -interval ja `start_period` vaikuttavat MTTR:ään: liian harva tarkistus pidentää havaintoaikaa, liian tiheä kuormittaa palvelua turhaan.

**Oppitunnit:** [`b04-docker-health-interval`](/docs/topics/docker#b04-docker-health-interval)

### MTU {#mtu}

**Maximum Transmission Unit** — verkon suurin sallittu pakettikooko tavuina (Ethernet-oletus 1500). Docker overlay-verkoissa tunneloinnin ylikuorma voi aiheuttaa fragmentointia tai timeouteja — `ip link show` näyttää rajapinnan MTU:n; pienentäminen ratkaisee MTU-mismatch-ongelmat.

**Oppitunnit:** [`b06-linux-network-ethtool-offload`](/docs/topics/linux#b06-linux-network-ethtool-offload), [`b09-linux-net-tcpdump-incident`](/docs/topics/linux#b09-linux-net-tcpdump-incident)

### MTU/MSS {#mtu-mss}

**MTU/MSS** — verkon paketin kokomääritykset: **Maximum Transmission Unit** (MTU, suurin L2-kehyksen koko, yleensä 1500 tavua Ethernetissä) ja **Maximum Segment Size** (MSS, suurin TCP-datan koko yhdessä segmentissä). MTU/MSS-yhteensopimattomuus voi aiheuttaa hiljaisia yhteysongelmia; `tcpdump` ja `ip link show` auttavat diagnosoinnissa.

**Oppitunnit:** [`b07-linux-network-tcpdump`](/docs/topics/linux#b07-linux-network-tcpdump)

### MVCC {#mvcc}

**Multi-Version Concurrency Control** — PostgreSQLin rinnakkaisuusmalli, jossa jokainen transaktio näkee konsistentin snapshot-mukaisen version taulusta ilman lukukuormia lukoilla. Poistetut ja päivitetyt rivit jättävät dead tuple -bloatia, jonka VACUUM siivoaa.

**Oppitunnit:** [`b02-pg-vacuum-bloat-09`](/docs/topics/postgres#b02-pg-vacuum-bloat-09), [`b04-pg-vacuum-long-xact`](/docs/topics/postgres#b04-pg-vacuum-long-xact), [`b07-pg-vacuum-freeze`](/docs/topics/postgres#b07-pg-vacuum-freeze), [`pg-vacuum-bloat`](/docs/topics/postgres#pg-vacuum-bloat), [`b02-pg-vacuum-long-xact-11`](/docs/topics/postgres#b02-pg-vacuum-long-xact-11), [`b02-pg-vacuum-full-12`](/docs/topics/postgres#b02-pg-vacuum-full-12), [`b06-pg-vacuum-index-cleanup`](/docs/topics/postgres#b06-pg-vacuum-index-cleanup), [`b07-pg-vacuum-bloat`](/docs/topics/postgres#b07-pg-vacuum-bloat)

### NAS {#nas}

**Network Attached Storage** — verkkoon liitetty tallennuslaite, joka tarjoaa tiedostojärjestelmän (NFS, SMB/CIFS) usean koneen käyttöön. systemd-unitissa `ConditionPathExists`-ehdolla varmistetaan, että NAS-mount on kytketty ennen varmuuskopiopalvelun käynnistystä.

**Oppitunnit:** [`b05-linux-avahi-browse`](/docs/topics/linux#b05-linux-avahi-browse), [`b06-linux-systemd-ConditionPath`](/docs/topics/linux#b06-linux-systemd-ConditionPath), [`b07-linux-avahi-daemon-check`](/docs/topics/linux#b07-linux-avahi-daemon-check)

### NAT {#nat}

**Network Address Translation** — verkkoosoitteiden muuntaminen reitittimessä tai palomuurissa. Docker bridge -verkko käyttää NAT:ia porttikartoituksessa (`-p host:container`); `--network host` ohittaa NAT:in kokonaan Linuxilla.

**Oppitunnit:** [`b02-docker-net-host-08`](/docs/topics/docker#b02-docker-net-host-08), [`b05-docker-net-host-mode`](/docs/topics/docker#b05-docker-net-host-mode), [`b06-docker-network-ipvlan`](/docs/topics/docker#b06-docker-network-ipvlan), [`b07-docker-network-host`](/docs/topics/docker#b07-docker-network-host), [`b07-linux-network-firewall-nft`](/docs/topics/linux#b07-linux-network-firewall-nft), [`b08-docker-network-host`](/docs/topics/docker#b08-docker-network-host), [`b09-linux-net-nat-troubleshoot`](/docs/topics/linux#b09-linux-net-nat-troubleshoot), [`b12-linux-udp-stateless-firewall`](/docs/topics/linux#b12-linux-udp-stateless-firewall), [`docker-host-network`](/docs/topics/docker#docker-host-network), [`docker-macvlan`](/docs/topics/docker#docker-macvlan), [`exp-docker-net-publish-bind`](/docs/topics/docker#exp-docker-net-publish-bind), [`linux-ip-route`](/docs/topics/linux#linux-ip-route)

### NDEBUG {#ndebug}

`NDEBUG` on C/C++-esikäsittelijämakro, joka poistaa `assert()`-tarkistukset release-buildeistä. Release-buildissä kääntäjä lisää `-DNDEBUG`-lipun, jolloin `assert` kääntyy tyhjäksi; debug-buildissä `assert` tarkistaa ehdon ja kaataa ohjelman, jos se ei täyty.

**Oppitunnit:** [`b08-cpp-assert-ndebug`](/docs/topics/cpp#b08-cpp-assert-ndebug), [`b11-cpp-assert-side-effect`](/docs/topics/cpp#b11-cpp-assert-side-effect)

### NDP {#ndp}

**NDP** (Neighbor Discovery Protocol) — IPv6:n protokolla, joka korvaa IPv4:n ARP:n. NDP hoitaa osoiteresoluution (MAC↔IPv6), reitittimen löydön ja duplicate address detection (DAD). Palomuurisäännöt ja Docker-managed iptables-säännöt voivat tahattomasti blokata NDP-liikennettä.

**Oppitunnit:** [`b09-linux-net-nat-troubleshoot`](/docs/topics/linux#b09-linux-net-nat-troubleshoot)

### NEXTVAL {#nextval}

PostgreSQL-sekvenssifunktio. `NEXTVAL('sequence_name')` palauttaa sekvenssin seuraavan kokonaisluvun ja kasvattaa laskuria atomisesti. Käytetään automaattisten perusavainten taustalla (`SERIAL`- ja `GENERATED ALWAYS AS IDENTITY` -sarakkeet).

**Oppitunnit:** [`sqd-lead-future-row`](/docs/topics/postgres#sqd-lead-future-row)

### NFR {#nfr}

**Non-Functional Requirement** — ei-toiminnallinen vaatimus, kuten suorituskyky, saatavuus tai tietoturva. DoD voi sisältää NFR-kriteerejä, kuten `p95 < 200ms`; jos NFR rikkoutuu sprintin aikana, story ei ole valmis — korjataan tai tehdään erillinen perf-tarina.

**Oppitunnit:** [`b02-scrum-dod-perf-02`](/docs/topics/scrum#b02-scrum-dod-perf-02)

### NIC {#nic}

**Network Interface Card** — fyysinen tai virtuaalinen verkkokortti. `ethtool eth0` näyttää NIC:n linkin nopeuden ja duplex-tilan. Docker-verkko voi jakaa parent-NIC:n IP-osoitteen (ipvlan) tai MAC-osoitteen (macvlan) riippuen tarvittavasta eristyksestä.

**Oppitunnit:** [`b03-linux-network-ethtool-link`](/docs/topics/linux#b03-linux-network-ethtool-link), [`b06-docker-network-ipvlan`](/docs/topics/docker#b06-docker-network-ipvlan), [`b06-linux-network-ethtool-offload`](/docs/topics/linux#b06-linux-network-ethtool-offload), [`exp-docker-net-macvlan`](/docs/topics/docker#exp-docker-net-macvlan)

### NL {#nl}

CppCoreGuidelines NL (Naming and layout rules) -osio sisältää nimeämiskäytännöt C++-koodille. NL.9 kieltää varatut tunnisteet (kaksoisalaviivat, alaviiva + isoksi kirjain alussa); editori- ja linter-integraatiot tarkistavat sääntöjen noudattamisen.

**Oppitunnit:** [`b08-pg-explain-nested-loop`](/docs/topics/postgres#b08-pg-explain-nested-loop), [`b11-cpp-underscore-identifier`](/docs/topics/cpp#b11-cpp-underscore-identifier)

### NLL {#nll}

**Non-Lexical Lifetimes** — Rustin modernin lainaustarkistimen ominaisuus. Lainauksen elinikä päättyy viimeiseen käyttökohtaan eikä leksikaalisen lohkon loppuun, jolloin voidaan kirjoittaa joustavampaa koodia ilman tarpeetonta kloonausta.

**Oppitunnit:** [`rust-borrow-mut`](/docs/topics/rust#rust-borrow-mut)

### NM {#nm}

**NetworkManager** — Linuxin verkkoyhteyksien hallintadaemon. `nmcli`-komentorivityökalulla hallitaan yhteyksiä, aktivoidaan profiileja ja tarkistetaan DNS-asetuksia; `nmcli connection up <profiili>` vaihtaa aktiivisen verkkoprofiilin.

**Oppitunnit:** [`b02-linux-network-nmcli-11`](/docs/topics/linux#b02-linux-network-nmcli-11), [`b02-linux-network-resolv-10`](/docs/topics/linux#b02-linux-network-resolv-10), [`b04-linux-network-route-metric`](/docs/topics/linux#b04-linux-network-route-metric), [`b04-linux-resolv-stub`](/docs/topics/linux#b04-linux-resolv-stub), [`b05-linux-network-resolv-search`](/docs/topics/linux#b05-linux-network-resolv-search), [`b08-linux-network-nmcli`](/docs/topics/linux#b08-linux-network-nmcli), [`exp-linux-network-nmcli-down`](/docs/topics/linux#exp-linux-network-nmcli-down), [`linux-nmcli`](/docs/topics/linux#linux-nmcli), [`b12-linux-dbus-polkit-deny`](/docs/topics/linux#b12-linux-dbus-polkit-deny)

### NMEA {#nmea}

**National Marine Electronics Association** 0183 — tekstimuotoinen lausestandardi GNSS-paikkatiedon siirtoon (esim. `$GPGGA`, `$GPRMC`). Helppo parsia; survey-tarkkuudessa käytetään usein valmistajan binääriä tai RTCM/RINEX-ketjua.

**Oppitunnit:** [`space-sig-nmea`](/docs/topics/space#space-sig-nmea)

### NOFILE {#nofile}

Systemd-palveluyksikön `LimitNOFILE`-asetus määrittää prosessin avointen tiedostokuvainten (file descriptor) enimmäismäärän. Verkkopalvelimilla oletusraja (1024) on usein liian alhainen — `LimitNOFILE=65536` asetetaan yksikkökohtaisesti palvelutiedostossa, ei `/etc/security/limits.conf`-tiedostossa.

**Oppitunnit:** [`b06-linux-systemd-LimitsNOFILE`](/docs/topics/linux#b06-linux-systemd-LimitsNOFILE), [`b07-linux-systemd-limit-nofile`](/docs/topics/linux#b07-linux-systemd-limit-nofile)

### NRVO {#nrvo}

**Named Return Value Optimization** — C++-kääntäjän optimointi, joka eliminoi paikallisen muuttujan kopion palautusarvosta. `std::move(local)` paikalliseen palautukseen *estää* NRVO:n — anna kääntäjän optimoida itse. Käytä `std::move` vain parametrien tai jäsenten palautukseen.

**Oppitunnit:** [`b02-cpp-perf-move-09`](/docs/topics/cpp#b02-cpp-perf-move-09), [`b03-cpp-cr-move-semantics`](/docs/topics/cpp#b03-cpp-cr-move-semantics), [`perf-rvo`](/docs/topics/cpp#perf-rvo)

### NRVO/RVO {#nrvo-rvo}

**Named Return Value Optimization / Return Value Optimization** — C++-kääntäjän optimointi, joka poistaa turhat kopioinnit palautusarvoista. NRVO koskee nimettyä paluumuuttujaa, RVO tilapäistä arvoa; `std::move` palautuksessa voi paradoksaalisesti estää optimoinnin.

**Oppitunnit:** [`b02-cpp-perf-move-09`](/docs/topics/cpp#b02-cpp-perf-move-09)

### NSS {#nss}

**Name Service Switch** — Linux-mekanismi, joka määrittää nimien hakujärjestyksen `/etc/nsswitch.conf`-tiedostossa. Avahi-mDNS-nimet (`*.local`) vaativat `libnss-mdns`-paketin ja `mdns4_minimal`-merkinnän NSS-konfiguraatioon.

**Oppitunnit:** [`b03-linux-avahi-hostname-local`](/docs/topics/linux#b03-linux-avahi-hostname-local), [`b04-linux-avahi-browse`](/docs/topics/linux#b04-linux-avahi-browse), [`b06-linux-avahi-resolve-hostname`](/docs/topics/linux#b06-linux-avahi-resolve-hostname), [`b07-linux-avahi-resolve`](/docs/topics/linux#b07-linux-avahi-resolve), [`b08-linux-avahi-resolve`](/docs/topics/linux#b08-linux-avahi-resolve)

### NSS/DNS {#nss-dns}

**Name Service Switch / Domain Name System** — Linux-nimenhakumekanismi. `/etc/nsswitch.conf` määrittää, missä järjestyksessä nimet haetaan (tiedostot, DNS, mDNS). `avahi` rekisteröityy omaksi NSS-moduulikseen, joten mDNS-resoluutio voidaan testata erillään perinteisestä DNS-ketjusta.

**Oppitunnit:** [`b07-linux-avahi-resolve`](/docs/topics/linux#b07-linux-avahi-resolve)

### NTILE {#ntile}

SQL-ikkunafunktio, joka jakaa rivit N tasaiseen ryhmään (bucket) ja palauttaa kunkin rivin ryhmänumeron. `NTILE(4)` jakaa rivit neljäsosiin (kvartiileihin); eroaa `PERCENT_RANK`-funktiosta siten, että NTILE jakaa rivit tasaisesti, ei prosentteja.

**Oppitunnit:** [`sqd-ntile-buckets`](/docs/topics/postgres#sqd-ntile-buckets), [`sqd-rank-vs-dense`](/docs/topics/postgres#sqd-rank-vs-dense)

### NTP {#ntp}

**Network Time Protocol** — verkkoprotokolla kellonajan synkronointiin. systemd-journald voi merkitä lokit epäluotettavilla aikaleimauilla, jos NTP ei ole käytössä tai kello hyppii. `timedatectl status` näyttää NTP-synkronoinnin tilan; `systemd-timesyncd` on Linuxin kevyt NTP-asiakas.

**Oppitunnit:** [`b06-linux-journalctl-verify`](/docs/topics/linux#b06-linux-journalctl-verify), [`b12-js-runtime-performance-now`](/docs/topics/javascript#b12-js-runtime-performance-now), [`b12-linux-tcp-udp-handshake`](/docs/topics/linux#b12-linux-tcp-udp-handshake), [`systemd-after-before`](/docs/topics/linux#systemd-after-before)

### NTRIP {#ntrip}

**Networked Transport of RTCM via Internet Protocol** — protokolla RTK/DGPS-korjausdatan siirtoon IP-verkon yli casterilta vastaanottimelle (mountpointit).

**Oppitunnit:** [`space-pos-cors-ntrip`](/docs/topics/space#space-pos-cors-ntrip)

### NUL {#nul}

NUL-merkki (`\0`, tavuarvo 0) C/C++:n merkkijonojen päätteenä. `std::string_view` ei oleta NUL-päätettä ja voi kuvata binääridataa; perinteiset `char*`-funktiot kuten `strlen()` olettavat NUL-päätteen. Binääristen puskurien välittäminen legacy-rajapinnoille ilman NUL-päätettä on yleinen bugilähde.

**Oppitunnit:** [`b09-cpp-span-bounds-check`](/docs/topics/cpp#b09-cpp-span-bounds-check), [`maintain-string-view`](/docs/topics/cpp#maintain-string-view)

### NVIDIA {#nvidia}

Grafiikkakorttien ja GPU-laskenta-arkkitehtuurin valmistaja (NVIDIA Corporation). NVIDIA- ja AMD-ajurit toteuttavat OpenGL/Vulkan-spesifikaation eri tarkkuudella; shadereissa esiintyvät geometria- tai värivirheet voivat olla ajuri- tai GPU-kohtaisia.

**Oppitunnit:** [`b02-qt-shaders-uniform-14`](/docs/topics/qt#b02-qt-shaders-uniform-14)

### NXDOMAIN {#nxdomain}

DNS-vastauskoodi: haettua domain-nimeä ei ole olemassa. Authoritative-nimipalvelin palauttaa `NXDOMAIN`, kun nimi ei kuulu sen hallinnoimaan vyöhykkeeseen. `dig example.com` näyttää `status: NXDOMAIN` — erottaa DNS-konfigurointivirheet resolver-ongelmista.

**Oppitunnit:** [`b07-linux-network-dns-dig`](/docs/topics/linux#b07-linux-network-dns-dig)

### ODR {#odr}

**One Definition Rule** — C++-standardin sääntö: jokaisella funktiolla, muuttujalla ja tyypillä saa olla tasan yksi määritelmä koko linkitettävässä ohjelmassa. `constexpr`-vakiot ja `inline`-funktiot headerissa ovat ODR-turvallisia; makroilla ei ole ODR-suojaa.

**Oppitunnit:** [`b11-cpp-macro-to-constexpr`](/docs/topics/cpp#b11-cpp-macro-to-constexpr)

### OIDC {#oidc}

**OpenID Connect** — OAuth 2.0:n päälle rakennettu identiteettiprotokolla, joka lisää käyttäjätunnistuksen (ID token) valtuutusvirran päälle. CI-ympäristöissä OIDC-federaatio mahdollistaa salasanattoman pilvipääsyn — esim. GitHub Actions voi pyytää lyhytaikaisia AWS-tunnistetietoja ilman tallennettuja salaisuuksia.

**Oppitunnit:** [`ci-secret-management`](/docs/topics/git#ci-secret-management)

### OKR {#okr}

**Objectives and Key Results** — tavoitteenhallintakehys, jossa organisaatio asettaa korkeatasoiset tavoitteet (Objectives) ja mitattavat avaintulokset (Key Results). OKR toimii strategisella tasolla; Scrumin sprint goal on taktinen tiimitason tavoite, joka voi tukea OKR:ää mutta ei korvaa sitä.

**Oppitunnit:** [`b02-scrum-sprint-goal-10`](/docs/topics/scrum#b02-scrum-sprint-goal-10)

### OPTIONS {#options}

HTTP-metodi, jolla selain tekee CORS-preflight-pyynnön ennen ei-yksinkertaista cross-origin-pyyntöä (esim. POST JSON toiselle domainille). Palvelin vastaa `Access-Control-Allow-*`-headereilla; network-välilehdellä näkyy OPTIONS-pyyntö ennen varsinaista pyyntöä.

**Oppitunnit:** [`b05-js-fetch-cors-preflight`](/docs/topics/javascript#b05-js-fetch-cors-preflight)

### ORM {#orm}

**Object-Relational Mapping** — ohjelmistokerros, joka muuntaa olio-rakenteet SQL-kyselyiksi automaattisesti. ORM lähettää usein uuden SQL-merkkijonon joka kutsulla ilman valmistelua, ja voi aiheuttaa N+1-ongelman; korjataan eager loadingilla tai `PREPARE`-protokollan hyödyntämisellä.

**Oppitunnit:** [`b05-pg-indexes-expression`](/docs/topics/postgres#b05-pg-indexes-expression), [`b07-pg-explain-prepare`](/docs/topics/postgres#b07-pg-explain-prepare), [`prod-backend-n-plus-one`](/docs/topics/backend#prod-backend-n-plus-one), [`sqd-many-to-many-bridge`](/docs/topics/postgres#sqd-many-to-many-bridge), [`sqd-parameterized-query`](/docs/topics/postgres#sqd-parameterized-query), [`sqd-select-columns-only`](/docs/topics/postgres#sqd-select-columns-only)

### OUTPUT {#output}

iptables/nftables-palomuurin ketju, joka käsittelee paikallisesta koneesta lähtevän liikenteen. `FORWARD`-ketju käsittelee reititetyn liikenteen (esim. konttien NAT), `OUTPUT` paikallisten prosessien pyynnöt. VPN-clientin reitit ja palomuurisäännöt pitää tarkistaa sekä `FORWARD`- että `OUTPUT`-ketjuista.

**Oppitunnit:** [`b02-linux-network-route-09`](/docs/topics/linux#b02-linux-network-route-09), [`linux-ip-route`](/docs/topics/linux#linux-ip-route)

### OWASP {#owasp}

**Open Web Application Security Project** — voittoa tavoittelematon organisaatio web-tietoturvan edistämiseksi. OWASP Top 10 listaa yleisimmät web-haavoittuvuudet (injektio, broken access control, prototype pollution); DoD voi edellyttää OWASP-katselmoinnin ennen tarinan hyväksyntää.

**Oppitunnit:** [`b05-js-runtime-prototype-pollution`](/docs/topics/javascript#b05-js-runtime-prototype-pollution), [`exp-js-runtime-prototype-pollution`](/docs/topics/javascript#exp-js-runtime-prototype-pollution), [`exp-scrum-dod-security-review`](/docs/topics/scrum#exp-scrum-dod-security-review), [`prod-sec-csrf`](/docs/topics/security#prod-sec-csrf), [`prod-sec-password-hash`](/docs/topics/security#prod-sec-password-hash), [`sqd-error-leak`](/docs/topics/postgres#sqd-error-leak), [`sqd-parameterized-query`](/docs/topics/postgres#sqd-parameterized-query), [`prod-sec-xss`](/docs/topics/security#prod-sec-xss)

### OWASP/MDN {#owasp-mdn}

**OWASP / Mozilla Developer Network** — kaksi keskeistä web-tietoturvan ja webkehityksen viitelähdettä. OWASP (Open Web Application Security Project) julkaisee mm. Top 10 -haavoittuvuuslistan; MDN tarjoaa selainrajapintojen viralliset dokumentaatiot. Prototype pollution -haavoittuvuuksien torjunnassa molempia lähteitä käytetään rinnakkain.

**Oppitunnit:** [`b02-js-runtime-pollution-14`](/docs/topics/javascript#b02-js-runtime-pollution-14), [`b05-js-runtime-prototype-pollution`](/docs/topics/javascript#b05-js-runtime-prototype-pollution)

### PCH/IWYU {#pch-iwyu}

**Precompiled Header / Include What You Use** — kaksi C++-buildin optimointitekniikkaa. PCH nopeuttaa käännöstä esikäännettämällä usein muuttumattomat headerit; IWYU-työkalu analysoi, mitkä `#include`-direktiivit ovat tarpeettomia. C++20 modules on pitkän aikavälin ratkaisu, joka korvaa sekä PCH:n että IWYU-tarpeen.

**Oppitunnit:** [`b08-cpp-modules-headers`](/docs/topics/cpp#b08-cpp-modules-headers), [`b11-cpp-ccache-ci`](/docs/topics/cpp#b11-cpp-ccache-ci)

### PCI {#pci}

**Payment Card Industry** — viittaa PCI DSS -standardiin (Payment Card Industry Data Security Standard). Maksukorttidataa käsittelevien järjestelmien tietoturvavaatimus; velvoittaa mm. salatut yhteydet (TLS) kaikkeen kortinhaltijadatan siirtoon tietokantayhteydet mukaan lukien.

**Oppitunnit:** [`b03-pg-config-ssl-mode`](/docs/topics/postgres#b03-pg-config-ssl-mode)

### PDF {#pdf}

**Portable Document Format** — Adoben kehittämä dokumenttiformaatti, joka säilyttää ulkoasun laitteesta riippumatta. Ohjelmistotuotannossa PDF-tuki on usein User Storyn hyväksymiskriteeri (esim. "asiakas voi ladata laskun PDF-muodossa"), joka pitää määritellä konkreettisesti DoR/DoD-vaiheessa.

**Oppitunnit:** [`exp-scrum-dor-acceptance-tests`](/docs/topics/scrum#exp-scrum-dor-acceptance-tests)

### PG {#pg}

**PostgreSQL**-lyhenne; esiintyy komentojen ja parametrien nimissä (`pg_stat_activity`, `pgBouncer`, `PG 11`). Viittaa PostgreSQL-tietokantapalvelimeen tai sen versioon.

**Oppitunnit:** [`b02-pg-indexes-covering-04`](/docs/topics/postgres#b02-pg-indexes-covering-04), [`b03-pg-config-effective-cache`](/docs/topics/postgres#b03-pg-config-effective-cache), [`b04-pg-config-maintenance-work-mem`](/docs/topics/postgres#b04-pg-config-maintenance-work-mem), [`b04-pg-indexes-concurrent-create`](/docs/topics/postgres#b04-pg-indexes-concurrent-create), [`b05-pg-config-shared-buffers`](/docs/topics/postgres#b05-pg-config-shared-buffers), [`b06-pg-config-huge-pages`](/docs/topics/postgres#b06-pg-config-huge-pages), [`b06-pg-config-parallel-workers`](/docs/topics/postgres#b06-pg-config-parallel-workers), [`b06-pg-config-track-io-timing`](/docs/topics/postgres#b06-pg-config-track-io-timing), [`b06-pg-indexes-reindex-concurrently`](/docs/topics/postgres#b06-pg-indexes-reindex-concurrently), [`b06-pg-vacuum-index-cleanup`](/docs/topics/postgres#b06-pg-vacuum-index-cleanup), [`b08-pg-config-checkpoint`](/docs/topics/postgres#b08-pg-config-checkpoint), [`b08-pg-config-max-connections`](/docs/topics/postgres#b08-pg-config-max-connections) (+9 muuta)

### PID {#pid}

**Process ID** — käyttöjärjestelmän prosessille antama yksilöivä kokonaisluku. `ss -tulpn` näyttää kuuntelevat portit PID:eineen; PostgreSQLin `pg_stat_activity` paljastaa backend-prosessien PID:t; kontti ajaa PID 1:nä, joten `--init` tarvitaan zombie-prosessien hallintaan.

**Oppitunnit:** [`b03-pg-locks-blocking-query`](/docs/topics/postgres#b03-pg-locks-blocking-query), [`b05-linux-network-ss-listen`](/docs/topics/linux#b05-linux-network-ss-listen), [`b06-docker-run-init`](/docs/topics/docker#b06-docker-run-init), [`b07-linux-journald-json`](/docs/topics/linux#b07-linux-journald-json), [`b08-linux-ss-listening`](/docs/topics/linux#b08-linux-ss-listening), [`b12-linux-tcp-close-wait-leak`](/docs/topics/linux#b12-linux-tcp-close-wait-leak), [`docker-exit-code`](/docs/topics/docker#docker-exit-code)

### PIN {#pin}

**Personal Identification Number** — henkilökohtainen tunnusnumero laiteautentikoinnissa. Bluetooth-parittamisessa headless-palvelin tarvitsee D-Bus-agentin (`bluetoothctl agent on`) vastaamaan PIN-kyselyihin automaattisesti. polkit-käytännöillä rajataan, mitkä D-Bus-toiminnot vaativat PIN-vahvistuksen.

**Oppitunnit:** [`b12-linux-dbus-bluez-pair`](/docs/topics/linux#b12-linux-dbus-bluez-pair), [`b12-linux-dbus-polkit-deny`](/docs/topics/linux#b12-linux-dbus-polkit-deny)

### PIVOT {#pivot}

SQL-tekniikka, joka kääntää rivejä sarakkeiksi (esim. kuukausittaiset myyntiluvut erillisiksi sarakkeiksi raportointia varten). PostgreSQL ei tue `PIVOT`-avainsanaa kuten SQL Server tai Oracle — sen sijaan käytetään `crosstab()` (tablefunc-laajennus) tai ehdollista aggregointia (`FILTER`/`CASE WHEN`).

**Oppitunnit:** [`sqd-crosstab-alternative`](/docs/topics/postgres#sqd-crosstab-alternative)

### PK {#pk}

**Primary Key** — tietokantataulun perusavain, joka yksilöi jokaisen rivin. Keyset-paginaatiossa sivutus perustuu PK:n tai muun uniikkisorttauskolumnin viimeiseen arvoon `OFFSET`-sijasta, mikä on indeksitehokas tapa käsitellä suuria taulukoita.

**Oppitunnit:** [`sqd-keyset-pagination`](/docs/topics/postgres#sqd-keyset-pagination)

### PL {#pl}

Viittaa PostgreSQLin kontekstissa **PL/pgSQL**-proseduurikieleen, joka mahdollistaa muuttujat, silmukat ja poikkeustenkäsittelyn SQL-lohkoissa. Dynaaminen pivot-kysely vaatii usein PL/pgSQL-funktiota, koska sarakkeiden nimiä ei tunneta etukäteen.

**Oppitunnit:** [`sqd-parameterized-query`](/docs/topics/postgres#sqd-parameterized-query), [`sqd-pivot-conditional-agg`](/docs/topics/postgres#sqd-pivot-conditional-agg), [`b05-scrum-dev-ownership`](/docs/topics/scrum#b05-scrum-dev-ownership)

### PLC {#plc}

**Programmable Logic Controller** — teollisuuden ohjelmoitava logiikka koneiden ja prosessien ohjaukseen. PLC kommunikoi usein Modbus- tai OPC UA -protokollalla ja voi odottaa yhteyttä tietyltä MAC-osoitteelta; Docker macvlan-verkko mahdollistaa konttien saamisen suoraan tehdas-LAN-segmenttiin.

**Oppitunnit:** [`exp-docker-net-macvlan`](/docs/topics/docker#exp-docker-net-macvlan)

### PM {#pm}

**Project Manager** — projektipäällikkö. Scrumissa tiimi on itseohjautuva eikä tarvitse ulkoista PM:ää tehtävien delegointiin — PO vastaa backlogista ja priorisoinnista, SM fasilitoi prosessia. Ulkoinen PM Scrum-tiimissä on antimalli, joka häiritsee itseohjautuvuutta.

**Oppitunnit:** [`b05-scrum-dev-ownership`](/docs/topics/scrum#b05-scrum-dev-ownership), [`b08-scrum-team-self-organizing`](/docs/topics/scrum#b08-scrum-team-self-organizing)

### PO {#po}

**Product Owner** — Scrumin tuoteomistaja, joka vastaa Product Backlogin priorisoinnista ja arvon maksimoinnista. PO hyväksyy tarinat Sprint Reviewssa ja on kehitystiimin pääasiallinen sidosryhmäyhdyshenkilö.

**Oppitunnit:** [`b02-scrum-dor-size-06`](/docs/topics/scrum#b02-scrum-dor-size-06), [`b02-scrum-sprint-daily-11`](/docs/topics/scrum#b02-scrum-sprint-daily-11), [`b02-scrum-sprint-review-12`](/docs/topics/scrum#b02-scrum-sprint-review-12), [`b03-scrum-artifacts-transparency`](/docs/topics/scrum#b03-scrum-artifacts-transparency), [`b03-scrum-dor-testable`](/docs/topics/scrum#b03-scrum-dor-testable), [`b03-scrum-empirical-inspect-adapt`](/docs/topics/scrum#b03-scrum-empirical-inspect-adapt), [`b03-scrum-events-timebox-review`](/docs/topics/scrum#b03-scrum-events-timebox-review), [`b03-scrum-tech-debt-backlog`](/docs/topics/scrum#b03-scrum-tech-debt-backlog), [`b04-scrum-backlog-refinement-ongoing`](/docs/topics/scrum#b04-scrum-backlog-refinement-ongoing), [`b04-scrum-cross-functional-delivery`](/docs/topics/scrum#b04-scrum-cross-functional-delivery), [`b04-scrum-dor-acceptance-clear`](/docs/topics/scrum#b04-scrum-dor-acceptance-clear), [`b04-scrum-pbi-invest`](/docs/topics/scrum#b04-scrum-pbi-invest) (+44 muuta)

### POC {#poc}

**Proof of Concept** — konseptikokeilu, jonka tarkoitus on osoittaa teknisen ratkaisun toimivuus pienessä mittakaavassa ennen täyttä toteutusta. Scrumissa POC:lle määritellään selkeä omistaja, päätöskriteeri ja aikaraja, jotta se ei leviä hallitsemattomaksi tutkimushaaraksi.

**Oppitunnit:** [`b06-scrum-scrum-master-coaching`](/docs/topics/scrum#b06-scrum-scrum-master-coaching)

### PORTS {#ports}

`docker ps` -tulosteen PORTS-sarake, joka näyttää kontin porttimappaukset (esim. `0.0.0.0:8080->80/tcp`). PORTS-sarake paljastaa heti, onko `--publish`-direktiivi kunnossa. Tuotannossa kannattaa bindaa vain tarvittavat portit ja käyttää `127.0.0.1:8080:80`-muotoa julkisen IP:n sijaan.

**Oppitunnit:** [`b07-docker-network-publish`](/docs/topics/docker#b07-docker-network-publish), [`b09-docker-net-publish-range`](/docs/topics/docker#b09-docker-net-publish-range)

### POSIX {#posix}

**Portable Operating System Interface** — IEEE-standardi Unix-yhteensopiville käyttöjärjestelmille. Määrittelee C-kirjaston funktiot, tiedostojärjestelmän rajapinnan ja prosessien hallinnan. `rename()` ja tiedosto-operaatiot ovat POSIX-standardoituja; C++17:n `std::filesystem` korvaa useimmat POSIX-spesifiset kutsut kannettavalla tavalla.

**Oppitunnit:** [`b07-cpp-endian-portable`](/docs/topics/cpp#b07-cpp-endian-portable), [`b11-cpp-std-filesystem`](/docs/topics/cpp#b11-cpp-std-filesystem), [`prod-cpp-raii-rollback`](/docs/topics/cpp#prod-cpp-raii-rollback)

### POST {#post}

HTTP **POST** — pyyntömetodi, jolla lähetetään dataa palvelimelle (lomake, REST API -kirjoitusoperaatio). CORS-preflight lähettää ensin OPTIONS-pyynnön, kun mukana on `Content-Type: application/json` tai muu ei-yksinkertainen otsikko.

**Oppitunnit:** [`b05-js-async-debounce`](/docs/topics/javascript#b05-js-async-debounce), [`b05-js-fetch-cors-preflight`](/docs/topics/javascript#b05-js-fetch-cors-preflight), [`prod-sec-csrf`](/docs/topics/security#prod-sec-csrf)

### POSTROUTING {#postrouting}

`iptables`/`nftables`-ketju, joka käsittelee paketteja juuri ennen kuin ne lähtevät verkkoliitännältä. Käytetään NAT-masqueradingiin: `iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE` korvaa lähtevien pakettien lähde-IP:n hostin IP:llä — Docker käyttää tätä konttiverkkojen reititukseen.

**Oppitunnit:** [`b06-linux-network-resolv-options`](/docs/topics/linux#b06-linux-network-resolv-options)

### PPA {#ppa}

**Personal Package Archive** — Ubuntun Launchpad-alustalla isännöity kolmannen osapuolen pakettilähde. `add-apt-repository ppa:nimi/repo` lisää PPA:n ja hakee GPG-avaimen automaattisesti. Tuotantopalvelimilla PPA:n sijaan suositaan virallisia deb-paketteja tai allekirjoitettuja vendor-repoja turvallisuussyistä.

**Oppitunnit:** [`apt-repository-add`](/docs/topics/linux#apt-repository-add)

### PPP {#ppp}

**Precise Point Positioning** — tarkkuuspaikannus yhdellä vastaanottimella käyttäen tarkkoja rata-/kellotuotteita (IGS, Galileo HAS). Ei vaadi paikallista tukiasemaa kuten RTK, mutta konvergenssi kestää usein minuutteja.

**Oppitunnit:** [`space-pos-ppp`](/docs/topics/space#space-pos-ppp)

### PR {#pr}

**Pull Request** — pyyntö yhdistää koodimuutos päähaaraan (GitHub) tai merge request (GitLab). CI-pipeline ajaa testit ja lint-tarkistukset PR:n avautuessa; hyväksyntäkierros varmistaa laadun ennen mergeä.

**Oppitunnit:** [`b03-cpp-incident-sanitize-ubsan`](/docs/topics/cpp#b03-cpp-incident-sanitize-ubsan), [`b06-docker-build-target`](/docs/topics/docker#b06-docker-build-target), [`b07-cpp-clang-tidy-ci`](/docs/topics/cpp#b07-cpp-clang-tidy-ci), [`b09-cpp-clang-tidy-review`](/docs/topics/cpp#b09-cpp-clang-tidy-review), [`b09-cpp-sanitizer-ci-failure`](/docs/topics/cpp#b09-cpp-sanitizer-ci-failure), [`b11-cpp-braces-required`](/docs/topics/cpp#b11-cpp-braces-required), [`b11-cpp-ccache-ci`](/docs/topics/cpp#b11-cpp-ccache-ci), [`b11-cpp-iwyu-cleanup`](/docs/topics/cpp#b11-cpp-iwyu-cleanup), [`b12-ts-never-exhaustive`](/docs/topics/javascript#b12-ts-never-exhaustive), [`exp-scrum-dod-docs-minimum`](/docs/topics/scrum#exp-scrum-dod-docs-minimum), [`exp-scrum-dod-regression-suite`](/docs/topics/scrum#exp-scrum-dod-regression-suite), [`git-cherry-pick-conflict`](/docs/topics/git#git-cherry-pick-conflict) (+10 muuta)

### PREPARE {#prepare}

PostgreSQL `PREPARE`-komento, joka jäsentää ja suunnittelee SQL-kyselyn kerran ja sallii sen uudelleenkäytön eri parametreilla. Viidennestä suorituksesta alkaen PostgreSQL voi vaihtaa generic-planiin (`EXPLAIN (ANALYZE, GENERIC_PLAN)`). JDBC, pgx ja node-pg käyttävät prepared statementteja automaattisesti.

**Oppitunnit:** [`b06-pg-explain-generic-plan`](/docs/topics/postgres#b06-pg-explain-generic-plan), [`b07-pg-explain-prepare`](/docs/topics/postgres#b07-pg-explain-prepare)

### PRIVILEGES {#privileges}

SQL-käyttöoikeudet, joita hallinnoidaan `GRANT`- ja `REVOKE`-komennoilla. `GRANT ALL PRIVILEGES` antaa kaikki oikeudet, mutta parhaana käytäntönä suositellaan vähimmäisoikeusperiaatetta (least privilege) — lukurooli saa vain `SELECT`, ei kirjoitusoikeuksia.

**Oppitunnit:** [`sqd-least-privilege-grant`](/docs/topics/postgres#sqd-least-privilege-grant)

### QA {#qa}

**Quality Assurance** — ohjelmiston laadunvarmistus; prosessit ja testaukset, joilla varmistetaan vaatimusten täyttyminen. QA-tiimi raportoi bugeista ja löydöksistä, jotka kirjataan Product Backlogiin tarinoina tai vikoina.

**Oppitunnit:** [`b04-js-types-number-precision`](/docs/topics/javascript#b04-js-types-number-precision), [`b05-qt-widgets-size-hint`](/docs/topics/qt#b05-qt-widgets-size-hint), [`b07-js-async-abort`](/docs/topics/javascript#b07-js-async-abort), [`b08-qt-widgets-tooltip-delay`](/docs/topics/qt#b08-qt-widgets-tooltip-delay), [`ci-artifact-retention`](/docs/topics/git#ci-artifact-retention), [`exp-qt-widgets-size-hint`](/docs/topics/qt#exp-qt-widgets-size-hint), [`exp-scrum-dod-regression-suite`](/docs/topics/scrum#exp-scrum-dod-regression-suite), [`scrum-dod-automated-tests`](/docs/topics/scrum#scrum-dod-automated-tests), [`scrum-dod-partial`](/docs/topics/scrum#scrum-dod-partial), [`scrum-dod-shippable`](/docs/topics/scrum#scrum-dod-shippable), [`scrum-dod-team-ownership`](/docs/topics/scrum#scrum-dod-team-ownership), [`exp-scrum-dor-acceptance-tests`](/docs/topics/scrum#exp-scrum-dor-acceptance-tests) (+1 muuta)

### QML {#qml}

**Qt Modeling Language** — Qt Quick -käyttöliittymien deklaratiivinen kuvauskieli. QML-tiedostot määrittelevät komponenttihierarkian, animaatiot ja sidokset; sovelluslogiikka toteutetaan C++:ssa tai JavaScript-lohkoissa.

**Oppitunnit:** [`b09-qt-shaders-qml-graph-effect`](/docs/topics/qt#b09-qt-shaders-qml-graph-effect), [`b13-qt-quick-anchors-layout`](/docs/topics/qt#b13-qt-quick-anchors-layout), [`b13-qt-quick-application-engine`](/docs/topics/qt#b13-qt-quick-application-engine), [`b13-qt-quick-connections-signal`](/docs/topics/qt#b13-qt-quick-connections-signal), [`b13-qt-quick-context-property`](/docs/topics/qt#b13-qt-quick-context-property), [`b13-qt-quick-controls-style`](/docs/topics/qt#b13-qt-quick-controls-style), [`b13-qt-quick-debug-console`](/docs/topics/qt#b13-qt-quick-debug-console), [`b13-qt-quick-i18n-retranslate`](/docs/topics/qt#b13-qt-quick-i18n-retranslate), [`b13-qt-quick-image-async`](/docs/topics/qt#b13-qt-quick-image-async), [`b13-qt-quick-loader-component`](/docs/topics/qt#b13-qt-quick-loader-component), [`b13-qt-quick-property-binding`](/docs/topics/qt#b13-qt-quick-property-binding), [`b13-qt-quick-register-type`](/docs/topics/qt#b13-qt-quick-register-type) (+21 muuta)

### QRC {#qrc}

Qt:n resurssijärjestelmä, jossa staattiset tiedostot (kuvat, QML, shaderit) paketoidaan suoraan binääriin `.qrc`-XML-tiedoston avulla. Resurssit luetaan `:/polku/tiedosto`-prefixillä; ulkoista resurssia ei voi päivittää ilman uudelleenkäännöstä, joten dynaaminen sisältö ladataan tiedostojärjestelmästä.

**Oppitunnit:** [`b06-qt-resource-extern`](/docs/topics/qt#b06-qt-resource-extern)

### QSS {#qss}

**Qt Style Sheets** — Qt Widgets -sovelluksien CSS-innoittama tyylimäärittely. `setStyleSheet()`-kutsulla tai `.qss`-resurssitiedostolla asetetaan widgettien värit, fontit ja reunukset; QSS ylikirjoittaa natiivin alustakohtaisen tyylin ja vaatii testauksen kaikilla kohdealustoilla.

**Oppitunnit:** [`b04-qt-resource-qrc`](/docs/topics/qt#b04-qt-resource-qrc), [`b04-qt-widgets-qss`](/docs/topics/qt#b04-qt-widgets-qss), [`b07-qt-widget-stylesheet`](/docs/topics/qt#b07-qt-widget-stylesheet), [`b02-qt-shaders-qsb-13`](/docs/topics/qt#b02-qt-shaders-qsb-13), [`b06-qt-widgets-tab-order`](/docs/topics/qt#b06-qt-widgets-tab-order), [`b06-qt-widgets-focus-policy`](/docs/topics/qt#b06-qt-widgets-focus-policy), [`b06-qt-models-mime-drag`](/docs/topics/qt#b06-qt-models-mime-drag), [`b06-qt-shaders-precompile`](/docs/topics/qt#b06-qt-shaders-precompile)

### RBAC {#rbac}

**Role-Based Access Control** — roolipohjainen pääsynhallinta, jossa käyttäjille annetaan oikeuksia roolien kautta eikä suoraan. Kubernetesissa RBAC-säännöt (`Role`, `ClusterRole`, `RoleBinding`) määrittävät mitkä palvelutilit voivat tehdä esim. `kubectl exec`- tai `kubectl delete`-operaatioita.

**Oppitunnit:** [`b07-docker-exec-debug`](/docs/topics/docker#b07-docker-exec-debug)

### RBD {#rbd}

**RADOS Block Device** — Ceph-hajautetun tallennusjärjestelmän lohkolaite-rajapinta. Docker-volyymiajurit (RexRay, Rook) voivat käyttää RBD:tä tai vastaavia pilvipalveluita (AWS EBS, Azure Files) monisoluiseen, pysyvään tallennukseen.

**Oppitunnit:** [`b09-docker-vol-driver-local`](/docs/topics/docker#b09-docker-vol-driver-local)

### RDS {#rds}

**Amazon Relational Database Service** — AWS:n hallittu relaatiotietokantapalvelu (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server). RDS- ja Cloud SQL -instansseilla osa PostgreSQL-parametreista (`random_page_cost`, `shared_buffers`) asetetaan parametriryhmän kautta eikä suoraan `postgresql.conf`:ssa.

**Oppitunnit:** [`b03-pg-config-random-page-cost`](/docs/topics/postgres#b03-pg-config-random-page-cost)

### README {#readme}

Projektin juureen sijoitettava dokumentaatiotiedosto, jonka kehittäjät lukevat ensin. README kertoo käyttötarkoituksen, asennusohjeet ja yleisimmät komennot. Hyvä README sisältää myös ohjeet sanitizer-buildille ja CI-parityön varmistamiseksi.

**Oppitunnit:** [`b02-docker-net-alias-10`](/docs/topics/docker#b02-docker-net-alias-10), [`b04-docker-compose-profile`](/docs/topics/docker#b04-docker-compose-profile), [`b09-cpp-sanitizer-ci-failure`](/docs/topics/cpp#b09-cpp-sanitizer-ci-failure), [`exp-scrum-dod-docs-minimum`](/docs/topics/scrum#exp-scrum-dod-docs-minimum), [`jenkins-agent-label`](/docs/topics/git#jenkins-agent-label), [`rust-testing-doc-tests`](/docs/topics/rust#rust-testing-doc-tests), [`rust-tooling-cargo-features`](/docs/topics/rust#rust-tooling-cargo-features), [`b09-cpp-clang-tidy-review`](/docs/topics/cpp#b09-cpp-clang-tidy-review), [`ci-secret-management`](/docs/topics/git#ci-secret-management)

### READY {#ready}

systemd-notify-protokollan viesti `READY=1`, jonka palvelu lähettää `sd_notify()`-kutsulla ilmoittaakseen olevansa valmis vastaanottamaan pyyntöjä. `Type=notify` -uniteissa systemd odottaa tätä viestiä ennen kuin käynnistää riippuvaiset palvelut; `TimeoutStartSec` rajoittaa odotusajan.

**Oppitunnit:** [`b03-linux-systemd-type-notify`](/docs/topics/linux#b03-linux-systemd-type-notify), [`b05-linux-systemd-type-notify`](/docs/topics/linux#b05-linux-systemd-type-notify)

### REPEATABLE {#repeatable}

**REPEATABLE READ** — SQL-eristystaso, jossa sama `SELECT` palauttaa saman tuloksen transaktion aikana (non-repeatable readit estetään). PostgreSQL toteuttaa REPEATABLE READ MVCC:llä ilman lukoja; phantom readit estetään vasta SERIALIZABLE-tasolla.

**Oppitunnit:** [`b03-pg-explain-isolation-level`](/docs/topics/postgres#b03-pg-explain-isolation-level)

### REPL {#repl}

**Read-Eval-Print Loop** — interaktiivinen ohjelmointiympäristö, joka lukee syötteen, evaluoi sen ja tulostaa tuloksen. `node` (JavaScript), `python3` ja `iex` (Elixir) ovat esimerkkejä; namespace-import (`import * as M from './mod.js'`) on kätevä REPL-käytössä mutta heikentää tree-shakingia.

**Oppitunnit:** [`b12-js-modules-namespace-import`](/docs/topics/javascript#b12-js-modules-namespace-import)

### RF {#rf}

**Robot Framework** — Pythonilla toteutettu hyväksymistestaus- ja RPA-automaatiokehys. RF-avainsanoja laajennetaan Python-kirjastoilla; `.py`-tiedoston julkiset funktiot rekisteröityvät automaattisesti RF-avainsanoiksi.

**Oppitunnit:** [`rf-custom-python-keyword`](/docs/topics/robotframework#rf-custom-python-keyword), [`rf-library-import`](/docs/topics/robotframework#rf-library-import), [`rf-run-on-failure`](/docs/topics/robotframework#rf-run-on-failure), [`rf-tags-include-exclude`](/docs/topics/robotframework#rf-tags-include-exclude)

### RFC {#rfc}

**Request for Comments** — IETF:n julkaisema Internet-standardidokumentti. RFC 6762 määrittelee mDNS:n, RFC 6763 DNS-SD:n ja RFC 7519 JWT-tokenin rakenteen ja validointisäännöt.

**Oppitunnit:** [`avahi-mdns`](/docs/topics/linux#avahi-mdns), [`exp-linux-avahi-conflict`](/docs/topics/linux#exp-linux-avahi-conflict), [`prod-sec-jwt-claims`](/docs/topics/security#prod-sec-jwt-claims), [`b12-linux-tcp-udp-handshake`](/docs/topics/linux#b12-linux-tcp-udp-handshake)

### RHEL {#rhel}

**Red Hat Enterprise Linux** — Red Hatin kaupallinen Linux-jakelu, jota käytetään laajasti yrityspalvelimilla. RHEL aktivoi SELinuxin oletuksena; Docker bind mount voi epäonnistua `permission denied` -virheellä Unix-oikeuksista huolimatta — SELinux vaatii `:z`-suffiksin tai `chcon`-kutsun.

**Oppitunnit:** [`b08-docker-volume-bind-selinux`](/docs/topics/docker#b08-docker-volume-bind-selinux), [`b08-linux-network-firewalld`](/docs/topics/linux#b08-linux-network-firewalld), [`b09-linux-net-firewall-cmd`](/docs/topics/linux#b09-linux-net-firewall-cmd)

### RHI {#rhi}

**Rendering Hardware Interface** — Qt 6:n abstraktiokerros eri grafiikka-alustojen (OpenGL, Vulkan, Metal, D3D11) päälle. Shader-ohjelmat esikäännetään `qsb`-työkalulla `.qsb`-tiedostoiksi, jotka RHI lataa automaattisesti alustan mukaan.

**Oppitunnit:** [`b02-qt-shaders-qsb-13`](/docs/topics/qt#b02-qt-shaders-qsb-13), [`b03-qt-shaders-rhi-fallback`](/docs/topics/qt#b03-qt-shaders-rhi-fallback), [`b05-qt-shaders-glsl-version`](/docs/topics/qt#b05-qt-shaders-glsl-version), [`b05-qt-shaders-rhi-backend`](/docs/topics/qt#b05-qt-shaders-rhi-backend), [`b06-qt-shaders-precompile`](/docs/topics/qt#b06-qt-shaders-precompile), [`b07-qt-opengl-context`](/docs/topics/qt#b07-qt-opengl-context), [`b07-qt-shader-qsb`](/docs/topics/qt#b07-qt-shader-qsb), [`b07-qt-shader-uniform`](/docs/topics/qt#b07-qt-shader-uniform), [`b08-qt-shaders-uniform`](/docs/topics/qt#b08-qt-shaders-uniform), [`exp-qt-shaders-glsl-version`](/docs/topics/qt#exp-qt-shaders-glsl-version), [`exp-qt-shaders-rhi-backend`](/docs/topics/qt#exp-qt-shaders-rhi-backend), [`exp-qt-shaders-uniform-location`](/docs/topics/qt#exp-qt-shaders-uniform-location) (+1 muuta)

### RHI/GL {#rhi-gl}

**Rendering Hardware Interface / OpenGL** — Qt:n RHI on abstraktiokerros eri grafiikka-backendeille (OpenGL, Vulkan, Metal, Direct3D 11/12). GLSL-version ja profiilin (core / es) valinta tehdään RHI/GL-backendin mukaan; `#version`-direktiivi shaderissa täytyy vastata backendin odotuksia.

**Oppitunnit:** [`exp-qt-shaders-glsl-version`](/docs/topics/qt#exp-qt-shaders-glsl-version)

### RINEX {#rinex}

**Receiver Independent Exchange Format** — standardimuoto GNSS-havainto- ja navigointidatan vaihtoon jälkikäsittelyä varten (RTKLIB, Bernese ym.).

**Oppitunnit:** [`space-pos-rinex`](/docs/topics/space#space-pos-rinex)

### RLS {#rls}

**Row Level Security** — PostgreSQLin rivitason pääsynhallinta, joka suodattaa rivit automaattisesti käyttäjäroolin tai istuntomuuttujan perusteella. `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` ja `CREATE POLICY` määrittävät suodatussäännöt — vahva kerros multi-tenant-arkkitehtuurissa, mutta ei korvaa saraketason maskausta.

**Oppitunnit:** [`sqd-rls-policy`](/docs/topics/postgres#sqd-rls-policy), [`sqd-view-column-mask`](/docs/topics/postgres#sqd-view-column-mask)

### ROLE {#role}

PostgreSQL-rooli — voi olla käyttäjä tai ryhmä (`CREATE ROLE`, `CREATE USER`). `GRANT SELECT ON ALL TABLES IN SCHEMA public TO bi_reader` luo lukuroolin ilman kirjoitusoikeuksia; roolien avulla oikeushallinta skaalautuu ilman käyttäjäkohtaisia granteja.

**Oppitunnit:** [`sqd-readonly-role`](/docs/topics/postgres#sqd-readonly-role)

### ROLLUP {#rollup}

SQL `ROLLUP`-laajennus `GROUP BY`:lle, joka luo hierarkkiset välisummat automaattisesti. `GROUP BY ROLLUP(vuosi, kuukausi)` tuottaa rivit per kuukausi, per vuosi ja grand total yhdellä kyselyllä. `ROLLUP` on `GROUPING SETS`-syntaksin erikoistapaus.

**Oppitunnit:** [`sqd-grouping-sets`](/docs/topics/postgres#sqd-grouping-sets)

### RPA {#rpa}

**Robotic Process Automation** — ohjelmistorobottien automaatio toistuviin käyttöliittymäpohjaisiin tehtäviin. Robot Frameworkin `RPA.Browser`-kirjasto (Playwright-pohjainen) mahdollistaa selainautomaation testausskripteillä — ajaa testit oletuksena headful-tilassa, ei headless-only.

**Oppitunnit:** [`rf-browser-library`](/docs/topics/robotframework#rf-browser-library)

### RPC {#rpc}

**Remote Procedure Call** — mekanismi, jolla prosessi kutsuu toimintoa toisessa prosessissa tai koneessa kuin suoraa funktiokutsua. gRPC on modernein RPC-toteutus HTTP/2:lla ja Protocol Buffers -sarjallistamisella. Rust-projekteissa `tokio::sync::mpsc` sopii prosessinsisäiseen viestinvälitykseen RPC-tyylisesti.

**Oppitunnit:** [`b04-cpp-structured-bindings-map`](/docs/topics/cpp#b04-cpp-structured-bindings-map), [`rust-async-tokio-mpsc`](/docs/topics/rust#rust-async-tokio-mpsc)

### RSS {#rss}

**Resident Set Size** — prosessin tällä hetkellä fyysisessä muistissa oleva osa (ei swap). C++:ssa `vector::clear()` tyhjentää elementit mutta ei vapauta kapasiteettia — RSS pysyy korkeana pitkässä ajossa; `shrink_to_fit()` tai swap-idiomi (`vector<T>().swap(v)`) vapauttaa muistin.

**Oppitunnit:** [`b02-cpp-perf-shrink-10`](/docs/topics/cpp#b02-cpp-perf-shrink-10)

### RST {#rst}

TCP **Reset** -lippu (RST) katkaisee yhteyden välittömästi ilman normaalia sulkemiskättelyä. `tcpdump 'tcp[tcpflags] & tcp-rst != 0'` suodattaa RST-paketit; palomuuri tai IDS voi lähettää RST:n estäessään yhteyden.

**Oppitunnit:** [`b07-linux-network-tcpdump`](/docs/topics/linux#b07-linux-network-tcpdump), [`b12-linux-tcp-syn-backlog`](/docs/topics/linux#b12-linux-tcp-syn-backlog)

### RST/FIN {#rst-fin}

TCP-yhteyden katkaisusignaalit: `FIN` sulkee yhteyden siististi neljällä paketilla (four-way handshake), `RST` katkaisee yhteyden välittömästi ilman siivoustoimia. `tcpdump`-kaappaus paljastaa kumpi signaali laukaisi katkoksen, mikä helpottaa sovellus- tai palomuuriongelman diagnosointia.

**Oppitunnit:** [`b07-linux-network-tcpdump`](/docs/topics/linux#b07-linux-network-tcpdump)

### RTCM {#rtcm}

**Radio Technical Commission for Maritime Services** — binääriviestiperhe differentiaalisiin/RTK-korjauksiin. Moderni RTK käyttää RTCM 3.x MSM-viestejä; NTRIP kuljettaa niitä internetissä.

**Oppitunnit:** [`space-app-rtcm`](/docs/topics/space#space-app-rtcm), [`space-pos-rtk`](/docs/topics/space#space-pos-rtk)

### RTK {#rtk}

**Real-Time Kinematic** — kantoaaltovaiheeseen perustuva differentiaalinen GNSS-paikannus tukiasemaan nähden. Integer ambiguity -ratkaisun (FIXED) jälkeen tyypillisesti senttitaso lyhyillä baselineilla.

**Oppitunnit:** [`space-pos-rtk`](/docs/topics/space#space-pos-rtk), [`space-pos-ambiguity`](/docs/topics/space#space-pos-ambiguity)

### RTT {#rtt}

**Round-Trip Time** — paketin edestakaiseen matkaan kuluva aika verkossa. `ss -ti` paljastaa socket-tason RTT:n, retransmit-laskurit ja `cwnd`-arvon suoraan kerneliltä. Korkea RTT tai kasvava retransmit-laskuri viittaa verkon ylikuormitukseen tai pakettihäviöön.

**Oppitunnit:** [`b12-linux-tcp-retransmit-info`](/docs/topics/linux#b12-linux-tcp-retransmit-info)

### RUSTFLAGS {#rustflags}

Rust-kääntäjälle välitettävä ympäristömuuttuja lisäflaagien asettamiseen. `RUSTFLAGS="-C target-cpu=native"` optimoi nykyiselle arkkitehtuurille; CI:ssä flaagit kannattaa asettaa `.cargo/config.toml`-tiedostossa eikä ympäristömuuttujalla, jotta ne ovat toistettavissa.

**Oppitunnit:** [`rust-tooling-release-profile`](/docs/topics/rust#rust-tooling-release-profile)

### RVO {#rvo}

**Return Value Optimization** — C++-kääntäjän optimointi, joka rakentaa paluuarvon suoraan kutsujan muistipaikassa kopion välttämiseksi. C++17 teki NRVO:n (Named RVO) pakolliseksi monissa tilanteissa; `std::move` paluulausekkeessa estää RVO:n eikä ole suositeltavaa.

**Oppitunnit:** [`b02-cpp-correct-dangling-15`](/docs/topics/cpp#b02-cpp-correct-dangling-15), [`b02-cpp-perf-move-09`](/docs/topics/cpp#b02-cpp-perf-move-09), [`b03-cpp-cr-move-semantics`](/docs/topics/cpp#b03-cpp-cr-move-semantics), [`b05-cpp-rvo-return-local`](/docs/topics/cpp#b05-cpp-rvo-return-local), [`perf-move`](/docs/topics/cpp#perf-move), [`perf-rvo`](/docs/topics/cpp#perf-rvo)

### RVO/NRVO {#rvo-nrvo}

**Return Value Optimization / Named Return Value Optimization** — C++11/17-standardin mahdollistama kääntäjäoptimointi, joka eliminoi välikopiointeja palautusarvoista. C++17 takaa RVO (copy elision) useimmissa tilanteissa; `std::move` paikalliseen palautukseen voi estää optimoinnin.

**Oppitunnit:** [`b05-cpp-rvo-return-local`](/docs/topics/cpp#b05-cpp-rvo-return-local), [`perf-rvo`](/docs/topics/cpp#perf-rvo), [`b03-cpp-cr-move-semantics`](/docs/topics/cpp#b03-cpp-cr-move-semantics)

### S/M/L {#s-m-l}

T-shirt sizing -estimointikokojen lyhenteet (Small / Medium / Large) Scrum-refinementissa. Karkea suhteellinen arvio, jolla tiimi tunnistaa nopeasti suuruusluokan ennen tarkempaa story point -arviointia. XL tai XXL -arvio voi merkitä tarpeen hajottaa tarina pienemmiksi.

**Oppitunnit:** [`b09-scrum-tshirt-sizing`](/docs/topics/scrum#b09-scrum-tshirt-sizing)

### S3/API {#s3-api}

Amazon S3 -yhteensopiva objektivarasto-API. S3-protokolla on de facto standardi pilvivarastoinnissa (AWS S3, MinIO, Backblaze B2, Ceph RGW). `--network none` -kontti ei pysty kutsumaan S3-API:a — batch-tehtävälle tarvitaan vähintään rajoitettu ulkoverkkoyhteys tai esiladattu data.

**Oppitunnit:** [`b06-docker-network-mode-none`](/docs/topics/docker#b06-docker-network-mode-none)

### SAST {#sast}

**Static Application Security Testing** — staattinen tietoturva-analyysi lähdekoodille ilman suoritusta. CI-putkeen integroitu SAST-skanneri (esim. SonarQube, Semgrep) löytää injektiohaavoittuvuudet ja insecure API -käytöt automaattisesti. SAST täydentää dependency-skannausta ja dynaamista DAST-testausta.

**Oppitunnit:** [`exp-scrum-dod-security-review`](/docs/topics/scrum#exp-scrum-dod-security-review)

### SBAS {#sbas}

**Satellite-Based Augmentation System** — täydennysjärjestelmä, jossa GEO-satelliitit lähettävät korjaus- ja eheysviestejä (esim. EGNOS Euroopassa, WAAS USA:ssa). Parantaa SPP-tarkkuutta ja turvallisuuskriittistä saatavuutta.

**Oppitunnit:** [`space-gnss-sbas-egnos`](/docs/topics/space#space-gnss-sbas-egnos)

### SBOM {#sbom}

**Software Bill of Materials** — ohjelmiston komponenttiluettelo (riippuvuudet, versiot, lisenssit). CI-putki voi generoida SBOMin (`syft`, `cyclonedx`) ja tarkistaa tunnetut haavoittuvuudet (CVE) automaattisesti — base-imagen digest kannattaa pinnata ja skannata joka buildissa.

**Oppitunnit:** [`b08-docker-scan-image`](/docs/topics/docker#b08-docker-scan-image)

### SCHEMA {#schema}

Tietokantaskeema — nimiavaruus, johon taulut, näkymät, funktiot ja sekvenssit kuuluvat. PostgreSQLissä oletusskeema on `public`; `GRANT SELECT ON ALL TABLES IN SCHEMA public TO rooli` antaa lukuoikeuden koko skeeman tauluihin kerralla.

**Oppitunnit:** [`sqd-least-privilege-grant`](/docs/topics/postgres#sqd-least-privilege-grant)

### SCSS {#scss}

**Sassy CSS** — CSS:n esikäsittelykieli, joka lisää muuttujat, sisäkkäisyyden ja mixinit. Vite tukee `.scss`-tiedostoja suoraan; CSS- ja SCSS-tiedostot merkitään `import`-sivuvaikutuksiksi tree-shakingia varten (`import './styles.scss'`).

**Oppitunnit:** [`b12-js-modules-assert-type-css`](/docs/topics/javascript#b12-js-modules-assert-type-css)

### SD {#sd}

**Service Discovery** — DNS-SD:ssä (DNS-based Service Discovery, RFC 6763) palvelut ilmoitetaan ja löydetään `_service._proto.local`-nimien avulla. Avahi toteuttaa DNS-SD:n lähiverkossa; `avahi-browse -a` listaa kaikki julkaistut palvelut.

**Oppitunnit:** [`avahi-mdns`](/docs/topics/linux#avahi-mdns), [`b06-linux-avahi-service-type`](/docs/topics/linux#b06-linux-avahi-service-type), [`b07-docker-network-host`](/docs/topics/docker#b07-docker-network-host), [`b08-linux-avahi-resolve`](/docs/topics/linux#b08-linux-avahi-resolve), [`b09-linux-avahi-service-discovery`](/docs/topics/linux#b09-linux-avahi-service-discovery), [`exp-linux-avahi-printer-discovery`](/docs/topics/linux#exp-linux-avahi-printer-discovery), [`exp-linux-avahi-service-xml`](/docs/topics/linux#exp-linux-avahi-service-xml), [`b03-linux-avahi-publish-service`](/docs/topics/linux#b03-linux-avahi-publish-service)

### SDK {#sdk}

**Software Development Kit** — ohjelmistokehityspaketti, joka sisältää kirjastot, headerit, esimerkit ja työkalut tietyn alustan tai API:n käyttöön. Järjestelmän tai laitteiston SDK toimittaa `<>`-muotoiset headerit, joita `#include`-direktiivit kutsuvat projektin omien `""`-headereiden sijaan.

**Oppitunnit:** [`b02-js-modules-dynamic-08`](/docs/topics/javascript#b02-js-modules-dynamic-08), [`b11-cpp-local-include-quotes`](/docs/topics/cpp#b11-cpp-local-include-quotes)

### SECRET {#secret}

CI/CD-ympäristön salainen muuttuja — API-avain, salasana tai token, jota ei saa tallentaa versionhallintaan. Salaisuudet syötetään erilliseen hallintapalveluun (GitHub Secrets, AWS SSM, HashiCorp Vault) ja välitetään palvelulle `EnvironmentFile`-direktiivillä tai injektoidaan ajon aikana.

**Oppitunnit:** [`b03-linux-systemd-env-file`](/docs/topics/linux#b03-linux-systemd-env-file)

### SECURITY {#security}

Tässä kontekstissa **Row Level Security (RLS)** — PostgreSQL-ominaisuus, jolla pääsy riveihin rajoitetaan käyttäjä- tai roolikohtaisesti. `ALTER TABLE t ENABLE ROW LEVEL SECURITY` + `CREATE POLICY` mahdollistaa automaattisen `team_id = current_setting('app.team_id')` -ehdon ilman sovellustason suodatusta.

**Oppitunnit:** [`sqd-rls-policy`](/docs/topics/postgres#sqd-rls-policy)

### SELF {#self}

**SELF JOIN** — taulun liittäminen itseensä SQL:ssä. Käytetään hierarkkisten rakenteiden (esim. organisaatiopuu, manager–employee) tai rivien keskinäiseen vertailuun; vaatii taulualiakset (`e1`, `e2`) yksiselitteisyyden vuoksi. Ehdollinen aggregointi (`FILTER`/`CASE`) on usein tehokkaampi vaihtoehto.

**Oppitunnit:** [`sqd-pivot-conditional-agg`](/docs/topics/postgres#sqd-pivot-conditional-agg)

### SERIALIZABLE {#serializable}

**SERIALIZABLE** — korkein SQL-eristystaso, joka estää kaikki anomaliat (dirty read, non-repeatable read, phantom read). PostgreSQL toteuttaa sen SSI:llä (Serializable Snapshot Isolation) eikä lukoilla, joten se skaalautuu paremmin kuin perinteinen lukituspohjainen toteutus — abort-riski kasvaa korkean kuorman alla.

**Oppitunnit:** [`b03-pg-explain-isolation-level`](/docs/topics/postgres#b03-pg-explain-isolation-level)

### SF {#sf}

C++ Core Guidelines -oppaan **SF (Source Files)** -osio, joka kattaa header-tiedostojen ja käännösyksiköiden organisoinnin. SF.7 kieltää `using namespace` -direktiivin headereissa, koska se vuotaa kaikkiin includereihin ja voi estää ADL:n toimimisen oikein.

**Oppitunnit:** [`b11-cpp-forward-declare-header`](/docs/topics/cpp#b11-cpp-forward-declare-header), [`b11-cpp-iwyu-cleanup`](/docs/topics/cpp#b11-cpp-iwyu-cleanup), [`b11-cpp-using-namespace-header`](/docs/topics/cpp#b11-cpp-using-namespace-header)

### SFINAE {#sfinae}

**Substitution Failure Is Not An Error** — C++:n template-mekanismi, jossa epäonnistunut tyypinkorvaus ei johda käännösvirheeseen vaan kyseisen overloadin hylkäämiseen. C++20 concepts korvaa useimmat SFINAE-kuviot selkeämmällä `requires`-syntaksilla; `if constexpr` korvaa SFINAE:n monissa haarakonteksteissa.

**Oppitunnit:** [`b02-cpp-tools-concepts-02`](/docs/topics/cpp#b02-cpp-tools-concepts-02), [`b03-cpp-tools-if-constexpr`](/docs/topics/cpp#b03-cpp-tools-if-constexpr)

### SHA {#sha}

**Secure Hash Algorithm** — NIST:n standardoima kryptografinen tiivistefunktio. SHA-256 tuottaa 256-bittisen tiivisteen; git käyttää SHA-1/SHA-256 commit-tunnisteinaan. Salasanojen tallennukseen SHA-256 ei yksin riitä — käytä bcrypt tai argon2 suolauksen ja hidastuksen takia.

**Oppitunnit:** [`git-cherry-pick-conflict`](/docs/topics/git#git-cherry-pick-conflict), [`prod-sec-password-hash`](/docs/topics/security#prod-sec-password-hash)

### SHM {#shm}

**Shared Memory** — jaettu muistialue prosessien väliseen viestintään. Linuxissa `/dev/shm` on tmpfs-muistissa oleva hakemisto; Docker-kontilla on oletuksena 64 Mt `/dev/shm`-alue, joka voi olla liian pieni joillekin sovelluksille. `--shm-size`-parametrilla kasvatetaan kokoa tarpeen mukaan.

**Oppitunnit:** [`docker-compose-network`](/docs/topics/docker#docker-compose-network)

### SIEM {#siem}

**Security Information and Event Management** — tietoturvan seuranta- ja lokienhallintajärjestelmä. `journalctl -o json` tai `journalctl -o json-pretty` tuottaa strukturoidun JSON-muodon, jonka SIEM-parseri voi käsitellä kentittäin (timestamp, priority, MESSAGE).

**Oppitunnit:** [`b03-linux-journalctl-json-export`](/docs/topics/linux#b03-linux-journalctl-json-export), [`b03-linux-systemd-restart-burst`](/docs/topics/linux#b03-linux-systemd-restart-burst)

### SIGABRT {#sigabrt}

Unix-signaali numero 6 (abort). Prosessi lähettää `SIGABRT` itselleen kutsumalla `abort()`, usein kun runtime havaitsee vakavan virheen (heap-korruptio, epäonnistunut `assert`). systemd `Restart=on-failure` käynnistää prosessin uudelleen, mutta muistibugi kannattaa korjata juurisyynä.

**Oppitunnit:** [`b07-linux-systemd-restart-policy`](/docs/topics/linux#b07-linux-systemd-restart-policy)

### SIGKILL {#sigkill}

Unix-signaali numero 9 — pakottaa prosessin välittömään lopettamiseen ilman siivousta; ei voi torjua (`SIGKILL` ei voi olla catch-handlerin kohde). systemd `KillMode=control-group` lähettää SIGKILLin kaikkiin cgroup-prosesseihin, mikä varmistaa lapsi­prosessien siivoutumisen `stop`-komennon yhteydessä.

**Oppitunnit:** [`b09-linux-systemd-kill-mode`](/docs/topics/linux#b09-linux-systemd-kill-mode)

### SIGNAL/SLOT {#signal-slot}

Qt:n signaali-slot-järjestelmä — tyyppisuojattu callback-mekanismi objektien väliseen viestintään. Vanha `SIGNAL`/`SLOT`-makrosyntaksi on merkkijonopohjainen eikä tarkista tyyppejä käännösaikana; moderni osoitinsyntaksi (`&QPushButton::clicked`) on tyyppiturvallisempi. Lambdan disconnect vaatii `QMetaObject::Connection`-kahvan tallentamisen.

**Oppitunnit:** [`b05-qt-signals-disconnect-lambda`](/docs/topics/qt#b05-qt-signals-disconnect-lambda)

### SIGSEGV {#sigsegv}

Unix-signaali numero 11 (segmentation violation) — prosessi yrittää lukea tai kirjoittaa virheelliseen muistiosoitteeseen (NULL-dereffaus, pinon ylitys, vapautettu muisti). systemd `Restart=always` käynnistää prosessin uudelleen, mutta muistibugi tulee korjata; AddressSanitizer auttaa paikantamaan juurisyyn.

**Oppitunnit:** [`systemd-restart-policy`](/docs/topics/linux#systemd-restart-policy)

### SIGTERM {#sigterm}

Unix-signaali 15, joka pyytää prosessia lopettamaan siististi (graceful shutdown). Dockerin `docker stop` lähettää ensin SIGTERMin ja odottaa `--stop-timeout` (oletus 10 s) ennen SIGKILLiä. Palvelun pitää käsitellä SIGTERM kaappaamalla se pääprosessissa; entrypoint-skripteissä käytetään `exec`-muotoa viimeisessä komennossa.

**Oppitunnit:** [`b09-linux-systemd-kill-mode`](/docs/topics/linux#b09-linux-systemd-kill-mode), [`docker-exit-code`](/docs/topics/docker#docker-exit-code)

### SLA {#sla}

**Service Level Agreement** — palvelutasosopimus, joka määrittelee tavoitevasteajan, saatavuusprosentin tai muun palvelulupauksen. Arkkitehtuurivalinnat (varmuuskopiointi, timeout-strategia, retry-logiikka, abort-käsittely) johdetaan suoraan SLA-vaatimuksesta.

**Oppitunnit:** [`b02-docker-vol-backup-14`](/docs/topics/docker#b02-docker-vol-backup-14), [`b04-js-async-race-fetch`](/docs/topics/javascript#b04-js-async-race-fetch), [`b04-scrum-poker-consensus`](/docs/topics/scrum#b04-scrum-poker-consensus), [`b04-scrum-velocity-not-commitment`](/docs/topics/scrum#b04-scrum-velocity-not-commitment), [`b08-js-async-race-timeout`](/docs/topics/javascript#b08-js-async-race-timeout), [`exp-scrum-team-sm-impediment`](/docs/topics/scrum#exp-scrum-team-sm-impediment)

### SMTP {#smtp}

**Simple Mail Transfer Protocol** — sähköpostin lähetysprotokolla (portit 25, 587, 465). SMTP ei liity verkon laitteiden löytämiseen; tulostimien automaattinen löytö tapahtuu mDNS/Bonjour (Avahi) -protokollalla — SMTP-maininta tässä yhteydessä on harhautusvastausvaihtoehto.

**Oppitunnit:** [`exp-linux-avahi-printer-discovery`](/docs/topics/linux#exp-linux-avahi-printer-discovery)

### SNI {#sni}

**Server Name Indication** — TLS-laajennus, jossa asiakas ilmoittaa kohdedomain-nimen kättelyssä ennen sertifikaatin lähetystä. Mahdollistaa usean TLS-domainin isännöinnin samassa IP-osoitteessa; `curl -v` tai `openssl s_client -servername` paljastaa SNI-neuvottelu­ongelmat.

**Oppitunnit:** [`b07-linux-network-curl-debug`](/docs/topics/linux#b07-linux-network-curl-debug)

### SNMP {#snmp}

**Simple Network Management Protocol** — verkkolaitteiden hallintaprotokolla (UDP/161). SNMP-poller tunnistaa laitteet MAC-osoitteiden perusteella; macvlan-verkko antaa konteille oman MAC-osoitteen, jolloin legacy-laitteiden SNMP-valvonta toimii ilman erikoisjärjestelyjä.

**Oppitunnit:** [`b06-docker-network-ipvlan`](/docs/topics/docker#b06-docker-network-ipvlan), [`docker-macvlan`](/docs/topics/docker#docker-macvlan)

### SOPS {#sops}

**Secrets OPerationS** — Mozilla SOPS on salaustyökalu salaisten arvojen tallentamiseen versionhallintaan. SOPS salaa YAML/JSON-tiedostojen arvot (ei avaimia) AWS KMS:llä, GCP KMS:llä tai age-avaimella. `sops -d secrets.yaml` purkaa salauksen deploymentissa; `.sops.yaml` konfiguroi salauskäytännöt.

**Oppitunnit:** [`b02-linux-systemd-env-04`](/docs/topics/linux#b02-linux-systemd-env-04), [`b03-docker-secrets-compose`](/docs/topics/docker#b03-docker-secrets-compose)

### SP {#sp}

**Story Points** — Scrumin suhteellinen arviointiyksikkö, joka kuvaa työn kokoa kompleksisuuden ja epävarmuuden perusteella. SP-arvioita ei tule muuntaa tunneiksi; velocity (SP/sprintti) kertoo tiimin kapasiteetin ennustamiseen. SP-GiST on myös PostgreSQL-hakemistotyyppi geometrisille operaattoreille.

**Oppitunnit:** [`b06-scrum-estimation-relative`](/docs/topics/scrum#b06-scrum-estimation-relative), [`b08-pg-indexes-btree-gist`](/docs/topics/postgres#b08-pg-indexes-btree-gist), [`b08-scrum-velocity-trend`](/docs/topics/scrum#b08-scrum-velocity-trend), [`exp-scrum-estimation-no-hours`](/docs/topics/scrum#exp-scrum-estimation-no-hours)

### SPIR {#spir}

**Standard Portable Intermediate Representation** — Khronos-konsortion määrittämä varjostinten välimuoto Vulkan-API:lle (SPIR-V). Qt 6:n `qsb`-työkalu kääntää GLSL-lähdekoodin SPIR-V-muotoon Vulkan-backendille. SPIR-V mahdollistaa varjostinoptimointeja ajoaikana GPU-ajurissa.

**Oppitunnit:** [`b07-qt-shader-qsb`](/docs/topics/qt#b07-qt-shader-qsb), [`exp-qt-shaders-glsl-version`](/docs/topics/qt#exp-qt-shaders-glsl-version)

### SQL {#sql}

**Structured Query Language** — ISO-standardoitu kyselykieli relaatiotietokannoille. PostgreSQLissä kyselysuorituksia analysoidaan `EXPLAIN (ANALYZE, BUFFERS)` -komennolla; indeksit ja tilastot vaikuttavat planner-valintoihin.

**Oppitunnit:** [`b02-pg-explain-nested-07`](/docs/topics/postgres#b02-pg-explain-nested-07), [`b02-qt-models-sort-09`](/docs/topics/qt#b02-qt-models-sort-09), [`b03-pg-config-random-page-cost`](/docs/topics/postgres#b03-pg-config-random-page-cost), [`b03-pg-config-ssl-mode`](/docs/topics/postgres#b03-pg-config-ssl-mode), [`b03-pg-config-statements-ext`](/docs/topics/postgres#b03-pg-config-statements-ext), [`b07-docker-volume-backup`](/docs/topics/docker#b07-docker-volume-backup), [`b07-pg-config-log-slow`](/docs/topics/postgres#b07-pg-config-log-slow), [`b07-pg-explain-prepare`](/docs/topics/postgres#b07-pg-explain-prepare), [`b08-qt-signals-blocking`](/docs/topics/qt#b08-qt-signals-blocking), [`b09-qt-signals-block-updates`](/docs/topics/qt#b09-qt-signals-block-updates), [`exp-scrum-dod-security-review`](/docs/topics/scrum#exp-scrum-dod-security-review), [`prod-backend-transfer-transaction`](/docs/topics/backend#prod-backend-transfer-transaction) (+29 muuta)

### SRE {#sre}

**Site Reliability Engineering** — Googlen kehittämä käytännön lähestymistapa tuotantojärjestelmien luotettavuuden hallintaan, jossa software engineering -käytäntöjä sovelletaan ops-ongelmiin. SRE-tiimi ylläpitää SLO:ita (Service Level Objectives) ja virhebudjetteja; observability (metrics, traces, logs) on SRE-työn perusta.

**Oppitunnit:** [`prod-ops-observability`](/docs/topics/backend#prod-ops-observability)

### SSDP {#ssdp}

**Simple Service Discovery Protocol** — UPnP-protokollaperheen löytöprotokolla, joka käyttää UDP-multicastia (239.255.255.250:1900). Docker bridge-verkko ei reitittä multicastia oletuksena; `--network host` tai macvlan tarvitaan SSDP-liikenteelle.

**Oppitunnit:** [`b08-docker-network-host`](/docs/topics/docker#b08-docker-network-host)

### SSE {#sse}

**Server-Sent Events** — W3C-standardi yksisuuntaiselle palvelin→selain-streamille HTTP:n yli (`text/event-stream`). Selain käyttää `EventSource`-API:a; `for await...of` (async-iteraattori) sopii SSE-virtojen käsittelyyn Node.js-puolella tai Fetch ReadableStream -rajapinnan kanssa.

**Oppitunnit:** [`b12-js-async-iterator-for-await`](/docs/topics/javascript#b12-js-async-iterator-for-await)

### SSH {#ssh}

**Secure Shell** — salattu etäyhteysprotokolla palvelimen hallintaan (RFC 4251). `ssh user@hostname.local` toimii Avahi-mDNS-nimillä lähiverkossa; avainpohjainen tunnistautuminen on turvallisempi kuin salasana.

**Oppitunnit:** [`b02-linux-avahi-conflict-13`](/docs/topics/linux#b02-linux-avahi-conflict-13), [`b02-linux-journalctl-unit-06`](/docs/topics/linux#b02-linux-journalctl-unit-06), [`b03-linux-systemd-analyze-blame`](/docs/topics/linux#b03-linux-systemd-analyze-blame), [`b04-linux-network-ip-addr`](/docs/topics/linux#b04-linux-network-ip-addr), [`b06-linux-systemd-logind`](/docs/topics/linux#b06-linux-systemd-logind), [`b08-linux-network-nmcli`](/docs/topics/linux#b08-linux-network-nmcli), [`b08-linux-systemd-logind`](/docs/topics/linux#b08-linux-systemd-logind), [`b12-linux-tcp-udp-handshake`](/docs/topics/linux#b12-linux-tcp-udp-handshake), [`exp-linux-avahi-conflict`](/docs/topics/linux#exp-linux-avahi-conflict), [`ci-artifact-retention`](/docs/topics/git#ci-artifact-retention), [`b02-linux-avahi-publish-14`](/docs/topics/linux#b02-linux-avahi-publish-14), [`b03-pg-config-ssl-mode`](/docs/topics/postgres#b03-pg-config-ssl-mode)

### SSID {#ssid}

**Service Set Identifier** — WiFi-verkon nimi, jonka tukiasema lähettää mainoslähetyksessään. `nmcli connection show` listaa tallennettuja profiileja SSID:neen; `nmcli con up 'ProfiiliNimi'` yhdistää tallennettuun verkkoon automaatioskripeissä.

**Oppitunnit:** [`b02-linux-network-nmcli-11`](/docs/topics/linux#b02-linux-network-nmcli-11), [`b05-linux-network-nmcli-connect`](/docs/topics/linux#b05-linux-network-nmcli-connect), [`linux-nmcli`](/docs/topics/linux#linux-nmcli)

### SSL/TLS {#ssl-tls}

**Secure Sockets Layer / Transport Layer Security** — salattu verkkoprotokolla. SSL on vanhentunut versio; käytännössä kaikki nykyiset toteutukset käyttävät TLS 1.2 tai 1.3. PostgreSQL `sslmode=require` pakottaa salatun yhteyden asiakasohjelmasta palvelimeen.

**Oppitunnit:** [`b03-pg-config-ssl-mode`](/docs/topics/postgres#b03-pg-config-ssl-mode)

### SSM {#ssm}

**AWS Systems Manager Parameter Store** — AWS:n hallittu palvelu konfiguraatioarvojen ja salaisuuksien säilytykseen. systemd-palveluissa salaisuudet haetaan käynnistyksen yhteydessä SSM:stä tai HashiCorp Vaultista `EnvironmentFile`-skriptillä — ei koskaan kovakoodattuna yksikkötiedostoon.

**Oppitunnit:** [`b03-linux-systemd-env-file`](/docs/topics/linux#b03-linux-systemd-env-file)

### STL {#stl}

**Standard Template Library** — C++:n standardikirjasto, joka sisältää kontainerit (`vector`, `map`, `string`), algoritmit (`std::sort`, `std::find_if`) ja iteraattorit. STL-tyypit eivät sovi DLL-rajapinnoiksi eri kääntäjäversioiden välillä ABI-yhteensopimattomuuden takia.

**Oppitunnit:** [`b10-cpp-portability-abi-01`](/docs/topics/cpp#b10-cpp-portability-abi-01)

### SUBSTRING {#substring}

PostgreSQL- ja SQL-merkkijonofunktio: `SUBSTRING(str FROM pos FOR len)` tai `SUBSTRING(str, pos, len)`. Käytetään esim. kuukausikentän poimimiseen päivämäärämerkkijonosta; `SUBSTRING`-kutsu `WHERE`-ehdossa ilman indeksointia voi olla hidas — harkitse `generated column` tai erillinen sarake.

**Oppitunnit:** [`sqd-lag-mom-comparison`](/docs/topics/postgres#sqd-lag-mom-comparison)

### SUID {#suid}

**Set User ID** — Linux-tiedosto-oikeusbit, jolla ohjelma suoritetaan tiedoston omistajan (usein root) oikeuksilla suorittajasta riippumatta. Docker `--cap-drop=ALL` ja `no-new-privileges`-lippu estävät SUID-privilege escalationin; tuotantokonteissa SUID-bitit kannattaa poistaa kaikilta binääreiltä.

**Oppitunnit:** [`b05-docker-security-cap-drop`](/docs/topics/docker#b05-docker-security-cap-drop)

### SUPERUSER {#superuser}

PostgreSQL:n korkein käyttöoikeustaso — `SUPERUSER` ohittaa kaikki käyttöoikeustarkistukset. Sovellukselle ei pidä antaa SUPERUSER-oikeuksia; käytetään vain tietokantaadmin-tehtäviin. Least privilege -periaatteen mukaan sovelluskäyttäjälle myönnetään vain tarvitut `GRANT SELECT/INSERT/UPDATE/DELETE` -oikeudet.

**Oppitunnit:** [`sqd-least-privilege-grant`](/docs/topics/postgres#sqd-least-privilege-grant), [`sqd-readonly-role`](/docs/topics/postgres#sqd-readonly-role)

### SWR {#swr}

**Stale-While-Revalidate** — HTTP-välimuississtrategia, joka palauttaa vanhan välimuistidatan välittömästi ja hakee päivityksen taustalla. React-kirjasto `swr` (Vercel) ja `react-query` toteuttavat saman periaatteen API-hauille; debounce yksinään ei riitä kilpa­tilanteisiin — tarvitaan abort-controller tai pyyntönumerointi.

**Oppitunnit:** [`b07-js-async-debounce`](/docs/topics/javascript#b07-js-async-debounce)

### SYN {#syn}

TCP **Synchronize** -lippu (SYN) aloittaa kolmivaiheisen kättelyn (SYN → SYN-ACK → ACK). Jos `tcpdump` näyttää lähtevät SYN-paketit mutta ei SYN-ACK-vastausta, palomuuri todennäköisesti pudottaa paketit.

**Oppitunnit:** [`b03-linux-network-tcpdump-filter`](/docs/topics/linux#b03-linux-network-tcpdump-filter), [`b12-linux-tcp-syn-backlog`](/docs/topics/linux#b12-linux-tcp-syn-backlog), [`b12-linux-tcp-udp-handshake`](/docs/topics/linux#b12-linux-tcp-udp-handshake), [`b12-linux-udp-stateless-firewall`](/docs/topics/linux#b12-linux-udp-stateless-firewall)

### TBB {#tbb}

**Intel Threading Building Blocks** — C++:n rinnakkaistamiskirjasto, joka tarjoaa thread pool -toteutuksen, rinnakkaiset algoritmit ja task-pohjaisen ajoituksen. Moderni vaihtoehto manuaaliselle `std::thread`-hallinnalle; CppCoreGuidelines suosii TBB:tä tai `std::execution::par`-algoritmeja suoraan säiehallintaan.

**Oppitunnit:** [`b11-cpp-std-thread-port`](/docs/topics/cpp#b11-cpp-std-thread-port)

### TCO {#tco}

**Tail Call Optimization** — kääntäjän tai ajoympäristön optimointi, joka muuntaa häntiäkutsun silmukaksi pinokasvun estämiseksi. ES6-standardi lupasi TCO:n, mutta käytännössä vain Safari/JavaScriptCore toteutti sen ja sekin poistettiin — syvään rekursioon käytä iteratiivista toteutusta.

**Oppitunnit:** [`b12-js-runtime-tail-call`](/docs/topics/javascript#b12-js-runtime-tail-call)

### TCP {#tcp}

**Transmission Control Protocol** — yhteyssuuntautunut verkkoprotokolla, joka takaa pakettijärjestyksen ja uudelleenlähetyksen. `tcpdump` suodattaa TCP-paketteja lippujen (SYN, RST, ACK) mukaan; `ss -t` näyttää yhteyksien tilan (ESTABLISHED, TIME_WAIT jne.).

**Oppitunnit:** [`b02-docker-net-host-08`](/docs/topics/docker#b02-docker-net-host-08), [`b03-linux-network-ss-timers`](/docs/topics/linux#b03-linux-network-ss-timers), [`b03-linux-network-tcpdump-filter`](/docs/topics/linux#b03-linux-network-tcpdump-filter), [`b04-linux-ss-tuln`](/docs/topics/linux#b04-linux-ss-tuln), [`b05-linux-network-ss-listen`](/docs/topics/linux#b05-linux-network-ss-listen), [`b06-linux-network-ethtool-offload`](/docs/topics/linux#b06-linux-network-ethtool-offload), [`b06-linux-network-ss-udp`](/docs/topics/linux#b06-linux-network-ss-udp), [`b07-linux-network-curl-debug`](/docs/topics/linux#b07-linux-network-curl-debug), [`b07-linux-network-tcpdump`](/docs/topics/linux#b07-linux-network-tcpdump), [`b09-linux-journald-forward-syslog`](/docs/topics/linux#b09-linux-journald-forward-syslog), [`b12-linux-arp-failed-state`](/docs/topics/linux#b12-linux-arp-failed-state), [`b12-linux-tcp-close-wait-leak`](/docs/topics/linux#b12-linux-tcp-close-wait-leak) (+12 muuta)

### TDZ {#tdz}

**Temporal Dead Zone** — JavaScript-mekanismi, jossa `let`/`const`-muuttuja on olemassa leksikaalisen näkyvyysalueen alusta, mutta käyttö ennen alustusta heittää `ReferenceError`in. ESM-syklisessä importissa binding voi jäädä TDZ:hen, jos moduuli evaluoidaan ennen kuin sen eksportti on alustettu.

**Oppitunnit:** [`b08-js-modules-circular`](/docs/topics/javascript#b08-js-modules-circular), [`exp-js-modules-cycle`](/docs/topics/javascript#exp-js-modules-cycle), [`b02-js-modules-cycle-09`](/docs/topics/javascript#b02-js-modules-cycle-09), [`b07-js-modules-cycle`](/docs/topics/javascript#b07-js-modules-cycle)

### TLA {#tla}

**Top-Level Await** — ESM-moduulien ominaisuus, joka sallii `await`-avainsanan moduulitasolla ilman `async`-funktiota. TLA blokkaa kaikki riippuvaiset importit latauksen ajaksi — sopii CLI-työkaluihin, mutta voi hidastaa web-sovelluksen LCP-metriikkaa.

**Oppitunnit:** [`b02-js-modules-tla-10`](/docs/topics/javascript#b02-js-modules-tla-10), [`b05-js-modules-top-level-await`](/docs/topics/javascript#b05-js-modules-top-level-await), [`b12-js-async-await-top-level`](/docs/topics/javascript#b12-js-async-await-top-level), [`exp-js-modules-top-level-await`](/docs/topics/javascript#exp-js-modules-top-level-await)

### TODO {#todo}

Koodikommentti `// TODO:` tai `# TODO:`, jolla merkitään kesken jäänyt tai parannettava kohta. Toistuvat TODO-kommentit koodikatselmoinneissa ovat merkki teknisestä velasta; DoD voi vaatia TODO:jen kirjaamista backlogiin ennen storyn hyväksymistä.

**Oppitunnit:** [`scrum-dod-tech-debt`](/docs/topics/scrum#scrum-dod-tech-debt)

### TRUNCATE {#truncate}

SQL-komento, joka poistaa kaikki rivit taulusta nopeasti ilman rivitason lokitusta. `TRUNCATE t` on huomattavasti nopeampi kuin `DELETE FROM t` suurilla tauluilla; PostgreSQL tukee `TRUNCATE ... CASCADE`-optiota viiteavainrelaatioiden kanssa. Ei sama kuin `DELETE` — ei tue `WHERE`-ehtoa.

**Oppitunnit:** [`b06-pg-vacuum-skip-locked`](/docs/topics/postgres#b06-pg-vacuum-skip-locked)

### TS {#ts}

**TypeScript** — Microsoftin kehittämä JavaScriptin tyypitetty ylijoukko. `tsc`-kääntäjä tarkistaa tyypit käännösaikana; interfacet ja mapped typet kuvaavat API-vastausten rakenteen, ja string union -tyypit korvaavat stringly-typed arvot.

**Oppitunnit:** [`b12-ts-basic-enum-string`](/docs/topics/javascript#b12-ts-basic-enum-string), [`b12-ts-basic-interface-shape`](/docs/topics/javascript#b12-ts-basic-interface-shape), [`b12-ts-mapped-type`](/docs/topics/javascript#b12-ts-mapped-type), [`b12-ts-satisfies`](/docs/topics/javascript#b12-ts-satisfies), [`b12-ts-strict-null`](/docs/topics/javascript#b12-ts-strict-null), [`prod-js-unknown-vs-any`](/docs/topics/javascript#prod-js-unknown-vs-any), [`b12-ts-basic-primitive-types`](/docs/topics/javascript#b12-ts-basic-primitive-types), [`b12-ts-basic-union-null`](/docs/topics/javascript#b12-ts-basic-union-null), [`b12-ts-basic-type-annotation-fn`](/docs/topics/javascript#b12-ts-basic-type-annotation-fn)

### TSO {#tso}

**TCP Segmentation Offload** — verkkokortin ominaisuus, jossa TCP-segmentointi siirretään NIC-piirilevylle CPU:lta. `ethtool -K eth0 tso off` poistaa TSO:n diagnostiikkaa varten (pakettikaappaukset näyttävät oikeat segmentit), mutta laitetaan takaisin päälle tuotannossa suorituskyvyn vuoksi.

**Oppitunnit:** [`b06-linux-network-ethtool-offload`](/docs/topics/linux#b06-linux-network-ethtool-offload)

### TTL {#ttl}

**Time To Live** — DNS-tietueessa aika sekunteina, jonka resolver voi pitää vastausta välimuistissa ennen uutta kyselyä. IP-paketeissa TTL on hypylaskuri (vähenee jokaisessa reitittimessä); JavaScript WeakMap-välimuistissa TTL-semantiikka sidotaan objektiviittauksen elinkaareen eikä kelloaikaan.

**Oppitunnit:** [`b09-js-runtime-weakmap-cache`](/docs/topics/javascript#b09-js-runtime-weakmap-cache)

### TU {#tu}

**Translation Unit** — C++:n käännösyksikkö: yksi `.cpp`-tiedosto kaikkine esikäsiteltyine headereineen. Suuret TU:t hidastavat kääntämistä (jopa 2 MB käsiteltävää koodia); IWYU (Include What You Use) poistaa turhat `#include`-rivit ja pienentää TU-kokoja merkittävästi.

**Oppitunnit:** [`b11-cpp-iwyu-cleanup`](/docs/topics/cpp#b11-cpp-iwyu-cleanup)

### UBO {#ubo}

**Uniform Buffer Object** — OpenGL-mekanismi, jolla lähetetään uniform-data (matriisit, valaistusparametrit) GPU:lle yhdessä puskurissa. UBO on tehokkaampi kuin yksittäiset `glUniform*`-kutsut; Qt RHI suosii UBO:ta yksittäisten uniformien sijaan portattavuuden takia.

**Oppitunnit:** [`b02-qt-shaders-uniform-14`](/docs/topics/qt#b02-qt-shaders-uniform-14), [`b08-qt-shaders-uniform`](/docs/topics/qt#b08-qt-shaders-uniform), [`exp-qt-shaders-uniform-location`](/docs/topics/qt#exp-qt-shaders-uniform-location)

### UDP/TCP {#udp-tcp}

**UDP/TCP** — kaksi keskeistä verkkoprotokollaa rinnakkain. **UDP** (User Datagram Protocol) on yhteydetön ja nopea mutta epäluotettava; **TCP** (Transmission Control Protocol) takaa järjestyksen ja toimituksen kolmisuuntaisella kättelyllä. Palomuurisäännöt, Docker-verkkoasetukset ja sovelluksen porttivalinta eroavat protokollan mukaan.

**Oppitunnit:** [`b02-docker-net-host-08`](/docs/topics/docker#b02-docker-net-host-08), [`b09-linux-journald-forward-syslog`](/docs/topics/linux#b09-linux-journald-forward-syslog)

### UI {#ui}

**User Interface** — käyttöliittymä; voi olla graafinen (GUI) tai tekstipohjainen (CLI). Qt Quick- ja QML-projekteissa UI-threadi vastaa renderöinnistä ja käyttäjätapahtumien käsittelystä.

**Oppitunnit:** [`b02-js-modules-tla-10`](/docs/topics/javascript#b02-js-modules-tla-10), [`b02-qt-models-sort-09`](/docs/topics/qt#b02-qt-models-sort-09), [`b02-qt-opengl-context-11`](/docs/topics/qt#b02-qt-opengl-context-11), [`b02-qt-signals-disconnect-05`](/docs/topics/qt#b02-qt-signals-disconnect-05), [`b02-qt-thread-worker-06`](/docs/topics/qt#b02-qt-thread-worker-06), [`b03-js-modules-worker-postmessage`](/docs/topics/javascript#b03-js-modules-worker-postmessage), [`b03-qt-models-sort-filter`](/docs/topics/qt#b03-qt-models-sort-filter), [`b03-qt-shaders-qopenglshader`](/docs/topics/qt#b03-qt-shaders-qopenglshader), [`b03-qt-signals-block-signals`](/docs/topics/qt#b03-qt-signals-block-signals), [`b04-js-async-event-loop-blocking`](/docs/topics/javascript#b04-js-async-event-loop-blocking), [`b04-js-runtime-structured-clone`](/docs/topics/javascript#b04-js-runtime-structured-clone), [`b04-qt-models-setData`](/docs/topics/qt#b04-qt-models-setData) (+59 muuta)

### UID/GID {#uid-gid}

**User ID / Group ID** — Linuxin numeraaliset käyttäjä- ja ryhmätunnukset tiedosto-oikeuksissa. Docker bind mountissa kontin prosessin UID/GID pitää täsmätä hostin tiedostojen omistajaan; `USER 1000:1000` Dockerfilessa tai `--user`-lippu asettaa oikeat tunnukset.

**Oppitunnit:** [`b05-docker-vol-bind-perms`](/docs/topics/docker#b05-docker-vol-bind-perms), [`b07-docker-copy-chown`](/docs/topics/docker#b07-docker-copy-chown), [`exp-docker-vol-bind-perms`](/docs/topics/docker#exp-docker-vol-bind-perms)

### UNBOUNDED {#unbounded}

**UNBOUNDED** — SQL-ikkunafunktioiden kehysmäärittelyssä käytetty avainsana. `UNBOUNDED PRECEDING` ulottaa kehyksen partitioin alkuun, `UNBOUNDED FOLLOWING` loppuun. Esimerkiksi `SUM(amount) OVER (ORDER BY day ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` laskee kumulatiivisen summan koko ositusten alusta nykyiselle riville.

**Oppitunnit:** [`sqd-running-total`](/docs/topics/postgres#sqd-running-total), [`sqd-window-frame-rows`](/docs/topics/postgres#sqd-window-frame-rows)

### UNCOMMITTED {#uncommitted}

**READ UNCOMMITTED** — SQL:n alhaisin eristystaso, joka sallisi dirty readin (toisen transaktion vahvistamattomien muutosten lukemisen). PostgreSQL ei tue READ UNCOMMITTEDia käytännössä — MVCC-arkkitehtuurista johtuen se käyttäytyy kuten READ COMMITTED.

**Oppitunnit:** [`b03-pg-explain-isolation-level`](/docs/topics/postgres#b03-pg-explain-isolation-level)

### UNIQUE {#unique}

**UNIQUE** — SQL-rajoite, joka estää saman arvon toistumisen sarakkeessa tai sarakekombinaatiossa. `UNIQUE`-rajoite luo automaattisesti indeksin, joka nopeuttaa hakuja ja estää duplikaattirivit, esimerkiksi bridge-taulun (`student_id, course_id`) -yhdistelmässä.

**Oppitunnit:** [`sqd-many-to-many-bridge`](/docs/topics/postgres#sqd-many-to-many-bridge), [`b04-pg-indexes-partial-active`](/docs/topics/postgres#b04-pg-indexes-partial-active)

### UNIX {#unix}

Klassinen käyttöjärjestelmäperhe (Bell Labs, 1969–); nykyisin tarkoittaa usein POSIX-yhteensopivaa järjestelmää. Materiaalissa esiintyy erityisesti **UNIX-timestamp** — sekuntien määrä 1.1.1970 00:00:00 UTC:stä; JavaScript `Date.getTime()` palauttaa millisekunteja, backend odottaa usein sekunteja.

**Oppitunnit:** [`b06-js-types-temporal-date`](/docs/topics/javascript#b06-js-types-temporal-date)

### UNKNOWN {#unknown}

SQL:n kolmiarvoinen logiikka: ehto voi olla `TRUE`, `FALSE` tai `UNKNOWN`. `NULL = NULL` evaluoituu `UNKNOWN`-arvoksi (ei `TRUE`); `WHERE`-ehto suodattaa pois `UNKNOWN`-rivit. JOIN-ehdossa NULL-sarakkeet johtavat rivien häviämiseen — käytä `IS NOT DISTINCT FROM` NULL-turvalliseen vertailuun.

**Oppitunnit:** [`sqd-null-safe-join`](/docs/topics/postgres#sqd-null-safe-join)

### UNNEST {#unnest}

PostgreSQL-funktio, joka muuntaa taulukon (`ARRAY`) erillisiksi riveiksi. `SELECT UNNEST(tags) FROM articles` hajottaa tagitaulukon; `jsonb_array_elements()` on vastaava funktio JSONB-taulukoille. `UNNEST` kahdella taulukolla rinnakkain (`UNNEST(a, b)`) yhdistää elementit pareittain.

**Oppitunnit:** [`sqd-jsonb-array-elements`](/docs/topics/postgres#sqd-jsonb-array-elements)

### UPSERT {#upsert}

**INSERT ... ON CONFLICT** — operaatio, joka lisää uuden rivin tai päivittää olemassa olevan konfliktin sattuessa. PostgreSQL-syntaksi: `INSERT INTO t VALUES (...) ON CONFLICT (id) DO UPDATE SET col = EXCLUDED.col`. UPSERT tuottaa dead tuplea päivitysten yhteydessä, joten säännöllinen VACUUM on tärkeää.

**Oppitunnit:** [`b07-pg-vacuum-analyze`](/docs/topics/postgres#b07-pg-vacuum-analyze)

### URI {#uri}

**Uniform Resource Identifier** — yleinen tunniste resurssille verkossa tai järjestelmässä. `http://`, `postgres://` ja `ipp://` ovat URI:n erikoistapauksia. Avahi-palvelun mDNS-löytö palauttaa CUPS-tulostimen URI:n, jonka `lpadmin -v` hyväksyy suoraan konfiguraatioon.

**Oppitunnit:** [`b03-linux-avahi-browse-services`](/docs/topics/linux#b03-linux-avahi-browse-services), [`b03-pg-config-ssl-mode`](/docs/topics/postgres#b03-pg-config-ssl-mode), [`b05-linux-avahi-browse`](/docs/topics/linux#b05-linux-avahi-browse)

### URL {#url}

**Uniform Resource Locator** — osoite, joka yksilöi resurssin verkossa (esim. `https://example.com/api/v1`). Dockerin `ADD`-komento voi hakea URL:ista, mutta `COPY` on suositeltavampi eksplisiittisyytensä vuoksi.

**Oppitunnit:** [`apt-repository-add`](/docs/topics/linux#apt-repository-add), [`b03-docker-copy-vs-add`](/docs/topics/docker#b03-docker-copy-vs-add), [`b03-js-modules-import-meta`](/docs/topics/javascript#b03-js-modules-import-meta), [`b04-js-modules-import-meta`](/docs/topics/javascript#b04-js-modules-import-meta), [`b07-js-types-strict-equality`](/docs/topics/javascript#b07-js-types-strict-equality), [`b07-linux-network-curl-debug`](/docs/topics/linux#b07-linux-network-curl-debug), [`b09-js-types-strict-equality`](/docs/topics/javascript#b09-js-types-strict-equality), [`b12-js-modules-create-require`](/docs/topics/javascript#b12-js-modules-create-require), [`b12-js-modules-import-meta-resolve`](/docs/topics/javascript#b12-js-modules-import-meta-resolve), [`b13-qt-quick-image-async`](/docs/topics/qt#b13-qt-quick-image-async), [`prod-sec-xss`](/docs/topics/security#prod-sec-xss), [`rf-variables`](/docs/topics/robotframework#rf-variables) (+1 muuta)

### UTC {#utc}

**Coordinated Universal Time** — maailmanaika, johon kaikki aikavyöhykkeet suhteutetaan. Tietokannoissa aikaleimat kannattaa tallentaa UTC:ssä; PostgreSQL `timestamptz` tallentaa UTC:nä ja konvertoi session aikavyöhykkeeseen haun yhteydessä — tämä on SARG-turvallista toisin kuin funktion käyttö `WHERE`-ehdossa.

**Oppitunnit:** [`sqd-sargable-where`](/docs/topics/postgres#sqd-sargable-where)

### UTF {#utf}

**Unicode Transformation Format** — Unicoden tavuesitys; yleisin on UTF-8 (1–4 tavua per merkki). Rust `String` on aina validia UTF-8:aa; `str`-slice on lainaus UTF-8-tavujen päälle. `String::from_utf8()` palauttaa `Result` — käytä kun luet tiedostosta tai verkosta.

**Oppitunnit:** [`rust-ownership-string-str`](/docs/topics/rust#rust-ownership-string-str)

### UTM {#utm}

**Universal Transverse Mercator** — maailmanlaajuinen poikittaisen Mercatorin vyöhykejärjestelmä (6° vyöhykkeet, metripohjaiset tasokoordinaatit). Suomessa käytetään myös kansallista ETRS-TM35FIN-varianttia.

**Oppitunnit:** [`space-map-utm`](/docs/topics/space#space-map-utm), [`space-map-tm35fin`](/docs/topics/space#space-map-tm35fin)

### UUID {#uuid}

**Universally Unique Identifier** — 128-bittinen standardimuotoinen yksilöivä tunniste (RFC 4122, esim. `550e8400-e29b-41d4-a716-446655440000`). Provisioning-skripteissä UUID-pohjainen hostname estää Avahi-nimiristiriidat kloonatuilla laitteilla; `nmcli`-automaatiossa UUID on luotettavampi profiiliviite kuin nimi.

**Oppitunnit:** [`b02-linux-network-nmcli-11`](/docs/topics/linux#b02-linux-network-nmcli-11), [`b05-linux-avahi-hostname-conflict`](/docs/topics/linux#b05-linux-avahi-hostname-conflict), [`b05-linux-network-nmcli-connect`](/docs/topics/linux#b05-linux-network-nmcli-connect), [`b06-pg-indexes-hash-index`](/docs/topics/postgres#b06-pg-indexes-hash-index), [`b08-linux-network-nmcli`](/docs/topics/linux#b08-linux-network-nmcli), [`linux-nmcli`](/docs/topics/linux#linux-nmcli)

### UV {#uv}

Tekstuurikoordinaatit shader-ohjelmoinnissa: U vaakasuunta, V pystysuunta (normalisoitu 0.0–1.0). Qt RHI:ssä UV-koordinaattien Y-akselin suunta voi poiketa eri backendeillä (OpenGL vs. Vulkan); ES-profiilissa tarkkuusmäärittelyt (`mediump`, `highp`) vaikuttavat UV-laskentaan.

**Oppitunnit:** [`b07-qt-shader-precision`](/docs/topics/qt#b07-qt-shader-precision)

### UX {#ux}

**User Experience** — käyttökokemus; kaikki se, miten käyttäjä kokee tuotteen käytön. Scrumin DoR voi vaatia UX-mockupin tai wireframen ennen kuin tarina voidaan ottaa sprinttiin.

**Oppitunnit:** [`b09-scrum-dor-ux-mockup`](/docs/topics/scrum#b09-scrum-dor-ux-mockup), [`b12-js-modules-dynamic-conditional`](/docs/topics/javascript#b12-js-modules-dynamic-conditional), [`exp-js-modules-dynamic-import`](/docs/topics/javascript#exp-js-modules-dynamic-import), [`scrum-planning-poker`](/docs/topics/scrum#scrum-planning-poker), [`scrum-team-cross-functional`](/docs/topics/scrum#scrum-team-cross-functional), [`b04-js-async-debounce`](/docs/topics/javascript#b04-js-async-debounce)

### VACUUM/INDEX {#vacuum-index}

PostgreSQL VACUUM huoltaa näkyvyyskartan (visibility map) ja vapauttaa dead tupleja kierrätykseen; indeksit rakentuvat uudelleen `REINDEX`:llä tai `VACUUM FULL`:lla. `maintenance_work_mem`-asetus vaikuttaa VACUUM- ja indeksinrakennusoperaatioiden muistinkäyttöön.

**Oppitunnit:** [`b04-pg-config-maintenance-work-mem`](/docs/topics/postgres#b04-pg-config-maintenance-work-mem)

### VAO {#vao}

**Vertex Array Object** — OpenGL-objekti, joka kapseloi vertex-attribuuttiasetukset (sijainti, normaali, tekstuurikoordinaatit). VAO sidotaan kerran alustuksessa; per-frame riittää `glBindVertexArray(vao)` ja `glDrawArrays()`. Qt:n `QOpenGLVertexArrayObject` wrappaa sen C++-olioksi.

**Oppitunnit:** [`b02-qt-opengl-vao-12`](/docs/topics/qt#b02-qt-opengl-vao-12), [`exp-qt-opengl-vao-vbo`](/docs/topics/qt#exp-qt-opengl-vao-vbo), [`b09-qt-shaders-uniform-location`](/docs/topics/qt#b09-qt-shaders-uniform-location)

### VAO/VBO {#vao-vbo}

**VAO/VBO** — OpenGL:n modernin renderöintiputken perusrakenteet. **Vertex Array Object (VAO)** tallentaa vertex-attribuuttimäärittelyt; **Vertex Buffer Object (VBO)** sisältää itse vertex-datan GPU:n muistissa (VRAM). Qt OpenGL -sovelluksissa VAO/VBO luodaan kerran alussa eikä framella uudelleen, jos layout ei muutu.

**Oppitunnit:** [`b02-qt-opengl-vao-12`](/docs/topics/qt#b02-qt-opengl-vao-12)

### VBO {#vbo}

**Vertex Buffer Object** — GPU-muistipuskuri vertex-datalle (koordinaatit, normaalit, UV-koordinaatit). VAO kapseloi VBO-sidoksen ja attribuuttiasettelun; attribuuttilokaalit kannattaa kiinnittää `layout(location = ...)` -direktiivillä eri GPU-ajureiden yhteensopivuuden varmistamiseksi.

**Oppitunnit:** [`b02-qt-opengl-vao-12`](/docs/topics/qt#b02-qt-opengl-vao-12), [`b03-qt-shaders-attribute-location`](/docs/topics/qt#b03-qt-shaders-attribute-location), [`b04-qt-shaders-attribute-location`](/docs/topics/qt#b04-qt-shaders-attribute-location), [`b05-qt-opengl-context-share`](/docs/topics/qt#b05-qt-opengl-context-share), [`exp-qt-opengl-vao-vbo`](/docs/topics/qt#exp-qt-opengl-vao-vbo), [`qt-opengl-vbo`](/docs/topics/qt#qt-opengl-vbo), [`b06-qt-shaders-varying-interpolation`](/docs/topics/qt#b06-qt-shaders-varying-interpolation)

### VBO/VAO {#vbo-vao}

**VBO/VAO** — ks. VAO/VBO. **Vertex Buffer Object (VBO)** tallentaa geometriadatan GPU:lle; **Vertex Array Object (VAO)** tallentaa attribuuttimäärittelyt ja eliminoi toistuvan bindauksen. Pari vähentää driver-overheadia ja on suorituskykyoptimoinnin lähtökohta ennen instancingia tai LOD-tekniikoita.

**Oppitunnit:** [`exp-qt-opengl-vao-vbo`](/docs/topics/qt#exp-qt-opengl-vao-vbo)

### VIP {#vip}

**Virtual IP address** — virtuaalinen IP-osoite, jota useampi palvelin tai prosessi voi jakaa kuormantasauksessa tai failoverissa. Linuxissa VIP lisätään `ip addr add`-komennolla rajapintaan toissijaisena osoitteena; cloud-ympäristöissä VIP hallitaan usein load balancerin tai orchestraattorin kautta.

**Oppitunnit:** [`b04-linux-network-ip-addr`](/docs/topics/linux#b04-linux-network-ip-addr), [`b12-linux-network-ip-addr-secondary`](/docs/topics/linux#b12-linux-network-ip-addr-secondary)

### VLA {#vla}

**VLA** (Variable-Length Array) — C99:n piirre, jossa taulukon koko määritetään ajon aikana stackissa. C++:ssa VLA ei kuulu standardiin ja sen käyttö on turvaton; `std::vector` tai `std::array` ovat suositeltavia vaihtoehtoja. Rust ei salli VLA:n kaltaisia tuntemattoman kokoisia arvoja stackissa, mikä pakottaa käyttämään heap-allokointia (`Box`, `Vec`).

**Oppitunnit:** [`rust-ownership-box-heap`](/docs/topics/rust#rust-ownership-box-heap), [`safety-vector`](/docs/topics/cpp#safety-vector)

### VLAN {#vlan}

**Virtual Local Area Network** — looginen verkkosegmentointi, joka eristää liikennettä fyysisellä kytkimellä tai ohjelmistolla. Docker macvlan/ipvlan-verkkoja käyttäessä voidaan liittyä VLAN-taggattuun segmenttiin. Huomaa: mDNS-broadcast ei kulje VLAN-rajojen yli.

**Oppitunnit:** [`b04-linux-avahi-browse`](/docs/topics/linux#b04-linux-avahi-browse), [`b06-linux-network-ip-neigh`](/docs/topics/linux#b06-linux-network-ip-neigh), [`b09-linux-avahi-service-discovery`](/docs/topics/linux#b09-linux-avahi-service-discovery), [`b12-linux-arp-failed-state`](/docs/topics/linux#b12-linux-arp-failed-state), [`exp-linux-avahi-printer-discovery`](/docs/topics/linux#exp-linux-avahi-printer-discovery)

### VM {#vm}

**Virtual Machine** — ohjelmallisesti emuloitu tietokone (VirtualBox, VMware, cloud-instanssi). Docker Desktop ajaa kontteja Linux-VM:ssä macOS/Windows-hosteilla; kloonatut VM:t voivat periyttää saman hostnamen ja aiheuttaa Avahi-nimiristiriitoja.

**Oppitunnit:** [`b02-docker-vol-bind-12`](/docs/topics/docker#b02-docker-vol-bind-12), [`b02-linux-avahi-conflict-13`](/docs/topics/linux#b02-linux-avahi-conflict-13), [`b06-linux-network-ethtool-offload`](/docs/topics/linux#b06-linux-network-ethtool-offload), [`b12-linux-arp-flush-migration`](/docs/topics/linux#b12-linux-arp-flush-migration), [`exp-docker-net-macvlan`](/docs/topics/docker#exp-docker-net-macvlan), [`b03-pg-explain-index-only-scan`](/docs/topics/postgres#b03-pg-explain-index-only-scan), [`b05-pg-explain-index-only-scan`](/docs/topics/postgres#b05-pg-explain-index-only-scan)

### VOLUME {#volume}

Dockerfilen `VOLUME`-instruktio merkitsee hakemiston erityiseksi tallennus­alueeksi, jonka Docker mounttaa ajonaikaiseen volyymiin. Named volume säilyttää datan kontin poiston jälkeen; bind mount käytetään kehityksessä host-kansion jakamiseen. Kirjoitussuojattu mount ei yksin riitä — data voi silti kadota ilman erillistä volume-hallintaa.

**Oppitunnit:** [`exp-docker-vol-readonly`](/docs/topics/docker#exp-docker-vol-readonly), [`b03-docker-vol-named-vs-bind`](/docs/topics/docker#b03-docker-vol-named-vs-bind), [`b09-docker-vol-anonymous`](/docs/topics/docker#b09-docker-vol-anonymous)

### VPN {#vpn}

**Virtual Private Network** — salattu virtuaalitunneli julkisen verkon yli yrityksen sisäverkkoon. Split-tunnel-VPN reitittää vain yritysverkon osoitteet tunnelin kautta; `ip route show table all` paljastaa VPN-asiakkaan lisäämät reitit.

**Oppitunnit:** [`b02-linux-network-route-09`](/docs/topics/linux#b02-linux-network-route-09), [`b03-linux-avahi-hostname-local`](/docs/topics/linux#b03-linux-avahi-hostname-local), [`b03-linux-network-ip-route-table`](/docs/topics/linux#b03-linux-network-ip-route-table), [`b04-linux-network-route-metric`](/docs/topics/linux#b04-linux-network-route-metric), [`b05-docker-net-dns-custom`](/docs/topics/docker#b05-docker-net-dns-custom), [`b05-linux-network-ip-route`](/docs/topics/linux#b05-linux-network-ip-route), [`b12-linux-network-ip-rule-policy`](/docs/topics/linux#b12-linux-network-ip-rule-policy), [`b12-linux-network-route-get-from`](/docs/topics/linux#b12-linux-network-route-get-from), [`exp-docker-net-custom-dns`](/docs/topics/docker#exp-docker-net-custom-dns), [`exp-linux-network-nmcli-down`](/docs/topics/linux#exp-linux-network-nmcli-down), [`exp-linux-network-route-missing`](/docs/topics/linux#exp-linux-network-route-missing), [`linux-nmcli`](/docs/topics/linux#linux-nmcli)

### VRAM {#vram}

**VRAM** (Video RAM) — näytönohjaimen oma muisti, johon tallennetaan tekstuurit, framebuffer ja shader-resurssit. Qt OpenGL -kontekstijaossa (`QOpenGLContext::setShareContext`) useat widgetit voivat jakaa saman VRAM-datan ilman moninkertaista latausta.

**Oppitunnit:** [`b08-qt-opengl-context-share`](/docs/topics/qt#b08-qt-opengl-context-share), [`b09-qt-opengl-context-share`](/docs/topics/qt#b09-qt-opengl-context-share)

### VT {#vt}

**Virtual Terminal** — Linuxin virtuaalikonsoli (`/dev/tty1`–`/dev/tty7`), johon siirrytään `Ctrl+Alt+F1-F7`-näppäinyhdistelmillä. `systemd-logind` hallinnoi seat/VT-resursseja graafisten istuntojen (`Wayland`, `X11`) ja TTY-kirjautumisten välillä.

**Oppitunnit:** [`b06-linux-systemd-logind`](/docs/topics/linux#b06-linux-systemd-logind)

### VXLAN {#vxlan}

**Virtual Extensible LAN** — verkkoprotokolla, joka tunneloi Ethernet-kehykset UDP:n yli (portti 4789). Docker Swarm overlay-verkko käyttää VXLAN-tunneleja konttien yhdistämiseen eri isäntien välillä; jokainen palveluverkko saa oman VNI-tunnuksensa (VXLAN Network Identifier). VXLAN vaatii klusterin — yksittäinen host käyttää bridge-verkkoa.

**Oppitunnit:** [`docker-overlay`](/docs/topics/docker#docker-overlay)

### WAIT {#wait}

TCP-yhteyden odotustila; tyypillisesti `CLOSE-WAIT`, jossa etäpää on sulkenut yhteyden mutta paikallinen sovellus ei ole vielä kutsunut `close()`. Yhteysvuoto näkyy kasvavana CLOSE-WAIT-yhteyksien määränä `ss -s`-komennolla — korjaus vaatii sovellustason muutoksen.

**Oppitunnit:** [`b12-linux-tcp-close-wait-leak`](/docs/topics/linux#b12-linux-tcp-close-wait-leak), [`b12-linux-tcp-udp-handshake`](/docs/topics/linux#b12-linux-tcp-udp-handshake)

### WAL/FPI {#wal-fpi}

**Write-Ahead Log / Full Page Image** — PostgreSQLin `EXPLAIN (ANALYZE, BUFFERS, WAL)` -tulosteen kenttä, joka kertoo kuinka monta täyttä levyblokkia kirjoitettiin WAL:iin. WAL/FPI-luku on korkea cold-start-tilanteissa tai massiivisten kirjoitusten yhteydessä; se kuvaa klusteritason loki-infrastruktuuria, ei yksittäisen kyselyn I/O-käyttöä.

**Oppitunnit:** [`b06-pg-explain-wal-fpi`](/docs/topics/postgres#b06-pg-explain-wal-fpi)

### WASM {#wasm}

**WebAssembly** — selainympäristön binäärimuoto raskaalle laskennalle. Rust- tai C++-koodi käännetään WASM-moduuliksi (`wasm-pack`, `emscripten`), joka importataan ESM-sovellukseen `WebAssembly.instantiateStreaming()`-API:lla tai bundlerin tuella.

**Oppitunnit:** [`b04-js-modules-import-meta`](/docs/topics/javascript#b04-js-modules-import-meta), [`b12-js-modules-wasm-import`](/docs/topics/javascript#b12-js-modules-wasm-import)

### WCAG {#wcag}

**Web Content Accessibility Guidelines** — W3C:n saavutettavuusstandardi verkkosisällölle (tasot A, AA, AAA). Qt-widgetien näppäimistönavigoinnin oikeellisuus (tab-järjestys, focus-indikaattori) on WCAG 2.1 -vaatimus; testaa jokainen lomake-näkymä manuaalisesti ilman hiirtä.

**Oppitunnit:** [`b06-qt-widgets-tab-order`](/docs/topics/qt#b06-qt-widgets-tab-order)

### WGS84 {#wgs84}

**World Geodetic System 1984** — GPS:n käyttämä maailmanlaajuinen geodeettinen datumi ja ellipsoidi (a = 6 378 137 m). Maantieteellinen CRS usein EPSG:4326; realisaatiot pysyvät lähellä ITRF:ää.

**Oppitunnit:** [`space-datum-wgs84`](/docs/topics/space#space-datum-wgs84), [`space-datum-wgs84-params`](/docs/topics/space#space-datum-wgs84-params)

### WIP {#wip}

**Work In Progress** — kesken oleva työ. Kanbanissa WIP-limit rajoittaa yhtä aikaa käynnissä olevien tehtävien määrää läpimenoajan lyhentämiseksi. `git stash` tallentaa WIP-tilan sivuun keskeytystä varten; `git commit -m 'WIP'` -käytäntö vaikeuttaa PR-review'ta.

**Oppitunnit:** [`b08-scrum-velocity-trend`](/docs/topics/scrum#b08-scrum-velocity-trend), [`git-rebase-interactive`](/docs/topics/git#git-rebase-interactive), [`git-stash-workflow`](/docs/topics/git#git-stash-workflow), [`scrum-dod-no-partial`](/docs/topics/scrum#scrum-dod-no-partial), [`scrum-multitask`](/docs/topics/scrum#scrum-multitask)

### WSL {#wsl}

**Windows Subsystem for Linux** — Windows 10/11 -ominaisuus, joka ajaa Linux-ympäristöä natiivin kernelin rinnalla (WSL2 käyttää kevyttä Hyper-V-virtuaalikonetta). Docker-projekteissa tiedostot kannattaa pitää Linux-tiedostojärjestelmässä (`~/projekti`), ei Windows-puolella (`/mnt/c/`), bind mount -suorituskyvyn takia.

**Oppitunnit:** [`b02-docker-vol-bind-12`](/docs/topics/docker#b02-docker-vol-bind-12)

### WWAN {#wwan}

**Wireless Wide Area Network** — langaton laajaverkko (LTE/5G-modeemi). Linux-järjestelmissä ModemManager hallinnoi WWAN-modeemeja; D-Bus-signaalit (`org.freedesktop.ModemManager1`) kertovat yhteyden tilan muutoksista, joita voidaan kuunnella `dbus-monitor`- tai `gdbus`-komennoilla.

**Oppitunnit:** [`b12-linux-dbus-modemmanager-signal`](/docs/topics/linux#b12-linux-dbus-modemmanager-signal)

### WX {#wx}

MSVC-kääntäjäoptio `/WX` — käsittele kaikki varoitukset virheinä. GCC/Clang-vastine on `-Werror`; CI-putki kannattaa konfiguroida käyttämään `/WX` (Windows) tai `-Werror` (Linux/macOS) alusta alkaen, jotta varoitukset eivät kerry tekniseksi velaksi.

**Oppitunnit:** [`b11-cpp-werror-policy`](/docs/topics/cpp#b11-cpp-werror-policy)

### XHR {#xhr}

**XMLHttpRequest** — selaimen vanha HTTP-pyyntö-API, joka edelsi `fetch()`-APIa. Sync XHR (`open(..., false)`) on vanhentunut ja blokoi UI-threadin; käytä `fetch()` tai async XHR:ää. Sivun sulkemisen yhteydessä käytä `sendBeacon()` tai `fetch({ keepalive: true })` XHR:n sijasta.

**Oppitunnit:** [`b12-js-async-fetch-keepalive`](/docs/topics/javascript#b12-js-async-fetch-keepalive)

### XID {#xid}

**Transaction ID** — PostgreSQLin 32-bittinen transaktiontunniste. XID-avaruus on rajallinen (~4 miljardia); anti-wraparound VACUUM käyttää `freeze`-operaatiota merkitsemään vanhat rivit niin, ettei XID:n kierros aiheuttaisi tietojen katoamista.

**Oppitunnit:** [`b02-pg-vacuum-wrap-10`](/docs/topics/postgres#b02-pg-vacuum-wrap-10), [`b03-pg-vacuum-wraparound-warning`](/docs/topics/postgres#b03-pg-vacuum-wraparound-warning), [`b04-pg-vacuum-freeze-age`](/docs/topics/postgres#b04-pg-vacuum-freeze-age), [`b07-pg-vacuum-autovacuum`](/docs/topics/postgres#b07-pg-vacuum-autovacuum), [`b07-pg-vacuum-bloat`](/docs/topics/postgres#b07-pg-vacuum-bloat), [`b07-pg-vacuum-freeze`](/docs/topics/postgres#b07-pg-vacuum-freeze), [`b09-pg-vacuum-freeze-age`](/docs/topics/postgres#b09-pg-vacuum-freeze-age), [`exp-pg-vacuum-bloat-wraparound`](/docs/topics/postgres#exp-pg-vacuum-bloat-wraparound), [`b05-pg-vacuum-wraparound`](/docs/topics/postgres#b05-pg-vacuum-wraparound), [`b08-pg-vacuum-freeze`](/docs/topics/postgres#b08-pg-vacuum-freeze)

### XML {#xml}

**Extensible Markup Language** — hierarkkinen tekstimuotoinen merkintäkieli. Avahi lukee palvelumäärittelyt `.service`-XML-tiedostoista hakemistosta `/etc/avahi/services/`; formaatti kuvaa palvelutypin, protokollan ja portin.

**Oppitunnit:** [`avahi-service-xml`](/docs/topics/linux#avahi-service-xml), [`b02-linux-avahi-publish-14`](/docs/topics/linux#b02-linux-avahi-publish-14), [`b04-linux-avahi-browse`](/docs/topics/linux#b04-linux-avahi-browse), [`b05-linux-avahi-publish-service`](/docs/topics/linux#b05-linux-avahi-publish-service), [`b06-linux-avahi-daemon-restart`](/docs/topics/linux#b06-linux-avahi-daemon-restart), [`b06-linux-avahi-service-type`](/docs/topics/linux#b06-linux-avahi-service-type), [`rf-ci-integration`](/docs/topics/robotframework#rf-ci-integration), [`exp-linux-avahi-service-xml`](/docs/topics/linux#exp-linux-avahi-service-xml)

### XMLTABLE {#xmltable}

PostgreSQL-funktio, joka muuntaa XML-dokumentin rivitaulukoksi XPath-lausekkeilla. `XMLTABLE('/root/item' PASSING xml_col COLUMNS name TEXT PATH 'name')` erottaa XML-solmut SQL-sarakkeiksi; JSON-vastine on `jsonb_to_recordset()`.

**Oppitunnit:** [`sqd-json-path-query`](/docs/topics/postgres#sqd-json-path-query)

### YAML {#yaml}

**YAML Ain't Markup Language** — ihmisluettava datan sarjallistamisformaatti, joka perustuu sisennöintiin. Käytetään laajalti CI/CD-putkien (GitHub Actions, GitLab CI), Docker Compose -tiedostojen ja Kubernetes-resurssien konfiguroimiseen. Robot Framework tukee YAML-muotoisia keyword-tiedostoja.

**Oppitunnit:** [`rf-keyword-structure`](/docs/topics/robotframework#rf-keyword-structure), [`rf-resource-files`](/docs/topics/robotframework#rf-resource-files)

### YAML/JSON {#yaml-json}

**YAML Ain't Markup Language / JavaScript Object Notation** — yleiset konfiguraatio- ja datavaihtomuodot. Robot Frameworkissa muuttujat voidaan ladata YAML- tai JSON-tiedostoista; YAML tukee listojen ja rakenteiden suoraa esitystä, mikä sopii testidatan iterointiin `FOR`-silmukoissa.

**Oppitunnit:** [`rf-variables`](/docs/topics/robotframework#rf-variables)
