const {
  insertCommentByArticleId,
  selectCommentsByArticleId,
} = require("../models/comments");

exports.postCommentByArticleId = (req, res, next) => {
  insertCommentByArticleId(req.params, req.body)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  selectCommentsByArticleId(req.params, req.query)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
