"use strict";

// Battle rules, combat resolution, movement, turn flow, and enemy AI.

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
    .filter(Boolean)
    .map((character) => unit.side === "player" ? characterWithGrowth(character) : character);
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
  if (isBarricade(unit)) return unit.name ?? "バリケード";
  if (isDefenseTarget(unit)) return unit.name ?? "防衛対象";
  if (isDestructionTarget(unit)) return unit.name ?? "破壊目標";
  if (isBattleship(unit)) return battleshipFor(unit).name;
  return msFor(unit).name;
}

function unitFaction(unit) {
  if (isBarricade(unit)) return unit.faction ?? (unit.side === "player" ? state.faction : otherFaction(state.faction));
  if (isDefenseTarget(unit)) return unit.faction ?? "federation";
  if (isDestructionTarget(unit)) return unit.faction ?? "federation";
  return isBattleship(unit) ? battleshipFor(unit).faction : msFor(unit).faction;
}

function combatUnitTotalCost(unit) {
  if (Number.isFinite(unit.totalCost)) return unit.totalCost;
  if (isMobileSuit(unit)) return msFor(unit).cost;
  if (isBattleship(unit)) {
    return battleshipFor(unit).cost
      + battleshipCrew(unit).reduce((sum, character) => sum + (character.cost ?? 0), 0);
  }
  return 0;
}

function rivalryActive(attacker, defender) {
  return isMobileSuit(attacker)
    && unitHasSkill(attacker, "rivalry")
    && combatUnitTotalCost(defender) > combatUnitTotalCost(attacker);
}

function oldSoldierPrideActive(attacker, defender) {
  return isMobileSuit(attacker)
    && unitHasSkill(attacker, "oldSoldierPride")
    && combatUnitTotalCost(defender) > combatUnitTotalCost(attacker);
}

function oldSoldierPrideEvasionPenalty(unit, options = {}) {
  return isMobileSuit(unit) && options.incomingAttack && unitHasSkill(unit, "oldSoldierPride") ? 6 : 0;
}

function enemyIntelAccuracyPenalty(attacker) {
  const opposingSide = attacker.side === "player" ? "enemy" : "player";
  return state.turnNumber === 1
    && state.phase === "enemy"
    && sideHasSkill(opposingSide, "enemyIntel")
    ? 8
    : 0;
}

function mobilityFor(unit) {
  if (isBarricade(unit)) return 0;
  if (isDefenseTarget(unit)) return Math.max(0, Number(unit.mobility) || 0);
  if (isDestructionTarget(unit)) return Math.max(0, Number(unit.mobility) || 0);
  if (isBattleship(unit)) {
    return unit.mobilityOverride !== null
      && unit.mobilityOverride !== undefined
      && Number.isFinite(Number(unit.mobilityOverride))
      ? Math.max(0, Math.floor(Number(unit.mobilityOverride)))
      : battleshipFor(unit).mobility;
  }
  const optionBonus = unitOptions(unit)
    .filter((option) => option.effectType === "mobility")
    .reduce((total, option) => total + (option.value ?? 1), 0);
  const vehicleBonus = activeVehicleOptions(unit).reduce((total, option) => total + (option.value ?? 0), 0);
  const stopMovementPenalty = hinderedByStopMovement(unit) ? 1 : 0;
  const retreatBonus = retreatMobilitySupportActive(unit) ? 1 : 0;
  const modernizationBonus = massProductionModernizationActive(unit) ? 1 : 0;
  const directModifier = optionModifierTotal(unit.optionIds, "mobilityModifier");
  return Math.max(1, msFor(unit).mobility + directModifier + optionBonus + vehicleBonus + retreatBonus + modernizationBonus - unitTerrainPenalty(unit).mobility - stopMovementPenalty);
}

function runtimeWeapon(unit, weaponId) {
  return unit.runtimeWeapons.find((weapon) => weapon.id === weaponId);
}

function activeShield(unit) {
  if (!isCombatUnit(unit)) return null;
  return unit.runtimeWeapons.find((runtime) => weaponFor(runtime.id).kind === "shield" && runtime.durability > 0);
}

function alliedBattleship(side) {
  return state.units.find((unit) => unit.side === side && isBattleship(unit) && isAlive(unit));
}

function alliedBattleships(side) {
  return state.units.filter((unit) => unit.side === side && isBattleship(unit) && isAlive(unit));
}

function nearestAlliedBattleship(unit) {
  return [...alliedBattleships(unit.side)].sort((a, b) =>
    distance(unit, a) - distance(unit, b) || String(a.id).localeCompare(String(b.id))
  )[0] ?? null;
}

function sideHasSkill(side, skillId) {
  return state.units.some((unit) => unit.side === side && isCombatUnit(unit) && isAlive(unit) && unitHasSkill(unit, skillId));
}

function opposingBattleSide(side) {
  return side === "player" ? "enemy" : "player";
}

function massProductionModernizationSource(unit) {
  if (!isMobileSuit(unit) || !isAlive(unit)) return null;
  return state.units.find((source) => {
    if (source.side !== unit.side || !isMobileSuit(source) || !isAlive(source)) return false;
    if (source.msId !== unit.msId || distance(source, unit) > 3) return false;
    const option = unitOptions(source).find((item) => item.grantsSkill === "massProductionModernization");
    if (!option || Number(msFor(source).cost) > Number(option.maxMsCost ?? 150)) return false;
    return state.units.some((ally) =>
      ally.id !== source.id
      && ally.side === source.side
      && isMobileSuit(ally)
      && isAlive(ally)
      && ally.msId === source.msId
      && distance(source, ally) <= 3
    );
  }) ?? null;
}

function massProductionModernizationActive(unit) {
  return Boolean(massProductionModernizationSource(unit));
}

function alliedBattleshipInDanger(side) {
  return state.units.some((unit) =>
    unit.side === side
    && isBattleship(unit)
    && isAlive(unit)
    && unit.maxArmor > 0
    && unit.armor <= Math.floor(unit.maxArmor / 2)
  );
}

function rearGuardDestroyedAllyExists(unit) {
  if (!isCombatUnit(unit)) return false;
  return state.units.some((other) =>
    other.id !== unit.id
    && other.side === unit.side
    && (isMobileSuit(other) || isBattleship(other))
    && other.armor <= 0
    && (isBattleship(unit) || !isBattleship(other))
  );
}

function desperateRearGuardActive(unit) {
  return isCombatUnit(unit)
    && unitHasSkill(unit, "desperateRearGuard")
    && alliedBattleshipInDanger(unit.side)
    && rearGuardDestroyedAllyExists(unit);
}

function nearbyAlliedUnit(unit, range = 2) {
  if (!isCombatUnit(unit)) return false;
  return state.units.some((other) =>
    other.id !== unit.id
    && other.side === unit.side
    && isCombatUnit(other)
    && distance(other, unit) <= range
  );
}

function schemingActive(unit) {
  return isCombatUnit(unit)
    && unitHasSkill(unit, "scheming")
    && nearbyAlliedUnit(unit, 2);
}

function schemingAccuracyBonus(unit) {
  return schemingActive(unit) ? 6 : 0;
}

function schemingEvasionBonus(unit) {
  return schemingActive(unit) ? 6 : 0;
}

function aquaticCombatAdaptationActive(unit) {
  return isMobileSuit(unit)
    && unitHasSkill(unit, "aquaticCombatAdaptation")
    && terrainAt(unit.x, unit.y) === "water";
}

function spaceCombatAdaptationActive(unit) {
  return isMobileSuit(unit)
    && unitHasSkill(unit, "spaceCombatAdaptation")
    && ["space", "debris"].includes(terrainAt(unit.x, unit.y));
}

function mobileSuitIsAquaticOrSpaceOnly(unit) {
  if (!isMobileSuit(unit)) return false;
  const ms = msFor(unit);
  const mapTypes = ms.mapTypes ?? ["ground", "space"];
  return ms.movementType === "submarine"
    || ms.terrainSuitability?.water === true
    || (mapTypes.length === 1 && mapTypes[0] === "space");
}

function marineSpaceSupportActive(unit) {
  return isMobileSuit(unit) && mobileSuitIsAquaticOrSpaceOnly(unit) && sideHasSkill(unit.side, "marineSpaceSupport");
}

function peaceWillDefensiveActive(unit) {
  return isMobileSuit(unit)
    && unit.maxArmor > 0
    && unit.armor <= Math.floor(unit.maxArmor / 3)
    && sideHasSkill(unit.side, "peaceWill");
}

function retreatMobilitySupportActive(unit) {
  return isMobileSuit(unit)
    && unit.maxArmor > 0
    && unit.armor <= Math.floor(unit.maxArmor / 3)
    && sideHasSkill(unit.side, "breakthroughSupport");
}

function examSystemActive(unit) {
  return isMobileSuit(unit) && (unit.examTurnsRemaining ?? 0) > 0;
}

function hadesSystemActive(unit) {
  return isMobileSuit(unit) && (unit.hadesTurnsRemaining ?? 0) > 0;
}

function limitedSystemConfig(skillId) {
  return LIMITED_SYSTEMS[skillId] ?? null;
}

function limitedSystemActive(unit, skillId) {
  const config = limitedSystemConfig(skillId);
  return Boolean(config && isMobileSuit(unit) && (unit[config.turnsProp] ?? 0) > 0);
}

function canActivateLimitedSystem(unit, skillId) {
  const config = limitedSystemConfig(skillId);
  return Boolean(config
    && isMobileSuit(unit)
    && isAlive(unit)
    && unitHasSkill(unit, skillId)
    && !unit[config.activatedProp]
    && !limitedSystemActive(unit, skillId));
}

function exposeConcealedEnemies(source) {
  const targets = state.units.filter((unit) =>
    unit.side !== source.side
    && isMobileSuit(unit)
    && isAlive(unit)
    && (
      unitHasSkill(unit, "stealth")
      || unitHasSkill(unit, "guerrillaTactics")
      || (unit.smokeConcealedTurns ?? 0) > 0
    )
  );
  targets.forEach((unit) => {
    unit.activeConcealmentGrace = false;
    unit.infiltrationExposed = true;
    unit.stealthRevealed = true;
    unit.smokeConcealedTurns = 0;
  });
  if (targets.length > 0) state.log.push(`${unitName(source)}が敵隠密${targets.length}機を看破。`);
}

function activateLimitedSystem(unit, skillId, reason = "耐久低下") {
  const config = limitedSystemConfig(skillId);
  if (!canActivateLimitedSystem(unit, skillId)) return false;
  unit[config.activatedProp] = true;
  unit[config.turnsProp] = 3;
  if (skillId === "themisSystem") exposeConcealedEnemies(unit);
  state.log.push(`${unitName(unit)}の${config.name}発動（${reason}）。3ターン後に機体へ大きな負荷がかかります。`);
  return true;
}

function activateLimitedSystemsByArmor(unit) {
  if (!isMobileSuit(unit) || !isAlive(unit) || unit.maxArmor <= 0) return false;
  if (unit.armor > Math.floor(unit.maxArmor / 3)) return false;
  let activated = false;
  Object.keys(LIMITED_SYSTEMS).forEach((skillId) => {
    if (activateLimitedSystem(unit, skillId, "耐久低下")) activated = true;
  });
  return activated;
}

function overheatLimitedSystemUnit(unit, skillId) {
  const config = limitedSystemConfig(skillId);
  if (!config || !isMobileSuit(unit) || !isAlive(unit)) return false;
  const armorLoss = Math.max(1, Math.ceil(unit.maxArmor * LIMITED_SYSTEM_OVERHEAT_ARMOR_LOSS_RATE));
  const beforeArmor = unit.armor;
  unit.armor = Math.max(0, unit.armor - armorLoss);
  unit.energy = 0;
  unit[config.turnsProp] = 0;
  unit[config.overheatedProp] = true;
  state.log.push(`${unitName(unit)}が${config.name}の限界に達し、耐久${beforeArmor - unit.armor}低下、EN0。`);
  if (unit.armor === 0) {
    state.log.push(`${unitName(unit)}は${config.name}の負荷で戦闘不能。`);
    triggerSacrificialBoost(unit);
    checkOutcome();
  }
  return true;
}

function tickLimitedSystem(unit, skillId) {
  const config = limitedSystemConfig(skillId);
  if (!config) return;
  if (!limitedSystemActive(unit, skillId)) {
    activateLimitedSystemsByArmor(unit);
    return;
  }
  unit[config.turnsProp] -= 1;
  if (unit[config.turnsProp] <= 0) overheatLimitedSystemUnit(unit, skillId);
}

function tickLimitedSystems(unit) {
  Object.keys(LIMITED_SYSTEMS).forEach((skillId) => tickLimitedSystem(unit, skillId));
}

function characterIsNewtype(character) {
  return Boolean(character?.isNewtype)
    || (character?.tags ?? []).includes("newtype")
    || (character?.specials ?? []).includes("newtype")
    || (character?.awakening ?? 0) >= 10;
}

function unitPilotIsNewtype(unit) {
  return isMobileSuit(unit) && characterIsNewtype(primaryCharacterFor(unit));
}

function canActivateExamSystem(unit) {
  return isMobileSuit(unit)
    && isAlive(unit)
    && unitHasSkill(unit, "examSystem")
    && !unit.examSystemActivated
    && !examSystemActive(unit);
}

function canActivateHadesSystem(unit) {
  return isMobileSuit(unit)
    && isAlive(unit)
    && unitHasSkill(unit, "hadesSystem")
    && !unit.hadesSystemActivated
    && !hadesSystemActive(unit);
}

function activateExamSystem(unit, reason = "条件達成") {
  if (!canActivateExamSystem(unit)) return false;
  unit.examSystemActivated = true;
  unit.examTurnsRemaining = 3;
  state.log.push(`${unitName(unit)}のEXAMシステム発動（${reason}）。命中・回避・攻撃力が上昇、3ターン後に自動撤退します。`);
  return true;
}

function activateHadesSystem(unit, reason = "条件達成") {
  if (!canActivateHadesSystem(unit)) return false;
  unit.hadesSystemActivated = true;
  unit.hadesTurnsRemaining = 3;
  state.log.push(`${unitName(unit)}のHADES発動（${reason}）。命中・回避・攻撃力が上昇、3ターン後に機体へ大きな負荷がかかります。`);
  return true;
}

function activateExamSystemByArmor(unit) {
  if (!isMobileSuit(unit) || !isAlive(unit) || unit.maxArmor <= 0) return false;
  if (unit.armor > Math.floor(unit.maxArmor / 3)) return false;
  return activateExamSystem(unit, "耐久低下");
}

function activateHadesSystemByArmor(unit) {
  if (!isMobileSuit(unit) || !isAlive(unit) || unit.maxArmor <= 0) return false;
  if (unit.armor > Math.floor(unit.maxArmor / 3)) return false;
  return activateHadesSystem(unit, "耐久低下");
}

function activateExamSystemByCombat(attacker, defender) {
  if (isMobileSuit(attacker) && unitPilotIsNewtype(defender)) activateExamSystem(attacker, "敵ニュータイプ反応");
  if (isMobileSuit(defender) && unitPilotIsNewtype(attacker)) activateExamSystem(defender, "敵ニュータイプ反応");
}

function overheatHadesSystemUnit(unit) {
  if (!isMobileSuit(unit) || !isAlive(unit)) return false;
  const armorLoss = Math.max(1, Math.ceil(unit.maxArmor * HADES_OVERHEAT_ARMOR_LOSS_RATE));
  const beforeArmor = unit.armor;
  unit.armor = Math.max(0, unit.armor - armorLoss);
  unit.energy = 0;
  unit.hadesTurnsRemaining = 0;
  unit.hadesSystemOverheated = true;
  state.log.push(`${unitName(unit)}がHADESの限界に達し、耐久${beforeArmor - unit.armor}低下、EN0。`);
  if (unit.armor === 0) {
    state.log.push(`${unitName(unit)}はHADESの負荷で戦闘不能。`);
    triggerSacrificialBoost(unit);
    checkOutcome();
  }
  return true;
}

function withdrawExamSystemUnit(unit) {
  if (!isMobileSuit(unit) || !isAlive(unit)) return false;
  unit.armor = 0;
  unit.acted = true;
  unit.moved = true;
  unit.examTurnsRemaining = 0;
  unit.examSystemWithdrawn = true;
  state.log.push(`${unitName(unit)}がEXAMシステムの限界に達し、自動撤退。撃破扱いになります。`);
  triggerSacrificialBoost(unit);
  checkOutcome();
  return true;
}

function withdrawMobileDiverUnit(unit) {
  if (!isMobileSuit(unit) || !isAlive(unit)) return false;
  unit.armor = 0;
  unit.acted = true;
  unit.moved = true;
  unit.mobileDiverTurnsRemaining = 0;
  unit.mobileDiverWithdrawn = true;
  state.log.push(`${unitName(unit)}が高度維持限界に達し、自動撤退。撃破扱いになります。`);
  triggerSacrificialBoost(unit);
  checkOutcome();
  return true;
}

function tickHadesSystem(unit) {
  if (!hadesSystemActive(unit)) {
    activateHadesSystemByArmor(unit);
    return;
  }
  unit.hadesTurnsRemaining -= 1;
  if (unit.hadesTurnsRemaining <= 0) overheatHadesSystemUnit(unit);
}

function tickExamSystem(unit) {
  if (unit.examAlwaysActive) {
    unit.examSystemActivated = true;
    unit.examTurnsRemaining = 1;
    return;
  }
  if (!examSystemActive(unit)) {
    activateExamSystemByArmor(unit);
    return;
  }
  unit.examTurnsRemaining -= 1;
  if (unit.examTurnsRemaining <= 0) withdrawExamSystemUnit(unit);
}

function tickMobileDiver(unit) {
  if (!isMobileSuit(unit) || !isAlive(unit) || !unitHasSkill(unit, "mobileDiver")) return;
  if (!Number.isFinite(unit.mobileDiverTurnsRemaining)) unit.mobileDiverTurnsRemaining = MOBILE_DIVER_TURNS;
  if (state.phase === "deployment") return;
  unit.mobileDiverTurnsRemaining -= 1;
  if (unit.mobileDiverTurnsRemaining <= 0) withdrawMobileDiverUnit(unit);
}

function activeVehicleOptions(unit) {
  if (!isMobileSuit(unit) || unit.vehicleOptionDisabled) return [];
  return unitOptions(unit).filter((option) => option.effectType === "vehicle");
}

function activeVehicleOption(unit) {
  return activeVehicleOptions(unit)[0] ?? null;
}

function vehicleWeaponIds(unit, options = unitOptions(unit)) {
  return new Set(options.flatMap((option) => option.weaponIds ?? []));
}

function pilotSupplyActive(unit) {
  if (!isMobileSuit(unit)) return false;
  const battleship = alliedBattleship(unit.side);
  return Boolean(battleship && isAdjacent(unit, battleship) && unitHasSkill(battleship, "pilotSupply"));
}

function internalAuditActive(unit) {
  if (!isMobileSuit(unit)) return false;
  return state.units.some((other) =>
    other.id !== unit.id
    && other.side === unit.side
    && isCombatUnit(other)
    && isAlive(other)
    && unitHasSkill(other, "internalAudit")
    && distance(other, unit) <= 2
  );
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

function applySupplyToUnit(unit, support) {
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

  return changes;
}

function frontlineSupplyFor(unit) {
  const maintenance = primaryCharacterFor(unit).maintenance ?? 0;
  return {
    armor: 12 + maintenance,
    shield: 6 + Math.floor(maintenance / 2),
    energy: 12 + Math.floor(maintenance / 2),
    ammo: Math.min(3, 1 + Math.floor(maintenance / 12))
  };
}

function durabilityRatio(unit) {
  return unit.maxArmor > 0 ? unit.armor / unit.maxArmor : 1;
}

function frontlineSupplyTargetFor(source) {
  return state.units
    .filter((unit) => unit.side === source.side && unit.id !== source.id && isCombatUnit(unit) && isMobileSuit(unit) && isAlive(unit) && isAdjacent(unit, source))
    .sort((a, b) => durabilityRatio(a) - durabilityRatio(b) || a.armor - b.armor || String(a.id).localeCompare(String(b.id)))[0] ?? null;
}

function unitWeaponObjects(unit, options = {}) {
  if (!isCombatUnit(unit) && !(options.allowDestroyed && (isMobileSuit(unit) || isBattleship(unit)))) return [];
  const disabledVehicleWeapons = unit.vehicleOptionDisabled ? vehicleWeaponIds(unit) : new Set();
  return [...new Set(unit.weaponIds
    .filter((id) => !disabledVehicleWeapons.has(id))
    .flatMap((id) => [id, ...(weaponFor(id).extraAttackIds ?? [])]))]
    .map((id) => weaponFor(id));
}

function attackWeapons(unit, options = {}) {
  return unitWeaponObjects(unit, options)
    .filter((weapon) => weaponCanAttack(weapon))
    .filter((weapon) => !(activeVehicleOption(unit)?.forbidsMelee && weapon.attackType === "melee"));
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
  const chargeText = weaponNeedsCharge(weapon) ? ` / チャージ${weaponChargeCount(unit, weapon)}/${weaponChargeRequired(weapon)}` : "";
  if (weapon.kind === "ammo") return `残弾 ${runtime.ammo} / ${runtime.maxAmmo ?? weapon.ammo}${awakeningText}`;
  if (weapon.kind === "beam") return `EN消費 ${weapon.consume}${chargeText}${awakeningText}`;
  if (weapon.kind === "special") return `EN消費 ${weapon.consume}${awakeningText}`;
  if (weapon.kind === "shield") return weaponCanAttack(weapon)
    ? `盾耐久 ${runtime.durability} / ${weapon.durability}（攻撃消費${shieldAttackCost(weapon)}）`
    : `盾耐久 ${runtime.durability} / ${weapon.durability}`;
  return `消費なし${awakeningText}`;
}

function applyBattleshipSupport(side) {
  const battleships = alliedBattleships(side);
  if (battleships.length === 0) return;
  const supportedUnits = state.units.filter((unit) =>
    unit.side === side
    && isCombatUnit(unit)
    && isMobileSuit(unit)
    && isAlive(unit)
    && battleships.some((battleship) => isAdjacent(unit, battleship))
  );
  supportedUnits.forEach((unit) => {
    const battleship = [...battleships]
      .filter((ship) => isAdjacent(unit, ship))
      .sort((a, b) => {
        const supportA = supportForBattleship(a);
        const supportB = supportForBattleship(b);
        return (supportB.armor + supportB.energy + supportB.ammo * 10 + supportB.shield)
          - (supportA.armor + supportA.energy + supportA.ammo * 10 + supportA.shield);
      })[0];
    const support = supportForBattleship(battleship);
    const changes = applySupplyToUnit(unit, support);

    if (changes.length > 0) {
      state.log.push(`${unitName(unit)}が${unitName(battleship)}から補給を受けた（${changes.join("、")}）。`);
    } else {
      state.log.push(`${unitName(unit)}は${unitName(battleship)}に隣接中。補給は満タンです。`);
    }
  });
}

function applyFrontlineSupply(side) {
  const sources = state.units.filter((unit) => unit.side === side && isCombatUnit(unit) && isMobileSuit(unit) && isAlive(unit) && unitHasSkill(unit, "frontlineSupply"));
  sources.forEach((source) => {
    const target = frontlineSupplyTargetFor(source);
    if (!target) return;
    const changes = applySupplyToUnit(target, frontlineSupplyFor(source));
    if (changes.length > 0) {
      state.log.push(`${unitName(target)}が${unitName(source)}の前線補給を受けた（${changes.join("、")}）。`);
    } else {
      state.log.push(`${unitName(source)}が${unitName(target)}へ前線補給を試みたが、補給は満タンです。`);
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

function applyZakuPassion(side) {
  const sources = state.units.filter((unit) => unit.side === side && isCombatUnit(unit) && isAlive(unit) && unitHasSkill(unit, "zakuPassion"));
  if (sources.length === 0) return;
  const targets = state.units.filter((unit) =>
    unit.side === side
    && isMobileSuit(unit)
    && isAlive(unit)
    && mobileSuitTags(msFor(unit)).includes("zaku")
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
    if (changes.length > 0) state.log.push(`${unitName(unit)}がザクへの情熱で整備を受けた（${changes.join("、")}）。`);
  });
}

function canPayCost(unit, weapon) {
  if (isMobileSuit(unit) && weapon.requiredAwakening && primaryCharacterFor(unit).awakening < weapon.requiredAwakening) return false;
  if (weaponNeedsCharge(weapon) && !weaponCharged(unit, weapon)) return false;
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
  if (weaponNeedsCharge(weapon) && weapon.chargeResetOnFire !== false) setWeaponCharge(unit, weapon, 0);
}

function weaponNeedsCharge(weapon) {
  return (weaponChargeRequired(weapon) > 0);
}

function weaponChargeRequired(weapon) {
  return Math.max(0, Number(weapon.chargeRequired) || 0);
}

function weaponChargeCost(weapon) {
  return Math.max(0, Number(weapon.chargeCost) || 0);
}

function weaponChargeCount(unit, weapon) {
  return Math.max(0, Number(unit.weaponCharges?.[weapon.id]) || 0);
}

function setWeaponCharge(unit, weapon, value) {
  if (!unit.weaponCharges) unit.weaponCharges = {};
  unit.weaponCharges[weapon.id] = clamp(Math.floor(value), 0, weaponChargeRequired(weapon));
}

function weaponCharged(unit, weapon) {
  if (limitedSystemActive(unit, "zeusSystem") && weaponHasSkill(weapon, "zeusChargeBypass")) return true;
  return weaponChargeCount(unit, weapon) >= weaponChargeRequired(weapon);
}

function canChargeWeapon(unit, weapon) {
  return isMobileSuit(unit)
    && weaponNeedsCharge(weapon)
    && !weaponCharged(unit, weapon)
    && !unit.acted
    && !unit.moved
    && (unit.usedWeaponIds?.length ?? 0) === 0
    && unit.energy >= weaponChargeCost(weapon);
}

function chargeWeapon(unit, weapon, renderAfter = true) {
  if (!canChargeWeapon(unit, weapon)) return false;
  const before = weaponChargeCount(unit, weapon);
  unit.energy -= weaponChargeCost(weapon);
  setWeaponCharge(unit, weapon, before + 1);
  unit.moved = true;
  unit.acted = true;
  revealStealth(unit, "チャージ");
  pushDialogue(unit, "wait");
  state.log.push(`${unitName(unit)}が${weapon.name}をチャージ（${weaponChargeCount(unit, weapon)}/${weaponChargeRequired(weapon)}）。`);
  if (renderAfter) renderBattle();
  return true;
}

function markWeaponUsed(unit, weapon) {
  if (!unit.usedWeaponIds) unit.usedWeaponIds = [];
  if (!unit.usedWeaponIds.includes(weapon.id)) unit.usedWeaponIds.push(weapon.id);
}

function characterMsCompatibility(unit) {
  if (!isMobileSuit(unit)) return null;
  const characterId = unit.characterIds?.[0];
  const unitMs = msFor(unit);
  const matches = (state.data.compatibility?.characterMs ?? [])
    .filter((item) => item.characterId === characterId && characterMsCompatibilityMatches(item, unitMs));
  return matches.find((item) => item.msId === unitMs.id)
    ?? matches.reduce((best, item) => !best || Number(item.evasionBonus) > Number(best.evasionBonus) ? item : best, null);
}

function characterMsBonus(unit) {
  const match = characterMsCompatibility(unit);
  return match?.evasionBonus ?? 0;
}

function aceSkillActive(unit) {
  return isMobileSuit(unit)
    && unitHasSkill(unit, "ace")
    && Boolean(characterMsCompatibility(unit));
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
  if (lineFormationActive(unit)) bonus += LINE_FORMATION_ACCURACY_BONUS;
  if (massProductionFormationActive(unit)) bonus += 4;
  if (massProductionModernizationActive(unit)) bonus += 6;
  if (unitHasSkill(unit, "educationalComputer")) bonus += Math.min(EDUCATIONAL_COMPUTER_ACCURACY_CAP, unit.learningStacks ?? 0);
  if (unitHasSkill(unit, "stationaryInterception") && !unit.moved) bonus += 8;
  if (unitHasSkill(unit, "highPerformanceSight") && weapon?.attackType === "shooting" && defender && distance(unit, defender) >= 4) bonus += 8;
  if (unitHasSkill(unit, "allyBackup") && hasAllyAhead(unit)) bonus += 6;
  if (pilotSupplyActive(unit)) bonus += 5;
  if (marineSpaceSupportActive(unit)) bonus += 5;
  if (aquaticCombatAdaptationActive(unit)) bonus += 6;
  if (spaceCombatAdaptationActive(unit)) bonus += 6;
  if (oldSoldierPrideActive(unit, defender)) bonus += 5;
  bonus += schemingAccuracyBonus(unit);
  if (unitHasSkill(unit, "mourningResolve") && alliedMobileSuitDestroyed(unit.side)) bonus += 5;
  if (examSystemActive(unit)) bonus += 18;
  if (hadesSystemActive(unit)) bonus += HADES_ACCURACY_BONUS;
  Object.values(LIMITED_SYSTEMS).forEach((config) => {
    if ((unit[config.turnsProp] ?? 0) > 0 && (!config.attackType || config.attackType === weapon?.attackType)) bonus += config.accuracyBonus ?? 0;
  });
  if (unitHasSkill(unit, "phantomSystem")) bonus += 10;
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
  if (unitHasSkill(unit, "educationalComputer")) bonus += Math.min(EDUCATIONAL_COMPUTER_EVASION_CAP, unit.learningStacks ?? 0);
  if (retreatSupportActive(unit)) bonus += 10;
  if (unitHasSkill(unit, "haroSupport")) bonus += HARO_EVASION_BONUS;
  if (trailFormationActive(unit)) bonus += TRAIL_FORMATION_EVASION_BONUS;
  if (pilotSupplyActive(unit)) bonus += 5;
  if (internalAuditActive(unit)) bonus += 4;
  if (marineSpaceSupportActive(unit)) bonus += 5;
  if (aquaticCombatAdaptationActive(unit)) bonus += 6;
  if (spaceCombatAdaptationActive(unit)) bonus += 6;
  if (massProductionModernizationActive(unit)) bonus += 5;
  if (unitHasSkill(unit, "mourningResolve") && alliedMobileSuitDestroyed(unit.side)) bonus -= 4;
  if (examSystemActive(unit)) bonus += 18;
  if (hadesSystemActive(unit)) bonus += HADES_EVASION_BONUS;
  Object.values(LIMITED_SYSTEMS).forEach((config) => {
    if ((unit[config.turnsProp] ?? 0) > 0) bonus += config.evasionBonus ?? 0;
  });
  if (unitHasSkill(unit, "phantomSystem")) bonus += 10;
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

function repeatAttackAccuracyPenalty(unit, attackOrdinal = (unit.usedWeaponIds?.length ?? 0) + 1) {
  if (!isMobileSuit(unit)) return 0;
  return Math.max(0, attackOrdinal - 2) * REPEAT_ATTACK_ACCURACY_PENALTY;
}

function minimumHitRate(unit, attackOrdinal = (unit.usedWeaponIds?.length ?? 0) + 1) {
  if (!isMobileSuit(unit)) return MIN_HIT_RATE;
  const repeatPenalty = Math.max(0, attackOrdinal - 2) * REPEAT_ATTACK_MIN_HIT_PENALTY;
  return Math.max(MIN_REPEAT_ATTACK_HIT_RATE, MIN_HIT_RATE - repeatPenalty);
}

function evasion(unit, options = {}) {
  if (isDefenseTarget(unit) || isDestructionTarget(unit) || isBarricade(unit)) return 0;
  if (isBattleship(unit)) return Math.max(0, battleshipFor(unit).agility + battleshipEvasionBonus(unit) + schemingEvasionBonus(unit) - suppressiveFireEvasionPenalty(unit));
  const ms = msFor(unit);
  const character = primaryCharacterFor(unit);
  const optionAgilityModifier = optionModifierTotal(unit.optionIds, "agilityModifier");
  return Math.max(0, ms.agility + optionAgilityModifier + character.reaction + Math.floor(character.awakening / 2) + characterMsBonus(unit) + skillEvasionBonus(unit) + schemingEvasionBonus(unit) - suppressiveFireEvasionPenalty(unit) - jinxEvasionPenalty(unit) - oldSoldierPrideEvasionPenalty(unit, options) - unitTerrainPenalty(unit).evasion);
}

function suppressiveFireWeaponEligible(weapon) {
  return weapon?.attackType === "shooting"
    && Number(weapon.power) > 0
    && Number(weapon.power) <= SUPPRESSIVE_FIRE_MAX_POWER;
}

function applySuppressiveFire(attacker, defender, weapon) {
  if (!isMobileSuit(attacker) || !isAlive(defender) || !unitHasSkill(attacker, "suppressiveFire") || !suppressiveFireWeaponEligible(weapon)) return false;
  if (suppressiveFireActive(defender)) return false;
  defender.suppressiveFireDebuff = {
    turnNumber: state.turnNumber,
    phase: state.phase
  };
  state.log.push(`${unitName(defender)}は牽制射撃を受け、このターン中は回避-${SUPPRESSIVE_FIRE_EVASION_PENALTY}。`);
  return true;
}

function hitRate(attacker, defender, weapon, options = {}) {
  const panicPenalty = unitHasSkill(attacker, "panic") ? 8 : 0;
  const innocentPenalty = isMobileSuit(defender) && unitHasSkill(defender, "innocentPresence") ? 4 : 0;
  const enemyIntelPenalty = enemyIntelAccuracyPenalty(attacker);
  const priorityTargetBonus = priorityTargetAccuracyBonus(attacker, defender);
  const precisionAttackBonus = isMobileSuit(attacker) && unitHasSkill(attacker, "precisionAttackControl") ? PRECISION_ATTACK_ACCURACY_BONUS : 0;
  const attackOrdinal = options.attackOrdinal ?? ((attacker.usedWeaponIds?.length ?? 0) + 1);
  const minHitRate = minimumHitRate(attacker, attackOrdinal);
  const defenderEvasion = evasion(defender, { incomingAttack: true });
  if (isBattleship(attacker)) {
    const raw = weapon.accuracy - BATTLESHIP_HIT_PENALTY + battleshipAimBonus(attacker) + schemingAccuracyBonus(attacker) + barrageSupportPenalty(defender, attacker) + priorityTargetBonus + precisionAttackBonus - panicPenalty - innocentPenalty - enemyIntelPenalty - defenderEvasion;
    return clamp(raw, minHitRate, MAX_HIT_RATE);
  }
  const character = primaryCharacterFor(attacker);
  const ability = weapon.attackType === "melee" ? character.melee : character.shooting;
  const repeatPenalty = repeatAttackAccuracyPenalty(attacker, attackOrdinal);
  const optionAccuracyModifier = optionModifierTotal(attacker.optionIds, "accuracyModifier");
  const raw = weapon.accuracy + ability + Math.floor(character.awakening / 2) + msWeaponBonus(attacker, weapon) + skillAccuracyBonus(attacker, defender, weapon) + oneHandBonus(attacker, weapon) + barrageSupportPenalty(defender, attacker) + priorityTargetBonus + precisionAttackBonus + optionAccuracyModifier + HIT_RATE_BONUS - panicPenalty - innocentPenalty - enemyIntelPenalty - repeatPenalty - defenderEvasion;
  return clamp(raw, minHitRate, MAX_HIT_RATE);
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

function advanceLearningComputer(unit) {
  if (!isMobileSuit(unit) || !unitHasSkill(unit, "educationalComputer")) return;
  const before = unit.learningStacks ?? 0;
  unit.learningStacks = Math.min(EDUCATIONAL_COMPUTER_ACCURACY_CAP, before + 1);
  if (unit.learningStacks > before) {
    const accuracyBonus = Math.min(EDUCATIONAL_COMPUTER_ACCURACY_CAP, unit.learningStacks);
    const evasionBonus = Math.min(EDUCATIONAL_COMPUTER_EVASION_CAP, unit.learningStacks);
    state.log.push(`${unitName(unit)}の教育型コンピューターがターン経過データを蓄積（命中+${accuracyBonus}、回避+${evasionBonus}）。`);
  }
}

function damageFor(attacker, defender, weapon, options = {}) {
  let damage = weapon.power + (isMobileSuit(attacker) ? optionModifierTotal(attacker.optionIds, "damageModifier") : 0);
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "precisionAttackControl")) damage += PRECISION_ATTACK_DAMAGE_BONUS;
  if (aceSkillActive(attacker)) damage += 10;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "aiSenshi") && alliedMobileSuitDestroyed(attacker.side)) damage += 15;
  if (isCombatUnit(attacker) && sacrificialBoostActive(attacker.side)) damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "outstandingTalent") && isFrontmostAlly(attacker)) damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "enhancedWarhead") && weapon.kind === "ammo") damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "highOutputGenerator") && weapon.kind === "beam") damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "precisionMeleeProgram") && weapon.attackType === "melee") damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "sandAmbush") && terrainAt(attacker.x, attacker.y) === "desert") damage += 12;
  if (isMobileSuit(defender) && unitIsFlying(defender) && weaponHasSkill(weapon, "antiAir")) damage += 18;
  if (terrainAt(defender.x, defender.y) === "desert" && (unitHasSkill(attacker, "antiDesert") || weaponHasSkill(weapon, "antiDesert"))) damage += 18;
  if (unitIsSubmerged(defender) && (unitHasSkill(attacker, "antiSubmarine") || weaponHasSkill(weapon, "antiSubmarine"))) damage += 20;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "teamwork") && hasTeamworkAlly(attacker)) damage += 8;
  if (lineFormationActive(attacker)) damage += LINE_FORMATION_DAMAGE_BONUS;
  if (isMobileSuit(attacker) && massProductionFormationActive(attacker)) damage += 8;
  if (isMobileSuit(attacker) && massProductionModernizationActive(attacker)) damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "madness") && repeatedTargetAttack(attacker, defender)) damage += 15;
  if (examSystemActive(attacker)) damage += 15;
  if (hadesSystemActive(attacker)) damage += HADES_DAMAGE_BONUS;
  Object.values(LIMITED_SYSTEMS).forEach((config) => {
    if ((attacker[config.turnsProp] ?? 0) > 0 && (!config.attackType || config.attackType === weapon.attackType)) damage += config.damageBonus ?? 0;
  });
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "phantomSystem")) damage += 8;
  if (rivalryActive(attacker, defender)) damage += 12;
  if (oldSoldierPrideActive(attacker, defender)) damage += 8;
  if (desperateRearGuardActive(attacker)) damage += 20;
  if (sideHasSkill(attacker.side, "forcedMarch")) damage += 10;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "guardedPersons")) damage -= 8;
  if (isMobileSuit(defender) && unitHasSkill(defender, "innocentPresence")) damage -= 5;
  if (sideHasSkill(attacker.side, "peaceWill")) damage -= 4;
  if (weapon.kind === "beam" && (attacker.beamDisruptedTurns ?? 0) > 0) damage -= 25;
  if (options.iFieldActive ?? canUseIField(defender, weapon)) damage = Math.floor(damage / 2);
  if (isMobileSuit(defender) && weapon.kind === "beam" && (unitHasSkill(defender, "antiBeamCoating") || shieldHasSkill(defender, "antiBeamCoating"))) damage -= 15;
  if (isMobileSuit(defender) && weapon.kind === "ammo" && unitHasSkill(defender, "optionArmor")) damage -= 15;
  if (weapon.kind === "ammo" && freezyYardActive(defender)) damage -= FREEZY_YARD_REDUCTION;
  if (isMobileSuit(defender) && weapon.attackType === "melee" && unitHasSkill(defender, "impactDiffusionArmor")) damage -= 15;
  if (isMobileSuit(defender) && unitHasSkill(defender, "aiSenshi") && alliedMobileSuitDestroyed(defender.side)) damage -= 10;
  if (trailFormationActive(defender)) damage -= TRAIL_FORMATION_DAMAGE_REDUCTION;
  if (isMobileSuit(defender) && massProductionFormationActive(defender)) damage -= 8;
  if (isMobileSuit(defender) && massProductionModernizationActive(defender)) damage -= 10;
  if (isMobileSuit(defender) && unitHasSkill(defender, "guardedPersons")) damage -= 10;
  if (desperateRearGuardActive(defender)) damage -= 15;
  if (peaceWillDefensiveActive(defender)) damage -= 8;
  if (sideHasSkill(defender.side, "forcedMarch")) damage += 12;
  if (guardMissionProtector(defender, attacker)) damage -= 10;
  return Math.max(10, damage);
}

function combatEffectNotes(attacker, defender, weapon, options = {}) {
  const notes = [];
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "precisionAttackControl")) notes.push("精密攻撃管制");
  if (isCombatUnit(attacker) && sacrificialBoostActive(attacker.side)) notes.push("命を賭して……");
  if (aceSkillActive(attacker)) notes.push("エース");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "outstandingTalent") && isFrontmostAlly(attacker)) notes.push("突出した才能");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "enhancedWarhead") && weapon.kind === "ammo") notes.push("強化弾頭");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "highOutputGenerator") && weapon.kind === "beam") notes.push("高出力ジェネレーター");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "precisionMeleeProgram") && weapon.attackType === "melee") notes.push("高精度格闘プログラム");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "highPerformanceSight") && weapon.attackType === "shooting" && distance(attacker, defender) >= 4) notes.push("高性能照準器");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "allyBackup") && hasAllyAhead(attacker)) notes.push("味方援護");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "sandAmbush") && terrainAt(attacker.x, attacker.y) === "desert") notes.push("砂塵の伏兵");
  if (aquaticCombatAdaptationActive(attacker)) notes.push("水中戦適応");
  if (spaceCombatAdaptationActive(attacker)) notes.push("空間戦適応");
  if (isMobileSuit(defender) && unitIsFlying(defender) && weaponHasSkill(weapon, "antiAir")) notes.push("対空中");
  if (terrainAt(defender.x, defender.y) === "desert" && (unitHasSkill(attacker, "antiDesert") || weaponHasSkill(weapon, "antiDesert"))) notes.push("対砂漠");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "teamwork") && hasTeamworkAlly(attacker)) notes.push("チームワーク攻撃");
  if (lineFormationActive(attacker)) notes.push("ライン・フォーメーション");
  if (priorityTargetAccuracyBonus(attacker, defender) > 0) notes.push("優先目標指示");
  if (isMobileSuit(attacker) && massProductionFormationActive(attacker)) notes.push("量産機編成攻撃");
  if (isMobileSuit(attacker) && massProductionModernizationActive(attacker)) notes.push("量産機近代化改修");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "madness") && repeatedTargetAttack(attacker, defender)) notes.push("狂気");
  if (examSystemActive(attacker)) notes.push("EXAMシステム");
  if (hadesSystemActive(attacker)) notes.push("HADES");
  Object.values(LIMITED_SYSTEMS).forEach((config) => {
    if ((attacker[config.turnsProp] ?? 0) > 0 && (!config.attackType || config.attackType === weapon.attackType)) notes.push(config.name);
  });
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "phantomSystem")) notes.push("ファントムシステム");
  if (schemingActive(attacker)) notes.push("策謀攻撃");
  if (rivalryActive(attacker, defender)) notes.push("対抗心");
  if (oldSoldierPrideActive(attacker, defender)) notes.push("老兵の意地");
  if (desperateRearGuardActive(attacker)) notes.push("決死の殿軍攻撃");
  if (sideHasSkill(attacker.side, "forcedMarch")) notes.push("強行軍攻撃");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "guardedPersons")) notes.push("要警護人物攻撃抑制");
  if (sideHasSkill(attacker.side, "peaceWill")) notes.push("講和の意志攻撃抑制");
  if (options.iFieldActive) notes.push("Iフィールド");
  if (unitIsSubmerged(defender) && (unitHasSkill(attacker, "antiSubmarine") || weaponHasSkill(weapon, "antiSubmarine"))) notes.push("対水中");
  if (weapon.kind === "ammo" && freezyYardActive(defender)) notes.push("フリージーヤード");
  if (trailFormationActive(defender)) notes.push("トレイル・フォーメーション");
  if (isMobileSuit(defender) && massProductionFormationActive(defender)) notes.push("量産機編成防御");
  if (isMobileSuit(defender) && massProductionModernizationActive(defender)) notes.push("量産機近代化改修防御");
  if (aquaticCombatAdaptationActive(defender)) notes.push("水中戦適応防御");
  if (spaceCombatAdaptationActive(defender)) notes.push("空間戦適応防御");
  if (schemingActive(defender)) notes.push("策謀防御");
  if (isMobileSuit(defender) && unitHasSkill(defender, "innocentPresence")) notes.push("無垢な存在");
  if (isMobileSuit(defender) && unitHasSkill(defender, "oldSoldierPride")) notes.push("老兵の意地:回避低下");
  if (isMobileSuit(defender) && unitHasSkill(defender, "guardedPersons")) notes.push("要警護人物防御");
  if (desperateRearGuardActive(defender)) notes.push("決死の殿軍防御");
  if (peaceWillDefensiveActive(defender)) notes.push("講和の意志防御");
  if (sideHasSkill(defender.side, "forcedMarch")) notes.push("強行軍被害");
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

function useSmokeSkill(unit, renderAfter = true) {
  if (!isMobileSuit(unit) || !unitHasSkill(unit, "smokeDischarger") || unit.acted || unit.moved || unit.smokeSkillUsed) return false;
  revealStealth(unit, "煙幕展開");
  unit.smokeSkillUsed = true;
  unit.moved = true;
  unit.smokeConcealedTurns = 2;
  unit.infiltrationExposed = false;
  unit.activeConcealmentGrace = true;
  unit.acted = true;
  pushDialogue(unit, "wait");
  state.log.push(`${unitName(unit)}がスモークディスチャージャーを展開。射撃対象から外れやすくなった。`);
  if (renderAfter) renderBattle();
  return true;
}

function canUseActiveCamo(unit, weapon) {
  return isMobileSuit(unit)
    && weaponHasSkill(weapon, "activeCamo")
    && !unit.acted
    && !unit.moved
    && !weaponUsed(unit, weapon.id)
    && canPayCost(unit, weapon);
}

function useActiveCamo(unit, weapon, renderAfter = true) {
  if (!canUseActiveCamo(unit, weapon)) return false;
  payCost(unit, weapon);
  markWeaponUsed(unit, weapon);
  unit.temporarySkills = (unit.temporarySkills ?? []).filter((skillId) => skillId !== "stealth");
  addTemporarySkill(unit, "stealth");
  unit.stealthRevealed = false;
  unit.infiltrationExposed = false;
  unit.activeConcealmentGrace = true;
  unit.moved = true;
  unit.acted = true;
  pushDialogue(unit, "wait");
  state.log.push(`${unitName(unit)}が${weapon.name}を起動し、ステルス状態へ移行。`);
  if (renderAfter) renderBattle();
  return true;
}

function canDesignatePriorityTarget(unit, target) {
  if (state.outcome || !isCombatUnit(unit) || !unitHasSkill(unit, "priorityTargetDesignation")) return false;
  if ((unit.side === "player" && state.phase !== "player") || (unit.side === "enemy" && state.phase !== "enemy")) return false;
  if (unit.acted || unit.moved || unit.priorityTargetDesignationUsed) return false;
  if (!isCombatUnit(target) || target.side === unit.side || !isAlive(target)) return false;
  if (unitDetailsConcealedFromSide(target, unit.side)) return false;
  return distance(unit, target) <= priorityTargetDesignationRange(unit);
}

function designatePriorityTarget(unit, target, renderAfter = true) {
  if (!canDesignatePriorityTarget(unit, target)) return false;
  unit.priorityTargetId = target.id;
  unit.priorityTargetDesignationUsed = true;
  unit.moved = true;
  state.selectedTargetId = target.id;
  state.log.push(`${unitName(unit)}が${unitName(target)}を優先目標に指定。味方全体の命中+${PRIORITY_TARGET_ACCURACY_BONUS}。`);
  if (renderAfter) renderBattle();
  return true;
}

function emergencyRepairAmount(unit) {
  if (!isCombatUnit(unit)) return 0;
  const missingArmor = Math.max(0, unit.maxArmor - unit.armor);
  const maintenanceAmount = EMERGENCY_REPAIR_BASE + emergencyRepairMaintenance(unit) * EMERGENCY_REPAIR_MAINTENANCE_MULTIPLIER;
  const armorCap = Math.floor(unit.maxArmor * EMERGENCY_REPAIR_MAX_ARMOR_RATIO);
  return Math.max(0, Math.min(missingArmor, maintenanceAmount, armorCap));
}

function canUseEmergencyRepair(unit) {
  return isCombatUnit(unit)
    && isAlive(unit)
    && unitHasSkill(unit, "emergencyRepair")
    && !unit.emergencyRepairUsed
    && !unit.acted
    && (unit.usedWeaponIds?.length ?? 0) === 0
    && emergencyRepairAmount(unit) > 0;
}

function useEmergencyRepair(unit, renderAfter = true) {
  if (!canUseEmergencyRepair(unit)) return false;
  const amount = emergencyRepairAmount(unit);
  unit.armor = Math.min(unit.maxArmor, unit.armor + amount);
  unit.emergencyRepairUsed = true;
  unit.acted = true;
  unit.moved = true;
  pushDialogue(unit, "wait");
  state.log.push(`${unitName(unit)}が緊急修理を実施。装甲を${amount}回復。`);
  if (renderAfter) renderBattle();
  return true;
}

function clearPriorityTargetDesignations(side) {
  state.units.filter((unit) => unit.side === side).forEach((unit) => {
    unit.priorityTargetId = null;
    unit.priorityTargetDesignationUsed = false;
  });
}

function barricadeCellFor(unit) {
  if (!isMobileSuit(unit)) return null;
  return { x: unit.x, y: unit.y + (unit.side === "player" ? -1 : 1) };
}

function canDeployBarricade(unit) {
  if (!isMobileSuit(unit) || !isAlive(unit) || !unitHasSkill(unit, "barricadePlacement")) return false;
  if (unit.acted || unit.moved || unit.barricadeUsed) return false;
  const cell = barricadeCellFor(unit);
  return Boolean(cell && inBounds(cell.x, cell.y) && terrainWalkableAt(cell.x, cell.y) && !occupiedAt(cell.x, cell.y));
}

function deployBarricade(unit, renderAfter = true) {
  if (!canDeployBarricade(unit)) return false;
  const cell = barricadeCellFor(unit);
  state.units.push({
    id: `barricade-${unit.side}-${makeId()}`,
    type: "barricade",
    side: unit.side,
    faction: unitFaction(unit),
    name: "バリケード",
    armor: BARRICADE_ARMOR,
    maxArmor: BARRICADE_ARMOR,
    mobility: 0,
    x: cell.x,
    y: cell.y,
    sourceUnitId: unit.id
  });
  unit.barricadeUsed = true;
  unit.moved = true;
  unit.acted = true;
  revealStealth(unit, "バリケード設置");
  pushDialogue(unit, "wait");
  state.selectedTargetId = null;
  state.log.push(`${unitName(unit)}が前方に耐久${BARRICADE_ARMOR}のバリケードを設置。`);
  if (renderAfter) renderBattle();
  return true;
}

function hasConcealmentState(unit) {
  return (unitHasSkill(unit, "stealth") && !unit.stealthRevealed)
    || (unitHasSkill(unit, "guerrillaTactics") && GUERRILLA_TERRAINS.has(terrainAt(unit.x, unit.y)))
    || (unit.smokeConcealedTurns ?? 0) > 0;
}

function concealedEnemiesInSonarRange(source) {
  return state.units
    .filter((unit) =>
      unit.side !== source.side
      && isMobileSuit(unit)
      && isAlive(unit)
      && hasConcealmentState(unit)
      && !unit.infiltrationExposed
      && distance(source, unit) <= undergroundSonarRange(source)
    )
    .sort((a, b) => distance(source, a) - distance(source, b) || String(a.id).localeCompare(b.id));
}

function applyUndergroundSonar(side) {
  state.units
    .filter((unit) => unit.side === side && isMobileSuit(unit) && isAlive(unit) && unitHasSkill(unit, "undergroundSonar") && !unit.moved)
    .forEach((unit) => {
      const targets = concealedEnemiesInSonarRange(unit);
      if (targets.length === 0) return;
      targets.forEach((target) => {
        target.activeConcealmentGrace = false;
        target.infiltrationExposed = true;
        target.stealthRevealed = true;
        target.smokeConcealedTurns = 0;
      });
      state.log.push(`${unitName(unit)}のアンダーグラウンドソナーが範囲内の隠密${targets.length}機を看破。`);
    });
}

function scatterMines(attacker, target, weapon) {
  if (!weapon.mineScatterOnAttack) return;
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
  if (!isMobileSuit(unit) || unit.disableCoreSystem || unit.coreSystemUsed || !msFor(unit).specials.includes("coreSystem")) return false;
  const escapeMs = lookup().ms[msFor(unit).escapeMsId ?? "coreFighter"];
  return Boolean(escapeMs) && unitCanRemainAirborne(unit, escapeMs);
}

function additionalArmorTargetMs(unit) {
  if (!isMobileSuit(unit)) return null;
  const sourceMs = msFor(unit);
  return lookup().ms[sourceMs.purgeMsId ?? sourceMs.escapeMsId] ?? null;
}

function canPurgeAdditionalArmor(unit) {
  if (!isMobileSuit(unit) || unit.additionalArmorPurged || !unitHasSkill(unit, "additionalArmor")) return false;
  const targetMs = additionalArmorTargetMs(unit);
  if (!targetMs || targetMs.id === msFor(unit).id) return false;
  if (!cardUsableByFaction(targetMs, unit.faction)) return false;
  if (!cardCanStandAt(targetMs, unit.x, unit.y)) return false;
  if (!unitCanRemainAirborne(unit, targetMs)) return false;
  return true;
}

function canUseEscapeShip(unit) {
  if (!isBattleship(unit) || unit.escapeShipUsed || !battleshipFor(unit).escapeShipId) return false;
  const escapeShip = lookup().battleships[battleshipFor(unit).escapeShipId];
  return Boolean(escapeShip) && unitCanRemainAirborne(unit, escapeShip);
}

function transformToCoreFighter(unit) {
  const beforeName = unitName(unit);
  const sourceMs = msFor(unit);
  const coreFighter = lookup().ms[sourceMs.escapeMsId ?? "coreFighter"];
  unit.coreSystemUsed = true;
  unit.msId = coreFighter.id;
  unit.faction = coreFighter.faction;
  unit.weaponIds = [...coreFighter.fixedWeaponIds, ...(sourceMs.escapeWeaponIds ?? [])];
  unit.runtimeWeapons = runtimeWeaponsForIds(unit.weaponIds);
  unit.maxArmor = optionAdjustedValue(coreFighter.armor, unit.optionIds, "armorModifier", 1);
  unit.maxEnergy = optionAdjustedValue(coreFighter.energy, unit.optionIds, "energyModifier", 0);
  unit.armor = unit.maxArmor;
  unit.energy = unit.maxEnergy;
  unit.usedWeaponIds = [];
  state.log.push(`${beforeName}の脱出機構作動。${coreFighter.name}で戦闘続行。`);
}

function purgeAdditionalArmor(unit, reason = "任意パージ", renderAfter = true) {
  if (!canPurgeAdditionalArmor(unit)) return false;
  const beforeName = unitName(unit);
  const targetMs = additionalArmorTargetMs(unit);
  const optionIds = unit.optionIds ?? [];
  const optionEnergyBonus = optionIds.includes("externalGenerator") ? 25 : 0;
  const weaponIds = [...new Set([
    ...(targetMs.fixedWeaponIds ?? []),
    ...carriedWeaponIdsForTransform(unit),
    ...optionWeaponIdsForUnit(unit)
  ])];

  unit.additionalArmorPurged = true;
  unit.msId = targetMs.id;
  unit.faction = targetMs.faction;
  unit.weaponIds = weaponIds;
  unit.runtimeWeapons = runtimeWeaponsAfterTransform(unit, weaponIds);
  unit.maxArmor = optionAdjustedValue(targetMs.armor, optionIds, "armorModifier", 1);
  unit.maxEnergy = optionAdjustedValue(targetMs.energy + optionEnergyBonus, optionIds, "energyModifier", 0);
  unit.armor = unit.maxArmor;
  unit.energy = unit.maxEnergy;
  unit.usedWeaponIds = [];
  unit.weaponCharges = {};
  state.log.push(reason === "破壊" ? `${beforeName}の増加装甲が破壊された。${targetMs.name}で戦闘続行。` : `${beforeName}が増加装甲をパージ。${targetMs.name}で戦闘続行。`);
  if (renderAfter) renderBattle();
  return true;
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

function canUseAinasPocketWatch(unit) {
  if (!isMobileSuit(unit) || unit.ainasPocketWatchUsed || !unitHasSkill(unit, "ainasPocketWatch")) return false;
  return !["coreSystem", "additionalArmor"].some((skillId) => (msFor(unit).specials ?? []).includes(skillId));
}

function activateAinasPocketWatch(unit) {
  if (!canUseAinasPocketWatch(unit) || unit.armor !== 0) return false;
  unit.ainasPocketWatchUsed = true;
  unit.armor = 1;
  state.log.push(`${unitName(unit)}はアイナの懐中時計を支えに、装甲1で踏みとどまった。`);
  return true;
}

function lastShootingWeapon(unit, target) {
  if (!isMobileSuit(unit) || !isAlive(target)) return null;
  return attackWeapons(unit, { allowDestroyed: true })
    .filter((weapon) => canPayCost(unit, weapon) && weaponInRange(unit, target, weapon))
    .map((weapon) => ({
      weapon,
      expectedDamage: damageFor(unit, target, weapon) * hitRate(unit, target, weapon, { attackOrdinal: 1 }) / 100
    }))
    .sort((a, b) => b.expectedDamage - a.expectedDamage || b.weapon.power - a.weapon.power || b.weapon.accuracy - a.weapon.accuracy)[0]?.weapon ?? null;
}

function resolveLastShooting(unit, target) {
  if (!isMobileSuit(unit) || unit.armor !== 0 || unit.lastShootingUsed || !unitHasSkill(unit, "lastShooting") || !isAlive(target)) return false;
  const weapon = lastShootingWeapon(unit, target);
  if (!weapon) return false;

  unit.lastShootingUsed = true;
  payCost(unit, weapon);
  markWeaponUsed(unit, weapon);
  revealStealth(unit, "ラストシューティング");
  const hit = hitRate(unit, target, weapon, { attackOrdinal: 1 });
  const roll = Math.floor(Math.random() * 100) + 1;
  state.log.push(`${unitName(unit)}のラストシューティング。${weapon.name}で${unitName(target)}へ反撃。`);
  if (roll > hit) {
    state.log.push(`命中${hit}%、出目${roll}で回避された。`);
  } else {
    const iFieldActive = activateIField(target, weapon);
    const damage = damageFor(unit, target, weapon, { iFieldActive });
    const effectNotes = combatEffectNotes(unit, target, weapon, { iFieldActive });
    applyDamage(target, damage);
    applySuppressiveFire(unit, target, weapon);
    state.log.push(`${weapon.name}が命中。${unitName(target)}に${damage}ダメージ。`);
    if (effectNotes.length > 0) state.log.push(`発動: ${effectNotes.join(" / ")}`);
    if (!isAlive(target)) state.log.push(`${unitName(target)}を撃破。`);
  }
  scatterMines(unit, target, weapon);
  applyBeamDisruption(unit, target, weapon);
  recordAttackTarget(unit, target);
  return true;
}

function attack(attacker, defender, weapon, renderAfter = true) {
  if (state.outcome) return;
  if ((attacker.side === "player" && state.phase !== "player") || (attacker.side === "enemy" && state.phase !== "enemy")) return;
  if (!isCombatUnit(attacker) || !isAlive(attacker) || attacker.acted || !isAttackTarget(defender) || !isAlive(defender) || !weapon || weaponUsed(attacker, weapon.id)) return;
  if (!weaponInRange(attacker, defender, weapon) || !canPayCost(attacker, weapon)) return;

  activateExamSystemByCombat(attacker, defender);
  const attackerName = unitName(attacker);
  const defenderName = unitName(defender);
  const attackOrdinal = (attacker.usedWeaponIds?.length ?? 0) + 1;
  payCost(attacker, weapon);
  markWeaponUsed(attacker, weapon);
  const hit = hitRate(attacker, defender, weapon, { attackOrdinal });
  const repeatPenalty = repeatAttackAccuracyPenalty(attacker, attackOrdinal);
  const roll = Math.floor(Math.random() * 100) + 1;
  let defenderDestroyedByThisAttack = false;
  revealStealth(attacker, "攻撃");

  if (roll > hit) {
    pushDialogue(attacker, "miss");
    state.log.push(`${attackerName}の${weapon.name}。命中${hit}%${repeatPenalty ? `（連続攻撃-${repeatPenalty}）` : ""}、出目${roll}で回避された。`);
    pushDialogue(defender, "evade");
  } else {
    pushDialogue(attacker, "hit");
    const iFieldActive = activateIField(defender, weapon);
    const damage = damageFor(attacker, defender, weapon, { iFieldActive });
    const effectNotes = combatEffectNotes(attacker, defender, weapon, { iFieldActive });
    applyDamage(defender, damage);
    applySuppressiveFire(attacker, defender, weapon);
    state.log.push(`${attackerName}の${weapon.name}が命中${repeatPenalty ? `（連続攻撃-${repeatPenalty}）` : ""}。${defenderName}に${damage}ダメージ。`);
    if (effectNotes.length > 0) state.log.push(`発動: ${effectNotes.join(" / ")}`);
    if (isAlive(defender)) pushDialogue(defender, "damaged");
    if (!isAlive(defender)) {
      defenderDestroyedByThisAttack = true;
      state.log.push(`${defenderName}を撃破。`);
      if (isDestructionTarget(defender) && stageRandomDestructionTargetGoal() !== null) {
        defender.objectiveRevealed = true;
        state.log.push(defender.isRealObjective
          ? `${defenderName}は重要物資を積んでいた。実目標を破壊した。`
          : `${defenderName}は空のダミーだった。`);
      }
    }
  }

  if (defenderDestroyedByThisAttack) resolveLastShooting(defender, attacker);
  scatterMines(attacker, defender, weapon);
  applyBeamDisruption(attacker, defender, weapon);
  recordAttackTarget(attacker, defender);
  checkOutcome();
  attacker.acted = unitHasSkill(attacker, "precisionAttackControl") || allAttackWeaponsUsed(attacker);
  attacker.moved = true;
  if (limitedSystemActive(attacker, "areusSystem") && weapon.attackType === "melee" && isAlive(attacker)) {
    attacker.moved = false;
    state.log.push(`${attackerName}はAREUSにより追加移動可能。`);
  }
  if (!isAlive(defender)) state.selectedTargetId = null;
  if (renderAfter) renderBattle();
}

function applyDamage(unit, amount) {
  const vehicleOption = activeVehicleOption(unit);
  const airMapSfs = selectedMap().type === "air" && optionProvidesAirDeployment(vehicleOption);
  if (amount > 0 && isMobileSuit(unit) && vehicleOption && !unit.vehicleOptionDisabled && !airMapSfs) {
    unit.vehicleOptionDisabled = true;
    state.log.push(`${unitName(unit)}の${vehicleOption.name ?? "乗り物"}が損傷し、効果を失った。`);
  }
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
  if (unit.armor === 0 && canPurgeAdditionalArmor(unit)) purgeAdditionalArmor(unit, "破壊", false);
  if (unit.armor === 0 && canUseCoreSystem(unit)) transformToCoreFighter(unit);
  if (unit.armor === 0) activateAinasPocketWatch(unit);
  activateExamSystemByArmor(unit);
  activateHadesSystemByArmor(unit);
  activateLimitedSystemsByArmor(unit);
  if (unit.armor === 0) triggerSacrificialBoost(unit);
}

function discardVehicleOption(unit, renderAfter = true) {
  const vehicleOption = activeVehicleOption(unit);
  if (!isMobileSuit(unit) || !vehicleOption || unit.vehicleOptionDisabled) return false;
  if (selectedMap().type === "air" && optionProvidesAirDeployment(vehicleOption) && !mobileSuitNativelyAirborne(msFor(unit))) return false;
  unit.vehicleOptionDisabled = true;
  state.log.push(`${unitName(unit)}が${vehicleOption.name ?? "乗り物"}を切り離した。`);
  if (renderAfter) renderBattle();
  return true;
}

function transformTargetIds(unit) {
  if (!isMobileSuit(unit)) return [];
  const ms = msFor(unit);
  return [...new Set([
    ...(Array.isArray(ms.transformMsIds) ? ms.transformMsIds : []),
    ms.transformMsId
  ].filter((id) => id && id !== ms.id))];
}

function transformTargetMobileSuits(unit) {
  const { ms } = lookup();
  return transformTargetIds(unit).map((id) => ms[id]).filter(Boolean);
}

function canTransformToMs(unit, targetMsId) {
  if (!isMobileSuit(unit) || !unitHasSkill(unit, "transform")) return false;
  if (unit.acted || unit.moved || (unit.usedWeaponIds?.length ?? 0) > 0) return false;
  const targetMs = lookup().ms[targetMsId];
  if (!targetMs || targetMs.id === msFor(unit).id) return false;
  if (!transformTargetIds(unit).includes(targetMs.id)) return false;
  if (!cardUsableByFaction(targetMs, unit.faction)) return false;
  if (!cardCanStandAt(targetMs, unit.x, unit.y)) return false;
  if (!unitCanRemainAirborne(unit, targetMs)) return false;
  return true;
}

function carriedWeaponIdsForTransform(unit) {
  const sourceMs = msFor(unit);
  const fixedWeaponIds = new Set(sourceMs.fixedWeaponIds ?? []);
  const optionWeaponIds = new Set((unit.optionIds ?? []).flatMap((id) => lookup().options[id]?.weaponIds ?? []));
  return (unit.weaponIds ?? []).filter((id) => !fixedWeaponIds.has(id) && !optionWeaponIds.has(id));
}

function optionWeaponIdsForUnit(unit) {
  return (unit.optionIds ?? []).flatMap((id) => lookup().options[id]?.weaponIds ?? []);
}

function runtimeWeaponsAfterTransform(unit, weaponIds) {
  const previous = Object.fromEntries((unit.runtimeWeapons ?? []).map((runtime) => [runtime.id, runtime]));
  return runtimeWeaponsForIds(weaponIds, unit.optionIds ?? []).map((runtime) => previous[runtime.id] ? { ...runtime, ...previous[runtime.id] } : runtime);
}

function transformMobileSuit(unit, targetMsId, renderAfter = true) {
  if (!canTransformToMs(unit, targetMsId)) return false;
  const beforeName = unitName(unit);
  const beforeMaxEnergy = Math.max(1, unit.maxEnergy || 1);
  const carriedArmor = Math.max(1, unit.armor);
  const energyRate = clamp(unit.energy / beforeMaxEnergy, 0, 1);
  const targetMs = lookup().ms[targetMsId];
  const optionIds = unit.optionIds ?? [];
  const optionEnergyBonus = optionIds.includes("externalGenerator") ? 25 : 0;
  const weaponIds = [...new Set([
    ...(targetMs.fixedWeaponIds ?? []),
    ...carriedWeaponIdsForTransform(unit),
    ...optionWeaponIdsForUnit(unit)
  ])];

  unit.msId = targetMs.id;
  unit.faction = targetMs.faction;
  unit.weaponIds = weaponIds;
  unit.runtimeWeapons = runtimeWeaponsAfterTransform(unit, weaponIds);
  unit.maxArmor = optionAdjustedValue(targetMs.armor, optionIds, "armorModifier", 1);
  unit.maxEnergy = optionAdjustedValue(targetMs.energy + optionEnergyBonus, optionIds, "energyModifier", 0);
  unit.armor = Math.min(unit.maxArmor, carriedArmor);
  unit.energy = Math.min(unit.maxEnergy, Math.ceil(unit.maxEnergy * energyRate));
  unit.usedWeaponIds = [];
  unit.weaponCharges = {};
  unit.moved = true;
  unit.acted = true;
  revealStealth(unit, "変形");
  pushDialogue(unit, "wait");
  state.log.push(`${beforeName}が${targetMs.name}へ変形。`);
  if (renderAfter) renderBattle();
  return true;
}

function addTemporarySkill(unit, skillId) {
  if (!unit.temporarySkills) unit.temporarySkills = [];
  if (!unit.temporarySkills.includes(skillId)) unit.temporarySkills.push(skillId);
}

function firstMobileSuitForSide(side, predicate = () => true) {
  return state.units.find((unit) => unit.side === side && isMobileSuit(unit) && isAlive(unit) && predicate(unit));
}

function applyInfiltrationIntel(side) {
  if (!sideHasSkill(side, "infiltrationIntel")) return;
  const target = state.units
    .filter((unit) => unit.side === opposingBattleSide(side) && isMobileSuit(unit) && isAlive(unit) && hasConcealmentState(unit))
    .sort((a, b) => combatUnitTotalCost(b) - combatUnitTotalCost(a) || String(a.id).localeCompare(String(b.id)))[0] ?? null;
  if (!target) return;
  target.activeConcealmentGrace = false;
  target.infiltrationExposed = true;
  state.log.push(`${unitName(target)}の隠密情報が漏洩し、現在の隠密状態が看破された。`);
}

function applySpyConduct(side) {
  if (!sideHasSkill(side, "spyConduct")) return;
  const target = firstMobileSuitForSide(opposingBattleSide(side), (unit) => !unitHasSkill(unit, "stealth"));
  if (!target) return;
  addTemporarySkill(target, "stealth");
  state.log.push(`スパイ行為により、敵側の${unitName(target)}が初期ステルス状態になった。`);
}

function applyCommanderStealth(side) {
  const source = state.units.find((unit) => unit.side === side && isCombatUnit(unit) && isAlive(unit) && unitHasSkill(unit, "commanderStealth"));
  if (!source) return;
  const target = isMobileSuit(source) ? source : firstMobileSuitForSide(side);
  if (!target) return;
  addTemporarySkill(target, "stealth");
  state.log.push(`${unitName(target)}が現地協力者の誘導で初期ステルス状態になった。`);
}

function applyPreBattleSkillEffects() {
  for (const side of ["player", "enemy"]) {
    applySpyConduct(side);
    applyCommanderStealth(side);
  }
  for (const side of ["player", "enemy"]) applyInfiltrationIntel(side);
  state.units
    .filter((unit) => isMobileSuit(unit) && unitHasSkill(unit, "mobileDiver"))
    .forEach((unit) => {
      unit.mobileDiverTurnsRemaining = MOBILE_DIVER_TURNS;
    });
}

const SATURN_ENGINE_DANGER_MOVE_DISTANCE = 4;

function movedDistance(from, to) {
  return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
}

function resetSaturnEngineIfNoLongMove(unit) {
  if (!isMobileSuit(unit) || !unitHasSkill(unit, "saturnEngineIncomplete")) return;
  if (!unit.saturnEngineLongMoveThisTurn) unit.saturnEngineLongMoveStreak = 0;
  unit.saturnEngineLongMoveThisTurn = false;
}

function resolveSaturnEngineAfterMove(unit, moveDistance) {
  if (!isMobileSuit(unit) || !isAlive(unit) || !unitHasSkill(unit, "saturnEngineIncomplete")) return false;
  if (moveDistance < SATURN_ENGINE_DANGER_MOVE_DISTANCE) {
    unit.saturnEngineLongMoveStreak = 0;
    unit.saturnEngineLongMoveThisTurn = false;
    return false;
  }

  unit.saturnEngineLongMoveThisTurn = true;
  unit.saturnEngineLongMoveStreak = (unit.saturnEngineLongMoveStreak ?? 0) + 1;
  if (unit.saturnEngineLongMoveStreak < 2) {
    state.log.push(`${unitName(unit)}の土星エンジンが危険回転域に入った。`);
    return false;
  }

  unit.armor = 0;
  unit.acted = true;
  unit.moved = true;
  unit.saturnEngineLongMoveStreak = 0;
  unit.saturnEngineLongMoveThisTurn = false;
  state.log.push(`${unitName(unit)}の土星エンジンが暴走し、自爆。流れ星となった。`);
  triggerSacrificialBoost(unit);
  checkOutcome();
  return true;
}

function moveUnit(unit, x, y) {
  if (state.outcome) return;
  if (!isMovableUnit(unit) || state.phase !== "player" || unit.side !== "player" || unit.moved) return;
  if (!canMoveTo(unit, x, y)) return;
  const from = { x: unit.x, y: unit.y };
  unit.x = x;
  unit.y = y;
  unit.moved = true;
  if (isCombatUnit(unit)) revealStealth(unit, "移動");
  triggerMines(unit);
  if (!isAlive(unit) || state.outcome) {
    renderBattle();
    return;
  }
  if (resolveSaturnEngineAfterMove(unit, movedDistance(from, unit))) {
    renderBattle();
    return;
  }
  state.log.push(`${unitName(unit)}が移動。`);
  checkOutcome();
  renderBattle();
}

function endPlayerTurn() {
  if (state.outcome) return;
  if (state.phase !== "player") return;
  applyUndergroundSonar("player");
  applyFrontlineSupply("player");
  applyBattleshipSupport("player");
  applyGundamPassion("player");
  applyZakuPassion("player");
  clearPriorityTargetDesignations("player");
  state.units.filter((unit) => unit.side === "player" && isCombatUnit(unit)).forEach((unit) => {
    resetSaturnEngineIfNoLongMove(unit);
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
  state.enemyQueue = enemyTurnQueue();
  state.log.push("敵軍ターン開始。敵行動を進めるボタンで1手ずつ処理します。");
  renderBattle();
}

function enemyTurnQueue() {
  return state.units
    .filter((unit) => unit.side === "enemy" && isCombatUnit(unit))
    .sort((a, b) => {
      const priorityDesignationOrder = Number(!unitHasSkill(a, "priorityTargetDesignation")) - Number(!unitHasSkill(b, "priorityTargetDesignation"));
      return priorityDesignationOrder || Number(isBattleship(a)) - Number(isBattleship(b));
    })
    .map((unit) => unit.id);
}

function effectiveDurability(unit) {
  return unit.armor + (activeShield(unit)?.durability ?? 0);
}

function unitHealthRatio(unit) {
  return unit.maxArmor > 0 ? unit.armor / unit.maxArmor : 1;
}

function targetPriority(unit) {
  if (isBarricade(unit)) return 25 + Math.round((1 - unitHealthRatio(unit)) * 20);
  if (isDefenseTarget(unit)) return 220 + Math.round((1 - unitHealthRatio(unit)) * 80);
  const woundedBonus = Math.round((1 - unitHealthRatio(unit)) * 45);
  return woundedBonus + (isBattleship(unit) ? AI_BATTLESHIP_TARGET_BONUS : 0);
}

function attackPlanScore(attacker, target, weapon) {
  const hit = hitRate(attacker, target, weapon);
  const damage = damageFor(attacker, target, weapon);
  const expectedDamage = damage * hit / 100;
  const canDestroy = damage >= effectiveDurability(target);
  const range = distance(attacker, target);
  const minRange = weaponMinRange(weapon);
  const maxRange = weaponMaxRange(attacker, weapon);
  const preferredRange = weapon.attackType === "melee"
    ? minRange
    : maxRange >= 4 ? maxRange : Math.ceil((minRange + maxRange) / 2);
  const rangeComfort = 12 - Math.abs(preferredRange - range) * 6;
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

function enemySupportNeed(unit) {
  if (!isMobileSuit(unit)) return { level: 0, reason: "" };
  const healthRatio = unitHealthRatio(unit);
  const energyRatio = unit.maxEnergy > 0 ? unit.energy / unit.maxEnergy : 1;
  const weapons = attackWeapons(unit);
  const resourceWeapons = weapons.filter((weapon) => ["ammo", "beam", "special"].includes(weapon.kind));
  const ammoRuntimes = unit.runtimeWeapons.filter((runtime) => weaponFor(runtime.id).kind === "ammo");
  const remainingAmmo = ammoRuntimes.reduce((sum, runtime) => sum + runtime.ammo, 0);
  const maximumAmmo = ammoRuntimes.reduce((sum, runtime) => sum + (runtime.maxAmmo ?? weaponFor(runtime.id).ammo ?? 0), 0);
  const ammoRatio = maximumAmmo > 0 ? remainingAmmo / maximumAmmo : 1;
  const energyDependent = resourceWeapons.some((weapon) => ["beam", "special"].includes(weapon.kind));
  const resourceDepleted = weapons.length > 0 && weapons.every((weapon) => {
    const runtime = runtimeWeapon(unit, weapon.id);
    if (weapon.kind === "beam" || weapon.kind === "special") return unit.energy < weapon.consume;
    if (weapon.kind === "ammo") return (runtime?.ammo ?? 0) < weapon.consume;
    if (weapon.kind === "shield") return (runtime?.durability ?? 0) < shieldAttackCost(weapon);
    return false;
  });
  const lowEnergy = energyDependent && energyRatio <= 0.25;
  const lowAmmo = maximumAmmo > 0 && ammoRatio <= 0.25;
  const critical = healthRatio <= 0.3 || resourceDepleted || (healthRatio <= 0.45 && (lowEnergy || lowAmmo));
  const moderate = critical || healthRatio <= 0.55 || lowEnergy || lowAmmo;
  const reason = healthRatio <= 0.3
    ? "損傷大"
    : resourceDepleted ? "攻撃資源枯渇"
      : lowEnergy ? "EN低下"
        : lowAmmo ? "弾薬低下" : healthRatio <= 0.55 ? "損傷" : "";
  return { level: critical ? 2 : moderate ? 1 : 0, reason };
}

function enemyNeedsSupport(unit) {
  return enemySupportNeed(unit).level > 0;
}

function supportPositionScore(unit) {
  const need = enemySupportNeed(unit);
  if (need.level === 0) return 0;
  const ship = nearestAlliedBattleship(unit);
  if (!ship) return 0;
  const dist = distance(unit, ship);
  const base = need.level === 2 ? 2400 : 760;
  return Math.max(0, base - Math.max(0, dist - 1) * (need.level === 2 ? 180 : 95));
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

function shouldEnemyUseEmergencyRepair(unit, attackPlan) {
  if (!canUseEmergencyRepair(unit)) return false;
  const armorRatio = unit.maxArmor > 0 ? unit.armor / unit.maxArmor : 1;
  if (armorRatio <= 0.4) return true;
  return armorRatio <= 0.55 && (!attackPlan || attackPlan.score < 430);
}

function shouldEnemyUseActiveConcealment(unit, targets, attackPlan) {
  if (!isMobileSuit(unit) || unit.acted || unit.moved) return false;
  if (attackPlan?.score >= 430) return false;
  const incomingRisk = incomingAttackRiskScore(unit, targets);
  return unitHealthRatio(unit) <= 0.55
    || incomingRisk >= Math.max(30, effectiveDurability(unit) * 0.22);
}

function enemyActiveCamoWeapon(unit) {
  return unitWeaponObjects(unit).find((weapon) => canUseActiveCamo(unit, weapon)) ?? null;
}

function shouldEnemyWaitForSonar(unit, attackPlan) {
  if (!isMobileSuit(unit) || unit.acted || unit.moved || !unitHasSkill(unit, "undergroundSonar")) return false;
  if (attackPlan?.score >= 430) return false;
  return concealedEnemiesInSonarRange(unit).length > 0;
}

function shouldEnemyDeployBarricade(unit, targets, attackPlan) {
  if (!canDeployBarricade(unit) || attackPlan?.score >= 430) return false;
  const forwardDirection = unit.side === "player" ? -1 : 1;
  return targets.some((target) =>
    !isBarricade(target)
    && (target.y - unit.y) * forwardDirection > 0
    && Math.abs(target.x - unit.x) <= 1
    && distance(unit, target) <= 5
  );
}

function bestEnemyPriorityTarget(unit, targets, attackPlan) {
  const candidates = targets.filter((target) => canDesignatePriorityTarget(unit, target));
  if (candidates.length === 0) return null;
  if (attackPlan?.target && candidates.includes(attackPlan.target)) return attackPlan.target;
  return candidates.sort((a, b) => targetPriority(b) - targetPriority(a) || effectiveDurability(a) - effectiveDurability(b))[0];
}

function enemyMineScatterWeapon(unit, targets, attackPlan) {
  if (attackPlan || targets.length === 0) return null;
  const nearest = [...targets].sort((a, b) => distance(unit, a) - distance(unit, b))[0];
  if (distance(unit, nearest) > 3) return null;
  return unitWeaponObjects(unit).find((weapon) => canUseMineScatter(unit, weapon)) ?? null;
}

function infiltrationTargetDistance(unit) {
  if (unit.side !== "enemy" || !isMobileSuit(unit)) return null;
  const targets = stageInfiltrationTargets();
  if (targets.length === 0) return null;
  return Math.min(...targets.map((target) => Math.abs(unit.x - target.x) + Math.abs(unit.y - target.y)));
}

function infiltrationObjectiveScore(unit) {
  const targetDistance = infiltrationTargetDistance(unit);
  return targetDistance === null ? 0 : 1600 - targetDistance * 260;
}

function nearestDistance(unit, targets) {
  return targets.length > 0 ? Math.min(...targets.map((target) => distance(unit, target))) : null;
}

function enemyGuardObjectiveScore(unit, opponents) {
  if (!isMobileSuit(unit)) return 0;
  const guardTargets = state.units.filter((target) => target.side === "enemy" && isDestructionTarget(target) && isAlive(target));
  if (guardTargets.length === 0) return 0;
  const guardDistance = nearestDistance(unit, guardTargets);
  const threatened = guardTargets.some((target) => (nearestDistance(target, opponents) ?? 99) <= 6);
  return Math.max(0, 520 - guardDistance * 70) + (threatened ? 220 : 0);
}

function enemyDelayObjectiveScore(unit, opponents) {
  if (stageTurnLimit() === null || stageSurvivalTurnLimit() !== null || stageInfiltrationTargets().length > 0) return 0;
  if (state.units.some((target) => target.side === "enemy" && isDestructionTarget(target) && isAlive(target))) return 0;
  const opponentDistance = nearestDistance(unit, opponents);
  return opponentDistance === null ? 0 : Math.min(300, opponentDistance * 32);
}

function enemySurvivalPressureScore(unit, opponents) {
  if (stageSurvivalTurnLimit() === null) return 0;
  const opponentDistance = nearestDistance(unit, opponents);
  return opponentDistance === null ? 0 : Math.max(0, 360 - opponentDistance * 48);
}

function battleshipSupportPositionScore(unit) {
  if (!isBattleship(unit)) return 0;
  const supportTargets = state.units.filter((ally) =>
    ally.side === unit.side && isMobileSuit(ally) && isAlive(ally) && enemyNeedsSupport(ally)
  );
  if (supportTargets.length === 0) return 0;
  const supportDistance = nearestDistance(unit, supportTargets);
  if (supportDistance === 1) return 1400;
  return Math.max(0, 420 - supportDistance * 55);
}

function battleshipPreservationScore(unit, opponents) {
  if (!isBattleship(unit)) return 0;
  const opponentDistance = nearestDistance(unit, opponents);
  if (opponentDistance === null) return 0;
  const damagedBonus = unitHealthRatio(unit) <= 0.5 ? 2 : 1;
  return Math.min(520, opponentDistance * 38 * damagedBonus);
}

function enemyObjectiveScore(unit, opponents) {
  return infiltrationObjectiveScore(unit)
    + enemyGuardObjectiveScore(unit, opponents)
    + enemyDelayObjectiveScore(unit, opponents)
    + enemySurvivalPressureScore(unit, opponents)
    + battleshipSupportPositionScore(unit)
    + battleshipPreservationScore(unit, opponents);
}

function incomingAttackRiskScore(unit, opponents) {
  const risks = opponents.map((opponent) => {
    const plans = attackWeaponsForTarget(opponent, unit).map((weapon) =>
      damageFor(opponent, unit, weapon) * hitRate(opponent, unit, weapon) / 100
    );
    return plans.length > 0 ? Math.max(...plans) : 0;
  }).sort((a, b) => b - a);
  return (risks[0] ?? 0) + (risks[1] ?? 0) * 0.6;
}

function targetBlocksInfiltration(target) {
  return stageInfiltrationTargets().some((cell) => cell.x === target.x && cell.y === target.y);
}

function enemyMoveCandidates(unit) {
  return [
    { x: unit.x, y: unit.y, current: true },
    ...[...reachableCells(unit)].map((key) => ({ ...parsePositionKey(key), current: false }))
  ];
}

function formationPositionScore(unit) {
  if (!isMobileSuit(unit) || !isAlive(unit)) return 0;
  return (trailFormationActive(unit) ? FORMATION_AI_POSITION_SCORE : 0)
    + (lineFormationActive(unit) ? FORMATION_AI_POSITION_SCORE : 0);
}

function bestEnemyMove(unit, targets, attackTargets = targets) {
  let best = null;
  enemyMoveCandidates(unit).forEach((cell) => {
    if (!cell.current && occupiedAt(cell.x, cell.y, unit.id)) return;
    const result = withUnitPosition(unit, cell.x, cell.y, () => {
      const futureAttack = bestAttackPlan(unit, attackTargets);
      const supportScore = supportPositionScore(unit);
      const approachScore = nearestTargetApproachScore(unit, targets);
      const objectiveScore = enemyObjectiveScore(unit, targets);
      const riskScore = incomingAttackRiskScore(unit, targets);
      const formationScore = formationPositionScore(unit);
      const score = (futureAttack ? AI_ATTACK_POSITION_BONUS + futureAttack.score : approachScore)
        + supportScore
        + objectiveScore
        + formationScore
        - riskScore;
      return { futureAttack, supportScore, objectiveScore, riskScore, formationScore, score };
    });
    if (!best || result.score > best.score) best = { ...cell, ...result };
  });
  if (!best || best.current) return null;
  if (best.supportScore >= 760) best.reason = "補給位置へ移動";
  else if (best.futureAttack) best.reason = "攻撃位置へ移動";
  else if (best.objectiveScore > 0) best.reason = "作戦目標に合わせて移動";
  else if (best.formationScore > 0) best.reason = "陣形を形成";
  else best.reason = "接近";
  return best;
}

function bestEnemySupportMove(unit) {
  const ships = alliedBattleships(unit.side);
  if (ships.length === 0) return null;
  const currentDistance = Math.min(...ships.map((ship) => distance(unit, ship)));
  let best = null;
  enemyMoveCandidates(unit).forEach((cell) => {
    if (cell.current || occupiedAt(cell.x, cell.y, unit.id)) return;
    const supportDistance = Math.min(...ships.map((ship) => Math.abs(cell.x - ship.x) + Math.abs(cell.y - ship.y)));
    if (supportDistance >= currentDistance) return;
    const riskScore = withUnitPosition(unit, cell.x, cell.y, () => incomingAttackRiskScore(
      unit,
      state.units.filter((target) => target.side !== unit.side && isAttackTarget(target))
    ));
    if (!best || supportDistance < best.supportDistance || (supportDistance === best.supportDistance && riskScore < best.riskScore)) {
      best = { ...cell, supportDistance, riskScore, reason: "補給のため後退" };
    }
  });
  return best;
}

function shouldPrioritizeEnemySupport(unit, attackPlan) {
  if (unit.moved || (unit.usedWeaponIds?.length ?? 0) > 0) return false;
  const need = enemySupportNeed(unit);
  if (need.level === 0 || !nearestAlliedBattleship(unit)) return false;
  if (need.level === 2) return true;
  return !attackPlan || attackPlan.score < 430;
}

function waitForEnemySupport(unit) {
  const ship = nearestAlliedBattleship(unit);
  if (!ship || !isAdjacent(unit, ship)) return false;
  const need = enemySupportNeed(unit);
  unit.acted = true;
  unit.moved = true;
  state.log.push(`${unitName(unit)}は${need.reason || "補給"}のため${unitName(ship)}に隣接して補給修理を待つ。`);
  return true;
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

    if (Number.isFinite(enemy.aiInactiveUntilTurn) && state.turnNumber < enemy.aiInactiveUntilTurn) {
      enemy.acted = true;
      enemy.moved = true;
      state.enemyQueue.shift();
      state.log.push(`${unitName(enemy)}は起動待機中。第${enemy.aiInactiveUntilTurn}ターンから行動します。`);
      renderBattle();
      return;
    }

    const targets = state.units.filter((unit) => unit.side === "player" && isAttackTarget(unit));
    if (targets.length === 0) {
      checkOutcome();
      renderBattle();
      return;
    }

    const infiltrationMission = infiltrationTargetDistance(enemy) !== null;
    const blockingTargets = infiltrationMission ? targets.filter((target) => targetBlocksInfiltration(target)) : [];
    const attackTargets = blockingTargets.length > 0 ? blockingTargets : (infiltrationMission ? [] : targets);
    let attackPlan = bestAttackPlan(enemy, attackTargets);

    if (shouldEnemyUseEmergencyRepair(enemy, attackPlan)) {
      state.selectedUnitId = enemy.id;
      state.selectedTargetId = null;
      useEmergencyRepair(enemy, false);
      state.enemyQueue.shift();
      renderBattle();
      return;
    }

    if (shouldPrioritizeEnemySupport(enemy, attackPlan)) {
      if (waitForEnemySupport(enemy)) {
        state.enemyQueue.shift();
        renderBattle();
        return;
      }
      const supportMove = bestEnemySupportMove(enemy);
      if (supportMove) {
        state.selectedUnitId = enemy.id;
        state.selectedTargetId = null;
        moveEnemyUnit(enemy, supportMove);
        enemy.acted = true;
        state.enemyQueue.shift();
        renderBattle();
        return;
      }
    }

    if (shouldEnemyActivateFreezyYard(enemy, targets, attackPlan)) {
      state.selectedUnitId = enemy.id;
      state.selectedTargetId = null;
      activateFreezyYard(enemy, false);
      state.enemyQueue.shift();
      renderBattle();
      return;
    }

    if (shouldEnemyUseActiveConcealment(enemy, targets, attackPlan) && unitHasSkill(enemy, "smokeDischarger") && !enemy.smokeSkillUsed) {
      state.selectedUnitId = enemy.id;
      state.selectedTargetId = null;
      useSmokeSkill(enemy, false);
      state.enemyQueue.shift();
      renderBattle();
      return;
    }

    const activeCamoWeapon = shouldEnemyUseActiveConcealment(enemy, targets, attackPlan) ? enemyActiveCamoWeapon(enemy) : null;
    if (activeCamoWeapon) {
      state.selectedUnitId = enemy.id;
      state.selectedTargetId = null;
      useActiveCamo(enemy, activeCamoWeapon, false);
      state.enemyQueue.shift();
      renderBattle();
      return;
    }

    if (shouldEnemyWaitForSonar(enemy, attackPlan)) {
      enemy.acted = true;
      state.enemyQueue.shift();
      pushDialogue(enemy, "wait");
      state.log.push(`${unitName(enemy)}はアンダーグラウンドソナーによる索敵を優先して待機。`);
      renderBattle();
      return;
    }

    const priorityTarget = bestEnemyPriorityTarget(enemy, attackTargets, attackPlan);
    if (priorityTarget) {
      state.selectedUnitId = enemy.id;
      state.selectedTargetId = priorityTarget.id;
      designatePriorityTarget(enemy, priorityTarget, false);
      attackPlan = bestAttackPlan(enemy, attackTargets);
    }

    if (shouldEnemyDeployBarricade(enemy, targets, attackPlan)) {
      state.selectedUnitId = enemy.id;
      state.selectedTargetId = null;
      deployBarricade(enemy, false);
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

    if (!enemy.moved) {
      const movePlan = bestEnemyMove(enemy, targets, attackTargets);
      if (!movePlan && attackPlan) {
        state.selectedUnitId = enemy.id;
        state.selectedTargetId = attackPlan.target.id;
        attack(enemy, attackPlan.target, attackPlan.weapon, false);
        if (enemy.acted || !isAlive(enemy) || state.outcome) state.enemyQueue.shift();
        renderBattle();
        return;
      }
      state.selectedUnitId = enemy.id;
      state.selectedTargetId = movePlan?.futureAttack?.target.id ?? [...targets].sort((a, b) => distance(enemy, a) - distance(enemy, b))[0]?.id ?? null;
      const moved = moveEnemyUnit(enemy, movePlan);
      if (!moved) {
        enemy.acted = true;
        state.enemyQueue.shift();
        pushDialogue(enemy, "wait");
        state.log.push(`${unitName(enemy)}は移動できず待機。`);
      } else if (movePlan.futureAttack && isAttackTarget(movePlan.futureAttack.target) && weaponInRange(enemy, movePlan.futureAttack.target, movePlan.futureAttack.weapon) && canPayCost(enemy, movePlan.futureAttack.weapon)) {
        attack(enemy, movePlan.futureAttack.target, movePlan.futureAttack.weapon, false);
        if (enemy.acted || !isAlive(enemy) || state.outcome) state.enemyQueue.shift();
      } else {
        enemy.acted = true;
        state.enemyQueue.shift();
      }
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
  applyUndergroundSonar("enemy");
  applyFrontlineSupply("enemy");
  applyBattleshipSupport("enemy");
  applyGundamPassion("enemy");
  applyZakuPassion("enemy");
  clearPriorityTargetDesignations("enemy");
  state.units.filter((unit) => unit.side === "enemy" && isCombatUnit(unit)).forEach((unit) => {
    resetSaturnEngineIfNoLongMove(unit);
    unit.acted = false;
    unit.moved = false;
    unit.usedWeaponIds = [];
    if ((unit.beamDisruptedTurns ?? 0) > 0) unit.beamDisruptedTurns -= 1;
    if ((unit.smokeConcealedTurns ?? 0) > 0) unit.smokeConcealedTurns -= 1;
  });
  tickTurnStartEffects("player");
  state.turnNumber += 1;
  state.phase = "player";
  state.enemyQueue = [];
  state.selectedUnitId = state.units.find((unit) => unit.side === "player" && isCombatUnit(unit))?.id ?? null;
  state.selectedTargetId = null;
  spawnStageEnemyReinforcementsForTurn();
  state.log.push("自軍ターン開始。");
  checkOutcome();
  renderBattle();
}

function moveEnemyUnit(unit, movePlan) {
  if (!movePlan) return false;
  const from = { x: unit.x, y: unit.y };
  unit.x = movePlan.x;
  unit.y = movePlan.y;
  unit.moved = true;
  revealStealth(unit, "移動");
  triggerMines(unit);
  if (!isAlive(unit) || state.outcome) return true;
  checkOutcome();
  if (state.outcome) return true;
  if (resolveSaturnEngineAfterMove(unit, movedDistance(from, unit))) return true;
  pushDialogue(unit, "move");
  state.log.push(`${unitName(unit)}が${movePlan.reason}。`);
  return true;
}

