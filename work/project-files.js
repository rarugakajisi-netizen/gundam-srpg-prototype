"use strict";

const path = require("node:path");

const PROJECT_ROOT = path.resolve(__dirname, "..");

// Browser load order. Data files must be evaluated before the runtime files.
const DATA_FILES = [
  "data/game-data.js",
  "data/card-images.js",
  "data/system/campaign.js",
  "data/rules/skills.js",
  "data/maps/maps.js",
  "data/cards/mobile-suits.js",
  "data/cards/battleships.js",
  "data/cards/weapons.js",
  "data/cards/characters.js",
  "data/cards/options.js",
  "data/rules/compatibility.js"
];

const RUNTIME_FILES = [
  "src/core.js",
  "src/card-images.js",
  "src/detail-renderers.js",
  "src/setup-flow.js",
  "src/battle-render.js",
  "src/dialogue.js",
  "src/battle-rules.js",
  "src/events.js"
];

const TOOL_FILES = [
  "work/project-files.js",
  "work/load-game-data.js",
  "work/game-data-helpers.js",
  "work/check-cli.js",
  "work/check-game-data.js",
  "work/check-play-integrity.js",
  "work/check-enemy-ai.js",
  "work/check-recon.js",
  "work/check-barricade.js",
  "work/check-priority-target.js",
  "work/check-precision-repair.js",
  "work/check-formations.js",
  "work/check-card-images.js",
  "work/card-balance-report.js",
  "work/package-release.js",
  "work/run-checks.js",
  "distribution/plicy/plicy.js"
];

const BROWSER_SCRIPT_FILES = [...DATA_FILES, ...RUNTIME_FILES];
const SYNTAX_CHECK_FILES = [...BROWSER_SCRIPT_FILES, ...TOOL_FILES];

function projectPath(relativePath) {
  return path.join(PROJECT_ROOT, ...relativePath.split("/"));
}

module.exports = {
  PROJECT_ROOT,
  DATA_FILES,
  RUNTIME_FILES,
  BROWSER_SCRIPT_FILES,
  SYNTAX_CHECK_FILES,
  projectPath
};
