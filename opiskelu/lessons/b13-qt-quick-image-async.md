# Image lataa suuren paikallisen kuvatiedoston ja jäädyttää UI:n latauksen aikana. QML-korjaus?

## Tilanne

Galleria näyttää suuria valokuvia paikalliselta levyltä. Jokaisen kuvan lataus ja dekoodaus jäädyttää UI:n hetkeksi, koska `Image` lataa paikalliset tiedostot oletuksena synkronisesti.

## Ratkaisu

```qml
Image {
    source: "file:///kuvat/iso.jpg"
    asynchronous: true             // oletus false
    sourceSize: Qt.size(200, 200)  // dekoodaa pienempänä
}
```

`asynchronous: true` lataa ja dekoodaa paikallisen kuvan taustasäikeessä. `sourceSize` rajoittaa muistia ja dekoodausaikaa.

## Käytännössä

Seuraa `status`-arvoa (`Loading`, `Ready`, `Error`) ja näytä sillä välin placeholder. `cache: true` (oletus) vähentää uudelleenlatauksia. Verkko-URL:t ladataan aina asynkronisesti `asynchronous`-arvosta riippumatta.

[Lue lisää](https://doc.qt.io/qt-6/qml-qtquick-image.html)
