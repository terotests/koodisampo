import type { WebGame } from "./boot";
import {
  cropMapLines,
  isMobileLayout,
  renderHudStats,
  renderMessageBar,
  setMobileMapToolbar,
  setMobileToolbar,
  syncMobileClass,
} from "./mobileLayout";

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

  syncMobileClass();
  window.addEventListener("resize", syncMobileClass);

    const BANNER = `╔══════════════════════════════════════════════════╗
║  KOODISAMPO — Corporate NetHack (terminaali)   ║
║  Selviydy toimistosta. Opiskele C++:ää.        ║
╚══════════════════════════════════════════════════╝`;

    function sendKey(key: string) {
      const before = game.snapshot();
      game.handleKey(key);
      const after = game.snapshot();
      if (
        isMobileLayout()
        && before.onElevator
        && /^[0-9]$/.test(key)
        && after.floor !== before.floor
      ) {
        elevatorPickerCollapsed = true;
      }
      render(after);
    }

    let elevatorPickerCollapsed = false;
    let wasOnElevator = false;
    let copyStatusTimeout = 0;

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

    function resetGame() {
      game.reset(true);
      render(game.snapshot());
    }

    function sendCode(answer: string) {
      game.handleStoryCode(answer);
      render(game.snapshot());
    }

    function esc(s) {
      return String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function statsLine(state) {
      const time = state.time ? ` &nbsp;|&nbsp; <span style="color:#39c5cf">${esc(state.time)}</span>` : "";
      return `<div class="stats">Kuolemat: <b>${state.deaths}</b> &nbsp;|&nbsp; Karma: <span class="karma">${state.karma}</span>${time}</div>`;
    }

    function colorizeLine(line, state, row = 0) {
      const recommended = new Set(state.recommendedCells ?? []);
      return [...line].map((ch, col) => {
        if (recommended.has(`${row},${col}`)) {
          return `<span class="npc-recommended">${esc(ch)}</span>`;
        }
        if (state.policeChase && ch === "P") return `<span class="police">${ch}</span>`;
        if (ch === "@") return `<span style="color:#f0883e;font-weight:bold">${ch}</span>`;
        if (ch === ".") return `<span style="color:#3fb950">${ch}</span>`;
        if (ch === "#" || ch === "%") return `<span style="color:#484f58">${ch}</span>`;
        return esc(ch);
      }).join("");
    }

    function screenHeader(state: State) {
      if (isMobileLayout()) return "";
      return `<div class="banner">${esc(BANNER)}</div>${statsLine(state)}`;
    }

    function setMapTextView(active: boolean) {
      const wrap = document.getElementById("map-wrap");
      if (active) {
        mapEl?.classList.add("encounter-view");
        wrap?.classList.add("map-text-view");
      } else {
        mapEl?.classList.remove("encounter-view");
        wrap?.classList.remove("map-text-view");
      }
    }

    function setMapContent(html: string) {
      if (!mapEl) return;
      if (isMobileLayout()) {
        setMapTextView(true);
        mapEl.innerHTML = `<div class="mobile-scroll">${html}</div>`;
      } else {
        setMapTextView(false);
        mapEl.innerHTML = html;
      }
    }

    function renderOverlay(ov, state) {
      let html = screenHeader(state);

      if (ov.type === "outcome") {
        const cls = ov.correct ? "ok" : "bad";
        const mark = ov.correct ? "✓ OIKEIN" : "✗ VÄÄRIN";
        html += `<div class="overlay-title ${cls}">${mark} &nbsp; ${esc(ov.karmaHint)}</div>`;
        html += `<div class="greeting">${esc(ov.reaction)}</div>`;
        html += `<div class="teaching"><h4>── Selitys ──</h4>${esc(ov.teaching)}</div>`;
        if (ov.marked) {
          html += `<div style="color:#3fb950;margin-top:12px">✓ Merkitty opiskelulistalle — Kysy AI:lta.</div>`;
        }
        html += `<div class="hint" style="margin-top:16px">Enter = jatka &nbsp;|&nbsp; <span style="color:#d2a8ff">[m]</span> selitys ei riittänyt — haluan opiskella lisää</div>`;
        setToolbar([
          { key: "m", label: "m merkitse", cls: "ai" },
          { key: "enter", label: "Enter — jatka" },
        ]);
        return html;
      }

      if (ov.type === "aiStudy") {
        html += `<div class="overlay-title ai">═══ AI-opetus (ChatCorp™) ═══</div>`;
        html += `<div class="stats" style="margin-bottom:8px"><span style="color:#f85149">-${ov.cost} karma</span> &nbsp; Karma: ${state.karma}</div>`;
        html += `<div><span class="entity-name">${esc(ov.entityName)}</span> <span style="color:#8b949e">katselee sivuun kun kaivat puhelimen.</span></div>`;
        html += `<div class="greeting" style="white-space:pre-wrap">${esc(ov.text)}</div>`;
        html += `<div class="hint" style="margin-top:16px">Paina Enter palataksesi kysymykseen…</div>`;
        setToolbar([{ key: "enter", label: "Enter — takaisin" }]);
        return html;
      }

      if (ov.type === "banter") {
        html += `<div class="overlay-title">═══ ${esc(ov.title)} ═══</div>`;
        html += `<div class="banter-line"><span class="banter-you">Sinä:</span> "${esc(ov.playerLine)}"</div>`;
        html += `<div class="banter-line"><span class="banter-npc">${esc(ov.entityName)}:</span> ${esc(ov.npcLine)}</div>`;
        html += `<div class="hint" style="margin-top:16px">Paina Enter…</div>`;
        setToolbar([{ key: "enter", label: "Enter — jatka" }]);
        return html;
      }

      if (ov.type === "cardReturn") {
        html += `<div class="overlay-title">═══ Kulkukortti ═══</div>`;
        html += `<div class="greeting">${esc(ov.entityName)} etsii kadonnutta korttiaan. Sinulla on se taskussa.</div>`;
        html += `<div class="choice"><span class="choice-num">[1]</span> Palauta kortti (+karma)</div>`;
        html += `<div class="choice"><span class="choice-num">[2]</span> Väitä ettei ole sinulla</div>`;
        html += `<div class="choice"><span class="choice-num">[3]</span> Poistu</div>`;
        setToolbar([
          { key: "1", label: "1 palauta" },
          { key: "2", label: "2 valehtele" },
          { key: "3", label: "3 poistu", cls: "muted" },
        ]);
        return html;
      }

      if (ov.type === "action") {
        html += `<div class="overlay-title">═══ Käytä esinettä ═══</div>`;
        html += `<div class="greeting">Kohde: <b>${esc(ov.targetName)}</b></div>`;
        for (const item of ov.items || []) {
          html += `<div class="choice"><span class="choice-num">[${item.n}]</span> ${esc(item.label)}</div>`;
        }
        html += `<div class="choice muted"><span class="choice-num">[4]</span> Peruuta</div>`;
        html += `<div class="hint" style="margin-top:12px">Valitse esine — USB + työasema, vasara + kone…</div>`;
        setToolbar([
          ...(ov.items || []).map((item) => ({ key: String(item.n), label: `${item.n}` })),
          { key: "4", label: "4 peru", cls: "muted" },
        ]);
        return html;
      }

      if (ov.type === "actionResult") {
        const cls = ov.ok ? "ok" : "bad";
        html += `<div class="overlay-title ${cls}">═══ Tulos ═══</div>`;
        if (ov.karmaHint) {
          html += `<div class="stats" style="margin-bottom:8px">${esc(ov.karmaHint)}</div>`;
        }
        html += `<div class="greeting">${esc(ov.message)}</div>`;
        html += `<div class="hint" style="margin-top:16px">Enter = jatka</div>`;
        setToolbar([{ key: "enter", label: "Enter — jatka" }]);
        return html;
      }

      return html + `<div>Tuntematon overlay: ${esc(ov.type)}</div>`;
    }

    function renderEncounter(state) {
      updateMobileChrome(state);
      const enc = state.encounter;
      let html = screenHeader(state);
      html += `<div class="entity"><span class="entity-char">[ ${esc(enc.char)} ]</span> <span class="entity-name">${esc(enc.name)}</span></div>`;

      if (state.overlay) {
        setMapContent(renderOverlay(state.overlay, state));
        if (hintEl) hintEl.textContent = isMobileLayout() ? "" : "q = lopeta";
        return;
      }

      if (enc.mode === "quiz" && state.quiz) {
        const q = state.quiz;
        const side = q.sideMenu;
        html += `<div class="greeting">${esc(q.greeting)}</div>`;
        for (const c of q.choices) {
          html += `<div class="choice"><span class="choice-num">[${c.n}]</span> ${esc(c.text)}</div>`;
        }
        html += `<div class="divider">── tai ──</div>`;
        html += `<div class="side-opt"><span class="side-key ai">[a]</span> Kysy AI:lta <span style="color:#f85149">(-${side.aiCost} karma)</span></div>`;
        html += `<div class="side-opt"><span class="side-key joke">[j]</span> ${esc(side.jokeLabel)}</div>`;
        if (side.askColleagueLabel) {
          html += `<div class="side-opt"><span class="side-key joke">[n]</span> ${esc(side.askColleagueLabel)}</div>`;
        }
        html += `<div class="side-opt"><span class="side-key meh">[i]</span> ${esc(side.mehLabel)}</div>`;
        html += `<div class="side-opt"><span class="side-key leave">[p]</span> ${esc(side.leaveLabel)}</div>`;
        html += `<div class="side-opt"><span class="side-key attack">[h]</span> Hyökkää kimppuun</div>`;

        setToolbar([
          ...q.choices.map((c) => ({ key: String(c.n), label: String(c.n) })),
          ...(side.askColleagueLabel ? [{ key: "n", label: "n kollega" }] : []),
          { key: "a", label: "a AI", cls: "ai" },
          { key: "j", label: "j vitsi" },
          { key: "i", label: "i sama", cls: "muted" },
          { key: "p", label: "p poistu", cls: "muted" },
          { key: "h", label: "h hyökkää", cls: "danger" },
        ]);
        if (hintEl) hintEl.textContent = isMobileLayout() ? "" : enc.hintLine + "  |  q = lopeta";
      } else {
        html += `<div class="greeting">${esc(enc.greeting)}</div>`;
        for (const opt of state.dialogOptions || []) {
          const cls = opt.style === "danger" ? "attack-warn" : opt.style === "muted" ? "muted" : "choice-num";
          const warn = opt.key === "2" && enc.attackWarning ? `<span class="attack-warn">${esc(enc.attackWarning)}</span>` : "";
          html += `<div class="choice"><span class="${cls}">[${opt.key}]</span> ${esc(opt.label)}${warn}</div>`;
        }
        setToolbar([
          { key: "1", label: "1 juttele" },
          { key: "2", label: "2 hyökkää", cls: "danger" },
          { key: "3", label: "3 vitsi" },
          { key: "4", label: "4 poistu", cls: "muted" },
        ]);
        if (hintEl) hintEl.textContent = isMobileLayout() ? "" : (enc.hintLine || "") + "  |  q = lopeta";
      }

      setMapContent(html);
    }

    function setToolbar(buttons: { key: string; label: string; cls?: string; action?: () => void }[]) {
      if (!toolbarEl) return;
      if (isMobileLayout()) {
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

    function renderMapToolbar(state?: State) {
      const onElevator = Boolean(state?.onElevator);
      if (!onElevator) {
        elevatorPickerCollapsed = false;
        wasOnElevator = false;
      } else if (!wasOnElevator) {
        elevatorPickerCollapsed = false;
      }
      wasOnElevator = onElevator;

      if (isMobileLayout()) {
        if (toolbarEl) {
          setMobileMapToolbar(toolbarEl, sendKey, resetGame, {
            onElevator,
            floors: state?.elevatorFloors,
            pickerCollapsed: elevatorPickerCollapsed,
            onExpandPicker: () => {
              elevatorPickerCollapsed = false;
              render(game.snapshot());
            },
          });
        }
        return;
      }
      setToolbar([
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
        { key: "o", label: "o hahmot (debug)" },
        { key: "reset", label: "↺ alusta", cls: "danger" },
      ]);
      hintEl.textContent = "WASD | t=työkalu x=murra/kaiva | e=käytä | i=inventaario | b=opiskelu | h piiloudu | ?=valikko | q lopeta";
    }

    function updateMobileChrome(state: State) {
      renderHudStats(hudStatsEl, state, esc);
      renderMessageBar(messageBarEl, state, esc);
    }

    function renderMobileMap(state: State) {
      updateMobileChrome(state);
      setMapTextView(false);
      const cropped = cropMapLines(state.lines);
      const mapHtml = `<pre class="map-grid">${cropped.map((line, row) => colorizeLine(line, state, row)).join("\n")}</pre>`;
      if (mapEl) mapEl.innerHTML = mapHtml;
      renderMapToolbar(state);
    }

    function render(state) {
      if (isMobileLayout()) {
        updateMobileChrome(state);
      } else if (jsonEl && metaEl) {
        jsonEl.textContent = JSON.stringify(state, null, 2);
        metaEl.innerHTML = `screen=<b>${state.screen}</b> karma=${state.karma} deaths=${state.deaths} ` +
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

      if (!isMobileLayout() && statusEl) {
        statusEl.textContent = state.status || "";
      }

      if (state.castListOpen) {
        mapEl.innerHTML =
          `<div class="banner">${esc(BANNER)}</div>${statsLine(state)}` +
          `<pre style="white-space:pre-wrap;background:transparent;border:none;padding:0;margin:12px 0;color:#c9d1d9;font-size:12px;line-height:1.45">${esc(state.castListText || "")}</pre>`;
        setToolbar([
          { key: "o", label: "o sulje" },
          { key: "enter", label: "Enter sulje" },
        ]);
        hintEl.textContent = "DEBUG — hahmolista poistuu tuotannosta | o / Enter = sulje | q = lopeta";
        return;
      }

      if (state.screen === "inventory") {
        const invText = (state.inventoryLines || []).join("\n");
        mapEl.innerHTML =
          `<div class="banner">${esc(BANNER)}</div>${statsLine(state)}` +
          `<div style="color:#39c5cf;font-weight:bold;margin:12px 0">═══ Inventaario ═══</div>` +
          `<pre style="white-space:pre-wrap;background:transparent;border:none;padding:0;margin:0">${esc(invText)}</pre>`;
        setToolbar([{ key: "enter", label: "Enter — takaisin" }, { key: "i", label: "i takaisin" }]);
        hintEl.textContent = "Enter / mikä tahansa näppäin = takaisin kartalle | q = lopeta";
        return;
      }

      if (state.screen === "menu") {
        let html = `<div class="banner">${esc(BANNER)}</div>${statsLine(state)}`;
        const lessons = (state.menuItems || []).filter((item) => item.category !== "social");
        const social = (state.menuItems || []).filter((item) => item.category === "social");
        if (lessons.length) {
          html += `<div style="color:#39c5cf;font-weight:bold;margin:12px 0">═══ Oppitunnit ═══</div>`;
          for (const item of lessons) {
            html += `<div class="choice"><span class="choice-num">[${item.n}]</span> ${esc(item.title)}</div>`;
            if (item.description) {
              html += `<div style="color:#8b949e;margin:0 0 8px 1.5em">${esc(item.description)}</div>`;
            }
          }
        }
        if (social.length) {
          html += `<div style="color:#d2a8ff;font-weight:bold;margin:12px 0">═══ Social chats ═══</div>`;
          for (const item of social) {
            html += `<div class="choice"><span class="choice-num">[${item.n}]</span> ${esc(item.title)}</div>`;
            if (item.description) {
              html += `<div style="color:#8b949e;margin:0 0 8px 1.5em">${esc(item.description)}</div>`;
            }
          }
        }
        if (state.menuMessage) {
          html += `<div class="warn" style="margin-top:8px">${esc(state.menuMessage)}</div>`;
        }
        html += `<div class="hint" style="margin-top:12px">Valitse numero tai nappi — m / Enter = takaisin toimistolle</div>`;
        mapEl.innerHTML = html;
        const menuBtns = (state.menuItems || []).map((item) => ({
          key: String(item.n),
          label: `${item.n}. ${item.title}`,
        }));
        setToolbar([
          ...menuBtns,
          { key: "m", label: "m takaisin", cls: "muted" },
        ]);
        hintEl.textContent = "1–9 = oppitunti | m / Enter = kartalle | q = lopeta";
        return;
      }

      if (state.screen === "studylist") {
        const text = state.studyListText || "";
        let html = screenHeader(state);
        html += `<div style="margin:12px 0"><button type="button" id="study-copy-btn">Kopioi leikepöydälle</button></div>`;
        html += `<pre style="white-space:pre-wrap;background:transparent;border:none;padding:0;margin:0">${esc(text)}</pre>`;
        setMapContent(html);
        document.getElementById("study-copy-btn")?.addEventListener("click", () => {
          void copyStudyListToClipboard(text);
        });
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
          html += `<div class="hint" style="margin-top:16px">Enter = jatka</div>`;
          setMapContent(html);
          setToolbar([{ key: "enter", label: "Enter — jatka" }]);
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
            html += `<div class="choice"><span class="choice-num">[${n}]</span> Juttele — ${esc(panel.talkName || "")}</div>`;
            toolbar.push({ key: String(n), label: `${n} juttele` });
            n += 1;
          }
          if ((panel.tools || []).length > 0) {
            html += `<div class="choice"><span class="choice-num">[${n}]</span> Käytä työkalua</div>`;
            toolbar.push({ key: String(n), label: `${n} työkalu` });
            n += 1;
          }
          html += `<div class="choice muted"><span class="choice-num">[${n}]</span> Peruuta</div>`;
          toolbar.push({ key: String(n), label: `${n} peru`, cls: "muted" });
          setMapContent(html);
          setToolbar(toolbar);
          hintEl.textContent = panel.hintLine || "q = lopeta";
          return;
        }
        html += `<div class="overlay-title">═══ Käytä työkalua ═══</div>`;
        html += `<div class="greeting">Kohde: <b>${esc(panel.targetName || "Kohde")}</b></div>`;
        for (const item of panel.tools || []) {
          html += `<div class="choice"><span class="choice-num">[${item.n}]</span> ${esc(item.label)}</div>`;
        }
        html += `<div class="choice muted"><span class="choice-num">[4]</span> Peruuta</div>`;
        setMapContent(html);
        setToolbar([
          ...(panel.tools || []).map((item) => ({ key: String(item.n), label: `${item.n}` })),
          { key: "4", label: "4 peru", cls: "muted" },
        ]);
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
          html += `<div class="hint" style="margin-top:16px">Enter = jatka</div>`;
          mapEl.innerHTML = html;
          setToolbar([{ key: "enter", label: "Enter — jatka" }]);
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
          html += `<div class="hint" style="margin-top:16px">Enter = palaa kartalle</div>`;
          mapEl.innerHTML = html;
          setToolbar([{ key: "enter", label: "Enter — kartalle" }]);
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
          html += `<button id="codeSubmit" style="margin-top:8px">Lähetä vastaus</button>`;
          html += `</div>`;
          mapEl.innerHTML = html;
          document.getElementById("codeSubmit")?.addEventListener("click", () => {
            const val = document.getElementById("codeInput")?.value ?? "";
            sendCode(val);
          });
          document.getElementById("codeInput")?.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendCode(e.target.value);
            }
          });
          setToolbar([]);
          hintEl.textContent = "Kirjoita vastaus ja paina Enter tai Lähetä | q = lopeta";
          return;
        }

        if (s.choiceTexts?.length) {
          s.choiceTexts.forEach((t, i) => {
            html += `<div class="choice"><span class="choice-num">[${i + 1}]</span> ${esc(t)}</div>`;
          });
          mapEl.innerHTML = html;
          setToolbar(s.choiceTexts.map((_, i) => ({ key: String(i + 1), label: String(i + 1) })));
          hintEl.textContent = "Valitse 1–" + s.choiceTexts.length + " | q = lopeta";
          return;
        }

        mapEl.innerHTML = html;
        setToolbar([{ key: "enter", label: "Enter — jatka" }]);
        hintEl.textContent = "Enter = jatka | q = lopeta";
        return;
      }

      if (state.lines) {
        if (isMobileLayout()) {
          renderMobileMap(state);
          return;
        }
        const studyLine = state.studyCounts?.total > 0
          ? `<div style="color:#d2a8ff;margin-bottom:8px">Opiskelulista (b): ${state.studyCounts.wantMore} Kysy AI:lta, ${state.studyCounts.wrongAnswers} väärin</div>`
          : "";
        const mapHtml = `<div class="banner">${esc(BANNER)}</div>${statsLine(state)}` +
          studyLine +
          (state.floorTitle ? `<div style="color:#39c5cf;margin-bottom:8px">${esc(state.floorTitle)}</div>` : "") +
          state.lines.map((line, row) => colorizeLine(line, state, row)).join("\n") +
          (state.hint ? `<div class="hint" style="margin-top:12px">${esc(state.hint)}</div>` : "");
        mapEl.innerHTML = mapHtml;
        renderMapToolbar();
        return;
      }

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

    window.addEventListener("keydown", (e) => {
      const k = normalizeKey(e);
      const state = game.snapshot();
      if (state.screen === "studylist" && k === "c") {
        e.preventDefault();
        void copyStudyListToClipboard(state.studyListText || "");
        return;
      }
      if (!GAME_KEYS.has(k)) return;
      e.preventDefault();
      sendKey(k);
    });

    function tick() {
      render(game.snapshot());
    }

    tick();
    setInterval(tick, 500);
}
