"use strict";

// Title, stage selection, collection screens, setup UI, formation editing, and battle launch.

function characterKeyFor(characterId) {
  const character = lookup().characters[characterId];
  return character?.characterKey ?? characterId;
}

function usedCharacterKeys(options = {}) {
  const keys = new Set();
  state.formation.forEach((entry, index) => {
    if (index !== options.excludeFormationIndex) {
      entry.characterIds.forEach((id) => keys.add(characterKeyFor(id)));
    }
  });
  if (options.includeSelectedCharacter && state.selectedCharacterId) keys.add(characterKeyFor(state.selectedCharacterId));
  if (options.includeBridge !== false) {
    if (options.excludeBridgeSlot !== "captain" && state.selectedCaptainId) keys.add(characterKeyFor(state.selectedCaptainId));
    if (options.excludeBridgeSlot !== "firstOfficer" && state.selectedFirstOfficerId) keys.add(characterKeyFor(state.selectedFirstOfficerId));
  }
  return keys;
}

function clearCharacterConflicts(characterId, owner) {
  const key = characterKeyFor(characterId);
  if (!key) return;
  if (owner !== "captain" && state.selectedCaptainId && characterKeyFor(state.selectedCaptainId) === key) state.selectedCaptainId = "";
  if (owner !== "firstOfficer" && state.selectedFirstOfficerId && characterKeyFor(state.selectedFirstOfficerId) === key) state.selectedFirstOfficerId = "";
  if (owner !== "mobileSuit" && state.selectedCharacterId && characterKeyFor(state.selectedCharacterId) === key) state.selectedCharacterId = "";
}

function defaultBridgeSelection(faction) {
  const candidates = state.data.characters.filter((character) => characterSelectable(character) && characterUsableByFaction(character, faction) && hasCard("characters", character.id));
  const captain = [...candidates].sort((a, b) => b.command - a.command || b.support - a.support)[0];
  const firstOfficer = [...candidates]
    .filter((character) => character.characterKey !== captain?.characterKey)
    .sort((a, b) => (b.support + b.maintenance) - (a.support + a.maintenance) || b.command - a.command)[0];
  return {
    captainId: captain?.id ?? "",
    firstOfficerId: firstOfficer?.id ?? ""
  };
}

function defaultEnemyBridgeSelection(faction) {
  const factionCharacters = state.data.characters.filter((character) => characterUsableByFaction(character, faction));
  const namedCharacters = factionCharacters.filter((character) => character.selectable !== false);
  const candidates = namedCharacters.length > 0 ? namedCharacters : factionCharacters;
  const captain = [...candidates].sort((a, b) => b.command - a.command || b.support - a.support)[0];
  const firstOfficer = [...candidates]
    .filter((character) => character.characterKey !== captain?.characterKey)
    .sort((a, b) => (b.support + b.maintenance) - (a.support + a.maintenance) || b.command - a.command)[0];
  return {
    captainId: captain?.id ?? "",
    firstOfficerId: firstOfficer?.id ?? ""
  };
}

function enemyBridgeForStage(mapId, faction) {
  const stage = stageConfig(mapId);
  if (stage.enemyCaptainId !== undefined || stage.enemyFirstOfficerId !== undefined) {
    return {
      captainId: stage.enemyCaptainId ?? "",
      firstOfficerId: stage.enemyFirstOfficerId ?? ""
    };
  }
  return defaultEnemyBridgeSelection(faction);
}

function firstAvailableCharacter(faction, options = {}) {
  const used = usedCharacterKeys(options);
  return state.data.characters.find((character) => characterSelectable(character) && characterUsableByFaction(character, faction) && hasCard("characters", character.id) && !used.has(character.characterKey ?? character.id));
}

function normalizeSelections() {
  const { ms, characters, maps, battleships } = lookup();
  if (!maps[state.selectedMapId]) state.selectedMapId = state.data.maps[0].id;
  const currentMap = selectedMap();
  const selectedBattleship = battleships[state.selectedBattleshipId];
  if (!selectedBattleship || !hasCard("battleships", selectedBattleship.id) || selectedBattleship.faction !== state.faction || !battleshipCanDeployOnMap(selectedBattleship, currentMap)) {
    state.selectedBattleshipId = state.data.battleships.find((item) => item.faction === state.faction && hasCard("battleships", item.id) && battleshipCanDeployOnMap(item, currentMap))?.id ?? "";
  }
  const selectedMs = ms[state.selectedMsId];
  const selectedMsInvalid = !selectedMs || !hasCard("mobileSuits", selectedMs.id) || !mobileSuitUsableByFaction(selectedMs, state.faction) || !mobileSuitCanPotentiallyDeployOnMap(selectedMs, currentMap, state.faction);
  if (selectedMsInvalid) {
    state.selectedMsId = state.data.mobileSuits.find((item) => mobileSuitUsableByFaction(item, state.faction) && hasCard("mobileSuits", item.id) && mobileSuitCanPotentiallyDeployOnMap(item, currentMap, state.faction))?.id ?? "";
  }
  const normalizedMs = ms[state.selectedMsId];
  if (normalizedMs) {
    const availableWeaponIds = state.data.weapons
      .filter((weapon) => remainingCardCopies("weapons", weapon.id) > 0
        && weaponEquippableByMs(normalizedMs, weapon)
        && weaponSlotCost(weapon) <= weaponSlotCount(normalizedMs))
      .map((weapon) => weapon.id);
    const selectedCounts = {};
    const availableSelection = state.selectedWeaponIds.filter((id) => {
      if (!availableWeaponIds.includes(id)) return false;
      const nextCount = (selectedCounts[id] ?? 0) + 1;
      if (nextCount > remainingCardCopies("weapons", id)) return false;
      selectedCounts[id] = nextCount;
      return true;
    });
    state.selectedWeaponIds = fitWeaponIdsToSlots(availableSelection, normalizedMs);
  }
  const selectedOption = lookup().options[state.selectedOptionId];
  if (state.selectedOptionId && (!selectedOption || remainingCardCopies("options", selectedOption.id) < 1 || !optionEquippableByMs(selectedOption, normalizedMs, currentMap, state.faction) || (normalizedMs?.optionSlots ?? 1) < 1)) {
    state.selectedOptionId = "";
  }

  if (!mobileSuitCanHavePilot(normalizedMs)) {
    state.selectedCharacterId = "";
  }

  const captain = characters[state.selectedCaptainId];
  const captainUsed = captain && usedCharacterKeys({ excludeBridgeSlot: "captain", includeSelectedCharacter: true }).has(captain.characterKey ?? captain.id);
  if (state.selectedCaptainId && (!captain || !characterSelectable(captain) || !hasCard("characters", captain.id) || !characterUsableByFaction(captain, state.faction) || captainUsed)) {
    state.selectedCaptainId = "";
  }

  const firstOfficer = characters[state.selectedFirstOfficerId];
  const firstOfficerUsed = firstOfficer && usedCharacterKeys({ excludeBridgeSlot: "firstOfficer", includeSelectedCharacter: true }).has(firstOfficer.characterKey ?? firstOfficer.id);
  if (state.selectedFirstOfficerId && (!firstOfficer || !characterSelectable(firstOfficer) || !hasCard("characters", firstOfficer.id) || !characterUsableByFaction(firstOfficer, state.faction) || firstOfficerUsed)) {
    state.selectedFirstOfficerId = "";
  }

  const selectedCharacter = characters[state.selectedCharacterId];
  const selectedUsed = selectedCharacter && usedCharacterKeys().has(selectedCharacter.characterKey ?? selectedCharacter.id);
  if (state.selectedCharacterId && (!mobileSuitCanHavePilot(normalizedMs) || !selectedCharacter || !characterSelectable(selectedCharacter) || !hasCard("characters", selectedCharacter.id) || !characterCanPilotMobileSuit(selectedCharacter, normalizedMs, state.faction) || selectedUsed)) {
    state.selectedCharacterId = "";
  }
}

function formationCost(entry) {
  return formationEntryCost(entry);
}

function formationEntryCost(entry) {
  const { ms, weapons, characters, options } = lookup();
  return (ms[entry.msId]?.cost ?? 0)
    + (entry.characterIds ?? []).reduce((sum, id) => sum + (characters[id]?.cost ?? 0), 0)
    + (entry.weaponIds ?? []).reduce((sum, id) => sum + (weapons[id]?.cost ?? 0), 0)
    + (entry.optionIds ?? []).reduce((sum, id) => sum + (options[id]?.cost ?? 0), 0);
}

function bridgeCost() {
  const { characters } = lookup();
  return [state.selectedCaptainId, state.selectedFirstOfficerId].reduce((sum, id) => sum + (characters[id]?.cost ?? 0), 0);
}

function crewCost(characterIds) {
  const { characters } = lookup();
  return (characterIds ?? []).reduce((sum, id) => sum + (characters[id]?.cost ?? 0), 0);
}

function currentCost() {
  const { battleships } = lookup();
  const battleshipCost = battleships[state.selectedBattleshipId]?.cost ?? 0;
  return battleshipCost + bridgeCost() + state.formation.reduce((sum, entry) => sum + formationCost(entry), 0);
}

function recommendedTargetCost() {
  return isFreeBattle() ? Math.max(600, Number(state.data.costCap) || 1200) : stageCostCap(state.selectedMapId);
}

function recommendedMaximumUnitCount(map = selectedMap()) {
  return clamp(Number(map.deployment?.player?.units?.length) || 4, 1, 6);
}

function recommendedBattleshipScore(ship) {
  const support = ship.support ?? {};
  const weaponPower = (ship.weaponIds ?? []).reduce((sum, id) => sum + (lookup().weapons[id]?.power ?? 0), 0);
  return (ship.armor ?? 0)
    + (ship.energy ?? 0) * 1.4
    + (ship.agility ?? 0) * 18
    + (ship.mobility ?? 0) * 65
    + Object.values(support).reduce((sum, value) => sum + (Number(value) || 0), 0) * 5
    + weaponPower * 1.2;
}

function recommendedMobileSuitScore(ms) {
  const fixedWeapons = (ms.fixedWeaponIds ?? []).map((id) => lookup().weapons[id]).filter(Boolean);
  const fixedPower = fixedWeapons.reduce((sum, weapon) => sum + (weaponCanAttack(weapon) ? (weapon.power ?? 0) * (weapon.accuracy ?? 0) / 100 : 0), 0);
  return (ms.armor ?? 0) * 0.45
    + (ms.energy ?? 0) * 0.6
    + (ms.agility ?? 0) * 12
    + (ms.mobility ?? 0) * 32
    + fixedPower;
}

function recommendedCharacterScore(character, role, ms = null) {
  if (role === "captain") return character.command * 3 + character.support * 1.4 + character.maintenance + character.reaction * 0.5;
  if (role === "firstOfficer") return character.support * 2.4 + character.maintenance * 2.8 + character.command + character.reaction * 0.4;
  const fixedWeapons = (ms?.fixedWeaponIds ?? []).map((id) => lookup().weapons[id]).filter(Boolean);
  const prefersMelee = fixedWeapons.some((weapon) => weapon.attackType === "melee")
    && !fixedWeapons.some((weapon) => weapon.attackType === "shooting");
  const attackStat = prefersMelee ? character.melee : character.shooting;
  const secondaryStat = prefersMelee ? character.shooting : character.melee;
  return attackStat * 2.3 + secondaryStat * 0.7 + character.reaction * 1.8 + character.awakening * 0.5;
}

function recommendedWeaponScore(weapon, character = null) {
  const attackValue = weaponCanAttack(weapon)
    ? (weapon.power ?? 0) * (weapon.accuracy ?? 0) / 100 + (weapon.range ?? 0) * 8
    : 0;
  const pilotBonus = weapon.attackType === "melee" ? character?.melee ?? 0 : character?.shooting ?? 0;
  return attackValue + (weapon.durability ?? 0) * 0.45 + pilotBonus * 0.7;
}

function recommendedOptionScore(option) {
  return (option.armorModifier ?? 0) * 0.25
    + (option.energyModifier ?? 0) * 0.4
    + (option.agilityModifier ?? 0) * 2
    + (option.mobilityModifier ?? option.value ?? 0) * 18
    + (option.accuracyModifier ?? 0) * 2
    + (option.damageModifier ?? 0) * 2
    + (option.grantsSkill ? 28 : 0)
    + Math.max(0, option.cost ?? 0) * 0.2;
}

function recommendedCountMap(type) {
  const items = type === "mobileSuits" ? state.data.mobileSuits : type === "weapons" ? state.data.weapons : state.data.options ?? [];
  return Object.fromEntries(items.map((item) => [item.id, cardCount(type, item.id)]));
}

function takeRecommendedCount(counts, id) {
  if (!id || (counts[id] ?? 0) <= 0) return false;
  counts[id] -= 1;
  return true;
}

function recommendedAirOption(ms, map, optionCounts) {
  if (map.type !== "air" || mobileSuitNativelyAirborne(ms)) return null;
  if (!(ms.mapTypes ?? ["ground", "space"]).some((type) => mapDeployTypes(map).includes(type)) || !mapHasStandableCell(ms, map)) return null;
  return (state.data.options ?? [])
    .filter((option) => (optionCounts[option.id] ?? 0) > 0
      && optionProvidesAirDeployment(option)
      && optionEquippableByMs(option, ms, map, state.faction))
    .sort((a, b) => (a.cost ?? 0) - (b.cost ?? 0) || recommendedOptionScore(b) - recommendedOptionScore(a))[0] ?? null;
}

function recommendedCharacter(usedKeys, role, maxCost, ms = null) {
  const candidates = state.data.characters
    .filter((character) => characterSelectable(character)
      && hasCard("characters", character.id)
      && !usedKeys.has(character.characterKey ?? character.id)
      && (role === "pilot"
        ? characterCanPilotMobileSuit(character, ms, state.faction)
        : characterUsableByFaction(character, state.faction))
      && (character.cost ?? 0) <= maxCost)
    .sort((a, b) => recommendedCharacterScore(b, role, ms) - recommendedCharacterScore(a, role, ms)
      || (a.cost ?? 0) - (b.cost ?? 0)
      || a.id.localeCompare(b.id));
  return candidates[0] ?? null;
}

function addRecommendedWeapon(entry, ms, weaponCounts, remainingBudget, filter = () => true) {
  const usedSlots = selectedWeaponSlotCost(entry.weaponIds);
  const character = lookup().characters[entry.characterIds[0]] ?? null;
  const weapon = state.data.weapons
    .filter((candidate) => (weaponCounts[candidate.id] ?? 0) > 0
      && (candidate.cost ?? 0) <= remainingBudget
      && filter(candidate)
      && weaponEquippableByMs(ms, candidate)
      && usedSlots + weaponSlotCost(candidate) <= weaponSlotCount(ms))
    .sort((a, b) => recommendedWeaponScore(b, character) - recommendedWeaponScore(a, character)
      || (a.cost ?? 0) - (b.cost ?? 0)
      || a.id.localeCompare(b.id))[0];
  if (!weapon || !takeRecommendedCount(weaponCounts, weapon.id)) return 0;
  entry.weaponIds.push(weapon.id);
  return weapon.cost ?? 0;
}

function buildRecommendedFormation() {
  const map = selectedMap();
  const targetCost = recommendedTargetCost();
  const msCounts = recommendedCountMap("mobileSuits");
  const weaponCounts = recommendedCountMap("weapons");
  const optionCounts = recommendedCountMap("options");
  const deployableMs = state.data.mobileSuits.filter((ms) =>
    (msCounts[ms.id] ?? 0) > 0
    && cardUsableByFaction(ms, state.faction)
    && mobileSuitCanPotentiallyDeployOnMap(ms, map, state.faction)
    && (mobileSuitCanDeployOnMap(ms, map) || recommendedAirOption(ms, map, optionCounts))
  );
  const ships = state.data.battleships.filter((ship) =>
    ship.faction === state.faction
    && hasCard("battleships", ship.id)
    && battleshipCanDeployOnMap(ship, map)
  );
  if (ships.length === 0 || deployableMs.length === 0) return null;

  const cheapestMsCost = Math.min(...deployableMs.map((ms) => {
    const airOption = recommendedAirOption(ms, map, optionCounts);
    return (ms.cost ?? 0) + (airOption?.cost ?? 0);
  }));
  const affordableShips = ships.filter((ship) => (ship.cost ?? 0) + cheapestMsCost <= targetCost);
  if (affordableShips.length === 0) return null;
  const preferredShips = affordableShips.filter((ship) => (ship.cost ?? 0) <= targetCost * 0.32);
  const ship = (preferredShips.length > 0 ? preferredShips : affordableShips)
    .sort((a, b) => recommendedBattleshipScore(b) - recommendedBattleshipScore(a)
      || (a.cost ?? 0) - (b.cost ?? 0)
      || a.id.localeCompare(b.id))[0];

  const totalOwnedMs = deployableMs.reduce((sum, ms) => sum + (msCounts[ms.id] ?? 0), 0);
  const maximumUnits = Math.min(recommendedMaximumUnitCount(map), totalOwnedMs);
  const desiredUnits = Math.min(maximumUnits, Math.max(1, Math.floor((targetCost - ship.cost) / 260)));
  const crewAndEquipmentReserve = Math.min(180, targetCost * 0.15) + desiredUnits * 80;
  let baseBudget = Math.max(cheapestMsCost, targetCost - ship.cost - crewAndEquipmentReserve);
  const formation = [];
  const selectedMsCounts = {};

  for (let index = 0; index < desiredUnits; index += 1) {
    const slotsLeft = desiredUnits - index;
    const candidates = deployableMs.map((ms) => {
      const airOption = recommendedAirOption(ms, map, optionCounts);
      return {
        ms,
        airOption,
        cost: (ms.cost ?? 0) + (airOption?.cost ?? 0),
        score: recommendedMobileSuitScore(ms) - (selectedMsCounts[ms.id] ?? 0) * 90
      };
    }).filter((candidate) => (msCounts[candidate.ms.id] ?? 0) > 0
      && (mobileSuitCanDeployOnMap(candidate.ms, map) || candidate.airOption)
      && candidate.cost <= baseBudget);
    if (candidates.length === 0) break;
    const ceiling = baseBudget / slotsLeft * 1.55;
    const withinShare = candidates.filter((candidate) => candidate.cost <= ceiling);
    const candidate = (withinShare.length > 0 ? withinShare : candidates)
      .sort((a, b) => b.score - a.score || a.cost - b.cost || a.ms.id.localeCompare(b.ms.id))[0];
    takeRecommendedCount(msCounts, candidate.ms.id);
    if (candidate.airOption) takeRecommendedCount(optionCounts, candidate.airOption.id);
    selectedMsCounts[candidate.ms.id] = (selectedMsCounts[candidate.ms.id] ?? 0) + 1;
    formation.push({
      msId: candidate.ms.id,
      characterIds: [],
      weaponIds: [],
      optionIds: candidate.airOption ? [candidate.airOption.id] : []
    });
    baseBudget -= candidate.cost;
  }
  if (formation.length === 0) return null;

  let spent = (ship.cost ?? 0) + formationEntriesCost(formation);
  const usedKeys = new Set();
  const captain = recommendedCharacter(usedKeys, "captain", Math.min(targetCost - spent, Math.max(70, targetCost * 0.14)));
  if (captain) {
    usedKeys.add(captain.characterKey ?? captain.id);
    spent += captain.cost ?? 0;
  }

  const pilotEntries = [...formation]
    .filter((entry) => mobileSuitCanHavePilot(lookup().ms[entry.msId]))
    .sort((a, b) => recommendedMobileSuitScore(lookup().ms[b.msId]) - recommendedMobileSuitScore(lookup().ms[a.msId]));
  pilotEntries.forEach((entry, index) => {
    const remainingPilots = pilotEntries.length - index;
    const equipmentReserve = remainingPilots * 25;
    const available = Math.max(0, targetCost - spent - equipmentReserve);
    const pilotBudget = Math.min(targetCost - spent, available / Math.max(1, remainingPilots) * 1.45);
    const pilot = recommendedCharacter(usedKeys, "pilot", pilotBudget, lookup().ms[entry.msId]);
    if (!pilot) return;
    entry.characterIds = [pilot.id];
    usedKeys.add(pilot.characterKey ?? pilot.id);
    spent += pilot.cost ?? 0;
  });

  formation.forEach((entry, index) => {
    const available = Math.max(0, targetCost - spent);
    const perUnitBudget = Math.min(available, available / Math.max(1, formation.length - index) * 1.35);
    spent += addRecommendedWeapon(entry, lookup().ms[entry.msId], weaponCounts, perUnitBudget, (weapon) => weapon.kind !== "shield");
  });

  const firstOfficer = recommendedCharacter(usedKeys, "firstOfficer", Math.min(targetCost - spent, Math.max(50, targetCost * 0.1)));
  if (firstOfficer) {
    usedKeys.add(firstOfficer.characterKey ?? firstOfficer.id);
    spent += firstOfficer.cost ?? 0;
  }

  formation.forEach((entry) => {
    const ms = lookup().ms[entry.msId];
    let available = Math.max(0, targetCost - spent);
    let added = addRecommendedWeapon(entry, ms, weaponCounts, available, (weapon) => weapon.kind === "shield");
    spent += added;
    available = Math.max(0, targetCost - spent);
    while (added > 0 && selectedWeaponSlotCost(entry.weaponIds) < weaponSlotCount(ms)) {
      added = addRecommendedWeapon(entry, ms, weaponCounts, available, (weapon) => !entry.weaponIds.includes(weapon.id));
      spent += added;
      available = Math.max(0, targetCost - spent);
    }
  });

  formation.forEach((entry) => {
    const ms = lookup().ms[entry.msId];
    if ((ms.optionSlots ?? 1) <= entry.optionIds.length) return;
    const option = (state.data.options ?? [])
      .filter((candidate) => (optionCounts[candidate.id] ?? 0) > 0
        && (candidate.cost ?? 0) > 0
        && candidate.effectType !== "downgrade"
        && (candidate.cost ?? 0) <= targetCost - spent
        && optionEquippableByMs(candidate, ms, map, state.faction))
      .sort((a, b) => recommendedOptionScore(b) - recommendedOptionScore(a)
        || (a.cost ?? 0) - (b.cost ?? 0)
        || a.id.localeCompare(b.id))[0];
    if (!option || !takeRecommendedCount(optionCounts, option.id)) return;
    entry.optionIds.push(option.id);
    spent += option.cost ?? 0;
  });

  return {
    targetCost,
    battleshipId: ship.id,
    captainId: captain?.id ?? "",
    firstOfficerId: firstOfficer?.id ?? "",
    formation
  };
}

function applyRecommendedFormation() {
  const recommendation = buildRecommendedFormation();
  if (!recommendation) {
    state.setupNotice = "所持カードと出撃条件から、編成可能な組み合わせを作れませんでした。";
    return false;
  }
  state.selectedBattleshipId = recommendation.battleshipId;
  state.selectedCaptainId = recommendation.captainId;
  state.selectedFirstOfficerId = recommendation.firstOfficerId;
  state.formation = recommendation.formation;
  state.selectedMsId = recommendation.formation[0]?.msId ?? state.selectedMsId;
  state.selectedCharacterId = "";
  state.selectedWeaponIds = [];
  state.selectedOptionId = "";
  state.freeBattleEnemy = null;
  state.setupNotice = `おすすめ編成を作成しました（${currentCost()} / ${isFreeBattle() ? `目安${recommendation.targetCost}` : recommendation.targetCost}）。このまま出撃するか、手動で調整できます。`;
  rememberFormation();
  return true;
}

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffled(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function weightedRandomChoice(items, weightForItem) {
  const weighted = items
    .map((item) => ({ item, weight: Math.max(0, Number(weightForItem(item)) || 0) }))
    .filter((entry) => entry.weight > 0);
  if (weighted.length === 0) return randomChoice(items);
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) return entry.item;
  }
  return weighted[weighted.length - 1].item;
}

function costWithBridge(ship, bridge) {
  return (ship?.cost ?? 0) + crewCost([bridge?.captainId, bridge?.firstOfficerId]);
}

function formationEntriesCost(entries) {
  return entries.reduce((sum, entry) => sum + formationEntryCost(entry), 0);
}

function freeBattleEnemyCost(enemy) {
  return costWithBridge(lookup().battleships[enemy?.battleshipId], enemy?.bridge)
    + formationEntriesCost(enemy?.formation ?? []);
}

function freeBattleEnemyFaction() {
  return state.freeBattleEnemy?.faction ?? otherFaction(state.faction);
}

function freeBattleEnemyFormation() {
  return (state.freeBattleEnemy?.formation ?? []).map((entry) => ({
    msId: entry.msId,
    characterIds: [...(entry.characterIds ?? [])],
    weaponIds: [...(entry.weaponIds ?? [])],
    optionIds: [...(entry.optionIds ?? [])]
  }));
}

function freeBattleEnemyBattleship() {
  const id = state.freeBattleEnemy?.battleshipId;
  return id ? lookup().battleships[id] : null;
}

function freeBattleEnemyBridge() {
  return state.freeBattleEnemy?.bridge ?? {};
}

function enemyFactionForCurrentBattle(mapId = state.selectedMapId) {
  return isFreeBattle() ? freeBattleEnemyFaction() : stageEnemyFaction(mapId);
}

function enemyFormationForCurrentBattle(mapId = state.selectedMapId, faction = enemyFactionForCurrentBattle(mapId)) {
  return isFreeBattle() ? freeBattleEnemyFormation() : enemyFormationForStage(mapId, faction);
}

function enemyBattleshipForCurrentBattle(mapId = state.selectedMapId) {
  return isFreeBattle() ? freeBattleEnemyBattleship() : enemyBattleshipForStage(mapId);
}

function enemyBridgeForCurrentBattle(mapId = state.selectedMapId, faction = enemyFactionForCurrentBattle(mapId)) {
  return isFreeBattle() ? freeBattleEnemyBridge() : enemyBridgeForStage(mapId, faction);
}

const FREE_BATTLE_COMPATIBILITY_PREFERENCE_RATE = 0.3;
const FREE_BATTLE_ORDINARY_OPTION_RATE = 0.18;
const FREE_BATTLE_GENERATION_ATTEMPTS = 28;
const FREE_BATTLE_COMPATIBILITY_BONUS_CACHE = new WeakMap();
const FREE_BATTLE_ORDINARY_OPTION_TYPES = new Set([
  "ammo",
  "energy",
  "defense-ammo",
  "defense-beam",
  "defense-melee",
  "range",
  "mobility"
]);

function freeBattleCharacterRoleMatches(character, role) {
  const roles = character.roles ?? [];
  if (role === "pilot") return roles.includes("pilot");
  if (role === "captain") return roles.includes("captain") || roles.includes("commander");
  if (role === "firstOfficer") return roles.includes("operator") || roles.includes("mechanic") || roles.includes("commander");
  return true;
}

function freeBattleCandidateCharacters(faction, usedKeys, role) {
  const candidates = state.data.characters.filter((character) =>
    character.faction === faction
    && !usedKeys.has(character.characterKey ?? character.id)
  );
  const roleCandidates = candidates.filter((character) => freeBattleCharacterRoleMatches(character, role));
  return role === "pilot" || roleCandidates.length > 0 ? roleCandidates : candidates;
}

function freeBattleCharacterMsBonus(character, ms) {
  if (!character || !ms) return 0;
  let msBonuses = FREE_BATTLE_COMPATIBILITY_BONUS_CACHE.get(character);
  if (!msBonuses) {
    msBonuses = new WeakMap();
    FREE_BATTLE_COMPATIBILITY_BONUS_CACHE.set(character, msBonuses);
  }
  if (msBonuses.has(ms)) return msBonuses.get(ms);
  const bonus = (state.data.compatibility?.characterMs ?? [])
    .filter((item) => item.characterId === character?.id && characterMsCompatibilityMatches(item, ms))
    .reduce((best, item) => Math.max(best, Number(item.evasionBonus) || 0), 0);
  msBonuses.set(ms, bonus);
  return bonus;
}

function freeBattleRandomCharacter(faction, usedKeys, role, maxCost, targetCost, ms = null) {
  const affordable = freeBattleCandidateCharacters(faction, usedKeys, role)
    .filter((character) => (character.cost ?? 0) <= Math.max(0, maxCost));
  if (affordable.length === 0) return null;
  const compatible = ms ? affordable.filter((character) => freeBattleCharacterMsBonus(character, ms) > 0) : [];
  const pool = compatible.length > 0 && Math.random() < FREE_BATTLE_COMPATIBILITY_PREFERENCE_RATE
    ? compatible
    : affordable;
  const picked = weightedRandomChoice(pool, (character) => {
    const quality = Math.max(1, recommendedCharacterScore(character, role, ms));
    const costFit = 1 / (1 + Math.abs((character.cost ?? 0) - targetCost) / 35);
    const compatibilityWeight = ms && freeBattleCharacterMsBonus(character, ms) > 0 ? 1.25 : 1;
    return (0.6 + quality / 110) * costFit * compatibilityWeight;
  });
  if (!picked) return null;
  usedKeys.add(picked.characterKey ?? picked.id);
  return picked;
}

function freeBattleRequiredOptionIds(ms, faction, map) {
  if (mobileSuitCanDeployOnMap(ms, map)) return [];
  if (map.type !== "air" || (ms.optionSlots ?? 1) < 1) return null;
  const option = (state.data.options ?? [])
    .filter((candidate) => optionProvidesAirDeployment(candidate) && optionEquippableByMs(candidate, ms, map, faction))
    .sort((a, b) => (a.cost ?? 0) - (b.cost ?? 0) || recommendedOptionScore(b) - recommendedOptionScore(a))[0];
  return option ? [option.id] : null;
}

function freeBattleMobileSuitRole(ms) {
  const fixedWeapons = (ms.fixedWeaponIds ?? []).map((id) => lookup().weapons[id]).filter(Boolean);
  const maximumRange = fixedWeapons.reduce((best, weapon) => Math.max(best, Number(weapon.range ?? weapon.maxRange) || 1), 1);
  if (maximumRange >= 4 || (ms.tags ?? []).some((tag) => /sniper|cannon/i.test(tag))) return "support";
  if ((ms.mobility ?? 0) >= 6 || (ms.agility ?? 0) >= 28) return "mobile";
  if ((ms.armor ?? 0) >= 350 || fixedWeapons.some((weapon) => weapon.attackType === "melee" && (weapon.power ?? 0) >= 80)) return "frontline";
  return "general";
}

function freeBattleTerrainAffinityWeight(ms, map) {
  const relevantTerrains = new Set(["water", "forest", "desert", "debris"]);
  const cells = Array.from({ length: boardWidth(map) * boardHeight(map) }, (_, index) =>
    map.terrain?.[index] ?? (map.type === "space" ? "space" : map.type === "air" ? "air" : "plain")
  );
  const standableCells = cells.filter((terrain) => !terrainBlocksMovement(terrain));
  const suitableCells = standableCells.filter((terrain) =>
    relevantTerrains.has(terrain) && ms.terrainSuitability?.[terrain] === true
  );
  const suitableShare = suitableCells.length / Math.max(1, standableCells.length);
  return 1 + Math.min(0.55, suitableShare * 1.8);
}

function freeBattleMobileSuitCandidates(faction, map) {
  return state.data.mobileSuits.flatMap((ms) => {
    if (ms.faction !== faction || !mobileSuitCanPotentiallyDeployOnMap(ms, map, faction)) return [];
    const requiredOptionIds = freeBattleRequiredOptionIds(ms, faction, map);
    if (requiredOptionIds === null) return [];
    const requiredOptionCost = requiredOptionIds.reduce((sum, id) => sum + (lookup().options[id]?.cost ?? 0), 0);
    return [{
      ms,
      role: freeBattleMobileSuitRole(ms),
      qualityScore: recommendedMobileSuitScore(ms),
      terrainWeight: freeBattleTerrainAffinityWeight(ms, map),
      requiredOptionIds,
      baseCost: (ms.cost ?? 0) + requiredOptionCost
    }];
  });
}

function freeBattleRandomMobileSuit(candidates, targetCost, maxCost, selectedCounts, roleCounts) {
  const affordable = candidates.filter((candidate) => candidate.baseCost <= maxCost);
  if (affordable.length === 0) return null;
  return weightedRandomChoice(affordable, (candidate) => {
    const costFit = 1 / (1 + Math.abs(candidate.baseCost - targetCost) / 55);
    const efficiency = candidate.qualityScore / Math.max(80, candidate.baseCost);
    const repeatWeight = 1 / (1 + (selectedCounts[candidate.ms.id] ?? 0) * 0.8);
    const roleWeight = 1 / (1 + (roleCounts[candidate.role] ?? 0) * 0.45);
    return costFit * (0.75 + efficiency * 0.5) * repeatWeight * roleWeight * candidate.terrainWeight;
  });
}

function freeBattleRandomBattleship(faction, map, targetCost, deployableShips = null) {
  const deployable = deployableShips ?? state.data.battleships
    .filter((ship) => ship.faction === faction && battleshipCanDeployOnMap(ship, map));
  if (deployable.length === 0) return null;
  const minimumCost = Math.min(...deployable.map((ship) => ship.cost ?? 0));
  const maximumAffordable = Math.max(minimumCost, targetCost * 0.36);
  const candidates = deployable.filter((ship) => (ship.cost ?? 0) <= maximumAffordable);
  const shipTarget = clamp(targetCost * 0.21, minimumCost, Math.max(...candidates.map((ship) => ship.cost ?? 0)));
  return weightedRandomChoice(candidates, (ship) => {
    const costFit = 1 / (1 + Math.abs((ship.cost ?? 0) - shipTarget) / 65);
    const efficiency = recommendedBattleshipScore(ship) / Math.max(150, ship.cost ?? 0);
    return costFit * (0.7 + efficiency * 0.12);
  });
}

function freeBattleRandomBridge(faction, usedKeys, targetCost, remainingBudget) {
  const equipmentReserve = Math.min(remainingBudget, Math.max(25, targetCost * 0.08));
  let available = Math.max(0, remainingBudget - equipmentReserve);
  const captainBudget = Math.min(available, Math.max(45, targetCost * 0.09));
  const captain = freeBattleRandomCharacter(faction, usedKeys, "captain", captainBudget, captainBudget * 0.8);
  available -= captain?.cost ?? 0;
  const firstOfficerBudget = Math.min(available, Math.max(35, targetCost * 0.065));
  const firstOfficer = Math.random() < 0.68
    ? freeBattleRandomCharacter(faction, usedKeys, "firstOfficer", firstOfficerBudget, firstOfficerBudget * 0.75)
    : null;
  return {
    captainId: captain?.id ?? "",
    firstOfficerId: firstOfficer?.id ?? ""
  };
}

function freeBattleWeaponComplements(weapon, selectedWeapons) {
  if (selectedWeapons.length === 0) return true;
  return selectedWeapons.every((selected) =>
    selected.attackType !== weapon.attackType
    || Math.abs((selected.range ?? 1) - (weapon.range ?? 1)) >= 2
    || selected.kind === "shield"
    || weapon.kind === "shield"
  );
}

function freeBattlePickWeapon(candidates, character, targetCost) {
  if (candidates.length === 0) return null;
  return weightedRandomChoice(candidates, (weapon) => {
    const quality = recommendedWeaponScore(weapon, character);
    const costFit = 1 / (1 + Math.abs((weapon.cost ?? 0) - targetCost) / 30);
    return (0.8 + quality / 140) * costFit;
  });
}

function freeBattleEquipWeapons(entry, budget) {
  const ms = lookup().ms[entry.msId];
  const character = lookup().characters[entry.characterIds[0]] ?? null;
  const slots = weaponSlotCount(ms);
  if (slots <= 0 || budget < 0) return 0;
  const candidates = state.data.weapons.filter((weapon) => weaponEquippableByMs(ms, weapon));
  const attacks = candidates.filter((weapon) => weapon.kind !== "shield");
  const fixedAttacks = (ms.fixedWeaponIds ?? []).map((id) => lookup().weapons[id]).filter((weapon) => weapon && weapon.kind !== "shield");
  const strongestFixedPower = fixedAttacks.reduce((best, weapon) => Math.max(best, weapon.power ?? 0), 0);
  const selected = [];
  let spent = 0;
  let usedSlots = 0;
  const affordableAttacks = attacks.filter((weapon) =>
    (weapon.cost ?? 0) <= budget - spent
    && usedSlots + weaponSlotCost(weapon) <= slots
  );
  const needsMainWeapon = fixedAttacks.length === 0 || strongestFixedPower < 90;
  if (needsMainWeapon || Math.random() < 0.58) {
    const main = freeBattlePickWeapon(affordableAttacks, character, Math.max(25, budget * 0.55));
    if (main) {
      selected.push(main);
      spent += main.cost ?? 0;
      usedSlots += weaponSlotCost(main);
    }
  }
  if (usedSlots < slots) {
    const role = freeBattleMobileSuitRole(ms);
    const shieldChance = role === "frontline" ? 0.36 : role === "general" ? 0.25 : 0.14;
    const shields = candidates.filter((weapon) =>
      weapon.kind === "shield"
      && !selected.includes(weapon)
      && (weapon.cost ?? 0) <= budget - spent
      && usedSlots + weaponSlotCost(weapon) <= slots
    );
    const shield = Math.random() < shieldChance ? freeBattlePickWeapon(shields, character, Math.max(20, budget - spent)) : null;
    if (shield) {
      selected.push(shield);
      spent += shield.cost ?? 0;
      usedSlots += weaponSlotCost(shield);
    } else if (Math.random() < 0.18) {
      const alternatives = attacks.filter((weapon) =>
        !selected.includes(weapon)
        && freeBattleWeaponComplements(weapon, selected)
        && (weapon.cost ?? 0) <= budget - spent
        && usedSlots + weaponSlotCost(weapon) <= slots
      );
      const alternative = freeBattlePickWeapon(alternatives, character, Math.max(20, budget - spent));
      if (alternative) {
        selected.push(alternative);
        spent += alternative.cost ?? 0;
        usedSlots += weaponSlotCost(alternative);
      }
    }
  }
  entry.weaponIds = selected.map((weapon) => weapon.id);
  return spent;
}

function freeBattleOrdinaryOptionScore(option, entry) {
  const ms = lookup().ms[entry.msId];
  const weapons = [...(ms.fixedWeaponIds ?? []), ...(entry.weaponIds ?? [])].map((id) => lookup().weapons[id]).filter(Boolean);
  const role = freeBattleMobileSuitRole(ms);
  let score = recommendedOptionScore(option);
  if (option.effectType === "ammo" && weapons.some((weapon) => weapon.kind === "ammo")) score += 35;
  if (option.effectType === "energy" && weapons.some((weapon) => (weapon.consume ?? 0) > 0)) score += 35;
  if (option.effectType.startsWith("defense-") && role === "frontline") score += 28;
  if (option.effectType === "range" && role === "support") score += 32;
  if (option.effectType === "mobility" && role !== "support") score += 22;
  return Math.max(1, score);
}

function freeBattleEquipOrdinaryOption(formation, faction, map, budget) {
  if (budget <= 0 || Math.random() >= FREE_BATTLE_ORDINARY_OPTION_RATE) return 0;
  const pairs = formation.flatMap((entry) => {
    const ms = lookup().ms[entry.msId];
    const slots = Math.max(0, Number(ms.optionSlots ?? 1) || 0);
    if ((entry.optionIds ?? []).length >= slots) return [];
    return (state.data.options ?? []).flatMap((option) => {
      if (!FREE_BATTLE_ORDINARY_OPTION_TYPES.has(option.effectType)) return [];
      if (optionProvidesAirDeployment(option) || (option.cost ?? 0) <= 0 || (option.cost ?? 0) > budget) return [];
      if (!optionEquippableByMs(option, ms, map, faction)) return [];
      return [{ entry, option, score: freeBattleOrdinaryOptionScore(option, entry) }];
    });
  });
  if (pairs.length === 0) return 0;
  const picked = weightedRandomChoice(pairs, (pair) => pair.score / Math.max(20, pair.option.cost ?? 0));
  picked.entry.optionIds.push(picked.option.id);
  return picked.option.cost ?? 0;
}

function generateFreeBattleEnemySample(faction, map, targetCost, generationContext = null) {
  const usedKeys = new Set();
  const context = generationContext ?? {
    deployableShips: state.data.battleships.filter((ship) => ship.faction === faction && battleshipCanDeployOnMap(ship, map)),
    msCandidates: freeBattleMobileSuitCandidates(faction, map)
  };
  const ship = freeBattleRandomBattleship(faction, map, targetCost, context.deployableShips);
  const msCandidates = context.msCandidates;
  if (!ship || msCandidates.length === 0) return null;
  const cheapestMsCost = Math.min(...msCandidates.map((candidate) => candidate.baseCost));
  const maximumUnits = clamp(Number(map.deployment?.enemy?.units?.length) || 4, 1, 6);
  const crewReserve = Math.min(145, Math.max(25, targetCost * 0.085));
  const capacityBudget = Math.max(cheapestMsCost, targetCost - (ship.cost ?? 0) - crewReserve);
  const baseUnitCount = clamp(Math.round(capacityBudget / 295), 1, maximumUnits);
  const unitVariance = Math.random() < 0.28 ? (Math.random() < 0.5 ? -1 : 1) : 0;
  const desiredUnits = clamp(baseUnitCount + unitVariance, 1, maximumUnits);
  const equipmentReserve = Math.min(targetCost * 0.13, desiredUnits * 38);
  const formation = [];
  const selectedCounts = {};
  const roleCounts = {};
  let spent = ship.cost ?? 0;

  for (let index = 0; index < desiredUnits; index += 1) {
    const unitsLeft = desiredUnits - index;
    const remainingForUnits = Math.max(cheapestMsCost, targetCost - spent - crewReserve - equipmentReserve);
    const share = remainingForUnits / unitsLeft;
    const maximumForMs = Math.max(cheapestMsCost, remainingForUnits - cheapestMsCost * (unitsLeft - 1));
    const picked = freeBattleRandomMobileSuit(msCandidates, share * 0.66, maximumForMs, selectedCounts, roleCounts);
    if (!picked) break;
    const entry = {
      msId: picked.ms.id,
      characterIds: [],
      weaponIds: [],
      optionIds: [...picked.requiredOptionIds]
    };
    formation.push(entry);
    selectedCounts[picked.ms.id] = (selectedCounts[picked.ms.id] ?? 0) + 1;
    roleCounts[picked.role] = (roleCounts[picked.role] ?? 0) + 1;
    spent += picked.baseCost;

    if (mobileSuitCanHavePilot(picked.ms)) {
      const remainingMinimumMs = cheapestMsCost * (unitsLeft - 1);
      const pilotBudget = Math.max(0, Math.min(share * 0.38, targetCost - spent - crewReserve - equipmentReserve - remainingMinimumMs));
      const pilot = freeBattleRandomCharacter(faction, usedKeys, "pilot", pilotBudget, Math.max(25, share * 0.28), picked.ms);
      if (pilot) {
        entry.characterIds = [pilot.id];
        spent += pilot.cost ?? 0;
      }
    }
  }
  if (formation.length === 0) return null;

  const bridge = freeBattleRandomBridge(faction, usedKeys, targetCost, Math.max(0, targetCost - spent));
  spent += crewCost([bridge.captainId, bridge.firstOfficerId]);
  let weaponBudget = Math.min(Math.max(0, targetCost - spent), targetCost * 0.13);
  formation.forEach((entry, index) => {
    const entriesLeft = formation.length - index;
    const share = weaponBudget / Math.max(1, entriesLeft);
    const used = freeBattleEquipWeapons(entry, share * 1.35);
    weaponBudget = Math.max(0, weaponBudget - used);
    spent += used;
  });
  const ordinaryOptionBudget = Math.min(Math.max(0, targetCost - spent), targetCost * 0.05);
  spent += freeBattleEquipOrdinaryOption(formation, faction, map, ordinaryOptionBudget);

  return {
    faction,
    targetCost,
    battleshipId: ship.id,
    bridge,
    formation
  };
}

function freeBattleEnemySampleScore(enemy, targetCost) {
  const cost = freeBattleEnemyCost(enemy);
  const ratio = cost / Math.max(1, targetCost);
  let score = Math.abs(ratio - 0.92) * 45;
  if (ratio < 0.76) score += (0.76 - ratio) * 1500;
  if (ratio > 1.06) score += (ratio - 1.06) * 2200;
  const entries = enemy.formation ?? [];
  const totalSlots = entries.reduce((sum, entry) => sum + weaponSlotCount(lookup().ms[entry.msId]), 0);
  const usedSlots = entries.reduce((sum, entry) => sum + selectedWeaponSlotCost(entry.weaponIds), 0);
  const slotFill = usedSlots / Math.max(1, totalSlots);
  if (slotFill > 0.82) score += (slotFill - 0.82) * 140;
  const ordinaryOptions = entries.flatMap((entry) => entry.optionIds)
    .filter((id) => !optionProvidesAirDeployment(lookup().options[id]));
  if (ordinaryOptions.length > 1) score += (ordinaryOptions.length - 1) * 200;
  const attackless = entries.filter((entry) => {
    const ms = lookup().ms[entry.msId];
    return [...(ms.fixedWeaponIds ?? []), ...(entry.weaponIds ?? [])]
      .every((id) => (lookup().weapons[id]?.power ?? 0) <= 0);
  }).length;
  score += attackless * 400;
  return score + Math.random() * 12;
}

function generateFreeBattleEnemy(faction, map, targetCost) {
  let best = null;
  let bestScore = Infinity;
  const generationContext = {
    deployableShips: state.data.battleships.filter((ship) => ship.faction === faction && battleshipCanDeployOnMap(ship, map)),
    msCandidates: freeBattleMobileSuitCandidates(faction, map)
  };
  for (let index = 0; index < FREE_BATTLE_GENERATION_ATTEMPTS; index += 1) {
    const sample = generateFreeBattleEnemySample(faction, map, targetCost, generationContext);
    if (!sample) continue;
    const score = freeBattleEnemySampleScore(sample, targetCost);
    if (score < bestScore) {
      best = sample;
      bestScore = score;
    }
  }
  if (!best) return null;
  best.actualCost = freeBattleEnemyCost(best);
  return best;
}

function prepareFreeBattleEnemy() {
  const map = selectedMap();
  const faction = otherFaction(state.faction);
  const targetCost = Math.max(100, currentCost());
  state.freeBattleEnemy = generateFreeBattleEnemy(faction, map, targetCost) ?? {
    faction,
    targetCost,
    actualCost: 0,
    battleshipId: "",
    bridge: {},
    formation: []
  };
  return state.freeBattleEnemy;
}

function enemyFormationForStage(mapId, faction) {
  const entries = stageConfig(mapId).enemyFormations?.[faction] ?? [];
  return entries.map((entry) => ({
    msId: entry.msId,
    characterIds: [...(entry.characterIds ?? [])],
    weaponIds: [...(entry.weaponIds ?? [])],
    optionIds: [...(entry.optionIds ?? [])],
    armorOverride: entry.armorOverride,
    aiInactiveUntilTurn: entry.aiInactiveUntilTurn,
    factionOverride: entry.factionOverride,
    examAlwaysActive: entry.examAlwaysActive === true,
    disableCoreSystem: entry.disableCoreSystem === true
  }));
}

function enemyBattleshipForStage(mapId) {
  const battleshipId = stageConfig(mapId).enemyBattleshipId;
  return battleshipId ? lookup().battleships[battleshipId] ?? null : null;
}

function enemyTotalCostForStage(mapId = state.selectedMapId) {
  const faction = stageEnemyFaction(mapId);
  const enemyEntries = enemyFormationForStage(mapId, faction);
  const enemyShip = enemyBattleshipForStage(mapId);
  const enemyBridge = enemyShip ? enemyBridgeForStage(mapId, faction) : {};
  const escortShipCost = stageEnemyEscortBattleshipIds(mapId)
    .reduce((sum, id) => sum + (lookup().battleships[id]?.cost ?? 0), 0);
  const reinforcementConfig = stageConfig(mapId).enemyReinforcements;
  const reinforcementEntries = Array.isArray(reinforcementConfig?.entries) ? reinforcementConfig.entries : [];
  const reinforcementCount = Math.max(0, Math.floor(Number(reinforcementConfig?.countPerTurn ?? reinforcementConfig?.count) || reinforcementEntries.length));
  const reinforcementStart = Math.max(1, Math.floor(Number(reinforcementConfig?.startTurn) || 2));
  const reinforcementEnd = Number.isFinite(Number(reinforcementConfig?.endTurn))
    ? Math.max(reinforcementStart, Math.floor(Number(reinforcementConfig.endTurn)))
    : reinforcementStart;
  const reinforcementTurns = reinforcementConfig ? reinforcementEnd - reinforcementStart + 1 : 0;
  const reinforcementMsCostPerTurn = Array.from({ length: reinforcementCount }, (_, index) =>
    reinforcementEntries.length > 0 ? formationEntryCost(reinforcementEntries[index % reinforcementEntries.length]) : 0
  ).reduce((sum, cost) => sum + cost, 0);
  const reinforcementShipCostPerTurn = (Array.isArray(reinforcementConfig?.battleships) ? reinforcementConfig.battleships : [])
    .reduce((sum, entry) => sum
      + (lookup().battleships[entry.battleshipId]?.cost ?? 0)
      + crewCost(entry.characterIds ?? []), 0);
  return (enemyShip?.cost ?? 0)
    + escortShipCost
    + crewCost([enemyBridge.captainId, enemyBridge.firstOfficerId])
    + enemyEntries.reduce((sum, entry) => sum + formationEntryCost(entry), 0)
    + reinforcementTurns * (reinforcementMsCostPerTurn + reinforcementShipCostPerTurn);
}

function stageCostCap(mapId = state.selectedMapId) {
  const stage = stageConfig(mapId);
  if (Number.isFinite(stage.costCap)) return stage.costCap;
  const enemyCost = enemyTotalCostForStage(mapId);
  if (enemyCost <= 0) return state.data.costCap ?? 1200;
  const margin = Math.max(COST_CAP_MIN_MARGIN, Math.ceil(enemyCost * COST_CAP_MARGIN_RATE));
  const noEnemyBattleshipBonus = stage.enemyBattleshipId === null ? NO_ENEMY_BATTLESHIP_COST_BONUS : 0;
  return Math.ceil((enemyCost + margin + noEnemyBattleshipBonus) / 10) * 10;
}

function stagePlayable(map) {
  return playableFactionsOnMap(map).length > 0;
}

function renderTitle() {
  state.screen = "title";
  phaseLabel.textContent = "タイトル";
  setupScreen.className = "screen title-layout";
  setupScreen.innerHTML = `
    <section class="title-panel home-command-panel">
      <div>
        <p class="eyebrow">司令メニュー</p>
        <h2>次の戦場を選ぶ</h2>
        <p>手持ちカードで部隊を編成し、ステージを攻略して戦力を広げます。</p>
      </div>
      <div class="title-actions">
        <button class="primary-button" data-action="stage-select">ステージ選択</button>
        <button class="primary-button" data-action="free-battle-select">フリー対戦</button>
        <button data-action="card-list">カード一覧</button>
        <button data-action="choice-card" ${choiceTicketCount() > 0 && choiceCandidateEntries().length > 0 ? "" : "disabled"}>カード引換</button>
      </div>
    </section>
    <section class="panel stack campaign-progress-panel">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">プレイ状況</p>
          <h2>現在の進行</h2>
        </div>
      </div>
      ${campaignSummaryStats()}
      <details class="save-management">
        <summary>セーブデータの管理</summary>
        <p class="small">進行、所持カード、編成記録を初期状態へ戻します。</p>
        <button class="danger-outline-button" data-action="reset-save">進行を初期化</button>
      </details>
    </section>
  `;
  setupScreen.classList.remove("hidden");
  battleScreen.classList.add("hidden");
}

function campaignSummaryStats() {
  const currentCap = stageCostCap(state.selectedMapId);
  const stageCount = campaignStageEntries().length || state.data.maps.length;
  return statItems([
    ["クリア", `${state.collection.clearedStages.length} / ${stageCount}`],
    ["機体", `${ownedUniqueCount("mobileSuits")}種 / ${ownedTotalCount("mobileSuits")}枚`],
    ["戦艦", `${state.collection.battleships.length} / ${state.data.battleships.filter((ship) => ship.selectable !== false).length}`],
    ["武器", `${ownedUniqueCount("weapons")}種 / ${ownedTotalCount("weapons")}枚`],
    ["OP", `${ownedUniqueCount("options")}種 / ${ownedTotalCount("options")}枚`],
    ["キャラ", `${state.collection.characters.length} / ${state.data.characters.filter((character) => character.selectable !== false).length}`],
    ["引換券", `${choiceTicketCount()}枚`],
    ["現在コスト枠", currentCap]
  ]);
}

function campaignStageEntries() {
  const maps = lookup().maps;
  return (Array.isArray(state.data.campaign?.stages) ? state.data.campaign.stages : [])
    .map((stage, index) => ({ stage, map: maps[stage.mapId], index }))
    .filter((entry) => entry.map);
}

function stageSeriesLabel(series) {
  return state.data.campaign?.stageSeries?.[series]?.label
    ?? state.data.campaign?.stageSeries?.other?.label
    ?? "その他";
}

function stageSeriesSortValue(series) {
  return Number(state.data.campaign?.stageSeries?.[series]?.order ?? 80);
}

function stageSeriesIds() {
  return Array.from(new Set(campaignStageEntries().map((entry) => entry.stage.series ?? "other")))
    .sort((a, b) => stageSeriesSortValue(a) - stageSeriesSortValue(b) || stageSeriesLabel(a).localeCompare(stageSeriesLabel(b), "ja"));
}

function stageFolderEntries() {
  const entries = campaignStageEntries();
  const folders = stageSeriesIds().map((series) => ({
    id: series,
    label: stageSeriesLabel(series),
    entries: entries.filter((entry) => (entry.stage.series ?? "other") === series)
  }));
  return [
    {
      id: "all",
      label: "すべて",
      entries
    },
    ...folders
  ];
}

function stageFolderStats(entries) {
  const cleared = entries.filter((entry) => stageCleared(entry.map.id)).length;
  const playable = entries.filter((entry) => stagePlayable(entry.map)).length;
  return {
    total: entries.length,
    cleared,
    playable
  };
}

function stageEntrySearchText(entry) {
  const { stage, map } = entry;
  const enemyFaction = stageEnemyFaction(map.id);
  return normalizeSearchText([
    map.id,
    map.name,
    mapTypeName(map.type),
    stageSeriesLabel(stage.series),
    factionName(enemyFaction),
    stage.summary,
    ...(Array.isArray(stage.tags) ? stage.tags : [])
  ].filter(Boolean).join(" "));
}

function stageSortValue(entry, sort) {
  const { stage, map, index } = entry;
  if (sort === "costAsc" || sort === "costDesc") return stageCostCap(map.id);
  return Number(stage.order) || index + 1;
}

function filteredStageEntries() {
  const filter = state.stageFilter;
  const query = normalizeSearchText(filter.query).trim();
  return campaignStageEntries()
    .filter((entry) => {
      const { stage, map } = entry;
      if (filter.series !== "all" && (stage.series ?? "other") !== filter.series) return false;
      if (filter.status === "cleared" && !stageCleared(map.id)) return false;
      if (filter.status === "uncleared" && stageCleared(map.id)) return false;
      if (filter.status === "playable" && !stagePlayable(map)) return false;
      if (filter.terrain !== "all" && map.type !== filter.terrain) return false;
      if (filter.enemyFaction !== "all" && stageEnemyFaction(map.id) !== filter.enemyFaction) return false;
      if (query && !stageEntrySearchText(entry).includes(query)) return false;
      return true;
    })
    .sort((a, b) => {
      const sort = filter.sort;
      if (sort === "name") return a.map.name.localeCompare(b.map.name, "ja");
      const aValue = stageSortValue(a, sort);
      const bValue = stageSortValue(b, sort);
      const desc = sort.endsWith("Desc");
      if (aValue === bValue) return a.map.name.localeCompare(b.map.name, "ja");
      return desc ? bValue - aValue : aValue - bValue;
    });
}

function nextUnclearedStageEntry(entries = campaignStageEntries()) {
  return [...entries]
    .sort((a, b) => stageSortValue(a, "story") - stageSortValue(b, "story"))
    .find((entry) => !stageCleared(entry.map.id) && stagePlayable(entry.map));
}

function freeBattleMapEntries() {
  const stageEntries = new Map(campaignStageEntries().map((entry) => [entry.map.id, entry]));
  return state.data.maps.map((map, index) => {
    const stageEntry = stageEntries.get(map.id);
    return {
      map,
      stage: stageEntry?.stage ?? null,
      index: stageEntry?.index ?? index
    };
  });
}

function freeBattleMapUnlocked(map) {
  return Boolean(map?.id) && stageCleared(map.id);
}

function freeBattleMapAvailable(map) {
  return freeBattleMapUnlocked(map) && stagePlayable(map);
}

function freeBattleMapStatus(map) {
  if (!freeBattleMapUnlocked(map)) return { label: "未解放", className: "" };
  if (!stagePlayable(map)) return { label: "出撃不可", className: "" };
  return { label: "対戦可", className: "ready" };
}

function freeBattleMapSearchText(entry) {
  const { map, stage } = entry;
  return normalizeSearchText([
    map.id,
    map.name,
    mapTypeName(map.type),
    stageSeriesLabel(stage?.series),
    stage?.summary,
    ...(Array.isArray(stage?.tags) ? stage.tags : []),
    `${map.width}x${map.height}`
  ].filter(Boolean).join(" "));
}

function freeBattleSortValue(entry, sort) {
  const { stage, map, index } = entry;
  if (sort === "sizeAsc" || sort === "sizeDesc") return Number(map.width) * Number(map.height);
  return Number(stage?.order) || index + 1;
}

function filteredFreeBattleMapEntries() {
  const filter = state.freeBattleFilter;
  const query = normalizeSearchText(filter.query).trim();
  return freeBattleMapEntries()
    .filter((entry) => {
      const { stage, map } = entry;
      if (filter.series !== "all" && (stage?.series ?? "other") !== filter.series) return false;
      if (filter.terrain !== "all" && map.type !== filter.terrain) return false;
      if (filter.playable === "unlocked" && !freeBattleMapUnlocked(map)) return false;
      if (filter.playable === "locked" && freeBattleMapUnlocked(map)) return false;
      if (query && !freeBattleMapSearchText(entry).includes(query)) return false;
      return true;
    })
    .sort((a, b) => {
      const sort = filter.sort;
      if (sort === "name") return a.map.name.localeCompare(b.map.name, "ja");
      const aValue = freeBattleSortValue(a, sort);
      const bValue = freeBattleSortValue(b, sort);
      const desc = sort.endsWith("Desc");
      if (aValue === bValue) return a.map.name.localeCompare(b.map.name, "ja");
      return desc ? bValue - aValue : aValue - bValue;
    });
}

function renderFreeBattleControls(entries) {
  const filter = state.freeBattleFilter;
  const allEntries = freeBattleMapEntries();
  const seriesIds = Array.from(new Set(allEntries.map((entry) => entry.stage?.series ?? "other")))
    .sort((a, b) => stageSeriesSortValue(a) - stageSeriesSortValue(b) || stageSeriesLabel(a).localeCompare(stageSeriesLabel(b), "ja"));
  const terrainIds = Array.from(new Set(allEntries.map((entry) => entry.map.type)));
  return `
    <div class="filter-bar stage-filter-bar">
      <label>検索<input class="free-battle-control" data-filter-key="query" type="search" value="${escapeAttr(filter.query)}" placeholder="マップ名・タグ・地形" /></label>
      <label>分類<select class="free-battle-control" data-filter-key="series">
        ${filterOption("all", "すべて", filter.series)}
        ${seriesIds.map((id) => filterOption(id, stageSeriesLabel(id), filter.series)).join("")}
      </select></label>
      <label>地形<select class="free-battle-control" data-filter-key="terrain">
        ${filterOption("all", "すべて", filter.terrain)}
        ${terrainIds.map((id) => filterOption(id, mapTypeName(id), filter.terrain)).join("")}
      </select></label>
      <label>解放状況<select class="free-battle-control" data-filter-key="playable">
        ${[
          ["all", "すべて"],
          ["unlocked", "解放済のみ"],
          ["locked", "未解放のみ"]
        ].map(([value, label]) => filterOption(value, label, filter.playable)).join("")}
      </select></label>
      <label>並び替え<select class="free-battle-control" data-filter-key="sort">
        ${[
          ["story", "物語順"],
          ["sizeAsc", "狭い順"],
          ["sizeDesc", "広い順"],
          ["name", "名前"]
        ].map(([value, label]) => filterOption(value, label, filter.sort)).join("")}
      </select></label>
      <button data-action="reset-free-battle-filter">リセット</button>
    </div>
    <p class="small">表示 ${entries.length} / ${allEntries.length}（解放済 ${allEntries.filter((entry) => freeBattleMapUnlocked(entry.map)).length}）。検索はマップ名、分類、地形、タグ、説明文に対応しています。</p>
  `;
}

function renderStageControls(entries) {
  const filter = state.stageFilter;
  const seriesIds = stageSeriesIds();
  const terrainIds = Array.from(new Set(campaignStageEntries().map((entry) => entry.map.type)));
  const enemyFactionIds = Array.from(new Set(campaignStageEntries().map((entry) => stageEnemyFaction(entry.map.id))));
  return `
    <div class="filter-bar stage-filter-bar">
      <label>検索<input class="stage-control" data-filter-key="query" type="search" value="${escapeAttr(filter.query)}" placeholder="ステージ名・タグ・敵勢力" /></label>
      <label>タイトル<select class="stage-control" data-filter-key="series">
        ${filterOption("all", "すべて", filter.series)}
        ${seriesIds.map((id) => filterOption(id, stageSeriesLabel(id), filter.series)).join("")}
      </select></label>
      <label>状態<select class="stage-control" data-filter-key="status">
        ${[
          ["all", "すべて"],
          ["uncleared", "未クリア"],
          ["cleared", "クリア済"],
          ["playable", "出撃可"]
        ].map(([value, label]) => filterOption(value, label, filter.status)).join("")}
      </select></label>
      <label>地形<select class="stage-control" data-filter-key="terrain">
        ${filterOption("all", "すべて", filter.terrain)}
        ${terrainIds.map((id) => filterOption(id, mapTypeName(id), filter.terrain)).join("")}
      </select></label>
      <label>敵勢力<select class="stage-control" data-filter-key="enemyFaction">
        ${filterOption("all", "すべて", filter.enemyFaction)}
        ${enemyFactionIds.map((id) => filterOption(id, factionName(id), filter.enemyFaction)).join("")}
      </select></label>
      <label>並び替え<select class="stage-control" data-filter-key="sort">
        ${[
          ["story", "物語順"],
          ["costAsc", "コスト低い順"],
          ["costDesc", "コスト高い順"],
          ["name", "名前"]
        ].map(([value, label]) => filterOption(value, label, filter.sort)).join("")}
      </select></label>
      <button data-action="reset-stage-filter">リセット</button>
    </div>
    <p class="small">表示 ${entries.length} / ${campaignStageEntries().length}。検索はステージ名、分類、タグ、説明文に対応しています。</p>
  `;
}

function renderStageFolderPicker() {
  const folders = stageFolderEntries();
  return `
    <section class="stage-folder-panel">
      <div class="panel-heading">
        <h3>タイトル別</h3>
        <span class="small">横にスクロールできます</span>
      </div>
      <div class="stage-folder-grid">
        ${folders.map((folder) => stageFolderCard(folder)).join("")}
      </div>
    </section>
  `;
}

function stageFolderCard(folder) {
  const stats = stageFolderStats(folder.entries);
  const selected = state.stageFilter.series === folder.id;
  return `
    <button type="button" class="stage-folder-card ${selected ? "selected" : ""}" data-action="select-stage-folder" data-series="${folder.id}">
      <span class="stage-folder-head">
        <span>
          <strong>${folder.label}</strong>
        </span>
        <span class="status-pill ${stats.playable > 0 ? "ready" : ""}">${stats.cleared} / ${stats.total} CLEAR</span>
      </span>
      <span class="stage-folder-meta">
        <span>全${stats.total}件・出撃可${stats.playable}件</span>
      </span>
    </button>
  `;
}

function renderStageSelect() {
  state.battleMode = "campaign";
  state.screen = "stage";
  phaseLabel.textContent = "ステージ選択";
  const entries = filteredStageEntries();
  const selectedEntry = entries.find((entry) => entry.map.id === state.selectedMapId) ?? entries[0] ?? null;
  const nextEntry = nextUnclearedStageEntry(entries) ?? nextUnclearedStageEntry();
  setupScreen.className = "screen stage-layout";
  setupScreen.innerHTML = `
    <section class="panel stack">
      <div class="panel-heading">
        <h2>ステージ選択</h2>
        <button data-action="title">タイトルへ</button>
      </div>
      <div class="stage-quick-actions">
        <button class="primary-button" data-action="select-next-uncleared-stage" data-map-id="${nextEntry?.map.id ?? ""}" ${nextEntry ? "" : "disabled"}>次の未クリアを選択</button>
      </div>
      ${renderStageFolderPicker()}
      ${renderStageControls(entries)}
      <div class="stage-list">
        ${entries.length === 0 ? `<p class="support-hint">条件に合うステージがありません。検索やフィルタをリセットしてください。</p>` : entries.map((entry) => stageCard(entry, selectedEntry?.map.id === entry.map.id)).join("")}
      </div>
    </section>
    <aside class="panel stack stage-detail-panel">
      ${renderStageDetail(selectedEntry)}
      <details class="stage-progress-details">
        <summary>進行状況とカード管理</summary>
        ${campaignSummaryStats()}
        <div class="toolbar-actions">
          <button data-action="card-list">カード一覧</button>
          <button data-action="choice-card" ${choiceTicketCount() > 0 && choiceCandidateEntries().length > 0 ? "" : "disabled"}>カード引換</button>
        </div>
      </details>
    </aside>
  `;
  setupScreen.classList.remove("hidden");
  battleScreen.classList.add("hidden");
}

function stageCard(entry, selected = false) {
  const { map } = entry;
  const stage = stageConfig(map.id);
  const playable = stagePlayable(map);
  const cleared = stageCleared(map.id);
  const enemyFaction = stageEnemyFaction(map.id);
  const enemyCost = enemyTotalCostForStage(map.id);
  const cap = stageCostCap(map.id);
  return `
    <article class="stage-card stage-list-card ${cleared ? "cleared" : ""} ${selected ? "selected" : ""}">
      <div class="stage-card-head">
        <div>
          <p class="eyebrow">${stageSeriesLabel(stage.series)} / ${mapTypeName(map.type)}</p>
          <h3>${map.name}</h3>
        </div>
        <span class="status-pill ${playable ? "ready" : ""}">${cleared ? "CLEAR" : playable ? "出撃可" : "未解禁"}</span>
      </div>
      <div class="stage-meta-line">
        <span class="reward-chip">${factionName(enemyFaction)}戦</span>
        <span class="reward-chip">敵${enemyCost}</span>
        <span class="reward-chip">上限${cap}</span>
      </div>
      ${renderStageRuleChips(stage)}
      <div class="stage-card-actions">
        <button data-action="select-stage-detail" data-map-id="${map.id}">内容を見る</button>
        <button class="primary-button" data-action="select-stage" data-map-id="${map.id}" ${playable ? "" : "disabled"}>編成へ</button>
      </div>
    </article>
  `;
}

function renderStageDetail(entry) {
  if (!entry) {
    return `
      <h2>ステージ詳細</h2>
      <p class="support-hint">表示できるステージがありません。</p>
    `;
  }
  const { stage, map } = entry;
  const playable = stagePlayable(map);
  const cleared = stageCleared(map.id);
  const enemyFaction = stageEnemyFaction(map.id);
  const enemyCost = enemyTotalCostForStage(map.id);
  const cap = stageCostCap(map.id);
  const tags = Array.isArray(stage.tags) ? stage.tags : [];
  const rollText = commonDropRolls() > 0 ? `${commonDropRolls()}回抽選` : "抽選なし";
  return `
    <div class="stage-detail-head">
      <p class="eyebrow">${stageSeriesLabel(stage.series)} / ${mapTypeName(map.type)}</p>
      <h2>${map.name}</h2>
      <span class="status-pill ${playable ? "ready" : ""}">${cleared ? "CLEAR" : playable ? "出撃可" : "未解禁"}</span>
    </div>
    <button class="primary-button stage-detail-launch" data-action="select-stage" data-map-id="${map.id}" ${playable ? "" : "disabled"}>このステージの編成へ</button>
    <p class="small">${stage.summary ?? "ステージ説明は未設定です。"}</p>
    <div class="reward-list">
      <span class="reward-chip">敵勢力: ${factionName(enemyFaction)}</span>
      <span class="reward-chip">敵総コスト: ${enemyCost}</span>
      <span class="reward-chip">出撃上限: ${cap}</span>
      <span class="reward-chip">報酬: 全体ランダム ${rollText}</span>
    </div>
    ${tags.length > 0 ? `<div class="reward-list">${tags.map((tag) => `<span class="reward-chip owned">${tag}</span>`).join("")}</div>` : ""}
    ${renderStageRuleChips(stage)}
    ${renderMapDetails(map)}
  `;
}

function renderStageRuleChips(stage) {
  const chips = [];
  const turnLimit = Number(stage.turnLimit);
  if (Number.isFinite(turnLimit) && turnLimit > 0) chips.push(`敗北条件: ${Math.floor(turnLimit)}ターン経過`);
  const surviveTurns = Number(stage.surviveTurns);
  if (Number.isFinite(surviveTurns) && surviveTurns > 0) chips.push(`勝利条件: ${Math.floor(surviveTurns)}ターン生存`);
  if (stage.enemyReinforcements?.trigger === "enemyWipedOut") chips.push("敵増援: 初期敵全滅で出現");
  else if (stage.enemyReinforcements) chips.push("敵増援: 毎ターン出現");
  const defenseTargets = Array.isArray(stage.defenseTargets) ? stage.defenseTargets : [];
  if (defenseTargets.length > 0) chips.push(stage.defenseTargetsMustAllSurvive === true
    ? `防衛対象: ${defenseTargets.length}個 / 1個破壊で敗北`
    : `防衛対象: ${defenseTargets.length}個 / 全破壊で敗北`);
  const destructionTargets = Array.isArray(stage.destructionTargets) ? stage.destructionTargets : [];
  const randomDestructionTargetGoal = Number(stage.randomDestructionTargetGoal);
  if (destructionTargets.length > 0) chips.push(Number.isInteger(randomDestructionTargetGoal) && randomDestructionTargetGoal > 0
    ? `破壊目標: 実目標${randomDestructionTargetGoal}個 / ダミー混在`
    : `破壊目標: ${destructionTargets.length}個 / 全破壊で勝利`);
  const infiltrationTargets = Array.isArray(stage.infiltrationTargets) ? stage.infiltrationTargets : [];
  if (infiltrationTargets.length > 0) chips.push(`進入阻止: 指定${infiltrationTargets.length}マス到達で敗北`);
  const playerReachTargets = Array.isArray(stage.playerReachTargets) ? stage.playerReachTargets : [];
  if (playerReachTargets.length > 0) chips.push(`到達目標: 指定${playerReachTargets.length}マスのいずれかへ到達で勝利`);
  const initialMines = Array.isArray(stage.initialMines) ? stage.initialMines : [];
  if (initialMines.length > 0) chips.push(`事前配置機雷: ${initialMines.length}個`);
  const delayedEnemy = Object.values(stage.enemyFormations ?? {}).flat().find((entry) => Number.isFinite(Number(entry.aiInactiveUntilTurn)));
  if (delayedEnemy) chips.push(`敵起動待機: 第${Math.floor(Number(delayedEnemy.aiInactiveUntilTurn))}ターンから行動`);
  const escortShips = Array.isArray(stage.enemyEscortBattleshipIds) ? stage.enemyEscortBattleshipIds : [];
  if (escortShips.length > 0) chips.push(`敵随伴艦: ${escortShips.length}隻`);
  if (Number(stage.enemyBattleshipMobilityOverride) === 0) chips.push("敵旗艦: 移動不能");
  return chips.length > 0 ? `<div class="reward-list">${chips.map((text) => `<span class="reward-chip">${text}</span>`).join("")}</div>` : "";
}

function commonDropCounts() {
  const entries = commonDropEntries();
  const { categoryWeights } = commonDropConfig();
  return ["mobileSuits", "battleships", "weapons", "options", "characters"].map((type) => ({
    type,
    count: entries.filter((entry) => entry.type === type).length,
    weight: categoryWeights[type] ?? 0
  }));
}

function renderFreeBattleSelect() {
  state.battleMode = "free";
  state.screen = "freeBattleSelect";
  phaseLabel.textContent = "フリー対戦";
  const entries = filteredFreeBattleMapEntries();
  const selectedEntry = entries.find((entry) => entry.map.id === state.selectedMapId) ?? entries[0] ?? null;
  setupScreen.className = "screen stage-layout";
  setupScreen.innerHTML = `
    <section class="panel stack">
      <div class="panel-heading">
        <h2>フリー対戦</h2>
        <button data-action="title">タイトルへ</button>
      </div>
      <p class="small">初回クリア済みのステージで、所持カード内からコスト上限なしに編成できます。敵は反対勢力の全カードから近いコスト帯でランダム編成され、勝利報酬は全体ランダムドロップ1枚です。</p>
      ${renderFreeBattleControls(entries)}
      <div class="stage-list">
        ${entries.length === 0 ? `<p class="support-hint">条件に合うマップがありません。検索やフィルタをリセットしてください。</p>` : entries.map((entry) => freeBattleMapCard(entry, selectedEntry?.map.id === entry.map.id)).join("")}
      </div>
    </section>
    <aside class="panel stack stage-detail-panel">
      ${renderFreeBattleMapDetail(selectedEntry)}
      <h2>カード状況</h2>
      ${campaignSummaryStats()}
      <button data-action="card-list">カード一覧を見る</button>
      <button class="primary-button" data-action="choice-card" ${choiceTicketCount() > 0 && choiceCandidateEntries().length > 0 ? "" : "disabled"}>カード引換券を使う</button>
    </aside>
  `;
  setupScreen.classList.remove("hidden");
  battleScreen.classList.add("hidden");
}

function freeBattleMapCard(entry, selected = false) {
  const { map, stage } = entry;
  const available = freeBattleMapAvailable(map);
  const status = freeBattleMapStatus(map);
  const tags = Array.isArray(stage?.tags) ? stage.tags : [];
  return `
    <article class="stage-card stage-list-card ${selected ? "selected" : ""}">
      <div class="stage-card-head">
        <div>
          <p class="eyebrow">${stageSeriesLabel(stage?.series)} / ${mapTypeName(map.type)}</p>
          <h3>${map.name}</h3>
        </div>
        <span class="status-pill ${status.className}">${status.label}</span>
      </div>
      <p class="small">敵は出撃時の自軍総コストを基準に、反対勢力の全カードからランダム編成されます。</p>
      <div class="stage-meta-line">
        <span class="reward-chip">勝利: 全体ランダム1枚</span>
        <span class="reward-chip">コスト上限なし</span>
        <span class="reward-chip">${map.width} x ${map.height}</span>
        ${tags.slice(0, 3).map((tag) => `<span class="reward-chip owned">${tag}</span>`).join("")}
      </div>
      <div class="stage-card-actions">
        <button data-action="select-free-battle-detail" data-map-id="${map.id}">詳細</button>
        <button class="primary-button" data-action="select-free-battle-map" data-map-id="${map.id}" ${available ? "" : "disabled"}>このマップでフリー対戦</button>
      </div>
    </article>
  `;
}

function renderFreeBattleMapDetail(entry) {
  if (!entry) {
    return `
      <h2>マップ詳細</h2>
      <p class="support-hint">表示できるマップがありません。</p>
    `;
  }
  const { map, stage } = entry;
  const available = freeBattleMapAvailable(map);
  const status = freeBattleMapStatus(map);
  const tags = Array.isArray(stage?.tags) ? stage.tags : [];
  return `
    <div class="stage-detail-head">
      <p class="eyebrow">${stageSeriesLabel(stage?.series)} / ${mapTypeName(map.type)}</p>
      <h2>${map.name}</h2>
      <span class="status-pill ${status.className}">${status.label}</span>
    </div>
    <p class="small">${stage?.summary ?? "フリー対戦用マップです。敵は自軍総コストに近いランダム編成で出撃します。"}</p>
    <div class="reward-list">
      <span class="reward-chip">勝利: 全体ランダム1枚</span>
      <span class="reward-chip">コスト上限なし</span>
      <span class="reward-chip owned">フリー対戦の勝敗はクリア状況・引換券に影響なし</span>
      <span class="reward-chip owned">ステージ特殊ルールなし</span>
    </div>
    ${tags.length > 0 ? `<div class="reward-list">${tags.map((tag) => `<span class="reward-chip owned">${tag}</span>`).join("")}</div>` : ""}
    ${renderMapDetails(map, { open: true })}
      <button class="primary-button" data-action="select-free-battle-map" data-map-id="${map.id}" ${available ? "" : "disabled"}>このマップでフリー対戦</button>
  `;
}

function renderCommonDropSummary() {
  const limit = commonDropConfig().copyLimit;
  const choice = choiceRewardConfig();
  const chips = commonDropCounts()
    .filter((item) => item.count > 0)
    .map((item) => `<span class="reward-chip">${cardTypeLabel(item.type)}: 抽選${item.weight}% / 候補${item.count}</span>`);
  chips.push(`<span class="reward-chip owned">武器/OP上限 ${limit}枚</span>`);
  chips.push(`<span class="reward-chip owned">未所持・低所持ほど出やすい</span>`);
  if (choice.firstClearTickets > 0) chips.push(`<span class="reward-chip">初回クリア: 引換券${choice.firstClearTickets}枚</span>`);
  if (choice.repeatClearTickets > 0 && choice.repeatClearChance > 0) chips.push(`<span class="reward-chip owned">再クリア: 引換券${Math.round(choice.repeatClearChance * 100)}%</span>`);
  return chips.join("") || `<span class="reward-chip owned">追加報酬候補なし</span>`;
}

function normalizeSearchText(value) {
  return String(value ?? "").toLowerCase();
}

function cardTypeValue(type) {
  return {
    battleships: "battleships",
    mobileSuits: "mobileSuits",
    weapons: "weapons",
    options: "options",
    characters: "characters"
  }[type] ?? type;
}

function itemFactionIds(item) {
  if (Array.isArray(item.factions)) return item.factions;
  if (item.faction) return [item.faction];
  return [];
}

function cardFactionClass(item) {
  const factions = itemFactionIds(item);
  const hasFederation = factions.includes("federation");
  const hasZeon = factions.includes("zeon");
  if (hasFederation && hasZeon) return "card-faction-mixed";
  if (hasFederation) return "card-faction-federation";
  if (hasZeon) return "card-faction-zeon";
  return "";
}

function itemSearchText(type, item) {
  return normalizeSearchText([
    item.id,
    item.name,
    cardTypeLabel(type),
    ...itemFactionIds(item).map((faction) => state.data.factions[faction] ?? faction),
    ...(item.mapTypes ?? []),
    item.movementType,
    (type === "mobileSuits" || type === "battleships") ? movementTypeLabel(item) : "",
    ...(item.tags ?? []),
    ...(item.roles ?? []),
    ...(item.specials ?? []),
    item.category,
    item.effectType,
    item.effectText
  ].filter(Boolean).join(" "));
}

function itemPrimaryPower(item) {
  return item.power ?? item.armor ?? item.shooting ?? item.command ?? item.cost ?? 0;
}

function itemSortValue(type, item, sort) {
  if (sort === "costAsc" || sort === "costDesc") return item.cost ?? 0;
  if (sort === "armorDesc") return item.armor ?? item.durability ?? 0;
  if (sort === "powerDesc") return itemPrimaryPower(item);
  if (sort === "mobilityDesc") return item.mobility ?? item.reaction ?? 0;
  return item.name ?? item.id;
}

function sortedItems(type, items, sort = "name") {
  return [...items].sort((a, b) => {
    if (sort === "name") return String(a.name ?? a.id).localeCompare(String(b.name ?? b.id), "ja");
    const aValue = itemSortValue(type, a, sort);
    const bValue = itemSortValue(type, b, sort);
    const desc = sort.endsWith("Desc");
    if (aValue === bValue) return String(a.name ?? a.id).localeCompare(String(b.name ?? b.id), "ja");
    return desc ? bValue - aValue : aValue - bValue;
  });
}

function libraryFilteredItems(type, items, options = {}) {
  const filter = state.libraryFilter;
  const query = normalizeSearchText(filter.query).trim();
  return sortedItems(type, items.filter((item) => {
    const visibleForSearch = hasCard(type, item.id) || state.revealAllCards || options.forceReveal;
    if (filter.type !== "all" && cardTypeValue(type) !== filter.type) return false;
    if (filter.faction !== "all" && !itemFactionIds(item).includes(filter.faction)) return false;
    if (filter.ownership === "owned" && !hasCard(type, item.id)) return false;
    if (filter.ownership === "missing" && hasCard(type, item.id)) return false;
    if (query && (!visibleForSearch || !itemSearchText(type, item).includes(query))) return false;
    return true;
  }), filter.sort);
}

function pickerFilteredItems(kind, items) {
  const query = normalizeSearchText(state.pickerFilter.query).trim();
  const type = kind === "battleship" ? "battleships" : kind === "mobileSuit" ? "mobileSuits" : "characters";
  return sortedItems(type, items.filter((item) => !query || itemSearchText(type, item).includes(query)), state.pickerFilter.sort);
}

function filterOption(value, label, current) {
  return `<option value="${value}" ${value === current ? "selected" : ""}>${label}</option>`;
}

function renderLibraryControls() {
  const filter = state.libraryFilter;
  return `
    <nav class="library-type-tabs" aria-label="カード種別">
      ${[
        ["mobileSuits", "機体"],
        ["characters", "キャラ"],
        ["weapons", "武器"],
        ["options", "OP"],
        ["battleships", "戦艦"],
        ["all", "すべて"]
      ].map(([value, label]) => `<button type="button" data-action="library-type" data-type="${value}" class="${filter.type === value ? "active" : ""}" aria-pressed="${filter.type === value}">${label}</button>`).join("")}
    </nav>
    <div class="filter-bar">
      <label>検索<input class="library-control" data-filter-key="query" type="search" value="${escapeAttr(filter.query)}" placeholder="名前・タグ" /></label>
      <label>勢力<select class="library-control" data-filter-key="faction">
        ${filterOption("all", "すべて", filter.faction)}
        ${Object.entries(state.data.factions).map(([value, label]) => filterOption(value, label, filter.faction)).join("")}
      </select></label>
      <label>所持<select class="library-control" data-filter-key="ownership">
        ${[
          ["all", "すべて"],
          ["owned", "所持"],
          ["missing", "未入手"]
        ].map(([value, label]) => filterOption(value, label, filter.ownership)).join("")}
      </select></label>
      <label>ソート<select class="library-control" data-filter-key="sort">
        ${[
          ["name", "名前"],
          ["costAsc", "コスト低い順"],
          ["costDesc", "コスト高い順"],
          ["armorDesc", "耐久高い順"],
          ["powerDesc", "火力高い順"],
          ["mobilityDesc", "移動/反応高い順"]
        ].map(([value, label]) => filterOption(value, label, filter.sort)).join("")}
      </select></label>
      <button data-action="reset-library-filter">リセット</button>
    </div>
  `;
}

function renderPickerControls(kind) {
  const filter = state.pickerFilter;
  const sortLabels = kind === "character"
    ? [["costAsc", "コスト低い順"], ["costDesc", "コスト高い順"], ["mobilityDesc", "反応高い順"], ["powerDesc", "主能力高い順"], ["name", "名前"]]
    : [["costAsc", "コスト低い順"], ["costDesc", "コスト高い順"], ["armorDesc", "耐久高い順"], ["mobilityDesc", "移動高い順"], ["name", "名前"]];
  return `
    <div class="filter-bar">
      <label>検索<input class="picker-control" data-filter-key="query" type="search" value="${escapeAttr(filter.query)}" placeholder="名前・タグ" /></label>
      <label>ソート<select class="picker-control" data-filter-key="sort">
        ${sortLabels.map(([value, label]) => filterOption(value, label, filter.sort)).join("")}
      </select></label>
      <button data-action="reset-picker-filter">リセット</button>
    </div>
  `;
}

function choiceFilteredEntries() {
  const filter = state.choiceFilter;
  const query = normalizeSearchText(filter.query).trim();
  return choiceCandidateEntries()
    .filter(({ type, item }) => {
      if (filter.type !== "all" && cardTypeValue(type) !== filter.type) return false;
      if (filter.faction !== "all" && !itemFactionIds(item).includes(filter.faction)) return false;
      if (query && !itemSearchText(type, item).includes(query)) return false;
      return true;
    })
    .sort((a, b) => {
      const sort = filter.sort;
      if (sort === "type") {
        const typeCompare = cardTypeLabel(a.type).localeCompare(cardTypeLabel(b.type), "ja");
        if (typeCompare !== 0) return typeCompare;
      }
      if (sort === "name" || sort === "type") {
        return String(a.item.name ?? a.item.id).localeCompare(String(b.item.name ?? b.item.id), "ja");
      }
      const aValue = itemSortValue(a.type, a.item, sort);
      const bValue = itemSortValue(b.type, b.item, sort);
      const desc = sort.endsWith("Desc");
      if (aValue === bValue) return String(a.item.name ?? a.item.id).localeCompare(String(b.item.name ?? b.item.id), "ja");
      return desc ? bValue - aValue : aValue - bValue;
    });
}

function renderChoiceControls() {
  const filter = state.choiceFilter;
  return `
    <div class="filter-bar">
      <label>検索<input class="choice-control" data-filter-key="query" type="search" value="${escapeAttr(filter.query)}" placeholder="名前・タグ" /></label>
      <label>種別<select class="choice-control" data-filter-key="type">
        ${[
          ["all", "すべて"],
          ["battleships", "戦艦"],
          ["mobileSuits", "機体"],
          ["weapons", "武器"],
          ["options", "OP"],
          ["characters", "キャラ"]
        ].map(([value, label]) => filterOption(value, label, filter.type)).join("")}
      </select></label>
      <label>勢力<select class="choice-control" data-filter-key="faction">
        ${filterOption("all", "すべて", filter.faction)}
        ${Object.entries(state.data.factions).map(([value, label]) => filterOption(value, label, filter.faction)).join("")}
      </select></label>
      <label>ソート<select class="choice-control" data-filter-key="sort">
        ${[
          ["costDesc", "コスト高い順"],
          ["costAsc", "コスト低い順"],
          ["powerDesc", "火力高い順"],
          ["armorDesc", "耐久高い順"],
          ["mobilityDesc", "移動/反応高い順"],
          ["type", "種別"],
          ["name", "名前"]
        ].map(([value, label]) => filterOption(value, label, filter.sort)).join("")}
      </select></label>
      <button data-action="reset-choice-filter">リセット</button>
    </div>
  `;
}

function focusFilterControl(selector, key, value) {
  const control = setupScreen.querySelector(`${selector}[data-filter-key="${key}"]`);
  if (!control) return;
  control.focus();
  if (control.type === "search") {
    const position = String(value ?? "").length;
    control.setSelectionRange(position, position);
  }
}

function renderChoiceCardSelect() {
  state.screen = "choice";
  phaseLabel.textContent = "カード引換";
  setupScreen.className = "screen card-library-layout";
  const entries = choiceFilteredEntries();
  const total = choiceCandidateEntries().length;
  setupScreen.innerHTML = `
    <section class="panel stack">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">Choice Reward</p>
          <h2>カード引換</h2>
        </div>
        <div class="toolbar-actions">
          <button data-action="card-list">カード一覧</button>
          <button data-action="stage-select">ステージ選択</button>
          <button data-action="title">タイトルへ</button>
        </div>
      </div>
      <p class="support-hint ${choiceTicketCount() > 0 ? "ready" : ""}">
        カード引換券: ${choiceTicketCount()}枚 / 入手候補: ${total}件。武器とオプションは所持上限まで選べます。
      </p>
      ${renderChoiceControls()}
      ${entries.length > 0 ? `
        <section class="library-section">
          <h3>引換候補 <span class="section-count">${entries.length} / ${total}</span></h3>
          <div class="card-grid">
            ${entries.map(({ type, item }) => renderChoiceCandidateCard(type, item)).join("")}
          </div>
        </section>
      ` : `<p class="support-hint">条件に合う引換候補がありません。</p>`}
    </section>
  `;
  setupScreen.classList.remove("hidden");
  battleScreen.classList.add("hidden");
}

function renderChoiceCandidateCard(type, item) {
  const countText = isCountedCardType(type) ? `現在 x${cardCount(type, item.id)} / ${countedCardLimit(type)}` : "未所持";
  return `
    <article class="collection-card revealed ${cardFactionClass(item)}">
      <div class="collection-card-head">
        <strong>${item.name}</strong>
        <span class="status-pill preview">${cardTypeLabel(type)} / ${countText}</span>
      </div>
      ${renderChoiceCandidateDetails(type, item)}
      <button class="primary-button" data-action="claim-choice-card" data-card-type="${type}" data-id="${item.id}" ${choiceTicketCount() > 0 ? "" : "disabled"}>このカードを入手</button>
    </article>
  `;
}

function renderChoiceCandidateDetails(type, item) {
  if (type === "battleships") return renderBattleshipDataDetails(item);
  if (type === "mobileSuits") return renderMobileSuitDetails(item);
  if (type === "weapons") return renderWeaponDetails(item);
  if (type === "options") return renderOptionDetails(item);
  if (type === "characters") return renderCharacterDetails(item);
  return "";
}

function claimChoiceCard(type, id) {
  if (choiceTicketCount() <= 0) return false;
  const candidate = choiceCandidateEntries().find((entry) => entry.type === type && entry.item.id === id);
  if (!candidate) return false;
  state.collection.choiceTickets = choiceTicketCount() - 1;
  unlockCard({ type, id, count: 1 });
  saveCollection();
  return true;
}

function battleshipWeaponIdSet() {
  return new Set(state.data.battleships.flatMap((ship) => ship.weaponIds ?? []));
}

function revealMobileSuitFixedWeapons() {
  const shipWeaponIds = battleshipWeaponIdSet();
  return state.data.weapons.filter((weapon) => weapon.fixedOnly && weapon.category !== "ship-gun" && !shipWeaponIds.has(weapon.id));
}

function revealBattleshipFixedWeapons() {
  const shipWeaponIds = battleshipWeaponIdSet();
  return state.data.weapons.filter((weapon) => weapon.fixedOnly && (weapon.category === "ship-gun" || shipWeaponIds.has(weapon.id)));
}

function renderCardList() {
  state.screen = "cards";
  phaseLabel.textContent = "カード一覧";
  setupScreen.className = "screen card-library-layout";
  setupScreen.innerHTML = `
    <section class="panel stack">
      <div class="panel-heading">
        <h2>カード一覧</h2>
        <div class="toolbar-actions">
          <button data-action="choice-card" ${choiceTicketCount() > 0 && choiceCandidateEntries().length > 0 ? "" : "disabled"}>カード引換</button>
          <button data-action="stage-select">ステージ選択</button>
          <button data-action="title">タイトルへ</button>
        </div>
      </div>
      <details class="library-dev-tools" ${state.revealAllCards ? "open" : ""}>
        <summary>開発・確認用表示</summary>
        <button class="${state.revealAllCards ? "primary-button" : ""}" data-action="toggle-card-reveal">${state.revealAllCards ? "通常表示に戻す" : "未入手・固定武装の情報を開く"}</button>
      </details>
      ${state.revealAllCards ? `<p class="support-hint ready">確認用表示中: 未入手カードと固定武装の詳細を表示しています。所持状況やセーブデータは変わりません。</p>` : ""}
      ${renderLibraryControls()}
      ${cardLibrarySection("battleships", "戦艦", state.data.battleships.filter((ship) => ship.selectable !== false), renderBattleshipDataDetails)}
      ${cardLibrarySection("mobileSuits", "機体", state.data.mobileSuits, renderMobileSuitDetails)}
      ${cardLibrarySection("weapons", "武器", state.data.weapons.filter((weapon) => !weapon.fixedOnly), renderWeaponDetails)}
      ${state.revealAllCards ? cardLibrarySection("weapons", "機体固定・付属武装（確認用）", revealMobileSuitFixedWeapons(), renderWeaponDetails, { forceReveal: true }) : ""}
      ${state.revealAllCards ? cardLibrarySection("weapons", "戦艦固定武装（確認用）", revealBattleshipFixedWeapons(), renderWeaponDetails, { forceReveal: true }) : ""}
      ${cardLibrarySection("options", "オプション", state.data.options ?? [], renderOptionDetails)}
      ${cardLibrarySection("characters", "キャラ", state.data.characters.filter((character) => character.selectable !== false), renderCharacterDetails)}
      ${state.revealAllCards ? cardLibrarySection("characters", "敵専用キャラ（確認用）", state.data.characters.filter((character) => character.selectable === false), renderCharacterDetails, { forceReveal: true }) : ""}
      ${skillLibrarySection()}
    </section>
  `;
  setupScreen.classList.remove("hidden");
  battleScreen.classList.add("hidden");
}

function cardLibrarySection(type, title, items, detailRenderer, options = {}) {
  const filteredItems = libraryFilteredItems(type, items, options);
  if (filteredItems.length === 0) return "";
  return `
    <section class="library-section">
      <h3>${title} <span class="section-count">${filteredItems.length} / ${items.length}</span></h3>
      <div class="card-grid">
        ${filteredItems.map((item) => {
          const actuallyOwned = hasCard(type, item.id);
          const revealed = state.revealAllCards || options.forceReveal;
          const visible = actuallyOwned || revealed;
          const countLabel = isCountedCardType(type) && actuallyOwned ? `所持 x${cardCount(type, item.id)}` : actuallyOwned ? "所持" : "確認用";
          return `
            <article class="collection-card ${actuallyOwned ? "owned" : visible ? "revealed" : "locked compact-locked-card"} ${visible ? cardFactionClass(item) : ""}">
              <div class="collection-card-head">
                <span class="collection-card-title">${visible ? renderCardImage(type, item, { size: "sm" }) : ""}<strong>${visible ? item.name : "未入手カード"}</strong></span>
                <span class="status-pill ${actuallyOwned ? "ready" : visible ? "preview" : ""}">${visible ? countLabel : "未入手"}</span>
              </div>
              ${visible ? detailRenderer(item, { omitImage: true }) : ""}
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function allSkillIds() {
  return uniqueSkillIds([
    ...(state.data.skills ?? []).map((skill) => skill.id),
    ...state.data.mobileSuits.flatMap((ms) => ms.specials ?? []),
    ...state.data.weapons.flatMap((weapon) => weapon.specials ?? []),
    ...state.data.characters.flatMap((character) => character.specials ?? []),
    ...(state.data.options ?? []).map((option) => option.grantsSkill).filter(Boolean)
  ]).sort((a, b) => skillName(a).localeCompare(skillName(b), "ja"));
}

function skillSourceSummary(skillId) {
  const sources = [
    ...state.data.mobileSuits.filter((ms) => (ms.specials ?? []).includes(skillId)).map((ms) => ms.name),
    ...state.data.weapons.filter((weapon) => (weapon.specials ?? []).includes(skillId)).map((weapon) => weapon.name),
    ...state.data.characters.filter((character) => (character.specials ?? []).includes(skillId)).map((character) => character.name),
    ...(state.data.options ?? []).filter((option) => option.grantsSkill === skillId).map((option) => option.name)
  ];
  return sources.length > 0 ? sources.join(" / ") : "現状カードなし";
}

function skillLibrarySection() {
  const filter = state.libraryFilter;
  if (filter.type !== "all" || filter.ownership !== "all" || filter.faction !== "all") return "";
  const query = normalizeSearchText(filter.query).trim();
  const skillIds = allSkillIds().filter((id) => {
    if (!query) return true;
    const skill = skillDefinition(id);
    return normalizeSearchText([id, skill.name, skill.type, skill.timing, skill.effect, skillSourceSummary(id)].join(" ")).includes(query);
  });
  if (skillIds.length === 0) return "";
  return `
    <section class="library-section">
      <h3>スキル辞典 <span class="section-count">${skillIds.length} / ${allSkillIds().length}</span></h3>
      <div class="skill-library-grid">
        ${skillIds.map((id) => {
          const skill = skillDefinition(id);
          return `
            <article class="collection-card owned skill-library-card">
              <div class="collection-card-head">
                <strong>${skill.name}</strong>
                <span class="status-pill ${skill.implemented ? "ready" : ""}">${skill.implemented ? "反映済" : "表示のみ"}</span>
              </div>
              ${statItems([
                ["分類", skill.type],
                ["発動", skill.timing]
              ])}
              <p class="small">${skill.effect}</p>
              <p class="small">付与カード: ${skillSourceSummary(id)}</p>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderFormationPicker(kind, owner = "") {
  state.screen = "picker";
  state.picker = { kind, owner };
  phaseLabel.textContent = kind === "mobileSuit" ? "機体選択" : kind === "battleship" ? "戦艦選択" : "キャラ選択";
  setupScreen.className = "screen card-library-layout";
  const selectedMapData = selectedMap();
  const title = kind === "mobileSuit" ? "機体を一覧から選ぶ" : kind === "battleship" ? "戦艦を一覧から選ぶ" : `${ownerLabel(owner)}を一覧から選ぶ`;
  const items = kind === "mobileSuit"
    ? state.data.mobileSuits.filter((item) => mobileSuitUsableByFaction(item, state.faction) && hasCard("mobileSuits", item.id) && mobileSuitCanPotentiallyDeployOnMap(item, selectedMapData, state.faction))
    : kind === "battleship"
      ? state.data.battleships.filter((item) => item.faction === state.faction && hasCard("battleships", item.id) && battleshipCanDeployOnMap(item, selectedMapData))
    : state.data.characters.filter((item) => characterSelectable(item)
      && hasCard("characters", item.id)
      && (owner === "mobileSuit" ? characterCanPilotMobileSuit(item, lookup().ms[state.selectedMsId], state.faction) : characterUsableByFaction(item, state.faction)));
  const visibleItems = pickerFilteredItems(kind, items);
  setupScreen.innerHTML = `
    <section class="panel stack">
      <div class="panel-heading">
        <h2>${title}</h2>
        <button data-action="back-setup">編成へ戻る</button>
      </div>
      <p class="small">${selectedMapData.name} / ${factionName(state.faction)}の所持カードから選択中です。</p>
      ${renderPickerControls(kind)}
      <p class="small">表示 ${visibleItems.length} / ${items.length}</p>
      <div class="picker-grid">
        ${kind === "mobileSuit"
          ? visibleItems.map((item) => mobileSuitPickerCard(item)).join("")
          : kind === "battleship"
            ? visibleItems.map((item) => battleshipPickerCard(item)).join("")
            : blankCharacterCard(owner) + visibleItems.map((item) => characterPickerCard(item, owner)).join("")}
      </div>
    </section>
  `;
  setupScreen.classList.remove("hidden");
  battleScreen.classList.add("hidden");
}

function ownerLabel(owner) {
  return {
    mobileSuit: "MS搭乗キャラ",
    captain: "艦長",
    firstOfficer: "副長"
  }[owner] ?? "キャラ";
}

function mobileSuitPickerCard(ms) {
  const remaining = remainingCardCopies("mobileSuits", ms.id);
  return `
    <article class="picker-card ${cardFactionClass(ms)} ${ms.id === state.selectedMsId ? "selected" : ""}">
      <div class="collection-card-head">
        <span class="collection-card-title">${renderCardImage("mobileSuits", ms, { size: "sm" })}<strong>${ms.name}</strong></span>
        <span class="status-pill ${remaining > 0 ? "ready" : ""}">所持${cardCount("mobileSuits", ms.id)} / 残り${remaining}</span>
      </div>
      ${statItems([
        ["コスト", ms.cost],
        ["装甲", ms.armor],
        ["EN", ms.energy],
        ["運動", ms.agility],
        ["移動", ms.mobility],
        ["装備枠", `武器${ms.weaponSlots ?? 2} / OP${ms.optionSlots ?? 1}`]
      ])}
      ${renderMobileSuitDetails(ms, { omitCoreStats: true, omitImage: true })}
      <button class="primary-button" data-action="choose-ms" data-id="${ms.id}">この機体にする</button>
    </article>
  `;
}

function battleshipPickerCard(ship) {
  return `
    <article class="picker-card ${cardFactionClass(ship)} ${ship.id === state.selectedBattleshipId ? "selected" : ""}">
      <div class="collection-card-head">
        <span class="collection-card-title">${renderCardImage("battleships", ship, { size: "sm" })}<strong>${ship.name}</strong></span>
        <span class="status-pill ready">所持</span>
      </div>
      ${statItems([
        ["コスト", ship.cost],
        ["耐久", ship.armor],
        ["EN", ship.energy],
        ["回避基礎", ship.agility],
        ["移動", ship.mobility],
        ["補給", `装甲${ship.support.armor} / EN${ship.support.energy} / 弾${ship.support.ammo}`]
      ])}
      ${renderBattleshipDataDetails(ship, { omitCoreStats: true, omitImage: true })}
      <button class="primary-button" data-action="choose-battleship" data-id="${ship.id}">この戦艦にする</button>
    </article>
  `;
}

function blankCharacterCard(owner) {
  return `
    <article class="picker-card blank-card">
      <div class="collection-card-head">
        <strong>未配置</strong>
        <span class="status-pill">空欄</span>
      </div>
      <p class="small">いったん枠を空にして、あとから選び直せます。</p>
      <button data-action="clear-character" data-owner="${owner}">未配置にする</button>
    </article>
  `;
}

function characterPickerCard(character, owner) {
  const key = character.characterKey ?? character.id;
  const used = usedCharacterKeys({
    excludeBridgeSlot: owner,
    includeSelectedCharacter: owner !== "mobileSuit"
  }).has(key);
  const current = character.id === characterIdForOwner(owner);
  const disabled = used && !current;
  return `
    <article class="picker-card ${cardFactionClass(character)} ${current ? "selected" : ""} ${disabled ? "disabled-card" : ""}">
      <div class="collection-card-head">
        <span class="collection-card-title">${renderCardImage("characters", character, { size: "sm" })}<strong>${character.name}</strong></span>
        <span class="status-pill ${disabled ? "" : "ready"}">${disabled ? "編成済み" : "選択可"}</span>
      </div>
      ${statItems([
        ["コスト", character.cost],
        ["射撃", character.shooting],
        ["格闘", character.melee],
        ["反応", character.reaction],
        ["指揮", character.command],
        ["整備", character.maintenance]
      ])}
      ${renderCharacterDetails(character, { omitCoreStats: true, omitImage: true })}
      <button class="primary-button" data-action="choose-character" data-owner="${owner}" data-id="${character.id}" ${disabled ? "disabled" : ""}>このキャラにする</button>
    </article>
  `;
}

function characterIdForOwner(owner) {
  if (owner === "captain") return state.selectedCaptainId;
  if (owner === "firstOfficer") return state.selectedFirstOfficerId;
  return state.selectedCharacterId;
}

function renderFavoriteFormationControls() {
  const favorite = selectedFavoriteFormation();
  const compatible = favorite && playableFactionsOnMap().includes(favorite.faction);
  const defaultName = favorite?.name ?? `お気に入り${String(state.selectedFavoriteSlot + 1).padStart(2, "0")}`;
  const slotOptions = Array.from({ length: FAVORITE_FORMATION_SLOTS }, (_, index) => {
    const saved = state.favoriteFormations[index];
    const number = String(index + 1).padStart(2, "0");
    const label = saved
      ? `${number}: ${saved.name}（${factionName(saved.faction)}）`
      : `${number}: 未登録`;
    return `<option value="${index}" ${index === state.selectedFavoriteSlot ? "selected" : ""}>${escapeAttr(label)}</option>`;
  }).join("");
  return `
    <details class="favorite-formation-box" ${favorite ? "open" : ""}>
      <summary><strong>お気に入り編成</strong><span class="small">20枠・登録／呼び出し</span></summary>
      <select id="favoriteFormationSlot" aria-label="お気に入り編成の枠">${slotOptions}</select>
      <input id="favoriteFormationName" aria-label="お気に入り編成名" maxlength="30" value="${escapeAttr(defaultName)}" />
      <div class="favorite-formation-actions">
        <button data-action="save-favorite-formation">この編成を登録</button>
        <button data-action="load-favorite-formation" ${compatible ? "" : "disabled"}>呼び出す</button>
        <button data-action="delete-favorite-formation" ${favorite ? "" : "disabled"}>削除</button>
      </div>
      ${favorite && !compatible ? `<p class="small">このステージでは${factionName(favorite.faction)}編成を使用できません。</p>` : ""}
    </details>
  `;
}

function renderSetup() {
  normalizeSelections();
  state.phase = "setup";
  phaseLabel.textContent = "編成";
  state.screen = "setup";
  const { ms, characters, weapons, battleships, maps, options } = lookup();
  const cost = currentCost();
  const selectedMapData = maps[state.selectedMapId] ?? state.data.maps[0];
  const free = isFreeBattle();
  const cap = free ? null : stageCostCap(selectedMapData.id);
  const enemyCost = free ? null : enemyTotalCostForStage(selectedMapData.id);
  const costOverCap = cap !== null && cost > cap;
  const meterPercent = free ? 100 : clamp((cost / cap) * 100, 0, 100);
  const battleSummaryText = free
    ? `総コスト ${cost} / 上限なし（敵は出撃時に近いコスト帯でランダム生成）`
    : `総コスト ${cost} / ${cap}（敵総コスト${enemyCost}）`;
  const availableBattleships = state.data.battleships.filter((item) => item.faction === state.faction && hasCard("battleships", item.id) && battleshipCanDeployOnMap(item, selectedMapData));
  const availableMs = state.data.mobileSuits.filter((item) => mobileSuitUsableByFaction(item, state.faction) && hasCard("mobileSuits", item.id) && mobileSuitCanPotentiallyDeployOnMap(item, selectedMapData, state.faction));
  const selectedMsForCharacters = ms[state.selectedMsId] ?? availableMs[0];
  const availableCharacters = state.data.characters.filter((item) => characterSelectable(item) && characterCanPilotMobileSuit(item, selectedMsForCharacters, state.faction) && hasCard("characters", item.id));
  const selectedBattleship = battleships[state.selectedBattleshipId] ?? availableBattleships[0];
  const selectedMs = ms[state.selectedMsId] ?? availableMs[0];
  const selectedWeaponSlots = weaponSlotCount(selectedMs);
  const usedWeaponSlots = selectedWeaponSlotCost(state.selectedWeaponIds);
  const availableWeapons = state.data.weapons.filter((weapon) => remainingCardCopies("weapons", weapon.id) > 0
    && weaponEquippableByMs(selectedMs, weapon)
    && weaponSlotCost(weapon) <= selectedWeaponSlots);
  const availableOptions = (state.data.options ?? []).filter((option) => remainingCardCopies("options", option.id) > 0 && optionEquippableByMs(option, selectedMs, selectedMapData, state.faction));
  const selectedOption = options[state.selectedOptionId];
  const selectedEntryCanDeploy = selectedMs ? mobileSuitCanDeployOnMap(selectedMs, selectedMapData, state.selectedOptionId ? [state.selectedOptionId] : []) : false;
  const selectedCharacter = characters[state.selectedCharacterId];
  const selectedMsRemaining = selectedMs ? remainingCardCopies("mobileSuits", selectedMs.id) : 0;
  const selectedMsCanHavePilot = mobileSuitCanHavePilot(selectedMs);
  const addCost = selectedMs.cost + (selectedCharacter?.cost ?? 0) + (selectedOption?.cost ?? 0) + state.selectedWeaponIds.reduce((sum, id) => sum + weapons[id].cost, 0);
  const projectedCost = cost + addCost;

  setupScreen.className = "screen setup-layout";
  setupScreen.innerHTML = `
    <aside class="panel stack">
      <div class="panel-heading">
        <h2>編成</h2>
        <button data-action="${free ? "free-battle-select" : "stage-select"}">${free ? "フリー対戦へ" : "ステージへ"}</button>
      </div>
      <div class="segmented">
        ${Object.entries(state.data.factions).map(([id, name]) => `<button data-action="faction" data-faction="${id}" class="${state.faction === id ? "active" : ""}" ${playableFactionsOnMap(selectedMapData).includes(id) ? "" : "disabled"}>${name}</button>`).join("")}
      </div>
      ${renderFavoriteFormationControls()}
      <div class="meter ${costOverCap ? "over" : ""}">
        <div class="meter-line"><div class="meter-fill" style="width: ${meterPercent}%"></div></div>
        <p class="small">${battleSummaryText}</p>
      </div>
      <div class="setup-stage-summary">
        <strong>${selectedMapData.name}</strong>
        <span>${mapTypeName(selectedMapData.type)}・${free ? "コスト上限なし" : `上限${cap}`}</span>
      </div>
      <div class="form-row">
        <label>${free ? "マップ" : "ステージ"}</label>
        ${free ? `
          <select id="mapSelect">
            ${state.data.maps.filter((map) => freeBattleMapAvailable(map)).map((map) => `<option value="${map.id}" ${map.id === selectedMapData.id ? "selected" : ""}>${map.name} / ${mapTypeName(map.type)}</option>`).join("")}
          </select>
        ` : `<div class="readonly-field">${selectedMapData.name} / ${mapTypeName(selectedMapData.type)}</div>`}
      </div>
      ${renderMapDetails(selectedMapData)}
      <div class="form-row">
        <label for="battleshipSelect">戦艦（1隻のみ）</label>
        <div class="select-with-action">
          <select id="battleshipSelect">
            ${availableBattleships.map((item) => `<option value="${item.id}" ${item.id === selectedBattleship.id ? "selected" : ""}>${item.name} / コスト${item.cost} / 耐久${item.armor} / 移動${item.mobility}</option>`).join("")}
          </select>
          <button data-action="open-picker" data-picker-kind="battleship">一覧</button>
        </div>
      </div>
      ${renderBattleshipDataDetails(selectedBattleship)}
      ${renderBridgeSelectors()}
      <p class="small">戦艦+ブリッジコスト: ${selectedBattleship.cost + bridgeCost()}。撃沈されると即敗北です。</p>
    </aside>

    <section class="panel stack">
      <h2>出撃メンバー追加</h2>
      <div class="form-row">
        <label for="msSelect">MS</label>
        <div class="select-with-action">
          <select id="msSelect">
            ${availableMs.map((item) => `<option value="${item.id}" ${item.id === state.selectedMsId ? "selected" : ""}>${item.name} / 残り${remainingCardCopies("mobileSuits", item.id)}枚 / コスト${item.cost} / 装甲${item.armor}</option>`).join("")}
          </select>
          <button data-action="open-picker" data-picker-kind="mobileSuit">一覧</button>
        </div>
      </div>
      ${renderMobileSuitDetails(selectedMs, { open: true })}
      ${selectedMsCanHavePilot ? `<div class="form-row">
        <label for="characterSelect">キャラクター</label>
        <div class="select-with-action">
          <select id="characterSelect">
            <option value="" ${state.selectedCharacterId ? "" : "selected"}>未配置</option>
            ${availableCharacters.map((item) => {
              const key = item.characterKey ?? item.id;
              const disabled = usedCharacterKeys({ includeBridge: false }).has(key) && item.id !== state.selectedCharacterId;
              return `<option value="${item.id}" ${item.id === state.selectedCharacterId ? "selected" : ""} ${disabled ? "disabled" : ""}>${item.name} / ${characterRolesLabel(item)} / コスト${item.cost}${disabled ? " / 編成済み" : ""}</option>`;
            }).join("")}
          </select>
          <button data-action="open-picker" data-picker-kind="character" data-owner="mobileSuit">一覧</button>
          <button data-action="clear-character" data-owner="mobileSuit">未配置</button>
        </div>
      </div>
      ${selectedCharacter ? renderCharacterDetails(selectedCharacter, { open: true }) : `<p class="support-hint">キャラクター未配置です。一覧から選ぶか、プルダウンで選択してください。</p>`}` : `
      <div class="form-row">
        <label>キャラクター</label>
        <div class="readonly-field">パイロット不可</div>
        <p class="support-hint">この機体はコクピットを持たない無人機として扱われ、キャラクターを搭乗させられません。</p>
      </div>`}
      <div>
        <h3>手持ち武装</h3>
        <p class="small">装備枠: ${usedWeaponSlots} / ${selectedWeaponSlots}</p>
        <div class="weapon-list">
          ${availableWeapons.length === 0 ? `<p class="small">この機体は手持ち武器を装備できません。</p>` : availableWeapons.map((weapon) => {
            const selectedCopies = selectedWeaponCopyCount(weapon.id);
            const otherUsedSlots = usedWeaponSlots - selectedCopies * weaponSlotCost(weapon);
            const maxBySlots = Math.max(0, Math.floor((selectedWeaponSlots - otherUsedSlots) / weaponSlotCost(weapon)));
            const maxCopies = Math.min(remainingCardCopies("weapons", weapon.id), maxBySlots);
            const countOptions = Array.from({ length: maxCopies + 1 }, (_, count) => `<option value="${count}" ${count === selectedCopies ? "selected" : ""}>${count}</option>`).join("");
            return `
            <div class="choice-card">
              <label>
                <span class="weapon-count-field">装備数
                  <select class="weapon-count-control" data-weapon-id="${weapon.id}" aria-label="${escapeAttr(weapon.name)}の装備数" ${maxCopies === 0 && selectedCopies === 0 ? "disabled" : ""}>${countOptions}</select>
                </span>
                <strong>${weapon.name}</strong>
              </label>
              <span class="small">1つにつき使用枠${weaponSlotCost(weapon)} / 使用可能${remainingCardCopies("weapons", weapon.id)}枚 / コスト${weapon.cost} / ${weapon.kind === "shield" ? `盾耐久${weapon.durability}${weaponCanAttack(weapon) ? ` / 盾攻撃 威力${weapon.power} 命中${weapon.accuracy}` : ""}` : `威力${weapon.power} 命中${weapon.accuracy} ${weaponRangeLabel(weapon)}`}</span>
              ${renderWeaponDetails(weapon, { omitCoreStats: true })}
            </div>
          `; }).join("")}
        </div>
      </div>
      <div class="form-row">
        <label for="optionSelect">オプション</label>
        <select id="optionSelect" ${(selectedMs.optionSlots ?? 1) > 0 ? "" : "disabled"}>
          <option value="" ${state.selectedOptionId ? "" : "selected"}>なし</option>
          ${availableOptions.map((option) => `<option value="${option.id}" ${option.id === state.selectedOptionId ? "selected" : ""}>${option.name} / 残り${remainingCardCopies("options", option.id)}枚 / コスト${option.cost}</option>`).join("")}
        </select>
        ${selectedOption ? renderOptionDetails(selectedOption, { open: true }) : `<p class="small">${(selectedMs.optionSlots ?? 1) > 0 ? "オプションなし" : "この機体はオプションを装備できません。"}</p>`}
      </div>
      <button class="primary-button" data-action="add" ${(!free && projectedCost > cap) || selectedMsRemaining < 1 || !selectedEntryCanDeploy ? "disabled" : ""}>この組み合わせを追加（+${addCost}）</button>
      ${selectedMsRemaining < 1 ? `<p class="support-hint">この機体カードの残り枚数がありません。</p>` : ""}
      ${selectedMapData.type === "air" && !selectedEntryCanDeploy ? `<p class="support-hint">空中マップでは飛行機体、または飛行SFS装備の機体だけ出撃できます。</p>` : ""}
    </section>

    <aside class="panel stack setup-roster-panel">
      <h2>現在の部隊</h2>
      <div class="recommended-formation-box">
        <button type="button" data-action="recommended-formation">おすすめ編成</button>
        <p class="small">所持カードから、地形とコストに合う部隊を自動で組みます。</p>
      </div>
      ${state.setupNotice ? `<p class="support-hint ${state.setupNotice.startsWith("おすすめ編成を作成") ? "ready" : ""}">${state.setupNotice}</p>` : ""}
      <button type="button" class="primary-button setup-launch-button" data-action="launch" ${state.formation.length === 0 || costOverCap ? "disabled" : ""}>出撃</button>
      <div class="roster-list">
        ${battleshipRosterCard(selectedBattleship)}
        ${state.formation.length === 0 ? `<p class="small">MSはまだ追加されていません。</p>` : state.formation.map((entry, index) => rosterCard(entry, index)).join("")}
      </div>
    </aside>
  `;

  setupScreen.classList.remove("hidden");
  battleScreen.classList.add("hidden");
}

function selectedWeaponCopyCount(weaponId) {
  return state.selectedWeaponIds.filter((id) => id === weaponId).length;
}

function replaceSelectedWeaponCopies(ids, weaponId, desiredCount) {
  const next = [];
  let inserted = false;
  ids.forEach((id) => {
    if (id !== weaponId) {
      next.push(id);
      return;
    }
    if (inserted) return;
    for (let count = 0; count < desiredCount; count += 1) next.push(weaponId);
    inserted = true;
  });
  if (!inserted) {
    for (let count = 0; count < desiredCount; count += 1) next.push(weaponId);
  }
  return next;
}

function crewRoleLabel(role) {
  return {
    captain: "艦長",
    firstOfficer: "副長"
  }[role] ?? role;
}

function renderBridgeSelectors() {
  const charactersById = lookup().characters;
  return [
    ["captain", "selectedCaptainId"],
    ["firstOfficer", "selectedFirstOfficerId"]
  ].map(([role, stateKey]) => {
    const candidates = state.data.characters.filter((character) => characterSelectable(character) && characterUsableByFaction(character, state.faction) && hasCard("characters", character.id));
    const used = usedCharacterKeys({ excludeBridgeSlot: role, includeSelectedCharacter: false });
    return `
      <div class="form-row">
        <label for="bridge-${role}">${crewRoleLabel(role)}</label>
        <div class="select-with-action">
          <select id="bridge-${role}" data-bridge-slot="${role}">
            <option value="" ${state[stateKey] ? "" : "selected"}>未配置</option>
            ${candidates.map((character) => {
              const key = character.characterKey ?? character.id;
              const disabled = used.has(key) && character.id !== state[stateKey];
              return `<option value="${character.id}" ${character.id === state[stateKey] ? "selected" : ""} ${disabled ? "disabled" : ""}>${character.name} / ${characterRolesLabel(character)} / コスト${character.cost}${disabled ? " / 編成済み" : ""}</option>`;
            }).join("")}
          </select>
          <button data-action="open-picker" data-picker-kind="character" data-owner="${role}">一覧</button>
          <button data-action="clear-character" data-owner="${role}">未配置</button>
        </div>
        <p class="small">${charactersById[state[stateKey]] ? characterSummary(charactersById[state[stateKey]]) : "未配置"}</p>
        ${charactersById[state[stateKey]] ? renderCharacterDetails(charactersById[state[stateKey]]) : ""}
      </div>
    `;
  }).join("");
}

function characterSummary(character) {
  return `${characterRolesLabel(character)} / 射撃${character.shooting} / 格闘${character.melee} / 反応${character.reaction} / 指揮${character.command} / 通信${character.support} / 整備${character.maintenance}`;
}

function rosterCard(entry, index) {
  const { ms, characters, weapons, options } = lookup();
  const unitMs = ms[entry.msId];
  const unitCharacter = characters[entry.characterIds[0]] ?? NO_CHARACTER;
  const weaponNames = entry.weaponIds.map((id) => weapons[id].name).join(" / ") || "手持ちなし";
  const optionNames = (entry.optionIds ?? []).map((id) => options[id]?.name).filter(Boolean).join(" / ") || "OPなし";
  const sortieNumber = index + 1;
  return `
    <div class="unit-card unit-card-with-images ${cardFactionClass(unitMs)}">
      <div class="roster-visual"><span class="roster-number">${sortieNumber}</span>${renderCardImageGroup([
        { type: "mobileSuits", item: unitMs },
        { type: "characters", item: unitCharacter }
      ], { size: "sm" })}</div>
      <div>
        <strong>${sortieNumber}. ${unitMs.name} + ${unitCharacter.name}</strong>
        <div class="small">${weaponNames} / ${optionNames} / コスト${formationCost(entry)}</div>
        <div class="inline-details">
          ${renderMobileSuitDetails(unitMs, { omitImage: true })}
          ${renderCharacterDetails(unitCharacter, { omitImage: true })}
          ${entry.weaponIds.map((id) => renderWeaponDetails(weapons[id])).join("")}
          ${(entry.optionIds ?? []).map((id) => renderOptionDetails(options[id])).join("")}
        </div>
      </div>
      <button data-action="remove" data-index="${index}">外す</button>
    </div>
  `;
}

function battleshipRosterCard(ship) {
  const { characters } = lookup();
  const captain = characters[state.selectedCaptainId];
  const firstOfficer = characters[state.selectedFirstOfficerId];
  return `
    <div class="unit-card flagship-card unit-card-with-images ${cardFactionClass(ship)}">
      <div class="roster-visual">${renderCardImageGroup([
        { type: "battleships", item: ship },
        { type: "characters", item: captain }
      ], { size: "sm" })}</div>
      <div>
        <strong>${ship.name}</strong>
        <div class="small">艦長: ${captain?.name ?? "未配置"} / 副長: ${firstOfficer?.name ?? "未配置"} / コスト${ship.cost + bridgeCost()}</div>
        <div class="inline-details">
          ${renderBattleshipDataDetails(ship, { omitImage: true })}
          ${captain ? renderCharacterDetails(captain, { omitImage: true }) : ""}
          ${firstOfficer ? renderCharacterDetails(firstOfficer, { omitImage: true }) : ""}
        </div>
      </div>
    </div>
  `;
}

function chooseMobileSuit(msId) {
  const ms = lookup().ms[msId];
  if (!ms || !hasCard("mobileSuits", ms.id) || !mobileSuitCanPotentiallyDeployOnMap(ms, selectedMap(), state.faction)) return;
  state.selectedMsId = ms.id;
  state.setupNotice = "";
  state.selectedWeaponIds = defaultLoadout(ms);
  if (!mobileSuitCanHavePilot(ms)) state.selectedCharacterId = "";
  renderSetup();
}

function chooseBattleship(shipId) {
  const ship = lookup().battleships[shipId];
  if (!ship || !hasCard("battleships", ship.id) || !battleshipCanDeployOnMap(ship, selectedMap())) return;
  state.selectedBattleshipId = ship.id;
  state.setupNotice = "";
  rememberFormation();
  renderSetup();
}

function setCharacterForOwner(owner, characterId) {
  state.setupNotice = "";
  let assignedCharacterId = characterId;
  if (owner === "captain") state.selectedCaptainId = characterId;
  if (owner === "firstOfficer") state.selectedFirstOfficerId = characterId;
  if (owner === "mobileSuit") {
    assignedCharacterId = mobileSuitCanHavePilot(lookup().ms[state.selectedMsId]) ? characterId : "";
    state.selectedCharacterId = assignedCharacterId;
  }
  if (assignedCharacterId) clearCharacterConflicts(assignedCharacterId, owner);
  if (owner === "captain" || owner === "firstOfficer") rememberFormation();
  renderSetup();
}

function changeFaction(faction) {
  const currentMap = selectedMap();
  if (!playableFactionsOnMap(currentMap).includes(faction)) return;
  rememberFormation();
  state.setupNotice = "";
  state.faction = faction;
  state.formation = [];
  const factionBattleship = state.data.battleships.find((ship) => ship.faction === faction && hasCard("battleships", ship.id) && battleshipCanDeployOnMap(ship, currentMap));
  const factionMs = state.data.mobileSuits.find((ms) => mobileSuitUsableByFaction(ms, faction) && hasCard("mobileSuits", ms.id) && mobileSuitCanPotentiallyDeployOnMap(ms, currentMap, faction));
  const factionCharacter = state.data.characters.find((character) => characterSelectable(character) && characterUsableByFaction(character, faction) && hasCard("characters", character.id));
  state.selectedBattleshipId = factionBattleship?.id ?? "";
  const bridge = defaultBridgeSelection(faction);
  state.selectedCaptainId = bridge.captainId;
  state.selectedFirstOfficerId = bridge.firstOfficerId;
  state.selectedMsId = factionMs?.id ?? "";
  state.selectedCharacterId = mobileSuitCanHavePilot(factionMs) ? (firstAvailableCharacter(faction)?.id ?? factionCharacter?.id ?? "") : "";
  state.selectedWeaponIds = factionMs ? defaultLoadout(factionMs) : [];
  state.selectedOptionId = "";
  if (!restoreRememberedFormation()) applyStarterFormation();
  renderSetup();
}

function addFormationEntry() {
  normalizeSelections();
  if (!state.selectedMsId) return;
  if (!selectionWithinOwnedCounts("mobileSuits", [state.selectedMsId])) return;
  if (selectedWeaponSlotCost(state.selectedWeaponIds) > weaponSlotCount(lookup().ms[state.selectedMsId])) return;
  if (!selectionWithinOwnedCounts("weapons", state.selectedWeaponIds)) return;
  if (state.selectedOptionId && !selectionWithinOwnedCounts("options", [state.selectedOptionId])) return;
  const selectedMs = lookup().ms[state.selectedMsId];
  const optionIds = state.selectedOptionId ? [state.selectedOptionId] : [];
  if (!mobileSuitCanDeployOnMap(selectedMs, selectedMap(), optionIds)) return;
  const characterIds = mobileSuitCanHavePilot(selectedMs) && state.selectedCharacterId ? [state.selectedCharacterId] : [];
  state.formation.push({
    msId: state.selectedMsId,
    characterIds,
    weaponIds: [...state.selectedWeaponIds],
    optionIds
  });
  state.selectedCharacterId = mobileSuitCanHavePilot(selectedMs) ? (firstAvailableCharacter(state.faction)?.id ?? "") : "";
  state.selectedOptionId = "";
  state.setupNotice = "";
  rememberFormation();
  renderSetup();
}

function makeUnit(entry, side, x, y, index) {
  const { ms, characters, weapons, options } = lookup();
  const unitMs = ms[entry.msId];
  const optionIds = [...(entry.optionIds ?? [])];
  const optionWeaponIds = optionIds.flatMap((id) => options[id]?.weaponIds ?? []);
  const weaponIds = [...unitMs.fixedWeaponIds, ...entry.weaponIds, ...optionWeaponIds];
  const runtimeWeapons = runtimeWeaponsForIds(weaponIds, optionIds);
  const maxEnergy = optionAdjustedValue(unitMs.energy + (optionIds.includes("externalGenerator") ? 25 : 0), optionIds, "energyModifier", 0);
  const baseArmor = Number.isFinite(Number(entry.armorOverride))
    ? Math.max(1, Math.floor(Number(entry.armorOverride)))
    : unitMs.armor;
  const maxArmor = optionAdjustedValue(baseArmor, optionIds, "armorModifier", 1);
  const totalCost = unitMs.cost
    + (entry.characterIds ?? []).reduce((sum, id) => sum + (characters[id]?.cost ?? 0), 0)
    + (entry.weaponIds ?? []).reduce((sum, id) => sum + (weapons[id]?.cost ?? 0), 0)
    + optionIds.reduce((sum, id) => sum + (options[id]?.cost ?? 0), 0);
  const capturedOperator = (entry.characterIds ?? [])
    .map((id) => characters[id])
    .find((character) => (character?.specials ?? []).includes("capturedOperation") && unitMs.faction === "zeon");
  const unitFaction = entry.factionOverride ?? capturedOperator?.faction ?? unitMs.faction;

  return {
    id: `${side}-${index}-${makeId()}`,
    type: "mobileSuit",
    side,
    sortieNumber: index + 1,
    msId: entry.msId,
    faction: unitFaction,
    characterIds: [...entry.characterIds],
    optionIds,
    weaponIds,
    totalCost,
    runtimeWeapons,
    armor: maxArmor,
    energy: maxEnergy,
    maxArmor,
    maxEnergy,
    x,
    y,
    usedWeaponIds: [],
    weaponCharges: {},
    examAlwaysActive: entry.examAlwaysActive === true,
    examSystemActivated: entry.examAlwaysActive === true,
    examTurnsRemaining: entry.examAlwaysActive === true ? 1 : 0,
    disableCoreSystem: entry.disableCoreSystem === true,
    aiInactiveUntilTurn: Number.isFinite(Number(entry.aiInactiveUntilTurn))
      ? Math.max(1, Math.floor(Number(entry.aiInactiveUntilTurn)))
      : null,
    acted: false,
    moved: false
  };
}

function makeBattleship(battleshipId, crewIds, side, x, y, config = {}) {
  const { battleships } = lookup();
  const ship = battleships[battleshipId];
  const runtimeWeapons = runtimeWeaponsForIds(ship.weaponIds);

  return {
    id: `${side}-battleship-${makeId()}`,
    type: "battleship",
    side,
    battleshipId,
    characterIds: [...crewIds],
    faction: ship.faction,
    armor: ship.armor,
    maxArmor: ship.armor,
    energy: ship.energy,
    maxEnergy: ship.energy,
    x,
    y,
    mobilityOverride: Number.isFinite(Number(config.mobilityOverride))
      ? Math.max(0, Math.floor(Number(config.mobilityOverride)))
      : null,
    weaponIds: [...ship.weaponIds],
    runtimeWeapons,
    usedWeaponIds: [],
    acted: false,
    moved: false
  };
}

function makeDefenseTarget(config, index, x, y) {
  const armor = Math.max(1, Number(config.armor) || 300);
  return {
    id: `defense-target-${index + 1}-${makeId()}`,
    type: "defenseTarget",
    side: "player",
    name: config.name ?? `防衛対象${index + 1}`,
    armor,
    maxArmor: armor,
    mobility: Math.max(0, Number(config.mobility) || 0),
    x,
    y
  };
}

function makeDestructionTarget(config, index, x, y) {
  const armor = Math.max(1, Number(config.armor) || 220);
  return {
    id: `destruction-target-${index + 1}-${makeId()}`,
    type: "destructionTarget",
    side: "enemy",
    faction: config.faction ?? stageConfig(state.selectedMapId).enemyFaction ?? "federation",
    name: config.name ?? `破壊目標${index + 1}`,
    armor,
    maxArmor: armor,
    mobility: Math.max(0, Number(config.mobility) || 0),
    isRealObjective: config.isRealObjective !== false,
    objectiveRevealed: false,
    x,
    y
  };
}

function randomDestructionTargetIndexes(count, goal) {
  const indexes = Array.from({ length: count }, (_, index) => index);
  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [indexes[index], indexes[swapIndex]] = [indexes[swapIndex], indexes[index]];
  }
  return new Set(indexes.slice(0, goal));
}

function defaultDeploymentPosition(side, kind, index = 0, map = selectedMap()) {
  const width = boardWidth(map);
  const height = boardHeight(map);
  if (kind === "battleship" || kind === "escortBattleship") {
    const center = Math.floor(width / 2);
    const escortOffset = kind === "escortBattleship" ? (index % 2 === 0 ? -2 - Math.floor(index / 2) : 2 + Math.floor(index / 2)) : 0;
    return { x: clamp(center + escortOffset, 0, width - 1), y: side === "player" ? height - 1 : 0 };
  }
  const center = Math.floor(width / 2);
  const lanes = [center - 1, center + 1, center - 2, center + 2, center, center - 3, center + 3]
    .filter((x, laneIndex, values) => x >= 0 && x < width && values.indexOf(x) === laneIndex);
  const rowOffset = Math.floor(index / Math.max(1, lanes.length));
  return {
    x: lanes[index % Math.max(1, lanes.length)] ?? center,
    y: side === "player" ? Math.max(0, height - 2 - rowOffset) : Math.min(height - 1, 1 + rowOffset)
  };
}

function configuredDeploymentPosition(side, kind, index = 0, map = selectedMap()) {
  const sideConfig = map.deployment?.[side];
  const configured = kind === "battleship"
    ? sideConfig?.battleship
    : kind === "escortBattleship"
      ? sideConfig?.escortBattleships?.[index]
      : sideConfig?.units?.[index];
  return configured ? { x: configured.x, y: configured.y } : defaultDeploymentPosition(side, kind, index, map);
}

function nearestOpenDeploymentCell(origin, occupied, canStandAt, map = selectedMap()) {
  const cells = Array.from({ length: boardWidth(map) * boardHeight(map) }, (_, index) => ({
    x: index % boardWidth(map),
    y: Math.floor(index / boardWidth(map))
  }));
  return cells
    .filter((cell) => canStandAt(cell.x, cell.y) && !occupied.has(positionKey(cell.x, cell.y)))
    .sort((a, b) => distance(origin, a) - distance(origin, b))[0];
}

function reserveDeploymentCell(side, kind, index, occupied, card = null) {
  const map = selectedMap();
  const origin = configuredDeploymentPosition(side, kind, index, map);
  const validOrigin = inBounds(origin.x, origin.y, map) ? origin : defaultDeploymentPosition(side, kind, index, map);
  const canStandAt = (x, y) => cardCanStandAt(card, x, y, map);
  const key = positionKey(validOrigin.x, validOrigin.y);
  const cell = canStandAt(validOrigin.x, validOrigin.y) && !occupied.has(key)
    ? validOrigin
    : nearestOpenDeploymentCell(validOrigin, occupied, canStandAt, map);
  if (cell) occupied.add(positionKey(cell.x, cell.y));
  return cell ?? validOrigin;
}

function reserveDefenseTargetCell(config, index, occupied) {
  const map = selectedMap();
  const origin = { x: Number(config.x), y: Number(config.y) };
  const fallback = { x: Math.floor(boardWidth(map) / 2), y: Math.floor(boardHeight(map) / 2) };
  const validOrigin = inBounds(origin.x, origin.y, map) ? origin : fallback;
  const canStandAt = (x, y) => terrainWalkableAt(x, y);
  const key = positionKey(validOrigin.x, validOrigin.y);
  const cell = canStandAt(validOrigin.x, validOrigin.y) && !occupied.has(key)
    ? validOrigin
    : nearestOpenDeploymentCell(validOrigin, occupied, canStandAt, map);
  if (cell) occupied.add(positionKey(cell.x, cell.y));
  return cell ?? validOrigin;
}

function reinforcementSpawnCells(side, occupied, card = null, map = selectedMap()) {
  const center = Math.floor(boardWidth(map) / 2);
  const cells = Array.from({ length: boardWidth(map) * boardHeight(map) }, (_, index) => ({
    x: index % boardWidth(map),
    y: Math.floor(index / boardWidth(map))
  })).filter((cell) => cardCanStandAt(card, cell.x, cell.y, map) && !occupied.has(positionKey(cell.x, cell.y)));
  const zoneCells = cells.filter((cell) => deploymentZoneContains(side, cell.x, cell.y, map));
  const candidates = zoneCells.length > 0 ? zoneCells : cells;
  return candidates.sort((a, b) => {
    const yOrder = side === "enemy" ? a.y - b.y : b.y - a.y;
    if (yOrder !== 0) return yOrder;
    const centerOrder = Math.abs(a.x - center) - Math.abs(b.x - center);
    if (centerOrder !== 0) return centerOrder;
    return a.x - b.x;
  });
}

function spawnStageEnemyReinforcementsForTurn() {
  const config = stageEnemyReinforcements();
  if (!config || state.outcome) return 0;
  if (config.trigger === "enemyWipedOut") return 0;
  const turn = state.turnNumber;
  const startTurn = Math.max(1, Math.floor(Number(config.startTurn) || 2));
  const survivalLimit = stageSurvivalTurnLimit();
  const endTurn = Number.isFinite(Number(config.endTurn))
    ? Math.max(startTurn, Math.floor(Number(config.endTurn)))
    : (survivalLimit ?? startTurn);
  if (turn < startTurn || turn > endTurn) return 0;
  return spawnStageEnemyReinforcementWave(config);
}

function spawnStageEnemyReinforcementWave(config) {
  const entries = Array.isArray(config.entries) && config.entries.length > 0
    ? config.entries
    : (config.entry ? [config.entry] : []);
  const count = Math.max(0, Math.floor(Number(config.countPerTurn ?? config.count) || entries.length));
  const battleshipEntries = Array.isArray(config.battleships) ? config.battleships : [];
  if ((entries.length === 0 || count <= 0) && battleshipEntries.length === 0) return 0;

  const occupied = new Set(state.units.filter(isAlive).map((unit) => positionKey(unit.x, unit.y)));
  const spawned = [];
  for (let i = 0; i < count; i += 1) {
    const template = entries[i % entries.length];
    const ms = lookup().ms[template.msId];
    if (!ms) continue;
    const cell = reinforcementSpawnCells("enemy", occupied, ms)[0];
    if (!cell) break;
    occupied.add(positionKey(cell.x, cell.y));
    state.stageReinforcementSerial += 1;
    const unit = makeUnit({
      msId: template.msId,
      characterIds: [...(template.characterIds ?? [])],
      weaponIds: [...(template.weaponIds ?? [])],
      optionIds: [...(template.optionIds ?? [])],
      armorOverride: template.armorOverride,
      factionOverride: template.factionOverride,
      examAlwaysActive: template.examAlwaysActive === true,
      disableCoreSystem: template.disableCoreSystem === true
    }, "enemy", cell.x, cell.y, state.stageReinforcementSerial);
    unit.reinforcement = true;
    spawned.push(unit);
  }

  const spawnedBattleships = [];
  for (const template of battleshipEntries) {
    const ship = lookup().battleships[template.battleshipId];
    if (!ship) continue;
    const cell = reinforcementSpawnCells("enemy", occupied, ship)[0];
    if (!cell) continue;
    occupied.add(positionKey(cell.x, cell.y));
    const unit = makeBattleship(ship.id, [...(template.characterIds ?? [])], "enemy", cell.x, cell.y);
    unit.reinforcement = true;
    spawnedBattleships.push(unit);
  }

  if (spawned.length > 0 || spawnedBattleships.length > 0) {
    state.units.push(...spawned, ...spawnedBattleships);
    if (spawned.length > 0) {
      const name = lookup().ms[entries[0].msId]?.name ?? "敵";
      state.log.push(`増援: ${name}が${spawned.length}機出現。`);
    }
    if (spawnedBattleships.length > 0) state.log.push(`増援: ${spawnedBattleships.map((unit) => unitName(unit)).join("、")}が出現。`);
  } else {
    state.log.push("増援: 出現可能な空きマスがありません。");
  }
  return spawned.length + spawnedBattleships.length;
}

function spawnStageEnemyReinforcementsOnEnemyWipe() {
  const config = stageEnemyReinforcements();
  if (!config || config.trigger !== "enemyWipedOut" || state.outcome || state.stageReinforcementTriggerComplete) return 0;
  const initialEnemyAlive = state.units.some((unit) => unit.side === "enemy" && isCombatUnit(unit) && isAlive(unit) && !unit.reinforcement);
  if (initialEnemyAlive) return 0;
  state.stageReinforcementTriggerComplete = true;
  const spawned = spawnStageEnemyReinforcementWave(config);
  if (spawned > 0) state.log.push("初期配備部隊の全滅を検知。新たな敵影が戦場へ突入しました。");
  return spawned;
}

function deploymentRows(side, map = selectedMap()) {
  return Math.max(1, Number(map.deploymentZone?.[side]?.rows) || 3);
}

function deploymentZoneContains(side, x, y, map = selectedMap()) {
  if (!inBounds(x, y, map)) return false;
  const rows = Math.min(boardHeight(map), deploymentRows(side, map));
  return side === "player" ? y >= boardHeight(map) - rows : y < rows;
}

function canDeployUnitTo(unit, x, y) {
  if (!isCombatUnit(unit) || unit.side !== "player") return false;
  const occupiedByOther = state.units.some((candidate) =>
    candidate.id !== unit.id && candidate.x === x && candidate.y === y && isAlive(candidate)
  );
  return deploymentZoneContains("player", x, y)
    && unitCanStandAt(unit, x, y)
    && !occupiedByOther;
}

function deploymentCellsFor(unit) {
  if (!isCombatUnit(unit)) return new Set();
  const width = boardWidth();
  const height = boardHeight();
  return new Set(Array.from({ length: width * height }, (_, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    return canDeployUnitTo(unit, x, y) ? positionKey(x, y) : null;
  }).filter(Boolean));
}

function moveDeploymentUnit(unit, x, y) {
  if (state.outcome || state.phase !== "deployment") return;
  if (!canDeployUnitTo(unit, x, y)) return;
  unit.x = x;
  unit.y = y;
  state.log.push(`${unitName(unit)}の出撃位置を変更。`);
  renderBattle();
}

function finishDeployment() {
  if (state.outcome || state.phase !== "deployment") return;
  applyPreBattleSkillEffects();
  tickTurnStartEffects("player");
  state.turnNumber = 1;
  state.phase = "player";
  state.battleGrowthEligible = true;
  state.selectedUnitId = state.units.find((unit) => unit.side === "player" && isCombatUnit(unit))?.id ?? null;
  state.selectedTargetId = null;
  state.log.push("配置完了。自軍ターン開始。");
  renderBattle();
}

function phaseName() {
  if (state.outcome) return state.outcome;
  if (state.phase === "deployment") return "配置フェイズ";
  if (state.phase === "player") return "自軍ターン";
  return "敵軍ターン";
}

function playerCharacterIdsForGrowth() {
  return [
    state.selectedCaptainId,
    state.selectedFirstOfficerId,
    ...state.formation.flatMap((entry) => entry.characterIds ?? [])
  ].filter(Boolean);
}

function launchBattle() {
  if (state.screen === "battle") return;
  if (isFreeBattle() && !freeBattleMapAvailable(selectedMap())) {
    state.log.push("このマップは、対応するステージの初回クリア後にフリー対戦で解放されます。");
    renderFreeBattleSelect();
    return;
  }
  const cap = isFreeBattle() ? null : stageCostCap(state.selectedMapId);
  if (!isFreeBattle() && currentCost() > cap) {
    state.log.push(`総コストが上限を超えています（${currentCost()} / ${cap}）。`);
    renderSetup();
    return;
  }
  if (!state.formation.every((entry) => formationEntryCanDeployOnMap(entry, selectedMap()))) {
    state.log.push("空中出撃条件を満たしていない機体が編成に含まれています。");
    renderSetup();
    return;
  }
  if (isFreeBattle()) prepareFreeBattleEnemy();
  const enemyFaction = enemyFactionForCurrentBattle();
  const enemyEntries = buildEnemyFormation(enemyFaction);
  if (!enemyEntries.every((entry) => formationEntryCanDeployOnMap(entry, selectedMap()))) {
    state.log.push("敵編成に、このマップへ出撃できない機体が含まれています。");
    renderSetup();
    return;
  }
  const enemyBattleship = enemyBattleshipForCurrentBattle(state.selectedMapId);
  const enemyEscortBattleships = stageEnemyEscortBattleshipIds()
    .map((id) => lookup().battleships[id])
    .filter((ship) => ship?.faction === enemyFaction && battleshipCanDeployOnMap(ship, selectedMap()));
  const occupied = new Set();
  const playerShip = lookup().battleships[state.selectedBattleshipId];
  const playerShipPosition = reserveDeploymentCell("player", "battleship", 0, occupied, playerShip);
  const enemyShipPosition = enemyBattleship ? reserveDeploymentCell("enemy", "battleship", 0, occupied, enemyBattleship) : null;
  const enemyEscortShipPositions = enemyEscortBattleships.map((ship, index) =>
    reserveDeploymentCell("enemy", "escortBattleship", index, occupied, ship)
  );
  const playerUnits = state.formation.map((entry, index) => {
    const position = reserveDeploymentCell("player", "unit", index, occupied, lookup().ms[entry.msId]);
    return makeUnit(entry, "player", position.x, position.y, index);
  });
  const enemyUnits = enemyEntries.map((entry, index) => {
    const position = reserveDeploymentCell("enemy", "unit", index, occupied, lookup().ms[entry.msId]);
    return makeUnit(entry, "enemy", position.x, position.y, index);
  });
  const enemyBridge = enemyBattleship ? enemyBridgeForCurrentBattle(state.selectedMapId, enemyFaction) : {};
  const enemyCrewIds = [enemyBridge.captainId, enemyBridge.firstOfficerId].filter(Boolean);
  const battleships = [
    makeBattleship(state.selectedBattleshipId, [state.selectedCaptainId, state.selectedFirstOfficerId].filter(Boolean), "player", playerShipPosition.x, playerShipPosition.y)
  ];
  if (enemyBattleship && enemyShipPosition) {
    battleships.push(makeBattleship(enemyBattleship.id, enemyCrewIds, "enemy", enemyShipPosition.x, enemyShipPosition.y, {
      mobilityOverride: stageConfig(state.selectedMapId).enemyBattleshipMobilityOverride
    }));
  }
  enemyEscortBattleships.forEach((ship, index) => {
    const position = enemyEscortShipPositions[index];
    if (position) battleships.push(makeBattleship(ship.id, [], "enemy", position.x, position.y));
  });
  const defenseTargets = stageDefenseTargets().map((target, index) => {
    const position = reserveDefenseTargetCell(target, index, occupied);
    return makeDefenseTarget(target, index, position.x, position.y);
  });
  const destructionTargetConfigs = stageDestructionTargets();
  const randomDestructionTargetGoal = stageRandomDestructionTargetGoal();
  const realDestructionTargetIndexes = randomDestructionTargetGoal === null
    ? null
    : randomDestructionTargetIndexes(destructionTargetConfigs.length, randomDestructionTargetGoal);
  const destructionTargets = destructionTargetConfigs.map((target, index) => {
    const position = reserveDefenseTargetCell(target, index, occupied);
    return makeDestructionTarget({
      ...target,
      isRealObjective: realDestructionTargetIndexes === null || realDestructionTargetIndexes.has(index)
    }, index, position.x, position.y);
  });

  state.units = [...battleships, ...playerUnits, ...defenseTargets, ...destructionTargets, ...enemyUnits];
  state.phase = "deployment";
  state.outcome = null;
  state.outcomeMessage = "";
  state.turnNumber = 1;
  state.selectedUnitId = battleships.find((unit) => unit.side === "player")?.id ?? playerUnits[0]?.id ?? null;
  state.selectedTargetId = null;
  state.enemyQueue = [];
  state.mines = stageInitialMines().map((mine) => ({
    id: makeId(),
    side: mine.side === "player" ? "player" : "enemy",
    x: mine.x,
    y: mine.y,
    damage: Math.max(1, Math.floor(Number(mine.damage) || 35))
  }));
  state.sacrificialBoostSides = {};
  state.stageReinforcementSerial = 0;
  state.stageReinforcementTriggerComplete = false;
  state.battleGrowthEligible = false;
  state.battleGrowthAwarded = false;
  state.battleGrowthCharacterIds = playerCharacterIdsForGrowth();
  state.resultRewards = [];
  state.log = [`${factionName(state.faction)}部隊、出撃。敵は${factionName(enemyFaction)}です。`];
  if (isFreeBattle()) {
    state.log.push(`フリー対戦: 自軍${currentCost()} / 敵${state.freeBattleEnemy?.actualCost ?? freeBattleEnemyCost(state.freeBattleEnemy)}のランダム編成です。`);
  }
  state.log.push(`${selectedMap().name}で配置フェイズ開始。手前${deploymentRows("player")}列に自軍を配置できます。`);
  renderBattle();
}

function safeLaunchBattle() {
  try {
    launchBattle();
  } catch (error) {
    console.error(error);
    phaseLabel.textContent = "出撃エラー";
    state.log.push(`出撃準備でエラー: ${error.message}`);
  }
}

window.safeLaunchBattle = safeLaunchBattle;
