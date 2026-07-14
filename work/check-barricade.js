#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { DATA_FILES, RUNTIME_FILES, projectPath } = require("./project-files");

function loadRuntime() {
  const element = {
    addEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    classList: { add() {}, remove() {}, toggle() {} },
    dataset: {},
    innerHTML: "",
    value: ""
  };
  const context = vm.createContext({
    console,
    document: {
      querySelector() { return element; },
      querySelectorAll() { return []; },
      createElement() { return { ...element }; }
    },
    localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
    setTimeout,
    clearTimeout,
    structuredClone,
    URLSearchParams,
    window: null
  });
  context.window = context;
  for (const file of [...DATA_FILES, ...RUNTIME_FILES.filter((item) => item !== "src/events.js")]) {
    vm.runInContext(fs.readFileSync(projectPath(file), "utf8"), context, { filename: file });
  }
  vm.runInContext(`
    state.data = window.GAME_DATA;
    state.data.maps.push({
      id: "barricadeTestMap",
      name: "Barricade Test",
      type: "ground",
      width: 10,
      height: 10,
      terrain: Array(100).fill("plain")
    });
    state.data.campaign.stages.push({ mapId: "barricadeTestMap", enemyFaction: "zeon" });
    state.selectedMapId = "barricadeTestMap";
    state.collection = { characterGrowth: {} };
    renderBattle = () => {};
    checkOutcome = () => {};
    spawnStageEnemyReinforcementsForTurn = () => {};
  `, context);
  return context;
}

function evaluate(context, source) {
  return vm.runInContext(source, context);
}

function main() {
  const context = loadRuntime();
  const expectedNative = [
    "ball",
    "ballK",
    "ballSharkMouth",
    "ballTypeM",
    "fishEye",
    "frogBall",
    "zakuTank",
    "zakuTankGreenMacac",
    "zakuTankWildBoar"
  ];
  const nativeSources = evaluate(context, `state.data.mobileSuits
    .filter((ms) => (ms.specials ?? []).includes("barricadePlacement"))
    .map((ms) => ms.id)
    .sort()`);
  assert.deepEqual([...nativeSources], expectedNative, "Barricade placement must stay on the intended Ball and Zaku Tank family members");

  const adjustedStats = evaluate(context, `Object.fromEntries(${JSON.stringify(expectedNative)}.map((id) => {
    const ms = lookup().ms[id];
    return [id, { cost: ms.cost, armor: ms.armor, agility: ms.agility }];
  }))`);
  const expectedStats = {
    ball: { cost: 55, armor: 140, agility: 7 },
    ballK: { cost: 60, armor: 135, agility: 12 },
    ballSharkMouth: { cost: 70, armor: 140, agility: 7 },
    ballTypeM: { cost: 70, armor: 130, agility: 8 },
    fishEye: { cost: 85, armor: 160, agility: 11 },
    frogBall: { cost: 70, armor: 130, agility: 8 },
    zakuTank: { cost: 90, armor: 265, agility: 5 },
    zakuTankGreenMacac: { cost: 105, armor: 280, agility: 4 },
    zakuTankWildBoar: { cost: 110, armor: 270, agility: 5 }
  };
  Object.entries(expectedStats).forEach(([id, expected]) => {
    assert.deepEqual({ ...adjustedStats[id] }, expected, `Unexpected balance values for ${id}`);
  });

  const option = evaluate(context, `lookup().options.barricadePlacement`);
  assert.equal(option.cost, 45);
  assert.equal(option.grantsSkill, "barricadePlacement");
  assert.deepEqual([...option.factions], ["federation", "zeon"]);

  const placement = evaluate(context, `(() => {
    state.units = [
      makeUnit({ msId: "ball", characterIds: ["federationSoldier"], weaponIds: [], optionIds: [] }, "player", 5, 7, 0),
      makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 5, 3, 0)
    ];
    state.phase = "player";
    state.outcome = null;
    state.log = [];
    const source = state.units.find((unit) => unit.side === "player");
    const enemy = state.units.find((unit) => unit.side === "enemy");
    const firstUse = deployBarricade(source, false);
    const barricade = state.units.find((unit) => isBarricade(unit));
    return {
      firstUse,
      secondUse: deployBarricade(source, false),
      sourceUsed: source.barricadeUsed,
      sourceActed: source.acted,
      sourceMoved: source.moved,
      barricade: { side: barricade.side, x: barricade.x, y: barricade.y, armor: barricade.armor },
      attackable: isAttackTarget(barricade),
      evasion: evasion(barricade),
      occupied: occupiedAt(barricade.x, barricade.y),
      blocksLineOfSight: weaponBlockedByObstacle(enemy, source, weaponFor("zakuMachineGun"))
    };
  })()`);
  assert.equal(placement.firstUse, true);
  assert.equal(placement.secondUse, false, "Barricade placement must be limited to once per battle per unit");
  assert.equal(placement.sourceUsed, true);
  assert.equal(placement.sourceActed, true);
  assert.equal(placement.sourceMoved, true);
  assert.deepEqual({ ...placement.barricade }, { side: "player", x: 5, y: 6, armor: 100 });
  assert.equal(placement.attackable, true);
  assert.equal(placement.evasion, 0);
  assert.equal(placement.occupied, true);
  assert.equal(placement.blocksLineOfSight, true, "A living barricade should block ordinary line of sight");

  const destroyed = evaluate(context, `(() => {
    state.units = [
      makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: [] }, "player", 5, 5, 0),
      {
        id: "enemy-barricade",
        type: "barricade",
        side: "enemy",
        faction: "zeon",
        name: "バリケード",
        armor: BARRICADE_ARMOR,
        maxArmor: BARRICADE_ARMOR,
        mobility: 0,
        x: 5,
        y: 3
      }
    ];
    state.phase = "player";
    state.outcome = null;
    state.log = [];
    Math.random = () => 0;
    const attacker = state.units.find((unit) => isMobileSuit(unit));
    const barricade = state.units.find((unit) => isBarricade(unit));
    attack(attacker, barricade, weaponFor("beamRifle"), false);
    return {
      alive: isAlive(barricade),
      occupied: occupiedAt(barricade.x, barricade.y),
      attackRecorded: attacker.usedWeaponIds.includes("beamRifle")
    };
  })()`);
  assert.equal(destroyed.alive, false);
  assert.equal(destroyed.occupied, false, "A destroyed barricade must stop blocking movement");
  assert.equal(destroyed.attackRecorded, true, "An opposing unit must be able to attack and destroy a barricade through normal combat");

  const enemyAgainstBarricade = evaluate(context, `(() => {
    state.units = [
      makeUnit({ msId: "ball", characterIds: ["federationSoldier"], weaponIds: [], optionIds: [] }, "player", 5, 7, 0),
      makeUnit({ msId: "zaku2", characterIds: ["zeonSoldier"], weaponIds: ["zakuMachineGun"], optionIds: [] }, "enemy", 5, 3, 0)
    ];
    state.phase = "player";
    state.outcome = null;
    state.log = [];
    deployBarricade(state.units.find((unit) => unit.side === "player"), false);
    const barricade = state.units.find((unit) => isBarricade(unit));
    const attackListEmpty = unitWeaponObjects(barricade).length === 0;
    state.phase = "enemy";
    state.enemyQueue = enemyTurnQueue();
    advanceEnemyTurn();
    return { attackListEmpty, aiAdvanced: state.log.length > 0 };
  })()`);
  assert.equal(enemyAgainstBarricade.attackListEmpty, true, "Barricades must never be evaluated as attackers");
  assert.equal(enemyAgainstBarricade.aiAdvanced, true, "Enemy AI should continue acting when an opposing barricade exists");

  const optionGranted = evaluate(context, `(() => {
    state.units = [makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: ["barricadePlacement"] }, "player", 5, 7, 0)];
    return unitHasSkill(state.units[0], "barricadePlacement");
  })()`);
  assert.equal(optionGranted, true, "The option card should grant barricade placement to an ordinary MS");

  const enemyUse = evaluate(context, `(() => {
    state.units = [
      makeUnit({ msId: "zakuTank", characterIds: ["zeonSoldier"], weaponIds: [], optionIds: [] }, "enemy", 5, 2, 0),
      makeUnit({ msId: "gundam", characterIds: ["federationSoldier"], weaponIds: ["beamRifle"], optionIds: [] }, "player", 5, 6, 0)
    ];
    state.phase = "enemy";
    state.outcome = null;
    state.enemyQueue = enemyTurnQueue();
    state.log = [];
    advanceEnemyTurn();
    const source = state.units.find((unit) => unit.msId === "zakuTank");
    const barricade = state.units.find((unit) => isBarricade(unit));
    return { used: source.barricadeUsed, x: barricade?.x, y: barricade?.y, side: barricade?.side };
  })()`);
  assert.deepEqual({ ...enemyUse }, { used: true, x: 5, y: 3, side: "enemy" }, "Enemy AI should deploy a useful forward barricade");

  console.log("Barricade checks passed: family assignment, option, placement, blocking, destruction, enemy AI.");
}

main();
