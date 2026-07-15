#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { DATA_FILES, RUNTIME_FILES, projectPath } = require("./project-files");

function loadRuntime() {
  const element = {
    addEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    classList: { add() {}, remove() {}, toggle() {} },
    dataset: {},
    innerHTML: "",
    value: "",
    textContent: ""
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
  for (const file of [...DATA_FILES, ...RUNTIME_FILES]) {
    vm.runInContext(fs.readFileSync(projectPath(file), "utf8"), context, { filename: file });
  }
  vm.runInContext(`
    state.data = window.GAME_DATA;
    state.collection = defaultCollection();
    state.formationProfiles = {};
    state.favoriteFormations = [];
    renderBattle = () => {};
  `, context);
  return context;
}

function evaluate(context, source) {
  return vm.runInContext(source, context);
}

function main() {
  const context = loadRuntime();
  const stageDefinition = evaluate(context, `(() => {
    state.battleMode = "campaign";
    state.selectedMapId = "demonOfFlameAndDesertFairy";
    const target = stagePlayerReachTargets()[0];
    return {
      targets: stagePlayerReachTargets(),
      terrain: terrainAt(target.x, target.y),
      blocked: terrainBlocksMovement(terrainAt(target.x, target.y))
    };
  })()`);
  assert.deepEqual(JSON.parse(JSON.stringify(stageDefinition.targets)), [{ x: 3, y: 2 }]);
  assert.equal(stageDefinition.terrain, "gate");
  assert.equal(stageDefinition.blocked, false);

  const ordinaryMove = evaluate(context, `(() => {
    state.faction = "zeon";
    state.phase = "player";
    state.outcome = null;
    state.outcomeMessage = "";
    state.resultRewards = [];
    state.log = [];
    state.mines = [];
    const unit = makeUnit({ msId: "zaku2", characterIds: [], weaponIds: [], optionIds: [] }, "player", 3, 4, 0);
    const ship = { id: "player-ship", type: "battleship", side: "player", armor: 100, x: 4, y: 9 };
    const enemy = makeUnit({ msId: "guncannon", characterIds: [], weaponIds: [], optionIds: [] }, "enemy", 7, 3, 0);
    state.units = [ship, unit, enemy];
    moveUnit(unit, 3, 3);
    return { x: unit.x, y: unit.y, outcome: state.outcome };
  })()`);
  assert.deepEqual(JSON.parse(JSON.stringify(ordinaryMove)), { x: 3, y: 3, outcome: null });

  const targetMove = evaluate(context, `(() => {
    state.phase = "player";
    state.outcome = null;
    state.outcomeMessage = "";
    state.resultRewards = [];
    state.log = [];
    state.mines = [];
    const unit = makeUnit({ msId: "zaku2", characterIds: [], weaponIds: [], optionIds: [] }, "player", 3, 3, 0);
    const ship = { id: "player-ship", type: "battleship", side: "player", armor: 100, x: 4, y: 9 };
    const enemy = makeUnit({ msId: "guncannon", characterIds: [], weaponIds: [], optionIds: [] }, "enemy", 7, 3, 0);
    state.units = [ship, unit, enemy];
    moveUnit(unit, 3, 2);
    return {
      x: unit.x,
      y: unit.y,
      reached: unitReachedPlayerTarget(unit),
      outcome: state.outcome,
      log: [...state.log]
    };
  })()`);
  assert.equal(targetMove.x, 3);
  assert.equal(targetMove.y, 2);
  assert.equal(targetMove.reached, true);
  assert.equal(targetMove.outcome, "勝利");
  assert.ok(targetMove.log.some((line) => line.includes("目標地点へ到達しました")));

  const freeBattle = evaluate(context, `(() => {
    state.battleMode = "free";
    return stagePlayerReachTargets("demonOfFlameAndDesertFairy");
  })()`);
  assert.deepEqual(JSON.parse(JSON.stringify(freeBattle)), []);

  console.log("Stage objective checks passed: Demon of Flame target definition, ordinary movement, immediate player-reach victory, free-battle exclusion.");
}

main();
