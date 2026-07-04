# Fragment shader toimii desktopilla mutta on musta mobiilissa. Epäily?

## Tilanne

Kehitys desktopilla (OpenGL 3.3 core) onnistuu. Mobiilitestissä (OpenGL ES 3.0) fragment-shader tuottaa mustan ruudun. Vertex-shader toimii — geometria piirtyy, mutta väri on `(0,0,0)`.

Fragment-shader ilman precision-määrittelyä:

```glsl
#version 300 es
in vec2 vUV;
out vec4 fragColor;

void main() {
    fragColor = vec4(vUV, 0.5, 1.0);
}
```

## Ratkaisu

**Epäily:** puuttuva `precision`-määrittely fragment-shaderissa. GLSL ES vaatii oletustarkkuuden:

```glsl
#version 300 es
precision mediump float;

in vec2 vUV;
out vec4 fragColor;

void main() {
    fragColor = vec4(vUV, 0.5, 1.0);
}
```

Mobiili-GPU:illa `lowp`/`mediump`/`highp` vaikuttavat laskentatarkkuuteen. Liian matala tarkkuus voi aiheuttaa artefakteja tai nollatuloksen tietyissä laskuissa.

## Käytännössä

Lisää `precision mediump float;` fragment-shaderin alkuun oletuksena; käytä `highp` tarvittaessa (esim. syvyys). Generoi ES-variantti `qsb`:llä (`--glsl 300es`). Testaa laajalla laitteistovalikoimalla — eri GPU-toteutukset käyttäytyvät eri tavalla precisionin suhteen.

[Lue lisää](https://registry.khronos.org/OpenGL/specs/es/3.0/GLSL_ES_Specification_3.00.pdf)
