"use strict";

// Battleship cards.
window.GAME_DATA = window.GAME_DATA ?? {};
window.GAME_DATA.battleships = [
  {
    "id": "gunperry",
    "name": "ガンペリー",
    "faction": "federation",
    "cost": 120,
    "armor": 760,
    "energy": 90,
    "agility": 2,
    "mobility": 2,
    "mapTypes": [
      "ground"
    ],
    "weaponIds": [
      "gunperryMissile",
      "antiAirGun"
    ],
    "support": {
      "armor": 18,
      "shield": 8,
      "energy": 18,
      "ammo": 1
    },
    "imagePath": ""
  },
  {
    "id": "medea",
    "name": "ミデア",
    "faction": "federation",
    "cost": 150,
    "armor": 860,
    "energy": 95,
    "agility": 3,
    "mobility": 3,
    "mapTypes": [
      "ground"
    ],
    "weaponIds": [
      "antiAirGun"
    ],
    "support": {
      "armor": 30,
      "shield": 14,
      "energy": 30,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "juno",
    "name": "ジュノー",
    "faction": "federation",
    "cost": 135,
    "armor": 780,
    "energy": 90,
    "agility": 3,
    "mobility": 3,
    "mapTypes": [
      "ground"
    ],
    "movementType": "submarine",
    "weaponIds": [
      "submarineTorpedo",
      "submarineMissile"
    ],
    "support": {
      "armor": 24,
      "shield": 10,
      "energy": 26,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "himalaya",
    "name": "ヒマラヤ",
    "faction": "federation",
    "cost": 250,
    "armor": 1260,
    "energy": 135,
    "agility": 2,
    "mobility": 2,
    "mapTypes": [
      "ground"
    ],
    "weaponIds": [
      "federationShipMissile",
      "submarineTorpedo",
      "rapidFireCannon"
    ],
    "support": {
      "armor": 34,
      "shield": 16,
      "energy": 30,
      "ammo": 3
    },
    "imagePath": ""
  },
  {
    "id": "salamis",
    "name": "サラミス",
    "faction": "federation",
    "cost": 170,
    "armor": 950,
    "energy": 130,
    "agility": 2,
    "mobility": 2,
    "mapTypes": [
      "space"
    ],
    "weaponIds": [
      "singleMegaParticleCannon",
      "federationShipMissile"
    ],
    "support": {
      "armor": 24,
      "shield": 12,
      "energy": 24,
      "ammo": 1
    },
    "imagePath": ""
  },
  {
    "id": "whiteBase",
    "name": "ホワイトベース",
    "faction": "federation",
    "cost": 300,
    "armor": 1300,
    "energy": 170,
    "agility": 4,
    "mobility": 3,
    "mapTypes": [
      "ground",
      "space"
    ],
    "weaponIds": [
      "dualMegaParticleCannon",
      "federationShipMissile",
      "antiAirGun"
    ],
    "support": {
      "armor": 34,
      "shield": 18,
      "energy": 34,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "columbus",
    "name": "コロンブス",
    "faction": "federation",
    "cost": 110,
    "armor": 720,
    "energy": 90,
    "agility": 2,
    "mobility": 2,
    "mapTypes": [
      "space"
    ],
    "weaponIds": [
      "transportMachineGun"
    ],
    "support": {
      "armor": 34,
      "shield": 16,
      "energy": 36,
      "ammo": 3
    },
    "imagePath": ""
  },
  {
    "id": "bigTray",
    "name": "ビッグ・トレー",
    "faction": "federation",
    "cost": 260,
    "armor": 1420,
    "energy": 135,
    "agility": 1,
    "mobility": 2,
    "mapTypes": [
      "ground"
    ],
    "weaponIds": [
      "tripleShipCannon",
      "heavySiegeCannon",
      "antiAirGun"
    ],
    "support": {
      "armor": 30,
      "shield": 14,
      "energy": 24,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "heavyFork",
    "name": "ヘビィ・フォーク",
    "faction": "federation",
    "cost": 220,
    "armor": 1160,
    "energy": 120,
    "agility": 2,
    "mobility": 2,
    "mapTypes": [
      "ground"
    ],
    "weaponIds": [
      "tripleShipCannon",
      "antiAirGun"
    ],
    "support": {
      "armor": 26,
      "shield": 12,
      "energy": 22,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "magellan",
    "name": "マゼラン",
    "faction": "federation",
    "cost": 230,
    "armor": 1180,
    "energy": 155,
    "agility": 1,
    "mobility": 2,
    "mapTypes": [
      "space"
    ],
    "weaponIds": [
      "dualMegaParticleCannon",
      "federationShipMissile",
      "shipCannon"
    ],
    "support": {
      "armor": 28,
      "shield": 14,
      "energy": 28,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "blancRival",
    "name": "ブランリヴァル",
    "faction": "federation",
    "cost": 330,
    "armor": 1450,
    "energy": 185,
    "agility": 4,
    "mobility": 3,
    "mapTypes": [
      "ground",
      "space"
    ],
    "weaponIds": [
      "dualMegaParticleCannon",
      "federationShipMissile",
      "antiAirGun"
    ],
    "support": {
      "armor": 38,
      "shield": 20,
      "energy": 36,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "thoroughbred",
    "name": "サラブレッド",
    "faction": "federation",
    "cost": 330,
    "armor": 1320,
    "energy": 190,
    "agility": 5,
    "mobility": 4,
    "mapTypes": [
      "ground",
      "space"
    ],
    "weaponIds": [
      "dualMegaParticleCannon",
      "federationShipMissile",
      "antiAirGun"
    ],
    "support": {
      "armor": 34,
      "shield": 18,
      "energy": 38,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "albion",
    "name": "アルビオン",
    "faction": "federation",
    "cost": 390,
    "armor": 1500,
    "energy": 210,
    "agility": 5,
    "mobility": 4,
    "mapTypes": [
      "ground",
      "space"
    ],
    "weaponIds": [
      "pegasusMegaParticleCannon",
      "federationShipMissile",
      "antiAirGun"
    ],
    "support": {
      "armor": 40,
      "shield": 22,
      "energy": 42,
      "ammo": 3
    },
    "imagePath": ""
  },
  {
    "id": "gaw",
    "name": "ガウ",
    "faction": "zeon",
    "cost": 190,
    "armor": 1060,
    "energy": 130,
    "agility": 2,
    "mobility": 2,
    "mapTypes": [
      "ground"
    ],
    "weaponIds": [
      "dualMegaParticleCannon",
      "antiGroundBombing"
    ],
    "support": {
      "armor": 24,
      "shield": 12,
      "energy": 24,
      "ammo": 1
    },
    "imagePath": ""
  },
  {
    "id": "fatUncle",
    "name": "ファット・アンクル",
    "faction": "zeon",
    "cost": 145,
    "armor": 840,
    "energy": 105,
    "agility": 3,
    "mobility": 2,
    "mapTypes": [
      "ground"
    ],
    "weaponIds": [
      "singleMegaParticleCannon",
      "shipMissile"
    ],
    "support": {
      "armor": 28,
      "shield": 14,
      "energy": 28,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "yukon",
    "name": "ユーコン",
    "faction": "zeon",
    "cost": 130,
    "armor": 760,
    "energy": 88,
    "agility": 4,
    "mobility": 3,
    "mapTypes": [
      "ground"
    ],
    "movementType": "submarine",
    "weaponIds": [
      "submarineTorpedo",
      "submarineMissile"
    ],
    "support": {
      "armor": 24,
      "shield": 10,
      "energy": 24,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "madAngler",
    "name": "マッド・アングラー",
    "faction": "zeon",
    "cost": 260,
    "armor": 1360,
    "energy": 145,
    "agility": 2,
    "mobility": 3,
    "mapTypes": [
      "ground"
    ],
    "movementType": "submarine",
    "weaponIds": [
      "submarineTorpedo",
      "submarineMissile",
      "shipMissile"
    ],
    "support": {
      "armor": 36,
      "shield": 18,
      "energy": 34,
      "ammo": 3
    },
    "imagePath": ""
  },
  {
    "id": "musai",
    "name": "ムサイ",
    "faction": "zeon",
    "cost": 180,
    "armor": 1000,
    "energy": 140,
    "agility": 2,
    "mobility": 2,
    "mapTypes": [
      "space"
    ],
    "weaponIds": [
      "dualMegaParticleCannon",
      "missileLauncher"
    ],
    "support": {
      "armor": 28,
      "shield": 14,
      "energy": 28,
      "ammo": 2
    },
    "escapeShipId": "komusai",
    "imagePath": ""
  },
  {
    "id": "komusai",
    "name": "コムサイ",
    "faction": "zeon",
    "cost": 0,
    "armor": 240,
    "energy": 45,
    "agility": 8,
    "mobility": 4,
    "mapTypes": [
      "space"
    ],
    "selectable": false,
    "weaponIds": [
      "escapeVulcan"
    ],
    "support": {
      "armor": 0,
      "shield": 0,
      "energy": 0,
      "ammo": 0
    },
    "imagePath": ""
  },
  {
    "id": "zanzibar",
    "name": "ザンジバル",
    "faction": "zeon",
    "cost": 280,
    "armor": 1250,
    "energy": 170,
    "agility": 4,
    "mobility": 3,
    "mapTypes": [
      "ground",
      "space"
    ],
    "weaponIds": [
      "dualMegaParticleCannon",
      "shipMissile",
      "antiAirGun"
    ],
    "support": {
      "armor": 36,
      "shield": 18,
      "energy": 36,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "gallop",
    "name": "ギャロップ",
    "faction": "zeon",
    "cost": 115,
    "armor": 700,
    "energy": 95,
    "agility": 3,
    "mobility": 3,
    "mapTypes": [
      "ground"
    ],
    "weaponIds": [
      "gallopTwinCannon",
      "antiAirGun"
    ],
    "support": {
      "armor": 24,
      "shield": 12,
      "energy": 26,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "dabude",
    "name": "ダブデ",
    "faction": "zeon",
    "cost": 265,
    "armor": 1450,
    "energy": 160,
    "agility": 1,
    "mobility": 2,
    "mapTypes": [
      "ground"
    ],
    "weaponIds": [
      "dabudeTwinMegaParticleCannon",
      "zeonTwinShipCannon"
    ],
    "support": {
      "armor": 32,
      "shield": 16,
      "energy": 28,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "papua",
    "name": "パプア",
    "faction": "zeon",
    "cost": 105,
    "armor": 680,
    "energy": 85,
    "agility": 2,
    "mobility": 2,
    "mapTypes": [
      "space"
    ],
    "weaponIds": [
      "transportMachineGun"
    ],
    "support": {
      "armor": 36,
      "shield": 16,
      "energy": 38,
      "ammo": 3
    },
    "imagePath": ""
  },
  {
    "id": "chibe",
    "name": "チベ",
    "faction": "zeon",
    "cost": 245,
    "armor": 1200,
    "energy": 165,
    "agility": 2,
    "mobility": 2,
    "mapTypes": [
      "space"
    ],
    "weaponIds": [
      "tripleMegaParticleCannon",
      "missileLauncher"
    ],
    "support": {
      "armor": 30,
      "shield": 15,
      "energy": 30,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "gwazine",
    "name": "グワジン",
    "faction": "zeon",
    "cost": 360,
    "armor": 1600,
    "energy": 220,
    "agility": 1,
    "mobility": 2,
    "mapTypes": [
      "space"
    ],
    "weaponIds": [
      "tripleMegaParticleCannon",
      "tenBarrelMegaParticleSubGun",
      "missileLauncher"
    ],
    "support": {
      "armor": 38,
      "shield": 20,
      "energy": 36,
      "ammo": 3
    },
    "imagePath": ""
  },
  {
    "id": "kerguelen",
    "name": "ケルゲレン",
    "faction": "zeon",
    "cost": 260,
    "armor": 1120,
    "energy": 170,
    "agility": 5,
    "mobility": 4,
    "mapTypes": [
      "ground",
      "space"
    ],
    "weaponIds": [
      "dualMegaParticleCannon",
      "shipMissile",
      "antiAirGun"
    ],
    "support": {
      "armor": 34,
      "shield": 17,
      "energy": 36,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "liliMarlene",
    "name": "リリー・マルレーン",
    "faction": "zeon",
    "cost": 340,
    "armor": 1400,
    "energy": 200,
    "agility": 4,
    "mobility": 3,
    "mapTypes": [
      "ground",
      "space"
    ],
    "weaponIds": [
      "zanzibarTwoMegaParticleCannon",
      "dualMegaParticleCannon",
      "antiAirGun"
    ],
    "support": {
      "armor": 38,
      "shield": 20,
      "energy": 40,
      "ammo": 2
    },
    "imagePath": ""
  },
  {
    "id": "dolos",
    "name": "ドロス級空母",
    "faction": "zeon",
    "cost": 420,
    "armor": 2100,
    "energy": 260,
    "agility": 0,
    "mobility": 1,
    "mapTypes": [
      "space"
    ],
    "weaponIds": [
      "tenBarrelMegaParticleSubGun",
      "tripleMegaParticleCannon",
      "antiAirGun"
    ],
    "support": {
      "armor": 48,
      "shield": 24,
      "energy": 52,
      "ammo": 4
    },
    "imagePath": ""
  },
  {
    "id": "grayPhantom",
    "name": "グレイファントム",
    "faction": "federation",
    "cost": 240,
    "armor": 1120,
    "energy": 145,
    "agility": 3,
    "mobility": 3,
    "mapTypes": [
      "ground",
      "space"
    ],
    "weaponIds": [
      "dualMegaParticleCannon",
      "federationShipMissile"
    ],
    "support": {
      "armor": 28,
      "shield": 14,
      "energy": 28,
      "ammo": 1
    },
    "imagePath": ""
  }
];
