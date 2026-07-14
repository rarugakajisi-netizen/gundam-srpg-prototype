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
    value: ""
  };
  const math = Object.create(Math);
  math.random = () => 0.5;
  const context = vm.createContext({
    console,
    Math: math,
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

function loadRuntime() {
  const context = browserContext();
  const files = [...DATA_FILES, ...RUNTIME_FILES.filter((file) => file !== "src/events.js")];
  for (const file of files) {
    vm.runInContext(fs.readFileSync(projectPath(file), "utf8"), context, { filename: file });
  }
  vm.runInContext(`
    state.data = window.GAME_DATA;
    state.data.maps.push({
      id: "enemyAiTestMap",
      name: "Enemy AI Test",
      type: "space",
      width: 10,
      height: 10,
      terrain: Array(100).fill("space")
    });
    state.data.campaign.stages.push({ mapId: "enemyAiTestMap", enemyFaction: "zeon" });
    state.selectedMapId = "enemyAiTestMap";
    renderBattle = () => {};
    checkOutcome = () => {};
    spawnStageEnemyReinforcementsForTurn = () => {};
  `, context);
  return context;
}

function evaluate(context, source) {
  return vm.runInContext(source, context);
}

function resetBattle(context, unitSource) {
  evaluate(context, `
    state.units = ${unitSource};
    state.phase = "enemy";
    state.outcome = null;
    state.turnNumber = 1;
    state.enemyQueue = enemyTurnQueue();
    state.selectedUnitId = null;
    state.selectedTargetId = null;
    state.mines = [];
    state.log = [];
  `);
}

function main() {
  const context = loadRuntime();
  const aiSource = fs.readFileSync(projectPath("src/battle-rules.js"), "utf8");
  assert.equal(/selectedMapId\s*===|stageConfig\([^)]*\)\.(?:mapId|id)/.test(aiSource), false,
    "Enemy AI must not branch on a specific stage id");

  resetBattle(context, `[
    makeBattleship("musai", [], "enemy", 1, 1),
    makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 5, 1, 0),
    makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: [] }, "player", 5, 2, 0)
  ]`);
  evaluate(context, `state.units.find((unit) => unit.side === "enemy" && isMobileSuit(unit)).armor = 60; advanceEnemyTurn();`);
  const retreat = evaluate(context, `(() => {
    const unit = state.units.find((item) => item.side === "enemy" && isMobileSuit(item));
    const ship = nearestAlliedBattleship(unit);
    return { distance: distance(unit, ship), acted: unit.acted, fired: unit.usedWeaponIds.length, log: state.log.join("\\n") };
  })()`);
  assert.equal(retreat.distance, 1, "Critically damaged MS should retreat adjacent to the nearest battleship");
  assert.equal(retreat.acted, true, "Retreat should consume the MS action");
  assert.equal(retreat.fired, 0, "Retreat should override an available attack");
  assert.match(retreat.log, /補給のため後退/);

  evaluate(context, `for (let step = 0; state.phase === "enemy" && step < 20; step += 1) advanceEnemyTurn();`);
  const repairedArmor = evaluate(context, `state.units.find((unit) => unit.side === "enemy" && isMobileSuit(unit)).armor`);
  assert.ok(repairedArmor > 60, "An MS that retreated adjacent should receive end-of-turn repair");

  resetBattle(context, `[
    makeBattleship("musai", [], "enemy", 1, 1),
    makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 2, 1, 0),
    makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: [] }, "player", 3, 1, 0)
  ]`);
  evaluate(context, `state.units.find((unit) => unit.side === "enemy" && isMobileSuit(unit)).armor = 60; advanceEnemyTurn();`);
  const waiting = evaluate(context, `(() => {
    const unit = state.units.find((item) => item.side === "enemy" && isMobileSuit(item));
    return { fired: unit.usedWeaponIds.length, acted: unit.acted, log: state.log.join("\\n") };
  })()`);
  assert.equal(waiting.fired, 0, "An adjacent critical MS should wait instead of taking a tempting attack");
  assert.equal(waiting.acted, true);
  assert.match(waiting.log, /補給修理を待つ/);

  const queueTypes = evaluate(context, "enemyTurnQueue().map((id) => state.units.find((unit) => unit.id === id).type)");
  assert.deepEqual([...queueTypes], ["mobileSuit", "battleship"], "Enemy mobile suits should act before support ships");

  const shipMove = evaluate(context, `(() => {
    const ship = state.units.find((unit) => isBattleship(unit));
    const targets = state.units.filter((unit) => unit.side === "player" && isAttackTarget(unit));
    const move = bestEnemyMove(ship, targets, targets);
    return move ? { distance: Math.abs(move.x - 2) + Math.abs(move.y - 1) } : null;
  })()`);
  assert.ok(shipMove === null || shipMove.distance === 1,
    "A support ship may reposition, but must remain adjacent to a waiting damaged MS");

  resetBattle(context, `[
    makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 2, 1, 0),
    makeBattleship("whiteBase", [], "player", 3, 1)
  ]`);
  evaluate(context, "advanceEnemyTurn();");
  const firstAttackCount = evaluate(context, `state.units.find((unit) => unit.side === "enemy").usedWeaponIds.length`);
  evaluate(context, "advanceEnemyTurn();");
  const secondAttackCount = evaluate(context, `state.units.find((unit) => unit.side === "enemy").usedWeaponIds.length`);
  assert.ok(firstAttackCount > 0 && secondAttackCount > firstAttackCount,
    "A moved enemy should continue using its remaining weapons on later AI steps");

  evaluate(context, `state.data.campaign.stages.find((stage) => stage.mapId === "enemyAiTestMap").infiltrationTargets = [{ x: 8, y: 8 }];`);
  const infiltrationScores = evaluate(context, `(() => {
    const unit = state.units.find((item) => item.side === "enemy" && isMobileSuit(item));
    return {
      near: withUnitPosition(unit, 7, 8, () => infiltrationObjectiveScore(unit)),
      far: withUnitPosition(unit, 2, 2, () => infiltrationObjectiveScore(unit))
    };
  })()`);
  assert.ok(infiltrationScores.near > infiltrationScores.far,
    "Infiltration behavior should be derived from generic stage objective coordinates");

  const guardScores = evaluate(context, `(() => {
    const stage = state.data.campaign.stages.find((item) => item.mapId === "enemyAiTestMap");
    delete stage.infiltrationTargets;
    state.units.push(makeDestructionTarget({ name: "Test Objective", armor: 200, faction: "zeon" }, 0, 8, 8));
    const unit = state.units.find((item) => item.side === "enemy" && isMobileSuit(item));
    const opponents = state.units.filter((item) => item.side === "player" && isAttackTarget(item));
    return {
      near: withUnitPosition(unit, 7, 8, () => enemyGuardObjectiveScore(unit, opponents)),
      far: withUnitPosition(unit, 2, 2, () => enemyGuardObjectiveScore(unit, opponents))
    };
  })()`);
  assert.ok(guardScores.near > guardScores.far,
    "Enemy defenders should guard any configured destruction target without a stage-specific branch");

  const timedScores = evaluate(context, `(() => {
    const stage = state.data.campaign.stages.find((item) => item.mapId === "enemyAiTestMap");
    stage.turnLimit = 8;
    delete stage.surviveTurns;
    state.units = state.units.filter((item) => !isDestructionTarget(item));
    const unit = state.units.find((item) => item.side === "enemy" && isMobileSuit(item));
    const opponents = state.units.filter((item) => item.side === "player" && isAttackTarget(item));
    return {
      near: withUnitPosition(unit, 4, 1, () => enemyDelayObjectiveScore(unit, opponents)),
      far: withUnitPosition(unit, 9, 9, () => enemyDelayObjectiveScore(unit, opponents))
    };
  })()`);
  assert.ok(timedScores.far > timedScores.near,
    "Turn-limit enemies should value delaying positions from the generic turnLimit field");

  const survivalScores = evaluate(context, `(() => {
    const stage = state.data.campaign.stages.find((item) => item.mapId === "enemyAiTestMap");
    delete stage.turnLimit;
    stage.surviveTurns = 6;
    const unit = state.units.find((item) => item.side === "enemy" && isMobileSuit(item));
    const opponents = state.units.filter((item) => item.side === "player" && isAttackTarget(item));
    return {
      near: withUnitPosition(unit, 4, 1, () => enemySurvivalPressureScore(unit, opponents)),
      far: withUnitPosition(unit, 9, 9, () => enemySurvivalPressureScore(unit, opponents))
    };
  })()`);
  assert.ok(survivalScores.near > survivalScores.far,
    "Survival-stage enemies should apply pressure from the generic surviveTurns field");

  resetBattle(context, `[
    makeUnit({ msId: "gmSpartanBlackDog", characterIds: ["federationSoldier"], weaponIds: [], optionIds: [] }, "enemy", 2, 2, 0),
    makeUnit({ msId: "gundam", characterIds: ["amuroRay"], weaponIds: ["beamRifle"], optionIds: [] }, "player", 4, 2, 0)
  ]`);
  evaluate(context, `state.units.find((unit) => unit.side === "enemy").armor = 100; advanceEnemyTurn();`);
  const smokeUse = evaluate(context, `(() => {
    const unit = state.units.find((item) => item.side === "enemy");
    return { used: unit.smokeSkillUsed, grace: unit.activeConcealmentGrace, log: state.log.join("\\n") };
  })()`);
  assert.equal(smokeUse.used, true, "A threatened enemy should use its smoke discharger");
  assert.equal(smokeUse.grace, true);
  assert.match(smokeUse.log, /スモークディスチャージャー/);

  resetBattle(context, `[
    makeUnit({ msId: "blackRider", characterIds: ["federationSoldier"], weaponIds: [], optionIds: [] }, "enemy", 2, 2, 0),
    makeUnit({ msId: "gundam", characterIds: ["amuroRay"], weaponIds: ["beamRifle"], optionIds: [] }, "player", 4, 2, 0)
  ]`);
  evaluate(context, `state.units.find((unit) => unit.side === "enemy").armor = 100; advanceEnemyTurn();`);
  const camoUse = evaluate(context, `(() => {
    const unit = state.units.find((item) => item.side === "enemy");
    return { used: unit.usedWeaponIds.includes("activeCamo"), grace: unit.activeConcealmentGrace, log: state.log.join("\\n") };
  })()`);
  assert.equal(camoUse.used, true, "A threatened enemy with active camo should activate it");
  assert.equal(camoUse.grace, true);
  assert.match(camoUse.log, /アクティブ・カモ/);

  resetBattle(context, `[
    makeUnit({ msId: "hoverTruck", characterIds: ["federationSoldier"], weaponIds: [], optionIds: [] }, "enemy", 2, 2, 0),
    makeUnit({ msId: "gundam", characterIds: ["amuroRay"], weaponIds: ["beamRifle"], optionIds: [] }, "player", 5, 2, 0)
  ]`);
  evaluate(context, `state.units.find((unit) => unit.side === "player").temporarySkills = ["stealth"]; advanceEnemyTurn();`);
  const sonarWait = evaluate(context, `(() => {
    const unit = state.units.find((item) => item.side === "enemy");
    return { moved: unit.moved, acted: unit.acted, log: state.log.join("\\n") };
  })()`);
  assert.equal(sonarWait.moved, false, "Enemy sonar should preserve the stationary condition");
  assert.equal(sonarWait.acted, true);
  assert.match(sonarWait.log, /ソナーによる索敵を優先/);
  evaluate(context, "advanceEnemyTurn();");
  assert.equal(evaluate(context, `state.units.find((unit) => unit.side === "player").infiltrationExposed`), true,
    "Enemy sonar wait should reveal the concealed target at end of turn");

  console.log("Enemy AI checks passed: retreat, support wait, objectives, active concealment, sonar wait.");
}

main();
