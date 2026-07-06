#!/usr/bin/env node
/**
 * Generoi opiskelu/lessons/*.md natiivi- ja monialustakehityksen kysymyspankeista.
 * Sisältö pidetään yleisenä alustakehityksenä, ei projektikohtaisena tapauskuvauksena.
 *
 * Käyttö: node scripts/generate-native-platform-lessons.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lessonsDir = resolve(root, "opiskelu/lessons");
const banks = [
  "kotlin-compose.json",
  "flutter-dev.json",
  "react-native-dev.json",
  "tauri-capacitor.json",
  "game-engines.json",
  "qt-native-game.json",
];

const generatedPrefixes = [
  "kotlin-compose-",
  "flutter-",
  "rn-",
  "webshell-",
  "gameengines-",
  "qt-native-",
];

const platformIntro = {
  kotlin: "Androidin Kotlin + Jetpack Compose -kehityksessä olennaista on erottaa UI-tila, sovellustila ja alustapalvelut toisistaan. Compose kuvaa näkymän deklaratiivisesti, ViewModel säilyttää näytön tilan ja repositoryt hoitavat datalähteet.",
  flutter: "Flutterissa käyttöliittymä rakennetaan widget-puuna ja tila pidetään selkeässä state-kerroksessa. Sama koodipohja voi tavoitella mobiilia, webiä ja desktopia, mutta alustakohtaiset plugin-riippuvuudet pitää suunnitella erikseen.",
  "react-native": "React Native yhdistää React-mallin ja natiivikomponentit. Hyvä arkkitehtuuri erottaa komponenttien paikallisen tilan, jaetun sovellustilan sekä natiivimoduulit, joita tarvitaan alustakohtaisiin ominaisuuksiin.",
  webshell: "Tauri ja Capacitor paketoivat web-frontendin natiivimpaan jakeluympäristöön. Hyöty tulee nopeasta jakelusta ja plugin-API:sta, mutta samalla pitää hallita WebViewin turvallisuus, tallennus ja alustakohtaiset oikeudet.",
  gameengines: "Unityn, Godotin ja muiden pelimoottorien arvioinnissa tärkeintä on sopivuus käyttötapaukseen. Valmiit scene-, asset-, fysiikka- ja export-työkalut voivat nopeuttaa työtä, mutta ne tuovat myös oman arkkitehtuurinsa ja ylläpitokustannuksensa.",
  qt: "Qt 6 on laaja natiivi sovelluskehys desktop- ja sulautettuihin käyttöliittymiin. Sen vahvuuksia ovat signal/slot-malli, Model/View-arkkitehtuuri, Widgets- ja QML-vaihtoehdot sekä hyvät deploy-työkalut.",
};

function correctChoice(q) {
  return q.choices.find((c) => c.correct)?.text ?? "";
}

function wrongHints(q) {
  return q.choices.filter((c) => !c.correct).map((c) => c.text);
}

function lessonBody(q) {
  const intro = platformIntro[q.domain] || "Alustakehityksessä tekninen valinta vaikuttaa arkkitehtuuriin, testaukseen, jakeluun ja ylläpitoon.";
  const wrongs = wrongHints(q);

  return `# ${q.prompt}

## Tilanne

${intro}

Kysymys kuvaa tavallista päätöstä, joka tulee vastaan tuotantosovelluksen kehityksessä: mihin kerrokseen vastuu kuuluu, mitä alustatyökalua kannattaa käyttää ja mitä riskejä valinnasta seuraa. Hyvä vastaus ei perustu teknologian nimeen vaan siihen, miten ratkaisu käyttäytyy elinkaaren, suorituskyvyn, saavutettavuuden, turvallisuuden ja ylläpidon kannalta.

## Ratkaisu

**Oikea vastaus:** ${correctChoice(q)}

${q.correctFeedback}

${q.wrongFeedback} Tyypillisiä vääriä suuntia tässä tilanteessa ovat esimerkiksi: ${wrongs.slice(0, 2).join("; ")}.

## Käytännössä

Tee päätös ensin vastuunjaon kautta: UI renderöi ja vastaanottaa syötteen, state-kerros säilyttää näytön tai sovelluksen tilan, data- tai platform-kerros hoitaa IO:n, tallennuksen ja natiivit integraatiot. Kun nämä rajat pysyvät selkeinä, samaa toimintoa on helpompi testata ja siirtää toiselle alustalle.

Tarkista lisäksi virallinen dokumentaatio ennen tuotantopäätöstä, koska alustojen plugin-, deploy- ja turvallisuusmallit muuttuvat versioiden mukana.

[Lue lisää](${q.sourceUrl})
`;
}

mkdirSync(lessonsDir, { recursive: true });
const activeIds = new Set();
const allQuestions = [];

for (const file of banks) {
  const bank = JSON.parse(readFileSync(resolve(root, "content/question-banks", file), "utf8"));
  for (const q of bank.questions || []) {
    activeIds.add(q.id);
    allQuestions.push(q);
  }
}

let removed = 0;
for (const file of readdirSync(lessonsDir)) {
  if (!file.endsWith(".md")) continue;
  const id = file.slice(0, -3);
  if (generatedPrefixes.some((prefix) => id.startsWith(prefix)) && !activeIds.has(id)) {
    unlinkSync(resolve(lessonsDir, file));
    removed += 1;
  }
}

let written = 0;
for (const q of allQuestions) {
  const out = resolve(lessonsDir, `${q.id}.md`);
  const body = lessonBody(q);
  if (!existsSync(out) || readFileSync(out, "utf8") !== body) {
    writeFileSync(out, body, "utf8");
    written += 1;
  }
}

console.log(`generate-native-platform-lessons: ${written} written, ${removed} removed`);
