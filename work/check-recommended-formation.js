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
    value: "",
    textContent: ""
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
  vm.runInContext(`state.data = window.GAME_DATA; state.formationProfiles = {}; state.favoriteFormations = [];`, context);
  return context;
}

function evaluate(context, source) {
  return vm.runInContext(source, context);
}

function validateRecommendation(context, label) {
  const result = evaluate(context, `(() => {
    const recommendation = buildRecommendedFormation();
    if (!recommendation) return null;
    const repeated = buildRecommendedFormation();
    state.selectedBattleshipId = recommendation.battleshipId;
    state.selectedCaptainId = recommendation.captainId;
    state.selectedFirstOfficerId = recommendation.firstOfficerId;
    state.formation = recommendation.formation;
    const usedKeys = [recommendation.captainId, recommendation.firstOfficerId, ...recommendation.formation.flatMap((entry) => entry.characterIds)]
      .filter(Boolean)
      .map(characterKeyFor);
    const countedUsage = {
      mobileSuits: Object.fromEntries(state.data.mobileSuits.map((item) => [item.id, usedCountInFormation("mobileSuits", item.id)]).filter(([, count]) => count > 0)),
      weapons: Object.fromEntries(state.data.weapons.map((item) => [item.id, usedCountInFormation("weapons", item.id)]).filter(([, count]) => count > 0)),
      options: Object.fromEntries(state.data.options.map((item) => [item.id, usedCountInFormation("options", item.id)]).filter(([, count]) => count > 0))
    };
    return {
      recommendation,
      deterministic: JSON.stringify(recommendation) === JSON.stringify(repeated),
      cost: currentCost(),
      cap: recommendedTargetCost(),
      allDeployable: recommendation.formation.every((entry) => formationEntryCanDeployOnMap(entry)),
      uniqueCharacters: new Set(usedKeys).size === usedKeys.length,
      countedUsage,
      validEntries: recommendation.formation.every((entry) => {
        const ms = lookup().ms[entry.msId];
        const character = lookup().characters[entry.characterIds[0]];
        return cardUsableByFaction(ms, state.faction)
          && (!character || characterCanPilotMobileSuit(character, ms, state.faction))
          && selectedWeaponSlotCost(entry.weaponIds) <= weaponSlotCount(ms)
          && entry.weaponIds.every((id) => weaponEquippableByMs(ms, lookup().weapons[id]))
          && entry.optionIds.every((id) => optionEquippableByMs(lookup().options[id], ms, selectedMap(), state.faction));
      })
    };
  })()`);
  assert.ok(result, `${label}: recommendation should exist`);
  assert.ok(result.recommendation.formation.length > 0, `${label}: at least one MS`);
  assert.ok(result.deterministic, `${label}: recommendation should be deterministic`);
  if (result.cost > result.cap) console.error(label, JSON.stringify(result.recommendation, null, 2));
  assert.ok(result.cost <= result.cap, `${label}: ${result.cost} exceeds ${result.cap}`);
  if (!result.allDeployable) console.error(label, JSON.stringify(result.recommendation, null, 2));
  assert.ok(result.allDeployable, `${label}: every MS should deploy on the selected map`);
  assert.ok(result.uniqueCharacters, `${label}: characters should not be duplicated`);
  assert.ok(result.validEntries, `${label}: equipment and pilots should be valid`);
  for (const [type, counts] of Object.entries(result.countedUsage)) {
    for (const [id, count] of Object.entries(counts)) {
      const owned = evaluate(context, `cardCount(${JSON.stringify(type)}, ${JSON.stringify(id)})`);
      assert.ok(count <= owned, `${label}: ${type}/${id} uses ${count}, owns ${owned}`);
    }
  }
  return result;
}

function main() {
  const context = loadRuntime();
  evaluate(context, `state.collection = defaultCollection(); initializeSelections();`);
  const initialMapIds = evaluate(context, `state.data.maps.filter((map) => playableFactionsOnMap(map).length > 0).slice(0, 8).map((map) => map.id)`);
  for (const mapId of initialMapIds) {
    const factions = evaluate(context, `(() => { state.selectedMapId = ${JSON.stringify(mapId)}; return playableFactionsOnMap(selectedMap()); })()`);
    for (const faction of factions) {
      evaluate(context, `state.battleMode = "campaign"; state.selectedMapId = ${JSON.stringify(mapId)}; state.faction = ${JSON.stringify(faction)}; state.formation = [];`);
      validateRecommendation(context, `initial/${mapId}/${faction}`);
    }
  }

  evaluate(context, `
    state.collection = {
      mobileSuits: Object.fromEntries(state.data.mobileSuits.map((item) => [item.id, 2])),
      battleships: state.data.battleships.filter((item) => item.selectable !== false).map((item) => item.id),
      weapons: Object.fromEntries(state.data.weapons.filter((item) => !item.fixedOnly).map((item) => [item.id, 2])),
      characters: state.data.characters.filter(characterSelectable).map((item) => item.id),
      options: Object.fromEntries(state.data.options.map((item) => [item.id, 2])),
      clearedStages: [], choiceTickets: 0, characterGrowth: {}
    };
  `);
  const allMapIds = evaluate(context, `(() => {
    const representatives = [...state.data.maps.slice(0, 6), ...["ground", "space", "colony", "air"].map((type) => state.data.maps.find((map) => map.type === type)), ...state.data.maps.slice(-2)].filter(Boolean);
    return [...new Set(representatives.map((map) => map.id))];
  })()`);
  let checked = 0;
  for (const mapId of allMapIds) {
    for (const faction of ["federation", "zeon"]) {
      const playable = evaluate(context, `(() => { state.selectedMapId = ${JSON.stringify(mapId)}; state.faction = ${JSON.stringify(faction)}; return playableFactionsOnMap(selectedMap()).includes(state.faction); })()`);
      if (!playable) continue;
      evaluate(context, `state.battleMode = "campaign"; state.formation = [];`);
      validateRecommendation(context, `full/${mapId}/${faction}`);
      checked += 1;
    }
  }

  evaluate(context, `state.battleMode = "free"; state.selectedMapId = state.data.maps[0].id; state.faction = playableFactionsOnMap(selectedMap())[0]; state.formation = [];`);
  const free = validateRecommendation(context, "free-battle");
  assert.equal(free.cap, Math.max(600, evaluate(context, `Number(state.data.costCap) || 1200`)));
  console.log(`Recommended formation checks passed: initial collection, ${checked} full-collection map/faction combinations, free battle, cost, ownership, terrain, equipment, unique characters, determinism.`);
}

main();
