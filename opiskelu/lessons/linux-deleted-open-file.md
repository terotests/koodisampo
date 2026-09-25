# df näyttää levyn täyneksi, mutta du löytää vain puolet käytöstä. Iso lokitiedosto poistettiin rm:llä, mutta palvelu on yhä käynnissä. Mitä tapahtuu?

## Tilanne

Levyhälytys: `/var` on 100 % täynnä. Päivystäjä poistaa 40 Gt:n lokitiedoston:

```bash
rm /var/log/app/app.log
df -h /var   # edelleen 100 %
du -sh /var  # vain 20 Gt
```

Tila ei vapautunut, ja `df` ja `du` antavat eri luvut.

## Ratkaisu

Etsi poistetut mutta yhä avoinna olevat tiedostot:

```bash
sudo lsof +L1            # tiedostot, joilla ei ole enää nimeä (link count 0)
sudo lsof -nP | grep '(deleted)'
```

Tila vapautuu, kun prosessi sulkee tiedoston: käynnistä palvelu uudelleen tai pyydä sitä avaamaan lokit uudelleen (esim. `systemctl reload`, `kill -HUP`). Hätätilanteessa tiedoston voi tyhjentää prosessin tiedostokuvaajan kautta: `: > /proc/<pid>/fd/<fd>`.

## Taustaa

`rm` poistaa vain hakemistomerkinnän (unlink). Tiedoston data ja inode säilyvät niin kauan kuin jokin prosessi pitää sitä auki. `df` kysyy tiedostojärjestelmän varattua tilaa, `du` laskee löytämiensä nimien koot, joten ero kertoo avoimista poistetuista tiedostoista.

Pysyvä korjaus on lokikierrätys: `logrotate` joko signaalilla (`postrotate`), jolloin sovellus avaa uuden tiedoston, tai `copytruncate`-asetuksella.

[Lue lisää](https://man7.org/linux/man-pages/man2/unlink.2.html)
