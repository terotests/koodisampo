# Shader compile onnistuu mutta uniform ei vaikuta — location on -1. Juurisyy?

## Tilanne

```cpp
int loc = program.uniformLocation("tintColor");
qDebug() << loc;  // -1
program.setUniformValue("tintColor", QColor(255, 0, 0));
```

Fragment-shader:

```glsl
uniform vec4 tintColor;  // määritelty mutta...

void main() {
    fragColor = vec4(1.0);  // tintColor EI käytetä!
}
```

Uniform location −1 tarkoittaa, että uniformia ei ole aktiivisessa ohjelmassa.

## Ratkaisu

**Juurisyy:** GLSL-kääntäjä optimoi **käyttämättömät uniformit pois** linkitysvaiheessa. `uniformLocation` palauttaa −1.

Korjaa shader niin, että uniform **luetaan**:

```glsl
uniform vec4 tintColor;

out vec4 fragColor;

void main() {
    fragColor = tintColor;
}
```

Tarkista myös kirjoitusvirheet uniform-nimessä (case-sensitive: `tintColor` ≠ `TintColor`).

## Käytännössä

Jos location on −1, älä kutsu `setUniformValue` — se on turha. Debuggaus: tulosta kaikki aktiiviset uniformit linkityksen jälkeen. Preprocessor-ehdot (`#ifdef`) voivat myös poistaa uniformin tietyissä build-varianteissa.

[Lue lisää](https://doc.qt.io/qt-6/qopenglshaderprogram.html#setUniformValue)
