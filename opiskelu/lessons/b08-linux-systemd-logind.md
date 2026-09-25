# SSH:lla käynnistetty pitkä job tapetaan uloskirjautuessa (logind KillUserProcesses=yes). Miten pidät sen elossa?

## Tilanne

Pitkä batch-job ajetaan SSH:lla:

```bash
ssh server
./long-job.sh &
logout
# job killed — "Hangup" or "Terminated"
```

Tällä palvelimella `logind.conf` asettaa `KillUserProcesses=yes` (monen jakelun oletus on `no`), joten `systemd-logind` tappaa koko session scopen logoutissa. Taustaprosessi ei selviä ilman erillistä mekanismia — `nohup` tai tmux eivät auta, koska ne jäävät samaan session scopeen.

## Ratkaisu

Käytä **`loginctl enable-linger` + `systemd-run --user`** — job siirtyy session scopen ulkopuolelle, ja linger pitää user-managerin käynnissä logoutin jälkeen.

Vaihtoehto 1 — linger + transient scope tai palvelu:

```bash
loginctl enable-linger $USER
systemd-run --user --scope --unit=long-job ./long-job.sh
# tai interaktiivisesti:
systemd-run --user --scope bash -c './long-job.sh; echo done > /tmp/result'
```

Scope tai palvelu elää user-managerin alla eikä kirjautumissession scopessa, joten logind ei tapa sitä sessiota siivotessaan. Ilman lingeriä user-manager pysähtyy viimeisen session päättyessä ja vie jobin mukanaan.

Vaihtoehto 2 — tmux oman scopen sisällä:

```bash
systemd-run --user --scope tmux new -s job './long-job.sh'
# detach, logout — pelkkä tmux tapettaisiin session mukana
```

Vaihtoehto 3 — `/etc/systemd/logind.conf`:

```ini
[Login]
KillUserProcesses=no
```

**logind may kill user processes on logout** — logind.conf(5).

## Käytännössä

Tuotantotyö: systemd service/timer, ei SSH-tausta. `systemd-run --scope` sopii ad hoc -ajoihin. `KillUserProcesses=no` on palvelintason policy — harkitse tietoturva.

`loginctl enable-linger user` pitää user systemd:n elossa ilman loginia — tarpeen user-uniteille.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/latest/logind.conf.html)
