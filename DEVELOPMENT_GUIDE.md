# 開発ガイド

このファイルは、Codex や開発者が作業前に参照するためのメモです。

プレイヤー向けの説明は [README.md](README.md) に集約しています。

## リポジトリの役割分担

- `index.html`: 画面の土台。
- `styles.css`: 画面レイアウトと見た目。
- `main.js`: 旧入口の案内だけを残したファイル。実装本体は `src/` 配下。
- `src/core.js`: 定数、状態、セーブ、所持カード、報酬、編成復元。
- `src/detail-renderers.js`: 共通ラベル、地形/射程/スキル判定、カード詳細表示。
- `src/setup-flow.js`: タイトル、ステージ選択、カード一覧、引換、編成画面、出撃開始。
- `src/battle-render.js`: 戦闘画面、盤面、ユニット詳細、武装/OP表示。
- `src/dialogue.js`: キャラクターの戦闘セリフデータ。
- `src/battle-rules.js`: 戦闘ルール、移動、攻撃、ターン処理、敵AI。
- `src/events.js`: 勝敗判定、UIイベントハンドラ、起動処理。
- `data/game-data.js`: `window.GAME_DATA` の器を作る入口ファイル。実データは下記の種類別ファイルで管理する。
- `data/system/campaign.js`: キャンペーン、初期コレクション、スターター編成、ステージ、全体ランダム報酬、勢力表示名。
- `data/rules/skills.js`: スキル定義。
- `data/rules/compatibility.js`: キャラと機体、機体と武器の相性ボーナス。
- `data/maps/maps.js`: マップ定義。
- `data/cards/mobile-suits.js`: 機体・MAカード。
- `data/cards/battleships.js`: 戦艦カード。
- `data/cards/weapons.js`: 武器カードと固定武装。
- `data/cards/characters.js`: キャラクターカード。
- `data/cards/options.js`: オプションカード。
- `assets/ms-token.svg`: マップ上の仮トークン画像。
- `package.json`: ローカル起動、データチェック、バランス診断の npm scripts。
- `work/check-game-data.js`: 最終状態のゲームデータ整合性チェック。参照切れや編成不能など、壊れているデータを失敗扱いにする。
- `work/card-balance-report.js`: カード枚数、コスト帯、ステージ敵総コストなどのバランス確認用スクリプト。強弱の再確認候補を出すための診断で、失敗判定用ではない。

## 作業時の基本方針

- プレイヤーに見える説明は `README.md`、開発判断やデータ仕様はこのファイルに書く。
- 実装済みの仕様と古い予定を混ぜない。未実装案は、必要最小限のバックログとして残す。
- データ追加は、`data/cards/`、`data/rules/`、`data/maps/`、`data/system/` の該当ファイルへ追加する。`data/game-data.js` は基本的に触らない。
- 新しいスキルIDや新しいルールを追加する場合は、`src/` 側の処理とカード詳細表示の説明も合わせて更新する。
- 画像やアイコンはまだ仮。数値、役割、操作性を優先する。
- 既存のユーザー変更がある前提で、無関係なファイルは触らない。

## 現在の主要システム

- カード収集型キャンペーン。
- ステージ選択、報酬、ドロップ、カード引換。
- 勢力ごとの編成。
- 前回編成の自動記憶。
- お気に入り編成20枠。
- 戦艦、艦長、副長、MS、武装、オプション、キャラクターの組み合わせ。
- 同一 `characterKey` のキャラクター重複禁止。
- 地上、宇宙、コロニー、水中、森林、砂漠、デブリ、障害物。
- 地形適性による移動・回避ペナルティ。
- 複数武器による連続攻撃と、MSの3回目以降の命中ペナルティ。
- 戦艦隣接による補給・修理。
- 敵AIの攻撃位置、旗艦優先、補給位置の簡易評価。
- ステルス、偵察、機雷、Iフィールド、チームワーク、教育型コンピューターなどの特殊効果。

## データ追加の基本手順

1. カードは `data/cards/`、スキルや相性は `data/rules/`、マップは `data/maps/`、ステージや報酬は `data/system/campaign.js` に追加する。
2. 必要なら `campaign.stages` の敵編成へ追加する。ステージ別ドロップは使わない。
3. 新しいスキルや特殊処理が必要な場合は、内容に応じて `src/detail-renderers.js`、`src/setup-flow.js`、`src/battle-rules.js`、`src/battle-render.js` へ実装する。
4. プレイヤー向けに説明が必要なルールなら `README.md` を更新する。
5. `npm run check` で、最終データとして壊れていないか確認する。
6. バランスを見る場合は `npm run report:balance` を実行する。

## カードデータの設計メモ

### 機体カード

`data/cards/mobile-suits.js` の `mobileSuits` に追加します。

- `cost`: 編成コスト。
- `armor`: 耐久力。
- `energy`: ビーム武器や特殊効果で使うEN。
- `agility`: 回避に関わる機体性能。
- `mobility`: 移動力。
- `fixedWeaponIds`: バルカン、サーベル、内蔵砲など、機体固定武装。
- `weaponSlots`: 手持ち武器の装備枠。
- `optionSlots`: オプションパーツの装備枠。現在の編成UIは主に1枠運用。
- `mapTypes`: `ground` / `space` の出撃可否。
- `movementType`: `normal`、`flying`、`submarine` など。
- `terrainSuitability`: 水中、森林、砂漠、デブリ帯への適性。
- `specials`: 機体が最初から持つスキルID。
- `forbiddenWeaponKinds`: 原作設定上どうしても必要な場合だけ指定する携行武器種別の禁止リスト。
- `allowedWeaponIds`: 特殊装備専用機など、極端な例外にだけ使う携行武器許可リスト。

設計上、環境対応はスキルではなく `mapTypes` / `movementType` / `terrainSuitability` で表現します。速さも専用スキルではなく、基本的には `mobility` と `agility` で表現します。

### 武器カード

`data/cards/weapons.js` の `weapons` に追加します。

- `kind`: `beam`、`ammo`、`melee`、`shield` など。
- `category`: 表示や分類用の武器カテゴリ。
- `attackType`: `shooting` または `melee`。
- `power`: 威力。
- `accuracy`: 命中補正。
- `minRange` / `range`: 最低射程と最大射程。
- `energyCost`: EN消費。
- `ammo`: 弾数。
- `factions`: 使用できる勢力。
- `slotCost`: 手持ち装備枠の消費量。省略時は1。
- `fixedOnly`: 固定武装専用なら `true`。
- `ignoresObstacles`: 障害物越しに攻撃できるなら `true`。
- `cannotTargetFlying`: 飛行ユニットを狙えないなら `true`。

固定武装が多い機体は攻撃回数が増えやすいため、機体コストや本体性能で調整します。

### 相性ボーナス

`data/rules/compatibility.js` に追加します。

- `characterMs`: キャラクターと機体の回避相性。
- `msWeapon`: 機体と武器の命中相性。
- `msWeapon` は、原則として `weaponId` で個別武器を指定します。
- `msTag + category` のように「機体系統が武器カテゴリ全体を得意」とする広域指定は、意図せず新武器すべてに相性が乗るため避けます。
- 武器側の性格として「この個別武器はジム系に合う」のようにしたい場合は、`msTag + weaponId` で書きます。

### キャラクターカード

`data/cards/characters.js` の `characters` に追加します。

- `characterKey`: 同一人物判定。同名別性能カードも同じキーにする。
- `roles`: 得意役割。表示用だが、プレイヤーの判断材料になる。
- `shooting` / `melee` / `reaction` / `awakening`: 主にMS搭乗時に使う。
- `command` / `support` / `maintenance`: 主に戦艦乗員時に使う。
- `specials`: キャラクターが持つスキルID。

キャラクターはMSにも戦艦にも配置可能です。ただし、配置先に合わない能力やスキルは機能しないことがあります。

### オプションカード

`data/cards/options.js` の `options` に追加します。

- `grantsSkill`: 装備した機体に与えるスキルID。
- `effectText`: プレイヤーに見せる効果説明。
- `factions`: 使用できる勢力。
- `effectType` / `value`: 移動力やENなどを直接補正する場合に使う。

オプションは、機体の個性を消す万能補助ではなく、弱点補助か方向性の強化に寄せます。

### ステージ

`data/system/campaign.js` の `campaign.stages` に追加します。

- `mapId`: 使用するマップ。
- `summary`: ステージ選択画面で見せる説明。
- `enemyFormations`: 敵勢力ごとの編成。
- `enemyBattleshipId`: 敵戦艦を固定したい時に指定する。`null` なら敵戦艦なし。
- `costCap`: ステージ固有の出撃上限。未指定なら敵総コストをもとに自動計算。
- 報酬はステージ別には持たせず、`campaign.commonDropRewards` による全体ランダムドロップを使います。
- `commonDropRewards.categoryWeights` は、まずどの種別を抽選するかの重みです。機体やキャラが増えても、戦艦など少数カテゴリがカード枚数差で埋もれないようにここで調整します。
- `commonDropRewards.ownershipBias` は、種別内での候補カード重みです。`newCard` は未所持、`ownedFew` は少数所持、`ownedMany` は上限に近い所持カードに使われます。
- 実際の抽選は「候補が残っている種別だけでカテゴリ抽選 → 種別内で未所持/低所持補正つき抽選」です。候補が尽きた種別の重みは自動的に他種別へ再配分されます。

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

## バランス調整の基準

- 原作再現よりも、SRPGとして役割が分かれることを優先する。
- 量産機にも、低コスト、地形適性、装備自由度、固定武装などで使い道を持たせる。
- 高コスト機は強くてよいが、撃墜時の損失と編成圧迫を大きくする。
- 武装の豊富さと、複数武装を撃ち分ける楽しさを残す。
- MSは1ターンに複数の武装を使用できるが、3回目以降は命中率を段階的に下げる。
- 戦艦は高耐久・低回避寄り。撃沈が敗北条件なので、単なる強ユニットにしすぎない。
- 航空機は低コストを維持しつつ、装甲、武器威力、移動力で抑える。
- Iフィールドなどの強力な防御性能は、EN消費や使用条件で制御する。
- オプションパーツは、機体固有の強みを奪いすぎない。

### 直近のバランス調整メモ

- カツ・レツ・キッカは万能防御寄りなので、コストではなく補正値を控えめにして調整する。
- ド・ダイYSは移動+2と追加ミサイルを持つ強い支援機材なので、ド・ダイIIより明確に高コストにする。
- 強行軍は全体与ダメージ上昇が強いため、コストよりも被ダメージ増加のデメリットを大きくして作戦カードらしくする。
- カムラン・ブルームは低HP時の全体移動支援として便利なので、採用し得になりすぎないよう微コスト増で調整する。

## 実装済みスキル・特殊効果の扱い

主な実装済み効果:

- 実弾弾数増加。
- EN増加。
- 実弾、ビーム、格闘の被ダメージ軽減。
- 射撃武器の射程増加。
- ステルス、ゲリラ戦術、偵察。
- Iフィールド。
- ビーム撹乱幕。
- 護衛任務。
- 量産機部隊の編成。
- チームワーク。
- 教育型コンピューター。
- 機雷散布。
- 特定タグや隣接条件による補助効果。

新しい `specials` や `grantsSkill` を追加するだけでは効果は発動しません。効果を持たせる場合は、`src/battle-rules.js` の戦闘・移動・AI評価、`src/battle-render.js` の戦闘表示、`src/detail-renderers.js` のカード詳細表示のどこに影響するかを確認して実装します。

## カード案を受け取る時のテンプレート

ユーザーから新カード案をもらったら、まず次の形に整理してから実装します。

```text
カード種別:
名前:
勢力:
原作の簡単な設定:
ゲーム内の役割:
強くしたい点:
弱点にしたい点:
装備/固定武装:
地形/出撃:
必要そうな特殊処理:
備考:
```

セリフや口調が必要なキャラクターは、公式文章を使用しつつ、長台詞は短い口調メモや言い回しの方向性として扱います。

## 確認方法

データや編成ルールを触った後は、まず最終データの整合性チェックを実行します。

```bash
npm run check
```

このチェックは、ブラウザで読み込まれる順序に合わせて次のデータを合成します。

1. `data/game-data.js`
2. `data/system/campaign.js`
3. `data/rules/skills.js`
4. `data/maps/maps.js`
5. `data/cards/mobile-suits.js`
6. `data/cards/battleships.js`
7. `data/cards/weapons.js`
8. `data/cards/characters.js`
9. `data/cards/options.js`
10. `data/rules/compatibility.js`

主に次の項目を確認します。

- 各カード、マップ、スキルのID重複。
- 機体、戦艦、武器、キャラクター、オプション、スキルの参照切れ。
- 初期コレクション、スターター編成、ステージ敵編成、全体報酬設定の参照切れ。
- 武器スロット、オプションスロット、装備可否、勢力不一致。
- ステージ上の敵編成がマップへ出撃可能か。
- マップの `width * height` と `terrain` 配列長の一致。
- compatibility 設定のキャラ、機体、タグ、武器、カテゴリ参照。

エラーがある場合は終了コード1で失敗します。警告だけの場合は通常成功します。警告も失敗扱いにしたい時は次を使います。

```bash
npm run check:data:strict
```

機械的に読みたい場合はJSON出力もできます。

```bash
npm run check:data -- --json
```

構造が通った後、バランスの再確認候補を見たい場合は次を実行します。

```bash
npm run report:balance
```

`card-balance-report.js` は、カード枚数、コスト帯、ステージ敵総コスト、ルール依存カードなどを確認するための静的診断です。強弱の候補を絞る用途なので、基本的にはエラー判定ではなくレビュー材料として扱います。

ブラウザ挙動を確認する時は、`index.html` を直接開くか、ローカルサーバーを起動して操作確認します。

## 直近で注意すること

- `README.md` とこのファイルで同じ説明を二重管理しない。
- 存在しない確認スクリプトへの記載を復活させない。
- `data/game-data.js` へ直接カード本体を戻さない。編集対象は種類別ファイルにする。
- 編成画面を触る場合は、前回編成の記憶とお気に入り編成20枠を壊していないか確認する。
- セーブデータ構造を変える場合は、既存ローカルストレージからの読み込み失敗を握りつぶせるようにする。
