#!/usr/bin/env node
/** Korvaa Docusaurus-etusivu staattisella uudelleenohjauksella (GitHub Pages -alikansio). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(__dirname, "../study/build/index.html");

const html = `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url=docs/intro/">
  <link rel="canonical" href="docs/intro/">
  <title>Koodisampo — opiskelumateriaali</title>
  <script>location.replace("docs/intro/");</script>
</head>
<body>
  <p><a href="docs/intro/">Koodisampo — opiskelumateriaali</a></p>
</body>
</html>
`;

if (!fs.existsSync(path.dirname(indexPath))) {
  console.error("Missing study build:", path.dirname(indexPath));
  process.exit(1);
}

fs.writeFileSync(indexPath, html);
console.log("study-postbuild: static redirect index.html → docs/intro/");
