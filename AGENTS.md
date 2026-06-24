# Agent instructions — Koodisampo

This file is for **cloud agents and automated dev environments** that do not have a sibling `../agent/Ranger` checkout.

## Quick start

```bash
npm install
npm run build:ranger    # compile .rgr → generated/es6/koodisampo.cjs
npm run test:engine     # headless game logic tests
npm run dev             # web game at http://localhost:5173
```

No local Ranger repository is required. The compiler comes from npm:

- **Package:** [`ranger-compiler`](https://www.npmjs.com/package/ranger-compiler)
- **CLI binary:** `rgrc` / `ranger-compiler` → `node_modules/ranger-compiler/dist/rgrc.js`

## When you change `.rgr` files

Game logic lives under `lib/game/ranger/**/*.rgr`. Entry point: `lib/game/KoodisampoLib.rgr`.

After any `.rgr` edit:

```bash
npm run build:ranger
```

This writes **`generated/es6/koodisampo.cjs`**. Commit that file with your `.rgr` changes so CI and GitHub Pages work without compiling Ranger.

### What `build:ranger` does

`scripts/build-ranger.mjs` runs:

```bash
node node_modules/ranger-compiler/dist/rgrc.js \
  -es6 -nodemodule \
  lib/game/KoodisampoLib.rgr \
  -d=./generated/es6 \
  -o=koodisampo.cjs
```

with `RANGER_LIB` pointing at `node_modules/ranger-compiler/dist/Lang.rgr` and `dist/lib/`.

**Fallback:** if `ranger-compiler` is missing but `../agent/Ranger/bin/output.js` exists (local monorepo), the script uses the sibling checkout instead.

## Project layout

| Path | Role |
|------|------|
| `lib/game/ranger/` | Ranger source — game rules, map, encounters |
| `generated/es6/koodisampo.cjs` | Compiled runtime (committed; hosts import this) |
| `hosts/` | Thin Node hosts (terminal, web controller) |
| `web-game/` | Static Vite UI for browser / GitHub Pages |
| `content/` | Worlds, stories, question banks (JSON) |
| `test/` | Headless tests (import `koodisampo.cjs`) |

## Common commands

| Command | Purpose |
|---------|---------|
| `npm run build:ranger` | Compile Ranger → `generated/es6/koodisampo.cjs` |
| `npm run test:engine` | Rebuild + run all engine tests |
| `npm run play` | Terminal game (TTY) |
| `npm run play:web` | Local web debug host |
| `npm run dev` | Vite dev server (`web-game/`) |
| `npm run build` | Production static build (uses committed `.cjs`, syncs to `web-game/public/`) |

## CI / GitHub Pages

Workflow `.github/workflows/pages.yml` runs `npm ci && npm run build` only. It does **not** compile Ranger — it relies on the committed `generated/es6/koodisampo.cjs`. If you change `.rgr` files in a PR, you **must** run `npm run build:ranger` and commit the updated `.cjs`.

## Architecture rules

- **Game logic in Ranger** (`.rgr`), not in hosts or `web-game/src` business logic.
- **Hosts are thin:** render UI, forward keys to `GameSession`, persist save data.
- **Web UI** (`web-game/src/ui.ts`) is presentation only — map rendering, mobile layout, key forwarding.

## Ranger compiler version

Pinned in root `package.json` devDependency `ranger-compiler`. Bump there when a new compiler is published:

```bash
npm install -D ranger-compiler@latest
npm run build:ranger
npm run test:engine
```

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Ranger compiler not found` | Run `npm install` |
| `[FAIL] Compilation FAILED` | Read compiler output; fix syntax/types in `.rgr` |
| `Undefined variable` in compile | Missing import or typo in Ranger source |
| Tests fail after `.rgr` change | Re-run `npm run build:ranger` |

## Local monorepo (optional)

Developers with `proj/agent/Ranger` next to `proj/koodisampo` can use `npm run compile` in Ranger instead of npm. The build script prefers npm when installed, then falls back to the sibling checkout.
