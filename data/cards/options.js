"use strict";

// Option part cards.
window.GAME_DATA = window.GAME_DATA ?? {};
window.GAME_DATA.options = [
  {
    "id": "spareMagazine",
    "name": "予備弾倉",
    "cost": 25,
    "effectType": "ammo",
    "grantsSkill": "spareMagazine",
    "effectText": "実弾兵器の最大弾数+2。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "externalGenerator",
    "name": "外部ジェネレーター",
    "cost": 45,
    "effectType": "energy",
    "grantsSkill": "externalGenerator",
    "effectText": "機体EN+25。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "optionArmor",
    "name": "オプションアーマー",
    "cost": 40,
    "effectType": "defense-ammo",
    "grantsSkill": "optionArmor",
    "effectText": "実弾による被ダメージ-15。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "antiBeamCoatingOption",
    "name": "耐ビームコーティング",
    "cost": 40,
    "effectType": "defense-beam",
    "grantsSkill": "antiBeamCoating",
    "effectText": "ビームによる被ダメージ-15。同名効果とは重複しない。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "impactDiffusionArmor",
    "name": "衝撃拡散装甲",
    "cost": 35,
    "effectType": "defense-melee",
    "grantsSkill": "impactDiffusionArmor",
    "effectText": "格闘による被ダメージ-15。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "longRangeScope",
    "name": "ロングレンジスコープ",
    "cost": 55,
    "effectType": "range",
    "grantsSkill": "longRangeScope",
    "effectText": "射撃武装の最大射程+1。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "optionBooster",
    "name": "オプションブースター",
    "cost": 60,
    "effectType": "mobility",
    "value": 1,
    "effectText": "移動力+1。",
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "guerrillaTacticsOption",
    "name": "ゲリラ作戦",
    "cost": 55,
    "effectType": "skill",
    "grantsSkill": "guerrillaTactics",
    "effectText": "砂漠・森林・水・デブリ上にいる時、敵から2マス以内に近づかれるまで射撃武装の対象にならない。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "aiSenshiOption",
    "name": "哀・戦士",
    "cost": 55,
    "effectType": "skill",
    "grantsSkill": "aiSenshi",
    "effectText": "味方MSが撃墜済みなら、与ダメージ+15、被ダメージ-10。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "barrageSupportOption",
    "name": "弾幕支援",
    "cost": 60,
    "effectType": "skill",
    "grantsSkill": "barrageSupport",
    "effectText": "3マス以内の敵の回避率-8。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "stealthSystem",
    "name": "ステルス機構",
    "cost": 55,
    "effectType": "skill",
    "grantsSkill": "stealth",
    "effectText": "移動または攻撃を行うまで敵に狙われにくい。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "iFieldGenerator",
    "name": "Iフィールド発生装置",
    "cost": 85,
    "effectType": "skill",
    "grantsSkill": "iField",
    "effectText": "EN30を消費してビーム攻撃の被ダメージを半減する。高コストの防御OP。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "guardMissionOption",
    "name": "護衛任務",
    "cost": 45,
    "effectType": "skill",
    "grantsSkill": "guardMission",
    "effectText": "後方の味方を守る護衛向けスキルを付与する。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "massProductionFormationOption",
    "name": "量産機部隊の編成",
    "cost": 50,
    "effectType": "skill",
    "grantsSkill": "massProductionFormation",
    "effectText": "同じ量産機を複数並べる編成向けスキルを付与する。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "highPerformanceRadar",
    "name": "高性能レーダー",
    "cost": 35,
    "effectType": "skill",
    "grantsSkill": "recon",
    "effectText": "偵察スキルを付与する。隠密や敵情報表示の拡張用。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "enhancedWarheadOption",
    "name": "強化弾頭",
    "cost": 55,
    "effectType": "skill",
    "grantsSkill": "enhancedWarhead",
    "effectText": "実弾武器の与ダメージ+12。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "highOutputGeneratorOption",
    "name": "高出力ジェネレーター",
    "cost": 60,
    "effectType": "skill",
    "grantsSkill": "highOutputGenerator",
    "effectText": "ビーム武器の与ダメージ+12。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "precisionMeleeProgramOption",
    "name": "高精度格闘プログラム",
    "cost": 55,
    "effectType": "skill",
    "grantsSkill": "precisionMeleeProgram",
    "effectText": "格闘武器の与ダメージ+12。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "smokeDischargerOption",
    "name": "スモークディスチャージャー",
    "cost": 50,
    "effectType": "skill",
    "grantsSkill": "smokeDischarger",
    "effectText": "行動として煙幕を展開し、短時間射撃対象から外れやすくなる。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "educationalComputer",
    "name": "教育型コンピューター",
    "cost": 70,
    "effectType": "skill",
    "grantsSkill": "educationalComputer",
    "effectText": "自軍ターン開始ごとに命中・回避補正が+1される。最大+9。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "stationaryInterception",
    "name": "定置迎撃",
    "cost": 45,
    "effectType": "skill",
    "grantsSkill": "stationaryInterception",
    "effectText": "移動せずに攻撃する時、命中+8。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "highPerformanceSightOption",
    "name": "高性能照準器",
    "cost": 45,
    "effectType": "skill",
    "grantsSkill": "highPerformanceSight",
    "effectText": "距離4以上から射撃武器で攻撃する時、命中+8。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "stopMovementOperation",
    "name": "足止め作戦",
    "cost": 50,
    "effectType": "skill",
    "grantsSkill": "stopMovement",
    "effectText": "2マス以内にいる敵MSの移動力-1。重複しない。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  }
];
