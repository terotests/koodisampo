import { resolveQuestionVersions } from "../../hosts/shared/questionVersions.mjs";

type QuestionBank = {
  id?: string;
  domain?: string;
  source?: string;
  defaultVersions?: string[];
  questions?: Array<Record<string, unknown>>;
};

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
        versions: resolveQuestionVersions(q, bank),
      });
    }
  }
  return all;
}

async function loadBankManifest(baseUrl: string): Promise<string[]> {
  const res = await fetch(`${baseUrl}content/question-banks/manifest.json`);
  if (!res.ok) {
    throw new Error("Kysymyspankkien manifestin lataus epäonnistui");
  }
  const files = (await res.json()) as string[];
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error("Kysymyspankkien manifest on tyhjä");
  }
  return files;
}

/** Load question banks from static assets (GitHub Pages / Vite public/). */
export async function loadAllQuestionsFromPublic(baseUrl: string) {
  const bankFiles = await loadBankManifest(baseUrl);
  const banks = await Promise.all(
    bankFiles.map(async (file) => {
      const res = await fetch(`${baseUrl}content/question-banks/${file}`);
      if (!res.ok) {
        throw new Error(`Kysymyspankin lataus epäonnistui: ${file}`);
      }
      return (await res.json()) as QuestionBank;
    }),
  );
  return flattenBanks(banks);
}
