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
      id: "formationTestMap",
      name: "Formation Test",
      type: "ground",
      width: 10,
      height: 10,
      terrain: Array(100).fill("plain")
    });
    state.data.campaign.stages.push({ mapId: "formationTestMap", enemyFaction: "zeon" });
    state.selectedMapId = "formationTestMap";
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
    trailSkill: state.data.skills.find((skill) => skill.id === "trailFormation"),
    lineSkill: state.data.skills.find((skill) => skill.id === "lineFormation"),
    trailOption: lookup().options.trailFormation,
    lineOption: lookup().options.lineFormation,
    gaia: lookup().characters.gaia,
    layer: lookup().characters.masterPRayer,
    trailOwners: state.data.characters.filter((character) => (character.specials ?? []).includes("trailFormation")).map((character) => character.id).sort(),
    lineOwners: state.data.characters.filter((character) => (character.specials ?? []).includes("lineFormation")).map((character) => character.id).sort()
  })`);
  assert.equal(definitions.trailSkill.type, "キャラ/OP");
  assert.equal(definitions.lineSkill.type, "キャラ/OP");
  assert.equal(definitions.trailOption.cost, 55);
  assert.equal(definitions.lineOption.cost, 55);
  assert.equal(definitions.trailOption.grantsSkill, "trailFormation");
  assert.equal(definitions.lineOption.grantsSkill, "lineFormation");
  assert.deepEqual([...definitions.trailOption.factions], ["federation", "zeon"]);
  assert.deepEqual([...definitions.lineOption.factions], ["federation", "zeon"]);
  assert.deepEqual([...definitions.gaia.specials], ["trailFormation"]);
  assert.ok(!definitions.gaia.specials.includes("teamwork"));
  assert.deepEqual([...definitions.layer.specials], ["lineFormation"]);
  assert.deepEqual(
    {
      cost: definitions.layer.cost,
      shooting: definitions.layer.shooting,
      melee: definitions.layer.melee,
      reaction: definitions.layer.reaction,
      command: definitions.layer.command,
      support: definitions.layer.support,
      maintenance: definitions.layer.maintenance
    },
    { cost: 130, shooting: 21, melee: 17, reaction: 21, command: 17, support: 7, maintenance: 2 }
  );
  assert.deepEqual([...definitions.trailOwners], ["gaia"]);
  assert.deepEqual([...definitions.lineOwners], ["masterPRayer"]);

  const trail = evaluate(context, `(() => {
    const source = makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: ["trailFormation"] }, "player", 4, 2, 0);
    const ally = makeUnit({ msId: "gm", characterIds: ["federationSoldier"], weaponIds: ["beamSprayGun"], optionIds: [] }, "player", 4, 6, 1);
    const attacker = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 8, 8, 2);
    state.units = [source, ally, attacker];
    const weapon = weaponFor("zakuMachineGun");
    const activeAtFour = {
      source: trailFormationActive(source),
      ally: trailFormationActive(ally),
      sourceEvasion: skillEvasionBonus(source),
      allyEvasion: skillEvasionBonus(ally),
      damage: damageFor(attacker, source, weapon),
      text: activeSkillText(source)
    };
    ally.x = 5;
    const offAxis = {
      source: trailFormationActive(source),
      ally: trailFormationActive(ally),
      sourceEvasion: skillEvasionBonus(source),
      damage: damageFor(attacker, source, weapon)
    };
    ally.x = 4;
    ally.y = 7;
    const outOfRange = trailFormationActive(source);
    ally.y = 6;
    ally.armor = 0;
    const deadAlly = trailFormationActive(source);
    return { activeAtFour, offAxis, outOfRange, deadAlly };
  })()`);
  assert.equal(trail.activeAtFour.source, true);
  assert.equal(trail.activeAtFour.ally, true);
  assert.equal(trail.activeAtFour.sourceEvasion, 5);
  assert.equal(trail.activeAtFour.allyEvasion, 5);
  assert.equal(trail.offAxis.source, false);
  assert.equal(trail.offAxis.ally, false);
  assert.equal(trail.offAxis.sourceEvasion, 0);
  assert.equal(trail.offAxis.damage - trail.activeAtFour.damage, 6);
  assert.equal(trail.outOfRange, false);
  assert.equal(trail.deadAlly, false);
  assert.match(trail.activeAtFour.text, /トレイル陣形/);

  const line = evaluate(context, `(() => {
    const source = makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: ["lineFormation"] }, "player", 2, 4, 0);
    const ally = makeUnit({ msId: "gm", characterIds: ["federationSoldier"], weaponIds: ["beamSprayGun"], optionIds: [] }, "player", 6, 4, 1);
    const target = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 8, 8, 2);
    state.units = [source, ally, target];
    const weapon = weaponFor("beamRifle");
    const activeAtFour = {
      source: lineFormationActive(source),
      ally: lineFormationActive(ally),
      sourceAccuracy: skillAccuracyBonus(source, target, weapon),
      allyAccuracy: skillAccuracyBonus(ally, target, weapon),
      damage: damageFor(source, target, weapon),
      text: activeSkillText(source)
    };
    ally.y = 5;
    const offAxis = {
      source: lineFormationActive(source),
      ally: lineFormationActive(ally),
      sourceAccuracy: skillAccuracyBonus(source, target, weapon),
      damage: damageFor(source, target, weapon)
    };
    return { activeAtFour, offAxis };
  })()`);
  assert.equal(line.activeAtFour.source, true);
  assert.equal(line.activeAtFour.ally, true);
  assert.equal(line.activeAtFour.sourceAccuracy, 5);
  assert.equal(line.activeAtFour.allyAccuracy, 5);
  assert.equal(line.offAxis.source, false);
  assert.equal(line.offAxis.ally, false);
  assert.equal(line.offAxis.sourceAccuracy, 0);
  assert.equal(line.activeAtFour.damage - line.offAxis.damage, 6);
  assert.match(line.activeAtFour.text, /ライン陣形/);

  const noStack = evaluate(context, `(() => {
    const left = makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: ["lineFormation"] }, "player", 2, 5, 0);
    const center = makeUnit({ msId: "gm", characterIds: ["federationSoldier"], weaponIds: ["beamSprayGun"], optionIds: [] }, "player", 4, 5, 1);
    const right = makeUnit({ msId: "guncannon", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: ["lineFormation"] }, "player", 6, 5, 2);
    const target = makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 8, 8, 3);
    state.units = [left, center, right, target];
    return {
      accuracy: skillAccuracyBonus(center, target, weaponFor("beamSprayGun")),
      active: lineFormationActive(center)
    };
  })()`);
  assert.equal(noStack.active, true);
  assert.equal(noStack.accuracy, 5);

  const gaiaAndAi = evaluate(context, `(() => {
    const gaia = makeUnit({ msId: "dom", characterIds: ["gaia"], weaponIds: ["giantBazooka"], optionIds: [] }, "enemy", 2, 2, 0);
    const mash = makeUnit({ msId: "dom", characterIds: ["mash"], weaponIds: ["giantBazooka"], optionIds: [] }, "enemy", 4, 3, 1);
    state.units = [gaia, mash];
    const inactive = { hasSkill: unitHasSkill(gaia, "trailFormation"), active: trailFormationActive(gaia), score: formationPositionScore(gaia) };
    gaia.x = 4;
    const aligned = { active: trailFormationActive(gaia), allyActive: trailFormationActive(mash), score: formationPositionScore(gaia) };
    return { inactive, aligned };
  })()`);
  assert.equal(gaiaAndAi.inactive.hasSkill, true);
  assert.equal(gaiaAndAi.inactive.active, false);
  assert.equal(gaiaAndAi.inactive.score, 0);
  assert.equal(gaiaAndAi.aligned.active, true);
  assert.equal(gaiaAndAi.aligned.allyActive, true);
  assert.equal(gaiaAndAi.aligned.score, 48);

  console.log("Formation checks passed: options, Gaia skill swap, axes/range/alive requirements, exact bonuses, no stacking, shared aura, AI positioning, UI text.");
}

main();
