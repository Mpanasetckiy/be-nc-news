const db = require("../db/connection");

const fetchUsers = async () => {
  const { rows } = await db.query(`SELECT * FROM users;`);
  return rows;
};

const fetchUserByUsername = async (username) => {
  const { rows } = await db.query(
    `SELECT * FROM users
  WHERE username = $1`,
    [username]
  );
  if (!rows.length) {
    return Promise.reject({ status: 404, message: "No data found" });
  }
  return rows[0];
};

module.exports = { fetchUsers, fetchUserByUsername };
