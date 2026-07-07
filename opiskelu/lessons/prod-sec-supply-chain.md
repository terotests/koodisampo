# package.json: "some-lib": "^1.2.0" — CI asentaa ilman lockfileä. Mikä riski?

## Tilanne

`"some-lib": "^1.2.0"` — CI asentaa ilman lockfileä.

## Ratkaisu

- Build ei ole toistettava
- Uusi transitiivinen dependency voi tulla sisään ilman koodimuutosta
- Käytä lockfileä ja `npm ci`
- Seuraa advisoreita
- Tee dependency update hallitusti PR:nä

[Lue lisää](https://owasp.org/Top10/2021/A06_2021-Vulnerable_and_Outdated_Components/)
