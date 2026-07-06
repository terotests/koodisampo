# Nappi pitää keskittää ikkunaan ja venyttää leveys 80 % parentista. QML-layout?

## Tilanne

Dialogissa primary-nappi pitää olla keskellä ja skaalautua ikkunan leveyteen mobiilissa ja desktopilla.

## Ratkaisu

```qml
Button {
    anchors.centerIn: parent
    width: parent.width * 0.8
    text: qsTr("OK")
}
```

`anchors.centerIn` keskittää komponentin. Leveys sidotaan parentin leveyteen kertoimella.

## Käytännössä

Monimutkaisemmissa asetteluissa käytä `RowLayout`/`ColumnLayout` + `Layout.fillWidth`. Älä sekoita `anchors`- ja `Layout`-attribuutteja samassa itemissä.

[Lue lisää](https://doc.qt.io/qt-6/qtquick-positioning-anchors.html)
