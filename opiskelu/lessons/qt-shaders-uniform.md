# QOpenGLShaderProgram on linkitetty. Miten asetat muuttujan `mvpMatrix` shaderiin?

## Tilanne

Vertex- ja fragment-shaderit on käännetyt ja linkitetty onnistuneesti. Piirto pyörii, mutta geometria on väärässä kohdassa tai näkymä on tyhjä — `mvpMatrix` ei vaikuta. Shaderissa on:

```glsl
#version 330 core
uniform mat4 mvpMatrix;
in vec3 position;
void main() {
    gl_Position = mvpMatrix * vec4(position, 1.0);
}
```

C++-puolella ohjelma on linkitetty, mutta uniform-arvoa ei ole vielä asetettu.

## Ratkaisu

Käytä `QOpenGLShaderProgram::setUniformValue()` tyypitetysti nimen perusteella:

```cpp
QMatrix4x4 mvp = projection * view * model;
program.bind();
program.setUniformValue("mvpMatrix", mvp);
// ... piirto ...
program.release();
```

`setUniformValue` käärii OpenGL:n `glUniform*` -kutsut ja hoitaa tyypin (mat4, vec3, float jne.) automaattisesti. Uniform pitää asettaa **linkitetyn** ohjelman ollessa sidottu (`bind()`).

## Käytännössä

Aseta uniformit joka kehys ennen draw-kutsua, jos kamera tai malli liikkuu. Voit hakea locationin kerran linkityksen jälkeen ja käyttää `setUniformValue(int location, ...)` suorituskyvyn vuoksi. Varmista, että uniform-nimi täsmää shaderin kanssa kirjainkoolla.

[Lue lisää](https://doc.qt.io/qt-6/qopenglshaderprogram.html)
