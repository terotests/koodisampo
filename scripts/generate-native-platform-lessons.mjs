#!/usr/bin/env node
/**
 * Generoi opiskelu/lessons/*.md uusista natiivialusta-kysymyspankkeista.
 * Käyttö: node scripts/generate-native-platform-lessons.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
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

const platformIntro = {
  kotlin: "Android-natiivi voi rakentua Kotlin + Jetpack Compose -pinon varaan. Pelilogiikka tulee jaetusta simulaatiokirjastosta, host hoitaa snapshotin ja syötteen.",
  flutter: "Flutter tarjoaa yhden UI-koodipohjan mobiilille ja desktopille. Vuoropohjaisessa simulaatiopelissä Flutter on näkymäkerros: simulaatio pysyy erillisessä logiikkakirjastossa tai natiivissa kirjastossa.",
  "react-native": "React Native sopii lomake- ja feed-sovelluksiin. Ruudukkopelissä, jossa logiikka on jo jaetussa simulaatiokerroksessa, RN tuo usein turhan JavaScript-kerroksen.",
  webshell: "Tauri ja Capacitor paketoivat olemassa olevan web-buildin natiivikonttiin. Nopein tapa saada desktop- tai kauppajulkaisu ilman uutta UI-koodia.",
  gameengines: "Unity ja Godot loistavat uusissa visuaalisissa peleissä. Jos pelimoottori on jo custom-simulaatiokirjasto, valinta koskee usein hostia eikä scene-puu-moottoria.",
  qt: "Qt 6 on vahva valinta desktop-natiiviin: ikkuna, näppäimistö, offline ja isometrinen piirto ilman selainta. Androidissa voidaan jatkaa valitulla natiivilla UI-linjalla.",
};

function correctChoice(q) {
  return q.choices.find((c) => c.correct)?.text ?? "";
}

function wrongHints(q) {
  return q.choices.filter((c) => !c.correct).map((c) => c.text);
}

function lessonBody(q, bank) {
  const domain = q.domain || bank.domain;
  const intro = platformIntro[domain] || "";
  const correct = correctChoice(q);
  const wrongs = wrongHints(q);

  return `# ${q.prompt}

## Tilanne

${intro}

Olet suunnittelemassa vuoropohjaisen simulaatiopelin natiivijulkaisua. Pelilogiikka elää jaetussa simulaatiokirjastossa, ja alustahostit ovat ohuita: ne välittävät näppäinsyötteen logiikkakerrokselle ja renderöivät palautetun snapshotin. Kysymys testaa alustavalinnan käytännön vaikutusta tähän arkkitehtuuriin.

Tyypillinen virhe on siirtää pelisääntöjä UI-kerrokseen (Compose-widget, Flutter build(), Qt slot) tai valita teknologia, joka pakottaa logiikan uudelleenkirjoituksen.

## Ratkaisu

**Oikea vastaus:** ${correct}

${q.correctFeedback}

Väärät vaihtoehdot johtavat yleensä johonkin näistä ongelmista: ${wrongs.slice(0, 2).join("; ")}. ${q.wrongFeedback}

## Käytännössä

Pidä mielessä jaettu snapshot-skeema: kartta, kohtaaminen, tarina, valikot ja overlayt tulevat host-kontrollerista. UI ei päätä pelitilaa — se reagoi snapshotin \`screen\`-kenttään. Uusi alusta tarkoittaa uutta hostia ja renderöintiä, ei uutta pelimoottoria.

Testaa logiikka aina headless-testeillä ennen kuin investoit natiivi-UI-pariteettiin.

[Lue lisää](${q.sourceUrl})
`;
}

mkdirSync(lessonsDir, { recursive: true });
let written = 0;

for (const file of banks) {
  const bank = JSON.parse(readFileSync(resolve(root, "content/question-banks", file), "utf8"));
  for (const q of bank.questions || []) {
    const out = resolve(lessonsDir, `${q.id}.md`);
    writeFileSync(out, lessonBody(q, bank), "utf8");
    written += 1;
  }
}

console.log(`generate-native-platform-lessons: ${written} written`);
