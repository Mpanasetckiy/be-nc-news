const db = require("../db/connection");

const fetchTopics = async () => {
  const { rows } = await db.query("SELECT * FROM topics;");

  if (!rows.length) {
    return Promise.reject({ status: 404, message: "No data found" });
  }

  return rows;
};

module.exports = { fetchTopics };
