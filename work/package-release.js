"use strict";

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const packageJson = require("../package.json");
const { BROWSER_SCRIPT_FILES } = require("./project-files");

const projectRoot = path.resolve(__dirname, "..");
const distRoot = path.resolve(projectRoot, "dist");
const targetArgumentIndex = process.argv.indexOf("--target");
const target = targetArgumentIndex >= 0 ? process.argv[targetArgumentIndex + 1] : "standard";
if (!["standard", "plicy"].includes(target)) {
  throw new Error(`Unknown release target: ${target}`);
}
const plicyBuild = target === "plicy";
const releaseName = `gundam-srpg-prototype${plicyBuild ? "-plicy" : ""}-${packageJson.version}`;
const releaseRoot = path.resolve(distRoot, releaseName);
const zipPath = path.resolve(distRoot, `${releaseName}.zip`);

const releaseEntries = [
  "index.html",
  "styles.css",
  "assets",
  ...BROWSER_SCRIPT_FILES
];

function assertInside(parent, target) {
  const relative = path.relative(parent, target);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Unsafe output path: ${target}`);
  }
}

function copyEntry(relativePath) {
  const source = path.resolve(projectRoot, relativePath);
  const destination = path.resolve(releaseRoot, relativePath);
  if (!fs.existsSync(source)) throw new Error(`Release entry is missing: ${relativePath}`);
  assertInside(releaseRoot, destination);
  fs.cpSync(source, destination, { recursive: true });
}

function copyStandardDistributionFiles() {
  copyEntry("README.md");
  const sourceRoot = path.resolve(projectRoot, "distribution");
  for (const entry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const source = path.resolve(sourceRoot, entry.name);
    const destination = path.resolve(releaseRoot, entry.name);
    assertInside(releaseRoot, destination);
    fs.cpSync(source, destination, { recursive: true });
  }
}

function applyPlicyOverrides() {
  const sourceRoot = path.resolve(projectRoot, "distribution", "plicy");
  for (const entry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const source = path.resolve(sourceRoot, entry.name);
    const destination = path.resolve(releaseRoot, entry.name);
    assertInside(releaseRoot, destination);
    fs.cpSync(source, destination);
  }

  const indexPath = path.resolve(releaseRoot, "index.html");
  let html = fs.readFileSync(indexPath, "utf8");
  html = html.replace("<body>", '<body class="plicy-build">');
  html = html.replace("</head>", '    <link rel="stylesheet" href="./plicy.css" />\n  </head>');
  html = html.replace("</body>", '    <script src="./plicy.js"></script>\n  </body>');
  fs.writeFileSync(indexPath, html);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosTimestamp(date) {
  const year = Math.max(1980, date.getFullYear());
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const day = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, day };
}

function releaseFiles(root, current = root) {
  return fs.readdirSync(current, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, "ja"))
    .flatMap((entry) => {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) return releaseFiles(root, absolute);
      return [{
        absolute,
        relative: path.relative(root, absolute).split(path.sep).join("/")
      }];
    });
}

function makeZip(sourceRoot, destination) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of releaseFiles(sourceRoot)) {
    const input = fs.readFileSync(file.absolute);
    const compressed = zlib.deflateRawSync(input, { level: 9 });
    const name = Buffer.from(file.relative, "utf8");
    const checksum = crc32(input);
    const modified = dosTimestamp(fs.statSync(file.absolute).mtime);
    const flags = 0x0800;
    const method = 8;

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(flags, 6);
    localHeader.writeUInt16LE(method, 8);
    localHeader.writeUInt16LE(modified.time, 10);
    localHeader.writeUInt16LE(modified.day, 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(input.length, 22);
    localHeader.writeUInt16LE(name.length, 26);
    localHeader.writeUInt16LE(0, 28);
    localParts.push(localHeader, name, compressed);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(flags, 8);
    centralHeader.writeUInt16LE(method, 10);
    centralHeader.writeUInt16LE(modified.time, 12);
    centralHeader.writeUInt16LE(modified.day, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(input.length, 24);
    centralHeader.writeUInt16LE(name.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    centralParts.push(centralHeader, name);

    offset += localHeader.length + name.length + compressed.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  const fileCount = centralParts.length / 2;
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(fileCount, 8);
  end.writeUInt16LE(fileCount, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);

  fs.writeFileSync(destination, Buffer.concat([...localParts, centralDirectory, end]));
}

assertInside(projectRoot, distRoot);
assertInside(distRoot, releaseRoot);
assertInside(distRoot, zipPath);
fs.mkdirSync(distRoot, { recursive: true });
fs.rmSync(releaseRoot, { recursive: true, force: true });
fs.rmSync(zipPath, { force: true });
fs.mkdirSync(releaseRoot, { recursive: true });
for (const entry of releaseEntries) copyEntry(entry);
if (plicyBuild) applyPlicyOverrides();
else copyStandardDistributionFiles();
makeZip(releaseRoot, zipPath);

const relativeZip = path.relative(projectRoot, zipPath);
const sizeMiB = (fs.statSync(zipPath).size / 1024 / 1024).toFixed(2);
console.log(`Release target: ${target}`);
console.log(`Release folder: ${path.relative(projectRoot, releaseRoot)}`);
console.log(`Release archive: ${relativeZip} (${sizeMiB} MiB)`);
