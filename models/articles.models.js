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
  const { sort_by = "created_at", order = "desc", topic } = queries;

  const acceptedQueries = ["created_at", "asc", "desc"];

  if (!acceptedQueries.includes(sort_by) || !acceptedQueries.includes(order)) {
    return Promise.reject({ status: 400, message: "Bad query value!" });
  }

  const queryValues = [];

  let sqlStr = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments)  AS comment_count
  FROM articles
  LEFT JOIN comments ON 
  articles.article_id = comments.article_id
  `;

  if (topic) {
    sqlStr += " WHERE topic = $1";
    queryValues.push(topic);
  }

  sqlStr += ` GROUP BY articles.article_id
   ORDER BY ${sort_by} ${order};`;

  const { rows } = await db.query(sqlStr, queryValues);

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

const checkArticleExists = async (id) => {
  const { rows } = await db.query(
    `SELECT * FROM articles
  WHERE article_id = $1`,
    [id]
  );
  if (!rows.length) {
    return Promise.reject({ status: 404, message: "No data found" });
  }
};

const checkUserExists = async (username) => {
  const { rows } = await db.query(
    `SELECT * FROM users
  WHERE username = $1`,
    [username]
  );
  if (!rows.length) {
    return Promise.reject({ status: 404, message: "No data found" });
  }
};

const createComment = async (id, reqBody) => {
  const { username, body } = reqBody;

  await checkArticleExists(id);
  await checkUserExists(username);

  const { rows } = await db.query(
    `INSERT INTO comments
 (author, body, article_id)
 VALUES ($1, $2, $3)
 RETURNING *;`,
    [username, body, id]
  );
  return rows[0];
};

const updateArticle = async (articleId, inc_vote) => {
  await checkArticleExists(articleId);

  const { rows } = await db.query(
    `UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`,
    [inc_vote, articleId]
  );

  return rows[0];
};

module.exports = {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  createComment,
  updateArticle,
};
