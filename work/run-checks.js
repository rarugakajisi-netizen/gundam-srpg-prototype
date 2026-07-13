#!/usr/bin/env node
"use strict";

const { spawnSync } = require("node:child_process");
const { PROJECT_ROOT: ROOT, SYNTAX_CHECK_FILES } = require("./project-files");

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
  for (const file of SYNTAX_CHECK_FILES) runNode(["--check", file]);
}

function main() {
  const args = process.argv.slice(2);
  const syntaxOnly = args.includes("--syntax-only");
  const unknown = args.filter((arg) => arg !== "--syntax-only");
  if (unknown.length > 0) throw new Error(`Unknown argument: ${unknown.join(", ")}`);
  runSyntaxChecks();
  if (syntaxOnly) return;
  runNode(["work/check-game-data.js"]);
  runNode(["work/check-play-integrity.js"]);
}

main();
