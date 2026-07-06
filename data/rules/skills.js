"use strict";

// Skill definitions shown by cards and used by rules.
window.GAME_DATA = window.GAME_DATA ?? {};
window.GAME_DATA.skills = [
  {
    "id": "ace",
    "name": "エース",
    "type": "キャラ",
    "timing": "攻撃時",
    "effect": "適性機体に搭乗して攻撃する時、与ダメージ+10。",
    "implemented": true
  },
  {
    "id": "desperateRearGuard",
    "name": "決死の殿軍",
    "type": "キャラ",
    "timing": "味方撃破後/戦艦損傷時",
    "effect": "自機以外の味方ユニットが撃破済み、かつ味方戦艦の耐久力が半分以下の時、与ダメージ+20、被ダメージ-15。戦艦以外に搭乗中は、撃破済み味方の判定から戦艦を除く。",
    "implemented": true
  },
  {
    "id": "coreSystem",
    "name": "脱出機能",
    "type": "機体",
    "timing": "撃破時",
    "effect": "一度だけ、機体ごとに設定された脱出先へ移行して戦場に残る。",
    "implemented": true
  },
  {
    "id": "additionalArmor",
    "name": "増加装甲",
    "type": "機体",
    "timing": "被撃破時/任意",
    "effect": "装甲が破壊された時、または任意パージ時に、機体ごとに設定されたパージ先へ移行して戦闘を継続する。",
    "implemented": true
  },
  {
    "id": "commanderCustom",
    "name": "指揮官機",
    "type": "機体",
    "timing": "攻撃時",
    "effect": "自機の命中+3。2マス以内の味方MSにも命中+3を与える。",
    "implemented": true
  },
  {
    "id": "iField",
    "name": "Iフィールド",
    "type": "機体",
    "timing": "被弾時",
    "effect": "EN30を消費してビーム攻撃の被ダメージを半減する。EN不足時は発動しない。",
    "implemented": true
  },
  {
    "id": "aiSenshi",
    "name": "哀・戦士",
    "type": "キャラ/OP",
    "timing": "味方MS撃破後",
    "effect": "味方MSが撃破済みなら、与ダメージ+15、被ダメージ-10。",
    "implemented": true
  },
  {
    "id": "barrageSupport",
    "name": "弾幕支援",
    "type": "キャラ/OP",
    "timing": "味方攻撃時",
    "effect": "このスキル持ちが敵から3マス以内にいると、その敵の回避率-8。",
    "implemented": true
  },
  {
    "id": "guerrillaTactics",
    "name": "ゲリラ戦術",
    "type": "キャラ/OP",
    "timing": "特殊地形で被射撃時",
    "effect": "砂漠・森林・水・デブリ上にいる時、敵から2マス以内に近づかれるまで射撃武装の対象にならない。",
    "implemented": true
  },
  {
    "id": "antiBeamCoating",
    "name": "耐ビームコーティング",
    "type": "武器/OP",
    "timing": "被弾時",
    "effect": "ビーム攻撃の被ダメージ-15。盾に付いている場合も有効。",
    "implemented": true
  },
  {
    "id": "spareMagazine",
    "name": "予備弾倉",
    "type": "OP",
    "timing": "出撃時",
    "effect": "実弾武器の最大弾数+2。",
    "implemented": true
  },
  {
    "id": "externalGenerator",
    "name": "外部ジェネレーター",
    "type": "OP",
    "timing": "編成/出撃時",
    "effect": "機体EN+25。",
    "implemented": true
  },
  {
    "id": "optionArmor",
    "name": "オプションアーマー",
    "type": "OP",
    "timing": "被弾時",
    "effect": "実弾攻撃の被ダメージ-15。",
    "implemented": true
  },
  {
    "id": "impactDiffusionArmor",
    "name": "衝撃拡散装甲",
    "type": "OP",
    "timing": "被弾時",
    "effect": "格闘攻撃の被ダメージ-15。",
    "implemented": true
  },
  {
    "id": "longRangeScope",
    "name": "ロングレンジスコープ",
    "type": "機体/OP",
    "timing": "攻撃時",
    "effect": "射撃武装の最大射程+1。",
    "implemented": true
  },
  {
    "id": "stealth",
    "name": "ステルス",
    "type": "機体/OP",
    "timing": "戦闘開始から初回行動まで",
    "effect": "移動または攻撃を行うまで、3マス以上離れた敵の射撃対象にならない。偵察持ちや2マス以内の敵には見破られる。",
    "implemented": true
  },
  {
    "id": "recon",
    "name": "偵察",
    "type": "機体/OP",
    "timing": "常時",
    "effect": "ステルスやゲリラ戦術による隠密を見破る。",
    "implemented": true
  },
  {
    "id": "antiSubmarine",
    "name": "対水中",
    "type": "機体/武器",
    "timing": "攻撃時",
    "effect": "水中にいる敵へのダメージ+20。",
    "implemented": true
  },
  {
    "id": "aquaticCombatAdaptation",
    "name": "水中戦適応",
    "type": "キャラ",
    "timing": "水中マス上",
    "effect": "MS搭乗時、自分が水中マスにいる間、命中・回避+6。",
    "implemented": true
  },
  {
    "id": "beamDisruption",
    "name": "ビーム撹乱幕",
    "type": "機体/武器",
    "timing": "攻撃後",
    "effect": "攻撃した敵のビーム武器威力-25。短時間で解除。",
    "implemented": true
  },
  {
    "id": "sacrificialBoost",
    "name": "命を賭して……",
    "type": "キャラ",
    "timing": "自身のMS撃破時",
    "effect": "このスキルを持つパイロット搭乗MSが撃破された時、以後その陣営の味方全体の与ダメージ+12。戦艦搭乗時は発動しない。",
    "implemented": true
  },
  {
    "id": "outstandingTalent",
    "name": "突出した才能",
    "type": "キャラ",
    "timing": "攻撃時",
    "effect": "自軍MSの中で最前線にいる時、与ダメージ+12。",
    "implemented": true
  },
  {
    "id": "gundamPassion",
    "name": "ガンダムへの情熱",
    "type": "キャラ",
    "timing": "ターン終了時",
    "effect": "隣接するガンダム系機体の装甲+20、EN+10。",
    "implemented": true
  },
  {
    "id": "zakuPassion",
    "name": "ザクへの情熱",
    "type": "キャラ",
    "timing": "ターン終了時",
    "effect": "隣接するザク系機体の装甲+20、EN+10。",
    "implemented": true
  },
  {
    "id": "panic",
    "name": "狼狽",
    "type": "キャラ",
    "timing": "常時",
    "effect": "攻撃時の命中-8。低コスト化の代償として使う。",
    "implemented": true
  },
  {
    "id": "teamwork",
    "name": "チームワーク",
    "type": "キャラ",
    "timing": "攻撃時",
    "effect": "2マス以内に味方MSがいると命中+5、与ダメージ+8。",
    "implemented": true
  },
  {
    "id": "guardMission",
    "name": "護衛任務",
    "type": "キャラ/OP",
    "timing": "味方被弾時",
    "effect": "隣接する味方を前方から護衛し、被ダメージ-10。",
    "implemented": true
  },
  {
    "id": "massProductionFormation",
    "name": "量産機部隊の編成",
    "type": "キャラ/OP",
    "timing": "常時",
    "effect": "MS搭乗時、または戦艦乗員として指揮している時、自軍MSは3マス以内に同じ機体がいると命中+4、与ダメージ+8、被ダメージ-8。",
    "implemented": true
  },
  {
    "id": "enhancedWarhead",
    "name": "強化弾頭",
    "type": "OP",
    "timing": "攻撃時",
    "effect": "実弾武器の与ダメージ+12。",
    "implemented": true
  },
  {
    "id": "highOutputGenerator",
    "name": "高出力ジェネレーター",
    "type": "OP",
    "timing": "攻撃時",
    "effect": "ビーム武器の与ダメージ+12。",
    "implemented": true
  },
  {
    "id": "precisionMeleeProgram",
    "name": "高精度格闘プログラム",
    "type": "OP",
    "timing": "攻撃時",
    "effect": "格闘武器の与ダメージ+12。",
    "implemented": true
  },
  {
    "id": "smokeDischarger",
    "name": "スモークディスチャージャー",
    "type": "機体/OP",
    "timing": "行動時",
    "effect": "行動として発動し、2ターンの間、偵察を持たない敵の射撃対象にならない。",
    "implemented": true
  },
  {
    "id": "antiAir",
    "name": "対空中",
    "type": "武器",
    "timing": "攻撃時",
    "effect": "飛行ユニットへの与ダメージ+18。",
    "implemented": true
  },
  {
    "id": "antiDesert",
    "name": "対砂漠",
    "type": "武器",
    "timing": "攻撃時",
    "effect": "砂漠マスにいる敵への与ダメージ+18。",
    "implemented": true
  },
  {
    "id": "educationalComputer",
    "name": "教育型コンピューター",
    "type": "OP",
    "timing": "自軍ターン開始時",
    "effect": "ターン開始ごとに戦闘データを蓄積し、命中・回避+1。命中は最大+9、回避は最大+6。",
    "implemented": true
  },
  {
    "id": "stationaryInterception",
    "name": "定置迎撃",
    "type": "機体/OP",
    "timing": "攻撃時",
    "effect": "移動せずに攻撃する時、命中+8。",
    "implemented": true
  },
  {
    "id": "freezyYard",
    "name": "フリージーヤード",
    "type": "機体",
    "timing": "行動時",
    "effect": "行動として発動し、2ターンの間、実弾攻撃の被ダメージ-45。",
    "implemented": true
  },
  {
    "id": "mineScatter",
    "name": "機雷散布",
    "type": "武器",
    "timing": "行動時",
    "effect": "行動として自機周辺へ、踏むと35ダメージを受ける機雷を最大3個置く。攻撃後散布は対応フラグを持つ武器のみ発動する。",
    "implemented": true
  },
  {
    "id": "highPerformanceSight",
    "name": "高性能照準器",
    "type": "機体/OP",
    "timing": "攻撃時",
    "effect": "距離4以上から射撃武器で攻撃する時、命中+8。",
    "implemented": true
  },
  {
    "id": "allyBackup",
    "name": "味方援護",
    "type": "キャラ",
    "timing": "攻撃時",
    "effect": "自機より前方に味方がいる時、命中+6。",
    "implemented": true
  },
  {
    "id": "sandAmbush",
    "name": "砂塵の伏兵",
    "type": "キャラ",
    "timing": "攻撃時",
    "effect": "砂漠マスから攻撃する時、与ダメージ+12。",
    "implemented": true
  },
  {
    "id": "stopMovement",
    "name": "足止め作戦",
    "type": "キャラ/OP",
    "timing": "常時",
    "effect": "2マス以内にいる敵MSの移動力-1。重複しない。",
    "implemented": true
  },
  {
    "id": "jinx",
    "name": "ジンクス",
    "type": "キャラ",
    "timing": "常時",
    "effect": "2マス以内にいる自分以外の味方MSの回避-6。",
    "implemented": true
  },
  {
    "id": "retreatSupport",
    "name": "撤退支援",
    "type": "キャラ",
    "timing": "常時",
    "effect": "このスキル持ちが自軍にいる間、装甲が最大値の3分の1以下の味方MSは回避+10。",
    "implemented": true
  },
  {
    "id": "madness",
    "name": "狂気",
    "type": "キャラ",
    "timing": "攻撃時",
    "effect": "同じターンに同じ敵を攻撃する場合、2回目以降の与ダメージ+15。",
    "implemented": true
  },
  {
    "id": "pilotSupply",
    "name": "パイロットへの補給",
    "type": "キャラ",
    "timing": "戦艦隣接時",
    "effect": "このスキル持ちが乗る味方戦艦に隣接している味方MSは、命中・回避+5。",
    "implemented": true
  },
  {
    "id": "internalAudit",
    "name": "内部監査",
    "type": "キャラ",
    "timing": "常時",
    "effect": "このスキル持ちから2マス以内にいる味方MSの回避+4。",
    "implemented": true
  },
  {
    "id": "scheming",
    "name": "策謀",
    "type": "キャラ",
    "timing": "味方接近時",
    "effect": "2マス以内に味方ユニットがいる間、自分だけ命中・回避+6。",
    "implemented": true
  },
  {
    "id": "forcedMarch",
    "name": "強行軍",
    "type": "キャラ/OP",
    "timing": "常時",
    "effect": "このスキル持ちが自軍にいる間、味方全体の与ダメージ+10、被ダメージ+12。",
    "implemented": true
  },
  {
    "id": "haroSupport",
    "name": "ハロのサポート",
    "type": "OP",
    "timing": "常時",
    "effect": "MS搭乗時、回避+4。",
    "implemented": true
  },
  {
    "id": "innocentPresence",
    "name": "無垢な存在",
    "type": "OP",
    "timing": "被攻撃時",
    "effect": "攻撃してきた敵の命中-4、与ダメージ-5。",
    "implemented": true
  },
  {
    "id": "guardedPersons",
    "name": "要警護人物",
    "type": "OP",
    "timing": "常時",
    "effect": "被ダメージ-10。代わりに自分の与ダメージ-8。",
    "implemented": true
  },
  {
    "id": "infiltrationIntel",
    "name": "潜入情報",
    "type": "OP",
    "timing": "戦闘開始時",
    "effect": "敵MS1機のステルス、ゲリラ戦術、煙幕などの隠密系効果をこの戦闘中無効化する。",
    "implemented": true
  },
  {
    "id": "peaceWill",
    "name": "講和の意志",
    "type": "キャラ",
    "timing": "常時",
    "effect": "自軍MSが最大装甲の3分の1以下の時、被ダメージ-8。代わりに自軍全体の与ダメージ-4。",
    "implemented": true
  },
  {
    "id": "mourningResolve",
    "name": "弔いの決意",
    "type": "OP",
    "timing": "味方MS撃破後",
    "effect": "味方MSが撃破済みなら命中+5、回避-4。",
    "implemented": true
  },
  {
    "id": "breakthroughSupport",
    "name": "突破支援",
    "type": "OP",
    "timing": "常時",
    "effect": "自軍にこのスキル持ちがいる間、装甲が最大値の3分の1以下の味方MSは移動+1。",
    "implemented": true
  },
  {
    "id": "spyConduct",
    "name": "スパイ行為",
    "type": "キャラ",
    "timing": "戦闘開始時",
    "effect": "敵MS1機に初期ステルスを与えてしまう。低コスト化の代償として使う。",
    "implemented": true
  },
  {
    "id": "marineSpaceSupport",
    "name": "水中・宇宙援護",
    "type": "キャラ",
    "timing": "常時",
    "effect": "水中適性機体、潜水艦、宇宙専用MSの命中・回避+5。",
    "implemented": true
  },
  {
    "id": "commanderStealth",
    "name": "隊長機潜入支援",
    "type": "キャラ",
    "timing": "戦闘開始時",
    "effect": "味方MS1機に初期ステルスを与える。",
    "implemented": true
  },
  {
    "id": "subFlightSystem",
    "name": "サブフライトシステム",
    "type": "OP",
    "timing": "常時/被弾時",
    "effect": "移動力を大きく上げる。効果中は格闘武器を使えない。被ダメージまたは任意切り離しで効果を失う。",
    "implemented": true
  },
  {
    "id": "rivalry",
    "name": "対抗心",
    "type": "キャラ/OP",
    "timing": "攻撃時",
    "effect": "攻撃対象のユニット総コストが自分より高い時、与ダメージ+12。",
    "implemented": true
  },
  {
    "id": "oldSoldierPride",
    "name": "老兵の意地",
    "type": "キャラ",
    "timing": "攻撃時/被攻撃時",
    "effect": "自機より高コストの敵に攻撃する時、命中+5、与ダメージ+8。被攻撃時、回避-6。",
    "implemented": true
  },
  {
    "id": "enemyIntel",
    "name": "敵情提供",
    "type": "OP",
    "timing": "最初の敵ターン",
    "effect": "最初の敵ターンのみ、相手全体の命中-8。",
    "implemented": true
  },
  {
    "id": "examSystem",
    "name": "EXAMシステム",
    "type": "機体/OP",
    "timing": "耐久低下時/対ニュータイプ戦闘時",
    "effect": "自機の耐久が3分の1以下になった時、または敵ニュータイプと戦闘した時に発動。命中・回避+18、与ダメージ+15。発動後、自軍ターン開始を3回迎えると自動撤退し、撃破扱いになる。",
    "implemented": true
  },
  {
    "id": "hadesSystem",
    "name": "HADES",
    "type": "機体",
    "timing": "耐久低下時",
    "effect": "自機の耐久が3分の1以下になった時に発動。命中・回避+12、与ダメージ+10。発動後、自軍ターン開始を3回迎えると耐久が大きく低下し、EN0になる。",
    "implemented": true
  },
  {
    "id": "phantomSystem",
    "name": "ファントムシステム",
    "type": "機体",
    "timing": "常時",
    "effect": "AIによる自律戦闘補助。MS搭乗者がいなくても命中・回避+10、与ダメージ+8。",
    "implemented": true
  },
  {
    "id": "transform",
    "name": "変形",
    "type": "機体",
    "timing": "行動時",
    "effect": "行動として発動し、機体ごとに設定された変形先へ移行する。変形したターンは移動・攻撃できない。",
    "implemented": true
  }
];
