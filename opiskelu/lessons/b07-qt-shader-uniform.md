# Shader ei reagoi uniform-muutoksiin — väri pysyy valkoisena. Tyypillinen virhe?

## Tilanne

Fragment-shader odottaa `baseColor`-uniformia, mutta ruutu pysyy valkoisena riippumatta C++-puolen arvon vaihdosta:

```glsl
uniform vec4 baseColor;
out vec4 fragColor;
void main() {
    fragColor = baseColor;
}
```

```cpp
program.setUniformValue("baseColor", QColor(255, 0, 0));
// väri ei muutu
```

## Ratkaisu

Tyypilliset virheet:

1. **Uniform location −1** — uniform optimoitu pois tai väärä nimi
2. **`setUniformValue` väärässä vaiheessa** — ohjelma ei ole sidottu
3. **Väärä shader-ohjelma aktiivinen** — toinen program on `bind()`-tilassa

Korjaus:

```cpp
program.bind();  // PAKOLLINEN ennen uniform-asetusta

int loc = program.uniformLocation("baseColor");
if (loc >= 0)
    program.setUniformValue(loc, QVector4D(1.0f, 0.0f, 0.0f, 1.0f));
else
    qWarning() << "baseColor inactive, check shader usage";
```

Qt 6 RHI: varmista material property -synkronointi `QShader`-polulla.

## Käytännössä

Debuggausjärjestys: `bind()` → `uniformLocation` → `setUniformValue` → draw. Tulosta location ja arvo joka kehys kehitysvaiheessa. Valkoinen ruutu voi tarkoittaa myös oletusuniformia (1,1,1,1) kun asetus epäonnistuu hiljaa.

[Lue lisää](https://doc.qt.io/qt-6/qshaderprogram.html)
