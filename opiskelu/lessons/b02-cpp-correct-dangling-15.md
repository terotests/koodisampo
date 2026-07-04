# Funktio palauttaa `const std::string&` paikallisesta muuttujasta — crash tuotannossa. Mikä on oikea paluutyyppi?

## Tilanne

Apufunktio näyttää tehokkaalta:

```cpp
const std::string& makeLabel(int id) {
    std::string label = "item-" + std::to_string(id);
    return label;  // dangling reference
}
```

`label` tuhoutuu funktion lopussa. Palautettu viittaus osoittaa vapautettuun muistiin — UB, satunnainen crash tai tietomurto. Ongelma on yleinen, koska `const&` näyttää turvalliselta.

## Ratkaisu

Palauta omistettava arvo tai viittaus, jonka elinikä on taattu:

```cpp
std::string makeLabel(int id) {
    return "item-" + std::to_string(id);  // RVO/NRVO
}
```

Kääntäjä usein eliminoi kopion (RVO). Jos kutsuja tarvitsee vain väliaikaisen lukuoikeuden ja lähde elää kutsun ajan, `std::string_view` voi sopia — **ei** paikallisesta `std::string`:stä palautettuna.

## Sääntö

Älä koskaan palauta viittausta tai osoitinta paikalliseen, stack-allokoituun tai tilapäiseen objektiin. CppCoreGuidelines: F.43, F.45.

[Lue lisää](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rf-return-ref)
