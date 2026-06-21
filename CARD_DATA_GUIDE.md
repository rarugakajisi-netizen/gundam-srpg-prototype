# カード・ステージ追加ガイド

このゲームは、基本的に `data/game-data.js` を増やすだけでカードやステージを追加できる形に寄せています。

## 追加する時の基本手順

1. `data/game-data.js` にカードを追加する。
2. 必要なら `campaign.stages` の報酬に追加する。
3. 必要なら `enemyFormations` に敵編成を追加する。
4. `node work/check-gundam-prototype.js` でデータミスを確認する。
5. `node work/card-balance-report.js` でカード枚数、コスト帯、ステージ敵総コストを確認する。
6. `node work/sync-game-data-json.js` で参考用JSONを同期する。

## 機体カード

`mobileSuits` に追加します。

- `weaponSlots`: 手持ち武器をいくつ装備できるか。
- `optionSlots`: オプションパーツをいくつ装備できるか。現在の編成UIは1枠まで対応です。
- `fixedWeaponIds`: バルカン、サーベル、内蔵キャノンなど、機体に固定された武装。
- `equipCategories`: 手持ち武器として装備できるカテゴリ。
- `mapTypes`: `ground` と `space` の出撃可否。コロニーマップは内部的に地上/宇宙どちらも出撃できます。
- `movementType`: `normal` または `flying`。飛行は地上の地形ペナルティを無視します。
- `terrainSuitability`: 水中、森林、砂漠、デブリ帯への適性。
- `specials`: 機体が最初から持つスキル。

設計ルール:

- 環境対応はスキルではなく `mapTypes` / `movementType` / `terrainSuitability` で表現します。
- 速さはスキルではなく `mobility`（移動マス）と `agility`（運動性）で表現します。
- 砂漠用、宇宙用、水中用などの派生機は、専用スキルではなく該当地形の `terrainSuitability` を `true` にして差別化します。

## 武器カード

`weapons` に追加します。

- `kind`: `beam`、`ammo`、`melee`、`shield`。
- `attackType`: `shooting` または `melee`。
- `minRange` と `range`: 例として `minRange: 3, range: 6` なら近距離には撃てない長射程武器。
- `factions`: 使用できる勢力。
- `ignoresObstacles`: `true` なら障害物越しに攻撃できます。
- `cannotTargetFlying`: `true` なら飛行ユニットに当てられません。
- `slotCost`: 手持ち装備枠の消費量。省略時は1。180mmキャノンやマゼラ・トップ砲のような両手武器は `slotCost: 2` にします。`fixedOnly` 武器は装備枠を消費しません。

## キャラクターカード

`characters` に追加します。

- `characterKey`: 同一人物判定に使います。同名別性能カードも同じ `characterKey` にします。
- `roles`: 得意役割です。現在は表示用で、MSにも戦艦にも自由に乗せられます。
- `specials`: キャラが持つスキル。

## オプションカード

`options` に追加します。

- `grantsSkill`: 装備した機体に与えるスキルID。
- `effectText`: プレイヤーに見せる効果説明。
- `factions`: 使用できる勢力。
- `effectType: "mobility"` のような直接効果オプションは `grantsSkill` を使わず、`value` で数値を指定します。

現在実装済みの主なスキル:

- `spareMagazine`: 実弾最大弾数+2。
- `externalGenerator`: EN+25、射撃ビーム武器の装備条件を一部補助。
- `optionArmor`: 実弾被ダメージ-15。
- `antiBeamCoating`: ビーム被ダメージ-15。
- `impactDiffusionArmor`: 格闘被ダメージ-15。
- `longRangeScope`: 射撃武器の最大射程+1。
- `guerrillaTactics`: 近づかれるまで射撃対象にならない。
- `aiSenshi`: 味方MS撃墜後に与ダメージ上昇、被ダメージ減少。
- `barrageSupport`: 近くの敵へ命中補助。

## ステージ

`campaign.stages` に追加します。

- `mapId`: 使用するマップ。
- `summary`: ステージ選択で見せる説明。
- `enemyFormations`: 敵勢力ごとの編成。
- `enemyBattleshipId`: 敵戦艦を固定したい時に指定します。`null` にすると敵戦艦なしステージになります。
- `costCap`: 指定すれば、そのステージだけ出撃上限を固定できます。未指定なら敵総コストの少し上で自動計算されます。
- `dropRewards`: 個別ドロップ候補です。現状は全マップ共通ドロップを主に使っています。

敵編成の例:

```js
enemyFormations: {
  zeon: [
    { msId: "zaku2", characterIds: ["gene"], weaponIds: ["zakuMachineGun"], optionIds: [] }
  ],
  federation: [
    { msId: "gm", characterIds: ["hayato"], weaponIds: ["beamRifle"], optionIds: [] }
  ]
}
```

## まだ本格実装前の部分

- 画像とアイコンは仮表示です。
- 編成UIのオプション枠は現在1枠までです。
- 敵AIは期待ダメージ、旗艦優先、次の攻撃位置、補給位置をある程度見ますが、本格的な作戦AIではありません。
- スキルは実装済みIDだけ効果があります。新しいスキルIDを作る時は `main.js` 側にも処理を足します。
