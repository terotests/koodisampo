# Portti 443 auki ulkoapäin vaikka palvelu kuuntelee vain localhostia. Mitä tarkistat?

## Tilanne

Turvallisuusauditissa havaitaan, että portti 443 on skannattavissa internetistä. Palvelu on konfiguroitu kuuntelemaan vain paikallisesti:

```bash
ss -tlnp | grep 443
# LISTEN 127.0.0.1:443
```

Ulkoisesta skannauksesta portti silti vastaa — jokin muu kerros ohjaa liikennettä.

## Ratkaisu

Tarkista palomuurisäännöt:

```bash
sudo nft list ruleset
# tai iptables:
sudo iptables -t nat -L -n -v
sudo iptables -L INPUT -n -v
```

Etsi DNAT/port forwarding:

```
dnat to 127.0.0.1:443
# tai redirect 443 -> backend
```

**nftables/iptables säännöt — palomuuri ohjaa liikennettä eri kuin bind.** Bind-osoite (`127.0.0.1`) ja palomuurin NAT ovat toisistaan riippumattomia.

## Käytännössä

Cloud load balancer voi myös julkaista portin eri kuin palvelin luulee. Dokumentoi kaikki kerrokset: bind, firewall, LB, security group. Principle of least privilege: sulje 443 INPUT-ketjussa jos palvelu on vain localhost-reverse-proxyn takana. Käytä `ss` + `nft` yhdessä auditissa — pelkkä sovellusconfig ei riitä.

[Lue lisää](https://wiki.nftables.org/wiki-nftables/index.php/Main_Page)
