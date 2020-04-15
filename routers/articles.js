const articlesRouter = require("express").Router();
const { getArticleById } = require("../controllers/articles");
const { invalidMethodController } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .all(invalidMethodController);

module.exports = articlesRouter;
