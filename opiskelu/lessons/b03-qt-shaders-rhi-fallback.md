# Qt 6 app renderöi Metalilla macOS:llä mutta testaaja raportoi mustan ruudun Windowsilla. Tarkista?

## Tilanne

Kehittäjän MacBook renderöi Qt 6 -sovelluksen oikein (Metal-backend). Windows-testaaja näkee mustan ruudun ilman GL-virheitä. Shader-lähde on kirjoitettu GLSL:llä ja testattu vain macOS:lla.

Qt 6 RHI valitsee backendin automaattisesti alustan mukaan — shader-binääri voi olla yhteensopimaton toisen backendin kanssa.

## Ratkaisu

Tarkista **QRhi-backend** ja shaderin cross-backend -yhteensopivuus:

```cpp
// Debug: tulosta aktiivinen backend
qDebug() << "RHI backend:" << rhi->backendName();
```

Windows: D3D11, Vulkan tai OpenGL. Varmista, että shaderit on esikäännetty `qsb`:llä kaikille targeteille:

```bash
qsb --glsl 330 --hlsl 50 --msl 12 -o effect.qsb effect.frag
```

Testaa Windowsilla eri backendeillä:

```bash
set QSG_RHI_BACKEND=d3d11
set QSG_RHI_BACKEND=vulkan
set QSG_RHI_BACKEND=opengl
```

## Käytännössä

CI-pipeline ajaa testit vähintään Windows + macOS -alustoilla. Älä oleta, että GLSL toimii suoraan D3D11/HLSL- tai MSL-polulla — Qt 6 vaatii `.qsb`-esikäännön. Musta ruutu ilman virhettä usein tarkoittaa tyhjää shader-outputia tai väärää uniform-arvoa.

[Lue lisää](https://doc.qt.io/qt-6/qrhi.html)
