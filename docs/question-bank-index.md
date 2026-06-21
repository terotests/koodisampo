# Koodisampo — kysymyspankin kooste

Yhteensä **1025** kysymystä. Generoitu: `node scripts/questions-export-md.mjs`

Oikea vastaus merkitty **lihavoituna**.

## backend (5)

### backend-api (1)

#### `prod-backend-webhook-idempotency` · diff 4

Maksupalvelu lähettää saman webhookin kahdesti verkkohäiriön jälkeen. Miten vältät tuplakirjauksen?

- **Idempotency key / tapahtuma-id ja deduplikointi transaktion sisällä** ✓
- Oleta että webhook tulee aina kerran
- Lisää timeout ja toivo
- Poista kaikki retryt palveluntarjoajalta

### backend-data (3)

#### `prod-backend-n-plus-one` · diff 3

Lista käyttäjistä haetaan yhdellä queryllä, mutta jokaiselle tehdään erillinen query profiiliin. Mikä ongelma?

- **N+1-query — suorituskyky heikkenee datamäärän kasvaessa** ✓
- SQL ei tue listoja
- Indeksi korjaa aina kaiken automaattisesti
- ORM estää kaikki query-ongelmat

#### `prod-backend-optimistic-lock` · diff 4

Kaksi käyttäjää muokkaa samaa riviä ja viimeinen tallennus ylikirjoittaa toisen muutokset huomaamatta. Mikä auttaa?

- **Version-kenttä / optimistic locking — UPDATE vain jos version ei muuttunut** ✓
- Isompi timeout riittää
- DELETE + INSERT aina päivityksessä
- Piilota toinen käyttäjä UI:ssa

#### `prod-backend-transfer-transaction` · diff 4

Rahansiirto vähentää saldoa yhdeltä tililtä ja lisää toiselle. Toinen päivitys epäonnistuu kesken. Mitä tarvitaan?

- **Tietokantatransaktio — commit vain jos kaikki vaiheet onnistuvat** ✓
- Kaksi erillistä UPDATE:ia ilman rollbackia
- sleep() queryjen välissä
- Logitus riittää — korjataan myöhemmin

### ops-incident (1)

#### `prod-ops-observability` · diff 5

Tuotannossa satunnainen datan korruptio, mutta lokit eivät riitä juurisyyn löytämiseen. Mikä ensimmäinen parannus ennen isoa refaktorointia?

- **Observability: korrelaatio-id, rakenteiset lokit ja invarianttitarkistukset kriittisiin kohtiin** ✓
- Kirjoita koko järjestelmä uusiksi
- Poista varoitukset — vähemmän hälytystä
- Aja debuggeri suoraan tuotannossa

## cpp (178)

### correctness (20)

#### `b02-cpp-correct-dangling-15` · diff 4

Funktio palauttaa `const std::string&` paikallisesta muuttujasta — crash tuotannossa. Mikä on oikea paluutyyppi?

- **std::string arvona (RVO) tai std::string_view vain jos elinikä taattu** ✓
- const string& aina tehokkain
- static string local — thread-safe
- char* literaaliin

#### `b02-cpp-correct-signed-14` · diff 3

Bugiraportti: `if (index >= 0)` on aina tosi kun `index` on `size_t`. Miksi tarkistus on hyödytön?

- **size_t on unsigned — vertailu nollaan on aina tosi, ei tarkista virheitä** ✓
- Kääntäjäbugi
- Optimointi -O3 rikkoo vertailun
- size_t on signed

#### `b03-cpp-correct-three-way-default` · diff 3

Sorttaus comparator palauttaa `true` kun a==b — std::sort käyttäytyy oudosti. Mikä C++20 auttaa?

- **<=> (spaceship) tai std::strong_ordering — totaalinen järjestys** ✓
- Palauta a < b || a == b
- Käytä qsort C:stä
- Comparator ei saa koskaan palauttaa false

#### `b03-cpp-prod-exception-noexcept` · diff 4

Move-operaattori heittää poikkeuksen — std::vector reallokoi kesken ja tila epävarma. Mitä merkitset?

- **noexcept move — kontainerit käyttävät movea vain jos noexcept** ✓
- throw() on pakollinen kaikissa funktioissa
- Poista move — käytä copy aina
- catch(...) move-operaattorissa

#### `b04-cpp-auto-deduction-trap` · diff 3

`auto x = {1, 2, 3};` aiheuttaa yllätyksen — x ei ole std::vector. Mikä tyyppi deduktoidaan?

- **std::initializer_list<int>** ✓
- std::vector<int>
- std::array<int, 3>
- int[3]

#### `b04-cpp-final-override-virtual` · diff 3

Aliluokka ylikirjoittaa `virtual void draw()` mutta perusluokan signatuuri muuttuu — override ei kaadu. Miten estät?

- **override avainsana — kääntäjä varoittaa jos ei matchaa basea** ✓
- Kommentti // overrides Base::draw
- final kaikille funktioille automaattisesti
- Poista virtual — käytä switch type:llä

#### `b05-cpp-explicit-constructor` · diff 3

Luokka `Meters(int v)` aiheuttaa vahingossa implisiittisiä muunnoksia. Miten estät?

- **explicit-konstruktori — estää hiljaiset muunnokset** ✓
- private konstruktori riittää
- delete default constructor
- Muuta int double:ksi

#### `b05-cpp-signed-compare-bug` · diff 4

Bugi: `for (int i = 0; i < vec.size(); ++i)` — size_t vs int vertailu. Mikä on riski?

- **Implisiittinen signed/unsigned vertailu voi aiheuttaa ikuisen silmukan** ✓
- Ei riskiä — kääntäjä korjaa automaattisesti
- Vain debug-buildissa ongelma
- int on aina turvallisempi kuin size_t

#### `b06-cpp-signed-compare-bug` · diff 4

Code review: `if (a < b)` missä a on int ja b size_t — tuotannossa väärä haara. Mikä on riski?

- **Signed/unsigned vertailu konvertoi — negatiivinen int näyttää suurelle** ✓
- Kääntäjä varoittaa aina — ei tuotantoongelma
- size_t on aina signed C++17:ssä
- Vain float-vertailu on vaarallinen

#### `b06-cpp-static-cast-review` · diff 2

Code review: C-style `(int)x` muunnos. Miksi static_cast on parempi?

- **static_cast on näkyvä ja rajattu — helpompi grep ja turvallisempi** ✓
- C-style cast on nopeampi käännöksessä
- static_cast poistaa kaikki castit
- Kääntäjä kieltää static_cast C++20

#### `b07-cpp-assert-vs-expect` · diff 3

assert() katoaa release-buildissa mutta invariantti on kriittinen tuotannossa. Mitä käytät?

- **Contract tai runtime check + throw/log — assert vain debug-invarianteille** ✓
- assert riittää aina tuotantoon
- Poista kaikki tarkistukset release:ssä
- #ifdef DEBUG around return

#### `b07-cpp-rule-of-five` · diff 4

Luokka hallitsee dynaamista bufferia mutta määrittelee vain destructorin. Mikä puuttuu?

- **Rule of five: copy/move ctor + copy/move assign — tai = delete / = default tietoisesti** ✓
- Destructor riittää aina
- Vain copy constructor tarvitaan
- Smart pointer korvaa luokan — ei tarvita mitään

#### `b08-cpp-assert-ndebug` · diff 3

Release-buildissa assert(ei-null) poistuu — nullptr kaataa myöhemmin. Mitä teet tuotantovalvontaan?

- **assert vain kehitykseen — tuotannossa explicit check + error handling** ✓
- assert toimii release-buildissä
- Poista kaikki tarkistukset nopeuden vuoksi
- NDEBUG määrittää assertin aina päälle

#### `b09-cpp-narrowing-conversion` · diff 4

Laskenta `int64_t` → `int32_t` hiljaa truncaa arvon. Miten estät käännösaikana?

- **Brace-init {value} — narrowing antaa varoituksen/virheen** ✓
- static_cast riittää aina turvallisuuteen
- Muuta int32_t int64_t:ksi — ei ongelmaa
- Narrowing on vain floating point -ongelma

#### `b09-cpp-switch-fallthrough` · diff 3

Switch-case putoaa vahingossa seuraavaan caseen — bugi löytyy vasta tuotannosta. Moderni dokumentointi?

- **[[fallthrough]] attribuutti tai break — eksplisiittinen intentti** ✓
- goto case2 — selkeämpi
- Switch on deprecated — käytä if-ketjua
- Compiler korjaa fallthrough automaattisesti

#### `correct-overflow` · diff 4

Signed integer ylivuoto C++:ssa tuotantokoodissa — mitä standardi sanoo?

- **Undefined behavior — älä luota wraparoundiin** ✓
- Määritelty modulo-käyttäytyminen aina
- Vain debug-buildissa ongelma
- Kääntäjä korjaa automaattisesti

#### `correct-signed-unsigned` · diff 3

Miksi `for (int i = 0; i < v.size(); i++)` voi olla vaarallinen?

- **size_t vs int vertailu voi aiheuttaa väärän haaran tai ikuisen silmukan** ✓
- int on aina liian pieni
- vector.size() palauttaa int
- Ei voi olla vaarallinen

#### `correct-ub` · diff 3

Mitä tarkoittaa undefined behavior (UB) C++:ssa?

- **Kääntäjä saa tehdä mitä tahansa — bugi voi olla mitätön** ✓
- Ohjelma kaatuu aina heti
- Vain debug-buildissa ongelma
- Sama kuin implementation-defined

#### `exp-cpp-correct-compare-three-way` · diff 4

Sorttaus comparator palauttaa `<` ja `>` mutta unohtaa yhtäsuuruuden — epävakaa sort. C++20 ratkaisu?

- **operator<=> (three-way comparison) tai std::strong_ordering** ✓
- Palauta aina -1 tai 1
- Käytä memcmp kaikille tyypeille
- Poista sort — käytä linked list

#### `exp-cpp-incident-nodiscard` · diff 3

Tuotantoon meni buildi jossa `parseConfig()` palautusarvo ignoroitiin — virheellinen config jäi käyttöön. Miten estät toistumisen?

- **[[nodiscard]] paluuarvolle — kääntäjä varoittaa** ✓
- Kommentti // MUST CHECK
- Muuta funktio void:ksi ja käytä globaalia flagia
- Poista return ja käytä poikkeusta aina

### cpp-production (8)

#### `prod-cpp-coroutine-lifetime` · diff 5

Coroutine käyttää viittausta paikalliseen muuttujaan `co_await` jälkeen. Mikä riski?

- **Viittaus voi roikkua — coroutine jatkuu myöhemmin eri elinkaaressa** ✓
- co_await kopioi kaiken automaattisesti frameen
- Coroutine estää dangling-referenssit automaattisesti
- volatile korjaa lifetime-ongelman

#### `prod-cpp-false-sharing-struct` · diff 4

Kaksi std::atomic-laskuria on vierekkäin structissa ja eri säikeet päivittävät niitä. Miksi suorituskyky romahtaa?

- **False sharing — eri muuttujat jakavat saman cache linen** ✓
- Atomic ei toimi structin jäsenenä
- CPU ei tue kahta laskuria rinnakkain
- Mutex puuttuu aina atomicien kanssa

#### `prod-cpp-jthread-stop` · diff 4

Worker-säie pitää pysäyttää siististi olion tuhoutuessa. Mikä C++20-työkalu auttaa?

- **std::jthread + stop_token — joinaa automaattisesti ja tukee pysäytyspyyntöä** ✓
- std::thread ilman joinia destructorissa
- detach aina destructorissa
- sleep-loop ilman stop-flagia

#### `prod-cpp-optional-deref` · diff 3

Koodi tekee `return *findUser(id);` missä `findUser` palauttaa `std::optional<User>`. Mikä ongelma?

- **Optional pitää tarkistaa ennen dereferointia — tyhjä optional on UB** ✓
- optional heittää aina poikkeuksen jos tyhjä
- optional palauttaa nullptr dereferoinnissa
- optional ei voi olla tyhjä C++17:ssä

#### `prod-cpp-raii-rollback` · diff 4

Funktio kirjoittaa kaksi konfiguraatiotiedostoa ja toinen kirjoitus epäonnistuu kesken. Miten varmistat ettei järjestelmä jää puoliksi päivitettyyn tilaan?

- **Kirjoita väliaikaiseen tiedostoon ja tee atominen rename/commit vasta kun kaikki on valmista** ✓
- Kirjoita suoraan alkuperäisiin tiedostoihin — nopein tapa
- Lisää sleep ennen toista kirjoitusta
- Catchaa kaikki poikkeukset ja jatka seuraavaan tiedostoon

#### `prod-cpp-span-member` · diff 4

Luokan API ottaa `std::span<int>` konstruktorissa ja tallentaa sen jäsenmuuttujaan myöhempää käyttöä varten. Mikä riski?

- **span ei omista dataa — tallennettu näkymä voi jäädä roikkumaan kun puskuri tuhoutuu** ✓
- span kopioi datan automaattisesti jäseneksi
- span pitää vectorin automaattisesti elossa
- span estää kaikki lifetime-bugit

#### `prod-cpp-string-view-member` · diff 4

Luokka ottaa konstruktorissa `std::string_view name` ja tallentaa sen suoraan jäseneksi. Mikä pitää varmistaa?

- **Viitatun merkkijonon elinikä ylittää olion eliniän — muuten tallenna std::string** ✓
- string_view omistaa datan automaattisesti
- string_view kopioi aina stringin jäseneksi
- const riittää takaamaan eliniän

#### `prod-cpp-variant-visit` · diff 4

Uusi vaihtoehto lisätään `std::variant`-tyyppiin, mutta käsittely unohtuu koodista. Miten saat kääntäjän auttamaan?

- **std::visit + exhaustive visitor / static_assert fallback uusille tyypeille** ✓
- Korvaa variant std::any:llä
- Muunna kaikki stringiksi switchissä
- Lisää default-haara joka ignoraa tuntemattoman arvon

### maintainability (18)

#### `b02-cpp-maintain-string-view-07` · diff 3

Funktio ottaa `const std::string&` mutta kutsutaan literaaleilla — turhia allokaatioita. Parempi parametri?

- **std::string_view — ei kopioi, hyväksyy stringin ja C-str:n** ✓
- const char* aina
- std::string kopio parametrina
- Macro STR(x)

#### `b02-cpp-maintain-structured-08` · diff 2

Koodi purkaa `std::pair<int,std::string>` käsin `.first` ja `.second`. Moderni tapa?

- **structured bindings: `auto [id, name] = row;`** ✓
- Macro GET_FIRST(x)
- Kopioi pair erillisiin muuttujiin ilman auto
- Käytä void*

#### `b03-cpp-maintain-copy-swap` · diff 4

Tiimi kirjoittaa copy assignment -operaattorin käsin ja unohtaa self-assignmentin. Idiomivaihtoehto?

- **Copy-and-swap: copy constructor + swap — strong exception safety** ✓
- memcpy koko structille
- Poista copy assignment ja käytä shallow copy
- Globaali flag selfAssignmentDetected

#### `b03-cpp-sprint-const-correctness` · diff 2

Code review: getter palauttaa `std::string` kopiona vaikka dataa ei muuteta. Parannus?

- **const std::string& tai std::string_view read-only pääsyyn** ✓
- Palauta aina shared_ptr<string>
- Muuta getter -> global
- Poista const metodeista

#### `b04-cpp-ranges-filter-view` · diff 3

Koodi luo väliaikaisen vectorin vain suodattaakseen ja laskeakseen count:in. C++20 ranges tapa?

- **std::ranges::count_if(container, pred) — lazy, ei väliaikaista vectoria** ✓
- Kopioi aina std::list suodatukseen
- Macro FILTER_AND_COUNT
- Poista suodatus — laske kaikki

#### `b04-cpp-structured-bindings-map` · diff 2

Silmukka käy std::map:in läpi: `for (auto& p : map) { auto k = p.first; auto v = p.second; }`. Modernisointi?

- **for (auto& [key, val] : map) — structured bindings C++17** ✓
- Muuta map unordered_map:iksi aina
- Käytä C-style for (int i=0...)
- Kopioi map joka iteroinnilla

#### `b05-cpp-avoid-raw-loop` · diff 2

Sprint review: sama for-silmukka toistuu viidessä tiedostossa. Mitä ehdotat refaktorointiin?

- **range-for tai std::for_each — vähemmän toistoa, selkeämpi intentti** ✓
- Kopioi silmukka makroksi COPY_LOOP
- Jätä — optimointi tärkeämpää kuin luettavuus
- Muuta kaikki goto-pohjaiseksi

#### `b06-cpp-ranges-adaptors` · diff 3

Silmukka filtteröi ja muuntaa konttia — lukija ei näe intentiota. Miten modernisoida?

- **std::ranges::views::filter ja transform — lazy pipeline** ✓
- Kopioi kontti useaan kertaan
- Käytä makro FOR_EACH
- Siirrä logiikka globaaliin funktioon

#### `b07-cpp-clang-tidy-ci` · diff 3

Code reviewissa samat CppCoreGuidelines-rikkomukset toistuvat. Miten automatisoi tarkistus CI:ssä?

- **clang-tidy tai static analyzer build-vaiheessa — fail build jos uudet varoitukset** ✓
- Luota pelkkään manuaaliseen reviewhin
- Poista kaikki varoitukset -w
- Vain runtime testit riittävät

#### `b07-cpp-pimpl-abi` · diff 4

Jaettu kirjasto muuttuu usein — headerin muutos pakottaa koko projektin uudelleenkäännön. Mitä kuvio?

- **Pimpl (pointer to implementation) — vain impl muuttuu, header pysyy** ✓
- Kaikki private memberit headeriin
- inline kaikki funktiot headeriin
- Poista private osio

#### `b08-cpp-format-safety` · diff 3

Logitus käyttää sprintf-puskuria — satunnainen overflow tuotannossa. Korvaava C++20-ratkaisu?

- **std::format — tyyppiturvallinen muotoilu** ✓
- printf on turvallisempi kuin format
- stringstream + operator<< riittää aina
- sprintf with bigger buffer

#### `b09-cpp-extract-function-refactor` · diff 2

200-rivinen funktio vaikeuttaa unit testausta. Mitä refaktorointia ehdotat ensin?

- **Extract function — pienemmät testattavat yksiköt selkeillä nimillä** ✓
- Lisää #ifdef TEST_MODE
- Kopioi logiikka testitiedostoon
- Funktio on OK jos toimii tuotannossa

#### `exp-cpp-cr-raii-file` · diff 2

Funktio avaa FILE*:n mutta early return ennen fclose:a. Mitä ehdotat code reviewissa?

- **RAII: std::unique_ptr<FILE, decltype(&fclose)> tai std::fstream** ✓
- goto cleanup — ainoa turvallinen tapa
- Poista early returnit
- fclose vain happy pathissa

#### `exp-cpp-sprint-algorithm-review` · diff 2

Sprintin lopussa löytyy käsin kirjoitettu for-silmukka joka etsii max-arvon vektorista. Mitä ehdotat?

- **std::max_element — vähemmän off-by-one -virheitä** ✓
- Macro MAX(a,b) jokaiselle vertailulle
- Kopioi silmukka kolmeen paikkaan varmuuden vuoksi
- Poista tarkistus — optimointi ensin

#### `maintain-const-method` · diff 2

Miten merkitset metodin joka ei muuta olion tilaa?

- **Lisää const metodin loppuun** ✓
- Käytä volatile
- static-metodi aina
- #pragma const

#### `maintain-init-list` · diff 2

Miksi `std::vector<int> v{1, 2, 3}` on turvallisempi kuin `vector<int>(3)` kun tarkoitus on kolme arvoa?

- **Aaltosulut alustavat elementit — (3) luo kolme nollaa** ✓
- Ei eroa
- Sulkeet pakottavat heap-allokaation
- Vain C-koodi voi käyttää {}

#### `maintain-range-for` · diff 1

Mikä on selkein tapa käydä kokoelma läpi ilman indeksivirheitä?

- **range-for: for (const auto& x : c)** ✓
- for (int i = 0; i <= c.size(); i++)
- while(true) ilman rajaa
- goto loop

#### `maintain-string-view` · diff 3

Milloin `std::string_view` on hyödyllinen?

- **Kun tarvitset vain luku-oikeuden merkkijonoon ilman kopiota** ✓
- Kun merkkijono pitää muokata
- Korvaa aina std::string
- Vain heap-allokaatioon

### performance (17)

#### `b02-cpp-perf-move-09` · diff 3

Iso `std::vector<int>` palautetaan funktiosta — reviewer ehdottaa `std::move(returnVec)`. Onko se oikein?

- **Ei — NRVO/RVO usein estää kopion ilman movea** ✓
- Kyllä, move aina pakollinen
- Palauta shared_ptr
- Kopioi aina varmuuden vuoksi

#### `b02-cpp-perf-shrink-10` · diff 3

Vektori kasvaa miljoonaan elementtiin ja tyhjennetään — muisti ei vapaudu. Mitä kutsut?

- **shrink_to_fit() tai swap-trick vanhoilla kääntäjillä** ✓
- clear() riittää aina vapauttamaan kapasiteetin
- resize(0) ja toivo
- delete vector

#### `b03-cpp-cr-move-semantics` · diff 3

Code reviewissa funktio palauttaa suuren `std::vector` arvona ja reviewer ehdottaa `std::move`-paluuta. Miksi?

- **RVO/NRVO usein riittää — move on turha tai voi estää optimoinnin** ✓
- std::move palautuksessa on aina pakollinen C++17:ssä
- move tekee palautuksesta thread-safen automaattisesti
- Palauta aina const reference suorituskyvyn vuoksi

#### `b03-cpp-perf-string-reserve` · diff 2

Silmukka liittää tuhansia rivejä `std::string`iin — profiloija näyttää toistuvia realokointeja. Ensimmäinen korjaus?

- **result.reserve(estimatedSize) ennen silmukkaa** ✓
- Vaihda string -> C-merkkijono strcat
- Poista reserve — se hidastaa aina
- Käytä ostringstream ilman reservea

#### `b04-cpp-move-noexcept-vector` · diff 3

std::vector<MyType> kasvaa hitaasti vaikka move-operaattori on olemassa. Profileri näyttää kopioita. Todennäköisin syy?

- **Move-operaattori ei ole noexcept — vector käyttää copya reallocationissa** ✓
- Vector on liian pieni reserve:lle
- Move on aina hitaampi kuin copy
- Poista move-operaattori kokonaan

#### `b05-cpp-move-review-temp` · diff 3

Code review ehdottaa `std::move` jokaiselle parametrille funktiossa. Milloin move on järkevä?

- **Kun lähde ei enää tarvita — esim. viimeinen käyttö ennen returnia** ✓
- Aina kaikille parametreille suorituskyvyn vuoksi
- Vain const-viitauksille
- Move korvaa copyn automaattisesti — ei tarvitse std::move

#### `b05-cpp-rvo-return-local` · diff 3

Funktio palauttaa `std::string` paikallisesta muuttujasta. Onko turha kopiointi väistämätön?

- **Ei — RVO/NRVO voi eliminoida kopion kääntäjäoptimoinnilla** ✓
- Kyllä — aina kaksi kopiota
- Vain jos palautat std::move(local)
- Palauta aina shared_ptr stringistä

#### `b06-cpp-alignas-cache` · diff 5

Hot loop kärsii cache miss — kaksi counteria samassa cache line:ssä eri threadeilla. Mitä kokeilla?

- **alignas(64) tai erilliset cache line — vähentää false sharing** ✓
- Lisää volatile kaikille muuttujille
- Käytä float double tilalle
- Poista mutex — false sharing ei vaikuta

#### `b07-cpp-reserve-vector` · diff 2

Silmukka push_backaa miljoona elementtiä — profileri näyttää toistuvia allokaatioita. Ensimmäinen optimointi?

- **vector.reserve(n) ennen silmukkaa — vähentää reallokaatioita** ✓
- Käytä list<T> aina
- Poista reserve — se hidastaa
- Muuta push_back emplace_backiksi ilman reservea

#### `b08-cpp-emplace-back` · diff 2

vectoriin lisätään monimutkaisia olioita — push_back(T(...)) luo turhan kopion. Miten vältät väliaikaisen?

- **emplace_back(args...) — rakentaa suoraan konttiin** ✓
- reserve() korvaa emplace_backin
- push_back on aina nopein
- insert(0, obj) on moderni tapa

#### `b08-cpp-ranges-pipeline` · diff 3

Suodatat ja muunnat vectorin — väliaikaisia vector-kopioita tulee liikaa. C++20 ranges tapa?

- **views::filter | views::transform — laiska ketju ilman välikopiota** ✓
- Kopioi aina uuteen vectoriin ensin
- ranges hidastaa aina
- for-loop on kielletty ranges:n kanssa

#### `b09-cpp-emplace-back-move` · diff 3

Rakennat isoja olioita suoraan vectoriin väliaikaisten kopioiden sijaan. Mikä metodi?

- **emplace_back — konstruoi paikalleen argumenteilla** ✓
- push_back on aina tehokkaampi
- insert(0, obj) jokaiselle
- reserve korvaa emplace_backin

#### `b09-cpp-vector-reserve-incident` · diff 3

Profilointi näyttää tuhansia vector-reallokaatioita request-käsittelyssä. Ensimmäinen optimointi?

- **reserve() kun alkiomäärä on arvioitavissa etukäteen** ✓
- Korvaa vector list:llä aina
- Poista kaikki push_back — käytä indeksointia
- reserve hidastaa aina — älä käytä

#### `exp-cpp-perf-reserve-vector` · diff 3

Profileri näyttää tuhansia vector-uudelleenallokaatioita CSV-parserissa. Ensimmäinen optimointi?

- **reserve(estimatedSize) ennen push_back-silmukkaa** ✓
- Vaihda list<int> — aina nopeampi
- Poista const correctness
- Käytä realloc suoraan

#### `perf-move` · diff 3

Milloin `std::move` on perusteltu suurille objekteille?

- **Kun et enää tarvitse lähdearvoa** ✓
- Aina jokaisessa funktiokutsussa
- const-objekteille
- Korvaa kaikki kopiot automaattisesti

#### `perf-noexcept` · diff 3

Miksi `noexcept` voi auttaa move-operaatioissa?

- **Kontainerit voivat valita move vs copy luottavaisemmin** ✓
- Se poistaa kaikki poikkeukset käännöksessä
- Se tekee koodista aina nopeampaa
- Se korvaa std::move

#### `perf-rvo` · diff 4

Funktio palauttaa suuren `std::vector` arvona. Mikä usein välttää kopion C++17:ssä?

- **RVO / NRVO — kääntäjä optimoi paluuarvon paikalleen** ✓
- Pakollinen std::move jokaisessa returnissa
- Palauta aina osoitin
- vector ei voi palautua arvona

### portability (9)

#### `b02-cpp-portability-stdint-11` · diff 2

Verkkoprotokolla vaatii tarkalleen 32-bittisen unsigned-arvon. Mikä tyyppi on portable?

- **std::uint32_t (<cstdint>)** ✓
- unsigned int — aina 32-bittinen
- long — riippuu alustasta
- int32_t macro omasta headerista

#### `b03-cpp-portability-fixed-width` · diff 2

Verkkoprotokolla tallentaa `uint32_t` binäärimuodossa eri alustoille. Mitä tyyppiä käytät?

- **std::uint32_t (<cstdint>) — kiinteä leveys** ✓
- unsigned int — aina 32-bittinen
- long — riittää kaikissa
- size_t protokollakentässä

#### `b04-cpp-portability-fixed-width` · diff 3

Wire-protokolla käyttää `int` ja `long` — eri alustoilla eri koko. Portable korvaaja?

- **stdint.h: int32_t, uint64_t jne. — kiinteä leveys** ✓
- short aina 16-bit — standardi takaa
- sizeof(int) == 4 kaikkialla
- long long on aina 64-bit

#### `b06-cpp-portability-alignof` · diff 3

Serialisointi verkossa — struct padding rikkoo protokollaa eri arkkitehtuurilla. Miten tarkistat?

- **alignof ja offsetof — ymmärrä layout ennen wire-formatia** ✓
- Oleta että sizeof on sama kaikilla
- Käytä #pragma pack 1 ilman testausta
- Lähetä struct binaarisena memcpy:llä aina

#### `b07-cpp-endian-portable` · diff 4

Binääriprotokolla lukee uint32:n verkosta — arvo väärä ARM:llä. Miten C++20 auttaa?

- **C++20: std::endian + oma byteswap; C++23: std::byteswap** ✓
- reinterpret_cast riittää aina
- volatile korjaa endiannessin
- Käytä float double castia

#### `b08-cpp-modules-headers` · diff 4

Buildi hidastuu massiivisista include-ketjuista. C++20 ratkaisu uudelle moduulille?

- **export module + import — käännä moduuli kerran, käytä import** ✓
- #pragma once korvaa moduulit
- PCH riittää aina — moduuleja ei tarvita
- inline kaikki headeriin

#### `b10-cpp-portability-abi-01` · diff 3

Jaetaan kirjasto Windowsin ja Linuxin välillä. Mikä rajapintavalinta parantaa ABI-vakautta?

- **Ulkoiset C-tyyliset funktiot + export-makrot; vältä STL rajapinnassa** ✓
- std::string ja std::vector suoraan DLL-exportissa
- Header-only aina ilman versionointia
- inline template kaikesta julkisesta API:sta

#### `exp-cpp-portability-byte-order` · diff 4

Verkkoprotokolla serialisoi uint32_t:n. Mikä C++17+ tapa välttää manuaaliset shift-makrot?

- **std::endian (C++20) + endian-kohtainen byteswap-helper; C++23: std::byteswap** ✓
- Kopioi sizeof(int) suoraan wireen
- Oleta aina little-endian
- union { uint32_t u; char c[4]; } — aina turvallinen

#### `portability-explicit` · diff 2

Miksi yksiparametrisessä konstruktorissa kannattaa usein `explicit`?

- **Estää hiljaiset implisiittiset muunnokset** ✓
- Nopeuttaa käännöstä merkittävästi
- Tekee luokasta final
- Pakottaa virtual-tuhoajan

### safety (36)

#### `b02-cpp-safety-make-unique-06` · diff 2

Tuotantokoodi käyttää `new Widget()` suoraan. Ensimmäinen turvallisuusparannus?

- **std::make_unique<Widget>() — poistaa yksittäisen new/delete-parin** ✓
- Käytä malloc
- shared_ptr aina vaikka ei jaeta
- Poista destruktorit

#### `b02-cpp-safety-noexcept-05` · diff 3

std::vector::push_back heittää poikkeuksen kesken move-operaatiosta — tila epävarma. Miten merkitset move-operaattorin?

- **noexcept move constructor/assignment — vector voi käyttää movea turvallisesti** ✓
- Poista move kokonaan
- try/catch jokaisessa push_back
- volatile move

#### `b03-cpp-prod-virtual-dtor` · diff 3

Tuotantobugi: `delete base_ptr` ei kutsu johdetun luokan destructoria. Mikä korjaus?

- **virtual ~Base() = default polymorfiselle pohjalle** ✓
- Käytä final-luokkaa base:na
- shared_ptr korjaa ilman virtual destructoria
- Muuta delete -> free()

#### `b03-cpp-safety-array-span` · diff 3

Legacy-funktio ottaa `int buf[256]` ja kutsuja antaa pienemmän pinon. Miten modernisoit rajapinnan?

- **std::array<int,256> tai std::span<int> — koko mukana** ✓
- Jatka C-taulukkoa — nopeampi
- Muuta int -> short
- Lisää kommentti // caller must ensure size

#### `b04-cpp-rule-of-five` · diff 4

Luokka hallitsee dynaamista bufferia — destructor on määritelty, mutta copy-assignment puuttuu. Tuotantobugi double-free. Periaate?

- **Rule of Five — määrittele tai =default/delete kaikki viisi special memberia** ✓
- Riittää destructor — muut generoituvat oikein
- Käytä memcpy copy-assignmentissa
- Poista destructor — smart pointer hoitaa

#### `b04-cpp-smart-ptr-make-shared` · diff 2

Code review: `shared_ptr<Foo>(new Foo(), customDeleter)`. Milloin make_shared EI ole oikea vaihtoehto?

- **Custom deleter vaatii shared_ptr-konstruktorin — make_shared ei tue sitä samalla tavalla** ✓
- make_shared on aina parempi myös custom deleterillä
- raw new on nopeampi aina
- shared_ptr ei tarvitse make_shared C++17:ssä

#### `b04-cpp-string-view-lifetime` · diff 4

Funktio palauttaa `std::string_view` joka viittaa paikalliseen std::stringiin. Tuotannossa satunnainen data. Mikä on oikea korjaus?

- **Palauta std::string tai pidä string elossa kutsujan omistuksessa** ✓
- Muuta string_view volatile:ksi
- Käytä const_cast poistamaan const
- string_view on aina turvallinen — bugi on muualla

#### `b05-cpp-lock-guard-incident` · diff 3

Tuotantobugi: mutex jää lukittuna poikkeuksen jälkeen. Miten estät tämän modernisti?

- **std::lock_guard tai std::scoped_lock — RAII vapauttaa automaattisesti** ✓
- mutex.unlock() jokaisessa catch-lohkossa käsin
- Poista try-catch — poikkeukset hidastavat
- Käytä volatile mutexia

#### `b05-cpp-make-unique-factory` · diff 2

Tehdasfunktio luo dynaamisen olion. Miksi `std::make_unique<T>()` on parempi kuin `new T()`?

- **make_unique on exception-safe eikä vuoda raw new:ia** ✓
- make_unique on aina nopeampi kuin stack-allokaatio
- new on kielletty C++17:ssä
- make_unique palauttaa raw pointerin

#### `b05-cpp-noexcept-move-review` · diff 4

Code review: move-konstruktori ei ole noexcept. `std::vector` resize hidastuu. Miksi?

- **Ilman noexcept move vector käyttää copy-fallbackia exception safety -syistä** ✓
- noexcept on vain dokumentaatiota — ei vaikuta
- Vector ei koskaan käytä move-operaatiota
- noexcept hidastaa move:a aina

#### `b05-cpp-string-view-lifetime` · diff 4

Funktio palauttaa `std::string_view` paikallisesta `std::string`:stä. Tuotannossa segfault. Mikä on juurisyy?

- **string_view ei omista dataa — viittaus tuhoutuneeseen stringiin** ✓
- string_view on aina kopio stringistä
- Segfault johtuu aina multithreadingista
- string_view vaatii shared_ptr:n

#### `b06-cpp-raii-scope-guard` · diff 3

Funktio avaa tiedoston ja pitää sulkea poikkeuksessa. Miten toteutat ilman try-finally?

- **RAII — std::ifstream tai custom scope guard destructorissa** ✓
- close() jokaisessa return-polussa käsin
- Älä käytä poikkeuksia tiedostofunktioissa
- fork uusi prosessi tiedoston avaamiseen

#### `b06-cpp-span-heap-buffer` · diff 4

API ottaa raw pointer ja pituus — buffer overrun tuotannossa. Miten modernisoida turvallisesti?

- **std::span<T> — kantaa pituuden ja rajaa käyttöä** ✓
- Käytä char* ilman pituutta — kutsija vastaa
- Vain std::vector — span on turha
- Lisää magic number bufferin alkuun

#### `b06-cpp-vector-emplace-back` · diff 3

Rakennat vektorin monimutkaisia olioita — push_back kopioi turhaan. Miten optimoit?

- **emplace_back rakentaa alkion inplace — vähemmän kopioita** ✓
- push_back on aina nopeampi
- Käytä reserve ja sitten at
- Lisää olio ensin stackille ja push_back

#### `b06-cpp-weak-ptr-cycle` · diff 4

Kaksi objekti jakaa shared_ptr toisiinsa — muisti ei vapaudu. Mikä ratkaisu rikkoo syklin?

- **Yksi suunta weak_ptr — shared_ptr sykli estyy** ✓
- Käytä raw pointer molemmissa suunnissa
- Lisää shared_ptr count manuaalisesti
- Käytä unique_ptr molemmissa — sama ongelma

#### `b07-cpp-optional-null-api` · diff 2

Hakufunktio palauttaa -1 kun avainta ei löydy — kutsujat sekoittavat virheen ja validin arvon. Parempi API?

- **std::optional<T> — arvo tai tyhjä ilman magic numberia** ✓
- Palauta 0 aina virheessä
- Heitä poikkeus jokaisesta missistä
- Globaali errno riittää

#### `b07-cpp-span-bounds-check` · diff 3

Funktio ottaa (T* data, size_t len) — tuotannossa buffer overflow. Mikä moderni tyyppi auttaa?

- **std::span<T> — kantaa pointer + pituuden yhdessä** ✓
- void* riittää aina
- std::vector& vaatii aina kopion
- span omistaa datan automaattisesti

#### `b08-cpp-span-bounds` · diff 3

Code review: funktio ottaa `std::span<int>` ja indeksoi ilman tarkistusta — tuotannossa buffer overflow. Mikä on moderni turvallinen tapa?

- **Tarkista size() ennen operator[]-indeksointia — span ei tarkista automaattisesti** ✓
- span estää aina yli rajojen menon kääntäjässä
- Muuta span takaisin raakaan pointeriin
- volatile indeksi korjaa optimoinnin

#### `b08-cpp-unique-ptr-deleter` · diff 4

FILE* pitää sulkea fclose:lla — unique_ptr<void> ei riitä. Miten mallinnet oikein?

- **unique_ptr<FILE, decltype(&fclose)> fp(f, &fclose)** ✓
- shared_ptr FILE:lle ilman deleteria
- new/delete FILE:lle
- unique_ptr ilman custom deleteria kutsuu delete

#### `b09-cpp-enable-shared-from-this` · diff 4

Async callback tarvitsee `shared_ptr`:n `this`:stä, mutta `shared_ptr(this)` kaataa ohjelman. Oikea pattern?

- **Peri std::enable_shared_from_this ja käytä shared_from_this()** ✓
- shared_ptr(this) on aina turvallinen
- weak_ptr(this) korvaa shared_ptr:n
- Käytä raw this callbackissa — nopeampi

#### `b09-cpp-optional-null-api` · diff 3

API palauttaa `nullptr` kun arvoa ei löydy — kutsujat unohtavat tarkistaa. Miten ilmaiset puuttuvan arvon tyypillisesti?

- **std::optional<T> — arvo tai tyhjä ilman magic sentinel -arvoja** ✓
- Palauta -1 aina virheen merkiksi
- Heitä poikkeus jokaisessa lookupissa
- Globaali last_error muuttuja

#### `b09-cpp-raw-pointer-refactor` · diff 3

Legacy-moduuli palauttaa `new`-allokoituja olioita kutsujalle. Refaktoroinnin turvallisin ensiaskele?

- **Korvaa unique_ptr omistuksella — selkeä elinkaari ilman manuaalista deleteä** ✓
- Lisää kommentti 'caller must delete'
- shared_ptr kaikille — aina turvallisin
- Jätä raw pointer — toimii tuotannossa

#### `b09-cpp-span-bounds-check` · diff 4

Tuotantobugi: buffer overflow C-tyylisessä `char*` API:ssa. Moderni korvaava tyyppi rajattuun näkymään?

- **std::span — kantaa pituuden mukana ilman omistusta** ✓
- std::string_view kaikille byte-buffereille aina
- volatile char* estää overflowin
- malloc + strlen riittää

#### `exp-cpp-prod-asan-build` · diff 3

Muistivuoto epäilty tuotannossa. Mitä CI-buildia pyydät ensin ennen tuotantokokeilua?

- **AddressSanitizer (ASan) debug/CI-buildissä** ✓
- Optimoi -O3 ja toivo
- Poista kaikki assertit nopeuden vuoksi
- Vain printf-debuggaus

#### `exp-cpp-prod-span-buffer` · diff 4

Tuotantobugi: funktio ottaa `(uint8_t* data, size_t len)` ja lukee yli puskurin. Miten rajapinta turvataan C++20-tyylillä?

- **std::span<const uint8_t> — koko kulkee mukana** ✓
- Lisää assert(len > 0) ja toivo parasta
- Muuta data int*:ksi — helpompi indeksoida
- Käytä malloc + manuaalista free:tä kutsujassa

#### `exp-cpp-prod-weak-ptr-cache` · diff 4

Jaettu image-cache käyttää `shared_ptr`. Objektit eivät vapaudu vaikka UI sulkeutuu. Mikä omistusmalli auttaa?

- **Cache tallentaa weak_ptr — tarkista lock() ennen käyttöä** ✓
- Vaihda kaikki raw new/delete
- shared_ptr::reset() globaalisti destructorissa
- Käytä volatile shared_ptr

#### `safety-avoid-c-array` · diff 2

Miksi cpp-best-practices suosittelee välttämään `T[N]`-taulukoita rajapinnoissa?

- **Ei tiedä kokoaan — helppo yli/aliraja** ✓
- Ne ovat aina hitaampia kuin vector
- Ne eivät voi olla stackilla
- Ne eivät tue constia

#### `safety-const-member` · diff 2

Miten `const` jäsenmuuttujat auttavat turvallisuudessa?

- **Estävät vahingossa muuttamisen olion tilaa** ✓
- Tekevät koodista aina nopeampaa
- Korvaavat mutexin
- Pakottavat heap-allokaation

#### `safety-exceptions` · diff 2

Miksi poikkeus voi olla parempi kuin virhekoodi joka voidaan ignoroida?

- **Virhettä ei voi hiljaa ohittaa** ✓
- Poikkeukset ovat aina hitaampia
- Virhekoodi pakottaa try-catchin
- Poikkeus ei voi kulkea pinossa

#### `safety-make-shared` · diff 3

Miksi `std::make_shared<T>(args)` on parempi kuin `shared_ptr<T>(new T(args))`?

- **Yksi allokaatio objektille ja laskurille — poikkeusturvallisempi** ✓
- make_shared on aina thread-safe new:iin verrattuna
- new on kielletty C++17:ssä
- Ei eroa

#### `safety-rule-of-zero` · diff 3

Mitä Rule of Zero tarkoittaa?

- **Älä määrittele special member -funktioita jos RAII hoitaa resurssit** ✓
- Nollaa kaikki osoittimet manuaalisesti
- Käytä aina malloc/free
- Poista kaikki konstruktorit

#### `safety-shared-ptr` · diff 3

Milloin `std::shared_ptr` on perusteltu `unique_ptr`:n sijaan?

- **Kun useampi omistaja jakaa saman resurssin elinkaaren** ✓
- Aina — se on yleisempi
- Kun haluat nopeimman omistajuuden
- Kun et tarvitse deleteä

#### `safety-static-cast` · diff 2

Miksi `(int)x` on huonompi kuin `static_cast<int>(x)`?

- **C++-cast on helpompi löytää ja turvallisempi** ✓
- C-cast on aina nopeampi
- static_cast toimii vain osoittimille
- Ei eroa

#### `safety-unique-ptr` · diff 2

Mikä korvaa turvallisesti `new`/`delete`-parin yksittäiselle omistajalle?

- **std::unique_ptr + make_unique** ✓
- malloc/free
- raw new ilman deleteä
- volatile pointer

#### `safety-variadic` · diff 3

Mikä on turvallinen vaihtoehto omalle C-tyyliselle variadiselle funktiolle?

- **Variadic template tai std::format** ✓
- printf suoraan käyttöön
- va_list kaikkialla
- Ei mitään — variadic on ok

#### `safety-vector` · diff 2

Mikä on moderni korvike dynaamiselle `int[]`-taulukolle?

- **std::vector<int>** ✓
- int* + manuaalinen new[]
- shared_ptr taulukolle
- C-style VLA

### style (24)

#### `b02-cpp-style-consteval-04` · diff 4

Konfiguraatiovakio pitää laskea compile-time — runtime-laskenta hidastaa käynnistystä. C++20-vaihtoehto constexpr:lle?

- **consteval — pakottaa evaluoinnin käännösaikana** ✓
- volatile const int
- constexpr riittää aina runtimeen
- Macro #define

#### `b02-cpp-style-override-03` · diff 2

Perusluokan `virtual void draw()` ylikirjoitetaan mutta kääntäjä ei varoita jos funktion nimi on `draw()` vs `Draw()`. Mitä avainsanaa pyydät?

- **override — kääntäjä tarkistaa että base-funktio on olemassa** ✓
- virtual riittää aina
- final korvaa override
- using namespace std korjaa

#### `b03-cpp-cr-override-keyword` · diff 2

Johdettu luokka ylikirjoittaa `virtual void draw()` mutta kirjoittaa `void draw()` ilman overridea. Riski?

- **Kääntäjä ei varoita jos signatuuri hieman eri — piilotettu bugi** ✓
- override hidastaa virtual-kutsua
- override on pakollinen C++11:ssä
- Ilman overridea kutsutaan aina base-versiota

#### `b03-cpp-style-explicit-ctor` · diff 2

Luokka `Meters(int v)` aiheuttaa vahingossa `double d = 3.5; Meters m = d;`. Miten estät?

- **explicit Meters(int v) — estää implisiittiset muunnokset** ✓
- operator int() palautuksessa
- Muuta int -> long
- Poista constructor — käytä factorya aina

#### `b04-cpp-explicit-constructor` · diff 3

Bugi: `void foo(Bytes b); foo(1024);` kääntyy — 1024 muuntuu Bytes:ksi implisiittisesti. Korjaus?

- **explicit Bytes(size_t) — estää implisiittiset muunnokset** ✓
- Poista konstruktori — käytä factory
- operator int() Bytes-luokassa
- Muuta parametri double:ksi

#### `b04-cpp-init-list-initializer` · diff 2

Code review: `int x = 3.9;` kääntyy hiljaa — reviewer ehdottaa `int x{3.9};`. Miksi?

- **Brace-init {} estää kapean muunnoksen (narrowing)** ✓
- Sulkeet korjaavat most vexing parse -ongelman tässä
- Sulkeet ovat vanhentuneet C++17:ssä
- Vain std::vector saa käyttää {}
- Kääntäjä vaatii aaltosulut

#### `b05-cpp-const-method-api` · diff 2

Getter-metodi ei muuta olion tilaa. Miten ilmaiset sen API:ssa?

- **Merkitse metodi const — kutsuja voi kutsua const-olioilla** ✓
- Lisää kommentti // read-only
- Palauta kopio aina — const ei tarvita
- Käytä friend-funktiota getterin sijaan

#### `b05-cpp-init-list-brace` · diff 2

Code review: `std::vector<int> v(10, 1)` vs `std::vector<int> v{10, 1}`. Mitä jälkimmäinen tekee?

- **Luo vektorin kahdella alkiolla: 10 ja 1** ✓
- Luo 10 alkiota arvolla 1
- Kääntäjävirhe — sulkeet eivät toimi vectorille
- Sama kuin (10, 1) aina

#### `b05-cpp-override-virtual-crash` · diff 3

Aliluokan virtuaalinen metodi ei koskaan kutsuta — kirjoitusvirhe parametrilistassa. Miten estät?

- **override-avainsana — kääntäjä varoittaa jos base ei matchaa** ✓
- virtual riittää aina — override on turha
- final korvaa override:n periytymisessä
- Käytä makroa DECLARE_VIRTUAL

#### `b06-cpp-attributes-fallthrough` · diff 2

Switch-case putoaa vahingossa seuraavaan caseen — bugi löytyy viiveellä. Miten dokumentoit tarkoituksellinen putoaminen?

- **[[fallthrough]] attribuutti — kääntäjä ja lukija ymmärtävät intentin** ✓
- Tyhjä case ilman break — aina bugi
- goto next_case
- Kommentti // intentional riittää kääntäjälle

#### `b06-cpp-default-member-init` · diff 2

Konstruktorit unohtavat alustaa member-kentät — satunnaiset arvot. Miten vähennät virheitä?

- **Default member initializer luokassa — kentät alustuvat automaattisesti** ✓
- Jätä kaikki nollaksi memset:llä
- Käytä globaaleja oletusarvoja
- Älä alusta — nollat ovat turvalliset aina

#### `b07-cpp-enum-class-scoped` · diff 2

Vanha enum Color { Red, Green } törmää toisen headerin Red-vakioiden kanssa. Moderni korjaus?

- **enum class Color { Red, Green } — scoped enum estää vuodon globaaliin nimiavaruuteen** ✓
- #define Red 0
- typedef int Color
- enum on deprecated C++17:ssä

#### `b07-cpp-nodiscard-error` · diff 2

Kutsuja ignooraa bool validate() paluuarvon — bugi tuotannossa. Miten pakota tarkistus?

- **[[nodiscard]] attribuutti funktiolle — kääntäjä varoittaa ignooratusta** ✓
- Muuta paluutyyppi voidiksi
- Kommentti // must check
- Heitä poikkeus aina

#### `b08-cpp-enum-class-scope` · diff 2

Vanha `enum Color { Red, Green }` törmää toisen headerin `Red`-vakion kanssa. Miten estät nimiristiriidat?

- **enum class Color { Red, Green } — scoped enum** ✓
- Lisää prefix RED_COLOR manuaalisesti
- Siirrä enum namespaceen ilman class-avainsanaa
- #define Red 1

#### `b09-cpp-delete-copy-semantics` · diff 3

Luokka hallitsee yksilöllistä resurssia — kopio ei saa olla mahdollinen. Miten ilmaiset API:ssa?

- **= delete copy constructor ja copy assignment** ✓
- Private copy — riittää aina
- Kommentti 'do not copy'
- Muuta kaikki jäsenet mutable

#### `b09-cpp-enum-class-type` · diff 2

Code review: `enum Color { RED, GREEN }` sekoittuu toisen `enum Status { RED }` kanssa. Korjaus?

- **enum class — vahvasti tyypitetty, ei implisiittistä int-muunnosta** ✓
- Prefixaa arvot COLOR_RED — riittää aina
- #define RED 0 korvaa enumin
- enum on deprecated C++17:ssä

#### `b09-cpp-rule-of-five-review` · diff 4

Luokassa on custom destructor mutta ei copy/move -operaatioita. Code review -huomio?

- **Rule of Five — määrittele tai = default/delete kaikki viisi special memberia** ✓
- Destructor riittää — muut generoituvat automaattisesti turvallisesti
- Lisää vain copy constructor
- Siirry C:hen — ei special membereita

#### `exp-cpp-cr-default-delete` · diff 3

Luokka hallitsee tiedostonkuvaajaa eikä saa kopioida. Code review ehdottaa `= delete` copy-operaatioille. Miksi?

- **Estää vahingossa kopioinnin kääntäjävirheellä — intentti selvä** ✓
- delete tekee luokasta nopeamman
- Vain private copy riittää aina
- delete korvaa move-operaation

#### `exp-cpp-cr-enum-class-switch` · diff 2

Code review: switch-case käyttää `enum Status { OK, FAIL }` ilman scopea. Miksi reviewer pyytää muutosta?

- **enum class estää implisiittiset int-muunnokset ja nimi­konfliktit** ✓
- Vanha enum on kielletty C++17:ssä
- enum class on aina 64-bittinen
- switch ei toimi enum classin kanssa

#### `style-const-ref` · diff 1

Miten vältät turhan `std::string`-kopioinnin funktioparametrissa?

- **const std::string&** ✓
- std::string kopiona aina
- char* ilman constia
- volatile std::string

#### `style-final-override` · diff 3

Luokka ei ole tarkoitettu perittäväksi mutta sisältää virtual-metodeja. Mitä käytät?

- **final luokalle tai virtual-metodille** ✓
- private konstruktori riittää aina
- static kaikille metodeille
- #pragma once

#### `style-override` · diff 2

Miksi käyttää `override` periytyvässä metodissa?

- **Kääntäjä varmistaa että ylikirjoitat olemassa olevan virtual-metodin** ✓
- Nopeuttaa virtual-kutsua
- Tekee metodista static
- Poistaa virtual-tuhoajan

#### `style-pass-int` · diff 2

Miten yksinkertainen `int` kannattaa välittää konstruktorille?

- **Arvona: explicit MyClass(int value)** ✓
- const int&-viittauksena
- int*-osoittimena
- std::shared_ptr<int>

#### `tools-enum-class` · diff 2

Miksi `enum class` on parempi kuin vanha C-tyylinen `enum`?

- **Rajattu scope — ei vuoda globaaliin namespaceen** ✓
- Se on aina nopeampi
- Se korvaa switch-lauseen
- Se pakottaa virtual-tuhoajan

### threadability (16)

#### `b02-cpp-thread-atomic-order-13` · diff 5

Laskuri kasvaa useasta säikeestä — `atomic<int>++` riittääkö ilman memory_order?

- **seq_cst on oletus — usein OK; relaxed vain jos semantiikka sallii** ✓
- atomic ei tarvitse koskaan orderia
- volatile int riittää
- mutex jokaiselle incrementille aina

#### `b02-cpp-thread-scoped-lock-12` · diff 4

Funktio lukitsee kaksi mutexia — riski deadlockille. C++17-ratkaisu?

- **std::scoped_lock(m1, m2) — lukitsee atomisesti oikeassa järjestyksessä** ✓
- lock(m1); lock(m2); aina samassa järjestyksessä manuaalisesti
- volatile mutex
- sleep ennen lockia

#### `b03-cpp-thread-atomic-flag` · diff 3

Yksinkertainen shutdown-flag jaettiin bool:lla ilman synkronointia — satunnainen jumi. Ratkaisu?

- **std::atomic<bool> tai atomic_flag — memory ordering mukana** ✓
- volatile bool riittää aina
- Globaali mutex jokaiselle lukemiselle
- sleep(1) ennen lukemista

#### `b03-cpp-thread-mutex-order` · diff 4

Deadlock kahdessa mutexissa: thread A lukitsee m1→m2, thread B m2→m1. Miten estät?

- **Lukitse aina samassa järjestyksessä tai käytä std::scoped_lock molempiin** ✓
- Vaihda mutexit spinlock:eihin
- Poista toinen mutex kokonaan
- Käytä volatile mutex-flageja

#### `b04-cpp-lock-guard-deadlock` · diff 4

Kaksi mutexia lukitaan eri järjestyksessä kahdessa säikeessä — satunnainen deadlock. Mikä standardiratkaisu auttaa?

- **std::lock(m1, m2) + std::lock_guard adopt_lock — lukitsee atomisesti** ✓
- sleep(100) ennen toista lukitusta
- Käytä try_lock silmukassa ikuisesti
- Yksi globaali mutex kaikelle

#### `b04-cpp-static-local-thread` · diff 3

Funktion sisällä `static Logger log;` — useat säikeet kirjoittavat lokille. C++11 jälkeen static local init?

- **Static local init on thread-safe (magic statics) — mutta Logger itse tarvitsee synkronoinnin** ✓
- Static local on aina data race
- Kielletty useassa säikeessä — käytä globalia
- volatile static riittää

#### `b05-cpp-atomic-counter` · diff 3

Usea säie päivittää jaettua laskuria. Mikä primitiivi on oikea ilman mutexia yksinkertaiseen incrementiin?

- **std::atomic<int> — lock-free increment mahdollinen** ✓
- volatile int — riittää aina säieturvallisuuteen
- static int + kommentti // thread-safe
- bool flag + busy-wait

#### `b06-cpp-packaged-task` · diff 4

Worker-thread ajaa funktion ja palauttaa tuloksen kutsijalle. Mitä käytät future-pohjaisesti?

- **std::packaged_task + std::future — tulos threadin ulkopuolelle** ✓
- Globaali muuttuja tulokseen — mutex riittää
- volatile int status-kenttä
- sleep polling loop

#### `b07-cpp-atomic-acquire-release` · diff 5

Lock-free jonossa tuottaja kirjoittaa datan ja asettaa flagin — kuluttaja näkee vanhaa dataa. Mikä memory order?

- **Tuottaja store release, kuluttaja load acquire — synkronoi näkyvyyden** ✓
- memory_order_relaxed riittää aina
- volatile int flag
- std::mutex on aina hitaampi — älä käytä

#### `b08-cpp-atomic-memory-order` · diff 5

Laskuri kasvaa useassa säikeessä — atomic<int> riittää, mutta luku ei näy heti toisessa CPU:ssa. Mikä voi auttaa?

- **memory_order_release/acquire parissa tai seq_cst oletuksena — ymmärrä visibility** ✓
- volatile int korvaa atomicin
- memory_order_relaxed estää kaikki race conditionit
- mutex ei koskaan tarvita atomicin kanssa

#### `b08-cpp-shared-mutex-read` · diff 4

Konfiguraatiocache: lukijoita paljon, kirjoittajia harvoin — std::mutex hidastaa turhaan. Parempi primitiivi?

- **std::shared_mutex — shared_lock lukijoille, unique_lock kirjoittajalle** ✓
- Yksi mutex kaikille
- atomic riittää monimutkaiselle mapille
- spinlock aina parempi

#### `b09-cpp-condition-variable-wait` · diff 4

Worker-säie odottaa queuea — spurious wakeup aiheuttaa tyhjän pop:in. Oikea wait-pattern?

- **wait(lock, predicate) — tarkista ehto uudelleen heräämisen jälkeen** ✓
- sleep(1) pollaa queuea
- wait ilman predikaattia riittää aina
- busy-wait on tehokkaampi tuotannossa

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

- **std::lock_guard tai std::unique_lock** ✓
- mutex.lock() ilman unlockia
- volatile mutex
- sleep(1) ennen lukitusta

### tools (30)

#### `b02-cpp-tools-concepts-02` · diff 4

Template-funktio `sortLike(T& a, T& b)` kaatuu outoihin virheisiin väärillä tyypeillä. C++20-ratkaisu rajapintaan?

- **concepts: `template<std::totally_ordered T> void sortLike(T& a, T& b)`** ✓
- static_assert(false) jokaisessa funktiossa
- Käytä void* ja castaa
- Kommentti // only numbers

#### `b02-cpp-tools-raii-01` · diff 2

Code reviewissa funktio luo `new Database()` ja palauttaa raakaa osoitinta. Mikä moderni omistusmalli estää vuodon poikkeuspolulla?

- **std::unique_ptr<Database> — RAII vapauttaa automaattisesti** ✓
- shared_ptr kaikille stack-olioille
- Raw new ilman deletea kutsujassa
- malloc + free C++-luokassa

#### `b03-cpp-incident-sanitize-ubsan` · diff 4

Tuotantoon pääsee signed overflow -bugi vain tietyllä ARM-buildilla. CI-parannus?

- **Ota UBSan/ASan debug-buildiin ja -fsanitize=undefined testeihin** ✓
- Vain x86-buildi tuotantoon
- Poista signed integerit kokonaan
- Luota pelkkään code reviewhun

#### `b03-cpp-tools-if-constexpr` · diff 3

Template-funktio tarvitsee eri haaran integraalisille vs float-tyypeille compile-time. Mitä käytät?

- **if constexpr — haara poistuu instanssoinnissa** ✓
- Runtime if + typeid
- Macro #ifdef aina
- dynamic_cast templatessa

#### `b04-cpp-concept-constraints` · diff 4

Generinen funktio `template<typename T> void sort(T& c)` kaatuu outoihin virheviesteihin kun T on custom-tyyppi. Miten rajaat template-parametrin luettavaksi?

- **C++20 concepts: template<std::ranges::sortable R> tai requires-lause** ✓
- static_assert(false) funktion alussa
- Kommentti // T must be sortable
- Käytä void* ja castaa jokaisessa kutsussa

#### `b04-cpp-consteval-compile-time` · diff 4

Lookup-taulukko pitää laskea käännösaikana — runtime-laskenta hidastaa bootia. C++20 tapa?

- **consteval funktio — pakottaa compile-time evaluoinnin** ✓
- constexpr riittää aina — sama asia
- Macro #define TABLE_SIZE 256
- static initializer ilman constevalia riittää aina

#### `b05-cpp-constexpr-config` · diff 3

Konfiguraatiovakiot lasketaan build-ajassa. Mikä avainsana varmistaa että laskenta tapahtuu käännösaikana?

- **constexpr — compile-time arvo kun mahdollista** ✓
- const — aina compile-time
- static — tekee arvon globaaliksi
- volatile — estää optimoinnin

#### `b05-cpp-lambda-capture-review` · diff 2

Code reviewissa lambda kaappaa ulkoisen muuttujan arvolla `[x]` mutta x muuttuu silmukan jälkeen. Mikä on turvallisin korjaus?

- **Kaappaa viittauksella [&] vain jos elinkaari on varma, muuten kopioi arvo** ✓
- Käytä aina [=] — se on aina oikein
- Muuta lambda globaaliksi funktioksi
- Poista capture ja käytä globaalia muuttujaa

#### `b06-cpp-deleted-function` · diff 3

Luokka ei saa kopioida — kopio-konstruktori kutsuu vahingossa. Miten estät käännösaikana?

- **Poista kopio-operaattorit = delete — kutsu aiheuttaa compile error** ✓
- Jätä kopio-operaattorit private ja toivo ettei kukaan käytä
- Käytä #pragma once
- Merkitse luokka final

#### `b06-cpp-enum-class-scope` · diff 2

Code reviewissa `enum Color { Red, Green };` aiheuttaa nimikonfliktit headerissa. Miten korjaat modernisti?

- **enum class Color { Red, Green }; — scoped enum estää implisiittiset konversiot** ✓
- Lisää makro #define Red 0
- Siirrä enum namespacein ulkopuolelle
- Käytä int-tyyppiä ja kommentteja

#### `b06-cpp-nodiscard-return` · diff 3

Tuotantobugi: `allocateBuffer()` palautusarvo jätetään huomiotta ja resurssi vuotaa. Miten varoitat kutsijaa?

- **[[nodiscard]] attribuutti funktion paluuarvossa** ✓
- Palauta void ja käytä globaalia muuttujaa
- Lisää kommentti // remember to check
- Käytä assert() funktion sisällä

#### `b07-cpp-chrono-literals` · diff 3

Timeout on koodissa sleep(500) — yksikkö epäselvä. Miten std::chrono ilmaisee 500 millisekuntia?

- **500ms chrono-literalilla — using namespace std::chrono_literals** ✓
- 500 std::chrono::seconds
- 500 * 1000 nanoseconds käsin
- chrono ei tue millisekunteja

#### `b07-cpp-perfect-forwarding` · diff 4

Tehdasfunktio make<T>(Args&&... args) välittää argumentit konstruktorille. Mikä idiomi säilyttää value categoryn?

- **std::forward<Args>(args)... — perfect forwarding** ✓
- std::move kaikille argumenteille
- Kopioi args vektoriin ensin
- Käytä Args& ilman &&

#### `b07-cpp-spaceship-operator` · diff 3

Luokalle tarvitaan ==, !=, <, <=, >, >= — paljon boilerplatea. C++20 lyhennys?

- **auto operator<=>(const T&) const = default — three-way comparison** ✓
- Kirjoita kaikki käsin aina
- memcmp structille riittää
- operator< riittää — muut johdetaan automaattisesti C++03:ssa

#### `b07-cpp-unique-ptr-deleter` · diff 2

RAII-wrapper hallitsee C-API:n FILE*-pointteria. Miksi std::unique_ptr custom deleter on parempi kuin raw delete?

- **unique_ptr kutsuu fclose deleterissä — poikkeuksessa ei vuoda handlea** ✓
- Raw delete toimii FILE*:lla
- shared_ptr on aina pakollinen
- unique_ptr ei tue custom deleteriä

#### `b08-cpp-chrono-literals` · diff 2

Timeout-koodi: `sleep(500)` — yksikkö epäselvä. Miten ilmaiset 500 millisekuntia C++14:ssä?

- **using namespace std::chrono_literals; auto t = 500ms;** ✓
- 500 chrono ilman suffixia
- sleep(500) on aina ms
- #define ms * 1

#### `b08-cpp-initializer-list-trap` · diff 4

Funktio `void f(std::array<int, 3>)` — kutsu `f({1,2,3})` käännyy, mutta `auto x = {1,2,3}; f(x);` ei. Miksi?

- **`auto x = {1,2,3}` on `std::initializer_list<int>` — sitä ei voi implisiittisesti välittää `std::array`-parametrille** ✓
- auto ei tue listoja C++11:ssä
- auto deduoi aina `std::vector<int>`:ksi
- Bugi kääntäjässä — pitäisi toimia

#### `b08-cpp-optional-monadic` · diff 3

Ketju: optional palauttaa arvon, seuraava funktio ottaa arvon — if-linnoja tulee liikaa. C++23-tyylinen tapa?

- **optional::and_then / transform — monadinen ketjutus** ✓
- operator* aina ilman tarkistusta
- optional ei tue ketjutusta
- Muunna nullptr optionaliksi

#### `b08-cpp-sort-requirements` · diff 3

std::sort kaatuu outoon virheeseen custom-iteratorilla. Mitä iteratorin pitää tarjota sortille?

- **RandomAccessIterator — sort vaatii O(1) etäisyyden** ✓
- Mikä tahansa forward iterator riittää
- sort toimii vain vectorilla
- Input iterator riittää

#### `b08-cpp-variant-visit` · diff 4

std::variant<int, string> — switch-tyylinen käsittely ilman visitor-luokkaa. Moderni tapa?

- **std::visit(visitor, variant) — overload setti lambdailla** ✓
- variant.get<int>() aina
- dynamic_cast variantille
- union korvaa variantin

#### `b09-cpp-clang-tidy-review` · diff 2

Code reviewissa toistuu sama raw-pointer-anti-pattern. Miten automatisoidaan palaute ennen ihmisreviewia?

- **clang-tidy checkit CI:hin — modernize- ja bugprone-säännöt** ✓
- Lisää README:hen 'älä käytä raw pointereita'
- Vain senior reviewaa kaikki PR:t
- Poista varoitukset -w-flagilla

#### `b09-cpp-sanitizer-ci-failure` · diff 3

CI-putki kaatuu yöllä AddressSanitizer-virheeseen, mutta paikallinen release-build menee läpi. Mitä ehdotat ensimmäiseksi?

- **Aja sama build ASan/UBSan-flageilla paikallisesti — reprodukoi ennen mergeä** ✓
- Poista sanitizer CI:stä — hidastaa liikaa
- Muuta release-build optimoimaan virhe pois
- Ignoroi — ASan on vain kehitystyökalu

#### `exp-cpp-cr-optional-review` · diff 3

Code reviewissa kollega palauttaa `T*` joka voi olla null. Mikä moderni tyyppi tekee tyhjän arvon eksplisiittiseksi ilman raw-osoitinta?

- **std::optional<T> tai std::optional<std::reference_wrapper<const T>>** ✓
- volatile T*
- std::shared_ptr<T> aina, myös stack-olioille
- int flag + T* erikseen ilman dokumentaatiota

#### `exp-cpp-prod-chrono-timeout` · diff 3

API-kutsu tarvitsee 500 ms timeoutin. Miten ilmaiset ajan modernisti ilman magic-numeroita?

- **std::chrono::milliseconds(500) tai 500ms-literal (C++14)** ✓
- sleep(500) — oletus sekunteina
- 500 * CLOCKS_PER_SEC
- double seconds = 0.5 ilman yksikköä

#### `exp-cpp-tools-format-logging` · diff 2

Tiimi korvaa sprintf-loggauksen. Mikä moderni standardikirjasto auttaa turvalliseen merkkijonoon?

- **std::format (C++20) tai std::ostringstream** ✓
- strcpy logipuskuriin
- printf ilman format-specifieriä
- itoa + strcat

#### `tools-auto` · diff 1

Mitä `auto` tekee modernissa C++:ssa?

- **Kääntäjä päättelee tyypin initializerista** ✓
- Muuttuja on automaattisesti globaali
- Tyyppi pakotetaan aina int:ksi
- Se korvaa kaikki typedefit

#### `tools-constexpr` · diff 3

Mitä `constexpr` funktio mahdollistaa C++11:ssä?

- **Laskennan käännösaikana kun argumentit ovat vakioita** ✓
- Funktio on aina inline assembly
- Funktio ei voi koskaan heittää
- Korvaa `#define` makrot aina

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

- **Luettavampi template-alias ja sama syntaksi kuin typedef** ✓
- using on aina nopeampi kääntää
- typedef ei toimi C++11:ssä
- using tekee tyypistä constexpr

## docker (142)

### docker (79)

#### `b02-docker-build-copy-03` · diff 4

Docker build on hidas — jokainen pieni koodimuutos invalidoi koko dependency layerin. Fix?

- **COPY package.json ennen loput — hyödynnä layer cache** ✓
- COPY . ensimmäisenä aina
- Poista cache --no-cache
- Yksi RUN kaikelle

#### `b02-docker-exec-debug-04` · diff 2

Containerissa shell puuttuu mutta prosessi elää — miten debuggaat sisältä?

- **docker exec -it container_id /bin/sh (tai distroless: debug image sidecar)** ✓
- docker attach riittää aina
- ssh localhost
- docker rm -f

#### `b02-docker-prune-05` · diff 2

Levy täynnä vanhoja imageja ja stopped containereita. Turvallinen siivous?

- **docker system prune (tai prune -a varovasti)** ✓
- rm -rf /var/lib/docker
- Poista vain running
- format C:

#### `b02-docker-run-limit-02` · diff 3

Yksi container syö koko hostin RAM:in — OOM killaa muita. Rajoitus?

- **docker run --memory 512m --cpus 1.0** ✓
- Ei rajoja — Docker hoitaa
- Vain cgroups v1 manuaalisesti
- restart=always

#### `b02-docker-run-user-01` · diff 3

Containeri ajaa rootina tuotannossa — audit finding. Ensimmäinen hardening?

- **docker run --user nonroot:nonroot (tai USER Dockerfilessa)** ✓
- --privileged turvallisempaa
- Ajetaan hostilla suoraan
- chmod 777 /

#### `b03-docker-buildkit-cache-mount` · diff 4

npm ci kestää 5 min jokaisessa buildissa vaikka package-lock ei muutu. BuildKit-parannus?

- **RUN --mount=type=cache,target=/root/.npm npm ci — cache mount** ✓
- COPY node_modules hostista
- Poista package-lock
- docker build --no-cache nopeuttaa

#### `b03-docker-copy-vs-add` · diff 2

Code review ehdottaa ADD tarball-url:ia Dockerfileen. Miksi suosittelet COPY:tä?

- **COPY on eksplisiittinen — ADD tekee automaattista purkua/URL:ia** ✓
- ADD on aina nopeampi
- COPY ei toimi binääritiedostoille
- ADD on pakollinen multi-stage buildissa

#### `b03-docker-dockerignore-build` · diff 2

Docker build lähettää 2 GB node_modules build contextiin. Ensimmäinen optimointi?

- **.dockerignore — sulje node_modules, .git, build-artifaktit** ✓
- docker build --no-cache aina
- Kopioi koko repo COPY . .
- Build context ei vaikuta nopeuteen

#### `b03-docker-entrypoint-cmd` · diff 3

Tiimi sekoittaa ENTRYPOINT ja CMD — `docker run image bash` ei korvaa oletuskomentoa. Miksi?

- **ENTRYPOINT on pääkomento, CMD on oletusargumentit — exec-form selkeyttää** ✓
- CMD korvaa aina ENTRYPOINTin
- Vain yksi niistä sallittu
- shell-form on identtinen exec-formin kanssa

#### `b03-docker-prune-disk` · diff 2

CI-runnerin levy täyttyy 'no space left' — satoja dangling imageja. Turvallinen siivous?

- **docker system prune -f (tai image prune) — poista käyttämättömät** ✓
- rm -rf /var/lib/docker ilman varmuuskopiota
- docker rmi $(docker images -q) tuotantokoneella
- Prune poistaa käynnissä olevat kontit

#### `b03-docker-secrets-compose` · diff 4

DB-salasana on compose-tiedoston environment-osiossa gitissä. Parempi tapa?

- **Docker secrets / ulkoinen secret store — ei plaintext repossa** ✓
- Base64 encode environmentissa
- Salasana Dockerfile ARG:ssa
- Commit .env tuotantoon

#### `b03-docker-stats-limits` · diff 3

Yksi kontti syö koko hostin RAM:in — muut palvelut kaatuvat. docker stats näyttää 100%. Mitä asetat?

- **docker run --memory / --cpus tai compose deploy.resources limits** ✓
- Restart=always riittää
- docker stats asettaa limitit automaattisesti
- Privileged mode jakaa RAM:in tasaisesti

#### `b03-docker-user-nonroot` · diff 3

Security review: Dockerfile ei määritä USER:ia — kontti ajaa rootina. Korjaus?

- **Lisää non-root USER ja varmista tiedosto-oikeudet COPY:ssa** ✓
- Privileged mode turvallisempi
- Root on OK kontissa koska eristetty
- Poista ENTRYPOINT

#### `b04-docker-build-arg` · diff 3

Sama Dockerfile eri versioille — BASE_IMAGE vaihtelee CI:ssä. Miten parametrisoit?

- **ARG BASE_IMAGE + docker build --build-arg BASE_IMAGE=...** ✓
- sed Dockerfile ennen buildia aina
- ENV BASE_IMAGE — sama kuin ARG
- Kopioi Dockerfile kolmeen versioon

#### `b04-docker-buildkit-cache` · diff 3

CI-build kopioi koko kontekstin joka kerta — cache ei hyödy package.json muutoksista. Optimointi?

- **COPY package.json ensin, RUN npm ci, sitten loput — layer cache hyötyy** ✓
- COPY . ensin — yksinkertaisin
- Poista cache — aina clean build
- Yksi RUN kaikelle

#### `b04-docker-cgroup-limits` · diff 4

Kontti syö koko hostin RAM:in — OOM killaa naapurikontteja. docker run rajoitus?

- **--memory ja --cpus (tai deploy.resources compose:ssa)** ✓
- Vain --restart unless-stopped
- Docker rajoittaa automaattisesti 512MB
- nice -n 19 riittää

#### `b04-docker-compose-depends-on` · diff 3

Compose-sovellus kaatuu koska API käynnistyy ennen Postgresia. Mitä compose-tiedostoon?

- **depends_on + healthcheck db:lle (Compose v2 condition: service_healthy)** ✓
- restart: always riittää järjestykseen
- links: — ainoa tapa
- Poista db — käytä sqlite

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

#### `b05-docker-compose-depends-on` · diff 3

App-kontti käynnistyy ennen Postgresia ja kaatuu connection refused -virheeseen. Compose-korjaus?

- **depends_on + healthcheck db:lle — odota valmiutta** ✓
- restart: always korjaa käynnistysjärjestyksen
- links: deprecated riittää
- Poista depends_on — järjestys on satunnainen OK

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

#### `b05-docker-prune-disk-full` · diff 2

Build-palvelimen levy täynnä — vanhoja imageja ja stopped-kontteja pinossa. Turvallisin siivous?

- **docker system prune — poistaa käyttämättömät resurssit (tarkista ensin)** ✓
- rm -rf /var/lib/docker ilman varmuuskopiota
- Poista vain running-kontit
- Levy täyttyy — Docker ei tue siivousta

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

#### `b05-dockerfile-layer-cache` · diff 3

Docker build on hidas — jokainen koodirivin muutos invalidoi koko npm install -kerroksen. Korjaus?

- **Kopioi package.json ensin, asenna riippuvuudet, vasta sitten COPY lähdekoodi** ✓
- Lisää --no-cache jokaiseen buildiin
- Yhdistä kaikki RUN-komennot yhteen COPY:hen
- Poista .dockerignore

#### `b05-dockerfile-multistage-size` · diff 3

Tuotantoimage on 2 GB koska build-työkalut mukana runtime-kuvassa. Ratkaisu?

- **Multi-stage build — käännä builder-stagessa, kopioi vain binary final-stageen** ✓
- Poista kaikki LABEL-kentät
- Käytä latest-tagia base imagessa
- Yksi RUN apt-get && build && cleanup riittää aina

#### `b06-docker-build-context-size` · diff 3

docker build lähettää gigatavun node_modules kontekstissa. Miten estät?

- **.dockerignore — sulkee tiedostot build contextista** ✓
- COPY . . on aina optimaalinen
- docker build --no-cache poistaa konteksti
- Vain multi-stage ratkaisee konteksti

#### `b06-docker-build-target` · diff 3

Multi-stage Dockerfile — haluat buildaa vain test-stage CI:ssä. Miten?

- **docker build --target test-stage -f Dockerfile .** ✓
- docker build aina kaikki stageet
- --target vain compose:ssa
- FROM test AS final pakottaa target

#### `b06-docker-compose-env-file` · diff 2

Salaisuudet compose-pinoon — ei hardcode yamlissa. Miten injektoit?

- **env_file: tai secrets — erillinen tiedosto / secret store** ✓
- environment: DB_PASS=secret yamlissa
- COPY .env imageen buildissa
- docker run -e aina compose:ssa

#### `b06-docker-compose-healthcheck` · diff 3

Compose-pino käynnistää riippuvat palvelut ennen kuin API on valmis. Mitä lisätä serviceen?

- **healthcheck — compose odottaa healthy-tilan depends_on:ssa** ✓
- restart: always riittää
- links: legacy korvaa healthcheck
- sleep 30 entrypoint:ssä on standardi

#### `b06-docker-compose-restart` · diff 2

Tuotantokontti pitää käynnistää automaattisesti host-rebootin jälkeen. Compose-kenttä?

- **restart: unless-stopped tai always** ✓
- restart: no tuotannossa
- depends_on: reboot
- init: true korvaa restart

#### `b06-docker-logging-rotation` · diff 3

Konttilokit täyttävät levyn — json-file driver kasvaa rajatta. Miten rajoitat?

- **log driver opts max-size ja max-file — rotation** ✓
- docker logs --tail poistaa vanhat
- journald ei tarvitse rotation
- restart container tyhjentää lokit

#### `b06-docker-run-init` · diff 3

Kontissa zombie-prosessit kasaantuvat — parent ei siivoa child-prosesseja. Mitä run-optiota?

- **--init — käyttää tini init-prosessia zombie-siivoukseen** ✓
- --privileged korjaa zombiet
- --restart always
- PID 1 on aina dockerd

#### `b06-docker-run-memory-swap` · diff 4

Kontti OOM-killaa mutta swap näyttää vapaana. Miten rajoitat memory+swap yhdessä?

- **--memory ja --memory-swap — swap limit yhdessä RAM-rajan kanssa** ✓
- --cpus riittää memory-ongelmaan
- Swap on automaattisesti pois kontissa
- docker update vain CPU:ta

#### `b07-docker-buildkit-cache` · diff 3

CI-buildit ovat hitaita vaikka Dockerfile on optimoitu. BuildKit-ominaisuus joka auttaa?

- **Cache mount RUN --mount=type=cache — npm/go mod cache säilyy buildien välillä** ✓
- --no-cache nopeuttaa
- Poista multi-stage
- BuildKit ei tue cachea

#### `b07-docker-compose-depends` · diff 3

App käynnistyy ennen Postgresia — connection refused. compose.yml korjaus?

- **depends_on + healthcheck condition — odota DB valmiiksi** ✓
- restart: always riittää
- links: deprecated riittää
- Poista depends_on

#### `b07-docker-copy-chown` · diff 4

Non-root user ei voi kirjoittaa /app/logs — permission denied tuotannossa. Dockerfile-korjaus?

- **COPY --chown=user:group tai RUN chown ennen USER-vaihtoa** ✓
- RUN chmod 777 /app
- Aja rootina
- Poista logs-kansio

#### `b07-docker-exec-debug` · diff 2

Kontti pyörii mutta HTTP ei vastaa — haluat shellin sisälle debugata. Komento?

- **docker exec -it container_name /bin/sh — interaktiivinen shell** ✓
- docker run uudelleen ilman portteja
- docker kill heti
- docker logs riittää aina

#### `b07-docker-healthcheck` · diff 3

Orchestrator merkitsee palvelun healthy vaikka app kaatui. Mitä Dockerfileen?

- **HEALTHCHECK — testaa sovelluksen oikeaa endpointia** ✓
- EXPOSE riittää healthille
- CMD echo ok
- Healthcheck on deprecated

#### `b07-docker-image-digest` · diff 4

Tuotantoon deployattiin eri image kuin testissä — tag liikkui. Miten lukitset version?

- **Deploy image digest @sha256:... — tag ei takaa samaa sisältöä** ✓
- latest tag on turvallisin
- docker pull riittää
- Digest on vain metadata

#### `b07-docker-multistage-build` · diff 3

Tuotanto-image sisältää koko Go toolchainin — image 1.2 GB. Miten pienennät?

- **Multi-stage build — build stage + minimal runtime stage (scratch/distroless)** ✓
- Poista .dockerignore
- Yksi stage riittää aina
- RUN apt install build-essential runtimeen

#### `b07-docker-run-user` · diff 3

Security audit: kontti ajaa rootina. Miten korjaat Dockerfilessa?

- **USER nonroot — luo käyttäjä ja vaihda ennen CMD** ✓
- Root on pakollinen Dockerissa
- chmod 777 korjaa turvallisuuden
- Poista USER rivi

#### `b08-docker-buildkit-cache` · diff 3

CI-buildit ovat hitaita — BuildKit on päällä mutta cache ei jaeta jobien välillä. Ratkaisu?

- **Registry cache backend — cache-to/cache-from buildx:llä** ✓
- Poista BuildKit — vanha builder on nopeampi
- docker build --no-cache nopeuttaa
- Cache toimii vain paikallisesti samassa kontissa

#### `b08-docker-compose-override` · diff 2

Paikallinen dev ylikirjoittaa portit ilman muutosta git-trackattuun compose.yaml:iin. Tiedosto?

- **docker-compose.override.yaml — automaattisesti yhdistetty** ✓
- compose.prod.yaml ilman -f flagia latautuu aina
- Override vaatii merge-komennon
- Ei voi ylikirjoittaa ilman kopioimista

#### `b08-docker-compose-profiles` · diff 2

Compose-tiedostossa debug-työkalut halutaan vain kehityksessä — ei tuotantodeployssa. Ominaisuus?

- **profiles: [debug] — käynnistä docker compose --profile debug** ✓
- commentoi palvelut pois käsin
- depends_on piilottaa palvelut
- profiles toimii vain swarmissa

#### `b08-docker-compose-watch` · diff 3

Dev: lähdekoodimuutos pitäisi synkata konttiin ilman rebuildia joka kerta. Compose Watch?

- **develop.watch sync — compose watch synkkaa tiedostot ja voi restartata** ✓
- volume mount korvaa watch:n aina
- watch toimii vain swarmissa
- docker compose up rebuildaa automaattisesti joka save

#### `b08-docker-exec-user` · diff 3

Debuggaat konttia — docker exec -it ajaa rootina vaikka Dockerfile USER app. Miksi?

- **exec oletus root ellei --user — USER vaikuttaa vain CMD/ENTRYPOINT** ✓
- USER estää exec:in kokonaan
- exec ignore Dockerfile aina
- Vain docker run kunnioittaa USER:ia

#### `b08-docker-prune-build-cache` · diff 2

Build-serverin levy täynnä vanhoja kerroksia. Turvallinen siivous?

- **docker builder prune — poistaa käyttämättömän build cachen** ✓
- docker rmi -f $(docker images -q) poistaa vain cache
- rm -rf /var/lib/docker aina turvallinen
- Prune poistaa käynnissä olevat kontit

#### `b08-docker-scan-image` · diff 3

CI putki — haluat skannata imagen CVE:t ennen deploya. Työkalu ekosysteemissä?

- **docker scout cve tai integraatio (Trivy, Snyk) — image vulnerability scan** ✓
- docker ps näyttää CVE:t
- Skannaus rikkoo aina buildin turhaan
- Vain base image tarvitsee skannauksen

#### `b08-docker-secrets-env` · diff 3

Code review: API-avain Dockerfile ENV:ssä. Turvallisempi Compose/Swarm tapa?

- **secrets — mountataan tiedostona /run/secrets/, ei ENV-imageen** ✓
- ARG korvaa ENV tuotannossa
- Base64 salaa salaisuuden riittävästi
- .env tiedosto gitissä on OK private repossa

#### `b08-dockerfile-arg-env` · diff 3

Build-time versio build-argilla — runtime config erikseen. Ero ARG vs ENV?

- **ARG vain buildissä — ENV jää imageen runtimeen** ✓
- ARG ja ENV identtiset
- ENV ei näy kontissa
- ARG säilyy aina final imagessa

#### `b08-dockerfile-copy-chown` · diff 3

Non-root USER ei voi kirjoittaa COPY:llä tuotua hakemistoa. Dockerfile-korjaus?

- **COPY --chown=app:app tai RUN chown ennen USER-vaihtoa** ✓
- USER root runtimeen aina
- COPY ei tue chown:ia
- chmod 777 on tuotantokäytäntö

#### `b09-docker-buildkit-cache-mount` · diff 4

Go-moduulien lataus hidastaa CI-buildia vaikka go.mod ei muutu. BuildKit-optimointi?

- **RUN --mount=type=cache,target=/go/pkg/mod go mod download** ✓
- COPY go.sum ensin riittää aina
- BuildKit ei tue cache mounteja
- Vendoring poistaa tarpeen cachelle

#### `b09-docker-cmd-entrypoint` · diff 3

Haluat wrapper-skriptin joka ajaa migraatiot ennen appia — mutta CMD pitää ylikirjoittaa helposti. Ero?

- **ENTRYPOINT wrapper + CMD app-args — CMD on oletusparametrit** ✓
- CMD ja ENTRYPOINT ovat identtiset
- Vain RUN voi ajaa skriptejä
- ENTRYPOINT ei voi olla shell-form

#### `b09-docker-dockerignore-build` · diff 2

Docker build lähettää 500 MB node_modules kontekstina vaikka ne asennetaan kontissa. Korjaus?

- **.dockerignore — sulje pois node_modules, .git, build-artifaktit** ✓
- Poista COPY-komento kokonaan
- docker build --squash korjaa kontekstin
- node_modules täytyy aina olla build-kontekstissa

#### `b09-docker-env-secrets-smell` · diff 4

Code review: DATABASE_PASSWORD Dockerfile ENV:ssä. Miksi tämä on ongelma?

- **ENV jää image-layeriin — salaisuus näkyy docker historyssa** ✓
- ENV on turvallisin tapa salaisuuksille
- Salasana on OK jos repo on private
- Vain EXPOSE on turvallisuusongelma

#### `b09-docker-exec-debug` · diff 2

Kontti pyörii mutta shelliä ei ole imageessa — tarvitset interaktiivisen debug-session. Komento?

- **docker exec -it container_name sh (tai bash jos saatavilla)** ✓
- docker attach korvaa exec:in aina
- docker run --rm ilman imagea
- exec vaatii konttien pysäyttämisen

#### `b09-docker-image-tag-pin` · diff 3

Tuotanto käyttää `FROM node:latest` — eilen build rikkoutui. Korjaus?

- **Pin digest tai semver-tag (node:20.11-alpine) — toistettava build** ✓
- latest on aina tuorein ja turvallisin
- Poista FROM — käytä scratch
- Tag ei vaikuta build-tulokseen

#### `b09-docker-resource-limits` · diff 3

Yksi kontti syö koko hostin CPU:n — muut palvelut jäätyvät. Compose-rajoitus?

- **deploy.resources.limits cpus/memory (tai docker run --cpus --memory)** ✓
- restart: always rajoittaa resursseja
- nice -20 kontissa riittää
- Docker ei tue resurssirajoja

#### `b09-docker-secrets-mount` · diff 4

Tuotanto-Compose tarvitsee TLS-sertin ilman salaisuuden leimimistä imageen. Ratkaisu?

- **Docker secrets tai bind mount read-only runtime-tiedostosta/vaultista** ✓
- COPY cert.pem Dockerfileen
- ENV CERT=$(cat cert.pem)
- Salaisuudet git-repossa private branchissa

#### `docker-compose-network` · diff 4

Compose-projektissa palvelut eivät näe toisiaan. Yleisin konfiguraatiovirhe?

- **Eri custom network tai väärä network-attribuutti** ✓
- Puuttuva FROM rivi Dockerfilessa
- Väärä timezone
- Liian pieni SHM — aina DNS-syy

#### `docker-exit-code` · diff 4

Kontti poistuu heti käynnistyksen jälkeen. Ensimmäinen diagnosoitava asia?

- **PID 1 prosessi päättyykö — foreground vs daemon** ✓
- Väärä Docker Hub -tag aina
- Vain restart: always korjaa syyn
- overlay network puuttuu

#### `docker-healthcheck` · diff 4

Orkestraattori käynnistää uuden kontin ennen vanhan poistoa. Mikä Dockerfile-ominaisuus auttaa?

- **HEALTHCHECK — kontti merkitään healthy vasta kun probe onnistuu** ✓
- EXPOSE riittää aina terveyden varmistukseen
- CMD sleep infinity
- Vain restart: always

#### `docker-layer-cache` · diff 3

Docker build on hidas. Mikä Dockerfile-järjestys hyödyntää layer cachea parhaiten?

- **Harvoin muuttuvat rivit (riippuvuudet) ennen usein muuttuvia (lähdekoodi)** ✓
- COPY . . ensimmäisenä aina
- Yksi RUN joka asentaa kaiken — vähemmän layereita = nopeampi
- Cache ei vaikuta build-aikaan

#### `docker-multistage` · diff 4

Tuotantoimage on 2 GB koska mukana kääntäjä ja dev-työkalut. Ratkaisu?

- **Multi-stage build — vain binary viimeiseen stageen** ✓
- docker commit manuaalisesti
- Suurempi levy palvelimella
- Poista vain ENTRYPOINT

#### `docker-readonly-rootfs` · diff 5

Haluat rajoittaa kontin kirjoituksia levylle turvallisuussyistä. Mikä käynnistysasetus?

- **docker run --read-only (+ tmpfs tarvittaessa)** ✓
- --privileged aina turvallisempi
- USER root nopeuttaa
- bridge network estää kirjoitukset

#### `docker-volume-persist` · diff 3

Kontin tietokanta katoaa `docker rm` jälkeen. Miten data säilyy oikein?

- **Named volume tai bind mount** ✓
- Kirjoita vain konttien writable layeriin
- Käytä --rm ilman volumea
- Tallenna vain imageen commitilla

#### `exp-docker-build-cache` · diff 4

CI-buildit ovat hitaita — jokainen layer invalidoituu kun package.json muuttuu. Mitä Dockerfile-järjestystä muutat?

- **Kopioi riippuvuusmanifestit ensin, npm install, sitten lähdekoodi** ✓
- COPY . . heti alussa
- Poista kaikki cache --no-cache
- Yhdistä kaikki RUN yhdeksi riviksi aina

#### `exp-docker-build-multistage` · diff 3

Go-binary image on 1.2 GB koska build-työkalut mukana. Miten pienennät?

- **Multi-stage build: builder-stage + distroless/runtime stage** ✓
- Poista .dockerignore
- Käytä latest-tagia aina
- Yksi stage riittää aina

#### `exp-docker-prod-healthcheck` · diff 3

Load balancer lähettää liikenteen kontille joka on jumissa. Miten Docker tunnistaa unhealthy-tilan?

- **HEALTHCHECK Dockerfilessa tai --health-cmd** ✓
- Vain exit code 0 riittää aina
- docker ps näyttää CPU:n — riittää
- Healthcheck on vain Swarmissa

#### `exp-docker-prod-readonly-rootfs` · diff 4

Security review vaatii immutable root filesystemin. Mikä run-optio?

- **--read-only + tmpfs mountit kirjoitettaville poluille** ✓
- --privileged turvallisin
- Read-only estää kaiken — ei voi ajaa
- Vain Alpine base image riittää

#### `exp-docker-prod-restart-policy` · diff 2

Tuotantokontti kaatuu yöllä eikä nouse uudelleen host-rebootin jälkeen. Mitä lisäät run-komentoon?

- **--restart unless-stopped (tai always)** ✓
- Vain --detach riittää
- restart ei toimi Dockerissa
- cron docker start riittää aina

### docker-network (34)

#### `b02-docker-net-alias-10` · diff 3

Yhdellä servicellä pitää olla useita DNS-nimiä samassa verkossa. Miten?

- **network_aliases Compose:ssa tai --network-alias docker run** ✓
- /etc/hosts manuaalisesti containerissa
- Useita container instansseja
- ExtraHosts only ulkoisille

#### `b02-docker-net-bridge-06` · diff 2

Kaksi default-bridge containeria eivät resolvdu nimellä — miksi?

- **Default bridge ei tarjoa automaattista DNS-nimeä — käytä user-defined network** ✓
- Bridge ei toimi koskaan
- Tarvitaan --net=host aina
- iptables pois

#### `b02-docker-net-compose-07` · diff 3

Compose: web ei tavoita db:ä hostname `db` — molemmat samassa projektissa. Tyypillinen syy?

- **Eri compose network tai service name ≠ hostname — määritä networks ja depends_on** ✓
- Docker bug
- Tarvitaan IP aina
- Poista service names

#### `b02-docker-net-host-08` · diff 4

Low-latency palvelu tarvitsee suoran host-portin ilman NAT:ia. Verkko-optio?

- **--network host (Linux) — container jakaa host network stackin** ✓
- bridge aina nopein
- none network
- overlay local only

#### `b02-docker-net-inspect-09` · diff 3

Container ei saa IP:tä custom networkista — diagnostiikka?

- **docker network inspect netname — tarkista Containers ja IPAM** ✓
- docker ps riittää
- reboot host
- Poista kaikki verkot

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

#### `b04-docker-network-alias` · diff 3

Kontti A ei löydä kontti B:tä nimellä `api` samassa user-defined networkissä. Compose-ratkaisu?

- **Palvelun nimi compose:ssa on DNS-nimi — network: shared + service name api** ✓
- linkit konttien välillä pakollisia
- Käytä aina host network
- Extra_hosts 127.0.0.1

#### `b05-docker-net-bridge-default` · diff 2

Kaksi konttia samassa default bridge-verkossa — voivatko ne kommunikoida nimellä?

- **Ei automaattisesti — default bridge ei tarjoa DNS-nimiä; käytä user-defined network** ✓
- Kyllä — container_name riittää aina
- Vain host network tukee kommunikaatiota
- Bridge ja host ovat sama verkko

#### `b05-docker-net-dns-custom` · diff 3

Kontti ei resolvdu sisäistä DNS-nimeä corporate DNS:llä. Compose-korjaus?

- **dns: -asetus palvelulle tai network-level DNS** ✓
- extra_hosts korvaa aina DNS:n
- DNS toimii vain host network -modessa
- Muokkaa /etc/resolv.conf kontissa pysyvästi

#### `b05-docker-net-host-mode` · diff 3

Latency-kriittinen palvelu tarvitsee suoran pääsyn host-portteihin ilman NAT:ia. Verkko-mode?

- **network_mode: host — kontti jakaa hostin network stackin** ✓
- bridge + publish kaikki portit riittää aina
- none network nopeuttaa liikennettä
- overlay vain Swarmissa — ei host-modea

#### `b06-docker-network-ipvlan` · diff 5

Kontit tarvitsevat omat MAC-osoitteet LAN-segmentissä. Mikä driver?

- **ipvlan tai macvlan — kontti näkyy fyysisessä verkossa** ✓
- bridge aina LAN-yhteydessä
- overlay vain swarmissa LAN:ssa
- host mode antaa MAC kontille

#### `b06-docker-network-mode-none` · diff 4

Batch-prosessi ei tarvitse verkkoa — minimoi attack surface. network_mode?

- **network_mode: none — ei verkkoliittymiä** ✓
- network_mode: host on turvallisin
- bridge ilman port mapping riittää
- Poista iptables hostista

#### `b06-docker-network-proxy` · diff 3

Kontti ei saa ulosverkkoyhteyttä — corporate proxy vaaditaan. Miten konfiguroit build?

- **Build args HTTP_PROXY / HTTPS_PROXY Dockerfile buildissä** ✓
- network_mode: host buildissa aina
- Proxy ei vaikuta docker build
- Vain runtime proxy run:lla

#### `b07-docker-network-bridge` · diff 3

Kaksi konttia samassa custom networkissä — toinen ei tavoita toista hostname:llä. Mikä on oikea DNS-nimi?

- **Service/container name Docker DNS:ssä samassa user-defined networkissä** ✓
- localhost toimii konttien välillä
- IP 127.0.0.1
- Host machine hostname

#### `b07-docker-network-host` · diff 4

UDP multicast ei toimi bridge-verkossa. Milloin host network mode?

- **Kun tarvitset hostin verkkostackia suoraan (multicast, spesifit portit)** ✓
- Aina tuotannossa
- HTTP-sovelluksille aina
- host mode korvaa TLS:n

#### `b07-docker-network-publish` · diff 2

Kontti kuuntelee 8080 — host ei tavoita localhost:8080. docker run?

- **-p 8080:8080 — publish port hostille** ✓
- -v 8080:8080
- EXPOSE riittää publishiin
- --network none julkaisee portin

#### `b08-docker-network-bridge-dns` · diff 3

Compose-palvelu `api` ei löydä `db`-hostnamea — oletusbridge-verkossa. Mikä pitää olla?

- **Samassa user-defined networkissä — Compose luo DNS-nimet palveluille** ✓
- links: db:database riittää aina
- Kontit eivät voi resolvda toisiaan
- Käytä aina host network

#### `b08-docker-network-host` · diff 4

Kontti tarvitsee suoran pääsyn hostin verkkoon (multicast). Milloin network_mode: host?

- **Kun bridge/NAT ei riitä — host jakaa network stackin (Linux), tietoturvariski** ✓
- host mode on turvallisin oletus
- host toimii identtisesti Mac/Windows Docker Desktopissa
- EXPOSE riittää multicastiin

#### `b09-docker-net-alias` · diff 2

Kontti pitää tavoittaa nimellä `database` samassa Compose-verkossa. Asetus?

- **network aliases service-nimessä tai container_name + user-defined network** ✓
- links: database — moderni tapa
- hostname riittää aina DNS-resoluutioon
- Default bridge tukee alias-nimiä

#### `b09-docker-net-internal` · diff 3

Tietokanta-kontti ei saa päästä internetiin — vain app-kontti. Verkko-asetus?

- **internal: true user-defined network — ei ulkoista reititystä** ✓
- network_mode: none — app ei yhdistä db:hen
- expose riittää eristykseen
- Bridge estää internetin automaattisesti

#### `b09-docker-net-publish-range` · diff 3

Dev-ympäristössä haluat hostin portin 3000-3005 mapattuna. Compose-syntaksi?

- **ports: - '3000-3005:3000-3005' tai erilliset rivit** ✓
- expose: 3000-3005 riittää hostille
- network_mode: host vaaditaan aina
- Port range ei ole tuettu Dockerissa

#### `docker-bridge-dns` · diff 4

Kaksi konttia samassa user-defined bridge -verkossa. Miten `app` löytää `db`:n nimellä?

- **Embedattu DNS resolver tunnistaa konttinimet verkossa** ✓
- Pakko käyttää --link (legacy)
- Vain /etc/hosts manuaalisesti
- Bridge ei tue nimiä — vain IP

#### `docker-dns-custom` · diff 4

Kontti ei resolvaa sisäistä `corp.internal` -DNS:ää. Ensimmäinen tarkistus?

- **docker run --dns tai daemon.json dns-asetus** ✓
- Vaihda network mode host aina
- Poista /etc/resolv.conf kontin sisältä
- EXPOSE 53 Dockerfilessa

#### `docker-host-network` · diff 4

Kontti tarvitsee kuunnella hostin porttia 53 ilman NAT:ia. Mikä network mode?

- **--network host jakaa verkkonamespaceen** ✓
- bridge oletuksena riittää aina
- none + port mapping 53:53
- overlay vain Swarmissa toimii

#### `docker-inspect-network` · diff 5

Kontti on verkossa mutta ei vastaa. Miten varmistat IP:n ja gatewayn kontissa?

- **docker inspect + docker exec ip route / ip addr** ✓
- Vain docker ps riittää
- journalctl -u docker aina näyttää kontti-IP:n
- docker rm ja toivo

#### `docker-macvlan` · diff 5

Kontti tarvitsee oman MAC-osoitteen ja LAN-IP:n reitittimeltä. Mikä driver?

- **macvlan** ✓
- bridge oletus
- host
- null

#### `docker-overlay` · diff 5

Mikä verkkotyyppi yhdistää kontit eri Docker-hostien välillä klusterissa?

- **overlay (VXLAN) klusterin hallinnassa** ✓
- bridge yksittäisellä hostilla riittää
- host mode hostien välillä
- macvlan vain loopbackissa

#### `exp-docker-net-compose-alias` · diff 3

Compose-palvelu `api` ei löydä `cache`-palvelua hostnameilla. Mitä compose-network konfiguroit?

- **Sama user-defined network — palvelut samassa compose networkissa** ✓
- Jokainen service oletus bridge erikseen
- links: on pakollinen Compose v3:ssa
- Vain host network toimii compose:ssa

#### `exp-docker-net-custom-dns` · diff 3

Kontti ei resolvdu sisäistä DNS-nimeä custom-verkossa. Mitä docker run -optiota kokeilet?

- **--dns tai network-scoped embedded DNS user-defined networkissä** ✓
- Vain --network none
- Muokkaa konttien /etc/hosts käsin jokaisessa deployssa
- DNS toimii vain host-networkissa

#### `exp-docker-net-inspect-dns` · diff 4

Kontit samassa verkossa eivät pingaa toisiaan nimellä. Mitä diagnostiikkaa ajat?

- **docker network inspect verkko + docker exec nslookup toinen-kontti** ✓
- Vain docker logs
- Rebuild image ilman verkkotarkistusta
- DNS toimii vain overlay-verkossa

#### `exp-docker-net-macvlan` · diff 5

Legacy-laite vaatii kontille oman MAC-osoitteen LANissa. Mikä network driver?

- **macvlan — kontti saa fyysisen verkon osoitteen** ✓
- bridge riittää aina MAC-tasolle
- none + port mapping
- host network antaa erillisen MAC:in

#### `exp-docker-net-publish-bind` · diff 3

Palvelu kuuntelee vain localhostia kontissa mutta hostilta ei reach. Mikä publish-syntaksi?

- **-p 8080:8080 map host-port → container-port** ✓
- -p 8080 riittää ilman container-porttia aina
- EXPOSE Dockerfile riittää publishiin
- Port mapping toimii vain Swarmissa

### docker-production (2)

#### `prod-docker-env-secrets` · diff 4

Dockerfile sisältää rivin `ENV API_KEY=sk_live_...`. Mikä ongelma tuotannossa?

- **Salaisuus päätyy image-layeriin ja historiaan — käytä runtime-secrets tai build-secret ilman ENV:ää** ✓
- ENV on automaattisesti salattu levylle
- Docker poistaa salaisuudet buildin jälkeen automaattisesti
- API-key toimii vain build-vaiheessa, ei runtime

#### `prod-docker-k8s-probes` · diff 4

Kubernetes-pod käynnistyy, mutta sovellus ei vielä vastaa HTTP-pyyntöihin. Orkestrointi lähettää liikenteen liian aikaisin. Mikä auttaa?

- **Readiness probe — liikenne vain kun sovellus on valmis palvelemaan** ✓
- Katso vain että container-prosessi on olemassa
- restart: never estää ongelman
- Lisää sleep entrypointtiin kiinteäksi ajaksi

### docker-volumes (27)

#### `b02-docker-vol-backup-14` · diff 4

Named volume backup ilman container downtimea — suositeltu tapa?

- **docker run --rm -v vol:/data -v $(pwd):/backup alpine tar czf /backup/vol.tar.gz /data** ✓
- docker cp running db container
- Snapshot host root
- Export image only

#### `b02-docker-vol-bind-12` · diff 3

Dev: koodi bind-mountattu mutta muutokset eivät näy containerissa — macOS/Windows?

- **Cached/delegated mount tai docker sync — tiedostojärjestelmäero host/VM** ✓
- Bind mount ei toimi koskaan
- Käytä COPY only
- chmod 777 host

#### `b02-docker-vol-named-11` · diff 3

PostgreSQL data katoaa containerin poiston jälkeen — mitä käytit väärin?

- **Ei named volumea — `-v pgdata:/var/lib/postgresql/data`** ✓
- Bind mount aina parempi tietokannalle
- tmpfs riittää
- COPY data imageen

#### `b02-docker-vol-ro-13` · diff 2

Config mountattu containeriin — attacker ei saa muokata. Flag?

- **docker run -v /host/config:/app/config:ro** ✓
- -v ilman :rw on read-only
- Umask riittää
- Config imageen aina

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

#### `b05-docker-vol-bind-perms` · diff 4

Bind mount host-kansiosta — kontti kirjoittaa permission denied. Juurisyy?

- **UID/GID mismatch hostin ja kontin välillä — non-root kontti ei omista tiedostoja** ✓
- Bind mount ei tue kirjoitusta
- chmod 777 hostissa on aina turvallinen ratkaisu
- Vain named volume sallii kirjoituksen

#### `b05-docker-vol-named-backup` · diff 3

Postgres-data named volumessa — tarvitset varmuuskopion ilman konttia. Miten?

- **docker run --rm -v vol:/data -v $(pwd):/backup alpine tar cvf /backup/db.tar /data** ✓
- docker cp suoraan volumeen ilman mounttia
- Named volume ei ole varmuuskopioitavissa
- Vain bind mount tukee backuppia

#### `b05-docker-vol-readonly-root` · diff 3

Security hardening: kontti ei saa muokata omaa filesystemia. Mitä asetusta käytät?

- **read_only: true + tmpfs writable /tmp** ✓
- Vain USER nobody riittää
- privileged: false estää kaiken kirjoituksen
- Bridge network tekee filesystemin read-only

#### `b06-docker-security-readonly-tmpfs` · diff 4

Read-only rootfs mutta app tarvitsee /tmp kirjoitusta. Miten?

- **--read-only --tmpfs /tmp — tmpfs writable scratch** ✓
- read-only estää kaiken kirjoituksen — ei ratkaisu
- privileged korvaa tmpfs
- COPY tmp imageen

#### `b06-docker-volume-driver` · diff 4

Tuotanto tarvitsee NFS-pohjainen persistent storage kontteille. Miten määrität volume?

- **Named volume driver opts — esim. local driver mount NFS** ✓
- bind mount NFS aina tuotannossa
- Vain hostPath kubernetesissa — docker ei tue
- COPY data imageen

#### `b06-docker-volume-mount-propagation` · diff 5

Bind mount host-muutokset ei näky kontissa — mount propagation väärä. Mitä säätät?

- **bind propagation rshared/rslave — mount visibility host↔container** ✓
- volume: named korvaa propagation
- chmod 777 mount point
- restart container

#### `b07-docker-volume-backup` · diff 4

Postgres volume pitää varmuuskopioida ilman konttia samassa verkossa. Käytännöllinen tapa?

- **Temporary container mount same volume + pg_dump — or docker run --volumes-from** ✓
- docker cp koko volume
- rm volume ja toivo
- Snapshot host /var/lib/docker manually only

#### `b07-docker-volume-bind` · diff 3

Kehityksessä haluat live-reload lähdekoodilla hostilta. Volume-tyyppi?

- **Bind mount — -v $(pwd):/app host-polku konttiin** ✓
- Named volume aina
- tmpfs mount tuotantoon
- COPY riittää devissä

#### `b07-docker-volume-named` · diff 2

DB-data katoaa kontin poiston jälkeen. Miten säilytät datan?

- **Named volume — docker volume create + mount -v dbdata:/var/lib/postgresql/data** ✓
- Bind mount /tmp only
- Data kontin writable layerissa
- docker rm -v säilyttää datan

#### `b08-docker-volume-bind-selinux` · diff 4

RHEL-host: bind mount permission denied vaikka chmod 777. Todennäköisin syy?

- **SELinux — käytä :Z tai :z volume-flagia relabelille** ✓
- Docker ei tue bind mounteja RHEL:llä
- Poista SELinux tuotannosta aina
- named volume ei tarvitse koskaan labelia

#### `b08-docker-volumes-named` · diff 2

Postgres-data katoaa kontti poistossa — käytit bind mountia väärään polkuun. Parempi tuotantokäytäntö?

- **Named volume — Docker hallitsee polkua, selkeä backup/restore** ✓
- Väliaikainen filesystem kontissa riittää
- Bind mount aina parempi named volumeen
- docker commit tallentaa datan

#### `b09-docker-vol-anonymous` · diff 3

Dockerfile: `VOLUME /data` — data katoaa kontin poiston jälkeen. Miksi?

- **Anonymous volume poistuu kontin mukana ellei nimeä erikseen** ✓
- VOLUME on read-only aina
- Named volume luodaan automaattisesti VOLUME:sta
- Data tallentuu image-layeriin

#### `b09-docker-vol-driver-local` · diff 3

Usean hostin Swarm-klusterissa tarvitset jaetun volumen. Vaihtoehto local driverille?

- **NFS/Ceph/ cloud volume plugin — esim. volume driver nfs** ✓
- local driver replikoi automaattisesti
- Bind mount skaalautuu Swarmissa
- Docker ei tue jaettuja volumeja

#### `b09-docker-vol-mount-propagation` · diff 4

Bind mount host-kansiosta ei näy muutoksia nested mountissa. Propagation-asetus?

- **bind propagation (rshared/rslave) — mount-propagation docs** ✓
- read_only: true korjaa propagationin
- Propagation ei vaikuta bind mounteihin
- Vain named volume tukee nested mounteja

#### `b10-docker-volumes-backup-01` · diff 4

Named volume pitää varmuuskopioida ilman kontin käynnistämistä. Tyypillinen tapa?

- **Väliaikainen kontti mounttaa saman volumen ja archivoi tiedostot** ✓
- docker cp suoraan volume-objektiin ilman mounttia
- Vain docker commit riittää backupiin
- Volume data on aina image-layerissa

#### `exp-docker-vol-backup` · diff 3

Haluat varmuuskopioida named volumen ilman konttia käynnissä. Miten?

- **docker run --rm -v vol:/data -v $(pwd):/backup alpine tar cvf /backup/vol.tar /data** ✓
- docker cp suoraan volumeen ilman mounttia
- Volumes ovat salattuja — backup mahdoton
- Vain docker commit volumeen

#### `exp-docker-vol-bind-perms` · diff 4

Bind mount ./config:/app/config — kontti ei saa kirjoittaa. Mikä on tyypillinen syy?

- **Host-tiedoston UID/GID ei täsmää konttiprosessin kanssa** ✓
- Bind mount ei tue kirjoitusta koskaan
- Vain named volume voi olla rw
- Dockerfile EXPOSE korjaa oikeudet

#### `exp-docker-vol-db-persist` · diff 3

Postgres-kontti poistettiin `docker rm` — data katosi. Miten olisi pitänyt tallentaa data?

- **Named volume: -v pgdata:/var/lib/postgresql/data** ✓
- Vain container layer — data säilyy automaattisesti
- docker commit ennen rm
- ENV DATA=/tmp riittää

#### `exp-docker-vol-readonly` · diff 3

Config-volume ei saa muuttua runtime-aikana. Mikä mount-optio?

- **:ro loppuun — esim. -v config:/etc/app:ro** ✓
- --read-only root filesystem riittää aina
- Vain tmpfs voi olla read-only
- Dockerfile VOLUME estää kirjoituksen

## git (4)

### git-ci (2)

#### `prod-ci-cache-lockfile` · diff 4

CI käyttää dependency-cachea mutta buildit saavat satunnaisesti väärät paketit. Mikä cache-avaimessa pitää huomioida?

- **Lockfile-hash (package-lock.json, Cargo.lock…) — cache invalidoituu kun deps muuttuu** ✓
- Sama cache-avain kaikille brancheille ikuisesti
- Cacheaa koko workspace ilman invalidointia
- Poista lockfile nopeuden vuoksi

#### `prod-ci-flaky-test` · diff 4

Testi epäonnistuu vain joskus CI:ssä. Mikä on hyvä ensimmäinen askel?

- **Eristä nondeterminismi: aika, rinnakkaisuus, verkko, satunnaisuus ja järjestys** ✓
- Lisää retry ja unohda juurisyy
- Poista testi — hidastaa pipelinea
- Aja vain paikallisesti ja merkitse CI vihreäksi

### git-workflow (2)

#### `prod-git-bisect` · diff 4

Regressio ilmestyi jossain 200 commitin välillä. Mikä Git-työkalu auttaa löytämään syyllisen commitin?

- **git bisect — binäärihaku good/bad commitien välillä** ✓
- git blame koko repoon kerralla
- git stash ja unohda historia
- git gc korjaa regression

#### `prod-git-force-with-lease` · diff 4

Rebase tehtiin ja branch pitää puskea uudestaan. Miten vältät että ylikirjoitat kollegan commitit vahingossa?

- **git push --force-with-lease** ✓
- git push --force aina — nopein tapa
- git reset --hard origin/main paikallisesti
- git clean -fd ja toivo parasta

## javascript (134)

### js-async (39)

#### `b02-js-async-await-04` · diff 3

async funktio heittää virheen — caller ei saa stack tracea. Miten käsittelet?

- **try/catch await ympärillä tai .catch() chainissa** ✓
- async ei heitä koskaan
- console.log only
- Poista async

#### `b02-js-async-fetch-01` · diff 2

REST-kutsu timeout 30s — käyttäjä navigoi pois. Miten peruutat fetchin?

- **AbortController + signal fetch optionsissa** ✓
- fetch ei voi peruuttaa
- window.close()
- setTimeout null

#### `b02-js-async-microtask-03` · diff 4

console.log järjestys: sync, Promise.resolve().then, setTimeout(0). Mikä ensin microtask jonossa?

- **Promise.then ennen setTimeout — microtask queue ennen macrotask** ✓
- setTimeout aina ensin
- sync viimeisenä
- Satunnainen

#### `b02-js-async-promise-02` · diff 3

Kolme riippumatonta API-kutsua — haluat odottaa kaikkia mutta yksi fail saa jatkua. Metodi?

- **Promise.allSettled** ✓
- Promise.all — sama mutta jatkuu failista
- callback hell
- await serial only

#### `b03-js-async-debounce-fetch` · diff 3

Hakukenttä laukaisee fetch-jokaisella näppäimellä — API rate limit. Korjaus?

- **Debounce/throttle + AbortController edellisen pyynnön peruutukseen** ✓
- setInterval fetch 10 ms
- Synkroninen XMLHttpRequest
- Cache-Control: no-store riittää

#### `b03-js-async-event-loop-order` · diff 4

Debug: console.log(1); Promise.resolve().then(()=>log(2)); queueMicrotask(()=>log(3)); log(4). Tulostus?

- **1, 4, 2, 3 — microtask queue ennen seuraavaa macrotaskia** ✓
- 1, 2, 3, 4
- 1, 4, 3, 2
- Satunnainen järjestys

#### `b03-js-async-fetch-credentials` · diff 3

SPA ei lähetä session-cookiea cross-origin API:lle. fetch-korjaus?

- **credentials: 'include' + CORS serverillä Access-Control-Allow-Credentials** ✓
- credentials: 'omit' aina
- Cookie header manuaalisesti ilman CORS
- fetch ei tue cookieita

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

Paginoitu API — haluat for-await silmukan joka hakee sivut automaattisesti. Pattern?

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

#### `b05-js-async-debounce` · diff 3

Hakukenttä laukaisee API-kutsun jokaisella näppäimellä — palvelin ylikuormittuu. Ratkaisu?

- **Debounce — odota tauko ennen kutsua** ✓
- Synkroninen XMLHttpRequest
- while-loop odottaa käyttäjää
- Poista input-kenttä

#### `b05-js-event-loop-order` · diff 3

console.log('A'); setTimeout(() => console.log('B'), 0); Promise.resolve().then(() => console.log('C')); Tulostusjärjestys?

- **A, C, B — microtask ennen macrotaskia** ✓
- A, B, C
- A, B samanaikaisesti C
- C, A, B

#### `b05-js-fetch-abort-controller` · diff 4

Käyttäjä navigoi pois ennen kuin hidas fetch valmistuu — vanha vastaus ylikirjoittaa uuden. Korjaus?

- **AbortController — abort edellinen pyyntö uuden alkaessa** ✓
- fetch ei voi peruuttaa
- location.reload() ennen fetchiä
- Global flag ilman abortia riittää

#### `b05-js-promise-chain-catch` · diff 3

fetch-ketju kaatuu — virhe jää käsittelemättä ja UI jää spinneriin. Korjaus?

- **.catch() ketjun lopussa tai try/catch async-funktiossa** ✓
- Virheet katoavat automaattisesti promisessa
- then() ilman toista parametria riittää
- setTimeout korjaa rejected promisen

#### `b06-js-async-iterator-forawait` · diff 4

Stream API palauttaa async iterable — haluat loopata awaitilla. Miten?

- **for await (const chunk of stream) — async iteration** ✓
- for (const chunk of stream) — sync loop riittää
- stream.map async
- Promise.all stream chunks

#### `b06-js-async-promise-finally` · diff 3

Fetch-ketju — haluat cleanup riippumatta success/failure. Mitä käytät?

- **promise.finally() — ajetaan aina kun promise settle** ✓
- then() ja catch() erikseen ilman duplikaattia
- finally on vain try-catch
- async function ei tarvitsee cleanup

#### `b06-js-async-queue-microtask` · diff 3

console.log järjestys: sync, setTimeout(0), promise.then. Mitä tulostuu ensin promise:n jälkeen?

- **Microtask (promise) ennen macrotask (setTimeout) — event loop järjestys** ✓
- setTimeout aina ensin
- Sync ja promise sama prioriteetti
- Järjestys satunnainen

#### `b06-js-async-settimeout-zero` · diff 2

setTimeout(fn, 0) ei suorita fn heti — miksi?

- **Callback menee macrotask queueen — odottaa nykyisen sync-koodin** ✓
- 0 ms on liian pieni — min 4ms
- setTimeout on synkroninen
- Browser bugi

#### `b07-js-async-abort` · diff 4

Käyttäjä vaihtaa sivua ennen fetchin valmistumista — vanha vastaus ylikirjoittaa uuden. Korjaus?

- **AbortController — signal fetchiin ja abort navigoinnissa** ✓
- ignore vanha vastaus ilman abort
- Synkroninen fetch
- localStorage cache aina

#### `b07-js-async-await-error` · diff 3

async funktio heittää — unhandled rejection tuotannossa. Miten käsittelet?

- **try/catch await ympärillä tai .catch() chainissa** ✓
- async ei heitä koskaan
- console.log error riittää
- Poista async

#### `b07-js-async-debounce` · diff 4

Käyttäjä kirjoittaa hakukenttään nopeasti — vanhemmat fetch-vastaukset saapuvat myöhemmin ja ylikirjoittavat uudemman tuloksen. Korjaus?

- **AbortController per uusi haku + tarvittaessa debounce** ✓
- Lisää vain setInterval — päivitä 100 ms välein
- Poista async ja käytä synkronista fetchiä
- Tallenna vain ensimmäinen vastaus — ignooraa loput

#### `b07-js-async-microtask` · diff 4

console.log järjestys: sync, Promise.then, setTimeout. Mikä tulostuu toisena?

- **Promise.then (microtask) ennen setTimeout (macrotask)** ✓
- setTimeout aina ensin
- Kaikki synkronisesti
- Promise on macrotask

#### `b08-js-async-generator` · diff 4

Paginoitu API — haluat for-loopin joka hakee sivut yksi kerrallaan async-iteraattorina. Ominaisuus?

- **async function* generator — for await...of sivuille** ✓
- while(true) sync fetch
- Generators eivät tue async:ia
- callback pyramid on moderni

#### `b08-js-async-microtask-starvation` · diff 5

while(true) Promise.resolve().then(...) — UI jäätyy mutta ei 100% CPU. Miksi?

- **Microtask loop — microtask queue tyhjenee ennen macrotask/render** ✓
- Promise ei käytä event loopia
- setTimeout(0) saman loopin sisällä auttaa
- async/await ei käytä microtaskeja

#### `b08-js-async-parallel` · diff 3

Lataat kolme riippumatonta API:a — await peräkkäin kestää 3×. Nopeampi tapa?

- **Promise.all([fetch(a), fetch(b), fetch(c)]) — rinnakkain** ✓
- for-await rinnakkaisuuteen ilman Promise.all
- Synkroninen XMLHttpRequest rinnakkain
- setTimeout ketjutus nopeuttaa

#### `b08-js-async-race-timeout` · diff 3

fetch ei saa roikkua yli 5 sekuntia — timeout ilman manuaalista flagia?

- **AbortSignal.timeout(5000) tai Promise.race fetch + timeout promise** ✓
- fetch timeout parametri natiivisti
- while Date.now() block
- setInterval peruuttaa fetchin

#### `b09-js-async-event-loop-block` · diff 4

Express-endpoint jäädyttää koko palvelimen 30 sekunniksi raskaalla JSON-parsinnalla. Juurisyy?

- **Synkroninen työ event loop -säieessä — siirrä worker threadiin tai pilko** ✓
- Express ei tue asyncia
- JSON.parse on aina async
- Lisää useampia Express-instanssia samaan prosessiin

#### `b09-js-async-fetch-abort` · diff 3

Käyttäjä navigoi pois ennen kuin hidas fetch valmistuu — haluat peruuttaa pyynnön. API?

- **AbortController + signal fetch-kutsussa** ✓
- fetch.cancel() built-in
- Sulje selain — ainoa tapa
- Promise.race ilman abortia riittää aina

#### `b09-js-async-promise-chain` · diff 3

Callback hell API-ketjussa — kolme peräkkäistä fetch-kutsua. Moderni refaktorointi?

- **async/await tai Promise chain .then() — flat async flow** ✓
- Synkroninen XMLHttpRequest
- setTimeout ketjutus
- Global callback registry

#### `b09-js-async-unhandled-rejection` · diff 4

Tuotannossa `UnhandledPromiseRejection` kaataa Node-prosessin. Miten käsittelet?

- **try/catch async-funktioissa + .catch() ketjuissa + process handler** ✓
- Promiset eivät voi rejectata
- Ignoroi — Node korjaa automaattisesti
- Vain sync try/catch riittää

#### `exp-js-async-await-parallel` · diff 3

Code review: kaksi await fetchiä peräkkäin — sivu latautuu hitaasti. Miten nopeutat?

- **const [a,b] = await Promise.all([fetchA(), fetchB()])** ✓
- Lisää toinen await perään — nopeampi
- Poista async — synkroninen nopeampi
- setTimeout fetchien väliin

#### `exp-js-async-fetch-abort` · diff 3

Käyttäjä navigoi pois ennen kuin hidas fetch valmistuu — state päivittyy unmountatulle komponentille. Miten estät?

- **AbortController signal fetchiin + cleanup useEffectissä** ✓
- Ignoroi virhe — fetch jatkuu taustalla
- setState aina riippumatta mount-tilasta
- async/await poistaa tarpeen peruutukselle

#### `exp-js-async-microtask-order` · diff 4

Bugiraportti: `console.log` järjestys on 1, 4, 2, 3 — setTimeout(0), Promise.resolve, sync. Miksi?

- **Microtask (promise) ennen macrotask (setTimeout) — event loop** ✓
- setTimeout aina ensin
- Sync koodi ajetaan uudelleen loopissa
- Promise on macrotask

#### `exp-js-async-promise-all-settled` · diff 3

Dashboard hakee viisi API:a — yksi failaa ja koko näkymä jää tyhjäksi Promise.all:in takia. Parempi malli?

- **Promise.allSettled — käsittele jokainen tulos erikseen** ✓
- try/catch Promise.all ympärillä palauttaa osittaisen datan
- Synkroninen XMLHttpRequest jono
- callback hell ilman virheenkäsittelyä

#### `js-async-await-error` · diff 3

async-funktio heittää virheen. Miten käsittelet sen kutsujassa turvallisesti?

- **try/catch awaitin ympärillä tai .catch() promisella** ✓
- Virheet katoavat automaattisesti asyncissa
- Vain callback-tyyli toimii virheille
- await estää throw:in

#### `js-async-microtasks` · diff 4

console.log(1); Promise.resolve().then(() => console.log(2)); console.log(3); — missä järjestyksessä?

- **1, 3, 2 — microtask jonon jälkeen synkroninen koodi** ✓
- 1, 2, 3
- 3, 2, 1
- 2, 1, 3

#### `prod-js-unhandled-rejection-caller` · diff 4

Event handler kutsuu `saveData()` async-funktiota ilman awaitia eikä lisää `.catch()`. Promise hylätään. Mikä riski?

- **Unhandled rejection — virhe voi jäädä huomaamatta tai kaataa prosessin asetuksista riippuen** ✓
- Promise suoritetaan uudelleen automaattisesti
- async-funktiot eivät voi epäonnistua ilman awaitia
- try/catch async-funktion sisällä riittää aina kutsujalle

### js-modules (29)

#### `b02-js-modules-cycle-09` · diff 4

Kaksi moduulia importtaa toisensa — toinen export undefined init aikana. Ratkaisu?

- **Refaktoroi jaettu riippuvuus kolmanteen moduuliin tai käytä lazy import** ✓
- Poista export
- CommonJS only
- global variable

#### `b02-js-modules-dynamic-08` · diff 3

Feature flag lataa analytics-moduulin vain tarvittaessa. ES module tapa?

- **dynamic import(): `const m = await import('./analytics.js')`** ✓
- require() browserissa
- script tag sync
- eval module

#### `b02-js-modules-export-11` · diff 2

Haluat uudelleenexportata useita util-funktioita yhdestä entrypointista. Syntax?

- **export { foo, bar } from './utils.js'** ✓
- import * then window.foo
- require re-export
- globalThis only

#### `b02-js-modules-tla-10` · diff 4

Moduulin top-level await hidastaa koko appin latausta — milloin käyttää?

- **Kun moduulin init vaatii async resurssin ennen exporttia — harkitse erillistä init()** ✓
- Aina jokaisessa tiedostossa
- TLA kielletty
- Vain callback

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

#### `b04-js-modules-import-meta` · diff 3

ES-moduulissa tarvitset nykyisen moduulin URL:n asset-polkuun. Standardi API?

- **import.meta.url** ✓
- __dirname — saatavilla browsereissa
- window.location aina
- require.resolve

#### `b05-js-modules-dynamic-import` · diff 3

Raskas chart-kirjasto ladataan vain kun käyttäjä avaa analytics-sivun. Miten?

- **import('chart.js') — dynamic import code-splitting** ✓
- Static import tiedoston alussa aina
- document.write('<script>')
- eval('import chart')

#### `b05-js-modules-esm-import` · diff 2

HTML:ssä `<script src='app.js'>` — import/export ei toimi. Korjaus?

- **<script type='module' src='app.js'> — ES modules selaimessa** ✓
- require() selaimessa riittää
- import toimii ilman type=module
- Vain bundler — selain ei tue moduleja

#### `b05-js-modules-top-level-await` · diff 4

Moduulin init tarvitsee config-fetch ennen exportteja. Moderni tapa ilman callback-helvettiä?

- **Top-level await moduulissa — odottaa ennen moduulin valmistumista** ✓
- Sync XMLHttpRequest
- Global window.config setTimeout:lla
- Top-level await toimii vain Node:ssa

#### `b06-js-modules-import-assertions` · diff 4

JSON config moduuli — haluat importtaa JSON ESM:ssä turvallisesti. Miten?

- **import config from './config.json' with { type: 'json' }** ✓
- fetch config runtime aina
- require json ESM:ssä
- import json ilman assertion

#### `b06-js-modules-reexport` · diff 3

Barrel file exporttaa utils-moduulien API yhdessä paikassa. Miten?

- **export { foo } from './foo.js' — re-export** ✓
- import ja window.foo
- require() barrelissa
- export default kaikki moduulit

#### `b06-js-modules-top-level-await` · diff 3

ESM moduuli tarvitsee async init ennen exporttia. Miten ilman wrapper-funktiota?

- **Top-level await moduulin juuressa — ESM feature** ✓
- await vain funktion sisällä aina
- IIFE async moduulin korvaajana
- CommonJS require async

#### `b07-js-modules-cycle` · diff 4

a.js importtaa b.js ja b.js importtaa a.js — undefined export. Miten korjaat?

- **Refaktoroi jaettu riippuvuus kolmanteen moduuliin — rikkoo syklin** ✓
- Lisää require sync
- Poista export
- global window fix

#### `b07-js-modules-dynamic` · diff 3

Admin-paneeli on harvoin käytössä — haluat ladata sen koodin vain tarvittaessa. ES module?

- **dynamic import() — code splitting lazy load** ✓
- import admin at top always
- script tag sync
- require() browserissa

#### `b07-js-modules-tree-shake` · diff 3

Bundle on iso vaikka käytät yhtä lodash-funktiota. Import-korjaus?

- **Named import tai lodash-es — import { debounce } from lodash-es** ✓
- import _ from lodash whole
- require entire package
- Copy paste function

#### `b08-js-modules-circular` · diff 4

a.js importtaa b.js ja b.js importtaa a.js — export undefined initissä. Juurisyy?

- **Circular dependency — moduuli ei ole fully evaluated vielä** ✓
- ES modules eivät salli syklejä
- Bundler bug aina
- import hoisting poistaa syklit

#### `b08-js-modules-dynamic-import` · diff 3

Raskas chart-kirjasto vain admin-sivulla — bundle liian iso. Latausstrategia?

- **dynamic import() — code splitting route/komponentin mukaan** ✓
- import chart at top level aina
- require() on ainoa tapa lazy load
- script tag sync headissä

#### `b08-js-modules-top-level-await` · diff 4

ES module init lataa config.json ennen exportteja — miten ilman async IIFE?

- **top-level await modulessa — await fetch config ennen export** ✓
- var config sync fetch
- TLA toimii vain CommonJS
- export ennen await aina

#### `b09-js-modules-circular-dep` · diff 4

Moduuli A importtaa B:n ja B importtaa A:n — undefined exportit bootissa. Korjaus?

- **Refaktoroi jaettu logiikka kolmanteen moduuliin — poista sykli** ✓
- Lisää delay requireen
- Circular deps toimivat aina ESM:ssä
- Yhdistä A ja B yhdeksi tiedostoksi aina

#### `b09-js-modules-dynamic-import` · diff 3

Raskas chart-kirjasto tarvitaan vain admin-sivulla — haluat pienentää initial bundlea. Lataus?

- **dynamic import() — code splitting lazy load** ✓
- require() top-level ESM:ssä
- script tag sync headissä
- import static kaikille sivuille

#### `b09-js-modules-esm-cjs-interop` · diff 4

Node-projektissa `require('esm-only-pkg')` kaatuu. Oikea lähestymistapa?

- **Siirry type:module tai dynamic import() ESM-paketeille** ✓
- require toimii kaikille npm-paketeille
- Muokkaa node_modules käsin
- Poista package.json type

#### `exp-js-modules-cycle` · diff 4

Circular import: a.js importtaa b.js ja toisin päin — export undefined runtime. Ensimmäinen korjaus?

- **Refaktoroi jaettu riippuvuus kolmanteen moduuliin** ✓
- Lisää window.global
- Poista exportit
- CommonJS require aina kiertää syklit

#### `exp-js-modules-dynamic-import` · diff 3

Admin-näkymän bundle on liian iso — haluat ladata sen vain admin-reitillä. Miten?

- **dynamic import() route-kohtaisesti — code splitting** ✓
- require() bundlerissa aina
- script tag jokaiselle sivulle
- eval moduulin lataamiseen

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

### js-runtime (35)

#### `b02-js-runtime-closure-12` · diff 3

for-loopissa 10 timeoutia tulostaa kaikki 10 — klassinen bugi. Fix?

- **let i loopissa tai IIFE/factory closure jokaiselle iteratiolle** ✓
- var i on fine
- Poista closure
- setTimeout sync

#### `b02-js-runtime-pollution-14` · diff 4

Käyttäjän JSON merge objektiin — `__proto__` payload. Miten estät?

- **Object.create(null) tai Map; älä käytä deep merge ilman key validation** ✓
- JSON.parse on aina turvallinen
- Luota client input
- eval JSON

#### `b02-js-runtime-weakmap-13` · diff 4

Metadata cache objekteille — Map pitää objektit elossa muistivuotona. Vaihtoehto?

- **WeakMap — avaimet eivät estä GC:tä** ✓
- Global object registry
- JSON.stringify keys
- WeakMap ei toimi objekteille

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

#### `b04-js-runtime-error-cause` · diff 3

fetch wrapper heittää uuden Error('API failed') — alkuperäinen stack katoaa. ES2022 parannus?

- **throw new Error('API failed', { cause: originalError })** ✓
- console.log original — riittää
- Error ei tue ketjutusta
- String(originalError) stackissa

#### `b04-js-runtime-gc-closure` · diff 4

SPA muistin käyttö kasvaa navigoidessa — vanhat DOM-viittaukset closureissa. Miten estät?

- **Poista event listenerit ja nollaa viittaukset teardownissa; WeakRef/WeakMap tarvittaessa** ✓
- GC hoitaa automaattisesti — ei toimenpiteitä
- location.reload() joka sivulla
- global.gc() tuotannossa

#### `b04-js-runtime-structured-clone` · diff 4

JSON.parse(JSON.stringify(obj)) rikkoo Date-objektit ja undefined-kentät. Parempi deep clone?

- **structuredClone(obj) — structured clone algorithm** ✓
- Object.assign riittää deep cloneen
- Spread {...obj} deep clone
- lodash ainoa vaihtoehto

#### `b05-js-fetch-cors-preflight` · diff 4

POST JSON toiselle domainille — selain lähettää OPTIONS ensin. Miksi?

- **CORS preflight — selain tarkistaa cross-origin -luvan custom headereille** ✓
- OPTIONS on API-bugi
- fetch ei tue cross-origin
- Preflight vain HTTP:llä ei HTTPS:llä

#### `b05-js-runtime-closure-stale` · diff 3

for-silmukassa 5 nappia — kaikki tulostavat 5. Klassinen bugi. Korjaus?

- **let i silmukassa tai IIFE/closure joka kaappaa arvon per iteratio** ✓
- var i riittää aina
- Poista closure — globaali i
- onclick ei tue closureja

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

- **console.trace() — tulostaa stack trace** ✓
- console.log stack automaattisesti
- debugger statement productionissa
- console.dir stack

#### `b06-js-runtime-finalization-registry` · diff 5

WeakRef ei takaa cleanup — tarvitset callback kun objekti GC:ttä. Mitä API?

- **FinalizationRegistry — cleanup callback GC:n jälkeen** ✓
- WeakRef callback automaattisesti
- Object.finalize standard
- setInterval poll WeakRef

#### `b06-js-runtime-json-parse-reviver` · diff 4

JSON.parse palauttaa date stringit — haluat Date-objekteja automaattisesti. Miten?

- **JSON.parse(text, reviver) — reviver transformaa arvot** ✓
- Date.parse kaikille kentille manuaalisesti
- JSON ei tukee Date — ei ratkaisua
- eval JSON korvaa parse

#### `b06-js-runtime-proxy-freeze` · diff 4

Object.freeze ei estä nested muutoksia — config objekti mutatoitu. Miten syvä immutability?

- **Rekursiivinen freeze tai structured clone + freeze — tai immutable pattern** ✓
- freeze on aina syvä
- const estää nested muutokset
- JSON.parse stringify riittää turvallisuuteen

#### `b07-js-runtime-closure-loop` · diff 3

for-loopissa 5 click-handleria — kaikki tulostavat 5. Klassinen bugi ja fix?

- **let i loopissa tai IIFE — var jakaa saman sidonta** ✓
- var korjaa automaattisesti
- Poista handlerit
- setTimeout 0 riittää var:lla

#### `b07-js-runtime-json-parse` · diff 2

API palauttaa JSON-stringin — eval(data) parseen. Turvallinen tapa?

- **JSON.parse(data) — ei suorita koodia** ✓
- eval on nopein
- new Function(data)
- innerHTML data

#### `b07-js-runtime-prototype` · diff 3

Kaikki array-instanssit saivat uuden metodin forEachin jälkeen — mitä teit?

- **Muokkasit Array.prototype — vältä, käytä utility-funktiota** ✓
- Se on best practice
- Object.prototype on parempi
- Se nopeuttaa aina

#### `b07-js-runtime-weakmap` · diff 4

Cache Map DOM-elementeistä aiheuttaa memory leakin sivun vaihtuessa. Parempi rakenne?

- **WeakMap — avaimet voivat GC:tä ilman explicit delete** ✓
- Map + manual delete aina riittää
- global array elements
- localStorage cache DOM

#### `b08-js-runtime-closure-loop` · diff 3

for (var i=0; i<3; i++) { setTimeout(() => console.log(i), 0); } tulostaa 3,3,3. Korjaus?

- **let i — block scope per iteratio — tai IIFE/param capture** ✓
- var on aina oikein loopissa
- setTimeout sync ajaa loopin
- Poista closure

#### `b08-js-runtime-dom-ready` · diff 2

Script headissä — document.getElementById palauttaa null. Milloin DOM on valmis?

- **DOMContentLoaded — tai script defer/module end of body** ✓
- window.load aina nopein DOM:iin
- DOM valmis heti parserin alussa
- async script takaa DOM ready

#### `b08-js-runtime-prototype-chain` · diff 3

`obj.toString()` toimii vaikka obj:ssa ei ole toString — miten?

- **Prototype chain — etsitään obj.__proto__ → Object.prototype** ✓
- JavaScript kääntää automaattisesti
- Kaikki metodit kopioitu jokaiseen objektiin
- Vain class-instanssit perivät

#### `b08-js-runtime-weakmap` · diff 4

DOM-elementtiin liitetty metadata — Map aiheuttaa memory leakin kun element poistuu. Rakenne?

- **WeakMap — avaimet heikosti viitattuja, GC voi kerätä** ✓
- global object metadata
- WeakMap pitää avaimet ikuisesti
- JSON.stringify elementtiin

#### `b09-js-runtime-closure-leak` · diff 4

SPA:n muisti kasvaa navigoidessa — DevTools näyttää detached DOM -nodeja. Syy?

- **Event listenerit tai closuret pitävät viittauksia poistettuihin elementteihin** ✓
- GC ei toimi moderneissa selaimissa
- innerHTML tyhjentää aina listenerit
- Muistivuoto on vain Node-ongelma

#### `b09-js-runtime-debounce-search` · diff 2

Hakukenttä laukaisee API-kutsun jokaisella näppäinpainalluksella. Optimointi?

- **debounce — odota tauko ennen hakua** ✓
- throttle ja debounce ovat sama asia
- Poista input listener
- Synkroninen haku aina

#### `b09-js-runtime-raf-animation` · diff 3

Custom animaatio pätkii — setInterval 16 ms ei synkronoidu näytön refreshiin. Korjaus?

- **requestAnimationFrame — synkronoituu display refreshiin** ✓
- setInterval(0) on nopein
- CSS animation ei toimi JS:n kanssa
- while-loop animaatioon

#### `b09-js-runtime-weakmap-cache` · diff 3

Cacheta metadata DOM-elementeille ilman että estät GC:n poistamasta elementtejä. Rakenne?

- **WeakMap — avaimet voivat kerätä roskikseen** ✓
- Map element-avaimilla — aina turvallinen
- Globaali object registry
- element.metadata property aina

#### `exp-js-runtime-closure-stale` · diff 4

React bugi: useEffect closure näkee vanhan `count`-arvon — interval loggaa 0 ikuisesti. Miksi?

- **Stale closure — dependency array tai functional update** ✓
- JavaScript ei tue closureja
- let korjaa automaattisesti
- setInterval ei käytä closureja

#### `exp-js-runtime-memory-detached` · diff 4

Web Worker postMessage hidastuu — suuri ArrayBuffer kopioidaan joka viestissä. Optimointi?

- **postMessage(buffer, [buffer]) transfer list — zero-copy** ✓
- JSON.stringify buffer
- SharedWorker aina nopeampi
- Blob clone nopein tapa

#### `exp-js-runtime-prototype-pollution` · diff 5

Code review: `merge(userInput, defaults)` kopioi avaimet rekursiivisesti ilman __proto__ suojaa. Riski?

- **Prototype pollution — Object.prototype muuttuu** ✓
- Ei riskiä — JSON on turvallinen
- Vain SQL injection
- merge on aina turvallinen

#### `exp-js-runtime-weakmap-cache` · diff 3

DOM-elementtiin liitetty metadata aiheuttaa memory leakin Mapissa. Parempi rakenne?

- **WeakMap — avain voi olla objekti, GC vapauttaa** ✓
- global object kaikelle datalle
- localStorage DOM-id:llä
- WeakMap ei salli objektiavaimia

#### `js-runtime-closure-loop` · diff 4

for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); } — mitä tulostuu?

- **3, 3, 3 — var ei lohkoi scopea** ✓
- 0, 1, 2
- undefined × 3
- Syntaksivirhe

### js-types (30)

#### `b02-js-types-coalesce-06` · diff 2

Config `port` voi olla 0 — oletus 3000 vain jos null/undefined. Operaattori?

- **Nullish coalescing: `port ?? 3000`** ✓
- `port || 3000` — sama asia
- port ? port : 3000 estää 0
- port + 3000

#### `b02-js-types-optional-05` · diff 2

API palauttaa `{ name?: string }` — miten luet turvallisesti ilman undefined crash?

- **Optional chaining: `user?.profile?.name`** ✓
- user.profile.name aina
- == null check riittää kaikkeen
- eval

#### `b02-js-types-strict-07` · diff 2

Bugi: `if (count == '0')` menee läpi kun count on 0. Fix?

- **Käytä === tiukkaan vertailuun** ✓
- == on turvallisempi
- Muuta count stringiksi
- Poista vertailu

#### `b03-js-types-number-precision` · diff 3

Laskin näyttää 0.1 + 0.2 === 0.3 false — laskutuskoodi valittaa senteistä. Ratkaisu?

- **Integer sentit (cents) tai decimal library — älä luota float-yhtäsuuruuteen** ✓
- Math.round korjaa kaiken
- parseInt kaikille desimaaleille
- Number on exact desimaaleille

#### `b03-js-types-optional-chaining` · diff 2

API-vastaus voi olla null — `user.profile.name` kaataa tuotannossa. Moderni suoja?

- **Optional chaining user?.profile?.name** ✓
- try/catch jokaisella rivillä
- == null tarkistus riittää aina
- eval JSON.parse

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

API-vastaus voi olla null — `user.profile.name` kaataa. Moderni turvallinen pääsy?

- **user?.profile?.name** ✓
- user.profile.name || '' — riittää nullille
- eval('user.profile.name')
- with(user) { profile.name }

#### `b04-js-types-symbol-iterator` · diff 4

Custom collection-luokka pitää saada toimimaan for...of ja spread-operaattorilla. Mitä implementoit?

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

#### `b05-js-types-nullish-coalescing` · diff 2

API palauttaa `{ count: 0 }` — `value || 10` antaa 10. Oikea oletus vain null/undefined?

- **value ?? 10 — nullish coalescing** ✓
- value || 10 on oikein nollalle
- value == 10
- typeof value || 10

#### `b05-js-types-strict-equality` · diff 2

Code review: `if (status == '200')` — miksi pyydetään muutosta?

- **=== välttää implisiittisen tyyppimuunnoksen (esim. 200 == '200')** ✓
- == on nopeampi tuotannossa
- === toimii vain numeroille
- Vertailu ei tarvitse === koskaan

#### `b06-js-types-in-operator` · diff 2

Code review: 'key' in obj vs obj.hasOwnProperty(key). Milloin in on oikea?

- **in tarkistaa koko prototype ketjun — hasOwn vain oma property** ✓
- in ja hasOwnProperty identtiset
- in on deprecated
- hasOwnProperty tarkistaa prototype

#### `b06-js-types-map-key-object` · diff 3

Objekti avaimena Mapissa — sama key instance löytyy. Miksi ei Object avaimella?

- **Map käyttää SameValueZero — objektiavain on referenssi** ✓
- Object keys stringify automaattisesti Mapissa
- Map ei sallii objektiavaimia
- JSON.stringify tekee avaimet uniikkeja

#### `b06-js-types-temporal-date` · diff 3

Date.parse('01/02/2023') tulos vaihtelee locale:sta. Miten vältät?

- **ISO 8601 format YYYY-MM-DD tai Temporal API** ✓
- Date.parse on aina deterministinen
- Käytä getMonth() korjaamaan
- Timestamp string ilman timezone

#### `b07-js-types-nan` · diff 3

parseInt palauttaa NaN — if (x === NaN) ei toimi. Oikea testi?

- **Number.isNaN(x) — NaN ei ole === itsensä kanssa** ✓
- x == NaN
- typeof x === NaN
- isNaN riittää aina (ei — coerces)

#### `b07-js-types-optional-chain` · diff 2

Cannot read property name of undefined — syvä objektipolku API-vastauksessa. Moderni syntaksi?

- **optional chaining — user?.profile?.name** ✓
- user.profile.name aina
- eval polku
- JSON.parse korjaa

#### `b07-js-types-strict-equality` · diff 2

Bug: `if (!userId)` hylkää validin arvon `0`. Mikä tarkistus on turvallisempi?

- **Eksplisiittinen null/undefined-tarkistus (userId == null) — 0 on validi id** ✓
- !userId on aina oikein
- == null hylkää 0:n
- String(userId) korjaa

#### `b08-js-types-bigint` · diff 3

64-bit ID ylittää Number.MAX_SAFE_INTEGER — JSON API palauttaa ison numeron. Tyyppi?

- **BigInt — 123n tai BigInt(string) — älä sekoita Numberiin ilman tarkistusta** ✓
- parseFloat riittää tarkkuuteen
- Number on aina 64-bit tarkka
- BigInt ei serialisoidu JSON:iin natiivisti

#### `b08-js-types-strict-equals` · diff 2

API hylkää vain `if (token == null) return unauthorized()`. Mikä arvo pääsee läpi virheellisesti?

- **Tyhjä merkkijono `''` — se ei ole `null` eikä `undefined`, joten tarkistus ei laukea** ✓
- `'' == null` on tosi, joten tarkistus toimii
- if(token) hylkää aina tyhjän merkkijonon
- typeof token == null toimii

#### `b08-js-types-symbol-key` · diff 3

Haluat piilottaa objektin sisäisen avaimen for-in loopilta mutta käyttää sitä metodissa. Avaintyyppi?

- **Symbol('internal') — ei enumerable oletuksena** ✓
- string prefix _ riittää aina
- Symbol serialisoituu JSON:iin
- Map vaatii Symbol-avaimia

#### `b09-js-types-bigint-json` · diff 4

API palauttaa 64-bit ID:n — JSON.stringify heittää BigInt:illä. Ratkaisu?

- **Custom replacer tai serialisoi stringiksi — JSON ei tue BigInt natively** ✓
- JSON.stringify tukee BigInt automaattisesti
- Muuta kaikki Number — ei ylittymistä
- eval() parseen

#### `b09-js-types-null-object` · diff 3

Bugi: `typeof null === 'object'`. Turvallinen null-tarkistus?

- **value === null tai value == null (null/undefined)** ✓
- typeof value === 'null'
- value instanceof Object
- Object.isObject(value)

#### `b09-js-types-strict-equality` · diff 2

Code review: `if (userId == 0)` hyväksyy myös tyhjän stringin. Korjaus?

- **Käytä === strict equality — ei type coercion** ✓
- == on turvallisempi ===:aa
- Muuta userId stringiksi
- if (!userId) korvaa vertailun aina

#### `exp-js-types-bigint-json` · diff 4

API palauttaa 64-bit ID:n — JSON.parse menettää tarkkuuden. Miten käsittelet?

- **BigInt tai string ID:nä ennen numeromuunnosta** ✓
- Number riittää aina
- parseFloat korjaa integerit
- JSON tukee BigInt natiivisti

#### `exp-js-types-nullish-coalescing` · diff 2

Config `timeout: 0` korvautuu oletuksella 5000 koska koodi käyttää `||`. Korjaus?

- **?? nullish coalescing — vain null/undefined korvataan** ✓
- == false tarkistus
- eval config-stringistä
- parseInt kaikille arvoille

#### `exp-js-types-strict-equality` · diff 2

Auth-bugi: `if (!token)` hylkää validin tyhjän merkkijonon `''` ja sallii `0`. Turvallisempi tarkistus?

- **Eksplisiittinen validointi: typeof token === 'string' && token.length > 0** ✓
- == riittää aina
- typeof token == 'null'
- Vertaa Object.is everything

#### `js-types-null-object` · diff 3

Miksi `typeof null === 'object'` on historiallinen ansa?

- **Bugi ES-alkuperäisessä esityksessä — käytä === null** ✓
- null on oikeasti objekti
- typeof on poistettu ES6:ssa
- Vain TypeScriptissä ongelma

#### `js-types-strict-eq` · diff 2

Miksi `===` on turvallisempi kuin `==` vertailussa?

- **Ei tee tyyppimuunnosta vertailussa** ✓
- === on aina nopeampi
- == kieltää null-vertailun
- Ei eroa

### js-typescript (1)

#### `prod-js-unknown-vs-any` · diff 4

API palauttaa tuntematonta JSON-dataa TypeScriptissä. Miksi `unknown` on turvallisempi kuin `any`?

- **unknown pakottaa tarkistamaan tai kaventamaan tyypin ennen käyttöä** ✓
- unknown poistaa kaikki runtime-virheet automaattisesti
- any on aina readonly
- unknown kääntyy aina nopeammin kuin any

## linux (140)

### avahi (25)

#### `avahi-mdns` · diff 4

Mitä Avahi tarjoaa lähiverkossa ilman keskitettyä DNS:ää?

- **mDNS/DNS-SD palvelun löytämisen (.local)** ✓
- Vain LDAP-autentikoinnin
- Windows Active Directory -toimialueen
- TLS-terminoinnin nginxille

#### `avahi-service-xml` · diff 5

Haluat julkaista HTTP-palvelun ilman koodimuutosta Avahilla. Minne static service -määrittely?

- **/etc/avahi/services/*.service (XML)** ✓
- /etc/resolv.conf
- Vain D-Bus API — XML ei tuettu
- /etc/systemd/system/avahi.http

#### `b02-linux-avahi-browse-12` · diff 3

Lähiverkossa pitäisi näkyä tulostin — miten listaat Avahi-palvelut terminaalista?

- **avahi-browse -a -r (tai avahi-browse -t _ipp._tcp)** ✓
- ping printer.local aina toimii
- nmap -sP
- systemctl start cups only

#### `b02-linux-avahi-conflict-13` · diff 4

Kaksi konetta ilmoittaa saman `.local`-nimen — palvelu flapping. Syy?

- **Hostname collision mDNS-verkossa — nimet pitää olla uniikit** ✓
- Avahi bugi aina
- DNS cache
- Firewall estää kaiken

#### `b02-linux-avahi-publish-14` · diff 3

Kehität paikallista HTTP-palvelua — haluat sen löytyvän `_http._tcp`. Miten?

- **Avahi service XML / avahi-publish-service tai systemd service with Avahi** ✓
- Kirjoita vain /etc/hosts
- Broadcast UDP manually
- SSH tunnel riittää

#### `b03-linux-avahi-browse-services` · diff 2

Toimistossa pitää löytää paikallinen tulostin ilman IP:tä. Avahi-komento?

- **avahi-browse -a tai -r _ipp._tcp** ✓
- nmap -sS 0.0.0.0/0
- arp-scan internetistä
- Avahi toimii vain Windowsissa

#### `b03-linux-avahi-hostname-local` · diff 3

Kehityskone hostaa API:n osoitteessa devbox.local — toinen kone ei resolvaa. Tarkista?

- **Avahi daemon käynnissä ja nss-mdns / libnss-mdns asennettu** ✓
- Lisää devbox.local public DNS:ään
- .local vaatii aina /etc/hosts kaikilla
- Avahi korvaa DNS:n internetissä

#### `b03-linux-avahi-publish-service` · diff 3

IoT-gateway pitää ilmoittaa HTTP-palvelu lähiverkkoon ilman staattista IP:tä. Ratkaisu?

- **Avahi service file / avahi-publish-service — mDNS ilmoitus** ✓
- Kovakoodaa IP sovellukseen
- Broadcast UDP kaikille porteille
- Avahi vain client, ei publish

#### `b04-linux-avahi-browse` · diff 3

Lähiverkossa pitäisi näkyä mDNS-palvelu mutta se ei löydy. Diagnostiikkakomento?

- **avahi-browse -a tai avahi-browse -rt _http._tcp** ✓
- ping palvelu.local riittää aina
- nmap -sP korvaa mDNS:n
- systemctl stop avahi — nopeampi

#### `b05-linux-avahi-browse` · diff 2

Toimiston tulostin pitäisi löytyä verkosta automaattisesti. Mikä työkalu listaa mDNS-palvelut?

- **avahi-browse -a — kaikki ilmoitetut palvelut** ✓
- ping printer.local riittää diagnostiikkaan
- systemctl status cups
- docker ps | grep avahi

#### `b05-linux-avahi-hostname-conflict` · diff 4

Kaksi konetta ilmoittaa saman `.local`-hostname:n — palvelut vaihtelevat. Mikä on juurisyy?

- **Hostname-konflikti mDNS:ssä — hostnamet täytyy olla uniikit verkossa** ✓
- Avahi ei tue useaa konetta
- Vain DNS-palvelin korjaa konfliktin
- Konflikti johtuu aina palomuurista

#### `b05-linux-avahi-publish-service` · diff 3

Kehityspalvelu portissa 3000 pitäisi löytyä mDNS:llä ilman manuaalista hosts-tiedostoa. Miten?

- **Avahi service definition XML tai avahi-publish-service** ✓
- Lisää 127.0.0.1 kaikille asiakkaille
- Muuta palvelu kuuntelemaan porttia 80
- Poista NetworkManager

#### `b06-linux-avahi-daemon-restart` · diff 2

Uusi .service-tiedosto lisätty — palvelu ei näkyy verkossa. Mitä teet ensin?

- **systemctl reload avahi-daemon tai restart — lataa service definitions** ✓
- Reboot koko palvelin aina
- journalctl --vacuum
- Poista resolv.conf

#### `b06-linux-avahi-resolve-hostname` · diff 2

Tulostin ilmoittaa hostname.local mutta ping epäonnistuu. Miten testaat resoluution?

- **avahi-resolve -n printer.local — mDNS hostname lookup** ✓
- nslookup printer.local aina DNS:llä
- systemctl restart avahi estää ping
- ip route add local

#### `b06-linux-avahi-service-type` · diff 3

Julkaiset sisäisen API:n mDNS:llä kehitysympäristössä. Mitä service type käytät?

- **Määritä service XML:ssä _http._tcp tai sopiva IANA service type** ✓
- _custom._udp aina — type ei merkitse
- Avahi julkaisee ilman service typea
- Käytä vain hostname ilman service recordia

#### `b07-linux-avahi-daemon-check` · diff 3

Lähiverkon palvelut eivät ilmesty — epäilet Avahia. Ensimmäinen tarkistus?

- **systemctl status avahi-daemon — onko palvelu käynnissä** ✓
- reboot heti
- Poista /etc/nsswitch.conf
- curl google.com

#### `b07-linux-avahi-reflector` · diff 4

Docker-kontti julkaisee mDNS-palvelun mutta host ei näe sitä. Tyypillinen syy?

- **mDNS multicast ei ylitä Docker-verkkoa ilman reflector/bridge-asetusta** ✓
- Avahi ei toimi Dockerissa
- Kontti tarvitsee port 80
- Poista .local päätteestä

#### `b07-linux-avahi-resolve` · diff 2

Kehityskone printer.local ei resolvdu. Avahi-työkalu joka testaa nimen?

- **avahi-resolve -n printer.local — mDNS name resolution** ✓
- nslookup printer.local aina toimii
- ping 8.8.8.8
- systemctl stop avahi

#### `b08-linux-avahi-resolve` · diff 3

Kehityskone ei löydä palvelua `printer.local` — mDNS pitäisi toimia. Ensimmäinen tarkistus?

- **avahi-browse -a tai resolve hostname .local — onko palvelu ilmoitettu?** ✓
- Poista avahi-daemon — hidastaa verkkoa
- ping printer.local toimii aina ilman Avahia
- mDNS toimii vain Windowsissa

#### `b09-linux-avahi-browse-resolve` · diff 2

Haluat listata lähiverkon _http._tcp-palvelut terminaalista. Komento?

- **avahi-browse -rt _http._tcp** ✓
- ping _http._tcp.local
- systemctl list-units | grep http
- nmap -sP riittää service discoveryyn

#### `b09-linux-avahi-mdns-troubleshoot` · diff 4

Kehityskone ei löydä kollegan .local-palvelua — sama WiFi. Yleisin syy Linuxilla?

- **avahi-daemon ei pyöri tai firewall estää UDP 5353 multicast** ✓
- mDNS vaatii aina staattisen IP:n
- .local toimii vain Windowsissa
- DNS server puuttuu — mDNS ei toimi ilman sitä

#### `b09-linux-avahi-service-discovery` · diff 3

Lähiverkon tulostin pitäisi löytyä ilman staattista IP:tä. Protokolla?

- **mDNS/Avahi — .local-palvelunimi lähiverkossa** ✓
- Vain DHCP-reservointi skaalautuu
- DNS A-record riittää lähiverkossa aina
- Avahi on vain macOS-ominaisuus

#### `exp-linux-avahi-conflict` · diff 3

Kaksi laitetta claimaa saman hostname.local — verkko sekoaa. Miten Avahi ratkaisee konfliktin?

- **Probing ja rename (esim. hostname-2.local) mDNS-sääntöjen mukaan** ✓
- Ensimmäinen voittaa aina ikuisesti
- Avahi ei tue konflikteja
- Sammuta mDNS kaikilta laitteilta

#### `exp-linux-avahi-printer-discovery` · diff 2

Toimiston tulostin pitäisi löytyä automaattisesti LANissa ilman staattista IP:tä. Mikä protokolla?

- **mDNS / Avahi — .local-palvelun julkaisu** ✓
- Vain DHCP-reservointi kaikille
- FTP broadcast
- SMTP discovery

#### `exp-linux-avahi-service-xml` · diff 4

Haluat julkaista HTTP-palvelun portissa 8080 mDNS:llä. Mihin konfiguraatio kuuluu?

- **/etc/avahi/services/*.service XML (DNS-SD)** ✓
- Vain /etc/hosts rivi
- systemd unit riittää ilman Avahia
- iptables DNAT riittää discoveryyn

### journald (31)

#### `b02-linux-journalctl-boot-05` · diff 2

Palvelu kaatui eilen rebootin jälkeen — miten suodatat lokin tälle bootille?

- **journalctl -b 0 (tai -b ilman argumenttia nykyinen)** ✓
- journalctl --since yesterday vain
- cat /var/log/messages
- dmesg -k

#### `b02-linux-journalctl-unit-06` · diff 2

Haluat vain nginx-palvelun viimeiset virheet. Tehokkain komento?

- **journalctl -u nginx.service -p err -n 50** ✓
- grep nginx /var/log/*
- tail -f /dev/null
- systemctl cat nginx

#### `b02-linux-journald-persist-07` · diff 3

Rebootin jälkeen vanhat lokit katoavat — forensic-tarve. journald-muutos?

- **Storage=persistent /var/log/journal — journald.conf** ✓
- Storage=volatile riittää
- Poista journald
- Rsyslog only

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
- Poista journald kokonaan
- SystemMaxUse=0
- Journal ei tue rate limitingiä

#### `b04-linux-journalctl-boot` · diff 2

Palvelin kaatui yöllä rebootiin — haluat lokit vain viime bootista. journalctl-lippu?

- **journalctl -b tai journalctl -b -1 edelliseen bootiin** ✓
- journalctl --all-time
- dmesg riittää aina
- cat /var/log/boot.log

#### `b04-linux-journalctl-follow` · diff 2

Haluat seurata palvelun lokia reaaliajassa tuotantodebugissa. Mikä komento?

- **journalctl -u palvelu.service -f** ✓
- tail -f /var/log/messages aina
- cat /proc/palvelu/log
- systemctl log palvelu

#### `b04-linux-journalctl-priority-err` · diff 3

Incident: tarvitset vain virhe- ja kriittiset viestit viime tunnilta. journalctl suodatin?

- **journalctl -p err --since '1 hour ago'** ✓
- journalctl | grep ERROR — riittää
- journalctl -q
- Vain dmesg

#### `b04-linux-journald-RateLimit` · diff 4

Bugi tulvittaa journald:n identtisillä virheillä — diagnostiikka vaikeaa. Mitä konfiguroit?

- **RateLimitIntervalSec / RateLimitBurst journald.conf:ssa** ✓
- Poista journald kokonaan
- rm -rf /var/log/journal
- Vain syslog — ei rate limitiä

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

#### `b05-linux-journald-storage-persist` · diff 3

Rebootin jälkeen edellisen bootin lokit katoavat. Mikä journald.conf-asetus korjaa?

- **Storage=persistent — lokit /var/log/journal** ✓
- ForwardToSyslog=no
- MaxLevelStore=debug
- RateLimitInterval=0

#### `b06-linux-journalctl-reverse` · diff 2

Incidentti — tarvitset vanhimmat lokit ensin aikajärjestyksessä. Mitä journalctl-optiota?

- **journalctl -r poistaa reverse — tai oletus ilman -e** ✓
- journalctl --boot=0 aina vanhin ensin
- tail -f /var/log/syslog
- journalctl -f näyttää vain vanhoja

#### `b06-linux-journalctl-verify` · diff 4

Audit vaatii lokien eheyden tarkistuksen. Mitä journalctl tarjoaa?

- **journalctl --verify — tarkistaa journal-tiedostojen integriteetti** ✓
- grep checksum journalissa
- systemctl verify journald
- Lokit ovat aina luotettavia ilman verify

#### `b06-linux-journald-forward-syslog` · diff 3

Legacy syslog-kollektori tarvitsee journal-lokit. Miten journald konfiguroi?

- **ForwardToSyslog=yes journald.conf — lähettää syslogille** ✓
- Kopioi /var/log/journal manuaalisesti
- Poista journald ja käytä vain rsyslog
- systemctl forward-journal komento

#### `b07-linux-journalctl-follow` · diff 2

Debuggaat live-incidenttiä — haluat seurata uusia logirivejä reaaliajassa. journalctl?

- **journalctl -f (follow) — tailaa journalia kuten tail -f** ✓
- journalctl --rotate
- journalctl --vacuum-time=1s
- cat /var/log/syslog

#### `b07-linux-journald-boot` · diff 3

Palvelin reboottasi — haluat edellisen bootin virhelokit. journalctl?

- **journalctl -b -1 — edellisen bootin journal** ✓
- journalctl --since reboot
- dmesg -b
- journalctl ei säilytä booteja

#### `b07-linux-journald-json` · diff 3

Lokit pitää parsia automaattisesti — plain text on hankala. journalctl output-muoto?

- **journalctl -o json tai json-pretty — strukturoitu output** ✓
- journalctl -o binary only
- grep riittää aina
- journalctl ei tue JSONia

#### `b08-linux-journalctl-since` · diff 2

Incidentti alkoi noin klo 14:30 — haluat lokit siitä eteenpäin. Nopein journalctl-filtteri?

- **journalctl --since '2024-01-15 14:30' -u myservice** ✓
- journalctl -f ilman aikarajaa
- cat /var/log/messages
- dmesg | grep 14:30

#### `b08-linux-journalctl-unit` · diff 2

Nginx kaatuu — haluat vain nginx-unitin virheet viime bootista. Komento?

- **journalctl -u nginx -b -p err** ✓
- journalctl ilman -u näyttää vain nginx
- tail /var/log/nginx/error.log aina riittää systemd:ssä
- -b näyttää kaikki bootit kerralla

#### `b08-linux-journald-storage` · diff 3

Levy täyttyy journal-lokeista embedded-laitteessa. Mitä journald.conf-asetusta säädät?

- **SystemMaxUse= tai MaxRetentionSec= — rajoita tilaa/aikaa** ✓
- Storage=volatile poistaa lokituksen kokonaan aina
- journald ei voi rajoittaa kokoa
- rm -rf /var/log/journal riittää pysyvästi

#### `b09-linux-journalctl-follow-live` · diff 2

Seuraat tuotantopalvelun lokia reaaliajassa deployn aikana. Komento?

- **journalctl -u palvelu.service -f** ✓
- tail -f /var/log/syslog aina
- systemctl logs -f
- journalctl --rotate -f

#### `b09-linux-journald-forward-syslog` · diff 3

Keskus-LOKIp palvelin vaatii syslog-formaatin. journald-konfiguraatio?

- **ForwardToSyslog=yes journald.conf:ssa + rsyslog konfiguroitu** ✓
- journald ei tue ulkoista forwardingia
- Kopioi /var/log/journal manuaalisesti
- systemctl export-logs riittää

#### `b09-linux-journald-priority-filter` · diff 3

Incident-haku: tarvitset vain error-tason viestit viimeiseltä bootilta. Suodatin?

- **journalctl -b -p err** ✓
- journalctl --grep ERROR riittää aina
- dmesg -l err
- Priority ei ole journald-kenttä

#### `exp-linux-journalctl-since-boot` · diff 2

Tuotantobugi tapahtui rebootin jälkeen. Miten suodatat vain nykyisen bootin lokit?

- **journalctl -b (tai -b -1 edellinen boot)** ✓
- tail -f /var/log/messages aina
- dmesg --follow riittää kaikkeen
- journalctl ei tue boot-suodatusta

#### `exp-linux-journald-disk-full` · diff 4

Incident: /var/log/journal täyttää levyn ja palvelin ei kirjoita uusia lokeja. Ensimmäinen toimenpide?

- **journalctl --disk-usage ja tarkista SystemMaxUse journald.conf:ssa** ✓
- rm -rf /var/log/* ilman tarkistusta
- Poista journald ja käytä vain syslog
- Osta isompi levy ilman lokien hallintaa

#### `exp-linux-journald-priority-filter` · diff 3

Loki tulvii DEBUG-rivejä. Miten näet vain err-tason ja korkeammat yhdeltä palvelulta?

- **journalctl -u palvelu -p err** ✓
- grep ERROR /dev/null
- systemctl stop journald
- Vain printf palveluun

#### `journalctl-filter` · diff 5

Nginx kaatui viime yönä klo 02–04. Nopein tapa rajata lokit?

- **journalctl -u nginx --since "02:00" --until "04:00"** ✓
- cat /var/log/messages | grep nginx
- dmesg -T aina riittää systemd-palveluille
- systemctl cat nginx

#### `journald-persistent` · diff 4

Rebootin jälkeen vanhat lokit katoavat. Mikä journald-asetus säilyttää ne levyllä?

- **Storage=persistent ja /var/log/journal** ✓
- ForwardToSyslog=no
- SystemMaxUse=1K
- volatile oletuksena riittää aina

#### `journald-priority` · diff 4

Lokitulva tuotannossa. Miten näytät vain virheet ja kriittiset nginx-unitilta?

- **journalctl -u nginx -p err** ✓
- tail -f /var/log/nginx/access.log
- dmesg | grep nginx
- systemctl status --no-pager riittää

### linux-network (41)

#### `b02-linux-network-nmcli-11` · diff 2

Wi-Fi katkeilee — haluat vaihtaa verkko profiilin CLI:stä. Komento?

- **nmcli connection up 'Profile-Name'** ✓
- ifconfig wlan0 up
- route add default
- systemctl restart network

#### `b02-linux-network-resolv-10` · diff 3

Lyhyet hostnamet eivät resolvdu — FQDN toimii. Mikä tiedosto?

- **search/domain -rivit /etc/resolv.conf (tai systemd-resolved)** ✓
- /etc/hosts only
- /etc/nsswitch.conf DNS off
- iptables

#### `b02-linux-network-route-09` · diff 4

VPN-yhteys toimii mutta vain internal IP:t eivät routtaudu. Diagnostiikka?

- **ip route show table all — tarkista policy routing ja oikea interface** ✓
- reboot aina
- Poista default route
- ifdown eth0

#### `b02-linux-network-ss-08` · diff 3

Sovellus sanoo portti 8080 varattu — mikä komento näyttää prosessin joka kuuntelee?

- **ss -tlnp | grep 8080 (tai ss -ulnp UDP)** ✓
- netstat -a riittää aina
- ping localhost
- ifconfig

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
- 127.0.0.53 on aina virheellinen
- Poista resolv.conf — DNS toimii ilman
- Vain /etc/hosts käytössä

#### `b04-linux-ss-tuln` · diff 3

Portti 8080 pitäisi kuunnella mutta palvelu ei vastaa. Mikä komento listaa LISTEN-socketit?

- **ss -tuln tai ss -tlnp** ✓
- lsof — aina root-oikeudet
- ping localhost:8080
- iptables -L riittää

#### `b05-linux-network-ip-route` · diff 3

VPN-yhteys toimii mutta sisäverkon aliverkko on tavoittamaton. Mitä tarkistat ensin?

- **ip route — onko reitti sisäverkkoon oikean gatewayn kautta** ✓
- Vain DNS /etc/hosts
- chmod +x reititin
- systemctl restart avahi

#### `b05-linux-network-nmcli-connect` · diff 2

Wi-Fi katkesi toimistossa. Miten nmcli:llä yhdistät tunnetun profiilin?

- **nmcli connection up 'Office-WiFi'** ✓
- nmcli device delete wlan0
- ifup wlan0 riittää NetworkManagerissa aina
- systemctl restart network

#### `b05-linux-network-resolv-search` · diff 3

Sisäinen hostname `app.internal` ei resolvdu mutta FQDN toimii. Mikä resolv.conf-asetus auttaa?

- **search internal — lyhyet nimet kokeillaan search-domaineissa** ✓
- nameserver 127.0.0.1 riittää aina
- options rotate korjaa searchin
- Poista resolv.conf kokonaan

#### `b05-linux-network-ss-listen` · diff 2

Portti 8080 on jo käytössä — uusi palvelu ei käynnisty. Mikä komento näyttää prosessin?

- **ss -tlnp | grep 8080 — kuuntelevat TCP-portit + prosessi** ✓
- ping localhost 8080
- ifconfig 8080
- netstat on ainoa tapa — ss ei toimi

#### `b06-linux-network-ethtool-offload` · diff 5

Tuotantoverkko — checksum offload aiheuttaa corrupt-paketteja virtuaalisessa NIC:ssä. Mitä työkalu?

- **ethtool -K eth0 tx off rx off — hallitsee offload-ominaisuuksia** ✓
- ip link set eth0 down
- nmcli offload disable
- sysctl -w net.offload=0

#### `b06-linux-network-ip-neigh` · diff 3

Yhteys toimii pingillä mutta ARP-taulu näyttää incomplete. Mitä komento tarkistaa?

- **ip neigh show — ARP/neighbor cache** ✓
- ss -tuln
- nmcli device wifi
- journalctl -k vain

#### `b06-linux-network-resolv-options` · diff 3

DNS-haku hidastuu — haluat rajoittaa retry ja timeout. Missä konfiguroit?

- **options timeout:1 attempts:2 /etc/resolv.conf tai stub resolver** ✓
- systemd.unit TimeoutStartSec DNS:ään
- iptables -t nat
- ss -K reset DNS

#### `b06-linux-network-ss-udp` · diff 2

DNS-palvelu ei vastaa — haluat nähdä UDP-kuuntelijat. Mitä ss-optiota?

- **ss -ulnp — UDP listening sockets ja prosessit** ✓
- ss -tlnp — TCP riittää DNS:ään
- netstat -a deprecated riittää
- ip route show UDP

#### `b07-linux-network-curl-debug` · diff 2

curl palauttaa SSL certificate problem — haluat nähdä TLS-handshaken. curl-lippu?

- **curl -v (verbose) — näyttää handshake ja headerit** ✓
- curl -silent riittää
- curl --get
- wget only

#### `b07-linux-network-dns-dig` · diff 3

Sovellus ei resolvdu mutta ping IP:llä toimii. DNS-diagnostiikka?

- **dig hostname tai nslookup — testaa DNS-vastaus erikseen** ✓
- ping hostname riittää aina
- ip link set up
- restart avahi

#### `b07-linux-network-firewall-nft` · diff 4

Portti 443 auki ulkoapäin vaikka palvelu kuuntelee vain localhostia. Mitä tarkistat?

- **nftables/iptables säännöt — palomuuri voi ohjata liikennettä eri kuin bind** ✓
- Vain ss -tlnp
- SELinux pois riittää
- hostname -f

#### `b07-linux-network-tcpdump` · diff 4

API-kutsu epäonnistuu TLS:n jälkeen — epäilet palomuurin RST-paketteja. Nopein diagnostiikka?

- **tcpdump tai ss -ti porttiin — näet paketit ja resetit** ✓
- ping hostname riittää
- ifconfig up
- reboot palomuuri

#### `b08-linux-network-firewalld` · diff 3

Uusi palvelu portissa 8080 — palomuuri estää ulkoiset yhteydet. firewalld-komento?

- **firewall-cmd --add-port=8080/tcp --permanent && firewall-cmd --reload** ✓
- iptables -F poistaa kaiken suojauksen turvallisesti
- systemctl stop firewalld tuotannossa
- EXPOSE 8080 Dockerfile riittää hostissa

#### `b08-linux-network-nmcli` · diff 2

Palvelimella pitää vaihtaa staattinen IP ilman GUI:ta NetworkManagerilla. Työkalu?

- **nmcli con mod 'Wired' ipv4.addresses ... ipv4.method manual** ✓
- ifconfig eth0 — pysyvä NM-järjestelmässä
- reboot korjaa IP:n automaattisesti
- echo IP > /etc/hosts riittää

#### `b08-linux-network-traceroute` · diff 3

API-viive — epäilet reitityspolkua ulkoiseen palveluun. Perustyökalu polun selvittämiseen?

- **traceroute tai tracepath kohde — näyttää hopit** ✓
- ping riittää reititysanalyysiin
- ifconfig näyttää reitit
- curl -I korvaa tracerouten

#### `b08-linux-resolv-search` · diff 3

Lyhyt hostname 'db' ei resolvdu — FQDN toimii. Mitä /etc/resolv.conf search-kenttä tekee?

- **search lisää domain-suffiksia lyhyille nimille — järjestys tärkeä** ✓
- search määrittää DNS-palvelimen IP:n
- search korvaa /etc/hosts
- search on deprecated — ei vaikuta

#### `b08-linux-ss-listening` · diff 2

Mikä prosessi kuuntelee porttia 5432? Nopein diagnostiikka?

- **ss -tlnp tai ss -ulnp — näyttää listening socketit ja prosessit** ✓
- ping localhost
- netstat on ainoa työkalu
- lsof ilman porttia riittää

#### `b09-linux-net-firewall-cmd` · diff 3

Uusi palvelu portissa 8443 — firewalld estää ulkoiset yhteydet. Pysyvä aukko?

- **firewall-cmd --add-port=8443/tcp --permanent && firewall-cmd --reload** ✓
- iptables -F — tyhjennä kaikki säännöt
- systemctl stop firewalld tuotannossa
- Portti aukeaa automaattisesti kun palvelu käynnistyy

#### `b09-linux-net-nat-troubleshoot` · diff 4

Kontti saavuttaa hostin mutta ei internetiä — epäilet NAT:ia. Tarkistus?

- **iptables/nftables NAT-säännöt ja IP forwarding (sysctl net.ipv4.ip_forward)** ✓
- Vain DNS on syy — ping IP:llä riittää
- NAT toimii automaattisesti kaikissa distroissa
- ifconfig up korjaa NAT:in

#### `b09-linux-net-ss-listen` · diff 2

Portti 8080 on varattu mutta et tiedä mikä prosessi kuuntelee. Moderni työkalu?

- **ss -tlnp | grep 8080 — näyttää listenerit ja prosessit** ✓
- ping localhost 8080
- ifconfig näyttää portit
- netstat on ainoa vaihtoehto

#### `b09-linux-net-tcpdump-incident` · diff 4

API-kutsu timeoutaa tuotannossa — epäilet pakettihäviötä. Nopea kaappaus?

- **tcpdump -i eth0 host api.example.com -w capture.pcap** ✓
- curl api.example.com korjaa verkon
- iptables -F ratkaisee timeoutin
- tcpdump vaatii aina GUI:n

#### `exp-linux-network-nmcli-down` · diff 3

Wi-Fi profiili jää roikkuun VPN-konfigin jälkeen. Miten NetworkManagerilla palautat yhteyden?

- **nmcli connection down/up tai nmcli device reapply** ✓
- Muokkaa /etc/resolv.conf käsin aina
- Poista NetworkManager kokonaan
- ifdown eth0 riittää kaikille

#### `exp-linux-network-resolv-search` · diff 4

Sisäinen palvelu `db.local` ei resolvdu mutta `db.local.corp` toimii. Mitä resolv.conf search-kenttä tekee?

- **Lisää search-domainit lyhyille hostnameille DNS-kyselyihin** ✓
- Määrittää oletusgatewayn
- Korvaa /etc/hosts aina
- Estää kaikki ulkoiset DNS-kyselyt

#### `exp-linux-network-route-missing` · diff 4

Kontti-host ei reachaa 10.20.0.0/16 VPN-verkkoa. ip route näyttää oletusyhteyden mutta ei VPN-reittiä. Mitä tarkistat?

- **ip route get 10.20.0.1 ja oikea gateway/interface VPN:lle** ✓
- Vain ping 8.8.8.8
- Poista default route
- ifconfig on ainoa työkalu

#### `exp-linux-network-ss-listen` · diff 3

Portti 8080 on jo käytössä deploy epäonnistuu. Mikä komento näyttää mikä prosessi kuuntelee?

- **ss -tlnp | grep 8080 (tai ss -ulnp UDP:lle)** ✓
- netstat -a ilman prosessitietoa
- lsof vain tiedostoille
- reboot palvelin

#### `linux-ip-route` · diff 4

Palvelin ei pääse ulos verkon 10.0.0.0/8 ulkopuolelle, mutta pingaa gatewayn. Mikä todennäköisin puuttuu?

- **Oletusreitti (default route) tai NAT/firewall** ✓
- Väärä MAC-osoite loopbackissa
- /etc/hosts puuttuu
- DNS on ainoa syy

#### `linux-nmcli` · diff 5

NetworkManager hallitsee interfacea. Miten aktivoit profiilin `corp-wifi` CLI:stä?

- **nmcli connection up corp-wifi** ✓
- ifconfig corp-wifi up
- systemctl start corp-wifi
- ip link set corp-wifi

#### `linux-resolv-search` · diff 4

Kontti/resolvoi `db` mutta ei `db.corp.local`. Mitä tiedostoa tarkistat ensin?

- **/etc/resolv.conf (nameserver, search/domain)** ✓
- /etc/fstab
- /etc/shadow
- Vain /etc/hosts — DNS ei vaikuta

#### `linux-ss-listen` · diff 3

Mikä prosessi kuuntelee porttia 8080? Nopein moderni komento?

- **ss -tlnp | grep 8080** ✓
- ping localhost
- cat /etc/services
- ifconfig -a

### systemd (43)

#### `b02-linux-systemd-env-04` · diff 4

Palvelu tarvitsee API-avaimen — kovakoodattu unit-tiedostoon. Turvallisempi systemd-tapa?

- **EnvironmentFile=-/etc/myapp/env tai credentials drop-in** ✓
- ExecStart=echo $KEY
- Hardcode Environment= avain unitissa gitissä
- export shell-profiilissa

#### `b02-linux-systemd-failure-02` · diff 3

Palvelu crashaa loopissa — loki täyttyy. Miten rajoitat uudelleenkäynnistyksiä?

- **Unit-tiedostossa StartLimitIntervalSec + StartLimitBurst tai Restart=on-failure huolellisesti** ✓
- Restart=always ilman rajaa
- Poista Restart
- kill -9 init

#### `b02-linux-systemd-timer-03` · diff 3

Cron-työ pitää siirtää systemd:ään — tarvitaan ajastus + service. Mitä luot?

- **timer.unit + service.unit — timer triggeröi servicen** ✓
- Vain service ilman timeria
- target.unit riittää
- socket.unit ajastukseen

#### `b02-linux-systemd-unit-01` · diff 2

Palvelu ei käynnisty bootissa vaikka `systemctl start` toimii. Mitä unohdettiin?

- **systemctl enable palvelu — luo wanted-by symlink** ✓
- systemctl restart riittää
- chmod +x riittää bootiin
- journalctl --boot

#### `b03-linux-systemd-analyze-blame` · diff 3

Palvelin käynnistyy hitaasti tuotantoon noston jälkeen. Mikä systemd-komento paikantaa hitaat unitit?

- **systemd-analyze blame — näyttää unit-kohtaiset viiveet** ✓
- systemctl restart --all
- journalctl -k vain
- kill -9 init

#### `b03-linux-systemd-env-file` · diff 2

Salaisuudet ovat suoraan unit-tiedostossa gitissä. Miten systemd hoitaa ympäristön?

- **EnvironmentFile=/etc/app/env — erillinen tiedosto oikeuksilla 600** ✓
- Environment=SECRET=hardcoded unitissa
- Export muuttujat .bashrc:stä palvelulle
- systemd ei tue ympäristömuuttujia

#### `b03-linux-systemd-restart-burst` · diff 3

Bugi aiheuttaa crash loopin — palvelu käynnistyy uudelleen 500 kertaa minuutissa. Mitä säädät?

- **StartLimitIntervalSec / StartLimitBurst — rajoita uudelleenkäynnistyksiä** ✓
- Restart=always ilman rajoja
- Poista Restart kokonaan
- KillMode=none

#### `b03-linux-systemd-type-notify` · diff 4

CI merkitsee palvelun valmiiksi heti kun prosessi käynnistyy, mutta se kuuntelee porttia vasta 30 s myöhemmin. Unit-tyyppi?

- **Type=notify — palvelu ilmoittaa sd_notify:llä kun valmis** ✓
- Type=simple riittää aina
- Type=idle nopeuttaa bootia
- Type=forking pakollinen kaikille

#### `b04-linux-systemd-ExecStartPre` · diff 3

Palvelu käynnistyy ennen kuin tietokanta on valmis — yhteys epäonnistuu. Mitä unit-tiedostoon?

- **ExecStartPre=/bin/sh -c 'until pg_isready; do sleep 1; done' tai After=postgresql.service** ✓
- Restart=no — ei yritä uudestaan
- Type=oneshot aina
- Poista ExecStart

#### `b04-linux-systemd-mask` · diff 3

Vanha palvelu käynnistyy uudestaan päivityksen jälkeen vaikka disable tehtiin. Miten estät pysyvästi?

- **systemctl mask palvelu.service — estää käynnistyksen symlinkillä /dev/null** ✓
- chmod 000 unit-tiedosto riittää
- disable ja reboot riittää aina
- Poista binary — systemd lopettaa

#### `b04-linux-systemd-override` · diff 3

Haluat muuttaa vain yhden Environment-rivin vendor unitiin ilman tiedoston kopioimista. Tapaa?

- **systemctl edit palvelu.service — drop-in override hakemistoon** ✓
- Muokkaa suoraan /usr/lib/systemd/system/
- sed unit-tiedostoon päivityksen yhteydessä
- export env ennen systemctl start

#### `b04-linux-systemd-PartOf` · diff 4

Kun `web.target` pysähtyy, worker-prosessit jäävät roikkumaan. Miten sidot workerit targetiin?

- **PartOf=web.target — worker pysähtyy kun target pysähtyy** ✓
- Wants= riittää aina samaan
- KillMode=none
- Ignore target — erilliset unitit

#### `b04-linux-systemd-user-unit` · diff 3

Kehittäjä haluaa ajaa daemonin ilman root-oikeuksia login-sessionissa. Minne unit-tiedosto?

- **~/.config/systemd/user/palvelu.service + systemctl --user enable** ✓
- /etc/systemd/system/ aina
- crontab @reboot riittää
- /etc/init.d/ vanha tapa

#### `b05-linux-systemd-exec-reload` · diff 3

Config muuttui — haluat ladata palvelun ilman katkoa. Mitä eroa on reload ja restart?

- **ExecReload ajaa määritellyn komennon — palvelu voi jatkaa pyyntöjä** ✓
- reload ja restart ovat identtiset
- reload vaatii aina rebootin
- Vain systemctl restart on tuettu

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
- Type=oneshot aina
- Type=simple estää riippuvuudet
- Type=idle riittää tuotantoon

#### `b06-linux-systemd-ConditionPath` · diff 4

Backup-skripti ajetaan vain jos mount on käytettävissä. Miten unit ehto?

- **ConditionPathIsMountPoint=/backup — unit ei käynnistyy ilman mountia** ✓
- After=backup.mount riittää aina
- ExecStartPre=test -d ilman Condition
- WantedBy=multi-user.target ehto mountille

#### `b06-linux-systemd-LimitsNOFILE` · diff 4

Palvelu saa 'too many open files' tuotannossa. Miten nostat rajan systemd-unitissa?

- **LimitNOFILE=65535 service unitin [Service]-osassa** ✓
- ulimit vain shell-skriptissä ennen exec
- Restart=on-failure korjaa file limit
- Type=notify nostaa automaattisesti NOFILE

#### `b06-linux-systemd-logind` · diff 3

Palvelu tarvitsee pysyvän session ilman interaktiivista loginia. Mitä komponentti hallinnoi?

- **systemd-logind — sessionit ja seat-hallinta** ✓
- cron hallinnoi kaikki sessionit
- journald luo session automaattisesti
- sshd korvaa logind palveluille

#### `b06-linux-systemd-Requires` · diff 3

App unit käynnistyy ennen tietokantaa — yhteys epäonnistuu. Miten pakotat järjestys?

- **Requires= tai After= db.service unitissa — riippuvuus käynnistyksessä** ✓
- Restart=always korvaa riippuvuuden
- Type=simple riittää aina
- sleep 30 ExecStartPre:ssä on standardiratkaisu

#### `b07-linux-systemd-journal-unit` · diff 2

Palvelu kirjoittaa stdoutiin mutta lokit eivät näy journalctl -u myapp. Todennäköisin syy?

- **Palvelu ei ole systemd-hallinnassa tai StandardOutput ei ohjaa journaliin** ✓
- journald on pois päältä aina
- stdout ei voi mennä journaliin
- Tarvitaan erillinen syslog-ng

#### `b07-linux-systemd-limit-nofile` · diff 4

High-traffic palvelu saa Too many open files — ulimit ok login-shellissa. Missä korjaat systemd-palvelulle?

- **LimitNOFILE= service unitissa — systemd asettaa rajat prosessille** ✓
- /etc/security/limits.conf riittää aina systemd:lle
- sysctl -w fs.file-max
- chmod 777 /proc

#### `b07-linux-systemd-restart-policy` · diff 3

Palvelu kaatuu satunnaisesti yöllä — aamulla se on alhaalla. Mikä Restart= arvo nostaa sen automaattisesti?

- **Restart=on-failure tai Restart=always — systemd käynnistää uudelleen** ✓
- Restart=no on tuotanto-default
- Type=notify korvaa restartin
- KillMode=process estää restartin

#### `b07-linux-systemd-wantedby` · diff 3

Uusi service unit ei käynnisty bootissa vaikka enabled näyttää ok. Mitä [Install]-osiosta puuttuu?

- **WantedBy=multi-user.target (tai vastaava target) — linkittää unitin boot-targetiin** ✓
- After=network.target riittää
- Type=simple korvaa WantedBy
- ExecStart=/bin/true riittää

#### `b08-linux-systemd-logind` · diff 4

SSH-istunto katkeaa mutta prosessi tapetaan logoutissa — haluat pitää jobin elossa. Mitä?

- **systemd-run --user scope tai tmux/screen — logind KillUserProcesses** ✓
- nohup riittää aina systemd-logindissä
- logind ei voi tappaa prosesseja
- Disable systemd-logind tuotannossa

#### `b08-linux-systemd-requires` · diff 4

App service pitää käynnistyä vain jos network-online.target on valmis. Unit-riippuvuus?

- **After=network-online.target + Wants=network-online.target (tai Requires=)** ✓
- Before=network.target riittää
- ExecStartPre=ping google.com korvaa targetin
- Type=notify luo verkkoyhteyden

#### `b08-linux-systemd-restart-policy` · diff 3

Palvelu kaatuu satunnaisesti — haluat systemd:n käynnistävän sen uudelleen. Mitä unit-tiedostoon?

- **Restart=on-failure tai always + StartLimitBurst/Interval** ✓
- Type=forking korjaa kaatumiset
- Restart ei ole systemd:ssä tuettu
- cron @reboot riittää aina

#### `b08-linux-systemd-timer` · diff 3

Cron-korvaus: backup ajastus systemd:llä. Mitä tarvitset?

- **.timer unit + .service unit — OnCalendar= ajastuksessa** ✓
- Vain service ilman timeria riittää ajastukseen
- systemd ei tue ajastuksia
- at-komento on aina parempi

#### `b08-linux-systemd-wantedby` · diff 2

Uusi service-unit ei käynnisty bootissa vaikka enabled. Install-osiossa puuttuu?

- **WantedBy=multi-user.target (tai oikea target) — enable luo symlinkin** ✓
- After=network.target riittää enableen
- ExecStart riittää boot-käynnistykseen
- systemctl start tekee automaattisesti enable

#### `b09-linux-systemd-after-before` · diff 3

App käynnistyy ennen verkkoa — DNS lookup epäonnistuu bootissa. Unit-riippuvuus?

- **After=network-online.target + Wants=network-online.target** ✓
- Before=network.target riittää
- Requires=multi-user.target
- Riippuvuudet eivät vaikuta boot-järjestykseen

#### `b09-linux-systemd-kill-mode` · diff 4

Palvelu spawnnaa child-prosesseja — stop jättää zombie-prosesseja. KillMode-korjaus?

- **KillMode=control-group — tappaa koko cgroupin prosessit** ✓
- KillMode=process riittää aina
- SIGKILL ensin aina
- RemainAfterExit=yes korjaa childit

#### `b09-linux-systemd-memory-limit` · diff 4

Muistivuoto täyttää koko palvelimen — haluat rajoittaa yhden unitin RAM-käytön. Mitä lisäät unit-tiedostoon?

- **MemoryMax= tai MemoryHigh= — cgroup-raja systemd:n kautta** ✓
- Nice=-20 priorisoi muistia
- LimitCORE=infinity
- OOM-killer ei koske systemd-palveluja

#### `b09-linux-systemd-restart-policy` · diff 3

Palvelu kaatuu satunnaisesti yöllä — haluat automaattisen uudelleenkäynnistyksen rajoitetusti. Asetus?

- **Restart=on-failure + StartLimitIntervalSec/StartLimitBurst** ✓
- Restart=always ilman rajoja — riittää
- Type=simple estää kaatumiset
- KillMode=process korvaa restart-politiikan

#### `exp-linux-systemd-failed-service` · diff 3

Tuotantopalvelu on failed-tilassa rebootin jälkeen. Mikä komento näyttää miksi yksikkö kaatui?

- **systemctl status palvelu.service ja journalctl -u palvelu -b** ✓
- kill -9 kaikille prosesseille
- rm /etc/systemd/system/palvelu.service
- reboot uudestaan ilman logeja

#### `exp-linux-systemd-reload-vs-restart` · diff 3

Muutit nginx unit-tiedoston ExecStart-rivin. Mitä teet ennen kuin uusi konfiguraatio on voimassa?

- **systemctl daemon-reload && systemctl restart nginx** ✓
- Vain systemctl restart — reload ei tarvita
- daemon-reload riittää — prosessi lataa automaattisesti
- Muokkaa /proc suoraan

#### `exp-linux-systemd-timer-incident` · diff 3

Yöllinen backup-skripti ei ajautunut cronin sijaan. Miten systemd-timer korvaa crontabin?

- **Timer-yksikkö + service-yksikkö (OnCalendar=)** ✓
- Vain .service ilman timeria riittää
- systemd ei tue ajastettuja tehtäviä
- at-komento aina parempi

#### `exp-linux-systemd-wants-vs-requires` · diff 4

App.service riippuu tietokannasta. DB kaatuu — haluat appin pysähtyvän. Mikä riippuvuus?

- **Requires=db.service — kova riippuvuus** ✓
- Wants=db.service — app jatkaa vaikka DB kuolee
- After=db.service riittää aina
- Ei riippuvuuksia — systemd arvailee

#### `systemd-after-before` · diff 4

Unit A tarvitsee verkon ennen käynnistystä mutta ei saa kaatua jos B epäonnistuu. Mikä riippuvuus?

- **After=network-online.target (ei Requires)** ✓
- Requires=B aina
- Before=B riittää
- Ei systemd-riippuvuuksia

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

- **A pysähtyy / epäonnistuu — Requires on kova riippuvuus** ✓
- A jatkaa — Wants ja Requires ovat sama asia
- Vain Requisite estää käynnistyksen
- systemd käynnistää A uudelleen loputtomasti

## postgres (142)

### pg-config (33)

#### `b02-pg-config-connections-15` · diff 3

500 microservice instanssia × 10 connection = pool explosion. Ratkaisu?

- **Connection pooler (PgBouncer) + alenna max_connections tarpeen mukaan** ✓
- max_connections=100000
- Jokainen app suoraan superuser
- Poista idle timeout

#### `b02-pg-config-shared-14` · diff 3

PostgreSQL cache hit ratio matala — ensimmäinen muistiparametri tarkistaa?

- **shared_buffers (tyypillisesti ~25% RAM, testaa)** ✓
- work_mem=8GB globaalisti
- fsync=off tuotannossa
- random_page_cost=0

#### `b02-pg-config-work-mem-13` · diff 4

Iso sort/hash join spillaa diskiin — logissa 'temporary file'. Parametri?

- **Kasvata work_mem (session/query tasolla harkiten)** ✓
- shared_buffers=0
- max_connections=10000
- Poista sort

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

#### `b04-pg-config-effective-cache` · diff 3

Planner aliarvioi index scan hyödyn — effective_cache_size on default 4GB mutta RAM 64GB. Vaikutus?

- **Nosta effective_cache_size ~ OS cache + shared_buffers arvio — planner suosii indeksejä** ✓
- effective_cache_size varaa RAM:ia PostgreSQLille
- Parametri ei vaikuta suunnitteluun
- Aseta 0 nopeimpaan

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

#### `b05-pg-config-log-min-duration` · diff 3

Haluat lokittaa vain > 500ms kestävät queryt tuotannossa. Mikä GUC?

- **log_min_duration_statement = 500ms** ✓
- log_statement = all
- log_connections = on
- logging_collector = off

#### `b05-pg-config-shared-buffers` · diff 3

16 GB RAM palvelin — shared_buffers on 128MB oletus. Tyypillinen lähtösuositus?

- **Noin 25 % RAM:sta (esim. 4 GB) — aloitus, säädä mittauksilla** ✓
- 90 % RAM shared_buffers
- 128 MB riittää aina
- shared_buffers ei vaikuta cacheen

#### `b05-pg-config-work-mem-sort` · diff 4

Monimutkainen sort overflowaa levylle — temp files kasvavat. Mikä parametri vaikuttaa sort-muistiin per operaatio?

- **work_mem — per sort/hash operaatio (kerro max_connections)** ✓
- shared_buffers korjaa sortin
- maintenance_work_mem sort-queryille
- wal_buffers sort-muistille

#### `b06-pg-config-checkpoint-timeout` · diff 3

Tuotanto I/O spike joka 5 min — checkpoint aiheuttaa. Mitä säätät?

- **checkpoint_timeout ja max_wal_size — spread checkpoint I/O** ✓
- fsync = off tuotannossa
- wal_level minimal
- Checkpoint ei vaikuta I/O

#### `b06-pg-config-huge-pages` · diff 5

Suuri shared_buffers — TLB miss hidastaa. Mitä Linux + PostgreSQL optimointi?

- **huge_pages = try/on — vähentää TLB pressure** ✓
- shared_buffers = 1MB
- swapiness 100
- huge pages vain application level

#### `b06-pg-config-parallel-workers` · diff 3

Raporttikysely ei parallelize — seq scan yksin. Mitä parametria nostat?

- **max_parallel_workers_per_gather ja max_parallel_workers** ✓
- max_connections
- wal_level
- Parallel query ei PostgreSQLissa

#### `b06-pg-config-track-io-timing` · diff 4

pg_stat_statements näyttää query time mutta ei I/O breakdown. Mitä enable?

- **track_io_timing = on — timing I/O operations** ✓
- log_statement = all
- shared_preload_libraries = plpgsql
- I/O timing automaattinen

#### `b06-pg-locks-advisory` · diff 4

App-tason mutex kahden workerin välillä — ei taululock. Mitä PostgreSQL tarjoaa?

- **pg_advisory_lock / pg_try_advisory_lock — application locks** ✓
- SELECT FOR UPDATE ilman taulua
- UNLOGGED table mutex
- Advisory locks vain extension

#### `b07-pg-config-log-slow` · diff 2

Haluat lokittaa hitaat queryt tuotannossa. postgresql.conf?

- **log_min_duration_statement = esim. 1000ms** ✓
- log_statement=all ikuisesti prodissa
- Poista logging
- EXPLAIN jokaisessa requestissa

#### `b07-pg-config-shared-buffers` · diff 3

Uusi DB-palvelin 32 GB RAM — shared_buffers oletuksessa. Tyypillinen lähtöarvo?

- **Noin 25 % RAM — esim. 8 GB, testaa workloadilla** ✓
- 100 % RAM shared_buffers
- 128 MB aina
- shared_buffers ei vaikuta

#### `b07-pg-config-work-mem` · diff 4

Monimutkainen sort spillaa diskiin — logissa temporary file. Mitä nostat?

- **work_mem — sort/hash muistia per operation (varovasti)** ✓
- max_connections 10000
- random_page_cost 0
- Poista sort

#### `b08-pg-config-checkpoint` · diff 4

IO-spike joka 5 min — checkpoint_completion_target ja checkpoint_timeout. Tavoite?

- **Levitä checkpoint I/O — completion_target lähelle 0.9, säätö timeout/max_wal** ✓
- checkpoint_timeout=1s nopeuttaa
- Checkpoint ei aiheuta I/O:ta
- fsync=off tuotantoon

#### `b08-pg-config-max-connections` · diff 3

Sovellus avaa 500 suoraa PG-yhteyttä — CPU context switch helvetti. Arkkitehtuurikorjaus?

- **Connection pooler (PgBouncer) — max_connections kohtuulliseksi** ✓
- Nosta max_connections=10000
- Jokainen microservice oma connection storm
- Pooler korvaa PostgreSQL:n

#### `b08-pg-config-shared-buffers` · diff 3

Uusi dedicated DB-palvelin 32 GB RAM — shared_buffers alussa oletus. Tyypillinen lähtöarvo?

- **Noin 25% RAM — esim. 8GB, testaa ja mittaa** ✓
- 100% RAM shared_buffers
- shared_buffers ei vaikuta
- 128 MB aina riittää

#### `b08-pg-config-work-mem` · diff 4

Monimutkainen sort/hash query spillaa diskiin — temp files kasvavat. Parametri?

- **work_mem — sort/hash muistia per operaatio (× concurrent ops)** ✓
- maintenance_work_mem sort queryihin
- work_mem = total RAM
- temp_file_limit=0 nopeuttaa

#### `b09-pg-config-pgbouncer-pool` · diff 3

500 microservice-instanssia avaa oman PG-yhteyden — `too many connections`. Ratkaisu?

- **PgBouncer connection pooling — transaction/session pool** ✓
- max_connections=10000
- Jokainen instanssi oma PostgreSQL
- Persistent connections estävät poolauksen

#### `b09-pg-config-shared-buffers` · diff 3

Uusi DB-palvelin 32 GB RAM — DBA säätää shared_buffers. Tyypillinen lähtöarvo?

- **Noin 25 % RAM — PostgreSQL wiki tuning, mutta mitataan workloadilla** ✓
- 90 % RAM shared_buffers — maksimi cache
- 128 MB riittää aina
- shared_buffers korvaa OS pagecachen

#### `b09-pg-config-work-mem` · diff 4

Monimutkaiset sort/hash JOINit spillaa diskiin — temp files kasvaa. Parametri?

- **work_mem — muistia sort/hash-operaatioille per operaatio** ✓
- maintenance_work_mem korjaa query sortin
- max_connections pienemmäksi
- temp_file_limit=0 estää spillin

#### `b10-pg-config-shared-buffers-01` · diff 4

PostgreSQL cache hit ratio on matala 32 GB RAM -palvelimella. Ensimmäinen konfiguraatiomuutos?

- **Kasvata shared_buffers maltillisesti (esim. 25 % RAM, katso docs)** ✓
- Aseta shared_buffers = 100 % RAM
- Poista checkpointit
- Vain REINDEX kaikille tauluille

#### `exp-pg-config-max-connections` · diff 3

App avaa 5000 connectionia microservice-arkkitehtuurissa — CPU context switch helvetti. Ratkaisu?

- **Connection pooler (PgBouncer) + kohtuullinen max_connections** ✓
- Nosta max_connections = 10000
- Jokainen request oma server process ilman poolia
- Poista idle timeout

#### `exp-pg-config-shared-buffers` · diff 3

Uusi DB-palvelin 32 GB RAM — junior asettaa shared_buffers = 32GB. Miksi väärin?

- **Liian suuri — tyypillisesti ~25 % RAM, OS cache tarvitsee tilaa** ✓
- shared_buffers max 128 MB
- shared_buffers = 0 paras
- PostgreSQL ei käytä shared_buffers

#### `exp-pg-config-work-mem-sort` · diff 4

EXPLAIN näyttää Sort → Disk temp file — muistisortti ei mahdu. Mikä GUC auttaa?

- **work_mem (session/query kohtainen — varovasti globaalisti)** ✓
- maintenance_work_mem query runtimeen
- wal_buffers sorttiin
- random_page_cost = 0

#### `pg-config-work-mem` · diff 4

Raskas ORDER BY + hash join spillaavat levylle. Mikä istuntotason asetus auttaa ensin?

- **Kasvata work_mem (harkiten — per operaatio)** ✓
- Pienennä shared_buffers aina
- max_connections = 10000
- Poista indeksit nopeuttaaksesi

### pg-explain (37)

#### `b02-pg-explain-analyze-05` · diff 3

Query hidas tuotannossa — haluat todelliset ajat ei arvion. Komento?

- **EXPLAIN (ANALYZE, BUFFERS) SELECT ...** ✓
- EXPLAIN ilman ANALYZE riittää aina
- SELECT * only
- pg_dump

#### `b02-pg-explain-nested-07` · diff 4

Nested Loop + Seq Scan sisäpuolella miljoona kertaa — tyypillinen fix?

- **Indeksi join/where sarakkeille tai muuta join järjestystä / statistics** ✓
- SET enable_nestloop=off aina
- Lisää RAM only
- Poista JOIN

#### `b02-pg-explain-seq-06` · diff 3

EXPLAIN näyttää Seq Scan 5M rivin taulussa — aina huono?

- **Ei — pieni osuma tai suuri fraction voi olla halvempi kuin random index scan** ✓
- Seq Scan aina korjattava
- Seq Scan = bugi
- Rebuild DB

#### `b02-pg-explain-stats-08` · diff 3

Planner arvioi 100 riviä — todellisuudessa 100000. Ensimmäinen toimenpide?

- **ANALYZE table_name — päivitä statistics** ✓
- REINDEX DATABASE
- random_page_cost=0
- Poista WHERE

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

#### `b04-pg-explain-buffers-io` · diff 4

EXPLAIN ANALYZE näyttää korkean execution timen mutta ei kerro onko hitto disk I/O. Lisälippu?

- **EXPLAIN (ANALYZE, BUFFERS) — shared/local hit vs read** ✓
- EXPLAIN VERBOSE riittää aina
- SET log_statement = all
- pg_stat_activity riittää query planiin

#### `b04-pg-explain-cost-settings` · diff 4

SSD-levyllä planner suosii seq scaneja liikaa — random_page_cost oletus 4.0. Tyypillinen SSD-säätö?

- **Laske random_page_cost lähemmäs seq_page_cost (esim. 1.1–1.5)** ✓
- Nosta random_page_cost 10:een
- Cost parametrit eivät vaikuta
- Poista indeksit SSD:llä

#### `b04-pg-explain-index-only` · diff 4

EXPLAIN näyttää Index Scan mutta ei Index Only Scan — mitä puuttuu usein?

- **Visibility map ei ajan tasalla — VACUUM tarvitaan tai query tarvitsee muita sarakkeita** ✓
- Index Only Scan on deprecated
- B-tree ei tue index only
- Seq scan aina nopeampi

#### `b04-pg-explain-parallel` · diff 4

Iso aggregation ei käytä parallel workers vaikka max_parallel_workers_per_gather > 0. Tarkista ensin?

- **Onko kysely parallel safe — EXPLAIN näyttaa Gather; tarkista parallel_setup_cost ja table size** ✓
- Parallel on aina päällä automaattisesti
- Vain REINDEX käyttää parallelia
- max_connections estää parallelin

#### `b05-pg-explain-analyze-buffers` · diff 4

Query hidas — epäilet levylukemista cache-missin vuoksi. Mitä EXPLAIN-lippua lisäät?

- **EXPLAIN (ANALYZE, BUFFERS) — shared/local block hits** ✓
- EXPLAIN ilman ANALYZE riittää I/O-analyysiin
- SELECT pg_sleep(1)
- VACUUM FULL ennen EXPLAIN

#### `b05-pg-explain-hash-join` · diff 3

EXPLAIN näyttää Hash Join kahden ison taulun välillä — muisti loppuu. Vaihtoehto?

- **Nested Loop voi valita planner jos toinen taulu pieni + indeksi — tai kasvata work_mem** ✓
- Hash Join on ainoa vaihtoehto
- SET enable_hashjoin=off riittää aina
- Seq scan molemmissa on aina parempi

#### `b05-pg-explain-index-only-scan` · diff 4

EXPLAIN: Index Scan + Heap Fetches jokaiselle riville. Miten saat Index Only Scan?

- **Covering index (INCLUDE) + VACUUM pitää visibility map ajan tasalla** ✓
- SET enable_indexscan=off
- Seq scan on aina nopeampi
- Index Only Scan ei vaadi VACUUMia

#### `b05-pg-explain-stats-stale` · diff 3

Planner valitsee seq scan vaikka indeksi on olemassa — ANALYZE ajettu kuukausi sitten. Korjaus?

- **ANALYZE taulu — päivitä planner-statistiikka** ✓
- DROP INDEX ja luo uudelleen aina
- REINDEX korvaa ANALYZEn
- Planner ei käytä statistiikkaa

#### `b06-pg-explain-generic-plan` · diff 4

Prepared statement plan on hidas eri parametreilla. Miten näet generic plan?

- **EXPLAIN (GENERIC_PLAN) — plan ilman parameter values** ✓
- EXPLAIN ilman ANALYZE riittää
- DEALLOCATE kaikki
- Generic plan ei PostgreSQLissa

#### `b06-pg-explain-misestimate-rows` · diff 4

Planner valitsee seq scan — rows estimate 10 mutta actual 10M. Juurisyy?

- **Vanhentuneet statistics — ANALYZE tai extended stats** ✓
- Seq scan aina planner bug
- Index puuttuu aina
- work_mem liian korkea

#### `b06-pg-explain-wal-fpi` · diff 5

EXPLAIN (ANALYZE, BUFFERS) näyttää korkeat shared_blks_read. Mitä WAL/FPI tarkoittaa?

- **Full page images WAL — checkpoint ja write amplification** ✓
- shared_blks_read on cache hit
- FPI ei vaikuta I/O
- BUFFERS näyttää vain CPU

#### `b07-pg-explain-analyze-buffers` · diff 4

Query hidas — EXPLAIN näyttää Seq Scan mutta et tiedä onko cache-osuma. Parempi komento?

- **EXPLAIN (ANALYZE, BUFFERS) — todelliset ajat + buffer hits** ✓
- EXPLAIN ilman ANALYZE riittää aina
- SELECT pg_sleep
- VACUUM FULL

#### `b07-pg-explain-nested-loop` · diff 4

Nested Loop cost 500000 — pieni taulu ison kanssa ilman indeksiä. Korjaus?

- **Indeksi join-sarakkeeseen — planner voi vaihtaa hash/merge joiniin** ✓
- Lisää LIMIT
- Poista JOIN
- Nested loop on aina paras

#### `b07-pg-explain-prepare` · diff 3

Sovellus ajaa saman SQL:n parametreilla miljoonia kertoja — parse overhead. Ratkaisu?

- **Prepared statements — parse once, execute many** ✓
- String concat SQL aina
- Poista parametrit
- EXPLAIN joka kerta

#### `b07-pg-explain-seq-vs-index` · diff 3

Planner valitsee Seq Scan vaikka indeksi on olemassa. Yleisin syy pienellä taululla?

- **Taulu pieni — seq scan halvempi kuin indeksihaku** ✓
- Indeksi aina rikkoutunut
- PostgreSQL bug
- VACUUM puuttuu aina

#### `b08-pg-explain-analyze-buffers` · diff 4

EXPLAIN ANALYZE näyttää hitaan queryn — haluat nähdä cache vs disk I/O. Lisäparametri?

- **EXPLAIN (ANALYZE, BUFFERS) — shared/local hit read** ✓
- EXPLAIN VERBOSE riittää I/O:hon
- BUFFERS vaatii superuser aina
- strace postgres riittää

#### `b08-pg-explain-cost-settings` · diff 3

Planner valitsee Seq Scan SSD-palvelimella vaikka indeksi näyttää halvemmalta manuaalisesti. Säädettävä?

- **random_page_cost alemmas SSD:lle — seq_page_cost suhteessa** ✓
- enable_seqscan=off pysyvästi
- Cost parametrit eivät vaikuta
- cpu_index_tuple_cost=0

#### `b08-pg-explain-nested-loop` · diff 4

Nested Loop + Seq Scan sisäpuolella miljoona riviä — hidas join. Milloin NL on OK?

- **Ulkopuoli pieni ja sisäpuolella indeksi — NL + index scan** ✓
- Nested loop aina huono
- Hash join ei ole olemassa
- Seq scan sisä loopissa aina OK

#### `b08-pg-explain-seq-scan` · diff 3

Pieni taulu — planner valitsee Seq Scan vaikka indeksi on. Todennäköisin syy?

- **Taulu pieni — seq scan halvempi kuin index random I/O** ✓
- Indeksi aina pakotettava
- Seq scan = bugi aina
- statistics_target=0

#### `b09-pg-explain-analyze-buffers` · diff 4

Kysely on hidas mutta EXPLAIN cost näyttää pieneltä. Seuraava diagnostiikka?

- **EXPLAIN (ANALYZE, BUFFERS) — todelliset ajat ja I/O** ✓
- EXPLAIN ilman ANALYZE riittää aina
- Kysely on nopea — cost on totuus
- BUFFERS toimii vain replikassa

#### `b09-pg-explain-missing-stats` · diff 3

Bulk INSERT jälkeen kyselyt käyttävät väärää suunnitelmaa. Nopea korjaus?

- **ANALYZE taulu — päivitä planner-statistiikka** ✓
- VACUUM FULL heti
- REINDEX DATABASE
- Planner korjautuu automaattisesti minuutissa

#### `b09-pg-explain-nested-loop` · diff 4

JOIN 100k × 100k riviä — Nested Loop cost 10^9. Mitä plannerin pitäisi valita?

- **Hash Join tai Merge Join suuremmille dataseteille — tarkista indexit ja stats** ✓
- Nested Loop on aina nopein
- Lisää LIMIT ilman ORDER BY
- JOIN ei skaalaudu PostgreSQLissa

#### `b09-pg-explain-seq-scan-large` · diff 3

EXPLAIN näyttää Seq Scan 5M rivin taulussa vaikka index on olemassa. Ensimmäinen tarkistus?

- **SELECTivity — planner arvioi seq scan halvemmaksi, tarkista WHERE ja ANALYZE** ✓
- Index on rikki — REINDEX aina
- Seq scan on aina virhe
- PostgreSQL ei käytä indexeitä suurissa tauluissa

#### `exp-pg-explain-analyze-buffers` · diff 4

EXPLAIN näyttää Index Scan mutta query hidas — epäilet cache-missiä. Mitä lisäät?

- **EXPLAIN (ANALYZE, BUFFERS) — todelliset ajat ja I/O** ✓
- Vain EXPLAIN ilman ANALYZE
- SELECT * korjaa plannerin
- SET enable_seqscan = off aina

#### `exp-pg-explain-nested-loop` · diff 4

JOIN palauttaa miljoona riviä — plan näyttää Nested Loop ja seq scan isolla taululla. Ensimmäinen epäily?

- **Puuttuva indeksi join/where-sarakkeelle — planner valitsee huonon polun** ✓
- Nested Loop aina paras
- Hash Join ei ole PostgreSQLissä
- Planner ei käytä indeksejä

#### `exp-pg-explain-seq-scan-ok` · diff 3

Junior haluaa poistaa seq scanin pienestä lookup-taulusta (200 riviä). Neuvo?

- **Seq scan voi olla halvin pienelle taululle — indeksi ei aina kannata** ✓
- Seq scan = aina bugi
- enable_seqscan=off tuotannossa
- Materialized view pakollinen

#### `exp-pg-explain-stats-stale` · diff 4

Plan muuttui yllättäen huonoksi bulk loadin jälkeen — row estimate väärä. Korjaus?

- **ANALYZE taulu (tai autovacuum analyze) — päivitä statistics** ✓
- REINDEX DATABASE
- Restart postgres
- Planner ei käytä statistiikkaa

#### `pg-explain-analyze` · diff 4

Kysely on hidas tuotannossa. Miten näet todelliset ajat ja rivimäärät turvallisesti?

- **EXPLAIN (ANALYZE, BUFFERS) testikopiossa tai stagingissa** ✓
- EXPLAIN ANALYZE suoraan prodissa ruuhka-aikaan aina
- pg_sleep ennen jokaista kyselyä
- Vain \d taulu riittää

#### `pg-explain-seq-scan` · diff 3

EXPLAIN näyttää Seq Scan isolla taululla vaikka indeksi on. Tyypillisin syy?

- **Suuri osa taulusta haetaan — seq scan halvempi kuin indeksi** ✓
- PostgreSQL ei koskaan käytä indeksiä
- Indeksi on aina rikki
- VACUUM FULL pakollinen

### pg-indexes (38)

#### `b02-pg-indexes-btree-02` · diff 2

WHERE status = 'active' AND created_at > '2024-01-01' — yleisin indeksityyppi?

- **B-tree composite index (status, created_at) sarakkeiden järjestyksellä** ✓
- GIN only
- Brin aina parempi
- Seq scan aina nopein

#### `b02-pg-indexes-covering-04` · diff 4

Query tarvitsee id, email — index only scan halutaan. PostgreSQL 11+?

- **INCLUDE columns: CREATE INDEX ... INCLUDE (email)** ✓
- CLUSTER only
- Materialized view aina
- Secondary sort

#### `b02-pg-indexes-gin-01` · diff 3

JSONB-kenttä `metadata @> '{"tag": "urgent"}'` — seq scan hidas. Indeksityyppi?

- **GIN index JSONB:lle** ✓
- B-tree primary key riittää
- Hash index kaikkeen
- Ei indeksiä koskaan JSONB

#### `b02-pg-indexes-partial-03` · diff 3

Indeksi vain active riveille — 90% archived. Optimointi?

- **Partial index: CREATE INDEX ... WHERE status = 'active'** ✓
- Full index kaikille
- Duplicate table
- VACUUM only

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

#### `b04-pg-indexes-concurrent-create` · diff 4

Tuotantotauluun uusi indeksi — CREATE INDEX lukitsee kirjoitukset tunteiksi. Vaihtoehto?

- **CREATE INDEX CONCURRENTLY — ei exclusive lockia kirjoituksiin** ✓
- REINDEX CONCURRENTLY riittää aina
- Indeksi vain maintenance windowissa ilman CONCURRENTLY
- Duplikaatti taulu + swap

#### `b04-pg-indexes-expression` · diff 4

Kysely `WHERE lower(email) = 'foo@bar.com'` — indeksi email-sarakkeella ei käytössä. Ratkaisu?

- **Expression index: CREATE INDEX ON users (lower(email))** ✓
- Seq scan on aina ok
- B-tree email riittää funktiokutsulle
- Trigger joka kopioi lower email

#### `b04-pg-indexes-gin-jsonb` · diff 4

Kysely `WHERE data @> '{"status":"active"}'` JSONB-sarakkeessa on hidas 5M rivillä. Indeksityyppi?

- **GIN-indeksi JSONB:lle — CREATE INDEX ON t USING GIN (data)** ✓
- B-tree data-sarakkeelle riittää aina
- Hash-indeksi JSONB containmentiin
- Ei indeksiä — seq scan aina nopein

#### `b04-pg-indexes-partial-active` · diff 3

90 % riveistä archived=true — kyselyt vain active=false. Indeksioptimointi?

- **Partial index: WHERE archived = false** ✓
- Full index status-sarakkeelle riittää
- Ei indeksiä — seq scan pienelle
- UNIQUE constraint archived

#### `b05-pg-indexes-concurrent-create` · diff 3

Iso tuotantotaulu — CREATE INDEX lukitsee kirjoitukset. Miten luot indeksin ilman pitkää lukkoa?

- **CREATE INDEX CONCURRENTLY — ei exclusive lockia koko ajaksi** ✓
- REINDEX CONCURRENTLY riittää aina
- Indeksi luodaan vain maintenance windowissa ilman CONCURRENTLY
- CONCURRENTLY on nopeampi kuin tavallinen

#### `b05-pg-indexes-duplicate-drop` · diff 2

Kaksi identtistä btree-indeksiä samoille sarakkeille — kirjoitus hidasta. Toimenpide?

- **DROP INDEX toinen — duplikaatti indeksi turha ylläpito** ✓
- Pidä molemmat varmuuden vuoksi
- REINDEX molemmat
- Indeksit eivät vaikuta INSERT-nopeuteen

#### `b05-pg-indexes-expression` · diff 4

Haku: `WHERE lower(email) = 'user@example.com'`. Tavallinen btree emailille ei käytössä. Ratkaisu?

- **Expression index: CREATE INDEX ON users (lower(email))** ✓
- Seq scan aina — funktio estää indeksin
- Hash index lower():lle
- Muuta email upper case — ei indeksiä

#### `b05-pg-indexes-gin-jsonb` · diff 4

Query: `WHERE data @> '{"status": "active"}'` JSONB-sarakkeessa — seq scan hidas. Indeksityyppi?

- **GIN index JSONB:lle — tukee @>, ?, ?& operaattoreita** ✓
- B-tree data-sarakkeelle riittää
- Hash index JSONB:lle
- Ei indeksiä — JSONB ei indeksoitu

#### `b06-pg-indexes-brin-timeseries` · diff 4

Aikasarjataulu — miljardi rivi, queries aikarangeilla. Kustannustehokas index?

- **BRIN index — block range, pieni koko järjestetylle dataa** ✓
- Btree aina paras
- GIN aikasarjalle
- Ei index — seq scan aina

#### `b06-pg-indexes-hash-index` · diff 3

Equality-haku UUID-sarakkeessa — btree on hidas suurilla tauluilla. Milloin hash index?

- **Vain = vertailu — hash ei tukee range scan** ✓
- Hash korvaa btree aina
- Hash tukee ORDER BY
- Hash index on default PostgreSQLissa

#### `b06-pg-indexes-include-columns` · diff 3

Index-only scan ei toteudu — query tarvitsee sarakkeet jotka ei indexissä. Miten?

- **CREATE INDEX ... INCLUDE (col) — covering index PostgreSQL 11+** ✓
- CLUSTER table
- Lisää kaikki sarakkeet key columns
- INCLUDE vain MySQL:ssä

#### `b06-pg-indexes-reindex-concurrently` · diff 4

Bloated index tuotannossa — REINDEX lukitsee taulu. Miten ilman downtime?

- **REINDEX INDEX CONCURRENTLY — ei exclusive lock** ✓
- DROP INDEX ja CREATE — sama lock
- VACUUM reindexaa
- CONCURRENTLY vain CREATE INDEX

#### `b07-pg-index-btree-vs-gin` · diff 3

JSONB @> query on hidas seq scanilla. Mikä indeksityyppi?

- **GIN index JSONB-sarakkeelle — containment queries** ✓
- B-tree riittää JSONB containment
- Hash index JSONB
- Ei indeksiä JSONB:lle

#### `b07-pg-index-covering` · diff 4

EXPLAIN näyttää Index Scan + Heap Fetch — query tarvitsee kaksi saraketta. Optimointi?

- **INCLUDE-sarakkeet indeksiin — covering index index-only scan** ✓
- Seq scan aina
- Lisää JOIN
- Poista WHERE

#### `b07-pg-index-partial` · diff 4

Indeksi on iso mutta 80 % riveistä on deleted_at IS NOT NULL. Tehokkaampi indeksi?

- **Partial index WHERE deleted_at IS NULL — indeksoi vain aktiiviset** ✓
- Full index kaikille
- Poista indeksi
- Hash index kaikille

#### `b07-pg-index-unused` · diff 3

Kirjoitus hidasta — pg_stat_user_indexes näyttää idx_scan=0 usealle indeksille. Toimenpide?

- **Poista käyttämättömät indeksit — ne hidastavat INSERT/UPDATE** ✓
- Lisää indeksejä
- REINDEX kaikki
- Indeksit eivät vaikuta writeen

#### `b08-pg-indexes-btree-gist` · diff 4

Geo-query: `WHERE location && box` — btree ei toimi. Indeksityyppi?

- **GiST (tai SP-GiST) extension — geometriset operaattorit** ✓
- B-tree location-sarakkeelle riittää
- Hash index && operaattorille
- PostgreSQL ei tue geo-indeksejä

#### `b08-pg-indexes-covering` · diff 4

EXPLAIN: Index Scan + Heap Fetch hidastaa — query tarvitsee vain indeksisarakkeet. Optimointi?

- **INCLUDE columns — covering index (index-only scan)** ✓
- Lisää random_page_cost=0
- Covering index vain MySQL:ssä
- Poista indeksi

#### `b08-pg-indexes-multicolumn-order` · diff 3

Indeksi (a,b) — query WHERE b=1 ei käytä indeksiä tehokkaasti. Miksi?

- **B-tree composite: vasemmanpuoleinen prefix rule — tarvitsee a:n tai (a,b)** ✓
- PostgreSQL skannaa aina koko indeksin
- Järjestys indeksissä ei merkitse
- b-only query käyttää (a,b) täydellisesti

#### `b08-pg-indexes-partial` · diff 4

Query: `WHERE status = 'active'` — 95% rivistä archived. Indeksi koko tauluun turha. Ratkaisu?

- **CREATE INDEX ... WHERE status = 'active' — partial index** ✓
- Seq scan aina nopein
- Partial index ei tueta PostgreSQL:ssä
- Hash index statusille

#### `b09-pg-index-composite-order` · diff 4

Kysely `WHERE tenant_id = ? AND created_at > ?` — index (created_at, tenant_id) ei käytetä. Miksi?

- **Equality-sarake ensin, range toisena — (tenant_id, created_at)** ✓
- Sarakkeiden järjestyksellä ei ole väliä
- Tarvitaan kaksi erillistä indexiä aina
- Hash index korjaa järjestyksen

#### `b09-pg-index-gin-jsonb` · diff 3

JSONB-kentässä haku `@>` containment-operaatiolla on hidas seq scan. Index-tyyppi?

- **GIN index jsonb_path_ops tai jsonb_ops** ✓
- B-tree index JSONB:lle aina
- Hash index JSON containment
- JSONB ei tue indexeitä

#### `b09-pg-index-partial-active` · diff 4

Kysely hakee vain `status = 'active'` rivejä 10M taulusta — index on suuri ja hidas. Optimointi?

- **Partial index WHERE status = 'active' — pienempi, nopeampi** ✓
- Full index kaikille riveille aina
- Seq scan on aina nopein
- CLUSTER korvaa partial indexin

#### `b09-pg-index-unused-drop` · diff 3

pg_stat_user_indexes näyttää idx_reports_date never used — mutta INSERT hidastuu. Toimenpide?

- **Arvioi poisto — unused index hidastaa kirjoituksia turhaan** ✓
- Pidä aina — index on ilmainen
- REINDEX korjaa unused-tilan
- Unused tarkoittaa että index on liian pieni

#### `exp-pg-indexes-btree-composite` · diff 3

Query: WHERE tenant_id = ? AND created_at > ? ORDER BY created_at. Yksi indeksi — mikä järjestys?

- **(tenant_id, created_at) — equality ensin, range seuraavaksi** ✓
- (created_at, tenant_id) aina
- Kaksi erillistä indeksiä riittää aina
- Vain tenant_id indeksissä

#### `exp-pg-indexes-covering` · diff 4

EXPLAIN näyttää Index Scan mutta silti heap fetch jokaiselle riville SELECT listassa. Miten vältät extra I/O:n?

- **INCLUDE-sarakkeet indexiin (covering index)** ✓
- Lisää seq scan hint
- Poista WHERE-ehto
- Vain CLUSTER TABLE riittää

#### `exp-pg-indexes-partial-active` · diff 3

Taulussa 10M riviä mutta 99 % archived=true. Indeksi hakuun active riveille?

- **Partial index WHERE archived = false** ✓
- Full btree kaikille riveille
- Ei indeksiä — seq scan aina
- Hash index kaikille sarakkeille

#### `exp-pg-indexes-unused-drop` · diff 3

Kirjoitus hidasta — pg_stat_user_indexes näyttää idx_scan = 0 kuukausien jälkeen. Toimenpide?

- **Harkitse DROP INDEX — dead index hidastaa INSERT/UPDATE** ✓
- REINDEX kaikki automaattisesti
- Indeksi ei vaikuta kirjoitukseen
- Lisää lisää indeksejä nopeuteen

#### `pg-indexes-btree-selective` · diff 3

Taulussa 10M riviä, kysely `WHERE status = 'active'` palauttaa 2 % riveistä. Ensimmäinen optimointi?

- **B-tree-indeksi status-sarakkeelle** ✓
- SELECT * nopeuttaa
- Poista PRIMARY KEY
- Kasvata random_page_cost = 0

#### `pg-indexes-partial` · diff 5

Kyselyt kohdistuvat usein `WHERE archived = false`. Indeksi on iso ja hidas. Ratkaisu?

- **Partial index: WHERE archived = false** ✓
- CLUSTER koko taulu
- Vain BRIN kaikille sarakkeille
- Poista WHERE-ehto

### pg-vacuum (34)

#### `b02-pg-vacuum-bloat-09` · diff 4

UPDATE-heavy taulu — levy kasvaa vaikka rivimäärä sama. Syy ja toimenpide?

- **Dead tuples — VACUUM (autovacuum) vapauttaa tilaa uudelleenkäyttöön** ✓
- DELETE DATABASE
- VACUUM FULL heti tuotannossa
- Lisää indeksejä

#### `b02-pg-vacuum-full-12` · diff 3

Disk nearly full — harkitset VACUUM FULL tuotannossa. Riski?

- **Exclusive lock + uudelleenkirjoitus — downtime ja lock** ✓
- VACUUM FULL online ilman lockia
- Ei riskiä
- Nopeampi kuin VACUUM

#### `b02-pg-vacuum-long-xact-11` · diff 4

Autovacuum ei siivoa — pg_stat_activity näyttää idle in transaction 8h. Mitä teet?

- **Selvitä pitkä transaktio — se estää vacuumia poistamasta dead tupleja** ✓
- REBOOT server
- max_connections=1
- DROP autovacuum

#### `b02-pg-vacuum-wrap-10` · diff 5

Varoitus: database approaching transaction ID wraparound. Kiireellinen toimenpide?

- **VACUUM FREEZE (autovacuum freeze) — estä shutdown wraparound** ✓
- Ignoroi varoitus
- pg_dump only
- DROP TABLE random

#### `b03-pg-vacuum-analyze-stats` · diff 2

Bulk load jälkeen planner valitsee huonon suunnitelman — stats vanhentuneet. Komento?

- **ANALYZE table_name (tai autovacuum analyze trigger)** ✓
- VACUUM FULL heti
- REINDEX kaikki
- Stats päivittyvät automaattisesti heti loadissa

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

#### `b04-pg-vacuum-analyze-stats` · diff 3

Planner valitsee seq scanin vaikka indeksi on — pg_stats näyttää vanhentuneet arviot bulk-insertin jälkeen. Toimenpide?

- **ANALYZE taulu; tai odota autovacuum analyze** ✓
- REINDEX DATABASE heti
- DROP INDEX — seq scan nopeampi
- Käynnistä PG uudestaan — stats päivittyy

#### `b04-pg-vacuum-dead-tuples` · diff 3

pg_stat_user_tables näyttää n_dead_tup kasvavan nopeasti UPDATE-heavy taulussa. Ensimmäinen toimenpide?

- **Varmista autovacuum käynnissä; säätä autovacuum_vacuum_scale_factor tarvittaessa** ✓
- VACUUM FULL heti tuotannossa
- Dead tuples ovat harmless — ignore
- DROP TABLE

#### `b04-pg-vacuum-freeze-age` · diff 5

Varoitus: 'database must be vacuumed within 200 million transactions' — mitä uhkaa?

- **Transaction ID wraparound — pakollinen anti-wraparound vacuum** ✓
- Levy täynnä — vain disk issue
- Indeksit korruptoituvat automaattisesti
- Varoitus voidaan ignore — cosmetic

#### `b04-pg-vacuum-long-xact` · diff 4

Autovacuum ei siivoa dead tupleja — pg_stat_activity näyttää 'idle in transaction' 12h. Syy?

- **Pitkä transaktio pitää xmin:ää — estää vacuum poistamasta rivejä** ✓
- Autovacuum pois päältä oletuksena
- Dead tuples poistuvat automaattisesti commitissa
- REINDEX korjaa — ei vacuum

#### `b05-pg-vacuum-analyze-after-bulk` · diff 2

Bulk INSERT 10M riviä yöajossa — aamulla queryt hitaita. Mitä aiot bulk-operaation jälkeen?

- **ANALYZE (tai VACUUM ANALYZE) — päivitä statistiikka plannerille** ✓
- Ei mitään — planner adaptoituu automaattisesti heti
- REINDEX DATABASE
- DROP ja CREATE TABLE

#### `b05-pg-vacuum-bloat-long-xact` · diff 4

Autovacuum ei vapauta tilaa — pg_stat_activity näyttää 8h vanhan idle transactionin. Juurisyy?

- **Pitkä transaktio estää dead tuple -siivouksen — VACUUM ei voi poistaa** ✓
- Autovacuum on pois päältä aina
- Bloat korjataan VACUUM FULL:lla heti ilman tutkintaa
- Idle transaktio ei vaikuta vacuumiin

#### `b05-pg-vacuum-full-lock` · diff 4

DBA ehdottaa VACUUM FULL tuotantotaululle päivällä. Miksi vastustat?

- **VACUUM FULL exclusive lock — taulu lukittuna koko operaation ajan** ✓
- VACUUM FULL on nopeampi kuin tavallinen VACUUM
- VACUUM FULL ei vapauta levytilaa
- VACUUM FULL korvaa REINDEX

#### `b05-pg-vacuum-wraparound` · diff 5

PostgreSQL varoittaa: 'database is not accepting commands to avoid wraparound'. Kiireellinen toimenpide?

- **VACUUM (FREEZE) / autovacuum — transaction ID wraparound on kriittinen** ✓
- RESTART PostgreSQL — wraparound katoaa
- DROP TABLE suurin — ei auta wraparound
- Lisää max_connections

#### `b06-pg-vacuum-autovacuum-scale` · diff 3

Suuri taulu — autovacuum ei käynnisty tarpeeksi tiukasti. Mitä säätät?

- **autovacuum_vacuum_scale_factor per table tai global** ✓
- max_connections
- random_page_cost
- Autovacuum ei skaalaa taulukoon

#### `b06-pg-vacuum-index-cleanup` · diff 4

VACUUM ei vapauta levytilaa indexeistä — bloat jatkuu. Mitä parametria?

- **vacuum index_cleanup on / REINDEX bloated indexes** ✓
- VACUUM FULL ei tarvita koskaan
- DROP TABLE
- Index bloat ei olemassa PostgreSQLissa

#### `b06-pg-vacuum-skip-locked` · diff 4

DELETE job poistaa miljoona riviä — pitkä lock. Miten batch delete?

- **DELETE ... LIMIT batch + FOR UPDATE SKIP LOCKED pattern** ✓
- DELETE kaikki yhdellä transaktiona
- TRUNCATE partial
- VACUUM during DELETE

#### `b07-pg-vacuum-analyze` · diff 2

Planner tekee huonoja arvioita bulk INSERTin jälkeen. Mikä ylläpitokomento?

- **ANALYZE — päivittää tilastot plannerille** ✓
- VACUUM FULL aina
- REINDEX
- CHECKPOINT only

#### `b07-pg-vacuum-autovacuum` · diff 3

autovacuum ei ehdi — transaction id wraparound varoitus. Ensimmäinen toimenpide?

- **Tarkista autovacuum-asetukset ja long transactions — pg_stat_activity** ✓
- DROP DATABASE
- Poista autovacuum
- REINDEX DATABASE

#### `b07-pg-vacuum-bloat` · diff 4

Taulu on 10 GB mutta data 2 GB — UPDATE-heavy workload. Mitä tapahtuu?

- **Dead tuple bloat — VACUUM ei palauta levytilaa ilman VACUUM FULL** ✓
- PostgreSQL shrinkaa automaattisesti
- DELETE poistaa levyn heti
- REINDEX shrinkaa taulun

#### `b07-pg-vacuum-freeze` · diff 5

Mitä frozen xmin tarkoittaa PostgreSQL MVCC:ssä?

- **Rivi on frozen — vanhat XID:t eivät vaadi enää vacuum freeze -käsittelyä** ✓
- Rivi on lukittu
- Rivi poistettu
- Freeze poistaa datan

#### `b08-pg-vacuum-autovacuum-threshold` · diff 3

Autovacuum ei käynnisty — dead tuples kasaantuvat. Mitä parametria säädät?

- **autovacuum_vacuum_threshold + scale factor — tai table storage params** ✓
- max_connections
- Autovacuum ei ole konfiguroitavissa
- VACUUM FULL cron riittää aina

#### `b08-pg-vacuum-bloat` · diff 4

Taulu 10 GB mutta 2 GB live data — UPDATE-heavy workload. Ilmiö ja toimenpide?

- **Bloat — VACUUM (FULL/varasto) tai pg_repack, paranna autovacuum** ✓
- REINDEX DATABASE riittää bloatiin
- Bloat ei vaikuta suorituskykyyn
- DROP TABLE korjaa automaattisesti

#### `b08-pg-vacuum-freeze` · diff 5

Varoitus: database must be vacuumed before anti-wraparound — mitä uhkaa?

- **Transaction ID wraparound — vacuum freeze estää shutdownin** ✓
- Levy täyttyy logeista vain
- Freeze poistaa kaiken datan
- Varoitus on cosmetic

#### `b09-pg-vacuum-autovacuum-tuning` · diff 4

Heavy UPDATE -taulu bloattaa nopeammin kuin autovacuum ehtii. Säätö?

- **autovacuum_vacuum_scale_factor / threshold tai table storage params** ✓
- Poista autovacuum — manuaalinen riittää
- VACUUM FULL cron joka minuutti
- Autovacuum ei skaalaa isoille tauluille

#### `b09-pg-vacuum-bloat-table` · diff 4

Taulu on 50 GB mutta sisältää paljon dead tupleja — pg_stat_user_tables näyttää korkean n_dead_tup. Toimenpide?

- **VACUUM (ANALYZE) — autovacuum ei ole pysynyt, tarkista bloat** ✓
- DROP TABLE heti
- Dead tuples eivät vaikuta suorituskykyyn
- REINDEX korvaa VACUUM:in

#### `b09-pg-vacuum-freeze-age` · diff 5

Varoitus: `database must be vacuumed within 200 million transactions`. Kiireellinen toimenpide?

- **VACUUM FREEZE — estää transaction ID wraparound** ✓
- RESTART PostgreSQL — korjaa automaattisesti
- Lisää RAM — wraparound on muistiongelma
- Ignoroi — varoitus on informatiivinen

#### `b09-pg-vacuum-full-lock` · diff 3

DBA ehdottaa VACUUM FULL tuotantoon päivällä bloatin poistoon. Miksi tämä on riski?

- **VACUUM FULL lukitsee taulun exclusive lockilla — katkoa tuotannossa** ✓
- VACUUM FULL on nopeampi kuin VACUUM — ei riskiä
- FULL poistaa datan
- Lock kestää vain millisekunteja aina

#### `exp-pg-vacuum-autovacuum-tune` · diff 3

Heavy UPDATE -taulu bloataa nopeasti — autovacuum ei käynnisty tarpeeksi usein. Mitä säädät?

- **autovacuum_vacuum_scale_factor / table-level storage params** ✓
- max_connections = 1000
- Poista autovacuum
- shared_buffers = 1MB

#### `exp-pg-vacuum-bloat-wraparound` · diff 5

Alert: taulu lähestyy transaction ID wraparoundia — autovacuum ei ehdi. Kiireellinen toimenpide?

- **VACUUM (FREEZE) / autovacuum tuning — estä shutdown trigger** ✓
- DROP TABLE
- Pg_upgrade heti
- Wraparound ei vaikuta PostgreSQLiin

#### `exp-pg-vacuum-full-lock` · diff 3

Ops ehdottaa VACUUM FULL tuotantotaululle päivällä bloatin takia. Miksi vastustat?

- **VACUUM FULL exclusive lock + rewrite — käytä pg_repack/off-peak** ✓
- VACUUM FULL on online-operaatio
- Bloat ei vaikuta PostgreSQLiin
- REINDEX TABLE korvaa vacuum fullin aina

#### `exp-pg-vacuum-long-xact` · diff 4

pg_stat_activity näyttää 12 h avoimen read transactionin — dead tuples kasaantuvat. Mitä teet?

- **Tunnista ja päätä pitkä transaktio — vacuum ei voi siivota tarvittavaa** ✓
- VACUUM FULL heti ilman syytä
- Autovacuum pois
- Long xact ei vaikuta vacuumiin

#### `pg-vacuum-bloat` · diff 4

Päivitykset ovat runsaita, taulu kasvaa mutta rivimäärä pysyy. Epäily?

- **Dead tuple -bloat — tarkista autovacuum ja last_vacuum** ✓
- Indeksi on liian pieni
- SELECT tarvitsee REINDEX
- PostgreSQL ei tue UPDATE:ia

## qt (134)

### qt-models (19)

#### `b02-qt-models-reset-10` · diff 4

Koko malli vaihtuu — käytät beginResetModel/endResetModel. Milloin riittää dataChanged?

- **Kun vain olemassa olevat rivit/sarakkeet muuttuvat — reset vain rakenteen muutoksessa** ✓
- Reset aina
- dataChanged ei koskaan
- Poista view

#### `b02-qt-models-sort-09` · diff 3

QTableView sorttaus hidastuu 100k rivillä — sorttaus viewissä. Parempi?

- **QSortFilterProxyModel tai sorttaus SQL/source tasolla** ✓
- QTableWidget aina
- Poista sort
- Nested loop viewissa

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

#### `b04-qt-models-setData` · diff 3

QTableView ei päivity kun muokkaat dataa suoraan taustatallennuksessa. Mitä modelin pitää tehdä?

- **emit dataChanged(topLeft, bottomRight, roles) muutoksen jälkeen** ✓
- Kutsu view->update() aina riittää
- Model ei tarvitse ilmoittaa — view pollaa
- Poista model ja luo uusi

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

#### `b05-qt-models-sort-filter` · diff 3

QTableView tarvitsee suodatuksen ja lajittelun ilman datan duplikaatiota. Ratkaisu?

- **QSortFilterProxyModel source modelin päällä** ✓
- Kopioi data uuteen QStandardItemModel:iin suodatettuna
- Piilota rivit setRowHidden manuaalisesti aina
- SQL WHERE riittää — ei proxya

#### `b06-qt-models-editable-delegate` · diff 3

Taulukon solu tarvitsee custom editor widgetin editissä. Mitä käytät?

- **QStyledItemDelegate — createEditor ja setModelData** ✓
- QTableWidget setCellWidget kaikille soluille
- Model setData ilman delegatea aina
- QLineEdit overlay viewin päälle

#### `b06-qt-models-mime-drag` · diff 4

Tree view drag-drop eri sovellukseen — data ei siirry. Mitä model-metodia toteutat?

- **mimeData + supportedDropActions — QAbstractItemModel drag API** ✓
- setDragEnabled(true) riittää
- QSS drag property
- mouseMoveEvent viewissä aina

#### `b07-qt-model-reset` · diff 4

Lista päivittyy hitaasti kun data muuttuu — koko model resetataan. Parempi tapa?

- **beginInsertRows/endInsertRows tai dataChanged — granular model notifications** ✓
- resetModel aina
- Poista view ja luo uudelleen
- QTimer::singleShot 0

#### `b07-qt-model-view-sort` · diff 3

QTableView näyttää dataa mutta sortaus ei toimi. Mitä puuttuu?

- **setSortingEnabled(true) + model data(Qt::DisplayRole) sortattavissa** ✓
- QPainter sorttaa
- QSortFilterProxyModel riittää ilman dataa
- View ei tue sortausta

#### `b08-qt-models-data-changed` · diff 3

Custom model päivittää solun — view ei päivity ennen full reset. Mitä signaalia emit?

- **dataChanged(topLeft, bottomRight, roles) — targeted update** ✓
- layoutChanged aina yhdestä solusta
- modelReset jokaiselle muutokselle
- View pollaa modelia timerilla

#### `b08-qt-models-sort-filter` · diff 3

QTableView suodatus — haluat näyttää vain aktiiviset rivit ilman datan poistoa. Proxy?

- **QSortFilterProxyModel — filterAcceptsRow + setSourceModel** ✓
- Poista rivit source modelista
- QTableWidget hideRow riittää aina suuressa datassa
- Proxy model ei tue suodatusta

#### `b09-qt-models-reset-vs-layout` · diff 4

Lataat koko listan uudelleen — beginResetModel on raskas ja välkkyy. Parempi vaihtoehto?

- **beginInsertRows/endInsertRows tai layoutChanged jos rakenne sama** ✓
- Luo uusi model aina
- resetModel on ainoa tapa päivittää
- View päivittyy automaattisesti ilman model-signaaleja

#### `b09-qt-models-sort-proxy` · diff 3

QTableView sorttaus rikkoo custom modelin indeksit. Ratkaisu?

- **QSortFilterProxyModel source modelin päällä — view näkee proxyn** ✓
- Lajittele source data suoraan — view seuraa automaattisesti
- Model ei tue sorttausta Qt:ssa
- setSortingEnabled(false) aina

#### `exp-qt-models-persistent-index` · diff 4

Delegate tallentaa QModelIndexin myöhempää käyttöä varten — data väärää insertRow:n jälkeen. Mikä sääntö?

- **QModelIndex ei ole pysyvä — käytä QPersistentModelIndex tai hae uudelleen** ✓
- QModelIndex on aina valid forever
- Insert ei vaikuta indekseihin
- Vain QListWidget tarvitsee huomioida

#### `exp-qt-models-reset-vs-layout` · diff 4

Taulukko välkkyy kun päivität 10 000 riviä — koko model resetataan. Tehokkaampi tapa?

- **beginResetModel/endResetModel vain tarvittaessa — mieluummin dataChanged tai rowsInserted** ✓
- Luo uusi QTableWidget joka kerta
- Poista model kokonaan
- processEvents jokaisella rivillä

#### `qt-models-persistent-index` · diff 4

Taulukkomalli päivittyy (lajittelu/suodatus). Miten tallennat rivin tunnisteen turvallisesti?

- **QPersistentModelIndex tai oma id rivin datassa** ✓
- QModelIndex tallennetaan suoraan sessioon ikuisesti
- Rivinumero riittää aina
- Model ei saa muuttua käytön aikana

### qt-opengl (21)

#### `b02-qt-opengl-context-11` · diff 4

OpenGL renderöinti toisesta threadista — mitä tarvitaan ennen glCall?

- **QOpenGLContext::makeCurrent() oikeassa threadissa** ✓
- OpenGL on thread-safe
- QWidget::update riittää
- glFlush only

#### `b02-qt-opengl-vao-12` · diff 3

Moderni Qt OpenGL piirtää suorakulmion — mitä objekteja bindataan?

- **QOpenGLVertexArrayObject + QOpenGLBuffer (VBO) + shader program** ✓
- Immediate mode glBegin/glEnd
- QPainter only 3D
- QPixmap texture only

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

#### `b05-qt-opengl-context-share` · diff 4

Kaksi QOpenGLWidget:ia — tekstuurit ladataan kahdesti. Miten jaat resurssit?

- **QOpenGLWidget::setShareContext tai shared context group** ✓
- Kaksi erillistä QApplication:ia
- OpenGL ei tue resurssien jakoa
- VBO:t kopioidaan aina CPU:lla

#### `b05-qt-opengl-makecurrent` · diff 3

OpenGL-kutsu kaatuu 'without current context'. Mitä teet ennen glDrawArrays?

- **makeCurrent() kontekstille — OpenGL on thread-local** ✓
- QOpenGLFunctions riittää ilman makeCurrent
- glDrawArrays toimii mistä tahansa säieestä
- swapBuffers ennen piirtämistä

#### `b06-qt-opengl-double-buffer` · diff 4

OpenGL rendering flicker — piirto näkyy kesken renderöinnin. Mitä format-optiota?

- **QSurfaceFormat double buffering — swap buffers** ✓
- QWidget::paintEvent ilman OpenGL
- setUpdatesEnabled(false) aina
- Single buffer on nopeampi tuotannossa

#### `b06-qt-opengl-pixel-format` · diff 4

Depth buffer ei toimi — 3D-objektit piirtyvät väärin. Mitä surface formatissa?

- **setDepthBufferSize(24) — depth buffer koko** ✓
- setVersion(3,3) korvaa depth
- QOpenGLWidget ei tarvitse depth
- swapBuffers poistaa depth

#### `b07-qt-opengl-context` · diff 4

QOpenGLWidget renderöi mustaa — context ei ole current. Mitä kutsutaan ennen piirtoa?

- **makeCurrent() — aktivoi GL context ennen OpenGL-kutsuja** ✓
- swapBuffers ennen piirtoa
- QWidget::update riittää
- OpenGL ei tarvitse current contextia

#### `b07-qt-opengl-vsync` · diff 3

Peli renderöi 300 FPS ja kuluttaa CPU:ta turhaan. Miten rajoitat frame ratea?

- **QSurfaceFormat swap interval (vsync) tai QTimer frame pacing** ✓
- while(true) render
- Poista double buffering
- setFixedSize renderille

#### `b08-qt-opengl-context-share` · diff 4

Kaksi QOpenGLWidget:ia — tekstuurit ladataan kahdesti. Miten jaat GL-resurssit?

- **QSurfaceFormat setShareContext / same QOpenGLContext share group** ✓
- OpenGL ei tue resurssien jakoa
- Piirrä kaikki yhteen widgetiin aina
- shareContext toimii vain QML:llä

#### `b08-qt-opengl-vsync` · diff 3

OpenGL-demo repii — CPU 100% spin loopissa. Miten synkkaat frame rateen?

- **QSurfaceFormat swapInterval 1 (VSync) tai QTimer ~16ms — älä busy loop** ✓
- while(true) update() on oikea game loop
- VSync ei ole Qt:ssä saatavilla
- QPainter korvaa swap chainin

#### `b09-qt-opengl-context-share` · diff 4

Kaksi QOpenGLWidget:ia — tekstuurit ladataan kahdesti. Optimointi?

- **QSurfaceFormat setSharedContext — jaetut GL-resurssit** ✓
- Kaksi erillistä QApplication:ia
- OpenGL ei tue resurssien jakoa
- QPainter korvaa OpenGL:n aina

#### `b09-qt-opengl-vsync-tear` · diff 3

Renderöinti repii ruudulla liikkuessa — tearing. Swap interval?

- **QSurfaceFormat::setSwapInterval(1) — VSync päälle** ✓
- swapBuffers(false) nopeuttaa
- VSync ei vaikuta OpenGL:ään
- QPainter::Antialiasing korjaa tearingin

#### `exp-qt-opengl-context-thread` · diff 5

OpenGL render crashaa satunnaisesti — QOpenGLWidget luodaan worker-threadissä. Mikä Qt-sääntö rikkoutuu?

- **QOpenGLContext/widget luodaan ja käytetään samassa GUI-threadissä** ✓
- OpenGL toimii vapaasti kaikissa threadeissä
- Vain makeCurrent() thread riittää luontiin
- Qt 6 kieltää OpenGL:n kokonaan

#### `exp-qt-opengl-makecurrent` · diff 4

Render loopissa glError invalid operation — context ei aktiivinen. Mitä kutsut ennen GL-komentoja?

- **context->makeCurrent(surface) — ja doneCurrent() kun valmis** ✓
- Vain swapBuffers riittää
- OpenGL ei vaadi current contextia Qt:ssa
- QTimer riittää aktivoida contextin

#### `exp-qt-opengl-vao-vbo` · diff 4

Piirrät meshiä joka frame ilman buffer-objekteja — CPU bottleneck. Ensimmäinen OpenGL-optimointi?

- **QOpenGLBuffer (VBO) + VAO — upload once, draw many** ✓
- glBegin/glEnd joka frame
- Poista depth test
- Piirrä software rasterilla

#### `qt-opengl-makecurrent` · diff 4

QOpenGLWidget piirtää mustaa. OpenGL-kutsut tehdään väärästä säikeestä. Ensimmäinen korjaus?

- **makeCurrent() widgetin kontekstissa ennen GL-kutsuja** ✓
- Vaihda QWidget:iin ilman OpenGL:ää
- glFlush riittää ilman kontekstia
- QApplication::setAttribute riittää aina

#### `qt-opengl-vbo` · diff 5

Piirrät paljon kolmioita QOpenGLWidgetissä. Miten vältät turhat CPU→GPU-kopiointi joka framella?

- **QOpenGLBuffer (VBO) + vertex attrib -asetukset** ✓
- glBegin/glEnd joka framella
- QPainter::drawPolygon OpenGL-widgetissä aina
- QPixmap cache riittää 3D:lle

### qt-shaders (24)

#### `b02-qt-shaders-qsb-13` · diff 4

Qt 6 RHI backend — shaderit pitää esikääntää. Työkalu?

- **qsb (Qt Shader Tools) — .qsb tiedostot** ✓
- glCompileShader runtime aina
- QSS stylesheet
- QPainter shader

#### `b02-qt-shaders-uniform-14` · diff 3

Shader uniform `mvpMatrix` — location vaihtuu eri GPU:lla. Turvallinen tapa?

- **QShaderProgram::uniformLocation("mvpMatrix") tai UBO** ✓
- Hardcode location 0
- Preprocessor magic
- Poista uniform

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

- **qsb precompiled shader — offline compile qsb tiedostoon** ✓
- GLSL compile runtime aina pakko
- QSS korvaa shaderit
- Shader cache poistetaan rebootissa

#### `b06-qt-shaders-varying-interpolation` · diff 5

Fragment shader saa väärät interpolated arvot vertex-attribuuteista. Mikä GLSL-stage välittää?

- **Vertex shader output → fragment input — varying interpolation GPU:lla** ✓
- Uniform välittyy interpoloituna
- Fragment shader lukee VBO suoraan
- Interpolation vain CPU:lla

#### `b07-qt-shader-precision` · diff 5

Shader toimii desktopilla mutta on musta mobiilissa OpenGL ES:llä. Todennäköisin syy?

- **Puuttuva precision mediump/highp ES:ssä tai float texture ES2-rajoitus** ✓
- Qt ei tue mobiilia
- Vain QML toimii mobiilissa
- Desktop ja ES shadert identtiset

#### `b07-qt-shader-qsb` · diff 3

Qt 6 shader ei lataudu — .frag tiedosto suoraan ei toimi. Miten shader valmistellaan?

- **qsb offline compilation — .qsb binary Qt shader toolsilla** ✓
- Lue .glsl runtime compile aina
- QPainter korvaa shadert
- Qt 5 QGLShader only

#### `b07-qt-shader-uniform` · diff 4

Shader ei reagoi uniform-muutoksiin — väri pysyy valkoisena. Tyypillinen virhe?

- **Uniform location -1 (optimoitu pois) tai bindMaterial/setUniformValue väärässä vaiheessa** ✓
- GLSL ei tue uniformeja
- QShaderProgram ei tarvitse bindiä
- Vain vertex shader voi uniformeja

#### `b08-qt-shaders-precision` · diff 3

Fragment shader toimii desktopilla mutta on musta mobiilissa. Epäily?

- **precision mediump/lowp mobiilissa — tarkista GLSL ES precision** ✓
- Mobiili ei tue fragment shadereita
- Qt ei tue OpenGL ES
- precision ei vaikuta väriin

#### `b08-qt-shaders-uniform` · diff 4

Shader ei näy oikein — uniform arvo ei päivity. Qt6 RHI/shader polulla?

- **Varmista uniform location/bindings — QShader ja material property sync** ✓
- Uniformit päivittyvät automaattisesti ilman koodia
- Shader compilation ei vaikuta uniformeihin
- Vain fixed pipeline toimii

#### `b09-qt-shaders-compile-log` · diff 3

QOpenGLShaderProgram linkkaus epäonnistuu — musta ruutu. Debug-askel?

- **log() ja shaderInfoLog() — tulosta compile/link virheet** ✓
- Käännä shader uudelleen ilman logia
- Shader-virheet näkyvät vain Windowsilla
- QPainter korvaa shaderin

#### `b09-qt-shaders-qml-graph-effect` · diff 3

QML-käyttöliittymässä tarvitset blur-efektin itemille. Qt Quick -komponentti?

- **MultiEffect / ShaderEffect + fragment shader QML:ssä** ✓
- QPainter blur QML Itemissä suoraan
- CSS filter QML:ssä
- OpenGL ei toimi QML:n kanssa

#### `b09-qt-shaders-uniform-location` · diff 4

uniform float u_time ei päivity — setUniformValue ei vaikuta. Yleisin syy?

- **Uniform-nimi optimoitu pois tai väärä location — tarkista link status** ✓
- Uniformit eivät toimi Qt:ssa
- Vain vertex shader voi käyttää uniformeja
- setUniformValue vaatii VAO:n

#### `exp-qt-shaders-glsl-version` · diff 3

Shader failaa macOS:llä mutta toimii Windowsilla — puuttuu `#version`. Mitä lisäät?

- **Yhteensopiva #version ja core/es profiili Qt:n RHI/GL backendin mukaan** ✓
- Ei version riviä — driver arvaa
- Käytä GLSL 1.0 aina
- Poista precision qualifierit

#### `exp-qt-shaders-rhi-backend` · diff 5

Tiimi migoi Qt 5 fixed-functionista Qt 6:een — shaderit hajosivat. Mikä arkkitehtuuri muuttui?

- **QRhi rendering pipeline — shaderit backend-agnostisempia (GL/Vulkan/Metal)** ✓
- Qt 6 poisti kaiken GPU-renderöinnin
- Vain QWidget rikkoi shaderit
- QML ei tue shadereita

#### `exp-qt-shaders-uniform-location` · diff 4

Shader compile ok mutta uniform ei vaikuta — hardcoded location 0. Miten Qt 6 -tyylillä vältät?

- **QShaderProgram::uniformLocation("name") tai layout(binding) GLSL:ssä** ✓
- Oleta aina location 0
- Uniformit eivät toimi Qt:ssä
- Käytä fixed function pipeline

#### `qt-shaders-glsl-version` · diff 5

Shader ei käännä Qt:ssa: 'version directive must occur before anything else'. Mikä puuttuu?

- **#version rivi shaderin ensimmäisenä (esim. #version 330 core)** ✓
- QSurfaceFormat riittää — #version ei tarvita
- Vain .qsb-tiedosto ilman GLSL:ää
- precision mediump float C++:ssa

#### `qt-shaders-uniform` · diff 4

QOpenGLShaderProgram on linkitetty. Miten asetat muuttujan `mvpMatrix` shaderiin?

- **program.setUniformValue("mvpMatrix", matrix)** ✓
- glUniform ilman Qt-wrapperia aina — Qt ei tue
- Q_PROPERTY riittää shader-uniformeille
- Uniformit asetetaan vain .vert-tiedostossa

### qt-signals (20)

#### `b02-qt-signals-disconnect-05` · diff 3

Dialog sulkeutuu mutta slot laukeaa edelleen destroyed senderistä. Esto?

- **disconnect tai QPointer sender + Qt::UniqueConnection tai destroyed-signaali** ✓
- Toivo ettei emit
- static connect ilman receiveria
- Poista kaikki signals

#### `b02-qt-signals-queued-04` · diff 4

Worker-thread emit updateUI() — crash GUI-threadissa. Connection type?

- **Qt::QueuedConnection (auto cross-thread)** ✓
- Qt::DirectConnection aina
- BlockingQueuedConnection UI:hin
- Emit ilman connectionia

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

Build epäonnistuu: 'staticMetaObject undefined' luokalle jossa on Q_OBJECT. Puuttuva askel?

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

#### `b05-qt-signals-queued-connection` · diff 4

Worker-säie emittoi signaalin joka päivittää GUI:ta — satunnainen crash. Korjaus?

- **Qt::QueuedConnection — slot ajetaan GUI-säieessä** ✓
- DirectConnection on aina nopein ja turvallisin
- Poista signaalit — käytä globaalia muuttujaa
- BlockingQueuedConnection GUI-säieestä GUI-säieeseen

#### `b06-qt-signals-auto-connection` · diff 3

on_pushButton_clicked() ei kutsuta — slot nimi väärä. Miten auto-connection löytää slotin?

- **on_<objectName>_<signal>() — moc auto-connect pattern** ✓
- Kaikki public metodit auto-connect
- Vain connect() eksplisiittisesti — auto ei ole
- Slot nimi voi olla mitä tahansa

#### `b06-qt-signals-lambda-disconnect` · diff 4

Lambda-connect jää eloon widgetin tuhoutumisen jälkeen — crash. Miten disconnect turvallisesti?

- **QObject::connect lambda + context object — disconnect kun context tuhoutuu** ✓
- Lambda ei tarvitse disconnect
- disconnect() ilman argumenteja aina
- Käytä raw function pointer

#### `b07-qt-signals-disconnect` · diff 3

Dialogi sulkeutuu mutta slot kutsutaan yhä — use-after-free. Mitä teit väärin?

- **Ei disconnect tai ei parent — QObject elinajan hallinta signaaleille** ✓
- Signaalit eivät tarvitse disconnectia
- lambda korvaa disconnectin
- emit stop riittää

#### `b07-qt-signals-queued` · diff 4

Worker-thread emit signaalin joka päivittää GUI-widgettiä — satunnainen crash. Korjaus?

- **Qt::QueuedConnection — slot ajetaan receiver-threadissa** ✓
- Qt::DirectConnection nopeuttaa
- Kutsu widgettiä suoraan workerista
- Poista signaalit

#### `b08-qt-signals-blocking` · diff 3

Lataat modelin UI:hin — jokainen setData laukaisee dataChanged ja hidastaa. Miten hiljennät?

- **QSignalBlocker objekti tai blockSignals(true) — palauta false lopuksi** ✓
- disconnect kaikki signaalit pysyvästi
- Signaaleja ei voi estää Qt:ssa
- sleep() signaalien välissä

#### `b08-qt-signals-unique-connection` · diff 3

Sama connect() kutsutaan initissä kahdesti — slotti suoritetaan kaksinkertaisesti. Esto?

- **Qt::UniqueConnection — connect epäonnistuu jos duplikaatti** ✓
- connect poistaa vanhan automaattisesti
- UniqueConnection toimii vain queued
- Käytä macro connect aina

#### `b09-qt-signals-block-updates` · diff 3

Lataat 1000 riviä modeliin — jokainen setData laukaisee view-päivityksen. Optimointi?

- **QSignalBlocker tai blockSignals(true) bulk-päivityksen ajaksi** ✓
- Poista view tilapäisesti
- Signaaleja ei voi estää Qt:ssa
- processEvents() nopeuttaa bulkia

#### `b09-qt-signals-unique-connection` · diff 3

Sama connect() kutsutaan useasti initissä — slotti laukeaa monta kertaa. Estä?

- **Qt::UniqueConnection — connect epäonnistuu jos jo olemassa** ✓
- disconnect() ennen jokaista connectia manuaalisesti aina
- UniqueConnection ei toimi lambda-sloteilla
- Signaalit eivät voi duplikoitua

#### `exp-qt-signals-disconnect-lifetime` · diff 3

Dialog sulkeutuu mutta background-worker emitoi edelleen vanhaan slottiin — use-after-free. Miten estät?

- **destroyed-signaali + disconnect tai QPointer receiverille** ✓
- Luota siihen että GC siivoaa
- DirectConnection nopeuttaa cleanupia
- Signals eivät voi elää objektia pidempään

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

### qt-threading (20)

#### `b02-qt-thread-gui-07` · diff 4

Worker kutsuu suoraan label->setText() — satunnainen crash. Sääntö?

- **GUI-luokkiin vain GUI-threadista — käytä signaaleja** ✓
- Mutex labelin ympärillä riittää
- setText on thread-safe
- volatile QLabel

#### `b02-qt-thread-pool-08` · diff 3

Satoja lyhyitä taustatehtäviä — QThread jokaiselle liian raskas. Vaihtoehto?

- **QThreadPool + QRunnable / QtConcurrent** ✓
- std::thread jokaiselle ilman rajaa
- UI timer 1ms
- Blocking GUI

#### `b02-qt-thread-worker-06` · diff 3

Pitää ajaa raskas laskenta ilman UI-jäätymistä. Qt-rakenne?

- **QObject worker + moveToThread(QThread) — ei QThread::run overridea GUI-objektille** ✓
- QThread::run suoraan GUI-luokassa
- sleep UI-threadissa
- Prosessi fork

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

#### `b04-qt-thread-affinity` · diff 4

Worker-säie kutsuu suoraan QLabel::setText — satunnainen crash. Oikea Qt-malli?

- **QueuedConnection signaalilla worker→GUI tai QMetaObject::invokeMethod Qt::QueuedConnection** ✓
- mutex labelin ympärillä riittää
- GUI-päivitys worker-threadistä on OK
- volatile QLabel*

#### `b05-qt-thread-gui-touch` · diff 4

Taustasäie kutsuu widget->setText() suoraan — intermittent crash. Sääntö?

- **GUI-objekteja saa koskea vain thread jolla ne luotiin** ✓
- QWidget on thread-safe
- Mutex riittää widget-muutoksiin
- QApplication::processEvents taustasäieessä korjaa

#### `b05-qt-thread-movetothread` · diff 3

Raskas laskenta jäädyttää GUI:n. Oikea Qt-pattern?

- **Worker QObject + moveToThread(QThread) — signaalit takaisin GUI:hin** ✓
- QThread::run override GUI-luokassa
- sleep() pääsäieessä taustalla
- QTimer::singleShot(0) riittää raskaalle työlle

#### `b06-qt-thread-event-loop` · diff 3

Worker-thread ei vastaa signaaleihin — slot ei kutsuta. Mitä worker-thread tarvitsee?

- **QEventLoop exec() tai QObject threadissa — event delivery** ✓
- Thread ilman event loop riittää signaaleille
- GUI thread exec korvaa worker exec
- Signaalit ei tarvitse event loopia

#### `b06-qt-thread-future` · diff 4

Pitkä laskenta taustalla — haluat tulos GUI:hin ilman raw threadia. Qt-ratkaisu?

- **QtConcurrent::run + QFutureWatcher — future pattern** ✓
- sleep GUI-threadissa
- QThread::terminate
- Global mutex resultille

#### `b07-qt-thread-gui-rule` · diff 3

Code review: QLabel::setText kutsutaan worker-threadista. Mikä sääntö rikkoutuu?

- **GUI-luokat vain main threadissä — Qt thread affinity** ✓
- setText on thread-safe
- Vain QPixmap vaatii main threadin
- Mutex riittää

#### `b07-qt-thread-moveToThread` · diff 4

Raskas laskenta jäädyttää GUI-threadin. Qt-idiomi taustatyölle?

- **Worker QObject moveToThread(QThread) — signaalit takaisin GUI:hin** ✓
- std::thread suoraan widgetistä
- QThread::run bez QObject
- processEvents silmukassa

#### `b08-qt-thread-invoke` · diff 4

Worker-säie päivittää QLabel:ia suoraan — crash. Oikea tapa kutsua GUI-metodia toisesta säieestä?

- **QMetaObject::invokeMethod(..., Qt::QueuedConnection) tai signaali GUI-säieeseen** ✓
- Direct call QLabel::setText workeristä
- mutex riittää GUI-päivitykseen
- GUI ei tarvitse säieturvallisuutta

#### `b08-qt-thread-qthreadpool` · diff 3

Paljon lyhyitä taustatehtäviä — uusi QThread jokaiselle on raskasta. Parempi Qt-ratkaisu?

- **QThreadPool + QRunnable / QtConcurrent — uudelleenkäytettävä pooli** ✓
- QThread::create jokaiselle tehtävä erikseen aina
- GUI-säie voi ajaa raskaat tehtävät
- std::thread ilman Qt integraatiota aina parempi

#### `b09-qt-thread-qthreadpool` · diff 3

Satoja lyhyitä taustatehtäviä — uusi QThread jokaiselle on liian raskasta. Pattern?

- **QThreadPool + QRunnable — uudelleenkäytettävä säiepooli** ✓
- QThread::create jokaiselle tehtävälle
- sleep() pääsäieessä
- QtConcurrent::run ilman poolia aina

#### `b09-qt-thread-wait-condition` · diff 4

Producer-consumer queue Qt:llä — consumer odottaa dataa ilman busy-waitia. Primitiivi?

- **QWaitCondition + QMutex — wait/wakeOne pattern** ✓
- QTimer pollaa queuea 1 ms välein
- QEventLoop exec() worker-säieessä riittää
- QSemaphore ei tue odotusta

#### `exp-qt-thread-gui-touch` · diff 3

Code review löytää `label->setText()` suoraan worker-threadista. Miksi tämä on kielletty?

- **QWidget on GUI-thread only — muuta thread → undefined behavior** ✓
- setText on thread-safe kaikissa Qt-versioissa
- Vain OpenGL vaatii main threadin
- QMutex riittää aina widgeteille

#### `exp-qt-thread-worker-object` · diff 4

Raskas laskenta jäädyttää UI-threadin. Mikä Qt-malli siirtää työn taustalle?

- **QObject worker + moveToThread(QThread*) + signaalit** ✓
- QThread::run override UI-luokassa
- std::thread suoraan QWidget metodissa ilman sync
- processEvents silmukassa

#### `qt-thread-movetothread` · diff 4

Pitkäkestoinen työ jumittaa UI:n. Qt-tyylinen ratkaisu QObjectille?

- **moveToThread(workerThread) + signaalit välittämään** ✓
- QThread::terminate() heti kun hidastuu
- processEvents() silmukassa joka paikassa
- sleep() pääsäikeessä

### qt-widgets (30)

#### `b02-qt-widgets-action-03` · diff 3

Valikkorivin Save-toiminto pitää bindata Ctrl+S:ään ja toolbar-nappiin. Qt-abstraktio?

- **QAction — yksi action useassa paikassa** ✓
- Kaksi erillistä slotia kopioituna
- Global hotkey only
- QShortcut erikseen ilman actionia

#### `b02-qt-widgets-layout-01` · diff 2

Ikkuna resize repi widgetit — kovakoodatut setGeometry-kutsut. Parempi Qt-tapa?

- **QLayout (QVBoxLayout/QHBoxLayout) — automaattinen resize** ✓
- Fixed size kaikille
- Manual resizeEvent aina
- QWidget ilman parentia

#### `b02-qt-widgets-parent-02` · diff 2

Dialog leakkaa muistia sulkeutumisen jälkeen — widgetit orphan. Fix?

- **Aseta parent QDialogille tai käytä WA_DeleteOnClose** ✓
- delete this manuaalisesti satunnaisesti
- shared_ptr QWidget
- Piilota vain show()

#### `b03-qt-widgets-dialog-modal` · diff 2

Asetusdialogi avautuu mutta pääikkuna vastaa klikkauksiin taustalla. Korjaus?

- **dialog.exec() modal-tilassa tai QDialog::ApplicationModal** ✓
- show() riittää aina
- Poista WindowStaysOnTopHint
- Modal dialogit on kielletty Qt:ssa

#### `b03-qt-widgets-event-filter` · diff 3

Pitää siepata Enter-näppäin tietystä kentästä ilman subclassia. Qt-mekanismi?

- **installEventFilter() — suodatin objektilla eventFilter()** ✓
- override keyPressEvent kaikissa widgeteissä
- Global keyboard hook OS:stä
- QShortcut ei toimi kentissä

#### `b03-qt-widgets-layout-stretch` · diff 2

QHBoxLayoutissa napit venyvät epätasaisesti ikkunan resize:ssä. Säädin?

- **addStretch() ja setStretchFactor() — jakaa tilaa tarkoituksella** ✓
- setFixedSize koko ikkunalle
- Poista layout — absolute positioning
- Stretch toimii vain QGridLayoutissa

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

- **sizeHint() — layout käyttää ehdotettua kokoa** ✓
- paintEvent() palauttaa koon
- resize() layoutissa riittää
- setMinimumSize(0,0) korjaa aina

#### `b06-qt-resource-extern` · diff 3

QRC-resurssi pitää päivittää ilman uudelleenkäännöstä. Miten ulkoiset resurssit?

- **QResource registerResource runtime tai external path** ✓
- QRC on ainoa tapa Qt:ssä
- COPY resurssit imageen
- Resurssit vain filesystem ilman Qt API

#### `b06-qt-widgets-context-menu` · diff 2

List widget tarvitsee right-click menu. Miten toteutat Qt-widgetsissa?

- **customContextMenuRequested + QMenu — standard pattern** ✓
- mousePressEvent aina — context menu deprecated
- QAction vain toolbarille
- setContextMenuPolicy(PreventContextMenu)

#### `b06-qt-widgets-focus-policy` · diff 3

Label saa fokuksen tabilla mutta ei pitäisi. Mitä muutat?

- **setFocusPolicy(Qt::NoFocus) — widget ei saa fokuksia** ✓
- hide() label
- setEnabled(false)
- QSS focus: none

#### `b06-qt-widgets-tab-order` · diff 2

Tab-järjestys lomakkeessa on väärä — käyttäjä tabbaa satunnaisesti. Miten korjaat?

- **setTabOrder(widget1, widget2) — eksplisiittinen tab-ketju** ✓
- Tab order on aina automaattinen — ei korjattavissa
- QSS tab-order property
- Poista Tab key event filter

#### `b07-qt-layout-responsive` · diff 3

Ikkuna resize aiheuttaa widgettien päällekkäisyyden. Mikä layout-manager korjaa?

- **QVBoxLayout / QHBoxLayout / QGridLayout — automaattinen uudelleenasettelu** ✓
- setFixedSize kaikille
- Absolute positioning move():llä
- Poista layout

#### `b07-qt-widget-parent` · diff 2

Dialogi jää roikkuen muistissa ikkunan sulkeuduttua. Todennäköisin syy?

- **Ei parent-widgettiä — QObject parent hallitsee lasten elinkaarta** ✓
- Qt vuotaa aina
- delete this riittää aina
- QApplication::quit korjaa

#### `b07-qt-widget-stylesheet` · diff 3

Nappi näyttää erilaiselta macOS vs Windows — haluat yhtenäisen ulkoasun. Qt-ratkaisu?

- **QSS stylesheet tai QStyle — mukautettu tyyli platform-riippumattomasti** ✓
- Piirrä bitmap jokaiselle alustalle
- setFixedSize korjaa tyylin
- Qt ei tue custom tyyliä

#### `b08-qt-widgets-focus-policy` · diff 2

Custom nappi ei saa näppäimistöfokusta Tabilla. Mitä asetat?

- **setFocusPolicy(Qt::StrongFocus) — widget tab orderiin** ✓
- setEnabled(true) riittää fokukselle
- FocusPolicy on vain QLineEditille
- Tab order ei ole konfiguroitavissa

#### `b08-qt-widgets-menubar` · diff 2

Desktop-sovelluksessa päävalikko puuttuu macOS:llä vaikka QMenuBar on luotu. Tyypillinen syy?

- **macOS siirtää menu barin järjestelmän yläreunaan — setNativeMenuBar(true)** ✓
- QMenuBar ei toimi macOS:llä
- Menu pitää piirtää manuaalisesti QPainterilla
- Vain QML tukee valikoita

#### `b08-qt-widgets-qstacked` · diff 2

Wizard-UI: useita sivuja yhdessä ikkunassa — vain yksi näkyvissä kerrallaan. Widget?

- **QStackedWidget — setCurrentIndex vaihtaa sivua** ✓
- QTabBar ilman QStackedWidgetia riittää
- hide/show kaikki ikkunat erikseen
- QSplitter wizardeihin

#### `b08-qt-widgets-tooltip-delay` · diff 2

Tooltip tulee liian hitaasti QA-testaajille. Mitä Qt-sovelluksessa säädät?

- **QToolTip::setFont / QApplication style sheet tai showDelay platformista — toolTipDuration** ✓
- Tooltip-delay ei ole konfiguroitavissa
- Vain mouseTracking riittää
- QLabel korvaa tooltipin aina

#### `b09-qt-widgets-focus-tab` · diff 2

Lomakkeessa tab-järjestys hyppii satunnaisesti. Mitä tarkistat?

- **setTabOrder() widgettien välillä — focus chain** ✓
- setFocusPolicy(Qt::NoFocus) kaikille
- Tab order on automaattinen aina oikein
- QTimer::singleShot korjaa tabin

#### `b09-qt-widgets-size-policy` · diff 2

QFormLayoutissa label venyy turhaan ikkunan leveydessä — input-kenttä jää kapeaksi. Korjaus?

- **setSizePolicy(QSizePolicy::Fixed/Preferred) labelille tai stretch oikein** ✓
- setFixedSize koko ikkunalle
- Poista layout — käytä move()
- SizePolicy ei vaikuta layouteihin

#### `b09-qt-widgets-splitter-state` · diff 3

Käyttäjä säätää paneelien kokoa QSplitterillä — asetus katoaa restartissa. Ratkaisu?

- **Tallenna restoreState()/saveState() QSettingsiin session välillä** ✓
- setFixedSize splitterille
- QSplitter ei tue tilan tallennusta
- resize() resizeEventissä riittää

#### `exp-qt-widgets-layout-crash` · diff 3

Code review: QDialog luodaan stackissa ilman parenttia ja deleteLater kutsutaan väärässä järjestyksessä — crash suljettaessa. Mitä ehdotat?

- **Anna parent QWidget* — Qt hallitsee elinkaaren automaattisesti** ✓
- Käytä raw new ilman parenttia aina
- Poista closeEvent override
- Vaihda QML:ään ilman syytä

#### `exp-qt-widgets-size-hint` · diff 3

Custom widget leikkaa tekstiä eri DPI:llä. Mikä metodi pitää overridata layoutin oikeaa kokoa varten?

- **sizeHint() ja mahdollisesti minimumSizeHint()** ✓
- Vain resize(100,100) konstruktorissa
- paintEvent riittää koon määrittelyyn
- setFixedSize kaikille alustoille

#### `qt-widgets-parent` · diff 2

Miksi QWidget:lle annetaan parent-osoitin konstruktorissa?

- **Automaattinen muistinhallinta ja hierarkkinen layout** ✓
- Parent pakottaa widgetin näkyväksi
- Ilman parentia widget on aina modal
- Parent korvaa QApplicationin

## scrum (142)

### scrum-dod (25)

#### `b02-scrum-dod-demo-01` · diff 2

Tiimi väittää tarina valmiiksi koska koodi on mergattu. DoD vaatii demottavuuden. Mitä puuttuu?

- **Incrment on testattu ja esiteltävissä stakeholderille — pelkkä merge ei riitä** ✓
- Vain code review
- Dokumentaatio vapaaehtoista
- Deploy tuotantoon pakollinen aina

#### `b02-scrum-dod-perf-02` · diff 3

Uusi API hidastaa raporttia 10× — tarina 'done' ilman suorituskykytestiä. Miten DoD auttaa?

- **DoD voi sisältää NFR-kriteerit (esim. p95 < 200ms) — ei hyväksytä ilman** ✓
- Suorituskyky on aina erillinen projekti
- PO hyväksyy aina hidastuksen
- DoD koskee vain unit testejä

#### `b02-scrum-dod-rollback-03` · diff 4

Tuotantoon mennyt feature ei täytä DoD:ia — miten tiimi reagoi sprintin jälkeen?

- **Palautetaan backlogiin/tekninen velka korjataan — DoD on minimi laatu** ✓
- Merkitään done koska jo deployattu
- Piilotetaan bugi
- Peru sprintti aina

#### `b03-scrum-dod-automation-gate` · diff 3

Tuotantoon pääsee regressio koska DoD ei vaadi CI:tä. Mitä lisätte DoD:hen?

- **Automaattiset testit vihreänä CI:ssä ennen mergeä / releaseä** ✓
- Manuaalinen 'works on my machine' -check
- DoD on vain dokumentaatiolle
- Testit ajetaan kerran vuodessa

#### `b03-scrum-increment-done-criteria` · diff 3

Sprintin lopussa 'melkein valmis' feature demoissaan mutta ei tuotantokelpoista. Mikä artefakti puuttuu?

- **Selkeä Definition of Done jota koko tiimi noudattaa incrementissä** ✓
- Erillinen QA-tiimi sprintin jälkeen
- Pidemmät sprintit
- Vain PO:n suullinen hyväksyntä

#### `b04-scrum-dod-regression-gate` · diff 3

Tuotantoon meni regressio koska DoD ei sisällä automaattista testiporttia. Mitä tiimi lisää DoD:hen?

- **CI:ssä vihreä regressiotestisarja ennen mergeä/incrementtiä** ✓
- Vain manuaalinen smoke test kerran kuussa
- DoD on vain PO:n henkilökohtainen lista
- Regressio kuuluu seuraavaan sprinttiin

#### `b05-scrum-dod-automated` · diff 3

Tiimi merkitsee tarinan Done vaikka CI-testit eivät ole vihreitä. Mikä DoD-kriteeri puuttuu?

- **Automaattiset testit läpi — increment on releasable quality** ✓
- Koodin rivimäärä raportoitu
- Vain manuaalinen smoke test riittää aina
- DoD on vain suositus kehittäjille

#### `b05-scrum-dod-deploy` · diff 4

Feature on testattu stagingissa mutta deploy-skripti puuttuu. Voiko tarina olla Done?

- **Ei — DoD sisältää mitä releasable tarkoittaa tiimille, usein deploy-valmius** ✓
- Kyllä — dev-valmis riittää Doneen
- Kyllä — deploy on erillinen epic
- Done riippuu vain PO:n hyväksynnästä

#### `b06-scrum-dod-docs-deploy` · diff 4

Tiimi julkaisee API-muutoksen ilman runbook-päivitystä. Onko tämä shippable increment?

- **Ei jos DoD sisältää dokumentaation ja deploy-valmiuden** ✓
- Kyllä — koodi tuotannossa riittää
- Dokumentaatio on aina PO:n vastuu erillisen sprintin
- DoD kattaa vain unit-testit

#### `b06-scrum-dod-regression-gate` · diff 3

Feature on 'valmis' mutta regressiotestit punaisena. Täyttää increment DoD:ä?

- **Ei — DoD vaatii että increment on valmis ja toimiva** ✓
- Kyllä jos feature manuaalisesti testattu
- DoD on vain PO:n subjektiivinen arvio
- Regressiot korjataan seuraavassa sprintissä — OK

#### `b07-scrum-dod-documentation` · diff 3

Feature on tuotannossa mutta API-dokumentaatio puuttuu. Onko increment Done?

- **Ei — DoD määrittää mitä valmis tarkoittaa, usein dokumentaatio mukana** ✓
- Kyllä — koodi riittää
- Dokumentaatio on erillinen epic aina
- Done riippuu vain testeistä

#### `b07-scrum-dod-tech-debt` · diff 4

Kiireessä jätettiin refaktorointi ja TODO-kommentit — PO haluaa merkitä Done. Miten DoD auttaa?

- **DoD on sitova — tekninen velka ei läpäise jos kriteerit eivät täyty** ✓
- PO voi ohittaa DoD:n
- Done tarkoittaa aina deployed
- TODO-kommentit kuuluvat aina tuotantoon

#### `b08-scrum-dod-automated-tests` · diff 3

Increment merkitään valmiiksi, mutta regressiotestit ajetaan manuaalisesti viikon päästä. Rikkooko DoD?

- **Kyllä — DoD määrittää mitä 'valmis' tarkoittaa; automaatio kuuluu yleensä DoD:hen** ✓
- DoD on vain PO:n mielipide
- Manuaalinen testaus sprintin jälkeen riittää aina
- DoD koskee vain dokumentaatiota

#### `b08-scrum-dod-security-gate` · diff 4

Turvallisuusaudit vaatii SAST-skannauksen ennen releasetta. Minne se kuuluu Scrumissa?

- **Definition of Done — kaikki incrementit täyttävät saman laatuportin** ✓
- Erillinen waterfall-vaihe releasen jälkeen
- Vain security-tiimin checklist sprintin ulkopuolella
- DoD koskee vain tuotantobugeja

#### `b08-scrum-transparency-artifacts` · diff 3

Stakeholder ei näe mitä on todella valmista — vain PowerPoint. Mikä Scrum-arvo puuttuu?

- **Transparency — artifactit ja increment näkyvissä ja ymmärrettävissä** ✓
- Velocity riittää läpinäkyvyyteen
- Transparency tarkoittaa avointa toimistoa
- Vain PO tarvitsee nähdä incrementin

#### `b09-scrum-dod-documentation` · diff 3

Feature on testattu mutta API-dokumentaatio puuttuu — tiimi haluaa merkitä Done. DoD?

- **Ei Done — DoD määrittää mitä dokumentaatio sisältää tiimille** ✓
- Done jos PO hyväksyy ilman docs
- Dokumentaatio on erillinen epic — ei DoD:ssa
- Vain koodi riittää Doneen aina

#### `b09-scrum-dod-security-scan` · diff 4

Tuotantoon menevä increment — DoD:ssa vaaditaan turvallisuustarkistus. Mikä kuuluu?

- **SAST/dependency scan CI:ssä — kriittiset löydökset korjattu ennen Done** ✓
- Turvallisuus on erillinen audit vuoden välein
- Pen test jokaiselle user storylle
- DoD ei koske turvallisuutta

#### `exp-scrum-dod-docs-minimum` · diff 3

Operaatio valittaa puuttuvasta runbookista incidentin jälkeen. Mitä DoD voisi vaatia?

- **Päivitetty operatiivinen dokumentaatio user-visible muutoksille** ✓
- Vain koodi riittää — docs myöhemmin
- Wiki-artikkeli kerran vuodessa
- DoD kieltää dokumentoinnin hidastavana

#### `exp-scrum-dod-regression-suite` · diff 4

Tuotantoon meni bugi joka olisi kaatunut regressiotestissä. Mitä DoD:iin lisätte?

- **Automaattiset regressiotestit vihreänä ennen Donea** ✓
- Manuaalinen smoke vain release-viikolla
- DoD ei koske testausta
- Hotfix-prosessi korvaa DoD:n

#### `exp-scrum-dod-security-review` · diff 4

Turvallisuustiimi löysi OWASP-aukko sprintin jälkeen. Miten DoD estää toistumisen?

- **Security checklist / SAST gate osana DoD:ta relevanteille tarinoille** ✓
- Turvallisuus vain erillisessä hardening-sprintissä
- DoD koskee vain dokumentaatiota
- Pen test kerran vuodessa riittää

#### `scrum-dod-automated-tests` · diff 4

Tiimi debateaa DoD:stä. Mikä kuuluu tyypillisesti moderniin Definition of Done -listaan?

- **Automaattiset testit ajettu ja läpäisty CI:ssä** ✓
- Vain manuaalinen smoke test tuotannossa
- Testaus vasta release-haarassa
- QA testaa vasta seuraavassa sprintissä

#### `scrum-dod-no-partial` · diff 3

Sprint review lähestyy. Tarina täyttää 4/5 DoD-kohtaa. Miten Scrum-best-practices käsittelee tilanteen?

- **Ei Done — kaikki DoD-kriteerit täyttyvät tai tarina ei valmis** ✓
- 80 % Done riittää velocityyn
- Merkitään Done ja korjataan jälkikäteen
- PO voi alittaa DoD:n hätätilanteessa

#### `scrum-dod-shippable` · diff 3

Mikä on Definition of Done -listan ydinvaatimus jokaiselle sprintin valmiille tarinalle?

- **Inkrementti on tuotantokelpoinen ja integroitu** ✓
- Dev on merkinnyt Jiran Done-tilaan
- PO on hyväksynyt demossa suullisesti
- Koodi on pushattu feature-branchiin

#### `scrum-dod-team-ownership` · diff 4

Kuka omistaa ja päivittää Definition of Done -listan Scrumissa?

- **Koko Scrum-tiimi yhdessä** ✓
- Vain Scrum Master yksin
- Vain QA-päällikkö
- Ulkoistettu auditointitiimi

#### `scrum-dod-tech-debt` · diff 5

Tekninen velka kasvaa. Miten DoD auttaa hallitsemaan sitä sprinttitasolla?

- **DoD määrittelee minimilaadun — velkaa ei piiloteta Done-merkintään** ✓
- DoD ohitetaan kun deadline lähestyy
- Velka kirjataan erilliseen 'Done-lite' -tilaan
- DoD koskee vain uutta koodia, ei refaktorointia

### scrum-dor (29)

#### `b02-scrum-dor-deps-05` · diff 3

Tarina riippuu toisen tiimin API:sta jota ei ole vielä olemassa. DoR-tilanne?

- **Ei Ready — riippuvuus ratkaistava tai mockattava ennen sprint commitmentia** ✓
- Ready koska PO haluaa
- Odota sprintin loppua
- Aloita koodaus ja toivo

#### `b02-scrum-dor-size-06` · diff 2

Backlog-item on 21 story pointia — tiimi ei saa valmiiksi yhdessä sprintissä. Refinement-toimenpide?

- **Pilko pienempiin tarinoihin joiden jokainen tuottaa arvoa** ✓
- Kasvata sprintin pituutta
- Jätä isoksi — velocity korjaa
- Poista acceptance criteria

#### `b02-scrum-dor-spike-04` · diff 3

Tarina: 'Tutki miksi integraatio kaatuu' — ei acceptance criteriaa. Refinementissa mitä tehdään?

- **Spike/timebox tutkimus — DoR vaatii riittävän ymmärryksen ennen sprinttiin ottoa** ✓
- Otetaan suoraan sprinttiin ilman rajoja
- Hylätään kaikki tutkimustyö
- PO kirjoittaa koodin

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

#### `b05-scrum-dor-dependency` · diff 4

Tarinalla on riippuvuus ulkoiseen API:hin jota ei ole vielä saatavilla. Otetaanko sprinttiin?

- **Ei — riippuvuus ratkaistava tai mockattava ennen DoR:n täyttymistä** ✓
- Kyllä — tiimi odottaa API:a sprintin ajan
- Kyllä — riippuvuudet eivät kuulu DoR:ään
- Siirretään automaattisesti seuraavaan vuoteen

#### `b05-scrum-dor-refinement` · diff 2

Product Backlog refinement venyy koko sprintin mittaiseksi projektiksi. Mikä on tavoite?

- **Valmistella tulevia tarinoita niin että ne täyttävät DoR:n kun tarvitaan** ✓
- Suunnitella koko vuoden työt kerralla
- Korvata sprint planning kokonaan
- Vain PO työskentelee yksin refinementissa

#### `b05-scrum-dor-unclear-story` · diff 3

Tarinan acceptance criteria on 'toimii hyvin'. Sprint planningissa kehittäjät arvailevat. Mitä DoR vaatii?

- **Selkeät, testattavat hyväksymiskriteerit ennen sprinttiin ottamista** ✓
- Vain story point -arvo riittää
- DoR on valinnainen jos PO on kiireinen
- Kriteerit kirjoitetaan vasta sprintin jälkeen

#### `b06-scrum-backlog-refine-ready` · diff 3

Sprint Planning venyy koska user storyt ovat epämääräisiä. Mitä refinement tuottaa?

- **Selkeät, arvioitavat ja testattavat itemit — ready for sprint** ✓
- Täydellinen tekninen design ennen planningia
- Vain PO:n hyväksyntä ilman tiimin osallistumista
- Refinement korvaa sprint planning

#### `b06-scrum-dor-unclear-ac` · diff 3

Story alkaa sprintissä — acceptance criteria puuttuu. Mitä Definition of Ready vaatii?

- **Selkeät acceptance criteria ennen sprintin aloitusta** ✓
- AC voidaan kirjoittaa sprintin lopussa
- Vain story point riittää DoR:ssa
- DoR on vain Scrum Masterin checklist

#### `b07-scrum-dor-design` · diff 4

Sprint alkaa — arkkitehtuurisia avoimia kysymyksiä on vielä kolme. Pitäisikö tarina ollut sprintissä?

- **Ei — DoR vaatii riittävän ymmärryksen ennen sprinttiin ottamista** ✓
- Kyllä — sprintissä ratkaistaan kaikki
- Arkkitehtuuri ei kuulu DoR:ään
- PO päättää ohittaa DoR

#### `b07-scrum-dor-sized` · diff 3

Epic otetaan suoraan sprinttiin ilman pilkkomista. Mitä DoR vaatii ennen sprinttiin ottamista?

- **Tarina on riittävän pieni arvioitavaksi ja toteutettavaksi yhdessä sprintissä** ✓
- Epic on aina sprint-valmis
- DoR ei koske kokoa
- Vain PO arvioi koon sprintin jälkeen

#### `b07-scrum-dor-testable` · diff 3

Tarinassa lukee käyttäjä on tyytyväinen. QA kieltäytyy hyväksymästä. Mikä DoR-elementti puuttui?

- **Testattavat acceptance criteria — objektiivinen valmis-määritelmä** ✓
- Story pointit riittävät
- DoR ei koske testattavuutta
- QA testaa vasta seuraavassa sprintissä

#### `b08-scrum-backlog-refinement` · diff 3

Sprint Planning venyy koska itemit eivät ole valmiita. Milloin backlog-refinement pitäisi tehdä?

- **Jatkuvasti sprintin aikana — ei erillinen pakollinen event, mutta jatkuva työ** ✓
- Vain kerran vuodessa
- Refinement korvaa Sprint Planningin
- Vain Scrum Master refineaa

#### `b08-scrum-dor-testable` · diff 2

Backlog-item: 'Paranna suorituskykyä' — tiimi ei voi aloittaa. Mikä DoR-elementti puuttuu?

- **Testattavat acceptance criteria — selkeä valmis-määritelmä** ✓
- Story pointit riittävät DoR:lle
- DoR koskee vain bugfixejä
- PO ei tarvitse selittää itemiä

#### `b09-scrum-dor-size-limit` · diff 3

Tarinan arvio on 21 story pointia — tiimi epäilee liian suurta sprinttiin. DoR-ratkaisu?

- **Pilko tarina pienemmiksi, jokainen täyttää DoR:n ennen sprinttiin ottamista** ✓
- Ota sprinttiin — jaetaan kahdelle kehittäjälle
- Story pointit eivät vaikuta DoR:ään
- Kasvata sprintin pituus 4 viikkoon

#### `b09-scrum-dor-spike-needed` · diff 4

Tarinassa tekninen riski on korkea — arkkitehtuuria ei tunneta. Mitä ennen varsinaista feature-tarinoita?

- **Spike-tutkimustarina — aikarajattu oppiminen, tulos dokumentoidaan** ✓
- Arvaa story pointit ja aloita
- Spike on waste — koodaa suoraan
- PO ratkaisee teknisen riskin yksin

#### `b09-scrum-dor-ux-mockup` · diff 2

UI-tarinassa kehittäjät arvailevat layoutia. Mikä DoR-elementti puuttuu?

- **Mockup, wireframe tai selkeä UX-kuvaus hyväksymiskriteereineen** ✓
- Vain backend API-dokumentaatio
- Story point riittää UI-tarinoissa
- Kehittäjä suunnittelee UX:n sprintin aikana

#### `b10-scrum-dor-spike-01` · diff 4

Tarinassa on suuri tekninen epävarmuus ennen estimointia. Mitä Scrum-best-practices suosittelee?

- **Aikarajattu spike / tutkimustarina ennen varsinaista toteutusta** ✓
- Arvioi aina 13 pistettä ja toivo parasta
- Ohita DoR kun kiire
- Spike korvaa acceptance criteria kokonaan

#### `exp-scrum-dor-acceptance-tests` · diff 3

Tarinalla on otsikko mutta ei hyväksymiskriteereitä. Sprint planningissa mitä teette?

- **Ei sprinttiin — DoR vaatii selkeät acceptance criteria** ✓
- Aloitetaan koodaus — kriteerit myöhemmin
- PO kirjoittaa kriteerit sprintin jälkeen
- QA arvailee kriteerit tuotannossa

#### `exp-scrum-dor-refinement-timebox` · diff 3

Backlog refinement syö 30 % sprintin kapasiteetista. Mitä best practice suosittelee?

- **Timeboxaa refinement (~10 % kapasiteetista) ja priorisoi valmiiksi seuraava sprint** ✓
- Lopeta refinement — kaikki planningissa
- Refinement vain kerran vuodessa
- Vain PO tekee refinementin yksin

#### `exp-scrum-dor-split-story` · diff 3

Backlog refinementissa tarina on 21 pistettä ja epäselvä. Mitä DoR-best practice sanoo?

- **Pilko tarina pienempiin ennen sprinttiin ottoa** ✓
- Ota sprinttiin — suurempi on tehokkaampi
- Poista estimointi kokonaan
- Siirrä seuraavaan quarteriin ilman pilkkomista

#### `scrum-dor-criteria` · diff 3

Mikä kuuluu Definition of Ready -kriteereihin ennen kuin tarina otetaan sprinttiin?

- **Hyväksymiskriteerit ja arvioitavissa oleva koko** ✓
- Kaikki tuotantodata migroitu
- Koko epic toteutettu
- Release note julkaistu

#### `scrum-story-split` · diff 4

Epic on liian iso estimointiin. Mikä pilkkomistapa leikkaa **liiketoiminta-kerroksia** pystysuunnassa?

- **Vertical split — ohittaa kaikki arkkitehtuurikerrokset** ✓
- Vain UI ensin, API ei koskaan
- Kaikki edge caset samaan tarinaan
- Spike korvaa aina acceptance criteria

### scrum-estimation (21)

#### `b02-scrum-estimation-anchor-08` · diff 3

Planning pokerissa kaikki kortit eri — keskustelu pysähtyy. Facilitointi-jatko?

- **Kysy ääripäiden perustelut — uusi kierros kunnes konsensus** ✓
- Ota keskiarvo automaattisesti
- PO päättää yksin
- Ohita tarina

#### `b02-scrum-estimation-relative-07` · diff 2

Manageri vaatii tuntiarvioita sprintille. Scrum-muotoilu suhteellisesta arviosta?

- **Story pointit kuvaavat suhteellista vaivaa — absoluuttiset tunnit eivät ole sprintin mittari** ✓
- Muunna pisteet tunteihin julkisesti
- Velocity = henkilöpäivät
- Estimointi kielletty

#### `b02-scrum-estimation-velocity-09` · diff 3

Stakeholder vertaa kahden tiimin velocitya suunnittelussa. Miksi se on harhaanjohtavaa?

- **Pisteet ovat tiimikohtaisia — vertailu eri skaaloilla ei kerro tuottavuutta** ✓
- Velocity on absoluuttinen mittari
- Suurempi velocity = parempi tiimi aina
- Velocity korvaa laadun

#### `b03-scrum-estimation-relative` · diff 2

Stakeholder vaatii tuntiarvioita sprint-suunnitteluun. Miksi tiimi käyttää story pointeja?

- **Suhteellinen estimointi — vertaa tarinoita toisiinsa, ei lupaa tunteja** ✓
- Story point = tunti × 1.5
- Tuntiarvio on Scrumissa pakollinen
- Pointit korvaavat velocityn

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

#### `b05-scrum-estimation-planning-poker` · diff 3

Yksi senior-kehittäjä dominoi estimointikeskustelua. Mikä tekniikka tasoittaa näkemyksiä?

- **Planning poker — yksilöarvio ennen keskustelua paljastaa erot** ✓
- Seniorin arvio on aina oikea
- PO arvioi yksin nopeuden vuoksi
- Estimointi skipataan jos tarina on pieni

#### `b05-scrum-estimation-relative` · diff 2

Johdon raportti vaatii story pointit muunnettuna tunteiksi. Mitä Scrum suosittelee?

- **Story pointit ovat suhteellisia — eivät tunteja tai kalenteripäiviä** ✓
- 1 story point = 8 tuntia aina
- Velocity on kiinteä sopimus johdon kanssa
- Estimointi tehdään vain PO:n toimesta

#### `b06-scrum-estimation-relative` · diff 3

Manageri vaatii story pointien muunnosta tunteihin raportointia. Miksi tämä on riski?

- **Story pointit ovat suhteellisia — tuntimuunnos vääristää ennustetta** ✓
- Story point = tunti Scrum Guidessa
- Velocity on lupaus stakeholderille
- Suhteellinen arvio ei skaalaa

#### `b06-scrum-velocity-forecast` · diff 3

Stakeholder kysyy release-päivämäärää. Miten velocity auttaa?

- **Ennuste historiasta — ei lupaus, vaan forecast empirisesti** ✓
- Velocity × sprintit = tarkka päivämäärä
- Velocity korvaa product roadmap
- Ensimmäisen sprintin velocity on riittävä

#### `b07-scrum-estimation-spikes` · diff 4

Tuntematon integraatio — tiimi arvioi 13 story pointia arvalla. Miten vähennät epävarmuutta ennen sprinttiä?

- **Spike tai tutkimustask refinementissa — rajattu aika tietojen keräämiseen** ✓
- Arvioi aina 21 pointtia
- Skip estimointi
- Ota suoraan sprinttiin ja katsotaan

#### `b07-scrum-estimation-velocity` · diff 3

Johto käyttää velocitya kiinteänä deadline-laskelmana seuraavalle vuodelle. Mikä on ongelma?

- **Velocity on empirinen mitta — ei sitoumus tai kapasiteettilupaus** ✓
- Velocity on sopimus johdon kanssa
- Velocity mitataan tunteina
- Velocity ei muutu koskaan

#### `b08-scrum-estimation-relative` · diff 2

Stakeholder vaatii story pointien muuttamista tunneiksi raportointia varten. Miksi se on huono idea?

- **Story pointit ovat suhteellisia — tunnit vääristävät vertailua ja nopeutta** ✓
- Story pointit ovat virallisesti tunteja
- Velocity lasketaan aina tunneissa
- Estimaatio on PO:n yksinomainen tehtävä

#### `b08-scrum-velocity-trend` · diff 3

Johto vertaa tiimien velocityä suorituskykymittarina. Miksi se on riskialtista?

- **Velocity on suunnitteluavustin, ei tuottavuus-KPI — vertailu vääristää estimointia** ✓
- Velocity on virallinen HR-mittari
- Korkein velocity = paras tiimi aina
- Velocity mitataan tunteina

#### `b09-scrum-tshirt-sizing` · diff 2

Backlogissa on satoja karkeita ideoita — tarkka story point -arvo tuntuisi turhalta. Menetelmä?

- **T-shirt sizing (S/M/L) — suhteellinen karkea estimointi refinementissa** ✓
- Kaikki 1 point — yksinkertaisuus
- Ohita estimointi kokonaan
- Vain tuntiarvio jokaiselle

#### `b09-scrum-velocity-fluctuation` · diff 3

Velocity putosi 40 % yhden kehittäjän loman jälkeen. Miten tulkitset trendiä?

- **Velocity on indikaattori — kapasiteetti vaihtelee, älä käytä kiinteänä lupauksena** ✓
- Tiimi laiskottelee — vaadi sama velocity
- Velocity on bugi — poista estimointi
- Lasketaan velocity tunteina johdolle

#### `exp-scrum-estimation-no-hours` · diff 2

Projektipäällikkö vaatii story pointien muuntamista tunteihin raporttia varten. Mitä best practice suosittelee?

- **Story pointit ovat suhteellisia — älä käytä tunteja sprintin sisällä** ✓
- 1 point = 8 tuntia aina
- Estimointi tapahtuu vain tunneissa
- Velocity on sama kuin capacity tunneissa

#### `exp-scrum-estimation-planning-poker` · diff 3

Estimaatiossa yksi senior dominoi keskustelua. Miten fasilitoit tasapuolisemman session?

- **Planning poker — yksilöarvio ensin, sitten keskustelu** ✓
- Senior päättää lopullisen numeron
- Ohitetaan estimointi kokonaan
- Kaikki sanovat saman numeron nopeasti

#### `scrum-planning-poker` · diff 4

Miksi planning poker toimii paremmin kuin yhden henkilön arvio?

- **Piilotetut arviot + cross-functional asiantuntijat** ✓
- PO arvioi aina yksin nopeammin
- Story pointit muuttuvat absoluuttisiksi tunneiksi
- Subtaskien tunnit korvaavat tarinan arvon

#### `scrum-velocity-range` · diff 5

Kun vain 2 sprinttiä on mitattu, mikä velocity-varianssi on realistinen (low/high kerroin)?

- **Noin 0.8 – 1.25 historiadatasta** ✓
- Täsmälleen 1.0 aina
- 0.3 – 3.0 on normaalia
- Velocity mitataan vain ensimmäisestä sprintistä lopullisena

### scrum-sprint (45)

#### `b02-scrum-sprint-daily-11` · diff 2

Daily kestää 45 minuuttia statusraportteja managerille. Miten Scrum Master korjaa?

- **Palauta 15 min timebox — kehittäjät synkkaavat työtä, ei raportoi ylöspäin** ✓
- Peru daily kokonaan
- Kirjoita status sähköpostiin
- Lisää agenda-slideja

#### `b02-scrum-sprint-goal-10` · diff 2

Sprintin aikana tiimi keskittyy yksittäisiin taskeihin ilman yhteistä suuntaa. Mikä Scrum-elementti puuttuu?

- **Sprint Goal — yhteinen tavoite joka ohjaa valintoja sprintin aikana** ✓
- Daily agenda PO:lta
- Gantt-kaavio
- Henkilökohtaiset OKR:t

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

#### `b03-scrum-retro-action-item` · diff 2

Retrospektiivin jälkeen parannusideoita ei seurata — sama ongelma toistuu. Mitä Scrum suosittelee?

- **Valitse 1–2 konkreettista toimenpidettä seuraavaan sprinttiin ja seuraa niitä** ✓
- Retrospektiivi korvataan kuukausittaisella raportilla
- SM toteuttaa kaikki ideat yksin
- Retro on vain kehittäjille — PO ei osallistu

#### `b03-scrum-sprint-goal-one` · diff 2

Sprintillä on viisi erillistä 'tavoitetta' eri tiimiosille. Mikä on Sprint Goal -ohje?

- **Yksi yhteinen sprint goal — yhdistää tiimin ja ohjaa dailya** ✓
- Jokaisella kehittäjällä oma goal
- Goal valitaan sprintin jälkeen
- Goal on valinnainen Scrumissa

#### `b04-scrum-daily-timebox` · diff 2

Daily Scrum venyy 45 minuuttiin tekniseksi debug-sessioksi. Mitä Scrum Guide sanoo?

- **Enintään 15 minuuttia — impedimentit käsitellään dailyn jälkeen** ✓
- Daily voi kestää tunnin jos paljon blokkeria
- Scrum Master päättää keston joka päivä
- Daily korvataan Slack-viesteillä

#### `b04-scrum-events-timebox` · diff 2

Uusi tiimi kysyy: 'Voimmeko skipata Sprint Review jos ei mitään uutta?' Vastaus Scrum Guiden mukaan?

- **Ei — kaikki viisi Scrum eventiä pidetään sprintin aikana timeboxattuna** ✓
- Kyllä jos velocity on korkea
- Vain joka toinen sprintti
- Review korvataan sähköpostilla

#### `b04-scrum-retro-action-items` · diff 3

Retrospektiivin jälkeen samat ongelmat toistuvat sprint toisensa jälkeen. Mikä puuttuu?

- **Konkreettiset parannustoimenpiteet omistajineen seuraavaan sprintiin** ✓
- Enemmän post-it-lappuja
- Retrospektiivin peruminen
- Vain Scrum Master puhuu

#### `b04-scrum-review-feedback` · diff 3

Sprint Review päättyy ilman stakeholder-palautetta — vain demot. Mitä Scrum Guide odottaa?

- **Collaboration: backlog päivittyy palautteen perusteella** ✓
- Review on vain show-and-tell ilman keskustelua
- Palaute kerätään seuraavassa retro:ssa
- Vain PO saa kommentoida

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

- **Valmis, DoD:n mukainen lisäarvo joka on mahdollisesti releasattavissa** ✓
- Kaikki koodatut branchit riippumatta testeistä
- Vain suunnitellut mutta keskeneräiset featuret
- Dokumentaatio ilman toimivaa ohjelmistoa

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

- **Empirismi — inspect ja adapt perustuen todelliseen edistymiseen** ✓
- Waterfall — muutokset vain release-vaiheessa
- Command and control — johto määrää parannukset
- Retrospektiivi on valinnainen jos velocity kasvaa

#### `b06-scrum-focus-one-goal` · diff 3

Sprintissä on viisi erillistä tavoitetta — tiimi hajaantuu. Mitä Scrum Guide suosittelee?

- **Yksi Sprint Goal — fokus ja yhteinen suunta sprintin aikana** ✓
- Mahdollisimman monta goalia — enemmän arvoa
- Goal vain Sprint Reviewissa — ei planningissa
- PO valitsee goalit ilman tiimin inputia

#### `b06-scrum-openness-blockers` · diff 2

Kehittäjä piilottaa impedimentin viikon — sprint goal vaarantuu. Mikä Scrum-value auttaa?

- **Openness — blokkerit nostetaan early dailyssa** ✓
- Focus — työskentele hiljaa blokkerin kanssa
- Courage — yksin ratkaise ilman tiimiä
- Commitment — blokkeri ei kuulu Scrumiin

#### `b06-scrum-sprint-cancellation` · diff 4

Markkinamuutos tekee sprintin tavoitteen merkityksettömäksi kesken sprintin. Mitä Scrum Guide sanoo?

- **Vain PO voivat peruuttaa sprintin — tiimi ja SM konsultoidaan** ✓
- Tiimi äänestää sprintin keskeytyksen
- Sprint ei koskaan peruuntuu — odota review
- Scrum Master peruuttaa sprintin yksin

#### `b06-scrum-stakeholder-review` · diff 2

Stakeholder haluaa nähdä edistymisen ilman teknistä deep-diveä. Mikä tapahtuma on oikea?

- **Sprint Review — increment ja palaute, ei statusraportti** ✓
- Daily Scrum stakeholderille
- Sprint Retrospective avoin kaikille
- Refinement meeting reviewin korvaajana

#### `b07-scrum-daily-devs-only` · diff 2

PO ja Scrum Master osallistuvat Daily Scrumiin. Kuka on tapahtuman omistaja?

- **Developers — Daily on heidän tapahtumansa sprint goalin edistymiseen** ✓
- Scrum Master johtaa ja jakaa tehtävät
- PO raportoi johdolle
- Stakeholderit omistavat dailyn

#### `b07-scrum-review-stakeholder` · diff 2

Sprint Review — kuka osallistuu ja miksi?

- **Scrum Team + stakeholderit — inspect increment ja adaptoi backlog** ✓
- Vain kehittäjät esittelevät PO:lle
- Review korvaa retrospektiivin
- Stakeholderit eivät saa osallistua

#### `b07-scrum-sprint-cancel` · diff 4

Markkinatilanne muuttui — PO haluaa keskeyttää sprintin kesken. Mitä Scrum Guide sanoo?

- **Vain PO voi peruuttaa Sprintin jos Sprint Goal menettää merkityksensä** ✓
- Scrum Master peruuttaa yksin
- Sprinttiä ei voi keskeyttää koskaan
- Tiimi äänestää sprintin peruutuksesta

#### `b07-scrum-sprint-goal-one` · diff 3

Sprint Planning tuottaa viisi erillistä tavoitetta eri tiimeille. Onko tämä Scrumia?

- **Ei — yksi Sprint Goal koko Scrum Teamille ohjaa yhteistä fokusta** ✓
- Kyllä — useampi tavoite on tehokkaampaa
- Kyllä — jokaisella kehittäjällä oma goal
- Sprint Goal on valinnainen

#### `b07-scrum-sprint-length` · diff 2

Johdon raportti vaatii sprintin pituudeksi aina kaksi viikkoa. Miten Scrum suhtautuu?

- **Sprint on enintään kuukausi — tiimi valitsee sopivan pituuden** ✓
- Kaksi viikkoa on pakollinen Scrumissa
- Sprint voi olla kuukausia
- PO päättää yksin sprintin pituuden

#### `b08-scrum-po-delegation` · diff 3

PO on lomalla kaksi viikkoa — backlog jää päivittämättä. Miten Scrum suhtautuu delegointiin?

- **PO voi delegoida, mutta säilyttää vastuun — nimeä selkeä edustaja** ✓
- Scrum Master korvaa PO:n automaattisesti
- Backlog jäädyttetään PO:n loman ajaksi
- Tiimi priorisoi itse ilman PO:ta

#### `b08-scrum-review-stakeholders` · diff 2

Sprint Review — kuka osallistuu ja mikä on tapahtuman tarkoitus?

- **Stakeholderit + tiimi — inspect increment ja adaptoi backlogia** ✓
- Vain kehittäjät raportoivat SM:lle
- Review korvaa retrospektiivin
- PO demoaa yksin ilman incrementtiä

#### `b08-scrum-sprint-cancel` · diff 4

Markkinatilanne muuttuu radikaalisti — sprintin tavoite on merkityksetön. Kuka voi peruuttaa sprintin?

- **Vain Product Owner voi peruuttaa sprintin tiimin kanssa neuvotellen** ✓
- Kuka tahansa kehittäjä voi peruuttaa sprintin
- Sprinttiä ei voi koskaan peruuttaa
- Scrum Master peruuttaa ilman PO:ta

#### `b08-scrum-sprint-goal-change` · diff 3

Kesken sprintin PO haluaa vaihtaa sprint goalin kokonaan uuteen featureen. Miten Scrum Guide suhtautuu?

- **Sprint goal ei vaihdu kevyesti — tiimi neuvottelee ja tarvittaessa peruuttaa sprintin** ✓
- PO voi vaihtaa goalin milloin tahansa ilman tiimin syytä
- Sprint goal on vain dokumentaatio — ei sitova
- Scrum Master päättää uuden goalin yksin

#### `b08-scrum-sprint-length` · diff 2

Tiimi haluaa vaihtaa sprint-pituuden 2 viikosta 1 viikkoon kesken kvartaalin. Mitä huomioida?

- **Sprint on enintään kuukausi — tiimi päättää pituuden, muutos vaatii sopeutusta eventteihin** ✓
- Sprint pitää olla aina 2 viikkoa
- Vain organisaatio voi muuttaa pituutta
- Sprint length ei vaikuta eventteihin

#### `b09-scrum-daily-blocker` · diff 2

Dailyssa kehittäjä kertoo esteen joka estää sprint goalin. Mitä tapahtuu daily:n jälkeen?

- **Estävä asia kirjataan ja SM/tiimi poistaa impedimentin — ei ratkaista dailyssa** ✓
- Daily venyy kunnes ongelma on korjattu
- Estettä ei mainita — vain valmistuneet tehtävät
- PO korjaa teknisen esteen itse

#### `b09-scrum-review-feedback` · diff 3

Sprint Reviewssa stakeholder ehdottaa uutta featurea suoraan kehittäjälle. Oikea prosessi?

- **Palaute Product Backlogiin — PO priorisoi ja tiimi arvioi seuraavassa planningissa** ✓
- Kehittäjä aloittaa heti seuraavana päivänä
- Scrum Master kirjoittaa tarinan
- Stakeholder lisää itemin suoraan Jiraan

#### `b09-scrum-scope-creep-mid` · diff 3

Kesken sprintin lisätään 'pieni' muutos joka kasvattaa työmäärää 30 %. Miten toimit?

- **Neuvottele PO:n kanssa — joko poista vastaavaa tai peruuta sprint scope** ✓
- Hyväksy hiljaa — tiimi tekee ylitöitä
- Lisää automaattisesti seuraavaan sprinttiin ilman keskustelua
- Scope creep on normaalia — ei toimenpiteitä

#### `b09-scrum-sprint-cancel` · diff 4

Markkinatilanne muuttui — sprintin tavoite on merkityksetön. Kuka voi peruuttaa sprintin?

- **Vain Product Owner — tiimi palauttaa Done-työn ja aloittaa uuden suunnittelun** ✓
- Scrum Master yksin
- Kuka tahansa kehittäjä
- Sprinttiä ei voi peruuttaa kesken

#### `b09-scrum-sprint-goal-change` · diff 4

Kesken sprintin PO haluaa vaihtaa sprint goalin kokonaan uuteen markkinatarpeeseen. Miten Scrum Guide ohjaa?

- **Sprint goal ei vaihdu kepeästi — tiimi neuvottelee uudelleen tai peruuttaa sprintin** ✓
- PO voi muuttaa goalia milloin tahansa ilman tiimiä
- Vaihda goal ja jatka — velocity korjaa
- Sprint goal on vain dokumentaatio — ei sitova

#### `exp-scrum-sprint-cancel` · diff 4

Markkinatilanne muuttuu — nykyinen sprint goal on merkityksetön. Kuka voi peruuttaa sprintin?

- **Vain Product Owner ennen ajan umpeutumista** ✓
- Kuka tahansa kehittäjä dailyssa
- Scrum Master yksin
- Sprinttiä ei voi koskaan peruuttaa

#### `exp-scrum-sprint-daily-focus` · diff 2

Daily kestää 45 minuuttia ja muuttuu debug-sessioksi. Miten SM ohjaa takaisin?

- **15 min plan sprint goalia kohti — yksityiskohtainen debug erikseen** ✓
- Peru daily kokonaan
- Kaikki avaavat laptoppinsa ja koodaavat
- Daily korvataan viikoittaisella statusraportilla

#### `exp-scrum-sprint-review-stakeholders` · diff 2

Sprint Review -tapahtumaan kutsutaan sidosryhmiä. Mikä on tapahtuman ydin?

- **Inspect increment + adaptoi backlog yhteistyössä sidosryhmien kanssa** ✓
- Statusraportti johdolle PowerPointilla
- Yksittäisten kehittäjien suoritusarviointi
- Retrospektiivi tuotannosta

#### `exp-scrum-sprint-scope-add` · diff 3

Sprintin puolivälissä tuoteomistaja tuo kriittisen lisätarinan. Mitä Scrum Guide suosittelee?

- **Tiimi neuvottelee vaikutuksen sprint goaliin — scope muuttuu vain yhteisymmärryksellä** ✓
- PO voi lisätä tarinoita yksin milloin tahansa
- Hylätään aina — sprint scope on lukittu lakiin
- Lisätään automaattisesti ilman arviointia

#### `scrum-dod-partial` · diff 4

Sprintin lopussa tarina on "99 % valmis" mutta QA ei ole hyväksynyt. Mitä Scrum-best-practices sanoo story pointeista?

- **Älä laske osittaisia pisteitä — tarina ei ole Done** ✓
- Lasketaan 0.9 × story pointit
- Merkitään Done jos dev sanoo "works for me"
- Siirretään pisteet seuraavaan sprinttiin automaattisesti

#### `scrum-multitask` · diff 4

Sprintin aikana paine kasvaa. Mitä priorisointiohjetta kannattaa noudattaa?

- **Vältä multitasking — korkea riski/arvo ensin** ✓
- Aloita helpoista low/low tehtävistä
- Kaikki WIP rajatta samanaikaisesti
- Uudet interruptit aina edelle

#### `scrum-retro` · diff 3

Mikä ceremonia on usein tärkein jatkuvaan parantamiseen?

- **Retrospektiivi — miten työskentelemme** ✓
- Daily ilman action itemeitä
- Vain sprint review asiakkaille
- Kick-off kerran vuodessa

#### `scrum-sprint-goal` · diff 3

Mikä on Sprint Goalin rooli sprintin aikana?

- **Antaa fokuksen ja joustaa scopeen kun esteitä tulee** ✓
- Korvaa product backlogin kokonaan
- On sama kuin yksittäisen tarinan acceptance criteria
- Määritellään vasta sprint reviewssa

### scrum-team (22)

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

- **Ei — Developers itseorganisoituvat työn sprint goalin saavuttamiseksi** ✓
- Kyllä — PL:n täytyy delegoida jokainen tehtävä
- Kyllä — Scrum Master jakaa tehtävät
- Kyllä — PO määrittää kuka tekee mitä

#### `b05-scrum-sm-impediment` · diff 3

Tiimin build-palvelin on ollut alhaalla kolme päivää. Kuka Scrum-roolissa poistaa esteen?

- **Scrum Master — coachaa ja auttaa poistamaan impedimenttejä** ✓
- Product Owner korjaa infran
- Ei kukaan — tiimi ratkaisee yksin aina
- Stakeholder dailyssa

#### `b06-scrum-cross-functional` · diff 2

Tiimi tarvitsee ulkopuolisen testaajan jokaisen sprintin lopussa. Onko tiimi cross-functional?

- **Ei — tiimin pitää sisältää kaikki taidot incrementin valmistamiseen** ✓
- Kyllä jos ulkopuolinen on samassa toimistossa
- Cross-functional tarkoittaa vain koodausta
- SM korvaa puuttuvat taidot

#### `b06-scrum-po-stakeholder` · diff 2

Stakeholder pyytää featurea suoraan kehittäjältä ohittamalla backlog. Kenen kanssa käsitellä?

- **Product Owner — yksi kanava backlog-muutoksille** ✓
- Kehittäjä toteuttaa jos on vapaa
- Scrum Master priorisoi pyynnöt
- CEO:n pyyntö menee aina sprintille

#### `b06-scrum-scrum-master-coaching` · diff 3

Tiimi pyytää Scrum Masteria ratkaista tekninen arkkitehtuurikiista. Mitä SM tekee?

- **Fasilitoi keskustelu — tiimi ratkaisee, SM coachaa prosessia** ✓
- Valitsee arkkitehtuuriratkaisun itse
- Eskaloi aina johtoon
- Kirjoittaa ratkaisun backlog-itemin

#### `b07-scrum-team-cross-functional` · diff 2

Tiimissä on vain backend-kehittäjiä — frontend odottaa erillistä tiimiä. Täyttääkö Scrum Team -vaatimuksen?

- **Ei — Scrum Team on cross-functional ja pystyy tuottamaan incrementin** ✓
- Kyllä — erikoistuminen on tehokkaampaa
- Cross-functional tarkoittaa vain soft skillsejä
- PO korvaa frontend-taidot

#### `b07-scrum-team-size` · diff 2

Organisaatio haluaa yhteen Scrum Teamiin 15 kehittäjää. Mitä Scrum Guide suosittelee?

- **Tyypillisesti 10 tai vähemmän — pienempi tiimi on ketterämpi** ✓
- 15 on minimi
- Tiimin koolla ei ole väliä
- Yli 20 on suositeltavaa

#### `b08-scrum-sm-impediment` · diff 2

Build-palvelin on ollut alhaalla kolme päivää — tiimi odottaa passiivisesti. Mikä on SM:n rooli?

- **Poistaa impedimentin tai eskaloida — SM palvelee tiimiä** ✓
- SM korjaa buildin itse aina
- Impedimentit eivät kuulu Scrumiin
- Odota seuraavaan retroon

#### `b08-scrum-team-self-organizing` · diff 2

Projektipäällikkö jakaa tehtävät kehittäjille yksitellen joka aamu. Mikä Scrum-periaate rikkoutuu?

- **Tiimi on itseorganisoituva — kehittäjät päättävät miten työ tehdään** ✓
- Scrum Master jakaa tehtävät
- PO delegoi tekniset tehtävät
- Ulkoisen PM:n ohjaus on pakollinen

#### `b09-scrum-cross-functional-gap` · diff 3

Tiimi tarvitsee aina ulkopuolisen testaajan ennen releasen merkitsemistä Done. Scrum-ongelma?

- **Tiimi ei ole cross-functional — DoD-kyvykkyys puuttuu tiimistä** ✓
- Ulkopuolinen QA on Scrumissa pakollinen
- Scrum Master testaa sprintin lopussa
- Ongelma on vain PO:n — ei tiimin

#### `b09-scrum-scrum-of-scrums` · diff 3

Viisi Scrum-tiimiä työskentelee samassa tuotteessa — riippuvuudet aiheuttavat viiveitä. Koordinaatio?

- **Scrum of Scrums — edustajat synkronoivat riippuvuudet ja estot** ✓
- Yksi mega-sprint kaikille
- PO koordinoi kaikkien tiimien dailyt
- Ei koordinaatiota — tiimit ovat itsenäisiä

#### `exp-scrum-team-po-authority` · diff 2

Kehittäjä haluaa priorisoida oman teknisen refaktoroinnin tuoteomistajan yli. Mikä rooli päättää backlog-järjestyksestä?

- **Product Owner — maximizes product value** ✓
- Tech lead yksin
- Scrum Master
- Eniten senior kehittäjä

#### `exp-scrum-team-sm-impediment` · diff 3

CI-putki on ollut punaisena kolme päivää ja hidastaa koko tiimiä. Scrum Masterin ensimmäinen tehtävä?

- **Poista impedimentti tai escaloi — SM palvelee tiimiä** ✓
- Kirjoita uudet user storyt
- Määritä sprint goal PO:n sijasta
- Odota että kehittäjä korjaa vapaa-ajallaan

#### `scrum-team-cross-functional` · diff 3

Mitä tarkoittaa että Scrum-tiimi on cross-functional?

- **Tiimillä on kaikki taidot tuottaa valmis inkrementti** ✓
- Jokainen dev osaa kaikkia kieliä
- Tiimi raportoi usealle esimiehelle
- Eri tiimit hoitavat dev/test/deploy erikseen

#### `scrum-team-size` · diff 3

Mikä on suositeltu Scrum-tiimin koko (devit) ennen koordinaatio-ongelmia?

- **Noin 7 ± 2 — yli 9 kasvattaa koordinaatiokuormaa** ✓
- Aina täsmälleen 15
- Mitä enemmän sitä parempi
- 2–3 riittää enterprise-projektiin

## security (4)

### web-security (4)

#### `prod-sec-csrf` · diff 4

Selain lähettää session-cookien automaattisesti myös haitalliselta sivulta tulevaan POST-pyyntöön. Mikä suoja?

- **CSRF-token tai SameSite-cookie-asetus** ✓
- CORS yksin riittää aina
- HTTPS poistaa CSRF:n
- Piilota lomake CSS:llä

#### `prod-sec-jwt-claims` · diff 4

API hyväksyy JWT:n tarkistamatta `exp`- ja `aud`-kenttiä. Mikä riski?

- **Vanhentunut tai väärälle palvelulle tarkoitettu token hyväksytään** ✓
- JWT ei voi koskaan vanhentua
- aud on vain dokumentaatiota
- exp tarkistetaan automaattisesti selaimessa

#### `prod-sec-password-hash` · diff 4

Salasanat tallennetaan SHA-256-hasheina ilman suolaa. Mikä parempi ratkaisu?

- **bcrypt/argon2/scrypt + suola ja sopiva kustannusparametri** ✓
- MD5 on nopeampi
- Base64 riittää salaukseksi
- Sama salainen avain kaikille salasanoille

#### `prod-sec-xss` · diff 3

Käyttäjän kommentti renderöidään HTML:ään ilman escapetusta. Mikä riski?

- **XSS — hyökkääjä voi ajaa JavaScriptiä uhrin selaimessa** ✓
- SQL injection kommenteissa
- CSRF vain GET-pyynnöissä
- Deadlock tietokannassa

