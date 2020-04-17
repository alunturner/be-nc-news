const {
  selectAllArticles,
  selectArticleById,
  updateArticleById,
  selectTotalCount,
} = require("../models/articles");

exports.getAllArticles = (req, res, next) => {
  const promises = [selectAllArticles(req.query), selectTotalCount()];

  Promise.all(promises)
    .then((returnedPromises) => {
      const [articles, [{ total_count }]] = returnedPromises;
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  selectArticleById(req.params)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  updateArticleById(req.params, req.body)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
