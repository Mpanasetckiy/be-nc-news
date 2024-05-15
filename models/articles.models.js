const db = require("../db/connection");

const fetchArticleById = async (id) => {
  const { rows } = await db.query(
    `SELECT articles.author, title, articles.body, articles.article_id, users.name, users.avatar_url AS author_avatar_url, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments) :: INTEGER  AS comment_count
    FROM articles
    LEFT JOIN comments ON 
    articles.article_id = comments.article_id
    JOIN users ON
    articles.author = users.username
    WHERE articles.article_id = $1
    GROUP BY articles.article_id, users.username;`,
    [id]
  );
  if (!rows.length) {
    return Promise.reject({ status: 404, message: "No data found" });
  }
  return rows[0];
};

const fetchArticles = async (queries) => {
  const {
    sort_by = "created_at",
    order = "desc",
    topic,
    limit = 10,
    p = 1,
  } = queries;

  const acceptedQueries = ["asc", "desc"];
  const acceptedSortQueries = [
    "author",
    "created_at",
    "title",
    "topic",
    "votes",
    "comment_count",
  ];

  if (
    !acceptedSortQueries.includes(sort_by) ||
    !acceptedQueries.includes(order)
  ) {
    return Promise.reject({ status: 400, message: "Bad query value!" });
  }

  const queryValues = [];

  let sqlStr = `SELECT articles.article_id, articles.author, users.avatar_url AS author_avatar_url, title, articles.body, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments) :: INT AS comment_count
  FROM articles
  LEFT JOIN comments ON 
  articles.article_id = comments.article_id
  JOIN users ON
  articles.author = users.username`;

  if (topic) {
    sqlStr += " WHERE topic = $1";
    queryValues.push(topic);
  }

  sqlStr += ` GROUP BY articles.article_id, users.username
   ORDER BY ${sort_by} ${order}`;

  if (!isNaN(limit) && !isNaN(p)) {
    const offset = +limit * +p - 10;
    sqlStr += ` LIMIT ${limit} OFFSET ${offset}`;
  } else {
    return Promise.reject({ status: 400, message: "Bad query value!" });
  }
  const { rows } = await db.query(sqlStr, queryValues);
  return rows;
};

const fetchCommentsByArticleId = async (id, queries) => {
  const { limit = 10, p = 1 } = queries;
  await checkArticleExists(id);

  let sqlStr = `SELECT comment_id, comments.body, comments.article_id, comments.author, users.avatar_url AS author_avatar_url, votes, created_at FROM comments
  JOIN users ON comments.author = users.username
  WHERE article_id = $1
  ORDER BY created_at DESC`;

  if (!isNaN(limit) && !isNaN(p)) {
    const offset = +limit * +p - 10;
    sqlStr += ` LIMIT ${limit} OFFSET ${offset}`;
  } else {
    return Promise.reject({ status: 400, message: "Bad query value!" });
  }

  const { rows } = await db.query(sqlStr, [id]);

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

const createComment = async (id, reqBody) => {
  const { username, body } = reqBody;

  if (typeof body !== "string") {
    return Promise.reject({ status: 400, message: "Bad request" });
  }

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

const insertArticle = async (article) => {
  const defaultArticleUrl =
    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700";

  const {
    title,
    topic,
    author,
    body,
    article_img_url = defaultArticleUrl,
  } = article;
  const { rows } = await db.query(
    `INSERT INTO articles
  (title, topic, author, body, article_img_url)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *`,
    [title, topic, author, body, article_img_url]
  );
  const { article_id } = rows[0];
  const newArticle = await fetchArticleById(article_id);
  return newArticle;
};

const deleteArticle = async (id) => {
  const { rowCount } = await db.query(
    `DELETE FROM articles WHERE article_id = $1`,
    [id]
  );
  if (!rowCount) {
    return Promise.reject({ status: 404, message: "No data found" });
  }
  return rowCount;
};

module.exports = {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  createComment,
  updateArticle,
  insertArticle,
  deleteArticle,
};
