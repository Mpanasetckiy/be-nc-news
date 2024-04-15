const express = require("express");
const app = express();

const routes = require("./middleware/routes");

const { errorHandling } = require("./middleware/error-handling");

app.use("/api", routes);

app.use(errorHandling);

module.exports = app;
