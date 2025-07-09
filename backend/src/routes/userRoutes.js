const express = require("express");
const jwtFilter = require("../middlewares/requestFilter");


const {
  register,
  login,
  getAllUsers,
  forgotPassword,
  resetPassword,
  updatePassword,
  getMe,
} = require("../controllers/authController");

const upload = require("../utils/multer");

// variable initializations
const router = express.Router();

router.route("/users").get(jwtFilter.checkRequest, getAllUsers);

router.route("/user/register").post(upload.single("profileImage"), register);

router.route("/user/login").post(login);

router.route("/user/forgot-password").post(forgotPassword);

router.route("/user/reset-password/:token").patch(resetPassword);

router
  .route("/user/update-password")
  .patch(jwtFilter.checkRequest, updatePassword);

router.get("/user/me", jwtFilter.checkRequest, getMe);

module.exports = router;
