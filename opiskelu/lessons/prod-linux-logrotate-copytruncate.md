# logrotate käyttää `copytruncate` ja sovellus menettää satunnaisesti lokimerkintöjä rotaation jälkeen. Parempi tapa?

## Tilanne

`copytruncate` kopioi lokin sivuun ja typistää alkuperäisen inoden pituuden nollaan. Sovellus pitää fd:n auki samaan inodeen — yleensä ok, mutta kilpajuoksu kopioinnin ja kirjoituksen välillä voi pudottaa rivejä. Lisäksi jotkut buffrit käyttäytyvät huonosti truncaten kanssa.

## Ratkaisu

Jos sovellus tukee lokin uudelleenavausta (SIGHUP / USR1 / reload):

```
create 0640 user group
postrotate
  systemctl reload myapp.service >/dev/null 2>&1 || true
endscript
```

`create` tekee uuden inoden; signaali saa prosessin avaamaan uuden tiedoston. Ei copy+truncate-kilpajuoksua.

## Käytännössä

- systemd + `StandardOutput=journal` välttää tiedostolokien rotaatio-ongelmat.
- Jos copytruncate on pakko (ei signal-tukea), hyväksy riski ja monitoroi.
- Testaa rotaatio stagingissa kuorman alla.

[Lue lisää](https://manpages.debian.org/stable/logrotate/logrotate.conf.5.en.html)
