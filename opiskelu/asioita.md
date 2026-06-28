═══ OPISKELULISTA ═══

── Kysy AI:lta (43) ──
  [1] Template-funktio tarvitsee eri haaran integraalisille vs float-tyypeille compile-time. Mitä käytät? (Maija)
      cpp/tools — 2026-06-21
  [2] Luokka `Meters(int v)` aiheuttaa vahingossa implisiittisiä muunnoksia. Miten estät? (Senior-guru)
      cpp/correctness — 2026-06-21
  [3] Rakennat vektorin monimutkaisia olioita — push_back kopioi turhaan. Miten optimoit? (DevOps-lead)
      cpp/safety — 2026-06-21
  [4] Tiimi korvaa sprintf-loggauksen. Mikä moderni standardikirjasto auttaa turvalliseen merkkijonoon? (Vastaanottovirkailija)
      cpp/tools — 2026-06-23
  [5] Code review: funktio ottaa `std::span<int>` ja indeksoi ilman tarkistusta — tuotannossa buffer overflow. Mikä on moderni turvallinen tapa? (Tiina Rantanen)
      cpp/safety — 2026-06-23
  [6] std::sort kaatuu outoon virheeseen custom-iteratorilla. Mitä iteratorin pitää tarjota sortille? (Maija)
      cpp/tools — 2026-06-23
  [7] Koodi purkaa `std::pair<int,std::string>` käsin `.first` ja `.second`. Moderni tapa? (Vastaanottovirkailija)
      cpp/maintainability — 2026-06-23
  [8] Silmukka filtteröi ja muuntaa konttia — lukija ei näe intentiota. Miten modernisoida? (Hanna Lehtonen)
      cpp/maintainability — 2026-06-23
  [9] Code reviewissa samat CppCoreGuidelines-rikkomukset toistuvat. Miten automatisoi tarkistus CI:ssä? (Jussi Nieminen)
      cpp/maintainability — 2026-06-23
  [10] Luokalle tarvitaan ==, !=, <, <=, >, >= — paljon boilerplatea. C++20 lyhennys? (Antti Järvinen)
      cpp/tools — 2026-06-23
  [11] std::vector::push_back heittää poikkeuksen kesken move-operaatiosta — tila epävarma. Miten merkitset move-operaattorin? (Tiina Rantanen)
      cpp/safety — 2026-06-23
  [12] Ketju: optional palauttaa arvon, seuraava funktio ottaa arvon — if-linnoja tulee liikaa. C++23-tyylinen tapa? (Emilia Koskinen)
      cpp/tools — 2026-06-23
  [13] Worker-säie pitää pysäyttää siististi olion tuhoutuessa. Mikä C++20-työkalu auttaa? (Tiina Rantanen)
      cpp/cpp-production — 2026-06-23
  [14] Yksinkertainen shutdown-flag jaettiin bool:lla ilman synkronointia — satunnainen jumi. Ratkaisu? (Mikko Korhonen)
      cpp/threadability — 2026-06-23
  [15] Laskenta `int64_t` → `int32_t` hiljaa truncaa arvon. Miten estät käännösaikana? (Riikka Tuominen)
      cpp/correctness — 2026-06-23
  [16] docker build lähettää gigatavun node_modules kontekstissa. Miten estät? (Petri Heikkinen)
      docker/docker — 2026-06-23
  [17] Kontti ei resolvdu sisäistä DNS-nimeä corporate DNS:llä. Compose-korjaus? (Emilia Koskinen)
      docker/docker-network — 2026-06-23
  [18] Tuotannossa satunnainen datan korruptio, mutta lokit eivät riitä juurisyyn löytämiseen. Mikä ensimmäinen parannus ennen isoa refaktorointia? (Hanna Lehtonen)
      backend/ops-incident — 2026-06-23
  [19] Vanha palvelu käynnistyy uudestaan päivityksen jälkeen vaikka disable tehtiin. Miten estät pysyvästi? (Olli Saarinen)
      linux/systemd — 2026-06-23
  [20] Yksi container syö koko hostin RAM:in — OOM killaa muita. Rajoitus? (Tiina Rantanen)
      docker/docker — 2026-06-23
  [21] Tuotantobugi: buffer overflow C-tyylisessä `char*` API:ssa. Moderni korvaava tyyppi rajattuun näkymään? (DevOps-lead)
      cpp/safety — 2026-06-23
  [22] CI-buildit ovat hitaita — jokainen layer invalidoituu kun package.json muuttuu. Mitä Dockerfile-järjestystä muutat? (Petri Heikkinen)
      docker/docker — 2026-06-23
  [23] Move-operaattori heittää poikkeuksen — std::vector reallokoi kesken ja tila epävarma. Mitä merkitset? (Vastaanottovirkailija)
      cpp/correctness — 2026-06-23
  [24] Kaksi säiettä kirjoittaa samaan `int`-muuttujaan ilman synkronointia. Mitä C++ standardi sanoo? (Emilia Koskinen)
      cpp/threadability — 2026-06-24
  [25] Tiimi kirjoittaa copy assignment -operaattorin käsin ja unohtaa self-assignmentin. Idiomivaihtoehto? (Hanna Lehtonen)
      cpp/maintainability — 2026-06-24
  [26] Tarinassa on suuri tekninen epävarmuus ennen estimointia. Mitä Scrum-best-practices suosittelee? (Jussi Nieminen)
      scrum/scrum-dor — 2026-06-24
  [27] Tarinassa tekninen riski on korkea — arkkitehtuuria ei tunneta. Mitä ennen varsinaista feature-tarinoita? (Jussi Nieminen)
      scrum/scrum-dor — 2026-06-24
  [28] Binääriprotokolla lukee uint32:n verkosta — arvo väärä ARM:llä. Miten C++20 auttaa? (Tuotejohtaja)
      cpp/portability — 2026-06-24
  [29] Käyttäjän kommentti renderöidään HTML:ään ilman escapetusta. Mikä riski? (Tiina Rantanen)
      security/web-security — 2026-06-24
  [30] Viisi Scrum-tiimiä työskentelee samassa tuotteessa — riippuvuudet aiheuttavat viiveitä. Koordinaatio? (Riikka Tuominen)
      scrum/scrum-team — 2026-06-24
  [31] Regressio ilmestyi jossain 200 commitin välillä. Mikä Git-työkalu auttaa löytämään syyllisen commitin? (Nina Kallio)
      git/git-workflow — 2026-06-24
  [32] EXPLAIN näyttää Sort → Disk temp file — muistisortti ei mahdu. Mikä GUC auttaa? (Tiina Rantanen)
      postgres/pg-config — 2026-06-24
  [33] resolv.conf näyttää 127.0.0.53 — DNS-kyselyt epäonnistuvat satunnaisesti. Todennäköisin syy? (HR — Liisa)
      linux/linux-network — 2026-06-28
  [34] Docker-kontti julkaisee mDNS-palvelun mutta host ei näe sitä. Tyypillinen syy? (HR — Liisa)
      linux/avahi — 2026-06-28
  [35] Funktio lukitsee kaksi mutexia — riski deadlockille. C++17-ratkaisu? (Emilia Koskinen)
      cpp/threadability — 2026-06-28
  [36] API-kutsu epäonnistuu TLS:n jälkeen — epäilet palomuurin RST-paketteja. Nopein diagnostiikka? (Partio)
      linux/linux-network — 2026-06-28
  [37] 1 Gbps linkki neuvottelee 100 Mbps — throughput romahtaa. Ensimmäinen tarkistus? (HR — Liisa)
      linux/linux-network — 2026-06-28
  [38] Template-funktio `sortLike(T& a, T& b)` kaatuu outoihin virheisiin väärillä tyypeillä. C++20-ratkaisu rajapintaan? (Antti Järvinen)
      cpp/tools — 2026-06-28
  [39] Tehdasfunktio make<T>(Args&&... args) välittää argumentit konstruktorille. Mikä idiomi säilyttää value categoryn? (Maija)
      cpp/tools — 2026-06-28
  [40] FILE* pitää sulkea fclose:lla — unique_ptr<FILE> ei riitä. Miten mallinnet oikein? (Tiina Rantanen)
      cpp/safety — 2026-06-28
  [41] Async callback tarvitsee `shared_ptr`:n `this`:stä, mutta `shared_ptr(this)` kaataa ohjelman. Oikea pattern? (Tiina Rantanen)
      cpp/safety — 2026-06-28
  [42] Worker-säie odottaa queuea — spurious wakeup aiheuttaa tyhjän pop:in. Oikea wait-pattern? (Jarmo)
      cpp/threadability — 2026-06-28
  [43] Konfiguraatiocache: lukijoita paljon, kirjoittajia harvoin — std::mutex hidastaa turhaan. Parempi primitiivi? (Jussi Nieminen)
      cpp/threadability — 2026-06-28

── Väärin vastatut (29) ──
  [1] Miksi `for (int i = 0; i < v.size(); i++)` voi olla vaarallinen? (Vastaanottovirkailija)
      cpp/correctness — 2026-06-21
  [2] Mitä Rule of Zero tarkoittaa? (Vastaanottovirkailija)
      cpp/safety — 2026-06-21
  [3] Template-funktio tarvitsee eri haaran integraalisille vs float-tyypeille compile-time. Mitä käytät? (Maija)
      cpp/tools — 2026-06-21
  [4] assert() katoaa release-buildissa mutta invariantti on kriittinen tuotannossa. Mitä käytät? (Anna Virtanen)
      cpp/correctness — 2026-06-21
  [5] Tehdasfunktio luo dynaamisen olion. Miksi `std::make_unique<T>()` on parempi kuin `new T()`? (Vastaanottovirkailija)
      cpp/safety — 2026-06-23
  [6] Timeout-koodi: `sleep(500)` — yksikkö epäselvä. Miten ilmaiset 500 millisekuntia C++14:ssä? (Vastaanottovirkailija)
      cpp/tools — 2026-06-23
  [7] std::sort kaatuu outoon virheeseen custom-iteratorilla. Mitä iteratorin pitää tarjota sortille? (Maija)
      cpp/tools — 2026-06-23
  [8] std::vector::push_back heittää poikkeuksen kesken move-operaatiosta — tila epävarma. Miten merkitset move-operaattorin? (Tiina Rantanen)
      cpp/safety — 2026-06-23
  [9] Kaksi std::atomic-laskuria on vierekkäin structissa ja eri säikeet päivittävät niitä. Miksi suorituskyky romahtaa? (Tiina Rantanen)
      cpp/cpp-production — 2026-06-23
  [10] Worker-säie pitää pysäyttää siististi olion tuhoutuessa. Mikä C++20-työkalu auttaa? (Tiina Rantanen)
      cpp/cpp-production — 2026-06-23
  [11] Markkinamuutos tekee sprintin tavoitteen merkityksettömäksi kesken sprintin. Mitä Scrum Guide sanoo? (Projektipäällikkö)
      scrum/scrum-sprint — 2026-06-23
  [12] Bugi: `typeof null === 'object'`. Turvallinen null-tarkistus? (Kari Mattila)
      javascript/js-types — 2026-06-23
  [13] Laskenta `int64_t` → `int32_t` hiljaa truncaa arvon. Miten estät käännösaikana? (Riikka Tuominen)
      cpp/correctness — 2026-06-23
  [14] Compose: web ei tavoita db:ä hostname `db` — molemmat samassa projektissa. Tyypillinen syy? (Markus Salonen)
      docker/docker-network — 2026-06-23
  [15] docker build lähettää gigatavun node_modules kontekstissa. Miten estät? (Petri Heikkinen)
      docker/docker — 2026-06-23
  [16] Kontti ei resolvdu sisäistä DNS-nimeä corporate DNS:llä. Compose-korjaus? (Emilia Koskinen)
      docker/docker-network — 2026-06-23
  [17] CI-buildit ovat hitaita — jokainen layer invalidoituu kun package.json muuttuu. Mitä Dockerfile-järjestystä muutat? (Petri Heikkinen)
      docker/docker — 2026-06-23
  [18] Kontti tarvitsee kuunnella hostin porttia 53 ilman NAT:ia. Mikä network mode? (Markus Salonen)
      docker/docker-network — 2026-06-23
  [19] Kontti ei resolvaa sisäistä `corp.internal` -DNS:ää. Ensimmäinen tarkistus? (Markus Salonen)
      docker/docker-network — 2026-06-23
  [20] Kaksi säiettä kirjoittaa samaan `int`-muuttujaan ilman synkronointia. Mitä C++ standardi sanoo? (Emilia Koskinen)
      cpp/threadability — 2026-06-24
  [21] Tarinassa on suuri tekninen epävarmuus ennen estimointia. Mitä Scrum-best-practices suosittelee? (Jussi Nieminen)
      scrum/scrum-dor — 2026-06-24
  [22] Tarinassa tekninen riski on korkea — arkkitehtuuria ei tunneta. Mitä ennen varsinaista feature-tarinoita? (Jussi Nieminen)
      scrum/scrum-dor — 2026-06-24
  [23] Käyttäjän kommentti renderöidään HTML:ään ilman escapetusta. Mikä riski? (Tiina Rantanen)
      security/web-security — 2026-06-24
  [24] Viisi Scrum-tiimiä työskentelee samassa tuotteessa — riippuvuudet aiheuttavat viiveitä. Koordinaatio? (Riikka Tuominen)
      scrum/scrum-team — 2026-06-24
  [25] EXPLAIN näyttää Sort → Disk temp file — muistisortti ei mahdu. Mikä GUC auttaa? (Tiina Rantanen)
      postgres/pg-config — 2026-06-24
  [26] Uusi vaihtoehto lisätään `std::variant`-tyyppiin, mutta käsittely unohtuu koodista. Miten saat kääntäjän auttamaan? (Poliisi)
      cpp/cpp-production — 2026-06-24
  [27] resolv.conf näyttää 127.0.0.53 — DNS-kyselyt epäonnistuvat satunnaisesti. Todennäköisin syy? (HR — Liisa)
      linux/linux-network — 2026-06-28
  [28] Async callback tarvitsee `shared_ptr`:n `this`:stä, mutta `shared_ptr(this)` kaataa ohjelman. Oikea pattern? (Tiina Rantanen)
      cpp/safety — 2026-06-28
  [29] Konfiguraatiocache: lukijoita paljon, kirjoittajia harvoin — std::mutex hidastaa turhaan. Parempi primitiivi? (Jussi Nieminen)
      cpp/threadability — 2026-06-28