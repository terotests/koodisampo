# Qt 6 sovellus pitää ajaa Vulkanilla Windowsissa ja Metalilla macOS:lla. Mikä renderöintipolku?

## Tilanne

Tuotevaatimus: natiivi grafiikkasuoritus Windowsilla (Vulkan) ja macOS:lla (Metal). Qt 5 -ratkaisu kirjoitti erillistä OpenGL-koodia ja `#ifdef`-haaroittelua alustoille.

Tiimi etsii yhtenäistä Qt 6 -arkkitehtuuria ilman backend-kohtaista shader-koodia sovelluksessa.

## Ratkaisu

**Qt Rendering Hardware Interface (QRhi)** abstrakoi renderöintipolun:

```
Sovellus / Qt Quick / QRhiWidget
        ↓
      QRhi (abstrakti API)
        ↓
  ┌─────┼─────┐
  D3D11 Vulkan Metal OpenGL
```

Shaderit esikäännetään `qsb`:llä kaikille backendeille yhdestä GLSL-lähteestä. RHI valitsee oikean backendin ajonaikaisesti tai `QSG_RHI_BACKEND`-ympäristömuuttujalla.

## Käytännössä

Pakota backend testaukseen: `QSG_RHI_BACKEND=vulkan` (Windows), oletus macOS:llä on Metal. Käytä `qt6_add_shaders` CMake-makroa shader-binäärien hallintaan. Vältä suoria `gl*`/`vk*`/`mtl*`-kutsuja sovelluskoodissa — pysy QRhi- tai Qt Quick -API:ssa.

[Lue lisää](https://doc.qt.io/qt-6/qrhi.html)
