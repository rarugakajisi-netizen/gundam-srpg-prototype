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

function mobilityFor(unit) {
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
  return unit.runtimeWeapons.find((runtime) => weaponFor(runtime.id).kind === "shield" && runtime.durability > 0);
}

function alliedBattleship(side) {
  return state.units.find((unit) => unit.side === side && isBattleship(unit) && isAlive(unit));
}

function sideHasSkill(side, skillId) {
  return state.units.some((unit) => unit.side === side && isCombatUnit(unit) && isAlive(unit) && unitHasSkill(unit, skillId));
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
  if (pilotSupplyActive(unit)) bonus += 5;
  if (marineSpaceSupportActive(unit)) bonus += 5;
  if (unitHasSkill(unit, "mourningResolve") && alliedMobileSuitDestroyed(unit.side)) bonus += 5;
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
  if (retreatSupportActive(unit)) bonus += 10;
  if (unitHasSkill(unit, "haroSupport")) bonus += 6;
  if (pilotSupplyActive(unit)) bonus += 5;
  if (internalAuditActive(unit)) bonus += 4;
  if (marineSpaceSupportActive(unit)) bonus += 5;
  if (unitHasSkill(unit, "mourningResolve") && alliedMobileSuitDestroyed(unit.side)) bonus -= 4;
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

function evasion(unit) {
  if (isBattleship(unit)) return battleshipFor(unit).agility + battleshipEvasionBonus(unit);
  const ms = msFor(unit);
  const character = primaryCharacterFor(unit);
  return Math.max(0, ms.agility + character.reaction + Math.floor(character.awakening / 2) + characterMsBonus(unit) + skillEvasionBonus(unit) - jinxEvasionPenalty(unit) - unitTerrainPenalty(unit).evasion);
}

function hitRate(attacker, defender, weapon, options = {}) {
  const panicPenalty = unitHasSkill(attacker, "panic") ? 8 : 0;
  const innocentPenalty = isMobileSuit(defender) && unitHasSkill(defender, "innocentPresence") ? 4 : 0;
  const attackOrdinal = options.attackOrdinal ?? ((attacker.usedWeaponIds?.length ?? 0) + 1);
  const minHitRate = minimumHitRate(attacker, attackOrdinal);
  if (isBattleship(attacker)) {
    const raw = weapon.accuracy - BATTLESHIP_HIT_PENALTY + battleshipAimBonus(attacker) + barrageSupportPenalty(defender, attacker) - panicPenalty - innocentPenalty - evasion(defender);
    return clamp(raw, minHitRate, MAX_HIT_RATE);
  }
  const character = primaryCharacterFor(attacker);
  const ability = weapon.attackType === "melee" ? character.melee : character.shooting;
  const repeatPenalty = repeatAttackAccuracyPenalty(attacker, attackOrdinal);
  const raw = weapon.accuracy + ability + Math.floor(character.awakening / 2) + msWeaponBonus(attacker, weapon) + skillAccuracyBonus(attacker, defender, weapon) + oneHandBonus(attacker, weapon) + barrageSupportPenalty(defender, attacker) + HIT_RATE_BONUS - panicPenalty - innocentPenalty - repeatPenalty - evasion(defender);
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
  unit.learningStacks = Math.min(9, before + 1);
  if (unit.learningStacks > before) state.log.push(`${unitName(unit)}の教育型コンピューターがターン経過データを蓄積（補正+${unit.learningStacks}）。`);
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
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "madness") && repeatedTargetAttack(attacker, defender)) damage += 15;
  if (rivalryActive(attacker, defender)) damage += 12;
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
  if (peaceWillDefensiveActive(defender)) damage -= 8;
  if (sideHasSkill(defender.side, "forcedMarch")) damage += 12;
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
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "madness") && repeatedTargetAttack(attacker, defender)) notes.push("狂気");
  if (rivalryActive(attacker, defender)) notes.push("対抗心");
  if (sideHasSkill(attacker.side, "forcedMarch")) notes.push("強行軍攻撃");
  if (isMobileSuit(attacker) && unitHasSkill(attacker, "guardedPersons")) notes.push("要警護人物攻撃抑制");
  if (sideHasSkill(attacker.side, "peaceWill")) notes.push("講和の意志攻撃抑制");
  if (options.iFieldActive) notes.push("Iフィールド");
  if (unitIsSubmerged(defender) && (unitHasSkill(attacker, "antiSubmarine") || weaponHasSkill(weapon, "antiSubmarine"))) notes.push("対水中");
  if (weapon.kind === "ammo" && freezyYardActive(defender)) notes.push("フリージーヤード");
  if (isMobileSuit(defender) && massProductionFormationActive(defender)) notes.push("量産機編成防御");
  if (isMobileSuit(defender) && unitHasSkill(defender, "innocentPresence")) notes.push("無垢な存在");
  if (isMobileSuit(defender) && unitHasSkill(defender, "guardedPersons")) notes.push("要警護人物防御");
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
  if (unit.armor === 0 && canUseCoreSystem(unit)) transformToCoreFighter(unit);
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

