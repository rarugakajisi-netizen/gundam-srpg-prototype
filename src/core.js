"use strict";

// Core constants, state, persistence, rewards, and formation restoration.

const DEFAULT_BOARD_WIDTH = 8;
const DEFAULT_BOARD_HEIGHT = 6;
const HIT_RATE_BONUS = 8;
const MIN_HIT_RATE = 15;
const MIN_REPEAT_ATTACK_HIT_RATE = 6;
const MAX_HIT_RATE = 92;
const BATTLESHIP_HIT_PENALTY = 10;
const COST_CAP_MARGIN_RATE = 0.15;
const COST_CAP_MIN_MARGIN = 80;
const NO_ENEMY_BATTLESHIP_COST_BONUS = 100;
const AI_KILL_BONUS = 130;
const AI_BATTLESHIP_TARGET_BONUS = 85;
const AI_ATTACK_POSITION_BONUS = 180;
const I_FIELD_EN_COST = 30;
const FREEZY_YARD_TURNS = 2;
const FREEZY_YARD_REDUCTION = 45;
const MOBILE_DIVER_TURNS = 5;
const REPEAT_ATTACK_ACCURACY_PENALTY = 20;
const REPEAT_ATTACK_MIN_HIT_PENALTY = 3;
const EDUCATIONAL_COMPUTER_ACCURACY_CAP = 9;
const EDUCATIONAL_COMPUTER_EVASION_CAP = 6;
const HARO_EVASION_BONUS = 4;
const HADES_ACCURACY_BONUS = 12;
const HADES_EVASION_BONUS = 12;
const HADES_DAMAGE_BONUS = 10;
const HADES_OVERHEAT_ARMOR_LOSS_RATE = 0.67;
const LIMITED_SYSTEM_OVERHEAT_ARMOR_LOSS_RATE = 0.67;
const LIMITED_SYSTEMS = {
  zeusSystem: {
    name: "ZEUS",
    turnsProp: "zeusTurnsRemaining",
    activatedProp: "zeusSystemActivated",
    overheatedProp: "zeusSystemOverheated",
    accuracyBonus: 14,
    damageBonus: 12,
    attackType: "shooting"
  },
  areusSystem: {
    name: "AREUS",
    turnsProp: "areusTurnsRemaining",
    activatedProp: "areusSystemActivated",
    overheatedProp: "areusSystemOverheated",
    accuracyBonus: 14,
    damageBonus: 12,
    attackType: "melee"
  },
  themisSystem: {
    name: "THEMIS",
    turnsProp: "themisTurnsRemaining",
    activatedProp: "themisSystemActivated",
    overheatedProp: "themisSystemOverheated",
    evasionBonus: 14,
    damageBonus: 8
  }
};
const GUERRILLA_TERRAINS = new Set(["desert", "forest", "water", "debris"]);
const SAVE_KEY = "gundamSrpgPrototypeSaveV1";
const FAVORITE_FORMATION_SLOTS = 20;
const CHARACTER_GROWTH_STAT_CAP = 30;
const CHARACTER_GROWTH_SORTIES_PER_POINT = 20;
const CHARACTER_GROWTH_STATS = ["shooting", "melee", "reaction", "command", "support", "maintenance"];
const CHARACTER_GROWTH_STAT_LABELS = {
  shooting: "射撃",
  melee: "格闘",
  reaction: "反応",
  command: "指揮",
  support: "通信",
  maintenance: "整備"
};
const setupScreen = document.querySelector("#setupScreen");
const battleScreen = document.querySelector("#battleScreen");
const phaseLabel = document.querySelector("#phaseLabel");

const state = {
  data: null,
  screen: "title",
  collection: null,
  formationProfiles: {},
  favoriteFormations: [],
  selectedFavoriteSlot: 0,
  picker: null,
  battleMode: "campaign",
  freeBattleEnemy: null,
  faction: "federation",
  formation: [],
  selectedMapId: "",
  selectedBattleshipId: "",
  selectedCaptainId: "",
  selectedFirstOfficerId: "",
  selectedMsId: "",
  selectedCharacterId: "",
  selectedWeaponIds: [],
  selectedOptionId: "",
  units: [],
  phase: "setup",
  outcome: null,
  outcomeMessage: "",
  turnNumber: 1,
  selectedUnitId: null,
  selectedTargetId: null,
  enemyQueue: [],
  mines: [],
  sacrificialBoostSides: {},
  stageReinforcementSerial: 0,
  stageReinforcementTriggerComplete: false,
  battleGrowthEligible: false,
  battleGrowthAwarded: false,
  battleGrowthCharacterIds: [],
  log: [],
  resultRewards: [],
  revealAllCards: false,
  libraryFilter: {
    query: "",
    type: "mobileSuits",
    faction: "all",
    ownership: "owned",
    sort: "name"
  },
  stageFilter: {
    query: "",
    series: "all",
    status: "all",
    terrain: "all",
    enemyFaction: "all",
    sort: "story"
  },
  freeBattleFilter: {
    query: "",
    series: "all",
    terrain: "all",
    playable: "all",
    sort: "story"
  },
  choiceFilter: {
    query: "",
    type: "all",
    faction: "all",
    sort: "costDesc"
  },
  pickerFilter: {
    query: "",
    sort: "costAsc"
  }
};

const byId = (items) => Object.fromEntries(items.map((item) => [item.id, item]));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const escapeAttr = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");
const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const isAlive = (unit) => Boolean(unit) && unit.armor > 0;
const isBattleship = (unit) => unit?.type === "battleship";
const isDefenseTarget = (unit) => unit?.type === "defenseTarget";
const isDestructionTarget = (unit) => unit?.type === "destructionTarget";
const isMobileSuit = (unit) => unit?.type === "mobileSuit";
const isCombatUnit = (unit) => isAlive(unit) && (isMobileSuit(unit) || isBattleship(unit));
const isAttackTarget = (unit) => isCombatUnit(unit) || (isAlive(unit) && (isDefenseTarget(unit) || isDestructionTarget(unit)));
const isMovableUnit = (unit) => isCombatUnit(unit) || (isAlive(unit) && (isDefenseTarget(unit) || isDestructionTarget(unit)) && (unit.mobility ?? 0) > 0);
const makeId = () => Math.random().toString(36).slice(2, 8);
const COUNTED_CARD_TYPES = new Set(["mobileSuits", "weapons", "options"]);
const COMMON_DROP_CATEGORIES = ["mobileSuits", "characters", "weapons", "options", "battleships"];
const DEFAULT_COMMON_DROP_CATEGORY_WEIGHTS = {
  mobileSuits: 45,
  characters: 25,
  weapons: 15,
  options: 10,
  battleships: 5
};
const DEFAULT_COMMON_DROP_OWNERSHIP_BIAS = {
  newCard: 3,
  ownedFew: 1.5,
  ownedMany: 0.5
};
const NO_CHARACTER = {
  id: "",
  name: "未配置",
  characterKey: "",
  faction: "",
  cost: 0,
  shooting: 0,
  melee: 0,
  reaction: 0,
  awakening: 0,
  command: 0,
  support: 0,
  maintenance: 0,
  roles: ["pilot"],
  specials: []
};

function otherFaction(faction) {
  return faction === "federation" ? "zeon" : "federation";
}

function factionName(faction) {
  return state.data.factions[faction];
}

function cardUsableByFaction(card, faction) {
  if (Array.isArray(card.factions)) return card.factions.includes(faction);
  if (card.faction) return card.faction === faction;
  return true;
}

function cardUsableOnMap(card, map = selectedMap()) {
  if (!Array.isArray(card?.mapTypes) || card.mapTypes.length === 0) return true;
  const deployTypes = mapDeployTypes(map);
  return card.mapTypes.some((type) => deployTypes.includes(type));
}

function optionUsableByFaction(option, faction) {
  return cardUsableByFaction(option, faction);
}

function optionUsableOnMap(option, map = selectedMap()) {
  return cardUsableOnMap(option, map);
}

function optionEquippableByMs(option, ms, map = selectedMap(), faction = ms?.faction) {
  if (option?.grantsSkill === "examSystem" && (ms?.specials ?? []).includes("hadesSystem")) return false;
  if (Number.isFinite(Number(option?.maxMsCost)) && Number(ms?.cost) > Number(option.maxMsCost)) return false;
  return Boolean(option)
    && Boolean(ms)
    && optionUsableByFaction(option, faction)
    && optionUsableOnMap(option, map);
}

function characterUsableByFaction(character, faction) {
  return cardUsableByFaction(character, faction);
}

function characterCanPilotMobileSuit(character, ms, faction) {
  if (!character || !ms || !characterUsableByFaction(character, faction)) return false;
  if (cardUsableByFaction(ms, faction)) return true;
  return faction === "federation"
    && ms.faction === "zeon"
    && (character.specials ?? []).includes("capturedOperation");
}

function mobileSuitUsableByFaction(ms, faction) {
  if (!ms) return false;
  if (cardUsableByFaction(ms, faction)) return true;
  if (faction !== "federation" || ms.faction !== "zeon" || !state.data?.characters) return false;
  return state.data.characters.some((character) =>
    characterSelectable(character)
    && hasCard("characters", character.id)
    && characterCanPilotMobileSuit(character, ms, faction)
  );
}

function characterSelectable(character) {
  return character?.selectable !== false;
}

function mobileSuitPilotSlots(ms) {
  if (!ms) return 1;
  return Math.max(0, Math.floor(Number(ms.pilotSlots ?? 1) || 0));
}

function mobileSuitCanHavePilot(ms) {
  return mobileSuitPilotSlots(ms) > 0;
}

function lookup() {
  return {
    ms: byId(state.data.mobileSuits),
    weapons: byId(state.data.weapons),
    characters: byId(state.data.characters),
    maps: byId(state.data.maps),
    battleships: byId(state.data.battleships),
    options: byId(state.data.options ?? [])
  };
}

function isCountedCardType(type) {
  return COUNTED_CARD_TYPES.has(type);
}

function normalizeCountMap(value) {
  if (Array.isArray(value)) {
    return value.reduce((counts, id) => {
      if (id) counts[id] = (counts[id] ?? 0) + 1;
      return counts;
    }, {});
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value)
      .map(([id, count]) => [id, Math.max(0, Number(count) || 0)])
      .filter(([, count]) => count > 0));
  }
  return {};
}

function normalizeCharacterGrowth(value) {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(Object.entries(value)
    .map(([id, rawRecord]) => {
      const record = rawRecord && typeof rawRecord === "object" ? rawRecord : {};
      const rawBonuses = record.bonuses && typeof record.bonuses === "object" ? record.bonuses : {};
      const bonuses = {};
      for (const stat of CHARACTER_GROWTH_STATS) {
        const bonus = Math.max(0, Math.floor(Number(rawBonuses[stat]) || 0));
        if (bonus > 0) bonuses[stat] = bonus;
      }
      return [id, {
        sorties: Math.max(0, Math.floor(Number(record.sorties) || 0)),
        unspent: Math.max(0, Math.floor(Number(record.unspent) || 0)),
        bonuses
      }];
    })
    .filter(([id]) => Boolean(id)));
}

function countedCardIds(type) {
  return Object.keys(normalizeCountMap(state.collection?.[type]));
}

function cardCount(type, id) {
  if (!id) return 0;
  if (isCountedCardType(type)) return normalizeCountMap(state.collection?.[type])[id] ?? 0;
  return (state.collection?.[type] ?? []).includes(id) ? 1 : 0;
}

function ownedUniqueCount(type) {
  if (isCountedCardType(type)) return countedCardIds(type).length;
  return state.collection?.[type]?.length ?? 0;
}

function ownedTotalCount(type) {
  if (!isCountedCardType(type)) return ownedUniqueCount(type);
  return Object.values(normalizeCountMap(state.collection?.[type])).reduce((sum, count) => sum + count, 0);
}

function cloneCollection(collection) {
  return {
    mobileSuits: normalizeCountMap(collection?.mobileSuits),
    battleships: [...(collection?.battleships ?? [])],
    weapons: normalizeCountMap(collection?.weapons),
    characters: [...(collection?.characters ?? [])],
    options: normalizeCountMap(collection?.options),
    clearedStages: [...(collection?.clearedStages ?? [])],
    choiceTickets: Math.max(0, Number(collection?.choiceTickets) || 0),
    characterGrowth: normalizeCharacterGrowth(collection?.characterGrowth)
  };
}

function defaultCollection() {
  return cloneCollection(state.data.campaign?.initialCollection);
}

function mergeInitialCollection(collection) {
  const merged = cloneCollection(collection);
  const initial = defaultCollection();
  for (const type of ["battleships", "characters"]) {
    for (const id of initial[type] ?? []) {
      if (!merged[type].includes(id)) merged[type].push(id);
    }
  }
  for (const type of ["mobileSuits", "weapons", "options"]) {
    merged[type] = normalizeCountMap(merged[type]);
    const initialCounts = normalizeCountMap(initial[type]);
    for (const [id, count] of Object.entries(initialCounts)) {
      merged[type][id] = Math.max(merged[type][id] ?? 0, count);
    }
  }
  return merged;
}

function clampCountedCollection(collection) {
  const clamped = cloneCollection(collection);
  for (const type of ["mobileSuits", "weapons", "options"]) {
    const limit = countedCardLimit(type);
    clamped[type] = Object.fromEntries(Object.entries(normalizeCountMap(clamped[type]))
      .map(([id, count]) => [id, Math.min(limit, count)]));
  }
  const validMapIds = new Set(state.data.maps.map((map) => map.id));
  clamped.clearedStages = clamped.clearedStages.filter((mapId) => validMapIds.has(mapId));
  return clamped;
}

function loadCollection() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (saved?.collection) return clampCountedCollection(mergeInitialCollection(saved.collection));
  } catch (error) {
    console.warn("Save data could not be loaded.", error);
  }
  return clampCountedCollection(defaultCollection());
}

function saveCollection() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    collection: state.collection,
    formationProfiles: state.formationProfiles,
    favoriteFormations: state.favoriteFormations
  }));
}

function loadFormationProfiles() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    return saved?.formationProfiles && typeof saved.formationProfiles === "object"
      ? saved.formationProfiles
      : {};
  } catch (error) {
    console.warn("Formation data could not be loaded.", error);
    return {};
  }
}

function loadFavoriteFormations() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    return Array.isArray(saved?.favoriteFormations)
      ? saved.favoriteFormations.slice(0, FAVORITE_FORMATION_SLOTS)
      : [];
  } catch (error) {
    console.warn("Favorite formation data could not be loaded.", error);
    return [];
  }
}

function currentFormationSnapshot() {
  return {
    faction: state.faction,
    battleshipId: state.selectedBattleshipId,
    captainId: state.selectedCaptainId,
    firstOfficerId: state.selectedFirstOfficerId,
    units: state.formation.map((entry) => ({
      msId: entry.msId,
      characterIds: [...(entry.characterIds ?? [])],
      weaponIds: [...(entry.weaponIds ?? [])],
      optionIds: [...(entry.optionIds ?? [])]
    }))
  };
}

function rememberFormation() {
  state.formationProfiles[state.faction] = currentFormationSnapshot();
  saveCollection();
}

function resetCollection() {
  state.collection = defaultCollection();
  state.selectedMapId = state.data.maps[0].id;
  state.formation = [];
  state.formationProfiles = {};
  state.favoriteFormations = [];
  state.selectedFavoriteSlot = 0;
  saveCollection();
  initializeSelections();
  applyStarterFormation();
}

function hasCard(type, id) {
  return cardCount(type, id) > 0;
}

function emptyCharacterGrowthRecord() {
  return { sorties: 0, unspent: 0, bonuses: {} };
}

function characterGrowthRecordForView(characterId) {
  return state.collection?.characterGrowth?.[characterId] ?? emptyCharacterGrowthRecord();
}

function characterGrowthRecord(characterId) {
  if (!state.collection.characterGrowth) state.collection.characterGrowth = {};
  if (!state.collection.characterGrowth[characterId]) {
    state.collection.characterGrowth[characterId] = emptyCharacterGrowthRecord();
  }
  if (!state.collection.characterGrowth[characterId].bonuses) {
    state.collection.characterGrowth[characterId].bonuses = {};
  }
  return state.collection.characterGrowth[characterId];
}

function characterGrowthSpent(record) {
  return CHARACTER_GROWTH_STATS.reduce((sum, stat) => sum + Math.max(0, Number(record.bonuses?.[stat]) || 0), 0);
}

function characterGrowthEarned(record) {
  return Math.floor(Math.max(0, Number(record.sorties) || 0) / CHARACTER_GROWTH_SORTIES_PER_POINT);
}

function characterGrowthProgress(record) {
  return Math.max(0, Number(record.sorties) || 0) % CHARACTER_GROWTH_SORTIES_PER_POINT;
}

function characterStatGrowthBonus(character, stat) {
  if (!character?.id || !CHARACTER_GROWTH_STATS.includes(stat)) return 0;
  const rawBonus = Math.max(0, Number(state.collection?.characterGrowth?.[character.id]?.bonuses?.[stat]) || 0);
  const baseValue = Math.max(0, Number(character[stat]) || 0);
  return Math.min(rawBonus, Math.max(0, CHARACTER_GROWTH_STAT_CAP - baseValue));
}

function characterEffectiveStat(character, stat) {
  if (!character || !CHARACTER_GROWTH_STATS.includes(stat)) return Number(character?.[stat]) || 0;
  return Math.min(CHARACTER_GROWTH_STAT_CAP, (Number(character[stat]) || 0) + characterStatGrowthBonus(character, stat));
}

function characterWithGrowth(character) {
  if (!character?.id) return character ?? NO_CHARACTER;
  const grown = { ...character };
  for (const stat of CHARACTER_GROWTH_STATS) {
    grown[stat] = characterEffectiveStat(character, stat);
  }
  return grown;
}

function canGrowCharacterStat(character, stat) {
  return Boolean(character?.id)
    && CHARACTER_GROWTH_STATS.includes(stat)
    && characterEffectiveStat(character, stat) < CHARACTER_GROWTH_STAT_CAP;
}

function spendCharacterGrowthPoint(characterId, stat) {
  const character = lookup().characters[characterId];
  if (!character || !hasCard("characters", characterId) || !canGrowCharacterStat(character, stat)) return false;
  const record = characterGrowthRecord(characterId);
  if ((record.unspent ?? 0) < 1) return false;
  record.unspent -= 1;
  record.bonuses[stat] = Math.max(0, Number(record.bonuses[stat]) || 0) + 1;
  saveCollection();
  return true;
}

function recordCharacterSorties(characterIds) {
  const gained = [];
  let changed = false;
  for (const characterId of new Set((characterIds ?? []).filter(Boolean))) {
    const character = lookup().characters[characterId];
    if (!character || !hasCard("characters", characterId) || !characterSelectable(character)) continue;
    const record = characterGrowthRecord(characterId);
    const beforeUnspent = record.unspent ?? 0;
    record.sorties = Math.max(0, Number(record.sorties) || 0) + 1;
    const earned = characterGrowthEarned(record);
    const allocated = characterGrowthSpent(record) + (record.unspent ?? 0);
    if (earned > allocated) record.unspent += earned - allocated;
    if ((record.unspent ?? 0) > beforeUnspent) {
      gained.push({ character, points: (record.unspent ?? 0) - beforeUnspent });
    }
    changed = true;
  }
  if (changed) saveCollection();
  return gained;
}

function unlockCard(reward) {
  const count = Math.max(1, Number(reward.count) || 1);
  if (!state.collection[reward.type]) state.collection[reward.type] = [];
  if (isCountedCardType(reward.type)) {
    state.collection[reward.type] = normalizeCountMap(state.collection[reward.type]);
    const previous = state.collection[reward.type][reward.id] ?? 0;
    state.collection[reward.type][reward.id] = Math.min(countedCardLimit(reward.type), previous + count);
    return previous === 0;
  }
  if (state.collection[reward.type].includes(reward.id)) return false;
  state.collection[reward.type].push(reward.id);
  return true;
}

function cardTypeLabel(type) {
  return {
    mobileSuits: "機体",
    battleships: "戦艦",
    weapons: "武器",
    characters: "キャラ",
    options: "オプション",
    choiceTicket: "カード引換券"
  }[type] ?? type;
}

function cardName(type, id) {
  const { ms, weapons, characters, battleships, options } = lookup();
  return {
    mobileSuits: ms[id]?.name,
    battleships: battleships[id]?.name,
    weapons: weapons[id]?.name,
    characters: characters[id]?.name,
    options: options[id]?.name
  }[type] ?? id;
}

function stageConfig(mapId) {
  return state.data.campaign?.stages?.find((stage) => stage.mapId === mapId) ?? { mapId };
}

function isFreeBattle() {
  return state.battleMode === "free";
}

function stageTurnLimit(mapId = state.selectedMapId) {
  if (isFreeBattle()) return null;
  const limit = Number(stageConfig(mapId).turnLimit);
  return Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : null;
}

function stageSurvivalTurnLimit(mapId = state.selectedMapId) {
  if (isFreeBattle()) return null;
  const limit = Number(stageConfig(mapId).surviveTurns);
  return Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : null;
}

function stageEnemyReinforcements(mapId = state.selectedMapId) {
  if (isFreeBattle()) return null;
  const config = stageConfig(mapId).enemyReinforcements;
  return config && typeof config === "object" ? config : null;
}

function stageEnemyReinforcementsPending(mapId = state.selectedMapId) {
  const config = stageEnemyReinforcements(mapId);
  if (!config) return false;
  if (config.trigger === "enemyWipedOut") return !state.stageReinforcementTriggerComplete;
  const startTurn = Math.max(1, Math.floor(Number(config.startTurn) || 2));
  const endTurn = Number.isFinite(Number(config.endTurn))
    ? Math.max(startTurn, Math.floor(Number(config.endTurn)))
    : startTurn;
  return state.turnNumber < endTurn;
}

function stageDefenseTargets(mapId = state.selectedMapId) {
  if (isFreeBattle()) return [];
  return Array.isArray(stageConfig(mapId).defenseTargets) ? stageConfig(mapId).defenseTargets : [];
}

function stageDestructionTargets(mapId = state.selectedMapId) {
  if (isFreeBattle()) return [];
  return Array.isArray(stageConfig(mapId).destructionTargets) ? stageConfig(mapId).destructionTargets : [];
}

function stageEnemyEscortBattleshipIds(mapId = state.selectedMapId) {
  if (isFreeBattle()) return [];
  const ids = stageConfig(mapId).enemyEscortBattleshipIds;
  return Array.isArray(ids) ? ids.filter((id) => typeof id === "string" && id) : [];
}

function stageInfiltrationTargets(mapId = state.selectedMapId) {
  if (isFreeBattle()) return [];
  const targets = stageConfig(mapId).infiltrationTargets;
  return Array.isArray(targets)
    ? targets.filter((target) => Number.isInteger(target?.x) && Number.isInteger(target?.y))
    : [];
}

function unitReachedInfiltrationTarget(unit) {
  if (!unit || unit.side !== "enemy" || !isMobileSuit(unit) || !isAlive(unit)) return false;
  return stageInfiltrationTargets().some((target) => target.x === unit.x && target.y === unit.y);
}

function commonDropConfig() {
  const config = state.data.campaign?.commonDropRewards ?? {};
  return {
    rolls: Math.max(0, Number(config.rolls) || 3),
    copyLimit: Math.max(1, Number(config.copyLimit) || 4),
    categoryWeights: normalizeDropWeights(config.categoryWeights, DEFAULT_COMMON_DROP_CATEGORY_WEIGHTS),
    ownershipBias: normalizeDropWeights(config.ownershipBias, DEFAULT_COMMON_DROP_OWNERSHIP_BIAS)
  };
}

function normalizeDropWeights(config, defaults) {
  return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => {
    const value = Number(config?.[key]);
    return [key, value > 0 ? value : fallback];
  }));
}

function choiceRewardConfig() {
  const config = state.data.campaign?.choiceRewards ?? {};
  return {
    firstClearTickets: Math.max(0, Number(config.firstClearTickets) || 0),
    repeatClearChance: clamp(Number(config.repeatClearChance) || 0, 0, 1),
    repeatClearTickets: Math.max(0, Number(config.repeatClearTickets) || 0)
  };
}

function choiceTicketCount() {
  return Math.max(0, Number(state.collection?.choiceTickets) || 0);
}

function stageEnemyFaction(mapId = state.selectedMapId) {
  return stageConfig(mapId).enemyFaction ?? otherFaction(state.faction);
}

function stageCleared(mapId) {
  return (state.collection?.clearedStages ?? []).includes(mapId);
}

function commonDropRolls() {
  return commonDropConfig().rolls;
}

function countedCardLimit(type) {
  return isCountedCardType(type) ? commonDropConfig().copyLimit : 1;
}

function rewardPoolItem(type, item) {
  return {
    type,
    id: item.id,
    weight: commonDropItemWeight(type, item.id),
    count: isCountedCardType(type) ? 1 : undefined
  };
}

function commonDropEntriesByCategory() {
  const limit = commonDropConfig().copyLimit;
  return {
    mobileSuits: state.data.mobileSuits
      .filter((item) => cardCount("mobileSuits", item.id) < limit)
      .map((item) => rewardPoolItem("mobileSuits", item)),
    battleships: state.data.battleships
      .filter((item) => item.selectable !== false && !hasCard("battleships", item.id))
      .map((item) => rewardPoolItem("battleships", item)),
    weapons: state.data.weapons
      .filter((item) => !item.fixedOnly && cardCount("weapons", item.id) < limit)
      .map((item) => rewardPoolItem("weapons", item)),
    options: (state.data.options ?? [])
      .filter((item) => cardCount("options", item.id) < limit)
      .map((item) => rewardPoolItem("options", item)),
    characters: state.data.characters
      .filter((item) => item.selectable !== false && !hasCard("characters", item.id))
      .map((item) => rewardPoolItem("characters", item))
  };
}

function commonDropEntries() {
  const entriesByCategory = commonDropEntriesByCategory();
  return COMMON_DROP_CATEGORIES.flatMap((type) => entriesByCategory[type] ?? []);
}

function commonDropItemWeight(type, id) {
  const { copyLimit, ownershipBias } = commonDropConfig();
  if (!isCountedCardType(type)) return ownershipBias.newCard;
  const count = cardCount(type, id);
  if (count <= 0) return ownershipBias.newCard;
  if (count < Math.ceil(copyLimit / 2)) return ownershipBias.ownedFew;
  return ownershipBias.ownedMany;
}

function commonDropCategoryEntries() {
  const entriesByCategory = commonDropEntriesByCategory();
  const { categoryWeights } = commonDropConfig();
  return COMMON_DROP_CATEGORIES
    .map((type) => ({
      type,
      weight: categoryWeights[type],
      entries: entriesByCategory[type] ?? []
    }))
    .filter((category) => category.entries.length > 0 && (Number(category.weight) || 0) > 0);
}

function pickCommonDropReward() {
  const category = weightedRewardPick(commonDropCategoryEntries());
  if (!category) return null;
  return weightedRewardPick(category.entries);
}

function weightedRewardPick(entries) {
  const weighted = entries.filter((entry) => (Number(entry.weight) || 0) > 0);
  if (weighted.length === 0) return null;
  const total = weighted.reduce((sum, entry) => sum + Number(entry.weight), 0);
  let roll = Math.random() * total;
  for (const entry of weighted) {
    roll -= Number(entry.weight);
    if (roll <= 0) return entry;
  }
  return weighted[weighted.length - 1];
}

function choiceCandidateEntries() {
  const limit = commonDropConfig().copyLimit;
  return [
    ...state.data.mobileSuits
      .filter((item) => cardCount("mobileSuits", item.id) < limit)
      .map((item) => ({ type: "mobileSuits", item })),
    ...state.data.battleships
      .filter((item) => item.selectable !== false && !hasCard("battleships", item.id))
      .map((item) => ({ type: "battleships", item })),
    ...state.data.weapons
      .filter((item) => !item.fixedOnly && cardCount("weapons", item.id) < limit)
      .map((item) => ({ type: "weapons", item })),
    ...(state.data.options ?? [])
      .filter((item) => cardCount("options", item.id) < limit)
      .map((item) => ({ type: "options", item })),
    ...state.data.characters
      .filter((item) => item.selectable !== false && !hasCard("characters", item.id))
      .map((item) => ({ type: "characters", item }))
  ];
}

function rollChoiceTickets(wasCleared) {
  if (choiceCandidateEntries().length === 0) return 0;
  const config = choiceRewardConfig();
  if (!wasCleared) return config.firstClearTickets;
  if (config.repeatClearTickets > 0 && Math.random() < config.repeatClearChance) return config.repeatClearTickets;
  return 0;
}

function claimStageRewards(mapId) {
  if (!state.collection) return [];
  const wasCleared = stageCleared(mapId);
  const rewards = claimCommonDropRewards(commonDropRolls());
  const ticketCount = rollChoiceTickets(wasCleared);
  if (ticketCount > 0) {
    state.collection.choiceTickets = choiceTicketCount() + ticketCount;
    rewards.push({
      type: "choiceTicket",
      id: "choiceTicket",
      name: "カード引換券",
      count: ticketCount,
      newlyOwned: true
    });
  }
  if (!wasCleared) state.collection.clearedStages.push(mapId);
  saveCollection();
  return rewards;
}

function claimCommonDropRewards(rolls) {
  if (!state.collection) return [];
  const rewards = [];
  for (let index = 0; index < Math.max(0, Number(rolls) || 0); index += 1) {
    const reward = pickCommonDropReward();
    if (!reward) break;
    const claimed = {
      ...reward,
      count: Math.max(1, Number(reward.count) || 1),
      name: cardName(reward.type, reward.id)
    };
    claimed.newlyOwned = unlockCard(claimed);
    rewards.push(claimed);
  }
  return rewards;
}

function claimFreeBattleRewards() {
  const rewards = claimCommonDropRewards(1);
  saveCollection();
  return rewards;
}

async function boot() {
  state.data = window.GAME_DATA;
  if (!state.data) {
    setupScreen.innerHTML = `<section class="panel"><h2>データ読み込み失敗</h2><p>data/game-data.js が見つかりません。</p></section>`;
    return;
  }
  state.collection = loadCollection();
  state.formationProfiles = loadFormationProfiles();
  state.favoriteFormations = loadFavoriteFormations();
  initializeSelections();
  if (!restoreRememberedFormation()) applyStarterFormation();
  renderTitle();
}

function defaultLoadout(ms) {
  const candidates = state.data.weapons.filter((weapon) => remainingCardCopies("weapons", weapon.id) > 0 && weaponEquippableByMs(ms, weapon));
  const shield = candidates.find((weapon) => weapon.kind === "shield");
  const attack = candidates.find((weapon) => weapon.kind !== "shield");
  return fitWeaponIdsToSlots([attack, shield].filter(Boolean).map((weapon) => weapon.id), ms);
}

function weaponSlotCount(ms) {
  return ms.weaponSlots ?? 2;
}

function weaponSlotCost(weaponOrId) {
  const weapon = typeof weaponOrId === "string" ? lookup().weapons[weaponOrId] : weaponOrId;
  if (!weapon || weapon.fixedOnly) return 0;
  return Math.max(1, weapon.slotCost ?? 1);
}

function selectedWeaponSlotCost(ids) {
  return ids.reduce((sum, id) => sum + weaponSlotCost(id), 0);
}

function fitWeaponIdsToSlots(ids, ms) {
  const maxSlots = weaponSlotCount(ms);
  const fitted = [];
  let usedSlots = 0;
  for (const id of ids) {
    const cost = weaponSlotCost(id);
    if (usedSlots + cost <= maxSlots) {
      fitted.push(id);
      usedSlots += cost;
    }
  }
  return fitted;
}

function usedCountInFormation(type, id) {
  if (!id || !isCountedCardType(type)) return 0;
  if (type === "mobileSuits") return state.formation.filter((entry) => entry.msId === id).length;
  const key = type === "weapons" ? "weaponIds" : "optionIds";
  return state.formation.reduce((sum, entry) => sum + (entry[key] ?? []).filter((itemId) => itemId === id).length, 0);
}

function remainingCardCopies(type, id) {
  if (!isCountedCardType(type)) return hasCard(type, id) ? 1 : 0;
  return Math.max(0, cardCount(type, id) - usedCountInFormation(type, id));
}

function selectionWithinOwnedCounts(type, ids) {
  if (!isCountedCardType(type)) return true;
  const counts = ids.reduce((memo, id) => {
    memo[id] = (memo[id] ?? 0) + 1;
    return memo;
  }, {});
  return Object.entries(counts).every(([id, count]) => cardCount(type, id) >= usedCountInFormation(type, id) + count);
}

function playableFactions() {
  return Object.keys(state.data.factions).filter((faction) => {
    const hasShip = state.data.battleships.some((ship) => ship.faction === faction && hasCard("battleships", ship.id));
    const hasMs = state.data.mobileSuits.some((ms) => mobileSuitUsableByFaction(ms, faction) && hasCard("mobileSuits", ms.id));
    const hasCharacter = state.data.characters.some((character) => characterSelectable(character) && characterUsableByFaction(character, faction) && hasCard("characters", character.id));
    return hasShip && hasMs && hasCharacter;
  });
}

function playableFactionsOnMap(map = selectedMap()) {
  return playableFactions().filter((faction) => {
    const hasShip = state.data.battleships.some((ship) => ship.faction === faction && hasCard("battleships", ship.id) && battleshipCanDeployOnMap(ship, map));
    const hasMs = state.data.mobileSuits.some((ms) => mobileSuitUsableByFaction(ms, faction) && hasCard("mobileSuits", ms.id) && mobileSuitCanPotentiallyDeployOnMap(ms, map, faction));
    return hasShip && hasMs;
  });
}

function initializeSelections() {
  state.selectedMapId = state.selectedMapId || state.data.maps[0].id;
  const currentMap = selectedMap();
  const mapFactions = playableFactionsOnMap(currentMap);
  const initialFaction = state.data.campaign?.initialFaction ?? "federation";
  state.faction = mapFactions.includes(state.faction)
    ? state.faction
    : mapFactions.includes(initialFaction) ? initialFaction : mapFactions[0] ?? initialFaction;
  const factionBattleship = state.data.battleships.find((ship) => ship.faction === state.faction && hasCard("battleships", ship.id) && battleshipCanDeployOnMap(ship, currentMap));
  const factionMs = state.data.mobileSuits.find((ms) => mobileSuitUsableByFaction(ms, state.faction) && hasCard("mobileSuits", ms.id) && mobileSuitCanPotentiallyDeployOnMap(ms, currentMap, state.faction));
  const factionCharacter = state.data.characters.find((character) => characterSelectable(character) && characterUsableByFaction(character, state.faction) && hasCard("characters", character.id));
  state.selectedBattleshipId = factionBattleship?.id ?? "";
  const bridge = defaultBridgeSelection(state.faction);
  state.selectedCaptainId = bridge.captainId;
  state.selectedFirstOfficerId = bridge.firstOfficerId;
  state.selectedMsId = factionMs?.id ?? "";
  state.selectedCharacterId = mobileSuitCanHavePilot(factionMs) ? (firstAvailableCharacter(state.faction)?.id ?? factionCharacter?.id ?? "") : "";
  state.selectedWeaponIds = factionMs ? defaultLoadout(factionMs) : [];
  state.selectedOptionId = "";
}

function starterFormationForFaction(faction) {
  return state.data.campaign?.starterFormations?.[faction]
    ?? (state.data.campaign?.initialFaction === faction ? state.data.campaign?.starterFormation : null);
}

function canReserveCountedCards(entry, reserved) {
  const nextReserved = { ...reserved };
  if (entry.msId) {
    const key = `mobileSuits:${entry.msId}`;
    const next = (nextReserved[key] ?? 0) + 1;
    if (next > cardCount("mobileSuits", entry.msId)) return false;
    nextReserved[key] = next;
  }
  for (const id of entry.weaponIds ?? []) {
    const key = `weapons:${id}`;
    const next = (nextReserved[key] ?? 0) + 1;
    if (next > cardCount("weapons", id)) return false;
    nextReserved[key] = next;
  }
  for (const id of entry.optionIds ?? []) {
    const key = `options:${id}`;
    const next = (nextReserved[key] ?? 0) + 1;
    if (next > cardCount("options", id)) return false;
    nextReserved[key] = next;
  }
  Object.assign(reserved, nextReserved);
  return true;
}

function applyStarterFormation() {
  const starter = starterFormationForFaction(state.faction);
  if (!starter || state.formation.length > 0) return;
  const map = selectedMap();
  if (hasCard("battleships", starter.battleshipId) && battleshipCanDeployOnMap(lookup().battleships[starter.battleshipId], map)) {
    state.selectedBattleshipId = starter.battleshipId;
  }
  state.selectedCaptainId = hasCard("characters", starter.captainId) ? starter.captainId : "";
  state.selectedFirstOfficerId = hasCard("characters", starter.firstOfficerId) ? starter.firstOfficerId : "";
  const reserved = {};
  state.formation = starter.units
    .filter((entry) => {
      const ms = lookup().ms[entry.msId];
      const characterIds = mobileSuitCanHavePilot(ms) ? (entry.characterIds ?? []).slice(0, mobileSuitPilotSlots(ms)) : [];
      const valid = hasCard("mobileSuits", entry.msId)
        && mobileSuitCanDeployOnMap(ms, map, entry.optionIds ?? [])
        && characterIds.every((id) => hasCard("characters", id))
        && entry.weaponIds.every((id) => hasCard("weapons", id))
        && (entry.optionIds ?? []).every((id) => hasCard("options", id) && optionEquippableByMs(lookup().options[id], ms, map, state.faction));
      return valid && canReserveCountedCards({ ...entry, characterIds }, reserved);
    })
    .map((entry) => ({
      msId: entry.msId,
      characterIds: mobileSuitCanHavePilot(lookup().ms[entry.msId]) ? [...(entry.characterIds ?? []).slice(0, mobileSuitPilotSlots(lookup().ms[entry.msId]))] : [],
      weaponIds: [...entry.weaponIds],
      optionIds: [...(entry.optionIds ?? [])]
    }));
}

function restoreRememberedFormation() {
  if (!Object.prototype.hasOwnProperty.call(state.formationProfiles, state.faction)) return false;
  restoreFormationSnapshot(state.formationProfiles[state.faction] ?? {});
  return true;
}

function restoreFormationSnapshot(profile) {
  const map = selectedMap();
  const data = lookup();
  const usedCharacters = new Set();

  const ship = data.battleships[profile.battleshipId];
  if (ship && hasCard("battleships", ship.id) && ship.faction === state.faction && battleshipCanDeployOnMap(ship, map)) {
    state.selectedBattleshipId = ship.id;
  }

  const restoreBridgeCharacter = (id) => {
    const character = data.characters[id];
    if (!character || !characterSelectable(character) || !characterUsableByFaction(character, state.faction) || !hasCard("characters", id) || usedCharacters.has(id)) return "";
    usedCharacters.add(id);
    return id;
  };
  state.selectedCaptainId = restoreBridgeCharacter(profile.captainId);
  state.selectedFirstOfficerId = restoreBridgeCharacter(profile.firstOfficerId);

  const reserved = {};
  state.formation = (Array.isArray(profile.units) ? profile.units : []).flatMap((entry) => {
    const ms = data.ms[entry?.msId];
    const rawCharacterIds = Array.isArray(entry?.characterIds) ? entry.characterIds : [];
    const characterIds = mobileSuitCanHavePilot(ms) ? rawCharacterIds.slice(0, mobileSuitPilotSlots(ms)) : [];
    const weaponIds = Array.isArray(entry?.weaponIds) ? entry.weaponIds : [];
    const optionIds = Array.isArray(entry?.optionIds) ? entry.optionIds : [];
    const charactersValid = characterIds.every((id) => data.characters[id]
      && characterSelectable(data.characters[id])
      && characterCanPilotMobileSuit(data.characters[id], ms, state.faction)
      && hasCard("characters", id)
      && !usedCharacters.has(id));
    const weaponsValid = Boolean(ms) && weaponIds.every((id) => data.weapons[id]
      && hasCard("weapons", id)
      && weaponEquippableByMs(ms, data.weapons[id]));
    const optionsValid = optionIds.every((id) => data.options[id]
      && hasCard("options", id)
      && optionEquippableByMs(data.options[id], ms, map, state.faction));
    const restored = { msId: entry?.msId, characterIds, weaponIds, optionIds };
    const valid = ms
      && mobileSuitUsableByFaction(ms, state.faction)
      && hasCard("mobileSuits", ms.id)
      && mobileSuitCanDeployOnMap(ms, map, optionIds)
      && charactersValid
      && weaponsValid
      && optionsValid
      && selectedWeaponSlotCost(weaponIds) <= weaponSlotCount(ms)
      && canReserveCountedCards(restored, reserved);
    if (!valid) return [];
    characterIds.forEach((id) => usedCharacters.add(id));
    return [restored];
  });
}

function selectedFavoriteFormation() {
  return state.favoriteFormations[state.selectedFavoriteSlot] ?? null;
}

function saveFavoriteFormation() {
  const nameInput = setupScreen.querySelector("#favoriteFormationName");
  const fallbackName = `お気に入り${String(state.selectedFavoriteSlot + 1).padStart(2, "0")}`;
  const name = String(nameInput?.value ?? "").trim().slice(0, 30) || fallbackName;
  state.favoriteFormations[state.selectedFavoriteSlot] = {
    ...currentFormationSnapshot(),
    name
  };
  saveCollection();
  renderSetup();
}

function loadFavoriteFormation() {
  const favorite = selectedFavoriteFormation();
  if (!favorite || !playableFactionsOnMap().includes(favorite.faction)) return;
  state.faction = favorite.faction;
  state.formation = [];
  initializeSelections();
  restoreFormationSnapshot(favorite);
  rememberFormation();
  renderSetup();
}

function deleteFavoriteFormation() {
  if (!selectedFavoriteFormation()) return;
  state.favoriteFormations[state.selectedFavoriteSlot] = null;
  saveCollection();
  renderSetup();
}

