const fs = require("fs");
const path = require("path");
const package = require("../package.json");

const version = package.version;

fs.writeFileSync(path.resolve("./src/version.json"), JSON.stringify({ version }));