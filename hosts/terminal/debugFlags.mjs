/**
 * Debug-ominaisuudet — pois tuotantopelistä.
 * Web-debug (play:web): hahmolista päällä.
 * Terminaali: vain kun KOODISAMPO_DEBUG=1
 */
export function castListEnabledForTerminal() {
  const v = process.env.KOODISAMPO_DEBUG;
  return v === "1" || v === "true";
}

export function castListEnabledForWeb() {
  return true;
}
