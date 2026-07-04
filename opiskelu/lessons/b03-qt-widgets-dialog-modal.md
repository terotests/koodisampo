# Asetusdialogi avautuu mutta pääikkuna vastaa klikkauksiin taustalla. Korjaus?

## Tilanne

Asetusdialogi avataan `show()`:lla:

```cpp
void MainWindow::openSettings() {
    auto *dlg = new SettingsDialog(this);
    dlg->show();
}
```

Dialogi näkyy etualalla, mutta käyttäjä voi silti klikata pääikkunan nappeja taustalla. Hän voi vahingossa sulkea dokumentin samalla kun asetuksia muokataan — tilanne sekoittuu.

## Ratkaisu

`dialog.exec()` modal-tilassa tai `QDialog::ApplicationModal` estää taustan:

```cpp
void MainWindow::openSettings() {
    SettingsDialog dlg(this);
    dlg.setWindowModality(Qt::ApplicationModal);
    dlg.exec();  // blokkaa kunnes dialogi suljetaan
}
```

Vaihtoehtoisesti non-blocking modal:

```cpp
auto *dlg = new SettingsDialog(this);
dlg->setModal(true);
dlg->setWindowModality(Qt::ApplicationModal);
dlg->open();  // ei blokkaa event loopia, mutta estää taustan
```

`exec()` / modal flag estää taustainteraktion — QDialog docs.

## Käytännössä

`exec()` on ok lyhyille asetus- ja vahvistusdialogeille. Pitkissä prosesseissa suosi `open()` + signaalit, jotta event loop pysyy hengissä. `Qt::WindowModal` rajoittaa blokin yhteen ikkunapuuhun — `ApplicationModal` koko sovellukseen.

[Lue lisää](https://doc.qt.io/qt-6/qdialog.html)
