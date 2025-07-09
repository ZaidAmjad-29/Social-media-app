const express = require("express");
const jwtFilter = require("../middlewares/requestFilter");
const {
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  rejectRequest,
} = require("../controllers/friendsController");

const router = express.Router();

router.post("/send-request/:userId", jwtFilter.checkRequest, sendFriendRequest);
router.post(
  "/accept-request/:userId",
  jwtFilter.checkRequest,
  acceptFriendRequest
);
router.delete("/cancel-request/:userId", jwtFilter.checkRequest, rejectRequest);

router.delete("/remove-friend/:userId", jwtFilter.checkRequest, removeFriend);
module.exports = router;
