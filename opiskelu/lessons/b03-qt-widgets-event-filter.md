# Pitää siepata Enter-näppäin tietystä kentästä ilman subclassia. Qt-mekanismi?

## Tilanne

Lomakkeessa on `QLineEdit` hakukenttänä. Enter pitäisi laukaista haun, mutta oletus käyttäytyy kuin Tab — fokus siirtyy seuraavaan kenttään. Et halua luoda `SearchLineEdit`-aliluokkaa vain yhtä näppäintä varten.

```cpp
auto *searchEdit = new QLineEdit(formWidget);
layout->addWidget(searchEdit);
// Enter → seuraava kenttä, ei hakua
```

## Ratkaisu

`installEventFilter()` objektilla, joka implementoi `eventFilter()`-metodin:

```cpp
class SearchKeyFilter : public QObject {
public:
    explicit SearchKeyFilter(QLineEdit *target, std::function<void()> onEnter, QObject *parent = nullptr)
        : QObject(parent), m_onEnter(std::move(onEnter)) {
        target->installEventFilter(this);
    }

protected:
    bool eventFilter(QObject *obj, QEvent *event) override {
        if (event->type() == QEvent::KeyPress) {
            auto *ke = static_cast<QKeyEvent *>(event);
            if (ke->key() == Qt::Key_Return || ke->key() == Qt::Key_Enter) {
                m_onEnter();
                return true;  // tapahtuma käsitelty — ei välitetä eteenpäin
            }
        }
        return QObject::eventFilter(obj, event);
    }

private:
    std::function<void()> m_onEnter;
};

// Käyttö:
new SearchKeyFilter(searchEdit, [this]() { runSearch(); }, this);
```

Event filter on Qt:n tapa interceptata tapahtumia — QObject docs.

## Käytännössä

Event filter ajetaan ennen kohde-widgetin käsittelyä. Muista poistaa filter (`removeEventFilter`) jos kohde elää pidempään kuin filter-objekti. Lambda-pohjaiseen filteriin voi käyttää myös erillistä `QObject`-aliluokkaa tai `QShortcut` Enterille, jos fokuksen hallinta riittää.

[Lue lisää](https://doc.qt.io/qt-6/qobject.html#installEventFilter)
