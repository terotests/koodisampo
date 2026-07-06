# Portti 8080 pitäisi kuunnella mutta palvelu ei vastaa. Mikä komento listaa LISTEN-socketit?

## Tilanne

Health check epäonnistuu:

```bash
curl http://localhost:8080/health
# Connection refused
```

Palvelu näyttää systemd:ssä "active (running)", mutta se ei välttämättä ole sidottu oikeaan porttiin tai kuuntelee vain IPv6:lla.

## Ratkaisu

```bash
# -t = TCP, -u = UDP, -l = vain LISTEN, -n = numeeriset portit
ss -tuln

# prosessit mukaan: -p = PID ja prosessinimi
ss -tlnp
```

**ss on moderni netstat-korvike — ss(8) dokumentoi -tuln flagit.**

Etsi 8080:

```bash
# -tlnp = TCP LISTEN + numeerinen + prosessi; grep rajaa porttiin 8080
ss -tlnp | grep 8080
```

Jos tyhjä, palvelu ei kuuntele TCP:8080 — tarkista konfiguraatio (`server.port`, bind-osoite).

## Käytännössä

`0.0.0.0:8080` vs `127.0.0.1:8080` selittää usein miksi ulkopuolelta ei saada yhteyttä. Kontissa `ss` hostilla vs `ss` kontissa — porttimapping voi hämätä. Lisää deploy-check: palvelu ei ole valmis ennen kuin `ss` näyttää LISTEN-tilan.

[Lue lisää](https://man7.org/linux/man-pages/man8/ss.8.html)
