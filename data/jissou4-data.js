(() => {
  const data = window.GAME_DATA;
  if (!data) throw new Error("game-data.js must be loaded before jissou4-data.js");

  const addUnique = (list, entries) => {
    const known = new Set(list.map((entry) => entry.id));
    entries.forEach((entry) => {
      if (!known.has(entry.id)) list.push(entry);
    });
  };
  const terrain = (overrides = {}) => ({ water: false, forest: false, desert: false, debris: false, ...overrides });
  const weapon = (entry) => ({
    cost: 0, power: 0, accuracy: 0, range: 1, minRange: 1, consume: 0,
    kind: "ammo", ammo: 0, category: "machine-gun", attackType: "shooting",
    durability: 0, imagePath: "", ...entry
  });
  const ms = (entry) => ({
    energy: 60, weaponSlots: 2, optionSlots: 1, fixedWeaponIds: [],
    mapTypes: ["ground", "space"], movementType: "normal", terrainSuitability: terrain(),
    tags: [], specials: [], imagePath: "", ...entry
  });
  const character = (entry) => ({
    characterKey: entry.id, selectable: true, awakening: 0, roles: ["pilot"],
    specials: [], imagePath: "", ...entry
  });

  addUnique(data.skills, [
    { id: "highPerformanceSight", name: "高性能照準器", type: "機体/OP", timing: "攻撃時", effect: "距離4以上から射撃武器で攻撃する時、命中+8。", implemented: true },
    { id: "allyBackup", name: "味方援護", type: "キャラ", timing: "攻撃時", effect: "自機より前方に味方がいる時、命中+6。", implemented: true },
    { id: "sandAmbush", name: "砂塵の伏兵", type: "キャラ", timing: "攻撃時", effect: "砂漠マスから攻撃する時、与ダメージ+12。", implemented: true },
    { id: "stopMovement", name: "足止め作戦", type: "キャラ/OP", timing: "常時", effect: "2マス以内にいる敵MSの移動力-1。重複しない。", implemented: true }
  ]);
  const externalGeneratorSkill = data.skills.find((skill) => skill.id === "externalGenerator");
  if (externalGeneratorSkill) externalGeneratorSkill.effect = "機体EN+25。";
  const longRangeScopeSkill = data.skills.find((skill) => skill.id === "longRangeScope");
  if (longRangeScopeSkill) longRangeScopeSkill.type = "機体/OP";
  const stationaryInterceptionSkill = data.skills.find((skill) => skill.id === "stationaryInterception");
  if (stationaryInterceptionSkill) stationaryInterceptionSkill.type = "機体/OP";

  addUnique(data.weapons, [
    weapon({ id: "heavyGuncannonCannon", name: "重装型240mmキャノン", power: 155, accuracy: 66, range: 5, minRange: 2, consume: 1, ammo: 5, category: "cannon", fixedOnly: true, ignoresObstacles: true, factions: ["federation"] }),
    weapon({ id: "typeDShortCannon", name: "タイプD肩部キャノン", power: 135, accuracy: 74, range: 3, minRange: 2, consume: 1, ammo: 6, category: "cannon", fixedOnly: true, factions: ["federation"] }),
    weapon({ id: "guncannon2BeamCannon", name: "ビーム・キャノン", power: 155, accuracy: 70, range: 5, minRange: 2, consume: 25, kind: "beam", category: "beam-rifle", fixedOnly: true, factions: ["federation"] }),
    weapon({ id: "guntank2Rocket", name: "4連装ロケット・ランチャー", power: 105, accuracy: 72, range: 4, minRange: 2, consume: 1, ammo: 5, category: "missile", fixedOnly: true, ignoresObstacles: true, factions: ["federation"] }),
    weapon({ id: "guntank2Missile", name: "3連装ミサイル・ランチャー", power: 85, accuracy: 80, range: 3, consume: 1, ammo: 6, category: "missile", fixedOnly: true, factions: ["federation"] }),
    weapon({ id: "simpleFixedShield", name: "簡易固定シールド", power: 0, accuracy: 0, range: 0, minRange: 0, kind: "shield", category: "shield", attackType: "guard", durability: 55, fixedOnly: true, factions: ["federation"] }),
    weapon({ id: "chestVulcan", name: "胸部バルカン砲", power: 45, accuracy: 84, range: 2, consume: 1, ammo: 8, fixedOnly: true, factions: ["federation"] }),
    weapon({ id: "ballK15Caliber", name: "15口径キャノン", power: 80, accuracy: 82, range: 3, consume: 1, ammo: 8, category: "cannon", fixedOnly: true, factions: ["federation"] }),
    weapon({ id: "largeSmartBomb", name: "大型スマート爆弾", power: 165, accuracy: 64, range: 3, minRange: 2, consume: 1, ammo: 2, category: "bomb", fixedOnly: true, ignoresObstacles: true, factions: ["federation"] }),
    weapon({ id: "mineDispenser", name: "機雷散布器", power: 0, accuracy: 0, range: 1, consume: 1, ammo: 3, category: "grenade", utilityOnly: true, fixedOnly: true, specials: ["mineScatter"], factions: ["zeon"] }),
    weapon({ id: "zeonHeadVulcan", name: "頭部バルカン", power: 35, accuracy: 85, range: 2, consume: 1, ammo: 8, fixedOnly: true, factions: ["zeon"] }),
    weapon({ id: "zakuMarineRocketPod", name: "ロケット・ポッド", power: 100, accuracy: 72, range: 3, minRange: 2, consume: 1, ammo: 5, category: "missile", fixedOnly: true, ignoresObstacles: true, factions: ["zeon"] }),
    weapon({ id: "psycommuZakuWiredCannon", name: "有線制御式メガ粒子砲", power: 150, accuracy: 74, range: 5, minRange: 2, consume: 24, kind: "beam", category: "psycommu", requiredAwakening: 12, fixedOnly: true, factions: ["zeon"] }),
    weapon({ id: "psycommuZakuLegCannon", name: "脚部メガ粒子砲", power: 110, accuracy: 78, range: 3, consume: 17, kind: "beam", category: "beam-rifle", requiredAwakening: 10, fixedOnly: true, factions: ["zeon"] }),
    weapon({ id: "enhancedFingerVulcan", name: "強化型フィンガー・バルカン", power: 95, accuracy: 84, range: 3, consume: 1, ammo: 8, fixedOnly: true, factions: ["zeon"] }),
    weapon({ id: "legTripleMissilePod", name: "脚部3連装ミサイル・ポッド", power: 90, accuracy: 76, range: 3, minRange: 2, consume: 1, ammo: 6, category: "missile", fixedOnly: true, factions: ["zeon"] }),
    weapon({ id: "gelgoogBeamCannon", name: "ゲルググ用ビーム・キャノン", power: 155, accuracy: 70, range: 5, minRange: 2, consume: 25, kind: "beam", category: "beam-rifle", fixedOnly: true, factions: ["zeon"] }),

    weapon({ id: "rocketLauncher", name: "ロケット・ランチャー", cost: 35, power: 115, accuracy: 68, range: 3, minRange: 2, consume: 1, ammo: 5, category: "bazooka", factions: ["federation"] }),
    weapon({ id: "railCannon", name: "レール・キャノン", cost: 50, power: 125, accuracy: 76, range: 3, minRange: 2, consume: 1, ammo: 5, category: "cannon", factions: ["federation"] }),
    weapon({ id: "longRangeBeamRifle", name: "ロングレンジ・ビーム・ライフル", cost: 75, power: 160, accuracy: 70, range: 6, minRange: 3, consume: 28, kind: "beam", category: "beam-rifle", slotCost: 2, factions: ["federation"] }),
    weapon({ id: "subrocGun", name: "サブロック・ガン", cost: 40, power: 105, accuracy: 78, range: 4, minRange: 2, consume: 1, ammo: 6, category: "missile", specials: ["antiSubmarine"], factions: ["zeon"] }),
    weapon({ id: "tripleGatlingGun", name: "3連装ガトリング砲", cost: 45, power: 100, accuracy: 84, range: 3, consume: 1, ammo: 8, category: "machine-gun", factions: ["zeon"] }),
    weapon({ id: "gatlingShield", name: "ガトリング・シールド", cost: 60, power: 90, accuracy: 80, range: 3, consume: 0, kind: "shield", category: "shield", attackType: "shooting", durability: 125, shieldAttackCost: 25, factions: ["zeon"] }),
    weapon({ id: "beamSniperRifle", name: "ビーム・スナイパー・ライフル", cost: 70, power: 150, accuracy: 72, range: 6, minRange: 3, consume: 26, kind: "beam", category: "beam-rifle", slotCost: 2, factions: ["zeon"] })
  ]);

  addUnique(data.mobileSuits, [
    ms({ id: "guncannonHeavy", name: "ガンキャノン重装型", faction: "federation", cost: 230, armor: 425, energy: 85, agility: 8, mobility: 3, fixedWeaponIds: ["heavyGuncannonCannon", "headVulcan"], tags: ["guncannon", "cannonMs"] }),
    ms({ id: "guncannonHeavyTypeD", name: "ガンキャノン重装型タイプD", faction: "federation", cost: 240, armor: 405, energy: 90, agility: 15, mobility: 4, fixedWeaponIds: ["typeDShortCannon", "headVulcan"], tags: ["guncannon", "cannonMs"] }),
    ms({ id: "guncannon2", name: "ガンキャノンII", faction: "federation", cost: 275, armor: 405, energy: 120, agility: 17, mobility: 4, fixedWeaponIds: ["guncannon2BeamCannon", "headVulcan"], tags: ["guncannon", "cannonMs"], specials: ["highPerformanceSight"] }),
    ms({ id: "guntank2", name: "ガンタンクII", faction: "federation", cost: 245, armor: 475, energy: 75, agility: 8, mobility: 3, weaponSlots: 0, fixedWeaponIds: ["guntankLowRecoilCannon", "guntank2Rocket", "guntank2Missile"], mapTypes: ["ground"], tags: ["guntank", "tank"], specials: ["stationaryInterception"] }),
    ms({ id: "landCombatGm", name: "陸戦用ジム", faction: "federation", cost: 155, armor: 305, energy: 70, agility: 12, mobility: 3, fixedWeaponIds: ["headVulcan", "beamSaber", "simpleFixedShield"], mapTypes: ["ground"], tags: ["gm", "federationMassProduction"] }),
    ms({ id: "desertGm", name: "デザート・ジム", faction: "federation", cost: 145, armor: 265, energy: 72, agility: 17, mobility: 4, fixedWeaponIds: ["beamSaber"], mapTypes: ["ground"], terrainSuitability: terrain({ desert: true }), tags: ["gm", "federationMassProduction", "desert"] }),
    ms({ id: "groundGm", name: "陸戦型ジム", faction: "federation", cost: 155, armor: 285, energy: 75, agility: 17, mobility: 4, fixedWeaponIds: ["beamSaber", "smallShield"], mapTypes: ["ground"], tags: ["gm", "groundGm", "federationMassProduction"] }),
    ms({ id: "groundGmSniper", name: "陸戦型ジム・スナイパー", faction: "federation", cost: 180, armor: 275, energy: 105, agility: 16, mobility: 4, fixedWeaponIds: ["beamSaber"], mapTypes: ["ground"], terrainSuitability: terrain({ forest: true }), tags: ["gm", "groundGm", "gmSniper", "federationMassProduction"], specials: ["longRangeScope"] }),
    ms({ id: "groundGundam", name: "陸戦型ガンダム", faction: "federation", cost: 220, armor: 330, energy: 95, agility: 20, mobility: 5, fixedWeaponIds: ["beamSaber", "chestVulcan"], mapTypes: ["ground"], tags: ["gundam", "groundGundam"] }),
    ms({ id: "ballK", name: "ボールK型", faction: "federation", cost: 60, armor: 145, energy: 38, agility: 13, mobility: 4, weaponSlots: 0, fixedWeaponIds: ["ballK15Caliber"], mapTypes: ["space"], terrainSuitability: terrain({ debris: true }), tags: ["ball", "supportPod"] }),
    ms({ id: "jetCoreBooster", name: "ジェット・コア・ブースター", faction: "federation", cost: 125, armor: 170, energy: 70, agility: 30, mobility: 8, weaponSlots: 0, fixedWeaponIds: ["aircraftVulcan", "largeSmartBomb"], mapTypes: ["ground"], movementType: "flying", tags: ["federationAircraft", "coreBooster"] }),

    ms({ id: "zakuMineLayer", name: "ザク・マインレイヤー", faction: "zeon", cost: 115, armor: 260, energy: 55, agility: 12, mobility: 4, fixedWeaponIds: ["heatHawk", "mineDispenser"], forbiddenWeaponKinds: ["beam"], mapTypes: ["space"], terrainSuitability: terrain({ debris: true }), tags: ["zaku", "zaku2"] }),
    ms({ id: "zakuMarine", name: "ザク・マリンタイプ", faction: "zeon", cost: 90, armor: 235, energy: 45, agility: 10, mobility: 3, weaponSlots: 1, fixedWeaponIds: ["zeonHeadVulcan", "zakuMarineRocketPod"], forbiddenWeaponKinds: ["beam"], mapTypes: ["ground"], terrainSuitability: terrain({ water: true }), tags: ["zaku", "aquatic"] }),
    ms({ id: "zakuFlipper", name: "ザク・フリッパー", faction: "zeon", cost: 120, armor: 235, energy: 60, agility: 21, mobility: 6, fixedWeaponIds: [], forbiddenWeaponKinds: ["beam"], terrainSuitability: terrain({ debris: true }), tags: ["zaku", "reconMs"], specials: ["recon"] }),
    ms({ id: "psycommuZakuTest", name: "サイコミュ・システム高機動試験用ザク", faction: "zeon", cost: 235, armor: 250, energy: 130, agility: 27, mobility: 7, weaponSlots: 0, fixedWeaponIds: ["psycommuZakuWiredCannon", "psycommuZakuLegCannon"], mapTypes: ["space"], tags: ["zaku", "psycommu"] }),
    ms({ id: "zaku1Sniper", name: "ザクI・スナイパータイプ", faction: "zeon", cost: 135, armor: 195, energy: 105, agility: 7, mobility: 3, fixedWeaponIds: ["zeonHeadVulcan"], tags: ["zaku", "zaku1", "sniperMs"], specials: ["stationaryInterception"] }),
    ms({ id: "prototypeGouf", name: "プロトタイプ・グフ", faction: "zeon", cost: 135, armor: 290, energy: 60, agility: 17, mobility: 4, fixedWeaponIds: ["heatHawk"], forbiddenWeaponKinds: ["beam"], tags: ["zaku", "gouf"] }),
    ms({ id: "goufHeavy", name: "グフ重装型", faction: "zeon", cost: 190, armor: 375, energy: 70, agility: 12, mobility: 3, weaponSlots: 0, fixedWeaponIds: ["enhancedFingerVulcan", "legTripleMissilePod"], mapTypes: ["ground"], tags: ["gouf"] }),
    ms({ id: "goufFlightTest", name: "グフ飛行試験型", faction: "zeon", cost: 185, armor: 300, energy: 75, agility: 19, mobility: 6, weaponSlots: 0, fixedWeaponIds: ["fingerVulcan", "legTripleMissilePod"], mapTypes: ["ground"], movementType: "flying", tags: ["gouf"] }),
    ms({ id: "domTropicalTest", name: "ドム・トロピカルテストタイプ", faction: "zeon", cost: 200, armor: 345, energy: 75, agility: 17, mobility: 5, fixedWeaponIds: ["heatSaber"], mapTypes: ["ground"], terrainSuitability: terrain({ desert: true }), tags: ["dom", "desert"] }),
    ms({ id: "gelgoogCannon", name: "ゲルググ・キャノン", faction: "zeon", cost: 285, armor: 370, energy: 125, agility: 22, mobility: 5, weaponSlots: 1, fixedWeaponIds: ["beamNaginata", "gelgoogBeamCannon"], tags: ["gelgoog", "cannonMs"] }),
    ms({ id: "highMobilityGelgoog", name: "高機動型ゲルググ", faction: "zeon", cost: 290, armor: 350, energy: 115, agility: 29, mobility: 7, fixedWeaponIds: ["beamNaginata"], mapTypes: ["space"], tags: ["gelgoog", "highMobilityMs"] }),
    ms({ id: "johnnyHighMobilityGelgoog", name: "高機動型ゲルググ（ジョニー機）", faction: "zeon", cost: 325, armor: 355, energy: 120, agility: 32, mobility: 8, fixedWeaponIds: ["beamNaginata"], mapTypes: ["space"], tags: ["gelgoog", "highMobilityMs", "johnnyCustom"] })
  ]);

  addUnique(data.characters, [
    character({ id: "thomasOperator", name: "トーマス", faction: "federation", cost: 55, shooting: 10, melee: 4, reaction: 9, command: 6, support: 17, maintenance: 5, roles: ["operator", "pilot"] }),
    character({ id: "henkenBekkener", name: "ヘンケン・ベッケナー", faction: "federation", cost: 80, shooting: 8, melee: 6, reaction: 10, command: 16, support: 13, maintenance: 4, roles: ["captain", "commander", "pilot"] }),
    character({ id: "rob07", name: "ロブ", faction: "federation", cost: 50, shooting: 9, melee: 13, reaction: 10, command: 9, support: 7, maintenance: 3, roles: ["pilot", "commander"] }),
    character({ id: "sally07", name: "サリー", faction: "federation", cost: 50, shooting: 13, melee: 8, reaction: 9, command: 5, support: 10, maintenance: 3, specials: ["allyBackup"] }),
    character({ id: "mike07", name: "マイク", faction: "federation", cost: 50, shooting: 10, melee: 10, reaction: 14, command: 5, support: 7, maintenance: 3 }),
    character({ id: "geraldSakai", name: "ジェラルド・サカイ", faction: "zeon", cost: 90, shooting: 16, melee: 14, reaction: 17, command: 10, support: 9, maintenance: 8, roles: ["pilot", "mechanic"] }),
    character({ id: "thomasKurtz", name: "トーマス・クルツ", faction: "zeon", cost: 90, shooting: 12, melee: 18, reaction: 17, command: 9, support: 7, maintenance: 3 }),
    character({ id: "brenissOx", name: "ブレニフ・オグス", faction: "zeon", cost: 85, shooting: 21, melee: 2, reaction: 14, command: 7, support: 5, maintenance: 2 }),
    character({ id: "robertGilliam", name: "ロバート・ギリアム", faction: "zeon", cost: 85, shooting: 15, melee: 13, reaction: 20, command: 8, support: 7, maintenance: 3 }),
    character({ id: "gabbyHazard", name: "ギャビー・ハザード", faction: "zeon", cost: 80, shooting: 16, melee: 14, reaction: 18, command: 8, support: 6, maintenance: 2 }),
    character({ id: "royGreenwood", name: "ロイ・グリンウッド", faction: "zeon", cost: 75, shooting: 14, melee: 13, reaction: 15, command: 8, support: 8, maintenance: 3, specials: ["sandAmbush"] }),
    character({ id: "top08", name: "トップ", faction: "zeon", cost: 50, shooting: 13, melee: 13, reaction: 8, command: 11, support: 7, maintenance: 3, roles: ["pilot", "commander"] }),
    character({ id: "as08", name: "アス", faction: "zeon", cost: 35, shooting: 8, melee: 12, reaction: 8, command: 3, support: 4, maintenance: 2 }),
    character({ id: "dell08", name: "デル", faction: "zeon", cost: 35, shooting: 12, melee: 8, reaction: 8, command: 3, support: 6, maintenance: 2, specials: ["allyBackup"] }),
    character({ id: "boneAbust", name: "ボーン・アブスト", faction: "zeon", cost: 65, shooting: 13, melee: 7, reaction: 9, command: 15, support: 9, maintenance: 4, roles: ["captain", "pilot", "commander"], specials: ["stopMovement"] })
  ]);

  addUnique(data.options, [
    { id: "highPerformanceSightOption", name: "高性能照準器", cost: 45, effectType: "skill", grantsSkill: "highPerformanceSight", effectText: "距離4以上から射撃武器で攻撃する時、命中+8。", uniqueSkill: true, factions: ["federation", "zeon"], imagePath: "" },
    { id: "stopMovementOperation", name: "足止め作戦", cost: 50, effectType: "skill", grantsSkill: "stopMovement", effectText: "2マス以内にいる敵MSの移動力-1。重複しない。", uniqueSkill: true, factions: ["federation", "zeon"], imagePath: "" }
  ]);

  data.compatibility.characterMs.push(
    { characterId: "rob07", msTag: "groundGm", evasionBonus: 7 },
    { characterId: "rob07", msTag: "groundGundam", evasionBonus: 7 },
    { characterId: "sally07", msTag: "groundGm", evasionBonus: 7 },
    { characterId: "sally07", msTag: "groundGundam", evasionBonus: 7 },
    { characterId: "mike07", msTag: "groundGm", evasionBonus: 7 },
    { characterId: "mike07", msTag: "groundGundam", evasionBonus: 7 },
    { characterId: "geraldSakai", msTag: "rickDom", evasionBonus: 7 },
    { characterId: "geraldSakai", msTag: "gelgoog", evasionBonus: 8 },
    { characterId: "thomasKurtz", msTag: "gouf", evasionBonus: 8 },
    { characterId: "thomasKurtz", msTag: "gelgoog", evasionBonus: 8 },
    { characterId: "brenissOx", msTag: "rickDom", evasionBonus: 10 },
    { characterId: "robertGilliam", msTag: "highMobilityZaku", evasionBonus: 9 },
    { characterId: "gabbyHazard", msTag: "highMobilityZaku", evasionBonus: 9 },
    { characterId: "royGreenwood", msTag: "desert", evasionBonus: 9 },
    { characterId: "top08", msTag: "zaku1", evasionBonus: 8 },
    { characterId: "as08", msId: "zaku2", evasionBonus: 7 },
    { characterId: "dell08", msId: "zaku2", evasionBonus: 7 },
    { characterId: "boneAbust", msId: "magellaAttack", evasionBonus: 8 },
    { characterId: "johnnyRidden", msId: "johnnyHighMobilityGelgoog", evasionBonus: 12 }
  );

  data.compatibility.msWeapon.push(
    { msTag: "groundGm", weaponId: "federationMachineGun100mm", accuracyBonus: 7 },
    { msTag: "groundGm", weaponId: "cannon180mm", accuracyBonus: 8 },
    { msTag: "groundGm", weaponId: "missileLauncher", accuracyBonus: 7 },
    { msTag: "groundGundam", weaponId: "federationMachineGun100mm", accuracyBonus: 7 },
    { msTag: "groundGundam", weaponId: "cannon180mm", accuracyBonus: 8 },
    { msTag: "groundGundam", weaponId: "missileLauncher", accuracyBonus: 7 },
    { msId: "landCombatGm", weaponId: "railCannon", accuracyBonus: 9 },
    { msTag: "groundGm", weaponId: "rocketLauncher", accuracyBonus: 8 },
    { msTag: "groundGundam", weaponId: "rocketLauncher", accuracyBonus: 8 },
    { msTag: "gmSniper", weaponId: "longRangeBeamRifle", accuracyBonus: 10 },
    { msId: "zakuMarine", weaponId: "subrocGun", accuracyBonus: 10 },
    { msTag: "gouf", weaponId: "tripleGatlingGun", accuracyBonus: 8 },
    { msTag: "gouf", weaponId: "gatlingShield", accuracyBonus: 8 },
    { msId: "zaku1Sniper", weaponId: "beamSniperRifle", accuracyBonus: 10 }
  );

  const dialogue = (attack, hit, miss, move, wait, evade, damaged) => ({
    attack: attack.split("|"), hit: hit.split("|"), miss: miss.split("|"),
    move: move.split("|"), wait: wait.split("|"), evade: evade.split("|"), damaged: damaged.split("|")
  });
  data.dialogues = {
    ...(data.dialogues ?? {}),
    thomasOperator: dialogue(
      "目標データを送ります！|射線は通っています、今です！",
      "命中を確認しました！|観測結果、良好です！",
      "照準を修正します！|敵の進路を読み直します！",
      "通信範囲を保って移動します！|支援位置へ向かいます！",
      "索敵を続けます！|各機の状態を確認します！",
      "敵弾、外れました！|回避進路を送ります！",
      "損傷を確認、通信は維持します！|まだ支援できます！"
    ),
    henkenBekkener: dialogue(
      "全砲門、目標へ集中！|ここで敵の足を止めるぞ！",
      "よし、戦列を押し上げろ！|命中だ、次の目標へ！",
      "照準を直せ、焦るな！|次弾で仕留める！",
      "艦隊を前へ出す！|支援しやすい位置を取るぞ！",
      "各員、警戒を続けろ！|味方の帰投路を守る！",
      "直撃は避けた！|艦の姿勢を維持しろ！",
      "被害を報告しろ！|まだ指揮は続けられる！"
    ),
    rob07: dialogue(
      "第07小隊の腕を見せてやる！|第08小隊に先を越されるな！",
      "どうだ、こっちが第07小隊だ！|甘ちゃんどもには任せておけん！",
      "ちっ、今のは見なかったことにしろ！|サンダースなら当てたってか？次だ！",
      "俺たちが先に出るぞ！|第07小隊、さっさとついて来い！",
      "あいつらにでかい顔をさせるな！|次の獲物は俺たちがもらう！",
      "小隊長を甘く見るなよ！|死神のジンクスなんぞ要らん！",
      "格好悪いところを見せるな！|まだ第08小隊に負けたわけじゃない！"
    ),
    sally07: dialogue(
      "索敵だけが仕事じゃないのよ！|第07小隊を甘く見ないで！",
      "ほら、こっちの方が先だったでしょ！|援護成功、文句はないわね！",
      "今のは調子が悪かっただけ！|次は嫌味を言わせないわよ！",
      "敵影は私が見つける！|先にいい場所を取るわよ！",
      "第08小隊より先に見つけるわ！|ロブ、敵影はまだよ！",
      "そんな狙いじゃ当たらないわ！|こっちだって修羅場は踏んでるの！",
      "まだ索敵は続けられる！|この程度で引っ込めないわよ！"
    ),
    mike07: dialogue(
      "第07小隊に喧嘩を売ったな！|まとめて相手してやるぜ！",
      "へっ、口だけじゃないだろ！|第08小隊より先に一機だ！",
      "ちっ、避けやがった！|今のは服装のせいじゃないぜ！",
      "俺が先回りする！|のんびりした連中は置いてくぜ！",
      "次は誰に絡んでやるかな！|獲物が来るまで待ってやる！",
      "そんな弾に当たるほど鈍くないぜ！|俺を捕まえるには遅すぎる！",
      "やりやがったな！|まだ殴り合いの方が楽だぜ！"
    ),
    geraldSakai: dialogue(
      "機体の癖は把握している！|キマイラ隊の腕を見せる！",
      "調整通りの結果だ！|よし、狙いは正確だ！",
      "補正が足りなかったか！|次で修正する！",
      "機体に無理をさせず進む！|攻撃位置を取り直す！",
      "各部の状態を確認する！|好機まで出力を保つ！",
      "この反応なら避けられる！|照準の癖は読めた！",
      "損傷箇所を把握した！|まだ性能は引き出せる！"
    ),
    thomasKurtz: dialogue(
      "接近戦で決める！|この間合いなら負けん！",
      "手応えありだ！|次も一気に斬り込む！",
      "踏み込みが浅いか！|次は逃がさん！",
      "懐へ飛び込む！|格闘戦の距離へ！",
      "間合いに入るのを待つ！|焦らず好機を狙う！",
      "その攻めでは届かん！|動きは見切った！",
      "まだ腕は鈍っていない！|この程度で止まるか！"
    ),
    brenissOx: dialogue(
      "射線に入ったな、撃つ！|距離を保って仕留める！",
      "狙撃は正確でなくてはな！|次の標的へ移る！",
      "わずかにずれたか！|照準を再計算する！",
      "射撃位置を変える！|敵の射程外へ回る！",
      "無駄弾は使わん！|確実な一射を待つ！",
      "その弾道は読めている！|射撃戦の間合いだ！",
      "被弾したか、距離を取る！|まだ照準器は生きている！"
    ),
    robertGilliam: dialogue(
      "この速度なら先を取れる！|一気に攻め込む！",
      "よし、機動に乗った！|狙い通りだ！",
      "速すぎて流れたか！|次は軌道を絞る！",
      "最大推力で回り込む！|敵の側面を取る！",
      "推進系を整える！|次の加速に備える！",
      "その照準では追いつけん！|機動力の差だ！",
      "まだ推力は落ちていない！|損傷しても止まらん！"
    ),
    gabbyHazard: dialogue(
      "先手を取らせてもらう！|高速戦闘を始める！",
      "遅いな、次へ行く！|このまま畳みかける！",
      "避けたか、面白い！|次は速度を上げる！",
      "一気に距離を詰める！|後ろを取るぞ！",
      "焦らず機を待つ！|推進剤を温存する！",
      "その程度では捕まらん！|狙いが遅い！",
      "やるな、だがまだ速い！|この程度で失速はしない！"
    ),
    royGreenwood: dialogue(
      "砂塵に紛れて仕掛ける！|こちらの間合いへ誘い込んだ！",
      "砂漠ではこちらが上だ！|伏撃成功だ！",
      "砂に照準を乱されたか！|次は逃がさん！",
      "砂丘の陰へ回る！|地形を使って接近する！",
      "砂塵が濃くなるのを待つ！|姿を隠して好機を狙う！",
      "砂の中では捉えられまい！|その射線は読めている！",
      "砂を噛んだか、だが動ける！|まだ伏撃は終わっていない！"
    ),
    top08: dialogue(
      "無用な犠牲は出さない、狙いを定めろ！|アス、デル、私に続け！",
      "よし、これ以上は傷つけさせない！|退路を確保した、隊をまとめる！",
      "外したか、だが民間人を巻き込むな！|焦るな、もう一度狙う！",
      "話し合える余地は残しておけ！|二人とも、隊列を崩すな！",
      "命令なしに手を出すな！|ここは戦場でも、何をしてもいい場所ではない！",
      "隊長が先に倒れるものか！|その攻撃は見切った！",
      "くっ、二人は無事か！|まだ部下を連れて帰らねばならん！"
    ),
    as08: dialogue(
      "面倒だ、力ずくで片づける！|逆らう奴は叩き潰す！",
      "へっ、最初からこうすりゃいいんだ！|俺に任せりゃ早いんだよ！",
      "ちっ、逃げ回りやがって！|次は容赦しねえ！",
      "俺が先に行く、止めるな！|隊長は慎重すぎるんだよ！",
      "いつまで待たせる気だ！|話し合いなんぞ時間の無駄だ！",
      "そんな弾に当たるかよ！|俺を止められると思うな！",
      "くそっ、俺に傷をつけやがったな！|このままじゃ済まさねえ！"
    ),
    dell08: dialogue(
      "援護する、無茶はするな！|子供たちを怖がらせるなよ！",
      "よし、これで前へ出られる！|援護は成功だ、落ち着いて行け！",
      "外したか、巻き添えよりはましだ！|照準を直してもう一度だ！",
      "隊長の後ろを固める！|アス、勝手に先へ出るな！",
      "穏便に済むなら、それが一番だ！|周囲を警戒して待つ！",
      "危なかったな、まだ援護できる！|この程度なら落ち着いて避けられる！",
      "被弾したが、子供の前で倒れられるか！|隊長、まだ戦えます！"
    ),
    boneAbust: dialogue(
      "戦力差だけで勝てると思うな！|言葉も砲弾も、敵の迷いへ撃ち込め！",
      "よし、敵指揮官の足が止まった！|少数でも戦い方はある！",
      "読まれたか、ならば次の手だ！|砲撃点を変えて揺さぶれ！",
      "塹壕へ移れ、数を悟らせるな！|撤退時間を一分でも稼ぐ！",
      "情けを受けた借りは戦場で返す！|敵指揮官がどう出るか見せてもらおう！",
      "その程度の揺さぶりでは崩れん！|狙いは読めている、焦るな！",
      "感謝と屈辱は別物だ！|まだ兵たちを逃がす時間は残っている！"
    )
  };
  const externalGeneratorOption = data.options.find((option) => option.id === "externalGenerator");
  if (externalGeneratorOption) externalGeneratorOption.effectText = "機体EN+25。";
})();
