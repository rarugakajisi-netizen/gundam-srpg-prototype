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
      id: "temRayPartsTestMap",
      name: "Tem Ray Parts Test",
      type: "ground",
      width: 10,
      height: 10,
      terrain: Array(100).fill("plain")
    });
    state.data.campaign.stages.push({ mapId: "temRayPartsTestMap", enemyFaction: "zeon" });
    state.selectedMapId = "temRayPartsTestMap";
    state.collection = { characterGrowth: {} };
    state.phase = "player";
    state.log = [];
    renderBattle = () => {};
  `, context);
  return context;
}

function evaluate(context, source) {
  return vm.runInContext(source, context);
}

function main() {
  const context = loadRuntime();

  const definition = evaluate(context, `lookup().options.temRayParts`);
  assert.equal(definition.cost, -30);
  assert.equal(definition.effectType, "downgrade");
  assert.equal(definition.grantsSkill, undefined, "Tem Ray parts must remain option-only without granting a skill");
  assert.deepEqual([...definition.factions], ["federation", "zeon"]);

  const comparison = evaluate(context, `(() => {
    const plain = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 2, 2, 0);
    const degraded = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: ["temRayParts"] }, "enemy", 2, 3, 1);
    const target = makeUnit({ msId: "gm", characterIds: ["federationSoldier"], weaponIds: ["beamSprayGun"], optionIds: [] }, "player", 2, 5, 2);
    state.units = [plain, degraded, target];
    const weapon = weaponFor("zakuMachineGun");
    return {
      costDifference: degraded.totalCost - plain.totalCost,
      armorDifference: degraded.maxArmor - plain.maxArmor,
      energyDifference: degraded.maxEnergy - plain.maxEnergy,
      mobilityDifference: mobilityFor(degraded) - mobilityFor(plain),
      evasionDifference: evasion(degraded) - evasion(plain),
      hitDifference: hitRate(degraded, target, weapon) - hitRate(plain, target, weapon),
      damageDifference: damageFor(degraded, target, weapon) - damageFor(plain, target, weapon)
    };
  })()`);
  assert.equal(comparison.costDifference, -30);
  assert.equal(comparison.armorDifference, -100);
  assert.equal(comparison.energyDifference, -25);
  assert.equal(comparison.mobilityDifference, -1);
  assert.equal(comparison.evasionDifference, -10);
  assert.equal(comparison.hitDifference, -10);
  assert.equal(comparison.damageDifference, -15);

  const transformed = evaluate(context, `(() => {
    const unit = makeUnit({ msId: "hildolfrTankMode", characterIds: ["zeonSoldier"], weaponIds: [], optionIds: ["temRayParts"] }, "player", 4, 4, 0);
    state.units = [unit];
    const changed = transformMobileSuit(unit, "hildolfrMobileMode", false);
    const target = lookup().ms.hildolfrMobileMode;
    return {
      changed,
      maxArmor: unit.maxArmor,
      expectedArmor: target.armor - 100,
      maxEnergy: unit.maxEnergy,
      expectedEnergy: target.energy - 25,
      mobility: mobilityFor(unit),
      expectedMobility: target.mobility - 1
    };
  })()`);
  assert.equal(transformed.changed, true);
  assert.equal(transformed.maxArmor, transformed.expectedArmor);
  assert.equal(transformed.maxEnergy, transformed.expectedEnergy);
  assert.equal(transformed.mobility, transformed.expectedMobility);

  console.log("Tem Ray parts checks passed: shared option-only definition, negative cost, severe stat penalties, combat penalties, and transformation persistence.");
}

main();
