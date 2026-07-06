# QML:ssä pitää ajaa raskasta JSON-parsintaa ilman UI-jumitusta. Qt Quick -vaihtoehto ennen C++-Workeria?

## Tilanne

Iso JSON-vastaus (satoja KB) parsitaan QML-puussa ja UI jäätyy sekunniksi.

## Ratkaisu

```qml
WorkerScript {
    id: parser
    source: "jsonParser.mjs"
    onMessage: function(msg) { resultModel.load(msg.data) }
}

Button {
    onClicked: parser.sendMessage({ json: rawPayload })
}
```

`jsonParser.mjs` (WorkerScript-säie):

```javascript
WorkerScript.onMessage = function(msg) {
    var data = JSON.parse(msg.json)
    WorkerScript.sendMessage({ data: data })
}
```

## Käytännössä

WorkerScript on kevyt vaihtoehto puhtaalle JS-parsinnalle. Raskas logiikka ja I/O kuuluvat C++-backendiin (`QThread`, `QtConcurrent`). QML JavaScript ajetaan UI-säikeessä.

[Lue lisää](https://doc.qt.io/qt-6/qml-qtquick-workerscript.html)
