# Modal-dialogi ei estä pääikkunan klikkauksia. Mikä puuttuu?

## Tilanne

Vahvistusdialogi on toteutettu näin:

```cpp
void MainWindow::confirmDelete() {
    auto *dlg = new QDialog;  // ei parenttia, ei modal-flagia
    dlg->setWindowTitle("Poista tiedosto?");
    dlg->show();
}
```

Dialogi näkyy, mutta käyttäjä voi klikata pääikkunan muita kohteita samaan aikaan. Modal-käyttäytyminen puuttuu kokonaan.

## Ratkaisu

`exec()` modalille tai `setModal(true)` + oikea parent:

```cpp
void MainWindow::confirmDelete() {
    QDialog dlg(this);  // parent = pääikkuna
    dlg.setWindowTitle("Poista tiedosto?");
    // ... layout ja napit ...
    dlg.setModal(true);
    if (dlg.exec() == QDialog::Accepted) {
        performDelete();
    }
}
```

`exec()` blocks until closed — QDialog docs. Parent varmistaa, että dialogi on ikkunapuussa oikein ja sulkeutuu pääikkunan mukana.

## Käytännössä

`show()` + `setModal(true)` ei blokkaa koodia — käytä `exec()` kun tarvitset synkronisen vastauksen. `Qt::ApplicationModal` vs `Qt::WindowModal`: valitse sen mukaan, pitääkö koko sovellus tai vain yksi ikkuna blokata.

[Lue lisää](https://doc.qt.io/qt-6/qdialog.html#modal-dialogs)
