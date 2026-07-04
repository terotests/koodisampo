# Async callback tarvitsee `shared_ptr`:n `this`:stä, mutta `shared_ptr(this)` kaataa ohjelman. Oikea pattern?

**Ongelma:** `shared_ptr(this)` luo toisen control blockin → double delete.

**Ratkaisu:** peri `std::enable_shared_from_this<T>` ja käytä `shared_from_this()`. Olio pitää olla jo `shared_ptr`:ssä (`make_shared`).
