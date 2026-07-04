# Mikä on selkein tapa käydä kokoelma läpi ilman indeksivirheitä?

## Tilanne

Perinteinen indeksisilmukka:

```cpp
for (size_t i = 0; i < vec.size(); ++i) {
    process(vec[i]);  // off-by-one, i <= size bugi
}
```

Tai C-tyyli:

```cpp
for (int i = 0; i < vec.size(); ++i)  // size_t vs int — UB riski
```

Indeksivirheet ( `<` vs `<=`, signed/unsigned ) ovat yleisiä. Lukija laskee mielessään rajat sen sijaan että näkee intentin: "käy kaikki elementit läpi".

## Ratkaisu

**Range-for** (C++11):

```cpp
for (const auto& item : vec) {
    process(item);
}

for (auto& row : matrix) {
    row.normalize();
}
```

Ei indeksiä — ei off-by-one. `const auto&` välttää kopioinnin isommille tyypeille. C++20: `std::ranges` + views suodatukseen ilman väliaikaista konttia.

## Käytännössä

Tarvitset indeksin vain kun tarvitset position (esim. `vec[i+1]` vertailu): käytä `size_t i` ja `i < vec.size()`. Muuten range-for. CppCoreGuidelines ES.71: "Prefer a range-for-statement to a for-statement when there is a choice."

[Lue lisää](https://en.cppreference.com/w/cpp/language/range-for)
