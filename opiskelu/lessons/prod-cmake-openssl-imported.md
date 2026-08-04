# OpenSSL on kytketty vanhalla tyylillä: `include_directories(${OPENSSL_INCLUDE_DIR})` ja `target_link_libraries(app ${OPENSSL_LIBRARIES})`. Mikä moderni korvaus?

## Tilanne

Vanha Find-moduuli täyttää muuttujat `OPENSSL_INCLUDE_DIR` ja `OPENSSL_LIBRARIES`. Globaali `include_directories` ja raakalinkitys toimivat yhdessä ympäristössä, mutta:

- include-polut vuotavat kaikille targeteille
- Windows/vcpkg/Homebrew-polut vaihtelevat
- transitiiviset riippuvuudet (Crypto vs SSL) pitää muistaa käsin

## Ratkaisu

Käytä imported targeteja:

```cmake
find_package(OpenSSL REQUIRED)
target_link_libraries(app PRIVATE OpenSSL::SSL OpenSSL::Crypto)
```

`OpenSSL::SSL` / `OpenSSL::Crypto` kantavat include-polut, linkkikirjastot ja tarvittaessa riippuvuudet. Ei globaaleja `include_directories`-kutsuja.

## Käytännössä

- `REQUIRED` failaa configure-vaiheessa selkeästi, jos OpenSSL puuttuu.
- Linkkaa vain tarvitsemasi: pelkkä hash → usein `OpenSSL::Crypto` riittää.
- vcpkg/conan integroituvat samaan imported-target -malliin.
- Vältä `-lssl -lcrypto` käsin — polut ja ABI-versiot karkaavat.

[Lue lisää](https://cmake.org/cmake/help/latest/module/FindOpenSSL.html)
