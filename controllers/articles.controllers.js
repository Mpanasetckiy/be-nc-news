const {
  fetchArticleById,
  fetchArticles,
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

module.exports = { getArticleById, getArticles };
