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
  if (isDefenseTarget(unit)) return unit.name ?? "防衛対象";
  if (isBattleship(unit)) return battleshipFor(unit).name;
  return msFor(unit).name;
}

function unitFaction(unit) {
  if (isDefenseTarget(unit)) return unit.faction ?? "federation";
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
  if (isDefenseTarget(unit)) return Math.max(0, Number(unit.mobility) || 0);
  if (isBattleship(unit)) return battleshipFor(unit).mobility;
  const optionBonus = unitOptions(unit)
    .filter((option) => option.effectType === "mobility")
    .reduce((total, option) => total + (option.value ?? 1), 0);
  const vehicleBonus = activeVehicleOptions(unit).reduce((total, option) => total + (option.value ?? 0), 0);
  const stopMovementPenalty = hinderedByStopMovement(unit) ? 1 : 0;
  const retreatBonus = retreatMobilitySupportActive(unit) ? 1 : 0;
  return Math.max(1, msFor(unit).mobility + optionBonus + vehicleBonus + retreatBonus - unitTerrainPenalty(unit).mobility - stopMovementPenalty);
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

function sideHasSkill(side, skillId) {
  return state.units.some((unit) => unit.side === side && isCombatUnit(unit) && isAlive(unit) && unitHasSkill(unit, skillId));
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

function anyLimitedSystemActive(unit) {
  return Object.keys(LIMITED_SYSTEMS).some((skillId) => limitedSystemActive(unit, skillId));
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

function unitWeaponObjects(unit) {
  const disabledVehicleWeapons = unit.vehicleOptionDisabled ? vehicleWeaponIds(unit) : new Set();
  return [...new Set(unit.weaponIds
    .filter((id) => !disabledVehicleWeapons.has(id))
    .flatMap((id) => [id, ...(weaponFor(id).extraAttackIds ?? [])]))]
    .map((id) => weaponFor(id));
}

function attackWeapons(unit) {
  return unitWeaponObjects(unit)
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
  const battleship = alliedBattleship(side);
  if (!battleship) return;
  const support = supportForBattleship(battleship);

  const supportedUnits = state.units.filter((unit) => unit.side === side && isCombatUnit(unit) && isMobileSuit(unit) && isAdjacent(unit, battleship));
  supportedUnits.forEach((unit) => {
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
  return (state.data.compatibility?.characterMs ?? []).find((item) => item.characterId === characterId && characterMsCompatibilityMatches(item, unitMs));
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
  if (massProductionFormationActive(unit)) bonus += 4;
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
  if (pilotSupplyActive(unit)) bonus += 5;
  if (internalAuditActive(unit)) bonus += 4;
  if (marineSpaceSupportActive(unit)) bonus += 5;
  if (aquaticCombatAdaptationActive(unit)) bonus += 6;
  if (spaceCombatAdaptationActive(unit)) bonus += 6;
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
  if (isDefenseTarget(unit)) return 0;
  if (isBattleship(unit)) return battleshipFor(unit).agility + battleshipEvasionBonus(unit) + schemingEvasionBonus(unit);
  const ms = msFor(unit);
  const character = primaryCharacterFor(unit);
  return Math.max(0, ms.agility + character.reaction + Math.floor(character.awakening / 2) + characterMsBonus(unit) + skillEvasionBonus(unit) + schemingEvasionBonus(unit) - jinxEvasionPenalty(unit) - oldSoldierPrideEvasionPenalty(unit, options) - unitTerrainPenalty(unit).evasion);
}

function hitRate(attacker, defender, weapon, options = {}) {
  const panicPenalty = unitHasSkill(attacker, "panic") ? 8 : 0;
  const innocentPenalty = isMobileSuit(defender) && unitHasSkill(defender, "innocentPresence") ? 4 : 0;
  const enemyIntelPenalty = enemyIntelAccuracyPenalty(attacker);
  const attackOrdinal = options.attackOrdinal ?? ((attacker.usedWeaponIds?.length ?? 0) + 1);
  const minHitRate = minimumHitRate(attacker, attackOrdinal);
  const defenderEvasion = evasion(defender, { incomingAttack: true });
  if (isBattleship(attacker)) {
    const raw = weapon.accuracy - BATTLESHIP_HIT_PENALTY + battleshipAimBonus(attacker) + schemingAccuracyBonus(attacker) + barrageSupportPenalty(defender, attacker) - panicPenalty - innocentPenalty - enemyIntelPenalty - defenderEvasion;
    return clamp(raw, minHitRate, MAX_HIT_RATE);
  }
  const character = primaryCharacterFor(attacker);
  const ability = weapon.attackType === "melee" ? character.melee : character.shooting;
  const repeatPenalty = repeatAttackAccuracyPenalty(attacker, attackOrdinal);
  const raw = weapon.accuracy + ability + Math.floor(character.awakening / 2) + msWeaponBonus(attacker, weapon) + skillAccuracyBonus(attacker, defender, weapon) + oneHandBonus(attacker, weapon) + barrageSupportPenalty(defender, attacker) + HIT_RATE_BONUS - panicPenalty - innocentPenalty - enemyIntelPenalty - repeatPenalty - defenderEvasion;
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
  let damage = weapon.power;
  if (aceSkillActive(attacker)) damage += 10;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "aiSenshi") && alliedMobileSuitDestroyed(attacker.side)) damage += 15;
  if (isCombatUnit(attacker) && sacrificialBoostActive(attacker.side)) damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "outstandingTalent") && isFrontmostAlly(attacker)) damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "enhancedWarhead") && weapon.kind === "ammo") damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "highOutputGenerator") && weapon.kind === "beam") damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "precisionMeleeProgram") && weapon.attackType === "melee") damage += 12;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "sandAmbush") && terrainAt(attacker.x, attacker.y) === "desert") damage += 12;
  if (isMobileSuit(defender) && msFor(defender).movementType === "flying" && weaponHasSkill(weapon, "antiAir")) damage += 18;
  if (terrainAt(defender.x, defender.y) === "desert" && (unitHasSkill(attacker, "antiDesert") || weaponHasSkill(weapon, "antiDesert"))) damage += 18;
  if (unitIsSubmerged(defender) && (unitHasSkill(attacker, "antiSubmarine") || weaponHasSkill(weapon, "antiSubmarine"))) damage += 20;
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "teamwork") && hasTeamworkAlly(attacker)) damage += 8;
  if (isMobileSuit(attacker) && massProductionFormationActive(attacker)) damage += 8;
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
  if (isMobileSuit(defender) && massProductionFormationActive(defender)) damage -= 8;
  if (isMobileSuit(defender) && unitHasSkill(defender, "guardedPersons")) damage -= 10;
  if (desperateRearGuardActive(defender)) damage -= 15;
  if (peaceWillDefensiveActive(defender)) damage -= 8;
  if (sideHasSkill(defender.side, "forcedMarch")) damage += 12;
  if (guardMissionProtector(defender, attacker)) damage -= 10;
  return Math.max(10, damage);
}

function combatEffectNotes(attacker, defender, weapon, options = {}) {
  const notes = [];
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
  if (isMobileSuit(defender) && msFor(defender).movementType === "flying" && weaponHasSkill(weapon, "antiAir")) notes.push("対空中");
  if (terrainAt(defender.x, defender.y) === "desert" && (unitHasSkill(attacker, "antiDesert") || weaponHasSkill(weapon, "antiDesert"))) notes.push("対砂漠");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "teamwork") && hasTeamworkAlly(attacker)) notes.push("チームワーク攻撃");
  if (isMobileSuit(attacker) && massProductionFormationActive(attacker)) notes.push("量産機編成攻撃");
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
  if (isMobileSuit(defender) && massProductionFormationActive(defender)) notes.push("量産機編成防御");
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
  unit.moved = true;
  unit.acted = true;
  pushDialogue(unit, "wait");
  state.log.push(`${unitName(unit)}が${weapon.name}を起動し、ステルス状態へ移行。`);
  if (renderAfter) renderBattle();
  return true;
}

function nearestConcealedEnemyFor(source) {
  return state.units
    .filter((unit) =>
      unit.side !== source.side
      && isMobileSuit(unit)
      && isAlive(unit)
      && (
        unitHasSkill(unit, "stealth")
        || unitHasSkill(unit, "guerrillaTactics")
        || (unit.smokeConcealedTurns ?? 0) > 0
      )
      && !unit.infiltrationExposed
    )
    .sort((a, b) => distance(source, a) - distance(source, b) || String(a.id).localeCompare(b.id))[0] ?? null;
}

function applyUndergroundSonar(side) {
  state.units
    .filter((unit) => unit.side === side && isMobileSuit(unit) && isAlive(unit) && unitHasSkill(unit, "undergroundSonar") && !unit.moved)
    .forEach((unit) => {
      const target = nearestConcealedEnemyFor(unit);
      if (!target) return;
      target.infiltrationExposed = true;
      target.stealthRevealed = true;
      target.smokeConcealedTurns = 0;
      state.log.push(`${unitName(unit)}のアンダーグラウンドソナーが${unitName(target)}の隠密を看破。`);
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
  if (!isMobileSuit(unit) || unit.coreSystemUsed || !msFor(unit).specials.includes("coreSystem")) return false;
  return Boolean(lookup().ms[msFor(unit).escapeMsId ?? "coreFighter"]);
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
  return true;
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
  unit.faction = coreFighter.faction;
  unit.weaponIds = [...coreFighter.fixedWeaponIds, ...(sourceMs.escapeWeaponIds ?? [])];
  unit.runtimeWeapons = runtimeWeaponsForIds(unit.weaponIds);
  unit.armor = coreFighter.armor;
  unit.maxArmor = coreFighter.armor;
  unit.energy = coreFighter.energy;
  unit.maxEnergy = coreFighter.energy;
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
  unit.maxArmor = targetMs.armor;
  unit.maxEnergy = targetMs.energy + optionEnergyBonus;
  unit.armor = targetMs.armor;
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

function attack(attacker, defender, weapon, renderAfter = true) {
  if (state.outcome) return;
  if ((attacker.side === "player" && state.phase !== "player") || (attacker.side === "enemy" && state.phase !== "enemy")) return;
  if (!isCombatUnit(attacker) || !isAttackTarget(defender) || !weapon || weaponUsed(attacker, weapon.id)) return;
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
    state.log.push(`${attackerName}の${weapon.name}が命中${repeatPenalty ? `（連続攻撃-${repeatPenalty}）` : ""}。${defenderName}に${damage}ダメージ。`);
    if (effectNotes.length > 0) state.log.push(`発動: ${effectNotes.join(" / ")}`);
    if (isAlive(defender)) pushDialogue(defender, "damaged");
    if (!isAlive(defender)) state.log.push(`${defenderName}を撃破。`);
  }

  scatterMines(attacker, defender, weapon);
  applyBeamDisruption(attacker, defender, weapon);
  recordAttackTarget(attacker, defender);
  checkOutcome();
  attacker.acted = allAttackWeaponsUsed(attacker);
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
  if (amount > 0 && isMobileSuit(unit) && vehicleOption && !unit.vehicleOptionDisabled) {
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
  activateExamSystemByArmor(unit);
  activateHadesSystemByArmor(unit);
  activateLimitedSystemsByArmor(unit);
  if (unit.armor === 0) triggerSacrificialBoost(unit);
}

function discardVehicleOption(unit, renderAfter = true) {
  const vehicleOption = activeVehicleOption(unit);
  if (!isMobileSuit(unit) || !vehicleOption || unit.vehicleOptionDisabled) return false;
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
  unit.maxArmor = targetMs.armor;
  unit.maxEnergy = targetMs.energy + optionEnergyBonus;
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
  const target = firstMobileSuitForSide(otherFaction(side), (unit) =>
    unitHasSkill(unit, "stealth")
    || unitHasSkill(unit, "guerrillaTactics")
    || (unit.smokeConcealedTurns ?? 0) > 0
  );
  if (!target) return;
  target.infiltrationExposed = true;
  state.log.push(`${unitName(target)}の隠密情報が漏洩。隠密系効果がこの戦闘中無効化された。`);
}

function applySpyConduct(side) {
  if (!sideHasSkill(side, "spyConduct")) return;
  const target = firstMobileSuitForSide(otherFaction(side), (unit) => !unitHasSkill(unit, "stealth"));
  if (!target) return;
  addTemporarySkill(target, "stealth");
  state.log.push(`スパイ行為により、敵側の${unitName(target)}が初期ステルス状態になった。`);
}

function applyCommanderStealth(side) {
  if (!sideHasSkill(side, "commanderStealth")) return;
  const target = firstMobileSuitForSide(side);
  if (!target) return;
  addTemporarySkill(target, "stealth");
  state.log.push(`${unitName(target)}が現地協力者の誘導で初期ステルス状態になった。`);
}

function applyPreBattleSkillEffects() {
  for (const side of ["player", "enemy"]) {
    applyInfiltrationIntel(side);
    applySpyConduct(side);
    applyCommanderStealth(side);
  }
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
  return unitWeaponObjects(unit).find((weapon) => canUseMineScatter(unit, weapon)) ?? null;
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

    const targets = state.units.filter((unit) => unit.side === "player" && isAttackTarget(unit));
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
  if (resolveSaturnEngineAfterMove(unit, movedDistance(from, unit))) return true;
  pushDialogue(unit, "move");
  state.log.push(`${unitName(unit)}が${movePlan.reason}。`);
  return true;
}

