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
  }
];
