const app = require("express")();
const apiRouter = require("./routers/api");
const { invalidPathRouter, handleCustoms, handle500s } = require("./errors");

app.use("/api", apiRouter);
app.use("/*", invalidPathRouter);

app.use(handleCustoms);
app.use(handle500s);

module.exports = app;
