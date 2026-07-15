#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { DATA_FILES, RUNTIME_FILES, projectPath } = require("./project-files");

function browserContext() {
  const element = {
    addEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    classList: { add() {}, remove() {}, toggle() {} },
    dataset: {},
    innerHTML: "",
    textContent: "",
    value: ""
  };
  const context = vm.createContext({
    console,
    document: {
      querySelector() { return element; },
      querySelectorAll() { return []; },
      createElement() { return { ...element }; }
    },
    localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
    setTimeout,
    clearTimeout,
    structuredClone,
    URLSearchParams,
    window: null
  });
  context.window = context;
  return context;
}

function evaluate(context, source) {
  return vm.runInContext(source, context);
}

function main() {
  const context = browserContext();
  for (const file of [...DATA_FILES, ...RUNTIME_FILES]) {
    vm.runInContext(fs.readFileSync(projectPath(file), "utf8"), context, { filename: file });
  }
  evaluate(context, `
    state.data = window.GAME_DATA;
    state.data.maps.push({
      id: "defenseRuleTestMap",
      name: "Defense Rule Test",
      type: "ground",
      width: 8,
      height: 8,
      terrain: Array(64).fill("plain")
    });
    state.data.campaign.stages.push({
      mapId: "defenseRuleTestMap",
      enemyFaction: "zeon",
      enemyBattleshipId: null,
      surviveTurns: 6,
      defenseTargets: [
        { name: "Target 1", x: 2, y: 6, armor: 300 },
        { name: "Target 2", x: 5, y: 6, armor: 300 }
      ]
    });
    state.selectedMapId = "defenseRuleTestMap";
    state.battleMode = "stage";
    state.phase = "player";
    state.turnNumber = 1;
    state.outcome = null;
    state.log = [];
    state.units = [
      makeBattleship("gunperry", [], "player", 3, 7),
      makeUnit({ msId: "gm", characterIds: ["federationSoldier"], weaponIds: ["beamSprayGun"], optionIds: [] }, "player", 3, 6, 0),
      makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 3, 1, 0),
      makeDefenseTarget({ name: "Target 1", armor: 300 }, 0, 2, 6),
      makeDefenseTarget({ name: "Target 2", armor: 300 }, 1, 5, 6)
    ];
  `);

  evaluate(context, `state.units.find((unit) => unit.name === "Target 1").armor = 0; checkOutcome();`);
  assert.equal(evaluate(context, "state.outcome"), null,
    "The default multi-target defense rule should continue while at least one target survives");

  evaluate(context, `
    state.outcome = null;
    stageConfig(state.selectedMapId).defenseTargetsMustAllSurvive = true;
    checkOutcome();
  `);
  assert.equal(evaluate(context, "state.outcome"), "敗北",
    "A must-all-survive defense mission should fail when any one target is destroyed");

  evaluate(context, `
    state.outcome = null;
    state.battleMode = "free";
  `);
  assert.equal(evaluate(context, "stageDefenseTargetsMustAllSurvive()"), false,
    "Free battle should ignore the must-all-survive stage rule");

  console.log("Defense-target checks passed: default multi-target loss, all-target survival requirement, free-battle exclusion.");
}

main();
