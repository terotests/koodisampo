# Milloin `std::move` on perusteltu suurille objekteille?

## Tilanne

Funktio siirtää suuren vektorin toiseen konttiin:

```cpp
std::vector<Record> ingest(std::vector<Record> input) {
    std::vector<Record> result;
    for (auto& r : input) {
        result.push_back(r);  // kopio joka kierroksella — hidas
    }
    return result;
}
```

Suuret objektit (`vector`, `string`, `unique_ptr`) kopioivat syvällisesti — allokaatio ja elementtien kopiointi. Kun **lähde ei enää tarvita** transferin jälkeen, kopio on turha.

## Ratkaisu

**`std::move`** ilmaisee siirron — lähde jää tyhjäksi mutta validiksi:

```cpp
std::vector<Record> ingest(std::vector<Record> input) {
    std::vector<Record> result;
    result.reserve(input.size());
    for (auto& r : input) {
        result.push_back(std::move(r));
    }
    return result;
}

// tai suoraan:
void append(std::vector<Record>& dest, std::vector<Record> src) {
    dest.insert(dest.end(),
                std::make_move_iterator(src.begin()),
                std::make_move_iterator(src.end()));
}
```

Move on perusteltu, kun et enää käytä lähdearvoa sen jälkeen. Huom: `return std::move(local)` **estää** usein RVO:n — älä move paluuarvoa paikallisesta muuttujasta.

## Käytännössä

Move vaatii move-operaattorin (tai implisiittisen siirron). `noexcept` move auttaa `vector`:n reallokoinnissa. CppCoreGuidelines: move kun lähde kuolee; älä move jos tarvitset lähdearvon uudelleen.

[Lue lisää](https://en.cppreference.com/w/cpp/utility/move)
