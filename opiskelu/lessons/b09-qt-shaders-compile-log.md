# QOpenGLShaderProgram linkkaus epäonnistuu — musta ruutu. Debug-askel?

## Tilanne

Sovellus käynnistyy, mutta `QOpenGLWidget` näyttää mustaa. `program.link()` palauttaa `false`. Kehittäjä ei tulosta virheilmoitusta — musta ruutu ilman vihjettä.

## Ratkaisu

Tulosta compile- ja link-loki heti virheen jälkeen:

```cpp
QOpenGLShaderProgram program;

if (!program.addShaderFromSourceFile(QOpenGLShader::Vertex, ":/vert.glsl")) {
    qCritical() << "Vertex error:\n" << program.log();
    return;
}

if (!program.addShaderFromSourceFile(QOpenGLShader::Fragment, ":/frag.glsl")) {
    qCritical() << "Fragment error:\n" << program.log();
    return;
}

if (!program.link()) {
    qCritical() << "Link error:\n" << program.log();
    return;
}
```

Yksittäisen shader-objektin loki ennen ohjelmaan liittämistä:

```cpp
QOpenGLShader vert(QOpenGLShader::Vertex);
if (!vert.compileSourceFile(":/vert.glsl"))
    qCritical() << vert.log();
```

## Käytännössä

Tee shader-latauksesta fail-fast: jos compile/link epäonnistuu, näytä loki kehittäjälle (qCritical) ja käyttäjälle selkeä virheviesti. Tyypillisiä link-virheitä: varying-nimien ristiriita vertex/fragment välillä, puuttuva `#version`, incompatible precision ES/desktop -sekoitus.

[Lue lisää](https://doc.qt.io/qt-6/qopenglshaderprogram.html#log)
