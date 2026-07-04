# Tiimi migoi Qt 5 fixed-functionista Qt 6:een — shaderit hajosivat. Mikä arkkitehtuuri muuttui?

## Tilanne

Qt 5 -sovellus käytti `glBegin`/`glEnd`, `glMatrixMode` ja kiinteää valaistusta. Qt 6 -migraatiossa koodi siirrettiin shadereihin, mutta renderöinti on epävakaata: macOS:llä Metal, Windowsilla D3D11/Vulkan — eri virheet eri alustoilla.

Fixed-function API ei enää ole käytettävissä modernissa Qt 6 -renderöintipolussa.

## Ratkaisu

Qt 6 käyttää **QRhi** (Qt Rendering Hardware Interface) -kerrosta, joka abstrakoi grafiikkabackendin:

| Alusta | Tyypillinen backend |
|--------|---------------------|
| Windows | D3D11, Vulkan, OpenGL |
| macOS | Metal |
| Linux | Vulkan, OpenGL |

Shaderit esikäännetään `.qsb`-binääreiksi (`qsb`-työkalu), ja RHI lataa oikean variantin ajonaikaisesti. Fixed-function-kutsut korvataan shader-pipelineilla ja uniform/vertex-buffer -syötöllä.

## Käytännössä

Uusissa Qt 6 -projekteissa suosi `QQuickRhiItem`, `QRhiWidget` tai Qt Quick 3D -materiaaleja raakojen `gl*` -kutsujen sijaan. Migraatiossa: kirjoita vertex+fragment shaderit, aja `qsb`, testaa kaikilla target-alustoilla. Aseta `QSG_RHI_BACKEND` debuggausta varten.

[Lue lisää](https://doc.qt.io/qt-6/qrhi.html)
