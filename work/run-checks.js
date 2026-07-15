#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { PROJECT_ROOT: ROOT, SYNTAX_CHECK_FILES, projectPath } = require("./project-files");

const JAVASCRIPT_SOURCE_DIRS = ["data", "src", "work", "distribution"];

function javascriptFilesIn(relativeDirectory) {
  const absoluteDirectory = projectPath(relativeDirectory);
  return fs.readdirSync(absoluteDirectory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = `${relativeDirectory}/${entry.name}`;
    if (entry.isDirectory()) return javascriptFilesIn(relativePath);
    return path.extname(entry.name) === ".js" ? [relativePath] : [];
  });
}

function validateProjectFileManifest() {
  const registered = new Set(SYNTAX_CHECK_FILES);
  const discovered = JAVASCRIPT_SOURCE_DIRS.flatMap(javascriptFilesIn);
  const unregistered = discovered.filter((file) => !registered.has(file));
  const missing = SYNTAX_CHECK_FILES.filter((file) => !fs.existsSync(projectPath(file)));
  if (unregistered.length > 0) throw new Error(`Unregistered JavaScript file: ${unregistered.join(", ")}`);
  if (missing.length > 0) throw new Error(`Registered JavaScript file is missing: ${missing.join(", ")}`);
}

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
  validateProjectFileManifest();
  runSyntaxChecks();
  if (syntaxOnly) return;
  runNode(["work/check-game-data.js"]);
  runNode(["work/check-play-integrity.js"]);
  runNode(["work/check-enemy-ai.js"]);
  runNode(["work/check-recon.js"]);
  runNode(["work/check-barricade.js"]);
  runNode(["work/check-priority-target.js"]);
  runNode(["work/check-precision-repair.js"]);
  runNode(["work/check-formations.js"]);
  runNode(["work/check-recommended-formation.js"]);
  runNode(["work/check-free-battle-enemy.js"]);
  runNode(["work/check-last-stand-options.js"]);
  runNode(["work/check-tem-ray-parts.js"]);
  runNode(["work/check-suppressive-fire.js"]);
  runNode(["work/check-card-images.js"]);
}

main();
