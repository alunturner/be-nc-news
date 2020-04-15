exports.invalidPathRouter = (req, res, next) => {
  res.status(404).send({ msg: "invalid path" });
};

exports.invalidMethodController = (req, res, next) => {
  res.status(405).send({ msg: "invalid method" });
};

// error handling middleware
exports.handleCustoms = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};
exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
};
