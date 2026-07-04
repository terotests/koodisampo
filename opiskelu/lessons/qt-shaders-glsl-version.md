# Shader ei käännä Qt:ssa: 'version directive must occur before anything else'. Mikä puuttuu?

## Tilanne

Shaderin lataus Qt:ssa epäonnistuu heti käännöksessä. `QOpenGLShaderProgram::log()` näyttää:

```
ERROR: version directive must occur before anything else
```

Shader-tiedosto alkaa esimerkiksi kommentilla tai attribuuttimäärittelyllä:

```glsl
// vertex shader
in vec3 position;
#version 330 core
```

## Ratkaisu

Lisää `#version`-rivi **shaderin ensimmäiseksi riviksi** — ennen kommentteja, whitespacea tai mitään muuta:

```glsl
#version 330 core

in vec3 position;
uniform mat4 mvpMatrix;

void main() {
    gl_Position = mvpMatrix * vec4(position, 1.0);
}
```

Desktop OpenGL core profile vaatii tyypillisesti `#version 330 core` tai uudemman. Valitse versio, joka vastaa kontekstiasi (`QSurfaceFormat`).

## Käytännössä

Pidä erilliset shader-tiedostot desktopille (330+) ja mobiilille (GLSL ES `#version 300 es`). Qt ei poikkea Khronos GLSL -säännöistä — version on oltava ensimmäinen token tiedostossa. CI:ssä voit ajaa shader-käännöksen automaattisesti ja kaataa buildin, jos log ei ole tyhjä.

[Lue lisää](https://doc.qt.io/qt-6/qopenglshader.html)
