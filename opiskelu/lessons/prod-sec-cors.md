# API palauttaa Access-Control-Allow-Origin: * ja Access-Control-Allow-Credentials: true. Mikä ongelma?

## Tilanne

`Access-Control-Allow-Origin: *` + `Access-Control-Allow-Credentials: true`

## Ratkaisu

CORS ei ole palvelinpuolen authorization-mekanismi — se on selaimen käytäntö.

- Credentials + villi origin on vaarallinen
- Salli vain tunnetut originit
- Tee varsinainen authz aina palvelimella

**Estääkö CORS curl-pyynnön?** Ei — CORS on selainrajoite.

[Lue lisää](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
