// invalid path controllers
exports.invalidPathRouter = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};

// error handling middleware
