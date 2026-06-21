#!/usr/bin/env node
/** Lisää sourceUrl/sourceRef alkuperäisiin kysymyksiin joilta ne puuttuvat. */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const banksDir = resolve(dirname(fileURLToPath(import.meta.url)), "../content/question-banks");

const OVERRIDES = {
  "tools-auto": { sourceUrl: "https://en.cppreference.com/w/cpp/language/auto", sourceRef: "cpp-best-practices/02-Use_the_Tools_Available.md" },
  "tools-nullptr": { sourceUrl: "https://en.cppreference.com/w/cpp/language/nullptr", sourceRef: "cpp-best-practices/02-Use_the_Tools_Available.md" },
  "tools-constexpr": { sourceUrl: "https://en.cppreference.com/w/cpp/language/constexpr", sourceRef: "cpp-best-practices/02-Use_the_Tools_Available.md" },
  "tools-enum-class": { sourceUrl: "https://en.cppreference.com/w/cpp/language/enum", sourceRef: "cpp-best-practices/03-Style.md" },
  "style-const-ref": { sourceUrl: "https://github.com/cpp-best-practices/cppbestpractices/blob/master/03-Style.md", sourceRef: "cpp-best-practices/03-Style.md" },
  "style-pass-int": { sourceUrl: "https://github.com/cpp-best-practices/cppbestpractices/blob/master/03-Style.md", sourceRef: "cpp-best-practices/03-Style.md" },
  "style-override": { sourceUrl: "https://en.cppreference.com/w/cpp/language/override", sourceRef: "cpp-best-practices/03-Style.md" },
  "safety-unique-ptr": { sourceUrl: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rf-unique_ptr", sourceRef: "cpp-best-practices/04-Considering_Safety.md" },
  "safety-vector": { sourceUrl: "https://github.com/cpp-best-practices/cppbestpractices/blob/master/04-Considering_Safety.md", sourceRef: "cpp-best-practices/04-Considering_Safety.md" },
  "safety-static-cast": { sourceUrl: "https://github.com/cpp-best-practices/cppbestpractices/blob/master/04-Considering_Safety.md", sourceRef: "cpp-best-practices/04-Considering_Safety.md" },
  "safety-exceptions": { sourceUrl: "https://github.com/cpp-best-practices/cppbestpractices/blob/master/04-Considering_Safety.md", sourceRef: "cpp-best-practices/04-Considering_Safety.md" },
  "safety-variadic": { sourceUrl: "https://github.com/cpp-best-practices/cppbestpractices/blob/master/04-Considering_Safety.md", sourceRef: "cpp-best-practices/04-Considering_Safety.md" },
  "safety-rule-of-zero": { sourceUrl: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rc-zero", sourceRef: "cpp-best-practices/04-Considering_Safety.md" },
  "safety-avoid-c-array": { sourceUrl: "https://github.com/cpp-best-practices/cppbestpractices/blob/master/04-Considering_Safety.md", sourceRef: "cpp-best-practices/04-Considering_Safety.md" },
  "maintain-const-method": { sourceUrl: "https://github.com/cpp-best-practices/cppbestpractices/blob/master/06-Maintainability.md", sourceRef: "cpp-best-practices/06-Maintainability.md" },
  "maintain-range-for": { sourceUrl: "https://en.cppreference.com/w/cpp/language/range-for", sourceRef: "cpp-best-practices/06-Maintainability.md" },
  "maintain-string-view": { sourceUrl: "https://en.cppreference.com/w/cpp/string/basic_string_view", sourceRef: "cpp-best-practices/06-Maintainability.md" },
  "portability-explicit": { sourceUrl: "https://en.cppreference.com/w/cpp/language/explicit", sourceRef: "cpp-best-practices/05-Portability.md" },
  "thread-atomic": { sourceUrl: "https://en.cppreference.com/w/cpp/atomic/atomic", sourceRef: "cpp-best-practices/08-Threadability.md" },
  "thread-lock-guard": { sourceUrl: "https://en.cppreference.com/w/cpp/thread/lock_guard", sourceRef: "cpp-best-practices/08-Threadability.md" },
  "perf-move": { sourceUrl: "https://en.cppreference.com/w/cpp/utility/move", sourceRef: "cpp-best-practices/07-Performance.md" },
  "perf-noexcept": { sourceUrl: "https://en.cppreference.com/w/cpp/language/noexcept", sourceRef: "cpp-best-practices/07-Performance.md" },
  "correct-ub": { sourceUrl: "https://en.cppreference.com/w/cpp/language/ub", sourceRef: "cpp-best-practices/07-Correctness.md" },
  "correct-signed-unsigned": { sourceUrl: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Res-mix", sourceRef: "cpp-best-practices/07-Correctness.md" },
  "docker-bridge-dns": { sourceUrl: "https://docs.docker.com/network/drivers/bridge/", sourceRef: "docker-docs/network/bridge" },
  "docker-host-network": { sourceUrl: "https://docs.docker.com/network/drivers/host/", sourceRef: "docker-docs/network/host" },
  "docker-overlay": { sourceUrl: "https://docs.docker.com/network/drivers/overlay/", sourceRef: "docker-docs/network/overlay" },
  "docker-compose-network": { sourceUrl: "https://docs.docker.com/compose/networking/", sourceRef: "docker-docs/compose/networking" },
  "docker-exit-code": { sourceUrl: "https://docs.docker.com/engine/containers/start-containers-automatically/", sourceRef: "docker-docs/containers" },
  "docker-inspect-network": { sourceUrl: "https://docs.docker.com/reference/cli/docker/inspect/", sourceRef: "docker-docs/inspect" },
  "docker-macvlan": { sourceUrl: "https://docs.docker.com/network/drivers/macvlan/", sourceRef: "docker-docs/network/macvlan" },
  "systemd-wants-requires": { sourceUrl: "https://www.freedesktop.org/software/systemd/man/systemd.unit.html", sourceRef: "systemd/unit" },
  "systemd-restart-policy": { sourceUrl: "https://www.freedesktop.org/software/systemd/man/systemd.service.html", sourceRef: "systemd/service" },
  "journald-persistent": { sourceUrl: "https://www.freedesktop.org/software/systemd/man/journald.conf.html", sourceRef: "systemd/journald" },
  "journalctl-filter": { sourceUrl: "https://www.freedesktop.org/software/systemd/man/journalctl.html", sourceRef: "systemd/journalctl" },
  "linux-ip-route": { sourceUrl: "https://man7.org/linux/man-pages/man8/ip-route.8.html", sourceRef: "man7/ip-route" },
  "linux-nmcli": { sourceUrl: "https://networkmanager.dev/docs/api/latest/nmcli.html", sourceRef: "networkmanager/nmcli" },
  "avahi-mdns": { sourceUrl: "https://avahi.org/", sourceRef: "avahi.org" },
  "avahi-service-xml": { sourceUrl: "https://avahi.org/manpages.html", sourceRef: "avahi/services" },
  "scrum-dod-partial": { sourceUrl: "https://github.com/janpetzold/scrum-best-practices", sourceRef: "scrum-best-practices/definition-of-done" },
  "scrum-dor-criteria": { sourceUrl: "https://github.com/janpetzold/scrum-best-practices", sourceRef: "scrum-best-practices/definition-of-ready" },
  "scrum-team-size": { sourceUrl: "https://scrumguides.org/scrum-guide.html", sourceRef: "scrum-guide/team" },
  "scrum-retro": { sourceUrl: "https://scrumguides.org/scrum-guide.html", sourceRef: "scrum-guide/events/retro" },
  "scrum-planning-poker": { sourceUrl: "https://github.com/janpetzold/scrum-best-practices", sourceRef: "scrum-best-practices/estimation" },
  "scrum-velocity-range": { sourceUrl: "https://github.com/janpetzold/scrum-best-practices", sourceRef: "scrum-best-practices/velocity" },
  "scrum-story-split": { sourceUrl: "https://github.com/janpetzold/scrum-best-practices", sourceRef: "scrum-best-practices/story-splitting" },
  "scrum-multitask": { sourceUrl: "https://github.com/janpetzold/scrum-best-practices", sourceRef: "scrum-best-practices/prioritization" },
};

let fixed = 0;
for (const file of readdirSync(banksDir).filter((f) => f.endsWith(".json"))) {
  const path = resolve(banksDir, file);
  const bank = JSON.parse(readFileSync(path, "utf8"));
  let changed = false;
  for (const q of bank.questions || []) {
    if (q.sourceUrl) continue;
    const o = OVERRIDES[q.id] || { sourceUrl: bank.source, sourceRef: `${bank.id}/${q.featureId || q.chapter}` };
    q.sourceUrl = o.sourceUrl;
    if (!q.sourceRef) q.sourceRef = o.sourceRef;
    fixed += 1;
    changed = true;
  }
  if (changed) writeFileSync(path, `${JSON.stringify(bank, null, 2)}\n`);
}
console.log(`Backfilled sourceUrl on ${fixed} questions`);
