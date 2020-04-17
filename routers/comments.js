const commentsRouter = require("express").Router();

const {
  patchCommentById,
  deleteCommentById,
} = require("../controllers/comments");
const { invalidMethodController } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(invalidMethodController);

module.exports = commentsRouter;
