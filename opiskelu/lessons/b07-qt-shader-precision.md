# Shader toimii desktopilla mutta on musta mobiilissa OpenGL ES:llä. Todennäköisin syy?

## Tilanne

Sama fragment-shader renderöi oikein Windows/macOS OpenGL 3.3 -kontekstissa. Android- tai embedded-laitteella (OpenGL ES 2.0/3.0) ruutu on musta — compile onnistuu, draw-kutsut menevät läpi.

Desktop GLSL:

```glsl
#version 330 core
uniform sampler2D tex;
in vec2 vTexCoord;
out vec4 fragColor;

void main() {
    fragColor = texture(tex, vTexCoord);
}
```

## Ratkaisu

**Todennäköisin syy:** puuttuvat **precision qualifierit** OpenGL ES:ssä. ES vaatii:

```glsl
#version 300 es
precision mediump float;

uniform sampler2D tex;
in vec2 vTexCoord;
out vec4 fragColor;

void main() {
    fragColor = texture(tex, vTexCoord);
}
```

ES 2.0 -rajoitus: ei float-textureja ilman laajennusta — käytä normalized fixed point tai ES 3.0+.

## Käytännössä

Pidä erillinen ES-variantti tai generoi molemmat `qsb`:llä (`--glsl 100es,300es,330`). Testaa aina oikealla mobiililaitteella — emulaattori ei paljasta kaikkia precision-ongelmia. `highp` tarvitaan tarkkoihin UV-laskentoihin suurilla tekstuureilla.

[Lue lisää](https://doc.qt.io/qt-6/opengl.html)
