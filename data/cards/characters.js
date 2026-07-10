"use strict";

// Character cards.
window.GAME_DATA = window.GAME_DATA ?? {};
window.GAME_DATA.characters = [
  {
    "id": "federationSoldier",
    "name": "連邦一般兵",
    "characterKey": "federationSoldier",
    "faction": "federation",
    "selectable": false,
    "cost": 25,
    "shooting": 8,
    "melee": 6,
    "reaction": 7,
    "awakening": 0,
    "command": 2,
    "support": 3,
    "maintenance": 1,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "federationVeteran",
    "name": "連邦ベテラン兵",
    "characterKey": "federationVeteran",
    "faction": "federation",
    "selectable": false,
    "cost": 45,
    "shooting": 12,
    "melee": 8,
    "reaction": 11,
    "awakening": 0,
    "command": 4,
    "support": 5,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "federationOfficer",
    "name": "連邦士官",
    "characterKey": "federationOfficer",
    "faction": "federation",
    "selectable": false,
    "cost": 45,
    "shooting": 9,
    "melee": 6,
    "reaction": 8,
    "awakening": 0,
    "command": 10,
    "support": 8,
    "maintenance": 2,
    "roles": [
      "pilot",
      "captain",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "federationTankCrew",
    "name": "連邦戦車兵",
    "characterKey": "federationTankCrew",
    "faction": "federation",
    "selectable": false,
    "cost": 30,
    "shooting": 10,
    "melee": 4,
    "reaction": 6,
    "awakening": 0,
    "command": 3,
    "support": 4,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "amuro",
    "name": "アムロ・レイ",
    "characterKey": "amuro",
    "faction": "federation",
    "cost": 120,
    "shooting": 20,
    "melee": 16,
    "reaction": 22,
    "awakening": 18,
    "command": 4,
    "support": 6,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "amuroAwakened",
    "name": "アムロ・レイ（覚醒）",
    "characterKey": "amuro",
    "faction": "federation",
    "cost": 170,
    "shooting": 25,
    "melee": 21,
    "reaction": 28,
    "awakening": 28,
    "command": 7,
    "support": 7,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [
      "outstandingTalent"
    ],
    "imagePath": ""
  },
  {
    "id": "kai",
    "name": "カイ・シデン",
    "characterKey": "kai",
    "faction": "federation",
    "cost": 85,
    "shooting": 16,
    "melee": 8,
    "reaction": 13,
    "awakening": 0,
    "command": 5,
    "support": 7,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [
      "aiSenshi"
    ],
    "imagePath": ""
  },
  {
    "id": "hayato",
    "name": "ハヤト・コバヤシ",
    "characterKey": "hayato",
    "faction": "federation",
    "cost": 60,
    "shooting": 15,
    "melee": 9,
    "reaction": 10,
    "awakening": 0,
    "command": 4,
    "support": 6,
    "maintenance": 4,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "shin",
    "name": "シン",
    "characterKey": "shin",
    "faction": "federation",
    "cost": 35,
    "shooting": 9,
    "melee": 7,
    "reaction": 8,
    "awakening": 0,
    "command": 2,
    "support": 4,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "bright",
    "name": "ブライト・ノア",
    "characterKey": "bright",
    "faction": "federation",
    "cost": 90,
    "shooting": 8,
    "melee": 5,
    "reaction": 8,
    "awakening": 0,
    "command": 20,
    "support": 12,
    "maintenance": 2,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "barrageSupport"
    ],
    "imagePath": ""
  },
  {
    "id": "mirai",
    "name": "ミライ・ヤシマ",
    "characterKey": "mirai",
    "faction": "federation",
    "cost": 60,
    "shooting": 6,
    "melee": 4,
    "reaction": 12,
    "awakening": 0,
    "command": 10,
    "support": 18,
    "maintenance": 4,
    "roles": [
      "operator",
      "captain"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "sayla",
    "name": "セイラ・マス",
    "characterKey": "sayla",
    "faction": "federation",
    "cost": 80,
    "shooting": 13,
    "melee": 9,
    "reaction": 15,
    "awakening": 6,
    "command": 9,
    "support": 16,
    "maintenance": 3,
    "roles": [
      "operator",
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "jobJohn",
    "name": "ジョブ・ジョン",
    "characterKey": "jobJohn",
    "faction": "federation",
    "cost": 45,
    "shooting": 9,
    "melee": 5,
    "reaction": 7,
    "awakening": 0,
    "command": 3,
    "support": 8,
    "maintenance": 20,
    "roles": [
      "mechanic",
      "operator",
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "matilda",
    "name": "マチルダ・アジャン",
    "characterKey": "matilda",
    "faction": "federation",
    "cost": 55,
    "shooting": 7,
    "melee": 4,
    "reaction": 9,
    "awakening": 0,
    "command": 14,
    "support": 12,
    "maintenance": 14,
    "roles": [
      "captain",
      "mechanic",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "ryu",
    "name": "リュウ・ホセイ",
    "characterKey": "ryu",
    "faction": "federation",
    "cost": 80,
    "shooting": 13,
    "melee": 13,
    "reaction": 12,
    "awakening": 0,
    "command": 12,
    "support": 10,
    "maintenance": 5,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "sacrificialBoost"
    ],
    "imagePath": ""
  },
  {
    "id": "sleggar",
    "name": "スレッガー・ロウ",
    "characterKey": "sleggar",
    "faction": "federation",
    "cost": 90,
    "shooting": 22,
    "melee": 12,
    "reaction": 22,
    "awakening": 0,
    "command": 10,
    "support": 8,
    "maintenance": 2,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "sacrificialBoost"
    ],
    "imagePath": ""
  },
  {
    "id": "frau",
    "name": "フラウ・ボゥ",
    "characterKey": "frau",
    "faction": "federation",
    "cost": 35,
    "shooting": 4,
    "melee": 3,
    "reaction": 8,
    "awakening": 4,
    "command": 4,
    "support": 13,
    "maintenance": 5,
    "roles": [
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "temRay",
    "name": "テム・レイ",
    "characterKey": "temRay",
    "faction": "federation",
    "cost": 75,
    "shooting": 2,
    "melee": 1,
    "reaction": 4,
    "awakening": 0,
    "command": 3,
    "support": 8,
    "maintenance": 26,
    "roles": [
      "mechanic",
      "operator"
    ],
    "specials": [
      "gundamPassion"
    ],
    "imagePath": ""
  },
  {
    "id": "revil",
    "name": "レビル",
    "characterKey": "revil",
    "faction": "federation",
    "cost": 150,
    "shooting": 6,
    "melee": 4,
    "reaction": 8,
    "awakening": 8,
    "command": 28,
    "support": 18,
    "maintenance": 2,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "barrageSupport"
    ],
    "imagePath": ""
  },
  {
    "id": "wakkein",
    "name": "ワッケイン",
    "characterKey": "wakkein",
    "faction": "federation",
    "cost": 95,
    "shooting": 6,
    "melee": 4,
    "reaction": 7,
    "awakening": 0,
    "command": 20,
    "support": 13,
    "maintenance": 1,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "massProductionFormation"
    ],
    "imagePath": ""
  },
  {
    "id": "paoloCassius",
    "name": "パオロ・カシアス",
    "characterKey": "paoloCassius",
    "faction": "federation",
    "cost": 70,
    "shooting": 4,
    "melee": 3,
    "reaction": 6,
    "awakening": 0,
    "command": 19,
    "support": 12,
    "maintenance": 2,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "oscarDublin",
    "name": "オスカ・ダブリン",
    "characterKey": "oscarDublin",
    "faction": "federation",
    "cost": 35,
    "shooting": 4,
    "melee": 2,
    "reaction": 7,
    "awakening": 0,
    "command": 4,
    "support": 15,
    "maintenance": 4,
    "roles": [
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "markerClan",
    "name": "マーカー・クラン",
    "characterKey": "markerClan",
    "faction": "federation",
    "cost": 35,
    "shooting": 4,
    "melee": 2,
    "reaction": 7,
    "awakening": 0,
    "command": 5,
    "support": 14,
    "maintenance": 4,
    "roles": [
      "operator"
    ],
    "specials": [
      "recon"
    ],
    "imagePath": ""
  },
  {
    "id": "omurHangal",
    "name": "オムル・ハング",
    "characterKey": "omurHangal",
    "faction": "federation",
    "cost": 45,
    "shooting": 5,
    "melee": 3,
    "reaction": 6,
    "awakening": 0,
    "command": 4,
    "support": 8,
    "maintenance": 18,
    "roles": [
      "mechanic",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "moskHan",
    "name": "モスク・ハン",
    "characterKey": "moskHan",
    "faction": "federation",
    "cost": 70,
    "shooting": 3,
    "melee": 2,
    "reaction": 5,
    "awakening": 0,
    "command": 5,
    "support": 10,
    "maintenance": 24,
    "roles": [
      "mechanic",
      "operator"
    ],
    "specials": [
      "gundamPassion"
    ],
    "imagePath": ""
  },
  {
    "id": "char",
    "name": "シャア・アズナブル",
    "characterKey": "char",
    "faction": "zeon",
    "cost": 145,
    "shooting": 20,
    "melee": 18,
    "reaction": 24,
    "awakening": 10,
    "command": 18,
    "support": 8,
    "maintenance": 2,
    "roles": [
      "pilot",
      "captain",
      "commander"
    ],
    "specials": [
      "ace"
    ],
    "imagePath": ""
  },
  {
    "id": "ramba",
    "name": "ランバ・ラル",
    "characterKey": "ramba",
    "faction": "zeon",
    "cost": 110,
    "shooting": 13,
    "melee": 21,
    "reaction": 17,
    "awakening": 0,
    "command": 16,
    "support": 8,
    "maintenance": 2,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "guerrillaTactics"
    ],
    "imagePath": ""
  },
  {
    "id": "anavelGato",
    "name": "アナベル・ガトー",
    "characterKey": "anavelGato",
    "faction": "zeon",
    "cost": 115,
    "shooting": 20,
    "melee": 19,
    "reaction": 20,
    "awakening": 0,
    "command": 14,
    "support": 7,
    "maintenance": 2,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "rivalry"
    ],
    "imagePath": ""
  },
  {
    "id": "eguilleDelaz",
    "name": "エギーユ・デラーズ",
    "characterKey": "eguilleDelaz",
    "faction": "zeon",
    "cost": 95,
    "shooting": 8,
    "melee": 5,
    "reaction": 8,
    "awakening": 0,
    "command": 23,
    "support": 17,
    "maintenance": 4,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "cimaGarahau",
    "name": "シーマ・ガラハウ",
    "characterKey": "cimaGarahau",
    "faction": "zeon",
    "cost": 105,
    "shooting": 19,
    "melee": 14,
    "reaction": 21,
    "awakening": 0,
    "command": 15,
    "support": 9,
    "maintenance": 4,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zeonSoldier",
    "name": "ジオン一般兵",
    "characterKey": "zeonSoldier",
    "faction": "zeon",
    "selectable": false,
    "cost": 25,
    "shooting": 8,
    "melee": 7,
    "reaction": 7,
    "awakening": 0,
    "command": 2,
    "support": 3,
    "maintenance": 1,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zeonVeteran",
    "name": "ジオンベテラン兵",
    "characterKey": "zeonVeteran",
    "faction": "zeon",
    "selectable": false,
    "cost": 45,
    "shooting": 12,
    "melee": 10,
    "reaction": 11,
    "awakening": 0,
    "command": 4,
    "support": 4,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zeonOfficer",
    "name": "ジオン士官",
    "characterKey": "zeonOfficer",
    "faction": "zeon",
    "selectable": false,
    "cost": 55,
    "shooting": 10,
    "melee": 8,
    "reaction": 9,
    "awakening": 0,
    "command": 10,
    "support": 7,
    "maintenance": 2,
    "roles": [
      "pilot",
      "captain",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zeonAquaticSoldier",
    "name": "ジオン水中部隊兵",
    "characterKey": "zeonAquaticSoldier",
    "faction": "zeon",
    "selectable": false,
    "cost": 40,
    "shooting": 10,
    "melee": 9,
    "reaction": 9,
    "awakening": 0,
    "command": 3,
    "support": 4,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [
      "antiSubmarine"
    ],
    "imagePath": ""
  },
  {
    "id": "zeonMaPilot",
    "name": "ジオンMAパイロット",
    "characterKey": "zeonMaPilot",
    "faction": "zeon",
    "selectable": false,
    "cost": 55,
    "shooting": 13,
    "melee": 8,
    "reaction": 12,
    "awakening": 0,
    "command": 4,
    "support": 3,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gene",
    "name": "ジーン",
    "characterKey": "gene",
    "faction": "zeon",
    "cost": 40,
    "shooting": 9,
    "melee": 8,
    "reaction": 8,
    "awakening": 0,
    "command": 3,
    "support": 4,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [
      "panic"
    ],
    "imagePath": ""
  },
  {
    "id": "denim",
    "name": "デニム",
    "characterKey": "denim",
    "faction": "zeon",
    "cost": 50,
    "shooting": 10,
    "melee": 12,
    "reaction": 10,
    "awakening": 0,
    "command": 6,
    "support": 4,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "slender",
    "name": "スレンダー",
    "characterKey": "slender",
    "faction": "zeon",
    "cost": 50,
    "shooting": 11,
    "melee": 9,
    "reaction": 13,
    "awakening": 0,
    "command": 4,
    "support": 5,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "cucuruzDoan",
    "name": "ククルス・ドアン",
    "characterKey": "cucuruzDoan",
    "faction": "zeon",
    "cost": 85,
    "shooting": 10,
    "melee": 18,
    "reaction": 16,
    "awakening": 0,
    "command": 8,
    "support": 12,
    "maintenance": 5,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "guardMission"
    ],
    "imagePath": ""
  },
  {
    "id": "clamp",
    "name": "クランプ",
    "characterKey": "clamp",
    "faction": "zeon",
    "cost": 65,
    "shooting": 13,
    "melee": 12,
    "reaction": 13,
    "awakening": 0,
    "command": 10,
    "support": 8,
    "maintenance": 3,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "guerrillaTactics"
    ],
    "imagePath": ""
  },
  {
    "id": "cozunGraham",
    "name": "コズン・グラハム",
    "characterKey": "cozunGraham",
    "faction": "zeon",
    "cost": 55,
    "shooting": 13,
    "melee": 10,
    "reaction": 12,
    "awakening": 0,
    "command": 5,
    "support": 6,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "acous",
    "name": "アコース",
    "characterKey": "acous",
    "faction": "zeon",
    "cost": 55,
    "shooting": 11,
    "melee": 13,
    "reaction": 12,
    "awakening": 0,
    "command": 5,
    "support": 6,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "crown",
    "name": "クラウン",
    "characterKey": "crown",
    "faction": "zeon",
    "cost": 45,
    "shooting": 10,
    "melee": 8,
    "reaction": 9,
    "awakening": 0,
    "command": 4,
    "support": 4,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "demitry",
    "name": "デミトリー",
    "characterKey": "demitry",
    "faction": "zeon",
    "cost": 70,
    "shooting": 17,
    "melee": 14,
    "reaction": 13,
    "awakening": 0,
    "command": 6,
    "support": 4,
    "maintenance": 1,
    "roles": [
      "pilot"
    ],
    "specials": [
      "panic"
    ],
    "imagePath": ""
  },
  {
    "id": "tokwan",
    "name": "トクワン",
    "characterKey": "tokwan",
    "faction": "zeon",
    "cost": 90,
    "shooting": 18,
    "melee": 16,
    "reaction": 18,
    "awakening": 0,
    "command": 7,
    "support": 5,
    "maintenance": 1,
    "roles": [
      "pilot"
    ],
    "specials": [
      "outstandingTalent"
    ],
    "imagePath": ""
  },
  {
    "id": "flanaganBoone",
    "name": "フラナガン・ブーン",
    "characterKey": "flanaganBoone",
    "faction": "zeon",
    "cost": 70,
    "shooting": 16,
    "melee": 10,
    "reaction": 13,
    "awakening": 0,
    "command": 8,
    "support": 7,
    "maintenance": 3,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "aquaticCombatAdaptation"
    ],
    "imagePath": ""
  },
  {
    "id": "dren",
    "name": "ドレン",
    "characterKey": "dren",
    "faction": "zeon",
    "cost": 95,
    "shooting": 7,
    "melee": 4,
    "reaction": 8,
    "awakening": 0,
    "command": 20,
    "support": 11,
    "maintenance": 2,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "massProductionFormation"
    ],
    "imagePath": ""
  },
  {
    "id": "dozle",
    "name": "ドズル・ザビ",
    "characterKey": "dozle",
    "faction": "zeon",
    "cost": 135,
    "shooting": 17,
    "melee": 22,
    "reaction": 14,
    "awakening": 0,
    "command": 24,
    "support": 8,
    "maintenance": 1,
    "roles": [
      "pilot",
      "captain",
      "commander"
    ],
    "specials": [
      "desperateRearGuard"
    ],
    "imagePath": ""
  },
  {
    "id": "kerguelenGirl",
    "name": "ケルゲレン子",
    "characterKey": "kerguelenGirl",
    "faction": "zeon",
    "cost": 45,
    "shooting": 4,
    "melee": 3,
    "reaction": 8,
    "awakening": 0,
    "command": 6,
    "support": 20,
    "maintenance": 5,
    "roles": [
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "oliverMay",
    "name": "オリヴァー・マイ",
    "characterKey": "oliverMay",
    "faction": "zeon",
    "cost": 50,
    "shooting": 11,
    "melee": 4,
    "reaction": 7,
    "awakening": 0,
    "command": 4,
    "support": 9,
    "maintenance": 19,
    "roles": [
      "mechanic",
      "operator",
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "moniqueCadillac",
    "name": "モニク・キャディラック",
    "characterKey": "moniqueCadillac",
    "faction": "zeon",
    "cost": 55,
    "shooting": 8,
    "melee": 4,
    "reaction": 9,
    "awakening": 0,
    "command": 12,
    "support": 16,
    "maintenance": 12,
    "roles": [
      "operator",
      "commander",
      "pilot"
    ],
    "specials": [
      "internalAudit"
    ],
    "imagePath": ""
  },
  {
    "id": "martinProchnow",
    "name": "マルティン・プロホノウ",
    "characterKey": "martinProchnow",
    "faction": "zeon",
    "cost": 70,
    "shooting": 7,
    "melee": 4,
    "reaction": 8,
    "awakening": 0,
    "command": 16,
    "support": 14,
    "maintenance": 6,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "aleksandroHemme",
    "name": "アレクサンドロ・ヘンメ",
    "characterKey": "aleksandroHemme",
    "faction": "zeon",
    "cost": 70,
    "shooting": 16,
    "melee": 4,
    "reaction": 8,
    "awakening": 0,
    "command": 3,
    "support": 4,
    "maintenance": 6,
    "roles": [
      "pilot",
      "operator"
    ],
    "specials": [
      "oldSoldierPride"
    ],
    "imagePath": ""
  },
  {
    "id": "demeziereSonnen",
    "name": "デメジエール・ソンネン",
    "characterKey": "demeziereSonnen",
    "faction": "zeon",
    "cost": 75,
    "shooting": 17,
    "melee": 8,
    "reaction": 10,
    "awakening": 0,
    "command": 5,
    "support": 3,
    "maintenance": 4,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "jeanLucDuvall",
    "name": "ジャン・リュック・デュバル",
    "characterKey": "jeanLucDuvall",
    "faction": "zeon",
    "cost": 90,
    "shooting": 18,
    "melee": 13,
    "reaction": 20,
    "awakening": 0,
    "command": 10,
    "support": 5,
    "maintenance": 3,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "hidetoWashiya",
    "name": "ヒデト・ワシヤ",
    "characterKey": "hidetoWashiya",
    "faction": "zeon",
    "cost": 60,
    "shooting": 14,
    "melee": 8,
    "reaction": 15,
    "awakening": 0,
    "command": 5,
    "support": 8,
    "maintenance": 8,
    "roles": [
      "pilot",
      "mechanic"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "wernerHolbein",
    "name": "ヴェルナー・ホルバイン",
    "characterKey": "wernerHolbein",
    "faction": "zeon",
    "cost": 80,
    "shooting": 18,
    "melee": 8,
    "reaction": 14,
    "awakening": 0,
    "command": 5,
    "support": 4,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "erwinCadillac",
    "name": "エルヴィン・キャディラック",
    "characterKey": "erwinCadillac",
    "faction": "zeon",
    "cost": 45,
    "shooting": 12,
    "melee": 6,
    "reaction": 11,
    "awakening": 0,
    "command": 3,
    "support": 5,
    "maintenance": 4,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "herbertVonKaspen",
    "name": "ヘルベルト・フォン・カスペン",
    "characterKey": "herbertVonKaspen",
    "faction": "zeon",
    "cost": 105,
    "shooting": 20,
    "melee": 16,
    "reaction": 16,
    "awakening": 0,
    "command": 18,
    "support": 8,
    "maintenance": 2,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "elmerSnell",
    "name": "エルマー・スネル",
    "characterKey": "elmerSnell",
    "faction": "zeon",
    "cost": 95,
    "shooting": 19,
    "melee": 13,
    "reaction": 18,
    "awakening": 0,
    "command": 14,
    "support": 7,
    "maintenance": 5,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "benBarberry",
    "name": "ベン・バーバリー",
    "characterKey": "benBarberry",
    "faction": "federation",
    "cost": 70,
    "shooting": 15,
    "melee": 11,
    "reaction": 13,
    "awakening": 0,
    "command": 12,
    "support": 8,
    "maintenance": 3,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "hermanYandell",
    "name": "ハーマン・ヤンデル",
    "characterKey": "hermanYandell",
    "faction": "federation",
    "cost": 75,
    "shooting": 16,
    "melee": 8,
    "reaction": 11,
    "awakening": 0,
    "command": 15,
    "support": 6,
    "maintenance": 3,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "raybanSla",
    "name": "レイバン・スラー",
    "characterKey": "raybanSla",
    "faction": "federation",
    "cost": 55,
    "shooting": 13,
    "melee": 7,
    "reaction": 10,
    "awakening": 0,
    "command": 5,
    "support": 5,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "alineNazon",
    "name": "アリーヌ・ネイズン",
    "characterKey": "alineNazon",
    "faction": "federation",
    "cost": 85,
    "shooting": 17,
    "melee": 10,
    "reaction": 14,
    "awakening": 0,
    "command": 13,
    "support": 12,
    "maintenance": 10,
    "roles": [
      "pilot",
      "commander",
      "mechanic"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "milosKarppi",
    "name": "ミロス・カルッピ",
    "characterKey": "milosKarppi",
    "faction": "federation",
    "cost": 55,
    "shooting": 14,
    "melee": 8,
    "reaction": 11,
    "awakening": 0,
    "command": 5,
    "support": 6,
    "maintenance": 5,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "drobaKuzwayo",
    "name": "ドロバ・クズワヨ",
    "characterKey": "drobaKuzwayo",
    "faction": "federation",
    "cost": 55,
    "shooting": 14,
    "melee": 8,
    "reaction": 11,
    "awakening": 0,
    "command": 5,
    "support": 6,
    "maintenance": 5,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "micheleCorematta",
    "name": "ミケーレ・コレマッタ",
    "characterKey": "micheleCorematta",
    "faction": "federation",
    "cost": 85,
    "shooting": 8,
    "melee": 5,
    "reaction": 9,
    "awakening": 0,
    "command": 18,
    "support": 8,
    "maintenance": 3,
    "roles": [
      "commander",
      "captain"
    ],
    "specials": [
      "breakthroughSupport"
    ],
    "imagePath": ""
  },
  {
    "id": "texanDimitry",
    "name": "テキサン・ディミトリー",
    "characterKey": "texanDimitry",
    "faction": "federation",
    "cost": 55,
    "shooting": 13,
    "melee": 6,
    "reaction": 15,
    "awakening": 0,
    "command": 3,
    "support": 4,
    "maintenance": 1,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "jackBayard",
    "name": "ジャック・ベアード",
    "characterKey": "jackBayard",
    "faction": "federation",
    "cost": 75,
    "shooting": 14,
    "melee": 10,
    "reaction": 15,
    "awakening": 0,
    "command": 13,
    "support": 9,
    "maintenance": 3,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "guardMission"
    ],
    "imagePath": ""
  },
  {
    "id": "adamStingray",
    "name": "アダム・スティングレイ",
    "characterKey": "adamStingray",
    "faction": "federation",
    "cost": 70,
    "shooting": 16,
    "melee": 13,
    "reaction": 12,
    "awakening": 0,
    "command": 7,
    "support": 7,
    "maintenance": 4,
    "roles": [
      "pilot"
    ],
    "specials": [
      "guardMission"
    ],
    "imagePath": ""
  },
  {
    "id": "woody",
    "name": "ウッディ",
    "characterKey": "woody",
    "faction": "federation",
    "cost": 55,
    "shooting": 8,
    "melee": 5,
    "reaction": 8,
    "awakening": 0,
    "command": 10,
    "support": 12,
    "maintenance": 18,
    "roles": [
      "mechanic",
      "operator",
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "reed",
    "name": "リード",
    "characterKey": "reed",
    "faction": "federation",
    "cost": 50,
    "shooting": 5,
    "melee": 4,
    "reaction": 5,
    "awakening": 0,
    "command": 13,
    "support": 6,
    "maintenance": 1,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "panic"
    ],
    "imagePath": ""
  },
  {
    "id": "tianem",
    "name": "ティアンム",
    "characterKey": "tianem",
    "faction": "federation",
    "cost": 100,
    "shooting": 6,
    "melee": 5,
    "reaction": 7,
    "awakening": 0,
    "command": 22,
    "support": 15,
    "maintenance": 1,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "barrageSupport"
    ],
    "imagePath": ""
  },
  {
    "id": "lydoWolf",
    "name": "リド・ウォルフ",
    "characterKey": "lydoWolf",
    "faction": "federation",
    "cost": 95,
    "shooting": 18,
    "melee": 12,
    "reaction": 19,
    "awakening": 0,
    "command": 7,
    "support": 5,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [
      "ace"
    ],
    "imagePath": ""
  },
  {
    "id": "francisBackmeyer",
    "name": "フランシス・バックマイヤー",
    "characterKey": "francisBackmeyer",
    "faction": "federation",
    "cost": 85,
    "shooting": 21,
    "melee": 6,
    "reaction": 16,
    "awakening": 0,
    "command": 5,
    "support": 4,
    "maintenance": 1,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "tennesJung",
    "name": "テネス・A・ユング",
    "characterKey": "tennesJung",
    "faction": "federation",
    "cost": 125,
    "shooting": 24,
    "melee": 13,
    "reaction": 22,
    "awakening": 2,
    "command": 7,
    "support": 5,
    "maintenance": 1,
    "roles": [
      "pilot"
    ],
    "specials": [
      "outstandingTalent"
    ],
    "imagePath": ""
  },
  {
    "id": "garryRogers",
    "name": "ギャリー・ロジャース",
    "characterKey": "garryRogers",
    "faction": "federation",
    "cost": 85,
    "shooting": 12,
    "melee": 20,
    "reaction": 20,
    "awakening": 0,
    "command": 5,
    "support": 4,
    "maintenance": 1,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "ronKou",
    "name": "ロン・コウ",
    "characterKey": "ronKou",
    "faction": "federation",
    "cost": 70,
    "shooting": 17,
    "melee": 9,
    "reaction": 19,
    "awakening": 0,
    "command": 4,
    "support": 4,
    "maintenance": 1,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "heinzBaer",
    "name": "ハインツ・ベア",
    "characterKey": "heinzBaer",
    "faction": "federation",
    "cost": 95,
    "shooting": 18,
    "melee": 17,
    "reaction": 17,
    "awakening": 0,
    "command": 7,
    "support": 5,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "denBazark",
    "name": "デン・バザーク",
    "characterKey": "denBazark",
    "faction": "federation",
    "cost": 90,
    "shooting": 19,
    "melee": 14,
    "reaction": 11,
    "awakening": 0,
    "command": 5,
    "support": 7,
    "maintenance": 11,
    "roles": [
      "pilot",
      "mechanic"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "hamon",
    "name": "クラウレ・ハモン",
    "characterKey": "hamon",
    "faction": "zeon",
    "cost": 65,
    "shooting": 7,
    "melee": 5,
    "reaction": 10,
    "awakening": 0,
    "command": 16,
    "support": 17,
    "maintenance": 4,
    "roles": [
      "captain",
      "operator",
      "commander"
    ],
    "specials": [
      "mourningResolve"
    ],
    "imagePath": ""
  },
  {
    "id": "conscon",
    "name": "コンスコン",
    "characterKey": "conscon",
    "faction": "zeon",
    "cost": 70,
    "shooting": 7,
    "melee": 5,
    "reaction": 6,
    "awakening": 0,
    "command": 16,
    "support": 8,
    "maintenance": 1,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "panic"
    ],
    "imagePath": ""
  },
  {
    "id": "gadem",
    "name": "ガデム",
    "characterKey": "gadem",
    "faction": "zeon",
    "cost": 80,
    "shooting": 13,
    "melee": 15,
    "reaction": 13,
    "awakening": 0,
    "command": 12,
    "support": 7,
    "maintenance": 8,
    "roles": [
      "pilot",
      "commander",
      "mechanic"
    ],
    "specials": [
      "oldSoldierPride"
    ],
    "imagePath": ""
  },
  {
    "id": "akahana",
    "name": "アカハナ",
    "characterKey": "akahana",
    "faction": "zeon",
    "cost": 60,
    "shooting": 12,
    "melee": 8,
    "reaction": 12,
    "awakening": 0,
    "command": 5,
    "support": 9,
    "maintenance": 10,
    "roles": [
      "pilot",
      "operator",
      "mechanic"
    ],
    "specials": [
      "stealth"
    ],
    "imagePath": ""
  },
  {
    "id": "flanagan",
    "name": "フラナガン博士",
    "characterKey": "flanagan",
    "faction": "zeon",
    "cost": 55,
    "shooting": 3,
    "melee": 2,
    "reaction": 5,
    "awakening": 6,
    "command": 6,
    "support": 16,
    "maintenance": 18,
    "roles": [
      "mechanic",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "lalah",
    "name": "ララァ・スン",
    "characterKey": "lalah",
    "faction": "zeon",
    "cost": 135,
    "shooting": 17,
    "melee": 6,
    "reaction": 18,
    "awakening": 28,
    "command": 8,
    "support": 14,
    "maintenance": 2,
    "roles": [
      "pilot",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "giren",
    "name": "ギレン・ザビ",
    "characterKey": "giren",
    "faction": "zeon",
    "cost": 145,
    "shooting": 5,
    "melee": 3,
    "reaction": 6,
    "awakening": 0,
    "command": 28,
    "support": 14,
    "maintenance": 1,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "barrageSupport"
    ],
    "imagePath": ""
  },
  {
    "id": "kycilia",
    "name": "キシリア・ザビ",
    "characterKey": "kycilia",
    "faction": "zeon",
    "cost": 120,
    "shooting": 8,
    "melee": 5,
    "reaction": 10,
    "awakening": 6,
    "command": 24,
    "support": 16,
    "maintenance": 5,
    "roles": [
      "captain",
      "commander",
      "operator"
    ],
    "specials": [
      "scheming"
    ],
    "imagePath": ""
  },
  {
    "id": "garma",
    "name": "ガルマ・ザビ",
    "characterKey": "garma",
    "faction": "zeon",
    "cost": 90,
    "shooting": 13,
    "melee": 9,
    "reaction": 13,
    "awakening": 0,
    "command": 17,
    "support": 10,
    "maintenance": 2,
    "roles": [
      "pilot",
      "captain",
      "commander"
    ],
    "specials": [
      "commanderCustom"
    ],
    "imagePath": ""
  },
  {
    "id": "mquve",
    "name": "マ・クベ",
    "characterKey": "mquve",
    "faction": "zeon",
    "cost": 105,
    "shooting": 12,
    "melee": 17,
    "reaction": 15,
    "awakening": 0,
    "command": 17,
    "support": 12,
    "maintenance": 4,
    "roles": [
      "pilot",
      "captain",
      "commander"
    ],
    "specials": [
      "scheming"
    ],
    "imagePath": ""
  },
  {
    "id": "gaia",
    "name": "ガイア",
    "characterKey": "gaia",
    "faction": "zeon",
    "cost": 120,
    "shooting": 14,
    "melee": 22,
    "reaction": 20,
    "awakening": 0,
    "command": 13,
    "support": 7,
    "maintenance": 2,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "teamwork"
    ],
    "imagePath": ""
  },
  {
    "id": "mash",
    "name": "マッシュ",
    "characterKey": "mash",
    "faction": "zeon",
    "cost": 95,
    "shooting": 15,
    "melee": 17,
    "reaction": 17,
    "awakening": 0,
    "command": 9,
    "support": 6,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "ortega",
    "name": "オルテガ",
    "characterKey": "ortega",
    "faction": "zeon",
    "cost": 95,
    "shooting": 18,
    "melee": 15,
    "reaction": 16,
    "awakening": 0,
    "command": 9,
    "support": 6,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "challiaBull",
    "name": "シャリア・ブル",
    "characterKey": "challiaBull",
    "faction": "zeon",
    "cost": 105,
    "shooting": 15,
    "melee": 5,
    "reaction": 15,
    "awakening": 14,
    "command": 12,
    "support": 10,
    "maintenance": 2,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "cuscoAl",
    "name": "クスコ・アル",
    "characterKey": "cuscoAl",
    "faction": "zeon",
    "cost": 125,
    "shooting": 16,
    "melee": 4,
    "reaction": 18,
    "awakening": 18,
    "command": 7,
    "support": 8,
    "maintenance": 1,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "leroyGilliam",
    "name": "ルロイ・ギリアム",
    "characterKey": "leroyGilliam",
    "faction": "zeon",
    "cost": 65,
    "shooting": 12,
    "melee": 6,
    "reaction": 14,
    "awakening": 7,
    "command": 5,
    "support": 6,
    "maintenance": 1,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "boraskiniv",
    "name": "ボラスキニフ",
    "characterKey": "boraskiniv",
    "faction": "zeon",
    "cost": 55,
    "shooting": 18,
    "melee": 4,
    "reaction": 7,
    "awakening": 0,
    "command": 9,
    "support": 8,
    "maintenance": 2,
    "roles": [
      "pilot",
      "captain"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "shinMatsunaga",
    "name": "シン・マツナガ",
    "characterKey": "shinMatsunaga",
    "faction": "zeon",
    "cost": 120,
    "shooting": 15,
    "melee": 24,
    "reaction": 22,
    "awakening": 0,
    "command": 9,
    "support": 5,
    "maintenance": 2,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "ace"
    ],
    "imagePath": ""
  },
  {
    "id": "johnnyRidden",
    "name": "ジョニー・ライデン",
    "characterKey": "johnnyRidden",
    "faction": "zeon",
    "cost": 120,
    "shooting": 24,
    "melee": 15,
    "reaction": 22,
    "awakening": 0,
    "command": 9,
    "support": 5,
    "maintenance": 2,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "ace"
    ],
    "imagePath": ""
  },
  {
    "id": "ianGreydon",
    "name": "イアン・グレーデン",
    "characterKey": "ianGreydon",
    "faction": "zeon",
    "cost": 85,
    "shooting": 18,
    "melee": 9,
    "reaction": 17,
    "awakening": 4,
    "command": 8,
    "support": 5,
    "maintenance": 2,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "characterKey": "thomasOperator",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "operator",
      "pilot"
    ],
    "specials": [],
    "imagePath": "",
    "id": "thomasOperator",
    "name": "トーマス",
    "faction": "federation",
    "cost": 55,
    "shooting": 10,
    "melee": 4,
    "reaction": 9,
    "command": 6,
    "support": 17,
    "maintenance": 5
  },
  {
    "characterKey": "henkenBekkener",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "captain",
      "commander",
      "pilot"
    ],
    "specials": [],
    "imagePath": "",
    "id": "henkenBekkener",
    "name": "ヘンケン・ベッケナー",
    "faction": "federation",
    "cost": 80,
    "shooting": 8,
    "melee": 6,
    "reaction": 10,
    "command": 16,
    "support": 13,
    "maintenance": 4
  },
  {
    "characterKey": "rob07",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": "",
    "id": "rob07",
    "name": "ロブ",
    "faction": "federation",
    "cost": 50,
    "shooting": 9,
    "melee": 13,
    "reaction": 10,
    "command": 9,
    "support": 7,
    "maintenance": 3
  },
  {
    "characterKey": "sally07",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot"
    ],
    "specials": [
      "allyBackup"
    ],
    "imagePath": "",
    "id": "sally07",
    "name": "サリー",
    "faction": "federation",
    "cost": 50,
    "shooting": 13,
    "melee": 8,
    "reaction": 9,
    "command": 5,
    "support": 10,
    "maintenance": 3
  },
  {
    "characterKey": "mike07",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": "",
    "id": "mike07",
    "name": "マイク",
    "faction": "federation",
    "cost": 50,
    "shooting": 10,
    "melee": 10,
    "reaction": 14,
    "command": 5,
    "support": 7,
    "maintenance": 3
  },
  {
    "characterKey": "geraldSakai",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot",
      "mechanic"
    ],
    "specials": [],
    "imagePath": "",
    "id": "geraldSakai",
    "name": "ジェラルド・サカイ",
    "faction": "zeon",
    "cost": 90,
    "shooting": 16,
    "melee": 14,
    "reaction": 17,
    "command": 10,
    "support": 9,
    "maintenance": 8
  },
  {
    "characterKey": "thomasKurtz",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": "",
    "id": "thomasKurtz",
    "name": "トーマス・クルツ",
    "faction": "zeon",
    "cost": 90,
    "shooting": 12,
    "melee": 18,
    "reaction": 17,
    "command": 9,
    "support": 7,
    "maintenance": 3
  },
  {
    "characterKey": "brenissOx",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": "",
    "id": "brenissOx",
    "name": "ブレニフ・オグス",
    "faction": "zeon",
    "cost": 85,
    "shooting": 21,
    "melee": 2,
    "reaction": 14,
    "command": 7,
    "support": 5,
    "maintenance": 2
  },
  {
    "characterKey": "robertGilliam",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": "",
    "id": "robertGilliam",
    "name": "ロバート・ギリアム",
    "faction": "zeon",
    "cost": 85,
    "shooting": 15,
    "melee": 13,
    "reaction": 20,
    "command": 8,
    "support": 7,
    "maintenance": 3
  },
  {
    "characterKey": "gabbyHazard",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": "",
    "id": "gabbyHazard",
    "name": "ギャビー・ハザード",
    "faction": "zeon",
    "cost": 80,
    "shooting": 16,
    "melee": 14,
    "reaction": 18,
    "command": 8,
    "support": 6,
    "maintenance": 2
  },
  {
    "characterKey": "royGreenwood",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot"
    ],
    "specials": [
      "sandAmbush"
    ],
    "imagePath": "",
    "id": "royGreenwood",
    "name": "ロイ・グリンウッド",
    "faction": "zeon",
    "cost": 75,
    "shooting": 14,
    "melee": 13,
    "reaction": 15,
    "command": 8,
    "support": 8,
    "maintenance": 3
  },
  {
    "characterKey": "top08",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": "",
    "id": "top08",
    "name": "トップ",
    "faction": "zeon",
    "cost": 50,
    "shooting": 13,
    "melee": 13,
    "reaction": 8,
    "command": 11,
    "support": 7,
    "maintenance": 3
  },
  {
    "characterKey": "as08",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": "",
    "id": "as08",
    "name": "アス",
    "faction": "zeon",
    "cost": 35,
    "shooting": 8,
    "melee": 12,
    "reaction": 8,
    "command": 3,
    "support": 4,
    "maintenance": 2
  },
  {
    "characterKey": "dell08",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot"
    ],
    "specials": [
      "allyBackup"
    ],
    "imagePath": "",
    "id": "dell08",
    "name": "デル",
    "faction": "zeon",
    "cost": 35,
    "shooting": 12,
    "melee": 8,
    "reaction": 8,
    "command": 3,
    "support": 6,
    "maintenance": 2
  },
  {
    "characterKey": "boneAbust",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "captain",
      "pilot",
      "commander"
    ],
    "specials": [
      "stopMovement"
    ],
    "imagePath": "",
    "id": "boneAbust",
    "name": "ボーン・アブスト",
    "faction": "zeon",
    "cost": 65,
    "shooting": 13,
    "melee": 7,
    "reaction": 9,
    "command": 15,
    "support": 9,
    "maintenance": 4
  },
  {
    "characterKey": "shiroAmada",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "teamwork"
    ],
    "imagePath": "",
    "id": "shiroAmada",
    "name": "シロー・アマダ",
    "faction": "federation",
    "cost": 95,
    "shooting": 16,
    "melee": 16,
    "reaction": 18,
    "command": 13,
    "support": 10,
    "maintenance": 5
  },
  {
    "characterKey": "karenJoshua",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": "",
    "id": "karenJoshua",
    "name": "カレン・ジョシュワ",
    "faction": "federation",
    "cost": 75,
    "shooting": 14,
    "melee": 17,
    "reaction": 16,
    "command": 8,
    "support": 8,
    "maintenance": 3
  },
  {
    "characterKey": "terrySandersJr",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot"
    ],
    "specials": [
      "jinx"
    ],
    "imagePath": "",
    "id": "terrySandersJr",
    "name": "テリー・サンダースJr.",
    "faction": "federation",
    "cost": 75,
    "shooting": 16,
    "melee": 14,
    "reaction": 17,
    "command": 8,
    "support": 9,
    "maintenance": 4
  },
  {
    "characterKey": "micheleNinorich",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "operator",
      "pilot"
    ],
    "specials": [],
    "imagePath": "",
    "id": "micheleNinorich",
    "name": "ミケル・ニノリッチ",
    "faction": "federation",
    "cost": 25,
    "shooting": 5,
    "melee": 3,
    "reaction": 7,
    "command": 4,
    "support": 8,
    "maintenance": 2
  },
  {
    "characterKey": "eledoreMassis",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "operator",
      "pilot"
    ],
    "specials": [],
    "imagePath": "",
    "id": "eledoreMassis",
    "name": "エレドア・マシス",
    "faction": "federation",
    "cost": 55,
    "shooting": 7,
    "melee": 4,
    "reaction": 15,
    "command": 6,
    "support": 16,
    "maintenance": 4
  },
  {
    "characterKey": "kojima08",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "retreatSupport"
    ],
    "imagePath": "",
    "id": "kojima08",
    "name": "コジマ",
    "faction": "federation",
    "cost": 85,
    "shooting": 6,
    "melee": 4,
    "reaction": 8,
    "command": 17,
    "support": 14,
    "maintenance": 7
  },
  {
    "characterKey": "ainaSahalin",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot",
      "mechanic"
    ],
    "specials": [],
    "imagePath": "",
    "id": "ainaSahalin",
    "name": "アイナ・サハリン",
    "faction": "zeon",
    "cost": 85,
    "shooting": 15,
    "melee": 9,
    "reaction": 17,
    "command": 9,
    "support": 10,
    "maintenance": 8
  },
  {
    "characterKey": "ghiniusSahalin",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot",
      "mechanic",
      "commander"
    ],
    "specials": [
      "madness"
    ],
    "imagePath": "",
    "id": "ghiniusSahalin",
    "name": "ギニアス・サハリン",
    "faction": "zeon",
    "cost": 95,
    "shooting": 17,
    "melee": 5,
    "reaction": 11,
    "command": 14,
    "support": 8,
    "maintenance": 18
  },
  {
    "characterKey": "norrisPackard",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "sacrificialBoost"
    ],
    "imagePath": "",
    "id": "norrisPackard",
    "name": "ノリス・パッカード",
    "faction": "zeon",
    "cost": 110,
    "shooting": 16,
    "melee": 21,
    "reaction": 20,
    "command": 13,
    "support": 10,
    "maintenance": 5
  },
  {
    "characterKey": "yuriKellarny",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "retreatSupport"
    ],
    "imagePath": "",
    "id": "yuriKellarny",
    "name": "ユーリ・ケラーネ",
    "faction": "zeon",
    "cost": 100,
    "shooting": 8,
    "melee": 5,
    "reaction": 10,
    "command": 21,
    "support": 16,
    "maintenance": 8
  },
  {
    "characterKey": "cynthia08",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "operator",
      "mechanic"
    ],
    "specials": [],
    "imagePath": "",
    "id": "cynthia08",
    "name": "シンシア",
    "faction": "zeon",
    "cost": 55,
    "shooting": 5,
    "melee": 3,
    "reaction": 9,
    "command": 8,
    "support": 14,
    "maintenance": 13
  },
  {
    "characterKey": "tamura",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "operator"
    ],
    "specials": [
      "pilotSupply"
    ],
    "imagePath": "",
    "id": "tamura",
    "name": "タムラ",
    "faction": "federation",
    "cost": 35,
    "shooting": 2,
    "melee": 1,
    "reaction": 4,
    "command": 4,
    "support": 11,
    "maintenance": 2
  },
  {
    "characterKey": "gopp",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "pilotSupply"
    ],
    "imagePath": "",
    "id": "gopp",
    "name": "ゴップ",
    "faction": "federation",
    "cost": 70,
    "shooting": 3,
    "melee": 2,
    "reaction": 5,
    "command": 11,
    "support": 19,
    "maintenance": 5
  },
  {
    "characterKey": "uragan",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "captain",
      "operator",
      "commander"
    ],
    "specials": [],
    "imagePath": "",
    "id": "uragan",
    "name": "ウラガン",
    "faction": "zeon",
    "cost": 55,
    "shooting": 7,
    "melee": 5,
    "reaction": 8,
    "command": 12,
    "support": 12,
    "maintenance": 4
  },
  {
    "characterKey": "asakura",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "mechanic",
      "commander"
    ],
    "specials": [],
    "imagePath": "",
    "id": "asakura",
    "name": "アサクラ",
    "faction": "zeon",
    "cost": 70,
    "shooting": 5,
    "melee": 3,
    "reaction": 6,
    "command": 13,
    "support": 9,
    "maintenance": 16
  },
  {
    "characterKey": "aliceMiller",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "operator",
      "commander"
    ],
    "specials": [
      "internalAudit"
    ],
    "imagePath": "",
    "id": "aliceMiller",
    "name": "アリス・ミラー",
    "faction": "federation",
    "cost": 65,
    "shooting": 6,
    "melee": 4,
    "reaction": 10,
    "command": 12,
    "support": 13,
    "maintenance": 3
  },
  {
    "characterKey": "ethanLyer",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "forcedMarch"
    ],
    "imagePath": "",
    "id": "ethanLyer",
    "name": "イーサン・ライヤー",
    "faction": "federation",
    "cost": 100,
    "shooting": 6,
    "melee": 3,
    "reaction": 7,
    "command": 21,
    "support": 9,
    "maintenance": 4
  },
  {
    "characterKey": "kikiRosita",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "guerrillaTactics"
    ],
    "imagePath": "",
    "id": "kikiRosita",
    "name": "キキ・ロジータ",
    "faction": "federation",
    "cost": 45,
    "shooting": 8,
    "melee": 5,
    "reaction": 13,
    "command": 8,
    "support": 11,
    "maintenance": 2
  },
  {
    "characterKey": "gidanNickard",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "operator",
      "mechanic"
    ],
    "specials": [
      "pilotSupply"
    ],
    "imagePath": "",
    "id": "gidanNickard",
    "name": "ジダン・ニッカード",
    "faction": "federation",
    "cost": 55,
    "shooting": 4,
    "melee": 3,
    "reaction": 8,
    "command": 7,
    "support": 17,
    "maintenance": 9
  },
  {
    "characterKey": "johnnyNakamizo",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "mechanic"
    ],
    "specials": [],
    "imagePath": "",
    "id": "johnnyNakamizo",
    "name": "ジョニー・ナカミゾ",
    "faction": "federation",
    "cost": 35,
    "shooting": 4,
    "melee": 3,
    "reaction": 6,
    "command": 3,
    "support": 8,
    "maintenance": 14
  },
  {
    "characterKey": "nieva",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "mechanic"
    ],
    "specials": [],
    "imagePath": "",
    "id": "nieva",
    "name": "ニエーバ",
    "faction": "zeon",
    "cost": 35,
    "shooting": 4,
    "melee": 3,
    "reaction": 7,
    "command": 3,
    "support": 7,
    "maintenance": 14
  },
  {
    "characterKey": "masad",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": "",
    "id": "masad",
    "name": "マサド",
    "faction": "zeon",
    "cost": 35,
    "shooting": 10,
    "melee": 4,
    "reaction": 11,
    "command": 6,
    "support": 7,
    "maintenance": 2
  },
  {
    "characterKey": "barry08",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": "",
    "id": "barry08",
    "name": "バリー",
    "faction": "zeon",
    "cost": 35,
    "shooting": 11,
    "melee": 5,
    "reaction": 7,
    "command": 4,
    "support": 5,
    "maintenance": 2
  },
  {
    "characterKey": "runen08",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": "",
    "id": "runen08",
    "name": "ルネン",
    "faction": "zeon",
    "cost": 35,
    "shooting": 8,
    "melee": 6,
    "reaction": 10,
    "command": 5,
    "support": 5,
    "maintenance": 2
  },
  {
    "characterKey": "deginZabi",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "peaceWill"
    ],
    "imagePath": "",
    "id": "deginZabi",
    "name": "デギン・ソド・ザビ",
    "faction": "zeon",
    "cost": 115,
    "shooting": 3,
    "melee": 2,
    "reaction": 5,
    "command": 22,
    "support": 15,
    "maintenance": 4
  },
  {
    "characterKey": "elran",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "spyConduct"
    ],
    "imagePath": "",
    "id": "elran",
    "name": "エルラン",
    "faction": "federation",
    "factions": [
      "federation",
      "zeon"
    ],
    "cost": 15,
    "shooting": 2,
    "melee": 1,
    "reaction": 3,
    "command": 9,
    "support": 6,
    "maintenance": 2
  },
  {
    "characterKey": "judock",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "pilot",
      "operator"
    ],
    "specials": [
      "spyConduct"
    ],
    "imagePath": "",
    "id": "judock",
    "name": "ジュダック",
    "faction": "zeon",
    "factions": [
      "federation",
      "zeon"
    ],
    "cost": 10,
    "shooting": 5,
    "melee": 3,
    "reaction": 7,
    "command": 2,
    "support": 5,
    "maintenance": 1
  },
  {
    "characterKey": "mulligan",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "captain",
      "operator",
      "commander"
    ],
    "specials": [
      "marineSpaceSupport"
    ],
    "imagePath": "",
    "id": "mulligan",
    "name": "マリガン",
    "faction": "zeon",
    "cost": 65,
    "shooting": 6,
    "melee": 3,
    "reaction": 8,
    "command": 13,
    "support": 14,
    "maintenance": 4
  },
  {
    "characterKey": "barestRosita",
    "selectable": true,
    "awakening": 0,
    "roles": [
      "commander",
      "operator"
    ],
    "specials": [
      "commanderStealth"
    ],
    "imagePath": "",
    "id": "barestRosita",
    "name": "バレスト・ロジータ",
    "faction": "federation",
    "cost": 45,
    "shooting": 4,
    "melee": 4,
    "reaction": 8,
    "command": 10,
    "support": 12,
    "maintenance": 2
  },
  {
    "id": "christinaMackenzie",
    "name": "クリスチーナ・マッケンジー",
    "characterKey": "christinaMackenzie",
    "faction": "federation",
    "cost": 75,
    "shooting": 14,
    "melee": 10,
    "reaction": 15,
    "awakening": 0,
    "command": 5,
    "support": 8,
    "maintenance": 13,
    "roles": [
      "pilot",
      "mechanic"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "bernardWiseman",
    "name": "バーナード・ワイズマン",
    "characterKey": "bernardWiseman",
    "faction": "zeon",
    "cost": 55,
    "shooting": 10,
    "melee": 13,
    "reaction": 12,
    "awakening": 0,
    "command": 4,
    "support": 6,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [
      "rivalry"
    ],
    "imagePath": ""
  },
  {
    "id": "hardieSteiner",
    "name": "ハーディ・シュタイナー",
    "characterKey": "hardieSteiner",
    "faction": "zeon",
    "cost": 105,
    "shooting": 18,
    "melee": 13,
    "reaction": 17,
    "awakening": 0,
    "command": 17,
    "support": 9,
    "maintenance": 5,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "aiSenshi"
    ],
    "imagePath": ""
  },
  {
    "id": "mikhailKaminsky",
    "name": "ミハイル・カミンスキー",
    "characterKey": "mikhailKaminsky",
    "faction": "zeon",
    "cost": 90,
    "shooting": 15,
    "melee": 17,
    "reaction": 19,
    "awakening": 0,
    "command": 7,
    "support": 8,
    "maintenance": 4,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gabrielRamirezGarcia",
    "name": "ガブリエル・ラミレス・ガルシア",
    "characterKey": "gabrielRamirezGarcia",
    "faction": "zeon",
    "cost": 70,
    "shooting": 15,
    "melee": 11,
    "reaction": 13,
    "awakening": 0,
    "command": 6,
    "support": 8,
    "maintenance": 10,
    "roles": [
      "pilot",
      "mechanic"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "andyStrauss",
    "name": "アンディ・ストロース",
    "characterKey": "andyStrauss",
    "faction": "zeon",
    "cost": 55,
    "shooting": 12,
    "melee": 11,
    "reaction": 12,
    "awakening": 0,
    "command": 5,
    "support": 5,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [
      "sacrificialBoost"
    ],
    "imagePath": ""
  },
  {
    "id": "killing",
    "name": "キリング",
    "characterKey": "killing",
    "faction": "zeon",
    "cost": 95,
    "shooting": 4,
    "melee": 3,
    "reaction": 5,
    "awakening": 0,
    "command": 18,
    "support": 8,
    "maintenance": 2,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "forcedMarch"
    ],
    "imagePath": ""
  },
  {
    "id": "vonHellsing",
    "name": "フォン・ヘルシング",
    "characterKey": "vonHellsing",
    "faction": "zeon",
    "cost": 65,
    "shooting": 5,
    "melee": 3,
    "reaction": 7,
    "awakening": 0,
    "command": 13,
    "support": 12,
    "maintenance": 5,
    "roles": [
      "captain",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "stuart",
    "name": "スチュアート",
    "characterKey": "stuart",
    "faction": "federation",
    "cost": 75,
    "shooting": 6,
    "melee": 4,
    "reaction": 8,
    "awakening": 0,
    "command": 15,
    "support": 9,
    "maintenance": 4,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "ayaSwanport",
    "name": "アヤ・スワンポート",
    "characterKey": "ayaSwanport",
    "faction": "federation",
    "cost": 45,
    "shooting": 4,
    "melee": 3,
    "reaction": 9,
    "awakening": 0,
    "command": 7,
    "support": 15,
    "maintenance": 8,
    "roles": [
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "fordRomfellow",
    "name": "フォルド・ロムフェロー",
    "characterKey": "fordRomfellow",
    "faction": "federation",
    "cost": 80,
    "shooting": 16,
    "melee": 14,
    "reaction": 15,
    "awakening": 0,
    "command": 10,
    "support": 8,
    "maintenance": 4,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "luceKassel",
    "name": "ルース・カッセル",
    "characterKey": "luceKassel",
    "faction": "federation",
    "cost": 90,
    "shooting": 18,
    "melee": 11,
    "reaction": 14,
    "awakening": 0,
    "command": 8,
    "support": 7,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "miyuTakizawa",
    "name": "ミユ・タキザワ",
    "characterKey": "miyuTakizawa",
    "faction": "federation",
    "cost": 55,
    "shooting": 5,
    "melee": 3,
    "reaction": 8,
    "awakening": 0,
    "command": 6,
    "support": 16,
    "maintenance": 12,
    "roles": [
      "operator",
      "mechanic"
    ],
    "specials": [
      "pilotSupply"
    ],
    "imagePath": ""
  },
  {
    "id": "kirstenLombard",
    "name": "キルスティン・ロンバート",
    "characterKey": "kirstenLombard",
    "faction": "federation",
    "cost": 70,
    "shooting": 6,
    "melee": 4,
    "reaction": 8,
    "awakening": 0,
    "command": 16,
    "support": 13,
    "maintenance": 5,
    "roles": [
      "captain",
      "commander",
      "operator"
    ],
    "specials": [
      "retreatSupport"
    ],
    "imagePath": ""
  },
  {
    "id": "annieBrevig",
    "name": "アニー・ブレビッグ",
    "characterKey": "annieBrevig",
    "faction": "federation",
    "cost": 50,
    "shooting": 4,
    "melee": 3,
    "reaction": 7,
    "awakening": 0,
    "command": 5,
    "support": 13,
    "maintenance": 16,
    "roles": [
      "mechanic",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "borkCry",
    "name": "ボルク・クライ",
    "characterKey": "borkCry",
    "faction": "federation",
    "cost": 85,
    "shooting": 15,
    "melee": 16,
    "reaction": 15,
    "awakening": 0,
    "command": 11,
    "support": 8,
    "maintenance": 3,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "guardMission"
    ],
    "imagePath": ""
  },
  {
    "id": "sanaNima",
    "name": "サナ・ニマ",
    "characterKey": "sanaNima",
    "faction": "federation",
    "cost": 45,
    "shooting": 10,
    "melee": 7,
    "reaction": 10,
    "awakening": 0,
    "command": 4,
    "support": 9,
    "maintenance": 4,
    "roles": [
      "operator",
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "dabaSoy",
    "name": "ダバ・ソイ",
    "characterKey": "dabaSoy",
    "faction": "federation",
    "cost": 55,
    "shooting": 13,
    "melee": 9,
    "reaction": 11,
    "awakening": 0,
    "command": 6,
    "support": 7,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "noctGadish",
    "name": "ノクト・ガディッシュ",
    "characterKey": "noctGadish",
    "faction": "federation",
    "cost": 80,
    "shooting": 7,
    "melee": 4,
    "reaction": 7,
    "awakening": 0,
    "command": 15,
    "support": 9,
    "maintenance": 2,
    "roles": [
      "commander",
      "captain"
    ],
    "specials": [
      "forcedMarch"
    ],
    "imagePath": ""
  },
  {
    "id": "elliottRem",
    "name": "エリオット・レム",
    "characterKey": "elliottRem",
    "faction": "zeon",
    "cost": 85,
    "shooting": 12,
    "melee": 10,
    "reaction": 11,
    "awakening": 0,
    "command": 11,
    "support": 9,
    "maintenance": 18,
    "roles": [
      "pilot",
      "mechanic",
      "commander"
    ],
    "specials": [
      "zakuPassion"
    ],
    "imagePath": ""
  },
  {
    "id": "malletSanguine",
    "name": "マレット・サンギーヌ",
    "characterKey": "malletSanguine",
    "faction": "zeon",
    "cost": 100,
    "shooting": 18,
    "melee": 17,
    "reaction": 19,
    "awakening": 0,
    "command": 10,
    "support": 5,
    "maintenance": 2,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "madness"
    ],
    "imagePath": ""
  },
  {
    "id": "yuimanCarlile",
    "name": "ユイマン・カーライル",
    "characterKey": "yuimanCarlile",
    "faction": "zeon",
    "cost": 55,
    "shooting": 13,
    "melee": 12,
    "reaction": 13,
    "awakening": 0,
    "command": 12,
    "support": 11,
    "maintenance": 4,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "guardMission"
    ],
    "imagePath": ""
  },
  {
    "id": "liliaFlobert",
    "name": "リリア・フローベール",
    "characterKey": "liliaFlobert",
    "faction": "zeon",
    "cost": 80,
    "shooting": 17,
    "melee": 10,
    "reaction": 17,
    "awakening": 0,
    "command": 7,
    "support": 9,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [
      "allyBackup"
    ],
    "imagePath": ""
  },
  {
    "id": "gusterPiper",
    "name": "ギュスター・パイパー",
    "characterKey": "gusterPiper",
    "faction": "zeon",
    "cost": 65,
    "shooting": 15,
    "melee": 12,
    "reaction": 13,
    "awakening": 0,
    "command": 6,
    "support": 8,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [
      "allyBackup"
    ],
    "imagePath": ""
  },
  {
    "id": "nordLangel",
    "name": "ノルド・ランゲル",
    "characterKey": "nordLangel",
    "faction": "zeon",
    "cost": 105,
    "shooting": 8,
    "melee": 5,
    "reaction": 8,
    "awakening": 0,
    "command": 22,
    "support": 15,
    "maintenance": 5,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "peaceWill"
    ],
    "imagePath": ""
  },
  {
    "id": "mayKerwin",
    "name": "メイ・カーウィン",
    "characterKey": "mayKerwin",
    "faction": "zeon",
    "cost": 55,
    "shooting": 5,
    "melee": 3,
    "reaction": 9,
    "awakening": 0,
    "command": 8,
    "support": 16,
    "maintenance": 22,
    "roles": [
      "operator",
      "mechanic"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "jakeGuns",
    "name": "ジェイク・ガンス",
    "characterKey": "jakeGuns",
    "faction": "zeon",
    "cost": 60,
    "shooting": 13,
    "melee": 11,
    "reaction": 12,
    "awakening": 0,
    "command": 6,
    "support": 6,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "henryBoone",
    "name": "ヘンリー・ブーン",
    "characterKey": "henryBoone",
    "faction": "zeon",
    "cost": 80,
    "shooting": 15,
    "melee": 14,
    "reaction": 14,
    "awakening": 0,
    "command": 13,
    "support": 7,
    "maintenance": 3,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "forcedMarch"
    ],
    "imagePath": ""
  },
  {
    "id": "rayHamilton",
    "name": "レイ・ハミルトン",
    "characterKey": "rayHamilton",
    "faction": "zeon",
    "cost": 55,
    "shooting": 12,
    "melee": 10,
    "reaction": 12,
    "awakening": 0,
    "command": 5,
    "support": 7,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "lesterCarrot",
    "name": "レスタ・キャロット",
    "characterKey": "lesterCarrot",
    "faction": "zeon",
    "cost": 55,
    "shooting": 11,
    "melee": 12,
    "reaction": 11,
    "awakening": 0,
    "command": 5,
    "support": 6,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "sakiGraham",
    "name": "サキ・グラハム",
    "characterKey": "sakiGraham",
    "faction": "zeon",
    "cost": 55,
    "shooting": 12,
    "melee": 9,
    "reaction": 12,
    "awakening": 0,
    "command": 5,
    "support": 8,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "martinHagar",
    "name": "マーチン・ハガー",
    "characterKey": "martinHagar",
    "faction": "zeon",
    "cost": 60,
    "shooting": 12,
    "melee": 9,
    "reaction": 10,
    "awakening": 0,
    "command": 13,
    "support": 8,
    "maintenance": 4,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "masterPRayer",
    "name": "マスター・P・レイヤー",
    "characterKey": "masterPRayer",
    "faction": "federation",
    "cost": 130,
    "shooting": 22,
    "melee": 18,
    "reaction": 22,
    "awakening": 0,
    "command": 17,
    "support": 9,
    "maintenance": 3,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "maximilianBerger",
    "name": "マクシミリアン・バーガー",
    "characterKey": "maximilianBerger",
    "faction": "federation",
    "cost": 95,
    "shooting": 21,
    "melee": 12,
    "reaction": 17,
    "awakening": 0,
    "command": 8,
    "support": 13,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [
      "allyBackup"
    ],
    "imagePath": ""
  },
  {
    "id": "leungLeeFei",
    "name": "レオン・リーフェイ",
    "characterKey": "leungLeeFei",
    "faction": "federation",
    "cost": 80,
    "shooting": 17,
    "melee": 17,
    "reaction": 19,
    "awakening": 0,
    "command": 8,
    "support": 12,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "anitaJulian",
    "name": "アニタ・ジュリアン",
    "characterKey": "anitaJulian",
    "faction": "federation",
    "cost": 60,
    "shooting": 5,
    "melee": 3,
    "reaction": 10,
    "awakening": 0,
    "command": 9,
    "support": 19,
    "maintenance": 16,
    "roles": [
      "operator",
      "mechanic"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "bobRock",
    "name": "ボブ・ロック",
    "characterKey": "bobRock",
    "faction": "federation",
    "cost": 55,
    "shooting": 6,
    "melee": 5,
    "reaction": 8,
    "awakening": 0,
    "command": 7,
    "support": 13,
    "maintenance": 24,
    "roles": [
      "mechanic",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "stanleyHawkins",
    "name": "スタンリー・ホーキンス",
    "characterKey": "stanleyHawkins",
    "faction": "federation",
    "cost": 85,
    "shooting": 8,
    "melee": 5,
    "reaction": 10,
    "awakening": 0,
    "command": 22,
    "support": 17,
    "maintenance": 6,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "massProductionFormation"
    ],
    "imagePath": ""
  },
  {
    "id": "youKajima",
    "name": "ユウ・カジマ",
    "characterKey": "youKajima",
    "faction": "federation",
    "cost": 150,
    "shooting": 24,
    "melee": 21,
    "reaction": 25,
    "awakening": 0,
    "command": 12,
    "support": 8,
    "maintenance": 3,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "ace"
    ],
    "imagePath": ""
  },
  {
    "id": "philipHughes",
    "name": "フィリップ・ヒューズ",
    "characterKey": "philipHughes",
    "faction": "federation",
    "cost": 75,
    "shooting": 18,
    "melee": 13,
    "reaction": 15,
    "awakening": 0,
    "command": 9,
    "support": 16,
    "maintenance": 4,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "samanaFulis",
    "name": "サマナ・フュリス",
    "characterKey": "samanaFulis",
    "faction": "federation",
    "cost": 75,
    "shooting": 16,
    "melee": 12,
    "reaction": 15,
    "awakening": 0,
    "command": 7,
    "support": 14,
    "maintenance": 4,
    "roles": [
      "pilot"
    ],
    "specials": [
      "allyBackup"
    ],
    "imagePath": ""
  },
  {
    "id": "maureenKitamura",
    "name": "モーリン・キタムラ",
    "characterKey": "maureenKitamura",
    "faction": "federation",
    "cost": 55,
    "shooting": 5,
    "melee": 3,
    "reaction": 9,
    "awakening": 0,
    "command": 8,
    "support": 18,
    "maintenance": 18,
    "roles": [
      "operator",
      "mechanic"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "walhammerCains",
    "name": "ワルハマー・T・カインズ",
    "characterKey": "walhammerCains",
    "faction": "federation",
    "cost": 65,
    "shooting": 4,
    "melee": 2,
    "reaction": 8,
    "awakening": 0,
    "command": 10,
    "support": 18,
    "maintenance": 24,
    "roles": [
      "mechanic",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "frederickBrown",
    "name": "フレデリック・ブラウン",
    "characterKey": "frederickBrown",
    "faction": "zeon",
    "cost": 55,
    "shooting": 12,
    "melee": 11,
    "reaction": 12,
    "awakening": 0,
    "command": 4,
    "support": 5,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "nimbusSchterzen",
    "name": "ニムバス・シュターゼン",
    "characterKey": "nimbusSchterzen",
    "faction": "zeon",
    "cost": 140,
    "shooting": 18,
    "melee": 26,
    "reaction": 23,
    "awakening": 0,
    "command": 14,
    "support": 5,
    "maintenance": 2,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "ace"
    ],
    "imagePath": ""
  },
  {
    "id": "marionWelch",
    "name": "マリオン・ウェルチ",
    "characterKey": "marionWelch",
    "faction": "zeon",
    "cost": 85,
    "shooting": 10,
    "melee": 6,
    "reaction": 18,
    "awakening": 24,
    "command": 5,
    "support": 16,
    "maintenance": 5,
    "roles": [
      "pilot",
      "operator"
    ],
    "specials": [],
    "isNewtype": true,
    "tags": [
      "newtype"
    ],
    "imagePath": ""
  },
  {
    "id": "ephaGaldrial",
    "name": "エファ・ガラドリアル",
    "characterKey": "ephaGaldrial",
    "faction": "zeon",
    "cost": 120,
    "shooting": 18,
    "melee": 10,
    "reaction": 22,
    "awakening": 26,
    "command": 5,
    "support": 8,
    "maintenance": 4,
    "roles": [
      "pilot"
    ],
    "specials": [
      "rivalry"
    ],
    "isNewtype": true,
    "tags": [
      "newtype"
    ],
    "imagePath": ""
  },
  {
    "id": "vischDonahue",
    "name": "ヴィッシュ・ドナヒュー",
    "characterKey": "vischDonahue",
    "faction": "zeon",
    "cost": 140,
    "shooting": 25,
    "melee": 22,
    "reaction": 26,
    "awakening": 0,
    "command": 20,
    "support": 12,
    "maintenance": 8,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "ace",
      "guerrillaTactics"
    ],
    "imagePath": ""
  },
  {
    "id": "walterCurtis",
    "name": "ウォルター・カーティス",
    "characterKey": "walterCurtis",
    "faction": "zeon",
    "cost": 120,
    "shooting": 6,
    "melee": 4,
    "reaction": 9,
    "awakening": 0,
    "command": 27,
    "support": 22,
    "maintenance": 8,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [
      "massProductionFormation"
    ],
    "imagePath": ""
  },
  {
    "id": "uriahHeep",
    "name": "ユライア・ヒープ",
    "characterKey": "uriahHeep",
    "faction": "zeon",
    "cost": 90,
    "shooting": 5,
    "melee": 3,
    "reaction": 8,
    "awakening": 0,
    "command": 22,
    "support": 25,
    "maintenance": 18,
    "roles": [
      "captain",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "mayaKoizumi",
    "name": "小泉 摩耶",
    "characterKey": "mayaKoizumi",
    "faction": "zeon",
    "cost": 85,
    "shooting": 8,
    "melee": 5,
    "reaction": 10,
    "awakening": 0,
    "command": 20,
    "support": 22,
    "maintenance": 10,
    "roles": [
      "commander",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "giocondaWillis",
    "name": "ジョコンダ・ウィリス",
    "characterKey": "giocondaWillis",
    "faction": "zeon",
    "cost": 60,
    "shooting": 7,
    "melee": 4,
    "reaction": 11,
    "awakening": 0,
    "command": 12,
    "support": 17,
    "maintenance": 7,
    "roles": [
      "operator",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "tinaDuvall",
    "name": "ティナ・デュバル",
    "characterKey": "tinaDuvall",
    "faction": "zeon",
    "cost": 80,
    "shooting": 17,
    "melee": 15,
    "reaction": 17,
    "awakening": 0,
    "command": 13,
    "support": 10,
    "maintenance": 8,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "alysonHannigan",
    "name": "アリソン・ハニガン",
    "characterKey": "alysonHannigan",
    "faction": "zeon",
    "cost": 75,
    "shooting": 5,
    "melee": 3,
    "reaction": 9,
    "awakening": 0,
    "command": 13,
    "support": 21,
    "maintenance": 16,
    "roles": [
      "operator",
      "mechanic"
    ],
    "specials": [
      "internalAudit"
    ],
    "imagePath": ""
  },
  {
    "id": "nearlight",
    "name": "ニアーライト",
    "characterKey": "nearlight",
    "faction": "zeon",
    "cost": 100,
    "shooting": 16,
    "melee": 12,
    "reaction": 18,
    "awakening": 0,
    "command": 19,
    "support": 6,
    "maintenance": 4,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "southBurningOyw",
    "name": "サウス・バニング",
    "characterKey": "southBurningOyw",
    "faction": "federation",
    "cost": 130,
    "shooting": 22,
    "melee": 18,
    "reaction": 22,
    "awakening": 0,
    "command": 24,
    "support": 14,
    "maintenance": 6,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "teamwork"
    ],
    "imagePath": ""
  },
  {
    "id": "alphaABateOyw",
    "name": "アルファ・A・ベイト",
    "characterKey": "alphaABateOyw",
    "faction": "federation",
    "cost": 95,
    "shooting": 20,
    "melee": 15,
    "reaction": 20,
    "awakening": 0,
    "command": 14,
    "support": 8,
    "maintenance": 4,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "bernardMonshaOyw",
    "name": "ベルナルド・モンシア",
    "characterKey": "bernardMonshaOyw",
    "faction": "federation",
    "cost": 110,
    "shooting": 21,
    "melee": 17,
    "reaction": 20,
    "awakening": 0,
    "command": 10,
    "support": 6,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [
      "rivalry"
    ],
    "imagePath": ""
  },
  {
    "id": "chapAdelOyw",
    "name": "チャップ・アデル",
    "characterKey": "chapAdelOyw",
    "faction": "federation",
    "cost": 90,
    "shooting": 18,
    "melee": 13,
    "reaction": 17,
    "awakening": 0,
    "command": 11,
    "support": 15,
    "maintenance": 5,
    "roles": [
      "pilot"
    ],
    "specials": [
      "allyBackup"
    ],
    "imagePath": ""
  },
  {
    "id": "gerhartSchmitzer",
    "name": "ゲラート・シュマイザー",
    "characterKey": "gerhartSchmitzer",
    "faction": "zeon",
    "cost": 140,
    "shooting": 20,
    "melee": 18,
    "reaction": 17,
    "awakening": 0,
    "command": 28,
    "support": 18,
    "maintenance": 8,
    "roles": [
      "pilot",
      "commander",
      "captain"
    ],
    "specials": [
      "guerrillaTactics"
    ],
    "imagePath": ""
  },
  {
    "id": "leRoar",
    "name": "ル・ローア",
    "characterKey": "leRoar",
    "faction": "zeon",
    "cost": 100,
    "shooting": 18,
    "melee": 13,
    "reaction": 18,
    "awakening": 0,
    "command": 20,
    "support": 13,
    "maintenance": 6,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "recon"
    ],
    "imagePath": ""
  },
  {
    "id": "matAustin",
    "name": "マット・オースティン",
    "characterKey": "matAustin",
    "faction": "zeon",
    "cost": 95,
    "shooting": 17,
    "melee": 18,
    "reaction": 16,
    "awakening": 0,
    "command": 18,
    "support": 16,
    "maintenance": 12,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "charlotteHepner",
    "name": "シャルロッテ・ヘープナー",
    "characterKey": "charlotteHepner",
    "faction": "zeon",
    "cost": 65,
    "shooting": 14,
    "melee": 12,
    "reaction": 15,
    "awakening": 0,
    "command": 12,
    "support": 15,
    "maintenance": 8,
    "roles": [
      "pilot",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "nickiRobert",
    "name": "ニッキ・ロベルト",
    "characterKey": "nickiRobert",
    "faction": "zeon",
    "cost": 80,
    "shooting": 15,
    "melee": 12,
    "reaction": 16,
    "awakening": 0,
    "command": 13,
    "support": 12,
    "maintenance": 6,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "leighSvagr",
    "name": "リィ・スワガー",
    "characterKey": "leighSvagr",
    "faction": "zeon",
    "cost": 75,
    "shooting": 19,
    "melee": 12,
    "reaction": 16,
    "awakening": 0,
    "command": 11,
    "support": 14,
    "maintenance": 7,
    "roles": [
      "pilot",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "renceh",
    "name": "レンチェフ",
    "characterKey": "renceh",
    "faction": "zeon",
    "cost": 110,
    "shooting": 22,
    "melee": 19,
    "reaction": 20,
    "awakening": 0,
    "command": 12,
    "support": 4,
    "maintenance": 3,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "manning",
    "name": "マニング",
    "characterKey": "manning",
    "faction": "zeon",
    "cost": 100,
    "shooting": 20,
    "melee": 18,
    "reaction": 19,
    "awakening": 0,
    "command": 14,
    "support": 13,
    "maintenance": 6,
    "roles": [
      "pilot"
    ],
    "specials": [
      "mourningResolve"
    ],
    "imagePath": ""
  },
  {
    "id": "sophieFranc",
    "name": "ソフィ・フラン",
    "characterKey": "sophieFranc",
    "faction": "zeon",
    "cost": 110,
    "shooting": 18,
    "melee": 21,
    "reaction": 19,
    "awakening": 0,
    "command": 14,
    "support": 12,
    "maintenance": 7,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "sandra",
    "name": "サンドラ",
    "characterKey": "sandra",
    "faction": "zeon",
    "cost": 95,
    "shooting": 21,
    "melee": 17,
    "reaction": 18,
    "awakening": 0,
    "command": 12,
    "support": 8,
    "maintenance": 6,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "migaki",
    "name": "ミガキ",
    "characterKey": "migaki",
    "faction": "zeon",
    "cost": 75,
    "shooting": 5,
    "melee": 3,
    "reaction": 8,
    "awakening": 0,
    "command": 15,
    "support": 18,
    "maintenance": 24,
    "roles": [
      "mechanic",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "fenrirBoyMechanic",
    "name": "少年整備兵",
    "characterKey": "fenrirBoyMechanic",
    "faction": "zeon",
    "cost": 50,
    "shooting": 4,
    "melee": 3,
    "reaction": 9,
    "awakening": 0,
    "command": 6,
    "support": 12,
    "maintenance": 22,
    "roles": [
      "mechanic",
      "operator"
    ],
    "specials": [
      "pilotSupply"
    ],
    "imagePath": ""
  },
  {
    "id": "eiger",
    "name": "エイガー",
    "characterKey": "eiger",
    "faction": "federation",
    "cost": 110,
    "shooting": 23,
    "melee": 14,
    "reaction": 19,
    "awakening": 0,
    "command": 22,
    "support": 10,
    "maintenance": 9,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "sakaki",
    "name": "サカキ",
    "characterKey": "sakaki",
    "faction": "federation",
    "cost": 60,
    "shooting": 16,
    "melee": 8,
    "reaction": 12,
    "awakening": 0,
    "command": 10,
    "support": 11,
    "maintenance": 6,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "matHeley",
    "name": "マット・ヒーリィ",
    "characterKey": "matHeley",
    "faction": "federation",
    "cost": 115,
    "shooting": 21,
    "melee": 16,
    "reaction": 22,
    "awakening": 0,
    "command": 20,
    "support": 15,
    "maintenance": 6,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "larryRadley",
    "name": "ラリー・ラドリー",
    "characterKey": "larryRadley",
    "faction": "federation",
    "cost": 100,
    "shooting": 23,
    "melee": 12,
    "reaction": 21,
    "awakening": 0,
    "command": 14,
    "support": 12,
    "maintenance": 4,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "anishRofman",
    "name": "アニッシュ・ロフマン",
    "characterKey": "anishRofman",
    "faction": "federation",
    "cost": 80,
    "shooting": 17,
    "melee": 14,
    "reaction": 16,
    "awakening": 0,
    "command": 11,
    "support": 12,
    "maintenance": 8,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "noelAnderson",
    "name": "ノエル・アンダーソン",
    "characterKey": "noelAnderson",
    "faction": "federation",
    "cost": 65,
    "shooting": 6,
    "melee": 4,
    "reaction": 10,
    "awakening": 0,
    "command": 15,
    "support": 20,
    "maintenance": 8,
    "roles": [
      "operator",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "rachelMilsteen",
    "name": "レーチェル・ミルスティーン",
    "characterKey": "rachelMilsteen",
    "faction": "federation",
    "cost": 75,
    "shooting": 5,
    "melee": 3,
    "reaction": 9,
    "awakening": 0,
    "command": 19,
    "support": 22,
    "maintenance": 15,
    "roles": [
      "captain",
      "operator",
      "mechanic"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "johnKowen",
    "name": "ジョン・コーウェン",
    "characterKey": "johnKowen",
    "faction": "federation",
    "cost": 110,
    "shooting": 7,
    "melee": 4,
    "reaction": 9,
    "awakening": 0,
    "command": 26,
    "support": 22,
    "maintenance": 12,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "rawtonDuchamp",
    "name": "ロートン・デュシャン",
    "characterKey": "rawtonDuchamp",
    "faction": "federation",
    "cost": 25,
    "shooting": 2,
    "melee": 2,
    "reaction": 6,
    "awakening": 0,
    "command": 4,
    "support": 12,
    "maintenance": 5,
    "roles": [
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "tokushima",
    "name": "トクシマ",
    "characterKey": "tokushima",
    "faction": "federation",
    "cost": 55,
    "shooting": 14,
    "melee": 11,
    "reaction": 13,
    "awakening": 0,
    "command": 7,
    "support": 6,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "kenBederstadt",
    "name": "ケン・ビーダーシュタット",
    "characterKey": "kenBederstadt",
    "faction": "zeon",
    "cost": 115,
    "shooting": 20,
    "melee": 18,
    "reaction": 22,
    "awakening": 0,
    "command": 21,
    "support": 16,
    "maintenance": 7,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "garskyZinobiev",
    "name": "ガースキー・ジノビエフ",
    "characterKey": "garskyZinobiev",
    "faction": "zeon",
    "cost": 95,
    "shooting": 18,
    "melee": 18,
    "reaction": 18,
    "awakening": 0,
    "command": 17,
    "support": 14,
    "maintenance": 5,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "yukiNakasato",
    "name": "ユウキ・ナカサト",
    "characterKey": "yukiNakasato",
    "faction": "zeon",
    "cost": 55,
    "shooting": 5,
    "melee": 3,
    "reaction": 9,
    "awakening": 0,
    "command": 10,
    "support": 19,
    "maintenance": 8,
    "roles": [
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "janeContie",
    "name": "ジェーン・コンティ",
    "characterKey": "janeContie",
    "faction": "zeon",
    "cost": 95,
    "shooting": 17,
    "melee": 15,
    "reaction": 18,
    "awakening": 0,
    "command": 20,
    "support": 21,
    "maintenance": 12,
    "roles": [
      "pilot",
      "operator",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "douglasRodin",
    "name": "ダグラス・ローデン",
    "characterKey": "douglasRodin",
    "faction": "zeon",
    "cost": 120,
    "shooting": 8,
    "melee": 5,
    "reaction": 10,
    "awakening": 0,
    "command": 28,
    "support": 23,
    "maintenance": 10,
    "roles": [
      "captain",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zeonSakaki",
    "name": "サカキ",
    "characterKey": "zeonSakaki",
    "faction": "zeon",
    "cost": 55,
    "shooting": 4,
    "melee": 3,
    "reaction": 7,
    "awakening": 0,
    "command": 12,
    "support": 18,
    "maintenance": 15,
    "roles": [
      "operator",
      "mechanic"
    ],
    "specials": [
      "pilotSupply"
    ],
    "imagePath": ""
  },
  {
    "id": "claudeGhoul",
    "name": "クロード",
    "characterKey": "claudeGhoul",
    "faction": "zeon",
    "cost": 115,
    "shooting": 21,
    "melee": 17,
    "reaction": 22,
    "awakening": 18,
    "command": 18,
    "support": 3,
    "maintenance": 2,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "madness"
    ],
    "isNewtype": true,
    "tags": [
      "newtype"
    ],
    "imagePath": ""
  },
  {
    "id": "claudiaGhoul",
    "name": "クローディア",
    "characterKey": "claudiaGhoul",
    "faction": "zeon",
    "cost": 85,
    "shooting": 17,
    "melee": 13,
    "reaction": 18,
    "awakening": 12,
    "command": 8,
    "support": 8,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "isNewtype": true,
    "tags": [
      "newtype"
    ],
    "imagePath": ""
  },
  {
    "id": "adaGhoul",
    "name": "エイダ",
    "characterKey": "adaGhoul",
    "faction": "zeon",
    "cost": 70,
    "shooting": 16,
    "melee": 11,
    "reaction": 15,
    "awakening": 0,
    "command": 6,
    "support": 5,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "alanAylward",
    "name": "アラン・アイルワード",
    "characterKey": "alanAylward",
    "faction": "federation",
    "cost": 105,
    "shooting": 19,
    "melee": 16,
    "reaction": 22,
    "awakening": 0,
    "command": 19,
    "support": 15,
    "maintenance": 5,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "teamwork"
    ],
    "imagePath": ""
  },
  {
    "id": "dennisBarrow",
    "name": "デニス・バロウ",
    "characterKey": "dennisBarrow",
    "faction": "federation",
    "cost": 100,
    "shooting": 22,
    "melee": 14,
    "reaction": 19,
    "awakening": 0,
    "command": 17,
    "support": 18,
    "maintenance": 8,
    "roles": [
      "pilot"
    ],
    "specials": [
      "allyBackup"
    ],
    "imagePath": ""
  },
  {
    "id": "lilSomers",
    "name": "リル・ソマーズ",
    "characterKey": "lilSomers",
    "faction": "federation",
    "cost": 90,
    "shooting": 18,
    "melee": 15,
    "reaction": 21,
    "awakening": 0,
    "command": 9,
    "support": 8,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [
      "rivalry"
    ],
    "imagePath": ""
  },
  {
    "id": "hoaBlanchett",
    "name": "ホア・ブランシェット",
    "characterKey": "hoaBlanchett",
    "faction": "federation",
    "cost": 65,
    "shooting": 4,
    "melee": 2,
    "reaction": 9,
    "awakening": 0,
    "command": 12,
    "support": 25,
    "maintenance": 9,
    "roles": [
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "leoBrower",
    "name": "レオ・ブラウアー",
    "characterKey": "leoBrower",
    "faction": "zeon",
    "cost": 105,
    "shooting": 18,
    "melee": 17,
    "reaction": 21,
    "awakening": 0,
    "command": 20,
    "support": 17,
    "maintenance": 5,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "retreatSupport"
    ],
    "imagePath": ""
  },
  {
    "id": "toldoBobrov",
    "name": "トルド・ボブロフ",
    "characterKey": "toldoBobrov",
    "faction": "zeon",
    "cost": 100,
    "shooting": 21,
    "melee": 16,
    "reaction": 17,
    "awakening": 0,
    "command": 13,
    "support": 14,
    "maintenance": 11,
    "roles": [
      "pilot"
    ],
    "specials": [
      "oldSoldierPride"
    ],
    "imagePath": ""
  },
  {
    "id": "klausBertrand",
    "name": "クラウス・ベルトラン",
    "characterKey": "klausBertrand",
    "faction": "zeon",
    "cost": 90,
    "shooting": 22,
    "melee": 12,
    "reaction": 18,
    "awakening": 0,
    "command": 18,
    "support": 19,
    "maintenance": 12,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "annFriberg",
    "name": "アン・フリーベリ",
    "characterKey": "annFriberg",
    "faction": "zeon",
    "cost": 45,
    "shooting": 10,
    "melee": 7,
    "reaction": 12,
    "awakening": 0,
    "command": 6,
    "support": 16,
    "maintenance": 6,
    "roles": [
      "pilot",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "travisKirkland",
    "name": "トラヴィス・カークランド",
    "characterKey": "travisKirkland",
    "faction": "federation",
    "cost": 110,
    "shooting": 18,
    "melee": 17,
    "reaction": 20,
    "awakening": 0,
    "command": 22,
    "support": 17,
    "maintenance": 7,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "fredReber",
    "name": "フレッド・リーバー",
    "characterKey": "fredReber",
    "faction": "federation",
    "cost": 95,
    "shooting": 15,
    "melee": 23,
    "reaction": 22,
    "awakening": 0,
    "command": 6,
    "support": 5,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "marvinHerriot",
    "name": "マーヴィン・ヘリオット",
    "characterKey": "marvinHerriot",
    "faction": "federation",
    "cost": 95,
    "shooting": 22,
    "melee": 10,
    "reaction": 16,
    "awakening": 0,
    "command": 13,
    "support": 15,
    "maintenance": 12,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "edwardLee",
    "name": "エドワード・リー",
    "characterKey": "edwardLee",
    "faction": "federation",
    "cost": 55,
    "shooting": 10,
    "melee": 7,
    "reaction": 13,
    "awakening": 0,
    "command": 5,
    "support": 14,
    "maintenance": 17,
    "roles": [
      "pilot",
      "mechanic"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "dorisBrandt",
    "name": "ドリス・ブラント",
    "characterKey": "dorisBrandt",
    "faction": "federation",
    "cost": 75,
    "shooting": 4,
    "melee": 2,
    "reaction": 10,
    "awakening": 0,
    "command": 10,
    "support": 25,
    "maintenance": 8,
    "roles": [
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "chloeCroce",
    "name": "クロエ・クローチェ",
    "characterKey": "chloeCroce",
    "faction": "federation",
    "cost": 125,
    "shooting": 21,
    "melee": 18,
    "reaction": 24,
    "awakening": 24,
    "command": 3,
    "support": 4,
    "maintenance": 2,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "isNewtype": true,
    "tags": [
      "newtype",
      "cyberNewtype"
    ],
    "imagePath": ""
  },
  {
    "id": "vincentGleissner",
    "name": "ヴィンセント・グライスナー",
    "characterKey": "vincentGleissner",
    "faction": "zeon",
    "cost": 120,
    "shooting": 20,
    "melee": 19,
    "reaction": 23,
    "awakening": 0,
    "command": 17,
    "support": 14,
    "maintenance": 6,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "dougSchneid",
    "name": "ダグ・シュナイド",
    "characterKey": "dougSchneid",
    "faction": "zeon",
    "cost": 130,
    "shooting": 18,
    "melee": 24,
    "reaction": 22,
    "awakening": 0,
    "command": 26,
    "support": 18,
    "maintenance": 8,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "liberioLincke",
    "name": "リベリオ・リンケ",
    "characterKey": "liberioLincke",
    "faction": "zeon",
    "cost": 90,
    "shooting": 22,
    "melee": 10,
    "reaction": 20,
    "awakening": 0,
    "command": 8,
    "support": 12,
    "maintenance": 5,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "guyHelmuth",
    "name": "ギー・ヘルムート",
    "characterKey": "guyHelmuth",
    "faction": "zeon",
    "cost": 100,
    "shooting": 14,
    "melee": 23,
    "reaction": 20,
    "awakening": 0,
    "command": 12,
    "support": 5,
    "maintenance": 3,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "severoOswald",
    "name": "セベロ・オズワルド",
    "characterKey": "severoOswald",
    "faction": "zeon",
    "cost": 95,
    "shooting": 20,
    "melee": 15,
    "reaction": 18,
    "awakening": 0,
    "command": 20,
    "support": 9,
    "maintenance": 5,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "anneroseRosenheim",
    "name": "アンネローゼ・ローゼンハイン",
    "characterKey": "anneroseRosenheim",
    "faction": "zeon",
    "cost": 105,
    "shooting": 18,
    "melee": 12,
    "reaction": 20,
    "awakening": 22,
    "command": 5,
    "support": 10,
    "maintenance": 4,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "isNewtype": true,
    "tags": [
      "newtype"
    ],
    "imagePath": ""
  },
  {
    "id": "albertBell",
    "name": "アルバート・ベル",
    "characterKey": "albertBell",
    "faction": "zeon",
    "cost": 65,
    "shooting": 12,
    "melee": 8,
    "reaction": 14,
    "awakening": 0,
    "command": 4,
    "support": 8,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "huguesCourand",
    "name": "ユーグ・クーロ",
    "characterKey": "huguesCourand",
    "faction": "federation",
    "cost": 125,
    "shooting": 21,
    "melee": 19,
    "reaction": 22,
    "awakening": 0,
    "command": 24,
    "support": 15,
    "maintenance": 4,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "desperateRearGuard"
    ],
    "imagePath": ""
  },
  {
    "id": "hughCarter",
    "name": "ヒュー・カーター",
    "characterKey": "hughCarter",
    "faction": "federation",
    "cost": 85,
    "shooting": 17,
    "melee": 15,
    "reaction": 17,
    "awakening": 0,
    "command": 8,
    "support": 13,
    "maintenance": 6,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "erikBlanke",
    "name": "エリク・ブランケ",
    "characterKey": "erikBlanke",
    "faction": "zeon",
    "cost": 130,
    "shooting": 20,
    "melee": 18,
    "reaction": 22,
    "awakening": 0,
    "command": 25,
    "support": 14,
    "maintenance": 5,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "commanderStealth"
    ],
    "imagePath": ""
  },
  {
    "id": "airosBarde",
    "name": "アイロス・バーデ",
    "characterKey": "airosBarde",
    "faction": "zeon",
    "cost": 95,
    "shooting": 17,
    "melee": 14,
    "reaction": 18,
    "awakening": 0,
    "command": 18,
    "support": 17,
    "maintenance": 6,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "fritzBauer",
    "name": "フリッツ・バウアー",
    "characterKey": "fritzBauer",
    "faction": "zeon",
    "cost": 80,
    "shooting": 16,
    "melee": 17,
    "reaction": 16,
    "awakening": 0,
    "command": 6,
    "support": 9,
    "maintenance": 4,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "christoDoerr",
    "name": "クリスト・デーア",
    "characterKey": "christoDoerr",
    "faction": "zeon",
    "cost": 90,
    "shooting": 15,
    "melee": 19,
    "reaction": 17,
    "awakening": 0,
    "command": 12,
    "support": 14,
    "maintenance": 12,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "tatianaDoerr",
    "name": "タチアナ・デーア",
    "characterKey": "tatianaDoerr",
    "faction": "zeon",
    "cost": 100,
    "shooting": 18,
    "melee": 14,
    "reaction": 20,
    "awakening": 0,
    "command": 7,
    "support": 16,
    "maintenance": 8,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "almaStirner",
    "name": "アルマ・シュティルナー",
    "characterKey": "almaStirner",
    "faction": "zeon",
    "cost": 120,
    "shooting": 19,
    "melee": 20,
    "reaction": 22,
    "awakening": 10,
    "command": 13,
    "support": 10,
    "maintenance": 5,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "outstandingTalent"
    ],
    "imagePath": ""
  },
  {
    "id": "miaBrinkman",
    "name": "ミア・ブリンクマン",
    "characterKey": "miaBrinkman",
    "faction": "zeon",
    "cost": 90,
    "shooting": 17,
    "melee": 10,
    "reaction": 15,
    "awakening": 0,
    "command": 10,
    "support": 18,
    "maintenance": 24,
    "roles": [
      "pilot",
      "mechanic",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "helenaHegel",
    "name": "ヘレナ・ヘーゲル",
    "characterKey": "helenaHegel",
    "faction": "zeon",
    "cost": 105,
    "shooting": 23,
    "melee": 17,
    "reaction": 21,
    "awakening": 0,
    "command": 9,
    "support": 10,
    "maintenance": 4,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "killyGarrett",
    "name": "キリー・ギャレット",
    "characterKey": "killyGarrett",
    "faction": "zeon",
    "cost": 140,
    "shooting": 21,
    "melee": 19,
    "reaction": 21,
    "awakening": 0,
    "command": 27,
    "support": 20,
    "maintenance": 6,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "commanderStealth"
    ],
    "imagePath": ""
  },
  {
    "id": "barbaraHahli",
    "name": "バルバラ・ハハリ",
    "characterKey": "barbaraHahli",
    "faction": "zeon",
    "cost": 85,
    "shooting": 7,
    "melee": 5,
    "reaction": 10,
    "awakening": 0,
    "command": 22,
    "support": 24,
    "maintenance": 9,
    "roles": [
      "operator",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "irmelaGruber",
    "name": "イルメラ・グルーバー",
    "characterKey": "irmelaGruber",
    "faction": "zeon",
    "cost": 80,
    "shooting": 5,
    "melee": 3,
    "reaction": 9,
    "awakening": 0,
    "command": 9,
    "support": 20,
    "maintenance": 27,
    "roles": [
      "mechanic",
      "operator"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "lilithAiden",
    "name": "リリス・エイデン",
    "characterKey": "lilithAiden",
    "faction": "federation",
    "cost": 135,
    "shooting": 19,
    "melee": 25,
    "reaction": 24,
    "awakening": 8,
    "command": 8,
    "support": 5,
    "maintenance": 3,
    "roles": [
      "pilot"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "barryAbbot",
    "name": "バリー・アボット",
    "characterKey": "barryAbbot",
    "faction": "federation",
    "cost": 120,
    "shooting": 21,
    "melee": 17,
    "reaction": 20,
    "awakening": 0,
    "command": 24,
    "support": 18,
    "maintenance": 5,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "renatoGermi",
    "name": "レナート・ジェルミ",
    "characterKey": "renatoGermi",
    "faction": "federation",
    "cost": 115,
    "shooting": 20,
    "melee": 23,
    "reaction": 22,
    "awakening": 0,
    "command": 20,
    "support": 4,
    "maintenance": 2,
    "roles": [
      "pilot",
      "commander"
    ],
    "specials": [
      "madness"
    ],
    "imagePath": ""
  }
];
