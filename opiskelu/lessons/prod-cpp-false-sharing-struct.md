# Kaksi std::atomic-laskuria on vierekkäin structissa ja eri säikeet päivittävät niitä. Miksi suorituskyky romahtaa?

**Ongelma:** false sharing — laskurit samalla cache linellä (64 B), CPU invalidoi linen turhaan.

**Ratkaisu:** erota `alignas(64)` / padding (`PaddedCounter`). C++17: `std::hardware_destructive_interference_size`.
