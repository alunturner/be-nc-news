const commentsRouter = require("express").Router();
const { postCommentByArticleId } = require("../controllers/comments");

commentsRouter.route("/").post(postCommentByArticleId);

module.exports = commentsRouter;
