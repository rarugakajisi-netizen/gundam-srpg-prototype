#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { loadGameData } = require("./load-game-data");
const { projectPath } = require("./project-files");

const SOURCE_SIZE = 512;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const GROUPS = [
  {
    type: "mobileSuits",
    label: "機体",
    directory: "assets/card-images/mobile-suits",
    imageKey: (item) => item.imageId ?? item.id
  },
  {
    type: "characters",
    label: "キャラ",
    directory: "assets/card-images/characters",
    imageKey: (item) => item.imageId ?? item.characterKey ?? item.id
  },
  {
    type: "battleships",
    label: "戦艦",
    directory: "assets/card-images/battleships",
    imageKey: (item) => item.imageId ?? item.id
  }
];

function pngDimensions(filePath) {
  const header = fs.readFileSync(filePath).subarray(0, 24);
  if (header.length < 24 || !header.subarray(0, 8).equals(PNG_SIGNATURE) || header.toString("ascii", 12, 16) !== "IHDR") {
    throw new Error("PNG形式として読み取れません");
  }
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

function main() {
  const data = loadGameData();
  const errors = [];
  const summaries = [];

  for (const group of GROUPS) {
    const directory = projectPath(group.directory);
    const expectedKeys = new Set((data[group.type] ?? []).map(group.imageKey).filter(Boolean).map(String));
    const manifestKeys = (data.cardImages?.[group.type] ?? []).map(String);
    const manifestKeySet = new Set(manifestKeys);
    const entries = fs.existsSync(directory) ? fs.readdirSync(directory, { withFileTypes: true }) : [];
    const imageFiles = entries.filter((entry) => entry.isFile() && entry.name !== ".gitkeep");
    const imageKeySet = new Set(imageFiles.map((entry) => path.basename(entry.name, path.extname(entry.name))));

    if (manifestKeySet.size !== manifestKeys.length) errors.push(`[${group.label}] data/card-images.jsの画像キーが重複しています。`);
    for (const key of manifestKeySet) {
      if (!expectedKeys.has(key)) errors.push(`[${group.label}:${key}] 対応する内部ID、characterKey、imageIdがありません。`);
      if (!imageKeySet.has(key)) errors.push(`[${group.label}:${key}] 一覧へ登録されていますがPNGファイルがありません。`);
    }

    for (const entry of imageFiles) {
      const extension = path.extname(entry.name).toLowerCase();
      const key = path.basename(entry.name, extension);
      const scope = `${group.label}:${entry.name}`;
      if (extension !== ".png") {
        errors.push(`[${scope}] 画像はPNG形式に統一してください。`);
        continue;
      }
      if (!expectedKeys.has(key)) errors.push(`[${scope}] 対応する内部ID、characterKey、imageIdがありません。`);
      if (!manifestKeySet.has(key)) errors.push(`[${scope}] data/card-images.jsの一覧へ画像キーを追加してください。`);
      try {
        const { width, height } = pngDimensions(path.join(directory, entry.name));
        if (width !== SOURCE_SIZE || height !== SOURCE_SIZE) {
          errors.push(`[${scope}] ${width}x${height}です。${SOURCE_SIZE}x${SOURCE_SIZE}に統一してください。`);
        }
      } catch (error) {
        errors.push(`[${scope}] ${error.message}`);
      }
    }
    summaries.push(`${group.label} ${imageFiles.length} / ${expectedKeys.size}`);
  }

  console.log(`Card image check: ${summaries.join(" / ")}`);
  console.log(`Errors: ${errors.length}`);
  errors.forEach((error) => console.error(`- ${error}`));
  if (errors.length > 0) process.exitCode = 1;
  else console.log(`OK: registered card images are ${SOURCE_SIZE}x${SOURCE_SIZE} PNG files with valid keys.`);
}

main();
