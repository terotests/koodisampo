═══ OPPITUNNIT ═══

Lyhyt kertaus opiskelulistan aiheista. Jokainen kohta vastaa pelissä näkyvää kysymystä.

── Kysy AI:lta (35) ──

  [1] Wire-protokolla käyttää `int` ja `long` — eri alustoilla eri koko. Portable korvaaja? (Jarmo)
      cpp/portability — 2026-06-22

**Ratkaisu:** `<cstdint>` — kiinteän levyisyyden tyypit (`int32_t`, `uint32_t`, `int64_t`, `uint64_t`).

```cpp
struct WireHeader {
    uint32_t magic;
    int32_t  payload_len;
};
```

**Älä luota:** `int`, `long`, `short` — koko vaihtelee alustan mukaan.

---

  [2] Miksi `std::make_shared<T>(args)` on parempi kuin `shared_ptr<T>(new T(args))`? (Emilia Koskinen)
      cpp/safety — 2026-06-22

**Ongelma:** `shared_ptr(new T)` tekee kaksi allokaatiota (olio + control block).

**Ratkaisu:** `std::make_shared<T>(args)` — yksi allokaatio, exception-safe, vähemmän fragmentaatiota.

**Poikkeus:** custom deleter vaatii `shared_ptr` + `new`.

---

  [3] Rakennat isoja olioita suoraan vectoriin väliaikaisten kopioiden sijaan. Mikä metodi? (Olli Saarinen)
      cpp/performance — 2026-06-22

**Ratkaisu:** `emplace_back` rakentaa alkion suoraan vectorin muistiin. Yhdistä `reserve(n)` kun määrä tiedossa.

```cpp
widgets.reserve(1000);
widgets.emplace_back("gui", 42);
```

---

  [4] Async callback tarvitsee `shared_ptr`:n `this`:stä, mutta `shared_ptr(this)` kaataa ohjelman. Oikea pattern? (Hanna Lehtonen)
      cpp/safety — 2026-06-22

**Ongelma:** `shared_ptr(this)` luo toisen control blockin → double delete.

**Ratkaisu:** peri `std::enable_shared_from_this<T>` ja käytä `shared_from_this()`. Olio pitää olla jo `shared_ptr`:ssä (`make_shared`).

---

  [5] Worker-säie odottaa queuea — spurious wakeup aiheuttaa tyhjän pop:in. Oikea wait-pattern? (Antti Järvinen)
      cpp/threadability — 2026-06-22

**Ratkaisu:** predikaatti `wait`-kutsussa:

```cpp
cv.wait(lock, [&] { return !queue.empty(); });
```

Spurious wakeup on sallittu standardissa — tarkista ehto aina ennen `pop()`:ia.

---

  [6] Kaksi std::atomic-laskuria on vierekkäin structissa ja eri säikeet päivittävät niitä. Miksi suorituskyky romahtaa? (Tiina Rantanen)
      cpp/cpp-production — 2026-06-22

**Ongelma:** false sharing — laskurit samalla cache linellä (64 B), CPU invalidoi linen turhaan.

**Ratkaisu:** erota `alignas(64)` / padding (`PaddedCounter`). C++17: `std::hardware_destructive_interference_size`.

---

  [7] Funktio ottaa `const std::string&` mutta kutsutaan literaaleilla — turhia allokaatioita. Parempi parametri? (Olli Saarinen)
      cpp/maintainability — 2026-06-22

**Ratkaisu:** `std::string_view` — ei allokoi, toimii literaaleille, `std::string`:ille ja `const char*`:lle.

**Rajoitus:** älä tallenna `string_view`:tä jäseneksi ilman pysyvää omistajaa.

---

  [8] Template-funktio `sortLike(T& a, T& b)` kaatuu outoihin virheisiin väärillä tyypeillä. C++20-ratkaisu rajapintaan? (Emilia Koskinen)
      cpp/tools — 2026-06-22

**Ratkaisu:** C++20 `concept`:

```cpp
template<std::totally_ordered T>
void sortLike(T& a, T& b) {
    if (b < a) std::swap(a, b);
}
```

Virheellinen tyyppi → selkeä kääntäjäviesti heti rajapinnassa.

---

  [9] Feature on testattu mutta API-dokumentaatio puuttuu — tiimi haluaa merkitä Done. DoD? (QA-päällikkö)
      scrum/scrum-dod — 2026-06-22

**Ratkaisu:** Definition of Done — dokumentaatio on DoD-kriteeri. Ilman sitä tarina ei ole valmis sprintin ulkopuolelle, vaikka testit menevät läpi.

DoD on tiimin yhteinen laatulista (CI, review, docs, deploy-valmius).

---

  [10] Funktio lukitsee kaksi mutexia — riski deadlockille. C++17-ratkaisu? (Mikko Korhonen)
      cpp/threadability — 2026-06-22

**Ratkaisu:** `std::scoped_lock lock(m1, m2)` — lukitsee usean mutexin deadlock-turvallisesti (sisäinen järjestys).

Vaihtoehto: aina sama lukitusjärjestys kaikissa säikeissä.

---

  [11] Konfiguraatiocache: lukijoita paljon, kirjoittajia harvoin — std::mutex hidastaa turhaan. Parempi primitiivi? (Mikko Korhonen)
      cpp/threadability — 2026-06-22

**Ratkaisu:** `std::shared_mutex` + `std::shared_lock` (luku) / `std::unique_lock` (kirjoitus).

Lukijat eivät blokkaa toisiaan; kirjoitus eristää kaikki.

---

  [12] Laskenta `int64_t` → `int32_t` hiljaa truncaa arvon. Miten estät käännösaikana? (Anna Virtanen)
      cpp/correctness — 2026-06-22

**Ratkaisu:** C++20 `std::in_range<int32_t>(value)` tai `gsl::narrow` / oma `static_assert` + tarkistus.

```cpp
int64_t big = ...;
if (!std::in_range<int32_t>(big)) throw std::overflow_error("...");
int32_t safe = static_cast<int32_t>(big);
```

GCC/Clang: `-Wconversion` / `-Wnarrowing`.

---

  [13] Sorttaus comparator palauttaa `<` ja `>` mutta unohtaa yhtäsuuruuden — epävakaa sort. C++20 ratkaisu? (Anna Virtanen)
      cpp/correctness — 2026-06-22

**Ratkaisu:** kolmisuuntainen vertailu `operator<=>` (spaceship):

```cpp
auto operator<=>(const Item&) const = default;
```

Tai eksplisiittinen `std::strong_ordering`. `std::sort` vaatii tiukan heikomman järjestyksen — pelkkä `<`/`>` ilman `==`-haaraa voi rikkoa invariantin.

---

  [14] Worker-thread ajaa funktion ja palauttaa tuloksen kutsijalle. Mitä käytät future-pohjaisesti? (Ville Ahonen)
      cpp/threadability — 2026-06-22

**Ratkaisu:** `std::async`, `std::packaged_task` tai `std::promise` + `std::future`.

```cpp
auto fut = std::async(std::launch::async, [] { return heavy(); });
int result = fut.get();
```

`future` siirtää tuloksen tai poikkeuksen takaisin kutsujalle.

---

  [15] App service pitää käynnistyä vain jos network-online.target on valmis. Unit-riippuvuus? (Olli Saarinen)
      linux/systemd — 2026-06-22

**Ratkaisu:** unit-tiedostossa:

```ini
[Unit]
After=network-online.target
Wants=network-online.target
```

`Wants` aktivoi targetin; `After` varmistaa järjestyksen. Varmista että `systemd-networkd-wait-online` tai vastaava on käytössä.

---

  [16] npm ci kestää 5 min jokaisessa buildissa vaikka package-lock ei muutu. BuildKit-parannus? (Petri Heikkinen)
      docker/docker — 2026-06-22

**Ratkaisu:** BuildKit cache mount:

```dockerfile
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline
```

Erottele myös `COPY package*.json` ennen lähdekoodia — layer-cache npm:lle.

---

  [17] Non-root user ei voi kirjoittaa /app/logs — permission denied tuotannossa. Dockerfile-korjaus? (Tiina Rantanen)
      docker/docker — 2026-06-22

**Ratkaisu:**

```dockerfile
RUN mkdir -p /app/logs && chown -R appuser:appgroup /app/logs
USER appuser
```

Tai volume mount oikeilla UID/GID:illä. Älä kirjoita rootina ja vaihda käyttäjää jälkikäteen ilman oikeuksia.

---

  [18] Kontti tarvitsee kuunnella hostin porttia 53 ilman NAT:ia. Mikä network mode? (Markus Salonen)
      docker/docker-network — 2026-06-22

**Ratkaisu:** `network_mode: host` — kontti jakaa hostin verkkostackin, ei port-mappingia eikä bridge-NAT:ia.

---

  [19] UDP multicast ei toimi bridge-verkossa. Milloin host network mode? (Markus Salonen)
      docker/docker-network — 2026-06-22

**Ratkaisu:** `host`-mode kun multicast/broadcast tai host-porttien suora kuuntelu tarvitaan. Bridge eristää L2/L3-liikenteen.

---

  [20] Selain lähettää session-cookien automaattisesti myös haitalliselta sivulta tulevaan POST-pyyntöön. Mikä suoja? (Turvallisuus)
      security/web-security — 2026-06-22

**Ratkaisu:** CSRF-token + `SameSite`-cookie (`Lax`/`Strict`). Lisäksi `Origin`/`Referer`-tarkistus tilallisiin muutoksiin.

---

  [21] Worker-säie pitää pysäyttää siististi olion tuhoutuessa. Mikä C++20-työkalu auttaa? (Tuotejohtaja)
      cpp/cpp-production — 2026-06-22

**Ratkaisu:** `std::jthread` + `std::stop_token` — destructor kutsuu `request_stop()`, worker tarkistaa `stop_token` loopissa.

```cpp
std::jthread worker([](std::stop_token st) {
    while (!st.stop_requested()) { /* ... */ }
});
```

---

  [22] Salasanat tallennetaan SHA-256-hasheina ilman suolaa. Mikä parempi ratkaisu? (Tiina Rantanen)
      security/web-security — 2026-06-22

**Ratkaisu:** hidas, suolattu password hash — **Argon2id**, **bcrypt** tai **scrypt**. SHA-256 on liian nopea brute forceen; suola estää rainbow-taulut.

Käytä valmista kirjastoa (`libsodium`, `bcrypt`), älä rullaa omaa.

---

  [23] QOpenGLWidget renderöi mustaa — context ei ole current. Mitä kutsutaan ennen piirtoa? (Tiina Rantanen)
      qt/qt-opengl — 2026-06-22

**Ratkaisu:** `makeCurrent()` widgetin OpenGL-kontekstissa ennen piirtokutsuja:

```cpp
void MyGLWidget::paintGL() {
    makeCurrent();
    // glDraw...
    doneCurrent();  // valinnainen jos jaat kontekstia
}
```

Ilman current-kontekstia GL-komennot eivät vaikuta näkyvään framebufferiin.

---

  [24] Rebase tehtiin ja branch pitää puskea uudestaan. Miten vältät että ylikirjoitat kollegan commitit vahingossa? (Markus Salonen)
      git/git-workflow — 2026-06-22

**Ratkaisu:** `git push --force-with-lease` — puskee vain jos remote ei ole edennyt since viime fetch.

Turvallisempi kuin `--force`; hylkää push jos joku muu on puskenut väliin.

---

  [25] Regressio ilmestyi jossain 200 commitin välillä. Mikä Git-työkalu auttaa löytämään syyllisen commitin? (Markus Salonen)
      git/git-workflow — 2026-06-22

**Ratkaisu:** `git bisect` — binäärihaku hyvän ja huonon revision välillä.

```bash
git bisect start
git bisect bad          # nykyinen rikki
git bisect good v1.0    # viimeinen toimiva
# testaa → git bisect good/bad kunnes syyllinen löytyy
```

---

  [26] Scrum Master antaa päivittäin tehtävälistoja kehittäjille. Roolivirhe? (Riikka Tuominen)
      scrum/scrum-team — 2026-06-22

**Ratkaisu:** kyllä — SM ei delegoi tehtäviä. Kehittäjät valitsevat työt sprint backlogista Dailyssa. SM fasilitoi, poistaa esteitä, valvoo prosessia.

Tehtävien jako on tiimin itseorganisoitumista, ei SM:n mikromanagerointia.

---

  [27] EXPLAIN ANALYZE näyttää hitaudesta — haluat tietää cache hit vs disk read. Lippu? (Ville Ahonen)
      postgres/pg-explain — 2026-06-22

**Ratkaisu:** `EXPLAIN (ANALYZE, BUFFERS)` — `BUFFERS` näyttää shared/local hitit ja readit.

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT ...;
```

`shared hit` = data cachesta; `read` = levyltä.

---

  [28] Tuotanto tarvitsee NFS-pohjainen persistent storage kontteille. Miten määrität volume? (Nina Kallio)
      docker/docker-volumes — 2026-06-22

**Ratkaisu:** NFS volume driver:

```yaml
volumes:
  appdata:
    driver: local
    driver_opts:
      type: nfs
      o: addr=nfs.server,rw
      device: ":/export/path"
```

Mount serviceen: `volumes: ["appdata:/data"]`.

---

  [29] Deadlock kahdessa mutexissa: thread A lukitsee m1→m2, thread B m2→m1. Miten estät? (Vastaanottovirkailija)
      cpp/threadability — 2026-06-26

**Ratkaisu:** (1) `std::scoped_lock(m1, m2)` — sama kuin [10]. (2) Kiinteä globaali lukitusjärjestys kaikissa säikeissä. (3) Vältä sisäkkäisiä lukituksia — refaktoroi yhdeksi mutexiksi tai lock hierarchy.

---

  [30] Raskas ORDER BY + hash join spillaavat levylle. Mikä istuntotason asetus auttaa ensin? (Hanna Lehtonen)
      postgres/pg-config — 2026-06-26

**Ratkaisu:** nosta `work_mem` istunnolle — sort/hash saavat enemmän RAM:ia ennen temp file -spill:iä.

```sql
SET work_mem = '256MB';  -- vain tämä query / session
```

Varo globaalia nostoa — jokainen sort/hash voi käyttää tämän verran.

---

  [31] EXPLAIN näyttää Sort → Disk temp file — muistisortti ei mahdu. Mikä GUC auttaa? (Markus Salonen)
      postgres/pg-config — 2026-06-26

**Ratkaisu:** `work_mem` (sama kuin [30]). Sort käyttää sitä ennen kuin kirjoittaa levylle.

---

  [32] Haluat julkaista HTTP-palvelun portissa 8080 mDNS:llä. Mihin konfiguraatio kuuluu? (Olli Saarinen)
      linux/avahi — 2026-06-26

**Ratkaisu:** Avahi service -tiedosto `/etc/avahi/services/*.service`:

```xml
<service-group>
  <name>My App</name>
  <service>
    <type>_http._tcp</type>
    <port>8080</port>
  </service>
</service-group>
```

Avahi ilmoittaa palvelun verkossa `_http._tcp.local`.

---

  [33] Palvelin ei pääse ulos verkon 10.0.0.0/8 ulkopuolelle, mutta pingaa gatewayn. Mikä todennäköisin puuttuu? (Hanna Lehtonen)
      linux/linux-network — 2026-06-26

**Ratkaisu:** **oletusreitti (default route)** internetiin. Paikallinen verkko ja gateway toimivat, mutta `0.0.0.0/0` puuttuu routing tablesta.

```bash
ip route add default via 10.0.0.1
```

---

  [34] Audit vaatii lokien eheyden tarkistuksen. Mitä journalctl tarjoaa? (Turvallisuus)
      linux/journald — 2026-06-26

**Ratkaisu:** `journalctl --verify` tarkistaa logien eheyden. Tuotannossa: **FSS** (Forward Secure Sealing) `journald.conf`:ssa (`Seal=yes`) — estää menneiden lokien hiljaisen muokkauksen.

---

  [35] Binääriprotokolla lukee uint32:n verkosta — arvo väärä ARM:llä. Miten C++20 auttaa? (HR — Liisa)
      cpp/portability — 2026-06-26

**Ratkaisu:** `std::endian` + `std::byteswap` — muunna verkko-/little endian eksplisiittisesti:

```cpp
uint32_t raw = read_u32(socket);
uint32_t host = std::byteswap(raw);  // jos wire on big-endian
```

Älä lue suoraan structiin eri endian-alustalla ilman normalisointia.

---

── Väärin vastatut (22) ──

  [1] Luokka hallitsee yksilöllistä resurssia — kopio ei saa olla mahdollinen. Miten ilmaiset API:ssa? (Jarmo)
      cpp/style — 2026-06-22

**Ratkaisu:** poista kopiointi `= delete`:

```cpp
class FileHandle {
    FileHandle(const FileHandle&) = delete;
    FileHandle& operator=(const FileHandle&) = delete;
};
```

Kääntäjä estää kaksois-sulun / dangling-resurssin heti. Rule of Five — päätä tietoisesti kaikki viisi operaatiota.

---

  [2] Tuotantobugi: mutex jää lukittuna poikkeuksen jälkeen. Miten estät tämän modernisti? (Tiina Rantanen)
      cpp/safety — 2026-06-22

**Ratkaisu:** RAII-lukitsin — `std::lock_guard` tai `std::scoped_lock`. Lukko vapautuu automaattisesti myös poikkeuksessa.

```cpp
std::lock_guard lock(m);
// kriittinen alue
```

Älä käytä raakaa `lock()` / `unlock()` ilman RAII:ta.

---

  [3] Milloin `std::string_view` on hyödyllinen? (Jarmo)
      cpp/maintainability — 2026-06-22

**Kun:** funktio **lukee** merkkijonoa mutta ei tarvitse omistaa sitä — parametrit, prefix/suffix, parsinta ilman allokaatiota.

**Ei kun:** data pitää tallentaa pidempään kuin lähde elää → käytä `std::string`.

→ ks. myös Kysy AI:lta [7].

---

  [4] Miksi `std::make_shared<T>(args)` on parempi kuin `shared_ptr<T>(new T(args))`? (Emilia Koskinen)
      cpp/safety — 2026-06-22

→ ks. Kysy AI:lta [2].

---

  [5] API ottaa raw pointer ja pituus — buffer overrun tuotannossa. Miten modernisoida turvallisesti? (Pekka)
      cpp/safety — 2026-06-22

**Ratkaisu:** korvaa `void foo(const char* buf, size_t len)` → `void foo(std::span<const std::byte>)` tai `std::span<const char>`.

Kutsuja ja funktio jakavat saman pituustiedon; rajat ovat tyypin osa.

---

  [6] Tuotantobugi: buffer overflow C-tyylisessä `char*` API:ssa. Moderni korvaava tyyppi rajattuun näkymään? (Petri Heikkinen)
      cpp/safety — 2026-06-22

**Ratkaisu:** `std::string_view` (teksti) tai `std::span<const char>` — näkymä tunnettuun pituuteen, ei NUL-päättymisoletusta.

---

  [7] Async callback tarvitsee `shared_ptr`:n `this`:stä, mutta `shared_ptr(this)` kaataa ohjelman. Oikea pattern? (Hanna Lehtonen)
      cpp/safety — 2026-06-22

→ ks. Kysy AI:lta [4].

---

  [8] Kaksi std::atomic-laskuria on vierekkäin structissa ja eri säikeet päivittävät niitä. Miksi suorituskyky romahtaa? (Tiina Rantanen)
      cpp/cpp-production — 2026-06-22

→ ks. Kysy AI:lta [6].

---

  [9] Mikä kuuluu Definition of Ready -kriteereihin ennen kuin tarina otetaan sprinttiin? (QA-päällikkö)
      scrum/scrum-dor — 2026-06-22

**DoR (Definition of Ready):** tarina on riittävän selkeä sprinttiin — esim. hyväksytty kuvaus, hyväksymiskriteerit, riippuvuudet selvillä, arvioitu, mahtuu sprinttiin, testattavissa.

Ero DoD:hon: DoR = *valmis aloittamaan*; DoD = *valmis valmiiksi*.

---

  [10] Feature on testattu mutta API-dokumentaatio puuttuu — tiimi haluaa merkitä Done. DoD? (QA-päällikkö)
      scrum/scrum-dod — 2026-06-22

→ ks. Kysy AI:lta [9].

---

  [11] Konfiguraatiocache: lukijoita paljon, kirjoittajia harvoin — std::mutex hidastaa turhaan. Parempi primitiivi? (Mikko Korhonen)
      cpp/threadability — 2026-06-22

→ ks. Kysy AI:lta [11].

---

  [12] Laskenta `int64_t` → `int32_t` hiljaa truncaa arvon. Miten estät käännösaikana? (Anna Virtanen)
      cpp/correctness — 2026-06-22

→ ks. Kysy AI:lta [12].

---

  [13] App service pitää käynnistyä vain jos network-online.target on valmis. Unit-riippuvuus? (Olli Saarinen)
      linux/systemd — 2026-06-22

→ ks. Kysy AI:lta [15].

---

  [14] Kontti tarvitsee kuunnella hostin porttia 53 ilman NAT:ia. Mikä network mode? (Markus Salonen)
      docker/docker-network — 2026-06-22

→ ks. Kysy AI:lta [18].

---

  [15] Epic on liian iso estimointiin. Mikä pilkkomistapa leikkaa liiketoiminta-kerroksia pystysuunnassa? (Kari Mattila)
      scrum/scrum-dor — 2026-06-22

**Ratkaisu:** **vertical slice** — jokainen tarina tuottaa ohuen päästä-häntään -toiminnallisuuden (UI + API + data), ei vaakasuuntaista kerrosta kerrallaan.

Helpottaa arviointia, testausta ja inkrementtitoimitusta.

---

  [16] Käyttäjän kommentti renderöidään HTML:ään ilman escapetusta. Mikä riski? (Tiina Rantanen)
      security/web-security — 2026-06-22

**Riski:** **XSS (Cross-Site Scripting)** — hyökkääjä injektoi `<script>` tai event-handlereita. Selain suorittaa koodin uhrin kontekstissa.

**Ratkaisu:** escapaus kontekstin mukaan (HTML, attribuutti, JS), CSP-header, preferoi textContent DOM:ssa.

---

  [17] Regressio ilmestyi jossain 200 commitin välillä. Mikä Git-työkalu auttaa löytämään syyllisen commitin? (Markus Salonen)
      git/git-workflow — 2026-06-22

→ ks. Kysy AI:lta [25].

---

  [18] Tuotanto tarvitsee NFS-pohjainen persistent storage kontteille. Miten määrität volume? (Nina Kallio)
      docker/docker-volumes — 2026-06-22

→ ks. Kysy AI:lta [28].

---

  [19] Code review: funktio ottaa `std::span<int>` ja indeksoi ilman tarkistusta — tuotannossa buffer overflow. Mikä on moderni turvallinen tapa? (Petri Heikkinen)
      cpp/safety — 2026-06-22

**Ratkaisu:** `span.at(i)` — heittää `std::out_of_range`. Tai tarkista `i < span.size()` ennen `[i]`:tä.

```cpp
int v = data.at(i);  // ei UB, vaan poikkeus
```

---

  [20] EXPLAIN näyttää Sort → Disk temp file — muistisortti ei mahdu. Mikä GUC auttaa? (Markus Salonen)
      postgres/pg-config — 2026-06-26

→ ks. Kysy AI:lta [31].

---

  [21] Audit vaatii lokien eheyden tarkistuksen. Mitä journalctl tarjoaa? (Turvallisuus)
      linux/journald — 2026-06-26

→ ks. Kysy AI:lta [34].

---

  [22] Binääriprotokolla lukee uint32:n verkosta — arvo väärä ARM:llä. Miten C++20 auttaa? (HR — Liisa)
      cpp/portability — 2026-06-26

→ ks. Kysy AI:lta [35].

---

── Pikamuistilista ──

| Aihe | Avainsana / ratkaisu |
|------|----------------------|
| Wire / endian | `int32_t`, `std::endian`, `std::byteswap` |
| `make_shared` | Yksi allokaatio, exception-safe |
| Vectoriin suoraan | `emplace_back` + `reserve` |
| Async + `this` | `enable_shared_from_this` |
| CV wait | `wait(lock, predicate)` |
| False sharing | `alignas(64)` atomics |
| Literaali-parametri | `std::string_view` |
| Template-rajaus | C++20 `concept` |
| DoD / DoR | Valmis valmiiksi / valmis aloittamaan |
| Kaksi mutexia | `std::scoped_lock` |
| Lukija-painotteinen | `std::shared_mutex` |
| Kavenrus | `std::in_range` / `-Wnarrowing` |
| Vakaa sort | `operator<=>` |
| Future-työ | `std::async` / `promise`+`future` |
| systemd verkko | `After=` + `Wants=network-online.target` |
| Docker npm cache | BuildKit `--mount=type=cache` |
| Docker non-root | `chown` + `USER` |
| Host-verkko | `network_mode: host` |
| CSRF | Token + `SameSite` |
| Säie pysäytys | `std::jthread` + `stop_token` |
| Salasanat | Argon2id / bcrypt, suola |
| Qt OpenGL | `makeCurrent()` |
| Rebase push | `--force-with-lease` |
| Regressio | `git bisect` |
| SM rooli | Ei päivittäisiä tehtävälistoja |
| PG cache vs levy | `EXPLAIN (ANALYZE, BUFFERS)` |
| NFS volume | `driver_opts: type=nfs` |
| Sort spill | `work_mem` |
| mDNS | Avahi `.service` XML |
| Internet ei toimi | default route puuttuu |
| Lokien eheys | `journalctl --verify`, FSS |
| Uniikki resurssi | `= delete` kopiolle |
| Mutex + poikkeus | `lock_guard` / RAII |
| Raw ptr + len | `std::span` |
| XSS | Escapaus + CSP |
| Span turvallinen | `.at(i)` |

b / Enter / m = takaisin kartalle
