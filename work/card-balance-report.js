#!/usr/bin/env node
"use strict";

// Static balance diagnostics for the card data. This intentionally reports
// review candidates rather than declaring cards balanced or unbalanced.

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATHS = [
  path.join(ROOT, "data", "game-data.js"),
  path.join(ROOT, "data", "jissou4-data.js")
];

function loadGameData() {
  const sandbox = { window: {} };
  for (const dataPath of DATA_PATHS) {
    if (!fs.existsSync(dataPath)) continue;
    vm.runInNewContext(fs.readFileSync(dataPath, "utf8"), sandbox, { filename: dataPath });
  }
  if (!sandbox.window.GAME_DATA) throw new Error("window.GAME_DATA was not defined.");
  return sandbox.window.GAME_DATA;
}

const data = loadGameData();
const weaponsById = Object.fromEntries(data.weapons.map((item) => [item.id, item]));
const skillsById = Object.fromEntries((data.skills ?? []).map((item) => [item.id, item]));
const warnings = [];

function number(value) {
  return Number.isFinite(value) ? value : 0;
}

function median(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function percentile(values, ratio) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (sorted.length === 0) return 0;
  return sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * ratio))];
}

function unique(values) {
  return [...new Set(values)];
}

function attackWeaponIds(ids) {
  return unique((ids ?? []).flatMap((id) => {
    const weapon = weaponsById[id];
    return weapon ? [id, ...(weapon.extraAttackIds ?? [])] : [id];
  })).filter((id) => {
    const weapon = weaponsById[id];
    return weapon && !weapon.utilityOnly && number(weapon.power) > 0;
  });
}

function fixedAttackCount(ms) {
  return attackWeaponIds(ms.fixedWeaponIds).length;
}

function potentialAttackCount(ms) {
  // Every attack-capable weapon can currently be used once per turn. Carried
  // weapons consume at least one slot, so weaponSlots is the safe upper bound.
  return fixedAttackCount(ms) + number(ms.weaponSlots);
}

function msRawScore(ms) {
  return number(ms.armor)
    + number(ms.energy) * 0.35
    + number(ms.agility) * 3
    + number(ms.mobility) * 12
    + number(ms.weaponSlots) * 15
    + fixedAttackCount(ms) * 22
    + (ms.specials ?? []).length * 15;
}

function weaponExpectedDamage(weapon) {
  return number(weapon.power) * number(weapon.accuracy) / 100;
}

function weaponReachFactor(weapon) {
  const min = number(weapon.minRange) || 1;
  const max = number(weapon.range) || min;
  return 1 + Math.max(0, max - min) * 0.08;
}

function weaponEfficiency(weapon) {
  return weaponExpectedDamage(weapon) * weaponReachFactor(weapon) / Math.max(1, number(weapon.cost));
}

function factionKey(item) {
  return [...(item.factions ?? [item.faction]).filter(Boolean)].sort().join(",");
}

function conservativeWeaponDominations() {
  const candidates = data.weapons.filter((weapon) =>
    number(weapon.cost) > 0
    && number(weapon.power) > 0
    && !weapon.fixedOnly
    && !(weapon.extraAttackIds ?? []).length
    && !(weapon.specials ?? []).length
    && weapon.kind !== "shield"
  );
  const results = [];
  for (const weaker of candidates) {
    for (const stronger of candidates) {
      if (weaker.id === stronger.id) continue;
      if (factionKey(weaker) !== factionKey(stronger)) continue;
      if (weaker.kind !== stronger.kind || weaker.attackType !== stronger.attackType) continue;
      if (weaker.category !== stronger.category) continue;
      const resourceIsBetter = weaker.kind === "beam"
        ? number(stronger.consume) <= number(weaker.consume)
        : weaker.kind === "ammo"
          ? number(stronger.ammo) >= number(weaker.ammo) && number(stronger.consume) <= number(weaker.consume)
          : true;
      const noWorse = number(stronger.cost) <= number(weaker.cost)
        && number(stronger.power) >= number(weaker.power)
        && number(stronger.accuracy) >= number(weaker.accuracy)
        && (number(stronger.minRange) || 1) <= (number(weaker.minRange) || 1)
        && number(stronger.range) >= number(weaker.range)
        && (number(stronger.slotCost) || 1) <= (number(weaker.slotCost) || 1)
        && resourceIsBetter;
      const strictlyBetter = number(stronger.cost) < number(weaker.cost)
        || number(stronger.power) > number(weaker.power)
        || number(stronger.accuracy) > number(weaker.accuracy)
        || number(stronger.range) > number(weaker.range);
      if (noWorse && strictlyBetter) results.push({ weaker, stronger });
    }
  }
  return results.filter((pair, index, all) =>
    all.findIndex((other) => other.weaker.id === pair.weaker.id) === index
  );
}

function addWarning(severity, category, card, message, evidence = {}) {
  warnings.push({ severity, category, id: card.id, name: card.name, message, evidence });
}

function collectWarnings() {
  const msEfficiencies = data.mobileSuits.map((ms) => msRawScore(ms) / Math.max(1, number(ms.cost)));
  const highMsEfficiency = percentile(msEfficiencies, 0.9);
  const lowMsEfficiency = percentile(msEfficiencies, 0.1);
  for (const ms of data.mobileSuits) {
    const attacks = potentialAttackCount(ms);
    const efficiency = msRawScore(ms) / Math.max(1, number(ms.cost));
    if (attacks >= 5) addWarning("high", "action-economy", ms, `最大攻撃回数候補が${attacks}回です。`, { fixedAttacks: fixedAttackCount(ms), weaponSlots: ms.weaponSlots, cost: ms.cost });
    else if (attacks >= 4) addWarning("medium", "action-economy", ms, `最大攻撃回数候補が${attacks}回です。`, { fixedAttacks: fixedAttackCount(ms), weaponSlots: ms.weaponSlots, cost: ms.cost });
    if (number(ms.cost) <= 100 && fixedAttackCount(ms) >= 2) addWarning("medium", "cheap-multiattack", ms, `コスト${ms.cost}で固定攻撃を${fixedAttackCount(ms)}個持ちます。`, { cost: ms.cost, fixedAttacks: fixedAttackCount(ms) });
    if (efficiency >= highMsEfficiency) addWarning("info", "ms-cost-outlier", ms, "簡易性能/コストが上位10%です。", { efficiency: efficiency.toFixed(2) });
    if (efficiency <= lowMsEfficiency) addWarning("info", "ms-cost-outlier", ms, "簡易性能/コストが下位10%です。", { efficiency: efficiency.toFixed(2) });
  }

  const carriedWeapons = data.weapons.filter((weapon) => number(weapon.cost) > 0 && number(weapon.power) > 0 && !weapon.fixedOnly);
  const weaponEfficiencies = carriedWeapons.map(weaponEfficiency);
  const highWeaponEfficiency = percentile(weaponEfficiencies, 0.9);
  const lowWeaponEfficiency = percentile(weaponEfficiencies, 0.1);
  for (const weapon of carriedWeapons) {
    const efficiency = weaponEfficiency(weapon);
    if (efficiency >= highWeaponEfficiency) addWarning("info", "weapon-cost-outlier", weapon, "基礎期待値/コストが上位10%です。", { efficiency: efficiency.toFixed(2) });
    if (efficiency <= lowWeaponEfficiency) addWarning("info", "weapon-cost-outlier", weapon, "基礎期待値/コストが下位10%です。", { efficiency: efficiency.toFixed(2) });
    if ((weapon.extraAttackIds ?? []).length) addWarning("medium", "action-economy", weapon, `付属攻撃を${weapon.extraAttackIds.length}個追加します。`, { extraAttackIds: weapon.extraAttackIds });
  }
  for (const { weaker, stronger } of conservativeWeaponDominations()) {
    addWarning("high", "weapon-dominated", weaker, `${stronger.name}が同分類で全主要数値を上回っています。`, { strongerId: stronger.id, strongerName: stronger.name });
  }

  const perAttackSkills = new Set(["ace", "aiSenshi", "outstandingTalent", "enhancedWarhead", "highOutputGenerator", "precisionMeleeProgram", "teamwork"]);
  for (const character of data.characters.filter((item) => item.selectable !== false)) {
    const matching = (character.specials ?? []).filter((id) => perAttackSkills.has(id));
    if (matching.length) addWarning("medium", "per-attack-scaling", character, "複数武装攻撃の回数に比例して効果が増えます。", { skills: matching });
    if ((character.specials ?? []).includes("panic")) addWarning("medium", "persistent-penalty", character, "常時命中-8のペナルティを持ちます。", { skill: "panic" });
  }

  const sensitiveOptions = {
    guerrillaTactics: "特殊地形上で射撃対象不可になるため、地形配置と接近手段を確認します。",
    educationalComputer: "攻撃ごとに成長するため、複数武装で1ターンに複数成長します。",
    iField: "ビーム被弾ごとに自動発動し、回数制限がありません。",
    massProductionFormation: "同型機複数へ攻防・命中の複合効果を与えます。",
    barrageSupport: "周囲の味方全体を支援し、重複しません。"
  };
  for (const option of data.options ?? []) {
    if (sensitiveOptions[option.grantsSkill]) addWarning("high", "rule-sensitive-option", option, sensitiveOptions[option.grantsSkill], { skill: option.grantsSkill, cost: option.cost });
  }
}

function integrityChecks() {
  const issues = [];
  for (const [type, items] of Object.entries({ mobileSuits: data.mobileSuits, battleships: data.battleships, weapons: data.weapons, characters: data.characters, options: data.options ?? [] })) {
    const seen = new Set();
    for (const item of items) {
      if (seen.has(item.id)) issues.push(`${type}: ID重複 ${item.id}`);
      seen.add(item.id);
    }
  }
  for (const ms of data.mobileSuits) {
    for (const id of ms.fixedWeaponIds ?? []) if (!weaponsById[id]) issues.push(`${ms.id}: 不明な固定武装 ${id}`);
  }
  for (const ship of data.battleships) {
    for (const id of ship.weaponIds ?? []) if (!weaponsById[id]) issues.push(`${ship.id}: 不明な艦載武装 ${id}`);
  }
  const skillSources = [
    ...data.mobileSuits.flatMap((item) => item.specials ?? []),
    ...data.weapons.flatMap((item) => item.specials ?? []),
    ...data.characters.flatMap((item) => item.specials ?? []),
    ...(data.options ?? []).map((item) => item.grantsSkill).filter(Boolean)
  ];
  for (const id of unique(skillSources)) if (!skillsById[id]) issues.push(`スキル定義なし: ${id}`);
  return issues;
}

function stageRows() {
  const ms = Object.fromEntries(data.mobileSuits.map((item) => [item.id, item]));
  const ships = Object.fromEntries(data.battleships.map((item) => [item.id, item]));
  const characters = Object.fromEntries(data.characters.map((item) => [item.id, item]));
  const options = Object.fromEntries((data.options ?? []).map((item) => [item.id, item]));
  return (data.campaign?.stages ?? []).map((stage) => {
    const entries = Object.values(stage.enemyFormations ?? {}).flat();
    const unitCost = entries.reduce((sum, entry) => sum
      + number(ms[entry.msId]?.cost)
      + (entry.characterIds ?? []).reduce((value, id) => value + number(characters[id]?.cost), 0)
      + (entry.weaponIds ?? []).reduce((value, id) => value + number(weaponsById[id]?.cost), 0)
      + (entry.optionIds ?? []).reduce((value, id) => value + number(options[id]?.cost), 0), 0);
    const bridgeCost = number(characters[stage.enemyCaptainId]?.cost) + number(characters[stage.enemyFirstOfficerId]?.cost);
    const enemyCost = unitCost + number(ships[stage.enemyBattleshipId]?.cost) + bridgeCost;
    const margin = Math.max(80, Math.ceil(enemyCost * 0.15));
    const cap = Number.isFinite(stage.costCap) ? stage.costCap : Math.ceil((enemyCost + margin) / 10) * 10;
    return { mapId: stage.mapId, enemyCost, costCap: cap, margin: cap - enemyCost };
  });
}

function markdownTable(headers, rows) {
  const escape = (value) => String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
  return [`| ${headers.map(escape).join(" | ")} |`, `| ${headers.map(() => "---").join(" | ")} |`, ...rows.map((row) => `| ${row.map(escape).join(" | ")} |`)].join("\n");
}

function buildReport() {
  collectWarnings();
  const integrity = integrityChecks();
  const severityOrder = { high: 0, medium: 1, info: 2 };
  warnings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity] || a.category.localeCompare(b.category) || a.name.localeCompare(b.name, "ja"));
  const topMs = data.mobileSuits.map((ms) => ({
    ms,
    fixed: fixedAttackCount(ms),
    potential: potentialAttackCount(ms),
    efficiency: msRawScore(ms) / Math.max(1, number(ms.cost))
  })).sort((a, b) => b.potential - a.potential || b.efficiency - a.efficiency).slice(0, 25);
  const topWeapons = data.weapons.filter((weapon) => number(weapon.cost) > 0 && number(weapon.power) > 0 && !weapon.fixedOnly)
    .map((weapon) => ({ weapon, expected: weaponExpectedDamage(weapon), efficiency: weaponEfficiency(weapon) }))
    .sort((a, b) => b.efficiency - a.efficiency).slice(0, 25);
  const report = {
    generatedAt: new Date().toISOString(),
    source: DATA_PATHS.filter(fs.existsSync).map((dataPath) => path.relative(ROOT, dataPath).replaceAll("\\", "/")).join(" + "),
    counts: {
      mobileSuits: data.mobileSuits.length,
      battleships: data.battleships.length,
      weapons: data.weapons.length,
      characters: data.characters.length,
      options: (data.options ?? []).length,
      skills: (data.skills ?? []).length
    },
    integrity,
    stages: stageRows(),
    warnings,
    topMs: topMs.map(({ ms, fixed, potential, efficiency }) => ({ id: ms.id, name: ms.name, cost: ms.cost, fixedAttacks: fixed, potentialAttacks: potential, simpleEfficiency: Number(efficiency.toFixed(2)) })),
    topWeapons: topWeapons.map(({ weapon, expected, efficiency }) => ({ id: weapon.id, name: weapon.name, cost: weapon.cost, expectedBaseDamage: Number(expected.toFixed(1)), simpleEfficiency: Number(efficiency.toFixed(2)) }))
  };
  return report;
}

function reportToMarkdown(report) {
  const warningCounts = Object.fromEntries(["high", "medium", "info"].map((level) => [level, report.warnings.filter((item) => item.severity === level).length]));
  const sections = [
    "# カードバランス自動診断",
    "",
    `生成: ${report.generatedAt} / 参照: \`${report.source}\``,
    "",
    "> このレポートは再確認候補を絞るための静的診断です。実戦での強弱を断定するものではありません。",
    "",
    "## サマリー",
    "",
    markdownTable(["機体", "戦艦", "武器", "キャラ", "OP", "スキル"], [[report.counts.mobileSuits, report.counts.battleships, report.counts.weapons, report.counts.characters, report.counts.options, report.counts.skills]]),
    "",
    `警告候補: high ${warningCounts.high} / medium ${warningCounts.medium} / info ${warningCounts.info}`,
    "",
    "## データ整合性",
    "",
    report.integrity.length ? report.integrity.map((item) => `- ${item}`).join("\n") : "問題は見つかりませんでした。",
    "",
    "## 優先確認候補",
    "",
    markdownTable(["重要度", "分類", "カード", "指摘", "根拠"], report.warnings.filter((item) => item.severity !== "info").map((item) => [item.severity, item.category, `${item.name} (${item.id})`, item.message, JSON.stringify(item.evidence)])),
    "",
    "## 最大攻撃回数候補",
    "",
    markdownTable(["機体", "コスト", "固定攻撃", "装備込み最大", "簡易性能/コスト"], report.topMs.map((item) => [`${item.name} (${item.id})`, item.cost, item.fixedAttacks, item.potentialAttacks, item.simpleEfficiency])),
    "",
    "## 携行武器の基礎期待値/コスト 上位",
    "",
    markdownTable(["武器", "コスト", "威力×命中", "簡易効率"], report.topWeapons.map((item) => [`${item.name} (${item.id})`, item.cost, item.expectedBaseDamage, item.simpleEfficiency])),
    "",
    "## ステージコスト",
    "",
    markdownTable(["マップ", "敵総コスト", "出撃上限", "余裕"], report.stages.map((item) => [item.mapId, item.enemyCost, item.costCap, item.margin])),
    "",
    "## 指標メモ",
    "",
    "- 最大攻撃回数候補 = 攻撃可能な固定・付属武装数 + 装備枠数。現行の各武装1回/ターンを前提にしています。",
    "- 機体の簡易性能は装甲、EN、運動性、移動、装備枠、固定攻撃、スキル数を合成した比較用指標です。",
    "- 武器効率は威力×命中率×射程幅補正÷コストです。弾数、EN事情、特殊効果、地形は最終判断で別途確認します。",
    "- high/mediumはルールとの相互作用、infoは上下10%の統計的外れ値です。"
  ];
  return sections.join("\n");
}

function parseArgs(args) {
  const parsed = { json: false, output: "" };
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--json") parsed.json = true;
    else if (args[index] === "--output") parsed.output = args[++index] ?? "";
    else if (args[index] === "--help") parsed.help = true;
    else throw new Error(`Unknown argument: ${args[index]}`);
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
