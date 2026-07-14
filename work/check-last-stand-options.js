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
      id: "lastStandTestMap",
      name: "Last Stand Test",
      type: "ground",
      width: 10,
      height: 10,
      terrain: Array(100).fill("plain")
    });
    state.data.campaign.stages.push({ mapId: "lastStandTestMap", enemyFaction: "zeon" });
    state.selectedMapId = "lastStandTestMap";
    state.collection = { characterGrowth: {} };
    state.phase = "player";
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

  const definitions = evaluate(context, `({
    watchSkill: state.data.skills.find((skill) => skill.id === "ainasPocketWatch"),
    shootingSkill: state.data.skills.find((skill) => skill.id === "lastShooting"),
    watchOption: lookup().options.ainasPocketWatch,
    shootingOption: lookup().options.lastShooting,
    nativeMsOwners: state.data.mobileSuits.filter((ms) => (ms.specials ?? []).some((id) => ["ainasPocketWatch", "lastShooting"].includes(id))).map((ms) => ms.id),
    nativeCharacterOwners: state.data.characters.filter((character) => (character.specials ?? []).some((id) => ["ainasPocketWatch", "lastShooting"].includes(id))).map((character) => character.id)
  })`);
  assert.equal(definitions.watchSkill.type, "OP");
  assert.equal(definitions.shootingSkill.type, "OP");
  assert.equal(definitions.watchOption.cost, 80);
  assert.equal(definitions.shootingOption.cost, 65);
  assert.equal(definitions.watchOption.grantsSkill, "ainasPocketWatch");
  assert.equal(definitions.shootingOption.grantsSkill, "lastShooting");
  assert.deepEqual([...definitions.watchOption.factions], ["federation", "zeon"]);
  assert.deepEqual([...definitions.shootingOption.factions], ["federation", "zeon"]);
  assert.deepEqual([...definitions.watchOption.forbiddenMsSkills], ["coreSystem", "additionalArmor"]);
  assert.deepEqual([...definitions.nativeMsOwners], []);
  assert.deepEqual([...definitions.nativeCharacterOwners], []);

  const eligibility = evaluate(context, `(() => {
    const additionalArmorMs = state.data.mobileSuits.find((ms) => (ms.specials ?? []).includes("additionalArmor"));
    return {
      ordinaryWatch: optionEquippableByMs(lookup().options.ainasPocketWatch, lookup().ms.zaku2),
      coreWatch: optionEquippableByMs(lookup().options.ainasPocketWatch, lookup().ms.gundam),
      armorWatch: optionEquippableByMs(lookup().options.ainasPocketWatch, additionalArmorMs),
      coreLastShooting: optionEquippableByMs(lookup().options.lastShooting, lookup().ms.gundam),
      ordinaryLastShooting: optionEquippableByMs(lookup().options.lastShooting, lookup().ms.zaku2)
    };
  })()`);
  assert.equal(eligibility.ordinaryWatch, true);
  assert.equal(eligibility.coreWatch, false);
  assert.equal(eligibility.armorWatch, false);
  assert.equal(eligibility.coreLastShooting, true);
  assert.equal(eligibility.ordinaryLastShooting, true);

  const pocketWatch = evaluate(context, `(() => {
    const unit = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: ["ainasPocketWatch"] }, "player", 5, 5, 0);
    state.units = [unit];
    unit.armor = 20;
    unit.beamDisruptedTurns = 2;
    const beforeEnergy = unit.energy;
    const beforeAmmo = runtimeWeapon(unit, "zakuMachineGun").ammo;
    applyDamage(unit, 1000);
    const shield = activeShield(unit);
    const first = {
      armor: unit.armor,
      used: unit.ainasPocketWatchUsed,
      energy: unit.energy,
      ammo: runtimeWeapon(unit, "zakuMachineGun").ammo,
      shield: shield?.durability ?? 0,
      status: unit.beamDisruptedTurns,
      text: activeSkillText(unit),
      logged: state.log.some((line) => line.includes("アイナの懐中時計"))
    };
    applyDamage(unit, 1);
    return { first, secondArmor: unit.armor, beforeEnergy, beforeAmmo };
  })()`);
  assert.equal(pocketWatch.first.armor, 1);
  assert.equal(pocketWatch.first.used, true);
  assert.equal(pocketWatch.first.energy, pocketWatch.beforeEnergy);
  assert.equal(pocketWatch.first.ammo, pocketWatch.beforeAmmo);
  assert.equal(pocketWatch.first.shield, 0);
  assert.equal(pocketWatch.first.status, 2);
  assert.equal(pocketWatch.first.logged, true);
  assert.match(pocketWatch.first.text, /使用済み/);
  assert.equal(pocketWatch.secondArmor, 0);

  const ordinaryDamageOnly = evaluate(context, `(() => {
    const unit = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: [], optionIds: ["ainasPocketWatch"] }, "player", 2, 2, 0);
    state.units = [unit];
    unit.armor = 0;
    return { armor: unit.armor, used: Boolean(unit.ainasPocketWatchUsed) };
  })()`);
  assert.equal(ordinaryDamageOnly.armor, 0, "Direct armor zeroing for forced withdrawal/self-destruction must not activate the watch");
  assert.equal(ordinaryDamageOnly.used, false);

  const lastShooting = evaluate(context, `(() => {
    state.log = [];
    const attacker = makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: [] }, "player", 5, 3, 0);
    const defender = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun", "giantBazooka"], optionIds: ["lastShooting"] }, "enemy", 5, 5, 1);
    state.units = [attacker, defender];
    state.phase = "player";
    state.outcome = null;
    defender.armor = 1;
    defender.acted = true;
    defender.usedWeaponIds = ["zakuMachineGun", "giantBazooka"];
    const selectedWeapon = lastShootingWeapon(defender, attacker);
    const beforeTargetArmor = attacker.armor;
    const beforeAmmo = runtimeWeapon(defender, selectedWeapon.id).ammo;
    Math.random = () => 0;
    attack(attacker, defender, weaponFor("beamRifle"), false);
    return {
      selectedWeapon: selectedWeapon.id,
      defenderArmor: defender.armor,
      used: defender.lastShootingUsed,
      targetDamaged: attacker.armor < beforeTargetArmor,
      ammoSpent: runtimeWeapon(defender, selectedWeapon.id).ammo < beforeAmmo,
      log: state.log.join("\\n")
    };
  })()`);
  assert.equal(lastShooting.selectedWeapon, "giantBazooka");
  assert.equal(lastShooting.defenderArmor, 0);
  assert.equal(lastShooting.used, true);
  assert.equal(lastShooting.targetDamaged, true);
  assert.equal(lastShooting.ammoSpent, true);
  assert.match(lastShooting.log, /ラストシューティング/);

  const missAndNoRange = evaluate(context, `(() => {
    const shooter = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: ["lastShooting"] }, "enemy", 2, 2, 0);
    const nearby = makeUnit({ msId: "gm", characterIds: ["federationSoldier"], weaponIds: ["beamSprayGun"], optionIds: [] }, "player", 2, 4, 1);
    state.units = [shooter, nearby];
    shooter.armor = 0;
    const beforeArmor = nearby.armor;
    Math.random = () => 0.99;
    const missTriggered = resolveLastShooting(shooter, nearby);
    const miss = { triggered: missTriggered, used: shooter.lastShootingUsed, targetArmor: nearby.armor, beforeArmor };

    const farShooter = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: ["lastShooting"] }, "enemy", 0, 0, 2);
    const farTarget = makeUnit({ msId: "gm", characterIds: ["federationSoldier"], weaponIds: [], optionIds: [] }, "player", 9, 9, 3);
    state.units = [farShooter, farTarget];
    farShooter.armor = 0;
    const noRangeTriggered = resolveLastShooting(farShooter, farTarget);
    return { miss, noRangeTriggered, noRangeUsed: Boolean(farShooter.lastShootingUsed) };
  })()`);
  assert.equal(missAndNoRange.miss.triggered, true);
  assert.equal(missAndNoRange.miss.used, true);
  assert.equal(missAndNoRange.miss.targetArmor, missAndNoRange.miss.beforeArmor);
  assert.equal(missAndNoRange.noRangeTriggered, false);
  assert.equal(missAndNoRange.noRangeUsed, false);

  const mutualDestruction = evaluate(context, `(() => {
    const attacker = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["giantBazooka"], optionIds: [] }, "player", 4, 2, 0);
    const defender = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["giantBazooka"], optionIds: ["lastShooting"] }, "enemy", 4, 4, 1);
    state.units = [attacker, defender];
    state.phase = "player";
    state.outcome = null;
    attacker.armor = 1;
    defender.armor = 1;
    Math.random = () => 0;
    attack(attacker, defender, weaponFor("giantBazooka"), false);
    return { attackerArmor: attacker.armor, defenderArmor: defender.armor, reactionUsed: defender.lastShootingUsed };
  })()`);
  assert.equal(mutualDestruction.attackerArmor, 0);
  assert.equal(mutualDestruction.defenderArmor, 0);
  assert.equal(mutualDestruction.reactionUsed, true);

  console.log("Last-stand option checks passed: OP-only/shared definitions, equip restrictions, one-time armor-1 survival, resource isolation, forced-loss exclusion, automatic best-weapon retaliation, action override, cost use, miss/no-range handling, mutual destruction.");
}

main();
