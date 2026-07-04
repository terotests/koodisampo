# Kontti/resolvoi `db` mutta ei `db.corp.local`. Mitä tiedostoa tarkistat ensin?

## Tilanne

Kubernetes-podissa sovellus yhdistyy `db.corp.local` onnistuneesti, mutta konfiguraatiossa lyhyt nimi `db` epäonnistuu:

```bash
curl http://db:5432/health   # Could not resolve host: db
nslookup db.corp.local       # toimii
```

Sama koodi toimii kehittäjän koneella. Epäilet DNS:ää podin sisällä — mutta mistä resolver-asetukset oikeasti tulevat?

## Ratkaisu

Tarkista ensin **`/etc/resolv.conf`** — erityisesti `nameserver`- ja `search`/`domain`-rivit:

```bash
cat /etc/resolv.conf
```

Esimerkki, jossa lyhyet nimet toimivat:

```
nameserver 10.0.0.53
search corp.local
```

Resolver kokeilee `db` → `db.corp.local` kun `search corp.local` on määritelty.

**search/domain määrittää miten lyhyet nimet täydennetään.** Ilman search-riviä lyhyt `db` lähetetään sellaisenaan upstream-resolverille, joka ei välttämättä tunne sitä.

Kontissa tiedosto voi olla kubeletin generoima symlink; sisältö on silti ensimmäinen paikka.

## Käytännössä

Älä oleta, että hostin resolv.conf kopioituu sellaisenaan konttiin — tarkista aina runtime-ympäristössä. systemd-resolved -distroilla näet usein `127.0.0.53`; silloin `resolvectl status` täydentää kuvaa. Tuotannossa suosi FQDN:ää konfiguraatioissa, jos search-domain ei ole taattu kaikissa ympäristöissä.

[Lue lisää](https://man7.org/linux/man-pages/man5/resolv.conf.5.html)
