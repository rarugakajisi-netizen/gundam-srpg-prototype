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
    "id": "supplyOperation",
    "name": "補給作戦",
    "cost": 35,
    "effectType": "mobility",
    "value": -1,
    "grantsSkill": "frontlineSupply",
    "effectText": "前線補給機能を得る。補給物資を積むため移動力-1。",
    "uniqueSkill": true,
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
    "id": "massProductionModernizationPlan",
    "name": "量産機近代化改修計画",
    "cost": 300,
    "effectType": "skill",
    "grantsSkill": "massProductionModernization",
    "effectText": "基礎コスト150以下の機体のみ装備可。同一機体が3マス以内にいる間、自身と範囲内の同一機体は命中+6、回避+5、与ダメージ+12、被ダメージ-10、移動+1。",
    "maxMsCost": 150,
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
    "effectText": "偵察スキルを付与する。通信に応じた索敵範囲内の隠密を看破し、味方全体が詳細確認と射撃を行える。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "priorityTargetDesignation",
    "name": "優先目標指示",
    "cost": 55,
    "effectType": "skill",
    "grantsSkill": "priorityTargetDesignation",
    "effectText": "未移動時、指揮に応じた範囲内の可視敵1機をターン中の優先目標に指定する。使用者は移動不能になるが攻撃でき、味方全体は指定対象への命中+8。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "precisionAttackControl",
    "name": "精密攻撃管制",
    "cost": 50,
    "effectType": "skill",
    "grantsSkill": "precisionAttackControl",
    "effectText": "1ターンに1回しか攻撃できない代わりに、その攻撃の命中+12、与ダメージ+10。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "emergencyRepair",
    "name": "緊急修理",
    "cost": 45,
    "effectType": "skill",
    "grantsSkill": "emergencyRepair",
    "effectText": "1戦闘に1回、行動として自機の装甲を「30＋整備×2」回復する。最大装甲の20%が上限。EN・弾薬・盾は回復しない。",
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
    "effectText": "1戦闘に1回、行動として煙幕を展開して看破状態を上書きする。発動ターン中は偵察圏内でも隠密になるが、次の自軍ターン開始時にも圏内なら解除される。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "barricadePlacement",
    "name": "バリケード設置",
    "cost": 45,
    "effectType": "skill",
    "grantsSkill": "barricadePlacement",
    "effectText": "1戦闘に1回、未移動時に行動として前方1マスへ耐久100の破壊可能な障害物を設置する。移動と通常射撃の射線を遮る。",
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
    "effectText": "自軍ターン開始ごとに命中・回避補正が+1される。命中は最大+9、回避は最大+6。",
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
  },
  {
    "id": "haro",
    "name": "ハロ",
    "cost": 40,
    "effectType": "skill",
    "grantsSkill": "haroSupport",
    "effectText": "パイロットの反応補助として、MS搭乗時の回避+4。",
    "uniqueSkill": true,
    "factions": [
      "federation"
    ],
    "imagePath": ""
  },
  {
    "id": "katzLetzKikka",
    "name": "カツ・レツ・キッカ",
    "cost": 40,
    "effectType": "skill",
    "grantsSkill": "innocentPresence",
    "effectText": "攻撃してきた敵の命中-4、与ダメージ-5。子どもたちを戦場で見た動揺を表現する防御寄りOP。",
    "uniqueSkill": true,
    "factions": [
      "federation"
    ],
    "imagePath": ""
  },
  {
    "id": "forcedMarchOption",
    "name": "強行軍",
    "cost": 50,
    "effectType": "skill",
    "grantsSkill": "forcedMarch",
    "effectText": "味方全体の与ダメージ+10、被ダメージ+12。攻勢用のリスク付き作戦OP。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "zenaAndMineva",
    "name": "ゼナ＆ミネバ",
    "cost": 45,
    "effectType": "skill",
    "grantsSkill": "guardedPersons",
    "effectText": "被ダメージ-10。代わりに自分の与ダメージ-8。要警護人物を守る慎重な運用を表現する。",
    "uniqueSkill": true,
    "factions": [
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "miharuIntel",
    "name": "ミハル・ラトキエ",
    "cost": 45,
    "effectType": "skill",
    "grantsSkill": "infiltrationIntel",
    "effectText": "戦闘開始時、現在隠密中で最もコストの高い敵MS1機を看破する。戦闘中に隠密を再発動されると上書きされる。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "iserinaResolve",
    "name": "イセリナ・エッシェンバッハ",
    "cost": 35,
    "effectType": "skill",
    "grantsSkill": "mourningResolve",
    "effectText": "味方MSが撃破済みなら命中+5、回避-4。弔いの決意を攻勢寄りに表現する。",
    "uniqueSkill": true,
    "factions": [
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "camranSupport",
    "name": "カムラン・ブルーム",
    "cost": 50,
    "effectType": "skill",
    "grantsSkill": "breakthroughSupport",
    "effectText": "自軍にこのスキル持ちがいる間、装甲が最大値の3分の1以下の味方MSは移動+1。",
    "uniqueSkill": true,
    "factions": [
      "federation"
    ],
    "imagePath": ""
  },
  {
    "id": "dodaiYs",
    "name": "ド・ダイYS",
    "cost": 85,
    "effectType": "vehicle",
    "grantsSkill": "subFlightSystem",
    "allowsAirDeployment": true,
    "effectText": "移動力+2。効果中は格闘武器不可。通常マップでは被ダメージまたは任意切り離しで効果を失う。空中マップでは被弾解除されず、飛行維持中は切り離せない。ミサイルを追加する。",
    "value": 2,
    "forbidsMelee": true,
    "mapTypes": [
      "ground"
    ],
    "weaponIds": [
      "dodaiYsMissile"
    ],
    "uniqueSkill": true,
    "factions": [
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "dodai2",
    "name": "ド・ダイII",
    "cost": 50,
    "effectType": "vehicle",
    "grantsSkill": "subFlightSystem",
    "allowsAirDeployment": true,
    "effectText": "移動力+2。効果中は格闘武器不可。通常マップでは被ダメージまたは任意切り離しで効果を失う。空中マップでは被弾解除されず、飛行維持中は切り離せない。武装なしの運搬専門。",
    "value": 2,
    "forbidsMelee": true,
    "uniqueSkill": true,
    "factions": [
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "rivalryOption",
    "name": "対抗心",
    "cost": 45,
    "effectType": "skill",
    "grantsSkill": "rivalry",
    "effectText": "攻撃対象のユニット総コストが自分より高い時、与ダメージ+12。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "alfredIzuruha",
    "name": "アルフレッド・イズルハ",
    "cost": 50,
    "effectType": "skill",
    "grantsSkill": "enemyIntel",
    "effectText": "最初の敵ターンのみ、相手全体の命中-8。敵情を伝えて初動を乱すジオン専用OP。",
    "uniqueSkill": true,
    "factions": [
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "examSystemOption",
    "name": "EXAMシステム",
    "cost": 105,
    "effectType": "skill",
    "grantsSkill": "examSystem",
    "effectText": "耐久3分の1以下、または敵ニュータイプとの戦闘で発動。命中・回避+18、与ダメージ+15。発動後3ターンで自動撤退する。",
    "uniqueSkill": true,
    "factions": [
      "federation",
      "zeon"
    ],
    "imagePath": ""
  },
  {
    "id": "fellowBooster",
    "name": "フェロウ・ブースター",
    "cost": 90,
    "effectType": "vehicle",
    "grantsSkill": "subFlightSystem",
    "effectText": "宇宙専用SFS。移動力+2。効果中は格闘武器不可。被ダメージまたは任意切り離しで効果を失う。ミサイルを追加する。",
    "value": 2,
    "forbidsMelee": true,
    "mapTypes": [
      "space"
    ],
    "weaponIds": [
      "fellowBoosterMissile"
    ],
    "uniqueSkill": true,
    "factions": [
      "federation"
    ],
    "imagePath": ""
  },
  {
    "id": "corvetteBooster",
    "name": "コルベット・ブースター",
    "cost": 90,
    "effectType": "vehicle",
    "grantsSkill": "subFlightSystem",
    "allowsAirDeployment": true,
    "effectText": "地上・空中用の飛行SFS。移動力+2。効果中は格闘武器不可。通常マップでは被ダメージまたは任意切り離しで効果を失う。空中マップでは被弾解除されず、飛行維持中は切り離せない。ミサイルを追加する。",
    "value": 2,
    "forbidsMelee": true,
    "mapTypes": [
      "ground"
    ],
    "weaponIds": [
      "corvetteBoosterMissile"
    ],
    "uniqueSkill": true,
    "factions": [
      "federation"
    ],
    "imagePath": ""
  },
  {
    "id": "lightLiner",
    "name": "ライトライナー",
    "cost": 35,
    "effectType": "mobility",
    "allowsAirDeployment": true,
    "value": 1,
    "effectText": "地上・空中用の簡易飛行SFS。移動力+1。空中マップでは搭乗機と耐久を共有し、飛行維持中は解除できない。武装なしの安価な支援装備。",
    "mapTypes": [
      "ground"
    ],
    "factions": [
      "federation"
    ],
    "imagePath": ""
  },
  {
    "id": "bustliner",
    "name": "バストライナー",
    "cost": 95,
    "effectType": "vehicle",
    "grantsSkill": "subFlightSystem",
    "effectText": "移動砲台系SFS。移動力-1。効果中は格闘武器不可。被ダメージまたは任意切り離しで効果を失う。強力なメガ粒子砲を追加する。",
    "value": -1,
    "forbidsMelee": true,
    "weaponIds": [
      "bustlinerMegaParticleCannon"
    ],
    "uniqueSkill": true,
    "factions": [
      "federation"
    ],
    "imagePath": ""
  },
  {
    "id": "skiure",
    "name": "スキウレ",
    "cost": 90,
    "effectType": "vehicle",
    "grantsSkill": "subFlightSystem",
    "effectText": "ジオン専用の移動砲台。移動力-1。効果中は格闘武器不可。被ダメージまたは任意切り離しで効果を失う。機体出力に依存しないメガ粒子砲を追加する。",
    "value": -1,
    "forbidsMelee": true,
    "weaponIds": [
      "skiureMegaParticleCannon"
    ],
    "uniqueSkill": true,
    "factions": [
      "zeon"
    ],
    "imagePath": ""
  }
];
