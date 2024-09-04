const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");

exports.register = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user) {
    return res.status(400).json({
      message: "Already have an user!",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    username,
    password: hashedPassword,
  });

  res.status(200).json({
    message: "User registered successfully",
    newUser,
  });
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user)
    return res.json({
      message: "Not found! Kindly register.",
    });

  const isValidPassowrd = await bcrypt.compare(password, user.password);

  if (!isValidPassowrd)
    return res.status(401).json({
      message: "Username or password is incorrect!",
    });

  const token = await jwt.sign({ id: user._id }, "secret");

  res.status(200).json({
    token,
    userId: user._id,
  });
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "secret", (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
