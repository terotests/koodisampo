import assert from "node:assert/strict";
import { shuffleChoices } from "../hosts/terminal/shuffleChoices.mjs";

const sample = [
  { text: "oikein", correct: true },
  { text: "väärin 1", correct: false },
  { text: "väärin 2", correct: false },
  { text: "väärin 3", correct: false },
];

let atZero = 0;
const trials = 200;
for (let i = 0; i < trials; i += 1) {
  const shuffled = shuffleChoices(sample, `trial-${i}`);
  assert.equal(shuffled.length, 4, "säilyttää vaihtoehtojen määrän");
  assert.equal(shuffled.filter((c) => c.correct).length, 1, "yksi oikea");
  if (shuffled[0].correct) atZero += 1;
}

assert(atZero < trials * 0.55, `oikea ei saa jäädä usein ykköseksi (oli ${atZero}/${trials})`);

const stable = shuffleChoices(sample, "same-seed");
const stable2 = shuffleChoices(sample, "same-seed");
assert.deepEqual(
  stable.map((c) => c.text),
  stable2.map((c) => c.text),
  "sama seed → sama järjestys",
);

const different = shuffleChoices(sample, "other-seed");
const sameOrder =
  stable.map((c) => c.text).join("|") === different.map((c) => c.text).join("|");
assert(!sameOrder || sample.length < 2, "eri seed voi antaa eri järjestyksen");

console.log("shuffle_choices.test.mjs OK");
