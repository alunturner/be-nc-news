const { generateAllPaths } = require("../models/paths");

exports.getAllPaths = (req, res, next) => {
  const paths = generateAllPaths();
  res.status(200).send(JSON.stringify(paths));
};
