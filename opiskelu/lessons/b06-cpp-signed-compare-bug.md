# Code review: `if (a < b)` missä a on int ja b size_t — tuotannossa väärä haara. Mikä on riski?

## Tilanne

```cpp
int offset = userInput();   // voi olla negatiivinen
size_t buffer_size = getSize();

if (offset < buffer_size) {
    copy(buffer, offset);
}
```

Vertailu `offset < buffer_size` muuntaa `offset` unsignediksi. Negatiivinen `offset` (esim. -1) muuttuu suureksi `size_t`:ksi → ehto on **todellisuudessa tosi** → kopiointi väärästä kohdasta, buffer overflow.

## Ratkaisu

Validoi ennen vertailua tai käytä samaa signednessiä:

```cpp
if (offset < 0 || static_cast<size_t>(offset) >= buffer_size)
    throw std::out_of_range("offset");

// tai pidä molemmat signed:
std::ptrdiff_t offset = ...;
if (offset >= 0 && offset < static_cast<std::ptrdiff_t>(buffer_size))
```

Älä koskaan vertaile signed ja unsigned ilman eksplisiittistä tarkoitusta.

## Käytännössä

Tämä on yksi yleisimmistä turvallisuusbugista C++:ssa. Code review -checklist: jokainen `<` signed/unsigned-parin välillä.

[Lue lisää](https://en.cppreference.com/w/cpp/language/operator_arithmetic)
