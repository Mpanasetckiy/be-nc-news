const express = require("express");
const app = express();

const routes = require("./middleware/routes");

const {
  errorHandling,
  pgErrorHandling,
} = require("./middleware/error-handling");

app.use(express.json());

app.use("/api", routes);

app.use(pgErrorHandling);

app.use(errorHandling);

module.exports = app;
