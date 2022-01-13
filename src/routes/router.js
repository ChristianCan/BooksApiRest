// Modules
const express = require("express");
const router = express.Router();

// Resources
const { BookResources } = require("../resources");
const { UserResources } = require("../resources");

// All routes
router.use("/books", BookResources);
router.use("/users", UserResources);

module.exports = router;
