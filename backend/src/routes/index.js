// module imports
const express = require("express");

// file imports
const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");

const router = express.Router();

router.use(userRoutes);
router.use(postRoutes);

module.exports = router;
