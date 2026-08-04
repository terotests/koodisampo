/**
 * Standalone question drill — no map / GameSession required.
 * Uses the same question banks and oppitunti links as in-game quizzes.
 */
import { listAllQuestions } from "../../hosts/terminal/encounterQuestions.mjs";
import { shuffleChoices } from "../../hosts/terminal/shuffleChoices.mjs";
import {
  DOMAIN_LABELS,
  lessonUrl,
  STUDY_SITE_ORIGIN,
  STUDY_SITE_PATH,
} from "../../hosts/shared/studyLessonLinks.mjs";
import { specialtyLabel } from "../../hosts/shared/playerSpecialty.mjs";
import {
  filterTrainQuestions,
  pickNextTrainQuestion,
} from "../../hosts/shared/questionTrainerCore.mjs";

export { filterTrainQuestions, pickNextTrainQuestion };

export type TrainQuestion = {
  id: string;
  prompt: string;
  domain?: string;
  chapter?: string;
  bankId?: string;
  difficulty?: number;
  correctFeedback?: string;
  wrongFeedback?: string;
  studyNotes?: string;
  sourceUrl?: string;
  sourceRef?: string;
  choices: Array<{ text: string; correct?: boolean }>;
};

type ShuffledChoice = { n: number; text: string; correct: boolean };

type TrainerStats = { answered: number; correct: number };

type TrainerRound = {
  question: TrainQuestion;
  choices: ShuffledChoice[];
  selectedN: number | null;
  revealed: boolean;
};

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function domainLabel(domain: string): string {
  return (DOMAIN_LABELS as Record<string, string>)[domain] || domain || "yleinen";
}

function filterQuestions(specialty: string, kidsMode: boolean, allTopics: boolean): TrainQuestion[] {
  return filterTrainQuestions(listAllQuestions() as TrainQuestion[], specialty, kidsMode, allTopics);
}

function buildRound(question: TrainQuestion): TrainerRound {
  const shuffled = shuffleChoices(question.choices || [], `train:${question.id}:${Date.now()}`);
  const choices: ShuffledChoice[] = shuffled.map((c: { text: string; correct?: boolean }, i: number) => ({
    n: i + 1,
    text: c.text,
    correct: !!c.correct,
  }));
  return { question, choices, selectedN: null, revealed: false };
}

function explanationLinksHtml(question: TrainQuestion): string {
  const lesson = lessonUrl(question, { origin: STUDY_SITE_ORIGIN });
  const studyHub = `${STUDY_SITE_ORIGIN}${STUDY_SITE_PATH}/docs/intro/`;
  const domain = question.domain || "";
  const domainPage = domain
    ? `${STUDY_SITE_ORIGIN}${STUDY_SITE_PATH}/docs/topics/${encodeURIComponent(domain)}/`
    : "";
  let html = `<div class="train-links">`;
  if (lesson) {
    html += `<a href="${esc(lesson)}" target="_blank" rel="noopener">📖 Lue oppitunti / selitys</a>`;
  }
  if (domainPage) {
    html += `<a href="${esc(domainPage)}" target="_blank" rel="noopener">📚 ${esc(domainLabel(domain))} — kaikki aiheet</a>`;
  }
  html += `<a href="${esc(studyHub)}" target="_blank" rel="noopener">🏠 Opiskelumateriaali</a>`;
  if (question.sourceUrl) {
    html += `<a href="${esc(question.sourceUrl)}" target="_blank" rel="noopener">🔗 Lähde${question.sourceRef ? `: ${esc(question.sourceRef)}` : ""}</a>`;
  }
  html += `</div>`;
  return html;
}

export type QuestionTrainerOptions = {
  getSpecialty: () => string;
  getKidsMode: () => boolean;
  onClose: () => void;
};

export function mountQuestionTrainer(opts: QuestionTrainerOptions) {
  const root = document.getElementById("question-trainer");
  const bodyEl = document.getElementById("question-trainer-body");
  const metaEl = document.getElementById("question-trainer-meta");
  const closeBtn = document.getElementById("question-trainer-close");
  const allTopicsEl = document.getElementById("question-trainer-all-topics") as HTMLInputElement | null;

  if (!root || !bodyEl) {
    return {
      open() {},
      close() {},
      isOpen() {
        return false;
      },
    };
  }

  let stats: TrainerStats = { answered: 0, correct: 0 };
  let recentIds: string[] = [];
  let round: TrainerRound | null = null;
  let open = false;

  function setOpen(next: boolean) {
    open = next;
    root.hidden = !next;
  }

  function renderMeta() {
    if (!metaEl) return;
    const specialty = opts.getSpecialty();
    const kids = opts.getKidsMode();
    const allTopics = !!allTopicsEl?.checked;
    const topic =
      kids ? "helppokysymykset" : allTopics || !specialty ? "kaikki aiheet" : specialtyLabel(specialty);
    metaEl.innerHTML =
      `Oikein ${stats.correct}/${stats.answered}` +
      ` · <span class="train-topic">${esc(topic)}</span>`;
  }

  function render() {
    renderMeta();
    if (!round) {
      bodyEl.innerHTML = `<p class="train-empty">Ei kysymyksiä valitulla suodattimella. Vaihda erikoisosaamista tai valitse kaikki aiheet.</p>`;
      return;
    }

    const q = round.question;
    const domain = domainLabel(q.domain || "");
    let html = "";
    html += `<div class="train-q-meta">${esc(domain)} · vaikeus ${esc(q.difficulty ?? "—")} · <code>${esc(q.id)}</code></div>`;
    html += `<div class="train-prompt">${esc(q.prompt)}</div>`;
    html += `<div class="train-choices">`;
    for (const c of round.choices) {
      let cls = "train-choice";
      if (round.revealed) {
        if (c.correct) cls += " train-choice-correct";
        else if (round.selectedN === c.n) cls += " train-choice-wrong";
        else cls += " train-choice-dimmed";
      }
      const disabled = round.revealed ? " disabled" : "";
      html += `<button type="button" class="${cls}" data-train-choice="${c.n}"${disabled}>`;
      html += `<span class="choice-num">[${c.n}]</span> ${esc(c.text)}`;
      html += `</button>`;
    }
    html += `</div>`;

    if (round.revealed && round.selectedN != null) {
      const selected = round.choices.find((c) => c.n === round!.selectedN);
      const ok = !!selected?.correct;
      const teaching = ok
        ? q.correctFeedback || "Oikein!"
        : q.wrongFeedback || q.correctFeedback || "Väärin.";
      html += `<div class="train-feedback ${ok ? "ok" : "bad"}">${ok ? "✓ Oikein" : "✗ Väärin"}</div>`;
      html += `<div class="train-teaching"><h4>── Selitys ──</h4>${esc(teaching)}</div>`;
      if (q.studyNotes) {
        html += `<div class="train-teaching train-notes">${esc(q.studyNotes)}</div>`;
      }
      html += explanationLinksHtml(q);
      html += `<button type="button" class="train-next" id="question-trainer-next">Seuraava kysymys →</button>`;
    }

    bodyEl.innerHTML = html;
  }

  function startRound() {
    const pool = filterQuestions(
      opts.getSpecialty(),
      opts.getKidsMode(),
      !!allTopicsEl?.checked,
    );
    const q = pickNextTrainQuestion(pool, recentIds);
    round = q ? buildRound(q) : null;
    if (q) recentIds = [...recentIds, q.id].slice(-40);
    render();
  }

  function answer(n: number) {
    if (!round || round.revealed) return;
    const choice = round.choices.find((c) => c.n === n);
    if (!choice) return;
    round.selectedN = n;
    round.revealed = true;
    stats.answered += 1;
    if (choice.correct) stats.correct += 1;
    render();
  }

  function openTrainer() {
    stats = { answered: 0, correct: 0 };
    recentIds = [];
    setOpen(true);
    startRound();
  }

  function closeTrainer() {
    setOpen(false);
    round = null;
    bodyEl.innerHTML = "";
    opts.onClose();
  }

  closeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    closeTrainer();
  });

  allTopicsEl?.addEventListener("change", () => {
    if (!open) return;
    stats = { answered: 0, correct: 0 };
    recentIds = [];
    startRound();
  });

  bodyEl.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const choiceBtn = target.closest<HTMLElement>("[data-train-choice]");
    if (choiceBtn) {
      const n = Number(choiceBtn.getAttribute("data-train-choice"));
      if (n >= 1 && n <= 9) answer(n);
      return;
    }
    if (target.id === "question-trainer-next" || target.closest("#question-trainer-next")) {
      startRound();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeTrainer();
      return;
    }
    if (e.key === "Enter" && round?.revealed) {
      e.preventDefault();
      startRound();
      return;
    }
    if (round && !round.revealed && /^[1-9]$/.test(e.key)) {
      e.preventDefault();
      answer(Number(e.key));
    }
  });

  return {
    open: openTrainer,
    close: closeTrainer,
    isOpen: () => open,
  };
}
