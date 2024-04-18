const express = require("express");
const router = express.Router();

const {
  removeComment,
  updateComment,
} = require("../controllers/comments.controllers");

router.delete("/comments/:comment_id", removeComment);

router.patch("/comments/:comment_id", updateComment);

module.exports = router;
