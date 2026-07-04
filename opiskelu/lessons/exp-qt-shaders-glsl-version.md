# Shader failaa macOS:llä mutta toimii Windowsilla — puuttuu `#version`. Mitä lisäät?

## Tilanne

Sama GLSL-shader toimii Windowsin OpenGL-ajurilla ilman version-riviä (legacy compatibility), mutta macOS:n core profile hylkää sen:

```
ERROR: No #version specified
```

macOS OpenGL on ollut core-only vuosia; Windows saattaa vielä hyväksyä vanhan tavan.

## Ratkaisu

Lisää yhteensopiva version- ja profiilideklaraatio shaderin alkuun:

```glsl
#version 330 core

layout(location = 0) in vec3 position;
uniform mat4 mvpMatrix;

void main() {
    gl_Position = mvpMatrix * vec4(position, 1.0);
}
```

Qt 6 RHI:lla valitse GLSL-versio backendin mukaan (OpenGL 330, Vulkan SPIR-V via qsb, Metal). `qsb`-työkalu voi generoida useita variantteja samasta lähteestä.

## Käytännössä

Testaa shaderit macOS:llä CI:ssä — se paljastaa puuttuvan `#version` nopeasti. Aseta `QSurfaceFormat` core profileksi desktopilla ja varmista, että shaderin GLSL-versio vastaa kontekstin versiota (esim. OpenGL 3.3 → `#version 330 core`).

[Lue lisää](https://doc.qt.io/qt-6/qopenglshaderprogram.html)
