// Modules
const express = require("express");
const UserResources = express.Router();
// require("dotenv").config();

//Controllers
const { UserControllers } = require("../controllers");

//Middleware
const { check } = require("express-validator");

///Custom Middleware to check input data types
const validateInput = (req, res, next) => {
  const { body } = req;
  let errorArray = [];

  if (typeof body.email !== "string") {
    errorArray.push({
      message: "Ups! email should be a string!",
    });
  }
  if (typeof body.password !== "string") {
    errorArray.push({
      message: "Ups! password should be a string!",
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
const checkUser = [
  check("email", "is not a valid email").isEmail().trim(),
  check("password", "password should be at least 6 characters long")
    .isLength({ min: 6 })
    .trim(),
];

const validateUser = (req, res, next) => {
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

//All user resources
UserResources.get("/", UserControllers.getAllUsers);
UserResources.get("/:id", UserControllers.getUserById);
UserResources.post(
  "/",
  validateInput,
  checkUser,
  validateUser,
  UserControllers.createUser
);
UserResources.post("/login", UserControllers.loginUser);

module.exports = UserResources;
