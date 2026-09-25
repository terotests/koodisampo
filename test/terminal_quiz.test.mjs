/**
 * Koodisampo Terminal (terminal/KoodisampoTerminal.rgr) headless:
 * kirjoitusrytmi, lukutauko ennen vaihtoehtoja, vastaaminen, kierroksen loppu
 * ja EVG-näyttölista. Käyttää commitoitua bundlea terminal/web/koodisampo-terminal.js.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = fs.readFileSync(path.join(root, "terminal/web/koodisampo-terminal.js"), "utf8");
const ctx = vm.createContext({ console });
vm.runInContext(src, ctx);
const { KoodisampoTerminal } = ctx;

function makeApp() {
  const app = new KoodisampoTerminal();
  app.setSeed(42);
  app.setViewport(1024, 768, false);
  const bank = JSON.parse(fs.readFileSync(path.join(root, "content/question-banks/rust.json"), "utf8"));
  const t = app.addTopic("rust", "RUST");
  app.setStudyUrl("https://example.test/opiskelu/docs/intro/");
  for (const q of bank.questions) {
    const qi = app.addQuestion(t, q.prompt, q.correctFeedback || "", q.wrongFeedback || "");
    for (const c of q.choices) app.addChoice(qi, c.text, !!c.correct);
    app.setQuestionLink(qi, "https://example.test/opiskelu/docs/topics/rust/#" + q.id);
  }
  app.start();
  return app;
}

function run(app, ms, step = 16) {
  for (let t = 0; t < ms; t += step) app.tick(step);
}

function runUntilDone(app, limit = 120000) {
  let t = 0;
  while (!app.typingDone() && t < limit) {
    app.tick(16);
    t += 16;
  }
  assert.ok(app.typingDone(), "typing finished");
  return t;
}

// Valikko: kirjoitetaan, ja 01 valitsee ensimmäisen aiheen.
{
  const app = makeApp();
  assert.equal(app.modeIndex(), 0);
  runUntilDone(app);
  assert.match(app.screenText(), /VALITSE AIHE/);
  assert.match(app.screenText(), /\[01\] RUST \(74\)/);
  app.keyDown("0");
  app.keyDown("1");
  assert.equal(app.modeIndex(), 1, "round started");
}

// Kysymys kirjoitetaan ensin, vaihtoehdot vasta lukutauon jälkeen.
{
  const app = makeApp();
  runUntilDone(app);
  app.keyDown("Enter"); // menuSel 0 = kaikki aiheet
  assert.equal(app.modeIndex(), 1);
  run(app, 200);
  const early = app.screenText();
  assert.ok(!early.includes("[1]"), "choices not shown while question is typed");
  // Numero kesken kysymyksen ei vastaa, vaan tulostaa ruudun loppuun.
  {
    const probe = makeApp();
    runUntilDone(probe);
    probe.keyDown("Enter");
    run(probe, 200);
    probe.keyDown("1");
    assert.equal(probe.phaseIndex(), 0, "no answer before the question was on screen");
    assert.ok(probe.typingDone());
  }

  // ENTER kirjoittaa kysymyksen loppuun mutta lukutauko jää.
  app.keyDown("Enter");
  run(app, 300);
  const reading = app.screenText();
  assert.ok(reading.split("\n").length >= 3, "question fully shown");
  assert.ok(!reading.includes("[1]"), "choices wait for the reading pause");
  assert.equal(app.answerSlot("1"), 0);

  // Lukutauon aikana numero vastaa (kysymys on jo ruudulla) ja tulostaa loput.
  app.keyDown("2");
  assert.match(app.screenText(), /\[1\][\s\S]*\[4\]/);
  assert.equal(app.phaseIndex(), 2, "answered");
  runUntilDone(app);
  assert.match(app.screenText(), /\*\*\* (OIKEIN|VÄÄRIN)/);
}

// Koko kierros: oikea vastaus nostaa pisteitä, lopussa yhteenveto.
{
  const app = makeApp();
  runUntilDone(app);
  app.keyDown("0");
  app.keyDown("1");
  for (let i = 0; i < 10; i++) {
    runUntilDone(app);
    // Etsi oikea vastaus yrittämällä: tila pitää kirjaa, joten luetaan järjestys.
    const q = app.questions[app.qIndex];
    const slot = app.order.indexOf(q.correct);
    app.keyDown(String(slot + 1));
    runUntilDone(app);
    app.keyDown("Enter");
  }
  assert.equal(app.modeIndex(), 2, "summary");
  assert.equal(app.scoreNow(), 10);
  runUntilDone(app);
  assert.match(app.screenText(), /OIKEIN 10 \/ 10/);
  app.keyDown("Escape");
  assert.equal(app.modeIndex(), 0);
}

// Kirjoitusrytmi on epätasainen: merkkiviiveet eivät ole vakioita.
{
  const app = makeApp();
  runUntilDone(app);
  app.keyDown("Enter");
  app.takeTyped();
  const counts = [];
  for (let i = 0; i < 40; i++) {
    app.tick(40);
    counts.push(app.takeTyped());
  }
  assert.ok(new Set(counts).size > 1, "typing rhythm varies: " + counts.join(","));
}

// Näyttölista ja napautus: vaihtoehtorivi on osumaalue.
{
  const app = makeApp();
  runUntilDone(app);
  app.keyDown("Enter");
  runUntilDone(app);
  const doc = JSON.parse(app.render());
  assert.equal(doc.cssErrors, 0, "stylesheet parses");
  assert.equal(doc.width, 1024);
  const texts = doc.list.cmds.filter((c) => c.text).map((c) => c.text).join(" ");
  assert.match(texts, /KOODISAMPO TERMINAL/);
  assert.ok(app.hitV.length === 4, "four tappable choices");
  const y = (app.hitY0[2] + app.hitY1[2]) / 2;
  app.tap(100, y);
  assert.equal(app.phaseIndex(), 2, "tap answered");

  // Kapea ruutu: rivit vierivät eivätkä valu ruudun alle.
  app.setViewport(360, 520, true);
  runUntilDone(app);
  const small = JSON.parse(app.render());
  const maxY = Math.max(...small.list.cmds.filter((c) => c.text).map((c) => c.y + (c.h || 0)));
  assert.ok(maxY <= 520 + 1, "content fits the screen: " + maxY);
}

// Opiskelumateriaali: alapalkin linkki ja vastauksen jälkeinen oppituntilinkki.
{
  const app = makeApp();
  runUntilDone(app);
  JSON.parse(app.render());
  assert.equal(app.linkUrl.length, 1, "footer study link");
  const fx = (app.linkX0[0] + app.linkX1[0]) / 2;
  const fy = (app.linkY0[0] + app.linkY1[0]) / 2;
  assert.ok(app.linkAt(fx, fy));
  app.tap(fx, fy);
  assert.equal(app.takeOpenUrl(), "https://example.test/opiskelu/docs/intro/");
  assert.equal(app.takeOpenUrl(), "", "url is handed out once");
  app.keyDown("o");
  assert.equal(app.takeOpenUrl(), "https://example.test/opiskelu/docs/intro/");

  app.keyDown("Enter");
  runUntilDone(app);
  app.keyDown("l");
  assert.equal(app.takeOpenUrl(), "", "no lesson link before answering");
  app.keyDown("1");
  runUntilDone(app);
  const q = app.questions[app.qIndex];
  assert.match(q.lessonUrl, /^https:\/\/example\.test\/opiskelu\/docs\/topics\/rust\/#rust-/);
  assert.match(app.screenText(), /LUE OPPITUNTI JA SELITYS/);
  const doc = JSON.parse(app.render());
  assert.equal(app.linkUrl.length, 2, "lesson link on screen");
  const lx = (app.linkX0[1] + app.linkX1[1]) / 2;
  const ly = (app.linkY0[1] + app.linkY1[1]) / 2;
  app.tap(lx, ly);
  assert.equal(app.takeOpenUrl(), q.lessonUrl);
  assert.equal(app.phaseIndex(), 2, "tapping the link does not advance");
  app.keyDown("L");
  assert.equal(app.takeOpenUrl(), q.lessonUrl);
  // Alleviivaus: linkkitekstin alla on tekstin levyinen viiva.
  const run = doc.list.cmds.find((c) => c.text && c.text.startsWith("LUE OPPITUNTI"));
  const line = doc.list.cmds.find((c) => !c.text && c.h === 2 && Math.abs(c.x - run.x) < 1 && c.y >= run.y && c.y < run.y + 60);
  assert.ok(line, "underline under the lesson link");
  assert.ok(line.w < 700, "underline is text-wide, not full-width: " + line.w);
}

console.log("terminal_quiz.test.mjs OK");
