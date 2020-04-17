const articlesRouter = require("express").Router();

const {
  getAllArticles,
  getArticleById,
  patchArticleById,
} = require("../controllers/articles");
const {
  postCommentByArticleId,
  getCommentsByArticleId,
} = require("../controllers/comments");
const { invalidMethodController } = require("../errors");

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
