# Iso C++-projekti harkitsee precompiled headereita (PCH). Mitä cpp-best-practices varoittaa?

## Tilanne

PCH nopeuttaa buildia — yhteinen `<vector>`, `<string>` precompiled. Mutta header-riippuvuusvirheet voivat piiloutua.

## Ratkaisu

**PCH tradeoff**:

- ✅ Nopeampi build isoille projekteille
- ⚠️ Voi piilottaa puuttuvat includet (toimii PCH:n kautta vahingossa)
- ⚠️ Ylläpito — PCH lista päivitettävä

Testaa **myös ilman PCH**:ä CI:ssä tai IWYU:lla.

## Käytännössä

CMake `target_precompile_headers`. Modules korvaavat osan PCH:stä pitkällä aikavälillä. CppBestPractices Performance.

[Lue lisää](https://github.com/cpp-best-practices/cppbestpractices/blob/master/08-Considering_Performance.md)
