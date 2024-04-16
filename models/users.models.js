const db = require("../db/connection");

const fetchUsers = async () => {
  const { rows } = await db.query(`SELECT * FROM users;`);
  if (!rows.length) {
    return Promise.reject({ status: 404, message: "No data found" });
  }
  return rows;
};

module.exports = { fetchUsers };
