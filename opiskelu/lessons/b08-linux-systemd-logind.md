# SSH-istunto katkeaa mutta prosessi tapetaan logoutissa — haluat pitää jobin elossa. Mitä?

## Tilanne

Pitkä batch-job ajetaan SSH:lla:

```bash
ssh server
./long-job.sh &
logout
# job killed — "Hangup" or "Terminated"
```

`systemd-logind` oletuksena tappaa käyttäjän prosessit logoutissa (`KillUserProcesses=yes`). Taustaprosessi ei selviä ilman erillistä mekanismia.

## Ratkaisu

Käytä **`systemd-run --user scope`** tai **tmux** — **logind KillUserProcesses**.

Vaihtoehto 1 — transient scope:

```bash
systemd-run --user --scope --unit=long-job ./long-job.sh
# tai interaktiivisesti:
systemd-run --user --scope bash -c './long-job.sh; echo done > /tmp/result'
```

Scope erottaa prosessin logout-taposta (linger/session riippuen).

Vaihtoehto 2 — tmux/screen:

```bash
tmux new -s job './long-job.sh'
# detach, logout — tmux server säilyy jos KillUserProcesses=no tai linger
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
