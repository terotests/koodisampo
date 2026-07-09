# package.json: "some-lib": "^1.2.0" — CI asentaa ilman lockfileä. Mikä riski?

## Tilanne

`package.json` sisältää `"some-lib": "^1.2.0"`. CI ajaa `npm install` ilman commitattua lockfileä.

## Riski

Ilman lockfileä build ei ole deterministinen: sama commit voi asentaa eri dependency-puun eri päivänä.

## Miksi tämä on vaarallista

`^1.2.0` ei tarkoita "asenna juuri 1.2.0", vaan "asenna yhteensopiva uudempi versio" — esimerkiksi 1.2.9 tai 1.9.0 riippuen semver-rajasta. Ilman lockfileä CI voi asentaa eri dependency-puun maanantaina kuin perjantaina, vaikka oma koodi ei muutu.

Myös transitiiviset riippuvuudet voivat muuttua ilman, että sovelluksen oma koodi muuttuu. Security-riski on supply chain -riski: uusi dependency-versio voi sisältää haavoittuvuuden, haitallisen julkaisun, tilikaappauksen seurauksena julkaistun version tai rikkovan muutoksen. Koska muutos ei näy sovelluskoodin diffissä, sitä on vaikea reviewata.

## Väärä korjaus

"Poistetaan caret ja pinataan kaikki dependencyt `package.json`iin" ei yksin riitä, koska transitiiviset dependencyt voivat silti muuttua ilman lockfileä.

`npm install` CI:ssä voi päivittää lockfileä ja ratkaista riippuvuudia uudelleen. `npm ci` asentaa täsmälleen lockfilen mukaisen puun ja epäonnistuu, jos `package.json` ja lockfile eivät täsmää. CI:ssä halutaan jälkimmäinen.

## Parempi korjaus

- Commitoi lockfile (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`)
- Käytä CI:ssä `npm ci`, ei tavallista `npm install`
- Päivitä dependencyt hallitusti erillisinä PR:inä
- Tarkista päivitysten changelogit, testit ja security-advisoryt
- Käytä Dependabot/Renovate-tyyppistä automaatiota
- Älä julkaise tuotantoon dependency-päivityksiä "sivuvaikutuksena" muun koodimuutoksen mukana

```bash
# CI:ssä
npm ci

# dependency-päivitykset vain erillisenä PR:nä
npm outdated
npm audit
npm update some-lib
```

## Tuotantohuomiot

Pelkkä version pinnaaminen `package.json`iin ei riitä — transitiiviset dependencyt tarvitsevat myös lukituksen. Dependabot/Renovate avaa päivitykset erillisinä PR:inä, joissa näkyvät changelog, testit ja mahdollinen security-advisory.

[Lue lisää](https://owasp.org/Top10/2021/A06_2021-Vulnerable_and_Outdated_Components/)
