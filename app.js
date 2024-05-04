const express = require("express");
const app = express();
const cors = require("cors");

const {
  errorHandling,
  pgErrorHandling,
} = require("./middleware/error-handling");

const { getEndpoints } = require("./controllers/api.controller");

const topicsRoutes = require("./routes/topics.routes");
const usersRoutes = require("./routes/users.routes");
const articlesRoutes = require("./routes/articles.routes");
const commentsRoutes = require("./routes/comments.routes");

app.use(cors());

app.use(express.json());

app.get("/api", getEndpoints);

app.use("/api", usersRoutes);
app.use("/api", topicsRoutes);
app.use("/api", articlesRoutes);
app.use("/api", commentsRoutes);

app.use(pgErrorHandling);

app.use(errorHandling);

module.exports = app;
