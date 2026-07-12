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
      "series": "originalHistory",
      "order": 210,
      "tags": [
        "史実再現",
        "オリジナル",
        "宇宙",
        "艦隊戦",
        "ジオン視点"
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
