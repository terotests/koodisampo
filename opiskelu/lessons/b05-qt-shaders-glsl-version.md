# Shader hylätään: 'version 330 incompatible'. Korjaus Qt 6 desktop OpenGL:lla?

## Tilanne

Shader-käännös epäonnistuu Qt 6 -sovelluksessa:

```
ERROR: 'version 330' is not compatible with this OpenGL context
```

Konteksti on luotu OpenGL 2.1 -yhteensopivalla formaatilla, mutta shader vaatii core profile 3.3.

## Ratkaisu

Varmista, että **konteksti ja shader-versio vastaavat toisiaan**:

```cpp
QSurfaceFormat fmt;
fmt.setVersion(3, 3);
fmt.setProfile(QSurfaceFormat::CoreProfile);
QSurfaceFormat::setDefaultFormat(fmt);
```

Shader:

```glsl
#version 330 core

layout(location = 0) in vec3 position;
out vec4 fragColor;

void main() {
    gl_Position = vec4(position, 1.0);
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
```

Jos konteksti on 4.x, voit käyttää `#version 430 core` tai uudempaa.

## Käytännössä

Aseta `QSurfaceFormat` ennen `QApplication`-luontia. Qt 6 RHI-polulla OpenGL-backend valitsee version automaattisesti — varmista, että `qsb` generoi oikean GLSL-version (`--glsl 330`). Älä sekoita compatibility- ja core-profile -shaderia.

[Lue lisää](https://doc.qt.io/qt-6/qopenglshader.html#compiling-shaders)
