"use strict";

const BLOCKING_TERRAINS = new Set([
  "obstacle",
  "cliff",
  "rock",
  "building",
  "wreckage",
  "domeRuin",
  "ruin"
]);

function byId(items = []) {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function cardUsableByFaction(card, faction) {
  if (!card) return false;
  if (Array.isArray(card.factions)) return card.factions.includes(faction);
  if (card.faction) return card.faction === faction;
  return true;
}

function characterSelectable(character) {
  return Boolean(character) && character.selectable !== false;
}

function mobileSuitPilotSlots(ms) {
  return Math.max(0, Math.floor(Number(ms?.pilotSlots ?? 1) || 0));
}

function mapDeployTypes(map) {
  if (!map) return [];
  if (map.type === "colony") return ["ground", "space"];
  if (map.type === "air") return ["ground"];
  return [map.type];
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
  if (!card || !map) return false;
  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      if (cardCanStandAt(card, map, x, y)) return true;
    }
  }
  return false;
}

function mobileSuitCanDeployOnMap(ms, map, options = []) {
  if (!ms || !map) return false;
  const deployTypes = mapDeployTypes(map);
  return list(ms.mapTypes ?? ["ground", "space"]).some((type) => deployTypes.includes(type))
    && (map.type !== "air" || ms.movementType === "flying" || options.some((option) => option?.allowsAirDeployment === true))
    && mapHasStandableCell(ms, map);
}

function battleshipCanDeployOnMap(ship, map) {
  if (!ship || !map) return false;
  const deployTypes = mapDeployTypes(map);
  return ship.selectable !== false
    && list(ship.mapTypes ?? ["ground", "space"]).some((type) => deployTypes.includes(type))
    && (map.type !== "air" || ship.movementType === "flying")
    && mapHasStandableCell(ship, map);
}

function weaponSlotCost(weapon) {
  if (!weapon || weapon.fixedOnly) return 0;
  return Math.max(1, weapon.slotCost ?? 1);
}

function weaponEquippableByMs(ms, weapon) {
  return Boolean(ms && weapon)
    && !weapon.fixedOnly
    && cardUsableByFaction(weapon, ms.faction)
    && !list(ms.forbiddenWeaponKinds).includes(weapon.kind)
    && (!(ms.allowedWeaponIds?.length) || ms.allowedWeaponIds.includes(weapon.id));
}

module.exports = {
  byId,
  list,
  cardUsableByFaction,
  characterSelectable,
  mobileSuitPilotSlots,
  mapDeployTypes,
  terrainAt,
  terrainBlocksMovement,
  movementTypeCanStandOnTerrain,
  cardCanStandAt,
  mapHasStandableCell,
  mobileSuitCanDeployOnMap,
  battleshipCanDeployOnMap,
  weaponSlotCost,
  weaponEquippableByMs
};
