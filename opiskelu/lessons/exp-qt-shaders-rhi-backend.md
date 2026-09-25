# Tiimi migroi Qt 5 -sovelluksen Qt 6:een — ShaderEffectien inline-GLSL-shaderit hajosivat. Mikä arkkitehtuuri muuttui?

## Tilanne

Qt 5 -sovelluksen Qt Quick -näkymissä oli `ShaderEffect`-elementtejä, joiden `fragmentShader` ja `vertexShader` olivat inline-GLSL-merkkijonoja. Qt 6 -migraation jälkeen efektit eivät näy ja konsoli täyttyy shader-virheistä — macOS:llä Metal, Windowsilla D3D11.

Qt Quick ei enää renderöi suoraan OpenGL:llä, joten GLSL-lähde ei kelpaa sellaisenaan.

## Ratkaisu

Qt 6 käyttää **QRhi** (Qt Rendering Hardware Interface) -kerrosta, joka abstrahoi grafiikkabackendin:

| Alusta | Tyypillinen backend |
|--------|---------------------|
| Windows | D3D11, Vulkan, OpenGL |
| macOS | Metal |
| Linux | Vulkan, OpenGL |

Shaderit esikäännetään `.qsb`-tiedostoiksi (`qsb`-työkalu), ja RHI lataa oikean variantin ajonaikaisesti. ShaderEffectin `fragmentShader` osoittaa nyt `.qsb`-tiedostoon, ja shaderit kirjoitetaan Vulkan-tyylisellä GLSL:llä (uniform-blokki `binding = 0`).

## Käytännössä

Uusissa Qt 6 -projekteissa suosi `QQuickRhiItem`, `QRhiWidget` tai Qt Quick 3D -materiaaleja raakojen `gl*` -kutsujen sijaan. Migraatiossa: muunna inline-GLSL erillisiksi `.vert`/`.frag`-tiedostoiksi, aja `qsb` (tai `qt6_add_shaders`), testaa kaikilla target-alustoilla. Aseta `QSG_RHI_BACKEND` debuggausta varten.

[Lue lisää](https://doc.qt.io/qt-6/qrhi.html)
