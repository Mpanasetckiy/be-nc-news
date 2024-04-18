const db = require("../db/connection");

const checkCommentExists = async (id) => {
  const { rows } = await db.query(
    `SELECT * FROM comments
  WHERE comment_id = $1`,
    [id]
  );
  if (!rows.length) {
    return Promise.reject({ status: 404, message: "No data found" });
  }
};

const deleteComment = async (comment_id) => {
  const { rowCount } = await db.query(
    `DELETE FROM comments
    WHERE comment_id = $1`,
    [comment_id]
  );
  if (!rowCount) {
    return Promise.reject({ status: 404, message: "No data found" });
  }
};

const patchComment = async (id, body) => {
  const { inc_votes } = body;

  await checkCommentExists(id);

  const { rows } = await db.query(
    `UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *`,
    [inc_votes, id]
  );
  return rows[0];
};

module.exports = { deleteComment, patchComment };
