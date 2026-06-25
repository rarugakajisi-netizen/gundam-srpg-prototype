(() => {
  const data = window.GAME_DATA;
  if (!data) throw new Error("game-data.js must be loaded before jissou5-data.js");

  const addUnique = (list, entries) => {
    const known = new Set(list.map((entry) => entry.id));
    entries.forEach((entry) => {
      if (!known.has(entry.id)) list.push(entry);
    });
  };
  const addCompatibilityUnique = (list, entries) => {
    const known = new Set(list.map((entry) => JSON.stringify(entry)));
    entries.forEach((entry) => {
      const key = JSON.stringify(entry);
      if (!known.has(key)) {
        list.push(entry);
        known.add(key);
      }
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
  const dialogue = (attack, hit, miss, move, wait, evade, damaged) => ({
    attack: attack.split("|"), hit: hit.split("|"), miss: miss.split("|"), move: move.split("|"),
    wait: wait.split("|"), evade: evade.split("|"), damaged: damaged.split("|")
  });

  addUnique(data.skills, [
    { id: "jinx", name: "ジンクス", type: "キャラ", timing: "常時", effect: "2マス以内にいる自分以外の味方MSの回避-6。", implemented: true },
    { id: "retreatSupport", name: "撤退支援", type: "キャラ", timing: "常時", effect: "このスキル持ちが自軍にいる間、装甲が最大値の3分の1以下の味方MSは回避+10。", implemented: true },
    { id: "madness", name: "狂気", type: "キャラ", timing: "攻撃時", effect: "同じターンに同じ敵を攻撃する場合、2回目以降の与ダメージ+15。", implemented: true }
  ]);

  addUnique(data.weapons, [
    weapon({ id: "massProductionGuntankGunLauncher", name: "ガン・ランチャー", power: 82, accuracy: 78, range: 3, minRange: 2, consume: 1, ammo: 6, category: "missile", fixedOnly: true, factions: ["federation"] }),
    weapon({ id: "hoverTruckMachineGun", name: "ホバー・トラック機関砲", power: 42, accuracy: 84, range: 2, consume: 1, ammo: 8, fixedOnly: true, factions: ["federation"] }),
    weapon({ id: "massProductionGuncannonCannon", name: "量産型240mmキャノン", power: 122, accuracy: 70, range: 5, minRange: 2, consume: 1, ammo: 6, category: "cannon", fixedOnly: true, ignoresObstacles: true, factions: ["federation"] }),
    weapon({ id: "groundGundamBeamRifle", name: "ビーム・ライフル（陸戦型ガンダム）", cost: 50, power: 125, accuracy: 77, range: 4, consume: 19, kind: "beam", category: "beam-rifle", factions: ["federation"] }),

    weapon({ id: "apsarasShockWave", name: "ミノフスキークラフト衝撃波", power: 92, accuracy: 76, range: 2, consume: 18, kind: "special", category: "special", fixedOnly: true, factions: ["zeon"] }),
    weapon({ id: "apsaras2MegaParticleCannon", name: "大型メガ粒子砲", power: 175, accuracy: 58, range: 6, minRange: 3, consume: 36, kind: "beam", category: "cannon", fixedOnly: true, ignoresObstacles: true, factions: ["zeon"] }),
    weapon({ id: "apsaras2ScatterMegaParticleCannon", name: "拡散メガ粒子砲", power: 132, accuracy: 72, range: 3, consume: 24, kind: "beam", category: "cannon", fixedOnly: true, factions: ["zeon"] }),
    weapon({ id: "apsaras3MegaParticleCannon", name: "大型メガ粒子砲（完成型）", power: 195, accuracy: 64, range: 7, minRange: 3, consume: 40, kind: "beam", category: "cannon", fixedOnly: true, ignoresObstacles: true, factions: ["zeon"] }),
    weapon({ id: "apsaras3ScatterMegaParticleCannon", name: "大型メガ粒子砲（拡散）", power: 152, accuracy: 76, range: 4, consume: 28, kind: "beam", category: "cannon", fixedOnly: true, factions: ["zeon"] }),
    weapon({ id: "actZakuDoubleHeatHawk", name: "専用ヒート・ホーク×2", power: 138, accuracy: 88, range: 1, kind: "free", category: "melee", attackType: "melee", fixedOnly: true, factions: ["zeon"] }),
    weapon({ id: "actZakuBeamRifle", name: "ビーム・ライフル（アクトザク）", cost: 45, power: 118, accuracy: 78, range: 4, consume: 17, kind: "beam", category: "beam-rifle", factions: ["zeon"] }),
    weapon({ id: "gigan180mmCannon", name: "180mm砲", power: 128, accuracy: 68, range: 5, minRange: 2, consume: 1, ammo: 6, category: "cannon", fixedOnly: true, ignoresObstacles: true, factions: ["zeon"] }),
    weapon({ id: "giganFourBarrelGun", name: "4連装砲", power: 72, accuracy: 82, range: 3, consume: 1, ammo: 8, fixedOnly: true, factions: ["zeon"] }),
    weapon({ id: "gasshaMissilePod", name: "ミサイル・ポッド", power: 92, accuracy: 74, range: 4, minRange: 2, consume: 1, ammo: 6, category: "missile", fixedOnly: true, factions: ["zeon"] }),
    weapon({ id: "specialHammerGun", name: "特殊ハンマー・ガン", cost: 45, power: 132, accuracy: 76, range: 3, kind: "melee", category: "hammer", attackType: "melee", ignoresObstacles: true, factions: ["zeon"] })
  ]);

  addUnique(data.mobileSuits, [
    ms({ id: "gundamEz8", name: "ガンダムEz-8", faction: "federation", cost: 245, armor: 365, energy: 100, agility: 22, mobility: 5, fixedWeaponIds: ["beamSaber", "chestVulcan"], mapTypes: ["ground"], tags: ["gundam", "groundGundam", "ez8"] }),
    ms({ id: "massProductionGuntank", name: "量産型ガンタンク", faction: "federation", cost: 155, armor: 340, energy: 55, agility: 6, mobility: 3, weaponSlots: 0, fixedWeaponIds: ["guntankLowRecoilCannon", "massProductionGuntankGunLauncher"], mapTypes: ["ground"], tags: ["guntank", "tank", "federationMassProduction"] }),
    ms({ id: "hoverTruck", name: "ホバー・トラック", faction: "federation", cost: 55, armor: 120, energy: 35, agility: 12, mobility: 5, weaponSlots: 0, fixedWeaponIds: ["hoverTruckMachineGun"], mapTypes: ["ground"], terrainSuitability: terrain({ forest: true }), tags: ["supportVehicle", "reconMs"], specials: ["recon"] }),
    ms({ id: "massProductionGuncannon", name: "量産型ガンキャノン", faction: "federation", cost: 180, armor: 320, energy: 75, agility: 10, mobility: 3, weaponSlots: 1, fixedWeaponIds: ["massProductionGuncannonCannon", "headVulcan"], tags: ["guncannon", "cannonMs", "federationMassProduction"] }),
    ms({ id: "massProductionGuncannonLydo", name: "量産型ガンキャノン（リド専用機）", faction: "federation", cost: 215, armor: 350, energy: 82, agility: 16, mobility: 4, weaponSlots: 1, fixedWeaponIds: ["massProductionGuncannonCannon", "headVulcan"], tags: ["guncannon", "cannonMs", "federationMassProduction", "lydoCustom"] }),
    ms({ id: "gmCannonAfrica", name: "ジム・キャノン（アフリカ戦線仕様）", faction: "federation", cost: 165, armor: 260, energy: 70, agility: 11, mobility: 3, fixedWeaponIds: ["gmCannonCannon", "headVulcan"], mapTypes: ["ground"], terrainSuitability: terrain({ desert: true }), tags: ["gm", "cannonMs", "federationMassProduction", "desert"] }),
    ms({ id: "gmSniper2", name: "ジム・スナイパーII", faction: "federation", cost: 255, armor: 310, energy: 110, agility: 28, mobility: 6, fixedWeaponIds: ["beamSaber"], tags: ["gm", "gmCommand", "gmSniper", "federationMassProduction"] }),
    ms({ id: "gmSniper2Lydo", name: "ジム・スナイパーII（リド専用機）", faction: "federation", cost: 290, armor: 350, energy: 115, agility: 30, mobility: 6, fixedWeaponIds: ["beamSaber"], tags: ["gm", "gmCommand", "gmSniper", "lydoCustom"] }),

    ms({ id: "goufFlightType", name: "グフ・フライトタイプ", faction: "zeon", cost: 230, armor: 325, energy: 85, agility: 25, mobility: 7, fixedWeaponIds: ["heatSword"], forbiddenWeaponKinds: ["beam"], mapTypes: ["ground"], movementType: "flying", tags: ["gouf", "flightMs"] }),
    ms({ id: "goufCustom", name: "グフ・カスタム", faction: "zeon", cost: 235, armor: 370, energy: 80, agility: 24, mobility: 5, fixedWeaponIds: ["heatSword", "heatRod"], forbiddenWeaponKinds: ["beam"], mapTypes: ["ground"], tags: ["gouf", "meleeMs"] }),
    ms({ id: "apsaras1", name: "アプサラスI", faction: "zeon", cost: 180, armor: 300, energy: 100, agility: 16, mobility: 5, weaponSlots: 0, fixedWeaponIds: ["apsarasShockWave"], mapTypes: ["ground"], movementType: "flying", tags: ["mobileArmor", "apsaras"] }),
    ms({ id: "apsaras2", name: "アプサラスII", faction: "zeon", cost: 340, armor: 520, energy: 150, agility: 14, mobility: 4, weaponSlots: 0, fixedWeaponIds: ["apsaras2MegaParticleCannon", "apsaras2ScatterMegaParticleCannon"], mapTypes: ["ground"], movementType: "flying", tags: ["mobileArmor", "heavyMa", "apsaras"] }),
    ms({ id: "apsaras3", name: "アプサラスIII", faction: "zeon", cost: 500, armor: 720, energy: 185, agility: 10, mobility: 3, weaponSlots: 0, fixedWeaponIds: ["apsaras3MegaParticleCannon", "apsaras3ScatterMegaParticleCannon"], mapTypes: ["ground"], movementType: "flying", tags: ["mobileArmor", "heavyMa", "apsaras"] }),
    ms({ id: "actZaku", name: "アクトザク", faction: "zeon", cost: 265, armor: 330, energy: 110, agility: 28, mobility: 6, fixedWeaponIds: ["actZakuDoubleHeatHawk"], tags: ["zaku", "actZaku", "highMobilityMs"] }),
    ms({ id: "gigan", name: "ギガン", faction: "zeon", cost: 155, armor: 340, energy: 65, agility: 9, mobility: 4, weaponSlots: 0, fixedWeaponIds: ["gigan180mmCannon", "giganFourBarrelGun"], tags: ["cannonMs", "tank", "zeonMassProduction"] }),
    ms({ id: "gassha", name: "ガッシャ", faction: "zeon", cost: 170, armor: 300, energy: 65, agility: 14, mobility: 4, weaponSlots: 1, fixedWeaponIds: ["ironNail", "gasshaMissilePod"], allowedWeaponIds: ["specialHammerGun"], mapTypes: ["space"], terrainSuitability: terrain({ debris: true }), tags: ["aquatic", "spaceMs"] })
  ]);

  addUnique(data.characters, [
    character({ id: "shiroAmada", name: "シロー・アマダ", faction: "federation", cost: 95, shooting: 16, melee: 16, reaction: 18, command: 13, support: 10, maintenance: 5, roles: ["pilot", "commander"], specials: ["teamwork"] }),
    character({ id: "karenJoshua", name: "カレン・ジョシュワ", faction: "federation", cost: 75, shooting: 14, melee: 17, reaction: 16, command: 8, support: 8, maintenance: 3 }),
    character({ id: "terrySandersJr", name: "テリー・サンダースJr.", faction: "federation", cost: 75, shooting: 16, melee: 14, reaction: 17, command: 8, support: 9, maintenance: 4, specials: ["jinx"] }),
    character({ id: "micheleNinorich", name: "ミケル・ニノリッチ", faction: "federation", cost: 25, shooting: 5, melee: 3, reaction: 7, command: 4, support: 8, maintenance: 2, roles: ["operator", "pilot"] }),
    character({ id: "eledoreMassis", name: "エレドア・マシス", faction: "federation", cost: 55, shooting: 7, melee: 4, reaction: 15, command: 6, support: 16, maintenance: 4, roles: ["operator", "pilot"] }),
    character({ id: "kojima08", name: "コジマ", faction: "federation", cost: 85, shooting: 6, melee: 4, reaction: 8, command: 17, support: 14, maintenance: 7, roles: ["captain", "commander"], specials: ["retreatSupport"] }),

    character({ id: "ainaSahalin", name: "アイナ・サハリン", faction: "zeon", cost: 85, shooting: 15, melee: 9, reaction: 17, command: 9, support: 10, maintenance: 8, roles: ["pilot", "mechanic"] }),
    character({ id: "ghiniusSahalin", name: "ギニアス・サハリン", faction: "zeon", cost: 95, shooting: 17, melee: 5, reaction: 11, command: 14, support: 8, maintenance: 18, roles: ["pilot", "mechanic", "commander"], specials: ["madness"] }),
    character({ id: "norrisPackard", name: "ノリス・パッカード", faction: "zeon", cost: 110, shooting: 16, melee: 21, reaction: 20, command: 13, support: 10, maintenance: 5, roles: ["pilot", "commander"], specials: ["sacrificialBoost"] }),
    character({ id: "yuriKellarny", name: "ユーリ・ケラーネ", faction: "zeon", cost: 100, shooting: 8, melee: 5, reaction: 10, command: 21, support: 16, maintenance: 8, roles: ["captain", "commander"], specials: ["retreatSupport"] }),
    character({ id: "cynthia08", name: "シンシア", faction: "zeon", cost: 65, shooting: 5, melee: 3, reaction: 9, command: 8, support: 14, maintenance: 13, roles: ["operator", "mechanic"] })
  ]);

  addCompatibilityUnique(data.compatibility.characterMs, [
    { characterId: "shiroAmada", msTag: "groundGundam", evasionBonus: 10 },
    { characterId: "karenJoshua", msTag: "groundGundam", evasionBonus: 8 },
    { characterId: "terrySandersJr", msTag: "groundGundam", evasionBonus: 8 },
    { characterId: "micheleNinorich", msId: "hoverTruck", evasionBonus: 6 },
    { characterId: "eledoreMassis", msId: "hoverTruck", evasionBonus: 8 },
    { characterId: "ainaSahalin", msTag: "apsaras", evasionBonus: 9 },
    { characterId: "ghiniusSahalin", msTag: "apsaras", evasionBonus: 7 },
    { characterId: "norrisPackard", msTag: "gouf", evasionBonus: 12 },
    { characterId: "lydoWolf", msId: "massProductionGuncannonLydo", evasionBonus: 12 },
    { characterId: "lydoWolf", msId: "gmSniper2Lydo", evasionBonus: 12 }
  ]);
  addCompatibilityUnique(data.compatibility.msWeapon, [
    { msTag: "groundGundam", weaponId: "groundGundamBeamRifle", accuracyBonus: 8 },
    { msTag: "gmSniper", weaponId: "longRangeBeamRifle", accuracyBonus: 10 },
    { msTag: "gmCommand", weaponId: "bullpupMachineGun", accuracyBonus: 7 },
    { msId: "actZaku", weaponId: "actZakuBeamRifle", accuracyBonus: 9 },
    { msId: "gassha", weaponId: "specialHammerGun", accuracyBonus: 10 }
  ]);

  data.dialogues = { ...(data.dialogues ?? {}),
    shiroAmada: dialogue("全員で仕掛ける、突出するな！|第08小隊、攻撃開始！", "よし、連携を崩すな！|このまま押し切る！", "焦るな、次は合わせる！|くそっ、狙いが甘かった！", "みんな、生きて帰るぞ！|俺が先に道を開く！", "周囲を警戒、無理はするな！|今は隊列を立て直す！", "仲間を置いて倒れられるか！|その動きなら読める！", "まだ動ける、諦めるな！|この程度で隊長が退けるか！"),
    karenJoshua: dialogue("ぼさっとしない、援護しな！|こいつは私が片づける！", "手間をかけさせるんじゃないよ！|次、さっさと行くよ！", "ちっ、次は外さないよ！|動き回るんじゃない！", "背中は任せたよ！|先にいい場所を取る！", "新人じゃないんだ、指示は分かってる！|周りをよく見な！", "そんな大振りが当たるかい！|甘く見られたもんだね！", "心配する暇があったら敵を見な！|まだ腕は動くよ！"),
    terrySandersJr: dialogue("狙いは確実に定める！|俺が引き受ける、下がれ！", "命中を確認、次へ移る！|まだジンクスは終わっていない！", "外したか……嫌な流れだ！|次弾で修正する！", "隊長、前へ出すぎです！|援護位置へ移動する！", "俺のそばは危険かもしれない……|それでも仲間を守る！", "死神はそう簡単には死なない！|この程度なら避けられる！", "また仲間を失うわけには……！|俺が引きつける、今のうちに！"),
    micheleNinorich: dialogue("ええい、当たってくれ！|僕だってやる時はやる！", "やった、当たったぞ！|見たか、僕にもできた！", "うそだろ、外れた！|照準がずれてるのか！？", "置いていかないでくださいよ！|急いで支援位置へ！", "敵影なし……たぶん！|通信と索敵を続けます！", "危なっ！　本当に撃ってきた！|今のは心臓に悪い！", "こんなの聞いてないですよ！|まだ通信は生きてます！"),
    eledoreMassis: dialogue("座標は出した、後は当てな！|耳障りな音を止めてやる！", "いい響きだ、命中だぜ！|索敵屋を甘く見るなよ！", "ちっ、リズムが狂った！|次はちゃんと合わせる！", "電波の通りがいい場所へ行く！|先に敵の音を拾うぞ！", "静かすぎる戦場は嫌いでね！|索敵は続けてる、焦るな！", "その音じゃ当たらないぜ！|来る方向は聞こえてた！", "機材は無事だ、まだ探れる！|くそっ、派手にやりやがる！"),
    kojima08: dialogue("全隊、無理に戦線を広げるな！|現場の判断を信じる、攻撃せよ！", "よし、撤収路を確保しろ！|敵の圧力を抑えたぞ！", "深追いはするな、立て直せ！|次の射撃に備えろ！", "負傷者の収容を優先する！|部隊を安全な位置へ移す！", "生きて戻ることも任務のうちだ！|各隊、損害を報告せよ！", "指揮所を甘く見るな！|被害は最小限に抑えた！", "まだ部下を帰していない！|ここで指揮を止めるわけにはいかん！"),
    ainaSahalin: dialogue("これ以上、戦いを広げないために！|私は私の意志で戦います！", "止められた……次の目標へ！|どうか、これで退いて！", "迷っている場合ではないのに……！|照準を立て直します！", "この機体なら道を開ける！|みんなを巻き込ませない！", "戦わずに済む道はないの……？|兄様の計画を確かめなくては！", "私はここで終われない！|その攻撃は見えています！", "まだアプサラスは動けます！|こんなことで意志を曲げはしない！"),
    ghiniusSahalin: dialogue("私の理想を阻む者は消えろ！|アプサラスの力を見せてやる！", "素晴らしい……これこそ完成形だ！|見たか、私の理論は正しい！", "計算が狂っただと……！？|次こそ完全に捉える！", "実験を次の段階へ移す！|邪魔者を射界へ収めろ！", "完成まで、誰にも止めさせん！|全てはアプサラスのためだ！", "凡俗の攻撃など届かん！|私の計画を侮ったな！", "機体を守れ、研究を失うな！|まだだ、完成は目前なのだ！"),
    norrisPackard: dialogue("アイナ様のため、道を開く！|敵の主力は私が引き受ける！", "一機……次の脅威を排除する！|役目はまだ終わっていない！", "見事だ、だが次は捉える！|焦りは禁物ということか！", "こちらへ注意を引きつける！|退路を確保する、続け！", "兵を帰すのが指揮官の務めだ！|好機を待つ、油断するな！", "その程度では止められん！|戦場の呼吸が乱れているぞ！", "まだ倒れるわけにはいかん！|この命、使う時は今ではない！"),
    yuriKellarny: dialogue("全部隊、撤収を援護せよ！|無益な戦闘を長引かせるな！", "よし、今のうちに負傷者を下げろ！|敵の進撃を止めたぞ！", "砲撃点を修正しろ！|慌てるな、次で当てればよい！", "民間人の避難路を空けろ！|部隊を後退させる、続け！", "兵を捨てる作戦など認めん！|生き残るための準備を急げ！", "この程度で司令部は崩れん！|敵も焦っているようだな！", "損害を確認、まだ指揮はできる！|ここを抜かせるわけにはいかん！"),
    cynthia08: dialogue("邪魔をするなら、こちらも撃ちます！|私だって戦場を渡ってきたの！", "損傷は軽微、大丈夫です。|やるべきことは分かっています。", "照準が乱れた……次で合わせます！|落ち着いて、状況を読み直すわ。", "通信線を確保します。ついてきて。|ユーリ様の部隊を孤立させません。", "貴方は私の趣味じゃないの。ごめんなさいね。|情報は渡せない。ここで食い止めます。", "その程度で崩れると思った？|尋問よりはずっと優しいわね。", "損傷は軽微……まだ大丈夫です。|何をすればいいか位わかる！")
  };
})();
