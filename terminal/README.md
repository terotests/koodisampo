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
| T | väri: vihreä / meripihka / valkoinen |
| M | näppäinääni päälle / pois |

Kosketusnäytöllä vaihtoehtoa tai aihetta napautetaan, muualle napautus on ENTER.

## Rakenne

| Tiedosto | |
| --- | --- |
| `KoodisampoTerminal.rgr` | Ranger: tila, kirjoitusrytmi, näkymät, EVG-puu ja tyylit, `render()` → näyttölista |
| `build.mjs` | kääntää sovelluksen + EVG-moottorin selaimen IIFE:ksi ja kopioi maalarin |
| `web/koodisampo-terminal.js` | käännetty bundle (**commitoitu**, generoitu) |
| `web/vendor/evg-webgl.js`, `evg-measure.js` | EVG:n WebGL 2 -maalari ja tekstinmittaaja (Ranger `lib/evg/gl`, MIT, kopioitu) |
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
