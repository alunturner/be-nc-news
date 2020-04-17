const ENV = process.env.NODE_ENV || "development";

const development = require("./development-data");
const test = require("./test-data");
const production = require("./development-data");

const toExport = { development, test, production };

module.exports = toExport[ENV];
