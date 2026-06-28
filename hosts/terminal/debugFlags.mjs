/**
 * Debug-ominaisuudet — pois tuotantopelistä.
 * Web-game dev (?debug=1): hahmolista päällä.
 * Terminaali: vain kun KOODISAMPO_DEBUG=1
 */
export function castListEnabledForTerminal() {
  const v = process.env.KOODISAMPO_DEBUG;
  return v === "1" || v === "true";
}

export function castListEnabledForWeb() {
  return true;
}
