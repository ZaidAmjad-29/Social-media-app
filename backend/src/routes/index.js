// module imports
const express = require("express");

// file imports
const userRoutes = require("./userRoutes");
const teamRoutes = require("./teamRoutes");

const router = express.Router();

router.use(userRoutes);
router.use(teamRoutes);

module.exports = router;
