# Miten yksinkertainen `int` kannattaa välittää konstruktorille?

## Tilanne

Tiimi debatoi konstruktorin signatuurista:

```cpp
class Counter {
public:
    explicit Counter(const int& initial);  // turha viittaus?
};
```

`const int&` näyttää "tehokkaalta" isommille tyypeille, mutta `int` on tyypillisesti 4 tavua — viittaus on osoitin (8 tavua 64-bit), joten se on **hitaampi** ja monimutkaisempi kuin arvo.

Lisäksi viittaus viittaa kutsujan muuttujaan — turha elinikäongelma ja aliasing-mahdollisuus yksinkertaiselle arvolle.

## Ratkaisu

Passaa **by-value** (arvo):

```cpp
class Counter {
public:
    explicit Counter(int initial) : value_(initial) {}
private:
    int value_;
};
```

Kopiointi on halpa (rekisteri/stack). `explicit` estää implisiittiset muunnokset `Counter c = 42;` → vaatii `Counter c{42};`.

Sääntö: trivial, cheap-to-copy tyypit (`int`, `bool`, `float`, `enum class`, pienet structit) → arvo. Isot tai kalliit tyypit (`std::string`, kontit) → `const&` tai `string_view`.

## Käytännössä

Sama koskee funktioparametreja: `void setPort(int port)`, ei `const int& port`. CppCoreGuidelines F.16/F.20: pass-by-value kun kopiointi on halvempaa kuin indirektio.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/03-Style.md)
