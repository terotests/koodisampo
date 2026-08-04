# Prosessi on jumissa tuotannossa etkä halua käynnistää sitä uudelleen. Miten näet mihin syscalliin se odottaa?

## Tilanne

Prosessi ei vastaa, CPU on matala, restart tappaisi debug-datan. Haluat nähdä odottaako se `read`, `futex`, `connect`, `poll` vai jotain muuta — ilman täyttä core dumpia ensimmäisenä askeleena.

## Ratkaisu

```bash
strace -p <pid> -tt -f
```

`strace` kiinnittyy prosessiin ja tulostaa syscallit. Näet mihin kutsuun se jää (esim. `restart_syscall` / `futex` / `recvfrom`). `-f` seuraa säikeitä/forkkeja. Lopeta Ctrl+C — prosessi jatkaa.

## Käytännössä

- Overhead: tuotannossa lyhyet sessionit; älä jätä päälle.
- Vaihtoehtoja: `perf`, `gdb -p` + `bt`, eBPF/`bpftrace` kevyempään seurantaan.
- Oikeudet: usein tarvitaan `CAP_SYS_PTRACE` / sama käyttäjä / root.
- Korjaa juurisyy (lukko, DNS, täysi levy) — älä vain restartaa sokeasti.

[Lue lisää](https://man7.org/linux/man-pages/man1/strace.1.html)
