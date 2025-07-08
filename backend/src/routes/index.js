// module imports
const express = require("express");

// file imports
const userRoutes = require("./userRoutes");


const router = express.Router();

router.use(userRoutes);


module.exports = router;
