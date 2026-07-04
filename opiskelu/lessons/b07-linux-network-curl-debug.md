# curl palauttaa SSL certificate problem — haluat nähdä TLS-handshaken. curl-lippu?

## Tilanne

Integraatio ulkoiseen API:in epäonnistuu:

```bash
curl https://api.partner.com/v1/token
# curl: (60) SSL certificate problem: unable to get local issuer certificate
```

Tiedosto on oikea URL, mutta et näe mitä sertifikaattia palvelin tarjoaa tai miksi ketju katkeaa.

## Ratkaisu

```bash
curl -v https://api.partner.com/v1/token
```

Verbose-tuloste näyttää:

- DNS-resoluution
- TCP-yhteyden
- TLS-handshaken (sertifikaatti, versio, cipher)
- HTTP-headerit

**curl -v — verbose näyttää TLS-handshaken ja HTTP-headerit.**

Vain sertifikaattitiedot:

```bash
curl -vI https://api.partner.com 2>&1 | grep -i cert
openssl s_client -connect api.partner.com:443 -servername api.partner.com
```

## Käytännössä

Tuotannossa `-v` vuotaa headerit logiin — älä käytä production-trafficissa ilman suodatusta. Yleisiä syitä: vanhentunut CA-bundle (`/etc/ssl/certs`), väärä SNI, corporate MITM-proxy. Korjaa CA-paketti tai lisää luotettu CA `update-ca-certificates`:lla — älä ohita validointia `-k`:llä pysyvästi.

[Lue lisää](https://curl.se/docs/manpage.html)
