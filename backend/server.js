// module imports
const express = require("express");
const cors = require("cors");

// file imports
require("dotenv").config();
const connectDB = require("./src/config/db");
const apiRoutes = require("./src/routes/index");
const globalErrorHandler = require("./src/controllers/errorController");

// variable initializations
const app = express();
const port = process.env.PORT || 5001;

// connect to MongoDB Database
connectDB();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// mount routes
app.use("/api/v1", apiRoutes);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
