"use strict";

// Outcome checks, UI event handlers, and application boot.

function checkOutcome() {
  if (state.outcome) return;
  const playerBattleshipAlive = state.units.some((unit) => unit.side === "player" && isBattleship(unit) && isAlive(unit));
  const enemyBattleshipExists = state.units.some((unit) => unit.side === "enemy" && isBattleship(unit));
  const enemyBattleshipAlive = state.units.some((unit) => unit.side === "enemy" && isBattleship(unit) && isAlive(unit));
  const playerAlive = state.units.some((unit) => unit.side === "player" && isMobileSuit(unit) && isAlive(unit));
  const enemyAlive = state.units.some((unit) => unit.side === "enemy" && isMobileSuit(unit) && isAlive(unit));

  if (!playerBattleshipAlive || !playerAlive) {
    state.outcome = "敗北";
    phaseLabel.textContent = state.outcome;
  } else if ((enemyBattleshipExists && !enemyBattleshipAlive) || !enemyAlive) {
    state.outcome = "勝利";
    state.resultRewards = claimStageRewards(state.selectedMapId);
    phaseLabel.textContent = state.outcome;
  }
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
    state.selectedMapId = event.target.value;
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
  if (event.target.matches('.weapon-list input[type="checkbox"]')) {
    const checked = [...setupScreen.querySelectorAll('.weapon-list input[type="checkbox"]:checked')].map((input) => input.value);
    state.selectedWeaponIds = fitWeaponIdsToSlots(checked, lookup().ms[state.selectedMsId]);
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
  if (action === "card-list") renderCardList();
  if (action === "choice-card") renderChoiceCardSelect();
  if (action === "toggle-card-reveal") {
    state.revealAllCards = !state.revealAllCards;
    renderCardList();
  }
  if (action === "reset-library-filter") {
    state.libraryFilter = { query: "", type: "all", faction: "all", ownership: "all", sort: "name" };
    renderCardList();
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
    state.selectedMapId = button.dataset.mapId;
    state.formation = [];
    initializeSelections();
    if (!restoreRememberedFormation()) applyStarterFormation();
    renderSetup();
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
  if (button?.dataset.action === "smoke-discharger") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) useSmokeDischarger(unit, weaponFor(button.dataset.weaponId));
  }
  if (button?.dataset.action === "smoke-skill") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) useSmokeSkill(unit);
  }
  if (button?.dataset.action === "discard-vehicle") {
    const unit = state.units.find((item) => item.id === state.selectedUnitId);
    if (unit) discardVehicleOption(unit);
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
