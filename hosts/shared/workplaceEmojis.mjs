import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Työpaikka-aiheiset emoji-hahmot — lähde: lib/map/workplace-emojis.json */
export const WORKPLACE_EMOJI_BRUSHES = JSON.parse(
  readFileSync(join(__dirname, "../../lib/map/workplace-emojis.json"), "utf8"),
);
