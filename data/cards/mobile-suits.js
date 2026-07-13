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
    "id": "ballSharkMouth",
    "name": "ボール（シャークマウス）",
    "faction": "federation",
    "cost": 70,
    "armor": 150,
    "energy": 35,
    "agility": 8,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "ballSharkMouthCannon"
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
    "id": "oggo",
    "name": "オッゴ",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 65,
    "armor": 145,
    "energy": 40,
    "agility": 10,
    "mobility": 3,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "oggoRocket"
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
      "mobilePod",
      "supportPod",
      "oggo"
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
    "id": "hildolfrTankMode",
    "name": "ヒルドルブ（タンクモード）",
    "faction": "zeon",
    "cost": 310,
    "armor": 520,
    "energy": 120,
    "agility": 10,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "hildolfr30cmApfsds",
      "hildolfr30cmIncendiary"
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
      "hildolfr",
      "tank",
      "groundVehicle",
      "cannonMs",
      "heavyMs",
      "transformableMs"
    ],
    "specials": [
      "transform"
    ],
    "transformMsId": "hildolfrMobileMode",
    "imagePath": ""
  },
  {
    "id": "hildolfrMobileMode",
    "name": "ヒルドルブ（モビルモード）",
    "faction": "zeon",
    "cost": 310,
    "armor": 520,
    "energy": 120,
    "agility": 4,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "hildolfrShovelArm",
      "hildolfrMachineGun105mm"
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
      "hildolfr",
      "tank",
      "groundVehicle",
      "meleeMs",
      "heavyMs",
      "transformableMs"
    ],
    "specials": [
      "transform"
    ],
    "transformMsId": "hildolfrTankMode",
    "imagePath": ""
  },
  {
    "id": "assaultGuntankNormal",
    "name": "陸戦強襲型ガンタンク（通常形態）",
    "faction": "federation",
    "cost": 280,
    "armor": 450,
    "energy": 95,
    "agility": 11,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "assaultGuntank220mmCurvedCannon",
      "assaultGuntankArmBopGun",
      "assaultGuntankFlamethrower"
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
      "assaultGuntank",
      "tank",
      "groundVehicle",
      "cannonMs",
      "transformableMs"
    ],
    "specials": [
      "transform"
    ],
    "transformMsId": "assaultGuntankAssaultGun",
    "imagePath": ""
  },
  {
    "id": "assaultGuntankAssaultGun",
    "name": "陸戦強襲型ガンタンク（突撃砲形態）",
    "faction": "federation",
    "cost": 280,
    "armor": 450,
    "energy": 95,
    "agility": 15,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "assaultGuntank220mmHorizontalCannon",
      "assaultGuntankMissilePod",
      "assaultGuntankFuelBomb"
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
      "assaultGuntank",
      "tank",
      "groundVehicle",
      "cannonMs",
      "missileMs",
      "transformableMs"
    ],
    "specials": [
      "transform"
    ],
    "transformMsId": "assaultGuntankNormal",
    "imagePath": ""
  },
  {
    "id": "gundamPixyLilith",
    "name": "ガンダム・ピクシー（リリス機）",
    "faction": "federation",
    "cost": 275,
    "armor": 335,
    "energy": 95,
    "agility": 32,
    "mobility": 6,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "twinBeamSpearRod",
      "twinBeamSpearScythe",
      "simpleSmallShield"
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
      "pixy",
      "meleeMs",
      "armorPack",
      "lilithCustom"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmTrainer",
    "name": "ジム・トレーナー",
    "faction": "federation",
    "cost": 90,
    "armor": 185,
    "energy": 55,
    "agility": 12,
    "mobility": 4,
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
      "gm",
      "trainerMs",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmSpartanBlackDog",
    "name": "ジム・スパルタン（ブラックドッグ隊）",
    "faction": "federation",
    "cost": 200,
    "armor": 285,
    "energy": 86,
    "agility": 27,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatKnife"
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
      "meleeMs",
      "stealthMs",
      "blackDog",
      "federationMassProduction"
    ],
    "specials": [
      "smokeDischarger"
    ],
    "imagePath": ""
  },
  {
    "id": "gmSniperCustomBlackDog",
    "name": "ジム・スナイパーカスタム（ブラックドッグ隊）",
    "faction": "federation",
    "cost": 230,
    "armor": 295,
    "energy": 105,
    "agility": 28,
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
      "blackDog",
      "federationMassProduction"
    ],
    "specials": [
      "longRangeScope"
    ],
    "imagePath": ""
  },
  {
    "id": "hoverTruckBlackDog",
    "name": "ホバー・トラック（ブラックドッグ隊）",
    "faction": "federation",
    "cost": 65,
    "armor": 130,
    "energy": 35,
    "agility": 13,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
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
      "vehicle",
      "groundVehicle",
      "reconMs",
      "blackDog",
      "federationMassProduction"
    ],
    "specials": [
      "recon"
    ],
    "imagePath": ""
  },
  {
    "id": "whiteRider",
    "name": "ホワイトライダー",
    "faction": "federation",
    "cost": 360,
    "armor": 340,
    "energy": 130,
    "agility": 25,
    "mobility": 5,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatRapier",
      "shekinahGatling",
      "shekinahMegaBeam"
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
      "paleRider",
      "whiteRider",
      "unit4",
      "unit5",
      "zeusMs"
    ],
    "specials": [
      "zeusSystem"
    ],
    "imagePath": ""
  },
  {
    "id": "redRider",
    "name": "レッドライダー",
    "faction": "federation",
    "cost": 330,
    "armor": 335,
    "energy": 115,
    "agility": 30,
    "mobility": 6,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamSaber",
      "zweihander"
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
      "paleRider",
      "redRider",
      "meleeMs",
      "areusMs"
    ],
    "specials": [
      "areusSystem"
    ],
    "imagePath": ""
  },
  {
    "id": "blackRider",
    "name": "ブラックライダー",
    "faction": "federation",
    "cost": 340,
    "armor": 320,
    "energy": 110,
    "agility": 31,
    "mobility": 6,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatKnife",
      "stunAnchor",
      "blackRiderGrenadeLauncher",
      "activeCamo"
    ],
    "mapTypes": [
      "ground",
      "space"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": false,
      "forest": true,
      "desert": false,
      "debris": false
    },
    "tags": [
      "paleRider",
      "blackRider",
      "stealthMs",
      "electronicWarfare",
      "themisMs"
    ],
    "specials": [
      "themisSystem"
    ],
    "imagePath": ""
  },
  {
    "id": "paleRiderCavalry",
    "name": "ペイルライダー・キャバルリー",
    "faction": "federation",
    "cost": 310,
    "armor": 330,
    "energy": 115,
    "agility": 24,
    "mobility": 5,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "massProductionShekinahGatling",
      "massProductionShekinahBeam"
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
      "paleRider",
      "paleRiderCavalry",
      "hadesMs"
    ],
    "specials": [
      "hadesSystem"
    ],
    "imagePath": ""
  },
  {
    "id": "groundHighMobilityZakuAlma",
    "name": "陸戦高機動型ザク（アルマ機）",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 210,
    "armor": 300,
    "energy": 75,
    "agility": 27,
    "mobility": 6,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatSaber",
      "zakuHeadVulcan"
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
      "groundHighMobilityZaku",
      "highMobility",
      "groundMs",
      "almaCustom"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "titania",
    "name": "ティターニア",
    "faction": "zeon",
    "cost": 390,
    "armor": 360,
    "energy": 115,
    "agility": 35,
    "mobility": 7,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "titaniaTwinBeamSaber",
      "titaniaArmGatling"
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
      "titania",
      "highMobility",
      "assaultMs",
      "meleeMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zaku2Sniper",
    "name": "ザクII狙撃型",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 145,
    "armor": 250,
    "energy": 60,
    "agility": 10,
    "mobility": 3,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk"
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
      "sniperMs",
      "precisionMs",
      "groundMs"
    ],
    "specials": [
      "highPerformanceSight"
    ],
    "imagePath": ""
  },
  {
    "id": "efreetJaeger",
    "name": "イフリート・イェーガー",
    "faction": "zeon",
    "cost": 245,
    "armor": 300,
    "energy": 80,
    "agility": 22,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatKnife"
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
      "efreet",
      "gouf",
      "dom",
      "sniperMs",
      "smokeMs",
      "groundMs"
    ],
    "specials": [
      "smokeDischarger"
    ],
    "imagePath": ""
  },
  {
    "id": "zakuHalfCannon",
    "name": "ザク・ハーフキャノン",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 150,
    "armor": 285,
    "energy": 65,
    "agility": 13,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "zakuHalfCannonGatling120mm"
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
      "reconMs",
      "groundMs"
    ],
    "specials": [
      "undergroundSonar"
    ],
    "imagePath": ""
  },
  {
    "id": "domNomides",
    "name": "ドム・ノーミーデス",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 360,
    "armor": 520,
    "energy": 100,
    "agility": 10,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "domNomidesHeatTomahawk",
      "domNomides30cmCannon"
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
      "desert",
      "heavyMs",
      "cannonMs",
      "groundMs"
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
    "agility": 22,
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
    "agility": 24,
    "mobility": 5,
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
    "id": "gLine",
    "name": "ジーライン",
    "faction": "federation",
    "cost": 140,
    "armor": 225,
    "energy": 82,
    "agility": 20,
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
      "gLine",
      "rx81"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gLineStandardArmor",
    "name": "ジーライン・スタンダードアーマー",
    "faction": "federation",
    "cost": 185,
    "armor": 285,
    "energy": 92,
    "agility": 22,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "gLineGatlingSmasher"
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
      "gLine",
      "rx81",
      "gLineStandardArmor"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gLineLightArmor",
    "name": "ジーライン・ライトアーマー",
    "faction": "federation",
    "cost": 175,
    "armor": 195,
    "energy": 88,
    "agility": 31,
    "mobility": 6,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "gLineMissilePod"
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
      "gLine",
      "rx81",
      "gLineLightArmor",
      "lightArmor",
      "highMobility"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gLineAssaultArmor",
    "name": "ジーライン・アサルトアーマー",
    "faction": "federation",
    "cost": 205,
    "armor": 315,
    "energy": 96,
    "agility": 18,
    "mobility": 5,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "gLineSingleAssaultCannon",
      "gLineHeatLance"
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
      "gLine",
      "rx81",
      "gLineAssaultArmor",
      "assaultMs",
      "meleeMs",
      "heavyMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "armoredGm",
    "name": "ジム装甲強化型",
    "faction": "federation",
    "cost": 160,
    "armor": 320,
    "energy": 72,
    "agility": 13,
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
      "armoredGm",
      "heavyMs",
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
    "id": "groundHighMobilityZaku",
    "name": "陸戦高機動型ザク",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 170,
    "armor": 285,
    "energy": 70,
    "agility": 22,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk"
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
      "groundHighMobilityZaku",
      "highMobility",
      "groundMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "groundHighMobilityZakuVincent",
    "name": "陸戦高機動型ザク（ヴィンセント機）",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 210,
    "armor": 300,
    "energy": 75,
    "agility": 25,
    "mobility": 6,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk"
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
      "groundHighMobilityZaku",
      "highMobility",
      "groundMs",
      "vincentCustom"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gemCamouf",
    "name": "ゲム・カモフ",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 105,
    "armor": 220,
    "energy": 55,
    "agility": 15,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "shoulderTackle"
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
      "gemCamouf",
      "camouflageMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zaku2WhiteOgre",
    "name": "ザクII（ホワイトオーガー）",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 145,
    "armor": 280,
    "energy": 60,
    "agility": 19,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk",
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
      "whiteOgre",
      "groundMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zudah",
    "name": "ヅダ",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 105,
    "armor": 205,
    "energy": 60,
    "agility": 28,
    "mobility": 7,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk",
      "shieldPick"
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
      "zudah",
      "highMobilityMs",
      "prototypeMs"
    ],
    "specials": [
      "saturnEngineIncomplete"
    ],
    "imagePath": ""
  },
  {
    "id": "zudahCommander",
    "name": "ヅダ（隊長機）",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 115,
    "armor": 220,
    "energy": 60,
    "agility": 28,
    "mobility": 7,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk",
      "shieldPick"
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
      "zudah",
      "highMobilityMs",
      "prototypeMs",
      "commanderMs"
    ],
    "specials": [
      "saturnEngineIncomplete"
    ],
    "imagePath": ""
  },
  {
    "id": "zudahF",
    "name": "ヅダF",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 110,
    "armor": 225,
    "energy": 60,
    "agility": 17,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk",
      "shieldPick"
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
      "zudah",
      "prototypeMs"
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
    "id": "rickDomGato",
    "name": "リック・ドム（ガトー機）",
    "faction": "zeon",
    "cost": 270,
    "armor": 390,
    "energy": 92,
    "agility": 21,
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
      "rickDom",
      "gatoCustom"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "domFunf",
    "name": "ドム・フュンフ",
    "faction": "zeon",
    "cost": 250,
    "armor": 380,
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
      "dom",
      "domFunf",
      "highMobilityMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "domBeinNichts",
    "name": "ドム・バインニヒツ",
    "faction": "zeon",
    "cost": 280,
    "armor": 365,
    "energy": 95,
    "agility": 26,
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
      "debris": true
    },
    "tags": [
      "dom",
      "domFunf",
      "rickDom",
      "spaceAssault",
      "highMobilityMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "domGrossBeil",
    "name": "ドム・グロウスバイル",
    "faction": "zeon",
    "cost": 295,
    "armor": 370,
    "energy": 92,
    "agility": 29,
    "mobility": 7,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "largeHeatSaber",
      "heatKnife"
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
      "domFunf",
      "rickDom",
      "spaceAssault",
      "highMobilityMs",
      "meleeMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "domTropen",
    "name": "ドム・トローペン",
    "faction": "zeon",
    "cost": 270,
    "armor": 390,
    "energy": 88,
    "agility": 21,
    "mobility": 6,
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
      "desert": true,
      "debris": false
    },
    "tags": [
      "dom",
      "domFunf",
      "domTropen",
      "desert",
      "highMobilityMs"
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
    "id": "gelgoogGato",
    "name": "ゲルググ（ガトー機）",
    "faction": "zeon",
    "cost": 305,
    "armor": 410,
    "energy": 125,
    "agility": 22,
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
      "gelgoog",
      "gatoCustom",
      "heavyMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gelgoogKaspen",
    "name": "ゲルググ（カスペン機）",
    "faction": "zeon",
    "cost": 315,
    "armor": 405,
    "energy": 125,
    "agility": 23,
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
      "gelgoog",
      "kaspenCustom",
      "commanderCustom",
      "heavyMs"
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
    "id": "azzamOrga",
    "name": "アッザム・オルガ",
    "faction": "zeon",
    "cost": 255,
    "armor": 430,
    "energy": 115,
    "agility": 12,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "azzamOrgaMissileLauncher",
      "azzamOrgaGroundMachineGun",
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
      "flyingMa",
      "azzamOrga"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "jormungand",
    "name": "ヨルムンガンド",
    "faction": "zeon",
    "cost": 240,
    "armor": 260,
    "energy": 185,
    "agility": 1,
    "mobility": 1,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "jormungandCannon"
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
      "mobileArmor",
      "spaceMa",
      "fixedArtillery",
      "jormungand"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zegokMultiMissile",
    "name": "ゼーゴック（マルチ・ミサイル・パス）",
    "faction": "zeon",
    "cost": 260,
    "armor": 420,
    "energy": 105,
    "agility": 9,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "zegokArmMegaParticleCannon",
      "zegokMultiMissilePass"
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
      "flyingMa",
      "mobileDiver",
      "zegok",
      "zgok"
    ],
    "specials": [
      "mobileDiver"
    ],
    "imagePath": ""
  },
  {
    "id": "zegokR1",
    "name": "ゼーゴック（R-1）",
    "faction": "zeon",
    "cost": 280,
    "armor": 440,
    "energy": 105,
    "agility": 8,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "zegokArmMegaParticleCannon",
      "zegokR1MissileLauncher"
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
      "flyingMa",
      "mobileDiver",
      "zegok",
      "zgok",
      "missileMa"
    ],
    "specials": [
      "mobileDiver"
    ],
    "imagePath": ""
  },
  {
    "id": "zegokKuebelme",
    "name": "ゼーゴック（クーベルメ）",
    "faction": "zeon",
    "cost": 320,
    "armor": 440,
    "energy": 150,
    "agility": 7,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 0,
    "fixedWeaponIds": [
      "zegokArmMegaParticleCannon",
      "kuebelme"
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
      "flyingMa",
      "mobileDiver",
      "zegok",
      "zgok",
      "beamMa"
    ],
    "specials": [
      "mobileDiver"
    ],
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
    "id": "bigLang",
    "name": "ビグ・ラング",
    "faction": "zeon",
    "cost": 390,
    "armor": 560,
    "energy": 165,
    "agility": 6,
    "mobility": 2,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "bigroMegaParticleCannon",
      "bigLangGatling",
      "mobileArmorMissile"
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
      "mobileArmor",
      "spaceMa",
      "heavyMa",
      "supportMa",
      "bigro",
      "bigLang"
    ],
    "specials": [
      "frontlineSupply"
    ],
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
    "agility": 22,
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
      "beamSaber",
      "longRangeBeamRifle"
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
    "id": "zaku1Gerhart",
    "name": "ザクI（ゲラート機）",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 125,
    "armor": 235,
    "energy": 45,
    "agility": 16,
    "mobility": 4,
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
      "gerhartCustom"
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
    "cost": 210,
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
    "weaponSlots": 2,
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
    "weaponSlots": 2,
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
    "cost": 275,
    "armor": 335,
    "agility": 29,
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
    "mobility": 5
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
      "additionalArmor"
    ],
    "purgeMsId": "alex",
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
  },
  {
    "id": "gundamUnit4",
    "name": "ガンダム4号機",
    "faction": "federation",
    "cost": 285,
    "armor": 340,
    "energy": 135,
    "agility": 27,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "handBeamGun",
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
      "unit4",
      "secondLotGundam"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gundamUnit4Bst",
    "name": "ガンダム4号機［Bst］",
    "faction": "federation",
    "cost": 320,
    "armor": 340,
    "energy": 160,
    "agility": 31,
    "mobility": 6,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "handBeamGun",
      "beamSaber",
      "megaBeamLauncher"
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
      "gundam",
      "unit4",
      "secondLotGundam",
      "bst",
      "spaceAssault"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gundamUnit5",
    "name": "ガンダム5号機",
    "faction": "federation",
    "cost": 285,
    "armor": 350,
    "energy": 115,
    "agility": 27,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "handBeamGun",
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
      "unit5",
      "secondLotGundam"
    ],
    "specials": [
      "spareMagazine"
    ],
    "imagePath": ""
  },
  {
    "id": "gundamUnit5Bst",
    "name": "ガンダム5号機［Bst］",
    "faction": "federation",
    "cost": 320,
    "armor": 360,
    "energy": 125,
    "agility": 31,
    "mobility": 6,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "handBeamGun",
      "beamSaber",
      "giantGatling"
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
      "gundam",
      "unit5",
      "secondLotGundam",
      "bst",
      "spaceAssault"
    ],
    "specials": [
      "spareMagazine"
    ],
    "imagePath": ""
  },
  {
    "id": "gundamMudrock",
    "name": "ガンダム6号機マドロック",
    "faction": "federation",
    "cost": 335,
    "armor": 385,
    "energy": 125,
    "agility": 23,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "mudrock300mmCannon"
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
      "secondLotGundam",
      "cannonMs",
      "mudrock"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gundamUnit7",
    "name": "ガンダム7号機",
    "faction": "federation",
    "cost": 310,
    "armor": 340,
    "energy": 130,
    "agility": 32,
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
      "unit7",
      "secondLotGundam",
      "highMobility"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "fullArmorGundamUnit7",
    "name": "フルアーマーガンダム7号機",
    "faction": "federation",
    "cost": 420,
    "armor": 610,
    "energy": 150,
    "agility": 20,
    "mobility": 4,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "unit7BackLongRangeBeamCannon",
      "unit7MissilePod",
      "unit7TwinBeamSprayGun",
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
      "unit7",
      "secondLotGundam",
      "heavyMs",
      "armorPack",
      "fullArmor"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "heavyFullArmorGundamUnit7",
    "name": "重装フルアーマーガンダム7号機",
    "faction": "federation",
    "cost": 535,
    "armor": 650,
    "energy": 170,
    "agility": 12,
    "mobility": 3,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "hfa7MegaBeamCannon",
      "hfa7LargeMissileContainer",
      "hfa7WaistBeamCannon",
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
      "gundam",
      "unit7",
      "secondLotGundam",
      "heavyMs",
      "armorPack",
      "fullArmor",
      "heavyLauncherMs",
      "spaceAssault"
    ],
    "specials": [
      "coreSystem"
    ],
    "escapeMsId": "gundamUnit7",
    "imagePath": ""
  },
  {
    "id": "groundGundamGmHead",
    "name": "陸戦型ガンダム（ジム頭）",
    "faction": "federation",
    "cost": 210,
    "armor": 330,
    "energy": 90,
    "agility": 17,
    "mobility": 4,
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
      "gmHead"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "groundGmWeaponRack",
    "name": "陸戦型ジム（ウェポンラック仕様）",
    "faction": "federation",
    "cost": 165,
    "armor": 285,
    "energy": 75,
    "agility": 12,
    "mobility": 3,
    "weaponSlots": 3,
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
      "weaponRack",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "groundGundamWeaponRack",
    "name": "陸戦型ガンダム（ウェポンラック仕様）",
    "faction": "federation",
    "cost": 230,
    "armor": 330,
    "energy": 95,
    "agility": 15,
    "mobility": 4,
    "weaponSlots": 3,
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
      "weaponRack"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmScout",
    "name": "ジム・スカウト",
    "faction": "federation",
    "cost": 180,
    "armor": 260,
    "energy": 78,
    "agility": 24,
    "mobility": 5,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatKnife",
      "wiredHelicopterMissile"
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
      "reconMs",
      "federationMassProduction"
    ],
    "specials": [
      "recon"
    ],
    "imagePath": ""
  },
  {
    "id": "gmSpartan",
    "name": "ジム・スパルタン",
    "faction": "federation",
    "cost": 190,
    "armor": 275,
    "energy": 82,
    "agility": 26,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatKnife"
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
      "meleeMs",
      "stealthMs",
      "federationMassProduction"
    ],
    "specials": [
      "smokeDischarger"
    ],
    "imagePath": ""
  },
  {
    "id": "frogBall",
    "name": "フロッグ・ボール",
    "faction": "federation",
    "cost": 70,
    "armor": 145,
    "energy": 35,
    "agility": 9,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "frogBallMissile",
      "mineScatterPod"
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
      "aquaticMs",
      "supportPod",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "ballTypeM",
    "name": "ボールM型",
    "faction": "federation",
    "cost": 70,
    "armor": 145,
    "energy": 35,
    "agility": 9,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "smallMachineGun",
      "spaceMineScatterPod"
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
      "supportPod",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmSloop",
    "name": "ジム・スループ",
    "faction": "federation",
    "cost": 145,
    "armor": 260,
    "energy": 68,
    "agility": 14,
    "mobility": 3,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan"
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
      "aquaticMs",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmInterceptCustom",
    "name": "ジム・インターセプトカスタム",
    "faction": "federation",
    "cost": 205,
    "armor": 285,
    "energy": 90,
    "agility": 28,
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
      "gmGuard",
      "highMobilityMs",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "submersibleGm",
    "name": "ジム可潜タイプ",
    "faction": "federation",
    "cost": 120,
    "armor": 245,
    "energy": 60,
    "agility": 11,
    "mobility": 3,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan"
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
      "aquaticMs",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "guncannonHarborDefense",
    "name": "ガンキャノン港湾防衛タイプ",
    "faction": "federation",
    "cost": 205,
    "armor": 360,
    "energy": 80,
    "agility": 9,
    "mobility": 3,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "guncannonHalfCannon",
      "antiSubTorpedo"
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
      "guncannon",
      "cannonMs",
      "aquaticMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gundamEz8Hac",
    "name": "ガンダムEz8 HAC",
    "faction": "federation",
    "cost": 315,
    "armor": 365,
    "energy": 115,
    "agility": 16,
    "mobility": 4,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamSaber",
      "salamisCannon"
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
      "gundam",
      "groundGundam",
      "ez8",
      "heavyMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gundamEz8Hmc",
    "name": "ガンダムEz8 HMC",
    "faction": "federation",
    "cost": 285,
    "armor": 300,
    "energy": 78,
    "agility": 34,
    "mobility": 7,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamSaberTwin"
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
      "gundam",
      "groundGundam",
      "ez8",
      "highMobilityMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "groundGmNightStalker",
    "name": "陸戦型ジム・ナイトストーカー",
    "faction": "federation",
    "cost": 175,
    "armor": 275,
    "energy": 75,
    "agility": 18,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "cannon180mm"
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
      "sniperMs",
      "federationMassProduction"
    ],
    "specials": [
      "highPerformanceSight"
    ],
    "imagePath": ""
  },
  {
    "id": "gmDesert",
    "name": "ジム砂漠仕様",
    "faction": "federation",
    "cost": 135,
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
      "desertMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmDominance",
    "name": "ジム・ドミナンス",
    "faction": "federation",
    "cost": 240,
    "armor": 305,
    "energy": 105,
    "agility": 25,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "prototypeTwinBeamRifle",
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
      "gmDominance",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmDominanceAquatic",
    "name": "ジム・ドミナンス（水中用装備）",
    "faction": "federation",
    "cost": 220,
    "armor": 295,
    "energy": 90,
    "agility": 20,
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
      "gmDominance",
      "aquaGm",
      "aquaticMs",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "agguguy",
    "name": "アッグガイ",
    "faction": "zeon",
    "cost": 190,
    "armor": 300,
    "energy": 75,
    "agility": 18,
    "mobility": 4,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "agguguyHeatRod",
      "fingerVulcan"
    ],
    "mapTypes": [
      "ground"
    ],
    "movementType": "normal",
    "terrainSuitability": {
      "water": true,
      "forest": true,
      "desert": false,
      "debris": false
    },
    "tags": [
      "acguy",
      "aggSeries",
      "aquaticMs",
      "meleeMs"
    ],
    "specials": [],
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "imagePath": ""
  },
  {
    "id": "zogok",
    "name": "ゾゴック",
    "faction": "zeon",
    "cost": 220,
    "armor": 340,
    "energy": 90,
    "agility": 22,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "armPunch",
      "boomerangCutter"
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
      "zgok",
      "aquaticMs",
      "meleeMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "juaggu",
    "name": "ジュアッグ",
    "faction": "zeon",
    "cost": 235,
    "armor": 400,
    "energy": 100,
    "agility": 9,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "juagguTripleRocket",
      "aquaticMegaParticleCannon"
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
      "aggSeries",
      "aquaticMs",
      "heavyMs"
    ],
    "specials": [],
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "imagePath": ""
  },
  {
    "id": "agg",
    "name": "アッグ",
    "faction": "zeon",
    "cost": 130,
    "armor": 260,
    "energy": 55,
    "agility": 8,
    "mobility": 2,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "aggDrill",
      "laserTorch"
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
      "aggSeries",
      "workMs"
    ],
    "specials": [],
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "imagePath": ""
  },
  {
    "id": "jurrick",
    "name": "ジュリック",
    "faction": "zeon",
    "cost": 260,
    "armor": 440,
    "energy": 115,
    "agility": 10,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "ironNail",
      "aquaticMegaParticleCannon"
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
      "gogg",
      "zock",
      "aquaticMs",
      "heavyMs"
    ],
    "specials": [
      "freezyYard"
    ],
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "imagePath": ""
  },
  {
    "id": "ramZgok",
    "name": "ラムズゴック",
    "faction": "zeon",
    "cost": 245,
    "armor": 350,
    "energy": 100,
    "agility": 22,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatRam",
      "clawShield",
      "aquaticMegaParticleCannon"
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
      "zgok",
      "aquaticMs",
      "meleeMs"
    ],
    "specials": [],
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "imagePath": ""
  },
  {
    "id": "zakuTankGreenMacac",
    "name": "ザクタンク（グリーンマカク）",
    "faction": "zeon",
    "cost": 105,
    "armor": 300,
    "energy": 40,
    "agility": 5,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "greenMacacMissilePod",
      "pincerArm",
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
      "desert": false,
      "debris": false
    },
    "tags": [
      "zaku",
      "zakuTank",
      "workMs"
    ],
    "specials": [],
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "imagePath": ""
  },
  {
    "id": "zakuTankWildBoar",
    "name": "ザクタンク（ワイルドボア）",
    "faction": "zeon",
    "cost": 110,
    "armor": 285,
    "energy": 40,
    "agility": 6,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "tripleMachineGun",
      "wildBoarDoubleMachineGun"
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
      "zakuTank",
      "workMs"
    ],
    "specials": [],
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "imagePath": ""
  },
  {
    "id": "goufHunter",
    "name": "グフ・ハンター",
    "faction": "zeon",
    "cost": 175,
    "armor": 300,
    "energy": 60,
    "agility": 23,
    "mobility": 5,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "fingerVulcan",
      "heatSword",
      "throwingHeatKnife"
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
      "gouf",
      "meleeMs",
      "stealthMs"
    ],
    "specials": [],
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "imagePath": ""
  },
  {
    "id": "brrello",
    "name": "ブラレロ",
    "faction": "zeon",
    "cost": 350,
    "armor": 360,
    "energy": 140,
    "agility": 27,
    "mobility": 6,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "scatteringMegaParticleCannon",
      "wiredMegaParticleGun",
      "wiredHeatNata"
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
      "zakrello",
      "psycommuMa",
      "newtypeUse"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "bigRuf",
    "name": "ビグ・ルフ",
    "faction": "zeon",
    "cost": 360,
    "armor": 450,
    "energy": 130,
    "agility": 25,
    "mobility": 7,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "bigroMegaParticleCannon",
      "giantMissile"
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
      "bigro",
      "assaultMa"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "bigroMayer",
    "name": "ビグロマイヤー",
    "faction": "zeon",
    "cost": 340,
    "armor": 420,
    "energy": 135,
    "agility": 30,
    "mobility": 7,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "bigroMayerBeamCannon",
      "mobileArmorMissile"
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
      "bigro",
      "highMobilityMa"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "grabroBit",
    "name": "グラブロ（試作水中ビット搭載型）",
    "faction": "zeon",
    "cost": 360,
    "armor": 450,
    "energy": 140,
    "agility": 17,
    "mobility": 5,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "aquaticBit",
      "grabroTorpedo"
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
      "grabro",
      "aquaticMa",
      "psycommuMa",
      "newtypeUse"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gelgoogGround",
    "name": "陸戦型ゲルググ",
    "faction": "zeon",
    "cost": 265,
    "armor": 365,
    "energy": 105,
    "agility": 23,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamNaginata",
      "gelgoogArmGrenadeLauncher"
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
      "gelgoog",
      "groundGelgoog"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gelgoogG",
    "name": "ゲルググG",
    "faction": "zeon",
    "cost": 270,
    "armor": 365,
    "energy": 105,
    "agility": 23,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamNaginata",
      "gelgoogArmGrenadeLauncher"
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
      "gelgoog",
      "groundGelgoog",
      "desertMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "desertGelgoog",
    "name": "デザート・ゲルググ",
    "faction": "zeon",
    "cost": 285,
    "armor": 360,
    "energy": 105,
    "agility": 22,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamNaginata",
      "armedBuster"
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
      "gelgoog",
      "desertMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "rhinoSaras",
    "name": "ライノサラス",
    "faction": "zeon",
    "cost": 320,
    "armor": 390,
    "energy": 70,
    "agility": 8,
    "mobility": 3,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "rhinoSarasMachineGun",
      "rhinoSarasMissilePod",
      "rhinoSarasCannon"
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
      "mobileArmor",
      "groundMa",
      "desertMs",
      "zaku"
    ],
    "specials": [],
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "imagePath": ""
  },
  {
    "id": "gmWhiteDingo",
    "name": "ジム（ＷＤ隊）",
    "faction": "federation",
    "cost": 135,
    "armor": 250,
    "energy": 70,
    "agility": 17,
    "mobility": 4,
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
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "whiteDingo",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmCannonWhiteDingo",
    "name": "ジム・キャノン（ＷＤ隊）",
    "faction": "federation",
    "cost": 170,
    "armor": 260,
    "energy": 70,
    "agility": 12,
    "mobility": 3,
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
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "cannonMs",
      "whiteDingo",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "massProductionGuncannonWhiteDingo",
    "name": "量産型ガンキャノン（ＷＤ隊）",
    "faction": "federation",
    "cost": 185,
    "armor": 325,
    "energy": 75,
    "agility": 11,
    "mobility": 3,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "massProductionGuncannonCannon",
      "headVulcan"
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
      "guncannon",
      "cannonMs",
      "whiteDingo",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmSniper2WhiteDingo",
    "name": "ジム・スナイパーII（ＷＤ隊）",
    "faction": "federation",
    "cost": 260,
    "armor": 310,
    "energy": 105,
    "agility": 29,
    "mobility": 6,
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
      "desert": false,
      "debris": false
    },
    "tags": [
      "gm",
      "gmCommand",
      "gmSniper",
      "whiteDingo",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmImmortal4th",
    "name": "ジム（不死身の第四小隊）",
    "faction": "federation",
    "cost": 135,
    "armor": 250,
    "energy": 70,
    "agility": 17,
    "mobility": 4,
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
      "immortal4th",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmCannonImmortal4th",
    "name": "ジム・キャノン（不死身の第四小隊）",
    "faction": "federation",
    "cost": 170,
    "armor": 260,
    "energy": 70,
    "agility": 12,
    "mobility": 3,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "gmCannonCannon",
      "headVulcan"
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
      "cannonMs",
      "immortal4th",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gmKaiImmortal4th",
    "name": "ジム改（不死身の第四小隊）",
    "faction": "federation",
    "cost": 200,
    "armor": 300,
    "energy": 88,
    "agility": 24,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "enhancedBeamSaber"
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
      "gmKai",
      "immortal4th",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zanny",
    "name": "ザニー",
    "faction": "federation",
    "cost": 85,
    "armor": 210,
    "energy": 45,
    "agility": 10,
    "mobility": 3,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
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
      "zaku",
      "earlyMs",
      "federationMassProduction"
    ],
    "specials": [],
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "imagePath": ""
  },
  {
    "id": "zephyrGundam",
    "name": "ゼファーガンダム",
    "faction": "federation",
    "cost": 330,
    "armor": 330,
    "energy": 105,
    "agility": 31,
    "mobility": 6,
    "weaponSlots": 0,
    "optionSlots": 1,
    "pilotSlots": 0,
    "fixedWeaponIds": [
      "headVulcan",
      "beamSaber",
      "fixedShield"
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
      "unmannedMs",
      "phantomSystemMs"
    ],
    "specials": [
      "phantomSystem"
    ],
    "imagePath": ""
  },
  {
    "id": "gundamGtFourB",
    "name": "ガンダムGT-FOUR（B）",
    "faction": "federation",
    "cost": 255,
    "armor": 300,
    "energy": 95,
    "agility": 22,
    "mobility": 7,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "gtFourBeamCannon"
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
      "gundam",
      "gtFour",
      "transformableMs"
    ],
    "specials": [
      "transform"
    ],
    "transformMsId": "gundamGtFourG",
    "imagePath": ""
  },
  {
    "id": "gundamGtFourG",
    "name": "ガンダムGT-FOUR（G）",
    "faction": "federation",
    "cost": 255,
    "armor": 300,
    "energy": 95,
    "agility": 18,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "gtFourBeamCannon"
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
      "gtFour",
      "transformableMs"
    ],
    "specials": [
      "transform"
    ],
    "transformMsId": "gundamGtFourB",
    "imagePath": ""
  },
  {
    "id": "blueDestiny1",
    "name": "ブルーディスティニー1号機",
    "faction": "federation",
    "cost": 280,
    "armor": 330,
    "energy": 95,
    "agility": 25,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "bdChestMissile"
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
      "groundGundam",
      "blueDestiny",
      "examMs"
    ],
    "specials": [
      "examSystem"
    ],
    "imagePath": ""
  },
  {
    "id": "blueDestiny3",
    "name": "ブルーディスティニー3号機",
    "faction": "federation",
    "cost": 300,
    "armor": 330,
    "energy": 105,
    "agility": 27,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "bdChestMissile"
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
      "gmCommand",
      "blueDestiny",
      "examMs"
    ],
    "specials": [
      "examSystem"
    ],
    "imagePath": ""
  },
  {
    "id": "gyanEos",
    "name": "ギャン・エーオース",
    "faction": "zeon",
    "cost": 260,
    "armor": 315,
    "energy": 100,
    "agility": 28,
    "mobility": 6,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamBayonet",
      "bayonetBeamGun"
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
      "gyan",
      "commanderMs",
      "meleeMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "dolmel",
    "name": "ドルメル",
    "faction": "zeon",
    "cost": 305,
    "armor": 350,
    "energy": 110,
    "agility": 27,
    "mobility": 5,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "dolmelArmBeamSaber",
      "heatPile",
      "dolmelMissilePod"
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
      "dolmel",
      "assaultMs",
      "meleeMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "qatal",
    "name": "カタール",
    "faction": "zeon",
    "cost": 365,
    "armor": 330,
    "energy": 140,
    "agility": 32,
    "mobility": 6,
    "weaponSlots": 0,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "qatalBeamBlade",
      "qatalBeamCannon",
      "qatalBit"
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
      "dolmel",
      "psycommuMs",
      "newtypeUse",
      "stealthMs"
    ],
    "specials": [
      "stealth"
    ],
    "imagePath": ""
  },
  {
    "id": "goufVijanta",
    "name": "グフ・ヴィジャンタ",
    "faction": "zeon",
    "cost": 220,
    "armor": 315,
    "energy": 70,
    "agility": 27,
    "mobility": 6,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "removalMace",
      "scissorAnchor"
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
      "gouf",
      "meleeMs",
      "highMobilityMs"
    ],
    "specials": [],
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "imagePath": ""
  },
  {
    "id": "goufTacticalAssault",
    "name": "グフ戦術強攻型",
    "faction": "zeon",
    "cost": 230,
    "armor": 325,
    "energy": 70,
    "agility": 22,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatRod",
      "heatSword",
      "goufGatling120mm"
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
      "assaultMs"
    ],
    "specials": [],
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "imagePath": ""
  },
  {
    "id": "efreetCustom",
    "name": "イフリート改",
    "faction": "zeon",
    "cost": 300,
    "armor": 315,
    "energy": 85,
    "agility": 32,
    "mobility": 6,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "efreetHeatSaber",
      "efreetLegMissilePod"
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
      "efreet",
      "examMs",
      "meleeMs"
    ],
    "specials": [
      "examSystem"
    ],
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "imagePath": ""
  },
  {
    "id": "blueDestiny2",
    "name": "ブルーディスティニー2号機",
    "faction": "zeon",
    "cost": 300,
    "armor": 330,
    "energy": 105,
    "agility": 27,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "bdChestMissile"
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
      "gmCommand",
      "blueDestiny",
      "examMs"
    ],
    "specials": [
      "examSystem"
    ],
    "imagePath": ""
  },
  {
    "id": "gundamPixy",
    "name": "ガンダム・ピクシー",
    "faction": "federation",
    "cost": 205,
    "armor": 250,
    "energy": 80,
    "agility": 32,
    "mobility": 6,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamDagger"
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
      "pixy",
      "meleeMs",
      "stealthMs"
    ],
    "specials": [
      "stealth"
    ],
    "imagePath": ""
  },
  {
    "id": "slaveWraith",
    "name": "スレイヴ・レイス",
    "faction": "federation",
    "cost": 245,
    "armor": 350,
    "energy": 100,
    "agility": 20,
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
      "forest": false,
      "desert": false,
      "debris": false
    },
    "tags": [
      "gundam",
      "groundGundam",
      "slaveWraith",
      "reconMs"
    ],
    "specials": [
      "recon"
    ],
    "imagePath": ""
  },
  {
    "id": "paleRiderGround",
    "name": "ペイルライダー（陸戦重装仕様）",
    "faction": "federation",
    "cost": 320,
    "armor": 345,
    "energy": 120,
    "agility": 25,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "handBeamGun"
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
      "groundGundam",
      "paleRider",
      "hadesMs"
    ],
    "specials": [
      "hadesSystem"
    ],
    "imagePath": ""
  },
  {
    "id": "paleRiderSpace",
    "name": "ペイルライダー（空間戦仕様）",
    "faction": "federation",
    "cost": 350,
    "armor": 355,
    "energy": 125,
    "agility": 29,
    "mobility": 6,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "handBeamGun",
      "giantGatling"
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
      "unit5",
      "paleRider",
      "hadesMs",
      "spaceAssault"
    ],
    "specials": [
      "hadesSystem"
    ],
    "imagePath": ""
  },
  {
    "id": "groundGmSlaveWraith",
    "name": "陸戦型ジム（スレイヴ・レイス隊）",
    "faction": "federation",
    "cost": 160,
    "armor": 290,
    "energy": 75,
    "agility": 17,
    "mobility": 4,
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
      "slaveWraith",
      "federationMassProduction"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "guncannonHeavyTypeDSlaveWraith",
    "name": "ガンキャノン重装型タイプD（スレイヴ・レイス隊）",
    "faction": "federation",
    "cost": 245,
    "armor": 410,
    "energy": 90,
    "agility": 15,
    "mobility": 4,
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
      "cannonMs",
      "slaveWraith"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "efreet",
    "name": "イフリート",
    "faction": "zeon",
    "cost": 200,
    "armor": 310,
    "energy": 75,
    "agility": 25,
    "mobility": 5,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "efreetHeatSaber"
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
      "efreet",
      "gouf",
      "dom",
      "assaultMs",
      "smokeMs"
    ],
    "specials": [
      "smokeDischarger"
    ],
    "imagePath": ""
  },
  {
    "id": "efreetSchneid",
    "name": "イフリート（シュナイド機）",
    "faction": "zeon",
    "cost": 275,
    "armor": 325,
    "energy": 85,
    "agility": 29,
    "mobility": 6,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatLanceSchneid"
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
      "efreet",
      "gouf",
      "dom",
      "assaultMs",
      "meleeMs",
      "schneidCustom"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "efreetNacht",
    "name": "イフリート・ナハト",
    "faction": "zeon",
    "cost": 315,
    "armor": 320,
    "energy": 90,
    "agility": 33,
    "mobility": 6,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "coldBladeNacht",
      "coldKunaiNacht"
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
      "efreet",
      "gouf",
      "dom",
      "assaultMs",
      "meleeMs",
      "stealthMs",
      "nachtCustom"
    ],
    "specials": [
      "stealth"
    ],
    "imagePath": ""
  },
  {
    "id": "slyflail",
    "name": "スライフレイル",
    "faction": "federation",
    "cost": 245,
    "armor": 345,
    "energy": 95,
    "agility": 21,
    "mobility": 5,
    "weaponSlots": 1,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "headVulcan",
      "beamJavelin"
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
      "gundam",
      "groundGundam",
      "forestMs"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "gundamEx",
    "name": "ガンダムEX",
    "faction": "federation",
    "cost": 280,
    "armor": 335,
    "energy": 120,
    "agility": 29,
    "mobility": 6,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "beamSaber",
      "gundamExHeadMachineGun",
      "gundamExShoulderGatling"
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
      "gundamEx",
      "highMobility"
    ],
    "specials": [],
    "imagePath": ""
  },
  {
    "id": "zaku2FSolari",
    "name": "ザクII F型（ソラリ機）",
    "faction": "zeon",
    "forbiddenWeaponKinds": [
      "beam"
    ],
    "cost": 120,
    "armor": 270,
    "energy": 58,
    "agility": 16,
    "mobility": 4,
    "weaponSlots": 2,
    "optionSlots": 1,
    "fixedWeaponIds": [
      "heatHawk",
      "solariShoulderShield"
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
      "solariCustom"
    ],
    "specials": [],
    "imagePath": ""
  }
];
