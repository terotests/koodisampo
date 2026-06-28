/**
 * ESM wrapper for the Ranger CJS bundle.
 * Do not alias imports directly to public/vendor — Vite serves public/ as static files
 * and named ESM imports from CJS fail there.
 */
// @ts-expect-error generated Ranger CJS bundle
import ranger from "../../generated/es6/koodisampo.cjs";

export const KoodisampoAppRoot = ranger.KoodisampoAppRoot;
export const ProcessRuntime = ranger.ProcessRuntime;
export const StoryCatalog = ranger.StoryCatalog;
export const GameSession = ranger.GameSession;
export const WorldMap = ranger.WorldMap;

export default ranger;
