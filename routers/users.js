const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users");
const { invalidMethodController } = require("../errors");

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(invalidMethodController);

module.exports = usersRouter;
