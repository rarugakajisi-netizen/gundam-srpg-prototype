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

  console.log("Recon checks passed: character removal, communication ranges, shared targeting, smoke detection.");
}

main();
