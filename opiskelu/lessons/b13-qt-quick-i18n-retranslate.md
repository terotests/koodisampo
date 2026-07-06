# Käyttäjä vaihtaa kielen lennossa — qsTr()-tekstit eivät päivity QML:ssä. Mitä kutsutaan?

## Tilanne

Sovellus asentaa uuden `QTranslator`:in kun käyttäjä valitsee kielen asetuksista. C++-tekstit päivittyvät, QML `qsTr()`-tekstit eivät.

## Ratkaisu

```cpp
void AppSettings::setLanguage(const QString &locale)
{
    qApp->removeTranslator(&m_translator);
    m_translator.load("app_" + locale, ":/i18n");
    qApp->installTranslator(&m_translator);
    for (auto *engine : m_engines)
        engine->retranslate();
}
```

`QQmlEngine::retranslate()` päivittää QML:n `qsTr()`-bindingit.

## Käytännössä

Kutsu `retranslate()` jokaiselle aktiiviselle `QQmlApplicationEngine`:lle. `clearComponentCache()` tarvitaan vain kun QML-tiedostot vaihtuvat levyltä.

[Lue lisää](https://doc.qt.io/qt-6/qqmlengine.html#retranslate)
