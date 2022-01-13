const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Models
const User = require("../models/User");

// Get all users
const getAllUsers = async (req, res) => {
  const users = await User.find({});

  try {
    if (users.length !== 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ Error: "There are no Users right now!" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get user by id
const getUserById = async (req, res) => {
  const { params } = req;
  try {
    const user = await User.findOne({ id: params.id });
    if (user !== null) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ Error: "User not found" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Add new user
const createUser = async (req, res) => {
  const { body } = req;

  const users = await User.find({});
  let newUser;
  const hashedPassword = await bcrypt.hash(body.password, 10);

  if (users.length === 0) {
    newUser = new User({
      id: 1,
      email: body.email,
      password: hashedPassword,
    });
  } else {
    newUser = new User({
      id: parseInt(users[users.length - 1].id, 10) + 1,
      email: body.email,
      password: hashedPassword,
    });
  }

  try {
    const user = await User.findOne({ id: body.id });
    if (!user) {
      await newUser.save().then(
        () => res.status(201).json(newUser),
        () => {
          res.status(400).json({
            Error: "A User with the same characteristics already exists",
          });
        }
      );
    } else {
      res.status(400).json({
        Error: "A User with the same id already exists",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Login to the server
const loginUser = async (req, res) => {
  const { body } = req;

  //Verificate that the user email is correct
  const user = await User.findOne({
    email: body.email,
  });

  if (!user) {
    res.status(404).json({ Error: "Email not found" });
  } else {
    try {
      if (await bcrypt.compare(body.password, user.password)) {
        //Authenticate User
        const email = req.body.email;
        const password = req.body.password;
        const user = { email: email, password: password };

        const acessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.json({ acessToken: acessToken });
      } else {
        res.status(404).json({ Error: "Password is incorrect" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
};
