"use strict";

// Mobile suit and mobile armor cards.
window.GAME_DATA = window.GAME_DATA ?? {};
window.GAME_DATA.mobileSuits = [
  {
    "id": "ball",
    "name": "ボール",
    "faction": "federation",
    "cost": 55,
    "armor": 150,
    "energy": 35,
    "agility": 8,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "ballCannon"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": true
    },
    "tags": [
      "ball",
      "supportPod"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "type61Tank",
    "name": "61式戦車",
    "faction": "federation",
    "cost": 50,
    "armor": 180,
    "energy": 30,
    "agility": 6,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "tankGun55mm"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "tank",
      "groundVehicle"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "coreFighter",
    "name": "コア・ファイター",
    "faction": "federation",
    "cost": 70,
    "armor": 120,
    "energy": 45,
    "agility": 26,
    "mobility": 6,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "coreFighter",
      "escapeUnit"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "coreBooster",
    "name": "コア・ブースター",
    "faction": "federation",
    "cost": 125,
    "armor": 170,
    "energy": 75,
    "agility": 28,
    "mobility": 7,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "coreBoosterMegaParticleCannon",
      "aircraftVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "coreFighter",
      "coreBooster"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gFighter",
    "name": "Gファイター",
    "faction": "federation",
    "cost": 155,
    "armor": 240,
    "energy": 90,
    "agility": 21,
    "mobility": 6,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "gFighterBeamCannon",
      "gFighterNoseMissile"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gParts",
      "gFighter",
      "federationAircraft"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "toriares",
    "name": "トリアーエズ",
    "faction": "federation",
    "cost": 40,
    "armor": 75,
    "energy": 28,
    "agility": 22,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "aircraftVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "federationAircraft",
      "lowCostFighter"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "tinCod",
    "name": "TINコッド",
    "faction": "federation",
    "cost": 55,
    "armor": 90,
    "energy": 32,
    "agility": 24,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "aircraftVulcan",
      "fighterMissile"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "federationAircraft",
      "lowCostFighter"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "saberfish",
    "name": "セイバーフィッシュ",
    "faction": "federation",
    "cost": 70,
    "armor": 105,
    "energy": 38,
    "agility": 26,
    "mobility": 6,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "fighterMissile",
      "aircraftVulcan"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "federationAircraft",
      "spaceFighter"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "flyManta",
    "name": "フライ・マンタ",
    "faction": "federation",
    "cost": 65,
    "armor": 105,
    "energy": 34,
    "agility": 18,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "heavyBomb",
      "fighterMissile"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "federationAircraft",
      "bomber"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "deppRog",
    "name": "デプ・ロッグ",
    "faction": "federation",
    "cost": 85,
    "armor": 145,
    "energy": 38,
    "agility": 12,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "heavyBomb",
      "fighterMissile"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "federationAircraft",
      "bomber"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "donEscargot",
    "name": "ドン・エスカルゴ",
    "faction": "federation",
    "cost": 75,
    "armor": 145,
    "energy": 36,
    "agility": 13,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "antiSubMissile",
      "fighterMissile"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "federationAircraft",
      "antiSubmarine",
      "supportAircraft"
    ],
    "specials": [
      "antiSubmarine"
    ],
    "imagePath": ""
  },
  {
    "id": "fanfan",
    "name": "ファンファン",
    "faction": "federation",
    "cost": 35,
    "armor": 60,
    "energy": 24,
    "agility": 20,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "fighterMissile"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "federationAircraft",
      "hovercraft",
      "lowCostFighter"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "dish",
    "name": "ディッシュ",
    "faction": "federation",
    "cost": 50,
    "armor": 100,
    "energy": 30,
    "agility": 18,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "aircraftVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "federationAircraft",
      "recon",
      "supportAircraft"
    ],
    "specials": [
      "recon"
    ],
    "imagePath": ""
  },
  {
    "id": "public",
    "name": "パブリク",
    "faction": "federation",
    "cost": 70,
    "armor": 120,
    "energy": 45,
    "agility": 16,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "beamDisruptionRocket"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "federationAircraft",
      "spaceFighter",
      "supportAircraft"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gm",
    "name": "ジム",
    "faction": "federation",
    "cost": 130,
    "armor": 250,
    "energy": 70,
    "agility": 16,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamSaber"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gundam",
    "name": "ガンダム",
    "faction": "federation",
    "cost": 250,
    "armor": 350,
    "energy": 110,
    "agility": 24,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamSaber"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gundam",
      "vProject"
    ],
    "specials": [
      "coreSystem"
    ],
    "escapeMsId": "coreFighter",
    "imagePath": ""
  },
  {
    "id": "gundamMc",
    "name": "ガンダム（MC）",
    "faction": "federation",
    "cost": 290,
    "armor": 350,
    "energy": 115,
    "agility": 31,
    "mobility": 6,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamSaber"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gundam",
      "vProject",
      "highMobility",
      "magnetCoating"
    ],
    "specials": [
      "coreSystem"
    ],
    "escapeMsId": "coreFighter",
    "imagePath": ""
  },
  {
    "id": "prototypeGundam",
    "name": "プロトタイプ・ガンダム",
    "faction": "federation",
    "cost": 230,
    "armor": 330,
    "energy": 100,
    "agility": 22,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamJavelin"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gundam",
      "vProject"
    ],
    "specials": [
      "coreSystem"
    ],
    "escapeMsId": "coreFighter",
    "imagePath": ""
  },
  {
    "id": "g3Gundam",
    "name": "G-3ガンダム",
    "faction": "federation",
    "cost": 290,
    "armor": 350,
    "energy": 120,
    "agility": 28,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamSaberTwin"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gundam",
      "vProject",
      "highMobility",
      "magnetCoating"
    ],
    "specials": [
      "coreSystem"
    ],
    "escapeMsId": "coreFighter",
    "imagePath": ""
  },
  {
    "id": "gBull",
    "name": "Gブル",
    "faction": "federation",
    "cost": 165,
    "armor": 320,
    "energy": 90,
    "agility": 8,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "gBullBeamCannon"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gParts",
      "tank",
      "vProject"
    ],
    "specials": [
      "coreSystem"
    ],
    "escapeMsId": "coreFighter",
    "imagePath": ""
  },
  {
    "id": "gArmor",
    "name": "Gアーマー",
    "faction": "federation",
    "cost": 455,
    "armor": 540,
    "energy": 145,
    "agility": 20,
    "mobility": 6,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "gFighterBeamCannon",
      "gFighterNoseMissile"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gParts",
      "gundam",
      "armorPack",
      "vProject"
    ],
    "specials": [
      "coreSystem"
    ],
    "escapeMsId": "gundam",
    "escapeWeaponIds": [
      "shield"
    ],
    "imagePath": ""
  },
  {
    "id": "guncannon",
    "name": "ガンキャノン",
    "faction": "federation",
    "cost": 230,
    "armor": 380,
    "energy": 85,
    "agility": 11,
    "mobility": 3,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "cannon",
      "headVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "guncannon",
      "vProject",
      "cannonMs"
    ],
    "specials": [
      "coreSystem"
    ],
    "escapeMsId": "coreFighter",
    "imagePath": ""
  },
  {
    "id": "guncannonSml",
    "name": "ガンキャノン（SML）",
    "faction": "federation",
    "cost": 220,
    "armor": 380,
    "energy": 85,
    "agility": 12,
    "mobility": 3,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "sprayMissileLauncher",
      "headVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "guncannon",
      "vProject",
      "missileMs"
    ],
    "specials": [
      "coreSystem"
    ],
    "escapeMsId": "coreFighter",
    "imagePath": ""
  },
  {
    "id": "guntank",
    "name": "ガンタンク",
    "faction": "federation",
    "cost": 210,
    "armor": 430,
    "energy": 70,
    "agility": 7,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "guntankLowRecoilCannon",
      "bopMissile",
      "headVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "guntank",
      "vProject",
      "tank"
    ],
    "specials": [
      "coreSystem"
    ],
    "escapeMsId": "coreFighter",
    "imagePath": ""
  },
  {
    "id": "gmCommander",
    "name": "ジム指揮官用",
    "faction": "federation",
    "cost": 160,
    "armor": 265,
    "energy": 78,
    "agility": 19,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamSaberTwin"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "commanderCustom",
      "federationMassProduction"
    ],
    "specials": [
      "commanderCustom"
    ],
    "imagePath": ""
  },
  {
    "id": "gmCannon",
    "name": "ジム・キャノン",
    "faction": "federation",
    "cost": 165,
    "armor": 260,
    "energy": 70,
    "agility": 11,
    "mobility": 3,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "gmCannonCannon",
      "headVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "cannonMs",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zaku1",
    "name": "ザクI",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 85,
    "armor": 220,
    "energy": 40,
    "agility": 11,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "shoulderTackle"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "zaku1"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zaku2",
    "name": "ザクII",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 105,
    "armor": 260,
    "energy": 55,
    "agility": 14,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk",
      "zakuShoulderShield"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "zaku2"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "charZaku2S",
    "name": "ザクIIS型（シャア機）",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 165,
    "armor": 260,
    "energy": 60,
    "agility": 22,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk",
      "zakuShoulderShield"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "zaku2",
      "highMobility",
      "charCustom"
    ],
    "specials": [
      "commanderCustom"
    ],
    "imagePath": ""
  },
  {
    "id": "gouf",
    "name": "グフ",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 175,
    "armor": 320,
    "energy": 65,
    "agility": 21,
    "mobility": 5,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatSword",
      "heatRod",
      "fingerVulcan"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gouf",
      "meleeMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "dom",
    "name": "ドム",
    "faction": "zeon",
    "cost": 225,
    "armor": 370,
    "energy": 80,
    "agility": 18,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatSaber",
      "spreadBeam"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "dom"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "rickDom",
    "name": "リック・ドム",
    "faction": "zeon",
    "cost": 240,
    "armor": 360,
    "energy": 85,
    "agility": 20,
    "mobility": 6,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatSaber",
      "spreadBeam"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "dom",
      "rickDom"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gelgoog",
    "name": "ゲルググ",
    "faction": "zeon",
    "cost": 260,
    "armor": 360,
    "energy": 110,
    "agility": 24,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamNaginata"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gelgoog"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gogg",
    "name": "ゴッグ",
    "faction": "zeon",
    "cost": 185,
    "armor": 410,
    "energy": 85,
    "agility": 10,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "ironNail",
      "aquaticMegaParticleCannon",
      "waterJetMissile"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": true,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "aquatic",
      "gogg"
    ],
    "specials": [
      "freezyYard"
    ],
    "imagePath": ""
  },
  {
    "id": "zgok",
    "name": "ズゴック",
    "faction": "zeon",
    "cost": 210,
    "armor": 340,
    "energy": 95,
    "agility": 21,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "ironNail",
      "aquaticMegaParticleCannon",
      "waterJetMissile"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": true,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "aquatic",
      "zgok"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "charZgok",
    "name": "ズゴック（シャア機）",
    "faction": "zeon",
    "cost": 250,
    "armor": 340,
    "energy": 100,
    "agility": 27,
    "mobility": 6,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "ironNail",
      "aquaticMegaParticleCannon",
      "waterJetMissile"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": true,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "aquatic",
      "zgok",
      "highMobility",
      "charCustom"
    ],
    "specials": [
      "commanderCustom"
    ],
    "imagePath": ""
  },
  {
    "id": "acguy",
    "name": "アッガイ",
    "faction": "zeon",
    "cost": 135,
    "armor": 260,
    "energy": 60,
    "agility": 17,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "ironNail",
      "aquaticMegaParticleCannon",
      "acguyArmMissileLauncher"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": true,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "aquatic",
      "acguy",
      "stealthMs"
    ],
    "specials": [
      "stealth"
    ],
    "imagePath": ""
  },
  {
    "id": "zock",
    "name": "ゾック",
    "faction": "zeon",
    "cost": 235,
    "armor": 430,
    "energy": 120,
    "agility": 5,
    "mobility": 2,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "ironNail",
      "zockMegaParticleCannon",
      "zockHeadMegaParticleCannon"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": true,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "aquatic",
      "zock",
      "heavyMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "grabro",
    "name": "グラブロ",
    "faction": "zeon",
    "cost": 305,
    "armor": 470,
    "energy": 110,
    "agility": 18,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "grabroClaw",
      "grabroTorpedo",
      "waterJetMissile"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "submarine",
    "terrainSuitability": {
      "water": true,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "mobileArmor",
      "aquaticMa",
      "aquatic",
      "submarine",
      "grabro"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "charGelgoog",
    "name": "ゲルググ（シャア機）",
    "faction": "zeon",
    "cost": 310,
    "armor": 370,
    "energy": 120,
    "agility": 31,
    "mobility": 6,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamNaginata"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gelgoog",
      "highMobility",
      "charCustom"
    ],
    "specials": [
      "commanderCustom"
    ],
    "imagePath": ""
  },
  {
    "id": "gyan",
    "name": "ギャン",
    "faction": "zeon",
    "cost": 235,
    "armor": 310,
    "energy": 90,
    "agility": 26,
    "mobility": 5,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gyan",
      "meleeMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "azzam",
    "name": "アッザム",
    "faction": "zeon",
    "cost": 255,
    "armor": 430,
    "energy": 115,
    "agility": 12,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "azzamMegaParticleCannon",
      "azzamLeader"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "mobileArmor",
      "flyingMa"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "bigro",
    "name": "ビグロ",
    "faction": "zeon",
    "cost": 320,
    "armor": 430,
    "energy": 130,
    "agility": 28,
    "mobility": 7,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "bigroClaw",
      "mobileArmorMissile",
      "bigroMegaParticleCannon"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "mobileArmor",
      "spaceMa",
      "highMobility"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zakrello",
    "name": "ザクレロ",
    "faction": "zeon",
    "cost": 235,
    "armor": 330,
    "energy": 105,
    "agility": 23,
    "mobility": 6,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatNata",
      "mobileArmorMissile",
      "scatteringMegaParticleCannon"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "mobileArmor",
      "spaceMa"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "brawBro",
    "name": "ブラウ・ブロ",
    "faction": "zeon",
    "cost": 365,
    "armor": 470,
    "energy": 150,
    "agility": 18,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "bigroMegaParticleCannon",
      "wiredMegaParticleCannon"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "mobileArmor",
      "spaceMa",
      "psycommu"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "bigZam",
    "name": "ビグ・ザム",
    "faction": "zeon",
    "cost": 520,
    "armor": 780,
    "energy": 190,
    "agility": 7,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "bigZamLargeMegaParticleCannon",
      "bigZamAllRangeMegaParticleCannon",
      "bigZamLegMissile"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "mobileArmor",
      "heavyMa",
      "bigZam"
    ],
    "specials": [
      "iField"
    ],
    "imagePath": ""
  },
  {
    "id": "elmeth",
    "name": "エルメス",
    "faction": "zeon",
    "cost": 430,
    "armor": 420,
    "energy": 165,
    "agility": 26,
    "mobility": 6,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "bigroMegaParticleCannon",
      "bit"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "mobileArmor",
      "spaceMa",
      "psycommu"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zeong",
    "name": "ジオング",
    "faction": "zeon",
    "cost": 440,
    "armor": 480,
    "energy": 170,
    "agility": 24,
    "mobility": 6,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "zeongHeadMegaParticleCannon",
      "zeongWiredArmMegaParticleCannon",
      "zeongWaistMegaParticleCannon"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": true
    },
    "tags": [
      "zeong",
      "psycommu",
      "charCustom"
    ],
    "specials": [
      "coreSystem"
    ],
    "escapeMsId": "zeongHead",
    "imagePath": ""
  },
  {
    "id": "zeongHead",
    "name": "ジオングヘッド",
    "faction": "zeon",
    "cost": 120,
    "armor": 160,
    "energy": 75,
    "agility": 18,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "zeongHeadMegaParticleCannon"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": true
    },
    "tags": [
      "zeong",
      "psycommu",
      "charCustom",
      "escapeUnit"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "dopp",
    "name": "ドップ",
    "faction": "zeon",
    "cost": 55,
    "armor": 90,
    "energy": 30,
    "agility": 24,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "doppVulcan",
      "doppMissile"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zeonAircraft"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "luggun",
    "name": "ルッグン",
    "faction": "zeon",
    "cost": 50,
    "armor": 100,
    "energy": 30,
    "agility": 18,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "luggunGun"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "recon",
      "zeonAircraft"
    ],
    "specials": [
      "recon"
    ],
    "imagePath": ""
  },
  {
    "id": "gatl",
    "name": "ガトル",
    "faction": "zeon",
    "cost": 65,
    "armor": 100,
    "energy": 35,
    "agility": 23,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "gatlMissile",
      "gatlLargeMissile"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zeonAircraft",
      "spaceFighter"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmCommandSpace",
    "name": "ジム・コマンド（宇宙戦仕様）",
    "faction": "federation",
    "cost": 175,
    "armor": 280,
    "energy": 82,
    "agility": 22,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamSaber"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": true
    },
    "tags": [
      "gm",
      "gmCommand",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmCommandGround",
    "name": "ジム・コマンド（地上戦仕様）",
    "faction": "federation",
    "cost": 175,
    "armor": 280,
    "energy": 82,
    "agility": 22,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamSaber"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": true,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "gmCommand",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmKai",
    "name": "ジム改",
    "faction": "federation",
    "cost": 195,
    "armor": 300,
    "energy": 88,
    "agility": 23,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "enhancedBeamSaber"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "gmKai",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmSniperCustom",
    "name": "ジム・スナイパーカスタム",
    "faction": "federation",
    "cost": 220,
    "armor": 285,
    "energy": 100,
    "agility": 27,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamGunUnit",
      "beamSaberUnit"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "gmSniperCustom",
      "sniperMs",
      "precisionMs",
      "federationMassProduction"
    ],
    "specials": [
      "longRangeScope"
    ],
    "imagePath": ""
  },
  {
    "id": "gmLightArmor",
    "name": "ジム・ライトアーマー",
    "faction": "federation",
    "cost": 135,
    "armor": 190,
    "energy": 72,
    "agility": 27,
    "mobility": 6,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "lightArmor",
      "highMobility",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmJuggler",
    "name": "ジム・ジャグラー",
    "faction": "federation",
    "cost": 210,
    "armor": 270,
    "energy": 105,
    "agility": 20,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "ballUnitPsycommu"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "gmJuggler",
      "psycommu",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmStriker",
    "name": "ジム・ストライカー",
    "faction": "federation",
    "cost": 215,
    "armor": 330,
    "energy": 92,
    "agility": 24,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "twinBeamSpearRod",
      "twinBeamSpearScythe"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": true,
      "desert": true,
      "debris": false
    },
    "tags": [
      "gm",
      "strikerMs",
      "meleeMs",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmGuardCustom",
    "name": "ジム・ガードカスタム",
    "faction": "federation",
    "cost": 235,
    "armor": 330,
    "energy": 92,
    "agility": 19,
    "mobility": 4,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "guardianShield",
      "shieldVulcan",
      "beamDagger"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "guardCustom",
      "shieldBearer",
      "federationMassProduction"
    ],
    "specials": [
      "guardMission"
    ],
    "imagePath": ""
  },
  {
    "id": "gmCannonLydo",
    "name": "ジム・キャノン（リド専用機）",
    "faction": "federation",
    "cost": 175,
    "armor": 275,
    "energy": 72,
    "agility": 12,
    "mobility": 3,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "gmCannonCannon",
      "headVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "cannonMs",
      "federationMassProduction",
      "lydoCustom"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "aquaGm",
    "name": "アクア・ジム",
    "faction": "federation",
    "cost": 165,
    "armor": 270,
    "energy": 76,
    "agility": 17,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "torpedo",
      "anchor",
      "beamPick"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": true,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "aquatic",
      "aquaGm",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "fishEye",
    "name": "フィッシュアイ",
    "faction": "federation",
    "cost": 85,
    "armor": 170,
    "energy": 42,
    "agility": 12,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "twinSpearGun",
      "fishEyeClawArm"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "submarine",
    "terrainSuitability": {
      "water": true,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "ball",
      "supportPod",
      "aquatic",
      "submarine",
      "fishEye"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "aquaticGundam",
    "name": "水中型ガンダム",
    "faction": "federation",
    "cost": 225,
    "armor": 320,
    "energy": 90,
    "agility": 20,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamPick",
      "torpedo",
      "harpoonGun"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": true,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gundamHead",
      "aquatic",
      "aquaGm"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "fullArmorGundam",
    "name": "フルアーマー・ガンダム",
    "faction": "federation",
    "cost": 370,
    "armor": 560,
    "energy": 125,
    "agility": 20,
    "mobility": 4,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "faChestMissileBay",
      "faTwinBeamGun",
      "faRocketCannon360mm",
      "simpleSmallShield"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gundam",
      "heavyMs",
      "armorPack",
      "fullArmor"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "heavyGundam",
    "name": "ヘビーガンダム",
    "faction": "federation",
    "cost": 315,
    "armor": 470,
    "energy": 120,
    "agility": 20,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "heavyGundamBeamCannon"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gundam",
      "heavyMs",
      "heavyLauncherMs",
      "heavyGundam"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "charRickDom",
    "name": "リック・ドム（シャア機）",
    "faction": "zeon",
    "cost": 295,
    "armor": 365,
    "energy": 100,
    "agility": 29,
    "mobility": 7,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatSaber",
      "spreadBeam"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "dom",
      "rickDom",
      "highMobility",
      "charCustom"
    ],
    "specials": [
      "commanderCustom"
    ],
    "imagePath": ""
  },
  {
    "id": "zaku2S",
    "name": "ザクIIS型",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 140,
    "armor": 265,
    "energy": 58,
    "agility": 18,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk",
      "zakuShoulderShield"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "zaku2",
      "commanderCustom"
    ],
    "specials": [
      "commanderCustom"
    ],
    "imagePath": ""
  },
  {
    "id": "dozleZaku2",
    "name": "ザクII（ドズル機）",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 170,
    "armor": 330,
    "energy": 58,
    "agility": 15,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "largeHeatHawk"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "zaku2",
      "heavyMs",
      "meleeMs",
      "dozleCustom"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zakuDesert",
    "name": "ザク・デザートタイプ",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 135,
    "armor": 265,
    "energy": 55,
    "agility": 15,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk",
      "crackerPod"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": true,
      "debris": false
    },
    "tags": [
      "zaku",
      "zaku2",
      "desert"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zakuCannon",
    "name": "ザク・キャノン",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 170,
    "armor": 285,
    "energy": 58,
    "agility": 11,
    "mobility": 3,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "zakuCannonGun",
      "zakuShoulderShield"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "zaku2",
      "cannonMs",
      "smokeMs"
    ],
    "specials": [
      "smokeDischarger"
    ],
    "imagePath": ""
  },
  {
    "id": "rambaZaku1",
    "name": "ザクI（ラル機）",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 120,
    "armor": 230,
    "energy": 43,
    "agility": 15,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "largeHeatHawk"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "zaku1",
      "meleeMs",
      "rambaCustom"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "blackTriStarsZaku1",
    "name": "ザクI（黒い三連星）",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 115,
    "armor": 225,
    "energy": 45,
    "agility": 17,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "zaku1",
      "blackTriStars"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "matsunagaZaku2",
    "name": "ザクII（マツナガ機）",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 185,
    "armor": 280,
    "energy": 60,
    "agility": 21,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "largeHeatHawk",
      "zakuShoulderShield"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "zaku2",
      "meleeMs",
      "matsunagaCustom"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "garmaZaku2S",
    "name": "ザクIIS型（ガルマ機）",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 165,
    "armor": 270,
    "energy": 60,
    "agility": 19,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk",
      "garmaHeadVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "zaku2",
      "commanderCustom",
      "garmaCustom"
    ],
    "specials": [
      "commanderCustom"
    ],
    "imagePath": ""
  },
  {
    "id": "zakuTank",
    "name": "ザクタンク",
    "faction": "zeon",
    "cost": 90,
    "armor": 280,
    "energy": 35,
    "agility": 6,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "tripleMachineGun",
      "zakuShoulderShield",
      "zakuShoulderShieldSub"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": true,
      "desert": true,
      "debris": false
    },
    "tags": [
      "zaku",
      "tank",
      "groundVehicle"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "highMobilityZaku",
    "name": "高機動型ザク",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 210,
    "armor": 275,
    "energy": 70,
    "agility": 26,
    "mobility": 6,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk",
      "zakuShoulderShield"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "zaku2",
      "highMobilityZaku",
      "highMobility"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "johnnyHighMobilityZaku",
    "name": "高機動型ザク（ジョニー機）",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 260,
    "armor": 280,
    "energy": 75,
    "agility": 29,
    "mobility": 7,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk",
      "zakuShoulderShield",
      "tripleMissilePod"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "zaku2",
      "highMobilityZaku",
      "highMobility",
      "johnnyCustom"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "matsunagaHighMobilityZaku",
    "name": "高機動型ザク（マツナガ機）",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 260,
    "armor": 285,
    "energy": 78,
    "agility": 30,
    "mobility": 7,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "largeHeatHawk",
      "zakuShoulderShield"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": true
    },
    "tags": [
      "zaku",
      "zaku2",
      "highMobilityZaku",
      "highMobility",
      "meleeMs",
      "matsunagaCustom"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "mquveGouf",
    "name": "グフ（マ・クベ機）",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 185,
    "armor": 340,
    "energy": 65,
    "agility": 21,
    "mobility": 5,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatSword",
      "heatRod",
      "fingerVulcan"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gouf",
      "meleeMs",
      "mquveCustom"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "magellaAttack",
    "name": "マゼラ・アタック",
    "faction": "zeon",
    "cost": 95,
    "armor": 220,
    "energy": 40,
    "agility": 7,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "magellaAttackGun",
      "doppVulcan"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "tank",
      "groundVehicle"
    ],
    "specials": [
      "coreSystem"
    ],
    "escapeMsId": "magellaTop",
    "imagePath": ""
  },
  {
    "id": "magellaTop",
    "name": "マゼラ・トップ",
    "faction": "zeon",
    "cost": 55,
    "armor": 100,
    "energy": 25,
    "agility": 15,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "magellaAttackGun"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "escapeUnit",
      "zeonAircraft"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "energy": 85,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heavyGuncannonCannon",
      "headVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "guncannon",
      "cannonMs"
    ],
    "specials": [],
    "imagePath": "",
    "id": "guncannonHeavy",
    "name": "ガンキャノン重装型",
    "faction": "federation",
    "cost": 230,
    "armor": 425,
    "agility": 8,
    "mobility": 3
  },
  {
    "energy": 90,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "typeDShortCannon",
      "headVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "guncannon",
      "cannonMs"
    ],
    "specials": [],
    "imagePath": "",
    "id": "guncannonHeavyTypeD",
    "name": "ガンキャノン重装型タイプD",
    "faction": "federation",
    "cost": 240,
    "armor": 405,
    "agility": 15,
    "mobility": 4
  },
  {
    "energy": 120,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "guncannon2BeamCannon",
      "headVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "guncannon",
      "cannonMs"
    ],
    "specials": [
      "highPerformanceSight"
    ],
    "imagePath": "",
    "id": "guncannon2",
    "name": "ガンキャノンII",
    "faction": "federation",
    "cost": 275,
    "armor": 405,
    "agility": 17,
    "mobility": 4
  },
  {
    "energy": 75,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "guntankLowRecoilCannon",
      "guntank2Rocket",
      "guntank2Missile"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "guntank",
      "tank"
    ],
    "specials": [
      "stationaryInterception"
    ],
    "imagePath": "",
    "id": "guntank2",
    "name": "ガンタンクII",
    "faction": "federation",
    "cost": 245,
    "armor": 475,
    "agility": 8,
    "mobility": 3
  },
  {
    "energy": 70,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamSaber",
      "simpleFixedShield"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": "",
    "id": "landCombatGm",
    "name": "陸戦用ジム",
    "faction": "federation",
    "cost": 155,
    "armor": 305,
    "agility": 12,
    "mobility": 3
  },
  {
    "energy": 72,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": true,
      "debris": false
    },
    "tags": [
      "gm",
      "federationMassProduction",
      "desert"
    ],
    "specials": [],
    "imagePath": "",
    "id": "desertGm",
    "name": "デザート・ジム",
    "faction": "federation",
    "cost": 145,
    "armor": 265,
    "agility": 17,
    "mobility": 4
  },
  {
    "energy": 75,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "smallShield"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "groundGm",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": "",
    "id": "groundGm",
    "name": "陸戦型ジム",
    "faction": "federation",
    "cost": 155,
    "armor": 285,
    "agility": 17,
    "mobility": 4
  },
  {
    "energy": 105,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": true,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "groundGm",
      "gmSniper",
      "federationMassProduction"
    ],
    "specials": [
      "longRangeScope"
    ],
    "imagePath": "",
    "id": "groundGmSniper",
    "name": "陸戦型ジム・スナイパー",
    "faction": "federation",
    "cost": 180,
    "armor": 275,
    "agility": 16,
    "mobility": 4
  },
  {
    "energy": 95,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "chestVulcan"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gundam",
      "groundGundam"
    ],
    "specials": [],
    "imagePath": "",
    "id": "groundGundam",
    "name": "陸戦型ガンダム",
    "faction": "federation",
    "cost": 220,
    "armor": 330,
    "agility": 20,
    "mobility": 5
  },
  {
    "energy": 38,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "ballK15Caliber"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": true
    },
    "tags": [
      "ball",
      "supportPod"
    ],
    "specials": [],
    "imagePath": "",
    "id": "ballK",
    "name": "ボールK型",
    "faction": "federation",
    "cost": 60,
    "armor": 145,
    "agility": 13,
    "mobility": 4
  },
  {
    "energy": 70,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "aircraftVulcan",
      "largeSmartBomb"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "federationAircraft",
      "coreBooster"
    ],
    "specials": [],
    "imagePath": "",
    "id": "jetCoreBooster",
    "name": "ジェット・コア・ブースター",
    "faction": "federation",
    "cost": 125,
    "armor": 170,
    "agility": 30,
    "mobility": 8
  },
  {
    "energy": 55,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk",
      "mineDispenser"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": true
    },
    "tags": [
      "zaku",
      "zaku2"
    ],
    "specials": [],
    "imagePath": "",
    "id": "zakuMineLayer",
    "name": "ザク・マインレイヤー",
    "faction": "zeon",
    "cost": 115,
    "armor": 260,
    "agility": 12,
    "mobility": 4,
    "forbiddenWeaponKinds": [
      "beam"
    ]
  },
  {
    "energy": 45,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "zeonHeadVulcan",
      "zakuMarineRocketPod"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": true,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "aquatic"
    ],
    "specials": [],
    "imagePath": "",
    "id": "zakuMarine",
    "name": "ザク・マリンタイプ",
    "faction": "zeon",
    "cost": 90,
    "armor": 235,
    "agility": 10,
    "mobility": 3,
    "forbiddenWeaponKinds": [
      "beam"
    ]
  },
  {
    "energy": 60,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": true
    },
    "tags": [
      "zaku",
      "reconMs"
    ],
    "specials": [
      "recon"
    ],
    "imagePath": "",
    "id": "zakuFlipper",
    "name": "ザク・フリッパー",
    "faction": "zeon",
    "cost": 120,
    "armor": 235,
    "agility": 21,
    "mobility": 6,
    "forbiddenWeaponKinds": [
      "beam"
    ]
  },
  {
    "energy": 130,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "psycommuZakuWiredCannon",
      "psycommuZakuLegCannon"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "psycommu"
    ],
    "specials": [],
    "imagePath": "",
    "id": "psycommuZakuTest",
    "name": "サイコミュ・システム高機動試験用ザク",
    "faction": "zeon",
    "cost": 235,
    "armor": 250,
    "agility": 27,
    "mobility": 7
  },
  {
    "energy": 105,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "zeonHeadVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "zaku1",
      "sniperMs"
    ],
    "specials": [
      "stationaryInterception"
    ],
    "imagePath": "",
    "id": "zaku1Sniper",
    "name": "ザクI・スナイパータイプ",
    "faction": "zeon",
    "cost": 135,
    "armor": 195,
    "agility": 7,
    "mobility": 3
  },
  {
    "energy": 60,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "gouf"
    ],
    "specials": [],
    "imagePath": "",
    "id": "prototypeGouf",
    "name": "プロトタイプ・グフ",
    "faction": "zeon",
    "cost": 135,
    "armor": 290,
    "agility": 17,
    "mobility": 4,
    "forbiddenWeaponKinds": [
      "beam"
    ]
  },
  {
    "energy": 70,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "enhancedFingerVulcan",
      "legTripleMissilePod"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gouf"
    ],
    "specials": [],
    "imagePath": "",
    "id": "goufHeavy",
    "name": "グフ重装型",
    "faction": "zeon",
    "cost": 190,
    "armor": 375,
    "agility": 12,
    "mobility": 3
  },
  {
    "energy": 75,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "fingerVulcan",
      "legTripleMissilePod"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gouf"
    ],
    "specials": [],
    "imagePath": "",
    "id": "goufFlightTest",
    "name": "グフ飛行試験型",
    "faction": "zeon",
    "cost": 185,
    "armor": 300,
    "agility": 19,
    "mobility": 6
  },
  {
    "energy": 75,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatSaber"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": true,
      "debris": false
    },
    "tags": [
      "dom",
      "desert"
    ],
    "specials": [],
    "imagePath": "",
    "id": "domTropicalTest",
    "name": "ドム・トロピカルテストタイプ",
    "faction": "zeon",
    "cost": 200,
    "armor": 345,
    "agility": 17,
    "mobility": 5
  },
  {
    "energy": 125,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamNaginata",
      "gelgoogBeamCannon"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gelgoog",
      "cannonMs"
    ],
    "specials": [],
    "imagePath": "",
    "id": "gelgoogCannon",
    "name": "ゲルググ・キャノン",
    "faction": "zeon",
    "cost": 285,
    "armor": 370,
    "agility": 22,
    "mobility": 5
  },
  {
    "energy": 115,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamNaginata"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gelgoog",
      "highMobilityMs"
    ],
    "specials": [],
    "imagePath": "",
    "id": "highMobilityGelgoog",
    "name": "高機動型ゲルググ",
    "faction": "zeon",
    "cost": 290,
    "armor": 350,
    "agility": 29,
    "mobility": 7
  },
  {
    "energy": 120,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamNaginata"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gelgoog",
      "highMobilityMs",
      "johnnyCustom"
    ],
    "specials": [],
    "imagePath": "",
    "id": "johnnyHighMobilityGelgoog",
    "name": "高機動型ゲルググ（ジョニー機）",
    "faction": "zeon",
    "cost": 325,
    "armor": 355,
    "agility": 32,
    "mobility": 8
  },
  {
    "energy": 100,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "chestVulcan"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gundam",
      "groundGundam",
      "ez8"
    ],
    "specials": [],
    "imagePath": "",
    "id": "gundamEz8",
    "name": "ガンダムEz-8",
    "faction": "federation",
    "cost": 245,
    "armor": 365,
    "agility": 22,
    "mobility": 5
  },
  {
    "energy": 55,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "guntankLowRecoilCannon",
      "massProductionGuntankGunLauncher"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "guntank",
      "tank",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": "",
    "id": "massProductionGuntank",
    "name": "量産型ガンタンク",
    "faction": "federation",
    "cost": 155,
    "armor": 340,
    "agility": 6,
    "mobility": 3
  },
  {
    "energy": 35,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "hoverTruckMachineGun"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": true,
      "desert": false,
      "debris": false
    },
    "tags": [
      "supportVehicle",
      "reconMs"
    ],
    "specials": [
      "recon"
    ],
    "imagePath": "",
    "id": "hoverTruck",
    "name": "ホバー・トラック",
    "faction": "federation",
    "cost": 55,
    "armor": 120,
    "agility": 12,
    "mobility": 5
  },
  {
    "energy": 75,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "massProductionGuncannonCannon",
      "headVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "guncannon",
      "cannonMs",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": "",
    "id": "massProductionGuncannon",
    "name": "量産型ガンキャノン",
    "faction": "federation",
    "cost": 180,
    "armor": 320,
    "agility": 10,
    "mobility": 3
  },
  {
    "energy": 82,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "massProductionGuncannonCannon",
      "headVulcan"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "guncannon",
      "cannonMs",
      "federationMassProduction",
      "lydoCustom"
    ],
    "specials": [],
    "imagePath": "",
    "id": "massProductionGuncannonLydo",
    "name": "量産型ガンキャノン（リド専用機）",
    "faction": "federation",
    "cost": 215,
    "armor": 350,
    "agility": 16,
    "mobility": 4
  },
  {
    "energy": 70,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "gmCannonCannon",
      "headVulcan"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": true,
      "debris": false
    },
    "tags": [
      "gm",
      "cannonMs",
      "federationMassProduction",
      "desert"
    ],
    "specials": [],
    "imagePath": "",
    "id": "gmCannonAfrica",
    "name": "ジム・キャノン（アフリカ戦線仕様）",
    "faction": "federation",
    "cost": 165,
    "armor": 260,
    "agility": 11,
    "mobility": 3
  },
  {
    "energy": 110,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "gmCommand",
      "gmSniper",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": "",
    "id": "gmSniper2",
    "name": "ジム・スナイパーII",
    "faction": "federation",
    "cost": 255,
    "armor": 310,
    "agility": 28,
    "mobility": 6
  },
  {
    "energy": 115,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "gmCommand",
      "gmSniper",
      "lydoCustom"
    ],
    "specials": [],
    "imagePath": "",
    "id": "gmSniper2Lydo",
    "name": "ジム・スナイパーII（リド専用機）",
    "faction": "federation",
    "cost": 290,
    "armor": 350,
    "agility": 30,
    "mobility": 6
  },
  {
    "energy": 85,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatSword"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gouf",
      "flightMs"
    ],
    "specials": [],
    "imagePath": "",
    "id": "goufFlightType",
    "name": "グフ・フライトタイプ",
    "faction": "zeon",
    "cost": 230,
    "armor": 325,
    "agility": 25,
    "mobility": 7,
    "forbiddenWeaponKinds": [
      "beam"
    ]
  },
  {
    "energy": 80,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatSword",
      "heatRod"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gouf",
      "meleeMs"
    ],
    "specials": [],
    "imagePath": "",
    "id": "goufCustom",
    "name": "グフ・カスタム",
    "faction": "zeon",
    "cost": 235,
    "armor": 370,
    "agility": 24,
    "mobility": 5,
    "forbiddenWeaponKinds": [
      "beam"
    ]
  },
  {
    "energy": 100,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "apsarasShockWave"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "mobileArmor",
      "apsaras"
    ],
    "specials": [],
    "imagePath": "",
    "id": "apsaras1",
    "name": "アプサラスI",
    "faction": "zeon",
    "cost": 180,
    "armor": 300,
    "agility": 16,
    "mobility": 5
  },
  {
    "energy": 150,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "apsaras2MegaParticleCannon",
      "apsaras2ScatterMegaParticleCannon"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "mobileArmor",
      "heavyMa",
      "apsaras"
    ],
    "specials": [],
    "imagePath": "",
    "id": "apsaras2",
    "name": "アプサラスII",
    "faction": "zeon",
    "cost": 340,
    "armor": 520,
    "agility": 14,
    "mobility": 4
  },
  {
    "energy": 185,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "apsaras3MegaParticleCannon",
      "apsaras3ScatterMegaParticleCannon"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "mobileArmor",
      "heavyMa",
      "apsaras"
    ],
    "specials": [],
    "imagePath": "",
    "id": "apsaras3",
    "name": "アプサラスIII",
    "faction": "zeon",
    "cost": 500,
    "armor": 720,
    "agility": 10,
    "mobility": 3
  },
  {
    "energy": 110,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "actZakuDoubleHeatHawk"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "actZaku",
      "highMobilityMs"
    ],
    "specials": [],
    "imagePath": "",
    "id": "actZaku",
    "name": "アクトザク",
    "faction": "zeon",
    "cost": 265,
    "armor": 330,
    "agility": 28,
    "mobility": 6
  },
  {
    "energy": 65,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "gigan180mmCannon",
      "giganFourBarrelGun"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "cannonMs",
      "tank",
      "zeonMassProduction"
    ],
    "specials": [],
    "imagePath": "",
    "id": "gigan",
    "name": "ギガン",
    "faction": "zeon",
    "cost": 155,
    "armor": 340,
    "agility": 9,
    "mobility": 4
  },
  {
    "energy": 65,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "ironNail",
      "gasshaMissilePod"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": true
    },
    "tags": [
      "aquatic",
      "spaceMs"
    ],
    "specials": [],
    "imagePath": "",
    "id": "gassha",
    "name": "ガッシャ",
    "faction": "zeon",
    "cost": 170,
    "armor": 300,
    "agility": 14,
    "mobility": 4,
    "allowedWeaponIds": [
      "specialHammerGun"
    ]
  },
  {
    "energy": 55,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "earlyBeamSaber"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": true
    },
    "tags": [
      "gm",
      "earlyGm",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": "",
    "id": "earlyGm",
    "name": "初期型ジム",
    "faction": "federation",
    "cost": 120,
    "armor": 235,
    "agility": 13,
    "mobility": 4
  },
  {
    "energy": 58,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": true
    },
    "tags": [
      "zaku",
      "zaku2",
      "highMobilityMs",
      "testMs"
    ],
    "specials": [],
    "imagePath": "",
    "id": "zakuHighMobilityTestType",
    "name": "宇宙用高機動試験型ザク",
    "faction": "zeon",
    "cost": 145,
    "armor": 230,
    "agility": 22,
    "mobility": 6,
    "forbiddenWeaponKinds": [
      "beam"
    ]
  },
  {
    "energy": 25,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "wiredHelicopterMissile",
      "helicopterVulcan"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "flying",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zeonAircraft",
      "helicopter",
      "reconMs"
    ],
    "specials": [
      "recon"
    ],
    "imagePath": "",
    "id": "battleHelicopter08",
    "name": "戦闘ヘリコプター",
    "faction": "zeon",
    "cost": 65,
    "armor": 105,
    "agility": 16,
    "mobility": 6
  },
  {
    "id": "gunnerGundam",
    "name": "ガンナーガンダム",
    "faction": "federation",
    "cost": 305,
    "armor": 340,
    "energy": 125,
    "agility": 25,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamSaber"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gundam",
      "gunnerGundam",
      "reconMs"
    ],
    "specials": [
      "recon"
    ],
    "imagePath": ""
  },
  {
    "id": "alex",
    "name": "アレックス",
    "faction": "federation",
    "cost": 310,
    "armor": 320,
    "energy": 135,
    "agility": 34,
    "mobility": 6,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "alexArmGatling"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gundam",
      "alex",
      "magnetCoating",
      "highMobility"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "alexChobam",
    "name": "アレックス（チョバム・アーマー）",
    "faction": "federation",
    "cost": 345,
    "armor": 180,
    "energy": 115,
    "agility": 27,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gundam",
      "alex",
      "armorPack"
    ],
    "specials": [
      "coreSystem"
    ],
    "escapeMsId": "alex",
    "imagePath": ""
  },
  {
    "id": "fullArmorAlex",
    "name": "フルアーマー・アレックス",
    "faction": "federation",
    "cost": 415,
    "armor": 620,
    "energy": 140,
    "agility": 21,
    "mobility": 4,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "faTwinBeamGun",
      "faRocketCannon360mm",
      "simpleSmallShield",
      "alexArmGatling"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gundam",
      "alex",
      "heavyMs",
      "armorPack",
      "fullArmor"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmColdClimate",
    "name": "ジム寒冷地仕様",
    "faction": "federation",
    "cost": 160,
    "armor": 270,
    "energy": 80,
    "agility": 21,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamSaber"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": true,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "gmCommand",
      "federationMassProduction",
      "reconMs"
    ],
    "specials": [
      "recon"
    ],
    "imagePath": ""
  },
  {
    "id": "gmCommandLightArmor",
    "name": "ジム・コマンド・ライトアーマー",
    "faction": "federation",
    "cost": 165,
    "armor": 220,
    "energy": 78,
    "agility": 30,
    "mobility": 6,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamSaber"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": true
    },
    "tags": [
      "gm",
      "gmCommand",
      "lightArmor",
      "highMobility",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zaku2Kai",
    "name": "ザクII改",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 210,
    "armor": 315,
    "energy": 78,
    "agility": 22,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk",
      "zakuShoulderShield"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "zaku2",
      "zaku2Kai"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "rickDom2",
    "name": "リック・ドムII",
    "faction": "zeon",
    "cost": 285,
    "armor": 390,
    "energy": 95,
    "agility": 23,
    "mobility": 6,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatSaber",
      "spreadBeam"
    ],
    "mapTypes": [
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": true
    },
    "tags": [
      "dom",
      "rickDom",
      "rickDom2"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gelgoogJ",
    "name": "ゲルググJ",
    "faction": "zeon",
    "cost": 315,
    "armor": 350,
    "energy": 130,
    "agility": 30,
    "mobility": 6,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "gelgoogJBeamSpotGun"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": true
    },
    "tags": [
      "gelgoog",
      "gelgoogJ",
      "sniperMs",
      "highMobility"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "hyGogg",
    "name": "ハイゴッグ",
    "faction": "zeon",
    "cost": 230,
    "armor": 300,
    "energy": 105,
    "agility": 27,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "viceClaw",
      "hyGoggBeamCannon",
      "aquaticTorpedo",
      "handMissileUnit"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": true,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "aquatic",
      "gogg",
      "hyGogg"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zgokE",
    "name": "ズゴックE",
    "faction": "zeon",
    "cost": 260,
    "armor": 360,
    "energy": 110,
    "agility": 25,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "viceClaw",
      "zgokEBeamCannon",
      "aquaticTorpedo"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": true,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "aquatic",
      "zgok",
      "zgokE"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "kampfer",
    "name": "ケンプファー",
    "faction": "zeon",
    "cost": 310,
    "armor": 230,
    "energy": 95,
    "agility": 36,
    "mobility": 7,
    "weaponSlots": 3,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "kampferHeadVulcan",
      "beamSaber"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "kampfer",
      "highMobility",
      "assaultMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "prototypeKampfer",
    "name": "プロトタイプ・ケンプファー",
    "faction": "zeon",
    "cost": 260,
    "armor": 210,
    "energy": 85,
    "agility": 33,
    "mobility": 7,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "kampferHeadVulcan",
      "beamSaber"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "kampfer",
      "prototypeKampfer",
      "highMobility",
      "assaultMs"
    ],
    "specials": [],
    "imagePath": ""
  }
];
