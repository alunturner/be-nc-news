const apiRouter = require("express").Router();
const { getAllPaths } = require("../controllers/paths");
const { invalidMethodController } = require("../errors");
const articlesRouter = require("./articles");
const commentsRouter = require("./comments");
const topicsRouter = require("./topics");
const usersRouter = require("./users");

apiRouter.route("/").get(getAllPaths).all(invalidMethodController);

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
