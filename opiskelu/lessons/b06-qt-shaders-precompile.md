# Shader compile hidastaa app käynnistystä. Miten Qt 6 RHI auttaa?

## Tilanne

Sovellus kääntää GLSL-shaderit ajonaikaisesti jokaisella käynnistyksellä:

```cpp
// Hidas: compile + link joka start
program.addShaderFromSourceCode(QOpenGLShader::Fragment, fragSource);
program.link();  // 200–800 ms riippuen ajurista
```

Käyttäjä valittaa hitaasta käynnistyksestä, erityisesti monella shaderilla.

## Ratkaisu

Esikäännä shaderit **offline** Qt Shader Tools -työkalulla `.qsb`-binääreiksi:

```bash
qsb --glsl 100es,120,150,330 \
    --hlsl 50 \
    --msl 12 \
    -o shaders/pbr.frag.qsb \
    shaders/pbr.frag
```

Lataus ajonaikaisesti on nopea — RHI deserialisoi valmiin binäärin:

```cpp
QShader shader = QShader::fromSerialized(qsbData);
// Ei compile/link -viivettä
```

CMake: `qt6_add_shaders()` generoi `.qsb`-tiedostot build-vaiheessa.

## Käytännössä

Siirrä kaikki staattiset shaderit esikäännetyiksi. Pidä dynaamiset shaderit (käyttäjän GLSL-editori) erillisenä polkuna. Mittaa käynnistysaika ennen/jälkeen — säästö on merkittävä mobiilissa ja CI-testeissä.

[Lue lisää](https://doc.qt.io/qt-6/qtshadertools-index.html)
