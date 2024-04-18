const { deleteComment, patchComment } = require("../models/comments.models");

const removeComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    await deleteComment(comment_id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const body = req.body;
    const updatedComment = await patchComment(comment_id, body);
    res.status(200).send({ updatedComment });
  } catch (error) {
    next(error);
  }
};

module.exports = { removeComment, updateComment };
