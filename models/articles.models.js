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

module.exports = { fetchArticleById };
