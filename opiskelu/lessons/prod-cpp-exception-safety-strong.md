# assign-operaatio heittää kesken kopioinnin. Miten copy-and-swap takaa strong exception safety -takuun?

## Tilanne

```cpp
MyString& operator=(const MyString& other) {
  delete[] data_;
  data_ = new char[other.size_];  // voi heittää
  // ...
}
```

Jos allokaatio heittää `bad_alloc` sen jälkeen kun vanha puskuri on jo vapautettu, objekti jää rikkinäiseen tilaan. **Strong exception safety** vaatii: operaatio joko onnistuu kokonaan tai kohde säilyy ennallaan.

## Ratkaisu

Copy-and-swap:

```cpp
MyString& operator=(MyString other) noexcept(/* jos swap on */) {
  swap(*this, other);
  return *this;
}
```

1. Kopio (tai move) tehdään **väliaikaiseen** `other`-parametriin. Jos kopio heittää, `*this` ei ole muuttunut.
2. `swap` vaihtaa resurssit — pidä `swap` noexcept / non-throwing.
3. Väliaikaisen destruktori siivoaa vanhat resurssit.

Näin assign joko päivittää tilan tai jättää alkuperäisen koskematta.

## Käytännössä

- Strong ≠ nothrow (ei koskaan heitä) eikä pelkkä basic (ei vuoda resursseja).
- `std::vector` ja monet standardikirjaston tyypit dokumentoivat takuunsa — seuraa samaa omaisuudenhallinnassa (RAII).
- Preferoi copy-and-swap kun hallitset raakoja resursseja; muuten käytä olemassa olevia RAII-tyyppejä (`std::string`, smart pointerit).

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Re-raii)
