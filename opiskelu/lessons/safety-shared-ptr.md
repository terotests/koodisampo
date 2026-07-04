# Milloin `std::shared_ptr` on perusteltu `unique_ptr`:n sijaan?

## Tilanne

Kaksi komponenttia käyttää samaa resurssia:

```cpp
Texture* tex = loadTexture(path);
renderer.setTexture(tex);
ui.setIcon(tex);
// kuka delete? renderer luulee omistavansa — ui myös
```

Yksittäinen omistaja (`unique_ptr`) ei riitä, kun **useampi osa** järjestelmästä jakaa saman olion elinkaaren — esim. renderer ja UI cache, tai callback pitää kuvaa hengissä. Raaka osoitin + manuaalinen ref counting on virhealtista.

## Ratkaisu

**`std::shared_ptr<T>`** + **`std::make_shared`**:

```cpp
auto tex = std::make_shared<Texture>(load(path));
renderer.setTexture(tex);
ui.setIcon(tex);
// tex vapautuu kun viimeinen shared_ptr tuhoutuu
```

Atomilaskuri seuraa omistajia. `make_shared` tekee yhden allokaation (olio + control block). `weak_ptr` riippuvuuksille (cache), jotka eivät pidä olioa hengissä.

## Käytännössä

Oletus: **`unique_ptr`** — halvempi, selkeä omistus. `shared_ptr` vain kun jaettu elinkaari on välttämätön. Vältä `shared_ptr` funktioparametrina (ylimääräinen atomic inc/dec) — passaa `const shared_ptr&` tai `weak_ptr`. CppCoreGuidelines R.12–R.14.

[Lue lisää](https://en.cppreference.com/w/cpp/memory/shared_ptr)
