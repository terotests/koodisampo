# Mikä prosessi kuuntelee porttia 5432? Nopein diagnostiikka?

## Tilanne

PostgreSQL-palvelu pitäisi kuunnella porttia 5432, mutta toinen instanssi tai vanha kontti varasi sen. Uusi `postgresql.service` ei käynnisty.

```bash
systemctl start postgresql
# port already in use
```

Tarvit nopeasti tiedon prosessista.

## Ratkaisu

```bash
ss -tlnp | grep 5432
```

PostgreSQL voi kuunnella myös vain Unix-socketia — tarkista:

```bash
ss -tlnp sport = :5432
ss -xlnp | grep postgres
```

**ss -tlnp tai ss -ulnp — listening socketit ja prosessit.**

## Käytännössä

Docker-pubblished port `0.0.0.0:5432` näkyy hostin `ss`-tulosteessa konttiprosessina. Tuotannossa älä tapa tuntematonta PID:ä — varmista omistaja (`postgres`, `docker-proxy`). Usein vanha cluster tai testikontti on syyllinen; `systemctl status` ja `docker ps` rinnakkain nopeuttavat selvitystä.

[Lue lisää](https://man7.org/linux/man-pages/man8/ss.8.html)
