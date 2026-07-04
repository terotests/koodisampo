# Vertex attribuutit sekoittuvat eri GPU:illa — layout ei täsmää. Vakautus?

## Tilanne

Sama shader ja VBO toimii kehityskoneella, mutta toisella GPU:lla värit ja positiot sekoittuvat. C++-puolella attribuutit sidotaan implisiittisesti indeksillä 0, 1, 2 ilman GLSL-layoutia:

```cpp
program.enableAttributeArray(0);
program.setAttributeBuffer(0, GL_FLOAT, 0, 3, stride);
```

Ajuri voi järjestää attribuutit eri tavalla linkityksessä.

## Ratkaisu

**GLSL — eksplisiittinen location:**

```glsl
#version 330 core
layout(location = 0) in vec3 position;
layout(location = 1) in vec2 texCoord;
layout(location = 2) in vec3 normal;
```

**Qt OpenGL — bind ennen linkitystä:**

```cpp
program.bindAttributeLocation("position", 0);
program.bindAttributeLocation("texCoord", 1);
program.bindAttributeLocation("normal", 2);
program.link();
```

Molemmat tavat varmistavat, että C++-puolen `setAttributeBuffer(N, ...)` vastaa shaderin `location = N`.

## Käytännössä

Suosi `layout(location = N)` GLSL:ssä — se toimii myös ilman Qt-kutsuja ja on selkeämpi. Dokumentoi vertex-muoto (stride, offset) attribuutti-indeksien rinnalla. Testaa eri GPU:illa CI:ssä.

[Lue lisää](https://doc.qt.io/qt-6/qopenglshaderprogram.html#bindAttributeLocation)
