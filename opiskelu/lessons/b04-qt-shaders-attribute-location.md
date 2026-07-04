# Shader linkittyy mutta vertex-attribuutit ovat nollaa — layout(location=0) puuttuu GLSL:stä. Korjaus?

## Tilanne

Shader linkittyy ilman virheitä, mutta kaikki vertex-arvot ovat `(0, 0, 0)`. VBO sisältää oikeaa dataa (varmistettu debuggerilla). GLSL alkaa:

```glsl
#version 330 core
in vec3 position;   // ei layout(location=0)
in vec2 texCoord;
```

C++ odottaa position indeksissä 0, mutta linkitys antaa sille eri locationin.

## Ratkaisu

Lisää eksplisiittinen layout GLSL:ään:

```glsl
#version 330 core

layout(location = 0) in vec3 position;
layout(location = 1) in vec2 texCoord;

uniform mat4 mvpMatrix;

void main() {
    gl_Position = mvpMatrix * vec4(position, 1.0);
}
```

Tai Qt-puolella ennen linkitystä:

```cpp
program.bindAttributeLocation("position", 0);
program.bindAttributeLocation("texCoord", 1);
if (!program.link()) { /* log() */ }
```

## Käytännössä

Attribuutti-indeksit 0 = position on yleinen konventio — kirjaa se shaderiin `layout(location = 0)` eikä luota ajurin automaattiseen numerointiin. Varmista VBO:n stride ja offset vastaavat `setAttributeBuffer`-kutsuja.

[Lue lisää](https://www.khronos.org/opengl/wiki/Layout_Qualifier_(GLSL))
