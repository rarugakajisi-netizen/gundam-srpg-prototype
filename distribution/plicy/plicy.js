"use strict";

(() => {
  const navigationActions = new Set([
    "title",
    "stage-select",
    "free-battle-select",
    "card-list",
    "choice-card",
    "select-stage",
    "select-free-battle-map",
    "back-setup"
  ]);

  const quickNav = document.createElement("nav");
  quickNav.className = "plicy-quick-nav";
  quickNav.setAttribute("aria-label", "画面内の移動");
  quickNav.hidden = true;
  quickNav.innerHTML = `
    <button type="button" data-plicy-jump="primary"></button>
    <button type="button" data-plicy-jump="secondary"></button>
  `;
  document.body.append(quickNav);

  function activeScreen(id) {
    const screen = document.querySelector(id);
    return Boolean(screen && !screen.classList.contains("hidden"));
  }

  function quickNavMode() {
    const battleScreen = document.querySelector("#battleScreen");
    if (activeScreen("#battleScreen") && battleScreen.querySelector(".board-wrap")) return "battle";
    const setupScreen = document.querySelector("#setupScreen");
    if (activeScreen("#setupScreen") && setupScreen.classList.contains("setup-layout") && setupScreen.querySelector(".setup-roster-panel")) return "setup";
    return "";
  }

  function refreshQuickNav() {
    const mode = quickNavMode();
    const buttons = quickNav.querySelectorAll("button");
    quickNav.hidden = !mode;
    document.body.classList.toggle("plicy-quick-nav-active", Boolean(mode));
    if (mode === "battle") {
      buttons[0].textContent = "盤面へ";
      buttons[0].dataset.plicyTarget = ".board-wrap";
      buttons[1].textContent = "操作へ";
      buttons[1].dataset.plicyTarget = ".side-panel";
    } else if (mode === "setup") {
      buttons[0].textContent = "部隊へ";
      buttons[0].dataset.plicyTarget = ".setup-roster-panel";
      buttons[1].textContent = "追加へ";
      buttons[1].dataset.plicyTarget = "#setupScreen > section.panel";
    }
  }

  document.addEventListener("click", (event) => {
    const jumpButton = event.target.closest("[data-plicy-jump]");
    if (jumpButton) {
      document.querySelector(jumpButton.dataset.plicyTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const action = event.target.closest("[data-action]")?.dataset.action;
    if (navigationActions.has(action)) {
      requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
    }
  });

  for (const screen of [document.querySelector("#setupScreen"), document.querySelector("#battleScreen")]) {
    if (!screen) continue;
    new MutationObserver(refreshQuickNav).observe(screen, {
      attributes: true,
      attributeFilter: ["class"],
      childList: true
    });
  }

  refreshQuickNav();
})();
