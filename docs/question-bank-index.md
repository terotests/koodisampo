# Koodisampo — kysymyspankin kooste

Yhteensä **1273** kysymystä. Generoitu: `node scripts/questions-export-md.mjs`

Oikea vastaus merkitty **lihavoituna**.

## backend (19)

### backend-api (4)

#### `backend-outbox-pattern` · diff 4

Tilaus tallennetaan kantaan ja heti perään lähetetään viesti jonoon. Joskus viesti lähtee, vaikka transaktio peruttiin, ja joskus tilaus tallentuu ilman viestiä. Mikä malli?

- **Transactional outbox: viesti samaan transaktioon, erillinen julkaisija lähettää** ✓
- Lähetä viesti ennen tietokantakirjoitusta, niin se ei koskaan jää lähtemättä
- Kasvata jonon retry-määrää, jolloin puuttuvat viestit toimitetaan lopulta
- Kaksi erillistä transaktiota, jotka commitoidaan mahdollisimman nopeasti peräkkäin

#### `prod-backend-external-timeout` · diff 4

Ulkoinen API hidastuu ja koko backend alkaa timeoutata. Mikä puuttuu?

- **Timeoutit, rajatut retryt ja hallittu virhekäyttäytyminen ulkoisille riippuvuuksille** ✓
- Pidempi HTTP-timeout jokaiseen ulkoiseen kutsuun ilman retry-rajaa
- Lisää worker-säikeitä jotta odottavat pyynnöt mahtuvat jonoon
- Poista ulkoiset API-kutsut synkronisesta polusta kokonaan

#### `prod-backend-feature-flag` · diff 3

Uusi suositusalgoritmi rikkoo checkoutin osalle käyttäjistä. Miten pienennät riskiä etukäteen?

- **Feature flag tai kill switch: julkaise pienelle joukolle ja sammuta ilman uutta deployta** ✓
- Julkaise kaikille heti — bugit löytyvät nopeammin tuotannosta
- Pidä uusi algoritmi erillisessä branchissa kunnes seuraava sprintti
- Lisää vain enemmän yksikkötestejä ilman tuotantokontrollia

#### `prod-backend-webhook-idempotency` · diff 4

Maksupalvelu lähettää saman webhookin kahdesti verkkohäiriön jälkeen. Miten vältät tuplakirjauksen?

- **Tallenna idempotency key ennen sivuvaikutusta ja hylkää duplikaatit** ✓
- Luota että maksupalvelu toimittaa webhookin täsmälleen yhden kerran
- Lisää timeout webhook-käsittelyyn odottaen verkon vakaantumista
- Poista palveluntarjoajan retry-asetus integraatiosta kokonaan

### backend-data (7)

#### `backend-deadlock-lock-order` · diff 4

Kaksi rinnakkaista siirtoa: toinen päivittää tilit A→B, toinen B→A. Lokissa näkyy satunnaisesti 'deadlock detected'. Miten estät?

- **Lukitse rivit aina samassa järjestyksessä, esim. pienin tili-id ensin** ✓
- Nosta deadlock_timeout minuuttiin, jolloin lukkiutuminen ehtii purkautua itsestään
- Poista transaktio ja tee päivitykset erillisinä autocommit-lauseina
- Lisää indeksi tilitaulun saldosarakkeelle lukitusten nopeuttamiseksi

#### `backend-lost-update-atomic` · diff 4

Varastosaldo luetaan sovellukseen, siitä vähennetään 1 ja arvo kirjoitetaan takaisin. Ruuhkassa saldo jää liian suureksi. Yksinkertaisin korjaus?

- **Atominen päivitys tietokannassa: UPDATE stock SET qty = qty - 1 WHERE id = $1 AND qty > 0** ✓
- Välimuisti saldolle sovelluksen muistiin, jolloin tietokantalukuja on vähemmän
- Transaktion isolaatio READ UNCOMMITTEDiksi, jolloin muutokset näkyvät heti
- Retry-logiikka, joka kirjoittaa saldon uudelleen virheen sattuessa

#### `backend-migration-lock-timeout` · diff 4

Migraatio `ALTER TABLE orders ADD COLUMN note text` jumittuu, ja samalla kaikki orders-kyselyt jonoutuvat ja API kaatuu. Pitkä raporttikysely oli käynnissä. Miten suojaat migraatiot?

- **SET lock_timeout ennen ALTERia ja uusi yritys, jos lukkoa ei saada** ✓
- Aja migraatio aina VACUUM FULLin jälkeen, jolloin taulu ei ole lukittuna
- Lisää sarake DEFAULT-arvolla, jolloin ALTER ei tarvitse lukkoa lainkaan
- Nosta max_connections, jotta jonoutuneet kyselyt mahtuvat odottamaan

#### `prod-backend-n-plus-one` · diff 3

Lista käyttäjistä haetaan yhdellä queryllä, mutta jokaiselle tehdään erillinen query profiiliin. Mikä ongelma?

- **N+1-query: profiili haetaan erikseen jokaiselle käyttäjäriville listauksessa** ✓
- SQL ei palauta listoja ilman GROUP BY -lauseketta käyttäjätaulussa
- Indeksi käyttäjätaulussa korjaa automaattisesti myös liitostaulun haun
- ORM-kerros estää kaikki tietokantasuorituskykyongelmat abstraktiolla

#### `prod-backend-optimistic-lock` · diff 4

Kaksi käyttäjää muokkaa samaa riviä ja viimeinen tallennus ylikirjoittaa toisen muutokset huomaamatta. Mikä auttaa?

- **Optimistic locking: UPDATE vain jos version-kenttä vastaa lukuhetken arvoa** ✓
- Pidempi istuntotimeout antaa käyttäjille aikaa viimeistellä muokkauksensa
- DELETE + INSERT korvaa UPDATE:n konfliktien välttämiseksi tietokannassa
- Piilota rivi muilta käyttäjiltä UI:ssa samanaikaisen muokkauksen aikana

#### `prod-backend-schema-migration` · diff 5

Tuotantoon lisätään NOT NULL -sarake isoon tauluun ja deploy jäätyy. Mikä meni pieleen?

- **Iso skeemamuutos yhdessä deployssa — käytä expand-and-contract -mallia erillisissä vaiheissa** ✓
- NOT NULL -sarake pitää aina lisätä ilman DEFAULT-arvoa datan eheyden vuoksi
- Suuri taulu pitää aina kopioida uuteen tauluun käsin ennen deployta
- Skeemamuutos on turvallinen jos se ajetaan yöllä kun liikennettä on vähän

#### `prod-backend-transfer-transaction` · diff 4

Rahansiirto vähentää saldoa yhdeltä tililtä ja lisää toiselle. Toinen päivitys epäonnistuu kesken. Mitä tarvitaan?

- **Wrapaa molemmat tilipäivitykset yhteen transaktioon — COMMIT vain onnistuessa** ✓
- Suorita kaksi erillistä UPDATE:ia ja luota sovelluslogiikan rollbackiin
- sleep() kyselyjen välissä antaa tietokannan ehtiä synkronoitua ennen tarkistusta
- Lokita molemmat päivitykset — inkonsistenssi korjataan myöhäisessä batch-ajossa

### ops-incident (8)

#### `prod-backend-queue-dlq` · diff 4

Taustajobi epäonnistuu aina samalla viestillä ja jono jumittuu. Mitä teet?

- **Rajaa retryt, käytä backoffia ja siirrä pysyvästi epäonnistuva viesti dead-letter queueen** ✓
- Poista virheenkäsittely jotta viesti ohitetaan automaattisesti
- Käynnistä worker uudelleen — se poistaa jumittuneen viestin jonosta
- Lisää worker-instansseja jotta sama viesti käsitellään nopeammin

#### `prod-ops-alert-fatigue` · diff 3

Tiimi saa kymmeniä hälytyksiä päivässä eikä tiedä mikä on tärkeää. Mikä on ongelma?

- **Alertit eivät kuvaa käyttäjävaikutusta — hälytä vain asioista jotka vaativat toimenpiteen** ✓
- Liian vähän alertteja — lisää hälytyksiä kaikista metriikoista
- Poista kaikki alertit ja luota manuaaliseen tarkistukseen
- Lähetä alertit vain sähköpostilla jotta ne eivät häiritse

#### `prod-ops-config-env` · diff 3

Staging toimii, tuotanto kaatuu: ympäristömuuttuja puuttuu. Miten estät tämän?

- **Validoi pakolliset env-muuttujat käynnistyksessä — fail fast jos kriittinen config puuttuu** ✓
- Käytä oletusarvoa tuotannossa jotta palvelu käynnistyy aina
- Tarkista config vasta ensimmäisessä API-pyynnössä virhetilanteessa
- Pidä kaikki konfiguraatio kovakoodattuna lähdekoodissa

#### `prod-ops-connection-pool` · diff 4

API hidastuu ruuhkassa, mutta CPU on vain 30 %. Mitä tarkistat?

- **Saturation: DB connection pool, thread pool, jonot, lockit ja hitaat queryt** ✓
- Lisää CPU-resursseja — 30 % käyttö tarkoittaa että kone on liian pieni
- Kasvata connection poolia tuplaten ilman muita muutoksia
- Oleta että hidastuminen johtuu käyttäjien hitaista laitteista

#### `prod-ops-deploy-rollback` · diff 4

Deployn jälkeen virheprosentti nousee 0,1 % → 8 %. Mitä teet ensin?

- **Pysäytä rollout ja rollbackaa edelliseen tunnetusti toimivaan versioon** ✓
- Aloita heti live-debuggaus tuotannossa juurisyyn löytämiseksi
- Odota 24 h — virheet voivat olla tilapäisiä käyttäjävirheitä
- Lisää instansseja jotta virheet jakautuvat useammalle palvelimelle

#### `prod-ops-healthy-but-down` · diff 5

Käyttäjä raportoi palvelun alhaalla, mutta container healthcheck on vihreä. Mitä mittaat seuraavaksi?

- **RED/USE: error rate, latency, throughput, saturation + riippuvuudet — healthcheck voi testata vain prosessia** ✓
- Käynnistä container uudelleen — healthcheck on aina oikeassa
- Poista readiness-probe jotta liikenne ohjautuu nopeammin
- Oleta käyttäjävirhe — älä tutki infrastruktuuria

#### `prod-ops-observability` · diff 5

Tuotannossa satunnainen datan korruptio, mutta lokit eivät riitä juurisyyn löytämiseen. Mikä ensimmäinen parannus ennen isoa refaktorointia?

- **Observability: trace-id, strukturoidut lokit ja invariantit kriittisiin kohtiin** ✓
- Kirjoita järjestelmä uusiksi uudella arkkitehtuurilla ennen diagnostiikkaa
- Poista varoitustasoiset lokit vähentääksesi hälytyksiä on-call-vuoroissa
- Käynnistä interaktiivinen debugger tuotannossa live-sessiolla virheen jäljitykseen

#### `prod-ops-runbook` · diff 3

Hälytys soi yöllä: maksut epäonnistuvat. Mistä aloitat?

- **Runbook: lyhyt toimintalista — dashboard, riippuvuudet, rollback ja eskalointi** ✓
- Soita heti kaikille kehittäjille ja aloita vapaamuotoinen debuggaus
- Odota aamuun kun enemmän ihmisiä on paikalla
- Käynnistä kaikki palvelut uudelleen ja toivo parasta

## cpp (208)

### cmake (15)

#### `prod-cmake-cxx-flags-global` · diff 3

Tiimi asettaa C++20:n globaalisti: `set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++20")`. Miksi moderni CMake suosii toista tapaa?

- **target_compile_features(target PUBLIC|PRIVATE cxx_std_20) — standardi kuuluu targetille, ei koko projektille** ✓
- CMAKE_CXX_FLAGS on ainoa tapa MSVC:llä — target_compile_features ei toimi
- Globaali -std=c++20 on parempi koska se pakottaa kaikki riippuvuudet samaan standardiin
- C++20 vaatii add_definitions(-DCXX20) erikseen jokaisessa targetissa

#### `prod-cmake-duplicate-sources` · diff 3

Sama `src/core.cpp` on listattu sekä `app`-exessä että `tests`-targetissa. Linkitys toimii, mutta ylläpito on kivulias. Parempi malli?

- **Tee core erilliseksi kirjastoksi ja linkkaa se app:iin ja testeihin target_link_libraries(PRIVATE core)** ✓
- Kopioi core.cpp eri hakemistoon testejä varten — erilliset kopiot estävät duplikaattiongelmat
- Listaa core.cpp vain app:ssa ja #include testitiedostoon suoraan
- Käytä add_custom_command joka kääntää core.cpp kerran ja kopioi .o-tiedoston

#### `prod-cmake-fetchcontent-pin` · diff 4

FetchContent hakee fmt-kirjaston GitHubin `main`-branchista. CI-buildit alkavat epäonnistua satunnaisesti ilman koodimuutoksia. Mikä korjaus?

- **Pinnaa versio release tagilla tai commit hashilla — älä seuraa liikkuvaa main-branchia** ✓
- Aja FetchContent jokaisen buildin alussa ilman cachea — tuore main on aina turvallisin
- Poista FetchContent ja kopioi fmt lähdekoodi suoraan repoon ilman versionhallintaa
- Vaihda GIT_SHALLOW FALSE — syvä clone korjaa epävakaat buildit

#### `prod-cmake-fmt-public-leak` · diff 4

Kirjasto `core` käyttää `fmt`:ää vain `.cpp`-tiedostossa, mutta CMakeListsissä on `target_link_libraries(core PUBLIC fmt::fmt)`. Miksi tämä on ongelma?

- **PUBLIC vuotaa riippuvuuden kaikille `core`:n linkkaajille — PRIVATE riittää jos headerit eivät paljasta `fmt`:ää** ✓
- fmt pitää aina linkata INTERFACE — STATIC ei toimi kolmannen osapuolen libeille
- PUBLIC on pakollinen kaikille ulkoisille kirjastoille CMake 3.x:ssä
- Ongelma on vain Windowsilla — Linuxissa PUBLIC/PRIVATE on irrelevantti

#### `prod-cmake-glob-missed-source` · diff 3

Lisäät `src/foo.cpp`:n, mutta build ei linkitä sitä ennen kuin ajat `cmake` uudelleen. CMakeLists: `file(GLOB SOURCES src/*.cpp)`. Mikä on ongelma?

- **GLOB ei päivity automaattisesti — listaa lähteet eksplisiittisesti tai käytä CONFIGURE_DEPENDS** ✓
- GLOB toimii vain header-tiedostoille — .cpp vaatii add_executable
- Puuttuu `cmake --build . --target clean` jokaisen uuden tiedoston jälkeen
- Ninja-generaattori ei tue GLOBia — vaihda Makefiles-generaattoriin

#### `prod-cmake-header-only-interface` · diff 3

Header-only-kirjastossa ei ole `.cpp`-tiedostoja. Miten mallinnat sen modernissa CMakessa?

- **add_library(mylib INTERFACE) + target_include_directories ja target_compile_features INTERFACE-scopeilla** ✓
- add_library(mylib STATIC) ilman lähdetiedostoja — tyhjä .cpp pakollinen
- include_directories() globaalisti — header-only ei tarvitse targetia
- add_executable dummy.cpp vain jotta CMake hyväksyy projektin

#### `prod-cmake-install-interface` · diff 4

Kirjasto buildaa lokaalisti, mutta asennetun paketin käyttäjä saa include-polun `/home/dev/proj/include`. CMakeListsissä: `target_include_directories(mylib PUBLIC ${CMAKE_SOURCE_DIR}/include)`. Mikä puuttuu?

- **BUILD_INTERFACE ja INSTALL_INTERFACE generator expressionit — älä vuoda absoluuttista source pathia installiin** ✓
- Kovakoodaa `/usr/local/include` kaikille alustoille
- Käytä aina `include_directories()` globaalisti installin jälkeen
- Poista install-säännöt — headerit löytyvät automaattisesti find_package:lla

#### `prod-cmake-missing-build-type` · diff 3

Linux-dev ajaa `cmake -S . -B build && cmake --build build` ilman build typea. Ohjelma on hidas eikä gdb näytä selkeitä rivejä. Mitä puuttuu?

- **Single-config-generaattorilla (Ninja/Makefiles) pitää antaa `-DCMAKE_BUILD_TYPE=Debug` configure-vaiheessa** ✓
- Debug-symbolit tulevat automaattisesti kaikissa Linux-buildissa ilman asetusta
- Build type valitaan aina `cmake --build`:n `--config Debug` -lipulla Makefiles-generaattorilla
- Lisää `-g` globaalisti CMAKE_CXX_FLAGS:iin juureen — se korvaa build typen

#### `prod-cmake-openssl-imported` · diff 4

OpenSSL on kytketty vanhalla tyylillä: `include_directories(${OPENSSL_INCLUDE_DIR})` ja `target_link_libraries(app ${OPENSSL_LIBRARIES})`. Mikä moderni korvaus?

- **find_package(OpenSSL REQUIRED) + target_link_libraries(app PRIVATE OpenSSL::SSL OpenSSL::Crypto)** ✓
- Lataa OpenSSL FetchContentilla main-branchista joka buildissa
- Kopioi openssl/*.h projektin include/-kansioon ja linkkaa -lssl manuaalisesti
- pkg-config on ainoa tuettu tapa — find_package ei toimi OpenSSL:lle

#### `prod-cmake-rpath-install` · diff 4

Ohjelma toimii build-hakemistossa, mutta installin jälkeen: `error while loading shared libraries: libfoo.so`. Ensimmäinen CMake-korjaus?

- **Aseta CMAKE_INSTALL_RPATH esim. $ORIGIN/../lib jotta runtime linker löytää jaetut kirjastot** ✓
- Linkkaa aina staattisesti — shared libraryt eivät toimi installissa
- Kopioi libfoo.so manuaalisesti /usr/lib:ään jokaisella kehittäjällä
- Poista install-säännöt — aja ohjelma aina build-hakemistosta

#### `prod-cmake-source-dir-subproject` · diff 3

Kirjasto toimii yksinään, mutta `add_subdirectory(third_party/lib)` isommassa projektissa antaa väärän include-polun. Libin CMakeLists: `target_include_directories(lib PUBLIC ${CMAKE_SOURCE_DIR}/include)`. Mikä korjaus?

- **Käytä CMAKE_CURRENT_SOURCE_DIR — CMAKE_SOURCE_DIR viittaa ylimmän tason projektiin** ✓
- Korvaa include-polku aina CMAKE_BINARY_DIR:llä
- Poista add_subdirectory — vain find_package toimii aliprojekteissa
- Siirrä headerit projektin juureen jotta SOURCE_DIR on sama kaikille

#### `prod-cmake-subdir-options-leak` · diff 4

Lisäät riippuvuuden `add_subdirectory(third_party/somelib)` ja yhtäkkiä pääprojektiin ilmestyy uusia install-targetteja ja testejä. Miten rajaat vuodon?

- **add_subdirectory(... EXCLUDE_FROM_ALL) ja pakota riippuvuuden optionit OFF:ksi ennen subdirectoryä** ✓
- Poista kaikki option()-kutsut pääprojektin CMakeListsistä
- Kopioi somelib:n lähdekoodi suoraan src/-kansioon ilman CMakeä
- EXCLUDE_FROM_ALL estää find_package:n toiminnan — älä käytä sitä

#### `prod-cmake-transitive-zlib` · diff 4

`core`:n public headerit käyttävät zlib-API:a, mutta `app` linkkaa vain `core`:a ja saa linkkerivirheen `undefined reference to deflate`. `core` linkkaa `ZLIB::ZLIB` PRIVATElla. Korjaus?

- **Vaihda core:n linkitys PUBLIC ZLIB::ZLIB — riippuvuus tarvitaan public API:n käyttäjille** ✓
- App:n pitää aina linkata kaikki riippuvuudet käsin — transitiivinen linkitys ei toimi
- Siirrä zlib #include vain .cpp-tiedostoon — PUBLIC headerit eivät vaikuta linkitykseen
- Käytä INTERFACE-only targetia core:lle ilman linkitystä

#### `prod-cmake-werror-third-party` · diff 4

CI kaatuu kun `add_subdirectory(third_party/somelib)` buildaa vendor-koodin projektin globaalilla `-Werror`:lla. Mitä korjaat?

- **Siirrä -Wall/-Werror omaan targetiin (PRIVATE) ja jätä -Werror optionin taakse — älä pakota vendor-koodille** ✓
- Poista kaikki warning-flagit koko projektista — CI:n pitää mennä läpi hiljaisuudessa
- Forkkaa somelib ja korjaa kaikki sen warningit ennen integraatiota
- Lisää -Wno-error globaalisti ennen add_subdirectory — se poistaa kaikki varoitukset

#### `prod-cpp-cmake-target-includes` · diff 4

Lisäät kolmannen osapuolen libin, mutta sen build kaatuu koska juuren CMakeListsissä on `add_compile_options(-Wall -Wextra)` ja `add_definitions(-DUSE_SSL)`. Mitä korjaat?

- **Siirrä asetukset target-kohtaisiksi (`target_compile_options`, `target_compile_definitions`) — älä levitä globaalisti** ✓
- Poista kolmannen osapuolen lib kokonaan — globaalit flagit ovat aina oikein
- Lisää `-w` globaalisti hiljentääksesi kaikki varoitukset koko projektissa
- Käännä riippuvuus erillisessä CMake-projektissa ilman yhteisiä asetuksia manuaalisesti

### correctness (14)

#### `b02-cpp-correct-dangling-15` · diff 4

Funktio palauttaa `const std::string&` paikallisesta muuttujasta — crash tuotannossa. Mikä on oikea paluutyyppi?

- const string& palautus on aina tehokkain paikallisesta
- **string arvona (RVO) tai string_view jos elinikä taattu** ✓
- static string local — thread-safe ilman mutexia
- char* osoitin paikalliseen puskuriin — välitön palautus

#### `b02-cpp-correct-signed-14` · diff 3

Bugiraportti: `if (index >= 0)` on aina tosi kun `index` on `size_t`. Miksi tarkistus on hyödytön?

- Kääntäjäbugi — vertailu index >= 0 on aina määritelty
- **size_t on unsigned — vertailu nollaan on aina tosi** ✓
- Optimointi -O3 rikkoo unsigned-vertailun
- size_t on signed tyypin aliaksena tässä kontekstissa

#### `b03-cpp-prod-exception-noexcept` · diff 4

Koodikatselmassa ehdotetaan tiimin coding-standardiin sääntöä: merkitse jokainen move-konstruktori `noexcept`, myös ne jotka allokoivat muistia. Mikä on riski, jos allokoiva move silti heittää ajonaikana?

- **Ohjelma kutsuu std::terminate:a — väärä noexcept-lupaus ei ole vain dokumentaatiota** ✓
- Kääntäjä hylkää noexcept-merkinnän käännösaikana jos move voi allokoida
- Poikkeus etenee normaalisti kutsujalle — noexcept vain nopeuttaa moveä
- noexcept pakottaa kääntäjän lisäämään implisiittisen try/catch-lohkon moveen

#### `b04-cpp-auto-deduction-trap` · diff 3

`auto x = {1, 2, 3};` aiheuttaa yllätyksen — x ei ole std::vector. Mikä tyyppi deduktoidaan?

- **std::initializer_list<int> — brace-init auto:lle deduktoidaan näin** ✓
- std::vector<int> — auto ja brace-init tuottavat aina vektorin
- std::array<int, 3> — kolmen alkion lista deduktoidaan arrayksi
- int[3] — C-tyylinen taulukko on auto-deduktion oletustulos

#### `b04-cpp-final-override-virtual` · diff 3

Aliluokka ylikirjoittaa `virtual void draw()` mutta perusluokan signatuuri muuttuu hiljaisesti — kääntäjä ei varoita. Mitä lisäät aliluokan metodiin?

- **override-avainsana — kääntäjä varoittaa jos signatuuri ei matchaa basea** ✓
- Kommentti // overrides Base::draw riittää dokumentoimaan ylikirjoituksen
- final kaikille funktioille automaattisesti estää piilotetut override-virheet
- Poista virtual ja käytä switch type-kentällä polymorfian sijaan

#### `b06-cpp-signed-compare-bug` · diff 4

Code review: `if (a < b)` missä a on int ja b size_t — tuotannossa väärä haara. Mikä on riski?

- **Signed/unsigned vertailu konvertoi — negatiivinen int näyttää suurelle** ✓
- Kääntäjä varoittaa aina — signed/unsigned vertailu ei aiheuta tuotantobugia
- size_t on aina signed C++17:ssä — vertailu int:n kanssa on turvallinen
- Vain float-vertailu on vaarallinen — int ja size_t ovat turvallisia

#### `b07-cpp-assert-vs-expect` · diff 3

assert() katoaa release-buildissa — ulkoisen syötteen invariantti pitää tarkistaa runtime. Mitä käytät?

- **Runtime check + throw/log tuotannossa — assert vain debug-invarianteille** ✓
- assert riittää kriittisiin tuotantoinvariantteihin release-buildissä
- Poista kaikki tarkistukset release:ssä — ne hidastavat suorituskykyä
- #ifdef DEBUG around return korvaa runtime-tarkistuksen tuotannossa

#### `b08-cpp-assert-ndebug` · diff 3

Release-buildissa assert poistuu — miten varmistat että testit löytävät virheet myös tuotantokonfiguraatiossa?

- **Aja testit myös release-buildissa — assert ei korvaa runtime-tarkistuksia** ✓
- assert toimii release-buildissä — NDEBUG ei poista sitä
- Poista kaikki tarkistukset nopeuden vuoksi — nullptr crash paljastaa virheen
- NDEBUG määrittää assertin aina päälle tuotantobuildissa

#### `b09-cpp-narrowing-conversion` · diff 4

Laskenta `int64_t` → `int32_t` hiljaa truncaa arvon. Miten estät käännösaikana?

- **Brace-init {value} — narrowing antaa varoituksen tai virheen käännöksessä** ✓
- static_cast riittää turvallisuuteen — se estää hiljaisen truncauksen
- Muuta int32_t int64_t:ksi — narrowing ei koskaan tapahdu laajennuksessa
- Narrowing on vain floating point -ongelma — kokonaisluvut ovat turvallisia

#### `correct-overflow` · diff 4

Signed integer ylivuoto C++:ssa tuotantokoodissa — mitä standardi sanoo?

- **Signed overflow on UB — älä luota kiertymiseen tuotannossa** ✓
- Signed overflow on määritelty modulo-käyttäytyminen aina
- Overflow on ongelma vain debug-buildissa, ei releasessa
- Kääntäjä korjaa signed overflowin automaattisesti -O2:lla

#### `correct-signed-unsigned` · diff 3

Miksi `for (int i = 0; i < v.size(); i++)` voi olla vaarallinen?

- int on aina turvallisempi silmukkaindeksissä kuin size_t
- **size_t vs int -vertailu voi tuottaa yllättävän haaran tai ikuisen silmukan** ✓
- Kääntäjä varoittaa aina signed/unsigned-sekoituksista -Wall:lla
- static_cast riittää — vertailu on määritelty standardissa turvalliseksi

#### `correct-ub` · diff 3

Mitä tarkoittaa undefined behavior (UB) C++:ssa?

- Ohjelma kaatuu aina heti UB:ssä — debugger pysähtyy riville
- **Standardi sallii mitä tahansa käyttäytymistä — optimointi voi rikkoa koodin** ✓
- UB on vain debug-buildin ongelma — release toimii normaalisti
- UB ja implementation-defined tarkoittavat samaa käytännössä

#### `exp-cpp-correct-compare-three-way` · diff 4

Sorttaus comparator palauttaa `<` ja `>` mutta unohtaa yhtäsuuruuden — epävakaa sort. C++20 ratkaisu?

- Palauta aina -1 tai 1 — sort toimii ilman yhtäsuuruutta
- **default operator<=> structissa + ranges::sort (tai bool-predikaatti comparatorissa)** ✓
- memcmp kaikille tyypeille — nopea yleisratkaisu
- Poista sort ja käytä linked list -rakennetta

#### `exp-cpp-incident-nodiscard` · diff 3

Tuotantoon meni buildi jossa `parseConfig()` palautusarvo ignoroitiin — virheellinen config jäi käyttöön. Miten estät toistumisen?

- **[[nodiscard]] paluuarvolle — kääntäjä varoittaa** ✓
- Kommentti // MUST CHECK
- Muuta funktio void:ksi ja käytä globaalia flagia
- Poista return ja käytä poikkeusta aina

### cpp-build (1)

#### `prod-cpp-sanitizer-tsan` · diff 5

Release-build toimii, mutta TSan löytää data racen kahden säikeen välillä. Miksi mutex tarvitaan?

- **Data race on UB — säikeet eivät synkronoi samaa muuttujaa ilman mutexia/atomicsia vaikka "toimii koneellani"** ✓
- TSan on väärässä — release-optimointi korjaa racen automaattisesti
- volatile riittää thread-safetyyn — TSan ei tunnista sitä
- Data race on vain varoitus — ohjelma on määritelty käyttäytymään satunnaisesti

### cpp-production (11)

#### `prod-cpp-coroutine-lifetime` · diff 5

Coroutine käyttää viittausta paikalliseen muuttujaan `co_await` jälkeen. Mikä riski?

- **Viittaus voi roikkua — coroutine jatkuu myöhemmin eri elinkaaressa** ✓
- co_await kopioi kaiken automaattisesti coroutine frameen
- Coroutine estää dangling-referenssit automaattisesti suspendin jälkeen
- volatile korjaa lifetime-ongelman paikallisen muuttujan viittauksessa

#### `prod-cpp-exception-safety-strong` · diff 5

assign-operaatio heittää kesken kopioinnin. Miten copy-and-swap takaa strong exception safety -takuun?

- **Kopioi väliaikaiseen, swap vain onnistuneen kopion jälkeen — alkuperäinen säilyy jos kopio heittää** ✓
- swap heittää aina — strong guarantee ei ole mahdollinen vectorissa
- noexcept destructor riittää — kopioinnin ei tarvitse olla exception-safe
- catch (...) ja jatka — strong guarantee tarkoittaa samaa kuin basic

#### `prod-cpp-expected-vs-optional` · diff 4

Funktio lataa käyttäjän ID:llä ja voi epäonnistua useasta syystä. Milloin `std::expected` on parempi kuin `std::optional`?

- **Kun tarvitset sekä onnistumisen että virhekoodin/viestin ilman exceptionia — expected kantaa error-tyypin** ✓
- optional korvaa aina expectedin — error-tyyppi on turha
- Käytä aina exceptionia — expected on vain C-koodin jäänne
- optional<bool> riittää kaikkiin virhetilanteisiin

#### `prod-cpp-false-sharing-struct` · diff 4

Kaksi std::atomic-laskuria on vierekkäin structissa ja eri säikeet päivittävät niitä. Miksi suorituskyky romahtaa?

- **False sharing — eri muuttujat jakavat saman cache linen structissa** ✓
- Atomic ei toimi structin jäsenenä — se aiheuttaa suorituskykyromahduksen
- CPU ei tue kahta laskuria rinnakkain — atomic-operaatiot serialisoituvat
- Mutex puuttuu aina atomicien kanssa — ilman sitä laskurit eivät toimi

#### `prod-cpp-jthread-stop` · diff 4

Worker-säie pitää pysäyttää siististi olion tuhoutuessa. Mikä C++20-työkalu auttaa?

- **std::jthread + stop_token — joinaa automaattisesti ja tukee pysäytyspyyntöä** ✓
- std::thread ilman joinia destructorissa — detach hoitaa siistin pysäytyksen
- detach aina destructorissa — se on turvallisin tapa pysäyttää worker
- sleep-loop ilman stop-flagia — yksinkertaisin tapa pysäyttää säie

#### `prod-cpp-optional-deref` · diff 3

Koodi tekee `return *findUser(id);` missä `findUser` palauttaa `std::optional<User>`. Mikä ongelma?

- **Optional pitää tarkistaa ennen dereferointia — tyhjä optional on UB** ✓
- optional heittää aina poikkeuksen jos tyhjä — operator* on turvallinen
- optional palauttaa nullptr dereferoinnissa kun arvoa ei ole
- optional ei voi olla tyhjä C++17:ssä — has_value on aina true

#### `prod-cpp-raii-rollback` · diff 4

Funktio kirjoittaa kaksi konfiguraatiotiedostoa ja toinen kirjoitus epäonnistuu kesken. Miten varmistat ettei järjestelmä jää puoliksi päivitettyyn tilaan?

- **Kirjoita väliaikaiseen tiedostoon ja tee atominen rename kun kaikki valmista** ✓
- Kirjoita suoraan alkuperäisiin tiedostoihin — nopein ja yksinkertaisin tapa
- Lisää sleep ennen toista kirjoitusta — se estää puolikkaan päivityksen
- Catchaa poikkeukset ja jatka seuraavaan tiedostoon — osittainen päivitys on OK

#### `prod-cpp-span-member` · diff 4

Luokan API ottaa `std::span<int>` konstruktorissa ja tallentaa sen jäsenmuuttujaan myöhempää käyttöä varten. Mikä riski?

- **span ei omista dataa — tallennettu näkymä voi roikkua kun puskuri tuhoutuu** ✓
- span kopioi datan automaattisesti jäsenmuuttujaan konstruktorissa
- span pitää vectorin automaattisesti elossa luokan eliniän ajan
- span estää kaikki lifetime-bugit — jäsen-span on aina turvallinen

#### `prod-cpp-string-view-member` · diff 4

Luokka ottaa konstruktorissa `std::string_view name` ja tallentaa sen suoraan jäseneksi. Mikä pitää varmistaa?

- **Viitatun merkkijonon elinikä ylittää olion — muuten tallenna std::string** ✓
- string_view omistaa datan automaattisesti kuten std::string jäsenenä
- string_view kopioi aina stringin jäseneksi konstruktorissa
- const jäsen riittää takaamaan string_view:n eliniän luokan sisällä

#### `prod-cpp-variant-visit` · diff 4

Uusi vaihtoehto lisätään `std::variant`-tyyppiin, mutta käsittely unohtuu koodista. Miten saat kääntäjän auttamaan?

- **std::visit + exhaustive visitor — static_assert fallback uusille tyypeille** ✓
- Korvaa variant std::any:llä — kääntäjä pakottaa käsittelemään uudet tyypit
- Muunna kaikki stringiksi switchissä — se havaitsee puuttuvan käsittelyn
- Lisää default-haara joka ignoraa tuntemattoman — compile-time tarkistus riittää

#### `prod-cpp-volatile-not-thread-safe` · diff 4

Kaksi säiettä jakaa `volatile bool done` -lipun. Miksi tämä ei takaa thread-safetyä?

- **volatile estää vain optimoinnin — ei tarjoa atomisuutta eikä memory ordering -takuita** ✓
- volatile on deprecated — käytä aina mutexia boolille
- volatile bool on atomisesti thread-safe C++11:ssä
- std::atomic vaatii aina mutexin volatile-boolin päällä

### maintainability (21)

#### `b02-cpp-maintain-string-view-07` · diff 3

Funktio ottaa `const std::string&` mutta kutsutaan literaaleilla — turhia allokaatioita. Parempi parametri?

- const char* aina — yhteensopivin legacy-API:n kanssa
- **string_view — ei kopioi, hyväksyy stringin ja C-str:n** ✓
- std::string kopio parametrina — turvallisin oletus
- Macro STR(x) literaalien käsittelyyn

#### `b02-cpp-maintain-structured-08` · diff 2

Koodi purkaa `std::pair<int,std::string>` käsin `.first` ja `.second`. Moderni tapa?

- **structured bindings: auto [id, name] = row;** ✓
- Macro GET_FIRST(x) pairin purkamiseen
- Kopioi .first ja .second erillisiin muuttujiin ilman autoa
- void* castaus pair-olioon — vähiten boilerplatea

#### `b03-cpp-maintain-copy-swap` · diff 4

Tiimi kirjoittaa copy assignment -operaattorin käsin ja unohtaa self-assignmentin. Idiomivaihtoehto?

- **Copy-and-swap: copy constructor + swap — strong exception safety** ✓
- memcpy koko structille copy assignmentin toteutuksena
- Poista copy assignment kokonaan ja luota shallow-kopiointiin
- Globaali flag selfAssignmentDetected tarkistamaan tilanteen

#### `b03-cpp-sprint-const-correctness` · diff 2

Code review: getter palauttaa `std::string` kopiona vaikka dataa ei muuteta. Parannus?

- **const std::string& tai std::string_view read-only pääsyyn** ✓
- Palauta aina shared_ptr<string> jaettuun omistukseen getterissä
- Muuta getter globaaliksi muuttujaksi jota kaikki voivat lukea
- Poista const metodeista — se ei vaikuta kopiointikustannukseen

#### `b04-cpp-ranges-filter-view` · diff 3

Koodi luo väliaikaisen vectorin vain suodattaakseen ja laskeakseen count:in. C++20 ranges tapa?

- **std::ranges::count_if(container, pred) — lazy, ei väliaikaista vectoria** ✓
- Kopioi aina std::list suodatukseen ennen count-laskentaa
- Macro FILTER_AND_COUNT korvaa ranges-pipeline:n tuotantokoodissa
- Poista suodatus ja laske kaikki alkiot — se on ranges-tyylinen tapa

#### `b04-cpp-structured-bindings-map` · diff 2

Silmukka käy std::map:in läpi: `for (auto& p : map) { auto k = p.first; auto v = p.second; }`. Modernisointi?

- **for (auto& [key, val] : map) — structured bindings C++17:ssä** ✓
- Muuta std::map aina std::unordered_map:iksi parantaaksesi luettavuutta
- Käytä C-tyylistä for (int i = 0; ...) mapin läpikäyntiin
- Kopioi map jokaisella iteroinnilla varmistaaksesi turvallisen käytön

#### `b05-cpp-avoid-raw-loop` · diff 2

Sprint review: sama for-silmukka toistuu viidessä tiedostossa. Mitä ehdotat refaktorointiin?

- **range-for tai std::for_each — vähemmän toistoa, selkeämpi intentti** ✓
- Kopioi silmukka makroksi COPY_LOOP viidessä tiedostossa
- Jätä silmukat — optimointi on tärkeämpää kuin luettavuus refaktoroinnissa
- Muuta kaikki goto-pohjaiseksi vähentääksesi toistuvaa for-logiikkaa

#### `b06-cpp-ranges-adaptors` · diff 3

Silmukka filtteröi ja muuntaa konttia — lukija ei näe intentiota. Miten modernisoida?

- **std::ranges::views::filter ja transform — lazy pipeline ilman kopioita** ✓
- Kopioi kontti useaan kertaan — se tekee intentin selkeämmäksi
- Käytä makro FOR_EACH filtteröintiin ja muunnokseen
- Siirrä logiikka globaaliin funktioon — ranges ei tuo hyötyä

#### `b07-cpp-clang-tidy-ci` · diff 3

Code reviewissa samat CppCoreGuidelines-rikkomukset toistuvat. Miten automatisoi tarkistus CI:ssä?

- **clang-tidy build-vaiheessa — fail build jos uudet varoitukset CI-putkessa** ✓
- Luota pelkkään manuaaliseen reviewhin — automaatio ei löydä guideline-rikkomuksia
- Poista kaikki varoitukset -w-flagilla — CI pysyy vihreänä ilman clang-tidyä
- Vain runtime-testit riittävät CppCoreGuidelines-rikkomusten havaitsemiseen

#### `b07-cpp-pimpl-abi` · diff 4

Jaettu kirjasto muuttuu usein — headerin muutos pakottaa koko projektin uudelleenkäännön. Mitä kuvio?

- **Pimpl — vain impl muuttuu, julkinen header pysyy vakaana ABI:lle** ✓
- Kaikki private memberit headeriin — se pienentää compile-riippuvuuksia
- inline kaikki funktiot headeriin — se vähentää uudelleenkäännöksiä
- Poista private osio — se yksinkertaistaa kirjaston rajapintaa

#### `b08-cpp-format-safety` · diff 3

Logitus käyttää sprintf-puskuria — satunnainen overflow tuotannossa. Korvaava C++20-ratkaisu?

- **std::format — tulos on std::string, ja muotoilu tarkistetaan käännösaikana** ✓
- snprintf kaksinkertaisella puskurilla — koko riittää nyt kaikille riveille
- printf-perhe on turvallisempi, koska se ei varaa muistia dynaamisesti
- std::to_chars koko lokiriville — muotoilee tekstin ja luvut yhdellä kutsulla

#### `b09-cpp-extract-function-refactor` · diff 2

200-rivinen funktio vaikeuttaa unit testausta. Mitä refaktorointia ehdotat ensin?

- **Extract function — pienemmät testattavat yksiköt selkeillä nimillä** ✓
- Lisää #ifdef TEST_MODE — se mahdollistaa unit testauksen ilman jakoa
- Kopioi logiikka testitiedostoon — se on nopein refaktorointi
- 200-rivinen funktio on OK jos toimii tuotannossa — ei jakoa tarvita

#### `b11-cpp-assert-side-effect` · diff 3

Koodi: `assert(registerCallback(handler));` — release-buildissa callback ei rekisteröidy. Miksi?

- **assert poistetaan NDEBUG:lla — sivuvaikutus katoaa release:ssä** ✓
- assert heittää poikkeuksen release:ssä jos ehto on false
- registerCallback on constexpr — assert ei vaikuta
- assert korvataan automaattisesti if-throw:lla release-buildissa

#### `b11-cpp-bool-parameter` · diff 2

API: `void save(File& f, bool fast);` — kutsuissa `save(f, true)` ei kerro mitään. Parannus?

- **Enum class tai erilliset funktiot — bool-parametri piilottaa intentin** ✓
- Lisää kolmas bool-parametri selventämään verbose-tilaa erikseen
- int 0/1 boolin sijaan — selkeämpi kutsukohdan dokumentaatiossa
- Macro SAVE_FAST(f) korvaa bool-parametrin kutsukohdassa

#### `b11-cpp-macro-to-constexpr` · diff 2

Konfiguraatiossa `#define MAX_CONNECTIONS 100`. Miksi cpp-best-practices suosii constexpria?

- **Makro ei noudata nimiavaruuksia eikä näy debuggerissa — constexpr on tyyppiturvallinen** ✓
- #define on aina nopeampi koska preprocessor korvaa tekstin ennen kääntäjää
- constexpr toimii vain liukulukuarvoille, ei kokonaisluvuille
- Makrot ovat pakollisia header-guardien ja versionumeroiden kanssa

#### `exp-cpp-cr-raii-file` · diff 2

Funktio avaa FILE*:n mutta early return ennen fclose:a. Mitä ehdotat code reviewissa?

- goto cleanup on ainoa turvallinen tapa FILE*-resurssille
- **unique_ptr<FILE, Deleter> tai std::fstream — RAII** ✓
- Poista early returnit — fclose aina lopussa
- fclose vain happy pathissa — virhepolku erikseen

#### `exp-cpp-sprint-algorithm-review` · diff 2

Sprintin lopussa löytyy käsin kirjoitettu for-silmukka joka etsii max-arvon vektorista. Mitä ehdotat?

- **std::max_element — vähemmän off-by-one -virheitä** ✓
- Macro MAX(a,b) jokaiselle vertailulle
- Kopioi silmukka kolmeen paikkaan varmuuden vuoksi
- Poista tarkistus — optimointi ensin

#### `maintain-const-method` · diff 2

Miten merkitset metodin joka ei muuta olion tilaa?

- Merkitse metodi volatile jos olion tilaa ei muuteta
- **Lisää const metodin sulkevan lainausmerkin jälkeen** ✓
- Käytä static-avainsanaa kaikissa gettereissä automaattisesti
- mutable-jäsen sallii muutokset ilman const-merkintää metodissa

#### `maintain-init-list` · diff 2

Miksi `std::vector<int> v{1, 2, 3}` on turvallisempi kuin `vector<int>(3)` kun tarkoitus on kolme arvoa?

- **Sulkeet {1,2,3} alustavat arvot — (3) luo kolme nollaa** ✓
- vector<int>(3) ja vector<int>{3} ovat aina identtiset
- Aaltosulut pakottavat vektorin heap-allokaatioon
- Uniform initialization toimii vain C-koodissa, ei C++:ssa

#### `maintain-range-for` · diff 1

Mikä on selkein tapa käydä kokoelma läpi ilman indeksivirheitä?

- **range-for: for (const auto& x : c)** ✓
- for (int i = 0; i <= c.size(); i++)
- while(true) ilman rajaa
- goto loop

#### `maintain-string-view` · diff 3

Milloin `std::string_view` on hyödyllinen?

- **std::string_view parametrina kun tarvitset vain lukuoikeuden ilman kopiota** ✓
- std::string_view jäsenmuuttujana — kevyt korvike std::stringille
- const char* aina parempi kuin string_view legacy-API:ssa
- string_view omistaa merkkijonon automaattisesti kontissa

### performance (21)

#### `b02-cpp-perf-shrink-10` · diff 3

Vektori kasvaa miljoonaan elementtiin ja tyhjennetään — muisti ei vapaudu. Mitä kutsut?

- clear() vapauttaa aina kapasiteetin automaattisesti
- **shrink_to_fit() tai swap-trick vanhoilla kääntäjillä** ✓
- resize(0) riittää — capacity palautuu nollaan
- delete vector — ainoa tapa vapauttaa muisti

#### `b03-cpp-perf-string-reserve` · diff 2

Silmukka liittää tuhansia rivejä `std::string`iin — profiloija näyttää toistuvia realokointeja. Ensimmäinen korjaus?

- **result.reserve(estimatedSize) ennen silmukkaa** ✓
- Vaihda string -> C-merkkijono strcat
- Poista reserve — se hidastaa aina
- Käytä ostringstream ilman reservea

#### `b04-cpp-move-noexcept-vector` · diff 3

std::vector<MyType> kasvaa hitaasti vaikka move-operaattori on olemassa. Profileri näyttää kopioita. Todennäköisin syy?

- **Move-operaattori ei ole noexcept — vector käyttää copya reallocationissa** ✓
- Vector on liian pieni reserve:lle — kasvustrategia ei riitä tähän
- Move on aina hitaampi kuin copy suurille kontti-tyypeille
- Poista move-operaattori kokonaan — copy on aina turvallisempi

#### `b05-cpp-move-review-temp` · diff 3

Code review ehdottaa `std::move` jokaiselle parametrille funktiossa. Milloin move on järkevä?

- **Kun lähde ei enää tarvita — esim. viimeinen käyttö ennen returnia** ✓
- Aina kaikille parametreille suorituskyvyn vuoksi funktion alussa
- Vain const-viitauksille — move ei toimi muihin parametreihin
- Move korvaa copyn automaattisesti — std::move-kutsua ei tarvita

#### `b05-cpp-rvo-return-local` · diff 3

Funktio palauttaa `std::string` paikallisesta muuttujasta. Onko turha kopiointi väistämätön?

- **Ei — RVO/NRVO voi eliminoida kopion kääntäjäoptimoinnilla** ✓
- Kyllä — paikallisesta stringistä palautus tekee aina kaksi kopiota
- Vain jos palautat std::move(local) — muuten kopiointi on väistämätön
- Palauta aina shared_ptr stringistä välttääksesi kopiointiongelmat

#### `b06-cpp-alignas-cache` · diff 5

Hot loop kärsii cache miss — kaksi counteria samassa cache line:ssä eri threadeilla. Mitä kokeilla?

- **alignas(64) tai erilliset cache line — vähentää false sharing -ongelmaa** ✓
- Lisää volatile kaikille muuttujille — se korjaa false sharingin
- Käytä float double tilalle hot loopissa vähentääksesi cache missejä
- Poista mutex — false sharing ei vaikuta suorituskykyyn eri säikeillä

#### `b08-cpp-emplace-back` · diff 2

vectoriin lisätään monimutkaisia olioita — push_back(T(...)) luo turhan kopion. Miten vältät väliaikaisen?

- **emplace_back(args...) rakentaa suoraan konttiin ilman väliaikaista** ✓
- reserve() korvaa emplace_backin — kopioita ei synny reserve:n jälkeen
- push_back on aina nopein tapa lisätä monimutkaisia olioita vectoriin
- insert(0, obj) on moderni tapa välttää väliaikaista kopiota

#### `b08-cpp-ranges-pipeline` · diff 3

Suodatat ja muunnat vectorin — väliaikaisia vector-kopioita tulee liikaa. C++20 ranges tapa?

- **views::filter | views::transform — laiska ketju ilman välikopiota** ✓
- Kopioi aina uuteen vectoriin ensin — ranges vaatii materialisoinnin
- ranges hidastaa aina — for-loop on nopeampi suodatuksessa
- for-loop on kielletty ranges:n kanssa C++20-standardissa

#### `b09-cpp-emplace-back-move` · diff 3

Rakennat isoja olioita suoraan vectoriin väliaikaisten kopioiden sijaan. Mikä metodi?

- **emplace_back konstruoi paikalleen argumenteilla — vähemmän kopioita** ✓
- push_back on aina tehokkaampi monimutkaisille olioille vectorissa
- insert(0, obj) jokaiselle alkiolle — se välttää väliaikaisen objektin
- reserve korvaa emplace_backin — kopioita ei synny varauksen jälkeen

#### `b11-cpp-bind-vs-lambda` · diff 3

Callback rekisteröidään `std::bind(&Service::handle, this, std::placeholders::_1)`. Mitä cpp-best-practices suosittelee?

- **Lambda — selkeämpi ja yleensä kevyempi kuin std::bind** ✓
- std::bind on aina nopeampi koska se on standardikirjastosta
- Funktiopointeri this:llä on moderni korvaaja lambdalle
- Macro CALLBACK(handle) korvaa bindin turvallisesti

#### `b11-cpp-default-move-ops` · diff 4

Luokassa on custom destructor mutta ei move-operaatioita. Mitä cpp-best-practices ehdottaa?

- **= default move constructor/assignment jos jäsenet tukevat — muuten Rule of Five** ✓
- Poista destructor kokonaan — compiler generoi move automaattisesti aina
- Kopioi aina käsin sen sijaan — move on tarkoitettu vain std::vectorille
- shared_ptr kaikille jäsenille — move-operaatiot eivät enää ole tarpeen

#### `b11-cpp-forward-declare-header` · diff 3

Headeriin lisätään `#include "HeavyWidget.hpp"` vain koska funktio ottaa `const HeavyWidget&`. Käännös hidastuu. Mitä ehdotat?

- **Forward declaration headerissa — include vain .cpp-tiedostoon** ✓
- Siirrä koko HeavyWidget header-onlyksi — vähemmän tiedostoja
- Käytä makroa HEAVY_WIDGET_REF piilottamaan include
- Poista const& ja välitä void* — nopeampi käännös

#### `b11-cpp-if-init-statement` · diff 3

Funktio hakee arvon mapista ja tarkistaa sen: `auto it = m.find(k); if (it != m.end())`. C++17-parannus?

- **if (auto it = m.find(k); it != m.end()) — init-statement rajaa muuttujan eliniän** ✓
- Globaali it-muuttuja vähentää toistuvia find-kutsuja funktiossa
- Macro FIND_OR_CONTINUE(k) on luettavin ratkaisu tähän tarkoitukseen
- Poista tarkistus kokonaan — operator[] luo puuttuvan avaimen turvallisesti

#### `b11-cpp-in-place-optional` · diff 3

Koodi tekee `std::optional<BigType> o; o = BigType(args);` — kaksi konstruktiota. Tehokkaampi tapa?

- **o.emplace(args) tai std::optional<BigType> o{std::in_place, args} — rakenna paikalleen** ✓
- optional<BigType*> ja new BigType — vähemmän kopioita mutta lisää heap-allokaation
- optional ei tue in-place-luontia ollenkaan — käytä sen sijaan unique_ptr
- Kopioi BigType ensin stackille ja assignaa se sitten optionaliin

#### `b11-cpp-preincrement` · diff 1

Code review kommentoi `for (int i = 0; i < n; i++)` iterator-tyypin silmukassa. Miksi cpp-best-practices suosii `++i`?

- **Pre-increment ei kopioi iteratoria — semanttisesti oikea kun arvoa ei tarvita** ✓
- Post-increment on aina kielletty modernin C++17-standardin mukaan
- i++ on hitaampi vain tulkatuissa kielissä, C++:ssa ei koskaan eroa
- ++i pakottaa kääntäjän vektorisoimaan silmukan automaattisesti

#### `b11-cpp-shared-ptr-copy-hot` · diff 3

Funktio ottaa `std::shared_ptr<Foo>` arvona ja kutsutaan jokaisella frame:lla. Miksi tämä on ongelma?

- **shared_ptr kopioi atomista ref-countia — käytä const& tai unique_ptr tarvittaessa** ✓
- shared_ptr kopio on ilmainen — kopioi vain sisäisen pointerin
- unique_ptr ei voi välittyä funktioille millään tavalla
- shared_ptr pitää aina siirtää move:lla — const& on kielletty rajapinnassa

#### `b11-cpp-std-endl-flush` · diff 2

Hot loopissa logataan tuhansia rivejä `std::cout << x << std::endl`. Miksi suorituskyky kärsii?

- **std::endl flushaa puskurin joka kerta — käytä '\n' ilman flushia** ✓
- endl on makro joka poistuu release-buildissa automaattisesti
- cout on thread-safe joten endl ei vaikuta suorituskykyyn
- endl on nopeampi kuin '\n' koska se on lyhyempi kirjoittaa

#### `exp-cpp-perf-reserve-vector` · diff 3

Profileri näyttää tuhansia vector-uudelleenallokaatioita CSV-parserissa. Ensimmäinen optimointi?

- **reserve(estimatedSize) ennen push_back-silmukkaa** ✓
- Vaihda std::list<int> — aina nopeampi kuin vector
- Poista const correctness parserista nopeuden vuoksi
- realloc suoraan vektorin sisäiseen puskuriin

#### `perf-move` · diff 3

Milloin `std::move` on perusteltu suurille objekteille?

- **Kun et enää tarvitse lähdearvoa** ✓
- Aina jokaisessa funktiokutsussa
- const-objekteille
- Korvaa kaikki kopiot automaattisesti

#### `perf-noexcept` · diff 3

Miksi `noexcept` voi auttaa move-operaatioissa?

- noexcept poistaa kaikki poikkeukset funktiosta käännöksessä
- **Kontit voivat valita move-operaation luottavaisemmin kuin kopion** ✓
- noexcept korvaa std::move:n konttien sisäisessä logiikassa
- noexcept tekee koodista aina nopeampaa riippumatta tyypistä

#### `perf-rvo` · diff 4

Funktio palauttaa suuren `std::vector` arvona. Mikä usein välttää kopion C++17:ssä?

- std::move palautuslausekkeessa pakottaa aina siirron (RVO:n sijaan)
- **Kääntäjä voi elideä palautusarvon (RVO/NRVO) ilman std::move:a** ✓
- RVO toimii vain kun palautetaan std::vector<T> kontista
- NRVO vaatii -O3 kääntäjälipun toimiakseen standardin mukaan

### portability (11)

#### `b02-cpp-portability-stdint-11` · diff 2

Verkkoprotokolla vaatii tarkalleen 32-bittisen unsigned-arvon. Mikä tyyppi on portable?

- **std::uint32_t (<cstdint>)** ✓
- unsigned int — aina 32-bittinen
- long — riippuu alustasta
- int32_t macro omasta headerista

#### `b03-cpp-portability-fixed-width` · diff 2

Verkkoprotokolla tallentaa `uint32_t` binäärimuodossa eri alustoille. Mitä tyyppiä käytät?

- **std::uint32_t (<cstdint>) — kiinteä leveys** ✓
- unsigned int — standardi takaa aina täsmälleen 32 bittiä
- long — sama koko kaikilla alustoilla ja kääntäjillä
- size_t protokollakentässä — koko on vakio kaikkialla

#### `b04-cpp-portability-fixed-width` · diff 3

Wire-protokolla käyttää `int` ja `long` — eri alustoilla eri koko. Portable korvaaja?

- **stdint.h: int32_t, uint64_t jne. — kiinteä leveys wire-protokollassa** ✓
- short on aina 16-bit — standardi takaa saman koon kaikilla alustoilla
- sizeof(int) == 4 kaikkialla — int on portable wire-tyyppi
- long long on aina 64-bit — se korvaa int32_t ja uint64_t portablesti

#### `b06-cpp-portability-alignof` · diff 3

Serialisointi verkossa — struct padding rikkoo protokollaa eri arkkitehtuurilla. Miten tarkistat?

- **alignof ja offsetof — ymmärrä layout ennen wire-formatin määrittelyä** ✓
- Oleta että sizeof on sama kaikilla alustoilla — se riittää serialisointiin
- Käytä #pragma pack 1 ilman testausta — se takaa saman layoutin
- Lähetä struct binaarisena memcpy:llä aina — padding on sama kaikilla

#### `b07-cpp-endian-portable` · diff 4

Binääriprotokolla lukee uint32:n verkosta — arvo väärä ARM:llä. Miten C++20 auttaa?

- **C++20 std::endian + oma byteswap; C++23 std::byteswap verkkoarvoille** ✓
- reinterpret_cast uint32_t*:lla riittää endianness-käsittelyyn kaikilla alustoilla
- volatile korjaa endianness-ongelman ARM- ja x86-alustoilla automaattisesti
- Käytä float→double castia — se normalisoi byte-järjestyksen protokollassa

#### `b08-cpp-modules-headers` · diff 4

Buildi hidastuu massiivisista include-ketjuista. C++20 ratkaisu uudelle moduulille?

- **export module + import — käännä moduuli kerran, käytä import rajapinnassa** ✓
- #pragma once korvaa moduulit — include-ketju ei hidasta buildia
- PCH riittää aina — C++20-moduuleja ei tarvita uudelleenkäännöksiin
- inline kaikki headeriin — se korvaa moduulijärjestelmän

#### `b10-cpp-portability-abi-01` · diff 3

Jaetaan kirjasto Windowsin ja Linuxin välillä. Mikä rajapintavalinta parantaa ABI-vakautta?

- **Ulkoiset C-tyyliset funktiot + export-makrot — vältä STL rajapinnassa** ✓
- std::string ja std::vector suoraan DLL-exportissa — ne ovat ABI-vakaita
- Header-only aina ilman versionointia — se takaa yhteensopivuuden alustojen välillä
- inline template kaikesta julkisesta API:sta — ABI pysyy vakaana

#### `b11-cpp-std-filesystem` · diff 2

Koodi käyttää `GetFileAttributesW` / `stat()` suoraan polkujen käsittelyyn. Portable korvaaja?

- **std::filesystem (C++17) — sama API Windowsilla ja Linuxilla** ✓
- raw char* polut — POSIX on kaikkialla sama
- Macro PATH_SEP auttaa — riittää portabilityyn
- std::string path concat — korvaa kaikki FS-operaatiot

#### `b11-cpp-std-thread-port` · diff 2

Uusi moduuli käyttää suoraan `pthread_create` / `CreateThread`. Mitä cpp-best-practices suosittelee?

- **std::thread / jthread — portable C++11+ abstraktio** ✓
- pthread on standardi kaikilla alustoilla — ei tarvitse wrapperia
- fork() korvaa threadit Linuxilla
- Macro THREAD(fn) riittää portabilityyn

#### `exp-cpp-portability-byte-order` · diff 4

Verkkoprotokolla serialisoi uint32_t:n. Mikä C++17+ tapa välttää manuaaliset shift-makrot?

- Kopioi sizeof(int) suoraan wireen — nopein serialisointi
- **std::endian (C++20) + oma byteswap; C++23: std::byteswap** ✓
- Oleta little-endian — kaikki palvelimet samanlaisia
- union type punning — portable kaikilla alustoilla

#### `portability-explicit` · diff 2

Miksi yksiparametrisessä konstruktorissa kannattaa usein `explicit`?

- Implisiittinen yhden argumentin konstruktori — vähemmän boilerplatea
- **explicit-konstruktori estää hiljaiset implisiittiset muunnokset** ✓
- friend-funktio korvaa explicit-merkinnän API-rajapinnassa
- operator int() tekee tyypin käytön API-kutsuissa joustavaksi

### safety (36)

#### `b02-cpp-safety-make-unique-06` · diff 2

Tuotantokoodi käyttää `new Widget()` suoraan. Ensimmäinen turvallisuusparannus?

- **make_unique<Widget>() — yksi allokaatio, exception-safe** ✓
- malloc — vähemmän overheadia kuin make_unique
- shared_ptr aina vaikka omistajia on vain yksi
- Poista destruktorit — smart pointer hoitaa kaiken

#### `b02-cpp-safety-noexcept-05` · diff 3

Koodikatselmassa `Blob`-luokalla on move-konstruktori, joka siirtää `data_`-pointerin `std::exchange`:llä. Silti `std::vector<Blob>` kopioi elementit reallokoinnissa. Mitä move-operaattorin määrittelyyn lisätään?

- try/catch jokaisen push_back-kutsun ympärillä
- **noexcept — vector voi siirtää reallokoinnissa** ✓
- Poista move-operaattorit kokonaan — kopiointi turvallisempaa
- volatile move estää optimoinnin move-operaatiossa

#### `b03-cpp-prod-virtual-dtor` · diff 3

Tuotantobugi: `delete base_ptr` ei kutsu johdetun luokan destructoria. Mikä korjaus?

- Käytä final-luokkaa base-luokkana polymorfisessa API:ssa
- **virtual ~Base() = default polymorfiselle pohjalle** ✓
- shared_ptr korjaa ilman virtual destructoria
- Muuta delete -> free() C-tyyliseen vapautukseen

#### `b03-cpp-safety-array-span` · diff 3

Legacy-funktio ottaa `int buf[256]` ja kutsuja antaa pienemmän pinon. Miten modernisoit rajapinnan?

- **std::array<int,256> tai std::span<int> — koko mukana** ✓
- Jatka C-taulukkoa — se on nopeampi kuin std::array tässä
- Muuta int lyhyemmäksi short-tyypiksi pienentääksesi puskuria
- Lisää kommentti // caller must ensure correct buffer size

#### `b04-cpp-rule-of-five` · diff 4

Luokka hallitsee dynaamista bufferia — destructor on määritelty, mutta copy-assignment puuttuu. Tuotantobugi double-free. Periaate?

- **Rule of Five — määrittele tai =default/delete kaikki viisi special memberia** ✓
- Destructor riittää — kopio-operaattorit generoituvat automaattisesti oikein
- Käytä memcpy copy-assignmentissa nopeuttaaksesi buffer-kopiointia
- Poista destructor — smart pointer hoitaa dynaamisen bufferin hallinnan

#### `b04-cpp-smart-ptr-make-shared` · diff 2

Code review: `shared_ptr<Foo>(new Foo(), customDeleter)`. Milloin make_shared EI ole oikea vaihtoehto?

- **Custom deleter vaatii shared_ptr-konstruktorin — make_shared ei tue sitä** ✓
- make_shared on aina parempi myös custom deleterillä kuin raw new
- raw new on aina nopeampi kuin make_shared custom deleterillä
- shared_ptr ei tarvitse make_shared C++17:ssä — konstruktori riittää

#### `b04-cpp-string-view-lifetime` · diff 4

Funktio palauttaa `std::string_view` joka viittaa paikalliseen std::stringiin. Tuotannossa satunnainen data. Mikä on oikea korjaus?

- **Palauta std::string tai pidä string elossa kutsujan omistuksessa** ✓
- Muuta string_view-jäsen volatile:ksi estämään optimoinnin
- Käytä const_cast poistamaan const ja pidennä elinikää manuaalisesti
- string_view on aina turvallinen palautusarvona — bugi on muualla koodissa

#### `b05-cpp-lock-guard-incident` · diff 3

Tuotantobugi: mutex jää lukittuna poikkeuksen jälkeen. Miten estät tämän modernisti?

- **std::lock_guard tai std::scoped_lock — RAII vapauttaa mutexin poikkeuksessa** ✓
- mutex.unlock() jokaisessa catch-lohkossa käsin on moderni tapa
- Poista try-catch — poikkeukset hidastavat mutexin hallintaa
- Käytä volatile mutexia estääksesi lukon jäämisen poikkeuksen jälkeen

#### `b05-cpp-make-unique-factory` · diff 2

Tehdasfunktio luo dynaamisen olion. Miksi `std::make_unique<T>()` on parempi kuin `new T()`?

- **make_unique on exception-safe eikä vuoda raw new:ia poikkeustilanteessa** ✓
- make_unique on aina nopeampi kuin stack-allokaatio tehdasfunktiossa
- new on kielletty C++17:ssä — make_unique on pakollinen
- make_unique palauttaa raw pointerin jota ei tarvitse vapauttaa

#### `b05-cpp-noexcept-move-review` · diff 4

Code review: move-konstruktori ei ole noexcept. `std::vector` resize hidastuu. Miksi?

- **Ilman noexcept move vector käyttää copy-fallbackia exception safety -syistä** ✓
- noexcept on vain dokumentaatiota — ei vaikuta vectorin resizeen
- Vector ei koskaan käytä move-operaatiota elementtien siirrossa
- noexcept hidastaa move-operaatiota aina — vältä sitä tuotannossa

#### `b05-cpp-string-view-lifetime` · diff 4

Funktio palauttaa `std::string_view` paikallisesta `std::string`:stä. Tuotannossa segfault. Mikä on juurisyy?

- **string_view ei omista dataa — viittaus tuhoutuneeseen stringiin segfaultaa** ✓
- string_view on aina kopio stringistä — elinkaari on itsenäinen
- Segfault johtuu aina multithreadingista, ei string_view:n elinkaaresta
- string_view vaatii shared_ptr:n turvalliseen palautukseen funktiosta

#### `b06-cpp-raii-scope-guard` · diff 3

Funktio avaa tiedoston ja pitää sulkea poikkeuksessa. Miten toteutat ilman try-finally?

- **RAII — std::ifstream tai custom scope guard sulkee tiedoston destructorissa** ✓
- close() jokaisessa return-polussa käsin on turvallisin tapa
- Älä käytä poikkeuksia tiedostofunktioissa — se korvaa RAII:n
- fork uusi prosessi tiedoston avaamiseen välttääksesi try-finally-tarpeen

#### `b06-cpp-span-heap-buffer` · diff 4

API ottaa raw pointer ja pituus — buffer overrun tuotannossa. Miten modernisoida turvallisesti?

- **std::span<T> — kantaa pituuden mukana ja rajaa buffer-käytön turvallisesti** ✓
- Käytä char* ilman pituutta — kutsuja vastaa buffer overrun -riskistä
- Vain std::vector kelpaa — span on turha modernissa C++-API:ssa
- Lisää magic number bufferin alkuun tunnistaaksesi ylivuodon

#### `b06-cpp-vector-emplace-back` · diff 3

Rakennat vektorin monimutkaisia olioita — push_back kopioi turhaan. Miten optimoit?

- **emplace_back rakentaa alkion inplace — vähemmän turhia kopioita** ✓
- push_back on aina nopeampi kuin emplace_back monimutkaisille olioille
- Käytä reserve ja sitten at — se korvaa emplace_back-optimoinnin
- Lisää olio ensin stackille ja push_back — se vähentää kopioita

#### `b06-cpp-weak-ptr-cycle` · diff 4

Kaksi objekti jakaa shared_ptr toisiinsa — muisti ei vapaudu. Mikä ratkaisu rikkoo syklin?

- **Yksi suunta weak_ptr — shared_ptr sykli estyy** ✓
- Käytä raw pointer molemmissa suunnissa
- Lisää shared_ptr count manuaalisesti
- Käytä unique_ptr molemmissa — sama ongelma

#### `b07-cpp-optional-null-api` · diff 2

Hakufunktio palauttaa -1 kun avainta ei löydy — kutsujat sekoittavat virheen ja validin arvon. Parempi API?

- **std::optional<T> — arvo tai tyhjä ilman magic number -sentinel-arvoja** ✓
- Palauta 0 virheessä — kutsujat erottavat sen validista arvosta
- Heitä poikkeus jokaisesta missistä — se on kevyin lookup-API
- Globaali errno riittää ilmaisemaan puuttuvan arvon tyypitetysti

#### `b07-cpp-span-bounds-check` · diff 3

Funktio ottaa (T* data, size_t len) — tuotannossa buffer overflow. Mikä moderni tyyppi auttaa?

- **std::span<T> kantaa pointerin ja pituuden yhdessä API-rajapinnassa** ✓
- void* riittää aina — kutsija vastaa bufferin koon hallinnasta
- std::vector& vaatii aina datan kopioimisen funktiokutsussa
- span omistaa datan automaattisesti kuten std::vector omistaa elementit

#### `b08-cpp-span-bounds` · diff 3

Code review: funktio ottaa `std::span<int>` ja indeksoi ilman tarkistusta — tuotannossa buffer overflow. Mikä on moderni turvallinen tapa?

- **Tarkista size() ennen operator[] — span ei bounds-checkaa automaattisesti** ✓
- span estää yli rajojen menon kääntäjässä operator[]-kutsussa
- Muuta span takaisin raakaan pointeriin — se on turvallisempi indeksoinnissa
- volatile indeksi korjaa optimoinnin joka aiheuttaa buffer overflowin

#### `b08-cpp-unique-ptr-deleter` · diff 4

FILE* pitää sulkea fclose:lla — unique_ptr<void> ei riitä. Miten mallinnet oikein?

- **unique_ptr<FILE, decltype(&fclose)> fp(f, &fclose) — RAII FILE:lle** ✓
- shared_ptr FILE:lle ilman deleteria — oletusdelete sulkee tiedoston
- new/delete FILE:lle on oikea tapa hallita C-stdio-resurssia
- unique_ptr ilman custom deleteria kutsuu fclose automaattisesti

#### `b09-cpp-enable-shared-from-this` · diff 4

Async callback tarvitsee `shared_ptr`:n `this`:stä, mutta `shared_ptr(this)` kaataa ohjelman. Oikea pattern?

- **Peri enable_shared_from_this ja käytä shared_from_this() async-callbackissa** ✓
- shared_ptr(this) on turvallinen kun objekti on jo shared_ptr:ssä
- weak_ptr(this) korvaa shared_ptr:n callbackin elinkaaren hallintaan
- Käytä raw this callbackissa — se on nopeampi kuin shared_from_this

#### `b09-cpp-optional-null-api` · diff 3

API palauttaa `nullptr` kun arvoa ei löydy — kutsujat unohtavat tarkistaa. Miten ilmaiset puuttuvan arvon tyypillisesti?

- **std::optional<T> — arvo tai tyhjä ilman magic sentinel -arvoja API:ssa** ✓
- Palauta -1 virheen merkiksi — kutsujat erottavat sen validista arvosta
- Heitä poikkeus jokaisessa lookupissa — se on kevyin tapa ilmaista miss
- Globaali last_error muuttuja korvaa optionalin tyypitetyn puuttuvan arvon

#### `b09-cpp-raw-pointer-refactor` · diff 3

Legacy-moduuli palauttaa `new`-allokoituja olioita kutsujalle. Refaktoroinnin turvallisin ensiaskele?

- **Korvaa unique_ptr omistuksella — selkeä elinkaari ilman manuaalista deleteä** ✓
- Lisää kommentti 'caller must delete' — se estää muistivuodot
- shared_ptr kaikille — se on aina turvallisin yksinomistuksen korvaaja
- Jätä raw pointer — toimii tuotannossa eikä vaadi refaktorointia

#### `b09-cpp-span-bounds-check` · diff 4

Tuotantobugi: buffer overflow C-tyylisessä `char*` API:ssa. Moderni korvaava tyyppi rajattuun näkymään?

- **std::span kantaa pituuden mukana — non-owning näkymä rajattuun bufferiin** ✓
- std::string_view kaikille byte-buffereille — se korvaa spanin aina
- volatile char* estää buffer overflowin C-tyylisessä API:ssa
- malloc + strlen riittää — erillinen size-parametri on turha

#### `exp-cpp-prod-asan-build` · diff 3

Muistivuoto epäilty tuotannossa. Mitä CI-buildia pyydät ensin ennen tuotantokokeilua?

- **AddressSanitizer CI/debug-buildissä ennen tuotantokokeilua** ✓
- Optimoi -O3 ja toivo että vuoto häviää
- Poista assertit nopeuden vuoksi ennen profilointia
- printf-debuggaus riittää muistivuotojen paikantamiseen

#### `exp-cpp-prod-span-buffer` · diff 4

Tuotantobugi: funktio ottaa `(uint8_t* data, size_t len)` ja lukee yli puskurin. Miten rajapinta turvataan C++20-tyylillä?

- **std::span<const uint8_t> — koko kulkee mukana** ✓
- Lisää assert(len > 0) ja toivo parasta
- Muuta data int*:ksi — helpompi indeksoida
- Käytä malloc + manuaalista free:tä kutsujassa

#### `exp-cpp-prod-weak-ptr-cache` · diff 4

Jaettu image-cache käyttää `shared_ptr`. Objektit eivät vapaudu vaikka UI sulkeutuu. Mikä omistusmalli auttaa?

- **Cache tallentaa weak_ptr:n ja tarkistaa lock() ennen käyttöä** ✓
- Vaihda kaikki shared_ptr takaisin raw new/delete -pariin
- shared_ptr::reset() globaalisti UI:n destructorissa riittää
- volatile shared_ptr estää referenssien jäämisen eloon

#### `safety-avoid-c-array` · diff 2

Miksi cpp-best-practices suosittelee välttämään `T[N]`-taulukoita rajapinnoissa?

- **C-taulukko API:ssa ei kuljeta kokoa — yli/aliraja on helppo** ✓
- T[N] on aina hitaampi kuin std::vector samalla datalla
- C-taulukko ei voi sijaita stack-muistissa lainkaan
- C-taulukko ei tue const-merkintää elementeissä

#### `safety-const-member` · diff 2

Miten `const` jäsenmuuttujat auttavat turvallisuudessa?

- **const-jäsen estää vahingossa tilan muuttamisen kääntäjässä** ✓
- const-jäsen tekee luokasta aina nopeamman kuin ilman constia
- const-jäsen korvaa mutexin thread-safe -suunnittelussa
- const-jäsen pakottaa objektin heap-allokaatioon aina

#### `safety-exceptions` · diff 2

Miksi poikkeus voi olla parempi kuin virhekoodi joka voidaan ignoroida?

- **Virhettä ei voi hiljaa ohittaa** ✓
- Poikkeukset ovat aina hitaampia
- Virhekoodi pakottaa try-catchin
- Poikkeus ei voi kulkea pinossa

#### `safety-make-shared` · diff 3

Miksi `std::make_shared<T>(args)` on parempi kuin `shared_ptr<T>(new T(args))`?

- shared_ptr<T>(new T) on aina turvallisempi kuin make_shared
- **make_shared yhdistää objektin ja control blockin yhteen allokaatioon** ✓
- make_shared estää custom deleterin käytön kokonaan
- raw new + shared_ptr on nopeampi kuin make_shared monisäikeisessä

#### `safety-rule-of-zero` · diff 3

Mitä Rule of Zero tarkoittaa?

- **Älä kirjoita destructor/copy/move itse jos RAII-jäsenet hoitavat resurssit** ✓
- Nollaa kaikki osoittimet manuaalisesti jokaisessa metodissa
- Käytä malloc/free RAII:n sijaan — vähemmän abstraktiota
- Poista konstruktorit kokonaan — default ei riitä koskaan

#### `safety-shared-ptr` · diff 3

Milloin `std::shared_ptr` on perusteltu `unique_ptr`:n sijaan?

- shared_ptr on aina parempi kuin unique_ptr yleiskäytössä
- **Useampi omistaja jakaa resurssin elinkaaren — atomilaskuri** ✓
- shared_ptr on nopein omistajuusmalli yksittäiselle omistajalle
- shared_ptr poistaa tarpeen delete-kutsulle — ei tarvita deleteriä

#### `safety-static-cast` · diff 2

Miksi `(int)x` on huonompi kuin `static_cast<int>(x)`?

- C-cast on aina nopeampi kuin static_cast tuotantokäännöksessä
- static_cast toimii vain polymorfisten osoitintyyppien kanssa
- **C++-castit on helpompi grepata ja ne rajaavat cast-tyypin** ✓
- Käytännössä ei eroa — valitse kumpi tahansa tyyli projektissa

#### `safety-unique-ptr` · diff 2

Mikä korvaa turvallisesti `new`/`delete`-parin yksittäiselle omistajalle?

- malloc/free -pari ilman RAII:ta — eksplisiittinen vapautus
- **std::unique_ptr yhdistettynä make_unique-factoryyn** ✓
- raw new ilman deleteä hot pathissa — vähemmän overheadia
- volatile T* estää kääntäjän optimoimasta osoitinvirheitä

#### `safety-variadic` · diff 3

Mikä on turvallinen vaihtoehto omalle C-tyyliselle variadiselle funktiolle?

- printf-tyylinen C-vararg on turvallisin kun formaatti on vakio
- **Variadic template tai std::format parametrisoi tyyppiturvallisesti** ✓
- va_list + vsnprintf riittää modernissa C++-rajapinnassa
- Macro __VA_ARGS__ korvaa tarpeen tyypitettyihin argumentteihin

#### `safety-vector` · diff 2

Mikä on moderni korvike dynaamiselle `int[]`-taulukolle?

- **std::vector<int>** ✓
- int* + manuaalinen new[]
- shared_ptr taulukolle
- C-style VLA

### style (28)

#### `b02-cpp-style-consteval-04` · diff 4

Konfiguraatiovakio pitää laskea compile-time — runtime-laskenta hidastaa käynnistystä. C++20-vaihtoehto constexpr:lle?

- **consteval pakottaa evaluoinnin käännösaikana** ✓
- volatile const int — estää optimoinnin vakiossa
- constexpr riittää aina runtime-laskentaan
- Macro #define korvaa constevalin konfiguraatiossa

#### `b02-cpp-style-override-03` · diff 2

Mikä merkintä pakottaa kääntäjän varmistamaan, että aliluokan metodi todella ylikirjoittaa base-metodin?

- virtual avainsana riittää — override on redundantti
- **override — kääntäjä varmistaa base-funktion olemassaolon** ✓
- final korvaa override-merkinnän aliluokissa
- using namespace std korjaa Draw/draw-kirjoitusvirheen

#### `b03-cpp-cr-override-keyword` · diff 2

Johdettu luokka ylikirjoittaa `virtual void draw()` mutta kirjoittaa `void draw()` ilman overridea. Riski?

- **Kääntäjä ei varoita jos signatuuri hieman eri — piilotettu bugi** ✓
- override-avainsana hidastaa virtuaalikutsun suoritusaikaa
- override on pakollinen kaikissa C++11-luokissa aina
- Ilman overridea kutsutaan aina perusluokan versiota ajossa

#### `b03-cpp-style-explicit-ctor` · diff 2

Luokka `Meters(int v)` aiheuttaa vahingossa `double d = 3.5; Meters m = d;`. Miten estät?

- **explicit Meters(int v) — estää implisiittiset muunnokset** ✓
- Lisää operator int() palautuksessa selkeyttämään muunnosta
- Muuta parametrityyppi int:stä long:ksi estämään muunnoksen
- Poista constructor kokonaan ja käytä tehdasfunktiota Metersille

#### `b04-cpp-explicit-constructor` · diff 3

Bugi: `void foo(Bytes b); foo(1024);` kääntyy — 1024 muuntuu Bytes:ksi implisiittisesti. Korjaus?

- **explicit Bytes(size_t) — estää implisiittiset muunnokset kutsukohdassa** ✓
- Poista konstruktori ja käytä factory-funktiota Bytes-olion luontiin
- Lisää operator int() Bytes-luokkaan helpottamaan numeerisia kutsuja
- Muuta parametri double:ksi — se estää kokonaisluvun implisiittisen muunnoksen

#### `b04-cpp-init-list-initializer` · diff 2

Code review: `int x = 3.9;` kääntyy hiljaa — reviewer ehdottaa `int x{3.9};`. Miksi?

- **Brace-init {} estää kapean muunnoksen (narrowing)** ✓
- Sulkeet korjaavat most vexing parse -ongelman tässä
- Sulkeet ovat vanhentuneet C++17:ssä
- Vain std::vector saa käyttää {}
- Kääntäjä vaatii aaltosulut

#### `b05-cpp-const-method-api` · diff 2

Getter-metodi ei muuta olion tilaa. Miten ilmaiset sen API:ssa?

- **Merkitse metodi const — kutsuja voi kutsua sitä const-olioilla** ✓
- Lisää kommentti // read-only getterin yläpuolelle API-dokumentaatioon
- Palauta kopio aina — const-metodia ei tarvita gettereissä
- Käytä friend-funktiota getterin sijaan ilmaistaksesi read-only-käytön

#### `b05-cpp-init-list-brace` · diff 2

Code review: `std::vector<int> v(10, 1)` vs `std::vector<int> v{10, 1}`. Mitä jälkimmäinen tekee?

- **Luo vektorin kahdella alkiolla: 10 ja 1** ✓
- Luo 10 alkiota arvolla 1
- Kääntäjävirhe — sulkeet eivät toimi vectorille
- Sama kuin (10, 1) aina

#### `b05-cpp-override-virtual-crash` · diff 3

Aliluokan virtuaalinen metodi ei koskaan kutsuta — kirjoitusvirhe parametrilistassa. Miten estät?

- **override-avainsana — kääntäjä varoittaa jos base-signatuuri ei täsmää** ✓
- virtual riittää aina — override on turha modernissa C++:ssa
- final korvaa override:n periytymisessä ja estää kirjoitusvirheet
- Käytä makroa DECLARE_VIRTUAL piilotettujen override-virheiden estoon

#### `b06-cpp-attributes-fallthrough` · diff 2

Switch-case putoaa vahingossa seuraavaan caseen — bugi löytyy viiveellä. Miten dokumentoit tarkoituksellinen putoaminen?

- **[[fallthrough]] attribuutti — kääntäjä ja lukija ymmärtävät tarkoituksellisen putoamisen** ✓
- Tyhjä case ilman break on aina bugi — fallthrough ei ole sallittu C++:ssa
- goto next_case on moderni tapa dokumentoida switch-case putoaminen
- Kommentti // intentional riittää kääntäjälle estämään fallthrough-varoituksen

#### `b06-cpp-default-member-init` · diff 2

Konstruktorit unohtavat alustaa member-kentät — satunnaiset arvot. Miten vähennät virheitä?

- **Default member initializer luokassa — kentät alustuvat automaattisesti** ✓
- Jätä kaikki nollaksi memset:llä konstruktorin alussa
- Käytä globaaleja oletusarvoja jäsenten alustamiseen luokassa
- Älä alusta — nollat ovat turvalliset aina kaikille jäsenkentille

#### `b07-cpp-enum-class-scoped` · diff 2

Vanha enum Color { Red, Green } törmää toisen headerin Red-vakioiden kanssa. Moderni korjaus?

- **enum class Color { Red, Green } — scoped enum estää vuodon globaaliin nimiavaruuteen** ✓
- #define Red 0 korvaa enumin ja estää nimikonfliktit header-tiedostoissa
- typedef int Color on moderni korvaaja enumille ilman nimiavaruusongelmia
- Vanha enum on deprecated C++17:ssä — enum class ei ole tuettu

#### `b07-cpp-nodiscard-error` · diff 2

Kutsuja ignooraa bool validate() paluuarvon — bugi tuotannossa. Miten pakota tarkistus?

- **[[nodiscard]] funktiolle — kääntäjä varoittaa ignooratusta paluuarvosta** ✓
- Muuta paluutyyppi voidiksi — kutsuja muistaa tarkistaa virheen
- Kommentti // must check estää paluuarvon unohtamisen käännöksessä
- Heitä poikkeus aina — se korvaa nodiscard-tarkistuksen

#### `b09-cpp-delete-copy-semantics` · diff 3

Luokka hallitsee yksilöllistä resurssia — kopio ei saa olla mahdollinen. Miten ilmaiset API:ssa?

- **= delete copy constructor ja copy assignment — selkeä compile error** ✓
- Private copy-operaattorit riittävät — ulkopuolinen koodi ei pääse kopioimaan
- Kommentti 'do not copy' estää kopioinnin käännösaikana
- Muuta kaikki jäsenet mutable — se estää luokan kopioinnin

#### `b09-cpp-enum-class-type` · diff 2

Code review: `enum Color { RED, GREEN }` sekoittuu toisen `enum Status { RED }` kanssa. Korjaus?

- **enum class — vahvasti tyypitetty, ei implisiittistä int-muunnosta** ✓
- Prefixaa arvot COLOR_RED — se estää nimikonfliktit toisen enumin kanssa
- #define RED 0 korvaa enumin ja ratkaisee namespace-sotkun
- Plain enum on deprecated C++17:ssä — käytä int-tyyppiä ja kommentteja

#### `b11-cpp-braces-required` · diff 2

PR lisää yksirivisen if:n ilman aaltosulkuja ennen toista riviä. Miksi cpp-best-practices vaatii `{}`?

- **Ilman sulkuja myöhempi rivi voi jäädä if:n ulkopuolelle — helppo semanttinen bugi** ✓
- Aaltosulut hidastavat käännöstä merkittävästi
- Vain while-silmukoissa tarvitaan sulut — if riittää ilman
- clang-format lisää sulut automaattisesti ajossa — ei tarvitse kirjoittaa

#### `b11-cpp-clang-format-style` · diff 1

Code review täyttyy väittelyistä sijoittelusta ja rivipituudesta. Miten cpp-best-practices ratkaisee tyyliriidat?

- **.clang-format + automaattinen formatointi — yksi jaettu tyyli** ✓
- Jokainen kehittäjä säilyttää oman indent-tyylinsä
- Poista kaikki tyhjät rivit — vähemmän diffiä
- Käytä tabeja ja välilyöntejä sekaisin joustavuuden vuoksi

#### `b11-cpp-local-include-quotes` · diff 2

Projektin oma header includataan `#include <MyWidget.hpp>`. Mitä cpp-best-practices suosittelee?

- **#include "MyWidget.hpp" paikallisille — <> järjestelmä/SDK-headereille** ✓
- <> on aina nopeampi kääntäjän include-haussa kuin lainausmerkit
- Käytä aina <> jotta include-polku pysyy lyhyempänä projektissa
- Include-tyyppi ei vaikuta käännökseen, linkitykseen tai paketointiin

#### `b11-cpp-out-of-source-build` · diff 2

CMake generoi object-tiedostot samaan hakemistoon kuin lähdekoodi. Mitä cpp-best-practices suosittelee?

- **Out-of-source build — erillinen build/ hakemisto lähteen vierestä** ✓
- Sekoita .o-tiedostot src/:n kanssa helpompaa clean:ia varten
- Commitoi build-artifaktit gitiin nopeampaa CI:tä varten
- Generoidut tiedostot samaan kansioon — helpompi debugata

#### `b11-cpp-underscore-identifier` · diff 2

Uusi globaali funktio nimetään `_init_app()`. Miksi cpp-best-practices varoittaa alaviivasta alussa?

- **Tunnisteet _-alkuisina ovat varattuja implementaatiolle — törmäysriski** ✓
- Alaviiva alussa tekee funktiosta automaattisesti staticin tiedostossa
- Vain luokan jäsenissä kielletty — globaaleissa nimissä sallittu
- C++20 kieltää kaikki alaviivat kaikista tunnisteista kokonaan

#### `b11-cpp-using-namespace-header` · diff 2

Uusi header alkaa `using namespace std;` ja includataan kymmenessä moduulissa. Mikä riski?

- **Namespace pollution ja nimiristiriidat kaikissa includereissa — älä käytä headerissa** ✓
- using namespace std headerissa nopeuttaa käännöstä kaikissa includereissa
- Se on pakollinen C++17:ssä, muuten std::string ei toimi headerissa
- using namespace std headerissa estää ADL:n toimimasta oikein

#### `exp-cpp-cr-default-delete` · diff 3

Luokka hallitsee tiedostonkuvaajaa eikä saa kopioida eikä siirtää. Mikä C++11-merkintä kieltää copy-operaation selkeästi kääntäjälle?

- **= delete copy-operaatioille — intentti näkyy kääntäjälle** ✓
- = delete tekee luokasta automaattisesti nopeamman
- private copy riittää aina — linkkeri estää käytön
- = delete korvaa move-operaation tarpeen kokonaan

#### `exp-cpp-cr-enum-class-switch` · diff 2

Code review: switch-case käyttää `enum Status { OK, FAIL }` ilman scopea. Miksi reviewer pyytää muutosta?

- **enum class estää implisiittiset int-muunnokset ja nimikonfliktit** ✓
- Unscoped enum on kielletty C++17-standardissa kokonaan
- enum class on aina 64-bittinen kaikilla alustoilla
- switch-lause ei toimi enum class -tyypin kanssa

#### `style-const-ref` · diff 1

Miten vältät turhan `std::string`-kopioinnin funktioparametrissa?

- **const std::string&** ✓
- std::string kopiona aina
- char* ilman constia
- volatile std::string

#### `style-final-override` · diff 3

Luokka ei ole tarkoitettu perittäväksi mutta sisältää virtual-metodeja. Mitä käytät?

- **final luokalle tai virtual-metodille estää ylikirjoituksen** ✓
- private konstruktori estää perinnön aina ilman finalia
- static-metodit korvaavat final-merkinnän tarpeen
- #pragma once estää luokan perinnän header-tasolla

#### `style-override` · diff 2

Johdettu luokka ylikirjoittaa virtual-metodin, mutta kirjoitusvirhe signatuurissa ei kaada käännöstä. Mitä C++11-avainsanaa lisäät?

- **override varmistaa kääntäjällä että virtual-metodi ylikirjoitetaan** ✓
- virtual avainsana metodin alussa riittää — override on redundantti
- final korvaa override-merkinnän kaikissa aliluokissa
- using Base::foo; tuo automaattisesti oikean ylikirjoituksen

#### `style-pass-int` · diff 2

Miten yksinkertainen `int` kannattaa välittää konstruktorille?

- const int&-viittauksena — välttää kopioinnin myös primitiiveissä
- **By-value parametrina: explicit MyClass(int value)** ✓
- int*-osoittimena jotta kutsuja voi muuttaa alkuperäistä arvoa
- std::shared_ptr<int> jakamaan omistajuuden konstruktorin kanssa

#### `tools-enum-class` · diff 2

Miksi `enum class` on parempi kuin vanha C-tyylinen `enum`?

- **enum class rajaa arvot tyyppiin — ei vuoda globaaliin namespaceen** ✓
- Perinteinen enum riittää kun nimet etuliitteellä (RED_COLOR)
- #define RED 1 välttää nimiristiriidat header-tiedostoissa
- namespace { enum Color } on sama kuin enum class ilman class-sanaa

### threadability (18)

#### `b02-cpp-thread-atomic-order-13` · diff 5

Laskuri kasvaa useasta säikeestä — `atomic<int>++` riittääkö ilman memory_order?

- **seq_cst on oletus — relaxed vain jos semantiikka sallii** ✓
- atomic ei tarvitse memory_orderia koskaan
- volatile int riittää usean säikeen laskuriin
- mutex jokaiselle incrementille — aina turvallisin

#### `b02-cpp-thread-scoped-lock-12` · diff 4

Funktio lukitsee kaksi mutexia — riski deadlockille. C++17-ratkaisu?

- lock(m1); lock(m2) manuaalisesti samassa järjestyksessä
- **scoped_lock(m1, m2) — atomisesti oikeassa järjestyksessä** ✓
- volatile mutex estää deadlockin ilman lukitusta
- sleep ennen lockia — satunnainen viive ratkaisee

#### `b03-cpp-thread-atomic-flag` · diff 3

Yksinkertainen shutdown-flag jaettiin bool:lla ilman synkronointia — satunnainen jumi. Ratkaisu?

- **std::atomic<bool> tai atomic_flag — memory ordering mukana** ✓
- volatile bool riittää aina yksinkertaiseen shutdown-flagiin
- Globaali mutex jokaiselle lukemiselle — raskas yhdelle flagille
- sleep(1) ennen lukemista varmistaakseen flagin päivittymisen

#### `b03-cpp-thread-mutex-order` · diff 4

Deadlock kahdessa mutexissa: thread A lukitsee m1→m2, thread B m2→m1. Miten estät?

- **Lukitse aina samassa järjestyksessä tai käytä std::scoped_lock molempiin** ✓
- Vaihda molemmat mutexit spinlock-tyyppisiksi vähentämään odotusaikaa
- Käytä std::recursive_mutex:ia molemmissa uudelleenlukittavuuden vuoksi
- Lisää satunnainen sleep() kummankin säikeen toisen lukituksen eteen

#### `b04-cpp-lock-guard-deadlock` · diff 4

Kaksi mutexia lukitaan eri järjestyksessä kahdessa säikeessä — satunnainen deadlock. Mikä standardiratkaisu auttaa?

- **std::lock(m1, m2) + std::lock_guard adopt_lock — lukitsee atomisesti** ✓
- sleep(100) ennen toista lukitusta kummassakin säikeessä
- Käytä try_lock silmukassa ikuisesti kunnes molemmat vapautuvat
- Yksi globaali mutex kaikelle datalle koko sovelluksessa

#### `b04-cpp-static-local-thread` · diff 3

Funktion sisällä `static Logger log;` — useat säikeet kirjoittavat lokille. C++11 jälkeen static local init?

- **Static local init on thread-safe (magic statics) — Logger tarvitsee synkan** ✓
- Static local on aina data race useassa säikeessä C++11:ssä
- Static local on kielletty useassa säikeessä — käytä globaalia
- volatile static riittää turvalliseen alustukseen useassa säikeessä

#### `b05-cpp-atomic-counter` · diff 3

Usea säie päivittää jaettua laskuria. Mikä primitiivi on oikea ilman mutexia yksinkertaiseen incrementiin?

- **std::atomic<int> — lock-free increment mahdollinen yksinkertaiseen laskuriin** ✓
- volatile int riittää aina säieturvalliseen increment-operaatioon
- static int + kommentti // thread-safe korvaa atomicin yksinkertaisissa tapauksissa
- bool flag + busy-wait on moderni tapa jaettuun laskuriin ilman mutexia

#### `b06-cpp-packaged-task` · diff 4

Worker-thread ajaa funktion ja palauttaa tuloksen kutsijalle. Mitä käytät future-pohjaisesti?

- **std::packaged_task + std::future — tulos threadin ulkopuolelle turvallisesti** ✓
- Globaali muuttuja tulokseen — mutex riittää future-pohjaiseen palautukseen
- volatile int status-kenttä korvaa packaged_task:n worker-threadissä
- sleep polling loop on suositeltu tapa odottaa worker-threadin tulosta

#### `b07-cpp-atomic-acquire-release` · diff 5

Lock-free jonossa tuottaja kirjoittaa datan ja asettaa flagin — kuluttaja näkee vanhaa dataa. Mikä memory order?

- **Tuottaja store release, kuluttaja load acquire — synkronoi datan näkyvyyden** ✓
- memory_order_relaxed riittää lock-free jonossa datan julkaisuun ja lukemiseen
- volatile int flag korvaa acquire-release-parin jonossa
- std::mutex on aina hitaampi — älä käytä sitä atomicien rinnalla

#### `b08-cpp-atomic-memory-order` · diff 5

Laskuri kasvaa useassa säikeessä — atomic<int> riittää, mutta luku ei näy heti toisessa CPU:ssa. Mikä voi auttaa?

- **memory_order_release/acquire tai seq_cst — ymmärrä visibility tarpeen mukaan** ✓
- volatile int korvaa std::atomicin säieturvalliseen laskuriin
- memory_order_relaxed estää kaikki race conditionit laskurissa
- Mutex ei koskaan tarvita std::atomic<int>:n rinnalla incrementissä

#### `b08-cpp-shared-mutex-read` · diff 4

Konfiguraatiocache: lukijoita paljon, kirjoittajia harvoin — std::mutex hidastaa turhaan. Parempi primitiivi?

- **std::shared_mutex — shared_lock lukijoille, unique_lock kirjoittajalle** ✓
- Yksi std::mutex kaikille — se on nopein read-heavy cacheen
- std::atomic riittää monimutkaisen map-konfiguraation päivitykseen
- spinlock on aina parempi kuin shared_mutex lukupainotteisessa cachessa

#### `b09-cpp-condition-variable-wait` · diff 4

Worker-säie odottaa queuea — spurious wakeup aiheuttaa tyhjän pop:in. Oikea wait-pattern?

- **wait(lock, predicate) — tarkista ehto uudelleen spurious wakeupin jälkeen** ✓
- sleep(1) pollaa queuea — se korvaa condition_variable::wait-patternin
- wait ilman predikaattia riittää — spurious wakeup ei tapahdu std::cv:ssä
- busy-wait on tehokkaampi tuotannossa kuin condition_variable worker-säikeessä

#### `b11-cpp-avoid-global-state` · diff 3

Moduulissa on `static std::map<int, User> g_cache` ja useat säikeet kutsuvat sitä. Ensimmäinen refaktorointi?

- **Vähennä globaalia tilaa — injektoi riippuvuus tai suojaa mutexilla** ✓
- Lisää volatile g_cache:n eteen — säikeet näkevät päivitykset
- Siirrä map toiseen .cpp-tiedostoon — thread safety ratkeaa
- Käytä singletonia ilman lukitusta — yksi instanssi riittää

#### `b11-cpp-mutex-mutable-rule` · diff 4

const-metodi päivittää cachea mutta tarvitsee mutexin. Mitä cpp-best-practices M&M-sääntö tarkoittaa?

- **mutable jäsen + mutex yhdessä — mutex itse mutable jotta const-metodi voi lukita** ✓
- Poista const metodista kokonaan — mutex vaatii aina ei-const metodin
- volatile-määre mutexille korvaa mutable+mutex -yhdistelmän kokonaan
- const-metodi ei saa koskaan käyttää mutexia edes mutable-jäsenen kautta

#### `exp-cpp-thread-once-flag` · diff 4

Singleton alustetaan lazy-initillä useasta säikeestä. Mikä standardikomponentti takaa kertaluonteisen alustuksen?

- **std::call_once + std::once_flag** ✓
- static bool initialized ilman mutexia
- sleep(1) ennen ensimmäistä käyttöä
- volatile static pointer riittää

#### `thread-atomic` · diff 3

Miten jaat yksinkertaisen laskurin säikeiden välillä turvallisesti?

- **std::atomic<int>** ✓
- volatile int
- static int ilman suojaa
- float double

#### `thread-data-race` · diff 4

Kaksi säiettä kirjoittaa samaan `int`-muuttujaan ilman synkronointia. Mitä C++ standardi sanoo?

- **Data race → undefined behavior** ✓
- Viimeisin kirjoitus voittaa aina määritellysti
- int on aina atomisesti turvallinen
- Vain debug-build havaitsee

#### `thread-lock-guard` · diff 3

Mikä on turvallisin tapa lukita `std::mutex` lyhyeksi kriittiseksi alueeksi?

- mutex.lock() ja unlock() erikseen — selkeämpi kuin RAII-lukitus
- **std::lock_guard tai unique_lock vapauttaa lukon poikkeuksissa** ✓
- std::atomic korvaa mutexin kun jaettu data on yksi int
- volatile mutex-jäsen estää data racen ilman erillistä lukitusta

### tools (32)

#### `b02-cpp-tools-concepts-02` · diff 4

Template-funktio `sortLike(T& a, T& b)` kaatuu outoihin virheisiin väärillä tyypeillä. C++20-ratkaisu rajapintaan?

- static_assert(false) jokaisessa template-funktiossa
- **concept std::totally_ordered rajaamaan template-parametri T** ✓
- void* parametri ja castaus funktion sisällä
- Kommentti // only numbers — dokumentaatio riittää

#### `b02-cpp-tools-raii-01` · diff 2

Code reviewissa funktio luo `new Database()` ja palauttaa raakaa osoitinta. Mikä moderni omistusmalli estää vuodon poikkeuspolulla?

- shared_ptr kaikille stack-olioille — yhtenäinen tyyli
- **unique_ptr<Database> — RAII vapauttaa poikkeuspolulla** ✓
- raw new ilman deletea — kutsuja vastaa eliniästä
- malloc + free C++-luokan sisällä — tuttu C-API

#### `b03-cpp-incident-sanitize-ubsan` · diff 4

Tuotantoon pääsee signed overflow -bugi vain tietyllä ARM-buildilla. CI-parannus?

- **Ota UBSan/ASan debug-buildiin ja -fsanitize=undefined testeihin** ✓
- Vain x86-buildi tuotantoon — ARM-alusta poistetaan CI-matriisista
- Poista signed integerit kokonaan ja käytä vain unsigned-tyyppejä
- Luota pelkkään code reviewhun ilman automatisoitua CI-tarkistusta

#### `b03-cpp-tools-if-constexpr` · diff 3

Template-funktio tarvitsee eri haaran integraalisille vs float-tyypeille compile-time. Mitä käytät?

- **if constexpr — haara poistuu instanssoinnissa** ✓
- Runtime if + typeid jokaisella kutsulla — tarkistus tapahtuu ajossa
- Macro #ifdef INTEGRAL_ONLY ehdollistamaan molemmat koodihaarat
- dynamic_cast templatessa erottamaan integraaliset ja float-tyypit

#### `b04-cpp-concept-constraints` · diff 4

Generinen funktio `template<typename T> void sort(T& c)` kaatuu outoihin virheviesteihin kun T on custom-tyyppi. Miten rajaat template-parametrin luettavaksi?

- **C++20 concepts: template<std::ranges::sortable R> tai requires-lause** ✓
- static_assert(false) funktion alussa jokaiselle template-tyypille
- Kommentti // T must be sortable funktion määrittelyn yläpuolella
- Käytä void*-parametria ja castaa oikeaan tyyppiin funktion sisällä

#### `b05-cpp-constexpr-config` · diff 3

Konfiguraatiovakiot lasketaan build-ajassa. Mikä avainsana varmistaa että laskenta tapahtuu käännösaikana?

- **constexpr — compile-time arvo kun laskenta voidaan evaluoida käännöksessä** ✓
- const tarkoittaa aina compile-time-vakiota C++17:ssä
- static tekee arvosta automaattisesti compile-time-laskettavan
- volatile estää optimoinnin ja varmistaa compile-time-laskennan

#### `b05-cpp-lambda-capture-review` · diff 2

Code reviewissa lambda kaappaa ulkoisen muuttujan arvolla `[x]` mutta x muuttuu silmukan jälkeen. Mikä on turvallisin korjaus?

- **Kaappaa [&] vain jos elinkaari varma, muuten kopioi arvo [x] tai [=]** ✓
- Käytä aina [=] — se on turvallisin capture-tyyli kaikissa tilanteissa
- Muuta lambda globaaliksi funktioksi välttääksesi capture-ongelmat
- Poista capture ja käytä globaalia muuttujaa lambda-silmukan sisällä

#### `b06-cpp-deleted-function` · diff 3

Luokka ei saa kopioida — kopio-konstruktori kutsuu vahingossa. Miten estät käännösaikana?

- **= delete kopio-operaattoreille — kutsu aiheuttaa compile errorin** ✓
- Jätä kopio-operaattorit private ja toivo ettei kukaan käytä niitä
- Käytä #pragma once estääksesi kopio-konstruktorin kutsumisen
- Merkitse luokka final — se estää kopioinnin käännösaikana

#### `b06-cpp-enum-class-scope` · diff 2

Code reviewissa `enum Color { Red, Green };` aiheuttaa nimikonfliktit headerissa. Miten korjaat modernisti?

- **enum class Color { Red, Green }; — scoped enum estää implisiittiset konversiot** ✓
- Lisää makro #define Red 0 — se ratkaisee nimikonfliktit headerissa
- Siirrä enum namespacein ulkopuolelle välttääksesi nimiristiriidat
- Käytä int-tyyppiä ja kommentteja enum-arvojen sijaan headerissa

#### `b06-cpp-nodiscard-return` · diff 3

Tuotantobugi: `allocateBuffer()` palautusarvo jätetään huomiotta ja resurssi vuotaa. Miten varoitat kutsijaa?

- **[[nodiscard]] attribuutti funktion paluuarvossa varoittaa kutsujaa** ✓
- Palauta void ja käytä globaalia muuttujaa resurssin hallintaan
- Lisää kommentti // remember to check funktion yläpuolelle
- Käytä assert() funktion sisällä varoittaaksesi paluuarvon huomiotta jättämisestä

#### `b07-cpp-chrono-literals` · diff 3

Timeout on koodissa sleep(500) — yksikkö epäselvä. Miten std::chrono ilmaisee 500 millisekuntia?

- **500ms chrono-literalilla — using namespace std::chrono_literals** ✓
- 500 std::chrono::seconds ilmaisee 500 millisekuntia tyypitetysti
- 500 * 1000 nanoseconds käsin — se on chrono:n suositeltu tapa
- chrono ei tue millisekunteja — käytä raw sleep()-kutsua

#### `b07-cpp-perfect-forwarding` · diff 4

Tehdasfunktio make<T>(Args&&... args) välittää argumentit konstruktorille. Mikä idiomi säilyttää value categoryn?

- **std::forward<Args>(args)... säilyttää lvalue/rvalue — perfect forwarding** ✓
- std::move kaikille argumenteille säilyttää value categoryn tehdasfunktiossa
- Kopioi args vektoriin ensin — se säilyttää forwarding-semantiikan
- Käytä Args& ilman && — se riittää perfect forwardingiin

#### `b07-cpp-spaceship-operator` · diff 3

Luokalle tarvitaan ==, !=, <, <=, >, >= — paljon boilerplatea. C++20 lyhennys?

- **auto operator<=>(const T&) const = default — three-way comparison C++20:ssä** ✓
- Kirjoita kaikki vertailuoperaattorit käsin — default ei generoi niitä
- memcmp structille riittää — se korvaa operator<=> turvallisesti
- operator< riittää — muut vertailut johdetaan automaattisesti C++03-tyylillä

#### `b07-cpp-unique-ptr-deleter` · diff 2

RAII-wrapper hallitsee C-API:n FILE*-pointteria. Miksi std::unique_ptr custom deleter on parempi kuin raw delete?

- **unique_ptr kutsuu fclose deleterissä — poikkeuksessa handle ei jää auki** ✓
- Raw delete toimii FILE*-pointterille samoin kuin malloc-allokaatiolle
- shared_ptr on aina pakollinen C-API-resurssien hallintaan C++:ssa
- unique_ptr ei tue custom deleteriä — vain oletusdelete on mahdollinen

#### `b08-cpp-initializer-list-trap` · diff 4

Funktio `void f(std::array<int, 3>)` — kutsu `f({1,2,3})` käännyy, mutta `auto x = {1,2,3}; f(x);` ei. Miksi?

- **auto x = {1,2,3} on initializer_list — sitä ei voi välittää array-parametrille** ✓
- auto ei tue listoja C++11:ssä — brace-init vaatii eksplisiittisen tyypin
- auto deduoi aina std::vector<int>:ksi brace-init listasta
- Kääntäjävirhe — f(x) pitäisi toimia kun f ottaa std::array<int,3>

#### `b08-cpp-optional-monadic` · diff 3

Ketju: optional palauttaa arvon, seuraava funktio ottaa arvon — if-linnoja tulee liikaa. C++23-tyylinen tapa?

- **optional::and_then / transform — monadinen ketjutus ilman if-pesäkkeitä** ✓
- operator* aina ilman tarkistusta — tyhjä optional on turvallinen
- optional ei tue ketjutusta — vain if (opt) toimii C++17:ssä
- Muunna nullptr optionaliksi — se korvaa and_then-ketjutuksen

#### `b08-cpp-sort-requirements` · diff 3

std::sort kaatuu outoon virheeseen custom-iteratorilla. Mitä iteratorin pitää tarjota sortille?

- **RandomAccessIterator — std::sort vaatii O(1) etäisyyden elementtien välillä** ✓
- Mikä tahansa forward iterator riittää std::sort-algoritmille
- std::sort toimii vain std::vectorilla — muut kontit eivät tueta
- Input iterator riittää kun vertailuoperaattori on määritelty

#### `b08-cpp-variant-visit` · diff 4

std::variant<int, string> — switch-tyylinen käsittely ilman visitor-luokkaa. Moderni tapa?

- **std::visit + overloadattu lambda-setti käsittelee jokaisen alternative-tyypin** ✓
- std::get<int> riittää kun aktiivinen tyyppi vaihtelee ajonaikaisesti
- dynamic_cast std::variant-olioon valitsee oikean haaran kuten perinnössä
- C-tyylinen union korvaa variantin kun tyypit mahtuvat samaan muistiin

#### `b09-cpp-clang-tidy-review` · diff 2

Code reviewissa toistuu sama raw-pointer-anti-pattern. Miten automatisoidaan palaute ennen ihmisreviewia?

- **clang-tidy checkit CI:hin — modernize- ja bugprone-säännöt ennen reviewia** ✓
- Lisää README:hen 'älä käytä raw pointereita' — se korvaa automaation
- Vain senior reviewaa kaikki PR:t — automaatio ei löydä anti-patterneja
- Poista varoitukset -w-flagilla — CI pysyy vihreänä ilman tarkistuksia

#### `b09-cpp-sanitizer-ci-failure` · diff 3

CI-putki kaatuu yöllä AddressSanitizer-virheeseen, mutta paikallinen release-build menee läpi. Mitä ehdotat ensimmäiseksi?

- **Aja sama build ASan/UBSan-flageilla paikallisesti — reprodukoi ennen mergeä** ✓
- Poista sanitizer CI:stä — hidastaa liikaa ja ei löydä oikeita bugeja
- Muuta release-build optimoimaan ASan-virhe pois — se on nopein korjaus
- Ignoroi ASan-raportti — se on vain kehitystyökalu, ei tuotanto-ongelma

#### `b11-cpp-ccache-ci` · diff 2

CI-build kestää 40 min vaikka vain yksi .cpp muuttui. Mitä cpp-best-practices suosittelee käännösten välimuistiin?

- **ccache (tai clcache MSVC:lle) — välimuistaa käännöstulokset** ✓
- Poista -O2 nopeuttaaksesi CI:tä
- Käännä vain headerit uudelleen — .cpp:t jätetään pois
- Siirrä koko build tmp-hakemistoon ilman välimuistia

#### `b11-cpp-compile-commands` · diff 2

clang-tidy ei löydä oikeita include-polkuja CMake-projektissa. Mitä build-asetusta tarvitaan?

- **CMAKE_EXPORT_COMPILE_COMMANDS=ON — compile_commands.json LLVM-työkaluille** ✓
- Poista kaikki -I-polut ja anna clang-tidyn arvata
- Kopioi CMakeLists.txt manuaalisesti jokaiseen .cpp-tiedostoon
- Käytä vain MSVC:tä — se ei tarvitse compile databasea

#### `b11-cpp-iwyu-cleanup` · diff 3

PR:ssä jokainen header vetää mukaan `<iostream>` vaikka käytetään vain `std::vector`. Miten automatisoidaan siivous?

- **include-what-you-use (IWYU) — ehdottaa poistettavia ja puuttuvia headereita** ✓
- Lisää `-w` kääntäjään piilottaaksesi kaikki include-varoitukset
- Siirrä kaikki #include-rivit yhteen jaettuun master-headeriin
- Käytä using namespace std jokaisessa headerissa includejen sijaan

#### `b11-cpp-pch-tradeoff` · diff 4

Iso C++-projekti harkitsee precompiled headereita (PCH). Mitä cpp-best-practices varoittaa?

- **PCH nopeuttaa buildia mutta voi piilottaa header-riippuvuusvirheitä — testaa myös ilman PCH:ä** ✓
- PCH on täysin portable kaikille kääntäjille ja alustoille ilman kompromisseja
- PCH korvaa IWYU:n kokonaan — yksittäiset includet eivät enää merkitse
- PCH-tiedostot ovat aina pieniä ja turvallista lisätä versionhallintaan

#### `b11-cpp-werror-policy` · diff 3

Tiimi haluaa ettei uusia varoituksia päädy main-haaraan. Mikä käytäntö vastaa cpp-best-practices -suositusta?

- **Treat warnings as errors (-Werror / /WX) CI:ssä alusta alkaen** ✓
- Korjaa kertyneet varoitukset vasta ennen major-releaseä
- Poista -Wall kokonaan käännösnopeuden parantamiseksi
- Jokainen kehittäjä valitsee itse omat warning-flagit projektissa

#### `exp-cpp-cr-optional-review` · diff 3

Code reviewissa kollega palauttaa `T*` joka voi olla null. Mikä moderni tyyppi tekee tyhjän arvon eksplisiittiseksi ilman raw-osoitinta?

- **std::optional<T> ilmaisee puuttuvan arvon ilman null-osoitinta** ✓
- volatile T* tekee null-arvon näkyväksi API-rajapinnassa
- shared_ptr<T> stack-olioille — yksinkertaisin malli
- int flag + T* erikseen — riittää kun dokumentoidaan

#### `exp-cpp-prod-chrono-timeout` · diff 3

API-kutsu tarvitsee 500 ms timeoutin. Miten ilmaiset ajan modernisti ilman magic-numeroita?

- sleep(500) olettaa sekunteja — timeout-bugeja helposti
- **std::chrono::milliseconds(500) tai 500ms-literal** ✓
- 500 * CLOCKS_PER_SEC ilman yksikkökommenttia
- double seconds = 0.5 — yksikkö jää kutsujan vastuulle

#### `tools-auto` · diff 1

Mitä `auto` tekee modernissa C++:ssa?

- **Kääntäjä päättelee tyypin alustuslausekkeesta (type deduction)** ✓
- Muuttuja rekisteröityy automaattisesti globaaliksi näkyvyydellä
- Kaikki auto-muuttujat normalisoidaan int-tyypiksi käännöksessä
- Korvaa typedef/using-alias -määritykset lähdekoodissa kokonaan

#### `tools-constexpr` · diff 3

Haluat laskea taulukon koon käännösaikana ilman makroja. Mitä funktio-avainsanaa käytät?

- **constexpr funktio voi laskea arvon käännösaikana const-argumenteilla** ✓
- constexpr pakottaa funktion inline assembly -muotoon
- constexpr funktio ei voi koskaan heittää poikkeusta
- constexpr korvaa kaikki #define-makrot automaattisesti

#### `tools-nullptr` · diff 1

Mikä on turvallisin tapa nollata osoitin C++11:ssä?

- **nullptr** ✓
- NULL
- 0
- (void*)0

#### `tools-structured-bindings` · diff 3

C++17: miten purat `std::map`-iteratorin avain/arvo-pairin siististi?

- **for (const auto& [key, value] : map)** ✓
- for (auto p : map) käytä p.first aina
- Vain boost::tie
- structured bindings toimii vain tupleille

#### `tools-using-alias` · diff 2

Miksi `using StringMap = std::map<std::string, int>` on usein parempi kuin typedef?

- **using on template-aliasille luettavampi kuin typedef** ✓
- using kääntyy aina nopeammin kuin typedef samalla koneella
- typedef ei toimi C++11:ssä template-tyypeille
- using tekee aliaksesta automaattisesti constexpr-tyypin

## docker (108)

### docker (56)

#### `b02-docker-exec-debug-04` · diff 2

Containerissa shell puuttuu mutta prosessi elää — miten debuggaat sisältä?

- **docker exec avaa shellin konttiin tai debug-sidecar distroless:lle** ✓
- docker attach avaa uuden interaktiivisen shellin jokaiseen prosessiin
- ssh localhost pääsee kontin namespaceen ilman docker exec -komentoa
- docker rm -f korjaa puuttuvan shellin kontin sisällä debuggausta varten

#### `b02-docker-prune-05` · diff 2

Levy täynnä vanhoja imageja ja stopped containereita. Turvallinen siivous?

- **docker system prune poistaa käyttämättömät imaget ja containerit** ✓
- rm -rf /var/lib/docker on turvallinen tapa poistaa vanhat stopped containerit
- Poista vain running containerit vapauttaaksesi levytilaa vanhoista imageista
- Levyn formatointi on nopein tapa siivota vanhoja Docker-imageja hostilla

#### `b02-docker-run-limit-02` · diff 3

Yksi container syö koko hostin RAM:in — OOM killaa muita. Rajoitus?

- **docker run --memory 512m --cpus 1.0 rajoittaa resurssikäytön** ✓
- Docker rajaa resurssit automaattisesti ilman eksplisiittisiä lippuja
- cgroups v1 manuaalinen konfigurointi on ainoa tuettu rajoitustapa Dockerissa
- restart=always estää kontin kuluttamasta kaiken hostin RAM:in yöllä

#### `b02-docker-run-user-01` · diff 3

Containeri ajaa rootina tuotannossa — audit finding. Ensimmäinen hardening?

- **docker run --user nonroot tai USER-Dockerfilessa non-rootille** ✓
- --privileged vähentää kontin käyttäjän vaikutuksia host-turvallisuuteen
- Ajetaan palvelu suoraan hostilla kontin sijaan auditin jälkeen tuotannossa
- chmod 777 / antaa non-root-käyttäjälle tarvittavat oikeudet kontin sisällä

#### `b03-docker-buildkit-cache-mount` · diff 4

npm ci kestää 5 min jokaisessa buildissa vaikka package-lock ei muutu. BuildKit-parannus?

- **RUN --mount=type=cache,target=/root/.npm npm ci — cache mount** ✓
- COPY node_modules hostista
- Poista package-lock
- docker build --no-cache nopeuttaa

#### `b03-docker-copy-vs-add` · diff 2

Code review ehdottaa ADD-komentoa, joka hakee tarballin URL:sta Dockerfile-buildissa. Mikä ongelma tässä on, ja mitä Dockerfile-komentoa käytät sen sijaan?

- **COPY on eksplisiittinen — ADD tekee automaattista purkua/URL:ia** ✓
- ADD on aina nopeampi
- COPY ei toimi binääritiedostoille
- ADD on pakollinen multi-stage buildissa

#### `b03-docker-entrypoint-cmd` · diff 3

`docker run myimage bash` ei käynnistä bashia odotetusti, vaikka CMD Dockerfilessa on `['node','server.js']`. Mikä Dockerfile-käytäntö selittää tämän?

- **ENTRYPOINT on pääkomento, CMD on oletusargumentit — exec-form selkeyttää** ✓
- CMD korvaa aina ENTRYPOINTin
- Vain yksi niistä sallittu
- shell-form on identtinen exec-formin kanssa

#### `b03-docker-secrets-compose` · diff 4

DB-salasana on compose-tiedoston environment-osiossa gitissä. Parempi tapa?

- **Docker secrets / ulkoinen secret store — ei plaintext repossa** ✓
- Base64 encode environmentissa
- Salasana Dockerfile ARG:ssa
- Commit .env tuotantoon

#### `b04-docker-build-arg` · diff 3

Sama Dockerfile eri versioille — BASE_IMAGE vaihtelee CI:ssä. Miten parametrisoit?

- **ARG BASE_IMAGE + docker build --build-arg BASE_IMAGE=...** ✓
- sed Dockerfile ennen buildia aina
- ENV BASE_IMAGE — sama kuin ARG
- Kopioi Dockerfile kolmeen versioon

#### `b04-docker-compose-profile` · diff 3

Kehityksessä tarvitaan debug-työkalukontti, tuotannossa ei. Compose-malli?

- **profiles: [debug] palvelulle — aktivoitu docker compose --profile debug** ✓
- Erillinen compose-tiedosto aina — ei muita tapoja
- scale=0 tuotannossa
- Kommentoi palvelu pois gitissä

#### `b04-docker-copy-from-container` · diff 2

Tuotantokontista pitää hakea crash-dump tiedosto hostille. Toimenpide?

- **docker cp kontti:/path/dump ./local/** ✓
- docker export kontti > dump
- volume mount jälkikäteen ilman rebuild
- cat dump | ssh host

#### `b04-docker-exec-interactive` · diff 2

Kontissa pitää debugata konfig-tiedostoa interaktiivisesti. Komento?

- **docker exec -it kontti /bin/sh** ✓
- docker attach kontti — aina uusi shell
- docker cp kontti:/ — koko fs
- docker pause && docker logs

#### `b04-docker-health-interval` · diff 3

Healthcheck merkitsee kontin unhealthy liian myöhään — 5 min outage. Mitä säätää?

- **HEALTHCHECK --interval ja --timeout — tiheämpi tarkistus** ✓
- Poista healthcheck — nopeampi
- restart: no
- Vain CMD ilman intervalia riittää

#### `b04-docker-log-driver` · diff 3

Konttilokit katoavat rebootin jälkeen — oletus json-file kasvaa loputtomasti. Tuotanto-asetus?

- **logging driver esim. journald/json-file max-size & max-file tai centralized driver** ✓
- printf debug — ei lokitusta
- docker logs riittää persistenssiin
- Loki vain stdout hostille ilman configia

#### `b04-docker-prune-dangling` · diff 2

Levy täynnä `<none>` image-tageja CI-koneella. Siivouskomento?

- **docker image prune tai docker system prune -f** ✓
- rm -rf /var/lib/docker manuaalisesti ensin
- docker rmi -f $(docker ps -q)
- Ei voi siivota — uusi levy

#### `b04-docker-secrets-env` · diff 4

Tuotanto: salasanat ENV-muuttujina Dockerfile:ssa. Turvallisempi Compose/Swarm tapa?

- **secrets mount tiedostona /run/secrets/ — ei image layerissa** ✓
- ARG salasana buildissa — ok tuotantoon
- ENV salasana .env tiedostossa gitissä
- echo salasana Dockerfile RUN:issa

#### `b04-docker-security-cap-drop` · diff 4

Security review: kontti ei tarvitse root-oikeuksia eikä NET_RAW. Hardening?

- **USER nonroot + cap_drop: [ALL] ja cap_add vain tarvittavat** ✓
- privileged: true nopeuteen
- Vain --read-only riittää
- Root on turvallinen kontissa

#### `b05-docker-healthcheck-prod` · diff 3

Orkestraattori ei huomaa jumiutunutta Node-prosessia — kontti on 'running' mutta ei vastaa. Lisäät?

- **HEALTHCHECK curl localhost /health endpointiin** ✓
- Vain EXPOSE 3000 riittää
- restart: unless-stopped korvaa healthcheckin
- docker logs riittää monitorointiin

#### `b05-docker-log-driver-json` · diff 2

Konttilokit katoavat rebootissa. Miten varmistat lokien keräyksen?

- **Logging driver (json-file + log rotation) tai ulkoinen driver kuten fluentd** ✓
- docker logs tallentaa pysyvästi automaattisesti
- stdout ei tarvitse konfiguraatiota
- Vain exec tail -f kontissa

#### `b05-docker-security-cap-drop` · diff 4

Minimoit konttioikeudet — tarvitset vain verkon, ei kernel-muutoksia. Mitä compose-asetusta käytät?

- **cap_drop: ALL + cap_add vain tarvittavat** ✓
- --privileged nopeuttaa kehitystä
- security_opt: seccomp:unconfined tuotantoon
- Capabilities eivät vaikuta kontteihin

#### `b05-docker-security-nonroot` · diff 4

Security review: kontti ajaa rootina. Mikä on Dockerin suositus tuotantoon?

- **USER non-root — luo käyttäjä Dockerfilessa** ✓
- Root on turvallinen kontissa koska eristetty
- chmod 777 korjaa oikeudet
- Vain --privileged estää root-ongelmat

#### `b06-docker-build-context-size` · diff 3

docker build lähettää gigatavun node_modules kontekstissa. Miten estät?

- **.dockerignore sulkee tarpeettomat tiedostot pois build-kontekstista** ✓
- COPY . . on aina optimaalinen tapa lähettää koko projekti buildiin
- docker build --no-cache poistaa ylimääräiset tiedostot build-kontekstista
- Multi-stage build poistaa tarpeen .dockerignore-tiedostolle kokonaan

#### `b06-docker-build-target` · diff 3

Multi-stage Dockerfile — haluat buildaa vain test-stage CI:ssä. Miten?

- **docker build --target test-stage valitsee vain halutun multi-stage-vaiheen** ✓
- docker build ajaa aina kaikki Dockerfile-staget riippumatta CI-tarpeesta
- --target toimii vain docker compose build -komennossa, ei docker buildissa
- FROM test AS final pakottaa buildin pysähtymään test-stageen automaattisesti

#### `b06-docker-compose-env-file` · diff 2

Salaisuudet compose-pinoon — ei hardcode yamlissa. Miten injektoit?

- **env_file tai secrets erottaa salaisuudet yamlista ulkoiseen tiedostoon** ✓
- environment: DB_PASS=secret yamlissa on turvallinen tapa injektoida salaisuudet
- COPY .env imageen build-vaiheessa on suositeltu salaisuuksien hallintatapa
- docker run -e korvaa compose-salaisuudet — env_file ei toimi compose-pinoissa

#### `b06-docker-compose-healthcheck` · diff 3

Compose-pino käynnistää riippuvat palvelut ennen kuin API on valmis. Mitä lisätä serviceen?

- **healthcheck + depends_on condition odottaa palvelun healthy-tilan ennen käynnistystä** ✓
- restart: always varmistaa että riippuvat palvelut odottavat toisiaan
- links-kenttä korvaa healthcheckin palveluiden käynnistysjärjestyksessä
- sleep 30 entrypoint-skriptissä on vakiokäytäntö riippuvuuksien synkronointiin

#### `b06-docker-logging-rotation` · diff 3

Konttilokit täyttävät levyn — json-file driver kasvaa rajatta. Miten rajoitat?

- **log driver opts max-size ja max-file rajaavat json-file -lokien kasvua** ✓
- docker logs --tail poistaa vanhat lokit levyltä automaattisesti
- journald-driver ei tarvitse lokikiertoa — se hallitsee kokoa itsestään
- Kontin restart tyhjentää json-file -lokit ja vapauttaa levytilaa

#### `b06-docker-run-init` · diff 3

Kontissa zombie-prosessit kasaantuvat — parent ei siivoa child-prosesseja. Mitä run-optiota?

- **--init käynnistää tini-init-prosessin joka siivoaa zombie-prosessit** ✓
- --privileged antaa init-prosessille oikeudet siivota zombie-prosessit
- --restart always käynnistää kontin uudelleen kun zombiet kasaantuvat
- PID 1 on aina dockerd joka hoitaa child-prosessien siivouksen automaattisesti

#### `b06-docker-run-memory-swap` · diff 4

Kontti OOM-killaa mutta swap näyttää vapaana. Miten rajoitat memory+swap yhdessä?

- **Määritä --memory ja --memory-swap yhdessä rajoittaaksesi RAM:n ja swapin** ✓
- --cpus rajoittaa muistinkäytön ja estää OOM-killauksen kontissa
- Swap on oletuksena pois päältä kontissa — erillistä rajaa ei tarvita
- docker update päivittää vain CPU-rajoituksia — muisti vaatii uuden buildin

#### `b07-docker-buildkit-cache` · diff 3

CI-buildit ovat hitaita vaikka Dockerfile on optimoitu. BuildKit-ominaisuus joka auttaa?

- **RUN --mount=type=cache säilyttää npm/go mod -cachen buildien välillä CI:ssä** ✓
- docker build --no-cache nopeuttaa CI-buildia poistamalla vanhat layerit
- Poista multi-stage — yksi stage nopeuttaa BuildKit-cachea merkittävästi
- BuildKit ei tue cachea — vain per-layer cache toimii Dockerfile-buildissa

#### `b07-docker-copy-chown` · diff 4

Non-root user ei voi kirjoittaa /app/logs — permission denied tuotannossa. Dockerfile-korjaus?

- **COPY --chown=user:group tai RUN chown ennen USER-vaihtoa korjaa omistajuuden** ✓
- RUN chmod 777 /app/logs antaa non-root-käyttäjälle kirjoitusoikeuden turvallisesti
- Aja sovellus rootina — se on suositeltu tapa korjata permission denied -virhe
- Poista logs-kansio imagesta — sovellus kirjoittaa lokit stdoutiin automaattisesti

#### `b07-docker-exec-debug` · diff 2

Kontti pyörii mutta HTTP ei vastaa — haluat shellin sisälle debugata. Komento?

- **docker exec -it container_name /bin/sh avaa interaktiivisen shellin elävään konttiin** ✓
- docker run uudelleen ilman portteja korvaa exec:in debug-tarkoituksessa
- docker kill container_name on ensimmäinen askel HTTP-ongelman debuggauksessa
- docker logs riittää aina — shelliä ei tarvita kontin sisäiseen diagnostiikkaan

#### `b07-docker-healthcheck` · diff 3

Orchestrator merkitsee palvelun healthy vaikka app kaatui. Mitä Dockerfileen?

- **HEALTHCHECK testaa sovelluksen endpointia — ei pelkkää prosessin olemassaoloa** ✓
- EXPOSE-portti riittää orkestraattorille healthy-tilan määrittämiseen
- CMD echo ok varmistaa että sovellus vastaa HTTP-pyyntöihin oikein
- HEALTHCHECK on deprecated — orkestraattorit käyttävät vain restart-politiikkaa

#### `b07-docker-image-digest` · diff 4

Tuotantoon deployattiin eri image kuin testissä — tag liikkui. Miten lukitset version?

- **Deploy image digest @sha256:... — tag ei takaa identtistä image-sisältöä** ✓
- latest-tag on turvallisin tapa lukita tuotantoversio deployissa
- docker pull riittää varmistamaan saman image-sisällön testissä ja tuotannossa
- Digest on vain metadata — tag riittää version lukitsemiseen tuotantoon

#### `b08-docker-buildkit-cache` · diff 3

CI-buildit ovat hitaita — BuildKit on päällä mutta cache ei jaeta jobien välillä. Ratkaisu?

- **Registry cache backend buildx:llä — cache-to ja cache-from jakaa cachen CI-jobien välillä** ✓
- Poista BuildKit — legacy builder jakaa cachen luotettavammin CI-runnerilla
- docker build --no-cache nopeuttaa CI-buildia käyttämällä jaettua cachea
- BuildKit cache toimii vain samassa kontissa — CI-jobien välinen jako ei onnistu

#### `b08-docker-compose-override` · diff 2

Paikallinen dev ylikirjoittaa portit ilman muutosta git-trackattuun compose.yaml:iin. Tiedosto?

- **docker-compose.override.yaml yhdistetään automaattisesti paikallisiin dev-muutoksiin** ✓
- compose.prod.yaml latautuu automaattisesti ilman -f-flagia dev-ympäristössä
- Override-tiedosto vaatii erillisen merge-komennon ennen compose up -ajoa
- Portteja ei voi ylikirjoittaa ilman compose.yaml-tiedoston kopioimista

#### `b08-docker-compose-profiles` · diff 2

Compose-tiedostossa debug-työkalut halutaan vain kehityksessä — ei tuotantodeployssa. Ominaisuus?

- **profiles: [debug] — käynnistä valinnaiset palvelut komennolla compose --profile debug** ✓
- Kommentoi debug-palvelut pois yaml-tiedostosta ennen jokaista tuotantodeploya
- depends_on piilottaa debug-palvelut tuotannosta ilman erillistä profile-kenttää
- profiles toimii vain Docker Swarm -klusterissa — ei standalone compose:ssa

#### `b08-docker-compose-watch` · diff 3

Dev: lähdekoodimuutos pitäisi synkata konttiin ilman rebuildia joka kerta. Compose Watch?

- **develop.watch sync — compose watch synkkaa tiedostot ja voi restartata palvelun** ✓
- Volume mount korvaa compose watch -ominaisuuden kaikissa dev-skenaarioissa
- compose watch toimii vain Docker Swarm -klusterissa, ei standalone compose:ssa
- docker compose up rebuildaa automaattisesti jokaisen tiedostotallennuksen yhteydessä

#### `b08-docker-exec-user` · diff 3

Debuggaat konttia ja haluat ajaa shellin tietyllä käyttäjällä. Mitä optiota käytät?

- **docker exec -it --user app myapp sh (tai --user root tarvittaessa)** ✓
- Dockerfile USER riittää — exec noudattaa sitä automaattisesti aina
- --privileged vaihtaa exec-käyttäjän Dockerfile USER -asetukseen
- docker run --user app korvaa exec-debugin käynnissä olevassa kontissa

#### `b08-docker-prune-build-cache` · diff 2

Build-serverin levy täynnä vanhoja kerroksia. Turvallinen siivous?

- **docker builder prune poistaa käyttämättömän build-cachen turvallisesti** ✓
- docker rmi -f $(docker images -q) poistaa vain build-cachen, ei imageja
- rm -rf /var/lib/docker on turvallinen tapa siivota vanhat build-layerit
- Prune poistaa käynnissä olevat kontit ja niiden build-cachen samalla

#### `b08-docker-scan-image` · diff 3

CI putki — haluat skannata imagen CVE:t ennen deploya. Työkalu ekosysteemissä?

- **docker scout cve tai Trivy/Snyk-integraatio skannaa imagen CVE:t ennen deploya** ✓
- docker ps näyttää imagen CVE-listan ja haavoittuvuudet suoraan ajossa
- Image-skannaus rikkoo buildin turhaan — sitä ei kannata CI-putkeen lisätä
- Vain base image tarvitsee skannauksen — sovelluslayerit eivät sisällä CVE:itä

#### `b08-dockerfile-arg-env` · diff 3

Build-time versio build-argilla — runtime config erikseen. Ero ARG vs ENV?

- **ARG on voimassa vain build-vaiheessa — ENV jää imageen runtime-käyttöön** ✓
- ARG ja ENV ovat identtiset — molemmat säilyvät final imagessa runtimeen
- ENV-muuttujat eivät näy kontin ympäristössä ajonaikaisesti
- ARG säilyy aina final imagessa samalla tavalla kuin ENV runtime-konfigina

#### `b09-docker-cmd-entrypoint` · diff 3

Kontti ajaa ensin migraatiot, sitten sovelluksen, ja deploy haluaa ylikirjoittaa vain sovelluksen argumentit (ei migraatiovaihetta). Miten jaat Dockerfile-komennot?

- **ENTRYPOINT wrapper-skripti + CMD app-args — CMD on oletusparametrit entrypointille** ✓
- CMD ja ENTRYPOINT ovat identtiset — molemmat korvataan helposti docker run:lla
- Vain RUN-komento voi ajaa skriptejä Dockerfilessa ennen kontin käynnistystä
- ENTRYPOINT ei voi olla shell-form — vain exec-form on tuettu Dockerfilessa

#### `b09-docker-env-secrets-smell` · diff 4

Code review: DATABASE_PASSWORD Dockerfile ENV:ssä. Miksi tämä on ongelma?

- **ENV jää image-layeriin — salaisuus näkyy docker history -komennolla** ✓
- ENV on turvallisin tapa salata salaisuudet Dockerfile-buildissa
- Salasana Dockerfile ENV:ssä on OK kun git-repo on private
- Vain EXPOSE-portti on turvallisuusongelma — ENV-salaisuudet ovat turvallisia

#### `b09-docker-image-tag-pin` · diff 3

Tuotanto käyttää `FROM node:latest` — eilen build rikkoutui. Korjaus?

- **Pin digest tai semver-tag (node:20.11-alpine) — toistettava ja vakaa build** ✓
- latest-tag on tuorein ja turvallisin valinta tuotannon base imageen
- Poista FROM-rivi ja käytä scratch-basea — se korvaa version kiinnittämisen
- Base image -tag ei vaikuta build-tulokseen — versio on merkityksetön

#### `b09-docker-secrets-mount` · diff 4

Tuotanto-Compose tarvitsee TLS-sertin ilman salaisuuden leimimistä imageen. Ratkaisu?

- **Docker secrets tai read-only bind mount runtime-tiedostosta/vaultista TLS-sertille** ✓
- COPY cert.pem Dockerfileen on turvallisin tapa toimittaa TLS-sertti tuotantoon
- ENV CERT=$(cat cert.pem) injektoi sertin turvallisesti ilman image-layeria
- Salaisuudet private git-branchissa korvaavat runtime-secrets-mekanismin

#### `docker-compose-network` · diff 4

Compose-projektissa palvelut eivät näe toisiaan. Yleisin konfiguraatiovirhe?

- **Palvelut on liitetty eri verkkoon tai networks-kenttä on väärin määritelty** ✓
- Puuttuva FROM-rivi Dockerfilessa eristää palvelut eri verkkoihin toisistaan
- compose.yml:n timezone-asetus estää palveluiden näkymisen toisilleen verkossa
- Liian pieni SHM-jako rikkoo palveluiden välisen DNS-resoluution compose-projektissa

#### `docker-exit-code` · diff 4

Kontti poistuu heti käynnistyksen jälkeen. Ensimmäinen diagnosoitava asia?

- **PID 1 -prosessi päättyy heti kun se daemonisoituu taustalle** ✓
- Väärä Docker Hub -tag estää kontin pysymisen käynnissä käynnistyksen jälkeen
- restart: always käynnistää kontin uudelleen vaikka pääprosessi on jo päättynyt
- overlay-verkon puuttuminen sulkee kontin heti käynnistyksen jälkeen automaattisesti

#### `docker-healthcheck` · diff 4

Orkestraattori käynnistää uuden kontin ennen vanhan poistoa. Mikä Dockerfile-ominaisuus auttaa?

- **HEALTHCHECK kertoo orkestraattorille kun probe-komento onnistuu** ✓
- EXPOSE varmistaa terveyden ennen load balancerin liikenteen ohjausta kontille
- CMD sleep infinity pitää kontin healthy-tilassa orkestraattorin näkökulmasta
- restart: always ohittaa terveystarkistuksen käynnistyksen yhteydessä orkestroinnissa

#### `docker-layer-cache` · diff 3

Docker build on hidas. Mikä Dockerfile-järjestys hyödyntää layer cachea parhaiten?

- **Riippuvuudet ennen lähdekoodia hyödyntää layer cachea parhaiten buildissa** ✓
- COPY . . heti alussa invalidoi vain viimeisen layerin Dockerfile-buildissa
- Yksi iso RUN-komento optimoi cachea vähentämällä layer-määrää merkittävästi
- Layer cache ei vaikuta Dockerfile-rakennuksen nopeuteen merkittävästi lainkaan

#### `docker-multistage` · diff 4

Tuotantoimage on 2 GB koska mukana kääntäjä ja dev-työkalut. Ratkaisu?

- **Multi-stage build kopioi vain binäärin viimeiseen runtime-stageen** ✓
- docker commit manuaalisesti poistaa build-työkalut imagesta tuotantoversiossa
- Suurempi levytila palvelimella pienentää image-kokoa automaattisesti buildissa
- ENTRYPOINT:in poistaminen vähentää image-kokoa merkittävästi tuotantoon

#### `docker-readonly-rootfs` · diff 5

Haluat rajoittaa kontin kirjoituksia levylle turvallisuussyistä. Mikä käynnistysasetus?

- **docker run --read-only tmpfs-mounteilla tarvittaviin kirjoituspolkuihin** ✓
- --privileged rajoittaa filesystem-kirjoituksia turvallisemmin kuin read-only
- USER root nopeuttaa kirjoituksia ja vähentää latenssia turvallisuusarvioinnissa
- bridge-verkko estää kontin kirjoittamasta hostin levylle turvallisuussyistä

#### `docker-volume-persist` · diff 3

Kontin tietokanta katoaa `docker rm` jälkeen. Miten data säilyy oikein?

- **Named volume tai bind mount** ✓
- Kirjoita vain konttien writable layeriin
- Käytä --rm ilman volumea
- Tallenna vain imageen commitilla

#### `exp-docker-build-cache` · diff 4

CI-buildit ovat hitaita — jokainen layer invalidoituu kun package.json muuttuu. Mitä Dockerfile-järjestystä muutat?

- **Kopioi package.json ensin, npm install, vasta sitten lähdekoodi** ✓
- COPY . . heti Dockerfilen alussa hyödyntää layer cachea parhaiten
- --no-cache poistaa cache-ongelman hidastamalla jokaista buildiä pysyvästi
- Kaikki RUN-komennot yhdelle riville parantaa cache-invalidaatiota CI:ssä

#### `exp-docker-prod-healthcheck` · diff 3

Load balancer lähettää liikenteen kontille joka on jumissa. Miten Docker tunnistaa unhealthy-tilan?

- **HEALTHCHECK tai --health-cmd testaa readinessin säännöllisesti** ✓
- Exit code 0 riittää varmistamaan että palvelu vastaa pyyntöihin oikein
- docker ps CPU-sarake riittää unhealthy-tilan tunnistamiseen load balancerissa
- Healthcheck on käytettävissä vain Docker Swarm -ympäristössä tuotannossa

#### `exp-docker-prod-readonly-rootfs` · diff 4

Security review vaatii immutable root filesystemin. Mikä run-optio?

- **--read-only plus tmpfs kirjoitettaville poluille kuten /tmp** ✓
- --privileged on turvallisin tapa immutable root filesystemin toteutukseen
- Read-only rootfs estää kontin käynnistymisen kokonaan tuotantoympäristössä
- Alpine base image riittää immutable root filesystemin vaatimukseen yksinään

#### `exp-docker-prod-restart-policy` · diff 2

Tuotantokontti kaatuu yöllä eikä nouse uudelleen host-rebootin jälkeen. Mitä lisäät run-komentoon?

- **--restart unless-stopped pitää kontin pystyssä rebootin jälkeen** ✓
- --detach yksin riittää pitämään kontin käynnissä host-rebootin jälkeen
- Dockerissa restart policy ei vaikuta kontin käynnistymiseen rebootin jälkeen
- cron docker start korvaa restart policyn tuotantoympäristössä luotettavasti

### docker-network (26)

#### `b02-docker-net-alias-10` · diff 3

Yhdellä servicellä pitää olla useita DNS-nimiä samassa verkossa. Miten?

- **network_aliases Compose:ssa tai --network-alias docker run:ssa** ✓
- /etc/hosts manuaalisesti kontin sisällä on suositeltu tapa useille nimille
- Useita container-instansseja tarvitaan useaan DNS-nimeen samalla servicellä
- extra_hosts toimii samoin kuin network alias sisäverkon palveluille

#### `b02-docker-net-bridge-06` · diff 2

Kaksi default-bridge containeria eivät resolvdu nimellä — miksi?

- **Default bridge ei resolvoi nimiä — käytä user-defined networkia** ✓
- Bridge-verkko ei tue konttien välistä kommunikaatiota lainkaan Dockerissa
- --net=host tarvitaan aina kun kaksi konttia on samassa verkossa
- iptables-sääntöjen poisto palauttaa automaattisen DNS:n bridge-verkkoon

#### `b02-docker-net-compose-07` · diff 3

Compose: web ei tavoita db:ä hostname `db` — molemmat samassa projektissa. Tyypillinen syy?

- **Palvelut eri verkossa tai väärä service name — tarkista networks** ✓
- Compose DNS-bugi estää db-hostnamen löytymisen samassa projektissa
- IP-osoite tarvitaan aina hostname-resoluution sijaan compose-verkossa
- Service name -kentän poistaminen korjaa verkko-yhteyden composeissa

#### `b02-docker-net-inspect-09` · diff 3

Container ei saa IP:tä custom networkista — diagnostiikka?

- **docker network inspect netname — tarkista Containers ja IPAM** ✓
- docker ps näyttää kontin IP-osoitteen ja verkko-liitoksen tarkasti
- Host-reboot korjaa custom networkin IP-allokaatio-ongelmat automaattisesti
- Kaikkien verkkojen poistaminen palauttaa IP:n custom networkista

#### `b03-docker-net-compose-depends` · diff 3

App-kontti käynnistyy ennen Postgresia ja kaatuu connection refused. Compose-korjaus?

- **depends_on + healthcheck db:lle tai odota retry-logiikka appissa** ✓
- links: deprecated riittää
- network_mode: host korjaa järjestyksen
- depends_on takaa että db on valmis

#### `b03-docker-net-internal-network` · diff 3

Backend-API ei saa olla suoraan internetissä — vain reverse proxy ulos. Verkko?

- **internal: true compose-verkossa — ei ulkoista reittiä** ✓
- host networking kaikille
- bridge + publish kaikki portit
- none network kaikille palveluille

#### `b03-docker-net-ipv6-disable` · diff 4

Legacy-sovellus hajoaa IPv6-osoitteeseen DNS:ssä — kontissa toimii IPv4-only hostilla. Diagnostiikka?

- **Tarkista docker network inspect ja /etc/hosts / getaddrinfo — dual stack vs ipv4-only** ✓
- IPv6 on aina pois Dockerissa
- Käytä network_mode: none
- DNS aina palauttaa IPv4

#### `b05-docker-net-dns-custom` · diff 3

Kontti ei resolvdu sisäistä DNS-nimeä corporate DNS:llä. Compose-korjaus?

- **dns: -asetus palvelulle tai network-level DNS** ✓
- extra_hosts korvaa aina DNS:n
- DNS toimii vain host network -modessa
- Muokkaa /etc/resolv.conf kontissa pysyvästi

#### `b06-docker-network-ipvlan` · diff 5

Kontit tarvitsevat omat MAC-osoitteet LAN-segmentissä. Mikä driver?

- **macvlan tai ipvlan antaa kontille oman MAC-osoitteen fyysisessä LAN-verkossa** ✓
- Bridge-driver riittää kun kontit tarvitsevat omat MAC-osoitteet LAN-segmentissä
- Overlay-verkko toimii LAN-yhteydessä ilman Swarm-klusteria samalla tavalla
- Host mode antaa kontille oman MAC-osoitteen erillisenä LAN-laitteena

#### `b06-docker-network-mode-none` · diff 4

Batch-prosessi ei tarvitse verkkoa — minimoi attack surface. network_mode?

- **network_mode: none poistaa verkkoliittymät ja minimoi attack surfacen** ✓
- network_mode: host on turvallisin valinta kun verkkoa ei tarvita lainkaan
- Bridge-verkko ilman port mappingia estää ulospäin menevän liikenteen riittävästi
- Poista iptables-säännöt hostista — se eristää kontin verkon tehokkaasti

#### `b06-docker-network-proxy` · diff 3

Kontti ei saa ulosverkkoyhteyttä — corporate proxy vaaditaan. Miten konfiguroit build?

- **HTTP_PROXY ja HTTPS_PROXY build-argit välittävät proxyn Dockerfile-buildiin** ✓
- network_mode: host build-vaiheessa ohittaa corporate proxyn vaatimuksen
- Corporate proxy ei vaikuta docker build -komentoon — vain runtime liikenteeseen
- Proxy konfiguroidaan vain docker run -komennolla — build ei tarvitse proxy-asetusta

#### `b07-docker-network-bridge` · diff 3

Kaksi konttia samassa custom networkissä — toinen ei tavoita toista hostname:llä. Mikä on oikea DNS-nimi?

- **Käytä toisen kontin service/container-nimeä user-defined networkin DNS:ssä** ✓
- localhost yhdistää kontit toisiinsa samassa custom networkissä luotettavasti
- 127.0.0.1 on oikea osoite toisen kontin tavoittamiseen samassa verkossa
- Host-koneen hostname toimii kontin välisenä DNS-nimenä bridge-verkossa

#### `b07-docker-network-host` · diff 4

UDP multicast ei toimi bridge-verkossa. Milloin host network mode?

- **Host mode kun bridge/NAT ei riitä — esim. UDP multicast tai spesifit portit** ✓
- Host network mode on suositeltu oletus kaikissa tuotantodeploymenteissa
- HTTP-sovellukset vaativat host mode -verkon toimiakseen bridge-verkon sijaan
- Host mode korvaa TLS-salauksen konttien välisessä liikenteessä

#### `b07-docker-network-publish` · diff 2

Kontti kuuntelee 8080 — host ei tavoita localhost:8080. docker run?

- **-p 8080:8080 mapaa kontin portin hostille — publish port mapping** ✓
- -v 8080:8080 avaa kontin portin hostille samalla tavalla kuin -p
- EXPOSE 8080 Dockerfilessa publishaa portin hostille automaattisesti
- --network none julkaisee kontin portin hostille ilman erillistä mappingia

#### `b09-docker-net-internal` · diff 3

Tietokanta-kontti ei saa päästä internetiin — vain app-kontti. Verkko-asetus?

- **internal: true user-defined network — ei ulkoista reititystä, konttien välinen liikenne OK** ✓
- network_mode: none eristää DB:n internetistä mutta sallii app-yhteyden
- expose-kenttä estää kontin pääsyn internetiin riittävällä tavalla
- Bridge-verkko estää internet-yhteyden automaattisesti ilman erillistä asetusta

#### `b09-docker-net-publish-range` · diff 3

Dev-ympäristössä haluat hostin portin 3000-3005 mapattuna. Compose-syntaksi?

- **ports: '3000-3005:3000-3005' tai erilliset rivit mapaavat porttialueen hostille** ✓
- expose: 3000-3005 avaa porttialueen hostille samalla tavalla kuin ports
- network_mode: host vaaditaan porttialueen mapaamiseen compose-palvelussa
- Porttialueiden mapaaminen ei ole tuettu Docker Compose -syntaksissa

#### `docker-bridge-dns` · diff 4

Kaksi konttia samassa user-defined bridge -verkossa. Miten `app` löytää `db`:n nimellä?

- **Embedded DNS resolver yhdistää palvelunimet verkossa oleviin kontteihin** ✓
- Konttien välillä tarvitaan legacy --link -linkitys nimien resoluutioon
- Hostname täytyy määrittää manuaalisesti kontin /etc/hosts-tiedostoon
- User-defined bridge jakaa vain IP-osoitteet ilman nimipalvelua konteille

#### `docker-dns-custom` · diff 4

Kontti ei resolvaa sisäistä `corp.internal` -DNS:ää. Ensimmäinen tarkistus?

- **docker run --dns tai daemon.json DNS-asetus custom-resolverille** ✓
- --network host on ensimmäinen vaihe corp.internal-DNS:n korjauksessa
- /etc/resolv.conf poistaminen kontin sisältä korjaa resolver-ongelman nopeasti
- EXPOSE 53 Dockerfilessa avaa DNS-resoluution kontin sisällä automaattisesti

#### `docker-host-network` · diff 4

Kontti tarvitsee kuunnella hostin porttia 53 ilman NAT:ia. Mikä network mode?

- **--network host jakaa kontin verkkonamespaceen hostin kanssa** ✓
- Bridge mode tarjoaa suoran pääsyn host-porttiin ilman NAT-kerrosta
- none-verkko yhdistettynä port mapping 53:53 hoitaa kuuntelun suoraan
- Overlay-verkko toimii vain Docker Swarm -klusterissa tässä skenaariossa

#### `docker-inspect-network` · diff 5

Kontti on verkossa mutta ei vastaa. Miten varmistat IP:n ja gatewayn kontissa?

- **docker inspect yhdistettynä docker exec ip route / ip addr -tarkistukseen** ✓
- Vain docker ps paljastaa kontin IP-osoitteen ja oletusgatewayn luotettavasti
- journalctl -u docker näyttää kontin verkkokonfiguraation ja reitityksen suoraan
- docker rm poistaa kontin ja korjaa verkko-ongelmat automaattisesti diagnostiikassa

#### `docker-macvlan` · diff 5

Kontti tarvitsee oman MAC-osoitteen ja LAN-IP:n reitittimeltä. Mikä driver?

- **macvlan** ✓
- bridge oletus
- host
- null

#### `docker-overlay` · diff 5

Mikä verkkotyyppi yhdistää kontit eri Docker-hostien välillä klusterissa?

- Bridge-verkko yhdistää kontin eri hostien välillä automaattisesti
- Host mode luo verkkoyhteyden suoraan hostien välille klusterissa
- **Overlay (VXLAN) verkko kytkee kontit eri hostien välillä klusterissa** ✓
- macvlan rajautuu käytännössä loopback-rajapintaan vain yksittäisellä hostilla

#### `exp-docker-net-compose-alias` · diff 3

Compose-palvelu `api` ei löydä `cache`-palvelua hostnameilla. Mitä compose-network konfiguroit?

- **Palvelut samassa compose user-defined verkossa näkevät toisensa** ✓
- Jokainen palvelu oletus bridge -verkossa erikseen eristää ne toisistaan
- links: on pakollinen Compose v3:ssä palveluiden hostname-resoluutioon
- Vain host network toimii Compose-palveluiden välisessä DNS:ssä luotettavasti

#### `exp-docker-net-custom-dns` · diff 3

Kontti ei resolvdu sisäistä DNS-nimeä custom-verkossa. Mitä docker run -optiota kokeilet?

- **--dns tai user-defined networkin embedded DNS custom-nimille** ✓
- --network none eristää kontin DNS-resoluutiosta custom-verkossa
- /etc/hosts täytyy muokata käsin jokaisessa deploy-kierroksessa erikseen
- DNS toimii vain host-network-modessa custom-verkon ulkopuolella luotettavasti

#### `exp-docker-net-inspect-dns` · diff 4

Kontit samassa verkossa eivät pingaa toisiaan nimellä. Mitä diagnostiikkaa ajat?

- **docker network inspect ja docker exec nslookup toiselle kontille** ✓
- docker logs paljastaa miksi kontit eivät pingaa toisiaan nimellä verkossa
- Image-rebuild korjaa DNS-resoluution ilman verkkotarkistusta tai inspectia
- DNS toimii vain overlay-verkossa usean hostin klusterissa oikein

#### `exp-docker-net-publish-bind` · diff 3

Palvelu kuuntelee vain localhostia kontissa mutta hostilta ei reach. Mikä publish-syntaksi?

- **-p 8080:8080 map host-port → container-port** ✓
- -p 8080 riittää ilman container-porttia aina
- EXPOSE Dockerfile riittää publishiin
- Port mapping toimii vain Swarmissa

### docker-production (6)

#### `prod-docker-build-secret-arg` · diff 4

Miksi `ARG NPM_TOKEN` Dockerfilessa on huono tapa asentaa private packageja buildissä?

- **ARG voi jäädä image-historiaan/layeriin — käytä RUN --mount=type=secret ilman build-argia** ✓
- ARG ei ole käytettävissä RUN-vaiheessa — vain ENV toimii buildissa
- NPM_TOKEN ARG:na on turvallinen kun image pushataan private registryyn
- BuildKit estää automaattisesti ARG-salaisuudet päätymästä cacheen

#### `prod-docker-env-secrets` · diff 4

Dockerfile sisältää rivin `ENV API_KEY=sk_live_...`. Mikä ongelma tuotannossa?

- **Salaisuus jää image-layeriin — käytä runtime-secrets tai build-secret ilman ENV:ää** ✓
- ENV-salaisuus on automaattisesti salattu levylle eikä näy image-historiassa
- Docker poistaa ENV-salaisuudet buildin jälkeen automaattisesti imagesta
- API-key ENV:ssä toimii vain build-vaiheessa eikä näy runtime-ympäristössä

#### `prod-docker-healthcheck-db-down` · diff 5

HEALTHCHECK testaa DB-yhteyttä ja tietokanta on hetkellisesti alhaalla. Mitä healthcheckin pitäisi tehdä?

- **Erottele: prosessi elossa (liveness) vs valmis palvelemaan (readiness) — älä restartaa jos vain riippuvuus on alhaalla** ✓
- HEALTHCHECK pitää aina kaataa kontti kun DB on alhaalla — restart korjaa tilanteen
- Poista HEALTHCHECK — Docker hoitaa riippuvuuksien tilan automaattisesti
- HEALTHCHECK=NONE ja luota restart: always -politiikkaan

#### `prod-docker-k8s-probes` · diff 4

Kubernetes-pod käynnistyy, mutta sovellus ei vielä vastaa HTTP-pyyntöihin. Orkestrointi lähettää liikenteen liian aikaisin. Mikä auttaa?

- **Readiness probe ohjaa liikenteen vasta kun sovellus on valmis palvelemaan** ✓
- Tarkista vain että container-prosessi on käynnissä — se riittää liikenteen ohjaukseen
- restart: never estää orkestraattoria lähettämästä liikennettä liian aikaisin
- Kiinteä sleep entrypointissa korvaa readiness-proben luotettavasti

#### `prod-docker-nonroot-bind-mount` · diff 4

Dockerfilessa `USER appuser` mutta bind mount -hakemistoon ei voi kirjoittaa. Mikä on yleisin syy?

- **Host-hakemiston UID/GID ei vastaa kontin appuseria — chown tai matching uid buildissa** ✓
- USER direktiivi ei toimi bind mountin kanssa — poista USER
- Bind mount ohittaa aina file permissionit — chmod 777 on ainoa korjaus
- Non-root kontti ei voi koskaan kirjoittaa volumeen

#### `prod-docker-rootless-vs-root` · diff 4

Mitä eroa on hostin root-käyttäjällä ja kontin USER rootilla rootless Docker -ympäristössä?

- **Kontin root on namespace-rajattu — ei ole host-rootia ilman capability-vuotoa** ✓
- Ne ovat identtiset — kontin root = täysi host-root aina
- Rootless Docker estää USER root -rivin Dockerfilessa kokonaan
- Host root tarvitaan aina bind mount -kirjoitukseen

### docker-volumes (20)

#### `b02-docker-vol-bind-12` · diff 3

Dev: koodi bind-mountattu mutta muutokset eivät näy containerissa — macOS/Windows?

- **Cached/delegated mount tai docker sync korjaa host/VM-tiedostojärjestelmäeron** ✓
- Bind mount ei toimi macOS/Windows Docker Desktop -ympäristössä ollenkaan
- Käytä vain COPY dev-ympäristössä — bind mount ei synkronoi muutoksia
- chmod 777 host-kansiossa korjaa bind mount -synkronointiviiveen automaattisesti

#### `b02-docker-vol-ro-13` · diff 2

Config mountattu containeriin — attacker ei saa muokata. Flag?

- **docker run -v /host/config:/app/config:ro estää muokkauksen** ✓
- -v ilman :rw on read-only oletuksena mountissa Dockerissa
- Umask-asetus tekee mountista read-only automaattisesti turvallisuussyistä
- Config kopioidaan imageen aina — mount ei tarvitse :ro-lippua lainkaan

#### `b03-docker-vol-external-volume` · diff 3

Compose-projekti uudelleenkäynnistyy eri nimellä — vanha named volume jää orphaniksi. Käytäntö?

- **external: true ja nimetty volume jaettu projektien yli tai yhtenäinen project name** ✓
- Poista volume joka deploylla
- Bind mount /tmp aina
- Compose luo saman volume-nimen automaattisesti

#### `b03-docker-vol-named-vs-bind` · diff 3

Tuotantodata bind-mountataan suoraan host-polusta — deploy eri poluilla eri koneilla. Parempi?

- **Named volume — Docker hallitsee sijaintia, siirrettävä backupilla** ✓
- Bind mount aina tuotannossa
- tmpfs pysyvälle datalle
- VOLUME Dockerfilessa riittää ilman nimeä

#### `b03-docker-vol-tmpfs-secrets` · diff 4

Kontti kirjoittaa väliaikaista salaista tokenia levylle — se jää image layeriin. Ratkaisu?

- **tmpfs mount /run/secrets — muistissa, ei persistoi** ✓
- chmod 777 /tmp
- Secret env variable aina turvallinen
- docker commit tallentaa tokenin

#### `b04-docker-volume-named` · diff 3

Postgres data katoaa `docker compose down` jälkeen. Mikä puuttui?

- **Named volume määritelty palvelulle — down ei poista named volumeja ilman -v** ✓
- Bind mount /tmp aina riittää
- container_name riittää persistenssiin
- Data tallentuu automaattisesti imageen

#### `b05-docker-vol-readonly-root` · diff 3

Security hardening: kontti ei saa muokata omaa filesystemia. Mitä asetusta käytät?

- **read_only: true + tmpfs writable /tmp** ✓
- Vain USER nobody riittää
- privileged: false estää kaiken kirjoituksen
- Bridge network tekee filesystemin read-only

#### `b06-docker-security-readonly-tmpfs` · diff 4

Read-only rootfs mutta app tarvitsee /tmp kirjoitusta. Miten?

- **--read-only yhdessä --tmpfs /tmp kanssa antaa kirjoitettavan scratch-alueen** ✓
- Read-only rootfs estää kaiken kirjoituksen — /tmp-kirjoitusta ei voi sallia
- --privileged korvaa tmpfs-mountin read-only rootfs -ympäristössä
- COPY /tmp imageen build-vaiheessa ratkaisee kirjoitusoikeuden read-only rootfs:llä

#### `b06-docker-volume-driver` · diff 4

Tuotanto tarvitsee NFS-pohjainen persistent storage kontteille. Miten määrität volume?

- **Named volume driver opts — local-driver mounttaa NFS:n tuotantotallennukseen** ✓
- Bind mount NFS-polkuun on aina parempi kuin named volume tuotannossa
- Docker ei tue NFS-pohjaista persistent storagea — vain Kubernetes hostPath
- COPY data imageen build-vaiheessa korvaa NFS-volumen tuotantotallennuksessa

#### `b06-docker-volume-mount-propagation` · diff 5

Bind mount host-muutokset ei näky kontissa — mount propagation väärä. Mitä säätät?

- **Säädä bind propagation rshared/rslave — mount-näkyvyys hostin ja kontin välillä** ✓
- Vaihda named volumeen — se korvaa propagation-asetukset bind mountissa
- chmod 777 mount pointissa korjaa host-muutosten näkymättömyyden kontissa
- Kontin uudelleenkäynnistys päivittää mount propagation -asetukset automaattisesti

#### `b07-docker-volume-backup` · diff 4

Postgres volume pitää varmuuskopioida ilman konttia samassa verkossa. Käytännöllinen tapa?

- **Apukontti mounttaa saman volumen ja ajaa pg_dump tai --volumes-from** ✓
- docker cp kopioi named volumen suoraan host-tiedostoon ilman mounttia
- Poista volume ja toivo parasta — Docker varmuuskopioi datan automaattisesti
- Snapshot /var/lib/docker manuaalisesti on ainoa tapa varmuuskopioida volume

#### `b07-docker-volume-bind` · diff 3

Kehityksessä haluat live-reload lähdekoodilla hostilta. Volume-tyyppi?

- **Bind mount -v $(pwd):/app synkronoi host-lähdekoodin konttiin live-reloadiin** ✓
- Named volume näyttää host-tiedostot suoraan kehitysympäristössä live-reloadiin
- tmpfs mount on suositeltu dev-ympäristön live-reload-käyttöön tuotannossa
- COPY riittää devissä — bind mountia ei tarvita lähdekoodin synkronointiin

#### `b08-docker-volume-bind-selinux` · diff 4

RHEL-host: bind mount permission denied vaikka chmod 777. Todennäköisin syy?

- **SELinux estää kirjoituksen — käytä :Z tai :z volume-flagia relabelille** ✓
- Docker ei tue bind mounteja RHEL-hostilla — vain named volume toimii
- Poista SELinux tuotannosta — se on ainoa tapa korjata bind mount -oikeudet
- Named volume ei tarvitse koskaan SELinux-labelia bind mountin sijaan

#### `b08-docker-volumes-named` · diff 2

Postgres-data katoaa kontti poistossa — käytit bind mountia väärään polkuun. Parempi tuotantokäytäntö?

- **Named volume — Docker hallitsee polkua ja helpottaa backup/restore -käytäntöä** ✓
- Kontin väliaikainen filesystem riittää Postgres-datan säilyttämiseen tuotannossa
- Bind mount on aina parempi kuin named volume tuotantotietokannan tallennukseen
- docker commit tallentaa volume-datan imageen ja säilyttää sen kontin poiston jälkeen

#### `b09-docker-vol-anonymous` · diff 3

Dockerfile: `VOLUME /data` — data katoaa kontin poiston jälkeen. Miksi?

- **Anonymous volume poistuu kontin mukana — nimeä volume erikseen säilyttääksesi datan** ✓
- VOLUME-instruktio luo read-only mountin — data ei voi kadota kontin poistossa
- Named volume luodaan automaattisesti VOLUME-rivistä Dockerfile-buildissa
- VOLUME-data tallentuu image-layeriin ja säilyy kontin poiston jälkeen

#### `b09-docker-vol-driver-local` · diff 3

Usean hostin Swarm-klusterissa tarvitset jaetun volumen. Vaihtoehto local driverille?

- **NFS/Ceph/cloud volume plugin — esim. nfs-driver jaetulle storage:lle Swarmissa** ✓
- local-driver replikoi volumen automaattisesti kaikille Swarm-hosteille
- Bind mount skaalautuu usean hostin Swarm-klusterissa ilman erillistä driveria
- Docker ei tue jaettuja volumeja — multi-host vaatii aina Kubernetesin

#### `b10-docker-volumes-backup-01` · diff 4

Named volume pitää varmuuskopioida ilman kontin käynnistämistä. Tyypillinen tapa?

- **Väliaikainen kontti mounttaa volumen ja archivoi tiedostot host-polkuun** ✓
- docker cp kopioi volume-objektin suoraan ilman mounttia tai apukonttia
- docker commit riittää named volumen varmuuskopiointiin ilman erillistä työkalua
- Volume-data on aina image-layerissa — erillistä backupia ei tarvita

#### `exp-docker-vol-backup` · diff 3

Haluat varmuuskopioida named volumen ilman konttia käynnissä. Miten?

- **docker run --rm -v vol:/data alpine tar pakkaa volumen host-polkuun** ✓
- docker cp siirtää volumen suoraan host-tiedostoon ilman apukonttia
- Named volumet ovat salattuja eikä niitä voi varmuuskopioida ulkopuolelle
- docker commit tallentaa volumen datan imageen automaattisesti backupiksi

#### `exp-docker-vol-bind-perms` · diff 4

Bind mount ./config:/app/config — kontti ei saa kirjoittaa. Mikä on tyypillinen syy?

- **Bind mountin host-UID/GID ei täsmää kontin prosessikäyttäjään** ✓
- Bind mount ei tue kirjoitusoikeuksia Dockerissa oletusasetuksilla lainkaan
- Vain named volume sallii read-write -oikeudet bind mountin sijaan aina
- Dockerfile EXPOSE korjaa bind mountin tiedosto-oikeudet automaattisesti

#### `exp-docker-vol-readonly` · diff 3

Config-volume ei saa muuttua runtime-aikana. Mikä mount-optio?

- **:ro loppuun — esim. -v config:/etc/app:ro** ✓
- --read-only root filesystem riittää aina
- Vain tmpfs voi olla read-only
- Dockerfile VOLUME estää kirjoituksen

## git (24)

### git-ci (10)

#### `ci-artifact-retention` · diff 3

CI-build tuottaa binäärin joka pitää olla ladattavissa myöhemmin QA-testaajille. Miten tallennat?

- **Julkaise build-tuotos artefaktina (archiveArtifacts / upload-artifact) CI:n sisällä** ✓
- Committaa binääri Git-repoon jotta se on aina saatavilla branchilla
- Tulosta binäärin base64-sisältö build-lokiin josta sen voi kopioida
- Siirrä tiedosto agentin /tmp-hakemistoon josta QA voi noutaa SSH:lla

#### `ci-github-actions-matrix` · diff 4

Projekti pitää testata kolmella Node-versiolla ja kahdella käyttöjärjestelmällä. Miten GitHub Actionsissa?

- **strategy: matrix: node: [16,18,20] os: [ubuntu, windows] ajaa kaikki yhdistelmät** ✓
- Luo erillinen workflow-tiedosto jokaiselle versio+OS -yhdistelmälle
- Käytä if-ehtoja yhdessä jobissa vaihtamaan versiota peräkkäin samassa runnerissa
- Testaa vain uusimmalla versiolla ja luota semver-yhteensopivuuteen muille

#### `ci-parallel-stages` · diff 4

CI-pipelinessa unit-testit ja lintterit voitaisiin ajaa rinnakkain nopeuttamaan buildia. Miten toteutat?

- **parallel-lohko tai matrix strategy ajaa riippumattomat vaiheen rinnakkain** ✓
- Lisää molemmat samaan stage-skriptiin — shell ajaa ne luontaisesti rinnakkain
- Luo kaksi erillistä pipelinea ja triggeroi ne samasta webhookista ajastettuina
- Poista lintteri testivaiheesta koska se hidastaa aina buildeja tarpeettomasti

#### `ci-secret-management` · diff 4

Pipeline tarvitsee API-avaimen deployta varten. Missä avain säilytetään turvallisesti?

- **CI-ympäristön secrets/credentials-storagessa — injektoidaan environment-muuttujana ajon aikana** ✓
- Kovakoodaa .env-tiedostoon repossa — .gitignore suojaa sen julkaisulta
- Kirjoita avain Jenkinsfile-kommenttiin josta pipeline parsii sen ajossa
- Tallenna avain README.md:hen salatulla base64-koodauksella

#### `jenkins-agent-label` · diff 3

Jenkins-pipeline pitää ajaa tietyllä agentilla jossa on Docker asennettuna. Miten määrität sen?

- **agent { label 'docker' } kohdistaa pipelinen agentille jolla on kyseinen label** ✓
- node('any') ajaa automaattisesti Docker-agentilla jos sellainen on vapaana
- agent any valitsee aina Docker-agentin ensisijaisesti muiden edelle
- tools { docker 'latest' } asentaa Dockerin mille tahansa agentille ajon aikana

#### `jenkins-pipeline-stages` · diff 4

Jenkins Declarative Pipelinessa build, test ja deploy tulisi ajaa peräkkäin. Mikä rakenne Jenkinsfilessä?

- **pipeline { stages { stage('Build') {...} stage('Test') {...} stage('Deploy') {...} } }** ✓
- node { build(); test(); deploy(); } — funktioita kutsutaan järjestyksessä
- freestyle project → lisää build step jokaiselle vaiheelle UI:sta
- pipeline { parallel { stage('Build') stage('Test') stage('Deploy') } }

#### `jenkins-shared-library` · diff 5

Useassa Jenkins-projektissa toistetaan samaa pipeline-logiikkaa. Miten vältetään kopiointi?

- **Shared Library — organisaation Git-repo josta @Library-annotaatiolla tuodaan funktioita** ✓
- Kopioi Jenkinsfile-fragmentti jokaiseen repoon ja päivitä manuaalisesti muuttuessa
- Jenkins Global Tool Configuration asentaa jaetut skriptit jokaiselle agentille
- Multibranch Pipeline jakaa automaattisesti staget kaikkien repojen kesken

#### `prod-ci-cache-lockfile` · diff 4

CI käyttää dependency-cachea mutta buildit saavat satunnaisesti väärät paketit. Mikä cache-avaimessa pitää huomioida?

- **Lockfile-hash cache-avaimessa invalidoi välimuistin kun riippuvuudet muuttuvat** ✓
- Sama cache-avain kaikille brancheille nopeuttaa pipelinen ensimmäistä ajoa
- Cacheaa koko workspace ilman invalidointia vähentääksesi riippuvuuksien latausaikaa
- Poista lockfile buildistä ja luota semver-rangeihin nopeuden vuoksi

#### `prod-ci-deploy-rollback` · diff 4

Tuotantodeploy on rikki ja edellinen versio on tunnettu. Nopein turvallinen rollback CI/CD:ssä?

- **Deployaa edellinen tunnettu image-tag/digest tai revert-commit — älä debuggaa tuotannossa ensin** ✓
- git reset --hard HEAD~5 tuotantopalvelimella ja käynnistä uudelleen
- Poista healthcheck jotta käyttäjät pääsevät palveluun
- Ota käyttöön feature flag joka piilottaa kaiken uuden koodin runtime-käännöksellä

#### `prod-ci-flaky-test` · diff 4

Testi epäonnistuu vain joskus CI:ssä. Mikä on hyvä ensimmäinen askel?

- **Eristä nondeterminismi: aika, verkko, rinnakkaisuus ja testien suoritusjärjestys** ✓
- Lisää retry CI:hin ja hyväksy satunnainen epäonnistuminen buildin yhteydessä
- Poista hidas testi pipelinesta ja aja se vain manuaalisesti ennen releaseta
- Merkitse CI vihreäksi paikallisen onnistuneen testiajon perusteella

### git-workflow (14)

#### `git-blame-ignore-revs` · diff 3

Koko repo formatoitiin yhdellä commitilla, ja nyt git blame näyttää lähes jokaiselle riville vain formatointicommitin. Miten saat alkuperäiset tekijät näkyviin?

- **Lisää commit .git-blame-ignore-revs-tiedostoon (blame.ignoreRevsFile)** ✓
- Peru formatointicommit git revertillä ja formatoi tiedostot vähitellen
- Aja git blame --reverse, joka ohittaa pelkät muotoilumuutokset
- Squashaa formatointi edelliseen committiin rebase -i:llä mainissa

#### `git-cherry-pick-conflict` · diff 3

Haluat tuoda yksittäisen commitin toisesta branchista ilman koko haaran mergeä. Mikä komento?

- **git cherry-pick <commit-sha> kopioi yksittäisen commitin nykyiselle branchille** ✓
- git merge --squash <branch> tuo vain yhden commitin kerrallaan ilman muita muutoksia
- git rebase <branch> siirtää kaikki commitit ja valitsee yhden automaattisesti
- git checkout <branch> -- . kopioi yhden commitin diff:n työhakemistoon

#### `git-leaked-secret-history` · diff 4

API-avain commitoitiin vahingossa ja pushattiin julkiseen repoon tunti sitten. Mikä on ensimmäinen toimenpide?

- **Mitätöi ja vaihda avain heti — historian siivous vasta sen jälkeen** ✓
- Poista tiedosto uudella commitilla, jolloin avain katoaa repositoriosta
- Tee git commit --amend ja force push, jolloin kukaan ei näe avainta
- Muuta repo yksityiseksi, jolloin vuotanut avain ei ole enää vaarallinen

#### `git-log-filtering` · diff 3

Haluat nähdä vain yhden tiedoston muutoshistorian viimeisen kuukauden ajalta. Mikä komento?

- **git log --since='1 month ago' -- path/to/file.js rajaa ajan ja tiedoston** ✓
- git blame path/to/file.js näyttää kaikki commitit aikarajauksella automaattisesti
- git diff --stat --since='1 month' näyttää tiedoston commit-historian
- git show --follow path/to/file.js listaa muutokset kuukauden ajalta

#### `git-merge-conflict-resolve` · diff 3

git merge tuottaa CONFLICT-merkintöjä tiedostoon. Mikä on oikea työnkulku konfliktin ratkaisemiseksi?

- **Muokkaa konfliktoiva tiedosto, poista <<<< ==== >>>> merkit, git add ja git commit** ✓
- git merge --abort && git merge --force ohittaa konfliktit automaattisesti
- Poista konfliktoiva tiedosto ja commitoi — Git luo sen uudelleen mergestä
- git reset --mixed palauttaa tilan ennen mergeä ja soveltaa muutokset uudelleen

#### `git-rebase-interactive` · diff 4

Feature-branchissa on 5 pientä committia jotka pitäisi yhdistää siistiksi ennen PR:n luontia. Mikä toimii?

- **git rebase -i HEAD~5 — squash/fixup yhdistää commitit interaktiivisesti** ✓
- git merge --squash HEAD~5 tiivistää viimeiset commitit yhteen automaattisesti
- git commit --amend yhdistää kaikki viisi committia edelliseen kerralla
- git reset --hard HEAD~5 && git commit tiivistää historian turvallisesti

#### `git-reflog-recovery` · diff 4

Paikallinen branch näyttää tyhjältä commit-historian jälkeen, mutta tiedät että työtä on kadonnut vasta äskettäin. Mikä Git-mekanismi säilyttää HEAD-siirtojen historian palautusta varten?

- **git reflog näyttää HEAD-historian — löydä sha ja git checkout/reset siihen** ✓
- git log --all näyttää aina kaikki commitit mukaan lukien resetoidut
- git fsck palauttaa automaattisesti kadonneet commitit working treehen
- git stash pop palauttaa viimeisimmän resetin kumoamat muutokset

#### `git-reset-vs-revert` · diff 3

Viimeisin commit mainiin on buginen ja kollegat ovat jo pullanneet sen. Miten korjaat turvallisesti?

- **git revert <sha> luo käänteisen commitin tuhoamatta jaettua historiaa** ✓
- git reset --hard HEAD~1 && force push korjaa historian kaikille nopeimmin
- git commit --amend korjaa julkaistun commitin ilman uutta committia
- git checkout HEAD~1 palauttaa edellisen tilan ja jakaa sen kaikille automaattisesti

#### `git-stash-workflow` · diff 3

Keskeneräinen työ pitää siirtää sivuun nopeasti ilman committia esim. branchin vaihdon ajaksi. Miten?

- **git stash tallentaa uncommitted-muutokset ja palauttaa puhtaan working treen** ✓
- git reset --soft HEAD~1 piilottaa muutokset väliaikaisesti staging-alueelle
- git commit --amend --no-edit tallentaa työn väliaikaiseksi piilocommitiksi
- git clean -fd poistaa muutokset turvallisesti ja voit palauttaa ne myöhemmin

#### `git-tag-release` · diff 3

Release pitää merkitä niin että CI voi triggata deployment tietystä versiosta. Mikä on paras tapa?

- **git tag -a v1.2.0 -m 'Release 1.2.0' luo annotoidun tagin josta CI voi trigata** ✓
- git branch release-v1.2.0 luo branchin joka toimii samoin kuin tag CI:ssä
- git commit --message='v1.2.0' merkitsee version riittävästi CI-pipelinelle
- git notes add -m 'v1.2.0' kiinnittää version commitiin CI:tä varten

#### `git-worktree` · diff 4

Haluat työstää kahta branchia samanaikaisesti ilman stashia tai committia keskeneräisistä muutoksista. Mikä auttaa?

- **git worktree add ../hotfix hotfix-branch luo toisen working treen samasta reposta** ✓
- git clone . ../copy tekee erillisen kopion jonka voi linkittää alkuperäiseen
- git branch --copy luo branchin ja vaihtaa siihen automaattisesti uudessa ikkunassa
- git checkout --detach avaa erillisen työtilan nykyisestä commitista

#### `prod-git-bisect` · diff 4

Regressio ilmestyi jossain 200 commitin välillä. Mikä Git-työkalu auttaa löytämään syyllisen commitin?

- **git bisect rajaa commit-joukon binäärihaulla good/bad-välillä** ✓
- git blame koko repossa paljastaa syyllisen commitin yhdellä komennolla
- git stash tallentaa muutokset pois ja nollaa historian seurannan
- git gc optimoi repoa ja korjaa regression automaattisesti käynnistyksessä

#### `prod-git-force-with-lease` · diff 4

Rebase tehtiin ja branch pitää puskea uudestaan. Miten vältät että ylikirjoitat kollegan commitit vahingossa?

- **git push --force-with-lease — puskee vain jos remote-ref on odotettu** ✓
- git push --force rebasen jälkeen — nopein tapa päivittää etäbranch
- git reset --hard origin/main synkronoi paikallisen historian remoteen
- git clean -fd siivoaa työhakemiston ja korjaa push-konfliktit

#### `prod-git-rebase-onto` · diff 5

Feature-branch perustui vanhaan mainiin. Main on edennyt ja haluat siirtää vain feature-commitit uuden mainin päälle. Komento?

- **git rebase --onto main <vanha-main-tip> feature-branch — siirtää commitit uudelle pohjalle** ✓
- git merge main — siirtää vain feature-commitit ilman merge-committia
- git cherry-pick main..feature — päivittää automaattisesti koko branchin
- git reset --hard main — säilyttää feature-muutokset turvallisesti

## javascript (202)

### js-async (46)

#### `b02-js-async-fetch-01` · diff 2

REST-kutsu timeout 30s — käyttäjä navigoi pois. Miten peruutat fetchin?

- **AbortController ja signal fetch-opseissa pyynnön peruuttamiseen** ✓
- fetch API ei tue kesken jääneen pyynnön peruuttamista lainkaan
- window.close() keskeyttää kaikki aktiiviset fetch-pyynnöt välittömästi
- setTimeout(null) peruuttaa edellisen fetch-kutsun automaattisesti

#### `b02-js-async-promise-02` · diff 3

Kolme riippumatonta API-kutsua — haluat odottaa kaikkia mutta yksi fail saa jatkua. Metodi?

- **Promise.allSettled** ✓
- Promise.all — sama mutta jatkuu failista
- callback hell
- await serial only

#### `b03-js-async-debounce-fetch` · diff 3

Hakukenttä laukaisee fetch-jokaisella näppäimellä — API rate limit. Korjaus?

- **Debounce/throttle ja AbortController edellisen haku-pyynnön peruutukseen** ✓
- setInterval 10 ms välein laukaisee fetchin tasaisella taajuudella hakuun
- Synkroninen XMLHttpRequest estää rate limitin koska pyyntöjä tulee vähemmän
- Cache-Control: no-store riittää rajaamaan API-pyyntöjen määrän hakukentässä

#### `b03-js-async-event-loop-order` · diff 4

Debug: console.log(1); Promise.resolve().then(()=>log(2)); queueMicrotask(()=>log(3)); log(4). Tulostus?

- **1, 4, 2, 3 — microtask-queue tyhjenee ennen seuraavaa macrotaskia** ✓
- 1, 2, 3, 4 — promise callback suoritetaan välittömästi synkronisen jälkeen
- 1, 4, 3, 2 — queueMicrotask ajetaan ennen Promise.then-callbackia
- Satunnainen järjestys riippuu selaimen sisäisestä scheduler-toteutuksesta

#### `b03-js-async-fetch-credentials` · diff 3

SPA ei lähetä session-cookiea cross-origin API:lle. fetch-korjaus?

- **credentials: 'include' fetchissä + CORS Allow-Credentials palvelimella** ✓
- credentials: 'omit' lähettää session-cookien cross-origin-pyynnöissä
- Cookie-header manuaalisesti ilman CORS-asetuksia cross-origin API:lle
- fetch API ei tue evästeiden lähettämistä lainkaan selaimen turvallisuussääntöjen vuoksi

#### `b03-js-async-promise-race-timeout` · diff 4

fetch ei timeouttaa natiivisti — käyttäjä jää odottamaan ikuisesti. Moderni pattern?

- **AbortSignal.timeout(ms) tai Promise.race + AbortController** ✓
- while(true) retry
- XMLHttpRequest timeout only
- fetch timeout oletus 30s

#### `b04-js-async-debounce` · diff 3

Hakukenttä laukaisee API-kutsun joka näppäimellä — palvelin ylikuormittuu. Ratkaisu?

- **debounce — odota tauko ennen fetchiä** ✓
- throttle ja debounce sama asia aina
- Synkroninen XMLHttpRequest
- Poista input-event

#### `b04-js-async-event-loop-blocking` · diff 3

UI jäätyy kun käsittelet 100k rivin CSV:tä for-silmukalla fetchin jälkeen. Ensimmäinen korjaus?

- **Pilko työ chunkkeihin setTimeout/requestIdleCallback tai Web Worker** ✓
- async function riittää — ei jäädy
- Promise.all synkronisee nopeammin
- document.write nopeuttaa

#### `b04-js-async-generator` · diff 4

Paginoitu API palauttaa nextPage-osoittimen. Haluat kuluttaa kaikki sivut ilman callback-ketjua ja ilman manuaalista while-silmukkaa. Mikä JavaScript-pattern yhdistää iteration ja awaitin?

- **Async generator function* joka yieldaa sivut — for await (const page of fetchPages())** ✓
- while(true) sync fetch — ei jäädy
- Callback pyramid
- Generaattorit eivät toimi async:ssa

#### `b04-js-async-race-fetch` · diff 3

Hidas API — haluat timeoutin 5s jälkeen AbortError. Oikea yhdistelmä?

- **AbortController + setTimeout(() => controller.abort(), 5000) fetchissä signal: controller.signal** ✓
- Promise.race ilman abort — request jatkuu taustalla ok
- fetch.timeout(5000) — built-in
- XMLHttpRequest sync timeout

#### `b05-js-event-loop-order` · diff 3

console.log('A'); setTimeout(() => console.log('B'), 0); Promise.resolve().then(() => console.log('C')); Tulostusjärjestys?

- **A, C, B — microtask ennen macrotaskia** ✓
- A, B, C
- A, B samanaikaisesti C
- C, A, B

#### `b05-js-promise-chain-catch` · diff 3

fetch-ketju kaatuu — virhe jää käsittelemättä ja UI jää spinneriin. Korjaus?

- **.catch() ketjun lopussa tai try/catch async-funktiossa** ✓
- Virheet katoavat automaattisesti promisessa
- then() ilman toista parametria riittää
- setTimeout korjaa rejected promisen

#### `b06-js-async-iterator-forawait` · diff 4

Stream API palauttaa async iterable — haluat loopata awaitilla. Miten?

- **for await (const chunk of stream) — async iteration odottaa jokaisen arvon** ✓
- for (const chunk of stream) riittää koska iterable palauttaa promiset
- stream.map(async fn) käsittelee async iterablen samalla tavalla kuin for await
- Promise.all(stream) kerää kaikki chunkit kerralla ennen loopin aloitusta

#### `b06-js-async-promise-finally` · diff 3

Fetch-ketju — haluat cleanup riippumatta success/failure. Mitä käytät?

- **finally() ajetaan aina kun promise settle — cleanup ilman duplikaattia** ✓
- then() ja catch() erikseen riittää kun cleanup-koodi kopioidaan molempiin
- finally toimii vain synkronisessa try-catch-lohkossa, ei promisessa
- async-funktio hoitaa resurssien vapautuksen automaattisesti ilman finallyä

#### `b06-js-async-settimeout-zero` · diff 2

setTimeout(fn, 0) ei suorita fn heti — miksi?

- **Callback menee macrotask-jonoon nykyisen synkkoodin jälkeen** ✓
- Nollan millisekunnin viive on liian pieni — selain pakottaa vähintään 4 ms
- setTimeout suorittaa callbackin synkronisesti heti kutsumishetkellä
- Viive nollalla tarkoittaa että kutsu ohitetaan ja callbackia ei ajeta

#### `b07-js-async-debounce` · diff 4

Käyttäjä kirjoittaa hakukenttään nopeasti — vanhemmat fetch-vastaukset saapuvat myöhemmin ja ylikirjoittavat uudemman tuloksen. Korjaus?

- **AbortController per uusi haku + tarvittaessa debounce** ✓
- Lisää vain setInterval — päivitä 100 ms välein
- Poista async ja käytä synkronista fetchiä
- Tallenna vain ensimmäinen vastaus — ignooraa loput

#### `b08-js-async-microtask-starvation` · diff 5

while(true) Promise.resolve().then(...) — UI jäätyy mutta ei 100% CPU. Miksi?

- **Microtask loop — jono tyhjenee ennen macrotask/render-kierrosta** ✓
- Promise ei käytä event loopia — se ajaa callbackit erillisessä säikeessä
- setTimeout(0) saman loopin sisällä katkaisee loputtoman microtask-ketjun
- async/await ei käytä microtaskeja — se on puhdas macrotask-mekanismi

#### `b08-js-async-parallel` · diff 3

Lataat kolme riippumatonta API:a — await peräkkäin kestää 3×. Nopeampi tapa?

- **Promise.all([fetch(a), fetch(b), fetch(c)]) — riippumattomat kutsut rinnakkain** ✓
- for-await loop riippumattomille API-kutsuille ajaa ne rinnakkain automaattisesti
- Synkroninen XMLHttpRequest rinnakkain — ei blokkaa event loop -säiettä
- setTimeout-ketjutus fetch-kutsujen välissä nopeuttaa kokonaislatausaikaa

#### `b08-js-async-race-timeout` · diff 3

fetch ei saa roikkua yli 5 sekuntia — timeout ilman manuaalista flagia?

- **AbortSignal.timeout(5000) tai Promise.race fetch + timeout-promisen kanssa** ✓
- fetch timeout-parametri natiivisti — viive sekunteina options-objektissa
- while Date.now() block — odottaa timeoutia synkronisesti event loopissa
- setInterval peruuttaa fetchin automaattisesti viiden sekunnin kuluttua

#### `b09-js-async-event-loop-block` · diff 4

Express-endpoint jäädyttää koko palvelimen 30 sekunniksi raskaalla JSON-parsinnalla. Juurisyy?

- **Synkroninen työ event loop -säieessä — siirrä worker threadiin tai pilko** ✓
- Express ei tue asyncia — kaikki handlerit suoritetaan synkronisesti
- JSON.parse on aina async — se ei voi blokata event loop -säiettä
- Lisää useampia Express-instanssia samaan prosessiin — ratkaisee blokin

#### `b09-js-async-promise-chain` · diff 3

Callback hell API-ketjussa — kolme peräkkäistä fetch-kutsua. Moderni refaktorointi?

- **async/await tai Promise chain .then() — litteä async flow callback hellin sijaan** ✓
- Synkroninen XMLHttpRequest ketjussa — moderni tapa peräkkäisiin API-kutsuihin
- setTimeout-ketjutus fetch-kutsujen välissä korvaa promise chain -refaktoroinnin
- Globaali callback registry — rekisteröi jokainen vaihe window-objektiin

#### `b09-js-async-unhandled-rejection` · diff 4

Tuotannossa `UnhandledPromiseRejection` kaataa Node-prosessin. Miten käsittelet?

- **try/catch async-funktioissa + .catch() ketjuissa + process rejection handler** ✓
- Promiset eivät voi rejectata — ne muuttuvat aina fulfilled-tilaan lopulta
- Ignoroi rejection — Node korjaa unhandled rejectionit automaattisesti
- Vain synkroninen try/catch riittää — async-virheet eivät leviä promisena

#### `b12-js-async-async-returns-promise` · diff 2

Mikä `async function foo() { return 42; }` palauttaa kutsujalle?

- **Promise joka resolvaantuu arvoon 42** ✓
- Synkroninen number 42
- undefined — return ei toimi asyncissa
- Generator-objekti

#### `b12-js-async-async-stack` · diff 5

async stack trace katkeaa await-kohdassa debugissa. Node/DevTools apu?

- **async_hooks / source map / await boundary säilyttää linkin Error.stack:ssa moderneissa engingeissä** ✓
- Stack ei koskaan toimi asyncissa
- Poista async
- console.trace riittää

#### `b12-js-async-callback-to-promise` · diff 2

Vanha kirjasto käyttää `readFile(path, cb)` callback-tyyliä. Miten käärit sen await-yhteensopivaksi?

- **util.promisify(readFile) tai new Promise wrapper** ✓
- Callbacks eivät voi muuttua promiseiksi
- await toimii suoraan callback-funktiossa
- setTimeout korvaa promisen

#### `b12-js-async-eventemitter-memory` · diff 4

Node EventEmitter 'data' listenerit kasaantuvat — MaxListenersExceededWarning. Korjaus?

- **Poista listener removeListener/off tai käytä once** ✓
- Lisää lisää listenereitä
- ignore warning
- process.exit

#### `b12-js-async-fetch-keepalive` · diff 3

Analytics beacon sivun unloadissa — fetch katkeaa. Vaihtoehto?

- **fetch(url, { keepalive: true }) tai navigator.sendBeacon** ✓
- sync XHR
- localStorage
- WebSocket aina

#### `b12-js-async-generator-async` · diff 4

Paginoitu REST-API palauttaa sivuja, ja haluat käyttää for...of-tyylistä silmukkaa, jossa jokainen iteraatio odottaa seuraavaa sivua. Minkä funktiomuodon täytyy tuottaa data?

- **async function* — async generator** ✓
- function* riittää awaitille sisällä
- async function palauttaa arrayn automaattisesti
- Generators eivät tue promiseja

#### `b12-js-async-microtask-starvation` · diff 5

while(true) { queueMicrotask(() => {}) } — UI jäätyy vaikka ei ole synkronista silmukkaa. Miksi?

- **Microtask-jono tyhjennetään ennen renderiä — infinite microtasks estävät macrotaskit** ✓
- queueMicrotask on synkroninen
- Selain ei käytä microtask-jonoa
- setTimeout(0) ajetaan aina ensin

#### `b12-js-async-promise-all-error` · diff 3

Promise.all — yksi reject. Mitä tapahtuu?

- **Koko all hylätään ensimmäisestä virheestä** ✓
- Muut jatkuvat
- allSettled automaattisesti
- Virhe ignoroitu

#### `b12-js-async-promise-finally` · diff 3

Latausnäkymä pitää piilottaa sekä onnistumisessa että virheessä. Mikä Promise-metodi?

- **finally(() => hideSpinner())** ✓
- then() ilman catchia riittää virheille
- catch() ajetaan onnistumisessa
- finally muuttaa promisen tuloksen aina

#### `b12-js-async-promise-race-cancel` · diff 3

Käyttäjä peruuttaa — haluat että hitain fetch häviää kilpajuoksussa. Metodi?

- **Promise.race([fetch(...), abortPromise])** ✓
- Promise.all
- setInterval cancel
- fetch abort automaattinen

#### `b12-js-async-promise-then-chain` · diff 2

fetch palauttaa promisen — haluat JSON-objektin. Ensimmäinen then-ketju?

- **.then(res => res.json())** ✓
- .then(JSON.parse) suoraan Response-objektille
- await ei toimi promisen kanssa
- res.body on aina valmis objekti

#### `b12-js-async-promise-with-resolvers` · diff 4

Rakennat deferred-patternin: ulkopuolinen koodi resolveaa promisen myöhemmin. ES2024+ tapa?

- **Promise.withResolvers() — { promise, resolve, reject }** ✓
- new Promise ilman executor-funktiota
- Promise.defer() on natiivi
- async function ei voi odottaa ulkoista signaalia

#### `b12-js-async-queue-microtask` · diff 3

Haluat ajaa funktion heti synkronisen koodin jälkeen mutta ennen setTimeout(0). API?

- **queueMicrotask(fn)** ✓
- setImmediate(fn) selaimessa aina
- requestAnimationFrame on microtask
- process.nextTick on standardi selaimessa

#### `b12-js-async-retry-backoff` · diff 4

API palauttaa 503 — haluat uudelleenyrityksen eksponentiaalisella viiveellä. Rakenne?

- **Loop/silmukka: try await, catch, odota delay * 2^n, max retries** ✓
- while(true) ilman max retries — loputon retry
- Promise.all retry kaikille kerralla
- fetch cachettaa 503 automaattisesti

#### `b12-js-async-settled-vs-resolve` · diff 3

finally-blokissa tarvitset tietää onnistuiko promise. Miten saat tuloksen ilman then-ketjua?

- **Tallenna flag then/catchissa — finally ei saa tulosta parametrina** ✓
- finally(result) palauttaa resolve-arvon
- await finally palauttaa arvon
- Promise.status on natiivi property

#### `b12-js-async-signal-combine` · diff 4

Kaksi riippumatonta peruutuslähdettä (esim. käyttäjän navigointi ja timeout) — fetch pitää keskeytyä jos kumpi tahansa laukeaa. Mikä standardi-API yhdistää signaalit?

- **AbortSignal.any([signal1, signal2])** ✓
- signal1 + signal2 merge
- AbortController.combine
- ei tuettu

#### `b12-js-async-sleep-pattern` · diff 2

Testissä haluat odottaa 100ms ilman busy-waitiä. Pattern?

- **await new Promise(r => setTimeout(r, 100))** ✓
- while(Date.now())
- Thread.sleep
- busy loop

#### `b12-js-async-stream-backpressure` · diff 5

Node transform stream tulvii muistia — kirjoittaja nopeampi kuin lukija. Mekanismi?

- **backpressure — stream.write() false + 'drain' event** ✓
- Lisää buffer RAM
- Poista pipe
- sync write

#### `exp-js-async-await-parallel` · diff 3

Code review: kaksi await fetchiä peräkkäin — sivu latautuu hitaasti. Miten nopeutat?

- **await Promise.all([fetchA(), fetchB()]) suorittaa kutsut rinnakkain** ✓
- Lisää kolmas peräkkäinen await — näin latenssi pienenee nopeammin
- Poista async ja käytä synkronista fetchiä suorituskyvyn parantamiseen
- Lisää setTimeout fetch-kutsujen väliin jotta ne eivät blokkaa toisiaan

#### `exp-js-async-fetch-abort` · diff 3

Käyttäjä navigoi pois ennen kuin hidas fetch valmistuu — state päivittyy unmountatulle komponentille. Miten estät?

- **AbortController-signaali fetchiin ja cleanup useEffectin returnissa** ✓
- Ignoroi virhetilanne — fetch päättyy itsestään navigoinnissa
- setState on turvallista vaikka komponentti on jo unmountattu
- async/await korvaa tarpeen peruuttaa hidas HTTP-pyyntö kesken

#### `exp-js-async-promise-all-settled` · diff 3

Dashboard hakee viisi API:a — yksi failaa ja koko näkymä jää tyhjäksi Promise.all:in takia. Parempi malli?

- **Promise.allSettled — käsittele jokainen tulos erikseen** ✓
- try/catch Promise.all ympärillä palauttaa osittaisen datan
- Synkroninen XMLHttpRequest jono
- callback hell ilman virheenkäsittelyä

#### `js-async-await-error` · diff 3

async-funktio heittää virheen. Miten käsittelet sen kutsujassa turvallisesti?

- **try/catch awaitin ympärillä tai .catch() promisessa** ✓
- Virheet heitetään uudelleen automaattisesti async-funktiossa
- Vain synkroninen callback-käsittely toimii virhetilanteissa
- await estää poikkeusten leviämisen kutsupinossa kokonaan

#### `js-async-microtasks` · diff 4

console.log(1); Promise.resolve().then(() => console.log(2)); console.log(3); — missä järjestyksessä?

- **1, 3, 2 — synkroninen koodi ennen microtask-jonoa** ✓
- 1, 2, 3 — promise callback ajetaan heti synkronin jälkeen
- 3, 2, 1 — event loop käsittelee jonon takaperin
- 2, 1, 3 — microtask ehtii ennen ensimmäistä logia

#### `prod-js-unhandled-rejection-caller` · diff 4

Event handler kutsuu `saveData()` async-funktiota ilman awaitia eikä lisää `.catch()`. Promise hylätään. Mikä riski?

- **Unhandled rejection — virhe voi jäädä huomaamatta tai kaataa prosessin** ✓
- Promise suoritetaan uudelleen automaattisesti kun rejection jää käsittelemättä
- async-funktiot eivät voi epäonnistua ilman awaitia — virheet nieltyvät
- try/catch async-funktion sisällä riittää aina — kutsuja ei tarvitse .catch()

### js-modules (38)

#### `b02-js-modules-dynamic-08` · diff 3

Feature flag lataa analytics-moduulin vain tarvittaessa. ES module tapa?

- **dynamic import(): await import('./analytics.js') feature flagin takana** ✓
- require() toimii natiivisti kaikissa moderneissa selaimissa moduuleille
- sync script-tag lataa moduulin ennen sivun interaktiivisuutta
- eval() suorittaa moduulin lähdekoodin suoraan ilman bundleria

#### `b02-js-modules-export-11` · diff 2

Barrel-tiedosto index.js julkaisee utils.js:n funktiot ilman että ne importataan ensin paikallisiin bindingeihin. Mikä export-lauseke?

- **export { foo, bar } from './utils.js' — re-export ilman importia** ✓
- import * sitten window.foo — julkaisee utilit globaalisti entrypointista
- require() + module.exports re-export ES-moduuleissa toimii bundlerissa
- globalThis.foo = foo on barrel-tiedoston suositeltu re-export-malli

#### `b02-js-modules-tla-10` · diff 4

Moduulin top-level await hidastaa koko appin latausta — milloin käyttää?

- **Kun async-init vaaditaan ennen exporttia — muuten erillinen init()** ✓
- Käytä top-level awaitia jokaisessa tiedostossa suorituskyvyn parantamiseksi
- Top-level await on kielletty ES-moduuleissa standardissa kokonaan
- Vain callback-tyyli toimii async-resurssin latauksessa moduulin tasolla

#### `b03-js-modules-export-default-named` · diff 2

Code review: tiedosto export default User ja export const helper — import sekoittuu. Suositus?

- **Suosi named exporteja — helpompi refaktoroida ja tree-shake** ✓
- Kaikki default export
- require() ES moduleissa
- Export ei vaikuta import-nimiin

#### `b03-js-modules-import-meta` · diff 3

Bundleri tarvitsee nykyisen moduulin URL:n runtime asset-polkuun. ES-moduuli-API?

- **import.meta.url — moduulin absoluuttinen URL** ✓
- window.location aina
- __dirname CommonJS:ssä ES modulessa
- import.meta on TypeScript-only

#### `b03-js-modules-worker-postmessage` · diff 4

Raskas JSON-parse jäädyttää UI-threadin. Web Worker -integraatio?

- **new Worker() + postMessage data — structured clone siirtää payloadin** ✓
- setTimeout(parse) riittää
- Worker jakaa muistin suoraan
- Workers eivät saa objecteja

#### `b04-js-modules-dynamic-import` · diff 3

Admin-paneeli pitää ladata vain admin-käyttäjille — bundle koko kasvaa. Strategia?

- **Dynamic import(): const admin = await import('./admin.js')** ✓
- Static import kaikille — tree shaking riittää
- document.createElement('script') aina
- iframe erillisellä sivulla

#### `b04-js-modules-export-default` · diff 2

Code review: tiedosto exporttaa sekä default että 5 named exportia — reviewer ihmettelee. Miksi ongelma?

- **Sekava API — yleensä joko default tai named johdonmukaisesti** ✓
- ESM kieltää named exportit
- Default export on deprecated
- Vain yksi export per tiedosto sallittu

#### `b05-js-modules-esm-import` · diff 2

HTML:ssä `<script src='app.js'>` — import/export ei toimi. Korjaus?

- **<script type='module' src='app.js'> — ES modules selaimessa** ✓
- require() selaimessa riittää
- import toimii ilman type=module
- Vain bundler — selain ei tue moduleja

#### `b06-js-modules-reexport` · diff 3

Barrel file exporttaa utils-moduulien API yhdessä paikassa. Miten?

- **export { foo } from './foo.js' — re-export ilman erillistä importtia** ✓
- import foo ja aseta window.foo — barrel kerää API:n globaalisti
- require() barrel-tiedostossa yhdistää utils-moduulit CommonJS:ssä
- export default kaikista moduuleista — yksi default export riittää barrelissa

#### `b07-js-modules-dynamic` · diff 3

Admin-paneeli on harvoin käytössä — haluat ladata sen koodin vain tarvittaessa. ES module?

- **dynamic import() — lazy load admin-moduuli vain tarvittaessa code splittingillä** ✓
- Staattinen import admin-moduulista ylhäällä — bundler optimoi pois käyttämättömän
- Synkroninen script-tag headissä lataa admin-koodin vain admin-sivulla
- require() selaimessa lataa admin-moduulin dynaamisesti ilman bundleria

#### `b07-js-modules-tree-shake` · diff 3

Bundle on iso vaikka käytät yhtä lodash-funktiota. Import-korjaus?

- **Named import lodash-es:stä — import { debounce } from 'lodash-es' tree shakingille** ✓
- import _ from 'lodash' — default import bundlaa vain käytetyt funktiot
- require('lodash') koko paketista — bundler poistaa käyttämättömät automaattisesti
- Kopioi funktio suoraan lähdekoodista — tree shaking ei toimi npm-paketeissa

#### `b08-js-modules-circular` · diff 4

a.js importtaa b.js ja b.js importtaa a.js — export undefined initissä. Juurisyy?

- **Circular dependency — moduuli ei ole fully evaluated export-lukemisen hetkellä** ✓
- ES modules eivät salli syklisiä importteja — bundler estää ne buildissa
- Bundler bug aiheuttaa aina undefined exportit — refaktorointi ei auta
- Import hoisting poistaa syklit automaattisesti — undefined on väliaikainen

#### `b09-js-modules-esm-cjs-interop` · diff 4

Node-projektissa `require('esm-only-pkg')` kaatuu. Oikea lähestymistapa?

- **Siirry type:module tai dynamic import() ESM-only npm-paketeille** ✓
- require toimii kaikille npm-paketeille — ESM-only on harvinainen poikkeus
- Muokkaa node_modules käsin — muunna ESM CommonJS:ksi jokaiselle paketille
- Poista type:module package.jsonista — require toimii taas kaikille

#### `b12-js-modules-assert-type-css` · diff 3

Vite/CSS import komponentissa?

- **import './styles.css' — bundleri käsittelee** ✓
- fetch css runtime
- link tag only
- CSS ei import

#### `b12-js-modules-cjs-esm-interop` · diff 4

Node ESM importtaa CommonJS-moduulin — default export?

- **default voi olla module.exports wrapper — tarkista Node interop** ✓
- Aina named exportit
- Ei toimi
- require only

#### `b12-js-modules-create-require` · diff 4

ESM-tiedostossa tarvitset require kertaluontoisesti?

- **createRequire(import.meta.url)** ✓
- global require
- import require
- ei tuettu

#### `b12-js-modules-default-export` · diff 2

export default function App() — import?

- **import App from './App.js'** ✓
- import { App } default
- require default
- App from ilman polkua

#### `b12-js-modules-dual-package` · diff 5

Kirjasto tarjoaa sekä CJS että ESM — hazard?

- **Dual package hazard — eri instanssit singletonille** ✓
- Aina sama instanssi
- ESM only riittää
- CJS deprecated

#### `b12-js-modules-dynamic-conditional` · diff 3

Lataa moduuli vain adminille. Pattern?

- **if (isAdmin) { const m = await import('./admin.js') }** ✓
- import('./admin') top level aina
- require dynamic
- script tag

#### `b12-js-modules-import-attributes` · diff 4

Haluat importata JSON-moduulin ESM:llä selaimessa. Moderni syntaksi?

- **import data from './config.json' with { type: 'json' }** ✓
- require('./config.json') selaimessa
- import json ei tarvitse attribuutteja
- #include config.json

#### `b12-js-modules-import-defer` · diff 5

ES proposal: import ajetaan vasta kun binding käytetään?

- **import defer — delayed evaluation** ✓
- import lazy keyword
- dynamic import sync
- ei ole mahdollista

#### `b12-js-modules-import-meta-resolve` · diff 4

Node 20+ resolvaa specifierin suhteessa moduuliin?

- **import.meta.resolve(specifier)** ✓
- path.resolve
- __dirname
- require.resolve vain CJS

#### `b12-js-modules-import-order` · diff 3

ESM importit hoistataan — sivuvaikutus järjestyksessä?

- **Staattiset importit ajetaan ennen moduulin koodia dependency-järjestyksessä** ✓
- Järjestys ei merkitse
- import on runtime
- require ensin

#### `b12-js-modules-mjs-cjs-ext` · diff 2

Node ESM-tiedosto ilman type module?

- **Käytä .mjs-päätettä** ✓
- .es6 extension
- .ts suoraan
- Ei eroa

#### `b12-js-modules-namespace-import` · diff 3

import * as utils from './utils.js' — utils on?

- **Namespace-objekti kaikilla exporteilla** ✓
- Array exporteista
- Funktio
- undefined

#### `b12-js-modules-package-exports` · diff 4

package.json exports kenttä — miksi?

- **Määrittää julkiset import-polut ja estää syväimportit** ✓
- Vain npm metadata
- Korvaa main
- TypeScript only

#### `b12-js-modules-reexport` · diff 3

Monorepon barrel-tiedosto kokoaa julkisen API:n kahdesta moduulista ilman import+export -kahdetta askelta. Mikä export-lauseke?

- **export * from './utils.js' ja export { x } from './api.js'** ✓
- import then window.exports
- re-export vaatii CommonJS
- export from on TypeScript-only

#### `b12-js-modules-resolve-alias` · diff 3

Monorepossa `@app/utils` pitää resolvautua `packages/utils/src`. Missä konfiguroit bundlerissa?

- **resolve.alias (Vite/webpack) tai tsconfig paths** ✓
- package.json name riittää aina
- import ei tue aliaksia
- Symlink riittää ilman konfiguraatiota aina

#### `b12-js-modules-side-effects` · diff 3

Bundleri poistaa `import './polyfill.js'` tree-shakingissa ja polyfill puuttuu prodissa. Syy?

- **Side-effect import pitää merkitä package.json sideEffects: false huomio — tai säilyttää import** ✓
- Polyfill import on aina turvallinen
- Vite ei tree-shake
- Side-effect importit eivät voi poistua

#### `b12-js-modules-specifier-must-relative` · diff 2

import from 'lodash' vs './lodash.js' — ero?

- **Paketin nimi vs suhteellinen polku tiedostoon** ✓
- Sama asia
- Absoluuttinen aina
- Ilman ./ ei toimi koskaan

#### `b12-js-modules-treeshake-pure` · diff 4

Bundleri säilyttää kuolleen koodin side-effect funktiossa. Annotaatio?

- **/* @__PURE__ */ tai package sideEffects** ✓
- export default
- void 0
- use strict

#### `b12-js-modules-type-module` · diff 2

Node-projekti käyttää `import` ilman Babelia. package.json-asetus?

- **"type": "module"** ✓
- "esm": true"
- "module": "es6" automaattisesti
- import toimii ilman konfiguraatiota CommonJS-projektissa

#### `b12-js-modules-wasm-import` · diff 4

WebAssembly moduuli ESM:ssä?

- **await WebAssembly.instantiateStreaming(fetch('mod.wasm'))** ✓
- import wasm native
- eval wasm
- Worker only

#### `exp-js-modules-cycle` · diff 4

Circular import: a.js importtaa b.js ja toisin päin — export undefined runtime. Ensimmäinen korjaus?

- **Refaktoroi jaettu logiikka erilliseen kolmanteen moduuliin** ✓
- Lisää window.global väliaikaiseksi sidontapaikaksi syklissä
- Poista export-lauseet — import riittää moduulien väliseen linkitykseen
- CommonJS require ratkaisee circular import -ongelman automaattisesti

#### `exp-js-modules-dynamic-import` · diff 3

Admin-näkymän bundle on liian iso — haluat ladata sen vain admin-reitillä. Miten?

- **dynamic import() reitillä — code splitting erilliseen chunkiin** ✓
- require() bundlerissa lataa admin-moduulin kaikkien mukana
- script-tag jokaisella sivulla varmistaa admin-koodin saatavuuden
- eval() lataa moduulin sisällön runtimeen ilman bundleria

#### `exp-js-modules-top-level-await` · diff 3

config.mjs pitää ladata ennen appin init — callback pyramid. Moderni moduulitason ratkaisu?

- **top-level await ES-moduulissa** ✓
- IIFE sync loop odottaa
- document.write config
- global var ennen importteja

#### `js-modules-static-import` · diff 3

Miten tuot moduulin `utils.js` funktion `format` ESM-tyylillä?

- **import { format } from './utils.js'** ✓
- const format = require('./utils')
- #include "utils.js"
- import format from utils ilman lainausmerkkejä

### js-runtime (49)

#### `b02-js-runtime-closure-12` · diff 3

for-loopissa 10 timeoutia tulostaa kaikki 10 — klassinen bugi. Fix?

- **let i loopissa tai IIFE joka luo erillisen closuren jokaiselle iteraatiolle** ✓
- var i on fine — loop-indeksi on erillinen jokaiselle setTimeout-kutsulle
- Poista closure käyttämällä synkronista for-loopia timeoutin sisällä
- setTimeout on synkroninen — se suorittaa callbackin ennen loopin jatkumista

#### `b02-js-runtime-pollution-14` · diff 4

Käyttäjän JSON merge objektiin — `__proto__` payload. Miten estät?

- **Object.create(null) tai Map; vältä deep mergeä ilman avainvalidointia** ✓
- JSON.parse on aina turvallinen — se ei muokkaa Object.prototype-rakennetta
- Luota client-inputiin kun merge tapahtuu palvelimen ulkopuolella UI:ssa
- eval(JSON) parsii payloadin turvallisesti ilman prototyyppimuutoksia

#### `b02-js-runtime-weakmap-13` · diff 4

Metadata cache objekteille — Map pitää objektit elossa muistivuotona. Vaihtoehto?

- **WeakMap — avaimet eivät estä objektien roskienkeruuta metadata-cachessa** ✓
- Global object registry pitää kaikki objektit elossa käyttöönotosta lähtien
- JSON.stringify avaimista tallentaa metadata-avaimet merkkijonoina Mapiin
- WeakMap ei toimi objektiavaimille — vain string-primitiivit kelpaavat

#### `b03-js-runtime-array-flatmap` · diff 2

Lista kategorioista joissa items-array — tarvitset yhden tason listan kaikista itemeistä. Metodi?

- **categories.flatMap(c => c.items)** ✓
- map + push nested loop aina
- flat() ilman map:ia riittää
- reduce kielletty

#### `b03-js-runtime-error-cause` · diff 3

API wrapper haluaa säilyttää alkuperäisen virheen ketjun loggauksessa. ES2022?

- **throw new Error('context', { cause: originalError })** ✓
- error.stack = original.stack
- console.log original ja throw generic
- cause on TypeScript-only

#### `b03-js-runtime-map-vs-object` · diff 2

Cache avaimena objekti-instanssi — Object keys eivät toimi odotetusti. Rakenne?

- **Map — mikä tahansa arvo avaimena, .size, iteration järjestyksessä** ✓
- Plain {} object aina
- Array.find O(1) lookup
- Map ei salli object-avaimia

#### `b03-js-runtime-structured-clone` · diff 3

Deep copy state Redux-storeen JSON.parse(JSON.stringify(obj)) — Date muuttuu stringiksi. Parempi?

- **structuredClone(obj) — tukee Date, Map, ArrayBuffer** ✓
- Object.assign shallow riittää deep copyyn
- Spread {...obj} deep clone
- eval clone

#### `b04-js-runtime-gc-closure` · diff 4

SPA muistin käyttö kasvaa navigoidessa — vanhat DOM-viittaukset closureissa. Miten estät?

- **Poista event listenerit ja nollaa viittaukset teardownissa; WeakRef/WeakMap tarvittaessa** ✓
- GC hoitaa automaattisesti — ei toimenpiteitä
- location.reload() joka sivulla
- global.gc() tuotannossa

#### `b05-js-fetch-cors-preflight` · diff 4

POST JSON toiselle domainille — selain lähettää OPTIONS ensin. Miksi?

- **CORS preflight — selain tarkistaa cross-origin -luvan custom headereille** ✓
- OPTIONS on API-bugi
- fetch ei tue cross-origin
- Preflight vain HTTP:llä ei HTTPS:llä

#### `b05-js-runtime-dom-reflow` · diff 3

Silmukka lukee offsetHeight ja muuttaa stylea jokaisella kierroksella — UI jäätyy. Ongelma?

- **Layout thrashing — pakottaa reflow jokaisella read-write -parilla** ✓
- offsetHeight on deprecated
- CSS ei vaikuta suorituskykyyn
- requestAnimationFrame hidastaa aina

#### `b05-js-runtime-prototype-pollution` · diff 4

Deep merge user JSON:sta — attacker lähettää `{"__proto__": {"isAdmin": true}}`. Riski?

- **Prototype pollution — Object.prototype muttuu kaikille objekteille** ✓
- JSON.parse estää __proto__ automaattisesti
- Vain localStorage vaarantuu
- Deep merge on aina turvallinen

#### `b06-js-runtime-console-trace` · diff 2

Debug — tarvitset call stack ilman breakpointia. Mitä console-metodia?

- **console.trace() — tulostaa call stackin ilman breakpointia** ✓
- console.log() sisältää call stackin automaattisesti jokaisessa tulosteessa
- debugger-lause on suositeltu tapa tuotannossa stack-tracen hakuun
- console.dir() tulostaa funktiokutsujen pinon samalla tavalla kuin trace

#### `b06-js-runtime-finalization-registry` · diff 5

WeakRef ei takaa cleanup — tarvitset callback kun objekti GC:ttä. Mitä API?

- **FinalizationRegistry — cleanup-callback kun objekti on GC:tty** ✓
- WeakRef kutsuu callbackia automaattisesti kun referoitu objekti kerätään
- Object.finalize on standardi tapa rekisteröidä GC-cleanup kaikille objekteille
- setInterval pollaa WeakRef.deref() ja vapauttaa resurssit manuaalisesti

#### `b06-js-runtime-json-parse-reviver` · diff 4

JSON.parse palauttaa date stringit — haluat Date-objekteja automaattisesti. Miten?

- **JSON.parse(text, reviver) — reviver muuntaa parsatut arvot kuten Date-objektit** ✓
- Date.parse jokaiselle kentälle manuaalisesti loopissa parsauksen jälkeen
- JSON-formaatti ei tue päivämääriä — Date-objekteja ei voi palauttaa
- eval() JSON-merkkijonolla korvaa parse:n ja palauttaa Date-objektit suoraan

#### `b06-js-runtime-proxy-freeze` · diff 4

Object.freeze ei estä nested muutoksia — config objekti mutatoitu. Miten syvä immutability?

- **Rekursiivinen freeze tai structured clone + freeze — shallow ei suojaa nested** ✓
- Object.freeze on syvä immuuttisuus — nested propertyt eivät muutu
- const-esto estää nested-muutokset koska viittaus ei voi vaihtua
- JSON.parse(JSON.stringify(config)) takaa syvän immuuttisuuden aina turvallisesti

#### `b07-js-runtime-json-parse` · diff 2

API palauttaa JSON-stringin — eval(data) parseen. Turvallinen tapa?

- **JSON.parse(data) — parsii datan ilman koodin suorittamista** ✓
- eval(data) on nopein tapa parsia JSON-merkkijono suurissa datamäärissä
- new Function(data) on turvallinen vaihtoehto eval:lle JSON-parsauksessa
- innerHTML data-kentällä parsii JSON:n ja renderöi DOM-elementit suoraan

#### `b07-js-runtime-prototype` · diff 3

Kaikki array-instanssit saivat uuden metodin forEachin jälkeen — mitä teit?

- **Array.prototype muokattu — vältä, käytä erillistä utility-funktiota** ✓
- Built-in prototyyppien laajentaminen on best practice ja nopeuttaa koodia
- Object.prototype on parempi kohde kuin Array.prototype uusille metodeille
- Prototype-muokkaus nopeuttaa aina suoritusta koska metodi on jaettu

#### `b07-js-runtime-weakmap` · diff 4

Cache Map DOM-elementeistä aiheuttaa memory leakin sivun vaihtuessa. Parempi rakenne?

- **WeakMap — avaimet voivat GC:tä ilman explicit delete-kutsua** ✓
- Map + manual delete riittää aina — GC kerää avaimet automaattisesti
- Globaali array DOM-elementeistä ei aiheuta memory leakia navigoinnissa
- localStorage-cache DOM-elementeille estää muistivuodon sivun vaihtuessa

#### `b08-js-runtime-closure-loop` · diff 3

for (var i=0; i<3; i++) { setTimeout(() => console.log(i), 0); } tulostaa 3,3,3. Korjaus?

- **let i — block scope per iteratio — tai IIFE/param capture var-ongelmaan** ✓
- var on aina oikein loopissa — function scope luo erillisen sidonnan
- setTimeout ajaa synkronisesti loopin aikana ennen callback-rekisteröintiä
- Poista closure — nuolifunktio ei sieppaa ympäröivän scopen muuttujia

#### `b08-js-runtime-dom-ready` · diff 2

Script headissä — document.getElementById palauttaa null. Milloin DOM on valmis?

- **DOMContentLoaded — tai script defer/module body:n lopussa** ✓
- window.load on nopein tapa käyttää DOM-elementtejä head-scriptissä
- DOM on valmis heti parserin alussa — getElementById toimii head-scriptissä
- async script takaa DOM-valmiuden ennen callback-funktion suoritusta

#### `b08-js-runtime-prototype-chain` · diff 3

`obj.toString()` toimii vaikka obj:ssa ei ole toString — miten?

- **Prototype chain — etsitään obj.__proto__ → Object.prototype** ✓
- JavaScript kääntää objektin automaattisesti ja lisää toString-metodin
- Kaikki metodit kopioidaan jokaiseen objektiin luontihetkellä erikseen
- Vain class-instanssit perivät metodit — plain objectit eivät käytä prototyyppiä

#### `b09-js-runtime-closure-leak` · diff 4

SPA:n muisti kasvaa navigoidessa — DevTools näyttää detached DOM -nodeja. Syy?

- **Event listenerit tai closuret pitävät viittauksia poistettuihin DOM-elementteihin** ✓
- GC ei toimi moderneissa selaimissa — detached nodeja ei kerätä koskaan
- innerHTML tyhjentää aina listenerit — ei tarvitse removeEventListener
- Muistivuoto on vain Node-ongelma — selaimet vapauttavat DOM-automaattisesti

#### `b09-js-runtime-raf-animation` · diff 3

Custom animaatio pätkii — setInterval 16 ms ei synkronoidu näytön refreshiin. Korjaus?

- **requestAnimationFrame synkronoituu näytön refreshiin — sulavampi animaatio** ✓
- setInterval(0) on nopein animaatiotapa — ei tarvitse rAF-synkronointia näytön kanssa
- CSS animation ei toimi JavaScript-animaation kanssa samalla elementillä
- while-loop animaatioon — suorittaa frame-päivitykset synkronisesti loopissa

#### `b09-js-runtime-weakmap-cache` · diff 3

Cacheta metadata DOM-elementeille ilman että estät GC:n poistamasta elementtejä. Rakenne?

- **WeakMap — avaimet voivat kerätä roskikseen ilman explicit deletea** ✓
- Map element-avaimilla on aina turvallinen — GC kerää avaimet automaattisesti
- Globaali object registry metadata-tallennukseen — ei estä elementin GC:ta
- element.metadata property aina — kevyempi kuin WeakMap tai Map

#### `b12-js-runtime-arraybuffer-view` · diff 4

Binary data WebSocketista — tyyppi ennen käsittelyä?

- **ArrayBuffer / Uint8Array view** ✓
- string aina
- JSON.parse buffer
- Blob.text only

#### `b12-js-runtime-computed-property` · diff 2

Objekti { [key]: value } — mitä hakasulut tekevät?

- **Computed property name — dynaaminen avain** ✓
- Array syntax
- Destructuring
- JSON

#### `b12-js-runtime-custom-event` · diff 2

Komponentit kommunikoivat ilman props-ketjua. DOM-ratkaisu?

- **new CustomEvent('name', { detail }) + dispatchEvent** ✓
- window.alert
- global var
- eval

#### `b12-js-runtime-domparser` · diff 3

Parse HTML string turvallisesti ilman innerHTML suoraa?

- **DOMParser.parseFromString + sanitize policy** ✓
- eval HTML
- document.write
- innerHTML aina turvallinen

#### `b12-js-runtime-error-stack-limit` · diff 4

Recursive funktio RangeError Maximum call stack. Syy?

- **Call stack overflow — liian syvä rekursio** ✓
- Heap overflow
- Syntax error
- async stack

#### `b12-js-runtime-event-delegation` · diff 2

Lista renderöi 500 riviä — jokaiselle riville oma click-listener. Suorituskykyongelma. Korjaus?

- **Event delegation — yksi listener parentille, event.target tarkistus** ✓
- 500 listeneriä on aina OK
- onclick inline HTML aina nopein
- removeEventListener ei toimi

#### `b12-js-runtime-intersection-observer` · diff 3

Lazy-load kuvat kun scrollaa näkyviin. API?

- **IntersectionObserver + data-src** ✓
- scroll event jokaiselle px
- getBoundingClientRect loop
- onload window

#### `b12-js-runtime-intl-collator` · diff 3

Järjestät suomenkielisiä nimiä — localeCompare vs Intl.Collator?

- **Intl.Collator('fi') tehokkaampi toistuvassa sortissa** ✓
- sort() ei tue localea
- binäärijärjestys aina oikein
- Collator on deprecated

#### `b12-js-runtime-label-break` · diff 3

Sisäkkäisestä silmukasta ulos kahdesta tasosta. Lähestymistapa?

- **Labeled break / refaktoroi funktioksi** ✓
- goto on standardi
- return aina toimii
- throw flow control

#### `b12-js-runtime-mutation-observer` · diff 3

Kolmas osapuoli injektoi DOM-muutoksia — haluat reagoida. API?

- **MutationObserver callback DOM-muutoksille** ✓
- setInterval DOM check
- Object.watch
- Proxy DOM

#### `b12-js-runtime-object-freeze` · diff 3

Redux-tyylinen store haluaa estää suoran state-mutaation. Shallow-immutability?

- **Object.freeze(state) — shallow; deep freeze erikseen jos tarvitaan** ✓
- const state riittää deep immutabilityyn
- freeze estää myös nested objektien muutokset automaattisesti
- JSON.parse(JSON.stringify) on ainoa tapa

#### `b12-js-runtime-performance-now` · diff 3

Mittaat koodin keston tarkasti — Date.now() vs performance.now()?

- **performance.now() korkeampi resoluutio monotonic** ✓
- Date.now() tarkempi
- Sama
- process.hrtime selaimessa

#### `b12-js-runtime-proxy-trap` · diff 4

Haluat logata kaikki objektin property-luvut debugissa. Metaprogramming-ratkaisu?

- **new Proxy(target, { get(trap) { log; return Reflect.get(...) } })** ✓
- Object.observe on standardi ES2024
- getter jokaiselle avaimelle manuaalisesti skaalautuu
- Proxy estää kaiken property accessin

#### `b12-js-runtime-raf-vs-timeout` · diff 2

Animaatio päivittää DOM-elementin sijaintia 60 fps. Parempi kuin setInterval(16)?

- **requestAnimationFrame — synkronoituu näytön päivitykseen** ✓
- setTimeout(0) riittää animaatioon
- while-loop DOM-päivityksessä
- requestAnimationFrame on Node-only

#### `b12-js-runtime-regex-exec` · diff 3

global regex lastIndex bug loopissa — syy?

- **lastIndex muistaa viimeisen osuman — resetoi tai käytä matchAll** ✓
- regex on immutable
- exec ei muuta
- bug selaimessa

#### `b12-js-runtime-resize-observer` · diff 3

CSS grid resize — haluat mitata elementin koon muutokset. API?

- **ResizeObserver** ✓
- window.resize only
- getComputedStyle loop
- MutationObserver size

#### `b12-js-runtime-set-map-iteration` · diff 2

Set säilyttää uniikit — lisäät duplikaatin. Mitä tapahtuu?

- **Duplikaatti hylätään — size ei kasva** ✓
- Set kaatuu
- Viimeinen voittaa
- Muuttuu Mapiksi

#### `b12-js-runtime-tail-call` · diff 5

ES6 tail call optimization — status JS-engingeissä?

- **Ei laajaa tukea — älä luota TCO:hon rekursioon** ✓
- Kaikissa selaimissa
- Vain strict mode
- Korvaa loop

#### `b12-js-runtime-weakref-cache` · diff 5

Cache viittaa isoihin objekteihin ja estää GC:n vaikka UI on vapauttanut ne. Etenevä ratkaisu?

- **WeakRef + FinalizationRegistry — ei pidä objektia elossa** ✓
- Map aina — GC hoitaa automaattisesti
- global.gc() tuotannossa
- WeakRef estää objektin keräämisen ikuisesti

#### `b12-js-runtime-weakset-gc` · diff 3

WeakSet vs Set objektiavainten jäljitykseen DOM-nodeille?

- **WeakSet ei estä GC:tä — node voi vapautua** ✓
- WeakSet pitää elossa
- Sama kuin Set
- WeakSet vain primitive

#### `exp-js-runtime-closure-stale` · diff 4

React bugi: useEffect closure näkee vanhan `count`-arvon — interval loggaa 0 ikuisesti. Miksi?

- **Stale closure — päivitä deps-array tai käytä funktionaalista updatea** ✓
- JavaScript ei tue closureja setInterval-kontekstissa lainkaan
- let avainsana korjaa automaattisesti vanhan arvon intervalissa
- setInterval ei sieppaa muuttujia closuren kautta koskaan

#### `exp-js-runtime-memory-detached` · diff 4

Web Worker postMessage hidastuu — suuri ArrayBuffer kopioidaan joka viestissä. Optimointi?

- **postMessage(buffer, [buffer]) transfer list — omistajuuden siirto** ✓
- JSON.stringify serialisoi ArrayBufferin nopeasti viestin mukana
- SharedWorker on aina nopeampi kuin tavallinen Web Worker
- Blob-klonaus on nopein tapa siirtää suuri buffer workerille

#### `exp-js-runtime-prototype-pollution` · diff 5

Code review: `merge(userInput, defaults)` kopioi avaimet rekursiivisesti ilman __proto__ suojaa. Riski?

- **Prototype pollution — Object.prototype saastuu userInput-avaimilla** ✓
- JSON.parse on turvallinen — se ei koskaan muokkaa prototyyppiketjua
- Riski on vain SQL injection kun merge käyttää tietokantakyselyä
- Rekursiivinen merge on aina turvallinen objektiargumenteille

#### `exp-js-runtime-weakmap-cache` · diff 3

DOM-elementtiin liitetty metadata aiheuttaa memory leakin Mapissa. Parempi rakenne?

- **WeakMap — objektiavain ei estä elementin roskienkeruuta** ✓
- global object tallentaa DOM-metadataa pysyvästi muistissa
- localStorage DOM-id:llä säilyttää metadatan sivun latausten välillä
- WeakMap ei salli objektiavaimia — vain primitiivit kelpaavat

#### `js-runtime-closure-loop` · diff 4

for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); } — mitä tulostuu?

- **3, 3, 3 — var ei luo erillistä lohkoscopea iteraatiolle** ✓
- 0, 1, 2 — setTimeout lukitsee loop-indeksin arvoksi
- undefined × 3 — i on määrittelemätön callback-hetkellä
- Syntaksivirhe — var ja nuoli estävät setTimeout-kutsun

### js-types (48)

#### `b02-js-types-coalesce-06` · diff 2

Portti 0 on kelvollinen arvo. Oletus 3000 saa tulla vain kun konfiguraatio puuttuu kokonaan. Mikä ES2020-operaattori eroaa `||`:sta tässä tapauksessa?

- **Nullish coalescing: port ?? 3000 säilyttää arvon 0 sellaisenaan** ✓
- port || 3000 toimii identtisesti ??-operaattorin kanssa kaikissa tapauksissa
- port ? port : 3000 estää nollan käytön oletusarvona konfiguraatiossa
- port + 3000 laskee oletusportin matemaattisesti null-tilanteessa

#### `b02-js-types-optional-05` · diff 2

API palauttaa `{ name?: string }` — miten luet turvallisesti ilman undefined crash?

- **Optional chaining: user?.profile?.name turvalliseen syvään lukemiseen** ✓
- user.profile.name toimii kun API palauttaa joskus undefined-kentän
- == null -tarkistus kattaa kaikki syvän property access -tapaukset
- eval() lukee kentän arvon dynaamisesti objektista ilman tyyppivirhettä

#### `b02-js-types-strict-07` · diff 2

Bugi: `if (count == '0')` menee läpi kun count on 0. Fix?

- **Käytä === tiukkaan vertailuun ilman tyyppimuunnosta** ✓
- == on turvallisempi kuin === koska se normalisoi arvot automaattisesti
- Muuta count stringiksi ennen vertailua — se poistaa bugin kokonaan
- Poista vertailu kokonaan — falsy-tarkistus korvaa tarpeen ===-operaattorille

#### `b03-js-types-number-precision` · diff 3

Laskin näyttää 0.1 + 0.2 === 0.3 false — laskutuskoodi valittaa senteistä. Ratkaisu?

- **Integer-sentit tai desimaalikirjasto — älä vertaa float-arvoja suoraan** ✓
- Math.round korjaa kaikki desimaaliylitykset billing-laskennassa luotettavasti
- parseInt kaikille desimaaliarvoille säilyttää senttien tarkkuuden kokonaislukuna
- Number-tyyppi on tarkka desimaalilaskennassa IEEE-754-standardin mukaisesti

#### `b03-js-types-optional-chaining` · diff 2

Dashboard asettaa `document.title = user.profile.name`, mutta vanhentuneella sessiolla API palauttaa `user: null`. Sentry täyttyy TypeError-virheistä. Mikä operaattori tekee syvästä polusta turvallisen ilman if-ketjua?

- **Optional chaining: user?.profile?.name estää TypeError null-polulla** ✓
- try/catch jokaisella rivillä on kevyin tapa käsitellä puuttuvia kenttiä
- == null -tarkistus kattaa kaikki syvät property access -polut luotettavasti
- eval + JSON.parse lukee API-vastauksen ja normalisoi puuttuvat kentät

#### `b03-js-types-symbol-key` · diff 4

Kirjasto haluaa piilottaa metadatan objektista ilman name collision -riskiä. Tyyppi?

- **Symbol('meta') avaimena — ei näy Object.keys():ssa** ✓
- _meta string property
- global variable
- Symbol on sama kuin string

#### `b04-js-types-array-flat` · diff 2

Nested array [[1,[2]],3] pitää litistää yhdeksi tasoksi. Moderni metodi?

- **arr.flat(Infinity) tai flat(2) tarvittava syvyys** ✓
- JSON.stringify + parse
- eval flatten
- for + splice ainoa tapa

#### `b04-js-types-number-precision` · diff 3

Laskin: 0.1 + 0.2 === 0.3 palauttaa false tuotannossa. Miksi?

- **IEEE 754 double — desimaalit eivät aina tarkkoja; käytä integer senttejä tai decimal-kirjastoa** ✓
- Bugi V8:ssä — päivitä selain
- === on väärä — käytä ==
- Number on aina 32-bit integer

#### `b04-js-types-optional-chaining` · diff 2

React-komponentti renderöi `user.profile.name` heti mountissa. Kun käyttäjädata latautuu asynkronisesti, `user` on ensin null ja tuotannossa tulee TypeError. Mikä ES2020-operaattori korvaa pitkän if-ketjun?

- **Optional chaining (?.) — property access palauttaa undefined null-polulla** ✓
- user.profile.name || '' — riittää nullille
- eval('user.profile.name')
- with(user) { profile.name }

#### `b04-js-types-symbol-iterator` · diff 4

Oma luokka pitää käyttäytyä kuten natiivi taulukko for...of-silmukassa ja spreadissa. Mitä well-known symbolia luokka tarvitsee?

- **Symbol.iterator metodi joka palauttaa iterator-objektin** ✓
- toString() riittää
- Array.prototype.push luokkaan
- forEach on sama kuin iterable

#### `b05-js-types-bigint-json` · diff 4

JSON.stringify(BigInt(42)) heittää TypeError. Miksi?

- **JSON ei tue BigInt-serialisointia natiivisti — custom replacer tai string** ✓
- BigInt on deprecated
- JSON.stringify muuntaa automaattisesti numberiksi
- parseInt korjaa serialisoinnin

#### `b05-js-types-strict-equality` · diff 2

Code review: `if (status == '200')` — miksi pyydetään muutosta?

- **=== välttää implisiittisen tyyppimuunnoksen (esim. 200 == '200')** ✓
- == on nopeampi tuotannossa
- === toimii vain numeroille
- Vertailu ei tarvitse === koskaan

#### `b06-js-types-in-operator` · diff 2

Code review: 'key' in obj vs obj.hasOwnProperty(key). Milloin in on oikea?

- **in tarkistaa koko prototype-ketjun — hasOwnProperty vain oman propertyn** ✓
- in ja hasOwnProperty ovat identtiset kun avain on merkkijono
- in-operaattori on deprecated ES6:ssa — käytä Object.hasOwn sen sijaan
- hasOwnProperty tarkistaa perittyjä propertyjä prototype-ketjussa

#### `b06-js-types-map-key-object` · diff 3

Objekti avaimena Mapissa — sama key instance löytyy. Miksi ei Object avaimella?

- **Map vertaa objektiavaimia referenssillä — SameValueZero, ei sisältöä** ✓
- Map stringifioi objektiavaimet automaattisesti kuten tavallinen objekti
- Map ei hyväksy objektiavaimia — vain primitiivit kelpaavat avaimiksi
- JSON.stringify tekee objektiavaimet uniikeiksi Mapissa riippumatta referenssistä

#### `b06-js-types-temporal-date` · diff 3

Date.parse('01/02/2023') tulos vaihtelee locale:sta. Miten vältät?

- **ISO 8601 YYYY-MM-DD tai Temporal API — välttää locale-riippuvaisen parsauksen** ✓
- Date.parse on deterministinen kaikissa selaimissa riippumatta locale-asetuksista
- getMonth()-kutsu korjaa locale-parsauksen epäselvyyden jälkikäteen automaattisesti
- Timestamp-merkkijono ilman timezone-tietoa on aina turvallinen parsausmuoto

#### `b07-js-types-nan` · diff 3

parseInt palauttaa NaN — if (x === NaN) ei toimi. Oikea testi?

- **Number.isNaN(x) — NaN ei ole === itsensä kanssa JavaScriptissä** ✓
- x == NaN toimii luotettavasti koska loose equality normalisoi NaN-arvot
- typeof x === NaN paljastaa NaN-arvon kuten muut primitiivit typeofilla
- isNaN(x) riittää aina — se ei tee type coercionia ennen tarkistusta

#### `b07-js-types-optional-chain` · diff 2

Konsolissa: `TypeError: Cannot read properties of undefined (reading 'name')` rivillä `response.data.user.profile.name`. API palauttaa joskus `{ user: null }`. Mikä ES2020-operaattori lyhentää null check -ketjua?

- **Optional chaining — user?.profile?.name katkaisee polun undefined-kohdassa** ✓
- user.profile.name toimii aina kun API palauttaa vähintään tyhjän objektin
- eval(polku) lukee syvän objektipolun dynaamisesti ilman undefined-riskiä
- JSON.parse korjaa undefined-virheet muuttamalla puuttuvat kentät null-arvoiksi

#### `b07-js-types-strict-equality` · diff 2

Bug: `if (!userId)` hylkää validin arvon `0`. Mikä tarkistus on turvallisempi?

- **Eksplisiittinen null/undefined-tarkistus — 0 on validi id, !userId hylkää sen** ✓
- !userId on aina oikea tapa tarkistaa puuttuva tunniste kaikissa tapauksissa
- userId == null hylkää myös arvon 0 koska nolla on falsy vertailussa
- String(userId) korjaa falsy-ongelman muuttamalla nollan merkkijonoksi

#### `b08-js-types-bigint` · diff 3

64-bit ID ylittää Number.MAX_SAFE_INTEGER — JSON API palauttaa ison numeron. Tyyppi?

- **BigInt — 123n tai BigInt(string) — älä sekoita Numberiin ilman tarkistusta** ✓
- parseFloat riittää 64-bit ID:n tarkkuuteen JSON-vastauksessa
- Number on aina 64-bit tarkka — MAX_SAFE_INTEGER kattaa kaikki ID:t
- BigInt ei serialisoidu JSON:iin — käytä aina Number suurille tunnisteille

#### `b08-js-types-strict-equals` · diff 2

API hylkää vain `if (token == null) return unauthorized()`. Mikä arvo pääsee läpi virheellisesti?

- **Tyhjä merkkijono '' — ei ole null eikä undefined, joten == null ei laukea** ✓
- '' == null on tosi, joten token == null -tarkistus hylkää tyhjän merkkijonon
- if(token) hylkää aina tyhjän merkkijonon — sama kuin null-tarkistus
- typeof token == null toimii luotettavasti puuttuvan tokenin tunnistamiseen

#### `b08-js-types-symbol-key` · diff 3

Haluat piilottaa objektin sisäisen avaimen for-in loopilta mutta käyttää sitä metodissa. Avaintyyppi?

- **Symbol('internal') — ei enumerable oletuksena, piilossa for-in loopilta** ✓
- Merkkijono prefix _ riittää piilottamaan avaimen for-in ja Object.keys:iltä
- Symbol serialisoituu JSON:iin automaattisesti kuten merkkijonoavaimet
- Map vaatii Symbol-avaimia — primitiivit eivät kelpaa Map-avaimiksi

#### `b09-js-types-null-object` · diff 3

Bugi: `typeof null === 'object'`. Turvallinen null-tarkistus?

- **value === null tai value == null — null/undefined erikseen typeofista** ✓
- typeof value === 'null' — oikea tapa tunnistaa null JavaScriptissä
- value instanceof Object erottaa nullin primitiiveistä luotettavasti
- Object.isObject(value) — standardi API null-tarkistukseen

#### `b09-js-types-strict-equality` · diff 2

Code review: `if (userId == 0)` hyväksyy myös tyhjän stringin. Korjaus?

- **Käytä === strict equality — ei type coercion tyhjän stringin kanssa** ✓
- == on turvallisempi ===:aa — se normalisoi tyypit ennen vertailua
- Muuta userId stringiksi — vertailu toimii oikein kaikilla arvoilla
- if (!userId) korvaa vertailun aina — hylkää sekä 0:n että tyhjän stringin

#### `b12-js-types-array-push` · diff 1

Lista `items = []` — haluat lisätä uuden rivin loppuun. Metodi?

- **items.push(newItem)** ✓
- items.add(newItem) kuten Setissä
- items.append() on Array-API
- items[length] = undefined lisää aina

#### `b12-js-types-const-reassign` · diff 1

Junior yrittää `const x = 1; x = 2;` — linter valittaa. Miksi?

- **const estää uudelleensijoituksen — arvo ei voi vaihtua** ✓
- const muuttujat poistetaan automaattisesti käytön jälkeen
- const toimii vain funktioiden sisällä
- const vaatii aina tyypityksen TypeScriptissä

#### `b12-js-types-destructure-default` · diff 2

Destructuroit { name, role = 'user' } — role puuttuu. Arvo?

- **role on 'user' — default destructuringissä** ✓
- undefined
- Tyhjä string
- Virhe heitetään

#### `b12-js-types-instanceof-array` · diff 3

Miksi `[] instanceof Object` on true mutta Array.isArray suositeltu?

- **instanceof ei erota arraya cross-realm / iframe kontekstissa luotavasta** ✓
- instanceof on aina väärä
- Array ei ole Object
- isArray on deprecated

#### `b12-js-types-intl-numberformat` · diff 3

Näytät hinnan suomalaiselle käyttäjälle: 1234.5 → '1 234,50 €'. API?

- **new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' })** ✓
- toFixed + manuaalinen pilkku
- Number.toLocaleString ei tue valuuttaa
- printf JS:ssä natiivi

#### `b12-js-types-isarray` · diff 2

Funktio saa `data` joka voi olla array tai array-like. Luotettava tarkistus?

- **Array.isArray(data)** ✓
- typeof data === 'array'
- data instanceof Object
- data.length > 0 tarkoittaa arraya

#### `b12-js-types-json-stringify` · diff 2

API lähettää objektin HTTP-bodyna. Miten muunnat JS-objektin JSON-merkkijonoksi?

- **JSON.stringify(obj)** ✓
- obj.toString() riittää aina
- String(obj) säilyttää avaimet
- JSON.parse muuntaa objektista stringiin

#### `b12-js-types-let-block` · diff 1

for-silmukassa `var i` vuotaa loopin ulkopuolelle. Turvallisempi vaihtoehto?

- **let — lohkoscoped muuttuja** ✓
- global i ilman avainsanaa
- var on ainoa tapa loop-muuttujalle
- const i++ toimii silmukassa

#### `b12-js-types-nan-check` · diff 2

Laskenta palauttaa NaN — `value === NaN` on aina false. Miten tarkistat?

- **Number.isNaN(value) tai Object.is(value, NaN)** ✓
- value == NaN toimii loose equalityllä
- typeof value === 'nan'
- isNaN ei ole JavaScriptissä

#### `b12-js-types-object-keys-values` · diff 3

Haluat iteroida objektin arvot ilman for...in prototyypin perintää. Metodi?

- **Object.values(obj) tai Object.entries(obj)** ✓
- for...in ilman hasOwnProperty aina turvallinen
- obj.map()
- Object.keys palauttaa arvot

#### `b12-js-types-object-shorthand` · diff 2

Mikä ES6-ominaisuus lyhentää `{ id: id, name: name }` kun muuttujien nimet vastaavat avaimia?

- **{ id, name } — property shorthand** ✓
- { id: id, name: name } on ainoa tapa
- Object.create(id, name)
- new Map(id, name)

#### `b12-js-types-parseint-radix` · diff 3

parseInt('08') vanhassa JS:ssä — miksi radix 10 on pakollinen?

- **Ilman radixia etunolla voi tulkita oktaaliksi historiallisesti** ✓
- parseInt ei ota radixia
- Radix 16 aina
- parseInt on deprecated

#### `b12-js-types-rest-params` · diff 2

Funktio ottaa vaihtelevan määrän numeroita yhtenä parametrina taulukkona. Mikä parametrimuoto kerää ylimääräiset argumentit?

- **Rest parameter kerää loput argumentit taulukoksi** ✓
- Spread kopioi taulukon
- Vain arrow-funktioissa
- nums on aina tyhjä

#### `b12-js-types-spread-copy` · diff 2

Haluat kopioda taulukon ilman että muokkaat alkuperäistä pushilla. Nopea tapa?

- **const copy = [...original]** ✓
- const copy = original — riittää erillinen muuttujanimi
- original.clone() on natiivi
- Spread toimii vain objekteissa

#### `b12-js-types-structured-equality` · diff 3

Kaksi eri objektia {a:1} ja {a:1} — {} === {} on false. Miksi?

- **Objektit vertaillaan viittauksella — eri instanssit** ✓
- Sisältövertailu automaattisesti
- Object.is vertaa deep
- JSON.stringify vertailu on standardi

#### `b12-js-types-symbol-tostring` · diff 4

Object.keys() ei näytä Symbol-avaimia. Miten iteroidaan ne?

- **Object.getOwnPropertySymbols(obj)** ✓
- Object.keys sisältää symbolit
- JSON.stringify säilyttää symbolit
- Symbolit ovat enumerable oletuksena

#### `b12-js-types-template-literal` · diff 1

Haluat rakentaa tervehdyksen muuttujasta `name` ilman `+`-ketjua (`'Hei ' + name + '!'`). Mikä syntaksi upottaa arvon merkkijonoon?

- **Template literal backtick-merkeillä ja ${}-interpoloinnilla** ✓
- 'Hei $name' yksinkertaisilla heittomerkeillä
- sprintf() on ainoa tapa JS:ssä
- String.concat vaatii kolme argumenttia

#### `b12-js-types-temporal-api` · diff 4

Date on mutatoitava ja timezone-bugeja. Moderni ES-proposal korvaajaksi?

- **Temporal API (stage 3) — immutable datetime** ✓
- moment.js on standardi
- Date.setUTC riittää
- Timestamp number aina

#### `b12-js-types-truthy-falsy` · diff 2

Lomakevalidointi: `if (!value)` hylkää syötteen '0'. Parempi tarkistus tyhjälle kentälle?

- **value === '' || value == null — älä käytä pelkkää falsy** ✓
- !value on aina oikein
- Boolean(value) erottaa 0:n
- value === false riittää

#### `b12-js-types-typeof-string` · diff 1

Mikä `typeof 'hello'` palauttaa?

- **'string'** ✓
- 'text'
- 'String'
- 'object'

#### `exp-js-types-bigint-json` · diff 4

API palauttaa 64-bit ID:n — JSON.parse menettää tarkkuuden. Miten käsittelet?

- **BigInt tai merkkijono ID:nä ennen Number-muunnosta JSON-datassa** ✓
- Number-tyyppi säilyttää 64-bit kokonaisluvun tarkkuuden aina
- parseFloat palauttaa tarkan integer-arvon desimaalimerkkijonosta
- JSON.parse tukee BigInt-tyyppiä natiivisti ilman muunnosta

#### `exp-js-types-nullish-coalescing` · diff 2

Palvelimen timeout-asetus 0 tarkoittaa 'ei timeoutia', mutta konfiguraatiolukija korvaa sen oletuksella 5000. Mikä oletusarvo-operaattori säilyttää nollan mutta korvaa puuttuvan arvon?

- **?? korvaa vain null/undefined — säilyttää arvon 0 oletuksena** ✓
- == false -tarkistus erottaa nollan ja tyhjän arvon toisistaan
- eval lukee config-merkkijonon ja palauttaa objektin suoraan runtimeen
- parseInt muuntaa jokaisen config-arvon kokonaisluvuksi ennen vertailua

#### `exp-js-types-strict-equality` · diff 2

Auth-bugi: `if (!token)` hylkää validin tyhjän merkkijonon `''` ja sallii `0`. Turvallisempi tarkistus?

- **Eksplisiittinen validointi: typeof token === 'string' && token.length** ✓
- Loose equality (==) riittää tokenin olemassaolon varmistamiseen
- typeof token == 'null' paljastaa puuttuvan tokenin reviewissa luotettavasti
- Object.is vertaa kaikki arvotyypit yhdellä geneerisellä equality-tarkistuksella

#### `js-types-null-object` · diff 3

Miksi `typeof null === 'object'` on historiallinen ansa?

- **ES-historiallinen vika — käytä eksplisiittistä === null -tarkistusta** ✓
- null on primitiivi joka tallentuu object-tyyppinä muistissa
- typeof-operaattori poistettiin ES6-moduulireformissa kokonaan
- Ongelma on vain TypeScript-kääntäjän tiukan tyypityksen aiheuttama

#### `js-types-strict-eq` · diff 2

Miksi `===` on turvallisempi kuin `==` vertailussa?

- **Tiukka vertailu ilman implisiittistä tyyppimuunnosta** ✓
- === on merkittävästi nopeampi kuin == vertailuissa
- == estää null- ja undefined-vertailun kokonaan käytöstä
- Operaattoreilla ei ole käytännön eroa vertailun tuloksessa

### js-typescript (21)

#### `b12-ts-as-const` · diff 3

const config = { mode: 'dev' } as const — hyöty?

- **Literal types + readonly deep** ✓
- Nopeampi compile
- Runtime freeze
- any

#### `b12-ts-basic-enum-string` · diff 2

Tila voi olla 'draft' | 'published' | 'archived'. Tyypitetty vakiomuoto ilman runtime enumia?

- **type Status = 'draft' | 'published' | 'archived'** ✓
- enum Status { draft, published } aina pakollinen
- const Status = string
- Union stringeistä ei ole sallittu

#### `b12-ts-basic-interface-shape` · diff 1

API-vastauksella on kentät `id` ja `title`. Miten kuvailet muodon TS:ssä?

- **interface User { id: string; title: string }** ✓
- type User = class { id, title }
- User implements JSON
- interface vaatii aina extends Object

#### `b12-ts-basic-primitive-types` · diff 1

TypeScriptissä haluat merkitä että `age` on numero. Tyyppi?

- **let age: number** ✓
- let age: int
- let age: integer
- let age: Number wrapper aina

#### `b12-ts-basic-type-annotation-fn` · diff 2

Funktio `add(a, b)` palauttaa summan. Parametrien ja paluuarvon tyypitys?

- **function add(a: number, b: number): number** ✓
- function add(number a, number b)
- add: Function riittää
- Paluutyyppi ei ole TS:ssä sallittu

#### `b12-ts-basic-union-null` · diff 2

Funktio voi palauttaa käyttäjän tai null jos ei löydy. Paluutyyppi?

- **User | null** ✓
- User? on virallinen TS-syntaksi nullille
- any riittää
- User null ei ole union

#### `b12-ts-conditional-type` · diff 5

type IsString<T> = T extends string ? true : false — laji?

- **Exhaustiveness check — uusi variantti compile error** ✓
- Runtime throw only
- Dead code
- any default

#### `b12-ts-generic-constraint` · diff 4

T extends { id: string } — tarkoitus?

- **Rajoittaa genericin minimimuotoon** ✓
- Perii luokan
- Estää genericin
- Runtime check

#### `b12-ts-generic-function` · diff 3

identity<T>(arg: T): T — miksi generic?

- **Säilyttää tyypin parametrista paluuarvoon** ✓
- any nopeampi
- T on runtime
- vain class

#### `b12-ts-interface-extends` · diff 2

BaseUser + adminRole — miten laajennat?

- **interface Admin extends BaseUser { adminRole: string }** ✓
- interface Admin = BaseUser
- extends vain class
- merge automaattinen

#### `b12-ts-mapped-type` · diff 5

type ReadonlyFields<T> = { readonly [K in keyof T]: T[K] }

- **Conditional type — type-level logiikka** ✓
- Runtime ternary
- Interface only
- Ei TS:ssä

#### `b12-ts-narrowing-in` · diff 3

if ('kind' in obj) — mitä tämä tekee?

- **Property narrowing — tarkistaa kentän olemassaolon** ✓
- Runtime type check kaikille
- Sama kuin instanceof
- Ei vaikuta tyyppiin

#### `b12-ts-narrowing-typeof` · diff 2

function log(x: string | number) — x.toFixed()?

- **typeof x === 'number' guard ennen toFixed** ✓
- toFixed suoraan
- as number aina
- x is never

#### `b12-ts-never-exhaustive` · diff 5

switch union — default: const _x: never = x. Tarkoitus?

- **null/undefined erotellaan — optional chaining tarpeen** ✓
- Ei muutosta
- any kaikille
- Poistaa unionit

#### `b12-ts-readonly-array` · diff 3

readonly string[] vs string[] — ero?

- **readonly estää mutoinnin push yms. compile-time** ✓
- Runtime immutable
- Sama
- readonly vain tuple

#### `b12-ts-satisfies` · diff 4

const palette = { red: '#f00' } satisfies Record<string, string> — hyöty?

- **Tarkistaa muodon säilyttäen tarkat literal-tyypit** ✓
- Sama kuin as
- any cast
- Runtime validate

#### `b12-ts-strict-null` · diff 4

strictNullChecks päällä — mikä muuttuu?

- **Discriminated union — TS narrowaa kindin perusteella** ✓
- any switch
- instanceof
- ei narrow

#### `b12-ts-type-vs-interface` · diff 3

Milloin type alias parempi kuin interface?

- **Union/intersection/primitive alias — type sopii** ✓
- Aina interface
- type ei voi objektia
- interface union only

#### `b12-ts-utility-partial` · diff 3

Update DTO sallii osan kentistä. Utility type?

- **Partial<User>** ✓
- Pick only
- Omit only
- Required

#### `b12-ts-utility-pick-omit` · diff 3

Julkinen API-tyyppi ilman salaisia kenttiä. Kaksi vaihtoehtoa?

- **Omit<User, 'password'> tai Pick julkisille** ✓
- delete password
- any export
- interface hide

#### `prod-js-unknown-vs-any` · diff 4

API palauttaa tuntematonta JSON-dataa TypeScriptissä. Miksi `unknown` on turvallisempi kuin `any`?

- **unknown pakottaa tarkistamaan tai kaventamaan tyypin ennen käyttöä** ✓
- unknown poistaa kaikki runtime-virheet automaattisesti parsauksessa
- any on aina readonly — unknown sallii mielivaltaisen mutoinnin
- unknown kääntyy aina nopeammin kuin any — pienempi tyyppigraafi

## kids (12)

### kids-animals (1)

#### `kids-animal-cow` · diff 1

Mikä eläin sanoo muu?

- **Lehmä** ✓
- Koira
- Kissa
- Kala

### kids-body (1)

#### `kids-body-eyes` · diff 1

Millä katsomme ympärillemme?

- **Silmillä** ✓
- Korvilla
- Kynsillä
- Polvilla

### kids-computer (1)

#### `kids-computer-mouse` · diff 2

Millä liikutat nuolta tietokoneen ruudulla?

- **Hiirellä tai kosketuslevyllä** ✓
- Kynällä paperilla
- Avaimilla ovelta
- Kengän nauhoilla

### kids-food (1)

#### `kids-food-fruit` · diff 1

Mikä näistä on hedelmä?

- **Omena** ✓
- Leipä
- Juusto
- Keitto

### kids-math (2)

#### `kids-math-one-plus-one` · diff 1

Paljonko on 1 + 1?

- **2** ✓
- 1
- 11
- 0

#### `kids-math-two-plus-two` · diff 1

Paljonko on 2 + 2?

- **4** ✓
- 3
- 5
- 22

### kids-nature (3)

#### `kids-color-sky` · diff 1

Mikä väri on kirkkaalla taivaalla?

- **Sininen** ✓
- Musta
- Violetti
- Ruskea

#### `kids-colors-grass` · diff 1

Mikä väri on nurmikolla kesällä?

- **Vihreä** ✓
- Sininen
- Oranssi
- Harmaa

#### `kids-season-winter` · diff 1

Milloin sataa lunta?

- **Talvella** ✓
- Kesällä
- Aina yöllä
- Vain maanantaisin

### kids-safety (1)

#### `kids-safety-fire` · diff 2

Mitä teet jos näet tulen?

- **Kerrot aikuiselle ja menet turvalliseen paikkaan** ✓
- Piilotat sen peiton alle yksin
- Juokset kohti tulta
- Et tee mitään

### kids-time (1)

#### `kids-time-days` · diff 1

Kuinka monta päivää viikossa on?

- **7** ✓
- 5
- 10
- 3

### kids-transport (1)

#### `kids-transport-bike` · diff 1

Millä ajetaan polkemalla?

- **Polkupyörällä** ✓
- Autolla
- Lentokoneella
- Juna ei liiku polkemalla

## linux (151)

### apt (8)

#### `apt-autoremove` · diff 3

Palvelimelle on kertynyt turhia riippuvuuspaketteja poistettujen ohjelmien jäljiltä. Miten siivoot?

- **apt autoremove poistaa orvot riippuvuudet joita mikään asennettu paketti ei enää tarvitse** ✓
- apt clean poistaa turhat paketit ja vapauttaa levytilan automaattisesti
- dpkg --purge * poistaa kaikki manuaalisesti asennetut paketit turvallisesti
- apt remove --unused poistaa kaikki paketit joita ei ole käytetty 30 päivään

#### `apt-cache-search` · diff 2

Et muista paketin tarkkaa nimeä mutta tiedät sen liittyvän JSON-käsittelyyn. Miten etsit?

- **apt search json tai apt-cache search json etsii pakettinimistä ja kuvauksista** ✓
- dpkg -l | grep json näyttää vain asennetut paketit, ei saatavilla olevia
- apt list json listaa kaikki paketit joiden nimi on tasan 'json'
- find /var/cache/apt json etsii ladattuja paketteja nimellä paikallisesti

#### `apt-dist-upgrade` · diff 3

apt upgrade ilmoittaa 'held back packages'. Mikä komento asentaa myös nämä?

- **apt full-upgrade (tai apt-get dist-upgrade) sallii pakettien poistamisen/lisäämisen tarvittaessa** ✓
- apt upgrade --force asentaa kaikki paketit ohittaen rajoitukset
- apt install --reinstall asentaa pidetyt paketit uudelleen uusina
- dpkg --configure -a pakottaa held back -pakettien konfiguroinnin

#### `apt-dpkg-deb-install` · diff 3

Ladattu .deb-paketti ei asennu koska riippuvuudet puuttuvat. Miten korjaat?

- **dpkg -i paketti.deb && apt install -f korjaa puuttuvat riippuvuudet jälkikäteen** ✓
- apt install paketti.deb asentaa suoraan ja ratkaisee riippuvuudet — ei tarvita dpkg:ta
- dpkg --force-depends -i paketti.deb ohittaa riippuvuudet turvallisesti
- apt update korjaa riippuvuusongelmat automaattisesti seuraavassa päivityksessä

#### `apt-pinning-version` · diff 4

Tuotantopalvelimella tietty paketti pitää lukita versioon 2.4.1 estäen automaattiset päivitykset. Miten?

- **apt-mark hold <paketti> estää paketin päivittymisen apt upgrade -komennolla** ✓
- apt install <paketti>=2.4.1 --lock lukitsee version pysyvästi apt-tietokantaan
- Poista paketti sources.list:stä niin päivitykset eivät koske sitä
- chmod 444 /var/lib/dpkg/info/<paketti>.list estää tiedoston muuttumisen

#### `apt-repository-add` · diff 4

Tarvitset kolmannen osapuolen PPA:n tai repon lisäämistä Ubuntuun. Mikä on turvallinen tapa?

- **Lisää GPG-avain ja repo /etc/apt/sources.list.d/-hakemistoon erilliseksi .list-tiedostoksi** ✓
- Muokkaa suoraan /etc/apt/sources.list pääkonfiguraatiota lisäämällä repo loppuun
- curl | bash asennusskripti lisää repon ja avaimen automaattisesti turvallisesti
- Lataa .deb manuaalisesti ja asenna dpkg -i — välttää repon tarpeen kokonaan

#### `apt-unattended-upgrades` · diff 4

Palvelimelle halutaan automaattiset tietoturvapäivitykset ilman manuaalista ylläpitoa. Mikä ratkaisu?

- **unattended-upgrades-paketti + /etc/apt/apt.conf.d/50unattended-upgrades konfiguraatio** ✓
- Crontab-rivi 'apt upgrade -y' joka yö ajaa kaikki päivitykset turvallisesti
- apt autoinstall --security aktivoi automaattiset päivitykset pysyvästi
- systemd-timer apt-daily riittää yksinään — se myös asentaa päivitykset

#### `apt-update-vs-upgrade` · diff 2

Uusi palvelin — haluat asentaa tuoreimmat tietoturvapäivitykset. Mikä on oikea järjestys?

- **apt update päivittää pakettilistauksen, sitten apt upgrade asentaa päivitykset** ✓
- apt upgrade riittää yksinään — se hakee automaattisesti uusimmat listat
- apt install --update asentaa ja päivittää kaikki paketit yhdellä komennolla
- apt refresh && apt patch on oikea pari turvallisuuspäivityksille

### avahi (18)

#### `avahi-mdns` · diff 4

Mitä Avahi tarjoaa lähiverkossa ilman keskitettyä DNS:ää?

- **mDNS/DNS-SD palvelujen löytäminen .local-verkossa** ✓
- LDAP-autentikointi keskitetysti ilman paikallista DNS:ää
- Active Directory -toimialue lähiverkkoon ilman DNS-palvelinta
- TLS-päättäminen nginxille lähiverkon palveluilmoituksessa

#### `avahi-service-xml` · diff 5

Haluat julkaista HTTP-palvelun ilman koodimuutosta Avahilla. Minne static service -määrittely?

- **/etc/avahi/services/*.service XML-tiedosto palvelulle** ✓
- /etc/resolv.conf search-rivi julkaisee HTTP-palvelun mDNS:llä
- D-Bus API on ainoa tapa — static service XML ei tueta
- /etc/systemd/system/avahi.http yksikkö riittää Avahi-julkaisuun

#### `b02-linux-avahi-browse-12` · diff 3

Lähiverkossa pitäisi näkyä tulostin — miten listaat Avahi-palvelut terminaalista?

- **avahi-browse -a -r tai avahi-browse -t _ipp._tcp** ✓
- ping printer.local listaa kaikki lähiverkon Avahi-palvelut
- nmap -sP skannaa mDNS-palvelut kuten avahi-browse
- systemctl start cups listaa tulostimet mDNS-verkossa

#### `b02-linux-avahi-conflict-13` · diff 4

Kaksi konetta ilmoittaa saman `.local`-nimen — palvelu flapping. Syy?

- **hostname collision mDNS-verkossa — nimet täytyy olla uniikit** ✓
- Avahi bugi aiheuttaa aina .local-nimen flapping-käyttäytymisen
- DNS cache synkronoi duplikaatti-hostnamet .local-verkossa
- firewall estää kaiken mDNS-liikenteen ja aiheuttaa flappingin

#### `b02-linux-avahi-publish-14` · diff 3

Kehität paikallista HTTP-palvelua — haluat sen löytyvän `_http._tcp`. Miten?

- **Avahi service XML / avahi-publish-service tai systemd service with Avahi** ✓
- Lisää palvelun IP-osoite /etc/hosts-tiedostoon kaikilla lähiverkon koneilla manuaalisesti
- Kirjoita oma UDP-broadcast-skripti joka lähettää palvelutiedot porttiin 5353 säännöllisesti
- Avaa SSH-tunneli palvelimelle — asiakkaat löytävät palvelun tunnelin kautta automaattisesti

#### `b03-linux-avahi-hostname-local` · diff 3

Kehityskone hostaa API:n osoitteessa devbox.local — toinen kone ei resolvaa. Tarkista?

- **Avahi daemon käynnissä ja nss-mdns / libnss-mdns asennettu** ✓
- Lisää devbox.local public DNS:ään
- .local vaatii aina /etc/hosts kaikilla
- Avahi korvaa DNS:n internetissä

#### `b03-linux-avahi-publish-service` · diff 3

IoT-gateway pitää ilmoittaa HTTP-palvelu lähiverkkoon ilman staattista IP:tä. Ratkaisu?

- **Avahi service file / avahi-publish-service — mDNS ilmoitus** ✓
- Kovakoodaa IP-osoite sovellukseen — rikkoutuu heti kun DHCP vaihtaa gatewayn osoitteen
- Broadcast UDP kaikille porteille — ei noudata mDNS/DNS-SD-protokollan service-tyyppiä
- Avahi toimii vain clientinä eikä pysty julkaisemaan omia palveluita lähiverkkoon

#### `b05-linux-avahi-publish-service` · diff 3

Kehityspalvelu portissa 3000 pitäisi löytyä mDNS:llä ilman manuaalista hosts-tiedostoa. Miten?

- **Avahi service definition XML tai avahi-publish-service** ✓
- Lisää 127.0.0.1 kaikille asiakkaille
- Muuta palvelu kuuntelemaan porttia 80
- Poista NetworkManager

#### `b06-linux-avahi-daemon-restart` · diff 2

Uusi .service-tiedosto lisätty — palvelu ei näkyy verkossa. Mitä teet ensin?

- **systemctl reload avahi-daemon — lataa uudet service definitionit** ✓
- Reboot koko palvelin on ensimmäinen toimi uuden service XML:n jälkeen
- journalctl --vacuum pakottaa Avahin lukemaan uudet service-tiedostot
- Poista /etc/resolv.conf jotta Avahi näkee uuden service-tiedoston

#### `b06-linux-avahi-resolve-hostname` · diff 2

Tulostin ilmoittaa hostname.local mutta ping epäonnistuu. Miten testaat resoluution?

- **avahi-resolve -n printer.local — testaa mDNS-nimen resoluution** ✓
- nslookup printer.local toimii .local-nimille kuten tavalliselle DNS:lle
- systemctl restart avahi-daemon estää hostname.local -pingin testauksen
- ip route add local määrittää .local-hostnamen resoluution reitillä

#### `b06-linux-avahi-service-type` · diff 3

Julkaiset sisäisen API:n mDNS:llä kehitysympäristössä. Mitä service type käytät?

- **_http._tcp tai vastaava IANA service type Avahi XML:ssä** ✓
- _custom._udp riittää — service type ei vaikuta discoveryyn
- Avahi julkaisee hostname-palvelun ilman erillistä service typea
- Pelkkä hostname .local-päätteellä korvaa service record -julkaisun

#### `b07-linux-avahi-daemon-check` · diff 3

Lähiverkon palvelut eivät ilmesty — epäilet Avahia. Ensimmäinen tarkistus?

- **systemctl status avahi-daemon — varmista että palvelu on käynnissä** ✓
- reboot heti ennen kuin tarkistat avahi-daemonin tilaa
- Poista /etc/nsswitch.conf jotta mDNS-palvelut ilmestyvät listaan
- curl google.com testaa lähiverkon mDNS-palveluiden löytymistä

#### `b07-linux-avahi-reflector` · diff 4

Docker-kontti julkaisee mDNS-palvelun mutta host ei näe sitä. Tyypillinen syy?

- **mDNS multicast ei ylitä Docker-verkkoa ilman reflector/bridge-asetusta** ✓
- Avahi ei toimi Docker-kontissa lainkaan mDNS-palveluiden kanssa
- Kontti tarvitsee port 80 avattuna jotta host näkee mDNS-palvelun
- Poista .local-pääte hostnamesta jotta host löytää konttipalvelun

#### `b08-linux-avahi-resolve` · diff 3

Kehityskone ei löydä palvelua `printer.local` — mDNS pitäisi toimia. Ensimmäinen tarkistus?

- **avahi-browse -a tai resolve .local — onko palvelu ilmoitettu?** ✓
- Poista avahi-daemon — se hidastaa verkkoa ja estää mDNS:n
- ping printer.local toimii ilman Avahia kun mDNS on päällä
- mDNS toimii vain Windowsissa, ei Linux-kehityskoneella

#### `b09-linux-avahi-browse-resolve` · diff 2

Haluat listata lähiverkon _http._tcp-palvelut terminaalista. Komento?

- **avahi-browse -rt _http._tcp** ✓
- ping _http._tcp.local
- systemctl list-units | grep http
- nmap -sP riittää service discoveryyn

#### `b09-linux-avahi-mdns-troubleshoot` · diff 4

Kehityskone ei löydä kollegan .local-palvelua — sama WiFi. Yleisin syy Linuxilla?

- **avahi-daemon ei pyöri tai firewall estää UDP 5353 multicast** ✓
- mDNS vaatii staattisen IP:n jotta .local-palvelu löytyy WiFi:ssä
- .local toimii vain Windowsissa, ei samassa WiFi-verkossa Linuxilla
- DNS-palvelin puuttuu — mDNS ei toimi ilman keskitettyä DNS:ää

#### `exp-linux-avahi-conflict` · diff 3

Kaksi laitetta claimaa saman hostname.local — verkko sekoaa. Miten Avahi ratkaisee konfliktin?

- **mDNS probing ja uudelleennimeäminen esim. hostname-2.local** ✓
- Ensimmäinen laite säilyttää nimen ikuisesti konfliktitilanteessa
- Avahi ei käsittele hostname-konflikteja mDNS-verkossa ollenkaan
- Sammuta mDNS kaikilta laitteilta ratkaisee nimiristiriidan

#### `exp-linux-avahi-printer-discovery` · diff 2

Toimiston tulostin pitäisi löytyä automaattisesti LANissa ilman staattista IP:tä. Mikä protokolla?

- **mDNS / Avahi julkaisee .local-palvelun LANissa** ✓
- DHCP-reservointi kaikille laitteille korvaa palvelun löytämisen
- FTP broadcast ilmoittaa tulostimen lähiverkossa automaattisesti
- SMTP discovery paljastaa tulostimet ilman staattista IP:tä

### journald (25)

#### `b02-linux-journalctl-boot-05` · diff 2

Palvelu kaatui eilen rebootin jälkeen — miten suodatat lokin tälle bootille?

- **journalctl -b 0 tai -b ilman argumenttia nykyinen boot** ✓
- journalctl --since yesterday suodattaa vain nykyisen bootin
- cat /var/log/messages rajaa lokin rebootin jälkeiseen sessioon
- dmesg -k näyttää vain nykyisen boot-session journal-merkinnät

#### `b02-linux-journalctl-unit-06` · diff 2

Haluat vain nginx-palvelun viimeiset virheet. Tehokkain komento?

- **journalctl -u nginx.service -p err -n 50 viimeiset virheet** ✓
- grep nginx /var/log/* hakee indeksoidusti nginx-yksikön virheet
- tail -f /dev/null seuraa nginx-palvelun virhelokimerkintöjä
- systemctl cat nginx tulostaa viimeisimmät err-tason lokirivit

#### `b03-linux-journalctl-follow-unit` · diff 2

Debuggaat tuotantovikaa reaaliaikaisesti yhden palvelun lokeista. journalctl-syntaksi?

- **journalctl -u myapp.service -f** ✓
- tail /var/log/messages aina
- journalctl --delete-all
- dmesg -w riittää sovelluslokeihin

#### `b03-linux-journalctl-json-export` · diff 3

SIEM tarvitsee journal-lokeja JSON-muodossa. Mikä journalctl-lippu?

- **journalctl -o json tai json-pretty** ✓
- journalctl --binary
- journalctl -a poistaa metadatan
- Vain grep /var/log/*

#### `b03-linux-journald-rate-limit` · diff 4

DoS-yritys tulvittaa journald:n identtisillä virheillä — levy täyttyy. Mitä tarkistat?

- **RateLimitIntervalSec / RateLimitBurst journald.conf:ssa** ✓
- Poista journald kokonaan ja korvaa se pelkällä syslogilla ilman rate limiting -ratkaisua
- SystemMaxUse=0 — asettaa levykiintiön nollaan mikä ei rajoita viestien tulotahtia
- Journal ei tue rate limitingiä lainkaan — kaikki viestit kirjoitetaan aina levylle

#### `b04-linux-journalctl-boot` · diff 2

Palvelin kaatui yöllä rebootiin — haluat lokit vain viime bootista. journalctl-lippu?

- **journalctl -b tai journalctl -b -1 edelliseen bootiin** ✓
- journalctl --all-time näyttää kaikkien boottien lokit sekaisin ilman rajausta
- dmesg riittää aina — kernel-rengaspuskuri tyhjenee eikä sisällä sovelluslokeja
- cat /var/log/boot.log — tiedostoa ei oletuksena ole systemd-journald-pohjaisissa jakeluissa

#### `b04-linux-journalctl-follow` · diff 2

Haluat seurata palvelun lokia reaaliajassa tuotantodebugissa. Mikä komento?

- **journalctl -u palvelu.service -f** ✓
- tail -f /var/log/messages aina
- cat /proc/palvelu/log
- systemctl log palvelu

#### `b04-linux-journalctl-priority-err` · diff 3

Incident: tarvitset vain virhe- ja kriittiset viestit viime tunnilta. journalctl suodatin?

- **journalctl -p err --since '1 hour ago'** ✓
- journalctl | grep ERROR — riittää vaikka ohittaa priority-metadatan ja muunkieliset viestit
- journalctl -q hiljentää varoitukset lokitiedostoista, ei suodata priority-tason mukaan
- Vain dmesg — kernel-rengaspuskuri ei sisällä sovellusten err-tason journal-viestejä

#### `b05-linux-journalctl-unit-since` · diff 2

Tuotantoincidentti — tarvitset nginx-unitin lokit viimeisen tunnin ajalta. Mikä komento?

- **journalctl -u nginx.service --since '1 hour ago'** ✓
- cat /var/log/messages | grep nginx
- systemctl status nginx --logs
- dmesg -u nginx

#### `b05-linux-journald-priority-filter` · diff 3

Lokit tulvivat DEBUG-viestejä. Miten rajaat journalctl-tulosteen vain virheisiin?

- **journalctl -p err — priority err ja korkeampi** ✓
- journalctl --no-pager estää debug
- systemctl stop journald
- grep ERROR riittää aina

#### `b06-linux-journalctl-reverse` · diff 2

Incidentti — tarvitset vanhimmat lokit ensin aikajärjestyksessä. Mitä journalctl-optiota?

- **journalctl -r — kääntää järjestyksen, vanhin lokimerkintä ensin** ✓
- journalctl --boot=0 tulostaa vanhimmat lokit ensin oletuksena
- tail -f /var/log/syslog näyttää journalin vanhimmasta uusimpaan
- journalctl -f follow-moodissa näyttää vain historialliset rivit

#### `b06-linux-journalctl-verify` · diff 4

Audit vaatii lokien eheyden tarkistuksen. Mitä journalctl tarjoaa?

- **journalctl --verify tarkistaa journal-tiedostojen eheyden** ✓
- grep checksum /var/log/journal/* löytää vaurioituneet lokimerkinnät
- systemctl verify journald.service validoi lokien integriteetin auditissa
- Journal-lokit ovat luotettavia ilman erillistä verify-komentoa

#### `b06-linux-journald-forward-syslog` · diff 3

Legacy syslog-kollektori tarvitsee journal-lokit. Miten journald konfiguroi?

- **ForwardToSyslog=yes journald.conf — journal lähetetään syslogille** ✓
- Cron syncaa /var/log/journal manuaalisesti syslog-kollektoriin
- Poista journald ja käytä vain rsyslog kaiken lokituksen lähteenä
- systemctl forward-journal kytkee journal-lähteen syslog-palveluun

#### `b07-linux-journalctl-follow` · diff 2

Debuggaat live-incidenttiä — haluat seurata uusia logirivejä reaaliajassa. journalctl?

- **journalctl -f — seuraa uusia journal-rivejä kuten tail -f** ✓
- journalctl --rotate tailaa uusia lokimerkintöjä reaaliajassa
- journalctl --vacuum-time=1s seuraa live-lokia incidentin aikana
- cat /var/log/syslog seuraa journald-yksikön uusia merkintöjä

#### `b07-linux-journald-boot` · diff 3

Palvelin reboottasi — haluat edellisen bootin virhelokit. journalctl?

- **journalctl -b -1 — edellisen bootin journal ja virhelokit** ✓
- journalctl --since reboot näyttää edellisen bootin virheet
- dmesg -b tulostaa edellisen bootin systemd-journalin kokonaan
- journald ei säilytä edellisten boottien merkintöjä levylle

#### `b07-linux-journald-json` · diff 3

Lokit pitää parsia automaattisesti — plain text on hankala. journalctl output-muoto?

- **journalctl -o json tai json-pretty — strukturoitu output parsintaan** ✓
- journalctl -o binary only — ainoa formaatti automaattiseen parsintaan
- grep journal-riveistä riittää skaalautuvaan automaattiseen parsintaan
- journalctl ei tue JSON-muotoa lainkaan plain textin sijaan

#### `b08-linux-journalctl-since` · diff 2

Incidentti alkoi noin klo 14:30 — haluat lokit siitä eteenpäin. Nopein journalctl-filtteri?

- **journalctl --since '2024-01-15 14:30' -u myservice** ✓
- journalctl -f ilman aikarajaa rajaa incidentin alkamisaikaan
- cat /var/log/messages näyttää unit-lokit tarkalla aikaleimalla
- dmesg | grep 14:30 korvaa journalctl --since -filtterin

#### `b08-linux-journald-storage` · diff 3

Levy täyttyy journal-lokeista embedded-laitteessa. Mitä journald.conf-asetusta säädät?

- **SystemMaxUse= tai MaxRetentionSec= — rajoita tilaa tai aikaa** ✓
- Storage=volatile poistaa lokituksen kokonaan embedded-laitteessa
- journald ei voi rajoittaa levytilaa tai retention-aikaa lainkaan
- rm -rf /var/log/journal estää journalin täyttämästä levyä pysyvästi

#### `b09-linux-journald-forward-syslog` · diff 3

Keskus-LOKIp palvelin vaatii syslog-formaatin. journald-konfiguraatio?

- **ForwardToSyslog=yes journald.conf:ssa + rsyslog konfiguroitu** ✓
- journald ei tue ulkoista forwardingia syslog-formaattiin
- Kopioi /var/log/journal manuaalisesti keskus-LOKI-palvelimelle
- systemctl export-logs riittää syslog-formaatin toimittamiseen

#### `exp-linux-journalctl-since-boot` · diff 2

Tuotantobugi tapahtui rebootin jälkeen. Miten suodatat vain nykyisen bootin lokit?

- **journalctl -b tai -b -1 edellisen bootin lokit** ✓
- tail -f /var/log/messages rajaa lokin nykyiseen bootiin
- dmesg --follow näyttää vain nykyisen boot-session lokit
- journalctl ei indeksoi boot-id:tä suodatusta varten

#### `exp-linux-journald-disk-full` · diff 4

Incident: /var/log/journal täyttää levyn ja palvelin ei kirjoita uusia lokeja. Ensimmäinen toimenpide?

- **journalctl --disk-usage ja SystemMaxUse journald.conf:ssa** ✓
- rm -rf /var/log/* vapauttaa tilaa ilman journald-tarkistusta
- Poista journald ja siirry pelkkään syslogiin
- Osta isompi levy ilman lokien retention-hallintaa

#### `exp-linux-journald-priority-filter` · diff 3

Loki tulvii DEBUG-rivejä. Miten näet vain err-tason ja korkeammat yhdeltä palvelulta?

- **journalctl -u palvelu -p err näyttää err-tason ja korkeammat** ✓
- grep ERROR /var/log/messages suodattaa yhden palvelun lokit
- systemctl stop journald poistaa DEBUG-rivit lokista
- Vain palvelun printf-taso määrittää journalctl-suodatuksen

#### `journalctl-filter` · diff 5

Nginx kaatui viime yönä klo 02–04. Nopein tapa rajata lokit?

- **journalctl -u nginx --since 02:00 --until 04:00** ✓
- cat /var/log/messages | grep nginx viime yön ajoalalta
- dmesg -T näyttää nginx-yksikön systemd-lokit aikaleimoilla
- systemctl cat nginx tulostaa palvelun lokimerkinnät aikaväliltä

#### `journald-persistent` · diff 4

Rebootin jälkeen vanhat lokit katoavat. Mikä journald-asetus säilyttää ne levyllä?

- **Storage=persistent journald.conf:ssa ja /var/log/journal** ✓
- ForwardToSyslog=no estää lokien kopiointi syslog-palveluun
- SystemMaxUse=1K asettaa journalin levykiintiön megatavuiksi
- RuntimeDirectory=journald varmistaa lokien pysyvyyden rebootissa

#### `journald-priority` · diff 4

Lokitulva tuotannossa. Miten näytät vain virheet ja kriittiset nginx-unitilta?

- **journalctl -u nginx -p err** ✓
- tail -f /var/log/nginx/access.log
- dmesg | grep nginx
- systemctl status --no-pager riittää

### linux-arp (4)

#### `b12-linux-arp-failed-state` · diff 3

`ip neigh show` näyttää gatewaylle tilan FAILED — ping ulospäin ei mene. Ensimmäinen toimenpide?

- **Tarkista L2: kaapeli, VLAN, kytkinportti — sitten ip neigh del + uusi ARP-yritys** ✓
- Lisää staattinen ip route ilman gateway-MAC:ia — reititystaulu ei korjaa puuttuvaa ARP-vastausta
- Muuta TCP keepalive-asetuksia — kuljetuskerroksen aikakatkaisut eivät vaikuta ARP-tason FAILED-tilaan
- Ota UDP pois käytöstä palomuurista — protokollakohtainen sääntö ei liity naapuritaulun ongelmaan

#### `b12-linux-arp-flush-migration` · diff 3

VM siirrettiin toiseen hypervisorille — vanhat MAC-osoitteet jäävät ARP-cacheen. Turvallisin tyhjennys?

- **ip neigh flush dev eth0 — vain kyseisen rajapinnan cache** ✓
- ip neigh flush all — kaikki naapurit kaikilla rajapinnoilla heti
- reboot on ainoa tapa tyhjentää ARP
- systemctl restart systemd-networkd poistaa ARP:n automaattisesti

#### `b12-linux-arp-gratuitous-duplicate` · diff 4

Kaksi konetta väittää omistavansa saman IP:n — epäilet ARP-konfliktia. Nopein varmistus lähiverkossa?

- **arping -D -I eth0 10.0.0.50 — gratuitous ARP paljastaa duplikaatin** ✓
- ip route flush table main — tyhjentää reititystaulun mutta ei paljasta ARP-tason duplikaattia
- ping -f 10.0.0.50 riittää aina — flood-ping testaa vain saavutettavuutta, ei kerro kumpi kone vastaa
- ss -tan | grep 10.0.0.50 — näyttää TCP-socketit, ei ARP-tason osoitekonfliktia

#### `b12-linux-arp-static-neigh` · diff 3

Gatewayn MAC vaihtuu harvoin ja aiheuttaa katkoja — haluat kiinteän ARP-merkinnän. Komento?

- **ip neigh add 192.168.1.1 lladdr aa:bb:cc:dd:ee:ff dev eth0 nud permanent** ✓
- arp -s 192.168.1.1 eth0 — legacy-komento vaatii MAC-osoitteen parametrina, pelkkä interface ei riitä
- echo aa:bb > /proc/net/arp — ARP-taulua ei voi muokata suoraan kirjoittamalla /proc-tiedostoon
- ip route add 192.168.1.1 dev eth0 — tämä lisää reitin, ei kiinteää MAC-osoitetta ARP-tauluun

### linux-cgroups (1)

#### `prod-linux-cgroups-v2-memory` · diff 4

Docker-kontin muistiraja on 512M, mutta haluat nähdä saman cgroup v2 -tasolla hostilla. Mistä lukema?

- **systemd-cgtop tai cat /sys/fs/cgroup/.../memory.current — cgroup v2 muistinkäyttö** ✓
- free -h näyttää konttikohtaisen muistin cgroup-polun kautta
- docker stats on ainoa tapa — host ei näe cgroup v2 -rajoja
- ps aux RSS summa vastaa cgroup memory.current arvoa

### linux-dbus (5)

#### `b12-linux-dbus-bluez-pair` · diff 3

Bluetooth-kuulokkeet eivät yhdisty — BlueZ pyörii mutta laite on untrusted. CLI-korjaus ennen D-Bus-skriptiä?

- **bluetoothctl → pair MAC, trust MAC, connect MAC** ✓
- modprobe btusb reset — ajurin uudelleenlataus ei korjaa laitteen untrusted-tilaa
- rfkill block bluetooth — sammuttaa radion kokonaan eikä ratkaise parituksen luottamusongelmaa
- systemctl stop org.bluez — pysäyttää koko BlueZ-palvelun eikä ole edes validi unit-nimi

#### `b12-linux-dbus-busctl-introspect` · diff 2

Haluat listata NetworkManagerin D-Bus-metodit terminaalista ennen automaatiota. Ensimmäinen komento?

- **busctl introspect org.freedesktop.NetworkManager /org/freedesktop/NetworkManager** ✓
- dbus-launch --list-services | grep Network — dbus-launch käynnistää session-busin, ei listaa system-bus-palveluita
- systemctl cat NetworkManager.service näyttää unit-tiedoston sisällön, ei D-Bus-rajapintaa
- nmcli general permissions listaa polkit-oikeudet, ei D-Bus-metodeja tai propertyja

#### `b12-linux-dbus-modemmanager-signal` · diff 3

LTE-modemi hidastuu — epäilet heikkoa signaalia. ModemManagerin D-Bus-CLI tarkistukseen?

- **mmcli -L && mmcli -m 0 --signal-get** ✓
- ip link show wwan0 riittää signaalitietoihin
- nmcli device wifi list
- cat /sys/class/net/modem0/signal

#### `b12-linux-dbus-nm-wifi-scan` · diff 3

NetworkManager ei näytä uusia Wi-Fi-verkkoja GUI:ssa, vaikka radio on päällä. Miten pakotat skannauksen D-Bus-kautta?

- **busctl call org.freedesktop.NetworkManager /org/freedesktop/NetworkManager/Devices/3 org.freedesktop.NetworkManager.Device.Wireless RequestScan a{sv} 0** ✓
- systemctl restart NetworkManager poistaa Wi-Fi-välimuistin ja käynnistää skannauksen automaattisesti taustalla
- echo scan > /proc/net/wireless — tiedosto on vain luku -tilastoraportti, ei ohjausrajapinta skannaukselle
- dbus-send --session org.freedesktop.NetworkManager /Scan — väärä bus, väärä polku eikä metodia/rajapintaa ole määritelty

#### `b12-linux-dbus-polkit-deny` · diff 4

Skripti kutsuu NetworkManageria dbus-send:llä ja saa `Access denied`. Todennäköisin syy?

- **Polkit estää — käyttäjällä ei ole oikeuksia NM-asetuksiin ilman auth_admin** ✓
- Väärä journald-priority-asetus estää dbus-send-kutsun näkymisen lokissa, ei itse kutsua
- D-Bus daemon on kaatunut — reboot auttaa aina, vaikka daemon on selvästi käynnissä ja vastaa muille
- dbus-send vaatii aina rootin — nmcli käyttää samaa D-Bus-rajapintaa samoilla polkit-säännöillä

### linux-incident (5)

#### `linux-deleted-open-file` · diff 3

df näyttää levyn täyneksi, mutta du löytää vain puolet käytöstä. Iso lokitiedosto poistettiin rm:llä, mutta palvelu on yhä käynnissä. Mitä tapahtuu?

- **Prosessi pitää poistettua tiedostoa yhä auki (lsof +L1 näyttää sen)** ✓
- Tiedostojärjestelmä on korruptoitunut — aja fsck heti tuotannossa
- du ei laske lokitiedostoja — tarkista käyttö ls -la:lla koko levyltä
- rm siirsi tiedoston roskakoriin, joka pitää tyhjentää erikseen

#### `prod-linux-incident-slow-no-cpu` · diff 5

API on hidas mutta CPU ei ole lähelläkään 100 %. Mistä näet onko pullonkaula levy-IO:ssa?

- **iostat -xz 1 tai pidstat -d 1 — levy-IO ja odotusajat prosessikohtaisesti** ✓
- top riittää — se näyttää aina levy-IO:n pullonkaulana
- free -h paljastaa levy-IO-ruuhkan muistin kautta
- ss -tulpn näyttää levy-latenssin per yhteys

#### `prod-linux-logrotate-copytruncate` · diff 4

logrotate käyttää `copytruncate` ja sovellus menettää satunnaisesti lokimerkintöjä rotaation jälkeen. Parempi tapa?

- **Käytä `create` + `postrotate` signaali (esim. USR1/SIGHUP) jos sovellus tukee lokin uudelleenavausta** ✓
- Lisää copytruncate ja compress — se korjaa race conditionin automaattisesti
- Poista logrotate ja anna lokit kasvaa rajattomasti
- truncate -s 0 on aina turvallisempi kuin mikään signaali

#### `prod-linux-lsof-deleted-log` · diff 4

Levy näyttää täydeltä, mutta `du` ei löydä isoja tiedostoja. Mikä on todennäköisin syy?

- **Poistettu mutta auki pidetty lokitiedosto — `lsof +L1` tai `lsof | grep deleted`** ✓
- du laskee väärin sparse-tiedostot aina — käytä ls -la sen sijaan
- Journald käyttää RAM-levyä jota du ei näe — reboot korjaa tilan
- Tiedostojärjestelmä on korruptoitunut — ainoa korjaus on mkfs

#### `prod-linux-strace-hung-process` · diff 4

Prosessi on jumissa tuotannossa etkä halua käynnistää sitä uudelleen. Miten näet mihin syscalliin se odottaa?

- **strace -p <pid> — näyttää reaaliaikaiset syscallit ja odotukset** ✓
- kill -9 <pid> ja analysoi core dump myöhemmin
- gdb attach vaatii aina prosessin pysäyttämisen tuotannossa
- lsof -p riittää näyttämään syscall-jonon

### linux-network (38)

#### `b02-linux-network-nmcli-11` · diff 2

Wi-Fi katkeilee — haluat vaihtaa verkko profiilin CLI:stä. Komento?

- **nmcli connection up 'Profile-Name' vaihtaa Wi-Fi-profiilin** ✓
- ifconfig wlan0 up valitsee NetworkManager-profiilin CLI:stä
- route add default vaihtaa aktiivisen Wi-Fi-verkon profiilin
- systemctl restart network aktivoi valitun NM-profiilin reconnectissa

#### `b02-linux-network-route-09` · diff 4

VPN-yhteys toimii mutta vain internal IP:t eivät routtaudu. Diagnostiikka?

- **ip route show table all — policy routing ja oikea interface** ✓
- reboot korjaa VPN-reitityksen ja internal IP -reachability
- Poista default route korjaa VPN:n internal-reitit
- ifdown eth0 palauttaa VPN-reitit policy routing -tauluun

#### `b03-linux-network-ethtool-link` · diff 4

1 Gbps linkki neuvottelee 100 Mbps — throughput romahtaa. Ensimmäinen tarkistus?

- **ethtool eth0 — link speed/duplex** ✓
- ping -f flood
- chmod 777 /etc/resolv.conf
- reboot riittää aina

#### `b03-linux-network-ip-route-table` · diff 3

VPN-yhteys on päällä mutta vain osa aliverkoista menee tunneliin. Mikä komento näyttää reititystaulun?

- **ip route show tai ip r** ✓
- netstat -a riittää reititykseen
- hostname -f
- arp -a korvaa routing

#### `b03-linux-network-ss-timers` · diff 3

Palvelin jää odottamaan CLOSE_WAIT-yhteyksiä — muisti kuluu. Diagnostiikka?

- **ss -tanp — näyttää socket-tilat ja timerit** ✓
- lsof -i poistaa yhteydet
- ifdown eth0
- CLOSE_WAIT on normaali — ei toimenpiteitä

#### `b03-linux-network-tcpdump-filter` · diff 4

API-kutsut timeouttaavat — epäilet palomuuria. Nopein tapa nähdä SYN-paketit porttiin 443?

- **tcpdump -i any port 443 -n** ✓
- ping api.example.com
- ifconfig up
- route add default gw 0.0.0.0

#### `b04-linux-network-ip-addr` · diff 2

Palvelin ei vastaa pingiin — epäilet väärää IP:tä interfacella. Nopein tarkistus?

- **ip addr show tai ip -br a** ✓
- ifconfig — aina asennettuna
- ping 127.0.0.1 riittää
- cat /etc/hosts

#### `b04-linux-network-route-metric` · diff 4

Kaksi oletusreittiä — liikenne menee väärää VPN:ää pitkin. Miten näet reitit ja metriikat?

- **ip route show — metric määrittää prioriteetin** ✓
- netstat -r riittää aina
- Reitit ovat aina kiinteät — ei konfiguroitavissa
- Muokkaa /etc/resolv.conf reititykseen

#### `b04-linux-resolv-stub` · diff 4

resolv.conf näyttää 127.0.0.53 — DNS-kyselyt epäonnistuvat satunnaisesti. Todennäköisin syy?

- **systemd-resolved stub resolver — tarkista resolvectl status** ✓
- 127.0.0.53 on aina virheellinen konfiguraatio joka pitää korjata osoittamaan suoraan ISP:n nameserveriin
- Poista resolv.conf kokonaan — kernel osaa silti resolvoida nimiä ilman mitään resolver-konfiguraatiota
- Vain /etc/hosts on käytössä — systemd-resolved ei voi koskaan olla stub-osoitteen takana

#### `b04-linux-ss-tuln` · diff 3

Portti 8080 pitäisi kuunnella mutta palvelu ei vastaa. Mikä komento listaa LISTEN-socketit?

- **ss -tuln tai ss -tlnp** ✓
- lsof — aina root-oikeudet
- ping localhost:8080
- iptables -L riittää

#### `b05-linux-network-ip-route` · diff 3

VPN-yhteys toimii mutta sisäverkon aliverkko on tavoittamaton. Mitä tarkistat ensin?

- **ip route — onko reitti sisäverkkoon oikean gatewayn kautta** ✓
- Muokkaa vain /etc/hosts-tiedostoa lisäämällä sisäverkon osoitteet käsin sinne
- Aja chmod +x reitittimen konfiguraatiotiedostoon jotta reititys aktivoituu
- Käynnistä avahi-daemon uudelleen — mDNS ei liity VPN:n sisäverkon reitityksen tavoitettavuuteen

#### `b05-linux-network-nmcli-connect` · diff 2

Wi-Fi katkesi toimistossa. Miten nmcli:llä yhdistät tunnetun profiilin?

- **nmcli connection up 'Office-WiFi'** ✓
- nmcli device delete wlan0
- ifup wlan0 riittää NetworkManagerissa aina
- systemctl restart network

#### `b06-linux-network-ethtool-offload` · diff 5

Tuotantoverkko — checksum offload aiheuttaa corrupt-paketteja virtuaalisessa NIC:ssä. Mitä työkalu?

- **ethtool -K eth0 tx off rx off — checksum offload kytketään pois** ✓
- ip link set eth0 down poistaa vioitetut checksum-offload -asetukset
- nmcli connection modify offload disabled korjaa virtuaalin NIC:n offloadin
- sysctl -w net.offload=0 poistaa kaiken offload-toiminnon kernelista

#### `b06-linux-network-ip-neigh` · diff 3

Yhteys toimii pingillä mutta ARP-taulu näyttää incomplete. Mitä komento tarkistaa?

- **ip neigh show — näyttää ARP- ja neighbor cache -taulun** ✓
- ss -tuln listaa neighbor-taulun incomplete-merkinnät verkossa
- nmcli device wifi tarkistaa ARP-taulun incomplete-tilat lähiverkossa
- journalctl -k rajoittuu kernel neighbor -virheisiin ARP-diagnostiikassa

#### `b06-linux-network-resolv-options` · diff 3

DNS-haku hidastuu — haluat rajoittaa retry ja timeout. Missä konfiguroit?

- **options timeout:1 attempts:2 resolv.conf:ssa tai stub resolverissa** ✓
- TimeoutStartSec service unitissa rajoittaa DNS-clientin timeout-arvoa
- iptables -t nat -A POSTROUTING muuttaa resolverin retry-käytöstä
- ss -K reset DNS resetoi resolverin timeout- ja retry-asetukset

#### `b06-linux-network-ss-udp` · diff 2

DNS-palvelu ei vastaa — haluat nähdä UDP-kuuntelijat. Mitä ss-optiota?

- **ss -ulnp — UDP-kuuntelijat ja prosessit listataan porteittain** ✓
- ss -tlnp riittää koska DNS käyttää myös TCP-protokollaa
- netstat -a on riittävä vaikka se on jo deprecated työkalu
- ip route show UDP näyttää DNS-kuuntelijat ja prosessitiedot

#### `b07-linux-network-curl-debug` · diff 2

curl palauttaa SSL certificate problem — haluat nähdä TLS-handshaken. curl-lippu?

- **curl -v — verbose näyttää TLS-handshaken ja HTTP-headerit** ✓
- curl -silent piilottaa virheet mutta näyttää handshake-detaljit
- curl --get pakottaa TLS-debugin näkyviin certificate-virheissä
- wget on ainoa työkalu TLS-handshaken diagnostiikkaan curlin sijaan

#### `b07-linux-network-dns-dig` · diff 3

Sovellus ei resolvdu mutta ping IP:llä toimii. DNS-diagnostiikka?

- **dig hostname tai nslookup — testaa DNS-vastaus erikseen IP:stä** ✓
- ping hostname riittää kun IP-yhteys toimii mutta nimi ei
- ip link set up korjaa DNS-resoluution kun ping IP:llä onnistuu
- systemctl restart avahi-daemon korjaa tavallisen DNS-nimen resoluution

#### `b07-linux-network-firewall-nft` · diff 4

Portti 443 auki ulkoapäin vaikka palvelu kuuntelee vain localhostia. Mitä tarkistat?

- **nftables/iptables säännöt — palomuuri ohjaa liikennettä eri kuin bind** ✓
- Vain ss -tlnp riittää kun palvelu kuuntelee localhostia
- SELinux pois päältä estää portin 443 näkymisen ulkoapäin
- hostname -f paljastaa miksi localhost-bind on auki ulkoapäin

#### `b07-linux-network-tcpdump` · diff 4

API-kutsu epäonnistuu TLS:n jälkeen — epäilet palomuurin RST-paketteja. Nopein diagnostiikka?

- **tcpdump tai ss porttiin — näet RST-paketit ja TCP-liikenteen** ✓
- ping hostname riittää TLS-jälkeisten RST-pakettien havaitsemiseen
- ifconfig up korjaa palomuurin lähettämät RST-vastaukset API:lle
- reboot palomuuri poistaa RST-paketit ja palauttaa API-yhteyden

#### `b08-linux-network-firewalld` · diff 3

Uusi palvelu portissa 8080 — palomuuri estää ulkoiset yhteydet. firewalld-komento?

- **firewall-cmd --add-port=8080/tcp --permanent && firewall-cmd --reload** ✓
- iptables -F poistaa kaiken suojauksen turvallisesti tuotannossa
- systemctl stop firewalld on suositeltu tapa avata portti 8080
- EXPOSE 8080 Dockerfile riittää host-palomuurin avaamiseen

#### `b08-linux-network-nmcli` · diff 2

Palvelimella pitää vaihtaa staattinen IP ilman GUI:ta NetworkManagerilla. Työkalu?

- **nmcli con mod 'Wired' ipv4.addresses ... ipv4.method manual** ✓
- ifconfig eth0 asettaa pysyvän staattisen IP:n NetworkManagerissa
- reboot korjaa staattisen IP:n automaattisesti ilman nmcli:tä
- echo IP > /etc/hosts riittää pysyvään staattiseen osoitteeseen

#### `b08-linux-network-traceroute` · diff 3

API-viive — epäilet reitityspolkua ulkoiseen palveluun. Perustyökalu polun selvittämiseen?

- **traceroute tai tracepath kohde — näyttää reitityksen hopit** ✓
- ping riittää reitityspolun analyysiin ulkoiseen API-palveluun
- ifconfig näyttää reitityspolun ja hopit ulkoiseen palveluun
- curl -I korvaa tracerouten API-viiveen juurisyy-analyysissä

#### `b09-linux-net-nat-troubleshoot` · diff 4

Kontti saavuttaa hostin mutta ei internetiä — epäilet NAT:ia. Tarkistus?

- **iptables/nftables NAT + sysctl net.ipv4.ip_forward — tarkista** ✓
- Vain DNS on syy — ping IP:llä riittää NAT-ongelman diagnosointiin
- NAT toimii automaattisesti kaikissa distroissa ilman sääntöjä
- ifconfig up korjaa konttiverkon NAT:in ja internet-yhteyden

#### `b09-linux-net-tcpdump-incident` · diff 4

API-kutsu timeoutaa tuotannossa — epäilet pakettihäviötä. Nopea kaappaus?

- **tcpdump -i eth0 host api.example.com -w capture.pcap** ✓
- curl api.example.com korjaa pakettihäviön ja timeout-ongelman
- iptables -F ratkaisee API-kutsun timeoutin tuotannossa
- tcpdump vaatii aina GUI:n pakettikaappaukseen tuotannossa

#### `b12-linux-network-ip-addr-secondary` · diff 2

Palvelimelle tarvitaan toinen IPv4 samaan rajapintaan (VIP). Linux-komento — ei Windows ipconfig?

- **ip addr add 10.0.0.99/24 dev eth0** ✓
- ipconfig eth0 10.0.0.99
- ifconfig eth0:1 alias — ainoa tuettu tapa
- echo 10.0.0.99 > /etc/hosts riittää

#### `b12-linux-network-ip-link-admin` · diff 2

Rajapinta on DOWN admin-tilassa — et saa edes ARP-vastauksia. Nopein palautus?

- **ip link set eth0 up** ✓
- ip route add default via 0.0.0.0
- systemctl restart networking
- modprobe -r eth0

#### `b12-linux-network-ip-route-replace` · diff 3

Oletusreitti pitää vaihtaa uuteen gatewayhin ilman että vanha jää roikkuun. iproute2-komento?

- **ip route replace default via 10.0.0.1 dev eth0** ✓
- ip route add default via 10.0.0.1 dev eth0 — add riittää aina
- route add default gw 10.0.0.1
- ifconfig eth0 gateway 10.0.0.1

#### `b12-linux-network-ip-rule-policy` · diff 4

Liikenne lähteestä 10.10.0.0/24 pitää reitittää VPN-tauluun 100, ei main-tauluun. Mitä konfiguroit?

- **ip rule add from 10.10.0.0/24 lookup 100 + ip route add ... table 100** ✓
- ip route add 10.10.0.0/24 dev tun0 — riittää policy routingiin
- echo 100 > /proc/sys/net/ipv4/route/flush
- nmcli connection modify vpn ipv4.routes

#### `b12-linux-network-route-get-from` · diff 3

Split-horizon: paketti kohteeseen 172.16.5.10 lähteestä 10.0.1.5 menee väärään tunneliin. Diagnostiikka?

- **ip route get 172.16.5.10 from 10.0.1.5 iif eth0** ✓
- traceroute 172.16.5.10 — näyttää aina lähde-IP:n
- ip addr show tun0
- cat /proc/net/route

#### `exp-linux-network-nmcli-down` · diff 3

Wi-Fi profiili jää roikkuun VPN-konfigin jälkeen. Miten NetworkManagerilla palautat yhteyden?

- **nmcli connection down/up tai nmcli device reapply** ✓
- Muokkaa /etc/resolv.conf käsin VPN-yhteyden palauttamiseksi
- Poista NetworkManager kokonaan palauttaaksesi Wi-Fi-yhteyden
- ifdown eth0 riittää kaikkien NetworkManager-profiilien resetointiin

#### `exp-linux-network-resolv-search` · diff 4

Sisäinen palvelu `db.local` ei resolvdu mutta `db.local.corp` toimii. Mitä resolv.conf search-kenttä tekee?

- **search-domainit lisätään lyhyille hostnameille DNS-kyselyihin** ✓
- search-kenttä määrittää oletusgatewayn kontti-verkossa
- search korvaa /etc/hosts-tiedoston kaikissa resoluutioissa
- search estää ulkoiset DNS-kyselyt corp-verkon ulkopuolelta

#### `exp-linux-network-route-missing` · diff 4

Kontti-host ei reachaa 10.20.0.0/16 VPN-verkkoa. ip route näyttää oletusyhteyden mutta ei VPN-reittiä. Mitä tarkistat?

- **ip route get 10.20.0.1 ja VPN-interface/gateway** ✓
- ping 8.8.8.8 paljastaa puuttuvan VPN-reitin 10.20.0.0/16:lle
- Poista default route korjaa VPN-reitityksen automaattisesti
- ifconfig on ainoa työkalu VPN-reittien diagnosointiin

#### `linux-ip-route` · diff 4

Palvelin ei pääse ulos verkon 10.0.0.0/8 ulkopuolelle, mutta pingaa gatewayn. Mikä todennäköisin puuttuu?

- **Oletusreitti tai NAT/firewall puuttuu ulospääsyyn** ✓
- /etc/hosts puuttuu ja blokkaa ulkoisen verkon liikenteen
- Väärä MAC loopbackissa rikkoo paikallisen segmentin yhteydet
- Vain DNS-asetusten korjaus palauttaa oletusreitityksen ulos

#### `linux-nmcli` · diff 5

NetworkManager hallitsee interfacea. Miten aktivoit profiilin `corp-wifi` CLI:stä?

- **nmcli connection up corp-wifi profiilin aktivointiin** ✓
- ifconfig corp-wifi up aktivoi NetworkManager-profiilin oikein
- systemctl start corp-wifi.service käynnistää NM-yhteyden
- ip link set corp-wifi up valitsee corp-wifi-profiilin aktiiviseksi

#### `linux-resolv-search` · diff 4

Kontti/resolvoi `db` mutta ei `db.corp.local`. Mitä tiedostoa tarkistat ensin?

- **/etc/resolv.conf nameserver- ja search/domain-rivit** ✓
- /etc/fstab mount-asetukset vaikuttavat DNS-hakuun kontissa
- /etc/shadow määrittää resolverin hakudomainit ja nameserverit
- /etc/hosts riittää lyhyiden hostnamejen resoluutioon

#### `linux-ss-listen` · diff 3

Mikä prosessi kuuntelee porttia 8080? Nopein moderni komento?

- **ss -tlnp | grep 8080 näyttää kuuntelijan ja prosessin** ✓
- ping localhost varmistaa että portti 8080 on vapaa
- cat /etc/services listaa prosessit portti 8080 kuuntelijana
- ifconfig -a näyttää TCP-kuuntelijat ja niiden prosessit

#### `prod-linux-bind-localhost` · diff 3

Palvelu toimii koneella `curl localhost:8080` mutta ulkopuolelta yhteys timeouttaa. Todennäköisin syy?

- **Sovellus kuuntelee vain 127.0.0.1:8080 — bindaa 0.0.0.0 tai oikea interface-IP** ✓
- DNS ei resolvaa localhost-nimeä kontissa
- TCP backlog on liian pieni — ss ei näytä LISTEN-tilaa
- IPv6 estää IPv4-yhteydet automaattisesti

### linux-ssh (1)

#### `prod-linux-ssh-bastion-forward` · diff 4

Pääsy tuotantoon vain bastionin kautta ja tarvitset paikallisen portin 5432 tietokantaan. SSH-komennot?

- **ssh -J bastion prod ja ssh -L 5432:db.internal:5432 prod (tai ProxyJump + LocalForward ssh_configissa)** ✓
- ssh -A prod — agent forwarding riittää tietokantayhteyteen
- scp db.internal:/data . — kopioi koko tietokannan paikallisesti
- telnet bastion 22 avaa tunnelin automaattisesti

### linux-tcp-udp (6)

#### `b12-linux-tcp-close-wait-leak` · diff 4

Palvelimen muisti kasvaa — epäilet vuotavia TCP-yhteyksiä joita sovellus ei sulje. ss-suodatin?

- **ss -tan state close-wait** ✓
- ss -uln state established
- ss -ltn state listening
- netstat -r

#### `b12-linux-tcp-established-filter` · diff 3

Haluat nähdä vain aktiiviset TCP-yhteydet tiettyyn palveluporttiin 443. ss-komento?

- **ss -tn state established sport = :443 or dport = :443** ✓
- ss -uln dport = :443 — näyttää UDP-kuuntelijat, ei TCP-yhteyksien tilaa
- ss -ltn state established — -l rajaa pelkkiin LISTEN-socketeihin, joten established-suodatin ei toimi
- ip route get :443 — reititystyökalu ei tunne porttinumeroita eikä listaa socketeja

#### `b12-linux-tcp-retransmit-info` · diff 4

Korkea latenssi tuotannossa — epäilet TCP-uudelleenlähetyksiä. ss-lippu sisäisiin timer-tietoihin?

- **ss -ti — TCP info: rtt, retrans, cwnd** ✓
- ss -u — UDP timerit
- ss -s — vain yhteenveto, ei per-yhteys RTT
- tcpdump -i any — ss korvaa tcpdumpin aina

#### `b12-linux-tcp-syn-backlog` · diff 3

API palauttaa connection refused heti — ei timeout. TCP-kuuntelija ja SYN-jono: mitä tarkistat?

- **ss -ltn sport = :8080 — LISTEN ja backlog; prosessi ei kuuntele = refused** ✓
- ss -uln — UDP riittää TCP-ongelmaan
- ip neigh show — refused tulee ARP:sta
- journalctl -u firewalld — refused = aina palomuuri

#### `b12-linux-tcp-udp-handshake` · diff 2

Mikä ero TCP:n ja UDP:n välillä on yhteyden muodostuksessa?

- **TCP: kolmen suun kättely (SYN, SYN-ACK, ACK) ennen dataa; UDP: ei kättelyä** ✓
- UDP: kolmen suun kättely (SYN, SYN-ACK, ACK); TCP lähettää suoraan datagrammin ilman kättelyä
- Molemmat protokollat vaativat aina TLS-handshaken ennen sovellusdatan lähettämistä
- TCP on aina UDP:n päällä portissa 53 — DNS käyttää TCP:tä vain UDP-kehyksen sisällä kapseloituna

#### `b12-linux-udp-stateless-firewall` · diff 3

DNS UDP:53 toimii ulospäin mutta vastaus ei palaudu sisään — NAT/palomuuri. Tyypillinen UDP-ero TCP:hen?

- **UDP on yhteydetön — palomuuri tarvitsee conntrack/state tai eksplisiittisen allow return** ✓
- UDP käyttää aina kolmen suun kättelyä (SYN/SYN-ACK/ACK) kuten TCP ennen datansiirtoa
- UDP ei kulje NAT:in läpi koskaan — palomuurit pudottavat kaiken UDP-liikenteen automaattisesti
- ss -ltn näyttää UDP-vastaukset — -t ja -l rajaavat näkymän pelkkiin TCP LISTEN-socketeihin

### systemd (37)

#### `b02-linux-systemd-env-04` · diff 4

Palvelu tarvitsee API-avaimen — kovakoodattu unit-tiedostoon. Turvallisempi systemd-tapa?

- **EnvironmentFile=-/etc/myapp/env tai credentials drop-in** ✓
- ExecStart=echo $KEY injektoi API-avaimen turvallisesti palveluun
- Environment= avain unit-tiedostossa versionhallinnassa
- export shell-profiilissa välittää salaisuuden systemd-palvelulle

#### `b02-linux-systemd-failure-02` · diff 3

Palvelu crashaa loopissa — loki täyttyy. Miten rajoitat uudelleenkäynnistyksiä?

- **StartLimitIntervalSec + StartLimitBurst unit-tiedostossa** ✓
- Restart=always ilman rajaa estää restart-loopin luotettavasti
- Poista Restart-kenttä — systemd rajoittaa uudelleenkäynnistyksiä
- kill -9 init lopettaa palvelun restart-loopin turvallisesti

#### `b02-linux-systemd-timer-03` · diff 3

Cron-työ pitää siirtää systemd:ään — tarvitaan ajastus + service. Mitä luot?

- **timer.unit + service.unit — timer triggeröi servicen** ✓
- Pelkkä service.unit riittää ajastukseen ilman timer-yksikköä
- target.unit korvaa timer-yksikön cron-työssä systemd:ssä
- socket.unit käynnistää ajastetut tehtävät OnCalendar-säännöllä

#### `b02-linux-systemd-unit-01` · diff 2

Palvelu ei käynnisty bootissa vaikka `systemctl start` toimii. Mitä unohdettiin?

- **systemctl enable palvelu luo wanted-by-symlinkin bootiin** ✓
- systemctl restart tekee palvelusta pysyvän boot-käynnistyksessä
- chmod +x unit-tiedosto riittää palvelun automaattiseen bootiin
- journalctl --boot aktivoi palvelun käynnistyksen jokaisella bootilla

#### `b03-linux-systemd-analyze-blame` · diff 3

Palvelin käynnistyy hitaasti tuotantoon noston jälkeen. Mikä systemd-komento paikantaa hitaat unitit?

- **systemd-analyze blame — näyttää unit-kohtaiset viiveet** ✓
- systemctl restart --all — käynnistää kaikki unitit uudelleen paljastamatta viiveitä
- journalctl -k rajoittuu kernel-viesteihin eikä näytä unit-kohtaisia käynnistysaikoja
- kill -9 init pakottaa koko järjestelmän uudelleenkäynnistyksen ilman diagnostiikkaa

#### `b03-linux-systemd-env-file` · diff 2

Salaisuudet ovat suoraan unit-tiedostossa gitissä. Miten systemd hoitaa ympäristön?

- **EnvironmentFile=/etc/app/env — erillinen tiedosto oikeuksilla 600** ✓
- Environment=SECRET=hardcoded unitissa
- Export muuttujat .bashrc:stä palvelulle
- systemd ei tue ympäristömuuttujia

#### `b03-linux-systemd-restart-burst` · diff 3

Bugi aiheuttaa crash loopin — palvelu käynnistyy uudelleen 500 kertaa minuutissa. Mitä säädät?

- **StartLimitIntervalSec / StartLimitBurst — rajoita uudelleenkäynnistyksiä** ✓
- Restart=always ilman StartLimitBurst-rajoitusta — palvelu yrittää loputtomasti uudelleen
- Poista Restart-rivi kokonaan ja anna palvelun jäädä pysyvästi kaatuneeksi tilaan
- KillMode=none joka jättää lapsiprosessit henkiin eikä vaikuta restart-tiheyteen mitenkään

#### `b03-linux-systemd-type-notify` · diff 4

CI merkitsee palvelun valmiiksi heti kun prosessi käynnistyy, mutta se kuuntelee porttia vasta 30 s myöhemmin. Unit-tyyppi?

- **Type=notify — palvelu ilmoittaa sd_notify:llä kun valmis** ✓
- Type=simple riittää aina — simple merkitsee palvelun valmiiksi heti exec-kutsun jälkeen
- Type=idle nopeuttaa bootia viivästämällä käynnistystä, ei liity valmiussignalointiin
- Type=forking pakollinen kaikille — forking sopii vain daemonisoituville prosesseille

#### `b04-linux-systemd-ExecStartPre` · diff 3

Palvelu käynnistyy ennen kuin tietokanta on valmis — yhteys epäonnistuu. Mitä unit-tiedostoon?

- **ExecStartPre=/bin/sh -c 'until pg_isready; do sleep 1; done' tai After=postgresql.service** ✓
- Restart=on-failure ilman riippuvuutta — yrittää uudestaan mutta ei odota tietokannan valmistumista ensin
- Type=oneshot ja RemainAfterExit=yes — merkitsee palvelun valmiiksi heti prosessin päätyttyä
- Poista ExecStart kokonaan ja korvaa se ExecStartPost-komennolla joka odottaa tietokantaa

#### `b04-linux-systemd-mask` · diff 3

Vanha palvelu käynnistyy uudestaan päivityksen jälkeen vaikka disable tehtiin. Miten estät pysyvästi?

- **systemctl mask palvelu.service — estää käynnistyksen symlinkillä /dev/null** ✓
- chmod 000 unit-tiedostoon riittää — systemd voi silti ladata unitin oikeuksista huolimatta
- disable ja reboot riittää aina — toinen paketti voi palauttaa symlinkin päivityksen yhteydessä
- Poista binary levyltä — systemd yrittää silti käynnistää unitin ja jää failed-tilaan

#### `b04-linux-systemd-override` · diff 3

Haluat muuttaa vain yhden Environment-rivin vendor unitiin ilman tiedoston kopioimista. Tapaa?

- **systemctl edit palvelu.service — drop-in override hakemistoon** ✓
- Muokkaa suoraan /usr/lib/systemd/system/
- sed unit-tiedostoon päivityksen yhteydessä
- export env ennen systemctl start

#### `b04-linux-systemd-PartOf` · diff 4

Kun `web.target` pysähtyy, worker-prosessit jäävät roikkumaan. Miten sidot workerit targetiin?

- **PartOf=web.target — worker pysähtyy kun target pysähtyy** ✓
- Wants= riittää aina samaan — Wants määrittää vain käynnistysjärjestyksen, ei pysäytystä
- KillMode=none jättää lapsiprosessit hengissä eikä sido elinkaarta targetiin mitenkään
- Ignore target ja pidä unitit täysin erillisinä — worker jää silti roikkumaan targetin pysähtyessä

#### `b04-linux-systemd-user-unit` · diff 3

Kehittäjä haluaa ajaa daemonin ilman root-oikeuksia login-sessionissa. Minne unit-tiedosto?

- **~/.config/systemd/user/palvelu.service + systemctl --user enable** ✓
- /etc/systemd/system/ aina — system-wide-hakemisto vaatii silti root-oikeudet käyttöön
- crontab @reboot riittää — cron ei tue systemd-user-instanssin resurssienhallintaa
- /etc/init.d/ vanha SysV-tapa — vaatii myös root-oikeudet eikä toimi user-sessiossa

#### `b05-linux-systemd-exec-reload` · diff 3

Config muuttui — haluat ladata palvelun ilman katkoa. Mitä eroa on reload ja restart?

- **ExecReload ajaa määritellyn komennon — palvelu voi jatkaa pyyntöjä** ✓
- reload ja restart ovat identtiset — molemmat pysäyttävät ja käynnistävät prosessin uudelleen
- reload vaatii aina koko järjestelmän rebootin ennen kuin uusi konfiguraatio tulee voimaan
- Vain systemctl restart on tuettu — ExecReload-direktiiviä ei ole olemassa systemd-unitissa

#### `b05-linux-systemd-socket-activation` · diff 4

Haluat käynnistää palvelun vasta kun porttiin tulee yhteys. Mikä systemd-ominaisuus?

- **Socket activation — socket unit herättää service unitin** ✓
- Type=forking riittää aina
- After=network.target socket activation
- Restart=on-failure korvaa socket activation

#### `b05-linux-systemd-timer-oncalendar` · diff 3

Cron-korvaaja ajaa backup-skriptin maanantaisin klo 03:00. Miten määrität systemd timerin?

- **OnCalendar=Mon *-*-* 03:00:00 timer unitissa** ✓
- Restart=always service unitissa
- WantedBy=multi-user.target riittää ajastukseen
- Type=notify timerille

#### `b05-linux-systemd-type-notify` · diff 4

Palvelu käynnistyy ennen kuin se kuuntelee porttia — riippuvat unitit jatkavat liian aikaisin. Mikä Type= arvo auttaa?

- **Type=notify — palvelu ilmoittaa valmiudesta sd_notify:llä** ✓
- Type=oneshot aina — sopii kertaluontoisiin skripteihin, ei jatkuvasti käynnissä oleviin palveluihin
- Type=simple estää riippuvuudet — simple ei tue riippuvuuksia lainkaan systemd-unitissa
- Type=idle riittää tuotantoon — idle vain viivästää käynnistystä bootissa, ei odota valmiussignaalia

#### `b06-linux-systemd-ConditionPath` · diff 4

Backup-skripti ajetaan vain jos mount on käytettävissä. Miten unit ehto?

- **ConditionPathIsMountPoint=/backup estää ajon ilman mountia** ✓
- After=backup.mount tarkistaa mountin tilan ennen käynnistystä
- ExecStartPre=test -d /backup korvaa Condition-ehdon unitissa
- WantedBy=multi-user.target määrittää mount-ehdon backup-unitille

#### `b06-linux-systemd-logind` · diff 3

Palvelu tarvitsee pysyvän session ilman interaktiivista loginia. Mitä komponentti hallinnoi?

- **systemd-logind hallinnoi sessioneja ja seat-konfiguraatiota** ✓
- cron luo ja ylläpitää kaikki login-sessionit palvelimella
- journald avaa interaktiivisen session palveluprosessille
- sshd korvaa logindin kun palvelu tarvitsee pysyvän session

#### `b06-linux-systemd-Requires` · diff 3

App unit käynnistyy ennen tietokantaa — yhteys epäonnistuu. Miten pakotat järjestys?

- **After=db.service app-unitissa pakottaa käynnistyksen järjestyksen** ✓
- Restart=always korvaa unit-riippuvuudet käynnistyksessä
- Type=simple määrittää käynnistyksen riippuvuuden automaattisesti
- ExecStartPre=sleep 30 on tuotannon standardi odotusratkaisu

#### `b07-linux-systemd-journal-unit` · diff 2

Palvelu kirjoittaa stdoutiin mutta lokit eivät näy journalctl -u myapp. Todennäköisin syy?

- **Palvelu ei ole systemd-hallinnassa tai stdout ei ohjaa journaliin** ✓
- journald on oletuksena pois päältä ja estää stdout-lokituksen
- stdout ei voi mennä journaliin systemd-palveluiden kautta
- Erillinen syslog-ng tarvitaan ennen journalctl -u myapp -näkymää

#### `b07-linux-systemd-limit-nofile` · diff 4

High-traffic palvelu saa Too many open files — ulimit ok login-shellissa. Missä korjaat systemd-palvelulle?

- **LimitNOFILE= service unitissa — systemd asettaa rajat prosessille** ✓
- /etc/security/limits.conf riittää systemd-palveluiden NOFILE-rajoihin
- sysctl -w fs.file-max korjaa yksittäisen palvelun open files -virheen
- chmod 777 /proc nostaa palvelun file descriptor -rajan heti

#### `b07-linux-systemd-wantedby` · diff 3

Uusi service unit ei käynnisty bootissa vaikka enabled näyttää ok. Mitä [Install]-osiosta puuttuu?

- **WantedBy=multi-user.target — enable luo symlinkin boot-targetiin** ✓
- After=network.target riittää unitin käynnistykseen bootissa
- Type=simple korvaa WantedBy-asetuksen [Install]-osiossa
- ExecStart=/bin/true riittää ilman WantedBy-linkitystä bootiin

#### `b08-linux-systemd-logind` · diff 4

SSH-istunto katkeaa mutta prosessi tapetaan logoutissa — haluat pitää jobin elossa. Mitä?

- **systemd-run --user scope tai tmux — logind KillUserProcesses** ✓
- nohup riittää pitämään jobin elossa systemd-logind logoutissa
- logind ei voi tappaa prosesseja kun SSH-istunto katkeaa
- Disable systemd-logind on suositeltu tapa säilyttää taustajobit

#### `b08-linux-systemd-requires` · diff 4

App service pitää käynnistyä vain jos network-online.target on valmis. Unit-riippuvuus?

- **After=network-online.target + Wants=network-online.target** ✓
- Before=network.target riittää odottamaan verkon valmistumista
- ExecStartPre=ping google.com korvaa network-online.target riippuvuuden
- Type=notify luo verkkoyhteyden ennen palvelun käynnistystä

#### `b09-linux-systemd-kill-mode` · diff 4

Palvelun unitissa on `KillMode=process` — workerit jäävät pyörimään stopin jälkeen. Mikä on turvallisempi asetus?

- **KillMode=control-group — tappaa koko cgroupin prosessit stopissa** ✓
- KillMode=process riittää kun palvelu spawnnaa child-prosesseja
- SIGKILL ensin stop-komennossa siivoaa child-prosessit varmasti
- RemainAfterExit=yes korjaa zombie-childit palvelun pysäytyksessä

#### `b09-linux-systemd-memory-limit` · diff 4

Muistivuoto täyttää koko palvelimen — haluat rajoittaa yhden unitin RAM-käytön. Mitä lisäät unit-tiedostoon?

- **MemoryMax= tai MemoryHigh= — cgroup-raja systemd unitissa** ✓
- Nice=-20 priorisoi muistia ja estää muistivuodon täyttämästä hostia
- LimitCORE=infinity rajoittaa palvelun RAM-käytön cgroupissa
- OOM-killer ei koske systemd-palveluja lainkaan muistivuodon aikana

#### `b09-linux-systemd-restart-policy` · diff 3

Palvelu kaatuu satunnaisesti yöllä — haluat automaattisen uudelleenkäynnistyksen rajoitetusti. Asetus?

- **Restart=on-failure + StartLimitIntervalSec/StartLimitBurst** ✓
- Restart=always ilman rajoja on turvallisin tuotantoasetus
- Type=simple estää palvelun kaatumiset yöllä automaattisesti
- KillMode=process korvaa restart-politiikan ja rajoittaa loopit

#### `exp-linux-systemd-failed-service` · diff 3

Tuotantopalvelu on failed-tilassa rebootin jälkeen. Mikä komento näyttää miksi yksikkö kaatui?

- **systemctl status palvelu ja journalctl -u palvelu -b** ✓
- kill -9 kaikille palveluun liittyville prosesseille
- rm /etc/systemd/system/palvelu.service poistaa virheen
- reboot uudestaan ilman lokien tarkastelua korjaa tilan

#### `exp-linux-systemd-reload-vs-restart` · diff 3

Muutit nginx unit-tiedoston ExecStart-rivin. Mitä teet ennen kuin uusi konfiguraatio on voimassa?

- **systemctl daemon-reload && systemctl restart nginx** ✓
- Vain systemctl restart — reload ei tarvita
- daemon-reload riittää — prosessi lataa automaattisesti
- Muokkaa /proc suoraan

#### `exp-linux-systemd-timer-incident` · diff 3

Yöllinen backup-skripti ei ajautunut cronin sijaan. Miten systemd-timer korvaa crontabin?

- **timer.unit + service.unit pari OnCalendar-ajastuksella** ✓
- Pelkkä .service yksikkö riittää ajastetulle systemd-tehtävälle
- systemd ei tue ajastettuja tehtäviä cron-korvauksena
- at-komento on systemd:n virallinen cron-korvike tuotannossa

#### `exp-linux-systemd-wants-vs-requires` · diff 4

App.service riippuu tietokannasta. DB kaatuu — haluat appin pysähtyvän. Mikä riippuvuus?

- **Requires=db.service — kova riippuvuus** ✓
- Wants=db.service — app jatkaa vaikka DB kuolee
- After=db.service riittää aina
- Ei riippuvuuksia — systemd arvailee

#### `systemd-after-before` · diff 4

Unit A tarvitsee verkon ennen käynnistystä mutta ei saa kaatua jos B epäonnistuu. Mikä riippuvuus?

- **After=network-online.target ilman Requires-riippuvuutta** ✓
- Requires=B varmistaa verkon ennen A:n käynnistystä
- Before=B riittää odottamaan verkkoa ennen käynnistystä
- Ei tarvita riippuvuuksia — ExecStartPre odottaa verkkoa

#### `systemd-enable-boot` · diff 3

Palvelu käynnistyy manuaalisesti mutta ei bootin jälkeen. Mitä komentoa tarvitaan?

- **systemctl enable palvelu.service** ✓
- systemctl start riittää aina bootiin
- chmod +x unit-tiedostoon
- crontab @reboot korvaa systemd:n

#### `systemd-restart-policy` · diff 4

Palvelu kaatuu satunnaisesti prosessivirheeseen. Mikä `Restart=` arvo on järkevin tuotantoon?

- **on-failure** ✓
- always joka sekunti
- no — ei koskaan uudelleenkäynnistystä
- on-success

#### `systemd-timer` · diff 4

Haluat ajastaa yöllisen backup-skriptin ilman cronia. Mikä systemd-ratkaisu?

- **.timer unit + .service unit** ✓
- OnCalendar= vain service-tiedostossa
- systemd-run --cron
- journald ajastaa automaattisesti

#### `systemd-wants-requires` · diff 4

Unit A: `Requires=B`, unit B kaatuu käynnistyksessä. Mitä tapahtuu A:lle?

- **Requires katkaisee A:n kun B epäonnistuu käynnistyksessä** ✓
- Wants ja Requires käyttäytyvät samoin riippuvuuden epäonnistuessa
- A jatkaa normaalisti ja B käynnistetään uudelleen erikseen
- systemd käynnistää A:n uudelleen kunnes B onnistuu lopulta

### systemd-hardening (3)

#### `prod-linux-capabilities-port80` · diff 4

Sovellus tarvitsee portin 80, mutta sitä ei haluta ajaa rootina. Mikä vaihtoehto on tuotannossa yleisin?

- **Reverse proxy (nginx/Caddy) portissa 80 ja sovellus kuuntelee korkeaa porttia non-rootina** ✓
- setcap cap_sys_admin=+ep — antaa kaikki admin-oikeudet ilman root-käyttäjää
- chmod 4755 binääriin — setuid riittää aina turvallisesti privileged-portteihin
- Aja palvelu rootina mutta piilota se process listasta

#### `prod-linux-systemd-analyze-security` · diff 4

Haluat arvioida unit-tiedoston eristystason ennen tuotantoon vientiä. Mikä työkalu auttaa?

- **systemd-analyze security unit.service — näyttää exposure scoren ja puuttuvat hardening-asetukset** ✓
- systemctl cat unit.service — tulostaa automaattisesti turvallisuusraportin
- journalctl -p err — näyttää vain sandbox-virheet käynnistyksessä
- strace systemd — se analysoi unit-tiedoston sandbox-asetukset

#### `prod-linux-systemd-protect-system` · diff 5

Unitissa on `ProtectSystem=strict` ja sovellus ei voi enää kirjoittaa `/var/lib/myapp`iin. Turvallisin korjaus?

- **Lisää `ReadWritePaths=/var/lib/myapp` — salli vain tarvittava kirjoituspolku** ✓
- Poista ProtectSystem kokonaan — palvelu tarvitsee täyden root-fs:n kirjoitusoikeuden
- Aja palvelu root-käyttäjänä — sandbox-asetukset eivät koske rootia
- chmod 777 /var/lib/myapp korjaa systemd-sandboxauksen rajoituksen

## postgres (121)

### pg-config (15)

#### `b03-pg-config-effective-cache` · diff 3

Planner valitsee seq scanin vaikka data mahtuu muistiin — SSD-palvelin 64 GB RAM. GUC?

- **effective_cache_size ≈ OS cache + shared_buffers arvio** ✓
- random_page_cost = 0
- seq_page_cost = 1000
- effective_cache_size = shared_buffers only

#### `b03-pg-config-random-page-cost` · diff 3

Migrated DB SSD:lle — index scan suunnitelmat ovat hitaita. Säädä?

- **random_page_cost alas (esim. 1.1) SSD:lle — planner realismi** ✓
- random_page_cost = 10000
- Poista indeksit
- SSD ei vaikuta planneriin

#### `b03-pg-config-ssl-mode` · diff 3

App yhdistää Postgresiin internetin yli — compliance vaatii salatun yhteyden. Client-parametri?

- **sslmode=verify-full (tai require minimum) connection stringissä** ✓
- sslmode=disable nopeuteen
- PostgreSQL ei tue TLS
- SSH tunnel riittää aina ilman sslmode

#### `b03-pg-config-statements-ext` · diff 3

Tuotannossa hidas query tuntematon — haluat top 10 CPU-kuluttajaa historiasta. Laajennus?

- **pg_stat_statements — shared_preload_libraries + CREATE EXTENSION** ✓
- pg_stat_activity riittää historiaan
- EXPLAIN kaikille quereille cron
- Log every query ilman sampling

#### `b04-pg-config-log-min-duration` · diff 3

Haluat lokittaa vain > 500ms kestävät kyselyt tuotannossa ilman kaiken logitusta. Parametri?

- **log_min_duration_statement = 500 (ms)** ✓
- log_statement = all
- log_connections = on
- logging_collector = off

#### `b04-pg-config-maintenance-work-mem` · diff 4

CREATE INDEX kestää tunteja isolla taululla — logissa 'external sort'. Mitä parametria nostat session tasolla?

- **maintenance_work_mem — indeksin rakennus ja VACUUM** ✓
- work_mem — sama kuin maintenance
- shared_buffers heti 64GB
- max_connections 10000

#### `b06-pg-config-checkpoint-timeout` · diff 3

Tuotanto I/O spike joka 5 min — checkpoint aiheuttaa. Mitä säätät?

- **checkpoint_timeout ja max_wal_size — levittävät checkpoint I/O:n tasaisemmaksi** ✓
- fsync = off tuotannossa poistaa checkpoint-spikeit kokonaan
- wal_level = minimal estää checkpointien aiheuttaman I/O-kuorman
- Checkpoint ei vaikuta I/O:hon koska dirty pages kirjoitetaan taustalla

#### `b06-pg-config-huge-pages` · diff 5

Suuri shared_buffers — TLB miss hidastaa. Mitä Linux + PostgreSQL optimointi?

- **huge_pages = try/on — vähentää TLB pressure suurilla shared_buffers-arvoilla** ✓
- shared_buffers = 1MB on paras tapa vähentää TLB miss -ongelmia
- swappiness = 100 parantaa PostgreSQLin muistinhallintaa Linuxissa
- Huge pages toimivat vain sovellustasolla, ei PostgreSQL-prosessissa

#### `b06-pg-config-parallel-workers` · diff 3

Raporttikysely ei parallelize — seq scan yksin. Mitä parametria nostat?

- **max_parallel_workers_per_gather ja max_parallel_workers — parallel query -asetukset** ✓
- max_connections nostaminen aktivoi parallel seq scan automaattisesti
- wal_level = replica pakottaa plannerin käyttämään parallel workers -moodia
- Parallel query ei ole tuettu PostgreSQLissä raportointikyselyille

#### `b06-pg-config-track-io-timing` · diff 4

pg_stat_statements näyttää query time mutta ei I/O breakdown. Mitä enable?

- **track_io_timing = on — mittaa I/O-operaatioiden keston diagnostiikkaan** ✓
- log_statement = all antaa I/O-erittelyn pg_stat_statements-näkymässä
- shared_preload_libraries = plpgsql aktivoi I/O timing -mittauksen
- I/O timing on automaattisesti päällä kun pg_stat_statements on ladattu

#### `b06-pg-locks-advisory` · diff 4

App-tason mutex kahden workerin välillä — ei taululock. Mitä PostgreSQL tarjoaa?

- **pg_advisory_lock / pg_try_advisory_lock — sovellustason lukitus ilman taulua** ✓
- SELECT FOR UPDATE ilman taulua luo mutexin kahden workerin välille
- UNLOGGED table toimii kevyenä mutex-ratkaisuna worker-koordinaatioon
- Advisory lockit vaativat erillisen extensionin — eivät ole core PostgreSQLissä

#### `exp-pg-config-max-connections` · diff 3

App avaa 5000 connectionia microservice-arkkitehtuurissa — CPU context switch helvetti. Ratkaisu?

- **Connection pooler (PgBouncer) + kohtuullinen max_connections** ✓
- Nosta max_connections = 10000 jotta jokainen microservice saa oman yhteyden
- Jokainen request oma server process ilman poolia skaalautuu parhaiten
- Poista idle timeout jotta yhteydet pysyvät auki ja välttävät reconnect-kustannuksen

#### `exp-pg-config-shared-buffers` · diff 3

Uusi DB-palvelin 32 GB RAM — junior asettaa shared_buffers = 32GB. Miksi väärin?

- **Liian suuri — tyypillisesti ~25 % RAM, OS cache tarvitsee tilaa** ✓
- shared_buffers max 128 MB PostgreSQL 15:ssä riippumatta palvelimen RAMista
- shared_buffers = 0 paras koska OS page cache hoitaa kaiken bufferoinnin
- PostgreSQL ei käytä shared_buffers vaan lukee suoraan levyltä joka kerta

#### `pg-config-work-mem` · diff 4

Raskas ORDER BY + hash join spillaavat levylle. Mikä istuntotason asetus auttaa ensin?

- **Kasvata work_mem harkiten — muisti per sort/hash-operaatio** ✓
- Pienennä shared_buffers aina kun sort spillaa levylle
- max_connections = 10000 antaa jokaiselle sortille oman muistipoolin
- Poista indeksit nopeuttaaksesi sort/hash-operaatioita kyselyissä

#### `pg-statement-timeout-role` · diff 3

BI-työkalun ad hoc -kyselyt pyörivät välillä tunteja ja vievät tuotantokannan resurssit. Miten rajaat vain niiden keston?

- **ALTER ROLE bi_reader SET statement_timeout = '5min' — roolikohtainen aikaraja** ✓
- Pienennä max_connections-arvoa, jolloin pitkät kyselyt katkeavat
- Laske work_mem minimiin BI-käyttäjälle, jolloin raskaat kyselyt eivät käynnisty
- Aseta statement_timeout postgresql.confissa viiteen sekuntiin kaikille

### pg-cte-window (14)

#### `sqd-cte-materialized-hint` · diff 4

PostgreSQL 12+: CTE viitataan kerran, mutta planner yhdistää sen pääkyselyyn hitaasti. Vaihtoehto?

- **WITH big AS MATERIALIZED (...) — pakota materialisointi tarvittaessa** ✓
- Lisää DISTINCT CTE:hen aina
- Poista CTE ja käytä nested SELECT
- SET enable_nestloop = off globaalisti

#### `sqd-cte-readability` · diff 3

Sama alikysely toistuu kolmessa kohdassa raportissa. Miten refaktoroit?

- **WITH base AS (SELECT ... ) SELECT ... FROM base — yksi lähde, useita viittauksia** ✓
- Kopioi alikysely kolmeen — helpompi debugata
- Luo väliaikainen taulu prodissa joka kerta
- Siirrä logiikka sovelluskoodiin string-concatilla

#### `sqd-first-value-partition` · diff 4

Jokaiselle tilaukselle tarvitset asiakkaan nimen ilman GROUP BY:ä. Mikä toimii?

- **FIRST_VALUE(customer_name) OVER (PARTITION BY customer_id ORDER BY ...)** ✓
- MAX(customer_name) — aina oikea nimi
- MIN(customer_name) nopeampi
- STRING_AGG kaikista nimistä

#### `sqd-lag-mom-comparison` · diff 4

Raportti näyttää kuukausimyynnin ja edellisen kuun eron samalla rivillä. Mikä auttaa?

- **LAG(revenue) OVER (ORDER BY month) — vertaa edelliseen riviin** ✓
- Self-join samaan tauluun aina — ikkunafunktioita ei tarvita
- SUBSTRING kuukausikentästä
- UNION kaikki kuukaudet erikseen

#### `sqd-lead-future-row` · diff 3

Seuraavan tilauksen päivämäärä samalla rivillä nykyisen kanssa. Funktio?

- **LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date)** ✓
- LAG(order_date) — seuraava rivi
- JOIN orders o2 ON o2.date = o.date + 1
- NEXTVAL sequencestä

#### `sqd-ntile-buckets` · diff 3

Jaa asiakkaat neljään kvartiiliin liikevaihdon mukaan. Funktio?

- **NTILE(4) OVER (ORDER BY revenue DESC)** ✓
- MOD(customer_id, 4) — satunnainen kvartiili
- GROUP BY revenue / 4
- CEIL(COUNT(*) / 4)

#### `sqd-percent-rank-report` · diff 3

Myyjän prosenttiosuus top-myynnistä raportissa. Ikkunafunktio?

- **PERCENT_RANK() OVER (ORDER BY sales DESC) tai vastaava suhteellinen sijoitus** ✓
- COUNT(*) / SUM(*) — sama kuin percent rank
- RANDOM() prosenttiosuuteen
- MOD(sales, 100)

#### `sqd-pivot-conditional-agg` · diff 4

Myynti riveinä (product, Q1, Q2, Q3). Ilman crosstab-laajennusta?

- **SUM(CASE WHEN quarter = 1 THEN amount END) AS q1, ... GROUP BY product** ✓
- MAX(amount) per quarter riittää
- WINDOW FUNKTIO pivotoi automaattisesti
- SELF JOIN product 3 kertaa ilman ehtoja

#### `sqd-rank-vs-dense` · diff 3

Top 3 myyjää; tasapisteet eivät saa hypätä sijaa 4:stä 6:een. Funktio?

- **DENSE_RANK() — tasatilanteessa seuraava sija ei hyppää** ✓
- RANK() — aina sama kuin DENSE_RANK
- ROW_NUMBER() sallii tasatilanteet raportissa
- NTILE(3) antaa tarkan myyjäjärjestyksen

#### `sqd-recursive-cte-hierarchy` · diff 4

Organisaatiopuu: esimies–alainen hierarkia taulussa `parent_id`. Miten haet koko alipuun?

- **WITH RECURSIVE tree AS (anchor UNION ALL lapset) SELECT ...** ✓
- Self-join kiinteään syvyyteen 10 tasoa copy-pastella
- ORDER BY parent_id riittää hierarkiaan
- CURSOR loop sovelluksessa

#### `sqd-row-number-dedup` · diff 4

Tarvitset viimeisimmän tilauksen per asiakas. Mikä ikkunafunktio?

- **ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC) = 1** ✓
- RANK() ilman PARTITION BY — riittää aina
- COUNT(*) OVER () per asiakas
- MAX(created_at) ilman joinia riittää aina yksilöivään riviin

#### `sqd-running-total` · diff 3

Kumulatiivinen summa päivittäin ilman correlated subquerya. Ratkaisu?

- **SUM(amount) OVER (ORDER BY day ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)** ✓
- (SELECT SUM(...) FROM t t2 WHERE t2.day <= t.day) jokaiselle riville
- GROUP BY day ja kasvata summaa sovelluksessa
- CROSS JOIN kaikkiin päiviin

#### `sqd-window-frame-rows` · diff 4

7 päivän liukuva keskiarvo. Frame-määrittely?

- **ROWS BETWEEN 6 PRECEDING AND CURRENT ROW — seitsemän päivän ikkuna** ✓
- RANGE BETWEEN 6 PRECEDING AND CURRENT ROW aina sama kuin ROWS
- UNBOUNDED FOLLOWING — 7 päivää taaksepäin
- GROUP BY week riittää päivittäiseen keskiarvoon

#### `sqd-window-vs-group-by` · diff 3

Tarvitset rivin arvon JA koko taulun keskiarvon samalla rivillä ilman self-joinia.

- **AVG(amount) OVER () — ikkuna ilman PARTITION BY** ✓
- GROUP BY tyhjä — palauttaa yhden rivin per lähde
- CROSS JOIN (SELECT AVG...) — aina parempi
- HAVING AVG(amount)

### pg-explain (15)

#### `b03-pg-explain-buffers-hit` · diff 4

EXPLAIN ANALYZE näyttää hitaudesta — haluat tietää cache hit vs disk read. Lippu?

- **EXPLAIN (ANALYZE, BUFFERS) — shared/local hit read** ✓
- EXPLAIN VERBOSE only
- BUFFERS vaatii superuser aina
- pg_stat_user_tables riittää query-tasolle

#### `b03-pg-explain-hash-join-memory` · diff 4

Hash Join spillaa temp tiedostoon — query hidastuu 10x. work_mem liian pieni. Mitä näet?

- **EXPLAIN ANALYZE: Hash Batches > 1 tai temp file — nosta work_mem varovasti** ✓
- Seq Scan aina nopein
- Hash join ei käytä muistia
- work_mem vaikuttaa vain sort

#### `b03-pg-explain-index-only-scan` · diff 3

Planner valitsee Index Scan vaikka covering index voisi riittää. Ehto Index Only Scan?

- **Index sisältää kaikki tarvittavat sarakkeet + visibility map ajantasainen** ✓
- Index Only Scan ei koskaan toimi
- VACUUM ei vaikuta visibility map
- Seq scan aina parempi

#### `b03-pg-explain-isolation-level` · diff 4

Raportti lukee saman rivin kahdesti saman transactionin aikana — toinen transaction commitoi välissä. Taso?

- **READ COMMITTED sallii non-repeatable read — tarvitset REPEATABLE READ jos tarpeen** ✓
- SERIALIZABLE estää kaiken lukemisen
- READ UNCOMMITTED on Postgres default
- Isolation level ei vaikuta SELECT

#### `b04-pg-explain-parallel` · diff 4

Iso aggregation ei käytä parallel workers vaikka max_parallel_workers_per_gather > 0. Tarkista ensin?

- **Onko kysely parallel safe — EXPLAIN näyttää Gather; tarkista parallel_setup_cost ja table size** ✓
- Parallel on aina päällä automaattisesti
- Vain REINDEX käyttää parallelia
- max_connections estää parallelin

#### `b06-pg-explain-generic-plan` · diff 4

Prepared statement plan on hidas eri parametreilla. Miten näet generic plan?

- **EXPLAIN (GENERIC_PLAN) — näyttää suunnitelman ilman parametriarvoja** ✓
- EXPLAIN ilman ANALYZE riittää näyttämään prepared statementin generic planin
- DEALLOCATE kaikki prepared statementit korjaa generic plan -ongelman pysyvästi
- Generic plan -käsite ei ole tuettu PostgreSQLin prepared statementeissa

#### `b06-pg-explain-misestimate-rows` · diff 4

Planner valitsee seq scan — rows estimate 10 mutta actual 10M. Juurisyy?

- **Vanhentuneet tilastot — aja ANALYZE tai harkitse extended statistics** ✓
- Seq scan valinta on aina planner-bugi kun actual rows poikkeaa arviosta
- Indeksi puuttuu aina kun planner arvioi 10 riviä mutta löytää 10 miljoonaa
- work_mem on liian korkea ja se vääristää plannerin rivimääräarvioita

#### `b07-pg-explain-prepare` · diff 3

Sovellus ajaa saman SQL:n parametreilla miljoonia kertoja — parse overhead. Ratkaisu?

- **Prepared statements — parse kerran, suorita monta kertaa parametreilla** ✓
- String concat SQL aina on turvallisin tapa vähentää parse overheadia
- Poista parametrit kyselystä jotta PostgreSQL cachettaa suunnitelman
- EXPLAIN jokaisessa requestissa cachettaa suunnitelman automaattisesti

#### `b08-pg-explain-nested-loop` · diff 4

Nested Loop + Seq Scan sisäpuolella miljoona riviä — hidas join. Milloin NL on OK?

- **Ulkopuoli pieni ja sisäpuolella indeksi — NL + index scan on OK** ✓
- Nested loop on aina huono riippumatta ulkoisen taulun koosta
- Hash join ei ole olemassa PostgreSQLissä suurten taulujen yhdistämisessä
- Seq scan sisä loopissa on OK kun ulkopuolella on alle miljoona riviä

#### `b09-pg-explain-nested-loop` · diff 4

JOIN 100k × 100k riviä — Nested Loop cost 10^9. Mitä plannerin pitäisi valita?

- **Hash Join tai Merge Join — tarkista indeksit ja stats isoille dataseteille** ✓
- Nested Loop on aina nopein 100k × 100k rivin joinissa
- Lisää LIMIT ilman ORDER BY korjaa nested loop -kustannuksen joinissa
- JOIN ei skaalaudu PostgreSQLissä yli tuhannen rivin tuloksiin

#### `exp-pg-explain-nested-loop` · diff 4

JOIN palauttaa miljoona riviä — plan näyttää Nested Loop ja seq scan isolla taululla. Ensimmäinen epäily?

- **Puuttuva indeksi join/where-sarakkeelle — planner valitsee huonon polun** ✓
- Nested Loop on aina paras join-menetelmä miljoonan rivin tuloksissa
- Hash Join ei ole PostgreSQLissä saatavilla suurten taulujen yhdistämisessä
- Planner ei käytä indeksejä kun JOIN palauttaa enemmän kuin tuhat riviä

#### `exp-pg-explain-seq-scan-ok` · diff 3

Junior haluaa poistaa seq scanin pienestä lookup-taulusta (200 riviä). Neuvo?

- **Seq scan voi olla halvin pienelle taululle — indeksi ei aina kannata** ✓
- Seq scan on aina bugi ja pitää korjata enable_seqscan=off-asetuksella
- enable_seqscan=off tuotannossa pakottaa indeksin pienille lookup-tauluille
- Materialized view on pakollinen kun lookup-taulussa on alle tuhat riviä

#### `exp-pg-explain-stats-stale` · diff 4

Plan muuttui yllättäen huonoksi bulk loadin jälkeen — row estimate väärä. Korjaus?

- **ANALYZE taulu — päivitä statistics bulk loadin jälkeen** ✓
- REINDEX DATABASE korjaa row estimate -virheet bulk loadin jälkeen
- Restart postgres pakottaa plannerin lukemaan uudet rivimäärät taulusta
- Planner ei käytä statistiikkaa vaan laskee rivit jokaisessa kyselyssä

#### `pg-explain-analyze` · diff 4

Kysely hidastui tuotannossa. Ennen konfiguraation säätöä: miten näet todelliset ajat ja rivimäärät turvallisesti?

- **EXPLAIN (ANALYZE, BUFFERS) staging-kopiossa tai testiympäristössä** ✓
- EXPLAIN ANALYZE suoraan prodissa ruuhka-aikaan jokaiselle hitaalle kyselylle
- pg_sleep ennen jokaista kyselyä tasaa kuormaa ja paljastaa pullonkaulat
- Vain \d taulu riittää näyttämään todelliset ajat ja rivimäärät

#### `pg-explain-seq-scan` · diff 3

EXPLAIN näyttää Seq Scan isolla taululla vaikka indeksi on. Tyypillisin syy?

- **Suuri osa taulusta haetaan — seq scan halvempi kuin indeksi** ✓
- PostgreSQL ei koskaan käytä indeksiä kun taulussa on yli miljoona riviä
- Indeksi on aina rikki bulk loadin jälkeen ja vaatii REINDEX DATABASE
- VACUUM FULL pakollinen ennen kuin planner voi valita Index Scanin

### pg-indexes (16)

#### `b03-pg-indexes-concurrent-create` · diff 3

Tuotantotauluun uusi indeksi — CREATE INDEX lukitsee kirjoitukset. Online-vaihtoehto?

- **CREATE INDEX CONCURRENTLY — ei exclusive lock kirjoituksille** ✓
- REINDEX CONCURRENTLY table
- Indeksi vain yöllä VACUUM FULL
- CONCURRENTLY on nopeampi aina

#### `b03-pg-indexes-fillfactor-update` · diff 4

Heavy HOT update -taulu bloataa nopeasti vaikka autovacuum päällä. Taulutason säätö?

- **FILLFACTOR < 100 jättää tilaa HOT updatelille — vähentää index churn** ✓
- FILLFACTOR 100 aina paras
- CLUSTER päivittää fillfactorin
- Fillfactor vain indekseille

#### `b03-pg-indexes-gin-jsonb` · diff 4

JSONB metadata-kenttä `@> '{"status":"active"}'` query hidas seq scan. Indeksi?

- **GIN index jsonb_column — containment queries** ✓
- B-tree jsonb_column
- Hash index jsonb
- JSONB ei indeksoitu

#### `b03-pg-locks-blocking-query` · diff 4

UPDATE jää odottamaan — pg_stat_activity näyttää wait_event lock. Ensimmäinen diagnostiikka?

- **pg_locks + pg_blocking_pids() — kuka pitää lukkoa** ✓
- REINDEX DATABASE
- restart postgres
- Locks eivät vaikuta UPDATEen

#### `b04-pg-indexes-expression` · diff 4

Kysely `WHERE lower(email) = 'foo@bar.com'` — indeksi email-sarakkeella ei käytössä. Ratkaisu?

- **Expression index: CREATE INDEX ON users (lower(email))** ✓
- Seq scan on aina ok
- B-tree email riittää funktiokutsulle
- Trigger joka kopioi lower email

#### `b05-pg-indexes-duplicate-drop` · diff 2

Kaksi identtistä btree-indeksiä samoille sarakkeille — kirjoitus hidasta. Toimenpide?

- **DROP INDEX toinen — duplikaatti indeksi turha ylläpito** ✓
- Pidä molemmat varmuuden vuoksi
- REINDEX molemmat
- Indeksit eivät vaikuta INSERT-nopeuteen

#### `b06-pg-indexes-brin-timeseries` · diff 4

Aikasarjataulu — miljardi rivi, queries aikarangeilla. Kustannustehokas index?

- **BRIN-indeksi — block range, pieni koko järjestetylle aikasarjadatalle** ✓
- Btree-indeksi on aina halvin miljardin rivin aikasarjataulussa
- GIN-indeksi on paras valinta timestamp-sarakkeen range-hakuun
- Seq scan on ainoa vaihtoehto kun taulussa on yli miljardi riviä

#### `b06-pg-indexes-hash-index` · diff 3

Harkitset hash-indeksiä UUID-sarakkeelle, jota haetaan vain yhtäsuuruudella. Mikä rajoitus on hyvä tietää?

- **Hash-indeksi sopii vain =-vertailuun — range scan ei toimi hash-indeksillä** ✓
- Hash-indeksi korvaa btree-indeksin kaikissa UUID-hauissa automaattisesti
- Hash-indeksi tukee ORDER BY -lausekkeita samalla tavalla kuin btree-indeksi
- Hash-indeksi on PostgreSQLin oletusindeksityyppi CREATE INDEX -komennossa

#### `b06-pg-indexes-reindex-concurrently` · diff 4

Bloated index tuotannossa — REINDEX lukitsee taulu. Miten ilman downtime?

- **REINDEX INDEX CONCURRENTLY — ei exclusive lockia tuotannossa** ✓
- DROP INDEX ja CREATE INDEX uudelleen välttää lukituksen bloated indeksissä
- VACUUM rebuildaa indeksin automaattisesti ilman erillistä REINDEX-komentoa
- CONCURRENTLY-optio toimii vain CREATE INDEX -komennossa, ei REINDEX:ssä

#### `b08-pg-indexes-btree-gist` · diff 4

Geo-query: `WHERE location && box` — btree ei toimi. Indeksityyppi?

- **GiST (tai SP-GiST) — geometriset operaattorit kuten && box-overlap** ✓
- B-tree location-sarakkeelle riittää && box-overlap -kyselyihin
- Hash-indeksi &&-operaattorille on nopein geo-query-ratkaisu
- PostgreSQL ei tue geo-indeksejä — tarvitaan erillinen tietokanta

#### `b08-pg-indexes-multicolumn-order` · diff 3

Indeksi (a,b) — query WHERE b=1 ei käytä indeksiä tehokkaasti. Miksi?

- **B-tree composite: vasemmanpuoleinen prefix — tarvitsee a:n tai (a,b)-ehdon** ✓
- PostgreSQL skannaa aina koko (a,b)-indeksin vaikka WHERE käyttää vain b:tä
- Sarakkeiden järjestyksellä indeksissä ei ole väliä equality- ja range-hauissa
- b-only query hyödyntää (a,b)-indeksiä täydellisesti ilman erillistä indeksiä

#### `exp-pg-indexes-btree-composite` · diff 3

Query: WHERE tenant_id = ? AND created_at > ? ORDER BY created_at. Yksi indeksi — mikä järjestys?

- **(tenant_id, created_at) — equality ensin, range seuraavaksi** ✓
- (created_at, tenant_id) aina paras järjestys equality- ja range-ehdoille
- Kaksi erillistä indeksiä riittää aina ORDER BY created_at -lausekkeeseen
- Vain tenant_id indeksissä riittää kun created_at on range-ehto

#### `exp-pg-indexes-covering` · diff 4

EXPLAIN näyttää Index Scan mutta silti heap fetch jokaiselle riville SELECT listassa. Miten vältät extra I/O:n?

- **INCLUDE-sarakkeet indexiin tekevät index-only scanin mahdolliseksi** ✓
- Lisää seq scan hint plannerille jotta heap fetch ohitetaan automaattisesti
- Poista WHERE-ehto jotta Index Scan palauttaa kaikki SELECT-sarakkeet
- CLUSTER TABLE riittää korvaamaan covering indexin SELECT-listassa

#### `exp-pg-indexes-unused-drop` · diff 3

Kirjoitus hidasta — pg_stat_user_indexes näyttää idx_scan = 0 kuukausien jälkeen. Toimenpide?

- **Harkitse DROP INDEX — dead index hidastaa INSERT/UPDATE-operaatioita** ✓
- REINDEX kaikki automaattisesti kun idx_scan pysyy nollassa kuukausia
- Indeksi ei vaikuta kirjoitukseen koska planner käyttää vain read-polkuja
- Lisää lisää indeksejä nopeuteen kun yksikään indeksi ei ole käytössä

#### `pg-indexes-btree-selective` · diff 3

Taulussa 10M riviä, kysely `WHERE status = 'active'` palauttaa 2 % riveistä. Ensimmäinen optimointi?

- **B-tree-indeksi status-sarakkeelle selektiiviseen WHERE-ehtoon** ✓
- SELECT * nopeuttaa kyselyä kun kaikki sarakkeet haetaan kerralla
- PRIMARY KEY:n poisto vähentää indeksiylläpitoa ja nopeuttaa hakuja
- random_page_cost = 0 ohjaa plannerin käyttämään seq scania aina

#### `pg-indexes-partial` · diff 5

Kyselyt kohdistuvat usein `WHERE archived = false`. Indeksi on iso ja hidas. Ratkaisu?

- **Partial index WHERE archived = false rajaa indeksin aktiivisiin riveihin** ✓
- CLUSTER koko taulu uudelleen järjestää rivit archived-ehdon mukaan
- BRIN-indeksi kaikille sarakkeille korvaa partial indexin aina
- Poista WHERE-ehto kyselystä jotta planner käyttää olemassa olevaa indeksiä

### pg-joins (11)

#### `sqd-correlated-subquery-cost` · diff 4

Correlated subquery jokaiselle riville on hidas. Ensimmäinen refaktorointi?

- **JOIN tai window-funktio tai EXISTS — vertaa EXPLAINilla** ✓
- Lisää DISTINCT subqueryyn
- Kasvata seq_page_cost
- Poista indeksit

#### `sqd-filter-outer-join` · diff 4

LEFT JOIN orders, mutta haluat vain avoimet tilaukset — asiakkaat ilman avointa säilyvät. Missä ehto?

- **orders.status = 'open' ON-ehdossa (tai equivalent) — ei WHERE joka muuttaa left joinin inneriksi** ✓
- WHERE orders.status = 'open' — säilyttää asiakkaat ilman tilausta
- HAVING status = open
- WHERE orders.id IS NOT NULL aina

#### `sqd-inner-vs-left` · diff 3

Raportti: kaikki asiakkaat, myös ilman tilauksia. Join-tyyppi?

- **LEFT JOIN orders — säilytä vasemman puolen rivit vaikka oikea puuttuu** ✓
- INNER JOIN — näyttää asiakkaat ilman tilauksia
- CROSS JOIN customers, orders
- RIGHT JOIN aina parempi kuin LEFT

#### `sqd-lateral-top-n` · diff 4

Kolme viimeisintä tilausta per asiakas ilman window-funktiota. PostgreSQL-malli?

- **LATERAL (SELECT ... FROM orders o WHERE o.customer_id = c.id ORDER BY ... LIMIT 3)** ✓
- CROSS JOIN orders ilman rajaus
- GROUP BY customer_id ja MAX kolme kertaa
- UNION kolme erillistä kyselyä per asiakas

#### `sqd-left-join-count-zero` · diff 3

Raportti: tilausten määrä per asiakas, myös nollat. `LEFT JOIN orders o ... GROUP BY c.id` ja `COUNT(*)` näyttää tilauksettomille asiakkaille luvun 1. Korjaus?

- **COUNT(o.id) — laskee vain rivit, joilla on tilaus; LEFT JOINin NULL-rivi jää laskematta** ✓
- Vaihda LEFT JOIN INNER JOINiksi, jolloin tilauksettomat asiakkaat saavat arvon 0
- Lisää HAVING COUNT(*) > 1, jotta tyhjät ryhmät nollautuvat raportissa
- COUNT(DISTINCT c.id) laskee tilaukset asiakaskohtaisesti oikein

#### `sqd-many-to-many-bridge` · diff 3

Opiskelija–kurssi moni-moneen. Miten haet kurssin opiskelijat?

- **JOIN bridge-taulu enrollment: students → enrollment → courses** ✓
- Suora JOIN students ja courses ilman välitaulua
- UNION students ja courses
- JSON-array students-taulussa aina

#### `sqd-natural-join-avoid` · diff 2

Tiimi käyttää NATURAL JOIN nopeuteen. Mikä riski?

- **Sarakkeet matchaavat nimellä — schema-muutos voi yhdistää väärät sarakkeet hiljaa** ✓
- NATURAL JOIN on aina hitaampi kuin INNER
- PostgreSQL ei tue NATURAL JOINia
- NATURAL JOIN pakottaa CROSS JOINin

#### `sqd-not-exists-anti` · diff 3

Asiakkaat jotka eivät ole koskaan tilanneet. Malli?

- **WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)** ✓
- WHERE customer_id NOT IN (SELECT ...) — aina turvallisin NULL:ien kanssa
- LEFT JOIN ja WHERE orders.id = NULL
- EXCEPT ilman indeksejä aina hitain

#### `sqd-not-in-null` · diff 4

Kysely `WHERE customer_id NOT IN (SELECT customer_id FROM blacklist)` palauttaa yhtäkkiä nolla riviä. Blacklist-tauluun lisättiin rivi, jossa customer_id on NULL. Miksi?

- **NOT IN vertaa jokaiseen arvoon: x <> NULL on tuntematon, joten ehto ei ole koskaan tosi — käytä NOT EXISTS** ✓
- NULL-rivi rikkoo blacklist-taulun indeksin, joten alikysely epäonnistuu hiljaa ja palauttaa tyhjän
- NOT IN toimii vain numeerisille sarakkeille, ja NULL muuttaa alikyselyn tuloksen tyypin tekstiksi
- PostgreSQL rajaa NOT IN -alikyselyn tuhanteen riviin, ja NULL-rivi ylittää rajan

#### `sqd-null-safe-join` · diff 3

JOIN kahdella sarakkeella joissa voi olla NULL. Mikä vertailu on turvallisin?

- **IS NOT DISTINCT FROM — NULL-turvallinen yhtäsuuruus** ✓
- = vertaa NULLit oikein aina
- COALESCE(id,0) joinissa — ei muuta semantiikkaa
- NOT IN korvaa joinin

#### `sqd-semi-join-distinct` · diff 3

Tarvitset asiakkaat joilla on tilaus — ei tarvitse tilausrivejä. Vältä?

- **SELECT DISTINCT customers.* JOIN orders — turha duplikointi; käytä EXISTS tai DISTINCT customer_id** ✓
- JOIN ja DISTINCT aina pakollinen
- CROSS JOIN nopein
- UNION customers ja orders

### pg-json (9)

#### `sqd-foreign-data-wrapper` · diff 4

Data lake -tiedostot S3:ssa, analytiikka SQL:llä PostgreSQListä. Integraatio?

- **Foreign Data Wrapper (esim. parquet_fdw/s3) — kysely ulkoiseen lähteeseen** ✓
- COPY koko lake kantaan joka yö aina
- JSONB ja INSERT manuaalisesti
- S3 URL SELECT FROM -syntaksilla natiivisti

#### `sqd-json-aggregate` · diff 3

Rakenna JSON-array aggregoiduista riveistä raporttiin.

- **jsonb_agg(row_to_json(t)) tai json_agg(...) GROUP BY ...** ✓
- STRING_CONCAT manuaalisesti
- ARRAY_AGG ja cast textiksi aina
- COPY JSON

#### `sqd-json-path-query` · diff 4

Monimutkainen polku JSONB:ssä SQL:llä (PG 12+). Funktio?

- **jsonb_path_query(payload, '$.orders[*].total ? (@ > 100)')** ✓
- payload->orders->total>100 — standardi polku
- REGEXP_MATCH payload
- XMLTABLE JSON:lle

#### `sqd-json-vs-normalize` · diff 3

API tallentaa koko vastauksen JSONB:hen. Milloin eriytät sarakkeet?

- **Kun kenttää suodatetaan/indeksoidaan usein — normalisoi kriittiset sarakkeet** ✓
- Aina JSONB — normalisointi on aina huono
- Ei koskaan — JSON korvaa relaatiomallin
- Vain jos data < 1 kt

#### `sqd-jsonb-array-elements` · diff 3

JSON-taulukko `tags: ["a","b"]` — yksi rivi per tagi.

- **jsonb_array_elements_text(payload->'tags') tai jsonb_array_elements** ✓
- payload->tags — palauttaa usean rivin automaattisesti
- UNNEST ilman funktiota jsonb:llä
- CROSS JOIN generate_series(0,100)

#### `sqd-jsonb-arrow-op` · diff 3

JSONB-kentässä `{"user":{"email":"a@b.c"}}` — hae email merkkijonona.

- **payload #>> '{user,email}' tai payload->'user'->>'email'** ✓
- payload->user.email — JSON path ilman lainausmerkkejä
- payload::text LIKE '%email%' tuotannossa
- json_extract PostgreSQL:ssä

#### `sqd-jsonb-containment` · diff 3

Etsi rivit joissa JSON sisältää `"status":"active"`. Operaattori?

- **payload @> '{"status":"active"}'::jsonb — containment** ✓
- payload LIKE '%active%' — indeksoitu
- payload = '{"status":"active"}' — osittainen match
- JSON_EQUALS(payload, ...)

#### `sqd-jsonb-gin-index` · diff 4

Usein `WHERE payload @> ...` jsonb-sarakkeessa. Indeksi?

- **CREATE INDEX ON t USING gin (payload jsonb_path_ops) tai gin (payload) — työkuorman mukaan** ✓
- B-tree payload-sarakkeelle aina paras
- Ei indeksiä — seq scan on nopea JSON:lle
- HASH index jsonb:lle

#### `sqd-jsonb-set-update` · diff 3

Päivitä yksi avain JSONB-dokumentissa ilman koko dokumentin korvaamista.

- **jsonb_set(payload, '{status}', '"closed"')** ✓
- payload = jsonb_build_object('status','closed') — säilyttää muut avaimet aina
- payload::text replace
- DELETE payload

### pg-query-design (21)

#### `sqd-aggregate-filter` · diff 3

Raportti tarvitsee samalle riville kaikkien tilausten määrän sekä avoimet ja peruutetut erikseen. Siistein PostgreSQL-tapa yhdellä kyselyllä?

- **COUNT(*) FILTER (WHERE status = 'open') ja vastaava FILTER peruutetuille** ✓
- Kolme erillistä kyselyä ja UNION ALL, koska aggregaatti ei voi rajata rivejä
- GROUP BY status palauttaa kaikki luvut samalle riville automaattisesti
- WHERE status IN ('open', 'cancelled') ja COUNT(*) kahteen kertaan

#### `sqd-avoid-cartesian` · diff 3

Kysely palauttaa odottamattoman monta riviä: 1000 × 1000. Todennäköisin virhe?

- **Puuttuva tai väärä JOIN-ehto — karteesinen tulo kahdesta taulusta** ✓
- Liian pieni work_mem aiheuttaa rivien kertautumisen
- GROUP BY puuttuu aina kun rivimäärä kasvaa
- ORDER BY aiheuttaa rivien moninkertaistumisen

#### `sqd-case-format-output` · diff 2

Raportti Exceliin: status-koodi 1/2/3 pitää näyttää teksteinä. Missä muotoilet?

- **CASE WHEN status = 1 THEN 'Avoin' ... END SELECTissä — muotoile tulosrivillä** ✓
- Muotoile vain frontendissä — SQL palauttaa aina raakakoodit
- Päivitä tauluun tekstit jokaisella raportilla
- Käytä HAVING muotoiluun

#### `sqd-distinct-join-duplicates` · diff 3

JOIN palauttaa saman asiakkaan viidesti. Raportti tarvitsee yhden rivin per asiakas. Ensimmäinen korjaus?

- **Tarkista join-ehto ja tarvittaessa DISTINCT ON (customer_id) tai deduplikointi ikkunafunktiolla** ✓
- Lisää SELECT DISTINCT * — se korjaa aina join-ongelman
- Kasvata work_mem — duplikaatit katoavat
- Käytä CROSS JOIN nopeampaan tulokseen

#### `sqd-exists-vs-count` · diff 3

Tarvitset vain tiedon: onko asiakkaalla avoin tilaus. Tehokkain ilmaisu?

- **EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.status = 'open')** ✓
- (SELECT COUNT(*) FROM orders ...) > 0 — selkeämpi ja aina nopein
- JOIN orders ja COUNT(*) GROUP BY — kevyin tapa
- SELECT MAX(order_id) ja vertaa nollaan

#### `sqd-filter-before-join` · diff 3

Liität `orders` (50M riviä) ja `customers` (2M). Tarvitset vain viime kuun tilaukset. Missä suodatus?

- **Suodata orders aikarajalla ennen JOINia — pienennä joukkoa mahdollisimman aikaisin** ✓
- JOIN ensin, WHERE vasta lopussa — optimointi hoitaa järjestyksen aina
- Hae molemmat taulut kokonaan CTE:hen ja suodata siellä
- Käytä CROSS JOIN ja suodata lopuksi HAVING:lla

#### `sqd-group-by-discipline` · diff 3

Raportti: summa per alue. Miksi SELECT-listassa saa olla vain GROUP BY -sarakkeita ja aggregaatteja?

- **Ryhmässä on monta riviä — ei-aggregoidulla sarakkeella ei olisi yhtä arvoa** ✓
- Lisää kaikki sarakkeet SELECT *:llä — GROUP BY korjaa duplikaatit
- ORDER BY piilottaa GROUP BY -virheet
- HAVING korvaa GROUP BY:n

#### `sqd-grouping-sets` · diff 4

Tarvitset summat alueittain, tuoteperheittäin ja grand totalin yhdellä kyselyllä.

- **GROUP BY GROUPING SETS ((region), (product_family), ())** ✓
- ROLLUP aina tuottaa kaikki yhdistelmät automaattisesti oikein
- UNION neljä erillistä GROUP BY -kyselyä on aina nopein
- WITH ROLLUP on natiivi PostgreSQL-syntaksi

#### `sqd-half-open-date-range` · diff 3

Kuukausiraportti: `WHERE created_at BETWEEN '2024-03-01' AND '2024-03-31'`, ja created_at on timestamptz. Osa 31.3. tehdyistä tilauksista puuttuu. Miksi ja miten korjaat?

- **Yläraja tarkoittaa 31.3. klo 00.00 — käytä puoliavointa väliä: >= '2024-03-01' AND < '2024-04-01'** ✓
- BETWEEN jättää molemmat rajat pois, joten kuukauden ensimmäinen ja viimeinen päivä puuttuvat
- Lisää ORDER BY created_at, jolloin viimeisen päivän rivit tulevat mukaan tulokseen
- timestamptz tallentaa ajat UTC:nä, joten 31.3. rivit siirtyvät huhtikuulle pysyvästi

#### `sqd-having-vs-where` · diff 3

Haluat rivit joissa `status = 'active'` ennen ryhmittelyä. Mihin ehto kuuluu?

- **WHERE status = 'active' ennen GROUP BY — suodata rivit ennen aggregointia** ✓
- HAVING status = 'active' koska se suodattaa ryhmiä
- HAVING ennen WHERE — järjestys on SQL:ssä vapaa
- Lisää status SELECT-listaan ja suodata ulkoisessa kyselyssä aina

#### `sqd-keyset-pagination` · diff 4

API-sivutus OFFSET 500000 hidastuu. Parempi malli suurille tauluille?

- **Keyset pagination: WHERE id > :last_id ORDER BY id LIMIT 50** ✓
- OFFSET 500000 LIMIT 50 — yksinkertainen ja skaalautuva
- Lataa kaikki id:t muistiin ja slice JavaScriptissä
- ORDER BY random() LIMIT 50 sivutuksessa

#### `sqd-limit-preview` · diff 2

Kehität uutta analytiikkakyselyä tuotantataululle. Miten testaat turvallisesti?

- **LIMIT 100 tai vastaava otos + WHERE rajaus — älä aja täyttä skannausta toistuvasti** ✓
- Aja täysi kysely kerran nähdäksesi kaiken datan
- Poista indeksit testauksen ajaksi nopeuttaaksesi
- Käytä SELECT * ilman LIMITiä stagingissa

#### `sqd-null-equality` · diff 1

Kysely `SELECT * FROM users WHERE deleted_at = NULL` ei palauta yhtään riviä, vaikka poistamattomia käyttäjiä on tuhansia. Miksi?

- **Vertailu NULLiin on aina tuntematon — oikea ehto on deleted_at IS NULL** ✓
- NULL-arvot eivät ole indeksissä, joten haku ei löydä niitä
- = NULL toimii vain, jos sarakkeelle on asetettu DEFAULT NULL
- Kysely tarvitsee LIMITin, koska NULL-rivejä on liikaa palautettavaksi

#### `sqd-numeric-money` · diff 2

Laskujen summat tallennetaan `double precision` -sarakkeeseen, ja kuukausisumma heittää sentin verran. Mikä tyyppi rahalle?

- **numeric(12,2) tai kokonaisluku sentteinä — tarkat desimaalit** ✓
- real — pienempi liukuluku pyöristää vähemmän kuin double precision
- money-tyyppi, koska se muuntaa valuutat automaattisesti oikein
- text, jotta desimaalierotin säilyy täsmälleen syötetyssä muodossa

#### `sqd-readable-cte-names` · diff 2

Monivaiheinen raportti on vaikea lukea sisäkkäisillä alikyselyillä. Mitä kokeilet ensin?

- **WITH recent_orders AS (...), totals AS (...) — nimetty CTE parantaa luettavuutta** ✓
- Lisää kommentit jokaisen rivin perään 200-rivisessä kyselyssä
- Yhdistä kaikki yhdeksi riviksi ilman välilyöntejä
- Kopioi sama alikysely viiteen kohtaan copy-pastella

#### `sqd-sargable-where` · diff 3

Indeksoitu `created_at`-sarake. Mikä WHERE estää indeksin käytön tyypillisesti?

- **WHERE DATE(created_at) = CURRENT_DATE — funktio sarakkeella rikkoo sargabilityn** ✓
- WHERE created_at >= CURRENT_DATE AND created_at < CURRENT_DATE + 1
- WHERE created_at BETWEEN ...
- WHERE created_at > now() - interval '1 day'

#### `sqd-select-columns-only` · diff 2

Raportti tarvitsee vain `order_id` ja `description` miljoonarivisestä `orders`-taulusta. Mikä on ensimmäinen hyvä tapa?

- **SELECT order_id, description — vain tarvittavat sarakkeet, ei SELECT *** ✓
- SELECT * ja suodata sarakkeet sovelluksessa muistissa
- Lataa koko taulu väliaikaistauluun ja poimi sarakkeet siellä
- COPY koko taulu levylle ja käsittele offline

#### `sqd-semicolon-style` · diff 2

Tiimi jakaa SQL-skriptejä code reviewssa. Mikä käytäntö parantaa ylläpidettävyyttä?

- **Yksi looginen lause per rivi, isoitu avainsana, selkeä sarakkeiden lista — yhtenäinen tyyli** ✓
- Minifiöi kaikki yhdeksi riviksi nopeuttaaksesi parseria
- Käytä SELECT * kaikissa raporteissa yhtenäisyyden vuoksi
- Vältä kommentteja — ne vanhenevat

#### `sqd-timestamptz` · diff 3

Palvelimet ovat eri aikavyöhykkeillä, ja tapahtumien järjestys sekoaa raporteissa. Aikasarake on `timestamp` (without time zone). Mikä on suositus?

- **timestamptz — yksiselitteinen hetki, joka näytetään istunnon aikavyöhykkeessä** ✓
- timestamp riittää, kunhan jokainen palvelin asettaa kellonsa paikalliseen aikaan
- Tallenna aika tekstinä ISO-muodossa, jolloin vyöhyke ei vaikuta järjestykseen
- Käytä date-tyyppiä ja erillistä time-saraketta, niin vyöhykkeet eivät sekoitu

#### `sqd-union-all-vs-union` · diff 3

Yhdistät kahden alueen myyntirivit; duplikaatteja ei pitäisi syntyä. Valinta?

- **UNION ALL kun joukot ovat erillisiä — nopeampi, ei deduplikointia** ✓
- UNION aina — se on turvallisempi vaikka data on erillistä
- UNION ALL vain jos tarvitset DISTINCT
- INSERT kahdesti samaan tauluun UNION:in sijaan

#### `sqd-upsert-on-conflict` · diff 3

Import-ajo lisää tuotteita: uusi SKU lisätään, olemassa olevan hinta päivitetään. Koodi tekee SELECTin ja sitten INSERTin tai UPDATEn, ja rinnakkaiset ajot kaatuvat unique-virheeseen. Ratkaisu?

- **INSERT ... ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price — atominen upsert** ✓
- Lukitse koko taulu LOCK TABLE -komennolla jokaisen rivin käsittelyn ajaksi
- Poista unique-rajoite, jolloin rinnakkaiset ajot eivät enää kaadu virheeseen
- Aja SELECT kahdesti ennen INSERTiä, niin kilpailutilanne ehtii ratketa

### pg-sql-security (8)

#### `sqd-dynamic-order-by` · diff 4

API sallii sorttaussarakkeen nimen. Turvallinen toteutus?

- **Whitelist sallituista sarakkeista — ei suoraa user inputia ORDER BY:hin** ✓
- ORDER BY || userColumn suoraan
- REPLACE(userColumn, ';', '') riittää
- Käytä prepared statement ORDER BY:ssä vapaasti

#### `sqd-error-leak` · diff 2

API palauttaa virheessä koko PostgreSQL-virheilmoituksen asiakkaalle. Ongelma?

- **Vuotaa skeemaa ja kyselyrakennetta — palauta geneerinen viesti, lokita serverille** ✓
- Auttaa käyttäjää korjaamaan SQL:ää nopeammin
- Parantaa turvallisuutta
- PostgreSQL vaatii tämän

#### `sqd-least-privilege-grant` · diff 3

Raporttisovellus lukee vain yhtä näkymää. Miten myönnät oikeudet?

- **GRANT SELECT vain tarvittuun näkymään/tauluun — ei SUPERUSER** ✓
- GRANT ALL PRIVILEGES — helpompi ylläpito
- Anna postgres-käyttäjän tunnukset sovellukselle
- GRANT SELECT ON ALL TABLES IN SCHEMA public aina

#### `sqd-parameterized-query` · diff 3

Käyttäjän syöte menee WHERE-ehtoon. Miten estät SQL-injektion?

- **Parametrisoitu kysely ($1, prepared statement) — ei string-concat** ✓
- Escapaa heittomerkit manuaalisesti — riittää aina
- LOWER(input) estää injektion
- Kommentit inputissa estävät hyökkäyksen

#### `sqd-readonly-role` · diff 3

BI-työkalu tarvitsee vain luku-oikeuden. Rooli?

- **CREATE ROLE bi_reader; GRANT SELECT ...; älä anna INSERT/UPDATE/DELETE** ✓
- Anna sama rooli kuin sovellukselle
- SUPERUSER helpottaa oikeuksia
- GRANT ALL ON DATABASE

#### `sqd-rls-policy` · diff 4

Sama taulu, käyttäjä näkee vain oman tiiminsä rivit. PostgreSQL-ominaisuus?

- **ROW LEVEL SECURITY + policy (esim. team_id = current_setting(...))** ✓
- WHERE team_id sovelluksessa aina riittää
- Erillinen taulu per tiimi
- Salaus sarakkeessa

#### `sqd-search-path-injection` · diff 4

Funktio kutsuu `now()` ilman schemaa. Miksi `SET search_path` on riski?

- **Hyökkääjä voi luoda omia funktioita etusijalle — kutsu väärää koodia** ✓
- search_path vaikuttaa vain indekseihin
- PostgreSQL ei salli schemaa funktioissa
- search_path on vain psql-ominaisuus

#### `sqd-view-column-mask` · diff 3

Analyytikot eivät saa nähdä henkilötunnuksia. Ensimmäinen kerros?

- **Näkymä joka palauttaa maskattu sarakkeen (esim. substring) tai poistaa sen** ✓
- Anna kaikille SELECT * tauluun
- Salaa koko tietokanta levylle
- Piilota sarake vain UI:ssa

### pg-vacuum (12)

#### `b03-pg-vacuum-freeze-settings` · diff 4

Heavy insert -taulu lähestyy wraparoundia nopeasti. Autovacuum freeze tuning?

- **autovacuum_freeze_max_age / vacuum_freeze_table_age — aikaisempi freeze** ✓
- max_connections = 1
- Poista autovacuum insert-taulusta
- Freeze tapahtuu vain VACUUM FULL

#### `b03-pg-vacuum-wraparound-warning` · diff 4

Logissa 'database must be vacuumed within 10 million transactions' — mitä uhkaa?

- **Transaction ID wraparound — pakotettu shutdown jos autovacuum ei ehdi** ✓
- Levy täyttyy logeista
- Indeksit poistuvat
- Varoitus on informatiivinen — ei toimenpiteitä

#### `b06-pg-vacuum-index-cleanup` · diff 4

Taulu on vacuumoitu säännöllisesti, mutta sen indeksit ovat kasvaneet moninkertaisiksi UPDATE-kuormassa. Mitä teet?

- **REINDEX INDEX CONCURRENTLY — VACUUM ei kutista indeksitiedostoja** ✓
- VACUUM (INDEX_CLEANUP ON) pienentää indeksitiedostot takaisin alkuperäiseen kokoonsa
- DROP TABLE ja lataa data uudelleen on ensimmäinen toimenpide
- Indeksibloatia ei ole PostgreSQLin MVCC-mallissa

#### `b06-pg-vacuum-skip-locked` · diff 4

Siivousjob poistaa miljoona vanhaa riviä yhdellä DELETE-lauseella — lukot ja bloat haittaavat tuotantoa. Miten poistat hallitusti?

- **Erissä: alikysely LIMIT 10000 FOR UPDATE SKIP LOCKED, commit joka erän jälkeen** ✓
- DELETE ... LIMIT 10000 suoraan — PostgreSQL rajaa poistettavat rivit LIMITillä
- Yksi iso DELETE yhdessä transaktiossa on aina nopein ja turvallisin
- TRUNCATE ... WHERE poistaa vain vanhat rivit ilman lukitusta

#### `b07-pg-vacuum-bloat` · diff 4

Taulu on 10 GB mutta data 2 GB — UPDATE-heavy workload. Mitä tapahtuu?

- **Dead tuple -bloat — VACUUM ei palauta levytilaa ilman VACUUM FULL:ia** ✓
- PostgreSQL shrinkaa taulun automaattisesti UPDATE-heavy workloadissa
- DELETE vapauttaa levytilan heti kun rivi poistetaan transaktiosta
- REINDEX shrinkaa taulun fyysisen koon dead tuple -ongelmaan

#### `b07-pg-vacuum-freeze` · diff 5

Mitä frozen xmin tarkoittaa PostgreSQL MVCC:ssä?

- **Rivi on frozen — vanhat XID:t eivät vaadi enää vacuum freeze -käsittelyä** ✓
- Rivi on lukittu exclusive lockilla ja ei näy muille transaktioille
- Rivi on poistettu mutta näkyy vielä vanhoille transaktioille MVCC:ssä
- Freeze poistaa rivin datan levyltä ja vapauttaa sivun uudelleenkäyttöön

#### `exp-pg-vacuum-autovacuum-tune` · diff 3

Heavy UPDATE -taulu bloataa nopeasti — autovacuum ei käynnisty tarpeeksi usein. Mitä säädät?

- **autovacuum_vacuum_scale_factor tai table-level storage params** ✓
- max_connections = 1000 nopeuttaa autovacuumia heavy UPDATE -tauluilla
- Poista autovacuum ja aja VACUUM FULL viikoittain heavy UPDATE -tauluille
- shared_buffers = 1MB pakottaa autovacuumin käynnistymään useammin

#### `exp-pg-vacuum-bloat-wraparound` · diff 5

Alert: taulu lähestyy transaction ID wraparoundia — autovacuum ei ehdi. Kiireellinen toimenpide?

- **VACUUM (FREEZE) tai autovacuum tuning — estä shutdown trigger** ✓
- DROP TABLE on nopein tapa estää transaction ID wraparound -varoitus
- Pg_upgrade heti kun wraparound-varoitus ilmestyy pg_stat_activityssa
- Wraparound ei vaikuta PostgreSQLiin koska XID kierrättää automaattisesti

#### `exp-pg-vacuum-full-lock` · diff 3

Ops ehdottaa VACUUM FULL tuotantotaululle päivällä bloatin takia. Miksi vastustat?

- **VACUUM FULL exclusive lock + rewrite — käytä pg_repack off-peak-aikana** ✓
- VACUUM FULL on online-operaatio joka ei lukitse taulua tuotannossa
- Bloat ei vaikuta PostgreSQLiin koska dead tuples vapauttavat tilan heti
- REINDEX TABLE korvaa vacuum fullin aina ilman downtimea tuotantotaulussa

#### `exp-pg-vacuum-long-xact` · diff 4

pg_stat_activity näyttää 12 h avoimen read transactionin — dead tuples kasaantuvat. Mitä teet?

- **Tunnista ja päätä pitkä transaktio — vacuum ei voi siivota tarvittavaa** ✓
- VACUUM FULL heti ilman syytä kun idle in transaction kestää tunteja
- Autovacuum pois päältä estää dead tuplejen kasaantumisen pitkien xactien aikana
- Long xact ei vaikuta vacuumiin koska autovacuum käyttää erillistä xmin-arvoa

#### `pg-partition-retention` · diff 4

Lokitaulusta poistetaan joka yö yli 90 päivää vanhat rivit DELETEllä. Taulu paisuu, eikä autovacuum ehdi. Kestävämpi rakenne?

- **Osioi taulu kuukausittain ja poista vanhat osiot kokonaisina (DETACH + DROP)** ✓
- Aja VACUUM FULL joka yö DELETEn jälkeen, niin levytila palautuu
- Lisää indeksi created_at-sarakkeelle, jolloin DELETE ei tuota dead tupleja
- Vaihda DELETE TRUNCATEen ja rajaa poistettavat rivit WHERE-ehdolla

#### `pg-vacuum-bloat` · diff 4

Päivitykset ovat runsaita, taulu kasvaa mutta rivimäärä pysyy. Epäily?

- **Dead tuple -bloat — tarkista autovacuum ja last_vacuum** ✓
- Indeksi on liian pieni ja pitää kasvattaa shared_buffers-arvoa
- SELECT-kyselyt tarvitsevat REINDEX ennen jokaista UPDATE-operaatiota
- PostgreSQL ei tue UPDATE:ia MVCC-mallissa, vain INSERT ja DELETE

## qt (143)

### qt-models (15)

#### `b02-qt-models-reset-10` · diff 4

Koko malli vaihtuu — käytät beginResetModel/endResetModel. Milloin riittää dataChanged?

- **dataChanged kun rivit päivittyvät; reset vain rakenteen muutoksessa** ✓
- beginResetModel/endResetModel aina kun yksikin solu muuttuu
- dataChanged ei koskaan riitä — reset aina kun data vaihtuu
- Poista view ja luo uudelleen välttääksesi mallin päivitysongelmat

#### `b02-qt-models-sort-09` · diff 3

QTableView sorttaus hidastuu 100k rivillä — sorttaus viewissä. Parempi?

- **QSortFilterProxyModel tai sorttaus SQL/source-tasolla 100k rivillä** ✓
- QTableWidget on aina nopein tapa sortata suuria tietomääriä
- Poista sort-toiminto kokonaan — se hidastaa view-taso-sorttausta
- Nested loop QTableView:ssä sorttaa 100k riviä tehokkaammin

#### `b03-qt-models-data-changed` · diff 3

Muutat yhden solun dataa suoraan vektorissa — view ei päivity. Mitä emitoit?

- **dataChanged(topLeft, bottomRight, roles) — model API** ✓
- layoutChanged aina yhdestä solusta
- View päivittyy automaattisesti
- repaint() riittää modelille

#### `b03-qt-models-sort-filter` · diff 3

QTableView näyttää kaikki 100k riviä — UI jumittaa. Nopea suodatus ilman uutta modelia?

- **QSortFilterProxyModel viewin ja source modelin väliin** ✓
- Kopioi data uuteen QList joka klikkauksella
- Poista model — käytä QLabel listaa
- ProxyModel hidastaa aina

#### `b04-qt-models-sort-filter` · diff 3

QTableView tarvitsee live-haun suodatuksen ilman erillistä kopiomallia. Qt-luokka?

- **QSortFilterProxyModel sourceModelin päällä** ✓
- Kopioi kaikki rivit QStandardItemModel:iin suodatuksessa
- Piilota rivit setRowHidden manuaalisesti aina
- SQL WHERE riittää — ei proxya

#### `b05-qt-models-data-roles` · diff 3

Custom delegate tarvitsee tooltip-datan eri kuin display. Mistä se tulee?

- **Qt::ToolTipRole (tai custom role) data()-metodista** ✓
- Vain Qt::DisplayRole on sallittu
- Delegate generoi tooltipin satunnaisesti
- Model ei voi palauttaa useaa roolia

#### `b06-qt-models-editable-delegate` · diff 3

Taulukon solu tarvitsee custom editor widgetin editissä. Mitä käytät?

- **QStyledItemDelegate — createEditor ja setModelData custom editorille** ✓
- QTableWidget setCellWidget kaikille soluille — se on delegate-korvaaja
- Model setData ilman delegatea aina — view luo editorin automaattisesti
- QLineEdit overlay viewin päälle — standardi tapa custom solueditorille

#### `b06-qt-models-mime-drag` · diff 4

Tree view drag-drop eri sovellukseen — data ei siirry. Mitä model-metodia toteutat?

- **mimeData + supportedDropActions — QAbstractItemModel drag API toteutus** ✓
- setDragEnabled(true) riittää — model ei tarvitse mimeData-metodia
- QSS drag property siirtää datan sovellusten välillä tree viewissä
- mouseMoveEvent viewissä aina — se korvaa model-tason drag-drop API:n

#### `b07-qt-model-reset` · diff 4

Lista päivittyy hitaasti kun data muuttuu — koko model resetataan. Parempi tapa?

- **beginInsertRows tai dataChanged — granular päivitys ilman täyttä resetiä** ✓
- resetModel aina — se on nopein tapa päivittää koko lista kerralla
- Poista view ja luo uudelleen — se korvaa model-signaalit kokonaan
- QTimer::singleShot(0) — se korvaa beginInsertRows-päivityksen listassa

#### `b07-qt-model-view-sort` · diff 3

QTableView näyttää dataa mutta sortaus ei toimi. Mitä puuttuu?

- **setSortingEnabled(true) + model data(Qt::DisplayRole) sortattavissa** ✓
- QPainter sorttaa taulukon rivit automaattisesti piirron yhteydessä
- QSortFilterProxyModel riittää ilman sortattavaa dataa source modelissa
- QTableView ei tue sortausta — vain QTableWidget sorttaa

#### `b08-qt-models-sort-filter` · diff 3

QTableView suodatus — haluat näyttää vain aktiiviset rivit ilman datan poistoa. Proxy?

- **QSortFilterProxyModel — filterAcceptsRow + setSourceModel suodatukseen** ✓
- Poista rivit source modelista — se säilyttää datan ja suodattaa viewissä
- QTableWidget hideRow riittää aina suuressa datassa ilman proxya
- Proxy model ei tue suodatusta — vain sorttaus on mahdollista

#### `b09-qt-models-reset-vs-layout` · diff 4

Lataat koko listan uudelleen — beginResetModel on raskas ja välkkyy. Parempi vaihtoehto?

- **beginInsertRows/endInsertRows tai layoutChanged jos rakenne pysyy samana** ✓
- Luo uusi model aina — se on nopein tapa päivittää koko lista
- resetModel on ainoa tapa päivittää — incremental update ei toimi
- View päivittyy automaattisesti ilman model-signaaleja datan muuttuessa

#### `exp-qt-models-persistent-index` · diff 4

Delegate tallentaa QModelIndexin myöhempää käyttöä varten — data väärää insertRow:n jälkeen. Mikä sääntö?

- **QModelIndex ei ole pysyvä insertRow:n jälkeen — QPersistentModelIndex** ✓
- QModelIndex säilyy validina kunnes model tuhotaan kokonaan
- insertRow() ei muuta olemassa olevien QModelIndexien viittauksia
- Vain QListWidget vaatii indeksien uudelleenhaun insertRow:n jälkeen

#### `exp-qt-models-reset-vs-layout` · diff 4

Taulukko välkkyy kun päivität 10 000 riviä — koko model resetataan. Tehokkaampi tapa?

- **dataChanged tai rowsInserted — reset vain kun mallin rakenne muuttuu** ✓
- Luo uusi QTableWidget joka päivityksellä välttää välkkymisen
- Poista model kokonaan ja luo se uudelleen jokaisella päivityksellä
- processEvents() jokaisella rivillä pitää UI:n reagoivana päivityksessä

#### `qt-models-persistent-index` · diff 4

Taulukkomalli päivittyy (lajittelu/suodatus). Miten tallennat rivin tunnisteen turvallisesti?

- **QPersistentModelIndex tai oma id rivin datassa** ✓
- QModelIndex tallennetaan suoraan sessioon ikuisesti
- Rivinumero riittää aina
- Model ei saa muuttua käytön aikana

### qt-native-architecture (1)

#### `qt-native-signals-slots` · diff 2

Qt-luokan pitää ilmoittaa UI:lle, että data muuttui. Mikä on idiomi?

- **Signal emittoidaan ja UI:n slot päivittyy** ✓
- UI pollaa dataa while(true)-silmukassa
- Kutsu repaintia jokaisesta setteristä ilman dataChanged-signaalia
- Kirjoita muutos globaaliin tekstitiedostoon

### qt-native-data (1)

#### `qt-native-json` · diff 2

Qt-sovellus lukee JSON-konfiguraation tiedostosta. Mitä käytät?

- **QFile + QJsonDocument** ✓
- QPixmap koska JSON on tekstiä
- QSqlQuery ilman tietokantaa
- QObject::connect suoraan tiedostoon

### qt-native-deploy (1)

#### `qt-native-deploy` · diff 3

Qt-sovellus pitää toimittaa Windows-käyttäjälle ilman Qt-asennusta. Mikä työkalu auttaa?

- **windeployqt kopioi tarvittavat Qt DLL:t ja plugin-hakemistot** ✓
- Pyydä käyttäjää asentamaan Qt Creator
- Kopioi vain .exe ilman plugin-hakemistoja
- Nimeä lähdekoodi .dll-päätteiseksi

### qt-native-input (1)

#### `qt-native-event-filter` · diff 3

Haluat siepata Enter-näppäimen tietyssä tekstikentässä ilman subclassia. Mikä mekanismi sopii?

- **QObject event filter tekstikentälle** ✓
- Globaali käyttöjärjestelmän keyboard hook aina
- Muokkaa Qt:n lähdekoodia
- Käytä QTimeria arvaamaan näppäimet

### qt-native-models (1)

#### `qt-native-model-view` · diff 3

Suuri lista pitää näyttää QTableViewissä ja suodattaa. Mikä rakenne sopii?

- **QAbstractTableModel + QSortFilterProxyModel** ✓
- QTableWidget ja tuhansien solujen manuaalikopio aina
- Yksi QLabel johon yhdistetään kaikki teksti
- Mallin data suoraan paintEventissä

### qt-native-qml (1)

#### `qt-native-qml-binding` · diff 3

QML-näkymässä teksti riippuu model.count-arvosta. Mikä tekee päivityksestä automaattisen?

- **Property binding kuten text: model.count.toString()** ✓
- Aseta teksti kerran Component.onCompletedissä
- Kutsu repaint C++:sta joka sekunti
- Tallenna arvo singletoniin ilman notify-signaalia

### qt-native-storage (1)

#### `qt-native-qsettings` · diff 2

Desktop-sovellus tallentaa ikkunan koon ja käyttäjän asetuksia. Mikä Qt-luokka sopii?

- **QSettings** ✓
- QTemporaryFile pysyville asetuksille
- QPainter asetusten serialisointiin
- QShortcut tallennukseen

### qt-native-threading (1)

#### `qt-native-threading-ui` · diff 3

Worker-säie saa laskennan valmiiksi ja haluaa päivittää QLabelin. Mitä tehdään?

- **Lähetä signaali queued connectionilla GUI-säikeeseen** ✓
- Kutsu label->setText suoraan workerista
- Siirrä QLabel worker-säikeeseen
- Poista event loop päivityksen ajaksi

### qt-native-ui (2)

#### `qt-native-high-dpi` · diff 3

Sovellus näyttää suttuiselta high-DPI-näytöllä. Mitä pitää huomioida?

- **Käytä Qt:n high-DPI-tukea ja skaalausta kestäviä assetteja** ✓
- Pakota kaikki ikonit 16x16-kokoon
- Piirrä fyysisillä pikseleillä ilman devicePixelRatio-tietoa
- Poista fonttien skaalaus

#### `qt-native-widgets-vs-quick` · diff 3

Uusi Qt desktop -sovellus tarvitsee lomakkeita, taulukoita ja perinteisiä dialogeja. Widgets vai Qt Quick?

- **Qt Widgets on usein nopea perinteiseen desktop-UI:hin; Qt Quick sopii dynaamisempiin/animoituihin näkymiin** ✓
- Qt Widgets on poistettu Qt 6:ssa
- Qt Quick toimii vain mobiilissa
- Molemmat vaativat aina OpenGL-shadereita

### qt-opengl (18)

#### `b02-qt-opengl-context-11` · diff 4

OpenGL renderöinti toisesta threadista — mitä tarvitaan ennen glCall?

- **QOpenGLContext::makeCurrent() oikeassa säikeessä ennen glCall-komentoja** ✓
- OpenGL on thread-safe Qt:ssä ilman makeCurrent-kutsuja
- QWidget::update() aktivoi GL-kontekstin ennen piirtokomentoja
- glFlush() riittää korvaamaan makeCurrent()-kutsun render loopissa

#### `b02-qt-opengl-vao-12` · diff 3

Moderni Qt OpenGL piirtää suorakulmion — mitä objekteja bindataan?

- **QOpenGLVertexArrayObject + QOpenGLBuffer (VBO) + shader program** ✓
- Immediate mode glBegin/glEnd piirtää suorakulmion modernissa Qt:ssa
- QPainter yksin riittää 3D-suorakulmion piirtämiseen OpenGL-widgetissä
- QPixmap-tekstuuri korvaa VAO:n ja VBO:n suorakulmion piirrossa

#### `b03-qt-opengl-core-profile` · diff 4

Legacy fixed-function GL-kutsu kaataa macOS:llä — toimii Linuxilla. Konteksti?

- **Pyydä Core Profile ja poista deprecated fixed pipeline** ✓
- Compatibility profile poistaa kaiken vanhan
- OpenGL 1.1 on default kaikilla
- Qt ei tue Core Profilea

#### `b03-qt-opengl-widget-update` · diff 3

QOpenGLWidget renderöi vain kerran avauksessa — animaatio jäätyy. Mitä kutsut?

- **update() / continuous QTimer → update() tarvittaessa** ✓
- glFinish() riittää joka frame
- swapBuffers manuaalisesti QWidgetissa
- OpenGL renderöi automaattisesti 60 fps

#### `b04-qt-opengl-depth-buffer` · diff 4

3D-scene: lähemmät objektit piirtyvät etäisempien päälle väärin. OpenGL-asetus?

- **Ota depth test käyttöön: glEnable(GL_DEPTH_TEST) + depth buffer format** ✓
- Piirrä kaukaisemmat viimeisenä aina
- Poista blending
- Vain ortho projection korjaa

#### `b04-qt-opengl-share-context` · diff 5

Kaksi QOpenGLWidget:iä — tekstuurit ladataan kahdesti. Miten jaat GL-resurssit?

- **QOpenGLWidget::setShareContext() / shared OpenGL context widgetien välillä** ✓
- Kopioi tekstuurit memcpy:llä
- Yksi widget riittää aina
- Share context kielletty Qt 6:ssa

#### `b05-qt-opengl-makecurrent` · diff 3

OpenGL-kutsu kaatuu 'without current context'. Mitä teet ennen glDrawArrays?

- **makeCurrent() kontekstille — OpenGL on thread-local** ✓
- QOpenGLFunctions riittää ilman makeCurrent
- glDrawArrays toimii mistä tahansa säieestä
- swapBuffers ennen piirtämistä

#### `b06-qt-opengl-double-buffer` · diff 4

OpenGL rendering flicker — piirto näkyy kesken renderöinnin. Mitä format-optiota?

- **QSurfaceFormat double buffering — swap buffers estää flickerin renderöinnissä** ✓
- QWidget::paintEvent ilman OpenGL — se korvaa double bufferingin
- setUpdatesEnabled(false) aina — se estää flickerin OpenGL-widgetissä
- Single buffer on nopeampi tuotannossa — double buffering hidastaa

#### `b06-qt-opengl-pixel-format` · diff 4

Depth buffer ei toimi — 3D-objektit piirtyvät väärin. Mitä surface formatissa?

- **setDepthBufferSize(24) — depth buffer koko surface formatissa** ✓
- setVersion(3,3) korvaa depth bufferin — versio riittää Z-testiin
- QOpenGLWidget ei tarvitse depth bufferia — Qt luo sen automaattisesti
- swapBuffers poistaa depth bufferin — se aiheuttaa Z-testin epäonnistumisen

#### `b07-qt-opengl-context` · diff 4

QOpenGLWidget renderöi mustaa — context ei ole current. Mitä kutsutaan ennen piirtoa?

- **makeCurrent() — aktivoi GL context ennen OpenGL-kutsuja piirrossa** ✓
- swapBuffers ennen piirtoa — se aktivoi kontekstin automaattisesti
- QWidget::update riittää — makeCurrent ei ole tarpeen QOpenGLWidgetissä
- OpenGL ei tarvitse current contextia — kutsut toimivat ilman sitä

#### `b07-qt-opengl-vsync` · diff 3

Peli renderöi 300 FPS ja kuluttaa CPU:ta turhaan. Miten rajoitat frame ratea?

- **QSurfaceFormat swap interval (vsync) tai QTimer frame pacing** ✓
- while(true) render — se rajoittaa frame raten tehokkaasti
- Poista double buffering — se vähentää CPU-kuormaa 300 FPS:llä
- setFixedSize renderille — se synkronoi framen näytön refresh rateen

#### `b08-qt-opengl-vsync` · diff 3

OpenGL-demo repii — CPU 100% spin loopissa. Miten synkkaat frame rateen?

- **QSurfaceFormat swapInterval 1 (VSync) tai QTimer ~16ms — älä busy loop** ✓
- while(true) update() on oikea game loop Qt OpenGL-demossa
- VSync ei ole Qt:ssä saatavilla — vain platform API toimii
- QPainter korvaa swap chainin — VSync ei vaikuta OpenGL-widgettiin

#### `b09-qt-opengl-vsync-tear` · diff 3

Renderöinti repii ruudulla liikkuessa — tearing. Swap interval?

- **QSurfaceFormat::setSwapInterval(1) — VSync päälle tearingin estämiseksi** ✓
- swapBuffers(false) nopeuttaa — se estää tearingin liikkuessa
- VSync ei vaikuta OpenGL:ään — tearing johtuu muusta syystä
- QPainter::Antialiasing korjaa tearingin renderöinnissä

#### `exp-qt-opengl-context-thread` · diff 5

OpenGL render crashaa satunnaisesti — QOpenGLWidget luodaan worker-threadissä. Mikä Qt-sääntö rikkoutuu?

- **QOpenGLWidget luodaan ja käytetään vain GUI-säikeessä Qt:n mukaan** ✓
- OpenGL-konteksti toimii vapaasti miltä tahansa worker-säikeeltä
- makeCurrent() riittää thread-tarkistukseen jo widgetin luonnissa
- Qt 6 poisti OpenGL-tuen kokonaan — käytä vain QRhi-pipelinea

#### `exp-qt-opengl-makecurrent` · diff 4

Render loopissa glError invalid operation — context ei aktiivinen. Mitä kutsut ennen GL-komentoja?

- **context->makeCurrent(surface) ennen GL:ää, doneCurrent() lopuksi** ✓
- swapBuffers() aktivoi kontekstin automaattisesti ennen piirtokomentoja
- Qt OpenGL ei vaadi current-kontekstia makeCurrent-kutsuja varten
- QTimer-singleShot aktivoi GL-kontekstin render loopin alussa

#### `exp-qt-opengl-vao-vbo` · diff 4

Piirrät meshiä joka frame ilman buffer-objekteja — CPU bottleneck. Ensimmäinen OpenGL-optimointi?

- **QOpenGLBuffer (VBO) + VAO: lataa kerran, piirrä usein per frame** ✓
- glBegin/glEnd immediate mode joka framella on moderni Qt-tapa
- Poista depth test vähentääksesi GPU-kuormaa piirtosilmukassa
- Software-rasterointi QPixmapilla korvaa buffer-objektit meshille

#### `qt-opengl-makecurrent` · diff 4

QOpenGLWidget piirtää mustaa. OpenGL-kutsut tehdään väärästä säikeestä. Ensimmäinen korjaus?

- **Kutsu makeCurrent() widgetin kontekstissa ennen GL-komentoja** ✓
- Vaihda QOpenGLWidget tavalliseen QWidget:iin piirtämisen sijaan
- glFlush() riittää päivittämään piirin ilman aktiivista kontekstia
- QApplication::setAttribute() aktivoi OpenGL-kontekstin automaattisesti

#### `qt-opengl-vbo` · diff 5

Piirrät paljon kolmioita QOpenGLWidgetissä. Miten vältät turhat CPU→GPU-kopiointi joka framella?

- **QOpenGLBuffer (VBO) ja vertex attrib -asetukset vähentävät kopiointia** ✓
- glBegin/glEnd-kutsut jokaisella framella pitävät piirron yksinkertaisena
- QPainter::drawPolygon QOpenGLWidgetissä hoitaa geometrian GPU:lle
- QPixmap-cache kolmioille vähentää draw call -määrää 3D-näkymässä

### qt-quick (20)

#### `b13-qt-quick-anchors-layout` · diff 2

Nappi pitää keskittää ikkunaan ja venyttää leveys 80 % parentista. QML-layout?

- **anchors.centerIn: parent; width: parent.width * 0.8** ✓
- x: parent.width/2; y: parent.height/2 — riittää ilman width-bindingia
- Layout.fillWidth: true RowLayoutissa ilman parent-layoutia
- position: absolute — QML CSS-tyyli keskitykseen

#### `b13-qt-quick-application-engine` · diff 2

Uusi Qt 6 -sovellus lataa QML-tiedoston `main.qml`. Mikä C++-luokka on suositeltu entry point?

- **QQmlApplicationEngine — lataa QML ja hallitsee kontekstia ilman erillistä ikkunaa** ✓
- QQuickView — ainoa tuettu tapa Qt 6:ssa
- QWidget::loadQml() — widget-sovellus lataa QML:n suoraan
- QApplication::exec() riittää — QML ajetaan automaattisesti

#### `b13-qt-quick-connections-signal` · diff 2

QML:ssä haluat kuunnella C++-backendin signaalia ilman suoraa `onFoo`-handleria eri tiedostossa. Ratkaisu?

- **Connections { target: backend; function onDataReady() { ... } }** ✓
- Signal { name: "dataReady" } — se yhdistää automaattisesti
- QML ei voi kuunnella C++-signaaleja — tarvitaan callback property
- Timer pollaa backend.dataReady joka frame

#### `b13-qt-quick-context-property` · diff 3

Yksi globaali `AppSettings`-olio pitää olla kaikkien QML-tiedostojen saatavilla ilman importtia. Tapaa?

- **engine.rootContext()->setContextProperty("appSettings", &settings)** ✓
- property var appSettings: AppSettings {} jokaisessa QML-tiedostossa
- qmlRegisterSingletonInstance riippuu aina .qml-tiedostosta
- QML Global { } -avainsana Qt 6:ssa

#### `b13-qt-quick-controls-style` · diff 3

Qt Quick Controls -napit näyttävät erilaisilta Windowsilla ja macOS:llä. Miten saat natiivin ulkoasun?

- **QQuickStyle::setStyle("Fusion") tai platform-tyyli — valitse Style ennen QML-latausta** ✓
- Controls.Style = Native QML:ssä — riittää ilman C++:ta
- Qt 6 poisti tyylit — kaikki alustat näyttävät identtisiltä
- import QtQuick.Controls.Basic — se käyttää aina natiivityyliä

#### `b13-qt-quick-debug-console` · diff 2

QML binding ei toimi odotetusti — haluat nopean lokituksen ilman C++-debuggeria. Ensimmäinen askel?

- **console.log() / console.warn() — QML JavaScript console** ✓
- qDebug() QML-tiedostossa suoraan ilman importtia
- Qt Quick Designer breakpoints — ainoa tapa QML:ään
- Logger { } — built-in QML-komponentti

#### `b13-qt-quick-i18n-retranslate` · diff 4

Käyttäjä vaihtaa kielen lennossa — qsTr()-tekstit eivät päivity QML:ssä. Mitä kutsutaan?

- **engine.retranslate() — päivittää qsTr-bindingit QML-puussa** ✓
- QCoreApplication::installTranslator() riittää — QML päivittyy automaattisesti
- text: qsTr("key") pitää poistaa ja käyttää hardcoded stringejä
- QQmlApplicationEngine::clearComponentCache() — ainoa tapa

#### `b13-qt-quick-image-async` · diff 2

Image lataa suuren kuvan verkosta ja jäädyttää UI:n latauksen aikana. QML-korjaus?

- **asynchronous: true (oletus) + placeholder/pienoiskuva — lataus taustasäikeessä** ✓
- cache: false — pakottaa async-latauksen
- QML Image ei tue verkko-URL:ia — lataa C++:lla
- sourceSize: 0 — lataa aina täyden resoluution synkronisesti

#### `b13-qt-quick-listview-delegate` · diff 2

ListView näyttää 10 000 riviä hitaasti — kaikki delegate-instanssit luodaan kerralla. Miten korjaat?

- **ListView kierrättää delegateja — varmista että model on QAbstractListModel/C++ tai ListModel, ei toistettu Repeater** ✓
- Lisää `cacheBuffer: 0` — se poistaa kaikki delegate-instanssit
- Korvaa ListView Column-layoutilla — se on nopeampi
- delegate: Item {} tyhjä delegate nopeuttaa piirtoa

#### `b13-qt-quick-loader-component` · diff 3

Haluat ladata raskaan QML-näkymän vasta kun käyttäjä avaa sen. Qt Quick -komponentti?

- **Loader + sourceComponent / source — lataa komponentin tarpeen mukaan** ✓
- StackView.preload — se lataa kaiken taustalla automaattisesti
- import "HeavyView.qml" as H — import lataa aina heti
- Timer + visible: false riittää — QML ei luo puuta ennen show():ia

#### `b13-qt-quick-property-animation` · diff 3

Rectangle liikkuu x: 0 → 300 kun `running` muuttuu true. Yksinkertaisin animaatio?

- **PropertyAnimation on x { from: 0; to: 300; running: root.running }** ✓
- Timer { interval: 16; onTriggered: x++ } — sujuvin tapa
- Behavior on x { ScriptAction { script: x=300 } }
- Animation { target: rect; property: "geometry" } — ei tuettu

#### `b13-qt-quick-property-binding` · diff 3

QML:ssä `width: parent.width` ja `onWidthChanged: width = parent.width` aiheuttavat jatkuvaa päivitystä. Mikä on oikea tapa?

- **Käytä vain property bindingia — poista onWidthChanged-syklittävä sijoitus** ✓
- Lisää `Qt.callLater()` jokaiseen onWidthChanged-kutsuun
- Korvaa binding Timer-komponentilla 16 ms välein
- Binding-loop on normaalia — Qt rajoittaa päivitykset automaattisesti

#### `b13-qt-quick-qt-binding` · diff 4

Käyttäjä muokkaa TextFieldiä — haluat palauttaa automaattisen bindingin `text: model.name` kun focus poistuu. Qt 6?

- **onEditingFinished: text = Qt.binding(() => model.name)** ✓
- text = model.name riittää — binding palautuu automaattisesti
- Binding { property: "text"; value: model.name } poistuu itsestään
- restoreBinding() — QML built-in funktio

#### `b13-qt-quick-register-type` · diff 4

C++-luokka `SensorModel` pitää käyttää QML:ssä `SensorModel { }` -instanssina. Rekisteröinti?

- **qmlRegisterType<SensorModel>("com.app", 1, 0, "SensorModel") ennen engine.load()** ✓
- Q_OBJECT makro riittää — moc rekisteröi tyypin automaattisesti QML:ään
- engine.rootContext()->setContextProperty("SensorModel", new SensorModel)
- import com.app 1.0 — riittää ilman C++-rekisteröintiä

#### `b13-qt-quick-repeater-model` · diff 2

Haluat piirtää kiinteän 5 tagia vaakasuoraan ilman C++-mallia. Qt Quick -ratkaisu?

- **Row + Repeater { model: 5; delegate: Tag {} } tai model: ["a","b",...]** ✓
- ListView model: 5 — se on kevyempi kuin Repeater pieneen määrään
- Repeater vaatii aina QAbstractItemModel C++:sta
- Flow + GridLayout — ainoa tapa toistaa QML-elementtejä

#### `b13-qt-quick-required-property` · diff 3

Custom `DetailPage`-komponentti vaatii `title`-tekstin — virhe jos parent ei anna sitä. Qt 6 QML?

- **required property string title — compile-time/varoitus puuttuvalle arvolle** ✓
- property string title: "" — tyhjä oletus riittää API-sopimukseen
- readonly property string title — parent ei voi asettaa
- Qt.binding(() => title) pakottaa parentin antamaan arvon

#### `b13-qt-quick-singleton` · diff 4

QML-moduulissa tarvitaan jaettu `Theme`-olio (värit, fontit) ilman useita instansseja. Qt 6 -tapaa?

- **pragma Singleton + QML_SINGLETON C++:ssä tai singleton .qml tiedostossa** ✓
- import Theme as T — jokainen import luo uuden kopion
- Singleton toimii vain Qt Quick Controlsissa
- GlobalObject { id: theme } main.qml:ssä riittää kaikille tiedostoille

#### `b13-qt-quick-stackview` · diff 3

Mobiilisovelluksessa näkymät pinoutuvat (lista → detail → asetukset) takaisin-navigoinnilla. Qt Quick Controls?

- **StackView — push/pop/popToRoot navigoi komponenttipinoa** ✓
- SwipeView — se pinouttaa näkymiä syvyysnavigaatiolla
- TabBar riittää — ei tarvita pinomallia
- Loader.source vaihto ilman historiaa — suositeltu tuotantoon

#### `b13-qt-quick-state-transition` · diff 3

Painike vaihtaa väriä hover-tilassa animoidusti. Qt Quick -rakenne?

- **states + transitions — State määrittää propertyt, Transition animoi muutoksen** ✓
- onHoverChanged: color = "red" — animaatio tulee automaattisesti
- Style.qml hover — Qt Quick Controls hoitaa animaatiot aina
- PropertyAnimation vaatii C++-backendin — QML ei animoi propertyjä

#### `b13-qt-quick-worker-script` · diff 4

QML:ssä pitää ajaa raskasta JSON-parsintaa ilman UI-jumitusta. Qt Quick -vaihtoehto ennen C++-Workeria?

- **WorkerScript — erillinen QML-säie, viestit sendMessage/onMessage** ✓
- Qt.createQmlObject() taustasäikeessä — tuettu suoraan
- Timer { repeat: true } jakaa työn frameihin — riittää megatavuille dataa
- QML JavaScript on aina async — ei tarvita WorkerScriptiä

### qt-shaders (23)

#### `b02-qt-shaders-qsb-13` · diff 4

Qt 6 RHI backend — shaderit pitää esikääntää. Työkalu?

- **qsb (Qt Shader Tools) tuottaa esikäännetyn .qsb-tiedoston RHI:lle** ✓
- glCompileShader() runtime-ajassa on Qt 6 RHI:n suositeltu tapa
- QSS-tyylitiedosto korvaa shader-ohjelman Qt 6 backendissä
- QPainter-shader API korvaa qsb-esikäännön Qt 6 RHI-backendissä

#### `b02-qt-shaders-uniform-14` · diff 3

Shader uniform `mvpMatrix` — location vaihtuu eri GPU:lla. Turvallinen tapa?

- **QShaderProgram::uniformLocation("mvpMatrix") tai uniform buffer (UBO)** ✓
- Hardcode location 0 toimii kaikilla GPU:illa mvpMatrix-uniformille
- Preprocessor-makro HEADER_DEFINES_LOCATION hoitaa uniform-sijainnin
- Poista uniform kokonaan — matriisi kulkee attribuuttien kautta

#### `b03-qt-shaders-attribute-location` · diff 4

Vertex attribuutit sekoittuvat eri GPU:illa — layout ei täsmää. Vakautus?

- **layout(location=N) GLSL:ssä tai bindAttributeLocation ennen link** ✓
- Attribuuttien järjestys on aina sama
- glBindAttribLocation runtime joka framella
- Qt ei tue layout location

#### `b03-qt-shaders-qopenglshader` · diff 3

Shader compile failaa ilman selkeää logia. Qt-luokka virheilmoituksiin?

- **QOpenGLShaderProgram::log() compile/link jälkeen** ✓
- qDebug() riittää aina
- GLSL ei anna virheilmoituksia
- Shaderit käännetään build-ajassa

#### `b03-qt-shaders-rhi-fallback` · diff 4

Qt 6 app renderöi Metalilla macOS:llä mutta testaaja raportoi mustan ruudun Windowsilla. Tarkista?

- **QRhi backend (D3D11/Vulkan/OpenGL) — shader cross-backend yhteensopivuus** ✓
- OpenGL 1.0 riittää Qt 6:ssa
- RHI on vain mobiilissa
- Shaders eivät riipu alustasta

#### `b04-qt-shaders-attribute-location` · diff 3

Shader linkittyy mutta vertex-attribuutit ovat nollaa — layout(location=0) puuttuu GLSL:stä. Korjaus?

- **layout(location = N) in vec3 position; tai bindAttribLocation ennen linkitystä** ✓
- Käytä fixed pipeline
- uniform sijainti attribuutille
- Vain fragment shader riittää

#### `b05-qt-shaders-glsl-version` · diff 2

Shader hylätään: 'version 330 incompatible'. Korjaus Qt 6 desktop OpenGL:lla?

- **#version 330 core tai uudempi — core profile vaatii version deklaraation** ✓
- Poista version rivi kokonaan
- GLSL 100 riittää desktopille
- Qt generoi shaderin automaattisesti

#### `b05-qt-shaders-rhi-backend` · diff 4

Qt 6 sovellus pitää ajaa Vulkanilla Windowsissa ja Metalilla macOS:lla. Mikä renderöintipolku?

- **Qt Rendering Hardware Interface (RHI) — abstrakti backend** ✓
- Suora OpenGL 2.1 kaikilla alustoilla
- QWidget::render riittää 3D:lle
- Qt Quick ei tue Vulkan/Metal

#### `b05-qt-shaders-uniform-location` · diff 3

Shader compile onnistuu mutta uniform ei vaikuta — location on -1. Juurisyy?

- **Kääntäjä optimoi käyttämättömän uniformin pois — varmista että uniformia luetaan shaderissa** ✓
- Location -1 tarkoittaa aina virhettä
- GLSL versio ei tue uniformeja
- QOpenGLShaderProgram ei tue uniformeja

#### `b06-qt-shaders-precompile` · diff 4

Shader compile hidastaa app käynnistystä. Miten Qt 6 RHI auttaa?

- **qsb precompiled shader — offline compile .qsb-tiedostoon Qt 6 RHI:lla** ✓
- GLSL compile runtime aina pakko — qsb ei tue offline-käännöstä
- QSS korvaa shaderit — ei tarvita erillistä shader-käännöstä
- Shader cache poistetaan rebootissa — precompile ei auta käynnistysaikaa

#### `b06-qt-shaders-varying-interpolation` · diff 5

Fragment shader saa väärät interpolated arvot vertex-attribuuteista. Mikä GLSL-stage välittää?

- **Vertex shader output → fragment input — varying interpoloidaan GPU:lla** ✓
- Uniform välittyy interpoloituna vertexistä fragment shaderiin
- Fragment shader lukee VBO:n suoraan ilman vertex shaderia
- Interpolation tapahtuu vain CPU:lla — GPU ei interpoloi attribuutteja

#### `b07-qt-shader-precision` · diff 5

Shader toimii desktopilla mutta on musta mobiilissa OpenGL ES:llä. Todennäköisin syy?

- **Puuttuva precision mediump/highp ES:ssä tai float texture ES2-rajoitus** ✓
- Qt ei tue mobiilia — shader toimii vain desktop OpenGL:lla
- Vain QML toimii mobiilissa — widget-shaderit eivät toimi
- Desktop ja ES shaderit ovat identtiset — precision ei vaikuta

#### `b07-qt-shader-qsb` · diff 3

Qt 6 shader ei lataudu — .frag tiedosto suoraan ei toimi. Miten shader valmistellaan?

- **qsb offline compilation — .qsb binary Qt Shader Toolsilla Qt 6:ssa** ✓
- Lue .glsl runtime compile aina — qsb ei ole tuettu Qt 6 RHI:ssa
- QPainter korvaa shaderin — ei tarvita erillistä shader-latausta
- Qt 5 QGLShader only — Qt 6 ei tue shader-käännöstä

#### `b07-qt-shader-uniform` · diff 4

Shader ei reagoi uniform-muutoksiin — väri pysyy valkoisena. Tyypillinen virhe?

- **Uniform location -1 tai setUniformValue väärässä vaiheessa — tarkista bind** ✓
- GLSL ei tue uniformeja — vain attributes toimivat shaderissa
- QShaderProgram ei tarvitse bindiä — uniformit päivittyvät automaattisesti
- Vain vertex shader voi käyttää uniformeja fragment shaderissa

#### `b08-qt-shaders-uniform` · diff 4

Shader ei näy oikein — uniform arvo ei päivity. Qt6 RHI/shader polulla?

- **Tarkista uniform location/bindings — QShader ja material property sync** ✓
- Uniformit päivittyvät automaattisesti ilman koodia Qt 6 RHI:ssa
- Shader compilation ei vaikuta uniformeihin — vain link status merkitsee
- Vain fixed pipeline toimii Qt 6:ssa — custom uniformit eivät toimi

#### `b09-qt-shaders-compile-log` · diff 3

QOpenGLShaderProgram linkkaus epäonnistuu — musta ruutu. Debug-askel?

- **log() ja shaderInfoLog() — tulosta compile/link virheet debugatessa** ✓
- Käännä shader uudelleen ilman logia — virheet näkyvät mustassa ruudussa
- Shader-virheet näkyvät vain Windowsilla — macOS piilottaa ne
- QPainter korvaa shaderin — compile log ei ole tarpeen

#### `b09-qt-shaders-qml-graph-effect` · diff 3

QML-käyttöliittymässä tarvitset blur-efektin itemille. Qt Quick -komponentti?

- **MultiEffect / ShaderEffect + fragment shader QML:ssä blur-efektille** ✓
- QPainter blur QML Itemissä suoraan — se on Qt Quick -standardi
- CSS filter QML:ssä — se korvaa ShaderEffectin
- OpenGL ei toimi QML:n kanssa — vain QWidget tukee shadereita

#### `b09-qt-shaders-uniform-location` · diff 4

uniform float u_time ei päivity — setUniformValue ei vaikuta. Yleisin syy?

- **Uniform optimoitu pois tai väärä location — tarkista link status ja käyttö** ✓
- Uniformit eivät toimi Qt:ssa — vain attributes ovat tuettuja
- Vain vertex shader voi käyttää uniformeja fragment shaderissa
- setUniformValue vaatii VAO:n — ilman sitä uniform ei päivity

#### `exp-qt-shaders-glsl-version` · diff 3

Shader failaa macOS:llä mutta toimii Windowsilla — puuttuu `#version`. Mitä lisäät?

- **Yhteensopiva #version ja core/es-profiili RHI/GL-backendin mukaan** ✓
- Ajuri arvaa GLSL-version automaattisesti ilman #version-directivea
- GLSL 1.0 toimii kaikilla macOS- ja Windows-OpenGL-ajureilla
- Poista precision qualifierit — ne korvaavat #version-rivin tarpeen

#### `exp-qt-shaders-rhi-backend` · diff 5

Tiimi migoi Qt 5 fixed-functionista Qt 6:een — shaderit hajosivat. Mikä arkkitehtuuri muuttui?

- **QRhi-pipeline tekee shadereista backend-agnostisempia (GL/Vulkan/Metal)** ✓
- Qt 6 poisti GPU-renderöinnin kokonaan fixed-functionin myötä
- QWidget rikkoi kaikki shaderit Qt 5:stä Qt 6:een siirtymisessä
- QML ei tue custom-shadereita Qt 6 RHI-arkkitehtuurissa lainkaan

#### `exp-qt-shaders-uniform-location` · diff 4

Shader compile ok mutta uniform ei vaikuta — hardcoded location 0. Miten Qt 6 -tyylillä vältät?

- **QShaderProgram::uniformLocation("name") tai layout(binding) GLSL:ssä** ✓
- Uniform location 0 on vakio kaikilla ajureilla ja GPU-arkkitehtuureilla
- Uniform-muuttujat eivät toimi Qt:n shader pipeline -järjestelmässä
- Fixed function pipeline korvaa uniformit Qt 6 OpenGL-backendissä

#### `qt-shaders-glsl-version` · diff 5

Shader ei käännä Qt:ssa: 'version directive must occur before anything else'. Mikä puuttuu?

- **#version-directive shaderin ensimmäisellä rivillä (esim. #version 330 core)** ✓
- QSurfaceFormat määrittää version — erillistä #version-riviä ei tarvita
- Käytä vain esikäännettyä .qsb-tiedostoa ja jätä GLSL pois kokonaan
- Lisää precision mediump float C++-puolen QShaderProgram-luokkaan

#### `qt-shaders-uniform` · diff 4

QOpenGLShaderProgram on linkitetty. Miten asetat muuttujan `mvpMatrix` shaderiin?

- **program.setUniformValue("mvpMatrix", matrix)** ✓
- glUniform ilman Qt-wrapperia aina — Qt ei tue
- Q_PROPERTY riittää shader-uniformeille
- Uniformit asetetaan vain .vert-tiedostossa

### qt-signals (14)

#### `b02-qt-signals-queued-04` · diff 4

Worker-thread emit updateUI() — crash GUI-threadissa. Connection type?

- **Qt::QueuedConnection välittää signaalin oikeaan säikeeseen turvallisesti** ✓
- Qt::DirectConnection on oletus cross-thread-signaaleille Qt:ssä
- BlockingQueuedConnection UI-säikeeseen on nopein cross-thread-tapa
- Emit ilman connectia toimittaa signaalin automaattisesti GUI-säikeelle

#### `b03-qt-signals-block-signals` · diff 3

Lataat modelin UI:hin — jokainen setValue laukaisee signaalin ja aiheuttaa loopin. Estä?

- **QSignalBlocker tai blockSignals(true) päivityksen ajaksi** ✓
- disconnect kaikki slotit
- Poista signals & slots kokonaan
- sleep(1) päivitysten välissä

#### `b03-qt-signals-unique-connection` · diff 3

Sama connect() kutsutaan initissä ja refreshissä — slot ajetaan kaksi kertaa. Qt-lippu?

- **Qt::UniqueConnection — estää duplikaattiyhteydet** ✓
- Qt::DirectConnection aina
- disconnect ei ole tarpeen
- UniqueConnection toimii vain queued

#### `b04-qt-meta-object-moc` · diff 4

Luokka käyttää signaaleja ja slotteja, mutta linkitys valittaa staticMetaObject:sta. Mikä build-vaihe puuttuu?

- **MOC ei ajettu — varmista Q_OBJECT, headers CMake AUTOMOC:ssa tai qmake moc** ✓
- Poista Q_OBJECT — ei tarvita
- Vaihda QWidget → QObject riittää
- Käännä vain .cpp uudestaan

#### `b04-qt-signals-block` · diff 3

Bulk-päivitys laukaisee satoja valueChanged-signaaleja — UI jäätyy. Miten hiljennät signaalit väliaikaisesti?

- **QSignalBlocker blocker(&obj); tai blockSignals(true/false)** ✓
- Poista kaikki connectit ja yhdistä uudestaan
- sleep(1) päivityksen jälkeen
- Signaaleja ei voi estää Qt:ssa

#### `b04-qt-signals-sender` · diff 3

Yksi slot käsittelee usean napin clicked-signaalin — miten tunnistat klikatun napin?

- **QObject::sender() castattuna QPushButton*** ✓
- Globaali muuttuja lastButton
- QSignalMapper ainoa tapa Qt 6:ssa
- connect ilman sender-infoa riittää

#### `b05-qt-signals-disconnect-lambda` · diff 3

Lambda-slotti connectissa — disconnect ei toimi osoitteella. Miksi?

- **Jokainen lambda on uniikki funktio-objekti — tallenna connection tai käytä context disconnect** ✓
- Lambda ei voi olla slotti
- disconnect poistaa kaikki automaattisesti
- Vain SIGNAL/SLOT makro toimii

#### `b06-qt-signals-auto-connection` · diff 3

on_pushButton_clicked() ei kutsuta — slot nimi väärä. Miten auto-connection löytää slotin?

- **on_<objectName>_<signal>() — moc auto-connect pattern Designerissä** ✓
- Kaikki public metodit auto-connect — moc yhdistää ne signaaleihin
- Vain connect() eksplisiittisesti — auto-connection ei ole Qt:ssä
- Slot nimi voi olla mitä tahansa — moc löytää sen signaalin perusteella

#### `b06-qt-signals-lambda-disconnect` · diff 4

Lambda-connect jää eloon widgetin tuhoutumisen jälkeen — crash. Miten disconnect turvallisesti?

- **connect lambda + context object — disconnect automaattisesti context tuhoutuessa** ✓
- Lambda ei tarvitse disconnect — Qt vapauttaa yhteyden automaattisesti
- disconnect() ilman argumenteja aina — se katkaisee kaikki lambda-yhteydet
- Käytä raw function pointer — se on turvallisempi kuin lambda connect

#### `b07-qt-signals-disconnect` · diff 3

Dialogi sulkeutuu mutta slot kutsutaan yhä — use-after-free. Mitä teit väärin?

- **Ei disconnect tai parent — QObject elinikä hallitsee signaaliyhteyksiä** ✓
- Signaalit eivät tarvitse disconnectia — Qt katkaisee automaattisesti
- Lambda korvaa disconnectin — context object ei ole tarpeen
- emit stop riittää — se estää slotin kutsun dialogin sulkeuduttua

#### `b08-qt-signals-unique-connection` · diff 3

Sama connect() kutsutaan initissä kahdesti — slotti suoritetaan kaksinkertaisesti. Esto?

- **Qt::UniqueConnection — connect epäonnistuu jos yhteys on jo olemassa** ✓
- connect poistaa vanhan automaattisesti — duplikaatteja ei synny
- UniqueConnection toimii vain queued connection -tyypillä
- Käytä macro connect aina — se estää duplikaattiyhteydet

#### `exp-qt-signals-disconnect-lifetime` · diff 3

Dialog sulkeutuu mutta background-worker emitoi edelleen vanhaan slottiin — use-after-free. Miten estät?

- **disconnect tai QPointer receiverille estää slotin kuolleeseen objektiin** ✓
- Qt:n roskienkeruu vapauttaa slotit automaattisesti dialogin sulkeuduttua
- DirectConnection nopeuttaa cleanupia kun dialog suljetaan nopeasti
- Signaalit eivät laukea enää kuin lähettäjä-objekti on tuhottu

#### `exp-qt-signals-queued-cross-thread` · diff 4

Worker-thread emitoi signaalin joka päivittää GUI-labelin — satunnainen crash. Mikä yhteys tyyppi?

- **Qt::QueuedConnection threadin välillä** ✓
- Qt::DirectConnection nopein aina
- Signals eivät toimi threadien välillä
- QTimer::singleShot(0) korvaa signaalit

#### `qt-signals-unique` · diff 3

Sama signaali connectataan kahdesti samaan slottiin. Miten estät duplikaattikutsut?

- **Qt::UniqueConnection connect-viitelaskurissa** ✓
- disconnect() aina ennen jokaista napinpainallusta
- QSignalSpy estää duplikaatit automaattisesti
- Signaaleja voi laukaista vain kerran

### qt-threading (13)

#### `b02-qt-thread-gui-07` · diff 4

Worker kutsuu suoraan label->setText() — satunnainen crash. Sääntö?

- **GUI-luokkiin vain GUI-säikeestä — viesti signaaleilla workerista** ✓
- QMutex labelin ympärillä tekee setText():stä thread-safe-operaation
- setText() on dokumentaation mukaan thread-safe kaikissa widgeteissä
- volatile QLabel* estää optimoinnin worker-säikeen setText-kutsussa

#### `b02-qt-thread-pool-08` · diff 3

Satoja lyhyitä taustatehtäviä — QThread jokaiselle liian raskas. Vaihtoehto?

- **QThreadPool + QRunnable tai QtConcurrent lyhyille taustatehtäville** ✓
- std::thread jokaiselle tehtävälle ilman rajaa skaalaa parhaiten
- UI-timer 1 ms intervallilla ajaa satoja tehtäviä taustalla
- Blocking GUI-säiettä pitää järjestyksen kun tehtäviä on satoja

#### `b03-qt-thread-invoke-method` · diff 4

Worker-threadista pitää päivittää label GUI:ssa. Turvallinen Qt-tapa?

- **QMetaObject::invokeMethod(..., Qt::QueuedConnection) tai signaali queued** ✓
- label->setText suoraan workerista
- pthread_mutex labelin ympärillä
- GUI thread on valinnainen Qt:ssa

#### `b03-qt-thread-qtimer-thread` · diff 3

QTimer luotu worker-threadissa ei laukea. Mikä sääntö?

- **QTimer tarvitsee event loopin siinä threadissa jossa se luotiin** ✓
- QTimer toimii vain main threadissa aina
- start() riittää ilman threadia
- Timerit eivät toimi Qt:ssa

#### `b04-qt-deferred-delete` · diff 4

Worker-thread emit deleteLater() QObjectille joka elää GUI-threadissä — crash satunnaisesti. Miksi?

- **deleteLater vaatii event loopin omistajasäikeessä — käytä queued delete tai siirrä objekti oikeaan threadiin** ✓
- deleteLater on synkroninen aina
- Kutsu delete suoraan workerista
- QObject ei voi tuhoutua threadeissa

#### `b05-qt-thread-gui-touch` · diff 4

Taustasäie kutsuu widget->setText() suoraan — intermittent crash. Sääntö?

- **GUI-objekteja saa koskea vain thread jolla ne luotiin** ✓
- QWidget on thread-safe
- Mutex riittää widget-muutoksiin
- QApplication::processEvents taustasäieessä korjaa

#### `b06-qt-thread-event-loop` · diff 3

Worker-thread ei vastaa signaaleihin — slot ei kutsuta. Mitä worker-thread tarvitsee?

- **QEventLoop exec() worker-säikeessä — event delivery queued connectionille** ✓
- Thread ilman event loop riittää — signaalit toimitetaan suoraan
- GUI thread exec korvaa worker exec — ei tarvita erillistä loopia
- Signaalit eivät tarvitse event loopia — ne ovat suoria funktiokutsuja

#### `b06-qt-thread-future` · diff 4

Pitkä laskenta taustalla — haluat tulos GUI:hin ilman raw threadia. Qt-ratkaisu?

- **QtConcurrent::run + QFutureWatcher — future pattern taustalaskentaan** ✓
- sleep GUI-threadissa — se pitää UI:n responsiivisena pitkän laskennan ajan
- QThread::terminate — nopein tapa pysäyttää pitkä laskenta taustalla
- Global mutex resultille — se korvaa QFutureWatcherin GUI-päivityksessä

#### `b07-qt-thread-gui-rule` · diff 3

Code review: QLabel::setText kutsutaan worker-threadista. Mikä sääntö rikkoutuu?

- **GUI-luokat vain main threadissä — Qt thread affinity -sääntö** ✓
- setText on thread-safe — QLabel päivittyy mistä säikeestä tahansa
- Vain QPixmap vaatii main threadin — QLabel ei ole thread-safe
- Mutex riittää — GUI-päivitys worker-threadista on turvallinen

#### `b09-qt-thread-wait-condition` · diff 4

Producer-consumer queue Qt:llä — consumer odottaa dataa ilman busy-waitia. Primitiivi?

- **QWaitCondition + QMutex — wait/wakeOne producer-consumer -jonossa** ✓
- QTimer pollaa queuea 1 ms välein — se korvaa QWaitConditionin
- QEventLoop exec() worker-säieessä riittää — ei tarvita wait conditionia
- QSemaphore ei tue odotusta — vain mutex toimii jonossa

#### `exp-qt-thread-gui-touch` · diff 3

Code review löytää `label->setText()` suoraan worker-threadista. Miksi tämä on kielletty?

- **QWidget on GUI-säikeen oma — toisesta säikeestä kutsu on UB** ✓
- setText() on thread-safe kaikissa Qt 5 ja Qt 6 -versioissa
- Vain OpenGL-piirto vaatii main thread -ajon, ei tavalliset widgetit
- QMutex widgetin ympärillä tekee setText():stä turvallisen workerissa

#### `exp-qt-thread-worker-object` · diff 4

Raskas laskenta jäädyttää UI-threadin. Mikä Qt-malli siirtää työn taustalle?

- **QObject-worker moveToThread(QThread*)-säikeellä ja signaaleilla** ✓
- Override QThread::run() suoraan QWidget-luokassa UI-säikeessä
- std::thread QWidget-metodissa ilman synkronointia on Qt:n suositus
- processEvents()-silmukka pääsäikeessä pitää laskennan taustalla

#### `qt-thread-movetothread` · diff 4

Pitkäkestoinen työ jumittaa UI:n. Qt-tyylinen ratkaisu QObjectille?

- **Siirrä QObject worker-säikeeseen moveToThread:lla, käytä signaaleja** ✓
- Kutsu QThread::terminate() heti kun työ hidastuu käynnistyksessä
- Käytä processEvents()-silmukkaa jokaisessa pitkässä metodissa
- sleep() pääsäikeessä pitää UI:n responsiivisena odotuksen aikana

### qt-widgets (30)

#### `b02-qt-widgets-action-03` · diff 3

Valikkorivin Save-toiminto pitää bindata Ctrl+S:ään ja toolbar-nappiin. Qt-abstraktio?

- **QAction yhdistää Ctrl+S, valikon ja toolbarin yhdeksi toiminnoksi** ✓
- Kaksi erillistä slottia kopioituna valikolle ja toolbarille
- Global OS-hotkey riittää korvaamaan QAction-abstraktion kokonaan
- QShortcut erikseen ilman QActionia synkronoi valikon ja toolbarin

#### `b02-qt-widgets-layout-01` · diff 2

Ikkuna resize repi widgetit — kovakoodatut setGeometry-kutsut. Parempi Qt-tapa?

- **QLayout (QVBoxLayout/QHBoxLayout) hoitaa resizen automaattisesti** ✓
- setFixedSize() kaikille widgeteille estää resizen repeämisen
- resizeEvent()-override manuaalisesti joka widgetille on suositeltu
- Widget ilman parentia ja layoutia skaalautuu ikkunan mukana

#### `b02-qt-widgets-parent-02` · diff 2

Dialog leakkaa muistia sulkeutumisen jälkeen — widgetit orphan. Fix?

- **Parent QDialogille tai WA_DeleteOnClose estää orphan-widgetit** ✓
- delete this -kutsu satunnaisesti suljettaessa vapauttaa dialogin
- shared_ptr<QWidget> on Qt:n suositeltu tapa hallita widget-elinkaarta
- Piilota dialog show():lla — muisti vapautuu automaattisesti myöhemmin

#### `b03-qt-widgets-dialog-modal` · diff 2

Asetusdialogi avautuu mutta pääikkuna vastaa klikkauksiin taustalla. Korjaus?

- **dialog.exec() modal-tilassa tai QDialog::ApplicationModal estää taustan** ✓
- show() avaa dialogin modal-tilassa ja estää pääikkunan klikkaukset
- Poista WindowStaysOnTopHint — se aktivoi modal-käytöksen automaattisesti
- Modal-dialogit on poistettu Qt 6:ssa — käytä QWidget-overlaya

#### `b03-qt-widgets-event-filter` · diff 3

Pitää siepata Enter-näppäin tietystä kentästä ilman subclassia. Qt-mekanismi?

- **installEventFilter() objektilla, joka implementoi eventFilter()-metodin** ✓
- Override keyPressEvent() jokaisessa widgetissä projektissa erikseen
- Global keyboard hook käyttöjärjestelmästä korvaa Qt-event filterin
- QShortcut ei toimi input-kentissä — event filter on ainoa tapa

#### `b03-qt-widgets-layout-stretch` · diff 2

QHBoxLayoutissa napit venyvät epätasaisesti ikkunan resize:ssä. Säädin?

- **addStretch() ja setStretchFactor() jakavat tilan tarkoituksella layoutissa** ✓
- setFixedSize() koko ikkunalle estää nappien epätasaisen venymisen
- Poista layout ja käytä absolute positioning resize-tilanteissa
- Stretch toimii vain QGridLayoutissa — QHBoxLayout ei tue sitä

#### `b04-qt-event-filter` · diff 3

Haluat kaapata kaikki keypress-eventit dialogissa ennen lapsia. Qt-mekanismi?

- **installEventFilter(filterObj) dialogille — filterObj::eventFilter()** ✓
- override keyPressEvent vain yhdessä napissa
- global keyboard hook OS:ssa
- QShortcut riittää kaikkeen

#### `b04-qt-layout-stretch` · diff 2

QHBoxLayout: keskimmäinen widget pitäisi venyä, reunat kiinteät. Asetus?

- **layout->setStretch(1, 1) — stretch factor keskimmäiselle** ✓
- setFixedSize kaikille
- QGridLayout ainoa vaihtoehto
- move() manuaalisesti resizeEventissä

#### `b04-qt-resource-qrc` · diff 2

Ikoni puuttuu asennetusta binääristä — tiedosto on vain dev-koneen polussa. Qt-ratkaisu?

- **Qt Resource System (.qrc) — :/icons/app.png upotettuna binaryyn** ✓
- Kovakoodattu absoluuttinen polku
- Kopioi käsin /usr/share joka buildissa
- Lataa verkosta käynnistyksessä

#### `b04-qt-widgets-qss` · diff 3

QPushButton tyyli pitää vaihtaa globaalisti ilman jokaista setStyleSheet-kutsua. Ratkaisu?

- **QApplication::setStyleSheet tai .qss tiedosto + setStyleSheet lukee tiedoston** ✓
- paintEvent jokaisessa napissa
- palette() riittää kaikkeen
- Inline HTML

#### `b05-qt-widgets-dialog-modal` · diff 3

Modal-dialogi ei estä pääikkunan klikkauksia. Mikä puuttuu?

- **exec() modalille tai setModal(true) + oikea parent** ✓
- show() riittää modalille
- QDialog ei tue modaliteettia
- setWindowFlags(Qt::Tool) tekee modalin

#### `b05-qt-widgets-layout-stretch` · diff 2

QHBoxLayoutissa vasen paneeli vie liikaa tilaa — oikea nappi jää piiloon. Miten tasapainotat?

- **setStretchFactor tai stretch parametri — suhteellinen jako** ✓
- setFixedSize kaikille widgeteille
- Poista layout — absolute positioning
- resizeEvent tyhjä — Qt hoitaa automaattisesti

#### `b05-qt-widgets-size-hint` · diff 2

Custom widget leikkaa tekstiä layoutissa. Mitä metodia ylikirjoitat?

- **sizeHint() — layout käyttää ehdotettua kokoa widgetin sijoittamiseen** ✓
- paintEvent() palauttaa koon layoutille automaattisesti piirron yhteydessä
- resize() layoutissa riittää — sizeHint ei vaikuta layout-manageriin
- setMinimumSize(0,0) korjaa aina tekstin leikkautumisen layoutissa

#### `b06-qt-resource-extern` · diff 3

QRC-resurssi pitää päivittää ilman uudelleenkäännöstä. Miten ulkoiset resurssit?

- **QResource registerResource tai external path — päivitys ilman uudelleenkäännöstä** ✓
- QRC on ainoa tapa Qt:ssä — ulkoisia resursseja ei voi ladata runtime-aikana
- COPY resurssit suoraan imageen buildissa — se mahdollistaa hot-reloadin tuotannossa
- Lue resurssit pelkästä filesystemista ilman Qt API:a — QRC ja registerResource turhia

#### `b06-qt-widgets-context-menu` · diff 2

List widget tarvitsee right-click menu. Miten toteutat Qt-widgetsissa?

- **customContextMenuRequested + QMenu — standard pattern list widgetissä** ✓
- mousePressEvent aina — context menu API on deprecated Qt 6:ssa
- QAction toimii vain toolbarissa — ei kontekstivalikoissa
- setContextMenuPolicy(PreventContextMenu) näyttää oikean klikkausvalikon

#### `b06-qt-widgets-focus-policy` · diff 3

Label saa fokuksen tabilla mutta ei pitäisi. Mitä muutat?

- **setFocusPolicy(Qt::NoFocus) — label ei saa näppäimistöfokusta tabilla** ✓
- hide() label — se poistaa widgetin tab-ketjusta näkyvyyden säilyttäen
- setEnabled(false) estää labelin saamasta fokusta tab-näppäimellä
- QSS focus: none korvaa setFocusPolicyn kaikissa widgeteissä

#### `b06-qt-widgets-tab-order` · diff 2

Tab-järjestys lomakkeessa on väärä — käyttäjä tabbaa satunnaisesti. Miten korjaat?

- **setTabOrder(widget1, widget2) — eksplisiittinen tab-ketju lomakkeessa** ✓
- Tab order on aina automaattinen — luontijärjestys tuottaa oikean ketjun
- QSS tab-order property määrittää fokuksen siirtymisen widgettien välillä
- Poista Tab key event filter — se korjaa satunnaisen tab-järjestyksen

#### `b07-qt-layout-responsive` · diff 3

Ikkuna resize aiheuttaa widgettien päällekkäisyyden. Mikä layout-manager korjaa?

- **QVBoxLayout / QHBoxLayout / QGridLayout — automaattinen uudelleenasettelu** ✓
- setFixedSize kaikille — se estää widgettien päällekkäisyyden resizessa
- Absolute positioning move():llä — layout manager ei ole tarpeen
- Poista layout — resizeEvent hoitaa widgettien sijoittelun

#### `b07-qt-widget-parent` · diff 2

Dialogi jää roikkuen muistissa ikkunan sulkeuduttua. Todennäköisin syy?

- **Ei parent-widgettiä — QObject parent hallitsee lasten elinkaarta** ✓
- Qt vuotaa aina — parent ei vaikuta dialogin elinkaareen
- delete this riittää aina — parent ei tarvita dialogin sulkemiseen
- QApplication::quit korjaa roikkuvan dialogin muistissa

#### `b07-qt-widget-stylesheet` · diff 3

Nappi näyttää erilaiselta macOS vs Windows — haluat yhtenäisen ulkoasun. Qt-ratkaisu?

- **QSS stylesheet tai QStyle — yhtenäinen ulkoasu platform-riippumattomasti** ✓
- Piirrä bitmap jokaiselle alustalle — se on Qt:n suositeltu tapa
- setFixedSize korjaa tyylin erot macOS:n ja Windowsin välillä
- Qt ei tue custom tyyliä — vain natiivi look on mahdollinen

#### `b08-qt-widgets-focus-policy` · diff 2

Custom nappi ei saa näppäimistöfokusta Tabilla. Mitä asetat?

- **setFocusPolicy(Qt::StrongFocus) — widget tab orderiin näppäimistöfokuksella** ✓
- setEnabled(true) riittää fokukselle — focus policy ei vaikuta tabiin
- FocusPolicy on vain QLineEditille — custom nappi ei tarvitse sitä
- Tab order ei ole konfiguroitavissa Qt widgeteissä

#### `b08-qt-widgets-menubar` · diff 2

Desktop-sovelluksessa päävalikko puuttuu macOS:llä vaikka QMenuBar on luotu. Tyypillinen syy?

- **macOS siirtää menubar yläreunaan — setNativeMenuBar(true) käyttäytyminen** ✓
- QMenuBar ei toimi macOS:llä — käytä QML-menua desktop-sovelluksessa
- Menu pitää piirtää manuaalisesti QPainterilla macOS-ikkunan sisällä
- Vain QML tukee valikoita — QMenuBar on poistettu Qt 6:sta

#### `b08-qt-widgets-qstacked` · diff 2

Wizard-UI: useita sivuja yhdessä ikkunassa — vain yksi näkyvissä kerrallaan. Widget?

- **QStackedWidget — setCurrentIndex vaihtaa wizard-sivua yhdessä ikkunassa** ✓
- QTabBar ilman QStackedWidgetia riittää wizard-UI:hin
- hide/show kaikki ikkunat erikseen — standardi wizard-pattern Qt:ssä
- QSplitter wizardeihin — vain yksi sivu näkyvissä kerrallaan

#### `b08-qt-widgets-tooltip-delay` · diff 2

Tooltip tulee liian hitaasti QA-testaajille. Mitä Qt-sovelluksessa säädät?

- **QApplication style/toolTipDuration tai platform theme — säädä showDelay** ✓
- Tooltip-delay ei ole konfiguroitavissa Qt-sovelluksessa
- Vain mouseTracking riittää — se nopeuttaa tooltipin ilmestymistä
- QLabel korvaa tooltipin aina — QToolTip ei ole tarpeen

#### `b09-qt-widgets-focus-tab` · diff 2

Lomakkeessa tab-järjestys hyppii satunnaisesti. Mitä tarkistat?

- **setTabOrder() widgettien välillä — tarkista focus chain lomakkeessa** ✓
- setFocusPolicy(Qt::NoFocus) kaikille — se korjaa tab-järjestyksen
- Tab order on automaattinen aina oikein — ei tarvitse säätää
- QTimer::singleShot korjaa tabin — se järjestää fokuksen uudelleen

#### `b09-qt-widgets-size-policy` · diff 2

QFormLayoutissa label venyy turhaan ikkunan leveydessä — input-kenttä jää kapeaksi. Korjaus?

- **setSizePolicy(Fixed/Preferred) labelille tai stretch oikein QFormLayoutissa** ✓
- setFixedSize koko ikkunalle — se korjaa labelin venymisen
- Poista layout — käytä move() koordinaateilla formissa
- SizePolicy ei vaikuta layouteihin — vain minimumSize määrää

#### `b09-qt-widgets-splitter-state` · diff 3

Käyttäjä säätää paneelien kokoa QSplitterillä — asetus katoaa restartissa. Ratkaisu?

- **saveState()/restoreState() QSettingsiin — splitter-tila session välillä** ✓
- setFixedSize splitterille — se säilyttää käyttäjän asetelman
- QSplitter ei tue tilan tallennusta — vain manuaalinen resize toimii
- resize() resizeEventissä riittää — QSettings ei tarvita

#### `exp-qt-widgets-layout-crash` · diff 3

Code review: QDialog luodaan stackissa ilman parenttia ja deleteLater kutsutaan väärässä järjestyksessä — crash suljettaessa. Mitä ehdotat?

- **Anna parent QWidget*: Qt hallitsee elinkaaren hierarkiassa automaattisesti** ✓
- Käytä raw new ilman parenttia — elinkaari on silloin selkeämpi
- Poista closeEvent-override jotta sulku ei kaada dialogia
- Migroi koko UI QML:ään välttääksesi QWidget-elinkaari-ongelmat

#### `exp-qt-widgets-size-hint` · diff 3

Custom widget leikkaa tekstiä eri DPI:llä. Mikä metodi pitää overridata layoutin oikeaa kokoa varten?

- **Overridaa sizeHint() ja tarvittaessa minimumSizeHint() layoutille** ✓
- Aseta resize(100,100) konstruktorissa kaikille DPI-asetuksille
- paintEvent() riittää kertomaan layoutille widgetin oikean koon
- setFixedSize() varmistaa yhtenäisen koon eri näyttöjen DPI:llä

#### `qt-widgets-parent` · diff 2

Miksi QWidget:lle annetaan parent-osoitin konstruktorissa?

- **Parent hoitaa omistajuuden: lapset tuhotaan ja layout järjestää** ✓
- Parent varmistaa että widget on näkyvissä heti konstruktorissa
- Ilman parentia widget on automaattisesti modal-dialogi
- Parent korvaa QApplication-olion event loopin hallinnassa

## robotframework (21)

### rf-basics (7)

#### `rf-env-variables` · diff 4

Testit ajetaan devissä, stagingissä ja tuotannossa. Miten ympäristökohtaiset URLit ja salaisuudet hallitaan?

- **Muuttujatiedostot tai --variable/--variablefile ajossa; salaisuudet CI:n secret storesta** ✓
- Kovakoodaa BASE_URL jokaiseen .robot-tiedostoon ja vaihda käsin ennen ajoa
- Committaa salasanat variables/prod.yaml-tiedostoon versionhallintaan
- Käytä aina samaa staging-URL:ia myös tuotantotesteissä

#### `rf-keyword-structure` · diff 3

Robot Frameworkissa testi koostuu avainsanoista. Miten oma avainsana (keyword) määritellään .robot-tiedostossa?

- ***** Keywords *** -otsikon alla: nimi, [Arguments] ja askeleet sisennettynä** ✓
- def keyword_name(): -funktio Python-syntaksilla .robot-tiedostossa
- keyword: -lohko YAML-muodossa testin sisällä erillisenä sektiona
- Avainsanat kirjoitetaan vain erillisiin .py-tiedostoihin, ei .robot-tiedostoihin

#### `rf-library-import` · diff 3

Testissä tarvitset käyttöjärjestelmäkomentoja (ls, mkdir). Mikä kirjasto tuo ne Robot Frameworkiin?

- **OperatingSystem-kirjasto — Library OperatingSystem *** Settings ***-osiossa** ✓
- Process-kirjasto ajaa kaikki OS-komennot automaattisesti ilman erillistä importtia
- Evaluate ${result} = os.listdir('.') käyttää Pythonia suoraan RF-syntaksissa
- Robot Framework ajaa shell-komentoja natiivisti ilman kirjastojen tuontia

#### `rf-resource-files` · diff 3

Useat .robot-testitiedostot tarvitsevat samoja avainsanoja. Miten jaat ne ilman kopiointia?

- **Luo resource-tiedosto (.resource/.robot) ja tuo se Resource-asetuksella *** Settings ***-osiossa** ✓
- Kopioi *** Keywords *** -osio jokaiseen tiedostoon import-lauseella automaattisesti
- Käytä *** Global Keywords *** -osiota joka näkyy automaattisesti kaikissa testeissä
- Tallenna avainsanat YAML-tiedostoon ja lataa ne --include-lipulla ajossa

#### `rf-secrets-logging` · diff 4

Salasana näkyy Robotin log.html-raportissa CI-artefakteissa. Mikä meni pieleen?

- **Salasana välitettiin keyword-argumenttina tai logattiin — lue salaisuudet env/secret storesta ja rajoita loggausta** ✓
- Robot Framework ei koskaan kirjaa argumentteja — vika on CI-palvelimen konfiguraatiossa
- Salasanat pitää kovakoodata .robot-tiedostoon jotta ne eivät näy raporteissa
- Poista log.html kokonaan CI:stä — se on ainoa tapa suojata salaisuudet

#### `rf-setup-teardown` · diff 3

Jokainen testi tarvitsee selaimen avauksen alussa ja sulkemisen lopussa. Mikä Robot Framework -mekanismi?

- **Test Setup ja Test Teardown *** Settings *** -osiossa tai testikohtaisesti [Setup]/[Teardown]** ✓
- before_each/after_each Python-dekoraattorit testifunktiossa
- *** Init *** ja *** Cleanup *** erikoisosiot .robot-tiedostossa
- Kirjoita avaus/sulku ensimmäisenä/viimeisenä askeleena jokaiseen testiin manuaalisesti

#### `rf-variables` · diff 3

Robot Frameworkissa on lista URL-osoitteita joita käytetään testissä. Mikä muuttujatyyppi?

- **@{URLS} listmuuttuja — viittaus @{URLS} tai yksittäinen ${URLS}[0]** ✓
- ${URLS} = ['url1', 'url2'] — normaali skalaari joka sisältää listan automaattisesti
- %{URLS} ympäristömuuttuja joka tallennetaan ennen testiajoa shellissä
- &{URLS} sanakirjamuuttuja jossa avaimina indeksit ja arvoina URLit

### rf-design (5)

#### `rf-abstraction-level` · diff 4

Checkout-testi sisältää 80 riviä Click/Input Text -askeleita. UI-muutos rikkoo kymmeniä testejä. Mikä rakenne on parempi?

- **Nosta tekniset UI-askeleet domain-tason keywordeiksi — testi kertoo liiketoimintaflow'n** ✓
- Pidä kaikki Click-rivit testissä mutta kopioi ne resource-tiedostoon
- Lisää jokaisen Clickin eteen Sleep 2s jotta testit eivät hajoa
- Siirrä koko 80-rivinen testi yhteen Python-funktioon ja kutsu sitä Robotista

#### `rf-api-vs-ui` · diff 4

Tiimi ajaa kaiken checkout-flow'n selaimella. Testit kestävät 45 min ja flakkaavat. Osa testeistä tarkistaa vain tilauksen luonnin. Mitä muutat?

- **Testaa backend-flow API-tasolla (RequestsLibrary/Python-client); käytä selainta vain kriittisiin UI-polkuihin** ✓
- Lisää rinnakkaisuutta Pabotilla ilman testien eristystä
- Korvaa kaikki testit yhdellä pitkällä end-to-end -testillä
- Lisää Sleep 5s jokaisen askeleen väliin jotta testit vakaantuvat

#### `rf-custom-python-keyword` · diff 4

Tarvitset monimutkaista laskentaa jota ei voi tehdä RF-avainsanoilla. Miten laajennat?

- **Kirjoita Python-kirjasto (.py) jossa funktiot ovat suoraan RF-avainsanoja — Library MyLib** ✓
- Käytä Evaluate-avainsanaa kaikelle Python-logiikalle suoraan .robot-tiedostossa
- Kutsu Python-skriptiä Process.Run Process komennolla ja parsaa stdout
- Kirjoita logiikka Java-kirjastona koska RF on alun perin Java-pohjainen

#### `rf-data-driven` · diff 4

Sama testi pitää ajaa kymmenellä eri syöte/tulos -parilla. Miten Robot Frameworkissa?

- **[Template] avainsana + test cases -taulukossa rivit ovat data-rivejä — data-driven tyyli** ✓
- FOR-silmukka testin sisällä iteroi listan yli ja ajaa askeleet jokaiselle
- Luo 10 erillistä testiä identtisillä askeleilla mutta eri muuttujilla
- Käytä pytest-parametrize dekoraattoria .robot-tiedostossa suoraan

#### `rf-test-data` · diff 4

Testi luo käyttäjän test@example.com. Ensimmäinen ajo onnistuu, toinen kaatuu koska käyttäjä on jo olemassa. Miten hallitset testidatan?

- **Uniikki tunniste (timestamp/build id), teardown-siivous tai kertakäyttöinen testitenantti** ✓
- Oleta että ympäristö on tyhjä ennen jokaista ajoa
- Aja testi vain kerran päivässä jotta data ei törmää
- Poista testi kokonaan jos se epäonnistuu toisella ajolla

### rf-execution (4)

#### `rf-ci-exit-code` · diff 4

CI ajaa Robot-testit, mutta build menee vihreäksi vaikka testit epäonnistuivat. Mikä meni pieleen?

- **Pipeline nielee Robotin exit coden esim. || true -rakenteella — älä peitä epäonnistumista** ✓
- Robot Framework ei palauta exit codea — CI ei voi tietää epäonnistumisesta
- JUnit XML puuttuu, joten CI ei voi merkitä buildia punaiseksi
- log.html pitää poistaa ennen CI-ajoa jotta exit code toimii

#### `rf-ci-integration` · diff 4

Robot Framework -testien tulokset pitää raportoida Jenkinsiin. Mikä tulosformaatti integroituu?

- **robot --xunit output.xml tuottaa JUnit-muotoisen raportin jonka Jenkins parsii natiivisti** ✓
- Robot Frameworkin output.xml on suoraan Jenkins-yhteensopiva ilman konversiota
- Käytä --format jenkins-lippua joka generoi Jenkins-pluginin vaatiman formaatin
- Jenkins Robot Framework Plugin lukee vain log.html-tiedostoa selaimessa

#### `rf-pabot-parallel` · diff 4

Robot-testit kestävät 45 minuuttia. Voiko ne ajaa rinnakkain turvallisesti?

- **Kyllä Pabotilla tai CI:n rinnakkaisilla jobeilla — mutta vain jos testit ovat eristettyjä (data, sessio, portit)** ✓
- Kyllä — lisää rinnakkaisuus ensin, eristys korjataan myöhemmin
- Ei — Robot Framework ei tue rinnakkaisuutta lainkaan
- Kyllä — kaikki testit voivat jakaa saman kirjautuneen selainistunnon nopeuden vuoksi

#### `rf-tags-include-exclude` · diff 3

Testisuitessa on 200 testiä mutta haluat ajaa vain smoke-testit CI:ssä. Miten valitset?

- **Merkitse testit [Tags] smoke ja aja robot --include smoke — ajaa vain merkityt** ✓
- Siirrä smoke-testit erilliseen hakemistoon ja aja vain se hakemisto CI:ssä
- Lisää if-ehto jokaisen testin alkuun joka tarkistaa ympäristömuuttujan
- Käytä --test 'Smoke*' glob-patternia joka suodattaa nimiperusteisesti

### rf-web (5)

#### `rf-browser-library` · diff 4

Robot Frameworkilla pitää testata modernia SPA-sovellusta. Mikä kirjasto soveltuu parhaiten?

- **Browser-kirjasto (Playwright-pohjainen) — tukee auto-wait ja modernia JS:ää natiivisti** ✓
- SeleniumLibrary on aina paras valinta koska se tukee kaikkia selaimia universaalisti
- RequestsLibrary riittää SPA-testaukseen koska se testaa API-kutsut suoraan
- RPA.Browser ajaa testit pelkästään headless-tilassa ilman todellista selainta

#### `rf-flaky-tests` · diff 4

Testi epäonnistuu kerran viikossa CI:ssä mutta menee aina rerunilla läpi. Mitä teet?

- **Kerää debug-artefaktit, selvitä juurisyy ja korjaa odotus/data/eristys — flaky-tag on väliaikainen** ✓
- Lisää Sleep 10s ja aja testi aina kolme kertaa — ongelma ratkaistu
- Poista testi ilman selvitystä koska se menee useimmiten läpi
- Merkitse testi pysyvästi flaky-tagilla ja jätä se pois CI:stä ikuisesti

#### `rf-run-on-failure` · diff 4

Haluat automaattisen kuvakaappauksen jokaisesta epäonnistuneesta web-testistä debuggausta varten. Miten?

- **Register Keyword To Run On Failure Capture Page Screenshot — ajetaan automaattisesti failissa** ✓
- Lisää Capture Page Screenshot jokaisen testin [Teardown]-osioon manuaalisesti
- Käytä --on-failure screenshot komentoriviparametria robot-ajossa globaalisti
- SeleniumLibrary tallentaa aina kuvakaappauksen automaattisesti ilman konfiguraatiota

#### `rf-selector-strategy` · diff 4

Web-testit hajoavat aina kun CSS-luokkia refaktoroidaan. Mitä muutat selectoreissa?

- **Käytä stabiileja testiselektoreita kuten data-testid — vältä tyyliluokkia ja pitkiä XPath-polkuja** ✓
- Käytä pidempää XPath-polkuja jotta elementti on varmasti uniikki
- Korvaa kaikki selectorit tekstisisällöllä kuten Click    Ostoskori
- Käytä aina css=.btn.primary.mt-2 koska se on lyhyin kirjoittaa

#### `rf-wait-until` · diff 3

Web-testi epäonnistuu koska elementti ei ole vielä näkyvissä sivun latauduttua. Miten korjaat?

- **Wait Until Element Is Visible tai Wait Until Keyword Succeeds odottaa dynaamisesti** ✓
- Sleep 5s ennen jokaista klikkausta varmistaa että sivu on latautunut
- Set Selenium Speed 2s hidastaa kaikkia toimintoja riittävästi
- Poista implicit wait kokonaan ja käytä try/except logiikkaa testissä

## rust (75)

### rust-async (12)

#### `rust-async-future-await` · diff 3

Mitä `async fn` palauttaa Rustissa?

- **Implementoinnin Future-traitille — lazy, poll-kontrolloidusti ajettava** ✓
- Os-säie heti kun funktio kutsutaan
- Blocking thread pool entry
- Promise<T> JavaScript-objekti

#### `rust-async-http-timeout` · diff 3

Rust-palvelu kutsuu ulkoista API:a ilman timeoutia. Mikä riski?

- **Future odottaa liian kauan — taskit ja connection poolit kasautuvat** ✓
- Rust kaatuu automaattisesti 30 s jälkeen
- Ei riskiä — async on aina non-blocking
- Vain synkroninen koodi voi jumittua

#### `rust-async-spawn-lost-errors` · diff 3

Taustatehtävä panikoi, mutta kukaan ei huomaa. Mikä meni pieleen?

- **JoinHandle pudotettiin — panic/virhe jäi näkymättömäksi fire-and-forgetissä** ✓
- tokio::spawn propagoi panicin automaattisesti HTTP-vastaukseen
- Async-tehtävä ei voi panikoida
- Virhe näkyy aina stderrissä tuotannossa

#### `rust-async-tokio-join-handle` · diff 2

tokio::spawn palauttaa JoinHandle<T>. Miten saat tehtävän tuloksen tai virheen?

- **handle.await — palauttaa Result<T, JoinError> (panic taskissa → Err)** ✓
- handle.join() synkroninen metodi
- handle.unwrap() palauttaa T suoraan
- JoinHandle poll manually aina

#### `rust-async-tokio-mpsc` · diff 3

Async-tehtävät viestivät toisilleen tokio-runtime:ssa. Mikä kanava on async-native?

- **tokio::sync::mpsc — send().await / recv().await ilman blokkausta** ✓
- std::sync::mpsc — async send odottaa awaitilla
- tokio::channel on deprecated
- UdpSocket viestikanavana aina

#### `rust-async-tokio-mutex` · diff 3

Jaettu tila async-tehtävissä — `std::sync::Mutex` aiheuttaa blokkausta awaitin yli. Mikä korvaaja?

- **tokio::sync::Mutex — async lock().await ei blokkaa executor-säiettä** ✓
- RefCell async:ssä säikeiden välillä
- std::Mutex on aina parempi
- Arc<RwLock> std — sama kuin tokio

#### `rust-async-tokio-runtime` · diff 3

async main ei käänny ilman runtimea. Mikä on tyypillinen tokio-käynnistys?

- **#[tokio::main] async fn main() { ... } — makro alustaa multi-thread runtime** ✓
- std::async::main built-in Rust 1.85
- async main toimii ilman attributia
- cargo async-run pakollinen

#### `rust-async-tokio-runtime-flavor` · diff 3

CLI-työkalu ajaa yhden async-mainin ilman rinnakkaisia worker-säikeitä. Mikä #[tokio::main] asetus?

- **flavor = "current_thread" — yksi säie, tehtävät vuorotellen pollauksessa** ✓
- flavor = "single" — virallinen nimi
- threads = 0 poistaa runtime:n
- async main ei tarvitse runtimea CLI:ssä

#### `rust-async-tokio-select` · diff 3

Odotat useaa Futurea — ensimmäinen valmis voittaa (timeout, cancel). Mikä tokio-makro?

- **tokio::select! { ... } — odottaa useaa haaraa, suorittaa ensimmäisen valmistuneen** ✓
- Future::join aina — select poistettu
- tokio::wait_all — std-makro
- async if-else riittää aina

#### `rust-async-tokio-sleep` · diff 2

async-funktiossa tarvitset viiveen. Miksi `std::thread::sleep` on huono valinta?

- **Blokkaa executor-säikeen — tokio::time::sleep().await yieldaa runtimeille** ✓
- thread::sleep on nopeampi aina async:ssä
- sleep ei toimi Rustissa
- await korvaa sleep:in automaattisesti

#### `rust-async-tokio-spawn` · diff 2

async fn:ssä haluat ajaa toisen async-tehtävän taustalla saman runtime:n alla. Mikä tokio-API?

- **tokio::spawn(async { ... }) — palauttaa JoinHandle, ei blokkaa executor-säiettä** ✓
- std::thread::spawn — idiomaattinen async-kontekstissa
- async fn spawn() — std tarjoaa spawn:in
- tokio::run blocking — pakollinen jokaiselle tehtävälle

#### `rust-async-tokio-tcp` · diff 3

Rakennat async TCP-palvelimen tokio:lla. Mikä tyyppi acceptoi yhteydet ilman blokkaavaa IO:ta?

- **tokio::net::TcpListener — bind + accept().await async IO:lle** ✓
- std::net::TcpListener + set_nonblocking riittää aina
- tokio::TcpServer std:ssä
- hyper::Server ainoa tapa TCP:lle

### rust-borrowing (6)

#### `rust-borrow-immut` · diff 1

Haluat lukea vektoria funktiossa ilman omistajuuden luovutusta. Mikä parametri?

- **&Vec<T> — jaettu lainaus, useita samanaikaisia lukijoita sallittu** ✓
- Vec<T> kopiona — ainoa tapa lukea dataa turvallisesti
- *const T — raaka osoitin korvaa lainauksen aina
- Box<Vec<T>> — pakollinen kaikille funktioparametreille

#### `rust-borrow-lifetime-elision` · diff 3

Funktio palauttaa `&str` kahdesta parametrista. Milloin tarvitset eksplisiittiset lifetime-merkinnät?

- **Kun kääntäjä ei voi päättää palautusviittauksen lähdettä (useita samansyvyisiä inputteja)** ✓
- Aina — jokaisessa funktiossa pakollinen
- Ei koskaan — Rust päättelee automaattisesti aina
- Vain unsafe-lohkoissa

#### `rust-borrow-mut` · diff 2

Code review: sama vektori on sekä `&mut` että `&` samassa scope:ssa. Miksi kääntäjä hylkää?

- **Ei voi olla yhtä aikaa muokkaavaa ja jaettua lainausta samaan dataan** ✓
- &mut vaatii aina `unsafe`-lohkon — se on oletuksena kielletty
- Vain yksi &mut kerrallaan koko ohjelmassa — globaali rajoitus
- Vec ei tue muokkaavaa lainausta — käytä `RefCell` aina

#### `rust-borrow-refcell-interior` · diff 3

Tarvitset muokata arvoa &self-metodissa (interior mutability). Mikä tyyppi auttaa single-threaded -tilanteessa?

- **RefCell<T> — runtime borrow checker Cell/RefCell-perheessä** ✓
- Mutex<T> aina — RefCell on poistettu
- mut self riittää aina ilman wrapperia
- unsafe mut static

#### `rust-borrow-slice-type` · diff 2

Miksi `&Vec<T>` funktioparametrina on usein huono verrattuna `&[T]`:hen?

- **&[T] hyväksyy Vec, array ja muut slice-kelpoiset — joustavampi API** ✓
- &[T] ei toimi Vec:in kanssa
- Vec on ainoa tapa välittää taulukko
- &[T] kopioi aina koko vektorin

#### `rust-borrow-static-lifetime` · diff 2

Mikä `'static` lifetime tarkoittaa Rustissa?

- **Viittaus elää koko ohjelman ajan — esim. string literalit** ✓
- Staattinen muuttuja C-tyyliin — global mut aina
- Viittaus validi vain compile-time
- Sama kuin Arc<T> elinkaari

### rust-concurrency (6)

#### `rust-concurrency-mpsc-channel` · diff 3

Worker-säikeet lähettävät tuloksia pääsäikeelle. Mikä std-primitiivi sopii?

- **mpsc::channel — multiple producer, single consumer -viestijono** ✓
- Arc<Mutex<Vec>> aina parempi kuin kanava
- UdpSocket localhost viestintään
- RefCell<Vec> säikeiden välillä

#### `rust-concurrency-mutex-deadlock` · diff 3

Kaksi Mutex-lukitusta eri järjestyksessä kahdessa säikeessä — riski?

- **Deadlock — sama järjestys kaikissa säikeissä tai yksi lukko** ✓
- Borrow checker estää deadlocks automaattisesti
- Mutex on deadlock-proof Rustissa
- Deadlock vain async-koodissa

#### `rust-concurrency-rwlock-readers` · diff 3

Monta säiettä lukee harvoin kirjoittavaa cachea. Mutex vs RwLock?

- **RwLock — useita concurrent reader-lukituksia, yksi writer** ✓
- Mutex nopeampi aina usealla lukijalla
- RefCell säikeiden välillä
- Atomi u32 kaikkeen cacheen

#### `rust-concurrency-send-sync` · diff 3

Jaat `Rc<T>` usean säikeen välillä — kääntäjä valittaa. Mikä tyyppi korvaa sen thread-safe -tilanteessa?

- **Arc<T> — atomisesti laskettu jaettu omistajuus (Send + Sync)** ✓
- Box<T> — heap-allokaatio riittää säikeiden väliseen jakamiseen
- Mutex<T> ilman Arc:ia — Mutex yksin riittää jaettuun omistukseen
- unsafe { Rc::from_raw } — ainoa tapa jakaa Rc säikeiden välillä

#### `rust-concurrency-send-sync-def` · diff 3

Mikä ero `Send`- ja `Sync`-traitien välillä?

- **Send = siirrettävissä toiseen säikeeseen; Sync = jaettu &T viittaus säikeiden välillä turvallinen** ✓
- Identtiset traitit — alias
- Send vain async, Sync vain sync
- Automaattinen kaikille tyypeille ilman poikkeuksia

#### `rust-concurrency-thread-spawn` · diff 2

Miten käynnistät uuden OS-säikeen std-kirjastolla?

- **thread::spawn(closure) — palauttaa JoinHandle<T>** ✓
- async fn spawn — std async runtime
- pthread_create wrapper ainoa
- Process::fork Rustissa

### rust-error (6)

#### `rust-error-from-into` · diff 2

Funktio palauttaa `Result<T, MyError>` ja kutsuu std-io funktiota. Miten yhdistät virhetyypit siististi?

- **From/Into + ? — io::Error muuntuu MyError:ksi jos From impl on olemassa** ✓
- unwrap() jokaisessa io-kutsussa
- panic! kaikissa Err-haaroissa
- Box<dyn Error> ainoa tapa

#### `rust-error-option-result-convert` · diff 2

Funktio palauttaa `Option<T>` mutta kutsuja tarvitsee `Result<T, MyError>`. Mikä metodi auttaa?

- **ok_or / ok_or_else — muuntaa None Err:ksi määritellyllä virheellä** ✓
- .unwrap() — Option → Result suoraan
- From<Option<T>> for Result automaattisesti aina
- Option::Err variantti

#### `rust-error-panic-unrecoverable` · diff 2

Milloin `panic!` on perusteltu recoverable-virheen sijaan?

- **Ohjelmarikko / invariantti rikki — tilanne josta ei voi jatk turvallisesti** ✓
- Aina kun tiedosto puuttuu
- Käyttäjän syöttövirhe
- Verkko timeout — aina panic

#### `rust-error-question-mark` · diff 2

Funktio palauttaa `Result<T, E>`. Mitä `?`-operaattori tekee Err-haarassa?

- **Palauttaa virheen aikaisin kutsujalle (early return) propagoiden Err:n** ✓
- Nielaisee virheen ja jatkaa None-arvolla kuten Optionissa
- Muuntaa Err:n automaattisesti poikkeukseksi runtime-hetkellä
- Panikoi aina — sama kuin `.unwrap()`

#### `rust-error-thiserror-anyhow` · diff 3

Kirjastossa palautetaan `anyhow::Result`. Miksi code review vastustaa?

- **anyhow sopii app-kerrokseen — kirjaston API:ssa kutsuja ei voi matchata virhetyyppejä** ✓
- anyhow on aina kielletty Rustissa
- thiserror on vain testeihin
- Box<dyn Error> on ainoa oikea kirjasto-API

#### `rust-error-unwrap-vs-expect` · diff 2

Prototype-koodissa kutsut `.unwrap()` Resultille. Code review mitä suosittelee tuotantoon?

- **Käsittele Err (?, match) tai expect vain invarianteille selkeällä viestillä** ✓
- unwrap on OK tuotannossa jos testit menevät läpi
- catch_unwind korvaa Err-käsittelyn
- unwrap_or_else on aina forbidden

### rust-ownership (8)

#### `rust-ownership-box-heap` · diff 2

Haluat siirtää suuren structin heapille ilman `new`/`delete`-paria. Mikä tyyppi?

- **Box<T> — omistettu heap-allokaatio, vapautuu Drop:lla** ✓
- *mut T — Box korvataan aina raakaosoittimella
- Rc<T> — ainoa tapa heap-allokoida
- Vec<T> — pakollinen yksittäisille olioille

#### `rust-ownership-clone-explicit` · diff 2

Tarvitset kaksi itsenäistä kopioita samasta `Vec<i32>`:stä. Mikä on oikea tapa?

- **vec.clone() — eksplisiittinen syvä kopio Clone-traitin kautta** ✓
- let b = a; — move riittää kahdelle omistajalle
- &a kopioi automaattisesti
- std::copy(a, b) — std-kirjaston memcpy

#### `rust-ownership-copy-trait` · diff 2

Miksi `let b = a;` toimii `i32`:lle mutta ei `String`:lle ilman `.clone()`?

- **i32 toteuttaa Copy-traitin — pienet arvot kopioituvat, String siirtyy (move)** ✓
- Copy on oletus kaikille tyypeille
- String on stack-tyyppi kuten i32
- Kääntäjä kopioi aina heap-tyypit automaattisesti

#### `rust-ownership-drop` · diff 2

Milloin Rust vapauttaa heap-muistin `String`-oliosta automaattisesti?

- **Kun muuttuja poistuu scopesta — Drop-trait ajetaan automaattisesti** ✓
- Vain kun kutsutaan eksplisiittistä `free()`-funktiota
- Taustalla oleva GC skannaa muistin säännöllisesti
- Kun viimeinen `&`-viittaus tuhoutuu — reference counting std:ssä

#### `rust-ownership-move` · diff 1

Funktio ottaa `String`-parametrin arvona. Mitä tapahtuu kutsukohdassa?

- **Omistajuus siirtyy funktioon (move) — alkuperäistä muuttujaa ei voi enää käyttää** ✓
- String kopioituu automaattisesti kuten Java-merkkijonossa
- Kääntäjä luo jaetun viitteen taustalla ilman eksplisiittistä &
- Move tapahtuu vain jos parametri on merkitty `mut`-avainsanalla

#### `rust-ownership-string-str` · diff 1

Funktio ottaa merkkijonon parametriksi mutta ei tarvitse omistaa sitä. Mikä tyyppi on idiomaattisin?

- **&str — lainattu merkkijononäkymä (string slice)** ✓
- String aina — &str on vanhentunut
- char* — C-tyylinen merkkijono Rustissa
- Cow<str> pakollinen kaikissa API:ssa

#### `rust-ownership-vec-push-invalidate` · diff 3

Miksi `let r = &vec[0]; vec.push(1);` voi olla kääntäjävirhe?

- **push voi reallokoida vektorin — r voisi osoittaa invalidiin muistiin** ✓
- Vec ei salli pushia lainauksen aikana koskaan runtime-virheenä
- Indeksointi palauttaa aina kopion — viittaus ok
- Borrow checker ei koske vektoreihin

#### `rust-rc-weak-cycle` · diff 4

Puurakenteessa lapsi pitää `Rc`-viitteen vanhempaansa ja vanhempi `Rc`-viitteet lapsiinsa. Puu ei vapaudu koskaan. Miksi ja mikä korjaa?

- **Rc-viitekehä pitää laskurit nollan yläpuolella — tee vanhempaviitteestä Weak<T>** ✓
- Rc vapautuu vasta ohjelman lopussa — vaihda Box<T>:hen molempiin suuntiin
- Kutsu drop() juurelle käsin, jolloin koko puu vapautuu rekursiivisesti
- Vaihda Arc<T>:hen, jonka atominen laskuri purkaa kehät automaattisesti

### rust-safety (4)

#### `rust-safety-borrow-checker` · diff 2

Mikä Rustin ominaisuus estää data race -virheet käännösaikana ilman roskienkeruuta?

- **Borrow checker — omistajuus- ja lainaussäännöt kääntäjässä** ✓
- Runtime GC skannaa jaetut viittaukset ennen säieajoa
- Kaikki säikeet ajetaan yhdessä prosessissa GIL-lukon alla
- TSan-instrumentointi jokaisessa release-buildissa oletuksena

#### `rust-safety-secret-debug` · diff 3

Struct sisältää API-avaimen ja sille deriveataan Debug. Mikä riski?

- **Debug tulostaa kentät lokeihin — salaisuudet voivat vuotaa tuotannossa** ✓
- Debug on compile-time pois release-buildissa automaattisesti
- derive(Debug) redaktoi automaattisesti salaiset kentät
- Riski vain jos käytät nightly-Rustia

#### `rust-safety-supply-chain` · diff 3

Rust-projekti käyttää 120 cratea. Miten pienennät dependency-riskiä?

- **Commitoi Cargo.lock, minimoi riippuvuudet, cargo audit/deny CI:ssä** ✓
- Rust poistaa supply chain -riskin — crateja ei tarvitse seurata
- Poista Cargo.lock — aina uusimmat versiot tuotannossa
- Lisää default-features kaikkiin crateihin nopeuteen

#### `rust-safety-unsafe-block` · diff 3

Milloin `unsafe`-lohko on perusteltu?

- **Kun kääntäjä ei voi varmistaa turvallisuutta — FFI, raw pointerit, optimointi** ✓
- Aina kun borrow checker valittaa — unsafe ohittaa kaiken
- Performance aina — safe Rust on hidas
- unsafe kielletty tuotannossa

### rust-testing (9)

#### `rust-testing-catch-unwind` · diff 3

Testissä haluat varmistaa panicin ilman #[should_panic] — esim. dynaaminen viesti. Mikä std-API?

- **std::panic::catch_unwind(Closure) — palauttaa Result<R, Box<dyn Any>>** ✓
- std::panic::try_catch — Rust 2024
- panic::Assert trait
- catch_unwind toimii async closureissa aina

#### `rust-testing-dev-dependencies` · diff 2

mockall ja tokio-test dev-testeissä — minne Cargo.toml riippuvuus?

- **[dev-dependencies] — vain testit ja examples, ei release-binaryn mukana** ✓
- [dependencies] aina — dev-deps poistettu
- [test-dependencies] erillinen osio
- [build-dependencies] testeille

#### `rust-testing-doc-tests` · diff 2

Esimerkkikoodi ///-doc-kommentissa pitää pysyä oikeana. Miten ajat doc testit?

- **cargo test — doc testit ajetaan automaattisesti (/// ``` ... ```)** ✓
- cargo doc --test erillinen komento
- Doc testit vain nightlyllä
- /// koodi ei koskaan suoriteta

#### `rust-testing-integration-dir` · diff 2

Haluat testata kirjastoa ulkoisena asiakkaana (public API). Minne integration testit?

- **tests/*.rs projektin juuressa — jokainen tiedosto erillinen crate** ✓
- src/tests/mod.rs — ainoa paikka
- #[integration] attribuutti funktiossa
- tests/ kääntyy osaksi lib.rs:ää suoraan

#### `rust-testing-mock-trait` · diff 3

Haluat korvata HTTP-clientin testissä ilman oikeaa verkkoa. Mikä pattern Rustissa?

- **Trait abstraction + mock (mockall) — injektoi fake-toteutus** ✓
- #[mock] built-in derive std:ssä
- static mut global fake aina
- cfg(test) unreachable! production code

#### `rust-testing-proptest` · diff 4

Haluat generoida satoja satunnaisia syötteitä parserille. Mikä crate sopii property-based -testaukseen?

- **proptest — generoi inputeja ja shrinks failing casea** ✓
- quickcheck — ei Rustissa
- rand::test — std test runner
- cargo fuzz korvaa proptest:in aina

#### `rust-testing-should-panic` · diff 2

Testaat että funktio panikoi virheellisellä syötteellä. Mikä attribuutti?

- **#[should_panic] — testi onnistuu jos funktio panikoi** ✓
- #[expect_panic] — Rust 2024 attribuutti
- #[test(panic)] cargo syntax
- catch_unwind ainoa tapa

#### `rust-testing-slow-sleep` · diff 2

Testi käyttää oikeaa sleepiä ja kestää 30 sekuntia. Miten nopeutat?

- **#[tokio::test(start_paused = true)] + tokio::time::advance — ei oikeaa odotusta** ✓
- Lisää thread::sleep testiin tarkkuuden vuoksi
- Poista testi — hitaat testit eivät kuulu CI:hin
- cargo test --release nopeuttaa sleep-testejä

#### `rust-testing-tokio-test` · diff 2

Testaat async-funktiota joka käyttää tokio::time::sleep. Miten ajat sen testissä?

- **#[tokio::test] async fn ... — luo test-runtime ja sallii .await** ✓
- #[test] async fn — toimii ilman makroa
- block_on testissä aina kielletty
- cargo test --async flag

### rust-tooling (7)

#### `rust-tooling-cargo` · diff 1

Uusi Rust-projekti aloitetaan terminaalissa. Mikä komento luo `Cargo.toml`-projektin?

- **cargo new projektin_nimi — luo binääri- tai kirjastoprojektin** ✓
- rustc --init projektin_nimi — Rustin virallinen projektigeneraattori
- rustup create projektin_nimi — luo projektin toolchain-managerilla
- npm init rust projektin_nimi — Rust tukee npm-workspacea natiivisti

#### `rust-tooling-cargo-features` · diff 3

Haluat valinnaisen JSON-tuen riippuvuudessa ilman pakottamaan kaikille. Miten?

- **Cargo features — [features] default = [] optional json = ["serde_json"]** ✓
- #[cfg(json)] runtime flag only
- Erillinen crate aina
- Cargo.toml ei tue valinnaisia deps

#### `rust-tooling-cargo-test` · diff 1

Miten ajat yksikkötestit Rust-projektissa?

- **cargo test — kääntää ja ajaa #[test]-funktiot ja doc testit** ✓
- rustc --test only
- cargo run --tests
- make test rust standard

#### `rust-tooling-ci-baseline` · diff 2

Mikä on järkevä minimiputki Rust-projektin CI:ssä?

- **fmt --check, clippy -D warnings, test, doc, audit/deny** ✓
- cargo build riittää — testit valinnaisia
- Vain cargo test ilman fmt/clippy
- rustc suoraan ilman Cargoa tuotannossa

#### `rust-tooling-clippy` · diff 2

Code review haluaa automatisoida Rust-tyylivihjeet CI:ssä. Mikä työkalu?

- **cargo clippy — linteri idiomaattisille virheille ja hajuille** ✓
- rustfmt — clippy korvattu
- rustc -Wall
- eslint-plugin-rust

#### `rust-tooling-derive-macro` · diff 2

Mitä `#[derive(Clone, PartialEq)]` tekee käännöksen aikana?

- **Procedural/derive macro generoi trait-toteutukset automaattisesti** ✓
- Runtime-reflection kuten Java
- Kopioi structin binaryn toiseen moduleen
- Vain debug-buildissa

#### `rust-tooling-release-profile` · diff 2

Tuotantobinary on liian hidas debug-buildista. Mikä Cargo-komento?

- **cargo build --release — optimoinnit päälle (opt-level 3)** ✓
- cargo build --fast
- RUSTFLAGS=--O cargo build
- cargo deploy production

### rust-traits (9)

#### `rust-traits-bounds-generic` · diff 3

Geneerinen funktio `fn largest<T>(list: &[T]) -> T` vaatii vertailun. Miten rajaat T:n?

- **where T: PartialOrd — trait bound geneeriselle tyypille** ✓
- T: Sortable — std-trait
- dyn PartialOrd parametri
- Ei rajoituksia — Rust päättelee

#### `rust-traits-default-impl` · diff 2

Trait-metodilla on oletustoteutus. Miten tyyppi käyttää sitä ilman omaa impl:ia?

- **impl Trait for Type {} — tyhjä impl riittää jos metodilla on default body** ✓
- Pakollinen override jokaiselle metodille aina
- default keyword struct-kentässä
- derive(Default) korvaa trait-metodit

#### `rust-traits-definition` · diff 2

Mikä Rustin trait vastaa käytännössä Java-interfacen roolia?

- **trait — jaettu käyttäytymismäärittely impl-lohkoilla** ✓
- abstract class — Rustin perustyypit
- protocol extension Swift-tyyliin natiivisti
- vtable aina compile-time ilman dyn

#### `rust-traits-deref-coercion` · diff 3

Funktio odottaa `&str` mutta saat `&String`. Miksi koodi kääntyy?

- **Deref coercion — String dereferoi &str:ksi automaattisesti** ✓
- String perii str Rustissa
- Implisiittinen clone merkkijonoon
- Kääntäjäbugi

#### `rust-traits-derive-debug` · diff 1

Struct tarvitsee `{:?}`-tulostuksen testeissä. Mitä attribuuttia lisäät struct-määrittelyyn automaattisen Debug-toteutuksen saamiseksi?

- **#[derive(Debug)] struct Foo { ... } — automaattinen Debug-toteutus** ✓
- impl Debug käsin aina pakollinen
- println!("{:?}", foo) toimii ilman Debugia
- #[debug] attribuutti

#### `rust-traits-dispatch-choice` · diff 3

Valitset `impl Trait`, geneerisen parametrin ja `Box<dyn Trait>` välillä. Miten päätät?

- **impl Trait/geneerinen = staattinen dispatch; Box<dyn Trait> = heterogeeninen runtime-lista** ✓
- Box<dyn Trait> on aina nopein — käytä sitä kaikkialla
- impl Trait ja geneerinen T: Trait ovat aina identtisiä
- dyn Trait ei vaadi object safety -tarkistusta

#### `rust-traits-dyn-trait-object` · diff 3

Tarvitset heterogeenisen vektorin eri tyypeistä samalla traitilla. Mikä tyyppi?

- **Vec<Box<dyn Trait>> — trait object dynaamisella dispatchilla** ✓
- Vec<impl Trait> — sallittu heterogeeniselle
- Vec<T> where T: Trait ilman Box
- Any<T> std:ssä

#### `rust-traits-impl-trait-return` · diff 3

Funktio palauttaa eri konkreettisia tyyppejä samasta traitista. Mikä paluutyyppi piilottaa konkreettisen tyypin?

- **impl Trait — staattinen dispatch palautuksessa (opaque return type)** ✓
- concrete struct aina — impl Trait kielletty
- Box<dyn Trait> ainoa tapa
- enum EveryVariant — pakollinen

#### `rust-traits-iterator` · diff 2

Mikä trait mahdollistaa `for item in collection` -silmukan?

- **IntoIterator — for kutsuu into_iter() automaattisesti** ✓
- Iterator aina suoraan for-silmukassa ilman into_iter
- Iterable trait std:ssä
- foreach! makro

### rust-types (8)

#### `rust-types-enum-variants` · diff 2

Mikä enum-malli mallintaa HTTP-vastauksen statuskoodin ja bodyn yhdessä tyypissä?

- **Enum variantit datalla: Ok(String) / Err(StatusCode) — algebraic data type** ✓
- Struct + bool flag — Rustin suositeltu tapa
- Union kuten C — oletus Rustissa
- HashMap<String, Value> aina

#### `rust-types-if-let` · diff 1

`Option`-arvo pitää purkaa vain onnistuneessa tapauksessa ilman turhaa match-haaraa `None`:lle. Mikä pattern syntax on idiomaattisin?

- **if let Some(x) = opt { ... }** ✓
- match opt { Some(x) => ..., None => {} } aina pakollinen
- opt.unwrap() tuotantokoodissa
- if opt.is_some() { opt.unwrap() }

#### `rust-types-match-exhaustive` · diff 2

Miksi `match` enum-arvolla vaatii kaikki variantit käsiteltäväksi?

- **Exhaustive matching — kääntäjä varmistaa ettei varianttia jää käsittelemättä** ✓
- Runtime-default None jos variant puuttuu
- match on vain syntaktinen sokeri if:lle ilman tarkistusta
- Vain Option vaatii exhaustivenessin

#### `rust-types-method-receiver` · diff 2

Metodi muokkaa structia. Mikä receiver on oikea: `self`, `&self` vai `&mut self`?

- **&mut self — eksklusiivinen muokkauslainaus ilman omistajuuden siirtoa** ✓
- self aina — muokkaus vaatii omistajuuden siirron
- &self riittää aina mut-kentille
- mut self ilman & — validi Rust 2021

#### `rust-types-option` · diff 1

Funktio voi palauttaa arvon tai ei mitään. Mikä tyyppi korvaa null-pointerin?

- **Option<T> — Some(arvo) tai None ilman null-osoitinta** ✓
- T? — valinnainen tyyppiparametri kuten TypeScriptissä
- Result<T, ()> — virhetyyppi puuttuville arvoille
- Maybe<T> — standardikirjaston alias Optionille

#### `rust-types-result` · diff 2

Tiedoston avaus voi epäonnistua. Mikä tyyppi mallintaa onnistumisen tai virheen?

- **Result<T, E> — Ok(arvo) tai Err(virhe)** ✓
- Option<T> — Err-koodi piilotetaan None-arvoon
- try/catch — Rust tukee poikkeuksia kuten Javassa
- Either<T, E> — vain kolmannen osapuolen kirjastoissa, ei std:ssä

#### `rust-types-struct-update` · diff 2

Luot uuden struct-instanssin kopioimalla vanhan mutta vaihdat yhden kentän. Mikä syntaksi?

- **Struct update syntax: `User { email: new, ..old }`** ✓
- old.email = new — struct-kentät aina mut oletuksena
- User::clone(&old) ainoa tapa
- memcpy(&old, &new)

#### `rust-types-tuple-struct` · diff 2

Haluat newtype-wrapperin `UserId(u64)` estämään sekoittamasta tavalliseen u64:ään. Miten?

- **Tuple struct: `struct UserId(u64);` — erillinen tyyppi samaan dataan** ✓
- type UserId = u64 — newtype turvallisuus
- const UserId: u64
- #define UserId u64

## scrum (88)

### scrum-dod (11)

#### `b02-scrum-dod-perf-02` · diff 3

Uusi API hidastaa raporttia 10× — tarina 'done' ilman suorituskykytestiä. Miten DoD auttaa?

- **DoD voi sisältää NFR-kriteerit (esim. p95 < 200ms) ennen hyväksyntää** ✓
- Suorituskyky on aina erillinen projekti eikä kuulu Definition of Doneen
- PO hyväksyy aina hidastuksen ilman suorituskykytestiä DoD-prosessissa
- DoD koskee vain unit testejä, ei suorituskykyä tai muita NFR:itä

#### `b02-scrum-dod-rollback-03` · diff 4

Tuotantoon mennyt feature ei täytä DoD:ia — miten tiimi reagoi sprintin jälkeen?

- **Palautetaan backlogiin — tekninen velka korjataan, DoD on minimi laatu** ✓
- Merkitään done koska jo deployattu vaikka DoD-kriteerit puuttuvat
- Piilotetaan bugi ja jatketaan seuraavaan sprinttiin ilman korjausta
- Peru sprintti aina kun feature ei täytä DoD:ia tuotannossa

#### `b09-scrum-dod-documentation` · diff 3

Feature on testattu mutta API-dokumentaatio puuttuu — tiimi haluaa merkitä Done. DoD?

- **Ei Done — DoD määrittää dokumentaation sisällön tiimin sopimuksessa** ✓
- Done jos PO hyväksyy ilman docs — DoD on joustava kiireessä
- Dokumentaatio on erillinen epic — ei kuulu DoD:hen koskaan
- Vain koodi riittää Doneen aina riippumatta tiimin DoD-sopimuksesta

#### `exp-scrum-dod-docs-minimum` · diff 3

Operaatio valittaa puuttuvasta runbookista incidentin jälkeen. Mitä DoD voisi vaatia?

- **Päivitetty operatiivinen dokumentaatio user-visible muutoksille DoD:ssa** ✓
- Vain koodi riittää — docs kirjoitetaan myöhemmin erillisessä sprintissä
- Wiki-artikkeli kerran vuodessa korvaa runbook-päivityksen DoD:ssa
- DoD kieltää dokumentoinnin hidastavana työnä sprintin aikana

#### `exp-scrum-dod-regression-suite` · diff 4

Tuotantoon meni bugi joka olisi kaatunut regressiotestissä. Mitä DoD:iin lisätte?

- **Automaattiset regressiotestit vihreänä ennen Done-merkintää** ✓
- Manuaalinen smoke vain release-viikolla riittää DoD:n testivaatimukseen
- DoD ei koske testausta koska testit ovat erillinen QA-vaihe
- Hotfix-prosessi korvaa DoD:n kun bugi olisi kaatunut regressiotestissä

#### `exp-scrum-dod-security-review` · diff 4

Turvallisuustiimi löysi OWASP-aukko sprintin jälkeen. Miten DoD estää toistumisen?

- **Security checklist / SAST gate osana DoD:ta relevanteille tarinoille** ✓
- Turvallisuus vain erillisessä hardening-sprintissä kerran vuodessa
- DoD koskee vain dokumentaatiota, ei turvallisuustarkistuksia
- Pen test kerran vuodessa riittää korvaamaan DoD-security-kriteerit

#### `scrum-dod-automated-tests` · diff 4

Tiimi debateaa DoD:stä. Mikä kuuluu tyypillisesti moderniin Definition of Done -listaan?

- **Automaattiset testit ajettu ja läpäisty CI:ssä ennen Donea** ✓
- Vain manuaalinen smoke test tuotannossa riittää modernissa DoD-listassa
- Testaus vasta release-haarassa on tyypillinen Definition of Done -kriteeri
- QA testaa vasta seuraavassa sprintissä ja se kuuluu DoD-prosessiin

#### `scrum-dod-no-partial` · diff 3

Sprint review lähestyy. Tarina täyttää 4/5 DoD-kohtaa. Miten Scrum-best-practices käsittelee tilanteen?

- **Ei Done — kaikki DoD-kriteerit täyttyvät tai tarina ei ole valmis** ✓
- 80 % Done riittää velocityyn kun sprint review lähestyy
- Merkitään Done ja korjataan jälkikäteen ilman backlog-merkintää
- PO voi alittaa DoD:n hätätilanteessa ilman tiimin sopimusta

#### `scrum-dod-shippable` · diff 3

Mikä on Definition of Done -listan ydinvaatimus jokaiselle sprintin valmiille tarinalle?

- **Inkrementti on tuotantokelpoinen ja integroitu ennen Done-merkintää** ✓
- Dev on merkinnyt Jiran Done-tilaan ja se riittää Definition of Doneen
- PO on hyväksynyt demossa suullisesti ilman testejä tai integraatiota
- Koodi on pushattu feature-branchiin ja se täyttää DoD-minimivaatimuksen

#### `scrum-dod-team-ownership` · diff 4

Kuka omistaa ja päivittää Definition of Done -listan Scrumissa?

- **Koko Scrum-tiimi yhdessä** ✓
- Vain Scrum Master yksin
- Vain QA-päällikkö
- Ulkoistettu auditointitiimi

#### `scrum-dod-tech-debt` · diff 5

Tekninen velka kasvaa. Miten DoD auttaa hallitsemaan sitä sprinttitasolla?

- **DoD määrittelee minimilaadun — velkaa ei piiloteta Done-merkintään** ✓
- DoD ohitetaan kun deadline lähestyy ja velka kirjataan myöhemmin
- Velka kirjataan erilliseen Done-lite -tilaan joka laskee velocityyn
- DoD koskee vain uutta koodia, ei refaktorointia tai teknistä velkaa

### scrum-dor (18)

#### `b02-scrum-dor-deps-05` · diff 3

Tarina riippuu toisen tiimin API:sta jota ei ole vielä olemassa. DoR-tilanne?

- **Ei Ready — riippuvuus ratkaistava tai mockattava ennen sprint commitmentia** ✓
- Ready koska PO haluaa ottaa tarinan sprinttiin riippuvuudesta huolimatta
- Odota sprintin loppua ja toivo että toisen tiimin API valmistuu
- Aloita koodaus ja toivo riippuvuuden ratkeavan sprintin aikana

#### `b02-scrum-dor-size-06` · diff 2

Backlog-item on 21 story pointia — tiimi ei saa valmiiksi yhdessä sprintissä. Refinement-toimenpide?

- **Pilko pienempiin tarinoihin joiden jokainen tuottaa arvoa erikseen** ✓
- Kasvata sprintin pituutta jotta 21 pisteen tarina mahtuu yhteen sprinttiin
- Jätä isoksi — velocity korjaa automaattisesti kun tarina jää kesken
- Poista acceptance criteria jotta iso tarina mahtuu refinement-kriteereihin

#### `b03-scrum-backlog-refine-spike` · diff 3

Tarina vaatii teknistä selvitystä ennen estimointia — arkkitehtuuri epäselvä. Mitä teette?

- **Spike / tutkimustarinoita refinementiin — aikarajattu oppiminen** ✓
- Arvaatte 13 pistettä ja aloitatte
- Siirrätte backlogin pohjalle ilman selvitystä
- PO arvioi teknisen riskin yksin

#### `b03-scrum-dor-testable` · diff 3

Tarina: 'Paranna suorituskykyä'. Refinementissa puuttuu hyväksymiskriteerit. DoR-korjaus?

- **Määrittele mitattavat kriteerit (esim. p95 < 200 ms) ennen sprinttiin ottoa** ✓
- Ota sprinttiin — kriteerit myöhemmin
- PO hyväksyy ilman kriteereitä
- DoR ei koske epäselviä tarinoita

#### `b03-scrum-tech-debt-backlog` · diff 3

Tekninen velka kasaaantuu — PO sanoo 'ei aikaa'. Miten tuot backlogiin?

- **Nimeä velka näkyviksi backlog-tarinoiksi kustannuksineen — PO priorisoi** ✓
- Piilota velka branchiin ilman tarinaa
- Kehittäjät korjaavat salaa ylitöinä
- Velka ei kuulu Scrumiin

#### `b04-scrum-backlog-refinement-ongoing` · diff 3

Sprint Planning venyy koska tarinat eivät ole valmiita. Milloin backlog-refinement pitäisi tapahtua?

- **Jatkuvasti sprintin aikana — ei vain planning-viikolla** ✓
- Vain kerran vuodessa
- Vain Scrum Masterin lomalla
- Refinement kielletty — kaikki planningissa

#### `b04-scrum-dor-acceptance-clear` · diff 3

Tarina siirtyy sprinttiin ilman hyväksymiskriteereitä. Mid-sprint väittelyt: 'onko valmis?'. Miten estät?

- **Definition of Ready vaatii selkeät acceptance criteria ennen sprinttiin ottoa** ✓
- Kysytään PO:lta joka commit jälkeen
- Hyväksymiskriteerit kirjoitetaan release:n jälkeen
- Valmius = developer sanoo valmis

#### `b04-scrum-pbi-invest` · diff 3

Backlog item on liian suuri sprinttiin: epäselvä, ei testattavissa. Refinementissa mitä tarkistatte?

- **INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable** ✓
- Vain arvio story pointeissa riittää
- Jaetaan aina 13 pisteeseen
- Odotetaan sprintin alkua

#### `b04-scrum-refinement-backlog-order` · diff 3

Product Backlog on sekava — tiimi ei tiedä mitä refinenoida seuraavaksi. Kuka priorisoi backlog-järjestyksen?

- **Product Owner — tiimi auttaa selkeyttämään, mutta prioriteetti on PO:lla** ✓
- Scrum Master yksin
- Kehittäjä jolla eniten avoimia tikettejä
- Aakkosjärjestys reiluuden vuoksi

#### `b07-scrum-dor-design` · diff 4

Sprint alkaa — arkkitehtuurisia avoimia kysymyksiä on vielä kolme. Pitäisikö tarina ollut sprintissä?

- **Ei — DoR vaatii riittävän ymmärryksen ennen sprinttiin ottoa** ✓
- Kyllä — sprintissä ratkaistaan kaikki avoimet arkkitehtuurikysymykset
- Arkkitehtuuri ei kuulu DoR:ään — vain acceptance criteria
- PO päättää ohittaa DoR:n kun deadline on lähellä sprintissä

#### `b07-scrum-dor-sized` · diff 3

Epic otetaan suoraan sprinttiin ilman pilkkomista. Mitä DoR vaatii ennen sprinttiin ottamista?

- **Tarina riittävän pieni arvioitavaksi ja toteutettavaksi yhdessä sprintissä** ✓
- Epic on aina sprint-valmis kun PO on sen hyväksynyt backlogissa
- DoR ei koske kokoa — vain hyväksymiskriteerit merkitsee
- Vain PO arvioi koon sprintin jälkeen velocity-trendin perusteella

#### `b09-scrum-dor-size-limit` · diff 3

Tarinan arvio on 21 story pointia — tiimi epäilee liian suurta sprinttiin. DoR-ratkaisu?

- **Pilko tarina pienemmiksi — jokainen täyttää DoR:n ennen sprinttiin ottoa** ✓
- Ota sprinttiin ja jaa kahdelle kehittäjälle ilman pilkkomista
- Story pointit eivät vaikuta DoR:ään — vain AC ja prioriteetti
- Kasvata sprintin pituus neljään viikkoon isoille tarinoille

#### `b09-scrum-dor-ux-mockup` · diff 2

UI-tarinassa kehittäjät arvailevat layoutia. Mikä DoR-elementti puuttuu?

- **Mockup, wireframe tai selkeä UX-kuvaus hyväksymiskriteereineen** ✓
- Vain backend API-dokumentaatio riittää UI-tarinoissa DoR:lle
- Story point riittää UI-tarinoissa kun tarina on backlogissa
- Kehittäjä suunnittelee UX:n sprintin aikana ilman ennakko-viitettä

#### `exp-scrum-dor-acceptance-tests` · diff 3

Tarinalla on otsikko mutta ei hyväksymiskriteereitä. Sprint planningissa mitä teette?

- **Ei sprinttiin — DoR vaatii selkeät acceptance criteria ennen aloitusta** ✓
- Aloitetaan koodaus — kriteerit kirjoitetaan myöhemmin sprintin aikana
- PO kirjoittaa kriteerit sprintin jälkeen ennen seuraavaa reviewta
- QA arvailee kriteerit tuotannossa kun tarinalla on vain otsikko

#### `exp-scrum-dor-refinement-timebox` · diff 3

Backlog refinement syö 30 % sprintin kapasiteetista. Mitä best practice suosittelee?

- **Timeboxaa refinement ~10 % kapasiteetista ja valmistele seuraava sprint** ✓
- Lopeta refinement — kaikki tehdään sprint planningissa ilman valmistelua
- Refinement vain kerran vuodessa riittää DoR-valmiuden ylläpitoon
- Vain PO tekee refinementin yksin ilman kehittäjien osallistumista

#### `exp-scrum-dor-split-story` · diff 3

Backlog refinementissa tarina on 21 pistettä ja epäselvä. Mitä DoR-best practice sanoo?

- **Pilko tarina pienempiin ennen sprinttiin ottoa kun se on liian iso** ✓
- Ota sprinttiin — suurempi tarina on tehokkaampi kuin pilkottu työ
- Poista estimointi kokonaan kun tarina on 21 pistettä ja epäselvä
- Siirrä seuraavaan quarteriin ilman pilkkomista DoR-best practicen mukaan

#### `scrum-dor-criteria` · diff 3

Mikä kuuluu Definition of Ready -kriteereihin ennen kuin tarina otetaan sprinttiin?

- **Hyväksymiskriteerit ja arvioitavissa oleva koko ennen sprinttiin ottoa** ✓
- Kaikki tuotantodata migroitu ennen kuin tarina merkitään Ready-tilaan
- Koko epic toteutettu ennen yksittäisen tarinan ottamista sprinttiin
- Release note julkaistu ennen backlog refinement -istuntoa tarinalle

#### `scrum-story-split` · diff 4

Epic on liian iso estimointiin. Mikä pilkkomistapa leikkaa **liiketoiminta-kerroksia** pystysuunnassa?

- **Vertical split — läpi kerrosten end-to-end arvon tuottamiseksi** ✓
- Vain UI ensin; API, integraatiot ja deploy jätetään seuraaviin sprinteihin
- Kaikki edge caset samaan tarinaan nopeuttaa epic-pilkkomista ja estimointia
- Spike korvaa acceptance criteria kun epic pilkotaan pystysuunnassa valmiiksi

### scrum-estimation (12)

#### `b02-scrum-estimation-anchor-08` · diff 3

Planning pokerissa kaikki kortit eri — keskustelu pysähtyy. Facilitointi-jatko?

- **Kysy ääripäiden perustelut — uusi kierros kunnes konsensus saavutetaan** ✓
- Ota keskiarvo automaattisesti kun planning poker -kortit eroavat
- PO päättää yksin lopullisen numeron kun keskustelu pysähtyy
- Ohita tarina estimoinnista jos konsensusta ei synny heti

#### `b03-scrum-velocity-forecast` · diff 4

Johto käyttää velocityä henkilökohtaiseen suorituskykyyn. Mikä on oikea käyttö?

- **Tiimitason ennuste seuraaville sprinteille — ei yksilövertailuun** ✓
- Velocity määrittää bonukset
- Velocity pitää kasvattaa joka sprintti
- Velocity korvaa sprint goalin

#### `b04-scrum-poker-consensus` · diff 2

Planning Pokerissa arviot hajallaan 2 ja 13 välillä. Mitä teette seuraavaksi?

- **Keskustelitte eroista — suurin ja pienin perustelevat, uusi kierros** ✓
- Otetaan keskiarvo automaattisesti
- Scrum Master päättää luvun
- Hylätään tarina ikuisesti

#### `b04-scrum-velocity-not-commitment` · diff 3

Johto vaatii kiinteän story point -lupauksen seuraavalle kvartaalille velocityn perusteella. Mikä on oikea vastaus?

- **Velocity on historiallinen mittari, ei sitova lupaus — epävarmuus tunnustetaan** ✓
- Velocity on sopimus jota ei saa rikkoa
- Tuplaa velocity tavoitteeksi
- Lopeta story pointit — käytä tunteja

#### `b06-scrum-estimation-relative` · diff 3

Manageri vaatii story pointien muunnosta tunteihin raportointia. Miksi tämä on riski?

- **Story pointit ovat suhteellisia — tuntimuunnos vääristää ennustetta** ✓
- Story point = tunti Scrum Guidessa kaikissa tiimeissä
- Velocity on lupaus stakeholderille joka release-syklin alussa
- Suhteellinen arvio ei skaalaa isossa enterprise-projektissa

#### `b07-scrum-estimation-spikes` · diff 4

Tuntematon integraatio — tiimi arvioi 13 story pointia arvalla. Miten vähennät epävarmuutta ennen sprinttiä?

- **Spike refinementissa — rajattu aika epävarmuuden selvittämiseen** ✓
- Arvioi aina 21 pointtia kun integraatio on tuntematon tiimille
- Skip estimointi ja ota suoraan sprinttiin — katsotaan tulos
- Ota suoraan sprinttiin ja spike tehdään vasta retroissa

#### `b08-scrum-velocity-trend` · diff 3

Johto vertaa tiimien velocityä suorituskykymittarina. Miksi se on riskialtista?

- **Velocity on suunnitteluavustin — vertailu vääristää estimointia** ✓
- Velocity on virallinen HR-mittari tuottavuuden vertailuun tiimien välillä
- Korkein velocity tarkoittaa parasta tiimiä aina ilman kontekstia
- Velocity mitataan tunteina jotta johto voi asettaa deadlineja

#### `b09-scrum-tshirt-sizing` · diff 2

Backlogissa on satoja karkeita ideoita — tarkka story point -arvo tuntuisi turhalta. Menetelmä?

- **T-shirt sizing (S/M/L) — karkea suhteellinen estimointi refinementissa** ✓
- Kaikki 1 point — yksinkertaisuus riittää satojen ideoiden backlogissa
- Ohita estimointi kokonaan kun idea on vielä epäselvä backlogissa
- Vain tuntiarvio jokaiselle karkealle idealle ennen refinementia

#### `b09-scrum-velocity-fluctuation` · diff 3

Velocity putosi 40 % yhden kehittäjän loman jälkeen. Miten tulkitset trendiä?

- **Velocity on indikaattori — kapasiteetti vaihtelee, ei kiinteä lupaus** ✓
- Tiimi laiskottelee — vaadi sama velocity kuin ennen lomaa heti
- Velocity on bugi estimoinnissa — poista story pointit kokonaan
- Lasketaan velocity tunteina johdolle kun se putoaa yhdessä sprintissä

#### `exp-scrum-estimation-no-hours` · diff 2

Projektipäällikkö vaatii story pointien muuntamista tunteihin raporttia varten. Mitä best practice suosittelee?

- **Story pointit ovat suhteellisia — älä käytä tunteja sprintin sisällä** ✓
- 1 point = 8 tuntia aina kun projektipäällikkö vaatii raporttia
- Estimointi tapahtuu vain tunneissa koska se on Scrum-best practice
- Velocity on sama kuin capacity tunneissa tiimin sprint-suunnittelussa

#### `scrum-planning-poker` · diff 4

Miksi planning poker toimii paremmin kuin yhden henkilön arvio?

- **Piilotetut arviot ja cross-functional asiantuntijat vähentävät vinoumaa** ✓
- PO arvioi aina yksin nopeammin kuin koko tiimi planning pokerissa
- Story pointit muuttuvat absoluuttisiksi tunneiksi kun pokerissa konsensus
- Subtaskien tunnit korvaavat tarinan arvon estimoinnissa paremmin kuin pokeri

#### `scrum-velocity-range` · diff 5

Kun vain 2 sprinttiä on mitattu, mikä velocity-varianssi on realistinen (low/high kerroin)?

- **Noin 0.8 – 1.25 historiadatasta** ✓
- Täsmälleen 1.0 aina
- 0.3 – 3.0 on normaalia
- Velocity mitataan vain ensimmäisestä sprintistä lopullisena

### scrum-sprint (30)

#### `b02-scrum-sprint-daily-11` · diff 2

Daily kestää 45 minuuttia statusraportteja managerille. Miten Scrum Master korjaa?

- **Palauta 15 min timebox — kehittäjät synkkaavat työtä, ei raportoi ylöspäin** ✓
- Peru daily kokonaan
- Kirjoita status sähköpostiin
- Lisää agenda-slideja

#### `b02-scrum-sprint-goal-10` · diff 2

Sprintin aikana tiimi keskittyy yksittäisiin taskeihin ilman yhteistä suuntaa. Mikä Scrum-elementti puuttuu?

- **Sprint Goal — yhteinen tavoite joka ohjaa valintoja sprintin aikana** ✓
- Daily agenda PO:lta korvaa sprint goalin kun tiimi keskittyy taskeihin
- Gantt-kaavio on Scrum-elementti joka antaa yhteisen suunnan sprintille
- Henkilökohtaiset OKR:t riittävät korvaamaan sprint goalin tiimissä

#### `b02-scrum-sprint-review-12` · diff 3

Sprint Review on vain PowerPoint — demo puuttuu. Mitä Scrum Guide odottaa?

- **Toimiva increment esitellään stakeholderille — feedback backlogiin** ✓
- Vain metrics review
- PO esittää yksin
- Review = retro

#### `b03-scrum-empirical-inspect-adapt` · diff 3

Tuote ei löydä product-market fitiä — tiimi jatkaa sprintejä ilman suuntaa. Empiirinen periaate?

- **Inspect & adapt jokaisessa eventissä — muuta suuntaa datan perusteella** ✓
- Lukitse roadmap vuodeksi etukäteen
- Lopeta Scrum ja siirry waterfalliin
- Nopeuta sprinttejä 1 päivään

#### `b03-scrum-events-timebox-review` · diff 2

Sprint Review venyy kolmeen tuntiin — sidosryhmät väsyvät. Timebox?

- **Enintään 4 h kuukausittaiselle sprintille — skaalaa sprintin pituuden mukaan** ✓
- Review saa kestää rajattomasti
- 15 min kuten daily
- Review poistetaan — demo Slackissa

#### `b04-scrum-retro-action-items` · diff 3

Retrospektiivin jälkeen samat ongelmat toistuvat sprint toisensa jälkeen. Mikä puuttuu?

- **Konkreettiset parannustoimenpiteet omistajineen seuraavaan sprintiin** ✓
- Enemmän post-it-lappuja
- Retrospektiivin peruminen
- Vain Scrum Master puhuu

#### `b04-scrum-sprint-goal-one` · diff 2

Sprintille valitaan viisi erillistä tavoitetta eri stakeholderille. Mikä on Scrumin suositus sprint goaliin?

- **Yksi yhteinen sprint goal joka ohjaa tiimiä — tarinat tukevat sitä** ✓
- Yksi goal per kehittäjä
- Goal valinnainen jos backlog on täynnä
- Goal kirjoitetaan vasta sprintin jälkeen

#### `b05-scrum-backlog-order` · diff 3

Product Backlog on sekava — tiimi ei tiedä seuraavaa prioriteettia. Kenen vastuulla järjestys?

- **Product Owner — vastaa backlogin sisällöstä ja priorisoinnista** ✓
- Kehittäjä joka on vapaa ensin
- Scrum Master priorisoi teknisen velan mukaan
- Prioriteetti on aina FIFO — vanhin ensin

#### `b05-scrum-daily-timebox` · diff 2

Daily Scrum venyy 45 minuuttiin tekniseen keskusteluun. Mitä Scrum Guide sanoo tapahtuman tarkoituksesta?

- **15 min aikataulu — tiimi synkronoi edistymisen sprint goalia kohti** ✓
- Daily on sprintin ainoa suunnittelutapahtuma
- Scrum Master raportoi johdolle dailyssa
- Daily korvaa sprint reviewn

#### `b05-scrum-increment-demo` · diff 2

Stakeholder kysyy Sprint Reviewissa: 'Onko tämä valmis tuotantoon?' Mitä increment tarkoittaa?

- **DoD:n läpäissyt lisäarvo — mahdollisesti releasattavissa** ✓
- Kaikki merge branchit riippumatta testeistä ja CI-tilasta
- Sprintissä suunnitellut mutta vielä keskeneräiset featuret
- Dokumentaatio ja slidet ilman toimivaa ohjelmistotuotetta

#### `b05-scrum-planning-capacity` · diff 3

Sprint Planningissa tiimi ottaa liikaa työtä — lomat ja tuki unohtuvat. Mikä on oikea lähestymistapa?

- **Tiimi arvioi kapasiteettinsa ja valitsee backlog-itemit sprint goalin pohjalta** ✓
- PO valitsee kaikki korkeimman prioriteetin itemit riippumatta kapasiteetista
- Velocity edellisestä sprintistä on ehdoton lupaus
- Lasketaan story pointit tunteina

#### `b05-scrum-retro-action` · diff 3

Retrospektiivi venyy tunniksi valituksiin eikä synny selkeitä parannuksia. Mikä on järkevin muutos?

- **Timebox + 1–3 konkreettista action itemia seuraavaan sprinttiin** ✓
- Poista timebox — kaikkien pitää saada puhua loppuun
- Korvaa retro sähköpostikyselyllä
- Vain negatiiviset asiat listataan — positiivinen palaute kielletty

#### `b06-scrum-empirical-process` · diff 2

Tiimi pitää sprintin aikana retrospektiivin ja muuttaa työtapaa. Mikä Scrum-periaate tämä ilmentää?

- **Empirismi — inspect ja adapt todellisen edistymisen perusteella** ✓
- Waterfall — muutokset vain release-vaiheessa hyväksytään
- Command and control — johto määrää parannukset tiimille
- Retrospektiivi on valinnainen jos velocity kasvaa sprintissä

#### `b06-scrum-openness-blockers` · diff 2

Kehittäjä piilottaa impedimentin viikon — sprint goal vaarantuu. Mikä Scrum-value auttaa?

- **Openness — blokkerit nostetaan early dailyssa** ✓
- Focus — työskentele hiljaa blokkerin kanssa
- Courage — yksin ratkaise ilman tiimiä
- Commitment — blokkeri ei kuulu Scrumiin

#### `b07-scrum-daily-devs-only` · diff 2

PO ja Scrum Master osallistuvat Daily Scrumiin. Kuka on tapahtuman omistaja?

- **Developers — Daily on heidän tapahtumansa sprint goalin edistykseen** ✓
- Scrum Master johtaa dailyn ja jakaa tehtävät kehittäjille
- PO raportoi johdolle dailyssa sprintin edistymisestä
- Stakeholderit omistavat dailyn ja seuraavat teknistä työtä

#### `b07-scrum-sprint-cancel` · diff 4

Markkinatilanne muuttui — PO haluaa keskeyttää sprintin kesken. Mitä Scrum Guide sanoo?

- **Vain PO voi peruuttaa sprintin jos Sprint Goal menettää merkityksen** ✓
- Scrum Master peruuttaa yksin kun markkinatilanne muuttuu
- Sprinttiä ei voi keskeyttää koskaan kun se on kerran alkanut
- Tiimi äänestää sprintin peruutuksesta dailyssa enemmistöllä

#### `b07-scrum-sprint-length` · diff 2

Johdon raportti vaatii sprintin pituudeksi aina kaksi viikkoa. Miten Scrum suhtautuu?

- **Sprint enintään kuukausi — tiimi valitsee sopivan pituuden** ✓
- Kaksi viikkoa on pakollinen Scrumissa kaikille tiimeille
- Sprint voi olla kuukausia kun backlog on iso ja monimutkainen
- PO päättää yksin sprintin pituuden ilman tiimin inputia

#### `b08-scrum-po-delegation` · diff 3

PO on lomalla kaksi viikkoa — backlog jää päivittämättä. Miten Scrum suhtautuu delegointiin?

- **PO voi delegoida mutta säilyttää vastuun — nimeä selkeä edustaja** ✓
- Scrum Master korvaa PO:n automaattisesti loman aikana backlogissa
- Backlog jäädyttetään PO:n loman ajaksi — ei päivityksiä sallita
- Tiimi priorisoi itse ilman PO:ta kun edustajaa ei ole nimetty

#### `b08-scrum-sprint-goal-change` · diff 3

Kesken sprintin PO haluaa vaihtaa sprint goalin kokonaan uuteen featureen. Miten Scrum Guide suhtautuu?

- **Goal ei vaihdu kevyesti — neuvottele tiimi, peru sprint tarvittaessa** ✓
- PO voi vaihtaa goalin milloin tahansa ilman tiimin syytä sprintissä
- Sprint goal on vain dokumentaatio — ei sitova sprintin aikana
- Scrum Master päättää uuden goalin yksin kun PO on lomalla

#### `b09-scrum-daily-blocker` · diff 2

Dailyssa kehittäjä kertoo esteen joka estää sprint goalin. Mitä tapahtuu daily:n jälkeen?

- **Estävä asia kirjataan — SM/tiimi poistaa impedimentin daily:n ulkopuolella** ✓
- Daily venyy kunnes tekninen ongelma on korjattu paikan päällä
- Estettä ei mainita dailyssa — vain valmistuneet tehtävät raportoidaan
- PO korjaa teknisen esteen itse koska omistaa sprint goalin

#### `b09-scrum-review-feedback` · diff 3

Sprint Reviewssa stakeholder ehdottaa uutta featurea suoraan kehittäjälle. Oikea prosessi?

- **Palaute Product Backlogiin — PO priorisoi, tiimi arvioi planningissa** ✓
- Kehittäjä aloittaa featuren heti seuraavana päivänä ilman PO:ta
- Scrum Master kirjoittaa tarinan ja lisää sen suoraan sprintille
- Stakeholder lisää itemin suoraan Jiraan ohittaen backlog-prosessin

#### `b09-scrum-scope-creep-mid` · diff 3

Kesken sprintin lisätään 'pieni' muutos joka kasvattaa työmäärää 30 %. Miten toimit?

- **Neuvottele PO:n kanssa — poista vastaavaa tai muuta sprint scopea** ✓
- Hyväksy hiljaa — tiimi tekee ylitöitä ilman scope-keskustelua
- Lisää automaattisesti seuraavaan sprinttiin ilman PO:n arviointia
- Scope creep on normaalia — ei toimenpiteitä tarvita sprintissä

#### `exp-scrum-sprint-cancel` · diff 4

Markkinatilanne muuttuu — nykyinen sprint goal on merkityksetön. Kuka voi peruuttaa sprintin?

- **Vain Product Owner ennen ajan umpeutumista voi peruuttaa sprintin** ✓
- Kuka tahansa kehittäjä dailyssa voi peruuttaa sprintin tarvittaessa
- Scrum Master yksin päättää sprintin peruutuksesta markkinamuutoksessa
- Sprinttiä ei voi koskaan peruuttaa kun se on kerran alkanut

#### `exp-scrum-sprint-daily-focus` · diff 2

Daily kestää 45 minuuttia ja muuttuu debug-sessioksi. Miten SM ohjaa takaisin?

- **15 min plan sprint goalia kohti — yksityiskohtainen debug erikseen** ✓
- Peru daily kokonaan kun se muuttuu liian usein debug-sessioksi
- Kaikki avaavat laptoppinsa ja koodaavat dailyssa ratkaistakseen ongelmat
- Daily korvataan viikoittaisella statusraportilla PO:lta tiimin sijaan

#### `exp-scrum-sprint-review-stakeholders` · diff 2

Sprint Review -tapahtumaan kutsutaan sidosryhmiä. Mikä on tapahtuman ydin?

- **Inspect increment ja adaptoi backlog yhteistyössä sidosryhmien kanssa** ✓
- Statusraportti johdolle PowerPointilla on Sprint Review -tapahtuman ydin
- Yksittäisten kehittäjien suoritusarviointi kuuluu Sprint Review -agendaan
- Retrospektiivi tuotannosta korvaa incrementin tarkastelun sidosryhmille

#### `exp-scrum-sprint-scope-add` · diff 3

Sprintin puolivälissä tuoteomistaja tuo kriittisen lisätarinan. Mitä Scrum Guide suosittelee?

- **Tiimi neuvottelee vaikutuksen sprint goaliin yhteisymmärryksellä** ✓
- PO voi lisätä tarinoita yksin milloin tahansa sprintin aikana ilman keskustelua
- Hylätään aina — sprint scope on lukittu eikä koskaan muutu kesken sprintin
- Lisätään automaattisesti ilman arviointia kun tarina on merkitty kriittiseksi

#### `scrum-dod-partial` · diff 4

Sprintin lopussa tarina on "99 % valmis" mutta QA ei ole hyväksynyt. Mitä Scrum-best-practices sanoo story pointeista?

- **Älä laske osittaisia pisteitä — tarina ei ole Done** ✓
- Lasketaan 0.9 × story pointit
- Merkitään Done jos dev sanoo "works for me"
- Siirretään pisteet seuraavaan sprinttiin automaattisesti

#### `scrum-multitask` · diff 4

Sprintin aikana paine kasvaa. Mitä priorisointiohjetta kannattaa noudattaa?

- **Vältä multitasking — korkea riski/arvo ensin sprintin aikana** ✓
- Aloita helpoista low/low tehtävistä kun sprintin paine kasvaa
- Kaikki WIP rajatta samanaikaisesti parantaa flow'ta sprintin loppupuolella
- Uudet interruptit aina edelle koska ne ovat usein tärkeämpiä kuin goal

#### `scrum-retro` · diff 3

Mikä ceremonia on usein tärkein jatkuvaan parantamiseen?

- **Retrospektiivi — miten tiimi työskentelee ja parantaa prosessia** ✓
- Daily ilman action itemeitä on tärkein jatkuvan parantamisen ceremonia
- Vain sprint review asiakkaille korvaa prosessin parantamisen tarpeen
- Kick-off kerran vuodessa riittää korvaamaan säännöllisen retrospektiivin

#### `scrum-sprint-goal` · diff 3

Mikä on Sprint Goalin rooli sprintin aikana?

- **Antaa fokuksen ja joustaa scopeen kun esteitä tulee** ✓
- Korvaa product backlogin kokonaan
- On sama kuin yksittäisen tarinan acceptance criteria
- Määritellään vasta sprint reviewssa

### scrum-team (17)

#### `b02-scrum-team-cross-14` · diff 3

Tiimissä vain yksi henkilö osaa deployata — bottleneck joka sprintti. Scrum-ratkaisu?

- **Cross-functional tiimi jakaa taidot — kuka tahansa voi edistää incrementtiä** ✓
- Palkkaa erillinen deploy-tiimi
- Odota specialistia aina
- Piilota deploy-taidot

#### `b02-scrum-team-sm-13` · diff 2

Scrum Master assignaa tehtäviä kehittäjille sprintin alussa. Mikä roolirikkomus?

- **SM facilitoi — tiimi itseorganisoituu työn jakoon** ✓
- SM on tech lead
- SM omistaa backlogin
- SM hyväksyy DoD:n yksin

#### `b03-scrum-artifacts-transparency` · diff 2

Product Backlog on jaettu kolmessa eri työkalussa — kukaan ei näe kokonaiskuvaa. Scrum-arvo?

- **Transparency — yksi totuuden lähde backlogille sidosryhmille** ✓
- Piilotettu backlog nopeuttaa kehitystä
- Vain PO näkee backlogin
- Artefaktit ovat valinnaisia

#### `b03-scrum-sm-servant-leader` · diff 3

Scrum Master antaa päivittäin tehtävälistoja kehittäjille. Roolivirhe?

- **SM fasilitoi ja poistaa impedimentteja — ei delegoi tehtäviä** ✓
- SM on projektipäällikkö
- SM omistaa tekniset päätökset
- SM raportoi johdolle sprintin edistymisestä

#### `b03-scrum-team-stable-membership` · diff 2

Johto kiertää kehittäjiä projektien välillä viikoittain. Miksi Scrum Master vastustaa?

- **Vakaa tiimi rakentaa velocityä ja luottamusta — jatkuva vaihto hidastaa** ✓
- Scrum vaatii 20 hengen tiimin
- Kehittäjiä ei saa koskaan siirtää
- Vain PO:n pitää pysyä vakaana

#### `b04-scrum-cross-functional-delivery` · diff 3

Tiimi viimeistelee koodin mutta increment jää testaamatta ja dokumentoimatta. Täyttääkö se DoD:ia?

- **Ei — cross-functional tiimi toimittaa valmiin incrementin DoD:n mukaan** ✓
- Kyllä jos koodi compiloituu
- Testaus on erillisen QA-tiimin vastuulla aina
- DoD koskee vain PO:ta

#### `b04-scrum-sm-facilitator` · diff 2

Scrum Master alkaa jakaa teknisiä tehtäviä kehittäjille dailyssa. Onko tämä Scrum Masterin rooli?

- **Ei — SM fasilitoi Scrumia ja poistaa impedimenttejä, ei hallitse teknistä työnjakoa** ✓
- Kyllä — SM on tiimin tekninen johtaja
- SM päättää kuka koodaa mitäkin
- Vain PO saa puhua dailyssa

#### `b05-scrum-dev-ownership` · diff 2

Projektipäällikkö jakaa tehtävät yksittäisille kehittäjille dailyssa. Onko tämä Scrumia?

- **Ei — Developers itseorganisoituvat työn sprint goalin alla** ✓
- Kyllä — PL delegoi jokaisen tehtävän dailyssa kehittäjille
- Kyllä — Scrum Master jakaa tehtävät ja seuraa progressia
- Kyllä — PO määrittää kuka tekee minkä tehtävän sprintissä

#### `b06-scrum-po-stakeholder` · diff 2

Stakeholder pyytää featurea suoraan kehittäjältä ohittamalla backlog. Kenen kanssa käsitellä?

- **Product Owner — yksi kanava backlog-muutoksille ja prioriteeteille** ✓
- Kehittäjä toteuttaa pyynnön jos on vapaa kapasiteettia
- Scrum Master priorisoi pyynnöt ja lisää ne backlogiin
- CEO:n pyyntö menee suoraan sprintille ohittaen backlog-prosessin

#### `b06-scrum-scrum-master-coaching` · diff 3

Tiimi pyytää Scrum Masteria ratkaista tekninen arkkitehtuurikiista. Mitä SM tekee?

- **Fasilitoi keskustelu — tiimi ratkaisee, SM coachaa prosessia** ✓
- Valitsee arkkitehtuuriratkaisun itse koska on kokenut SM
- Eskaloi aina johtoon ilman tiimin keskustelua ensin
- Kirjoittaa teknisen ratkaisun backlog-itemin acceptance criteriaan

#### `b08-scrum-sm-impediment` · diff 2

Build-palvelin on ollut alhaalla kolme päivää — tiimi odottaa passiivisesti. Mikä on SM:n rooli?

- **Poistaa impedimentin tai eskaloi — SM palvelee tiimiä aktiivisesti** ✓
- SM korjaa build-palvelimen itse aina ilman eskalointia
- Impedimentit eivät kuulu Scrumiin — tiimi hoitaa estot yksin
- Odota seuraavaan retroon — estot käsitellään vain siellä

#### `b08-scrum-team-self-organizing` · diff 2

Projektipäällikkö jakaa tehtävät kehittäjille yksitellen joka aamu. Mikä Scrum-periaate rikkoutuu?

- **Tiimi on itseorganisoituva — kehittäjät päättävät miten työ tehdään** ✓
- Scrum Master jakaa tehtävät kehittäjille joka aamu dailyssa
- PO delegoi tekniset tehtävät ja seuraa jokaisen devin progressia
- Ulkoisen PM:n ohjaus on pakollinen Scrum-tiimissä enterprise:ssä

#### `b09-scrum-scrum-of-scrums` · diff 3

Viisi Scrum-tiimiä työskentelee samassa tuotteessa — riippuvuudet aiheuttavat viiveitä. Koordinaatio?

- **Scrum of Scrums — edustajat synkronoivat riippuvuudet ja estot** ✓
- Yksi mega-sprint kaikille tiimeille ilman erillisiä sprint goaleja
- PO koordinoi kaikkien tiimien dailyt yhdessä isossa huoneessa
- Ei koordinaatiota — tiimit ovat täysin itsenäisiä ilman synkkiä

#### `exp-scrum-team-po-authority` · diff 2

Kehittäjä haluaa priorisoida oman teknisen refaktoroinnin tuoteomistajan yli. Mikä rooli päättää backlog-järjestyksestä?

- **Product Owner — maximizes product value ja omistaa backlog-prioriteetin** ✓
- Tech lead yksin päättää backlog-järjestyksestä refaktoroinnin yli
- Scrum Master määrittää mitä tehdään seuraavaksi sprintissä
- Eniten senior kehittäjä priorisoi backlogin tuoteomistajan sijasta

#### `exp-scrum-team-sm-impediment` · diff 3

CI-putki on ollut punaisena kolme päivää ja hidastaa koko tiimiä. Scrum Masterin ensimmäinen tehtävä?

- **Poista impedimentti tai escaloi — SM palvelee tiimiä esteiden poistossa** ✓
- Kirjoita uudet user storyt kun CI-putki on punaisena kolme päivää
- Määritä sprint goal PO:n sijasta kun CI estää koko tiimin etenemisen
- Odota että kehittäjä korjaa CI:n vapaa-ajallaan ilman eskalointia

#### `scrum-team-cross-functional` · diff 3

Mitä tarkoittaa että Scrum-tiimi on cross-functional?

- **Tiimillä on kaikki taidot tuottaa valmis inkrementti ilman ulkoisia käsiä** ✓
- Jokainen dev osaa kaikkia kieliä ja teknologioita cross-functional-tiimissä
- Tiimi raportoi usealle esimiehelle ja se tekee tiimistä cross-functional
- Eri tiimit hoitavat dev/test/deploy erikseen ja se on Scrum-malli

#### `scrum-team-size` · diff 3

Mikä on suositeltu Scrum-tiimin koko (devit) ennen koordinaatio-ongelmia?

- **Noin 7 ± 2 — yli 9 kasvattaa koordinaatiokuormaa merkittävästi** ✓
- Aina täsmälleen 15 kehittäjää on Scrum Guiden suositus dev-tiimille
- Mitä enemmän kehittäjiä sitä parempi velocity ilman koordinaatiokustannusta
- 2–3 riittää enterprise-projektiin koska Scrum skaalautuu pienillä tiimeillä

## security (37)

### sec-api (6)

#### `prod-sec-idempotency` · diff 4

POST /api/charge Idempotency-Key: abc123 — sama pyyntö lähetetään kahdesti verkko-ongelman takia. Miksi avain on tärkeä?

- **Estää saman toiminnon toistumisen — tallenna key tenant-kohtaisesti ja palauta sama tulos toistopyynnölle** ✓
- Idempotency key salaa maksukortin — PCI-vaatimus
- Key korvaa JWT:n — autentikointi tapahtuu headerissa
- Vain GET-pyynnöt voivat olla idempotentteja — POST ei

#### `prod-sec-idor-bola` · diff 4

GET /api/invoices/12345 — käyttäjä vaihtaa URL:ssa ID:n 12346 ja näkee toisen asiakkaan laskun. Kirjautuminen tarkistetaan, omistajuutta ei. Mikä haavoittuvuus?

- **IDOR / BOLA — objektikohtainen valtuutus puuttuu; tarkista omistajuus jokaisessa endpointissa** ✓
- CSRF — selain lähetti evästeen väärään pyyntöön ilman tokenia
- SQL injection — invoice_id interpoloidaan kyselyyn ilman parametreja
- JWT exp puuttuu — token on vanhentunut mutta hyväksytään silti

#### `prod-sec-mass-assignment` · diff 4

PATCH /api/users/me — backend tekee Object.assign(user, req.body) ja save(). Body sisältää displayName, role: admin ja isEmailVerified: true. Mikä riski?

- **Mass assignment / overposting — hyväksy vain whitelistatut kentät, erota input-DTO domain-mallista** ✓
- CSRF — PATCH ei vaadi CSRF-tokenia kun käytetään Bearer-tokenia
- Race condition — kaksi PATCH-pyyntöä ylikirjoittaa toisensa ilman lukitusta
- JSON parsing error — liian suuri body kaataa parserin

#### `prod-sec-rate-limiting` · diff 3

Login käyttää Argon2id:tä, mutta hyökkääjä yrittää miljoonia salasanoja eri IP:istä. Mitä hashingin lisäksi tarvitaan?

- **Rate limit IP:llä ja käyttäjätunnuksella, lockout, MFA, credential stuffing -havainto ja yhtenäinen virheilmoitus** ✓
- Vaihda MD5:een — nopeampi hash nopeuttaa kirjautumista
- Poista salasanakenttä — OAuth2 on ainoa turvallinen tapa
- Captcha jokaisella sivulatauksella riittää — ei tarvita kirjautumiskohtaista rajaa

#### `prod-sec-ssrf` · diff 4

POST /api/fetch-preview hakee käyttäjän antaman URL:n. Hyökkääjä antaa http://169.254.169.254/latest/meta-data/. Mikä riski?

- **SSRF — palvelin tekee pyynnön sisäverkkoon; estä private IP:t, metadata ja käytä allowlistaa** ✓
- XSS — metadata-vastaus renderöidään escapetoimattomana selaimessa
- DNS rebinding on ainoa riski — HTTP-redirect riittää estämään hyökkäyksen
- CORS estää selaimen lukemasta metadata-vastausta — SSRF ei ole mahdollinen

#### `prod-sec-webhook-signature` · diff 4

POST /webhooks/payment — backend luottaa bodyyn { invoiceId, paid: true } ilman allekirjoituksen tarkistusta. Mikä puuttuu?

- **Webhookin aitous allekirjoituksella — raw body, timestamp/replay-ikkuna ja idempotentti käsittely** ✓
- IP-allowlist maksupalvelun osoitteista riittää — body on aina luotettava
- HTTPS riittää — TLS salaa ja todentaa lähettäjän
- JSON schema validointi korvaa allekirjoituksen

### sec-auth (8)

#### `prod-sec-account-enumeration` · diff 3

Login palauttaa 'User not found' mutta väärällä salasanalla 'Invalid password'. Mikä riski?

- **Account enumeration — käytä samaa ulkoista virheilmoitusta: sähköposti tai salasana virheellinen** ✓
- Ei riskiä — käyttäjätunnus on julkista tietoa joka tapauksessa
- Captcha login-sivulla estää enumerationin täysin
- Palauta HTTP 404 vain olemattomille käyttäjille — selkeämpi UX

#### `prod-sec-authn-authz` · diff 3

DELETE /api/users/:id — endpoint tarkistaa JWT:n ja löytää käyttäjän, mutta ei tarkista saako tämä käyttäjä poistaa kohdetta. Miksi JWT ei riitä?

- **Autentikaatio kertoo kuka — valtuutus kertoo mitä saa tehdä; tarkista rooli, omistajuus tai policy** ✓
- JWT pitää vaihtaa opaque session-tokeniin — JWT ei tue DELETE-metodia
- DELETE vaatii aina admin-roolin globaalisti — muut metodit eivät
- CORS estää DELETE:n selaimesta — palvelin ei tarvitse authz-tarkistusta

#### `prod-sec-jwt-claims` · diff 4

API hyväksyy JWT:n tarkistamatta `exp`- ja `aud`-kenttiä. Mikä riski?

- **Vanhentunut tai väärälle aud:lle myönnetty token voidaan hyväksyä edelleen** ✓
- JWT vanhenee automaattisesti ilman palvelimen exp-tarkistusta kuitenkin
- aud-claim on dokumentaatiota — allekirjoituksen tarkistus riittää autentikointiin
- exp-validointi tapahtuu automaattisesti selaimessa ennen API-kutsua

#### `prod-sec-mfa-recovery` · diff 4

MFA: TOTP-secret tallennetaan plaintextinä ja recovery-koodit näytetään uudelleen asetuksissa. Mitä korjaat?

- **Salaa TOTP levossa, näytä recovery-koodit kerran, tallenna hashattuina ja vaadi re-auth herkkiin muutoksiin** ✓
- Poista MFA — liian monimutkainen ylläpitää turvallisesti
- Lähetä TOTP SMS:llä — helpompi kuin authenticator-sovellus
- Tallenna secret base64:na — se on salattu muoto

#### `prod-sec-password-reset` · diff 4

Reset-linkki: /reset?token=123456 — 6-numeroinen token, voimassa 24 h. Mikä ongelma?

- **Liian pieni token-avaruus, liian pitkä voimassaolo — käytä kryptografista tokenia, hash tallennuksessa, kertakäyttö** ✓
- Token URL:ssa on ok — HTTPS salaa query-parametrin
- 24 h on liian lyhyt — käyttäjät eivät ehdi resetoida
- 6 numeroa riittää kun rate limit on päällä

#### `prod-sec-rbac-abac` · diff 5

Globaali role == admin ei skaalaudu: projektin omistaja saa poistaa projektinsa, org-admin vain oman organisaationsa projektit. Mikä lähestymistapa?

- **Resurssikohtainen policy — canDeleteProject(user, project) riippuu käyttäjästä, resurssista ja tenantista** ✓
- Lisää rooli super-admin joka voi kaiken — yksinkertaisin ratkaisu
- Tallenna rooli JWT:hen — se riittää kaikkiin päätöksiin
- Poista poisto-oikeus kaikilta — soft delete riittää

#### `sec-jwt-alg-confusion` · diff 4

JWT-kirjasto hyväksyy tokenin otsikossa ilmoitetun algoritmin sellaisenaan. Hyökkääjä lähettää tokenin, jossa `alg` on `none` tai RS256:n sijaan HS256. Mikä korjaus?

- **Kiinnitä sallitut algoritmit palvelimella — älä luota tokenin alg-kenttään** ✓
- Tarkista, ettei tokenin alg-kenttä ole tyhjä, ja hyväksy muut arvot
- Pidennä allekirjoitusavainta, jolloin algoritmin vaihto ei onnistu
- Salaa koko token JWE:llä, jolloin alg-kenttää ei voi muuttaa

#### `sec-session-fixation` · diff 4

Sovellus käyttää kirjautumisen jälkeen samaa session-id:tä kuin ennen kirjautumista. Hyökkääjä voi asettaa uhrille tuntemansa id:n. Mikä korjaus?

- **Luo uusi session-id kirjautumisen yhteydessä ja mitätöi vanha** ✓
- Pidennä session-id:tä, jolloin hyökkääjä ei pysty arvaamaan sitä
- Salaa session-id cookiessa, jolloin hyökkääjän asettama arvo ei kelpaa
- Siirrä session-id cookiesta URL-parametriksi, jotta se näkyy lokeissa

### sec-data (4)

#### `prod-sec-data-minimization` · diff 3

Analytiikka lähettää email, fullName, page, IP ja userAgent. Mitä security/privacy-reviewissa kysyt?

- **Tarvitaanko henkilötietoa, pseudonyymi userId, säilytysaika, pääsy, kolmannet osapuolet ja poistopyyntö** ✓
- Lisää kaikki mahdolliset kentät — enemmän dataa parempi analytiikka
- IP on anonymisoitu automaattisesti — ei tarvitse miettiä
- GDPR ei koske analytiikkaa — vain rekisteröityjä käyttäjiä

#### `prod-sec-password-hash` · diff 4

Salasanat tallennetaan SHA-256-hasheina ilman suolaa. Mikä parempi ratkaisu?

- **bcrypt tai argon2 suolalla ja work factorilla hidastaa brute force -hyökkäyksiä** ✓
- MD5 on nopeampi — riittää kun salasanoissa vähintään 12 merkin minimipituus
- Base64-koodaus riittää kun tietokanta on suojattu HTTPS-yhteyden takana
- Yhteinen pepper-avain kaikille salasanoille yksinkertaistaa vertailulogiikkaa

#### `prod-sec-secret-management` · diff 4

Tuotannon Stripe-avain on kovakoodattu: const stripeKey = 'sk_live_...'. Mitä teet?

- **Poista reposta, kierrätä avain heti, käytä secret manageria ja rajaa avaimen oikeudet** ✓
- Siirrä .env-tiedostoon ja commitoi .env.example — avain on turvassa
- Base64-koodaa avain — se ei näy grepissä
- Odota seuraavaan sprinttiin — kierto voidaan tehdä myöhemmin

#### `prod-sec-sensitive-logging` · diff 4

Virhetilanteessa logger.error({ body: req.body, headers: req.headers }). Mikä riski?

- **Lokeihin voi päätyä Authorization, cookiet, salasanat ja henkilötiedot — redaktoi ja älä loggaa raakaa bodyä** ✓
- Structured logging on aina turvallista — JSON-muoto suojaa arkaluonteiset kentät
- Vain tuotannon lokit ovat riski — dev-ympäristön lokit voi jättää täyteen
- Log level error riittää — debug-lokit eivät sisällä arkaluonteista dataa

### sec-design (7)

#### `prod-sec-dev-config-leak` · diff 4

Stagingissä on DEBUG=true, CORS=* ja testikäyttäjä admin/admin. Mikä riski?

- **Dev-oletukset jaetussa ympäristössä — turvalliset oletukset, erillinen config ja deploy-tarkistukset** ✓
- Staging on vain testiä, joten debug ja CORS=* eivät haittaa
- HTTPS riittää suojaamaan stagingin vaikka DEBUG olisi päällä
- Testitunnus on ok, kunhan salasana vaihdetaan kerran kuussa

#### `prod-sec-fail-closed` · diff 4

Policy service timeouttaa. API ei saa vastausta siitä, onko käyttäjällä oikeus nähdä raportti. Päästetäänkö pyyntö läpi?

- **Fail closed — jos oikeutta ei voida varmistaa, pyyntö estetään** ✓
- Fail open — käyttökokemus on tärkeämpi, päästetään läpi ja logitetaan
- Cachetaan viimeisin tunnettu päätös ikuisesti — nopeuttaa vastausta
- Palautetaan 200 tyhjällä raportilla — ei paljasteta oikeuksia

#### `prod-sec-frontend-authz` · diff 3

Admin-nappi piilotetaan frontendissä, mutta API ei tarkista admin-oikeutta. Mikä meni pieleen?

- **Frontend ei ole turvaraja — kaikki valtuutus pitää tarkistaa palvelimella** ✓
- CSS display:none riittää estämään admin-toiminnon
- Riittää tarkistaa rooli frontend-routerissa ennen sivun renderöintiä
- API voi luottaa siihen, että vain admin näkee napin

#### `prod-sec-least-privilege-db` · diff 4

Backend käyttää tietokantaan superuser-tunnusta. Mikä riski?

- **Sovellusmurtuma antaa liian laajat DB-oikeudet — käytä rajattua runtime-käyttäjää** ✓
- Superuser on ok, koska vain backend yhdistää tietokantaan
- Salataan connection string — se riittää suojaamaan tietokannan
- Riittää käyttää read-only superuseria kaikissa endpointeissa

#### `prod-sec-supply-chain` · diff 4

package.json: "some-lib": "^1.2.0" — CI asentaa ilman lockfileä. Mikä riski?

- **Build ei ole toistettava — uusi transitiivinen dependency voi tulla sisään; käytä lockfileä ja npm ci** ✓
- Caret (^) estää major-päivitykset — versio on aina turvallinen
- npm install on deterministinen — sama package.json tuottaa aina saman puun
- Supply chain riski on vain Docker-imagessa — npm ei liity

#### `prod-sec-tenant-isolation` · diff 5

POST /api/reports ottaa tenant_id:n request bodysta. Raportti cachetetaan avaimella `report:last-month`. Admin (acme) pyytää tenant_id: other-company. Mikä meni pieleen?

- **Tenant ei saa tulla luotettuna käyttäjän syötteestä — johda sessiosta/tokenista ja tarkista jäsenyys** ✓
- Raportti pitää generoida asynkronisesti — synkroninen endpoint on DoS-riski
- POST pitää olla GET — idempotentti metodi estää väärän tenantin
- Admin-rooli riittää — globaali admin saa lukea kaikkien tenantien datan

#### `prod-sec-threat-modeling` · diff 4

Uusi ominaisuus: käyttäjä voi jakaa yksityisen raportin linkillä. Mitä uhkia mietit ennen toteutusta?

- **Arvaamaton token, voimassaoloaika, peruutus, Referer/lokit, edelleenjako ja audit — insecure design** ✓
- Vain XSS — linkki renderöidään HTML:ssä
- Riittää tarkistaa että linkki on HTTPS — salausta ei voi murtaa
- Rate limit riittää — brute force estää tokenin arvaamisen

### sec-input (5)

#### `prod-sec-file-upload` · diff 4

Profiilikuvan upload tarkistaa vain if filename.endswith('.jpg'). Mikä riski?

- **Pääte ei todista sisältöä — tarkista magic bytes, rajoita koko, uudelleenkoodaa kuva, älä suorita tiedostoa** ✓
- JPEG on aina turvallinen — binäärimuoto ei voi sisältää koodia
- Riittää tallentaa uploads/-kansioon — webrootin ulkopuolella ei ole riskiä
- Base64-enkoodaus ennen tallennusta poistaa haittaohjelman

#### `prod-sec-path-traversal` · diff 3

GET /download?file=report.pdf — backend: sendFile('/var/app/files/' + req.query.file). Hyökkääjä antaa ../../../../etc/passwd. Mikä riski?

- **Path traversal — käytä tiedosto-ID:tä, normalisoi polku ja varmista että se pysyy base-hakemistossa** ✓
- Directory listing — palvelin listaa kansion sisällön automaattisesti
- Symlink attack vaatii root-oikeudet — ei koske tavallista käyttäjää
- URL-encoding riittää — %2e%2e estää pisteet automaattisesti

#### `prod-sec-shell-injection` · diff 4

Sovellus ajaa `os.system("convert " + user_filename)` ilman validointia. Hyökkääjä syöttää `file.png; rm -rf /`. Mikä korjaus?

- **Älä käytä shelliä — subprocess argumenttilistana tai kirjasto joka ei interpoloi shelliin** ✓
- Escapaa lainausmerkit riittää — shell käsittelee puolipisteet turvallisesti
- Aja root-oikeuksin vain luotettaville käyttäjille
- Base64-koodaa filename ennen shell-komentoa

#### `prod-sec-sql-sort-injection` · diff 4

GET /api/users?sort=name — koodi: db.query(`SELECT * FROM users ORDER BY ${req.query.sort}`). Miksi prepared statement ei yksin auta?

- **Sarakkeen nimeä tai SQL-avainsanaa ei voi parametrisoida — käytä whitelistaa sallituille sort-kentille** ✓
- Prepared statement toimii vain INSERT-kyselyissä, ei SELECT ORDER BY:ssä
- sort-parametri pitää URL-enkoodata — se estää injectionin automaattisesti
- ORDER BY pitää poistaa — pagination riittää turvallisuuteen

#### `prod-sec-unsafe-deserialization` · diff 5

API ottaa base64-kentän ja tekee pickle.loads(base64decode(input)). Miksi vaarallista?

- **Epäluotettavaa dataa ei saa deserialisoida formaattiin joka voi suorittaa koodia — käytä JSON + skeemavalidointi** ✓
- Base64 on salausta — pickle purkaa sen turvallisesti
- pickle on turvallinen kun input tulee HTTPS:n yli
- Vain XML-deserialisointi on riski — pickle on Pythonin sisäinen formaatti

### web-security (7)

#### `prod-sec-cache-control` · diff 3

Palkkakuitin PDF: Cache-Control: public, max-age=86400. Mikä riski?

- **Yksityinen data voi päätyä jaettuun välimuistiin — käytä Cache-Control: no-store tai private tarpeen mukaan** ✓
- public nopeuttaa latausta — PDF on staattinen joten se on ok
- max-age=86400 on liian lyhyt — käyttäjä joutuu lataamaan uudelleen
- Vain selaimen cache — CDN ei koskaan tallenna public-responssia

#### `prod-sec-cors` · diff 4

API palauttaa Access-Control-Allow-Origin: * ja Access-Control-Allow-Credentials: true. Mikä ongelma?

- **CORS ei ole palvelinpuolen authz — credentials + villi origin on vaarallinen; salli vain tunnetut originit** ✓
- CORS estää curl-pyynnöt — API on turvallinen vain selaimesta
- Wildcard origin nopeuttaa kehitystä — tuotannossa sama on ok
- CSRF-token korvaa CORS-headerit kokonaan

#### `prod-sec-csrf` · diff 4

Selain lähettää session-cookien automaattisesti myös haitalliselta sivulta tulevaan POST-pyyntöön. Mikä suoja?

- **CSRF-token validointi tai SameSite-cookie rajoittaa cross-site POST-pyyntöjä** ✓
- CORS-header riittää estämään automaattiset evästepohjaiset lomake-POSTit
- HTTPS-salaus kanavalla eliminoi cross-site-pyyntöjen istunnon kaappaamisen
- Piilota lomake CSS:llä estääksesi näkyvät väärinkäytetyt lomake-submit-napit

#### `prod-sec-open-redirect` · diff 3

Login ohjaa: /login?next=https://evil.example/phish. Mikä riski ja korjaus?

- **Open redirect — salli vain suhteelliset sisäiset polut tai allowlistatut domainit** ✓
- HTTPS kohde on turvallinen — phishing ei toimi salatulla sivulla
- next-parametri on ok kun se on URL-enkoodattu
- CORS estää ulkoiseen domainiin ohjauksen

#### `prod-sec-security-headers` · diff 3

Kirjautuneille käyttäjille palautetaan HTML-sivuja ilman turva-headereita. Mitä lisäisit ensimmäisenä?

- **CSP, X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy ja HSTS tuotannon HTTPS:ään** ✓
- X-Powered-By: Express — kertoo käytetyn frameworkin debuggausta varten
- Cache-Control: public — nopeuttaa sivujen latausta
- Access-Control-Allow-Origin: * — sallii kaikki originit

#### `prod-sec-tls-verify-off` · diff 3

Kehittäjä lisää `curl -k` tai `verify=False` korjatakseen TLS-virheen. Mikä riski?

- **Man-in-the-middle voi siepata tai muuttaa liikennettä — sertifikaattia ei validoida** ✓
- TLS-salaus poistuu kokonaan — liikenne menee plaintextinä
- Vain self-signed sertifikaatit toimivat — CA-varmennetut eivät
- verify=False vaikuttaa vain kehitysympäristöön, ei tuotantoon

#### `prod-sec-xss` · diff 3

Käyttäjän kommentti renderöidään HTML:ään ilman escapetusta. Mikä riski?

- **XSS: escapetoimaton käyttäjädata voi injektoida skriptiä uhrin selaimessa** ✓
- SQL injection kommenttikentässä kun HTML renderöidään ilman suodatinta
- CSRF hyökkäys rajoittuu GET-pyyntöihin ilman csrf-tokenia lomakkeessa
- Deadlock syntyy kun HTML-parser lukitsee tietokantayhteyden renderöinnin ajaksi

## space (64)

### space-applications (10)

#### `space-app-accuracy-classes` · diff 2

Mikä on tyypillinen suuruusluokka kuluttaja-SPP:n, SBAS/DGPS:n ja RTK fixedin vaakatarkkuudelle hyvissä oloissa?

- **SPP metrit; SBAS/DGPS sub-metri…metri; RTK fixed sentit** ✓
- Kaikki kolme ovat millimetreissä ilman antennia
- SPP sentit, RTK vain metrit
- SBAS on aina tarkempi kuin RTK fixed

#### `space-app-antenna-pco` · diff 4

Miksi tarkkuus-GNSS:ssä antennin phase center (PCO/PCV) pitää tuntea?

- **Mittaus viittaa sähköiseen vaihekeskukseen, ei välttämättä antennin fyysiseen pohjaan — mm–cm virhe muuten** ✓
- Phase center vaikuttaa vain NMEA-baudinopeuteen
- PCO tarvitaan ainoastaan Web Mercator -muunnokseen
- Phase center korvaa kokonaan geoidimallin

#### `space-app-assisted` · diff 2

Mitä A-GNSS (assisted GNSS) tyypillisesti tuo vastaanottimelle?

- **Apudata verkosta: aika, karkea paikka, almanakka/efemeridi — TTFF lyhenee** ✓
- Korvaa satelliittisignaalit kokonaan tukiasemilla
- Muuttaa karttaprojektion automaattisesti TM35FIN:iksi
- Kalibroi geoidimallin kentällä ilman mittausta

#### `space-app-elevation-mask` · diff 2

Miksi GNSS-vastaanottimissa käytetään elevaatiomaskia (esim. 10–15°)?

- **Matalan elevaation satelliiteilla on enemmän ilmakehä- ja multipath-virheitä** ✓
- Matalat satelliitit eivät lähetä efemeridiä lainkaan
- Elevaatiomaski muuttaa WGS84-parametreja
- Maski tarvitaan vain NMEA-checksumia varten

#### `space-app-igs` · diff 3

Mikä on IGS:n rooli tarkkuus-GNSS:ssä?

- **International GNSS Service tuottaa tarkkoja ratoja, kelloja ja muita tuotteita tieteelle ja PPP:lle** ✓
- IGS operoi ainoastaan EGNOS-GEO-satelliitteja
- IGS on NMEA-lauseiden valmistajaliitto
- IGS määrittelee vain Web Mercator -tiilikoon

#### `space-app-indoor-limit` · diff 1

Miksi tavallinen GNSS toimii heikosti syvällä sisätiloissa?

- **L-kaistan signaali vaimenee seinissä ja katoissa — suora näkyvyys satelliitteihin puuttuu** ✓
- WGS84-ellipsoidi ei ulotu rakennusten sisälle
- NMEA-protokolla kieltää sisätilakoordinaatit
- Atomikellot sammuvat automaattisesti sisätiloissa

#### `space-app-jamming` · diff 3

Mikä on GNSS-jammingin ja spoofingin ero?

- **Jamming tukkii signaalin häiriöllä; spoofing syöttää väärennettyjä GNSS-signaaleja harhauttamaan vastaanotinta** ✓
- Ne tarkoittavat täysin samaa RF-ilmiötä
- Jamming muuttaa vain geoidia, spoofing ellipsoidia
- Spoofing on mahdollista vain GEO-radoilla

#### `space-app-rtcm` · diff 3

Mikä on RTCM-korjausviesti GNSS:ssä?

- **Standardimuotoinen binääriviesti differentiaalisiin/RTK-korjauksiin tukiasemalta roverille** ✓
- Karttalehden rasteriformaatti
- Vain JSON-muotoinen GeoJSON-vaihtoehto
- Galileon avoimen palvelun salaus

#### `space-app-time-gps-utc` · diff 3

Mikä ero on GPS-ajan ja UTC:n välillä?

- **GPS-aika on jatkuva (ei karkaussekunteja); UTC:hen nähden on kokonaislukupoikkeama leap seconds** ✓
- GPS-aika ja UTC ovat aina identtiset nanosekuntiin
- UTC seuraa vain Galileo-konstellaatiota
- GPS-aika resetoituu joka keskiyö paikallisesti

#### `space-app-ttff` · diff 2

Mitä tarkoittaa TTFF GNSS-vastaanottimessa?

- **Time To First Fix — aika ensimmäiseen kelvolliseen paikkaratkaisuun käynnistyksen jälkeen** ✓
- Total Tropospheric Free Factor — tropoviiveen kerroin
- Tracked Triple Frequency Format — RINEX-versio
- Terrain To Flat Factor — projektion mittakaava

### space-datums (11)

#### `space-datum-ecef` · diff 2

Mitkä ovat ECEF-koordinaatit?

- **Maakeskiset suorakulmaiset X, Y, Z -koordinaatit, jotka pyörivät maan mukana** ✓
- Paikallinen tangenttitaso itä-pohjoinen-up (ENU) aina
- Vain pikseleitä Web Mercator -tiilissä
- Satelliitin Kepler-elementit a, e, i

#### `space-datum-ellipsoid` · diff 2

Mikä on referenssiellipsoidi geodesiassa?

- **Pyörähdysellipsoidi, joka approksimoi maan muotoa koordinaattilaskentaa varten** ✓
- Maan todellinen toppografinen pinta kaikkine vuorineen
- Vain merenpinnan hetkellinen aaltoilu
- Satelliitin aurinkopaneelin muoto

#### `space-datum-enu` · diff 3

Mihin ENU-koordinaatistoa käytetään GNSS-/inertiasovelluksissa?

- **Paikalliseen itä-pohjoinen-ylös -kehikkoon suhteelliseen liikkeeseen ja visualisointiin** ✓
- Globaalin ellipsoidin ainoa virallinen datumi
- NMEA-lauseiden pakollinen esitysmuoto
- GEO-satelliittien rataelementtien standardi

#### `space-datum-etrs89` · diff 3

Miksi Suomessa virallisessa paikkatiedossa käytetään usein ETRS89:ää eikä suoraan 'raakaa' WGS84-hetkeä?

- **ETRS89 on Eurooppaan kiinnitetty datumi (EUREF), joka ei ajaudu laattojen mukana kuten ITRF/WGS84-epochit** ✓
- ETRS89 käyttää täysin erilaista palloa ilman ellipsoidia
- WGS84 on kielletty kaikissa GPS-vastaanottimissa EU:ssa
- ETRS89 on vain NMEA-lauseen aliasnimi

#### `space-datum-geoid` · diff 2

Mikä on geoidi?

- **Maan painovoimakentän ekvipotentiaalipinta, joka vastaa ihanteellista merenpintaa** ✓
- GPS-satelliittien muodostama verkko
- UTM-vyöhykkeen keskimeridiaani
- NMEA GGA-lauseen checksum-kenttä

#### `space-datum-grs80` · diff 3

Miten GRS80 liittyy WGS84-ellipsoidiin?

- **Ne ovat lähes identtisiä; ETRS89 käyttää GRS80:ää, WGS84-ellipsoidi on käytännössä sama metritasolla** ✓
- GRS80 on LEO-rata, WGS84 on GEO-rata
- GRS80 korvaa GNSS-signaalit Euroopassa
- GRS80 ja WGS84 eroavat satoja kilometrejä akseleissa

#### `space-datum-itrf` · diff 4

Mikä on ITRF geodesiassa?

- **International Terrestrial Reference Frame — globaali, ajan myötä päivittyvä maakiinnitteinen referenssikehys** ✓
- Vain Suomen kunnan rajapyykkirekisteri
- Galileon salattu PRS-avainmateriaali
- NMEA 2000 -väylän pinostandardi

#### `space-datum-orthometric` · diff 3

Mikä ero on ellipsoidikorkeudella h ja ortometrisella korkeudella H?

- **h mitataan ellipsoidista, H geoidista (≈ merenpinta); muunnos tarvitsee undulaation N** ✓
- Ne ovat aina numeerisesti samat WGS84:ssä
- H on aina satelliitin kiertokorkeus
- h sisältää vain DOP-korjauksen

#### `space-datum-undulation` · diff 3

Mitä geoidiundulaatio N tarkoittaa?

- **Geoidin korkeus ellipsoidin yläpuolella (tai alapuolella) — silta h:n ja H:n välillä** ✓
- Satelliitin elevaatiokulma horisontista
- UTM-mittakaavakerroin keskimeridiaanilla
- DOP-luvun käänteisluku

#### `space-datum-wgs84` · diff 2

Mikä on WGS84?

- **GPS:n käyttämä maailmanlaajuinen geodeettinen datumi ja ellipsoidi (EPSG:4326 maantieteellisenä)** ✓
- Vain Suomen vanha KKJ-kaista 3
- EGNOS-satelliitin PRN-numero
- RINEX-tiedoston pakkausalgoritmi

#### `space-datum-wgs84-params` · diff 3

Mihin WGS84-ellipsoidin parametreja a (puolisuuri akseli) ja f (litistyneisyys) tarvitaan?

- **Ne määrittävät ellipsoidin koon ja muodon — tarvitaan ECEF-muunnoksiin** ✓
- Ne kertovat geoidin korkeuden merenpinnasta jokaisessa pisteessä
- Ne ovat GPS-satelliittien ratakorkeus ja inklinaatio
- Ne ovat UTM-projektion vyöhykenumero ja mittakaavakerroin

### space-gnss (8)

#### `space-gnss-almanac-ephemeris` · diff 3

Mikä ero on almanakalla ja efemeridillä GNSS:ssä?

- **Almanakka on karkea koko konstellaation rata; efemeridi on tarkan satelliitin rata- ja kellodata** ✓
- Almanakka on tarkempi kuin efemeridi
- Efemeridi sisältää vain karttaprojektion parametrit
- Molemmat tarkoittavat samaa NMEA-lausetta

#### `space-gnss-beidou` · diff 2

Mikä on BeiDou?

- **Kiinan globaali GNSS-järjestelmä (BDS), jossa on myös GEO/IGSO-satelliitteja alueelliseen peittoon** ✓
- Japanin QZSS-järjestelmän toinen nimi
- Intian NavIC-järjestelmän sotilasversio
- Vain EGNOS-korjausdatan toimittaja

#### `space-gnss-galileo` · diff 2

Mikä on Galileo-järjestelmä?

- **Euroopan unionin ja ESA:n siviilijohtoinen globaali GNSS** ✓
- NASA:n Kuuhun tarkoitettu paikannusverkko
- Vain Suomen Maanmittauslaitoksen korjauspalvelu
- Pelkästään merenkulun AIS-järjestelmä

#### `space-gnss-glonass` · diff 2

Mikä erottaa klassisen GLONASS-signaalin GPS:stä taajuuksien jaon suhteen?

- **Klassinen GLONASS käytti FDMA:ta (eri taajuus per satelliitti); GPS käyttää CDMA:ta** ✓
- GLONASS ei lähetä lainkaan koodia, vain kantoaaltoa
- GLONASS toimii vain GEO-radalla
- GLONASS käyttää pelkästään Wi-Fi-taajuuksia

#### `space-gnss-gps-operator` · diff 1

Kuka operoi GPS-järjestelmää?

- **Yhdysvallat (Space Force / DoD) — siviilisignaali avoin maailmanlaajuisesti** ✓
- Euroopan unioni ja ESA yhdessä
- Venäjän Roscosmos yksin
- YK:n ITU suoraan

#### `space-gnss-qzss-navic` · diff 3

Mitä yhteistä on QZSS:llä ja NavIC:lla verrattuna GPS:ään?

- **Ne ovat alueellisia (RNSS) järjestelmiä, eivät täysin globaaleja konstellaatioita** ✓
- Ne korvaavat WGS84:n omilla ellipsoidillaan kaikkialla
- Ne toimivat vain veden alla
- Ne ovat pelkkiä karttaprojektioita ilman satelliitteja

#### `space-gnss-sbas-egnos` · diff 3

Mikä on EGNOS?

- **Euroopan SBAS — geostationaariset satelliitit lähettävät GPS-korjauksia ja eheysinformaatiota** ✓
- Galileon sotilassignaalin salausavain
- Suomen kansallinen tasokoordinaatisto
- NMEA-lauseiden vanhentunut dialekti

#### `space-gnss-vs-gps` · diff 1

Mikä on ero GPS:n ja GNSS:n välillä?

- **GPS on yksi Yhdysvaltojen järjestelmä; GNSS on yleisnimi kaikille satelliittipaikannusjärjestelmille** ✓
- GPS ja GNSS ovat synonyymejä ilman eroa
- GNSS on vain Euroopan Galileo-järjestelmän lyhenne
- GPS sisältää kaikki järjestelmät, GNSS vain sotilaskäytön

### space-maps (8)

#### `space-map-epsg` · diff 2

Mikä on EPSG-koodi paikkatiedossa?

- **Yksikäsitteinen tunniste koordinaattijärjestelmälle (CRS), esim. 4326 = WGS84 lon/lat** ✓
- Satelliitin PRN-numero konstellaatiossa
- RTCM-viestin tyyppinumero
- Vain kuvatiedoston DPI-asetus

#### `space-map-kkj` · diff 3

Mikä on KKJ Suomen paikkatiedon historiassa?

- **Vanha kansallinen kartastokoordinaattijärjestelmä; nykyään siirrytty ETRS89/TM35FIN-järjestelmiin** ✓
- Uusi Galileo-palvelu vuodesta 2024
- GNSS-vastaanottimen tehdasasetus maailmanlaajuisesti
- Geoidimallin ainoa globaali standardi

#### `space-map-mercator-property` · diff 2

Minkä ominaisuuden klassinen Mercator-projektio säilyttää?

- **Kulmat (konformisuus) — siksi se sopii navigointiin loxodrome-kursseilla** ✓
- Kaikki pinta-alat tarkasti kaikkialla
- Kaikki etäisyydet globaalisti ilman mittakaavaa
- Geoidiundulaation N suoraan

#### `space-map-projection` · diff 2

Miksi karttaprojektioita tarvitaan?

- **Ellipsoidin 3D-pinta pitää kuvata 2D-tasolle — jokin ominaisuus (kulma, pinta-ala, matka) vääristyy aina** ✓
- Projektio poistaa ionosfäärivirheet GNSS-signaalista
- Projektio synkronoi atomikellot automaattisesti
- Ilman projektiota satelliitit eivät näy vastaanottimelle

#### `space-map-scale-factor` · diff 3

Mitä tarkoittaa UTM/TM-projektion mittakaavakerroin 0,9996 keskimeridiaanilla?

- **Tasomatkat ovat hieman lyhyempiä kuin ellipsoidimatkat keskimeridiaanilla — kompromissi vyöhykkeen reunoille** ✓
- GPS-pseudomatkat kerrotaan aina 0,9996:lla
- Geoidi on 0,9996 kertaa ellipsoidi
- NMEA-korkeus skaalataan 0,9996:lla

#### `space-map-tm35fin` · diff 2

Mikä on ETRS-TM35FIN (EPSG:3067)?

- **Suomen virallinen tasokoordinaatisto: ETRS89 + TM-projektio vyöhykkeellä 35** ✓
- WGS72-pohjainen merenkulkukartta
- Vain NMEA-lauseiden suomenkielinen käännös
- Galileon High Accuracy Service -salaus

#### `space-map-utm` · diff 2

Mikä on UTM-koordinaatisto?

- **Universaali poikittainen Mercator: maailma jaettu 6° vyöhykkeisiin metripohjaisilla tasokoordinaateilla** ✓
- Vain yksi globaali taso ilman vyöhykkeitä
- Pelkkä geoidimalli ilman projektiota
- GNSS-vastaanottimen binääriprotokolla

#### `space-map-web-mercator` · diff 3

Mikä on Web Mercator (EPSG:3857) ja mikä sen sudenkuoppa?

- **Selainkarttojen tasoprojektio; etäisyydet ja pinta-alat vääristyvät etenkin korkeilla leveyksillä** ✓
- Tarkin mahdollinen geodeettinen datumi senttitasolle
- Suomen virallinen korkeusjärjestelmä
- SBAS-korjausten siirtoprotokolla

### space-positioning (9)

#### `space-pos-ambiguity` · diff 4

Mitä tarkoittaa integer ambiguity resolution RTK:ssa?

- **Kantoaallon kokonaislukuaaltojen lukumäärän kiinnittäminen, jotta phase-mittaus muuttuu absoluuttiseksi tarkaksi matkaksi** ✓
- NMEA-checksumin korjaaminen
- Geoidimallin gridin interpolointi
- Satelliitin PRN-numeron arvaus

#### `space-pos-baseline` · diff 3

Mitä tarkoittaa baseline differentiaalisessa GNSS:ssä?

- **Vektori tukiaseman ja liikkuvan vastaanottimen välillä (suhteellinen paikka)** ✓
- Vain satelliitin inklinaatiokulma
- NMEA-baudinopeuden oletusarvo
- Geoidimallin grid-resoluutio

#### `space-pos-cors-ntrip` · diff 3

Mikä on NTRIP RTK-käytössä?

- **Protokolla korjausdatan (usein RTCM) siirtoon internetin yli tukiasemaverkosta vastaanottimelle** ✓
- Uusi GNSS-konstellaatio Aasiassa
- Ellipsoidin litistyneisyysparametri
- Vain 2D-kartan tiilitysformaatti

#### `space-pos-dgps` · diff 3

Miten DGPS parantaa paikannusta?

- **Tunnetulla tukiasemalla mitatut korjaukset lähetetään liikkuvalle vastaanottimelle vähentämään yhteisiä virheitä** ✓
- DGPS vaihtaa ellipsoidia WGS72:een automaattisesti
- DGPS poistaa multipathin täysin kaikissa ympäristöissä
- DGPS toimii vain ilman mitään satelliittinäkyvyyttä

#### `space-pos-ppp` · diff 4

Miten PPP (Precise Point Positioning) eroaa RTK:sta?

- **PPP käyttää tarkkoja rata-/kellotuotteita yhdessä vastaanottimessa; RTK nojaa paikalliseen tukiasemaan** ✓
- PPP vaatii aina kaksi antennia samassa tolpassa
- PPP toimii vain GEO-satelliiteilla
- PPP ja RTK ovat täysin sama algoritmi eri nimellä

#### `space-pos-ppp-convergence` · diff 3

PPP-ratkaisu tarvitsee käynnistyksen jälkeen kymmeniä minuutteja ennen senttitasoa, RTK vain muutamia sekunteja. Miksi?

- **Tukiasemaa ei ole: ilmakehäviiveet ja ambiguityt estimoidaan vähitellen** ✓
- PPP odottaa, että satelliitit lähettävät tarkat radat broadcast-viestissä kerran tunnissa
- PPP-vastaanottimet käyttävät vain yhtä taajuutta, mikä hidastaa laskentaa
- PPP laskee sijainnin UTM-tasossa, ja projektion ratkaiseminen vie aikaa

#### `space-pos-rinex` · diff 3

Mihin RINEX-tiedostoja käytetään?

- **Standardimuotoiseen GNSS-havainto- ja navigointidatan vaihtoon jälkikäsittelyä varten** ✓
- Vain 3D-mallien renderöintiin pelimoottorissa
- SBAS-signaalin RF-modulaatioon satelliitissa
- EPSG-koodien automaattiseen rekisteröintiin

#### `space-pos-rtk` · diff 3

Mikä on RTK-paikannuksen ydinidea?

- **Kantoaaltovaiheen differentiaalinen mittaus tukiasemaan nähden + integer ambiguity -ratkaisu** ✓
- Pelkkä kartan zoomaus suurempaan mittakaavaan
- Vain almanakan päivitys kerran vuodessa
- Paikannus pelkillä Wi-Fi-tukiasemilla ilman GNSS:ää

#### `space-pos-spp` · diff 2

Mitä tarkoittaa SPP (Single Point Positioning) GNSS:ssä?

- **Paikka lasketaan yhden vastaanottimen mittauksista broadcast-efemeridillä — tyypillisesti metriluokkaa** ✓
- Kahden vastaanottimen phase-difference senttitasolla
- Vain inertianavigointia ilman satelliitteja
- Karttaprojektion muunnos WGS84 → TM35FIN

### space-satellites (8)

#### `space-orbit-geo-comms` · diff 2

Miksi TV- ja sääsatelliitit usein sijoitetaan GEO-radalle, mutta GNSS ei?

- **GEO pysyy paikallaan taivaalla yhden alueen yllä — GNSS tarvitsee liikkuvan konstellaation geometriaa** ✓
- GEO on ainoa rata jolla atomikello toimii
- GNSS-signaali ei voi kulkea GEO-korkeudesta
- GEO-satelliitteja saa lähettää vain kaupallisiin tarkoituksiin

#### `space-orbit-inclination-gps` · diff 3

Miksi GPS-ratojen inklinaatio on noin 55° eikä 0° (päiväntasaaja)?

- **Jotta satelliitit näkyisivät myös korkeilla leveysasteilla, ei vain tropiikissa** ✓
- Jotta satelliitit pysyisivät aina Suomen yllä paikallaan
- Koska 0° rata on fysikaalisesti mahdoton
- Koska inklinaatio 55° poistaa ionosfäärin vaikutuksen

#### `space-orbit-kepler-elements` · diff 3

Mitä Keplerin rataelementit kuvaavat satelliitin yhteydessä?

- **Radan muotoa, orientaatiota ja satelliitin sijaintia radalla tietyllä hetkellä** ✓
- Vain satelliitin massaa ja polttoainemäärää
- Vain antennin vahvistusta ja lähetystehoa
- Vain vastaanottimen kellovirhettä ja DOP-arvoa

#### `space-orbit-meo-gnss` · diff 2

Mille kiertoradalle tyypilliset GNSS-satelliitit (GPS, Galileo) sijoitetaan?

- **MEO (Medium Earth Orbit) — noin 19 000–23 000 km korkeudessa** ✓
- LEO (Low Earth Orbit) — alle 2000 km, kuten ISS
- GEO (Geostationary Orbit) — 35 786 km päiväntasaajan yllä
- HEO (Highly Elliptical Orbit) — Molnija-tyyppinen eloisa rata

#### `space-orbit-period-gps` · diff 2

GPS-satelliitti kiertää maan kahdesti sideraalisen vuorokauden aikana. Mitä siitä seuraa käytännössä?

- **Sama satelliittikuvio toistuu taivaalla joka päivä noin 4 minuuttia aiemmin** ✓
- Satelliitti pysyy koko ajan samassa kohdassa taivasta kuten geostationaarinen satelliitti
- Jokainen satelliitti näkyy Suomesta vain kerran vuodessa
- Kiertoaika määrää signaalin taajuuden, joten L1 ja L5 syntyvät eri ratanopeuksista

#### `space-sat-atomic-clock` · diff 2

Miksi GNSS-satelliiteissa on atomikelloja?

- **Paikannus perustuu tarkkaan ajanmittaukseen — nanosekunnin virhe on jo kymmeniä senttejä matkassa** ✓
- Atomikello pitää satelliitin asennon vakaana thrusterien sijaan
- Atomikello korvaa aurinkopaneelit energianlähteenä
- Atomikelloa tarvitaan vain televisiolähetyksiin

#### `space-sat-constellation` · diff 2

Mitä tarkoittaa GNSS-konstellaatio?

- **Suunniteltu joukko satelliitteja, jotka yhdessä tarjoavat globaalin tai alueellisen peiton** ✓
- Yksittäisen satelliitin antenniryhmä
- Vain vastaanottimen kanavien määrä
- Karttaprojektion parametrijoukko

#### `space-sat-relativity` · diff 4

Miten suhteellisuusteoria vaikuttaa GPS-kelloihin käytännössä?

- **Erityis- ja yleinen suhteellisuusteoria siirtävät satelliitin kellotaajuutta — ne korjataan järjestelmässä** ✓
- Suhteellisuusteorialla ei ole mitattavaa vaikutusta GPS:ään
- Vain kvanttimekaniikka vaikuttaa, ei suhteellisuusteoria
- Korjaus tehdään vain LEO-satelliiteille, ei MEO:lle

### space-signals (10)

#### `space-sig-carrier-phase` · diff 4

Miksi kantoaaltovaihe (carrier phase) mahdollistaa senttitason paikannuksen?

- **Vaiheen mittaus on millimetritarkkaa, kun kokonaislukuaaltojen epäselvyys (ambiguity) ratkaistaan** ✓
- Kantoaalto kulkee tyhjiössä hitaammin kuin koodi
- Carrier phase poistaa tarpeen kaikille korjauspalveluille
- Vaihe mittaa suoraan geoidin undulaation

#### `space-sig-cycle-slip` · diff 4

RTK-ratkaisu putoaa hetkeksi float-tilaan, kun auto ajaa sillan ali. Mitä kantoaaltomittaukselle tapahtui?

- **Cycle slip — vaiheseuranta katkesi, ja ambiguity ratkaistaan uudelleen** ✓
- Satelliitin atomikello nollautui, ja efemeridi pitää ladata uudelleen
- Ionosfääriviive kasvoi niin paljon, että L1 ja L5 vaihtoivat paikkaa
- Vastaanotin vaihtoi WGS84:stä ETRS89:ään, ja koordinaatit siirtyivät

#### `space-sig-dop` · diff 2

Mitä DOP (Dilution of Precision) kuvaa?

- **Miten satelliittigeometria vahvistaa mittausvirheet paikkavirheeksi** ✓
- Vain vastaanottimen akkukapasiteettia
- Geoidin undulaatiota metreinä
- NMEA-lauseen checksum-virhettä

#### `space-sig-iono` · diff 3

Miten ionosfääri vaikuttaa GNSS-signaaliin?

- **Se viivästyttää koodimittausta ja edistää kantoaaltoa — virhe voi olla metrejä** ✓
- Se muuttaa WGS84-puolisuuren akselin pituutta
- Se vaikuttaa vain GEO-satelliitteihin
- Ionosfäärillä ei ole vaikutusta L-kaistan signaaleihin

#### `space-sig-l1-l5` · diff 3

Miksi modernit vastaanottimet käyttävät useita taajuuksia (esim. L1 + L5)?

- **Monitaajuus auttaa korjaamaan ionosfääriviivettä ja parantaa robustiutta** ✓
- Useampi taajuus muuttaa WGS84-ellipsoidia automaattisesti
- L5 poistaa tarpeen kaikille satelliiteille
- Monitaajuus tarvitaan vain NMEA-baudinopeuden nostoon

#### `space-sig-multipath` · diff 3

Mikä on multipath-virhe GNSS-paikannuksessa?

- **Signaali saapuu myös heijastumana (rakennus, vesi) ja vääristää mitattua pseudomatkaa** ✓
- Satelliitin polttoaine loppuu ja rata muuttuu
- Karttaprojektion mittakaavavirhe UTM-vyöhykkeellä
- Vain geoidin undulaation mallivirhe

#### `space-sig-nmea` · diff 2

Mikä on NMEA 0183 GNSS-laitteissa?

- **Tekstimuotoinen lausestandardi paikkatiedon ja satelliittidatan siirtoon (esim. GGA, RMC)** ✓
- Binäärinen efemeridiformaatti IGS:lle
- Suomen ETRS-TM35FIN-projektion EPSG-koodi
- SBAS-korjausviestin salausprotokolla

#### `space-sig-pseudorange` · diff 2

Mitä tarkoittaa pseudomatka (pseudorange) GNSS:ssä?

- **Mitattu matka satelliittiin, joka sisältää kellovirheet ja viiveet — ei puhdas geometrinen etäisyys** ✓
- Vain kartalla mitattu 2D-etäisyys kahden merkin välillä
- Satelliitin todellinen laserilla mitattu etäisyys maasta
- Pelkkä DOP-luku ilman aikamittausta

#### `space-sig-trilateration` · diff 2

Miksi 3D-GNSS-paikkaan tarvitaan vähintään neljä satelliittia, ei kolme?

- **Kolme etäisyyttä riittäisi paikkaan, mutta vastaanottimen kellovirhe on neljäs tuntematon** ✓
- Neljäs satelliitti tarvitaan vain karttaprojektiota varten
- Kolme satelliittia riittää aina kellovirheestä huolimatta
- Neljäs satelliitti mittaa vain lämpötilan

#### `space-sig-tropo` · diff 3

Mikä on troposfääriviive GNSS:ssä?

- **Alailmakehän (kaasu + kosteus) aiheuttama ylimääräinen kulkuaika, tyypillisesti metriluokkaa zeniitissä** ✓
- Vain merenpohjan suolaisuuden vaikutus signaaliin
- Satelliitin thruster-manööverin aiheuttama hyppäys
- Kartan mittakaavavirhe Mercator-projektiossa

