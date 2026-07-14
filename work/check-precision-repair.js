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
      id: "precisionRepairTestMap",
      name: "Precision Repair Test",
      type: "ground",
      width: 10,
      height: 10,
      terrain: Array(100).fill("plain")
    });
    state.data.campaign.stages.push({ mapId: "precisionRepairTestMap", enemyFaction: "zeon" });
    state.selectedMapId = "precisionRepairTestMap";
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

  const definitions = evaluate(context, `({
    precisionSkill: state.data.skills.find((skill) => skill.id === "precisionAttackControl"),
    repairSkill: state.data.skills.find((skill) => skill.id === "emergencyRepair"),
    precisionOption: lookup().options.precisionAttackControl,
    repairOption: lookup().options.emergencyRepair,
    nativePrecision: state.data.mobileSuits.filter((ms) => (ms.specials ?? []).includes("precisionAttackControl")).map((ms) => ms.id),
    nativeRepair: state.data.characters.filter((character) => (character.specials ?? []).includes("emergencyRepair")).map((character) => character.id).sort()
  })`);
  assert.equal(definitions.precisionSkill.type, "機体/OP");
  assert.equal(definitions.repairSkill.type, "キャラ/OP");
  assert.equal(definitions.precisionOption.cost, 50);
  assert.equal(definitions.precisionOption.grantsSkill, "precisionAttackControl");
  assert.deepEqual([...definitions.precisionOption.factions], ["federation", "zeon"]);
  assert.equal(definitions.repairOption.cost, 45);
  assert.equal(definitions.repairOption.grantsSkill, "emergencyRepair");
  assert.deepEqual([...definitions.repairOption.factions], ["federation", "zeon"]);
  assert.deepEqual([...definitions.nativePrecision], [], "No machine has been assigned Precision Attack Control yet");
  assert.deepEqual([...definitions.nativeRepair], ["oliverMay", "omurHangal"]);

  const nativeRepairCharacters = evaluate(context, `(() => {
    const omur = lookup().characters.omurHangal;
    const oliver = lookup().characters.oliverMay;
    return {
      omur: { cost: omur.cost, shooting: omur.shooting, melee: omur.melee, reaction: omur.reaction, command: omur.command, support: omur.support, maintenance: omur.maintenance },
      oliver: { cost: oliver.cost, shooting: oliver.shooting, melee: oliver.melee, reaction: oliver.reaction, command: oliver.command, support: oliver.support, maintenance: oliver.maintenance }
    };
  })()`);
  assert.deepEqual(
    { ...nativeRepairCharacters.omur },
    { cost: 45, shooting: 4, melee: 2, reaction: 5, command: 3, support: 6, maintenance: 18 }
  );
  assert.deepEqual(
    { ...nativeRepairCharacters.oliver },
    { cost: 50, shooting: 9, melee: 3, reaction: 6, command: 3, support: 8, maintenance: 19 }
  );

  const precision = evaluate(context, `(() => {
    const base = makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: [] }, "player", 4, 5, 0);
    const enhanced = makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: ["precisionAttackControl"] }, "player", 5, 5, 1);
    const target = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 5, 4, 0);
    state.units = [base, enhanced, target];
    state.phase = "player";
    state.outcome = null;
    state.log = [];
    const weapon = weaponFor("beamRifle");
    const targetCharacter = lookup().characters.zeonSoldier;
    const targetReaction = targetCharacter.reaction;
    targetCharacter.reaction += 20;
    const hitBonus = hitRate(enhanced, target, weapon) - hitRate(base, target, weapon);
    const damageBonus = damageFor(enhanced, target, weapon) - damageFor(base, target, weapon);
    targetCharacter.reaction = targetReaction;
    Math.random = () => 0;
    attack(enhanced, target, weapon, false);
    const afterFirst = { acted: enhanced.acted, used: [...enhanced.usedWeaponIds] };
    attack(enhanced, target, weaponFor("headVulcan"), false);
    return {
      granted: unitHasSkill(enhanced, "precisionAttackControl"),
      hitBonus,
      damageBonus,
      acted: afterFirst.acted,
      usedCountAfterFirst: afterFirst.used.length,
      usedCountAfterSecondAttempt: enhanced.usedWeaponIds.length,
      effectLogged: state.log.some((entry) => entry.includes("精密攻撃管制"))
    };
  })()`);
  assert.deepEqual({ ...precision }, {
    granted: true,
    hitBonus: 12,
    damageBonus: 10,
    acted: true,
    usedCountAfterFirst: 1,
    usedCountAfterSecondAttempt: 1,
    effectLogged: true
  });

  const repair = evaluate(context, `(() => {
    const unit = makeUnit({ msId: "gundam", characterIds: ["bobRock"], weaponIds: ["beamRifle", "shield"], optionIds: ["emergencyRepair"] }, "player", 5, 5, 0);
    state.units = [unit];
    state.phase = "player";
    state.outcome = null;
    state.log = [];
    unit.armor = 150;
    unit.energy = 17;
    unit.moved = true;
    unit.runtimeWeapons.forEach((runtime) => {
      if (runtime.maxAmmo > 0) runtime.ammo = 1;
      if (runtime.id === "shield") runtime.durability = 33;
    });
    const before = {
      armor: unit.armor,
      energy: unit.energy,
      resources: JSON.stringify(unit.runtimeWeapons)
    };
    const amount = emergencyRepairAmount(unit);
    const usableAfterMove = canUseEmergencyRepair(unit);
    const used = useEmergencyRepair(unit, false);
    const secondUse = useEmergencyRepair(unit, false);
    return {
      granted: unitHasSkill(unit, "emergencyRepair"),
      maintenance: emergencyRepairMaintenance(unit),
      amount,
      usableAfterMove,
      used,
      healed: unit.armor - before.armor,
      energyUnchanged: unit.energy === before.energy,
      resourcesUnchanged: JSON.stringify(unit.runtimeWeapons) === before.resources,
      acted: unit.acted,
      moved: unit.moved,
      usedFlag: unit.emergencyRepairUsed,
      secondUse
    };
  })()`);
  assert.deepEqual({ ...repair }, {
    granted: true,
    maintenance: 24,
    amount: 70,
    usableAfterMove: true,
    used: true,
    healed: 70,
    energyUnchanged: true,
    resourcesUnchanged: true,
    acted: true,
    moved: true,
    usedFlag: true,
    secondUse: false
  });

  const restrictions = evaluate(context, `(() => {
    const full = makeUnit({ msId: "gundam", characterIds: ["bobRock"], weaponIds: ["beamRifle"], optionIds: ["emergencyRepair"] }, "player", 5, 5, 0);
    const attacked = makeUnit({ msId: "gundam", characterIds: ["bobRock"], weaponIds: ["beamRifle"], optionIds: ["emergencyRepair"] }, "player", 4, 5, 1);
    attacked.armor -= 100;
    attacked.usedWeaponIds = ["beamRifle"];
    return { full: canUseEmergencyRepair(full), attacked: canUseEmergencyRepair(attacked) };
  })()`);
  assert.deepEqual({ ...restrictions }, { full: false, attacked: false });

  const crewRepair = evaluate(context, `(() => {
    const character = lookup().characters.bobRock;
    const before = [...(character.specials ?? [])];
    character.specials = [...before, "emergencyRepair"];
    const ship = makeBattleship("gunperry", ["federationOfficer", "bobRock"], "player", 5, 7);
    ship.armor = Math.floor(ship.maxArmor / 2);
    state.units = [ship];
    state.phase = "player";
    state.outcome = null;
    const result = {
      hasSkill: unitHasSkill(ship, "emergencyRepair"),
      maintenance: emergencyRepairMaintenance(ship),
      amount: emergencyRepairAmount(ship),
      cap: Math.floor(ship.maxArmor * EMERGENCY_REPAIR_MAX_ARMOR_RATIO),
      used: useEmergencyRepair(ship, false)
    };
    character.specials = before;
    return result;
  })()`);
  assert.equal(crewRepair.hasSkill, true);
  assert.equal(crewRepair.maintenance, 24);
  assert.equal(crewRepair.amount, Math.min(78, crewRepair.cap));
  assert.equal(crewRepair.used, true);

  const enemyUse = evaluate(context, `(() => {
    const enemy = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: ["emergencyRepair"] }, "enemy", 5, 3, 0);
    const target = makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: [] }, "player", 5, 5, 0);
    enemy.armor = Math.floor(enemy.maxArmor * 0.3);
    const before = enemy.armor;
    state.units = [enemy, target];
    state.phase = "enemy";
    state.outcome = null;
    state.log = [];
    state.enemyQueue = [enemy.id];
    advanceEnemyTurn();
    return {
      healed: enemy.armor > before,
      used: enemy.emergencyRepairUsed,
      acted: enemy.acted,
      attacked: enemy.usedWeaponIds.length > 0,
      log: state.log.join(" ")
    };
  })()`);
  assert.equal(enemyUse.healed, true);
  assert.equal(enemyUse.used, true);
  assert.equal(enemyUse.acted, true);
  assert.equal(enemyUse.attacked, false);
  assert.match(enemyUse.log, /緊急修理/);

  const renderSource = fs.readFileSync(projectPath("src/battle-render.js"), "utf8");
  const eventSource = fs.readFileSync(projectPath("src/events.js"), "utf8");
  assert.match(renderSource, /data-action="emergency-repair"/);
  assert.match(eventSource, /button\?\.dataset\.action === "emergency-repair"/);

  console.log("Precision/repair checks passed: definitions, option costs, exact combat bonuses, one-attack limit, repair formula/cap, resource isolation, movement/attack restrictions, crew maintenance, enemy AI, UI wiring.");
}

main();
