const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  postCommentByArticleId,
} = require("../controllers/articles");
const { invalidMethodController } = require("../errors");

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
