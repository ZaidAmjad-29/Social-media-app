const express = require("express");

const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");
const commentRoutes = require("./commentRoutes");
const friendsRoutes = require("./friendsRoutes");

const router = express.Router();

router.use(userRoutes);
router.use(postRoutes);
router.use(commentRoutes);
router.use(friendsRoutes);

module.exports = router;
