# Ohjelma toimii build-hakemistossa, mutta installin jälkeen: `error while loading shared libraries: libfoo.so`. Ensimmäinen CMake-korjaus?

## Tilanne

Kehityspuussa linker löytää `libfoo.so`:n build-tree RPATH:ista. Asennuksen jälkeen binary on esim. `/usr/local/bin/app`, mutta jaettu kirjasto on `/usr/local/lib/libfoo.so` — eikä RPATH/RUNPATH osoita sinne. `ldd` näyttää `not found`.

## Ratkaisu

Aseta install-RPATH suhteelliseksi binaryyn nähden:

```cmake
set(CMAKE_INSTALL_RPATH "$ORIGIN/../lib")
# tai target-kohtaisesti:
set_target_properties(app PROPERTIES
  INSTALL_RPATH "$ORIGIN/../lib"
)
```

`$ORIGIN` (Linux) tarkoittaa binaryn hakemistoa. macOS:lla vastaava on `@loader_path`. Windows käyttää yleensä DLL-hakupolkua / samaa hakemistoa.

## Käytännössä

- Debuggaa: `ldd app`, `readelf -d app | grep PATH`.
- `CMAKE_BUILD_WITH_INSTALL_RPATH` / `CMAKE_INSTALL_RPATH_USE_LINK_PATH` auttavat joissain layoutissa — ymmärrä layout ennen kopiointia.
- Pelkkä `LD_LIBRARY_PATH` tuotannossa on hauras; korjaa packaging/RPATH.

[Lue lisää](https://cmake.org/cmake/help/latest/prop_tgt/INSTALL_RPATH.html)
