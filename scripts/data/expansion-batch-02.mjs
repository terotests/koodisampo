/** Batch 02 — 100 new encounter questions (b02- prefix) */
export const EXPANSION = {
    "cpp-best-practices": [
      {
        id: "b02-cpp-tools-raii-01",
        chapter: "tools",
        domain: "cpp",
        difficulty: 2,
        audiences: [
          "coworker",
          "guru"
        ],
        prompt: "Code reviewissa funktio luo `new Database()` ja palauttaa raakaa osoitinta. Mikä moderni omistusmalli estää vuodon poikkeuspolulla?",
        choices: [
          {
            text: "std::unique_ptr<Database> — RAII vapauttaa automaattisesti",
            correct: true
          },
          {
            text: "shared_ptr kaikille stack-olioille",
            correct: false
          },
          {
            text: "Raw new ilman deletea kutsujassa",
            correct: false
          },
          {
            text: "malloc + free C++-luokassa",
            correct: false
          }
        ],
        correctFeedback: "unique_ptr sitoo eliniän funktion scopeen — CppCoreGuidelines suosittelee RAII:ta.",
        wrongFeedback: "Raaka new helposti unohtuu early returnissa. Omistus kuuluu smart pointeriin.",
        sourceRef: "CppCoreGuidelines#Rr-raii",
        sourceUrl: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-raii",
        featureId: "cpp:raii-unique-ptr",
        featurePoints: 3
      },
      {
        id: "b02-cpp-tools-concepts-02",
        chapter: "tools",
        domain: "cpp",
        difficulty: 4,
        audiences: [
          "guru",
          "coworker"
        ],
        prompt: "Template-funktio `sortLike(T& a, T& b)` kaatuu outoihin virheisiin väärillä tyypeillä. C++20-ratkaisu rajapintaan?",
        choices: [
          {
            text: "concepts: `template<std::totally_ordered T> void sortLike(T& a, T& b)`",
            correct: true
          },
          {
            text: "static_assert(false) jokaisessa funktiossa",
            correct: false
          },
          {
            text: "Käytä void* ja castaa",
            correct: false
          },
          {
            text: "Kommentti // only numbers",
            correct: false
          }
        ],
        correctFeedback: "concepts antavat selkeän kääntäjävirheen — cpp-best-practices suosittelee työkaluja.",
        wrongFeedback: "Ilman concepts template-virheet ovat kilometrien pituisia. concepts rajaavat API:n.",
        sourceRef: "en.cppreference.com/concepts",
        sourceUrl: "https://en.cppreference.com/w/cpp/language/constraints",
        featureId: "cpp:concepts",
        featurePoints: 4
      },
      {
        id: "b02-cpp-style-override-03",
        chapter: "style",
        domain: "cpp",
        difficulty: 2,
        audiences: [
          "coworker",
          "secretary"
        ],
        prompt: "Perusluokan `virtual void draw()` ylikirjoitetaan mutta kääntäjä ei varoita jos funktion nimi on `draw()` vs `Draw()`. Mitä avainsanaa pyydät?",
        choices: [
          {
            text: "override — kääntäjä tarkistaa että base-funktio on olemassa",
            correct: true
          },
          {
            text: "virtual riittää aina",
            correct: false
          },
          {
            text: "final korvaa override",
            correct: false
          },
          {
            text: "using namespace std korjaa",
            correct: false
          }
        ],
        correctFeedback: "override estää kirjoitusvirheet periytymisessä — cpp-best-practices Style.",
        wrongFeedback: "Ilman overridea typo jää huomaamatta. override on pakollinen modernissa koodissa.",
        sourceRef: "CppCoreGuidelines#c-override",
        sourceUrl: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#c-override",
        featureId: "cpp:override",
        featurePoints: 2
      },
      {
        id: "b02-cpp-style-consteval-04",
        chapter: "style",
        domain: "cpp",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "Konfiguraatiovakio pitää laskea compile-time — runtime-laskenta hidastaa käynnistystä. C++20-vaihtoehto constexpr:lle?",
        choices: [
          {
            text: "consteval — pakottaa evaluoinnin käännösaikana",
            correct: true
          },
          {
            text: "volatile const int",
            correct: false
          },
          {
            text: "constexpr riittää aina runtimeen",
            correct: false
          },
          {
            text: "Macro #define",
            correct: false
          }
        ],
        correctFeedback: "consteval on immediate function — pakottaa compile-time laskennan.",
        wrongFeedback: "constexpr voi silti ajaa runtime-ajassa. consteval on tiukempi compile-time takuu.",
        sourceRef: "en.cppreference.com/consteval",
        sourceUrl: "https://en.cppreference.com/w/cpp/language/consteval",
        featureId: "cpp:consteval",
        featurePoints: 4
      },
      {
        id: "b02-cpp-safety-noexcept-05",
        chapter: "safety",
        domain: "cpp",
        difficulty: 3,
        audiences: [
          "coworker",
          "guru"
        ],
        prompt: "std::vector::push_back heittää poikkeuksen kesken move-operaatiosta — tila epävarma. Miten merkitset move-operaattorin?",
        choices: [
          {
            text: "noexcept move constructor/assignment — vector voi käyttää movea turvallisesti",
            correct: true
          },
          {
            text: "Poista move kokonaan",
            correct: false
          },
          {
            text: "try/catch jokaisessa push_back",
            correct: false
          },
          {
            text: "volatile move",
            correct: false
          }
        ],
        correctFeedback: "noexcept move mahdollistaa strong exception guarantee — safety-parannus.",
        wrongFeedback: "Heittävä move estää optimoinnin. noexcept on osa turvallista API:a.",
        sourceRef: "CppCoreGuidelines#noexcept",
        sourceUrl: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#noexcept",
        featureId: "cpp:noexcept-move",
        featurePoints: 4
      },
      {
        id: "b02-cpp-safety-make-unique-06",
        chapter: "safety",
        domain: "cpp",
        difficulty: 2,
        audiences: [
          "coworker",
          "security"
        ],
        prompt: "Tuotantokoodi käyttää `new Widget()` suoraan. Ensimmäinen turvallisuusparannus?",
        choices: [
          {
            text: "std::make_unique<Widget>() — poistaa yksittäisen new/delete-parin",
            correct: true
          },
          {
            text: "Käytä malloc",
            correct: false
          },
          {
            text: "shared_ptr aina vaikka ei jaeta",
            correct: false
          },
          {
            text: "Poista destructtorit",
            correct: false
          }
        ],
        correctFeedback: "make_unique estää leakin ja on exception-safe — CppCoreGuidelines R.11.",
        wrongFeedback: "Raaka new on helppo unohtaa. make_unique on moderni oletus.",
        sourceRef: "CppCoreGuidelines#Rr-make_unique",
        sourceUrl: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-make_unique",
        featureId: "cpp:make-unique",
        featurePoints: 3
      },
      {
        id: "b02-cpp-maintain-string-view-07",
        chapter: "maintainability",
        domain: "cpp",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Funktio ottaa `const std::string&` mutta kutsutaan literaaleilla — turhia allokaatioita. Parempi parametri?",
        choices: [
          {
            text: "std::string_view — ei kopioi, hyväksyy stringin ja C-str:n",
            correct: true
          },
          {
            text: "const char* aina",
            correct: false
          },
          {
            text: "std::string kopio parametrina",
            correct: false
          },
          {
            text: "Macro STR(x)",
            correct: false
          }
        ],
        correctFeedback: "string_view yksinkertaistaa API:a ilman allokaatiota — maintainability.",
        wrongFeedback: "const string& pakottaa literaalit string-muunnokseen. string_view on kevyempi.",
        sourceRef: "CppCoreGuidelines#Rf-string-view",
        sourceUrl: "https://en.cppreference.com/w/cpp/string/basic_string_view",
        featureId: "cpp:string-view",
        featurePoints: 3
      },
      {
        id: "b02-cpp-maintain-structured-08",
        chapter: "maintainability",
        domain: "cpp",
        difficulty: 2,
        audiences: [
          "coworker",
          "secretary"
        ],
        prompt: "Koodi purkaa `std::pair<int,std::string>` käsin `.first` ja `.second`. Moderni tapa?",
        choices: [
          {
            text: "structured bindings: `auto [id, name] = row;`",
            correct: true
          },
          {
            text: "Macro GET_FIRST(x)",
            correct: false
          },
          {
            text: "Kopioi pair erillisiin muuttujiin ilman auto",
            correct: false
          },
          {
            text: "Käytä void*",
            correct: false
          }
        ],
        correctFeedback: "structured bindings tekevät tuple/pair-koodista luettavaa — C++17.",
        wrongFeedback: "Manuaalinen purku on virhealtista. structured bindings on selkeämpi.",
        sourceRef: "en.cppreference.com/structured_bindings",
        sourceUrl: "https://en.cppreference.com/w/cpp/language/structured_binding",
        featureId: "cpp:structured-bindings",
        featurePoints: 2
      },
      {
        id: "b02-cpp-perf-move-09",
        chapter: "performance",
        domain: "cpp",
        difficulty: 3,
        audiences: [
          "coworker",
          "project-lead"
        ],
        prompt: "Iso `std::vector<int>` palautetaan funktiosta — reviewer ehdottaa `std::move(returnVec)`. Onko se oikein?",
        choices: [
          {
            text: "Ei — NRVO/RVO usein estää kopion ilman movea",
            correct: true
          },
          {
            text: "Kyllä, move aina pakollinen",
            correct: false
          },
          {
            text: "Palauta shared_ptr",
            correct: false
          },
          {
            text: "Kopioi aina varmuuden vuoksi",
            correct: false
          }
        ],
        correctFeedback: "Named RVO on usein parempi kuin std::move return — estää move-from-tilan.",
        wrongFeedback: "std::move return voi estää RVO:n. Luota optimoijaan tai palauta arvo suoraan.",
        sourceRef: "cpp-best-practices/06-Performance.md",
        sourceUrl: "https://en.cppreference.com/w/cpp/language/copy_elision",
        featureId: "cpp:nrvo",
        featurePoints: 4
      },
      {
        id: "b02-cpp-perf-shrink-10",
        chapter: "performance",
        domain: "cpp",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Vektori kasvaa miljoonaan elementtiin ja tyhjennetään — muisti ei vapaudu. Mitä kutsut?",
        choices: [
          {
            text: "shrink_to_fit() tai swap-trick vanhoilla kääntäjillä",
            correct: true
          },
          {
            text: "clear() riittää aina vapauttamaan kapasiteetin",
            correct: false
          },
          {
            text: "resize(0) ja toivo",
            correct: false
          },
          {
            text: "delete vector",
            correct: false
          }
        ],
        correctFeedback: "clear() säilyttää capacityn — shrink_to_fit pyytää vapautusta.",
        wrongFeedback: "Tyhjä vector voi pitää suuren puskurin. shrink_to_fit vapauttaa ylimääräisen.",
        sourceRef: "en.cppreference.com/vector/shrink_to_fit",
        sourceUrl: "https://en.cppreference.com/w/cpp/container/vector/shrink_to_fit",
        featureId: "cpp:shrink-to-fit",
        featurePoints: 3
      },
      {
        id: "b02-cpp-portability-stdint-11",
        chapter: "portability",
        domain: "cpp",
        difficulty: 2,
        audiences: [
          "coworker",
          "security"
        ],
        prompt: "Verkkoprotokolla vaatii tarkalleen 32-bittisen unsigned-arvon. Mikä tyyppi on portable?",
        choices: [
          {
            text: "std::uint32_t (<cstdint>)",
            correct: true
          },
          {
            text: "unsigned int — aina 32-bittinen",
            correct: false
          },
          {
            text: "long — riippuu alustasta",
            correct: false
          },
          {
            text: "int32_t macro omasta headerista",
            correct: false
          }
        ],
        correctFeedback: "cstdint antaa kiinteäleveyiset tyypit — portability-paras käytäntö.",
        wrongFeedback: "int/leveys vaihtelee alustan mukaan. uint32_t on eksplisiittinen.",
        sourceRef: "en.cppreference.com/cstdint",
        sourceUrl: "https://en.cppreference.com/w/cpp/types/integer",
        featureId: "cpp:fixed-width-int",
        featurePoints: 2
      },
      {
        id: "b02-cpp-thread-scoped-lock-12",
        chapter: "threadability",
        domain: "cpp",
        difficulty: 4,
        audiences: [
          "guru",
          "coworker"
        ],
        prompt: "Funktio lukitsee kaksi mutexia — riski deadlockille. C++17-ratkaisu?",
        choices: [
          {
            text: "std::scoped_lock(m1, m2) — lukitsee atomisesti oikeassa järjestyksessä",
            correct: true
          },
          {
            text: "lock(m1); lock(m2); aina samassa järjestyksessä manuaalisesti",
            correct: false
          },
          {
            text: "volatile mutex",
            correct: false
          },
          {
            text: "sleep ennen lockia",
            correct: false
          }
        ],
        correctFeedback: "scoped_lock usealle mutexille estää deadlockin — threadability-best-practice.",
        wrongFeedback: "Manuaalinen kaksinkertainen lock on virhealtista. scoped_lock hoitaa järjestyksen.",
        sourceRef: "en.cppreference.com/scoped_lock",
        sourceUrl: "https://en.cppreference.com/w/cpp/thread/scoped_lock",
        featureId: "cpp:scoped-lock",
        featurePoints: 4
      },
      {
        id: "b02-cpp-thread-atomic-order-13",
        chapter: "threadability",
        domain: "cpp",
        difficulty: 5,
        audiences: [
          "guru"
        ],
        prompt: "Laskuri kasvaa useasta säikeestä — `atomic<int>++` riittääkö ilman memory_order?",
        choices: [
          {
            text: "seq_cst on oletus — usein OK; relaxed vain jos semantiikka sallii",
            correct: true
          },
          {
            text: "atomic ei tarvitse koskaan orderia",
            correct: false
          },
          {
            text: "volatile int riittää",
            correct: false
          },
          {
            text: "mutex jokaiselle incrementille aina",
            correct: false
          }
        ],
        correctFeedback: "memory_order vaikuttaa näkyvyyteen — oletus seq_cst on turvallisin.",
        wrongFeedback: "Relaxed order voi rikkoa oletukset. Ymmärrä semantiikka ennen relaxedia.",
        sourceRef: "en.cppreference.com/memory_order",
        sourceUrl: "https://en.cppreference.com/w/cpp/atomic/memory_order",
        featureId: "cpp:memory-order",
        featurePoints: 5
      },
      {
        id: "b02-cpp-correct-signed-14",
        chapter: "correctness",
        domain: "cpp",
        difficulty: 3,
        audiences: [
          "coworker",
          "security"
        ],
        prompt: "Bugiraportti: `if (index >= 0)` on aina tosi kun `index` on `size_t`. Miksi tarkistus on hyödytön?",
        choices: [
          {
            text: "size_t on unsigned — vertailu nollaan on aina tosi, ei tarkista virheitä",
            correct: true
          },
          {
            text: "Kääntäjäbugi",
            correct: false
          },
          {
            text: "Optimointi -O3 rikkoo vertailun",
            correct: false
          },
          {
            text: "size_t on signed",
            correct: false
          }
        ],
        correctFeedback: "Sekoitetut signed/unsigned vertailut ovat vaarallisia — correctness-ansat.",
        wrongFeedback: "size_t on unsigned — vertailu negatiiviseen int:iin on aina true. Käytä samaa tyyppiä.",
        sourceRef: "CppCoreGuidelines#ES.100",
        sourceUrl: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Res-mix",
        featureId: "cpp:signed-unsigned",
        featurePoints: 3
      },
      {
        id: "b02-cpp-correct-dangling-15",
        chapter: "correctness",
        domain: "cpp",
        difficulty: 4,
        audiences: [
          "guru",
          "security"
        ],
        prompt: "Funktio palauttaa `const std::string&` paikallisesta muuttujasta — crash tuotannossa. Mikä on oikea paluutyyppi?",
        choices: [
          {
            text: "std::string arvona (RVO) tai std::string_view vain jos elinikä taattu",
            correct: true
          },
          {
            text: "const string& aina tehokkain",
            correct: false
          },
          {
            text: "static string local — thread-safe",
            correct: false
          },
          {
            text: "char* literaaliin",
            correct: false
          }
        ],
        correctFeedback: "Viittaus paikalliseen on dangling — correctness-kriittinen virhe.",
        wrongFeedback: "Reference return vaatii elävän objektin. Palauta arvo tai varmista elinikä.",
        sourceRef: "CppCoreGuidelines#Rf-return-ref",
        sourceUrl: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rf-return-ref",
        featureId: "cpp:dangling-reference",
        featurePoints: 4
      }
    ],
    "scrum-best-practices": [
      {
        id: "b02-scrum-dod-demo-01",
        chapter: "scrum-dod",
        domain: "scrum",
        difficulty: 2,
        audiences: [
          "project-lead",
          "coworker"
        ],
        prompt: "Tiimi väittää tarina valmiiksi koska koodi on mergattu. DoD vaatii demottavuuden. Mitä puuttuu?",
        choices: [
          {
            text: "Incrment on testattu ja esiteltävissä stakeholderille — pelkkä merge ei riitä",
            correct: true
          },
          {
            text: "Vain code review",
            correct: false
          },
          {
            text: "Dokumentaatio vapaaehtoista",
            correct: false
          },
          {
            text: "Deploy tuotantoon pakollinen aina",
            correct: false
          }
        ],
        correctFeedback: "DoD määrittelee valmiuden — toimiva, integroitu increment (Scrum Guide).",
        wrongFeedback: "Merge mainiin ei ole DoD. Valmius = DoD täyttyy.",
        sourceRef: "scrumguides.org/dod",
        sourceUrl: "https://scrumguides.org/scrum-guide.html#increment",
        featureId: "scrum:dod-demo",
        featurePoints: 3
      },
      {
        id: "b02-scrum-dod-perf-02",
        chapter: "scrum-dod",
        domain: "scrum",
        difficulty: 3,
        audiences: [
          "guru",
          "project-lead"
        ],
        prompt: "Uusi API hidastaa raporttia 10× — tarina 'done' ilman suorituskykytestiä. Miten DoD auttaa?",
        choices: [
          {
            text: "DoD voi sisältää NFR-kriteerit (esim. p95 < 200ms) — ei hyväksytä ilman",
            correct: true
          },
          {
            text: "Suorituskyky on aina erillinen projekti",
            correct: false
          },
          {
            text: "PO hyväksyy aina hidastuksen",
            correct: false
          },
          {
            text: "DoD koskee vain unit testejä",
            correct: false
          }
        ],
        correctFeedback: "DoD on laajennettavissa laatuattribuutteihin — tiimin sopimus.",
        wrongFeedback: "DoD ei rajoitu funktionaalisuuteen. NFR:t kuuluvat valmiuskriteereihin.",
        sourceRef: "scrumguides.org/dod",
        sourceUrl: "https://scrumguides.org/scrum-guide.html#definition-of-done",
        featureId: "scrum:dod-nfr",
        featurePoints: 4
      },
      {
        id: "b02-scrum-dod-rollback-03",
        chapter: "scrum-dod",
        domain: "scrum",
        difficulty: 4,
        audiences: [
          "project-lead",
          "security"
        ],
        prompt: "Tuotantoon mennyt feature ei täytä DoD:ia — miten tiimi reagoi sprintin jälkeen?",
        choices: [
          {
            text: "Palautetaan backlogiin/tekninen velka korjataan — DoD on minimi laatu",
            correct: true
          },
          {
            text: "Merkitään done koska jo deployattu",
            correct: false
          },
          {
            text: "Piilotetaan bugi",
            correct: false
          },
          {
            text: "Peru sprintti aina",
            correct: false
          }
        ],
        correctFeedback: "DoD on laadun lattia — poikkeukset dokumentoidaan ja korjataan.",
        wrongFeedback: "Deployattu ≠ valmis. DoD-rikkomus vaatii korjauksen.",
        sourceRef: "scrumguides.org/dod",
        sourceUrl: "https://scrumguides.org/scrum-guide.html#definition-of-done",
        featureId: "scrum:dod-enforcement",
        featurePoints: 4
      },
      {
        id: "b02-scrum-dor-spike-04",
        chapter: "scrum-dor",
        domain: "scrum",
        difficulty: 3,
        audiences: [
          "coworker",
          "guru"
        ],
        prompt: "Tarina: 'Tutki miksi integraatio kaatuu' — ei acceptance criteriaa. Refinementissa mitä tehdään?",
        choices: [
          {
            text: "Spike/timebox tutkimus — DoR vaatii riittävän ymmärryksen ennen sprinttiin ottoa",
            correct: true
          },
          {
            text: "Otetaan suoraan sprinttiin ilman rajoja",
            correct: false
          },
          {
            text: "Hylätään kaikki tutkimustyö",
            correct: false
          },
          {
            text: "PO kirjoittaa koodin",
            correct: false
          }
        ],
        correctFeedback: "DoR varmistaa että työ on valmis aloitettavaksi — spike selventää.",
        wrongFeedback: "Epämääräinen tarina ei täytä DoR:ia. Timeboxattu spike on OK.",
        sourceRef: "scrumguides.org/backlog-refinement",
        sourceUrl: "https://scrumguides.org/scrum-guide.html#product-backlog",
        featureId: "scrum:dor-spike",
        featurePoints: 3
      },
      {
        id: "b02-scrum-dor-deps-05",
        chapter: "scrum-dor",
        domain: "scrum",
        difficulty: 3,
        audiences: [
          "project-lead",
          "coworker"
        ],
        prompt: "Tarina riippuu toisen tiimin API:sta jota ei ole vielä olemassa. DoR-tilanne?",
        choices: [
          {
            text: "Ei Ready — riippuvuus ratkaistava tai mockattava ennen sprint commitmentia",
            correct: true
          },
          {
            text: "Ready koska PO haluaa",
            correct: false
          },
          {
            text: "Odota sprintin loppua",
            correct: false
          },
          {
            text: "Aloita koodaus ja toivo",
            correct: false
          }
        ],
        correctFeedback: "DoR sisältää riippuvuudet — ilman niitä tarina ei ole valmis.",
        wrongFeedback: "Blokkaava riippuvuus estää DoR:n. Selvitä ennen sprinttiä.",
        sourceRef: "scrumguides.org/dor",
        sourceUrl: "https://scrumguides.org/scrum-guide.html#product-backlog",
        featureId: "scrum:dor-dependencies",
        featurePoints: 3
      },
      {
        id: "b02-scrum-dor-size-06",
        chapter: "scrum-dor",
        domain: "scrum",
        difficulty: 2,
        audiences: [
          "coworker",
          "secretary"
        ],
        prompt: "Backlog-item on 21 story pointia — tiimi ei saa valmiiksi yhdessä sprintissä. Refinement-toimenpide?",
        choices: [
          {
            text: "Pilko pienempiin tarinoihin joiden jokainen tuottaa arvoa",
            correct: true
          },
          {
            text: "Kasvata sprintin pituutta",
            correct: false
          },
          {
            text: "Jätä isoksi — velocity korjaa",
            correct: false
          },
          {
            text: "Poista acceptance criteria",
            correct: false
          }
        ],
        correctFeedback: "DoR: työ mahtuu sprinttiin tai on pilkottu — Scrum Guide backlog refinement.",
        wrongFeedback: "Liian iso item ei ole valmis. Pilkkominen on DoR-työkalu.",
        sourceRef: "scrumguides.org/refinement",
        sourceUrl: "https://scrumguides.org/scrum-guide.html#product-backlog",
        featureId: "scrum:dor-split-large",
        featurePoints: 3
      },
      {
        id: "b02-scrum-estimation-relative-07",
        chapter: "scrum-estimation",
        domain: "scrum",
        difficulty: 2,
        audiences: [
          "coworker",
          "project-lead"
        ],
        prompt: "Manageri vaatii tuntiarvioita sprintille. Scrum-muotoilu suhteellisesta arviosta?",
        choices: [
          {
            text: "Story pointit kuvaavat suhteellista vaivaa — absoluuttiset tunnit eivät ole sprintin mittari",
            correct: true
          },
          {
            text: "Muunna pisteet tunteihin julkisesti",
            correct: false
          },
          {
            text: "Velocity = henkilöpäivät",
            correct: false
          },
          {
            text: "Estimointi kielletty",
            correct: false
          }
        ],
        correctFeedback: "Scrum käyttää suhteellista estimointia — tiimin consensus (Scrum Guide).",
        wrongFeedback: "Tuntibudjetointi ei ole sprintin työkalu. Pisteet ovat suhteellisia.",
        sourceRef: "scrumguides.org/planning",
        sourceUrl: "https://scrumguides.org/scrum-guide.html#sprint-planning",
        featureId: "scrum:estimation-relative",
        featurePoints: 2
      },
      {
        id: "b02-scrum-estimation-anchor-08",
        chapter: "scrum-estimation",
        domain: "scrum",
        difficulty: 3,
        audiences: [
          "project-lead",
          "guru"
        ],
        prompt: "Planning pokerissa kaikki kortit eri — keskustelu pysähtyy. Facilitointi-jatko?",
        choices: [
          {
            text: "Kysy ääripäiden perustelut — uusi kierros kunnes konsensus",
            correct: true
          },
          {
            text: "Ota keskiarvo automaattisesti",
            correct: false
          },
          {
            text: "PO päättää yksin",
            correct: false
          },
          {
            text: "Ohita tarina",
            correct: false
          }
        ],
        correctFeedback: "Planning pokerin arvo on keskustelussa — eri näkemykset paljastuvat.",
        wrongFeedback: "Keskiarvo piilottaa riskit. Keskustele ennen uutta kierrosta.",
        sourceRef: "planningpoker.com/how",
        sourceUrl: "https://scrumguides.org/scrum-guide.html#sprint-planning",
        featureId: "scrum:planning-poker-facilitation",
        featurePoints: 3
      },
      {
        id: "b02-scrum-estimation-velocity-09",
        chapter: "scrum-estimation",
        domain: "scrum",
        difficulty: 3,
        audiences: [
          "project-lead",
          "ceo"
        ],
        prompt: "Stakeholder vertaa kahden tiimin velocitya suunnittelussa. Miksi se on harhaanjohtavaa?",
        choices: [
          {
            text: "Pisteet ovat tiimikohtaisia — vertailu eri skaaloilla ei kerro tuottavuutta",
            correct: true
          },
          {
            text: "Velocity on absoluuttinen mittari",
            correct: false
          },
          {
            text: "Suurempi velocity = parempi tiimi aina",
            correct: false
          },
          {
            text: "Velocity korvaa laadun",
            correct: false
          }
        ],
        correctFeedback: "Velocity on ennustetyökalu tiimille — ei vertailumittari (Scrum Guide).",
        wrongFeedback: "Eri tiimit arvioivat eri tavalla. Velocity ei ole kilpailu.",
        sourceRef: "scrumguides.org/velocity",
        sourceUrl: "https://scrumguides.org/scrum-guide.html#sprint-planning",
        featureId: "scrum:velocity-not-comparable",
        featurePoints: 3
      },
      {
        id: "b02-scrum-sprint-goal-10",
        chapter: "scrum-sprint",
        domain: "scrum",
        difficulty: 2,
        audiences: [
          "project-lead",
          "coworker"
        ],
        prompt: "Sprintin aikana tiimi keskittyy yksittäisiin taskeihin ilman yhteistä suuntaa. Mikä Scrum-elementti puuttuu?",
        choices: [
          {
            text: "Sprint Goal — yhteinen tavoite joka ohjaa valintoja sprintin aikana",
            correct: true
          },
          {
            text: "Daily agenda PO:lta",
            correct: false
          },
          {
            text: "Gantt-kaavio",
            correct: false
          },
          {
            text: "Henkilökohtaiset OKR:t",
            correct: false
          }
        ],
        correctFeedback: "Sprint Goal sitoo tiimin — Scrum Guide sprint planning.",
        wrongFeedback: "Ilman goalia työ hajautuu. Sprint Goal on yhteinen fokus.",
        sourceRef: "scrumguides.org/sprint-goal",
        sourceUrl: "https://scrumguides.org/scrum-guide.html#sprint-goal",
        featureId: "scrum:sprint-goal-focus",
        featurePoints: 2
      },
      {
        id: "b02-scrum-sprint-daily-11",
        chapter: "scrum-sprint",
        domain: "scrum",
        difficulty: 2,
        audiences: [
          "coworker",
          "secretary"
        ],
        prompt: "Daily kestää 45 minuuttia statusraportteja managerille. Miten Scrum Master korjaa?",
        choices: [
          {
            text: "Palauta 15 min timebox — kehittäjät synkkaavat työtä, ei raportoi ylöspäin",
            correct: true
          },
          {
            text: "Peru daily kokonaan",
            correct: false
          },
          {
            text: "Kirjoita status sähköpostiin",
            correct: false
          },
          {
            text: "Lisää agenda-slideja",
            correct: false
          }
        ],
        correctFeedback: "Daily on tiimin tapahtuma — progress kohti Sprint Goalia (Scrum Guide).",
        wrongFeedback: "Statusraportti ≠ daily. Fokus sprint goaliin ja esteisiin.",
        sourceRef: "scrumguides.org/daily",
        sourceUrl: "https://scrumguides.org/scrum-guide.html#daily-scrum",
        featureId: "scrum:daily-timebox",
        featurePoints: 2
      },
      {
        id: "b02-scrum-sprint-review-12",
        chapter: "scrum-sprint",
        domain: "scrum",
        difficulty: 3,
        audiences: [
          "project-lead",
          "ceo"
        ],
        prompt: "Sprint Review on vain PowerPoint — demo puuttuu. Mitä Scrum Guide odottaa?",
        choices: [
          {
            text: "Toimiva increment esitellään stakeholderille — feedback backlogiin",
            correct: true
          },
          {
            text: "Vain metrics review",
            correct: false
          },
          {
            text: "PO esittää yksin",
            correct: false
          },
          {
            text: "Review = retro",
            correct: false
          }
        ],
        correctFeedback: "Sprint Review on inspect & adapt incrementille — Scrum Guide.",
        wrongFeedback: "Slides eivät korvaa demoa. Increment on konkreettinen.",
        sourceRef: "scrumguides.org/review",
        sourceUrl: "https://scrumguides.org/scrum-guide.html#sprint-review",
        featureId: "scrum:review-demo",
        featurePoints: 3
      },
      {
        id: "b02-scrum-team-sm-13",
        chapter: "scrum-team",
        domain: "scrum",
        difficulty: 2,
        audiences: [
          "project-lead",
          "coworker"
        ],
        prompt: "Scrum Master assignaa tehtäviä kehittäjille sprintin alussa. Mikä roolirikkomus?",
        choices: [
          {
            text: "SM facilitoi — tiimi itseorganisoituu työn jakoon",
            correct: true
          },
          {
            text: "SM on tech lead",
            correct: false
          },
          {
            text: "SM omistaa backlogin",
            correct: false
          },
          {
            text: "SM hyväksyy DoD:n yksin",
            correct: false
          }
        ],
        correctFeedback: "Scrum Master palvelee tiimiä — ei hallitse työnjakoa (Scrum Guide).",
        wrongFeedback: "Task assignment on tiimin tehtävä. SM poistaa esteitä.",
        sourceRef: "scrumguides.org/sm",
        sourceUrl: "https://scrumguides.org/scrum-guide.html#scrum-master",
        featureId: "scrum:sm-facilitator",
        featurePoints: 2
      },
      {
        id: "b02-scrum-team-cross-14",
        chapter: "scrum-team",
        domain: "scrum",
        difficulty: 3,
        audiences: [
          "project-lead",
          "guru"
        ],
        prompt: "Tiimissä vain yksi henkilö osaa deployata — bottleneck joka sprintti. Scrum-ratkaisu?",
        choices: [
          {
            text: "Cross-functional tiimi jakaa taidot — kuka tahansa voi edistää incrementtiä",
            correct: true
          },
          {
            text: "Palkkaa erillinen deploy-tiimi",
            correct: false
          },
          {
            text: "Odota specialistia aina",
            correct: false
          },
          {
            text: "Piilota deploy-taidot",
            correct: false
          }
        ],
        correctFeedback: "Scrum tiimi on cross-functional — tarvittavat taidot tiimissä (Scrum Guide).",
        wrongFeedback: "Yhden henkilön riippuvuus rikkoo Scrum-tiimin idean. Jaa osaaminen.",
        sourceRef: "scrumguides.org/team",
        sourceUrl: "https://scrumguides.org/scrum-guide.html#scrum-team",
        featureId: "scrum:cross-functional",
        featurePoints: 3
      }
    ],
    "linux-ops": [
      {
        id: "b02-linux-systemd-unit-01",
        chapter: "systemd",
        domain: "linux",
        difficulty: 2,
        audiences: [
          "coworker"
        ],
        prompt: "Palvelu ei käynnisty bootissa vaikka `systemctl start` toimii. Mitä unohdettiin?",
        choices: [
          {
            text: "systemctl enable palvelu — luo wanted-by symlink",
            correct: true
          },
          {
            text: "systemctl restart riittää",
            correct: false
          },
          {
            text: "chmod +x riittää bootiin",
            correct: false
          },
          {
            text: "journalctl --boot",
            correct: false
          }
        ],
        correctFeedback: "enable linkittää unitin targetiin — systemd.unit man.",
        wrongFeedback: "start on kertaluontoinen. enable tekee pysyväksi bootissa.",
        sourceRef: "systemd.unit#enable",
        sourceUrl: "https://www.freedesktop.org/software/systemd/man/systemd.unit.html",
        featureId: "linux:systemd-enable",
        featurePoints: 2
      },
      {
        id: "b02-linux-systemd-failure-02",
        chapter: "systemd",
        domain: "linux",
        difficulty: 3,
        audiences: [
          "coworker",
          "guru"
        ],
        prompt: "Palvelu crashaa loopissa — loki täyttyy. Miten rajoitat uudelleenkäynnistyksiä?",
        choices: [
          {
            text: "Unit-tiedostossa StartLimitIntervalSec + StartLimitBurst tai Restart=on-failure huolellisesti",
            correct: true
          },
          {
            text: "Restart=always ilman rajaa",
            correct: false
          },
          {
            text: "Poista Restart",
            correct: false
          },
          {
            text: "kill -9 init",
            correct: false
          }
        ],
        correctFeedback: "StartLimit* estää restart-loopin — systemd.service man.",
        wrongFeedback: "Rajaton restart voi kuormittaa järjestelmää. Aseta rajat.",
        sourceRef: "systemd.service#StartLimit",
        sourceUrl: "https://www.freedesktop.org/software/systemd/man/systemd.service.html",
        featureId: "linux:systemd-start-limit",
        featurePoints: 4
      },
      {
        id: "b02-linux-systemd-timer-03",
        chapter: "systemd",
        domain: "linux",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Cron-työ pitää siirtää systemd:ään — tarvitaan ajastus + service. Mitä luot?",
        choices: [
          {
            text: "timer.unit + service.unit — timer triggeröi servicen",
            correct: true
          },
          {
            text: "Vain service ilman timeria",
            correct: false
          },
          {
            text: "target.unit riittää",
            correct: false
          },
          {
            text: "socket.unit ajastukseen",
            correct: false
          }
        ],
        correctFeedback: "systemd timer korvaa cronin — timer.unit man.",
        wrongFeedback: "Service ei ajasta itseään. Timer unit triggeröi.",
        sourceRef: "systemd.timer",
        sourceUrl: "https://www.freedesktop.org/software/systemd/man/systemd.timer.html",
        featureId: "linux:systemd-timer",
        featurePoints: 3
      },
      {
        id: "b02-linux-systemd-env-04",
        chapter: "systemd",
        domain: "linux",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "Palvelu tarvitsee API-avaimen — kovakoodattu unit-tiedostoon. Turvallisempi systemd-tapa?",
        choices: [
          {
            text: "EnvironmentFile=-/etc/myapp/env tai credentials drop-in",
            correct: true
          },
          {
            text: "ExecStart=echo $KEY",
            correct: false
          },
          {
            text: "Hardcode Environment= avain unitissa gitissä",
            correct: false
          },
          {
            text: "export shell-profiilissa",
            correct: false
          }
        ],
        correctFeedback: "EnvironmentFile erottaa salaisuudet — systemd.service best practice.",
        wrongFeedback: "Salaisuudet eivät kuulu versionhallintaan. EnvironmentFile tai LoadCredential.",
        sourceRef: "systemd.service#Environment",
        sourceUrl: "https://www.freedesktop.org/software/systemd/man/systemd.service.html",
        featureId: "linux:systemd-env-file",
        featurePoints: 4
      },
      {
        id: "b02-linux-journalctl-boot-05",
        chapter: "journald",
        domain: "linux",
        difficulty: 2,
        audiences: [
          "coworker"
        ],
        prompt: "Palvelu kaatui eilen rebootin jälkeen — miten suodatat lokin tälle bootille?",
        choices: [
          {
            text: "journalctl -b 0 (tai -b ilman argumenttia nykyinen)",
            correct: true
          },
          {
            text: "journalctl --since yesterday vain",
            correct: false
          },
          {
            text: "cat /var/log/messages",
            correct: false
          },
          {
            text: "dmesg -k",
            correct: false
          }
        ],
        correctFeedback: "journalctl -b valitsee boot-session — journalctl man.",
        wrongFeedback: "Kaikki lokit sekoittuvat ilman -b. Boot-spesifi haku nopeuttaa.",
        sourceRef: "journalctl#-b",
        sourceUrl: "https://www.freedesktop.org/software/systemd/man/journalctl.html",
        featureId: "linux:journalctl-boot",
        featurePoints: 2
      },
      {
        id: "b02-linux-journalctl-unit-06",
        chapter: "journald",
        domain: "linux",
        difficulty: 2,
        audiences: [
          "coworker"
        ],
        prompt: "Haluat vain nginx-palvelun viimeiset virheet. Tehokkain komento?",
        choices: [
          {
            text: "journalctl -u nginx.service -p err -n 50",
            correct: true
          },
          {
            text: "grep nginx /var/log/*",
            correct: false
          },
          {
            text: "tail -f /dev/null",
            correct: false
          },
          {
            text: "systemctl cat nginx",
            correct: false
          }
        ],
        correctFeedback: "journalctl -u suodattaa unitin mukaan — journalctl man.",
        wrongFeedback: "grep kaikista lokeista on hidas. journalctl -u on indeksoitu.",
        sourceRef: "journalctl#-u",
        sourceUrl: "https://www.freedesktop.org/software/systemd/man/journalctl.html",
        featureId: "linux:journalctl-unit",
        featurePoints: 2
      },
      {
        id: "b02-linux-journald-persist-07",
        chapter: "journald",
        domain: "linux",
        difficulty: 3,
        audiences: [
          "guru",
          "security"
        ],
        prompt: "Rebootin jälkeen vanhat lokit katoavat — forensic-tarve. journald-muutos?",
        choices: [
          {
            text: "Storage=persistent /var/log/journal — journald.conf",
            correct: true
          },
          {
            text: "Storage=volatile riittää",
            correct: false
          },
          {
            text: "Poista journald",
            correct: false
          },
          {
            text: "Rsyslog only",
            correct: false
          }
        ],
        correctFeedback: "persistent säilyttää lokit levyllä — journald.conf man.",
        wrongFeedback: "Oletus volatile voi menettää historian. persistent forensic-tarkoituksiin.",
        sourceRef: "journald.conf#Storage",
        sourceUrl: "https://www.freedesktop.org/software/systemd/man/journald.conf.html",
        featureId: "linux:journald-persistent",
        featurePoints: 3
      },
      {
        id: "b02-linux-network-ss-08",
        chapter: "linux-network",
        domain: "linux",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Sovellus sanoo portti 8080 varattu — mikä komento näyttää prosessin joka kuuntelee?",
        choices: [
          {
            text: "ss -tlnp | grep 8080 (tai ss -ulnp UDP)",
            correct: true
          },
          {
            text: "netstat -a riittää aina",
            correct: false
          },
          {
            text: "ping localhost",
            correct: false
          },
          {
            text: "ifconfig",
            correct: false
          }
        ],
        correctFeedback: "ss korvaa netstatin — näyttää listen socketit ja prosessit.",
        wrongFeedback: "Pelkkä port check ei kerro kuka omistaa. ss -p yhdistää prosessiin.",
        sourceRef: "ss(8)",
        sourceUrl: "https://man7.org/linux/man-pages/man8/ss.8.html",
        featureId: "linux:ss-listen",
        featurePoints: 3
      },
      {
        id: "b02-linux-network-route-09",
        chapter: "linux-network",
        domain: "linux",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "VPN-yhteys toimii mutta vain internal IP:t eivät routtaudu. Diagnostiikka?",
        choices: [
          {
            text: "ip route show table all — tarkista policy routing ja oikea interface",
            correct: true
          },
          {
            text: "reboot aina",
            correct: false
          },
          {
            text: "Poista default route",
            correct: false
          },
          {
            text: "ifdown eth0",
            correct: false
          }
        ],
        correctFeedback: "ip route paljastaa reititystaulun — ip-route man.",
        wrongFeedback: "Ongelma on usein puuttuva reitti VPN-interfaceen. ip route diagnoosi.",
        sourceRef: "ip-route(8)",
        sourceUrl: "https://man7.org/linux/man-pages/man8/ip-route.8.html",
        featureId: "linux:ip-route",
        featurePoints: 4
      },
      {
        id: "b02-linux-network-resolv-10",
        chapter: "linux-network",
        domain: "linux",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Lyhyet hostnamet eivät resolvdu — FQDN toimii. Mikä tiedosto?",
        choices: [
          {
            text: "search/domain -rivit /etc/resolv.conf (tai systemd-resolved)",
            correct: true
          },
          {
            text: "/etc/hosts only",
            correct: false
          },
          {
            text: "/etc/nsswitch.conf DNS off",
            correct: false
          },
          {
            text: "iptables",
            correct: false
          }
        ],
        correctFeedback: "search lisää domain-suffixin — resolv.conf man.",
        wrongFeedback: "Ilman search lyhyet nimet epäonnistuvat. Tarkista resolver config.",
        sourceRef: "resolv.conf#search",
        sourceUrl: "https://man7.org/linux/man-pages/man5/resolv.conf.5.html",
        featureId: "linux:resolv-search",
        featurePoints: 3
      },
      {
        id: "b02-linux-network-nmcli-11",
        chapter: "linux-network",
        domain: "linux",
        difficulty: 2,
        audiences: [
          "coworker",
          "secretary"
        ],
        prompt: "Wi-Fi katkeilee — haluat vaihtaa verkko profiilin CLI:stä. Komento?",
        choices: [
          {
            text: "nmcli connection up 'Profile-Name'",
            correct: true
          },
          {
            text: "ifconfig wlan0 up",
            correct: false
          },
          {
            text: "route add default",
            correct: false
          },
          {
            text: "systemctl restart network",
            correct: false
          }
        ],
        correctFeedback: "nmcli hallitsee NetworkManager-profiileja — nmcli man.",
        wrongFeedback: "Vanhat ifconfig-komennot eivät vaihda NM-profiilia. nmcli on oikea työkalu.",
        sourceRef: "nmcli(1)",
        sourceUrl: "https://man7.org/linux/man-pages/man1/nmcli.1.html",
        featureId: "linux:nmcli",
        featurePoints: 2
      },
      {
        id: "b02-linux-avahi-browse-12",
        chapter: "avahi",
        domain: "linux",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Lähiverkossa pitäisi näkyä tulostin — miten listaat Avahi-palvelut terminaalista?",
        choices: [
          {
            text: "avahi-browse -a -r (tai avahi-browse -t _ipp._tcp)",
            correct: true
          },
          {
            text: "ping printer.local aina toimii",
            correct: false
          },
          {
            text: "nmap -sP",
            correct: false
          },
          {
            text: "systemctl start cups only",
            correct: false
          }
        ],
        correctFeedback: "avahi-browse skannaa mDNS-palvelut — avahi-browse man.",
        wrongFeedback: "Ilman browse et näe palveluja. avahi-browse listaa _services._dns-sd.",
        sourceRef: "avahi-browse(1)",
        sourceUrl: "https://manpages.ubuntu.com/manpages/jammy/man1/avahi-browse.1.html",
        featureId: "linux:avahi-browse",
        featurePoints: 3
      },
      {
        id: "b02-linux-avahi-conflict-13",
        chapter: "avahi",
        domain: "linux",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "Kaksi konetta ilmoittaa saman `.local`-nimen — palvelu flapping. Syy?",
        choices: [
          {
            text: "Hostname collision mDNS-verkossa — nimet pitää olla uniikit",
            correct: true
          },
          {
            text: "Avahi bugi aina",
            correct: false
          },
          {
            text: "DNS cache",
            correct: false
          },
          {
            text: "Firewall estää kaiken",
            correct: false
          }
        ],
        correctFeedback: "mDNS vaatii uniikit hostnamet — avahi documentation.",
        wrongFeedback: "Duplikaatti hostname aiheuttaa ristiriidan. Nimeä uudelleen.",
        sourceRef: "avahi#hostname",
        sourceUrl: "https://wiki.archlinux.org/title/avahi",
        featureId: "linux:avahi-hostname",
        featurePoints: 4
      },
      {
        id: "b02-linux-avahi-publish-14",
        chapter: "avahi",
        domain: "linux",
        difficulty: 3,
        audiences: [
          "coworker",
          "guru"
        ],
        prompt: "Kehität paikallista HTTP-palvelua — haluat sen löytyvän `_http._tcp`. Miten?",
        choices: [
          {
            text: "Avahi service XML / avahi-publish-service tai systemd service with Avahi",
            correct: true
          },
          {
            text: "Kirjoita vain /etc/hosts",
            correct: false
          },
          {
            text: "Broadcast UDP manually",
            correct: false
          },
          {
            text: "SSH tunnel riittää",
            correct: false
          }
        ],
        correctFeedback: "avahi-publish-service rekisteröi palvelun — Avahi docs.",
        wrongFeedback: "Pelkkä HTTP-serveri ei ilmoita itseään mDNS:llä. Tarvitaan Avahi publish.",
        sourceRef: "avahi.service(5)",
        sourceUrl: "https://manpages.ubuntu.com/manpages/jammy/man5/avahi.service.5.html",
        featureId: "linux:avahi-publish",
        featurePoints: 3
      }
    ],
    "docker-ops": [
      {
        id: "b02-docker-run-user-01",
        chapter: "docker",
        domain: "docker",
        difficulty: 3,
        audiences: [
          "security",
          "coworker"
        ],
        prompt: "Containeri ajaa rootina tuotannossa — audit finding. Ensimmäinen hardening?",
        choices: [
          {
            text: "docker run --user nonroot:nonroot (tai USER Dockerfilessa)",
            correct: true
          },
          {
            text: "--privileged turvallisempaa",
            correct: false
          },
          {
            text: "Ajetaan hostilla suoraan",
            correct: false
          },
          {
            text: "chmod 777 /",
            correct: false
          }
        ],
        correctFeedback: "Non-root user vähentää escape-riskiä — Docker docs security.",
        wrongFeedback: "Root container = host root jos escape. Käytä non-root USER.",
        sourceRef: "docker/run#user",
        sourceUrl: "https://docs.docker.com/engine/containers/run/#user",
        featureId: "docker:run-user",
        featurePoints: 4
      },
      {
        id: "b02-docker-run-limit-02",
        chapter: "docker",
        domain: "docker",
        difficulty: 3,
        audiences: [
          "coworker",
          "project-lead"
        ],
        prompt: "Yksi container syö koko hostin RAM:in — OOM killaa muita. Rajoitus?",
        choices: [
          {
            text: "docker run --memory 512m --cpus 1.0",
            correct: true
          },
          {
            text: "Ei rajoja — Docker hoitaa",
            correct: false
          },
          {
            text: "Vain cgroups v1 manuaalisesti",
            correct: false
          },
          {
            text: "restart=always",
            correct: false
          }
        ],
        correctFeedback: "Resource limits — docker run docs.",
        wrongFeedback: "Ilman rajoja container voi tappaa hostin. memory/cpus flags.",
        sourceRef: "docker/run#resource-constraints",
        sourceUrl: "https://docs.docker.com/config/containers/resource_constraints/",
        featureId: "docker:resource-limits",
        featurePoints: 3
      },
      {
        id: "b02-docker-build-copy-03",
        chapter: "docker",
        domain: "docker",
        difficulty: 4,
        audiences: [
          "coworker",
          "guru"
        ],
        prompt: "Docker build on hidas — jokainen pieni koodimuutos invalidoi koko dependency layerin. Fix?",
        choices: [
          {
            text: "COPY package.json ennen loput — hyödynnä layer cache",
            correct: true
          },
          {
            text: "COPY . ensimmäisenä aina",
            correct: false
          },
          {
            text: "Poista cache --no-cache",
            correct: false
          },
          {
            text: "Yksi RUN kaikelle",
            correct: false
          }
        ],
        correctFeedback: "Layer ordering optimoi cache — Dockerfile best practices.",
        wrongFeedback: "Aikainen COPY . rikkoo cache. Riippuvuudet erikseen.",
        sourceRef: "docker/build/cache",
        sourceUrl: "https://docs.docker.com/build/cache/",
        featureId: "docker:layer-cache-order",
        featurePoints: 4
      },
      {
        id: "b02-docker-exec-debug-04",
        chapter: "docker",
        domain: "docker",
        difficulty: 2,
        audiences: [
          "coworker"
        ],
        prompt: "Containerissa shell puuttuu mutta prosessi elää — miten debuggaat sisältä?",
        choices: [
          {
            text: "docker exec -it container_id /bin/sh (tai distroless: debug image sidecar)",
            correct: true
          },
          {
            text: "docker attach riittää aina",
            correct: false
          },
          {
            text: "ssh localhost",
            correct: false
          },
          {
            text: "docker rm -f",
            correct: false
          }
        ],
        correctFeedback: "docker exec avaa prosessin namespaceen — docker exec docs.",
        wrongFeedback: "attach liittää pääprosessiin. exec uuteen shelliin.",
        sourceRef: "docker/exec",
        sourceUrl: "https://docs.docker.com/reference/cli/docker/container/exec/",
        featureId: "docker:exec",
        featurePoints: 2
      },
      {
        id: "b02-docker-prune-05",
        chapter: "docker",
        domain: "docker",
        difficulty: 2,
        audiences: [
          "coworker"
        ],
        prompt: "Levy täynnä vanhoja imageja ja stopped containereita. Turvallinen siivous?",
        choices: [
          {
            text: "docker system prune (tai prune -a varovasti)",
            correct: true
          },
          {
            text: "rm -rf /var/lib/docker",
            correct: false
          },
          {
            text: "Poista vain running",
            correct: false
          },
          {
            text: "format C:",
            correct: false
          }
        ],
        correctFeedback: "prune poistaa käyttämättömät resurssit — docker system prune docs.",
        wrongFeedback: "Manuaalinen rm -rf on vaarallinen. prune on hallittu siivous.",
        sourceRef: "docker/system/prune",
        sourceUrl: "https://docs.docker.com/reference/cli/docker/system/prune/",
        featureId: "docker:system-prune",
        featurePoints: 2
      },
      {
        id: "b02-docker-net-bridge-06",
        chapter: "docker-network",
        domain: "docker",
        difficulty: 2,
        audiences: [
          "coworker"
        ],
        prompt: "Kaksi default-bridge containeria eivät resolvdu nimellä — miksi?",
        choices: [
          {
            text: "Default bridge ei tarjoa automaattista DNS-nimeä — käytä user-defined network",
            correct: true
          },
          {
            text: "Bridge ei toimi koskaan",
            correct: false
          },
          {
            text: "Tarvitaan --net=host aina",
            correct: false
          },
          {
            text: "iptables pois",
            correct: false
          }
        ],
        correctFeedback: "User-defined bridge antaa DNS-nimet — docker network docs.",
        wrongFeedback: "Legacy bridge ei linkitä nimiä. docker network create ratkaisee.",
        sourceRef: "docker/network/bridge",
        sourceUrl: "https://docs.docker.com/network/drivers/bridge/",
        featureId: "docker:bridge-dns",
        featurePoints: 3
      },
      {
        id: "b02-docker-net-compose-07",
        chapter: "docker-network",
        domain: "docker",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Compose: web ei tavoita db:ä hostname `db` — molemmat samassa projektissa. Tyypillinen syy?",
        choices: [
          {
            text: "Eri compose network tai service name ≠ hostname — määritä networks ja depends_on",
            correct: true
          },
          {
            text: "Docker bug",
            correct: false
          },
          {
            text: "Tarvitaan IP aina",
            correct: false
          },
          {
            text: "Poista service names",
            correct: false
          }
        ],
        correctFeedback: "Compose network luo DNS service-nimille — compose networking docs.",
        wrongFeedback: "Palvelut eri networkissa eivät näe toisiaan. Sama network + service name.",
        sourceRef: "compose/networking",
        sourceUrl: "https://docs.docker.com/compose/how-tos/networking/",
        featureId: "docker:compose-network",
        featurePoints: 3
      },
      {
        id: "b02-docker-net-host-08",
        chapter: "docker-network",
        domain: "docker",
        difficulty: 4,
        audiences: [
          "guru",
          "security"
        ],
        prompt: "Low-latency palvelu tarvitsee suoran host-portin ilman NAT:ia. Verkko-optio?",
        choices: [
          {
            text: "--network host (Linux) — container jakaa host network stackin",
            correct: true
          },
          {
            text: "bridge aina nopein",
            correct: false
          },
          {
            text: "none network",
            correct: false
          },
          {
            text: "overlay local only",
            correct: false
          }
        ],
        correctFeedback: "host network poistaa NAT overhead — docker network host docs.",
        wrongFeedback: "Bridge NAT lisää latencya. host mode suoralle bindille (Linux).",
        sourceRef: "docker/network/host",
        sourceUrl: "https://docs.docker.com/network/drivers/host/",
        featureId: "docker:host-network",
        featurePoints: 4
      },
      {
        id: "b02-docker-net-inspect-09",
        chapter: "docker-network",
        domain: "docker",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Container ei saa IP:tä custom networkista — diagnostiikka?",
        choices: [
          {
            text: "docker network inspect netname — tarkista Containers ja IPAM",
            correct: true
          },
          {
            text: "docker ps riittää",
            correct: false
          },
          {
            text: "reboot host",
            correct: false
          },
          {
            text: "Poista kaikki verkot",
            correct: false
          }
        ],
        correctFeedback: "network inspect näyttää liitetyt containerit — docker network inspect.",
        wrongFeedback: "IP-ongelmat näkyvät inspectissa. Tarkista IPAM config.",
        sourceRef: "docker/network/inspect",
        sourceUrl: "https://docs.docker.com/reference/cli/docker/network/inspect/",
        featureId: "docker:network-inspect",
        featurePoints: 3
      },
      {
        id: "b02-docker-net-alias-10",
        chapter: "docker-network",
        domain: "docker",
        difficulty: 3,
        audiences: [
          "guru"
        ],
        prompt: "Yhdellä servicellä pitää olla useita DNS-nimiä samassa verkossa. Miten?",
        choices: [
          {
            text: "network_aliases Compose:ssa tai --network-alias docker run",
            correct: true
          },
          {
            text: "/etc/hosts manuaalisesti containerissa",
            correct: false
          },
          {
            text: "Useita container instansseja",
            correct: false
          },
          {
            text: "ExtraHosts only ulkoisille",
            correct: false
          }
        ],
        correctFeedback: "network aliases lisäävät DNS-nimiä — compose services docs.",
        wrongFeedback: "Alias on docker-native tapa. ExtraHosts eri käyttöön.",
        sourceRef: "compose/services#network_aliases",
        sourceUrl: "https://docs.docker.com/reference/compose-file/services/#network_aliases",
        featureId: "docker:network-alias",
        featurePoints: 3
      },
      {
        id: "b02-docker-vol-named-11",
        chapter: "docker-volumes",
        domain: "docker",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "PostgreSQL data katoaa containerin poiston jälkeen — mitä käytit väärin?",
        choices: [
          {
            text: "Ei named volumea — `-v pgdata:/var/lib/postgresql/data`",
            correct: true
          },
          {
            text: "Bind mount aina parempi tietokannalle",
            correct: false
          },
          {
            text: "tmpfs riittää",
            correct: false
          },
          {
            text: "COPY data imageen",
            correct: false
          }
        ],
        correctFeedback: "Named volumes säilyvät containerin elämän jälkeen — docker volumes docs.",
        wrongFeedback: "Container filesystem on epämeral. Volume persistoi datan.",
        sourceRef: "docker/storage/volumes",
        sourceUrl: "https://docs.docker.com/engine/storage/volumes/",
        featureId: "docker:named-volume",
        featurePoints: 3
      },
      {
        id: "b02-docker-vol-bind-12",
        chapter: "docker-volumes",
        domain: "docker",
        difficulty: 3,
        audiences: [
          "coworker",
          "security"
        ],
        prompt: "Dev: koodi bind-mountattu mutta muutokset eivät näy containerissa — macOS/Windows?",
        choices: [
          {
            text: "Cached/delegated mount tai docker sync — tiedostojärjestelmäero host/VM",
            correct: true
          },
          {
            text: "Bind mount ei toimi koskaan",
            correct: false
          },
          {
            text: "Käytä COPY only",
            correct: false
          },
          {
            text: "chmod 777 host",
            correct: false
          }
        ],
        correctFeedback: "Bind mount behavior eri alustoilla — docker bind mounts docs.",
        wrongFeedback: "VM sync viive voi hidastaa dev flowta. Tarkista mount options.",
        sourceRef: "docker/bind-mounts",
        sourceUrl: "https://docs.docker.com/engine/storage/bind-mounts/",
        featureId: "docker:bind-mount",
        featurePoints: 3
      },
      {
        id: "b02-docker-vol-ro-13",
        chapter: "docker-volumes",
        domain: "docker",
        difficulty: 2,
        audiences: [
          "security",
          "coworker"
        ],
        prompt: "Config mountattu containeriin — attacker ei saa muokata. Flag?",
        choices: [
          {
            text: "docker run -v /host/config:/app/config:ro",
            correct: true
          },
          {
            text: "-v ilman :rw on read-only",
            correct: false
          },
          {
            text: "Umask riittää",
            correct: false
          },
          {
            text: "Config imageen aina",
            correct: false
          }
        ],
        correctFeedback: ":ro mount flag tekee read-only — docker run volume docs.",
        wrongFeedback: "Oletus mount on rw. :ro configeille.",
        sourceRef: "docker/run#volume-read-only",
        sourceUrl: "https://docs.docker.com/engine/containers/run/#volume-read-only-mount",
        featureId: "docker:volume-readonly",
        featurePoints: 2
      },
      {
        id: "b02-docker-vol-backup-14",
        chapter: "docker-volumes",
        domain: "docker",
        difficulty: 4,
        audiences: [
          "guru",
          "project-lead"
        ],
        prompt: "Named volume backup ilman container downtimea — suositeltu tapa?",
        choices: [
          {
            text: "docker run --rm -v vol:/data -v $(pwd):/backup alpine tar czf /backup/vol.tar.gz /data",
            correct: true
          },
          {
            text: "docker cp running db container",
            correct: false
          },
          {
            text: "Snapshot host root",
            correct: false
          },
          {
            text: "Export image only",
            correct: false
          }
        ],
        correctFeedback: "Sidecar container mounttaa volumen backupiin — docker backup patterns.",
        wrongFeedback: "Image export ei sisällä volume dataa. Mount + tar backup.",
        sourceRef: "docker/backup",
        sourceUrl: "https://docs.docker.com/engine/storage/volumes/#back-up-restore-or-migrate-data-volumes",
        featureId: "docker:volume-backup",
        featurePoints: 4
      }
    ],
    "qt-dev": [
      {
        id: "b02-qt-widgets-layout-01",
        chapter: "qt-widgets",
        domain: "qt",
        difficulty: 2,
        audiences: [
          "coworker"
        ],
        prompt: "Ikkuna resize repi widgetit — kovakoodatut setGeometry-kutsut. Parempi Qt-tapa?",
        choices: [
          {
            text: "QLayout (QVBoxLayout/QHBoxLayout) — automaattinen resize",
            correct: true
          },
          {
            text: "Fixed size kaikille",
            correct: false
          },
          {
            text: "Manual resizeEvent aina",
            correct: false
          },
          {
            text: "QWidget ilman parentia",
            correct: false
          }
        ],
        correctFeedback: "Layout manager hoitaa geometryn — Qt Widgets docs.",
        wrongFeedback: "Absoluuttiset koordinaatit eivät skaalaudu. Layout on oletus.",
        sourceRef: "qt/qwidget#setLayout",
        sourceUrl: "https://doc.qt.io/qt-6/qwidget.html#setLayout",
        featureId: "qt:layout",
        featurePoints: 2
      },
      {
        id: "b02-qt-widgets-parent-02",
        chapter: "qt-widgets",
        domain: "qt",
        difficulty: 2,
        audiences: [
          "coworker"
        ],
        prompt: "Dialog leakkaa muistia sulkeutumisen jälkeen — widgetit orphan. Fix?",
        choices: [
          {
            text: "Aseta parent QDialogille tai käytä WA_DeleteOnClose",
            correct: true
          },
          {
            text: "delete this manuaalisesti satunnaisesti",
            correct: false
          },
          {
            text: "shared_ptr QWidget",
            correct: false
          },
          {
            text: "Piilota vain show()",
            correct: false
          }
        ],
        correctFeedback: "Qt parent-child ownership vapauttaa lapset — QObject docs.",
        wrongFeedback: "Ilman parentia dialog widgetit jäävät eloon. Parent tai DeleteOnClose.",
        sourceRef: "qt/objecttrees",
        sourceUrl: "https://doc.qt.io/qt-6/objecttrees.html",
        featureId: "qt:parent-ownership",
        featurePoints: 2
      },
      {
        id: "b02-qt-widgets-action-03",
        chapter: "qt-widgets",
        domain: "qt",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Valikkorivin Save-toiminto pitää bindata Ctrl+S:ään ja toolbar-nappiin. Qt-abstraktio?",
        choices: [
          {
            text: "QAction — yksi action useassa paikassa",
            correct: true
          },
          {
            text: "Kaksi erillistä slotia kopioituna",
            correct: false
          },
          {
            text: "Global hotkey only",
            correct: false
          },
          {
            text: "QShortcut erikseen ilman actionia",
            correct: false
          }
        ],
        correctFeedback: "QAction yhdistää shortcut + menu + toolbar — Qt docs.",
        wrongFeedback: "Duplikaattilogiikka bugittaa. QAction on DRY.",
        sourceRef: "qt/qaction",
        sourceUrl: "https://doc.qt.io/qt-6/qaction.html",
        featureId: "qt:qaction",
        featurePoints: 3
      },
      {
        id: "b02-qt-signals-queued-04",
        chapter: "qt-signals",
        domain: "qt",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "Worker-thread emit updateUI() — crash GUI-threadissa. Connection type?",
        choices: [
          {
            text: "Qt::QueuedConnection (auto cross-thread)",
            correct: true
          },
          {
            text: "Qt::DirectConnection aina",
            correct: false
          },
          {
            text: "BlockingQueuedConnection UI:hin",
            correct: false
          },
          {
            text: "Emit ilman connectionia",
            correct: false
          }
        ],
        correctFeedback: "QueuedConnection marshals event GUI-loopiin — Qt signals/slots threading.",
        wrongFeedback: "Direct cross-thread UI on UB. Queued on oletus eri threadeille.",
        sourceRef: "qt/threads-qobject",
        sourceUrl: "https://doc.qt.io/qt-6/threads-qobject.html",
        featureId: "qt:queued-connection",
        featurePoints: 4
      },
      {
        id: "b02-qt-signals-disconnect-05",
        chapter: "qt-signals",
        domain: "qt",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Dialog sulkeutuu mutta slot laukeaa edelleen destroyed senderistä. Esto?",
        choices: [
          {
            text: "disconnect tai QPointer sender + Qt::UniqueConnection tai destroyed-signaali",
            correct: true
          },
          {
            text: "Toivo ettei emit",
            correct: false
          },
          {
            text: "static connect ilman receiveria",
            correct: false
          },
          {
            text: "Poista kaikki signals",
            correct: false
          }
        ],
        correctFeedback: "Disconnect elinkaaren lopussa — Qt object model.",
        wrongFeedback: "Elävä connection dead objectiin on vaarallinen. Hallitse elinikää.",
        sourceRef: "qt/signalsandslots",
        sourceUrl: "https://doc.qt.io/qt-6/signalsandslots.html",
        featureId: "qt:disconnect-lifetime",
        featurePoints: 3
      },
      {
        id: "b02-qt-thread-worker-06",
        chapter: "qt-threading",
        domain: "qt",
        difficulty: 3,
        audiences: [
          "coworker",
          "guru"
        ],
        prompt: "Pitää ajaa raskas laskenta ilman UI-jäätymistä. Qt-rakenne?",
        choices: [
          {
            text: "QObject worker + moveToThread(QThread) — ei QThread::run overridea GUI-objektille",
            correct: true
          },
          {
            text: "QThread::run suoraan GUI-luokassa",
            correct: false
          },
          {
            text: "sleep UI-threadissa",
            correct: false
          },
          {
            text: "Prosessi fork",
            correct: false
          }
        ],
        correctFeedback: "Worker object threadissä — Qt threading best practice.",
        wrongFeedback: "Peri QThread väärin GUI:lle. moveToThread worker-objektille.",
        sourceRef: "qt/threads",
        sourceUrl: "https://doc.qt.io/qt-6/thread-basics.html",
        featureId: "qt:worker-thread",
        featurePoints: 3
      },
      {
        id: "b02-qt-thread-gui-07",
        chapter: "qt-threading",
        domain: "qt",
        difficulty: 4,
        audiences: [
          "guru",
          "security"
        ],
        prompt: "Worker kutsuu suoraan label->setText() — satunnainen crash. Sääntö?",
        choices: [
          {
            text: "GUI-luokkiin vain GUI-threadista — käytä signaaleja",
            correct: true
          },
          {
            text: "Mutex labelin ympärillä riittää",
            correct: false
          },
          {
            text: "setText on thread-safe",
            correct: false
          },
          {
            text: "volatile QLabel",
            correct: false
          }
        ],
        correctFeedback: "Qt GUI ei thread-safe — threads-qobject docs.",
        wrongFeedback: "Cross-thread widget access on kielletty. Signalit UI-päivitykseen.",
        sourceRef: "qt/threads-gui",
        sourceUrl: "https://doc.qt.io/qt-6/threads-technologies.html",
        featureId: "qt:gui-thread-only",
        featurePoints: 4
      },
      {
        id: "b02-qt-thread-pool-08",
        chapter: "qt-threading",
        domain: "qt",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Satoja lyhyitä taustatehtäviä — QThread jokaiselle liian raskas. Vaihtoehto?",
        choices: [
          {
            text: "QThreadPool + QRunnable / QtConcurrent",
            correct: true
          },
          {
            text: "std::thread jokaiselle ilman rajaa",
            correct: false
          },
          {
            text: "UI timer 1ms",
            correct: false
          },
          {
            text: "Blocking GUI",
            correct: false
          }
        ],
        correctFeedback: "Thread pool kierrättää säikeitä — QtConcurrent docs.",
        wrongFeedback: "Thread-per-task ei skaalaudu. Pool on kevyempi.",
        sourceRef: "qt/qthreadpool",
        sourceUrl: "https://doc.qt.io/qt-6/qthreadpool.html",
        featureId: "qt:thread-pool",
        featurePoints: 3
      },
      {
        id: "b02-qt-models-sort-09",
        chapter: "qt-models",
        domain: "qt",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "QTableView sorttaus hidastuu 100k rivillä — sorttaus viewissä. Parempi?",
        choices: [
          {
            text: "QSortFilterProxyModel tai sorttaus SQL/source tasolla",
            correct: true
          },
          {
            text: "QTableWidget aina",
            correct: false
          },
          {
            text: "Poista sort",
            correct: false
          },
          {
            text: "Nested loop viewissa",
            correct: false
          }
        ],
        correctFeedback: "Proxy/source sort skaalaa — Qt Model/View docs.",
        wrongFeedback: "View-level sort on hidas isoilla malleilla. Proxy tai DB ORDER BY.",
        sourceRef: "qt/qsortfilterproxymodel",
        sourceUrl: "https://doc.qt.io/qt-6/qsortfilterproxymodel.html",
        featureId: "qt:proxy-sort",
        featurePoints: 3
      },
      {
        id: "b02-qt-models-reset-10",
        chapter: "qt-models",
        domain: "qt",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "Koko malli vaihtuu — käytät beginResetModel/endResetModel. Milloin riittää dataChanged?",
        choices: [
          {
            text: "Kun vain olemassa olevat rivit/sarakkeet muuttuvat — reset vain rakenteen muutoksessa",
            correct: true
          },
          {
            text: "Reset aina",
            correct: false
          },
          {
            text: "dataChanged ei koskaan",
            correct: false
          },
          {
            text: "Poista view",
            correct: false
          }
        ],
        correctFeedback: "Model reset vs incremental update — QAbstractItemModel docs.",
        wrongFeedback: "Reset repii selectionin. dataChanged/layoutChanged kun mahdollista.",
        sourceRef: "qt/modelview-programming",
        sourceUrl: "https://doc.qt.io/qt-6/model-view-programming.html",
        featureId: "qt:model-reset",
        featurePoints: 4
      },
      {
        id: "b02-qt-opengl-context-11",
        chapter: "qt-opengl",
        domain: "qt",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "OpenGL renderöinti toisesta threadista — mitä tarvitaan ennen glCall?",
        choices: [
          {
            text: "QOpenGLContext::makeCurrent() oikeassa threadissa",
            correct: true
          },
          {
            text: "OpenGL on thread-safe",
            correct: false
          },
          {
            text: "QWidget::update riittää",
            correct: false
          },
          {
            text: "glFlush only",
            correct: false
          }
        ],
        correctFeedback: "GL context on thread-bound — QOpenGLContext docs.",
        wrongFeedback: "Ilman makeCurrent GL-kutsut fail. Context thread affinity.",
        sourceRef: "qt/qopenglcontext",
        sourceUrl: "https://doc.qt.io/qt-6/qopenglcontext.html",
        featureId: "qt:gl-makecurrent",
        featurePoints: 4
      },
      {
        id: "b02-qt-opengl-vao-12",
        chapter: "qt-opengl",
        domain: "qt",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Moderni Qt OpenGL piirtää suorakulmion — mitä objekteja bindataan?",
        choices: [
          {
            text: "QOpenGLVertexArrayObject + QOpenGLBuffer (VBO) + shader program",
            correct: true
          },
          {
            text: "Immediate mode glBegin/glEnd",
            correct: false
          },
          {
            text: "QPainter only 3D",
            correct: false
          },
          {
            text: "QPixmap texture only",
            correct: false
          }
        ],
        correctFeedback: "VAO/VBO on moderni pipeline — Qt OpenGL docs.",
        wrongFeedback: "Fixed function on poistunut. VAO/VBO + shader.",
        sourceRef: "qt/qopenglvertexarrayobject",
        sourceUrl: "https://doc.qt.io/qt-6/qopenglvertexarrayobject.html",
        featureId: "qt:vao-vbo",
        featurePoints: 3
      },
      {
        id: "b02-qt-shaders-qsb-13",
        chapter: "qt-shaders",
        domain: "qt",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "Qt 6 RHI backend — shaderit pitää esikääntää. Työkalu?",
        choices: [
          {
            text: "qsb (Qt Shader Tools) — .qsb tiedostot",
            correct: true
          },
          {
            text: "glCompileShader runtime aina",
            correct: false
          },
          {
            text: "QSS stylesheet",
            correct: false
          },
          {
            text: "QPainter shader",
            correct: false
          }
        ],
        correctFeedback: "Qt 6 shader pipeline käyttää qsb — Qt Shader Tools docs.",
        wrongFeedback: "Runtime GLSL compile ei RHI:ssa. qsb offline compile.",
        sourceRef: "qt/qtshadertools",
        sourceUrl: "https://doc.qt.io/qt-6/qtshadertools-index.html",
        featureId: "qt:qsb-shader",
        featurePoints: 4
      },
      {
        id: "b02-qt-shaders-uniform-14",
        chapter: "qt-shaders",
        domain: "qt",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Shader uniform `mvpMatrix` — location vaihtuu eri GPU:lla. Turvallinen tapa?",
        choices: [
          {
            text: "QShaderProgram::uniformLocation(\"mvpMatrix\") tai UBO",
            correct: true
          },
          {
            text: "Hardcode location 0",
            correct: false
          },
          {
            text: "Preprocessor magic",
            correct: false
          },
          {
            text: "Poista uniform",
            correct: false
          }
        ],
        correctFeedback: "uniformLocation hakee nimen — QOpenGLShaderProgram docs.",
        wrongFeedback: "Location ei ole portable. Hae nimellä tai käytä UBO.",
        sourceRef: "qt/qopenglshaderprogram",
        sourceUrl: "https://doc.qt.io/qt-6/qopenglshaderprogram.html",
        featureId: "qt:uniform-location",
        featurePoints: 3
      }
    ],
    "javascript-web": [
      {
        id: "b02-js-async-fetch-01",
        chapter: "js-async",
        domain: "javascript",
        difficulty: 2,
        audiences: [
          "coworker"
        ],
        prompt: "REST-kutsu timeout 30s — käyttäjä navigoi pois. Miten peruutat fetchin?",
        choices: [
          {
            text: "AbortController + signal fetch optionsissa",
            correct: true
          },
          {
            text: "fetch ei voi peruuttaa",
            correct: false
          },
          {
            text: "window.close()",
            correct: false
          },
          {
            text: "setTimeout null",
            correct: false
          }
        ],
        correctFeedback: "AbortController peruuttaa fetch — MDN fetch docs.",
        wrongFeedback: "Ilman abort inflight request jatkuu. signal linkitetään fetchiin.",
        sourceRef: "MDN/AbortController",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
        featureId: "js:abort-controller",
        featurePoints: 3
      },
      {
        id: "b02-js-async-promise-02",
        chapter: "js-async",
        domain: "javascript",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Kolme riippumatonta API-kutsua — haluat odottaa kaikkia mutta yksi fail saa jatkua. Metodi?",
        choices: [
          {
            text: "Promise.allSettled",
            correct: true
          },
          {
            text: "Promise.all — sama mutta jatkuu failista",
            correct: false
          },
          {
            text: "callback hell",
            correct: false
          },
          {
            text: "await serial only",
            correct: false
          }
        ],
        correctFeedback: "allSettled odottaa kaikkia — MDN Promise docs.",
        wrongFeedback: "all hylkää ensimmäisestä virheestä. allSettled kerää tulokset.",
        sourceRef: "MDN/Promise/allSettled",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled",
        featureId: "js:promise-all-settled",
        featurePoints: 3
      },
      {
        id: "b02-js-async-microtask-03",
        chapter: "js-async",
        domain: "javascript",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "console.log järjestys: sync, Promise.resolve().then, setTimeout(0). Mikä ensin microtask jonossa?",
        choices: [
          {
            text: "Promise.then ennen setTimeout — microtask queue ennen macrotask",
            correct: true
          },
          {
            text: "setTimeout aina ensin",
            correct: false
          },
          {
            text: "sync viimeisenä",
            correct: false
          },
          {
            text: "Satunnainen",
            correct: false
          }
        ],
        correctFeedback: "Event loop: microtasks ennen seuraavaa macrotask — MDN event loop.",
        wrongFeedback: "Promise callback on microtask. setTimeout on macrotask.",
        sourceRef: "MDN/Event_loop",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop",
        featureId: "js:event-loop",
        featurePoints: 4
      },
      {
        id: "b02-js-async-await-04",
        chapter: "js-async",
        domain: "javascript",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "async funktio heittää virheen — caller ei saa stack tracea. Miten käsittelet?",
        choices: [
          {
            text: "try/catch await ympärillä tai .catch() chainissa",
            correct: true
          },
          {
            text: "async ei heitä koskaan",
            correct: false
          },
          {
            text: "console.log only",
            correct: false
          },
          {
            text: "Poista async",
            correct: false
          }
        ],
        correctFeedback: "async/await palauttaa rejected promise — MDN async function.",
        wrongFeedback: "Unhandled rejection jos ei catch. try/catch awaitin ympärillä.",
        sourceRef: "MDN/async_function",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function",
        featureId: "js:async-error",
        featurePoints: 3
      },
      {
        id: "b02-js-types-optional-05",
        chapter: "js-types",
        domain: "javascript",
        difficulty: 2,
        audiences: [
          "coworker"
        ],
        prompt: "API palauttaa `{ name?: string }` — miten luet turvallisesti ilman undefined crash?",
        choices: [
          {
            text: "Optional chaining: `user?.profile?.name`",
            correct: true
          },
          {
            text: "user.profile.name aina",
            correct: false
          },
          {
            text: "== null check riittää kaikkeen",
            correct: false
          },
          {
            text: "eval",
            correct: false
          }
        ],
        correctFeedback: "Optional chaining lyhentää null check — MDN optional chaining.",
        wrongFeedback: "Syvä property access crashaa. ?. palauttaa undefined.",
        sourceRef: "MDN/Optional_chaining",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining",
        featureId: "js:optional-chaining",
        featurePoints: 2
      },
      {
        id: "b02-js-types-coalesce-06",
        chapter: "js-types",
        domain: "javascript",
        difficulty: 2,
        audiences: [
          "coworker",
          "secretary"
        ],
        prompt: "Config `port` voi olla 0 — oletus 3000 vain jos null/undefined. Operaattori?",
        choices: [
          {
            text: "Nullish coalescing: `port ?? 3000`",
            correct: true
          },
          {
            text: "`port || 3000` — sama asia",
            correct: false
          },
          {
            text: "port ? port : 3000 estää 0",
            correct: false
          },
          {
            text: "port + 3000",
            correct: false
          }
        ],
        correctFeedback: "?? tarkistaa vain null/undefined — MDN nullish coalescing.",
        wrongFeedback: "|| pitää 0 falsyna. ?? säilyttää 0.",
        sourceRef: "MDN/Nullish_coalescing",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing",
        featureId: "js:nullish-coalescing",
        featurePoints: 2
      },
      {
        id: "b02-js-types-strict-07",
        chapter: "js-types",
        domain: "javascript",
        difficulty: 2,
        audiences: [
          "coworker"
        ],
        prompt: "Bugi: `if (count == '0')` menee läpi kun count on 0. Fix?",
        choices: [
          {
            text: "Käytä === tiukkaan vertailuun",
            correct: true
          },
          {
            text: "== on turvallisempi",
            correct: false
          },
          {
            text: "Muuta count stringiksi",
            correct: false
          },
          {
            text: "Poista vertailu",
            correct: false
          }
        ],
        correctFeedback: "=== ei tee type coercion — MDN equality.",
        wrongFeedback: "Loose equality sekoittaa tyypit. === on työpäivän oletus.",
        sourceRef: "MDN/Equality",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality",
        featureId: "js:strict-equality",
        featurePoints: 2
      },
      {
        id: "b02-js-modules-dynamic-08",
        chapter: "js-modules",
        domain: "javascript",
        difficulty: 3,
        audiences: [
          "coworker",
          "guru"
        ],
        prompt: "Feature flag lataa analytics-moduulin vain tarvittaessa. ES module tapa?",
        choices: [
          {
            text: "dynamic import(): `const m = await import('./analytics.js')`",
            correct: true
          },
          {
            text: "require() browserissa",
            correct: false
          },
          {
            text: "script tag sync",
            correct: false
          },
          {
            text: "eval module",
            correct: false
          }
        ],
        correctFeedback: "import() on async dynamic load — MDN import.",
        wrongFeedback: "Static import lataa aina. Dynamic import code-splitting.",
        sourceRef: "MDN/import",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import",
        featureId: "js:dynamic-import",
        featurePoints: 3
      },
      {
        id: "b02-js-modules-cycle-09",
        chapter: "js-modules",
        domain: "javascript",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "Kaksi moduulia importtaa toisensa — toinen export undefined init aikana. Ratkaisu?",
        choices: [
          {
            text: "Refaktoroi jaettu riippuvuus kolmanteen moduuliin tai käytä lazy import",
            correct: true
          },
          {
            text: "Poista export",
            correct: false
          },
          {
            text: "CommonJS only",
            correct: false
          },
          {
            text: "global variable",
            correct: false
          }
        ],
        correctFeedback: "Circular deps aiheuttavat TDZ-ongelmia — MDN modules guide.",
        wrongFeedback: "Syklit rikkovat init-järjestyksen. Jaa tai lazy load.",
        sourceRef: "MDN/Modules",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",
        featureId: "js:circular-deps",
        featurePoints: 4
      },
      {
        id: "b02-js-modules-tla-10",
        chapter: "js-modules",
        domain: "javascript",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "Moduulin top-level await hidastaa koko appin latausta — milloin käyttää?",
        choices: [
          {
            text: "Kun moduulin init vaatii async resurssin ennen exporttia — harkitse erillistä init()",
            correct: true
          },
          {
            text: "Aina jokaisessa tiedostossa",
            correct: false
          },
          {
            text: "TLA kielletty",
            correct: false
          },
          {
            text: "Vain callback",
            correct: false
          }
        ],
        correctFeedback: "Top-level await blokkaa module graph — MDN top-level await.",
        wrongFeedback: "TLA on tehokas mutta hidastaa riippuvia. Harkitse lazy init.",
        sourceRef: "MDN/Top_level_await",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await",
        featureId: "js:top-level-await",
        featurePoints: 4
      },
      {
        id: "b02-js-modules-export-11",
        chapter: "js-modules",
        domain: "javascript",
        difficulty: 2,
        audiences: [
          "coworker"
        ],
        prompt: "Haluat uudelleenexportata useita util-funktioita yhdestä entrypointista. Syntax?",
        choices: [
          {
            text: "export { foo, bar } from './utils.js'",
            correct: true
          },
          {
            text: "import * then window.foo",
            correct: false
          },
          {
            text: "require re-export",
            correct: false
          },
          {
            text: "globalThis only",
            correct: false
          }
        ],
        correctFeedback: "Re-export pitää API:n siistinä — MDN export.",
        wrongFeedback: "Barrel file pattern. export from ilman erillistä importia.",
        sourceRef: "MDN/export",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export",
        featureId: "js:re-export",
        featurePoints: 2
      },
      {
        id: "b02-js-runtime-closure-12",
        chapter: "js-runtime",
        domain: "javascript",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "for-loopissa 10 timeoutia tulostaa kaikki 10 — klassinen bugi. Fix?",
        choices: [
          {
            text: "let i loopissa tai IIFE/factory closure jokaiselle iteratiolle",
            correct: true
          },
          {
            text: "var i on fine",
            correct: false
          },
          {
            text: "Poista closure",
            correct: false
          },
          {
            text: "setTimeout sync",
            correct: false
          }
        ],
        correctFeedback: "var jakaa saman sidontaan — MDN closure.",
        wrongFeedback: "var + async callback = sama viimeinen arvo. let luo block scope.",
        sourceRef: "MDN/Closures",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
        featureId: "js:closure-loop",
        featurePoints: 3
      },
      {
        id: "b02-js-runtime-weakmap-13",
        chapter: "js-runtime",
        domain: "javascript",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "Metadata cache objekteille — Map pitää objektit elossa muistivuotona. Vaihtoehto?",
        choices: [
          {
            text: "WeakMap — avaimet eivät estä GC:tä",
            correct: true
          },
          {
            text: "Global object registry",
            correct: false
          },
          {
            text: "JSON.stringify keys",
            correct: false
          },
          {
            text: "WeakMap ei toimi objekteille",
            correct: false
          }
        ],
        correctFeedback: "WeakMap on weakly held keys — MDN WeakMap.",
        wrongFeedback: "Map strong reference estää GC. WeakMap metadataan.",
        sourceRef: "MDN/WeakMap",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap",
        featureId: "js:weakmap-cache",
        featurePoints: 4
      },
      {
        id: "b02-js-runtime-pollution-14",
        chapter: "js-runtime",
        domain: "javascript",
        difficulty: 4,
        audiences: [
          "security",
          "guru"
        ],
        prompt: "Käyttäjän JSON merge objektiin — `__proto__` payload. Miten estät?",
        choices: [
          {
            text: "Object.create(null) tai Map; älä käytä deep merge ilman key validation",
            correct: true
          },
          {
            text: "JSON.parse on aina turvallinen",
            correct: false
          },
          {
            text: "Luota client input",
            correct: false
          },
          {
            text: "eval JSON",
            correct: false
          }
        ],
        correctFeedback: "Prototype pollution via __proto__ — OWASP/MDN Object.",
        wrongFeedback: "Deep merge voi saastuttaa prototyypin. Validoi avaimet.",
        sourceRef: "MDN/Object/create",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create",
        featureId: "js:prototype-pollution",
        featurePoints: 5
      }
    ],
    "postgresql-tuning": [
      {
        id: "b02-pg-indexes-gin-01",
        chapter: "pg-indexes",
        domain: "postgres",
        difficulty: 3,
        audiences: [
          "coworker",
          "guru"
        ],
        prompt: "JSONB-kenttä `metadata @> '{\"tag\": \"urgent\"}'` — seq scan hidas. Indeksityyppi?",
        choices: [
          {
            text: "GIN index JSONB:lle",
            correct: true
          },
          {
            text: "B-tree primary key riittää",
            correct: false
          },
          {
            text: "Hash index kaikkeen",
            correct: false
          },
          {
            text: "Ei indeksiä koskaan JSONB",
            correct: false
          }
        ],
        correctFeedback: "GIN tukee containment @> — PostgreSQL JSON indexes docs.",
        wrongFeedback: "B-tree ei optimoi @> operaatiota. GIN on JSONB-hakuun.",
        sourceRef: "postgresql/json-indexing",
        sourceUrl: "https://www.postgresql.org/docs/current/datatype-json.html#JSON-INDEXING",
        featureId: "postgres:gin-jsonb",
        featurePoints: 4
      },
      {
        id: "b02-pg-indexes-btree-02",
        chapter: "pg-indexes",
        domain: "postgres",
        difficulty: 2,
        audiences: [
          "coworker"
        ],
        prompt: "WHERE status = 'active' AND created_at > '2024-01-01' — yleisin indeksityyppi?",
        choices: [
          {
            text: "B-tree composite index (status, created_at) sarakkeiden järjestyksellä",
            correct: true
          },
          {
            text: "GIN only",
            correct: false
          },
          {
            text: "Brin aina parempi",
            correct: false
          },
          {
            text: "Seq scan aina nopein",
            correct: false
          }
        ],
        correctFeedback: "B-tree on oletus equality/range — PostgreSQL indexes docs.",
        wrongFeedback: "Composite btree matchaa WHERE- ehtoja. Järjestys vaikuttaa.",
        sourceRef: "postgresql/indexes-types",
        sourceUrl: "https://www.postgresql.org/docs/current/indexes-types.html",
        featureId: "postgres:btree-composite",
        featurePoints: 3
      },
      {
        id: "b02-pg-indexes-partial-03",
        chapter: "pg-indexes",
        domain: "postgres",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Indeksi vain active riveille — 90% archived. Optimointi?",
        choices: [
          {
            text: "Partial index: CREATE INDEX ... WHERE status = 'active'",
            correct: true
          },
          {
            text: "Full index kaikille",
            correct: false
          },
          {
            text: "Duplicate table",
            correct: false
          },
          {
            text: "VACUUM only",
            correct: false
          }
        ],
        correctFeedback: "Partial index pienentää kokoa — PostgreSQL partial indexes.",
        wrongFeedback: "Full index turha archived riveille. WHERE clause partial index.",
        sourceRef: "postgresql/indexes-partial",
        sourceUrl: "https://www.postgresql.org/docs/current/indexes-partial.html",
        featureId: "postgres:partial-index",
        featurePoints: 3
      },
      {
        id: "b02-pg-indexes-covering-04",
        chapter: "pg-indexes",
        domain: "postgres",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "Query tarvitsee id, email — index only scan halutaan. PostgreSQL 11+?",
        choices: [
          {
            text: "INCLUDE columns: CREATE INDEX ... INCLUDE (email)",
            correct: true
          },
          {
            text: "CLUSTER only",
            correct: false
          },
          {
            text: "Materialized view aina",
            correct: false
          },
          {
            text: "Secondary sort",
            correct: false
          }
        ],
        correctFeedback: "Covering index INCLUDE — PostgreSQL indexes docs.",
        wrongFeedback: "INCLUDE sarakkeet leafissa ilman search keytä. Index-only scan.",
        sourceRef: "postgresql/indexes-index-only-scans",
        sourceUrl: "https://www.postgresql.org/docs/current/indexes-index-only-scans.html",
        featureId: "postgres:covering-index",
        featurePoints: 4
      },
      {
        id: "b02-pg-explain-analyze-05",
        chapter: "pg-explain",
        domain: "postgres",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Query hidas tuotannossa — haluat todelliset ajat ei arvion. Komento?",
        choices: [
          {
            text: "EXPLAIN (ANALYZE, BUFFERS) SELECT ...",
            correct: true
          },
          {
            text: "EXPLAIN ilman ANALYZE riittää aina",
            correct: false
          },
          {
            text: "SELECT * only",
            correct: false
          },
          {
            text: "pg_dump",
            correct: false
          }
        ],
        correctFeedback: "ANALYZE suorittaa queryn — PostgreSQL EXPLAIN docs.",
        wrongFeedback: "Pelkkä EXPLAIN arvioi. ANALYZE mittaa todellisen suorituksen.",
        sourceRef: "postgresql/sql-explain",
        sourceUrl: "https://www.postgresql.org/docs/current/sql-explain.html",
        featureId: "postgres:explain-analyze",
        featurePoints: 4
      },
      {
        id: "b02-pg-explain-seq-06",
        chapter: "pg-explain",
        domain: "postgres",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "EXPLAIN näyttää Seq Scan 5M rivin taulussa — aina huono?",
        choices: [
          {
            text: "Ei — pieni osuma tai suuri fraction voi olla halvempi kuin random index scan",
            correct: true
          },
          {
            text: "Seq Scan aina korjattava",
            correct: false
          },
          {
            text: "Seq Scan = bugi",
            correct: false
          },
          {
            text: "Rebuild DB",
            correct: false
          }
        ],
        correctFeedback: "Planner valitsee kustannuksen mukaan — PostgreSQL planner docs.",
        wrongFeedback: "Index ei aina voita suurella osumalla. Tarkista rows ja cost.",
        sourceRef: "postgresql/performance-tips",
        sourceUrl: "https://www.postgresql.org/docs/current/performance-tips.html",
        featureId: "postgres:seq-scan-ok",
        featurePoints: 3
      },
      {
        id: "b02-pg-explain-nested-07",
        chapter: "pg-explain",
        domain: "postgres",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "Nested Loop + Seq Scan sisäpuolella miljoona kertaa — tyypillinen fix?",
        choices: [
          {
            text: "Indeksi join/where sarakkeille tai muuta join järjestystä / statistics",
            correct: true
          },
          {
            text: "SET enable_nestloop=off aina",
            correct: false
          },
          {
            text: "Lisää RAM only",
            correct: false
          },
          {
            text: "Poista JOIN",
            correct: false
          }
        ],
        correctFeedback: "Nested loop ilman indexiä on O(n*m) — PostgreSQL EXPLAIN.",
        wrongFeedback: "Sisä-loop seq scan on pullonkaula. Indeksi tai hash/merge join.",
        sourceRef: "postgresql/explicit-joins",
        sourceUrl: "https://www.postgresql.org/docs/current/explicit-joins.html",
        featureId: "postgres:nested-loop",
        featurePoints: 4
      },
      {
        id: "b02-pg-explain-stats-08",
        chapter: "pg-explain",
        domain: "postgres",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Planner arvioi 100 riviä — todellisuudessa 100000. Ensimmäinen toimenpide?",
        choices: [
          {
            text: "ANALYZE table_name — päivitä statistics",
            correct: true
          },
          {
            text: "REINDEX DATABASE",
            correct: false
          },
          {
            text: "random_page_cost=0",
            correct: false
          },
          {
            text: "Poista WHERE",
            correct: false
          }
        ],
        correctFeedback: "Stale stats vääristää planin — PostgreSQL ANALYZE docs.",
        wrongFeedback: "Vanhentuneet stats → huono plan. ANALYZE kerää uudet.",
        sourceRef: "postgresql/sql-analyze",
        sourceUrl: "https://www.postgresql.org/docs/current/sql-analyze.html",
        featureId: "postgres:analyze-stats",
        featurePoints: 3
      },
      {
        id: "b02-pg-vacuum-bloat-09",
        chapter: "pg-vacuum",
        domain: "postgres",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "UPDATE-heavy taulu — levy kasvaa vaikka rivimäärä sama. Syy ja toimenpide?",
        choices: [
          {
            text: "Dead tuples — VACUUM (autovacuum) vapauttaa tilaa uudelleenkäyttöön",
            correct: true
          },
          {
            text: "DELETE DATABASE",
            correct: false
          },
          {
            text: "VACUUM FULL heti tuotannossa",
            correct: false
          },
          {
            text: "Lisää indeksejä",
            correct: false
          }
        ],
        correctFeedback: "PostgreSQL MVCC jättää dead tupleja — routine VACUUM.",
        wrongFeedback: "Dead tuples bloattavat. Autovacuum hoitaa normaalisti.",
        sourceRef: "postgresql/routine-vacuuming",
        sourceUrl: "https://www.postgresql.org/docs/current/routine-vacuuming.html",
        featureId: "postgres:vacuum-bloat",
        featurePoints: 4
      },
      {
        id: "b02-pg-vacuum-wrap-10",
        chapter: "pg-vacuum",
        domain: "postgres",
        difficulty: 5,
        audiences: [
          "guru",
          "security"
        ],
        prompt: "Varoitus: database approaching transaction ID wraparound. Kiireellinen toimenpide?",
        choices: [
          {
            text: "VACUUM FREEZE (autovacuum freeze) — estä shutdown wraparound",
            correct: true
          },
          {
            text: "Ignoroi varoitus",
            correct: false
          },
          {
            text: "pg_dump only",
            correct: false
          },
          {
            text: "DROP TABLE random",
            correct: false
          }
        ],
        correctFeedback: "XID wraparound on kriittinen — PostgreSQL transaction ID docs.",
        wrongFeedback: "Wraparound voi pysäyttää DB:n. Freeze vanhat tupleversiot.",
        sourceRef: "postgresql/routine-vacuuming#VACUUM-FOR-WRAPAROUND",
        sourceUrl: "https://www.postgresql.org/docs/current/routine-vacuuming.html#VACUUM-FOR-WRAPAROUND",
        featureId: "postgres:wraparound",
        featurePoints: 5
      },
      {
        id: "b02-pg-vacuum-long-xact-11",
        chapter: "pg-vacuum",
        domain: "postgres",
        difficulty: 4,
        audiences: [
          "coworker"
        ],
        prompt: "Autovacuum ei siivoa — pg_stat_activity näyttää idle in transaction 8h. Mitä teet?",
        choices: [
          {
            text: "Selvitä pitkä transaktio — se estää vacuumia poistamasta dead tupleja",
            correct: true
          },
          {
            text: "REBOOT server",
            correct: false
          },
          {
            text: "max_connections=1",
            correct: false
          },
          {
            text: "DROP autovacuum",
            correct: false
          }
        ],
        correctFeedback: "Long xact pitää xmin — PostgreSQL MVCC vacuum.",
        wrongFeedback: "Idle in transaction blokkaa vacuum cleanup. Kill/sulje transaktio.",
        sourceRef: "postgresql/monitoring-stats",
        sourceUrl: "https://www.postgresql.org/docs/current/monitoring-stats.html",
        featureId: "postgres:long-transaction",
        featurePoints: 4
      },
      {
        id: "b02-pg-vacuum-full-12",
        chapter: "pg-vacuum",
        domain: "postgres",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "Disk nearly full — harkitset VACUUM FULL tuotannossa. Riski?",
        choices: [
          {
            text: "Exclusive lock + uudelleenkirjoitus — downtime ja lock",
            correct: true
          },
          {
            text: "VACUUM FULL online ilman lockia",
            correct: false
          },
          {
            text: "Ei riskiä",
            correct: false
          },
          {
            text: "Nopeampi kuin VACUUM",
            correct: false
          }
        ],
        correctFeedback: "VACUUM FULL on raskas — PostgreSQL VACUUM docs.",
        wrongFeedback: "FULL lockaa taulun. Käytä varhain maintenance-ikkunassa.",
        sourceRef: "postgresql/sql-vacuum",
        sourceUrl: "https://www.postgresql.org/docs/current/sql-vacuum.html",
        featureId: "postgres:vacuum-full",
        featurePoints: 3
      },
      {
        id: "b02-pg-config-work-mem-13",
        chapter: "pg-config",
        domain: "postgres",
        difficulty: 4,
        audiences: [
          "guru"
        ],
        prompt: "Iso sort/hash join spillaa diskiin — logissa 'temporary file'. Parametri?",
        choices: [
          {
            text: "Kasvata work_mem (session/query tasolla harkiten)",
            correct: true
          },
          {
            text: "shared_buffers=0",
            correct: false
          },
          {
            text: "max_connections=10000",
            correct: false
          },
          {
            text: "Poista sort",
            correct: false
          }
        ],
        correctFeedback: "work_mem rajoittaa sort/hash muistia — PostgreSQL runtime config.",
        wrongFeedback: "Liian pieni work_mem → temp files. Nosta kohtuullisesti.",
        sourceRef: "postgresql/runtime-config-resource",
        sourceUrl: "https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-WORK-MEM",
        featureId: "postgres:work-mem",
        featurePoints: 4
      },
      {
        id: "b02-pg-config-shared-14",
        chapter: "pg-config",
        domain: "postgres",
        difficulty: 3,
        audiences: [
          "coworker"
        ],
        prompt: "PostgreSQL cache hit ratio matala — ensimmäinen muistiparametri tarkistaa?",
        choices: [
          {
            text: "shared_buffers (tyypillisesti ~25% RAM, testaa)",
            correct: true
          },
          {
            text: "work_mem=8GB globaalisti",
            correct: false
          },
          {
            text: "fsync=off tuotannossa",
            correct: false
          },
          {
            text: "random_page_cost=0",
            correct: false
          }
        ],
        correctFeedback: "shared_buffers on PG buffer cache — PostgreSQL config docs.",
        wrongFeedback: "Liian pieni shared_buffers lisää disk IO:ta. Säädä mitattuna.",
        sourceRef: "postgresql/runtime-config-resource#GUC-SHARED-BUFFERS",
        sourceUrl: "https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-SHARED-BUFFERS",
        featureId: "postgres:shared-buffers",
        featurePoints: 3
      },
      {
        id: "b02-pg-config-connections-15",
        chapter: "pg-config",
        domain: "postgres",
        difficulty: 3,
        audiences: [
          "coworker",
          "project-lead"
        ],
        prompt: "500 microservice instanssia × 10 connection = pool explosion. Ratkaisu?",
        choices: [
          {
            text: "Connection pooler (PgBouncer) + alenna max_connections tarpeen mukaan",
            correct: true
          },
          {
            text: "max_connections=100000",
            correct: false
          },
          {
            text: "Jokainen app suoraan superuser",
            correct: false
          },
          {
            text: "Poista idle timeout",
            correct: false
          }
        ],
        correctFeedback: "Liian monta connectionia kuormittaa — PostgreSQL connections + pooling.",
        wrongFeedback: "PostgreSQL connections ovat raskaita. PgBouncer poolaa.",
        sourceRef: "postgresql/runtime-config-connection",
        sourceUrl: "https://www.postgresql.org/docs/current/runtime-config-connection.html",
        featureId: "postgres:connection-pooling",
        featurePoints: 3
      }
    ]
  };
