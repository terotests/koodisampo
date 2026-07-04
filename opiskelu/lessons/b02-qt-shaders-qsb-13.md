# Qt 6 RHI backend — shaderit pitää esikääntää. Työkalu?

## Tilanne

Qt 6 -projektissa yrität ladata `.vert` ja `.frag` -tiedostoja suoraan runtime-käännöksellä RHI-polulla. Sovellus kaatuu tai shader ei lataudu — Qt 6 RHI odottaa esikäännettyä binääriä, ei raakaa GLSL:ää ajonaikaisesti kaikilla backendeilla.

## Ratkaisu

Käytä **Qt Shader Tools** -paketin `qsb`-työkalua:

```bash
qsb --glsl 100es,120,150,330,430 \
    --hlsl 50 \
    --msl 12 \
    -o shader.frag.qsb \
    shader.frag
```

CMake-integraatio:

```cmake
qt6_add_shaders(myapp "shaders"
    PREFIX "/"
    FILES
        shaders/color.frag
        shaders/color.vert
)
```

Tulos on `.qsb`-tiedosto, jonka RHI lataa `QShader::fromSerialized()` tai resurssijärjestelmän kautta.

## Käytännössä

Aja `qsb` build-vaiheessa, ei käyttäjän koneella — nopeuttaa käynnistystä ja varmistaa cross-backend -yhteensopivuuden. Pidä lähde-GLSL versionhallinnassa; `.qsb` generoidaan CI:ssä. Dokumentoi tarvittavat `--glsl`-versiot target-alustoille.

[Lue lisää](https://doc.qt.io/qt-6/qtshadertools-index.html)
