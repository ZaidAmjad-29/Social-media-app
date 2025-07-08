const express = require("express");
const jwtFilter = require("../middlewares/requestFilter");
const postController = require("../controllers/postController");
const upload = require("../utils/multer");

const router = express.Router();

router.post(
  "/post",
  jwtFilter.checkRequest,
  upload.single("imageUrl"),
  postController.createPost
);
router.get("/posts", jwtFilter.checkRequest, postController.getAllPosts);
router.delete("/post/:id", jwtFilter.checkRequest, postController.deletePost);

module.exports = router;
