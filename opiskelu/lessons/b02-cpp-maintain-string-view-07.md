# Funktio ottaa `const std::string&` mutta kutsutaan literaaleilla — turhia allokaatioita. Parempi parametri?

**Ratkaisu:** `std::string_view` — ei allokoi, toimii literaaleille, `std::string`:ille ja `const char*`:lle.

**Rajoitus:** älä tallenna `string_view`:tä jäseneksi ilman pysyvää omistajaa.
