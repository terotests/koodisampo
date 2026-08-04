# Funktio lataa käyttäjän ID:llä ja voi epäonnistua useasta syystä. Milloin `std::expected` on parempi kuin `std::optional`?

## Tilanne

```cpp
std::optional<User> load_user(UserId id);
```

`nullopt` tarkoittaa "ei onnistunut", mutta ei kerro *miksi*: ei löytynyt, tietokantavirhe, oikeudet, timeout. Kutsuja ei voi erottaa "käyttäjää ei ole" ja "infra kaatui" -tiloja ilman sivukanavaa (errno, exception, out-parametri).

## Ratkaisu

Kun tarvitset sekä arvon että tyypitetyn virheen ilman exceptionia, käytä `std::expected` (C++23) tai vastaavaa Result-tyyppiä:

```cpp
enum class LoadError { NotFound, DbDown, Forbidden };

std::expected<User, LoadError> load_user(UserId id);

if (auto user = load_user(id)) {
  use(*user);
} else {
  switch (user.error()) { ... }
}
```

`optional` = arvo tai poissaolo (yksi "tyhjä" tila). `expected` = arvo **tai** virhe. Exceptionit sopivat edelleen poikkeuksellisiin / harvinaisiin polkuihin rajapinnan yli.

## Käytännössä

- Domain-virheet joita kutsujan pitää käsitellä → `expected` / Result.
- Aidosti valinnainen arvo ("ei asetettu") → `optional`.
- Kirjastorajoilla: dokumentoi throw-sopimus; älä sekoita kolmea mallia samaan funktioon.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/expected)
