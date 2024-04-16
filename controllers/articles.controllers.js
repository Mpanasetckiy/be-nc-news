const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  createComment,
  updateArticle,
} = require("../models/articles.models");

const getArticleById = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const article = await fetchArticleById(article_id);

    res.status(200).send({ article });
  } catch (error) {
    next(error);
  }
};

const getArticles = async (req, res, next) => {
  try {
    const allQueries = req.query;
    const articles = await fetchArticles(allQueries);

    res.status(200).send({ articles });
  } catch (error) {
    next(error);
  }
};

const getCommentsByArticleId = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const comments = await fetchCommentsByArticleId(article_id);
    res.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const body = req.body;
    const newComment = await createComment(article_id, body);
    res.status(201).send({ newComment });
  } catch (error) {
    next(error);
  }
};

const patchArticle = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { inc_vote } = req.body;
    const article = await updateArticle(article_id, inc_vote);
    res.status(200).send({ article });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArticleById,
  getArticles,
  fetchCommentsByArticleId,
  getCommentsByArticleId,
  addComment,
  patchArticle,
};
