const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const ApiError = require("../errors/apiError");
const User = require("../models/user.model.js");
const generateToken = require("../utils/generateJWT.js");

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
  const token = generateToken(user._id);

  res.status(201).json({ data: user, token });
});

/**
 * @desc   Login
 * @route  GET /api/v1/auth/login
 * @access Public
 */
exports.Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password"); // تأكد أن الحقل غير مخفي

  if (!user || !user.password) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});
