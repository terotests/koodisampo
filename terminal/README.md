# Koodisampo Terminal

Koodisampon kysymykset vanhan päätteen näköisenä, ilman karttapeliä.
Julkaistaan osoitteeseen https://terotests.github.io/koodisampo/terminal/

Kysymys kirjoitetaan ruudulle merkki kerrallaan epätasaisella rytmillä
(välilyönti ja välimerkit hidastavat). Sen jälkeen kursori vilkkuu lukutauon
ajan (1,8–7 s kysymyksen pituuden mukaan), ja vasta sitten tulostetaan
vastausvaihtoehdot. Kierroksessa on 10 kysymystä valitusta aiheesta.

| Näppäin | Toiminto |
| --- | --- |
| `00`–`16`, nuolet + ENTER | aiheen valinta |
| `1`–`4` / `a`–`d` | vastaus (kun kysymys on kokonaan ruudulla) |
| ENTER / välilyönti | 1. kirjoita kysymys loppuun, 2. ohita lukutauko, 3. tulosta vaihtoehdot; palautteen jälkeen seuraava |
| ESC | aihevalikko |
| L | avaa kysymyksen oppitunnin (vastauksen jälkeen) uuteen ikkunaan |
| O | avaa opiskelumateriaalin etusivun uuteen ikkunaan |
| T | väri: vihreä / meripihka / valkoinen |
| M | näppäinääni päälle / pois |
| E | moiré-efekti päälle / pois |

Kosketusnäytöllä vaihtoehtoa tai aihetta napautetaan, muualle napautus on ENTER.

**Opiskelumateriaali:** alapalkin oikeassa reunassa on aina alleviivattu
OPISKELUMATERIAALI-linkki (`../opiskelu/docs/intro/`), ja vastauksen jälkeen
ruudulle tulostuu linkki LUE OPPITUNTI JA SELITYS, joka vie kysymyksen kohtaan
opiskelusivustolla (`../opiskelu/docs/topics/<domain>/#<kysymyksen id>`, sama
osoite kuin pelin "Lue oppitunti" -linkissä). Linkit avautuvat uuteen
ikkunaan. Lasten kysymyksillä ei ole oppituntilinkkiä, koska niitä ei ole
opiskelusivustolla.

**Moiré:** ruudun päällä on EVG:n surface effect -plugin `moire` (filter,
`web/moire.js`), joka julistetaan Rangerin tyylissä (`evg-surface-effect: moire`
ja `evg-fx-*`-parametrit `.screen`-luokassa). Kaksi hienoa ristikkoa
päällekkäin tuottaa kaartuvat juovat ja samankeskiset "pallot". Efekti on
hetkittäinen: noin 6 sekuntia kerrallaan, epäsäännöllisesti kerran 24 sekunnin
jaksossa, ja pallot ovat joka kerta eri kohdissa. Muun ajan ruutua ei piirretä
uudelleen efektin takia. `prefers-reduced-motion` pysäyttää sen.

## Rakenne

| Tiedosto | |
| --- | --- |
| `KoodisampoTerminal.rgr` | Ranger: tila, kirjoitusrytmi, näkymät, EVG-puu ja tyylit, `render()` → näyttölista |
| `build.mjs` | kääntää sovelluksen + EVG-moottorin selaimen IIFE:ksi ja kopioi maalarin |
| `web/koodisampo-terminal.js` | käännetty bundle (**commitoitu**, generoitu) |
| `web/vendor/evg-webgl.js`, `evg-measure.js` | EVG:n WebGL 2 -maalari ja tekstinmittaaja (Ranger `lib/evg/gl`, MIT, kopioitu) |
| `web/moire.js` | moiré-efektin GLSL-plugin ja sen ajoituskäyrä |
| `web/main.js` | selainisäntä: pankkien lataus, kello, näppäimet, kosketus, WebGL-piirto, ääni |
| `web/index.html` | kanvaasi ja CSS:n CRT-pinta (juovat, vinjetti, hehku) |
| `web/fonts/VT323-Regular.ttf` | VT323-fontti (SIL OFL 1.1, `OFL.txt`) |

Selain ei asettele mitään: EVG laskee jokaisen rivin paikan (fontti mitataan
canvasilla samasta VT323:sta, jolla WebGL-atlas piirretään) ja `evg-webgl.js`
piirtää näyttölistan. Jos rivit eivät mahdu ruutuun, vanhimmat vierivät pois.

## Kääntäminen

EVG ei ole npm-paketissa `ranger-compiler`, joten käännös tarvitsee
Ranger-repon checkoutin (`RANGER_DIR`, tai `../Ranger` / `../agent/Ranger`):

```bash
npm run build:terminal          # → terminal/web/koodisampo-terminal.js + vendor/
node test/terminal_quiz.test.mjs
```

Commitoi `web/koodisampo-terminal.js` ja `web/vendor/` `.rgr`-muutosten kanssa.
GitHub Pages -build ei käännä Rangeria: `scripts/sync-web-game-assets.mjs`
kopioi `terminal/web/` → `web-game/public/terminal/`, ja Vite vie sen
`dist/terminal/`-kansioon. Kysymykset luetaan pelin kanssa jaetusta
`../content/question-banks/`-kansiosta.

Paikallisesti: `npm run dev` ja avaa http://localhost:5173/koodisampo/terminal/index.html
