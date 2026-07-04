# QML-käyttöliittymässä tarvitset blur-efektin itemille. Qt Quick -komponentti?

## Tilanne

QML-käyttöliittymässä haluat sumentaa taustan tietyn `Item`-komponentin takana (esim. modal-dialogin tausta). Canvas 2D -piirto ei riitä — tarvitaan GPU-pohjainen post-process-efekti.

## Ratkaisu

**Qt 6:** `MultiEffect` (Qt Quick Effects) valmiina blur-efektinä:

```qml
import QtQuick
import QtQuick.Effects

Item {
    id: root
    width: 400; height: 300

    Image {
        id: source
        anchors.fill: parent
        source: "background.jpg"
        visible: false
    }

    MultiEffect {
        anchors.fill: parent
        source: source
        blurEnabled: true
        blur: 0.5
    }
}
```

**Mukautettu shader:** `ShaderEffect` fragment-shaderilla:

```qml
import QtQuick

ShaderEffect {
    property variant source
    property real blurRadius: 4.0
    fragmentShader: "qrc:/shaders/blur.frag.qsb"
}
```

Blur-fragment-shader näytteistää naapuripikseleitä (Gaussian kernel).

## Käytännössä

Valmiiseen blur-efektiin käytä `MultiEffect` — se on optimoitu ja ylläpidetty. `ShaderEffect` sopii custom-efekteihin (värisuodattimet, distortio). Qt 6:ssa shader on `.qsb`-muodossa. Huomioi suorituskyky: blur on kallis — rajoita aluetta `layer.enabled: true` + `layer.effect`.

[Lue lisää](https://doc.qt.io/qt-6/qml-qtquick-shadereffect.html)
