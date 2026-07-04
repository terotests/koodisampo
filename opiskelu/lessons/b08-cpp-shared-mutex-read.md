# Konfiguraatiocache: lukijoita paljon, kirjoittajia harvoin — std::mutex hidastaa turhaan. Parempi primitiivi?

**Ratkaisu:** `std::shared_mutex` + `std::shared_lock` (luku) / `std::unique_lock` (kirjoitus).

Lukijat eivät blokkaa toisiaan; kirjoitus eristää kaikki.
