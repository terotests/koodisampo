# Shader compile ok mutta uniform ei vaikuta — hardcoded location 0. Miten Qt 6 -tyylillä vältät?

## Tilanne

Tiimi olettaa, että `mvpMatrix` on aina uniform location 0:

```cpp
glUniformMatrix4fv(0, 1, GL_FALSE, mvp.constData());
```

Shader kääntyy ja linkittyy, mutta toisella GPU:lla transformaatio ei vaikuta — location 0 viittaa eri uniformiin tai on inactive.

## Ratkaisu

**Qt 6 / OpenGL:** hae location nimen perusteella linkityksen jälkeen:

```cpp
int loc = program.uniformLocation("mvpMatrix");
if (loc >= 0)
    program.setUniformValue(loc, mvp);
```

**GLSL (moderni tapa):** sidotaan uniform eksplisiittisesti:

```glsl
#version 330 core
layout(std140, binding = 0) uniform Matrices {
    mat4 mvpMatrix;
};
```

tai yksittäiselle uniformille:

```glsl
layout(location = 2) uniform mat4 mvpMatrix;
```

`QShaderProgram::uniformLocation("name")` (RHI-polulla) tai `QOpenGLShaderProgram::uniformLocation()` (OpenGL-polulla) palauttaa oikean indeksin tai −1, jos uniform on optimoitu pois.

## Käytännössä

Älä koskaan kovakoodaa uniform location -numeroita eri ajureilla. Cache location linkityksen jälkeen. UBO/std140 on suositeltava, kun uniformeja on paljon — vähentää location-sekaannuksia.

[Lue lisää](https://doc.qt.io/qt-6/qshaderprogram.html)
