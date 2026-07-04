# Fragment shader saa väärät interpolated arvot vertex-attribuuteista. Mikä GLSL-stage välittää?

## Tilanne

Vertex-shader laskee oikeat värit kulmille, mutta fragment-shader näyttää väärän liukuvärin. Vertex-shader:

```glsl
#version 330 core
layout(location = 0) in vec3 position;
layout(location = 1) in vec3 color;
out vec3 vColor;

void main() {
    gl_Position = mvpMatrix * vec4(position, 1.0);
    vColor = color;
}
```

Fragment-shader saa `vColor`-arvon, joka ei vastaa odotettua interpolointia.

## Ratkaisu

**Vertex shader output → fragment shader input** — näitä kutsutaan *varying*-muuttujiksi (GLSL 330: `in`/`out`). GPU interpoloi arvot rasteroinnin aikana kolmioiden yli:

```glsl
// fragment.glsl
#version 330 core
in vec3 vColor;       // sama nimi ja tyyppi kuin vertex out
out vec4 fragColor;

void main() {
    fragColor = vec4(vColor, 1.0);
}
```

Nimet ja tyypit on täsmättävä vertex- ja fragment-shaderin välillä. `flat`-qualifier poistaa interpoloinnin (flat shading).

## Käytännössä

Tarkista, että varying-nimet täsmäävät täsmälleen (case-sensitive). Perspektiivikorjaus vaatii `noperspective`-qualifierin tietyissä tapauksissa. Qt:ssa vertex ja fragment ovat erillisiä shader-tiedostoja — varmista parin yhteensopivuus linkityksessä.

[Lue lisää](https://www.khronos.org/opengl/wiki/Rendering_Pipeline_Overview)
