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
      id: "reconTestMap",
      name: "Recon Test",
      type: "space",
      width: 10,
      height: 10,
      terrain: Array(100).fill("space")
    });
    state.data.campaign.stages.push({ mapId: "reconTestMap", enemyFaction: "federation" });
    state.selectedMapId = "reconTestMap";
    state.collection = { characterGrowth: {} };
    state.units = [
      makeUnit({ msId: "zakuFlipper", characterIds: ["zeonSoldier"], weaponIds: [], optionIds: [] }, "enemy", 2, 2, 0),
      makeUnit({ msId: "zaku2", characterIds: ["zeonVeteran"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 5, 5, 1),
      makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: [] }, "player", 5, 2, 0)
    ];
    state.units.find((unit) => unit.side === "player").temporarySkills = ["stealth"];
  `, context);
  return context;
}

function evaluate(context, source) {
  return vm.runInContext(source, context);
}

function main() {
  const context = loadRuntime();
  const characterReconSources = evaluate(context, `state.data.characters.filter((character) => (character.specials ?? []).includes("recon")).map((character) => character.id)`);
  assert.deepEqual([...characterReconSources], [], "Recon must not remain on character cards");

  const ranges = [
    [0, 2], [7, 2], [8, 3], [13, 3], [14, 4], [17, 4], [18, 5], [30, 5]
  ].map(([communication, expected]) => {
    const actual = evaluate(context, `(() => {
      lookup().characters.zeonSoldier.support = ${communication};
      return reconDetectionRange(state.units.find((unit) => unit.msId === "zakuFlipper"));
    })()`);
    return { communication, expected, actual };
  });
  ranges.forEach(({ communication, expected, actual }) => {
    assert.equal(actual, expected, `Unexpected recon range for communication ${communication}`);
  });

  evaluate(context, `lookup().characters.zeonSoldier.support = 7;`);
  const concealedOutsideRange = evaluate(context, `(() => {
    const defender = state.units.find((unit) => unit.side === "player");
    const allyShooter = state.units.find((unit) => unit.msId === "zaku2");
    return unitIsConcealedFrom(defender, allyShooter);
  })()`);
  assert.equal(concealedOutsideRange, true, "Stealth should remain concealed outside the recon radius");

  evaluate(context, `lookup().characters.zeonSoldier.support = 8;`);
  const sharedDetection = evaluate(context, `(() => {
    const defender = state.units.find((unit) => unit.side === "player");
    const allyShooter = state.units.find((unit) => unit.msId === "zaku2");
    return {
      concealedFromAlly: unitIsConcealedFrom(defender, allyShooter),
      allyWeaponReachable: weaponReachableByRange(allyShooter, defender, weaponFor("zakuMachineGun")),
      detailsConcealed: unitDetailsConcealedFromSide(defender, "enemy"),
      reconPermanentlyRemoved: defender.stealthRevealed === true
    };
  })()`);
  assert.equal(sharedDetection.concealedFromAlly, false, "A non-recon ally should be able to fire at a target detected by recon");
  assert.equal(sharedDetection.allyWeaponReachable, true, "Shared recon should remove concealment from an allied weapon range check");
  assert.equal(sharedDetection.detailsConcealed, false, "Detected target details should be shared with the side");
  assert.equal(sharedDetection.reconPermanentlyRemoved, false, "Passive recon should not permanently erase stealth");

  const smokeDetection = evaluate(context, `(() => {
    const defender = state.units.find((unit) => unit.side === "player");
    const allyShooter = state.units.find((unit) => unit.msId === "zaku2");
    defender.temporarySkills = [];
    defender.smokeConcealedTurns = 2;
    return unitIsConcealedFrom(defender, allyShooter);
  })()`);
  assert.equal(smokeDetection, false, "Recon detection should be shared against smoke concealment too");

  const smokeActivationInRecon = evaluate(context, `(() => {
    const defender = state.units.find((unit) => unit.side === "player");
    const allyShooter = state.units.find((unit) => unit.msId === "zaku2");
    const recon = state.units.find((unit) => unit.msId === "zakuFlipper");
    recon.x = 2;
    recon.y = 2;
    lookup().characters.zeonSoldier.support = 8;
    defender.temporarySkills = ["smokeDischarger"];
    defender.infiltrationExposed = true;
    defender.stealthRevealed = true;
    defender.smokeConcealedTurns = 0;
    defender.smokeSkillUsed = false;
    defender.acted = false;
    defender.moved = false;
    state.phase = "player";
    useSmokeSkill(defender, false);
    return {
      concealed: unitIsConcealedFrom(defender, allyShooter),
      grace: defender.activeConcealmentGrace,
      previousDetectionCleared: defender.infiltrationExposed === false
    };
  })()`);
  assert.equal(smokeActivationInRecon.concealed, true, "Active smoke should hide for its activation turn even inside enemy recon");
  assert.equal(smokeActivationInRecon.grace, true);
  assert.equal(smokeActivationInRecon.previousDetectionCleared, true, "Active concealment should overwrite every prior detection state");

  const smokeAtNextTurn = evaluate(context, `(() => {
    const defender = state.units.find((unit) => unit.side === "player");
    const allyShooter = state.units.find((unit) => unit.msId === "zaku2");
    tickTurnStartEffects("player");
    return {
      concealed: unitIsConcealedFrom(defender, allyShooter),
      smokeTurns: defender.smokeConcealedTurns,
      grace: defender.activeConcealmentGrace
    };
  })()`);
  assert.equal(smokeAtNextTurn.concealed, false, "Smoke should be detected at the next own turn when still inside enemy recon");
  assert.equal(smokeAtNextTurn.smokeTurns, 0);
  assert.equal(smokeAtNextTurn.grace, false);

  const smokeOutsideRecon = evaluate(context, `(() => {
    const defender = state.units.find((unit) => unit.side === "player");
    const allyShooter = state.units.find((unit) => unit.msId === "zaku2");
    const recon = state.units.find((unit) => unit.msId === "zakuFlipper");
    defender.infiltrationExposed = true;
    defender.smokeSkillUsed = false;
    defender.acted = false;
    defender.moved = false;
    recon.x = 0;
    recon.y = 0;
    useSmokeSkill(defender, false);
    tickTurnStartEffects("player");
    return {
      concealed: unitIsConcealedFrom(defender, allyShooter),
      smokeTurns: defender.smokeConcealedTurns,
      grace: defender.activeConcealmentGrace
    };
  })()`);
  assert.equal(smokeOutsideRecon.concealed, true, "Active concealment should remain after grace when outside enemy recon");
  assert.ok(smokeOutsideRecon.smokeTurns > 0);
  assert.equal(smokeOutsideRecon.grace, false);

  const activeCamoOverwrite = evaluate(context, `(() => {
    const defender = state.units.find((unit) => unit.side === "player");
    const allyShooter = state.units.find((unit) => unit.msId === "zaku2");
    const recon = state.units.find((unit) => unit.msId === "zakuFlipper");
    recon.x = 2;
    recon.y = 2;
    allyShooter.x = 5;
    allyShooter.y = 3;
    defender.temporarySkills = [];
    defender.weaponIds.push("activeCamo");
    defender.runtimeWeapons.push({ id: "activeCamo", ammo: 2, maxAmmo: 2, durability: 0 });
    defender.infiltrationExposed = true;
    defender.stealthRevealed = true;
    defender.smokeConcealedTurns = 0;
    defender.acted = false;
    defender.moved = false;
    defender.usedWeaponIds = [];
    useActiveCamo(defender, weaponFor("activeCamo"), false);
    const hiddenAfterActivation = unitIsConcealedFrom(defender, allyShooter);
    exposeConcealedEnemies(recon);
    const revealedAgain = unitIsConcealedFrom(defender, allyShooter);
    defender.acted = false;
    defender.moved = false;
    defender.usedWeaponIds = [];
    useActiveCamo(defender, weaponFor("activeCamo"), false);
    return {
      hiddenAfterActivation,
      revealedAgain,
      hiddenAfterReactivation: unitIsConcealedFrom(defender, allyShooter),
      detectionClearedAgain: defender.infiltrationExposed === false
    };
  })()`);
  assert.equal(activeCamoOverwrite.hiddenAfterActivation, true, "Active camo should override detection and close observation for its activation turn");
  assert.equal(activeCamoOverwrite.revealedAgain, false, "A new active detection should break activation grace");
  assert.equal(activeCamoOverwrite.hiddenAfterReactivation, true, "Active camo should be able to overwrite detection again");
  assert.equal(activeCamoOverwrite.detectionClearedAgain, true);

  const hoverTruckAdjustment = evaluate(context, `(() => {
    const normal = lookup().ms.hoverTruck;
    const blackDog = lookup().ms.hoverTruckBlackDog;
    return {
      normal: { cost: normal.cost, specials: normal.specials },
      blackDog: { cost: blackDog.cost, specials: blackDog.specials }
    };
  })()`);
  assert.equal(hoverTruckAdjustment.normal.cost, 50);
  assert.deepEqual([...hoverTruckAdjustment.normal.specials], ["undergroundSonar"]);
  assert.equal(hoverTruckAdjustment.blackDog.cost, 60);
  assert.deepEqual([...hoverTruckAdjustment.blackDog.specials], ["undergroundSonar"]);

  const sonarRanges = [
    [0, 3], [7, 3], [8, 4], [13, 4], [14, 5], [17, 5], [18, 6], [30, 6]
  ].map(([communication, expected]) => {
    const actual = evaluate(context, `(() => {
      state.units = [makeUnit({ msId: "zakuHalfCannon", characterIds: ["zeonSoldier"], weaponIds: [], optionIds: [] }, "enemy", 2, 2, 0)];
      lookup().characters.zeonSoldier.support = ${communication};
      return undergroundSonarRange(state.units[0]);
    })()`);
    return { communication, expected, actual };
  });
  sonarRanges.forEach(({ communication, expected, actual }) => {
    assert.equal(actual, expected, `Unexpected underground sonar range for communication ${communication}`);
  });

  const sonarAreaDetection = evaluate(context, `(() => {
    lookup().characters.zeonSoldier.support = 8;
    state.units = [
      makeUnit({ msId: "zakuHalfCannon", characterIds: ["zeonSoldier"], weaponIds: [], optionIds: [] }, "enemy", 2, 2, 0),
      makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: [] }, "player", 5, 2, 0),
      makeUnit({ msId: "gm", characterIds: ["federationSoldier"], weaponIds: ["beamSprayGun"], optionIds: [] }, "player", 2, 6, 1),
      makeUnit({ msId: "guncannon", characterIds: ["federationSoldier"], weaponIds: [], optionIds: [] }, "player", 7, 7, 2)
    ];
    state.units.filter((unit) => unit.side === "player").forEach((unit) => { unit.temporarySkills = ["stealth"]; });
    applyUndergroundSonar("enemy");
    return state.units.filter((unit) => unit.side === "player").map((unit) => ({ msId: unit.msId, exposed: unit.infiltrationExposed === true }));
  })()`);
  assert.equal(sonarAreaDetection.find((item) => item.msId === "gundam").exposed, true);
  assert.equal(sonarAreaDetection.find((item) => item.msId === "gm").exposed, true,
    "Stationary sonar should reveal every concealed enemy in range");
  assert.equal(sonarAreaDetection.find((item) => item.msId === "guncannon").exposed, false,
    "Stationary sonar should leave distant concealed enemies hidden");

  const preBattleOrder = evaluate(context, `(() => {
    state.units = [
      makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: ["miharuIntel"] }, "player", 1, 1, 0),
      makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 7, 7, 0),
      makeUnit({ msId: "zaku1", characterIds: ["erikBlanke"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 8, 7, 1)
    ];
    applyPreBattleSkillEffects();
    const ordinary = state.units.find((unit) => unit.msId === "zaku2");
    const commander = state.units.find((unit) => unit.msId === "zaku1");
    return {
      ordinaryStealth: unitHasSkill(ordinary, "stealth"),
      commanderStealth: unitHasSkill(commander, "stealth"),
      commanderExposed: commander.infiltrationExposed === true
    };
  })()`);
  assert.equal(preBattleOrder.ordinaryStealth, false, "Commander stealth should follow the pilot's own MS instead of roster order");
  assert.equal(preBattleOrder.commanderStealth, true);
  assert.equal(preBattleOrder.commanderExposed, true, "Pre-battle detection should run after both sides receive initial concealment");

  console.log("Recon checks passed: recon/sonar ranges, shared targeting, active concealment, area sonar, pre-battle order.");
}

main();
