# Shader ei näy oikein — uniform arvo ei päivity. Qt6 RHI/shader polulla?

## Tilanne

Qt 6 -sovellus käyttää QRhi-materiaalia tai `QQuickRhiItem`:iä. Uniform-arvon (esim. animaation `u_time`) muutos C++-puolella ei heijastu renderöintiin. OpenGL-polulla `setUniformValue` toimi aiemmin.

RHI abstraktoi uniform-syötön eri tavalla kuin suora `QOpenGLShaderProgram`.

## Ratkaisu

Tarkista **uniform layout ja binding** RHI-materiaalissa:

```cpp
// QRhiShaderResourceBindings — uniform buffer
bindings->setBindings({
    QRhiShaderResourceBinding::uniformBuffer(
        0, QRhiShaderResourceBinding::VertexStage | QRhiShaderResourceBinding::FragmentStage,
        uniformBuffer)
});
```

GLSL:ssä vastaa:

```glsl
layout(std140, binding = 0) uniform UniformBlock {
    float u_time;
    vec4 u_color;
};
```

Qt Quick ShaderEffect: `@property`-muuttujat synkataan automaattisesti — varmista property-nimi vastaa shader-uniformia.

## Käytännössä

RHI-polulla suosi UBO:ta yksittäisten uniformien sijaan. Päivitä uniform buffer ennen `beginPass`/`endPass`. Debuggaa: varmista `.qsb` sisältää oikeat binding-numerot ja että material property -päivitys triggeröi renderöinnin uudelleen.

[Lue lisää](https://doc.qt.io/qt-6/qtshadertools-index.html)
