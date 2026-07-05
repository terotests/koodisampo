# API palauttaa connection refused heti — ei timeout. TCP-kuuntelija ja SYN-jono: mitä tarkistat?

## Tilanne

Asiakas yrittää yhdistää `https://api.example.com:8080` ja saa heti `Connection refused`. Timeout viittaisi palomuurin tiputukseen; refused tarkoittaa että kernel vastaa RST:llä — portissa ei ole kuuntelijaa tai prosessi hylkää yhteyden.

## Ratkaisu

```bash
ss -ltn sport = :8080
# tai laajemmin:
ss -ltnp | grep 8080
```

Jos tyhjä → prosessi ei kuuntele porttia. Jos LISTEN mutta refused silti → eri namespace, väärä IP-bind (`127.0.0.1` vs `0.0.0.0`).

**ss -ltn** näyttää TCP LISTEN-socketit ja backlogin — ss man.

## Käytännössä

`Connection timed out` vs `refused` erottaa palomuurin ja sovelluskerroksen. Kontissa tarkista `ss` sekä hostilla että kontissa. SYN-backlog täynnä voi aiheuttaa hylkäyksiä — tarkista `ss -ltn` recv-q ja `somaxconn`. UDP-komennot (`ss -u`) eivät auta TCP refused -ongelmaan.

[Lue lisää](https://man7.org/linux/man-pages/man8/ss.8.html)
