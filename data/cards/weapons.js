"use strict";

// Weapon cards and fixed weapons.
window.GAME_DATA = window.GAME_DATA ?? {};
window.GAME_DATA.weapons = [
  {
    "id": "headVulcan",
    "name": "頭部バルカン",
    "cost": 0,
    "power": 35,
    "accuracy": 85,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "ballCannon",
    "name": "ボール用キャノン",
    "cost": 0,
    "power": 105,
    "accuracy": 66,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "ballSharkMouthCannon",
    "name": "ボール用強化キャノン",
    "cost": 0,
    "power": 125,
    "accuracy": 62,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "oggoRocket",
    "name": "オッゴ用ロケット弾",
    "cost": 0,
    "power": 92,
    "accuracy": 64,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "rocket",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "tankGun55mm",
    "name": "55mm滑腔砲",
    "cost": 0,
    "power": 85,
    "accuracy": 76,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "hildolfr30cmApfsds",
    "name": "30サンチ砲（有翼徹甲）",
    "cost": 0,
    "power": 190,
    "accuracy": 62,
    "range": 6,
    "minRange": 5,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "ignoresObstacles": true,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "hildolfr30cmIncendiary",
    "name": "30サンチ砲（焼夷弾）",
    "cost": 0,
    "power": 135,
    "accuracy": 68,
    "range": 5,
    "minRange": 3,
    "consume": 18,
    "kind": "special",
    "ammo": 0,
    "category": "special",
    "attackType": "shooting",
    "durability": 0,
    "ignoresObstacles": true,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "hildolfrShovelArm",
    "name": "ショベル・アーム",
    "cost": 0,
    "power": 120,
    "accuracy": 76,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "hildolfrMachineGun105mm",
    "name": "105mmマシンガン",
    "cost": 0,
    "power": 82,
    "accuracy": 78,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "assaultGuntank220mmCurvedCannon",
    "name": "220mmキャノン（曲射）",
    "cost": 0,
    "power": 145,
    "accuracy": 66,
    "range": 5,
    "minRange": 3,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "ignoresObstacles": true,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "assaultGuntankArmBopGun",
    "name": "腕部ボッブ・ガン",
    "cost": 0,
    "power": 82,
    "accuracy": 78,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "assaultGuntankFlamethrower",
    "name": "大型火炎放射器",
    "cost": 0,
    "power": 105,
    "accuracy": 74,
    "range": 2,
    "minRange": 1,
    "consume": 16,
    "kind": "special",
    "ammo": 0,
    "category": "special",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "assaultGuntank220mmHorizontalCannon",
    "name": "220mmキャノン（水平射）",
    "cost": 0,
    "power": 155,
    "accuracy": 68,
    "range": 5,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "assaultGuntankMissilePod",
    "name": "ミサイルポッド",
    "cost": 0,
    "power": 105,
    "accuracy": 70,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "ignoresObstacles": true,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "assaultGuntankFuelBomb",
    "name": "燃料爆雷",
    "cost": 0,
    "power": 150,
    "accuracy": 64,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 2,
    "category": "bomb",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "heatRapier",
    "name": "ヒート・レイピア",
    "cost": 0,
    "power": 88,
    "accuracy": 84,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "shekinahGatling",
    "name": "シェキナー（ガトリング）",
    "cost": 0,
    "power": 135,
    "accuracy": 76,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "gatling",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "shekinahMegaBeam",
    "name": "シェキナー（メガビーム）",
    "cost": 0,
    "power": 270,
    "accuracy": 62,
    "range": 6,
    "minRange": 2,
    "consume": 48,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "chargeRequired": 1,
    "chargeCost": 30,
    "chargeResetOnFire": true,
    "fixedOnly": true,
    "specials": [
      "zeusChargeBypass"
    ],
    "factions": [
      "federation"
    ]
  },
  {
    "id": "zweihander",
    "name": "ツヴァイ・ハンダー",
    "cost": 0,
    "power": 170,
    "accuracy": 72,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 130,
    "shieldAttackCost": 34,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "stunAnchor",
    "name": "スタンアンカー",
    "cost": 0,
    "power": 78,
    "accuracy": 80,
    "range": 2,
    "minRange": 1,
    "consume": 16,
    "kind": "special",
    "ammo": 0,
    "category": "special",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "blackRiderGrenadeLauncher",
    "name": "腕部グレネード・ランチャー",
    "cost": 0,
    "power": 112,
    "accuracy": 70,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "grenade",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "activeCamo",
    "name": "アクティブ・カモ",
    "cost": 0,
    "power": 0,
    "accuracy": 0,
    "range": 0,
    "minRange": 0,
    "consume": 1,
    "kind": "ammo",
    "ammo": 2,
    "category": "utility",
    "attackType": "support",
    "durability": 0,
    "fixedOnly": true,
    "utilityOnly": true,
    "specials": [
      "activeCamo"
    ],
    "factions": [
      "federation"
    ]
  },
  {
    "id": "massProductionShekinahGatling",
    "name": "量産型シェキナー（ガトリング）",
    "cost": 0,
    "power": 120,
    "accuracy": 76,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "gatling",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "massProductionShekinahBeam",
    "name": "量産型シェキナー（ビーム）",
    "cost": 0,
    "power": 145,
    "accuracy": 72,
    "range": 4,
    "minRange": 1,
    "consume": 28,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "zakuHeadVulcan",
    "name": "頭部バルカン砲",
    "cost": 0,
    "power": 42,
    "accuracy": 84,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "titaniaTwinBeamSaber",
    "name": "ビームサーベル×2",
    "cost": 0,
    "power": 158,
    "accuracy": 80,
    "range": 1,
    "minRange": 1,
    "consume": 24,
    "kind": "beam",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "titaniaArmGatling",
    "name": "前腕部ガトリング",
    "cost": 0,
    "power": 104,
    "accuracy": 78,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "gatling",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "sawedOffShotgun",
    "name": "ソードオフ・ショットガン",
    "cost": 35,
    "power": 86,
    "accuracy": 90,
    "range": 1,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "shotgun",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zakuHalfCannonGatling120mm",
    "name": "120mmガトリング砲",
    "cost": 0,
    "power": 118,
    "accuracy": 74,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "gatling",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "domNomidesHeatTomahawk",
    "name": "大型ヒート・トマホーク",
    "cost": 0,
    "power": 175,
    "accuracy": 70,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "domNomides30cmCannon",
    "name": "30サンチ砲（通常弾）",
    "cost": 0,
    "power": 185,
    "accuracy": 64,
    "range": 6,
    "minRange": 3,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "beamSaber",
    "name": "ビームサーベル",
    "cost": 0,
    "power": 120,
    "accuracy": 80,
    "range": 1,
    "minRange": 1,
    "consume": 15,
    "kind": "beam",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation",
      "zeon"
    ]
  },
  {
    "id": "beamSaberTwin",
    "name": "ビームサーベル×2",
    "cost": 0,
    "power": 145,
    "accuracy": 78,
    "range": 1,
    "minRange": 1,
    "consume": 22,
    "kind": "beam",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "beamJavelin",
    "name": "ビーム・ジャベリン",
    "cost": 0,
    "power": 115,
    "accuracy": 76,
    "range": 2,
    "minRange": 1,
    "consume": 16,
    "kind": "beam",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gBullBeamCannon",
    "name": "Gブル・ビームキャノン",
    "cost": 0,
    "power": 125,
    "accuracy": 70,
    "range": 4,
    "minRange": 2,
    "consume": 22,
    "kind": "beam",
    "ammo": 0,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "beamRifle",
    "name": "ビーム・ライフル（ガンダム）",
    "cost": 60,
    "power": 135,
    "accuracy": 76,
    "range": 4,
    "minRange": 1,
    "consume": 22,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "guncannonBeamRifle",
    "name": "ビーム・ライフル（ガンキャノン）",
    "cost": 55,
    "power": 120,
    "accuracy": 74,
    "range": 5,
    "minRange": 2,
    "consume": 20,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "beamSprayGun",
    "name": "ビーム・スプレーガン",
    "cost": 35,
    "power": 95,
    "accuracy": 78,
    "range": 3,
    "minRange": 1,
    "consume": 14,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "shortBeamRifleGLine",
    "name": "ショート・ビーム・ライフル",
    "cost": 35,
    "power": 98,
    "accuracy": 78,
    "range": 3,
    "minRange": 1,
    "consume": 15,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "heavyRifleGLine",
    "name": "ヘビー・ライフル",
    "cost": 55,
    "power": 120,
    "accuracy": 76,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "rifle",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gLineGatlingSmasher",
    "name": "ガトリングスマッシャー",
    "cost": 0,
    "power": 92,
    "accuracy": 80,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gLineMissilePod",
    "name": "ミサイルポッド（ジーライン）",
    "cost": 0,
    "power": 98,
    "accuracy": 72,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gLineSingleAssaultCannon",
    "name": "単装アサルトキャノン",
    "cost": 0,
    "power": 128,
    "accuracy": 70,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gLineHeatLance",
    "name": "ヒート・ランス",
    "cost": 0,
    "power": 142,
    "accuracy": 78,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "federationMachineGun100mm",
    "name": "100mmマシンガン",
    "cost": 35,
    "power": 72,
    "accuracy": 80,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "beamGun",
    "name": "ビーム・ガン",
    "cost": 40,
    "power": 105,
    "accuracy": 78,
    "range": 3,
    "minRange": 1,
    "consume": 17,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "bullpupMachineGun",
    "name": "ブルパップ・マシンガン",
    "cost": 40,
    "power": 82,
    "accuracy": 82,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "bullpup",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "federationSpikeShield",
    "name": "スパイク・シールド（連邦）",
    "cost": 45,
    "power": 95,
    "accuracy": 78,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "melee",
    "durability": 65,
    "shieldAttackCost": 14,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "frameLauncher",
    "name": "フレーム・ランチャー（ガトリング）",
    "cost": 85,
    "power": 105,
    "accuracy": 76,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "heavy-launcher",
    "attackType": "shooting",
    "durability": 0,
    "extraAttackIds": [
      "frameLauncherMissile"
    ],
    "factions": [
      "federation"
    ]
  },
  {
    "id": "frameLauncherMissile",
    "name": "フレーム・ランチャー（ミサイル）",
    "cost": 0,
    "power": 125,
    "accuracy": 70,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "heavy-launcher",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "harpoonGun",
    "name": "ハープーン・ガン",
    "cost": 40,
    "power": 105,
    "accuracy": 72,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "harpoon",
    "attackType": "shooting",
    "durability": 0,
    "specials": [
      "antiSubmarine"
    ],
    "factions": [
      "federation"
    ]
  },
  {
    "id": "underwaterBeamRifle",
    "name": "水中用偏向ビーム・ライフル",
    "cost": 60,
    "power": 118,
    "accuracy": 74,
    "range": 4,
    "minRange": 1,
    "consume": 20,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "specials": [
      "antiSubmarine"
    ],
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gmCommandShield",
    "name": "シールド（ジム・コマンド）",
    "cost": 40,
    "power": 0,
    "accuracy": 0,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "guard",
    "durability": 75,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "aircraftVulcan",
    "name": "航空機関砲",
    "cost": 0,
    "power": 35,
    "accuracy": 82,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "aircraft-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "fighterMissile",
    "name": "小型ミサイル",
    "cost": 0,
    "power": 65,
    "accuracy": 70,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 2,
    "category": "aircraft-missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "heavyBomb",
    "name": "対地爆弾",
    "cost": 0,
    "power": 100,
    "accuracy": 60,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "aircraft-bomb",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "cannotTargetFlying": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "antiSubMissile",
    "name": "対潜ミサイル",
    "cost": 0,
    "power": 95,
    "accuracy": 74,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "aircraft-missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "specials": [
      "antiSubmarine"
    ],
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gFighterBeamCannon",
    "name": "Gファイター・ビームキャノン",
    "cost": 0,
    "power": 115,
    "accuracy": 70,
    "range": 4,
    "minRange": 2,
    "consume": 18,
    "kind": "beam",
    "ammo": 0,
    "category": "aircraft-beam",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gFighterNoseMissile",
    "name": "Gファイター機首ミサイル",
    "cost": 0,
    "power": 95,
    "accuracy": 72,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "aircraft-missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "coreBoosterMegaParticleCannon",
    "name": "メガ粒子砲",
    "cost": 0,
    "power": 105,
    "accuracy": 72,
    "range": 4,
    "minRange": 2,
    "consume": 16,
    "kind": "beam",
    "ammo": 0,
    "category": "aircraft-beam",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "beamDisruptionRocket",
    "name": "ビーム撹乱幕ロケット",
    "cost": 0,
    "power": 55,
    "accuracy": 72,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 2,
    "category": "support-rocket",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "specials": [
      "beamDisruption"
    ],
    "factions": [
      "federation"
    ]
  },
  {
    "id": "enhancedBeamSaber",
    "name": "強化型ビーム・サーベル",
    "cost": 0,
    "power": 135,
    "accuracy": 80,
    "range": 1,
    "minRange": 1,
    "consume": 18,
    "kind": "beam",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "beamGunUnit",
    "name": "腕部ビーム・ガンユニット",
    "cost": 0,
    "power": 105,
    "accuracy": 78,
    "range": 4,
    "minRange": 1,
    "consume": 16,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "beamSaberUnit",
    "name": "腕部ビーム・サーベルユニット",
    "cost": 0,
    "power": 125,
    "accuracy": 82,
    "range": 1,
    "minRange": 1,
    "consume": 16,
    "kind": "beam",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "ballUnitPsycommu",
    "name": "ボール・ユニット",
    "cost": 0,
    "power": 105,
    "accuracy": 72,
    "range": 4,
    "minRange": 2,
    "consume": 20,
    "kind": "beam",
    "ammo": 0,
    "category": "psycommu",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "requiredAwakening": 6,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "twinBeamSpearRod",
    "name": "ツイン・ビーム・スピア（ロッド）",
    "cost": 0,
    "power": 120,
    "accuracy": 82,
    "range": 2,
    "minRange": 1,
    "consume": 16,
    "kind": "beam",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "twinBeamSpearScythe",
    "name": "ツイン・ビーム・スピア（サイズ）",
    "cost": 0,
    "power": 155,
    "accuracy": 74,
    "range": 1,
    "minRange": 1,
    "consume": 24,
    "kind": "beam",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "guardianShield",
    "name": "ガーディアン・シールド",
    "cost": 0,
    "power": 0,
    "accuracy": 0,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "guard",
    "durability": 135,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "shieldVulcan",
    "name": "シールド・バルカン",
    "cost": 0,
    "power": 55,
    "accuracy": 80,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "beamDagger",
    "name": "ビーム・ダガー",
    "cost": 0,
    "power": 100,
    "accuracy": 84,
    "range": 1,
    "minRange": 1,
    "consume": 12,
    "kind": "beam",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "torpedo",
    "name": "魚雷",
    "cost": 0,
    "power": 95,
    "accuracy": 68,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 2,
    "category": "torpedo",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "specials": [
      "antiSubmarine"
    ],
    "factions": [
      "federation"
    ]
  },
  {
    "id": "twinSpearGun",
    "name": "二連装式スピア・ガン",
    "cost": 0,
    "power": 100,
    "accuracy": 76,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "harpoon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "specials": [
      "antiSubmarine"
    ],
    "factions": [
      "federation"
    ]
  },
  {
    "id": "fishEyeClawArm",
    "name": "クロー・アーム",
    "cost": 0,
    "power": 85,
    "accuracy": 78,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "claw",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "anchor",
    "name": "アンカー",
    "cost": 0,
    "power": 75,
    "accuracy": 72,
    "range": 2,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "beamPick",
    "name": "ビーム・ピック",
    "cost": 0,
    "power": 105,
    "accuracy": 76,
    "range": 1,
    "minRange": 1,
    "consume": 12,
    "kind": "beam",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "faChestMissileBay",
    "name": "胸部ミサイルベイ",
    "cost": 0,
    "power": 100,
    "accuracy": 68,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "faTwinBeamGun",
    "name": "腕部2連装ビーム・ガン",
    "cost": 0,
    "power": 120,
    "accuracy": 74,
    "range": 4,
    "minRange": 1,
    "consume": 20,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "faRocketCannon360mm",
    "name": "肩部360mmロケット砲",
    "cost": 0,
    "power": 150,
    "accuracy": 60,
    "range": 5,
    "minRange": 3,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "unit7BackLongRangeBeamCannon",
    "name": "背部長距離ビーム・キャノン",
    "cost": 0,
    "power": 160,
    "accuracy": 72,
    "range": 6,
    "minRange": 2,
    "consume": 32,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "unit7MissilePod",
    "name": "ミサイルポッド（7号機）",
    "cost": 0,
    "power": 108,
    "accuracy": 68,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "unit7TwinBeamSprayGun",
    "name": "2連ビーム・スプレーガン",
    "cost": 0,
    "power": 112,
    "accuracy": 74,
    "range": 3,
    "minRange": 1,
    "consume": 18,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "hfa7MegaBeamCannon",
    "name": "メガ・ビーム・キャノン（重装FA7号機）",
    "cost": 0,
    "power": 250,
    "accuracy": 72,
    "range": 7,
    "minRange": 3,
    "consume": 62,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "hfa7LargeMissileContainer",
    "name": "大型ミサイルコンテナ",
    "cost": 0,
    "power": 145,
    "accuracy": 68,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "hfa7WaistBeamCannon",
    "name": "腰部ビーム・キャノン",
    "cost": 0,
    "power": 132,
    "accuracy": 72,
    "range": 4,
    "minRange": 1,
    "consume": 24,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "simpleSmallShield",
    "name": "簡易小型シールド",
    "cost": 0,
    "power": 0,
    "accuracy": 0,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "guard",
    "durability": 45,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "heavyGundamBeamCannon",
    "name": "ビーム・キャノン",
    "cost": 0,
    "power": 135,
    "accuracy": 70,
    "range": 5,
    "minRange": 2,
    "consume": 24,
    "kind": "beam",
    "ammo": 0,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "largeHeatHawk",
    "name": "大型ヒート・ホーク",
    "cost": 0,
    "power": 145,
    "accuracy": 70,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation",
      "zeon"
    ]
  },
  {
    "id": "crackerPod",
    "name": "クラッカー・ポッド",
    "cost": 0,
    "power": 95,
    "accuracy": 72,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "grenade",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zakuCannonGun",
    "name": "ザク・キャノン砲",
    "cost": 0,
    "power": 125,
    "accuracy": 66,
    "range": 5,
    "minRange": 3,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "garmaHeadVulcan",
    "name": "頭部連装バルカン",
    "cost": 0,
    "power": 55,
    "accuracy": 82,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "tripleMachineGun",
    "name": "3連装マシンガン",
    "cost": 0,
    "power": 80,
    "accuracy": 78,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 7,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "tripleMissilePod",
    "name": "3連装ミサイルポッド",
    "cost": 0,
    "power": 105,
    "accuracy": 70,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zeonBeamRifle",
    "name": "ビーム・ライフル（ゲルググ）",
    "cost": 60,
    "power": 128,
    "accuracy": 74,
    "range": 4,
    "minRange": 1,
    "consume": 18,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "desertGelgoogBeamRifle",
    "name": "ビーム・ライフル（砂漠戦仕様）",
    "cost": 55,
    "power": 110,
    "accuracy": 78,
    "range": 3,
    "minRange": 1,
    "consume": 15,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "specials": [
      "antiDesert"
    ],
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "hyperBazooka",
    "name": "ハイパー・バズーカ",
    "cost": 50,
    "power": 145,
    "accuracy": 64,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "bazooka",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gundamHammer",
    "name": "ガンダム・ハンマー",
    "cost": 55,
    "power": 145,
    "accuracy": 58,
    "range": 3,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "hammer",
    "attackType": "melee",
    "durability": 0,
    "ignoresObstacles": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "hyperHammer",
    "name": "ハイパー・ハンマー",
    "cost": 75,
    "power": 165,
    "accuracy": 62,
    "range": 3,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "hammer",
    "attackType": "melee",
    "durability": 0,
    "ignoresObstacles": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "handGrenade",
    "name": "ハンド・グレネード",
    "cost": 35,
    "power": 100,
    "accuracy": 72,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "grenade",
    "attackType": "shooting",
    "durability": 0,
    "ignoresObstacles": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "prototypeBeamRifle",
    "name": "試作型ビーム・ライフル",
    "cost": 65,
    "power": 150,
    "accuracy": 70,
    "range": 4,
    "minRange": 1,
    "consume": 32,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "msMissileLauncher",
    "name": "ミサイル・ランチャー",
    "cost": 50,
    "power": 115,
    "accuracy": 74,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "shield",
    "name": "ガンダム・シールド",
    "cost": 45,
    "power": 0,
    "accuracy": 0,
    "range": 0,
    "minRange": 0,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "guard",
    "durability": 180,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "smallShield",
    "name": "小型シールド",
    "cost": 35,
    "power": 65,
    "accuracy": 75,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "melee",
    "durability": 95,
    "shieldAttackCost": 25,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "cannon180mm",
    "name": "180mmキャノン",
    "cost": 55,
    "power": 130,
    "accuracy": 66,
    "range": 5,
    "minRange": 3,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "cannon",
    "slotCost": 2,
    "attackType": "shooting",
    "durability": 0,
    "ignoresObstacles": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "cannon",
    "name": "240mmキャノン",
    "cost": 0,
    "power": 145,
    "accuracy": 68,
    "range": 5,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "ignoresObstacles": true,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "mudrock300mmCannon",
    "name": "300mm低反動キャノン",
    "cost": 0,
    "power": 155,
    "accuracy": 64,
    "range": 5,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "ignoresObstacles": true,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "sprayMissileLauncher",
    "name": "スプレーミサイルランチャー",
    "cost": 0,
    "power": 110,
    "accuracy": 74,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gmCannonCannon",
    "name": "ジム・キャノン砲",
    "cost": 0,
    "power": 115,
    "accuracy": 68,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "ignoresObstacles": true,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "guntankLowRecoilCannon",
    "name": "120mm低反動キャノン",
    "cost": 0,
    "power": 135,
    "accuracy": 66,
    "range": 6,
    "minRange": 3,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "ignoresObstacles": true,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "bopMissile",
    "name": "ボップミサイル",
    "cost": 0,
    "power": 120,
    "accuracy": 72,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "ironNail",
    "name": "アイアン・ネイル",
    "cost": 0,
    "power": 120,
    "accuracy": 78,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "claw",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "aquaticMegaParticleCannon",
    "name": "水陸両用メガ粒子砲",
    "cost": 0,
    "power": 120,
    "accuracy": 70,
    "range": 4,
    "minRange": 2,
    "consume": 18,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "waterJetMissile",
    "name": "水中ミサイル",
    "cost": 0,
    "power": 105,
    "accuracy": 72,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "specials": [
      "antiSubmarine"
    ],
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "acguyArmMissileLauncher",
    "name": "腕部ミサイルランチャー",
    "cost": 0,
    "power": 90,
    "accuracy": 74,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "specials": [
      "antiSubmarine"
    ],
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zockMegaParticleCannon",
    "name": "胸部メガ粒子砲",
    "cost": 0,
    "power": 145,
    "accuracy": 66,
    "range": 5,
    "minRange": 2,
    "consume": 28,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zockHeadMegaParticleCannon",
    "name": "頭部メガ粒子砲（ゾック）",
    "cost": 0,
    "power": 130,
    "accuracy": 68,
    "range": 4,
    "minRange": 2,
    "consume": 22,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zakuMachineGun",
    "name": "ザク・マシンガン",
    "cost": 35,
    "power": 76,
    "accuracy": 78,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zakuMachineGunGrenade",
    "name": "ザク・マシンガン（グレネード付属）",
    "cost": 60,
    "power": 76,
    "accuracy": 78,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "extraAttackIds": [
      "zakuMachineGunGrenadeShot"
    ],
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zakuMachineGunGrenadeShot",
    "name": "付属グレネード",
    "cost": 0,
    "power": 105,
    "accuracy": 70,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 2,
    "category": "grenade",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zakuMachineGunAntiAir",
    "name": "ザク・マシンガン（対空砲弾）",
    "cost": 40,
    "power": 88,
    "accuracy": 76,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "specials": [
      "antiAir"
    ],
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zakuBazooka",
    "name": "ザク・バズーカ",
    "cost": 45,
    "power": 135,
    "accuracy": 62,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "bazooka",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "armTripleMissileLauncher",
    "name": "腕部3連装ミサイル・ランチャー",
    "cost": 45,
    "power": 105,
    "accuracy": 72,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "enhancedZeonBeamRifle",
    "name": "強化型ビーム・ライフル",
    "cost": 80,
    "power": 145,
    "accuracy": 72,
    "range": 5,
    "minRange": 1,
    "consume": 24,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "goufShield",
    "name": "シールド（グフ）",
    "cost": 30,
    "power": 0,
    "accuracy": 0,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "guard",
    "durability": 55,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "giantBazooka",
    "name": "ジャイアント・バズ",
    "cost": 65,
    "power": 165,
    "accuracy": 60,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "bazooka",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "beamBazooka",
    "name": "ビーム・バズーカ",
    "cost": 105,
    "power": 180,
    "accuracy": 58,
    "range": 5,
    "minRange": 2,
    "consume": 34,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-bazooka",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "magellaTopCannon",
    "name": "マゼラトップ砲",
    "cost": 45,
    "power": 118,
    "accuracy": 66,
    "range": 5,
    "minRange": 3,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "cannon",
    "slotCost": 2,
    "attackType": "shooting",
    "durability": 0,
    "ignoresObstacles": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "antiShipRifle",
    "name": "対艦ライフル",
    "cost": 70,
    "power": 145,
    "accuracy": 66,
    "range": 5,
    "minRange": 3,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "cannon",
    "slotCost": 2,
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "cracker",
    "name": "クラッカー",
    "cost": 30,
    "power": 95,
    "accuracy": 70,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "grenade",
    "attackType": "shooting",
    "durability": 0,
    "ignoresObstacles": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "shieldMissile",
    "name": "シールド・ミサイル",
    "cost": 65,
    "power": 90,
    "accuracy": 72,
    "range": 2,
    "minRange": 1,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "shooting",
    "durability": 130,
    "shieldAttackCost": 45,
    "specials": [
      "mineScatter"
    ],
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "sturmFaust",
    "name": "シュツルム・ファウスト",
    "cost": 45,
    "power": 145,
    "accuracy": 68,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 2,
    "category": "bazooka",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "raketenBazooka",
    "name": "ラケーテン・バズ",
    "cost": 65,
    "power": 150,
    "accuracy": 70,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "bazooka",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "spikeShield",
    "name": "スパイク・シールド",
    "cost": 45,
    "power": 85,
    "accuracy": 78,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "melee",
    "durability": 135,
    "shieldAttackCost": 30,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "shieldPick",
    "name": "シールド・ピック",
    "cost": 0,
    "power": 82,
    "accuracy": 76,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "melee",
    "durability": 75,
    "shieldAttackCost": 22,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "gelgoogShield",
    "name": "大型シールド（ゲルググ）",
    "cost": 65,
    "power": 0,
    "accuracy": 0,
    "range": 0,
    "minRange": 0,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "guard",
    "durability": 190,
    "specials": [
      "antiBeamCoating"
    ],
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "heatHawk",
    "name": "ヒートホーク",
    "cost": 0,
    "power": 90,
    "accuracy": 78,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "free",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "shoulderTackle",
    "name": "ショルダータックル",
    "cost": 0,
    "power": 70,
    "accuracy": 82,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "free",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zakuShoulderShield",
    "name": "肩部シールド",
    "cost": 0,
    "power": 0,
    "accuracy": 0,
    "range": 0,
    "minRange": 0,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "guard",
    "durability": 80,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zakuShoulderShieldSub",
    "name": "肩部シールド（予備）",
    "cost": 0,
    "power": 0,
    "accuracy": 0,
    "range": 0,
    "minRange": 0,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "guard",
    "durability": 80,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "heatSword",
    "name": "ヒートソード",
    "cost": 0,
    "power": 115,
    "accuracy": 82,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "free",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "heatRod",
    "name": "ヒートロッド",
    "cost": 0,
    "power": 80,
    "accuracy": 76,
    "range": 2,
    "minRange": 1,
    "consume": 0,
    "kind": "free",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "heatSaber",
    "name": "ヒートサーベル",
    "cost": 0,
    "power": 105,
    "accuracy": 80,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "free",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "largeHeatSaber",
    "name": "大型ヒート・サーベル",
    "cost": 0,
    "power": 155,
    "accuracy": 72,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "spreadBeam",
    "name": "拡散ビーム",
    "cost": 0,
    "power": 55,
    "accuracy": 78,
    "range": 2,
    "minRange": 1,
    "consume": 8,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "fingerVulcan",
    "name": "フィンガーバルカン",
    "cost": 0,
    "power": 45,
    "accuracy": 82,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "beamNaginata",
    "name": "ビームナギナタ",
    "cost": 0,
    "power": 130,
    "accuracy": 80,
    "range": 1,
    "minRange": 1,
    "consume": 15,
    "kind": "beam",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "azzamMegaParticleCannon",
    "name": "アッザム連装メガ粒子砲",
    "cost": 0,
    "power": 125,
    "accuracy": 68,
    "range": 4,
    "minRange": 2,
    "consume": 22,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "azzamLeader",
    "name": "アッザム・リーダー",
    "cost": 0,
    "power": 125,
    "accuracy": 72,
    "range": 2,
    "minRange": 1,
    "consume": 18,
    "kind": "special",
    "ammo": 0,
    "category": "special",
    "attackType": "shooting",
    "durability": 0,
    "ignoresObstacles": true,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "azzamOrgaMissileLauncher",
    "name": "ミサイル・ランチャー（アッザム・オルガ）",
    "cost": 0,
    "power": 105,
    "accuracy": 72,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "azzamOrgaGroundMachineGun",
    "name": "対地機銃（アッザム・オルガ）",
    "cost": 0,
    "power": 55,
    "accuracy": 84,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "cannotTargetFlying": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "bigroClaw",
    "name": "クロー",
    "cost": 0,
    "power": 140,
    "accuracy": 78,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "claw",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "grabroClaw",
    "name": "グラブロ・クロー",
    "cost": 0,
    "power": 150,
    "accuracy": 76,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "claw",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "grabroTorpedo",
    "name": "グラブロ魚雷",
    "cost": 0,
    "power": 135,
    "accuracy": 72,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "torpedo",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "specials": [
      "antiSubmarine"
    ],
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "mobileArmorMissile",
    "name": "大型ミサイル",
    "cost": 0,
    "power": 125,
    "accuracy": 70,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zegokArmMegaParticleCannon",
    "name": "左腕部メガ粒子砲",
    "cost": 0,
    "power": 105,
    "accuracy": 70,
    "range": 4,
    "minRange": 1,
    "consume": 18,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zegokMultiMissilePass",
    "name": "マルチ・ミサイル・パス",
    "cost": 0,
    "power": 180,
    "accuracy": 58,
    "range": 5,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zegokR1MissileLauncher",
    "name": "R-1（アール・アイン）",
    "cost": 0,
    "power": 135,
    "accuracy": 66,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "kuebelme",
    "name": "クーベルメ",
    "cost": 0,
    "power": 240,
    "accuracy": 62,
    "range": 5,
    "minRange": 1,
    "consume": 65,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "bigroMegaParticleCannon",
    "name": "ビグロ・メガ粒子砲",
    "cost": 0,
    "power": 150,
    "accuracy": 66,
    "range": 5,
    "minRange": 2,
    "consume": 30,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "bigLangGatling",
    "name": "自衛用ガトリング",
    "cost": 0,
    "power": 92,
    "accuracy": 76,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "gatling",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "heatNata",
    "name": "ヒート・ナタ",
    "cost": 0,
    "power": 120,
    "accuracy": 78,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "scatteringMegaParticleCannon",
    "name": "拡散メガ粒子砲",
    "cost": 0,
    "power": 115,
    "accuracy": 76,
    "range": 3,
    "minRange": 1,
    "consume": 20,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "wiredMegaParticleCannon",
    "name": "有線式メガ粒子砲",
    "cost": 0,
    "power": 155,
    "accuracy": 74,
    "range": 6,
    "minRange": 2,
    "consume": 32,
    "kind": "beam",
    "ammo": 0,
    "category": "psycommu",
    "attackType": "shooting",
    "durability": 0,
    "requiredAwakening": 6,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "bit",
    "name": "ビット",
    "cost": 0,
    "power": 145,
    "accuracy": 78,
    "range": 7,
    "minRange": 2,
    "consume": 30,
    "kind": "beam",
    "ammo": 0,
    "category": "psycommu",
    "attackType": "shooting",
    "durability": 0,
    "requiredAwakening": 10,
    "ignoresObstacles": true,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "bigZamLargeMegaParticleCannon",
    "name": "大型メガ粒子砲",
    "cost": 0,
    "power": 190,
    "accuracy": 60,
    "range": 6,
    "minRange": 3,
    "consume": 42,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "bigZamAllRangeMegaParticleCannon",
    "name": "全方位メガ粒子砲",
    "cost": 0,
    "power": 150,
    "accuracy": 66,
    "range": 4,
    "minRange": 1,
    "consume": 28,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "bigZamLegMissile",
    "name": "脚部ミサイル",
    "cost": 0,
    "power": 120,
    "accuracy": 70,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zeongHeadMegaParticleCannon",
    "name": "頭部メガ粒子砲",
    "cost": 0,
    "power": 125,
    "accuracy": 74,
    "range": 4,
    "minRange": 1,
    "consume": 22,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zeongWiredArmMegaParticleCannon",
    "name": "有線式腕部メガ粒子砲",
    "cost": 0,
    "power": 150,
    "accuracy": 76,
    "range": 6,
    "minRange": 2,
    "consume": 30,
    "kind": "beam",
    "ammo": 0,
    "category": "psycommu",
    "attackType": "shooting",
    "durability": 0,
    "requiredAwakening": 6,
    "ignoresObstacles": true,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zeongWaistMegaParticleCannon",
    "name": "腰部メガ粒子砲",
    "cost": 0,
    "power": 135,
    "accuracy": 70,
    "range": 4,
    "minRange": 2,
    "consume": 24,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "doppVulcan",
    "name": "ドップ・バルカン砲",
    "cost": 0,
    "power": 35,
    "accuracy": 82,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "aircraft-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "doppMissile",
    "name": "ドップ・ミサイル",
    "cost": 0,
    "power": 70,
    "accuracy": 70,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 2,
    "category": "aircraft-missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "luggunGun",
    "name": "ルッグン機関砲",
    "cost": 0,
    "power": 35,
    "accuracy": 78,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "aircraft-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "gatlMissile",
    "name": "ガトル5連装ミサイル",
    "cost": 0,
    "power": 65,
    "accuracy": 72,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "aircraft-missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "gatlLargeMissile",
    "name": "ガトル大型ミサイル",
    "cost": 0,
    "power": 95,
    "accuracy": 64,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 1,
    "category": "aircraft-missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "magellaAttackGun",
    "name": "マゼラ・アタック無反動砲",
    "cost": 0,
    "power": 105,
    "accuracy": 68,
    "range": 5,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "singleMegaParticleCannon",
    "name": "単装メガ粒子砲",
    "cost": 0,
    "power": 105,
    "accuracy": 68,
    "range": 5,
    "minRange": 2,
    "consume": 24,
    "kind": "beam",
    "ammo": 0,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation",
      "zeon"
    ]
  },
  {
    "id": "dualMegaParticleCannon",
    "name": "連装メガ粒子砲",
    "cost": 0,
    "power": 135,
    "accuracy": 66,
    "range": 5,
    "minRange": 2,
    "consume": 32,
    "kind": "beam",
    "ammo": 0,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation",
      "zeon"
    ]
  },
  {
    "id": "antiAirGun",
    "name": "対空機銃",
    "cost": 0,
    "power": 45,
    "accuracy": 82,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 10,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation",
      "zeon"
    ]
  },
  {
    "id": "escapeVulcan",
    "name": "脱出艇バルカン",
    "cost": 0,
    "power": 25,
    "accuracy": 82,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "shipCannon",
    "name": "艦砲射撃",
    "cost": 0,
    "power": 95,
    "accuracy": 72,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gunperryMissile",
    "name": "大型ミサイル",
    "cost": 0,
    "power": 145,
    "accuracy": 58,
    "range": 4,
    "minRange": 3,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "federationShipMissile",
    "name": "艦載ミサイル",
    "cost": 0,
    "power": 120,
    "accuracy": 64,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "shipMissile",
    "name": "大型ミサイル",
    "cost": 0,
    "power": 155,
    "accuracy": 60,
    "range": 4,
    "minRange": 3,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "missileLauncher",
    "name": "ミサイル発射管",
    "cost": 0,
    "power": 115,
    "accuracy": 64,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "antiGroundBombing",
    "name": "対地爆撃",
    "cost": 0,
    "power": 150,
    "accuracy": 62,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "cannotTargetFlying": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "transportMachineGun",
    "name": "輸送艦機銃",
    "cost": 0,
    "power": 35,
    "accuracy": 80,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 10,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation",
      "zeon"
    ]
  },
  {
    "id": "submarineTorpedo",
    "name": "潜水艦魚雷",
    "cost": 0,
    "power": 125,
    "accuracy": 72,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "specials": [
      "antiSubmarine"
    ],
    "factions": [
      "federation",
      "zeon"
    ]
  },
  {
    "id": "submarineMissile",
    "name": "潜水艦ミサイル",
    "cost": 0,
    "power": 110,
    "accuracy": 66,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "specials": [
      "antiSubmarine"
    ],
    "factions": [
      "federation",
      "zeon"
    ]
  },
  {
    "id": "rapidFireCannon",
    "name": "速射砲",
    "cost": 0,
    "power": 75,
    "accuracy": 78,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "tripleShipCannon",
    "name": "三連装砲",
    "cost": 0,
    "power": 125,
    "accuracy": 66,
    "range": 5,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "heavySiegeCannon",
    "name": "大型攻城砲",
    "cost": 0,
    "power": 165,
    "accuracy": 58,
    "range": 6,
    "minRange": 3,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "pegasusMegaParticleCannon",
    "name": "ペガサス級メガ粒子砲",
    "cost": 0,
    "power": 150,
    "accuracy": 68,
    "range": 5,
    "minRange": 2,
    "consume": 34,
    "kind": "beam",
    "ammo": 0,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gallopTwinCannon",
    "name": "連装砲塔",
    "cost": 0,
    "power": 95,
    "accuracy": 70,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "dabudeTwinMegaParticleCannon",
    "name": "2連装メガ粒子砲",
    "cost": 0,
    "power": 145,
    "accuracy": 64,
    "range": 5,
    "minRange": 2,
    "consume": 34,
    "kind": "beam",
    "ammo": 0,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zeonTwinShipCannon",
    "name": "2連装実弾砲",
    "cost": 0,
    "power": 130,
    "accuracy": 64,
    "range": 5,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "tripleMegaParticleCannon",
    "name": "3連装メガ粒子砲",
    "cost": 0,
    "power": 155,
    "accuracy": 64,
    "range": 5,
    "minRange": 2,
    "consume": 36,
    "kind": "beam",
    "ammo": 0,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "tenBarrelMegaParticleSubGun",
    "name": "10連装メガ粒子副砲",
    "cost": 0,
    "power": 125,
    "accuracy": 70,
    "range": 4,
    "minRange": 1,
    "consume": 28,
    "kind": "beam",
    "ammo": 0,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zanzibarTwoMegaParticleCannon",
    "name": "ザンジバルII級メガ粒子砲",
    "cost": 0,
    "power": 155,
    "accuracy": 66,
    "range": 5,
    "minRange": 2,
    "consume": 36,
    "kind": "beam",
    "ammo": 0,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 155,
    "accuracy": 66,
    "range": 5,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "heavyGuncannonCannon",
    "name": "重装型240mmキャノン",
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 0,
    "power": 135,
    "accuracy": 74,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "typeDShortCannon",
    "name": "タイプD肩部キャノン",
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 0,
    "power": 155,
    "accuracy": 70,
    "range": 5,
    "minRange": 2,
    "consume": 25,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "guncannon2BeamCannon",
    "name": "ビーム・キャノン",
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 0,
    "power": 105,
    "accuracy": 72,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "guntank2Rocket",
    "name": "4連装ロケット・ランチャー",
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 0,
    "power": 85,
    "accuracy": 80,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "guntank2Missile",
    "name": "3連装ミサイル・ランチャー",
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 0,
    "power": 0,
    "accuracy": 0,
    "range": 0,
    "minRange": 0,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "guard",
    "durability": 55,
    "imagePath": "",
    "id": "simpleFixedShield",
    "name": "簡易固定シールド",
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 0,
    "power": 45,
    "accuracy": 84,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "chestVulcan",
    "name": "胸部バルカン砲",
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 0,
    "power": 80,
    "accuracy": 82,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "ballK15Caliber",
    "name": "15口径キャノン",
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 0,
    "power": 165,
    "accuracy": 64,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 2,
    "category": "bomb",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "largeSmartBomb",
    "name": "大型スマート爆弾",
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 0,
    "power": 0,
    "accuracy": 0,
    "range": 1,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "grenade",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "mineDispenser",
    "name": "機雷散布器",
    "utilityOnly": true,
    "fixedOnly": true,
    "specials": [
      "mineScatter"
    ],
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 35,
    "accuracy": 85,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "zeonHeadVulcan",
    "name": "頭部バルカン",
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 100,
    "accuracy": 72,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "zakuMarineRocketPod",
    "name": "ロケット・ポッド",
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 150,
    "accuracy": 74,
    "range": 5,
    "minRange": 2,
    "consume": 24,
    "kind": "beam",
    "ammo": 0,
    "category": "psycommu",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "psycommuZakuWiredCannon",
    "name": "有線制御式メガ粒子砲",
    "requiredAwakening": 12,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 110,
    "accuracy": 78,
    "range": 3,
    "minRange": 1,
    "consume": 17,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "psycommuZakuLegCannon",
    "name": "脚部メガ粒子砲",
    "requiredAwakening": 10,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 95,
    "accuracy": 84,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "enhancedFingerVulcan",
    "name": "強化型フィンガー・バルカン",
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 90,
    "accuracy": 76,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "legTripleMissilePod",
    "name": "脚部3連装ミサイル・ポッド",
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 155,
    "accuracy": 70,
    "range": 5,
    "minRange": 2,
    "consume": 25,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "gelgoogBeamCannon",
    "name": "ゲルググ用ビーム・キャノン",
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 45,
    "power": 115,
    "accuracy": 68,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "bazooka",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "rocketLauncher",
    "name": "ロケット・ランチャー",
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 50,
    "power": 125,
    "accuracy": 76,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "railCannon",
    "name": "レール・キャノン",
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 75,
    "power": 160,
    "accuracy": 70,
    "range": 6,
    "minRange": 3,
    "consume": 28,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "longRangeBeamRifle",
    "name": "ロングレンジ・ビーム・ライフル",
    "slotCost": 2,
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 40,
    "power": 105,
    "accuracy": 78,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "subrocGun",
    "name": "サブロック・ガン",
    "specials": [
      "antiSubmarine"
    ],
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 60,
    "power": 100,
    "accuracy": 84,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "tripleGatlingGun",
    "name": "3連装ガトリング砲",
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 80,
    "power": 90,
    "accuracy": 80,
    "range": 3,
    "minRange": 1,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "shooting",
    "durability": 125,
    "imagePath": "",
    "id": "gatlingShield",
    "name": "ガトリング・シールド",
    "shieldAttackCost": 25,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 70,
    "power": 150,
    "accuracy": 72,
    "range": 6,
    "minRange": 3,
    "consume": 26,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "beamSniperRifle",
    "name": "ビーム・スナイパー・ライフル",
    "slotCost": 2,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 82,
    "accuracy": 78,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "massProductionGuntankGunLauncher",
    "name": "ガン・ランチャー",
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 0,
    "power": 42,
    "accuracy": 84,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "hoverTruckMachineGun",
    "name": "ホバー・トラック機関砲",
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 0,
    "power": 122,
    "accuracy": 70,
    "range": 5,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "massProductionGuncannonCannon",
    "name": "量産型240mmキャノン",
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 50,
    "power": 125,
    "accuracy": 77,
    "range": 4,
    "minRange": 1,
    "consume": 19,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "groundGundamBeamRifle",
    "name": "ビーム・ライフル（陸戦型ガンダム）",
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 0,
    "power": 92,
    "accuracy": 76,
    "range": 2,
    "minRange": 1,
    "consume": 18,
    "kind": "special",
    "ammo": 0,
    "category": "special",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "apsarasShockWave",
    "name": "ミノフスキークラフト衝撃波",
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 175,
    "accuracy": 58,
    "range": 6,
    "minRange": 3,
    "consume": 36,
    "kind": "beam",
    "ammo": 0,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "apsaras2MegaParticleCannon",
    "name": "大型メガ粒子砲",
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 132,
    "accuracy": 72,
    "range": 3,
    "minRange": 1,
    "consume": 24,
    "kind": "beam",
    "ammo": 0,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "apsaras2ScatterMegaParticleCannon",
    "name": "拡散メガ粒子砲",
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 195,
    "accuracy": 64,
    "range": 7,
    "minRange": 3,
    "consume": 40,
    "kind": "beam",
    "ammo": 0,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "apsaras3MegaParticleCannon",
    "name": "大型メガ粒子砲（完成型）",
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 152,
    "accuracy": 76,
    "range": 4,
    "minRange": 1,
    "consume": 28,
    "kind": "beam",
    "ammo": 0,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "apsaras3ScatterMegaParticleCannon",
    "name": "大型メガ粒子砲（拡散）",
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 138,
    "accuracy": 88,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "free",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "imagePath": "",
    "id": "actZakuDoubleHeatHawk",
    "name": "専用ヒート・ホーク×2",
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 45,
    "power": 118,
    "accuracy": 78,
    "range": 4,
    "minRange": 1,
    "consume": 17,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "actZakuBeamRifle",
    "name": "ビーム・ライフル（アクトザク）",
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 128,
    "accuracy": 68,
    "range": 5,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "gigan180mmCannon",
    "name": "180mm砲",
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 72,
    "accuracy": 82,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "giganFourBarrelGun",
    "name": "4連装砲",
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 92,
    "accuracy": 74,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "gasshaMissilePod",
    "name": "ミサイル・ポッド",
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 45,
    "power": 132,
    "accuracy": 76,
    "range": 3,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "hammer",
    "attackType": "melee",
    "durability": 0,
    "imagePath": "",
    "id": "specialHammerGun",
    "name": "特殊ハンマー・ガン",
    "ignoresObstacles": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 92,
    "accuracy": 90,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "beam-saber",
    "attackType": "melee",
    "durability": 0,
    "imagePath": "",
    "id": "earlyBeamSaber",
    "name": "初期型ビーム・サーベル",
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "cost": 0,
    "power": 76,
    "accuracy": 76,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 2,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "wiredHelicopterMissile",
    "name": "有線式ミサイル",
    "fixedOnly": true,
    "factions": [
      "federation",
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 55,
    "accuracy": 82,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "vulcan",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "helicopterVulcan",
    "name": "ヘリコプター・バルカン砲",
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "cost": 0,
    "power": 88,
    "accuracy": 74,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "imagePath": "",
    "id": "dodaiYsMissile",
    "name": "ド・ダイYSミサイル",
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "gunnerGundamBeamRifle",
    "name": "ビーム・ライフル（ガンナーガンダム）",
    "cost": 70,
    "power": 145,
    "accuracy": 74,
    "range": 5,
    "minRange": 2,
    "consume": 26,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "alexBeamRifle",
    "name": "ビーム・ライフル（アレックス）",
    "cost": 75,
    "power": 148,
    "accuracy": 78,
    "range": 4,
    "minRange": 1,
    "consume": 30,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "alexShield",
    "name": "シールド（アレックス）",
    "cost": 70,
    "power": 0,
    "accuracy": 0,
    "range": 0,
    "minRange": 0,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "guard",
    "durability": 200,
    "specials": [
      "antiBeamCoating"
    ],
    "factions": [
      "federation"
    ]
  },
  {
    "id": "coldClimateMachineGun",
    "name": "マシンガン（寒冷地仕様）",
    "cost": 55,
    "power": 84,
    "accuracy": 82,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "extraAttackIds": [
      "coldClimateGrenadeLauncher"
    ],
    "factions": [
      "federation"
    ]
  },
  {
    "id": "coldClimateGrenadeLauncher",
    "name": "付属グレネード・ランチャー",
    "cost": 0,
    "power": 110,
    "accuracy": 68,
    "range": 3,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 2,
    "category": "grenade",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "alexArmGatling",
    "name": "腕部ガトリング・ガン",
    "cost": 0,
    "power": 82,
    "accuracy": 80,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "mmp80MachineGun",
    "name": "MMP-80マシンガン",
    "cost": 50,
    "power": 88,
    "accuracy": 80,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 7,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "giantBazooka2",
    "name": "ジャイアント・バズII",
    "cost": 75,
    "power": 160,
    "accuracy": 68,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "bazooka",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "beamMachineGun",
    "name": "ビーム・マシンガン",
    "cost": 85,
    "power": 135,
    "accuracy": 80,
    "range": 5,
    "minRange": 1,
    "consume": 24,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "shotgun",
    "name": "ショット・ガン",
    "cost": 55,
    "power": 105,
    "accuracy": 88,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "shotgun",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "chainMine",
    "name": "チェーン・マイン",
    "cost": 70,
    "power": 185,
    "accuracy": 72,
    "range": 1,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 1,
    "category": "mine",
    "attackType": "melee",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "kampferHeadVulcan",
    "name": "頭部バルカン（ケンプファー）",
    "cost": 0,
    "power": 42,
    "accuracy": 84,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "viceClaw",
    "name": "バイス・クロウ",
    "cost": 0,
    "power": 130,
    "accuracy": 80,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "claw",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "hyGoggBeamCannon",
    "name": "腕部ビーム・カノン",
    "cost": 0,
    "power": 118,
    "accuracy": 76,
    "range": 4,
    "minRange": 2,
    "consume": 18,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zgokEBeamCannon",
    "name": "ビーム・カノン（ズゴックE）",
    "cost": 0,
    "power": 124,
    "accuracy": 76,
    "range": 4,
    "minRange": 2,
    "consume": 18,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "aquaticTorpedo",
    "name": "魚雷",
    "cost": 0,
    "power": 108,
    "accuracy": 74,
    "range": 4,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "torpedo",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "specials": [
      "antiSubmarine"
    ],
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "handMissileUnit",
    "name": "ハンド・ミサイル・ユニット",
    "cost": 0,
    "power": 155,
    "accuracy": 68,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 1,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "gelgoogJBeamSpotGun",
    "name": "腕部ビーム・スポットガン",
    "cost": 0,
    "power": 92,
    "accuracy": 82,
    "range": 3,
    "minRange": 1,
    "consume": 12,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "handBeamGun",
    "name": "ハンド・ビーム・ガン",
    "cost": 0,
    "power": 92,
    "accuracy": 80,
    "range": 3,
    "minRange": 1,
    "consume": 14,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "hyperBeamRifle",
    "name": "ハイパー・ビーム・ライフル",
    "cost": 80,
    "power": 160,
    "accuracy": 72,
    "range": 4,
    "minRange": 1,
    "consume": 34,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "megaBeamLauncher",
    "name": "メガ・ビーム・ランチャー",
    "cost": 120,
    "power": 295,
    "accuracy": 64,
    "range": 7,
    "minRange": 3,
    "consume": 55,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "slotCost": 2,
    "chargeRequired": 2,
    "chargeCost": 35,
    "chargeResetOnFire": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "jormungandCannon",
    "name": "ヨルムンガンド砲",
    "cost": 0,
    "power": 430,
    "accuracy": 46,
    "range": 10,
    "minRange": 1,
    "consume": 85,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "chargeRequired": 2,
    "chargeCost": 45,
    "chargeResetOnFire": true,
    "fixedOnly": true,
    "ignoresObstacles": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "giantGatling",
    "name": "ジャイアント・ガトリング",
    "cost": 95,
    "power": 152,
    "accuracy": 74,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "gatling",
    "attackType": "shooting",
    "durability": 0,
    "slotCost": 2,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "submachineGun90mm",
    "name": "90mmサブマシンガン",
    "cost": 30,
    "power": 75,
    "accuracy": 80,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "efreetHeatSaber",
    "name": "ヒート・サーベル（イフリート）",
    "cost": 0,
    "power": 132,
    "accuracy": 82,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "heatLanceSchneid",
    "name": "ヒート・ランサー",
    "cost": 0,
    "power": 148,
    "accuracy": 78,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "heatKnife",
    "name": "ヒート・ナイフ",
    "cost": 0,
    "power": 92,
    "accuracy": 84,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation",
      "zeon"
    ]
  },
  {
    "id": "throwingHeatKnife",
    "name": "投擲ヒート・ナイフ",
    "cost": 0,
    "power": 84,
    "accuracy": 78,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "throwing",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "coldBladeNacht",
    "name": "コールド・ブレード",
    "cost": 0,
    "power": 132,
    "accuracy": 82,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "coldKunaiNacht",
    "name": "コールド・クナイ",
    "cost": 0,
    "power": 84,
    "accuracy": 78,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "throwing",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "frogBallMissile",
    "name": "水中ミサイル",
    "cost": 0,
    "power": 98,
    "accuracy": 74,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "specials": [
      "antiSubmarine"
    ],
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "mineScatterPod",
    "name": "機雷散布ポッド",
    "cost": 0,
    "power": 0,
    "accuracy": 100,
    "range": 0,
    "minRange": 0,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "mine",
    "attackType": "support",
    "durability": 0,
    "specials": [
      "mineScatter"
    ],
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "spaceMineScatterPod",
    "name": "宇宙機雷散布ポッド",
    "cost": 0,
    "power": 0,
    "accuracy": 100,
    "range": 0,
    "minRange": 0,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "mine",
    "attackType": "support",
    "durability": 0,
    "specials": [
      "mineScatter"
    ],
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "smallMachineGun",
    "name": "小型マシンガン",
    "cost": 0,
    "power": 54,
    "accuracy": 82,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "guncannonHalfCannon",
    "name": "240mmキャノン（ハーフ）",
    "cost": 0,
    "power": 112,
    "accuracy": 68,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "antiSubTorpedo",
    "name": "対潜魚雷",
    "cost": 0,
    "power": 118,
    "accuracy": 76,
    "range": 4,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "torpedo",
    "attackType": "shooting",
    "durability": 0,
    "specials": [
      "antiSubmarine"
    ],
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "salamisCannon",
    "name": "サラミス砲",
    "cost": 0,
    "power": 230,
    "accuracy": 58,
    "range": 7,
    "minRange": 3,
    "consume": 46,
    "kind": "beam",
    "ammo": 0,
    "category": "ship-gun",
    "attackType": "shooting",
    "durability": 0,
    "chargeRequired": 1,
    "chargeCost": 28,
    "chargeResetOnFire": true,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "prototypeTwinBeamRifle",
    "name": "試作2連装ビーム・ライフル",
    "cost": 0,
    "power": 132,
    "accuracy": 76,
    "range": 4,
    "minRange": 1,
    "consume": 22,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "agguguyHeatRod",
    "name": "4連装ヒート・ロッド",
    "cost": 0,
    "power": 136,
    "accuracy": 76,
    "range": 2,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "armPunch",
    "name": "アーム・パンチ",
    "cost": 0,
    "power": 124,
    "accuracy": 80,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "boomerangCutter",
    "name": "ブーメラン・カッター",
    "cost": 0,
    "power": 96,
    "accuracy": 78,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "boomerang",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "juagguTripleRocket",
    "name": "腕部3連装ロケット砲",
    "cost": 0,
    "power": 122,
    "accuracy": 70,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "rocket",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "aggDrill",
    "name": "大型削岩ドリル",
    "cost": 0,
    "power": 170,
    "accuracy": 70,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "laserTorch",
    "name": "レーザー・トーチ",
    "cost": 0,
    "power": 46,
    "accuracy": 74,
    "range": 2,
    "minRange": 1,
    "consume": 8,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-tool",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "heatRam",
    "name": "ヒート・ラム",
    "cost": 0,
    "power": 146,
    "accuracy": 76,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "clawShield",
    "name": "クロー・シールド",
    "cost": 0,
    "power": 92,
    "accuracy": 78,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "melee",
    "durability": 80,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "greenMacacMissilePod",
    "name": "ミサイル・ポッド",
    "cost": 0,
    "power": 96,
    "accuracy": 70,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "pincerArm",
    "name": "大型ペンチアーム",
    "cost": 0,
    "power": 104,
    "accuracy": 76,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "wildBoarDoubleMachineGun",
    "name": "二連装マシンガン",
    "cost": 0,
    "power": 80,
    "accuracy": 78,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "wiredMegaParticleGun",
    "name": "有線式メガ粒子砲",
    "cost": 0,
    "power": 132,
    "accuracy": 72,
    "range": 5,
    "minRange": 2,
    "consume": 24,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "wiredHeatNata",
    "name": "有線式ヒート・ナタ",
    "cost": 0,
    "power": 126,
    "accuracy": 78,
    "range": 2,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "giantMissile",
    "name": "超大型ミサイル",
    "cost": 0,
    "power": 220,
    "accuracy": 62,
    "range": 5,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 1,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "bigroMayerBeamCannon",
    "name": "ビーム・カノン",
    "cost": 0,
    "power": 156,
    "accuracy": 70,
    "range": 5,
    "minRange": 2,
    "consume": 30,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "aquaticBit",
    "name": "試作水中ビット",
    "cost": 0,
    "power": 150,
    "accuracy": 74,
    "range": 5,
    "minRange": 2,
    "consume": 28,
    "kind": "beam",
    "ammo": 0,
    "category": "bit",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zeonSniperRifle",
    "name": "スナイパーライフル",
    "cost": 70,
    "power": 150,
    "accuracy": 74,
    "range": 6,
    "minRange": 3,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "sniper-rifle",
    "attackType": "shooting",
    "durability": 0,
    "slotCost": 2,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "zeonHandgun",
    "name": "ハンドガン",
    "cost": 25,
    "power": 64,
    "accuracy": 82,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "handgun",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "fixedShield",
    "name": "固定シールド",
    "cost": 0,
    "power": 70,
    "accuracy": 82,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "melee",
    "durability": 90,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gtFourBeamCannon",
    "name": "ビーム・キャノン（GT-FOUR）",
    "cost": 0,
    "power": 122,
    "accuracy": 72,
    "range": 4,
    "minRange": 2,
    "consume": 22,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "bdChestMissile",
    "name": "胸部ミサイル",
    "cost": 0,
    "power": 88,
    "accuracy": 76,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation",
      "zeon"
    ]
  },
  {
    "id": "beamBayonet",
    "name": "ビーム・ベイオネット",
    "cost": 0,
    "power": 132,
    "accuracy": 80,
    "range": 1,
    "minRange": 1,
    "consume": 16,
    "kind": "beam",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "bayonetBeamGun",
    "name": "ビーム・ベイオネット内蔵ビームガン",
    "cost": 0,
    "power": 88,
    "accuracy": 78,
    "range": 3,
    "minRange": 1,
    "consume": 12,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "roundShield",
    "name": "ラウンド・シールド",
    "cost": 45,
    "power": 84,
    "accuracy": 78,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "melee",
    "durability": 110,
    "specials": [
      "impactDiffusionArmor"
    ],
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "dolmelArmBeamSaber",
    "name": "両腕部ビーム・サーベル",
    "cost": 0,
    "power": 142,
    "accuracy": 82,
    "range": 1,
    "minRange": 1,
    "consume": 18,
    "kind": "beam",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "heatPile",
    "name": "肩部ヒート・パイル",
    "cost": 0,
    "power": 132,
    "accuracy": 78,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "dolmelMissilePod",
    "name": "ミサイル・ポッド（ドルメル）",
    "cost": 0,
    "power": 104,
    "accuracy": 72,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "qatalBeamBlade",
    "name": "ビームブレード",
    "cost": 0,
    "power": 150,
    "accuracy": 80,
    "range": 1,
    "minRange": 1,
    "consume": 20,
    "kind": "beam",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "qatalBeamCannon",
    "name": "内蔵ビーム砲",
    "cost": 0,
    "power": 132,
    "accuracy": 74,
    "range": 4,
    "minRange": 2,
    "consume": 24,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "qatalBit",
    "name": "ビット",
    "cost": 0,
    "power": 152,
    "accuracy": 76,
    "range": 5,
    "minRange": 2,
    "consume": 30,
    "kind": "beam",
    "ammo": 0,
    "category": "bit",
    "attackType": "shooting",
    "durability": 0,
    "requiredAwakening": 10,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "removalMace",
    "name": "リムーヴァル・メイス",
    "cost": 0,
    "power": 128,
    "accuracy": 78,
    "range": 1,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "melee",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "scissorAnchor",
    "name": "シザー・アンカー",
    "cost": 0,
    "power": 96,
    "accuracy": 76,
    "range": 2,
    "minRange": 1,
    "consume": 0,
    "kind": "melee",
    "ammo": 0,
    "category": "anchor",
    "attackType": "melee",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "goufGatling120mm",
    "name": "120mmガトリング",
    "cost": 0,
    "power": 108,
    "accuracy": 70,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "gatling",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "efreetLegMissilePod",
    "name": "脚部ミサイルポッド",
    "cost": 0,
    "power": 94,
    "accuracy": 74,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "gelgoogArmGrenadeLauncher",
    "name": "腕部グレネード・ランチャー",
    "cost": 0,
    "power": 96,
    "accuracy": 76,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "grenade",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "armedBuster",
    "name": "アームド・バスター",
    "cost": 0,
    "power": 158,
    "accuracy": 66,
    "range": 5,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "rhinoSarasMachineGun",
    "name": "大口径マシンガン",
    "cost": 0,
    "power": 116,
    "accuracy": 72,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 7,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "rhinoSarasMissilePod",
    "name": "各部ミサイルポッド",
    "cost": 0,
    "power": 120,
    "accuracy": 68,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 5,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "rhinoSarasCannon",
    "name": "大口径キャノン砲",
    "cost": 0,
    "power": 190,
    "accuracy": 60,
    "range": 6,
    "minRange": 3,
    "consume": 1,
    "kind": "ammo",
    "ammo": 3,
    "category": "cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "fellowBoosterMissile",
    "name": "フェロウ・ブースター用ミサイル",
    "cost": 0,
    "power": 92,
    "accuracy": 72,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "corvetteBoosterMissile",
    "name": "コルベット・ブースター用ミサイル",
    "cost": 0,
    "power": 90,
    "accuracy": 74,
    "range": 4,
    "minRange": 2,
    "consume": 1,
    "kind": "ammo",
    "ammo": 4,
    "category": "missile",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "bustlinerMegaParticleCannon",
    "name": "バストライナー・メガ粒子砲",
    "cost": 0,
    "power": 185,
    "accuracy": 64,
    "range": 6,
    "minRange": 3,
    "consume": 34,
    "kind": "beam",
    "ammo": 0,
    "category": "mega-particle-cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "skiureMegaParticleCannon",
    "name": "スキウレ・メガ粒子砲",
    "cost": 0,
    "power": 180,
    "accuracy": 64,
    "range": 6,
    "minRange": 3,
    "consume": 0,
    "kind": "beam",
    "ammo": 4,
    "category": "mega-particle-cannon",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  },
  {
    "id": "gundamExHeadMachineGun",
    "name": "四連装頭部機関砲",
    "cost": 0,
    "power": 50,
    "accuracy": 72,
    "range": 2,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 8,
    "category": "machine-gun",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gundamExShoulderGatling",
    "name": "ショルダー・ガトリング",
    "cost": 0,
    "power": 90,
    "accuracy": 68,
    "range": 3,
    "minRange": 1,
    "consume": 1,
    "kind": "ammo",
    "ammo": 6,
    "category": "gatling",
    "attackType": "shooting",
    "durability": 0,
    "fixedOnly": true,
    "specials": [
      "antiAir"
    ],
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gundamExBeamRifle",
    "name": "ビーム・ライフル（ガンダムEX）",
    "cost": 65,
    "power": 140,
    "accuracy": 78,
    "range": 4,
    "minRange": 1,
    "consume": 22,
    "kind": "beam",
    "ammo": 0,
    "category": "beam-rifle",
    "attackType": "shooting",
    "durability": 0,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "gundamExShield",
    "name": "シールド（ガンダムEX）",
    "cost": 50,
    "power": 0,
    "accuracy": 0,
    "range": 0,
    "minRange": 0,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "guard",
    "durability": 190,
    "factions": [
      "federation"
    ]
  },
  {
    "id": "solariShoulderShield",
    "name": "大型肩部シールド（ソラリ機）",
    "cost": 0,
    "power": 0,
    "accuracy": 0,
    "range": 0,
    "minRange": 0,
    "consume": 0,
    "kind": "shield",
    "ammo": 0,
    "category": "shield",
    "attackType": "guard",
    "durability": 100,
    "fixedOnly": true,
    "factions": [
      "zeon"
    ]
  }
];
