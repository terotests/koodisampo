# Keskus-LOKIp palvelin vaatii syslog-formaatin. journald-konfiguraatio?

## Tilanne

Organisaation keskus-LOKIp-palvelin (Splunk, Graylog, ELK) kerää lokit syslog-protokollalla UDP/TCP-portista 514. Uusi palvelin käyttää systemd-journalia — sovellukset eivät kirjoita erillisiin tiedostoihin:

```bash
ls /var/log/myapp/
# tyhjä — lokit ovat journalissa

logger -t test "hello"
# Menee journaldiin, mutta keskuspalvelin ei näe sitä
```

Tarvitset journald:n välittämään merkinnät syslog-muodossa eteenpäin.

## Ratkaisu

**1. journald.conf — välitys syslogille:**

```ini
# /etc/systemd/journald.conf
[Journal]
ForwardToSyslog=yes
```

**2. rsyslog — lähetys keskuspalvelimelle:**

```ini
# /etc/rsyslog.d/forward.conf
*.* @@logserver.example.com:514
```

ForwardToSyslog lähettää journald:n rsyslogille — journald.conf.

```bash
sudo systemctl restart systemd-journald rsyslog
logger -t deploy-test "forwarding check"
```

## Käytännössä

Tarkista ensin onko `ForwardToSyslog=yes` jo oletusena (`grep Forward /etc/systemd/journald.conf`). Tuotannossa rsyslogin queue-asetukset estävät lokien menetyksen verkkokatkon aikana. Huomaa että syslog-formaatti menettää osan journal-metadatasta — tarvittaessa lähetä JSON suoraan agentilla (`journalctl -o json`).

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journald.conf.html#ForwardToSyslog=)
