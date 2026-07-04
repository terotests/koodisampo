# Shader uniform `mvpMatrix` — location vaihtuu eri GPU:lla. Turvallinen tapa?

## Tilanne

Kehityskoneella (NVIDIA) `mvpMatrix` toimii. Testaajan AMD-koneella geometria on väärin. Koodi olettaa:

```cpp
const int MVP_LOC = 0;  // "aina nolla"
program.setUniformValue(MVP_LOC, matrix);
```

Linkityksen jälkeen location ei ole taattu samaksi eri ajureilla.

## Ratkaisu

Hae location **nimen perusteella** linkityksen jälkeen:

```cpp
program.link();
int mvpLoc = program.uniformLocation("mvpMatrix");
Q_ASSERT(mvpLoc >= 0);

program.bind();
program.setUniformValue(mvpLoc, projection * view * model);
```

Vaihtoehto suurille uniform-joukoille — **Uniform Buffer Object (UBO)**:

```glsl
#version 330 core
layout(std140, binding = 0) uniform SceneData {
    mat4 mvpMatrix;
    mat4 normalMatrix;
};
```

UBO sidotaan `binding`-indeksillä, ei location-numerolla.

## Käytännössä

Cache `uniformLocation`-tulos linkityksen jälkeen — älä hae joka kehys. Jos palautus on −1, uniform on joko kirjoitettu väärin tai optimoitu pois (ei käytössä shaderissa). Tarkista shader-lähde.

[Lue lisää](https://doc.qt.io/qt-6/qopenglshaderprogram.html)
