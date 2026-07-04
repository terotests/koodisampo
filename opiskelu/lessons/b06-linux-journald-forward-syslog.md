# Legacy syslog-kollektori tarvitsee journal-lokit. Miten journald konfiguroi?

## Tilanne

Infrastruktuuritiimi ylläpitää vanhaa keskitettyä syslog-kollektoria (rsyslog/syslog-ng), joka kerää lokit `/var/log/messages`-tyylisistä lähteistä. Uudet palvelimet käyttävät systemd-journalia — sovellukset logittavat journaldiin, mutta kollektori ei lue journal-tiedostoja suoraan:

```bash
# Kollektori odottaa rsyslog-streamiä
tail /var/log/syslog
# Tyhjä tai puutteellinen — palvelut logittavat journaldiin
```

Tarvitset journald:n välittämään merkinnät perinteiselle syslog-palvelulle.

## Ratkaisu

Ota käyttöön journald → syslog -välitys:

```ini
# /etc/systemd/journald.conf
[Journal]
ForwardToSyslog=yes
```

journald.conf ForwardToSyslog — journald.conf man.

Varmista että rsyslog on käynnissä ja kuuntelee:

```bash
sudo systemctl enable --now rsyslog
sudo systemctl restart systemd-journald
journalctl -t rsyslog --since "1 min ago"
```

ForwardToSyslog=yes — journal lähetetään syslogille.

## Käytännössä

Monissa distroissa `ForwardToSyslog=yes` on oletus — tarkista ensin `journalctl -t rsyslog`. Tuotannossa määritä rsyslog lähettämään eteenpäin kollektoriin (`@@logserver:514`). Huomaa että journal säilyttää rikkaamman metadatan — syslog-välitys voi yksinkertaistaa viestejä.

[Lue lisää](https://www.freedesktop.org/software/systemd/man/journald.conf.html#ForwardToSyslog=)
