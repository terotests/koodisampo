# Tuotantobugi: buffer overflow C-tyylisessä `char*` API:ssa. Moderni korvaava tyyppi rajattuun näkymään?

**Ratkaisu:** `std::string_view` (teksti) tai `std::span<const char>` — näkymä tunnettuun pituuteen, ei NUL-päättymisoletusta.
