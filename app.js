const express = require("express");
const cors = require("cors");
const app = express();
const apiRouter = require("./routers/api");
const {
  invalidPathRouter,
  handle400s,
  handleCustoms,
  handle500s,
} = require("./errors");

app.use(express.json());
app.use(cors());

app.use("/api", apiRouter);
app.use("/*", invalidPathRouter);

app.use(handle400s);
app.use(handleCustoms);
app.use(handle500s);

module.exports = app;
