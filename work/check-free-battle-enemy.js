#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { DATA_FILES, RUNTIME_FILES, projectPath } = require("./project-files");

const FACTIONS = ["federation", "zeon"];
const MAP_TYPES = ["ground", "space", "colony", "air"];
const TARGET_COSTS = [350, 1000, 2400];

function loadRuntime() {
  const element = {
    addEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    classList: { add() {}, remove() {}, toggle() {} },
    dataset: {},
    innerHTML: "",
    value: "",
    textContent: "",
    style: {}
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
    (() => {
      let seed = 0x4f1bbcdc;
      Math.random = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 0x100000000;
      };
    })();
  `, context);
  return context;
}

function evaluate(context, source) {
  return vm.runInContext(source, context);
}

function representativeMapIds(context) {
  return evaluate(context, `Object.fromEntries(${JSON.stringify(MAP_TYPES)}.map((type) => {
    const terrainKinds = new Set(["forest", "desert", "water", "debris"]);
    const map = state.data.maps
      .filter((candidate) => candidate.type === type)
      .sort((a, b) => {
        const score = (candidate) => (candidate.deployment?.enemy?.units?.length ?? 0) * 20
          + (candidate.terrain ?? []).filter((terrain) => terrainKinds.has(terrain)).length;
        return score(b) - score(a);
      })[0];
    return [type, map?.id ?? ""];
  }))`);
}

function generateAndInspect(context, faction, mapId, targetCost) {
  return evaluate(context, `(() => {
    const map = lookup().maps[${JSON.stringify(mapId)}];
    const enemy = generateFreeBattleEnemy(${JSON.stringify(faction)}, map, ${targetCost});
    if (!enemy) return null;
    const characterIds = [enemy.bridge?.captainId, enemy.bridge?.firstOfficerId, ...enemy.formation.flatMap((entry) => entry.characterIds ?? [])]
      .filter(Boolean);
    const characterKeys = characterIds.map(characterKeyFor);
    let totalWeaponSlots = 0;
    let usedWeaponSlots = 0;
    let ordinaryOptions = 0;
    let pilotedUnits = 0;
    let compatiblePilots = 0;
    const entryChecks = enemy.formation.map((entry) => {
      const ms = lookup().ms[entry.msId];
      const pilot = lookup().characters[entry.characterIds?.[0]];
      const weapons = (entry.weaponIds ?? []).map((id) => lookup().weapons[id]);
      const options = (entry.optionIds ?? []).map((id) => lookup().options[id]);
      const slots = weaponSlotCount(ms);
      const usedSlots = selectedWeaponSlotCost(entry.weaponIds);
      const normalOptions = options.filter((option) => !optionProvidesAirDeployment(option));
      totalWeaponSlots += slots;
      usedWeaponSlots += usedSlots;
      ordinaryOptions += normalOptions.length;
      if (pilot) {
        pilotedUnits += 1;
        if (freeBattleCharacterMsBonus(pilot, ms) > 0) compatiblePilots += 1;
      }
      const attackIds = [...(ms.fixedWeaponIds ?? []), ...(entry.weaponIds ?? [])];
      return {
        msId: entry.msId,
        optionIds: [...(entry.optionIds ?? [])],
        exactFaction: ms?.faction === enemy.faction && (!pilot || pilot.faction === enemy.faction),
        pilotRole: !pilot || freeBattleCharacterRoleMatches(pilot, "pilot"),
        pilotValid: !pilot || characterCanPilotMobileSuit(pilot, ms, enemy.faction),
        deployable: formationEntryCanDeployOnMap(entry, map),
        uniqueWeapons: new Set(entry.weaponIds ?? []).size === (entry.weaponIds ?? []).length,
        weaponSlotsValid: usedSlots <= slots,
        weaponsValid: weapons.every((weapon) => weapon && weaponEquippableByMs(ms, weapon)),
        uniqueOptions: new Set(entry.optionIds ?? []).size === (entry.optionIds ?? []).length,
        optionSlotsValid: options.length <= Math.max(0, Number(ms.optionSlots ?? 1) || 0),
        optionsValid: options.every((option) => option && optionEquippableByMs(option, ms, map, enemy.faction)),
        optionsSafe: normalOptions.every((option) => (option.cost ?? 0) > 0 && option.effectType !== "downgrade"),
        canAttack: attackIds.some((id) => weaponCanAttack(lookup().weapons[id]))
      };
    });
    const ship = lookup().battleships[enemy.battleshipId];
    const bridgeCharacters = [enemy.bridge?.captainId, enemy.bridge?.firstOfficerId]
      .filter(Boolean)
      .map((id) => lookup().characters[id]);
    return {
      enemy,
      actualCost: freeBattleEnemyCost(enemy),
      shipValid: ship?.faction === enemy.faction && battleshipCanDeployOnMap(ship, map),
      bridgeFactionValid: bridgeCharacters.every((character) => character?.faction === enemy.faction),
      uniqueCharacters: new Set(characterKeys).size === characterKeys.length,
      entryChecks,
      totalWeaponSlots,
      usedWeaponSlots,
      ordinaryOptions,
      pilotedUnits,
      compatiblePilots
    };
  })()`);
}

function validateTerrainWeighting(context) {
  for (const terrain of ["forest", "desert", "water", "debris"]) {
    const result = evaluate(context, `(() => {
      const adapted = state.data.mobileSuits.find((ms) => ms.terrainSuitability?.[${JSON.stringify(terrain)}] === true);
      const unadapted = state.data.mobileSuits.find((ms) => ms.terrainSuitability?.[${JSON.stringify(terrain)}] !== true);
      const map = { type: ${JSON.stringify(terrain === "debris" ? "space" : "ground")}, width: 2, height: 2, terrain: Array(4).fill(${JSON.stringify(terrain)}) };
      return {
        adaptedId: adapted?.id ?? "",
        adaptedWeight: adapted ? freeBattleTerrainAffinityWeight(adapted, map) : 0,
        unadaptedWeight: unadapted ? freeBattleTerrainAffinityWeight(unadapted, map) : 0
      };
    })()`);
    assert.ok(result.adaptedId, `${terrain}: an adapted MS should exist`);
    assert.ok(result.adaptedWeight > 1, `${terrain}: adapted MS should receive a positive selection weight`);
    assert.equal(result.unadaptedWeight, 1, `${terrain}: unadapted MS should keep the neutral weight`);
  }
}

function main() {
  const context = loadRuntime();
  const mapIds = representativeMapIds(context);
  const aggregate = {
    totalWeaponSlots: 0,
    usedWeaponSlots: 0,
    units: 0,
    ordinaryOptions: 0,
    pilotedUnits: 0,
    compatiblePilots: 0
  };
  let combinations = 0;

  for (const type of MAP_TYPES) {
    const mapId = mapIds[type];
    assert.ok(mapId, `${type}: representative map should exist`);
    for (const faction of FACTIONS) {
      let previousCost = 0;
      for (const targetCost of TARGET_COSTS) {
        const label = `${type}/${mapId}/${faction}/${targetCost}`;
        const result = generateAndInspect(context, faction, mapId, targetCost);
        assert.ok(result, `${label}: formation should be generated`);
        assert.ok(result.enemy.formation.length > 0, `${label}: at least one MS`);
        assert.equal(result.enemy.actualCost, result.actualCost, `${label}: actual cost should be exact`);
        assert.ok(result.actualCost >= targetCost * 0.72, `${label}: ${result.actualCost} is too far below target`);
        assert.ok(result.actualCost <= targetCost * 1.08, `${label}: ${result.actualCost} exceeds target tolerance`);
        assert.ok(result.actualCost > previousCost, `${label}: higher target should produce a costlier formation`);
        assert.ok(result.shipValid, `${label}: battleship faction or deployment invalid`);
        assert.ok(result.bridgeFactionValid, `${label}: bridge faction invalid`);
        assert.ok(result.uniqueCharacters, `${label}: characters should not be duplicated`);
        const invalidEntries = result.entryChecks
          .map((checks, index) => ({
            index,
            msId: checks.msId,
            optionIds: checks.optionIds,
            failed: Object.entries(checks).filter(([, valid]) => valid === false).map(([name]) => name)
          }))
          .filter((entry) => entry.failed.length > 0);
        assert.ok(invalidEntries.length === 0, `${label}: unit validity failed ${JSON.stringify(invalidEntries)}`);
        assert.ok(result.ordinaryOptions <= 1, `${label}: ordinary options should be limited to one per formation`);
        previousCost = result.actualCost;
        aggregate.totalWeaponSlots += result.totalWeaponSlots;
        aggregate.usedWeaponSlots += result.usedWeaponSlots;
        aggregate.units += result.enemy.formation.length;
        aggregate.ordinaryOptions += result.ordinaryOptions;
        aggregate.pilotedUnits += result.pilotedUnits;
        aggregate.compatiblePilots += result.compatiblePilots;
        combinations += 1;
      }
    }
  }

  const weaponFillRate = aggregate.usedWeaponSlots / Math.max(1, aggregate.totalWeaponSlots);
  const ordinaryOptionRate = aggregate.ordinaryOptions / Math.max(1, aggregate.units);
  const compatibilityRate = aggregate.compatiblePilots / Math.max(1, aggregate.pilotedUnits);
  assert.ok(weaponFillRate < 0.75, `weapon slot fill should stay selective, got ${(weaponFillRate * 100).toFixed(1)}%`);
  assert.ok(ordinaryOptionRate < 0.12, `ordinary options should stay uncommon, got ${(ordinaryOptionRate * 100).toFixed(1)}%`);
  assert.ok(compatibilityRate >= 0.12, `compatible pilot combinations should appear regularly, got ${(compatibilityRate * 100).toFixed(1)}%`);
  assert.ok(compatibilityRate <= 0.60, `compatible pilot weighting should retain formation freedom, got ${(compatibilityRate * 100).toFixed(1)}%`);
  validateTerrainWeighting(context);

  console.log(`Free-battle enemy checks passed: ${combinations} terrain/faction/cost combinations, weapon slots ${(weaponFillRate * 100).toFixed(1)}%, ordinary options ${(ordinaryOptionRate * 100).toFixed(1)}%, compatible pilots ${(compatibilityRate * 100).toFixed(1)}%, terrain weighting.`);
}

main();
