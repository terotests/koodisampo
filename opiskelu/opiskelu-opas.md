# Opiskeluopas

> **Ajantasainen opiskelulista:** katso [oppitunnit.md](oppitunnit.md) — sama rakenne kuin pelin `═══ OPISKELULISTA ═══`.

Laajempi taustamateriaali aiheittain. Jokainen luku vastaa yhtä aihekokonaisuutta — noin 1–2 sivua.

---

## 1. C++: säikeet ja lukitus (`cpp/threadability`)

### `std::mutex` lyhyeksi kriittiseksi alueeksi

**Turvallisin tapa:** RAII-lukitsin, esim. `std::lock_guard<std::mutex>` tai C++17:stä `std::scoped_lock<std::mutex>`.

```cpp
std::mutex m;
void update() {
    std::lock_guard lock(m);   // lukitus automaattisesti
    // kriittinen alue
}   // lukitus vapautuu automaattisesti, myös poikkeuksessa
```

**Miksi näin?** Manuaalinen `lock()` / `unlock()` on helppo unohtaa tai jättää poikkeuspolulle. RAII takaa, että lukko vapautuu aina. Useaan mutexiin: `std::scoped_lock lock(m1, m2)` — ei deadlockia järjestyksen takia.

**Vältä:** raakaa `mutex.lock()` ilman vastaavaa `unlock()`-ta.

### Singleton lazy-init useasta säikeestä

**Singleton** = ohjelmassa on vain yksi tietty olio (esim. `Database`, `Logger`).

**Lazy-init** = sitä ei luoda käynnistyksessä, vaan vasta kun sitä kutsutaan ensimmäisen kerran.

Ongelma syntyy, kun usea säie kutsuu singletonia samaan aikaan ensimmäistä kertaa:

```cpp
// Huono ilman suojaa — älä tee näin useasta säikeestä
Database* db = nullptr;

Database& getDb() {
    if (db == nullptr) {      // säie A ja B voivat molemmat päästä tänne
        db = new Database();  // → kaksi olioita tai data race
    }
    return *db;
}
```

Tarvitaan tapa sanoa: *vain yksi säie saa tehdä alustuksen, muut odottavat*. Siihen kaksi ratkaisua:

#### 1. `std::call_once` + `std::once_flag` (kysymyksen vastaus)

C++:n eksplisiittinen ”aja tämä koodi tasan kerran” -mekanismi:

- **`std::once_flag`** — lippu, joka muistaa onko alustus jo tehty
- **`std::call_once`** — kutsuu funktion vain kerran, vaikka monta säiettä yrittäisi samaan aikaan

```cpp
Database* db = nullptr;
std::once_flag db_once;

void initDb() {
    db = new Database();
}

Database& getDb() {
    std::call_once(db_once, initDb);  // initDb ajetaan vain kerran
    return *db;
}
```

Mitä tapahtuu: säie A aloittaa alustuksen, säie B odottaa sen valmistumista eikä aja `initDb()` uudestaan. Seuraavat kutsut ohittavat alustuksen kokonaan.

Sopii kun alustus on monimutkaista (useita vaiheita, eri funktio, globaali tila).

#### 2. Meyers singleton — staattinen paikallinen funktiossa

Yksinkertaisin tapa C++:ssa. `static` funktion sisällä tarkoittaa: olio luodaan vasta ensimmäisellä kutsulla, sitä on vain yksi, ja C++11:stä lähtien alustus on thread-safe:

```cpp
Database& getDb() {
    static Database inst;   // kääntäjä hoitaa kertaluonteisen alustuksen
    return inst;
}
```

Ero `call_once`-ratkaisuun: sinun ei tarvitse kirjoittaa `if (nullptr)` eikä `once_flag`-lippua — kieli hoitaa saman asian. Nimi tulee Scott Meyersin esittelemästä kuviosta.

#### Vertailu

| | `call_once` | Meyers (`static` funktiossa) |
|---|---|---|
| Ratkaisee | Kertaluonteinen alustus säikeissä | Sama |
| Miten | Sanot itse mitä ajetaan kerran | Kääntäjä hoitaa `static`-olion alustuksen |
| Milloin | Monimutkainen init | Yksinkertainen ”yksi olio, yksi funktio” |
| Kysymyksen vastaus | **Kyllä** (`std::call_once`) | Vaihtoehto käytännössä, ei virallinen vastaus |

---

## 2. C++: tyyli ja kääntöaikainen turvallisuus (`cpp/style`)

### Resurssia hallitseva luokka — miksi `= delete` kopioinnille?

`FileHandle` hallitsee **tiedostonkuvaajaa** (`fd_`) — käyttöjärjestelmän antamaa numeroa, jolla tiedosto on auki. Sitä voi olla vain **yksi omistaja kerrallaan**.

```cpp
class FileHandle {
    int fd_;
    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;
public:
    FileHandle(int fd) : fd_(fd) {}
    ~FileHandle() { close(fd_); }
};
```

#### Mitä `= delete` tekee?

C++ luo automaattisesti joitain operaatioita, ellei niitä estetä. Luokalle, jossa on destructor, kääntäjä generoi oletuksena myös:

- **copy constructor** — `FileHandle(const FileHandle&)` luo kopion
- **copy assignment** — `operator=` kopioi arvon toisesta objektista

`= delete` **poistaa nämä operaatiot käytöstä**. Jos joku yrittää kopioida, kääntäjä antaa **virheen heti**, ei ajonaikaisen bugin.

```cpp
FileHandle a(3);
FileHandle b = a;   // KÄÄNTÄJÄVIRHE: copy constructor on delete
FileHandle c(4);
c = a;              // KÄÄNTÄJÄVIRHE: copy assignment on delete
```

Ilman `= delete` nämä kääntyisivät — ja se olisi vaarallista.

#### Miksi kopiointi olisi vaarallista?

Kopio loisi **kaksi C++-oliota samalle `fd_`-numerolle**:

```cpp
// Jos kopiointi sallittaisiin (ÄLÄ TEE NÄIN):
FileHandle a(open("data.txt", O_RDONLY));  // fd_ = 3
FileHandle b = a;                          // b.fd_ = 3 (sama numero!)

// a tuhoutuu → close(3)
// b yhä käytössä → fd 3 on jo suljettu → undefined behavior
// b tuhoutuu → close(3) uudestaan → kaksoissulku
```

Eli joko **kaksoissulku** (sama fd suljetaan kahdesti) tai **roikkuva kuvaaja** (toinen sulkee, toinen yrittää lukea).

#### Mitä koodi tekee oikeasti?

| Osa | Merkitys |
|-----|----------|
| `int fd_` | Omistettu resurssi (avoin tiedosto) |
| `FileHandle(int fd)` | Ainoa tapa luoda — saat fd:n ulkoa, luokka ottaa vastuun |
| `~FileHandle()` | Sulkee fd:n kun objekti tuhoutuu (RAII) |
| `= delete` kopiolle | "Tätä resurssia ei voi jakaa kahdelle objektille" |

Luokka sanoo: **omistan tämän fd:n, vain minä suljen sen, eikä ketään toista kopiota saa olla**.

#### Rule of Five

Kun hallitset resurssin manuaalisesti (tiedosto, muisti, socket), sinun pitää tietoisesti päättää viidestä operaatiosta: destructor, copy constructor, copy assignment, move constructor, move assignment.

`FileHandle`:ssa destructor on määritelty, kopiointi estetty. Siirtoa (`move`) ei ole erikseen määritelty — tuotannossa usein määritellään myös `= delete` move-operaatioille tai toteutetaan siirto oikein.

Tämä on **Rule of Five** -ajattelua: älä anna kääntäjän tehdä vahingossa väärää asiaa resurssille.

### Luokka ei ole tarkoitettu perittäväksi, mutta siinä on `virtual`-metodeja

Käytä **`final`** luokkamäärittelyssä:

```cpp
class Parser final {
public:
    virtual void parse();
};
```

`final` estää perinnän ja kertoo lukijalle intentin. `virtual`-metodit voivat silti olla hyödyllisiä testattavuudelle (mock) tai sisäiselle polymorfialle rajatun API:n kautta.

### Implisiittinen muunnos: `foo(1024)` kääntyy `Bytes`-parametrille

**Korjaus:** `explicit`-konstruktori:

```cpp
struct Bytes {
    explicit Bytes(int n) : count(n) {}
};
```

`explicit` estää hiljaiset numeeriset muunnokset, jotka ovat usein bugeja.

### Virtuaalinen metodi aliluokassa ei koskaan kutsuta — kirjoitusvirhe parametreissä

**Korjaus:** `override`-avainsana:

```cpp
struct Base { virtual void f(int x); };
struct Derived : Base {
    void f(int x) override;   // kääntäjä varmistaa allekirjoituksen
    // void f(double x) override;  // ← KÄÄNTÄJÄVIRHE, ei piilota tarkoituksella
};
```

Ilman `override` uusi metodi **piilottaa** (`hide`) emon metodin eri signatuurilla — ajonaikainen polymorfismi ei toimi, ja virhe on vaikea huomata.

---

## 3. C++: ylläpidettävyys (`cpp/maintainability`)

### Headerin muutos pakottaa koko projektin uudelleenkäännön

**Kuvio: PIMPL** (Pointer to Implementation)

```cpp
// widget.h — kevyt, vakaa rajapinta
class Widget {
    struct Impl;
    std::unique_ptr<Impl> pimpl_;
public:
    Widget();
    ~Widget();
    void doWork();
};

// widget.cpp — toteutus ja riippuvuudet piilossa
struct Widget::Impl { /* raskas header-sisältö */ };
```

Käyttäjät includaavat vain ohuen `widget.h`:n. Toteutuksen muutokset eivät käynnistä massiivista uudelleenkäännöstä. Hintana: yksi indirektio ja dynaaminen allokaatio (tai `unique_ptr` hallinnassa).

---

## 4. C++: työkalut ja moderni rajapinta (`cpp/tools`)

### Value category — mitä se tarkoittaa?

Kun sanotaan että jokin on **lvalue** tai **rvalue**, tarkoitetaan: *millaisena arvo "elää" lauseessa* — voiko siihen viitata myöhemmin, vai onko se väliaikainen ja häviämässä.

Tämä ei ole sama asia kuin tyyppi (`int`, `std::string`). Sama muuttuja voi eri kontekstissa käyttäytyä eri tavoin.

#### lvalue — nimetty, pysyvä arvo

Arvolla on **nimi** ja se on käytettävissä useamman rivin ajan:

```cpp
std::string name = "Maija";   // name on lvalue
name += "!";                  // sama olio yhä olemassa
```

Voit ottaa osoitteen: `&name`. Kopiointi on luonteva valinta — alkuperäinen säilyy.

#### rvalue — väliaikainen arvo

Arvo on **tilapäinen** (usein lauseen lopussa tuhoutuva). Siihen ei yleensä viitata myöhemmin:

```cpp
std::string full = std::string("Maija") + "!";  // oikea puoli on rvalue
foo(std::move(name));                            // std::move(name) on rvalue
```

Rvaluesta voi usein **siirtää** (`move`) resursseja pois sen sijaan että kopioidaan — esim. sisäinen puskuri siirtyy uuteen objektiin.

#### Miksi tämä on tärkeää?

Konstruktorit ja funktiot voivat olla ylikuormitettu:

```cpp
void process(std::string s);              // ottaa kopion tai siirron
void process(const std::string& s);         // lukee ilman omistamista
void process(std::string&& s);              // siirto — haluaa rvaluen
```

Kutsu ratkaisee mitä tapahtuu:

```cpp
std::string a = "data";
process(a);                    // a on lvalue → usein kopiointi
process(std::string("data"));  // väliaikainen on rvalue → siirto mahdollinen
process(std::move(a));         // muutettu rvalueksi → siirto
```

**Yhteenveto:** lvalue = "tämä on tallessa, voit kopioida"; rvalue = "tämä katoaa pian, voit siirtää resurssit".

### `make<T>(Args&&... args)` — mikä säilyttää value categoryn?

#### Mitä `...` tarkoittaa? (`Args&&... args`)

Kyllä — `...` liittyy **muuttuvaan määrään argumentteja**, mutta C++:n **template**-versiossa (ei sama kuin C:n `printf(...)`).

Kaksi paikkaa rivissä `template<typename T, typename... Args>`:

| Syntaksi | Nimi | Merkitys |
|----------|------|----------|
| `typename... Args` | **tyyppipakka** | Nolla tai useampi tyyppi (esim. `std::string`, `int`) |
| `Args&&... args` | **parametripakka** | Nolla tai useampi funktioparametri, yksi per tyyppi |

Esimerkki kutsuista:

```cpp
make<User>();                          // Args = (tyhjä),   args = ei parametreja
make<User>("Maija");                   // Args = (const char* tai string), args = 1 kpl
make<User>("Maija", 42, true);         // Args = 3 tyyppiä, args = 3 parametria
```

`args` ei ole yksi array tai lista vaan **useita erillisiä parametreja**, jotka välitetään suoraan `T`:n konstruktorille — aivan kuin kirjoittaisit:

```cpp
new User("Maija", 42, true);
```

Kun `...` tulee lausekkeen **perään**, pakka **laajenee** (pack expansion):

```cpp
std::forward<Args>(args)...
// laajenee esim. kolmesta argumentista:
// std::forward<std::string>(arg1), std::forward<int>(arg2), std::forward<bool>(arg3)
```

Eli `...` tarkoittaa: *toista tämä jokaiselle paketin jäsenelle*.

#### Perfect forwarding

Kun `make` välittää argumentit eteenpäin konstruktorille, ongelma on: funktion sisällä parametrit ovat **nimetyt muuttujia** → ne muuttuvat lvalueiksi, vaikka kutsuja lähetti väliaikaisen arvon.

```cpp
make<User>(std::string("Maija"));  // kutsuja lähetti rvaluen
// make-funktion sisällä args olisi ilman forwardia lvalue → turha kopio
```

**Perfect forwarding:** `std::forward` palauttaa argumentin **alkuperäisessä** muodossaan — lvalue pysyy lvaluena, rvalue pysyy rvaluena.

```cpp
template<typename T, typename... Args>
std::unique_ptr<T> make(Args&&... args) {
    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
}
```

`Args&&` on **forwarding reference** (universaali viite): se sitoo sekä lvalue- että rvalue-argumentteihin. `std::forward` ratkaisee kumpi oli kyseessä ja välittää oikean viitetyypin `T`:n konstruktorille — ei turhia kopioita, mutta ei myöskään siirretä vahingossa pysyvää dataa.

#### Miksi tehdä `make`-funktio?

Kysymys on käytännössä: *miksi ei vain `new T(...)` tai `std::make_unique<T>(...)`?*

**Ilman `make`:**

```cpp
auto p = std::unique_ptr<User>(new User("Maija", 42));
```

Tämä toimii, mutta:

- `new` ja `unique_ptr` erillään — jos konstruktori heittää poikkeuksen, huolellinen koodi tarvitaan (tai `make_unique`)
- jokainen kutsukohta toistaa `new` + `unique_ptr`-yhdistelmän
- vaikea vaihtaa allokaatiotapaa myöhemmin

**`make` kapseloi luomisen yhteen paikkaan:**

```cpp
auto user = make<User>("Maija", 42);
```

Hyödyt:

1. **Mikä tahansa konstruktori** — template + `...` välittää argumentit suoraan `T`:lle. Ei tarvitse kirjoittaa erillistä factorya jokaiselle overloadille.

2. **Selkeä omistajuus** — palauttaa aina `unique_ptr<T>`. Kutsuja tietää: "sain omistetun olion, en raakaa osoitinta".

3. **Perfect forwarding** — `std::forward` varmistaa, että väliaikaiset arvot siirretään eikä kopioida turhaan (tärkeää isoille `string`-/vektoriparametreille).

4. **Yksi paikka laajentaa** — huomenna voit lisätä saman funktion sisään esim. lokituksen, metriikat, validoinnin tai oman muistipoolin ilman että muutat satoja `new`-kutsua:

```cpp
template<typename T, typename... Args>
std::unique_ptr<T> make(Args&&... args) {
    log("Creating " + typeid(T).name());
    return std::unique_ptr<T>(pool.allocate(new T(std::forward<Args>(args)...)));
}
```

5. **Piilota konstruktori** — jos `T`:n konstruktori on `private` ja `make` on `friend`, ulkopuoli ei voi tehdä `new T(...)` suoraan vaan pakotetaan factoryn kautta.

**Huomio:** C++14:stä lähtien standardikirjasto tarjoaa saman idean:

```cpp
auto user = std::make_unique<User>("Maija", 42);
```

Opiskelukysymyksen `make<T>` on siis **malli/idiomi**, jonka `std::make_unique` toteuttaa käytännössä. Oma `make` on järkevä kun tarvitset saman forwarding-kuvion mutta haluat lisälogiikan tai oman allokaattorin — tai kun opettelet miten se rakentuu.

### `sortLike(T& a, T& b)` — C++20-rajapinta outoihin virheisiin

**Ratkaisu: concepts**

```cpp
template<std::totally_ordered T>
void sortLike(T& a, T& b) {
    if (a > b) std::swap(a, b);
}
```

Tai tarkempi `requires`-lause. Virheelliset tyypit kaatuvat nyt selkeään kääntäjäviestiin eikä syvälle template-instanssointipinoon.

### `std::sort` kaatuu custom-iteratorilla

`std::sort` vaatii **RandomAccessIterator**-kategorian: `operator+`, `operator-`, `operator[]`, iterointi eteen- ja taaksepäin vapaasti.

Jos iteratorisi on vain Bidirectional tai Forward, käytä esim. `std::list::sort` tai muuta algoritmia. Tarkista: `static_assert(std::random_access_iterator<It>)`.

---

## 5. C++: tuotantokoodi ja elinkaari (`cpp/cpp-production`)

### `std::string_view` jäsenmuuttujana

`string_view` **ei omista** dataa — se on osoitin + pituus johonkin muualla elävään puskuriin.

**Pitää varmistaa:** näkymän takana oleva merkkijono elää pidempään kuin `string_view`-jäsen. Käytännössä: **kopioi** `std::string`-jäseneksi konstruktorissa:

```cpp
class User {
    std::string name_;   // omistettu, ei string_view
public:
    explicit User(std::string_view name) : name_(name) {}
};
```

### `std::span<int>` tallennettuna jäseneksi myöhempää käyttöä varten

**Riski: roikkuva viite (dangling).** `span` ei omista dataa. Jos lähdepuskuri (vektori, taulukko funktioparametrissa) tuhoutuu ennen käyttöä, jäsen osoittaa vapautettuun muistiin.

**Ratkaisu:** omista data (`std::vector<int>`) tai varmista, että spanin kohde elää koko objektin elinkaaren.

### Uusi vaihtoehto `std::variant`-tyyppiin — käsittely unohtuu

**Kääntäjän apu:** `std::visit` ilman yleistä catch-all-käsittelijää. Jokaiselle vaihtoehdolle oma käsittelijä overload-setissä:

```cpp
std::visit(overload{
    [](const Foo&) { /* ... */ },
    [](const Bar&) { /* ... */ },
}, v);
// Uusi vaihtoehto Baz lisätty → kääntäjävirhe, jos käsittelijää ei ole
```

C++23:ssa `static_assert(false)` tavoittamattomassa haarassa auttaa myös. Yleinen `[](auto&&){}` lambda **ei** anna exhaustive-tarkistusta.

---

## 6. Scrum: arviointi ja valmiin määritelmä (`scrum`)

### Planning poker — miten se toimii?

Planning poker on Scrum-tiimin tapa **arvioida työn määrää** (story pointit tai vastaava) yhdessä sprintin suunnittelussa. Jokaisella on korttipakka numeroiduilla arvoilla (yleensä Fibonacci: 1, 2, 3, 5, 8, 13, 21… sekä ? ja ∞).

#### Vaiheet käytännössä

1. **Product Owner esittelee user storyn** — mitä tehdään ja miksi, lyhyesti. Tiimi saa kysyä tarkentavia kysymyksiä.

2. **Lyhyt keskustelu** — mitä työ oikeasti sisältää? Riippuvuudet? Tuntemattomia?

3. **Äänestys samaan aikaan** — jokainen valitsee kortin **hiljaa**, eikä näytä sitä vielä muille. Tärkeää: kukaan ei näe muiden valintaa ennen paljastusta, jotta ei ankkuroidu jonkun toisen numeroon.

4. **Kortit paljastetaan yhtä aikaa** — kaikki kääntävät korttinsa (tai painavat nappia sovelluksessa).

5. **Jos arviot eroavat paljon** (esim. 2 vs 13):
   - **Pienin** arvio saa kertoa: "Miksi tämä on sinulle pieni?"
   - **Suurin** arvio saa kertoa: "Mitä riskejä tai työtä näet?"
   - Lyhyt keskustelu, ei pitkä debatti.

6. **Uusi äänestyskierros** — sama prosessi uudestaan, kunnes arviot lähentyvät.

7. **Sovitaan luku** — usein kun useimmat ovat lähellä toisiaan (esim. kaikki 5 tai 5 ja 8 → sovitaan 5 tai 8).

#### Esimerkki

Story: *"Käyttäjä voi vaihtaa salasanan sähköpostilinkillä"*

| Kierros | Arviot | Mitä tapahtuu |
|---------|--------|---------------|
| 1 | 3, 5, 5, 13 | 13 sanoo: "Tarvitaan token-tallennus, vanhentuminen, sähköpostipohja" |
| 2 | 5, 5, 8, 8 | Tiimi ymmärtää nyt paremmin |
| 3 | 8, 8, 8, 8 | Sovitaan **8 story pointtia** |

#### Miksi parempi kuin yhden henkilön arvio?

- **Ryhmän viisaus:** eri roolit näkevät eri asioita (backend, UI, turvallisuus)
- **Ei ankkurointia:** jos lead sanoo "tämä on 3", muut toistavat sen vaikka näkisivät riskejä
- **Keskustelu kohdistuu eroihin:** aikaa käytetään vain kun arviot eivät täsmää — siellä on oikea tieto
- **Sitoutuminen:** koko tiimi on mukana arviossa, ei vain yksi "arvonut sen"

Yksi henkilö yli- tai aliarvioi systemaattisesti. Planning poker pakottaa epäsuhtien perustelun esiin ennen kuin numero lukitaan.

### SAST-skannaus ennen releasetta — minne Scrumissa?

**Definition of Done (DoD)** — ei Sprint Planningiin, Dailyyn tai Retrospektiiviin.

DoD määrittelee, milloin backlog-item on *todella valmis*. Turvallisuusskannaus (SAST) kuuluu laatuvaatimukseen, joka täytytetään ennen kuin työ katsotaan valmiiksi tuotantoon. Se voidaan automatisoida CI-putkeen, mutta *prosessisesti* se on DoD:n osa.

---

## 7. Backend: idempotenssi (`backend/backend-api`)

### Sama webhook kahdesti verkkohäiriön jälkeen — miten vältät tuplakirjauksen?

**Idempotenssi:** sama pyyntö voidaan toistaa turvallisesti ilman duplikaattivaikutusta.

**Käytännön keinot:**

1. **Idempotency key** — asiakas tai välittäjä lähettää uniikin avaimen (`Idempotency-Key`-header); palvelin tallentaa käsitellyt avaimet ja palauttaa saman vastauksen toistossa
2. **Tapahtuman uniikki tunniste** — webhook-payloadissa `event_id`; hylkää tai ohita jo nähty
3. **Tilakone** — maksu `pending` → `completed`; toinen `completed`-yritys on no-op

Tavoite: **at-least-once** -toimitus + **exactly-once** -vaikutus liiketoiminnassa.

---

## 8. Web-turvallisuus (`security/web-security`)

### Session-cookie lähtee automaattisesti haitalliselta sivulta POST-pyyntöön

Selain lähettää cookiet cross-site-pyyntöihin, jos niitä ei rajoiteta. Hyökkääjä saa uhrin selaimen tekemään todennetun pyynnön.

**Suojat:**

1. **CSRF-token** — palvelin antaa salaisen tokenin; lomake/script ei onnistu ilman sitä
2. **`SameSite`-cookie-attribuutti** (`Strict` tai `Lax`) — rajoittaa milloin cookie lähtee cross-site-pyynnöissä
3. **`Origin` / `Referer`-tarkistus** palvelimella — lisäkerros

Modernissa kehityksessä: `SameSite=Lax` oletuksena + CSRF-token tilallisiin muutoksiin. Ei riitä pelkkä autentikointi — tarvitaan pyynnön alkuperän varmistus.

---

## 9. Opiskelulista — haluan lisätietoa (22.6.2026)

Nämä aiheet tulivat pelin opiskelulistalta (`b`-näppäin). Jokainen vastaa yhtä kohtaamiskysymystä.

### [1] Kiinteälevyiset tyypit wire-protokollassa (`cpp/portability`) — Jarmo

**Ongelma:** `int` ja `long` ovat **eri kokoisia eri alustoilla**. Wire-protokolla (verkko, tiedosto, embedded) vaatii saman binäärimuodon kaikkialla.

**Ratkaisu:** `<cstdint>` — kiinteän levyisyyden tyypit:

```cpp
#include <cstdint>

struct WireHeader {
    uint32_t magic;      // aina 4 tavua
    int32_t  payload_len;
    uint64_t checksum;
};
```

| Tyyppi | Tarkoitus |
|--------|-----------|
| `int8_t` / `uint8_t` | 1 tavu |
| `int32_t` / `uint32_t` | 4 tavua |
| `int64_t` / `uint64_t` | 8 tavua |

**Älä luota:** `int`, `long`, `short` — niiden koko on platform-riippuvainen (esim. Windows 64-bit: `long` on 4 tavua, Linux 64-bit: 8 tavua).

---

### [2] `std::make_shared` vs `shared_ptr(new T)` (`cpp/safety`) — Emilia Koskinen

**Ongelma:** `std::shared_ptr<T>(new T(args))` tekee **kaksi erillistä allokaatiota**:
1. objektille (`new T`)
2. control blockille (refcount + weak count)

**Ratkaisu:** `std::make_shared<T>(args)` yhdistää molemmat **yhteen allokaatioon**:

```cpp
// Huonompi — kaksi allokaatiota, poikkeus välissä voi vuotaa
auto p = std::shared_ptr<Foo>(new Foo(1, "x"));

// Parempi — yksi allokaatio, exception-safe
auto p = std::make_shared<Foo>(1, "x");
```

**Hyödyt:**
- vähemmän allokaatioita → nopeampi
- vähemmän muistifragmentaatiota
- jos `T`-konstruktori heittää, ei jää roikkuvaa `new`:ia

**Poikkeus:** custom deleter (`shared_ptr(new T, myDeleter)`) — `make_shared` ei tue sitä. Silloin `shared_ptr` + `new` on oikein.

---

### [3] `emplace_back` — rakenna suoraan vectoriin (`cpp/performance`) — Olli Saarinen

**Ongelma:** `push_back(Widget(args))` luo **väliaikaisen Widget-olion** stackille, kopioi/siirtää sen vectoriin, sitten tuhoaa väliaikaisen.

**Ratkaisu:** `emplace_back` rakentaa alkion **suoraan vectorin muistiin**:

```cpp
std::vector<Widget> widgets;

// Turha väliaikainen
widgets.push_back(Widget("gui", 42));

// Parempi — konstruktori ajetaan suoraan kontissa
widgets.emplace_back("gui", 42);
```

**Yhdistä `reserve`:** jos tiedät määrän etukäteen, `reserve(n)` vähentää uudelleenallokaatioita:

```cpp
widgets.reserve(1000);
for (int i = 0; i < 1000; ++i) {
    widgets.emplace_back(generateName(i), i);
}
```

---

### [4] `enable_shared_from_this` async-callbackeissa (`cpp/safety`) — Hanna Lehtonen

**Ongelma:** Async callback tarvitsee `shared_ptr`:n `this`:stä. **`shared_ptr(this)` on vaarallinen** — luo toisen control blockin samalle osoitteelle → **double delete** kun molemmat `shared_ptr`:t tuhoutuvat.

```cpp
// VAARALLINEN — älä tee näin
void schedule() {
    async([this] {
        auto p = std::shared_ptr<Foo>(this);  // toinen control block!
    });
}
```

**Ratkaisu:** peri `std::enable_shared_from_this` ja käytä `shared_from_this()`:

```cpp
class Foo : public std::enable_shared_from_this<Foo> {
public:
    void schedule() {
        auto self = shared_from_this();  // sama control block
        async([self] {
            self->doWork();  // Foo elää niin kauan kuin callback
        });
    }
};

// Objekti PITÄÄ olla jo shared_ptr:ssä ennen shared_from_this():
auto obj = std::make_shared<Foo>();
obj->schedule();
```

**Sääntö:** `shared_from_this()` toimii vain jos olio on jo hallittu `shared_ptr`:llä (esim. `make_shared`).

---

### [5] `condition_variable::wait` ja spurious wakeup (`cpp/threadability`) — Antti Järvinen

**Ongelma:** Worker-säie odottaa työjonoa. `condition_variable::wait` voi herätä **ilman `notify`-kutsua** (spurious wakeup). Ilman tarkistusta yrität `pop()` tyhjästä jonosta.

**Väärin:**

```cpp
std::unique_lock lock(m);
cv.wait(lock);           // voi herätä vaikka jono tyhjä
auto item = queue.pop(); // crash tai tyhjä data
```

**Oikein — predikaatti:**

```cpp
std::unique_lock lock(m);
cv.wait(lock, [&] { return !queue.empty(); });
auto item = queue.pop();  // jono varmasti ei-tyhjä
```

Tai vastaava `while`-silmukka:

```cpp
std::unique_lock lock(m);
while (queue.empty()) {
    cv.wait(lock);
}
auto item = queue.pop();
```

**Miksi:** POSIX ja C++ standardi sallivat heräämisen ilman signaalia. Predikaatti on pakollinen tuotantokoodissa.

---

### [6] False sharing atomisten laskurien kanssa (`cpp/cpp-production`) — Tiina Rantanen

**Ongelma:** Kaksi `std::atomic`-laskuria vierekkäin structissa. Eri säikeet päivittävät **eri** laskuria, mutta ne ovat **samalla cache linellä** (tyypillisesti 64 tavua). CPU invalidoi koko linen → säikeet hidastavat toisiaan (cache line bouncing).

```cpp
struct Counters {
    std::atomic<uint64_t> requests;   // säie A päivittää
    std::atomic<uint64_t> errors;     // säie B päivittää — SAMA cache line!
};
```

**Ratkaisu:** erota laskurit eri cache lineille:

```cpp
struct alignas(64) PaddedCounter {
    std::atomic<uint64_t> value{0};
};

struct Counters {
    PaddedCounter requests;
    PaddedCounter errors;
};
```

C++17:stä: `std::hardware_destructive_interference_size` kertoo turvallisen etäisyyden.

**Huom:** `volatile` ei korjaa false sharingia. Mutex ei auta — ongelma on muistihierarkiassa, ei data racessa.

---

### [7] `string_view` literaaleille (`cpp/maintainability`) — Olli Saarinen

**Ongelma:** Funktio ottaa `const std::string&`, mutta kutsutaan `"hello"`-literaalilla:

```cpp
void log(const std::string& msg);

log("debug");  // luo turhan std::string-olion heapista!
```

**Ratkaisu:** `std::string_view` — kevyt näkymä merkkijonoon, **ei allokoi**:

```cpp
void log(std::string_view msg) {
    // toimii: std::string, const char*, literaali
}

log("debug");              // ei allokaatiota
log(std::string("x"));     // ei kopiota
log(someString);           // ei kopiota
```

**Rajoitus:** `string_view` ei omista dataa — älä tallenna sitä jäsenmuuttujaksi ellei takana ole pysyvää `std::string`:iä (ks. luku 5).

---

### [8] `sortLike` ja C++20 concepts (`cpp/tools`) — (template-rajaus)

**Ongelma:** `sortLike(T& a, T& b)` kääntyy outoihin template-virheisiin väärillä tyypeillä.

**Ratkaisu:** C++20 `concept` rajoittaa mitä tyyppejä hyväksytään:

```cpp
#include <concepts>

template<std::totally_ordered T>
void sortLike(T& a, T& b) {
    if (b < a) std::swap(a, b);
}
```

Virheellinen tyyppi → **selkeä kääntäjäviesti** heti rajapinnassa, ei syvällä template-instanssoinnissa.

*(Laajempi kertaus: luku 4, kohta "sortLike — C++20-rajapinta". Opiskelulistan kohdassa [9] sama aihe.)*

---

### [9] `override` — virtuaalinen allekirjoitus (`cpp/style`) — Jarmo

**Ongelma:** Aliluokassa kirjoitat `void f(double x)` tarkoittaen ylikirjoittaa emon `void f(int x)`. Ilman `override` se **piilottaa** (`hide`) emon metodin — polymorfismi ei toimi, bugi on hiljainen.

```cpp
struct Base { virtual void f(int x); };
struct Derived : Base {
    void f(int x) override;      // OK — kääntäjä tarkistaa allekirjoituksen
    // void f(double x) override; // KÄÄNTÄJÄVIRHE — et tarkoittanut tätä
};
```

**Sääntö:** käytä `override` aina kun ylikirjoitat `virtual`-metodin. Kääntäjä kaataa signatuurivirheet heti.

*(Laajempi kertaus: luku 2.)*

---

### [10] `string_view` jäsenmuuttujana (`cpp/cpp-production`) — Pekka

**Huom:** luku 9 [7] käsitteli literaaleja **parametrina** — tämä on eri kysymys: **tallennus jäseneksi**.

**Ongelma:** Konstruktori ottaa `std::string_view name` ja tallentaa sen suoraan jäseneksi:

```cpp
class User {
    std::string_view name_;  // VAARALLINEN
public:
    User(std::string_view name) : name_(name) {}
};
```

Jos kutsuja antaa väliaikaisen arvon (`User("Maija")`), puskuri tuhoutuu konstruktorin jälkeen → **dangling view**.

**Ratkaisu:** kopioi omistettuun `std::string`:iin:

```cpp
class User {
    std::string name_;
public:
    explicit User(std::string_view name) : name_(name) {}
};
```

*(Laajempi kertaus: luku 5.)*

---

### [11] `std::variant` — exhaustive käsittely (`cpp/cpp-production`) — Jussi Nieminen

**Ongelma:** Uusi vaihtoehto lisätään `variant`-tyyppiin, mutta jokin `if (holds_alternative<...>)` -haara unohtuu. Kääntäjä ei varoita.

**Ratkaisu:** `std::visit` + **overload per vaihtoehto** — yleinen catch-all lambda **ei** anna exhaustive-tarkistusta:

```cpp
std::visit(overload{
    [](const Foo&) { /* ... */ },
    [](const Bar&) { /* ... */ },
}, v);
// Lisäät Baz-tyypin → kääntäjävirhe, jos käsittelijää ei ole
```

C++23: `static_assert(false)` tavoittamattomassa haarassa auttaa myös.

*(Laajempi kertaus: luku 5.)*

---

### [12] `std::span` jäsenenä — dangling (`cpp/cpp-production`) — Osastopäällikkö

**Ongelma:** Luokka ottaa `std::span<int>` konstruktorissa ja tallentaa jäseneksi:

```cpp
class Holder {
    std::span<int> data_;
public:
    Holder(std::span<int> s) : data_(s) {}
    int sum() { /* käyttää data_ myöhemmin */ }
};
```

Jos lähde on funktion paikallinen taulukko tai väliaikainen vektori, se tuhoutuu → **roikkuva viite** (UB).

**Ratkaisu:** omista data (`std::vector<int>`) tai varmista, että spanin kohde elää koko `Holder`-olion elinkaaren.

*(Laajempi kertaus: luku 5.)*

---

### [13] Singleton lazy-init säikeissä (`cpp/threadability`) — Tuotejohtaja

**Ongelma:** Singleton alustetaan ensimmäisellä käytöllä. Usea säie voi ajaa alustuksen yhtä aikaa → data race tai kaksi instanssia.

**Ratkaisu:** `std::call_once` + `std::once_flag`:

```cpp
std::once_flag flag;
Database* db = nullptr;

Database& getDb() {
    std::call_once(flag, [] { db = new Database(); });
    return *db;
}
```

Vaihtoehto: Meyers singleton (`static Database inst;` funktiossa) — C++11:stä thread-safe.

*(Laajempi kertaus: luku 1.)*

---

### [14] Tupla-webhook — idempotenssi (`backend/backend-api`) — Mikko Korhonen

**Ongelma:** Maksupalvelu lähettää saman webhookin kahdesti verkkohäiriön jälkeen (at-least-once). Ilman suojaa maksu kirjataan kahdesti.

**Ratkaisu — idempotenssi:** sama pyyntö voidaan toistaa turvallisesti:

1. **`Idempotency-Key`** / **`event_id`** — tallenna käsitellyt tunnisteet, ohita tai palauta sama vastaus toistossa
2. **Tilakone** — `pending` → `completed`; toinen `completed`-yritys on no-op

Tavoite: at-least-once -toimitus + exactly-once -vaikutus liiketoiminnassa.

*(Laajempi kertaus: luku 7.)*

---

## Pikamuistilista

| Aihe | Avainsana / ratkaisu |
|------|----------------------|
| Mutex lyhyeksi alueeksi | `std::lock_guard` / `std::scoped_lock` |
| Singleton säikeissä | `std::call_once` tai staattinen paikallinen |
| Uniikki resurssi, ei kopiointia | `= delete` kopioille |
| Ei perintää | `final` |
| Ei hiljaista muunnosta | `explicit` |
| Virtuaalinen allekirjoitus | `override` |
| Header-muutokset | PIMPL |
| Perfect forwarding | `std::forward` |
| Rajattu template | C++20 `concept` / `requires` |
| `std::sort` + custom iterator | RandomAccessIterator |
| `string_view` / `span` jäsenenä | Omista data tai varmista elinkaari |
| `variant` exhaustive | `std::visit` + overload per tyyppi |
| Planning poker vs yksi arvio | Ryhmä, keskustelu, vähemmän harhaa |
| SAST Scrumissa | Definition of Done |
| Tupla-webhook | Idempotency key / event_id |
| Cross-site POST + cookie | CSRF-token, `SameSite` |
| Wire-protokolla, kiinteä koko | `int32_t`, `uint64_t` (`<cstdint>`) |
| `make_shared` vs `new` + `shared_ptr` | Yksi allokaatio, exception-safe |
| Vectoriin ilman väliaikaista | `emplace_back` (+ `reserve`) |
| Async + `shared_ptr` this | `enable_shared_from_this` + `shared_from_this()` |
| CV wait tyhjälle jonolle | `wait(lock, predicate)` |
| Atomic-laskurit hidas | False sharing → `alignas(64)` / padding |
| Literaali + string-parametri | `std::string_view` |
