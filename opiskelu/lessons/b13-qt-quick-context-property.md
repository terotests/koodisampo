# Yksi globaali `AppSettings`-olio pitää olla kaikkien QML-tiedostojen saatavilla ilman importtia. Tapaa?

## Tilanne

C++-luokka `AppSettings` hallitsee teemaa ja kieltä. Kaikki QML-sivut tarvitsevat siihen pääsyn.

## Ratkaisu

```cpp
AppSettings settings;
QQmlApplicationEngine engine;
engine.rootContext()->setContextProperty("appSettings", &settings);
engine.loadFromModule("MyApp", "Main");
```

QML missä tahansa:

```qml
Text { text: appSettings.currentLanguage }
```

## Käytännössä

Context property on nopea injektio, mutta ei tyypitetty moduuli. Pitkällä aikavälillä singleton (`pragma Singleton`) tai QML-moduuli on selkeämpi API. Varmista olion elinikä (stack/allokointi).

[Lue lisää](https://doc.qt.io/qt-6/qqmlcontext.html#setContextProperty)
