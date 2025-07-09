const express = require("express");
const jwtFilter = require("../middlewares/requestFilter");
const commentController = require("../controllers/commentController");

const router = express.Router();

router.post(
  "/comments/:postId",
  jwtFilter.checkRequest,
  commentController.addComment
);
router.get(
  "/comments/:postId",
  jwtFilter.checkRequest,
  commentController.getComments
);

router.post(
  "/comments/like/:commentId",
  jwtFilter.checkRequest,
  commentController.likeComment
);

router.delete(
  "/comments/:commentId",
  jwtFilter.checkRequest,
  commentController.deleteComment
);

module.exports = router;
