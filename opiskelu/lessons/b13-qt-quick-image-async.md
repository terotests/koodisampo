# Image lataa suuren kuvan verkosta ja jäädyttää UI:n latauksen aikana. QML-korjaus?

## Tilanne

Galleria näyttää thumbnailit CDN:stä. Suuret kuvat hidastavat scrollausta.

## Ratkaisu

```qml
Image {
    source: imageUrl
    asynchronous: true          // oletus true
    sourceSize: Qt.size(200, 200)  // dekoodaa pienempänä
    placeholderSource: "qrc:/placeholder.png"
}
```

`asynchronous: true` lataa ja dekoodaa taustasäikeessä. `sourceSize` rajoittaa muistia.

## Käytännössä

Seuraa `status` (`Loading`, `Ready`, `Error`). `cache: true` (oletus) vähentää uudelleenlatauksia. Paikalliset `qrc:`-kuvat ovat nopeita; verkko-URL vaatii placeholderin.

[Lue lisää](https://doc.qt.io/qt-6/qml-qtquick-image.html)
