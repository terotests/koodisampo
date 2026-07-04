# Shader compile failaa ilman selkeää logia. Qt-luokka virheilmoituksiin?

## Tilanne

`QOpenGLShaderProgram::addShaderFromSourceFile()` palauttaa `false`, mutta sovellus ei tulosta syytä. Ruutu pysyy mustana — et tiedä, onko vika vertex- vai fragment-shaderissa.

## Ratkaisu

Kutsu `log()` heti käännös- tai linkitysvirheen jälkeen:

```cpp
QOpenGLShaderProgram program;

if (!program.addShaderFromSourceFile(QOpenGLShader::Vertex, ":/shaders/vert.glsl")) {
    qWarning() << "Vertex compile failed:\n" << program.log();
    return;
}

if (!program.addShaderFromSourceFile(QOpenGLShader::Fragment, ":/shaders/frag.glsl")) {
    qWarning() << "Fragment compile failed:\n" << program.log();
    return;
}

if (!program.link()) {
    qWarning() << "Link failed:\n" << program.log();
    return;
}
```

Yksittäisen shaderin loki: `shader->log()` `QOpenGLShader`-oliosta ennen ohjelmaan lisäämistä.

## Käytännössä

Kääri shader-lataus funktioon, joka aina tulostaa login virhetilanteessa. Kehityksessä näytä log myös UI:ssa (esim. `QMessageBox`). Ajurin compile-log sisältää rivinumeron ja syntaksivirheen — korjaa GLSL sen perusteella.

[Lue lisää](https://doc.qt.io/qt-6/qopenglshaderprogram.html)
