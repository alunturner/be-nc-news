const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topics");
const { invalidMethodController } = require("../errors");

topicsRouter.route("/").get(getAllTopics).all(invalidMethodController);

module.exports = topicsRouter;
