const db = require("../db/connection");

const fetchTopics = async () => {
  const { rows } = await db.query("SELECT * FROM topics;");

  if (!rows.length) {
    return Promise.reject({ status: 404, message: "No data found" });
  }

  return rows;
};

const insertTopic = async (topic) => {
  const { slug, description = "" } = topic;
  const { rows } = await db.query(
    `INSERT INTO topics
  (slug, description)
  VALUES ($1, $2)
  RETURNING *`,
    [slug, description]
  );
  return rows[0];
};

module.exports = { fetchTopics, insertTopic };
