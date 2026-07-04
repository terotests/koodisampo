# Deadlock kahdessa mutexissa: thread A lukitsee m1→m2, thread B m2→m1. Miten estät?

**Ratkaisu:** (1) `std::scoped_lock(m1, m2)` — sama kuin [10]. (2) Kiinteä globaali lukitusjärjestys kaikissa säikeissä. (3) Vältä sisäkkäisiä lukituksia — refaktoroi yhdeksi mutexiksi tai lock hierarchy.
