#!/usr/bin/env node
"use strict";

// Runtime/UI integrity checks that sit above structural data validation.
// This catches issues such as faction-filter leakage, picker candidate drift,
// unhandled data-action buttons, and equipment candidates that should never
// appear in the pre-battle setup UI.

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
const SOURCE_PATHS = [
  path.join(ROOT, "src", "setup-flow.js"),
  path.join(ROOT, "src", "battle-render.js"),
  path.join(ROOT, "src", "events.js")
];
const COUNTED_CARD_TYPES = new Set(["mobileSuits", "weapons", "options"]);
const COLLECTION_TYPES = ["mobileSuits", "battleships", "weapons", "characters", "options"];
const BLOCKING_TERRAINS = new Set(["obstacle", "cliff", "rock", "building", "wreckage", "domeRuin", "ruin"]);

function loadGameData() {
  const sandbox = { window: {} };
  for (const dataPath of DATA_PATHS) {
    vm.runInNewContext(fs.readFileSync(dataPath, "utf8"), sandbox, { filename: dataPath });
  }
  return sandbox.window.GAME_DATA;
}

function byId(items = []) {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function itemName(item) {
  return `${item?.name ?? "(no name)"} (${item?.id ?? "no-id"})`;
}

function cardUsableByFaction(card, faction) {
  if (Array.isArray(card.factions)) return card.factions.includes(faction);
  if (card.faction) return card.faction === faction;
  return true;
}

function cardUsableOnMap(card, map) {
  if (!Array.isArray(card?.mapTypes) || card.mapTypes.length === 0) return true;
  const deployTypes = mapDeployTypes(map);
  return card.mapTypes.some((type) => deployTypes.includes(type));
}

function itemFactionIds(item) {
  if (Array.isArray(item.factions)) return item.factions;
  if (item.faction) return [item.faction];
  return [];
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

function cardCanStandAt(card, x, y, map) {
  return movementTypeCanStandOnTerrain(card?.movementType ?? "normal", terrainAt(map, x, y));
}

function mapHasStandableCell(card, map) {
  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      if (cardCanStandAt(card, x, y, map)) return true;
    }
  }
  return false;
}

function mapDeployTypes(map) {
  return map.type === "colony" ? ["ground", "space"] : [map.type];
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

function weaponSlotCount(ms) {
  return ms?.weaponSlots ?? 2;
}

function weaponEquippableByMs(ms, weapon) {
  return !weapon.fixedOnly
    && cardUsableByFaction(weapon, ms.faction)
    && !list(ms.forbiddenWeaponKinds).includes(weapon.kind)
    && (!(ms.allowedWeaponIds?.length) || ms.allowedWeaponIds.includes(weapon.id));
}

function setupWeaponCandidate(ms, weapon) {
  return weaponEquippableByMs(ms, weapon) && weaponSlotCost(weapon) <= weaponSlotCount(ms);
}

function collectionCount(collection, type, id) {
  if (COUNTED_CARD_TYPES.has(type)) return collection[type]?.[id] ?? 0;
  return list(collection[type]).includes(id) ? 1 : 0;
}

function hasCard(collection, type, id) {
  return collectionCount(collection, type, id) > 0;
}

function setupCandidatePools(data, collection, faction, map) {
  return {
    mobileSuits: data.mobileSuits.filter((item) =>
      item.faction === faction && hasCard(collection, "mobileSuits", item.id) && mobileSuitCanDeployOnMap(item, map)
    ),
    battleships: data.battleships.filter((item) =>
      item.faction === faction && hasCard(collection, "battleships", item.id) && battleshipCanDeployOnMap(item, map)
    ),
    characters: data.characters.filter((item) =>
      characterSelectable(item) && cardUsableByFaction(item, faction) && hasCard(collection, "characters", item.id)
    ),
    options: data.options.filter((item) =>
      hasCard(collection, "options", item.id) && cardUsableByFaction(item, faction) && cardUsableOnMap(item, map)
    )
  };
}

function characterSelectable(character) {
  return character.selectable !== false;
}

function createChecker(data) {
  const errors = [];
  const warnings = [];
  const indexes = {
    mobileSuits: byId(data.mobileSuits),
    battleships: byId(data.battleships),
    weapons: byId(data.weapons),
    characters: byId(data.characters),
    options: byId(data.options),
    maps: byId(data.maps)
  };
  const factions = Object.keys(data.factions ?? {});
  const initialCollection = data.campaign?.initialCollection ?? {};

  function error(scope, message) {
    errors.push({ scope, message });
  }

  function warning(scope, message) {
    warnings.push({ scope, message });
  }

  function validateFactionPredicates() {
    for (const type of COLLECTION_TYPES) {
      const items = data[type] ?? [];
      for (const item of items) {
        const ids = itemFactionIds(item);
        if (item.faction && Array.isArray(item.factions) && !item.factions.includes(item.faction)) {
          error(`${type}.${item.id}`, `faction が factions に含まれていません: ${item.faction}`);
        }
        for (const faction of factions) {
          const expected = ids.length === 0 || ids.includes(faction);
          const actual = cardUsableByFaction(item, faction);
          if (actual !== expected) {
            error(`${type}.${item.id}`, `勢力使用判定がラベルと不一致です: ${faction} expected=${expected} actual=${actual}`);
          }
        }
      }
    }
  }

  function validateSetupPools() {
    for (const map of data.maps) {
      for (const faction of factions) {
        const pools = setupCandidatePools(data, initialCollection, faction, map);
        for (const ms of pools.mobileSuits) {
          if (ms.faction !== faction) error(`setup.${map.id}.${faction}.mobileSuits`, `所属外機体が候補に入ります: ${itemName(ms)}`);
        }
        for (const ship of pools.battleships) {
          if (ship.faction !== faction) error(`setup.${map.id}.${faction}.battleships`, `所属外戦艦が候補に入ります: ${itemName(ship)}`);
        }
        for (const character of pools.characters) {
          if (!cardUsableByFaction(character, faction)) error(`setup.${map.id}.${faction}.characters`, `所属外キャラが候補に入ります: ${itemName(character)}`);
        }
        for (const option of pools.options) {
          if (!cardUsableByFaction(option, faction)) error(`setup.${map.id}.${faction}.options`, `所属外オプションが候補に入ります: ${itemName(option)}`);
          if (!cardUsableOnMap(option, map)) error(`setup.${map.id}.${faction}.options`, `出撃不可マップのオプションが候補に入ります: ${itemName(option)}`);
        }
        const playable = pools.mobileSuits.length > 0 && pools.battleships.length > 0 && pools.characters.length > 0;
        if (playable && pools.mobileSuits.every((ms) => data.weapons.every((weapon) => !setupWeaponCandidate(ms, weapon)))) {
          warning(`setup.${map.id}.${faction}`, "出撃可能な機体があるのに携行可能な非固定武器がありません。固定武装のみなら問題ありません。");
        }
      }
    }
  }

  function validateEquipmentPools() {
    for (const ms of data.mobileSuits) {
      const equippable = data.weapons.filter((weapon) => setupWeaponCandidate(ms, weapon));
      for (const weapon of equippable) {
        if (!cardUsableByFaction(weapon, ms.faction)) {
          error(`equipment.${ms.id}`, `所属外武器が装備候補になります: ${itemName(weapon)}`);
        }
        if (weapon.fixedOnly) error(`equipment.${ms.id}`, `固定武装が携行候補になります: ${itemName(weapon)}`);
      }
      const minSlotOverflow = equippable.filter((weapon) => weaponSlotCost(weapon) > weaponSlotCount(ms));
      for (const weapon of minSlotOverflow) {
        error(`equipment.${ms.id}`, `単体で武器スロットを超過する武器が装備候補になります: ${itemName(weapon)}`);
      }
    }
  }

  function validateFreeBattlePools() {
    for (const faction of factions) {
      const characters = data.characters.filter((character) => character.faction === faction);
      if (characters.length === 0) error(`freeBattle.${faction}.characters`, "敵生成用の主所属キャラ候補がありません。");
      if (!characters.some((character) => character.roles?.includes("pilot"))) {
        warning(`freeBattle.${faction}.characters`, "敵生成用の主所属パイロット候補がありません。");
      }
      for (const map of data.maps) {
        const msCandidates = data.mobileSuits.filter((ms) => ms.faction === faction && mobileSuitCanDeployOnMap(ms, map));
        const shipCandidates = data.battleships.filter((ship) => ship.faction === faction && battleshipCanDeployOnMap(ship, map));
        if (msCandidates.length === 0) warning(`freeBattle.${map.id}.${faction}`, "敵生成用の機体候補がありません。");
        if (shipCandidates.length === 0) warning(`freeBattle.${map.id}.${faction}`, "敵生成用の戦艦候補がありません。");
      }
    }
  }

  function validateSourceActions() {
    const renderSources = [
      fs.readFileSync(path.join(ROOT, "src", "setup-flow.js"), "utf8"),
      fs.readFileSync(path.join(ROOT, "src", "battle-render.js"), "utf8")
    ].join("\n");
    const eventSource = fs.readFileSync(path.join(ROOT, "src", "events.js"), "utf8");
    const literalActions = new Set(
      [...renderSources.matchAll(/data-action="([a-z0-9-]+)"/g)].map((match) => match[1])
    );
    const handledActions = new Set([
      ...[...eventSource.matchAll(/action === "([a-z0-9-]+)"/g)].map((match) => match[1]),
      ...[...eventSource.matchAll(/dataset\.action === "([a-z0-9-]+)"/g)].map((match) => match[1])
    ]);
    for (const action of literalActions) {
      if (!handledActions.has(action)) error("ui.actions", `data-action の処理がありません: ${action}`);
    }
  }

  function validateLoadOrder() {
    const index = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    const scriptPaths = [...index.matchAll(/<script src="\.\/([^"?]+)(?:\?[^"]*)?"><\/script>/g)].map((match) => match[1]);
    const requiredOrder = [
      "src/core.js",
      "src/detail-renderers.js",
      "src/setup-flow.js",
      "src/battle-render.js",
      "src/dialogue.js",
      "src/battle-rules.js",
      "src/events.js"
    ];
    let lastIndex = -1;
    for (const script of requiredOrder) {
      const current = scriptPaths.indexOf(script);
      if (current === -1) error("ui.scriptOrder", `index.html に ${script} がありません。`);
      if (current < lastIndex) error("ui.scriptOrder", `${script} の読み込み順が前提と違います。`);
      lastIndex = current;
    }
  }

  function run() {
    validateFactionPredicates();
    validateSetupPools();
    validateEquipmentPools();
    validateFreeBattlePools();
    validateSourceActions();
    validateLoadOrder();
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
    console.log("Usage: node work/check-play-integrity.js [--json] [--warnings-as-errors]");
    process.exit(0);
  }
  SOURCE_PATHS.forEach((sourcePath) => {
    if (!fs.existsSync(sourcePath)) throw new Error(`Missing source file: ${path.relative(ROOT, sourcePath)}`);
  });
  const result = createChecker(loadGameData()).run();
  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log("Play integrity check: setup candidates + faction predicates + UI action wiring");
    console.log(formatIssues("Errors", result.errors));
    console.log(formatIssues("Warnings", result.warnings));
    if (result.errors.length === 0 && (!args.warningsAsErrors || result.warnings.length === 0)) {
      console.log("OK: play/setup integrity checks passed.");
    }
  }
  const failed = result.errors.length > 0 || (args.warningsAsErrors && result.warnings.length > 0);
  process.exit(failed ? 1 : 0);
}

main();
