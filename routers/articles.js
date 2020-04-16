const articlesRouter = require("express").Router();
const { getArticleById, patchArticleById } = require("../controllers/articles");
const { invalidMethodController } = require("../errors");
const { postCommentByArticleId } = require("../controllers/comments");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(invalidMethodController);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .all(invalidMethodController);

module.exports = articlesRouter;
