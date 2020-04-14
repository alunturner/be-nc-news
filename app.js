const app = require("express")();
const apiRouter = require("./routers/api");
const { invalidPathRouter, handle500s } = require("./errors");

app.use("/api", apiRouter);
app.use("/*", invalidPathRouter);

app.use(handle500s);

module.exports = app;
