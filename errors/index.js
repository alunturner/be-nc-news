exports.invalidPathRouter = (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
};

exports.invalidMethodController = (req, res, next) => {
  res.status(405).send({ msg: "invalid method" });
};

// error handling middleware
exports.handle400s = (err, req, res, next) => {
  const codes = {
    //first hit by /articles/:article_id, parameter not a number
    "22P02": { status: 400, msg: "bad request" },
    "23502": { status: 400, msg: "bad request" },
    "23503": { status: 404, msg: "value not found" },
  };
  if (err.code in codes) {
    const { status, msg } = codes[err.code];
    res.status(status).send({ msg });
  } else next(err);
};
exports.handleCustoms = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};
exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
};
