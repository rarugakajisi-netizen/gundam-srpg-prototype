#!/usr/bin/env node
"use strict";

// Static balance diagnostics for the current split card data.
// This report intentionally lists review candidates; it is not a pass/fail gate.

const fs = require("node:fs");
const path = require("node:path");
const { PROJECT_ROOT: ROOT, DATA_FILES } = require("./project-files");
const { loadGameData } = require("./load-game-data");
const { byId, list, cardUsableByFaction, mobileSuitPilotSlots } = require("./game-data-helpers");

const CORE_PATH = path.join(ROOT, "src", "core.js");
const BALANCE_CONSTANTS = {
  HIT_RATE_BONUS: 8,
  MIN_HIT_RATE: 15,
  MIN_REPEAT_ATTACK_HIT_RATE: 6,
  MAX_HIT_RATE: 92,
  REPEAT_ATTACK_ACCURACY_PENALTY: 20,
  REPEAT_ATTACK_MIN_HIT_PENALTY: 3,
  EDUCATIONAL_COMPUTER_ACCURACY_CAP: 9,
  EDUCATIONAL_COMPUTER_EVASION_CAP: 6,
  HARO_EVASION_BONUS: 4,
  MASS_PRODUCTION_MODERNIZATION_ACCURACY_BONUS: 6,
  MASS_PRODUCTION_MODERNIZATION_EVASION_BONUS: 5,
  HADES_ACCURACY_BONUS: 12,
  HADES_EVASION_BONUS: 12,
  HADES_DAMAGE_BONUS: 10
};

const WATCHED_WIDE_SKILLS = {
  forcedMarch: "全体与ダメージ上昇/被ダメージ増加",
  barrageSupport: "周囲3マスの敵回避-8",
  massProductionFormation: "同型量産機の命中/攻防補助",
  massProductionModernization: "低コスト同一機体の命中/回避/攻防/移動補助",
  trailFormation: "縦列4マス以内の味方MSへ回避/防御補助",
  lineFormation: "横列4マス以内の味方MSへ命中/攻撃補助",
  enemyIntel: "最初の敵ターンのみ相手全体命中-8",
  pilotSupply: "戦艦隣接MSの命中/回避+5",
  retreatSupport: "低耐久味方MSの回避+10",
  internalAudit: "周囲2マス味方MSの回避+4",
  marineSpaceSupport: "水中/宇宙専用系MSの命中/回避+5"
};

const WATCHED_OPTIONS = new Set([
  "forcedMarch",
  "barrageSupport",
  "massProductionFormation",
  "massProductionModernization",
  "enemyIntel",
  "educationalComputer",
  "haroSupport",
  "iField",
  "examSystem",
  "guerrillaTactics",
  "stealth",
  "smokeDischarger",
  "priorityTargetDesignation",
  "precisionAttackControl",
  "emergencyRepair",
  "trailFormation",
  "lineFormation",
  "ainasPocketWatch",
  "lastShooting"
]);

const REPRESENTATIVE_DEFENDERS = [
  { label: "標準回避60", evasion: 60 },
  { label: "高回避75", evasion: 75 },
  { label: "極高回避90", evasion: 90 }
];

function loadConstants() {
  if (!fs.existsSync(CORE_PATH)) return { ...BALANCE_CONSTANTS };
  const source = fs.readFileSync(CORE_PATH, "utf8");
  const constants = { ...BALANCE_CONSTANTS };
  for (const key of Object.keys(constants)) {
    const match = source.match(new RegExp(`const\\s+${key}\\s*=\\s*(-?\\d+(?:\\.\\d+)?)\\s*;`));
    if (match) constants[key] = Number(match[1]);
  }
  return constants;
}

const data = loadGameData();
const constants = loadConstants();
const indexes = {
  mobileSuits: byId(data.mobileSuits),
  battleships: byId(data.battleships),
  weapons: byId(data.weapons),
  characters: byId(data.characters),
  options: byId(data.options ?? []),
  skills: byId(data.skills ?? []),
  maps: byId(data.maps ?? [])
};

function number(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function integer(value, fallback = 0) {
  return Number.isInteger(value) ? value : fallback;
}

function unique(values) {
  return [...new Set(values)];
}

function round(value, digits = 2) {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

function percentile(values, ratio) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  return sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * ratio))];
}

function distribution(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return { min: 0, p25: 0, median: 0, p75: 0, p90: 0, max: 0 };
  return {
    min: sorted[0],
    p25: percentile(sorted, 0.25),
    median: percentile(sorted, 0.5),
    p75: percentile(sorted, 0.75),
    p90: percentile(sorted, 0.9),
    max: sorted[sorted.length - 1]
  };
}

function factionKey(item) {
  return list(item.factions ?? [item.faction]).filter(Boolean).sort().join(",");
}

function optionEquippableByMs(option, ms) {
  if (option?.grantsSkill === "examSystem" && list(ms.specials).includes("hadesSystem")) return false;
  if (Number.isFinite(Number(option?.maxMsCost)) && number(ms.cost) > number(option.maxMsCost)) return false;
  if (list(option?.forbiddenMsSkills).some((skillId) => list(ms.specials).includes(skillId))) return false;
  return cardUsableByFaction(option, ms.faction);
}

function tagsOf(ms) {
  return new Set([ms.id, ...list(ms.tags)]);
}

function isDedicatedMobileSuit(ms) {
  return /[（(][^）)]*(?:機|隊)[）)]/.test(ms?.name ?? "");
}

function isDedicatedCompatibilityTag(tag) {
  return tag !== "commanderCustom"
    && (/Custom$/.test(tag) || ["whiteDingo", "immortal4th", "slaveWraith"].includes(tag));
}

function compatibilityMatchesMs(row, ms) {
  if (row.msId) return row.msId === ms.id;
  if (row.msTag) return tagsOf(ms).has(row.msTag);
  return false;
}

function characterMsCompatibilityMatches(row, ms) {
  if (!compatibilityMatchesMs(row, ms)) return false;
  if (!isDedicatedMobileSuit(ms)) return true;
  return row.msId === ms.id
    || Boolean(row.msTag && isDedicatedCompatibilityTag(row.msTag) && tagsOf(ms).has(row.msTag));
}

function characterMsBonus(character, ms) {
  const matches = list(data.compatibility?.characterMs)
    .filter((row) => row.characterId === character.id && characterMsCompatibilityMatches(row, ms));
  const match = matches.find((row) => row.msId === ms.id)
    ?? matches.reduce((best, row) => !best || number(row.evasionBonus) > number(best.evasionBonus) ? row : best, null);
  return number(match?.evasionBonus);
}

function attackWeapon(weapon) {
  return Boolean(weapon)
    && !weapon.utilityOnly
    && number(weapon.power) > 0
    && weapon.attackType !== "guard";
}

function weaponSlotCost(weapon) {
  return Math.max(1, integer(weapon?.slotCost, 1));
}

function runtimeAttackWeaponIds(ids) {
  return unique(list(ids).flatMap((id) => {
    const weapon = indexes.weapons[id];
    return weapon ? [id, ...list(weapon.extraAttackIds)] : [id];
  })).filter((id) => attackWeapon(indexes.weapons[id]));
}

function fixedAttackWeapons(ms) {
  return runtimeAttackWeaponIds(ms.fixedWeaponIds).map((id) => indexes.weapons[id]).filter(Boolean);
}

function carriedAttackWeapons() {
  return data.weapons.filter((weapon) => number(weapon.cost) > 0 && !weapon.fixedOnly && attackWeapon(weapon));
}

function weaponRangeSpan(weapon) {
  const min = number(weapon.minRange, 1) || 1;
  const max = number(weapon.range, min) || min;
  return Math.max(1, max - min + 1);
}

function resourcePenalty(weapon) {
  const consume = number(weapon.consume);
  if (weapon.kind === "beam" || weapon.kind === "special") return consume * 0.65;
  if (weapon.kind === "ammo") return consume * 4 + Math.max(0, 5 - number(weapon.ammo)) * 3;
  if (weapon.kind === "shield") return number(weapon.shieldAttackCost, 10) * 0.25;
  return 0;
}

function weaponRole(weapon) {
  if (weapon.kind === "shield") return "shield";
  if (weapon.chargeRequired) return "charge";
  if (weapon.kind === "beam") return "beam";
  if (weapon.kind === "ammo") return "ammo";
  if (weapon.attackType === "melee") return "melee";
  return weapon.kind ?? "other";
}

function weaponEfficiency(weapon) {
  const rolePenalty = weapon.slotCost && weapon.slotCost > 1 ? weapon.slotCost : 1;
  const value = number(weapon.power) * 0.78
    + number(weapon.accuracy) * 1.25
    + weaponRangeSpan(weapon) * 7
    + number(msWeaponSyntheticUsefulness(weapon))
    - resourcePenalty(weapon)
    - number(weapon.chargeRequired) * 40;
  return value / Math.max(1, number(weapon.cost)) / rolePenalty;
}

function msWeaponSyntheticUsefulness(weapon) {
  if (weapon.ignoresObstacles) return 8;
  if (weapon.cannotTargetFlying) return -5;
  if (list(weapon.specials).includes("antiSubmarine")) return 5;
  return 0;
}

function repeatPenalty(attackOrdinal) {
  return Math.max(0, attackOrdinal - 2) * constants.REPEAT_ATTACK_ACCURACY_PENALTY;
}

function minimumHitRate(attackOrdinal, mobileSuit = true) {
  if (!mobileSuit) return constants.MIN_HIT_RATE;
  const penalty = Math.max(0, attackOrdinal - 2) * constants.REPEAT_ATTACK_MIN_HIT_PENALTY;
  return Math.max(constants.MIN_REPEAT_ATTACK_HIT_RATE, constants.MIN_HIT_RATE - penalty);
}

function hitSequence(rawBeforeRepeat, attackCount, mobileSuit = true) {
  return Array.from({ length: attackCount }, (_, index) => {
    const ordinal = index + 1;
    return Math.max(
      minimumHitRate(ordinal, mobileSuit),
      Math.min(constants.MAX_HIT_RATE, rawBeforeRepeat - repeatPenalty(ordinal))
    );
  });
}

function fixedWeaponProfile(ms) {
  const fixed = fixedAttackWeapons(ms);
  const ammoShots = fixed.reduce((sum, weapon) => sum + (weapon.kind === "ammo" ? number(weapon.ammo) : 0), 0);
  const avgAccuracy = fixed.length ? fixed.reduce((sum, weapon) => sum + number(weapon.accuracy), 0) / fixed.length : 0;
  const maxPower = fixed.length ? Math.max(...fixed.map((weapon) => number(weapon.power))) : 0;
  return {
    count: fixed.length,
    ammoShots,
    avgAccuracy,
    maxPower,
    weapons: fixed.map((weapon) => ({
      id: weapon.id,
      name: weapon.name,
      power: weapon.power,
      accuracy: weapon.accuracy,
      ammo: weapon.ammo,
      kind: weapon.kind
    }))
  };
}

function actionProfile(ms) {
  const fixed = fixedWeaponProfile(ms);
  const carriedUpperBound = number(ms.weaponSlots);
  return {
    fixed,
    carriedUpperBound,
    attackCeiling: fixed.count + carriedUpperBound
  };
}

function msScore(ms) {
  const profile = actionProfile(ms);
  return number(ms.armor) * 0.65
    + number(ms.energy) * 0.25
    + number(ms.agility) * 5
    + number(ms.mobility) * 14
    + number(ms.weaponSlots) * 18
    + profile.fixed.count * 25
    + profile.fixed.maxPower * 0.15
    + list(ms.specials).length * 14;
}

function skillEvasionBonusFromStatic(ms, character, optionIds = [], examActive = false, hadesActive = false) {
  const skills = new Set([...list(ms.specials), ...list(character.specials), ...optionIds.map((id) => indexes.options[id]?.grantsSkill).filter(Boolean)]);
  let bonus = 0;
  if (skills.has("educationalComputer")) bonus += constants.EDUCATIONAL_COMPUTER_EVASION_CAP;
  if (skills.has("haroSupport")) bonus += constants.HARO_EVASION_BONUS;
  if (skills.has("massProductionModernization")) bonus += constants.MASS_PRODUCTION_MODERNIZATION_EVASION_BONUS;
  if (skills.has("phantomSystem")) bonus += 10;
  if (examActive && skills.has("examSystem")) bonus += 18;
  if (hadesActive && skills.has("hadesSystem")) bonus += constants.HADES_EVASION_BONUS;
  return bonus;
}

function pilotCandidatesForMs(ms) {
  if (mobileSuitPilotSlots(ms) <= 0) return [{ id: "", name: "未搭乗", cost: 0, reaction: 0, awakening: 0, specials: [], faction: ms.faction }];
  return data.characters.filter((character) =>
    character.selectable !== false
    && cardUsableByFaction(character, ms.faction)
  );
}

function evasionCombos() {
  const rows = [];
  for (const ms of data.mobileSuits) {
    for (const character of pilotCandidatesForMs(ms)) {
      const compatible = character.id ? characterMsBonus(character, ms) : 0;
      const base = number(ms.agility)
        + number(character.reaction)
        + Math.floor(number(character.awakening) / 2)
        + compatible
        + skillEvasionBonusFromStatic(ms, character);
      const optionScenarios = [{ label: "素", optionIds: [], examActive: false, hadesActive: false }];
      if (number(ms.optionSlots, 1) > 0) {
        if (optionEquippableByMs(indexes.options.haro, ms)) optionScenarios.push({ label: "ハロ", optionIds: ["haro"], examActive: false, hadesActive: false });
        if (optionEquippableByMs(indexes.options.educationalComputer, ms)) optionScenarios.push({ label: "教育型最大", optionIds: ["educationalComputer"], examActive: false, hadesActive: false });
        if (optionEquippableByMs(indexes.options.massProductionModernizationPlan, ms)) optionScenarios.push({ label: "量産機近代化（編成成立）", optionIds: ["massProductionModernizationPlan"], examActive: false, hadesActive: false });
        if (!list(ms.specials).includes("examSystem") && optionEquippableByMs(indexes.options.examSystemOption, ms)) {
          optionScenarios.push({ label: "EXAM OP発動", optionIds: ["examSystemOption"], examActive: true, hadesActive: false });
        }
      }
      if (list(ms.specials).includes("examSystem")) optionScenarios.push({ label: "機体EXAM発動", optionIds: [], examActive: true, hadesActive: false });
      if (list(ms.specials).includes("hadesSystem")) optionScenarios.push({ label: "HADES発動", optionIds: [], examActive: false, hadesActive: true });
      for (const scenario of optionScenarios) {
        const total = base + skillEvasionBonusFromStatic(ms, character, scenario.optionIds, scenario.examActive, scenario.hadesActive);
        if (total >= 82) {
          rows.push({
            evasion: total,
            scenario: scenario.label,
            msId: ms.id,
            msName: ms.name,
            msCost: ms.cost,
            agility: ms.agility,
            characterId: character.id,
            characterName: character.name,
            characterCost: character.cost,
            reaction: character.reaction,
            awakening: character.awakening,
            compatibility: compatible,
            totalCost: number(ms.cost) + number(character.cost) + scenario.optionIds.reduce((sum, id) => sum + number(indexes.options[id]?.cost), 0)
          });
        }
      }
    }
  }
  return rows.sort((a, b) => b.evasion - a.evasion || a.totalCost - b.totalCost).slice(0, 30);
}

function lowCostSwarmCandidates() {
  return data.mobileSuits
    .map((ms) => {
      const profile = actionProfile(ms);
      const isAircraft = ms.movementType === "flying" || list(ms.tags).some((tag) => /Aircraft|Fighter|helicopter/i.test(tag));
      const score = msScore(ms) / Math.max(1, number(ms.cost))
        + (isAircraft ? 0.9 : 0)
        + (number(ms.cost) <= 70 ? 0.6 : 0)
        + (profile.fixed.count >= 2 ? 0.5 : 0);
      return {
        id: ms.id,
        name: ms.name,
        faction: ms.faction,
        cost: ms.cost,
        armor: ms.armor,
        agility: ms.agility,
        mobility: ms.mobility,
        movementType: ms.movementType ?? "normal",
        fixedAttacks: profile.fixed.count,
        fixedAmmoShots: profile.fixed.ammoShots,
        avgFixedAccuracy: round(profile.fixed.avgAccuracy, 1),
        score: round(score, 2)
      };
    })
    .filter((item) => item.cost <= 120)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);
}

function multiWeaponCandidates() {
  return data.mobileSuits
    .map((ms) => {
      const profile = actionProfile(ms);
      return {
        id: ms.id,
        name: ms.name,
        faction: ms.faction,
        cost: ms.cost,
        weaponSlots: number(ms.weaponSlots),
        fixedAttacks: profile.fixed.count,
        attackCeiling: profile.attackCeiling,
        avgFixedAccuracy: round(profile.fixed.avgAccuracy, 1),
        fixedAmmoShots: profile.fixed.ammoShots,
        fixedWeapons: profile.fixed.weapons.map((weapon) => `${weapon.name}:${weapon.power}/${weapon.accuracy}/${weapon.ammo}`).join(", ")
      };
    })
    .filter((item) => item.attackCeiling >= 5 || (item.fixedAttacks >= 3 && item.avgFixedAccuracy >= 74))
    .sort((a, b) => b.attackCeiling - a.attackCeiling || b.avgFixedAccuracy - a.avgFixedAccuracy || a.cost - b.cost)
    .slice(0, 30);
}

function weaponEfficiencyRows() {
  return carriedAttackWeapons()
    .map((weapon) => ({
      id: weapon.id,
      name: weapon.name,
      role: weaponRole(weapon),
      faction: factionKey(weapon),
      cost: weapon.cost,
      power: weapon.power,
      accuracy: weapon.accuracy,
      range: `${number(weapon.minRange, 1) || 1}-${number(weapon.range, 1) || 1}`,
      ammo: weapon.kind === "ammo" ? weapon.ammo : "",
      consume: weapon.consume ?? "",
      slotCost: weaponSlotCost(weapon),
      efficiency: round(weaponEfficiency(weapon), 2)
    }))
    .sort((a, b) => b.efficiency - a.efficiency);
}

function roleSummaries(weaponRows) {
  const groups = new Map();
  for (const row of weaponRows) {
    if (!groups.has(row.role)) groups.set(row.role, []);
    groups.get(row.role).push(row.efficiency);
  }
  return [...groups.entries()].map(([role, values]) => ({
    role,
    count: values.length,
    distribution: distribution(values)
  })).sort((a, b) => a.role.localeCompare(b.role));
}

function wideSkillSources() {
  const rows = [];
  for (const [skillId, note] of Object.entries(WATCHED_WIDE_SKILLS)) {
    const sources = [];
    for (const character of data.characters) {
      if (list(character.specials).includes(skillId)) {
        sources.push({ type: "character", id: character.id, name: character.name, cost: character.cost, faction: character.faction, roles: list(character.roles).join("/") });
      }
    }
    for (const option of data.options ?? []) {
      if (option.grantsSkill === skillId) {
        sources.push({ type: "option", id: option.id, name: option.name, cost: option.cost, faction: factionKey(option), roles: "" });
      }
    }
    if (sources.length) {
      rows.push({
        skillId,
        skillName: indexes.skills[skillId]?.name ?? skillId,
        note,
        count: sources.length,
        minCost: Math.min(...sources.map((source) => number(source.cost))),
        sources: sources.sort((a, b) => number(a.cost) - number(b.cost))
      });
    }
  }
  return rows.sort((a, b) => a.minCost - b.minCost);
}

function stageRows() {
  return list(data.campaign?.stages).map((stage) => {
    const entries = Object.values(stage.enemyFormations ?? {}).flat();
    const unitCost = entries.reduce((sum, entry) => sum
      + number(indexes.mobileSuits[entry.msId]?.cost)
      + list(entry.characterIds).reduce((value, id) => value + number(indexes.characters[id]?.cost), 0)
      + list(entry.weaponIds).reduce((value, id) => value + number(indexes.weapons[id]?.cost), 0)
      + list(entry.optionIds).reduce((value, id) => value + number(indexes.options[id]?.cost), 0), 0);
    const bridgeCost = number(indexes.characters[stage.enemyCaptainId]?.cost)
      + number(indexes.characters[stage.enemyFirstOfficerId]?.cost);
    const escortShipCost = list(stage.enemyEscortBattleshipIds).reduce((sum, id) => sum + number(indexes.battleships[id]?.cost), 0);
    const reinforcement = stage.enemyReinforcements;
    const reinforcementEntries = list(reinforcement?.entries);
    const reinforcementCount = Math.max(0, Math.floor(number(reinforcement?.countPerTurn ?? reinforcement?.count) || reinforcementEntries.length));
    const reinforcementStart = Math.max(1, Math.floor(number(reinforcement?.startTurn) || 2));
    const reinforcementEnd = Number.isFinite(Number(reinforcement?.endTurn)) ? Math.max(reinforcementStart, Math.floor(Number(reinforcement.endTurn))) : reinforcementStart;
    const reinforcementTurns = reinforcement ? reinforcementEnd - reinforcementStart + 1 : 0;
    const reinforcementMsCost = Array.from({ length: reinforcementCount }, (_, index) => {
      const entry = reinforcementEntries[index % Math.max(1, reinforcementEntries.length)];
      return entry ? number(indexes.mobileSuits[entry.msId]?.cost)
        + list(entry.characterIds).reduce((sum, id) => sum + number(indexes.characters[id]?.cost), 0)
        + list(entry.weaponIds).reduce((sum, id) => sum + number(indexes.weapons[id]?.cost), 0)
        + list(entry.optionIds).reduce((sum, id) => sum + number(indexes.options[id]?.cost), 0) : 0;
    }).reduce((sum, cost) => sum + cost, 0);
    const reinforcementShipCost = list(reinforcement?.battleships).reduce((sum, entry) => sum
      + number(indexes.battleships[entry.battleshipId]?.cost)
      + list(entry.characterIds).reduce((crewSum, id) => crewSum + number(indexes.characters[id]?.cost), 0), 0);
    const enemyCost = unitCost + number(indexes.battleships[stage.enemyBattleshipId]?.cost) + escortShipCost + bridgeCost
      + reinforcementTurns * (reinforcementMsCost + reinforcementShipCost);
    const autoMargin = Math.max(80, Math.ceil(enemyCost * 0.15));
    const noEnemyBattleshipBonus = stage.enemyBattleshipId === null && !Number.isFinite(stage.costCap) ? 100 : 0;
    const costCap = Number.isFinite(stage.costCap) ? stage.costCap : Math.ceil((enemyCost + autoMargin + noEnemyBattleshipBonus) / 10) * 10;
    const specialRules = [
      stage.turnLimit ? `turnLimit:${stage.turnLimit}` : "",
      stage.surviveTurns ? `survive:${stage.surviveTurns}` : "",
      stage.enemyReinforcements ? `reinforce:${stage.enemyReinforcements.countPerTurn ?? stage.enemyReinforcements.count ?? "?"}` : "",
      list(stage.defenseTargets).length ? `defense:${list(stage.defenseTargets).length}` : "",
      list(stage.infiltrationTargets).length ? `infiltration:${list(stage.infiltrationTargets).length}` : "",
      Object.values(stage.enemyFormations ?? {}).flat().some((entry) => entry.aiInactiveUntilTurn) ? `delayedEnemy:${Math.min(...Object.values(stage.enemyFormations ?? {}).flat().map((entry) => number(entry.aiInactiveUntilTurn)).filter(Boolean))}` : "",
      noEnemyBattleshipBonus ? `noEnemyShipBonus:${noEnemyBattleshipBonus}` : "",
      stage.enemyBattleshipId ? `enemyShip:${stage.enemyBattleshipId}` : "",
      list(stage.enemyEscortBattleshipIds).length ? `escortShips:${list(stage.enemyEscortBattleshipIds).length}` : ""
    ].filter(Boolean);
    return {
      id: stage.id,
      name: stage.name,
      mapId: stage.mapId,
      enemies: entries.length,
      enemyCost,
      costCap,
      margin: costCap - enemyCost,
      specialRules: specialRules.join(", ") || "-"
    };
  });
}

function integrityChecks() {
  const issues = [];
  for (const [type, items] of Object.entries({
    mobileSuits: data.mobileSuits,
    battleships: data.battleships,
    weapons: data.weapons,
    characters: data.characters,
    options: data.options ?? [],
    skills: data.skills ?? []
  })) {
    const seen = new Set();
    for (const item of items) {
      if (seen.has(item.id)) issues.push(`${type}: ID重複 ${item.id}`);
      seen.add(item.id);
    }
  }
  for (const ms of data.mobileSuits) {
    for (const id of list(ms.fixedWeaponIds)) if (!indexes.weapons[id]) issues.push(`${ms.id}: 不明な固定武装 ${id}`);
  }
  for (const ship of data.battleships) {
    for (const id of list(ship.weaponIds)) if (!indexes.weapons[id]) issues.push(`${ship.id}: 不明な艦載武装 ${id}`);
  }
  const usedSkillIds = unique([
    ...data.mobileSuits.flatMap((item) => list(item.specials)),
    ...data.weapons.flatMap((item) => list(item.specials)),
    ...data.characters.flatMap((item) => list(item.specials)),
    ...list(data.options).map((item) => item.grantsSkill).filter(Boolean)
  ]);
  for (const id of usedSkillIds) if (!indexes.skills[id]) issues.push(`スキル定義なし: ${id}`);
  return issues;
}

function warningsFromReport(draft) {
  const warnings = [];
  const add = (severity, category, item, message, evidence = {}) => {
    warnings.push({
      severity,
      category,
      id: item.id ?? item.warningId ?? item.msId ?? item.skillId,
      name: item.name ?? item.warningName ?? item.msName ?? item.skillName,
      message,
      evidence
    });
  };

  for (const item of draft.multiWeaponCandidates) {
    if (item.attackCeiling >= 5 && item.avgFixedAccuracy >= 74) {
      add("high", "multi-weapon-accuracy", item, "多武装かつ固定武装の平均命中が高めです。", {
        attackCeiling: item.attackCeiling,
        avgFixedAccuracy: item.avgFixedAccuracy,
        fixedAmmoShots: item.fixedAmmoShots
      });
    } else if (item.attackCeiling >= 5) {
      add("medium", "multi-weapon-count", item, "装備込みの攻撃回数上限が高い機体です。", {
        attackCeiling: item.attackCeiling,
        avgFixedAccuracy: item.avgFixedAccuracy,
        fixedAmmoShots: item.fixedAmmoShots
      });
    }
  }

  for (const item of draft.lowCostSwarmCandidates) {
    if (item.score >= 3.2 && item.cost <= 80) {
      add("medium", "low-cost-swarm", item, "低コスト物量で効率が高くなりやすい候補です。", {
        score: item.score,
        fixedAttacks: item.fixedAttacks,
        fixedAmmoShots: item.fixedAmmoShots,
        movementType: item.movementType
      });
    }
  }

  for (const row of draft.evasionCombos.slice(0, 20)) {
    const item = {
      ...row,
      warningId: `${row.msId}:${row.characterId || "none"}:${row.scenario}`,
      warningName: `${row.msName} + ${row.characterName} / ${row.scenario}`
    };
    if (row.evasion >= 96) {
      add("high", "high-evasion-stack", item, "命中下限頼みになりやすい高回避ビルドです。", {
        evasion: row.evasion,
        scenario: row.scenario,
        msId: row.msId,
        characterId: row.characterId,
        totalCost: row.totalCost
      });
    } else if (row.evasion >= 90) {
      add("medium", "high-evasion-stack", item, "高回避ビルドです。命中補助との相性を確認してください。", {
        evasion: row.evasion,
        scenario: row.scenario,
        msId: row.msId,
        characterId: row.characterId,
        totalCost: row.totalCost
      });
    }
  }

  for (const option of data.options ?? []) {
    if (number(option.cost) < 0) {
      add("medium", "negative-cost-option", option, "編成コストを直接下げるOPです。性能低下に対して値引きが過剰でないか継続監視してください。", {
        cost: option.cost,
        armorModifier: option.armorModifier ?? 0,
        energyModifier: option.energyModifier ?? 0,
        agilityModifier: option.agilityModifier ?? 0,
        mobilityModifier: option.mobilityModifier ?? 0,
        accuracyModifier: option.accuracyModifier ?? 0,
        damageModifier: option.damageModifier ?? 0
      });
    }
    if (WATCHED_OPTIONS.has(option.grantsSkill)) {
      const severity = ["forcedMarch", "enemyIntel", "examSystem", "iField", "massProductionModernization"].includes(option.grantsSkill) ? "high" : "medium";
      add(severity, "rule-sensitive-option", option, "ルール影響が大きいOPです。コストと発動条件を継続監視してください。", {
        skill: option.grantsSkill,
        cost: option.cost
      });
    }
  }

  return warnings.sort((a, b) => {
    const order = { high: 0, medium: 1, info: 2 };
    return order[a.severity] - order[b.severity] || a.category.localeCompare(b.category) || String(a.name).localeCompare(String(b.name), "ja");
  });
}

function buildRepresentativeHitRows() {
  const attackers = [
    { label: "標準射撃", weaponAccuracy: 78, ability: 18, skill: 0 },
    { label: "高命中射撃", weaponAccuracy: 82, ability: 24, skill: 0 },
    { label: "教育型最大", weaponAccuracy: 78, ability: 18, skill: constants.EDUCATIONAL_COMPUTER_ACCURACY_CAP },
    { label: "EXAM発動", weaponAccuracy: 78, ability: 18, skill: 18 },
    { label: "HADES発動", weaponAccuracy: 78, ability: 18, skill: constants.HADES_ACCURACY_BONUS }
  ];
  return attackers.flatMap((attacker) => REPRESENTATIVE_DEFENDERS.map((defender) => {
    const raw = attacker.weaponAccuracy + attacker.ability + attacker.skill + constants.HIT_RATE_BONUS - defender.evasion;
    return {
      attacker: attacker.label,
      defender: defender.label,
      rawBeforeRepeat: raw,
      sequence: hitSequence(raw, 5).join(" / ")
    };
  }));
}

function buildReport() {
  const weaponRows = weaponEfficiencyRows();
  const report = {
    generatedAt: new Date().toISOString(),
    source: DATA_FILES.join(" + "),
    constants,
    counts: {
      mobileSuits: data.mobileSuits.length,
      battleships: data.battleships.length,
      weapons: data.weapons.length,
      characters: data.characters.length,
      options: list(data.options).length,
      skills: list(data.skills).length,
      stages: list(data.campaign?.stages).length
    },
    distributions: {
      mobileSuitCost: distribution(data.mobileSuits.map((item) => number(item.cost))),
      battleshipCost: distribution(data.battleships.map((item) => number(item.cost))),
      weaponCost: distribution(data.weapons.filter((item) => number(item.cost) > 0).map((item) => number(item.cost))),
      characterCost: distribution(data.characters.map((item) => number(item.cost))),
      optionCost: distribution(list(data.options).map((item) => number(item.cost)))
    },
    repeatAttack: {
      penalties: Array.from({ length: 6 }, (_, index) => repeatPenalty(index + 1)),
      mobileSuitMinimums: Array.from({ length: 6 }, (_, index) => minimumHitRate(index + 1, true)),
      battleshipMinimums: Array.from({ length: 6 }, (_, index) => minimumHitRate(index + 1, false)),
      representativeHits: buildRepresentativeHitRows()
    },
    integrity: integrityChecks(),
    lowCostSwarmCandidates: lowCostSwarmCandidates(),
    multiWeaponCandidates: multiWeaponCandidates(),
    evasionCombos: evasionCombos(),
    weaponEfficiencyTop: weaponRows.slice(0, 35),
    weaponEfficiencyByRole: roleSummaries(weaponRows),
    wideSkillSources: wideSkillSources(),
    stages: stageRows()
  };
  report.warnings = warningsFromReport(report);
  return report;
}

function markdownTable(headers, rows) {
  const escape = (value) => String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
  if (!rows.length) return "_該当なし_";
  return [
    `| ${headers.map(escape).join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(escape).join(" | ")} |`)
  ].join("\n");
}

function reportToMarkdown(report) {
  const warningCounts = Object.fromEntries(["high", "medium", "info"].map((severity) => [
    severity,
    report.warnings.filter((item) => item.severity === severity).length
  ]));
  const repeatRule = `ペナルティ ${report.repeatAttack.penalties.join(" / ")}、MS最低命中 ${report.repeatAttack.mobileSuitMinimums.join(" / ")}、戦艦最低命中 ${report.repeatAttack.battleshipMinimums.join(" / ")}`;

  return [
    "# カードバランス自動診断",
    "",
    `生成: ${report.generatedAt}`,
    `参照: \`${report.source}\``,
    "",
    "> このレポートは、今の調整方針に沿って再確認候補を絞るための静的診断です。実戦での強弱を断定するものではありません。",
    "",
    "## サマリー",
    "",
    markdownTable(
      ["MS/MA", "戦艦", "武器", "キャラ", "OP", "スキル", "ステージ"],
      [[report.counts.mobileSuits, report.counts.battleships, report.counts.weapons, report.counts.characters, report.counts.options, report.counts.skills, report.counts.stages]]
    ),
    "",
    `警告候補: high ${warningCounts.high} / medium ${warningCounts.medium} / info ${warningCounts.info}`,
    "",
    "## コスト分布",
    "",
    markdownTable(
      ["分類", "min", "p25", "median", "p75", "p90", "max"],
      Object.entries(report.distributions).map(([key, value]) => [key, value.min, value.p25, value.median, value.p75, value.p90, value.max])
    ),
    "",
    "## 連続攻撃・命中前提",
    "",
    repeatRule,
    "",
    markdownTable(
      ["攻撃側", "防御側", "連続攻撃前の素値", "1〜5回目命中"],
      report.repeatAttack.representativeHits.map((row) => [row.attacker, row.defender, row.rawBeforeRepeat, row.sequence])
    ),
    "",
    "## データ整合性",
    "",
    report.integrity.length ? report.integrity.map((item) => `- ${item}`).join("\n") : "問題は見つかりませんでした。",
    "",
    "## 優先確認候補",
    "",
    markdownTable(
      ["重要度", "分類", "カード", "指摘", "根拠"],
      report.warnings.map((item) => [item.severity, item.category, `${item.name} (${item.id})`, item.message, JSON.stringify(item.evidence)])
    ),
    "",
    "## 低コスト物量・航空機候補",
    "",
    markdownTable(
      ["機体", "勢力", "コスト", "装甲", "回避", "移動", "移動型", "固定攻撃", "固定弾数", "固定平均命中", "効率"],
      report.lowCostSwarmCandidates.map((item) => [item.name, item.faction, item.cost, item.armor, item.agility, item.mobility, item.movementType, item.fixedAttacks, item.fixedAmmoShots, item.avgFixedAccuracy, item.score])
    ),
    "",
    "## 多武装・固定武装圧",
    "",
    markdownTable(
      ["機体", "勢力", "コスト", "装備枠", "固定攻撃", "最大攻撃候補", "固定平均命中", "固定弾数", "固定武装"],
      report.multiWeaponCandidates.map((item) => [item.name, item.faction, item.cost, item.weaponSlots, item.fixedAttacks, item.attackCeiling, item.avgFixedAccuracy, item.fixedAmmoShots, item.fixedWeapons])
    ),
    "",
    "## 高回避スタック候補",
    "",
    markdownTable(
      ["回避", "シナリオ", "機体", "機体コスト", "パイロット", "パイロットコスト", "相性", "総コスト"],
      report.evasionCombos.map((item) => [item.evasion, item.scenario, `${item.msName} (${item.msId})`, item.msCost, `${item.characterName} (${item.characterId || "none"})`, item.characterCost, item.compatibility, item.totalCost])
    ),
    "",
    "## 携行武器 効率上位",
    "",
    markdownTable(
      ["武器", "役割", "勢力", "コスト", "威力", "命中", "射程", "弾数", "消費", "枠", "効率"],
      report.weaponEfficiencyTop.map((item) => [item.name, item.role, item.faction, item.cost, item.power, item.accuracy, item.range, item.ammo, item.consume, item.slotCost, item.efficiency])
    ),
    "",
    "## 武器役割別 効率分布",
    "",
    markdownTable(
      ["役割", "数", "min", "median", "p90", "max"],
      report.weaponEfficiencyByRole.map((item) => [item.role, item.count, item.distribution.min, item.distribution.median, item.distribution.p90, item.distribution.max])
    ),
    "",
    "## 広域・支援スキル源",
    "",
    markdownTable(
      ["スキル", "最安コスト", "数", "用途", "安い順の主な源"],
      report.wideSkillSources.map((item) => [
        `${item.skillName} (${item.skillId})`,
        item.minCost,
        item.count,
        item.note,
        item.sources.slice(0, 6).map((source) => `${source.name}/${source.type}/${source.cost}`).join(", ")
      ])
    ),
    "",
    "## ステージコスト",
    "",
    markdownTable(
      ["ステージ", "マップ", "敵数", "敵総コスト", "出撃上限", "余裕", "特殊条件"],
      report.stages.map((item) => [item.name || item.id, item.mapId, item.enemies, item.enemyCost, item.costCap, item.margin, item.specialRules])
    ),
    "",
    "## 読み方メモ",
    "",
    "- 低コスト物量候補は、低コスト・飛行・固定武装数・固定弾数・基礎性能を混ぜたレビュー用スコアです。",
    "- 多武装候補は、固定攻撃数と装備枠から「1ターンに撃てる可能性がある武装数」を見ています。",
    "- 高回避候補は、相性・覚醒・ハロ・教育型・EXAMなどの代表的な重ね方を静的に列挙しています。",
    "- 携行武器効率は、威力、命中、射程、弾数/EN消費、slotCost、チャージを混ぜた比較用スコアです。",
    "- high/medium は調整対象の断定ではなく、次に人間が見るべき候補です。"
  ].join("\n");
}

function parseArgs(args) {
  const parsed = { json: false, output: "", help: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--json") parsed.json = true;
    else if (arg === "--output") parsed.output = args[++index] ?? "";
    else if (arg === "--help") parsed.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return parsed;
}

const args = parseArgs(process.argv.slice(2));
if (args.help) {
  console.log("Usage: node work/card-balance-report.js [--json] [--output <path>]");
  process.exit(0);
}

const report = buildReport();
const output = args.json ? `${JSON.stringify(report, null, 2)}\n` : `${reportToMarkdown(report)}\n`;
if (args.output) {
  const outputPath = path.resolve(ROOT, args.output);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, output, "utf8");
  console.log(`Balance report written: ${outputPath}`);
} else {
  process.stdout.write(output);
}
