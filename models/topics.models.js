const db = require("../db/connection");

const fetchTopics = async () => {
  const { rows } = await db.query("SELECT * FROM topics;");

  if (rows.length === 0) {
    throw new Error("No topics found in the database");
  }

  return rows;
};

module.exports = { fetchTopics };
