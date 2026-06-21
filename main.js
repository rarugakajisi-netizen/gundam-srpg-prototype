const DEFAULT_BOARD_WIDTH = 8;
const DEFAULT_BOARD_HEIGHT = 6;
const HIT_RATE_BONUS = 8;
const MIN_HIT_RATE = 15;
const MAX_HIT_RATE = 92;
const BATTLESHIP_HIT_PENALTY = 10;
const COST_CAP_MARGIN_RATE = 0.15;
const COST_CAP_MIN_MARGIN = 80;
const AI_KILL_BONUS = 130;
const AI_BATTLESHIP_TARGET_BONUS = 85;
const AI_ATTACK_POSITION_BONUS = 180;
const AI_SUPPORT_POSITION_BONUS = 70;
const I_FIELD_EN_COST = 12;
const FREEZY_YARD_TURNS = 2;
const FREEZY_YARD_REDUCTION = 45;
const SAVE_KEY = "gundamSrpgPrototypeSaveV1";
const setupScreen = document.querySelector("#setupScreen");
const battleScreen = document.querySelector("#battleScreen");
const phaseLabel = document.querySelector("#phaseLabel");

const state = {
  data: null,
  screen: "title",
  collection: null,
  picker: null,
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
  selectedUnitId: null,
  selectedTargetId: null,
  enemyQueue: [],
  mines: [],
  sacrificialBoostSides: {},
  log: [],
  resultRewards: [],
  revealAllCards: false,
  libraryFilter: {
    query: "",
    type: "all",
    faction: "all",
    ownership: "all",
    sort: "name"
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
const isMobileSuit = (unit) => unit?.type === "mobileSuit";
const isCombatUnit = (unit) => isAlive(unit) && (isMobileSuit(unit) || isBattleship(unit));
const makeId = () => Math.random().toString(36).slice(2, 8);
const COUNTED_CARD_TYPES = new Set(["mobileSuits", "weapons", "options"]);
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
    choiceTickets: Math.max(0, Number(collection?.choiceTickets) || 0)
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
  localStorage.setItem(SAVE_KEY, JSON.stringify({ collection: state.collection }));
}

function resetCollection() {
  state.collection = defaultCollection();
  state.selectedMapId = state.data.maps[0].id;
  state.formation = [];
  saveCollection();
  initializeSelections();
  applyStarterFormation();
}

function hasCard(type, id) {
  return cardCount(type, id) > 0;
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
  return state.data.campaign?.stages?.find((stage) => stage.mapId === mapId) ?? { mapId, dropRewards: { rolls: 0, entries: [] } };
}

function commonDropConfig() {
  return {
    rolls: Math.max(0, Number(state.data.campaign?.commonDropRewards?.rolls) || 3),
    copyLimit: Math.max(1, Number(state.data.campaign?.commonDropRewards?.copyLimit) || 4)
  };
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

function stageDropEntries(stage) {
  return commonDropEntries();
}

function stageDropRolls(stage) {
  return commonDropConfig().rolls;
}

function countedCardLimit(type) {
  return isCountedCardType(type) ? commonDropConfig().copyLimit : 1;
}

function rewardPoolItem(type, item) {
  return {
    type,
    id: item.id,
    weight: 1,
    count: isCountedCardType(type) ? 1 : undefined
  };
}

function commonDropEntries() {
  const limit = commonDropConfig().copyLimit;
  const entries = [
    ...state.data.mobileSuits
      .filter((item) => cardCount("mobileSuits", item.id) < limit)
      .map((item) => rewardPoolItem("mobileSuits", item)),
    ...state.data.battleships
      .filter((item) => item.selectable !== false && !hasCard("battleships", item.id))
      .map((item) => rewardPoolItem("battleships", item)),
    ...state.data.weapons
      .filter((item) => !item.fixedOnly && cardCount("weapons", item.id) < limit)
      .map((item) => rewardPoolItem("weapons", item)),
    ...(state.data.options ?? [])
      .filter((item) => cardCount("options", item.id) < limit)
      .map((item) => rewardPoolItem("options", item)),
    ...state.data.characters
      .filter((item) => item.selectable !== false && !hasCard("characters", item.id))
      .map((item) => rewardPoolItem("characters", item))
  ];
  return entries;
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
  const stage = stageConfig(mapId);
  const rewards = [];
  for (let index = 0; index < stageDropRolls(stage); index += 1) {
    const reward = weightedRewardPick(commonDropEntries());
    if (!reward) break;
    const claimed = {
      ...reward,
      count: Math.max(1, Number(reward.count) || 1),
      name: cardName(reward.type, reward.id)
    };
    claimed.newlyOwned = unlockCard(claimed);
    rewards.push(claimed);
  }
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

async function boot() {
  state.data = window.GAME_DATA;
  if (!state.data) {
    setupScreen.innerHTML = `<section class="panel"><h2>データ読み込み失敗</h2><p>data/game-data.js が見つかりません。</p></section>`;
    return;
  }
  state.collection = loadCollection();
  initializeSelections();
  applyStarterFormation();
  renderTitle();
}

function defaultLoadout(ms) {
  const candidates = state.data.weapons.filter((weapon) => remainingCardCopies("weapons", weapon.id) > 0 && !weapon.fixedOnly && weaponUsableByFaction(weapon, ms.faction));
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

function selectedCount(ids, id) {
  return ids.filter((itemId) => itemId === id).length;
}

function canSelectCountedCard(type, id, selectedIds = []) {
  if (!isCountedCardType(type)) return hasCard(type, id);
  return cardCount(type, id) > usedCountInFormation(type, id) + selectedCount(selectedIds, id);
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
    const hasMs = state.data.mobileSuits.some((ms) => ms.faction === faction && hasCard("mobileSuits", ms.id));
    const hasCharacter = state.data.characters.some((character) => character.faction === faction && hasCard("characters", character.id));
    return hasShip && hasMs && hasCharacter;
  });
}

function playableFactionsOnMap(map = selectedMap()) {
  return playableFactions().filter((faction) => {
    const hasShip = state.data.battleships.some((ship) => ship.faction === faction && hasCard("battleships", ship.id) && battleshipCanDeployOnMap(ship, map));
    const hasMs = state.data.mobileSuits.some((ms) => ms.faction === faction && hasCard("mobileSuits", ms.id) && mobileSuitCanDeployOnMap(ms, map));
    return hasShip && hasMs;
  });
}

function initializeSelections() {
  state.selectedMapId = state.selectedMapId || state.data.maps[0].id;
  const mapFactions = playableFactionsOnMap(selectedMap());
  const initialFaction = state.data.campaign?.initialFaction ?? "federation";
  state.faction = mapFactions.includes(state.faction)
    ? state.faction
    : mapFactions.includes(initialFaction) ? initialFaction : mapFactions[0] ?? initialFaction;
  const factionBattleship = state.data.battleships.find((ship) => ship.faction === state.faction && hasCard("battleships", ship.id) && battleshipCanDeployOnMap(ship));
  const factionMs = state.data.mobileSuits.find((ms) => ms.faction === state.faction && hasCard("mobileSuits", ms.id) && mobileSuitCanDeployOnMap(ms));
  const factionCharacter = state.data.characters.find((character) => character.faction === state.faction && hasCard("characters", character.id));
  state.selectedBattleshipId = factionBattleship?.id ?? "";
  const bridge = defaultBridgeSelection(state.faction);
  state.selectedCaptainId = bridge.captainId;
  state.selectedFirstOfficerId = bridge.firstOfficerId;
  state.selectedMsId = factionMs?.id ?? "";
  state.selectedCharacterId = firstAvailableCharacter(state.faction)?.id ?? factionCharacter?.id ?? "";
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
      const valid = hasCard("mobileSuits", entry.msId)
        && mobileSuitCanDeployOnMap(ms, map)
        && entry.characterIds.every((id) => hasCard("characters", id))
        && entry.weaponIds.every((id) => hasCard("weapons", id))
        && (entry.optionIds ?? []).every((id) => hasCard("options", id));
      return valid && canReserveCountedCards(entry, reserved);
    })
    .map((entry) => ({
      msId: entry.msId,
      characterIds: [...entry.characterIds],
      weaponIds: [...entry.weaponIds],
      optionIds: [...(entry.optionIds ?? [])]
    }));
}

const roleLabels = {
  pilot: "パイロット",
  captain: "艦長",
  operator: "オペレーター",
  mechanic: "メカニック",
  commander: "指揮官"
};

function labelsFor(ids, labels) {
  return ids?.length ? ids.map((id) => labels[id] ?? id).join(" / ") : "なし";
}

function characterRolesLabel(character) {
  return labelsFor(character.roles ?? ["pilot"], roleLabels);
}

function specialsLabel(specials) {
  return (specials ?? []).length ? specials.map((id) => skillName(id)).join(" / ") : "なし";
}

function skillDefinition(skillId) {
  const dataSkill = state.data?.skills?.find((skill) => skill.id === skillId);
  return dataSkill ?? {
    name: skillId,
    type: "未分類",
    timing: "未設定",
    effect: "スキル説明が未設定です。",
    implemented: false
  };
}

function skillName(skillId) {
  return skillDefinition(skillId).name;
}

function uniqueSkillIds(skillIds) {
  return [...new Set((skillIds ?? []).filter(Boolean))];
}

function renderSkillDetails(skillIds) {
  const ids = uniqueSkillIds(skillIds);
  if (ids.length === 0) return `<p class="small">スキルなし</p>`;
  return `<div class="skill-detail-list">${ids.map((id) => {
    const skill = skillDefinition(id);
    return `
      <article class="skill-detail-card">
        <div class="skill-detail-head">
          <strong>${skill.name}</strong>
          <span class="status-pill ${skill.implemented ? "ready" : ""}">${skill.implemented ? "反映済" : "表示のみ"}</span>
        </div>
        ${statItems([
          ["分類", skill.type],
          ["発動", skill.timing]
        ])}
        <p class="small">${skill.effect}</p>
      </article>
    `;
  }).join("")}</div>`;
}

function characterMsContributionText(character) {
  const shooting = character.shooting;
  const melee = character.melee;
  const evasion = character.reaction + Math.floor(character.awakening / 2);
  const ace = character.specials.includes("ace") ? " / 与ダメージ+10" : "";
  return `射撃命中+${shooting} / 格闘命中+${melee} / 回避+${evasion}${ace}`;
}

function characterBridgeContributionText(character) {
  const captainAim = Math.floor(character.command / 2);
  const captainEvasion = Math.floor(character.command / 4);
  const captainArmorRepair = Math.floor(character.command / 4);
  const captainShieldRepair = Math.floor(character.command / 8);
  const crewAim = Math.floor(character.support / 2);
  const crewEvasion = Math.floor(character.support / 4);
  const crewArmorRepair = character.maintenance;
  const crewShieldRepair = Math.floor(character.maintenance / 2);
  return `艦長時: 命中+${captainAim} / 回避+${captainEvasion} / 装甲修理+${captainArmorRepair} / 盾修理+${captainShieldRepair}　副長時: 命中+${crewAim} / 回避+${crewEvasion} / 装甲修理+${crewArmorRepair} / 盾修理+${crewShieldRepair}`;
}

function weaponUsableByFaction(weapon, faction) {
  return !weapon.factions || weapon.factions.includes(faction);
}

function optionUsableByFaction(option, faction) {
  return !option.factions || option.factions.includes(faction);
}

function weaponEquippableByMs(ms, weapon, optionId = "") {
  return !weapon.fixedOnly && weaponUsableByFaction(weapon, ms.faction);
}

function weaponMinRange(weapon) {
  return weapon.minRange ?? 1;
}

function weaponMaxRange(unit, weapon) {
  const bonus = isMobileSuit(unit) && weapon.attackType === "shooting" && unitHasSkill(unit, "longRangeScope") ? 1 : 0;
  return weapon.range + bonus;
}

function weaponRangeLabel(weapon) {
  if (weapon.kind === "shield" && !weaponCanAttack(weapon)) return "射程なし";
  const min = weaponMinRange(weapon);
  return min === weapon.range ? `射程${weapon.range}` : `射程${min}-${weapon.range}`;
}

function weaponConsumptionLabel(weapon) {
  if (weapon.kind === "beam" || weapon.kind === "special") return `EN${weapon.consume}`;
  if (weapon.kind === "ammo") return `弾${weapon.consume}`;
  return "なし";
}

function unitWeaponRangeLabel(unit, weapon) {
  if (weapon.kind === "shield" && !weaponCanAttack(weapon)) return "射程なし";
  const min = weaponMinRange(weapon);
  const max = weaponMaxRange(unit, weapon);
  return min === max ? `射程${max}` : `射程${min}-${max}`;
}

function weaponInRange(attacker, defender, weapon) {
  return weaponReachableByRange(attacker, defender, weapon) && !weaponBlockedByObstacle(attacker, defender, weapon);
}

function selectedMap() {
  return lookup().maps[state.selectedMapId] ?? state.data.maps[0];
}

function boardWidth(map = selectedMap()) {
  return map.width ?? DEFAULT_BOARD_WIDTH;
}

function boardHeight(map = selectedMap()) {
  return map.height ?? DEFAULT_BOARD_HEIGHT;
}

function inBounds(x, y, map = selectedMap()) {
  return x >= 0 && x < boardWidth(map) && y >= 0 && y < boardHeight(map);
}

function mapTypeName(type) {
  if (type === "space") return "宇宙";
  if (type === "colony") return "コロニー";
  return "地上";
}

function mapDeployTypes(map) {
  if (map.type === "colony") return ["ground", "space"];
  return [map.type];
}

function terrainLabel(terrain) {
  return {
    plain: "平地",
    forest: "森林",
    desert: "砂漠",
    water: "水中",
    space: "宇宙",
    debris: "デブリ帯",
    obstacle: "障害物",
    cliff: "崖",
    rock: "岩場",
    building: "建築物",
    green: "緑地",
    base: "基地施設",
    gate: "コロニー出入口",
    wreckage: "残骸",
    urban: "荒廃市街",
    domeRuin: "ドーム状廃施設",
    ruin: "廃ビル"
  }[terrain] ?? terrain;
}

function terrainShortLabel(terrain) {
  return {
    forest: "森",
    desert: "砂",
    water: "水",
    debris: "デ",
    obstacle: "障",
    cliff: "崖",
    rock: "岩",
    building: "建",
    gate: "門",
    wreckage: "残",
    domeRuin: "ド",
    ruin: "廃"
  }[terrain] ?? "";
}

function terrainAt(x, y) {
  return terrainAtOnMap(selectedMap(), x, y);
}

function terrainAtOnMap(map, x, y) {
  return map.terrain[y * boardWidth(map) + x] ?? (map.type === "space" ? "space" : "plain");
}

function terrainNeedsSuitability(terrain) {
  return ["water", "forest", "desert", "debris"].includes(terrain);
}

function terrainBlocksMovement(terrain) {
  return ["obstacle", "cliff", "rock", "building", "wreckage", "domeRuin", "ruin"].includes(terrain);
}

function terrainBlocksLineOfSight(terrain) {
  return ["obstacle", "cliff", "rock", "building", "wreckage", "domeRuin", "ruin"].includes(terrain);
}

function terrainWalkableAt(x, y) {
  return !terrainBlocksMovement(terrainAt(x, y));
}

function movementTypeCanStandOnTerrain(movementType, terrain) {
  if (terrainBlocksMovement(terrain)) return false;
  if (movementType === "submarine") return terrain === "water";
  return true;
}

function cardCanStandAt(card, x, y, map = selectedMap()) {
  const movementType = card?.movementType ?? "normal";
  return movementTypeCanStandOnTerrain(movementType, terrainAtOnMap(map, x, y));
}

function unitCanStandAt(unit, x, y, map = selectedMap()) {
  const card = isBattleship(unit) ? battleshipFor(unit) : isMobileSuit(unit) ? msFor(unit) : null;
  return cardCanStandAt(card, x, y, map);
}

function mapHasStandableCell(card, map = selectedMap()) {
  return Array.from({ length: boardWidth(map) * boardHeight(map) }, (_, index) => ({
    x: index % boardWidth(map),
    y: Math.floor(index / boardWidth(map))
  })).some((cell) => cardCanStandAt(card, cell.x, cell.y, map));
}

function positionKey(x, y) {
  return `${x},${y}`;
}

function occupiedAt(x, y, ignoreUnitId = null) {
  return state.units.some((unit) => unit.id !== ignoreUnitId && unit.x === x && unit.y === y && isAlive(unit));
}

function reachableCells(unit) {
  if (!isCombatUnit(unit)) return new Set();
  const maxSteps = mobilityFor(unit);
  const visited = new Map([[positionKey(unit.x, unit.y), 0]]);
  const queue = [{ x: unit.x, y: unit.y, steps: 0 }];

  while (queue.length > 0) {
    const current = queue.shift();
    const nextSteps = current.steps + 1;
    if (nextSteps > maxSteps) continue;
    for (const next of [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 }
    ]) {
      if (!inBounds(next.x, next.y)) continue;
      if (!unitCanStandAt(unit, next.x, next.y) || occupiedAt(next.x, next.y, unit.id)) continue;
      const key = positionKey(next.x, next.y);
      if (visited.has(key) && visited.get(key) <= nextSteps) continue;
      visited.set(key, nextSteps);
      queue.push({ ...next, steps: nextSteps });
    }
  }

  visited.delete(positionKey(unit.x, unit.y));
  return new Set(visited.keys());
}

function canMoveTo(unit, x, y) {
  return reachableCells(unit).has(positionKey(x, y));
}

function lineCellsBetween(a, b) {
  const cells = [];
  let x0 = a.x;
  let y0 = a.y;
  const x1 = b.x;
  const y1 = b.y;
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (x0 !== x1 || y0 !== y1) {
    const e2 = err * 2;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
    if (x0 !== x1 || y0 !== y1) cells.push({ x: x0, y: y0 });
  }
  return cells;
}

function lineOfSightBlocked(attacker, defender) {
  return lineCellsBetween(attacker, defender).some((cell) => terrainBlocksLineOfSight(terrainAt(cell.x, cell.y)));
}

function weaponReachableByRange(attacker, defender, weapon) {
  if (weapon.cannotTargetFlying && isMobileSuit(defender) && msFor(defender).movementType === "flying") return false;
  if (weapon.attackType === "shooting" && unitIsConcealedFrom(defender, attacker)) return false;
  const range = distance(attacker, defender);
  return range >= weaponMinRange(weapon) && range <= weaponMaxRange(attacker, weapon);
}

function weaponBlockedByObstacle(attacker, defender, weapon) {
  return !weapon.ignoresObstacles && lineOfSightBlocked(attacker, defender);
}

function mobileSuitCanDeployOnMap(ms, map = selectedMap()) {
  const deployTypes = mapDeployTypes(map);
  return (ms.mapTypes ?? ["ground", "space"]).some((type) => deployTypes.includes(type))
    && mapHasStandableCell(ms, map);
}

function battleshipCanDeployOnMap(ship, map = selectedMap()) {
  const deployTypes = mapDeployTypes(map);
  return ship.selectable !== false
    && (ship.mapTypes ?? ["ground", "space"]).some((type) => deployTypes.includes(type))
    && mapHasStandableCell(ship, map);
}

function mobileSuitTerrainSuitability(ms, terrain) {
  if (ms.movementType === "submarine") return terrain === "water";
  if (!terrainNeedsSuitability(terrain)) return true;
  return Boolean(ms.terrainSuitability?.[terrain]);
}

function mobileSuitIgnoresGroundTerrain(ms, map = selectedMap()) {
  return (map.type === "ground" || map.type === "colony") && ms.movementType === "flying";
}

function unitIsSubmerged(unit) {
  if (terrainAt(unit.x, unit.y) !== "water") return false;
  if (isMobileSuit(unit)) return true;
  return isBattleship(unit) && battleshipFor(unit).movementType === "submarine";
}

function unitOptionIds(unit) {
  return unit.optionIds ?? [];
}

function optionFor(id) {
  return lookup().options[id];
}

function unitOptions(unit) {
  return unitOptionIds(unit).map((id) => optionFor(id)).filter(Boolean);
}

function unitSpecials(unit) {
  if (isBattleship(unit)) return battleshipCrew(unit).flatMap((character) => character.specials ?? []);
  if (!isMobileSuit(unit)) return [];
  return [
    ...(msFor(unit).specials ?? []),
    ...(primaryCharacterFor(unit).specials ?? []),
    ...unitOptions(unit).map((option) => option.grantsSkill).filter(Boolean)
  ];
}

function unitHasSkill(unit, skillId) {
  return unitSpecials(unit).includes(skillId);
}

function unitIsConcealedFrom(defender, attacker) {
  if (!isMobileSuit(defender)) return false;
  if (unitHasSkill(attacker, "recon")) return false;
  const nearbyScout = state.units.some((unit) => unit.side === attacker.side && isCombatUnit(unit) && distance(unit, defender) <= 2);
  const smokeConcealed = (defender.smokeConcealedTurns ?? 0) > 0;
  const stealthConcealed = unitHasSkill(defender, "stealth") && !defender.stealthRevealed && distance(defender, attacker) > 2 && !nearbyScout;
  const guerrillaConcealed = unitHasSkill(defender, "guerrillaTactics") && distance(defender, attacker) > 2 && !nearbyScout;
  return smokeConcealed || stealthConcealed || guerrillaConcealed;
}

function revealStealth(unit, reason = "") {
  if (!isMobileSuit(unit) || !unitHasSkill(unit, "stealth") || unit.stealthRevealed) return;
  unit.stealthRevealed = true;
  state.log.push(`${unitName(unit)}のステルスが解除された${reason ? `（${reason}）` : ""}。`);
}

function alliedMobileSuitDestroyed(side) {
  return state.units.some((unit) => unit.side === side && isMobileSuit(unit) && unit.armor <= 0);
}

function sacrificialBoostActive(side) {
  return Boolean(state.sacrificialBoostSides?.[side]);
}

function triggerSacrificialBoost(unit) {
  if (!isMobileSuit(unit) || unit.sacrificialBoostTriggered || !unitHasSkill(unit, "sacrificialBoost")) return;
  if (!state.sacrificialBoostSides) state.sacrificialBoostSides = {};
  unit.sacrificialBoostTriggered = true;
  state.sacrificialBoostSides[unit.side] = true;
  const character = primaryCharacterFor(unit);
  state.log.push(`${character.name}の「命を賭して……」。味方全体の攻撃力が上がった。`);
}

function alliedMobileSuits(unit) {
  return state.units.filter((other) => other.id !== unit.id && other.side === unit.side && isMobileSuit(other) && isAlive(other));
}

function hasMatchingMassProductionAlly(unit) {
  if (!isMobileSuit(unit)) return false;
  return alliedMobileSuits(unit).some((other) => other.msId === unit.msId && distance(other, unit) <= 3);
}

function hasMassProductionFormationCommand(unit) {
  if (!isMobileSuit(unit)) return false;
  if (unitHasSkill(unit, "massProductionFormation")) return true;
  return state.units.some((other) =>
    other.side === unit.side
    && isBattleship(other)
    && isAlive(other)
    && unitHasSkill(other, "massProductionFormation")
  );
}

function massProductionFormationActive(unit) {
  return hasMassProductionFormationCommand(unit) && hasMatchingMassProductionAlly(unit);
}

function hasTeamworkAlly(unit) {
  if (!isMobileSuit(unit)) return false;
  return alliedMobileSuits(unit).some((other) => distance(other, unit) <= 2);
}

function isFrontmostAlly(unit) {
  if (!isMobileSuit(unit)) return false;
  const allies = state.units.filter((other) => other.side === unit.side && isMobileSuit(other) && isAlive(other));
  const frontY = unit.side === "player"
    ? Math.min(...allies.map((other) => other.y))
    : Math.max(...allies.map((other) => other.y));
  return allies.length > 0 && unit.y === frontY;
}

function hasAllyAhead(unit) {
  if (!isMobileSuit(unit)) return false;
  return alliedMobileSuits(unit).some((other) => unit.side === "player" ? other.y < unit.y : other.y > unit.y);
}

function hinderedByStopMovement(unit) {
  if (!isMobileSuit(unit)) return false;
  return state.units.some((other) =>
    other.side !== unit.side
    && isCombatUnit(other)
    && isAlive(other)
    && unitHasSkill(other, "stopMovement")
    && distance(other, unit) <= 2
  );
}

function guardMissionProtector(defender, attacker) {
  if (!isMobileSuit(defender)) return null;
  return alliedMobileSuits(defender).find((other) =>
    unitHasSkill(other, "guardMission")
    && distance(other, defender) <= 1
    && distance(other, attacker) <= distance(defender, attacker)
  );
}

function barrageSupportPenalty(defender, attacker) {
  return state.units.some((unit) => unit.side === attacker.side && isCombatUnit(unit) && unitHasSkill(unit, "barrageSupport") && distance(unit, defender) <= 3) ? 8 : 0;
}

function shieldHasSkill(unit, skillId) {
  const shield = activeShield(unit);
  return Boolean(shield && (weaponFor(shield.id).specials ?? []).includes(skillId));
}

function weaponHasSkill(weapon, skillId) {
  return (weapon?.specials ?? []).includes(skillId);
}

function activeSkillText(unit) {
  const skills = [...new Set(unitSpecials(unit))];
  if ((unit.freezyYardActiveTurns ?? 0) > 0) skills.push(`フリージーヤード効果中${unit.freezyYardActiveTurns}`);
  if ((unit.smokeConcealedTurns ?? 0) > 0) skills.push(`煙幕隠蔽中${unit.smokeConcealedTurns}`);
  if ((unit.learningStacks ?? 0) > 0) skills.push(`教育型補正${unit.learningStacks}`);
  return skills.length > 0 ? specialsLabel(skills) : "なし";
}

function freezyYardActive(unit) {
  return isMobileSuit(unit) && (unit.freezyYardActiveTurns ?? 0) > 0;
}

function canActivateFreezyYard(unit) {
  return isMobileSuit(unit)
    && isCombatUnit(unit)
    && unitHasSkill(unit, "freezyYard")
    && !freezyYardActive(unit)
    && !unit.acted;
}

function activateFreezyYard(unit, renderAfter = true) {
  if (!canActivateFreezyYard(unit)) return false;
  unit.freezyYardActiveTurns = FREEZY_YARD_TURNS;
  unit.usedWeaponIds = attackWeapons(unit).map((weapon) => weapon.id);
  unit.acted = true;
  unit.moved = true;
  revealStealth(unit, "フリージーヤード");
  pushDialogue(unit, "wait");
  state.log.push(`${unitName(unit)}がフリージーヤードを展開。${FREEZY_YARD_TURNS}ターンの間、実弾ダメージを大きく軽減します。`);
  if (renderAfter) renderBattle();
  return true;
}

function tickTurnStartEffects(side) {
  state.units.filter((unit) => unit.side === side && isCombatUnit(unit)).forEach((unit) => {
    if ((unit.freezyYardActiveTurns ?? 0) > 0) unit.freezyYardActiveTurns -= 1;
  });
}

function unitTerrainPenalty(unit) {
  if (!isMobileSuit(unit)) return { mobility: 0, evasion: 0 };
  const terrain = terrainAt(unit.x, unit.y);
  if (mobileSuitIgnoresGroundTerrain(msFor(unit))) return { mobility: 0, evasion: 0 };
  if (mobileSuitTerrainSuitability(msFor(unit), terrain)) return { mobility: 0, evasion: 0 };
  return { mobility: 1, evasion: 8 };
}

function terrainEffectText(unit) {
  const terrain = terrainAt(unit.x, unit.y);
  if (isBattleship(unit)) return `${terrainLabel(terrain)}: 旗艦のため適性無視`;
  if (!isMobileSuit(unit) || !terrainNeedsSuitability(terrain)) return `${terrainLabel(terrain)}: 影響なし`;
  const ms = msFor(unit);
  if (mobileSuitIgnoresGroundTerrain(ms)) return `${terrainLabel(terrain)}: 飛行のため適性無視`;
  if (mobileSuitTerrainSuitability(ms, terrain)) return `${terrainLabel(terrain)}: 適性あり`;
  const penalty = unitTerrainPenalty(unit);
  return `${terrainLabel(terrain)}: 適性なし（移動-${penalty.mobility} / 回避-${penalty.evasion}）`;
}

function mapSuitabilityLabel(ms) {
  const labels = [];
  const mapTypes = ms.mapTypes ?? ["ground", "space"];
  if (mapTypes.length === 1) labels.push(`${mapTypeName(mapTypes[0])}専用`);
  if (ms.movementType === "flying") labels.push("飛行");
  if (ms.movementType === "submarine") labels.push("水中専用");
  ["water", "forest", "desert", "debris"].forEach((id) => {
    if (ms.movementType === "submarine" && id === "water") return;
    if (ms.terrainSuitability?.[id]) labels.push(`${terrainLabel(id)}適性`);
  });
  return labels.length > 0 ? labels.join(" / ") : "なし";
}

function statItems(items) {
  return `<div class="stat-grid compact">${items.map(([label, value]) => `<div class="stat"><span>${label}</span>${value}</div>`).join("")}</div>`;
}

function weaponCategoryLabel(category) {
  return {
    "beam-rifle": "ビームライフル系",
    bazooka: "バズーカ系",
    "beam-bazooka": "ビームバズーカ系",
    cannon: "キャノン系",
    "machine-gun": "マシンガン系",
    grenade: "投擲系",
    missile: "ミサイル系",
    shield: "盾"
  }[category] ?? category;
}

function mobileSuitTags(ms) {
  return ms.tags ?? [ms.id];
}

function compatibilityMatchesMs(item, ms) {
  return item.msId === ms.id || (item.msTag && mobileSuitTags(ms).includes(item.msTag));
}

function msTagLabel(tag) {
  return {
    coreFighter: "コア・ファイター系",
    coreBooster: "コア・ブースター系",
    gParts: "Gパーツ系",
    federationAircraft: "連邦航空機",
    zeonAircraft: "ジオン航空機",
    supportAircraft: "支援航空機",
    spaceFighter: "宇宙戦闘機",
    lowCostFighter: "低コスト航空機",
    mobileArmor: "モビルアーマー",
    psycommu: "サイコミュ機",
    gundam: "ガンダム系",
    vProject: "V作戦系",
    gm: "ジム系",
    guncannon: "ガンキャノン系",
    guntank: "ガンタンク系",
    gFighter: "Gファイター系",
    zaku: "ザク系",
    zaku1: "ザクI系",
    zaku2: "ザクII系",
    gouf: "グフ系",
    dom: "ドム系",
    gelgoog: "ゲルググ系",
    gyan: "ギャン系",
    aquatic: "水陸両用MS",
    aquaticMa: "水中MA",
    submarine: "完全水中用",
    fishEye: "フィッシュアイ系",
    grabro: "グラブロ系",
    acguy: "アッガイ系",
    gogg: "ゴッグ系",
    zeong: "ジオング系",
    bigZam: "ビグ・ザム系",
    charCustom: "シャア専用機",
    red: "赤い機体",
    black: "黒い機体",
    supportPod: "支援ポッド"
  }[tag] ?? tag;
}

function compatibilityTargetName(item) {
  if (item.msId) return lookup().ms[item.msId]?.name ?? item.msId;
  return item.msTag ? msTagLabel(item.msTag) : "対象未設定";
}

function characterMsCompatibilityText(character) {
  const matches = (state.data.compatibility?.characterMs ?? []).filter((item) => item.characterId === character.id);
  return matches.length > 0
    ? matches.map((item) => `${compatibilityTargetName(item)} 回避+${item.evasionBonus}`).join(" / ")
    : "なし";
}

function mobileSuitCharacterCompatibilityText(ms) {
  const characters = lookup().characters;
  const matches = (state.data.compatibility?.characterMs ?? []).filter((item) => compatibilityMatchesMs(item, ms));
  return matches.length > 0
    ? matches.map((item) => `${characters[item.characterId]?.name ?? item.characterId} 回避+${item.evasionBonus}`).join(" / ")
    : "なし";
}

function mobileSuitWeaponCompatibilityText(ms) {
  const weapons = lookup().weapons;
  const matches = (state.data.compatibility?.msWeapon ?? []).filter((item) => compatibilityMatchesMs(item, ms));
  return matches.length > 0
    ? matches.map((item) => `${item.weaponId ? weapons[item.weaponId]?.name ?? item.weaponId : weaponCategoryLabel(item.category)} 命中+${item.accuracyBonus}`).join(" / ")
    : "なし";
}

function weaponCompatibilityText(weapon) {
  const matches = (state.data.compatibility?.msWeapon ?? []).filter((item) => item.weaponId === weapon.id || (!item.weaponId && item.category === weapon.category));
  return matches.length > 0
    ? matches.map((item) => `${compatibilityTargetName(item)} 命中+${item.accuracyBonus}`).join(" / ")
    : "なし";
}

function unitCompatibilityText(unit) {
  if (!isMobileSuit(unit)) return "なし";
  const characterBonus = characterMsBonus(unit);
  const weaponBonuses = attackWeapons(unit)
    .map((weapon) => {
      const bonus = msWeaponBonus(unit, weapon);
      return bonus > 0 ? `${weapon.name}+${bonus}` : null;
    })
    .filter(Boolean);
  return `キャラ回避${characterBonus > 0 ? `+${characterBonus}` : "なし"} / 武器命中${weaponBonuses.length > 0 ? weaponBonuses.join("、") : "なし"}`;
}

function renderMobileSuitDetails(ms, options = {}) {
  return `
    <details class="detail-box" ${options.open ? "open" : ""}>
      <summary>${ms.name} 詳細</summary>
      ${statItems([
        ["コスト", ms.cost],
        ["装甲", ms.armor],
        ["EN", ms.energy],
        ["運動", ms.agility],
        ["移動", ms.mobility],
        ["装備枠", `武器${ms.weaponSlots ?? 2} / OP${ms.optionSlots ?? 1}`],
        ["特殊", specialsLabel(ms.specials)],
        ["脱出先", (ms.specials ?? []).includes("coreSystem") ? (lookup().ms[ms.escapeMsId ?? "coreFighter"]?.name ?? ms.escapeMsId ?? "コア・ファイター") : "なし"],
        ["地形適性", mapSuitabilityLabel(ms)]
      ])}
      <div class="detail-list">
        ${renderSkillDetails(ms.specials)}
        <p class="small">キャラ相性: ${mobileSuitCharacterCompatibilityText(ms)}</p>
        <p class="small">武器相性: ${mobileSuitWeaponCompatibilityText(ms)}</p>
        <p class="small">固定武装</p>
        ${ms.fixedWeaponIds.length > 0 ? ms.fixedWeaponIds.map((id) => renderWeaponDetails(weaponFor(id))).join("") : `<p class="small">なし</p>`}
      </div>
    </details>
  `;
}

function renderMapDetails(map, options = {}) {
  const specialTerrains = [...new Set(map.terrain.filter((terrain) => terrainNeedsSuitability(terrain)))];
  return `
    <details class="detail-box" ${options.open ? "open" : ""}>
      <summary>${map.name} 詳細</summary>
      ${statItems([
        ["区分", mapTypeName(map.type)],
        ["広さ", `${boardWidth(map)} x ${boardHeight(map)}`],
        ["特殊マス", specialTerrains.length > 0 ? specialTerrains.map(terrainLabel).join(" / ") : "なし"],
        ["適性なし", "移動-1 / 回避-8"],
        ["障害物", "移動不可 / 射線遮断"]
      ])}
    </details>
  `;
}

function renderBattleshipDataDetails(ship, options = {}) {
  return `
    <details class="detail-box" ${options.open ? "open" : ""}>
      <summary>${ship.name} 詳細</summary>
      ${statItems([
        ["コスト", ship.cost],
        ["耐久", ship.armor],
        ["EN", ship.energy],
        ["回避基礎", ship.agility],
        ["移動", ship.mobility],
        ["出撃", (ship.mapTypes ?? ["ground", "space"]).map(mapTypeName).join(" / ")],
        ["航行", ship.movementType === "submarine" ? "水中専用" : "通常"],
        ["脱出", ship.escapeShipId ? `${lookup().battleships[ship.escapeShipId]?.name ?? ship.escapeShipId}` : "なし"],
        ["補給", `装甲${ship.support.armor} / 盾${ship.support.shield} / EN${ship.support.energy} / 弾${ship.support.ammo}`]
      ])}
      <div class="detail-list">
        ${ship.weaponIds.map((id) => renderWeaponDetails(weaponFor(id))).join("")}
      </div>
    </details>
  `;
}

function renderCharacterDetails(character, options = {}) {
  return `
    <details class="detail-box" ${options.open ? "open" : ""}>
      <summary>${character.name} 詳細</summary>
      ${statItems([
        ["コスト", character.cost],
        ["射撃", character.shooting],
        ["格闘", character.melee],
        ["反応", character.reaction],
        ["覚醒", character.awakening],
        ["指揮", character.command],
        ["支援", character.support],
        ["整備", character.maintenance],
        ["得意", characterRolesLabel(character)]
      ])}
      <div class="detail-list">
        <p class="small">特殊: ${specialsLabel(character.specials)}</p>
        <p class="small">MS搭乗時: ${characterMsContributionText(character)}</p>
        <p class="small">戦艦搭乗時: ${characterBridgeContributionText(character)}</p>
        <p class="small">機体相性: ${characterMsCompatibilityText(character)}</p>
        ${renderSkillDetails(character.specials)}
      </div>
    </details>
  `;
}

function renderWeaponDetails(weapon, options = {}) {
  const factions = weapon.factions?.map((faction) => state.data.factions[faction]).join(" / ") ?? "共通";
  const shieldCanAttack = weapon.kind === "shield" && weapon.attackType !== "guard" && weapon.power > 0;
  return `
    <details class="detail-box weapon-detail" ${options.open ? "open" : ""}>
      <summary>${weapon.name} 詳細</summary>
      ${weapon.kind === "shield" ? statItems([
        ["コスト", weapon.cost],
        ["盾耐久", weapon.durability],
        ["攻撃", shieldCanAttack ? `威力${weapon.power} / 命中${weapon.accuracy} / ${weaponRangeLabel(weapon)} / 耐久消費${shieldAttackCost(weapon)}` : "不可"],
        ["使用勢力", factions]
      ]) : statItems([
        ["コスト", weapon.cost],
        ["威力", weapon.power],
        ["命中", weapon.accuracy],
        ["射程", weaponRangeLabel(weapon).replace("射程", "")],
        ["消費", weaponConsumptionLabel(weapon)],
        ["弾数", weapon.kind === "ammo" ? weapon.ammo : "-"],
        ["覚醒条件", weapon.requiredAwakening ? `${weapon.requiredAwakening}以上` : "なし"],
        ["種別", weapon.attackType === "melee" ? "格闘" : "射撃"],
        ["障害物", weapon.ignoresObstacles ? "無視" : "遮られる"],
        ["使用勢力", factions],
        ["機体相性", weaponCompatibilityText(weapon)]
      ])}
      ${renderSkillDetails(weapon.specials)}
    </details>
  `;
}

function renderOptionDetails(option, options = {}) {
  const factions = option.factions?.map((faction) => state.data.factions[faction]).join(" / ") ?? "共通";
  return `
    <details class="detail-box" ${options.open ? "open" : ""}>
      <summary>${option.name} 詳細</summary>
      ${statItems([
        ["コスト", option.cost],
        ["種別", option.effectType],
        ["付与", option.grantsSkill ? specialsLabel([option.grantsSkill]) : "直接効果"],
        ["効果", option.effectText],
        ["重複", option.uniqueSkill ? "同名効果と重複なし" : "重複可"],
        ["使用勢力", factions]
      ])}
      ${option.grantsSkill ? renderSkillDetails([option.grantsSkill]) : ""}
    </details>
  `;
}

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
  const candidates = state.data.characters.filter((character) => character.faction === faction && hasCard("characters", character.id));
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
  const factionCharacters = state.data.characters.filter((character) => character.faction === faction);
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
  return state.data.characters.find((character) => character.faction === faction && hasCard("characters", character.id) && !used.has(character.characterKey ?? character.id));
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
  const selectedMsInvalid = !selectedMs || !hasCard("mobileSuits", selectedMs.id) || selectedMs.faction !== state.faction || !mobileSuitCanDeployOnMap(selectedMs, currentMap);
  if (selectedMsInvalid) {
    state.selectedMsId = state.data.mobileSuits.find((item) => item.faction === state.faction && hasCard("mobileSuits", item.id) && mobileSuitCanDeployOnMap(item, currentMap))?.id ?? "";
  }
  const normalizedMs = ms[state.selectedMsId];
  if (normalizedMs) {
    const availableWeaponIds = state.data.weapons
      .filter((weapon) => remainingCardCopies("weapons", weapon.id) > 0 && !weapon.fixedOnly && weaponEquippableByMs(normalizedMs, weapon, state.selectedOptionId) && weaponUsableByFaction(weapon, normalizedMs.faction))
      .map((weapon) => weapon.id);
    state.selectedWeaponIds = fitWeaponIdsToSlots(state.selectedWeaponIds.filter((id) => availableWeaponIds.includes(id)), normalizedMs);
  }
  const selectedOption = lookup().options[state.selectedOptionId];
  if (state.selectedOptionId && (!selectedOption || remainingCardCopies("options", selectedOption.id) < 1 || !optionUsableByFaction(selectedOption, state.faction) || (normalizedMs?.optionSlots ?? 1) < 1)) {
    state.selectedOptionId = "";
  }

  const captain = characters[state.selectedCaptainId];
  const captainUsed = captain && usedCharacterKeys({ excludeBridgeSlot: "captain", includeSelectedCharacter: true }).has(captain.characterKey ?? captain.id);
  if (state.selectedCaptainId && (!captain || !hasCard("characters", captain.id) || captain.faction !== state.faction || captainUsed)) {
    state.selectedCaptainId = "";
  }

  const firstOfficer = characters[state.selectedFirstOfficerId];
  const firstOfficerUsed = firstOfficer && usedCharacterKeys({ excludeBridgeSlot: "firstOfficer", includeSelectedCharacter: true }).has(firstOfficer.characterKey ?? firstOfficer.id);
  if (state.selectedFirstOfficerId && (!firstOfficer || !hasCard("characters", firstOfficer.id) || firstOfficer.faction !== state.faction || firstOfficerUsed)) {
    state.selectedFirstOfficerId = "";
  }

  const selectedCharacter = characters[state.selectedCharacterId];
  const selectedUsed = selectedCharacter && usedCharacterKeys().has(selectedCharacter.characterKey ?? selectedCharacter.id);
  if (state.selectedCharacterId && (!selectedCharacter || !hasCard("characters", selectedCharacter.id) || selectedCharacter.faction !== state.faction || selectedUsed)) {
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

function fallbackEnemyFormationForMap(map, faction) {
  if (faction === "zeon") {
    if (map.type === "space") {
      return [
        { msId: "zaku2", characterIds: ["gene"], weaponIds: ["zakuMachineGun", "zakuBazooka"], optionIds: [] },
        { msId: "rickDom", characterIds: ["ramba"], weaponIds: ["zakuBazooka", "cracker"], optionIds: [] }
      ];
    }
    return [
      { msId: "zaku2", characterIds: ["gene"], weaponIds: ["zakuMachineGun", "zakuBazooka"], optionIds: [] },
      { msId: "gouf", characterIds: ["ramba"], weaponIds: ["zakuBazooka"], optionIds: [] }
    ];
  }
  if (map.type === "space") {
    return [
      { msId: "gm", characterIds: ["hayato"], weaponIds: ["beamRifle", "shield"], optionIds: [] },
      { msId: "ball", characterIds: ["kai"], weaponIds: [], optionIds: [] }
    ];
  }
  return [
    { msId: "gm", characterIds: ["hayato"], weaponIds: ["beamRifle", "shield"], optionIds: [] },
    { msId: "guncannon", characterIds: ["kai"], weaponIds: ["shield"], optionIds: [] }
  ];
}

function enemyFormationForStage(mapId, faction) {
  const stageEntries = stageConfig(mapId).enemyFormations?.[faction];
  const map = lookup().maps[mapId] ?? selectedMap();
  const entries = stageEntries?.length ? stageEntries : fallbackEnemyFormationForMap(map, faction);
  return entries.map((entry) => ({
    msId: entry.msId,
    characterIds: [...(entry.characterIds ?? [])],
    weaponIds: [...(entry.weaponIds ?? [])],
    optionIds: [...(entry.optionIds ?? [])]
  }));
}

function enemyBattleshipForStage(mapId, faction) {
  const stage = stageConfig(mapId);
  if (stage.enemyBattleshipId === null) return null;
  const map = lookup().maps[mapId] ?? selectedMap();
  if (stage.enemyBattleshipId) {
    const configured = lookup().battleships[stage.enemyBattleshipId];
    return configured?.faction === faction && battleshipCanDeployOnMap(configured, map) ? configured : null;
  }
  return state.data.battleships.find((ship) => ship.faction === faction && battleshipCanDeployOnMap(ship, map));
}

function enemyTotalCostForStage(mapId = state.selectedMapId) {
  const faction = stageEnemyFaction(mapId);
  const enemyEntries = enemyFormationForStage(mapId, faction);
  const enemyShip = enemyBattleshipForStage(mapId, faction);
  const enemyBridge = enemyShip ? enemyBridgeForStage(mapId, faction) : {};
  return (enemyShip?.cost ?? 0)
    + crewCost([enemyBridge.captainId, enemyBridge.firstOfficerId])
    + enemyEntries.reduce((sum, entry) => sum + formationEntryCost(entry), 0);
}

function stageCostCap(mapId = state.selectedMapId) {
  const stage = stageConfig(mapId);
  if (Number.isFinite(stage.costCap)) return stage.costCap;
  const enemyCost = enemyTotalCostForStage(mapId);
  if (enemyCost <= 0) return state.data.costCap ?? 1200;
  const margin = Math.max(COST_CAP_MIN_MARGIN, Math.ceil(enemyCost * COST_CAP_MARGIN_RATE));
  return Math.ceil((enemyCost + margin) / 10) * 10;
}

function stagePlayable(map) {
  return playableFactionsOnMap(map).length > 0;
}

function renderTitle() {
  state.screen = "title";
  phaseLabel.textContent = "タイトル";
  setupScreen.className = "screen title-layout";
  setupScreen.innerHTML = `
    <section class="title-panel">
      <p class="eyebrow">Card Tactical SRPG</p>
      <h2>${state.data.campaign?.title ?? "カードタクティクス"}</h2>
      <p>手持ちカードで部隊を組み、ステージ報酬で戦力を広げていく試作版です。</p>
      <div class="title-actions">
        <button class="primary-button" data-action="stage-select">ステージ選択</button>
        <button data-action="card-list">カード一覧</button>
        <button data-action="choice-card" ${choiceTicketCount() > 0 && choiceCandidateEntries().length > 0 ? "" : "disabled"}>カード引換</button>
      </div>
    </section>
    <section class="panel stack">
      <h2>現在の進行</h2>
      ${campaignSummaryStats()}
      <p class="small">連邦はマチルダのガンペリーとジム2機、ジオンはドレンのパプアとザクII／ザクIで開始します。</p>
      <button class="danger-button" data-action="reset-save">進行を初期化</button>
    </section>
  `;
  setupScreen.classList.remove("hidden");
  battleScreen.classList.add("hidden");
}

function campaignSummaryStats() {
  const currentCap = stageCostCap(state.selectedMapId);
  return statItems([
    ["クリア", `${state.collection.clearedStages.length} / ${state.data.maps.length}`],
    ["機体", `${ownedUniqueCount("mobileSuits")}種 / ${ownedTotalCount("mobileSuits")}枚`],
    ["戦艦", `${state.collection.battleships.length} / ${state.data.battleships.filter((ship) => ship.selectable !== false).length}`],
    ["武器", `${ownedUniqueCount("weapons")}種 / ${ownedTotalCount("weapons")}枚`],
    ["OP", `${ownedUniqueCount("options")}種 / ${ownedTotalCount("options")}枚`],
    ["キャラ", `${state.collection.characters.length} / ${state.data.characters.filter((character) => character.selectable !== false).length}`],
    ["引換券", `${choiceTicketCount()}枚`],
    ["現在コスト枠", currentCap]
  ]);
}

function renderStageSelect() {
  state.screen = "stage";
  phaseLabel.textContent = "ステージ選択";
  setupScreen.className = "screen stage-layout";
  setupScreen.innerHTML = `
    <section class="panel stack">
      <div class="panel-heading">
        <h2>ステージ選択</h2>
        <button data-action="title">タイトルへ</button>
      </div>
      <div class="stage-grid">
        ${state.data.maps.map((map) => stageCard(map)).join("")}
      </div>
    </section>
    <aside class="panel stack">
      <h2>カード状況</h2>
      ${campaignSummaryStats()}
      <button data-action="card-list">カード一覧を見る</button>
      <button class="primary-button" data-action="choice-card" ${choiceTicketCount() > 0 && choiceCandidateEntries().length > 0 ? "" : "disabled"}>カード引換券を使う</button>
    </aside>
  `;
  setupScreen.classList.remove("hidden");
  battleScreen.classList.add("hidden");
}

function stageCard(map) {
  const stage = stageConfig(map.id);
  const playable = stagePlayable(map);
  const cleared = stageCleared(map.id);
  const enemyFaction = stageEnemyFaction(map.id);
  const enemyCost = enemyTotalCostForStage(map.id);
  const cap = stageCostCap(map.id);
  const rewardText = renderCommonDropSummary();
  const rollText = stageDropRolls(stage) > 0 ? ` / ${stageDropRolls(stage)}回抽選` : "";
  return `
    <article class="stage-card ${cleared ? "cleared" : ""}">
      <div class="stage-card-head">
        <div>
          <p class="eyebrow">${mapTypeName(map.type)} / 敵:${factionName(enemyFaction)} / 敵${enemyCost} / 上限${cap}</p>
          <h3>${map.name}</h3>
        </div>
        <span class="status-pill ${playable ? "ready" : ""}">${cleared ? "CLEAR" : playable ? "出撃可" : "未解禁"}</span>
      </div>
      <p class="small">${stage.summary ?? "ステージ説明は未設定です。"}</p>
      ${renderMapDetails(map)}
      <p class="small">ドロップ候補${rollText}</p>
      <div class="reward-list">${rewardText || `<span class="reward-chip">報酬未設定</span>`}</div>
      <button class="primary-button" data-action="select-stage" data-map-id="${map.id}" ${playable ? "" : "disabled"}>このステージへ</button>
    </article>
  `;
}

function commonDropCounts() {
  const entries = commonDropEntries();
  return ["mobileSuits", "battleships", "weapons", "options", "characters"].map((type) => ({
    type,
    count: entries.filter((entry) => entry.type === type).length
  }));
}

function renderCommonDropSummary() {
  const limit = commonDropConfig().copyLimit;
  const choice = choiceRewardConfig();
  const chips = commonDropCounts()
    .filter((item) => item.count > 0)
    .map((item) => `<span class="reward-chip">${cardTypeLabel(item.type)}: 候補${item.count}</span>`);
  chips.push(`<span class="reward-chip owned">武器/OP上限 ${limit}枚</span>`);
  if (choice.firstClearTickets > 0) chips.push(`<span class="reward-chip">初回クリア: 引換券${choice.firstClearTickets}枚</span>`);
  if (choice.repeatClearTickets > 0 && choice.repeatClearChance > 0) chips.push(`<span class="reward-chip owned">再クリア: 引換券${Math.round(choice.repeatClearChance * 100)}%</span>`);
  return chips.join("") || `<span class="reward-chip owned">追加報酬候補なし</span>`;
}

function renderDropRewardChip(reward) {
  const owned = hasCard(reward.type, reward.id);
  const countText = isCountedCardType(reward.type) ? ` x${Math.max(1, Number(reward.count) || 1)} / 所持${cardCount(reward.type, reward.id)}枚` : owned ? " 所持済み" : "";
  const weightText = reward.weight ? ` / 重み${reward.weight}` : "";
  return `<span class="reward-chip ${owned ? "owned" : ""}">${cardTypeLabel(reward.type)}: ${cardName(reward.type, reward.id)}${countText}${weightText}</span>`;
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
  if (item.faction) return [item.faction];
  if (Array.isArray(item.factions)) return item.factions;
  return [];
}

function itemSearchText(type, item) {
  return normalizeSearchText([
    item.id,
    item.name,
    cardTypeLabel(type),
    ...itemFactionIds(item).map((faction) => state.data.factions[faction] ?? faction),
    ...(item.mapTypes ?? []),
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
    <div class="filter-bar">
      <label>検索<input class="library-control" data-filter-key="query" type="search" value="${escapeAttr(filter.query)}" placeholder="名前・タグ" /></label>
      <label>種別<select class="library-control" data-filter-key="type">
        ${[
          ["all", "すべて"],
          ["battleships", "戦艦"],
          ["mobileSuits", "機体"],
          ["weapons", "武器"],
          ["options", "OP"],
          ["characters", "キャラ"]
        ].map(([value, label]) => filterOption(value, label, filter.type)).join("")}
      </select></label>
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
    <article class="collection-card revealed">
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
          <button class="${state.revealAllCards ? "primary-button" : ""}" data-action="toggle-card-reveal">${state.revealAllCards ? "通常表示に戻す" : "確認用: 情報全開放"}</button>
          <button data-action="choice-card" ${choiceTicketCount() > 0 && choiceCandidateEntries().length > 0 ? "" : "disabled"}>カード引換</button>
          <button data-action="stage-select">ステージ選択</button>
          <button data-action="title">タイトルへ</button>
        </div>
      </div>
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
            <article class="collection-card ${actuallyOwned ? "owned" : visible ? "revealed" : "locked"}">
              <div class="collection-card-head">
                <strong>${visible ? item.name : "未入手カード"}</strong>
                <span class="status-pill ${actuallyOwned ? "ready" : visible ? "preview" : ""}">${visible ? countLabel : "未入手"}</span>
              </div>
              ${visible ? detailRenderer(item) : `<p class="small">ステージ報酬などで入手すると詳細を確認できます。</p>`}
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
    ? state.data.mobileSuits.filter((item) => item.faction === state.faction && hasCard("mobileSuits", item.id) && mobileSuitCanDeployOnMap(item, selectedMapData))
    : kind === "battleship"
      ? state.data.battleships.filter((item) => item.faction === state.faction && hasCard("battleships", item.id) && battleshipCanDeployOnMap(item, selectedMapData))
    : state.data.characters.filter((item) => item.faction === state.faction && hasCard("characters", item.id));
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
    <article class="picker-card ${ms.id === state.selectedMsId ? "selected" : ""}">
      <div class="collection-card-head">
        <strong>${ms.name}</strong>
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
      ${renderMobileSuitDetails(ms)}
      <button class="primary-button" data-action="choose-ms" data-id="${ms.id}">この機体にする</button>
    </article>
  `;
}

function battleshipPickerCard(ship) {
  return `
    <article class="picker-card ${ship.id === state.selectedBattleshipId ? "selected" : ""}">
      <div class="collection-card-head">
        <strong>${ship.name}</strong>
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
      ${renderBattleshipDataDetails(ship)}
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
    <article class="picker-card ${current ? "selected" : ""} ${disabled ? "disabled-card" : ""}">
      <div class="collection-card-head">
        <strong>${character.name}</strong>
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
      ${renderCharacterDetails(character)}
      <button class="primary-button" data-action="choose-character" data-owner="${owner}" data-id="${character.id}" ${disabled ? "disabled" : ""}>このキャラにする</button>
    </article>
  `;
}

function characterIdForOwner(owner) {
  if (owner === "captain") return state.selectedCaptainId;
  if (owner === "firstOfficer") return state.selectedFirstOfficerId;
  return state.selectedCharacterId;
}

function renderSetup() {
  normalizeSelections();
  state.phase = "setup";
  phaseLabel.textContent = "編成";
  state.screen = "setup";
  const { ms, characters, weapons, battleships, maps, options } = lookup();
  const cost = currentCost();
  const selectedMapData = maps[state.selectedMapId] ?? state.data.maps[0];
  const cap = stageCostCap(selectedMapData.id);
  const enemyCost = enemyTotalCostForStage(selectedMapData.id);
  const availableBattleships = state.data.battleships.filter((item) => item.faction === state.faction && hasCard("battleships", item.id) && battleshipCanDeployOnMap(item, selectedMapData));
  const availableMs = state.data.mobileSuits.filter((item) => item.faction === state.faction && hasCard("mobileSuits", item.id) && mobileSuitCanDeployOnMap(item, selectedMapData));
  const availableCharacters = state.data.characters.filter((item) => item.faction === state.faction && hasCard("characters", item.id));
  const selectedBattleship = battleships[state.selectedBattleshipId] ?? availableBattleships[0];
  const selectedMs = ms[state.selectedMsId] ?? availableMs[0];
  const selectedWeaponSlots = weaponSlotCount(selectedMs);
  const usedWeaponSlots = selectedWeaponSlotCost(state.selectedWeaponIds);
  const availableWeapons = state.data.weapons.filter((weapon) => remainingCardCopies("weapons", weapon.id) > 0 && !weapon.fixedOnly && weaponEquippableByMs(selectedMs, weapon, state.selectedOptionId) && weaponUsableByFaction(weapon, selectedMs.faction));
  const availableOptions = (state.data.options ?? []).filter((option) => remainingCardCopies("options", option.id) > 0 && optionUsableByFaction(option, state.faction));
  const selectedOption = options[state.selectedOptionId];
  const selectedCharacter = characters[state.selectedCharacterId];
  const selectedMsRemaining = selectedMs ? remainingCardCopies("mobileSuits", selectedMs.id) : 0;
  const addCost = selectedMs.cost + (selectedCharacter?.cost ?? 0) + (selectedOption?.cost ?? 0) + state.selectedWeaponIds.reduce((sum, id) => sum + weapons[id].cost, 0);
  const projectedCost = cost + addCost;

  setupScreen.className = "screen setup-layout";
  setupScreen.innerHTML = `
    <aside class="panel stack">
      <div class="panel-heading">
        <h2>編成</h2>
        <button data-action="stage-select">ステージへ</button>
      </div>
      <div class="segmented">
        ${Object.entries(state.data.factions).map(([id, name]) => `<button data-action="faction" data-faction="${id}" class="${state.faction === id ? "active" : ""}" ${playableFactionsOnMap(selectedMapData).includes(id) ? "" : "disabled"}>${name}</button>`).join("")}
      </div>
      <div class="meter ${cost > cap ? "over" : ""}">
        <div class="meter-line"><div class="meter-fill" style="width: ${clamp((cost / cap) * 100, 0, 100)}%"></div></div>
        <p class="small">総コスト ${cost} / ${cap}（敵総コスト${enemyCost}）</p>
      </div>
      <p class="small">${selectedMapData.name}へ出撃します。キャラクターはMSにも戦艦にも配置できます。同じ人物は1人だけ編成できます。</p>
      <div class="form-row">
        <label>ステージ</label>
        <div class="readonly-field">${selectedMapData.name} / ${mapTypeName(selectedMapData.type)}</div>
      </div>
      ${renderMapDetails(selectedMapData, { open: true })}
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
      <div class="form-row">
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
      ${selectedCharacter ? renderCharacterDetails(selectedCharacter, { open: true }) : `<p class="support-hint">キャラクター未配置です。一覧から選ぶか、プルダウンで選択してください。</p>`}
      <div>
        <h3>手持ち武装</h3>
        <p class="small">装備枠: ${usedWeaponSlots} / ${selectedWeaponSlots}</p>
        <div class="weapon-list">
          ${availableWeapons.length === 0 ? `<p class="small">この機体は手持ち武器を装備できません。</p>` : availableWeapons.map((weapon) => `
            <div class="choice-card">
              <label>
                <input type="checkbox" value="${weapon.id}" ${state.selectedWeaponIds.includes(weapon.id) ? "checked" : ""} ${usedWeaponSlots + weaponSlotCost(weapon) > selectedWeaponSlots && !state.selectedWeaponIds.includes(weapon.id) ? "disabled" : ""} />
                <strong>${weapon.name}</strong>
              </label>
              <span class="small">使用枠${weaponSlotCost(weapon)} / 残り${remainingCardCopies("weapons", weapon.id)}枚 / コスト${weapon.cost} / ${weapon.kind === "shield" ? `盾耐久${weapon.durability}${weaponCanAttack(weapon) ? ` / 盾攻撃 威力${weapon.power} 命中${weapon.accuracy}` : ""}` : `威力${weapon.power} 命中${weapon.accuracy} ${weaponRangeLabel(weapon)}`}</span>
              ${renderWeaponDetails(weapon)}
            </div>
          `).join("")}
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
      <button class="primary-button" data-action="add" ${projectedCost > cap || selectedMsRemaining < 1 ? "disabled" : ""}>この組み合わせを追加（+${addCost}）</button>
      ${selectedMsRemaining < 1 ? `<p class="support-hint">この機体カードの残り枚数がありません。</p>` : ""}
    </section>

    <aside class="panel stack setup-roster-panel">
      <h2>現在の部隊</h2>
      <button type="button" class="primary-button setup-launch-button" data-action="launch" onclick="window.safeLaunchBattle?.()" ${state.formation.length === 0 || cost > cap ? "disabled" : ""}>出撃</button>
      <div class="roster-list">
        ${battleshipRosterCard(selectedBattleship)}
        ${state.formation.length === 0 ? `<p class="small">MSはまだ追加されていません。</p>` : state.formation.map((entry, index) => rosterCard(entry, index)).join("")}
      </div>
    </aside>
  `;

  setupScreen.classList.remove("hidden");
  battleScreen.classList.add("hidden");
  setupScreen.querySelector('[data-action="launch"]')?.addEventListener("click", safeLaunchBattle);
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
    const candidates = state.data.characters.filter((character) => character.faction === state.faction && hasCard("characters", character.id));
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
  return `${characterRolesLabel(character)} / 射撃${character.shooting} / 格闘${character.melee} / 反応${character.reaction} / 指揮${character.command} / 支援${character.support} / 整備${character.maintenance}`;
}

function rosterCard(entry, index) {
  const { ms, characters, weapons, options } = lookup();
  const unitMs = ms[entry.msId];
  const unitCharacter = characters[entry.characterIds[0]] ?? NO_CHARACTER;
  const weaponNames = entry.weaponIds.map((id) => weapons[id].name).join(" / ") || "手持ちなし";
  const optionNames = (entry.optionIds ?? []).map((id) => options[id]?.name).filter(Boolean).join(" / ") || "OPなし";
  const sortieNumber = index + 1;
  return `
    <div class="unit-card">
      <div class="portrait ${unitMs.faction}">${sortieNumber}</div>
      <div>
        <strong>${sortieNumber}. ${unitMs.name} + ${unitCharacter.name}</strong>
        <div class="small">${weaponNames} / ${optionNames} / コスト${formationCost(entry)}</div>
        <div class="inline-details">
          ${renderMobileSuitDetails(unitMs)}
          ${renderCharacterDetails(unitCharacter)}
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
    <div class="unit-card flagship-card">
      <div class="portrait ${ship.faction}">艦</div>
      <div>
        <strong>${ship.name}</strong>
        <div class="small">艦長: ${captain?.name ?? "未配置"} / 副長: ${firstOfficer?.name ?? "未配置"} / コスト${ship.cost + bridgeCost()}</div>
        <div class="inline-details">
          ${renderBattleshipDataDetails(ship)}
          ${captain ? renderCharacterDetails(captain) : ""}
          ${firstOfficer ? renderCharacterDetails(firstOfficer) : ""}
        </div>
      </div>
    </div>
  `;
}

function chooseMobileSuit(msId) {
  const ms = lookup().ms[msId];
  if (!ms || !hasCard("mobileSuits", ms.id) || !mobileSuitCanDeployOnMap(ms)) return;
  state.selectedMsId = ms.id;
  state.selectedWeaponIds = defaultLoadout(ms);
  renderSetup();
}

function chooseBattleship(shipId) {
  const ship = lookup().battleships[shipId];
  if (!ship || !hasCard("battleships", ship.id) || !battleshipCanDeployOnMap(ship)) return;
  state.selectedBattleshipId = ship.id;
  renderSetup();
}

function setCharacterForOwner(owner, characterId) {
  if (owner === "captain") state.selectedCaptainId = characterId;
  if (owner === "firstOfficer") state.selectedFirstOfficerId = characterId;
  if (owner === "mobileSuit") state.selectedCharacterId = characterId;
  if (characterId) clearCharacterConflicts(characterId, owner);
  renderSetup();
}

function changeFaction(faction) {
  if (!playableFactionsOnMap().includes(faction)) return;
  state.faction = faction;
  state.formation = [];
  const factionBattleship = state.data.battleships.find((ship) => ship.faction === faction && hasCard("battleships", ship.id) && battleshipCanDeployOnMap(ship));
  const factionMs = state.data.mobileSuits.find((ms) => ms.faction === faction && hasCard("mobileSuits", ms.id) && mobileSuitCanDeployOnMap(ms));
  const factionCharacter = state.data.characters.find((character) => character.faction === faction && hasCard("characters", character.id));
  state.selectedBattleshipId = factionBattleship?.id ?? "";
  const bridge = defaultBridgeSelection(faction);
  state.selectedCaptainId = bridge.captainId;
  state.selectedFirstOfficerId = bridge.firstOfficerId;
  state.selectedMsId = factionMs?.id ?? "";
  state.selectedCharacterId = firstAvailableCharacter(faction)?.id ?? factionCharacter?.id ?? "";
  state.selectedWeaponIds = factionMs ? defaultLoadout(factionMs) : [];
  state.selectedOptionId = "";
  applyStarterFormation();
  renderSetup();
}

function addFormationEntry() {
  normalizeSelections();
  if (!state.selectedMsId) return;
  if (!selectionWithinOwnedCounts("mobileSuits", [state.selectedMsId])) return;
  if (selectedWeaponSlotCost(state.selectedWeaponIds) > weaponSlotCount(lookup().ms[state.selectedMsId])) return;
  if (!selectionWithinOwnedCounts("weapons", state.selectedWeaponIds)) return;
  if (state.selectedOptionId && !selectionWithinOwnedCounts("options", [state.selectedOptionId])) return;
  state.formation.push({
    msId: state.selectedMsId,
    characterIds: state.selectedCharacterId ? [state.selectedCharacterId] : [],
    weaponIds: [...state.selectedWeaponIds],
    optionIds: state.selectedOptionId ? [state.selectedOptionId] : []
  });
  state.selectedCharacterId = firstAvailableCharacter(state.faction)?.id ?? "";
  state.selectedOptionId = "";
  renderSetup();
}

function makeUnit(entry, side, x, y, index) {
  const { ms } = lookup();
  const unitMs = ms[entry.msId];
  const weaponIds = [...unitMs.fixedWeaponIds, ...entry.weaponIds];
  const optionIds = [...(entry.optionIds ?? [])];
  const runtimeWeapons = runtimeWeaponsForIds(weaponIds, optionIds);
  const maxEnergy = unitMs.energy + (optionIds.includes("externalGenerator") ? 25 : 0);

  return {
    id: `${side}-${index}-${makeId()}`,
    type: "mobileSuit",
    side,
    sortieNumber: index + 1,
    msId: entry.msId,
    characterIds: [...entry.characterIds],
    optionIds,
    weaponIds,
    runtimeWeapons,
    armor: unitMs.armor,
    energy: maxEnergy,
    maxArmor: unitMs.armor,
    maxEnergy,
    x,
    y,
    usedWeaponIds: [],
    acted: false,
    moved: false
  };
}

function makeBattleship(battleshipId, crewIds, side, x, y) {
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
    weaponIds: [...ship.weaponIds],
    runtimeWeapons,
    usedWeaponIds: [],
    acted: false,
    moved: false
  };
}

function defaultDeploymentPosition(side, kind, index = 0, map = selectedMap()) {
  const width = boardWidth(map);
  const height = boardHeight(map);
  if (kind === "battleship") {
    return { x: Math.floor(width / 2), y: side === "player" ? height - 1 : 0 };
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
  const configured = kind === "battleship" ? sideConfig?.battleship : sideConfig?.units?.[index];
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
  state.phase = "player";
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

function launchBattle() {
  if (state.screen === "battle") return;
  const cap = stageCostCap(state.selectedMapId);
  if (currentCost() > cap) {
    state.log.push(`総コストが上限を超えています（${currentCost()} / ${cap}）。`);
    renderSetup();
    return;
  }
  const enemyFaction = stageEnemyFaction();
  const enemyEntries = buildEnemyFormation(enemyFaction);
  const enemyBattleship = enemyBattleshipForStage(state.selectedMapId, enemyFaction);
  const occupied = new Set();
  const playerShip = lookup().battleships[state.selectedBattleshipId];
  const playerShipPosition = reserveDeploymentCell("player", "battleship", 0, occupied, playerShip);
  const enemyShipPosition = enemyBattleship ? reserveDeploymentCell("enemy", "battleship", 0, occupied, enemyBattleship) : null;
  const playerUnits = state.formation.map((entry, index) => {
    const position = reserveDeploymentCell("player", "unit", index, occupied, lookup().ms[entry.msId]);
    return makeUnit(entry, "player", position.x, position.y, index);
  });
  const enemyUnits = enemyEntries.map((entry, index) => {
    const position = reserveDeploymentCell("enemy", "unit", index, occupied, lookup().ms[entry.msId]);
    return makeUnit(entry, "enemy", position.x, position.y, index);
  });
  const enemyBridge = enemyBattleship ? enemyBridgeForStage(state.selectedMapId, enemyFaction) : {};
  const enemyCrewIds = [enemyBridge.captainId, enemyBridge.firstOfficerId].filter(Boolean);
  const battleships = [
    makeBattleship(state.selectedBattleshipId, [state.selectedCaptainId, state.selectedFirstOfficerId].filter(Boolean), "player", playerShipPosition.x, playerShipPosition.y)
  ];
  if (enemyBattleship && enemyShipPosition) {
    battleships.push(makeBattleship(enemyBattleship.id, enemyCrewIds, "enemy", enemyShipPosition.x, enemyShipPosition.y));
  }

  state.units = [...battleships, ...playerUnits, ...enemyUnits];
  state.phase = "deployment";
  state.outcome = null;
  state.selectedUnitId = battleships.find((unit) => unit.side === "player")?.id ?? playerUnits[0]?.id ?? null;
  state.selectedTargetId = null;
  state.enemyQueue = [];
  state.mines = [];
  state.sacrificialBoostSides = {};
  state.resultRewards = [];
  state.log = [`${factionName(state.faction)}部隊、出撃。敵は${factionName(enemyFaction)}です。`];
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

function buildEnemyFormation(faction) {
  return enemyFormationForStage(state.selectedMapId, faction);
}

function renderBattle() {
  state.screen = "battle";
  checkOutcome();
  phaseLabel.textContent = phaseName();
  setupScreen.classList.add("hidden");
  battleScreen.classList.remove("hidden");

  const selected = state.units.find((unit) => unit.id === state.selectedUnitId && isAlive(unit));
  const target = state.units.find((unit) => unit.id === state.selectedTargetId && isAlive(unit));

  battleScreen.innerHTML = `
    <section class="board-wrap">
      <div class="battle-toolbar">
        <strong>${phaseName()} / ${selectedMap().name}</strong>
        <div>
          <button data-action="stage-select">ステージへ</button>
          <button data-action="back">編成へ戻る</button>
          ${state.phase === "deployment" && !state.outcome ? `<button class="primary-button" data-action="finish-deployment">配置完了</button>` : ""}
          <button class="primary-button" data-action="end-turn" ${state.phase !== "player" || state.outcome ? "disabled" : ""}>ターン終了</button>
        </div>
      </div>
      ${state.phase === "deployment" && !state.outcome ? `<section class="panel deployment-panel">
        <div>
          <h2>出撃配置</h2>
          <p class="small">自軍ユニットを選び、手前${deploymentRows("player")}列の明るいマスへ置き直せます。配置を終えたら「配置完了」で戦闘開始です。</p>
        </div>
      </section>` : ""}
      ${state.outcome ? renderBattleResultPanel() : ""}
      <div class="board" style="--board-width: ${boardWidth()}; --board-height: ${boardHeight()};">
        ${renderCells(selected)}
      </div>
      ${renderBattleLogPanel()}
    </section>

    <aside class="side-panel">
      <section class="panel">
        <h2>選択中</h2>
        ${selected ? renderUnitDetail(selected, target) : `<p class="small">${state.phase === "enemy" ? "敵行動を進めると、行動中の敵が表示されます。" : "自軍ユニットを選んでください。"}</p>`}
      </section>
      ${target ? `<details class="panel target-panel compact-target-panel">
        <summary>敵ユニット: ${unitName(target)} / ${target.armor} / ${target.maxArmor}</summary>
        ${renderTargetDetail(target)}
      </details>` : ""}
    </aside>
  `;

}

function renderBattleResultPanel() {
  const victory = state.outcome === "勝利";
  return `
    <section class="result-panel ${victory ? "victory" : "defeat"}">
      <div>
        <p class="eyebrow">Result</p>
        <h2>${state.outcome}</h2>
        <p>${victory ? "ステージ報酬を獲得しました。カード一覧と次のステージに反映されています。" : "戦艦または全機を失いました。編成を見直して再挑戦できます。"}</p>
      </div>
      ${victory ? `<div class="reward-list result-rewards">
        ${state.resultRewards.map((reward) => renderResultRewardChip(reward)).join("") || `<span class="reward-chip owned">追加報酬なし</span>`}
      </div>` : ""}
      <div class="title-actions">
        ${victory && choiceTicketCount() > 0 && choiceCandidateEntries().length > 0 ? `<button class="primary-button" data-action="choice-card">カード引換へ</button>` : ""}
        <button class="primary-button" data-action="stage-select">ステージ選択へ</button>
        <button data-action="card-list">カード一覧</button>
      </div>
    </section>
  `;
}

function renderResultRewardChip(reward) {
  if (reward.type === "choiceTicket") {
    return `<span class="reward-chip">カード引換券 x${reward.count ?? 1} / 現在${choiceTicketCount()}枚</span>`;
  }
  const countText = isCountedCardType(reward.type)
    ? ` x${reward.count ?? 1} / 現在${cardCount(reward.type, reward.id)}枚`
    : reward.newlyOwned ? " 獲得" : " 獲得済み";
  const ownedClass = !isCountedCardType(reward.type) && !reward.newlyOwned ? "owned" : "";
  return `<span class="reward-chip ${ownedClass}">${cardTypeLabel(reward.type)}: ${reward.name}${countText}</span>`;
}

function renderBattleLogPanel() {
  return `
    <section class="panel log-panel battle-log-panel">
      <div class="panel-heading">
        <h2>戦闘ログ</h2>
        ${state.phase === "enemy" && !state.outcome ? `<button class="primary-button compact-button" data-action="advance-enemy">敵行動を進める</button>` : ""}
      </div>
      ${state.phase === "enemy" && !state.outcome ? `<p class="small">ログを確認してから、ボタンで敵の次の行動へ進めます。</p>` : ""}
      <div class="log-list">
        ${state.log.slice(-12).reverse().map((item) => `<div class="log-item">${item}</div>`).join("")}
      </div>
    </section>
  `;
}

function renderCells(selected) {
  const activeAttacks = isCombatUnit(selected) ? usableAttackWeapons(selected) : [];
  const reachable = isCombatUnit(selected) && state.phase === "player" && selected.side === "player" && !selected.moved ? reachableCells(selected) : new Set();
  const deployable = state.phase === "deployment" && selected?.side === "player" ? deploymentCellsFor(selected) : new Set();
  const width = boardWidth();
  const height = boardHeight();
  return Array.from({ length: width * height }, (_, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    const unit = state.units.find((candidate) => candidate.x === x && candidate.y === y && isAlive(candidate));
    const terrain = terrainAt(x, y);
    const canMove = !state.outcome && !unit && reachable.has(positionKey(x, y));
    const canDeploy = !state.outcome && deployable.has(positionKey(x, y));
    const canTarget = !state.outcome && state.phase === "player" && isCombatUnit(selected) && isCombatUnit(unit) && unit.side !== selected.side && activeAttacks.some((weapon) => weaponInRange(selected, unit, weapon));
    const mine = state.mines?.find((item) => item.x === x && item.y === y);
    const classes = ["cell", `terrain-${terrain}`, canMove ? "move-ok" : "", canDeploy ? "deploy-ok" : "", canTarget ? "target-ok" : ""].filter(Boolean).join(" ");
    return `<div class="${classes}" data-x="${x}" data-y="${y}" title="${terrainLabel(terrain)}">
      ${terrainShortLabel(terrain) ? `<span class="terrain-badge">${terrainShortLabel(terrain)}</span>` : ""}
      ${mine ? `<span class="terrain-badge mine-badge">機雷</span>` : ""}
      ${unit ? renderToken(unit) : ""}
    </div>`;
  }).join("");
}

function renderToken(unit) {
  const faction = unitFaction(unit);
  const hp = clamp((unit.armor / unit.maxArmor) * 100, 0, 100);
  const selected = unit.id === state.selectedUnitId ? "selected" : "";
  const battleship = isBattleship(unit) ? "battleship" : "";
  const numberBadge = isMobileSuit(unit) && Number.isInteger(unit.sortieNumber)
    ? `<span class="token-number">${unit.sortieNumber}</span>`
    : "";
  return `
    <button class="token ${faction} ${unit.side} ${battleship} ${selected}" data-unit-id="${unit.id}" title="${unitName(unit)}">
      ${numberBadge}
      <span class="token-name">${unitName(unit)}</span>
      <span class="hp-bar"><span class="hp-fill" style="width:${hp}%"></span></span>
    </button>
  `;
}

function renderUnitDetail(unit, target) {
  if (isBattleship(unit)) return renderBattleshipDetail(unit, target);
  const ms = msFor(unit);
  const character = primaryCharacterFor(unit);
  const shield = activeShield(unit);
  return `
    <h3>${unitName(unit)} / ${character.name}</h3>
    <div class="stat-grid side-stat-grid">
      <div class="stat"><span>機番</span>${Number.isInteger(unit.sortieNumber) ? `${unit.sortieNumber}番機` : "なし"}</div>
      <div class="stat"><span>装甲</span>${unit.armor} / ${unit.maxArmor}</div>
      <div class="stat"><span>EN</span>${unit.energy} / ${unit.maxEnergy}</div>
      <div class="stat"><span>移動</span>${mobilityFor(unit)} / 基礎${ms.mobility}</div>
      <div class="stat"><span>回避補正</span>${evasion(unit)}</div>
      <div class="stat"><span>発動スキル</span>${activeSkillText(unit)}</div>
      <div class="stat"><span>地形</span>${terrainEffectText(unit)}</div>
    </div>
    <div class="side-brief">
      <span>${shield ? `盾: ${weaponFor(shield.id).name} ${shield.durability}` : "盾なし"}</span>
      <span>相性: ${unitCompatibilityText(unit)}</span>
    </div>
    ${state.phase === "deployment"
      ? `<p class="support-hint ready">配置フェイズ: 手前${deploymentRows("player")}列の明るいマスへ配置できます。</p>`
      : target ? `<p class="support-hint ready"><strong>攻撃対象:</strong> ${unitName(target)}</p>` : `<p class="support-hint">敵をクリックすると攻撃対象になります。</p>`}
    <div class="actions">
      ${freezyYardButton(unit)}
      ${mineScatterButtons(unit)}
      ${smokeDischargerButtons(unit)}
      ${attackButtons(unit, target)}
    </div>
    ${renderBattleshipSupportHint(unit)}
    <details class="side-collapse">
      <summary>機体・キャラ・装備詳細</summary>
      <div class="side-detail-stack">
        ${renderMobileSuitDetails(ms)}
        ${renderCharacterDetails(character)}
        ${renderOptionInventory(unit)}
        ${renderWeaponInventory(unit)}
      </div>
    </details>
  `;
}

function renderTargetDetail(unit) {
  if (isBattleship(unit)) return renderBattleshipTargetDetail(unit);
  const ms = msFor(unit);
  const character = primaryCharacterFor(unit);
  const shield = activeShield(unit);
  return `
    <h3>${unitName(unit)} / ${character.name}</h3>
    <div class="stat-grid side-stat-grid">
      <div class="stat"><span>機番</span>${Number.isInteger(unit.sortieNumber) ? `${unit.sortieNumber}番機` : "なし"}</div>
      <div class="stat"><span>装甲</span>${unit.armor} / ${unit.maxArmor}</div>
      <div class="stat"><span>EN</span>${unit.energy} / ${unit.maxEnergy}</div>
      <div class="stat"><span>移動</span>${mobilityFor(unit)} / 基礎${ms.mobility}</div>
      <div class="stat"><span>回避補正</span>${evasion(unit)}</div>
      <div class="stat"><span>発動スキル</span>${activeSkillText(unit)}</div>
      <div class="stat"><span>地形</span>${terrainEffectText(unit)}</div>
    </div>
    <div class="side-brief">
      <span>${shield ? `盾: ${weaponFor(shield.id).name} ${shield.durability}` : "盾なし"}</span>
      <span>相性: ${unitCompatibilityText(unit)}</span>
    </div>
    ${renderBattleshipSupportHint(unit)}
    <details class="side-collapse">
      <summary>敵の機体・キャラ・装備詳細</summary>
      <div class="side-detail-stack">
        ${renderMobileSuitDetails(ms)}
        ${renderCharacterDetails(character)}
        ${renderOptionInventory(unit)}
        ${renderWeaponInventory(unit)}
      </div>
    </details>
  `;
}

function renderBattleshipTargetDetail(unit) {
  const ship = battleshipFor(unit);
  const crew = battleshipCrew(unit);
  return `
    <h3>${ship.name}</h3>
    <div class="stat-grid side-stat-grid">
      <div class="stat"><span>耐久</span>${unit.armor} / ${unit.maxArmor}</div>
      <div class="stat"><span>EN</span>${unit.energy} / ${unit.maxEnergy}</div>
      <div class="stat"><span>移動</span>${ship.mobility}</div>
      <div class="stat"><span>回避補正</span>${evasion(unit)}</div>
      <div class="stat"><span>発動スキル</span>${activeSkillText(unit)}</div>
      <div class="stat"><span>地形</span>${terrainEffectText(unit)}</div>
    </div>
    <div class="side-brief">
      <span>撃沈で勝利条件に直結</span>
      <span>艦長: ${crew[0]?.name ?? "未配置"} / 副長: ${crew[1]?.name ?? "未配置"}</span>
    </div>
    <details class="side-collapse">
      <summary>敵戦艦・武装詳細</summary>
      <div class="side-detail-stack">
        ${renderBattleshipDataDetails(ship)}
        ${renderWeaponInventory(unit)}
      </div>
    </details>
  `;
}

function renderBattleshipDetail(unit, target) {
  const ship = battleshipFor(unit);
  const support = supportForBattleship(unit);
  const crew = battleshipCrew(unit);
  return `
    <h3>${ship.name}</h3>
    <div class="stat-grid side-stat-grid">
      <div class="stat"><span>耐久</span>${unit.armor} / ${unit.maxArmor}</div>
      <div class="stat"><span>EN</span>${unit.energy} / ${unit.maxEnergy}</div>
      <div class="stat"><span>移動</span>${ship.mobility}</div>
      <div class="stat"><span>回避補正</span>${evasion(unit)}</div>
      <div class="stat"><span>発動スキル</span>${activeSkillText(unit)}</div>
      <div class="stat"><span>地形</span>${terrainEffectText(unit)}</div>
    </div>
    <div class="crew-list">
      ${["captain", "firstOfficer"].map((role, index) => {
        const member = crew[index];
        return `<div class="crew-chip"><span>${crewRoleLabel(role)}</span><strong>${member?.name ?? "未配置"}</strong></div>`;
      }).join("")}
    </div>
    <p class="small">撃沈されると、この陣営は即敗北します。隣接した味方機はターン終了時にEN+${support.energy}、実弾+${support.ammo}、装甲+${support.armor}、盾+${support.shield}を受けます。</p>
    ${state.phase === "deployment"
      ? `<p class="support-hint ready">配置フェイズ: 戦艦も手前${deploymentRows("player")}列の有効マスへ配置できます。</p>`
      : target ? `<p><strong>攻撃対象:</strong> ${unitName(target)}</p>` : ""}
    <div class="actions">
      ${target ? attackButtons(unit, target) : ""}
    </div>
    <details class="side-collapse">
      <summary>戦艦・武装詳細</summary>
      <div class="side-detail-stack">
        ${renderBattleshipDataDetails(ship)}
        ${renderWeaponInventory(unit)}
      </div>
    </details>
  `;
}

function renderBattleshipSupportHint(unit) {
  const battleship = alliedBattleship(unit.side);
  if (!battleship || !isAlive(battleship)) return `<p class="small">戦艦支援: 戦艦なし</p>`;
  const adjacent = isAdjacent(unit, battleship);
  return `<p class="support-hint ${adjacent ? "ready" : ""}">戦艦支援: ${adjacent ? "ターン終了で補給・修理" : "戦艦に隣接すると補給・修理"}</p>`;
}

function attackButtons(attacker, target) {
  const attackableTarget = isCombatUnit(target);
  if (!attackWeapons(attacker).length) return `<p class="small">攻撃武装がありません。</p>`;
  if (!attackableTarget) return `<p class="small">敵を選ぶと、未使用の武器で攻撃できます。</p>`;
  return attackWeapons(attacker).map((weapon) => {
    const used = weaponUsed(attacker, weapon.id);
    const cannotTarget = weapon.cannotTargetFlying && isMobileSuit(target) && msFor(target).movementType === "flying";
    const concealed = weapon.attackType === "shooting" && unitIsConcealedFrom(target, attacker);
    const reachable = weaponReachableByRange(attacker, target, weapon);
    const blocked = reachable && weaponBlockedByObstacle(attacker, target, weapon);
    const inRange = reachable && !blocked;
    const usable = canPayCost(attacker, weapon);
    const compatibilityBonus = msWeaponBonus(attacker, weapon);
    const status = [
      weaponStatus(attacker, weapon),
      unitWeaponRangeLabel(attacker, weapon),
      compatibilityBonus > 0 ? `相性+${compatibilityBonus}` : "",
      inRange ? `命中${hitRate(attacker, target, weapon)}%` : cannotTarget ? "飛行不可" : concealed ? "隠蔽" : blocked ? "障害物" : "射程外",
      used ? "使用済み" : ""
    ].filter(Boolean).join(" / ");
    return `
      <button data-action="attack" data-weapon-id="${weapon.id}" ${state.outcome || attacker.acted || used || !inRange || !usable || state.phase !== "player" ? "disabled" : ""}>
        ${weapon.name}<br><span class="button-detail">${status}</span>
      </button>
    `;
  }).join("");
}

function freezyYardButton(unit) {
  if (!isMobileSuit(unit) || !unitHasSkill(unit, "freezyYard")) return "";
  const activeTurns = unit.freezyYardActiveTurns ?? 0;
  const status = activeTurns > 0
    ? `効果中 / 残り${activeTurns}ターン / 実弾-${FREEZY_YARD_REDUCTION}`
    : `行動消費 / ${FREEZY_YARD_TURNS}ターン / 実弾-${FREEZY_YARD_REDUCTION}`;
  const disabled = state.outcome || state.phase !== "player" || unit.side !== "player" || !canActivateFreezyYard(unit);
  return `
    <button data-action="freezy-yard" ${disabled ? "disabled" : ""}>
      フリージーヤード<br><span class="button-detail">${status}</span>
    </button>
  `;
}

function mineScatterButtons(unit) {
  if (!isCombatUnit(unit)) return "";
  return attackWeapons(unit)
    .filter((weapon) => weaponHasSkill(weapon, "mineScatter"))
    .map((weapon) => {
      const cells = mineScatterCells(unit);
      const usable = canUseMineScatter(unit, weapon);
      const status = [
        weaponStatus(unit, weapon),
        `設置${Math.min(3, cells.length)}個`,
        weaponUsed(unit, weapon.id) ? "使用済み" : ""
      ].filter(Boolean).join(" / ");
      return `
        <button data-action="mine-scatter" data-weapon-id="${weapon.id}" ${state.outcome || state.phase !== "player" || unit.side !== "player" || !usable ? "disabled" : ""}>
          機雷散布<br><span class="button-detail">${weapon.name} / ${status}</span>
        </button>
      `;
    }).join("");
}

function smokeDischargerButtons(unit) {
  if (!isMobileSuit(unit)) return "";
  const weaponButtons = unitWeaponObjects(unit)
    .filter((weapon) => weaponHasSkill(weapon, "smokeDischarger"))
    .map((weapon) => {
      const usable = canUseSmokeDischarger(unit, weapon);
      const status = [
        weaponStatus(unit, weapon),
        "射撃対象化を防ぐ",
        weaponUsed(unit, weapon.id) ? "使用済み" : ""
      ].filter(Boolean).join(" / ");
      return `
        <button data-action="smoke-discharger" data-weapon-id="${weapon.id}" ${state.outcome || state.phase !== "player" || unit.side !== "player" || !usable ? "disabled" : ""}>
          スモーク<br><span class="button-detail">${weapon.name} / ${status}</span>
        </button>
      `;
    }).join("");
  const skillButton = unitHasSkill(unit, "smokeDischarger") ? `
    <button data-action="smoke-skill" ${state.outcome || state.phase !== "player" || unit.side !== "player" || unit.acted || unit.moved || unit.smokeSkillUsed ? "disabled" : ""}>
      スモーク<br><span class="button-detail">OP / 射撃対象化を防ぐ${unit.smokeSkillUsed ? " / 使用済み" : ""}</span>
    </button>
  ` : "";
  return `${weaponButtons}${skillButton}`;
}

function renderWeaponInventory(unit) {
  const rows = unit.weaponIds.map((id) => {
    const weapon = weaponFor(id);
    const used = weaponUsed(unit, id);
    return `
      <div class="weapon-row ${used ? "used" : ""}">
        <div>
          <strong>${weapon.name}</strong>
          ${renderWeaponDetails(weapon)}
        </div>
        <span>${weaponStatus(unit, weapon)} / ${unitWeaponRangeLabel(unit, weapon)}${used ? " / 使用済み" : ""}</span>
      </div>
    `;
  }).join("");
  return `<div class="weapon-inventory">${rows}</div>`;
}

function renderOptionInventory(unit) {
  if (!isMobileSuit(unit)) return "";
  const options = unitOptions(unit);
  if (options.length === 0) return `<p class="small">オプション: なし</p>`;
  return `<div class="weapon-inventory">${options.map((option) => `
    <div class="weapon-row">
      <div>
        <strong>${option.name}</strong>
        ${renderOptionDetails(option)}
      </div>
      <span>${option.effectType}</span>
    </div>
  `).join("")}</div>`;
}

function msFor(unit) {
  return lookup().ms[unit.msId];
}

function primaryCharacterFor(unit) {
  return lookup().characters[unit.characterIds?.[0]] ?? NO_CHARACTER;
}

function weaponFor(id) {
  return lookup().weapons[id];
}

function runtimeWeaponsForIds(weaponIds, optionIds = []) {
  const { weapons } = lookup();
  const runtimeIds = [...new Set(weaponIds.flatMap((id) => [id, ...(weapons[id]?.extraAttackIds ?? [])]))];
  return runtimeIds.map((id) => {
    const weapon = weapons[id];
    const maxAmmo = weapon.kind === "ammo" ? weapon.ammo + (optionIds.includes("spareMagazine") ? 2 : 0) : weapon.ammo;
    return {
      id,
      ammo: maxAmmo,
      maxAmmo,
      durability: weapon.durability
    };
  });
}

const characterDialogue = {
  amuro: {
    attack: ["ここで止めます！", "狙いは見えています。", "この距離ならいけるはずです！"],
    hit: ["当たった、このまま押します！", "見えた通りに当たった！", "次の敵を見ます。"],
    miss: ["外した、次で修正します！", "動きが読みにくい。", "照準を合わせ直します。"],
    move: ["位置を変えます。", "あそこなら狙える。", "前に出すぎないようにします。"],
    wait: ["敵の出方を見ます。", "まだ焦る場面じゃない。"],
    evade: ["今のは読めた！", "当たるわけにはいかない！", "反応できた。"],
    damaged: ["まだ動けます！", "くっ、損傷を確認します。", "この程度なら戦えます！"]
  },
  kai: {
    attack: ["やるだけやってみるさ！", "ま、当たれば儲けもんだ。", "こいつで黙ってくれよ！"],
    hit: ["へへ、悪くないだろ！", "どうだ、見たかよ！", "こっちも少しは慣れてきたってね。"],
    miss: ["ちぇっ、嫌な動きするな！", "おいおい、今の避けるのかよ！", "次はもう少し真面目に狙うさ。"],
    move: ["こっちから回る。", "危ない場所はごめんだね。", "撃ちやすい場所を探す。"],
    wait: ["無理に突っ込む趣味はないね。", "様子見も仕事のうちだろ。"],
    evade: ["へっ、危ない危ない！", "そう簡単に当たってやるかよ！", "今のは勘が当たったな。"],
    damaged: ["痛ってえな、もう！", "装甲が持ってるうちに何とかするさ。", "冗談きついぜ！"]
  },
  hayato: {
    attack: ["援護します！", "僕だってやれます！", "狙いをつけました。"],
    hit: ["よし、命中！", "当てられた、次も続けます！", "今の手応えならいける。"],
    miss: ["まだ合わせきれない。", "くそ、焦りすぎた！", "次は外しません！"],
    move: ["前に出ます。", "援護しやすい位置へ。", "遅れないように進みます。"],
    wait: ["ここで支えます。", "味方の動きに合わせます。"],
    evade: ["避けられた。", "危なかった、でも大丈夫です。", "次も見ていれば避けられる。"],
    damaged: ["まだ、まだやれます！", "損傷しました、でも下がりません！", "ここで止まるわけにはいかない！"]
  },
  shin: {
    attack: ["こちらシン、攻撃します！", "落ち着いて狙います。", "訓練通りに撃つ！"],
    hit: ["命中、効果あり！", "よし、当たった！", "このまま押し返します！"],
    miss: ["外した、修正します！", "敵の動きが速い。", "次弾で合わせます。"],
    move: ["移動します。", "隊列を崩さず進みます。", "射線を取りに行きます。"],
    wait: ["持ち場を維持します。", "次の指示を待ちます。"],
    evade: ["回避成功。", "機体はまだ追従します。", "今のは見えました。"],
    damaged: ["被弾、戦闘継続します！", "損傷軽微、まだいけます！", "態勢を立て直します。"]
  },
  bright: {
    attack: ["各砲、目標を捉えろ！", "敵の足を止めるんだ！", "支援射撃、始める！"],
    hit: ["よし、続けて牽制しろ！", "命中確認、次の目標へ移れ！", "今の一撃で流れを作る。"],
    miss: ["焦るな、照準を立て直せ！", "敵も動いている、読み直せ。", "次弾、修正して撃て！"],
    move: ["艦を前進させる。", "味方を支援できる位置へ回す。", "進路を確保しろ！"],
    wait: ["状況を見極める。", "全員、持ち場を離れるな！", "補給の機会を逃すな！"],
    evade: ["回避できたか、油断するな！", "進路そのまま、次に備えろ！", "敵の照準を外せた。"],
    damaged: ["被害状況を報告しろ！", "まだ沈むわけにはいかん！", "応急班、損傷区画へ急げ！"]
  },
  mirai: {
    attack: ["射線を確保します。", "攻撃コースに入れます。", "味方に当てないよう調整します。"],
    hit: ["命中を確認。", "効果あり、姿勢は安定しています。", "このまま支援できます。"],
    miss: ["回避されました、次に備えます。", "敵の進路が変わりました。", "照準データを取り直します。"],
    move: ["進路を調整します。", "無理のない航路で行きます。", "補給しやすい距離を保ちます。"],
    wait: ["味方との距離を保ちます。", "今は姿勢制御を優先します。", "周囲を警戒します。"],
    evade: ["回避運動、成功です。", "この針路なら避けられます。", "敵の射線から外れました。"],
    damaged: ["損傷確認、航行は可能です。", "揺れます、つかまってください。", "応急処置に入ります。"]
  },
  sayla: {
    attack: ["目標を確認、攻撃します！", "迷っている余裕はありません。", "ここで止めます！"],
    hit: ["命中しました！", "次の行動に移ります。", "このまま押さえ込みます！"],
    miss: ["外しました、冷静に直します。", "敵も甘くありませんね。", "次は捉えます！"],
    move: ["進みます。", "位置を変えて援護します。", "危険な射線を避けます。"],
    wait: ["今は待ちます。", "味方の動きを見ます。"],
    evade: ["見えています。", "その程度なら避けられます！", "落ち着けば当たりません。"],
    damaged: ["まだ大丈夫です！", "このくらいで怯みません！", "機体を立て直します。"]
  },
  jobJohn: {
    attack: ["火器管制、いけます。", "武装チェック、問題なし。", "撃てる状態です。"],
    hit: ["直撃です。", "出力は安定しています。", "武装の調子は悪くありません。"],
    miss: ["すみません、照準が甘いです。", "振動が大きい、調整します。", "次は補正を入れます。"],
    move: ["整備しやすい位置へ。", "損傷を見ながら動かします。", "補給線に近づけます。"],
    wait: ["補給準備を続けます。", "機体状態を確認します。", "予備部品を回しておきます。"],
    evade: ["今の負荷なら許容範囲です。", "回避、機体に無理はありません。", "危なかった、計器を見ます。"],
    damaged: ["損傷を記録します。", "装甲板を後で交換ですね。", "動作系はまだ生きています。"]
  },
  matilda: {
    attack: ["支援射撃を行います！", "補給部隊でも戦えます！", "味方の進路を開きます。"],
    hit: ["命中、支援成功です！", "敵の足が止まりました。", "この隙に前進してください！"],
    miss: ["外れました、次で修正します。", "無理な射角でしたね。", "落ち着いて合わせます。"],
    move: ["補給可能な位置へ移動します。", "味方を支える場所へ。", "無理なく接近します。"],
    wait: ["補給準備を整えます。", "今は支援体制を維持します。"],
    evade: ["回避できました、隊列を維持します。", "敵の射線から外れます。", "輸送路は守ります。"],
    damaged: ["被弾しました、補給物資を守って！", "損傷確認、まだ任務は続けられます。", "応急修理を急ぎます！"]
  },
  ryu: {
    attack: ["みんなを守るんだ、行くぞ！", "無茶は承知だ、ここで止める！", "ホワイトベースをやらせるものか！"],
    hit: ["よし、少しは支えになったな！", "このまま押し返すぞ！", "みんな、今のうちだ！"],
    miss: ["くそ、焦ったか！", "まだだ、次で合わせる！", "みんなを不安にさせるわけにはいかん！"],
    move: ["前に出て受け止める！", "隊の間に入るぞ！", "危ない所は俺が見る！"],
    wait: ["落ち着け、みんな。", "ここは俺が支える。", "無理をするな、次に備えろ！"],
    evade: ["危ない、だが避けた！", "まだ守るべきものがある！", "そう簡単には落ちん！"],
    damaged: ["ぐっ、まだ動ける！", "この程度で倒れるわけにはいかない！", "みんなを逃がすまでは持たせる！"]
  },
  sleggar: {
    attack: ["派手に行こうじゃないか！", "この一発、見逃すなよ！", "援護は任せな、坊やたち！"],
    hit: ["よし、決まった！", "どうだ、年季が違うだろ！", "悪くない腕前ってやつさ！"],
    miss: ["おっと、今のは色男らしくないな！", "ちぇっ、次は当てるさ！", "相手もなかなかやるじゃないか！"],
    move: ["いい位置に回るぜ！", "砲座でも機体でも、働き場所はある！", "退くなら今のうちだぜ！"],
    wait: ["焦るな、見せ場はこれからだ。", "ここは大人しく待つとするか。", "若い連中を見てやらないとな。"],
    evade: ["危ない危ない、まだ死ねないんでね！", "当てるならもっと色気を出しな！", "その程度じゃ俺は落とせんよ！"],
    damaged: ["効いたぜ、だがまだ笑える！", "やるじゃないか、少し燃えてきた！", "ここで退いたら格好がつかないだろ！"]
  },
  frau: {
    attack: ["私だって、やれることをやります！", "みんなを守るためです！", "通信だけが仕事じゃありません！"],
    hit: ["当たりました、よかった！", "少しでも役に立てたなら！", "このまま支援します！"],
    miss: ["ごめんなさい、次は落ち着きます！", "手が震えて……でも、もう一度！", "敵の動きが速いです！"],
    move: ["負傷者を下げやすい位置へ！", "子どもたちから敵を離します！", "通信範囲を保ちます！"],
    wait: ["みんな、無事でいて。", "連絡を途切れさせません。", "できることを探します。"],
    evade: ["よかった、外れました！", "怖いけど、まだ大丈夫！", "今のうちに態勢を直します！"],
    damaged: ["きゃっ、でも通信は続けます！", "負傷者はいませんか！", "まだ、みんなの所へ戻らなきゃ！"]
  },
  temRay: {
    attack: ["この機体の性能を見せる時だ！", "設計通りなら通用するはずだ！", "出力を上げろ、今だ！"],
    hit: ["見たか、理論は間違っていない！", "これが新型の力だ！", "データとしても上々だな！"],
    miss: ["おかしい、計算では当たるはずだ！", "調整が足りんのか……！", "照準系を見直す必要がある！"],
    move: ["機体負荷を見ながら動かす。", "推進系の癖を確かめる。", "無理な姿勢は避けるんだ！"],
    wait: ["データを取る必要がある。", "焦るな、機体を壊すなよ。", "この数値ならまだ余裕がある。"],
    evade: ["反応は設計値内だ！", "よし、機体が追従している！", "この運動性なら避けられる！"],
    damaged: ["なんてことだ、貴重な機体が！", "損傷箇所を記録しろ！", "まだ試験は終わっていない！"]
  },
  revil: {
    attack: ["全軍、攻勢に移れ！", "ジオンの戦力をここで削る！", "勝機を逃すな、撃て！"],
    hit: ["よし、戦線を押し上げる！", "敵の継戦能力を奪え！", "この一撃が流れを変える！"],
    miss: ["照準を整え直せ！", "敵も消耗している、怯むな！", "次の砲列で押し切る！"],
    move: ["艦隊を前進させる！", "包囲線を狭めろ！", "補給線を守りながら進め！"],
    wait: ["兵を無駄にするな。", "今は全体の動きを見る。", "敵の疲弊を見誤るな。"],
    evade: ["まだ指揮は執れる！", "敵の砲撃をかわしたか。", "陣形を崩さず耐えろ！"],
    damaged: ["損害は覚悟の上だ、作戦を続ける！", "ここで退けば戦局を失う！", "被害を抑え、次の手を打て！"]
  },
  wakkein: {
    attack: ["規律を乱すな、攻撃を開始する！", "艦隊射撃、手順通りに行え！", "目標を確認、各員持ち場を守れ！"],
    hit: ["命中確認、作戦を続行する！", "よし、統制は取れている。", "次の目標へ移れ！"],
    miss: ["規定手順を見直せ！", "焦りは禁物だ、照準を修正しろ！", "次弾で整える！"],
    move: ["艦隊位置を修正する。", "ルナツー式の堅実さを見せる。", "進路を確保しろ！"],
    wait: ["命令系統を維持する。", "勝手な判断は許さん。", "状況を確認してから動く。"],
    evade: ["被弾を避けたか、よし。", "艦隊運動を維持しろ！", "まだ任務は続く！"],
    damaged: ["損傷報告を急げ！", "規律を乱すな、持ち場を守れ！", "まだ艦は沈んでいない！"]
  },
  paoloCassius: {
    attack: ["ホワイトベースを守る、砲撃開始！", "若い者たちを無事に逃がすんだ！", "敵を近づけるな、撃て！"],
    hit: ["よし、退路を開けたな！", "このまま艦を持たせる！", "命中確認、各員よくやった！"],
    miss: ["焦るな、艦を揺らすな！", "次弾、修正して撃て！", "まだ敵は近い、警戒しろ！"],
    move: ["艦を安全圏へ回す。", "避難経路を確保する。", "若いクルーに無理はさせられん。"],
    wait: ["状況を見極める。", "艦の維持を優先する。", "ここは耐えるしかない。"],
    evade: ["よし、直撃は避けた！", "まだ艦は動く、諦めるな！", "敵の照準を外せたか。"],
    damaged: ["損傷区画を閉鎖しろ！", "艦を沈めるわけにはいかん！", "皆を守るまで持ちこたえる！"]
  },
  oscarDublin: {
    attack: ["敵影確認、射撃指示を送ります！", "レーダー捕捉、攻撃可能です！", "目標データ、送ります！"],
    hit: ["命中を確認しました！", "敵影、動きが鈍りました！", "データ通りです！"],
    miss: ["敵、回避しました！", "照準データを更新します！", "すみません、もう一度捕捉します！"],
    move: ["索敵範囲を広げます！", "通信状態を維持します！", "味方の位置を確認します！"],
    wait: ["レーダー監視を続けます。", "通信回線、維持しています。", "敵影が動くのを待ちます。"],
    evade: ["敵弾、外れました！", "回避成功、航路を維持！", "まだ捕捉されています、注意を！"],
    damaged: ["被害報告、確認します！", "通信はまだ生きています！", "レーダーにノイズ、補正します！"]
  },
  markerClan: {
    attack: ["通信管制、攻撃開始です！", "味方機へ目標を送ります！", "射線クリア、撃てます！"],
    hit: ["命中、効果ありです！", "敵の反応が落ちています！", "このまま援護できます！"],
    miss: ["外れました、次を誘導します！", "敵の進路が変わりました！", "再計算します！"],
    move: ["通信範囲を保ちます！", "味方とのリンクを切らしません！", "観測しやすい位置へ！"],
    wait: ["回線を整理します。", "味方の報告を待ちます。", "敵信号を監視します。"],
    evade: ["回避を確認！", "敵の射線から外れました！", "まだ通信は安定しています！"],
    damaged: ["損傷報告を集めます！", "通信機材を守ってください！", "まだ管制できます！"]
  },
  omurHangal: {
    attack: ["整備屋でも撃つ時は撃つ！", "機体の癖は分かってるんだ！", "無理させずに当てる！"],
    hit: ["よし、機体は応えてくれた！", "整備の成果だな！", "いい調子だ、このまま行ける！"],
    miss: ["くそ、調整不足か！", "次はもっと丁寧に合わせる！", "機体を責めるな、俺の腕だ！"],
    move: ["損傷を見ながら動かす。", "補給しやすい位置へ行く。", "無茶な機動はさせないぞ！"],
    wait: ["応急修理の準備をする。", "機体状態を確認する。", "予備パーツを回しておく。"],
    evade: ["よし、関節はまだ持つ！", "その程度なら機体が耐える！", "回避機動、問題なし！"],
    damaged: ["やめろ、そこは直したばかりだ！", "損傷箇所を覚えておけ！", "まだ動く、俺が持たせる！"]
  },
  moskHan: {
    attack: ["反応速度の差を見せてやる！", "調整後の機体なら追いつけるはずだ！", "データを実戦で確認する！"],
    hit: ["よし、追従性は上がっている！", "この反応なら戦える！", "理論は正しかったな！"],
    miss: ["まだ調整が甘いか！", "機体が先に行きすぎたな！", "データを取り直す必要がある！"],
    move: ["駆動系を確かめる。", "反応速度を見るために動かす。", "無駄な負荷は避けるんだ！"],
    wait: ["整備データを確認する。", "焦るな、調整は繊細だ。", "機体の声を聞け。"],
    evade: ["反応は間に合った！", "調整した甲斐があったな！", "その攻撃なら追従できる！"],
    damaged: ["くっ、精密調整が狂う！", "損傷値を記録しろ！", "まだ改修の余地はある！"]
  },
  char: {
    attack: ["一撃で崩す！", "隙を見せたな。", "ここで主導権を取る。"],
    hit: ["見切れるものではない！", "当然の結果だ。", "これで足並みは乱れた。"],
    miss: ["反応は悪くない。", "面白い動きをする。", "次は逃がさん！"],
    move: ["間合いを詰める。", "死角へ回る。", "速さで揺さぶる。"],
    wait: ["慌てる必要はない。", "敵の出方を見よう。"],
    evade: ["その照準では遅い！", "見えているぞ。", "当てるには読みが足りんな。"],
    damaged: ["かすめたか。", "この程度で止まる私ではない！", "やるな、だがまだ浅い。"]
  },
  ramba: {
    attack: ["ここで仕掛ける！", "正面から押し切る！", "勝負を決めに行く。"],
    hit: ["よし、手応えありだ！", "いい一撃だ！", "この圧力を保つ。"],
    miss: ["まだ勝負はこれからだ！", "やるな、だが次はこちらだ。", "踏み込みが浅かったか。"],
    move: ["懐へ入る。", "近い間合いで戦う。", "敵の腰を崩す位置へ。"],
    wait: ["部下の動きを待つ。", "無駄な消耗は避ける。"],
    evade: ["踏み込みが甘い！", "その攻めでは届かん。", "いい狙いだが、まだ足りん。"],
    damaged: ["効いたぞ、だが倒れん！", "この程度で勝負は終わらん！", "傷を負ってこそ戦場だ。"]
  },
  lalah: {
    attack: ["あなたの心が見える……撃ちます。", "悲しいけれど、止めなければ。", "この光の向こうへ、届いて。"],
    hit: ["やはり、そこにいましたね。", "感じた通りです。", "この力が戦いを終わらせるなら……。"],
    miss: ["心が乱れました。", "見えたはずなのに……。", "迷いが照準を曇らせます。"],
    move: ["声のする方へ。", "この場所なら、もっと感じ取れる。", "大佐のそばを離れすぎないように。"],
    wait: ["人は分かり合えるはずです。", "戦いの気配が近づいています。", "静かに、心を澄ませます。"],
    evade: ["危険が近づくのを感じました。", "その意思は届いていました。", "まだ、ここで消えるわけには。"],
    damaged: ["痛みが心に響きます……！", "この悲しみも戦争なのですね。", "大佐、まだ私は戦えます。"]
  },
  giren: {
    attack: ["全軍に告ぐ、敵を殲滅せよ！", "勝利のための犠牲を恐れるな！", "ジオンの力を示す時だ！"],
    hit: ["よろしい、敵戦力は削られている。", "これが統制された軍の力だ。", "勝利は計算の内にある。"],
    miss: ["無能な射撃だ、修正しろ！", "戦意が足りん、次で示せ！", "誤差は許容する、敗北は許さん。"],
    move: ["戦線を再配置する。", "兵力を効率よく動かせ。", "全体の勝利に必要な位置へ。"],
    wait: ["機は熟している。", "敵も味方も盤上の駒だ。", "勝利のため、最善手を待つ。"],
    evade: ["この程度の攻撃で指揮は乱れん。", "敵の抵抗など想定内だ。", "まだ終局ではない。"],
    damaged: ["損害は数字で処理しろ！", "この程度で戦略は揺るがん！", "狼狽えるな、戦争は続いている！"]
  },
  kycilia: {
    attack: ["突撃機動軍の力を見せなさい。", "敵の弱点を突きます。", "無駄な抵抗はここで終わりです。"],
    hit: ["よろしい、報告通りの効果です。", "計画通りに進めなさい。", "敵の指揮系統を乱しましたね。"],
    miss: ["情報が古いようですね。", "次は失態を許しません。", "相手を侮る必要はありません。"],
    move: ["戦場を見下ろせる位置へ。", "諜報の結果を活かします。", "指揮系統を保ったまま動きます。"],
    wait: ["焦る者から敗れます。", "まだ切る札ではありません。", "敵の反応を見極めましょう。"],
    evade: ["その程度の策なら読めています。", "狙いは悪くありませんが、遅い。", "私を落とすには足りません。"],
    damaged: ["やりますね、記録しておきましょう。", "被害を抑えなさい。", "まだ主導権はこちらにあります。"]
  },
  garma: {
    attack: ["ガルマ隊、攻撃を開始する！", "この一戦で名誉を示す！", "シャア、見ていてくれ！"],
    hit: ["よし、これで面目は立つ！", "我が隊もやれるところを見せたぞ！", "このまま追撃する！"],
    miss: ["くっ、焦るな！", "次こそ私の力を示す！", "敵も侮れないということか。"],
    move: ["部隊を前進させる！", "包囲を狭めるぞ！", "私が先頭に立つ！"],
    wait: ["冷静に機を待つ。", "焦っては名誉を失う。", "各機、私に続ける準備を！"],
    evade: ["よし、見切った！", "私とてザビ家の男だ！", "この程度で怯むものか！"],
    damaged: ["くっ、まだ墜ちるわけにはいかん！", "ザビ家の名にかけて持たせる！", "シャア、私はまだ戦える！"]
  },
  mquve: {
    attack: ["この一手で敵は崩れる。", "美しくない戦い方だが、必要ならば。", "キシリア様のため、始末する。"],
    hit: ["ふふ、計算通りだ。", "品のない相手にはこれで十分だ。", "よろしい、盤面は整った。"],
    miss: ["詰めが甘かったか……。", "野蛮な動きで読みを外すとは。", "次はもう少し優雅に決めよう。"],
    move: ["無駄な消耗は避ける。", "こちらの罠へ誘導する。", "価値あるものは守らねばならん。"],
    wait: ["壺を割るような真似はするなよ。", "敵が動くまで待つのも策だ。", "慌ただしい戦場は好かんな。"],
    evade: ["私を狙うとは無作法な。", "見え透いた攻撃だ。", "美しくない、実に美しくない。"],
    damaged: ["くっ、貴重な機体に傷を！", "この借りは高くつくぞ。", "まだ策は残っている。"]
  },
  gaia: {
    attack: ["黒い三連星、仕掛けるぞ！", "ジェットストリームの間合いだ！", "俺が切り込む、続け！"],
    hit: ["よし、隊形を崩すな！", "三連星の名は伊達じゃない！", "このまま踏み潰す！"],
    miss: ["ちっ、隊列を乱すな！", "次は連携で潰す！", "相手もただ者じゃないか！"],
    move: ["三機の間合いを保て！", "回り込んで包む！", "先頭は俺が取る！"],
    wait: ["マッシュ、オルテガ、仕掛ける機を待て！", "焦るな、連携を崩すな。", "黒い三連星の呼吸を合わせる。"],
    evade: ["その狙いでは俺たちは止まらん！", "隊列を乱さずかわす！", "黒い機体を捉えきれまい！"],
    damaged: ["ぐっ、隊形を立て直せ！", "三連星はまだ崩れん！", "俺が落ちるには早い！"]
  },
  mash: {
    attack: ["ガイア、合わせるぞ！", "重い一撃で崩す！", "三連星の圧を受けてみろ！"],
    hit: ["よし、押し込んだ！", "連携が効いている！", "そのまま踏み込め！"],
    miss: ["くそ、タイミングがずれた！", "次は合わせる！", "まだ隊形は崩れていない！"],
    move: ["中段を固める！", "隊の軸を保つ！", "踏み込みの角度を変える！"],
    wait: ["ガイアの合図を待つ。", "隊形維持だ。", "次の突撃に備える！"],
    evade: ["今のは見えていた！", "三連星の足を止められるか！", "まだ隊から離れん！"],
    damaged: ["ぐっ、だが隊形は崩さん！", "まだ踏ん張れる！", "俺が止まれば連携が乱れる！"]
  },
  ortega: {
    attack: ["どけ、叩き潰す！", "俺の一撃で道を開ける！", "三連星の締めは任せろ！"],
    hit: ["へっ、いい手応えだ！", "これで動きは止まったな！", "次もぶち込む！"],
    miss: ["ちっ、避けやがった！", "もう一度叩き込む！", "隊長、次で仕留める！"],
    move: ["側面から潰す！", "勢いを殺すな！", "回り込んで殴る！"],
    wait: ["出番を待つのは性に合わんな！", "合図が来たら突っ込む！", "腕が鳴るぜ！"],
    evade: ["遅いんだよ！", "その程度じゃ止まらん！", "黒い三連星をなめるな！"],
    damaged: ["ぐっ、まだ潰し足りねえ！", "この程度で止まるかよ！", "隊形を崩すな、俺はまだ動ける！"]
  },
  gene: {
    attack: ["先に撃つ！", "やれる、俺がやる！", "先手を取れば勝てる！"],
    hit: ["当たったぞ！", "見たか、俺だってやれる！", "このまま押す！"],
    miss: ["くそ、外した！", "動くな、当てにくい！", "次は当てる！"],
    move: ["近づけばやれる！", "もっと前へ出る！", "逃がすものか！"],
    wait: ["ちっ、今は待つしかないか。", "次の機会を狙う。"],
    evade: ["へっ、当たるかよ。", "見えた、見えたぞ。", "そんな弾に当たるか。"],
    damaged: ["ぐっ、まだだ！", "このくらいで引けるか！", "やられっぱなしじゃ終わらない！"]
  },
  denim: {
    attack: ["落ち着いて撃てばいい。", "隊を乱すな、攻撃する！", "手順通りに仕掛ける。"],
    hit: ["命中した、続けるぞ！", "よし、効果ありだ！", "敵の動きが鈍った。"],
    miss: ["外したか、修正する。", "焦るな、次を狙う。", "射線が悪かった。"],
    move: ["無理せず接近する。", "隊列を保って動く。", "遮蔽を見ながら進む。"],
    wait: ["持ち場を守る。", "勝手に飛び出すな！"],
    evade: ["よし、避けた！", "落ち着けば当たらん。", "敵の狙いが見えた。"],
    damaged: ["被弾した、だが任務は続行だ！", "装甲で受けた、まだ行ける！", "部隊を乱すな、持ち直す！"]
  },
  slender: {
    attack: ["距離を取って撃つ。", "目標を確認、攻撃する！", "不用意には近づかん。"],
    hit: ["当たった、距離を保つ！", "よし、狙い通りだ！", "この位置なら戦える。"],
    miss: ["外れた、位置を変えるか。", "敵の動きが速い。", "深追いはしない。"],
    move: ["回り込む。", "安全な射線を探す。", "少し距離を調整する。"],
    wait: ["ここで様子を見る。", "無理な突入は避ける。"],
    evade: ["距離を取って正解だった。", "危ない、だが避けた！", "まだ捕まらん。"],
    damaged: ["被弾、距離を取り直す！", "深追いは危険だな。", "損傷した、まだ動ける。"]
  },
  cucuruzDoan: {
    attack: ["これ以上、誰も傷つけさせん！", "戦うためではない、守るために動く！", "武器を向けるなら、俺が止める！"],
    hit: ["動きを止めた、命までは取らん！", "退け、ここは戦場にしない！", "子どもたちには近づけさせん！"],
    miss: ["くっ、まだ迷いが残るか。", "殺すための一撃ではない！", "次は止める、必ずだ！"],
    move: ["守るべき場所へ向かう。", "敵を村から遠ざける。", "戦場を広げるわけにはいかない。"],
    wait: ["戦わずに済むなら、それが一番だ。", "ここを守る。", "銃を取らずに済む道を探す。"],
    evade: ["その一撃は受けられん！", "守るためなら避ける！", "俺はまだ倒れられない！"],
    damaged: ["ぐっ、だがここは譲れん！", "痛みなら背負ってきた！", "まだ子どもたちを守れる！"]
  },
  clamp: {
    attack: ["ラル隊、攻撃を開始する！", "隊長の道を開くぞ！", "手堅く仕掛ける！"],
    hit: ["よし、ラル隊の面目は保った！", "敵の足を止めたぞ！", "隊長、今です！"],
    miss: ["照準を修正する！", "慌てるな、隊を崩すな！", "次は当てる！"],
    move: ["隊長を支える位置へ。", "地形を使って回り込む。", "無駄な突出はするな！"],
    wait: ["ラル隊の呼吸を合わせる。", "敵を引きつける。", "隊長の合図を待つ。"],
    evade: ["その程度ではラル隊は止まらん！", "見えている、かわす！", "隊形を崩さず避ける！"],
    damaged: ["被弾したが、まだ隊は動ける！", "隊長の前で倒れられるか！", "損傷確認、戦闘続行！"]
  },
  cozunGraham: {
    attack: ["へへっ、こいつで仕掛ける！", "ラル隊を甘く見るなよ！", "先に撃てばこっちのものだ！"],
    hit: ["当たった、いい感じだ！", "どうだ、見たかよ！", "このまま押してやる！"],
    miss: ["ちっ、避けやがった！", "次は逃がさねえ！", "狙いが甘かったか！"],
    move: ["前へ出るぞ！", "隊長に続く！", "撃ちやすい位置に回る！"],
    wait: ["待つのは性に合わねえな。", "敵が来たらすぐ撃つ。", "ラル隊の出番を待つ。"],
    evade: ["当たるかよ！", "その狙いじゃ遅い！", "まだ捕まらねえ！"],
    damaged: ["ぐっ、やりやがったな！", "まだ落ちてたまるか！", "ラル隊をなめるなよ！"]
  },
  acous: {
    attack: ["接近して叩く！", "ラル隊の腕を見せる！", "この距離ならいける！"],
    hit: ["よし、手応えあり！", "敵の態勢が崩れた！", "このまま続けるぞ！"],
    miss: ["くそ、踏み込みが浅い！", "次はもっと詰める！", "まだ勝負はこれからだ！"],
    move: ["近い間合いへ入る。", "隊長の側面を固める。", "遮蔽を使って進む！"],
    wait: ["隊長の命令を待つ。", "焦るな、近づく機会は来る。", "味方の動きに合わせる。"],
    evade: ["危ないが、見えた！", "そう簡単には当たらん！", "ラル隊の足を止めるな！"],
    damaged: ["被弾した、だがまだ行ける！", "この程度で下がれるか！", "隊長、まだ戦えます！"]
  },
  crown: {
    attack: ["ここで敵を止める！", "大気圏に入る前に仕留める！", "任務を果たすんだ！"],
    hit: ["よし、当たった！", "このまま追う！", "敵の動きが鈍ったぞ！"],
    miss: ["くそ、時間がない！", "次で決める！", "高度が落ちる前に！"],
    move: ["追撃位置へ入る！", "離されるわけにはいかない！", "危険高度でも任務を続ける！"],
    wait: ["まだ追える……はずだ。", "任務を捨てるわけにはいかない。", "進入角に気をつける。"],
    evade: ["危ない、機体が流される！", "まだ制御できる！", "ここで燃え尽きるわけには！"],
    damaged: ["機体が熱を持っている……！", "くっ、まだ離脱できない！", "大気が、機体を持っていく！"]
  },
  demitry: {
    attack: ["ザクレロの爪を味わえ！", "一気に切り裂く！", "この機動についてこられるか！"],
    hit: ["へっ、派手に決まったな！", "その装甲、裂いてやったぞ！", "このまま突っ切る！"],
    miss: ["ちっ、暴れすぎたか！", "次はもっと近くでやる！", "避けるな、面白くない！"],
    move: ["突撃コースへ入る！", "一気に距離を詰める！", "止まったら的だ、動け！"],
    wait: ["突っ込む機会を待つ。", "爪を研いでおくか。", "次の獲物を探す。"],
    evade: ["そんな弾、置いていく！", "ザクレロを止められるかよ！", "まだまだ加速できる！"],
    damaged: ["くそ、派手にやられた！", "爪はまだ折れてないぞ！", "この程度で止まるか！"]
  },
  tokwan: {
    attack: ["ビグロの加速で突き抜ける！", "目標へ一撃離脱をかける！", "この速度なら捉えられまい！"],
    hit: ["直撃、離脱する！", "よし、機動力で勝った！", "敵の反応が追いついていない！"],
    miss: ["進入角が浅かったか！", "次は軌道を変える！", "速度を殺しすぎたな！"],
    move: ["高速接近に入る！", "死角へ回り込む！", "広い宙域を使う！"],
    wait: ["突入タイミングを計る。", "機体の速度を活かす。", "敵の射線を見極める。"],
    evade: ["その照準では遅い！", "ビグロの機動を読めるか！", "紙一重で抜けた！"],
    damaged: ["損傷したが、推力は残っている！", "速度を落とすな！", "まだ一撃離脱はできる！"]
  },
  tennesJung: {
    attack: ["さぁて、ジオン狩りと洒落こむか！", "テネス・A・ユング、行くぞ！", "楽しいぜ、獲物を見つけた瞬間はよ！"],
    hit: ["いい手応えだ、次の獲物はどいつだ！", "逃げ足よりこっちの腕が上だったな！", "撃墜スコアに加えておくぜ！"],
    miss: ["ちっ、今のを避けるか！", "面白い、もう一度狙ってやる！", "次は逃がさねえぞ！"],
    move: ["獲物が見える位置へ出る！", "前に出る、狙撃だけが能じゃないぜ！", "戦果を稼ぐには足も使わねえとな！"],
    wait: ["焦るな、いい獲物を待つ。", "見えた瞬間に撃ち抜く。", "楽しい狩り場になりそうだ。"],
    evade: ["その腕で俺を落とせるかよ！", "遅い遅い、狙いが読めるぜ！", "へっ、かすりもしねえ！"],
    damaged: ["やるじゃねえか、燃えてきたぜ！", "この程度で狩られる俺じゃねえ！", "痛ぇな、礼は倍にして返す！"]
  },
  challiaBull: {
    attack: ["今は信じよう、私の能力とやらを！", "ブラウ・ブロ、攻撃を開始する！", "敵の動きが、読める気がする！"],
    hit: ["やはり、そこに来たか！", "私の勘も捨てたものではないな！", "敵の意識を捉えた！"],
    miss: ["能力に頼りすぎたか。", "見えたつもりで外すとはな。", "次は感覚を研ぎ澄ます！"],
    move: ["敵の気配を追う。", "キシリア様の命、果たさねばならん。", "危うい立場だが、退けはしない。"],
    wait: ["私は多少、人より勘が良いという程度なのだがな。", "焦るな、敵の意識を待つ。", "ギレン閣下の思惑も、キシリア様の視線も重いな。"],
    evade: ["来る方向は分かっていた！", "その一撃、感じ取れたぞ！", "まだ私の勘は働いている！"],
    damaged: ["くっ、読み切れなかったか！", "この重圧、戦場だけではないな。", "まだ任務は終わっていない！"]
  },
  cuscoAl: {
    attack: ["私をすげなくした報いを受けなさい！", "いいわ、あなたになら……でも手加減はしない！", "この感覚、あなたにも届くかしら！"],
    hit: ["感じたでしょう、今の一撃を！", "あなたの心に届いたはずよ！", "私の力、見くびらないで！"],
    miss: ["触れたと思ったのに……！", "心が乱れたわね。", "次はもっと深く感じ取る！"],
    move: ["あなたの気配を追うわ。", "この距離なら、心が届く。", "エルメスの力を引き出す。"],
    wait: ["見つめ合うだけでは終われない。", "私の声、聞こえている？", "戦場で出会うしかなかったのね。"],
    evade: ["あなたの迷い、見えたわ！", "そこから撃つのは分かっていた！", "まだ私を捕まえられない！"],
    damaged: ["痛い……けれど、まだ届く！", "そんなに拒むのね！", "いいわ、あなたになら……！"]
  },
  shinMatsunaga: {
    attack: ["狼が野良犬如きに噛まれるものか！", "白狼の名に懸けて斬り込む！", "ドズル閣下の期待、裏切りはせん！"],
    hit: ["見たか、これが白狼の牙だ！", "マツナガの家名、汚しはしない！", "よし、敵の陣形を崩した！"],
    miss: ["踏み込みが浅かったか！", "まだ勝負は終わっていない！", "狼の牙は次で届く！"],
    move: ["前線へ出る、続け！", "ドズル閣下の道を開く！", "白い機体を見失うなよ！"],
    wait: ["焦って牙を鈍らせるな。", "好機を待つのも武人の務め。", "部下を無駄死にさせるわけにはいかん。"],
    evade: ["その程度で白狼は捕らえられん！", "遅い、間合いは読めている！", "狼の足を止められると思うな！"],
    damaged: ["ぐっ、だが誇りは折れん！", "ドズル閣下に顔向けできなくなる！", "白狼はまだ牙を失っていない！"]
  },
  johnnyRidden: {
    attack: ["悪いがお先に行かせてもらうぜ！", "余所見してると怪我じゃ済まないぜ！", "真紅の稲妻、派手に行くぜ！"],
    hit: ["どうだ、稲妻は見えたか！", "遅れた奴ぁ、後ろで花火見物でもしてな！", "悪いな、こっちが一枚上手だ！"],
    miss: ["ちっ、派手に外しちまったか！", "今のを避けるとは、やるじゃないか！", "次はもっと速く叩き込む！"],
    move: ["先に行くぜ、遅れるなよ！", "目立つ色には、それだけの腕が要るんでね！", "一気に間合いを詰める！"],
    wait: ["急ぎすぎても稲妻は落ちないさ。", "出番を待つのも人気者の仕事ってな。", "シャアと間違えるなよ、俺は俺だ。"],
    evade: ["その程度じゃ赤い残像しか撃てないぜ！", "おっと、危ない危ない！", "見えてるぜ、照準が甘い！"],
    damaged: ["やってくれるじゃないか！", "真紅の機体に傷をつけた代金は高いぜ！", "まだまだ、見物はこれからだ！"]
  },
  flanaganBoone: {
    attack: ["水中から仕掛ける！", "浮上前に叩くぞ！", "こちらの海に入ったのが運の尽きだ！"],
    hit: ["よし、沈めたぞ！", "水中戦ならこちらが上だ！", "敵の足を止めた！"],
    miss: ["水流が邪魔をしたか！", "次は距離を詰める！", "まだ海はこちらのものだ！"],
    move: ["深度を変える。", "水中から回り込む！", "敵の死角へ潜る！"],
    wait: ["音を聞け、敵は近い。", "浮上の機会を待つ。", "水中では焦った方が負ける。"],
    evade: ["水の中なら避けられる！", "その射線では届かん！", "泡に紛れて外す！"],
    damaged: ["浸水を止めろ！", "くっ、水中でも被弾するか！", "まだ浮上するわけにはいかん！"]
  },
  dren: {
    attack: ["艦砲、目標へ集中！", "援護射撃を開始する！", "敵の進路を塞げ！"],
    hit: ["命中、よくやった！", "そのまま圧力をかけろ！", "敵の隊列が乱れた。"],
    miss: ["次弾で修正しろ！", "照準を合わせ直せ！", "慌てるな、距離はある。"],
    move: ["艦を適正位置へ。", "戦列を整える。", "支援しやすい位置へ移る。"],
    wait: ["この距離を維持する。", "各員、警戒を怠るな！"],
    evade: ["敵弾、回避した。", "針路そのまま、警戒を続けろ！", "被弾は避けられたな。"],
    damaged: ["損害を報告しろ！", "慌てるな、艦はまだ動く！", "応急処置を急がせろ！"]
  },
  dozle: {
    attack: ["砲撃を集中させろ！", "正面から叩き潰す！", "怯むな、撃て！"],
    hit: ["押し潰せ！", "よし、その調子だ！", "敵に立て直す暇を与えるな！"],
    miss: ["次弾を急がせろ！", "その程度で止まるな！", "当たるまで撃て！"],
    move: ["艦を進めろ！", "前に出て圧をかける！", "戦線を押し上げる！"],
    wait: ["陣形を崩すな！", "守るべきものを忘れるな！", "腰を据えて迎え撃つ。"],
    evade: ["その程度、避けてみせろ！", "よし、艦を揺らすな！", "まだ沈められんぞ！"],
    damaged: ["この程度で怯むな！", "被害など恐れるな、前を見ろ！", "装甲が剥げても戦える！"]
  },
  kerguelenGirl: {
    attack: ["支援射撃、行います！", "敵の接近を止めます！", "できる範囲で援護します。"],
    hit: ["命中しました！", "よかった、当たりました！", "このまま距離を保ちます。"],
    miss: ["外れました、すみません。", "もう一度合わせます。", "敵が速いです。"],
    move: ["安全圏へ移動します。", "退路を確保します。", "味方の後ろにつきます。"],
    wait: ["支援準備を続けます。", "今は耐える場面です。"],
    evade: ["よかった、外れました！", "まだ大丈夫です。", "射線から外れます。"],
    damaged: ["被弾しました、でも支援は続けます！", "損傷確認、落ち着きます。", "味方を帰すまで持たせます！"]
  },
  zenna: {
    attack: ["支援射撃、入ります！", "味方を下げるための一撃です。", "敵の足を止めます！"],
    hit: ["命中しました！", "敵の動きが鈍りました。", "支援、効果ありです！"],
    miss: ["回避されました。", "射角が足りませんでした。", "次は落ち着いて合わせます。"],
    move: ["艦の姿勢を整えます。", "味方を収容しやすい位置へ。", "安全な航路を取ります。"],
    wait: ["支援準備を続けます。", "周辺を警戒します。", "味方の帰投を待ちます。"],
    evade: ["回避できました！", "敵の射線を外します。", "この距離ならまだ保てます。"],
    damaged: ["損傷確認、支援は続けます！", "揺れます、落ち着いてください！", "応急対応に入ります。"]
  },
  oliverMay: {
    attack: ["武装データを取ります。", "実戦での挙動を確認します。", "記録を取りながら撃ちます。"],
    hit: ["命中、データとしては十分です。", "効果を確認しました。", "この反応は記録しておきます。"],
    miss: ["外れました、原因を洗います。", "照準系の癖が出ています。", "次は補正値を変えます。"],
    move: ["観測しやすい位置へ。", "機体への負荷を抑えて動きます。", "整備を考えた位置に移ります。"],
    wait: ["記録を整理します。", "整備班に回す準備をします。", "次の試験条件を確認します。"],
    evade: ["回避挙動を記録しました。", "今の反応は良好です。", "被弾なし、データ継続。"],
    damaged: ["損傷データを記録します。", "被弾時の挙動を確認。", "まだ試験は継続可能です。"]
  }
,
  texanDimitry: {
    attack: ["俺は顔だけの男じゃないぜ……！", "二枚目は負けないって、相場が決まってるんでね！", "見惚れてる間に落とすぜ！"],
    hit: ["どうだい、決まったろ！", "顔だけじゃないって言っただろ！", "この調子で派手にいくぜ！"],
    miss: ["ちっ、今のは見せ場を逃したな！", "次はもっと男前に当てる！", "外しても絵になるってのは困りもんだ！"],
    move: ["いい角度から入るぜ！", "風向きはこっちにある！", "二枚目らしく華麗に回る！"],
    wait: ["焦る場面じゃないな！", "ここは格好よく待つとするか！", "見せ場は逃さないぜ！"],
    evade: ["惜しかったな、顔は傷つけさせないぜ！", "その程度じゃ俺は落とせない！", "悪いね、避けるのも得意でさ！"],
    damaged: ["くっ、顔に傷はついてないだろうな！", "まだ落ちるほど安くないぜ！", "熱くなってきたじゃないか！"]
  },
  jackBayard: {
    attack: ["僕にどこまで出来るか……いや、やってみせる！", "護衛対象を守るんだ、攻撃開始！", "ここで退いたら隊長失格だ！"],
    hit: ["よし、危険は回避されました！", "このまま護衛を続けます！", "当てた、まだやれます！"],
    miss: ["慌てるな、次で立て直す！", "僕が乱れたら隊が乱れる……！", "もう一度、照準を合わせます！"],
    move: ["護衛線を詰めます！", "脱出路を確保します！", "隊を崩さず移動します！"],
    wait: ["周囲警戒、怠らないでください！", "危険はまだ去っていません！", "僕がここで支えます！"],
    evade: ["もう大丈夫です、危険は回避されました！", "危なかった、でも守り切る！", "敵の射線を外しました！"],
    damaged: ["被弾しました、でも護衛は続けます！", "隊長として退けないんだ！", "まだ危険は終わっていません！"]
  },
  adamStingray: {
    attack: ["さぁて、手当たり次第にぶっ壊してくれるぜ！", "隊長殿、道は俺が開けますぜ！", "邪魔する奴は叩き潰す！"],
    hit: ["へっ、いい音したじゃねえか！", "これで道が開いたな！", "隊長殿、今のうちですぜ！"],
    miss: ["ちっ、避けやがった！", "まだ終わりじゃねえ、次だ！", "狙い直してぶっ壊す！"],
    move: ["前に出ますぜ、隊長殿！", "護衛対象から離れすぎるなよ！", "荒っぽく行くぜ！"],
    wait: ["後は頼みますぜ、隊長殿ッ！", "ここで踏ん張るしかねえな！", "敵が来るなら迎えてやる！"],
    evade: ["へっ、当たるかよ！", "その程度なら読めてるぜ！", "危ねえが、まだ動ける！"],
    damaged: ["中破くらいで止まるかよ！", "後は頼みますぜ、隊長殿ッ！", "避難民に手は出させねえ！"]
  },
  woody: {
    attack: ["ジャブローを好きにさせるものか！", "この修理に全力をかけているんだ！", "人にはそれくらいしかできんのさ……！"],
    hit: ["よし、足止めにはなった！", "甘いものではないんだぞ！", "この隙に整備班を下げろ！"],
    miss: ["くそ、慣れない機体だ！", "落ち着け、まだやれる！", "もう一度、進路を合わせる！"],
    move: ["修理区画から敵を離す！", "迎撃位置へ向かう！", "マチルダが守った艦を守るんだ！"],
    wait: ["修理作業を止めるな！", "ここで食い止める！", "全力をかけている、邪魔はさせん！"],
    evade: ["危ない、だがまだ飛べる！", "ここで落ちるわけにはいかん！", "敵の突進をかわしたぞ！"],
    damaged: ["ぐっ、コックピットは持つか！", "甘くはないな、戦争というものは！", "まだ修理は終わっていないんだ！"]
  },
  reed: {
    attack: ["貴様、後退せんのか！攻撃しろ！", "軍法会議もんだぞ、いいな！", "敵を近づけるな、撃て！"],
    hit: ["よし、それでいい！", "これで少しは持つだろう！", "敵の足を止めたな！"],
    miss: ["何をしている、照準を直せ！", "軍機違反で済まんぞ！", "次は外すなよ！"],
    move: ["進路を変える、急げ！", "大気圏突入コースを守るんだ！", "艦を下げる、援護しろ！"],
    wait: ["命令を待て、勝手に動くな！", "この状況で無茶はできん！", "貴様ら、警戒を怠るな！"],
    evade: ["ふう、当たらんで済んだか！", "今のは危なかったぞ！", "艦を揺らすな、態勢を保て！"],
    damaged: ["負傷者を下げろ！", "なんということだ、被害を報告しろ！", "軍法会議どころではないな……！"]
  },
  tianem: {
    attack: ["キシリアからの増援だな、到着前に決着をつける！", "ルウムの借りを返してくれる！", "艦隊砲撃、開始せよ！"],
    hit: ["よし、勝利は揺るがん！", "そのまま押し切るぞ！", "敵戦列に穴が開いた！"],
    miss: ["次弾を修正しろ！", "相手も必死だ、油断するな！", "艦隊の射線を整え直せ！"],
    move: ["ソーラシステムの射線を守れ！", "艦隊を前進させる！", "包囲を狭めるぞ！"],
    wait: ["増援が来る前に仕留める！", "全艦、陣形を維持せよ！", "勝機はここにある！"],
    evade: ["敵の砲撃を外したか！", "艦隊の統制は崩すな！", "まだ指揮は続けられる！"],
    damaged: ["ビグ・ザムの突進を止めろ！", "被害を恐れるな、作戦を続行する！", "ルウムの借り、まだ返しきっておらん！"]
  },
  lydoWolf: {
    attack: ["黒の称号は伊達じゃないぜ！", "俺が黒い死神だ！覚えときな！", "黒い機体を見たら逃げるんだったな！"],
    hit: ["覚えたか、黒い死神を！", "いい狙いだ、次も行く！", "そのまま沈めてやる！"],
    miss: ["ちっ、今のを避けるか！", "死神から逃げ切れると思うなよ！", "次は黒い弾痕を刻む！"],
    move: ["影から回り込む！", "黒く塗った意味を見せてやる！", "死角を取るぜ！"],
    wait: ["獲物が来るのを待つさ！", "焦る必要はない、黒は目立たないからな！", "次の一撃で決める！"],
    evade: ["黒の称号は伊達じゃない！", "その狙いじゃ俺は捕まらん！", "死神を撃つには遅いな！"],
    damaged: ["くっ、黒い機体が目立ちすぎたか！", "まだ未帰還には早いぜ！", "死神が簡単に落ちるかよ！"]
  },
  francisBackmeyer: {
    attack: ["さあて、腕の違いを見せてやるか！", "獲物は逃がさない、そこだ！", "僕の射線に入ったのが運の尽きだ！"],
    hit: ["ほらな、計算通りだ！", "凡人にはこの距離は読めないさ！", "次の獲物を探すとしよう！"],
    miss: ["ちっ、今のを避けるのか！", "少しは見込みがあるじゃないか！", "次は外さない、覚えておけ！"],
    move: ["狙撃位置を変える。", "ここなら敵を見下ろせるな！", "射線を確保する、邪魔はするなよ！"],
    wait: ["焦る必要はない、獲物は来る。", "僕の距離に入るまで待つ。", "天才は無駄弾を撃たないものさ。"],
    evade: ["その狙いじゃ僕には届かない！", "見え見えだ、悪いな！", "狙撃手を狙うには甘い！"],
    damaged: ["くっ、僕に傷をつけたな！", "まだ勝負は終わってないぞ！", "この程度で天才は止まらない！"]
  },
  garryRogers: {
    attack: ["もたもたしてると置いてくぜ！", "スピードに乗って仕掛ける！", "ギャリー・ロジャース、突っ込むぜ！"],
    hit: ["どうだ、追いつけなかったろ！", "この速さなら押し切れる！", "よし、いい勢いだ！"],
    miss: ["くそ、スピードが乗らねえ！", "曲がりすぎたか、次だ！", "南無三、今のは惜しい！"],
    move: ["もっと速く行くぜ！", "一気に回り込む！", "遅い奴から置いていくぞ！"],
    wait: ["加速するタイミングを待つ。", "まだ踏み込むには早いか。", "エンジンを冷やす暇もないな！"],
    evade: ["へっ、遅い遅い！", "その弾速じゃ捕まらねえ！", "こっちは軽いんだ、当たるかよ！"],
    damaged: ["ちっ、軽装甲が響いたか！", "まだ速度は落ちてねえ！", "当たっただけで止まると思うな！"]
  },
  ronKou: {
    attack: ["敵とコンタクト、攻撃します！", "出来るだけのことはやってみせます！", "目標確認、ロン・コウ、仕掛けます！"],
    hit: ["命中、効果を確認！", "よし、今の感覚を保ちます！", "このまま支援を続けます！"],
    miss: ["外しました、修正します！", "敵の機動を読み直します。", "次弾で合わせます！"],
    move: ["射線を取り直します。", "支援できる位置へ移動します。", "無理せず距離を保ちます。"],
    wait: ["観測を続けます。", "味方の動きに合わせます。", "ここなら援護できます。"],
    evade: ["危なかった、でも見えています！", "射線から外れます！", "まだ被弾するわけにはいきません！"],
    damaged: ["被弾しました、戦闘は続けられます！", "損傷確認、まだ支援できます！", "ここで退くには早い！"]
  },
  heinzBaer: {
    attack: ["オラオラ、雑魚は引っ込んでな！", "重装甲で押し通る！", "はっはっは、まとめて相手してやる！"],
    hit: ["どうだ、効いただろう！", "お見通しよ、その程度はな！", "よし、次も叩き込む！"],
    miss: ["むう、身軽な奴め！", "次は逃げ道ごと潰す！", "大振りすぎたか、もう一発だ！"],
    move: ["正面から行くぞ！", "重くても進めるんだよ！", "敵の前に立ちはだかる！"],
    wait: ["どっしり構えて迎え撃つ！", "逃げる必要などない！", "かかってこい、受け止めてやる！"],
    evade: ["はっはっは、見えているぞ！", "その程度ならかわしてみせる！", "大柄だから当てやすいと思ったか！"],
    damaged: ["効いたぞ、だがまだ装甲は厚い！", "豪快に来るじゃないか！", "その程度でこの機体は止まらん！"]
  },
  denBazark: {
    attack: ["戦闘データは取らせてもらう！", "潜入は終わりだ、制圧に移る！", "情報は十分、こちらの勝ち筋だ！"],
    hit: ["データ通りだ、私の勝ちだ！", "敵の動きは読めている！", "よし、攻略作戦を続行する！"],
    miss: ["手間を取らせてくれる！", "想定外だ、再評価する！", "次は逃がさん！"],
    move: ["侵入経路を変更する。", "目標へ接近する。", "観測しやすい位置を取る。"],
    wait: ["情報を整理する。", "まだ手札は見せない。", "敵の配置を洗い出す。"],
    evade: ["読めていれば避けられる！", "その攻撃は記録済みだ！", "当てるには情報が足りないな！"],
    damaged: ["くっ、装甲データに誤差ありか！", "まだ任務は破綻していない！", "被害を記録、作戦を続ける！"]
  },
  leroyGilliam: {
    attack: ["このプレッシャーに負けてたまるか！", "俺だってニュータイプ部隊なんだ！", "狙える、今なら撃てる！"],
    hit: ["当たった、俺にもできる！", "よし、圧力を押し返したぞ！", "この感覚を逃がすな！"],
    miss: ["くそ、手が震えたか！", "プレッシャーに飲まれるな！", "次は迷わない！"],
    move: ["距離を取り直す！", "シャア大佐の隊列に遅れるな！", "落ち着け、敵意に飲まれるな……！"],
    wait: ["この感覚は何なんだ……！", "焦るな、状況を見ろ。", "撃つべき時を待つ。"],
    evade: ["見えた、今のは見えたぞ！", "危ない、何とか外した！", "この程度の圧で潰れるか！"],
    damaged: ["くっ、これが実戦か！", "俺は取り返しのつかないことを……いや、まだだ！", "まだ落ちるわけにはいかない！"]
  },
  boraskiniv: {
    attack: ["出てこい、始末してやる！", "この砲撃で足止めする！", "砲台になってでも隊を守る！"],
    hit: ["よし、足が止まったな！", "この火力なら押さえ込める！", "隊を進ませろ、道は開く！"],
    miss: ["外したか、砲身を回せ！", "動きの速い奴め！", "次は逃がさん！"],
    move: ["射界を取り直す。", "上流から押し込む！", "重い機体だ、無理はできん！"],
    wait: ["ここで砲台になる！", "味方が抜けるまで守る。", "敵が出てくるのを待つ！"],
    evade: ["鈍重だと思ったか！", "まだ射線から外れられる！", "その程度なら持ちこたえる！"],
    damaged: ["直撃か、だがまだ撃てる！", "砲台は簡単には沈まん！", "隊を守るまで倒れんぞ！"]
  },
  ianGreydon: {
    attack: ["見えるぞ、お前の動きが！", "先を読めば当てられる！", "その進路、読ませてもらった！"],
    hit: ["やはりそこへ来たな！", "先読み通りだ！", "ザク・キャノンでも戦果は挙げられる！"],
    miss: ["読み違えたか！", "意思の光が乱れた……！", "次は進路を絞る！"],
    move: ["射角を作る。", "敵の意思を読む位置へ。", "砲撃点を変える！"],
    wait: ["その程度で私を捉えることはできん！", "敵の動きを待つ。", "焦らず未来の射線を見る。"],
    evade: ["その程度では捉えられん！", "見えているぞ、その狙い！", "砲撃型でも避けられる！"],
    damaged: ["くっ、読みに隙があったか！", "まだ砲は生きている！", "被弾したが、戦果は譲らん！"]
  },
  hamon: {
    attack: ["我が隊のしぶとさ、見せてあげよう！", "あなた、守ってくださいましね！", "ラル隊の意地、ここで見せます！"],
    hit: ["お見事、これで道が開けます！", "しぶとさでは負けませんわ！", "ラルの名に恥じぬ一撃です！"],
    miss: ["まだ終わりではありませんわ！", "落ち着いて、次を狙います！", "弔い合戦はここからです！"],
    move: ["隊をまとめ直します！", "あなたの背を追いますわ！", "この位置なら支えられます！"],
    wait: ["守ってくださいましね。", "焦りは禁物ですわ！", "部下たちを無駄にはしません！"],
    evade: ["その程度では止まりませんわ！", "まだ倒れるわけにはいきません！", "ラル隊はしぶといのです！"],
    damaged: ["この痛み、忘れませんわ！", "弔いはまだ終わっておりません！", "あなた……まだ私は戦えます！"]
  },
  conscon: {
    attack: ["若造になめられる訳にはいかんのだ！全機発進させい！", "リック・ドム隊、攻撃開始！", "木馬をここで沈めるぞ！"],
    hit: ["よし、面目は保てるな！", "そのまま押し切れ！", "若造どもに思い知らせてやれ！"],
    miss: ["何をしている、相手は一隻だぞ！", "照準を合わせ直せ！", "まだ戦力はこちらが上だ！"],
    move: ["包囲を狭めろ！", "木馬の逃げ道を塞げ！", "全機、前へ出ろ！"],
    wait: ["若造になめられる訳にはいかんのだ！", "全滅などありえん……ありえんぞ！", "まだこちらには数がある！"],
    evade: ["ふん、今のは外れたか！", "この程度で怯むな！", "艦を揺らすな、攻撃を続けろ！"],
    damaged: ["ぜ、全滅！？いや、まだだ！", "3分も経たずにだと……！？", "なんという相手だ、木馬め！"]
  },
  gadem: {
    attack: ["素人め、間合いが遠いわ！", "わしとて百戦錬磨よ、若い連中には負けん！", "旧式でも腕で補えるわ！"],
    hit: ["どうだ、間合いを読めん若造め！", "まだまだ前線の連中には負けんわ！", "補給部隊を甘く見るな！"],
    miss: ["ぬう、機体の差が出おったか！", "次はもっと詰める！", "年寄り扱いするでないわ！"],
    move: ["間合いを詰めるぞ！", "補給を済ませるまで退けん！", "旧ザクでも戦場は渡れる！"],
    wait: ["焦るな、間合いを測るのだ！", "補給部隊の意地を見せる！", "シャアへの補給は完遂する！"],
    evade: ["素人め、そこでは当たらん！", "わしの間合いではないわ！", "百戦錬磨をなめるな！"],
    damaged: ["ぐっ、性能差はどうにもならんか！", "まだじゃ、まだ補給は終わっとらん！", "旧式だからと侮るな！"]
  },
  akahana: {
    attack: ["敵地に潜入完了、攻撃行動に入る！", "爆破目標を確認、仕掛ける！", "静かに近づいて、一気に叩く！"],
    hit: ["よし、工作成功だ！", "施設に損害を与えた！", "このまま撤収に移る！"],
    miss: ["くそ、気づかれたか！", "やり直す、まだ潜れる！", "騒ぎになる前に仕留める！"],
    move: ["潜入経路を進む！", "見つかる前に移動する！", "水路から回り込むぞ！"],
    wait: ["まだ姿を見せるな！", "爆破の機会を待つ！", "敵の巡回をやり過ごす！"],
    evade: ["見つかってたまるか！", "その射線からは外れた！", "潜入任務はまだ続行できる！"],
    damaged: ["なんて奴だ、あ、当ててきやがった！", "潜入がばれた、離脱する！", "くそ、作戦が狂った！"]
  },
  flanagan: {
    attack: ["この敵、素養があるようだな！", "君の素質を見せてもらおうか！", "サイコミュの反応を記録する！"],
    hit: ["よろしい、反応は明確だ！", "これがニュータイプの兆候か！", "実験としては興味深い！"],
    miss: ["うーむ、触れてはならんものに触れたか……！", "反応が不安定だ、再計測する！", "まだ解析が足りんな！"],
    move: ["観測距離を調整する！", "研究対象を見失うな！", "安全な位置から記録する！"],
    wait: ["君の素質を見せてもらおうか！", "データが揃うまで待つ！", "この反応、見逃すわけにはいかん！"],
    evade: ["ふむ、危険を察知したか！", "研究者にも退く時は分かる！", "被弾は実験に支障が出る！"],
    damaged: ["うーむ、触れてはならんものに触れてしまったのか……！", "機材が損傷した、記録を守れ！", "まだ研究は終わっておらん！"]
  }
,
  kerguelenGirl: {
    attack: ["支援射撃、行います！", "アイナ様、援護に入ります！", "ノリス大佐の信号、確認しました！"],
    hit: ["命中しました、支援成功です！", "このまま味方を帰します！", "よかった、当たりました！"],
    miss: ["外れました、すみません！", "もう一度合わせます！", "敵が速いです！"],
    move: ["安全圏へ移動します！", "味方の後ろにつきます！", "生きてまた、サイド3へ帰るために！"],
    wait: ["アイナ様、ノリス大佐から発煙信号です！", "支援準備を続けます！", "生きてまた、サイド3でお会いしましょう！"],
    evade: ["よかった、外れました！", "まだ大丈夫です！", "射線から外れました！"],
    damaged: ["被弾しました、でも支援は続けます！", "損傷確認、落ち着きます！", "味方を帰すまで持たせます！"]
  },
  federationSoldier: {
    attack: ["目標を攻撃する！", "連邦軍、撃ちます！", "敵機を止める！"],
    hit: ["命中、効果あり！", "よし、当たった！", "このまま押し返す！"],
    miss: ["外した、照準を修正！", "くそ、動きが速い！", "次弾で合わせる！"],
    move: ["前進する！", "射線を取り直す！", "味方と歩調を合わせる！"],
    wait: ["命令を待つ。", "周囲を警戒する。", "隊列を維持する。"],
    evade: ["危ない、外れた！", "回避できた！", "まだやられない！"],
    damaged: ["被弾した、まだ動ける！", "損傷確認、戦闘続行！", "くっ、持ちこたえる！"]
  },
  federationVeteran: {
    attack: ["焦るな、確実に当てる！", "敵の動きは読めている！", "若い連中には任せきれん！"],
    hit: ["狙い通りだ！", "次の目標へ移る！", "このまま戦線を押し上げる！"],
    miss: ["読みが浅かったか！", "照準を修正する！", "次は逃がさん！"],
    move: ["有利な位置を取る！", "隊列を崩すな！", "味方の穴を埋める！"],
    wait: ["敵の出方を見る。", "急ぐ必要はない。", "周囲を警戒しろ。"],
    evade: ["その狙いは見えていた！", "まだ勘は鈍っていない！", "直撃は避けた！"],
    damaged: ["被弾したが支障はない！", "まだ戦える！", "装甲が持つうちに片を付ける！"]
  },
  federationOfficer: {
    attack: ["全機、攻撃を開始せよ！", "目標を集中して叩く！", "連邦軍の底力を見せる！"],
    hit: ["命中確認、前進せよ！", "よし、作戦を続行する！", "敵陣を崩したぞ！"],
    miss: ["慌てるな、射線を整えろ！", "次弾で修正する！", "敵の進路を読み直せ！"],
    move: ["隊を前進させる！", "支援可能な位置へ移る！", "陣形を維持せよ！"],
    wait: ["命令があるまで待機！", "警戒を続けろ！", "戦線を維持する！"],
    evade: ["敵弾、回避した！", "隊列を乱すな！", "まだ指揮は執れる！"],
    damaged: ["損害を確認、戦闘続行！", "この程度で指揮は止めん！", "各員、持ち場を守れ！"]
  },
  federationTankCrew: {
    attack: ["砲撃開始！", "正面の敵を叩く！", "主砲、撃て！"],
    hit: ["直撃だ！", "敵の足を止めた！", "次弾を装填しろ！"],
    miss: ["照準がずれた、修正！", "次は足を狙う！", "砲身を回せ！"],
    move: ["地形を使って進む！", "射界を取り直す！", "足場に気をつけろ！"],
    wait: ["ここで迎え撃つ！", "砲撃位置を維持する！", "敵が来るまで待つ！"],
    evade: ["危ない、かすめた！", "直撃は避けた！", "まだ履帯は動く！"],
    damaged: ["装甲を抜かれた！", "損傷したが砲は生きている！", "戦車隊の意地を見せろ！"]
  },
  zeonSoldier: {
    attack: ["ジオンのために！", "敵機を落とす！", "攻撃を開始する！"],
    hit: ["命中したぞ！", "このまま押し込む！", "連邦め、思い知れ！"],
    miss: ["外した、照準を修正する！", "ちっ、すばしこい！", "次は当てる！"],
    move: ["前へ出る！", "隊長機に続け！", "射線を確保する！"],
    wait: ["命令を待つ。", "周囲を警戒する。", "戦線を維持する。"],
    evade: ["当たるものか！", "危なかった！", "まだ戦える！"],
    damaged: ["被弾した、だが動ける！", "くっ、戦闘を続行する！", "ジオン兵の意地を見せる！"]
  },
  zeonVeteran: {
    attack: ["戦場の歩き方を教えてやる！", "その隙は見逃さん！", "確実に仕留める！"],
    hit: ["甘いな！", "次の敵を狙う！", "経験の差が出たな！"],
    miss: ["少し読み違えたか！", "次弾で仕留める！", "まだ勝負はこれからだ！"],
    move: ["敵の側面へ回る！", "若い奴らを先に行かせるな！", "有利な間合いを取る！"],
    wait: ["焦れば敵の思うつぼだ。", "敵の出方を読む。", "隊列を保て！"],
    evade: ["見え見えだ！", "その程度では当たらん！", "戦場勘は鈍っていない！"],
    damaged: ["装甲を抜かれたか！", "まだ機体は応える！", "この程度で退けるか！"]
  },
  zeonOfficer: {
    attack: ["全機、攻撃開始！", "ジオン公国軍の力を示せ！", "目標を集中攻撃する！"],
    hit: ["よし、戦線を押し上げろ！", "命中確認、作戦続行！", "敵の陣形を崩したぞ！"],
    miss: ["照準を修正しろ！", "慌てるな、次がある！", "敵の進路を封じる！"],
    move: ["全機、前進せよ！", "陣形を維持する！", "部隊を再配置する！"],
    wait: ["各機、警戒を続けろ！", "命令があるまで待機！", "戦線を維持せよ！"],
    evade: ["敵弾回避、隊列を崩すな！", "まだ指揮系統は健在だ！", "その程度では止められん！"],
    damaged: ["損害を報告しろ！", "指揮は私が執る、戦闘続行！", "怯むな、持ち場を守れ！"]
  },
  zeonAquaticSoldier: {
    attack: ["水中から仕留める！", "魚雷、発射！", "この海は我々の領域だ！"],
    hit: ["水圧ごと叩き込んだ！", "命中、敵の動きが鈍った！", "水中戦なら負けん！"],
    miss: ["水流にずらされたか！", "深度を合わせ直す！", "次は逃がさん！"],
    move: ["深度を保って進む！", "海底地形を利用する！", "気づかれる前に回り込む！"],
    wait: ["水中で機会を待つ。", "ソナー反応を追う。", "敵が入ってくるのを待つ！"],
    evade: ["水中でこちらを捉えられるか！", "深度を変えて避ける！", "魚雷の軌道を外した！"],
    damaged: ["浸水を確認、まだ保つ！", "圧力隔壁を閉じろ！", "この程度で浮上はせん！"]
  },
  zeonMaPilot: {
    attack: ["モビルアーマーの火力を見せる！", "出力を上げろ、一気に叩く！", "この機体なら押し切れる！"],
    hit: ["直撃だ！", "この火力に耐えられるものか！", "敵陣を突破する！"],
    miss: ["巨体では追い切れんか！", "照準系を再調整する！", "次は火力で面を押さえる！"],
    move: ["推進器、最大出力！", "攻撃コースへ入る！", "巨体を生かして前へ出る！"],
    wait: ["出力を安定させる。", "敵を射程へ誘い込む。", "各部の状態を確認する。"],
    evade: ["この推力を甘く見るな！", "巨体でも避けられる！", "直撃はさせん！"],
    damaged: ["装甲に損傷、まだ動く！", "出力は落ちていない！", "モビルアーマーはこの程度では沈まん！"]
  }
};

function actorCharacterFor(unit) {
  if (isBattleship(unit)) return battleshipCrew(unit)[0];
  if (isMobileSuit(unit)) return primaryCharacterFor(unit);
  return null;
}

function dialogueFor(unit, type) {
  const character = actorCharacterFor(unit);
  if (!character) return "";
  const dialogue = state.data.dialogues?.[character.characterKey] ?? characterDialogue[character.characterKey];
  const lines = dialogue?.[type] ?? dialogue?.attack;
  if (!lines?.length) return "";
  return `<span class="log-quote">${character.name}: 「${lines[Math.floor(Math.random() * lines.length)]}」</span>`;
}

function pushDialogue(unit, type) {
  const line = dialogueFor(unit, type);
  if (line) state.log.push(line);
}

function battleshipFor(unit) {
  return lookup().battleships[unit.battleshipId];
}

function battleshipCrew(unit) {
  const { characters } = lookup();
  return (unit.characterIds ?? [])
    .map((id) => characters[id])
    .filter(Boolean);
}

function battleshipCaptain(unit) {
  return battleshipCrew(unit)[0] ?? NO_CHARACTER;
}

function battleshipFirstOfficer(unit) {
  return battleshipCrew(unit)[1] ?? NO_CHARACTER;
}

function battleshipAimBonus(unit) {
  return Math.floor(battleshipCaptain(unit).command / 2) + Math.floor(battleshipFirstOfficer(unit).support / 2);
}

function battleshipEvasionBonus(unit) {
  return Math.floor(battleshipCaptain(unit).command / 4) + Math.floor(battleshipFirstOfficer(unit).support / 4);
}

function supportForBattleship(unit) {
  const base = battleshipFor(unit).support;
  const captainCommand = battleshipCaptain(unit).command;
  const crewMaintenance = battleshipFirstOfficer(unit).maintenance;
  return {
    ...base,
    armor: base.armor + Math.floor(captainCommand / 4) + crewMaintenance,
    shield: base.shield + Math.floor(captainCommand / 8) + Math.floor(crewMaintenance / 2)
  };
}

function unitName(unit) {
  if (isBattleship(unit)) return battleshipFor(unit).name;
  return msFor(unit).name;
}

function unitFaction(unit) {
  return isBattleship(unit) ? battleshipFor(unit).faction : msFor(unit).faction;
}

function mobilityFor(unit) {
  if (isBattleship(unit)) return battleshipFor(unit).mobility;
  const optionBonus = unitOptions(unit)
    .filter((option) => option.effectType === "mobility")
    .reduce((total, option) => total + (option.value ?? 1), 0);
  const stopMovementPenalty = hinderedByStopMovement(unit) ? 1 : 0;
  return Math.max(1, msFor(unit).mobility + optionBonus - unitTerrainPenalty(unit).mobility - stopMovementPenalty);
}

function runtimeWeapon(unit, weaponId) {
  return unit.runtimeWeapons.find((weapon) => weapon.id === weaponId);
}

function activeShield(unit) {
  return unit.runtimeWeapons.find((runtime) => weaponFor(runtime.id).kind === "shield" && runtime.durability > 0);
}

function alliedBattleship(side) {
  return state.units.find((unit) => unit.side === side && isBattleship(unit) && isAlive(unit));
}

function isAdjacent(a, b) {
  return distance(a, b) === 1;
}

function shieldAttackCost(weapon) {
  return weapon.shieldAttackCost ?? weapon.consume ?? 0;
}

function weaponCanAttack(weapon) {
  if (weapon.utilityOnly) return false;
  if (weapon.kind !== "shield") return true;
  return weapon.attackType !== "guard" && weapon.power > 0;
}

function unitWeaponObjects(unit) {
  return [...new Set(unit.weaponIds.flatMap((id) => [id, ...(weaponFor(id).extraAttackIds ?? [])]))]
    .map((id) => weaponFor(id));
}

function attackWeapons(unit) {
  return unitWeaponObjects(unit)
    .filter((weapon) => weaponCanAttack(weapon));
}

function weaponUsed(unit, weaponId) {
  return unit.usedWeaponIds?.includes(weaponId);
}

function allAttackWeaponsUsed(unit) {
  const weapons = attackWeapons(unit);
  return weapons.length > 0 && weapons.every((weapon) => weaponUsed(unit, weapon.id) || !canPayCost(unit, weapon));
}

function usableAttackWeapons(unit) {
  return attackWeapons(unit)
    .filter((weapon) => !weaponUsed(unit, weapon.id) && canPayCost(unit, weapon));
}

function attackWeaponsForTarget(attacker, defender) {
  return usableAttackWeapons(attacker)
    .filter((weapon) => weaponInRange(attacker, defender, weapon));
}

function weaponStatus(unit, weapon) {
  const runtime = runtimeWeapon(unit, weapon.id);
  const awakeningText = weapon.requiredAwakening ? ` / 覚醒${weapon.requiredAwakening}必要` : "";
  if (weapon.kind === "ammo") return `残弾 ${runtime.ammo} / ${runtime.maxAmmo ?? weapon.ammo}${awakeningText}`;
  if (weapon.kind === "beam") return `EN消費 ${weapon.consume}${awakeningText}`;
  if (weapon.kind === "special") return `EN消費 ${weapon.consume}${awakeningText}`;
  if (weapon.kind === "shield") return weaponCanAttack(weapon)
    ? `盾耐久 ${runtime.durability} / ${weapon.durability}（攻撃消費${shieldAttackCost(weapon)}）`
    : `盾耐久 ${runtime.durability} / ${weapon.durability}`;
  return `消費なし${awakeningText}`;
}

function applyBattleshipSupport(side) {
  const battleship = alliedBattleship(side);
  if (!battleship) return;
  const support = supportForBattleship(battleship);

  const supportedUnits = state.units.filter((unit) => unit.side === side && isCombatUnit(unit) && isMobileSuit(unit) && isAdjacent(unit, battleship));
  supportedUnits.forEach((unit) => {
    const changes = [];
    const beforeArmor = unit.armor;
    unit.armor = Math.min(unit.maxArmor, unit.armor + support.armor);
    if (unit.armor > beforeArmor) changes.push(`装甲+${unit.armor - beforeArmor}`);

    const beforeEnergy = unit.energy;
    unit.energy = Math.min(unit.maxEnergy, unit.energy + support.energy);
    if (unit.energy > beforeEnergy) changes.push(`EN+${unit.energy - beforeEnergy}`);

    unit.runtimeWeapons.forEach((runtime) => {
      const weapon = weaponFor(runtime.id);
      if (weapon.kind === "ammo") {
        const beforeAmmo = runtime.ammo;
        runtime.ammo = Math.min(runtime.maxAmmo ?? weapon.ammo, runtime.ammo + support.ammo);
        if (runtime.ammo > beforeAmmo) changes.push(`${weapon.name}弾+${runtime.ammo - beforeAmmo}`);
      }
      if (weapon.kind === "shield") {
        const beforeShield = runtime.durability;
        runtime.durability = Math.min(weapon.durability, runtime.durability + support.shield);
        if (runtime.durability > beforeShield) changes.push(`${weapon.name}+${runtime.durability - beforeShield}`);
      }
    });

    if (changes.length > 0) {
      state.log.push(`${unitName(unit)}が${unitName(battleship)}から補給を受けた（${changes.join("、")}）。`);
    } else {
      state.log.push(`${unitName(unit)}は${unitName(battleship)}に隣接中。補給は満タンです。`);
    }
  });
}

function applyGundamPassion(side) {
  const sources = state.units.filter((unit) => unit.side === side && isCombatUnit(unit) && isAlive(unit) && unitHasSkill(unit, "gundamPassion"));
  if (sources.length === 0) return;
  const targets = state.units.filter((unit) =>
    unit.side === side
    && isMobileSuit(unit)
    && isAlive(unit)
    && mobileSuitTags(msFor(unit)).includes("gundam")
    && sources.some((source) => source.id !== unit.id && isAdjacent(source, unit))
  );
  targets.forEach((unit) => {
    const changes = [];
    const beforeArmor = unit.armor;
    unit.armor = Math.min(unit.maxArmor, unit.armor + 20);
    if (unit.armor > beforeArmor) changes.push(`装甲+${unit.armor - beforeArmor}`);
    const beforeEnergy = unit.energy;
    unit.energy = Math.min(unit.maxEnergy, unit.energy + 10);
    if (unit.energy > beforeEnergy) changes.push(`EN+${unit.energy - beforeEnergy}`);
    if (changes.length > 0) state.log.push(`${unitName(unit)}がガンダムへの情熱で整備を受けた（${changes.join("、")}）。`);
  });
}

function canPayCost(unit, weapon) {
  if (isMobileSuit(unit) && weapon.requiredAwakening && primaryCharacterFor(unit).awakening < weapon.requiredAwakening) return false;
  const runtime = runtimeWeapon(unit, weapon.id);
  if (weapon.kind === "beam") return unit.energy >= weapon.consume;
  if (weapon.kind === "special") return unit.energy >= weapon.consume;
  if (weapon.kind === "ammo") return runtime.ammo >= weapon.consume;
  if (weapon.kind === "shield") return runtime.durability >= shieldAttackCost(weapon);
  return true;
}

function payCost(unit, weapon) {
  const runtime = runtimeWeapon(unit, weapon.id);
  if (weapon.kind === "beam") unit.energy -= weapon.consume;
  if (weapon.kind === "special") unit.energy -= weapon.consume;
  if (weapon.kind === "ammo") runtime.ammo -= weapon.consume;
  if (weapon.kind === "shield") runtime.durability = Math.max(0, runtime.durability - shieldAttackCost(weapon));
}

function markWeaponUsed(unit, weapon) {
  if (!unit.usedWeaponIds) unit.usedWeaponIds = [];
  if (!unit.usedWeaponIds.includes(weapon.id)) unit.usedWeaponIds.push(weapon.id);
}

function characterMsBonus(unit) {
  if (!isMobileSuit(unit)) return 0;
  const characterId = unit.characterIds?.[0];
  const unitMs = msFor(unit);
  const match = (state.data.compatibility?.characterMs ?? []).find((item) => item.characterId === characterId && compatibilityMatchesMs(item, unitMs));
  return match?.evasionBonus ?? 0;
}

function msWeaponBonus(unit, weapon) {
  if (!isMobileSuit(unit)) return 0;
  const unitMs = msFor(unit);
  const matches = (state.data.compatibility?.msWeapon ?? []).filter((item) => compatibilityMatchesMs(item, unitMs));
  const exactMatch = matches.find((item) => item.weaponId === weapon.id);
  const categoryMatch = matches.find((item) => !item.weaponId && item.category === weapon.category);
  return exactMatch?.accuracyBonus ?? categoryMatch?.accuracyBonus ?? 0;
}

function skillAccuracyBonus(unit, defender, weapon) {
  if (!isMobileSuit(unit)) return 0;
  let bonus = 0;
  if (unitHasSkill(unit, "commanderCustom")) bonus += 3;
  if (unitHasSkill(unit, "teamwork") && hasTeamworkAlly(unit)) bonus += 5;
  if (massProductionFormationActive(unit)) bonus += 4;
  if (unitHasSkill(unit, "educationalComputer")) bonus += Math.min(9, unit.learningStacks ?? 0);
  if (unitHasSkill(unit, "stationaryInterception") && !unit.moved) bonus += 8;
  if (unitHasSkill(unit, "highPerformanceSight") && weapon?.attackType === "shooting" && defender && distance(unit, defender) >= 4) bonus += 8;
  if (unitHasSkill(unit, "allyBackup") && hasAllyAhead(unit)) bonus += 6;
  const supportedByCommander = state.units.some((other) =>
    other.id !== unit.id
    && other.side === unit.side
    && isMobileSuit(other)
    && isAlive(other)
    && unitHasSkill(other, "commanderCustom")
    && distance(other, unit) <= 2
  );
  if (supportedByCommander) bonus += 3;
  return bonus;
}

function skillEvasionBonus(unit) {
  if (!isMobileSuit(unit)) return 0;
  let bonus = 0;
  if (unitHasSkill(unit, "educationalComputer")) bonus += Math.min(9, unit.learningStacks ?? 0);
  return bonus;
}

function oneHandBonus(unit, weapon) {
  if (!isMobileSuit(unit)) return 0;
  const equippedWeapons = unit.weaponIds.filter((id) => {
    const item = weaponFor(id);
    return item.cost > 0 && item.kind !== "shield";
  });
  return equippedWeapons.length === 1 && equippedWeapons[0] === weapon.id && weaponSlotCost(weapon) === 1 ? 8 : 0;
}

function evasion(unit) {
  if (isBattleship(unit)) return battleshipFor(unit).agility + battleshipEvasionBonus(unit);
  const ms = msFor(unit);
  const character = primaryCharacterFor(unit);
  return Math.max(0, ms.agility + character.reaction + Math.floor(character.awakening / 2) + characterMsBonus(unit) + skillEvasionBonus(unit) - unitTerrainPenalty(unit).evasion);
}

function hitRate(attacker, defender, weapon) {
  const panicPenalty = unitHasSkill(attacker, "panic") ? 8 : 0;
  if (isBattleship(attacker)) {
    const raw = weapon.accuracy - BATTLESHIP_HIT_PENALTY + battleshipAimBonus(attacker) + barrageSupportPenalty(defender, attacker) - panicPenalty - evasion(defender);
    return clamp(raw, MIN_HIT_RATE, MAX_HIT_RATE);
  }
  const character = primaryCharacterFor(attacker);
  const ability = weapon.attackType === "melee" ? character.melee : character.shooting;
  const raw = weapon.accuracy + ability + Math.floor(character.awakening / 2) + msWeaponBonus(attacker, weapon) + skillAccuracyBonus(attacker, defender, weapon) + oneHandBonus(attacker, weapon) + barrageSupportPenalty(defender, attacker) + HIT_RATE_BONUS - panicPenalty - evasion(defender);
  return clamp(raw, MIN_HIT_RATE, MAX_HIT_RATE);
}

function canUseIField(defender, weapon) {
  return isMobileSuit(defender)
    && weapon.kind === "beam"
    && unitHasSkill(defender, "iField")
    && defender.energy >= I_FIELD_EN_COST;
}

function activateIField(defender, weapon) {
  if (!canUseIField(defender, weapon)) return false;
  defender.energy = Math.max(0, defender.energy - I_FIELD_EN_COST);
  return true;
}

function incrementLearningComputer(unit) {
  if (!isMobileSuit(unit) || !unitHasSkill(unit, "educationalComputer")) return;
  const before = unit.learningStacks ?? 0;
  unit.learningStacks = Math.min(9, before + 1);
  if (unit.learningStacks > before) state.log.push(`${unitName(unit)}の教育型コンピューターが戦闘データを蓄積（補正+${unit.learningStacks}）。`);
}

function damageFor(attacker, defender, weapon, options = {}) {
  let damage = weapon.power;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "ace")) damage += 10;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "aiSenshi") && alliedMobileSuitDestroyed(attacker.side)) damage += 15;
  if (isCombatUnit(attacker) && sacrificialBoostActive(attacker.side)) damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "outstandingTalent") && isFrontmostAlly(attacker)) damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "enhancedWarhead") && weapon.kind === "ammo") damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "highOutputGenerator") && weapon.kind === "beam") damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "precisionMeleeProgram") && weapon.attackType === "melee") damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "sandAmbush") && terrainAt(attacker.x, attacker.y) === "desert") damage += 12;
  if (isMobileSuit(defender) && msFor(defender).movementType === "flying" && weaponHasSkill(weapon, "antiAir")) damage += 18;
  if (unitIsSubmerged(defender) && (unitHasSkill(attacker, "antiSubmarine") || weaponHasSkill(weapon, "antiSubmarine"))) damage += 20;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "teamwork") && hasTeamworkAlly(attacker)) damage += 8;
  if (isMobileSuit(attacker) && massProductionFormationActive(attacker)) damage += 8;
  if (weapon.kind === "beam" && (attacker.beamDisruptedTurns ?? 0) > 0) damage -= 25;
  if (options.iFieldActive ?? canUseIField(defender, weapon)) damage = Math.floor(damage / 2);
  if (isMobileSuit(defender) && weapon.kind === "beam" && (unitHasSkill(defender, "antiBeamCoating") || shieldHasSkill(defender, "antiBeamCoating"))) damage -= 15;
  if (isMobileSuit(defender) && weapon.kind === "ammo" && unitHasSkill(defender, "optionArmor")) damage -= 15;
  if (weapon.kind === "ammo" && freezyYardActive(defender)) damage -= FREEZY_YARD_REDUCTION;
  if (isMobileSuit(defender) && weapon.attackType === "melee" && unitHasSkill(defender, "impactDiffusionArmor")) damage -= 15;
  if (isMobileSuit(defender) && unitHasSkill(defender, "aiSenshi") && alliedMobileSuitDestroyed(defender.side)) damage -= 10;
  if (isMobileSuit(defender) && massProductionFormationActive(defender)) damage -= 8;
  if (guardMissionProtector(defender, attacker)) damage -= 10;
  return Math.max(10, damage);
}

function combatEffectNotes(attacker, defender, weapon, options = {}) {
  const notes = [];
  if (isCombatUnit(attacker) && sacrificialBoostActive(attacker.side)) notes.push("命を賭して……");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "outstandingTalent") && isFrontmostAlly(attacker)) notes.push("突出した才能");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "enhancedWarhead") && weapon.kind === "ammo") notes.push("強化弾頭");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "highOutputGenerator") && weapon.kind === "beam") notes.push("高出力ジェネレーター");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "precisionMeleeProgram") && weapon.attackType === "melee") notes.push("高精度格闘プログラム");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "highPerformanceSight") && weapon.attackType === "shooting" && distance(attacker, defender) >= 4) notes.push("高性能照準器");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "allyBackup") && hasAllyAhead(attacker)) notes.push("味方援護");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "sandAmbush") && terrainAt(attacker.x, attacker.y) === "desert") notes.push("砂塵の伏兵");
  if (isMobileSuit(defender) && msFor(defender).movementType === "flying" && weaponHasSkill(weapon, "antiAir")) notes.push("対空中");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "teamwork") && hasTeamworkAlly(attacker)) notes.push("チームワーク攻撃");
  if (isMobileSuit(attacker) && massProductionFormationActive(attacker)) notes.push("量産機編成攻撃");
  if (options.iFieldActive) notes.push("Iフィールド");
  if (unitIsSubmerged(defender) && (unitHasSkill(attacker, "antiSubmarine") || weaponHasSkill(weapon, "antiSubmarine"))) notes.push("対水中");
  if (weapon.kind === "ammo" && freezyYardActive(defender)) notes.push("フリージーヤード");
  if (isMobileSuit(defender) && massProductionFormationActive(defender)) notes.push("量産機編成防御");
  const protector = guardMissionProtector(defender, attacker);
  if (protector) notes.push(`護衛任務:${unitName(protector)}`);
  return notes;
}

function mineCellsAround(unit) {
  return [
    { x: unit.x, y: unit.y },
    { x: unit.x + 1, y: unit.y },
    { x: unit.x - 1, y: unit.y },
    { x: unit.x, y: unit.y + 1 },
    { x: unit.x, y: unit.y - 1 }
  ].filter((cell) => inBounds(cell.x, cell.y) && terrainWalkableAt(cell.x, cell.y));
}

function mineScatterCells(unit) {
  return [
    { x: unit.x + 1, y: unit.y },
    { x: unit.x - 1, y: unit.y },
    { x: unit.x, y: unit.y + 1 },
    { x: unit.x, y: unit.y - 1 }
  ].filter((cell) =>
    inBounds(cell.x, cell.y)
    && terrainWalkableAt(cell.x, cell.y)
    && !occupiedAt(cell.x, cell.y)
    && !state.mines?.some((mine) => mine.x === cell.x && mine.y === cell.y)
  );
}

function canUseMineScatter(unit, weapon) {
  return isCombatUnit(unit)
    && weaponHasSkill(weapon, "mineScatter")
    && !unit.acted
    && !weaponUsed(unit, weapon.id)
    && canPayCost(unit, weapon)
    && mineScatterCells(unit).length > 0;
}

function canUseSmokeDischarger(unit, weapon) {
  return isMobileSuit(unit)
    && weaponHasSkill(weapon, "smokeDischarger")
    && !unit.acted
    && !weaponUsed(unit, weapon.id)
    && canPayCost(unit, weapon);
}

function useMineScatter(unit, weapon, renderAfter = true) {
  if (!canUseMineScatter(unit, weapon)) return false;
  if (!state.mines) state.mines = [];
  payCost(unit, weapon);
  markWeaponUsed(unit, weapon);
  unit.moved = true;
  mineScatterCells(unit).slice(0, 3).forEach((cell) => {
    state.mines.push({ id: makeId(), side: unit.side, x: cell.x, y: cell.y, damage: 35 });
  });
  unit.acted = true;
  revealStealth(unit, "機雷散布");
  pushDialogue(unit, "wait");
  state.log.push(`${unitName(unit)}が${weapon.name}で周囲に機雷を散布。`);
  if (renderAfter) renderBattle();
  return true;
}

function useSmokeDischarger(unit, weapon, renderAfter = true) {
  if (!canUseSmokeDischarger(unit, weapon)) return false;
  payCost(unit, weapon);
  markWeaponUsed(unit, weapon);
  unit.moved = true;
  unit.smokeConcealedTurns = 2;
  unit.acted = true;
  revealStealth(unit, "煙幕展開");
  pushDialogue(unit, "wait");
  state.log.push(`${unitName(unit)}が${weapon.name}を展開。射撃対象から外れやすくなった。`);
  if (renderAfter) renderBattle();
  return true;
}

function useSmokeSkill(unit, renderAfter = true) {
  if (!isMobileSuit(unit) || !unitHasSkill(unit, "smokeDischarger") || unit.acted || unit.moved || unit.smokeSkillUsed) return false;
  unit.smokeSkillUsed = true;
  unit.moved = true;
  unit.smokeConcealedTurns = 2;
  unit.acted = true;
  revealStealth(unit, "煙幕展開");
  pushDialogue(unit, "wait");
  state.log.push(`${unitName(unit)}がスモークディスチャージャーを展開。射撃対象から外れやすくなった。`);
  if (renderAfter) renderBattle();
  return true;
}

function scatterMines(attacker, target, weapon) {
  if (!weaponHasSkill(weapon, "mineScatter")) return;
  if (!state.mines) state.mines = [];
  let placed = 0;
  for (const cell of mineCellsAround(target)) {
    if (state.mines.some((mine) => mine.x === cell.x && mine.y === cell.y)) continue;
    state.mines.push({ id: makeId(), side: attacker.side, x: cell.x, y: cell.y, damage: 35 });
    placed += 1;
    if (placed >= 3) break;
  }
  if (placed > 0) state.log.push(`${unitName(attacker)}が機雷を${placed}個散布。`);
}

function applyBeamDisruption(attacker, defender, weapon) {
  if (!weaponHasSkill(weapon, "beamDisruption") || !isCombatUnit(defender)) return;
  defender.beamDisruptedTurns = 2;
  state.log.push(`${unitName(attacker)}のビーム撹乱幕。${unitName(defender)}のビーム威力が一時低下。`);
}

function triggerMines(unit) {
  if (!state.mines?.length || !isCombatUnit(unit)) return;
  const mine = state.mines.find((item) => item.x === unit.x && item.y === unit.y && item.side !== unit.side);
  if (!mine) return;
  state.mines = state.mines.filter((item) => item.id !== mine.id);
  state.log.push(`${unitName(unit)}が機雷に接触。${mine.damage}ダメージ。`);
  applyDamage(unit, mine.damage);
  if (!isAlive(unit)) state.log.push(`${unitName(unit)}を撃破。`);
  checkOutcome();
}

function canUseCoreSystem(unit) {
  if (!isMobileSuit(unit) || unit.coreSystemUsed || !msFor(unit).specials.includes("coreSystem")) return false;
  return Boolean(lookup().ms[msFor(unit).escapeMsId ?? "coreFighter"]);
}

function canUseEscapeShip(unit) {
  return isBattleship(unit) && !unit.escapeShipUsed && Boolean(battleshipFor(unit).escapeShipId);
}

function transformToCoreFighter(unit) {
  const beforeName = unitName(unit);
  const sourceMs = msFor(unit);
  const coreFighter = lookup().ms[sourceMs.escapeMsId ?? "coreFighter"];
  unit.coreSystemUsed = true;
  unit.msId = coreFighter.id;
  unit.weaponIds = [...coreFighter.fixedWeaponIds, ...(sourceMs.escapeWeaponIds ?? [])];
  unit.runtimeWeapons = runtimeWeaponsForIds(unit.weaponIds);
  unit.armor = coreFighter.armor;
  unit.maxArmor = coreFighter.armor;
  unit.energy = coreFighter.energy;
  unit.maxEnergy = coreFighter.energy;
  unit.usedWeaponIds = [];
  state.log.push(`${beforeName}の脱出機構作動。${coreFighter.name}で戦闘続行。`);
}

function transformToEscapeShip(unit) {
  const beforeName = unitName(unit);
  const escapeShip = lookup().battleships[battleshipFor(unit).escapeShipId];
  if (!escapeShip) return;
  unit.escapeShipUsed = true;
  unit.battleshipId = escapeShip.id;
  unit.faction = escapeShip.faction;
  unit.weaponIds = [...escapeShip.weaponIds];
  unit.runtimeWeapons = runtimeWeaponsForIds(unit.weaponIds);
  unit.armor = escapeShip.armor;
  unit.maxArmor = escapeShip.armor;
  unit.energy = escapeShip.energy;
  unit.maxEnergy = escapeShip.energy;
  unit.usedWeaponIds = [];
  state.log.push(`${beforeName}から${escapeShip.name}が脱出。撃沈敗北を一度だけ回避。`);
}

function attack(attacker, defender, weapon, renderAfter = true) {
  if (state.outcome) return;
  if ((attacker.side === "player" && state.phase !== "player") || (attacker.side === "enemy" && state.phase !== "enemy")) return;
  if (!isCombatUnit(attacker) || !isCombatUnit(defender) || !weapon || weaponUsed(attacker, weapon.id)) return;
  if (!weaponInRange(attacker, defender, weapon) || !canPayCost(attacker, weapon)) return;

  const attackerName = unitName(attacker);
  const defenderName = unitName(defender);
  payCost(attacker, weapon);
  markWeaponUsed(attacker, weapon);
  const hit = hitRate(attacker, defender, weapon);
  const roll = Math.floor(Math.random() * 100) + 1;
  revealStealth(attacker, "攻撃");

  if (roll > hit) {
    pushDialogue(attacker, "miss");
    state.log.push(`${attackerName}の${weapon.name}。命中${hit}%、出目${roll}で回避された。`);
    pushDialogue(defender, "evade");
  } else {
    pushDialogue(attacker, "hit");
    const iFieldActive = activateIField(defender, weapon);
    const damage = damageFor(attacker, defender, weapon, { iFieldActive });
    const effectNotes = combatEffectNotes(attacker, defender, weapon, { iFieldActive });
    applyDamage(defender, damage);
    state.log.push(`${attackerName}の${weapon.name}が命中。${defenderName}に${damage}ダメージ。`);
    if (effectNotes.length > 0) state.log.push(`発動: ${effectNotes.join(" / ")}`);
    if (isAlive(defender)) pushDialogue(defender, "damaged");
    if (!isAlive(defender)) state.log.push(`${defenderName}を撃破。`);
  }

  incrementLearningComputer(attacker);
  scatterMines(attacker, defender, weapon);
  applyBeamDisruption(attacker, defender, weapon);
  checkOutcome();
  attacker.acted = allAttackWeaponsUsed(attacker);
  attacker.moved = true;
  if (!isAlive(defender)) state.selectedTargetId = null;
  if (renderAfter) renderBattle();
}

function applyDamage(unit, amount) {
  let remaining = amount;
  const shield = activeShield(unit);
  if (shield) {
    const shieldDamage = Math.min(shield.durability, remaining);
    shield.durability -= shieldDamage;
    remaining -= shieldDamage;
    if (shield.durability === 0) state.log.push(`${unitName(unit)}の盾が破壊された。`);
  }
  unit.armor = Math.max(0, unit.armor - remaining);
  if (unit.armor === 0 && canUseEscapeShip(unit)) transformToEscapeShip(unit);
  if (unit.armor === 0 && canUseCoreSystem(unit)) transformToCoreFighter(unit);
  if (unit.armor === 0) triggerSacrificialBoost(unit);
}

function moveUnit(unit, x, y) {
  if (state.outcome) return;
  if (!isCombatUnit(unit) || state.phase !== "player" || unit.side !== "player" || unit.moved) return;
  if (!canMoveTo(unit, x, y)) return;
  unit.x = x;
  unit.y = y;
  unit.moved = true;
  revealStealth(unit, "移動");
  triggerMines(unit);
  if (!isAlive(unit) || state.outcome) {
    renderBattle();
    return;
  }
  pushDialogue(unit, "move");
  state.log.push(`${unitName(unit)}が移動。`);
  renderBattle();
}

function endPlayerTurn() {
  if (state.outcome) return;
  if (state.phase !== "player") return;
  applyBattleshipSupport("player");
  applyGundamPassion("player");
  state.units.filter((unit) => unit.side === "player" && isCombatUnit(unit)).forEach((unit) => {
    unit.acted = false;
    unit.moved = false;
    unit.usedWeaponIds = [];
    if ((unit.beamDisruptedTurns ?? 0) > 0) unit.beamDisruptedTurns -= 1;
    if ((unit.smokeConcealedTurns ?? 0) > 0) unit.smokeConcealedTurns -= 1;
  });
  tickTurnStartEffects("enemy");
  state.phase = "enemy";
  state.selectedUnitId = null;
  state.selectedTargetId = null;
  state.enemyQueue = state.units.filter((unit) => unit.side === "enemy" && isCombatUnit(unit)).map((unit) => unit.id);
  state.log.push("敵軍ターン開始。敵行動を進めるボタンで1手ずつ処理します。");
  renderBattle();
}

function effectiveDurability(unit) {
  return unit.armor + (activeShield(unit)?.durability ?? 0);
}

function unitHealthRatio(unit) {
  return unit.maxArmor > 0 ? unit.armor / unit.maxArmor : 1;
}

function targetPriority(unit) {
  const woundedBonus = Math.round((1 - unitHealthRatio(unit)) * 45);
  return woundedBonus + (isBattleship(unit) ? AI_BATTLESHIP_TARGET_BONUS : 0);
}

function attackPlanScore(attacker, target, weapon) {
  const hit = hitRate(attacker, target, weapon);
  const damage = damageFor(attacker, target, weapon);
  const expectedDamage = damage * hit / 100;
  const canDestroy = damage >= effectiveDurability(target);
  const range = distance(attacker, target);
  const rangeComfort = Math.max(0, weaponMaxRange(attacker, weapon) - range);
  const shieldBashPenalty = weapon.kind === "shield" ? 8 : 0;
  return expectedDamage
    + targetPriority(target)
    + hit / 10
    + rangeComfort
    + (canDestroy ? AI_KILL_BONUS : 0)
    - shieldBashPenalty;
}

function bestAttackPlan(attacker, targets) {
  let best = null;
  targets.forEach((target) => {
    attackWeaponsForTarget(attacker, target).forEach((weapon) => {
      const score = attackPlanScore(attacker, target, weapon);
      if (!best || score > best.score) best = { target, weapon, score };
    });
  });
  return best;
}

function withUnitPosition(unit, x, y, callback) {
  const before = { x: unit.x, y: unit.y };
  unit.x = x;
  unit.y = y;
  try {
    return callback();
  } finally {
    unit.x = before.x;
    unit.y = before.y;
  }
}

function parsePositionKey(key) {
  const [x, y] = key.split(",").map(Number);
  return { x, y };
}

function enemyNeedsSupport(unit) {
  if (!isMobileSuit(unit)) return false;
  if (unitHealthRatio(unit) <= 0.55) return true;
  if (unit.maxEnergy > 0 && unit.energy / unit.maxEnergy <= 0.35) return true;
  return unit.runtimeWeapons.some((runtime) => {
    const weapon = weaponFor(runtime.id);
    if (weapon.kind === "ammo") return runtime.ammo <= 1;
    if (weapon.kind === "shield") return runtime.durability > 0 && runtime.durability <= Math.ceil(weapon.durability * 0.35);
    return false;
  });
}

function supportPositionScore(unit) {
  if (!enemyNeedsSupport(unit)) return 0;
  const ship = alliedBattleship(unit.side);
  if (!ship) return 0;
  const dist = distance(unit, ship);
  if (dist === 1) return AI_SUPPORT_POSITION_BONUS;
  return Math.max(0, AI_SUPPORT_POSITION_BONUS - dist * 12);
}

function nearestTargetApproachScore(unit, targets) {
  if (targets.length === 0) return 0;
  const bestTarget = [...targets].sort((a, b) => {
    const priorityDiff = targetPriority(b) - targetPriority(a);
    if (priorityDiff !== 0) return priorityDiff;
    return distance(unit, a) - distance(unit, b);
  })[0];
  return targetPriority(bestTarget) + Math.max(0, 50 - distance(unit, bestTarget) * 8);
}

function incomingAmmoThreat(unit, opponents) {
  return opponents.some((opponent) =>
    attackWeaponsForTarget(opponent, unit).some((weapon) => weapon.kind === "ammo")
  );
}

function shouldEnemyActivateFreezyYard(unit, targets, attackPlan) {
  if (!canActivateFreezyYard(unit)) return false;
  if (unitHealthRatio(unit) <= 0.45) return true;
  return !attackPlan && incomingAmmoThreat(unit, targets);
}

function enemyMineScatterWeapon(unit, targets, attackPlan) {
  if (attackPlan || targets.length === 0) return null;
  const nearest = [...targets].sort((a, b) => distance(unit, a) - distance(unit, b))[0];
  if (distance(unit, nearest) > 3) return null;
  return attackWeapons(unit).find((weapon) => canUseMineScatter(unit, weapon)) ?? null;
}

function enemyMoveCandidates(unit) {
  return [
    { x: unit.x, y: unit.y, current: true },
    ...[...reachableCells(unit)].map((key) => ({ ...parsePositionKey(key), current: false }))
  ];
}

function bestEnemyMove(unit, targets) {
  let best = null;
  enemyMoveCandidates(unit).forEach((cell) => {
    if (!cell.current && occupiedAt(cell.x, cell.y, unit.id)) return;
    const result = withUnitPosition(unit, cell.x, cell.y, () => {
      const futureAttack = bestAttackPlan(unit, targets);
      const supportScore = supportPositionScore(unit);
      const approachScore = nearestTargetApproachScore(unit, targets);
      const score = (futureAttack ? AI_ATTACK_POSITION_BONUS + futureAttack.score : approachScore) + supportScore;
      return { futureAttack, supportScore, score };
    });
    if (!best || result.score > best.score) best = { ...cell, ...result };
  });
  if (!best || best.current) return null;
  if (best.supportScore >= AI_SUPPORT_POSITION_BONUS) best.reason = "補給位置へ移動";
  else if (best.futureAttack) best.reason = "攻撃位置へ移動";
  else best.reason = "接近";
  return best;
}

function advanceEnemyTurn() {
  if (state.outcome) return;
  if (state.phase !== "enemy") return;

  while (state.enemyQueue.length > 0) {
    const enemy = state.units.find((unit) => unit.id === state.enemyQueue[0] && isCombatUnit(unit));
    if (!enemy) {
      state.enemyQueue.shift();
      continue;
    }

    const targets = state.units.filter((unit) => unit.side === "player" && isCombatUnit(unit));
    if (targets.length === 0) {
      checkOutcome();
      renderBattle();
      return;
    }

    const attackPlan = bestAttackPlan(enemy, targets);

    if (shouldEnemyActivateFreezyYard(enemy, targets, attackPlan)) {
      state.selectedUnitId = enemy.id;
      state.selectedTargetId = null;
      activateFreezyYard(enemy, false);
      state.enemyQueue.shift();
      renderBattle();
      return;
    }

    const mineWeapon = enemyMineScatterWeapon(enemy, targets, attackPlan);
    if (mineWeapon) {
      state.selectedUnitId = enemy.id;
      state.selectedTargetId = null;
      useMineScatter(enemy, mineWeapon, false);
      if (enemy.acted || !isAlive(enemy) || state.outcome) state.enemyQueue.shift();
      renderBattle();
      return;
    }

    if (attackPlan) {
      state.selectedUnitId = enemy.id;
      state.selectedTargetId = attackPlan.target.id;
      attack(enemy, attackPlan.target, attackPlan.weapon, false);
      if (enemy.acted || !isAlive(enemy) || state.outcome) state.enemyQueue.shift();
      renderBattle();
      return;
    }

    if (!enemy.moved) {
      const movePlan = bestEnemyMove(enemy, targets);
      state.selectedUnitId = enemy.id;
      state.selectedTargetId = movePlan?.futureAttack?.target.id ?? [...targets].sort((a, b) => distance(enemy, a) - distance(enemy, b))[0]?.id ?? null;
      const moved = moveEnemyUnit(enemy, movePlan);
      if (!moved) {
        enemy.acted = true;
        state.enemyQueue.shift();
        pushDialogue(enemy, "wait");
        state.log.push(`${unitName(enemy)}は移動できず待機。`);
      } else if (movePlan.futureAttack && isCombatUnit(movePlan.futureAttack.target) && weaponInRange(enemy, movePlan.futureAttack.target, movePlan.futureAttack.weapon) && canPayCost(enemy, movePlan.futureAttack.weapon)) {
        attack(enemy, movePlan.futureAttack.target, movePlan.futureAttack.weapon, false);
        if (enemy.acted || !isAlive(enemy) || state.outcome) state.enemyQueue.shift();
      } else {
        enemy.acted = true;
        state.enemyQueue.shift();
      }
      renderBattle();
      return;
    }

    enemy.acted = true;
    state.enemyQueue.shift();
  }

  finishEnemyTurn();
}

function finishEnemyTurn() {
  if (state.outcome) {
    renderBattle();
    return;
  }
  applyBattleshipSupport("enemy");
  applyGundamPassion("enemy");
  state.units.filter((unit) => unit.side === "enemy" && isCombatUnit(unit)).forEach((unit) => {
    unit.acted = false;
    unit.moved = false;
    unit.usedWeaponIds = [];
    if ((unit.beamDisruptedTurns ?? 0) > 0) unit.beamDisruptedTurns -= 1;
    if ((unit.smokeConcealedTurns ?? 0) > 0) unit.smokeConcealedTurns -= 1;
  });
  tickTurnStartEffects("player");
  state.phase = "player";
  state.enemyQueue = [];
  state.selectedUnitId = state.units.find((unit) => unit.side === "player" && isCombatUnit(unit))?.id ?? null;
  state.selectedTargetId = null;
  state.log.push("自軍ターン開始。");
  renderBattle();
}

function moveEnemyUnit(unit, movePlan) {
  if (!movePlan) return false;
  unit.x = movePlan.x;
  unit.y = movePlan.y;
  unit.moved = true;
  revealStealth(unit, "移動");
  triggerMines(unit);
  if (!isAlive(unit) || state.outcome) return true;
  pushDialogue(unit, "move");
  state.log.push(`${unitName(unit)}が${movePlan.reason}。`);
  return true;
}

function checkOutcome() {
  if (state.outcome) return;
  const playerBattleshipAlive = state.units.some((unit) => unit.side === "player" && isBattleship(unit) && isAlive(unit));
  const enemyBattleshipExists = state.units.some((unit) => unit.side === "enemy" && isBattleship(unit));
  const enemyBattleshipAlive = state.units.some((unit) => unit.side === "enemy" && isBattleship(unit) && isAlive(unit));
  const playerAlive = state.units.some((unit) => unit.side === "player" && isMobileSuit(unit) && isAlive(unit));
  const enemyAlive = state.units.some((unit) => unit.side === "enemy" && isMobileSuit(unit) && isAlive(unit));

  if (!playerBattleshipAlive || !playerAlive) {
    state.outcome = "敗北";
    phaseLabel.textContent = state.outcome;
  } else if ((enemyBattleshipExists && !enemyBattleshipAlive) || !enemyAlive) {
    state.outcome = "勝利";
    state.resultRewards = claimStageRewards(state.selectedMapId);
    phaseLabel.textContent = state.outcome;
  }
}

setupScreen.addEventListener("change", (event) => {
  if (event.target.matches(".library-control")) {
    state.libraryFilter[event.target.dataset.filterKey] = event.target.value;
    renderCardList();
    return;
  }
  if (event.target.matches(".picker-control")) {
    state.pickerFilter[event.target.dataset.filterKey] = event.target.value;
    renderFormationPicker(state.picker.kind, state.picker.owner);
    return;
  }
  if (event.target.matches(".choice-control")) {
    state.choiceFilter[event.target.dataset.filterKey] = event.target.value;
    renderChoiceCardSelect();
    return;
  }
  if (event.target.dataset.bridgeSlot) {
    if (event.target.dataset.bridgeSlot === "captain") state.selectedCaptainId = event.target.value;
    if (event.target.dataset.bridgeSlot === "firstOfficer") state.selectedFirstOfficerId = event.target.value;
    if (event.target.value) clearCharacterConflicts(event.target.value, event.target.dataset.bridgeSlot);
    renderSetup();
  }
  if (event.target.id === "battleshipSelect") {
    state.selectedBattleshipId = event.target.value;
    renderSetup();
  }
  if (event.target.id === "mapSelect") {
    state.selectedMapId = event.target.value;
    state.formation = [];
    const factionBattleship = state.data.battleships.find((item) => item.faction === state.faction && hasCard("battleships", item.id) && battleshipCanDeployOnMap(item, selectedMap()));
    state.selectedBattleshipId = factionBattleship?.id ?? "";
    const factionMs = state.data.mobileSuits.find((item) => item.faction === state.faction && hasCard("mobileSuits", item.id) && mobileSuitCanDeployOnMap(item, selectedMap()));
    if (factionMs) {
      state.selectedMsId = factionMs.id;
      state.selectedWeaponIds = defaultLoadout(factionMs);
    }
    renderSetup();
  }
  if (event.target.id === "msSelect") {
    state.selectedMsId = event.target.value;
    state.selectedWeaponIds = defaultLoadout(lookup().ms[state.selectedMsId]);
    renderSetup();
  }
  if (event.target.id === "characterSelect") {
    state.selectedCharacterId = event.target.value;
    if (event.target.value) clearCharacterConflicts(event.target.value, "mobileSuit");
    renderSetup();
  }
  if (event.target.id === "optionSelect") {
    state.selectedOptionId = event.target.value;
    renderSetup();
  }
  if (event.target.matches('.weapon-list input[type="checkbox"]')) {
    const checked = [...setupScreen.querySelectorAll('.weapon-list input[type="checkbox"]:checked')].map((input) => input.value);
    state.selectedWeaponIds = fitWeaponIdsToSlots(checked, lookup().ms[state.selectedMsId]);
    renderSetup();
  }
});

setupScreen.addEventListener("input", (event) => {
  if (event.target.matches(".library-control")) {
    const key = event.target.dataset.filterKey;
    state.libraryFilter[key] = event.target.value;
    renderCardList();
    focusFilterControl(".library-control", key, event.target.value);
  }
  if (event.target.matches(".picker-control")) {
    const key = event.target.dataset.filterKey;
    state.pickerFilter[key] = event.target.value;
    renderFormationPicker(state.picker.kind, state.picker.owner);
    focusFilterControl(".picker-control", key, event.target.value);
  }
  if (event.target.matches(".choice-control")) {
    const key = event.target.dataset.filterKey;
    state.choiceFilter[key] = event.target.value;
    renderChoiceCardSelect();
    focusFilterControl(".choice-control", key, event.target.value);
  }
});

setupScreen.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "title") renderTitle();
  if (action === "stage-select") renderStageSelect();
  if (action === "card-list") renderCardList();
  if (action === "choice-card") renderChoiceCardSelect();
  if (action === "toggle-card-reveal") {
    state.revealAllCards = !state.revealAllCards;
    renderCardList();
  }
  if (action === "reset-library-filter") {
    state.libraryFilter = { query: "", type: "all", faction: "all", ownership: "all", sort: "name" };
    renderCardList();
  }
  if (action === "reset-picker-filter") {
    state.pickerFilter = { query: "", sort: "costAsc" };
    renderFormationPicker(state.picker.kind, state.picker.owner);
  }
  if (action === "reset-choice-filter") {
    state.choiceFilter = { query: "", type: "all", faction: "all", sort: "costDesc" };
    renderChoiceCardSelect();
  }
  if (action === "claim-choice-card") {
    claimChoiceCard(button.dataset.cardType, button.dataset.id);
    renderChoiceCardSelect();
  }
  if (action === "back-setup") renderSetup();
  if (action === "open-picker") renderFormationPicker(button.dataset.pickerKind, button.dataset.owner ?? "");
  if (action === "choose-ms") chooseMobileSuit(button.dataset.id);
  if (action === "choose-battleship") chooseBattleship(button.dataset.id);
  if (action === "choose-character") setCharacterForOwner(button.dataset.owner, button.dataset.id);
  if (action === "clear-character") setCharacterForOwner(button.dataset.owner, "");
  if (action === "reset-save" && confirm("進行状況を初期状態に戻しますか？")) {
    resetCollection();
    renderTitle();
  }
  if (action === "select-stage") {
    state.selectedMapId = button.dataset.mapId;
    state.formation = [];
    initializeSelections();
    applyStarterFormation();
    renderSetup();
  }
  if (action === "faction") changeFaction(button.dataset.faction);
  if (action === "add") addFormationEntry();
  if (action === "remove") {
    state.formation.splice(Number(button.dataset.index), 1);
    renderSetup();
  }
  if (action === "launch") safeLaunchBattle();
});

battleScreen.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  const cell = event.target.closest(".cell");
  if (button?.dataset.action === "back") renderSetup();
  if (button?.dataset.action === "stage-select") renderStageSelect();
  if (button?.dataset.action === "card-list") renderCardList();
  if (button?.dataset.action === "choice-card") renderChoiceCardSelect();
  if (button?.dataset.action === "finish-deployment") finishDeployment();
  if (button?.dataset.action === "end-turn") endPlayerTurn();
  if (button?.dataset.action === "advance-enemy") advanceEnemyTurn();
  if (button?.dataset.action === "freezy-yard") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) activateFreezyYard(unit);
  }
  if (button?.dataset.action === "mine-scatter") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) useMineScatter(unit, weaponFor(button.dataset.weaponId));
  }
  if (button?.dataset.action === "smoke-discharger") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) useSmokeDischarger(unit, weaponFor(button.dataset.weaponId));
  }
  if (button?.dataset.action === "smoke-skill") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) useSmokeSkill(unit);
  }
  if (button?.dataset.action === "attack") {
    const attacker = state.units.find((unit) => unit.id === state.selectedUnitId);
    const defender = state.units.find((unit) => unit.id === state.selectedTargetId);
    if (attacker && defender) attack(attacker, defender, weaponFor(button.dataset.weaponId));
  }
  if (button?.dataset.unitId) {
    const unit = state.units.find((item) => item.id === button.dataset.unitId);
    const selected = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit.side === "player" && (state.phase === "player" || state.phase === "deployment")) {
      state.selectedUnitId = unit.id;
      state.selectedTargetId = null;
    } else if (state.phase === "player" && selected && unit.side !== selected.side) {
      state.selectedTargetId = unit.id;
    }
    renderBattle();
  } else if (cell && state.selectedUnitId) {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (state.phase === "deployment") moveDeploymentUnit(unit, Number(cell.dataset.x), Number(cell.dataset.y));
    else moveUnit(unit, Number(cell.dataset.x), Number(cell.dataset.y));
  }
});

boot();
