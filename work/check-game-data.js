#!/usr/bin/env node
"use strict";

// Final integrity check for the game data loaded by the browser.
// Unlike card-balance-report.js, this script fails on broken references,
// malformed values, impossible starter/stage formations, and map shape errors.

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATHS = [
  path.join(ROOT, "data", "game-data.js"),
  path.join(ROOT, "data", "system", "campaign.js"),
  path.join(ROOT, "data", "rules", "skills.js"),
  path.join(ROOT, "data", "maps", "maps.js"),
  path.join(ROOT, "data", "cards", "mobile-suits.js"),
  path.join(ROOT, "data", "cards", "battleships.js"),
  path.join(ROOT, "data", "cards", "weapons.js"),
  path.join(ROOT, "data", "cards", "characters.js"),
  path.join(ROOT, "data", "cards", "options.js"),
  path.join(ROOT, "data", "rules", "compatibility.js")
];

const COUNTED_COLLECTION_TYPES = new Set(["mobileSuits", "weapons", "options"]);
const COLLECTION_TYPES = ["mobileSuits", "battleships", "weapons", "characters", "options"];
const TERRAIN_KEYS = ["water", "forest", "desert", "debris"];
const MAP_TYPES = new Set(["ground", "space", "colony"]);
const DEPLOY_TYPES = new Set(["ground", "space"]);
const MOVEMENT_TYPES = new Set(["normal", "flying", "submarine"]);
const BLOCKING_TERRAINS = new Set(["obstacle", "cliff", "rock", "building", "wreckage", "domeRuin", "ruin"]);

function loadGameData() {
  const sandbox = { window: {} };
  for (const dataPath of DATA_PATHS) {
    if (!fs.existsSync(dataPath)) continue;
    vm.runInNewContext(fs.readFileSync(dataPath, "utf8"), sandbox, { filename: dataPath });
  }
  if (!sandbox.window.GAME_DATA) throw new Error("window.GAME_DATA was not defined.");
  return sandbox.window.GAME_DATA;
}

function byId(items = []) {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function isNonNegativeFinite(value) {
  return Number.isFinite(value) && value >= 0;
}

function mapDeployTypes(map) {
  return map.type === "colony" ? ["ground", "space"] : [map.type];
}

function terrainAt(map, x, y) {
  return map.terrain[y * map.width + x] ?? (map.type === "space" ? "space" : "plain");
}

function terrainBlocksMovement(terrain) {
  return BLOCKING_TERRAINS.has(terrain);
}

function movementTypeCanStandOnTerrain(movementType, terrain) {
  if (terrainBlocksMovement(terrain)) return false;
  if (movementType === "submarine") return terrain === "water";
  return true;
}

function cardCanStandAt(card, map, x, y) {
  return movementTypeCanStandOnTerrain(card?.movementType ?? "normal", terrainAt(map, x, y));
}

function mapHasStandableCell(card, map) {
  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      if (cardCanStandAt(card, map, x, y)) return true;
    }
  }
  return false;
}

function mobileSuitCanDeployOnMap(ms, map) {
  const deployTypes = mapDeployTypes(map);
  return list(ms.mapTypes ?? ["ground", "space"]).some((type) => deployTypes.includes(type))
    && mapHasStandableCell(ms, map);
}

function battleshipCanDeployOnMap(ship, map) {
  const deployTypes = mapDeployTypes(map);
  return ship.selectable !== false
    && list(ship.mapTypes ?? ["ground", "space"]).some((type) => deployTypes.includes(type))
    && mapHasStandableCell(ship, map);
}

function weaponSlotCost(weapon) {
  if (!weapon || weapon.fixedOnly) return 0;
  return Math.max(1, weapon.slotCost ?? 1);
}

function weaponUsableByFaction(weapon, faction) {
  return !weapon.factions || weapon.factions.includes(faction);
}

function optionUsableByFaction(option, faction) {
  return !option.factions || option.factions.includes(faction);
}

function weaponEquippableByMs(ms, weapon) {
  return !weapon.fixedOnly
    && weaponUsableByFaction(weapon, ms.faction)
    && !list(ms.forbiddenWeaponKinds).includes(weapon.kind)
    && (!(ms.allowedWeaponIds?.length) || ms.allowedWeaponIds.includes(weapon.id));
}

function itemLabel(item) {
  return item ? `${item.name ?? "(no name)"} (${item.id ?? "no-id"})` : "(missing)";
}

function createChecker(data) {
  const errors = [];
  const warnings = [];
  const indexes = {};

  function error(scope, message) {
    errors.push({ scope, message });
  }

  function warning(scope, message) {
    warnings.push({ scope, message });
  }

  function expectArray(scope, value) {
    if (!Array.isArray(value)) {
      error(scope, "配列ではありません。");
      return [];
    }
    return value;
  }

  function expectId(scope, indexName, id, allowEmpty = false) {
    if (allowEmpty && !id) return null;
    if (!id || typeof id !== "string") {
      error(scope, `IDが文字列ではありません: ${String(id)}`);
      return null;
    }
    const item = indexes[indexName]?.[id];
    if (!item) error(scope, `存在しない${indexName} IDです: ${id}`);
    return item ?? null;
  }

  function expectFaction(scope, faction, allowEmpty = false) {
    if (allowEmpty && !faction) return;
    if (!faction || !indexes.factions[faction]) error(scope, `存在しない勢力です: ${String(faction)}`);
  }

  function expectFactions(scope, factions, allowMissing = false) {
    if (allowMissing && factions === undefined) return;
    if (!Array.isArray(factions) || factions.length === 0) {
      error(scope, "factions は1件以上の配列である必要があります。");
      return;
    }
    factions.forEach((faction) => expectFaction(scope, faction));
  }

  function expectNumber(scope, item, key, { integer = false, required = true } = {}) {
    if (item[key] === undefined) {
      if (required) error(scope, `${key} が未設定です。`);
      return;
    }
    if (!isNonNegativeFinite(item[key]) || (integer && !Number.isInteger(item[key]))) {
      error(scope, `${key} は0以上の${integer ? "整数" : "数値"}である必要があります: ${String(item[key])}`);
    }
  }

  function expectUniqueIds(type, items) {
    const seen = new Set();
    items.forEach((item, index) => {
      const scope = `${type}[${index}]`;
      if (!item || typeof item !== "object") {
        error(scope, "オブジェクトではありません。");
        return;
      }
      if (!item.id || typeof item.id !== "string") {
        error(scope, "id が文字列ではありません。");
        return;
      }
      if (seen.has(item.id)) error(scope, `IDが重複しています: ${item.id}`);
      seen.add(item.id);
      if (!item.name || typeof item.name !== "string") error(scope, "name が文字列ではありません。");
    });
  }

  function validateCollection(collection, scope) {
    if (!isPlainObject(collection)) {
      error(scope, "collection がオブジェクトではありません。");
      return;
    }
    for (const type of COLLECTION_TYPES) {
      const value = collection[type];
      if (value === undefined) {
        error(`${scope}.${type}`, "未設定です。");
        continue;
      }
      if (COUNTED_COLLECTION_TYPES.has(type)) {
        if (!isPlainObject(value)) {
          error(`${scope}.${type}`, "枚数管理カードは { id: count } 形式である必要があります。");
          continue;
        }
        for (const [id, count] of Object.entries(value)) {
          expectId(`${scope}.${type}`, type, id);
          if (!Number.isInteger(count) || count < 0) error(`${scope}.${type}.${id}`, `枚数は0以上の整数である必要があります: ${String(count)}`);
        }
      } else {
        if (!Array.isArray(value)) {
          error(`${scope}.${type}`, "配列である必要があります。");
          continue;
        }
        value.forEach((id) => expectId(`${scope}.${type}`, type, id));
      }
    }
    if (!Array.isArray(collection.clearedStages)) error(`${scope}.clearedStages`, "配列である必要があります。");
    list(collection.clearedStages).forEach((id) => expectId(`${scope}.clearedStages`, "maps", id));
    if (collection.choiceTickets !== undefined && (!Number.isInteger(collection.choiceTickets) || collection.choiceTickets < 0)) {
      error(`${scope}.choiceTickets`, "choiceTickets は0以上の整数である必要があります。");
    }
  }

  function validateFormationEntry(entry, scope, faction, map = null) {
    if (!isPlainObject(entry)) {
      error(scope, "編成エントリがオブジェクトではありません。");
      return;
    }
    const ms = expectId(`${scope}.msId`, "mobileSuits", entry.msId);
    if (!ms) return;
    if (ms.faction !== faction) error(scope, `機体勢力が編成勢力と一致しません: ${ms.faction} !== ${faction}`);
    if (map && !mobileSuitCanDeployOnMap(ms, map)) error(scope, `${itemLabel(ms)} は ${map.name} に出撃できません。`);

    const characterIds = list(entry.characterIds);
    const weaponIds = list(entry.weaponIds);
    const optionIds = list(entry.optionIds);
    const usedCharacters = new Set();

    characterIds.forEach((id) => {
      const character = expectId(`${scope}.characterIds`, "characters", id);
      if (!character) return;
      if (character.faction !== faction) error(scope, `キャラクター勢力が編成勢力と一致しません: ${character.id}`);
      if (usedCharacters.has(character.characterKey)) error(scope, `同一人物が同一ユニット内で重複しています: ${character.characterKey}`);
      usedCharacters.add(character.characterKey);
    });

    let slotCost = 0;
    weaponIds.forEach((id) => {
      const weapon = expectId(`${scope}.weaponIds`, "weapons", id);
      if (!weapon) return;
      if (!weaponEquippableByMs(ms, weapon)) error(scope, `${itemLabel(weapon)} は ${itemLabel(ms)} に装備できません。`);
      slotCost += weaponSlotCost(weapon);
    });
    if (slotCost > (ms.weaponSlots ?? 2)) {
      error(scope, `武器スロット超過: ${slotCost} / ${ms.weaponSlots ?? 2}`);
    }

    optionIds.forEach((id) => {
      const option = expectId(`${scope}.optionIds`, "options", id);
      if (option && !optionUsableByFaction(option, faction)) error(scope, `${itemLabel(option)} は ${faction} で使用できません。`);
    });
    if (optionIds.length > (ms.optionSlots ?? 1)) {
      error(scope, `オプションスロット超過: ${optionIds.length} / ${ms.optionSlots ?? 1}`);
    }
  }

  function validateDataShape() {
    if (!isPlainObject(data)) {
      error("GAME_DATA", "オブジェクトではありません。");
      return;
    }

    expectArray("mobileSuits", data.mobileSuits);
    expectArray("battleships", data.battleships);
    expectArray("weapons", data.weapons);
    expectArray("characters", data.characters);
    expectArray("options", data.options);
    expectArray("maps", data.maps);
    expectArray("skills", data.skills);
    if (!isPlainObject(data.factions)) error("factions", "オブジェクトではありません。");
    if (!isPlainObject(data.campaign)) error("campaign", "オブジェクトではありません。");
    if (!isPlainObject(data.compatibility)) error("compatibility", "オブジェクトではありません。");

    indexes.mobileSuits = byId(expectArray("mobileSuits", data.mobileSuits));
    indexes.battleships = byId(expectArray("battleships", data.battleships));
    indexes.weapons = byId(expectArray("weapons", data.weapons));
    indexes.characters = byId(expectArray("characters", data.characters));
    indexes.options = byId(expectArray("options", data.options));
    indexes.maps = byId(expectArray("maps", data.maps));
    indexes.skills = byId(expectArray("skills", data.skills));
    indexes.factions = data.factions ?? {};

    ["mobileSuits", "battleships", "weapons", "characters", "options", "maps", "skills"].forEach((type) => {
      expectUniqueIds(type, data[type] ?? []);
    });
  }

  function validateCards() {
    data.mobileSuits.forEach((ms) => {
      const scope = `mobileSuits.${ms.id}`;
      expectFaction(scope, ms.faction);
      ["cost", "armor", "energy", "agility", "mobility"].forEach((key) => expectNumber(scope, ms, key));
      expectNumber(scope, ms, "weaponSlots", { integer: true, required: false });
      expectNumber(scope, ms, "optionSlots", { integer: true, required: false });
      list(ms.mapTypes ?? ["ground", "space"]).forEach((type) => {
        if (!DEPLOY_TYPES.has(type)) error(scope, `不明な mapTypes です: ${type}`);
      });
      if (ms.movementType !== undefined && !MOVEMENT_TYPES.has(ms.movementType)) error(scope, `不明な movementType です: ${ms.movementType}`);
      if (!isPlainObject(ms.terrainSuitability ?? {})) error(scope, "terrainSuitability はオブジェクトである必要があります。");
      TERRAIN_KEYS.forEach((key) => {
        if (ms.terrainSuitability?.[key] !== undefined && typeof ms.terrainSuitability[key] !== "boolean") {
          error(scope, `terrainSuitability.${key} は真偽値である必要があります。`);
        }
      });
      list(ms.fixedWeaponIds).forEach((id) => {
        const weapon = expectId(`${scope}.fixedWeaponIds`, "weapons", id);
        if (weapon && !weaponUsableByFaction(weapon, ms.faction)) error(scope, `${itemLabel(weapon)} は ${ms.faction} の固定武装として使えません。`);
      });
      list(ms.allowedWeaponIds).forEach((id) => {
        const weapon = expectId(`${scope}.allowedWeaponIds`, "weapons", id);
        if (weapon && !weaponEquippableByMs({ ...ms, allowedWeaponIds: [id] }, weapon)) error(scope, `${itemLabel(weapon)} は allowedWeaponIds 指定でも装備できません。`);
      });
      list(ms.escapeWeaponIds).forEach((id) => expectId(`${scope}.escapeWeaponIds`, "weapons", id));
      expectId(`${scope}.escapeMsId`, "mobileSuits", ms.escapeMsId, true);
      list(ms.specials).forEach((id) => expectId(`${scope}.specials`, "skills", id));
    });

    data.battleships.forEach((ship) => {
      const scope = `battleships.${ship.id}`;
      expectFaction(scope, ship.faction);
      ["cost", "armor", "energy", "agility", "mobility"].forEach((key) => expectNumber(scope, ship, key));
      list(ship.mapTypes ?? ["ground", "space"]).forEach((type) => {
        if (!DEPLOY_TYPES.has(type)) error(scope, `不明な mapTypes です: ${type}`);
      });
      if (ship.movementType !== undefined && !MOVEMENT_TYPES.has(ship.movementType)) error(scope, `不明な movementType です: ${ship.movementType}`);
      if (!isPlainObject(ship.support)) error(scope, "support が未設定です。");
      ["armor", "shield", "energy", "ammo"].forEach((key) => expectNumber(`${scope}.support`, ship.support ?? {}, key));
      list(ship.weaponIds).forEach((id) => {
        const weapon = expectId(`${scope}.weaponIds`, "weapons", id);
        if (weapon && !weaponUsableByFaction(weapon, ship.faction)) error(scope, `${itemLabel(weapon)} は ${ship.faction} の艦載武装として使えません。`);
      });
      expectId(`${scope}.escapeShipId`, "battleships", ship.escapeShipId, true);
    });

    data.weapons.forEach((weapon) => {
      const scope = `weapons.${weapon.id}`;
      ["cost", "power", "accuracy", "range", "minRange", "consume", "ammo", "durability", "slotCost", "requiredAwakening", "shieldAttackCost"].forEach((key) => {
        expectNumber(scope, weapon, key, { required: false });
      });
      if ((weapon.minRange ?? 1) > (weapon.range ?? 1)) error(scope, `minRange が range を超えています: ${weapon.minRange} > ${weapon.range}`);
      expectFactions(scope, weapon.factions, true);
      list(weapon.extraAttackIds).forEach((id) => expectId(`${scope}.extraAttackIds`, "weapons", id));
      list(weapon.specials).forEach((id) => expectId(`${scope}.specials`, "skills", id));
    });

    data.characters.forEach((character) => {
      const scope = `characters.${character.id}`;
      expectFaction(scope, character.faction);
      ["cost", "shooting", "melee", "reaction", "awakening", "command", "support", "maintenance"].forEach((key) => expectNumber(scope, character, key));
      if (!character.characterKey || typeof character.characterKey !== "string") error(scope, "characterKey が文字列ではありません。");
      if (!Array.isArray(character.roles) || character.roles.length === 0) warning(scope, "roles が未設定です。");
      list(character.specials).forEach((id) => expectId(`${scope}.specials`, "skills", id));
    });

    data.options.forEach((option) => {
      const scope = `options.${option.id}`;
      expectNumber(scope, option, "cost");
      expectFactions(scope, option.factions, true);
      expectId(`${scope}.grantsSkill`, "skills", option.grantsSkill, true);
      if (!option.effectText || typeof option.effectText !== "string") warning(scope, "effectText が未設定です。");
    });
  }

  function validateMaps() {
    data.maps.forEach((map) => {
      const scope = `maps.${map.id}`;
      if (!MAP_TYPES.has(map.type)) error(scope, `不明なマップ種別です: ${map.type}`);
      expectNumber(scope, map, "width", { integer: true });
      expectNumber(scope, map, "height", { integer: true });
      if (!Array.isArray(map.terrain)) {
        error(scope, "terrain は配列である必要があります。");
      } else if (Number.isInteger(map.width) && Number.isInteger(map.height) && map.terrain.length !== map.width * map.height) {
        error(scope, `terrain の長さが width * height と一致しません: ${map.terrain.length} !== ${map.width * map.height}`);
      }
      for (const side of ["player", "enemy"]) {
        const deployment = map.deployment?.[side];
        if (!deployment) {
          warning(scope, `${side} deployment が未設定です。`);
          continue;
        }
        const positions = [deployment.battleship, ...list(deployment.units)].filter(Boolean);
        positions.forEach((position, index) => {
          const label = index === 0 ? "battleship" : `units[${index - 1}]`;
          if (!Number.isInteger(position.x) || !Number.isInteger(position.y)) {
            error(`${scope}.deployment.${side}.${label}`, "x/y は整数である必要があります。");
          } else if (position.x < 0 || position.y < 0 || position.x >= map.width || position.y >= map.height) {
            error(`${scope}.deployment.${side}.${label}`, `マップ外です: ${position.x},${position.y}`);
          }
        });
      }
    });
  }

  function validateCampaign() {
    const campaign = data.campaign ?? {};
    expectFaction("campaign.initialFaction", campaign.initialFaction);
    validateCollection(campaign.initialCollection, "campaign.initialCollection");

    const initialCollection = campaign.initialCollection ?? {};
    for (const [faction, formation] of Object.entries(campaign.starterFormations ?? {})) {
      const scope = `campaign.starterFormations.${faction}`;
      expectFaction(scope, faction);
      const ship = expectId(`${scope}.battleshipId`, "battleships", formation.battleshipId);
      if (ship && ship.faction !== faction) error(scope, `戦艦勢力がスターター勢力と一致しません: ${ship.faction} !== ${faction}`);
      const captain = expectId(`${scope}.captainId`, "characters", formation.captainId, true);
      const firstOfficer = expectId(`${scope}.firstOfficerId`, "characters", formation.firstOfficerId, true);
      [captain, firstOfficer].filter(Boolean).forEach((character) => {
        if (character.faction !== faction) error(scope, `ブリッジ要員の勢力が一致しません: ${character.id}`);
      });
      list(formation.units).forEach((entry, index) => validateFormationEntry(entry, `${scope}.units[${index}]`, faction));

      if (ship && !list(initialCollection.battleships).includes(ship.id)) warning(scope, `${ship.id} は初期コレクションに含まれていません。`);
    }

    list(campaign.stages).forEach((stage, index) => {
      const scope = `campaign.stages[${index}:${stage.mapId ?? "no-map"}]`;
      const map = expectId(`${scope}.mapId`, "maps", stage.mapId);
      expectFaction(`${scope}.enemyFaction`, stage.enemyFaction);
      const ship = expectId(`${scope}.enemyBattleshipId`, "battleships", stage.enemyBattleshipId, true);
      if (ship && stage.enemyFaction && ship.faction !== stage.enemyFaction) error(scope, `敵戦艦勢力が enemyFaction と一致しません: ${ship.faction} !== ${stage.enemyFaction}`);
      if (ship && map && !battleshipCanDeployOnMap(ship, map)) error(scope, `${itemLabel(ship)} は ${map.name} に出撃できません。`);
      expectId(`${scope}.enemyCaptainId`, "characters", stage.enemyCaptainId, true);
      expectId(`${scope}.enemyFirstOfficerId`, "characters", stage.enemyFirstOfficerId, true);
      if (stage.costCap !== undefined) expectNumber(scope, stage, "costCap");

      const formations = stage.enemyFormations ?? {};
      if (!isPlainObject(formations)) {
        error(`${scope}.enemyFormations`, "オブジェクトではありません。");
      } else {
        for (const [faction, entries] of Object.entries(formations)) {
          expectFaction(`${scope}.enemyFormations`, faction);
          list(entries).forEach((entry, entryIndex) => validateFormationEntry(entry, `${scope}.enemyFormations.${faction}[${entryIndex}]`, faction, map));
          const slots = list(map?.deployment?.enemy?.units).length;
          if (map && entries.length > slots) warning(`${scope}.enemyFormations.${faction}`, `敵配置枠よりユニット数が多いです: ${entries.length} > ${slots}`);
        }
      }

      if (stage.dropRewards !== undefined) {
        error(scope, "ステージ別 dropRewards は廃止済みです。全体ランダム報酬 commonDropRewards を使います。");
      }
    });

    const commonDrop = campaign.commonDropRewards;
    if (commonDrop) {
      if (commonDrop.rolls !== undefined) expectNumber("campaign.commonDropRewards", commonDrop, "rolls", { integer: true });
      if (commonDrop.copyLimit !== undefined) expectNumber("campaign.commonDropRewards", commonDrop, "copyLimit", { integer: true });
      validateDropWeights(commonDrop.categoryWeights, "campaign.commonDropRewards.categoryWeights", COLLECTION_TYPES);
      validateDropWeights(commonDrop.ownershipBias, "campaign.commonDropRewards.ownershipBias", ["newCard", "ownedFew", "ownedMany"]);
    }

    const choice = campaign.choiceRewards;
    if (choice) {
      ["firstClearTickets", "repeatClearTickets"].forEach((key) => expectNumber("campaign.choiceRewards", choice, key, { integer: true, required: false }));
      expectNumber("campaign.choiceRewards", choice, "repeatClearChance", { required: false });
      if (choice.repeatClearChance !== undefined && choice.repeatClearChance > 1) error("campaign.choiceRewards", "repeatClearChance は 0〜1 の範囲である必要があります。");
    }
  }

  function validateDropWeights(weights, scope, allowedKeys) {
    if (weights === undefined) return;
    if (!isPlainObject(weights)) {
      error(scope, "重み設定がオブジェクトではありません。");
      return;
    }
    for (const key of allowedKeys) {
      if (weights[key] === undefined) warning(scope, `${key} が未設定です。未設定の場合は既定値を使います。`);
      else if (!Number.isFinite(weights[key]) || weights[key] <= 0) error(`${scope}.${key}`, "重みは0より大きい数値である必要があります。");
    }
    for (const key of Object.keys(weights)) {
      if (!allowedKeys.includes(key)) error(`${scope}.${key}`, "未対応の重みキーです。");
    }
  }

  function validateReward(reward, scope) {
    if (!isPlainObject(reward)) {
      error(scope, "報酬エントリがオブジェクトではありません。");
      return;
    }
    if (!COLLECTION_TYPES.includes(reward.type)) {
      error(scope, `不明な報酬typeです: ${String(reward.type)}`);
      return;
    }
    expectId(`${scope}.id`, reward.type, reward.id);
    expectNumber(scope, reward, "weight");
    if (reward.count !== undefined) expectNumber(scope, reward, "count", { integer: true });
  }

  function validateCompatibility() {
    const characterMs = data.compatibility?.characterMs;
    const msWeapon = data.compatibility?.msWeapon;
    if (!Array.isArray(characterMs)) error("compatibility.characterMs", "配列ではありません。");
    if (!Array.isArray(msWeapon)) error("compatibility.msWeapon", "配列ではありません。");

    const allMsTags = new Set(data.mobileSuits.flatMap((ms) => [ms.id, ...list(ms.tags)]));
    list(characterMs).forEach((entry, index) => {
      const scope = `compatibility.characterMs[${index}]`;
      expectId(`${scope}.characterId`, "characters", entry.characterId);
      if (entry.msId) expectId(`${scope}.msId`, "mobileSuits", entry.msId);
      if (entry.msTag && !allMsTags.has(entry.msTag)) error(scope, `一致する機体タグがありません: ${entry.msTag}`);
      if (!entry.msId && !entry.msTag) error(scope, "msId または msTag が必要です。");
      expectNumber(scope, entry, "evasionBonus", { required: false });
    });
    list(msWeapon).forEach((entry, index) => {
      const scope = `compatibility.msWeapon[${index}]`;
      if (entry.msId) expectId(`${scope}.msId`, "mobileSuits", entry.msId);
      if (entry.msTag && !allMsTags.has(entry.msTag)) error(scope, `一致する機体タグがありません: ${entry.msTag}`);
      if (!entry.msId && !entry.msTag) error(scope, "msId または msTag が必要です。");
      if (entry.weaponId) expectId(`${scope}.weaponId`, "weapons", entry.weaponId);
      if (entry.category && !data.weapons.some((weapon) => weapon.category === entry.category)) error(scope, `一致する武器カテゴリがありません: ${entry.category}`);
      if (!entry.weaponId && !entry.category) error(scope, "weaponId または category が必要です。");
      expectNumber(scope, entry, "accuracyBonus", { required: false });
    });
  }

  function run() {
    validateDataShape();
    if (errors.length > 0) return { errors, warnings };
    validateCards();
    validateMaps();
    validateCampaign();
    validateCompatibility();
    return { errors, warnings };
  }

  return { run };
}

function formatIssues(title, issues) {
  if (issues.length === 0) return `${title}: 0`;
  return [
    `${title}: ${issues.length}`,
    ...issues.map((issue) => `- [${issue.scope}] ${issue.message}`)
  ].join("\n");
}

function parseArgs(args) {
  const parsed = { json: false, warningsAsErrors: false };
  for (const arg of args) {
    if (arg === "--json") parsed.json = true;
    else if (arg === "--warnings-as-errors") parsed.warningsAsErrors = true;
    else if (arg === "--help") parsed.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return parsed;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log("Usage: node work/check-game-data.js [--json] [--warnings-as-errors]");
    process.exit(0);
  }

  const data = loadGameData();
  const result = createChecker(data).run();
  const source = DATA_PATHS
    .filter(fs.existsSync)
    .map((dataPath) => path.relative(ROOT, dataPath).replaceAll("\\", "/"));

  if (args.json) {
    console.log(JSON.stringify({ source, ...result }, null, 2));
  } else {
    console.log(`Game data check: ${source.join(" + ")}`);
    console.log(formatIssues("Errors", result.errors));
    console.log(formatIssues("Warnings", result.warnings));
    if (result.errors.length === 0 && (!args.warningsAsErrors || result.warnings.length === 0)) {
      console.log("OK: final game data is structurally valid.");
    }
  }

  const failed = result.errors.length > 0 || (args.warningsAsErrors && result.warnings.length > 0);
  process.exit(failed ? 1 : 0);
}

main();
