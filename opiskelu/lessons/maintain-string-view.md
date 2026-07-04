# Milloin `std::string_view` on hyödyllinen?

**Kun:** funktio **lukee** merkkijonoa mutta ei tarvitse omistaa sitä — parametrit, prefix/suffix, parsinta ilman allokaatiota.

**Ei kun:** data pitää tallentaa pidempään kuin lähde elää → käytä `std::string`.

→ ks. myös Kysy AI:lta [7].
