/** Jaettu logiikka valintojen pituusvinouman mittaamiseen. */

export function choiceLengths(choices) {
  return (choices || []).map((c) => (c.text || "").length);
}

export function choiceBiasMetrics(choices) {
  const ch = choices || [];
  if (ch.length < 2) {
    return { biased: false, correctIndex: -1, correctLen: 0, avgWrongLen: 0, ratio: 1, correctIsLongest: false };
  }

  const correctIndex = ch.findIndex((c) => c.correct);
  if (correctIndex < 0) {
    return { biased: false, correctIndex: -1, correctLen: 0, avgWrongLen: 0, ratio: 1, correctIsLongest: false };
  }

  const lens = choiceLengths(ch);
  const correctLen = lens[correctIndex];
  const wrongLens = ch.filter((c) => !c.correct).map((c) => c.text.length);
  const avgWrongLen = wrongLens.reduce((a, b) => a + b, 0) / wrongLens.length;
  const maxLen = Math.max(...lens);
  const minLen = Math.min(...lens);
  const ratio = avgWrongLen > 0 ? correctLen / avgWrongLen : 1;
  const correctIsLongest = correctLen === maxLen;
  const spread = maxLen - minLen;

  // Vinoutunut jos oikea selvästi pidempi tai ainoa selvä poikkeus pituudessa.
  const biased =
    correctIsLongest &&
    (ratio >= 1.25 || spread >= 18 || correctLen >= avgWrongLen + 12);

  return {
    biased,
    correctIndex,
    correctLen,
    avgWrongLen,
    ratio: Math.round(ratio * 100) / 100,
    correctIsLongest,
    spread,
    lens,
  };
}

export function validateRewrittenChoices(choices) {
  const errors = [];
  if (!Array.isArray(choices) || choices.length < 2) {
    errors.push("need >= 2 choices");
    return errors;
  }

  const correct = choices.filter((c) => c.correct);
  if (correct.length !== 1) errors.push(`need exactly 1 correct (has ${correct.length})`);

  for (const c of choices) {
    if (!c.text?.trim()) errors.push("empty choice text");
  }

  const metrics = choiceBiasMetrics(choices);
  if (metrics.ratio >= 1.35 && metrics.correctIsLongest) {
    errors.push(`still length-biased (ratio ${metrics.ratio})`);
  }

  const lens = choiceLengths(choices);
  const sorted = [...lens].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const correctLen = lens[choices.findIndex((c) => c.correct)];
  if (median > 0 && correctLen > median * 1.4 && correctLen === Math.max(...lens)) {
    errors.push("correct still longest by wide margin");
  }

  return errors;
}
