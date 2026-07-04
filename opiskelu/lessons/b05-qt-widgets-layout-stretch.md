# QHBoxLayoutissa vasen paneeli vie liikaa tilaa — oikea nappi jää piiloon. Miten tasapainotat?

## Tilanne

Editorissa vasemmalla tiedostopuu, oikealla editori ja alareunassa "Tallenna"-nappi:

```cpp
auto *layout = new QHBoxLayout;
layout->addWidget(m_fileTree);    // leveä puu
layout->addWidget(m_editor);
layout->addWidget(m_saveButton);  // katoaa pienellä ikkunalla
```

Puun oletusleveys vie kaiken tilan — oikean reunan nappi leikkaantuu pois näkyvistä resize:ssä.

## Ratkaisu

`setStretchFactor` tai stretch parametri — suhteellinen jako:

```cpp
auto *layout = new QHBoxLayout;
layout->addWidget(m_fileTree, 1);   // 1 osa ylimääräisestä tilasta
layout->addWidget(m_editor, 4);     // 4 osaa — editori saa enemmän
layout->addWidget(m_saveButton, 0);

layout->setStretchFactor(m_fileTree, 1);
layout->setStretchFactor(m_editor, 4);
layout->setStretchFactor(m_saveButton, 0);

m_fileTree->setMaximumWidth(300);  // lisärajoite puulle
```

Layout stretch määrittää tilanjaon — QBoxLayout docs.

## Käytännössä

Yhdistä stretch ja `minimumWidth`/`maximumWidth` — stretch alone ei aina riitä, jos widgetin `sizeHint` on liian suuri. `QSplitter` on parempi valinta, jos käyttäjä säätää paneelien kokoa itse.

[Lue lisää](https://doc.qt.io/qt-6/qboxlayout.html#setStretchFactor)
