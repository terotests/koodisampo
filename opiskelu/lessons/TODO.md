# Oppituntien todo (generoitu kysymyspankista)

> Päivitä: `npm run study:todo` — lukee `content/question-banks/*.json`, merkitsee valmiiksi jos `opiskelu/lessons/{id}.md` on olemassa.

**75 / 1249** valmis (**6 %**).

## Domain-yhteenveto

| Domain | Valmiit | Yhteensä | % |
|--------|---------|----------|---|
| C++ | 22 | 204 | 10.8 |
| JavaScript | 0 | 234 | 0 |
| PostgreSQL | 34 | 204 | 16.7 |
| Docker | 5 | 142 | 3.5 |
| Linux | 4 | 148 | 2.7 |
| Qt | 1 | 134 | 0.7 |
| Scrum | 4 | 142 | 2.8 |
| Git | 2 | 20 | 10 |
| Backend | 0 | 5 | 0 |
| Turvallisuus | 3 | 4 | 75 |
| Robot Framework | 0 | 12 | 0 |

## Kaikki aiheet

### C++ (22/204)

#### oikeellisuus `correctness` (2/20)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `b02-cpp-correct-dangling-15` | Funktio palauttaa `const std::string&` paikallisesta muuttujasta — cras… |
| ⬜ | 3 | `b02-cpp-correct-signed-14` | Bugiraportti: `if (index >= 0)` on aina tosi kun `index` on `size_t`. M… |
| ⬜ | 3 | `b03-cpp-correct-three-way-default` | Sorttaus comparator palauttaa `true` kun a==b — std::sort käyttäytyy ou… |
| ⬜ | 4 | `b03-cpp-prod-exception-noexcept` | Move-operaattori heittää poikkeuksen — std::vector reallokoi kesken ja … |
| ⬜ | 3 | `b04-cpp-auto-deduction-trap` | `auto x = {1, 2, 3};` aiheuttaa yllätyksen — x ei ole std::vector. Mikä… |
| ⬜ | 3 | `b04-cpp-final-override-virtual` | Aliluokka ylikirjoittaa `virtual void draw()` mutta perusluokan signatu… |
| ⬜ | 3 | `b05-cpp-explicit-constructor` | Luokka `Meters(int v)` aiheuttaa vahingossa implisiittisiä muunnoksia. … |
| ⬜ | 4 | `b05-cpp-signed-compare-bug` | Bugi: `for (int i = 0; i < vec.size(); ++i)` — size_t vs int vertailu. … |
| ⬜ | 4 | `b06-cpp-signed-compare-bug` | Code review: `if (a < b)` missä a on int ja b size_t — tuotannossa väär… |
| ⬜ | 2 | `b06-cpp-static-cast-review` | Code review: C-style `(int)x` muunnos. Miksi static_cast on parempi? |
| ⬜ | 3 | `b07-cpp-assert-vs-expect` | assert() katoaa release-buildissa mutta invariantti on kriittinen tuota… |
| ⬜ | 4 | `b07-cpp-rule-of-five` | Luokka hallitsee dynaamista bufferia mutta määrittelee vain destructori… |
| ⬜ | 3 | `b08-cpp-assert-ndebug` | Release-buildissa assert(ei-null) poistuu — nullptr kaataa myöhemmin. M… |
| ✅ | 4 | `b09-cpp-narrowing-conversion` | Laskenta `int64_t` → `int32_t` hiljaa truncaa arvon. Miten estät käännö… |
| ⬜ | 3 | `b09-cpp-switch-fallthrough` | Switch-case putoaa vahingossa seuraavaan caseen — bugi löytyy vasta tuo… |
| ⬜ | 4 | `correct-overflow` | Signed integer ylivuoto C++:ssa tuotantokoodissa — mitä standardi sanoo? |
| ⬜ | 3 | `correct-signed-unsigned` | Miksi `for (int i = 0; i < v.size(); i++)` voi olla vaarallinen? |
| ⬜ | 3 | `correct-ub` | Mitä tarkoittaa undefined behavior (UB) C++:ssa? |
| ✅ | 4 | `exp-cpp-correct-compare-three-way` | Sorttaus comparator palauttaa `<` ja `>` mutta unohtaa yhtäsuuruuden — … |
| ⬜ | 3 | `exp-cpp-incident-nodiscard` | Tuotantoon meni buildi jossa `parseConfig()` palautusarvo ignoroitiin —… |

#### C++ tuotanto `cpp-production` (2/8)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 5 | `prod-cpp-coroutine-lifetime` | Coroutine käyttää viittausta paikalliseen muuttujaan `co_await` jälkeen… |
| ✅ | 4 | `prod-cpp-false-sharing-struct` | Kaksi std::atomic-laskuria on vierekkäin structissa ja eri säikeet päiv… |
| ✅ | 4 | `prod-cpp-jthread-stop` | Worker-säie pitää pysäyttää siististi olion tuhoutuessa. Mikä C++20-työ… |
| ⬜ | 3 | `prod-cpp-optional-deref` | Koodi tekee `return *findUser(id);` missä `findUser` palauttaa `std::op… |
| ⬜ | 4 | `prod-cpp-raii-rollback` | Funktio kirjoittaa kaksi konfiguraatiotiedostoa ja toinen kirjoitus epä… |
| ⬜ | 4 | `prod-cpp-span-member` | Luokan API ottaa `std::span<int>` konstruktorissa ja tallentaa sen jäse… |
| ⬜ | 4 | `prod-cpp-string-view-member` | Luokka ottaa konstruktorissa `std::string_view name` ja tallentaa sen s… |
| ⬜ | 4 | `prod-cpp-variant-visit` | Uusi vaihtoehto lisätään `std::variant`-tyyppiin, mutta käsittely unoht… |

#### ylläpidettävyys `maintainability` (2/21)

| | diff | id | kysymys |
|---|------|-----|---------|
| ✅ | 3 | `b02-cpp-maintain-string-view-07` | Funktio ottaa `const std::string&` mutta kutsutaan literaaleilla — turh… |
| ⬜ | 2 | `b02-cpp-maintain-structured-08` | Koodi purkaa `std::pair<int,std::string>` käsin `.first` ja `.second`. … |
| ⬜ | 4 | `b03-cpp-maintain-copy-swap` | Tiimi kirjoittaa copy assignment -operaattorin käsin ja unohtaa self-as… |
| ⬜ | 2 | `b03-cpp-sprint-const-correctness` | Code review: getter palauttaa `std::string` kopiona vaikka dataa ei muu… |
| ⬜ | 3 | `b04-cpp-ranges-filter-view` | Koodi luo väliaikaisen vectorin vain suodattaakseen ja laskeakseen coun… |
| ⬜ | 2 | `b04-cpp-structured-bindings-map` | Silmukka käy std::map:in läpi: `for (auto& p : map) { auto k = p.first;… |
| ⬜ | 2 | `b05-cpp-avoid-raw-loop` | Sprint review: sama for-silmukka toistuu viidessä tiedostossa. Mitä ehd… |
| ⬜ | 3 | `b06-cpp-ranges-adaptors` | Silmukka filtteröi ja muuntaa konttia — lukija ei näe intentiota. Miten… |
| ⬜ | 3 | `b07-cpp-clang-tidy-ci` | Code reviewissa samat CppCoreGuidelines-rikkomukset toistuvat. Miten au… |
| ⬜ | 4 | `b07-cpp-pimpl-abi` | Jaettu kirjasto muuttuu usein — headerin muutos pakottaa koko projektin… |
| ⬜ | 3 | `b08-cpp-format-safety` | Logitus käyttää sprintf-puskuria — satunnainen overflow tuotannossa. Ko… |
| ⬜ | 2 | `b09-cpp-extract-function-refactor` | 200-rivinen funktio vaikeuttaa unit testausta. Mitä refaktorointia ehdo… |
| ⬜ | 3 | `b11-cpp-assert-side-effect` | Koodi: `assert(registerCallback(handler));` — release-buildissa callbac… |
| ⬜ | 2 | `b11-cpp-bool-parameter` | API: `void save(File& f, bool fast);` — kutsuissa `save(f, true)` ei ke… |
| ⬜ | 2 | `b11-cpp-macro-to-constexpr` | Konfiguraatiossa `#define MAX_CONNECTIONS 100`. Miksi cpp-best-practice… |
| ⬜ | 2 | `exp-cpp-cr-raii-file` | Funktio avaa FILE*:n mutta early return ennen fclose:a. Mitä ehdotat co… |
| ⬜ | 2 | `exp-cpp-sprint-algorithm-review` | Sprintin lopussa löytyy käsin kirjoitettu for-silmukka joka etsii max-a… |
| ⬜ | 2 | `maintain-const-method` | Miten merkitset metodin joka ei muuta olion tilaa? |
| ⬜ | 2 | `maintain-init-list` | Miksi `std::vector<int> v{1, 2, 3}` on turvallisempi kuin `vector<int>(… |
| ⬜ | 1 | `maintain-range-for` | Mikä on selkein tapa käydä kokoelma läpi ilman indeksivirheitä? |
| ✅ | 3 | `maintain-string-view` | Milloin `std::string_view` on hyödyllinen? |

#### suorituskyky `performance` (1/25)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `b02-cpp-perf-move-09` | Iso `std::vector<int>` palautetaan funktiosta — reviewer ehdottaa `std:… |
| ⬜ | 3 | `b02-cpp-perf-shrink-10` | Vektori kasvaa miljoonaan elementtiin ja tyhjennetään — muisti ei vapau… |
| ⬜ | 3 | `b03-cpp-cr-move-semantics` | Code reviewissa funktio palauttaa suuren `std::vector` arvona ja review… |
| ⬜ | 2 | `b03-cpp-perf-string-reserve` | Silmukka liittää tuhansia rivejä `std::string`iin — profiloija näyttää … |
| ⬜ | 3 | `b04-cpp-move-noexcept-vector` | std::vector<MyType> kasvaa hitaasti vaikka move-operaattori on olemassa… |
| ⬜ | 3 | `b05-cpp-move-review-temp` | Code review ehdottaa `std::move` jokaiselle parametrille funktiossa. Mi… |
| ⬜ | 3 | `b05-cpp-rvo-return-local` | Funktio palauttaa `std::string` paikallisesta muuttujasta. Onko turha k… |
| ⬜ | 5 | `b06-cpp-alignas-cache` | Hot loop kärsii cache miss — kaksi counteria samassa cache line:ssä eri… |
| ⬜ | 2 | `b07-cpp-reserve-vector` | Silmukka push_backaa miljoona elementtiä — profileri näyttää toistuvia … |
| ⬜ | 2 | `b08-cpp-emplace-back` | vectoriin lisätään monimutkaisia olioita — push_back(T(...)) luo turhan… |
| ⬜ | 3 | `b08-cpp-ranges-pipeline` | Suodatat ja muunnat vectorin — väliaikaisia vector-kopioita tulee liika… |
| ✅ | 3 | `b09-cpp-emplace-back-move` | Rakennat isoja olioita suoraan vectoriin väliaikaisten kopioiden sijaan… |
| ⬜ | 3 | `b09-cpp-vector-reserve-incident` | Profilointi näyttää tuhansia vector-reallokaatioita request-käsittelyss… |
| ⬜ | 3 | `b11-cpp-bind-vs-lambda` | Callback rekisteröidään `std::bind(&Service::handle, this, std::placeho… |
| ⬜ | 4 | `b11-cpp-default-move-ops` | Luokassa on custom destructor mutta ei move-operaatioita. Mitä cpp-best… |
| ⬜ | 3 | `b11-cpp-forward-declare-header` | Headeriin lisätään `#include "HeavyWidget.hpp"` vain koska funktio otta… |
| ⬜ | 3 | `b11-cpp-if-init-statement` | Funktio hakee arvon mapista ja tarkistaa sen: `auto it = m.find(k); if … |
| ⬜ | 3 | `b11-cpp-in-place-optional` | Koodi tekee `std::optional<BigType> o; o = BigType(args);` — kaksi kons… |
| ⬜ | 1 | `b11-cpp-preincrement` | Code review kommentoi `for (int i = 0; i < n; i++)` iterator-tyypin sil… |
| ⬜ | 3 | `b11-cpp-shared-ptr-copy-hot` | Funktio ottaa `std::shared_ptr<Foo>` arvona ja kutsutaan jokaisella fra… |
| ⬜ | 2 | `b11-cpp-std-endl-flush` | Hot loopissa logataan tuhansia rivejä `std::cout << x << std::endl`. Mi… |
| ⬜ | 3 | `exp-cpp-perf-reserve-vector` | Profileri näyttää tuhansia vector-uudelleenallokaatioita CSV-parserissa… |
| ⬜ | 3 | `perf-move` | Milloin `std::move` on perusteltu suurille objekteille? |
| ⬜ | 3 | `perf-noexcept` | Miksi `noexcept` voi auttaa move-operaatioissa? |
| ⬜ | 4 | `perf-rvo` | Funktio palauttaa suuren `std::vector` arvona. Mikä usein välttää kopio… |

#### siirrettävyys `portability` (2/11)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 2 | `b02-cpp-portability-stdint-11` | Verkkoprotokolla vaatii tarkalleen 32-bittisen unsigned-arvon. Mikä tyy… |
| ⬜ | 2 | `b03-cpp-portability-fixed-width` | Verkkoprotokolla tallentaa `uint32_t` binäärimuodossa eri alustoille. M… |
| ✅ | 3 | `b04-cpp-portability-fixed-width` | Wire-protokolla käyttää `int` ja `long` — eri alustoilla eri koko. Port… |
| ⬜ | 3 | `b06-cpp-portability-alignof` | Serialisointi verkossa — struct padding rikkoo protokollaa eri arkkiteh… |
| ✅ | 4 | `b07-cpp-endian-portable` | Binääriprotokolla lukee uint32:n verkosta — arvo väärä ARM:llä. Miten C… |
| ⬜ | 4 | `b08-cpp-modules-headers` | Buildi hidastuu massiivisista include-ketjuista. C++20 ratkaisu uudelle… |
| ⬜ | 3 | `b10-cpp-portability-abi-01` | Jaetaan kirjasto Windowsin ja Linuxin välillä. Mikä rajapintavalinta pa… |
| ⬜ | 2 | `b11-cpp-std-filesystem` | Koodi käyttää `GetFileAttributesW` / `stat()` suoraan polkujen käsittel… |
| ⬜ | 2 | `b11-cpp-std-thread-port` | Uusi moduuli käyttää suoraan `pthread_create` / `CreateThread`. Mitä cp… |
| ⬜ | 4 | `exp-cpp-portability-byte-order` | Verkkoprotokolla serialisoi uint32_t:n. Mikä C++17+ tapa välttää manuaa… |
| ⬜ | 2 | `portability-explicit` | Miksi yksiparametrisessä konstruktorissa kannattaa usein `explicit`? |

#### C++ turvallisuus `safety` (6/36)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 2 | `b02-cpp-safety-make-unique-06` | Tuotantokoodi käyttää `new Widget()` suoraan. Ensimmäinen turvallisuusp… |
| ⬜ | 3 | `b02-cpp-safety-noexcept-05` | std::vector::push_back heittää poikkeuksen kesken move-operaatiosta — t… |
| ⬜ | 3 | `b03-cpp-prod-virtual-dtor` | Tuotantobugi: `delete base_ptr` ei kutsu johdetun luokan destructoria. … |
| ⬜ | 3 | `b03-cpp-safety-array-span` | Legacy-funktio ottaa `int buf[256]` ja kutsuja antaa pienemmän pinon. M… |
| ⬜ | 4 | `b04-cpp-rule-of-five` | Luokka hallitsee dynaamista bufferia — destructor on määritelty, mutta … |
| ⬜ | 2 | `b04-cpp-smart-ptr-make-shared` | Code review: `shared_ptr<Foo>(new Foo(), customDeleter)`. Milloin make_… |
| ⬜ | 4 | `b04-cpp-string-view-lifetime` | Funktio palauttaa `std::string_view` joka viittaa paikalliseen std::str… |
| ✅ | 3 | `b05-cpp-lock-guard-incident` | Tuotantobugi: mutex jää lukittuna poikkeuksen jälkeen. Miten estät tämä… |
| ⬜ | 2 | `b05-cpp-make-unique-factory` | Tehdasfunktio luo dynaamisen olion. Miksi `std::make_unique<T>()` on pa… |
| ⬜ | 4 | `b05-cpp-noexcept-move-review` | Code review: move-konstruktori ei ole noexcept. `std::vector` resize hi… |
| ⬜ | 4 | `b05-cpp-string-view-lifetime` | Funktio palauttaa `std::string_view` paikallisesta `std::string`:stä. T… |
| ⬜ | 3 | `b06-cpp-raii-scope-guard` | Funktio avaa tiedoston ja pitää sulkea poikkeuksessa. Miten toteutat il… |
| ✅ | 4 | `b06-cpp-span-heap-buffer` | API ottaa raw pointer ja pituus — buffer overrun tuotannossa. Miten mod… |
| ⬜ | 3 | `b06-cpp-vector-emplace-back` | Rakennat vektorin monimutkaisia olioita — push_back kopioi turhaan. Mit… |
| ⬜ | 4 | `b06-cpp-weak-ptr-cycle` | Kaksi objekti jakaa shared_ptr toisiinsa — muisti ei vapaudu. Mikä ratk… |
| ⬜ | 2 | `b07-cpp-optional-null-api` | Hakufunktio palauttaa -1 kun avainta ei löydy — kutsujat sekoittavat vi… |
| ⬜ | 3 | `b07-cpp-span-bounds-check` | Funktio ottaa (T* data, size_t len) — tuotannossa buffer overflow. Mikä… |
| ✅ | 3 | `b08-cpp-span-bounds` | Code review: funktio ottaa `std::span<int>` ja indeksoi ilman tarkistus… |
| ⬜ | 4 | `b08-cpp-unique-ptr-deleter` | FILE* pitää sulkea fclose:lla — unique_ptr<void> ei riitä. Miten mallin… |
| ✅ | 4 | `b09-cpp-enable-shared-from-this` | Async callback tarvitsee `shared_ptr`:n `this`:stä, mutta `shared_ptr(t… |
| ⬜ | 3 | `b09-cpp-optional-null-api` | API palauttaa `nullptr` kun arvoa ei löydy — kutsujat unohtavat tarkist… |
| ⬜ | 3 | `b09-cpp-raw-pointer-refactor` | Legacy-moduuli palauttaa `new`-allokoituja olioita kutsujalle. Refaktor… |
| ✅ | 4 | `b09-cpp-span-bounds-check` | Tuotantobugi: buffer overflow C-tyylisessä `char*` API:ssa. Moderni kor… |
| ⬜ | 3 | `exp-cpp-prod-asan-build` | Muistivuoto epäilty tuotannossa. Mitä CI-buildia pyydät ensin ennen tuo… |
| ⬜ | 4 | `exp-cpp-prod-span-buffer` | Tuotantobugi: funktio ottaa `(uint8_t* data, size_t len)` ja lukee yli … |
| ⬜ | 4 | `exp-cpp-prod-weak-ptr-cache` | Jaettu image-cache käyttää `shared_ptr`. Objektit eivät vapaudu vaikka … |
| ⬜ | 2 | `safety-avoid-c-array` | Miksi cpp-best-practices suosittelee välttämään `T[N]`-taulukoita rajap… |
| ⬜ | 2 | `safety-const-member` | Miten `const` jäsenmuuttujat auttavat turvallisuudessa? |
| ⬜ | 2 | `safety-exceptions` | Miksi poikkeus voi olla parempi kuin virhekoodi joka voidaan ignoroida? |
| ✅ | 3 | `safety-make-shared` | Miksi `std::make_shared<T>(args)` on parempi kuin `shared_ptr<T>(new T(… |
| ⬜ | 3 | `safety-rule-of-zero` | Mitä Rule of Zero tarkoittaa? |
| ⬜ | 3 | `safety-shared-ptr` | Milloin `std::shared_ptr` on perusteltu `unique_ptr`:n sijaan? |
| ⬜ | 2 | `safety-static-cast` | Miksi `(int)x` on huonompi kuin `static_cast<int>(x)`? |
| ⬜ | 2 | `safety-unique-ptr` | Mikä korvaa turvallisesti `new`/`delete`-parin yksittäiselle omistajall… |
| ⬜ | 3 | `safety-variadic` | Mikä on turvallinen vaihtoehto omalle C-tyyliselle variadiselle funktio… |
| ⬜ | 2 | `safety-vector` | Mikä on moderni korvike dynaamiselle `int[]`-taulukolle? |

#### C++ tyyli `style` (1/30)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `b02-cpp-style-consteval-04` | Konfiguraatiovakio pitää laskea compile-time — runtime-laskenta hidasta… |
| ⬜ | 2 | `b02-cpp-style-override-03` | Perusluokan `virtual void draw()` ylikirjoitetaan mutta kääntäjä ei var… |
| ⬜ | 2 | `b03-cpp-cr-override-keyword` | Johdettu luokka ylikirjoittaa `virtual void draw()` mutta kirjoittaa `v… |
| ⬜ | 2 | `b03-cpp-style-explicit-ctor` | Luokka `Meters(int v)` aiheuttaa vahingossa `double d = 3.5; Meters m =… |
| ⬜ | 3 | `b04-cpp-explicit-constructor` | Bugi: `void foo(Bytes b); foo(1024);` kääntyy — 1024 muuntuu Bytes:ksi … |
| ⬜ | 2 | `b04-cpp-init-list-initializer` | Code review: `int x = 3.9;` kääntyy hiljaa — reviewer ehdottaa `int x{3… |
| ⬜ | 2 | `b05-cpp-const-method-api` | Getter-metodi ei muuta olion tilaa. Miten ilmaiset sen API:ssa? |
| ⬜ | 2 | `b05-cpp-init-list-brace` | Code review: `std::vector<int> v(10, 1)` vs `std::vector<int> v{10, 1}`… |
| ⬜ | 3 | `b05-cpp-override-virtual-crash` | Aliluokan virtuaalinen metodi ei koskaan kutsuta — kirjoitusvirhe param… |
| ⬜ | 2 | `b06-cpp-attributes-fallthrough` | Switch-case putoaa vahingossa seuraavaan caseen — bugi löytyy viiveellä… |
| ⬜ | 2 | `b06-cpp-default-member-init` | Konstruktorit unohtavat alustaa member-kentät — satunnaiset arvot. Mite… |
| ⬜ | 2 | `b07-cpp-enum-class-scoped` | Vanha enum Color { Red, Green } törmää toisen headerin Red-vakioiden ka… |
| ⬜ | 2 | `b07-cpp-nodiscard-error` | Kutsuja ignooraa bool validate() paluuarvon — bugi tuotannossa. Miten p… |
| ⬜ | 2 | `b08-cpp-enum-class-scope` | Vanha `enum Color { Red, Green }` törmää toisen headerin `Red`-vakion k… |
| ✅ | 3 | `b09-cpp-delete-copy-semantics` | Luokka hallitsee yksilöllistä resurssia — kopio ei saa olla mahdollinen… |
| ⬜ | 2 | `b09-cpp-enum-class-type` | Code review: `enum Color { RED, GREEN }` sekoittuu toisen `enum Status … |
| ⬜ | 4 | `b09-cpp-rule-of-five-review` | Luokassa on custom destructor mutta ei copy/move -operaatioita. Code re… |
| ⬜ | 2 | `b11-cpp-braces-required` | PR lisää yksirivisen if:n ilman aaltosulkuja ennen toista riviä. Miksi … |
| ⬜ | 1 | `b11-cpp-clang-format-style` | Code review täyttyy väittelyistä sijoittelusta ja rivipituudesta. Miten… |
| ⬜ | 2 | `b11-cpp-local-include-quotes` | Projektin oma header includataan `#include <MyWidget.hpp>`. Mitä cpp-be… |
| ⬜ | 2 | `b11-cpp-out-of-source-build` | CMake generoi object-tiedostot samaan hakemistoon kuin lähdekoodi. Mitä… |
| ⬜ | 2 | `b11-cpp-underscore-identifier` | Uusi globaali funktio nimetään `_init_app()`. Miksi cpp-best-practices … |
| ⬜ | 2 | `b11-cpp-using-namespace-header` | Uusi header alkaa `using namespace std;` ja includataan kymmenessä modu… |
| ⬜ | 3 | `exp-cpp-cr-default-delete` | Luokka hallitsee tiedostonkuvaajaa eikä saa kopioida. Code review ehdot… |
| ⬜ | 2 | `exp-cpp-cr-enum-class-switch` | Code review: switch-case käyttää `enum Status { OK, FAIL }` ilman scope… |
| ⬜ | 1 | `style-const-ref` | Miten vältät turhan `std::string`-kopioinnin funktioparametrissa? |
| ⬜ | 3 | `style-final-override` | Luokka ei ole tarkoitettu perittäväksi mutta sisältää virtual-metodeja.… |
| ⬜ | 2 | `style-override` | Miksi käyttää `override` periytyvässä metodissa? |
| ⬜ | 2 | `style-pass-int` | Miten yksinkertainen `int` kannattaa välittää konstruktorille? |
| ⬜ | 2 | `tools-enum-class` | Miksi `enum class` on parempi kuin vanha C-tyylinen `enum`? |

#### säikeistys `threadability` (5/18)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 5 | `b02-cpp-thread-atomic-order-13` | Laskuri kasvaa useasta säikeestä — `atomic<int>++` riittääkö ilman memo… |
| ✅ | 4 | `b02-cpp-thread-scoped-lock-12` | Funktio lukitsee kaksi mutexia — riski deadlockille. C++17-ratkaisu? |
| ⬜ | 3 | `b03-cpp-thread-atomic-flag` | Yksinkertainen shutdown-flag jaettiin bool:lla ilman synkronointia — sa… |
| ✅ | 4 | `b03-cpp-thread-mutex-order` | Deadlock kahdessa mutexissa: thread A lukitsee m1→m2, thread B m2→m1. M… |
| ⬜ | 4 | `b04-cpp-lock-guard-deadlock` | Kaksi mutexia lukitaan eri järjestyksessä kahdessa säikeessä — satunnai… |
| ⬜ | 3 | `b04-cpp-static-local-thread` | Funktion sisällä `static Logger log;` — useat säikeet kirjoittavat loki… |
| ⬜ | 3 | `b05-cpp-atomic-counter` | Usea säie päivittää jaettua laskuria. Mikä primitiivi on oikea ilman mu… |
| ✅ | 4 | `b06-cpp-packaged-task` | Worker-thread ajaa funktion ja palauttaa tuloksen kutsijalle. Mitä käyt… |
| ⬜ | 5 | `b07-cpp-atomic-acquire-release` | Lock-free jonossa tuottaja kirjoittaa datan ja asettaa flagin — kulutta… |
| ⬜ | 5 | `b08-cpp-atomic-memory-order` | Laskuri kasvaa useassa säikeessä — atomic<int> riittää, mutta luku ei n… |
| ✅ | 4 | `b08-cpp-shared-mutex-read` | Konfiguraatiocache: lukijoita paljon, kirjoittajia harvoin — std::mutex… |
| ✅ | 4 | `b09-cpp-condition-variable-wait` | Worker-säie odottaa queuea — spurious wakeup aiheuttaa tyhjän pop:in. O… |
| ⬜ | 3 | `b11-cpp-avoid-global-state` | Moduulissa on `static std::map<int, User> g_cache` ja useat säikeet kut… |
| ⬜ | 4 | `b11-cpp-mutex-mutable-rule` | const-metodi päivittää cachea mutta tarvitsee mutexin. Mitä cpp-best-pr… |
| ⬜ | 4 | `exp-cpp-thread-once-flag` | Singleton alustetaan lazy-initillä useasta säikeestä. Mikä standardikom… |
| ⬜ | 3 | `thread-atomic` | Miten jaat yksinkertaisen laskurin säikeiden välillä turvallisesti? |
| ⬜ | 4 | `thread-data-race` | Kaksi säiettä kirjoittaa samaan `int`-muuttujaan ilman synkronointia. M… |
| ⬜ | 3 | `thread-lock-guard` | Mikä on turvallisin tapa lukita `std::mutex` lyhyeksi kriittiseksi alue… |

#### C++ työkalut `tools` (1/35)

| | diff | id | kysymys |
|---|------|-----|---------|
| ✅ | 4 | `b02-cpp-tools-concepts-02` | Template-funktio `sortLike(T& a, T& b)` kaatuu outoihin virheisiin väär… |
| ⬜ | 2 | `b02-cpp-tools-raii-01` | Code reviewissa funktio luo `new Database()` ja palauttaa raakaa osoiti… |
| ⬜ | 4 | `b03-cpp-incident-sanitize-ubsan` | Tuotantoon pääsee signed overflow -bugi vain tietyllä ARM-buildilla. CI… |
| ⬜ | 3 | `b03-cpp-tools-if-constexpr` | Template-funktio tarvitsee eri haaran integraalisille vs float-tyypeill… |
| ⬜ | 4 | `b04-cpp-concept-constraints` | Generinen funktio `template<typename T> void sort(T& c)` kaatuu outoihi… |
| ⬜ | 4 | `b04-cpp-consteval-compile-time` | Lookup-taulukko pitää laskea käännösaikana — runtime-laskenta hidastaa … |
| ⬜ | 3 | `b05-cpp-constexpr-config` | Konfiguraatiovakiot lasketaan build-ajassa. Mikä avainsana varmistaa et… |
| ⬜ | 2 | `b05-cpp-lambda-capture-review` | Code reviewissa lambda kaappaa ulkoisen muuttujan arvolla `[x]` mutta x… |
| ⬜ | 3 | `b06-cpp-deleted-function` | Luokka ei saa kopioida — kopio-konstruktori kutsuu vahingossa. Miten es… |
| ⬜ | 2 | `b06-cpp-enum-class-scope` | Code reviewissa `enum Color { Red, Green };` aiheuttaa nimikonfliktit h… |
| ⬜ | 3 | `b06-cpp-nodiscard-return` | Tuotantobugi: `allocateBuffer()` palautusarvo jätetään huomiotta ja res… |
| ⬜ | 3 | `b07-cpp-chrono-literals` | Timeout on koodissa sleep(500) — yksikkö epäselvä. Miten std::chrono il… |
| ⬜ | 4 | `b07-cpp-perfect-forwarding` | Tehdasfunktio make<T>(Args&&... args) välittää argumentit konstruktoril… |
| ⬜ | 3 | `b07-cpp-spaceship-operator` | Luokalle tarvitaan ==, !=, <, <=, >, >= — paljon boilerplatea. C++20 ly… |
| ⬜ | 2 | `b07-cpp-unique-ptr-deleter` | RAII-wrapper hallitsee C-API:n FILE*-pointteria. Miksi std::unique_ptr … |
| ⬜ | 2 | `b08-cpp-chrono-literals` | Timeout-koodi: `sleep(500)` — yksikkö epäselvä. Miten ilmaiset 500 mill… |
| ⬜ | 4 | `b08-cpp-initializer-list-trap` | Funktio `void f(std::array<int, 3>)` — kutsu `f({1,2,3})` käännyy, mutt… |
| ⬜ | 3 | `b08-cpp-optional-monadic` | Ketju: optional palauttaa arvon, seuraava funktio ottaa arvon — if-linn… |
| ⬜ | 3 | `b08-cpp-sort-requirements` | std::sort kaatuu outoon virheeseen custom-iteratorilla. Mitä iteratorin… |
| ⬜ | 4 | `b08-cpp-variant-visit` | std::variant<int, string> — switch-tyylinen käsittely ilman visitor-luo… |
| ⬜ | 2 | `b09-cpp-clang-tidy-review` | Code reviewissa toistuu sama raw-pointer-anti-pattern. Miten automatiso… |
| ⬜ | 3 | `b09-cpp-sanitizer-ci-failure` | CI-putki kaatuu yöllä AddressSanitizer-virheeseen, mutta paikallinen re… |
| ⬜ | 2 | `b11-cpp-ccache-ci` | CI-build kestää 40 min vaikka vain yksi .cpp muuttui. Mitä cpp-best-pra… |
| ⬜ | 2 | `b11-cpp-compile-commands` | clang-tidy ei löydä oikeita include-polkuja CMake-projektissa. Mitä bui… |
| ⬜ | 3 | `b11-cpp-iwyu-cleanup` | PR:ssä jokainen header vetää mukaan `<iostream>` vaikka käytetään vain … |
| ⬜ | 4 | `b11-cpp-pch-tradeoff` | Iso C++-projekti harkitsee precompiled headereita (PCH). Mitä cpp-best-… |
| ⬜ | 3 | `b11-cpp-werror-policy` | Tiimi haluaa ettei uusia varoituksia päädy main-haaraan. Mikä käytäntö … |
| ⬜ | 3 | `exp-cpp-cr-optional-review` | Code reviewissa kollega palauttaa `T*` joka voi olla null. Mikä moderni… |
| ⬜ | 3 | `exp-cpp-prod-chrono-timeout` | API-kutsu tarvitsee 500 ms timeoutin. Miten ilmaiset ajan modernisti il… |
| ⬜ | 2 | `exp-cpp-tools-format-logging` | Tiimi korvaa sprintf-loggauksen. Mikä moderni standardikirjasto auttaa … |
| ⬜ | 1 | `tools-auto` | Mitä `auto` tekee modernissa C++:ssa? |
| ⬜ | 3 | `tools-constexpr` | Mitä `constexpr` funktio mahdollistaa C++11:ssä? |
| ⬜ | 1 | `tools-nullptr` | Mikä on turvallisin tapa nollata osoitin C++11:ssä? |
| ⬜ | 3 | `tools-structured-bindings` | C++17: miten purat `std::map`-iteratorin avain/arvo-pairin siististi? |
| ⬜ | 2 | `tools-using-alias` | Miksi `using StringMap = std::map<std::string, int>` on usein parempi k… |

### JavaScript (0/234)

#### JavaScript async `js-async` (0/59)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `b02-js-async-await-04` | async funktio heittää virheen — caller ei saa stack tracea. Miten käsit… |
| ⬜ | 2 | `b02-js-async-fetch-01` | REST-kutsu timeout 30s — käyttäjä navigoi pois. Miten peruutat fetchin? |
| ⬜ | 4 | `b02-js-async-microtask-03` | console.log järjestys: sync, Promise.resolve().then, setTimeout(0). Mik… |
| ⬜ | 3 | `b02-js-async-promise-02` | Kolme riippumatonta API-kutsua — haluat odottaa kaikkia mutta yksi fail… |
| ⬜ | 3 | `b03-js-async-debounce-fetch` | Hakukenttä laukaisee fetch-jokaisella näppäimellä — API rate limit. Kor… |
| ⬜ | 4 | `b03-js-async-event-loop-order` | Debug: console.log(1); Promise.resolve().then(()=>log(2)); queueMicrota… |
| ⬜ | 3 | `b03-js-async-fetch-credentials` | SPA ei lähetä session-cookiea cross-origin API:lle. fetch-korjaus? |
| ⬜ | 4 | `b03-js-async-promise-race-timeout` | fetch ei timeouttaa natiivisti — käyttäjä jää odottamaan ikuisesti. Mod… |
| ⬜ | 3 | `b04-js-async-debounce` | Hakukenttä laukaisee API-kutsun joka näppäimellä — palvelin ylikuormitt… |
| ⬜ | 3 | `b04-js-async-event-loop-blocking` | UI jäätyy kun käsittelet 100k rivin CSV:tä for-silmukalla fetchin jälke… |
| ⬜ | 4 | `b04-js-async-generator` | Paginoitu API — haluat for-await silmukan joka hakee sivut automaattise… |
| ⬜ | 3 | `b04-js-async-race-fetch` | Hidas API — haluat timeoutin 5s jälkeen AbortError. Oikea yhdistelmä? |
| ⬜ | 3 | `b05-js-async-debounce` | Hakukenttä laukaisee API-kutsun jokaisella näppäimellä — palvelin yliku… |
| ⬜ | 3 | `b05-js-event-loop-order` | console.log('A'); setTimeout(() => console.log('B'), 0); Promise.resolv… |
| ⬜ | 4 | `b05-js-fetch-abort-controller` | Käyttäjä navigoi pois ennen kuin hidas fetch valmistuu — vanha vastaus … |
| ⬜ | 3 | `b05-js-promise-chain-catch` | fetch-ketju kaatuu — virhe jää käsittelemättä ja UI jää spinneriin. Kor… |
| ⬜ | 4 | `b06-js-async-iterator-forawait` | Stream API palauttaa async iterable — haluat loopata awaitilla. Miten? |
| ⬜ | 3 | `b06-js-async-promise-finally` | Fetch-ketju — haluat cleanup riippumatta success/failure. Mitä käytät? |
| ⬜ | 3 | `b06-js-async-queue-microtask` | console.log järjestys: sync, setTimeout(0), promise.then. Mitä tulostuu… |
| ⬜ | 2 | `b06-js-async-settimeout-zero` | setTimeout(fn, 0) ei suorita fn heti — miksi? |
| ⬜ | 4 | `b07-js-async-abort` | Käyttäjä vaihtaa sivua ennen fetchin valmistumista — vanha vastaus ylik… |
| ⬜ | 3 | `b07-js-async-await-error` | async funktio heittää — unhandled rejection tuotannossa. Miten käsittel… |
| ⬜ | 4 | `b07-js-async-debounce` | Käyttäjä kirjoittaa hakukenttään nopeasti — vanhemmat fetch-vastaukset … |
| ⬜ | 4 | `b07-js-async-microtask` | console.log järjestys: sync, Promise.then, setTimeout. Mikä tulostuu to… |
| ⬜ | 4 | `b08-js-async-generator` | Paginoitu API — haluat for-loopin joka hakee sivut yksi kerrallaan asyn… |
| ⬜ | 5 | `b08-js-async-microtask-starvation` | while(true) Promise.resolve().then(...) — UI jäätyy mutta ei 100% CPU. … |
| ⬜ | 3 | `b08-js-async-parallel` | Lataat kolme riippumatonta API:a — await peräkkäin kestää 3×. Nopeampi … |
| ⬜ | 3 | `b08-js-async-race-timeout` | fetch ei saa roikkua yli 5 sekuntia — timeout ilman manuaalista flagia? |
| ⬜ | 4 | `b09-js-async-event-loop-block` | Express-endpoint jäädyttää koko palvelimen 30 sekunniksi raskaalla JSON… |
| ⬜ | 3 | `b09-js-async-fetch-abort` | Käyttäjä navigoi pois ennen kuin hidas fetch valmistuu — haluat peruutt… |
| ⬜ | 3 | `b09-js-async-promise-chain` | Callback hell API-ketjussa — kolme peräkkäistä fetch-kutsua. Moderni re… |
| ⬜ | 4 | `b09-js-async-unhandled-rejection` | Tuotannossa `UnhandledPromiseRejection` kaataa Node-prosessin. Miten kä… |
| ⬜ | 2 | `b12-js-async-async-returns-promise` | Mikä `async function foo() { return 42; }` palauttaa kutsujalle? |
| ⬜ | 5 | `b12-js-async-async-stack` | async stack trace katkeaa await-kohdassa debugissa. Node/DevTools apu? |
| ⬜ | 3 | `b12-js-async-await-top-level` | config.mjs lataa env-tiedoston ennen muita importteja. Ratkaisu? |
| ⬜ | 2 | `b12-js-async-callback-to-promise` | Vanha kirjasto käyttää `readFile(path, cb)` callback-tyyliä. Miten käär… |
| ⬜ | 4 | `b12-js-async-eventemitter-memory` | Node EventEmitter 'data' listenerit kasaantuvat — MaxListenersExceededW… |
| ⬜ | 3 | `b12-js-async-fetch-keepalive` | Analytics beacon sivun unloadissa — fetch katkeaa. Vaihtoehto? |
| ⬜ | 4 | `b12-js-async-generator-async` | Streamaat paginoitua API:a — haluat `for await` silmukan. Funktion tyyp… |
| ⬜ | 4 | `b12-js-async-iterator-for-await` | ReadableStream data async iterable. Silmukka? |
| ⬜ | 5 | `b12-js-async-microtask-starvation` | while(true) { queueMicrotask(() => {}) } — UI jäätyy vaikka ei ole synk… |
| ⬜ | 3 | `b12-js-async-promise-all-error` | Promise.all — yksi reject. Mitä tapahtuu? |
| ⬜ | 3 | `b12-js-async-promise-finally` | Latausnäkymä pitää piilottaa sekä onnistumisessa että virheessä. Mikä P… |
| ⬜ | 3 | `b12-js-async-promise-race-cancel` | Käyttäjä peruuttaa — haluat että hitain fetch häviää kilpajuoksussa. Me… |
| ⬜ | 2 | `b12-js-async-promise-then-chain` | fetch palauttaa promisen — haluat JSON-objektin. Ensimmäinen then-ketju? |
| ⬜ | 4 | `b12-js-async-promise-with-resolvers` | Rakennat deferred-patternin: ulkopuolinen koodi resolveaa promisen myöh… |
| ⬜ | 3 | `b12-js-async-queue-microtask` | Haluat ajaa funktion heti synkronisen koodin jälkeen mutta ennen setTim… |
| ⬜ | 4 | `b12-js-async-retry-backoff` | API palauttaa 503 — haluat uudelleenyrityksen eksponentiaalisella viive… |
| ⬜ | 3 | `b12-js-async-settled-vs-resolve` | finally-blokissa tarvitset tietää onnistuiko promise. Miten saat tuloks… |
| ⬜ | 4 | `b12-js-async-signal-combine` | Kaksi AbortControlleria — fetch peruuttuu jos jompikumpi aborttaa. API? |
| ⬜ | 2 | `b12-js-async-sleep-pattern` | Testissä haluat odottaa 100ms ilman busy-waitiä. Pattern? |
| ⬜ | 5 | `b12-js-async-stream-backpressure` | Node transform stream tulvii muistia — kirjoittaja nopeampi kuin lukija… |
| ⬜ | 3 | `exp-js-async-await-parallel` | Code review: kaksi await fetchiä peräkkäin — sivu latautuu hitaasti. Mi… |
| ⬜ | 3 | `exp-js-async-fetch-abort` | Käyttäjä navigoi pois ennen kuin hidas fetch valmistuu — state päivitty… |
| ⬜ | 4 | `exp-js-async-microtask-order` | Bugiraportti: `console.log` järjestys on 1, 4, 2, 3 — setTimeout(0), Pr… |
| ⬜ | 3 | `exp-js-async-promise-all-settled` | Dashboard hakee viisi API:a — yksi failaa ja koko näkymä jää tyhjäksi P… |
| ⬜ | 3 | `js-async-await-error` | async-funktio heittää virheen. Miten käsittelet sen kutsujassa turvalli… |
| ⬜ | 4 | `js-async-microtasks` | console.log(1); Promise.resolve().then(() => console.log(2)); console.l… |
| ⬜ | 4 | `prod-js-unhandled-rejection-caller` | Event handler kutsuu `saveData()` async-funktiota ilman awaitia eikä li… |

#### JS-moduulit `js-modules` (0/49)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `b02-js-modules-cycle-09` | Kaksi moduulia importtaa toisensa — toinen export undefined init aikana… |
| ⬜ | 3 | `b02-js-modules-dynamic-08` | Feature flag lataa analytics-moduulin vain tarvittaessa. ES module tapa? |
| ⬜ | 2 | `b02-js-modules-export-11` | Haluat uudelleenexportata useita util-funktioita yhdestä entrypointista… |
| ⬜ | 4 | `b02-js-modules-tla-10` | Moduulin top-level await hidastaa koko appin latausta — milloin käyttää? |
| ⬜ | 2 | `b03-js-modules-export-default-named` | Code review: tiedosto export default User ja export const helper — impo… |
| ⬜ | 3 | `b03-js-modules-import-meta` | Bundleri tarvitsee nykyisen moduulin URL:n runtime asset-polkuun. ES-mo… |
| ⬜ | 4 | `b03-js-modules-worker-postmessage` | Raskas JSON-parse jäädyttää UI-threadin. Web Worker -integraatio? |
| ⬜ | 3 | `b04-js-modules-dynamic-import` | Admin-paneeli pitää ladata vain admin-käyttäjille — bundle koko kasvaa.… |
| ⬜ | 2 | `b04-js-modules-export-default` | Code review: tiedosto exporttaa sekä default että 5 named exportia — re… |
| ⬜ | 3 | `b04-js-modules-import-meta` | ES-moduulissa tarvitset nykyisen moduulin URL:n asset-polkuun. Standard… |
| ⬜ | 3 | `b05-js-modules-dynamic-import` | Raskas chart-kirjasto ladataan vain kun käyttäjä avaa analytics-sivun. … |
| ⬜ | 2 | `b05-js-modules-esm-import` | HTML:ssä `<script src='app.js'>` — import/export ei toimi. Korjaus? |
| ⬜ | 4 | `b05-js-modules-top-level-await` | Moduulin init tarvitsee config-fetch ennen exportteja. Moderni tapa ilm… |
| ⬜ | 4 | `b06-js-modules-import-assertions` | JSON config moduuli — haluat importtaa JSON ESM:ssä turvallisesti. Mite… |
| ⬜ | 3 | `b06-js-modules-reexport` | Barrel file exporttaa utils-moduulien API yhdessä paikassa. Miten? |
| ⬜ | 3 | `b06-js-modules-top-level-await` | ESM moduuli tarvitsee async init ennen exporttia. Miten ilman wrapper-f… |
| ⬜ | 4 | `b07-js-modules-cycle` | a.js importtaa b.js ja b.js importtaa a.js — undefined export. Miten ko… |
| ⬜ | 3 | `b07-js-modules-dynamic` | Admin-paneeli on harvoin käytössä — haluat ladata sen koodin vain tarvi… |
| ⬜ | 3 | `b07-js-modules-tree-shake` | Bundle on iso vaikka käytät yhtä lodash-funktiota. Import-korjaus? |
| ⬜ | 4 | `b08-js-modules-circular` | a.js importtaa b.js ja b.js importtaa a.js — export undefined initissä.… |
| ⬜ | 3 | `b08-js-modules-dynamic-import` | Raskas chart-kirjasto vain admin-sivulla — bundle liian iso. Latausstra… |
| ⬜ | 4 | `b08-js-modules-top-level-await` | ES module init lataa config.json ennen exportteja — miten ilman async I… |
| ⬜ | 4 | `b09-js-modules-circular-dep` | Moduuli A importtaa B:n ja B importtaa A:n — undefined exportit bootiss… |
| ⬜ | 3 | `b09-js-modules-dynamic-import` | Raskas chart-kirjasto tarvitaan vain admin-sivulla — haluat pienentää i… |
| ⬜ | 4 | `b09-js-modules-esm-cjs-interop` | Node-projektissa `require('esm-only-pkg')` kaatuu. Oikea lähestymistapa? |
| ⬜ | 3 | `b12-js-modules-assert-type-css` | Vite/CSS import komponentissa? |
| ⬜ | 4 | `b12-js-modules-cjs-esm-interop` | Node ESM importtaa CommonJS-moduulin — default export? |
| ⬜ | 4 | `b12-js-modules-create-require` | ESM-tiedostossa tarvitset require kertaluontoisesti? |
| ⬜ | 2 | `b12-js-modules-default-export` | export default function App() — import? |
| ⬜ | 5 | `b12-js-modules-dual-package` | Kirjasto tarjoaa sekä CJS että ESM — hazard? |
| ⬜ | 3 | `b12-js-modules-dynamic-conditional` | Lataa moduuli vain adminille. Pattern? |
| ⬜ | 4 | `b12-js-modules-import-attributes` | Haluat importata JSON-moduulin ESM:llä selaimessa. Moderni syntaksi? |
| ⬜ | 5 | `b12-js-modules-import-defer` | ES proposal: import ajetaan vasta kun binding käytetään? |
| ⬜ | 4 | `b12-js-modules-import-meta-resolve` | Node 20+ resolvaa specifierin suhteessa moduuliin? |
| ⬜ | 3 | `b12-js-modules-import-order` | ESM importit hoistataan — sivuvaikutus järjestyksessä? |
| ⬜ | 2 | `b12-js-modules-mjs-cjs-ext` | Node ESM-tiedosto ilman type module? |
| ⬜ | 3 | `b12-js-modules-namespace-import` | import * as utils from './utils.js' — utils on? |
| ⬜ | 4 | `b12-js-modules-package-exports` | package.json exports kenttä — miksi? |
| ⬜ | 3 | `b12-js-modules-reexport` | index.js barrel tiedosto uudelleenexporttaa `./utils.js` ja `./api.js`.… |
| ⬜ | 3 | `b12-js-modules-resolve-alias` | Monorepossa `@app/utils` pitää resolvautua `packages/utils/src`. Missä … |
| ⬜ | 3 | `b12-js-modules-side-effects` | Bundleri poistaa `import './polyfill.js'` tree-shakingissa ja polyfill … |
| ⬜ | 2 | `b12-js-modules-specifier-must-relative` | import from 'lodash' vs './lodash.js' — ero? |
| ⬜ | 4 | `b12-js-modules-treeshake-pure` | Bundleri säilyttää kuolleen koodin side-effect funktiossa. Annotaatio? |
| ⬜ | 2 | `b12-js-modules-type-module` | Node-projekti käyttää `import` ilman Babelia. package.json-asetus? |
| ⬜ | 4 | `b12-js-modules-wasm-import` | WebAssembly moduuli ESM:ssä? |
| ⬜ | 4 | `exp-js-modules-cycle` | Circular import: a.js importtaa b.js ja toisin päin — export undefined … |
| ⬜ | 3 | `exp-js-modules-dynamic-import` | Admin-näkymän bundle on liian iso — haluat ladata sen vain admin-reitil… |
| ⬜ | 3 | `exp-js-modules-top-level-await` | config.mjs pitää ladata ennen appin init — callback pyramid. Moderni mo… |
| ⬜ | 3 | `js-modules-static-import` | Miten tuot moduulin `utils.js` funktion `format` ESM-tyylillä? |

#### JS-runtime `js-runtime` (0/55)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `b02-js-runtime-closure-12` | for-loopissa 10 timeoutia tulostaa kaikki 10 — klassinen bugi. Fix? |
| ⬜ | 4 | `b02-js-runtime-pollution-14` | Käyttäjän JSON merge objektiin — `__proto__` payload. Miten estät? |
| ⬜ | 4 | `b02-js-runtime-weakmap-13` | Metadata cache objekteille — Map pitää objektit elossa muistivuotona. V… |
| ⬜ | 2 | `b03-js-runtime-array-flatmap` | Lista kategorioista joissa items-array — tarvitset yhden tason listan k… |
| ⬜ | 3 | `b03-js-runtime-error-cause` | API wrapper haluaa säilyttää alkuperäisen virheen ketjun loggauksessa. … |
| ⬜ | 2 | `b03-js-runtime-map-vs-object` | Cache avaimena objekti-instanssi — Object keys eivät toimi odotetusti. … |
| ⬜ | 3 | `b03-js-runtime-structured-clone` | Deep copy state Redux-storeen JSON.parse(JSON.stringify(obj)) — Date mu… |
| ⬜ | 3 | `b04-js-runtime-error-cause` | fetch wrapper heittää uuden Error('API failed') — alkuperäinen stack ka… |
| ⬜ | 4 | `b04-js-runtime-gc-closure` | SPA muistin käyttö kasvaa navigoidessa — vanhat DOM-viittaukset closure… |
| ⬜ | 4 | `b04-js-runtime-structured-clone` | JSON.parse(JSON.stringify(obj)) rikkoo Date-objektit ja undefined-kentä… |
| ⬜ | 4 | `b05-js-fetch-cors-preflight` | POST JSON toiselle domainille — selain lähettää OPTIONS ensin. Miksi? |
| ⬜ | 3 | `b05-js-runtime-closure-stale` | for-silmukassa 5 nappia — kaikki tulostavat 5. Klassinen bugi. Korjaus? |
| ⬜ | 3 | `b05-js-runtime-dom-reflow` | Silmukka lukee offsetHeight ja muuttaa stylea jokaisella kierroksella —… |
| ⬜ | 4 | `b05-js-runtime-prototype-pollution` | Deep merge user JSON:sta — attacker lähettää `{"__proto__": {"isAdmin":… |
| ⬜ | 2 | `b06-js-runtime-console-trace` | Debug — tarvitset call stack ilman breakpointia. Mitä console-metodia? |
| ⬜ | 5 | `b06-js-runtime-finalization-registry` | WeakRef ei takaa cleanup — tarvitset callback kun objekti GC:ttä. Mitä … |
| ⬜ | 4 | `b06-js-runtime-json-parse-reviver` | JSON.parse palauttaa date stringit — haluat Date-objekteja automaattise… |
| ⬜ | 4 | `b06-js-runtime-proxy-freeze` | Object.freeze ei estä nested muutoksia — config objekti mutatoitu. Mite… |
| ⬜ | 3 | `b07-js-runtime-closure-loop` | for-loopissa 5 click-handleria — kaikki tulostavat 5. Klassinen bugi ja… |
| ⬜ | 2 | `b07-js-runtime-json-parse` | API palauttaa JSON-stringin — eval(data) parseen. Turvallinen tapa? |
| ⬜ | 3 | `b07-js-runtime-prototype` | Kaikki array-instanssit saivat uuden metodin forEachin jälkeen — mitä t… |
| ⬜ | 4 | `b07-js-runtime-weakmap` | Cache Map DOM-elementeistä aiheuttaa memory leakin sivun vaihtuessa. Pa… |
| ⬜ | 3 | `b08-js-runtime-closure-loop` | for (var i=0; i<3; i++) { setTimeout(() => console.log(i), 0); } tulost… |
| ⬜ | 2 | `b08-js-runtime-dom-ready` | Script headissä — document.getElementById palauttaa null. Milloin DOM o… |
| ⬜ | 3 | `b08-js-runtime-prototype-chain` | `obj.toString()` toimii vaikka obj:ssa ei ole toString — miten? |
| ⬜ | 4 | `b08-js-runtime-weakmap` | DOM-elementtiin liitetty metadata — Map aiheuttaa memory leakin kun ele… |
| ⬜ | 4 | `b09-js-runtime-closure-leak` | SPA:n muisti kasvaa navigoidessa — DevTools näyttää detached DOM -nodej… |
| ⬜ | 2 | `b09-js-runtime-debounce-search` | Hakukenttä laukaisee API-kutsun jokaisella näppäinpainalluksella. Optim… |
| ⬜ | 3 | `b09-js-runtime-raf-animation` | Custom animaatio pätkii — setInterval 16 ms ei synkronoidu näytön refre… |
| ⬜ | 3 | `b09-js-runtime-weakmap-cache` | Cacheta metadata DOM-elementeille ilman että estät GC:n poistamasta ele… |
| ⬜ | 4 | `b12-js-runtime-arraybuffer-view` | Binary data WebSocketista — tyyppi ennen käsittelyä? |
| ⬜ | 2 | `b12-js-runtime-computed-property` | Objekti { [key]: value } — mitä hakasulut tekevät? |
| ⬜ | 2 | `b12-js-runtime-custom-event` | Komponentit kommunikoivat ilman props-ketjua. DOM-ratkaisu? |
| ⬜ | 3 | `b12-js-runtime-domparser` | Parse HTML string turvallisesti ilman innerHTML suoraa? |
| ⬜ | 4 | `b12-js-runtime-error-stack-limit` | Recursive funktio RangeError Maximum call stack. Syy? |
| ⬜ | 2 | `b12-js-runtime-event-delegation` | Lista renderöi 500 riviä — jokaiselle riville oma click-listener. Suori… |
| ⬜ | 3 | `b12-js-runtime-intersection-observer` | Lazy-load kuvat kun scrollaa näkyviin. API? |
| ⬜ | 3 | `b12-js-runtime-intl-collator` | Järjestät suomenkielisiä nimiä — localeCompare vs Intl.Collator? |
| ⬜ | 3 | `b12-js-runtime-label-break` | Sisäkkäisestä silmukasta ulos kahdesta tasosta. Lähestymistapa? |
| ⬜ | 3 | `b12-js-runtime-mutation-observer` | Kolmas osapuoli injektoi DOM-muutoksia — haluat reagoida. API? |
| ⬜ | 3 | `b12-js-runtime-object-freeze` | Redux-tyylinen store haluaa estää suoran state-mutaation. Shallow-immut… |
| ⬜ | 3 | `b12-js-runtime-performance-now` | Mittaat koodin keston tarkasti — Date.now() vs performance.now()? |
| ⬜ | 4 | `b12-js-runtime-proxy-trap` | Haluat logata kaikki objektin property-luvut debugissa. Metaprogramming… |
| ⬜ | 2 | `b12-js-runtime-raf-vs-timeout` | Animaatio päivittää DOM-elementin sijaintia 60 fps. Parempi kuin setInt… |
| ⬜ | 3 | `b12-js-runtime-regex-exec` | global regex lastIndex bug loopissa — syy? |
| ⬜ | 3 | `b12-js-runtime-resize-observer` | CSS grid resize — haluat mitata elementin koon muutokset. API? |
| ⬜ | 2 | `b12-js-runtime-set-map-iteration` | Set säilyttää uniikit — lisäät duplikaatin. Mitä tapahtuu? |
| ⬜ | 5 | `b12-js-runtime-tail-call` | ES6 tail call optimization — status JS-engingeissä? |
| ⬜ | 5 | `b12-js-runtime-weakref-cache` | Cache viittaa isoihin objekteihin ja estää GC:n vaikka UI on vapauttanu… |
| ⬜ | 3 | `b12-js-runtime-weakset-gc` | WeakSet vs Set objektiavainten jäljitykseen DOM-nodeille? |
| ⬜ | 4 | `exp-js-runtime-closure-stale` | React bugi: useEffect closure näkee vanhan `count`-arvon — interval log… |
| ⬜ | 4 | `exp-js-runtime-memory-detached` | Web Worker postMessage hidastuu — suuri ArrayBuffer kopioidaan joka vie… |
| ⬜ | 5 | `exp-js-runtime-prototype-pollution` | Code review: `merge(userInput, defaults)` kopioi avaimet rekursiivisest… |
| ⬜ | 3 | `exp-js-runtime-weakmap-cache` | DOM-elementtiin liitetty metadata aiheuttaa memory leakin Mapissa. Pare… |
| ⬜ | 4 | `js-runtime-closure-loop` | for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); } — … |

#### JavaScript-tyypit `js-types` (0/50)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 2 | `b02-js-types-coalesce-06` | Config `port` voi olla 0 — oletus 3000 vain jos null/undefined. Operaat… |
| ⬜ | 2 | `b02-js-types-optional-05` | API palauttaa `{ name?: string }` — miten luet turvallisesti ilman unde… |
| ⬜ | 2 | `b02-js-types-strict-07` | Bugi: `if (count == '0')` menee läpi kun count on 0. Fix? |
| ⬜ | 3 | `b03-js-types-number-precision` | Laskin näyttää 0.1 + 0.2 === 0.3 false — laskutuskoodi valittaa senteis… |
| ⬜ | 2 | `b03-js-types-optional-chaining` | API-vastaus voi olla null — `user.profile.name` kaataa tuotannossa. Mod… |
| ⬜ | 4 | `b03-js-types-symbol-key` | Kirjasto haluaa piilottaa metadatan objektista ilman name collision -ri… |
| ⬜ | 2 | `b04-js-types-array-flat` | Nested array [[1,[2]],3] pitää litistää yhdeksi tasoksi. Moderni metodi? |
| ⬜ | 3 | `b04-js-types-number-precision` | Laskin: 0.1 + 0.2 === 0.3 palauttaa false tuotannossa. Miksi? |
| ⬜ | 2 | `b04-js-types-optional-chaining` | API-vastaus voi olla null — `user.profile.name` kaataa. Moderni turvall… |
| ⬜ | 4 | `b04-js-types-symbol-iterator` | Custom collection-luokka pitää saada toimimaan for...of ja spread-opera… |
| ⬜ | 4 | `b05-js-types-bigint-json` | JSON.stringify(BigInt(42)) heittää TypeError. Miksi? |
| ⬜ | 2 | `b05-js-types-nullish-coalescing` | API palauttaa `{ count: 0 }` — `value || 10` antaa 10. Oikea oletus vai… |
| ⬜ | 2 | `b05-js-types-strict-equality` | Code review: `if (status == '200')` — miksi pyydetään muutosta? |
| ⬜ | 2 | `b06-js-types-in-operator` | Code review: 'key' in obj vs obj.hasOwnProperty(key). Milloin in on oik… |
| ⬜ | 3 | `b06-js-types-map-key-object` | Objekti avaimena Mapissa — sama key instance löytyy. Miksi ei Object av… |
| ⬜ | 3 | `b06-js-types-temporal-date` | Date.parse('01/02/2023') tulos vaihtelee locale:sta. Miten vältät? |
| ⬜ | 3 | `b07-js-types-nan` | parseInt palauttaa NaN — if (x === NaN) ei toimi. Oikea testi? |
| ⬜ | 2 | `b07-js-types-optional-chain` | Cannot read property name of undefined — syvä objektipolku API-vastauks… |
| ⬜ | 2 | `b07-js-types-strict-equality` | Bug: `if (!userId)` hylkää validin arvon `0`. Mikä tarkistus on turvall… |
| ⬜ | 3 | `b08-js-types-bigint` | 64-bit ID ylittää Number.MAX_SAFE_INTEGER — JSON API palauttaa ison num… |
| ⬜ | 2 | `b08-js-types-strict-equals` | API hylkää vain `if (token == null) return unauthorized()`. Mikä arvo p… |
| ⬜ | 3 | `b08-js-types-symbol-key` | Haluat piilottaa objektin sisäisen avaimen for-in loopilta mutta käyttä… |
| ⬜ | 4 | `b09-js-types-bigint-json` | API palauttaa 64-bit ID:n — JSON.stringify heittää BigInt:illä. Ratkais… |
| ⬜ | 3 | `b09-js-types-null-object` | Bugi: `typeof null === 'object'`. Turvallinen null-tarkistus? |
| ⬜ | 2 | `b09-js-types-strict-equality` | Code review: `if (userId == 0)` hyväksyy myös tyhjän stringin. Korjaus? |
| ⬜ | 1 | `b12-js-types-array-push` | Lista `items = []` — haluat lisätä uuden rivin loppuun. Metodi? |
| ⬜ | 1 | `b12-js-types-const-reassign` | Junior yrittää `const x = 1; x = 2;` — linter valittaa. Miksi? |
| ⬜ | 2 | `b12-js-types-destructure-default` | Destructuroit { name, role = 'user' } — role puuttuu. Arvo? |
| ⬜ | 3 | `b12-js-types-instanceof-array` | Miksi `[] instanceof Object` on true mutta Array.isArray suositeltu? |
| ⬜ | 3 | `b12-js-types-intl-numberformat` | Näytät hinnan suomalaiselle käyttäjälle: 1234.5 → '1 234,50 €'. API? |
| ⬜ | 2 | `b12-js-types-isarray` | Funktio saa `data` joka voi olla array tai array-like. Luotettava tarki… |
| ⬜ | 2 | `b12-js-types-json-stringify` | API lähettää objektin HTTP-bodyna. Miten muunnat JS-objektin JSON-merkk… |
| ⬜ | 1 | `b12-js-types-let-block` | for-silmukassa `var i` vuotaa loopin ulkopuolelle. Turvallisempi vaihto… |
| ⬜ | 2 | `b12-js-types-nan-check` | Laskenta palauttaa NaN — `value === NaN` on aina false. Miten tarkistat? |
| ⬜ | 3 | `b12-js-types-object-keys-values` | Haluat iteroida objektin arvot ilman for...in prototyypin perintää. Met… |
| ⬜ | 2 | `b12-js-types-object-shorthand` | Rakennat API-payloadin: muuttujat `id` ja `name` ovat valmiina. Lyhyin … |
| ⬜ | 3 | `b12-js-types-parseint-radix` | parseInt('08') vanhassa JS:ssä — miksi radix 10 on pakollinen? |
| ⬜ | 2 | `b12-js-types-rest-params` | Funktio `sum(...nums)` — mitä ...nums tarkoittaa? |
| ⬜ | 2 | `b12-js-types-spread-copy` | Haluat kopioda taulukon ilman että muokkaat alkuperäistä pushilla. Nope… |
| ⬜ | 3 | `b12-js-types-structured-equality` | Kaksi eri objektia {a:1} ja {a:1} — {} === {} on false. Miksi? |
| ⬜ | 4 | `b12-js-types-symbol-tostring` | Object.keys() ei näytä Symbol-avaimia. Miten iteroidaan ne? |
| ⬜ | 1 | `b12-js-types-template-literal` | Haluat yhdistää `Hei ${name}` ilman + -ketjua. Mikä syntaksi? |
| ⬜ | 4 | `b12-js-types-temporal-api` | Date on mutatoitava ja timezone-bugeja. Moderni ES-proposal korvaajaksi? |
| ⬜ | 2 | `b12-js-types-truthy-falsy` | Lomakevalidointi: `if (!value)` hylkää syötteen '0'. Parempi tarkistus … |
| ⬜ | 1 | `b12-js-types-typeof-string` | Mikä `typeof 'hello'` palauttaa? |
| ⬜ | 4 | `exp-js-types-bigint-json` | API palauttaa 64-bit ID:n — JSON.parse menettää tarkkuuden. Miten käsit… |
| ⬜ | 2 | `exp-js-types-nullish-coalescing` | Config `timeout: 0` korvautuu oletuksella 5000 koska koodi käyttää `||`… |
| ⬜ | 2 | `exp-js-types-strict-equality` | Auth-bugi: `if (!token)` hylkää validin tyhjän merkkijonon `''` ja sall… |
| ⬜ | 3 | `js-types-null-object` | Miksi `typeof null === 'object'` on historiallinen ansa? |
| ⬜ | 2 | `js-types-strict-eq` | Miksi `===` on turvallisempi kuin `==` vertailussa? |

#### TypeScript `js-typescript` (0/21)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `b12-ts-as-const` | const config = { mode: 'dev' } as const — hyöty? |
| ⬜ | 2 | `b12-ts-basic-enum-string` | Tila voi olla 'draft' | 'published' | 'archived'. Tyypitetty vakiomuoto… |
| ⬜ | 1 | `b12-ts-basic-interface-shape` | API-vastauksella on kentät `id` ja `title`. Miten kuvailet muodon TS:ss… |
| ⬜ | 1 | `b12-ts-basic-primitive-types` | TypeScriptissä haluat merkitä että `age` on kokonaisluku. Tyyppi? |
| ⬜ | 2 | `b12-ts-basic-type-annotation-fn` | Funktio `add(a, b)` palauttaa summan. Parametrien ja paluuarvon tyypity… |
| ⬜ | 2 | `b12-ts-basic-union-null` | Funktio voi palauttaa käyttäjän tai null jos ei löydy. Paluutyyppi? |
| ⬜ | 5 | `b12-ts-conditional-type` | type IsString<T> = T extends string ? true : false — laji? |
| ⬜ | 4 | `b12-ts-generic-constraint` | T extends { id: string } — tarkoitus? |
| ⬜ | 3 | `b12-ts-generic-function` | identity<T>(arg: T): T — miksi generic? |
| ⬜ | 2 | `b12-ts-interface-extends` | BaseUser + adminRole — miten laajennat? |
| ⬜ | 5 | `b12-ts-mapped-type` | type ReadonlyFields<T> = { readonly [K in keyof T]: T[K] } |
| ⬜ | 3 | `b12-ts-narrowing-in` | if ('kind' in obj) — mitä tämä tekee? |
| ⬜ | 2 | `b12-ts-narrowing-typeof` | function log(x: string | number) — x.toFixed()? |
| ⬜ | 5 | `b12-ts-never-exhaustive` | switch union — default: const _x: never = x. Tarkoitus? |
| ⬜ | 3 | `b12-ts-readonly-array` | readonly string[] vs string[] — ero? |
| ⬜ | 4 | `b12-ts-satisfies` | const palette = { red: '#f00' } satisfies Record<string, string> — hyöt… |
| ⬜ | 4 | `b12-ts-strict-null` | strictNullChecks päällä — mikä muuttuu? |
| ⬜ | 3 | `b12-ts-type-vs-interface` | Milloin type alias parempi kuin interface? |
| ⬜ | 3 | `b12-ts-utility-partial` | Update DTO sallii osan kentistä. Utility type? |
| ⬜ | 3 | `b12-ts-utility-pick-omit` | Julkinen API-tyyppi ilman salaisia kenttiä. Kaksi vaihtoehtoa? |
| ⬜ | 4 | `prod-js-unknown-vs-any` | API palauttaa tuntematonta JSON-dataa TypeScriptissä. Miksi `unknown` o… |

### PostgreSQL (34/204)

#### PostgreSQL-konfig `pg-config` (33/33)

| | diff | id | kysymys |
|---|------|-----|---------|
| ✅ | 3 | `b02-pg-config-connections-15` | 500 microservice instanssia × 10 connection = pool explosion. Ratkaisu? |
| ✅ | 3 | `b02-pg-config-shared-14` | PostgreSQL cache hit ratio matala — ensimmäinen muistiparametri tarkist… |
| ✅ | 4 | `b02-pg-config-work-mem-13` | Iso sort/hash join spillaa diskiin — logissa 'temporary file'. Parametr… |
| ✅ | 3 | `b03-pg-config-effective-cache` | Planner valitsee seq scanin vaikka data mahtuu muistiin — SSD-palvelin … |
| ✅ | 3 | `b03-pg-config-random-page-cost` | Migrated DB SSD:lle — index scan suunnitelmat ovat hitaita. Säädä? |
| ✅ | 3 | `b03-pg-config-ssl-mode` | App yhdistää Postgresiin internetin yli — compliance vaatii salatun yht… |
| ✅ | 3 | `b03-pg-config-statements-ext` | Tuotannossa hidas query tuntematon — haluat top 10 CPU-kuluttajaa histo… |
| ✅ | 3 | `b04-pg-config-effective-cache` | Planner aliarvioi index scan hyödyn — effective_cache_size on default 4… |
| ✅ | 3 | `b04-pg-config-log-min-duration` | Haluat lokittaa vain > 500ms kestävät kyselyt tuotannossa ilman kaiken … |
| ✅ | 4 | `b04-pg-config-maintenance-work-mem` | CREATE INDEX kestää tunteja isolla taululla — logissa 'external sort'. … |
| ✅ | 3 | `b05-pg-config-log-min-duration` | Haluat lokittaa vain > 500ms kestävät queryt tuotannossa. Mikä GUC? |
| ✅ | 3 | `b05-pg-config-shared-buffers` | 16 GB RAM palvelin — shared_buffers on 128MB oletus. Tyypillinen lähtös… |
| ✅ | 4 | `b05-pg-config-work-mem-sort` | Monimutkainen sort overflowaa levylle — temp files kasvavat. Mikä param… |
| ✅ | 3 | `b06-pg-config-checkpoint-timeout` | Tuotanto I/O spike joka 5 min — checkpoint aiheuttaa. Mitä säätät? |
| ✅ | 5 | `b06-pg-config-huge-pages` | Suuri shared_buffers — TLB miss hidastaa. Mitä Linux + PostgreSQL optim… |
| ✅ | 3 | `b06-pg-config-parallel-workers` | Raporttikysely ei parallelize — seq scan yksin. Mitä parametria nostat? |
| ✅ | 4 | `b06-pg-config-track-io-timing` | pg_stat_statements näyttää query time mutta ei I/O breakdown. Mitä enab… |
| ✅ | 4 | `b06-pg-locks-advisory` | App-tason mutex kahden workerin välillä — ei taululock. Mitä PostgreSQL… |
| ✅ | 2 | `b07-pg-config-log-slow` | Haluat lokittaa hitaat queryt tuotannossa. postgresql.conf? |
| ✅ | 3 | `b07-pg-config-shared-buffers` | Uusi DB-palvelin 32 GB RAM — shared_buffers oletuksessa. Tyypillinen lä… |
| ✅ | 4 | `b07-pg-config-work-mem` | Monimutkainen sort spillaa diskiin — logissa temporary file. Mitä nosta… |
| ✅ | 4 | `b08-pg-config-checkpoint` | IO-spike joka 5 min — checkpoint_completion_target ja checkpoint_timeou… |
| ✅ | 3 | `b08-pg-config-max-connections` | Sovellus avaa 500 suoraa PG-yhteyttä — CPU context switch helvetti. Ark… |
| ✅ | 3 | `b08-pg-config-shared-buffers` | Uusi dedicated DB-palvelin 32 GB RAM — shared_buffers alussa oletus. Ty… |
| ✅ | 4 | `b08-pg-config-work-mem` | Monimutkainen sort/hash query spillaa diskiin — temp files kasvavat. Pa… |
| ✅ | 3 | `b09-pg-config-pgbouncer-pool` | 500 microservice-instanssia avaa oman PG-yhteyden — `too many connectio… |
| ✅ | 3 | `b09-pg-config-shared-buffers` | Uusi DB-palvelin 32 GB RAM — DBA säätää shared_buffers. Tyypillinen läh… |
| ✅ | 4 | `b09-pg-config-work-mem` | Monimutkaiset sort/hash JOINit spillaa diskiin — temp files kasvaa. Par… |
| ✅ | 4 | `b10-pg-config-shared-buffers-01` | PostgreSQL cache hit ratio on matala 32 GB RAM -palvelimella. Ensimmäin… |
| ✅ | 3 | `exp-pg-config-max-connections` | App avaa 5000 connectionia microservice-arkkitehtuurissa — CPU context … |
| ✅ | 3 | `exp-pg-config-shared-buffers` | Uusi DB-palvelin 32 GB RAM — junior asettaa shared_buffers = 32GB. Miks… |
| ✅ | 4 | `exp-pg-config-work-mem-sort` | EXPLAIN näyttää Sort → Disk temp file — muistisortti ei mahdu. Mikä GUC… |
| ✅ | 4 | `pg-config-work-mem` | Raskas ORDER BY + hash join spillaavat levylle. Mikä istuntotason asetu… |

#### CTE ja ikkunafunktiot `pg-cte-window` (0/14)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `sqd-cte-materialized-hint` | PostgreSQL 12+: CTE viitataan kerran, mutta planner yhdistää sen pääkys… |
| ⬜ | 3 | `sqd-cte-readability` | Sama alikysely toistuu kolmessa kohdassa raportissa. Miten refaktoroit? |
| ⬜ | 4 | `sqd-first-value-partition` | Jokaiselle tilaukselle tarvitset asiakkaan nimen ilman GROUP BY:ä. Mikä… |
| ⬜ | 4 | `sqd-lag-mom-comparison` | Raportti näyttää kuukausimyynnin ja edellisen kuun eron samalla rivillä… |
| ⬜ | 3 | `sqd-lead-future-row` | Seuraavan tilauksen päivämäärä samalla rivillä nykyisen kanssa. Funktio? |
| ⬜ | 3 | `sqd-ntile-buckets` | Jaa asiakkaat neljään kvartiiliin liikevaihdon mukaan. Funktio? |
| ⬜ | 3 | `sqd-percent-rank-report` | Myyjän prosenttiosuus top-myynnistä raportissa. Ikkunafunktio? |
| ⬜ | 4 | `sqd-pivot-conditional-agg` | Myynti riveinä (product, Q1, Q2, Q3). Ilman crosstab-laajennusta? |
| ⬜ | 3 | `sqd-rank-vs-dense` | Top 3 myyjää; tasapisteet eivät saa hypätä sijaa 4:stä 6:een. Funktio? |
| ⬜ | 4 | `sqd-recursive-cte-hierarchy` | Organisaatiopuu: esimies–alainen hierarkia taulussa `parent_id`. Miten … |
| ⬜ | 4 | `sqd-row-number-dedup` | Tarvitset viimeisimmän tilauksen per asiakas. Mikä ikkunafunktio? |
| ⬜ | 3 | `sqd-running-total` | Kumulatiivinen summa päivittäin ilman correlated subquerya. Ratkaisu? |
| ⬜ | 4 | `sqd-window-frame-rows` | 7 päivän liukuva keskiarvo. Frame-määrittely? |
| ⬜ | 3 | `sqd-window-vs-group-by` | Tarvitset rivin arvon JA koko taulun keskiarvon samalla rivillä ilman s… |

#### EXPLAIN/suunnitelmat `pg-explain` (1/37)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `b02-pg-explain-analyze-05` | Query hidas tuotannossa — haluat todelliset ajat ei arvion. Komento? |
| ⬜ | 4 | `b02-pg-explain-nested-07` | Nested Loop + Seq Scan sisäpuolella miljoona kertaa — tyypillinen fix? |
| ⬜ | 3 | `b02-pg-explain-seq-06` | EXPLAIN näyttää Seq Scan 5M rivin taulussa — aina huono? |
| ⬜ | 3 | `b02-pg-explain-stats-08` | Planner arvioi 100 riviä — todellisuudessa 100000. Ensimmäinen toimenpi… |
| ✅ | 4 | `b03-pg-explain-buffers-hit` | EXPLAIN ANALYZE näyttää hitaudesta — haluat tietää cache hit vs disk re… |
| ⬜ | 4 | `b03-pg-explain-hash-join-memory` | Hash Join spillaa temp tiedostoon — query hidastuu 10x. work_mem liian … |
| ⬜ | 3 | `b03-pg-explain-index-only-scan` | Planner valitsee Index Scan vaikka covering index voisi riittää. Ehto I… |
| ⬜ | 4 | `b03-pg-explain-isolation-level` | Raportti lukee saman rivin kahdesti saman transactionin aikana — toinen… |
| ⬜ | 4 | `b04-pg-explain-buffers-io` | EXPLAIN ANALYZE näyttää korkean execution timen mutta ei kerro onko hit… |
| ⬜ | 4 | `b04-pg-explain-cost-settings` | SSD-levyllä planner suosii seq scaneja liikaa — random_page_cost oletus… |
| ⬜ | 4 | `b04-pg-explain-index-only` | EXPLAIN näyttää Index Scan mutta ei Index Only Scan — mitä puuttuu usei… |
| ⬜ | 4 | `b04-pg-explain-parallel` | Iso aggregation ei käytä parallel workers vaikka max_parallel_workers_p… |
| ⬜ | 4 | `b05-pg-explain-analyze-buffers` | Query hidas — epäilet levylukemista cache-missin vuoksi. Mitä EXPLAIN-l… |
| ⬜ | 3 | `b05-pg-explain-hash-join` | EXPLAIN näyttää Hash Join kahden ison taulun välillä — muisti loppuu. V… |
| ⬜ | 4 | `b05-pg-explain-index-only-scan` | EXPLAIN: Index Scan + Heap Fetches jokaiselle riville. Miten saat Index… |
| ⬜ | 3 | `b05-pg-explain-stats-stale` | Planner valitsee seq scan vaikka indeksi on olemassa — ANALYZE ajettu k… |
| ⬜ | 4 | `b06-pg-explain-generic-plan` | Prepared statement plan on hidas eri parametreilla. Miten näet generic … |
| ⬜ | 4 | `b06-pg-explain-misestimate-rows` | Planner valitsee seq scan — rows estimate 10 mutta actual 10M. Juurisyy? |
| ⬜ | 5 | `b06-pg-explain-wal-fpi` | EXPLAIN (ANALYZE, BUFFERS) näyttää korkeat shared_blks_read. Mitä WAL/F… |
| ⬜ | 4 | `b07-pg-explain-analyze-buffers` | Query hidas — EXPLAIN näyttää Seq Scan mutta et tiedä onko cache-osuma.… |
| ⬜ | 4 | `b07-pg-explain-nested-loop` | Nested Loop cost 500000 — pieni taulu ison kanssa ilman indeksiä. Korja… |
| ⬜ | 3 | `b07-pg-explain-prepare` | Sovellus ajaa saman SQL:n parametreilla miljoonia kertoja — parse overh… |
| ⬜ | 3 | `b07-pg-explain-seq-vs-index` | Planner valitsee Seq Scan vaikka indeksi on olemassa. Yleisin syy piene… |
| ⬜ | 4 | `b08-pg-explain-analyze-buffers` | EXPLAIN ANALYZE näyttää hitaan queryn — haluat nähdä cache vs disk I/O.… |
| ⬜ | 3 | `b08-pg-explain-cost-settings` | Planner valitsee Seq Scan SSD-palvelimella vaikka indeksi näyttää halve… |
| ⬜ | 4 | `b08-pg-explain-nested-loop` | Nested Loop + Seq Scan sisäpuolella miljoona riviä — hidas join. Milloi… |
| ⬜ | 3 | `b08-pg-explain-seq-scan` | Pieni taulu — planner valitsee Seq Scan vaikka indeksi on. Todennäköisi… |
| ⬜ | 4 | `b09-pg-explain-analyze-buffers` | Kysely on hidas mutta EXPLAIN cost näyttää pieneltä. Seuraava diagnosti… |
| ⬜ | 3 | `b09-pg-explain-missing-stats` | Bulk INSERT jälkeen kyselyt käyttävät väärää suunnitelmaa. Nopea korjau… |
| ⬜ | 4 | `b09-pg-explain-nested-loop` | JOIN 100k × 100k riviä — Nested Loop cost 10^9. Mitä plannerin pitäisi … |
| ⬜ | 3 | `b09-pg-explain-seq-scan-large` | EXPLAIN näyttää Seq Scan 5M rivin taulussa vaikka index on olemassa. En… |
| ⬜ | 4 | `exp-pg-explain-analyze-buffers` | EXPLAIN näyttää Index Scan mutta query hidas — epäilet cache-missiä. Mi… |
| ⬜ | 4 | `exp-pg-explain-nested-loop` | JOIN palauttaa miljoona riviä — plan näyttää Nested Loop ja seq scan is… |
| ⬜ | 3 | `exp-pg-explain-seq-scan-ok` | Junior haluaa poistaa seq scanin pienestä lookup-taulusta (200 riviä). … |
| ⬜ | 4 | `exp-pg-explain-stats-stale` | Plan muuttui yllättäen huonoksi bulk loadin jälkeen — row estimate väär… |
| ⬜ | 4 | `pg-explain-analyze` | Kysely hidastui tuotannossa. Ennen konfiguraation säätöä: miten näet to… |
| ⬜ | 3 | `pg-explain-seq-scan` | EXPLAIN näyttää Seq Scan isolla taululla vaikka indeksi on. Tyypillisin… |

#### PostgreSQL-indeksit `pg-indexes` (0/38)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 2 | `b02-pg-indexes-btree-02` | WHERE status = 'active' AND created_at > '2024-01-01' — yleisin indeksi… |
| ⬜ | 4 | `b02-pg-indexes-covering-04` | Query tarvitsee id, email — index only scan halutaan. PostgreSQL 11+? |
| ⬜ | 3 | `b02-pg-indexes-gin-01` | JSONB-kenttä `metadata @> '{"tag": "urgent"}'` — seq scan hidas. Indeks… |
| ⬜ | 3 | `b02-pg-indexes-partial-03` | Indeksi vain active riveille — 90% archived. Optimointi? |
| ⬜ | 3 | `b03-pg-indexes-concurrent-create` | Tuotantotauluun uusi indeksi — CREATE INDEX lukitsee kirjoitukset. Onli… |
| ⬜ | 4 | `b03-pg-indexes-fillfactor-update` | Heavy HOT update -taulu bloataa nopeasti vaikka autovacuum päällä. Taul… |
| ⬜ | 4 | `b03-pg-indexes-gin-jsonb` | JSONB metadata-kenttä `@> '{"status":"active"}'` query hidas seq scan. … |
| ⬜ | 4 | `b03-pg-locks-blocking-query` | UPDATE jää odottamaan — pg_stat_activity näyttää wait_event lock. Ensim… |
| ⬜ | 4 | `b04-pg-indexes-concurrent-create` | Tuotantotauluun uusi indeksi — CREATE INDEX lukitsee kirjoitukset tunte… |
| ⬜ | 4 | `b04-pg-indexes-expression` | Kysely `WHERE lower(email) = 'foo@bar.com'` — indeksi email-sarakkeella… |
| ⬜ | 4 | `b04-pg-indexes-gin-jsonb` | Kysely `WHERE data @> '{"status":"active"}'` JSONB-sarakkeessa on hidas… |
| ⬜ | 3 | `b04-pg-indexes-partial-active` | 90 % riveistä archived=true — kyselyt vain active=false. Indeksioptimoi… |
| ⬜ | 3 | `b05-pg-indexes-concurrent-create` | Iso tuotantotaulu — CREATE INDEX lukitsee kirjoitukset. Miten luot inde… |
| ⬜ | 2 | `b05-pg-indexes-duplicate-drop` | Kaksi identtistä btree-indeksiä samoille sarakkeille — kirjoitus hidast… |
| ⬜ | 4 | `b05-pg-indexes-expression` | Haku: `WHERE lower(email) = 'user@example.com'`. Tavallinen btree email… |
| ⬜ | 4 | `b05-pg-indexes-gin-jsonb` | Query: `WHERE data @> '{"status": "active"}'` JSONB-sarakkeessa — seq s… |
| ⬜ | 4 | `b06-pg-indexes-brin-timeseries` | Aikasarjataulu — miljardi rivi, queries aikarangeilla. Kustannustehokas… |
| ⬜ | 3 | `b06-pg-indexes-hash-index` | Equality-haku UUID-sarakkeessa — btree on hidas suurilla tauluilla. Mil… |
| ⬜ | 3 | `b06-pg-indexes-include-columns` | Index-only scan ei toteudu — query tarvitsee sarakkeet jotka ei indexis… |
| ⬜ | 4 | `b06-pg-indexes-reindex-concurrently` | Bloated index tuotannossa — REINDEX lukitsee taulu. Miten ilman downtim… |
| ⬜ | 3 | `b07-pg-index-btree-vs-gin` | JSONB @> query on hidas seq scanilla. Mikä indeksityyppi? |
| ⬜ | 4 | `b07-pg-index-covering` | EXPLAIN näyttää Index Scan + Heap Fetch — query tarvitsee kaksi saraket… |
| ⬜ | 4 | `b07-pg-index-partial` | Indeksi on iso mutta 80 % riveistä on deleted_at IS NOT NULL. Tehokkaam… |
| ⬜ | 3 | `b07-pg-index-unused` | Kirjoitus hidasta — pg_stat_user_indexes näyttää idx_scan=0 usealle ind… |
| ⬜ | 4 | `b08-pg-indexes-btree-gist` | Geo-query: `WHERE location && box` — btree ei toimi. Indeksityyppi? |
| ⬜ | 4 | `b08-pg-indexes-covering` | EXPLAIN: Index Scan + Heap Fetch hidastaa — query tarvitsee vain indeks… |
| ⬜ | 3 | `b08-pg-indexes-multicolumn-order` | Indeksi (a,b) — query WHERE b=1 ei käytä indeksiä tehokkaasti. Miksi? |
| ⬜ | 4 | `b08-pg-indexes-partial` | Query: `WHERE status = 'active'` — 95% rivistä archived. Indeksi koko t… |
| ⬜ | 4 | `b09-pg-index-composite-order` | Kysely `WHERE tenant_id = ? AND created_at > ?` — index (created_at, te… |
| ⬜ | 3 | `b09-pg-index-gin-jsonb` | JSONB-kentässä haku `@>` containment-operaatiolla on hidas seq scan. In… |
| ⬜ | 4 | `b09-pg-index-partial-active` | Kysely hakee vain `status = 'active'` rivejä 10M taulusta — index on su… |
| ⬜ | 3 | `b09-pg-index-unused-drop` | pg_stat_user_indexes näyttää idx_reports_date never used — mutta INSERT… |
| ⬜ | 3 | `exp-pg-indexes-btree-composite` | Query: WHERE tenant_id = ? AND created_at > ? ORDER BY created_at. Yksi… |
| ⬜ | 4 | `exp-pg-indexes-covering` | EXPLAIN näyttää Index Scan mutta silti heap fetch jokaiselle riville SE… |
| ⬜ | 3 | `exp-pg-indexes-partial-active` | Taulussa 10M riviä mutta 99 % archived=true. Indeksi hakuun active rive… |
| ⬜ | 3 | `exp-pg-indexes-unused-drop` | Kirjoitus hidasta — pg_stat_user_indexes näyttää idx_scan = 0 kuukausie… |
| ⬜ | 3 | `pg-indexes-btree-selective` | Taulussa 10M riviä, kysely `WHERE status = 'active'` palauttaa 2 % rive… |
| ⬜ | 5 | `pg-indexes-partial` | Kyselyt kohdistuvat usein `WHERE archived = false`. Indeksi on iso ja h… |

#### JOIN-kuviot `pg-joins` (0/11)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `sqd-correlated-subquery-cost` | Correlated subquery jokaiselle riville on hidas. Ensimmäinen refaktoroi… |
| ⬜ | 3 | `sqd-exists-vs-in` | Etsi asiakkaat joilla on vähintään yksi avoin tilaus. Mikä on usein teh… |
| ⬜ | 4 | `sqd-filter-outer-join` | LEFT JOIN orders, mutta haluat vain avoimet tilaukset — asiakkaat ilman… |
| ⬜ | 3 | `sqd-inner-vs-left` | Raportti: kaikki asiakkaat, myös ilman tilauksia. Join-tyyppi? |
| ⬜ | 2 | `sqd-join-on-not-where` | ANSI-tyylinen join: ulkoiset suodattimet vs join-ehdot. Missä `orders.s… |
| ⬜ | 4 | `sqd-lateral-top-n` | Kolme viimeisintä tilausta per asiakas ilman window-funktiota. PostgreS… |
| ⬜ | 3 | `sqd-many-to-many-bridge` | Opiskelija–kurssi moni-moneen. Miten haet kurssin opiskelijat? |
| ⬜ | 2 | `sqd-natural-join-avoid` | Tiimi käyttää NATURAL JOIN nopeuteen. Mikä riski? |
| ⬜ | 3 | `sqd-not-exists-anti` | Asiakkaat jotka eivät ole koskaan tilanneet. Malli? |
| ⬜ | 3 | `sqd-null-safe-join` | JOIN kahdella sarakkeella joissa voi olla NULL. Mikä vertailu on turval… |
| ⬜ | 3 | `sqd-semi-join-distinct` | Tarvitset asiakkaat joilla on tilaus — ei tarvitse tilausrivejä. Vältä? |

#### JSON/JSONB-kyselyt `pg-json` (0/9)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `sqd-foreign-data-wrapper` | Data lake -tiedostot S3:ssa, analytiikka SQL:llä PostgreSQListä. Integr… |
| ⬜ | 3 | `sqd-json-aggregate` | Rakenna JSON-array aggregoiduista riveistä raporttiin. |
| ⬜ | 4 | `sqd-json-path-query` | Monimutkainen polku JSONB:ssä SQL:llä (PG 12+). Funktio? |
| ⬜ | 3 | `sqd-json-vs-normalize` | API tallentaa koko vastauksen JSONB:hen. Milloin eriytät sarakkeet? |
| ⬜ | 3 | `sqd-jsonb-array-elements` | JSON-taulukko `tags: ["a","b"]` — yksi rivi per tagi. |
| ⬜ | 3 | `sqd-jsonb-arrow-op` | JSONB-kentässä `{"user":{"email":"a@b.c"}}` — hae email merkkijonona. |
| ⬜ | 3 | `sqd-jsonb-containment` | Etsi rivit joissa JSON sisältää `"status":"active"`. Operaattori? |
| ⬜ | 4 | `sqd-jsonb-gin-index` | Usein `WHERE payload @> ...` jsonb-sarakkeessa. Indeksi? |
| ⬜ | 3 | `sqd-jsonb-set-update` | Päivitä yksi avain JSONB-dokumentissa ilman koko dokumentin korvaamista. |

#### SQL-kyselysuunnittelu `pg-query-design` (0/20)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `sqd-avoid-cartesian` | Kysely palauttaa odottamattoman monta riviä: 1000 × 1000. Todennäköisin… |
| ⬜ | 2 | `sqd-case-format-output` | Raportti Exceliin: status-koodi 1/2/3 pitää näyttää teksteinä. Missä mu… |
| ⬜ | 4 | `sqd-covering-index-design` | Indeksi `(status)` mutta kysely hakee myös `name` ja `email`. Miten väl… |
| ⬜ | 4 | `sqd-crosstab-alternative` | Kuukausittainen myynti sarakkeina (tammi…joulu). PostgreSQL-työkalu? |
| ⬜ | 3 | `sqd-distinct-join-duplicates` | JOIN palauttaa saman asiakkaan viidesti. Raportti tarvitsee yhden rivin… |
| ⬜ | 3 | `sqd-exists-vs-count` | Tarvitset vain tiedon: onko asiakkaalla avoin tilaus. Tehokkain ilmaisu? |
| ⬜ | 3 | `sqd-explain-before-tune` | Kysely hidastui release:n jälkeen. Ensimmäinen askel ennen GUC-säätöä? |
| ⬜ | 3 | `sqd-filter-before-join` | Liität `orders` (50M riviä) ja `customers` (2M). Tarvitset vain viime k… |
| ⬜ | 3 | `sqd-group-by-discipline` | Raportti: summa per alue. SELECT-listassa vain group-by-sarakkeet ja ag… |
| ⬜ | 4 | `sqd-grouping-sets` | Tarvitset summat alueittain, tuoteperheittäin ja grand totalin yhdellä … |
| ⬜ | 3 | `sqd-having-vs-where` | Haluat rivit joissa `status = 'active'` ennen ryhmittelyä. Mihin ehto k… |
| ⬜ | 4 | `sqd-keyset-pagination` | API-sivutus OFFSET 500000 hidastuu. Parempi malli suurille tauluille? |
| ⬜ | 2 | `sqd-limit-preview` | Kehität uutta analytiikkakyselyä tuotantataululle. Miten testaat turval… |
| ⬜ | 3 | `sqd-prepared-statement-plan` | Sama parametrikysely ajetaan miljoonia kertoja. Hyöty prepared statemen… |
| ⬜ | 2 | `sqd-readable-cte-names` | Monivaiheinen raportti on vaikea lukea sisäkkäisillä alikyselyillä. Mit… |
| ⬜ | 3 | `sqd-sargable-where` | Indeksoitu `created_at`-sarake. Mikä WHERE estää indeksin käytön tyypil… |
| ⬜ | 2 | `sqd-select-columns-only` | Raportti tarvitsee vain `order_id` ja `description` miljoonarivisestä `… |
| ⬜ | 2 | `sqd-semicolon-style` | Tiimi jakaa SQL-skriptejä code reviewssa. Mikä käytäntö parantaa ylläpi… |
| ⬜ | 3 | `sqd-subquery-vs-cte-same` | Sisäkkäinen subquery 5 tasoa syvänä. Refaktorointi luettavuuteen? |
| ⬜ | 3 | `sqd-union-all-vs-union` | Yhdistät kahden alueen myyntirivit; duplikaatteja ei pitäisi syntyä. Va… |

#### SQL-turvallisuus `pg-sql-security` (0/8)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `sqd-dynamic-order-by` | API sallii sorttaussarakkeen nimen. Turvallinen toteutus? |
| ⬜ | 2 | `sqd-error-leak` | API palauttaa virheessä koko PostgreSQL-virheilmoituksen asiakkaalle. O… |
| ⬜ | 3 | `sqd-least-privilege-grant` | Raporttisovellus lukee vain yhtä näkymää. Miten myönnät oikeudet? |
| ⬜ | 3 | `sqd-parameterized-query` | Käyttäjän syöte menee WHERE-ehtoon. Miten estät SQL-injektion? |
| ⬜ | 3 | `sqd-readonly-role` | BI-työkalu tarvitsee vain luku-oikeuden. Rooli? |
| ⬜ | 4 | `sqd-rls-policy` | Sama taulu, käyttäjä näkee vain oman tiiminsä rivit. PostgreSQL-ominais… |
| ⬜ | 4 | `sqd-search-path-injection` | Funktio kutsuu `now()` ilman schemaa. Miksi `SET search_path` on riski? |
| ⬜ | 3 | `sqd-view-column-mask` | Analyytikot eivät saa nähdä henkilötunnuksia. Ensimmäinen kerros? |

#### VACUUM/autovacuum `pg-vacuum` (0/34)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `b02-pg-vacuum-bloat-09` | UPDATE-heavy taulu — levy kasvaa vaikka rivimäärä sama. Syy ja toimenpi… |
| ⬜ | 3 | `b02-pg-vacuum-full-12` | Disk nearly full — harkitset VACUUM FULL tuotannossa. Riski? |
| ⬜ | 4 | `b02-pg-vacuum-long-xact-11` | Autovacuum ei siivoa — pg_stat_activity näyttää idle in transaction 8h.… |
| ⬜ | 5 | `b02-pg-vacuum-wrap-10` | Varoitus: database approaching transaction ID wraparound. Kiireellinen … |
| ⬜ | 2 | `b03-pg-vacuum-analyze-stats` | Bulk load jälkeen planner valitsee huonon suunnitelman — stats vanhentu… |
| ⬜ | 4 | `b03-pg-vacuum-freeze-settings` | Heavy insert -taulu lähestyy wraparoundia nopeasti. Autovacuum freeze t… |
| ⬜ | 4 | `b03-pg-vacuum-wraparound-warning` | Logissa 'database must be vacuumed within 10 million transactions' — mi… |
| ⬜ | 3 | `b04-pg-vacuum-analyze-stats` | Planner valitsee seq scanin vaikka indeksi on — pg_stats näyttää vanhen… |
| ⬜ | 3 | `b04-pg-vacuum-dead-tuples` | pg_stat_user_tables näyttää n_dead_tup kasvavan nopeasti UPDATE-heavy t… |
| ⬜ | 5 | `b04-pg-vacuum-freeze-age` | Varoitus: 'database must be vacuumed within 200 million transactions' —… |
| ⬜ | 4 | `b04-pg-vacuum-long-xact` | Autovacuum ei siivoa dead tupleja — pg_stat_activity näyttää 'idle in t… |
| ⬜ | 2 | `b05-pg-vacuum-analyze-after-bulk` | Bulk INSERT 10M riviä yöajossa — aamulla queryt hitaita. Mitä aiot bulk… |
| ⬜ | 4 | `b05-pg-vacuum-bloat-long-xact` | Autovacuum ei vapauta tilaa — pg_stat_activity näyttää 8h vanhan idle t… |
| ⬜ | 4 | `b05-pg-vacuum-full-lock` | DBA ehdottaa VACUUM FULL tuotantotaululle päivällä. Miksi vastustat? |
| ⬜ | 5 | `b05-pg-vacuum-wraparound` | PostgreSQL varoittaa: 'database is not accepting commands to avoid wrap… |
| ⬜ | 3 | `b06-pg-vacuum-autovacuum-scale` | Suuri taulu — autovacuum ei käynnisty tarpeeksi tiukasti. Mitä säätät? |
| ⬜ | 4 | `b06-pg-vacuum-index-cleanup` | VACUUM ei vapauta levytilaa indexeistä — bloat jatkuu. Mitä parametria? |
| ⬜ | 4 | `b06-pg-vacuum-skip-locked` | DELETE job poistaa miljoona riviä — pitkä lock. Miten batch delete? |
| ⬜ | 2 | `b07-pg-vacuum-analyze` | Planner tekee huonoja arvioita bulk INSERTin jälkeen. Mikä ylläpitokome… |
| ⬜ | 3 | `b07-pg-vacuum-autovacuum` | autovacuum ei ehdi — transaction id wraparound varoitus. Ensimmäinen to… |
| ⬜ | 4 | `b07-pg-vacuum-bloat` | Taulu on 10 GB mutta data 2 GB — UPDATE-heavy workload. Mitä tapahtuu? |
| ⬜ | 5 | `b07-pg-vacuum-freeze` | Mitä frozen xmin tarkoittaa PostgreSQL MVCC:ssä? |
| ⬜ | 3 | `b08-pg-vacuum-autovacuum-threshold` | Autovacuum ei käynnisty — dead tuples kasaantuvat. Mitä parametria sääd… |
| ⬜ | 4 | `b08-pg-vacuum-bloat` | Taulu 10 GB mutta 2 GB live data — UPDATE-heavy workload. Ilmiö ja toim… |
| ⬜ | 5 | `b08-pg-vacuum-freeze` | Varoitus: database must be vacuumed before anti-wraparound — mitä uhkaa? |
| ⬜ | 4 | `b09-pg-vacuum-autovacuum-tuning` | Heavy UPDATE -taulu bloattaa nopeammin kuin autovacuum ehtii. Säätö? |
| ⬜ | 4 | `b09-pg-vacuum-bloat-table` | Taulu on 50 GB mutta sisältää paljon dead tupleja — pg_stat_user_tables… |
| ⬜ | 5 | `b09-pg-vacuum-freeze-age` | Varoitus: `database must be vacuumed within 200 million transactions`. … |
| ⬜ | 3 | `b09-pg-vacuum-full-lock` | DBA ehdottaa VACUUM FULL tuotantoon päivällä bloatin poistoon. Miksi tä… |
| ⬜ | 3 | `exp-pg-vacuum-autovacuum-tune` | Heavy UPDATE -taulu bloataa nopeasti — autovacuum ei käynnisty tarpeeks… |
| ⬜ | 5 | `exp-pg-vacuum-bloat-wraparound` | Alert: taulu lähestyy transaction ID wraparoundia — autovacuum ei ehdi.… |
| ⬜ | 3 | `exp-pg-vacuum-full-lock` | Ops ehdottaa VACUUM FULL tuotantotaululle päivällä bloatin takia. Miksi… |
| ⬜ | 4 | `exp-pg-vacuum-long-xact` | pg_stat_activity näyttää 12 h avoimen read transactionin — dead tuples … |
| ⬜ | 4 | `pg-vacuum-bloat` | Päivitykset ovat runsaita, taulu kasvaa mutta rivimäärä pysyy. Epäily? |

### Docker (5/142)

#### Docker `docker` (2/79)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `b02-docker-build-copy-03` | Docker build on hidas — jokainen pieni koodimuutos invalidoi koko depen… |
| ⬜ | 2 | `b02-docker-exec-debug-04` | Containerissa shell puuttuu mutta prosessi elää — miten debuggaat sisäl… |
| ⬜ | 2 | `b02-docker-prune-05` | Levy täynnä vanhoja imageja ja stopped containereita. Turvallinen siivo… |
| ⬜ | 3 | `b02-docker-run-limit-02` | Yksi container syö koko hostin RAM:in — OOM killaa muita. Rajoitus? |
| ⬜ | 3 | `b02-docker-run-user-01` | Containeri ajaa rootina tuotannossa — audit finding. Ensimmäinen harden… |
| ✅ | 4 | `b03-docker-buildkit-cache-mount` | npm ci kestää 5 min jokaisessa buildissa vaikka package-lock ei muutu. … |
| ⬜ | 2 | `b03-docker-copy-vs-add` | Code review ehdottaa ADD tarball-url:ia Dockerfileen. Miksi suosittelet… |
| ⬜ | 2 | `b03-docker-dockerignore-build` | Docker build lähettää 2 GB node_modules build contextiin. Ensimmäinen o… |
| ⬜ | 3 | `b03-docker-entrypoint-cmd` | Tiimi sekoittaa ENTRYPOINT ja CMD — `docker run image bash` ei korvaa o… |
| ⬜ | 2 | `b03-docker-prune-disk` | CI-runnerin levy täyttyy 'no space left' — satoja dangling imageja. Tur… |
| ⬜ | 4 | `b03-docker-secrets-compose` | DB-salasana on compose-tiedoston environment-osiossa gitissä. Parempi t… |
| ⬜ | 3 | `b03-docker-stats-limits` | Yksi kontti syö koko hostin RAM:in — muut palvelut kaatuvat. docker sta… |
| ⬜ | 3 | `b03-docker-user-nonroot` | Security review: Dockerfile ei määritä USER:ia — kontti ajaa rootina. K… |
| ⬜ | 3 | `b04-docker-build-arg` | Sama Dockerfile eri versioille — BASE_IMAGE vaihtelee CI:ssä. Miten par… |
| ⬜ | 3 | `b04-docker-buildkit-cache` | CI-build kopioi koko kontekstin joka kerta — cache ei hyödy package.jso… |
| ⬜ | 4 | `b04-docker-cgroup-limits` | Kontti syö koko hostin RAM:in — OOM killaa naapurikontteja. docker run … |
| ⬜ | 3 | `b04-docker-compose-depends-on` | Compose-sovellus kaatuu koska API käynnistyy ennen Postgresia. Mitä com… |
| ⬜ | 3 | `b04-docker-compose-profile` | Kehityksessä tarvitaan debug-työkalukontti, tuotannossa ei. Compose-mal… |
| ⬜ | 2 | `b04-docker-copy-from-container` | Tuotantokontista pitää hakea crash-dump tiedosto hostille. Toimenpide? |
| ⬜ | 2 | `b04-docker-exec-interactive` | Kontissa pitää debugata konfig-tiedostoa interaktiivisesti. Komento? |
| ⬜ | 3 | `b04-docker-health-interval` | Healthcheck merkitsee kontin unhealthy liian myöhään — 5 min outage. Mi… |
| ⬜ | 3 | `b04-docker-log-driver` | Konttilokit katoavat rebootin jälkeen — oletus json-file kasvaa loputto… |
| ⬜ | 2 | `b04-docker-prune-dangling` | Levy täynnä `<none>` image-tageja CI-koneella. Siivouskomento? |
| ⬜ | 4 | `b04-docker-secrets-env` | Tuotanto: salasanat ENV-muuttujina Dockerfile:ssa. Turvallisempi Compos… |
| ⬜ | 4 | `b04-docker-security-cap-drop` | Security review: kontti ei tarvitse root-oikeuksia eikä NET_RAW. Harden… |
| ⬜ | 3 | `b05-docker-compose-depends-on` | App-kontti käynnistyy ennen Postgresia ja kaatuu connection refused -vi… |
| ⬜ | 3 | `b05-docker-healthcheck-prod` | Orkestraattori ei huomaa jumiutunutta Node-prosessia — kontti on 'runni… |
| ⬜ | 2 | `b05-docker-log-driver-json` | Konttilokit katoavat rebootissa. Miten varmistat lokien keräyksen? |
| ⬜ | 2 | `b05-docker-prune-disk-full` | Build-palvelimen levy täynnä — vanhoja imageja ja stopped-kontteja pino… |
| ⬜ | 4 | `b05-docker-security-cap-drop` | Minimoit konttioikeudet — tarvitset vain verkon, ei kernel-muutoksia. M… |
| ⬜ | 4 | `b05-docker-security-nonroot` | Security review: kontti ajaa rootina. Mikä on Dockerin suositus tuotant… |
| ⬜ | 3 | `b05-dockerfile-layer-cache` | Docker build on hidas — jokainen koodirivin muutos invalidoi koko npm i… |
| ⬜ | 3 | `b05-dockerfile-multistage-size` | Tuotantoimage on 2 GB koska build-työkalut mukana runtime-kuvassa. Ratk… |
| ⬜ | 3 | `b06-docker-build-context-size` | docker build lähettää gigatavun node_modules kontekstissa. Miten estät? |
| ⬜ | 3 | `b06-docker-build-target` | Multi-stage Dockerfile — haluat buildaa vain test-stage CI:ssä. Miten? |
| ⬜ | 2 | `b06-docker-compose-env-file` | Salaisuudet compose-pinoon — ei hardcode yamlissa. Miten injektoit? |
| ⬜ | 3 | `b06-docker-compose-healthcheck` | Compose-pino käynnistää riippuvat palvelut ennen kuin API on valmis. Mi… |
| ⬜ | 2 | `b06-docker-compose-restart` | Tuotantokontti pitää käynnistää automaattisesti host-rebootin jälkeen. … |
| ⬜ | 3 | `b06-docker-logging-rotation` | Konttilokit täyttävät levyn — json-file driver kasvaa rajatta. Miten ra… |
| ⬜ | 3 | `b06-docker-run-init` | Kontissa zombie-prosessit kasaantuvat — parent ei siivoa child-prosesse… |
| ⬜ | 4 | `b06-docker-run-memory-swap` | Kontti OOM-killaa mutta swap näyttää vapaana. Miten rajoitat memory+swa… |
| ⬜ | 3 | `b07-docker-buildkit-cache` | CI-buildit ovat hitaita vaikka Dockerfile on optimoitu. BuildKit-ominai… |
| ⬜ | 3 | `b07-docker-compose-depends` | App käynnistyy ennen Postgresia — connection refused. compose.yml korja… |
| ✅ | 4 | `b07-docker-copy-chown` | Non-root user ei voi kirjoittaa /app/logs — permission denied tuotannos… |
| ⬜ | 2 | `b07-docker-exec-debug` | Kontti pyörii mutta HTTP ei vastaa — haluat shellin sisälle debugata. K… |
| ⬜ | 3 | `b07-docker-healthcheck` | Orchestrator merkitsee palvelun healthy vaikka app kaatui. Mitä Dockerf… |
| ⬜ | 4 | `b07-docker-image-digest` | Tuotantoon deployattiin eri image kuin testissä — tag liikkui. Miten lu… |
| ⬜ | 3 | `b07-docker-multistage-build` | Tuotanto-image sisältää koko Go toolchainin — image 1.2 GB. Miten piene… |
| ⬜ | 3 | `b07-docker-run-user` | Security audit: kontti ajaa rootina. Miten korjaat Dockerfilessa? |
| ⬜ | 3 | `b08-docker-buildkit-cache` | CI-buildit ovat hitaita — BuildKit on päällä mutta cache ei jaeta jobie… |
| ⬜ | 2 | `b08-docker-compose-override` | Paikallinen dev ylikirjoittaa portit ilman muutosta git-trackattuun com… |
| ⬜ | 2 | `b08-docker-compose-profiles` | Compose-tiedostossa debug-työkalut halutaan vain kehityksessä — ei tuot… |
| ⬜ | 3 | `b08-docker-compose-watch` | Dev: lähdekoodimuutos pitäisi synkata konttiin ilman rebuildia joka ker… |
| ⬜ | 3 | `b08-docker-exec-user` | Debuggaat konttia — docker exec -it ajaa rootina vaikka Dockerfile USER… |
| ⬜ | 2 | `b08-docker-prune-build-cache` | Build-serverin levy täynnä vanhoja kerroksia. Turvallinen siivous? |
| ⬜ | 3 | `b08-docker-scan-image` | CI putki — haluat skannata imagen CVE:t ennen deploya. Työkalu ekosyste… |
| ⬜ | 3 | `b08-docker-secrets-env` | Code review: API-avain Dockerfile ENV:ssä. Turvallisempi Compose/Swarm … |
| ⬜ | 3 | `b08-dockerfile-arg-env` | Build-time versio build-argilla — runtime config erikseen. Ero ARG vs E… |
| ⬜ | 3 | `b08-dockerfile-copy-chown` | Non-root USER ei voi kirjoittaa COPY:llä tuotua hakemistoa. Dockerfile-… |
| ⬜ | 4 | `b09-docker-buildkit-cache-mount` | Go-moduulien lataus hidastaa CI-buildia vaikka go.mod ei muutu. BuildKi… |
| ⬜ | 3 | `b09-docker-cmd-entrypoint` | Haluat wrapper-skriptin joka ajaa migraatiot ennen appia — mutta CMD pi… |
| ⬜ | 2 | `b09-docker-dockerignore-build` | Docker build lähettää 500 MB node_modules kontekstina vaikka ne asennet… |
| ⬜ | 4 | `b09-docker-env-secrets-smell` | Code review: DATABASE_PASSWORD Dockerfile ENV:ssä. Miksi tämä on ongelm… |
| ⬜ | 2 | `b09-docker-exec-debug` | Kontti pyörii mutta shelliä ei ole imageessa — tarvitset interaktiivise… |
| ⬜ | 3 | `b09-docker-image-tag-pin` | Tuotanto käyttää `FROM node:latest` — eilen build rikkoutui. Korjaus? |
| ⬜ | 3 | `b09-docker-resource-limits` | Yksi kontti syö koko hostin CPU:n — muut palvelut jäätyvät. Compose-raj… |
| ⬜ | 4 | `b09-docker-secrets-mount` | Tuotanto-Compose tarvitsee TLS-sertin ilman salaisuuden leimimistä imag… |
| ⬜ | 4 | `docker-compose-network` | Compose-projektissa palvelut eivät näe toisiaan. Yleisin konfiguraatiov… |
| ⬜ | 4 | `docker-exit-code` | Kontti poistuu heti käynnistyksen jälkeen. Ensimmäinen diagnosoitava as… |
| ⬜ | 4 | `docker-healthcheck` | Orkestraattori käynnistää uuden kontin ennen vanhan poistoa. Mikä Docke… |
| ⬜ | 3 | `docker-layer-cache` | Docker build on hidas. Mikä Dockerfile-järjestys hyödyntää layer cachea… |
| ⬜ | 4 | `docker-multistage` | Tuotantoimage on 2 GB koska mukana kääntäjä ja dev-työkalut. Ratkaisu? |
| ⬜ | 5 | `docker-readonly-rootfs` | Haluat rajoittaa kontin kirjoituksia levylle turvallisuussyistä. Mikä k… |
| ⬜ | 3 | `docker-volume-persist` | Kontin tietokanta katoaa `docker rm` jälkeen. Miten data säilyy oikein? |
| ⬜ | 4 | `exp-docker-build-cache` | CI-buildit ovat hitaita — jokainen layer invalidoituu kun package.json … |
| ⬜ | 3 | `exp-docker-build-multistage` | Go-binary image on 1.2 GB koska build-työkalut mukana. Miten pienennät? |
| ⬜ | 3 | `exp-docker-prod-healthcheck` | Load balancer lähettää liikenteen kontille joka on jumissa. Miten Docke… |
| ⬜ | 4 | `exp-docker-prod-readonly-rootfs` | Security review vaatii immutable root filesystemin. Mikä run-optio? |
| ⬜ | 2 | `exp-docker-prod-restart-policy` | Tuotantokontti kaatuu yöllä eikä nouse uudelleen host-rebootin jälkeen.… |

#### Docker-verkot `docker-network` (2/34)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `b02-docker-net-alias-10` | Yhdellä servicellä pitää olla useita DNS-nimiä samassa verkossa. Miten? |
| ⬜ | 2 | `b02-docker-net-bridge-06` | Kaksi default-bridge containeria eivät resolvdu nimellä — miksi? |
| ⬜ | 3 | `b02-docker-net-compose-07` | Compose: web ei tavoita db:ä hostname `db` — molemmat samassa projektis… |
| ⬜ | 4 | `b02-docker-net-host-08` | Low-latency palvelu tarvitsee suoran host-portin ilman NAT:ia. Verkko-o… |
| ⬜ | 3 | `b02-docker-net-inspect-09` | Container ei saa IP:tä custom networkista — diagnostiikka? |
| ⬜ | 3 | `b03-docker-net-compose-depends` | App-kontti käynnistyy ennen Postgresia ja kaatuu connection refused. Co… |
| ⬜ | 3 | `b03-docker-net-internal-network` | Backend-API ei saa olla suoraan internetissä — vain reverse proxy ulos.… |
| ⬜ | 4 | `b03-docker-net-ipv6-disable` | Legacy-sovellus hajoaa IPv6-osoitteeseen DNS:ssä — kontissa toimii IPv4… |
| ⬜ | 3 | `b04-docker-network-alias` | Kontti A ei löydä kontti B:tä nimellä `api` samassa user-defined networ… |
| ⬜ | 2 | `b05-docker-net-bridge-default` | Kaksi konttia samassa default bridge-verkossa — voivatko ne kommunikoid… |
| ⬜ | 3 | `b05-docker-net-dns-custom` | Kontti ei resolvdu sisäistä DNS-nimeä corporate DNS:llä. Compose-korjau… |
| ⬜ | 3 | `b05-docker-net-host-mode` | Latency-kriittinen palvelu tarvitsee suoran pääsyn host-portteihin ilma… |
| ⬜ | 5 | `b06-docker-network-ipvlan` | Kontit tarvitsevat omat MAC-osoitteet LAN-segmentissä. Mikä driver? |
| ⬜ | 4 | `b06-docker-network-mode-none` | Batch-prosessi ei tarvitse verkkoa — minimoi attack surface. network_mo… |
| ⬜ | 3 | `b06-docker-network-proxy` | Kontti ei saa ulosverkkoyhteyttä — corporate proxy vaaditaan. Miten kon… |
| ⬜ | 3 | `b07-docker-network-bridge` | Kaksi konttia samassa custom networkissä — toinen ei tavoita toista hos… |
| ✅ | 4 | `b07-docker-network-host` | UDP multicast ei toimi bridge-verkossa. Milloin host network mode? |
| ⬜ | 2 | `b07-docker-network-publish` | Kontti kuuntelee 8080 — host ei tavoita localhost:8080. docker run? |
| ⬜ | 3 | `b08-docker-network-bridge-dns` | Compose-palvelu `api` ei löydä `db`-hostnamea — oletusbridge-verkossa. … |
| ⬜ | 4 | `b08-docker-network-host` | Kontti tarvitsee suoran pääsyn hostin verkkoon (multicast). Milloin net… |
| ⬜ | 2 | `b09-docker-net-alias` | Kontti pitää tavoittaa nimellä `database` samassa Compose-verkossa. Ase… |
| ⬜ | 3 | `b09-docker-net-internal` | Tietokanta-kontti ei saa päästä internetiin — vain app-kontti. Verkko-a… |
| ⬜ | 3 | `b09-docker-net-publish-range` | Dev-ympäristössä haluat hostin portin 3000-3005 mapattuna. Compose-synt… |
| ⬜ | 4 | `docker-bridge-dns` | Kaksi konttia samassa user-defined bridge -verkossa. Miten `app` löytää… |
| ⬜ | 4 | `docker-dns-custom` | Kontti ei resolvaa sisäistä `corp.internal` -DNS:ää. Ensimmäinen tarkis… |
| ✅ | 4 | `docker-host-network` | Kontti tarvitsee kuunnella hostin porttia 53 ilman NAT:ia. Mikä network… |
| ⬜ | 5 | `docker-inspect-network` | Kontti on verkossa mutta ei vastaa. Miten varmistat IP:n ja gatewayn ko… |
| ⬜ | 5 | `docker-macvlan` | Kontti tarvitsee oman MAC-osoitteen ja LAN-IP:n reitittimeltä. Mikä dri… |
| ⬜ | 5 | `docker-overlay` | Mikä verkkotyyppi yhdistää kontit eri Docker-hostien välillä klusteriss… |
| ⬜ | 3 | `exp-docker-net-compose-alias` | Compose-palvelu `api` ei löydä `cache`-palvelua hostnameilla. Mitä comp… |
| ⬜ | 3 | `exp-docker-net-custom-dns` | Kontti ei resolvdu sisäistä DNS-nimeä custom-verkossa. Mitä docker run … |
| ⬜ | 4 | `exp-docker-net-inspect-dns` | Kontit samassa verkossa eivät pingaa toisiaan nimellä. Mitä diagnostiik… |
| ⬜ | 5 | `exp-docker-net-macvlan` | Legacy-laite vaatii kontille oman MAC-osoitteen LANissa. Mikä network d… |
| ⬜ | 3 | `exp-docker-net-publish-bind` | Palvelu kuuntelee vain localhostia kontissa mutta hostilta ei reach. Mi… |

#### Docker tuotanto `docker-production` (0/2)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `prod-docker-env-secrets` | Dockerfile sisältää rivin `ENV API_KEY=sk_live_...`. Mikä ongelma tuota… |
| ⬜ | 4 | `prod-docker-k8s-probes` | Kubernetes-pod käynnistyy, mutta sovellus ei vielä vastaa HTTP-pyyntöih… |

#### Docker-volumet `docker-volumes` (1/27)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `b02-docker-vol-backup-14` | Named volume backup ilman container downtimea — suositeltu tapa? |
| ⬜ | 3 | `b02-docker-vol-bind-12` | Dev: koodi bind-mountattu mutta muutokset eivät näy containerissa — mac… |
| ⬜ | 3 | `b02-docker-vol-named-11` | PostgreSQL data katoaa containerin poiston jälkeen — mitä käytit väärin? |
| ⬜ | 2 | `b02-docker-vol-ro-13` | Config mountattu containeriin — attacker ei saa muokata. Flag? |
| ⬜ | 3 | `b03-docker-vol-external-volume` | Compose-projekti uudelleenkäynnistyy eri nimellä — vanha named volume j… |
| ⬜ | 3 | `b03-docker-vol-named-vs-bind` | Tuotantodata bind-mountataan suoraan host-polusta — deploy eri poluilla… |
| ⬜ | 4 | `b03-docker-vol-tmpfs-secrets` | Kontti kirjoittaa väliaikaista salaista tokenia levylle — se jää image … |
| ⬜ | 3 | `b04-docker-volume-named` | Postgres data katoaa `docker compose down` jälkeen. Mikä puuttui? |
| ⬜ | 4 | `b05-docker-vol-bind-perms` | Bind mount host-kansiosta — kontti kirjoittaa permission denied. Juuris… |
| ⬜ | 3 | `b05-docker-vol-named-backup` | Postgres-data named volumessa — tarvitset varmuuskopion ilman konttia. … |
| ⬜ | 3 | `b05-docker-vol-readonly-root` | Security hardening: kontti ei saa muokata omaa filesystemia. Mitä asetu… |
| ⬜ | 4 | `b06-docker-security-readonly-tmpfs` | Read-only rootfs mutta app tarvitsee /tmp kirjoitusta. Miten? |
| ✅ | 4 | `b06-docker-volume-driver` | Tuotanto tarvitsee NFS-pohjainen persistent storage kontteille. Miten m… |
| ⬜ | 5 | `b06-docker-volume-mount-propagation` | Bind mount host-muutokset ei näky kontissa — mount propagation väärä. M… |
| ⬜ | 4 | `b07-docker-volume-backup` | Postgres volume pitää varmuuskopioida ilman konttia samassa verkossa. K… |
| ⬜ | 3 | `b07-docker-volume-bind` | Kehityksessä haluat live-reload lähdekoodilla hostilta. Volume-tyyppi? |
| ⬜ | 2 | `b07-docker-volume-named` | DB-data katoaa kontin poiston jälkeen. Miten säilytät datan? |
| ⬜ | 4 | `b08-docker-volume-bind-selinux` | RHEL-host: bind mount permission denied vaikka chmod 777. Todennäköisin… |
| ⬜ | 2 | `b08-docker-volumes-named` | Postgres-data katoaa kontti poistossa — käytit bind mountia väärään pol… |
| ⬜ | 3 | `b09-docker-vol-anonymous` | Dockerfile: `VOLUME /data` — data katoaa kontin poiston jälkeen. Miksi? |
| ⬜ | 3 | `b09-docker-vol-driver-local` | Usean hostin Swarm-klusterissa tarvitset jaetun volumen. Vaihtoehto loc… |
| ⬜ | 4 | `b09-docker-vol-mount-propagation` | Bind mount host-kansiosta ei näy muutoksia nested mountissa. Propagatio… |
| ⬜ | 4 | `b10-docker-volumes-backup-01` | Named volume pitää varmuuskopioida ilman kontin käynnistämistä. Tyypill… |
| ⬜ | 3 | `exp-docker-vol-backup` | Haluat varmuuskopioida named volumen ilman konttia käynnissä. Miten? |
| ⬜ | 4 | `exp-docker-vol-bind-perms` | Bind mount ./config:/app/config — kontti ei saa kirjoittaa. Mikä on tyy… |
| ⬜ | 3 | `exp-docker-vol-db-persist` | Postgres-kontti poistettiin `docker rm` — data katosi. Miten olisi pitä… |
| ⬜ | 3 | `exp-docker-vol-readonly` | Config-volume ei saa muuttua runtime-aikana. Mikä mount-optio? |

### Linux (4/148)

#### apt/dpkg `apt` (0/8)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `apt-autoremove` | Palvelimelle on kertynyt turhia riippuvuuspaketteja poistettujen ohjelm… |
| ⬜ | 2 | `apt-cache-search` | Et muista paketin tarkkaa nimeä mutta tiedät sen liittyvän JSON-käsitte… |
| ⬜ | 3 | `apt-dist-upgrade` | apt upgrade ilmoittaa 'held back packages'. Mikä komento asentaa myös n… |
| ⬜ | 3 | `apt-dpkg-deb-install` | Ladattu .deb-paketti ei asennu koska riippuvuudet puuttuvat. Miten korj… |
| ⬜ | 4 | `apt-pinning-version` | Tuotantopalvelimella tietty paketti pitää lukita versioon 2.4.1 estäen … |
| ⬜ | 4 | `apt-repository-add` | Tarvitset kolmannen osapuolen PPA:n tai repon lisäämistä Ubuntuun. Mikä… |
| ⬜ | 4 | `apt-unattended-upgrades` | Palvelimelle halutaan automaattiset tietoturvapäivitykset ilman manuaal… |
| ⬜ | 2 | `apt-update-vs-upgrade` | Uusi palvelin — haluat asentaa tuoreimmat tietoturvapäivitykset. Mikä o… |

#### Avahi/mDNS `avahi` (1/25)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `avahi-mdns` | Mitä Avahi tarjoaa lähiverkossa ilman keskitettyä DNS:ää? |
| ⬜ | 5 | `avahi-service-xml` | Haluat julkaista HTTP-palvelun ilman koodimuutosta Avahilla. Minne stat… |
| ⬜ | 3 | `b02-linux-avahi-browse-12` | Lähiverkossa pitäisi näkyä tulostin — miten listaat Avahi-palvelut term… |
| ⬜ | 4 | `b02-linux-avahi-conflict-13` | Kaksi konetta ilmoittaa saman `.local`-nimen — palvelu flapping. Syy? |
| ⬜ | 3 | `b02-linux-avahi-publish-14` | Kehität paikallista HTTP-palvelua — haluat sen löytyvän `_http._tcp`. M… |
| ⬜ | 2 | `b03-linux-avahi-browse-services` | Toimistossa pitää löytää paikallinen tulostin ilman IP:tä. Avahi-koment… |
| ⬜ | 3 | `b03-linux-avahi-hostname-local` | Kehityskone hostaa API:n osoitteessa devbox.local — toinen kone ei reso… |
| ⬜ | 3 | `b03-linux-avahi-publish-service` | IoT-gateway pitää ilmoittaa HTTP-palvelu lähiverkkoon ilman staattista … |
| ⬜ | 3 | `b04-linux-avahi-browse` | Lähiverkossa pitäisi näkyä mDNS-palvelu mutta se ei löydy. Diagnostiikk… |
| ⬜ | 2 | `b05-linux-avahi-browse` | Toimiston tulostin pitäisi löytyä verkosta automaattisesti. Mikä työkal… |
| ⬜ | 4 | `b05-linux-avahi-hostname-conflict` | Kaksi konetta ilmoittaa saman `.local`-hostname:n — palvelut vaihteleva… |
| ⬜ | 3 | `b05-linux-avahi-publish-service` | Kehityspalvelu portissa 3000 pitäisi löytyä mDNS:llä ilman manuaalista … |
| ⬜ | 2 | `b06-linux-avahi-daemon-restart` | Uusi .service-tiedosto lisätty — palvelu ei näkyy verkossa. Mitä teet e… |
| ⬜ | 2 | `b06-linux-avahi-resolve-hostname` | Tulostin ilmoittaa hostname.local mutta ping epäonnistuu. Miten testaat… |
| ⬜ | 3 | `b06-linux-avahi-service-type` | Julkaiset sisäisen API:n mDNS:llä kehitysympäristössä. Mitä service typ… |
| ⬜ | 3 | `b07-linux-avahi-daemon-check` | Lähiverkon palvelut eivät ilmesty — epäilet Avahia. Ensimmäinen tarkist… |
| ⬜ | 4 | `b07-linux-avahi-reflector` | Docker-kontti julkaisee mDNS-palvelun mutta host ei näe sitä. Tyypillin… |
| ⬜ | 2 | `b07-linux-avahi-resolve` | Kehityskone printer.local ei resolvdu. Avahi-työkalu joka testaa nimen? |
| ⬜ | 3 | `b08-linux-avahi-resolve` | Kehityskone ei löydä palvelua `printer.local` — mDNS pitäisi toimia. En… |
| ⬜ | 2 | `b09-linux-avahi-browse-resolve` | Haluat listata lähiverkon _http._tcp-palvelut terminaalista. Komento? |
| ⬜ | 4 | `b09-linux-avahi-mdns-troubleshoot` | Kehityskone ei löydä kollegan .local-palvelua — sama WiFi. Yleisin syy … |
| ⬜ | 3 | `b09-linux-avahi-service-discovery` | Lähiverkon tulostin pitäisi löytyä ilman staattista IP:tä. Protokolla? |
| ⬜ | 3 | `exp-linux-avahi-conflict` | Kaksi laitetta claimaa saman hostname.local — verkko sekoaa. Miten Avah… |
| ⬜ | 2 | `exp-linux-avahi-printer-discovery` | Toimiston tulostin pitäisi löytyä automaattisesti LANissa ilman staatti… |
| ✅ | 4 | `exp-linux-avahi-service-xml` | Haluat julkaista HTTP-palvelun portissa 8080 mDNS:llä. Mihin konfiguraa… |

#### journald `journald` (1/31)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 2 | `b02-linux-journalctl-boot-05` | Palvelu kaatui eilen rebootin jälkeen — miten suodatat lokin tälle boot… |
| ⬜ | 2 | `b02-linux-journalctl-unit-06` | Haluat vain nginx-palvelun viimeiset virheet. Tehokkain komento? |
| ⬜ | 3 | `b02-linux-journald-persist-07` | Rebootin jälkeen vanhat lokit katoavat — forensic-tarve. journald-muuto… |
| ⬜ | 2 | `b03-linux-journalctl-follow-unit` | Debuggaat tuotantovikaa reaaliaikaisesti yhden palvelun lokeista. journ… |
| ⬜ | 3 | `b03-linux-journalctl-json-export` | SIEM tarvitsee journal-lokeja JSON-muodossa. Mikä journalctl-lippu? |
| ⬜ | 4 | `b03-linux-journald-rate-limit` | DoS-yritys tulvittaa journald:n identtisillä virheillä — levy täyttyy. … |
| ⬜ | 2 | `b04-linux-journalctl-boot` | Palvelin kaatui yöllä rebootiin — haluat lokit vain viime bootista. jou… |
| ⬜ | 2 | `b04-linux-journalctl-follow` | Haluat seurata palvelun lokia reaaliajassa tuotantodebugissa. Mikä kome… |
| ⬜ | 3 | `b04-linux-journalctl-priority-err` | Incident: tarvitset vain virhe- ja kriittiset viestit viime tunnilta. j… |
| ⬜ | 4 | `b04-linux-journald-RateLimit` | Bugi tulvittaa journald:n identtisillä virheillä — diagnostiikka vaikea… |
| ⬜ | 2 | `b05-linux-journalctl-unit-since` | Tuotantoincidentti — tarvitset nginx-unitin lokit viimeisen tunnin ajal… |
| ⬜ | 3 | `b05-linux-journald-priority-filter` | Lokit tulvivat DEBUG-viestejä. Miten rajaat journalctl-tulosteen vain v… |
| ⬜ | 3 | `b05-linux-journald-storage-persist` | Rebootin jälkeen edellisen bootin lokit katoavat. Mikä journald.conf-as… |
| ⬜ | 2 | `b06-linux-journalctl-reverse` | Incidentti — tarvitset vanhimmat lokit ensin aikajärjestyksessä. Mitä j… |
| ✅ | 4 | `b06-linux-journalctl-verify` | Audit vaatii lokien eheyden tarkistuksen. Mitä journalctl tarjoaa? |
| ⬜ | 3 | `b06-linux-journald-forward-syslog` | Legacy syslog-kollektori tarvitsee journal-lokit. Miten journald konfig… |
| ⬜ | 2 | `b07-linux-journalctl-follow` | Debuggaat live-incidenttiä — haluat seurata uusia logirivejä reaaliajas… |
| ⬜ | 3 | `b07-linux-journald-boot` | Palvelin reboottasi — haluat edellisen bootin virhelokit. journalctl? |
| ⬜ | 3 | `b07-linux-journald-json` | Lokit pitää parsia automaattisesti — plain text on hankala. journalctl … |
| ⬜ | 2 | `b08-linux-journalctl-since` | Incidentti alkoi noin klo 14:30 — haluat lokit siitä eteenpäin. Nopein … |
| ⬜ | 2 | `b08-linux-journalctl-unit` | Nginx kaatuu — haluat vain nginx-unitin virheet viime bootista. Komento? |
| ⬜ | 3 | `b08-linux-journald-storage` | Levy täyttyy journal-lokeista embedded-laitteessa. Mitä journald.conf-a… |
| ⬜ | 2 | `b09-linux-journalctl-follow-live` | Seuraat tuotantopalvelun lokia reaaliajassa deployn aikana. Komento? |
| ⬜ | 3 | `b09-linux-journald-forward-syslog` | Keskus-LOKIp palvelin vaatii syslog-formaatin. journald-konfiguraatio? |
| ⬜ | 3 | `b09-linux-journald-priority-filter` | Incident-haku: tarvitset vain error-tason viestit viimeiseltä bootilta.… |
| ⬜ | 2 | `exp-linux-journalctl-since-boot` | Tuotantobugi tapahtui rebootin jälkeen. Miten suodatat vain nykyisen bo… |
| ⬜ | 4 | `exp-linux-journald-disk-full` | Incident: /var/log/journal täyttää levyn ja palvelin ei kirjoita uusia … |
| ⬜ | 3 | `exp-linux-journald-priority-filter` | Loki tulvii DEBUG-rivejä. Miten näet vain err-tason ja korkeammat yhdel… |
| ⬜ | 5 | `journalctl-filter` | Nginx kaatui viime yönä klo 02–04. Nopein tapa rajata lokit? |
| ⬜ | 4 | `journald-persistent` | Rebootin jälkeen vanhat lokit katoavat. Mikä journald-asetus säilyttää … |
| ⬜ | 4 | `journald-priority` | Lokitulva tuotannossa. Miten näytät vain virheet ja kriittiset nginx-un… |

#### verkko `linux-network` (1/41)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 2 | `b02-linux-network-nmcli-11` | Wi-Fi katkeilee — haluat vaihtaa verkko profiilin CLI:stä. Komento? |
| ⬜ | 3 | `b02-linux-network-resolv-10` | Lyhyet hostnamet eivät resolvdu — FQDN toimii. Mikä tiedosto? |
| ⬜ | 4 | `b02-linux-network-route-09` | VPN-yhteys toimii mutta vain internal IP:t eivät routtaudu. Diagnostiik… |
| ⬜ | 3 | `b02-linux-network-ss-08` | Sovellus sanoo portti 8080 varattu — mikä komento näyttää prosessin jok… |
| ⬜ | 4 | `b03-linux-network-ethtool-link` | 1 Gbps linkki neuvottelee 100 Mbps — throughput romahtaa. Ensimmäinen t… |
| ⬜ | 3 | `b03-linux-network-ip-route-table` | VPN-yhteys on päällä mutta vain osa aliverkoista menee tunneliin. Mikä … |
| ⬜ | 3 | `b03-linux-network-ss-timers` | Palvelin jää odottamaan CLOSE_WAIT-yhteyksiä — muisti kuluu. Diagnostii… |
| ⬜ | 4 | `b03-linux-network-tcpdump-filter` | API-kutsut timeouttaavat — epäilet palomuuria. Nopein tapa nähdä SYN-pa… |
| ⬜ | 2 | `b04-linux-network-ip-addr` | Palvelin ei vastaa pingiin — epäilet väärää IP:tä interfacella. Nopein … |
| ⬜ | 4 | `b04-linux-network-route-metric` | Kaksi oletusreittiä — liikenne menee väärää VPN:ää pitkin. Miten näet r… |
| ⬜ | 4 | `b04-linux-resolv-stub` | resolv.conf näyttää 127.0.0.53 — DNS-kyselyt epäonnistuvat satunnaisest… |
| ⬜ | 3 | `b04-linux-ss-tuln` | Portti 8080 pitäisi kuunnella mutta palvelu ei vastaa. Mikä komento lis… |
| ⬜ | 3 | `b05-linux-network-ip-route` | VPN-yhteys toimii mutta sisäverkon aliverkko on tavoittamaton. Mitä tar… |
| ⬜ | 2 | `b05-linux-network-nmcli-connect` | Wi-Fi katkesi toimistossa. Miten nmcli:llä yhdistät tunnetun profiilin? |
| ⬜ | 3 | `b05-linux-network-resolv-search` | Sisäinen hostname `app.internal` ei resolvdu mutta FQDN toimii. Mikä re… |
| ⬜ | 2 | `b05-linux-network-ss-listen` | Portti 8080 on jo käytössä — uusi palvelu ei käynnisty. Mikä komento nä… |
| ⬜ | 5 | `b06-linux-network-ethtool-offload` | Tuotantoverkko — checksum offload aiheuttaa corrupt-paketteja virtuaali… |
| ⬜ | 3 | `b06-linux-network-ip-neigh` | Yhteys toimii pingillä mutta ARP-taulu näyttää incomplete. Mitä komento… |
| ⬜ | 3 | `b06-linux-network-resolv-options` | DNS-haku hidastuu — haluat rajoittaa retry ja timeout. Missä konfiguroi… |
| ⬜ | 2 | `b06-linux-network-ss-udp` | DNS-palvelu ei vastaa — haluat nähdä UDP-kuuntelijat. Mitä ss-optiota? |
| ⬜ | 2 | `b07-linux-network-curl-debug` | curl palauttaa SSL certificate problem — haluat nähdä TLS-handshaken. c… |
| ⬜ | 3 | `b07-linux-network-dns-dig` | Sovellus ei resolvdu mutta ping IP:llä toimii. DNS-diagnostiikka? |
| ⬜ | 4 | `b07-linux-network-firewall-nft` | Portti 443 auki ulkoapäin vaikka palvelu kuuntelee vain localhostia. Mi… |
| ⬜ | 4 | `b07-linux-network-tcpdump` | API-kutsu epäonnistuu TLS:n jälkeen — epäilet palomuurin RST-paketteja.… |
| ⬜ | 3 | `b08-linux-network-firewalld` | Uusi palvelu portissa 8080 — palomuuri estää ulkoiset yhteydet. firewal… |
| ⬜ | 2 | `b08-linux-network-nmcli` | Palvelimella pitää vaihtaa staattinen IP ilman GUI:ta NetworkManagerill… |
| ⬜ | 3 | `b08-linux-network-traceroute` | API-viive — epäilet reitityspolkua ulkoiseen palveluun. Perustyökalu po… |
| ⬜ | 3 | `b08-linux-resolv-search` | Lyhyt hostname 'db' ei resolvdu — FQDN toimii. Mitä /etc/resolv.conf se… |
| ⬜ | 2 | `b08-linux-ss-listening` | Mikä prosessi kuuntelee porttia 5432? Nopein diagnostiikka? |
| ⬜ | 3 | `b09-linux-net-firewall-cmd` | Uusi palvelu portissa 8443 — firewalld estää ulkoiset yhteydet. Pysyvä … |
| ⬜ | 4 | `b09-linux-net-nat-troubleshoot` | Kontti saavuttaa hostin mutta ei internetiä — epäilet NAT:ia. Tarkistus? |
| ⬜ | 2 | `b09-linux-net-ss-listen` | Portti 8080 on varattu mutta et tiedä mikä prosessi kuuntelee. Moderni … |
| ⬜ | 4 | `b09-linux-net-tcpdump-incident` | API-kutsu timeoutaa tuotannossa — epäilet pakettihäviötä. Nopea kaappau… |
| ⬜ | 3 | `exp-linux-network-nmcli-down` | Wi-Fi profiili jää roikkuun VPN-konfigin jälkeen. Miten NetworkManageri… |
| ⬜ | 4 | `exp-linux-network-resolv-search` | Sisäinen palvelu `db.local` ei resolvdu mutta `db.local.corp` toimii. M… |
| ⬜ | 4 | `exp-linux-network-route-missing` | Kontti-host ei reachaa 10.20.0.0/16 VPN-verkkoa. ip route näyttää oletu… |
| ⬜ | 3 | `exp-linux-network-ss-listen` | Portti 8080 on jo käytössä deploy epäonnistuu. Mikä komento näyttää mik… |
| ✅ | 4 | `linux-ip-route` | Palvelin ei pääse ulos verkon 10.0.0.0/8 ulkopuolelle, mutta pingaa gat… |
| ⬜ | 5 | `linux-nmcli` | NetworkManager hallitsee interfacea. Miten aktivoit profiilin `corp-wif… |
| ⬜ | 4 | `linux-resolv-search` | Kontti/resolvoi `db` mutta ei `db.corp.local`. Mitä tiedostoa tarkistat… |
| ⬜ | 3 | `linux-ss-listen` | Mikä prosessi kuuntelee porttia 8080? Nopein moderni komento? |

#### systemd `systemd` (1/43)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `b02-linux-systemd-env-04` | Palvelu tarvitsee API-avaimen — kovakoodattu unit-tiedostoon. Turvallis… |
| ⬜ | 3 | `b02-linux-systemd-failure-02` | Palvelu crashaa loopissa — loki täyttyy. Miten rajoitat uudelleenkäynni… |
| ⬜ | 3 | `b02-linux-systemd-timer-03` | Cron-työ pitää siirtää systemd:ään — tarvitaan ajastus + service. Mitä … |
| ⬜ | 2 | `b02-linux-systemd-unit-01` | Palvelu ei käynnisty bootissa vaikka `systemctl start` toimii. Mitä uno… |
| ⬜ | 3 | `b03-linux-systemd-analyze-blame` | Palvelin käynnistyy hitaasti tuotantoon noston jälkeen. Mikä systemd-ko… |
| ⬜ | 2 | `b03-linux-systemd-env-file` | Salaisuudet ovat suoraan unit-tiedostossa gitissä. Miten systemd hoitaa… |
| ⬜ | 3 | `b03-linux-systemd-restart-burst` | Bugi aiheuttaa crash loopin — palvelu käynnistyy uudelleen 500 kertaa m… |
| ⬜ | 4 | `b03-linux-systemd-type-notify` | CI merkitsee palvelun valmiiksi heti kun prosessi käynnistyy, mutta se … |
| ⬜ | 3 | `b04-linux-systemd-ExecStartPre` | Palvelu käynnistyy ennen kuin tietokanta on valmis — yhteys epäonnistuu… |
| ⬜ | 3 | `b04-linux-systemd-mask` | Vanha palvelu käynnistyy uudestaan päivityksen jälkeen vaikka disable t… |
| ⬜ | 3 | `b04-linux-systemd-override` | Haluat muuttaa vain yhden Environment-rivin vendor unitiin ilman tiedos… |
| ⬜ | 4 | `b04-linux-systemd-PartOf` | Kun `web.target` pysähtyy, worker-prosessit jäävät roikkumaan. Miten si… |
| ⬜ | 3 | `b04-linux-systemd-user-unit` | Kehittäjä haluaa ajaa daemonin ilman root-oikeuksia login-sessionissa. … |
| ⬜ | 3 | `b05-linux-systemd-exec-reload` | Config muuttui — haluat ladata palvelun ilman katkoa. Mitä eroa on relo… |
| ⬜ | 4 | `b05-linux-systemd-socket-activation` | Haluat käynnistää palvelun vasta kun porttiin tulee yhteys. Mikä system… |
| ⬜ | 3 | `b05-linux-systemd-timer-oncalendar` | Cron-korvaaja ajaa backup-skriptin maanantaisin klo 03:00. Miten määrit… |
| ⬜ | 4 | `b05-linux-systemd-type-notify` | Palvelu käynnistyy ennen kuin se kuuntelee porttia — riippuvat unitit j… |
| ⬜ | 4 | `b06-linux-systemd-ConditionPath` | Backup-skripti ajetaan vain jos mount on käytettävissä. Miten unit ehto? |
| ⬜ | 4 | `b06-linux-systemd-LimitsNOFILE` | Palvelu saa 'too many open files' tuotannossa. Miten nostat rajan syste… |
| ⬜ | 3 | `b06-linux-systemd-logind` | Palvelu tarvitsee pysyvän session ilman interaktiivista loginia. Mitä k… |
| ⬜ | 3 | `b06-linux-systemd-Requires` | App unit käynnistyy ennen tietokantaa — yhteys epäonnistuu. Miten pakot… |
| ⬜ | 2 | `b07-linux-systemd-journal-unit` | Palvelu kirjoittaa stdoutiin mutta lokit eivät näy journalctl -u myapp.… |
| ⬜ | 4 | `b07-linux-systemd-limit-nofile` | High-traffic palvelu saa Too many open files — ulimit ok login-shelliss… |
| ⬜ | 3 | `b07-linux-systemd-restart-policy` | Palvelu kaatuu satunnaisesti yöllä — aamulla se on alhaalla. Mikä Resta… |
| ⬜ | 3 | `b07-linux-systemd-wantedby` | Uusi service unit ei käynnisty bootissa vaikka enabled näyttää ok. Mitä… |
| ⬜ | 4 | `b08-linux-systemd-logind` | SSH-istunto katkeaa mutta prosessi tapetaan logoutissa — haluat pitää j… |
| ✅ | 4 | `b08-linux-systemd-requires` | App service pitää käynnistyä vain jos network-online.target on valmis. … |
| ⬜ | 3 | `b08-linux-systemd-restart-policy` | Palvelu kaatuu satunnaisesti — haluat systemd:n käynnistävän sen uudell… |
| ⬜ | 3 | `b08-linux-systemd-timer` | Cron-korvaus: backup ajastus systemd:llä. Mitä tarvitset? |
| ⬜ | 2 | `b08-linux-systemd-wantedby` | Uusi service-unit ei käynnisty bootissa vaikka enabled. Install-osiossa… |
| ⬜ | 3 | `b09-linux-systemd-after-before` | App käynnistyy ennen verkkoa — DNS lookup epäonnistuu bootissa. Unit-ri… |
| ⬜ | 4 | `b09-linux-systemd-kill-mode` | Palvelu spawnnaa child-prosesseja — stop jättää zombie-prosesseja. Kill… |
| ⬜ | 4 | `b09-linux-systemd-memory-limit` | Muistivuoto täyttää koko palvelimen — haluat rajoittaa yhden unitin RAM… |
| ⬜ | 3 | `b09-linux-systemd-restart-policy` | Palvelu kaatuu satunnaisesti yöllä — haluat automaattisen uudelleenkäyn… |
| ⬜ | 3 | `exp-linux-systemd-failed-service` | Tuotantopalvelu on failed-tilassa rebootin jälkeen. Mikä komento näyttä… |
| ⬜ | 3 | `exp-linux-systemd-reload-vs-restart` | Muutit nginx unit-tiedoston ExecStart-rivin. Mitä teet ennen kuin uusi … |
| ⬜ | 3 | `exp-linux-systemd-timer-incident` | Yöllinen backup-skripti ei ajautunut cronin sijaan. Miten systemd-timer… |
| ⬜ | 4 | `exp-linux-systemd-wants-vs-requires` | App.service riippuu tietokannasta. DB kaatuu — haluat appin pysähtyvän.… |
| ⬜ | 4 | `systemd-after-before` | Unit A tarvitsee verkon ennen käynnistystä mutta ei saa kaatua jos B ep… |
| ⬜ | 3 | `systemd-enable-boot` | Palvelu käynnistyy manuaalisesti mutta ei bootin jälkeen. Mitä komentoa… |
| ⬜ | 4 | `systemd-restart-policy` | Palvelu kaatuu satunnaisesti prosessivirheeseen. Mikä `Restart=` arvo o… |
| ⬜ | 4 | `systemd-timer` | Haluat ajastaa yöllisen backup-skriptin ilman cronia. Mikä systemd-ratk… |
| ⬜ | 4 | `systemd-wants-requires` | Unit A: `Requires=B`, unit B kaatuu käynnistyksessä. Mitä tapahtuu A:ll… |

### Qt (1/134)

#### Qt-mallit `qt-models` (0/19)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `b02-qt-models-reset-10` | Koko malli vaihtuu — käytät beginResetModel/endResetModel. Milloin riit… |
| ⬜ | 3 | `b02-qt-models-sort-09` | QTableView sorttaus hidastuu 100k rivillä — sorttaus viewissä. Parempi? |
| ⬜ | 3 | `b03-qt-models-data-changed` | Muutat yhden solun dataa suoraan vektorissa — view ei päivity. Mitä emi… |
| ⬜ | 3 | `b03-qt-models-sort-filter` | QTableView näyttää kaikki 100k riviä — UI jumittaa. Nopea suodatus ilma… |
| ⬜ | 3 | `b04-qt-models-setData` | QTableView ei päivity kun muokkaat dataa suoraan taustatallennuksessa. … |
| ⬜ | 3 | `b04-qt-models-sort-filter` | QTableView tarvitsee live-haun suodatuksen ilman erillistä kopiomallia.… |
| ⬜ | 3 | `b05-qt-models-data-roles` | Custom delegate tarvitsee tooltip-datan eri kuin display. Mistä se tule… |
| ⬜ | 3 | `b05-qt-models-sort-filter` | QTableView tarvitsee suodatuksen ja lajittelun ilman datan duplikaatiot… |
| ⬜ | 3 | `b06-qt-models-editable-delegate` | Taulukon solu tarvitsee custom editor widgetin editissä. Mitä käytät? |
| ⬜ | 4 | `b06-qt-models-mime-drag` | Tree view drag-drop eri sovellukseen — data ei siirry. Mitä model-metod… |
| ⬜ | 4 | `b07-qt-model-reset` | Lista päivittyy hitaasti kun data muuttuu — koko model resetataan. Pare… |
| ⬜ | 3 | `b07-qt-model-view-sort` | QTableView näyttää dataa mutta sortaus ei toimi. Mitä puuttuu? |
| ⬜ | 3 | `b08-qt-models-data-changed` | Custom model päivittää solun — view ei päivity ennen full reset. Mitä s… |
| ⬜ | 3 | `b08-qt-models-sort-filter` | QTableView suodatus — haluat näyttää vain aktiiviset rivit ilman datan … |
| ⬜ | 4 | `b09-qt-models-reset-vs-layout` | Lataat koko listan uudelleen — beginResetModel on raskas ja välkkyy. Pa… |
| ⬜ | 3 | `b09-qt-models-sort-proxy` | QTableView sorttaus rikkoo custom modelin indeksit. Ratkaisu? |
| ⬜ | 4 | `exp-qt-models-persistent-index` | Delegate tallentaa QModelIndexin myöhempää käyttöä varten — data väärää… |
| ⬜ | 4 | `exp-qt-models-reset-vs-layout` | Taulukko välkkyy kun päivität 10 000 riviä — koko model resetataan. Teh… |
| ⬜ | 4 | `qt-models-persistent-index` | Taulukkomalli päivittyy (lajittelu/suodatus). Miten tallennat rivin tun… |

#### Qt OpenGL `qt-opengl` (1/21)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `b02-qt-opengl-context-11` | OpenGL renderöinti toisesta threadista — mitä tarvitaan ennen glCall? |
| ⬜ | 3 | `b02-qt-opengl-vao-12` | Moderni Qt OpenGL piirtää suorakulmion — mitä objekteja bindataan? |
| ⬜ | 4 | `b03-qt-opengl-core-profile` | Legacy fixed-function GL-kutsu kaataa macOS:llä — toimii Linuxilla. Kon… |
| ⬜ | 3 | `b03-qt-opengl-widget-update` | QOpenGLWidget renderöi vain kerran avauksessa — animaatio jäätyy. Mitä … |
| ⬜ | 4 | `b04-qt-opengl-depth-buffer` | 3D-scene: lähemmät objektit piirtyvät etäisempien päälle väärin. OpenGL… |
| ⬜ | 5 | `b04-qt-opengl-share-context` | Kaksi QOpenGLWidget:iä — tekstuurit ladataan kahdesti. Miten jaat GL-re… |
| ⬜ | 4 | `b05-qt-opengl-context-share` | Kaksi QOpenGLWidget:ia — tekstuurit ladataan kahdesti. Miten jaat resur… |
| ⬜ | 3 | `b05-qt-opengl-makecurrent` | OpenGL-kutsu kaatuu 'without current context'. Mitä teet ennen glDrawAr… |
| ⬜ | 4 | `b06-qt-opengl-double-buffer` | OpenGL rendering flicker — piirto näkyy kesken renderöinnin. Mitä forma… |
| ⬜ | 4 | `b06-qt-opengl-pixel-format` | Depth buffer ei toimi — 3D-objektit piirtyvät väärin. Mitä surface form… |
| ✅ | 4 | `b07-qt-opengl-context` | QOpenGLWidget renderöi mustaa — context ei ole current. Mitä kutsutaan … |
| ⬜ | 3 | `b07-qt-opengl-vsync` | Peli renderöi 300 FPS ja kuluttaa CPU:ta turhaan. Miten rajoitat frame … |
| ⬜ | 4 | `b08-qt-opengl-context-share` | Kaksi QOpenGLWidget:ia — tekstuurit ladataan kahdesti. Miten jaat GL-re… |
| ⬜ | 3 | `b08-qt-opengl-vsync` | OpenGL-demo repii — CPU 100% spin loopissa. Miten synkkaat frame rateen? |
| ⬜ | 4 | `b09-qt-opengl-context-share` | Kaksi QOpenGLWidget:ia — tekstuurit ladataan kahdesti. Optimointi? |
| ⬜ | 3 | `b09-qt-opengl-vsync-tear` | Renderöinti repii ruudulla liikkuessa — tearing. Swap interval? |
| ⬜ | 5 | `exp-qt-opengl-context-thread` | OpenGL render crashaa satunnaisesti — QOpenGLWidget luodaan worker-thre… |
| ⬜ | 4 | `exp-qt-opengl-makecurrent` | Render loopissa glError invalid operation — context ei aktiivinen. Mitä… |
| ⬜ | 4 | `exp-qt-opengl-vao-vbo` | Piirrät meshiä joka frame ilman buffer-objekteja — CPU bottleneck. Ensi… |
| ⬜ | 4 | `qt-opengl-makecurrent` | QOpenGLWidget piirtää mustaa. OpenGL-kutsut tehdään väärästä säikeestä.… |
| ⬜ | 5 | `qt-opengl-vbo` | Piirrät paljon kolmioita QOpenGLWidgetissä. Miten vältät turhat CPU→GPU… |

#### Qt-shaders `qt-shaders` (0/24)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `b02-qt-shaders-qsb-13` | Qt 6 RHI backend — shaderit pitää esikääntää. Työkalu? |
| ⬜ | 3 | `b02-qt-shaders-uniform-14` | Shader uniform `mvpMatrix` — location vaihtuu eri GPU:lla. Turvallinen … |
| ⬜ | 4 | `b03-qt-shaders-attribute-location` | Vertex attribuutit sekoittuvat eri GPU:illa — layout ei täsmää. Vakautu… |
| ⬜ | 3 | `b03-qt-shaders-qopenglshader` | Shader compile failaa ilman selkeää logia. Qt-luokka virheilmoituksiin? |
| ⬜ | 4 | `b03-qt-shaders-rhi-fallback` | Qt 6 app renderöi Metalilla macOS:llä mutta testaaja raportoi mustan ru… |
| ⬜ | 3 | `b04-qt-shaders-attribute-location` | Shader linkittyy mutta vertex-attribuutit ovat nollaa — layout(location… |
| ⬜ | 2 | `b05-qt-shaders-glsl-version` | Shader hylätään: 'version 330 incompatible'. Korjaus Qt 6 desktop OpenG… |
| ⬜ | 4 | `b05-qt-shaders-rhi-backend` | Qt 6 sovellus pitää ajaa Vulkanilla Windowsissa ja Metalilla macOS:lla.… |
| ⬜ | 3 | `b05-qt-shaders-uniform-location` | Shader compile onnistuu mutta uniform ei vaikuta — location on -1. Juur… |
| ⬜ | 4 | `b06-qt-shaders-precompile` | Shader compile hidastaa app käynnistystä. Miten Qt 6 RHI auttaa? |
| ⬜ | 5 | `b06-qt-shaders-varying-interpolation` | Fragment shader saa väärät interpolated arvot vertex-attribuuteista. Mi… |
| ⬜ | 5 | `b07-qt-shader-precision` | Shader toimii desktopilla mutta on musta mobiilissa OpenGL ES:llä. Tode… |
| ⬜ | 3 | `b07-qt-shader-qsb` | Qt 6 shader ei lataudu — .frag tiedosto suoraan ei toimi. Miten shader … |
| ⬜ | 4 | `b07-qt-shader-uniform` | Shader ei reagoi uniform-muutoksiin — väri pysyy valkoisena. Tyypilline… |
| ⬜ | 3 | `b08-qt-shaders-precision` | Fragment shader toimii desktopilla mutta on musta mobiilissa. Epäily? |
| ⬜ | 4 | `b08-qt-shaders-uniform` | Shader ei näy oikein — uniform arvo ei päivity. Qt6 RHI/shader polulla? |
| ⬜ | 3 | `b09-qt-shaders-compile-log` | QOpenGLShaderProgram linkkaus epäonnistuu — musta ruutu. Debug-askel? |
| ⬜ | 3 | `b09-qt-shaders-qml-graph-effect` | QML-käyttöliittymässä tarvitset blur-efektin itemille. Qt Quick -kompon… |
| ⬜ | 4 | `b09-qt-shaders-uniform-location` | uniform float u_time ei päivity — setUniformValue ei vaikuta. Yleisin s… |
| ⬜ | 3 | `exp-qt-shaders-glsl-version` | Shader failaa macOS:llä mutta toimii Windowsilla — puuttuu `#version`. … |
| ⬜ | 5 | `exp-qt-shaders-rhi-backend` | Tiimi migoi Qt 5 fixed-functionista Qt 6:een — shaderit hajosivat. Mikä… |
| ⬜ | 4 | `exp-qt-shaders-uniform-location` | Shader compile ok mutta uniform ei vaikuta — hardcoded location 0. Mite… |
| ⬜ | 5 | `qt-shaders-glsl-version` | Shader ei käännä Qt:ssa: 'version directive must occur before anything … |
| ⬜ | 4 | `qt-shaders-uniform` | QOpenGLShaderProgram on linkitetty. Miten asetat muuttujan `mvpMatrix` … |

#### signaalit/slotit `qt-signals` (0/20)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `b02-qt-signals-disconnect-05` | Dialog sulkeutuu mutta slot laukeaa edelleen destroyed senderistä. Esto? |
| ⬜ | 4 | `b02-qt-signals-queued-04` | Worker-thread emit updateUI() — crash GUI-threadissa. Connection type? |
| ⬜ | 3 | `b03-qt-signals-block-signals` | Lataat modelin UI:hin — jokainen setValue laukaisee signaalin ja aiheut… |
| ⬜ | 3 | `b03-qt-signals-unique-connection` | Sama connect() kutsutaan initissä ja refreshissä — slot ajetaan kaksi k… |
| ⬜ | 4 | `b04-qt-meta-object-moc` | Build epäonnistuu: 'staticMetaObject undefined' luokalle jossa on Q_OBJ… |
| ⬜ | 3 | `b04-qt-signals-block` | Bulk-päivitys laukaisee satoja valueChanged-signaaleja — UI jäätyy. Mit… |
| ⬜ | 3 | `b04-qt-signals-sender` | Yksi slot käsittelee usean napin clicked-signaalin — miten tunnistat kl… |
| ⬜ | 3 | `b05-qt-signals-disconnect-lambda` | Lambda-slotti connectissa — disconnect ei toimi osoitteella. Miksi? |
| ⬜ | 4 | `b05-qt-signals-queued-connection` | Worker-säie emittoi signaalin joka päivittää GUI:ta — satunnainen crash… |
| ⬜ | 3 | `b06-qt-signals-auto-connection` | on_pushButton_clicked() ei kutsuta — slot nimi väärä. Miten auto-connec… |
| ⬜ | 4 | `b06-qt-signals-lambda-disconnect` | Lambda-connect jää eloon widgetin tuhoutumisen jälkeen — crash. Miten d… |
| ⬜ | 3 | `b07-qt-signals-disconnect` | Dialogi sulkeutuu mutta slot kutsutaan yhä — use-after-free. Mitä teit … |
| ⬜ | 4 | `b07-qt-signals-queued` | Worker-thread emit signaalin joka päivittää GUI-widgettiä — satunnainen… |
| ⬜ | 3 | `b08-qt-signals-blocking` | Lataat modelin UI:hin — jokainen setData laukaisee dataChanged ja hidas… |
| ⬜ | 3 | `b08-qt-signals-unique-connection` | Sama connect() kutsutaan initissä kahdesti — slotti suoritetaan kaksink… |
| ⬜ | 3 | `b09-qt-signals-block-updates` | Lataat 1000 riviä modeliin — jokainen setData laukaisee view-päivitykse… |
| ⬜ | 3 | `b09-qt-signals-unique-connection` | Sama connect() kutsutaan useasti initissä — slotti laukeaa monta kertaa… |
| ⬜ | 3 | `exp-qt-signals-disconnect-lifetime` | Dialog sulkeutuu mutta background-worker emitoi edelleen vanhaan slotti… |
| ⬜ | 4 | `exp-qt-signals-queued-cross-thread` | Worker-thread emitoi signaalin joka päivittää GUI-labelin — satunnainen… |
| ⬜ | 3 | `qt-signals-unique` | Sama signaali connectataan kahdesti samaan slottiin. Miten estät duplik… |

#### Qt-säikeet `qt-threading` (0/20)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `b02-qt-thread-gui-07` | Worker kutsuu suoraan label->setText() — satunnainen crash. Sääntö? |
| ⬜ | 3 | `b02-qt-thread-pool-08` | Satoja lyhyitä taustatehtäviä — QThread jokaiselle liian raskas. Vaihto… |
| ⬜ | 3 | `b02-qt-thread-worker-06` | Pitää ajaa raskas laskenta ilman UI-jäätymistä. Qt-rakenne? |
| ⬜ | 4 | `b03-qt-thread-invoke-method` | Worker-threadista pitää päivittää label GUI:ssa. Turvallinen Qt-tapa? |
| ⬜ | 3 | `b03-qt-thread-qtimer-thread` | QTimer luotu worker-threadissa ei laukea. Mikä sääntö? |
| ⬜ | 4 | `b04-qt-deferred-delete` | Worker-thread emit deleteLater() QObjectille joka elää GUI-threadissä —… |
| ⬜ | 4 | `b04-qt-thread-affinity` | Worker-säie kutsuu suoraan QLabel::setText — satunnainen crash. Oikea Q… |
| ⬜ | 4 | `b05-qt-thread-gui-touch` | Taustasäie kutsuu widget->setText() suoraan — intermittent crash. Säänt… |
| ⬜ | 3 | `b05-qt-thread-movetothread` | Raskas laskenta jäädyttää GUI:n. Oikea Qt-pattern? |
| ⬜ | 3 | `b06-qt-thread-event-loop` | Worker-thread ei vastaa signaaleihin — slot ei kutsuta. Mitä worker-thr… |
| ⬜ | 4 | `b06-qt-thread-future` | Pitkä laskenta taustalla — haluat tulos GUI:hin ilman raw threadia. Qt-… |
| ⬜ | 3 | `b07-qt-thread-gui-rule` | Code review: QLabel::setText kutsutaan worker-threadista. Mikä sääntö r… |
| ⬜ | 4 | `b07-qt-thread-moveToThread` | Raskas laskenta jäädyttää GUI-threadin. Qt-idiomi taustatyölle? |
| ⬜ | 4 | `b08-qt-thread-invoke` | Worker-säie päivittää QLabel:ia suoraan — crash. Oikea tapa kutsua GUI-… |
| ⬜ | 3 | `b08-qt-thread-qthreadpool` | Paljon lyhyitä taustatehtäviä — uusi QThread jokaiselle on raskasta. Pa… |
| ⬜ | 3 | `b09-qt-thread-qthreadpool` | Satoja lyhyitä taustatehtäviä — uusi QThread jokaiselle on liian raskas… |
| ⬜ | 4 | `b09-qt-thread-wait-condition` | Producer-consumer queue Qt:llä — consumer odottaa dataa ilman busy-wait… |
| ⬜ | 3 | `exp-qt-thread-gui-touch` | Code review löytää `label->setText()` suoraan worker-threadista. Miksi … |
| ⬜ | 4 | `exp-qt-thread-worker-object` | Raskas laskenta jäädyttää UI-threadin. Mikä Qt-malli siirtää työn taust… |
| ⬜ | 4 | `qt-thread-movetothread` | Pitkäkestoinen työ jumittaa UI:n. Qt-tyylinen ratkaisu QObjectille? |

#### Qt-widgetit `qt-widgets` (0/30)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `b02-qt-widgets-action-03` | Valikkorivin Save-toiminto pitää bindata Ctrl+S:ään ja toolbar-nappiin.… |
| ⬜ | 2 | `b02-qt-widgets-layout-01` | Ikkuna resize repi widgetit — kovakoodatut setGeometry-kutsut. Parempi … |
| ⬜ | 2 | `b02-qt-widgets-parent-02` | Dialog leakkaa muistia sulkeutumisen jälkeen — widgetit orphan. Fix? |
| ⬜ | 2 | `b03-qt-widgets-dialog-modal` | Asetusdialogi avautuu mutta pääikkuna vastaa klikkauksiin taustalla. Ko… |
| ⬜ | 3 | `b03-qt-widgets-event-filter` | Pitää siepata Enter-näppäin tietystä kentästä ilman subclassia. Qt-meka… |
| ⬜ | 2 | `b03-qt-widgets-layout-stretch` | QHBoxLayoutissa napit venyvät epätasaisesti ikkunan resize:ssä. Säädin? |
| ⬜ | 3 | `b04-qt-event-filter` | Haluat kaapata kaikki keypress-eventit dialogissa ennen lapsia. Qt-meka… |
| ⬜ | 2 | `b04-qt-layout-stretch` | QHBoxLayout: keskimmäinen widget pitäisi venyä, reunat kiinteät. Asetus? |
| ⬜ | 2 | `b04-qt-resource-qrc` | Ikoni puuttuu asennetusta binääristä — tiedosto on vain dev-koneen polu… |
| ⬜ | 3 | `b04-qt-widgets-qss` | QPushButton tyyli pitää vaihtaa globaalisti ilman jokaista setStyleShee… |
| ⬜ | 3 | `b05-qt-widgets-dialog-modal` | Modal-dialogi ei estä pääikkunan klikkauksia. Mikä puuttuu? |
| ⬜ | 2 | `b05-qt-widgets-layout-stretch` | QHBoxLayoutissa vasen paneeli vie liikaa tilaa — oikea nappi jää piiloo… |
| ⬜ | 2 | `b05-qt-widgets-size-hint` | Custom widget leikkaa tekstiä layoutissa. Mitä metodia ylikirjoitat? |
| ⬜ | 3 | `b06-qt-resource-extern` | QRC-resurssi pitää päivittää ilman uudelleenkäännöstä. Miten ulkoiset r… |
| ⬜ | 2 | `b06-qt-widgets-context-menu` | List widget tarvitsee right-click menu. Miten toteutat Qt-widgetsissa? |
| ⬜ | 3 | `b06-qt-widgets-focus-policy` | Label saa fokuksen tabilla mutta ei pitäisi. Mitä muutat? |
| ⬜ | 2 | `b06-qt-widgets-tab-order` | Tab-järjestys lomakkeessa on väärä — käyttäjä tabbaa satunnaisesti. Mit… |
| ⬜ | 3 | `b07-qt-layout-responsive` | Ikkuna resize aiheuttaa widgettien päällekkäisyyden. Mikä layout-manage… |
| ⬜ | 2 | `b07-qt-widget-parent` | Dialogi jää roikkuen muistissa ikkunan sulkeuduttua. Todennäköisin syy? |
| ⬜ | 3 | `b07-qt-widget-stylesheet` | Nappi näyttää erilaiselta macOS vs Windows — haluat yhtenäisen ulkoasun… |
| ⬜ | 2 | `b08-qt-widgets-focus-policy` | Custom nappi ei saa näppäimistöfokusta Tabilla. Mitä asetat? |
| ⬜ | 2 | `b08-qt-widgets-menubar` | Desktop-sovelluksessa päävalikko puuttuu macOS:llä vaikka QMenuBar on l… |
| ⬜ | 2 | `b08-qt-widgets-qstacked` | Wizard-UI: useita sivuja yhdessä ikkunassa — vain yksi näkyvissä kerral… |
| ⬜ | 2 | `b08-qt-widgets-tooltip-delay` | Tooltip tulee liian hitaasti QA-testaajille. Mitä Qt-sovelluksessa sääd… |
| ⬜ | 2 | `b09-qt-widgets-focus-tab` | Lomakkeessa tab-järjestys hyppii satunnaisesti. Mitä tarkistat? |
| ⬜ | 2 | `b09-qt-widgets-size-policy` | QFormLayoutissa label venyy turhaan ikkunan leveydessä — input-kenttä j… |
| ⬜ | 3 | `b09-qt-widgets-splitter-state` | Käyttäjä säätää paneelien kokoa QSplitterillä — asetus katoaa restartis… |
| ⬜ | 3 | `exp-qt-widgets-layout-crash` | Code review: QDialog luodaan stackissa ilman parenttia ja deleteLater k… |
| ⬜ | 3 | `exp-qt-widgets-size-hint` | Custom widget leikkaa tekstiä eri DPI:llä. Mikä metodi pitää overridata… |
| ⬜ | 2 | `qt-widgets-parent` | Miksi QWidget:lle annetaan parent-osoitin konstruktorissa? |

### Scrum (4/142)

#### Definition of Done `scrum-dod` (1/25)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 2 | `b02-scrum-dod-demo-01` | Tiimi väittää tarina valmiiksi koska koodi on mergattu. DoD vaatii demo… |
| ⬜ | 3 | `b02-scrum-dod-perf-02` | Uusi API hidastaa raporttia 10× — tarina 'done' ilman suorituskykytesti… |
| ⬜ | 4 | `b02-scrum-dod-rollback-03` | Tuotantoon mennyt feature ei täytä DoD:ia — miten tiimi reagoi sprintin… |
| ⬜ | 3 | `b03-scrum-dod-automation-gate` | Tuotantoon pääsee regressio koska DoD ei vaadi CI:tä. Mitä lisätte DoD:… |
| ⬜ | 3 | `b03-scrum-increment-done-criteria` | Sprintin lopussa 'melkein valmis' feature demoissaan mutta ei tuotantok… |
| ⬜ | 3 | `b04-scrum-dod-regression-gate` | Tuotantoon meni regressio koska DoD ei sisällä automaattista testiportt… |
| ⬜ | 3 | `b05-scrum-dod-automated` | Tiimi merkitsee tarinan Done vaikka CI-testit eivät ole vihreitä. Mikä … |
| ⬜ | 4 | `b05-scrum-dod-deploy` | Feature on testattu stagingissa mutta deploy-skripti puuttuu. Voiko tar… |
| ⬜ | 4 | `b06-scrum-dod-docs-deploy` | Tiimi julkaisee API-muutoksen ilman runbook-päivitystä. Onko tämä shipp… |
| ⬜ | 3 | `b06-scrum-dod-regression-gate` | Feature on 'valmis' mutta regressiotestit punaisena. Täyttää increment … |
| ⬜ | 3 | `b07-scrum-dod-documentation` | Feature on tuotannossa mutta API-dokumentaatio puuttuu. Onko increment … |
| ⬜ | 4 | `b07-scrum-dod-tech-debt` | Kiireessä jätettiin refaktorointi ja TODO-kommentit — PO haluaa merkitä… |
| ⬜ | 3 | `b08-scrum-dod-automated-tests` | Increment merkitään valmiiksi, mutta regressiotestit ajetaan manuaalise… |
| ⬜ | 4 | `b08-scrum-dod-security-gate` | Turvallisuusaudit vaatii SAST-skannauksen ennen releasetta. Minne se ku… |
| ⬜ | 3 | `b08-scrum-transparency-artifacts` | Stakeholder ei näe mitä on todella valmista — vain PowerPoint. Mikä Scr… |
| ✅ | 3 | `b09-scrum-dod-documentation` | Feature on testattu mutta API-dokumentaatio puuttuu — tiimi haluaa merk… |
| ⬜ | 4 | `b09-scrum-dod-security-scan` | Tuotantoon menevä increment — DoD:ssa vaaditaan turvallisuustarkistus. … |
| ⬜ | 3 | `exp-scrum-dod-docs-minimum` | Operaatio valittaa puuttuvasta runbookista incidentin jälkeen. Mitä DoD… |
| ⬜ | 4 | `exp-scrum-dod-regression-suite` | Tuotantoon meni bugi joka olisi kaatunut regressiotestissä. Mitä DoD:ii… |
| ⬜ | 4 | `exp-scrum-dod-security-review` | Turvallisuustiimi löysi OWASP-aukko sprintin jälkeen. Miten DoD estää t… |
| ⬜ | 4 | `scrum-dod-automated-tests` | Tiimi debateaa DoD:stä. Mikä kuuluu tyypillisesti moderniin Definition … |
| ⬜ | 3 | `scrum-dod-no-partial` | Sprint review lähestyy. Tarina täyttää 4/5 DoD-kohtaa. Miten Scrum-best… |
| ⬜ | 3 | `scrum-dod-shippable` | Mikä on Definition of Done -listan ydinvaatimus jokaiselle sprintin val… |
| ⬜ | 4 | `scrum-dod-team-ownership` | Kuka omistaa ja päivittää Definition of Done -listan Scrumissa? |
| ⬜ | 5 | `scrum-dod-tech-debt` | Tekninen velka kasvaa. Miten DoD auttaa hallitsemaan sitä sprinttitasol… |

#### Definition of Ready `scrum-dor` (2/29)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `b02-scrum-dor-deps-05` | Tarina riippuu toisen tiimin API:sta jota ei ole vielä olemassa. DoR-ti… |
| ⬜ | 2 | `b02-scrum-dor-size-06` | Backlog-item on 21 story pointia — tiimi ei saa valmiiksi yhdessä sprin… |
| ⬜ | 3 | `b02-scrum-dor-spike-04` | Tarina: 'Tutki miksi integraatio kaatuu' — ei acceptance criteriaa. Ref… |
| ⬜ | 3 | `b03-scrum-backlog-refine-spike` | Tarina vaatii teknistä selvitystä ennen estimointia — arkkitehtuuri epä… |
| ⬜ | 3 | `b03-scrum-dor-testable` | Tarina: 'Paranna suorituskykyä'. Refinementissa puuttuu hyväksymiskrite… |
| ⬜ | 3 | `b03-scrum-tech-debt-backlog` | Tekninen velka kasaaantuu — PO sanoo 'ei aikaa'. Miten tuot backlogiin? |
| ⬜ | 3 | `b04-scrum-backlog-refinement-ongoing` | Sprint Planning venyy koska tarinat eivät ole valmiita. Milloin backlog… |
| ⬜ | 3 | `b04-scrum-dor-acceptance-clear` | Tarina siirtyy sprinttiin ilman hyväksymiskriteereitä. Mid-sprint väitt… |
| ⬜ | 3 | `b04-scrum-pbi-invest` | Backlog item on liian suuri sprinttiin: epäselvä, ei testattavissa. Ref… |
| ⬜ | 3 | `b04-scrum-refinement-backlog-order` | Product Backlog on sekava — tiimi ei tiedä mitä refinenoida seuraavaksi… |
| ⬜ | 4 | `b05-scrum-dor-dependency` | Tarinalla on riippuvuus ulkoiseen API:hin jota ei ole vielä saatavilla.… |
| ⬜ | 2 | `b05-scrum-dor-refinement` | Product Backlog refinement venyy koko sprintin mittaiseksi projektiksi.… |
| ⬜ | 3 | `b05-scrum-dor-unclear-story` | Tarinan acceptance criteria on 'toimii hyvin'. Sprint planningissa kehi… |
| ⬜ | 3 | `b06-scrum-backlog-refine-ready` | Sprint Planning venyy koska user storyt ovat epämääräisiä. Mitä refinem… |
| ⬜ | 3 | `b06-scrum-dor-unclear-ac` | Story alkaa sprintissä — acceptance criteria puuttuu. Mitä Definition o… |
| ⬜ | 4 | `b07-scrum-dor-design` | Sprint alkaa — arkkitehtuurisia avoimia kysymyksiä on vielä kolme. Pitä… |
| ⬜ | 3 | `b07-scrum-dor-sized` | Epic otetaan suoraan sprinttiin ilman pilkkomista. Mitä DoR vaatii enne… |
| ⬜ | 3 | `b07-scrum-dor-testable` | Tarinassa lukee käyttäjä on tyytyväinen. QA kieltäytyy hyväksymästä. Mi… |
| ⬜ | 3 | `b08-scrum-backlog-refinement` | Sprint Planning venyy koska itemit eivät ole valmiita. Milloin backlog-… |
| ⬜ | 2 | `b08-scrum-dor-testable` | Backlog-item: 'Paranna suorituskykyä' — tiimi ei voi aloittaa. Mikä DoR… |
| ⬜ | 3 | `b09-scrum-dor-size-limit` | Tarinan arvio on 21 story pointia — tiimi epäilee liian suurta sprintti… |
| ⬜ | 4 | `b09-scrum-dor-spike-needed` | Tarinassa tekninen riski on korkea — arkkitehtuuria ei tunneta. Mitä en… |
| ⬜ | 2 | `b09-scrum-dor-ux-mockup` | UI-tarinassa kehittäjät arvailevat layoutia. Mikä DoR-elementti puuttuu? |
| ⬜ | 4 | `b10-scrum-dor-spike-01` | Tarinassa on suuri tekninen epävarmuus ennen estimointia. Mitä Scrum-be… |
| ⬜ | 3 | `exp-scrum-dor-acceptance-tests` | Tarinalla on otsikko mutta ei hyväksymiskriteereitä. Sprint planningiss… |
| ⬜ | 3 | `exp-scrum-dor-refinement-timebox` | Backlog refinement syö 30 % sprintin kapasiteetista. Mitä best practice… |
| ⬜ | 3 | `exp-scrum-dor-split-story` | Backlog refinementissa tarina on 21 pistettä ja epäselvä. Mitä DoR-best… |
| ✅ | 3 | `scrum-dor-criteria` | Mikä kuuluu Definition of Ready -kriteereihin ennen kuin tarina otetaan… |
| ✅ | 4 | `scrum-story-split` | Epic on liian iso estimointiin. Mikä pilkkomistapa leikkaa **liiketoimi… |

#### estimointi `scrum-estimation` (0/21)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `b02-scrum-estimation-anchor-08` | Planning pokerissa kaikki kortit eri — keskustelu pysähtyy. Facilitoint… |
| ⬜ | 2 | `b02-scrum-estimation-relative-07` | Manageri vaatii tuntiarvioita sprintille. Scrum-muotoilu suhteellisesta… |
| ⬜ | 3 | `b02-scrum-estimation-velocity-09` | Stakeholder vertaa kahden tiimin velocitya suunnittelussa. Miksi se on … |
| ⬜ | 2 | `b03-scrum-estimation-relative` | Stakeholder vaatii tuntiarvioita sprint-suunnitteluun. Miksi tiimi käyt… |
| ⬜ | 4 | `b03-scrum-velocity-forecast` | Johto käyttää velocityä henkilökohtaiseen suorituskykyyn. Mikä on oikea… |
| ⬜ | 2 | `b04-scrum-poker-consensus` | Planning Pokerissa arviot hajallaan 2 ja 13 välillä. Mitä teette seuraa… |
| ⬜ | 3 | `b04-scrum-velocity-not-commitment` | Johto vaatii kiinteän story point -lupauksen seuraavalle kvartaalille v… |
| ⬜ | 3 | `b05-scrum-estimation-planning-poker` | Yksi senior-kehittäjä dominoi estimointikeskustelua. Mikä tekniikka tas… |
| ⬜ | 2 | `b05-scrum-estimation-relative` | Johdon raportti vaatii story pointit muunnettuna tunteiksi. Mitä Scrum … |
| ⬜ | 3 | `b06-scrum-estimation-relative` | Manageri vaatii story pointien muunnosta tunteihin raportointia. Miksi … |
| ⬜ | 3 | `b06-scrum-velocity-forecast` | Stakeholder kysyy release-päivämäärää. Miten velocity auttaa? |
| ⬜ | 4 | `b07-scrum-estimation-spikes` | Tuntematon integraatio — tiimi arvioi 13 story pointia arvalla. Miten v… |
| ⬜ | 3 | `b07-scrum-estimation-velocity` | Johto käyttää velocitya kiinteänä deadline-laskelmana seuraavalle vuode… |
| ⬜ | 2 | `b08-scrum-estimation-relative` | Stakeholder vaatii story pointien muuttamista tunneiksi raportointia va… |
| ⬜ | 3 | `b08-scrum-velocity-trend` | Johto vertaa tiimien velocityä suorituskykymittarina. Miksi se on riski… |
| ⬜ | 2 | `b09-scrum-tshirt-sizing` | Backlogissa on satoja karkeita ideoita — tarkka story point -arvo tuntu… |
| ⬜ | 3 | `b09-scrum-velocity-fluctuation` | Velocity putosi 40 % yhden kehittäjän loman jälkeen. Miten tulkitset tr… |
| ⬜ | 2 | `exp-scrum-estimation-no-hours` | Projektipäällikkö vaatii story pointien muuntamista tunteihin raporttia… |
| ⬜ | 3 | `exp-scrum-estimation-planning-poker` | Estimaatiossa yksi senior dominoi keskustelua. Miten fasilitoit tasapuo… |
| ⬜ | 4 | `scrum-planning-poker` | Miksi planning poker toimii paremmin kuin yhden henkilön arvio? |
| ⬜ | 5 | `scrum-velocity-range` | Kun vain 2 sprinttiä on mitattu, mikä velocity-varianssi on realistinen… |

#### sprintti `scrum-sprint` (0/45)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 2 | `b02-scrum-sprint-daily-11` | Daily kestää 45 minuuttia statusraportteja managerille. Miten Scrum Mas… |
| ⬜ | 2 | `b02-scrum-sprint-goal-10` | Sprintin aikana tiimi keskittyy yksittäisiin taskeihin ilman yhteistä s… |
| ⬜ | 3 | `b02-scrum-sprint-review-12` | Sprint Review on vain PowerPoint — demo puuttuu. Mitä Scrum Guide odott… |
| ⬜ | 3 | `b03-scrum-empirical-inspect-adapt` | Tuote ei löydä product-market fitiä — tiimi jatkaa sprintejä ilman suun… |
| ⬜ | 2 | `b03-scrum-events-timebox-review` | Sprint Review venyy kolmeen tuntiin — sidosryhmät väsyvät. Timebox? |
| ⬜ | 2 | `b03-scrum-retro-action-item` | Retrospektiivin jälkeen parannusideoita ei seurata — sama ongelma toist… |
| ⬜ | 2 | `b03-scrum-sprint-goal-one` | Sprintillä on viisi erillistä 'tavoitetta' eri tiimiosille. Mikä on Spr… |
| ⬜ | 2 | `b04-scrum-daily-timebox` | Daily Scrum venyy 45 minuuttiin tekniseksi debug-sessioksi. Mitä Scrum … |
| ⬜ | 2 | `b04-scrum-events-timebox` | Uusi tiimi kysyy: 'Voimmeko skipata Sprint Review jos ei mitään uutta?'… |
| ⬜ | 3 | `b04-scrum-retro-action-items` | Retrospektiivin jälkeen samat ongelmat toistuvat sprint toisensa jälkee… |
| ⬜ | 3 | `b04-scrum-review-feedback` | Sprint Review päättyy ilman stakeholder-palautetta — vain demot. Mitä S… |
| ⬜ | 2 | `b04-scrum-sprint-goal-one` | Sprintille valitaan viisi erillistä tavoitetta eri stakeholderille. Mik… |
| ⬜ | 3 | `b05-scrum-backlog-order` | Product Backlog on sekava — tiimi ei tiedä seuraavaa prioriteettia. Ken… |
| ⬜ | 2 | `b05-scrum-daily-timebox` | Daily Scrum venyy 45 minuuttiin tekniseen keskusteluun. Mitä Scrum Guid… |
| ⬜ | 2 | `b05-scrum-increment-demo` | Stakeholder kysyy Sprint Reviewissa: 'Onko tämä valmis tuotantoon?' Mit… |
| ⬜ | 3 | `b05-scrum-planning-capacity` | Sprint Planningissa tiimi ottaa liikaa työtä — lomat ja tuki unohtuvat.… |
| ⬜ | 3 | `b05-scrum-retro-action` | Retrospektiivi venyy tunniksi valituksiin eikä synny selkeitä parannuks… |
| ⬜ | 2 | `b06-scrum-empirical-process` | Tiimi pitää sprintin aikana retrospektiivin ja muuttaa työtapaa. Mikä S… |
| ⬜ | 3 | `b06-scrum-focus-one-goal` | Sprintissä on viisi erillistä tavoitetta — tiimi hajaantuu. Mitä Scrum … |
| ⬜ | 2 | `b06-scrum-openness-blockers` | Kehittäjä piilottaa impedimentin viikon — sprint goal vaarantuu. Mikä S… |
| ⬜ | 4 | `b06-scrum-sprint-cancellation` | Markkinamuutos tekee sprintin tavoitteen merkityksettömäksi kesken spri… |
| ⬜ | 2 | `b06-scrum-stakeholder-review` | Stakeholder haluaa nähdä edistymisen ilman teknistä deep-diveä. Mikä ta… |
| ⬜ | 2 | `b07-scrum-daily-devs-only` | PO ja Scrum Master osallistuvat Daily Scrumiin. Kuka on tapahtuman omis… |
| ⬜ | 2 | `b07-scrum-review-stakeholder` | Sprint Review — kuka osallistuu ja miksi? |
| ⬜ | 4 | `b07-scrum-sprint-cancel` | Markkinatilanne muuttui — PO haluaa keskeyttää sprintin kesken. Mitä Sc… |
| ⬜ | 3 | `b07-scrum-sprint-goal-one` | Sprint Planning tuottaa viisi erillistä tavoitetta eri tiimeille. Onko … |
| ⬜ | 2 | `b07-scrum-sprint-length` | Johdon raportti vaatii sprintin pituudeksi aina kaksi viikkoa. Miten Sc… |
| ⬜ | 3 | `b08-scrum-po-delegation` | PO on lomalla kaksi viikkoa — backlog jää päivittämättä. Miten Scrum su… |
| ⬜ | 2 | `b08-scrum-review-stakeholders` | Sprint Review — kuka osallistuu ja mikä on tapahtuman tarkoitus? |
| ⬜ | 4 | `b08-scrum-sprint-cancel` | Markkinatilanne muuttuu radikaalisti — sprintin tavoite on merkityksetö… |
| ⬜ | 3 | `b08-scrum-sprint-goal-change` | Kesken sprintin PO haluaa vaihtaa sprint goalin kokonaan uuteen feature… |
| ⬜ | 2 | `b08-scrum-sprint-length` | Tiimi haluaa vaihtaa sprint-pituuden 2 viikosta 1 viikkoon kesken kvart… |
| ⬜ | 2 | `b09-scrum-daily-blocker` | Dailyssa kehittäjä kertoo esteen joka estää sprint goalin. Mitä tapahtu… |
| ⬜ | 3 | `b09-scrum-review-feedback` | Sprint Reviewssa stakeholder ehdottaa uutta featurea suoraan kehittäjäl… |
| ⬜ | 3 | `b09-scrum-scope-creep-mid` | Kesken sprintin lisätään 'pieni' muutos joka kasvattaa työmäärää 30 %. … |
| ⬜ | 4 | `b09-scrum-sprint-cancel` | Markkinatilanne muuttui — sprintin tavoite on merkityksetön. Kuka voi p… |
| ⬜ | 4 | `b09-scrum-sprint-goal-change` | Kesken sprintin PO haluaa vaihtaa sprint goalin kokonaan uuteen markkin… |
| ⬜ | 4 | `exp-scrum-sprint-cancel` | Markkinatilanne muuttuu — nykyinen sprint goal on merkityksetön. Kuka v… |
| ⬜ | 2 | `exp-scrum-sprint-daily-focus` | Daily kestää 45 minuuttia ja muuttuu debug-sessioksi. Miten SM ohjaa ta… |
| ⬜ | 2 | `exp-scrum-sprint-review-stakeholders` | Sprint Review -tapahtumaan kutsutaan sidosryhmiä. Mikä on tapahtuman yd… |
| ⬜ | 3 | `exp-scrum-sprint-scope-add` | Sprintin puolivälissä tuoteomistaja tuo kriittisen lisätarinan. Mitä Sc… |
| ⬜ | 4 | `scrum-dod-partial` | Sprintin lopussa tarina on "99 % valmis" mutta QA ei ole hyväksynyt. Mi… |
| ⬜ | 4 | `scrum-multitask` | Sprintin aikana paine kasvaa. Mitä priorisointiohjetta kannattaa noudat… |
| ⬜ | 3 | `scrum-retro` | Mikä ceremonia on usein tärkein jatkuvaan parantamiseen? |
| ⬜ | 3 | `scrum-sprint-goal` | Mikä on Sprint Goalin rooli sprintin aikana? |

#### tiimi `scrum-team` (1/22)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `b02-scrum-team-cross-14` | Tiimissä vain yksi henkilö osaa deployata — bottleneck joka sprintti. S… |
| ⬜ | 2 | `b02-scrum-team-sm-13` | Scrum Master assignaa tehtäviä kehittäjille sprintin alussa. Mikä rooli… |
| ⬜ | 2 | `b03-scrum-artifacts-transparency` | Product Backlog on jaettu kolmessa eri työkalussa — kukaan ei näe kokon… |
| ✅ | 3 | `b03-scrum-sm-servant-leader` | Scrum Master antaa päivittäin tehtävälistoja kehittäjille. Roolivirhe? |
| ⬜ | 2 | `b03-scrum-team-stable-membership` | Johto kiertää kehittäjiä projektien välillä viikoittain. Miksi Scrum Ma… |
| ⬜ | 3 | `b04-scrum-cross-functional-delivery` | Tiimi viimeistelee koodin mutta increment jää testaamatta ja dokumentoi… |
| ⬜ | 2 | `b04-scrum-sm-facilitator` | Scrum Master alkaa jakaa teknisiä tehtäviä kehittäjille dailyssa. Onko … |
| ⬜ | 2 | `b05-scrum-dev-ownership` | Projektipäällikkö jakaa tehtävät yksittäisille kehittäjille dailyssa. O… |
| ⬜ | 3 | `b05-scrum-sm-impediment` | Tiimin build-palvelin on ollut alhaalla kolme päivää. Kuka Scrum-roolis… |
| ⬜ | 2 | `b06-scrum-cross-functional` | Tiimi tarvitsee ulkopuolisen testaajan jokaisen sprintin lopussa. Onko … |
| ⬜ | 2 | `b06-scrum-po-stakeholder` | Stakeholder pyytää featurea suoraan kehittäjältä ohittamalla backlog. K… |
| ⬜ | 3 | `b06-scrum-scrum-master-coaching` | Tiimi pyytää Scrum Masteria ratkaista tekninen arkkitehtuurikiista. Mit… |
| ⬜ | 2 | `b07-scrum-team-cross-functional` | Tiimissä on vain backend-kehittäjiä — frontend odottaa erillistä tiimiä… |
| ⬜ | 2 | `b07-scrum-team-size` | Organisaatio haluaa yhteen Scrum Teamiin 15 kehittäjää. Mitä Scrum Guid… |
| ⬜ | 2 | `b08-scrum-sm-impediment` | Build-palvelin on ollut alhaalla kolme päivää — tiimi odottaa passiivis… |
| ⬜ | 2 | `b08-scrum-team-self-organizing` | Projektipäällikkö jakaa tehtävät kehittäjille yksitellen joka aamu. Mik… |
| ⬜ | 3 | `b09-scrum-cross-functional-gap` | Tiimi tarvitsee aina ulkopuolisen testaajan ennen releasen merkitsemist… |
| ⬜ | 3 | `b09-scrum-scrum-of-scrums` | Viisi Scrum-tiimiä työskentelee samassa tuotteessa — riippuvuudet aiheu… |
| ⬜ | 2 | `exp-scrum-team-po-authority` | Kehittäjä haluaa priorisoida oman teknisen refaktoroinnin tuoteomistaja… |
| ⬜ | 3 | `exp-scrum-team-sm-impediment` | CI-putki on ollut punaisena kolme päivää ja hidastaa koko tiimiä. Scrum… |
| ⬜ | 3 | `scrum-team-cross-functional` | Mitä tarkoittaa että Scrum-tiimi on cross-functional? |
| ⬜ | 3 | `scrum-team-size` | Mikä on suositeltu Scrum-tiimin koko (devit) ennen koordinaatio-ongelmi… |

### Git (2/20)

#### CI/CD `git-ci` (0/9)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `ci-artifact-retention` | CI-build tuottaa binäärin joka pitää olla ladattavissa myöhemmin QA-tes… |
| ⬜ | 4 | `ci-github-actions-matrix` | Projekti pitää testata kolmella Node-versiolla ja kahdella käyttöjärjes… |
| ⬜ | 4 | `ci-parallel-stages` | CI-pipelinessa unit-testit ja lintterit voitaisiin ajaa rinnakkain nope… |
| ⬜ | 4 | `ci-secret-management` | Pipeline tarvitsee API-avaimen deployta varten. Missä avain säilytetään… |
| ⬜ | 3 | `jenkins-agent-label` | Jenkins-pipeline pitää ajaa tietyllä agentilla jossa on Docker asennett… |
| ⬜ | 4 | `jenkins-pipeline-stages` | Jenkins Declarative Pipelinessa build, test ja deploy tulisi ajaa peräk… |
| ⬜ | 5 | `jenkins-shared-library` | Useassa Jenkins-projektissa toistetaan samaa pipeline-logiikkaa. Miten … |
| ⬜ | 4 | `prod-ci-cache-lockfile` | CI käyttää dependency-cachea mutta buildit saavat satunnaisesti väärät … |
| ⬜ | 4 | `prod-ci-flaky-test` | Testi epäonnistuu vain joskus CI:ssä. Mikä on hyvä ensimmäinen askel? |

#### Git-työnkulku `git-workflow` (2/11)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `git-cherry-pick-conflict` | Haluat tuoda yksittäisen commitin toisesta branchista ilman koko haaran… |
| ⬜ | 3 | `git-log-filtering` | Haluat nähdä vain yhden tiedoston muutoshistorian viimeisen kuukauden a… |
| ⬜ | 3 | `git-merge-conflict-resolve` | git merge tuottaa CONFLICT-merkintöjä tiedostoon. Mikä on oikea työnkul… |
| ⬜ | 4 | `git-rebase-interactive` | Feature-branchissa on 5 pientä committia jotka pitäisi yhdistää siistik… |
| ⬜ | 4 | `git-reflog-recovery` | Vahingossa ajoit git reset --hard ja menetit committeja. Miten palautat… |
| ⬜ | 3 | `git-reset-vs-revert` | Viimeisin commit mainiin on buginen ja kollegat ovat jo pullanneet sen.… |
| ⬜ | 3 | `git-stash-workflow` | Keskeneräinen työ pitää siirtää sivuun nopeasti ilman committia esim. b… |
| ⬜ | 3 | `git-tag-release` | Release pitää merkitä niin että CI voi triggata deployment tietystä ver… |
| ⬜ | 4 | `git-worktree` | Haluat työstää kahta branchia samanaikaisesti ilman stashia tai committ… |
| ✅ | 4 | `prod-git-bisect` | Regressio ilmestyi jossain 200 commitin välillä. Mikä Git-työkalu autta… |
| ✅ | 4 | `prod-git-force-with-lease` | Rebase tehtiin ja branch pitää puskea uudestaan. Miten vältät että ylik… |

### Backend (0/5)

#### backend-API `backend-api` (0/1)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `prod-backend-webhook-idempotency` | Maksupalvelu lähettää saman webhookin kahdesti verkkohäiriön jälkeen. M… |

#### backend-data `backend-data` (0/3)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 3 | `prod-backend-n-plus-one` | Lista käyttäjistä haetaan yhdellä queryllä, mutta jokaiselle tehdään er… |
| ⬜ | 4 | `prod-backend-optimistic-lock` | Kaksi käyttäjää muokkaa samaa riviä ja viimeinen tallennus ylikirjoitta… |
| ⬜ | 4 | `prod-backend-transfer-transaction` | Rahansiirto vähentää saldoa yhdeltä tililtä ja lisää toiselle. Toinen p… |

#### incident-hallinta `ops-incident` (0/1)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 5 | `prod-ops-observability` | Tuotannossa satunnainen datan korruptio, mutta lokit eivät riitä juuris… |

### Turvallisuus (3/4)

#### web-turvallisuus `web-security` (3/4)

| | diff | id | kysymys |
|---|------|-----|---------|
| ✅ | 4 | `prod-sec-csrf` | Selain lähettää session-cookien automaattisesti myös haitalliselta sivu… |
| ⬜ | 4 | `prod-sec-jwt-claims` | API hyväksyy JWT:n tarkistamatta `exp`- ja `aud`-kenttiä. Mikä riski? |
| ✅ | 4 | `prod-sec-password-hash` | Salasanat tallennetaan SHA-256-hasheina ilman suolaa. Mikä parempi ratk… |
| ✅ | 3 | `prod-sec-xss` | Käyttäjän kommentti renderöidään HTML:ään ilman escapetusta. Mikä riski? |

### Robot Framework (0/12)

#### RF-laajennukset `rf-advanced` (0/1)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `rf-custom-python-keyword` | Tarvitset monimutkaista laskentaa jota ei voi tehdä RF-avainsanoilla. M… |

#### Robot Framework `rf-basics` (0/6)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `rf-data-driven` | Sama testi pitää ajaa kymmenellä eri syöte/tulos -parilla. Miten Robot … |
| ⬜ | 3 | `rf-keyword-structure` | Robot Frameworkissa testi koostuu avainsanoista. Miten oma avainsana (k… |
| ⬜ | 3 | `rf-library-import` | Testissä tarvitset käyttöjärjestelmäkomentoja (ls, mkdir). Mikä kirjast… |
| ⬜ | 3 | `rf-resource-files` | Useat .robot-testitiedostot tarvitsevat samoja avainsanoja. Miten jaat … |
| ⬜ | 3 | `rf-setup-teardown` | Jokainen testi tarvitsee selaimen avauksen alussa ja sulkemisen lopussa… |
| ⬜ | 3 | `rf-variables` | Robot Frameworkissa on lista URL-osoitteita joita käytetään testissä. M… |

#### RF suoritus/CI `rf-execution` (0/3)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `rf-ci-integration` | Robot Framework -testien tulokset pitää raportoida Jenkinsiin. Mikä tul… |
| ⬜ | 4 | `rf-run-on-failure` | Haluat automaattisen kuvakaappauksen jokaisesta epäonnistuneesta web-te… |
| ⬜ | 3 | `rf-tags-include-exclude` | Testisuitessa on 200 testiä mutta haluat ajaa vain smoke-testit CI:ssä.… |

#### RF web-testaus `rf-web` (0/2)

| | diff | id | kysymys |
|---|------|-----|---------|
| ⬜ | 4 | `rf-browser-library` | Robot Frameworkilla pitää testata modernia SPA-sovellusta. Mikä kirjast… |
| ⬜ | 3 | `rf-wait-until` | Web-testi epäonnistuu koska elementti ei ole vielä näkyvissä sivun lata… |

## Komennot

```bash
npm run study:todo      # päivitä tämä lista
npm run study:sync      # synkkaa Docusaurus-docs
npm run study:progress  # tiivistelmä terminaaliin
```
