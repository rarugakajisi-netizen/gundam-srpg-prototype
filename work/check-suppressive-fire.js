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
      id: "suppressiveFireTestMap",
      name: "Suppressive Fire Test",
      type: "ground",
      width: 10,
      height: 10,
      terrain: Array(100).fill("plain")
    });
    state.data.campaign.stages.push({ mapId: "suppressiveFireTestMap", enemyFaction: "zeon" });
    state.selectedMapId = "suppressiveFireTestMap";
    state.collection = { characterGrowth: {} };
    state.phase = "player";
    state.turnNumber = 1;
    state.outcome = null;
    state.log = [];
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

  const definition = evaluate(context, `({
    skill: state.data.skills.find((item) => item.id === "suppressiveFire"),
    option: lookup().options.suppressiveFireOption,
    characterOwners: state.data.characters.filter((item) => (item.specials ?? []).includes("suppressiveFire")).map((item) => item.id)
  })`);
  assert.equal(definition.skill.type, "機体/OP");
  assert.equal(definition.option.cost, 45);
  assert.equal(definition.option.grantsSkill, "suppressiveFire");
  assert.deepEqual([...definition.option.factions], ["federation", "zeon"]);
  assert.deepEqual([...definition.characterOwners], []);

  const thresholds = evaluate(context, `({
    headVulcan: suppressiveFireWeaponEligible(weaponFor("headVulcan")),
    zakuHeadVulcan: suppressiveFireWeaponEligible(weaponFor("zakuHeadVulcan")),
    beamSprayGun: suppressiveFireWeaponEligible(weaponFor("beamSprayGun"))
  })`);
  assert.equal(thresholds.headVulcan, true);
  assert.equal(thresholds.zakuHeadVulcan, true);
  assert.equal(thresholds.beamSprayGun, false);

  const hitAndExpiry = evaluate(context, `(() => {
    const attacker = makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: [], optionIds: ["suppressiveFireOption"] }, "player", 4, 3, 0);
    const ally = makeUnit({ msId: "ball", characterIds: [], weaponIds: [], optionIds: [] }, "player", 4, 2, 1);
    const defender = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 4, 5, 2);
    state.units = [attacker, ally, defender];
    const vulcan = weaponFor("headVulcan");
    const allyWeapon = weaponFor("ballCannon");
    const evasionBefore = evasion(defender);
    const allyHitBefore = hitRate(ally, defender, allyWeapon);
    Math.random = () => 0;
    attack(attacker, defender, vulcan, false);
    const during = {
      active: suppressiveFireActive(defender),
      evasionDifference: evasion(defender) - evasionBefore,
      allyHitDifference: hitRate(ally, defender, allyWeapon) - allyHitBefore,
      statusVisible: activeSkillText(defender).includes("牽制射撃被弾")
    };
    endPlayerTurn();
    return {
      during,
      expired: !suppressiveFireActive(defender),
      restoredEvasion: evasion(defender) === evasionBefore
    };
  })()`);
  assert.equal(hitAndExpiry.during.active, true);
  assert.equal(hitAndExpiry.during.evasionDifference, -8);
  assert.equal(hitAndExpiry.during.allyHitDifference, 8);
  assert.equal(hitAndExpiry.during.statusVisible, true);
  assert.equal(hitAndExpiry.expired, true);
  assert.equal(hitAndExpiry.restoredEvasion, true);

  const noStack = evaluate(context, `(() => {
    state.phase = "player";
    const first = makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: [], optionIds: ["suppressiveFireOption"] }, "player", 3, 4, 0);
    const second = makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: [], optionIds: ["suppressiveFireOption"] }, "player", 5, 4, 1);
    const defender = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: [], optionIds: [] }, "enemy", 4, 5, 2);
    state.units = [first, second, defender];
    const before = evasion(defender);
    Math.random = () => 0;
    attack(first, defender, weaponFor("headVulcan"), false);
    const afterFirst = evasion(defender);
    attack(second, defender, weaponFor("headVulcan"), false);
    return { firstPenalty: afterFirst - before, secondPenalty: evasion(defender) - before };
  })()`);
  assert.equal(noStack.firstPenalty, -8);
  assert.equal(noStack.secondPenalty, -8);

  const exclusions = evaluate(context, `(() => {
    const missAttacker = makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: [], optionIds: ["suppressiveFireOption"] }, "player", 2, 2, 0);
    const missTarget = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: [], optionIds: [] }, "enemy", 2, 4, 1);
    state.units = [missAttacker, missTarget];
    Math.random = () => 0.99;
    attack(missAttacker, missTarget, weaponFor("headVulcan"), false);
    const missApplied = suppressiveFireActive(missTarget);

    const heavyAttacker = makeUnit({ msId: "gm", characterIds: ["federationSoldier"], weaponIds: ["beamSprayGun"], optionIds: ["suppressiveFireOption"] }, "player", 5, 2, 2);
    const heavyTarget = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: [], optionIds: [] }, "enemy", 5, 4, 3);
    state.units = [heavyAttacker, heavyTarget];
    Math.random = () => 0;
    attack(heavyAttacker, heavyTarget, weaponFor("beamSprayGun"), false);
    return { missApplied, heavyApplied: suppressiveFireActive(heavyTarget) };
  })()`);
  assert.equal(exclusions.missApplied, false);
  assert.equal(exclusions.heavyApplied, false);

  console.log("Suppressive fire checks passed: machine/option definition, Vulcan-class threshold, hit-only non-stacking evasion debuff, ally accuracy gain, status display, turn expiry, and high-power exclusion.");
}

main();
