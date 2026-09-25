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

**GLSL (moderni tapa):** uniform-blokille annetaan `binding`-indeksi:

```glsl
#version 330 core
layout(std140, binding = 0) uniform Matrices {
    mat4 mvpMatrix;
};
```

tai yksittäiselle uniformille eksplisiittinen location (GLSL 4.3 tai `GL_ARB_explicit_uniform_location`):

```glsl
layout(location = 2) uniform mat4 mvpMatrix;
```

`QOpenGLShaderProgram::uniformLocation("name")` palauttaa oikean indeksin tai −1, jos uniform on optimoitu pois. `binding` koskee uniform-blokkeja ja samplereita, `location` yksittäisiä uniformeja.

## Käytännössä

Älä koskaan kovakoodaa uniform location -numeroita eri ajureilla. Cache location linkityksen jälkeen. UBO/std140 on suositeltava, kun uniformeja on paljon — vähentää location-sekaannuksia.

[Lue lisää](https://doc.qt.io/qt-6/qopenglshaderprogram.html)
