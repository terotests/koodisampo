# Mikä tekee eBPF:stä turvallisen tavan ajaa omaa koodia Linux-ytimessä?

## Ratkaisu

eBPF-ohjelmat liitetään koukkuihin (syscallit, verkkopaketit, tracepointit) ja ne kommunikoivat käyttäjätilan kanssa mappien kautta. Käyttökohteita: observability (bpftrace), verkko (Cilium, XDP), tietoturva (Tetragon), ja vuodesta 2024 myös sched_ext-ajastimet.

## Käytännössä

Kokeile `bpftrace -e 'tracepoint:syscalls:sys_enter_openat { printf("%s %s\n", comm, str(args->filename)); }'` nähdäksesi mitä tiedostoja prosessit avaavat.


[Lue lisää](https://ebpf.io/what-is-ebpf/)
