const app = require("express")();
const apiRouter = require("./routers/api");
const { invalidPathRouter } = require("./errors");

app.use("/api", apiRouter);
app.use("/*", invalidPathRouter);

module.exports = app;
