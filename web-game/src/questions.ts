type QuestionBank = {
  id?: string;
  domain?: string;
  source?: string;
  questions?: Array<Record<string, unknown>>;
};

const BANK_FILES = [
  "backend-ops.json",
  "cpp-best-practices.json",
  "docker-ops.json",
  "git-ci.json",
  "javascript-web.json",
  "linux-ops.json",
  "postgresql-tuning.json",
  "qt-dev.json",
  "robot-framework.json",
  "scrum-best-practices.json",
  "web-security.json",
];

function flattenBanks(banks: QuestionBank[]) {
  const all: Array<Record<string, unknown>> = [];
  for (const bank of banks) {
    const domain = bank.domain || bank.id?.split("-")[0] || "general";
    for (const q of bank.questions || []) {
      all.push({
        ...q,
        domain: (q as { domain?: string }).domain || domain,
        bankId: bank.id,
        bankSource: bank.source,
      });
    }
  }
  return all;
}

/** Load question banks from static assets (GitHub Pages / Vite public/). */
export async function loadAllQuestionsFromPublic(baseUrl: string) {
  const banks = await Promise.all(
    BANK_FILES.map(async (file) => {
      const res = await fetch(`${baseUrl}content/question-banks/${file}`);
      if (!res.ok) {
        throw new Error(`Kysymyspankin lataus epäonnistui: ${file}`);
      }
      return (await res.json()) as QuestionBank;
    }),
  );
  return flattenBanks(banks);
}
