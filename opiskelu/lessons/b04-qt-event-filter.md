# Haluat kaapata kaikki keypress-eventit dialogissa ennen lapsia. Qt-mekanismi?

## Tilanne

Modal-dialogissa haluat käsitellä Escape-näppäimen ja pikanäppäimet ennen kuin ne menevät aktiiviselle `QLineEdit`:ille. Subclassaaminen jokaiselle kentälle on raskasta.

```cpp
class ConfirmDialog : public QDialog {
    // Halutaan: Escape sulkee, Ctrl+Enter hyväksyy — kaikki kentät huomioiden
};
```

## Ratkaisu

`installEventFilter(filterObj)` dialogille — `filterObj::eventFilter()`:

```cpp
class DialogKeyCatcher : public QObject {
public:
    explicit DialogKeyCatcher(QDialog *dialog, QObject *parent = nullptr)
        : QObject(parent), m_dialog(dialog) {
        dialog->installEventFilter(this);
    }

protected:
    bool eventFilter(QObject *obj, QEvent *event) override {
        if (event->type() == QEvent::KeyPress) {
            auto *ke = static_cast<QKeyEvent *>(event);
            if (ke->key() == Qt::Key_Escape) {
                m_dialog->reject();
                return true;
            }
            if (ke->modifiers() & Qt::ControlModifier && ke->key() == Qt::Key_Return) {
                m_dialog->accept();
                return true;
            }
        }
        return QObject::eventFilter(obj, event);
    }

private:
    QDialog *m_dialog;
};

// Konstruktorissa:
new DialogKeyCatcher(this, this);
```

Event filters interceptoivat ennen kohdetta — QObject::installEventFilter.

## Käytännössä

Asenna filter dialogin juureen (`this`), jotta se näkee tapahtumat ennen lapsia. Palauta `true` vain kun tapahtuma on täysin käsitelty. `QShortcut` on vaihtoehto yksittäisille pikanäppäimille ilman filteriä.

[Lue lisää](https://doc.qt.io/qt-6/qobject.html#installEventFilter)
