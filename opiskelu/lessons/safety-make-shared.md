# Miksi `std::make_shared<T>(args)` on parempi kuin `shared_ptr<T>(new T(args))`?

**Ongelma:** `shared_ptr(new T)` tekee kaksi allokaatiota (olio + control block).

**Ratkaisu:** `std::make_shared<T>(args)` — yksi allokaatio, exception-safe, vähemmän fragmentaatiota.

**Poikkeus:** custom deleter vaatii `shared_ptr` + `new`.
