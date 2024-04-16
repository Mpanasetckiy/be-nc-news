const db = require("../db/connection");

const fetchUsers = async () => {
  const { rows } = await db.query(`SELECT * FROM users;`);
  return rows;
};

module.exports = { fetchUsers };
