# resolv.conf näyttää 127.0.0.53 — DNS-kyselyt epäonnistuvat satunnaisesti. Todennäköisin syy?

## Tilanne

Palvelimella DNS toimii välillä, välillä ei:

```bash
cat /etc/resolv.conf
# nameserver 127.0.0.53
```

```bash
dig google.com
# intermittent SERVFAIL or timeout
```

Sovellukset raportoivat satunnaisia "Temporary failure in name resolution" -virheitä.

## Ratkaisu

Todennäköisin syy: **systemd-resolved stub resolver** osoitteessa `127.0.0.53`.

Diagnostiikka:

```bash
resolvectl status
systemctl status systemd-resolved
```

Stub välittää kyselyt oikeille upstream-nameservereille. Ongelma voi olla väärä DNS NM:stä, IPv6-only upstream tai timeout.

**systemd-resolved käyttää stub 127.0.0.53 — resolvectl(1) diagnostiikkaan.**

## Käytännössä

Älä poista stubia käsin repimättä koko resolved-ketjua — korjaa upstream DNS NetworkManagerissa tai `/etc/systemd/resolved.conf.d/`. Kontit mounttaavat usein hostin resolv.conf:in; varmista että `127.0.0.53` on tavoitettavissa kontista tai käytä erillistä nameserveriä podin DNSPolicylla. Seuraa `journalctl -u systemd-resolved` intermittent-virheiden aikana.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/resolvectl.html)
