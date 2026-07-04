# Qt 6 shader ei lataudu — .frag tiedosto suoraan ei toimi. Miten shader valmistellaan?

## Tilanne

Qt 5 -tyylinen lataus:

```cpp
QFile f("shaders/effect.frag");
f.open(QIODevice::ReadOnly);
program.addShaderFromSourceCode(QOpenGLShader::Fragment, f.readAll());
```

Qt 6 RHI -sovelluksessa tämä ei tuota toimivaa shaderia — `.frag`-lähdetiedosto suoraan ei riitä cross-backend -renderöintiin.

## Ratkaisu

Esikäännä shader **offline** `qsb`-työkalulla `.qsb`-binääriksi:

```bash
qsb --glsl 100es,120,150,330,430 \
    --hlsl 50 \
    --msl 12 \
    -o effect.frag.qsb \
    effect.frag
```

Lataus Qt 6:ssa:

```cpp
QShader shader = QShader::fromSerialized(
    readResource(":/shaders/effect.frag.qsb"));
```

Tai CMake:

```cmake
qt6_add_shaders(mytarget "app_shaders"
    FILES shaders/effect.frag
)
```

## Käytännössä

Lähde-GLSL (`.frag`, `.vert`) versionhallintaan; `.qsb` generoidaan buildissa. Älä commitoi vanhentuneita `.qsb`-tiedostoja ilman uudelleenkäännöstä. `qsb`-output sisältää SPIR-V, HLSL, MSL ja GLSL-variantit yhdessä paketissa.

[Lue lisää](https://doc.qt.io/qt-6/qtshadertools-index.html)
