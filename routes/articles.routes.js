const express = require("express");
const router = express.Router();

const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  addComment,
  patchArticle,
  createArticle,
} = require("../controllers/articles.controllers");

router.get("/articles", getArticles);

router.get("/articles/:article_id", getArticleById);

router.get("/articles/:article_id/comments", getCommentsByArticleId);

router.post("/articles/:article_id/comments", addComment);

router.patch("/articles/:article_id", patchArticle);

router.post("/articles/", createArticle);

module.exports = router;
