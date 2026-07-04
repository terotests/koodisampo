# Bugi tulvittaa journald:n identtisillä virheillä — diagnostiikka vaikeaa. Mitä konfiguroit?

## Tilanne

Tuotantobugi aiheuttaa loopin: sovellus logittaa saman virheen uudelleen joka millisekunti. Lokit ovat diagnostiikan kannalta hyödyttömät:

```bash
journalctl -u buggy-app -p err -n 10
# ERROR: retry failed, attempt 847291
# ERROR: retry failed, attempt 847292
# ERROR: retry failed, attempt 847293
# ... kaikki identtisiä ...
```

Oikea juurisyy on kadonnut tuhansien identtisten rivien alle. Levykin täyttyy.

## Ratkaisu

Konfiguroi journald rate limiting:

```ini
# /etc/systemd/journald.conf
[Journal]
RateLimitIntervalSec=30s
RateLimitBurst=1000
```

RateLimitIntervalSec määrittää aikaikkunan; RateLimitBurst kuinka monta identtistä viestiä sallitaan ennen suppressiota. journald rate limiting estää floodin — journald.conf(5).

```bash
sudo systemctl restart systemd-journald
```

Tarkista että suppressio toimii — journald raportoi ohitetut viestit:

```bash
journalctl -t systemd-journald --since "5 min ago"
```

## Käytännössä

Rate limit on hätäsuoja, ei korvike bugikorjaukselle — korjaa loopin lähde. Tuotannossa dokumentoi oletusarvot ja testaa stagingissa. Yhdistä `RateLimitBurst` ja `SystemMaxUse=` — rate limit hidastaa floodia, levyraja estää täyttymisen kokonaan.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journald.conf.html)
