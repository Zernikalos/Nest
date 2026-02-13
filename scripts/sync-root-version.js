"use strict";

const path = require("path");
const fs = require("fs");

const rootDir = path.resolve(__dirname, "..");
const lernaPath = path.join(rootDir, "lerna.json");
const packagePath = path.join(rootDir, "package.json");

const lerna = JSON.parse(fs.readFileSync(lernaPath, "utf8"));
const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));

if (pkg.version === lerna.version) {
  console.log(`Root package.json already at ${lerna.version}`);
  process.exit(0);
}

pkg.version = lerna.version;
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
console.log(`Synced root package.json version to ${lerna.version}`);
