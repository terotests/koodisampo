# Valikkorivin Save-toiminto pitää bindata Ctrl+S:ään ja toolbar-nappiin. Qt-abstraktio?

## Tilanne

Editorissa "Tallenna" on toteutettu kolmessa paikassa erikseen:

```cpp
// Valikko
fileMenu->addAction("Tallenna", this, &Editor::save);

// Toolbar
auto *saveBtn = new QToolButton;
saveBtn->setText("Tallenna");
connect(saveBtn, &QToolButton::clicked, this, &Editor::save);

// Shortcut erikseen
auto *shortcut = new QShortcut(QKeySequence::Save, this);
connect(shortcut, &QShortcut::activated, this, &Editor::save);
```

Kun tallennuslogiikka muuttuu, kolme connect-ketjua pitää päivittää. Toolbar-nappi ei disabloidu, vaikka valikon Save on pois käytöstä.

## Ratkaisu

`QAction` yhdistää Ctrl+S, valikon ja toolbarin yhdeksi toiminnoksi:

```cpp
auto *saveAction = new QAction(tr("&Tallenna"), this);
saveAction->setShortcut(QKeySequence::Save);
saveAction->setIcon(QIcon(":/icons/save.png"));

fileMenu->addAction(saveAction);
ui->toolBar->addAction(saveAction);

connect(saveAction, &QAction::triggered, this, &Editor::save);

// Disabloi kaikki kerralla:
saveAction->setEnabled(document->isModified());
```

QAction yhdistää shortcut + menu + toolbar — Qt docs.

## Käytännössä

Käytä `QAction`-ryhmää (`QActionGroup`) toisiaan poissulkeville tiloille. `setStatusTip` ja `setToolTip` samassa actionissa pitää ohjeistuksen yhtenäisenä. Qt 6:ssa suosi `QAction::shortcutVisibleInContextMenu` tarvittaessa.

[Lue lisää](https://doc.qt.io/qt-6/qaction.html)
