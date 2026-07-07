let lastSpokenKey = "";

export function isTtsAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function stopSpeech(): void {
  if (!isTtsAvailable()) return;
  window.speechSynthesis.cancel();
  lastSpokenKey = "";
}

export function speakFinnish(text: string, key = "", rate = 0.92): void {
  const trimmed = text.trim();
  if (!trimmed || !isTtsAvailable()) return;
  const dedupeKey = key || trimmed;
  if (dedupeKey === lastSpokenKey) return;
  lastSpokenKey = dedupeKey;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(trimmed);
  utterance.lang = "fi-FI";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

export function speakQuizPrompt(prompt: string, entityId: string, questionKey: string): void {
  speakFinnish(prompt, `quiz:${entityId}:${questionKey}`);
}
