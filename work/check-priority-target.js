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
  for (const file of [...DATA_FILES, ...RUNTIME_FILES.filter((item) => item !== "src/events.js")]) {
    vm.runInContext(fs.readFileSync(projectPath(file), "utf8"), context, { filename: file });
  }
  vm.runInContext(`
    state.data = window.GAME_DATA;
    state.data.maps.push({
      id: "priorityTargetTestMap",
      name: "Priority Target Test",
      type: "ground",
      width: 10,
      height: 10,
      terrain: Array(100).fill("plain")
    });
    state.data.campaign.stages.push({ mapId: "priorityTargetTestMap", enemyFaction: "zeon" });
    state.selectedMapId = "priorityTargetTestMap";
    state.collection = { characterGrowth: {} };
    renderBattle = () => {};
    checkOutcome = () => {};
    spawnStageEnemyReinforcementsForTurn = () => {};
  `, context);
  return context;
}

function evaluate(context, source) {
  return vm.runInContext(source, context);
}

function main() {
  const context = loadRuntime();
  const skillOwners = evaluate(context, `state.data.characters
    .filter((character) => (character.specials ?? []).includes("priorityTargetDesignation"))
    .map((character) => character.id)
    .sort()`);
  assert.deepEqual([...skillOwners], ["barbaraHahli", "noelAnderson"]);

  const adjustedCharacters = evaluate(context, `Object.fromEntries(["noelAnderson", "barbaraHahli"].map((id) => {
    const character = lookup().characters[id];
    return [id, {
      cost: character.cost,
      shooting: character.shooting,
      melee: character.melee,
      reaction: character.reaction,
      command: character.command,
      support: character.support,
      maintenance: character.maintenance
    }];
  }))`);
  assert.deepEqual({ ...adjustedCharacters.noelAnderson }, {
    cost: 65, shooting: 5, melee: 3, reaction: 9, command: 15, support: 18, maintenance: 7
  });
  assert.deepEqual({ ...adjustedCharacters.barbaraHahli }, {
    cost: 85, shooting: 6, melee: 4, reaction: 9, command: 22, support: 22, maintenance: 8
  });

  const option = evaluate(context, `lookup().options.priorityTargetDesignation`);
  assert.equal(option.cost, 55);
  assert.equal(option.grantsSkill, "priorityTargetDesignation");
  assert.deepEqual([...option.factions], ["federation", "zeon"]);

  const rangeSteps = evaluate(context, `(() => {
    const character = lookup().characters.federationSoldier;
    const before = character.command;
    const values = [0, 9, 10, 14, 15, 19, 20, 24, 25, 30].map((command) => {
      character.command = command;
      const unit = makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: ["priorityTargetDesignation"] }, "player", 5, 7, command);
      return priorityTargetDesignationRange(unit);
    });
    character.command = before;
    return values;
  })()`);
  assert.deepEqual([...rangeSteps], [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);

  const designation = evaluate(context, `(() => {
    const source = makeBattleship("gunperry", ["noelAnderson"], "player", 5, 7);
    const ally = makeUnit({ msId: "ball", characterIds: ["federationSoldier"], weaponIds: [], optionIds: [] }, "player", 4, 6, 0);
    const target = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 5, 4, 0);
    state.units = [source, ally, target];
    state.phase = "player";
    state.outcome = null;
    state.log = [];
    const allyWeapon = weaponFor("ballCannon");
    const beforeHit = hitRate(ally, target, allyWeapon);
    const used = designatePriorityTarget(source, target, false);
    const afterHit = hitRate(ally, target, allyWeapon);
    const beforePosition = { x: source.x, y: source.y };
    moveUnit(source, 4, 7);
    const afterPosition = { x: source.x, y: source.y };
    Math.random = () => 0;
    attack(source, target, weaponFor("gunperryMissile"), false);
    return {
      used,
      range: priorityTargetDesignationRange(source),
      moved: source.moved,
      actedAfterDesignation: source.acted,
      hitBonus: afterHit - beforeHit,
      targetMarked: source.priorityTargetId === target.id,
      movementBlocked: beforePosition.x === afterPosition.x && beforePosition.y === afterPosition.y,
      attackAllowed: source.usedWeaponIds.includes("gunperryMissile"),
      bonusStillSingle: (() => {
        const second = makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: ["priorityTargetDesignation"] }, "player", 4, 7, 1);
        second.priorityTargetId = target.id;
        state.units.push(second);
        return priorityTargetAccuracyBonus(ally, target);
      })()
    };
  })()`);
  assert.equal(designation.used, true);
  assert.equal(designation.range, 3);
  assert.equal(designation.moved, true);
  assert.equal(designation.actedAfterDesignation, false);
  assert.equal(designation.hitBonus, 8);
  assert.equal(designation.targetMarked, true);
  assert.equal(designation.movementBlocked, true);
  assert.equal(designation.attackAllowed, true);
  assert.equal(designation.bonusStillSingle, 8, "Priority target accuracy must not stack");

  const concealedDenied = evaluate(context, `(() => {
    const source = makeBattleship("gunperry", ["noelAnderson"], "player", 5, 7);
    const target = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 5, 4, 0);
    target.temporarySkills = ["stealth"];
    state.units = [source, target];
    state.phase = "player";
    state.outcome = null;
    return {
      concealed: unitDetailsConcealedFromSide(target, "player"),
      usable: canDesignatePriorityTarget(source, target)
    };
  })()`);
  assert.deepEqual({ ...concealedDenied }, { concealed: true, usable: false });

  const barbaraRange = evaluate(context, `(() => {
    const ship = makeBattleship("papua", ["zeonOfficer", "barbaraHahli"], "enemy", 5, 2);
    const escort = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 4, 3, 0);
    state.units = [escort, ship];
    return {
      hasSkill: unitHasSkill(ship, "priorityTargetDesignation"),
      command: priorityTargetCommand(ship),
      range: priorityTargetDesignationRange(ship),
      actsBeforeEscort: enemyTurnQueue()[0] === ship.id
    };
  })()`);
  assert.deepEqual({ ...barbaraRange }, { hasSkill: true, command: 22, range: 4, actsBeforeEscort: true });

  const optionGranted = evaluate(context, `(() => {
    const unit = makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: ["priorityTargetDesignation"] }, "player", 5, 7, 0);
    return unitHasSkill(unit, "priorityTargetDesignation");
  })()`);
  assert.equal(optionGranted, true);

  const turnClear = evaluate(context, `(() => {
    const source = makeBattleship("gunperry", ["noelAnderson"], "player", 5, 7);
    const target = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 5, 4, 0);
    state.units = [source, target];
    state.phase = "player";
    state.outcome = null;
    state.log = [];
    designatePriorityTarget(source, target, false);
    endPlayerTurn();
    return { targetId: source.priorityTargetId, used: source.priorityTargetDesignationUsed, phase: state.phase };
  })()`);
  assert.deepEqual({ ...turnClear }, { targetId: null, used: false, phase: "enemy" });

  const enemyUse = evaluate(context, `(() => {
    const source = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: ["priorityTargetDesignation"] }, "enemy", 5, 3, 0);
    const target = makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: [] }, "player", 5, 4, 0);
    state.units = [source, target];
    state.phase = "enemy";
    state.outcome = null;
    state.log = [];
    state.enemyQueue = enemyTurnQueue();
    Math.random = () => 0;
    advanceEnemyTurn();
    return {
      marked: source.priorityTargetId === target.id,
      used: source.priorityTargetDesignationUsed,
      moved: source.moved,
      attacked: source.usedWeaponIds.length > 0,
      log: state.log.join(" ")
    };
  })()`);
  assert.equal(enemyUse.marked, true);
  assert.equal(enemyUse.used, true);
  assert.equal(enemyUse.moved, true);
  assert.equal(enemyUse.attacked, true);
  assert.match(enemyUse.log, /優先目標に指定/);

  const renderSource = fs.readFileSync(projectPath("src/battle-render.js"), "utf8");
  const eventSource = fs.readFileSync(projectPath("src/events.js"), "utf8");
  assert.match(renderSource, /data-action="priority-target-designation"/);
  assert.match(eventSource, /button\?\.dataset\.action === "priority-target-designation"/);

  console.log("Priority target checks passed: character tuning, option, command range, visibility, global accuracy, movement lock, attacks, turn clear, enemy AI, UI wiring.");
}

main();
