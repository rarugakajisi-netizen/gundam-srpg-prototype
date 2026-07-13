"use strict";

const fs = require("node:fs");
const vm = require("node:vm");
const { DATA_FILES, projectPath } = require("./project-files");

const DIALOGUE_FILE = "src/dialogue.js";

function evaluateBrowserScripts(relativePaths) {
  const sandbox = { window: {} };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  for (const relativePath of relativePaths) {
    const absolutePath = projectPath(relativePath);
    if (!fs.existsSync(absolutePath)) throw new Error(`Required browser script is missing: ${relativePath}`);
    vm.runInContext(fs.readFileSync(absolutePath, "utf8"), sandbox, { filename: absolutePath });
  }
  return sandbox;
}

function loadGameData() {
  const sandbox = evaluateBrowserScripts(DATA_FILES);
  if (!sandbox.window.GAME_DATA) throw new Error("window.GAME_DATA was not defined.");
  return sandbox.window.GAME_DATA;
}

function loadDialogueData() {
  const absolutePath = projectPath(DIALOGUE_FILE);
  if (!fs.existsSync(absolutePath)) throw new Error(`Required browser script is missing: ${DIALOGUE_FILE}`);
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  const source = `${fs.readFileSync(absolutePath, "utf8")}\nwindow.__CHARACTER_DIALOGUE__ = characterDialogue;`;
  vm.runInContext(source, sandbox, { filename: absolutePath });
  return sandbox.window.__CHARACTER_DIALOGUE__ ?? {};
}

module.exports = {
  DIALOGUE_FILE,
  loadGameData,
  loadDialogueData
};
