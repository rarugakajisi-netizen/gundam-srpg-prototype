"use strict";

// Campaign, starting collection, stages, global random rewards, and faction labels.
window.GAME_DATA = window.GAME_DATA ?? {};
window.GAME_DATA.campaign = {
  "title": "一年戦争カードタクティクス",
  "stageSeries": {
    "main": { "label": "本編", "order": 10 },
    "08th": { "label": "08小隊", "order": 20 },
    "warInPocket": { "label": "ポケットの中の戦争", "order": 30 },
    "msIgloo": { "label": "MS IGLOO", "order": 40 },
    "blueDestiny": { "label": "THE BLUE DESTINY", "order": 50 },
    "fallenColony": { "label": "コロニーの落ちた地で...", "order": 60 },
    "other": { "label": "その他", "order": 90 }
  },
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
      "series": "main",
      "order": 10,
      "tags": [
        "導入",
        "コロニー",
        "サイド7"
      ],
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
      "mapId": "vsWhiteBase1",
      "series": "main",
      "order": 15,
      "tags": [
        "本編",
        "ジオン視点",
        "コロニー",
        "サイド7",
        "ホワイトベース隊"
      ],
      "enemyFaction": "federation",
      "enemyBattleshipId": "whiteBase",
      "enemyCaptainId": "bright",
      "enemyFirstOfficerId": "sayla",
      "summary": "サイド7から発進するホワイトベース隊を、ジオン側から迎え撃ちます。「ガンダム大地に立つ」のコロニーを上下反転し、基地側に布陣した連邦の新鋭部隊へ侵攻するステージです。",
      "enemyFormations": {
        "federation": [
          {
            "msId": "gundam",
            "characterIds": ["amuro"],
            "weaponIds": ["beamRifle", "shield"],
            "optionIds": []
          },
          {
            "msId": "guncannon",
            "characterIds": ["kai"],
            "weaponIds": ["guncannonBeamRifle"],
            "optionIds": []
          },
          {
            "msId": "guntank",
            "characterIds": ["hayato"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "coreFighter",
            "characterIds": ["ryu"],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "battleOfLoum",
      "series": "main",
      "order": 5,
      "tags": [
        "本編",
        "宇宙",
        "艦隊戦",
        "ジオン視点",
        "ルウム"
      ],
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
      "mapId": "greatSerpentVanishesAtLoum",
      "series": "msIgloo",
      "order": 410,
      "tags": [
        "MS IGLOO",
        "ジオン視点",
        "宇宙",
        "艦隊戦",
        "ルウム",
        "第603技術試験隊"
      ],
      "enemyFaction": "federation",
      "enemyBattleshipId": "magellan",
      "enemyEscortBattleshipIds": ["salamis"],
      "enemyCaptainId": "federationOfficer",
      "enemyFirstOfficerId": "",
      "summary": "ルウム宙域で、マゼランとサラミスを中核とする連邦艦隊をジオン側から迎撃します。既存のルウム戦場に、増強されたセイバーフィッシュ隊が展開します。",
      "enemyFormations": {
        "federation": [
          {
            "msId": "saberfish",
            "characterIds": ["texanDimitry"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "saberfish",
            "characterIds": ["federationVeteran"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "saberfish",
            "characterIds": ["federationVeteran"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "saberfish",
            "characterIds": ["federationSoldier"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "saberfish",
            "characterIds": ["federationSoldier"],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "howlStainedInTheSettingSun",
      "series": "msIgloo",
      "order": 420,
      "tags": [
        "MS IGLOO",
        "ジオン視点",
        "地上",
        "砂漠",
        "防衛",
        "セモベンテ隊",
        "鹵獲機"
      ],
      "enemyFaction": "federation",
      "enemyBattleshipId": null,
      "summary": "夕暮れのアリゾナ砂漠で、行動不能となったコムサイを連邦軍セモベンテ隊から守ります。61式戦車と鹵獲ザクIIの混成部隊を迎撃する防衛戦です。",
      "defenseTargets": [
        {
          "name": "行動不能のコムサイ",
          "x": 3,
          "y": 7,
          "armor": 360,
          "mobility": 0
        }
      ],
      "enemyFormations": {
        "federation": [
          {
            "msId": "zaku2",
            "characterIds": ["federicoCzariano"],
            "weaponIds": ["zakuMachineGun"],
            "optionIds": [],
            "factionOverride": "federation"
          },
          {
            "msId": "zaku2",
            "characterIds": ["federationSoldier"],
            "weaponIds": ["zakuMachineGun"],
            "optionIds": [],
            "factionOverride": "federation"
          },
          {
            "msId": "zaku2",
            "characterIds": ["federationSoldier"],
            "weaponIds": ["zakuMachineGun"],
            "optionIds": [],
            "factionOverride": "federation"
          },
          {
            "msId": "zaku2",
            "characterIds": ["federationSoldier"],
            "weaponIds": ["zakuMachineGun"],
            "optionIds": [],
            "factionOverride": "federation"
          },
          {
            "msId": "type61Tank",
            "characterIds": ["federationSoldier"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "type61Tank",
            "characterIds": ["federationSoldier"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "type61Tank",
            "characterIds": ["federationSoldier"],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "kingOfTheLandForward",
      "series": "msIgloo",
      "order": 421,
      "tags": [
        "MS IGLOO",
        "ジオン視点",
        "地上",
        "荒野",
        "低難度",
        "ホワイトオーガー"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": null,
      "costCap": 1200,
      "summary": "乾いた荒野で、エルマー・スネルのホワイトオーガーを中心とするジオン地上部隊を全滅させます。ザクII 2機とマゼラ・アタック3両が随伴する、比較的低難度の地上戦です。",
      "enemyFormations": {
        "zeon": [
          { "msId": "zaku2WhiteOgre", "characterIds": ["elmerSnell"], "weaponIds": ["zakuBazooka"], "optionIds": [] },
          { "msId": "zaku2", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuMachineGun"], "optionIds": [] },
          { "msId": "zaku2", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuMachineGun"], "optionIds": [] },
          { "msId": "magellaAttack", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "magellaAttack", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "magellaAttack", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [], "disableCoreSystem": true }
        ]
      }
    },
    {
      "mapId": "odessaIronStorm",
      "series": "msIgloo",
      "order": 422,
      "tags": [
        "MS IGLOO",
        "ジオン視点",
        "地上",
        "オデッサ",
        "荒野",
        "崖",
        "大規模戦"
      ],
      "enemyFaction": "federation",
      "enemyBattleshipId": "bigTray",
      "enemyCaptainId": "federationOfficer",
      "enemyFirstOfficerId": "",
      "costCap": 3200,
      "summary": "崖が戦線を分断するオデッサの荒野で、ビッグ・トレーを旗艦とする連邦軍を迎撃します。アリーヌ、ドロバ、ミロスの陸戦強襲型ガンタンク3両に、陸戦型ジムと61式戦車隊が随伴する大規模地上戦です。",
      "enemyFormations": {
        "federation": [
          { "msId": "assaultGuntankNormal", "characterIds": ["alineNazon"], "weaponIds": [], "optionIds": [] },
          { "msId": "assaultGuntankNormal", "characterIds": ["drobaKuzwayo"], "weaponIds": [], "optionIds": [] },
          { "msId": "assaultGuntankNormal", "characterIds": ["milosKarppi"], "weaponIds": [], "optionIds": [] },
          { "msId": "groundGm", "characterIds": ["federationSoldier"], "weaponIds": ["federationMachineGun100mm", "smallShield"], "optionIds": [] },
          { "msId": "groundGm", "characterIds": ["federationSoldier"], "weaponIds": ["federationMachineGun100mm", "smallShield"], "optionIds": [] },
          { "msId": "groundGm", "characterIds": ["federationSoldier"], "weaponIds": ["rocketLauncher"], "optionIds": [] },
          { "msId": "type61Tank", "characterIds": ["federationSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "type61Tank", "characterIds": ["federationSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "type61Tank", "characterIds": ["federationSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "type61Tank", "characterIds": ["federationSoldier"], "weaponIds": [], "optionIds": [] }
        ]
      }
    },
    {
      "mapId": "phantomRacesInOrbit",
      "series": "msIgloo",
      "order": 430,
      "tags": [
        "MS IGLOO",
        "ジオン視点",
        "宇宙",
        "地球直上",
        "防衛",
        "増援",
        "HLV"
      ],
      "enemyFaction": "federation",
      "enemyBattleshipId": null,
      "costCap": 1500,
      "enemyReinforcements": {
        "startTurn": 3,
        "endTurn": 3,
        "countPerTurn": 3,
        "entries": [
          {
            "msId": "earlyGm",
            "characterIds": ["federationSoldier"],
            "weaponIds": ["beamSprayGun"],
            "optionIds": []
          }
        ],
        "battleships": [
          {
            "battleshipId": "salamis",
            "characterIds": ["federationOfficer"]
          }
        ]
      },
      "summary": "地球直上の宙間で、地表から打ち上げられたHLV船団を護衛します。初期のシャークマウス隊を退けた後、第3ターンにサラミスと初期型ジム隊が増援として出現します。HLVが全滅すると敗北です。",
      "defenseTargets": [
        { "name": "HLV 1", "x": 0, "y": 5, "armor": 260, "mobility": 0 },
        { "name": "HLV 2", "x": 2, "y": 6, "armor": 260, "mobility": 0 },
        { "name": "HLV 3", "x": 4, "y": 5, "armor": 260, "mobility": 0 },
        { "name": "HLV 4", "x": 6, "y": 6, "armor": 260, "mobility": 0 },
        { "name": "HLV 5", "x": 7, "y": 4, "armor": 260, "mobility": 0 }
      ],
      "enemyFormations": {
        "federation": [
          {
            "msId": "ballSharkMouth",
            "characterIds": ["federationSoldier"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "ballSharkMouth",
            "characterIds": ["federationSoldier"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "ballSharkMouth",
            "characterIds": ["federationSoldier"],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "sawTheOceanAboveJaburo",
      "series": "msIgloo",
      "order": 440,
      "tags": [
        "MS IGLOO",
        "ジオン視点",
        "空中",
        "大気圏",
        "ジャブロー",
        "打ち上げ阻止",
        "破壊目標",
        "ターン制限"
      ],
      "enemyFaction": "federation",
      "enemyBattleshipId": null,
      "costCap": 1600,
      "turnLimit": 8,
      "summary": "ジャブロー上空の大気圏で、宇宙へ打ち上げられる連邦艦艇を追撃します。コア・ブースターとTINコッドの迎撃をかわし、8ターン以内に低耐久のマゼラン1隻・サラミス2隻をすべて破壊してください。",
      "destructionTargets": [
        { "name": "マゼラン（打ち上げ中）", "x": 4, "y": 3, "armor": 260, "mobility": 0, "faction": "federation" },
        { "name": "サラミス1（打ち上げ中）", "x": 1, "y": 2, "armor": 210, "mobility": 0, "faction": "federation" },
        { "name": "サラミス2（打ち上げ中）", "x": 6, "y": 2, "armor": 210, "mobility": 0, "faction": "federation" }
      ],
      "enemyFormations": {
        "federation": [
          { "msId": "coreBooster", "characterIds": ["federationVeteran"], "weaponIds": [], "optionIds": [] },
          { "msId": "coreBooster", "characterIds": ["federationSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "tinCod", "characterIds": ["federationSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "tinCod", "characterIds": ["federationSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "tinCod", "characterIds": ["federationSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "tinCod", "characterIds": ["federationSoldier"], "weaponIds": [], "optionIds": [] }
        ]
      }
    },
    {
      "mapId": "soulsReturnToThunder",
      "series": "msIgloo",
      "order": 450,
      "tags": [
        "MS IGLOO",
        "ジオン視点",
        "宇宙",
        "ア・バオア・クー",
        "大規模戦",
        "艦隊戦",
        "ユーグ・クーロ"
      ],
      "enemyFaction": "federation",
      "enemyBattleshipId": "magellan",
      "enemyEscortBattleshipIds": ["salamis", "salamis"],
      "enemyCaptainId": "federationOfficer",
      "enemyFirstOfficerId": "",
      "costCap": 3900,
      "summary": "ア・バオア・クー外縁のデブリ宙域で、マゼランと2隻のサラミスを中核とする連邦軍大部隊を迎撃します。ボールとジムの物量に加え、ユーグのジム・コマンドと虎の子のガンキャノンが戦線を押し上げます。",
      "enemyFormations": {
        "federation": [
          { "msId": "ball", "characterIds": ["federationSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "ball", "characterIds": ["federationSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "ball", "characterIds": ["federationSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "ball", "characterIds": ["federationSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "gm", "characterIds": ["federationSoldier"], "weaponIds": ["beamSprayGun", "shield"], "optionIds": [] },
          { "msId": "gm", "characterIds": ["federationSoldier"], "weaponIds": ["beamSprayGun", "shield"], "optionIds": [] },
          { "msId": "gm", "characterIds": ["federationSoldier"], "weaponIds": ["beamSprayGun", "shield"], "optionIds": [] },
          { "msId": "gm", "characterIds": ["federationSoldier"], "weaponIds": ["hyperBazooka", "shield"], "optionIds": [] },
          { "msId": "gm", "characterIds": ["federationVeteran"], "weaponIds": ["hyperBazooka", "shield"], "optionIds": [] },
          { "msId": "gmCommandSpace", "characterIds": ["huguesCourand"], "weaponIds": ["beamGun", "gmCommandShield"], "optionIds": [] },
          { "msId": "gmCommandSpace", "characterIds": ["federationVeteran"], "weaponIds": ["beamGun", "gmCommandShield"], "optionIds": [] },
          { "msId": "guncannon", "characterIds": ["federationVeteran"], "weaponIds": ["guncannonBeamRifle"], "optionIds": [] }
        ]
      }
    },
    {
      "mapId": "vs603TechnicalTestUnit",
      "series": "msIgloo",
      "order": 460,
      "tags": [
        "MS IGLOO",
        "連邦視点",
        "宇宙",
        "ア・バオア・クー",
        "ボス",
        "第603技術試験隊",
        "オッゴ",
        "ヅダ",
        "カスペン",
        "ゲルググ"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": "jotunheim",
      "enemyCaptainId": "martinProchnow",
      "enemyFirstOfficerId": "",
      "costCap": 2300,
      "summary": "ア・バオア・クー外縁で、第603技術試験隊と交戦します。マルティンのヨーツンヘイムを中心に、マイのビグ・ラング、モニクとワシヤのヅダ、カスペン専用ゲルググ、少数のオッゴ隊が補給支援を受けながら迎撃します。",
      "enemyFormations": {
        "zeon": [
          { "msId": "bigLang", "characterIds": ["oliverMay"], "weaponIds": [], "optionIds": [] },
          { "msId": "zudahCommander", "characterIds": ["moniqueCadillac"], "weaponIds": ["zakuMachineGun"], "optionIds": [] },
          { "msId": "zudah", "characterIds": ["hidetoWashiya"], "weaponIds": ["antiShipRifle"], "optionIds": [] },
          { "msId": "gelgoogKaspen", "characterIds": ["herbertVonKaspen"], "weaponIds": ["zeonBeamRifle", "gelgoogShield"], "optionIds": [] },
          { "msId": "oggo", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuMachineGun"], "optionIds": [] },
          { "msId": "oggo", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuMachineGun"], "optionIds": [] },
          { "msId": "oggo", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuBazooka"], "optionIds": [] }
        ]
      }
    },
    {
      "mapId": "blueTremor",
      "series": "blueDestiny",
      "order": 510,
      "tags": [
        "THE BLUE DESTINY",
        "連邦視点",
        "地上",
        "ジオン基地",
        "増援",
        "EXAM",
        "ブルーディスティニー1号機"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": null,
      "costCap": 1450,
      "enemyReinforcements": {
        "trigger": "enemyWipedOut",
        "count": 1,
        "entries": [
          {
            "msId": "blueDestiny1",
            "faction": "federation",
            "characterIds": ["federationSoldier"],
            "weaponIds": ["federationMachineGun100mm", "smallShield"],
            "optionIds": [],
            "examAlwaysActive": true
          }
        ]
      },
      "summary": "地上のジオン基地を攻撃し、ザクII 2機とマゼラ・アタックを撃破します。初期部隊を全滅させると、無名兵が搭乗する暴走中のブルーディスティニー1号機が敵として出現。EXAMは常時発動し、ターン経過でも解除されません。",
      "enemyFormations": {
        "zeon": [
          { "msId": "zaku2", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuMachineGun"], "optionIds": [] },
          { "msId": "zaku2", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuBazooka"], "optionIds": [] },
          { "msId": "magellaAttack", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [] }
        ]
      }
    },
    {
      "mapId": "fatefulShowdown",
      "series": "blueDestiny",
      "order": 520,
      "tags": [
        "THE BLUE DESTINY",
        "連邦視点",
        "地上",
        "キャリフォルニア基地",
        "基地戦",
        "ニムバス",
        "イフリート改",
        "EXAM"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": "dabude",
      "enemyCaptainId": "zeonOfficer",
      "enemyFirstOfficerId": "",
      "costCap": 2050,
      "summary": "ジオン軍キャリフォルニア基地へ進攻し、ダブデを中核とする守備隊と交戦します。ザクII、グフ、ドムの防衛線を突破し、腕部3連装ミサイル・ランチャーを装備したニムバスのイフリート改との宿命の対決に挑みます。",
      "enemyFormations": {
        "zeon": [
          { "msId": "efreetCustom", "characterIds": ["nimbusSchterzen"], "weaponIds": ["armTripleMissileLauncher"], "optionIds": [] },
          { "msId": "zaku2", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuMachineGun"], "optionIds": [] },
          { "msId": "gouf", "characterIds": ["zeonVeteran"], "weaponIds": [], "optionIds": [] },
          { "msId": "dom", "characterIds": ["zeonSoldier"], "weaponIds": ["giantBazooka"], "optionIds": [] }
        ]
      }
    },
    {
      "mapId": "theJudged",
      "series": "blueDestiny",
      "order": 530,
      "tags": [
        "THE BLUE DESTINY",
        "連邦視点",
        "宇宙",
        "コロニー外部",
        "艦隊戦",
        "ニムバス",
        "ブルーディスティニー2号機",
        "EXAM"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": "musai",
      "enemyCaptainId": "zeonOfficer",
      "enemyFirstOfficerId": "",
      "costCap": 2700,
      "summary": "コロニー外部の宙域で、ムサイ級を中核とするジオン部隊と決戦します。ザクIIと大型シールド装備のゲルググ隊を突破し、強化型ビーム・ライフルを構えたニムバスのブルーディスティニー2号機を撃破します。",
      "enemyFormations": {
        "zeon": [
          { "msId": "blueDestiny2", "characterIds": ["nimbusSchterzen"], "weaponIds": ["enhancedZeonBeamRifle", "gelgoogShield"], "optionIds": [] },
          { "msId": "zaku2", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuBazooka"], "optionIds": [] },
          { "msId": "zaku2", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuMachineGun"], "optionIds": [] },
          { "msId": "gelgoog", "characterIds": ["zeonVeteran"], "weaponIds": ["zeonBeamRifle", "gelgoogShield"], "optionIds": [] },
          { "msId": "gelgoog", "characterIds": ["zeonSoldier"], "weaponIds": ["zeonBeamRifle", "gelgoogShield"], "optionIds": [] }
        ]
      }
    },
    {
      "mapId": "vsGuineaPigTeam1",
      "series": "blueDestiny",
      "order": 540,
      "tags": [
        "THE BLUE DESTINY",
        "ジオン視点",
        "地上",
        "基地戦",
        "モルモット隊",
        "ブルーディスティニー1号機",
        "ジム・コマンド"
      ],
      "enemyFaction": "federation",
      "enemyBattleshipId": "medea",
      "enemyCaptainId": "federationOfficer",
      "enemyFirstOfficerId": "maureenKitamura",
      "costCap": 1900,
      "summary": "地上基地で、ミデアを母艦とするモルモット隊をジオン側から迎え撃ちます。ユウのブルーディスティニー1号機を前衛に、フィリップとサマナのジム・コマンド地上戦仕様が異なる射撃装備で連携します。",
      "enemyFormations": {
        "federation": [
          { "msId": "blueDestiny1", "characterIds": ["youKajima"], "weaponIds": ["federationMachineGun100mm", "smallShield"], "optionIds": [] },
          { "msId": "gmCommandGround", "characterIds": ["philipHughes"], "weaponIds": ["beamGun", "gmCommandShield"], "optionIds": [] },
          { "msId": "gmCommandGround", "characterIds": ["samanaFulis"], "weaponIds": ["hyperBazooka", "gmCommandShield"], "optionIds": [] }
        ]
      }
    },
    {
      "mapId": "vsGuineaPigTeam2",
      "series": "blueDestiny",
      "order": 550,
      "tags": [
        "THE BLUE DESTINY",
        "ジオン視点",
        "宇宙",
        "デブリ帯",
        "モルモット隊",
        "ブルーディスティニー3号機",
        "ジム・ドミナンス",
        "ジム・コマンド"
      ],
      "enemyFaction": "federation",
      "enemyBattleshipId": "magellan",
      "enemyCaptainId": "federationOfficer",
      "enemyFirstOfficerId": "maureenKitamura",
      "costCap": 2250,
      "summary": "デブリの漂う宇宙空間で、マゼランを旗艦とするモルモット隊と決戦します。ユウのブルーディスティニー3号機、フィリップのジム・ドミナンス、長距離射撃に対応したサマナのジム・コマンド宇宙戦仕様が連携します。",
      "enemyFormations": {
        "federation": [
          { "msId": "blueDestiny3", "characterIds": ["youKajima"], "weaponIds": ["groundGundamBeamRifle", "gmCommandShield"], "optionIds": [] },
          { "msId": "gmDominance", "characterIds": ["philipHughes"], "weaponIds": ["hyperBazooka", "gmCommandShield"], "optionIds": [] },
          { "msId": "gmCommandSpace", "characterIds": ["samanaFulis"], "weaponIds": ["beamGun", "gmCommandShield"], "optionIds": ["longRangeScope"] }
        ]
      }
    },
    {
      "mapId": "dogsOfWar",
      "series": "fallenColony",
      "order": 610,
      "tags": [
        "コロニーの落ちた地で...",
        "連邦視点",
        "地上",
        "オーストラリア",
        "アリススプリングス",
        "荒野",
        "市街戦",
        "ヴィッシュ・ドナヒュー"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": null,
      "summary": "オーストラリア中央部の荒野を越え、アリススプリングス市街を守るジオン部隊へ侵攻します。少数のザクIIとドップを率いるのは、『荒野の迅雷』ヴィッシュ・ドナヒューのグフです。",
      "enemyFormations": {
        "zeon": [
          { "msId": "gouf", "characterIds": ["vischDonahue"], "weaponIds": ["goufShield"], "optionIds": [] },
          { "msId": "zaku2", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuMachineGun"], "optionIds": [] },
          { "msId": "zaku2", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuMachineGun"], "optionIds": [] },
          { "msId": "dopp", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "dopp", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [] }
        ]
      }
    },
    {
      "mapId": "astaroth",
      "series": "fallenColony",
      "order": 620,
      "tags": [
        "コロニーの落ちた地で...",
        "連邦視点",
        "地上",
        "渓谷",
        "崖",
        "防衛",
        "ミデア",
        "ギャロップ"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": "gallop",
      "enemyCaptainId": "zeonOfficer",
      "enemyFirstOfficerId": "",
      "summary": "崖の狭間を縫う進軍路で、墜落して行動不能となったミデアをジオン部隊から守ります。ギャロップの砲撃と、ザクII、マゼラ・アタック、グフの接近を食い止める防衛戦です。",
      "defenseTargets": [
        {
          "name": "行動不能のミデア",
          "x": 5,
          "y": 8,
          "armor": 600,
          "mobility": 0
        }
      ],
      "enemyFormations": {
        "zeon": [
          { "msId": "gouf", "characterIds": ["zeonVeteran"], "weaponIds": [], "optionIds": [] },
          { "msId": "zaku2", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuBazooka"], "optionIds": [] },
          { "msId": "zaku2", "characterIds": ["zeonSoldier"], "weaponIds": ["cracker"], "optionIds": [] },
          { "msId": "magellaAttack", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "magellaAttack", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [] }
        ]
      }
    },
    {
      "mapId": "stairwayToTheMoon",
      "series": "fallenColony",
      "order": 630,
      "tags": [
        "コロニーの落ちた地で...",
        "連邦視点",
        "地上",
        "オーストラリア",
        "クイーンズランド",
        "ヒューエンデン",
        "要塞基地",
        "HLV",
        "アッザム・オルガ"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": "gaw",
      "enemyCaptainId": "zeonOfficer",
      "enemyFirstOfficerId": "",
      "summary": "生物兵器アスタロスの月面基地グラナダへの移送を阻止するため、HLV打ち上げ施設を有するクイーンズランド州ヒューエンデン要塞基地へ侵攻します。ガウ航空隊とアッザム・オルガ、グフを隊長機とする地上守備隊が待ち構えます。",
      "enemyFormations": {
        "zeon": [
          { "msId": "azzamOrga", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "dopp", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "dopp", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "dopp", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "gouf", "characterIds": ["zeonVeteran"], "weaponIds": [], "optionIds": [] },
          { "msId": "zaku2", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuBazooka"], "optionIds": [] },
          { "msId": "zakuCannon", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuMachineGun"], "optionIds": [] }
        ]
      }
    },
    {
      "mapId": "fallenColonyFinal",
      "series": "fallenColony",
      "order": 640,
      "tags": [
        "コロニーの落ちた地で...",
        "連邦視点",
        "地上",
        "ヒューエンデン",
        "要塞基地",
        "HLV",
        "破壊目標",
        "ターン制限",
        "ヴィッシュ・ドナヒュー",
        "陸戦型ゲルググ"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": null,
      "turnLimit": 12,
      "summary": "ヒューエンデン要塞基地へ再突入し、生物兵器アスタロスを積んでグラナダへ向かう打ち上げ前のHLV 3基を破壊します。12ターンの余裕を使い、ヴィッシュの陸戦型ゲルググと重装守備隊を突破してください。",
      "destructionTargets": [
        { "name": "HLV 1", "x": 2, "y": 1, "armor": 280, "mobility": 0, "faction": "zeon" },
        { "name": "HLV 2", "x": 5, "y": 1, "armor": 280, "mobility": 0, "faction": "zeon" },
        { "name": "HLV 3", "x": 8, "y": 1, "armor": 280, "mobility": 0, "faction": "zeon" }
      ],
      "enemyFormations": {
        "zeon": [
          { "msId": "gelgoogGround", "characterIds": ["vischDonahue"], "weaponIds": ["zeonBeamRifle", "spikeShield"], "optionIds": ["stopMovementOperation"] },
          { "msId": "rhinoSaras", "characterIds": ["zeonVeteran"], "weaponIds": [], "optionIds": [] },
          { "msId": "gouf", "characterIds": ["zeonVeteran"], "weaponIds": [], "optionIds": [] },
          { "msId": "zaku2", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuMachineGun"], "optionIds": [] },
          { "msId": "zakuCannon", "characterIds": ["zeonSoldier"], "weaponIds": ["zakuMachineGun"], "optionIds": [] }
        ]
      }
    },
    {
      "mapId": "vsWhiteDingoTeam1",
      "series": "fallenColony",
      "order": 650,
      "tags": [
        "コロニーの落ちた地で...",
        "ジオン視点",
        "地上",
        "オーストラリア",
        "荒野",
        "ホワイト・ディンゴ隊",
        "ジム",
        "敵艦なし"
      ],
      "enemyFaction": "federation",
      "enemyBattleshipId": null,
      "summary": "コロニー落としによって一面の荒野と化したオーストラリアで、ホワイト・ディンゴ隊をジオン側から迎え撃ちます。異なる装備で役割分担したジム隊と、アニタのホバー・トラックが連携します。",
      "enemyFormations": {
        "federation": [
          { "msId": "gmWhiteDingo", "characterIds": ["masterPRayer"], "weaponIds": ["prototypeBeamRifle", "shield"], "optionIds": ["externalGenerator"] },
          { "msId": "gmWhiteDingo", "characterIds": ["maximilianBerger"], "weaponIds": ["federationMachineGun100mm", "shield"], "optionIds": [] },
          { "msId": "gmCannonWhiteDingo", "characterIds": ["leungLeeFei"], "weaponIds": ["hyperBazooka"], "optionIds": [] },
          { "msId": "hoverTruck", "characterIds": ["anitaJulian"], "weaponIds": [], "optionIds": [] }
        ]
      }
    },
    {
      "mapId": "vsWhiteDingoTeam2",
      "series": "fallenColony",
      "order": 660,
      "tags": [
        "コロニーの落ちた地で...",
        "ジオン視点",
        "地上",
        "オーストラリア",
        "荒野",
        "ホワイト・ディンゴ隊",
        "ヘビィ・フォーク",
        "ジム・スナイパーII",
        "量産型ガンキャノン"
      ],
      "enemyFaction": "federation",
      "enemyBattleshipId": "heavyFork",
      "enemyCaptainId": "stanleyHawkins",
      "enemyFirstOfficerId": "bobRock",
      "summary": "荒廃したオーストラリアの広域戦場で、ヘビィ・フォークを母艦とするホワイト・ディンゴ隊と決戦します。長短二種のビーム・ライフルを使い分けるジム・スナイパーII隊と、二挺の100mmマシンガンを構えた量産型ガンキャノンが射線を重ねます。",
      "enemyFormations": {
        "federation": [
          { "msId": "gmSniper2WhiteDingo", "characterIds": ["masterPRayer"], "weaponIds": ["groundGundamBeamRifle", "smallShield"], "optionIds": [] },
          { "msId": "massProductionGuncannonWhiteDingo", "characterIds": ["maximilianBerger"], "weaponIds": ["federationMachineGun100mm", "federationMachineGun100mm"], "optionIds": [] },
          { "msId": "gmSniper2WhiteDingo", "characterIds": ["leungLeeFei"], "weaponIds": ["longRangeBeamRifle"], "optionIds": [] },
          { "msId": "hoverTruck", "characterIds": ["anitaJulian"], "weaponIds": [], "optionIds": [] }
        ]
      }
    },
    {
      "mapId": "garmaFalls",
      "series": "main",
      "order": 20,
      "tags": [
        "本編",
        "地上",
        "市街戦",
        "ガルマ"
      ],
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
      "series": "08th",
      "order": 110,
      "tags": [
        "08小隊",
        "地上",
        "森林",
        "第07小隊"
      ],
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
      "series": "08th",
      "order": 120,
      "tags": [
        "08小隊",
        "地上",
        "追撃",
        "短期決戦"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": null,
      "turnLimit": 8,
      "summary": "周囲をジャングルに囲まれた平地で、時間稼ぎを狙うマゼラ・アタック隊を追撃する08小隊向けステージ。岩と古い遺跡の石柱が射線を切ります。",
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
      "series": "main",
      "order": 30,
      "tags": [
        "本編",
        "地上",
        "砂漠",
        "ランバ・ラル隊"
      ],
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
      "mapId": "tripleDomAssault",
      "series": "main",
      "order": 35,
      "tags": [
        "本編",
        "地上",
        "荒野",
        "黒い三連星",
        "ドム",
        "ジェット・ストリーム・アタック"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": null,
      "summary": "開けた荒野で、黒い三連星のドム隊が高速連携攻撃を仕掛けます。少数のドップをかわしながら、ジャイアント・バズを構えた三機の隊列を崩して迎撃します。",
      "enemyFormations": {
        "zeon": [
          {
            "msId": "dom",
            "characterIds": ["gaia"],
            "weaponIds": ["giantBazooka"],
            "optionIds": []
          },
          {
            "msId": "dom",
            "characterIds": ["mash"],
            "weaponIds": ["giantBazooka"],
            "optionIds": []
          },
          {
            "msId": "dom",
            "characterIds": ["ortega"],
            "weaponIds": ["giantBazooka"],
            "optionIds": []
          },
          {
            "msId": "dopp",
            "characterIds": ["zeonSoldier"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "dopp",
            "characterIds": ["zeonSoldier"],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "shudderingMountainPart1",
      "series": "08th",
      "order": 130,
      "tags": [
        "08小隊",
        "地上",
        "防衛",
        "エース",
        "廃都市"
      ],
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
            "optionIds": [
              "optionBooster"
            ],
            "armorOverride": 450
          }
        ]
      }
    },
    {
      "mapId": "vs08thTeam",
      "series": "08th",
      "order": 135,
      "tags": [
        "08小隊",
        "ジオン視点",
        "地上",
        "森林",
        "荒野",
        "第08MS小隊"
      ],
      "enemyFaction": "federation",
      "enemyBattleshipId": "bigTray",
      "enemyCaptainId": "kojima08",
      "enemyFirstOfficerId": "",
      "summary": "森林と荒野が接する戦場で、コジマのビッグ・トレーを旗艦とする08小隊をジオン側から迎え撃ちます。森林を進む近接部隊と、荒野から狙う長距離砲撃への対応が求められます。",
      "enemyFormations": {
        "federation": [
          {
            "msId": "gundamEz8",
            "characterIds": ["shiroAmada"],
            "weaponIds": ["federationMachineGun100mm", "smallShield"],
            "optionIds": []
          },
          {
            "msId": "groundGundamGmHead",
            "characterIds": ["karenJoshua"],
            "weaponIds": ["groundGundamBeamRifle", "smallShield"],
            "optionIds": []
          },
          {
            "msId": "groundGundam",
            "characterIds": ["terrySandersJr"],
            "weaponIds": ["cannon180mm"],
            "optionIds": ["enhancedWarheadOption"]
          },
          {
            "msId": "hoverTruck",
            "characterIds": ["eledoreMassis"],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "shudderingMountainPart2",
      "series": "08th",
      "order": 140,
      "tags": [
        "08小隊",
        "地上",
        "ボス",
        "山岳基地",
        "アプサラス",
        "ギニアス"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": "kerguelen",
      "enemyCaptainId": "zeonOfficer",
      "enemyFirstOfficerId": "kerguelenGirl",
      "summary": "山岳基地の発着場で、ギニアスのアプサラスIIIと決戦します。ケルゲレンを背に、グフ・フライトタイプと戦闘ヘリ部隊が空から進軍を阻みます。",
      "enemyFormations": {
        "zeon": [
          {
            "msId": "apsaras3",
            "characterIds": ["ghiniusSahalin"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "goufFlightType",
            "characterIds": ["zeonSoldier"],
            "weaponIds": ["tripleGatlingGun"],
            "optionIds": []
          },
          {
            "msId": "goufFlightType",
            "characterIds": ["zeonSoldier"],
            "weaponIds": ["tripleGatlingGun"],
            "optionIds": []
          },
          {
            "msId": "battleHelicopter08",
            "characterIds": ["zeonSoldier"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "battleHelicopter08",
            "characterIds": ["zeonSoldier"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "battleHelicopter08",
            "characterIds": ["zeonSoldier"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "battleHelicopter08",
            "characterIds": ["zeonSoldier"],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "atlanticBloodstained",
      "series": "main",
      "order": 40,
      "tags": [
        "本編",
        "地上",
        "水中",
        "完全水没",
        "マッド・アングラー隊"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": "madAngler",
      "enemyCaptainId": "char",
      "enemyFirstOfficerId": "",
      "summary": "大西洋の海中で、シャアのマッド・アングラー隊がグラブロとズゴック隊を投入する完全水没ステージ。全域が水中のため、水中適性の有無が機動力と回避に大きく響きます。",
      "enemyFormations": {
        "zeon": [
          {
            "msId": "grabro",
            "characterIds": [
              "flanaganBoone"
            ],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "zgok",
            "characterIds": [
              "zeonAquaticSoldier"
            ],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "zgok",
            "characterIds": [
              "zeonAquaticSoldier"
            ],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "jaburoFalls",
      "series": "main",
      "order": 50,
      "tags": [
        "本編",
        "地上",
        "地下基地",
        "水路",
        "ジャブロー",
        "シャア"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": null,
      "summary": "大小の水路が走る地下洞窟基地ジャブローで、シャア率いる水陸両用モビルスーツ部隊を迎え撃ちます。水路を使う敵の機動と、岩壁や基地遺構で分断された射線に注意が必要です。",
      "enemyFormations": {
        "zeon": [
          {
            "msId": "charZgok",
            "characterIds": [
              "char"
            ],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "zock",
            "characterIds": [
              "boraskiniv"
            ],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "acguy",
            "characterIds": [
              "akahana"
            ],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "acguy",
            "characterIds": [
              "zeonAquaticSoldier"
            ],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "gogg",
            "characterIds": [
              "zeonAquaticSoldier"
            ],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "zanzibarPursuit",
      "series": "main",
      "order": 60,
      "tags": [
        "本編",
        "宇宙",
        "地球上宙域",
        "追撃戦",
        "シャア"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": "zanzibar",
      "enemyCaptainId": "char",
      "enemyFirstOfficerId": "",
      "summary": "地球上宙域へ離脱したシャアのザンジバルを追撃します。開けた宙域に残る少数の戦艦残骸を盾に、リック・ドム隊と高速のビグロを突破して敵艦を捕捉します。",
      "enemyFormations": {
        "zeon": [
          {
            "msId": "rickDom",
            "characterIds": [
              "zeonSoldier"
            ],
            "weaponIds": [
              "giantBazooka"
            ],
            "optionIds": []
          },
          {
            "msId": "rickDom",
            "characterIds": [
              "zeonSoldier"
            ],
            "weaponIds": [
              "giantBazooka"
            ],
            "optionIds": []
          },
          {
            "msId": "bigro",
            "characterIds": [
              "tokwan"
            ],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "battleOfSolomon",
      "series": "main",
      "order": 70,
      "tags": [
        "本編",
        "宇宙",
        "宇宙要塞",
        "ソロモン",
        "大規模戦",
        "ドズル"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": "dolos",
      "enemyCaptainId": "zeonOfficer",
      "enemyFirstOfficerId": "",
      "summary": "宇宙要塞ソロモン周辺で、ドロス級空母を中核とする守備隊を攻略します。要塞外縁の岩塊と艦艇残骸を抜け、ドズルのビグ・ザムとガトー率いるモビルスーツ隊を撃破します。",
      "enemyFormations": {
        "zeon": [
          {
            "msId": "bigZam",
            "characterIds": ["dozle"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "rickDomGato",
            "characterIds": ["anavelGato"],
            "weaponIds": ["beamBazooka"],
            "optionIds": []
          },
          {
            "msId": "rickDom",
            "characterIds": ["zeonSoldier"],
            "weaponIds": ["giantBazooka"],
            "optionIds": []
          },
          {
            "msId": "rickDom",
            "characterIds": ["zeonSoldier"],
            "weaponIds": ["giantBazooka"],
            "optionIds": []
          },
          {
            "msId": "zaku2",
            "characterIds": ["zeonSoldier"],
            "weaponIds": ["zakuBazooka"],
            "optionIds": []
          },
          {
            "msId": "zaku2",
            "characterIds": ["zeonSoldier"],
            "weaponIds": ["zakuMachineGun"],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "shiningSpace",
      "series": "main",
      "order": 80,
      "tags": [
        "本編",
        "宇宙",
        "ニュータイプ",
        "エース",
        "ララァ",
        "シャア"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": null,
      "summary": "静かな宇宙空間で、ララァのエルメスとシャア専用ゲルググに立ち向かいます。敵はわずか2機ながら、ビットによる長距離攻撃と高速のエース機が連携する決戦ステージです。",
      "enemyFormations": {
        "zeon": [
          {
            "msId": "elmeth",
            "characterIds": ["lalah"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "charGelgoog",
            "characterIds": ["char"],
            "weaponIds": [
              "zeonBeamRifle",
              "gelgoogShield"
            ],
            "optionIds": ["rivalryOption"]
          }
        ]
      }
    },
    {
      "mapId": "aBaoaQu",
      "series": "main",
      "order": 90,
      "tags": [
        "本編",
        "最終ステージ",
        "宇宙",
        "宇宙要塞",
        "ア・バオア・クー",
        "大規模戦"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": "dolos",
      "enemyCaptainId": "eguilleDelaz",
      "enemyFirstOfficerId": "",
      "summary": "一年戦争最後の戦場、宇宙要塞ア・バオア・クーを攻略します。デラーズのドロス級を中核に、シャアのジオング、ガトーとエリクのゲルググ、残存モビルスーツ隊が要塞外縁で待ち受けます。",
      "enemyFormations": {
        "zeon": [
          {
            "msId": "zeong",
            "characterIds": ["char"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "gelgoogGato",
            "characterIds": ["anavelGato"],
            "weaponIds": ["zeonBeamRifle", "gelgoogShield"],
            "optionIds": []
          },
          {
            "msId": "gelgoog",
            "characterIds": ["erikBlanke"],
            "weaponIds": ["zeonBeamRifle", "gelgoogShield"],
            "optionIds": []
          },
          {
            "msId": "rickDom",
            "characterIds": ["zeonSoldier"],
            "weaponIds": ["giantBazooka"],
            "optionIds": []
          },
          {
            "msId": "rickDom",
            "characterIds": ["zeonSoldier"],
            "weaponIds": ["giantBazooka"],
            "optionIds": []
          },
          {
            "msId": "rickDom",
            "characterIds": ["zeonSoldier"],
            "weaponIds": ["giantBazooka"],
            "optionIds": []
          },
          {
            "msId": "zaku2",
            "characterIds": ["zeonSoldier"],
            "weaponIds": ["zakuBazooka"],
            "optionIds": []
          },
          {
            "msId": "zaku2",
            "characterIds": ["zeonSoldier"],
            "weaponIds": ["zakuMachineGun"],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "vsWhiteBase2",
      "series": "main",
      "order": 100,
      "tags": [
        "本編",
        "ジオン視点",
        "宇宙",
        "ボス",
        "ホワイトベース隊",
        "デブリ帯"
      ],
      "enemyFaction": "federation",
      "enemyBattleshipId": "whiteBase",
      "enemyCaptainId": "bright",
      "enemyFirstOfficerId": "mirai",
      "summary": "一年戦争末期、デブリ帯を進むホワイトベース隊とジオン側から決戦します。マグネット・コーティングを施したガンダムを中心に、完成された連携で迫る連邦の精鋭部隊を撃破します。",
      "enemyFormations": {
        "federation": [
          {
            "msId": "gundamMc",
            "characterIds": ["amuroAwakened"],
            "weaponIds": ["hyperBazooka", "beamRifle"],
            "optionIds": []
          },
          {
            "msId": "guncannon",
            "characterIds": ["kai"],
            "weaponIds": ["guncannonBeamRifle"],
            "optionIds": []
          },
          {
            "msId": "guncannon",
            "characterIds": ["hayato"],
            "weaponIds": ["guncannonBeamRifle"],
            "optionIds": []
          },
          {
            "msId": "coreBooster",
            "characterIds": ["sayla"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "coreBooster",
            "characterIds": ["sleggar"],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "howManyMilesToTheBattlefield",
      "series": "warInPocket",
      "order": 310,
      "tags": [
        "ポケットの中の戦争",
        "地上",
        "北極基地",
        "水陸両用MS",
        "進入阻止",
        "サイクロプス隊"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": null,
      "infiltrationTargets": [
        { "x": 2, "y": 9 },
        { "x": 5, "y": 9 }
      ],
      "summary": "北極基地へ海上から奇襲を仕掛けるサイクロプス隊を迎撃します。敵機が基地最奥の侵入阻止地点へ到達すると敗北しますが、味方機で地点を塞いで持ちこたえることもできます。",
      "enemyFormations": {
        "zeon": [
          {
            "msId": "zgokE",
            "characterIds": ["hardieSteiner"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "hyGogg",
            "characterIds": ["mikhailKaminsky"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "hyGogg",
            "characterIds": ["andyStrauss"],
            "weaponIds": [],
            "optionIds": []
          },
          {
            "msId": "hyGogg",
            "characterIds": ["gabrielRamirezGarcia"],
            "weaponIds": [],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "acrossTheRiverAndThroughTheTrees",
      "series": "warInPocket",
      "order": 320,
      "tags": [
        "ポケットの中の戦争",
        "ジオン視点",
        "コロニー",
        "河川",
        "市街地",
        "スカーレット隊",
        "アレックス"
      ],
      "enemyFaction": "federation",
      "enemyBattleshipId": null,
      "summary": "コロニー内の木立を抜け、橋の架かった河川を渡って市街地へ進攻します。河岸を守るスカーレット隊を突破し、起動前のアレックスを撃破します。",
      "enemyFormations": {
        "federation": [
          {
            "msId": "alex",
            "characterIds": ["christinaMackenzie"],
            "weaponIds": [],
            "optionIds": [],
            "aiInactiveUntilTurn": 4
          },
          {
            "msId": "gmSniper2",
            "characterIds": ["federationSoldier"],
            "weaponIds": ["bullpupMachineGun", "gmCommandShield"],
            "optionIds": []
          },
          {
            "msId": "gmSniper2",
            "characterIds": ["federationSoldier"],
            "weaponIds": ["bullpupMachineGun", "gmCommandShield"],
            "optionIds": []
          },
          {
            "msId": "gmCommandGround",
            "characterIds": ["federationSoldier"],
            "weaponIds": ["bullpupMachineGun", "gmCommandShield"],
            "optionIds": []
          },
          {
            "msId": "gmCommandGround",
            "characterIds": ["federationSoldier"],
            "weaponIds": ["bullpupMachineGun", "gmCommandShield"],
            "optionIds": []
          },
          {
            "msId": "massProductionGuncannon",
            "characterIds": ["federationSoldier"],
            "weaponIds": ["bullpupMachineGun"],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "warInThePocketFinal",
      "series": "warInPocket",
      "order": 330,
      "tags": [
        "ポケットの中の戦争",
        "最終ステージ",
        "宇宙",
        "艦隊戦",
        "コロニー外宙域",
        "フォン・ヘルシング"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": "chibe",
      "enemyEscortBattleshipIds": ["musai"],
      "enemyCaptainId": "vonHellsing",
      "enemyFirstOfficerId": "",
      "summary": "コロニー外宙域へ接近するフォン・ヘルシングのチベと随伴ムサイを迎撃します。新鋭機で固められた護衛部隊を突破し、二隻の敵艦を撃破する最終艦隊戦です。",
      "enemyFormations": {
        "zeon": [
          {
            "msId": "zaku2Kai",
            "characterIds": ["zeonSoldier"],
            "weaponIds": ["zakuMachineGunGrenade"],
            "optionIds": []
          },
          {
            "msId": "zaku2Kai",
            "characterIds": ["zeonSoldier"],
            "weaponIds": ["zakuMachineGunGrenade"],
            "optionIds": []
          },
          {
            "msId": "rickDom2",
            "characterIds": ["zeonSoldier"],
            "weaponIds": ["giantBazooka2"],
            "optionIds": []
          },
          {
            "msId": "rickDom2",
            "characterIds": ["zeonSoldier"],
            "weaponIds": ["giantBazooka2"],
            "optionIds": []
          },
          {
            "msId": "gelgoogJ",
            "characterIds": ["zeonVeteran"],
            "weaponIds": ["beamMachineGun"],
            "optionIds": ["highOutputGeneratorOption"]
          }
        ]
      }
    },
    {
      "mapId": "ifJaburoAssault",
      "series": "other",
      "order": 920,
      "tags": [
        "その他",
        "IF",
        "高難度",
        "ジャブロー",
        "地上",
        "ジャングル",
        "大河",
        "水陸両用MS",
        "オールスター"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": "kerguelen",
      "enemyCaptainId": "ghiniusSahalin",
      "enemyFirstOfficerId": "kerguelenGirl",
      "costCap": 4300,
      "summary": "もしジオン軍が各方面の戦力を失わず、万全の状態でジャブロー地上へ総攻撃を行っていたら――。密林と大河を越え、ケルゲレン、アプサラスIII、歴戦のエース、水陸両用MS、ジャブロー攻略用試作機が一斉に押し寄せる高難度IFステージです。",
      "enemyFormations": {
        "zeon": [
          { "msId": "apsaras3", "characterIds": ["ainaSahalin"], "weaponIds": [], "optionIds": [] },
          { "msId": "goufCustom", "characterIds": ["norrisPackard"], "weaponIds": ["gatlingShield"], "optionIds": [] },
          { "msId": "zgok", "characterIds": ["char"], "weaponIds": [], "optionIds": [] },
          { "msId": "acguy", "characterIds": ["akahana"], "weaponIds": [], "optionIds": [] },
          { "msId": "zock", "characterIds": ["boraskiniv"], "weaponIds": [], "optionIds": [] },
          { "msId": "zogok", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "agg", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "agguguy", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [] },
          { "msId": "juaggu", "characterIds": ["zeonSoldier"], "weaponIds": [], "optionIds": [] }
        ]
      }
    },
    {
      "mapId": "acePilotZaku",
      "series": "other",
      "order": 910,
      "tags": [
        "その他",
        "オールスター",
        "コロニー",
        "エース",
        "専用機",
        "ザク"
      ],
      "enemyFaction": "zeon",
      "enemyBattleshipId": null,
      "summary": "地上用・宇宙用を問わず、専用ザクを駆るジオンのエースたちがコロニー内部に集結します。11機の専用機が一斉に迫る、ザク系オールスター戦です。",
      "enemyFormations": {
        "zeon": [
          {
            "msId": "charZaku2S",
            "characterIds": ["char"],
            "weaponIds": ["zakuMachineGun"],
            "optionIds": []
          },
          {
            "msId": "dozleZaku2",
            "characterIds": ["dozle"],
            "weaponIds": ["zakuBazooka"],
            "optionIds": []
          },
          {
            "msId": "rambaZaku1",
            "characterIds": ["ramba"],
            "weaponIds": ["zakuMachineGun"],
            "optionIds": []
          },
          {
            "msId": "garmaZaku2S",
            "characterIds": ["garma"],
            "weaponIds": ["zakuMachineGun"],
            "optionIds": []
          },
          {
            "msId": "johnnyHighMobilityZaku",
            "characterIds": ["johnnyRidden"],
            "weaponIds": ["zakuBazooka"],
            "optionIds": []
          },
          {
            "msId": "matsunagaHighMobilityZaku",
            "characterIds": ["shinMatsunaga"],
            "weaponIds": ["zakuBazooka"],
            "optionIds": []
          },
          {
            "msId": "zaku1Gerhart",
            "characterIds": ["gerhartSchmitzer"],
            "weaponIds": ["zakuMachineGun"],
            "optionIds": []
          },
          {
            "msId": "zaku2WhiteOgre",
            "characterIds": ["elmerSnell"],
            "weaponIds": ["zakuBazooka"],
            "optionIds": []
          },
          {
            "msId": "groundHighMobilityZakuAlma",
            "characterIds": ["almaStirner"],
            "weaponIds": ["zakuMachineGun"],
            "optionIds": []
          },
          {
            "msId": "groundHighMobilityZakuVincent",
            "characterIds": ["vincentGleissner"],
            "weaponIds": ["zakuBazooka"],
            "optionIds": []
          },
          {
            "msId": "zaku2FSolari",
            "characterIds": ["iriaSolari"],
            "weaponIds": ["zakuMachineGun"],
            "optionIds": []
          }
        ]
      }
    },
    {
      "mapId": "ballHell",
      "series": "other",
      "order": 900,
      "tags": [
        "オリジナル",
        "ネタ",
        "宇宙",
        "サバイバル",
        "ジオン視点",
        "ボール"
      ],
      "enemyFaction": "federation",
      "enemyBattleshipId": null,
      "costCap": 1200,
      "surviveTurns": 6,
      "enemyReinforcements": {
        "startTurn": 2,
        "endTurn": 6,
        "countPerTurn": 8,
        "entries": [
          {
            "msId": "ball",
            "characterIds": [],
            "weaponIds": [],
            "optionIds": [],
            "armorOverride": 1
          }
        ]
      },
      "summary": "完全オリジナルのネタステージ。HP1のボールが毎ターン大量投入されるボール地獄を、第6ターン終了まで生き延びるサバイバル戦です。倒しても倒しても次の波が来ます。",
      "enemyFormations": {
        "federation": [
          {
            "msId": "ball",
            "characterIds": [],
            "weaponIds": [],
            "optionIds": [],
            "armorOverride": 1
          },
          {
            "msId": "ball",
            "characterIds": [],
            "weaponIds": [],
            "optionIds": [],
            "armorOverride": 1
          },
          {
            "msId": "ball",
            "characterIds": [],
            "weaponIds": [],
            "optionIds": [],
            "armorOverride": 1
          },
          {
            "msId": "ball",
            "characterIds": [],
            "weaponIds": [],
            "optionIds": [],
            "armorOverride": 1
          },
          {
            "msId": "ball",
            "characterIds": [],
            "weaponIds": [],
            "optionIds": [],
            "armorOverride": 1
          },
          {
            "msId": "ball",
            "characterIds": [],
            "weaponIds": [],
            "optionIds": [],
            "armorOverride": 1
          },
          {
            "msId": "ball",
            "characterIds": [],
            "weaponIds": [],
            "optionIds": [],
            "armorOverride": 1
          },
          {
            "msId": "ball",
            "characterIds": [],
            "weaponIds": [],
            "optionIds": [],
            "armorOverride": 1
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
