# Dialog sulkeutuu mutta slot laukeaa edelleen destroyed senderistä. Esto?

## Tilanne

Hakudialogi kuuntelee verkkopalvelimen vastausta:

```cpp
void SearchDialog::startSearch(const QString &query) {
    connect(m_apiClient, &ApiClient::resultsReady,
            this, &SearchDialog::showResults);
    m_apiClient->search(query);
}
```

Käyttäjä sulkee dialogin ennen vastausta. `SearchDialog` tuhoutuu, mutta `ApiClient` elää singletonina. Kun vastaus saapuu, `showResults()` kutsutaan — crash tai roska muistissa.

Ongelma pahenee, jos `startSearch()` kutsutaan useasti: jokainen haku lisää uuden yhteyden.

## Ratkaisu

Irrota yhteys elinkaaren lopussa, käytä `QPointer`:ia tai kuuntele `destroyed`-signaalia:

```cpp
SearchDialog::~SearchDialog() {
    disconnect(m_apiClient, &ApiClient::resultsReady,
               this, &SearchDialog::showResults);
}

// tai connectissa context:
connect(m_apiClient, &ApiClient::resultsReady,
        this, &SearchDialog::showResults);  // this = context, katkeaa tuhoutuessa
```

`disconnect`, `QPointer` tai `destroyed`-signaali estää myöhäisen slotin. Disconnect elinkaaren lopussa — Qt object model.

## Käytännössä

Modaliset dialogit ja väliaikaiset näkymät: aina `connect(sender, signal, this, slot)` — `this` contextina. Singleton-senderit elävät pidempään kuin UI, joten irrottaminen on pakollista ilman context-yhteyttä.

[Lue lisää](https://doc.qt.io/qt-6/signalsandslots.html)
