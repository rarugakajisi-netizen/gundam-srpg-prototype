"use strict";

// Character/MS and MS/weapon compatibility bonuses.
window.GAME_DATA = window.GAME_DATA ?? {};
window.GAME_DATA.compatibility = {
  "characterMs": [
    {
      "characterId": "amuro",
      "msTag": "gundam",
      "evasionBonus": 10
    },
    {
      "characterId": "amuro",
      "msTag": "vProject",
      "evasionBonus": 8
    },
    {
      "characterId": "amuroAwakened",
      "msTag": "gundam",
      "evasionBonus": 10
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
      "evasionBonus": 10
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
      "characterId": "anavelGato",
      "msTag": "gelgoog",
      "evasionBonus": 8
    },
    {
      "characterId": "anavelGato",
      "msId": "gelgoogGato",
      "evasionBonus": 8
    },
    {
      "characterId": "anavelGato",
      "msId": "rickDomGato",
      "evasionBonus": 7
    },
    {
      "characterId": "anavelGato",
      "msTag": "highMobilityZaku",
      "evasionBonus": 6
    },
    {
      "characterId": "cimaGarahau",
      "msTag": "gelgoog",
      "evasionBonus": 7
    },
    {
      "characterId": "cimaGarahau",
      "msTag": "commanderCustom",
      "evasionBonus": 5
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
      "evasionBonus": 10
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
      "evasionBonus": 10
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
      "evasionBonus": 10
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
      "evasionBonus": 10
    },
    {
      "characterId": "johnnyRidden",
      "msId": "johnnyHighMobilityZaku",
      "evasionBonus": 10
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
      "evasionBonus": 10
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
      "msTag": "tank",
      "evasionBonus": 8
    },
    {
      "characterId": "johnnyRidden",
      "msId": "johnnyHighMobilityGelgoog",
      "evasionBonus": 10
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
      "characterId": "terrySandersJr",
      "msId": "earlyGm",
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
      "characterId": "ainaSahalin",
      "msId": "zakuHighMobilityTestType",
      "evasionBonus": 8
    },
    {
      "characterId": "ghiniusSahalin",
      "msTag": "apsaras",
      "evasionBonus": 7
    },
    {
      "characterId": "norrisPackard",
      "msTag": "gouf",
      "evasionBonus": 10
    },
    {
      "characterId": "uragan",
      "msId": "gyan",
      "evasionBonus": 7
    },
    {
      "characterId": "masad",
      "msId": "battleHelicopter08",
      "evasionBonus": 8
    },
    {
      "characterId": "barry08",
      "msTag": "tank",
      "evasionBonus": 6
    },
    {
      "characterId": "runen08",
      "msTag": "tank",
      "evasionBonus": 6
    },
    {
      "characterId": "lydoWolf",
      "msId": "massProductionGuncannonLydo",
      "evasionBonus": 10
    },
    {
      "characterId": "lydoWolf",
      "msId": "gmSniper2Lydo",
      "evasionBonus": 10
    },
    {
      "characterId": "christinaMackenzie",
      "msTag": "alex",
      "evasionBonus": 8
    },
    {
      "characterId": "bernardWiseman",
      "msId": "zaku2Kai",
      "evasionBonus": 10
    },
    {
      "characterId": "hardieSteiner",
      "msId": "zgokE",
      "evasionBonus": 9
    },
    {
      "characterId": "hardieSteiner",
      "msId": "hyGogg",
      "evasionBonus": 9
    },
    {
      "characterId": "mikhailKaminsky",
      "msId": "hyGogg",
      "evasionBonus": 9
    },
    {
      "characterId": "mikhailKaminsky",
      "msTag": "kampfer",
      "evasionBonus": 10
    },
    {
      "characterId": "gabrielRamirezGarcia",
      "msId": "hyGogg",
      "evasionBonus": 8
    },
    {
      "characterId": "andyStrauss",
      "msId": "hyGogg",
      "evasionBonus": 7
    },
    {
      "characterId": "fordRomfellow",
      "msId": "gundamUnit5",
      "evasionBonus": 10
    },
    {
      "characterId": "fordRomfellow",
      "msId": "gundamUnit5Bst",
      "evasionBonus": 10
    },
    {
      "characterId": "luceKassel",
      "msId": "gundamUnit4",
      "evasionBonus": 10
    },
    {
      "characterId": "luceKassel",
      "msId": "gundamUnit4Bst",
      "evasionBonus": 10
    },
    {
      "characterId": "borkCry",
      "msId": "gundamPixy",
      "evasionBonus": 10
    },
    {
      "characterId": "travisKirkland",
      "msId": "slaveWraith",
      "evasionBonus": 10
    },
    {
      "characterId": "travisKirkland",
      "msTag": "groundGm",
      "evasionBonus": 7
    },
    {
      "characterId": "fredReber",
      "msId": "gundamPixy",
      "evasionBonus": 10
    },
    {
      "characterId": "fredReber",
      "msTag": "groundGm",
      "evasionBonus": 7
    },
    {
      "characterId": "marvinHerriot",
      "msId": "guncannonHeavyTypeDSlaveWraith",
      "evasionBonus": 8
    },
    {
      "characterId": "marvinHerriot",
      "msTag": "groundGm",
      "evasionBonus": 7
    },
    {
      "characterId": "edwardLee",
      "msId": "groundGmSlaveWraith",
      "evasionBonus": 6
    },
    {
      "characterId": "edwardLee",
      "msTag": "groundGm",
      "evasionBonus": 7
    },
    {
      "characterId": "dorisBrandt",
      "msTag": "groundGm",
      "evasionBonus": 7
    },
    {
      "characterId": "chloeCroce",
      "msTag": "paleRider",
      "evasionBonus": 10
    },
    {
      "characterId": "vincentGleissner",
      "msId": "highMobilityGelgoog",
      "evasionBonus": 10
    },
    {
      "characterId": "vincentGleissner",
      "msId": "highMobilityZaku",
      "evasionBonus": 9
    },
    {
      "characterId": "vincentGleissner",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "dougSchneid",
      "msId": "efreetSchneid",
      "evasionBonus": 10
    },
    {
      "characterId": "dougSchneid",
      "msTag": "efreet",
      "evasionBonus": 8
    },
    {
      "characterId": "liberioLincke",
      "msId": "zaku2Kai",
      "evasionBonus": 10
    },
    {
      "characterId": "liberioLincke",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "guyHelmuth",
      "msId": "domGrossBeil",
      "evasionBonus": 10
    },
    {
      "characterId": "guyHelmuth",
      "msId": "rickDom2",
      "evasionBonus": 8
    },
    {
      "characterId": "guyHelmuth",
      "msTag": "dom",
      "evasionBonus": 6
    },
    {
      "characterId": "severoOswald",
      "msId": "zaku2S",
      "evasionBonus": 8
    },
    {
      "characterId": "severoOswald",
      "msId": "zaku2",
      "evasionBonus": 6
    },
    {
      "characterId": "anneroseRosenheim",
      "msId": "psycommuZakuTest",
      "evasionBonus": 10
    },
    {
      "characterId": "anneroseRosenheim",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "albertBell",
      "msId": "zaku2",
      "evasionBonus": 7
    },
    {
      "characterId": "albertBell",
      "msTag": "zaku",
      "evasionBonus": 5
    },
    {
      "characterId": "huguesCourand",
      "msTag": "gmCommand",
      "evasionBonus": 10
    },
    {
      "characterId": "huguesCourand",
      "msTag": "groundGundam",
      "evasionBonus": 8
    },
    {
      "characterId": "huguesCourand",
      "msTag": "gm",
      "evasionBonus": 6
    },
    {
      "characterId": "hughCarter",
      "msTag": "gmCommand",
      "evasionBonus": 8
    },
    {
      "characterId": "hughCarter",
      "msTag": "gm",
      "evasionBonus": 5
    },
    {
      "characterId": "erikBlanke",
      "msTag": "gelgoog",
      "evasionBonus": 9
    },
    {
      "characterId": "erikBlanke",
      "msTag": "zaku",
      "evasionBonus": 7
    },
    {
      "characterId": "erikBlanke",
      "msTag": "dom",
      "evasionBonus": 7
    },
    {
      "characterId": "airosBarde",
      "msTag": "gelgoog",
      "evasionBonus": 7
    },
    {
      "characterId": "airosBarde",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "fritzBauer",
      "msTag": "dom",
      "evasionBonus": 6
    },
    {
      "characterId": "fritzBauer",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "christoDoerr",
      "msTag": "efreet",
      "evasionBonus": 7
    },
    {
      "characterId": "christoDoerr",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "tatianaDoerr",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "tatianaDoerr",
      "msTag": "gelgoog",
      "evasionBonus": 6
    },
    {
      "characterId": "elliottRem",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "elliottRem",
      "msTag": "highMobilityMs",
      "evasionBonus": 7
    },
    {
      "characterId": "malletSanguine",
      "msId": "actZaku",
      "evasionBonus": 10
    },
    {
      "characterId": "malletSanguine",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "yuimanCarlile",
      "msId": "actZaku",
      "evasionBonus": 8
    },
    {
      "characterId": "liliaFlobert",
      "msId": "actZaku",
      "evasionBonus": 8
    },
    {
      "characterId": "gusterPiper",
      "msId": "actZaku",
      "evasionBonus": 7
    },
    {
      "characterId": "mayKerwin",
      "msTag": "zaku",
      "evasionBonus": 5
    },
    {
      "characterId": "henryBoone",
      "msId": "efreet",
      "evasionBonus": 10
    },
    {
      "characterId": "rayHamilton",
      "msId": "zaku2",
      "evasionBonus": 7
    },
    {
      "characterId": "lesterCarrot",
      "msId": "zaku2",
      "evasionBonus": 7
    },
    {
      "characterId": "sakiGraham",
      "msId": "zaku2",
      "evasionBonus": 7
    },
    {
      "characterId": "martinHagar",
      "msId": "zaku2",
      "evasionBonus": 6
    },
    {
      "characterId": "youKajima",
      "msTag": "blueDestiny",
      "evasionBonus": 10
    },
    {
      "characterId": "youKajima",
      "msTag": "examMs",
      "evasionBonus": 8
    },
    {
      "characterId": "youKajima",
      "msTag": "gmCommand",
      "evasionBonus": 8
    },
    {
      "characterId": "youKajima",
      "msTag": "gmDominance",
      "evasionBonus": 8
    },
    {
      "characterId": "philipHughes",
      "msTag": "gm",
      "evasionBonus": 5
    },
    {
      "characterId": "philipHughes",
      "msTag": "gmCommand",
      "evasionBonus": 7
    },
    {
      "characterId": "philipHughes",
      "msTag": "gmDominance",
      "evasionBonus": 7
    },
    {
      "characterId": "samanaFulis",
      "msTag": "gm",
      "evasionBonus": 4
    },
    {
      "characterId": "samanaFulis",
      "msTag": "gmCommand",
      "evasionBonus": 6
    },
    {
      "characterId": "samanaFulis",
      "msTag": "gmDominance",
      "evasionBonus": 6
    },
    {
      "characterId": "frederickBrown",
      "msTag": "zaku",
      "evasionBonus": 5
    },
    {
      "characterId": "frederickBrown",
      "msTag": "dom",
      "evasionBonus": 5
    },
    {
      "characterId": "frederickBrown",
      "msTag": "gelgoog",
      "evasionBonus": 5
    },
    {
      "characterId": "nimbusSchterzen",
      "msId": "efreetCustom",
      "evasionBonus": 10
    },
    {
      "characterId": "nimbusSchterzen",
      "msId": "blueDestiny2",
      "evasionBonus": 10
    },
    {
      "characterId": "marionWelch",
      "msTag": "examMs",
      "evasionBonus": 10
    },
    {
      "characterId": "ephaGaldrial",
      "msId": "qatal",
      "evasionBonus": 10
    },
    {
      "characterId": "ephaGaldrial",
      "msId": "dolmel",
      "evasionBonus": 8
    },
    {
      "characterId": "masterPRayer",
      "msTag": "whiteDingo",
      "evasionBonus": 10
    },
    {
      "characterId": "maximilianBerger",
      "msTag": "whiteDingo",
      "evasionBonus": 9
    },
    {
      "characterId": "leungLeeFei",
      "msTag": "whiteDingo",
      "evasionBonus": 9
    },
    {
      "characterId": "anitaJulian",
      "msTag": "whiteDingo",
      "evasionBonus": 4
    },
    {
      "characterId": "bobRock",
      "msTag": "whiteDingo",
      "evasionBonus": 4
    },
    {
      "characterId": "stanleyHawkins",
      "msTag": "whiteDingo",
      "evasionBonus": 5
    },
    {
      "characterId": "vischDonahue",
      "msTag": "groundGelgoog",
      "evasionBonus": 10
    },
    {
      "characterId": "vischDonahue",
      "msTag": "gouf",
      "evasionBonus": 10
    },
    {
      "characterId": "vischDonahue",
      "msTag": "gelgoog",
      "evasionBonus": 10
    },
    {
      "characterId": "vischDonahue",
      "msTag": "zaku",
      "evasionBonus": 8
    },
    {
      "characterId": "vischDonahue",
      "msTag": "dom",
      "evasionBonus": 8
    },
    {
      "characterId": "vischDonahue",
      "msTag": "efreet",
      "evasionBonus": 8
    },
    {
      "characterId": "vischDonahue",
      "msTag": "desertMs",
      "evasionBonus": 7
    },
    {
      "characterId": "vischDonahue",
      "msTag": "groundMa",
      "evasionBonus": 6
    },
    {
      "characterId": "tinaDuvall",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "tinaDuvall",
      "msTag": "gouf",
      "evasionBonus": 6
    },
    {
      "characterId": "nearlight",
      "msTag": "dom",
      "evasionBonus": 8
    },
    {
      "characterId": "nearlight",
      "msTag": "desertMs",
      "evasionBonus": 5
    },
    {
      "characterId": "southBurningOyw",
      "msTag": "immortal4th",
      "evasionBonus": 10
    },
    {
      "characterId": "southBurningOyw",
      "msId": "gmCommandSpace",
      "evasionBonus": 10
    },
    {
      "characterId": "southBurningOyw",
      "msTag": "gmKai",
      "evasionBonus": 9
    },
    {
      "characterId": "alphaABateOyw",
      "msTag": "immortal4th",
      "evasionBonus": 9
    },
    {
      "characterId": "alphaABateOyw",
      "msId": "gmCommandSpace",
      "evasionBonus": 10
    },
    {
      "characterId": "alphaABateOyw",
      "msTag": "gmKai",
      "evasionBonus": 7
    },
    {
      "characterId": "bernardMonshaOyw",
      "msTag": "immortal4th",
      "evasionBonus": 8
    },
    {
      "characterId": "bernardMonshaOyw",
      "msId": "gmCommandSpace",
      "evasionBonus": 10
    },
    {
      "characterId": "bernardMonshaOyw",
      "msTag": "gmKai",
      "evasionBonus": 7
    },
    {
      "characterId": "chapAdelOyw",
      "msTag": "immortal4th",
      "evasionBonus": 8
    },
    {
      "characterId": "chapAdelOyw",
      "msId": "gmCommandSpace",
      "evasionBonus": 9
    },
    {
      "characterId": "chapAdelOyw",
      "msTag": "cannonMs",
      "evasionBonus": 7
    },
    {
      "characterId": "gerhartSchmitzer",
      "msId": "zaku1Gerhart",
      "evasionBonus": 10
    },
    {
      "characterId": "gerhartSchmitzer",
      "msTag": "zaku1",
      "evasionBonus": 10
    },
    {
      "characterId": "gerhartSchmitzer",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "leRoar",
      "msTag": "zaku",
      "evasionBonus": 7
    },
    {
      "characterId": "leRoar",
      "msTag": "gouf",
      "evasionBonus": 8
    },
    {
      "characterId": "matAustin",
      "msTag": "zaku1",
      "evasionBonus": 10
    },
    {
      "characterId": "matAustin",
      "msTag": "zaku",
      "evasionBonus": 8
    },
    {
      "characterId": "charlotteHepner",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "nickiRobert",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "nickiRobert",
      "msTag": "dom",
      "evasionBonus": 5
    },
    {
      "characterId": "leighSvagr",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "leighSvagr",
      "msTag": "zaku1",
      "evasionBonus": 6
    },
    {
      "characterId": "leighSvagr",
      "msTag": "dom",
      "evasionBonus": 7
    },
    {
      "characterId": "renceh",
      "msTag": "gouf",
      "evasionBonus": 10
    },
    {
      "characterId": "renceh",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "manning",
      "msTag": "zaku1",
      "evasionBonus": 8
    },
    {
      "characterId": "manning",
      "msTag": "gouf",
      "evasionBonus": 8
    },
    {
      "characterId": "sophieFranc",
      "msTag": "dom",
      "evasionBonus": 10
    },
    {
      "characterId": "sophieFranc",
      "msTag": "domFunf",
      "evasionBonus": 8
    },
    {
      "characterId": "sandra",
      "msTag": "zaku",
      "evasionBonus": 6
    },
    {
      "characterId": "sandra",
      "msTag": "domTropen",
      "evasionBonus": 10
    },
    {
      "characterId": "sandra",
      "msTag": "dom",
      "evasionBonus": 7
    },
    {
      "characterId": "eiger",
      "msId": "gundamMudrock",
      "evasionBonus": 10
    },
    {
      "characterId": "eiger",
      "msTag": "cannonMs",
      "evasionBonus": 8
    },
    {
      "characterId": "eiger",
      "msId": "type61Tank",
      "evasionBonus": 8
    },
    {
      "characterId": "sakaki",
      "msId": "type61Tank",
      "evasionBonus": 10
    },
    {
      "characterId": "sakaki",
      "msTag": "tank",
      "evasionBonus": 6
    },
    {
      "characterId": "matHeley",
      "msTag": "groundGundam",
      "evasionBonus": 10
    },
    {
      "characterId": "matHeley",
      "msTag": "gm",
      "evasionBonus": 7
    },
    {
      "characterId": "larryRadley",
      "msTag": "gm",
      "evasionBonus": 8
    },
    {
      "characterId": "larryRadley",
      "msTag": "federationAircraft",
      "evasionBonus": 6
    },
    {
      "characterId": "anishRofman",
      "msTag": "gm",
      "evasionBonus": 6
    },
    {
      "characterId": "tokushima",
      "msTag": "gm",
      "evasionBonus": 5
    },
    {
      "characterId": "kenBederstadt",
      "msTag": "zaku",
      "evasionBonus": 8
    },
    {
      "characterId": "kenBederstadt",
      "msTag": "dom",
      "evasionBonus": 7
    },
    {
      "characterId": "garskyZinobiev",
      "msTag": "zaku",
      "evasionBonus": 7
    },
    {
      "characterId": "garskyZinobiev",
      "msTag": "dom",
      "evasionBonus": 6
    },
    {
      "characterId": "jakeGuns",
      "msTag": "dom",
      "evasionBonus": 6
    },
    {
      "characterId": "janeContie",
      "msTag": "aquatic",
      "evasionBonus": 6
    },
    {
      "characterId": "claudeGhoul",
      "msTag": "psycommu",
      "evasionBonus": 6
    },
    {
      "characterId": "claudiaGhoul",
      "msTag": "psycommu",
      "evasionBonus": 5
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
      "msId": "hildolfrTankMode",
      "weaponId": "hildolfr30cmApfsds",
      "accuracyBonus": 6
    },
    {
      "msId": "hildolfrTankMode",
      "weaponId": "hildolfr30cmIncendiary",
      "accuracyBonus": 7
    },
    {
      "msId": "hildolfrMobileMode",
      "weaponId": "hildolfrShovelArm",
      "accuracyBonus": 7
    },
    {
      "msId": "hildolfrMobileMode",
      "weaponId": "hildolfrMachineGun105mm",
      "accuracyBonus": 6
    },
    {
      "msTag": "gm",
      "weaponId": "beamSprayGun",
      "accuracyBonus": 7
    },
    {
      "msTag": "gLine",
      "weaponId": "shortBeamRifleGLine",
      "accuracyBonus": 8
    },
    {
      "msTag": "gLine",
      "weaponId": "heavyRifleGLine",
      "accuracyBonus": 8
    },
    {
      "msTag": "gLine",
      "weaponId": "beamSaber",
      "accuracyBonus": 6
    },
    {
      "msTag": "gLine",
      "weaponId": "headVulcan",
      "accuracyBonus": 5
    },
    {
      "msId": "gLineStandardArmor",
      "weaponId": "gLineGatlingSmasher",
      "accuracyBonus": 8
    },
    {
      "msId": "gLineLightArmor",
      "weaponId": "gLineMissilePod",
      "accuracyBonus": 7
    },
    {
      "msId": "gLineAssaultArmor",
      "weaponId": "gLineSingleAssaultCannon",
      "accuracyBonus": 7
    },
    {
      "msId": "gLineAssaultArmor",
      "weaponId": "gLineHeatLance",
      "accuracyBonus": 8
    },
    {
      "msTag": "gm",
      "weaponId": "gmCannonCannon",
      "accuracyBonus": 7
    },
    {
      "msTag": "gm",
      "weaponId": "hyperBazooka",
      "accuracyBonus": 5
    },
    {
      "msTag": "gm",
      "weaponId": "beamGun",
      "accuracyBonus": 6
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
      "weaponId": "hyperBazooka",
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
      "weaponId": "cannon180mm",
      "accuracyBonus": 8
    },
    {
      "msTag": "cannonMs",
      "weaponId": "railCannon",
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
      "msId": "gelgoogCannon",
      "weaponId": "magellaTopCannon",
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
    },
    {
      "msId": "gigan",
      "weaponId": "magellaTopCannon",
      "accuracyBonus": 8
    },
    {
      "msId": "earlyGm",
      "weaponId": "bullpupMachineGun",
      "accuracyBonus": 7
    },
    {
      "msId": "zakuHighMobilityTestType",
      "weaponId": "zakuMachineGun",
      "accuracyBonus": 7
    },
    {
      "msId": "gunnerGundam",
      "weaponId": "gunnerGundamBeamRifle",
      "accuracyBonus": 10
    },
    {
      "msTag": "alex",
      "weaponId": "alexBeamRifle",
      "accuracyBonus": 8
    },
    {
      "msTag": "alex",
      "weaponId": "alexShield",
      "accuracyBonus": 5
    },
    {
      "msId": "gmColdClimate",
      "weaponId": "coldClimateMachineGun",
      "accuracyBonus": 8
    },
    {
      "msId": "zaku2Kai",
      "weaponId": "mmp80MachineGun",
      "accuracyBonus": 8
    },
    {
      "msId": "rickDom2",
      "weaponId": "mmp80MachineGun",
      "accuracyBonus": 6
    },
    {
      "msId": "rickDom2",
      "weaponId": "giantBazooka2",
      "accuracyBonus": 8
    },
    {
      "msId": "gelgoogJ",
      "weaponId": "beamMachineGun",
      "accuracyBonus": 10
    },
    {
      "msTag": "kampfer",
      "weaponId": "shotgun",
      "accuracyBonus": 10
    },
    {
      "msTag": "kampfer",
      "weaponId": "giantBazooka2",
      "accuracyBonus": 8
    },
    {
      "msTag": "kampfer",
      "weaponId": "chainMine",
      "accuracyBonus": 8
    },
    {
      "msTag": "unit4",
      "weaponId": "handBeamGun",
      "accuracyBonus": 6
    },
    {
      "msTag": "unit4",
      "weaponId": "hyperBeamRifle",
      "accuracyBonus": 8
    },
    {
      "msTag": "unit4",
      "weaponId": "megaBeamLauncher",
      "accuracyBonus": 10
    },
    {
      "msTag": "unit5",
      "weaponId": "handBeamGun",
      "accuracyBonus": 6
    },
    {
      "msTag": "unit5",
      "weaponId": "hyperBeamRifle",
      "accuracyBonus": 8
    },
    {
      "msTag": "unit5",
      "weaponId": "giantGatling",
      "accuracyBonus": 10
    },
    {
      "msId": "gundamPixy",
      "weaponId": "beamDagger",
      "accuracyBonus": 10
    },
    {
      "msId": "gundamPixy",
      "weaponId": "submachineGun90mm",
      "accuracyBonus": 8
    },
    {
      "msId": "efreet",
      "weaponId": "efreetHeatSaber",
      "accuracyBonus": 8
    },
    {
      "msId": "efreet",
      "weaponId": "shotgun",
      "accuracyBonus": 10
    },
    {
      "msId": "efreetNacht",
      "weaponId": "coldBladeNacht",
      "accuracyBonus": 10
    },
    {
      "msId": "efreetNacht",
      "weaponId": "coldKunaiNacht",
      "accuracyBonus": 8
    },
    {
      "msId": "efreetNacht",
      "weaponId": "efreetHeatSaber",
      "accuracyBonus": 8
    },
    {
      "msId": "efreetNacht",
      "weaponId": "shotgun",
      "accuracyBonus": 10
    },
    {
      "msId": "efreetNacht",
      "weaponId": "tripleGatlingGun",
      "accuracyBonus": 8
    },
    {
      "msId": "efreetNacht",
      "weaponId": "mmp80MachineGun",
      "accuracyBonus": 8
    },
    {
      "msId": "gmScout",
      "weaponId": "wiredHelicopterMissile",
      "accuracyBonus": 8
    },
    {
      "msId": "gmScout",
      "weaponId": "heatKnife",
      "accuracyBonus": 6
    },
    {
      "msId": "gmSpartan",
      "weaponId": "heatKnife",
      "accuracyBonus": 10
    },
    {
      "msId": "groundGmNightStalker",
      "weaponId": "cannon180mm",
      "accuracyBonus": 8
    },
    {
      "msId": "gundamEz8Hac",
      "weaponId": "salamisCannon",
      "accuracyBonus": 6
    },
    {
      "msId": "gmDominance",
      "weaponId": "prototypeTwinBeamRifle",
      "accuracyBonus": 8
    },
    {
      "msId": "gmDominance",
      "weaponId": "beamSaberUnit",
      "accuracyBonus": 8
    },
    {
      "msId": "goufHunter",
      "weaponId": "throwingHeatKnife",
      "accuracyBonus": 8
    },
    {
      "msId": "zaku1Sniper",
      "weaponId": "zeonSniperRifle",
      "accuracyBonus": 8
    },
    {
      "msTag": "zaku",
      "weaponId": "zeonHandgun",
      "accuracyBonus": 5
    },
    {
      "msId": "blueDestiny1",
      "weaponId": "bdChestMissile",
      "accuracyBonus": 8
    },
    {
      "msId": "blueDestiny3",
      "weaponId": "bdChestMissile",
      "accuracyBonus": 8
    },
    {
      "msId": "blueDestiny2",
      "weaponId": "bdChestMissile",
      "accuracyBonus": 8
    },
    {
      "msTag": "blueDestiny",
      "weaponId": "beamSaber",
      "accuracyBonus": 8
    },
    {
      "msTag": "gtFour",
      "weaponId": "gtFourBeamCannon",
      "accuracyBonus": 8
    },
    {
      "msId": "zephyrGundam",
      "weaponId": "beamSaber",
      "accuracyBonus": 8
    },
    {
      "msId": "zephyrGundam",
      "weaponId": "fixedShield",
      "accuracyBonus": 6
    },
    {
      "msId": "gyanEos",
      "weaponId": "beamBayonet",
      "accuracyBonus": 10
    },
    {
      "msId": "dolmel",
      "weaponId": "dolmelArmBeamSaber",
      "accuracyBonus": 8
    },
    {
      "msId": "dolmel",
      "weaponId": "heatPile",
      "accuracyBonus": 8
    },
    {
      "msId": "qatal",
      "weaponId": "qatalBit",
      "accuracyBonus": 10
    },
    {
      "msId": "goufVijanta",
      "weaponId": "removalMace",
      "accuracyBonus": 8
    },
    {
      "msId": "goufTacticalAssault",
      "weaponId": "goufGatling120mm",
      "accuracyBonus": 8
    },
    {
      "msId": "efreetCustom",
      "weaponId": "efreetHeatSaber",
      "accuracyBonus": 10
    },
    {
      "msId": "efreetCustom",
      "weaponId": "efreetLegMissilePod",
      "accuracyBonus": 8
    },
    {
      "msTag": "groundGelgoog",
      "weaponId": "giantBazooka",
      "accuracyBonus": 8
    },
    {
      "msTag": "groundGelgoog",
      "weaponId": "gelgoogArmGrenadeLauncher",
      "accuracyBonus": 8
    },
    {
      "msId": "desertGelgoog",
      "weaponId": "armedBuster",
      "accuracyBonus": 8
    },
    {
      "msId": "gelgoogG",
      "weaponId": "desertGelgoogBeamRifle",
      "accuracyBonus": 10
    },
    {
      "msId": "desertGelgoog",
      "weaponId": "desertGelgoogBeamRifle",
      "accuracyBonus": 10
    },
    {
      "msId": "rhinoSaras",
      "weaponId": "rhinoSarasMachineGun",
      "accuracyBonus": 6
    },
    {
      "msId": "rhinoSaras",
      "weaponId": "rhinoSarasMissilePod",
      "accuracyBonus": 6
    },
    {
      "msId": "rhinoSaras",
      "weaponId": "rhinoSarasCannon",
      "accuracyBonus": 6
    },
    {
      "msId": "zaku1Gerhart",
      "weaponId": "heatHawk",
      "accuracyBonus": 8
    },
    {
      "msId": "domFunf",
      "weaponId": "giantBazooka",
      "accuracyBonus": 8
    },
    {
      "msId": "domFunf",
      "weaponId": "heatSaber",
      "accuracyBonus": 8
    },
    {
      "msId": "domBeinNichts",
      "weaponId": "raketenBazooka",
      "accuracyBonus": 10
    },
    {
      "msId": "domBeinNichts",
      "weaponId": "sturmFaust",
      "accuracyBonus": 8
    },
    {
      "msId": "domBeinNichts",
      "weaponId": "heatSaber",
      "accuracyBonus": 8
    },
    {
      "msId": "domGrossBeil",
      "weaponId": "largeHeatSaber",
      "accuracyBonus": 10
    },
    {
      "msId": "domGrossBeil",
      "weaponId": "heatKnife",
      "accuracyBonus": 8
    },
    {
      "msId": "domTropen",
      "weaponId": "raketenBazooka",
      "accuracyBonus": 10
    },
    {
      "msId": "domTropen",
      "weaponId": "mmp80MachineGun",
      "accuracyBonus": 8
    },
    {
      "msId": "domTropen",
      "weaponId": "sturmFaust",
      "accuracyBonus": 8
    },
    {
      "msId": "domTropen",
      "weaponId": "heatSaber",
      "accuracyBonus": 8
    },
    {
      "msId": "domTropen",
      "weaponId": "zakuBazooka",
      "accuracyBonus": 6
    },
    {
      "msId": "armoredGm",
      "weaponId": "beamSprayGun",
      "accuracyBonus": 7
    },
    {
      "msId": "armoredGm",
      "weaponId": "hyperBazooka",
      "accuracyBonus": 6
    },
    {
      "msId": "gundamMudrock",
      "weaponId": "mudrock300mmCannon",
      "accuracyBonus": 8
    },
    {
      "msId": "gundamMudrock",
      "weaponId": "beamRifle",
      "accuracyBonus": 6
    },
    {
      "msId": "gundamUnit7",
      "weaponId": "beamSaber",
      "accuracyBonus": 8
    },
    {
      "msId": "gundamUnit7",
      "weaponId": "headVulcan",
      "accuracyBonus": 5
    },
    {
      "msId": "fullArmorGundamUnit7",
      "weaponId": "unit7BackLongRangeBeamCannon",
      "accuracyBonus": 8
    },
    {
      "msId": "fullArmorGundamUnit7",
      "weaponId": "unit7MissilePod",
      "accuracyBonus": 6
    },
    {
      "msId": "fullArmorGundamUnit7",
      "weaponId": "unit7TwinBeamSprayGun",
      "accuracyBonus": 8
    },
    {
      "msId": "fullArmorGundamUnit7",
      "weaponId": "beamSaber",
      "accuracyBonus": 6
    },
    {
      "msId": "heavyFullArmorGundamUnit7",
      "weaponId": "hfa7MegaBeamCannon",
      "accuracyBonus": 8
    },
    {
      "msId": "heavyFullArmorGundamUnit7",
      "weaponId": "hfa7LargeMissileContainer",
      "accuracyBonus": 6
    },
    {
      "msId": "heavyFullArmorGundamUnit7",
      "weaponId": "hfa7WaistBeamCannon",
      "accuracyBonus": 8
    },
    {
      "msId": "heavyFullArmorGundamUnit7",
      "weaponId": "beamSaber",
      "accuracyBonus": 4
    }
  ]
};
