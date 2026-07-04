# Uusi palvelu portissa 8080 — palomuuri estää ulkoiset yhteydet. firewalld-komento?

## Tilanne

Web-palvelu kuuntelee portissa 8080 ja vastaa localhostista:

```bash
curl http://127.0.0.1:8080/health
# OK
```

Ulkoisesta verkosta yhteys timeouttaa. RHEL-palvelimella firewalld on aktiivinen:

```bash
systemctl is-active firewalld
# active
```

## Ratkaisu

Avaa portti pysyvästi:

```bash
sudo firewall-cmd --add-port=8080/tcp --permanent
sudo firewall-cmd --reload
```

Varmista:

```bash
firewall-cmd --list-ports
curl http://$(hostname -I | awk '{print $1}'):8080/health
```

**firewall-cmd --add-port=8080/tcp --permanent && firewall-cmd --reload** — muutos tallentuu zone-konfigiin.

## Käytännössä

`--permanent` ilman `--reload` ei aktivoi sääntöä heti. Zone (`public`, `internal`) määrittää kontekstin — `--zone=public` tarvittaessa. Tuotannossa harkitse palvelukohtaista sääntöä (`--add-service=`) jos se on määritelty. Dokumentoi avatut portit ja perustele auditissa; sulje portti kun palvelu siirtyy reverse-proxyn taakse.

[Lue lisää](https://firewalld.org/documentation/man-pages/firewalld.html)
