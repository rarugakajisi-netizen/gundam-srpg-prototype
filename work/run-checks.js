#!/usr/bin/env node
"use strict";

const { spawnSync } = require("node:child_process");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const JS_FILES = [
  "main.js",
  "src/core.js",
  "src/detail-renderers.js",
  "src/setup-flow.js",
  "src/battle-render.js",
  "src/dialogue.js",
  "src/battle-rules.js",
  "src/events.js",
  "work/check-game-data.js",
  "work/check-play-integrity.js",
  "work/package-release.js",
  "distribution/plicy/plicy.js"
];

function runNode(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: false
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function runSyntaxChecks() {
  for (const file of JS_FILES) runNode(["--check", file]);
}

function main() {
  runSyntaxChecks();
  runNode(["work/check-game-data.js"]);
  runNode(["work/check-play-integrity.js"]);
}

main();
