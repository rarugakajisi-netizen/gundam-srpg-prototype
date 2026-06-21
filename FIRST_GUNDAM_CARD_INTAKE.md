# 初代アニメ系カード受け入れ台帳

初代アニメ周辺のカード案を増やすための作業台帳です。

ここは「正式データ」ではなく、追加前の下書き置き場です。  
カード案、簡単な原作設定、一言セリフ抜粋、性能方針をここに置いてから `data/game-data.js` へ移すと、あとで整理しやすくなります。

## 使い方

1. ユーザー案をこの台帳の該当欄へ貼る。
2. ID、勢力、役割、武器スロット、地形適性を仮決めする。原作上必要な場合だけ携行武器種別の禁止設定を加える。
3. 既存カードと比べてコスト帯を決める。
4. `data/game-data.js` へ正式実装する。
5. `node work/check-gundam-prototype.js` で検証する。
6. `node work/card-balance-report.js` で枚数とステージ上限を確認する。
7. `node work/sync-game-data-json.js` でJSONを同期する。

## ID命名ルール

- 機体: `zaku2`, `charZaku2S`, `guncannon` のように英数字camelCase。
- 武器: `zakuMachineGun`, `beamRifle`, `heatHawk`。
- キャラ: `amuro`, `bright`, `denim`。
- 同名別性能キャラ: `amuro0079Early` のようにカードIDを分け、`characterKey: "amuro"` は同じにする。
- オプション: `spareMagazine`, `optionArmor`。
- ステージ: `gundamRisesColony` のように内容が分かるIDにする。

## 性能メモ欄

| 項目 | メモ |
|---|---|
| 低コスト機 | 弱くても、安い・固定武装・地形適性・装備自由度で価値を出す |
| 高コスト機 | 強いが、撃墜時の損失と編成圧迫が大きい |
| 固定武装が多い機体 | 1ターン攻撃回数が増えるので本体コストに反映する |
| 手持ち武器0枠 | ボール、ガンタンクなど。固定武装と低コストで調整する |
| 地形対応 | スキルではなく `mapTypes` / `movementType` / `terrainSuitability` で表現する |
| 速さ | スキルではなく `mobility` と `agility` で表現する |

## 機体候補

網羅確定前の受け皿です。存在確認や採用可否は、ユーザー案をもらいながら埋めます。

| status | id案 | name | faction | 種別 | 役割案 | 地形/出撃 | 装備枠案 | メモ |
|---|---|---|---|---|---|---|---:|---|
| existing | gundam | ガンダム | federation | MS | 高性能万能機 | 地上/宇宙 | 2 | 現在は通常版。強化版は別カード予定 |
| existing | guncannon | ガンキャノン | federation | MS | 中距離支援 | 地上/宇宙 | 1 | 固定キャノンが主力 |
| existing | guntank | ガンタンク | federation | MS | 長射程砲撃 | 地上/宇宙 | 0 | 3-6射程の低反動キャノン |
| existing | gm | ジム | federation | MS | 標準量産機 | 地上/宇宙 | 2 | 初期量産機基準 |
| existing | coreFighter | コア・ファイター | federation | 航空/脱出機 | 低コスト飛行 | 地上/宇宙 | 0 | 脱出機能の復帰先 |
| existing | ball | ボール | federation | 作業ポッド | 低コスト宇宙支援 | 宇宙 | 0 | デブリ適性あり |
| existing | type61Tank | 61式戦車 | federation | 車両 | 地上低コスト砲撃 | 地上 | 0 | 地上専用候補 |
| existing | gFighter | Gファイター | federation | 支援機 | 飛行支援/合体素材候補 | 地上/宇宙 | 0 | 固定武装主体 |
| existing | coreBooster | コア・ブースター | federation | 支援機 | 高機動支援 | 地上/宇宙 | 0 | コア・ファイター派生 |
| existing | zaku1 | ザクI | zeon | MS | 低コスト旧式機 | 地上/宇宙 | 2 | 安さ枠 |
| existing | zaku2 | ザクII | zeon | MS | 標準量産機 | 地上/宇宙 | 2 | ジオン基準機 |
| existing | charZaku2S | ザクIIS型（シャア機） | zeon | MS | 高機動エース機 | 地上/宇宙 | 2 | 赤い機体タグあり |
| existing | gouf | グフ | zeon | MS | 地上格闘寄り | 地上 | 2 | ラル相性あり |
| existing | dom | ドム | zeon | MS | 地上重MS | 地上 | 2 | 速さは移動/運動で表現 |
| existing | rickDom | リック・ドム | zeon | MS | 宇宙重MS | 宇宙 | 2 | 宇宙用ドム |
| existing | gelgoog | ゲルググ | zeon | MS | 高性能量産機 | 地上/宇宙 | 2 | 後半高コスト |
| existing | acguy | アッガイ | zeon | 水陸両用MS | 水中/奇襲 | 地上 | 0 | ステルス持ち |
| existing | zgok | ズゴック | zeon | 水陸両用MS | 水中格闘 | 地上 | 0 | 水中適性あり |
| existing | gogg | ゴッグ | zeon | 水陸両用MS | 高耐久水中 | 地上 | 0 | 重装甲固定武装 |
| existing | charZgok | シャア専用ズゴック | zeon | 水陸両用MS | 高機動水中格闘 | 地上 | 0 | シャア相性あり |
| existing | zock | ゾック | zeon | 水陸両用MS | 高火力鈍足 | 地上 | 0 | 固定武装主体 |
| existing | gyan | ギャン | zeon | MS | 格闘/盾武器 | 地上/宇宙 | 1 | 盾ミサイル適性 |
| existing | zeong | ジオング | zeon | MA/MS | 高コスト宇宙NT機 | 宇宙 | 0 | 覚醒値/サイコミュ対応 |

## 戦艦候補

| status | id案 | name | faction | 役割案 | 出撃 | メモ |
|---|---|---|---|---|---|---|
| existing | gunperry | ガンペリー | federation | 初期補給艦 | 地上/宇宙 | 初期艦 |
| existing | salamis | サラミス | federation | 宇宙艦 | 宇宙 | 宇宙入門 |
| existing | whiteBase | ホワイトベース | federation | 高性能万能艦 | 地上/宇宙 | 高コスト |
| existing | fatUncle | ファット・アンクル | zeon | 初期補給艦 | 地上 | ジオン初期 |
| existing | musai | ムサイ | zeon | 宇宙艦 | 宇宙 | 宇宙入門 |
| existing | gau | ガウ | zeon | 地上大型艦 | 地上 | 地上敵艦 |
| existing | zanzibar | ザンジバル | zeon | 高性能万能艦 | 地上/宇宙 | 高コスト |

## 武器候補

| status | id案 | name | faction | category | kind | 射程案 | 役割メモ |
|---|---|---|---|---|---|---|---|
| existing | beamSaber | ビームサーベル | federation | melee | beam | 1 | 固定格闘 |
| existing | beamRifle | ビーム・ライフル | federation | beam-rifle | beam | 1-4 | 標準高火力ビーム |
| existing | beamSprayGun | ビーム・スプレーガン | federation | beam-rifle | beam | 1-3 | 量産機用 |
| existing | hyperBazooka | ハイパー・バズーカ | federation | bazooka | ammo | 2-3 | 近距離不可 |
| existing | zakuMachineGun | ザク・マシンガン | zeon | machine-gun | ammo | 1-3 | ジオン標準 |
| existing | zakuBazooka | ザク・バズーカ | zeon | bazooka | ammo | 2-3 | 近距離不可 |
| existing | cracker | クラッカー | zeon | grenade | ammo | 1-2 | 障害物無視 |
| backlog | gundamHammer | ガンダム・ハンマー | federation | melee | melee/ammo | 1-2 | 命中低め高威力候補 |
| backlog | beamJavelin | ビーム・ジャベリン | federation | melee | beam | 1-2 | 射程あり格闘候補 |
| backlog | fingerVulcan | フィンガーバルカン | zeon | machine-gun | ammo | 1-2 | グフ固定候補 |
| backlog | heatRod | ヒート・ロッド | zeon | melee | melee | 1-2 | グフ固定/命中補助候補 |
| backlog | missileShield | ミサイル・シールド | zeon | shield | shield/ammo | 1-2 | ギャン用候補 |

## キャラ候補

`characterKey` は同一人物制限に使うので、同名別性能カードでも同じキーにします。

| status | id案 | name | faction | characterKey | 役割案 | 設定メモ | 一言セリフ抜粋/口調メモ |
|---|---|---|---|---|---|---|---|
| existing | amuro | アムロ・レイ | federation | amuro | pilot | 主人公/高覚醒 | 冷静さと焦りが混じる |
| existing | bright | ブライト・ノア | federation | bright | captain | 艦長/指揮 | 号令調 |
| existing | mirai | ミライ・ヤシマ | federation | mirai | operator/captain | 操舵/支援 | 丁寧で落ち着く |
| existing | kai | カイ・シデン | federation | kai | pilot | 皮肉屋/射撃寄り | 軽口 |
| existing | hayato | ハヤト・コバヤシ | federation | hayato | pilot | 真面目/支援 | 努力家寄り |
| existing | sayla | セイラ・マス | federation | sayla | operator/pilot | 冷静/覚醒少し | きっぱり |
| existing | char | シャア・アズナブル | zeon | char | pilot/captain | エース/指揮 | 余裕のある言い回し |
| existing | ramba | ランバ・ラル | zeon | ramba | pilot/commander | ベテラン格闘 | 豪胆 |
| existing | denim | デニム | zeon | denim | pilot | 小隊長格 | 堅実 |
| existing | gene | ジーン | zeon | gene | pilot | 血気盛ん | 前のめり |
| existing | slender | スレンダー | zeon | slender | pilot | 慎重 | 距離を取る |
| backlog | ryu | リュウ・ホセイ | federation | ryu | pilot/commander | 兄貴分 | 面倒見がよい |
| backlog | sleggar | スレッガー・ロウ | federation | sleggar | pilot | 軽妙な実力者 | 軽口/余裕 |
| backlog | matilda | マチルダ・アジャン | federation | matilda | captain/mechanic | 補給/指揮 | 丁寧で芯が強い |
| backlog | garma | ガルマ・ザビ | zeon | garma | captain/commander | 若い指揮官 | 誇り高い |
| backlog | mquve | マ・クベ | zeon | mquve | captain/commander | 策謀/壺 | 上品で嫌味 |
| backlog | blackTriStars | 黒い三連星 | zeon | blackTriStars | pilot | チーム運用候補 | 連携重視 |

## オプション候補

| status | id案 | name | faction | effectType | 効果案 | 注意 |
|---|---|---|---|---|---|---|
| existing | spareMagazine | 予備弾倉 | both | ammo | 実弾最大弾数+2 | 実装済み |
| existing | externalGenerator | 外部ジェネレーター | both | energy | EN+25/一部ビーム装備補助 | 実装済み |
| existing | optionArmor | オプションアーマー | both | skill | 実弾被ダメ-15 | 実装済み |
| backlog | magneticCoating | マグネット・コーティング | federation | agility | 運動性上昇 | 強化版機体と役割被り注意 |
| backlog | aquaticKit | 水中戦装備 | both | terrain | 水中ペナルティ軽減 | 水陸両用機の価値を消しすぎない |
| backlog | propellantTank | 推進剤タンク | both | mobility/energy | 移動 or EN補助 | 速さスキル化は避ける |

## ステージ候補

| status | id案 | name | mapType | 敵勢力 | 敵戦艦 | 役割 |
|---|---|---|---|---|---|---|
| existing | gundamRisesColony | ガンダム大地に立つ | colony | zeon | なし | 導入 |
| existing | groundFront | 地上戦線 | ground | zeon | あり | 地上基本 |
| existing | spaceDebris | 宇宙宙域 | space | zeon | あり | 宇宙基本 |
| existing | jaburoDefense | ジャブロー防衛 | ground | zeon | なし | 水陸両用MSの見せ場 |
| backlog | solomon | ソロモン攻略 | space | zeon | あり | 宇宙大型戦 |
| backlog | aBaoaQu | ア・バオア・クー | space | zeon | あり | 終盤高難度 |

## 受け取り用メモ

ユーザーからカード案をもらったら、まずこの形で整理します。

```text
カード種別:
名前:
勢力:
原作の簡単な設定:
一言セリフ抜粋/口調:
ゲーム内の役割:
強くしたい点:
弱点にしたい点:
装備/固定武装:
地形/出撃:
備考:
```

## jissou2正式採用メモ

`jissou2.md` の案は正式採用候補として扱う。量が多いので、壊れにくくするために次の順で実装する。

1. 既存ルールで実装できる武器/OPを先に追加する。
2. 脱出機能、Iフィールド、盾攻撃など既にある仕組みに乗せられる機体を追加する。
3. ステルス、偵察、機雷、護衛、編成ボーナスなど専用処理が必要なスキルを実装してから、それを主軸にする機体/キャラを追加する。
4. キャラのセリフは、把握が怪しいキャラをユーザー確認リストに分け、情報をもらってから本調整する。

### 今回実装済み

- 武器の `slotCost` を追加。手持ち武器が1枠とは限らない前提にした。
- 180mmキャノン、マゼラ・トップ砲を2枠武器化。
- 追加武器: ガンダム・ハンマー、ハイパー・ハンマー、ハンド・グレネード、試作型ビーム・ライフル、ミサイル・ランチャー、シールド・ミサイル、シュツルム・ファウスト、ラケーテン・バズ、スパイク・シールド。
- 追加OP: ステルス機構、Iフィールド発生装置、護衛任務、量産機部隊の編成、高性能レーダー、強化弾頭、高出力ジェネレーター、高精度格闘プログラム。
- 追加スキル定義: ステルス、偵察、対水中、ビーム撹乱幕、命を賭して……、狼狽、チームワーク、護衛任務、量産機部隊の編成、強化弾頭、高出力ジェネレーター、高精度格闘プログラム、機雷散布。
- `serihu.md` 反映: テキサン・ディミトリー、ジャック・ベアード、アダム・スティングレイ、ウッディ、リード、ティアンム、リド・ウォルフ、クラウレ・ハモン、コンスコン、ガデム、アカハナ、フラナガン博士をキャラカード化。
- `serihu.md` 反映: 上記キャラとケルゲレン子の攻撃/命中/ミス/移動/待機/回避/被弾セリフを追加。
- スキル本実装追加: 命を賭して……、強化弾頭、高出力ジェネレーター、高精度格闘プログラム。
- スキル本実装追加: ステルス、偵察、対水中、ビーム撹乱幕、狼狽、チームワーク、護衛任務、量産機部隊の編成、機雷散布。
- 連邦航空/支援機第一弾を追加: コア・ブースター、Gファイター、トリアーエズ、TINコッド、セイバーフィッシュ、フライ・マンタ、デプ・ロッグ、ドン・エスカルゴ、ファンファン、ディッシュ、パブリク。
- 追加固定武装: 航空機関砲、小型ミサイル、対地爆弾、対潜ミサイル、Gファイター・ビームキャノン、メガ粒子砲、ビーム撹乱幕ロケット。
- ビーム撹乱幕の効果を命中低下からビーム武器威力低下へ変更。
- ジオン水陸両用MS第一弾を追加: ゴッグ、ズゴック、シャア専用ズゴック、アッガイ、ゾック。
- 追加固定武装: アイアン・ネイル、水陸両用メガ粒子砲、水中ミサイル、頭部バルカン砲、胸部メガ粒子砲、ゾック頭部メガ粒子砲。
- 追加ステージ: ジャブロー防衛。水中/森林/障害物を使う地上マップ、敵戦艦なし構成。
- `jissou2.md` 機体追加: ガンダム(MC)、Gブル、Gアーマー、プロトタイプガンダム、G-3ガンダム、ガンキャノン(SML)、ジム指揮官用、ジム・キャノン、ゲルググ(シャア機)、ギャン、アッザム、ビグロ、ザクレロ、ブラウ・ブロ、ビグ・ザム、エルメス、ジオング、ジオングヘッド、ドップ、ルッグン、ガトル、マゼラ・アタック、マゼラ・トップ。
- `jissou2.md` キャラ追加/調整: アムロ(覚醒)、リュウ、スレッガー、フラウ、テム、レビル、ワッケイン、ララァ、ギレン、キシリア、ドズル調整、ガルマ、マ・クベ、ガイア、マッシュ、オルテガ、シャリア・ブル。ゼナは削除。
- サイコミュ武器はニュータイプ専用スキルではなく、武器側の必要覚醒値で使用可否を表現する。
- テムの「ガンダムへの情熱」は、ターン終了時に隣接するガンダム系の装甲とENを少し回復する処理として実装。
- 相性タグを整理。コア・ファイター系、連邦航空機、ジオン航空機、Gパーツ系を分離し、脱出機能持ちは全機体で脱出先を明示。

### 次に実装する機体候補

- 連邦: `jissou2.md` の今回分は実装済み。次はユーザー追加案待ち。
- ジオン: `jissou2.md` の今回分は実装済み。次はユーザー追加案待ち。

### 次に実装するキャラ候補

- 連邦: `jissou2.md` と `serihu.md` の今回分は実装済み。次はユーザー追加案待ち。
- ジオン: `jissou2.md` と `serihu.md` の今回分は実装済み。次はユーザー追加案待ち。

### こちらの理解が薄いので情報が欲しいキャラ

`serihu.md` でいったん解消。今後、さらにマイナーなキャラや外伝キャラを追加する時は、同じように簡単な設定と一言セリフ素材をもらえると精度が上がる。
