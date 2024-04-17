const express = require("express");
const router = express.Router();

const { removeComment } = require("../controllers/comments.controllers");

router.delete("/comments/:comment_id", removeComment);

module.exports = router;
