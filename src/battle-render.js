"use strict";

// Battle screen rendering and unit lookup helpers.


function buildEnemyFormation(faction) {
  return enemyFormationForCurrentBattle(state.selectedMapId, faction);
}

function renderBattle() {
  state.screen = "battle";
  checkOutcome();
  phaseLabel.textContent = phaseName();
  setupScreen.classList.add("hidden");
  battleScreen.classList.remove("hidden");

  const selected = state.units.find((unit) => unit.id === state.selectedUnitId && isAlive(unit));
  const target = state.units.find((unit) => unit.id === state.selectedTargetId && isAlive(unit));

  battleScreen.innerHTML = `
    <section class="board-wrap">
      <div class="battle-toolbar">
        <strong>${phaseName()} / ${selectedMap().name}</strong>
        <div>
          <button data-action="stage-select">ステージへ</button>
          <button data-action="back">編成へ戻る</button>
          ${state.phase === "deployment" && !state.outcome ? `<button class="primary-button" data-action="finish-deployment">配置完了</button>` : ""}
          <button class="primary-button" data-action="end-turn" ${state.phase !== "player" || state.outcome ? "disabled" : ""}>ターン終了</button>
        </div>
      </div>
      ${state.phase === "deployment" && !state.outcome ? `<div class="deployment-guide" role="status"><strong>出撃配置</strong><span>自軍を選び、手前${deploymentRows("player")}列の明るいマスへ移動。終わったら「配置完了」を押します。</span></div>` : ""}
      ${renderBattleRuleStatus()}
      ${state.outcome ? renderBattleResultPanel() : ""}
      <div class="board" style="--board-width: ${boardWidth()}; --board-height: ${boardHeight()};">
        ${renderCells(selected)}
      </div>
      ${renderBattleLogPanel()}
    </section>

    <aside class="side-panel">
      <section class="panel">
        <h2>選択中</h2>
        ${selected ? renderUnitDetail(selected, target) : `<p class="small">${state.phase === "enemy" ? "敵行動を進めると、行動中の敵が表示されます。" : "自軍ユニットを選んでください。"}</p>`}
      </section>
      ${target ? `<details class="panel target-panel compact-target-panel">
        <summary>${renderTargetSummary(target)}</summary>
        ${renderTargetDetail(target)}
      </details>` : ""}
    </aside>
  `;

}

function renderBattleRuleStatus() {
  const limit = stageTurnLimit();
  const survivalLimit = stageSurvivalTurnLimit();
  const reinforcements = stageEnemyReinforcements();
  const defenseTargets = state.units.filter((unit) => isDefenseTarget(unit));
  const destructionTargets = state.units.filter((unit) => isDestructionTarget(unit));
  const infiltrationTargets = stageInfiltrationTargets();
  const playerReachTargets = stagePlayerReachTargets();
  const initialMines = stageInitialMines();
  const inactiveEnemies = state.units.filter((unit) => unit.side === "enemy" && isCombatUnit(unit) && isAlive(unit) && Number.isFinite(unit.aiInactiveUntilTurn) && state.turnNumber < unit.aiInactiveUntilTurn);
  if ((limit === null && survivalLimit === null && !reinforcements && defenseTargets.length === 0 && destructionTargets.length === 0 && infiltrationTargets.length === 0 && playerReachTargets.length === 0 && initialMines.length === 0 && inactiveEnemies.length === 0) || state.outcome) return "";
  const remaining = Math.max(0, limit - state.turnNumber + 1);
  const survivalRemaining = Math.max(0, survivalLimit - state.turnNumber + 1);
  const aliveDefenseTargets = defenseTargets.filter((unit) => isAlive(unit)).length;
  const aliveDestructionTargets = destructionTargets.filter((unit) => isAlive(unit)).length;
  const randomDestructionTargetGoal = stageRandomDestructionTargetGoal();
  const destroyedRealDestructionTargets = destructionTargets.filter((unit) => unit.isRealObjective && !isAlive(unit)).length;
  return `
    <section class="panel deployment-panel">
      <div>
        <h2>特殊ルール</h2>
        ${limit !== null ? `<p class="small">${destructionTargets.length > 0 ? "時間制限: 期限までにすべての破壊目標を撃破" : "時間稼ぎ: 期限までに敵を撃破"}してください。第${limit}ターン終了が期限です。現在${state.turnNumber}ターン目 / 残り${remaining}ターン。</p>` : ""}
        ${survivalLimit !== null ? `<p class="small">生存戦: 第${survivalLimit}ターン終了まで生き延びると勝利です。現在${state.turnNumber}ターン目 / 残り${survivalRemaining}ターン。</p>` : ""}
        ${reinforcements?.trigger === "enemyWipedOut"
          ? `<p class="small">増援: 初期配備の敵を全滅させると、新たな敵が出現します。</p>`
          : (reinforcements ? `<p class="small">増援: 条件ターン中、自軍ターン開始時に敵増援が出現します。</p>` : "")}
        ${defenseTargets.length > 0 ? `<p class="small">防衛対象: ${aliveDefenseTargets} / ${defenseTargets.length} 残存。${stageDefenseTargetsMustAllSurvive() ? "1つでも破壊されると敗北します。" : "すべて破壊されると敗北します。"}</p>` : ""}
        ${destructionTargets.length > 0 ? `<p class="small">${randomDestructionTargetGoal === null
          ? `破壊目標: ${aliveDestructionTargets} / ${destructionTargets.length} 残存。制限ターン内にすべて破壊してください。`
          : `破壊目標: 実目標 ${destroyedRealDestructionTargets} / ${randomDestructionTargetGoal} 基を破壊。未確認コンテナ ${aliveDestructionTargets} / ${destructionTargets.length} 基。`}</p>` : ""}
        ${infiltrationTargets.length > 0 ? `<p class="small">進入阻止: 敵機が赤枠の指定マスへ到達すると敗北します。味方ユニットで塞ぐことができます。</p>` : ""}
        ${playerReachTargets.length > 0 ? `<p class="small">到達目標: 自軍MSのいずれかが緑枠の指定マスへ到達すると勝利します。敵部隊を全滅させる必要はありません。</p>` : ""}
        ${initialMines.length > 0 ? `<p class="small">事前配置機雷: 戦場に機雷が${initialMines.length}個設置されています。踏むとダメージを受けるため、表示されたマスを避けて進んでください。</p>` : ""}
        ${inactiveEnemies.length > 0 ? `<p class="small">起動待機: ${inactiveEnemies.map((unit) => `${unitName(unit)}は第${unit.aiInactiveUntilTurn}ターンから行動`).join(" / ")}</p>` : ""}
      </div>
    </section>
  `;
}

function renderBattleResultPanel() {
  const victory = state.outcome === "勝利";
  return `
    <section class="result-panel ${victory ? "victory" : "defeat"}">
      <div>
        <p class="eyebrow">Result</p>
        <h2>${state.outcome}</h2>
        <p>${victory ? (isFreeBattle() ? "フリー対戦報酬としてカードを1枚獲得しました。" : "ステージ報酬を獲得しました。カード一覧と次のステージに反映されています。") : (state.outcomeMessage || "戦艦または全機を失いました。編成を見直して再挑戦できます。")}</p>
      </div>
      ${victory ? `<div class="reward-list result-rewards">
        ${state.resultRewards.map((reward) => renderResultRewardChip(reward)).join("") || `<span class="reward-chip owned">追加報酬なし</span>`}
      </div>` : ""}
      <div class="title-actions">
        ${victory && choiceTicketCount() > 0 && choiceCandidateEntries().length > 0 ? `<button class="primary-button" data-action="choice-card">カード引換へ</button>` : ""}
        <button class="primary-button" data-action="${isFreeBattle() ? "free-battle-select" : "stage-select"}">${isFreeBattle() ? "フリー対戦へ" : "ステージ選択へ"}</button>
        <button data-action="card-list">カード一覧</button>
      </div>
    </section>
  `;
}

function renderResultRewardChip(reward) {
  if (reward.type === "choiceTicket") {
    return `<span class="reward-chip">カード引換券 x${reward.count ?? 1} / 現在${choiceTicketCount()}枚</span>`;
  }
  const countText = isCountedCardType(reward.type)
    ? ` x${reward.count ?? 1} / 現在${cardCount(reward.type, reward.id)}枚`
    : reward.newlyOwned ? " 獲得" : " 獲得済み";
  const ownedClass = !isCountedCardType(reward.type) && !reward.newlyOwned ? "owned" : "";
  return `<span class="reward-chip ${ownedClass}">${cardTypeLabel(reward.type)}: ${reward.name}${countText}</span>`;
}

function renderBattleLogPanel() {
  const open = state.phase === "enemy" || Boolean(state.outcome);
  const latest = state.log.at(-1) ?? "戦闘開始後の行動がここに記録されます。";
  return `
    <details class="panel log-panel battle-log-panel" ${open ? "open" : ""}>
      <summary><strong>戦闘ログ</strong><span class="battle-log-latest">${latest}</span><span class="section-count">${state.log.length}件</span></summary>
      <div class="panel-heading battle-log-actions">
        ${state.phase === "enemy" && !state.outcome ? `<button class="primary-button compact-button" data-action="advance-enemy">敵行動を進める</button>` : ""}
      </div>
      ${state.phase === "enemy" && !state.outcome ? `<p class="small">ログを確認してから、ボタンで敵の次の行動へ進めます。</p>` : ""}
      <div class="log-list">
        ${state.log.slice(-12).reverse().map((item) => `<div class="log-item">${item}</div>`).join("")}
      </div>
    </details>
  `;
}

function renderCells(selected) {
  const activeAttacks = isCombatUnit(selected) ? usableAttackWeapons(selected) : [];
  const reachable = isMovableUnit(selected) && state.phase === "player" && selected.side === "player" && !selected.moved ? reachableCells(selected) : new Set();
  const deployable = state.phase === "deployment" && selected?.side === "player" ? deploymentCellsFor(selected) : new Set();
  const width = boardWidth();
  const height = boardHeight();
  return Array.from({ length: width * height }, (_, index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    const unit = state.units.find((candidate) => candidate.x === x && candidate.y === y && isAlive(candidate));
    const terrain = terrainAt(x, y);
    const infiltrationTarget = stageInfiltrationTargets().some((target) => target.x === x && target.y === y);
    const playerReachTarget = stagePlayerReachTargets().some((target) => target.x === x && target.y === y);
    const canMove = !state.outcome && !unit && reachable.has(positionKey(x, y));
    const canDeploy = !state.outcome && deployable.has(positionKey(x, y));
    const canTarget = !state.outcome
      && state.phase === "player"
      && isCombatUnit(selected)
      && isAttackTarget(unit)
      && unit.side !== selected.side
      && (activeAttacks.some((weapon) => weaponInRange(selected, unit, weapon)) || canDesignatePriorityTarget(selected, unit));
    const mine = state.mines?.find((item) => item.x === x && item.y === y);
    const classes = ["cell", `terrain-${terrain}`, infiltrationTarget ? "infiltration-target" : "", playerReachTarget ? "player-reach-target" : "", canMove ? "move-ok" : "", canDeploy ? "deploy-ok" : "", canTarget ? "target-ok" : ""].filter(Boolean).join(" ");
    return `<div class="${classes}" data-x="${x}" data-y="${y}" title="${terrainLabel(terrain)}">
      ${terrainShortLabel(terrain) ? `<span class="terrain-badge">${terrainShortLabel(terrain)}</span>` : ""}
      ${infiltrationTarget ? `<span class="terrain-badge infiltration-badge">阻止</span>` : ""}
      ${playerReachTarget ? `<span class="terrain-badge player-reach-badge">到達</span>` : ""}
      ${mine ? `<span class="terrain-badge mine-badge">機雷</span>` : ""}
      ${unit ? renderToken(unit) : ""}
    </div>`;
  }).join("");
}

function renderToken(unit) {
  const faction = unitFaction(unit);
  const hp = clamp((unit.armor / unit.maxArmor) * 100, 0, 100);
  const selected = unit.id === state.selectedUnitId ? "selected" : "";
  const battleship = isBattleship(unit) ? "battleship" : "";
  const defenseTarget = isDefenseTarget(unit) ? "defense-target" : "";
  const destructionTarget = isDestructionTarget(unit) ? "destruction-target" : "";
  const barricade = isBarricade(unit) ? "barricade" : "";
  const priorityTarget = isPriorityTarget(unit) ? "priority-target" : "";
  const displayName = concealedEnemyLabel(unit);
  const concealed = unitDetailsConcealedFromSide(unit, "player");
  const cardImage = concealed || (!isMobileSuit(unit) && !isBattleship(unit))
    ? ""
    : isBattleship(unit)
      ? renderCardImage("battleships", battleshipFor(unit), { size: "token", eager: true })
      : renderCardImage("mobileSuits", msFor(unit), { size: "token", eager: true });
  const numberBadge = isMobileSuit(unit) && Number.isInteger(unit.sortieNumber)
    ? `<span class="token-number">${unit.sortieNumber}</span>`
    : isDefenseTarget(unit) ? `<span class="token-number">守</span>`
    : isDestructionTarget(unit) ? `<span class="token-number">破</span>`
    : isBarricade(unit) ? `<span class="token-number">壁</span>`
    : "";
  return `
    <button class="token ${faction} ${unit.side} ${battleship} ${defenseTarget} ${destructionTarget} ${barricade} ${priorityTarget} ${selected}" data-unit-id="${unit.id}" title="${displayName}">
      ${cardImage}
      ${numberBadge}
      ${priorityTarget ? `<span class="token-priority-badge">優先</span>` : ""}
      <span class="token-name">${displayName}</span>
      <span class="hp-bar"><span class="hp-fill" style="width:${hp}%"></span></span>
    </button>
  `;
}

function renderBattleIdentity(title, entries) {
  return `
    <div class="battle-identity">
      ${renderCardImageGroup(entries, { size: "sm", eager: true })}
      <h3>${title}</h3>
    </div>
  `;
}

function concealedEnemyLabel(unit) {
  return unitDetailsConcealedFromSide(unit, "player") ? "???" : unitName(unit);
}

function renderTargetSummary(unit) {
  if (unitDetailsConcealedFromSide(unit, "player")) return "敵ユニット: ??? / 詳細不明";
  return `敵ユニット: ${unitName(unit)} / ${unit.armor} / ${unit.maxArmor}`;
}

function visibleTargetName(unit) {
  return concealedEnemyLabel(unit);
}

function renderConcealedEnemyDetail() {
  return `
    <h3>???</h3>
    <div class="stat-grid side-stat-grid">
      <div class="stat"><span>機体</span>確認不能</div>
      <div class="stat"><span>キャラ</span>確認不能</div>
      <div class="stat"><span>装備</span>確認不能</div>
      <div class="stat"><span>詳細能力</span>確認不能</div>
    </div>
    <p class="support-hint">隠密効果により、機体・キャラ・装備・詳細ステータスを確認できません。偵察持ちの味方や、効果ごとの看破条件を満たす味方がいれば確認できます。</p>
  `;
}

function renderUnitDetail(unit, target) {
  if (unitDetailsConcealedFromSide(unit, "player")) return renderConcealedEnemyDetail();
  if (isBarricade(unit)) return renderBarricadeDetail(unit);
  if (isDefenseTarget(unit) || isDestructionTarget(unit)) return renderDefenseTargetDetail(unit);
  if (isBattleship(unit)) return renderBattleshipDetail(unit, target);
  const ms = msFor(unit);
  const character = primaryCharacterFor(unit);
  const shield = activeShield(unit);
  return `
    ${renderBattleIdentity(`${unitName(unit)} / ${character.name}`, [
      { type: "mobileSuits", item: ms },
      { type: "characters", item: character }
    ])}
    <div class="stat-grid side-stat-grid">
      <div class="stat"><span>機番</span>${Number.isInteger(unit.sortieNumber) ? `${unit.sortieNumber}番機` : "なし"}</div>
      <div class="stat"><span>装甲</span>${unit.armor} / ${unit.maxArmor}</div>
      <div class="stat"><span>EN</span>${unit.energy} / ${unit.maxEnergy}</div>
      <div class="stat"><span>移動</span>${mobilityFor(unit)} / 基礎${ms.mobility}</div>
      <div class="stat"><span>回避補正</span>${evasion(unit)}</div>
      <div class="stat"><span>発動スキル</span>${activeSkillText(unit)}</div>
      <div class="stat"><span>地形</span>${terrainEffectText(unit)}</div>
    </div>
    <div class="side-brief">
      <span>${shield ? `盾: ${weaponFor(shield.id).name} ${shield.durability}` : "盾なし"}</span>
      <span>相性: ${unitCompatibilityText(unit)}</span>
    </div>
    ${state.phase === "deployment"
      ? `<p class="support-hint ready">配置フェイズ: 手前${deploymentRows("player")}列の明るいマスへ配置できます。</p>`
      : target ? `<p class="support-hint ready"><strong>攻撃対象:</strong> ${visibleTargetName(target)}</p>` : `<p class="support-hint">敵をクリックすると攻撃対象になります。</p>`}
    <div class="actions">
      ${freezyYardButton(unit)}
      ${mineScatterButtons(unit)}
      ${barricadePlacementButton(unit)}
      ${activeCamoButtons(unit)}
      ${smokeDischargerButtons(unit)}
      ${transformButtons(unit)}
      ${chargeWeaponButtons(unit)}
      ${additionalArmorButton(unit)}
      ${vehicleOptionButton(unit)}
      ${priorityTargetDesignationButton(unit, target)}
      ${emergencyRepairButton(unit)}
      ${attackButtons(unit, target)}
    </div>
    ${renderBattleshipSupportHint(unit)}
    <details class="side-collapse">
      <summary>機体・キャラ・装備詳細</summary>
      <div class="side-detail-stack">
        ${renderMobileSuitDetails(ms, { omitImage: true })}
        ${renderCharacterDetails(character, { omitImage: true })}
        ${renderOptionInventory(unit)}
        ${renderWeaponInventory(unit)}
      </div>
    </details>
  `;
}

function renderTargetDetail(unit) {
  if (unitDetailsConcealedFromSide(unit, "player")) return renderConcealedEnemyDetail();
  if (isDefenseTarget(unit) || isDestructionTarget(unit)) return renderDefenseTargetDetail(unit);
  if (isBattleship(unit)) return renderBattleshipTargetDetail(unit);
  const ms = msFor(unit);
  const character = primaryCharacterFor(unit);
  const shield = activeShield(unit);
  return `
    ${renderBattleIdentity(`${unitName(unit)} / ${character.name}`, [
      { type: "mobileSuits", item: ms },
      { type: "characters", item: character }
    ])}
    <div class="stat-grid side-stat-grid">
      <div class="stat"><span>機番</span>${Number.isInteger(unit.sortieNumber) ? `${unit.sortieNumber}番機` : "なし"}</div>
      <div class="stat"><span>装甲</span>${unit.armor} / ${unit.maxArmor}</div>
      <div class="stat"><span>EN</span>${unit.energy} / ${unit.maxEnergy}</div>
      <div class="stat"><span>移動</span>${mobilityFor(unit)} / 基礎${ms.mobility}</div>
      <div class="stat"><span>回避補正</span>${evasion(unit)}</div>
      <div class="stat"><span>発動スキル</span>${activeSkillText(unit)}</div>
      <div class="stat"><span>地形</span>${terrainEffectText(unit)}</div>
    </div>
    <div class="side-brief">
      <span>${shield ? `盾: ${weaponFor(shield.id).name} ${shield.durability}` : "盾なし"}</span>
      <span>相性: ${unitCompatibilityText(unit)}</span>
    </div>
    ${renderBattleshipSupportHint(unit)}
    <details class="side-collapse">
      <summary>敵の機体・キャラ・装備詳細</summary>
      <div class="side-detail-stack">
        ${renderMobileSuitDetails(ms, { omitImage: true })}
        ${renderCharacterDetails(character, { omitImage: true })}
        ${renderOptionInventory(unit)}
        ${renderWeaponInventory(unit)}
      </div>
    </details>
  `;
}

function renderBattleshipTargetDetail(unit) {
  const ship = battleshipFor(unit);
  const crew = battleshipCrew(unit);
  return `
    ${renderBattleIdentity(ship.name, [
      { type: "battleships", item: ship },
      { type: "characters", item: crew[0] }
    ])}
    <div class="stat-grid side-stat-grid">
      <div class="stat"><span>耐久</span>${unit.armor} / ${unit.maxArmor}</div>
      <div class="stat"><span>EN</span>${unit.energy} / ${unit.maxEnergy}</div>
      <div class="stat"><span>移動</span>${ship.mobility}</div>
      <div class="stat"><span>回避補正</span>${evasion(unit)}</div>
      <div class="stat"><span>発動スキル</span>${activeSkillText(unit)}</div>
      <div class="stat"><span>地形</span>${terrainEffectText(unit)}</div>
    </div>
    <div class="side-brief">
      <span>撃沈で勝利条件に直結</span>
      <span>艦長: ${crew[0]?.name ?? "未配置"} / 副長: ${crew[1]?.name ?? "未配置"}</span>
    </div>
    <details class="side-collapse">
      <summary>敵戦艦・武装詳細</summary>
      <div class="side-detail-stack">
        ${renderBattleshipDataDetails(ship, { omitImage: true })}
        ${renderWeaponInventory(unit)}
      </div>
    </details>
  `;
}

function renderBattleshipDetail(unit, target) {
  const ship = battleshipFor(unit);
  const support = supportForBattleship(unit);
  const crew = battleshipCrew(unit);
  return `
    ${renderBattleIdentity(ship.name, [
      { type: "battleships", item: ship },
      { type: "characters", item: crew[0] }
    ])}
    <div class="stat-grid side-stat-grid">
      <div class="stat"><span>耐久</span>${unit.armor} / ${unit.maxArmor}</div>
      <div class="stat"><span>EN</span>${unit.energy} / ${unit.maxEnergy}</div>
      <div class="stat"><span>移動</span>${ship.mobility}</div>
      <div class="stat"><span>回避補正</span>${evasion(unit)}</div>
      <div class="stat"><span>発動スキル</span>${activeSkillText(unit)}</div>
      <div class="stat"><span>地形</span>${terrainEffectText(unit)}</div>
    </div>
    <div class="crew-list">
      ${["captain", "firstOfficer"].map((role, index) => {
        const member = crew[index];
        return `<div class="crew-chip"><span>${crewRoleLabel(role)}</span><strong>${member?.name ?? "未配置"}</strong></div>`;
      }).join("")}
    </div>
    <p class="small">撃沈されると、この陣営は即敗北します。隣接した味方機はターン終了時にEN+${support.energy}、実弾+${support.ammo}、装甲+${support.armor}、盾+${support.shield}を受けます。</p>
    ${state.phase === "deployment"
      ? `<p class="support-hint ready">配置フェイズ: 戦艦も手前${deploymentRows("player")}列の有効マスへ配置できます。</p>`
      : target ? `<p><strong>攻撃対象:</strong> ${visibleTargetName(target)}</p>` : ""}
    <div class="actions">
      ${priorityTargetDesignationButton(unit, target)}
      ${emergencyRepairButton(unit)}
      ${target ? attackButtons(unit, target) : ""}
    </div>
    <details class="side-collapse">
      <summary>戦艦・武装詳細</summary>
      <div class="side-detail-stack">
        ${renderBattleshipDataDetails(ship, { omitImage: true })}
        ${renderWeaponInventory(unit)}
      </div>
    </details>
  `;
}

function renderBattleshipSupportHint(unit) {
  const battleship = alliedBattleship(unit.side);
  if (!battleship || !isAlive(battleship)) return `<p class="small">戦艦支援: 戦艦なし</p>`;
  const adjacent = isAdjacent(unit, battleship);
  return `<p class="support-hint ${adjacent ? "ready" : ""}">戦艦支援: ${adjacent ? "ターン終了で補給・修理" : "戦艦に隣接すると補給・修理"}</p>`;
}

function attackButtons(attacker, target) {
  const attackableTarget = isAttackTarget(target);
  if (!attackWeapons(attacker).length) return `<p class="small">攻撃武装がありません。</p>`;
  if (!attackableTarget) return `<p class="small">敵を選ぶと、未使用の武器で攻撃できます。</p>`;
  return attackWeapons(attacker).map((weapon) => {
    const used = weaponUsed(attacker, weapon.id);
    const cannotTarget = weapon.cannotTargetFlying && isMobileSuit(target) && unitIsFlying(target);
    const concealed = weapon.attackType === "shooting" && unitIsConcealedFrom(target, attacker);
    const reachable = weaponReachableByRange(attacker, target, weapon);
    const blocked = reachable && weaponBlockedByObstacle(attacker, target, weapon);
    const inRange = reachable && !blocked;
    const charged = !weaponNeedsCharge(weapon) || weaponCharged(attacker, weapon);
    const usable = canPayCost(attacker, weapon);
    const compatibilityBonus = msWeaponBonus(attacker, weapon);
    const repeatPenalty = repeatAttackAccuracyPenalty(attacker);
    const status = [
      weaponStatus(attacker, weapon),
      unitWeaponRangeLabel(attacker, weapon),
      compatibilityBonus > 0 ? `相性+${compatibilityBonus}` : "",
      repeatPenalty > 0 ? `連続攻撃-${repeatPenalty}` : "",
      !charged ? "チャージ不足" : inRange ? `命中${hitRate(attacker, target, weapon)}%` : cannotTarget ? "飛行不可" : concealed ? "隠蔽" : blocked ? "障害物" : "射程外",
      used ? "使用済み" : ""
    ].filter(Boolean).join(" / ");
    return `
      <button data-action="attack" data-weapon-id="${weapon.id}" ${state.outcome || attacker.acted || used || !inRange || !usable || state.phase !== "player" ? "disabled" : ""}>
        ${weapon.name}<br><span class="button-detail">${status}</span>
      </button>
    `;
  }).join("");
}

function priorityTargetDesignationButton(unit, target) {
  if (!isCombatUnit(unit) || !unitHasSkill(unit, "priorityTargetDesignation")) return "";
  const usable = canDesignatePriorityTarget(unit, target);
  const targetText = target && target.side !== unit.side
    ? unitDetailsConcealedFromSide(target, unit.side) ? "対象不明" : unitName(target)
    : "可視敵を選択";
  const status = [
    `範囲${priorityTargetDesignationRange(unit)}`,
    `指揮${priorityTargetCommand(unit)}`,
    `命中+${PRIORITY_TARGET_ACCURACY_BONUS}`,
    targetText,
    unit.priorityTargetDesignationUsed ? "使用済み" : ""
  ].filter(Boolean).join(" / ");
  return `
    <button data-action="priority-target-designation" ${state.outcome || state.phase !== "player" || unit.side !== "player" || !usable ? "disabled" : ""}>
      優先目標指示<br><span class="button-detail">${status}</span>
    </button>
  `;
}

function emergencyRepairButton(unit) {
  if (!isCombatUnit(unit) || !unitHasSkill(unit, "emergencyRepair")) return "";
  const amount = emergencyRepairAmount(unit);
  const status = [
    `回復${amount}`,
    `整備${emergencyRepairMaintenance(unit)}`,
    "1戦闘1回",
    unit.emergencyRepairUsed ? "使用済み" : "",
    (unit.usedWeaponIds?.length ?? 0) > 0 ? "攻撃後不可" : "",
    unit.armor >= unit.maxArmor ? "装甲最大" : ""
  ].filter(Boolean).join(" / ");
  return `
    <button data-action="emergency-repair" ${state.outcome || state.phase !== "player" || unit.side !== "player" || !canUseEmergencyRepair(unit) ? "disabled" : ""}>
      緊急修理<br><span class="button-detail">${status}</span>
    </button>
  `;
}

function renderDefenseTargetDetail(unit) {
  const destruction = isDestructionTarget(unit);
  return `
    <h3>${unitName(unit)}</h3>
    <div class="stat-grid side-stat-grid">
      <div class="stat"><span>種別</span>${destruction ? "破壊目標" : "防衛対象"}</div>
      <div class="stat"><span>耐久</span>${unit.armor} / ${unit.maxArmor}</div>
      <div class="stat"><span>移動</span>${mobilityFor(unit)}</div>
      <div class="stat"><span>位置</span>${unit.x}, ${unit.y}</div>
      <div class="stat"><span>回避補正</span>0</div>
    </div>
    <p class="support-hint ready">${destruction
      ? (stageRandomDestructionTargetGoal() === null
        ? "制限ターン内にすべての破壊目標を撃破してください。護衛機を全滅させるだけでは勝利になりません。"
        : `このコンテナを破壊すると、重要物資の有無が判明します。実目標${stageRandomDestructionTargetGoal()}基を破壊してください。`)
      : `この対象を守ってください。${stageDefenseTargetsMustAllSurvive() ? "複数ある場合も、1つ破壊されると敗北します。" : "複数ある場合は、すべて破壊されると敗北します。"}移動${mobilityFor(unit)}の範囲で退避できます。`}</p>
  `;
}

function renderBarricadeDetail(unit) {
  return `
    <h3>${unitName(unit)}</h3>
    <div class="stat-grid side-stat-grid">
      <div class="stat"><span>種別</span>破壊可能な障害物</div>
      <div class="stat"><span>耐久</span>${unit.armor} / ${unit.maxArmor}</div>
      <div class="stat"><span>移動</span>0</div>
      <div class="stat"><span>位置</span>${unit.x}, ${unit.y}</div>
    </div>
    <p class="support-hint ready">このマスへの移動と、バリケード越しの通常射撃を遮ります。敵の攻撃で破壊できます。</p>
  `;
}

function chargeWeaponButtons(unit) {
  if (!isMobileSuit(unit)) return "";
  return attackWeapons(unit)
    .filter((weapon) => weaponNeedsCharge(weapon) && !weaponCharged(unit, weapon))
    .map((weapon) => {
      const usable = canChargeWeapon(unit, weapon);
      const status = [
        `EN${weaponChargeCost(weapon)}`,
        `チャージ${weaponChargeCount(unit, weapon)}/${weaponChargeRequired(weapon)}`,
        "行動終了",
        (unit.usedWeaponIds?.length ?? 0) > 0 ? "攻撃後不可" : "",
        unit.moved ? "移動後不可" : ""
      ].filter(Boolean).join(" / ");
      return `
        <button data-action="charge-weapon" data-weapon-id="${weapon.id}" ${state.outcome || state.phase !== "player" || unit.side !== "player" || !usable ? "disabled" : ""}>
          チャージ<br><span class="button-detail">${weapon.name} / ${status}</span>
        </button>
      `;
    }).join("");
}

function freezyYardButton(unit) {
  if (!isMobileSuit(unit) || !unitHasSkill(unit, "freezyYard")) return "";
  const activeTurns = unit.freezyYardActiveTurns ?? 0;
  const status = activeTurns > 0
    ? `効果中 / 残り${activeTurns}ターン / 実弾-${FREEZY_YARD_REDUCTION}`
    : `行動消費 / ${FREEZY_YARD_TURNS}ターン / 実弾-${FREEZY_YARD_REDUCTION}`;
  const disabled = state.outcome || state.phase !== "player" || unit.side !== "player" || !canActivateFreezyYard(unit);
  return `
    <button data-action="freezy-yard" ${disabled ? "disabled" : ""}>
      フリージーヤード<br><span class="button-detail">${status}</span>
    </button>
  `;
}

function mineScatterButtons(unit) {
  if (!isCombatUnit(unit)) return "";
  return unitWeaponObjects(unit)
    .filter((weapon) => weaponHasSkill(weapon, "mineScatter"))
    .map((weapon) => {
      const cells = mineScatterCells(unit);
      const usable = canUseMineScatter(unit, weapon);
      const status = [
        weaponStatus(unit, weapon),
        `設置${Math.min(3, cells.length)}個`,
        weaponUsed(unit, weapon.id) ? "使用済み" : ""
      ].filter(Boolean).join(" / ");
      return `
        <button data-action="mine-scatter" data-weapon-id="${weapon.id}" ${state.outcome || state.phase !== "player" || unit.side !== "player" || !usable ? "disabled" : ""}>
          機雷散布<br><span class="button-detail">${weapon.name} / ${status}</span>
        </button>
      `;
    }).join("");
}

function barricadePlacementButton(unit) {
  if (!isMobileSuit(unit) || !unitHasSkill(unit, "barricadePlacement")) return "";
  const cell = barricadeCellFor(unit);
  const usable = canDeployBarricade(unit);
  const status = [
    `前方${cell ? `(${cell.x},${cell.y})` : "1マス"}`,
    `耐久${BARRICADE_ARMOR}`,
    "行動終了",
    unit.barricadeUsed ? "使用済み" : "",
    !unit.barricadeUsed && !usable ? "設置先なし" : ""
  ].filter(Boolean).join(" / ");
  return `
    <button data-action="barricade-placement" ${state.outcome || state.phase !== "player" || unit.side !== "player" || !usable ? "disabled" : ""}>
      バリケード設置<br><span class="button-detail">${status}</span>
    </button>
  `;
}

function smokeDischargerButtons(unit) {
  if (!isMobileSuit(unit)) return "";
  const skillButton = unitHasSkill(unit, "smokeDischarger") ? `
    <button data-action="smoke-skill" ${state.outcome || state.phase !== "player" || unit.side !== "player" || unit.acted || unit.moved || unit.smokeSkillUsed ? "disabled" : ""}>
      スモーク<br><span class="button-detail">スキル / 射撃・詳細確認を防ぐ${unit.smokeSkillUsed ? " / 使用済み" : ""}</span>
    </button>
  ` : "";
  return skillButton;
}

function activeCamoButtons(unit) {
  if (!isMobileSuit(unit)) return "";
  return unitWeaponObjects(unit)
    .filter((weapon) => weaponHasSkill(weapon, "activeCamo"))
    .map((weapon) => {
      const usable = canUseActiveCamo(unit, weapon);
      const runtime = runtimeWeapon(unit, weapon.id);
      const status = [
        `残り${runtime.ammo}`,
        "行動終了",
        weaponUsed(unit, weapon.id) ? "使用済み" : "",
        unit.moved ? "移動後不可" : ""
      ].filter(Boolean).join(" / ");
      return `
        <button data-action="active-camo" data-weapon-id="${weapon.id}" ${state.outcome || state.phase !== "player" || unit.side !== "player" || !usable ? "disabled" : ""}>
          アクティブ・カモ<br><span class="button-detail">${weapon.name} / ${status}</span>
        </button>
      `;
    }).join("");
}

function transformButtons(unit) {
  if (!isMobileSuit(unit) || !unitHasSkill(unit, "transform")) return "";
  const targets = transformTargetMobileSuits(unit);
  if (targets.length === 0) return "";
  return targets.map((targetMs) => {
    const usable = canTransformToMs(unit, targetMs.id);
    const status = [
      "行動消費",
      "移動・攻撃不可",
      unit.moved ? "移動後不可" : "",
      unit.acted || (unit.usedWeaponIds?.length ?? 0) > 0 ? "攻撃後不可" : "",
      !cardCanStandAt(targetMs, unit.x, unit.y) ? "現在地では不可" : ""
    ].filter(Boolean).join(" / ");
    return `
      <button data-action="transform-ms" data-ms-id="${targetMs.id}" ${state.outcome || state.phase !== "player" || unit.side !== "player" || !usable ? "disabled" : ""}>
        変形<br><span class="button-detail">${targetMs.name} / ${status}</span>
      </button>
    `;
  }).join("");
}

function vehicleOptionButton(unit) {
  if (!isMobileSuit(unit)) return "";
  const vehicleOption = activeVehicleOption(unit);
  if (!vehicleOption) return "";
  const mobilityValue = vehicleOption.value ?? 0;
  const mobilityLabel = mobilityValue >= 0 ? `移動+${mobilityValue}` : `移動${mobilityValue}`;
  const airRequired = selectedMap().type === "air" && optionProvidesAirDeployment(vehicleOption) && !mobileSuitNativelyAirborne(msFor(unit));
  return `
    <button data-action="discard-vehicle" ${state.outcome || state.phase !== "player" || unit.side !== "player" || airRequired ? "disabled" : ""}>
      切り離し<br><span class="button-detail">${vehicleOption.name} / ${mobilityLabel}${vehicleOption.forbidsMelee ? " / 格闘不可" : ""}${airRequired ? " / 空中では解除不可" : ""}</span>
    </button>
  `;
}

function additionalArmorButton(unit) {
  if (!isMobileSuit(unit) || !unitHasSkill(unit, "additionalArmor")) return "";
  const targetMs = additionalArmorTargetMs(unit);
  if (!targetMs) return "";
  const usable = canPurgeAdditionalArmor(unit);
  const status = [
    targetMs.name,
    "行動消費なし",
    unit.additionalArmorPurged ? "使用済み" : "",
    !cardCanStandAt(targetMs, unit.x, unit.y) ? "現在地では不可" : ""
  ].filter(Boolean).join(" / ");
  return `
    <button data-action="purge-additional-armor" ${state.outcome || state.phase !== "player" || unit.side !== "player" || !usable ? "disabled" : ""}>
      パージ<br><span class="button-detail">${status}</span>
    </button>
  `;
}

function renderWeaponInventory(unit) {
  const rows = unit.weaponIds.map((id) => {
    const weapon = weaponFor(id);
    const used = weaponUsed(unit, id);
    return `
      <div class="weapon-row ${used ? "used" : ""}">
        <div>
          <strong>${weapon.name}</strong>
          ${renderWeaponDetails(weapon)}
        </div>
        <span>${weaponStatus(unit, weapon)} / ${unitWeaponRangeLabel(unit, weapon)}${used ? " / 使用済み" : ""}</span>
      </div>
    `;
  }).join("");
  return `<div class="weapon-inventory">${rows}</div>`;
}

function renderOptionInventory(unit) {
  if (!isMobileSuit(unit)) return "";
  const options = unitOptions(unit);
  if (options.length === 0) return `<p class="small">オプション: なし</p>`;
  return `<div class="weapon-inventory">${options.map((option) => `
    <div class="weapon-row">
      <div>
        <strong>${option.name}</strong>
        ${renderOptionDetails(option)}
      </div>
      <span>${optionEffectTypeLabel(option.effectType)}</span>
    </div>
  `).join("")}</div>`;
}

function msFor(unit) {
  return lookup().ms[unit.msId];
}

function primaryCharacterFor(unit) {
  const character = lookup().characters[unit.characterIds?.[0]] ?? NO_CHARACTER;
  return unit.side === "player" ? characterWithGrowth(character) : character;
}

function weaponFor(id) {
  return lookup().weapons[id];
}

function runtimeWeaponsForIds(weaponIds, optionIds = []) {
  const { weapons } = lookup();
  const runtimeIds = [...new Set(weaponIds.flatMap((id) => [id, ...(weapons[id]?.extraAttackIds ?? [])]))];
  return runtimeIds.map((id) => {
    const weapon = weapons[id];
    const maxAmmo = weapon.kind === "ammo" ? weapon.ammo + (optionIds.includes("spareMagazine") ? 2 : 0) : weapon.ammo;
    return {
      id,
      ammo: maxAmmo,
      maxAmmo,
      durability: weapon.durability
    };
  });
}

