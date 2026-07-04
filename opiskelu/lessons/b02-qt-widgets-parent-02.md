# Dialog leakkaa muistia sulkeutumisen jälkeen — widgetit orphan. Fix?

## Tilanne

Tuotantosovelluksessa avataan usein modal-dialogeja tiedoston tallennukseen:

```cpp
void EditorWindow::showSaveAs() {
    auto *dlg = new QDialog;
    auto *nameEdit = new QLineEdit;
    auto *layout = new QVBoxLayout(dlg);
    layout->addWidget(nameEdit);
    dlg->exec();
    // dlg jää heapille — ei deleteä, ei parenttia
}
```

Käyttäjä avaa "Tallenna nimellä" -dialogin kymmeniä kertoja istunnon aikana. Muistin käyttö kasvaa tasaisesti — jokainen dialogi ja sen lapset jäävät eloon.

## Ratkaisu

Parent `QDialog`:ille tai `WA_DeleteOnClose` estää orphan-widgetit:

```cpp
void EditorWindow::showSaveAs() {
    auto *dlg = new QDialog(this);  // parent = pääikkuna
    dlg->setAttribute(Qt::WA_DeleteOnClose);
    auto *nameEdit = new QLineEdit(dlg);
    auto *layout = new QVBoxLayout(dlg);
    layout->addWidget(nameEdit);
    dlg->exec();
}
```

Qt parent-child ownership vapauttaa lapset — QObject docs. `WA_DeleteOnClose` tuhoaa dialogin sulkeutumisen jälkeen; parent varmistaa, että ikkunan sulkeuduttua myös dialogi katoaa.

## Käytännössä

Valitse joko stack-dialogi parentilla (`QDialog dlg(this)`) tai heap-dialogi `WA_DeleteOnClose`:lla — älä jätä dialogeja parentittomiksi heapille ilman selkeää omistajaa. Valgrindin `still reachable` -listalla orphan-`QWidget`-objektit ovat yleinen löydös.

[Lue lisää](https://doc.qt.io/qt-6/objecttrees.html)
