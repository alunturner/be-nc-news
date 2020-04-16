const articlesRouter = require("express").Router();
const { getArticleById, patchArticleById } = require("../controllers/articles");
const { invalidMethodController } = require("../errors");
const commentsRouter = require("./comments");

articlesRouter.use("/:article_id/comments", commentsRouter);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(invalidMethodController);

module.exports = articlesRouter;
