/**
 * Selain-E2E: profiililomake näkyy ja "Aloita peli" siirtää kartanäkymään.
 *
 * Vaatii käynnissä olevan dev-palvelimen:
 *   cd web-game && npm run dev -- --port 5180
 *
 * Aja:
 *   PROFILE_TEST_URL=http://localhost:5180/koodisampo/ node test/profile_view_browser.test.mjs
 */
import { chromium } from "playwright";
import { assert } from "./support/gameTestHarness.mjs";

const BASE_URL = process.env.PROFILE_TEST_URL ?? "http://localhost:5180/koodisampo/";

async function clearIndexedDb(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase("koodisampo-web-game");
      req.onsuccess = () => resolve(undefined);
      req.onerror = () => reject(req.error);
      req.onblocked = () => resolve(undefined);
    });
  });
}

async function waitForProfileSetup(page, timeoutMs = 20000) {
  await page.waitForFunction(() => {
    const el = document.getElementById("profile-setup");
    return el && !el.hidden;
  }, { timeout: timeoutMs });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  try {
    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 });
    await clearIndexedDb(page);
    await page.reload({ waitUntil: "networkidle", timeout: 30000 });

    await waitForProfileSetup(page);
    assert(await page.locator("#profile-setup").isVisible(), "profile overlay should be visible");

    const title = await page.locator("#profile-setup h2").textContent();
    assert(title?.includes("Tervetuloa"), `expected welcome title, got: ${title}`);

    const optionCount = await page.locator("#profile-specialty option").count();
    assert(optionCount > 0, "specialty select should have options");

    await page.fill("#profile-name", "Pekka");
    assert((await page.inputValue("#profile-name")) === "Pekka", "name input should retain value");

    await page.click("#profile-start-btn");
    await page.waitForFunction(() => {
      const el = document.getElementById("profile-setup");
      return el?.hidden === true;
    }, { timeout: 5000 });

    const errorText = (await page.locator("#profile-setup-error").textContent())?.trim() ?? "";
    assert(!errorText, `profile error should be empty, got: ${errorText}`);

    await page.waitForSelector("[data-map-grid]", { timeout: 5000 });
    const gridCells = await page.locator("[data-map-grid] .map-cell, [data-map-grid] button").count();
    assert(gridCells > 0, "map grid should render after profile submit");

    assert(pageErrors.length === 0, `page errors: ${pageErrors.join(" | ")}`);

    console.log("profile_view_browser.test.mjs OK");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
