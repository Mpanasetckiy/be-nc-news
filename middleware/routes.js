const express = require("express");
const router = express.Router();

const { getEndpoints } = require("../controllers/api.controller");

const { getTopics } = require("../controllers/topics.controllers");

const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
} = require("../controllers/articles.controllers");

router.get("/", getEndpoints);

// TOPICS
router.get("/topics", getTopics);

// ARTICLES
router.get("/articles", getArticles);

router.get("/articles/:article_id", getArticleById);

router.get("/articles/:article_id/comments", getCommentsByArticleId);

module.exports = router;
