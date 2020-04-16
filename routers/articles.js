const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles");
const { invalidMethodController } = require("../errors");
const {
  postCommentByArticleId,
  getCommentsByArticleId,
} = require("../controllers/comments");

articlesRouter.route("/").get(getAllArticles).all(invalidMethodController);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(invalidMethodController);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentByArticleId)
  .get(getCommentsByArticleId)
  .all(invalidMethodController);

module.exports = articlesRouter;
