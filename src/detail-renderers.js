"use strict";

// Shared labels, rule helpers, terrain helpers, and card detail renderers.

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
  const ace = character.specials.includes("ace") ? " / 適性機体で与ダメージ+10" : "";
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
  return cardUsableByFaction(weapon, faction);
}

function optionUsableByFaction(option, faction) {
  return cardUsableByFaction(option, faction);
}

function optionMapTypesText(option) {
  if (!Array.isArray(option.mapTypes) || option.mapTypes.length === 0) return "地上 / 宇宙";
  return option.mapTypes.map((type) => ({ ground: "地上", space: "宇宙" }[type] ?? type)).join(" / ");
}

function weaponEquippableByMs(ms, weapon) {
  return !weapon.fixedOnly
    && weaponUsableByFaction(weapon, ms.faction)
    && !(ms.forbiddenWeaponKinds ?? []).includes(weapon.kind)
    && (!(ms.allowedWeaponIds?.length) || ms.allowedWeaponIds.includes(weapon.id));
}

function mobileSuitWeaponRestrictionText(ms) {
  if (ms.allowedWeaponIds?.length) {
    return `指定武器のみ: ${ms.allowedWeaponIds.map((id) => lookup().weapons[id]?.name ?? id).join(" / ")}`;
  }
  if ((ms.forbiddenWeaponKinds ?? []).includes("beam")) return "ビーム兵器不可";
  return "なし";
}

function mobileSuitPurgeTargetText(ms) {
  const targetId = ms.purgeMsId ?? ms.escapeMsId;
  if (!(ms.specials ?? []).includes("additionalArmor") || !targetId) return "なし";
  return lookup().ms[targetId]?.name ?? targetId;
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
  if (type === "air") return "空中";
  return "地上";
}

function mapDeployTypes(map) {
  if (map.type === "colony") return ["ground", "space"];
  if (map.type === "air") return ["ground"];
  return [map.type];
}

function terrainLabel(terrain) {
  return {
    plain: "平地",
    air: "空中",
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
    bridge: "橋",
    gate: "コロニー出入口",
    wreckage: "残骸",
    urban: "荒廃市街",
    domeRuin: "ドーム状廃施設",
    ruin: "廃ビル"
  }[terrain] ?? terrain;
}

function terrainShortLabel(terrain) {
  return {
    air: "空",
    forest: "森",
    desert: "砂",
    water: "水",
    debris: "デ",
    obstacle: "障",
    cliff: "崖",
    rock: "岩",
    building: "建",
    bridge: "橋",
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
  return map.terrain[y * boardWidth(map) + x] ?? (map.type === "space" ? "space" : map.type === "air" ? "air" : "plain");
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
  if (!isMovableUnit(unit)) return new Set();
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
  if (weapon.cannotTargetFlying && isMobileSuit(defender) && unitIsFlying(defender)) return false;
  if (weapon.attackType === "shooting" && unitIsConcealedFrom(defender, attacker)) return false;
  const range = distance(attacker, defender);
  return range >= weaponMinRange(weapon) && range <= weaponMaxRange(attacker, weapon);
}

function weaponBlockedByObstacle(attacker, defender, weapon) {
  return !weapon.ignoresObstacles && lineOfSightBlocked(attacker, defender);
}

function optionProvidesAirDeployment(option) {
  return option?.allowsAirDeployment === true;
}

function mobileSuitNativelyAirborne(ms) {
  return ms?.movementType === "flying";
}

function mobileSuitCanDeployOnMap(ms, map = selectedMap(), optionIds = []) {
  const deployTypes = mapDeployTypes(map);
  return (ms.mapTypes ?? ["ground", "space"]).some((type) => deployTypes.includes(type))
    && (map.type !== "air" || mobileSuitNativelyAirborne(ms) || optionIds.some((id) => optionProvidesAirDeployment(lookup().options[id])))
    && mapHasStandableCell(ms, map);
}

function mobileSuitCanPotentiallyDeployOnMap(ms, map = selectedMap(), faction = state.faction) {
  if (mobileSuitCanDeployOnMap(ms, map)) return true;
  if (map.type !== "air" || (ms.optionSlots ?? 1) < 1) return false;
  return (state.data.options ?? []).some((option) => optionProvidesAirDeployment(option) && optionEquippableByMs(option, ms, map, faction));
}

function formationEntryCanDeployOnMap(entry, map = selectedMap()) {
  return mobileSuitCanDeployOnMap(lookup().ms[entry?.msId], map, entry?.optionIds ?? []);
}

function battleshipCanDeployOnMap(ship, map = selectedMap()) {
  const deployTypes = mapDeployTypes(map);
  return ship.selectable !== false
    && (ship.mapTypes ?? ["ground", "space"]).some((type) => deployTypes.includes(type))
    && (map.type !== "air" || ship.movementType === "flying")
    && mapHasStandableCell(ship, map);
}

function unitHasActiveAirDeploymentSfs(unit) {
  return isMobileSuit(unit)
    && !unit.vehicleOptionDisabled
    && unitOptions(unit).some(optionProvidesAirDeployment);
}

function unitIsFlying(unit, targetMs = null) {
  if (!unit) return false;
  if (isBattleship(unit)) return battleshipFor(unit).movementType === "flying";
  if (!isMobileSuit(unit)) return false;
  return mobileSuitNativelyAirborne(targetMs ?? msFor(unit)) || unitHasActiveAirDeploymentSfs(unit);
}

function unitCanRemainAirborne(unit, targetCard = null) {
  if (selectedMap().type !== "air") return true;
  if (isBattleship(unit)) return (targetCard ?? battleshipFor(unit))?.movementType === "flying";
  return unitIsFlying(unit, targetCard ?? msFor(unit));
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
    ...unitOptions(unit).map((option) => option.grantsSkill).filter(Boolean),
    ...(unit.temporarySkills ?? [])
  ];
}

function unitHasSkill(unit, skillId) {
  return unitSpecials(unit).includes(skillId);
}

function unitIsConcealedFrom(defender, attacker) {
  if (!isMobileSuit(defender)) return false;
  if (defender.infiltrationExposed) return false;
  if (unitHasSkill(attacker, "recon")) return false;
  const nearbyScout = state.units.some((unit) => unit.side === attacker.side && isCombatUnit(unit) && distance(unit, defender) <= 2);
  const smokeConcealed = (defender.smokeConcealedTurns ?? 0) > 0;
  const stealthConcealed = unitHasSkill(defender, "stealth") && !defender.stealthRevealed && distance(defender, attacker) > 2 && !nearbyScout;
  const guerrillaConcealed = unitHasSkill(defender, "guerrillaTactics")
    && GUERRILLA_TERRAINS.has(terrainAt(defender.x, defender.y))
    && distance(defender, attacker) > 2
    && !nearbyScout;
  return smokeConcealed || stealthConcealed || guerrillaConcealed;
}

function unitDetailsConcealedFromSide(defender, viewerSide) {
  if (!isMobileSuit(defender) || defender.side === viewerSide) return false;
  const viewers = state.units.filter((unit) => unit.side === viewerSide && isCombatUnit(unit) && isAlive(unit));
  return viewers.length > 0 && viewers.every((viewer) => unitIsConcealedFrom(defender, viewer));
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

function jinxEvasionPenalty(unit) {
  if (!isMobileSuit(unit)) return 0;
  return state.units.some((other) =>
    other.id !== unit.id
    && other.side === unit.side
    && isMobileSuit(other)
    && isAlive(other)
    && unitHasSkill(other, "jinx")
    && distance(other, unit) <= 2
  ) ? 6 : 0;
}

function retreatSupportActive(unit) {
  if (!isMobileSuit(unit) || unit.armor > unit.maxArmor / 3) return false;
  return state.units.some((other) =>
    other.side === unit.side
    && isCombatUnit(other)
    && unitHasSkill(other, "retreatSupport")
  );
}

function repeatedTargetAttack(unit, defender) {
  return (unit.attackTargetCounts?.[defender.id] ?? 0) > 0;
}

function recordAttackTarget(unit, defender) {
  if (!unit.attackTargetCounts) unit.attackTargetCounts = {};
  unit.attackTargetCounts[defender.id] = (unit.attackTargetCounts[defender.id] ?? 0) + 1;
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
  if ((unit.examTurnsRemaining ?? 0) > 0) skills.push(`EXAM発動中${unit.examTurnsRemaining}`);
  if ((unit.hadesTurnsRemaining ?? 0) > 0) skills.push(`HADES発動中${unit.hadesTurnsRemaining}`);
  if ((unit.zeusTurnsRemaining ?? 0) > 0) skills.push(`ZEUS発動中${unit.zeusTurnsRemaining}`);
  if ((unit.areusTurnsRemaining ?? 0) > 0) skills.push(`AREUS発動中${unit.areusTurnsRemaining}`);
  if ((unit.themisTurnsRemaining ?? 0) > 0) skills.push(`THEMIS発動中${unit.themisTurnsRemaining}`);
  if ((unit.mobileDiverTurnsRemaining ?? 0) > 0) skills.push(`高度維持限界${unit.mobileDiverTurnsRemaining}`);
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
    tickExamSystem(unit);
    tickHadesSystem(unit);
    tickLimitedSystems(unit);
    tickMobileDiver(unit);
    if (!isAlive(unit)) return;
    advanceLearningComputer(unit);
    unit.attackTargetCounts = {};
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
    "beam-saber": "ビームサーベル系",
    bazooka: "バズーカ系",
    "beam-bazooka": "ビームバズーカ系",
    cannon: "キャノン系",
    "machine-gun": "マシンガン系",
    gatling: "ガトリング系",
    bullpup: "ブルパップ系",
    grenade: "投擲系",
    missile: "ミサイル系",
    shield: "盾",
    melee: "格闘系",
    hammer: "ハンマー系",
    harpoon: "水中銛系",
    claw: "クロー系",
    torpedo: "魚雷系",
    psycommu: "サイコミュ兵器",
    "mega-particle": "メガ粒子砲系",
    "heavy-launcher": "重ランチャー系",
    "support-rocket": "支援ロケット系",
    "aircraft-gun": "航空機銃系",
    "aircraft-missile": "航空ミサイル系",
    "aircraft-bomb": "航空爆弾系",
    "aircraft-beam": "航空ビーム系",
    "ship-gun": "艦砲系",
    vulcan: "バルカン系",
    bomb: "爆弾系",
    special: "特殊兵装"
  }[category] ?? category;
}

function mobileSuitTags(ms) {
  return ms.tags ?? [ms.id];
}

function isDedicatedMobileSuit(ms) {
  return /[（(][^）)]*(?:機|隊)[）)]/.test(ms?.name ?? "");
}

function isDedicatedCompatibilityTag(tag) {
  return tag !== "commanderCustom"
    && (/Custom$/.test(tag) || ["whiteDingo", "immortal4th", "slaveWraith"].includes(tag));
}

function compatibilityMatchesMs(item, ms) {
  return item.msId === ms.id || (item.msTag && mobileSuitTags(ms).includes(item.msTag));
}

function characterMsCompatibilityMatches(item, ms) {
  if (!compatibilityMatchesMs(item, ms)) return false;
  if (!isDedicatedMobileSuit(ms)) return true;
  return item.msId === ms.id
    || Boolean(item.msTag && isDedicatedCompatibilityTag(item.msTag) && mobileSuitTags(ms).includes(item.msTag));
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
    unit4: "ガンダム4号機系",
    unit5: "ガンダム5号機系",
    secondLotGundam: "セカンドロット系ガンダム",
    bst: "Bst仕様",
    spaceAssault: "宇宙強襲仕様",
    pixy: "ピクシー系",
    vProject: "V作戦系",
    gm: "ジム系",
    gmCommand: "ジム・コマンド系",
    gmSniper: "ジム・スナイパー系",
    immortal4th: "不死身の第四小隊仕様",
    armoredGm: "ジム装甲強化型",
    groundGm: "陸戦型ジム系",
    guncannon: "ガンキャノン系",
    cannonMs: "キャノン系MS",
    guntank: "ガンタンク系",
    gFighter: "Gファイター系",
    groundGundam: "陸戦型ガンダム系",
    zaku: "ザク系",
    zaku1: "ザクI系",
    zaku2: "ザクII系",
    gerhartCustom: "ゲラート機",
    highMobilityZaku: "高機動型ザク系",
    highMobilityMs: "高機動MS",
    gouf: "グフ系",
    dom: "ドム系",
    domFunf: "ドム・フュンフ系",
    domBeinNichts: "ドム・バインニヒツ系",
    domGrossBeil: "ドム・グロウスバイル系",
    domTropen: "ドム・トローペン系",
    efreet: "イフリート系",
    rickDom: "リック・ドム系",
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
    apsaras: "アプサラス系",
    charCustom: "シャア専用機",
    red: "赤い機体",
    black: "黒い機体",
    supportPod: "支援ポッド",
    tank: "戦車系",
    mudrock: "マドロック",
    desert: "砂漠戦仕様",
    meleeMs: "格闘型MS",
    stealthMs: "ステルスMS",
    smokeMs: "煙幕装備MS",
    assaultMs: "強襲型MS"
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
  const matches = (state.data.compatibility?.characterMs ?? []).filter((item) => characterMsCompatibilityMatches(item, ms));
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
        ["搭乗", mobileSuitCanHavePilot(ms) ? `パイロット${mobileSuitPilotSlots(ms)}名` : "パイロット不可"],
        ["装備枠", `武器${ms.weaponSlots ?? 2} / OP${ms.optionSlots ?? 1}`],
        ["携行武器制限", mobileSuitWeaponRestrictionText(ms)],
        ["特殊", specialsLabel(ms.specials)],
        ["脱出先", (ms.specials ?? []).includes("coreSystem") ? (lookup().ms[ms.escapeMsId ?? "coreFighter"]?.name ?? ms.escapeMsId ?? "コア・ファイター") : "なし"],
        ["パージ先", mobileSuitPurgeTargetText(ms)],
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

function characterStatDisplay(character, stat) {
  const baseValue = Number(character?.[stat]) || 0;
  const bonus = characterStatGrowthBonus(character, stat);
  const value = Math.min(CHARACTER_GROWTH_STAT_CAP, baseValue + bonus);
  if (bonus <= 0) return value;
  return `${value} <span class="growth-bonus">+${bonus}</span><span class="small inline">基礎${baseValue}</span>`;
}

function renderCharacterGrowthPanel(character) {
  if (!character?.id || !hasCard("characters", character.id) || !characterSelectable(character)) return "";
  const record = characterGrowthRecordForView(character.id);
  const progress = characterGrowthProgress(record);
  const unspent = Math.max(0, Number(record.unspent) || 0);
  const buttons = CHARACTER_GROWTH_STATS.map((stat) => {
    const label = CHARACTER_GROWTH_STAT_LABELS[stat] ?? stat;
    const baseValue = Number(character[stat]) || 0;
    const bonus = characterStatGrowthBonus(character, stat);
    const value = Math.min(CHARACTER_GROWTH_STAT_CAP, baseValue + bonus);
    const capped = value >= CHARACTER_GROWTH_STAT_CAP;
    return `
      <button data-action="grow-character-stat" data-character-id="${escapeAttr(character.id)}" data-stat="${stat}" ${unspent < 1 || capped ? "disabled" : ""}>
        ${label}+1
        <span class="button-detail">${value}/${CHARACTER_GROWTH_STAT_CAP}${bonus > 0 ? `（成長+${bonus}）` : ""}</span>
      </button>
    `;
  }).join("");
  return `
    <div class="growth-panel">
      <div class="growth-head">
        <strong>成長</strong>
        <span class="status-pill ${unspent > 0 ? "ready" : ""}">未使用pt ${unspent}</span>
      </div>
      <p class="small">出撃 ${record.sorties ?? 0}回 / 次の成長まで ${progress} / ${CHARACTER_GROWTH_SORTIES_PER_POINT}</p>
      <div class="growth-actions">${buttons}</div>
    </div>
  `;
}

function renderCharacterDetails(character, options = {}) {
  const grownCharacter = characterWithGrowth(character);
  const factions = character.factions?.map((faction) => state.data.factions[faction]).join(" / ")
    ?? state.data.factions[character.faction]
    ?? character.faction;
  return `
    <details class="detail-box" ${options.open ? "open" : ""}>
      <summary>${character.name} 詳細</summary>
      ${statItems([
        ["使用勢力", factions],
        ["コスト", character.cost],
        ["射撃", characterStatDisplay(character, "shooting")],
        ["格闘", characterStatDisplay(character, "melee")],
        ["反応", characterStatDisplay(character, "reaction")],
        ["覚醒", character.awakening],
        ["指揮", characterStatDisplay(character, "command")],
        ["支援", characterStatDisplay(character, "support")],
        ["整備", characterStatDisplay(character, "maintenance")],
        ["得意", characterRolesLabel(character)]
      ])}
      ${renderCharacterGrowthPanel(character)}
      <div class="detail-list">
        <p class="small">特殊: ${specialsLabel(character.specials)}</p>
        <p class="small">MS搭乗時: ${characterMsContributionText(grownCharacter)}</p>
        <p class="small">戦艦搭乗時: ${characterBridgeContributionText(grownCharacter)}</p>
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
        ["使用勢力", factions],
        ["機体相性", weaponCompatibilityText(weapon)]
      ]) : statItems([
        ["コスト", weapon.cost],
        ["威力", weapon.power],
        ["命中", weapon.accuracy],
        ["射程", weaponRangeLabel(weapon).replace("射程", "")],
        ["消費", weaponConsumptionLabel(weapon)],
        ["チャージ", weapon.chargeRequired ? `${weapon.chargeRequired}回 / EN${weapon.chargeCost ?? 0}` : "不要"],
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
        ...(Number.isFinite(Number(option.maxMsCost)) ? [["機体コスト条件", `${option.maxMsCost}以下`]] : []),
        ["出撃", optionMapTypesText(option)],
        ["重複", option.uniqueSkill ? "同名効果と重複なし" : "重複可"],
        ["使用勢力", factions]
      ])}
      ${option.grantsSkill ? renderSkillDetails([option.grantsSkill]) : ""}
    </details>
  `;
}

