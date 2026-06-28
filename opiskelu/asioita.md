═══ OPISKELULISTA ═══

── Kysy AI:lta (43) ──
  [1] Template-funktio tarvitsee eri haaran integraalisille vs float-tyypeille compile-time. Mitä käytät? (Maija)
      → b03-cpp-tools-if-constexpr
  [2] Luokka `Meters(int v)` aiheuttaa vahingossa implisiittisiä muunnoksia. Miten estät? (Senior-guru)
      → b05-cpp-explicit-constructor
  [3] Rakennat vektorin monimutkaisia olioita — push_back kopioi turhaan. Miten optimoit? (DevOps-lead)
      → b06-cpp-vector-emplace-back
  [4] Tiimi korvaa sprintf-loggauksen. Mikä moderni standardikirjasto auttaa turvalliseen merkkijonoon? (Vastaanottovirkailija)
      → exp-cpp-tools-format-logging
  [5] Code review: funktio ottaa `std::span<int>` ja indeksoi ilman tarkistusta — tuotannossa buffer overflow. Mikä on moderni turvallinen tapa? (Tiina Rantanen)
      → b08-cpp-span-bounds
  [6] std::sort kaatuu outoon virheeseen custom-iteratorilla. Mitä iteratorin pitää tarjota sortille? (Maija)
      → b08-cpp-sort-requirements
  [7] Koodi purkaa `std::pair<int,std::string>` käsin `.first` ja `.second`. Moderni tapa? (Vastaanottovirkailija)
      → b02-cpp-maintain-structured-08
  [8] Silmukka filtteröi ja muuntaa konttia — lukija ei näe intentiota. Miten modernisoida? (Hanna Lehtonen)
      → b06-cpp-ranges-adaptors
  [9] Code reviewissa samat CppCoreGuidelines-rikkomukset toistuvat. Miten automatisoi tarkistus CI:ssä? (Jussi Nieminen)
      → b07-cpp-clang-tidy-ci
  [10] Luokalle tarvitaan ==, !=, <, <=, >, >= — paljon boilerplatea. C++20 lyhennys? (Antti Järvinen)
      → b07-cpp-spaceship-operator
  [11] std::vector::push_back heittää poikkeuksen kesken move-operaatiosta — tila epävarma. Miten merkitset move-operaattorin? (Tiina Rantanen)
      → b02-cpp-safety-noexcept-05
  [12] Ketju: optional palauttaa arvon, seuraava funktio ottaa arvon — if-linnoja tulee liikaa. C++23-tyylinen tapa? (Emilia Koskinen)
      → b08-cpp-optional-monadic
  [13] Worker-säie pitää pysäyttää siististi olion tuhoutuessa. Mikä C++20-työkalu auttaa? (Tiina Rantanen)
      → prod-cpp-jthread-stop
  [14] Yksinkertainen shutdown-flag jaettiin bool:lla ilman synkronointia — satunnainen jumi. Ratkaisu? (Mikko Korhonen)
      → b03-cpp-thread-atomic-flag
  [15] Laskenta `int64_t` → `int32_t` hiljaa truncaa arvon. Miten estät käännösaikana? (Riikka Tuominen)
      → b09-cpp-narrowing-conversion
  [16] docker build lähettää gigatavun node_modules kontekstissa. Miten estät? (Petri Heikkinen)
      → b06-docker-build-context-size
  [17] Kontti ei resolvdu sisäistä DNS-nimeä corporate DNS:llä. Compose-korjaus? (Emilia Koskinen)
      → b05-docker-net-dns-custom
  [18] Tuotannossa satunnainen datan korruptio, mutta lokit eivät riitä juurisyyn löytämiseen. Mikä ensimmäinen parannus ennen isoa refaktorointia? (Hanna Lehtonen)
      → prod-ops-observability
  [19] Vanha palvelu käynnistyy uudestaan päivityksen jälkeen vaikka disable tehtiin. Miten estät pysyvästi? (Olli Saarinen)
      → b04-linux-systemd-mask
  [20] Yksi container syö koko hostin RAM:in — OOM killaa muita. Rajoitus? (Tiina Rantanen)
      → b02-docker-run-limit-02
  [21] Tuotantobugi: buffer overflow C-tyylisessä `char*` API:ssa. Moderni korvaava tyyppi rajattuun näkymään? (DevOps-lead)
      → b09-cpp-span-bounds-check
  [22] CI-buildit ovat hitaita — jokainen layer invalidoituu kun package.json muuttuu. Mitä Dockerfile-järjestystä muutat? (Petri Heikkinen)
      → exp-docker-build-cache
  [23] Move-operaattori heittää poikkeuksen — std::vector reallokoi kesken ja tila epävarma. Mitä merkitset? (Vastaanottovirkailija)
      → b03-cpp-prod-exception-noexcept
  [24] Kaksi säiettä kirjoittaa samaan `int`-muuttujaan ilman synkronointia. Mitä C++ standardi sanoo? (Emilia Koskinen)
      → thread-data-race
  [25] Tiimi kirjoittaa copy assignment -operaattorin käsin ja unohtaa self-assignmentin. Idiomivaihtoehto? (Hanna Lehtonen)
      → b03-cpp-maintain-copy-swap
  [26] Tarinassa on suuri tekninen epävarmuus ennen estimointia. Mitä Scrum-best-practices suosittelee? (Jussi Nieminen)
      → b10-scrum-dor-spike-01
  [27] Tarinassa tekninen riski on korkea — arkkitehtuuria ei tunneta. Mitä ennen varsinaista feature-tarinoita? (Jussi Nieminen)
      → b09-scrum-dor-spike-needed
  [28] Binääriprotokolla lukee uint32:n verkosta — arvo väärä ARM:llä. Miten C++20 auttaa? (Tuotejohtaja)
      → b07-cpp-endian-portable
  [29] Käyttäjän kommentti renderöidään HTML:ään ilman escapetusta. Mikä riski? (Tiina Rantanen)
      → prod-sec-xss
  [30] Viisi Scrum-tiimiä työskentelee samassa tuotteessa — riippuvuudet aiheuttavat viiveitä. Koordinaatio? (Riikka Tuominen)
      → b09-scrum-scrum-of-scrums
  [31] Regressio ilmestyi jossain 200 commitin välillä. Mikä Git-työkalu auttaa löytämään syyllisen commitin? (Nina Kallio)
      → prod-git-bisect
  [32] EXPLAIN näyttää Sort → Disk temp file — muistisortti ei mahdu. Mikä GUC auttaa? (Tiina Rantanen)
      → exp-pg-config-work-mem-sort
  [33] resolv.conf näyttää 127.0.0.53 — DNS-kyselyt epäonnistuvat satunnaisesti. Todennäköisin syy? (HR — Liisa)
      → b04-linux-resolv-stub
  [34] Docker-kontti julkaisee mDNS-palvelun mutta host ei näe sitä. Tyypillinen syy? (HR — Liisa)
      → b07-linux-avahi-reflector
  [35] Funktio lukitsee kaksi mutexia — riski deadlockille. C++17-ratkaisu? (Emilia Koskinen)
      → b02-cpp-thread-scoped-lock-12
  [36] API-kutsu epäonnistuu TLS:n jälkeen — epäilet palomuurin RST-paketteja. Nopein diagnostiikka? (Partio)
      → b07-linux-network-tcpdump
  [37] 1 Gbps linkki neuvottelee 100 Mbps — throughput romahtaa. Ensimmäinen tarkistus? (HR — Liisa)
      → b03-linux-network-ethtool-link
  [38] Template-funktio `sortLike(T& a, T& b)` kaatuu outoihin virheisiin väärillä tyypeillä. C++20-ratkaisu rajapintaan? (Antti Järvinen)
      → b02-cpp-tools-concepts-02
  [39] Tehdasfunktio make<T>(Args&&... args) välittää argumentit konstruktorille. Mikä idiomi säilyttää value categoryn? (Maija)
      → b07-cpp-perfect-forwarding
  [40] FILE* pitää sulkea fclose:lla — unique_ptr<FILE> ei riitä. Miten mallinnet oikein? (Tiina Rantanen)
      → b08-cpp-unique-ptr-deleter
  [41] Async callback tarvitsee `shared_ptr`:n `this`:stä, mutta `shared_ptr(this)` kaataa ohjelman. Oikea pattern? (Tiina Rantanen)
      → b09-cpp-enable-shared-from-this
  [42] Worker-säie odottaa queuea — spurious wakeup aiheuttaa tyhjän pop:in. Oikea wait-pattern? (Jarmo)
      → b09-cpp-condition-variable-wait
  [43] Konfiguraatiocache: lukijoita paljon, kirjoittajia harvoin — std::mutex hidastaa turhaan. Parempi primitiivi? (Jussi Nieminen)
      → b08-cpp-shared-mutex-read

── Väärin vastatut (29) ──
  [1] Miksi `for (int i = 0; i < v.size(); i++)` voi olla vaarallinen? (Vastaanottovirkailija)
      → correct-signed-unsigned
  [2] Mitä Rule of Zero tarkoittaa? (Vastaanottovirkailija)
      → safety-rule-of-zero
  [3] Template-funktio tarvitsee eri haaran integraalisille vs float-tyypeille compile-time. Mitä käytät? (Maija)
      → b03-cpp-tools-if-constexpr
  [4] assert() katoaa release-buildissa mutta invariantti on kriittinen tuotannossa. Mitä käytät? (Anna Virtanen)
      → b07-cpp-assert-vs-expect
  [5] Tehdasfunktio luo dynaamisen olion. Miksi `std::make_unique<T>()` on parempi kuin `new T()`? (Vastaanottovirkailija)
      → b05-cpp-make-unique-factory
  [6] Timeout-koodi: `sleep(500)` — yksikkö epäselvä. Miten ilmaiset 500 millisekuntia C++14:ssä? (Vastaanottovirkailija)
      → b07-cpp-chrono-literals
  [7] std::sort kaatuu outoon virheeseen custom-iteratorilla. Mitä iteratorin pitää tarjota sortille? (Maija)
      → b08-cpp-sort-requirements
  [8] std::vector::push_back heittää poikkeuksen kesken move-operaatiosta — tila epävarma. Miten merkitset move-operaattorin? (Tiina Rantanen)
      → b02-cpp-safety-noexcept-05
  [9] Kaksi std::atomic-laskuria on vierekkäin structissa ja eri säikeet päivittävät niitä. Miksi suorituskyky romahtaa? (Tiina Rantanen)
      → prod-cpp-false-sharing-struct
  [10] Worker-säie pitää pysäyttää siististi olion tuhoutuessa. Mikä C++20-työkalu auttaa? (Tiina Rantanen)
      → prod-cpp-jthread-stop
  [11] Markkinamuutos tekee sprintin tavoitteen merkityksettömäksi kesken sprintin. Mitä Scrum Guide sanoo? (Projektipäällikkö)
      → b06-scrum-sprint-cancellation
  [12] Bugi: `typeof null === 'object'`. Turvallinen null-tarkistus? (Kari Mattila)
      → b09-js-types-null-object
  [13] Laskenta `int64_t` → `int32_t` hiljaa truncaa arvon. Miten estät käännösaikana? (Riikka Tuominen)
      → b09-cpp-narrowing-conversion
  [14] Compose: web ei tavoita db:ä hostname `db` — molemmat samassa projektissa. Tyypillinen syy? (Markus Salonen)
      → b02-docker-net-compose-07
  [15] docker build lähettää gigatavun node_modules kontekstissa. Miten estät? (Petri Heikkinen)
      → b06-docker-build-context-size
  [16] Kontti ei resolvdu sisäistä DNS-nimeä corporate DNS:llä. Compose-korjaus? (Emilia Koskinen)
      → b05-docker-net-dns-custom
  [17] CI-buildit ovat hitaita — jokainen layer invalidoituu kun package.json muuttuu. Mitä Dockerfile-järjestystä muutat? (Petri Heikkinen)
      → exp-docker-build-cache
  [18] Kontti tarvitsee kuunnella hostin porttia 53 ilman NAT:ia. Mikä network mode? (Markus Salonen)
      → docker-host-network
  [19] Kontti ei resolvaa sisäistä `corp.internal` -DNS:ää. Ensimmäinen tarkistus? (Markus Salonen)
      → docker-dns-custom
  [20] Kaksi säiettä kirjoittaa samaan `int`-muuttujaan ilman synkronointia. Mitä C++ standardi sanoo? (Emilia Koskinen)
      → thread-data-race
  [21] Tarinassa on suuri tekninen epävarmuus ennen estimointia. Mitä Scrum-best-practices suosittelee? (Jussi Nieminen)
      → b10-scrum-dor-spike-01
  [22] Tarinassa tekninen riski on korkea — arkkitehtuuria ei tunneta. Mitä ennen varsinaista feature-tarinoita? (Jussi Nieminen)
      → b09-scrum-dor-spike-needed
  [23] Käyttäjän kommentti renderöidään HTML:ään ilman escapetusta. Mikä riski? (Tiina Rantanen)
      → prod-sec-xss
  [24] Viisi Scrum-tiimiä työskentelee samassa tuotteessa — riippuvuudet aiheuttavat viiveitä. Koordinaatio? (Riikka Tuominen)
      → b09-scrum-scrum-of-scrums
  [25] EXPLAIN näyttää Sort → Disk temp file — muistisortti ei mahdu. Mikä GUC auttaa? (Tiina Rantanen)
      → exp-pg-config-work-mem-sort
  [26] Uusi vaihtoehto lisätään `std::variant`-tyyppiin, mutta käsittely unohtuu koodista. Miten saat kääntäjän auttamaan? (Poliisi)
      → prod-cpp-variant-visit
  [27] resolv.conf näyttää 127.0.0.53 — DNS-kyselyt epäonnistuvat satunnaisesti. Todennäköisin syy? (HR — Liisa)
      → b04-linux-resolv-stub
  [28] Async callback tarvitsee `shared_ptr`:n `this`:stä, mutta `shared_ptr(this)` kaataa ohjelman. Oikea pattern? (Tiina Rantanen)
      → b09-cpp-enable-shared-from-this
  [29] Konfiguraatiocache: lukijoita paljon, kirjoittajia harvoin — std::mutex hidastaa turhaan. Parempi primitiivi? (Jussi Nieminen)
      → b08-cpp-shared-mutex-read
