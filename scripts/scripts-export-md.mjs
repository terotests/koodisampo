#!/usr/bin/env node
/**
 * Generoi markdown-koosteen kaikista npm-skripteistä ja niiden CLI-valinnoista.
 * Käyttö: node scripts/scripts-export-md.mjs [tiedosto]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, relative, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const outPath = resolve(
  __dirname,
  process.argv[2] || "../docs/scripts-reference.md",
);

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function parseScriptDoc(source) {
  const match = source.match(/^#!.*\n\/\*\*([\s\S]*?)\*\//m)
    || source.match(/^\/\*\*([\s\S]*?)\*\//m);
  if (!match) return null;

  const rawLines = match[1]
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, "").trimEnd());

  let description = [];
  const usage = [];
  let inUsage = false;

  for (const line of rawLines) {
    if (/^(Käyttö|Usage):/i.test(line)) {
      inUsage = true;
      const rest = line.replace(/^(Käyttö|Usage):\s*/i, "").trim();
      if (rest) usage.push(rest);
      continue;
    }
    if (inUsage) {
      if (!line) continue;
      usage.push(line);
      continue;
    }
    if (line) description.push(line);
  }

  const usageFallback = source.match(/console\.error\(\s*["'`]Usage:\s*([^"'`]+)["'`]/);
  if (!usage.length && usageFallback) {
    usage.push(usageFallback[1].trim());
  }

  return {
    description: description.join(" ").trim(),
    usage,
  };
}

function collectNodeScripts() {
  const byPath = new Map();

  function addFile(absPath) {
    const rel = relative(projectRoot, absPath).split("\\").join("/");
    if (byPath.has(rel)) return;
    const source = readFileSync(absPath, "utf8");
    if (!source.startsWith("#!/usr/bin/env node") && !rel.startsWith("scripts/")) return;
    const doc = parseScriptDoc(source);
    byPath.set(rel, {
      path: rel,
      ...(doc || { description: "", usage: [] }),
    });
  }

  for (const file of readdirSync(resolve(projectRoot, "scripts"))) {
    if (file.endsWith(".mjs")) addFile(resolve(projectRoot, "scripts", file));
  }

  function walkHosts(dir) {
    for (const entry of readdirSync(dir)) {
      const abs = join(dir, entry);
      const st = statSync(abs);
      if (st.isDirectory()) walkHosts(abs);
      else if (entry.endsWith(".mjs")) addFile(abs);
    }
  }
  walkHosts(resolve(projectRoot, "hosts"));

  return byPath;
}

function extractNodeTargets(command) {
  const targets = [];
  const re = /node\s+([^\s&;]+?\.mjs)/g;
  let m;
  while ((m = re.exec(command)) !== null) {
    targets.push(m[1]);
  }
  return targets;
}

function collectPackageScripts() {
  const packages = [{ name: "koodisampo", dir: projectRoot }];
  const rootPkg = readJson(resolve(projectRoot, "package.json"));
  for (const ws of rootPkg.workspaces || []) {
    packages.push({
      name: ws,
      dir: resolve(projectRoot, ws),
    });
  }

  const entries = [];
  for (const pkg of packages) {
    const pkgJsonPath = resolve(pkg.dir, "package.json");
    const pkgJson = readJson(pkgJsonPath);
    for (const [scriptName, command] of Object.entries(pkgJson.scripts || {})) {
      const npmCmd = pkg.name === "koodisampo"
        ? `npm run ${scriptName}`
        : `npm run ${scriptName} --workspace=${pkg.name}`;
      entries.push({
        package: pkg.name,
        scriptName,
        command,
        npmCmd,
        nodeTargets: extractNodeTargets(command),
      });
    }
  }
  return entries;
}

function toNpmExample(line, npmCmd) {
  const trimmed = line.trim();
  if (/^node\s+/i.test(trimmed)) {
    const args = trimmed.replace(/^node\s+\S+\s*/, "");
    return args ? `${npmCmd} -- ${args}` : npmCmd;
  }
  return trimmed;
}

function formatUsageBlock(usage, npmCmd) {
  if (!usage.length) return ["- **Valinnat:** (ei dokumentoituja CLI-valintoja)"];

  const lines = ["- **Valinnat:**"];
  for (const line of usage) {
    lines.push(`  - \`${toNpmExample(line, npmCmd)}\``);
  }
  const hasFlags = usage.some((line) => /--|\[|<|\*/.test(line));
  if (hasFlags) {
    lines.push(`- **Huom:** lisäargumentit välitetään npm:n kautta: \`${npmCmd} -- …\``);
  }
  return lines;
}

function groupScripts(entries) {
  const groups = new Map();
  for (const entry of entries) {
    const prefix = entry.scriptName.includes(":")
      ? entry.scriptName.split(":")[0]
      : entry.scriptName;
    if (!groups.has(prefix)) groups.set(prefix, []);
    groups.get(prefix).push(entry);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function main() {
  const nodeScripts = collectNodeScripts();
  const npmScripts = collectPackageScripts();
  const referenced = new Set();

  const lines = [];
  lines.push("# Koodisampo — npm-skriptit ja CLI-valinnat");
  lines.push("");
  lines.push(`Generoitu: \`npm run scripts:export\` · ${new Date().toISOString().slice(0, 10)}`);
  lines.push("");
  lines.push("Tämä tiedosto listaa `package.json`-skriptit ja niiden taustalla olevien Node-skriptien dokumentoidut valinnat.");
  lines.push("");

  const byPackage = new Map();
  for (const entry of npmScripts) {
    if (!byPackage.has(entry.package)) byPackage.set(entry.package, []);
    byPackage.get(entry.package).push(entry);
  }

  for (const [pkgName, entries] of [...byPackage.entries()].sort()) {
    lines.push(`## ${pkgName}`);
    lines.push("");

    for (const group of groupScripts(entries)) {
      const [, groupEntries] = group;
      if (groupEntries.length > 1 && groupEntries[0].scriptName.includes(":")) {
        lines.push(`### \`${groupEntries[0].scriptName.split(":")[0]}:*\``);
        lines.push("");
      }

      for (const entry of groupEntries.sort((a, b) => a.scriptName.localeCompare(b.scriptName))) {
        lines.push(`#### \`${entry.scriptName}\``);
        lines.push("");
        lines.push(`- **Komento:** \`${entry.npmCmd}\``);
        lines.push(`- **Tausta:** \`${entry.command}\``);

        const target = entry.nodeTargets[0];
        if (target) {
          referenced.add(target);
          const meta = nodeScripts.get(target);
          if (meta?.description) lines.push(`- **Kuvaus:** ${meta.description}`);
          lines.push(...formatUsageBlock(meta?.usage || [], entry.npmCmd));
        } else {
          lines.push("- **Valinnat:** (ei Node-CLI:tä — delegoi toiseen npm-skriptiin tai työkaluun)");
        }
        lines.push("");
      }
    }
  }

  const unreferenced = [...nodeScripts.values()]
    .filter((s) => !referenced.has(s.path) && !s.path.includes("choice-rewrite-utils"))
    .sort((a, b) => a.path.localeCompare(b.path));

  if (unreferenced.length) {
    lines.push("## Muut Node-skriptit (ei npm-skriptissä)");
    lines.push("");
    for (const meta of unreferenced) {
      lines.push(`### \`${meta.path}\``);
      lines.push("");
      if (meta.description) lines.push(meta.description);
      lines.push("");
      if (meta.usage.length) {
        for (const line of meta.usage) lines.push(`- \`${line}\``);
      } else {
        lines.push("- (ei dokumentoituja valintoja)");
      }
      lines.push("");
    }
  }

  writeFileSync(outPath, `${lines.join("\n")}\n`);
  console.log(`Wrote ${npmScripts.length} npm scripts (+${unreferenced.length} standalone) → ${outPath}`);
}

main();
