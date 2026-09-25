# Qt 6 Qt Quick ShaderEffect ei lataa .frag-tiedostoa suoraan. Miten shader valmistellaan?

## Tilanne

Qt 5 -tyylinen ShaderEffect antoi GLSL-lähteen suoraan:

```qml
ShaderEffect {
    fragmentShader: "shaders/effect.frag"   // Qt 5: GLSL-lähde kelpasi
}
```

Qt 6:ssa Qt Quick renderöi RHI:n kautta (Metal, D3D11, Vulkan, OpenGL), eikä ShaderEffect hyväksy GLSL-lähdettä. `QOpenGLShaderProgram` kääntää yhä raakaa GLSL:ää, mutta RHI-polku vaatii esikäännetyn `.qsb`-tiedoston.

## Ratkaisu

Esikäännä shader **offline** `qsb`-työkalulla `.qsb`-tiedostoksi:

```bash
qsb --glsl 100es,120,150,330,430 \
    --hlsl 50 \
    --msl 12 \
    -o effect.frag.qsb \
    effect.frag
```

ShaderEffect Qt 6:ssa:

```qml
ShaderEffect {
    fragmentShader: "qrc:/shaders/effect.frag.qsb"
}
```

Tai CMake:

```cmake
qt6_add_shaders(mytarget "app_shaders"
    FILES shaders/effect.frag
)
```

## Käytännössä

Lähde-GLSL (`.frag`, `.vert`) versionhallintaan; `.qsb` generoidaan buildissa. Älä commitoi vanhentuneita `.qsb`-tiedostoja ilman uudelleenkäännöstä. `qsb`-output sisältää SPIR-V-, HLSL-, MSL- ja GLSL-variantit yhdessä paketissa. `qsb` ja Qt Shader Tools ovat vain Qt 6:ssa.

[Lue lisää](https://doc.qt.io/qt-6/qtshadertools-index.html)
