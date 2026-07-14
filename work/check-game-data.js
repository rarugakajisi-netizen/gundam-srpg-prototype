#!/usr/bin/env node
"use strict";

// Final integrity check for the game data loaded by the browser.
// Unlike card-balance-report.js, this script fails on broken references,
// malformed values, impossible starter/stage formations, and map shape errors.

const { DATA_FILES } = require("./project-files");
const { DIALOGUE_FILE, loadGameData, loadDialogueData } = require("./load-game-data");
const {
  byId,
  list,
  cardUsableByFaction,
  characterSelectable,
  mobileSuitPilotSlots,
  mapDeployTypes,
  terrainAt,
  terrainBlocksMovement,
  mobileSuitCanDeployOnMap,
  battleshipCanDeployOnMap,
  weaponSlotCost,
  weaponEquippableByMs
} = require("./game-data-helpers");
const { formatIssues, parseCheckArgs } = require("./check-cli");
const DIALOGUE_TYPES = ["attack", "hit", "miss", "move", "wait", "evade", "damaged"];

const COUNTED_COLLECTION_TYPES = new Set(["mobileSuits", "weapons", "options"]);
const COLLECTION_TYPES = ["mobileSuits", "battleships", "weapons", "characters", "options"];
const TERRAIN_KEYS = ["water", "forest", "desert", "debris"];
const MAP_TYPES = new Set(["ground", "space", "colony", "air"]);
const DEPLOY_TYPES = new Set(["ground", "space"]);
const MOVEMENT_TYPES = new Set(["normal", "flying", "submarine"]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonNegativeFinite(value) {
  return Number.isFinite(value) && value >= 0;
}

function weaponUsableByFaction(weapon, faction) {
  return cardUsableByFaction(weapon, faction);
}

function optionUsableByFaction(option, faction) {
  return cardUsableByFaction(option, faction);
}

function optionUsableOnMap(option, map) {
  if (!Array.isArray(option?.mapTypes) || option.mapTypes.length === 0) return true;
  const deployTypes = mapDeployTypes(map);
  return option.mapTypes.some((type) => deployTypes.includes(type));
}

function characterUsableByFaction(character, faction) {
  return cardUsableByFaction(character, faction);
}

function itemLabel(item) {
  return item ? `${item.name ?? "(no name)"} (${item.id ?? "no-id"})` : "(missing)";
}

function createChecker(data, dialogues = {}) {
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

  function expectUniqueList(scope, values) {
    if (!Array.isArray(values)) return;
    const duplicateValues = [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
    if (duplicateValues.length > 0) error(scope, `同じ値が重複しています: ${duplicateValues.join(", ")}`);
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
        expectUniqueList(`${scope}.${type}`, value);
        value.forEach((id) => expectId(`${scope}.${type}`, type, id));
      }
    }
    if (!Array.isArray(collection.clearedStages)) error(`${scope}.clearedStages`, "配列である必要があります。");
    list(collection.clearedStages).forEach((id) => expectId(`${scope}.clearedStages`, "maps", id));
    if (collection.choiceTickets !== undefined && (!Number.isInteger(collection.choiceTickets) || collection.choiceTickets < 0)) {
      error(`${scope}.choiceTickets`, "choiceTickets は0以上の整数である必要があります。");
    }
  }

  function validateFormationEntry(entry, scope, faction, map = null, options = {}) {
    const playerControlled = options.playerControlled !== false;
    if (!isPlainObject(entry)) {
      error(scope, "編成エントリがオブジェクトではありません。");
      return;
    }
    const ms = expectId(`${scope}.msId`, "mobileSuits", entry.msId);
    if (!ms) return;
    if (entry.factionOverride !== undefined) expectFaction(`${scope}.factionOverride`, entry.factionOverride);
    const capturedOperator = list(entry.characterIds)
      .map((id) => indexes.characters[id])
      .find((character) => (character?.specials ?? []).includes("capturedOperation") && ms.faction === "zeon" && character.faction === faction);
    const factionOverridden = entry.factionOverride === faction;
    if (ms.faction !== faction && !capturedOperator && !factionOverridden) error(scope, `機体勢力が編成勢力と一致しません: ${ms.faction} !== ${faction}`);
    if (entry.armorOverride !== undefined) expectNumber(scope, entry, "armorOverride", { integer: true });
    if (entry.aiInactiveUntilTurn !== undefined) expectNumber(scope, entry, "aiInactiveUntilTurn", { integer: true });

    const characterIds = list(entry.characterIds);
    const weaponIds = list(entry.weaponIds);
    const optionIds = list(entry.optionIds);
    expectUniqueList(`${scope}.characterIds`, characterIds);
    // 同一武器カードの複数装備は有効。重複分も下のスロット計算で個別に数える。
    expectUniqueList(`${scope}.optionIds`, optionIds);
    const entryOptions = optionIds.map((id) => indexes.options[id]).filter(Boolean);
    if (map && !mobileSuitCanDeployOnMap(ms, map, entryOptions)) error(scope, `${itemLabel(ms)} は ${map.name} に出撃できません。`);
    const usedCharacters = new Set();
    const pilotSlots = mobileSuitPilotSlots(ms);
    if (characterIds.length > pilotSlots) {
      error(scope, `パイロットスロット超過: ${characterIds.length} / ${pilotSlots}`);
    }

    characterIds.forEach((id) => {
      const character = expectId(`${scope}.characterIds`, "characters", id);
      if (!character) return;
      if (playerControlled && !characterSelectable(character)) error(scope, `敵専用/非選択キャラがプレイヤー編成に含まれています: ${character.id}`);
      if (!characterUsableByFaction(character, faction)) error(scope, `キャラクター勢力が編成勢力と一致しません: ${character.id}`);
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
      if (option && map && !optionUsableOnMap(option, map)) error(scope, `${itemLabel(option)} は ${map.name} に出撃できません。`);
      if (option && Number.isFinite(Number(option.maxMsCost)) && Number(ms.cost) > Number(option.maxMsCost)) {
        error(scope, `${itemLabel(option)} の機体コスト上限を超えています: ${ms.cost} > ${option.maxMsCost}`);
      }
      if (option && list(option.forbiddenMsSkills).some((skillId) => list(ms.specials).includes(skillId))) {
        error(scope, `${itemLabel(option)} は ${itemLabel(ms)} の機体スキルと競合します。`);
      }
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
      expectNumber(scope, ms, "pilotSlots", { integer: true, required: false });
      if (ms.pilotSlots !== undefined && mobileSuitPilotSlots(ms) !== ms.pilotSlots) error(scope, `pilotSlots は0以上の整数である必要があります: ${String(ms.pilotSlots)}`);
      if (mobileSuitPilotSlots(ms) > 1) warning(scope, "現在の編成UIはMSパイロット1名までの表示です。");
      expectNumber(scope, ms, "weaponSlots", { integer: true, required: false });
      expectNumber(scope, ms, "optionSlots", { integer: true, required: false });
      list(ms.mapTypes ?? ["ground", "space"]).forEach((type) => {
        if (!DEPLOY_TYPES.has(type)) error(scope, `不明な mapTypes です: ${type}`);
      });
      if (ms.movementType !== undefined && !MOVEMENT_TYPES.has(ms.movementType)) error(scope, `不明な movementType です: ${ms.movementType}`);
      if (!isPlainObject(ms.terrainSuitability ?? {})) error(scope, "terrainSuitability はオブジェクトである必要があります。");
      ["mapTypes", "fixedWeaponIds", "allowedWeaponIds", "escapeWeaponIds", "forbiddenWeaponKinds", "tags", "specials"].forEach((key) => {
        expectUniqueList(`${scope}.${key}`, ms[key]);
      });
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
      expectId(`${scope}.purgeMsId`, "mobileSuits", ms.purgeMsId, true);
      const transformMs = expectId(`${scope}.transformMsId`, "mobileSuits", ms.transformMsId, true);
      if (transformMs && transformMs.transformMsId !== ms.id) {
        warning(scope, `変形先 ${itemLabel(transformMs)} から変形元へ戻る transformMsId がありません。`);
      }
      if (
        transformMs
        && Number(ms.cost) !== Number(transformMs.cost)
        && (!transformMs.transformMsId || transformMs.transformMsId !== ms.id || ms.id < transformMs.id)
      ) {
        warning(scope, `変形先 ${itemLabel(transformMs)} とコストが一致していません: ${ms.cost} vs ${transformMs.cost}`);
      }
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
      ["mapTypes", "weaponIds"].forEach((key) => expectUniqueList(`${scope}.${key}`, ship[key]));
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
      ["factions", "extraAttackIds", "specials"].forEach((key) => expectUniqueList(`${scope}.${key}`, weapon[key]));
      if (weapon.chargeRequired !== undefined) {
        if (!Number.isInteger(weapon.chargeRequired) || weapon.chargeRequired <= 0) error(scope, "chargeRequired は1以上の整数である必要があります。");
        if (!Number.isFinite(weapon.chargeCost) || weapon.chargeCost < 0) error(scope, "チャージ武器には0以上の chargeCost が必要です。");
        if (weapon.chargeResetOnFire !== undefined && typeof weapon.chargeResetOnFire !== "boolean") error(scope, "chargeResetOnFire は真偽値で指定してください。");
      } else if (weapon.chargeCost !== undefined || weapon.chargeResetOnFire !== undefined) {
        warning(scope, "chargeRequired のない武器にチャージ設定があります。");
      }
      expectFactions(scope, weapon.factions, true);
      list(weapon.extraAttackIds).forEach((id) => expectId(`${scope}.extraAttackIds`, "weapons", id));
      list(weapon.specials).forEach((id) => expectId(`${scope}.specials`, "skills", id));
    });

    data.characters.forEach((character) => {
      const scope = `characters.${character.id}`;
      expectFaction(scope, character.faction);
      expectFactions(scope, character.factions, true);
      ["cost", "shooting", "melee", "reaction", "awakening", "command", "support", "maintenance"].forEach((key) => expectNumber(scope, character, key));
      if (!character.characterKey || typeof character.characterKey !== "string") error(scope, "characterKey が文字列ではありません。");
      if (!Array.isArray(character.roles) || character.roles.length === 0) warning(scope, "roles が未設定です。");
      ["factions", "roles", "tags", "specials"].forEach((key) => expectUniqueList(`${scope}.${key}`, character[key]));
      list(character.specials).forEach((id) => expectId(`${scope}.specials`, "skills", id));
    });

    data.options.forEach((option) => {
      const scope = `options.${option.id}`;
      if (!Number.isFinite(option.cost)) {
        error(scope, `cost は数値である必要があります: ${String(option.cost)}`);
      } else if (option.cost < 0 && option.effectType !== "downgrade") {
        error(scope, "マイナスコストは effectType が downgrade のオプションだけに設定できます。");
      }
      expectNumber(scope, option, "maxMsCost", { integer: true, required: false });
      ["armorModifier", "energyModifier", "agilityModifier", "mobilityModifier", "accuracyModifier", "damageModifier"].forEach((key) => {
        if (option[key] !== undefined && !Number.isFinite(option[key])) error(scope, `${key} は数値である必要があります。`);
      });
      if (option.allowsAirDeployment !== undefined && typeof option.allowsAirDeployment !== "boolean") error(scope, "allowsAirDeployment は真偽値で指定してください。");
      ["factions", "mapTypes", "weaponIds", "forbiddenMsSkills"].forEach((key) => expectUniqueList(`${scope}.${key}`, option[key]));
      expectFactions(scope, option.factions, true);
      list(option.mapTypes).forEach((type) => {
        if (!DEPLOY_TYPES.has(type)) error(scope, `不明な mapTypes です: ${type}`);
      });
      expectId(`${scope}.grantsSkill`, "skills", option.grantsSkill, true);
      list(option.weaponIds).forEach((id) => expectId(`${scope}.weaponIds`, "weapons", id));
      list(option.forbiddenMsSkills).forEach((id) => expectId(`${scope}.forbiddenMsSkills`, "skills", id));
      if (!option.effectText || typeof option.effectText !== "string") warning(scope, "effectText が未設定です。");
    });
  }

  function validateCardReachability() {
    const referencedWeaponIds = new Set();
    const addWeaponIds = (ids) => list(ids).forEach((id) => referencedWeaponIds.add(id));
    data.mobileSuits.forEach((ms) => {
      addWeaponIds(ms.fixedWeaponIds);
      addWeaponIds(ms.escapeWeaponIds);
    });
    data.battleships.forEach((ship) => addWeaponIds(ship.weaponIds));
    data.options.forEach((option) => addWeaponIds(option.weaponIds));
    data.weapons.forEach((weapon) => addWeaponIds(weapon.extraAttackIds));

    data.weapons.forEach((weapon) => {
      const scope = `weapons.${weapon.id}`;
      if (weapon.fixedOnly && !referencedWeaponIds.has(weapon.id)) {
        warning(scope, "fixedOnly ですが、機体・戦艦・オプション・追加攻撃のどこからも参照されていません。");
      }
      if (!weapon.fixedOnly && !data.mobileSuits.some((ms) => weaponEquippableByMs(ms, weapon) && weaponSlotCost(weapon) <= (ms.weaponSlots ?? 2))) {
        error(scope, "通常武器ですが、装備可能な機体が1機もありません。");
      }
    });

    data.options.forEach((option) => {
      const hasEligibleMs = data.mobileSuits.some((ms) =>
        (ms.optionSlots ?? 1) > 0
        && optionUsableByFaction(option, ms.faction)
        && (!Number.isFinite(Number(option.maxMsCost)) || Number(ms.cost) <= Number(option.maxMsCost))
        && !list(option.forbiddenMsSkills).some((skillId) => list(ms.specials).includes(skillId))
      );
      if (!hasEligibleMs) error(`options.${option.id}`, "装備可能な機体が1機もありません。");
    });

    const referencedSkillIds = new Set();
    [data.mobileSuits, data.weapons, data.characters].forEach((items) => {
      items.forEach((item) => list(item.specials).forEach((id) => referencedSkillIds.add(id)));
    });
    data.options.forEach((option) => {
      if (option.grantsSkill) referencedSkillIds.add(option.grantsSkill);
    });
    data.skills.forEach((skill) => {
      if (!referencedSkillIds.has(skill.id)) warning(`skills.${skill.id}`, "カードまたはオプションから参照されていません。");
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
        if (!characterSelectable(character)) error(scope, `敵専用/非選択キャラがブリッジ要員に含まれています: ${character.id}`);
        if (!characterUsableByFaction(character, faction)) error(scope, `ブリッジ要員の勢力が一致しません: ${character.id}`);
      });
      list(formation.units).forEach((entry, index) => validateFormationEntry(entry, `${scope}.units[${index}]`, faction));

      if (ship && !list(initialCollection.battleships).includes(ship.id)) warning(scope, `${ship.id} は初期コレクションに含まれていません。`);
    }

    const stageSeries = campaign.stageSeries ?? {};
    if (!isPlainObject(stageSeries)) {
      error("campaign.stageSeries", "オブジェクトではありません。");
    } else {
      const seriesOrders = new Map();
      for (const [seriesId, config] of Object.entries(stageSeries)) {
        const seriesScope = `campaign.stageSeries.${seriesId}`;
        if (!isPlainObject(config)) {
          error(seriesScope, "オブジェクトではありません。");
          continue;
        }
        if (typeof config.label !== "string" || !config.label.trim()) error(`${seriesScope}.label`, "空でない文字列である必要があります。");
        expectNumber(seriesScope, config, "order");
        if (seriesOrders.has(config.order)) warning(seriesScope, `別のタイトル分類と order が重複しています: ${config.order}`);
        else seriesOrders.set(config.order, seriesId);
      }
    }

    const stages = list(campaign.stages);
    const seenStageMaps = new Map();
    const seenStageOrders = new Map();
    stages.forEach((stage, index) => {
      const scope = `campaign.stages[${index}:${stage.mapId ?? "no-map"}]`;
      if (seenStageMaps.has(stage.mapId)) error(scope, `同じ mapId が別ステージでも使われています: ${stage.mapId}`);
      else seenStageMaps.set(stage.mapId, index);
      const orderKey = `${stage.series ?? ""}|${stage.order ?? ""}`;
      if (stage.series && stage.order !== undefined && seenStageOrders.has(orderKey)) {
        warning(scope, `同じ series 内で order が重複しています: ${stage.series} / ${stage.order}`);
      } else if (stage.series && stage.order !== undefined) {
        seenStageOrders.set(orderKey, index);
      }
      const map = expectId(`${scope}.mapId`, "maps", stage.mapId);
      expectFaction(`${scope}.enemyFaction`, stage.enemyFaction);
      if (!Object.prototype.hasOwnProperty.call(stage, "enemyBattleshipId")) {
        error(`${scope}.enemyBattleshipId`, "戦艦IDまたは戦艦なしを示す null を明示してください。");
      }
      const ship = expectId(`${scope}.enemyBattleshipId`, "battleships", stage.enemyBattleshipId, true);
      if (ship && stage.enemyFaction && ship.faction !== stage.enemyFaction) error(scope, `敵戦艦勢力が enemyFaction と一致しません: ${ship.faction} !== ${stage.enemyFaction}`);
      if (ship && map && !battleshipCanDeployOnMap(ship, map)) error(scope, `${itemLabel(ship)} は ${map.name} に出撃できません。`);
      list(stage.enemyEscortBattleshipIds).forEach((id, escortIndex) => {
        const escort = expectId(`${scope}.enemyEscortBattleshipIds[${escortIndex}]`, "battleships", id);
        if (escort && stage.enemyFaction && escort.faction !== stage.enemyFaction) error(scope, `随伴艦勢力が enemyFaction と一致しません: ${escort.faction} !== ${stage.enemyFaction}`);
        if (escort && map && !battleshipCanDeployOnMap(escort, map)) error(scope, `${itemLabel(escort)} は ${map.name} に出撃できません。`);
      });
      expectId(`${scope}.enemyCaptainId`, "characters", stage.enemyCaptainId, true);
      expectId(`${scope}.enemyFirstOfficerId`, "characters", stage.enemyFirstOfficerId, true);
      if (!stage.series || typeof stage.series !== "string") warning(scope, "検索/分類用の series が未設定です。");
      else if (isPlainObject(stageSeries) && !stageSeries[stage.series]) warning(scope, `stageSeries に未登録の分類です: ${stage.series}`);
      if (stage.order === undefined) warning(scope, "物語順ソート用の order が未設定です。");
      else expectNumber(scope, stage, "order", { integer: true });
      if (stage.tags !== undefined) {
        if (!Array.isArray(stage.tags)) {
          error(`${scope}.tags`, "配列である必要があります。");
        } else {
          stage.tags.forEach((tag, tagIndex) => {
            if (typeof tag !== "string" || !tag.trim()) error(`${scope}.tags[${tagIndex}]`, "空でない文字列である必要があります。");
          });
        }
      }
      if (stage.costCap !== undefined) expectNumber(scope, stage, "costCap");
      if (stage.turnLimit !== undefined) expectNumber(scope, stage, "turnLimit", { integer: true });
      if (stage.surviveTurns !== undefined) expectNumber(scope, stage, "surviveTurns", { integer: true });
      if (stage.enemyReinforcements !== undefined) {
        const reinforcementScope = `${scope}.enemyReinforcements`;
        if (!isPlainObject(stage.enemyReinforcements)) {
          error(reinforcementScope, "オブジェクトである必要があります。");
        } else {
          ["startTurn", "endTurn", "countPerTurn", "count"].forEach((key) => {
            if (stage.enemyReinforcements[key] !== undefined) expectNumber(reinforcementScope, stage.enemyReinforcements, key, { integer: true });
          });
          const reinforcementEntries = list(stage.enemyReinforcements.entries);
          const reinforcementBattleships = list(stage.enemyReinforcements.battleships);
          if (reinforcementEntries.length === 0 && reinforcementBattleships.length === 0) error(reinforcementScope, "MSまたは戦艦の増援エントリが1件以上必要です。");
          reinforcementEntries.forEach((entry, entryIndex) => {
            const reinforcementFaction = entry?.faction ?? stage.enemyFaction;
            if (entry?.faction !== undefined) expectFaction(`${reinforcementScope}.entries[${entryIndex}].faction`, entry.faction);
            validateFormationEntry(entry, `${reinforcementScope}.entries[${entryIndex}]`, reinforcementFaction, map, { playerControlled: false });
          });
          reinforcementBattleships.forEach((entry, entryIndex) => {
            const entryScope = `${reinforcementScope}.battleships[${entryIndex}]`;
            if (!isPlainObject(entry)) {
              error(entryScope, "オブジェクトである必要があります。");
              return;
            }
            const ship = expectId(`${entryScope}.battleshipId`, "battleships", entry.battleshipId);
            if (ship && ship.faction !== stage.enemyFaction) error(entryScope, `戦艦勢力が enemyFaction と一致しません: ${ship.faction} !== ${stage.enemyFaction}`);
            if (ship && map && !battleshipCanDeployOnMap(ship, map)) error(entryScope, `${itemLabel(ship)} は ${map.name} に出撃できません。`);
            list(entry.characterIds).forEach((id) => {
              const character = expectId(`${entryScope}.characterIds`, "characters", id);
              if (character && character.faction !== stage.enemyFaction) error(entryScope, `乗員勢力が enemyFaction と一致しません: ${character.faction} !== ${stage.enemyFaction}`);
            });
          });
        }
      }
      list(stage.defenseTargets).forEach((target, targetIndex) => {
        const targetScope = `${scope}.defenseTargets[${targetIndex}]`;
        if (!target.name || typeof target.name !== "string") warning(targetScope, "name が未設定です。");
        ["x", "y", "armor"].forEach((key) => expectNumber(targetScope, target, key, { integer: true }));
        if (target.mobility !== undefined) expectNumber(targetScope, target, "mobility", { integer: true });
        if (map && Number.isInteger(target.x) && Number.isInteger(target.y)) {
          if (target.x < 0 || target.y < 0 || target.x >= map.width || target.y >= map.height) {
            error(targetScope, `マップ外です: ${target.x},${target.y}`);
          } else if (terrainBlocksMovement(terrainAt(map, target.x, target.y))) {
            error(targetScope, `配置不能地形です: ${target.x},${target.y}`);
          }
        }
      });

      list(stage.destructionTargets).forEach((target, targetIndex) => {
        const targetScope = `${scope}.destructionTargets[${targetIndex}]`;
        if (!isPlainObject(target)) {
          error(targetScope, "オブジェクトである必要があります。");
          return;
        }
        if (!target.name || typeof target.name !== "string") warning(targetScope, "name が未設定です。");
        ["x", "y", "armor"].forEach((key) => expectNumber(targetScope, target, key, { integer: true }));
        if (target.mobility !== undefined) expectNumber(targetScope, target, "mobility", { integer: true });
        if (target.faction !== undefined) expectFaction(`${targetScope}.faction`, target.faction);
        if (map && Number.isInteger(target.x) && Number.isInteger(target.y)) {
          if (target.x < 0 || target.y < 0 || target.x >= map.width || target.y >= map.height) {
            error(targetScope, `マップ外です: ${target.x},${target.y}`);
          } else if (terrainBlocksMovement(terrainAt(map, target.x, target.y))) {
            error(targetScope, `配置不能地形です: ${target.x},${target.y}`);
          }
        }
      });

      const destructionTargetKeys = list(stage.destructionTargets).map((target) => `${target?.x},${target?.y}`);
      if (new Set(destructionTargetKeys).size !== destructionTargetKeys.length) error(`${scope}.destructionTargets`, "同じ座標が重複しています。");

      list(stage.infiltrationTargets).forEach((target, targetIndex) => {
        const targetScope = `${scope}.infiltrationTargets[${targetIndex}]`;
        if (!isPlainObject(target)) {
          error(targetScope, "オブジェクトである必要があります。");
          return;
        }
        ["x", "y"].forEach((key) => expectNumber(targetScope, target, key, { integer: true }));
        if (map && Number.isInteger(target.x) && Number.isInteger(target.y)) {
          if (target.x < 0 || target.y < 0 || target.x >= map.width || target.y >= map.height) {
            error(targetScope, `マップ外です: ${target.x},${target.y}`);
          } else if (terrainBlocksMovement(terrainAt(map, target.x, target.y))) {
            error(targetScope, `侵入不能地形です: ${target.x},${target.y}`);
          }
        }
      });

      const infiltrationKeys = list(stage.infiltrationTargets).map((target) => `${target?.x},${target?.y}`);
      if (new Set(infiltrationKeys).size !== infiltrationKeys.length) error(`${scope}.infiltrationTargets`, "同じ座標が重複しています。");

      list(stage.playerReachTargets).forEach((target, targetIndex) => {
        const targetScope = `${scope}.playerReachTargets[${targetIndex}]`;
        if (!isPlainObject(target)) {
          error(targetScope, "オブジェクトである必要があります。");
          return;
        }
        ["x", "y"].forEach((key) => expectNumber(targetScope, target, key, { integer: true }));
        if (map && Number.isInteger(target.x) && Number.isInteger(target.y)) {
          if (target.x < 0 || target.y < 0 || target.x >= map.width || target.y >= map.height) {
            error(targetScope, `マップ外です: ${target.x},${target.y}`);
          } else if (terrainBlocksMovement(terrainAt(map, target.x, target.y))) {
            error(targetScope, `到達不能地形です: ${target.x},${target.y}`);
          }
        }
      });

      const playerReachKeys = list(stage.playerReachTargets).map((target) => `${target?.x},${target?.y}`);
      if (new Set(playerReachKeys).size !== playerReachKeys.length) error(`${scope}.playerReachTargets`, "同じ座標が重複しています。");

      list(stage.initialMines).forEach((mine, mineIndex) => {
        const mineScope = `${scope}.initialMines[${mineIndex}]`;
        if (!isPlainObject(mine)) {
          error(mineScope, "オブジェクトである必要があります。");
          return;
        }
        ["x", "y"].forEach((key) => expectNumber(mineScope, mine, key, { integer: true }));
        if (mine.damage !== undefined) expectNumber(mineScope, mine, "damage", { integer: true });
        if (mine.side !== undefined && !["player", "enemy"].includes(mine.side)) error(`${mineScope}.side`, "player または enemy を指定してください。");
        if (map && Number.isInteger(mine.x) && Number.isInteger(mine.y)) {
          if (mine.x < 0 || mine.y < 0 || mine.x >= map.width || mine.y >= map.height) {
            error(mineScope, `マップ外です: ${mine.x},${mine.y}`);
          } else if (terrainBlocksMovement(terrainAt(map, mine.x, mine.y))) {
            error(mineScope, `機雷を配置できない地形です: ${mine.x},${mine.y}`);
          }
        }
      });

      const initialMineKeys = list(stage.initialMines).map((mine) => `${mine?.x},${mine?.y}`);
      if (new Set(initialMineKeys).size !== initialMineKeys.length) error(`${scope}.initialMines`, "同じ座標が重複しています。");

      const formations = stage.enemyFormations ?? {};
      if (!isPlainObject(formations)) {
        error(`${scope}.enemyFormations`, "オブジェクトではありません。");
      } else {
        const primaryFormation = formations[stage.enemyFaction];
        if (!Array.isArray(primaryFormation) || primaryFormation.length === 0) {
          error(`${scope}.enemyFormations.${stage.enemyFaction}`, "enemyFaction の固定敵編成を1件以上指定してください。");
        }
        for (const [faction, entries] of Object.entries(formations)) {
          expectFaction(`${scope}.enemyFormations`, faction);
          if (!Array.isArray(entries)) {
            error(`${scope}.enemyFormations.${faction}`, "配列である必要があります。");
            continue;
          }
          entries.forEach((entry, entryIndex) => validateFormationEntry(entry, `${scope}.enemyFormations.${faction}[${entryIndex}]`, faction, map, { playerControlled: false }));
          const slots = list(map?.deployment?.enemy?.units).length;
          if (map && entries.length > slots) warning(`${scope}.enemyFormations.${faction}`, `敵配置枠よりユニット数が多いです: ${entries.length} > ${slots}`);
        }
      }

      if (stage.dropRewards !== undefined) {
        error(scope, "ステージ別 dropRewards は廃止済みです。全体ランダム報酬 commonDropRewards を使います。");
      }
    });

    const stageMapIds = new Set(stages.map((stage) => stage.mapId));
    data.maps.forEach((map) => {
      if (!stageMapIds.has(map.id)) warning(`maps.${map.id}`, "対応するキャンペーンステージがなく、フリー対戦を解放できません。");
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
    const seenCharacterMs = new Set();
    list(characterMs).forEach((entry, index) => {
      const scope = `compatibility.characterMs[${index}]`;
      const selectorKey = `${entry.characterId ?? ""}|${entry.msId ?? ""}|${entry.msTag ?? ""}`;
      if (seenCharacterMs.has(selectorKey)) error(scope, `同じ相性条件が重複しています: ${selectorKey}`);
      seenCharacterMs.add(selectorKey);
      expectId(`${scope}.characterId`, "characters", entry.characterId);
      if (entry.msId) expectId(`${scope}.msId`, "mobileSuits", entry.msId);
      if (entry.msTag && !allMsTags.has(entry.msTag)) error(scope, `一致する機体タグがありません: ${entry.msTag}`);
      if (!entry.msId && !entry.msTag) error(scope, "msId または msTag が必要です。");
      expectNumber(scope, entry, "evasionBonus", { required: false });
    });
    const seenMsWeapon = new Set();
    list(msWeapon).forEach((entry, index) => {
      const scope = `compatibility.msWeapon[${index}]`;
      const selectorKey = `${entry.msId ?? ""}|${entry.msTag ?? ""}|${entry.weaponId ?? ""}|${entry.category ?? ""}`;
      if (seenMsWeapon.has(selectorKey)) error(scope, `同じ相性条件が重複しています: ${selectorKey}`);
      seenMsWeapon.add(selectorKey);
      if (entry.msId) expectId(`${scope}.msId`, "mobileSuits", entry.msId);
      if (entry.msTag && !allMsTags.has(entry.msTag)) error(scope, `一致する機体タグがありません: ${entry.msTag}`);
      if (!entry.msId && !entry.msTag) error(scope, "msId または msTag が必要です。");
      if (entry.weaponId) expectId(`${scope}.weaponId`, "weapons", entry.weaponId);
      if (entry.category && !data.weapons.some((weapon) => weapon.category === entry.category)) error(scope, `一致する武器カテゴリがありません: ${entry.category}`);
      if (!entry.weaponId && !entry.category) error(scope, "weaponId または category が必要です。");
      expectNumber(scope, entry, "accuracyBonus", { required: false });
    });
  }

  function validateDialogues() {
    if (!isPlainObject(dialogues)) {
      error("dialogues", "キャラクターセリフがオブジェクトではありません。");
      return;
    }
    const characterKeys = new Set(data.characters.map((character) => character.characterKey));
    for (const characterKey of characterKeys) {
      if (!dialogues[characterKey]) error(`dialogues.${characterKey}`, "対応するキャラクターのセリフがありません。");
    }
    for (const [characterKey, dialogue] of Object.entries(dialogues)) {
      const scope = `dialogues.${characterKey}`;
      if (!characterKeys.has(characterKey)) warning(scope, "対応する characterKey がありません。");
      if (!isPlainObject(dialogue)) {
        error(scope, "セリフセットがオブジェクトではありません。");
        continue;
      }
      for (const type of DIALOGUE_TYPES) {
        if (!Array.isArray(dialogue[type]) || dialogue[type].length === 0) {
          error(`${scope}.${type}`, "セリフが1件以上必要です。");
        } else if (dialogue[type].some((line) => typeof line !== "string" || !line.trim())) {
          error(`${scope}.${type}`, "空でない文字列だけを指定してください。");
        }
      }
    }
  }

  function run() {
    validateDataShape();
    if (errors.length > 0) return { errors, warnings };
    validateCards();
    validateCardReachability();
    validateMaps();
    validateCampaign();
    validateCompatibility();
    validateDialogues();
    return { errors, warnings };
  }

  return { run };
}

function main() {
  const args = parseCheckArgs(process.argv.slice(2));
  if (args.help) {
    console.log("Usage: node work/check-game-data.js [--json] [--warnings-as-errors]");
    process.exit(0);
  }

  const data = loadGameData();
  const dialogues = loadDialogueData();
  const result = createChecker(data, dialogues).run();
  const source = [...DATA_FILES, DIALOGUE_FILE];

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
