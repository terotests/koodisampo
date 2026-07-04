# Funktio lukitsee kaksi mutexia — riski deadlockille. C++17-ratkaisu?

**Ratkaisu:** `std::scoped_lock lock(m1, m2)` — lukitsee usean mutexin deadlock-turvallisesti (sisäinen järjestys).

Vaihtoehto: aina sama lukitusjärjestys kaikissa säikeissä.
