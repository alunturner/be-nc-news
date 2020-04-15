const { selectUserByUsername } = require("../models/users");

exports.getUserByUsername = (req, res, next) => {
  selectUserByUsername(req.params)
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
