// Modules
const express = require("express");
const BookResources = express.Router();
const jwt = require("jsonwebtoken");

//Controllers
const { BookControllers } = require("../controllers");

//Middleware
const { check } = require("express-validator");

///Custom Middleware to check input data types
const validateInput = (req, res, next) => {
  const { body } = req;
  let errorArray = [];

  if (typeof body.title !== "string") {
    errorArray.push({
      message: "Ups! title should be a string!",
    });
  }
  if (typeof body.author !== "string") {
    errorArray.push({
      message: "Ups! author should be a string!",
    });
  }
  if (typeof body.summary !== "string") {
    errorArray.push({
      message: "Ups! summary should be a string!",
    });
  }
  if (typeof body.genre !== "string") {
    errorArray.push({
      message: "Ups! genre should be a string!",
    });
  }
  if (typeof body.year !== "number") {
    errorArray.push({
      message: "Ups! year should be a number!",
    });
  }
  if (typeof body.publisher !== "string") {
    errorArray.push({
      message: "Ups! publisher should be a string!",
    });
  }

  if (errorArray.length === 0) {
    return next();
  } else {
    return res.status(400).json({
      error: errorArray.map((element) => {
        return element.message;
      }),
    });
  }
};

///Third Party Middleware - Express Validator
const checkBook = [
  check("title", "title should be at least 2 characters long")
    .isLength({ min: 2 })
    .trim(),
  check("author", "author should be at least 2 characters long")
    .isLength({ min: 2 })
    .trim(),
  check("year", "year should be less or equal than current year").isInt({
    max: new Date().getFullYear(),
  }),
];

const validateBook = (req, res, next) => {
  const { validationResult } = require("express-validator");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array().map((element) => {
        return element.msg;
      }),
    });
  }
  return next();
};

//Middleware to authenticate the user
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
}

//All book resources
BookResources.get("/", BookControllers.getAllBooks);
BookResources.get("/:id", BookControllers.getBookById);
BookResources.post(
  "/",
  authenticateToken,
  validateInput,
  checkBook,
  validateBook,
  BookControllers.createBook
);
BookResources.put(
  "/:id",
  authenticateToken,
  validateInput,
  checkBook,
  validateBook,
  BookControllers.updateBook
);
BookResources.delete("/:id", authenticateToken, BookControllers.deleteBook);

module.exports = BookResources;
