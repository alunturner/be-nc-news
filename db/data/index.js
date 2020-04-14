const ENV = process.env.NODE_ENV || "development";

const development = require("./development-data");
const test = require("./test-data");

const toExport = { development, test };
console.log(toExport[ENV]);

exports.data = toExport[ENV];
