"use strict";

// Campaign, starting collection, stages, global random rewards, and faction labels.
window.GAME_DATA = window.GAME_DATA ?? {};
window.GAME_DATA.campaign = {
  "title": "一年戦争カードタクティクス",
  "initialFaction": "federation",
  "initialCollection": {
    "mobileSuits": {
      "gm": 2,
      "zaku1": 1,
      "zaku2": 1
    },
    "battleships": [
      "gunperry",
      "papua"
    ],
    "weapons": {
      "beamSprayGun": 1,
      "federationMachineGun100mm": 1,
      "zakuMachineGun": 2
    },
    "characters": [
      "matilda",
      "jackBayard",
      "adamStingray",
      "dren",
      "cucuruzDoan",
      "gadem"
    ],
    "options": {
      "spareMagazine": 1
    },
    "clearedStages": []
  },
  "commonDropRewards": {
    "rolls": 3,
    "copyLimit": 4,
    "categoryWeights": {
      "mobileSuits": 45,
      "characters": 25,
      "weapons": 15,
      "options": 10,
      "battleships": 5
    },
    "ownershipBias": {
      "newCard": 3,
      "ownedFew": 1.5,
      "ownedMany": 0.5
    }
  },
  "choiceRewards": {
    "firstClearTickets": 1,
    "repeatClearChance": 0.12,
    "repeatClearTickets": 1
  },
  "starterFormations": {
    "federation": {
      "battleshipId": "gunperry",
      "captainId": "matilda",
      "firstOfficerId": "",
      "units": [
        {
          "msId": "gm",
          "characterIds": [
            "jackBayard"
          ],
          "weaponIds": [
            "beamSprayGun"
          ],
          "optionIds": []
        },
        {
          "msId": "gm",
          "characterIds": [
            "adamStingray"
          ],
          "weaponIds": [
            "federationMachineGun100mm"
          ],
          "optionIds": []
        }
      ]
    },
    "zeon": {
      "battleshipId": "papua",
      "captainId": "dren",
      "firstOfficerId": "",
      "units": [
        {
          "msId": "zaku2",
          "characterIds": [
            "cucuruzDoan"
          ],
          "weaponIds": [
            "zakuMachineGun"
          ],
          "optionIds": []
        },
        {
          "msId": "zaku1",
          "characterIds": [
            "gadem"
          ],
          "weaponIds": [
            "zakuMachineGun"
          ],
          "optionIds": [
            "spareMagazine"
          ]
        }
      ]
    }
  },
  "stages": [
    {
      "mapId": "gundamRisesColony",
      "enemyFaction": "zeon",
      "enemyBattleshipId": null,
      "summary": "サイド7のコロニー出入口から侵入した、デニム、ジーン、スレンダーのザクII小隊を迎撃する導入ステージ。岩場と緑地を越え、基地施設を守ります。",
      "enemyFormations": {
        "zeon": [
          {
            "msId": "zaku2",
            "characterIds": [
              "denim"
            ],
            "weaponIds": [
              "zakuMachineGun"
            ],
            "optionIds": []
          },
          {
            "msId": "zaku2",
            "characterIds": [
              "gene"
            ],
            "weaponIds": [
              "zakuMachineGun"
            ],
            "optionIds": []
          },
          {
            "msId": "zaku2",
            "characterIds": [
              "slender"
            ],
            "weaponIds": [
              "zakuMachineGun"
            ],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "battleOfLoum",
      "enemyFaction": "federation",
      "enemyBattleshipId": "salamis",
      "enemyCaptainId": "federationOfficer",
      "enemyFirstOfficerId": "",
      "summary": "モビルスーツ配備前の連邦宇宙艦隊と交戦する、ジオン側の導入ステージ。開けた宙域でサラミスとセイバーフィッシュ隊を撃破します。",
      "enemyFormations": {
        "federation": [
          {
            "msId": "saberfish",
            "characterIds": [
              "texanDimitry"
            ],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "saberfish",
            "characterIds": [
              "federationVeteran"
            ],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "saberfish",
            "characterIds": [
              "federationSoldier"
            ],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "garmaFalls",
      "enemyFaction": "zeon",
      "enemyBattleshipId": "gaw",
      "enemyCaptainId": "garma",
      "enemyFirstOfficerId": "",
      "summary": "荒廃した無人都市で、ガルマ率いるガウ攻撃空母隊とシャアのザク隊を迎え撃つ地上ステージ。C字型のドーム廃施設を盾に戦います。",
      "enemyFormations": {
        "zeon": [
          {
            "msId": "charZaku2S",
            "characterIds": [
              "char"
            ],
            "weaponIds": [
              "zakuMachineGun"
            ],
            "optionIds": []
          },
          {
            "msId": "zaku2",
            "characterIds": [
              "zeonSoldier"
            ],
            "weaponIds": [
              "zakuMachineGun"
            ],
            "optionIds": []
          },
          {
            "msId": "dopp",
            "characterIds": [
              "zeonSoldier"
            ],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "dopp",
            "characterIds": [
              "zeonSoldier"
            ],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "vs07thPlatoon",
      "enemyFaction": "federation",
      "enemyBattleshipId": null,
      "summary": "森と低い丘陵が入り組む前線地帯で、第07小隊の陸戦型ジム隊と交戦します。両軍側の平地に簡易拠点があり、中央の森林をどう抜けるかが焦点です。",
      "enemyFormations": {
        "federation": [
          {
            "msId": "groundGm",
            "characterIds": [
              "rob07"
            ],
            "weaponIds": [
              "federationMachineGun100mm",
              "smallShield"
            ],
            "optionIds": []
          },
          {
            "msId": "groundGm",
            "characterIds": [
              "mike07"
            ],
            "weaponIds": [
              "federationMachineGun100mm",
              "smallShield"
            ],
            "optionIds": []
          },
          {
            "msId": "groundGm",
            "characterIds": [
              "sally07"
            ],
            "weaponIds": [
              "rocketLauncher"
            ],
            "optionIds": []
          },
          {
            "msId": "hoverTruck",
            "characterIds": [
              "federationSoldier"
            ],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "frontline",
      "enemyFaction": "zeon",
      "enemyBattleshipId": null,
      "turnLimit": 8,
      "summary": "周囲をジャングルに囲まれた平地で、時間稼ぎを狙うマゼラ・アタック隊を追撃する08小隊向けの低難易度ステージ。岩と古い遺跡の石柱が射線を切ります。",
      "enemyFormations": {
        "zeon": [
          {
            "msId": "magellaAttack",
            "characterIds": [
              "boneAbust"
            ],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "magellaAttack",
            "characterIds": [
              "barry08"
            ],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "magellaAttack",
            "characterIds": [
              "runen08"
            ],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "rambaRalAssault",
      "enemyFaction": "zeon",
      "enemyBattleshipId": "gallop",
      "enemyCaptainId": "hamon",
      "enemyFirstOfficerId": "",
      "summary": "一面の砂漠地帯で、ハモンのギャロップを旗艦にランバ・ラル隊が特攻を仕掛けます。岩場で射線を切りながら、グフとザクII隊の接近を迎え撃ちます。",
      "enemyFormations": {
        "zeon": [
          {
            "msId": "gouf",
            "characterIds": [
              "ramba"
            ],
            "weaponIds": [
              "goufShield"
            ],
            "optionIds": []
          },
          {
            "msId": "zaku2",
            "characterIds": [
              "clamp"
            ],
            "weaponIds": [
              "zakuMachineGun"
            ],
            "optionIds": []
          },
          {
            "msId": "zaku2",
            "characterIds": [
              "cozunGraham"
            ],
            "weaponIds": [
              "cracker"
            ],
            "optionIds": []
          },
          {
            "msId": "zaku2",
            "characterIds": [
              "acous"
            ],
            "weaponIds": [
              "zakuMachineGun",
              "cracker"
            ],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "shudderingMountainPart1",
      "enemyFaction": "zeon",
      "enemyBattleshipId": null,
      "costCap": 900,
      "summary": "廃都市でノリス・パッカードのグフ・カスタムを迎え撃つ防衛ステージ。散開した3機の量産型ガンタンクを守りながら、単機で突入してくるエースを止めます。",
      "defenseTargets": [
        {
          "name": "量産型ガンタンクA",
          "x": 1,
          "y": 4,
          "armor": 100,
          "mobility": 2
        },
        {
          "name": "量産型ガンタンクB",
          "x": 6,
          "y": 5,
          "armor": 100,
          "mobility": 2
        },
        {
          "name": "量産型ガンタンクC",
          "x": 3,
          "y": 6,
          "armor": 100,
          "mobility": 2
        }
      ],
      "enemyFormations": {
        "zeon": [
          {
            "msId": "goufCustom",
            "characterIds": [
              "norrisPackard"
            ],
            "weaponIds": [
              "gatlingShield"
            ],
            "optionIds": []
          }
        ]
      }
    }
  ]
};
window.GAME_DATA.factions = {
  "federation": "連邦",
  "zeon": "ジオン"
};
