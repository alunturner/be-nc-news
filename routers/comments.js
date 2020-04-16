const commentsRouter = require("express").Router();
const { patchCommentById } = require("../controllers/comments");
const { invalidMethodController } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .all(invalidMethodController);

module.exports = commentsRouter;
