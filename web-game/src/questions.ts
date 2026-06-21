type QuestionBank = {
  id?: string;
  domain?: string;
  source?: string;
  questions?: Array<Record<string, unknown>>;
};

const bankModules = import.meta.glob("../../../content/question-banks/*.json", {
  eager: true,
  import: "default",
}) as Record<string, QuestionBank>;

export function loadAllQuestionsFromBundle() {
  const all: Array<Record<string, unknown>> = [];
  for (const bank of Object.values(bankModules)) {
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
