"use strict";

// Playable map definitions.
window.GAME_DATA = window.GAME_DATA ?? {};
window.GAME_DATA.maps = [
  {
    "id": "gundamRisesColony",
    "name": "ガンダム大地に立つ",
    "type": "colony",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 1,
            "y": 9
          },
          {
            "x": 6,
            "y": 9
          }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 3,
          "y": 0
        },
        "units": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      }
    },
    "terrain": [
      "cliff",
      "cliff",
      "rock",
      "gate",
      "gate",
      "rock",
      "cliff",
      "cliff",
      "rock",
      "plain",
      "plain",
      "plain",
      "plain",
      "plain",
      "plain",
      "rock",
      "plain",
      "rock",
      "plain",
      "plain",
      "plain",
      "plain",
      "building",
      "plain",
      "green",
      "green",
      "building",
      "green",
      "green",
      "green",
      "green",
      "green",
      "green",
      "green",
      "green",
      "green",
      "green",
      "building",
      "green",
      "green",
      "green",
      "building",
      "green",
      "green",
      "green",
      "green",
      "green",
      "green",
      "green",
      "green",
      "green",
      "green",
      "building",
      "green",
      "green",
      "green",
      "base",
      "base",
      "base",
      "building",
      "base",
      "base",
      "building",
      "base",
      "base",
      "building",
      "base",
      "base",
      "base",
      "base",
      "base",
      "base",
      "base",
      "base",
      "base",
      "base",
      "base",
      "building",
      "base",
      "base"
    ]
  },
  {
    "id": "vsWhiteBase1",
    "name": "VSホワイトベース隊①",
    "type": "colony",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          { "x": 2, "y": 8 },
          { "x": 4, "y": 8 },
          { "x": 1, "y": 9 },
          { "x": 6, "y": 9 }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 3,
          "y": 0
        },
        "units": [
          { "x": 1, "y": 1 },
          { "x": 3, "y": 1 },
          { "x": 5, "y": 1 },
          { "x": 6, "y": 2 }
        ]
      }
    },
    "terrain": [
      "base", "base", "base", "base", "base", "building", "base", "base",
      "base", "building", "base", "base", "base", "base", "base", "base",
      "base", "base", "base", "building", "base", "base", "building", "base",
      "green", "green", "green", "green", "building", "green", "green", "green",
      "green", "building", "green", "green", "green", "green", "green", "green",
      "green", "green", "green", "green", "green", "building", "green", "green",
      "green", "green", "building", "green", "green", "green", "green", "green",
      "plain", "rock", "plain", "plain", "plain", "plain", "building", "plain",
      "rock", "plain", "plain", "plain", "plain", "plain", "plain", "rock",
      "cliff", "cliff", "rock", "gate", "gate", "rock", "cliff", "cliff"
    ]
  },
  {
    "id": "battleOfLoum",
    "name": "ルウムの戦い",
    "type": "space",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 4,
          "y": 9
        },
        "units": [
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 6,
            "y": 9
          }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 3,
          "y": 0
        },
        "units": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      }
    },
    "terrain": [
      "debris",
      "space",
      "space",
      "space",
      "space",
      "space",
      "wreckage",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "space",
      "wreckage",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "space",
      "space",
      "space",
      "wreckage",
      "space",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "wreckage",
      "space",
      "space",
      "space",
      "space",
      "wreckage",
      "space",
      "space",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "space",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "wreckage"
    ]
  },
  {
    "id": "greatSerpentVanishesAtLoum",
    "name": "大蛇はルウムに消えた",
    "type": "space",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 4,
          "y": 9
        },
        "units": [
          { "x": 1, "y": 8 },
          { "x": 3, "y": 8 },
          { "x": 5, "y": 8 },
          { "x": 6, "y": 9 }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 3,
          "y": 0
        },
        "escortBattleships": [
          { "x": 5, "y": 0 }
        ],
        "units": [
          { "x": 0, "y": 1 },
          { "x": 2, "y": 1 },
          { "x": 4, "y": 1 },
          { "x": 6, "y": 1 },
          { "x": 3, "y": 2 }
        ]
      }
    },
    "terrain": [
      "debris", "space", "space", "space", "space", "space", "wreckage", "space",
      "space", "space", "space", "space", "space", "debris", "space", "space",
      "space", "wreckage", "space", "space", "debris", "space", "space", "space",
      "debris", "space", "space", "space", "space", "space", "wreckage", "space",
      "space", "space", "debris", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "wreckage", "space", "space", "space",
      "space", "wreckage", "space", "space", "space", "space", "debris", "space",
      "space", "space", "space", "debris", "space", "space", "space", "space",
      "debris", "space", "space", "space", "space", "space", "debris", "space",
      "space", "space", "space", "space", "space", "space", "space", "wreckage"
    ]
  },
  {
    "id": "howlStainedInTheSettingSun",
    "name": "遠吠えは落日に染まった",
    "type": "ground",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 4,
          "y": 9
        },
        "units": [
          { "x": 0, "y": 8 },
          { "x": 2, "y": 8 },
          { "x": 5, "y": 8 },
          { "x": 7, "y": 8 }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 3,
          "y": 0
        },
        "units": [
          { "x": 0, "y": 1 },
          { "x": 2, "y": 1 },
          { "x": 4, "y": 1 },
          { "x": 7, "y": 1 },
          { "x": 1, "y": 2 },
          { "x": 5, "y": 2 },
          { "x": 6, "y": 2 }
        ]
      }
    },
    "terrain": [
      "desert", "desert", "desert", "desert", "desert", "desert", "desert", "desert",
      "desert", "plain", "plain", "desert", "desert", "plain", "plain", "desert",
      "desert", "plain", "rock", "plain", "plain", "rock", "plain", "desert",
      "plain", "plain", "plain", "desert", "desert", "plain", "plain", "plain",
      "desert", "rock", "plain", "plain", "plain", "plain", "rock", "desert",
      "desert", "plain", "plain", "ruin", "ruin", "plain", "plain", "desert",
      "plain", "plain", "rock", "plain", "plain", "rock", "plain", "plain",
      "desert", "plain", "plain", "base", "base", "plain", "plain", "desert",
      "desert", "desert", "plain", "plain", "plain", "plain", "desert", "desert",
      "desert", "desert", "desert", "desert", "desert", "desert", "desert", "desert"
    ]
  },
  {
    "id": "phantomRacesInOrbit",
    "name": "軌道上に幻影は疾る",
    "type": "space",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          { "x": 0, "y": 8 },
          { "x": 2, "y": 8 },
          { "x": 5, "y": 8 },
          { "x": 7, "y": 8 }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          { "x": 1, "y": 1 },
          { "x": 4, "y": 1 },
          { "x": 7, "y": 1 }
        ]
      }
    },
    "terrain": [
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "debris", "space", "space", "space", "space", "debris", "space",
      "space", "space", "space", "wreckage", "space", "space", "space", "space",
      "space", "space", "debris", "space", "space", "debris", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "debris", "space", "space", "space", "space", "debris", "space",
      "space", "space", "space", "space", "wreckage", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space"
    ]
  },
  {
    "id": "garmaFalls",
    "name": "ガルマ散る",
    "type": "ground",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 4,
          "y": 9
        },
        "units": [
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          },
          {
            "x": 7,
            "y": 8
          }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 6,
          "y": 0
        },
        "units": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 2
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 7,
            "y": 2
          }
        ]
      }
    },
    "terrain": [
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "ruin",
      "urban",
      "urban",
      "urban",
      "urban",
      "domeRuin",
      "domeRuin",
      "domeRuin",
      "urban",
      "urban",
      "ruin",
      "urban",
      "urban",
      "domeRuin",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "domeRuin",
      "urban",
      "urban",
      "urban",
      "ruin",
      "urban",
      "urban",
      "urban",
      "domeRuin",
      "domeRuin",
      "domeRuin",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "ruin",
      "urban",
      "ruin",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "urban",
      "ruin"
    ]
  },
  {
    "id": "vs07thPlatoon",
    "name": "VS第07小隊",
    "type": "ground",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      }
    },
    "terrain": [
      "base",
      "base",
      "plain",
      "plain",
      "plain",
      "plain",
      "base",
      "base",
      "base",
      "plain",
      "plain",
      "green",
      "green",
      "plain",
      "plain",
      "base",
      "plain",
      "plain",
      "forest",
      "forest",
      "forest",
      "forest",
      "plain",
      "plain",
      "plain",
      "forest",
      "forest",
      "rock",
      "rock",
      "forest",
      "forest",
      "plain",
      "green",
      "forest",
      "forest",
      "plain",
      "plain",
      "forest",
      "forest",
      "green",
      "green",
      "forest",
      "forest",
      "plain",
      "plain",
      "forest",
      "forest",
      "green",
      "plain",
      "forest",
      "forest",
      "rock",
      "rock",
      "forest",
      "forest",
      "plain",
      "plain",
      "plain",
      "forest",
      "forest",
      "forest",
      "forest",
      "plain",
      "plain",
      "base",
      "plain",
      "plain",
      "green",
      "green",
      "plain",
      "plain",
      "base",
      "base",
      "base",
      "plain",
      "plain",
      "plain",
      "plain",
      "base",
      "base"
    ]
  },
  {
    "id": "frontline",
    "name": "最前線",
    "type": "ground",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          {
            "x": 2,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 5,
            "y": 8
          }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 5,
            "y": 2
          }
        ]
      }
    },
    "terrain": [
      "forest",
      "forest",
      "plain",
      "plain",
      "plain",
      "plain",
      "forest",
      "forest",
      "forest",
      "plain",
      "plain",
      "rock",
      "plain",
      "plain",
      "plain",
      "forest",
      "forest",
      "plain",
      "ruin",
      "plain",
      "plain",
      "ruin",
      "plain",
      "forest",
      "forest",
      "plain",
      "plain",
      "plain",
      "green",
      "plain",
      "plain",
      "forest",
      "forest",
      "plain",
      "rock",
      "plain",
      "plain",
      "plain",
      "plain",
      "forest",
      "forest",
      "plain",
      "plain",
      "plain",
      "ruin",
      "plain",
      "rock",
      "forest",
      "forest",
      "plain",
      "green",
      "plain",
      "plain",
      "plain",
      "plain",
      "forest",
      "forest",
      "plain",
      "plain",
      "ruin",
      "plain",
      "plain",
      "plain",
      "forest",
      "forest",
      "plain",
      "plain",
      "plain",
      "plain",
      "rock",
      "plain",
      "forest",
      "forest",
      "forest",
      "plain",
      "plain",
      "plain",
      "plain",
      "forest",
      "forest"
    ]
  },
  {
    "id": "rambaRalAssault",
    "name": "ランバ・ラル特攻！",
    "type": "ground",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 2
          }
        ]
      }
    },
    "terrain": [
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "rock",
      "desert",
      "desert",
      "desert",
      "rock",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "rock",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "rock",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "rock",
      "desert",
      "desert",
      "desert",
      "desert",
      "rock",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "rock",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "rock",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert",
      "desert"
    ]
  },
  {
    "id": "tripleDomAssault",
    "name": "迫撃！トリプル・ドム！",
    "type": "ground",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          { "x": 0, "y": 8 },
          { "x": 2, "y": 8 },
          { "x": 5, "y": 8 },
          { "x": 7, "y": 8 }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          { "x": 3, "y": 1 },
          { "x": 1, "y": 2 },
          { "x": 5, "y": 2 },
          { "x": 0, "y": 1 },
          { "x": 7, "y": 1 }
        ]
      }
    },
    "terrain": [
      "desert", "desert", "desert", "desert", "desert", "desert", "desert", "desert",
      "desert", "desert", "plain", "plain", "plain", "plain", "desert", "desert",
      "desert", "plain", "plain", "plain", "plain", "plain", "plain", "desert",
      "plain", "plain", "rock", "plain", "plain", "rock", "plain", "plain",
      "plain", "plain", "plain", "plain", "plain", "plain", "plain", "plain",
      "plain", "rock", "plain", "plain", "plain", "plain", "rock", "plain",
      "desert", "plain", "plain", "plain", "plain", "plain", "plain", "desert",
      "desert", "desert", "plain", "rock", "rock", "plain", "desert", "desert",
      "desert", "desert", "desert", "plain", "plain", "desert", "desert", "desert",
      "desert", "desert", "desert", "desert", "desert", "desert", "desert", "desert"
    ]
  },
  {
    "id": "shudderingMountainPart1",
    "name": "震える山(前編)",
    "type": "ground",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          {
            "x": 4,
            "y": 1
          }
        ]
      }
    },
    "terrain": [
      "urban",
      "urban",
      "ruin",
      "urban",
      "urban",
      "ruin",
      "urban",
      "urban",
      "urban",
      "plain",
      "plain",
      "ruin",
      "plain",
      "plain",
      "building",
      "urban",
      "urban",
      "plain",
      "urban",
      "plain",
      "plain",
      "ruin",
      "plain",
      "urban",
      "ruin",
      "plain",
      "plain",
      "building",
      "plain",
      "urban",
      "plain",
      "ruin",
      "urban",
      "plain",
      "ruin",
      "plain",
      "urban",
      "plain",
      "plain",
      "urban",
      "urban",
      "plain",
      "plain",
      "urban",
      "plain",
      "building",
      "plain",
      "urban",
      "ruin",
      "plain",
      "urban",
      "plain",
      "plain",
      "ruin",
      "plain",
      "urban",
      "urban",
      "building",
      "plain",
      "plain",
      "urban",
      "plain",
      "plain",
      "urban",
      "urban",
      "plain",
      "plain",
      "ruin",
      "plain",
      "urban",
      "building",
      "urban",
      "urban",
      "urban",
      "plain",
      "plain",
      "urban",
      "ruin",
      "urban",
      "urban"
    ]
  },
  {
    "id": "vs08thTeam",
    "name": "VS08小隊",
    "type": "ground",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          { "x": 0, "y": 8 },
          { "x": 2, "y": 8 },
          { "x": 5, "y": 8 },
          { "x": 7, "y": 8 }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          { "x": 1, "y": 1 },
          { "x": 3, "y": 1 },
          { "x": 6, "y": 1 },
          { "x": 4, "y": 2 }
        ]
      }
    },
    "terrain": [
      "forest", "forest", "forest", "forest", "desert", "desert", "desert", "desert",
      "forest", "forest", "forest", "rock", "desert", "desert", "desert", "desert",
      "forest", "forest", "forest", "forest", "desert", "rock", "desert", "desert",
      "forest", "rock", "forest", "forest", "desert", "desert", "desert", "desert",
      "forest", "forest", "forest", "forest", "desert", "desert", "rock", "desert",
      "forest", "forest", "rock", "forest", "desert", "desert", "desert", "desert",
      "forest", "forest", "forest", "forest", "rock", "desert", "desert", "desert",
      "forest", "rock", "forest", "forest", "desert", "desert", "desert", "desert",
      "forest", "forest", "forest", "forest", "desert", "rock", "desert", "desert",
      "forest", "forest", "forest", "forest", "desert", "desert", "desert", "desert"
    ]
  },
  {
    "id": "shudderingMountainPart2",
    "name": "震える山（後編）",
    "type": "ground",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          { "x": 0, "y": 8 },
          { "x": 2, "y": 8 },
          { "x": 5, "y": 8 },
          { "x": 7, "y": 8 }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          { "x": 4, "y": 1 },
          { "x": 1, "y": 1 },
          { "x": 6, "y": 1 },
          { "x": 0, "y": 2 },
          { "x": 2, "y": 2 },
          { "x": 5, "y": 2 },
          { "x": 7, "y": 2 }
        ]
      }
    },
    "terrain": [
      "cliff", "base", "base", "base", "base", "base", "base", "cliff",
      "rock", "plain", "plain", "base", "base", "plain", "plain", "rock",
      "cliff", "plain", "rock", "plain", "plain", "rock", "plain", "cliff",
      "rock", "plain", "plain", "ruin", "ruin", "plain", "plain", "rock",
      "cliff", "rock", "plain", "plain", "plain", "plain", "rock", "cliff",
      "cliff", "plain", "plain", "rock", "rock", "plain", "plain", "cliff",
      "rock", "plain", "ruin", "plain", "plain", "ruin", "plain", "rock",
      "cliff", "plain", "plain", "plain", "plain", "plain", "plain", "cliff",
      "rock", "plain", "plain", "plain", "plain", "plain", "plain", "rock",
      "cliff", "cliff", "plain", "plain", "plain", "plain", "cliff", "cliff"
    ]
  },
  {
    "id": "atlanticBloodstained",
    "name": "大西洋、血に染めて",
    "type": "ground",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          {
            "x": 3,
            "y": 2
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          }
        ]
      }
    },
    "terrain": [
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "rock",
      "water",
      "water",
      "rock",
      "water",
      "water",
      "water",
      "water",
      "water",
      "rock",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "rock",
      "water",
      "water",
      "rock",
      "water",
      "water",
      "rock",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water",
      "water"
    ]
  },
  {
    "id": "jaburoFalls",
    "name": "ジャブローに散る！",
    "type": "ground",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          }
        ]
      }
    },
    "terrain": [
      "rock", "urban", "urban", "water", "water", "urban", "urban", "rock",
      "urban", "urban", "water", "water", "water", "water", "urban", "urban",
      "rock", "urban", "water", "urban", "water", "urban", "urban", "rock",
      "urban", "urban", "water", "urban", "water", "urban", "ruin", "urban",
      "urban", "water", "water", "water", "water", "water", "water", "urban",
      "urban", "water", "urban", "ruin", "urban", "urban", "water", "urban",
      "rock", "water", "urban", "urban", "urban", "water", "water", "rock",
      "urban", "water", "water", "water", "water", "water", "urban", "urban",
      "urban", "urban", "ruin", "urban", "water", "urban", "urban", "urban",
      "rock", "urban", "urban", "urban", "urban", "urban", "urban", "rock"
    ]
  },
  {
    "id": "zanzibarPursuit",
    "name": "ザンジバル追撃！",
    "type": "space",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 4,
            "y": 2
          }
        ]
      }
    },
    "terrain": [
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "wreckage", "wreckage", "space", "space", "space", "space",
      "space", "space", "space", "wreckage", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "wreckage", "wreckage", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space"
    ]
  },
  {
    "id": "battleOfSolomon",
    "name": "ソロモン攻略戦",
    "type": "space",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          { "x": 0, "y": 8 },
          { "x": 2, "y": 8 },
          { "x": 4, "y": 8 },
          { "x": 7, "y": 8 }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          { "x": 3, "y": 1 },
          { "x": 5, "y": 1 },
          { "x": 1, "y": 1 },
          { "x": 7, "y": 1 },
          { "x": 2, "y": 2 },
          { "x": 6, "y": 2 }
        ]
      }
    },
    "terrain": [
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "debris", "space", "space", "space", "space", "debris", "space",
      "space", "debris", "wreckage", "space", "space", "wreckage", "debris", "space",
      "space", "space", "wreckage", "wreckage", "wreckage", "wreckage", "space", "space",
      "space", "space", "debris", "wreckage", "wreckage", "debris", "space", "space",
      "space", "debris", "space", "space", "space", "space", "debris", "space",
      "space", "space", "space", "debris", "debris", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space"
    ]
  },
  {
    "id": "shiningSpace",
    "name": "光る宇宙",
    "type": "space",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          { "x": 1, "y": 8 },
          { "x": 3, "y": 8 },
          { "x": 4, "y": 8 },
          { "x": 6, "y": 8 }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          { "x": 3, "y": 1 },
          { "x": 5, "y": 2 }
        ]
      }
    },
    "terrain": [
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "debris", "space", "space", "space", "space",
      "space", "debris", "space", "space", "space", "space", "debris", "space",
      "space", "space", "space", "space", "space", "debris", "space", "space",
      "space", "space", "debris", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space"
    ]
  },
  {
    "id": "aBaoaQu",
    "name": "宇宙要塞ア・バオア・クー",
    "type": "space",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          { "x": 0, "y": 8 },
          { "x": 2, "y": 8 },
          { "x": 5, "y": 8 },
          { "x": 7, "y": 8 }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          { "x": 3, "y": 1 },
          { "x": 5, "y": 1 },
          { "x": 1, "y": 1 },
          { "x": 7, "y": 1 },
          { "x": 0, "y": 2 },
          { "x": 2, "y": 2 },
          { "x": 5, "y": 2 },
          { "x": 7, "y": 2 }
        ]
      }
    },
    "terrain": [
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "debris", "debris", "space", "space", "space",
      "space", "wreckage", "space", "wreckage", "wreckage", "space", "wreckage", "space",
      "debris", "wreckage", "wreckage", "space", "space", "wreckage", "wreckage", "debris",
      "space", "wreckage", "space", "debris", "debris", "space", "wreckage", "space",
      "space", "space", "debris", "space", "space", "debris", "space", "space",
      "space", "debris", "space", "space", "space", "space", "debris", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space"
    ]
  },
  {
    "id": "vsWhiteBase2",
    "name": "VSホワイトベース隊②",
    "type": "space",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          { "x": 0, "y": 8 },
          { "x": 2, "y": 8 },
          { "x": 5, "y": 8 },
          { "x": 7, "y": 8 }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          { "x": 3, "y": 1 },
          { "x": 1, "y": 1 },
          { "x": 6, "y": 1 },
          { "x": 2, "y": 2 },
          { "x": 5, "y": 2 }
        ]
      }
    },
    "terrain": [
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "debris", "space", "space", "space", "space", "debris", "space",
      "debris", "debris", "debris", "space", "space", "debris", "debris", "debris",
      "space", "debris", "debris", "debris", "debris", "debris", "debris", "space",
      "debris", "debris", "space", "debris", "debris", "space", "debris", "debris",
      "space", "debris", "debris", "space", "space", "debris", "debris", "space",
      "space", "space", "debris", "space", "space", "debris", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space"
    ]
  },
  {
    "id": "howManyMilesToTheBattlefield",
    "name": "戦場までは何マイル？",
    "type": "ground",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          { "x": 1, "y": 8 },
          { "x": 3, "y": 8 },
          { "x": 4, "y": 8 },
          { "x": 6, "y": 8 }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          { "x": 1, "y": 1 },
          { "x": 3, "y": 1 },
          { "x": 5, "y": 1 },
          { "x": 7, "y": 1 }
        ]
      }
    },
    "terrain": [
      "water", "water", "water", "water", "water", "water", "water", "water",
      "water", "water", "water", "water", "water", "water", "water", "water",
      "water", "water", "rock", "water", "water", "rock", "water", "water",
      "water", "rock", "water", "water", "water", "water", "rock", "water",
      "water", "water", "water", "base", "base", "water", "water", "water",
      "rock", "plain", "base", "base", "base", "base", "plain", "rock",
      "plain", "base", "base", "building", "building", "base", "base", "plain",
      "base", "base", "building", "base", "base", "building", "base", "base",
      "base", "base", "base", "base", "base", "base", "base", "base",
      "base", "base", "base", "base", "base", "base", "base", "base"
    ]
  },
  {
    "id": "acrossTheRiverAndThroughTheTrees",
    "name": "河を渡って木立を抜けて",
    "type": "colony",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          { "x": 0, "y": 8 },
          { "x": 2, "y": 8 },
          { "x": 5, "y": 8 },
          { "x": 7, "y": 8 }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          { "x": 4, "y": 1 },
          { "x": 1, "y": 3 },
          { "x": 6, "y": 3 },
          { "x": 2, "y": 4 },
          { "x": 5, "y": 4 },
          { "x": 3, "y": 4 }
        ]
      }
    },
    "terrain": [
      "urban", "urban", "building", "urban", "urban", "building", "urban", "urban",
      "urban", "base", "base", "urban", "urban", "base", "base", "urban",
      "urban", "urban", "building", "urban", "urban", "building", "urban", "urban",
      "green", "forest", "green", "green", "green", "green", "forest", "green",
      "forest", "green", "forest", "green", "green", "forest", "green", "forest",
      "water", "water", "water", "bridge", "bridge", "water", "water", "water",
      "water", "water", "water", "bridge", "bridge", "water", "water", "water",
      "forest", "green", "forest", "green", "green", "forest", "green", "forest",
      "green", "green", "green", "base", "base", "green", "green", "green",
      "base", "base", "base", "base", "base", "base", "base", "base"
    ]
  },
  {
    "id": "warInThePocketFinal",
    "name": "ポケットの中の戦争",
    "type": "space",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          { "x": 0, "y": 8 },
          { "x": 2, "y": 8 },
          { "x": 5, "y": 8 },
          { "x": 7, "y": 8 }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "escortBattleships": [
          { "x": 1, "y": 0 }
        ],
        "units": [
          { "x": 3, "y": 1 },
          { "x": 5, "y": 1 },
          { "x": 1, "y": 2 },
          { "x": 6, "y": 2 },
          { "x": 4, "y": 2 }
        ]
      }
    },
    "terrain": [
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "debris", "space", "space", "space", "space", "debris", "space",
      "space", "space", "space", "wreckage", "wreckage", "space", "space", "space",
      "space", "debris", "space", "space", "space", "space", "debris", "space",
      "space", "space", "debris", "space", "space", "debris", "space", "space",
      "space", "space", "space", "wreckage", "space", "space", "space", "space",
      "space", "debris", "space", "space", "space", "space", "debris", "space",
      "space", "space", "space", "space", "space", "space", "space", "space",
      "space", "space", "space", "space", "space", "space", "space", "space"
    ]
  },
  {
    "id": "acePilotZaku",
    "name": "エースパイロット・ザク編",
    "type": "colony",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          { "x": 0, "y": 8 },
          { "x": 2, "y": 8 },
          { "x": 5, "y": 8 },
          { "x": 7, "y": 8 }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          { "x": 0, "y": 1 },
          { "x": 1, "y": 1 },
          { "x": 2, "y": 1 },
          { "x": 3, "y": 1 },
          { "x": 4, "y": 1 },
          { "x": 5, "y": 1 },
          { "x": 6, "y": 1 },
          { "x": 7, "y": 1 },
          { "x": 1, "y": 2 },
          { "x": 4, "y": 2 },
          { "x": 6, "y": 2 }
        ]
      }
    },
    "terrain": [
      "urban", "urban", "urban", "urban", "urban", "urban", "urban", "urban",
      "urban", "plain", "plain", "plain", "plain", "plain", "plain", "urban",
      "urban", "plain", "ruin", "plain", "plain", "ruin", "plain", "urban",
      "urban", "plain", "plain", "urban", "urban", "plain", "plain", "urban",
      "urban", "ruin", "plain", "urban", "urban", "plain", "ruin", "urban",
      "urban", "plain", "plain", "plain", "plain", "plain", "plain", "urban",
      "urban", "plain", "urban", "plain", "plain", "urban", "plain", "urban",
      "urban", "plain", "plain", "ruin", "plain", "plain", "plain", "urban",
      "urban", "plain", "plain", "plain", "plain", "plain", "plain", "urban",
      "urban", "urban", "urban", "urban", "urban", "urban", "urban", "urban"
    ]
  },
  {
    "id": "ballHell",
    "name": "ボール地獄",
    "type": "space",
    "width": 8,
    "height": 10,
    "deployment": {
      "player": {
        "battleship": {
          "x": 3,
          "y": 9
        },
        "units": [
          {
            "x": 1,
            "y": 8
          },
          {
            "x": 3,
            "y": 8
          },
          {
            "x": 4,
            "y": 8
          },
          {
            "x": 6,
            "y": 8
          }
        ]
      },
      "enemy": {
        "battleship": {
          "x": 4,
          "y": 0
        },
        "units": [
          {
            "x": 0,
            "y": 1
          },
          {
            "x": 1,
            "y": 1
          },
          {
            "x": 2,
            "y": 1
          },
          {
            "x": 3,
            "y": 1
          },
          {
            "x": 4,
            "y": 1
          },
          {
            "x": 5,
            "y": 1
          },
          {
            "x": 6,
            "y": 1
          },
          {
            "x": 7,
            "y": 1
          }
        ]
      }
    },
    "terrain": [
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "space",
      "space",
      "wreckage",
      "space",
      "space",
      "space",
      "wreckage",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "wreckage",
      "space",
      "space",
      "space",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "space",
      "space",
      "wreckage",
      "space",
      "space",
      "space",
      "wreckage",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "debris",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space",
      "space"
    ]
  }
];
