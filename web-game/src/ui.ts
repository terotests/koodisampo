import type { WebGame } from "./boot";
import { mountElevatorToolbar } from "../../hosts/shared/elevatorToolbarDom.mjs";
import { PLAYER_SPECIALTY_OPTIONS } from "../../hosts/shared/playerSpecialty.mjs";
import {
  lessonUrlForBacklogEntry,
  STUDY_SITE_ORIGIN,
} from "../../hosts/shared/studyLessonLinks.mjs";
import {
  clearMobileElevator,
  initMobileLayoutOptions,
  isMobileLayout,
  mountMobileControls,
  renderHudStats,
  formatSalary,
  renderMessageBar,
  renderActionBar,
  resetMobileControlsMount,
  setMobileDpadVisible,
  setMobilePlayView,
  setMobileTextChoiceMode,
  setMobileToolbar,
  setMobileToolbarVisible,
  syncMobileClass,
  updateMobileMapToolbar,
  viewportWidth,
  watchViewportLayout,
} from "./mobileLayout";
import { setText } from "./render/domPatch";
import { patchIsometricGrid } from "./render/isometricCanvas";
import { speakQuizPrompt, stopSpeech } from "./tts";
import { mountMapZoomControls, syncMapZoomControls } from "./render/mapZoomControls";
import { clearMapView, ensureMapShell, setScrollContent } from "./render/viewRoot";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
 type State = any;

export function mountGameUI(game: WebGame) {
  const mapEl = document.getElementById("map");
  const jsonEl = document.getElementById("json");
  const metaEl = document.getElementById("meta");
  const statusEl = document.getElementById("status");
  const toolbarEl = document.getElementById("toolbar");
  const hintEl = document.getElementById("hint");
  const hudStatsEl = document.getElementById("hud-stats");
  const messageBarEl = document.getElementById("message-bar");
  const actionBarEl = document.getElementById("action-bar");
  const mobileDpadEl = document.getElementById("mobile-dpad");
  const debugToggleEl = document.getElementById("debug-json-toggle");
  const profileSetupEl = document.getElementById("profile-setup");
  const profileNameEl = document.getElementById("profile-name") as HTMLInputElement | null;
  const profileSpecialtyEl = document.getElementById("profile-specialty") as HTMLSelectElement | null;
  const profileKidsModeEl = document.getElementById("profile-kids-mode") as HTMLInputElement | null;
  const profileFormEl = document.getElementById("profile-setup-form");
  const profileStartBtn = document.getElementById("profile-start-btn");
  const profileErrorEl = document.getElementById("profile-setup-error");
  let lastMobileMapLines: string[] = [];
  let showDebugJson = new URLSearchParams(window.location.search).has("debug");
  let showRelationsDebug = false;
  const DEBUG_UNLOCK = "debug";
  let debugUnlockBuffer = "";
  let debugUnlockTimer = 0;

  function feedDebugUnlock(key: string): "toggled" | "swallow" | null {
    if (key.length !== 1 || !/^[a-z]$/.test(key)) {
      debugUnlockBuffer = "";
      return null;
    }
    debugUnlockBuffer = (debugUnlockBuffer + key).slice(-DEBUG_UNLOCK.length);
    if (debugUnlockBuffer === DEBUG_UNLOCK) {
      debugUnlockBuffer = "";
      window.clearTimeout(debugUnlockTimer);
      return "toggled";
    }
    if (DEBUG_UNLOCK.startsWith(debugUnlockBuffer)) {
      window.clearTimeout(debugUnlockTimer);
      debugUnlockTimer = window.setTimeout(() => {
        debugUnlockBuffer = "";
      }, 2000);
      return "swallow";
    }
    debugUnlockBuffer = "";
    return null;
  }

  function syncDebugJsonPanel() {
    document.body.classList.toggle("show-debug-json", showDebugJson);
    if (debugToggleEl) {
      debugToggleEl.textContent = showDebugJson ? "Piilota JSON" : "Näytä JSON";
    }
    if (!showDebugJson && jsonEl) {
      jsonEl.textContent = "";
    }
  }

  syncDebugJsonPanel();
  debugToggleEl?.addEventListener("click", () => {
    showDebugJson = !showDebugJson;
    syncDebugJsonPanel();
    lastRenderKey = "";
    render(game.snapshot());
  });

  initMobileLayoutOptions();
  syncMobileClass();

    const BANNER = `╔══════════════════════════════════════════════════╗
║  KOODISAMPO — Corporate NetHack (terminaali)   ║
║  Selviydy toimistosta. Opiskele C++:ää.        ║
╚══════════════════════════════════════════════════╝`;

    function sendKey(key: string) {
      if (needsProfileSetup(game.snapshot())) return;
      game.handleKey(key);
      lastRenderKey = "";
      render(game.snapshot());
    }

    let copyStatusTimeout = 0;
    let lastRenderKey = "";
    let currentStudyListText = "";

    function needsProfileSetup(state: State): boolean {
      if (typeof state.needsProfileSetup === "boolean") return state.needsProfileSetup;
      if (!state.profileComplete) return true;
      return !String(state.playerDisplayName ?? "").trim();
    }

    function isEditableGameTarget(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      if (target.id === "codeInput") return false;
      if (profileFormEl?.contains(target) && target.closest("input, textarea, select, button")) {
        return true;
      }
      const tag = target.tagName;
      return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON" || target.isContentEditable;
    }

    function showProfileSetupError(message: string) {
      if (!profileErrorEl) return;
      profileErrorEl.textContent = message;
      profileErrorEl.hidden = false;
    }

    function clearProfileSetupError() {
      if (!profileErrorEl) return;
      profileErrorEl.textContent = "";
      profileErrorEl.hidden = true;
    }

    function commitProfileSetup(): boolean {
      if (!profileFormEl || !profileNameEl) return false;
      const name = profileNameEl.value.trim();
      const specialty = profileSpecialtyEl?.value ?? "cpp";
      const kidsMode = !!profileKidsModeEl?.checked;
      if (!name) {
        showProfileSetupError("Anna nimesi.");
        profileNameEl.focus();
        return false;
      }
      if (typeof game.setPlayerProfile !== "function") {
        showProfileSetupError("Pelin profiilikäsittelijä puuttuu.");
        return false;
      }
      let ok = false;
      try {
        ok = game.setPlayerProfile(name, specialty, kidsMode) === true;
      } catch (err) {
        console.error("Profiilin tallennus epäonnistui:", err);
        ok = false;
      }
      if (!ok) {
        showProfileSetupError("Profiilin tallennus epäonnistui. Päivitä sivu (Cmd+Shift+R).");
        return false;
      }
      clearProfileSetupError();
      profileFormDirty = false;
      profileFormSeeded = false;
      if (profileSetupEl) profileSetupEl.hidden = true;
      lastRenderKey = "";
      render(game.snapshot());
      return true;
    }

    function isProfileFormFocused(): boolean {
      const active = document.activeElement;
      return !!(active instanceof HTMLElement && profileSetupEl?.contains(active));
    }

    let profileFormSeeded = false;
    let profileFormDirty = false;
    let lastQuizSpeechKey = "";

    function syncProfileSetupVisible(state: State) {
      if (!profileSetupEl) return;
      const show = needsProfileSetup(state);
      profileSetupEl.hidden = !show;
      if (!show) {
        profileFormSeeded = false;
        profileFormDirty = false;
      }
    }

    function applyProfileSetupChrome(state: State) {
      const needsSetup = needsProfileSetup(state);
      setMobilePlayView(false);
      setMobileDpadVisible(mobileDpadEl, false);
      setMobileToolbarVisible(toolbarEl, !needsSetup);
    }

    function seedProfileFormOnce(state: State) {
      if (profileFormSeeded || profileFormDirty || isProfileFormFocused()) return;
      if (profileNameEl && !profileNameEl.value && state.playerDisplayName) {
        profileNameEl.value = state.playerDisplayName;
      }
      if (profileSpecialtyEl) {
        if (state.playerSpecialty) {
          profileSpecialtyEl.value = state.playerSpecialty;
        } else if (!profileSpecialtyEl.value) {
          profileSpecialtyEl.value = "cpp";
        }
      }
      if (profileKidsModeEl && !profileFormDirty) {
        profileKidsModeEl.checked = !!state.kidsMode;
      }
      profileFormSeeded = true;
    }

    const STUDY_LIST_HINT = "Kopioi = leikepöydälle | b / Enter = takaisin | q = lopeta";

    async function copyStudyListToClipboard(text: string) {
      if (!text.trim()) {
        showCopyStatus("Opiskelulista on tyhjä.");
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        showCopyStatus("Kopioitu leikepöydälle.");
        return;
      } catch {
        // fallback vanhemmille selaimille / ilman clipboard-lupaa
      }
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        if (document.execCommand("copy")) {
          showCopyStatus("Kopioitu leikepöydälle.");
        } else {
          showCopyStatus("Kopiointi epäonnistui.");
        }
      } catch {
        showCopyStatus("Kopiointi epäonnistui.");
      }
      document.body.removeChild(ta);
    }

    function showCopyStatus(msg: string) {
      if (!hintEl) return;
      hintEl.textContent = msg;
      window.clearTimeout(copyStatusTimeout);
      copyStatusTimeout = window.setTimeout(() => {
        if (game.snapshot().screen === "studylist") {
          hintEl.textContent = STUDY_LIST_HINT;
        }
      }, 2500);
    }

    async function resetGame() {
      if (game.reloadWorldFromSource) {
        await game.reloadWorldFromSource();
      }
      game.reset(false);
      profileFormSeeded = false;
      profileFormDirty = false;
      if (profileNameEl) profileNameEl.value = "";
      if (profileSpecialtyEl) profileSpecialtyEl.value = "cpp";
      if (profileKidsModeEl) profileKidsModeEl.checked = false;
      lastRenderKey = "";
      render(game.snapshot());
    }

    function sendCode(answer: string) {
      game.handleStoryCode(answer);
      lastRenderKey = "";
      render(game.snapshot());
    }

    function esc(s) {
      return String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function formatStudyEntryDate(ts: number) {
      try {
        return new Date(ts).toISOString().slice(0, 10);
      } catch {
        return "?";
      }
    }

    function renderStudyListEntry(entry: {
      questionId?: string;
      prompt?: string;
      domain?: string;
      chapter?: string;
      entityName?: string;
      at?: number;
    }, index: number) {
      const tag = [entry.domain, entry.chapter].filter(Boolean).join("/") || "yleinen";
      const who = entry.entityName ? ` (${entry.entityName})` : "";
      const lessonUrl = entry.questionId
        ? lessonUrlForBacklogEntry(entry, { origin: STUDY_SITE_ORIGIN })
        : "";
      let html = `<div style="margin:10px 0 14px">`;
      html += `<div><b>[${index + 1}]</b> ${esc(entry.prompt)}${esc(who)}</div>`;
      html += `<div style="color:#8b949e;font-size:0.92em;margin-top:4px">${esc(tag)} — ${esc(formatStudyEntryDate(entry.at ?? 0))}</div>`;
      if (entry.questionId) {
        html += `<div style="color:#8b949e;font-size:0.92em;margin-top:2px">→ ${esc(entry.questionId)}</div>`;
      }
      if (lessonUrl) {
        html += `<div style="margin-top:6px"><a href="${esc(lessonUrl)}" target="_blank" rel="noopener" style="color:#58a6ff">📖 Lue oppitunti</a></div>`;
      }
      html += `</div>`;
      return html;
    }

    function renderStudyListHtml(backlog: {
      wantMore?: Array<Record<string, unknown>>;
      wrongAnswers?: Array<Record<string, unknown>>;
    } | null | undefined) {
      const b = backlog || { wantMore: [], wrongAnswers: [] };
      const wantMore = Array.isArray(b.wantMore) ? b.wantMore : [];
      const wrongAnswers = Array.isArray(b.wrongAnswers) ? b.wrongAnswers : [];
      let html = `<div class="overlay-title">═══ OPISKELULISTA ═══</div>`;
      html += `<div style="margin-top:14px;color:#d2a8ff;font-weight:600">── Kysy AI:lta (${wantMore.length}) ──</div>`;
      if (wantMore.length === 0) {
        html += `<div style="color:#8b949e;margin-top:8px">(tyhjä — merkitse [m] kysymyksen palautteen jälkeen)</div>`;
      } else {
        wantMore.forEach((entry, i) => {
          html += renderStudyListEntry(entry as Parameters<typeof renderStudyListEntry>[0], i);
        });
      }
      html += `<div style="margin-top:18px;color:#d2a8ff;font-weight:600">── Väärin vastatut (${wrongAnswers.length}) ──</div>`;
      if (wrongAnswers.length === 0) {
        html += `<div style="color:#8b949e;margin-top:8px">(ei vielä väärää vastausta tallennettuna)</div>`;
      } else {
        wrongAnswers.forEach((entry, i) => {
          html += renderStudyListEntry(entry as Parameters<typeof renderStudyListEntry>[0], i);
        });
      }
      return html;
    }

    function statsLine(state) {
      const time = state.time ? ` &nbsp;|&nbsp; <span style="color:#39c5cf">${esc(state.time)}</span>` : "";
      const needs = state.needsLine ? ` &nbsp;|&nbsp; <span style="color:#d2a8ff">${esc(state.needsLine)}</span>` : "";
      return `<div class="stats">Kuolemat: <b>${state.deaths}</b> &nbsp;|&nbsp; Palkka: <span class="salary">${esc(formatSalary(state.salary))}</span>${time}${needs}</div>`;
    }

    function screenHeader(state: State) {
      if (isMobileLayout()) return "";
      return `<div class="banner">${esc(BANNER)}</div>${statsLine(state)}`;
    }

    function choiceRow(key: string, inner: string, extraClass = "") {
      if (!isMobileLayout()) {
        return `<div class="choice ${extraClass}">${inner}</div>`;
      }
      return `<div class="choice touch-choice ${extraClass}" data-key="${esc(key)}" role="button" tabindex="0">${inner}</div>`;
    }

    function sideOptRow(key: string, inner: string) {
      if (!isMobileLayout()) {
        return `<div class="side-opt">${inner}</div>`;
      }
      return `<div class="side-opt touch-choice" data-key="${esc(key)}" role="button" tabindex="0">${inner}</div>`;
    }

    function continueRow(key = "enter", label = "Jatka →") {
      if (!isMobileLayout()) {
        return `<div class="hint" style="margin-top:16px">Enter = jatka</div>`;
      }
      return `<div class="touch-choice touch-continue" data-key="${esc(key)}" role="button" tabindex="0">${esc(label)}</div>`;
    }

    function hideMobileChoiceToolbar() {
      if (!isMobileLayout()) return;
      setMobileToolbarVisible(toolbarEl, false);
      setMobileTextChoiceMode(true);
    }

    function showMobilePlayToolbar() {
      if (!isMobileLayout()) return;
      setMobileTextChoiceMode(false);
    }

    function setMapTextView(active: boolean) {
      const wrap = document.getElementById("map-wrap");
      if (active) {
        wrap?.classList.add("map-text-view");
      } else {
        wrap?.classList.remove("map-text-view");
      }
    }

    function setMapContent(html: string) {
      if (!mapEl) return;
      clearMapView(mapEl);
      setMapTextView(true);
      setMobilePlayView(false);
      setScrollContent(mapEl, html);
      if (isMobileLayout()) {
        document.documentElement.style.removeProperty("--map-cols");
        document.documentElement.style.removeProperty("--map-rows");
        document.documentElement.style.removeProperty("--map-cell-px");
      }
    }

    function renderMapLines(state: State, lines: string[]) {
      if (!mapEl) return;
      if (mapEl.querySelector("[data-scroll-root]")) {
        clearMapView(mapEl);
      }
      setMapTextView(false);
      const { header, grid, hint } = ensureMapShell(mapEl);
      if (isMobileLayout()) {
        header.innerHTML = state.floorTitle
          ? `<div style="color:#39c5cf;margin-bottom:4px;text-align:center">${esc(state.floorTitle)}</div>`
          : "";
        if (state.studyCounts?.total > 0) {
          header.innerHTML += `<div style="color:#d2a8ff;margin-bottom:4px;text-align:center;font-size:11px">Opiskelu (b): ${state.studyCounts.wantMore}+ / ${state.studyCounts.wrongAnswers}✗</div>`;
        }
      } else {
        const studyLine = state.studyCounts?.total > 0
          ? `<div style="color:#d2a8ff;margin-bottom:8px;text-align:center">Opiskelulista (b): ${state.studyCounts.wantMore} Kysy AI:lta, ${state.studyCounts.wrongAnswers} väärin</div>`
          : "";
        header.innerHTML = studyLine +
          (state.floorTitle ? `<div style="color:#39c5cf;margin-bottom:8px;text-align:center">${esc(state.floorTitle)}</div>` : "");
      }
      void patchIsometricGrid(grid, lines, state);
      mountMapZoomControls(grid);
      if (isMobileLayout()) {
        lastMobileMapLines = lines;
        const syncScale = () => {
          void patchIsometricGrid(grid, lines, state);
        };
        syncScale();
        requestAnimationFrame(syncScale);
        showMobilePlayToolbar();
      }
      setText(hint, isMobileLayout() ? "" : (state.hint || ""));
      if (!state.hint) {
        hint.style.display = "none";
      } else {
        hint.style.display = "";
      }
    }

    function renderOverlay(ov, state) {
      let html = screenHeader(state);

      if (ov.type === "outcome") {
        const cls = ov.correct ? "ok" : "bad";
        const mark = ov.correct ? "✓ OIKEIN" : "✗ VÄÄRIN";
        html += `<div class="overlay-title ${cls}">${mark}</div>`;
        html += `<div class="greeting">${esc(ov.reaction)}</div>`;
        html += `<div class="teaching"><h4>── Selitys ──</h4>${esc(ov.teaching)}</div>`;
        if (ov.lessonUrl) {
          html += `<div style="margin-top:12px"><a href="${esc(ov.lessonUrl)}" target="_blank" rel="noopener" style="color:#58a6ff">📖 Lue oppitunti (GitHub Pages)</a></div>`;
        }
        if (ov.marked) {
          html += `<div style="color:#3fb950;margin-top:12px">✓ Merkitty opiskelulistalle — Kysy AI:lta.</div>`;
        }
        html += continueRow("enter", "Jatka →");
        if (!ov.marked) {
          html += choiceRow("m", '<span class="side-key ai">[m]</span> Selitys ei riittänyt — haluan opiskella lisää', "ai");
        }
        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          setToolbar([
            { key: "m", label: "m merkitse", cls: "ai" },
            { key: "enter", label: "Enter — jatka" },
          ]);
        }
        return html;
      }

      if (ov.type === "aiStudy") {
        html += `<div class="overlay-title ai">═══ AI-opetus (ChatCorp™) ═══</div>`;
        html += `<div class="stats" style="margin-bottom:8px">Palkka: ${esc(formatSalary(state.salary))}</div>`;
        html += `<div><span class="entity-name">${esc(ov.entityName)}</span> <span style="color:#8b949e">katselee sivuun kun kaivat puhelimen.</span></div>`;
        html += `<div class="greeting" style="white-space:pre-wrap">${esc(ov.text)}</div>`;
        if (ov.lessonUrl) {
          html += `<div style="margin-top:12px"><a href="${esc(ov.lessonUrl)}" target="_blank" rel="noopener" style="color:#58a6ff">📖 Lue oppitunti (GitHub Pages)</a></div>`;
        }
        html += continueRow("enter", "Takaisin kysymykseen →");
        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          setToolbar([{ key: "enter", label: "Enter — takaisin" }]);
        }
        return html;
      }

      if (ov.type === "banter") {
        html += `<div class="overlay-title">═══ ${esc(ov.title)} ═══</div>`;
        html += `<div class="banter-line"><span class="banter-you">Sinä:</span> "${esc(ov.playerLine)}"</div>`;
        html += `<div class="banter-line"><span class="banter-npc">${esc(ov.entityName)}:</span> ${esc(ov.npcLine)}</div>`;
        html += continueRow("enter", "Jatka →");
        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          setToolbar([{ key: "enter", label: "Enter — jatka" }]);
        }
        return html;
      }

      if (ov.type === "cardReturn") {
        html += `<div class="overlay-title">═══ Kulkukortti ═══</div>`;
        html += `<div class="greeting">${esc(ov.entityName)} etsii kadonnutta korttiaan. Sinulla on se taskussa.</div>`;
        html += choiceRow("1", '<span class="choice-num">[1]</span> Palauta kortti');
        html += choiceRow("2", '<span class="choice-num">[2]</span> Väitä ettei ole sinulla');
        html += choiceRow("3", '<span class="choice-num muted">[3]</span> Poistu', "muted");
        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          setToolbar([
            { key: "1", label: "1 palauta" },
            { key: "2", label: "2 valehtele" },
            { key: "3", label: "3 poistu", cls: "muted" },
          ]);
        }
        return html;
      }

      if (ov.type === "arrest") {
        html += `<div class="overlay-title">═══ Kiinniotto ═══</div>`;
        html += `<div class="entity"><span class="entity-char">[ ${esc(ov.catcherChar || "?")} ]</span> <span class="entity-name">${esc(ov.catcherName || "Poliisi")}</span></div>`;
        html += `<div class="greeting">${esc(ov.reasonLine || "")}</div>`;
        html += `<div class="hint" style="margin:8px 0">${esc(ov.evidenceHint || "")}</div>`;
        html += choiceRow("1", '<span class="choice-num">[1]</span> Selitä tilanne');
        html += choiceRow("2", '<span class="choice-num">[2]</span> Kiistä syytteet');
        html += choiceRow("3", '<span class="choice-num">[3]</span> Luovuta');
        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          setToolbar([
            { key: "1", label: "1 selitä" },
            { key: "2", label: "2 kiistä" },
            { key: "3", label: "3 luovuta", cls: "muted" },
          ]);
        }
        return html;
      }

      if (ov.type === "action") {
        html += `<div class="overlay-title">═══ Käytä esinettä ═══</div>`;
        html += `<div class="greeting">Kohde: <b>${esc(ov.targetName)}</b></div>`;
        for (const item of ov.items || []) {
          html += choiceRow(String(item.n), `<span class="choice-num">[${item.n}]</span> ${esc(item.label)}`);
        }
        html += choiceRow("4", '<span class="choice-num muted">[4]</span> Peruuta', "muted");
        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          setToolbar([
            ...(ov.items || []).map((item) => ({ key: String(item.n), label: `${item.n}` })),
            { key: "4", label: "4 peru", cls: "muted" },
          ]);
        }
        return html;
      }

      if (ov.type === "actionResult") {
        const cls = ov.ok ? "ok" : "bad";
        html += `<div class="overlay-title ${cls}">═══ Tulos ═══</div>`;
        html += `<div class="greeting">${esc(ov.message)}</div>`;
        html += continueRow("enter", "Jatka →");
        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          setToolbar([{ key: "enter", label: "Enter — jatka" }]);
        }
        return html;
      }

      return html + `<div>Tuntematon overlay: ${esc(ov.type)}</div>`;
    }

    function renderEncounter(state) {
      updateMobileChrome(state);
      setMobilePlayView(false);
      setMobileDpadVisible(mobileDpadEl, false);
      const enc = state.encounter;
      let html = screenHeader(state);
      html += `<div class="entity"><span class="entity-char">[ ${esc(enc.char)} ]</span> <span class="entity-name">${esc(enc.name)}</span></div>`;

      if (state.overlay) {
        setMapContent(renderOverlay(state.overlay, state));
        if (hintEl) hintEl.textContent = isMobileLayout() ? "" : "q = lopeta";
        return;
      }

      if (enc.mode === "emotional" && enc.question) {
        html += `<div class="greeting">${esc(enc.greeting)}</div>`;
        html += `<div class="greeting" style="margin-top:10px;font-style:italic">${esc(enc.question)}</div>`;
        for (const c of enc.choices || []) {
          html += choiceRow(String(c.n), `<span class="choice-num">[${c.n}]</span> ${esc(c.text)}`);
        }
        html += sideOptRow("p", `<span class="side-key leave">[p]</span> Poistu`);

        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          setToolbar([
            ...(enc.choices || []).map((c: { n: number; text: string }) => ({
              key: String(c.n),
              label: String(c.n),
            })),
            { key: "p", label: "p poistu", cls: "muted" },
          ]);
        }
        if (hintEl) hintEl.textContent = isMobileLayout() ? "" : (enc.hintLine || "1–3=vastaa  p=poistu") + "  |  q = lopeta";
      } else if (enc.mode === "quiz" && state.quiz) {
        const q = state.quiz;
        const side = q.sideMenu;
        if (state.kidsMode && q.prompt) {
          const speechKey = `${state.encounter?.name ?? ""}:${q.prompt}`;
          if (speechKey !== lastQuizSpeechKey) {
            lastQuizSpeechKey = speechKey;
            speakQuizPrompt(q.prompt, state.encounter?.name ?? "quiz", q.prompt);
          }
        }
        html += `<div class="greeting">${esc(q.greeting)}</div>`;
        for (const c of q.choices) {
          html += choiceRow(String(c.n), `<span class="choice-num">[${c.n}]</span> ${esc(c.text)}`);
        }
        html += `<div class="divider">── tai ──</div>`;
        html += sideOptRow("a", `<span class="side-key ai">[a]</span> Kysy AI:lta`);
        html += sideOptRow("j", `<span class="side-key joke">[j]</span> ${esc(side.jokeLabel)}`);
        if (side.askColleagueLabel) {
          html += sideOptRow("n", `<span class="side-key joke">[n]</span> ${esc(side.askColleagueLabel)}`);
        }
        html += sideOptRow("i", `<span class="side-key meh">[i]</span> ${esc(side.mehLabel)}`);
        html += sideOptRow("p", `<span class="side-key leave">[p]</span> ${esc(side.leaveLabel)}`);

        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          setToolbar([
            ...q.choices.map((c) => ({ key: String(c.n), label: String(c.n) })),
            ...(side.askColleagueLabel ? [{ key: "n", label: "n kollega" }] : []),
            { key: "a", label: "a AI", cls: "ai" },
            { key: "j", label: "j vitsi" },
            { key: "i", label: "i sama", cls: "muted" },
            { key: "p", label: "p poistu", cls: "muted" },
          ]);
        }
        if (hintEl) hintEl.textContent = isMobileLayout() ? "" : enc.hintLine + "  |  q = lopeta";
      } else {
        html += `<div class="greeting">${esc(enc.greeting)}</div>`;
        for (const opt of state.dialogOptions || []) {
          const cls = opt.style === "muted" ? "muted" : "";
          const inner = `<span class="${opt.style === "muted" ? "muted" : "choice-num"}">[${opt.key}]</span> ${esc(opt.label)}`;
          html += choiceRow(opt.key, inner, cls);
        }
        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          setToolbar((state.dialogOptions || []).map((opt: { key: string; label: string; style?: string }) => ({
            key: opt.key,
            label: ({ "1": "1 juttele", "2": "2 vitsi", "3": "3 poistu" } as Record<string, string>)[opt.key] || opt.key,
            cls: opt.style === "muted" ? "muted" : undefined,
          })));
        }
        if (hintEl) hintEl.textContent = isMobileLayout() ? "" : (enc.hintLine || "") + "  |  q = lopeta";
      }

      setMapContent(html);
    }

    function setToolbar(buttons: { key: string; label: string; cls?: string; action?: () => void }[]) {
      if (!toolbarEl) return;
      if (isMobileLayout()) {
        if (!buttons?.length) {
          setMobileToolbarVisible(toolbarEl, false);
          return;
        }
        setMobileTextChoiceMode(false);
        setMobileToolbarVisible(toolbarEl, true);
        setMobileToolbar(toolbarEl, buttons, sendKey, resetGame);
        return;
      }
      toolbarEl.className = "toolbar";
      toolbarEl.innerHTML = "";
      if (!buttons?.length) return;
      for (const b of buttons) {
        const btn = document.createElement("button");
        btn.textContent = b.label;
        btn.dataset.key = b.key;
        if (b.cls) btn.className = b.cls;
        btn.addEventListener("click", () => {
          if (b.action) {
            b.action();
            return;
          }
          if (b.key === "reset") resetGame();
          else sendKey(b.key);
        });
        toolbarEl.appendChild(btn);
      }
    }

    let lastToolbarKey = "";
    let lastElevatorToolbarKey = "";

    /** Map grid is shown for both free roam and prison; mobile dpad must stay available in prison. */
    function isMobileMapPlayScreen(state?: State): boolean {
      const screen = state?.screen;
      return (screen === "map" || screen === "prison") && Boolean(state?.lines);
    }

    function renderMapToolbar(state?: State) {
      const onElevator = Boolean(state?.onElevator);
      const elevatorPickerCollapsed = Boolean(state?.elevatorPickerCollapsed);

      if (isMobileLayout()) {
        const toolbarKey = `${state?.screen ?? "map"}-${onElevator ? "1" : "0"}-${elevatorPickerCollapsed ? "1" : "0"}`;
        const onMapScreen = isMobileMapPlayScreen(state);
        setMobilePlayView(onMapScreen);
        setMobileDpadVisible(mobileDpadEl, onMapScreen);
        if (onMapScreen && toolbarEl && mobileDpadEl) {
          showMobilePlayToolbar();
          setMobileToolbarVisible(toolbarEl, true);
          mountMobileControls(toolbarEl, mobileDpadEl, sendKey, resetGame);
          const elevatorUiKey = `${onElevator ? "1" : "0"}-${elevatorPickerCollapsed ? "1" : "0"}-${state?.elevatorFloors?.length ?? 0}`;
          if (toolbarKey !== lastToolbarKey || elevatorUiKey !== lastElevatorToolbarKey) {
            lastToolbarKey = toolbarKey;
            lastElevatorToolbarKey = elevatorUiKey;
            updateMobileMapToolbar(toolbarEl, {
              onElevator,
              floors: state?.elevatorFloors,
              pickerCollapsed: elevatorPickerCollapsed,
            }, () => {
              game.expandElevatorPicker?.();
              lastRenderKey = "";
              render(game.snapshot());
            });
            if (lastMobileMapLines.length > 0 && mapEl) {
              requestAnimationFrame(() => {
                lastRenderKey = "";
                render(game.snapshot());
              });
            }
          }
        } else {
          lastToolbarKey = "";
          clearMobileElevator();
        }
        return;
      }
      if (!toolbarEl) return;
      toolbarEl.className = "toolbar toolbar-desktop";
      toolbarEl.innerHTML = "";
      const movementButtons = [
        { key: "w", label: "↑" },
        { key: "a", label: "←" },
        { key: "s", label: "↓" },
        { key: "d", label: "→" },
        { key: "h", label: "h piiloudu" },
        { key: "e", label: "e käytä" },
        { key: "t", label: "t työkalu" },
        { key: "x", label: "x käytä" },
        { key: "i", label: "i inventaario" },
        { key: "b", label: "b opiskelu" },
        { key: "?", label: "? valikko" },
        { key: "o", label: "o hahmot" },
        { key: "reset", label: "↺ alusta", cls: "danger" },
      ];
      for (const b of movementButtons) {
        const btn = document.createElement("button");
        btn.textContent = b.label;
        btn.dataset.key = b.key;
        if (b.cls) btn.className = b.cls;
        btn.addEventListener("click", () => {
          if (b.key === "reset") resetGame();
          else sendKey(b.key);
        });
        toolbarEl.appendChild(btn);
      }
      mountElevatorToolbar(
        toolbarEl,
        {
          onElevator: state?.onElevator,
          elevatorPickerCollapsed: state?.elevatorPickerCollapsed,
          elevatorFloors: state?.elevatorFloors,
        },
        {
          onKey: sendKey,
          onExpand: () => {
            game.expandElevatorPicker?.();
            lastRenderKey = "";
            render(game.snapshot());
          },
        },
      );
      if (hintEl) {
        hintEl.textContent = onElevator
          ? "Hissi: valitse kerros 1–9/0 | WASD liiku | q lopeta"
          : "WASD | t=työkalu x=murra/kaiva | e=käytä | i=inventaario | b=opiskelu | h piiloudu | ?=valikko | q lopeta";
      }
    }

    function updateDesktopChrome(state: State) {
      renderHudStats(hudStatsEl, state, esc);
      renderMessageBar(messageBarEl, state, esc);
      renderActionBar(actionBarEl, state);
    }

    function updateMobileChrome(state: State) {
      renderHudStats(hudStatsEl, state, esc);
      renderMessageBar(messageBarEl, state, esc);
      renderActionBar(actionBarEl, state);
    }

    function renderMobileMap(state: State) {
      updateMobileChrome(state);
      renderMapLines(state, state.lines);
      renderMapToolbar(state);
    }

    let lastLayoutMobile = isMobileLayout();

    function renderKey(state: State): string {
      return [
        isMobileLayout() ? "m" : "d",
        showRelationsDebug ? "relDbg1" : "relDbg0",
        Math.floor(viewportWidth() / 40),
        state.generation,
        state.player?.x ?? "",
        state.player?.y ?? "",
        state.entityCount ?? "",
        state.floor ?? "",
        state.screen,
        state.needsProfileSetup ? "needProf1" : "needProf0",
        state.profileComplete ? "prof1" : "prof0",
        state.overlay?.type ?? "",
        state.actionPanel?.mode ?? "",
        state.encounter?.mode ?? "",
        state.story?.screen ?? "",
        state.story?.nodeKind ?? "",
        state.story?.currentNodeId ?? "",
        state.elevatorPickerCollapsed ? "1" : "0",
        state.status ?? "",
        state.ambient ?? "",
      ].join("|");
    }

    function render(state) {
      const needsSetup = needsProfileSetup(state);
      syncProfileSetupVisible(state);
      if (needsSetup) {
        applyProfileSetupChrome(state);
        seedProfileFormOnce(state);
        return;
      }
      const key = renderKey(state);
      const onMobileMap = isMobileLayout() && isMobileMapPlayScreen(state);
      setMobilePlayView(onMobileMap);
      setMobileDpadVisible(mobileDpadEl, onMobileMap);
      if (!onMobileMap) {
        lastToolbarKey = "";
        lastElevatorToolbarKey = "";
        clearMobileElevator();
      }
      if (key === lastRenderKey) {
        return;
      }
      lastRenderKey = key;
      if (isMobileLayout()) {
        updateMobileChrome(state);
      } else {
        updateDesktopChrome(state);
        if (showDebugJson && jsonEl && metaEl) {
          jsonEl.textContent = JSON.stringify(state, null, 2);
          metaEl.innerHTML = `screen=<b>${state.screen}</b> salary=${state.salary} deaths=${state.deaths} ` +
            `agents=${state.agentCount} gen=${state.generation}`;
          if (state.policeChase) metaEl.innerHTML += ` <span class="warn">POLIISIT</span>`;
          if (state.studyCounts?.total > 0) {
            metaEl.innerHTML += ` <span style="color:#d2a8ff">opiskelu: ${state.studyCounts.wantMore}+${state.studyCounts.wrongAnswers}✗</span>`;
          }
          if (state.staffRoster?.length) {
            const names = state.staffRoster.map((s: { firstName?: string; name?: string }) => s.firstName || s.name).join(", ");
            metaEl.innerHTML += `<div style="color:#8b949e;font-size:11px;margin-top:4px">Henkilöstö: ${esc(names)}</div>`;
          }
        }
      }

      if (!isMobileLayout() && statusEl) {
        statusEl.textContent = "";
      }

      if (showRelationsDebug) {
        const debugText = game.getRelationsDebugText?.() ?? "";
        if (!mapEl) return;
        clearMapView(mapEl);
        setMapContent(
          screenHeader(state) +
          `<pre class="relations-debug" style="white-space:pre-wrap;background:transparent;border:none;padding:0;margin:12px 0;color:#c9d1d9;font-size:12px;line-height:1.45">${esc(debugText)}</pre>`,
        );
        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          setToolbar([
            { key: "enter", label: "Enter sulje" },
            { key: "escape", label: "Esc sulje" },
          ]);
        }
        hintEl.textContent = "DEBUG — tunnetilat | kirjoita debug tai Enter/Esc = sulje";
        return;
      }

      if (state.castListOpen) {
        if (!mapEl) return;
        clearMapView(mapEl);
        setMapContent(
          screenHeader(state) +
          `<pre style="white-space:pre-wrap;background:transparent;border:none;padding:0;margin:12px 0;color:#c9d1d9;font-size:12px;line-height:1.45">${esc(state.castListText || "")}</pre>`,
        );
        setToolbar([
          { key: "o", label: "o sulje" },
          { key: "enter", label: "Enter sulje" },
        ]);
        hintEl.textContent = "Hahmot ja tunnetilat | o / Enter = sulje | q = lopeta";
        return;
      }

      if (state.screen === "inventory") {
        const invText = (state.inventoryLines || []).join("\n");
        if (!mapEl) return;
        clearMapView(mapEl);
        setMapContent(
          screenHeader(state) +
          `<div style="color:#39c5cf;font-weight:bold;margin:12px 0">═══ Inventaario ═══</div>` +
          `<pre style="white-space:pre-wrap;background:transparent;border:none;padding:0;margin:0">${esc(invText)}</pre>`,
        );
        setToolbar([{ key: "enter", label: "Enter — takaisin" }, { key: "i", label: "i takaisin" }]);
        hintEl.textContent = "1–9 = pudota esine | Enter = takaisin kartalle | q = lopeta";
        return;
      }

      if (state.screen === "menu") {
        let html = `<div class="banner">${esc(BANNER)}</div>${statsLine(state)}`;
        const lessons = (state.menuItems || []).filter((item) => item.category !== "social");
        const social = (state.menuItems || []).filter((item) => item.category === "social");
        if (lessons.length) {
          html += `<div style="color:#39c5cf;font-weight:bold;margin:12px 0">═══ Oppitunnit ═══</div>`;
          for (const item of lessons) {
            html += choiceRow(String(item.n), `<span class="choice-num">[${item.n}]</span> ${esc(item.title)}`);
            if (item.description) {
              html += `<div style="color:#8b949e;margin:0 0 8px 1.5em">${esc(item.description)}</div>`;
            }
          }
        }
        if (social.length) {
          html += `<div style="color:#d2a8ff;font-weight:bold;margin:12px 0">═══ Social chats ═══</div>`;
          for (const item of social) {
            html += choiceRow(String(item.n), `<span class="choice-num">[${item.n}]</span> ${esc(item.title)}`);
            if (item.description) {
              html += `<div style="color:#8b949e;margin:0 0 8px 1.5em">${esc(item.description)}</div>`;
            }
          }
        }
        if (state.menuMessage) {
          html += `<div class="warn" style="margin-top:8px">${esc(state.menuMessage)}</div>`;
        }
        html += choiceRow("m", '<span class="choice-num muted">[m]</span> Takaisin toimistolle', "muted");
        if (!mapEl) return;
        clearMapView(mapEl);
        setMapContent(html);
        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          const menuBtns = (state.menuItems || []).map((item) => ({
            key: String(item.n),
            label: `${item.n}. ${item.title}`,
          }));
          setToolbar([
            ...menuBtns,
            { key: "m", label: "m takaisin", cls: "muted" },
          ]);
        }
        hintEl.textContent = "1–9 = oppitunti | m / Enter = kartalle | q = lopeta";
        return;
      }

      if (state.screen === "studylist") {
        const text = state.studyListText || "";
        currentStudyListText = text;
        let html = screenHeader(state);
        html += `<div style="margin:12px 0"><button type="button" id="study-copy-btn">Kopioi leikepöydälle</button></div>`;
        html += renderStudyListHtml(state.studyBacklog);
        if (!mapEl) return;
        clearMapView(mapEl);
        setMapContent(html);
        setToolbar([
          {
            key: "copy",
            label: "Kopioi",
            cls: "ai",
            action: () => {
              void copyStudyListToClipboard(text);
            },
          },
          { key: "enter", label: "Enter — takaisin" },
          { key: "b", label: "b takaisin" },
        ]);
        hintEl.textContent = STUDY_LIST_HINT;
        return;
      }

      if (state.screen === "blocked" || state.screen === "action") {
        const panel = state.actionPanel || {};
        let html = screenHeader(state);
        if (panel.mode === "result") {
          html += `<div class="overlay-title ${panel.resultOk ? "ok" : "bad"}">═══ Tulos ═══</div>`;
          html += `<div class="greeting">${esc(panel.resultMessage || "")}</div>`;
          html += continueRow("enter", "Jatka →");
          if (!mapEl) return;
          setMapContent(html);
          if (isMobileLayout()) {
            hideMobileChoiceToolbar();
          } else {
            setToolbar([{ key: "enter", label: "Enter — jatka" }]);
          }
          hintEl.textContent = panel.hintLine || "Enter = jatka | q = lopeta";
          return;
        }
        if (state.screen === "blocked") {
          html += `<div class="overlay-title">═══ Este edessä ═══</div>`;
          if (panel.targetName) {
            html += `<div class="greeting">Kohde: <b>${esc(panel.targetName)}</b></div>`;
          }
          let n = 1;
          const toolbar = [];
          if (panel.canTalk) {
            html += choiceRow(String(n), `<span class="choice-num">[${n}]</span> Juttele — ${esc(panel.talkName || "")}`);
            toolbar.push({ key: String(n), label: `${n} juttele` });
            n += 1;
          }
          if ((panel.tools || []).length > 0) {
            html += choiceRow(String(n), `<span class="choice-num">[${n}]</span> Käytä työkalua`);
            toolbar.push({ key: String(n), label: `${n} työkalu` });
            n += 1;
          }
          html += choiceRow(String(n), `<span class="choice-num muted">[${n}]</span> Peruuta`, "muted");
          toolbar.push({ key: String(n), label: `${n} peru`, cls: "muted" });
          if (!mapEl) return;
          setMapContent(html);
          if (isMobileLayout()) {
            hideMobileChoiceToolbar();
          } else {
            setToolbar(toolbar);
          }
          hintEl.textContent = panel.hintLine || "q = lopeta";
          return;
        }
        html += `<div class="overlay-title">═══ Käytä työkalua ═══</div>`;
        html += `<div class="greeting">Kohde: <b>${esc(panel.targetName || "Kohde")}</b></div>`;
        for (const item of panel.tools || []) {
          html += choiceRow(String(item.n), `<span class="choice-num">[${item.n}]</span> ${esc(item.label)}`);
        }
        html += choiceRow("4", '<span class="choice-num muted">[4]</span> Peruuta', "muted");
        if (!mapEl) return;
        setMapContent(html);
        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          setToolbar([
            ...(panel.tools || []).map((item) => ({ key: String(item.n), label: `${item.n}` })),
            { key: "4", label: "4 peru", cls: "muted" },
          ]);
        }
        hintEl.textContent = panel.hintLine || "Valitse työkalu | 4 = peru | q = lopeta";
        return;
      }

      if (state.screen === "encounter") {
        renderEncounter(state);
        return;
      }

      if (state.screen === "story" && state.story) {
        const s = state.story;
        let html = `<div class="banner">${esc(BANNER)}</div>${statsLine(state)}`;
        if (s.title) html += `<div class="entity-name">${esc(s.title)}</div>`;
        if (s.nodeTitle) html += `<div style="color:#39c5cf">── ${esc(s.nodeTitle)} ──</div>`;

        if (s.screen === "feedback") {
          const mark = s.feedbackCorrect ? "✓ OIKEIN" : "✗ VÄÄRIN";
          const cls = s.feedbackCorrect ? "ok" : "bad";
          html += `<div class="overlay-title ${cls}">${mark}</div>`;
          html += `<div class="greeting">${esc(s.feedbackMessage || "")}</div>`;
          if (s.pointsEarned > 0) {
            html += `<div style="color:#3fb950;margin-top:8px">+${s.pointsEarned} pistettä</div>`;
          }
          html += continueRow("enter", "Jatka →");
          if (!mapEl) return;
          clearMapView(mapEl);
          setMapContent(html);
          if (isMobileLayout()) {
            hideMobileChoiceToolbar();
          } else {
            setToolbar([{ key: "enter", label: "Enter — jatka" }]);
          }
          hintEl.textContent = "q = lopeta";
          return;
        }

        if (s.screen === "ended") {
          html += `<div class="overlay-title">── Loppu ──</div>`;
          if (s.outcome === "victory") {
            html += `<div style="color:#3fb950;font-weight:bold">Voitto!</div>`;
          } else if (s.outcome === "death") {
            html += `<div style="color:#f85149">Burnout — yritä uudelleen.</div>`;
          } else {
            html += `<div>Kohtaaminen päättyi.</div>`;
          }
          if (s.totalPoints != null) {
            html += `<div style="margin-top:8px">Pisteet: ${s.totalPoints}</div>`;
          }
          html += continueRow("enter", "Palaa kartalle →");
          if (!mapEl) return;
          clearMapView(mapEl);
          setMapContent(html);
          if (isMobileLayout()) {
            hideMobileChoiceToolbar();
          } else {
            setToolbar([{ key: "enter", label: "Enter — kartalle" }]);
          }
          hintEl.textContent = "q = lopeta";
          return;
        }

        if (s.body) html += `<div class="greeting" style="white-space:pre-wrap">${esc(s.body)}</div>`;

        if (s.nodeKind === "code") {
          html += `<div id="code-panel" style="margin-top:12px">`;
          if (s.codeTemplate) {
            html += `<pre style="background:#0d1117;padding:8px;border:1px solid #30363d">${esc(s.codeTemplate)}</pre>`;
          }
          if (s.codeHint) {
            html += `<div class="hint">${esc(s.codeHint)}</div>`;
          }
          html += `<input id="codeInput" type="text" spellcheck="false" style="width:100%;margin-top:8px;padding:8px;background:#0d1117;border:1px solid #30363d;color:#c9d1d9;font-family:inherit" placeholder="vastaus…" />`;
          html += `<button id="codeSubmit" type="button" style="margin-top:8px">Lähetä vastaus</button>`;
          html += `</div>`;
          if (!mapEl) return;
          clearMapView(mapEl);
          setMapContent(html);
          setToolbar([]);
          hintEl.textContent = "Kirjoita vastaus ja paina Enter tai Lähetä | q = lopeta";
          return;
        }

        if (s.choiceTexts?.length) {
          s.choiceTexts.forEach((t, i) => {
            html += choiceRow(String(i + 1), `<span class="choice-num">[${i + 1}]</span> ${esc(t)}`);
          });
          if (!mapEl) return;
          clearMapView(mapEl);
          setMapContent(html);
          if (isMobileLayout()) {
            hideMobileChoiceToolbar();
          } else {
            setToolbar(s.choiceTexts.map((_, i) => ({ key: String(i + 1), label: String(i + 1) })));
          }
          hintEl.textContent = "Valitse 1–" + s.choiceTexts.length + " | q = lopeta";
          return;
        }

        html += continueRow("enter", "Jatka →");
        if (!mapEl) return;
        clearMapView(mapEl);
        setMapContent(html);
        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          setToolbar([{ key: "enter", label: "Enter — jatka" }]);
        }
        hintEl.textContent = "Enter = jatka | q = lopeta";
        return;
      }

      if (state.screen === "gameover") {
        let html = screenHeader(state);
        html += `<div class="overlay-title bad">═══ Game Over ═══</div>`;
        const memorial = state.memorial ?? { deathLine: "", mourners: [] };
        const playerName = esc((memorial.playerName || "").trim() || (state.playerDisplayName || "").trim() || "Pelaaja");
        const deathLine = esc(memorial.deathLine || state.status || "Kuolit.");
        const mourners = memorial.mourners ?? [];
        html += `<div class="greeting" style="margin-top:12px"><strong>${playerName}</strong><br>${deathLine}</div>`;
        html += `<div style="margin-top:16px;font-style:italic;color:#8b949e">Kaipaamaan jäivät:</div>`;
        if (mourners.length < 1) {
          html += `<div class="hint" style="margin-top:8px">Talkkari, Toimistokoira, Poliisi</div>`;
        } else {
          html += `<div style="margin-top:8px">`;
          for (const mourner of mourners) {
            html += `<div style="margin-bottom:12px">`;
            html += `<strong>${esc(mourner.name || "?")}</strong>`;
            if (mourner.epitaph) {
              html += `<div class="hint" style="margin-top:4px;font-style:italic">"${esc(mourner.epitaph)}"</div>`;
            }
            html += `</div>`;
          }
          html += `</div>`;
        }
        html += `<div style="margin-top:12px;color:#f85149">Kuolemat: ${state.deaths ?? 0}</div>`;
        html += continueRow("enter", "Aloita uudelleen →");
        setMapContent(html);
        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          setToolbar([{ key: "enter", label: "Enter — uudelleen" }]);
        }
        hintEl.textContent = "Enter = uudelleen | q = lopeta";
        return;
      }

      if (state.screen === "epilogue") {
        let html = screenHeader(state);
        html += `<div class="overlay-title bad">═══ Päivän loppu ═══</div>`;
        html += `<div class="greeting">${esc(state.status || "")}</div>`;
        html += continueRow("enter", "Aloita uusi päivä →");
        setMapContent(html);
        if (isMobileLayout()) {
          hideMobileChoiceToolbar();
        } else {
          setToolbar([{ key: "enter", label: "Enter — uusi päivä" }]);
        }
        hintEl.textContent = "Enter = uusi päivä | q = lopeta";
        return;
      }

      if (state.lines) {
        if (isMobileLayout()) {
          renderMobileMap(state);
          return;
        }
        renderMapLines(state, state.lines);
        renderMapToolbar(state);
        return;
      }

      if (!mapEl) return;
      clearMapView(mapEl);
      mapEl.textContent = `(${state.screen})`;
      toolbarEl.innerHTML = "";
      hintEl.textContent = "";
    }

    const ARROW_KEYS = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };

    const GAME_KEYS = new Set([
      "w", "a", "s", "d", "up", "down", "left", "right",
      "h", "e", "i", "b", "?", "o", "t", "x", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
      "n", "q", "enter", "j", "p", " ", "m",
    ]);

    function normalizeKey(e) {
      if (e.key === "Enter") return "enter";
      if (ARROW_KEYS[e.key]) return ARROW_KEYS[e.key];
      if (e.key.length === 1) return e.key.toLowerCase();
      return e.key;
    }

    mapEl?.addEventListener("click", (e) => {
      const target = e.target as HTMLElement | null;
      if (!target || !mapEl) return;
      if (target.id === "study-copy-btn") {
        void copyStudyListToClipboard(currentStudyListText);
        return;
      }
      if (target.id === "codeSubmit") {
        const input = mapEl.querySelector<HTMLInputElement>("#codeInput");
        sendCode(input?.value ?? "");
        return;
      }
      const row = target.closest<HTMLElement>("[data-key]");
      if (row && mapEl.contains(row)) {
        const key = row.dataset.key;
        if (key) {
          e.preventDefault();
          sendKey(key);
        }
      }
    });

    mapEl?.addEventListener("keydown", (e) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.id !== "codeInput") return;
      if (e.key === "Enter") {
        e.preventDefault();
        sendCode((target as HTMLInputElement).value);
      }
    });

    window.addEventListener("keydown", (e) => {
      if (isEditableGameTarget(e.target)) return;

      const k = normalizeKey(e);
      const state = game.snapshot();
      if (needsProfileSetup(state)) return;

      const unlock = feedDebugUnlock(k);
      if (unlock === "toggled") {
        e.preventDefault();
        showRelationsDebug = !showRelationsDebug;
        lastRenderKey = "";
        render(game.snapshot());
        return;
      }
      if (unlock === "swallow") {
        e.preventDefault();
        return;
      }

      if (showRelationsDebug) {
        if (e.key === "Escape" || k === "enter" || k === "q") {
          e.preventDefault();
          showRelationsDebug = false;
          lastRenderKey = "";
          render(game.snapshot());
          return;
        }
        e.preventDefault();
        return;
      }

      if (e.key === "`" && !isMobileLayout()) {
        e.preventDefault();
        showDebugJson = !showDebugJson;
        syncDebugJsonPanel();
        lastRenderKey = "";
        render(game.snapshot());
        return;
      }
      if (state.screen === "studylist" && k === "c") {
        e.preventDefault();
        void copyStudyListToClipboard(state.studyListText || "");
        return;
      }
      if (!GAME_KEYS.has(k)) return;
      e.preventDefault();
      sendKey(k);
    });

    function onViewportChange() {
      const mobile = isMobileLayout();
      const state = game.snapshot();
      if (needsProfileSetup(state)) {
        syncProfileSetupVisible(state);
        applyProfileSetupChrome(state);
        if (isProfileFormFocused()) return;
      }
      if (mobile !== lastLayoutMobile) {
        resetMobileControlsMount();
        lastLayoutMobile = mobile;
        if (toolbarEl && !mobile) {
          toolbarEl.className = "toolbar";
          toolbarEl.innerHTML = "";
          toolbarEl.hidden = false;
        }
      }
      syncMobileClass();
      if (mobile && lastMobileMapLines.length > 0) {
        lastRenderKey = "";
      }
      lastRenderKey = "";
      render(game.snapshot());
    }

    watchViewportLayout(onViewportChange);

    document.addEventListener("koodisampo-theme-change", () => {
      lastRenderKey = "";
      render(game.snapshot());
    });

    document.addEventListener("koodisampo-render-theme-change", () => {
      lastRenderKey = "";
      render(game.snapshot());
    });

    document.addEventListener("koodisampo-map-zoom-change", () => {
      lastRenderKey = "";
      const grid = mapEl?.querySelector<HTMLElement>("[data-map-grid]");
      if (grid) syncMapZoomControls(grid);
      render(game.snapshot());
    });

    if (profileSpecialtyEl) {
      profileSpecialtyEl.innerHTML = PLAYER_SPECIALTY_OPTIONS.map(
        (o) => `<option value="${esc(o.id)}">${esc(o.label)}</option>`,
      ).join("");
    }
    profileNameEl?.addEventListener("input", () => {
      profileFormDirty = true;
      clearProfileSetupError();
    });
    profileSpecialtyEl?.addEventListener("change", () => {
      profileFormDirty = true;
    });
    profileKidsModeEl?.addEventListener("change", () => {
      profileFormDirty = true;
    });
    profileFormEl?.addEventListener("submit", (e) => {
      e.preventDefault();
      commitProfileSetup();
    });
    profileStartBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      commitProfileSetup();
    });

    function tick() {
      const state = game.snapshot();
      syncProfileSetupVisible(state);
      if (needsProfileSetup(state)) {
        applyProfileSetupChrome(state);
        seedProfileFormOnce(state);
        return;
      }
      const key = renderKey(state);
      if (key !== lastRenderKey) {
        render(state);
      }
    }

    render(game.snapshot());
    setInterval(tick, 500);
}
