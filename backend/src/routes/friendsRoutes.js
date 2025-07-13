// routes/friendsRoutes.js
const express = require("express");
const router = express.Router();
const jwtFilter = require("../middlewares/requestFilter");
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  removeFriend,
  getMe,
  getAllUsers,
} = require("../controllers/friendsController");

router.get("/me", jwtFilter.checkRequest, getMe);
router.get("/users", jwtFilter.checkRequest, getAllUsers);
router.post("/send-request", jwtFilter.checkRequest, sendRequest);
router.post("/accept-request", jwtFilter.checkRequest, acceptRequest);
router.post("/reject-request", jwtFilter.checkRequest, rejectRequest);
router.delete("/remove-friend/:friendId", jwtFilter.checkRequest, removeFriend);

module.exports = router;
