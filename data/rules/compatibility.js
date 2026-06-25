"use strict";

// Character/MS and MS/weapon compatibility bonuses.
window.GAME_DATA = window.GAME_DATA ?? {};
window.GAME_DATA.compatibility = {
  "characterMs": [
    {
      "characterId": "amuro",
      "msTag": "gundam",
      "evasionBonus": 12
    },
    {
      "characterId": "amuro",
      "msTag": "vProject",
      "evasionBonus": 8
    },
    {
      "characterId": "amuroAwakened",
      "msTag": "gundam",
      "evasionBonus": 14
    },
    {
      "characterId": "amuroAwakened",
      "msTag": "vProject",
      "evasionBonus": 10
    },
    {
      "characterId": "kai",
      "msTag": "guncannon",
      "evasionBonus": 8
    },
    {
      "characterId": "kai",
      "msTag": "guntank",
      "evasionBonus": 6
    },
    {
      "characterId": "hayato",
      "msTag": "guncannon",
      "evasionBonus": 5
    },
    {
      "characterId": "hayato",
      "msTag": "guntank",
      "evasionBonus": 8
    },
    {
      "characterId": "ryu",
      "msTag": "guntank",
      "evasionBonus": 6
    },
    {
      "characterId": "ryu",
      "msTag": "coreFighter",
      "evasionBonus": 5
    },
    {
      "characterId": "sleggar",
      "msTag": "coreFighter",
      "evasionBonus": 8
    },
    {
      "characterId": "sleggar",
      "msTag": "gParts",
      "evasionBonus": 6
    },
    {
      "characterId": "shin",
      "msTag": "gm",
      "evasionBonus": 6
    },
    {
      "characterId": "sayla",
      "msTag": "coreFighter",
      "evasionBonus": 8
    },
    {
      "characterId": "sayla",
      "msTag": "gParts",
      "evasionBonus": 6
    },
    {
      "characterId": "jobJohn",
      "msTag": "guncannon",
      "evasionBonus": 4
    },
    {
      "characterId": "jobJohn",
      "msTag": "guntank",
      "evasionBonus": 5
    },
    {
      "characterId": "temRay",
      "msTag": "gundam",
      "evasionBonus": 3
    },
    {
      "characterId": "wakkein",
      "msTag": "gm",
      "evasionBonus": 6
    },
    {
      "characterId": "char",
      "msTag": "charCustom",
      "evasionBonus": 12
    },
    {
      "characterId": "char",
      "msTag": "gelgoog",
      "evasionBonus": 8
    },
    {
      "characterId": "char",
      "msTag": "zeong",
      "evasionBonus": 10
    },
    {
      "characterId": "ramba",
      "msTag": "gouf",
      "evasionBonus": 10
    },
    {
      "characterId": "dozle",
      "msTag": "bigZam",
      "evasionBonus": 10
    },
    {
      "characterId": "garma",
      "msTag": "zeonAircraft",
      "evasionBonus": 6
    },
    {
      "characterId": "mquve",
      "msTag": "gyan",
      "evasionBonus": 10
    },
    {
      "characterId": "mquve",
      "msId": "azzam",
      "evasionBonus": 6
    },
    {
      "characterId": "gaia",
      "msTag": "dom",
      "evasionBonus": 10
    },
    {
      "characterId": "mash",
      "msTag": "dom",
      "evasionBonus": 8
    },
    {
      "characterId": "ortega",
      "msTag": "dom",
      "evasionBonus": 8
    },
    {
      "characterId": "lalah",
      "msTag": "psycommu",
      "evasionBonus": 12
    },
    {
      "characterId": "challiaBull",
      "msTag": "psycommu",
      "evasionBonus": 8
    },
    {
      "characterId": "gene",
      "msTag": "zaku",
      "evasionBonus": 5
    },
    {
      "characterId": "denim",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "slender",
      "msTag": "zaku",
      "evasionBonus": 7
    },
    {
      "characterId": "cucuruzDoan",
      "msId": "zaku2",
      "evasionBonus": 9
    },
    {
      "characterId": "clamp",
      "msId": "zaku2",
      "evasionBonus": 7
    },
    {
      "characterId": "clamp",
      "msTag": "gouf",
      "evasionBonus": 5
    },
    {
      "characterId": "cozunGraham",
      "msId": "zaku2",
      "evasionBonus": 6
    },
    {
      "characterId": "acous",
      "msId": "zaku2",
      "evasionBonus": 6
    },
    {
      "characterId": "crown",
      "msId": "zaku2",
      "evasionBonus": 5
    },
    {
      "characterId": "demitry",
      "msId": "zakrello",
      "evasionBonus": 10
    },
    {
      "characterId": "tokwan",
      "msId": "bigro",
      "evasionBonus": 10
    },
    {
      "characterId": "flanaganBoone",
      "msId": "grabro",
      "evasionBonus": 10
    },
    {
      "characterId": "flanaganBoone",
      "msTag": "aquatic",
      "evasionBonus": 6
    },
    {
      "characterId": "oliverMay",
      "msTag": "supportPod",
      "evasionBonus": 5
    },
    {
      "characterId": "texanDimitry",
      "msTag": "federationAircraft",
      "evasionBonus": 8
    },
    {
      "characterId": "jackBayard",
      "msTag": "gm",
      "evasionBonus": 7
    },
    {
      "characterId": "adamStingray",
      "msTag": "gm",
      "evasionBonus": 6
    },
    {
      "characterId": "lydoWolf",
      "msId": "gmCannonLydo",
      "evasionBonus": 12
    },
    {
      "characterId": "francisBackmeyer",
      "msId": "gmSniperCustom",
      "evasionBonus": 10
    },
    {
      "characterId": "tennesJung",
      "msId": "gmSniperCustom",
      "evasionBonus": 8
    },
    {
      "characterId": "tennesJung",
      "msId": "gmCommandSpace",
      "evasionBonus": 8
    },
    {
      "characterId": "tennesJung",
      "msId": "gmCommandGround",
      "evasionBonus": 8
    },
    {
      "characterId": "garryRogers",
      "msId": "gmLightArmor",
      "evasionBonus": 8
    },
    {
      "characterId": "garryRogers",
      "msId": "gmStriker",
      "evasionBonus": 9
    },
    {
      "characterId": "heinzBaer",
      "msId": "fullArmorGundam",
      "evasionBonus": 8
    },
    {
      "characterId": "denBazark",
      "msId": "heavyGundam",
      "evasionBonus": 8
    },
    {
      "characterId": "char",
      "msId": "charRickDom",
      "evasionBonus": 12
    },
    {
      "characterId": "ramba",
      "msId": "rambaZaku1",
      "evasionBonus": 10
    },
    {
      "characterId": "dozle",
      "msId": "dozleZaku2",
      "evasionBonus": 10
    },
    {
      "characterId": "garma",
      "msId": "garmaZaku2S",
      "evasionBonus": 10
    },
    {
      "characterId": "mquve",
      "msId": "mquveGouf",
      "evasionBonus": 6
    },
    {
      "characterId": "cuscoAl",
      "msId": "elmeth",
      "evasionBonus": 10
    },
    {
      "characterId": "leroyGilliam",
      "msTag": "rickDom",
      "evasionBonus": 6
    },
    {
      "characterId": "boraskiniv",
      "msId": "zock",
      "evasionBonus": 8
    },
    {
      "characterId": "shinMatsunaga",
      "msId": "matsunagaZaku2",
      "evasionBonus": 10
    },
    {
      "characterId": "shinMatsunaga",
      "msId": "matsunagaHighMobilityZaku",
      "evasionBonus": 12
    },
    {
      "characterId": "johnnyRidden",
      "msId": "johnnyHighMobilityZaku",
      "evasionBonus": 12
    },
    {
      "characterId": "ianGreydon",
      "msId": "zakuCannon",
      "evasionBonus": 8
    },
    {
      "characterId": "gadem",
      "msTag": "zaku1",
      "evasionBonus": 10
    },
    {
      "characterId": "akahana",
      "msTag": "acguy",
      "evasionBonus": 10
    },
    {
      "characterId": "char",
      "msId": "charZgok",
      "evasionBonus": 12
    },
    {
      "characterId": "rob07",
      "msTag": "groundGm",
      "evasionBonus": 7
    },
    {
      "characterId": "rob07",
      "msTag": "groundGundam",
      "evasionBonus": 7
    },
    {
      "characterId": "sally07",
      "msTag": "groundGm",
      "evasionBonus": 7
    },
    {
      "characterId": "sally07",
      "msTag": "groundGundam",
      "evasionBonus": 7
    },
    {
      "characterId": "mike07",
      "msTag": "groundGm",
      "evasionBonus": 7
    },
    {
      "characterId": "mike07",
      "msTag": "groundGundam",
      "evasionBonus": 7
    },
    {
      "characterId": "geraldSakai",
      "msTag": "rickDom",
      "evasionBonus": 7
    },
    {
      "characterId": "geraldSakai",
      "msTag": "gelgoog",
      "evasionBonus": 8
    },
    {
      "characterId": "thomasKurtz",
      "msTag": "gouf",
      "evasionBonus": 8
    },
    {
      "characterId": "thomasKurtz",
      "msTag": "gelgoog",
      "evasionBonus": 8
    },
    {
      "characterId": "brenissOx",
      "msTag": "rickDom",
      "evasionBonus": 10
    },
    {
      "characterId": "robertGilliam",
      "msTag": "highMobilityZaku",
      "evasionBonus": 9
    },
    {
      "characterId": "gabbyHazard",
      "msTag": "highMobilityZaku",
      "evasionBonus": 9
    },
    {
      "characterId": "royGreenwood",
      "msTag": "desert",
      "evasionBonus": 9
    },
    {
      "characterId": "top08",
      "msTag": "zaku1",
      "evasionBonus": 8
    },
    {
      "characterId": "as08",
      "msId": "zaku2",
      "evasionBonus": 7
    },
    {
      "characterId": "dell08",
      "msId": "zaku2",
      "evasionBonus": 7
    },
    {
      "characterId": "boneAbust",
      "msId": "magellaAttack",
      "evasionBonus": 8
    },
    {
      "characterId": "johnnyRidden",
      "msId": "johnnyHighMobilityGelgoog",
      "evasionBonus": 12
    },
    {
      "characterId": "shiroAmada",
      "msTag": "groundGundam",
      "evasionBonus": 10
    },
    {
      "characterId": "karenJoshua",
      "msTag": "groundGundam",
      "evasionBonus": 8
    },
    {
      "characterId": "terrySandersJr",
      "msTag": "groundGundam",
      "evasionBonus": 8
    },
    {
      "characterId": "micheleNinorich",
      "msId": "hoverTruck",
      "evasionBonus": 6
    },
    {
      "characterId": "eledoreMassis",
      "msId": "hoverTruck",
      "evasionBonus": 8
    },
    {
      "characterId": "ainaSahalin",
      "msTag": "apsaras",
      "evasionBonus": 9
    },
    {
      "characterId": "ghiniusSahalin",
      "msTag": "apsaras",
      "evasionBonus": 7
    },
    {
      "characterId": "norrisPackard",
      "msTag": "gouf",
      "evasionBonus": 12
    },
    {
      "characterId": "lydoWolf",
      "msId": "massProductionGuncannonLydo",
      "evasionBonus": 12
    },
    {
      "characterId": "lydoWolf",
      "msId": "gmSniper2Lydo",
      "evasionBonus": 12
    }
  ],
  "msWeapon": [
    {
      "msId": "gundam",
      "weaponId": "beamRifle",
      "accuracyBonus": 6
    },
    {
      "msTag": "gundam",
      "weaponId": "prototypeBeamRifle",
      "accuracyBonus": 6
    },
    {
      "msTag": "gundam",
      "weaponId": "gundamHammer",
      "accuracyBonus": 7
    },
    {
      "msTag": "gundam",
      "weaponId": "hyperHammer",
      "accuracyBonus": 7
    },
    {
      "msTag": "guncannon",
      "weaponId": "guncannonBeamRifle",
      "accuracyBonus": 8
    },
    {
      "msTag": "gm",
      "weaponId": "beamSprayGun",
      "accuracyBonus": 7
    },
    {
      "msTag": "gm",
      "weaponId": "gmCannonCannon",
      "accuracyBonus": 7
    },
    {
      "msTag": "gm",
      "category": "bazooka",
      "accuracyBonus": 5
    },
    {
      "msTag": "gm",
      "weaponId": "beamGun",
      "accuracyBonus": 6
    },
    {
      "msId": "gmCommandSpace",
      "weaponId": "bullpupMachineGun",
      "accuracyBonus": 7
    },
    {
      "msId": "gmCommandGround",
      "weaponId": "bullpupMachineGun",
      "accuracyBonus": 7
    },
    {
      "msId": "gmKai",
      "weaponId": "bullpupMachineGun",
      "accuracyBonus": 7
    },
    {
      "msId": "gmJuggler",
      "weaponId": "bullpupMachineGun",
      "accuracyBonus": 7
    },
    {
      "msId": "gmCommandSpace",
      "weaponId": "gmCommandShield",
      "accuracyBonus": 4
    },
    {
      "msId": "gmCommandGround",
      "weaponId": "gmCommandShield",
      "accuracyBonus": 4
    },
    {
      "msId": "gmKai",
      "weaponId": "gmCommandShield",
      "accuracyBonus": 4
    },
    {
      "msId": "gmStriker",
      "weaponId": "federationSpikeShield",
      "accuracyBonus": 8
    },
    {
      "msId": "heavyGundam",
      "weaponId": "frameLauncher",
      "accuracyBonus": 8
    },
    {
      "msId": "aquaGm",
      "weaponId": "harpoonGun",
      "accuracyBonus": 8
    },
    {
      "msId": "fishEye",
      "weaponId": "twinSpearGun",
      "accuracyBonus": 8
    },
    {
      "msId": "fishEye",
      "weaponId": "fishEyeClawArm",
      "accuracyBonus": 6
    },
    {
      "msId": "aquaticGundam",
      "weaponId": "harpoonGun",
      "accuracyBonus": 8
    },
    {
      "msId": "aquaticGundam",
      "weaponId": "underwaterBeamRifle",
      "accuracyBonus": 8
    },
    {
      "msTag": "gundam",
      "category": "bazooka",
      "accuracyBonus": 5
    },
    {
      "msTag": "gParts",
      "weaponId": "gFighterBeamCannon",
      "accuracyBonus": 6
    },
    {
      "msTag": "gParts",
      "weaponId": "gFighterNoseMissile",
      "accuracyBonus": 6
    },
    {
      "msTag": "cannonMs",
      "category": "cannon",
      "accuracyBonus": 8
    },
    {
      "msTag": "zaku",
      "weaponId": "zakuMachineGun",
      "accuracyBonus": 6
    },
    {
      "msTag": "zaku",
      "weaponId": "zakuMachineGunGrenade",
      "accuracyBonus": 6
    },
    {
      "msTag": "zaku",
      "weaponId": "zakuMachineGunAntiAir",
      "accuracyBonus": 6
    },
    {
      "msTag": "zaku",
      "weaponId": "zakuBazooka",
      "accuracyBonus": 5
    },
    {
      "msTag": "zaku",
      "weaponId": "magellaTopCannon",
      "accuracyBonus": 5
    },
    {
      "msTag": "dom",
      "weaponId": "giantBazooka",
      "accuracyBonus": 8
    },
    {
      "msTag": "dom",
      "weaponId": "beamBazooka",
      "accuracyBonus": 6
    },
    {
      "msTag": "dom",
      "weaponId": "raketenBazooka",
      "accuracyBonus": 7
    },
    {
      "msTag": "gelgoog",
      "weaponId": "zeonBeamRifle",
      "accuracyBonus": 8
    },
    {
      "msTag": "gelgoog",
      "weaponId": "armTripleMissileLauncher",
      "accuracyBonus": 7
    },
    {
      "msTag": "gelgoog",
      "weaponId": "enhancedZeonBeamRifle",
      "accuracyBonus": 8
    },
    {
      "msTag": "gouf",
      "weaponId": "goufShield",
      "accuracyBonus": 5
    },
    {
      "msId": "johnnyHighMobilityZaku",
      "weaponId": "giantBazooka",
      "accuracyBonus": 8
    },
    {
      "msTag": "gyan",
      "weaponId": "shieldMissile",
      "accuracyBonus": 8
    },
    {
      "msTag": "aquatic",
      "weaponId": "ironNail",
      "accuracyBonus": 5
    },
    {
      "msTag": "aquatic",
      "weaponId": "aquaticMegaParticleCannon",
      "accuracyBonus": 5
    },
    {
      "msTag": "aquatic",
      "weaponId": "waterJetMissile",
      "accuracyBonus": 5
    },
    {
      "msTag": "aquatic",
      "weaponId": "acguyArmMissileLauncher",
      "accuracyBonus": 5
    },
    {
      "msTag": "aquaticMa",
      "weaponId": "grabroClaw",
      "accuracyBonus": 6
    },
    {
      "msTag": "aquaticMa",
      "weaponId": "grabroTorpedo",
      "accuracyBonus": 6
    },
    {
      "msTag": "psycommu",
      "weaponId": "wiredMegaParticleCannon",
      "accuracyBonus": 8
    },
    {
      "msTag": "psycommu",
      "weaponId": "bit",
      "accuracyBonus": 8
    },
    {
      "msTag": "psycommu",
      "weaponId": "zeongWiredArmMegaParticleCannon",
      "accuracyBonus": 8
    },
    {
      "msTag": "mobileArmor",
      "weaponId": "mobileArmorMissile",
      "accuracyBonus": 5
    },
    {
      "msTag": "groundGm",
      "weaponId": "federationMachineGun100mm",
      "accuracyBonus": 7
    },
    {
      "msTag": "groundGm",
      "weaponId": "cannon180mm",
      "accuracyBonus": 8
    },
    {
      "msTag": "groundGm",
      "weaponId": "missileLauncher",
      "accuracyBonus": 7
    },
    {
      "msTag": "groundGundam",
      "weaponId": "federationMachineGun100mm",
      "accuracyBonus": 7
    },
    {
      "msTag": "groundGundam",
      "weaponId": "cannon180mm",
      "accuracyBonus": 8
    },
    {
      "msTag": "groundGundam",
      "weaponId": "missileLauncher",
      "accuracyBonus": 7
    },
    {
      "msId": "landCombatGm",
      "weaponId": "railCannon",
      "accuracyBonus": 9
    },
    {
      "msTag": "groundGm",
      "weaponId": "rocketLauncher",
      "accuracyBonus": 8
    },
    {
      "msTag": "groundGundam",
      "weaponId": "rocketLauncher",
      "accuracyBonus": 8
    },
    {
      "msTag": "gmSniper",
      "weaponId": "longRangeBeamRifle",
      "accuracyBonus": 10
    },
    {
      "msId": "zakuMarine",
      "weaponId": "subrocGun",
      "accuracyBonus": 10
    },
    {
      "msTag": "gouf",
      "weaponId": "tripleGatlingGun",
      "accuracyBonus": 8
    },
    {
      "msTag": "gouf",
      "weaponId": "gatlingShield",
      "accuracyBonus": 8
    },
    {
      "msId": "zaku1Sniper",
      "weaponId": "beamSniperRifle",
      "accuracyBonus": 10
    },
    {
      "msTag": "groundGundam",
      "weaponId": "groundGundamBeamRifle",
      "accuracyBonus": 8
    },
    {
      "msTag": "gmCommand",
      "weaponId": "bullpupMachineGun",
      "accuracyBonus": 7
    },
    {
      "msId": "actZaku",
      "weaponId": "actZakuBeamRifle",
      "accuracyBonus": 9
    },
    {
      "msId": "gassha",
      "weaponId": "specialHammerGun",
      "accuracyBonus": 10
    }
  ]
};
