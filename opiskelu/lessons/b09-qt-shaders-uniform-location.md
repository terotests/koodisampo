# uniform float u_time ei päivity — setUniformValue ei vaikuta. Yleisin syy?

## Tilanne

Animaatio käyttää aika-uniformia:

```glsl
uniform float u_time;

void main() {
    fragColor = vec4(sin(u_time), 0.0, 0.0, 1.0);
}
```

```cpp
void paintGL() {
    program.bind();
    program.setUniformValue("u_time", elapsedTimer.elapsed() / 1000.0f);
    // kuva ei animoidu — punainen pysyy vakiona
}
```

## Ratkaisu

**Yleisin syy:** uniform on **optimoitu pois** (location −1) tai `setUniformValue` kutsutaan ilman aktiivista ohjelmaa.

Tarkistus:

```cpp
program.bind();
int loc = program.uniformLocation("u_time");
qDebug() << "u_time location:" << loc;

if (loc >= 0)
    program.setUniformValue(loc, t);
```

Varmista, että `u_time` **luetaan** fragment-shaderissa (ei `#ifdef`-lohkossa, joka on pois päältä). Tarkista link-status:

```cpp
if (!program.isLinked())
    qCritical() << program.log();
```

## Käytännössä

Cache location linkityksen jälkeen animaatiota varten. Käytä `QElapsedTimer` ja päivitä uniform jokaisessa `paintGL()`-kutsussa. Jos location on −1, shader ei käytä uniformia — korjaa GLSL-lähde eikä C++-kutsuja.

[Lue lisää](https://doc.qt.io/qt-6/qopenglshaderprogram.html#setUniformValue)
