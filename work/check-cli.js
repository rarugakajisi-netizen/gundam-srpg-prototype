"use strict";

function formatIssues(title, issues) {
  if (issues.length === 0) return `${title}: 0`;
  return [
    `${title}: ${issues.length}`,
    ...issues.map((issue) => `- [${issue.scope}] ${issue.message}`)
  ].join("\n");
}

function parseCheckArgs(args) {
  const parsed = { json: false, warningsAsErrors: false, help: false };
  for (const arg of args) {
    if (arg === "--json") parsed.json = true;
    else if (arg === "--warnings-as-errors") parsed.warningsAsErrors = true;
    else if (arg === "--help") parsed.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return parsed;
}

module.exports = {
  formatIssues,
  parseCheckArgs
};
