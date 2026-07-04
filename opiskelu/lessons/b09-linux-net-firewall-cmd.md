# Uusi palvelu portissa 8443 — firewalld estää ulkoiset yhteydet. Pysyvä aukko?

## Tilanne

Uusi HTTPS-palvelu kuuntelee portissa 8443 (esim. custom TLS). Sisäverkosta yhteys toimii, mutta kumppani ulkoisesta verkosta ei pääse sisään. firewalld on käytössä RHEL-palvelimella.

```bash
ss -tlnp | grep 8443
# LISTEN 0.0.0.0:8443
curl -k https://localhost:8443  # OK
```

## Ratkaisu

```bash
sudo firewall-cmd --add-port=8443/tcp --permanent
sudo firewall-cmd --reload
```

Varmista:

```bash
firewall-cmd --query-port=8443/tcp
```

**firewall-cmd permanent + reload — firewalld docs.**

## Käytännössä

Ilman `--permanent` aukko katoaa rebootissa. Rich rule voi rajoittaa lähde-IP:hen turvallisemmin kuin avoin portti kaikille. Muista myös cloud security group / network ACL — firewalld alone ei riitä pilvessä. Dokumentoi portti palveluluetteloon ja sulje se decommissionissa.

[Lue lisää](https://firewalld.org/documentation/man-pages/firewall-cmd)
