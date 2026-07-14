"use strict";

// Outcome checks, UI event handlers, and application boot.

function awardBattleGrowthIfEligible() {
  if (!state.outcome || !state.battleGrowthEligible || state.battleGrowthAwarded) return;
  state.battleGrowthAwarded = true;
  const growthGains = recordCharacterSorties(state.battleGrowthCharacterIds);
  for (const gain of growthGains) {
    state.log.push(`${gain.character.name}の成長ポイント+${gain.points}。キャラ詳細から能力を強化できます。`);
  }
}

function checkOutcome() {
  if (state.outcome) return;
  const playerBattleshipAlive = state.units.some((unit) => unit.side === "player" && isBattleship(unit) && isAlive(unit));
  const enemyBattleshipExists = state.units.some((unit) => unit.side === "enemy" && isBattleship(unit));
  const enemyBattleshipAlive = state.units.some((unit) => unit.side === "enemy" && isBattleship(unit) && isAlive(unit));
  const playerAlive = state.units.some((unit) => unit.side === "player" && isMobileSuit(unit) && isAlive(unit));
  let enemyAlive = state.units.some((unit) => unit.side === "enemy" && isMobileSuit(unit) && isAlive(unit));
  if (playerBattleshipAlive && playerAlive && !enemyAlive) {
    spawnStageEnemyReinforcementsOnEnemyWipe();
    enemyAlive = state.units.some((unit) => unit.side === "enemy" && isMobileSuit(unit) && isAlive(unit));
  }
  const defenseTargets = state.units.filter((unit) => isDefenseTarget(unit));
  const defenseTargetsDestroyed = defenseTargets.length > 0 && defenseTargets.every((unit) => !isAlive(unit));
  const destructionTargets = state.units.filter((unit) => isDestructionTarget(unit));
  const destructionTargetsDestroyed = destructionTargets.length > 0 && destructionTargets.every((unit) => !isAlive(unit));
  const infiltrator = state.units.find((unit) => unitReachedInfiltrationTarget(unit));
  const survivalLimit = stageSurvivalTurnLimit();
  const survivalComplete = survivalLimit !== null && state.phase === "player" && state.turnNumber > survivalLimit;
  const reinforcementsPending = stageEnemyReinforcementsPending();

  if (!playerBattleshipAlive || !playerAlive) {
    state.outcome = "敗北";
    state.outcomeMessage = "戦艦または全機を失いました。編成を見直して再挑戦できます。";
    phaseLabel.textContent = state.outcome;
  } else if (defenseTargetsDestroyed) {
    state.outcome = "敗北";
    state.outcomeMessage = defenseTargets.length === 1
      ? "防衛対象が破壊されました。敵の攻撃から守り切ってください。"
      : "すべての防衛対象が破壊されました。最低1つは守り切ってください。";
    phaseLabel.textContent = state.outcome;
  } else if (infiltrator) {
    state.outcome = "敗北";
    state.outcomeMessage = `${unitName(infiltrator)}の基地侵入を許しました。指定された侵入阻止マスを塞いでください。`;
    phaseLabel.textContent = state.outcome;
  } else if (destructionTargetsDestroyed) {
    state.outcome = "勝利";
    state.outcomeMessage = "";
    state.resultRewards = isFreeBattle() ? claimFreeBattleRewards() : claimStageRewards(state.selectedMapId);
    phaseLabel.textContent = state.outcome;
  } else if (stageTurnLimit() !== null && state.phase === "player" && state.turnNumber > stageTurnLimit()) {
    state.outcome = "敗北";
    state.outcomeMessage = destructionTargets.length > 0
      ? `打ち上げ阻止に失敗しました。${stageTurnLimit()}ターン以内にすべての破壊目標を撃破してください。`
      : `敵の時間稼ぎを許しました。${stageTurnLimit()}ターン以内に敵を撃破してください。`;
    phaseLabel.textContent = state.outcome;
  } else if (survivalComplete) {
    state.outcome = "勝利";
    state.outcomeMessage = "";
    state.resultRewards = isFreeBattle() ? claimFreeBattleRewards() : claimStageRewards(state.selectedMapId);
    phaseLabel.textContent = state.outcome;
  } else if (destructionTargets.length === 0 && survivalLimit === null && !reinforcementsPending && ((enemyBattleshipExists && !enemyBattleshipAlive) || !enemyAlive)) {
    state.outcome = "勝利";
    state.outcomeMessage = "";
    state.resultRewards = isFreeBattle() ? claimFreeBattleRewards() : claimStageRewards(state.selectedMapId);
    phaseLabel.textContent = state.outcome;
  }
  awardBattleGrowthIfEligible();
}

function renderStageFilterScreen() {
  renderStageSelect();
}

setupScreen.addEventListener("change", (event) => {
  if (event.target.id === "favoriteFormationSlot") {
    state.selectedFavoriteSlot = clamp(Number(event.target.value) || 0, 0, FAVORITE_FORMATION_SLOTS - 1);
    renderSetup();
    return;
  }
  if (event.target.matches(".library-control")) {
    state.libraryFilter[event.target.dataset.filterKey] = event.target.value;
    renderCardList();
    return;
  }
  if (event.target.matches(".stage-control")) {
    state.stageFilter[event.target.dataset.filterKey] = event.target.value;
    renderStageFilterScreen();
    return;
  }
  if (event.target.matches(".free-battle-control")) {
    state.freeBattleFilter[event.target.dataset.filterKey] = event.target.value;
    renderFreeBattleSelect();
    return;
  }
  if (event.target.matches(".picker-control")) {
    state.pickerFilter[event.target.dataset.filterKey] = event.target.value;
    renderFormationPicker(state.picker.kind, state.picker.owner);
    return;
  }
  if (event.target.matches(".choice-control")) {
    state.choiceFilter[event.target.dataset.filterKey] = event.target.value;
    renderChoiceCardSelect();
    return;
  }
  if (event.target.dataset.bridgeSlot) {
    if (event.target.dataset.bridgeSlot === "captain") state.selectedCaptainId = event.target.value;
    if (event.target.dataset.bridgeSlot === "firstOfficer") state.selectedFirstOfficerId = event.target.value;
    if (event.target.value) clearCharacterConflicts(event.target.value, event.target.dataset.bridgeSlot);
    rememberFormation();
    renderSetup();
  }
  if (event.target.id === "battleshipSelect") {
    state.selectedBattleshipId = event.target.value;
    rememberFormation();
    renderSetup();
  }
  if (event.target.id === "mapSelect") {
    const nextMap = lookup().maps[event.target.value];
    if (isFreeBattle() && !freeBattleMapAvailable(nextMap)) {
      renderSetup();
      return;
    }
    state.selectedMapId = event.target.value;
    state.freeBattleEnemy = null;
    state.formation = [];
    const factionBattleship = state.data.battleships.find((item) => item.faction === state.faction && hasCard("battleships", item.id) && battleshipCanDeployOnMap(item, selectedMap()));
    state.selectedBattleshipId = factionBattleship?.id ?? "";
    const factionMs = state.data.mobileSuits.find((item) => item.faction === state.faction && hasCard("mobileSuits", item.id) && mobileSuitCanDeployOnMap(item, selectedMap()));
    if (factionMs) {
      state.selectedMsId = factionMs.id;
      state.selectedWeaponIds = defaultLoadout(factionMs);
    }
    if (!restoreRememberedFormation()) applyStarterFormation();
    renderSetup();
  }
  if (event.target.id === "msSelect") {
    state.selectedMsId = event.target.value;
    state.selectedWeaponIds = defaultLoadout(lookup().ms[state.selectedMsId]);
    renderSetup();
  }
  if (event.target.id === "characterSelect") {
    state.selectedCharacterId = event.target.value;
    if (event.target.value) clearCharacterConflicts(event.target.value, "mobileSuit");
    renderSetup();
  }
  if (event.target.id === "optionSelect") {
    state.selectedOptionId = event.target.value;
    renderSetup();
  }
  if (event.target.matches(".weapon-count-control")) {
    const ms = lookup().ms[state.selectedMsId];
    const weaponId = event.target.dataset.weaponId;
    const weapon = lookup().weapons[weaponId];
    if (!ms || !weapon) return;
    const currentCopies = selectedWeaponCopyCount(weaponId);
    const otherUsedSlots = selectedWeaponSlotCost(state.selectedWeaponIds) - currentCopies * weaponSlotCost(weapon);
    const maxBySlots = Math.max(0, Math.floor((weaponSlotCount(ms) - otherUsedSlots) / weaponSlotCost(weapon)));
    const desiredCopies = Math.min(
      Math.max(0, Number(event.target.value) || 0),
      remainingCardCopies("weapons", weaponId),
      maxBySlots
    );
    state.selectedWeaponIds = fitWeaponIdsToSlots(replaceSelectedWeaponCopies(state.selectedWeaponIds, weaponId, desiredCopies), ms);
    renderSetup();
  }
});

setupScreen.addEventListener("input", (event) => {
  if (event.target.matches(".library-control")) {
    const key = event.target.dataset.filterKey;
    state.libraryFilter[key] = event.target.value;
    renderCardList();
    focusFilterControl(".library-control", key, event.target.value);
  }
  if (event.target.matches(".stage-control")) {
    const key = event.target.dataset.filterKey;
    state.stageFilter[key] = event.target.value;
    renderStageFilterScreen();
    focusFilterControl(".stage-control", key, event.target.value);
  }
  if (event.target.matches(".free-battle-control")) {
    const key = event.target.dataset.filterKey;
    state.freeBattleFilter[key] = event.target.value;
    renderFreeBattleSelect();
    focusFilterControl(".free-battle-control", key, event.target.value);
  }
  if (event.target.matches(".picker-control")) {
    const key = event.target.dataset.filterKey;
    state.pickerFilter[key] = event.target.value;
    renderFormationPicker(state.picker.kind, state.picker.owner);
    focusFilterControl(".picker-control", key, event.target.value);
  }
  if (event.target.matches(".choice-control")) {
    const key = event.target.dataset.filterKey;
    state.choiceFilter[key] = event.target.value;
    renderChoiceCardSelect();
    focusFilterControl(".choice-control", key, event.target.value);
  }
});

setupScreen.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "title") renderTitle();
  if (action === "stage-select") renderStageSelect();
  if (action === "free-battle-select") renderFreeBattleSelect();
  if (action === "card-list") renderCardList();
  if (action === "choice-card") renderChoiceCardSelect();
  if (action === "toggle-card-reveal") {
    state.revealAllCards = !state.revealAllCards;
    renderCardList();
  }
  if (action === "library-type") {
    state.libraryFilter.type = button.dataset.type ?? "mobileSuits";
    renderCardList();
  }
  if (action === "reset-library-filter") {
    state.libraryFilter = { query: "", type: "mobileSuits", faction: "all", ownership: "owned", sort: "name" };
    renderCardList();
  }
  if (action === "reset-stage-filter") {
    state.stageFilter = { query: "", series: "all", status: "all", terrain: "all", enemyFaction: "all", sort: "story" };
    renderStageFilterScreen();
  }
  if (action === "select-stage-folder") {
    state.stageFilter.series = button.dataset.series ?? "all";
    renderStageSelect();
  }
  if (action === "reset-free-battle-filter") {
    state.freeBattleFilter = { query: "", series: "all", terrain: "all", playable: "all", sort: "story" };
    renderFreeBattleSelect();
  }
  if (action === "reset-picker-filter") {
    state.pickerFilter = { query: "", sort: "costAsc" };
    renderFormationPicker(state.picker.kind, state.picker.owner);
  }
  if (action === "reset-choice-filter") {
    state.choiceFilter = { query: "", type: "all", faction: "all", sort: "costDesc" };
    renderChoiceCardSelect();
  }
  if (action === "save-favorite-formation") saveFavoriteFormation();
  if (action === "load-favorite-formation") loadFavoriteFormation();
  if (action === "delete-favorite-formation") deleteFavoriteFormation();
  if (action === "claim-choice-card") {
    claimChoiceCard(button.dataset.cardType, button.dataset.id);
    renderChoiceCardSelect();
  }
  if (action === "grow-character-stat") {
    if (spendCharacterGrowthPoint(button.dataset.characterId, button.dataset.stat)) {
      if (state.screen === "cards") renderCardList();
      else if (state.screen === "picker") renderFormationPicker(state.picker.kind, state.picker.owner);
      else if (state.screen === "choice") renderChoiceCardSelect();
      else renderSetup();
    }
  }
  if (action === "back-setup") renderSetup();
  if (action === "open-picker") renderFormationPicker(button.dataset.pickerKind, button.dataset.owner ?? "");
  if (action === "choose-ms") chooseMobileSuit(button.dataset.id);
  if (action === "choose-battleship") chooseBattleship(button.dataset.id);
  if (action === "choose-character") setCharacterForOwner(button.dataset.owner, button.dataset.id);
  if (action === "clear-character") setCharacterForOwner(button.dataset.owner, "");
  if (action === "reset-save" && confirm("進行状況を初期状態に戻しますか？")) {
    resetCollection();
    renderTitle();
  }
  if (action === "select-stage") {
    state.battleMode = "campaign";
    state.freeBattleEnemy = null;
    state.selectedMapId = button.dataset.mapId;
    state.formation = [];
    initializeSelections();
    if (!restoreRememberedFormation()) applyStarterFormation();
    renderSetup();
  }
  if (action === "select-stage-detail" || action === "select-next-uncleared-stage") {
    if (button.dataset.mapId) state.selectedMapId = button.dataset.mapId;
    renderStageSelect();
  }
  if (action === "select-free-battle-map") {
    const map = lookup().maps[button.dataset.mapId];
    if (!freeBattleMapAvailable(map)) {
      renderFreeBattleSelect();
      return;
    }
    state.battleMode = "free";
    state.freeBattleEnemy = null;
    state.selectedMapId = button.dataset.mapId;
    state.formation = [];
    initializeSelections();
    if (!restoreRememberedFormation()) applyStarterFormation();
    renderSetup();
  }
  if (action === "select-free-battle-detail") {
    if (button.dataset.mapId) state.selectedMapId = button.dataset.mapId;
    renderFreeBattleSelect();
  }
  if (action === "faction") changeFaction(button.dataset.faction);
  if (action === "add") addFormationEntry();
  if (action === "remove") {
    state.formation.splice(Number(button.dataset.index), 1);
    rememberFormation();
    renderSetup();
  }
  if (action === "launch") safeLaunchBattle();
});

battleScreen.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  const cell = event.target.closest(".cell");
  if (button?.dataset.action === "back") renderSetup();
  if (button?.dataset.action === "stage-select") renderStageSelect();
  if (button?.dataset.action === "free-battle-select") renderFreeBattleSelect();
  if (button?.dataset.action === "card-list") renderCardList();
  if (button?.dataset.action === "choice-card") renderChoiceCardSelect();
  if (button?.dataset.action === "finish-deployment") finishDeployment();
  if (button?.dataset.action === "end-turn") endPlayerTurn();
  if (button?.dataset.action === "advance-enemy") advanceEnemyTurn();
  if (button?.dataset.action === "freezy-yard") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) activateFreezyYard(unit);
  }
  if (button?.dataset.action === "mine-scatter") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) useMineScatter(unit, weaponFor(button.dataset.weaponId));
  }
  if (button?.dataset.action === "smoke-skill") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) useSmokeSkill(unit);
  }
  if (button?.dataset.action === "barricade-placement") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) deployBarricade(unit);
  }
  if (button?.dataset.action === "priority-target-designation") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    const target = state.units.find((item) => item.id === state.selectedTargetId);
    if (unit && target) designatePriorityTarget(unit, target);
  }
  if (button?.dataset.action === "emergency-repair") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) useEmergencyRepair(unit);
  }
  if (button?.dataset.action === "active-camo") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) useActiveCamo(unit, weaponFor(button.dataset.weaponId));
  }
  if (button?.dataset.action === "transform-ms") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) transformMobileSuit(unit, button.dataset.msId);
  }
  if (button?.dataset.action === "charge-weapon") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) chargeWeapon(unit, weaponFor(button.dataset.weaponId));
  }
  if (button?.dataset.action === "discard-vehicle") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) discardVehicleOption(unit);
  }
  if (button?.dataset.action === "purge-additional-armor") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) purgeAdditionalArmor(unit);
  }
  if (button?.dataset.action === "attack") {
    const attacker = state.units.find((unit) => unit.id === state.selectedUnitId);
    const defender = state.units.find((unit) => unit.id === state.selectedTargetId);
    if (attacker && defender) attack(attacker, defender, weaponFor(button.dataset.weaponId));
  }
  if (button?.dataset.unitId) {
    const unit = state.units.find((item) => item.id === button.dataset.unitId);
    const selected = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit.side === "player" && (state.phase === "player" || state.phase === "deployment")) {
      state.selectedUnitId = unit.id;
      state.selectedTargetId = null;
    } else if (state.phase === "player" && selected && unit.side !== selected.side) {
      state.selectedTargetId = unit.id;
    }
    renderBattle();
  } else if (cell && state.selectedUnitId) {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (state.phase === "deployment") moveDeploymentUnit(unit, Number(cell.dataset.x), Number(cell.dataset.y));
    else moveUnit(unit, Number(cell.dataset.x), Number(cell.dataset.y));
  }
});

boot();
