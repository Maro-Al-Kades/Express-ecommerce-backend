const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");
const User = require("../models/user.model.js");

/**
 * @desc   Register
 * @route  GET /api/v1/auth/register
 * @access Public
 */
exports.Register = asyncHandler(async (req, res, next) => {
  // 1.create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 1.generate JWT
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  res.status(201).json({ data: user, token });
});
