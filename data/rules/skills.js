"use strict";

// Skill definitions shown by cards and used by rules.
window.GAME_DATA = window.GAME_DATA ?? {};
window.GAME_DATA.skills = [
  {
    "id": "ace",
    "name": "エース",
    "type": "キャラ",
    "timing": "攻撃時",
    "effect": "MS搭乗時、与ダメージ+10。",
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
    "type": "機体/武器/OP",
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
    "id": "educationalComputer",
    "name": "教育型コンピューター",
    "type": "OP",
    "timing": "自軍ターン開始時",
    "effect": "ターン開始ごとに戦闘データを蓄積し、命中・回避+1。最大+9。",
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
    "timing": "行動時/攻撃後",
    "effect": "行動として自機周辺、または攻撃後に対象周辺へ、踏むと35ダメージを受ける機雷を最大3個置く。",
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
  }
];
