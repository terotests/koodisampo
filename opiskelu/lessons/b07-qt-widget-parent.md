# Dialogi jää roikkuen muistissa ikkunan sulkeuduttua. Todennäköisin syy?

## Tilanne

Pääikkuna avaa asetusdialogin:

```cpp
void MainWindow::showPreferences() {
    m_prefsDialog = new PreferencesDialog;  // ei parenttia
    m_prefsDialog->show();
}

MainWindow::~MainWindow() {
    // prefsDialog ei tuhota — ei parenttia, ei deleteä
}
```

Käyttäjä sulkee pääikkunan. `PreferencesDialog` jää edelleen näkyviin — tai piiloon mutta muistissa. Profileri näyttää eloon jääneen `QDialog`-instanssin.

## Ratkaisu

Ei parent-widgettiä — QObject parent hallitsee lasten elinkaarta:

```cpp
void MainWindow::showPreferences() {
    if (!m_prefsDialog) {
        m_prefsDialog = new PreferencesDialog(this);  // parent = MainWindow
    }
    m_prefsDialog->show();
}
```

Kun `MainWindow` tuhoutuu, `PreferencesDialog` tuhoutuu automaattisesti. QObject parent-child ownership — Qt Object Trees.

## Käytännössä

Top-level dialogeille: parent = kutsuva ikkuna tai `WA_DeleteOnClose` + `QPointer` seurantaan. `QPointer<PreferencesDialog>` nollautuu automaattisesti, jos dialogi tuhoutuu — välttää dangling pointer -bugit.

[Lue lisää](https://doc.qt.io/qt-6/objecttrees.html)
