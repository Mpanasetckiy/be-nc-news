const db = require("../db/connection");

const fetchArticleById = async (id) => {
  const { rows } = await db.query(
    `SELECT * FROM articles
  WHERE article_id = $1`,
    [id]
  );
  if (!rows.length) {
    return Promise.reject({ status: 404, message: "No data found" });
  }
  return rows[0];
};

const fetchArticles = async (queries) => {
  const { sort_by = "created_at", order = "desc" } = queries;

  const acceptedQueries = ["created_at", "asc", "desc"];

  if (!acceptedQueries.includes(sort_by) || !acceptedQueries.includes(order)) {
    return Promise.reject({ status: 400, message: "Bad query value!" });
  }

  let sqlStr = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments)  AS comment_count
  FROM articles
  LEFT JOIN comments ON 
  articles.article_id = comments.article_id
  GROUP BY articles.article_id`;

  sqlStr += ` ORDER BY ${sort_by} ${order};`;

  const { rows } = await db.query(sqlStr);
  if (!rows.length) {
    return Promise.reject({ status: 404, message: "No data found" });
  }
  return rows;
};

const fetchCommentsByArticleId = async (id) => {
  await checkArticleExists(id);

  const { rows } = await db.query(
    `SELECT * FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC;`,
    [id]
  );
  return rows;
};

const checkArticleExists = async (articleId) => {
  const { rows } = await db.query(
    `SELECT * FROM articles
  WHERE article_id = $1`,
    [articleId]
  );
  if (!rows.length) {
    return Promise.reject({ status: 404, message: "No data found" });
  }
};

module.exports = { fetchArticleById, fetchArticles, fetchCommentsByArticleId };
